import { type ReactNode } from 'react';
export function Anchor({ items = [] }: { items?: Array<{ href: string; label: ReactNode }>; }) {
  return <nav data-dui="anchor">{items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>;
}
