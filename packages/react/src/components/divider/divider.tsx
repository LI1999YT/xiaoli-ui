import type { HTMLAttributes, ReactNode } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface DividerProps extends StyledParts<'root'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  labelPosition?: 'start' | 'center' | 'end';
  variant?: 'solid' | 'dashed';
  children?: ReactNode;
}

export function Divider({
  orientation = 'horizontal',
  decorative = true,
  labelPosition = 'center',
  variant = 'solid',
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: DividerProps) {
  const config = useDuiConfigOptional();
  return (
    <div
      {...rest}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-dui="divider"
      data-orientation={orientation}
      data-variant={variant}
      data-label-position={labelPosition}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      {children ? <span data-part="label">{children}</span> : null}
    </div>
  );
}
