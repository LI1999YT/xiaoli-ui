import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  FormStore,
  pathKey,
  type FieldPath,
  type FieldRule,
  type FieldState,
  type SubmitResult,
  type ValidateTrigger,
} from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

interface FormContextValue<T extends Record<string, unknown>> {
  store: FormStore<T>;
  disabled: boolean;
  getFieldId: (path: FieldPath) => string;
}

const FormCtx = createContext<FormContextValue<Record<string, unknown>> | null>(null);
const FieldCtx = createContext<{
  path: FieldPath;
  id: string;
  state: FieldState;
  describedBy?: string;
} | null>(null);

export interface FormProps<T extends Record<string, unknown>> extends StyledParts<'root'> {
  values?: T;
  defaultValues?: T;
  validators?: readonly FieldRule<T>[];
  validateTrigger?: ValidateTrigger;
  preserve?: boolean;
  disabled?: boolean;
  onValuesChange?: (values: T) => void;
  onSubmit?: (values: T, context: { signal: AbortSignal }) => void | Promise<void>;
  onSubmitError?: (error: unknown) => void;
  onReset?: () => void;
  children?: ReactNode;
}

export interface FormHandle<T extends Record<string, unknown>> {
  validate: () => Promise<{ valid: boolean }>;
  validateField: (path: FieldPath) => Promise<string | undefined>;
  setFieldValue: (path: FieldPath, value: unknown) => void;
  setFieldError: (path: FieldPath, message?: string) => void;
  reset: () => void;
  submit: () => Promise<SubmitResult>;
  focusField: (path: FieldPath) => void;
  getValues: () => T;
}

function useFormStore<T extends Record<string, unknown>>(
  defaultValues: T,
  validators: readonly FieldRule<T>[] | undefined,
  validateTrigger: ValidateTrigger | undefined,
  preserve: boolean | undefined,
): FormStore<T> {
  const storeRef = useRef<FormStore<T> | null>(null);
  if (!storeRef.current) {
    storeRef.current = new FormStore({
      initialValues: defaultValues,
      validators,
      validateTrigger,
      preserve,
    });
  }
  return storeRef.current;
}

export const Form = forwardRef(function Form<T extends Record<string, unknown>>(
  {
    values,
    defaultValues,
    validators,
    validateTrigger = 'blur',
    preserve = true,
    disabled = false,
    onValuesChange,
    onSubmit,
    onSubmitError,
    onReset,
    children,
    className,
    style,
    classNames,
    styles,
    unstyled,
  }: FormProps<T>,
  ref: ForwardedRef<FormHandle<T>>,
) {
  const config = useDuiConfigOptional();
  const initial = defaultValues ?? values;
  if (!initial) {
    throw new Error('[xiaoli-ui] Form 必须提供 defaultValues 或 values');
  }
  const store = useFormStore(initial, validators, validateTrigger, preserve);
  useSyncExternalStore(store.subscribe.bind(store), () => store.version, () => store.version);
  useEffect(() => {
    store.validators = [...(validators ?? [])];
    store.validateTrigger = validateTrigger;
    store.preserve = preserve;
    store.setOnValuesChange(onValuesChange);
  }, [store, validators, validateTrigger, preserve, onValuesChange]);

  useEffect(() => {
    if (values) store.setExternalValues(values);
  }, [store, values]);

  const ids = useRef(new Map<string, string>());
  const uid = useId();

  const ctx = useMemo<FormContextValue<T>>(
    () => ({
      store,
      disabled,
      getFieldId: (path) => {
        const key = pathKey(path);
        if (!ids.current.has(key)) ids.current.set(key, `${uid}-${key.replaceAll('\u0000', '-')}`);
        return ids.current.get(key) as string;
      },
    }),
    [store, disabled, uid],
  );

  useImperativeHandle(ref, () => ({
    validate: () => store.validate(),
    validateField: (path) => store.validateField(path, 'change'),
    setFieldValue: (path, value) => store.setFieldValue(path, value),
    setFieldError: (path, message) => store.setFieldError(path, message),
    reset: () => {
      store.reset(values);
      onReset?.();
    },
    submit: () => store.submit(onSubmit),
    focusField: (path) => {
      document.getElementById(ctx.getFieldId(path))?.focus();
    },
    getValues: () => store.values,
  }));

  return (
    <FormCtx.Provider value={ctx as FormContextValue<Record<string, unknown>>}>
      <form
        data-dui="form"
        data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
        noValidate
        className={cx(classNames?.root, className)}
        style={{ ...styles?.root, ...style }}
        {...partProps('root', classNames, styles)}
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (disabled || store.submitting) return;
          const result = await store.submit(onSubmit);
          if (result.status === 'error') onSubmitError?.(result.error);
          if (result.status === 'invalid') {
            const first = store.errors.keys().next().value;
            if (first) document.getElementById(`${uid}-${first.replaceAll('\u0000', '-')}`)?.focus();
          }
        }}
        onReset={(event) => {
          event.preventDefault();
          store.reset(values);
          onReset?.();
        }}
      >
        {children}
      </form>
    </FormCtx.Provider>
  );
}) as <T extends Record<string, unknown>>(
  props: FormProps<T> & { ref?: Ref<FormHandle<T>> },
) => ReactElement;

