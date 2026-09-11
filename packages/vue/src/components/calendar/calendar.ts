import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Calendar = defineComponent({
  name: 'DuiCalendar',
  props: { modelValue: { type: String, default: undefined }, defaultValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultValue);
    return () => {
      const current = isControlled(props.modelValue) ? (props.modelValue as string) : uncontrolled.value;
      const cursor = current ? new Date(current) : new Date();
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const first = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
      const pick = (day: number) => { const next = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; if (!isControlled(props.modelValue)) uncontrolled.value = next; emit('update:modelValue', next); };
      return h('div', { 'data-dui': 'calendar' }, [
        h('div', { 'data-part': 'caption' }, `${year}年${month + 1}月`),
        h('div', { 'data-part': 'grid' }, [
          ...['日','一','二','三','四','五','六'].map((d) => h('span', { 'data-part': 'weekday' }, d)),
          ...cells.map((day, i) => day ? h('button', { type: 'button', 'data-selected': presence(current.includes(`-${String(day).padStart(2, '0')}`)), onClick: () => pick(day) }, day) : h('span', { key: i })),
        ]),
      ]);
    };
  },
});
