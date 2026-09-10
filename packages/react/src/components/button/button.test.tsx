import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('C02-EDGE-01 默认 type=button 不提交 form', async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>确定</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('C02-EDGE-03 loading 阻止重复点击并保留名称', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        保存
      </Button>,
    );
    const button = screen.getByRole('button', { name: '保存' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('C02-EDGE-04 disabled 不可激活', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        禁用
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: '禁用' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
