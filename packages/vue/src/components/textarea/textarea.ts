import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Textarea = defineComponent({
  name: 'DuiTextarea',
  props: {
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: '' },
    rows: { type: Number, default: 3 },
    showCount: { type: Boolean, default: false },
    maxLength: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit, attrs }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? String(props.modelValue) : uncontrolled.value;
      return h('div', { 'data-dui': 'textarea', 'data-unstyled': presence(config?.unstyled ?? false) }, [
        h('textarea', {
          ...attrs,
          rows: props.rows,
          maxlength: props.maxLength,
          disabled: props.disabled,
          value: current,
          'data-part': 'textarea',
          onInput: (event: Event) => {
            const next = (event.target as HTMLTextAreaElement).value;
            if (!isControlled(props.modelValue)) uncontrolled.value = next;
            emit('update:modelValue', next);
          },
        }),
        props.showCount ? h('span', { 'data-part': 'count' }, `${current.length}${props.maxLength ? '/' + props.maxLength : ''}`) : null,
      ]);
    };
  },
});
