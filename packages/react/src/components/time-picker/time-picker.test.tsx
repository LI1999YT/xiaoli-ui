import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from './time-picker';

describe('TimePicker', () => {
  it('列选择只改草稿，确认后才提交', async () => {
    const onValueChange = vi.fn();
    const onConfirm = vi.fn();
    render(<TimePicker defaultValue="17:00" defaultOpen onValueChange={onValueChange} onConfirm={onConfirm} />);
    const hours = screen.getByLabelText('小时');
    await userEvent.click(hours.querySelector('[data-part="columnItem"]') as HTMLButtonElement);
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: '确认' }));
    expect(onValueChange).toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
  });

  it('C42-EDGE-06 取消还原草稿', async () => {
    const onValueChange = vi.fn();
    render(<TimePicker defaultValue="17:00" defaultOpen onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('时间')).toHaveValue('17:00');
  });
});
