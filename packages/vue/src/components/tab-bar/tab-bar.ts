import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const TabBar = defineComponent({
  name: 'DuiTabBar',
  props: { items: { type: Array as PropType<Array<{ value: string; label: string }>>, default: () => [] }, modelValue: { type: String, default: undefined } },
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.items[0]?.value);
    return () => {
      const current = isControlled(props.modelValue) ? props.modelValue : uncontrolled.value;
      return h('nav', { 'data-dui': 'tab-bar' }, props.items.map((item) => h('button', { type: 'button', 'data-active': presence(item.value === current), onClick: () => { if (!isControlled(props.modelValue)) uncontrolled.value = item.value; emit('update:modelValue', item.value); } }, item.label)));
    };
  },
});
