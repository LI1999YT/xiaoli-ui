import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

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
