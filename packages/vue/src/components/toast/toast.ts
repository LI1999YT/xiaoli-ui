import { defineComponent, h, onMounted, onUnmounted, ref, Teleport } from 'vue';
import type { ToastOptions } from '@xiaoli-ui/internal-core';
import { useConfig } from '../../context';

export function useToast() {
  const { toastStore } = useConfig();
  return {
    show: (options: ToastOptions) => toastStore.show(options),
    update: (id: string, options: Partial<ToastOptions>) => toastStore.update(id, options),
    dismiss: (id: string) => toastStore.dismiss(id, 'dismiss'),
    dismissAll: () => toastStore.dismissAll(),
  };
}

export const ToastViewport = defineComponent({
  name: 'DuiToastViewport',
  props: {
    maxVisible: { type: Number, default: 3 },
    placement: { type: String, default: 'top-end' },
  },
  setup(props) {
    const config = useConfig();
    const tick = ref(0);
    config.toastStore.maxVisible = props.maxVisible;
    const stop = config.toastStore.subscribe(() => {
      tick.value += 1;
    });
    const onVis = () => {
      if (document.hidden) config.toastStore.pause();
      else config.toastStore.resume();
    };
    onMounted(() => document.addEventListener('visibilitychange', onVis));
    onUnmounted(() => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
    });

    return () => {
      void tick.value;
      const host = config.portalHost;
      if (!host) return null;
      return h(Teleport, { to: host }, [
        h(
          'div',
          {
            'data-dui': 'toast-viewport',
            'data-part': 'viewport',
            'data-placement': props.placement,
          },
          config.toastStore.items.map((item) =>
            h(
              'div',
              {
                key: item.id,
                'data-dui': 'toast',
                'data-part': 'toast',
                'data-status': item.status,
                role: 'status',
                'aria-live': item.status === 'error' ? 'assertive' : 'polite',
                onMouseenter: () => config.toastStore.pause(item.id),
                onMouseleave: () => config.toastStore.resume(item.id),
              },
              [
                h('div', { 'data-part': 'message' }, item.message),
                h(
                  'button',
                  {
                    type: 'button',
                    'aria-label': '关闭提示',
                    'data-part': 'closeButton',
                    onClick: () => config.toastStore.dismiss(item.id, 'dismiss'),
                  },
                  '×',
                ),
              ],
            ),
          ),
        ),
      ]);
    };
  },
});
