import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/cv/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        roadmap: resolve(import.meta.dirname, 'roadmap.html'),
        tailor: resolve(import.meta.dirname, 'tailor.html'),
        // drafts: published only with DRAFTS=1 (see README), never by default
        ...(process.env.DRAFTS === '1'
          ? {
              cases: resolve(import.meta.dirname, 'cases.html'),
              notes: resolve(import.meta.dirname, 'notes.html'),
            }
          : {}),
      },
    },
  },
});
