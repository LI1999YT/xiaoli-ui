import { defineComponent, h } from 'vue';
import { resolveSpace } from '@xiaoli-ui/internal-core';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Grid = defineComponent({
  name: 'DuiGrid',
  inheritAttrs: false,
  props: {
    columns: { type: Number, default: 12 },
    gap: { type: [Number, String], default: 4 },
    align: { type: String, default: 'stretch' },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-dui': 'grid',
          'data-part': 'root',
          'data-align': props.align,
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
          style: {
            ...(typeof attrs.style === 'object' && attrs.style ? attrs.style : {}),
            '--dui-grid-columns': String(props.columns),
            '--dui-grid-gap': resolveSpace(props.gap),
          },
        },
        slots.default?.(),
      );
  },
});

export const GridItem = defineComponent({
  name: 'DuiGridItem',
  inheritAttrs: false,
  props: {
    span: { type: Number, default: undefined },
    offset: { type: Number, default: 0 },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-dui': 'grid-item',
          'data-part': 'root',
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
          style: {
            ...(typeof attrs.style === 'object' && attrs.style ? attrs.style : {}),
            '--dui-grid-span': props.span === undefined ? 'auto' : String(props.span),
            '--dui-grid-offset': String(props.offset),
          },
        },
        slots.default?.(),
      );
  },
});
