import { defineComponent, h, onUnmounted, ref, watch, type PropType } from 'vue';
import { isControlled, isDateDisabled, nextRangeSelection, parseDateOnly, type DateOnly } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { Calendar } from '../calendar/calendar';

type DatePickerValue = DateOnly | [DateOnly, DateOnly] | null;

function toInputText(value: DatePickerValue): string {
  if (!value) return '';
  return Array.isArray(value) ? value.join(' ~ ') : value;
}

export const DatePicker = defineComponent({
  name: 'DuiDatePicker',
  props: {
    modelValue: { type: [String, Array] as PropType<DatePickerValue>, default: undefined },
    defaultValue: { type: [String, Array] as PropType<DatePickerValue>, default: null },
    mode: { type: String as PropType<'single' | 'range'>, default: 'single' },
    min: { type: String as PropType<DateOnly>, default: undefined },
    max: { type: String as PropType<DateOnly>, default: undefined },
    disabledDate: { type: Function as PropType<(date: DateOnly) => boolean>, default: undefined },
    clearable: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: {
    'update:modelValue': (_next: DatePickerValue) => true,
    'update:open': (_next: boolean) => true,
    'invalid-input': (_raw: string) => true,
  },
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null);
    const uncontrolled = ref<DatePickerValue>(props.defaultValue);
    const uncontrolledOpen = ref(props.defaultOpen);
    const draftStart = ref<DateOnly | null>(null);
    const text = ref('');
    const current = () => (isControlled(props.modelValue) ? (props.modelValue ?? null) : uncontrolled.value);
    const isOpen = () => (isControlled(props.open) ? Boolean(props.open) : uncontrolledOpen.value);

    watch(
      () => current(),
      (value) => {
        text.value = toInputText(value);
      },
      { immediate: true },
    );

    const setOpen = (next: boolean) => {
      if (!isControlled(props.open)) uncontrolledOpen.value = next;
      emit('update:open', next);
      if (!next) draftStart.value = null;
    };
    const commit = (next: DatePickerValue) => {
      if (!isControlled(props.modelValue)) uncontrolled.value = next;
      emit('update:modelValue', next);
    };

    const onDoc = (event: PointerEvent) => {
      if (!root.value?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    onUnmounted(() => document.removeEventListener('pointerdown', onDoc));

    const applyText = () => {
      const raw = text.value.trim();
      if (!raw) {
        commit(null);
        return;
      }
      if (props.mode === 'range') {
        const [start, end] = raw.split(/\s*~\s*/);
        if (parseDateOnly(start) && parseDateOnly(end ?? '')) {
          commit([start, end as DateOnly]);
          return;
        }
        emit('invalid-input', raw);
        text.value = toInputText(current());
        return;
      }
      if (parseDateOnly(raw)) {
        commit(raw);
        return;
      }
      emit('invalid-input', raw);
      text.value = toInputText(current());
    };

    const pick = (date: DateOnly) => {
      if (isDateDisabled(date, { min: props.min, max: props.max, disabledDate: props.disabledDate })) return;
      if (props.mode === 'range') {
        const next = nextRangeSelection(draftStart.value, date);
        draftStart.value = next.draftStart;
        if (next.value) {
          commit(next.value);
          setOpen(false);
        }
        return;
      }
      commit(date);
      setOpen(false);
    };

    return () => {
      const value = current();
      const selectedSingle = typeof value === 'string' ? value : null;
      const range = Array.isArray(value) ? value : draftStart.value ? ([draftStart.value, draftStart.value] as [DateOnly, DateOnly]) : null;
      return h('div', { ref: root, 'data-dui': 'date-picker', 'data-open': presence(isOpen()), 'data-mode': props.mode, 'data-disabled': presence(props.disabled) }, [
        h('div', { 'data-part': 'trigger' }, [
          h('input', {
            'data-part': 'input',
            'aria-label': props.mode === 'range' ? '日期区间' : '日期',
            value: text.value,
            disabled: props.disabled,
            placeholder: props.mode === 'range' ? 'YYYY-MM-DD ~ YYYY-MM-DD' : 'YYYY-MM-DD',
            onInput: (event: Event) => {
              text.value = (event.target as HTMLInputElement).value;
            },
            onFocus: () => setOpen(true),
            onBlur: applyText,
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Escape') {
                setOpen(false);
                text.value = toInputText(current());
              }
              if (event.key === 'Enter') applyText();
            },
          }),
          props.clearable && value && !props.disabled
            ? h(
                'button',
                {
                  type: 'button',
                  'data-part': 'clearButton',
                  'aria-label': '清空',
                  onClick: () => {
                    commit(null);
                    draftStart.value = null;
                  },
                },
                '×',
              )
            : null,
        ]),
        isOpen() && !props.disabled
          ? h('div', { 'data-part': 'panel' }, [
              h(Calendar, {
                modelValue: selectedSingle,
                min: props.min,
                max: props.max,
                disabledDate: props.disabledDate,
                rangeStart: range?.[0] ?? draftStart.value,
                rangeEnd: range?.[1] ?? draftStart.value,
                'onUpdate:modelValue': pick,
              }),
            ])
          : null,
      ]);
    };
  },
});
