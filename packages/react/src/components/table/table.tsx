import { useMemo, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import {
  deriveTableRows,
  isControlled,
  nextTableSort,
  type TablePagination,
  type TableSort,
} from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';

export interface TableColumn<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T & string;
  width?: number | string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  filterable?: boolean;
  compare?: (a: T, b: T) => number;
  render?: (row: T, rowIndex: number) => ReactNode;
}

export interface TableProps<T extends Record<string, unknown>>
  extends StyledParts<'root' | 'scroll' | 'table' | 'head' | 'body' | 'row' | 'cell' | 'sortButton' | 'selection'> {
  data?: readonly T[];
  columns?: TableColumn<T>[];
  rowKey: keyof T | ((row: T) => string);
  caption?: string;
  loading?: boolean;
  error?: string;
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (next: TableSort | null) => void;
  filters?: Record<string, unknown>;
  defaultFilters?: Record<string, unknown>;
  onFiltersChange?: (next: Record<string, unknown>) => void;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectedKeysChange?: (next: string[]) => void;
  selectable?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  stickyHeader?: boolean;
  pagination?: TablePagination | false;
  preserveSelectedKeys?: boolean;
  onRowClick?: (row: T, event: MouseEvent<HTMLTableRowElement>) => void;
}

function keyOf<T extends Record<string, unknown>>(row: T, rowKey: TableProps<T>['rowKey'], index: number): string {
  return String(typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] ?? index));
}

export function Table<T extends Record<string, unknown>>({
  data = [],
  columns = [],
  rowKey,
  caption,
  loading = false,
  error,
  sort,
  defaultSort = null,
  onSortChange,
  filters,
  defaultFilters = {},
  onFiltersChange,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectedKeysChange,
  selectable = false,
  manualSorting = false,
  manualFiltering = false,
  manualPagination = false,
  stickyHeader = false,
  pagination = false,
  preserveSelectedKeys = false,
  onRowClick,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: TableProps<T>) {
  const [uncontrolledSort, setUncontrolledSort] = useState<TableSort | null>(defaultSort);
  const [uncontrolledFilters, setUncontrolledFilters] = useState(defaultFilters);
  const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelectedKeys);

  const currentSort = isControlled(sort) ? (sort ?? null) : uncontrolledSort;
  const currentFilters = isControlled(filters) ? (filters ?? {}) : uncontrolledFilters;
  const currentSelected = isControlled(selectedKeys) ? (selectedKeys ?? []) : uncontrolledSelected;

  const derived = useMemo(
    () =>
      deriveTableRows({
        data,
        columns,
        sort: currentSort,
        filters: currentFilters,
        pagination,
        manualSorting,
        manualFiltering,
        manualPagination,
      }),
    [data, columns, currentSort, currentFilters, pagination, manualSorting, manualFiltering, manualPagination],
  );

  const visibleKeys = derived.rows.map((row, index) => keyOf(row, rowKey, index));
  const dataKeys = new Set(data.map((row, index) => keyOf(row, rowKey, index)));
  const effectiveSelected = preserveSelectedKeys
    ? currentSelected
    : currentSelected.filter((key) => dataKeys.has(key));
  const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((key) => effectiveSelected.includes(key));

  const setSort = (next: TableSort | null) => {
    if (!isControlled(sort)) setUncontrolledSort(next);
    onSortChange?.(next);
  };
  const setFilters = (next: Record<string, unknown>) => {
    if (!isControlled(filters)) setUncontrolledFilters(next);
    onFiltersChange?.(next);
  };
  const setSelected = (next: string[]) => {
    if (!isControlled(selectedKeys)) setUncontrolledSelected(next);
    onSelectedKeysChange?.(next);
  };

  const toggleSort = (key: string) => setSort(nextTableSort(currentSort, key));
  const toggleRow = (key: string) => {
    setSelected(effectiveSelected.includes(key) ? effectiveSelected.filter((item) => item !== key) : [...effectiveSelected, key]);
  };
  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelected(effectiveSelected.filter((key) => !visibleKeys.includes(key)));
      return;
    }
    setSelected(Array.from(new Set([...effectiveSelected, ...visibleKeys])));
  };

  return (
    <div
      data-dui="table"
      data-sticky-header={presence(stickyHeader)}
      data-loading={presence(loading)}
      data-unstyled={presence(unstyled)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root')}
    >
      <div data-part="scroll" className={classNames?.scroll} style={styles?.scroll}>
        <table data-part="table" className={classNames?.table} style={styles?.table}>
          {caption ? <caption>{caption}</caption> : null}
          <thead data-part="head">
            <tr>
              {selectable ? (
                <th data-part="selection">
                  <input
                    type="checkbox"
                    aria-label="全选当前页"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const sorted = currentSort?.key === column.key ? currentSort.order : undefined;
                return (
                  <th key={column.key} style={{ width: column.width, textAlign: column.align }}>
                    {column.sortable ? (
                      <button
                        type="button"
                        data-part="sortButton"
                        className={classNames?.sortButton}
                        aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.title}
                        <span aria-hidden>{sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}</span>
                      </button>
                    ) : (
                      column.title
                    )}
                    {column.filterable ? (
                      <input
                        data-part="filter"
                        aria-label={`筛选 ${String(column.title)}`}
                        value={String(currentFilters[column.key] ?? '')}
                        onChange={(event) => setFilters({ ...currentFilters, [column.key]: event.target.value })}
                      />
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody data-part="body">
            {loading ? (
              <tr>
                <td colSpan={Math.max(columns.length + (selectable ? 1 : 0), 1)}>
                  <div data-part="status">加载中…</div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={Math.max(columns.length + (selectable ? 1 : 0), 1)}>
                  <div data-part="status" role="alert">
                    {error}
                  </div>
                </td>
              </tr>
            ) : derived.rows.length === 0 ? (
              <tr>
                <td colSpan={Math.max(columns.length + (selectable ? 1 : 0), 1)}>
                  <div data-part="status">{derived.pageOutOfRange ? '当前页没有数据' : '暂无数据'}</div>
                </td>
              </tr>
            ) : (
              derived.rows.map((row, index) => {
                const key = keyOf(row, rowKey, index);
                const selected = effectiveSelected.includes(key);
                return (
                  <tr
                    key={key}
                    data-part="row"
                    data-selected={presence(selected)}
                    className={classNames?.row}
                    onClick={(event) => onRowClick?.(row, event)}
                    onKeyDown={(event: KeyboardEvent<HTMLTableRowElement>) => {
                      if (event.key === 'Enter' && onRowClick) onRowClick(row, event as unknown as MouseEvent<HTMLTableRowElement>);
                    }}
                  >
                    {selectable ? (
                      <td data-part="selection" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`选择 ${key}`}
                          checked={selected}
                          onChange={() => toggleRow(key)}
                        />
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        data-part="cell"
                        style={{ textAlign: column.align, width: column.width }}
                        className={classNames?.cell}
                      >
                        {column.render
                          ? column.render(row, index)
                          : String((column.dataIndex ? row[column.dataIndex] : row[column.key]) ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { deriveTableRows, nextTableSort };
export type { TablePagination, TableSort };
