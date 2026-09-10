import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';

export function DatePicker({ value, defaultValue = '', onValueChange }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  return (
    <div data-dui="date-picker">
      <input type="date" value={current} onChange={(e) => { if (!isControlled(value)) setUncontrolled(e.target.value); onValueChange?.(e.target.value); }} />
    </div>
  );
}
