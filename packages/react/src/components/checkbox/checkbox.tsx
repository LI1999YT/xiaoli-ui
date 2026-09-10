import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { ChangeDetails, ValueKey } from '@xiaoli-ui/tokens';
import { getNextChecked, isControlled, warnControlledSwitch } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export type CheckboxPart = 'root' | 'input' | 'control' | 'indicator' | 'label';

export interface CheckboxProps
  extends StyledParts<CheckboxPart>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'defaultChecked' | 'onChange' | 'size' | 'className' | 'style' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  value?: ValueKey;
  onCheckedChange?: (next: boolean, details: ChangeDetails) => void;
  children?: ReactNode;
}

export interface CheckboxHandle {
  element: HTMLInputElement | null;
  focus: () => void;
  blur: () => void;
}

interface GroupContext {
  values: ValueKey[];
  disabled?: boolean;
  name?: string;
  onToggle: (value: ValueKey, next: boolean) => void;
}

const GroupCtx = createContext<GroupContext | null>(null);

export const Checkbox = forwardRef<CheckboxHandle, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    indeterminate = false,
    value,
    disabled,
    name,
    required,
    className,
    style,
    classNames,
    styles,
    unstyled,
    onCheckedChange,
    children,
    id,
    ...rest
  },
  ref,
) {
  const config = useDuiConfigOptional();
  const group = useContext(GroupCtx);
  const inner = useRef<HTMLInputElement>(null);
  const groupChecked = group && value !== undefined ? group.values.includes(value) : undefined;
  const modeRef = useRef(isControlled(checked));
  warnControlledSwitch('Checkbox', modeRef.current, isControlled(checked));
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const current = groupChecked ?? (isControlled(checked) ? Boolean(checked) : uncontrolled);
  const isUnstyled = unstyled ?? config?.unstyled ?? false;
  const isDisabled = disabled || group?.disabled;

  useImperativeHandle(ref, () => ({
    element: inner.current,
    focus: () => inner.current?.focus(),
    blur: () => inner.current?.blur(),
  }));

  return (
    <label
      data-dui="checkbox"
      data-state={indeterminate ? 'indeterminate' : current ? 'checked' : 'unchecked'}
      data-disabled={presence(isDisabled)}
      data-unstyled={presence(isUnstyled)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      <input
        {...rest}
        ref={(node) => {
          inner.current = node;
          if (node) node.indeterminate = indeterminate;
        }}
        id={id}
        name={name ?? group?.name}
        type="checkbox"
        checked={current}
        disabled={isDisabled}
        required={required}
        value={value === undefined ? undefined : String(value)}
        aria-checked={indeterminate ? 'mixed' : current}
        {...partProps('input', classNames, styles)}
        onChange={(event) => {
          const next = getNextChecked(current, indeterminate);
          if (!isControlled(checked) && !group) setUncontrolled(next);
          if (group && value !== undefined) group.onToggle(value, next);
          onCheckedChange?.(next, { reason: 'select', originalEvent: event.nativeEvent });
        }}
      />
      <span {...partProps('control', classNames, styles)} aria-hidden="true">
        <span {...partProps('indicator', classNames, styles)}>{indeterminate ? '–' : current ? '✓' : ''}</span>
      </span>
      {children ? <span {...partProps('label', classNames, styles)}>{children}</span> : null}
    </label>
  );
});

export interface CheckboxGroupProps extends StyledParts<'root'> {
  value?: ValueKey[];
  defaultValue?: ValueKey[];
  disabled?: boolean;
  name?: string;
  onValueChange?: (next: ValueKey[], details: ChangeDetails) => void;
  children?: ReactNode;
}

export function CheckboxGroup({
  value,
  defaultValue = [],
  disabled,
  name,
  onValueChange,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: CheckboxGroupProps) {
  const config = useDuiConfigOptional();
  const controlled = isControlled(value);
  const [uncontrolled, setUncontrolled] = useState<ValueKey[]>(defaultValue);
  const current = controlled ? (value as ValueKey[]) : uncontrolled;
  const isUnstyled = unstyled ?? config?.unstyled ?? false;

  return (
    <GroupCtx.Provider
      value={{
        values: current,
        disabled,
        name,
        onToggle: (item, next) => {
          const set = new Set(current);
          if (next) set.add(item);
          else set.delete(item);
          const nextValues = [...set];
          if (!controlled) setUncontrolled(nextValues);
          onValueChange?.(nextValues, { reason: 'select' });
        },
      }}
    >
      <div
        data-dui="checkbox-group"
        data-unstyled={presence(isUnstyled)}
        role="group"
        className={cx(classNames?.root, className)}
        style={{ ...styles?.root, ...style }}
        {...partProps('root', classNames, styles)}
      >
        {children}
      </div>
    </GroupCtx.Provider>
  );
}
