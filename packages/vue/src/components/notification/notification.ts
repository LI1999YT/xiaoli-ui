import { defineComponent, h, type PropType } from 'vue';
export const Notification = defineComponent({
  name: 'DuiNotification',
  props: { title: { type: String, required: true }, description: { type: String, default: undefined }, status: { type: String as PropType<'info' | 'success' | 'warning' | 'error'>, default: 'info' } },
  emits: { close: () => true },
  setup(props, { emit }) {
    return () => h('div', { 'data-dui': 'notification', 'data-status': props.status, role: 'status' }, [
      h('strong', props.title),
      props.description ? h('p', props.description) : null,
      h('button', { type: 'button', 'aria-label': '关闭', onClick: () => emit('close') }, '×'),
    ]);
  },
});
