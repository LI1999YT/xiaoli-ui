import { render } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Vue Button', () => {
  it('C02-EDGE-01 默认 type=button', () => {
    const { getByRole } = render(Button, { slots: { default: '确定' } });
    expect(getByRole('button', { name: '确定' })).toHaveAttribute('type', 'button');
  });

  it('C02-EDGE-03 loading 保留名称', () => {
    const { getByRole } = render(Button, {
      props: { loading: true },
      slots: { default: '保存' },
    });
    const button = getByRole('button', { name: '保存' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });
});
