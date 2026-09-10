import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const InputNumber = defineComponent({
  name: 'DuiInputNumber',
  props: { modelValue: { type: Number, default: undefined }, defaultValue: { type: Number, default: null }, min: { type: Number, default: undefined }, max: { type: Number, default: undefined }, step: { type: Number, default: 1 }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: number | null) => true },
  setup(props, { emit }) {
    const uncontrolled = ref<number | null>(props.defaultValue);
    const current = () => (isControlled(props.modelValue) ? props.modelValue ?? null : uncontrolled.value);
    const commit = (next: number | null) => { if (next != null) next = Math.min(props.max ?? next, Math.max(props.min ?? next, next)); if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); };
    return () => h('div', { 'data-dui': 'input-number', 'data-disabled': presence(props.disabled) }, [
      h('button', { type: 'button', 'aria-label': '减少', disabled: props.disabled, onClick: () => commit((current() ?? 0) - props.step) }, '−'),
      h('input', { type: 'text', inputmode: 'decimal', value: current() ?? '', disabled: props.disabled, onInput: (e: Event) => commit((e.target as HTMLInputElement).value === '' ? null : Number((e.target as HTMLInputElement).value)) }),
      h('button', { type: 'button', 'aria-label': '增加', disabled: props.disabled, onClick: () => commit((current() ?? 0) + props.step) }, '+'),
    ]);
  },
});
