import { describe, expect, it } from 'vitest';
import {
  daysInMonth,
  isDateDisabled,
  isLeapYear,
  nextRangeSelection,
  parseDateOnly,
} from './date';

describe('date primitives', () => {
  it('C41-EDGE-01 闰年二月天数', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2026)).toBe(false);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(parseDateOnly('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 });
    expect(parseDateOnly('2026-02-29')).toBeNull();
  });

  it('C41-EDGE-02 min/max 禁用边界外日期', () => {
    expect(isDateDisabled('2026-09-01', { min: '2026-09-10', max: '2026-09-20' })).toBe(true);
    expect(isDateDisabled('2026-09-15', { min: '2026-09-10', max: '2026-09-20' })).toBe(false);
  });

  it('C41-EDGE-03/04 区间草稿与反向选择', () => {
    expect(nextRangeSelection(null, '2026-09-12')).toEqual({ draftStart: '2026-09-12', value: null });
    expect(nextRangeSelection('2026-09-12', '2026-09-18')).toEqual({
      draftStart: null,
      value: ['2026-09-12', '2026-09-18'],
    });
    expect(nextRangeSelection('2026-09-18', '2026-09-10')).toEqual({
      draftStart: '2026-09-10',
      value: null,
    });
  });

  it('C41-EDGE-06 非法日期文本不解析', () => {
    expect(parseDateOnly('2026/09/11')).toBeNull();
    expect(parseDateOnly('not-a-date')).toBeNull();
  });
});
