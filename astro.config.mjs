import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import qwikdev from '@qwikdev/astro';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD ? 'https://tns-astro-site-search.netlify.app' : 'http://localhost:4321',
  integrations: [tailwind(), qwikdev(), mdx()],
});
