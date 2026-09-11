import { type ReactNode } from 'react';
export function Watermark({ text = 'Xiaoli', children }: { text?: string; children?: ReactNode; }) {
  return <div data-dui="watermark" style={{ ['--dui-watermark-text' as string]: `"${text}"` }}>{children}</div>;
}
