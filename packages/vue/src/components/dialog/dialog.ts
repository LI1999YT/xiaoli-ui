import { defineComponent, h, onUnmounted, ref, Teleport, watch } from 'vue';
import type { OpenChangeDetails } from '@xiaoli-ui/tokens';
import { createId, isControlled } from '@xiaoli-ui/internal-core';
import { dismissTop, focusElement, getFocusable, lockScroll, pushLayer, trapFocus, unlockScroll } from '@xiaoli-ui/internal-dom';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Dialog = defineComponent({
  name: 'DuiDialog',
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    modal: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOutside: { type: Boolean, default: true },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: {
    'update:open': (_next: boolean, _details: OpenChangeDetails) => true,
    afterOpen: () => true,
    afterClose: () => true,
  },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultOpen);
    const mounted = ref(false);
    const content = ref<HTMLElement | null>(null);
    const layerId = createId('dialog');
    let release: (() => void) | undefined;

    const visible = () => (isControlled(props.open) ? Boolean(props.open) : uncontrolled.value);
    const setOpen = (next: boolean, details: OpenChangeDetails) => {
      if (!isControlled(props.open)) uncontrolled.value = next;
      emit('update:open', next, details);
    };

    watch(
      visible,
      (isOpen, _prev, onCleanup) => {
        mounted.value = true;
        if (!isOpen || typeof document === 'undefined') return;
        const doc = document;
        if (props.modal) lockScroll(doc);
        release = pushLayer(doc, {
          id: layerId,
          modal: props.modal,
          closeOnEscape: props.closeOnEscape,
          closeOnOutside: props.closeOnOutside,
          content: content.value,
          onDismiss: (reason, event) => setOpen(false, { reason, originalEvent: event }),
        });
        const onKey = (event: KeyboardEvent) => {
          if (event.key === 'Escape') dismissTop(doc, 'escape', event);
          if (content.value && props.modal) trapFocus(content.value, event);
        };
        doc.addEventListener('keydown', onKey);
        queueMicrotask(() => focusElement(getFocusable(content.value ?? doc.body)[0] ?? content.value));
        emit('afterOpen');
        onCleanup(() => {
          doc.removeEventListener('keydown', onKey);
          if (props.modal) unlockScroll(doc);
          release?.();
          emit('afterClose');
        });
      },
      { immediate: true },
    );

    onUnmounted(() => release?.());

    return () => {
      if (!visible() || typeof document === 'undefined') {
        return slots.trigger
          ? h('span', { onClick: (event: MouseEvent) => setOpen(true, { reason: 'trigger', originalEvent: event }) }, slots.trigger())
          : null;
      }
      const host = config?.portalHost ?? document.body;
      return h(Teleport, { to: host }, [
        slots.trigger
          ? h('span', { onClick: (event: MouseEvent) => setOpen(false, { reason: 'trigger', originalEvent: event }) }, slots.trigger())
          : null,
        h('div', { 'data-dui': 'dialog', 'data-part': 'root', 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
          props.modal ? h('div', { 'data-dui': 'dialog', 'data-part': 'backdrop' }) : null,
          h('div', { 'data-dui': 'dialog', 'data-part': 'positioner' }, [
            h(
              'div',
              {
                ref: content,
                role: 'dialog',
                'aria-modal': props.modal || undefined,
                tabindex: -1,
                'data-dui': 'dialog',
                'data-part': 'content',
              },
              [
                h('div', { 'data-part': 'header' }, [
                  props.title ? h('h2', { 'data-part': 'title' }, props.title) : slots.title?.(),
                  h(
                    'button',
                    {
                      type: 'button',
                      'aria-label': '关闭',
                      'data-part': 'closeButton',
                      onClick: (event: MouseEvent) => setOpen(false, { reason: 'close-button', originalEvent: event }),
                    },
                    '×',
                  ),
                ]),
                slots.description ? h('div', { 'data-part': 'description' }, slots.description()) : null,
                h('div', { 'data-part': 'body' }, slots.default?.()),
                slots.footer ? h('div', { 'data-part': 'footer' }, slots.footer()) : null,
              ],
            ),
          ]),
        ]),
      ]);
    };
  },
});
