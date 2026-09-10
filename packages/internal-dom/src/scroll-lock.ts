interface LockState {
  count: number;
  overflow: string;
  paddingRight: string;
  scrollY: number;
}

const locks = new WeakMap<Document, LockState>();

export function lockScroll(doc: Document): void {
  const view = doc.defaultView;
  const current = locks.get(doc) ?? {
    count: 0,
    overflow: doc.body.style.overflow,
    paddingRight: doc.body.style.paddingRight,
    scrollY: view?.scrollY ?? 0,
  };
  if (current.count === 0 && view) {
    const scrollbar = view.innerWidth - doc.documentElement.clientWidth;
    current.scrollY = view.scrollY;
    doc.body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      doc.body.style.paddingRight = `${scrollbar}px`;
    }
  }
  current.count += 1;
  locks.set(doc, current);
}

export function unlockScroll(doc: Document): void {
  const current = locks.get(doc);
  if (!current) return;
  current.count -= 1;
  if (current.count > 0) {
    locks.set(doc, current);
    return;
  }
  doc.body.style.overflow = current.overflow;
  doc.body.style.paddingRight = current.paddingRight;
  locks.delete(doc);
}
