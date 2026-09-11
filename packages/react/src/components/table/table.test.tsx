import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './table';

const columns = [
  { key: 'name', title: '姓名', sortable: true, filterable: true },
  { key: 'city', title: '城市', filterable: true },
  { key: 'score', title: '分数', sortable: true },
];

const data = [
  { id: '1', name: '小狸', city: '京都', score: 92 },
  { id: '2', name: '星屑', city: '东京', score: 88 },
  { id: '3', name: '月光', city: '大阪', score: 95 },
];

describe('Table', () => {
  it('C43-EDGE-02 点击排序发出 sort 并重排行', async () => {
    const onSortChange = vi.fn();
    render(
      <Table
        caption="角色表"
        rowKey="id"
        columns={columns}
        data={data}
        onSortChange={onSortChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /分数/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'score', order: 'asc' });
    const cells = screen.getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toContain('88');
  });

  it('C43-EDGE-03 空与 loading 状态分离', () => {
    const { rerender } = render(<Table caption="空表" rowKey="id" columns={columns} data={[]} />);
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    rerender(<Table caption="空表" rowKey="id" columns={columns} data={[]} loading />);
    expect(screen.getByText('加载中…')).toBeInTheDocument();
  });

  it('C43-EDGE-06 单元格按钮不触发行点击', async () => {
    const onRowClick = vi.fn();
    render(
      <Table
        caption="选择表"
        rowKey="id"
        selectable
        columns={columns}
        data={data}
        onRowClick={onRowClick}
      />,
    );
    await userEvent.click(screen.getByLabelText('选择 1'));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('C43-EDGE-09 筛选后只保留匹配行', async () => {
    render(<Table caption="筛选表" rowKey="id" columns={columns} data={data} />);
    await userEvent.type(screen.getByLabelText('筛选 城市'), '京都');
    expect(screen.getByText('小狸')).toBeInTheDocument();
    expect(screen.queryByText('星屑')).not.toBeInTheDocument();
  });
});
