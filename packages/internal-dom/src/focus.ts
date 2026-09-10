const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function isVisible(element: HTMLElement): boolean {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  return Boolean(style && style.visibility !== 'hidden' && style.display !== 'none');
}

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1 && isVisible(element),
  );
}

export function focusElement(element: HTMLElement | null | undefined): void {
  if (!element) return;
  if (typeof element.focus === 'function') {
    element.focus({ preventScroll: true });
  }
}

export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;
  const focusable = getFocusable(container);
  if (focusable.length === 0) {
    event.preventDefault();
    focusElement(container);
    return;
  }
  const doc = container.ownerDocument;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = doc.activeElement as HTMLElement | null;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    focusElement(last);
  } else if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault();
    focusElement(first);
  }
}

export function isFocusable(element: HTMLElement | null): boolean {
  if (!element) return false;
  return getFocusable(element).includes(element) || element.tabIndex >= 0;
}
