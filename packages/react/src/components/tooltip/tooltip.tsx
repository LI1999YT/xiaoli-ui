import { useId, useRef, useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface TooltipProps extends StyledParts<'root' | 'trigger' | 'content'> {
  content: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  placement?: 'top' | 'bottom' | 'start' | 'end';
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  children?: ReactNode;
}

export function Tooltip({
  content,
  open,
  defaultOpen = false,
  placement = 'top',
  openDelay = 500,
  closeDelay = 100,
  disabled,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: TooltipProps) {
  const config = useDuiConfigOptional();
  const tipId = useId();
  const timer = useRef<number | undefined>(undefined);
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const visible = isControlled(open) ? Boolean(open) : uncontrolled;
  const setOpen = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!isControlled(open)) setUncontrolled(next);
    }, delay);
  };

  return (
    <span
      data-dui="tooltip"
      data-placement={placement}
      data-open={presence(visible && !disabled)}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
      onMouseEnter={() => !disabled && setOpen(true, openDelay)}
      onMouseLeave={() => setOpen(false, closeDelay)}
      onFocus={() => !disabled && setOpen(true, 0)}
      onBlur={() => setOpen(false, closeDelay)}
    >
      <span data-part="trigger" className={classNames?.trigger} style={styles?.trigger} aria-describedby={visible ? tipId : undefined}>
        {children}
      </span>
      {visible && !disabled ? (
        <span id={tipId} role="tooltip" data-part="content" className={classNames?.content} style={styles?.content}>
          {content}
        </span>
      ) : null}
    </span>
  );
}
