export function Cascader({ options = [], value = [], onValueChange }: { options?: Array<{ value: string; label: string; children?: Array<{ value: string; label: string }> }>; value?: string[]; onValueChange?: (next: string[]) => void; }) {
  const [one, two] = value; const child = options.find((o) => o.value === one)?.children ?? [];
  return <div data-dui="cascader"><select value={one ?? ''} onChange={(e) => onValueChange?.([e.target.value])}><option value="">一级</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select><select value={two ?? ''} onChange={(e) => onValueChange?.([one ?? '', e.target.value])}><option value="">二级</option>{child.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}
