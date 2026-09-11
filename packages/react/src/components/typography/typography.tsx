import { createElement, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export type TypographyAs = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'a' | 'strong' | 'code';
export type TypographyVariant = 'body' | 'heading' | 'caption' | 'code';
export type TypographyTone = 'default' | 'muted' | 'danger' | 'success';

export interface TypographyProps
  extends StyledParts<'root'>,
    Omit<HTMLAttributes<HTMLElement>, 'className' | 'style'> {
  as?: TypographyAs;
  variant?: TypographyVariant;
  size?: string;
  tone?: TypographyTone;
  truncate?: boolean;
  lineClamp?: number;
  href?: string;
  children?: ReactNode;
}

export function Typography({
  as,
  variant = 'body',
  size,
  tone = 'default',
  truncate = false,
  lineClamp,
  href,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: TypographyProps) {
  const config = useDuiConfigOptional();
  const tag = as ?? (href ? 'a' : variant === 'heading' ? 'h3' : variant === 'code' ? 'code' : 'span');
  return createElement(
    tag,
    {
      ...rest,
      ...(tag === 'a' ? { href } : {}),
      'data-dui': 'typography',
      'data-variant': variant,
      'data-tone': tone,
      'data-truncate': presence(truncate),
      'data-unstyled': presence(unstyled ?? config?.unstyled ?? false),
      className: cx(classNames?.root, className),
      style: {
        ...styles?.root,
        ...style,
        ...(size ? { fontSize: size } : null),
        ...(lineClamp ? { WebkitLineClamp: lineClamp, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' } : null),
      } as CSSProperties,
      ...partProps('root', classNames, styles),
    },
    children,
  );
}
