import { SPACE_SCALE } from '@xiaoli-ui/tokens';

export type Responsive<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T };

export function resolveSpace(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    const token = String(value);
    if (!(token in SPACE_SCALE)) {
      throw new Error(`[xiaoli-ui] gap/padding=${value} 不是合法 spacing token。请使用 0,1,2,3,4,5,6,8,10,12,16 或带单位的长度。`);
    }
    return `var(--dui-space-${token})`;
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    throw new Error(`[xiaoli-ui] 不接受无单位长度 "${value}"。数字表示 space token，长度必须带单位。`);
  }
  return value;
}

export function isResponsiveObject<T>(value: Responsive<T>): value is Exclude<Responsive<T>, T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
