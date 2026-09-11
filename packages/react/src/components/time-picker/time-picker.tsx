import { useEffect, useRef, useState } from 'react';
import {
  buildStepValues,
  defaultTimeParts,
  formatTimeOnly,
  hour12Display,
  hourFrom12,
  isControlled,
  isTimeDisabled,
  parseTimeOnly,
  type TimeOnly,
  type TimeParts,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

export interface TimePickerProps {
  value?: TimeOnly | null;
  defaultValue?: TimeOnly | null;
  showSeconds?: boolean;
  hourCycle?: 'h12' | 'h23';
  minuteStep?: number;
  secondStep?: number;
  min?: TimeOnly;
  max?: TimeOnly;
  disabledTime?: (time: TimeOnly) => boolean;
  clearable?: boolean;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onValueChange?: (next: TimeOnly | null) => void;
  onOpenChange?: (next: boolean) => void;
  onConfirm?: (next: TimeOnly) => void;
}

function cloneParts(parts: TimeParts): TimeParts {
  return { hour: parts.hour, minute: parts.minute, second: parts.second };
}

export function TimePicker({
  value,
  defaultValue = null,
  showSeconds = false,
  hourCycle = 'h23',
  minuteStep = 1,
  secondStep = 1,
  min,
  max,
  disabledTime,
  clearable = false,
  disabled = false,
  open,
  defaultOpen = false,
  onValueChange,
  onOpenChange,
  onConfirm,
}: TimePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState<TimeOnly | null>(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const current = isControlled(value) ? (value ?? null) : uncontrolled;
  const isOpen = isControlled(open) ? Boolean(open) : uncontrolledOpen;
  const committed = parseTimeOnly(current) ?? defaultTimeParts(showSeconds);
  const [draft, setDraft] = useState<TimeParts>(committed);

  useEffect(() => {
    if (isOpen) setDraft(parseTimeOnly(current) ?? defaultTimeParts(showSeconds));
  }, [isOpen, current, showSeconds]);

  const setOpen = (next: boolean) => {
    if (!isControlled(open)) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const commit = (next: TimeOnly | null) => {
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onDoc = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDraft(cloneParts(committed));
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, committed]);

  const hours = hourCycle === 'h12' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : buildStepValues(24, 1);
  const minutes = buildStepValues(60, minuteStep);
  const seconds = buildStepValues(60, secondStep);
  const display = hour12Display(draft.hour);

  const applyDraft = (next: TimeParts) => {
    const formatted = formatTimeOnly(next, showSeconds);
    if (isTimeDisabled(formatted, { min, max, disabledTime })) return;
    setDraft(next);
  };

  const confirm = () => {
    const next = formatTimeOnly(draft, showSeconds);
    if (isTimeDisabled(next, { min, max, disabledTime })) return;
    commit(next);
    onConfirm?.(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} data-dui="time-picker" data-open={presence(isOpen)} data-disabled={presence(disabled)}>
      <div data-part="trigger">
        <input
          data-part="input"
          aria-label="时间"
          readOnly
          disabled={disabled}
          value={current ?? ''}
          placeholder={showSeconds ? 'HH:mm:ss' : 'HH:mm'}
          onClick={() => !disabled && setOpen(!isOpen)}
        />
        {clearable && current && !disabled ? (
          <button type="button" data-part="clearButton" aria-label="清空" onClick={() => commit(null)}>
            ×
          </button>
        ) : null}
      </div>
      {isOpen && !disabled ? (
        <div data-part="panel">
          <div data-part="columns">
            <div data-part="hour" aria-label="小时">
              {hours.map((hour) => {
                const actual = hourCycle === 'h12' ? hourFrom12(hour, display.period) : hour;
                return (
                  <button
                    key={`h-${hour}`}
                    type="button"
                    data-part="columnItem"
                    data-active={presence(draft.hour === actual)}
                    onClick={() => applyDraft({ ...draft, hour: actual })}
                  >
                    {String(hour).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
            <div data-part="minute" aria-label="分钟">
              {minutes.map((minute) => (
                <button
                  key={`m-${minute}`}
                  type="button"
                  data-part="columnItem"
                  data-active={presence(draft.minute === minute)}
                  onClick={() => applyDraft({ ...draft, minute })}
                >
                  {String(minute).padStart(2, '0')}
                </button>
              ))}
            </div>
            {showSeconds ? (
              <div data-part="second" aria-label="秒">
                {seconds.map((second) => (
                  <button
                    key={`s-${second}`}
                    type="button"
                    data-part="columnItem"
                    data-active={presence(draft.second === second)}
                    onClick={() => applyDraft({ ...draft, second })}
                  >
                    {String(second).padStart(2, '0')}
                  </button>
                ))}
              </div>
            ) : null}
            {hourCycle === 'h12' ? (
              <div data-part="period" aria-label="上午或下午">
                {(['AM', 'PM'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    data-part="columnItem"
                    data-active={presence(display.period === period)}
                    onClick={() => applyDraft({ ...draft, hour: hourFrom12(display.display, period) })}
                  >
                    {period}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div data-part="footer">
            <button type="button" onClick={() => { setDraft(cloneParts(committed)); setOpen(false); }}>
              取消
            </button>
            <button type="button" onClick={confirm}>
              确认
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
