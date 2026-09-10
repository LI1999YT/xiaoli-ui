import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Menu = defineComponent({
  name: 'DuiMenu',
  props: { items: { type: Array as PropType<Array<{ value: string; label: string; disabled?: boolean }>>, default: () => [] }, modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: undefined } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      return h('ul', { 'data-dui': 'menu', role: 'menu' }, props.items.map((item) => h('li', { role: 'menuitem', 'data-active': presence(item.value === current), onClick: () => { if (item.disabled) return; if (!isControlled(props.modelValue)) uncontrolled.value = item.value; emit('update:modelValue', item.value); } }, item.label)));
    };
  },
});
