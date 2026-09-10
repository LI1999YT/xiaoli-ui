export function isControlled(value: unknown): boolean {
  return value !== undefined;
}

export function warnControlledSwitch(name: string, wasControlled: boolean, nowControlled: boolean): void {
  if (wasControlled === nowControlled) return;
  if (typeof console !== 'undefined') {
    console.warn(
      `[xiaoli-ui] ${name} 在挂载后从 ${wasControlled ? '受控' : '非受控'} 切换为 ${nowControlled ? '受控' : '非受控'}。受控模式应在首次渲染时固定。`,
    );
  }
}

export function getNextChecked(current: boolean, indeterminate: boolean): boolean {
  if (indeterminate) return true;
  return !current;
}
