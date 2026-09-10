import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const names = [
  'typography', 'grid', 'space', 'divider', 'textarea', 'radio', 'switch', 'select',
  'drawer', 'popover', 'tooltip', 'tabs', 'badge', 'spinner', 'skeleton', 'empty',
  'alert', 'tag', 'avatar', 'image', 'progress', 'pagination', 'breadcrumb', 'menu',
  'dropdown', 'accordion', 'input-number', 'slider', 'rate', 'upload', 'date-picker',
  'time-picker', 'table', 'list', 'descriptions', 'steps', 'bottom-sheet', 'tab-bar',
  'action-sheet', 'safe-area', 'segmented', 'autocomplete', 'calendar', 'notification',
  'tree', 'tree-select', 'cascader', 'transfer', 'carousel', 'timeline', 'anchor',
  'affix', 'scroll-area', 'back-top', 'pull-refresh', 'infinite-scroll', 'swipe-cell',
  'notice-bar', 'virtual-list', 'search-bar', 'picker', 'watermark',
] as const;

function pascal(name: string): string {
  return name.split('-').map((part) => part.slice(0, 1).toUpperCase() + part.slice(1)).join('');
}

function cssFor(name: string): string {
  return `@layer dui.components {
  :where([data-dui='${name}']) {
    box-sizing: border-box;
    min-width: 0;
    font-family: var(--dui-font-family);
    color: var(--dui-color-text-primary);
  }
  :where([data-dui='${name}']:not([data-unstyled])) {
    border-radius: var(--dui-${name.replaceAll('-', '')}-radius, var(--dui-radius-md));
  }
}
`;
}

function reactSource(name: string): string {
  const Comp = pascal(name);
  return `import type { HTMLAttributes, ReactNode } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface ${Comp}Props extends StyledParts<'root'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children?: ReactNode;
}

export function ${Comp}({ children, className, style, classNames, styles, unstyled, ...rest }: ${Comp}Props) {
  const config = useDuiConfigOptional();
  return (
    <div
      {...rest}
      data-dui="${name}"
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      {children}
    </div>
  );
}
`;
}

function vueSource(name: string): string {
  const Comp = pascal(name);
  return `import { defineComponent, h } from 'vue';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const ${Comp} = defineComponent({
  name: 'Dui${Comp}',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const config = useConfigOptional();
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-dui': '${name}',
          'data-part': 'root',
          'data-unstyled': presence(config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
        },
        slots.default?.(),
      );
  },
});
`;
}

function indexTs(name: string, isTsx: boolean): string {
  const Comp = pascal(name);
  const ext = isTsx ? `${name}` : name;
  return `export { ${Comp} } from './${ext}';\n`;
}

function reactIndex(name: string): string {
  const Comp = pascal(name);
  return `export { ${Comp}, type ${Comp}Props } from './${name}';\n`;
}

const special: Record<string, { react: string; vue: string; css: string }> = {};

special.textarea = {
  css: `@layer dui.components {
  :where([data-dui='textarea']) {
    display: flex;
    flex-direction: column;
    gap: var(--dui-space-1);
    width: 100%;
  }
  :where([data-dui='textarea'] [data-part='textarea']) {
    appearance: none;
    width: 100%;
    min-height: var(--dui-textarea-min-height);
    padding: var(--dui-textarea-padding);
    border: var(--dui-border-width) solid var(--dui-textarea-border-color);
    border-radius: var(--dui-textarea-radius);
    background: var(--dui-surface-panel);
    color: var(--dui-color-text-primary);
    font: inherit;
    font-size: 16px;
    resize: vertical;
  }
  :where([data-dui='textarea'] [data-part='count']) {
    align-self: flex-end;
    color: var(--dui-textarea-count-color);
    font-size: var(--dui-font-size-sm);
  }
}
`,
  react: `import { useRef, useState, type TextareaHTMLAttributes } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  showCount?: boolean;
  onValueChange?: (next: string) => void;
}

export function Textarea({
  value,
  defaultValue = '',
  rows = 3,
  showCount = false,
  maxLength,
  disabled,
  className,
  style,
  onValueChange,
  ...rest
}: TextareaProps) {
  const config = useDuiConfigOptional();
  const inner = useRef<HTMLTextAreaElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? String(value) : uncontrolled;
  return (
    <div data-dui="textarea" data-unstyled={presence(config?.unstyled ?? false)} className={className} style={style}>
      <textarea
        {...rest}
        ref={inner}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        value={current}
        data-part="textarea"
        onChange={(event) => {
          const next = event.currentTarget.value;
          if (!isControlled(value)) setUncontrolled(next);
          onValueChange?.(next);
        }}
      />
      {showCount ? <span data-part="count">{current.length}{maxLength ? \`/\${maxLength}\` : ''}</span> : null}
    </div>
  );
}
`,
  vue: `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Textarea = defineComponent({
  name: 'DuiTextarea',
  props: {
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: '' },
    rows: { type: Number, default: 3 },
    showCount: { type: Boolean, default: false },
    maxLength: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit, attrs }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? String(props.modelValue) : uncontrolled.value;
      return h('div', { 'data-dui': 'textarea', 'data-unstyled': presence(config?.unstyled ?? false) }, [
        h('textarea', {
          ...attrs,
          rows: props.rows,
          maxlength: props.maxLength,
          disabled: props.disabled,
          value: current,
          'data-part': 'textarea',
          onInput: (event: Event) => {
            const next = (event.target as HTMLTextAreaElement).value;
            if (!isControlled(props.modelValue)) uncontrolled.value = next;
            emit('update:modelValue', next);
          },
        }),
        props.showCount ? h('span', { 'data-part': 'count' }, \`\${current.length}\${props.maxLength ? '/' + props.maxLength : ''}\`) : null,
      ]);
    };
  },
});
`,
};

