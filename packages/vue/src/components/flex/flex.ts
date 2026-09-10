import { defineComponent, h, type PropType } from 'vue';
import { isResponsiveObject, resolveSpace, type Responsive } from '@xiaoli-ui/internal-core';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Flex = defineComponent({
  name: 'DuiFlex',
  inheritAttrs: false,
  props: {
    direction: { type: [String, Object] as PropType<Responsive<'row' | 'column'>>, default: 'row' },
    align: { type: String as PropType<'start' | 'center' | 'end' | 'stretch' | 'baseline'>, default: 'stretch' },
    justify: { type: String as PropType<'start' | 'center' | 'end' | 'between' | 'around'>, default: 'start' },
    gap: { type: [Number, String, Object] as PropType<number | string | Responsive<number | string>>, default: 0 },
    wrap: { type: Boolean, default: false },
    as: { type: String as PropType<'div' | 'section' | 'nav' | 'main'>, default: 'div' },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () => {
      const directionAttrs: Record<string, string> = {};
      if (isResponsiveObject(props.direction)) {
        for (const [bp, value] of Object.entries(props.direction)) {
          if (value) directionAttrs[`data-direction-${bp}`] = value;
        }
      } else {
        directionAttrs['data-direction-base'] = props.direction;
      }
      const gap = isResponsiveObject(props.gap) ? resolveSpace(props.gap.base ?? 0) : resolveSpace(props.gap);
      return h(
        props.as,
        {
          ...attrs,
          ...directionAttrs,
          'data-dui': 'flex',
          'data-part': 'root',
          'data-align': props.align,
          'data-justify': props.justify,
          'data-wrap': presence(props.wrap),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
          style: { ...(attrs.style as object), '--dui-flex-gap': gap },
        },
        slots.default?.(),
      );
    };
  },
});
