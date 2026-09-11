import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps extends StyledParts<'root' | 'list' | 'tab' | 'panel'> {
  value?: string;
  defaultValue?: string;
  items?: TabItem[];
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  variant?: 'line' | 'pill';
  onValueChange?: (next: string) => void;
  children?: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  items = [],
  orientation = 'horizontal',
  activationMode = 'manual',
  variant = 'line',
  onValueChange,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: TabsProps) {
  const config = useDuiConfigOptional();
  const first = items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? '';
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? first);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  const enabled = useMemo(() => items.filter((item) => !item.disabled), [items]);
  const select = (next: string) => {
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const keys = orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const index = enabled.findIndex((item) => item.value === current);
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = enabled[(index + delta + enabled.length) % enabled.length];
    if (!next) return;
    if (activationMode === 'automatic') select(next.value);
    else (event.currentTarget.querySelector(`[data-value="${next.value}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <div
      data-dui="tabs"
      data-orientation={orientation}
      data-variant={variant}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      <div role="tablist" aria-orientation={orientation} data-part="list" className={classNames?.list} style={styles?.list} onKeyDown={onKeyDown}>
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-part="tab"
            data-value={item.value}
            data-active={presence(item.value === current)}
            className={classNames?.tab}
            style={styles?.tab}
            aria-selected={item.value === current}
            disabled={item.disabled}
            tabIndex={item.value === current ? 0 : -1}
            onClick={() => !item.disabled && select(item.value)}
            onFocus={() => {
              if (activationMode === 'automatic' && !item.disabled) select(item.value);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) =>
        item.value === current ? (
          <div key={item.value} role="tabpanel" data-part="panel" className={classNames?.panel} style={styles?.panel}>
            {item.content ?? children}
          </div>
        ) : null,
      )}
    </div>
  );
}
