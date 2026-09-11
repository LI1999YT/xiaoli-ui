import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Switch = defineComponent({
  name: 'DuiSwitch',
  props: {
    modelValue: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultChecked);
    return () => {
      const current = isControlled(props.modelValue) ? Boolean(props.modelValue) : uncontrolled.value;
      return h('label', { 'data-dui': 'switch', 'data-state': current ? 'checked' : 'unchecked', 'data-loading': presence(props.loading), 'data-unstyled': presence(config?.unstyled ?? false) }, [
        h('input', {
          type: 'checkbox',
          role: 'switch',
          'data-part': 'input',
          class: 'dui-visually-hidden',
          checked: current,
          disabled: props.disabled || props.loading,
          onChange: () => {
            const next = !current;
            if (!isControlled(props.modelValue)) uncontrolled.value = next;
            emit('update:modelValue', next);
          },
        }),
        h('span', { 'data-part': 'track' }, [h('span', { 'data-part': 'thumb' })]),
        slots.default ? h('span', { 'data-part': 'label' }, slots.default()) : null,
      ]);
    };
  },
});
