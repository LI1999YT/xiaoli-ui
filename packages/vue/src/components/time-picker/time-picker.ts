import { defineComponent, h, onUnmounted, ref, watch, type PropType } from 'vue';
import {
  buildStepValues,
  defaultTimeParts,
  formatTimeOnly,
  hour12Display,
  hourFrom12,
  isControlled,
  isTimeDisabled,
  parseTimeOnly,
  type TimeOnly,
  type TimeParts,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';

function cloneParts(parts: TimeParts): TimeParts {
  return { hour: parts.hour, minute: parts.minute, second: parts.second };
}

export const TimePicker = defineComponent({
  name: 'DuiTimePicker',
  props: {
    modelValue: { type: String as PropType<TimeOnly | null>, default: undefined },
    defaultValue: { type: String as PropType<TimeOnly | null>, default: null },
    showSeconds: { type: Boolean, default: false },
    hourCycle: { type: String as PropType<'h12' | 'h23'>, default: 'h23' },
    minuteStep: { type: Number, default: 1 },
    secondStep: { type: Number, default: 1 },
    min: { type: String as PropType<TimeOnly>, default: undefined },
    max: { type: String as PropType<TimeOnly>, default: undefined },
    disabledTime: { type: Function as PropType<(time: TimeOnly) => boolean>, default: undefined },
    clearable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
  },
  emits: {
    'update:modelValue': (_next: TimeOnly | null) => true,
    'update:open': (_next: boolean) => true,
    confirm: (_next: TimeOnly) => true,
  },
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null);
    const uncontrolled = ref<TimeOnly | null>(props.defaultValue);
    const uncontrolledOpen = ref(props.defaultOpen);
    const current = () => (isControlled(props.modelValue) ? (props.modelValue ?? null) : uncontrolled.value);
    const isOpen = () => (isControlled(props.open) ? Boolean(props.open) : uncontrolledOpen.value);
    const committed = () => parseTimeOnly(current()) ?? defaultTimeParts(props.showSeconds);
    const draft = ref<TimeParts>(committed());

    watch(
      () => [isOpen(), current(), props.showSeconds] as const,
      ([open]) => {
        if (open) draft.value = parseTimeOnly(current()) ?? defaultTimeParts(props.showSeconds);
      },
    );

    const setOpen = (next: boolean) => {
      if (!isControlled(props.open)) uncontrolledOpen.value = next;
      emit('update:open', next);
    };
    const commit = (next: TimeOnly | null) => {
      if (!isControlled(props.modelValue)) uncontrolled.value = next;
      emit('update:modelValue', next);
    };

    const onDoc = (event: PointerEvent) => {
      if (!root.value?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen()) {
        draft.value = cloneParts(committed());
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    onUnmounted(() => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    });

    const applyDraft = (next: TimeParts) => {
      const formatted = formatTimeOnly(next, props.showSeconds);
      if (isTimeDisabled(formatted, { min: props.min, max: props.max, disabledTime: props.disabledTime })) return;
      draft.value = next;
    };

    const confirm = () => {
      const next = formatTimeOnly(draft.value, props.showSeconds);
      if (isTimeDisabled(next, { min: props.min, max: props.max, disabledTime: props.disabledTime })) return;
      commit(next);
      emit('confirm', next);
      setOpen(false);
    };

    return () => {
      const hours = props.hourCycle === 'h12' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : buildStepValues(24, 1);
      const minutes = buildStepValues(60, props.minuteStep);
      const seconds = buildStepValues(60, props.secondStep);
      const display = hour12Display(draft.value.hour);
      const value = current();

      return h('div', { ref: root, 'data-dui': 'time-picker', 'data-open': presence(isOpen()), 'data-disabled': presence(props.disabled) }, [
        h('div', { 'data-part': 'trigger' }, [
          h('input', {
            'data-part': 'input',
            'aria-label': '时间',
            readonly: true,
            disabled: props.disabled,
            value: value ?? '',
            placeholder: props.showSeconds ? 'HH:mm:ss' : 'HH:mm',
            onClick: () => {
              if (!props.disabled) setOpen(!isOpen());
            },
          }),
          props.clearable && value && !props.disabled
            ? h('button', { type: 'button', 'data-part': 'clearButton', 'aria-label': '清空', onClick: () => commit(null) }, '×')
            : null,
        ]),
        isOpen() && !props.disabled
          ? h('div', { 'data-part': 'panel' }, [
              h('div', { 'data-part': 'columns' }, [
                h(
                  'div',
                  { 'data-part': 'hour', 'aria-label': '小时' },
                  hours.map((hour) => {
                    const actual = props.hourCycle === 'h12' ? hourFrom12(hour, display.period) : hour;
                    return h(
                      'button',
                      {
                        key: `h-${hour}`,
                        type: 'button',
                        'data-part': 'columnItem',
                        'data-active': presence(draft.value.hour === actual),
                        onClick: () => applyDraft({ ...draft.value, hour: actual }),
                      },
                      String(hour).padStart(2, '0'),
                    );
                  }),
                ),
                h(
                  'div',
                  { 'data-part': 'minute', 'aria-label': '分钟' },
                  minutes.map((minute) =>
                    h(
                      'button',
                      {
                        key: `m-${minute}`,
                        type: 'button',
                        'data-part': 'columnItem',
                        'data-active': presence(draft.value.minute === minute),
                        onClick: () => applyDraft({ ...draft.value, minute }),
                      },
                      String(minute).padStart(2, '0'),
                    ),
                  ),
                ),
                props.showSeconds
                  ? h(
                      'div',
                      { 'data-part': 'second', 'aria-label': '秒' },
                      seconds.map((second) =>
                        h(
                          'button',
                          {
                            key: `s-${second}`,
                            type: 'button',
                            'data-part': 'columnItem',
                            'data-active': presence(draft.value.second === second),
                            onClick: () => applyDraft({ ...draft.value, second }),
                          },
                          String(second).padStart(2, '0'),
                        ),
                      ),
                    )
                  : null,
                props.hourCycle === 'h12'
                  ? h(
                      'div',
                      { 'data-part': 'period', 'aria-label': '上午或下午' },
                      (['AM', 'PM'] as const).map((period) =>
                        h(
                          'button',
                          {
                            key: period,
                            type: 'button',
                            'data-part': 'columnItem',
                            'data-active': presence(display.period === period),
                            onClick: () => applyDraft({ ...draft.value, hour: hourFrom12(display.display, period) }),
                          },
                          period,
                        ),
                      ),
                    )
                  : null,
              ]),
              h('div', { 'data-part': 'footer' }, [
                h('button', { type: 'button', onClick: () => { draft.value = cloneParts(committed()); setOpen(false); } }, '取消'),
                h('button', { type: 'button', onClick: confirm }, '确认'),
              ]),
            ])
          : null,
      ]);
    };
  },
});
