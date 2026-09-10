import { Comment, Fragment, defineComponent, h, type PropType, type VNode } from 'vue';
import { resolveSpace } from '@xiaoli-ui/internal-core';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

function flatten(nodes: VNode[] | undefined): VNode[] {
  const result: VNode[] = [];
  for (const node of nodes ?? []) {
    if (node.type === Comment || node.children == null && !node.shapeFlag) continue;
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flatten(node.children as VNode[]));
    } else {
      result.push(node);
    }
  }
  return result;
}

export const Space = defineComponent({
  name: 'DuiSpace',
  inheritAttrs: false,
  props: {
    direction: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    size: { type: [Number, String], default: 2 },
    wrap: { type: Boolean, default: false },
    align: { type: String as PropType<'start' | 'center' | 'end' | 'baseline' | 'stretch'>, default: 'center' },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const config = useConfigOptional();
    return () => {
      const items = flatten(slots.default?.());
      const split = slots.split?.();
      return h(
        'div',
        {
          ...attrs,
          'data-dui': 'space',
          'data-part': 'root',
          'data-direction': props.direction,
          'data-wrap': presence(props.wrap),
          'data-align': props.align,
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
          style: {
            ...(typeof attrs.style === 'object' && attrs.style ? attrs.style : {}),
            '--dui-space-gap': resolveSpace(props.size),
          },
        },
        items.flatMap((child, index) => {
          const nodes = [h('div', { 'data-part': 'item' }, [child])];
          if (index > 0 && split) nodes.unshift(h('span', { 'data-part': 'split' }, split));
          return nodes;
        }),
      );
    };
  },
});
