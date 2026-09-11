import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const ActionSheet = defineComponent({
  name: 'DuiActionSheet',
  props: { open: { type: Boolean, default: undefined }, defaultOpen: { type: Boolean, default: false }, title: { type: String, default: undefined }, actions: { type: Array as PropType<Array<{ value: string; label: string; danger?: boolean }>>, default: () => [] } },
  emits: { 'update:open': (_v: boolean) => true, select: (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultOpen);
    return () => {
      const visible = isControlled(props.open) ? Boolean(props.open) : uncontrolled.value;
      const set = (next: boolean) => { if (!isControlled(props.open)) uncontrolled.value = next; emit('update:open', next); };
      if (!visible) return null;
      return h('div', { 'data-dui': 'action-sheet' }, [
        h('div', { 'data-part': 'backdrop', onClick: () => set(false) }),
        h('div', { role: 'dialog', 'data-part': 'content' }, [
          props.title ? h('div', { 'data-part': 'title' }, props.title) : null,
          ...props.actions.map((action) => h('button', { type: 'button', 'data-danger': presence(action.danger), onClick: () => { emit('select', action.value); set(false); } }, action.label)),
          h('button', { type: 'button', 'data-part': 'cancel', onClick: () => set(false) }, '取消'),
        ]),
      ]);
    };
  },
});
