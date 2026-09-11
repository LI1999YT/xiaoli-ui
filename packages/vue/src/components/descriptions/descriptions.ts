import { defineComponent, h, type PropType } from 'vue';
export const Descriptions = defineComponent({
  name: 'DuiDescriptions',
  props: { title: { type: String, default: undefined }, items: { type: Array as PropType<Array<{ label: string; value: string }>>, default: () => [] }, columns: { type: Number, default: 2 } },
  setup(props) {
    return () => h('div', { 'data-dui': 'descriptions' }, [
      props.title ? h('h3', { 'data-part': 'title' }, props.title) : null,
      h('dl', { style: { '--dui-descriptions-columns': String(props.columns) } }, props.items.map((item) => h('div', { 'data-part': 'item' }, [h('dt', item.label), h('dd', item.value)]))),
    ]);
  },
});
