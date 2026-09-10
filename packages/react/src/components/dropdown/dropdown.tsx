import { useRef, useState, type ReactNode } from 'react';
import { presence } from '../../utils/dom';

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
