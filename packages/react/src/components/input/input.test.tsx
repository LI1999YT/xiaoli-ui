import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('C09-EDGE-02 0 字符串不丢', async () => {
    const onValueChange = vi.fn();
    render(<Input defaultValue="0" onValueChange={onValueChange} aria-label="数量" />);
    const input = screen.getByLabelText('数量');
    expect(input).toHaveValue('0');
    await userEvent.type(input, '1');
    expect(onValueChange).toHaveBeenCalled();
  });

  it('C09-EDGE-03 受控父不更新时不漂移', async () => {
    function Locked() {
      const [value] = useState('lock');
      return <Input value={value} aria-label="锁定" onValueChange={() => undefined} />;
    }
    render(<Locked />);
    const input = screen.getByLabelText('锁定') as HTMLInputElement;
    await userEvent.type(input, 'x');
    expect(input.value).toBe('lock');
  });

  it('C09-EDGE-04 clear 一次通知并保焦点', async () => {
    const onValueChange = vi.fn();
    render(<Input defaultValue="hi" clearable onValueChange={onValueChange} aria-label="姓名" />);
    await userEvent.click(screen.getByRole('button', { name: '清空' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toBe('');
    expect(screen.getByLabelText('姓名')).toHaveFocus();
  });
});
