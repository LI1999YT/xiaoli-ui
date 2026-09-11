import { defineComponent, h, type PropType } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Empty = defineComponent({
  name: 'DuiEmpty',
  props: {
    title: { type: String, default: '暂无数据' },
    description: { type: String, default: undefined },
    size: { type: String as PropType<'compact' | 'normal'>, default: 'normal' },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots }) {
    const config = useConfigOptional();
    return () =>
      h('div', { 'data-dui': 'empty', 'data-part': 'root', 'data-size': props.size, 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
        h('div', { 'data-part': 'illustration', 'aria-hidden': 'true' }, '✿'),
        h('div', { 'data-part': 'title' }, props.title),
        props.description ? h('div', { 'data-part': 'description' }, props.description) : null,
        slots.default ? h('div', { 'data-part': 'action' }, slots.default()) : null,
      ]);
  },
});
