import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('打开面板后选择一天并提交 YYYY-MM-DD', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker defaultValue="2026-09-10" defaultOpen onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /^11$/ }));
    expect(onValueChange).toHaveBeenCalledWith('2026-09-11');
  });

  it('C41-EDGE-02 min 之外的日期不可选', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker defaultValue="2026-09-15" defaultOpen min="2026-09-10" max="2026-09-20" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /^1$/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('C41-EDGE-04 区间反向选择只重置起点', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker mode="range" defaultValue={['2026-09-10', '2026-09-10']} defaultOpen onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /^18$/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /^10$/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /^12$/ }));
    expect(onValueChange).toHaveBeenCalledWith(['2026-09-10', '2026-09-12']);
  });

  it('C41-EDGE-06 非法文本不提交', async () => {
    const onValueChange = vi.fn();
    const onInvalidInput = vi.fn();
    render(<DatePicker defaultValue="2026-09-10" onValueChange={onValueChange} onInvalidInput={onInvalidInput} />);
    const input = screen.getByLabelText('日期');
    await userEvent.clear(input);
    await userEvent.type(input, 'not-a-date');
    await userEvent.tab();
    expect(onInvalidInput).toHaveBeenCalledWith('not-a-date');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
