import { defineComponent, h, type PropType } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Skeleton = defineComponent({
  name: 'DuiSkeleton',
  props: {
    loading: { type: Boolean, default: true },
    rows: { type: Number, default: 3 },
    shape: { type: String as PropType<'text' | 'rect' | 'circle'>, default: 'text' },
    width: { type: String, default: undefined },
    height: { type: String, default: undefined },
    animated: { type: Boolean, default: true },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots }) {
    const config = useConfigOptional();
    return () => {
      if (!props.loading) return slots.default?.();
      return h(
        'div',
        {
          'data-dui': 'skeleton',
          'data-part': 'root',
          'data-shape': props.shape,
          'data-animated': presence(props.animated),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          'aria-hidden': 'true',
          style: { width: props.width, height: props.height },
        },
        props.shape === 'text' ? Array.from({ length: props.rows }, () => h('span', { 'data-part': 'row' })) : [],
      );
    };
  },
});
