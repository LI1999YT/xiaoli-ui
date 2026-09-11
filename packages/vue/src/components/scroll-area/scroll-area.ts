import { defineComponent, h } from 'vue';
export const ScrollArea = defineComponent({ name: 'DuiScrollArea', props: { height: { type: Number, default: 200 } }, setup(p, { slots }) { return () => h('div', { 'data-dui': 'scroll-area', style: { height: p.height + 'px' } }, slots.default?.()); } });
