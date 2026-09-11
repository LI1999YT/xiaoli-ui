import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Rate = defineComponent({
  name: 'DuiRate',
  props: { modelValue: { type: Number, default: undefined }, defaultValue: { type: Number, default: 0 }, max: { type: Number, default: 5 }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    const hover = ref<number | null>(null);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as number) : uncontrolled.value;
      const shown = hover.value ?? current;
      return h('div', { 'data-dui': 'rate', role: 'radiogroup', 'aria-label': '评分' }, Array.from({ length: props.max }, (_, i) => i + 1).map((n) => h('button', { type: 'button', role: 'radio', 'aria-checked': n === current, 'data-active': presence(n <= shown), disabled: props.disabled, onMouseenter: () => { hover.value = n; }, onMouseleave: () => { hover.value = null; }, onClick: () => { const next = n === current ? 0 : n; if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); } }, '★')));
    };
  },
});
