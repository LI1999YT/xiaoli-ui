import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Segmented = defineComponent({
  name: 'DuiSegmented',
  props: { options: { type: Array as PropType<Array<{ value: string; label: string; disabled?: boolean }>>, default: () => [] }, modelValue: { type: String, default: undefined }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.options[0]?.value);
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      return h('div', { 'data-dui': 'segmented', role: 'radiogroup' }, props.options.map((item) => h('button', { type: 'button', role: 'radio', 'aria-checked': item.value === current, 'data-active': presence(item.value === current), disabled: props.disabled || item.disabled, onClick: () => { if (!isControlled(props.modelValue)) uncontrolled.value = item.value; emit('update:modelValue', item.value); } }, item.label)));
    };
  },
});
