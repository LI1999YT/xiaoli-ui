import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, disabled, onValueChange }: { value?: number; defaultValue?: number; min?: number; max?: number; step?: number; disabled?: boolean; onValueChange?: (next: number) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as number) : uncontrolled;
  const commit = (next: number) => { const v = Math.min(max, Math.max(min, next)); if (!isControlled(value)) setUncontrolled(v); onValueChange?.(v); };
  const pct = ((current - min) / (max - min || 1)) * 100;
  return (
    <div data-dui="slider" data-disabled={presence(disabled)}>
      <input type="range" min={min} max={max} step={step} value={current} disabled={disabled} aria-valuenow={current} onChange={(e) => commit(Number(e.target.value))} />
      <span data-part="track"><span data-part="fill" style={{ width: `${pct}%` }} /><span data-part="thumb" style={{ insetInlineStart: `${pct}%` }} /></span>
      <span data-part="value">{current}</span>
    </div>
  );
}
