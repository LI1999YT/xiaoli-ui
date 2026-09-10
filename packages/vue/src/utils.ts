import type { CSSProperties } from 'vue';

export function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const value = parts.filter(Boolean).join(' ');
  return value || undefined;
}

export function presence(flag: boolean | undefined): '' | undefined {
  return flag ? '' : undefined;
}

export function partStyle<P extends string>(
  part: P,
  classNames?: Partial<Record<P, string>>,
  styles?: Partial<Record<P, CSSProperties>>,
) {
  return {
    'data-part': part,
    class: classNames?.[part],
    style: styles?.[part],
  };
}
