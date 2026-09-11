import { describe, expect, it } from 'vitest';
import { deriveTableRows, nextTableSort } from './table';

const columns = [
  { key: 'name', sortable: true },
  { key: 'score', sortable: true },
  { key: 'city' },
];

const data = [
  { id: '1', name: '小狸', city: '京都', score: 92 },
  { id: '2', name: '星屑', city: '东京', score: 88 },
  { id: '3', name: '月光', city: '大阪', score: 95 },
  { id: '4', name: '樱花', city: '京都', score: 81 },
  { id: '5', name: '空值', city: '奈良', score: null as unknown as number },
];

describe('deriveTableRows', () => {
  it('C43-EDGE-02 稳定排序保留相对顺序', () => {
    const tied = [
      { id: 'a', name: '同名', score: 1 },
      { id: 'b', name: '同名', score: 1 },
      { id: 'c', name: '同名', score: 1 },
    ];
    const result = deriveTableRows({
      data: tied,
      columns: [{ key: 'name', sortable: true }],
      sort: { key: 'name', order: 'asc' },
    });
    expect(result.rows.map((row) => row.id)).toEqual(['a', 'b', 'c']);
  });

  it('C43-EDGE-09 本地过滤后再分页', () => {
    const result = deriveTableRows({
      data,
      columns,
      filters: { city: '京都' },
      pagination: { page: 1, pageSize: 1 },
    });
    expect(result.filteredTotal).toBe(2);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.name).toBe('小狸');
  });

  it('C43-EDGE-04 manualSorting 不二次排序', () => {
    const result = deriveTableRows({
      data,
      columns,
      sort: { key: 'score', order: 'asc' },
      manualSorting: true,
    });
    expect(result.rows.map((row) => row.id)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('C43-EDGE-10 三 manual 保持传入顺序与服务端 total', () => {
    const result = deriveTableRows({
      data: data.slice(0, 2),
      columns,
      sort: { key: 'score', order: 'desc' },
      filters: { city: '京都' },
      pagination: { page: 2, pageSize: 2, total: 40 },
      manualSorting: true,
      manualFiltering: true,
      manualPagination: true,
    });
    expect(result.rows).toHaveLength(2);
    expect(result.filteredTotal).toBe(40);
    expect(result.pageOutOfRange).toBe(false);
  });

  it('C43-EDGE-11 越界页不改数据源并标记空页', () => {
    const result = deriveTableRows({
      data,
      columns,
      pagination: { page: 9, pageSize: 2 },
    });
    expect(result.rows).toEqual([]);
    expect(result.filteredTotal).toBe(5);
    expect(result.pageOutOfRange).toBe(true);
  });

  it('null 排序固定落到最后', () => {
    const result = deriveTableRows({
      data,
      columns,
      sort: { key: 'score', order: 'asc' },
    });
    expect(result.rows.at(-1)?.id).toBe('5');
  });
});

describe('nextTableSort', () => {
  it('同一列按 asc → desc → null 循环', () => {
    expect(nextTableSort(null, 'name')).toEqual({ key: 'name', order: 'asc' });
    expect(nextTableSort({ key: 'name', order: 'asc' }, 'name')).toEqual({ key: 'name', order: 'desc' });
    expect(nextTableSort({ key: 'name', order: 'desc' }, 'name')).toBeNull();
  });
});
