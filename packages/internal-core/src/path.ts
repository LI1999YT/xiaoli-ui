export type FieldPath = readonly (string | number)[];

export function pathKey(path: FieldPath): string {
  return path.map(String).join('\u0000');
}

export function getPath<T>(source: unknown, path: FieldPath): T {
  let current: unknown = source;
  for (const segment of path) {
    if (current == null || typeof current !== 'object') {
      return undefined as T;
    }
    current = (current as Record<string | number, unknown>)[segment];
  }
  return current as T;
}

export function setPath<T>(source: T, path: FieldPath, value: unknown): T {
  if (path.length === 0) return value as T;
  const clone = Array.isArray(source) ? [...source] : { ...(source as Record<string, unknown>) };
  const [head, ...rest] = path;
  if (rest.length === 0) {
    (clone as Record<string | number, unknown>)[head] = value;
    return clone as T;
  }
  const nested = (source as Record<string | number, unknown>)?.[head];
  const fallback = typeof rest[0] === 'number' ? [] : {};
  (clone as Record<string | number, unknown>)[head] = setPath(nested ?? fallback, rest, value);
  return clone as T;
}

export function deletePath<T>(source: T, path: FieldPath): T {
  if (path.length === 0) return source;
  if (path.length === 1) {
    const clone = Array.isArray(source) ? [...source] : { ...(source as Record<string, unknown>) };
    if (Array.isArray(clone) && typeof path[0] === 'number') {
      clone.splice(path[0], 1);
    } else {
      delete (clone as Record<string, unknown>)[String(path[0])];
    }
    return clone as T;
  }
  const [head, ...rest] = path;
  const nested = (source as Record<string | number, unknown>)?.[head];
  if (nested == null) return source;
  return setPath(source, [head], deletePath(nested, rest));
}
