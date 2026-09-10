import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from './tabs';

describe('Tabs', () => {
  it('切换页签展示对应面板', async () => {
    render(
      <Tabs
        defaultValue="one"
        items={[
          { value: 'one', label: '一', content: '面板一' },
          { value: 'two', label: '二', content: '面板二' },
        ]}
      />,
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('面板一');
    await userEvent.click(screen.getByRole('tab', { name: '二' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('面板二');
  });
});
