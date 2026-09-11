import type { ReactNode } from 'react';
export function Breadcrumb({ items = [], separator = '/' }: { items?: Array<{ label: ReactNode; href?: string }>; separator?: ReactNode; }) {
  return (
    <nav data-dui="breadcrumb" aria-label="面包屑">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {index > 0 ? <span data-part="separator">{separator}</span> : null}
            {item.href && index < items.length - 1 ? <a href={item.href}>{item.label}</a> : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
