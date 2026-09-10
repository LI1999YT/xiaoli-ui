import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('可输入并通知', async () => {
    const onValueChange = vi.fn();
    render(<Textarea aria-label="简介" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByLabelText('简介'), 'hi');
    expect(onValueChange).toHaveBeenCalled();
    expect(screen.getByLabelText('简介')).toHaveValue('hi');
  });
});
