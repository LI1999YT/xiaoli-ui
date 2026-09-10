import { cp, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = process.argv[2];
if (pkg !== 'react' && pkg !== 'vue') {
  throw new Error('usage: copy-ui-css.ts <react|vue>');
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeDist = path.join(root, 'packages/theme/dist');
const dest = path.join(root, 'packages', pkg, 'dist');
const components = ['button', 'icon', 'flex', 'input', 'checkbox', 'form', 'dialog', 'toast', 'card', 'typography', 'grid', 'space', 'divider', 'textarea', 'radio', 'switch', 'select', 'drawer', 'popover', 'tooltip', 'tabs', 'badge', 'spinner', 'skeleton', 'empty', 'alert', 'tag', 'avatar', 'image', 'progress', 'pagination', 'breadcrumb', 'menu', 'dropdown', 'accordion', 'input-number', 'slider', 'rate', 'upload', 'date-picker', 'time-picker', 'table', 'list', 'descriptions', 'steps', 'bottom-sheet', 'tab-bar', 'action-sheet', 'safe-area', 'segmented', 'autocomplete', 'calendar', 'notification', 'tree', 'tree-select', 'cascader', 'transfer', 'carousel', 'timeline', 'anchor', 'affix', 'scroll-area', 'back-top', 'pull-refresh', 'infinite-scroll', 'swipe-cell', 'notice-bar', 'virtual-list', 'search-bar', 'picker', 'watermark'];

await mkdir(dest, { recursive: true });
await cp(path.join(themeDist, 'style.css'), path.join(dest, 'style.css'));
await cp(path.join(themeDist, 'base.css'), path.join(dest, 'base.css'));
for (const name of components) {
  await mkdir(path.join(dest, name), { recursive: true });
  await cp(path.join(themeDist, 'components', `${name}.css`), path.join(dest, name, 'style.css'));
  await writeFile(
    path.join(dest, name, 'index.d.ts'),
    `export * from '../components/${name}/index';\n`,
  );
}
await mkdir(path.join(dest, 'config-provider'), { recursive: true });
await writeFile(
  path.join(dest, 'config-provider', 'index.d.ts'),
  `export * from '../components/config-provider/index';\n`,
);
