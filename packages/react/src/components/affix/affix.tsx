import { useEffect, useRef, useState, type ReactNode } from 'react';
import { presence } from '../../utils/dom';

export interface AffixProps {
  offset?: number;
  children?: ReactNode;
  onChange?: (fixed: boolean) => void;
}

export function Affix({ offset = 0, children, onChange }: AffixProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = Boolean(entry && !entry.isIntersecting && entry.boundingClientRect.top < offset);
        setFixed((prev) => {
          if (prev !== next) onChange?.(next);
          return next;
        });
      },
      { root: null, rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [offset, onChange]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return undefined;
    const measure = () => setSize({ width: node.offsetWidth, height: node.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div data-dui="affix" data-fixed={presence(fixed)}>
      <div ref={sentinelRef} data-part="sentinel" />
      {fixed ? <div data-part="placeholder" style={{ height: size.height }} /> : null}
      <div
        ref={contentRef}
        data-part="content"
        style={fixed ? { top: offset, width: size.width } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
