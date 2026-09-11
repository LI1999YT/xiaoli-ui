import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Slider = defineComponent({
  name: 'DuiSlider',
  props: { modelValue: { type: Number, default: undefined }, defaultValue: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, step: { type: Number, default: 1 }, disabled: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as number) : uncontrolled.value;
      const pct = ((current - props.min) / (props.max - props.min || 1)) * 100;
      return h('div', { 'data-dui': 'slider', 'data-disabled': presence(props.disabled) }, [
        h('input', { type: 'range', min: props.min, max: props.max, step: props.step, value: current, disabled: props.disabled, onInput: (e: Event) => { const v = Number((e.target as HTMLInputElement).value); if (!isControlled(props.modelValue)) uncontrolled.value = v; emit('update:modelValue', v); } }),
        h('span', { 'data-part': 'track' }, [h('span', { 'data-part': 'fill', style: { width: `${pct}%` } }), h('span', { 'data-part': 'thumb', style: { insetInlineStart: `${pct}%` } })]),
        h('span', { 'data-part': 'value' }, current),
      ]);
    };
  },
});
