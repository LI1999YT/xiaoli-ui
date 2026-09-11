import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

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
