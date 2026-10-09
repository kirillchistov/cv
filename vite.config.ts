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
      },
    },
  },
});
