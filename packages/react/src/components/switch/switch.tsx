import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Switch({
  checked,
  defaultChecked = false,
  disabled,
  loading,
  size,
  onCheckedChange,
  children,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onCheckedChange?: (next: boolean) => void;
  children?: ReactNode;
}) {
  const config = useDuiConfigOptional();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const current = isControlled(checked) ? Boolean(checked) : uncontrolled;
  const isDisabled = disabled || loading;
  return (
    <label
      data-dui="switch"
      data-state={current ? 'checked' : 'unchecked'}
      data-size={size ?? config?.size ?? 'md'}
      data-loading={presence(loading)}
      data-unstyled={presence(config?.unstyled ?? false)}
    >
      <input
        type="checkbox"
        role="switch"
        data-part="input"
        className="dui-visually-hidden"
        checked={current}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onChange={() => {
          const next = !current;
          if (!isControlled(checked)) setUncontrolled(next);
          onCheckedChange?.(next);
        }}
      />
      <span data-part="track">
        <span data-part="thumb" />
      </span>
      {children ? <span data-part="label">{children}</span> : null}
    </label>
  );
}
