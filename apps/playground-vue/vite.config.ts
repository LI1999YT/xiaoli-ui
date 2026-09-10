import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [vue()],
  server: { port: 5174 },
  resolve: {
    alias: {
      '@xiaoli-ui/vue': path.resolve(import.meta.dirname, '../../packages/vue/src/index.ts'),
      '@xiaoli-ui/tokens': path.resolve(import.meta.dirname, '../../packages/tokens/src/index.ts'),
      '@xiaoli-ui/theme': path.resolve(import.meta.dirname, '../../packages/theme/src/index.ts'),
      '@xiaoli-ui/internal-core': path.resolve(import.meta.dirname, '../../packages/internal-core/src/index.ts'),
      '@xiaoli-ui/internal-dom': path.resolve(import.meta.dirname, '../../packages/internal-dom/src/index.ts'),
    },
  },
});
