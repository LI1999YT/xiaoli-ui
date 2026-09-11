import { type ReactNode } from 'react';
export function Affix({ offset = 0, children }: { offset?: number; children?: ReactNode; }) {
  return <div data-dui="affix" style={{ top: offset }}>{children}</div>;
}
