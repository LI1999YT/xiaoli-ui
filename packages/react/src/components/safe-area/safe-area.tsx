import { type ReactNode } from 'react';
import { presence } from '../../utils/dom';

export type SafeAreaEdge = 'top' | 'bottom' | 'start' | 'end';

export interface SafeAreaProps {
  edges?: SafeAreaEdge[];
  children?: ReactNode;
}

export function SafeArea({ edges = ['bottom'], children }: SafeAreaProps) {
  return (
    <div
      data-dui="safe-area"
      data-edges={edges.join(' ')}
      data-edge-top={presence(edges.includes('top'))}
      data-edge-bottom={presence(edges.includes('bottom'))}
      data-edge-start={presence(edges.includes('start'))}
      data-edge-end={presence(edges.includes('end'))}
    >
      {children}
    </div>
  );
}
