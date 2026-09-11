import { type ReactNode } from 'react';
export function ScrollArea({ children, height = 200 }: { children?: ReactNode; height?: number; }) {
  return <div data-dui="scroll-area" style={{ height }}>{children}</div>;
}
