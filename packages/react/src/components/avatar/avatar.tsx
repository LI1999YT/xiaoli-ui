import { useState, type ReactNode } from 'react';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  shape = 'circle',
}: {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}) {
  const config = useDuiConfigOptional();
  const [failed, setFailed] = useState(false);
  const initials = (name ?? '').trim().slice(0, 1) || '?';
  return (
    <span data-dui="avatar" data-size={size} data-shape={shape} data-unstyled={presence(config?.unstyled ?? false)}>
      {src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} /> : <span data-part="fallback">{initials}</span>}
    </span>
  );
}

export function AvatarGroup({ max = 5, children }: { max?: number; children?: ReactNode }) {
  const items = Array.isArray(children) ? children : children ? [children] : [];
  const extra = items.length - max;
  return (
    <span data-dui="avatar-group">
      {items.slice(0, max)}
      {extra > 0 ? <span data-dui="avatar" data-part="overflow">+{extra}</span> : null}
    </span>
  );
}
