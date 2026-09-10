export type Size = 'sm' | 'md' | 'lg';
export type Density = 'compact' | 'comfortable';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedMode = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';
export type MotionPreference = 'system' | 'normal' | 'reduced' | 'none';
export type RadiusScale = 'none' | 'sm' | 'md' | 'lg';
export type ValueKey = string | number;

export interface ChangeDetails {
  reason: 'input' | 'select' | 'clear' | 'keyboard' | 'reset' | 'remove';
  originalEvent?: Event;
}

export interface OpenChangeDetails {
  reason: 'trigger' | 'escape' | 'outside' | 'close-button' | 'select' | 'swipe';
  originalEvent?: Event;
}

export interface Option<K extends ValueKey = ValueKey> {
  value: K;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface LocaleConfig {
  locale: string;
  messages?: Record<string, string>;
}

export type TokenCategory = 'foundation' | 'semantic' | 'layout' | 'component';

export interface TokenDefinition {
  key: string;
  cssVar: string;
  category: TokenCategory;
  type: 'color' | 'length' | 'number' | 'shadow' | 'easing' | 'font' | 'zIndex' | 'duration';
  light: string;
  dark: string;
  inherit?: boolean;
}

export type SemanticTokenMap = Record<string, string>;

export interface ButtonTokens {
  height?: string;
  paddingInline?: string;
  radius?: string;
  gap?: string;
  primaryBg?: string;
  primaryFg?: string;
  borderColor?: string;
}

export interface IconTokens {
  size?: string;
  color?: string;
  strokeWidth?: string;
}

export interface FlexTokens {
  gap?: string;
  rowGap?: string;
  columnGap?: string;
}

export interface InputTokens {
  height?: string;
  paddingInline?: string;
  radius?: string;
  bg?: string;
  borderColor?: string;
  focusRing?: string;
  textColor?: string;
}

export interface CheckboxTokens {
  controlSize?: string;
  radius?: string;
  checkedBg?: string;
  borderColor?: string;
  gap?: string;
}

export interface FormTokens {
  fieldGap?: string;
  labelColor?: string;
  labelFontSize?: string;
  errorColor?: string;
  errorGap?: string;
  actionsGap?: string;
}

export interface DialogTokens {
  width?: string;
  maxHeight?: string;
  radius?: string;
  bg?: string;
  backdropBg?: string;
  padding?: string;
  headerGap?: string;
  shadow?: string;
}

export interface ToastTokens {
  bg?: string;
  color?: string;
  radius?: string;
  shadow?: string;
  gap?: string;
  maxWidth?: string;
  offset?: string;
}

export interface CardTokens {
  bg?: string;
  radius?: string;
  borderColor?: string;
  shadow?: string;
  padding?: string;
  headerGap?: string;
}

export interface ComponentTokenOverrides {
  button?: Partial<ButtonTokens>;
  icon?: Partial<IconTokens>;
  flex?: Partial<FlexTokens>;
  input?: Partial<InputTokens>;
  checkbox?: Partial<CheckboxTokens>;
  form?: Partial<FormTokens>;
  dialog?: Partial<DialogTokens>;
  toast?: Partial<ToastTokens>;
  card?: Partial<CardTokens>;
}

export interface ThemeConfig {
  id: string;
  mode?: ThemeMode;
  tokens?: Partial<SemanticTokenMap>;
  components?: ComponentTokenOverrides;
  density?: Density;
  radius?: RadiusScale;
  motion?: MotionPreference;
}

export interface ResolvedTheme {
  id: string;
  mode: ThemeMode;
  density: Density;
  radius: RadiusScale;
  motion: MotionPreference;
  tokens: SemanticTokenMap;
  components: ComponentTokenOverrides;
  cssVars: Record<string, string>;
}

export const DANGEROUS_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);
