import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const theme = path.join(root, 'packages/theme');
const dist = path.join(theme, 'dist');

await mkdir(dist, { recursive: true });
await mkdir(path.join(dist, 'components'), { recursive: true });

await build({
  root: theme,
  logLevel: 'warn',
  build: {
    lib: {
      entry: path.join(theme, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      external: ['@xiaoli-ui/tokens'],
    },
  },
});

const files = [
  ['src/tokens.generated.css', 'tokens.css'],
  ['src/base/base.css', 'base.partial.css'],
  ['src/components/button.css', 'components/button.css'],
  ['src/components/icon.css', 'components/icon.css'],
  ['src/components/flex.css', 'components/flex.css'],
  ['src/components/input.css', 'components/input.css'],
  ['src/components/checkbox.css', 'components/checkbox.css'],
  ['src/components/form.css', 'components/form.css'],
  ['src/components/dialog.css', 'components/dialog.css'],
  ['src/components/toast.css', 'components/toast.css'],
  ['src/components/card.css', 'components/card.css'],
] as const;

for (const [from, to] of files) {
  await cp(path.join(theme, from), path.join(dist, to));
}

const tokens = await readFile(path.join(dist, 'tokens.css'), 'utf8');
const base = await readFile(path.join(theme, 'src/base/base.css'), 'utf8');
const components = await Promise.all(
  [
    'button',
    'icon',
    'flex',
    'input',
    'checkbox',
    'form',
    'dialog',
    'toast',
    'card',
  ].map((name) => readFile(path.join(dist, `components/${name}.css`), 'utf8')),
);

await writeFile(path.join(dist, 'base.css'), `${tokens}\n${base}\n`);
await writeFile(path.join(dist, 'style.css'), `${tokens}\n${base}\n${components.join('\n')}\n`);
await writeFile(
  path.join(dist, 'index.d.ts'),
  `export { BREAKPOINTS, defineTheme, parseThemeJson, serializeTheme } from '@xiaoli-ui/tokens';
export type { ResolvedTheme, ThemeConfig } from '@xiaoli-ui/tokens';
`,
);

console.log('theme build complete');
