import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type { OpenChangeDetails } from '@xiaoli-ui/tokens';
import { createId, isControlled } from '@xiaoli-ui/internal-core';
import { dismissTop, focusElement, getFocusable, lockScroll, pushLayer, trapFocus, unlockScroll } from '@xiaoli-ui/internal-dom';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export type DialogPart =
  | 'root'
  | 'backdrop'
  | 'positioner'
  | 'content'
  | 'header'
  | 'title'
  | 'description'
  | 'body'
  | 'footer'
  | 'closeButton';

export interface DialogProps extends StyledParts<DialogPart> {
  open?: boolean;
  defaultOpen?: boolean;
  title?: string;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  unmountOnExit?: boolean;
  portalContainer?: HTMLElement | (() => HTMLElement | null);
  onOpenChange?: (next: boolean, details: OpenChangeDetails) => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
  trigger?: ReactNode;
  footer?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

export function Dialog({
  open,
  defaultOpen = false,
  title,
  modal = true,
  closeOnEscape = true,
  closeOnOutside = true,
  unmountOnExit = true,
  portalContainer,
  onOpenChange,
  onAfterOpen,
  onAfterClose,
  trigger,
  footer,
  description,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: DialogProps) {
  const config = useDuiConfigOptional();
  const controlled = isControlled(open);
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const visible = controlled ? Boolean(open) : uncontrolled;
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const layerId = useRef(createId('dialog'));
  const isUnstyled = unstyled ?? config?.unstyled ?? false;

  const setOpen = useCallback((next: boolean, details: OpenChangeDetails) => {
    if (!controlled) setUncontrolled(next);
    onOpenChange?.(next, details);
  }, [controlled, onOpenChange]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !visible) return undefined;
    const doc = contentRef.current?.ownerDocument ?? document;
    const content = contentRef.current;
    if (modal) lockScroll(doc);
    const release = pushLayer(doc, {
      id: layerId.current,
      modal,
      closeOnEscape,
      closeOnOutside,
      content,
      onDismiss: (reason, event) => setOpen(false, { reason, originalEvent: event }),
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissTop(doc, 'escape', event);
      }
      if (content && modal) trapFocus(content, event);
    };
    const onPointer = (event: PointerEvent) => {
      if (!closeOnOutside || !content) return;
      if (content.contains(event.target as Node)) return;
      dismissTop(doc, 'outside', event);
    };

    doc.addEventListener('keydown', onKey);
    doc.addEventListener('pointerdown', onPointer);
    const focusables = content ? getFocusable(content) : [];
    focusElement(focusables[0] ?? content ?? null);
    onAfterOpen?.();

    return () => {
      doc.removeEventListener('keydown', onKey);
      doc.removeEventListener('pointerdown', onPointer);
      if (modal) unlockScroll(doc);
      release();
      focusElement(triggerRef.current);
      onAfterClose?.();
    };
  }, [mounted, visible, modal, closeOnEscape, closeOnOutside, onAfterOpen, onAfterClose, setOpen]);

  const host =
    (typeof portalContainer === 'function' ? portalContainer() : portalContainer) ??
    config?.portalHost ??
    (mounted ? document.body : null);

  const dialog = visible && mounted && host
    ? createPortal(
        <div data-dui="dialog" data-part="root" data-unstyled={presence(isUnstyled)} className={cx(classNames?.root, className)} style={{ ...styles?.root, ...style }}>
          {modal ? <div data-dui="dialog" {...partProps('backdrop', classNames, styles)} /> : null}
          <div data-dui="dialog" {...partProps('positioner', classNames, styles)}>
            <div
              ref={contentRef}
              role="dialog"
              aria-modal={modal || undefined}
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={description ? descId : undefined}
              tabIndex={-1}
              data-dui="dialog"
              {...partProps('content', classNames, styles)}
            >
              <div {...partProps('header', classNames, styles)}>
                {title ? (
                  <h2 id={titleId} {...partProps('title', classNames, styles)}>
                    {title}
                  </h2>
                ) : null}
                <button
                  type="button"
                  aria-label="关闭"
                  {...partProps('closeButton', classNames, styles)}
                  onClick={(event) => setOpen(false, { reason: 'close-button', originalEvent: event.nativeEvent })}
                >
                  ×
                </button>
              </div>
              {description ? (
                <div id={descId} {...partProps('description', classNames, styles)}>
                  {description}
                </div>
              ) : null}
              <div {...partProps('body', classNames, styles)}>{children}</div>
              {footer ? <div {...partProps('footer', classNames, styles)}>{footer}</div> : null}
            </div>
          </div>
        </div>,
        host,
      )
    : null;

  if (!visible && unmountOnExit && !trigger) return dialog;

  return (
    <>
      {trigger ? (
        <span
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setOpen(!visible, { reason: 'trigger', originalEvent: event.nativeEvent });
          }}
        >
          {trigger}
        </span>
      ) : null}
      {dialog}
    </>
  );
}
