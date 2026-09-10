import { describe, expect, it } from 'vitest';
import { ThemeValidationError, defineTheme, parseThemeJson } from './theme';

describe('defineTheme', () => {
  it('merges known tokens and ignores unknown keys', () => {
    const theme = defineTheme({
      id: 'brand',
      tokens: {
        'color.action.bg': '#111827',
        'not.a.token': '#000',
      },
    });
    expect(theme.tokens['color.action.bg']).toBe('#111827');
    expect(theme.tokens['not.a.token']).toBeUndefined();
    expect(theme.cssVars['--dui-color-action-bg']).toBe('#111827');
  });

  it('rejects dangerous keys', () => {
    expect(() =>
      defineTheme({
        id: 'x',
        tokens: { '__proto__.polluted': '#fff' },
      }),
    ).toThrow(ThemeValidationError);
  });

  it('rejects illegal CSS fragments', () => {
    expect(() =>
      defineTheme({
        id: 'x',
        tokens: { 'color.action.bg': 'red; width:100vw' },
      }),
    ).toThrow(/非法/);
  });
});

describe('parseThemeJson', () => {
  it('rejects prototype pollution', () => {
    expect(() => parseThemeJson('{"id":"x","__proto__":{"x":1}}')).toThrow(ThemeValidationError);
  });
});