function useForm() {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error('[xiaoli-ui] Form 子组件必须放在 Form 内');
  return ctx;
}

export interface FormFieldProps extends StyledParts<'field'> {
  name: FieldPath;
  children?: ReactNode | ((ctx: { field: FieldBind; state: FieldState }) => ReactNode);
}

export interface FieldBind {
  value: unknown;
  onValueChange: (next: unknown) => void;
  onBlur: () => void;
  id: string;
  invalid: boolean;
  disabled: boolean;
  inputProps: {
    value: string;
    onValueChange: (next: string) => void;
    onBlur: () => void;
    id: string;
    invalid: boolean;
    disabled: boolean;
  };
  checkboxProps: {
    checked: boolean;
    onCheckedChange: (next: boolean) => void;
    id: string;
    disabled: boolean;
  };
}

export function FormField({ name, children, className, style, classNames, styles }: FormFieldProps) {
  const form = useForm();
  useSyncExternalStore(form.store.subscribe.bind(form.store), () => form.store.version, () => form.store.version);
  const state = form.store.getFieldState(name);
  const id = form.getFieldId(name);
  const errorId = `${id}-error`;
  const field: FieldBind = {
    value: state.value,
    onValueChange: (next) => form.store.setFieldValue(name, next),
    onBlur: () => {
      form.store.markTouched(name);
      if (form.store.validateTrigger !== 'submit') void form.store.validateField(name, 'blur');
    },
    id,
    invalid: state.invalid,
    disabled: form.disabled,
    inputProps: {
      value: String(state.value ?? ''),
      onValueChange: (next) => form.store.setFieldValue(name, next),
      onBlur: () => {
        form.store.markTouched(name);
        if (form.store.validateTrigger !== 'submit') void form.store.validateField(name, 'blur');
      },
      id,
      invalid: state.invalid,
      disabled: form.disabled,
    },
    checkboxProps: {
      checked: Boolean(state.value),
      onCheckedChange: (next) => form.store.setFieldValue(name, next),
      id,
      disabled: form.disabled,
    },
  };

  useEffect(() => () => form.store.unregister(name), [form, name]);

  return (
    <FieldCtx.Provider value={{ path: name, id, state, describedBy: state.error ? errorId : undefined }}>
      <div data-part="field" className={cx(classNames?.field, className)} style={{ ...styles?.field, ...style }}>
        {typeof children === 'function' ? children({ field, state }) : children}
      </div>
    </FieldCtx.Provider>
  );
}

export function FormLabel({ children, className, style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  const field = useContext(FieldCtx);
  return (
    <label data-part="label" htmlFor={field?.id} className={className} style={style}>
      {children}
    </label>
  );
}

export function FormControl({ children }: { children?: ReactNode }) {
  return <div data-part="control">{children}</div>;
}

export function FormDescription({ children }: { children?: ReactNode }) {
  return <div data-part="description">{children}</div>;
}

export function FormError({ children }: { children?: ReactNode }) {
  const field = useContext(FieldCtx);
  const message = children ?? field?.state.error;
  if (!message) return null;
  return (
    <div data-part="error" id={field ? `${field.id}-error` : undefined} role="alert">
      {message}
    </div>
  );
}

export function FormActions({ children }: { children?: ReactNode }) {
  return <div data-part="actions">{children}</div>;
}

export { required, minLength } from '@xiaoli-ui/internal-core';
