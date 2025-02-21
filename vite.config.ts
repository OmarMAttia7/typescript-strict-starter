import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss()],
  root: 'src',
  resolve: {
    alias: {
      '~': './',
    },
  },
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/client.ts',
      output: {
        dir: 'dist/client',
      },
    },
  },
  server: {
    cors: {
      origin: 'http://localhost:3000',
    },
  },
});
