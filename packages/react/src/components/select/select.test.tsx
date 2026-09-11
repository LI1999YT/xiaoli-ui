import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './select';

describe('Select', () => {
  it('打开后选择一项', async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        defaultValue={null}
        onValueChange={onValueChange}
        options={[
          { value: 'tokyo', label: '东京' },
          { value: 'kyoto', label: '京都' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: '请选择' }));
    await userEvent.click(screen.getByRole('option', { name: '京都' }));
    expect(onValueChange).toHaveBeenCalledWith('kyoto');
  });
});
