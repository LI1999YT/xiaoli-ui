import { describe, expect, it } from 'vitest';
import {
  formatTimeOnly,
  hour12Display,
  hourFrom12,
  isTimeDisabled,
  parseTimeOnly,
} from './time';

describe('time primitives', () => {
  it('C42-EDGE-01 解析 00:00 与 23:59', () => {
    expect(parseTimeOnly('00:00')).toEqual({ hour: 0, minute: 0, second: 0 });
    expect(parseTimeOnly('23:59')).toEqual({ hour: 23, minute: 59, second: 0 });
    expect(formatTimeOnly({ hour: 23, minute: 59, second: 0 }, true)).toBe('23:59:00');
  });

  it('C42-EDGE-02 12AM/PM 与存储 24 小时互转', () => {
    expect(hourFrom12(12, 'AM')).toBe(0);
    expect(hourFrom12(12, 'PM')).toBe(12);
    expect(hour12Display(0)).toEqual({ display: 12, period: 'AM' });
    expect(hour12Display(13)).toEqual({ display: 1, period: 'PM' });
  });

  it('C42-EDGE-04 非法输入返回 null', () => {
    expect(parseTimeOnly('25:00')).toBeNull();
    expect(parseTimeOnly('10:99')).toBeNull();
    expect(parseTimeOnly('noon')).toBeNull();
  });

  it('C42-EDGE-05 min/max 限制同日范围', () => {
    expect(isTimeDisabled('08:00', { min: '09:00', max: '18:00' })).toBe(true);
    expect(isTimeDisabled('12:00', { min: '09:00', max: '18:00' })).toBe(false);
  });
});
