import { forwardRef, useImperativeHandle, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';
import type { Size } from '@xiaoli-ui/tokens';

export type ButtonVariant = 'solid' | 'outline' | 'soft' | 'ghost' | 'link';
export type ButtonColor = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type ButtonPart = 'root' | 'label' | 'leading' | 'trailing' | 'spinner';

export interface ButtonProps
  extends StyledParts<ButtonPart>, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'className' | 'style'> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: Size;
  loading?: boolean;
  block?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
}

export interface ButtonHandle {
  element: HTMLButtonElement | null;
  focus: () => void;
  blur: () => void;
}

export const Button = forwardRef<ButtonHandle, ButtonProps>(function Button(
  {
    variant = 'solid',
    color = 'primary',
    size,
    loading = false,
    disabled = false,
    block = false,
    htmlType = 'button',
    leading,
    trailing,
    children,
    className,
    style,
    classNames,
    styles,
    unstyled,
    onClick,
    ...rest
  },
  ref,
) {
  const config = useDuiConfigOptional();
  const inner = useRef<HTMLButtonElement>(null);
  const resolvedSize = size ?? config?.size ?? 'md';
  const isUnstyled = unstyled ?? config?.unstyled ?? false;
  const isDisabled = disabled || loading;

  useImperativeHandle(ref, () => ({
    element: inner.current,
    focus: () => inner.current?.focus(),
    blur: () => inner.current?.blur(),
  }));

  return (
    <button
      {...rest}
      {...partProps('root', classNames, styles)}
      ref={inner}
      type={htmlType}
      data-dui="button"
      data-variant={variant}
      data-color={color}
      data-size={resolvedSize}
      data-block={presence(block)}
      data-unstyled={presence(isUnstyled)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading || disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {leading ? <span {...partProps('leading', classNames, styles)}>{leading}</span> : null}
      {loading ? <span {...partProps('spinner', classNames, styles)} aria-hidden="true" /> : null}
      <span {...partProps('label', classNames, styles)}>{children}</span>
      {trailing ? <span {...partProps('trailing', classNames, styles)}>{trailing}</span> : null}
    </button>
  );
});
