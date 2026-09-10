import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

interface GroupCtx {
  value: string | null;
  name: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
}

const Ctx = createContext<GroupCtx | null>(null);

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export function RadioGroup({
  value,
  defaultValue = null,
  name,
  disabled,
  orientation = 'horizontal',
  options,
  onValueChange,
  children,
}: {
  value?: string | null;
  defaultValue?: string | null;
  name?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  options?: RadioOption[];
  onValueChange?: (next: string) => void;
  children?: ReactNode;
}) {
  const autoName = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value ?? null) : uncontrolled;
  return (
    <Ctx.Provider
      value={{
        value: current,
        name: name ?? autoName,
        disabled,
        onSelect: (next) => {
          if (!isControlled(value)) setUncontrolled(next);
          onValueChange?.(next);
        },
      }}
    >
      <div data-dui="radio" data-part="group" data-orientation={orientation} role="radiogroup">
        {options?.map((item) => (
          <Radio key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </Radio>
        ))}
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function Radio({
  value,
  disabled,
  children,
}: {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}) {
  const group = useContext(Ctx);
  const config = useDuiConfigOptional();
  const checked = group?.value === value;
  const isDisabled = disabled || group?.disabled;
  return (
    <label data-dui="radio" data-state={checked ? 'checked' : 'unchecked'} data-unstyled={presence(config?.unstyled ?? false)}>
      <input
        type="radio"
        name={group?.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        data-part="input"
        className="dui-visually-hidden"
        onChange={() => group?.onSelect(value)}
      />
      <span data-part="control" />
      {children ? <span data-part="label">{children}</span> : null}
    </label>
  );
}
