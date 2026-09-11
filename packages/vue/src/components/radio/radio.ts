import { defineComponent, h, inject, provide, ref, type InjectionKey, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

interface GroupCtx {
  value: string | null;
  name: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
}

const groupKey: InjectionKey<GroupCtx> = Symbol('dui-radio-group');

export const RadioGroup = defineComponent({
  name: 'DuiRadioGroup',
  props: {
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: null },
    name: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    options: { type: Array as PropType<Array<{ value: string; label: string; disabled?: boolean }>>, default: () => [] },
  },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit, slots }) {
    const uncontrolled = ref(props.defaultValue);
    provide(groupKey, {
      get value() {
        return isControlled(props.modelValue) ? (props.modelValue ?? null) : uncontrolled.value;
      },
      get name() {
        return props.name ?? 'dui-radio';
      },
      get disabled() {
        return props.disabled;
      },
      onSelect(next) {
        if (!isControlled(props.modelValue)) uncontrolled.value = next;
        emit('update:modelValue', next);
      },
    });
    return () =>
      h('div', { 'data-dui': 'radio', 'data-part': 'group', 'data-orientation': props.orientation, role: 'radiogroup' }, [
        ...props.options.map((item) => h(Radio, { value: item.value, disabled: item.disabled }, () => item.label)),
        slots.default?.(),
      ]);
  },
});

export const Radio = defineComponent({
  name: 'DuiRadio',
  props: {
    value: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const group = inject(groupKey, null);
    const config = useConfigOptional();
    return () => {
      const checked = group?.value === props.value;
      return h('label', { 'data-dui': 'radio', 'data-state': checked ? 'checked' : 'unchecked', 'data-unstyled': presence(config?.unstyled ?? false) }, [
        h('input', {
          type: 'radio',
          name: group?.name,
          value: props.value,
          checked,
          disabled: props.disabled || group?.disabled,
          'data-part': 'input',
          class: 'dui-visually-hidden',
          onChange: () => group?.onSelect(props.value),
        }),
        h('span', { 'data-part': 'control' }),
        slots.default ? h('span', { 'data-part': 'label' }, slots.default()) : null,
      ]);
    };
  },
});
