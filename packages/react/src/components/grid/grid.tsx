import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { resolveSpace } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface GridProps extends StyledParts<'root'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  columns?: number;
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  children?: ReactNode;
}

export interface GridItemProps extends StyledParts<'root'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  span?: number;
  offset?: number;
  children?: ReactNode;
}

export function Grid({
  columns = 12,
  gap = 4,
  align = 'stretch',
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: GridProps) {
  const config = useDuiConfigOptional();
  return (
    <div
      {...rest}
      data-dui="grid"
      data-align={align}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={
        {
          ...styles?.root,
          ...style,
          ['--dui-grid-columns' as string]: String(columns),
          ['--dui-grid-gap' as string]: resolveSpace(gap),
        } as CSSProperties
      }
      {...partProps('root', classNames, styles)}
    >
      {children}
    </div>
  );
}

export function GridItem({
  span,
  offset = 0,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: GridItemProps) {
  const config = useDuiConfigOptional();
  return (
    <div
      {...rest}
      data-dui="grid-item"
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={
        {
          ...styles?.root,
          ...style,
          ['--dui-grid-span' as string]: String(span ?? 'auto'),
          ['--dui-grid-offset' as string]: String(offset),
        } as CSSProperties
      }
      {...partProps('root', classNames, styles)}
    >
      {children}
    </div>
  );
}
