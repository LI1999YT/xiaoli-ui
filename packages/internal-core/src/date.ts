export type DateOnly = string;

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}

export function formatDateOnly(year: number, month: number, day: number): DateOnly {
  return `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`;
}

export function parseDateOnly(value: string | null | undefined): DateParts | null {
  if (!value) return null;
  const match = DATE_RE.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function todayParts(now = new Date()): DateParts {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function todayDateOnly(now = new Date()): DateOnly {
  const parts = todayParts(now);
  return formatDateOnly(parts.year, parts.month, parts.day);
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const next = month - 1 + delta;
  const y = year + Math.floor(next / 12);
  const m = ((next % 12) + 12) % 12;
  return { year: y, month: m + 1 };
}

export function weekdayOf(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay();
}

export function buildCalendarDates(year: number, month: number): Array<DateOnly | null> {
  const lead = weekdayOf(year, month, 1);
  const count = daysInMonth(year, month);
  const cells: Array<DateOnly | null> = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= count; day += 1) {
    cells.push(formatDateOnly(year, month, day));
  }
  return cells;
}

export function compareDateOnly(left: DateOnly, right: DateOnly): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function isDateInBound(date: DateOnly, min?: DateOnly, max?: DateOnly): boolean {
  if (min && compareDateOnly(date, min) < 0) return false;
  if (max && compareDateOnly(date, max) > 0) return false;
  return true;
}

export function isDateDisabled(
  date: DateOnly,
  options: { min?: DateOnly; max?: DateOnly; disabledDate?: (date: DateOnly) => boolean } = {},
): boolean {
  if (!isDateInBound(date, options.min, options.max)) return true;
  return Boolean(options.disabledDate?.(date));
}

export function isDateInRange(date: DateOnly, start?: DateOnly | null, end?: DateOnly | null): boolean {
  if (!start || !end) return false;
  const [from, to] = compareDateOnly(start, end) <= 0 ? [start, end] : [end, start];
  return compareDateOnly(date, from) >= 0 && compareDateOnly(date, to) <= 0;
}

export function nextRangeSelection(
  draftStart: DateOnly | null,
  next: DateOnly,
): { draftStart: DateOnly | null; value: [DateOnly, DateOnly] | null } {
  if (!draftStart) return { draftStart: next, value: null };
  if (compareDateOnly(next, draftStart) < 0) return { draftStart: next, value: null };
  return { draftStart: null, value: [draftStart, next] };
}
