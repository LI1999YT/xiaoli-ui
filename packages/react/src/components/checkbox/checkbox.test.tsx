import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, CheckboxGroup } from './checkbox';

describe('Checkbox', () => {
  it('C11-EDGE-01 false 不误判非受控', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange}>
        同意
      </Checkbox>,
    );
    await userEvent.click(screen.getByLabelText('同意'));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.getByLabelText('同意')).not.toBeChecked();
  });

  it('C11-EDGE-02 半选点击进入选中', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox checked={false} indeterminate onCheckedChange={onCheckedChange}>
        全选
      </Checkbox>,
    );
    expect(screen.getByRole('checkbox', { name: /全选/ })).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(screen.getByRole('checkbox', { name: /全选/ }));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('C11-EDGE-04 disabled 不切换', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox defaultChecked={false} disabled onCheckedChange={onCheckedChange}>
        关
      </Checkbox>,
    );
    await userEvent.click(screen.getByLabelText('关'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('C11-EDGE-03 组值不突变', async () => {
    const original = ['a'];
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup value={original} onValueChange={onValueChange}>
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b">B</Checkbox>
      </CheckboxGroup>,
    );
    await userEvent.click(screen.getByLabelText('B'));
    expect(onValueChange.mock.calls[0][0]).toEqual(['a', 'b']);
    expect(original).toEqual(['a']);
  });
});
