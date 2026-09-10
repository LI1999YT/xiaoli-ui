import {
  COMPONENT_TOKEN_DEFAULTS,
  KNOWN_COMPONENT_KEYS,
  KNOWN_SEMANTIC_KEYS,
  SEMANTIC_TOKENS,
  componentKeyToCssVar,
  keyToCssVar,
} from './schema';
import type {
  ComponentTokenOverrides,
  ResolvedTheme,
  SemanticTokenMap,
  ThemeConfig,
} from './types';
import { DANGEROUS_KEYS } from './types';

export class ThemeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThemeValidationError';
  }
}

function assertSafeKey(key: string): void {
  const parts = key.split('.');
  for (const part of parts) {
    if (DANGEROUS_KEYS.has(part) || part.includes('__')) {
      throw new ThemeValidationError(`拒绝危险 token 键：${key}`);
    }
  }
}

function isFiniteCssLength(value: string): boolean {
  if (value.startsWith('var(') || value.includes('min(') || value.includes('max(') || value.includes('calc(')) {
    return true;
  }
  return /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|dvh|svh|ch|ex|ms|s)?$/.test(value.trim());
}

function warnUnknown(key: string): void {
  if (typeof console !== 'undefined') {
    console.warn(`[xiaoli-ui] 未知 token 已忽略：${key}`);
  }
}

export function createSemanticMap(mode: 'light' | 'dark'): SemanticTokenMap {
  const map: SemanticTokenMap = {};
  for (const token of SEMANTIC_TOKENS) {
    map[token.key] = mode === 'dark' ? token.dark : token.light;
  }
  return map;
}

export function mergeDeep<T extends Record<string, unknown>>(base: T, override?: Partial<T>): T {
  if (!override) return { ...base };
  const next = { ...base };
  for (const [key, value] of Object.entries(override)) {
    assertSafeKey(key);
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      (next as Record<string, unknown>)[key] = [...value];
      continue;
    }
    const current = (next as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && current && typeof current === 'object' && !Array.isArray(current)) {
      (next as Record<string, unknown>)[key] = mergeDeep(
        current as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      (next as Record<string, unknown>)[key] = value;
    }
  }
  return next;
}

function applySemanticOverrides(base: SemanticTokenMap, overrides?: Partial<SemanticTokenMap>): SemanticTokenMap {
  if (!overrides) return { ...base };
  const next = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    assertSafeKey(key);
    if (value === undefined) continue;
    if (value.includes('url(') || value.includes('expression(') || value.includes(';')) {
      throw new ThemeValidationError(`非法 token 值：${key}`);
    }
    if (!KNOWN_SEMANTIC_KEYS.has(key)) {
      warnUnknown(key);
      continue;
    }
    if (value.includes('NaN')) {
      throw new ThemeValidationError(`无效数值：${key}`);
    }
    next[key] = value;
  }
  return next;
}

function applyComponentOverrides(overrides?: ComponentTokenOverrides): ComponentTokenOverrides {
  const next: ComponentTokenOverrides = structuredClone(COMPONENT_TOKEN_DEFAULTS);
  if (!overrides) return next;
  for (const [component, tokens] of Object.entries(overrides)) {
    assertSafeKey(component);
    if (!tokens) continue;
    const bucket = (next[component as keyof ComponentTokenOverrides] ?? {}) as Record<string, string>;
    for (const [name, value] of Object.entries(tokens)) {
      if (value === undefined) continue;
      const fullKey = `${component}.${name}`;
      assertSafeKey(fullKey);
      if (!KNOWN_COMPONENT_KEYS.has(fullKey)) {
        warnUnknown(fullKey);
        continue;
      }
      if (typeof value !== 'string' || value.includes(';') || value.includes('url(')) {
        throw new ThemeValidationError(`非法组件 token：${fullKey}`);
      }
      if (!isFiniteCssLength(value) && !value.startsWith('var(') && !value.startsWith('#')) {
        if (value.includes('NaN')) throw new ThemeValidationError(`无效数值：${fullKey}`);
      }
      bucket[name] = value;
    }
    (next as Record<string, Record<string, string>>)[component] = bucket;
  }
  return next;
}

function radiusScaleValue(scale: NonNullable<ThemeConfig['radius']>): string {
  if (scale === 'none') return 'var(--dui-radius-none)';
  return `var(--dui-radius-${scale})`;
}

export function themeToCssVars(theme: Omit<ResolvedTheme, 'cssVars'>): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.tokens)) {
    vars[keyToCssVar(key)] = value;
  }
  for (const [component, tokens] of Object.entries(theme.components)) {
    if (!tokens) continue;
    for (const [name, value] of Object.entries(tokens)) {
      if (typeof value === 'string') {
        vars[componentKeyToCssVar(component, name)] = value;
      }
    }
  }
  if (theme.radius) {
    vars['--dui-button-radius'] = vars['--dui-button-radius'] ?? radiusScaleValue(theme.radius);
    vars['--dui-input-radius'] = vars['--dui-input-radius'] ?? radiusScaleValue(theme.radius);
    vars['--dui-card-radius'] = vars['--dui-card-radius'] ?? radiusScaleValue(theme.radius);
    vars['--dui-dialog-radius'] = vars['--dui-dialog-radius'] ?? radiusScaleValue(theme.radius);
  }
  return vars;
}

export function defineTheme(config: ThemeConfig, parent?: ResolvedTheme): ResolvedTheme {
  if (!config.id || /[^a-zA-Z0-9_-]/.test(config.id)) {
    throw new ThemeValidationError('theme.id 必须是稳定的安全标识（字母数字、下划线或短横线）');
  }

  const mode = config.mode ?? parent?.mode ?? 'light';
  const resolvedForValues = mode === 'dark' ? 'dark' : 'light';
  const tokens = applySemanticOverrides(
    parent?.tokens ?? createSemanticMap(resolvedForValues),
    config.tokens,
  );
  const components = applyComponentOverrides(
    mergeDeep((parent?.components ?? {}) as Record<string, unknown>, config.components as Record<string, unknown>) as ComponentTokenOverrides,
  );

  const resolved: Omit<ResolvedTheme, 'cssVars'> = {
    id: config.id,
    mode,
    density: config.density ?? parent?.density ?? 'comfortable',
    radius: config.radius ?? parent?.radius ?? 'md',
    motion: config.motion ?? parent?.motion ?? 'system',
    tokens,
    components,
  };

  return {
    ...resolved,
    cssVars: themeToCssVars(resolved),
  };
}

export function serializeTheme(config: ThemeConfig): string {
  return JSON.stringify({ schemaVersion: 1, ...config });
}

export function parseThemeJson(input: string): ThemeConfig {
  if (input.length > 200_000) {
    throw new ThemeValidationError('主题 JSON 超过大小限制');
  }
  const parsed = JSON.parse(input) as unknown;
  if (!parsed || typeof parsed !== 'object') {
    throw new ThemeValidationError('主题 JSON 必须是对象');
  }
  const walk = (value: unknown, path: string): void => {
    if (!value || typeof value !== 'object') return;
    for (const key of Object.keys(value as object)) {
      assertSafeKey(path ? `${path}.${key}` : key);
      walk((value as Record<string, unknown>)[key], path ? `${path}.${key}` : key);
    }
  };
  walk(parsed, '');
  return parsed as ThemeConfig;
}
