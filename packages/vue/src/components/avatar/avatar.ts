import { defineComponent, h, ref } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Avatar = defineComponent({
  name: 'DuiAvatar',
  props: {
    src: { type: String, default: undefined },
    alt: { type: String, default: '' },
    name: { type: String, default: undefined },
    size: { type: String, default: 'md' },
    shape: { type: String, default: 'circle' },
  },
  setup(props) {
    const config = useConfigOptional();
    const failed = ref(false);
    return () => {
      const initials = (props.name ?? '').trim().slice(0, 1) || '?';
      return h('span', { 'data-dui': 'avatar', 'data-part': 'root', 'data-size': props.size, 'data-shape': props.shape, 'data-unstyled': presence(config?.unstyled ?? false) }, [
        props.src && !failed.value ? h('img', { src: props.src, alt: props.alt, onError: () => { failed.value = true; } }) : h('span', { 'data-part': 'fallback' }, initials),
      ]);
    };
  },
});

export const AvatarGroup = defineComponent({
  name: 'DuiAvatarGroup',
  props: { max: { type: Number, default: 5 } },
  setup(props, { slots }) {
    return () => {
      const items = slots.default?.() ?? [];
      return h('span', { 'data-dui': 'avatar-group' }, [...items.slice(0, props.max), items.length > props.max ? h('span', { 'data-dui': 'avatar', 'data-part': 'overflow' }, `+${items.length - props.max}`) : null]);
    };
  },
});
