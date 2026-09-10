import type { CSSProperties, ReactNode } from 'react';

export interface StyledParts<P extends string> {
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<P, string>>;
  styles?: Partial<Record<P, CSSProperties>>;
  unstyled?: boolean;
}

export type SlotContent = ReactNode;
