import { defineComponent, h, onUnmounted, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Tooltip = defineComponent({
  name: 'DuiTooltip',
  props: {
    content: { type: String, required: true },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    placement: { type: String, default: 'top' },
    openDelay: { type: Number, default: 500 },
    closeDelay: { type: Number, default: 100 },
    disabled: { type: Boolean, default: false },
    unstyled: { type: Boolean, default: undefined },
  },
  setup(props, { slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultOpen);
    let timer: number | undefined;
    const visible = () => (isControlled(props.open) ? Boolean(props.open) : uncontrolled.value);
    const setOpen = (next: boolean, delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!isControlled(props.open)) uncontrolled.value = next;
      }, delay);
    };
    onUnmounted(() => window.clearTimeout(timer));
    return () =>
      h(
        'span',
        {
          'data-dui': 'tooltip',
          'data-part': 'root',
          'data-placement': props.placement,
          'data-open': presence(visible() && !props.disabled),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          onMouseenter: () => !props.disabled && setOpen(true, props.openDelay),
          onMouseleave: () => setOpen(false, props.closeDelay),
          onFocus: () => !props.disabled && setOpen(true, 0),
          onBlur: () => setOpen(false, props.closeDelay),
        },
        [
          h('span', { 'data-part': 'trigger' }, slots.default?.()),
          visible() && !props.disabled ? h('span', { role: 'tooltip', 'data-part': 'content' }, props.content) : null,
        ],
      );
  },
});
