import { type ReactNode } from 'react';

export interface TableColumn<T> { key: string; title: ReactNode; render?: (row: T) => ReactNode; }
export function Table<T extends Record<string, unknown>>({ data = [], columns = [], rowKey, caption }: { data?: T[]; columns?: TableColumn<T>[]; rowKey: keyof T | ((row: T) => string); caption?: string; }) {
  const keyOf = (row: T, index: number) => String(typeof rowKey === 'function' ? rowKey(row) : row[rowKey] ?? index);
  return (
    <div data-dui="table">
      <table>
        {caption ? <caption>{caption}</caption> : null}
        <thead><tr>{columns.map((col) => <th key={col.key}>{col.title}</th>)}</tr></thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan={Math.max(columns.length, 1)}>暂无数据</td></tr> : data.map((row, index) => (
            <tr key={keyOf(row, index)}>{columns.map((col) => <td key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? '')}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
