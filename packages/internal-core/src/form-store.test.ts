import { describe, expect, it } from 'vitest';
import { FormStore, required } from './form-store';

describe('FormStore', () => {
  it('C15-EDGE-01 异步校验竞态只采纳最新结果', async () => {
    let resolveFirst: ((value: string | undefined) => void) | undefined;
    const store = new FormStore({
      initialValues: { name: '' },
      validators: [
        {
          path: ['name'],
          validators: [
            (value) =>
              new Promise((resolve) => {
                if (value === 'old') resolveFirst = resolve;
                else resolve(value === 'bad' ? '错误' : undefined);
              }),
          ],
        },
      ],
    });

    const first = store.validateField(['name'], 'change');
    store.setFieldValue(['name'], 'ok');
    const second = store.validateField(['name'], 'change');
    resolveFirst?.('过期错误');
    await Promise.all([first, second]);
    expect(store.errors.get('name')).toBeUndefined();
  });

  it('C15-EDGE-02 提交中重复点击只执行一次', async () => {
    let count = 0;
    const store = new FormStore({
      initialValues: { name: 'a' },
      validators: [{ path: ['name'], validators: [required()] }],
    });
    const first = store.submit(async () => {
      count += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    const second = store.submit(async () => {
      count += 1;
    });
    await Promise.all([first, second]);
    expect(count).toBe(1);
  });

  it('C15-EDGE-05 数组路径读写', () => {
    const store = new FormStore({
      initialValues: { tags: ['a'] },
    });
    store.setFieldValue(['tags', 0], 'b');
    expect(store.values.tags[0]).toBe('b');
  });
});
