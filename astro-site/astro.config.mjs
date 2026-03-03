// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://tuhinmohanta.com',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
