import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button/button.tsx';
import { Checkbox } from '../checkbox/checkbox.tsx';
import { Input } from '../input/input.tsx';
import { Form, FormActions, FormControl, FormError, FormField, FormLabel, required } from './form';

describe('Form', () => {
  it('C15-EDGE-02 提交中重复点击不二次执行业务提交', async () => {
    const onSubmit = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 30));
    });
    render(
      <Form
        defaultValues={{ name: 'Ada' }}
        validators={[{ path: ['name'], validators: [required()] }]}
        onSubmit={onSubmit}
      >
        <FormField name={['name']}>
          {({ field }) => (
            <>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input aria-label="姓名" {...field.inputProps} />
              </FormControl>
              <FormError />
            </>
          )}
        </FormField>
        <FormActions>
          <Button htmlType="submit">提交</Button>
        </FormActions>
      </Form>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '提交' }));
    await user.click(screen.getByRole('button', { name: '提交' }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it('表单输入与勾选可更新', async () => {
    render(
      <Form defaultValues={{ name: '', agreed: false }}>
        <FormField name={['name']}>
          {({ field }) => <Input aria-label="姓名" {...field.inputProps} />}
        </FormField>
        <FormField name={['agreed']}>
          {({ field }) => <Checkbox {...field.checkboxProps}>同意</Checkbox>}
        </FormField>
      </Form>,
    );
    await userEvent.type(screen.getByLabelText('姓名'), 'Ada');
    expect(screen.getByLabelText('姓名')).toHaveValue('Ada');
    await userEvent.click(screen.getByLabelText('同意'));
    expect(screen.getByLabelText('同意')).toBeChecked();
  });

  it('校验失败展示错误', async () => {
    render(
      <Form defaultValues={{ name: '', agreed: false }} validators={[{ path: ['name'], validators: [required('请输入姓名')] }]}>
        <FormField name={['name']}>
          {({ field }) => (
            <>
              <FormLabel>姓名</FormLabel>
              <Input aria-label="姓名" {...field.inputProps} />
              <FormError />
            </>
          )}
        </FormField>
        <FormField name={['agreed']}>
          {({ field }) => <Checkbox {...field.checkboxProps}>同意</Checkbox>}
        </FormField>
        <Button htmlType="submit">提交</Button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('请输入姓名');
  });
});
