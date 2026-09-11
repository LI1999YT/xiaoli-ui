import { defineComponent, h, type PropType } from 'vue';
export const SafeArea = defineComponent({
  name: 'DuiSafeArea',
  props: { edges: { type: Array as PropType<Array<'top' | 'bottom' | 'start' | 'end'>>, default: () => ['bottom'] } },
  setup(props, { slots }) {
    return () => h('div', { 'data-dui': 'safe-area', 'data-edges': props.edges.join(' ') }, slots.default?.());
  },
});
