import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './switch';

describe('Switch', () => {
  it('C13-EDGE-01 单次点击单次事件', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange}>夜间</Switch>);
    await userEvent.click(screen.getByRole('switch', { name: '夜间' }));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('C13-EDGE-02 false 受控不漂移', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch checked={false} onCheckedChange={onCheckedChange}>
        关
      </Switch>,
    );
    await userEvent.click(screen.getByRole('switch', { name: '关' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });
});
