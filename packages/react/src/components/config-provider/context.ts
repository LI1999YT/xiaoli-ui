import { createContext, useContext } from 'react';
import type { Density, Direction, LocaleConfig, MotionPreference, ResolvedTheme, Size } from '@xiaoli-ui/tokens';
import type { ToastStore } from '@xiaoli-ui/internal-core';

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

export const DuiConfigContext = createContext<DuiConfig | null>(null);

export function useDuiConfig(): DuiConfig {
  const context = useContext(DuiConfigContext);
  if (!context) {
    throw new Error('[xiaoli-ui] 该 API 必须在 ConfigProvider 内使用');
  }
  return context;
}

export function useDuiConfigOptional(): DuiConfig | null {
  return useContext(DuiConfigContext);
}
