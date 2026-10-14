import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import data from '../data/data.json';

export const GET: APIRoute = async ({ site }) => {
  const p = data.profile;
  const base = site?.href.replace(/\/$/, '') ?? 'https://kitrakrev.github.io';

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const experience = data.career_experience
    .map((e) => `- ${e.title} @ ${e.company} (${e.duration}): ${e.description}`)
    .join('\n');

  const publications = data.publications
    .map((pub) => `- "${pub.title}" — ${pub.venue} (${pub.year})${pub.pdf ? ` ${pub.pdf}` : ''}`)
    .join('\n');

  const achievements = data.achievements.map((a) => `- ${a.title}`).join('\n');

  const blog = posts
    .map((post) => `- [${post.data.title}](${base}/blog/${post.id}/): ${post.data.excerpt}`)
    .join('\n');

  const body = `# ${p.name}

> ${p.longDescription}

Personal portfolio and blog of ${p.name}, ${p.title} based in ${p.contact.location}. Contact: ${p.contact.email}. GitHub: ${p.links.github}. LinkedIn: ${p.links.linkedin}. Google Scholar: ${p.contact.googleScholar}.

## Pages

- [Overview](${base}/): Profile summary, education, experience, core competencies
- [Software Engineer profile](${base}/sde/): SDE-tailored experience, projects, and skills
- [AI/ML Engineer profile](${base}/datascience/): AI/ML-tailored experience, research, projects, and publications
- [Skills](${base}/skills/): Full technical skill inventory with proficiency levels
- [Blog](${base}/blog/): Technical writing on AI systems
- [Contact](${base}/contact/): Contact details
- [Resume (PDF)](${base}/assets/karthik_F25.pdf): Downloadable resume

## Experience

${experience}

## Publications

${publications}

## Recognition

${achievements}

## Blog Posts

${blog}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
