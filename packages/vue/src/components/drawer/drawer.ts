import { defineComponent, h, onUnmounted, ref, Teleport, watch, type PropType } from 'vue';
import type { OpenChangeDetails } from '@xiaoli-ui/tokens';
import { createId, isControlled } from '@xiaoli-ui/internal-core';
import { dismissTop, focusElement, getFocusable, lockScroll, pushLayer, trapFocus, unlockScroll } from '@xiaoli-ui/internal-dom';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Drawer = defineComponent({
  name: 'DuiDrawer',
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    placement: { type: String as PropType<'start' | 'end' | 'top' | 'bottom'>, default: 'end' },
    modal: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOutside: { type: Boolean, default: true },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: {
    'update:open': (_next: boolean, _details: OpenChangeDetails) => true,
  },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultOpen);
    const content = ref<HTMLElement | null>(null);
    const layerId = createId('drawer');
    let release: (() => void) | undefined;
    const visible = () => (isControlled(props.open) ? Boolean(props.open) : uncontrolled.value);
    const setOpen = (next: boolean, details: OpenChangeDetails) => {
      if (!isControlled(props.open)) uncontrolled.value = next;
      emit('update:open', next, details);
    };

    watch(
      visible,
      (isOpen, _prev, onCleanup) => {
        if (!isOpen || typeof document === 'undefined') return;
        if (props.modal) lockScroll(document);
        release = pushLayer(document, {
          id: layerId,
          modal: props.modal,
          closeOnEscape: props.closeOnEscape,
          closeOnOutside: props.closeOnOutside,
          content: content.value,
          onDismiss: (reason, event) => setOpen(false, { reason, originalEvent: event }),
        });
        const onKey = (event: KeyboardEvent) => {
          if (event.key === 'Escape') dismissTop(document, 'escape', event);
          if (content.value && props.modal) trapFocus(content.value, event);
        };
        document.addEventListener('keydown', onKey);
        queueMicrotask(() => focusElement(getFocusable(content.value ?? document.body)[0] ?? content.value));
        onCleanup(() => {
          document.removeEventListener('keydown', onKey);
          if (props.modal) unlockScroll(document);
          release?.();
        });
      },
      { immediate: true },
    );
    onUnmounted(() => release?.());

    return () => {
      const trigger = slots.trigger
        ? h('span', { onClick: (event: MouseEvent) => setOpen(!visible(), { reason: 'trigger', originalEvent: event }) }, slots.trigger())
        : null;
      if (!visible() || typeof document === 'undefined') return trigger;
      const host = config?.portalHost ?? document.body;
      return h(Teleport, { to: host }, [
        trigger,
        h('div', { 'data-dui': 'drawer', 'data-part': 'root', 'data-placement': props.placement, 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
          props.modal
            ? h('div', {
                'data-part': 'backdrop',
                onClick: (event: MouseEvent) => {
                  if (props.closeOnOutside) setOpen(false, { reason: 'outside', originalEvent: event });
                },
              })
            : null,
          h('div', { ref: content, role: 'dialog', 'aria-modal': props.modal || undefined, 'data-part': 'content', tabindex: -1 }, [
            h('div', { 'data-part': 'header' }, [
              props.title ? h('h2', { 'data-part': 'title' }, props.title) : null,
              h('button', { type: 'button', 'aria-label': '关闭', 'data-part': 'closeButton', onClick: (event: MouseEvent) => setOpen(false, { reason: 'close-button', originalEvent: event }) }, '×'),
            ]),
            h('div', { 'data-part': 'body' }, slots.default?.()),
          ]),
        ]),
      ]);
    };
  },
});
