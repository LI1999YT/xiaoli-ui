import { defineComponent, h } from 'vue';
export const Affix = defineComponent({ name: 'DuiAffix', props: { offset: { type: Number, default: 0 } }, setup(p, { slots }) { return () => h('div', { 'data-dui': 'affix', style: { top: p.offset + 'px' } }, slots.default?.()); } });
