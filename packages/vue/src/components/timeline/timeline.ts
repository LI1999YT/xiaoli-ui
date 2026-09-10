import { defineComponent, h } from 'vue';
export const Timeline = defineComponent({ name: 'DuiTimeline', props: { items: { type: Array, default: () => [] } }, setup(p) { return () => h('ol', { 'data-dui': 'timeline' }, (p.items as any[]).map((item) => h('li', [h('span', { 'data-part': 'dot' }), h('div', [h('strong', item.title), item.description ? h('p', item.description) : null])]))); } });
