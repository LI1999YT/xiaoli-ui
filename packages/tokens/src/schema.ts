import type { TokenDefinition } from './types';

function token(
  key: string,
  type: TokenDefinition['type'],
  light: string,
  dark: string,
  category: TokenDefinition['category'] = 'semantic',
): TokenDefinition {
  return {
    key,
    cssVar: `--dui-${key.replaceAll('.', '-')}`,
    category,
    type,
    light,
    dark,
    inherit: true,
  };
}

export const SEMANTIC_TOKENS: TokenDefinition[] = [
  token('color.action.bg', 'color', '#ff4d8d', '#ff7eb6'),
  token('color.action.fg', 'color', '#ffffff', '#2b1020'),
  token('color.action.hover', 'color', '#ff2f7a', '#ff9ac8'),
  token('color.action.pressed', 'color', '#e01868', '#ff5ca0'),
  token('color.action.soft', 'color', '#ffe3ef', '#4a2040'),
  token('color.text.primary', 'color', '#2b1b33', '#ffeef7'),
  token('color.text.secondary', 'color', '#6b4b63', '#f3c6dc'),
  token('color.text.muted', 'color', '#8a6a82', '#c9a0b6'),
  token('color.text.disabled', 'color', '#c4a8b8', '#8a6a82'),
  token('color.link', 'color', '#ff4d8d', '#8be7ff'),
  token('color.border.default', 'color', '#ffd0e4', '#5a3a55'),
  token('color.border.strong', 'color', '#f5a3c7', '#c9a0b6'),
  token('color.focus', 'color', '#7c5cff', '#8be7ff'),
  token('color.success.bg', 'color', '#15803d', '#4ade80'),
  token('color.success.fg', 'color', '#ffffff', '#052e16'),
  token('color.success.soft', 'color', '#f0fdf4', '#052e16'),
  token('color.warning.bg', 'color', '#b45309', '#fbbf24'),
  token('color.warning.fg', 'color', '#ffffff', '#422006'),
  token('color.warning.soft', 'color', '#fffbeb', '#422006'),
  token('color.danger.bg', 'color', '#dc2626', '#f87171'),
  token('color.danger.fg', 'color', '#ffffff', '#450a0a'),
  token('color.danger.soft', 'color', '#fef2f2', '#450a0a'),
  token('surface.page', 'color', '#fff3f8', '#1a1020'),
  token('surface.panel', 'color', '#ffffff', '#2a1830'),
  token('surface.muted', 'color', '#fff0f6', '#3a2244'),
  token('surface.hover', 'color', '#ffe6f1', '#4a2c55'),
  token('surface.disabled', 'color', '#f7e6ee', '#3a2244'),
  token('surface.overlay', 'color', 'rgb(80 20 50 / 0.42)', 'rgb(10 4 16 / 0.62)'),
  token(
    'font.family',
    'font',
    '"Xiaoli Anime", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    '"Xiaoli Anime", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    'layout',
  ),
  token('font.familyMono', 'font', 'ui-monospace, monospace', 'ui-monospace, monospace', 'layout'),
  token('font.size.sm', 'length', '14px', '14px', 'layout'),
  token('font.size.md', 'length', '16px', '16px', 'layout'),
  token('font.size.lg', 'length', '18px', '18px', 'layout'),
  token('font.size.headingSm', 'length', '20px', '20px', 'layout'),
  token('font.size.headingMd', 'length', '24px', '24px', 'layout'),
  token('font.size.headingLg', 'length', '30px', '30px', 'layout'),
  token('font.weight.normal', 'number', '400', '400', 'layout'),
  token('font.weight.medium', 'number', '500', '500', 'layout'),
  token('font.weight.bold', 'number', '700', '700', 'layout'),
  token('font.lineHeight.body', 'number', '1.5', '1.5', 'layout'),
  token('font.lineHeight.heading', 'number', '1.25', '1.25', 'layout'),
  token('radius.none', 'length', '0', '0', 'layout'),
  token('radius.sm', 'length', '4px', '4px', 'layout'),
  token('radius.md', 'length', '12px', '12px', 'layout'),
  token('radius.lg', 'length', '16px', '16px', 'layout'),
  token('radius.xl', 'length', '20px', '20px', 'layout'),
  token('radius.pill', 'length', '9999px', '9999px', 'layout'),
  token('border.width', 'length', '1px', '1px', 'layout'),
  token('focus.width', 'length', '2px', '2px', 'layout'),
  token('focus.offset', 'length', '2px', '2px', 'layout'),
  token('control.height.sm', 'length', '32px', '32px', 'layout'),
  token('control.height.md', 'length', '40px', '40px', 'layout'),
  token('control.height.lg', 'length', '48px', '48px', 'layout'),
  token('motion.duration.fast', 'duration', '120ms', '120ms', 'layout'),
  token('motion.duration.normal', 'duration', '180ms', '180ms', 'layout'),
  token('motion.duration.slow', 'duration', '240ms', '240ms', 'layout'),
  token('motion.easing.standard', 'easing', 'cubic-bezier(0.2, 0, 0, 1)', 'cubic-bezier(0.2, 0, 0, 1)', 'layout'),
  token(
    'shadow.sm',
    'shadow',
    '0 1px 2px rgb(28 25 23 / 0.04), 0 10px 28px rgb(28 25 23 / 0.06)',
    '0 1px 2px rgb(0 0 0 / 0.28), 0 10px 28px rgb(0 0 0 / 0.28)',
  ),
  token(
    'shadow.md',
    'shadow',
    '0 18px 48px rgb(28 25 23 / 0.14)',
    '0 18px 48px rgb(0 0 0 / 0.45)',
  ),
  token('zIndex.sticky', 'zIndex', '10', '10', 'layout'),
  token('zIndex.popover', 'zIndex', '1000', '1000', 'layout'),
  token('zIndex.modal', 'zIndex', '1100', '1100', 'layout'),
  token('zIndex.notification', 'zIndex', '1300', '1300', 'layout'),
  token('space.0', 'length', '0px', '0px', 'layout'),
  token('space.half', 'length', '2px', '2px', 'layout'),
  token('space.1', 'length', '4px', '4px', 'layout'),
  token('space.2', 'length', '8px', '8px', 'layout'),
  token('space.3', 'length', '12px', '12px', 'layout'),
  token('space.4', 'length', '16px', '16px', 'layout'),
  token('space.5', 'length', '20px', '20px', 'layout'),
  token('space.6', 'length', '24px', '24px', 'layout'),
  token('space.8', 'length', '32px', '32px', 'layout'),
  token('space.10', 'length', '40px', '40px', 'layout'),
  token('space.12', 'length', '48px', '48px', 'layout'),
  token('space.16', 'length', '64px', '64px', 'layout'),
];

