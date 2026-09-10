import { defineComponent, h, type PropType } from 'vue';
export const Breadcrumb = defineComponent({
  name: 'DuiBreadcrumb',
  props: { items: { type: Array as PropType<Array<{ label: string; href?: string }>>, default: () => [] }, separator: { type: String, default: '/' } },
  setup(props) {
    return () => h('nav', { 'data-dui': 'breadcrumb', 'aria-label': '面包屑' }, [
      h('ol', props.items.map((item, index) => h('li', [
        index > 0 ? h('span', { 'data-part': 'separator' }, props.separator) : null,
        item.href && index < props.items.length - 1 ? h('a', { href: item.href }, item.label) : h('span', { 'aria-current': index === props.items.length - 1 ? 'page' : undefined }, item.label),
      ]))),
    ]);
  },
});
