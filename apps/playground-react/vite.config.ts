import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    alias: {
      '@xiaoli-ui/react': path.resolve(import.meta.dirname, '../../packages/react/src/index.ts'),
      '@xiaoli-ui/tokens': path.resolve(import.meta.dirname, '../../packages/tokens/src/index.ts'),
      '@xiaoli-ui/theme': path.resolve(import.meta.dirname, '../../packages/theme/src/index.ts'),
      '@xiaoli-ui/internal-core': path.resolve(import.meta.dirname, '../../packages/internal-core/src/index.ts'),
      '@xiaoli-ui/internal-dom': path.resolve(import.meta.dirname, '../../packages/internal-dom/src/index.ts'),
    },
  },
});
