import { defineComponent, h, ref } from 'vue';
import { presence } from '../../utils';
export const Upload = defineComponent({
  name: 'DuiUpload',
  props: { accept: { type: String, default: undefined }, multiple: { type: Boolean, default: false }, disabled: { type: Boolean, default: false } },
  emits: { filesChange: (_files: File[]) => true },
  setup(props, { emit }) {
    const files = ref<File[]>([]);
    return () => h('div', { 'data-dui': 'upload', 'data-disabled': presence(props.disabled) }, [
      h('label', { 'data-part': 'trigger' }, [
        h('input', { type: 'file', accept: props.accept, multiple: props.multiple, disabled: props.disabled, class: 'dui-visually-hidden', onChange: (e: Event) => { files.value = [...((e.target as HTMLInputElement).files ?? [])]; emit('filesChange', files.value); } }),
        h('span', '选择文件'),
      ]),
      h('ul', { 'data-part': 'list' }, files.value.map((file) => h('li', file.name))),
    ]);
  },
});
