export function Picker({ columns = [], value = [], onValueChange }: { columns?: string[][]; value?: string[]; onValueChange?: (next: string[]) => void; }) {
  return <div data-dui="picker">{columns.map((col, i) => <select key={i} value={value[i] ?? col[0]} onChange={(e) => { const next = [...value]; next[i] = e.target.value; onValueChange?.(next); }}>{col.map((opt) => <option key={opt}>{opt}</option>)}</select>)}</div>;
}
