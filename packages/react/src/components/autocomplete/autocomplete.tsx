import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';

export function Autocomplete({ options = [], value, defaultValue = '', onValueChange }: { options?: string[]; value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  const filtered = options.filter((item) => item.toLowerCase().includes(current.toLowerCase()));
  const set = (next: string) => { if (!isControlled(value)) setUncontrolled(next); onValueChange?.(next); };
  return (
    <div data-dui="autocomplete">
      <input value={current} aria-autocomplete="list" onFocus={() => setOpen(true)} onChange={(e) => { set(e.target.value); setOpen(true); }} />
      {open && filtered.length > 0 ? (
        <ul role="listbox">
          {filtered.map((item) => <li key={item} role="option" onClick={() => { set(item); setOpen(false); }}>{item}</li>)}
        </ul>
      ) : null}
    </div>
  );
}
