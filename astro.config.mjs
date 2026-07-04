import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kitrakrev.github.io',
  integrations: [sitemap()],
});
