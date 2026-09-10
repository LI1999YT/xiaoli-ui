export function Transfer({ data = [], value = [], onValueChange }: { data?: Array<{ key: string; title: string }>; value?: string[]; onValueChange?: (next: string[]) => void; }) {
  const selected = new Set(value);
  const move = (key: string, toTarget: boolean) => { const next = new Set(selected); if (toTarget) next.add(key); else next.delete(key); onValueChange?.([...next]); };
  return <div data-dui="transfer"><ul>{data.filter((i) => !selected.has(i.key)).map((i) => <li key={i.key}><button type="button" onClick={() => move(i.key, true)}>{i.title} →</button></li>)}</ul><ul>{data.filter((i) => selected.has(i.key)).map((i) => <li key={i.key}><button type="button" onClick={() => move(i.key, false)}>← {i.title}</button></li>)}</ul></div>;
}
