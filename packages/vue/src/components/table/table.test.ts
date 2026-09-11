import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Table } from './table';

const columns = [
  { key: 'name', title: '姓名', sortable: true, filterable: true },
  { key: 'city', title: '城市', filterable: true },
];
const data = [
  { id: '1', name: '小狸', city: '京都' },
  { id: '2', name: '星屑', city: '东京' },
];

describe('Vue Table', () => {
  it('筛选后只保留匹配行', async () => {
    const { getByLabelText, getByText, queryByText } = render(Table, {
      props: { caption: '角色表', rowKey: 'id', columns, data },
    });
    await userEvent.type(getByLabelText('筛选 城市'), '京都');
    expect(getByText('小狸')).toBeTruthy();
    expect(queryByText('星屑')).toBeNull();
  });
});
