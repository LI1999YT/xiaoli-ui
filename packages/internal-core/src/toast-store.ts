import { createId } from './ids';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error' | 'loading';
export type ToastCloseReason = 'timeout' | 'dismiss' | 'update' | 'unmount';

export interface ToastOptions {
  message: string;
  status?: ToastStatus;
  duration?: number;
  id?: string;
  actionLabel?: string;
}

export interface ToastItem extends ToastOptions {
  id: string;
  status: ToastStatus;
  duration: number;
  remaining: number;
  startedAt: number;
  paused: boolean;
}

export class ToastStore {
  items: ToastItem[] = [];
  queue: ToastItem[] = [];
  maxVisible: number;
  private listeners = new Set<() => void>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private closed = new Set<string>();

  constructor(maxVisible = 3) {
    this.maxVisible = maxVisible;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }

  private promote(): void {
    while (this.items.length < this.maxVisible && this.queue.length > 0) {
      const next = this.queue.shift();
      if (!next) break;
      this.items.push(next);
      this.startTimer(next);
    }
  }

  private startTimer(item: ToastItem): void {
    this.clearTimer(item.id);
    if (item.duration === 0 || item.status === 'loading') return;
    item.startedAt = Date.now();
    this.timers.set(
      item.id,
      setTimeout(() => {
        this.dismiss(item.id, 'timeout');
      }, item.remaining),
    );
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
  }

  show(options: ToastOptions): string {
    const id = options.id ?? createId('toast');
    const duration = options.duration ?? (options.status === 'loading' ? 0 : 4000);
    const existingIndex = this.items.findIndex((item) => item.id === id);
    const next: ToastItem = {
      message: options.message,
      actionLabel: options.actionLabel,
      id,
      status: options.status ?? 'info',
      duration,
      remaining: duration,
      startedAt: Date.now(),
      paused: false,
    };

    if (existingIndex >= 0) {
      this.clearTimer(this.items[existingIndex].id);
      this.items[existingIndex] = next;
      this.startTimer(next);
      this.notify();
      return id;
    }

    const queuedIndex = this.queue.findIndex((item) => item.id === id);
    if (queuedIndex >= 0) {
      this.queue[queuedIndex] = next;
      this.notify();
      return id;
    }

    if (this.items.length < this.maxVisible) {
      this.items.push(next);
      this.startTimer(next);
    } else {
      this.queue.push(next);
    }
    this.notify();
    return id;
  }

  update(id: string, options: Partial<ToastOptions>): void {
    const found = this.items.find((item) => item.id === id) ?? this.queue.find((item) => item.id === id);
    if (!found) return;
    Object.assign(found, options);
    if (options.duration !== undefined) {
      found.remaining = options.duration;
      this.startTimer(found);
    }
    this.notify();
  }

  dismiss(id: string, _reason: ToastCloseReason = 'dismiss'): boolean {
    if (this.closed.has(id)) return false;
    const before = this.items.length + this.queue.length;
    this.items = this.items.filter((item) => item.id !== id);
    this.queue = this.queue.filter((item) => item.id !== id);
    this.clearTimer(id);
    if (this.items.length + this.queue.length === before) return false;
    this.closed.add(id);
    this.promote();
    this.notify();
    return true;
  }

  dismissAll(): void {
    for (const item of [...this.items, ...this.queue]) {
      this.dismiss(item.id, 'dismiss');
    }
  }

  pause(id?: string): void {
    const targets = id ? this.items.filter((item) => item.id === id) : this.items;
    for (const item of targets) {
      if (item.paused || item.duration === 0) continue;
      item.remaining = Math.max(0, item.remaining - (Date.now() - item.startedAt));
      item.paused = true;
      this.clearTimer(item.id);
    }
  }

  resume(id?: string): void {
    const targets = id ? this.items.filter((item) => item.id === id) : this.items;
    for (const item of targets) {
      if (!item.paused) continue;
      item.paused = false;
      this.startTimer(item);
    }
  }

  dispose(): void {
    for (const id of this.timers.keys()) this.clearTimer(id);
    this.items = [];
    this.queue = [];
    this.notify();
  }
}
