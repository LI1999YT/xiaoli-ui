import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

export function Calendar({ value, defaultValue, onValueChange }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; }) {
  const today = new Date();
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const current = isControlled(value) ? (value as string) : uncontrolled;
  const cursor = current ? new Date(current) : today;
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const pick = (day: number) => {
    const next = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!isControlled(value)) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <div data-dui="calendar">
      <div data-part="caption">{year}年{month + 1}月</div>
      <div data-part="grid">
        {['日','一','二','三','四','五','六'].map((d) => <span key={d} data-part="weekday">{d}</span>)}
        {cells.map((day, i) => day ? <button key={i} type="button" data-selected={presence(current.endsWith(`-${String(day).padStart(2,'0')}`) && current.startsWith(`${year}-${String(month+1).padStart(2,'0')}`))} onClick={() => pick(day)}>{day}</button> : <span key={i} />)}
      </div>
    </div>
  );
}
