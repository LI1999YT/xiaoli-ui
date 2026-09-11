import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
  content?: string;
}

export const Tabs = defineComponent({
  name: 'DuiTabs',
  props: {
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    items: { type: Array as PropType<TabItem[]>, default: () => [] },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    variant: { type: String as PropType<'line' | 'pill'>, default: 'line' },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: { 'update:modelValue': (_next: string) => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const first = props.items.find((item) => !item.disabled)?.value ?? props.items[0]?.value ?? '';
    const uncontrolled = ref(props.defaultValue ?? first);
    const current = () => (isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value);
    const select = (next: string) => {
      if (!isControlled(props.modelValue)) uncontrolled.value = next;
      emit('update:modelValue', next);
    };
    return () =>
      h('div', { 'data-dui': 'tabs', 'data-part': 'root', 'data-orientation': props.orientation, 'data-variant': props.variant, 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
        h(
          'div',
          { role: 'tablist', 'aria-orientation': props.orientation, 'data-part': 'list' },
          props.items.map((item) =>
            h(
              'button',
              {
                type: 'button',
                role: 'tab',
                'data-part': 'tab',
                'data-active': presence(item.value === current()),
                'aria-selected': item.value === current(),
                disabled: item.disabled,
                onClick: () => !item.disabled && select(item.value),
              },
              item.label,
            ),
          ),
        ),
        ...props.items
          .filter((item) => item.value === current())
          .map((item) => h('div', { role: 'tabpanel', 'data-part': 'panel' }, item.content ?? slots.default?.({ value: item.value }))),
      ]);
  },
});
