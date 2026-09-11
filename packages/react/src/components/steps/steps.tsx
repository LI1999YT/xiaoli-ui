import type { ReactNode } from 'react';
export function Steps({ items = [], current = 0 }: { items?: Array<{ title: ReactNode; description?: ReactNode }>; current?: number; }) {
  return (
    <ol data-dui="steps">
      {items.map((item, index) => (
        <li key={index} data-status={index < current ? 'done' : index === current ? 'process' : 'wait'}>
          <span data-part="index">{index + 1}</span>
          <span data-part="title">{item.title}</span>
          {item.description ? <span data-part="description">{item.description}</span> : null}
        </li>
      ))}
    </ol>
  );
}
