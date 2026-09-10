import { defineComponent, h, type PropType } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Badge = defineComponent({
  name: 'DuiBadge',
  props: {
    count: { type: [Number, String] as PropType<number | string>, default: undefined },
    max: { type: Number, default: 99 },
    showZero: { type: Boolean, default: false },
    dot: { type: Boolean, default: false },
    status: { type: String as PropType<'neutral' | 'info' | 'success' | 'warning' | 'danger'>, default: 'danger' },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots }) {
    const config = useConfigOptional();
    return () => {
      const numeric = typeof props.count === 'number';
      const hidden = !props.dot && (props.count === undefined || (props.count === 0 && !props.showZero) || props.count === '');
      const text = numeric && (props.count as number) > props.max ? `${props.max}+` : props.count;
      return h('span', { 'data-dui': 'badge', 'data-part': 'root', 'data-status': props.status, 'data-dot': presence(props.dot), 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
        slots.default?.(),
        hidden ? null : h('span', { 'data-part': 'indicator' }, props.dot ? undefined : text == null ? undefined : String(text)),
      ]);
    };
  },
});
