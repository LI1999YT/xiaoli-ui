import { defineComponent, h, inject, onUnmounted, provide, ref, watch, type PropType } from 'vue';
import {
  FormStore,
  pathKey,
  required,
  minLength,
  type FieldPath,
  type FieldRule,
  type ValidateTrigger,
} from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { fieldKey, formKey, useConfigOptional } from '../../context';

export const Form = defineComponent({
  name: 'DuiForm',
  props: {
    values: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    defaultValues: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    validators: { type: Array as PropType<FieldRule<Record<string, unknown>>[]>, default: () => [] },
    validateTrigger: { type: String as PropType<ValidateTrigger>, default: 'blur' },
    preserve: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    submitHandler: { type: Function as PropType<(values: Record<string, unknown>, ctx: { signal: AbortSignal }) => void | Promise<void>>, default: undefined },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: {
    'update:values': (_values: Record<string, unknown>) => true,
    submit: (_values: Record<string, unknown>) => true,
    'submit-error': (_error: unknown) => true,
    reset: () => true,
  },
  setup(props, { emit, slots, expose }) {
    const config = useConfigOptional();
    const initial = props.defaultValues ?? props.values;
    if (!initial) throw new Error('[xiaoli-ui] Form 必须提供 defaultValues 或 values');
    const store = new FormStore({
      initialValues: initial,
      validators: props.validators,
      validateTrigger: props.validateTrigger,
      preserve: props.preserve,
      onValuesChange: (values) => emit('update:values', values),
    });
    const tick = ref(0);
    store.subscribe(() => {
      tick.value += 1;
    });

    watch(
      () => props.values,
      (values) => {
        if (values) store.setExternalValues(values);
      },
    );
    watch(
      () => props.validators,
      (validators) => {
        store.validators = [...(validators ?? [])];
      },
    );

    const ids = new Map<string, string>();
    provide(formKey, {
      store,
      get disabled() {
        return props.disabled;
      },
      getFieldId(path) {
        const key = pathKey(path);
        if (!ids.has(key)) ids.set(key, `dui-field-${ids.size}-${key.replaceAll('\u0000', '-')}`);
        return ids.get(key) as string;
      },
    });

    expose({
      validate: () => store.validate(),
      validateField: (path: FieldPath) => store.validateField(path, 'change'),
      setFieldValue: (path: FieldPath, value: unknown) => store.setFieldValue(path, value),
      setFieldError: (path: FieldPath, message?: string) => store.setFieldError(path, message),
      reset: () => {
        store.reset(props.values);
        emit('reset');
      },
      submit: () => store.submit(props.submitHandler),
    });

    return () => {
      void tick.value;
      return h(
        'form',
        {
          'data-dui': 'form',
          'data-part': 'root',
          'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false),
          noValidate: true,
          onSubmit: async (event: Event) => {
            event.preventDefault();
            if (props.disabled || store.submitting) return;
            const result = await store.submit(props.submitHandler);
            if (result.status === 'success') emit('submit', store.values);
            if (result.status === 'error') emit('submit-error', result.error);
          },
          onReset: (event: Event) => {
            event.preventDefault();
            store.reset(props.values);
            emit('reset');
          },
        },
        slots.default?.(),
      );
    };
  },
});

export const FormField = defineComponent({
  name: 'DuiFormField',
  props: {
    name: { type: Array as unknown as PropType<FieldPath>, required: true },
  },
  setup(props, { slots }) {
    const form = inject(formKey);
    if (!form) throw new Error('[xiaoli-ui] FormField 必须放在 Form 内');
    const tick = ref(0);
    const fieldMeta = { id: form.getFieldId(props.name), error: form.store.getFieldState(props.name).error };
    provide(fieldKey, fieldMeta);
    form.store.subscribe(() => {
      tick.value += 1;
      fieldMeta.error = form.store.getFieldState(props.name).error;
    });
    onUnmounted(() => form.store.unregister(props.name));

    return () => {
      void tick.value;
      const state = form.store.getFieldState(props.name);
      const id = form.getFieldId(props.name);
      const field = {
        value: state.value,
        id,
        invalid: state.invalid,
        disabled: form.disabled,
        inputProps: {
          modelValue: String(state.value ?? ''),
          id,
          invalid: state.invalid,
          disabled: form.disabled,
          'onUpdate:modelValue': (next: string) => form.store.setFieldValue(props.name, next),
          onBlur: () => {
            form.store.markTouched(props.name);
            if (form.store.validateTrigger !== 'submit') void form.store.validateField(props.name, 'blur');
          },
        },
        checkboxProps: {
          modelValue: Boolean(state.value),
          id,
          disabled: form.disabled,
          'onUpdate:modelValue': (next: boolean) => form.store.setFieldValue(props.name, next),
        },
      };
      return h('div', { 'data-part': 'field' }, slots.default?.({ field, state }));
    };
  },
});

export const FormLabel = defineComponent({
  name: 'DuiFormLabel',
  setup(_, { slots }) {
    return () => h('label', { 'data-part': 'label' }, slots.default?.());
  },
});

export const FormControl = defineComponent({
  name: 'DuiFormControl',
  setup(_, { slots }) {
    return () => h('div', { 'data-part': 'control' }, slots.default?.());
  },
});

export const FormDescription = defineComponent({
  name: 'DuiFormDescription',
  setup(_, { slots }) {
    return () => h('div', { 'data-part': 'description' }, slots.default?.());
  },
});

export const FormError = defineComponent({
  name: 'DuiFormError',
  setup(_, { slots }) {
    const field = inject(fieldKey, null);
    return () => {
      const extra = slots.default?.();
      const message = extra ? undefined : field?.error;
      if (!extra && !message) return null;
      return h('div', { 'data-part': 'error', id: field ? `${field.id}-error` : undefined, role: 'alert' }, extra ?? message);
    };
  },
});

export const FormActions = defineComponent({
  name: 'DuiFormActions',
  setup(_, { slots }) {
    return () => h('div', { 'data-part': 'actions' }, slots.default?.());
  },
});

export { required, minLength };
