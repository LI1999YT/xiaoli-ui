import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface SkeletonProps extends StyledParts<'root'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  loading?: boolean;
  rows?: number;
  shape?: 'text' | 'rect' | 'circle';
  width?: string;
  height?: string;
  animated?: boolean;
  children?: ReactNode;
}

export function Skeleton({
  loading = true,
  rows = 3,
  shape = 'text',
  width,
  height,
  animated = true,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: SkeletonProps) {
  const config = useDuiConfigOptional();
  if (!loading) return <>{children}</>;
  return (
    <div
      {...rest}
      data-dui="skeleton"
      data-shape={shape}
      data-animated={presence(animated)}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style, width, height } as CSSProperties}
      {...partProps('root', classNames, styles)}
      aria-hidden="true"
    >
      {shape === 'text'
        ? Array.from({ length: rows }, (_, index) => <span key={index} data-part="row" />)
        : null}
    </div>
  );
}
