export type LayerReason = 'escape' | 'outside';

export interface LayerRecord {
  id: string;
  modal: boolean;
  closeOnEscape: boolean;
  closeOnOutside: boolean;
  content: HTMLElement | null;
  onDismiss: (reason: LayerReason, event?: Event) => void;
}

const stacks = new WeakMap<Document, LayerRecord[]>();

function stackOf(doc: Document): LayerRecord[] {
  const existing = stacks.get(doc);
  if (existing) return existing;
  const next: LayerRecord[] = [];
  stacks.set(doc, next);
  return next;
}

export function pushLayer(doc: Document, layer: LayerRecord): () => void {
  const stack = stackOf(doc);
  stack.push(layer);
  return () => {
    const index = stack.findIndex((item) => item.id === layer.id);
    if (index >= 0) stack.splice(index, 1);
  };
}

export function topLayer(doc: Document): LayerRecord | undefined {
  const stack = stacks.get(doc);
  return stack?.[stack.length - 1];
}

export function dismissTop(doc: Document, reason: LayerReason, event?: Event): boolean {
  const top = topLayer(doc);
  if (!top) return false;
  if (reason === 'escape' && !top.closeOnEscape) return false;
  if (reason === 'outside' && !top.closeOnOutside) return false;
  top.onDismiss(reason, event);
  return true;
}

export function isEventInsideLayer(event: Event, layer: LayerRecord): boolean {
  const path = event.composedPath();
  return Boolean(layer.content && path.includes(layer.content));
}
