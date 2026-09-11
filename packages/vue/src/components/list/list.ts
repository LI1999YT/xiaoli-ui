import { defineComponent, h, type PropType } from 'vue';
export const List = defineComponent({
  name: 'DuiList',
  props: { items: { type: Array as PropType<Array<{ key: string; title: string; description?: string }>>, default: () => [] } },
  setup(props) {
    return () => h('ul', { 'data-dui': 'list' }, props.items.map((item) => h('li', { 'data-part': 'item' }, [h('div', { 'data-part': 'title' }, item.title), item.description ? h('div', { 'data-part': 'description' }, item.description) : null])));
  },
});
