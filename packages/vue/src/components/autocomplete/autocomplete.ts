import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
export const Autocomplete = defineComponent({
  name: 'DuiAutocomplete',
  props: { options: { type: Array as PropType<string[]>, default: () => [] }, modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    const open = ref(false);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value;
      const set = (next: string) => { if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); };
      const filtered = props.options.filter((item) => item.toLowerCase().includes(current.toLowerCase()));
      return h('div', { 'data-dui': 'autocomplete' }, [
        h('input', { value: current, 'aria-autocomplete': 'list', onFocus: () => { open.value = true; }, onInput: (e: Event) => { set((e.target as HTMLInputElement).value); open.value = true; } }),
        open.value && filtered.length ? h('ul', { role: 'listbox' }, filtered.map((item) => h('li', { role: 'option', onClick: () => { set(item); open.value = false; } }, item))) : null,
      ]);
    };
  },
});
