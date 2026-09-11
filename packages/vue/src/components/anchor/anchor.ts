import { defineComponent, h } from 'vue';
export const Anchor = defineComponent({ name: 'DuiAnchor', props: { items: { type: Array, default: () => [] } }, setup(p) { return () => h('nav', { 'data-dui': 'anchor' }, (p.items as any[]).map((item) => h('a', { href: item.href }, item.label))); } });
