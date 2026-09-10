import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface AlertProps extends StyledParts<'root' | 'title' | 'closeButton'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'> {
  status?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  closable?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (next: boolean) => void;
  children?: ReactNode;
}

export function Alert({
  status = 'info',
  title,
  closable = false,
  visible,
  defaultVisible = true,
  onVisibleChange,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: AlertProps) {
  const config = useDuiConfigOptional();
  const [uncontrolled, setUncontrolled] = useState(defaultVisible);
  const shown = isControlled(visible) ? Boolean(visible) : uncontrolled;
  if (!shown) return null;
  return (
    <div
      {...rest}
      role="alert"
      data-dui="alert"
      data-status={status}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      <div>
        {title ? <strong data-part="title">{title}</strong> : null}
        <div data-part="body">{children}</div>
      </div>
      {closable ? (
        <button
          type="button"
          aria-label="关闭"
          data-part="closeButton"
          onClick={() => {
            if (!isControlled(visible)) setUncontrolled(false);
            onVisibleChange?.(false);
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
