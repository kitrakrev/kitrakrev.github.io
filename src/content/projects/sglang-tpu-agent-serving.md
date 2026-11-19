---
title: "Serving Multi-Turn Agents with SGLang on Cloud TPU v6e (and how it compares to A100/H100)"
excerpt: "Benchmarking SGLang (sgl_jax) on TPU v6e with a multi-turn agent workload: prefix caching, a hybrid linear-attention model where the cache hurts, and an honest TPU vs GPU comparison."
date: 2026-11-18
readTime: "13 min read"
repo: "https://github.com/kitrakrev/sglang-tpu-agentbench"
tags: ["TPU", "SGLang", "LLM Inference", "Agents", "Benchmarking", "TorchTPUSprint"]
---

> **TL;DR**
>
> - On one TPU v6e chip, Qwen2.5-7B with SGLang's radix prefix cache does **1,523 output tok/s at 32 agent sessions vs 930 without it (+64%)**, and TTFT p99 drops **598 → 138 ms**. 87% of prompt tokens come from cache and 100% of requests meet a TTFT < 200 ms / ITL < 25 ms SLO.
> - On a **hybrid linear-attention** model (Qwen3.8-27B, v6e-4), the prefix cache made serving **slower at every concurrency**: cache off reached 968 tok/s vs a ~520 tok/s plateau with it on.
> - Against GPUs on the same workload, **H100 wins on speed (1.65–2x)**; v6e-1 roughly **ties A100 on cost** and has the **best tail latency**.
> - **int8 weights** (sgl_jax built-in, weight-only) make decode **1.84x faster** at c=1 and lift c=32 throughput **1,505 → 2,342 tok/s**.
> - I **ported OLMo 2 and Olmo 3** to sgl_jax: numerically matches HF, decodes at Qwen speed, but prefill is 10–30x slower because the TPU attention kernel has no tuned tiles for 32-KV-head models.
> - Whole study: ~$20 TPU + ~$2 GPU, 15,000+ requests, 0 errors, fully reproducible.

## Why agent workloads are different

Chat benchmarks send one-shot random prompts. Agents don't. Every turn resends the same long system prompt (tool schemas) plus a growing history with each tool result appended. That makes serving speed depend heavily on **prefix-cache reuse**: if the server can skip re-prefilling the shared prefix, time-to-first-token stays flat as sessions grow.

I wanted to know: does SGLang's radix prefix cache deliver that on TPU, and how does TPU compare to GPUs for this pattern?

## Setup

