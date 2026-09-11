import { useState } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
export function SearchBar({ value, defaultValue = '', onValueChange, onSearch }: { value?: string; defaultValue?: string; onValueChange?: (next: string) => void; onSearch?: (next: string) => void; }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled(value) ? (value as string) : uncontrolled;
  const set = (next: string) => { if (!isControlled(value)) setUncontrolled(next); onValueChange?.(next); };
  return <form data-dui="search-bar" onSubmit={(e) => { e.preventDefault(); onSearch?.(current); }}><input type="search" value={current} placeholder="搜索" onChange={(e) => set(e.target.value)} /><button type="submit">搜索</button></form>;
}
