import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './radio';

describe('Radio', () => {
  it('C12-EDGE-01 排他性', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="a" onValueChange={onValueChange}>
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );
    await userEvent.click(screen.getByLabelText('B'));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByLabelText('B')).toBeChecked();
    expect(screen.getByLabelText('A')).not.toBeChecked();
  });
});
