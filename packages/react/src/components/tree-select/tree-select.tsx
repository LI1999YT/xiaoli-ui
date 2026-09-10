export function TreeSelect({ options = [], value, onValueChange }: { options?: Array<{ value: string; label: string }>; value?: string; onValueChange?: (next: string) => void; }) {
  return <select data-dui="tree-select" value={value ?? ''} onChange={(e) => onValueChange?.(e.target.value)}><option value="">请选择</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}
