import { useState } from 'react';
export function NoticeBar({ text, closable, onClose }: { text: string; closable?: boolean; onClose?: () => void; }) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return <div data-dui="notice-bar" role="status"><span>{text}</span>{closable ? <button type="button" aria-label="关闭" onClick={() => { setShow(false); onClose?.(); }}>×</button> : null}</div>;
}
