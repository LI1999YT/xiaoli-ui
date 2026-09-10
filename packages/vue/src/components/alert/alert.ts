import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Alert = defineComponent({
  name: 'DuiAlert',
  props: {
    status: { type: String as PropType<'info' | 'success' | 'warning' | 'error'>, default: 'info' },
    title: { type: String, default: undefined },
    closable: { type: Boolean, default: false },
    visible: { type: Boolean, default: undefined },
    defaultVisible: { type: Boolean, default: true },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: { 'update:visible': (_next: boolean) => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultVisible);
    return () => {
      const shown = isControlled(props.visible) ? Boolean(props.visible) : uncontrolled.value;
      if (!shown) return null;
      return h('div', { role: 'alert', 'data-dui': 'alert', 'data-part': 'root', 'data-status': props.status, 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
        h('div', [props.title ? h('strong', { 'data-part': 'title' }, props.title) : null, h('div', { 'data-part': 'body' }, slots.default?.())]),
        props.closable
          ? h('button', { type: 'button', 'aria-label': '关闭', 'data-part': 'closeButton', onClick: () => { if (!isControlled(props.visible)) uncontrolled.value = false; emit('update:visible', false); } }, '×')
          : null,
      ]);
    };
  },
});
