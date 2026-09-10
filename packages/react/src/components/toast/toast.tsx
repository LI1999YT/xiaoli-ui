import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { ToastOptions } from '@xiaoli-ui/internal-core';
import { cx, partProps } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfig } from '../config-provider/context';

export type ToastPart = 'viewport' | 'toast' | 'icon' | 'message' | 'action' | 'closeButton';
export type ToastPlacement = 'top' | 'top-end' | 'bottom-end';

export function useToast() {
  const { toastStore } = useDuiConfig();
  return {
    show: (options: ToastOptions) => toastStore.show(options),
    update: (id: string, options: Partial<ToastOptions>) => toastStore.update(id, options),
    dismiss: (id: string) => toastStore.dismiss(id, 'dismiss'),
    dismissAll: () => toastStore.dismissAll(),
  };
}

export interface ToastViewportProps extends StyledParts<ToastPart> {
  maxVisible?: number;
  placement?: ToastPlacement;
}

export function ToastViewport({
  maxVisible = 3,
  placement = 'top-end',
  className,
  style,
  classNames,
  styles,
}: ToastViewportProps) {
  const { toastStore, portalHost } = useDuiConfig();
  toastStore.maxVisible = maxVisible;
  const items = useSyncExternalStore(
    toastStore.subscribe.bind(toastStore),
    () => toastStore.items,
    () => toastStore.items,
  );

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) toastStore.pause();
      else toastStore.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [toastStore]);

  if (!portalHost) return null;

  return createPortal(
    <div
      data-dui="toast-viewport"
      data-placement={placement}
      className={cx(classNames?.viewport, className)}
      style={{ ...styles?.viewport, ...style }}
      {...partProps('viewport', classNames, styles)}
    >
      {items.map((item) => (
        <div
          key={item.id}
          data-dui="toast"
          data-status={item.status}
          role="status"
          aria-live={item.status === 'error' ? 'assertive' : 'polite'}
          {...partProps('toast', classNames, styles)}
          onMouseEnter={() => toastStore.pause(item.id)}
          onMouseLeave={() => toastStore.resume(item.id)}
          onFocus={() => toastStore.pause(item.id)}
          onBlur={() => toastStore.resume(item.id)}
        >
          <div {...partProps('message', classNames, styles)}>{item.message}</div>
          <button
            type="button"
            aria-label="关闭提示"
            {...partProps('closeButton', classNames, styles)}
            onClick={() => toastStore.dismiss(item.id, 'dismiss')}
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    portalHost,
  );
}
