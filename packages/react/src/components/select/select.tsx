import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface SelectOption<K extends string | number = string> {
  value: K;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends StyledParts<'root' | 'trigger' | 'listbox' | 'option' | 'clearButton'> {
  value?: string | number | null;
  defaultValue?: string | number | null;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  invalid?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onValueChange?: (next: string | number | null) => void;
  onOpenChange?: (next: boolean) => void;
}

export function Select({
  value,
  defaultValue = null,
  options = [],
  placeholder = '请选择',
  disabled,
  clearable,
  invalid,
  open,
  defaultOpen = false,
  onValueChange,
  onOpenChange,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: SelectProps) {
  const config = useDuiConfigOptional();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState<string | number | null>(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const current = isControlled(value) ? (value ?? null) : uncontrolled;
  const isOpen = isControlled(open) ? Boolean(open) : uncontrolledOpen;
  const selected = options.find((item) => item.value === current);

  const setOpen = (next: boolean) => {
    if (!isControlled(open)) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const setValue = (next: string | number | null) => {
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
    setOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onDoc = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [isOpen]);

  const enabled = useMemo(() => options.filter((item) => !item.disabled), [options]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!isOpen);
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setOpen(true);
        return;
      }
      const index = enabled.findIndex((item) => item.value === current);
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next = enabled[(index + delta + enabled.length) % enabled.length];
      if (next) setValue(next.value);
    }
  };

  return (
    <div
      ref={rootRef}
      data-dui="select"
      data-invalid={presence(invalid)}
      data-disabled={presence(disabled)}
      data-open={presence(isOpen)}
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={onKeyDown}
      >
        <span data-part="value">{selected ? selected.label : placeholder}</span>
        {clearable && current != null && !disabled ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="清空"
            data-part="clearButton"
            onClick={(event) => {
              event.stopPropagation();
              setValue(null);
            }}
          >
            ×
          </span>
        ) : (
          <span data-part="arrow" aria-hidden>
            ▾
          </span>
        )}
      </button>
      {isOpen ? (
        <ul id={listId} role="listbox" data-part="listbox" className={classNames?.listbox} style={styles?.listbox}>
          {options.map((item) => (
            <li
              key={String(item.value)}
              role="option"
              aria-selected={item.value === current}
              aria-disabled={item.disabled || undefined}
              data-part="option"
              data-selected={presence(item.value === current)}
              data-disabled={presence(item.disabled)}
              className={classNames?.option}
              style={styles?.option}
              onClick={() => {
                if (!item.disabled) setValue(item.value);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
