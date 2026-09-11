import { defineComponent, h, onMounted, ref, watch } from 'vue';

function createPattern(text: string, gap: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = gap;
  canvas.height = gap;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.clearRect(0, 0, gap, gap);
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = '#6b4b63';
  ctx.font = '16px "Xiaoli Anime", sans-serif';
  ctx.translate(gap / 2, gap / 2);
  ctx.rotate((-18 * Math.PI) / 180);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  return canvas.toDataURL();
}

export const Watermark = defineComponent({
  name: 'DuiWatermark',
  props: {
    text: { type: String, default: 'Xiaoli' },
    gap: { type: Number, default: 140 },
  },
  setup(props, { slots }) {
    const image = ref('');
    const paint = () => {
      image.value = createPattern(props.text, props.gap);
    };
    onMounted(paint);
    watch(() => [props.text, props.gap], paint);

    return () =>
      h('div', { 'data-dui': 'watermark' }, [
        h('div', {
          'data-part': 'layer',
          'aria-hidden': 'true',
          style: image.value ? { backgroundImage: `url(${image.value})`, backgroundSize: `${props.gap}px ${props.gap}px` } : undefined,
        }),
        h('div', { 'data-part': 'content' }, slots.default?.()),
      ]);
  },
});
