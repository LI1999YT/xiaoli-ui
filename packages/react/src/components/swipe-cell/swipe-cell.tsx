import { useState, type ReactNode } from 'react';
import { presence } from '../../utils/dom';
export function SwipeCell({ actions = [], children }: { actions?: Array<{ key: string; label: ReactNode; onClick?: () => void }>; children?: ReactNode; }) {
  const [open, setOpen] = useState(false);
  return <div data-dui="swipe-cell" data-open={presence(open)}><div data-part="content" onClick={() => setOpen(!open)}>{children}</div><div data-part="actions">{actions.map((a) => <button key={a.key} type="button" onClick={a.onClick}>{a.label}</button>)}</div></div>;
}
