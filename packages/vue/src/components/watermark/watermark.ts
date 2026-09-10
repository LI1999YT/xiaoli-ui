import { defineComponent, h } from 'vue';
export const Watermark = defineComponent({ name: 'DuiWatermark', props: { text: { type: String, default: 'Xiaoli' } }, setup(p, { slots }) { return () => h('div', { 'data-dui': 'watermark', style: { '--dui-watermark-text': JSON.stringify(p.text) } }, slots.default?.()); } });
