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
  token('color.action.bg', 'color', '#2563eb', '#60a5fa'),
  token('color.action.fg', 'color', '#ffffff', '#0b1220'),
  token('color.action.hover', 'color', '#1d4ed8', '#93c5fd'),
  token('color.action.pressed', 'color', '#1e40af', '#3b82f6'),
  token('color.action.soft', 'color', '#eff6ff', '#172554'),
  token('color.text.primary', 'color', '#111827', '#f9fafb'),
  token('color.text.secondary', 'color', '#4b5563', '#d1d5db'),
  token('color.text.muted', 'color', '#6b7280', '#9ca3af'),
  token('color.text.disabled', 'color', '#9ca3af', '#6b7280'),
  token('color.link', 'color', '#1d4ed8', '#93c5fd'),
  token('color.border.default', 'color', '#d1d5db', '#4b5563'),
  token('color.border.strong', 'color', '#6b7280', '#9ca3af'),
  token('color.focus', 'color', '#1d4ed8', '#93c5fd'),
  token('color.success.bg', 'color', '#15803d', '#4ade80'),
  token('color.success.fg', 'color', '#ffffff', '#0b1220'),
  token('color.success.soft', 'color', '#f0fdf4', '#052e16'),
  token('color.warning.bg', 'color', '#854d0e', '#facc15'),
  token('color.warning.fg', 'color', '#ffffff', '#0b1220'),
  token('color.warning.soft', 'color', '#fefce8', '#422006'),
  token('color.danger.bg', 'color', '#dc2626', '#f87171'),
  token('color.danger.fg', 'color', '#ffffff', '#0b1220'),
  token('color.danger.soft', 'color', '#fef2f2', '#450a0a'),
  token('surface.page', 'color', '#ffffff', '#0b1220'),
  token('surface.panel', 'color', '#ffffff', '#111827'),
  token('surface.muted', 'color', '#f3f4f6', '#1f2937'),
  token('surface.hover', 'color', '#f9fafb', '#374151'),
  token('surface.disabled', 'color', '#f3f4f6', '#1f2937'),
  token('surface.overlay', 'color', 'rgb(0 0 0 / 0.45)', 'rgb(0 0 0 / 0.60)'),
  token('font.family', 'font', 'system-ui, sans-serif', 'system-ui, sans-serif', 'layout'),
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
  token('radius.md', 'length', '8px', '8px', 'layout'),
  token('radius.lg', 'length', '12px', '12px', 'layout'),
  token('radius.xl', 'length', '16px', '16px', 'layout'),
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
  token('shadow.sm', 'shadow', '0 1px 3px rgb(0 0 0 / 0.12)', '0 1px 3px rgb(0 0 0 / 0.32)'),
  token('shadow.md', 'shadow', '0 8px 24px rgb(0 0 0 / 0.14)', '0 8px 24px rgb(0 0 0 / 0.40)'),
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
    paddingInline: 'var(--dui-space-3)',
    radius: 'var(--dui-radius-md)',
    bg: 'var(--dui-surface-panel)',
    borderColor: 'var(--dui-color-border-default)',
    focusRing: 'var(--dui-color-focus)',
    textColor: 'var(--dui-color-text-primary)',
  },
  checkbox: {
    controlSize: '18px',
    radius: 'var(--dui-radius-sm)',
    checkedBg: 'var(--dui-color-action-bg)',
    borderColor: 'var(--dui-color-border-strong)',
    gap: 'var(--dui-space-2)',
  },
  form: {
    fieldGap: 'var(--dui-space-2)',
    labelColor: 'var(--dui-color-text-primary)',
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
    padding: 'var(--dui-space-5)',
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
  card: {
    bg: 'var(--dui-surface-panel)',
    radius: 'var(--dui-radius-lg)',
    borderColor: 'var(--dui-color-border-default)',
    shadow: 'var(--dui-shadow-sm)',
    padding: 'var(--dui-space-4)',
    headerGap: 'var(--dui-space-2)',
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
