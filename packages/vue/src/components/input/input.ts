import { defineComponent, h, ref, watch, type PropType } from 'vue';
import type { ChangeDetails, Size } from '@xiaoli-ui/tokens';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Input = defineComponent({
  name: 'DuiInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: '' },
    type: { type: String as PropType<'text' | 'password' | 'email' | 'url' | 'tel' | 'search'>, default: 'text' },
    size: { type: String as PropType<Size>, default: undefined },
    clearable: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    unstyled: { type: Boolean, default: undefined },
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
  },
  emits: {
    'update:modelValue': (_next: string, _details: ChangeDetails) => true,
    clear: () => true,
    focus: (_event: FocusEvent) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { emit, slots, attrs, expose }) {
    const config = useConfigOptional();
    const inner = ref<HTMLInputElement | null>(null);
    const uncontrolled = ref(props.defaultValue);
    const composing = ref(false);
    expose({
      element: inner,
      focus: () => inner.value?.focus(),
      blur: () => inner.value?.blur(),
      select: () => inner.value?.select(),
    });

    const current = () => (isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value);

    const emitValue = (next: string, details: ChangeDetails) => {
      if (!isControlled(props.modelValue)) uncontrolled.value = next;
      emit('update:modelValue', next, details);
    };

    watch(
      () => props.modelValue,
      (value) => {
        if (isControlled(value) && inner.value && inner.value.value !== value) {
          inner.value.value = value as string;
        }
      },
    );

    return () => {
      const value = current();
      return h('div', {
        'data-dui': 'input',
        'data-part': 'root',
        'data-size': props.size ?? config?.size ?? 'md',
        'data-invalid': presence(props.invalid),
        'data-disabled': presence(props.disabled),
        'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
        class: cx(attrs.class as string | undefined),
        style: attrs.style as object,
      }, [
        slots.prefix ? h('span', { 'data-part': 'prefix' }, slots.prefix()) : null,
        h('input', {
          ...Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
          ref: inner,
          id: props.id,
          name: props.name,
          type: props.type,
          value,
          disabled: props.disabled,
          readOnly: props.readOnly,
          'aria-invalid': props.invalid || undefined,
          'data-part': 'input',
          onCompositionstart: () => {
            composing.value = true;
          },
          onCompositionend: (event: CompositionEvent) => {
            composing.value = false;
            emitValue((event.target as HTMLInputElement).value, { reason: 'input', originalEvent: event });
          },
          onInput: (event: Event) => {
            const next = (event.target as HTMLInputElement).value;
            if (composing.value) {
              if (!isControlled(props.modelValue)) uncontrolled.value = next;
              return;
            }
            emitValue(next, { reason: 'input', originalEvent: event });
          },
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event),
        }),
        props.clearable && value && !props.disabled && !props.readOnly
          ? h('button', {
              type: 'button',
              'aria-label': '清空',
              'data-part': 'clearButton',
              onClick: (event: MouseEvent) => {
                emitValue('', { reason: 'clear', originalEvent: event });
                emit('clear');
                inner.value?.focus();
              },
            }, '×')
          : null,
        slots.suffix ? h('span', { 'data-part': 'suffix' }, slots.suffix()) : null,
      ]);
    };
  },
});
