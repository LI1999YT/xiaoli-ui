import { defineComponent, h } from 'vue';

export const ScrollArea = defineComponent({
  name: 'DuiScrollArea',
  props: {
    height: { type: [Number, String], default: 200 },
    maxHeight: { type: [Number, String], default: undefined },
  },
  emits: {
    scroll: (_next: { top: number; left: number }) => true,
  },
  setup(props, { emit, slots }) {
    return () =>
      h('div', { 'data-dui': 'scroll-area' }, [
        h(
          'div',
          {
            'data-part': 'viewport',
            tabindex: 0,
            style: { height: typeof props.height === 'number' ? `${props.height}px` : props.height, maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight },
            onScroll: (event: Event) => {
              const target = event.currentTarget as HTMLElement;
              emit('scroll', { top: target.scrollTop, left: target.scrollLeft });
            },
          },
          slots.default?.(),
        ),
      ]);
  },
});
