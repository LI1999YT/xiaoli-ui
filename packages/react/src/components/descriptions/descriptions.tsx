import type { ReactNode } from 'react';
export function Descriptions({ title, items = [], columns = 2 }: { title?: ReactNode; items?: Array<{ label: ReactNode; value: ReactNode }>; columns?: number; }) {
  return (
    <div data-dui="descriptions">
      {title ? <h3 data-part="title">{title}</h3> : null}
      <dl style={{ ['--dui-descriptions-columns' as string]: String(columns) }}>
        {items.map((item, index) => (
          <div key={index} data-part="item">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
