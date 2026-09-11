import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function write(rel: string, contents: string) {
  const file = path.join(root, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents.endsWith('\n') ? contents : `${contents}\n`);
}

const rh = `import { useMemo, useRef, useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
`;

await Promise.all([
  write('packages/react/src/components/segmented/segmented.tsx', `${rh}
export function Segmented({ options = [], value, defaultValue, disabled, onValueChange }: { options?: Array<{ value: string; label: ReactNode; disabled?: boolean }>; value?: string; defaultValue?: string; disabled?: boolean; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value);
  const current = isControlled(value) ? value : uncontrolled;
  return (
    <div data-dui="segmented" role="radiogroup">
      {options.map((item) => (
        <button key={item.value} type="button" role="radio" aria-checked={item.value === current} data-active={presence(item.value === current)} disabled={disabled || item.disabled} onClick={() => { if (!isControlled(value)) setUncontrolled(item.value); onValueChange?.(item.value); }}>{item.label}</button>
      ))}
    </div>
  );
}
`),
  write('packages/vue/src/components/segmented/segmented.ts', `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Segmented = defineComponent({
  name: 'DuiSegmented',
  props: { options: { type: Array as PropType<Array<{ value: string; label: string; disabled?: boolean }>>, default: () => [] }, modelValue: { type: String, default: undefined }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.options[0]?.value);
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      return h('div', { 'data-dui': 'segmented', role: 'radiogroup' }, props.options.map((item) => h('button', { type: 'button', role: 'radio', 'aria-checked': item.value === current, 'data-active': presence(item.value === current), disabled: props.disabled || item.disabled, onClick: () => { if (!isControlled(props.modelValue)) uncontrolled.value = item.value; emit('update:modelValue', item.value); } }, item.label)));
    };
  },
});
`),
  write('packages/react/src/components/autocomplete/autocomplete.tsx', `${rh}
export function Autocomplete({ options = [], value, defaultValue = '', onValueChange }: { options?: string[]; value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  const filtered = options.filter((item) => item.toLowerCase().includes(current.toLowerCase()));
  const set = (next: string) => { if (!isControlled(value)) setUncontrolled(next); onValueChange?.(next); };
  return (
    <div data-dui="autocomplete">
      <input value={current} aria-autocomplete="list" onFocus={() => setOpen(true)} onChange={(e) => { set(e.target.value); setOpen(true); }} />
      {open && filtered.length > 0 ? (
        <ul role="listbox">
          {filtered.map((item) => <li key={item} role="option" onClick={() => { set(item); setOpen(false); }}>{item}</li>)}
        </ul>
      ) : null}
    </div>
  );
}
`),
  write('packages/vue/src/components/autocomplete/autocomplete.ts', `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
export const Autocomplete = defineComponent({
  name: 'DuiAutocomplete',
  props: { options: { type: Array as PropType<string[]>, default: () => [] }, modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    const open = ref(false);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value;
      const set = (next: string) => { if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); };
      const filtered = props.options.filter((item) => item.toLowerCase().includes(current.toLowerCase()));
      return h('div', { 'data-dui': 'autocomplete' }, [
        h('input', { value: current, 'aria-autocomplete': 'list', onFocus: () => { open.value = true; }, onInput: (e: Event) => { set((e.target as HTMLInputElement).value); open.value = true; } }),
        open.value && filtered.length ? h('ul', { role: 'listbox' }, filtered.map((item) => h('li', { role: 'option', onClick: () => { set(item); open.value = false; } }, item))) : null,
      ]);
    };
  },
});
`),
  write('packages/react/src/components/calendar/calendar.tsx', `${rh}
export function Calendar({ value, defaultValue, onValueChange }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const today = new Date();
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const current = isControlled(value) ? (value as string) : uncontrolled;
  const cursor = current ? new Date(current) : today;
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const pick = (day: number) => {
    const next = \`\${year}-\${String(month + 1).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <div data-dui="calendar">
      <div data-part="caption">{year}年{month + 1}月</div>
      <div data-part="grid">
        {['日','一','二','三','四','五','六'].map((d) => <span key={d} data-part="weekday">{d}</span>)}
        {cells.map((day, i) => day ? <button key={i} type="button" data-selected={presence(current.endsWith(\`-\${String(day).padStart(2,'0')}\`) && current.startsWith(\`\${year}-\${String(month+1).padStart(2,'0')}\`))} onClick={() => pick(day)}>{day}</button> : <span key={i} />)}
      </div>
    </div>
  );
}
`),
  write('packages/vue/src/components/calendar/calendar.ts', `import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Calendar = defineComponent({
  name: 'DuiCalendar',
  props: { modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value;
      const cursor = current ? new Date(current) : new Date();
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const first = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
      const pick = (day: number) => { const next = \`\${year}-\${String(month + 1).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`; if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); };
      return h('div', { 'data-dui': 'calendar' }, [
        h('div', { 'data-part': 'caption' }, \`\${year}年\${month + 1}月\`),
        h('div', { 'data-part': 'grid' }, [
          ...['日','一','二','三','四','五','六'].map((d) => h('span', { 'data-part': 'weekday' }, d)),
          ...cells.map((day, i) => day ? h('button', { type: 'button', 'data-selected': presence(current.includes(\`-\${String(day).padStart(2, '0')}\`)), onClick: () => pick(day) }, day) : h('span', { key: i })),
        ]),
      ]);
    };
  },
});
`),
  write('packages/react/src/components/notification/notification.tsx', `${rh}
export function Notification({ title, description, status = 'info', onClose }: { title: string; description?: string; status?: 'info' | 'success' | 'warning' | 'error'; onClose?: () => void; }) {
  return (
    <div data-dui="notification" data-status={status} role="status">
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      <button type="button" aria-label="关闭" onClick={onClose}>×</button>
    </div>
  );
}
`),
  write('packages/vue/src/components/notification/notification.ts', `import { defineComponent, h, type PropType } from 'vue';
export const Notification = defineComponent({
  name: 'DuiNotification',
  props: { title: { type: String, required: true }, description: { type: String, default: undefined }, status: { type: String as PropType<'info' | 'success' | 'warning' | 'error'>, default: 'info' } },
  emits: { close: () => true },
  setup(props, { emit }) {
    return () => h('div', { 'data-dui': 'notification', 'data-status': props.status, role: 'status' }, [
      h('strong', props.title),
      props.description ? h('p', props.description) : null,
      h('button', { type: 'button', 'aria-label': '关闭', onClick: () => emit('close') }, '×'),
    ]);
  },
});
`),
]);

const p2: Array<[string, string, string]> = [
  ['tree', `export function Tree({ data = [], value, onValueChange }: { data?: Array<{ key: string; title: string; children?: Array<{ key: string; title: string }> }>; value?: string; onValueChange?: (next: string) => void; }) {
  return <ul data-dui="tree">{data.map((n) => <li key={n.key}><button type="button" data-active={n.key===value} onClick={() => onValueChange?.(n.key)}>{n.title}</button>{n.children ? <ul>{n.children.map((c) => <li key={c.key}><button type="button" data-active={c.key===value} onClick={() => onValueChange?.(c.key)}>{c.title}</button></li>)}</ul> : null}</li>)}</ul>;
}`, `export const Tree = defineComponent({ name: 'DuiTree', props: { data: { type: Array, default: () => [] }, modelValue: { type: String, default: undefined } }, emits: { 'update:modelValue': (_v: string) => true }, setup(p, { emit }) { return () => h('ul', { 'data-dui': 'tree' }, (p.data as any[]).map((n) => h('li', [h('button', { type: 'button', onClick: () => emit('update:modelValue', n.key) }, n.title), n.children ? h('ul', n.children.map((c: any) => h('li', [h('button', { type: 'button', onClick: () => emit('update:modelValue', c.key) }, c.title)]))) : null]))); } });`],
  ['tree-select', `export function TreeSelect({ options = [], value, onValueChange }: { options?: Array<{ value: string; label: string }>; value?: string; onValueChange?: (next: string) => void; }) {
  return <select data-dui="tree-select" value={value ?? ''} onChange={(e) => onValueChange?.(e.target.value)}><option value="">请选择</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}`, `export const TreeSelect = defineComponent({ name: 'DuiTreeSelect', props: { options: { type: Array, default: () => [] }, modelValue: { type: String, default: '' } }, emits: { 'update:modelValue': (_v: string) => true }, setup(p, { emit }) { return () => h('select', { 'data-dui': 'tree-select', value: p.modelValue, onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value) }, [h('option', { value: '' }, '请选择'), ...(p.options as any[]).map((o) => h('option', { value: o.value }, o.label))]); } });`],
  ['cascader', `export function Cascader({ options = [], value = [], onValueChange }: { options?: Array<{ value: string; label: string; children?: Array<{ value: string; label: string }> }>; value?: string[]; onValueChange?: (next: string[]) => void; }) {
  const [one, two] = value; const child = options.find((o) => o.value === one)?.children ?? [];
  return <div data-dui="cascader"><select value={one ?? ''} onChange={(e) => onValueChange?.([e.target.value])}><option value="">一级</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select><select value={two ?? ''} onChange={(e) => onValueChange?.([one ?? '', e.target.value])}><option value="">二级</option>{child.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}`, `export const Cascader = defineComponent({ name: 'DuiCascader', props: { options: { type: Array, default: () => [] }, modelValue: { type: Array, default: () => [] } }, emits: { 'update:modelValue': (_v: string[]) => true }, setup(p, { emit }) { return () => { const v = (p.modelValue as string[]) ?? []; const child = ((p.options as any[]).find((o) => o.value === v[0])?.children) ?? []; return h('div', { 'data-dui': 'cascader' }, [h('select', { value: v[0] ?? '', onChange: (e: Event) => emit('update:modelValue', [(e.target as HTMLSelectElement).value]) }, [h('option', { value: '' }, '一级'), ...(p.options as any[]).map((o) => h('option', { value: o.value }, o.label))]), h('select', { value: v[1] ?? '', onChange: (e: Event) => emit('update:modelValue', [v[0] ?? '', (e.target as HTMLSelectElement).value]) }, [h('option', { value: '' }, '二级'), ...child.map((o: any) => h('option', { value: o.value }, o.label))])]); }; } });`],
  ['transfer', `export function Transfer({ data = [], value = [], onValueChange }: { data?: Array<{ key: string; title: string }>; value?: string[]; onValueChange?: (next: string[]) => void; }) {
  const selected = new Set(value);
  const move = (key: string, toTarget: boolean) => { const next = new Set(selected); if (toTarget) next.add(key); else next.delete(key); onValueChange?.([...next]); };
  return <div data-dui="transfer"><ul>{data.filter((i) => !selected.has(i.key)).map((i) => <li key={i.key}><button type="button" onClick={() => move(i.key, true)}>{i.title} →</button></li>)}</ul><ul>{data.filter((i) => selected.has(i.key)).map((i) => <li key={i.key}><button type="button" onClick={() => move(i.key, false)}>← {i.title}</button></li>)}</ul></div>;
}`, `export const Transfer = defineComponent({ name: 'DuiTransfer', props: { data: { type: Array, default: () => [] }, modelValue: { type: Array, default: () => [] } }, emits: { 'update:modelValue': (_v: string[]) => true }, setup(p, { emit }) { return () => { const selected = new Set(p.modelValue as string[]); const data = p.data as any[]; return h('div', { 'data-dui': 'transfer' }, [h('ul', data.filter((i) => !selected.has(i.key)).map((i) => h('li', [h('button', { type: 'button', onClick: () => emit('update:modelValue', [...selected, i.key]) }, i.title + ' →')]))), h('ul', data.filter((i) => selected.has(i.key)).map((i) => h('li', [h('button', { type: 'button', onClick: () => emit('update:modelValue', [...selected].filter((k) => k !== i.key)) }, '← ' + i.title)])))]); }; } });`],
  ['carousel', `export function Carousel({ items = [], children }: { items?: ReactNode[]; children?: ReactNode; }) {
  const slides = items.length ? items : (Array.isArray(children) ? children : children ? [children] : []);
  const [index, setIndex] = useState(0);
  return <div data-dui="carousel"><button type="button" aria-label="上一张" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}>‹</button><div data-part="viewport">{slides[index]}</div><button type="button" aria-label="下一张" onClick={() => setIndex((i) => (i + 1) % slides.length)}>›</button></div>;
}`, `export const Carousel = defineComponent({ name: 'DuiCarousel', setup(_, { slots }) { const index = ref(0); return () => { const slides = slots.default?.() ?? []; return h('div', { 'data-dui': 'carousel' }, [h('button', { type: 'button', 'aria-label': '上一张', onClick: () => { index.value = (index.value - 1 + slides.length) % slides.length; } }, '‹'), h('div', { 'data-part': 'viewport' }, slides[index.value]), h('button', { type: 'button', 'aria-label': '下一张', onClick: () => { index.value = (index.value + 1) % slides.length; } }, '›')]); }; } });`],
  ['timeline', `export function Timeline({ items = [] }: { items?: Array<{ title: ReactNode; description?: ReactNode }>; }) {
  return <ol data-dui="timeline">{items.map((item, i) => <li key={i}><span data-part="dot" /><div><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</div></li>)}</ol>;
}`, `export const Timeline = defineComponent({ name: 'DuiTimeline', props: { items: { type: Array, default: () => [] } }, setup(p) { return () => h('ol', { 'data-dui': 'timeline' }, (p.items as any[]).map((item) => h('li', [h('span', { 'data-part': 'dot' }), h('div', [h('strong', item.title), item.description ? h('p', item.description) : null])]))); } });`],
  ['anchor', `export function Anchor({ items = [] }: { items?: Array<{ href: string; label: ReactNode }>; }) {
  return <nav data-dui="anchor">{items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>;
}`, `export const Anchor = defineComponent({ name: 'DuiAnchor', props: { items: { type: Array, default: () => [] } }, setup(p) { return () => h('nav', { 'data-dui': 'anchor' }, (p.items as any[]).map((item) => h('a', { href: item.href }, item.label))); } });`],
  ['affix', `export function Affix({ offset = 0, children }: { offset?: number; children?: ReactNode; }) {
  return <div data-dui="affix" style={{ top: offset }}>{children}</div>;
}`, `export const Affix = defineComponent({ name: 'DuiAffix', props: { offset: { type: Number, default: 0 } }, setup(p, { slots }) { return () => h('div', { 'data-dui': 'affix', style: { top: p.offset + 'px' } }, slots.default?.()); } });`],
  ['scroll-area', `export function ScrollArea({ children, height = 200 }: { children?: ReactNode; height?: number; }) {
  return <div data-dui="scroll-area" style={{ height }}>{children}</div>;
}`, `export const ScrollArea = defineComponent({ name: 'DuiScrollArea', props: { height: { type: Number, default: 200 } }, setup(p, { slots }) { return () => h('div', { 'data-dui': 'scroll-area', style: { height: p.height + 'px' } }, slots.default?.()); } });`],
  ['back-top', `export function BackTop({ visibilityHeight = 200 }: { visibilityHeight?: number; }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const on = () => setShow(window.scrollY > visibilityHeight); window.addEventListener('scroll', on); return () => window.removeEventListener('scroll', on); }, [visibilityHeight]);
  if (!show) return null;
  return <button type="button" data-dui="back-top" aria-label="回到顶部" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>;
}`, `export const BackTop = defineComponent({ name: 'DuiBackTop', props: { visibilityHeight: { type: Number, default: 200 } }, setup(p) { const show = ref(false); const on = () => { show.value = window.scrollY > p.visibilityHeight; }; onMounted(() => window.addEventListener('scroll', on)); onUnmounted(() => window.removeEventListener('scroll', on)); return () => show.value ? h('button', { type: 'button', 'data-dui': 'back-top', 'aria-label': '回到顶部', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }, '↑') : null; } });`],
  ['pull-refresh', `export function PullRefresh({ onRefresh, children }: { onRefresh?: () => Promise<void> | void; children?: ReactNode; }) {
  const [refreshing, setRefreshing] = useState(false);
  return <div data-dui="pull-refresh" data-refreshing={presence(refreshing)}><button type="button" onClick={async () => { setRefreshing(true); await onRefresh?.(); setRefreshing(false); }}>{refreshing ? '刷新中…' : '下拉刷新'}</button>{children}</div>;
}`, `export const PullRefresh = defineComponent({ name: 'DuiPullRefresh', emits: { refresh: () => true }, setup(_, { emit, slots }) { const refreshing = ref(false); return () => h('div', { 'data-dui': 'pull-refresh' }, [h('button', { type: 'button', onClick: () => { refreshing.value = true; emit('refresh'); refreshing.value = false; } }, refreshing.value ? '刷新中…' : '下拉刷新'), slots.default?.()]); } });`],
  ['infinite-scroll', `export function InfiniteScroll({ onLoadMore, hasMore = true, children }: { onLoadMore?: () => void; hasMore?: boolean; children?: ReactNode; }) {
  return <div data-dui="infinite-scroll">{children}{hasMore ? <button type="button" onClick={onLoadMore}>加载更多</button> : <span>没有更多了</span>}</div>;
}`, `export const InfiniteScroll = defineComponent({ name: 'DuiInfiniteScroll', props: { hasMore: { type: Boolean, default: true } }, emits: { loadMore: () => true }, setup(p, { emit, slots }) { return () => h('div', { 'data-dui': 'infinite-scroll' }, [slots.default?.(), p.hasMore ? h('button', { type: 'button', onClick: () => emit('loadMore') }, '加载更多') : h('span', '没有更多了')]); } });`],
  ['swipe-cell', `export function SwipeCell({ actions = [], children }: { actions?: Array<{ key: string; label: ReactNode; onClick?: () => void }>; children?: ReactNode; }) {
  const [open, setOpen] = useState(false);
  return <div data-dui="swipe-cell" data-open={presence(open)}><div data-part="content" onClick={() => setOpen(!open)}>{children}</div><div data-part="actions">{actions.map((a) => <button key={a.key} type="button" onClick={a.onClick}>{a.label}</button>)}</div></div>;
}`, `export const SwipeCell = defineComponent({ name: 'DuiSwipeCell', props: { actions: { type: Array, default: () => [] } }, setup(p, { slots }) { const open = ref(false); return () => h('div', { 'data-dui': 'swipe-cell', 'data-open': open.value ? '' : undefined }, [h('div', { 'data-part': 'content', onClick: () => { open.value = !open.value; } }, slots.default?.()), h('div', { 'data-part': 'actions' }, (p.actions as any[]).map((a) => h('button', { type: 'button', onClick: a.onClick }, a.label)))]); } });`],
  ['notice-bar', `export function NoticeBar({ text, closable, onClose }: { text: string; closable?: boolean; onClose?: () => void; }) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return <div data-dui="notice-bar" role="status"><span>{text}</span>{closable ? <button type="button" aria-label="关闭" onClick={() => { setShow(false); onClose?.(); }}>×</button> : null}</div>;
}`, `export const NoticeBar = defineComponent({ name: 'DuiNoticeBar', props: { text: { type: String, required: true }, closable: { type: Boolean, default: false } }, emits: { close: () => true }, setup(p, { emit }) { const show = ref(true); return () => show.value ? h('div', { 'data-dui': 'notice-bar', role: 'status' }, [h('span', p.text), p.closable ? h('button', { type: 'button', 'aria-label': '关闭', onClick: () => { show.value = false; emit('close'); } }, '×') : null]) : null; } });`],
  ['virtual-list', `export function VirtualList({ items = [], itemHeight = 40, height = 200, renderItem }: { items?: unknown[]; itemHeight?: number; height?: number; renderItem?: (item: unknown, index: number) => ReactNode; }) {
  const [scroll, setScroll] = useState(0);
  const start = Math.floor(scroll / itemHeight);
  const count = Math.ceil(height / itemHeight) + 2;
  const slice = items.slice(start, start + count);
  return <div data-dui="virtual-list" style={{ height, overflow: 'auto' }} onScroll={(e) => setScroll((e.target as HTMLDivElement).scrollTop)}><div style={{ height: items.length * itemHeight, position: 'relative' }}>{slice.map((item, i) => <div key={start + i} style={{ position: 'absolute', top: (start + i) * itemHeight, height: itemHeight, insetInline: 0 }}>{renderItem ? renderItem(item, start + i) : String(item)}</div>)}</div></div>;
}`, `export const VirtualList = defineComponent({ name: 'DuiVirtualList', props: { items: { type: Array, default: () => [] }, itemHeight: { type: Number, default: 40 }, height: { type: Number, default: 200 } }, setup(p) { const scroll = ref(0); return () => { const start = Math.floor(scroll.value / p.itemHeight); const slice = (p.items as unknown[]).slice(start, start + Math.ceil(p.height / p.itemHeight) + 2); return h('div', { 'data-dui': 'virtual-list', style: { height: p.height + 'px', overflow: 'auto' }, onScroll: (e: Event) => { scroll.value = (e.target as HTMLDivElement).scrollTop; } }, [h('div', { style: { height: (p.items as unknown[]).length * p.itemHeight + 'px', position: 'relative' } }, slice.map((item, i) => h('div', { style: { position: 'absolute', top: (start + i) * p.itemHeight + 'px', height: p.itemHeight + 'px', insetInline: 0 } }, String(item))))]); }; } });`],
  ['search-bar', `export function SearchBar({ value, defaultValue = '', onValueChange, onSearch }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; onSearch?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  const set = (next: string) => { if (!isControlled(value)) setUncontrolled(next); onValueChange?.(next); };
  return <form data-dui="search-bar" onSubmit={(e) => { e.preventDefault(); onSearch?.(current); }}><input type="search" value={current} placeholder="搜索" onChange={(e) => set(e.target.value)} /><button type="submit">搜索</button></form>;
}`, `export const SearchBar = defineComponent({ name: 'DuiSearchBar', props: { modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } }, emits: { 'update:modelValue': (_v: string) => true, search: (_v: string) => true }, setup(p, { emit }) { const uncontrolled = ref(p.defaultValue); return () => { const current = isControlled(p.modelValue) ? (p.modelValue as string) : uncontrolled.value; return h('form', { 'data-dui': 'search-bar', onSubmit: (e: Event) => { e.preventDefault(); emit('search', current); } }, [h('input', { type: 'search', value: current, placeholder: '搜索', onInput: (e: Event) => { const next = (e.target as HTMLInputElement).value; if (!isControlled(p.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); } }), h('button', { type: 'submit' }, '搜索')]); }; } });`],
  ['picker', `export function Picker({ columns = [], value = [], onValueChange }: { columns?: string[][]; value?: string[]; onValueChange?: (next: string[]) => void; }) {
  return <div data-dui="picker">{columns.map((col, i) => <select key={i} value={value[i] ?? col[0]} onChange={(e) => { const next = [...value]; next[i] = e.target.value; onValueChange?.(next); }}>{col.map((opt) => <option key={opt}>{opt}</option>)}</select>)}</div>;
}`, `export const Picker = defineComponent({ name: 'DuiPicker', props: { columns: { type: Array, default: () => [] }, modelValue: { type: Array, default: () => [] } }, emits: { 'update:modelValue': (_v: string[]) => true }, setup(p, { emit }) { return () => h('div', { 'data-dui': 'picker' }, (p.columns as string[][]).map((col, i) => h('select', { value: (p.modelValue as string[])[i] ?? col[0], onChange: (e: Event) => { const next = [...(p.modelValue as string[])]; next[i] = (e.target as HTMLSelectElement).value; emit('update:modelValue', next); } }, col.map((opt) => h('option', opt))))); } });`],
  ['watermark', `export function Watermark({ text = 'Xiaoli', children }: { text?: string; children?: ReactNode; }) {
  return <div data-dui="watermark" style={{ ['--dui-watermark-text' as string]: \`"\${text}"\` }}>{children}</div>;
}`, `export const Watermark = defineComponent({ name: 'DuiWatermark', props: { text: { type: String, default: 'Xiaoli' } }, setup(p, { slots }) { return () => h('div', { 'data-dui': 'watermark', style: { '--dui-watermark-text': JSON.stringify(p.text) } }, slots.default?.()); } });`],
];

const vueImports: Record<string, string> = {
  carousel: `import { defineComponent, h, ref } from 'vue';\n`,
  'back-top': `import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue';\n`,
  'pull-refresh': `import { defineComponent, h, ref } from 'vue';\nimport { presence } from '../../utils';\n`,
  'swipe-cell': `import { defineComponent, h, ref } from 'vue';\n`,
  'notice-bar': `import { defineComponent, h, ref } from 'vue';\n`,
  'virtual-list': `import { defineComponent, h, ref } from 'vue';\n`,
  'search-bar': `import { defineComponent, h, ref } from 'vue';\nimport { isControlled } from '@xiaoli-ui/internal-core';\n`,
};

for (const [name, reactBody, vueBody] of p2) {
  const reactName = name;
  const extraReact = name === 'back-top' ? `import { useEffect, useState } from 'react';\nimport { presence } from '../../utils/dom';\n` : name === 'carousel' || name === 'swipe-cell' || name === 'pull-refresh' || name === 'notice-bar' || name === 'virtual-list' || name === 'search-bar' || name === 'watermark' ? rh : rh;
  await write(`packages/react/src/components/${name}/${name}.tsx`, `${name === 'back-top' ? `import { useEffect, useState } from 'react';\n` : rh}${reactBody}\n`);
  const vi = vueImports[name] ?? `import { defineComponent, h, ref } from 'vue';\n`;
  await write(`packages/vue/src/components/${name}/${name}.ts`, `${vi}${vueBody}\n`);
}

console.log('batch C + P2 written');
