import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DatePicker } from './date-picker';

describe('Vue DatePicker', () => {
  it('打开面板后选择一天', async () => {
    const { getByRole, emitted } = render(DatePicker, {
      props: { defaultValue: '2026-09-10', defaultOpen: true },
    });
    await userEvent.click(getByRole('button', { name: /^11$/ }));
    expect(emitted()['update:modelValue']?.[0]).toEqual(['2026-09-11']);
  });
});
