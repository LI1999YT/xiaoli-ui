import { useState, type ReactNode } from 'react';
export function VirtualList({ items = [], itemHeight = 40, height = 200, renderItem }: { items?: unknown[]; itemHeight?: number; height?: number; renderItem?: (item: unknown, index: number) => ReactNode; }) {
  const [scroll, setScroll] = useState(0);
  const start = Math.floor(scroll / itemHeight);
  const count = Math.ceil(height / itemHeight) + 2;
  const slice = items.slice(start, start + count);
  return <div data-dui="virtual-list" style={{ height, overflow: 'auto' }} onScroll={(e) => setScroll((e.target as HTMLDivElement).scrollTop)}><div style={{ height: items.length * itemHeight, position: 'relative' }}>{slice.map((item, i) => <div key={start + i} style={{ position: 'absolute', top: (start + i) * itemHeight, height: itemHeight, insetInline: 0 }}>{renderItem ? renderItem(item, start + i) : String(item)}</div>)}</div></div>;
}