special.switch = {
  css: `@layer dui.components {
  :where([data-dui='switch']) {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--dui-space-2);
    min-height: 44px;
    cursor: pointer;
  }
  :where([data-dui='switch'] [data-part='input']) {
    position: absolute;
    inset: 0;
    opacity: 0;
    margin: 0;
    cursor: pointer;
  }
  :where([data-dui='switch'] [data-part='track']) {
    width: var(--dui-switch-track-width);
    height: var(--dui-switch-track-height);
    border-radius: var(--dui-radius-pill);
    background: var(--dui-switch-unchecked-bg);
    position: relative;
    transition: background-color 160ms ease;
  }
  :where([data-dui='switch'][data-state='checked']:not([data-unstyled]) [data-part='track']) {
    background: var(--dui-switch-checked-bg);
  }
  :where([data-dui='switch'] [data-part='thumb']) {
    position: absolute;
    top: 2px;
    left: 2px;
    width: var(--dui-switch-thumb-size);
    height: var(--dui-switch-thumb-size);
    border-radius: var(--dui-radius-pill);
    background: #fff;
    transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  :where([data-dui='switch'][data-state='checked'] [data-part='thumb']) {
    transform: translateX(20px);
  }
}
`,
  react: `import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Switch({
  checked,
  defaultChecked = false,
  disabled,
  onCheckedChange,
  children,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (next: boolean) => void;
  children?: import('react').ReactNode;
}) {
  const config = useDuiConfigOptional();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const current = isControlled(checked) ? Boolean(checked) : uncontrolled;
  return (
    <label data-dui="switch" data-state={current ? 'checked' : 'unchecked'} data-unstyled={presence(config?.unstyled ?? false)}>
      <input
        type="checkbox"
        role="switch"
        data-part="input"
        checked={current}
        disabled={disabled}
        onChange={() => {
          const next = !current;
          if (!isControlled(checked)) setUncontrolled(next);
          onCheckedChange?.(next);
        }}
      />
      <span data-part="track"><span data-part="thumb" /></span>
      {children ? <span data-part="label">{children}</span> : null}
    </label>
  );
}
`,
  vue: `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Switch = defineComponent({
  name: 'DuiSwitch',
  props: {
    modelValue: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultChecked);
    return () => {
      const current = isControlled(props.modelValue) ? Boolean(props.modelValue) : uncontrolled.value;
      return h('label', { 'data-dui': 'switch', 'data-state': current ? 'checked' : 'unchecked', 'data-unstyled': presence(config?.unstyled ?? false) }, [
        h('input', {
          type: 'checkbox',
          role: 'switch',
          'data-part': 'input',
          checked: current,
          disabled: props.disabled,
          onChange: () => {
            const next = !current;
            if (!isControlled(props.modelValue)) uncontrolled.value = next;
            emit('update:modelValue', next);
          },
        }),
        h('span', { 'data-part': 'track' }, [h('span', { 'data-part': 'thumb' })]),
        slots.default ? h('span', { 'data-part': 'label' }, slots.default()) : null,
      ]);
    };
  },
});
`,
};

const extraTokens: Record<string, Record<string, string>> = {
  textarea: {
    minHeight: '96px',
    padding: 'var(--dui-space-3)',
    radius: 'var(--dui-radius-md)',
    borderColor: 'var(--dui-color-border-default)',
    countColor: 'var(--dui-color-text-muted)',
  },
  radio: {
    controlSize: '18px',
    checkedBg: 'var(--dui-color-action-bg)',
    borderColor: 'var(--dui-color-border-strong)',
    gap: 'var(--dui-space-2)',
  },
  switch: {
    trackWidth: '44px',
    trackHeight: '24px',
    thumbSize: '20px',
    checkedBg: 'var(--dui-color-action-bg)',
    uncheckedBg: 'var(--dui-color-border-strong)',
  },
  select: { radius: 'var(--dui-radius-md)', height: 'var(--dui-control-height-md)' },
  drawer: { width: 'min(360px, 100vw)', bg: 'var(--dui-surface-panel)' },
  tabs: { gap: 'var(--dui-space-2)' },
  badge: { bg: 'var(--dui-color-action-bg)', fg: 'var(--dui-color-action-fg)' },
  spinner: { size: '24px', color: 'var(--dui-color-action-bg)' },
  progress: { height: '8px', bg: 'var(--dui-surface-muted)', fill: 'var(--dui-color-action-bg)' },
};

