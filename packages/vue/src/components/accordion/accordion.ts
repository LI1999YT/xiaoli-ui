import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Accordion = defineComponent({
  name: 'DuiAccordion',
  props: { items: { type: Array as PropType<Array<{ key: string; title: string; content?: string; disabled?: boolean }>>, default: () => [] }, modelValue: { type: [String, Array] as PropType<string | string[]>, default: undefined }, multiple: { type: Boolean, default: false } },
  emits: { 'update:modelValue': (_v: string | string[]) => true },
  setup(props, { emit }) {
    const uncontrolled = ref<string | string[]>(props.multiple ? [] : '');
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      const selected = new Set(Array.isArray(current) ? current : current ? [current] : []);
      const toggle = (key: string) => {
        let next: string | string[];
        if (props.multiple) { const set = new Set(selected); if (set.has(key)) set.delete(key); else set.add(key); next = [...set]; }
        else next = selected.has(key) ? '' : key;
        if (!isControlled(props.modelValue)) uncontrolled.value = next;
        emit('update:modelValue', next);
      };
      return h('div', { 'data-dui': 'accordion' }, props.items.map((item) => {
        const open = selected.has(item.key);
        return h('div', { 'data-part': 'item', 'data-open': presence(open) }, [
          h('button', { type: 'button', 'data-part': 'trigger', 'aria-expanded': open, disabled: item.disabled, onClick: () => toggle(item.key) }, item.title),
          open ? h('div', { 'data-part': 'panel' }, item.content) : null,
        ]);
      }));
    };
  },
});
