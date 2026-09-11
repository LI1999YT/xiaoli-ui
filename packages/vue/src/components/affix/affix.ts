import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue';
import { presence } from '../../utils';

export const Affix = defineComponent({
  name: 'DuiAffix',
  props: {
    offset: { type: Number, default: 0 },
  },
  emits: { change: (_fixed: boolean) => true },
  setup(props, { emit, slots }) {
    const sentinel = ref<HTMLElement | null>(null);
    const content = ref<HTMLElement | null>(null);
    const fixed = ref(false);
    const size = ref({ width: 0, height: 0 });
    let io: IntersectionObserver | undefined;
    let ro: ResizeObserver | undefined;

    onMounted(() => {
      if (sentinel.value) {
        io = new IntersectionObserver(
          ([entry]) => {
            const next = Boolean(entry && !entry.isIntersecting && entry.boundingClientRect.top < props.offset);
            if (fixed.value !== next) emit('change', next);
            fixed.value = next;
          },
          { root: null, rootMargin: `-${props.offset}px 0px 0px 0px`, threshold: 0 },
        );
        io.observe(sentinel.value);
      }
      if (content.value) {
        const measure = () => {
          if (!content.value) return;
          size.value = { width: content.value.offsetWidth, height: content.value.offsetHeight };
        };
        measure();
        ro = new ResizeObserver(measure);
        ro.observe(content.value);
      }
    });
    onUnmounted(() => {
      io?.disconnect();
      ro?.disconnect();
    });

    return () =>
      h('div', { 'data-dui': 'affix', 'data-fixed': presence(fixed.value) }, [
        h('div', { ref: sentinel, 'data-part': 'sentinel' }),
        fixed.value ? h('div', { 'data-part': 'placeholder', style: { height: `${size.value.height}px` } }) : null,
        h(
          'div',
          {
            ref: content,
            'data-part': 'content',
            style: fixed.value ? { top: `${props.offset}px`, width: `${size.value.width}px` } : undefined,
          },
          slots.default?.(),
        ),
      ]);
  },
});
