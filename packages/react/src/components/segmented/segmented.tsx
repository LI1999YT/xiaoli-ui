import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

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
