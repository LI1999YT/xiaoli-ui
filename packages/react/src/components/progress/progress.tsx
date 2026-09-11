import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Progress({ value = null, max = 100, variant = 'line', status = 'normal', showLabel = true, label = '进度' }: { value?: number | null; max?: number; variant?: 'line' | 'circle'; status?: 'normal' | 'success' | 'error'; showLabel?: boolean; label?: string; }) {
  const config = useDuiConfigOptional();
  const ratio = value == null ? null : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div data-dui="progress" data-variant={variant} data-status={status} data-indeterminate={presence(ratio == null)} data-unstyled={presence(config?.unstyled ?? false)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value ?? undefined}>
      <div data-part="track">{ratio == null ? <span data-part="bar" /> : <span data-part="bar" style={{ width: variant === 'line' ? `${ratio}%` : undefined, ['--dui-progress-ratio' as string]: String(ratio) }} />}</div>
      {showLabel ? <span data-part="label">{ratio == null ? '加载中' : `${Math.round(ratio)}%`}</span> : null}
    </div>
  );
}
