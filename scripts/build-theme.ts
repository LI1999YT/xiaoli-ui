import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const theme = path.join(root, 'packages/theme');
const dist = path.join(theme, 'dist');

await mkdir(dist, { recursive: true });
await mkdir(path.join(dist, 'components'), { recursive: true });
await mkdir(path.join(dist, 'fonts'), { recursive: true });
await cp(path.join(theme, 'src/fonts/smiley-sans.woff2'), path.join(dist, 'fonts/smiley-sans.woff2'));
await cp(path.join(theme, 'src/fonts.css'), path.join(dist, 'fonts.css'));

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
  ['src/components/watermark.css', 'components/watermark.css'],
  ['src/components/picker.css', 'components/picker.css'],
  ['src/components/search-bar.css', 'components/search-bar.css'],
  ['src/components/virtual-list.css', 'components/virtual-list.css'],
  ['src/components/notice-bar.css', 'components/notice-bar.css'],
  ['src/components/swipe-cell.css', 'components/swipe-cell.css'],
  ['src/components/infinite-scroll.css', 'components/infinite-scroll.css'],
  ['src/components/pull-refresh.css', 'components/pull-refresh.css'],
  ['src/components/back-top.css', 'components/back-top.css'],
  ['src/components/scroll-area.css', 'components/scroll-area.css'],
  ['src/components/affix.css', 'components/affix.css'],
  ['src/components/anchor.css', 'components/anchor.css'],
  ['src/components/timeline.css', 'components/timeline.css'],
  ['src/components/carousel.css', 'components/carousel.css'],
  ['src/components/transfer.css', 'components/transfer.css'],
  ['src/components/cascader.css', 'components/cascader.css'],
  ['src/components/tree-select.css', 'components/tree-select.css'],
  ['src/components/tree.css', 'components/tree.css'],
  ['src/components/notification.css', 'components/notification.css'],
  ['src/components/calendar.css', 'components/calendar.css'],
  ['src/components/autocomplete.css', 'components/autocomplete.css'],
  ['src/components/segmented.css', 'components/segmented.css'],
  ['src/components/safe-area.css', 'components/safe-area.css'],
  ['src/components/action-sheet.css', 'components/action-sheet.css'],
  ['src/components/tab-bar.css', 'components/tab-bar.css'],
  ['src/components/bottom-sheet.css', 'components/bottom-sheet.css'],
  ['src/components/steps.css', 'components/steps.css'],
  ['src/components/descriptions.css', 'components/descriptions.css'],
  ['src/components/list.css', 'components/list.css'],
  ['src/components/table.css', 'components/table.css'],
  ['src/components/time-picker.css', 'components/time-picker.css'],
  ['src/components/date-picker.css', 'components/date-picker.css'],
  ['src/components/upload.css', 'components/upload.css'],
  ['src/components/rate.css', 'components/rate.css'],
  ['src/components/slider.css', 'components/slider.css'],
  ['src/components/input-number.css', 'components/input-number.css'],
  ['src/components/accordion.css', 'components/accordion.css'],
  ['src/components/dropdown.css', 'components/dropdown.css'],
  ['src/components/menu.css', 'components/menu.css'],
  ['src/components/breadcrumb.css', 'components/breadcrumb.css'],
  ['src/components/pagination.css', 'components/pagination.css'],
  ['src/components/progress.css', 'components/progress.css'],
  ['src/components/image.css', 'components/image.css'],
  ['src/components/avatar.css', 'components/avatar.css'],
  ['src/components/tag.css', 'components/tag.css'],
  ['src/components/alert.css', 'components/alert.css'],
  ['src/components/empty.css', 'components/empty.css'],
  ['src/components/skeleton.css', 'components/skeleton.css'],
  ['src/components/spinner.css', 'components/spinner.css'],
  ['src/components/badge.css', 'components/badge.css'],
  ['src/components/tabs.css', 'components/tabs.css'],
  ['src/components/tooltip.css', 'components/tooltip.css'],
  ['src/components/popover.css', 'components/popover.css'],
  ['src/components/drawer.css', 'components/drawer.css'],
  ['src/components/select.css', 'components/select.css'],
  ['src/components/switch.css', 'components/switch.css'],
  ['src/components/radio.css', 'components/radio.css'],
  ['src/components/textarea.css', 'components/textarea.css'],
  ['src/components/divider.css', 'components/divider.css'],
  ['src/components/space.css', 'components/space.css'],
  ['src/components/grid.css', 'components/grid.css'],
  ['src/components/typography.css', 'components/typography.css'],
] as const;

for (const [from, to] of files) {
  await cp(path.join(theme, from), path.join(dist, to));
}

const tokens = await readFile(path.join(dist, 'tokens.css'), 'utf8');
const base = await readFile(path.join(theme, 'src/base/base.css'), 'utf8');
const componentCss = files
  .filter(([, to]) => to.startsWith('components/') && to.endsWith('.css'))
  .map(([, to]) => to);
const components = await Promise.all(componentCss.map((to) => readFile(path.join(dist, to), 'utf8')));

const fonts = await readFile(path.join(theme, 'src/fonts.css'), 'utf8');
await writeFile(path.join(dist, 'base.css'), `${fonts}\n${tokens}\n${base}\n`);
await writeFile(path.join(dist, 'style.css'), `${fonts}\n${tokens}\n${base}\n${components.join('\n')}\n`);
await writeFile(
  path.join(dist, 'index.d.ts'),
  `export { BREAKPOINTS, defineTheme, parseThemeJson, serializeTheme } from '@xiaoli-ui/tokens';
export type { ResolvedTheme, ThemeConfig } from '@xiaoli-ui/tokens';
`,
);

console.log('theme build complete');
