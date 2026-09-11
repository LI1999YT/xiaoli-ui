import { defineComponent, h, onUnmounted, ref } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Popover = defineComponent({
  name: 'DuiPopover',
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    placement: { type: String, default: 'bottom' },
    title: { type: String, default: undefined },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: { 'update:open': (_next: boolean) => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const root = ref<HTMLElement | null>(null);
    const uncontrolled = ref(props.defaultOpen);
    const visible = () => (isControlled(props.open) ? Boolean(props.open) : uncontrolled.value);
    const setOpen = (next: boolean) => {
      if (!isControlled(props.open)) uncontrolled.value = next;
      emit('update:open', next);
    };
    const onDoc = (event: PointerEvent) => {
      if (!root.value?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    onUnmounted(() => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    });
    return () =>
      h('div', { ref: root, 'data-dui': 'popover', 'data-part': 'root', 'data-placement': props.placement, 'data-open': presence(visible()), 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
        h('button', { type: 'button', 'data-part': 'trigger', 'aria-expanded': visible(), onClick: () => setOpen(!visible()) }, slots.trigger?.()),
        visible()
          ? h('div', { role: 'dialog', 'data-part': 'content' }, [props.title ? h('strong', { 'data-part': 'title' }, props.title) : null, slots.default?.()])
          : null,
      ]);
  },
});
