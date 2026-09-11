import { useEffect, useState } from 'react';
import {
  addMonths,
  buildCalendarDates,
  isControlled,
  isDateDisabled,
  isDateInRange,
  parseDateOnly,
  todayDateOnly,
  todayParts,
  type DateOnly,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export interface CalendarProps {
  value?: DateOnly | null;
  defaultValue?: DateOnly | null;
  onValueChange?: (next: DateOnly) => void;
  min?: DateOnly;
  max?: DateOnly;
  disabledDate?: (date: DateOnly) => boolean;
  rangeStart?: DateOnly | null;
  rangeEnd?: DateOnly | null;
}

export function Calendar({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  disabledDate,
  rangeStart,
  rangeEnd,
}: CalendarProps) {
  const [uncontrolled, setUncontrolled] = useState<DateOnly | null>(defaultValue);
  const current = isControlled(value) ? (value ?? null) : uncontrolled;
  const parsed = parseDateOnly(current) ?? parseDateOnly(rangeStart) ?? todayParts();
  const [panel, setPanel] = useState({ year: parsed.year, month: parsed.month });

  useEffect(() => {
    const next = parseDateOnly(current);
    if (next) setPanel({ year: next.year, month: next.month });
  }, [current]);

  const today = todayDateOnly();
  const cells = buildCalendarDates(panel.year, panel.month);
  const pick = (date: DateOnly) => {
    if (isDateDisabled(date, { min, max, disabledDate })) return;
    if (!isControlled(value)) setUncontrolled(date);
    onValueChange?.(date);
  };
  const shift = (delta: number) => setPanel((prev) => addMonths(prev.year, prev.month, delta));

  return (
    <div data-dui="calendar">
      <div data-part="header">
        <button type="button" aria-label="上个月" onClick={() => shift(-1)}>
          ‹
        </button>
        <div data-part="caption">
          {panel.year}年{panel.month}月
        </div>
        <button type="button" aria-label="下个月" onClick={() => shift(1)}>
          ›
        </button>
      </div>
      <div data-part="grid" role="grid" aria-label="日历">
        {WEEKDAYS.map((day) => (
          <span key={day} data-part="weekday">
            {day}
          </span>
        ))}
        {cells.map((date, index) =>
          date ? (
            <button
              key={date}
              type="button"
              data-part="day"
              data-selected={presence(date === current || date === rangeStart || date === rangeEnd)}
              data-today={presence(date === today)}
              data-in-range={presence(isDateInRange(date, rangeStart, rangeEnd))}
              data-disabled={presence(isDateDisabled(date, { min, max, disabledDate }))}
              disabled={isDateDisabled(date, { min, max, disabledDate })}
              onClick={() => pick(date)}
            >
              {parseDateOnly(date)?.day}
            </button>
          ) : (
            <span key={`empty-${index}`} />
          ),
        )}
      </div>
    </div>
  );
}
