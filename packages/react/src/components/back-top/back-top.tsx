import { useEffect, useState } from 'react';
export function BackTop({ visibilityHeight = 200 }: { visibilityHeight?: number; }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const on = () => setShow(window.scrollY > visibilityHeight); window.addEventListener('scroll', on); return () => window.removeEventListener('scroll', on); }, [visibilityHeight]);
  if (!show) return null;
  return <button type="button" data-dui="back-top" aria-label="回到顶部" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>;
}
