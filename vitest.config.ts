import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), vue()],
  resolve: {
    alias: {
      '@xiaoli-ui/tokens': path.resolve(import.meta.dirname, 'packages/tokens/src/index.ts'),
      '@xiaoli-ui/theme': path.resolve(import.meta.dirname, 'packages/theme/src/index.ts'),
      '@xiaoli-ui/internal-core': path.resolve(import.meta.dirname, 'packages/internal-core/src/index.ts'),
      '@xiaoli-ui/internal-dom': path.resolve(import.meta.dirname, 'packages/internal-dom/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'packages/internal-core/**/*.test.ts',
      'packages/internal-dom/**/*.test.ts',
      'packages/tokens/**/*.test.ts',
      'packages/react/**/*.test.ts',
      'packages/react/**/*.test.tsx',
      'packages/vue/**/*.test.ts',
    ],
    css: true,
  },
});
