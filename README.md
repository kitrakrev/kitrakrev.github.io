# kitrakrev.github.io

Personal portfolio + blog for Karthik Raja Anandan. Fully static, built with [Astro](https://astro.build), deployed to GitHub Pages via GitHub Actions.

## Structure

- `src/data/data.json` — all portfolio content (profile, experience, skills, projects, publications). Edit this to update the site.
- `src/pages/` — pages: `/` (overview), `/sde/`, `/datascience/`, `/skills/`, `/contact/`, `/blog/`
- `src/content/blog/` — blog posts as Markdown
- `src/layouts/Base.astro` — shared nav/footer/head
- `src/components/` — shared blocks (Hero, ExpCard, Education, Achievements, CTA, ViewSwitcher)
- `src/styles/styles.css` — single global stylesheet
- `public/assets/` — resume PDF, profile photo

## Writing a new blog post

Create `src/content/blog/my-post.md`:

```markdown
---
title: "My Post Title"
excerpt: "One-line summary shown on the blog listing."
date: 2026-07-03
readTime: "6 min read"
tags: ["RAG", "Agents"]
---

Post body in Markdown...
```

Push to `active-page` — the GitHub Action builds and deploys automatically. The post appears at `/blog/my-post/`.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview  # preview the built site
```

## Deployment

`.github/workflows/deploy.yml` builds with `withastro/action` and deploys via `actions/deploy-pages` on every push to `active-page`. Repo Settings → Pages → Source must be set to **GitHub Actions**.
