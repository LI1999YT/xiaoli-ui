import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToastStore } from './toast-store';

afterEach(() => {
  vi.useRealTimers();
});

describe('ToastStore', () => {
  it('C20-EDGE-01 相同 id 更新而不是堆叠', () => {
    const store = new ToastStore();
    store.show({ id: 'one', message: 'a' });
    store.show({ id: 'one', message: 'b' });
    expect(store.items).toHaveLength(1);
    expect(store.items[0].message).toBe('b');
  });

  it('C20-EDGE-02 duration=0 不自动关闭', () => {
    vi.useFakeTimers();
    const store = new ToastStore();
    store.show({ message: 'stay', duration: 0 });
    vi.advanceTimersByTime(10_000);
    expect(store.items).toHaveLength(1);
  });

  it('C20-EDGE-04 超出 maxVisible 进入队列', () => {
    const store = new ToastStore(1);
    store.show({ message: '1' });
    store.show({ message: '2' });
    expect(store.items).toHaveLength(1);
    expect(store.queue).toHaveLength(1);
  });

  it('C20-EDGE-06 重复关闭只成功一次', () => {
    const store = new ToastStore();
    const id = store.show({ message: 'x', duration: 0 });
    expect(store.dismiss(id)).toBe(true);
    expect(store.dismiss(id)).toBe(false);
  });
});
