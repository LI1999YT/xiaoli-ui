import { defineComponent, h, type PropType } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';
export const Progress = defineComponent({
  name: 'DuiProgress',
  props: {
    value: { type: Number, default: null },
    max: { type: Number, default: 100 },
    variant: { type: String as PropType<'line' | 'circle'>, default: 'line' },
    status: { type: String as PropType<'normal' | 'success' | 'error'>, default: 'normal' },
    showLabel: { type: Boolean, default: true },
    label: { type: String, default: '进度' },
  },
  setup(props) {
    const config = useConfigOptional();
    return () => {
      const ratio = props.value == null ? null : Math.min(100, Math.max(0, (props.value / props.max) * 100));
      return h('div', { 'data-dui': 'progress', 'data-part': 'root', 'data-variant': props.variant, 'data-status': props.status, 'data-indeterminate': presence(ratio == null), 'data-unstyled': presence(config?.unstyled ?? false), role: 'progressbar', 'aria-label': props.label, 'aria-valuenow': props.value ?? undefined }, [
        h('div', { 'data-part': 'track' }, [h('span', { 'data-part': 'bar', style: ratio == null ? undefined : { width: `${ratio}%` } })]),
        props.showLabel ? h('span', { 'data-part': 'label' }, ratio == null ? '加载中' : `${Math.round(ratio)}%`) : null,
      ]);
    };
  },
});
