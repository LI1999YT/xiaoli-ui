export function Tree({ data = [], value, onValueChange }: { data?: Array<{ key: string; title: string; children?: Array<{ key: string; title: string }> }>; value?: string; onValueChange?: (next: string) => void; }) {
  return <ul data-dui="tree">{data.map((n) => <li key={n.key}><button type="button" data-active={n.key===value} onClick={() => onValueChange?.(n.key)}>{n.title}</button>{n.children ? <ul>{n.children.map((c) => <li key={c.key}><button type="button" data-active={c.key===value} onClick={() => onValueChange?.(c.key)}>{c.title}</button></li>)}</ul> : null}</li>)}</ul>;
}
