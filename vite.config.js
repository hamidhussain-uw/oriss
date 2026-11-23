import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { configDefaults } from 'vitest/config';

// `npm run build` → dist/ (normal multi-file build for hosting: cacheable, smaller first load on phones).
// `npm run build:file` → dist-file/index.html, one self-contained file that opens from disk with no server.
export default defineConfig(({ mode }) => ({
  base: './', // relative asset paths, so the site works under GitHub Pages' /oriss/ sub-path
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: mode === 'single' ? { outDir: 'dist-file' } : {},
  test: { environment: 'node', exclude: [...configDefaults.exclude, '_vanilla/**', '_react-v1/**'] },
}));
