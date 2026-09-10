import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
export const BottomSheet = defineComponent({
  name: 'DuiBottomSheet',
  props: { open: { type: Boolean, default: undefined }, defaultOpen: { type: Boolean, default: false }, title: { type: String, default: undefined } },
  emits: { 'update:open': (_v: boolean) => true },
  setup(props, { emit, slots }) {
    const uncontrolled = ref(props.defaultOpen);
    return () => {
      const visible = isControlled(props.open) ? Boolean(props.open) : uncontrolled.value;
      const set = (next: boolean) => { if (!isControlled(props.open)) uncontrolled.value = next; emit('update:open', next); };
      if (!visible) return null;
      return h('div', { 'data-dui': 'bottom-sheet' }, [
        h('div', { 'data-part': 'backdrop', onClick: () => set(false) }),
        h('div', { role: 'dialog', 'data-part': 'content' }, [props.title ? h('h3', { 'data-part': 'title' }, props.title) : null, slots.default?.()]),
      ]);
    };
  },
});
