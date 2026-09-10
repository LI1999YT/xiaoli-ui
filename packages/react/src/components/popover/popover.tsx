import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface PopoverProps extends StyledParts<'root' | 'trigger' | 'content'> {
  open?: boolean;
  defaultOpen?: boolean;
  placement?: 'top' | 'bottom' | 'start' | 'end';
  title?: string;
  onOpenChange?: (next: boolean) => void;
  trigger?: ReactNode;
  children?: ReactNode;
}

export function Popover({
  open,
  defaultOpen = false,
  placement = 'bottom',
  title,
  onOpenChange,
  trigger,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: PopoverProps) {
  const config = useDuiConfigOptional();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const visible = isControlled(open) ? Boolean(open) : uncontrolled;
  const setOpen = (next: boolean) => {
    if (!isControlled(open)) setUncontrolled(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!visible) return undefined;
    const onDoc = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [visible]);

  return (
    <div
      ref={rootRef}
      data-dui="popover"
      data-placement={placement}
      data-open={presence(visible)}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      <button
        type="button"
        data-part="trigger"
        className={classNames?.trigger}
        style={styles?.trigger}
        aria-expanded={visible}
        aria-controls={panelId}
        onClick={() => setOpen(!visible)}
      >
        {trigger}
      </button>
      {visible ? (
        <div id={panelId} role="dialog" data-part="content" className={classNames?.content} style={styles?.content}>
          {title ? <strong data-part="title">{title}</strong> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
