import { defineComponent, h, type PropType } from 'vue';
export const Steps = defineComponent({
  name: 'DuiSteps',
  props: { items: { type: Array as PropType<Array<{ title: string; description?: string }>>, default: () => [] }, current: { type: Number, default: 0 } },
  setup(props) {
    return () => h('ol', { 'data-dui': 'steps' }, props.items.map((item, index) => h('li', { 'data-status': index < props.current ? 'done' : index === props.current ? 'process' : 'wait' }, [
      h('span', { 'data-part': 'index' }, index + 1),
      h('span', { 'data-part': 'title' }, item.title),
      item.description ? h('span', { 'data-part': 'description' }, item.description) : null,
    ])));
  },
});
