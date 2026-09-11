import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { ChangeDetails, Size } from '@xiaoli-ui/tokens';
import { isControlled, warnControlledSwitch } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export type InputPart = 'root' | 'input' | 'prefix' | 'suffix' | 'clearButton';

export interface InputProps
  extends StyledParts<InputPart>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'className' | 'style'> {
  value?: string;
  defaultValue?: string;
  type?: 'text' | 'password' | 'email' | 'url' | 'tel' | 'search';
  size?: Size;
  clearable?: boolean;
  invalid?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onValueChange?: (next: string, details: ChangeDetails) => void;
  onClear?: () => void;
}

export interface InputHandle {
  element: HTMLInputElement | null;
  focus: () => void;
  blur: () => void;
  select: () => void;
}

export const Input = forwardRef<InputHandle, InputProps>(function Input(
  {
    value,
    defaultValue = '',
    type = 'text',
    size,
    clearable = false,
    invalid = false,
    disabled,
    readOnly,
    prefix,
    suffix,
    className,
    style,
    classNames,
    styles,
    unstyled,
    onValueChange,
    onClear,
    onFocus,
    onBlur,
    id,
    name,
    autoComplete,
    inputMode,
    maxLength,
    ...rest
  },
  ref,
) {
  const config = useDuiConfigOptional();
  const inner = useRef<HTMLInputElement>(null);
  const controlled = isControlled(value);
  const modeRef = useRef(controlled);
  warnControlledSwitch('Input', modeRef.current, controlled);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = controlled ? (value as string) : uncontrolled;
  const composing = useRef(false);
  const resolvedSize = size ?? config?.size ?? 'md';
  const isUnstyled = unstyled ?? config?.unstyled ?? false;

  useImperativeHandle(ref, () => ({
    element: inner.current,
    focus: () => inner.current?.focus(),
    blur: () => inner.current?.blur(),
    select: () => inner.current?.select(),
  }));

  const emit = (next: string, details: ChangeDetails) => {
    if (!controlled) setUncontrolled(next);
    onValueChange?.(next, details);
  };

  return (
    <div
      data-dui="input"
      data-size={resolvedSize}
      data-invalid={presence(invalid)}
      data-disabled={presence(disabled)}
      data-unstyled={presence(isUnstyled)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
      onPointerDown={(event) => {
        const target = event.target as HTMLElement;
        if (inner.current?.contains(target) || target.closest('[data-part="clearButton"]')) return;
        inner.current?.focus();
      }}
    >
      {prefix ? <span {...partProps('prefix', classNames, styles)}>{prefix}</span> : null}
      <input
        {...rest}
        ref={inner}
        id={id}
        name={name}
        type={type}
        value={current}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={invalid || undefined}
        {...partProps('input', classNames, styles)}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          emit(event.currentTarget.value, { reason: 'input', originalEvent: event.nativeEvent });
        }}
        onChange={(event) => {
          emit(event.currentTarget.value, { reason: 'input', originalEvent: event.nativeEvent });
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {clearable && current && !disabled && !readOnly ? (
        <button
          type="button"
          aria-label="清空"
          {...partProps('clearButton', classNames, styles)}
          onClick={(event) => {
            emit('', { reason: 'clear', originalEvent: event.nativeEvent });
            onClear?.();
            inner.current?.focus();
          }}
        >
          ×
        </button>
      ) : null}
      {suffix ? <span {...partProps('suffix', classNames, styles)}>{suffix}</span> : null}
    </div>
  );
});
