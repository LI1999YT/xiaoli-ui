import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
export const TimePicker = defineComponent({
  name: 'DuiTimePicker',
  props: { modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value;
      return h('div', { 'data-dui': 'time-picker' }, [h('input', { type: 'time', value: current, onInput: (e: Event) => { const next = (e.target as HTMLInputElement).value; if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); } })]);
    };
  },
});
