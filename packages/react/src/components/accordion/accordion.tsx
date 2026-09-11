import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

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
