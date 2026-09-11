import { computed, defineComponent, h, ref, type PropType } from 'vue';
import {
  deriveTableRows,
  isControlled,
  nextTableSort,
  type TablePagination,
  type TableSort,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';

export interface TableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  filterable?: boolean;
}

export { deriveTableRows, nextTableSort };
export type { TablePagination, TableSort };

export const Table = defineComponent({
  name: 'DuiTable',
  props: {
    data: { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
    columns: { type: Array as PropType<TableColumn[]>, default: () => [] },
    rowKey: { type: [String, Function] as PropType<string | ((row: Record<string, unknown>) => string)>, default: 'id' },
    caption: { type: String, default: undefined },
    loading: { type: Boolean, default: false },
    error: { type: String, default: undefined },
    sort: { type: Object as PropType<TableSort | null>, default: undefined },
    defaultSort: { type: Object as PropType<TableSort | null>, default: null },
    filters: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    defaultFilters: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    selectedKeys: { type: Array as PropType<string[]>, default: undefined },
    defaultSelectedKeys: { type: Array as PropType<string[]>, default: () => [] },
    selectable: { type: Boolean, default: false },
    manualSorting: { type: Boolean, default: false },
    manualFiltering: { type: Boolean, default: false },
    manualPagination: { type: Boolean, default: false },
    stickyHeader: { type: Boolean, default: false },
    pagination: { type: [Object, Boolean] as PropType<TablePagination | false>, default: false },
    preserveSelectedKeys: { type: Boolean, default: false },
  },
  emits: {
    'update:sort': (_next: TableSort | null) => true,
    'update:filters': (_next: Record<string, unknown>) => true,
    'update:selectedKeys': (_next: string[]) => true,
    'row-click': (_row: Record<string, unknown>, _event: MouseEvent) => true,
  },
  setup(props, { emit, slots }) {
    const uncontrolledSort = ref<TableSort | null>(props.defaultSort);
    const uncontrolledFilters = ref({ ...props.defaultFilters });
    const uncontrolledSelected = ref([...props.defaultSelectedKeys]);

    const currentSort = () => (isControlled(props.sort) ? (props.sort ?? null) : uncontrolledSort.value);
    const currentFilters = () => (isControlled(props.filters) ? (props.filters ?? {}) : uncontrolledFilters.value);
    const currentSelected = () => (isControlled(props.selectedKeys) ? (props.selectedKeys ?? []) : uncontrolledSelected.value);

    const keyOf = (row: Record<string, unknown>, index: number) =>
      String(typeof props.rowKey === 'function' ? props.rowKey(row) : (row[props.rowKey] ?? index));

    const derived = computed(() =>
      deriveTableRows({
        data: props.data,
        columns: props.columns,
        sort: currentSort(),
        filters: currentFilters(),
        pagination: props.pagination,
        manualSorting: props.manualSorting,
        manualFiltering: props.manualFiltering,
        manualPagination: props.manualPagination,
      }),
    );

    const setSort = (next: TableSort | null) => {
      if (!isControlled(props.sort)) uncontrolledSort.value = next;
      emit('update:sort', next);
    };
    const setFilters = (next: Record<string, unknown>) => {
      if (!isControlled(props.filters)) uncontrolledFilters.value = next;
      emit('update:filters', next);
    };
    const setSelected = (next: string[]) => {
      if (!isControlled(props.selectedKeys)) uncontrolledSelected.value = next;
      emit('update:selectedKeys', next);
    };

    return () => {
      const rows = derived.value.rows;
      const visibleKeys = rows.map((row, index) => keyOf(row, index));
      const dataKeys = new Set(props.data.map((row, index) => keyOf(row, index)));
      const selected = props.preserveSelectedKeys ? currentSelected() : currentSelected().filter((key) => dataKeys.has(key));
      const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selected.includes(key));
      const colSpan = Math.max(props.columns.length + (props.selectable ? 1 : 0), 1);
      const status =
        props.loading ? '加载中…' : props.error ? props.error : rows.length === 0 ? (derived.value.pageOutOfRange ? '当前页没有数据' : '暂无数据') : null;

      return h('div', { 'data-dui': 'table', 'data-sticky-header': presence(props.stickyHeader), 'data-loading': presence(props.loading), 'data-part': 'root' }, [
        h('div', { 'data-part': 'scroll' }, [
          h('table', { 'data-part': 'table' }, [
            props.caption ? h('caption', props.caption) : null,
            h('thead', { 'data-part': 'head' }, [
              h('tr', [
                props.selectable
                  ? h('th', { 'data-part': 'selection' }, [
                      h('input', {
                        type: 'checkbox',
                        'aria-label': '全选当前页',
                        checked: allVisibleSelected,
                        onChange: () => {
                          setSelected(
                            allVisibleSelected
                              ? selected.filter((key) => !visibleKeys.includes(key))
                              : Array.from(new Set([...selected, ...visibleKeys])),
                          );
                        },
                      }),
                    ])
                  : null,
                ...props.columns.map((column) => {
                  const sorted = currentSort()?.key === column.key ? currentSort()?.order : undefined;
                  return h('th', { key: column.key, style: { width: column.width as string | undefined, textAlign: column.align } }, [
                    column.sortable
                      ? h(
                          'button',
                          {
                            type: 'button',
                            'data-part': 'sortButton',
                            'aria-sort': sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none',
                            onClick: () => setSort(nextTableSort(currentSort(), column.key)),
                          },
                          [column.title, h('span', { 'aria-hidden': 'true' }, sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕')],
                        )
                      : column.title,
                    column.filterable
                      ? h('input', {
                          'data-part': 'filter',
                          'aria-label': `筛选 ${column.title}`,
                          value: String(currentFilters()[column.key] ?? ''),
                          onInput: (event: Event) =>
                            setFilters({ ...currentFilters(), [column.key]: (event.target as HTMLInputElement).value }),
                        })
                      : null,
                  ]);
                }),
              ]),
            ]),
            h(
              'tbody',
              { 'data-part': 'body' },
              status
                ? [h('tr', [h('td', { colspan: colSpan }, [h('div', { 'data-part': 'status', role: props.error ? 'alert' : undefined }, status)])])]
                : rows.map((row, index) => {
                    const key = keyOf(row, index);
                    const isSelected = selected.includes(key);
                    return h(
                      'tr',
                      {
                        key,
                        'data-part': 'row',
                        'data-selected': presence(isSelected),
                        onClick: (event: MouseEvent) => emit('row-click', row, event),
                      },
                      [
                        props.selectable
                          ? h('td', { 'data-part': 'selection', onClick: (event: MouseEvent) => event.stopPropagation() }, [
                              h('input', {
                                type: 'checkbox',
                                'aria-label': `选择 ${key}`,
                                checked: isSelected,
                                onChange: () =>
                                  setSelected(isSelected ? selected.filter((item) => item !== key) : [...selected, key]),
                              }),
                            ])
                          : null,
                        ...props.columns.map((column) =>
                          h(
                            'td',
                            { key: column.key, 'data-part': 'cell', style: { textAlign: column.align, width: column.width as string | undefined } },
                            slots.cell
                              ? slots.cell({ row, column })
                              : String((column.dataIndex ? row[column.dataIndex] : row[column.key]) ?? ''),
                          ),
                        ),
                      ],
                    );
                  }),
            ),
          ]),
        ]),
      ]);
    };
  },
});
