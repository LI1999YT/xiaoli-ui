import { defineComponent, h, inject, provide, ref, watchEffect, type InjectionKey, type PropType } from 'vue';
import type { ChangeDetails, ValueKey } from '@xiaoli-ui/tokens';
import { getNextChecked, isControlled } from '@xiaoli-ui/internal-core';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

interface GroupCtx {
  values: ValueKey[];
  disabled?: boolean;
  name?: string;
  onToggle: (value: ValueKey, next: boolean) => void;
}

const groupKey: InjectionKey<GroupCtx> = Symbol('dui-checkbox-group');

export const Checkbox = defineComponent({
  name: 'DuiCheckbox',
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    value: { type: [String, Number] as PropType<ValueKey>, default: undefined },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    unstyled: { type: Boolean, default: undefined },
    id: { type: String, default: undefined },
  },
  emits: {
    'update:modelValue': (_next: boolean, _details: ChangeDetails) => true,
  },
  setup(props, { emit, slots, attrs, expose }) {
    const config = useConfigOptional();
    const group = inject(groupKey, null);
    const inner = ref<HTMLInputElement | null>(null);
    const uncontrolled = ref(props.defaultChecked);
    watchEffect(() => {
      if (inner.value) inner.value.indeterminate = props.indeterminate;
    });
    expose({
      element: inner,
      focus: () => inner.value?.focus(),
      blur: () => inner.value?.blur(),
    });

    return () => {
      const groupChecked = group && props.value !== undefined ? group.values.includes(props.value) : undefined;
      const current = groupChecked ?? (isControlled(props.modelValue) ? Boolean(props.modelValue) : uncontrolled.value);
      const disabled = props.disabled || group?.disabled;
      return h('label', {
        'data-dui': 'checkbox',
        'data-part': 'root',
        'data-state': props.indeterminate ? 'indeterminate' : current ? 'checked' : 'unchecked',
        'data-disabled': presence(disabled),
        'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
        class: cx(attrs.class as string | undefined),
      }, [
        h('input', {
          ref: inner,
          id: props.id,
          name: props.name ?? group?.name,
          type: 'checkbox',
          checked: current,
          disabled,
          required: props.required,
          value: props.value === undefined ? undefined : String(props.value),
          'aria-checked': props.indeterminate ? 'mixed' : current,
          'data-part': 'input',
          class: 'dui-visually-hidden',
          onChange: (event: Event) => {
            const next = getNextChecked(current, props.indeterminate);
            if (!isControlled(props.modelValue) && !group) uncontrolled.value = next;
            if (group && props.value !== undefined) group.onToggle(props.value, next);
            emit('update:modelValue', next, { reason: 'select', originalEvent: event });
          },
        }),
        h('span', { 'data-part': 'control', 'aria-hidden': 'true' }, [
          h('span', { 'data-part': 'indicator' }, [
            props.indeterminate ? h('span', { 'data-part': 'dash' }) : current ? h('span', { 'data-part': 'check' }) : null,
          ]),
        ]),
        slots.default ? h('span', { 'data-part': 'label' }, slots.default()) : null,
      ]);
    };
  },
});

export const CheckboxGroup = defineComponent({
  name: 'DuiCheckboxGroup',
  props: {
    modelValue: { type: Array as PropType<ValueKey[]>, default: undefined },
    defaultValue: { type: Array as PropType<ValueKey[]>, default: () => [] },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: {
    'update:modelValue': (_next: ValueKey[], _details: ChangeDetails) => true,
  },
  setup(props, { emit, slots, attrs }) {
    const config = useConfigOptional();
    const uncontrolled = ref<ValueKey[]>([...(props.defaultValue ?? [])]);
    const current = () => (isControlled(props.modelValue) ? (props.modelValue as ValueKey[]) : uncontrolled.value);

    provide(groupKey, {
      get values() {
        return current();
      },
      get disabled() {
        return props.disabled;
      },
      get name() {
        return props.name;
      },
      onToggle(item, next) {
        const set = new Set(current());
        if (next) set.add(item);
        else set.delete(item);
        const nextValues = [...set];
        if (!isControlled(props.modelValue)) uncontrolled.value = nextValues;
        emit('update:modelValue', nextValues, { reason: 'select' });
      },
    });

    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'group',
          'data-dui': 'checkbox-group',
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
        },
        slots.default?.(),
      );
  },
});
