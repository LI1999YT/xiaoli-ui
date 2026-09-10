import { describe, expect, it } from 'vitest';
import { defineTheme } from '@xiaoli-ui/tokens';
import { getNextChecked, isControlled } from '@xiaoli-ui/internal-core';

describe('cross-framework contracts', () => {
  it('CTRL-BOOL-001 false 是合法受控值', () => {
    expect(isControlled(false)).toBe(true);
    expect(isControlled(undefined)).toBe(false);
  });

  it('CTRL-CHECK-001 半选点击进入选中', () => {
    expect(getNextChecked(false, true)).toBe(true);
    expect(getNextChecked(true, false)).toBe(false);
  });

  it('THEME-001 双主题 id 隔离', () => {
    const light = defineTheme({ id: 'light-demo', mode: 'light' });
    const dark = defineTheme({ id: 'dark-demo', mode: 'dark' });
    expect(light.id).not.toBe(dark.id);
    expect(light.tokens['surface.page']).not.toBe(dark.tokens['surface.page']);
  });
});
