import { defineComponent, h, ref, type PropType } from 'vue';
import type { Size } from '@xiaoli-ui/tokens';
import { cx, presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Button = defineComponent({
  name: 'DuiButton',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'solid' | 'outline' | 'soft' | 'ghost' | 'link'>, default: 'solid' },
    color: { type: String as PropType<'neutral' | 'primary' | 'success' | 'warning' | 'danger'>, default: 'primary' },
    size: { type: String as PropType<Size>, default: undefined },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    htmlType: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
    unstyled: { type: Boolean, default: undefined },
    classNames: { type: Object as PropType<Record<string, string>>, default: undefined },
    styles: { type: Object as PropType<Record<string, object>>, default: undefined },
  },
  emits: ['click'],
  setup(props, { slots, emit, attrs, expose }) {
    const config = useConfigOptional();
    const element = ref<HTMLButtonElement | null>(null);
    expose({
      element,
      focus: () => element.value?.focus(),
      blur: () => element.value?.blur(),
    });

    return () => {
      const isUnstyled = props.unstyled ?? config?.unstyled ?? false;
      const disabled = props.disabled || props.loading;
      return h(
        'button',
        {
          ...attrs,
          ref: element,
          type: props.htmlType,
          disabled,
          'aria-busy': props.loading || undefined,
          'data-dui': 'button',
          'data-part': 'root',
          'data-variant': props.variant,
          'data-color': props.color,
          'data-size': props.size ?? config?.size ?? 'md',
          'data-block': presence(props.block),
          'data-unstyled': presence(isUnstyled),
          class: cx(props.classNames?.root, attrs.class as string | undefined),
          onClick: (event: MouseEvent) => {
            if (props.loading || props.disabled) {
              event.preventDefault();
              return;
            }
            emit('click', event);
          },
        },
        [
          slots.leading ? h('span', { 'data-part': 'leading' }, slots.leading()) : null,
          props.loading ? h('span', { 'data-part': 'spinner', 'aria-hidden': 'true' }) : null,
          h('span', { 'data-part': 'label' }, slots.default?.()),
          slots.trailing ? h('span', { 'data-part': 'trailing' }, slots.trailing()) : null,
        ],
      );
    };
  },
});
