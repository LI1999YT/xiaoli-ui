import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'node:path';

const entries = {
  index: 'src/index.ts',
  'config-provider/index': 'src/components/config-provider/index.ts',
  'button/index': 'src/components/button/index.ts',
  'icon/index': 'src/components/icon/index.ts',
  'flex/index': 'src/components/flex/index.ts',
  'input/index': 'src/components/input/index.ts',
  'checkbox/index': 'src/components/checkbox/index.ts',
  'form/index': 'src/components/form/index.ts',
  'dialog/index': 'src/components/dialog/index.ts',
  'toast/index': 'src/components/toast/index.ts',
  'card/index': 'src/components/card/index.ts',
};

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: path.resolve(import.meta.dirname, 'tsconfig.json'),
      exclude: ['**/*.test.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@xiaoli-ui/internal-core': path.resolve(import.meta.dirname, '../internal-core/src/index.ts'),
      '@xiaoli-ui/internal-dom': path.resolve(import.meta.dirname, '../internal-dom/src/index.ts'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@xiaoli-ui/theme', '@xiaoli-ui/tokens'],
    },
  },
});
