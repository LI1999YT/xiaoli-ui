export function resolveContainer(
  container: HTMLElement | (() => HTMLElement | null) | null | undefined,
  fallback: HTMLElement | null,
): HTMLElement | null {
  if (typeof container === 'function') {
    return container() ?? fallback;
  }
  return container ?? fallback;
}

export function applyThemeToHost(host: HTMLElement, vars: Record<string, string>, dataset: Record<string, string>): void {
  const previous = host.getAttribute('data-dui-var-keys')?.split(',') ?? [];
  const nextKeys = Object.keys(vars);
  for (const key of previous) {
    if (key && !nextKeys.includes(key)) {
      host.style.removeProperty(key);
    }
  }
  for (const [key, value] of Object.entries(vars)) {
    host.style.setProperty(key, value);
  }
  host.setAttribute('data-dui-var-keys', nextKeys.join(','));
  for (const [key, value] of Object.entries(dataset)) {
    host.setAttribute(key, value);
  }
}

export function createPortalHost(doc: Document): HTMLElement {
  const host = doc.createElement('div');
  host.setAttribute('data-dui-portal-host', '');
  doc.body.append(host);
  return host;
}
