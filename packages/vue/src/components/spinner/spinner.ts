import { defineComponent, h, type PropType } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Spinner = defineComponent({
  name: 'DuiSpinner',
  props: {
    size: { type: String as PropType<'sm' | 'md' | 'lg' | string>, default: 'md' },
    label: { type: String, default: '加载中' },
    inline: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props) {
    const config = useConfigOptional();
    return () => {
      if (!props.visible) return null;
      const custom = !['sm', 'md', 'lg'].includes(props.size) ? props.size : undefined;
      return h(
        'span',
        {
          role: 'status',
          'data-dui': 'spinner',
          'data-part': 'root',
          'data-size': ['sm', 'md', 'lg'].includes(props.size) ? props.size : 'md',
          'data-inline': presence(props.inline),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          style: custom ? { width: custom, height: custom } : undefined,
        },
        [h('span', { class: 'dui-visually-hidden' }, props.label)],
      );
    };
  },
});
