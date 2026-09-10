import { defineComponent, h, type PropType } from 'vue';
import { resolveSpace } from '@xiaoli-ui/internal-core';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Card = defineComponent({
  name: 'DuiCard',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'elevated' | 'outlined' | 'plain'>, default: 'outlined' },
    padding: { type: [Number, String], default: 4 },
    hoverable: { type: Boolean, default: false },
    as: { type: String as PropType<'div' | 'section' | 'article'>, default: 'div' },
    title: { type: String, default: undefined },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () =>
      h(
        props.as,
        {
          ...attrs,
          'data-dui': 'card',
          'data-part': 'root',
          'data-variant': props.variant,
          'data-hoverable': presence(props.hoverable),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
          style: { ...(attrs.style as object), '--dui-card-padding': resolveSpace(props.padding) },
        },
        [
          slots.cover ? h('div', { 'data-part': 'cover' }, slots.cover()) : null,
          props.title || slots.extra || slots.header
            ? h('div', { 'data-part': 'header' }, [
                props.title ? h('h3', { 'data-part': 'title' }, props.title) : slots.header?.(),
                slots.extra ? h('div', { 'data-part': 'extra' }, slots.extra()) : null,
              ])
            : null,
          h('div', { 'data-part': 'body' }, slots.default?.()),
          slots.footer ? h('div', { 'data-part': 'footer' }, slots.footer()) : null,
        ],
      );
  },
});
