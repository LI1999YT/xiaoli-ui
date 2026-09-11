import { useRef, useState, type TextareaHTMLAttributes } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  showCount?: boolean;
  onValueChange?: (next: string) => void;
}

export function Textarea({
  value,
  defaultValue = '',
  rows = 3,
  showCount = false,
  maxLength,
  disabled,
  className,
  style,
  onValueChange,
  ...rest
}: TextareaProps) {
  const config = useDuiConfigOptional();
  const inner = useRef<HTMLTextAreaElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? String(value) : uncontrolled;
  return (
    <div data-dui="textarea" data-unstyled={presence(config?.unstyled ?? false)} className={className} style={style}>
      <textarea
        {...rest}
        ref={inner}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        value={current}
        data-part="textarea"
        onChange={(event) => {
          const next = event.currentTarget.value;
          if (!isControlled(value)) setUncontrolled(next);
          onValueChange?.(next);
        }}
      />
      {showCount ? <span data-part="count">{current.length}{maxLength ? `/${maxLength}` : ''}</span> : null}
    </div>
  );
}
