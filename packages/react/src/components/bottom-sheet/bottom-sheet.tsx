import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';

export function BottomSheet({ open, defaultOpen = false, title, onOpenChange, children }: { open?: boolean; defaultOpen?: boolean; title?: string; onOpenChange?: (next: boolean) => void; children?: ReactNode; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const visible = isControlled(open) ? Boolean(open) : uncontrolled;
  const set = (next: boolean) => { if (!isControlled(open)) setUncontrolled(next); onOpenChange?.(next); };
  if (!visible) return null;
  return (
    <div data-dui="bottom-sheet">
      <div data-part="backdrop" onClick={() => set(false)} />
      <div role="dialog" data-part="content">
        {title ? <h3 data-part="title">{title}</h3> : null}
        {children}
      </div>
    </div>
  );
}
