import { defineComponent, h, ref, watch, type PropType } from 'vue';
import {
  addMonths,
  buildCalendarDates,
  isControlled,
  isDateDisabled,
  isDateInRange,
  parseDateOnly,
  todayDateOnly,
  todayParts,
  type DateOnly,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export const Calendar = defineComponent({
  name: 'DuiCalendar',
  props: {
    modelValue: { type: String as PropType<DateOnly | null>, default: undefined },
    defaultValue: { type: String as PropType<DateOnly | null>, default: null },
    min: { type: String as PropType<DateOnly>, default: undefined },
    max: { type: String as PropType<DateOnly>, default: undefined },
    disabledDate: { type: Function as PropType<(date: DateOnly) => boolean>, default: undefined },
    rangeStart: { type: String as PropType<DateOnly | null>, default: null },
    rangeEnd: { type: String as PropType<DateOnly | null>, default: null },
  },
  emits: { 'update:modelValue': (_next: DateOnly) => true },
  setup(props, { emit }) {
    const uncontrolled = ref<DateOnly | null>(props.defaultValue);
    const current = () => (isControlled(props.modelValue) ? (props.modelValue ?? null) : uncontrolled.value);
    const parsed = parseDateOnly(current()) ?? parseDateOnly(props.rangeStart) ?? todayParts();
    const panel = ref({ year: parsed.year, month: parsed.month });

    watch(
      () => current(),
      (value) => {
        const next = parseDateOnly(value);
        if (next) panel.value = { year: next.year, month: next.month };
      },
    );

    return () => {
      const selected = current();
      const today = todayDateOnly();
      const cells = buildCalendarDates(panel.value.year, panel.value.month);
      const pick = (date: DateOnly) => {
        if (isDateDisabled(date, { min: props.min, max: props.max, disabledDate: props.disabledDate })) return;
        if (!isControlled(props.modelValue)) uncontrolled.value = date;
        emit('update:modelValue', date);
      };
      const shift = (delta: number) => {
        panel.value = addMonths(panel.value.year, panel.value.month, delta);
      };

      return h('div', { 'data-dui': 'calendar' }, [
        h('div', { 'data-part': 'header' }, [
          h('button', { type: 'button', 'aria-label': '上个月', onClick: () => shift(-1) }, '‹'),
          h('div', { 'data-part': 'caption' }, `${panel.value.year}年${panel.value.month}月`),
          h('button', { type: 'button', 'aria-label': '下个月', onClick: () => shift(1) }, '›'),
        ]),
        h('div', { 'data-part': 'grid', role: 'grid', 'aria-label': '日历' }, [
          ...WEEKDAYS.map((day) => h('span', { key: day, 'data-part': 'weekday' }, day)),
          ...cells.map((date, index) =>
            date
              ? h(
                  'button',
                  {
                    key: date,
                    type: 'button',
                    'data-part': 'day',
                    'data-selected': presence(date === selected || date === props.rangeStart || date === props.rangeEnd),
                    'data-today': presence(date === today),
                    'data-in-range': presence(isDateInRange(date, props.rangeStart, props.rangeEnd)),
                    'data-disabled': presence(
                      isDateDisabled(date, { min: props.min, max: props.max, disabledDate: props.disabledDate }),
                    ),
                    disabled: isDateDisabled(date, { min: props.min, max: props.max, disabledDate: props.disabledDate }),
                    onClick: () => pick(date),
                  },
                  parseDateOnly(date)?.day,
                )
              : h('span', { key: `empty-${index}` }),
          ),
        ]),
      ]);
    };
  },
});