async function ensureDir(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

for (const name of names) {
  const Comp = pascal(name);
  const spec = special[name];
  const reactFile = path.join(root, `packages/react/src/components/${name}/${name}.tsx`);
  const vueFile = path.join(root, `packages/vue/src/components/${name}/${name}.ts`);
  const cssFile = path.join(root, `packages/theme/src/components/${name}.css`);
  await ensureDir(reactFile);
  await ensureDir(vueFile);
  await ensureDir(cssFile);
  await writeFile(reactFile, spec?.react ?? reactSource(name));
  await writeFile(path.join(root, `packages/react/src/components/${name}/index.ts`), reactIndex(name));
  await writeFile(vueFile, spec?.vue ?? vueSource(name));
  await writeFile(path.join(root, `packages/vue/src/components/${name}/index.ts`), `export { ${Comp} } from './${name}';\n`);
  await writeFile(cssFile, spec?.css ?? cssFor(name));
}

const schemaPath = path.join(root, 'packages/tokens/src/schema.ts');
let schema = await readFile(schemaPath, 'utf8');
if (!schema.includes('textarea:')) {
  const extras = Object.entries(extraTokens)
    .map(([key, tokens]) => {
      const body = Object.entries(tokens)
        .map(([k, v]) => `    ${k}: '${v}',`)
        .join('\n');
      return `  ${key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}: {\n${body}\n  },`;
    })
    .join('\n');
  schema = schema.replace('\n  card: {', `\n${extras}\n  card: {`);
  await writeFile(schemaPath, schema);
}

const allCss = path.join(root, 'packages/theme/src/all.css');
let all = await readFile(allCss, 'utf8');
for (const name of names) {
  const line = `@import './components/${name}.css';`;
  if (!all.includes(line)) all += `${line}\n`;
}
await writeFile(allCss, all);

function addExports(source: string, names: readonly string[], kind: 'react' | 'vue'): string {
  let next = source;
  for (const name of names) {
    const Comp = pascal(name);
    const line =
      kind === 'react'
        ? `export { ${Comp} } from './components/${name}/index';`
        : `export { ${Comp} } from './components/${name}/index';`;
    if (!next.includes(line)) next += `${line}\n`;
  }
  return next;
}

await writeFile(
  path.join(root, 'packages/react/src/index.ts'),
  addExports(await readFile(path.join(root, 'packages/react/src/index.ts'), 'utf8'), names, 'react'),
);
await writeFile(
  path.join(root, 'packages/vue/src/index.ts'),
  addExports(await readFile(path.join(root, 'packages/vue/src/index.ts'), 'utf8'), names, 'vue'),
);

function patchVite(source: string): string {
  let next = source;
  for (const name of names) {
    const entry = `  '${name}/index': 'src/components/${name}/index.ts',`;
    if (!next.includes(entry)) {
      next = next.replace(
        `'card/index': 'src/components/card/index.ts',`,
        `'card/index': 'src/components/card/index.ts',\n${entry}`,
      );
    }
  }
  return next;
}

await writeFile(path.join(root, 'packages/react/vite.config.ts'), patchVite(await readFile(path.join(root, 'packages/react/vite.config.ts'), 'utf8')));
await writeFile(path.join(root, 'packages/vue/vite.config.ts'), patchVite(await readFile(path.join(root, 'packages/vue/vite.config.ts'), 'utf8')));

const buildTheme = path.join(root, 'scripts/build-theme.ts');
let build = await readFile(buildTheme, 'utf8');
for (const name of names) {
  const row = `  ['src/components/${name}.css', 'components/${name}.css'],`;
  if (!build.includes(row)) {
    build = build.replace(
      `  ['src/components/card.css', 'components/card.css'],`,
      `  ['src/components/card.css', 'components/card.css'],\n${row}`,
    );
  }
  if (!build.includes(`'${name}',`)) {
    build = build.replace(`    'card',\n  ]`, `    'card',\n    '${name}',\n  ]`);
  }
}
await writeFile(buildTheme, build);

const copyCss = path.join(root, 'scripts/copy-ui-css.ts');
let copy = await readFile(copyCss, 'utf8');
const list = `const components = ['button', 'icon', 'flex', 'input', 'checkbox', 'form', 'dialog', 'toast', 'card', ${names.map((n) => `'${n}'`).join(', ')}];`;
copy = copy.replace(/const components = \[[^\]]+\];/, list);
await writeFile(copyCss, copy);

console.log(`scaffolded ${names.length} components`);
