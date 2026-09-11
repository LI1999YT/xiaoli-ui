import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

export function ActionSheet({ open, defaultOpen = false, title, actions = [], onOpenChange, onSelect }: { open?: boolean; defaultOpen?: boolean; title?: string; actions?: Array<{ value: string; label: ReactNode; danger?: boolean }>; onOpenChange?: (next: boolean) => void; onSelect?: (value: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const visible = isControlled(open) ? Boolean(open) : uncontrolled;
  const set = (next: boolean) => { if (!isControlled(open)) setUncontrolled(next); onOpenChange?.(next); };
  if (!visible) return null;
  return (
    <div data-dui="action-sheet">
      <div data-part="backdrop" onClick={() => set(false)} />
      <div role="dialog" data-part="content">
        {title ? <div data-part="title">{title}</div> : null}
        {actions.map((action) => (
          <button key={action.value} type="button" data-danger={presence(action.danger)} onClick={() => { onSelect?.(action.value); set(false); }}>{action.label}</button>
        ))}
        <button type="button" data-part="cancel" onClick={() => set(false)}>取消</button>
      </div>
    </div>
  );
}
