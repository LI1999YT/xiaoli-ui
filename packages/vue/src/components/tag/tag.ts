import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Tag = defineComponent({
  name: 'DuiTag',
  props: {
    variant: { type: String as PropType<'solid' | 'soft' | 'outline'>, default: 'soft' },
    color: { type: String, default: 'neutral' },
    size: { type: String as PropType<'sm' | 'md'>, default: 'md' },
    closable: { type: Boolean, default: false },
    checkable: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: false },
  },
  emits: { 'update:modelValue': (_next: boolean) => true, close: () => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultChecked);
    return () => {
      const current = isControlled(props.modelValue) ? Boolean(props.modelValue) : uncontrolled.value;
      return h('span', {
        'data-dui': 'tag',
        'data-part': 'root',
        'data-variant': props.variant,
        'data-color': props.color,
        'data-size': props.size,
        'data-checked': presence(props.checkable && current),
        'data-unstyled': presence(config?.unstyled ?? false),
        onClick: () => {
          if (!props.checkable) return;
          const next = !current;
          if (!isControlled(props.modelValue)) uncontrolled.value = next;
          emit('update:modelValue', next);
        },
      }, [
        slots.default?.(),
        props.closable ? h('button', { type: 'button', 'aria-label': '删除', 'data-part': 'close', onClick: (event: MouseEvent) => { event.stopPropagation(); emit('close'); } }, '×') : null,
      ]);
    };
  },
});
