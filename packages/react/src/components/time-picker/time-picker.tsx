import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';

export function TimePicker({ value, defaultValue = '', onValueChange }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  return (
    <div data-dui="time-picker">
      <input type="time" value={current} onChange={(e) => { if (!isControlled(value)) setUncontrolled(e.target.value); onValueChange?.(e.target.value); }} />
    </div>
  );
}
