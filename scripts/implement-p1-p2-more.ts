import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function write(rel: string, contents: string) {
  const file = path.join(root, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents.endsWith('\n') ? contents : `${contents}\n`);
}

const reactHead = `import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';
`;

await Promise.all([
  write('packages/react/src/components/date-picker/date-picker.tsx', `${reactHead}
export function DatePicker({ value, defaultValue = '', onValueChange }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  return (
    <div data-dui="date-picker">
      <input type="date" value={current} onChange={(e) => { if (!isControlled(value)) setUncontrolled(e.target.value); onValueChange?.(e.target.value); }} />
    </div>
  );
}
`),
  write('packages/vue/src/components/date-picker/date-picker.ts', `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
export const DatePicker = defineComponent({
  name: 'DuiDatePicker',
  props: { modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value;
      return h('div', { 'data-dui': 'date-picker' }, [h('input', { type: 'date', value: current, onInput: (e: Event) => { const next = (e.target as HTMLInputElement).value; if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); } })]);
    };
  },
});
`),
  write('packages/react/src/components/time-picker/time-picker.tsx', `${reactHead}
export function TimePicker({ value, defaultValue = '', onValueChange }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  return (
    <div data-dui="time-picker">
      <input type="time" value={current} onChange={(e) => { if (!isControlled(value)) setUncontrolled(e.target.value); onValueChange?.(e.target.value); }} />
    </div>
  );
}
`),
  write('packages/vue/src/components/time-picker/time-picker.ts', `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
export const TimePicker = defineComponent({
  name: 'DuiTimePicker',
  props: { modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value;
      return h('div', { 'data-dui': 'time-picker' }, [h('input', { type: 'time', value: current, onInput: (e: Event) => { const next = (e.target as HTMLInputElement).value; if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); } })]);
    };
  },
});
`),
  write('packages/react/src/components/table/table.tsx', `${reactHead}
export interface TableColumn<T> { key: string; title: ReactNode; render?: (row: T) => ReactNode; }
export function Table<T extends Record<string, unknown>>({ data = [], columns = [], rowKey, caption }: { data?: T[]; columns?: TableColumn<T>[]; rowKey: keyof T | ((row: T) => string); caption?: string; }) {
  const keyOf = (row: T, index: number) => String(typeof rowKey === 'function' ? rowKey(row) : row[rowKey] ?? index);
  return (
    <div data-dui="table">
      <table>
        {caption ? <caption>{caption}</caption> : null}
        <thead><tr>{columns.map((col) => <th key={col.key}>{col.title}</th>)}</tr></thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan={Math.max(columns.length, 1)}>暂无数据</td></tr> : data.map((row, index) => (
            <tr key={keyOf(row, index)}>{columns.map((col) => <td key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? '')}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`),
  write('packages/vue/src/components/table/table.ts', `import { defineComponent, h, type PropType } from 'vue';
export const Table = defineComponent({
  name: 'DuiTable',
  props: {
    data: { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
    columns: { type: Array as PropType<Array<{ key: string; title: string }>>, default: () => [] },
    rowKey: { type: String, default: 'id' },
    caption: { type: String, default: undefined },
  },
  setup(props) {
    return () => h('div', { 'data-dui': 'table' }, [
      h('table', [
        props.caption ? h('caption', props.caption) : null,
        h('thead', [h('tr', props.columns.map((col) => h('th', col.title)))]),
        h('tbody', props.data.length === 0
          ? [h('tr', [h('td', { colspan: Math.max(props.columns.length, 1) }, '暂无数据')])]
          : props.data.map((row, index) => h('tr', { key: String(row[props.rowKey] ?? index) }, props.columns.map((col) => h('td', String(row[col.key] ?? '')))))),
      ]),
    ]);
  },
});
`),
  write('packages/react/src/components/list/list.tsx', `import type { ReactNode } from 'react';
export function List({ items = [] }: { items?: Array<{ key: string; title: ReactNode; description?: ReactNode }>; }) {
  return (
    <ul data-dui="list">
      {items.map((item) => (
        <li key={item.key} data-part="item">
          <div data-part="title">{item.title}</div>
          {item.description ? <div data-part="description">{item.description}</div> : null}
        </li>
      ))}
    </ul>
  );
}
`),
  write('packages/vue/src/components/list/list.ts', `import { defineComponent, h, type PropType } from 'vue';
export const List = defineComponent({
  name: 'DuiList',
  props: { items: { type: Array as PropType<Array<{ key: string; title: string; description?: string }>>, default: () => [] } },
  setup(props) {
    return () => h('ul', { 'data-dui': 'list' }, props.items.map((item) => h('li', { 'data-part': 'item' }, [h('div', { 'data-part': 'title' }, item.title), item.description ? h('div', { 'data-part': 'description' }, item.description) : null])));
  },
});
`),
  write('packages/react/src/components/descriptions/descriptions.tsx', `import type { ReactNode } from 'react';
export function Descriptions({ title, items = [], columns = 2 }: { title?: ReactNode; items?: Array<{ label: ReactNode; value: ReactNode }>; columns?: number; }) {
  return (
    <div data-dui="descriptions">
      {title ? <h3 data-part="title">{title}</h3> : null}
      <dl style={{ ['--dui-descriptions-columns' as string]: String(columns) }}>
        {items.map((item, index) => (
          <div key={index} data-part="item">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
`),
  write('packages/vue/src/components/descriptions/descriptions.ts', `import { defineComponent, h, type PropType } from 'vue';
export const Descriptions = defineComponent({
  name: 'DuiDescriptions',
  props: { title: { type: String, default: undefined }, items: { type: Array as PropType<Array<{ label: string; value: string }>>, default: () => [] }, columns: { type: Number, default: 2 } },
  setup(props) {
    return () => h('div', { 'data-dui': 'descriptions' }, [
      props.title ? h('h3', { 'data-part': 'title' }, props.title) : null,
      h('dl', { style: { '--dui-descriptions-columns': String(props.columns) } }, props.items.map((item) => h('div', { 'data-part': 'item' }, [h('dt', item.label), h('dd', item.value)]))),
    ]);
  },
});
`),
  write('packages/react/src/components/steps/steps.tsx', `import type { ReactNode } from 'react';
export function Steps({ items = [], current = 0 }: { items?: Array<{ title: ReactNode; description?: ReactNode }>; current?: number; }) {
  return (
    <ol data-dui="steps">
      {items.map((item, index) => (
        <li key={index} data-status={index < current ? 'done' : index === current ? 'process' : 'wait'}>
          <span data-part="index">{index + 1}</span>
          <span data-part="title">{item.title}</span>
          {item.description ? <span data-part="description">{item.description}</span> : null}
        </li>
      ))}
    </ol>
  );
}
`),
  write('packages/vue/src/components/steps/steps.ts', `import { defineComponent, h, type PropType } from 'vue';
export const Steps = defineComponent({
  name: 'DuiSteps',
  props: { items: { type: Array as PropType<Array<{ title: string; description?: string }>>, default: () => [] }, current: { type: Number, default: 0 } },
  setup(props) {
    return () => h('ol', { 'data-dui': 'steps' }, props.items.map((item, index) => h('li', { 'data-status': index < props.current ? 'done' : index === props.current ? 'process' : 'wait' }, [
      h('span', { 'data-part': 'index' }, index + 1),
      h('span', { 'data-part': 'title' }, item.title),
      item.description ? h('span', { 'data-part': 'description' }, item.description) : null,
    ])));
  },
});
`),
  write('packages/react/src/components/bottom-sheet/bottom-sheet.tsx', `${reactHead}
export function BottomSheet({ open, defaultOpen = false, title, onOpenChange, children }: { open?: boolean; defaultOpen?: boolean; title?: string; onOpenChange?: (next: boolean) => void; children?: ReactNode; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const visible = isControlled(open) ? Boolean(open) : uncontrolled;
  const set = (next: boolean) => { if (!isControlled(open)) setUncontrolled(next); onOpenChange?.(next); };
  if (!visible) return null;
  return (
    <div data-dui="bottom-sheet">
      <div data-part="backdrop" onClick={() => set(false)} />
      <div role="dialog" data-part="content">
        {title ? <h3 data-part="title">{title}</h3> : null}
        {children}
      </div>
    </div>
  );
}
`),
  write('packages/vue/src/components/bottom-sheet/bottom-sheet.ts', `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
export const BottomSheet = defineComponent({
  name: 'DuiBottomSheet',
  props: { open: { type: Boolean, default: undefined }, defaultOpen: { type: Boolean, default: false }, title: { type: String, default: undefined } },
  emits: { 'update:open': (_v: boolean) => true },
  setup(props, { emit, slots }) {
    const uncontrolled = ref(props.defaultOpen);
    return () => {
      const visible = isControlled(props.open) ? Boolean(props.open) : uncontrolled.value;
      const set = (next: boolean) => { if (!isControlled(props.open)) uncontrolled.value = next; emit('update:open', next); };
      if (!visible) return null;
      return h('div', { 'data-dui': 'bottom-sheet' }, [
        h('div', { 'data-part': 'backdrop', onClick: () => set(false) }),
        h('div', { role: 'dialog', 'data-part': 'content' }, [props.title ? h('h3', { 'data-part': 'title' }, props.title) : null, slots.default?.()]),
      ]);
    };
  },
});
`),
  write('packages/react/src/components/tab-bar/tab-bar.tsx', `${reactHead}
export function TabBar({ items = [], value, defaultValue, onValueChange }: { items?: Array<{ value: string; label: ReactNode }>; value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? items[0]?.value);
  const current = isControlled(value) ? value : uncontrolled;
  return (
    <nav data-dui="tab-bar">
      {items.map((item) => (
        <button key={item.value} type="button" data-active={presence(item.value === current)} onClick={() => { if (!isControlled(value)) setUncontrolled(item.value); onValueChange?.(item.value); }}>{item.label}</button>
      ))}
    </nav>
  );
}
`),
  write('packages/vue/src/components/tab-bar/tab-bar.ts', `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const TabBar = defineComponent({
  name: 'DuiTabBar',
  props: { items: { type: Array as PropType<Array<{ value: string; label: string }>>, default: () => [] }, modelValue: { type: String, default: undefined } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.items[0]?.value);
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      return h('nav', { 'data-dui': 'tab-bar' }, props.items.map((item) => h('button', { type: 'button', 'data-active': presence(item.value === current), onClick: () => { if (!isControlled(props.modelValue)) uncontrolled.value = item.value; emit('update:modelValue', item.value); } }, item.label)));
    };
  },
});
`),
  write('packages/react/src/components/action-sheet/action-sheet.tsx', `${reactHead}
export function ActionSheet({ open, defaultOpen = false, title, actions = [], onOpenChange, onSelect }: { open?: boolean; defaultOpen?: boolean; title?: string; actions?: Array<{ value: string; label: ReactNode; danger?: boolean }>; onOpenChange?: (next: boolean) => void; onSelect?: (value: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const visible = isControlled(open) ? Boolean(open) : uncontrolled;
  const set = (next: boolean) => { if (!isControlled(open)) setUncontrolled(next); onOpenChange?.(next); };
  if (!visible) return null;
  return (
    <div data-dui="action-sheet">
      <div data-part="backdrop" onClick={() => set(false)} />
      <div role="dialog" data-part="content">
        {title ? <div data-part="title">{title}</div> : null}
        {actions.map((action) => (
          <button key={action.value} type="button" data-danger={presence(action.danger)} onClick={() => { onSelect?.(action.value); set(false); }}>{action.label}</button>
        ))}
        <button type="button" data-part="cancel" onClick={() => set(false)}>取消</button>
      </div>
    </div>
  );
}
`),
  write('packages/vue/src/components/action-sheet/action-sheet.ts', `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const ActionSheet = defineComponent({
  name: 'DuiActionSheet',
  props: { open: { type: Boolean, default: undefined }, defaultOpen: { type: Boolean, default: false }, title: { type: String, default: undefined }, actions: { type: Array as PropType<Array<{ value: string; label: string; danger?: boolean }>>, default: () => [] } },
  emits: { 'update:open': (_v: boolean) => true, select: (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultOpen);
    return () => {
      const visible = isControlled(props.open) ? Boolean(props.open) : uncontrolled.value;
      const set = (next: boolean) => { if (!isControlled(props.open)) uncontrolled.value = next; emit('update:open', next); };
      if (!visible) return null;
      return h('div', { 'data-dui': 'action-sheet' }, [
        h('div', { 'data-part': 'backdrop', onClick: () => set(false) }),
        h('div', { role: 'dialog', 'data-part': 'content' }, [
          props.title ? h('div', { 'data-part': 'title' }, props.title) : null,
          ...props.actions.map((action) => h('button', { type: 'button', 'data-danger': presence(action.danger), onClick: () => { emit('select', action.value); set(false); } }, action.label)),
          h('button', { type: 'button', 'data-part': 'cancel', onClick: () => set(false) }, '取消'),
        ]),
      ]);
    };
  },
});
`),
  write('packages/react/src/components/safe-area/safe-area.tsx', `import type { ReactNode } from 'react';
export function SafeArea({ edges = ['bottom'], children }: { edges?: Array<'top' | 'bottom' | 'start' | 'end'>; children?: ReactNode; }) {
  return <div data-dui="safe-area" data-edges={edges.join(' ')}>{children}</div>;
}
`),
  write('packages/vue/src/components/safe-area/safe-area.ts', `import { defineComponent, h, type PropType } from 'vue';
export const SafeArea = defineComponent({
  name: 'DuiSafeArea',
  props: { edges: { type: Array as PropType<Array<'top' | 'bottom' | 'start' | 'end'>>, default: () => ['bottom'] } },
  setup(props, { slots }) {
    return () => h('div', { 'data-dui': 'safe-area', 'data-edges': props.edges.join(' ') }, slots.default?.());
  },
});
`),
]);

console.log('batch B written');