- **Hardware:** Cloud TPU v6e-1 (1 chip, 31.24 GiB HBM) and v6e-4; Modal A100-80GB SXM and H100 SXM for the GPU baseline.
- **Server:** sgl_jax (`sgl-project/sglang-jax`) on TPU; upstream SGLang v0.5.2 on GPU. Shared flags: `--chunked-prefill-size 2048 --mem-fraction-static 0.85 --max-running-requests 128 --enable-cache-report`; cache off = `--disable-radix-cache`.
- **Workload ([agentbench](https://github.com/kitrakrev/sglang-tpu-agentbench), works with any OpenAI-compatible server):** 4 sessions per concurrency level × 6 turns, 600-word shared system prompt, 150-word tool results, 128 max output tokens, temperature 0. Mean prompt ≈ 1,240 tokens.
- **Metrics:** output tok/s, TTFT and ITL percentiles, cached-token %, goodput under an SLO (TTFT < 200 ms and mean ITL < 25 ms per request), $/1M output tokens, and % of the HBM decode roofline.

## Result 1: prefix caching on Qwen2.5-7B, v6e-1

| cache | c | out tok/s | TTFT p50 / p99 ms | ITL p50 ms | cached % | $/1M out (on-demand) |
|---|---|---|---|---|---|---|
| on | 1 | 75 | 30 / 33 | 12.9 | 84.1 | 10.01 |
| on | 8 | 515 | 40 / 65 | 14.5 | 87.7 | 1.46 |
| on | 32 | **1,515** | 42 / **134** | 19.8 | 87.6 | **0.50** |
| off | 1 | 72 | 64 / 81 | 12.9 | 0 | 10.36 |
| off | 8 | 434 | 74 / 187 | 16.9 | 0 | 1.73 |
| off | 32 | 930 | 109 / 598 | 32.4 | 0 | 0.81 |

![Output tok/s, cache on vs off](/projects/sglang-tpu-agent-serving/v6e1-tokps.png)

![TTFT p99](/projects/sglang-tpu-agent-serving/v6e1-ttft-p99.png)

What stands out:

1. **The benefit grows with concurrency:** +4% tok/s at c=1, +63% at c=32. Without the cache, ~1.2k-token prefills compete with decode and inflate ITL (32 vs 20 ms at c=32).
2. **Hit rate is 84–88% from turn 1**, because the system prompt is shared by every session.
3. **Turn-1 TTFT at high concurrency is a queueing effect**, not a cache effect: all sessions start together.

![TTFT by turn](/projects/sglang-tpu-agent-serving/v6e1-ttft-by-turn.png)

### Tuning (Run A)

Pushing concurrency: throughput peaks at **2,755 tok/s at c=96** ($0.27/1M on-demand, ~$0.10 spot) and falls at c=128 as the KV pool starts evicting prefixes (hit rate 88% → 75%, TTFT p50 10×). Under the goodput SLO, **c=32 with page size 128 is the best interactive operating point (1,523 tok/s, 100% SLO)**. Page size 256 lowered the hit rate (81% vs 87%); chunked prefill 512–4096 was flat (±1.5%).

![Run A throughput](/projects/sglang-tpu-agent-serving/runA-tokps.png)

### Where the time goes

Decode is HBM-bound. On v6e-1 the per-token floor is weight bytes / HBM bandwidth = 15.2 GB / 1.64 TB/s ≈ 9.3 ms. Measured ITL is 12.9 ms at c=1 (**73% of roofline**) and 19.8 ms at c=32 (55%). Prefix caching skips prefill FLOPs, not decode KV reads, which is why it cuts TTFT 4.5× but barely moves ITL.

![v6e-1 roofline](/projects/sglang-tpu-agent-serving/v6e1-roofline.png)

## Result 2: when the prefix cache hurts (hybrid linear attention)

Qwen3.8-27B is a hybrid: 48 Gated-DeltaNet (linear-attention) layers + 16 full-attention layers. I served it on v6e-4 with TP=4 (with a merged LoRA adapter).

Getting the cache on at all took work. sgl_jax rejects the plain radix cache for recurrent-state models; it needs `--enable-unified-radix-tree --enable-recurrent-extra-buffer`, and at mem-fraction 0.85 that OOMs at compile. `--mem-fraction-static 0.7 --chunked-prefill-size 1024` works.

| cache | c | out tok/s | TTFT p99 ms | ITL p50 ms | cached % |
|---|---|---|---|---|---|
| off | 1 | 78 | 138 | 12.0 | 0 |
| off | 16 | 655 | 872 | 21.1 | 0 |
| off | 64 | **968** | 3,060 | 55.8 | 0 |
| on | 1 | 36 | 244 | 26.7 | 38.0 |
| on | 16 | 536 | 1,915 | 23.7 | 31.5 |
| on | 64 | 517 | 11,443 | 46.7 | ~0 |

![Run B throughput](/projects/sglang-tpu-agent-serving/runB-tokps.png)

**Cache off wins at every concurrency.** Why:

1. **Hits round down to snapshot boundaries.** A prefix is only reusable where a recurrent-state snapshot exists, so hits land on 1,024-token blocks (the shared system prompt). Hit rate is 32–38% vs 84–88% on the pure-attention model.
2. **Snapshots cost concurrency.** Recurrent-state buffers cut max running requests from 96 to 27, so throughput plateaus at ~520 tok/s and TTFT p99 explodes from queueing.
3. **Extra per-step work:** c=1 ITL doubles (26.7 vs 12.0 ms).

Takeaway: for agent serving on hybrid linear-attention models, the radix cache needs a cheaper recurrent-state checkpoint scheme before it pays off.

## Result 3: TPU v6e-1 vs A100 vs H100

Same workload and flags, Qwen2.5-7B, radix cache on.

| c | device | out tok/s | TTFT p99 ms | ITL p50 ms | SLO % | $/1M out | % roofline |
|---|---|---|---|---|---|---|---|
| 1 | v6e-1 | 75 | 33 | 12.9 | 100 | 10.01 | 73% |
| 1 | A100 | 90 | 51 | 10.3 | 100 | 7.69 | 73% |
| 1 | H100 | **149** | 33 | **6.2** | 100 | 7.34 | 74% |
| 32 | v6e-1 | 1,515 | **134** | 19.8 | **100** | 0.50 | **55%** |
| 32 | A100 | 1,548 | 410 | 18.9 | 96.7 | 0.45 | 46% |
| 32 | H100 | **2,502** | 529 | **11.1** | 96.4 | **0.44** | 48% |
| 96 | v6e-1 | 2,755 | 520 | 30.1 | 7.4 | 0.27 | 46% |
| 96 | A100 | 3,001 | 821 | 26.3 | 5.3 | 0.23 | 43% |
| 96 | H100 | **5,197** | 618 | **13.2** | 31.5 | **0.21** | 52% |

Prices: Modal on-demand A100-80GB $2.50/h, H100 $3.95/h; GCP v6e $2.70/chip-h.

![H100 roofline](/projects/sglang-tpu-agent-serving/h100-roofline.png)

The honest read:

1. **H100 wins outright:** 1.65–2.0× v6e-1 throughput, about half the ITL, and the lowest $/1M at every concurrency despite costing 1.46× per hour.
2. **A100 vs v6e-1 is roughly a tie.** A100 has slightly more tok/s and 10–23% lower $/1M; v6e-1 has clearly better tail TTFT (134 vs 410 ms p99 at c=32) and is the only device at 100% SLO there. With the cache off, v6e-1 beats A100 from c=8 up.
3. **Per HBM byte, all three land in the same place:** ~73% of roofline at c=1. The H100 gap is mostly bandwidth (3.35 vs 1.64 TB/s), not software.
4. **Caveats:** mature SGLang CUDA (CUDA graphs) vs young sgl_jax; page size 1 on GPU vs 128 on TPU; neither server tuned per platform beyond the shared flags.

## Result 4: int8 weights

sgl_jax ships an int8 weight-only config (`--quantization-config-path=int8.yaml`): per-channel int8 weights, bf16 activations and KV, quantized at load. Same v6e-1, same workload, cache on, baseline re-run on the same build:

| c | bf16 tok/s | int8 tok/s | bf16 ITL p50 ms | int8 ITL p50 ms |
|---|---|---|---|---|
| 1 | 74 | **135** | 13.0 | **7.1** |
| 8 | 506 | **875** | 14.7 | **8.5** |
| 32 | 1,505 | **2,342** | 20.1 | **12.9** |

![int8 vs bf16 throughput](/projects/sglang-tpu-agent-serving/int8-tokps.png)

Decode is HBM-bound, so halving weight bytes nearly halves per-token latency, and the freed memory grows the KV pool from 232k to 345k tokens. Cost at c=32 drops from $0.50 to ~$0.32 per 1M output tokens. Caveat: I did not run an accuracy eval on the int8 model, so this is a speed result only.

## Result 5: porting OLMo 2 and Olmo 3 to sgl_jax

sgl_jax didn't support AI2's fully open OLMo models, so I added them ([branch](https://github.com/kitrakrev/sglang-jax/tree/add-olmo3-support)):

- **OLMo 2:** post-sublayer RMSNorm and full-width QK-norm.
- **Olmo 3:** the same block plus 3:1 interleaved sliding-window attention (window 4096) and YaRN RoPE; it plugs into sgl_jax's hybrid SWA KV pool.

Against HF transformers on CPU (tiny random fp32 models, sliding window forced short enough to mask), the worst prompt-logprob difference is 2.9e-6 (OLMo 2) and 1.9e-6 (Olmo 3), with identical greedy tokens. On TPU both served the full agent workload with 0 errors.

| model (v6e-1, cache on) | c=1 TTFT p50 | c=1 ITL p50 | c=32 tok/s |
|---|---|---|---|
| Qwen2.5-7B | 30 ms | 13.0 ms | 1,505 |
| OLMo-2-7B | 219 ms | 13.4 ms | 162 |
| Olmo-3-7B | 124 ms | 13.4 ms | 65 |

Decode matches Qwen, but prefill is 10–30x slower and throughput collapses under load. The server logs show why: OLMo 7B uses full multi-head attention (32 KV heads vs 4 for Qwen). The TPU ragged paged attention kernel has no tuned block sizes for that shape on v6e, and its fallback heuristic picks a query block of 2 (vs 32 for Qwen), so every prefill chunk takes 1–2 seconds. MHA also makes the KV cache 8x larger per token. That's kernel tuning, not model correctness: the next step is adding v6e tile sizes for 32-KV-head attention.

## A note on capacity

I also wanted Qwen2.5-72B on a v6e-8. There was no v6e-8 capacity, spot or on-demand, in any of six zones I tried across two days, and a spot v6e-1 was preempted mid-run. Plan TPU experiments with on-demand fallbacks and expect to retry.

## Cost and reproducibility

The whole study cost about **$20 of TPU time and $2 of GPU time**. The repo has every log, metrics table and chart, plus `REPRODUCE.md` with step-by-step instructions for both TPU (GCP setup, budget kill-switch, VM create/delete, each run) and GPU (Modal).

**Code, logs and reproduce steps:** [github.com/kitrakrev/sglang-tpu-agentbench](https://github.com/kitrakrev/sglang-tpu-agentbench)

## What's next

- v6e-8 with Qwen2.5-72B (no capacity during this sprint).
- Tuned attention tiles for 32-KV-head models (OLMo), then re-run.
- Accuracy eval of int8 weights; int8 KV cache.
- EAGLE3 speculative decoding for agent turns.
- Host-memory KV offload and longer sessions (20+ turns), where per-session history dominates.

*Built for the #TorchTPUSprint.*
