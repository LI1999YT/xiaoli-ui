import { useState, type ReactNode } from 'react';
export function Carousel({ items = [], children }: { items?: ReactNode[]; children?: ReactNode; }) {
  const slides = items.length ? items : (Array.isArray(children) ? children : children ? [children] : []);
  const [index, setIndex] = useState(0);
  return <div data-dui="carousel"><button type="button" aria-label="上一张" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}>‹</button><div data-part="viewport">{slides[index]}</div><button type="button" aria-label="下一张" onClick={() => setIndex((i) => (i + 1) % slides.length)}>›</button></div>;
}
