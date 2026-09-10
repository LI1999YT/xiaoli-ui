import { type ReactNode } from 'react';
export function Timeline({ items = [] }: { items?: Array<{ title: ReactNode; description?: ReactNode }>; }) {
  return <ol data-dui="timeline">{items.map((item, i) => <li key={i}><span data-part="dot" /><div><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</div></li>)}</ol>;
}
