import { defineComponent, h, type PropType } from 'vue';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Typography = defineComponent({
  name: 'DuiTypography',
  inheritAttrs: false,
  props: {
    as: { type: String as PropType<'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'a' | 'strong' | 'code'>, default: undefined },
    variant: { type: String as PropType<'body' | 'heading' | 'caption' | 'code'>, default: 'body' },
    size: { type: String, default: undefined },
    tone: { type: String as PropType<'default' | 'muted' | 'danger' | 'success'>, default: 'default' },
    truncate: { type: Boolean, default: false },
    lineClamp: { type: Number, default: undefined },
    href: { type: String, default: undefined },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () => {
      const tag = props.as ?? (props.href ? 'a' : props.variant === 'heading' ? 'h3' : props.variant === 'code' ? 'code' : 'span');
      return h(
        tag,
        {
          ...attrs,
          href: tag === 'a' ? props.href : undefined,
          'data-dui': 'typography',
          'data-part': 'root',
          'data-variant': props.variant,
          'data-tone': props.tone,
          'data-truncate': presence(props.truncate),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
          style: {
            ...(typeof attrs.style === 'object' && attrs.style ? attrs.style : {}),
            ...(props.size ? { fontSize: props.size } : {}),
            ...(props.lineClamp
              ? { WebkitLineClamp: props.lineClamp, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }
              : {}),
          },
        },
        slots.default?.(),
      );
    };
  },
});
