import { defineComponent, h, type PropType } from 'vue';
import { presence } from '../../utils';

export const SafeArea = defineComponent({
  name: 'DuiSafeArea',
  props: {
    edges: { type: Array as PropType<Array<'top' | 'bottom' | 'start' | 'end'>>, default: () => ['bottom'] },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-dui': 'safe-area',
          'data-edges': props.edges.join(' '),
          'data-edge-top': presence(props.edges.includes('top')),
          'data-edge-bottom': presence(props.edges.includes('bottom')),
          'data-edge-start': presence(props.edges.includes('start')),
          'data-edge-end': presence(props.edges.includes('end')),
        },
        slots.default?.(),
      );
  },
});
