import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function write(rel: string, contents: string) {
  const file = path.join(root, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents.endsWith('\n') ? contents : `${contents}\n`);
}

const R = (name: string, body: string) =>
  write(`packages/react/src/components/${name}/${name.includes('/') ? name.split('/').pop() : name}.tsx`, body);
const V = (name: string, body: string) =>
  write(`packages/vue/src/components/${name}/${name.includes('/') ? name.split('/').pop() : name}.ts`, body);
const C = (name: string, body: string) => write(`packages/theme/src/components/${name}.css`, body);

const reactCtrl = `import { useMemo, useRef, useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';
`;

await Promise.all([
  write(
    'packages/react/src/components/progress/progress.tsx',
    `${reactCtrl}
export function Progress({ value = null, max = 100, variant = 'line', status = 'normal', showLabel = true, label = '进度' }: { value?: number | null; max?: number; variant?: 'line' | 'circle'; status?: 'normal' | 'success' | 'error'; showLabel?: boolean; label?: string; }) {
  const config = useDuiConfigOptional();
  const ratio = value == null ? null : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div data-dui="progress" data-variant={variant} data-status={status} data-indeterminate={presence(ratio == null)} data-unstyled={presence(config?.unstyled ?? false)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value ?? undefined}>
      <div data-part="track">{ratio == null ? <span data-part="bar" /> : <span data-part="bar" style={{ width: variant === 'line' ? \`\${ratio}%\` : undefined, ['--dui-progress-ratio' as string]: String(ratio) }} />}</div>
      {showLabel ? <span data-part="label">{ratio == null ? '加载中' : \`\${Math.round(ratio)}%\`}</span> : null}
    </div>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/progress/progress.ts',
    `import { defineComponent, h, type PropType } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';
export const Progress = defineComponent({
  name: 'DuiProgress',
  props: {
    value: { type: Number, default: null },
    max: { type: Number, default: 100 },
    variant: { type: String as PropType<'line' | 'circle'>, default: 'line' },
    status: { type: String as PropType<'normal' | 'success' | 'error'>, default: 'normal' },
    showLabel: { type: Boolean, default: true },
    label: { type: String, default: '进度' },
  },
  setup(props) {
    const config = useConfigOptional();
    return () => {
      const ratio = props.value == null ? null : Math.min(100, Math.max(0, (props.value / props.max) * 100));
      return h('div', { 'data-dui': 'progress', 'data-part': 'root', 'data-variant': props.variant, 'data-status': props.status, 'data-indeterminate': presence(ratio == null), 'data-unstyled': presence(config?.unstyled ?? false), role: 'progressbar', 'aria-label': props.label, 'aria-valuenow': props.value ?? undefined }, [
        h('div', { 'data-part': 'track' }, [h('span', { 'data-part': 'bar', style: ratio == null ? undefined : { width: \`\${ratio}%\` } })]),
        props.showLabel ? h('span', { 'data-part': 'label' }, ratio == null ? '加载中' : \`\${Math.round(ratio)}%\`) : null,
      ]);
    };
  },
});
`,
  ),
  write(
    'packages/react/src/components/pagination/pagination.tsx',
    `${reactCtrl}
export function Pagination({ page, defaultPage = 1, pageSize = 20, total = 0, onPageChange }: { page?: number; defaultPage?: number; pageSize?: number; total?: number; onPageChange?: (next: number) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultPage);
  const current = isControlled(page) ? (page as number) : uncontrolled;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const go = (next: number) => {
    const value = Math.min(pages, Math.max(1, next));
    if (!isControlled(page)) setUncontrolled(value);
    onPageChange?.(value);
  };
  const items = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - current) <= 1);
  return (
    <nav data-dui="pagination" aria-label="分页">
      <button type="button" disabled={current <= 1} onClick={() => go(current - 1)}>上一页</button>
      {items.map((n, i) => (
        <span key={n}>
          {i > 0 && items[i - 1] !== n - 1 ? <span data-part="ellipsis">…</span> : null}
          <button type="button" data-active={presence(n === current)} aria-current={n === current ? 'page' : undefined} onClick={() => go(n)}>{n}</button>
        </span>
      ))}
      <button type="button" disabled={current >= pages} onClick={() => go(current + 1)}>下一页</button>
    </nav>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/pagination/pagination.ts',
    `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Pagination = defineComponent({
  name: 'DuiPagination',
  props: { page: { type: Number, default: undefined }, defaultPage: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, total: { type: Number, default: 0 } },
  emits: { 'update:page': (_n: number) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultPage);
    return () => {
      const current = isControlled(props.page) ? (props.page as number) : uncontrolled.value;
      const pages = Math.max(1, Math.ceil(props.total / props.pageSize));
      const go = (next: number) => { const value = Math.min(pages, Math.max(1, next)); if (!isControlled(props.page)) uncontrolled.value = value; emit('update:page', value); };
      const items = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - current) <= 1);
      return h('nav', { 'data-dui': 'pagination', 'aria-label': '分页' }, [
        h('button', { type: 'button', disabled: current <= 1, onClick: () => go(current - 1) }, '上一页'),
        ...items.flatMap((n, i) => [i > 0 && items[i - 1] !== n - 1 ? h('span', { 'data-part': 'ellipsis' }, '…') : null, h('button', { type: 'button', 'data-active': presence(n === current), onClick: () => go(n) }, n)]),
        h('button', { type: 'button', disabled: current >= pages, onClick: () => go(current + 1) }, '下一页'),
      ]);
    };
  },
});
`,
  ),
  write(
    'packages/react/src/components/breadcrumb/breadcrumb.tsx',
    `import type { ReactNode } from 'react';
export function Breadcrumb({ items = [], separator = '/' }: { items?: Array<{ label: ReactNode; href?: string }>; separator?: ReactNode; }) {
  return (
    <nav data-dui="breadcrumb" aria-label="面包屑">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {index > 0 ? <span data-part="separator">{separator}</span> : null}
            {item.href && index < items.length - 1 ? <a href={item.href}>{item.label}</a> : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/breadcrumb/breadcrumb.ts',
    `import { defineComponent, h, type PropType } from 'vue';
export const Breadcrumb = defineComponent({
  name: 'DuiBreadcrumb',
  props: { items: { type: Array as PropType<Array<{ label: string; href?: string }>>, default: () => [] }, separator: { type: String, default: '/' } },
  setup(props) {
    return () => h('nav', { 'data-dui': 'breadcrumb', 'aria-label': '面包屑' }, [
      h('ol', props.items.map((item, index) => h('li', [
        index > 0 ? h('span', { 'data-part': 'separator' }, props.separator) : null,
        item.href && index < props.items.length - 1 ? h('a', { href: item.href }, item.label) : h('span', { 'aria-current': index === props.items.length - 1 ? 'page' : undefined }, item.label),
      ]))),
    ]);
  },
});
`,
  ),
  write(
    'packages/react/src/components/menu/menu.tsx',
    `${reactCtrl}
export function Menu({ items = [], value, defaultValue, onValueChange }: { items?: Array<{ value: string; label: ReactNode; disabled?: boolean }>; value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? value : uncontrolled;
  return (
    <ul data-dui="menu" role="menu">
      {items.map((item) => (
        <li key={item.value} role="menuitem" data-active={presence(item.value === current)} aria-disabled={item.disabled || undefined} onClick={() => { if (item.disabled) return; if (!isControlled(value)) setUncontrolled(item.value); onValueChange?.(item.value); }}>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/menu/menu.ts',
    `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Menu = defineComponent({
  name: 'DuiMenu',
  props: { items: { type: Array as PropType<Array<{ value: string; label: string; disabled?: boolean }>>, default: () => [] }, modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: undefined } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      return h('ul', { 'data-dui': 'menu', role: 'menu' }, props.items.map((item) => h('li', { role: 'menuitem', 'data-active': presence(item.value === current), onClick: () => { if (item.disabled) return; if (!isControlled(props.modelValue)) uncontrolled.value = item.value; emit('update:modelValue', item.value); } }, item.label)));
    };
  },
});
`,
  ),
  write(
    'packages/react/src/components/dropdown/dropdown.tsx',
    `${reactCtrl}
export function Dropdown({ items = [], onSelect, children }: { items?: Array<{ value: string; label: ReactNode; danger?: boolean }>; onSelect?: (value: string) => void; children?: ReactNode; }) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <div ref={root} data-dui="dropdown" data-open={presence(open)}>
      <button type="button" data-part="trigger" aria-expanded={open} onClick={() => setOpen(!open)}>{children ?? '操作'}</button>
      {open ? (
        <ul data-part="menu" role="menu">
          {items.map((item) => (
            <li key={item.value} role="menuitem" data-danger={presence(item.danger)} onClick={() => { onSelect?.(item.value); setOpen(false); }}>{item.label}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/dropdown/dropdown.ts',
    `import { defineComponent, h, ref, type PropType } from 'vue';
import { presence } from '../../utils';
export const Dropdown = defineComponent({
  name: 'DuiDropdown',
  props: { items: { type: Array as PropType<Array<{ value: string; label: string; danger?: boolean }>>, default: () => [] } },
  emits: { select: (_v: string) => true },
  setup(props, { emit, slots }) {
    const open = ref(false);
    return () => h('div', { 'data-dui': 'dropdown', 'data-open': presence(open.value) }, [
      h('button', { type: 'button', 'data-part': 'trigger', 'aria-expanded': open.value, onClick: () => { open.value = !open.value; } }, slots.default?.() ?? '操作'),
      open.value ? h('ul', { 'data-part': 'menu', role: 'menu' }, props.items.map((item) => h('li', { role: 'menuitem', 'data-danger': presence(item.danger), onClick: () => { emit('select', item.value); open.value = false; } }, item.label))) : null,
    ]);
  },
});
`,
  ),
  write(
    'packages/react/src/components/accordion/accordion.tsx',
    `${reactCtrl}
export function Accordion({ items = [], value, defaultValue, multiple = false, onValueChange }: { items?: Array<{ key: string; title: ReactNode; content?: ReactNode; disabled?: boolean }>; value?: string | string[]; defaultValue?: string | string[]; multiple?: boolean; onValueChange?: (next: string | string[]) => void; }) {
  const [uncontrolled, setUncontrolled] = useState<string | string[] | undefined>(defaultValue ?? (multiple ? [] : undefined));
  const current = isControlled(value) ? value : uncontrolled;
  const selected = new Set(Array.isArray(current) ? current : current ? [current] : []);
  const toggle = (key: string) => {
    let next: string | string[];
    if (multiple) {
      const set = new Set(selected);
      if (set.has(key)) set.delete(key); else set.add(key);
      next = [...set];
    } else next = selected.has(key) ? '' : key;
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <div data-dui="accordion">
      {items.map((item) => {
        const open = selected.has(item.key);
        return (
          <div key={item.key} data-part="item" data-open={presence(open)}>
            <button type="button" data-part="trigger" aria-expanded={open} disabled={item.disabled} onClick={() => toggle(item.key)}>{item.title}</button>
            {open ? <div data-part="panel">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/accordion/accordion.ts',
    `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Accordion = defineComponent({
  name: 'DuiAccordion',
  props: { items: { type: Array as PropType<Array<{ key: string; title: string; content?: string; disabled?: boolean }>>, default: () => [] }, modelValue: { type: [String, Array] as PropType<string | string[]>, default: undefined }, multiple: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: string | string[]) => true },
  setup(props, { emit }) {
    const uncontrolled = ref<string | string[]>(props.multiple ? [] : '');
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      const selected = new Set(Array.isArray(current) ? current : current ? [current] : []);
      const toggle = (key: string) => {
        let next: string | string[];
        if (props.multiple) { const set = new Set(selected); if (set.has(key)) set.delete(key); else set.add(key); next = [...set]; }
        else next = selected.has(key) ? '' : key;
        if (!isControlled(props.modelValue)) uncontrolled.value = next;
        emit('update:modelValue', next);
      };
      return h('div', { 'data-dui': 'accordion' }, props.items.map((item) => {
        const open = selected.has(item.key);
        return h('div', { 'data-part': 'item', 'data-open': presence(open) }, [
          h('button', { type: 'button', 'data-part': 'trigger', 'aria-expanded': open, disabled: item.disabled, onClick: () => toggle(item.key) }, item.title),
          open ? h('div', { 'data-part': 'panel' }, item.content) : null,
        ]);
      }));
    };
  },
});
`,
  ),
]);

await Promise.all([
  write(
    'packages/react/src/components/input-number/input-number.tsx',
    `${reactCtrl}
export function InputNumber({ value, defaultValue = null, min, max, step = 1, disabled, onValueChange }: { value?: number | null; defaultValue?: number | null; min?: number; max?: number; step?: number; disabled?: boolean; onValueChange?: (next: number | null) => void; }) {
  const [uncontrolled, setUncontrolled] = useState<number | null>(defaultValue);
  const current = isControlled(value) ? (value ?? null) : uncontrolled;
  const commit = (next: number | null) => {
    if (next != null) next = Math.min(max ?? next, Math.max(min ?? next, next));
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <div data-dui="input-number" data-disabled={presence(disabled)}>
      <button type="button" aria-label="减少" disabled={disabled} onClick={() => commit((current ?? 0) - step)}>−</button>
      <input type="text" inputMode="decimal" value={current ?? ''} disabled={disabled} onChange={(e) => commit(e.target.value === '' ? null : Number(e.target.value))} />
      <button type="button" aria-label="增加" disabled={disabled} onClick={() => commit((current ?? 0) + step)}>+</button>
    </div>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/input-number/input-number.ts',
    `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const InputNumber = defineComponent({
  name: 'DuiInputNumber',
  props: { modelValue: { type: Number, default: undefined }, defaultValue: { type: Number, default: null }, min: { type: Number, default: undefined }, max: { type: Number, default: undefined }, step: { type: Number, default: 1 }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: number | null) => true },
  setup(props, { emit }) {
    const uncontrolled = ref<number | null>(props.defaultValue);
    const current = () => (isControlled(props.modelValue) ? props.modelValue ?? null : uncontrolled.value);
    const commit = (next: number | null) => { if (next != null) next = Math.min(props.max ?? next, Math.max(props.min ?? next, next)); if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); };
    return () => h('div', { 'data-dui': 'input-number', 'data-disabled': presence(props.disabled) }, [
      h('button', { type: 'button', 'aria-label': '减少', disabled: props.disabled, onClick: () => commit((current() ?? 0) - props.step) }, '−'),
      h('input', { type: 'text', inputmode: 'decimal', value: current() ?? '', disabled: props.disabled, onInput: (e: Event) => commit((e.target as HTMLInputElement).value === '' ? null : Number((e.target as HTMLInputElement).value)) }),
      h('button', { type: 'button', 'aria-label': '增加', disabled: props.disabled, onClick: () => commit((current() ?? 0) + props.step) }, '+'),
    ]);
  },
});
`,
  ),
  write(
    'packages/react/src/components/slider/slider.tsx',
    `${reactCtrl}
export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, disabled, onValueChange }: { value?: number; defaultValue?: number; min?: number; max?: number; step?: number; disabled?: boolean; onValueChange?: (next: number) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as number) : uncontrolled;
  const commit = (next: number) => { const v = Math.min(max, Math.max(min, next)); if (!isControlled(value)) setUncontrolled(v); onValueChange?.(v); };
  const pct = ((current - min) / (max - min || 1)) * 100;
  return (
    <div data-dui="slider" data-disabled={presence(disabled)}>
      <input type="range" min={min} max={max} step={step} value={current} disabled={disabled} aria-valuenow={current} onChange={(e) => commit(Number(e.target.value))} />
      <span data-part="track"><span data-part="fill" style={{ width: \`\${pct}%\` }} /><span data-part="thumb" style={{ insetInlineStart: \`\${pct}%\` }} /></span>
      <span data-part="value">{current}</span>
    </div>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/slider/slider.ts',
    `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Slider = defineComponent({
  name: 'DuiSlider',
  props: { modelValue: { type: Number, default: undefined }, defaultValue: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, step: { type: Number, default: 1 }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as number) : uncontrolled.value;
      const pct = ((current - props.min) / (props.max - props.min || 1)) * 100;
      return h('div', { 'data-dui': 'slider', 'data-disabled': presence(props.disabled) }, [
        h('input', { type: 'range', min: props.min, max: props.max, step: props.step, value: current, disabled: props.disabled, onInput: (e: Event) => { const v = Number((e.target as HTMLInputElement).value); if (!isControlled(props.modelValue)) uncontrolled.value = v; emit('update:modelValue', v); } }),
        h('span', { 'data-part': 'track' }, [h('span', { 'data-part': 'fill', style: { width: \`\${pct}%\` } }), h('span', { 'data-part': 'thumb', style: { insetInlineStart: \`\${pct}%\` } })]),
        h('span', { 'data-part': 'value' }, current),
      ]);
    };
  },
});
`,
  ),
  write(
    'packages/react/src/components/rate/rate.tsx',
    `${reactCtrl}
export function Rate({ value, defaultValue = 0, max = 5, disabled, onValueChange }: { value?: number; defaultValue?: number; max?: number; disabled?: boolean; onValueChange?: (next: number) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const current = isControlled(value) ? (value as number) : uncontrolled;
  const shown = hover ?? current;
  return (
    <div data-dui="rate" role="radiogroup" aria-label="评分">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" role="radio" aria-checked={n === current} data-active={presence(n <= shown)} disabled={disabled} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)} onClick={() => { const next = n === current ? 0 : n; if (!isControlled(value)) setUncontrolled(next); onValueChange?.(next); }}>★</button>
      ))}
    </div>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/rate/rate.ts',
    `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Rate = defineComponent({
  name: 'DuiRate',
  props: { modelValue: { type: Number, default: undefined }, defaultValue: { type: Number, default: 0 }, max: { type: Number, default: 5 }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    const hover = ref<number | null>(null);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as number) : uncontrolled.value;
      const shown = hover.value ?? current;
      return h('div', { 'data-dui': 'rate', role: 'radiogroup', 'aria-label': '评分' }, Array.from({ length: props.max }, (_, i) => i + 1).map((n) => h('button', { type: 'button', role: 'radio', 'aria-checked': n === current, 'data-active': presence(n <= shown), disabled: props.disabled, onMouseenter: () => { hover.value = n; }, onMouseleave: () => { hover.value = null; }, onClick: () => { const next = n === current ? 0 : n; if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); } }, '★')));
    };
  },
});
`,
  ),
  write(
    'packages/react/src/components/upload/upload.tsx',
    `${reactCtrl}
export function Upload({ accept, multiple, disabled, onFilesChange }: { accept?: string; multiple?: boolean; disabled?: boolean; onFilesChange?: (files: File[]) => void; children?: ReactNode; }) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div data-dui="upload" data-disabled={presence(disabled)}>
      <label data-part="trigger">
        <input type="file" accept={accept} multiple={multiple} disabled={disabled} className="dui-visually-hidden" onChange={(e) => { const next = [...(e.target.files ?? [])]; setFiles(next); onFilesChange?.(next); }} />
        <span>选择文件</span>
      </label>
      <ul data-part="list">{files.map((file) => <li key={file.name}>{file.name}</li>)}</ul>
    </div>
  );
}
`,
  ),
  write(
    'packages/vue/src/components/upload/upload.ts',
    `import { defineComponent, h, ref } from 'vue';
import { presence } from '../../utils';
export const Upload = defineComponent({
  name: 'DuiUpload',
  props: { accept: { type: String, default: undefined }, multiple: { type: Boolean, default: false }, disabled: { type: Boolean, default: false } },
  emits: { filesChange: (_files: File[]) => true },
  setup(props, { emit }) {
    const files = ref<File[]>([]);
    return () => h('div', { 'data-dui': 'upload', 'data-disabled': presence(props.disabled) }, [
      h('label', { 'data-part': 'trigger' }, [
        h('input', { type: 'file', accept: props.accept, multiple: props.multiple, disabled: props.disabled, class: 'dui-visually-hidden', onChange: (e: Event) => { files.value = [...((e.target as HTMLInputElement).files ?? [])]; emit('filesChange', files.value); } }),
        h('span', '选择文件'),
      ]),
      h('ul', { 'data-part': 'list' }, files.value.map((file) => h('li', file.name))),
    ]);
  },
});
`,
  ),
]);

console.log('batch A written');
