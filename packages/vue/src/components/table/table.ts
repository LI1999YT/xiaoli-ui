import { defineComponent, h, type PropType } from 'vue';
export const Table = defineComponent({
  name: 'DuiTable',
  props: {
    data: { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
    columns: { type: Array as PropType<Array<{ key: string; title: string }>>, default: () => [] },
    rowKey: { type: String, default: 'id' },
    caption: { type: String, default: undefined },
  },
  setup(props) {
    return () => h('div', { 'data-dui': 'table' }, [
      h('table', [
        props.caption ? h('caption', props.caption) : null,
        h('thead', [h('tr', props.columns.map((col) => h('th', col.title)))]),
        h('tbody', props.data.length === 0
          ? [h('tr', [h('td', { colspan: Math.max(props.columns.length, 1) }, '暂无数据')])]
          : props.data.map((row, index) => h('tr', { key: String(row[props.rowKey] ?? index) }, props.columns.map((col) => h('td', String(row[col.key] ?? '')))))),
      ]),
    ]);
  },
});
