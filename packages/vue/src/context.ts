import { inject, type InjectionKey } from 'vue';
import type { Density, Direction, LocaleConfig, MotionPreference, ResolvedTheme, Size } from '@xiaoli-ui/tokens';
import type { FormStore, ToastStore } from '@xiaoli-ui/internal-core';

export interface DuiConfig {
  theme: ResolvedTheme;
  resolvedMode: 'light' | 'dark';
  dir: Direction;
  density: Density;
  size: Size;
  unstyled: boolean;
  motion: MotionPreference;
  locale: LocaleConfig;
  portalHost: HTMLElement | null;
  toastStore: ToastStore;
}

export const configKey: InjectionKey<DuiConfig> = Symbol('dui-config');
export const formKey: InjectionKey<{ store: FormStore<Record<string, unknown>>; disabled: boolean; getFieldId: (path: readonly (string | number)[]) => string }> =
  Symbol('dui-form');
export const fieldKey: InjectionKey<{ id: string; error?: string }> = Symbol('dui-field');

export function useConfig(): DuiConfig {
  const value = inject(configKey, null);
  if (!value) throw new Error('[xiaoli-ui] 该 API 必须在 ConfigProvider 内使用');
  return value;
}

export function useConfigOptional(): DuiConfig | null {
  return inject(configKey, null);
}
