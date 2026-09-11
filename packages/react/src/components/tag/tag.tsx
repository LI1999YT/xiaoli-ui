import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Tag({
  variant = 'soft',
  color = 'neutral',
  size = 'md',
  closable,
  checkable,
  checked,
  defaultChecked = false,
  onClose,
  onCheckedChange,
  children,
}: {
  variant?: 'solid' | 'soft' | 'outline';
  color?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  closable?: boolean;
  checkable?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onClose?: () => void;
  onCheckedChange?: (next: boolean) => void;
  children?: ReactNode;
}) {
  const config = useDuiConfigOptional();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const current = isControlled(checked) ? Boolean(checked) : uncontrolled;
  return (
    <span
      data-dui="tag"
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-checked={presence(checkable && current)}
      data-unstyled={presence(config?.unstyled ?? false)}
      onClick={() => {
        if (!checkable) return;
        const next = !current;
        if (!isControlled(checked)) setUncontrolled(next);
        onCheckedChange?.(next);
      }}
    >
      {children}
      {closable ? (
        <button type="button" aria-label="删除" data-part="close" onClick={(event) => { event.stopPropagation(); onClose?.(); }}>
          ×
        </button>
      ) : null}
    </span>
  );
}
