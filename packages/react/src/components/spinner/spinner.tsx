import type { HTMLAttributes } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface SpinnerProps extends StyledParts<'root'>, Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'> {
  size?: 'sm' | 'md' | 'lg' | string;
  label?: string;
  inline?: boolean;
  visible?: boolean;
}

export function Spinner({
  size = 'md',
  label = '加载中',
  inline = true,
  visible = true,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: SpinnerProps) {
  const config = useDuiConfigOptional();
  if (!visible) return null;
  const customSize = size !== 'sm' && size !== 'md' && size !== 'lg' ? size : undefined;
  return (
    <span
      {...rest}
      role="status"
      data-dui="spinner"
      data-size={typeof size === 'string' && ['sm', 'md', 'lg'].includes(size) ? size : 'md'}
      data-inline={presence(inline)}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style, ...(customSize ? { width: customSize, height: customSize } : null) }}
      {...partProps('root', classNames, styles)}
    >
      <span className="dui-visually-hidden">{label}</span>
    </span>
  );
}
