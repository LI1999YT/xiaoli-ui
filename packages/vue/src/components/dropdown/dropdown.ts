import { defineComponent, h, ref, type PropType } from 'vue';
import { presence } from '../../utils';
export const Dropdown = defineComponent({
  name: 'DuiDropdown',
  props: { items: { type: Array as PropType<Array<{ value: string; label: string; danger?: boolean }>>, default: () => [] } },
  emits: { select: (_v: string) => true },
  setup(props, { emit, slots }) {
    const open = ref(false);
    return () => h('div', { 'data-dui': 'dropdown', 'data-open': presence(open.value) }, [
      h('button', { type: 'button', 'data-part': 'trigger', 'aria-expanded': open.value, onClick: () => { open.value = !open.value; } }, slots.default?.() ?? '操作'),
      open.value ? h('ul', { 'data-part': 'menu', role: 'menu' }, props.items.map((item) => h('li', { role: 'menuitem', 'data-danger': presence(item.danger), onClick: () => { emit('select', item.value); open.value = false; } }, item.label))) : null,
    ]);
  },
});
