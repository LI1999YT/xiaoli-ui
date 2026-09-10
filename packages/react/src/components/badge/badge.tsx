import type { HTMLAttributes, ReactNode } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface BadgeProps extends StyledParts<'root' | 'indicator'>, Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'> {
  count?: number | string;
  max?: number;
  showZero?: boolean;
  dot?: boolean;
  status?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  children?: ReactNode;
}

export function Badge({
  count,
  max = 99,
  showZero = false,
  dot = false,
  status = 'danger',
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: BadgeProps) {
  const config = useDuiConfigOptional();
  const numeric = typeof count === 'number';
  const hidden = !dot && (count === undefined || (count === 0 && !showZero) || count === '');
  const text = numeric && (count as number) > max ? `${max}+` : count;
  return (
    <span
      {...rest}
      data-dui="badge"
      data-status={status}
      data-dot={presence(dot)}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      {children}
      {hidden ? null : (
        <span data-part="indicator" className={classNames?.indicator} style={styles?.indicator}>
          {dot ? null : text}
        </span>
      )}
    </span>
  );
}
