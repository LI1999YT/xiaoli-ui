let seq = 0;

export function createId(prefix = 'dui'): string {
  seq += 1;
  return `${prefix}-${seq.toString(36)}`;
}

export function resetIdsForTests(): void {
  seq = 0;
}
