import { deletePath, getPath, pathKey, setPath, type FieldPath } from './path';

export type ValidateTrigger = 'blur' | 'change' | 'submit';

export interface ValidationContext<T> {
  values: Readonly<T>;
  signal: AbortSignal;
  trigger: ValidateTrigger;
}

export type ValidationResult = string | undefined;
export type Validator<V, T> = (
  value: V,
  context: ValidationContext<T>,
) => ValidationResult | Promise<ValidationResult>;

export interface FieldRule<T> {
  path: FieldPath;
  validators: readonly Validator<unknown, T>[];
}

export interface FieldError {
  path: FieldPath;
  message: string;
}

export interface FieldState {
  value: unknown;
  error?: string;
  touched: boolean;
  dirty: boolean;
  pending: boolean;
  invalid: boolean;
}

export interface SubmitResult {
  status: 'success' | 'invalid' | 'error' | 'aborted';
  error?: unknown;
}

export interface FormStoreOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validators?: readonly FieldRule<T>[];
  validateTrigger?: ValidateTrigger;
  preserve?: boolean;
  onValuesChange?: (values: T) => void;
}

export class FormStore<T extends Record<string, unknown>> {
  values: T;
  initialValues: T;
  errors = new Map<string, string>();
  touched = new Set<string>();
  dirty = new Set<string>();
  pending = new Set<string>();
  submitting = false;
  version = 0;
  validateTrigger: ValidateTrigger;
  preserve: boolean;
  validators: FieldRule<T>[];
  private versions = new Map<string, number>();
  private controllers = new Map<string, AbortController>();
  private listeners = new Set<() => void>();
  private onValuesChange?: (values: T) => void;
  private submitVersion = 0;

  constructor(options: FormStoreOptions<T>) {
    this.initialValues = structuredClone(options.initialValues);
    this.values = structuredClone(options.initialValues);
    this.validators = [...(options.validators ?? [])];
    this.validateTrigger = options.validateTrigger ?? 'blur';
    this.preserve = options.preserve ?? true;
    this.onValuesChange = options.onValuesChange;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.version += 1;
    for (const listener of this.listeners) listener();
  }

  setOnValuesChange(handler?: (values: T) => void): void {
    this.onValuesChange = handler;
  }

  setExternalValues(values: T): void {
    this.values = values;
    this.notify();
  }

  getFieldState(path: FieldPath): FieldState {
    const key = pathKey(path);
    const error = this.errors.get(key);
    return {
      value: getPath(this.values, path),
      error,
      touched: this.touched.has(key),
      dirty: this.dirty.has(key),
      pending: this.pending.has(key),
      invalid: Boolean(error),
    };
  }

  setFieldValue(path: FieldPath, value: unknown, options?: { notify?: boolean }): void {
    this.values = setPath(this.values, path, value);
    const key = pathKey(path);
    this.dirty.add(key);
    if (options?.notify !== false) {
      this.onValuesChange?.(this.values);
    }
    this.notify();
    if (this.touched.has(key) && this.errors.has(key) && this.validateTrigger !== 'submit') {
      void this.validateField(path, 'change');
    }
  }

  setFieldError(path: FieldPath, message?: string): void {
    const key = pathKey(path);
    if (message) this.errors.set(key, message);
    else this.errors.delete(key);
    this.notify();
  }

  markTouched(path: FieldPath): void {
    this.touched.add(pathKey(path));
    this.notify();
  }

  unregister(path: FieldPath): void {
    if (this.preserve) return;
    this.values = deletePath(this.values, path);
    const key = pathKey(path);
    this.errors.delete(key);
    this.touched.delete(key);
    this.dirty.delete(key);
    this.abortField(path);
    this.onValuesChange?.(this.values);
    this.notify();
  }

  private abortField(path: FieldPath): void {
    const key = pathKey(path);
    this.controllers.get(key)?.abort();
    this.controllers.delete(key);
    this.pending.delete(key);
    this.versions.set(key, (this.versions.get(key) ?? 0) + 1);
  }

  private rulesFor(path: FieldPath): Validator<unknown, T>[] {
    const key = pathKey(path);
    return this.validators.filter((rule) => pathKey(rule.path) === key).flatMap((rule) => [...rule.validators]);
  }

  async validateField(path: FieldPath, trigger: ValidateTrigger): Promise<string | undefined> {
    const key = pathKey(path);
    const version = (this.versions.get(key) ?? 0) + 1;
    this.versions.set(key, version);
    this.controllers.get(key)?.abort();
    const controller = new AbortController();
    this.controllers.set(key, controller);
    this.pending.add(key);
    this.notify();

    try {
      for (const validator of this.rulesFor(path)) {
        const result = await validator(getPath(this.values, path), {
          values: this.values,
          signal: controller.signal,
          trigger,
        });
        if (this.versions.get(key) !== version) return undefined;
        if (result) {
          this.errors.set(key, result);
          this.pending.delete(key);
          this.notify();
          return result;
        }
      }
      if (this.versions.get(key) !== version) return undefined;
      this.errors.delete(key);
      this.pending.delete(key);
      this.notify();
      return undefined;
    } catch (error) {
      if (this.versions.get(key) !== version) return undefined;
      this.pending.delete(key);
      this.notify();
      throw error;
    }
  }

  async validate(): Promise<{ valid: boolean; errors: FieldError[] }> {
    const paths = this.validators.map((rule) => rule.path);
    const unique = [...new Map(paths.map((path) => [pathKey(path), path])).values()];
    await Promise.all(unique.map((path) => this.validateField(path, 'submit')));
    const errors: FieldError[] = [...this.errors.entries()].map(([key, message]) => ({
      path: key.split('\u0000'),
      message,
    }));
    return { valid: errors.length === 0, errors };
  }

  reset(next?: T): void {
    for (const controller of this.controllers.values()) controller.abort();
    this.controllers.clear();
    this.pending.clear();
    this.errors.clear();
    this.touched.clear();
    this.dirty.clear();
    this.submitting = false;
    this.values = structuredClone(next ?? this.initialValues);
    this.onValuesChange?.(this.values);
    this.notify();
  }

  async submit(handler?: (values: T, context: { signal: AbortSignal }) => void | Promise<void>): Promise<SubmitResult> {
    if (this.submitting) {
      return { status: 'aborted' };
    }
    const version = ++this.submitVersion;
    this.submitting = true;
    this.notify();
    const controller = new AbortController();
    try {
      const { valid } = await this.validate();
      if (version !== this.submitVersion) return { status: 'aborted' };
      if (!valid) return { status: 'invalid' };
      await handler?.(this.values, { signal: controller.signal });
      if (version !== this.submitVersion) return { status: 'aborted' };
      return { status: 'success' };
    } catch (error) {
      return { status: 'error', error };
    } finally {
      if (version === this.submitVersion) {
        this.submitting = false;
        this.notify();
      }
    }
  }
}

export function required(message = '必填'): Validator<unknown, Record<string, unknown>> {
  return (value) => {
    if (value === undefined || value === null || value === '' || value === false) return message;
    if (Array.isArray(value) && value.length === 0) return message;
    return undefined;
  };
}

export function minLength(min: number, message?: string): Validator<unknown, Record<string, unknown>> {
  return (value) => {
    if (typeof value !== 'string') return undefined;
    if (value.length < min) return message ?? `至少 ${min} 个字符`;
    return undefined;
  };
}