export const COMPONENT_TOKEN_DEFAULTS: Record<string, Record<string, string>> = {
  button: {
    height: 'var(--dui-control-height-md)',
    paddingInline: 'var(--dui-space-4)',
    radius: 'var(--dui-radius-md)',
    gap: 'var(--dui-space-2)',
    primaryBg: 'var(--dui-color-action-bg)',
    primaryFg: 'var(--dui-color-action-fg)',
    borderColor: 'var(--dui-color-border-default)',
  },
  icon: {
    size: '20px',
    color: 'currentColor',
    strokeWidth: '2',
  },
  flex: {
    gap: '0px',
    rowGap: '0px',
    columnGap: '0px',
  },
  input: {
    height: 'var(--dui-control-height-md)',
    paddingInline: 'var(--dui-space-4)',
    radius: 'var(--dui-radius-md)',
    bg: 'var(--dui-surface-panel)',
    borderColor: 'var(--dui-color-border-default)',
    focusRing: 'var(--dui-color-focus)',
    textColor: 'var(--dui-color-text-primary)',
  },
  checkbox: {
    controlSize: '20px',
    radius: 'var(--dui-radius-sm)',
    checkedBg: 'var(--dui-color-action-bg)',
    borderColor: 'var(--dui-color-border-strong)',
    gap: 'var(--dui-space-3)',
  },
  form: {
    fieldGap: 'var(--dui-space-2)',
    labelColor: 'var(--dui-color-text-secondary)',
    labelFontSize: 'var(--dui-font-size-sm)',
    errorColor: 'var(--dui-color-danger-bg)',
    errorGap: 'var(--dui-space-1)',
    actionsGap: 'var(--dui-space-2)',
  },
  dialog: {
    width: 'min(480px, calc(100vw - 32px))',
    maxHeight: 'min(80dvh, 80vh)',
    radius: 'var(--dui-radius-lg)',
    bg: 'var(--dui-surface-panel)',
    backdropBg: 'var(--dui-surface-overlay)',
    padding: 'var(--dui-space-6)',
    headerGap: 'var(--dui-space-2)',
    shadow: 'var(--dui-shadow-md)',
  },
  toast: {
    bg: 'var(--dui-surface-panel)',
    color: 'var(--dui-color-text-primary)',
    radius: 'var(--dui-radius-md)',
    shadow: 'var(--dui-shadow-md)',
    gap: 'var(--dui-space-2)',
    maxWidth: '360px',
    offset: 'var(--dui-space-4)',
  },
  textarea: {
    minHeight: '96px',
    padding: 'var(--dui-space-3)',
    radius: 'var(--dui-radius-md)',
    borderColor: 'var(--dui-color-border-default)',
    countColor: 'var(--dui-color-text-muted)',
  },
  radio: {
    controlSize: '18px',
    checkedBg: 'var(--dui-color-action-bg)',
    borderColor: 'var(--dui-color-border-strong)',
    gap: 'var(--dui-space-2)',
  },
  switch: {
    trackWidth: '44px',
    trackHeight: '24px',
    thumbSize: '20px',
    checkedBg: 'var(--dui-color-action-bg)',
    uncheckedBg: 'var(--dui-color-border-strong)',
  },
  select: {
    radius: 'var(--dui-radius-md)',
    height: 'var(--dui-control-height-md)',
  },
  drawer: {
    width: 'min(360px, 100vw)',
    bg: 'var(--dui-surface-panel)',
  },
  tabs: {
    gap: 'var(--dui-space-2)',
  },
  badge: {
    bg: 'var(--dui-color-action-bg)',
    fg: 'var(--dui-color-action-fg)',
  },
  spinner: {
    size: '24px',
    color: 'var(--dui-color-action-bg)',
  },
  progress: {
    height: '8px',
    bg: 'var(--dui-surface-muted)',
    fill: 'var(--dui-color-action-bg)',
  },
  card: {
    bg: 'var(--dui-surface-panel)',
    radius: 'var(--dui-radius-lg)',
    borderColor: 'var(--dui-color-border-default)',
    shadow: 'var(--dui-shadow-sm)',
    padding: 'var(--dui-space-6)',
    headerGap: 'var(--dui-space-2)',
  },
  typography: {
    radius: 'var(--dui-radius-md)',
  },
  grid: {
    gap: 'var(--dui-space-4)',
  },
  space: {
    gap: 'var(--dui-space-2)',
  },
  popover: {
    radius: 'var(--dui-radius-lg)',
  },
  tooltip: {
    maxWidth: '280px',
  },
  skeleton: {
    color: 'var(--dui-surface-muted)',
  },
  empty: {
    padding: 'var(--dui-space-8)',
  },
  alert: {
    radius: 'var(--dui-radius-md)',
  },
  tag: {
    radius: 'var(--dui-radius-pill)',
  },
  slider: {
    trackHeight: '8px',
  },
  rate: {
    color: 'var(--dui-color-action-bg)',
  },
};

export const KNOWN_SEMANTIC_KEYS = new Set(SEMANTIC_TOKENS.map((item) => item.key));

export const KNOWN_COMPONENT_KEYS = new Set(
  Object.entries(COMPONENT_TOKEN_DEFAULTS).flatMap(([component, tokens]) =>
    Object.keys(tokens).map((name) => `${component}.${name}`),
  ),
);

export const SPACE_SCALE = {
  0: 'space.0',
  half: 'space.half',
  1: 'space.1',
  2: 'space.2',
  3: 'space.3',
  4: 'space.4',
  5: 'space.5',
  6: 'space.6',
  8: 'space.8',
  10: 'space.10',
  12: 'space.12',
  16: 'space.16',
} as const;

export const BREAKPOINTS = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function keyToCssVar(key: string): string {
  return `--dui-${key.replaceAll('.', '-')}`;
}

export function componentKeyToCssVar(component: string, name: string): string {
  const kebab = name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  return `--dui-${component}-${kebab}`;
}
