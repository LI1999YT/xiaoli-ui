import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
export const Pagination = defineComponent({
  name: 'DuiPagination',
  props: { page: { type: Number, default: undefined }, defaultPage: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, total: { type: Number, default: 0 } },
  emits: { 'update:page': (_n: number) => true },
  setup(props, { emit }) {
    const uncontrolled = ref(props.defaultPage);
    return () => {
      const current = isControlled(props.page) ? (props.page as number) : uncontrolled.value;
      const pages = Math.max(1, Math.ceil(props.total / props.pageSize));
      const go = (next: number) => { const value = Math.min(pages, Math.max(1, next)); if (!isControlled(props.page)) uncontrolled.value = value; emit('update:page', value); };
      const items = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - current) <= 1);
      return h('nav', { 'data-dui': 'pagination', 'aria-label': '分页' }, [
        h('button', { type: 'button', disabled: current <= 1, onClick: () => go(current - 1) }, '上一页'),
        ...items.flatMap((n, i) => [i > 0 && items[i - 1] !== n - 1 ? h('span', { 'data-part': 'ellipsis' }, '…') : null, h('button', { type: 'button', 'data-active': presence(n === current), onClick: () => go(n) }, n)]),
        h('button', { type: 'button', disabled: current >= pages, onClick: () => go(current + 1) }, '下一页'),
      ]);
    };
  },
});
