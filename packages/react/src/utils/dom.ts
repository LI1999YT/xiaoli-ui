import type { CSSProperties, HTMLAttributes } from 'react';

export function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const value = parts.filter(Boolean).join(' ');
  return value || undefined;
}

export function partProps<P extends string>(
  part: P,
  _classNames?: Partial<Record<P, string>>,
  _styles?: Partial<Record<P, CSSProperties>>,
  extra?: HTMLAttributes<HTMLElement>,
) {
  return {
    'data-part': part,
    ...extra,
  };
}

export function presence(flag: boolean | undefined): '' | undefined {
  return flag ? '' : undefined;
}
