import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

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
