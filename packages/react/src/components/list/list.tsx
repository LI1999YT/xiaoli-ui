import type { ReactNode } from 'react';
export function List({ items = [] }: { items?: Array<{ key: string; title: ReactNode; description?: ReactNode }>; }) {
  return (
    <ul data-dui="list">
      {items.map((item) => (
        <li key={item.key} data-part="item">
          <div data-part="title">{item.title}</div>
          {item.description ? <div data-part="description">{item.description}</div> : null}
        </li>
      ))}
    </ul>
  );
}
