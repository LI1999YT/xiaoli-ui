import { defineComponent, h, type PropType } from 'vue';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Divider = defineComponent({
  name: 'DuiDivider',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    decorative: { type: Boolean, default: true },
    labelPosition: { type: String as PropType<'start' | 'center' | 'end'>, default: 'center' },
    variant: { type: String as PropType<'solid' | 'dashed'>, default: 'solid' },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: props.decorative ? 'none' : 'separator',
          'aria-orientation': props.decorative ? undefined : props.orientation,
          'data-dui': 'divider',
          'data-part': 'root',
          'data-orientation': props.orientation,
          'data-variant': props.variant,
          'data-label-position': props.labelPosition,
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
        },
        slots.default ? [h('span', { 'data-part': 'label' }, slots.default())] : [],
      );
  },
});
