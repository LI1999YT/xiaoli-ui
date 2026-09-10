import { defineComponent, h } from 'vue';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Icon = defineComponent({
  name: 'DuiIcon',
  props: {
    size: { type: [Number, String], default: 20 },
    viewBox: { type: String, default: '0 0 24 24' },
    decorative: { type: Boolean, default: true },
    label: { type: String, default: undefined },
    mirrorInRtl: { type: Boolean, default: false },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () => {
      const size = typeof props.size === 'number' ? `${props.size}px` : props.size;
      return h(
        'span',
        {
          ...attrs,
          'data-dui': 'icon',
          'data-part': 'root',
          'data-mirror': presence(props.mirrorInRtl),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
          style: { ...(attrs.style as object), '--dui-icon-size': size },
        },
        h(
          'svg',
          {
            viewBox: props.viewBox,
            focusable: 'false',
            'aria-hidden': props.decorative ? 'true' : undefined,
            role: props.decorative ? undefined : 'img',
            'aria-label': props.decorative ? undefined : props.label,
          },
          slots.default?.(),
        ),
      );
    };
  },
});
