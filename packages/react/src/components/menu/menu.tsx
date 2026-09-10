import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

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
