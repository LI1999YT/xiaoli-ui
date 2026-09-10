import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { OpenChangeDetails } from '@xiaoli-ui/tokens';
import { createId, isControlled } from '@xiaoli-ui/internal-core';
import { dismissTop, focusElement, getFocusable, lockScroll, pushLayer, trapFocus, unlockScroll } from '@xiaoli-ui/internal-dom';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface DrawerProps extends StyledParts<'root' | 'backdrop' | 'content' | 'header' | 'title' | 'body' | 'closeButton'> {
  open?: boolean;
  defaultOpen?: boolean;
  title?: string;
  placement?: 'start' | 'end' | 'top' | 'bottom';
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  onOpenChange?: (next: boolean, details: OpenChangeDetails) => void;
  trigger?: ReactNode;
  children?: ReactNode;
}

export function Drawer({
  open,
  defaultOpen = false,
  title,
  placement = 'end',
  modal = true,
  closeOnEscape = true,
  closeOnOutside = true,
  onOpenChange,
  trigger,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: DrawerProps) {
  const config = useDuiConfigOptional();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);
  const visible = isControlled(open) ? Boolean(open) : uncontrolled;
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const layerId = useRef(createId('drawer'));
  const setOpen = useCallback(
    (next: boolean, details: OpenChangeDetails) => {
      if (!isControlled(open)) setUncontrolled(next);
      onOpenChange?.(next, details);
    },
    [open, onOpenChange],
  );

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted || !visible) return undefined;
    const doc = document;
    if (modal) lockScroll(doc);
    const release = pushLayer(doc, {
      id: layerId.current,
      modal,
      closeOnEscape,
      closeOnOutside,
      content: contentRef.current,
      onDismiss: (reason, event) => setOpen(false, { reason, originalEvent: event }),
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissTop(doc, 'escape', event);
      if (contentRef.current && modal) trapFocus(contentRef.current, event);
    };
    doc.addEventListener('keydown', onKey);
    focusElement(getFocusable(contentRef.current ?? doc.body)[0] ?? contentRef.current);
    return () => {
      doc.removeEventListener('keydown', onKey);
      if (modal) unlockScroll(doc);
      release();
    };
  }, [mounted, visible, modal, closeOnEscape, closeOnOutside, setOpen]);

  const host = config?.portalHost ?? (mounted ? document.body : null);
  const panel =
    visible && mounted && host
      ? createPortal(
          <div
            data-dui="drawer"
            data-placement={placement}
            data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
            className={cx(classNames?.root, className)}
            style={{ ...styles?.root, ...style }}
            {...partProps('root', classNames, styles)}
          >
            {modal ? (
              <div
                data-part="backdrop"
                className={classNames?.backdrop}
                style={styles?.backdrop}
                onClick={(event) => {
                  if (closeOnOutside) setOpen(false, { reason: 'outside', originalEvent: event.nativeEvent });
                }}
              />
            ) : null}
            <div
              ref={contentRef}
              role="dialog"
              aria-modal={modal || undefined}
              aria-labelledby={title ? titleId : undefined}
              data-part="content"
              className={classNames?.content}
              style={styles?.content}
              tabIndex={-1}
            >
              <div data-part="header" className={classNames?.header} style={styles?.header}>
                {title ? (
                  <h2 id={titleId} data-part="title" className={classNames?.title} style={styles?.title}>
                    {title}
                  </h2>
                ) : null}
                <button
                  type="button"
                  aria-label="关闭"
                  data-part="closeButton"
                  className={classNames?.closeButton}
                  style={styles?.closeButton}
                  onClick={(event) => setOpen(false, { reason: 'close-button', originalEvent: event.nativeEvent })}
                >
                  ×
                </button>
              </div>
              <div data-part="body" className={classNames?.body} style={styles?.body}>
                {children}
              </div>
            </div>
          </div>,
          host,
        )
      : null;

  return (
    <>
      {trigger ? (
        <span onClick={(event) => setOpen(!visible, { reason: 'trigger', originalEvent: event.nativeEvent })}>{trigger}</span>
      ) : null}
      {panel}
    </>
  );
}
