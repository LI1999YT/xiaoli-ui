export type TimeOnly = string;

export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

const TIME_RE = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function parseTimeOnly(value: string | null | undefined): TimeParts | null {
  if (!value) return null;
  const match = TIME_RE.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3] ?? '0');
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

export function formatTimeOnly(parts: TimeParts, showSeconds = false): TimeOnly {
  const hour = String(parts.hour).padStart(2, '0');
  const minute = String(parts.minute).padStart(2, '0');
  if (!showSeconds) return `${hour}:${minute}`;
  return `${hour}:${minute}:${String(parts.second).padStart(2, '0')}`;
}

export function timeToSeconds(parts: TimeParts): number {
  return parts.hour * 3600 + parts.minute * 60 + parts.second;
}

export function compareTimeOnly(left: TimeOnly, right: TimeOnly): number {
  const a = parseTimeOnly(left);
  const b = parseTimeOnly(right);
  if (!a || !b) return 0;
  return timeToSeconds(a) - timeToSeconds(b);
}

export function isTimeDisabled(
  time: TimeOnly,
  options: { min?: TimeOnly; max?: TimeOnly; disabledTime?: (time: TimeOnly) => boolean } = {},
): boolean {
  if (options.min && compareTimeOnly(time, options.min) < 0) return true;
  if (options.max && compareTimeOnly(time, options.max) > 0) return true;
  return Boolean(options.disabledTime?.(time));
}

export function buildStepValues(limit: number, step: number): number[] {
  const size = Math.max(1, Math.floor(step));
  const values: number[] = [];
  for (let value = 0; value < limit; value += size) values.push(value);
  return values;
}

export function hour12Display(hour: number): { display: number; period: 'AM' | 'PM' } {
  return {
    period: hour < 12 ? 'AM' : 'PM',
    display: hour % 12 === 0 ? 12 : hour % 12,
  };
}

export function hourFrom12(display: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') return display === 12 ? 0 : display;
  return display === 12 ? 12 : display + 12;
}

export function defaultTimeParts(showSeconds = false): TimeParts {
  return { hour: 0, minute: 0, second: showSeconds ? 0 : 0 };
}
