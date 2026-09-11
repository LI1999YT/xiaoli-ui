import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  isControlled,
  isDateDisabled,
  nextRangeSelection,
  parseDateOnly,
  type DateOnly,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { Calendar } from '../calendar/calendar';

export type DatePickerValue = DateOnly | [DateOnly, DateOnly] | null;

export interface DatePickerProps {
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  mode?: 'single' | 'range';
  min?: DateOnly;
  max?: DateOnly;
  disabledDate?: (date: DateOnly) => boolean;
  clearable?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onValueChange?: (next: DatePickerValue) => void;
  onOpenChange?: (next: boolean) => void;
  onInvalidInput?: (raw: string) => void;
}

function toInputText(value: DatePickerValue): string {
  if (!value) return '';
  return Array.isArray(value) ? value.join(' ~ ') : value;
}

export function DatePicker({
  value,
  defaultValue = null,
  mode = 'single',
  min,
  max,
  disabledDate,
  clearable = false,
  open,
  defaultOpen = false,
  disabled = false,
  onValueChange,
  onOpenChange,
  onInvalidInput,
}: DatePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState<DatePickerValue>(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [draftStart, setDraftStart] = useState<DateOnly | null>(null);
  const [text, setText] = useState('');
  const current = isControlled(value) ? (value ?? null) : uncontrolled;
  const isOpen = isControlled(open) ? Boolean(open) : uncontrolledOpen;

  useEffect(() => {
    setText(toInputText(current));
  }, [current]);

  const setOpen = (next: boolean) => {
    if (!isControlled(open)) setUncontrolledOpen(next);
    onOpenChange?.(next);
    if (!next) setDraftStart(null);
  };
  const commit = (next: DatePickerValue) => {
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onDoc = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [isOpen]);

  const selectedSingle = typeof current === 'string' ? current : null;
  const range = Array.isArray(current) ? current : draftStart ? ([draftStart, draftStart] as [DateOnly, DateOnly]) : null;

  const pick = (date: DateOnly) => {
    if (isDateDisabled(date, { min, max, disabledDate })) return;
    if (mode === 'range') {
      const next = nextRangeSelection(draftStart, date);
      setDraftStart(next.draftStart);
      if (next.value) {
        commit(next.value);
        setOpen(false);
      }
      return;
    }
    commit(date);
    setOpen(false);
  };

  const applyText = () => {
    const raw = text.trim();
    if (!raw) {
      commit(null);
      return;
    }
    if (mode === 'range') {
      const [start, end] = raw.split(/\s*~\s*/);
      if (parseDateOnly(start) && parseDateOnly(end ?? '')) {
        commit([start, end as DateOnly]);
        return;
      }
      onInvalidInput?.(raw);
      setText(toInputText(current));
      return;
    }
    if (parseDateOnly(raw)) {
      commit(raw);
      return;
    }
    onInvalidInput?.(raw);
    setText(toInputText(current));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
      setText(toInputText(current));
    }
    if (event.key === 'Enter') applyText();
  };

  return (
    <div
      ref={rootRef}
      data-dui="date-picker"
      data-open={presence(isOpen)}
      data-mode={mode}
      data-disabled={presence(disabled)}
    >
      <div data-part="trigger">
        <input
          data-part="input"
          aria-label={mode === 'range' ? '日期区间' : '日期'}
          value={text}
          disabled={disabled}
          placeholder={mode === 'range' ? 'YYYY-MM-DD ~ YYYY-MM-DD' : 'YYYY-MM-DD'}
          onChange={(event) => setText(event.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={applyText}
          onKeyDown={onKeyDown}
        />
        {clearable && current && !disabled ? (
          <button
            type="button"
            data-part="clearButton"
            aria-label="清空"
            onClick={() => {
              commit(null);
              setDraftStart(null);
            }}
          >
            ×
          </button>
        ) : null}
      </div>
      {isOpen && !disabled ? (
        <div data-part="panel">
          <Calendar
            value={selectedSingle}
            min={min}
            max={max}
            disabledDate={disabledDate}
            rangeStart={range?.[0] ?? draftStart}
            rangeEnd={range?.[1] ?? draftStart}
            onValueChange={pick}
          />
        </div>
      ) : null}
    </div>
  );
}
