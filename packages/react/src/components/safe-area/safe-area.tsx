import type { ReactNode } from 'react';
export function SafeArea({ edges = ['bottom'], children }: { edges?: Array<'top' | 'bottom' | 'start' | 'end'>; children?: ReactNode; }) {
  return <div data-dui="safe-area" data-edges={edges.join(' ')}>{children}</div>;
}
