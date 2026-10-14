import data from '../data/data.json';

const USER = 'kitrakrev';
const prettify = (n: string) =>
  n.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const norm = (u: string) => (u || '').toLowerCase().replace(/\/+$/, '');

function categoryFrom(topics: string[]): string {
  const t = topics.map((x) => x.toLowerCase());
  if (t.some((x) => x === 'sde' || x === 'backend')) return 'SDE';
  if (t.some((x) => ['ml', 'ai', 'data-science'].includes(x))) return 'Data Science';
  return 'Both';
}

let cache: any[] | null = null;

export async function getProjects(): Promise<any[]> {
  if (cache) return cache;
  const curated = data.projects as any[];
  const known = new Set(curated.map((p) => norm(p.github)));
  let auto: any[] = [];
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos: any[] = await res.json();
    auto = repos
      .filter((r) => r.has_pages && !r.fork && !r.archived && r.name !== `${USER}.github.io` && !known.has(norm(r.html_url)))
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .map((r) => ({
        title: prettify(r.name),
        description: r.description || '',
        category: categoryFrom(r.topics || []),
        tags: (r.topics || []).slice(0, 5),
        github: r.html_url,
        page: `https://${USER}.github.io/${r.name}/`,
        auto: true,
      }));
    console.log(`[repos] ${repos.length} repos fetched, ${auto.length} auto project(s): ${auto.map((a) => a.title).join(', ') || 'none'}`);
  } catch (e) {
    console.warn(`[repos] falling back to curated projects only: ${(e as Error).message}`);
  }
  cache = [...curated, ...auto];
  return cache;
}
