import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

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
