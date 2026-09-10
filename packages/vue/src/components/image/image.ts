import { defineComponent, h, ref, watch, type PropType } from 'vue';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Image = defineComponent({
  name: 'DuiImage',
  props: {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    width: { type: [Number, String] as PropType<number | string>, default: undefined },
    height: { type: [Number, String] as PropType<number | string>, default: undefined },
    fit: { type: String as PropType<'cover' | 'contain' | 'fill' | 'none'>, default: 'cover' },
    loading: { type: String as PropType<'eager' | 'lazy'>, default: 'lazy' },
    fallbackSrc: { type: String, default: undefined },
    aspectRatio: { type: [String, Number] as PropType<string | number>, default: undefined },
  },
  setup(props) {
    const config = useConfigOptional();
    const current = ref(props.src);
    const failed = ref(false);
    watch(() => props.src, (src) => { current.value = src; failed.value = false; });
    return () =>
      h('span', { 'data-dui': 'image', 'data-part': 'root', 'data-fit': props.fit, 'data-unstyled': presence(config?.unstyled ?? false), style: { width: props.width, height: props.height, aspectRatio: props.aspectRatio } }, [
        failed.value && !props.fallbackSrc
          ? h('span', { 'data-part': 'fallback' }, '图片加载失败')
          : h('img', {
              src: current.value,
              alt: props.alt,
              loading: props.loading,
              onError: () => {
                if (props.fallbackSrc && current.value !== props.fallbackSrc) current.value = props.fallbackSrc;
                else failed.value = true;
              },
            }),
      ]);
  },
});
