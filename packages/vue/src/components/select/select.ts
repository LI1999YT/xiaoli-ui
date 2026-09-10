import { defineComponent, h, onUnmounted, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export const Select = defineComponent({
  name: 'DuiSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number] as PropType<string | number | null>, default: undefined },
    defaultValue: { type: [String, Number] as PropType<string | number | null>, default: null },
    options: { type: Array as PropType<SelectOption[]>, default: () => [] },
    placeholder: { type: String, default: '请选择' },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: {
    'update:modelValue': (_next: string | number | null) => true,
    'update:open': (_next: boolean) => true,
  },
  setup(props, { emit, attrs }) {
    const config = useConfigOptional();
    const root = ref<HTMLElement | null>(null);
    const uncontrolled = ref(props.defaultValue);
    const uncontrolledOpen = ref(props.defaultOpen);
    const current = () => (isControlled(props.modelValue) ? (props.modelValue ?? null) : uncontrolled.value);
    const isOpen = () => (isControlled(props.open) ? Boolean(props.open) : uncontrolledOpen.value);
    const setOpen = (next: boolean) => {
      if (!isControlled(props.open)) uncontrolledOpen.value = next;
      emit('update:open', next);
    };
    const setValue = (next: string | number | null) => {
      if (!isControlled(props.modelValue)) uncontrolled.value = next;
      emit('update:modelValue', next);
      setOpen(false);
    };
    const onDoc = (event: PointerEvent) => {
      if (!root.value?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    onUnmounted(() => document.removeEventListener('pointerdown', onDoc));

    return () => {
      const value = current();
      const selected = props.options.find((item) => item.value === value);
      return h(
        'div',
        {
          ...attrs,
          ref: root,
          'data-dui': 'select',
          'data-part': 'root',
          'data-invalid': presence(props.invalid),
          'data-disabled': presence(props.disabled),
          'data-open': presence(isOpen()),
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          class: cx(attrs.class as string | undefined),
        },
        [
          h(
            'button',
            {
              type: 'button',
              'data-part': 'trigger',
              'aria-haspopup': 'listbox',
              'aria-expanded': isOpen(),
              disabled: props.disabled,
              onClick: () => setOpen(!isOpen()),
            },
            [
              h('span', { 'data-part': 'value' }, selected ? selected.label : props.placeholder),
              props.clearable && value != null && !props.disabled
                ? h(
                    'span',
                    {
                      role: 'button',
                      'aria-label': '清空',
                      'data-part': 'clearButton',
                      onClick: (event: MouseEvent) => {
                        event.stopPropagation();
                        setValue(null);
                      },
                    },
                    '×',
                  )
                : h('span', { 'data-part': 'arrow', 'aria-hidden': 'true' }, '▾'),
            ],
          ),
          isOpen()
            ? h(
                'ul',
                { role: 'listbox', 'data-part': 'listbox' },
                props.options.map((item) =>
                  h(
                    'li',
                    {
                      role: 'option',
                      'aria-selected': item.value === value,
                      'data-part': 'option',
                      'data-selected': presence(item.value === value),
                      'data-disabled': presence(item.disabled),
                      onClick: () => {
                        if (!item.disabled) setValue(item.value);
                      },
                    },
                    item.label,
                  ),
                ),
              )
            : null,
        ],
      );
    };
  },
});
