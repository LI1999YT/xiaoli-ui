export type TableSortOrder = 'asc' | 'desc';

export interface TableSort {
  key: string;
  order: TableSortOrder;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total?: number;
}

export interface DeriveTableColumn<T> {
  key: string;
  dataIndex?: keyof T & string;
  sortable?: boolean;
  compare?: (a: T, b: T) => number;
}

export interface DeriveTableRowsInput<T> {
  data: readonly T[];
  columns: DeriveTableColumn<T>[];
  sort?: TableSort | null;
  filters?: Record<string, unknown>;
  pagination?: TablePagination | false;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
}

export interface DeriveTableRowsResult<T> {
  rows: T[];
  filteredTotal: number;
  pageOutOfRange: boolean;
}

export function getTableCell<T>(row: T, column: DeriveTableColumn<T>): unknown {
  if (column.dataIndex) return row[column.dataIndex];
  return (row as Record<string, unknown>)[column.key];
}

function defaultCompare(left: unknown, right: unknown): number {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), 'zh-CN');
}

export function rowMatchesFilters<T>(
  row: T,
  columns: DeriveTableColumn<T>[],
  filters: Record<string, unknown>,
): boolean {
  for (const [key, expected] of Object.entries(filters)) {
    if (expected == null || expected === '') continue;
    const column = columns.find((item) => item.key === key);
    const value = column ? getTableCell(row, column) : (row as Record<string, unknown>)[key];
    if (typeof expected === 'string') {
      if (!String(value ?? '').toLowerCase().includes(expected.toLowerCase())) return false;
    } else if (Array.isArray(expected)) {
      if (!expected.includes(value)) return false;
    } else if (value !== expected) {
      return false;
    }
  }
  return true;
}

export function nextTableSort(current: TableSort | null, key: string): TableSort | null {
  if (!current || current.key !== key) return { key, order: 'asc' };
  if (current.order === 'asc') return { key, order: 'desc' };
  return null;
}

export function deriveTableRows<T>(input: DeriveTableRowsInput<T>): DeriveTableRowsResult<T> {
  const {
    data,
    columns,
    sort = null,
    filters = {},
    pagination = false,
    manualSorting = false,
    manualFiltering = false,
    manualPagination = false,
  } = input;

  let rows = data.slice();

  if (!manualFiltering) {
    rows = rows.filter((row) => rowMatchesFilters(row, columns, filters));
  }

  const filteredTotal =
    manualPagination && pagination && typeof pagination.total === 'number' ? pagination.total : rows.length;

  if (!manualSorting && sort) {
    const column = columns.find((item) => item.key === sort.key);
    const indexed = rows.map((row, index) => ({ row, index }));
    indexed.sort((left, right) => {
      const raw = column?.compare
        ? column.compare(left.row, right.row)
        : defaultCompare(
            column ? getTableCell(left.row, column) : (left.row as Record<string, unknown>)[sort.key],
            column ? getTableCell(right.row, column) : (right.row as Record<string, unknown>)[sort.key],
          );
      const directed = sort.order === 'desc' ? -raw : raw;
      return directed !== 0 ? directed : left.index - right.index;
    });
    rows = indexed.map((item) => item.row);
  }

  let pageOutOfRange = false;
  if (!manualPagination && pagination) {
    const start = Math.max(0, (pagination.page - 1) * pagination.pageSize);
    pageOutOfRange = pagination.page > 1 && start >= rows.length && filteredTotal > 0;
    rows = rows.slice(start, start + pagination.pageSize);
  }

  return { rows, filteredTotal, pageOutOfRange };
}
