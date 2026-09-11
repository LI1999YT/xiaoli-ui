import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PullRefresh } from './pull-refresh';

describe('PullRefresh', () => {
  it('键盘刷新按钮可以触发 onRefresh', async () => {
    const onRefresh = vi.fn(async () => undefined);
    render(
      <PullRefresh onRefresh={onRefresh}>
        <div>内容</div>
      </PullRefresh>,
    );
    await userEvent.click(screen.getByRole('button', { name: '刷新' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
