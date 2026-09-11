import { defineComponent, h, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';

export const PullRefresh = defineComponent({
  name: 'DuiPullRefresh',
  props: {
    refreshing: { type: Boolean, default: undefined },
    refreshHandler: { type: Function, default: undefined },
    threshold: { type: Number, default: 64 },
    maxDistance: { type: Number, default: 120 },
    disabled: { type: Boolean, default: false },
  },
  emits: {
    refresh: () => true,
    'refresh-request': () => true,
  },
  setup(props, { emit, slots }) {
    const viewport = ref<HTMLElement | null>(null);
    const startY = ref(0);
    const pulling = ref(false);
    const distance = ref(0);
    const internalRefreshing = ref(false);
    const busy = () => (isControlled(props.refreshing) ? Boolean(props.refreshing) : internalRefreshing.value);

    const finish = async () => {
      if (props.disabled || busy()) return;
      if (!isControlled(props.refreshing)) internalRefreshing.value = true;
      emit('refresh-request');
      try {
        emit('refresh');
        await props.refreshHandler?.();
      } finally {
        if (!isControlled(props.refreshing)) internalRefreshing.value = false;
        distance.value = 0;
      }
    };

    return () => {
      const state = busy() ? 'refreshing' : distance.value >= props.threshold ? 'ready' : distance.value > 0 ? 'pulling' : 'idle';
      const label = state === 'refreshing' ? '刷新中…' : state === 'ready' ? '松开刷新' : state === 'pulling' ? '下拉刷新' : '下拉或点击刷新';
      return h('div', { 'data-dui': 'pull-refresh', 'data-refreshing': presence(busy()), 'data-state': state }, [
        h('div', { 'data-part': 'indicator', 'aria-live': 'polite' }, label),
        h(
          'button',
          { type: 'button', 'data-part': 'refreshButton', disabled: props.disabled || busy(), onClick: () => void finish() },
          busy() ? '刷新中…' : '刷新',
        ),
        h(
          'div',
          {
            ref: viewport,
            'data-part': 'content',
            style: {
              transform: distance.value || busy() ? `translateY(${busy() ? Math.min(props.threshold, props.maxDistance) : distance.value}px)` : undefined,
            },
            onTouchstart: (event: TouchEvent) => {
              if (props.disabled || busy()) return;
              if (!viewport.value || viewport.value.scrollTop > 0) return;
              startY.value = event.touches[0]?.clientY ?? 0;
              pulling.value = true;
            },
            onTouchmove: (event: TouchEvent) => {
              if (!pulling.value || props.disabled || busy()) return;
              if (viewport.value && viewport.value.scrollTop > 0) {
                pulling.value = false;
                distance.value = 0;
                return;
              }
              const delta = (event.touches[0]?.clientY ?? 0) - startY.value;
              if (delta <= 0) {
                distance.value = 0;
                return;
              }
              const damped = Math.min(props.maxDistance, delta * 0.55);
              distance.value = damped;
              if (damped > 8) event.preventDefault();
            },
            onTouchend: () => {
              if (!pulling.value) return;
              pulling.value = false;
              if (distance.value >= props.threshold) {
                void finish();
                return;
              }
              distance.value = 0;
            },
            onTouchcancel: () => {
              pulling.value = false;
              if (!busy()) distance.value = 0;
            },
          },
          slots.default?.(),
        ),
      ]);
    };
  },
});
