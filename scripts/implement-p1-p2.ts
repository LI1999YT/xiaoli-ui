import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function write(rel: string, contents: string) {
  const file = path.join(root, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents);
}

const files: Record<string, string> = {};

function add(rel: string, contents: string) {
  files[rel] = contents.endsWith('\n') ? contents : `${contents}\n`;
}

add(
  'packages/react/src/components/alert/alert.tsx',
  `import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface AlertProps extends StyledParts<'root' | 'title' | 'closeButton'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'> {
  status?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  closable?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (next: boolean) => void;
  children?: ReactNode;
}

export function Alert({
  status = 'info',
  title,
  closable = false,
  visible,
  defaultVisible = true,
  onVisibleChange,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: AlertProps) {
  const config = useDuiConfigOptional();
  const [uncontrolled, setUncontrolled] = useState(defaultVisible);
  const shown = isControlled(visible) ? Boolean(visible) : uncontrolled;
  if (!shown) return null;
  return (
    <div
      {...rest}
      role="alert"
      data-dui="alert"
      data-status={status}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      <div>
        {title ? <strong data-part="title">{title}</strong> : null}
        <div data-part="body">{children}</div>
      </div>
      {closable ? (
        <button
          type="button"
          aria-label="关闭"
          data-part="closeButton"
          onClick={() => {
            if (!isControlled(visible)) setUncontrolled(false);
            onVisibleChange?.(false);
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
`,
);

add(
  'packages/vue/src/components/alert/alert.ts',
  `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Alert = defineComponent({
  name: 'DuiAlert',
  props: {
    status: { type: String as PropType<'info' | 'success' | 'warning' | 'error'>, default: 'info' },
    title: { type: String, default: undefined },
    closable: { type: Boolean, default: false },
    visible: { type: Boolean, default: undefined },
    defaultVisible: { type: Boolean, default: true },
    unstyled: { type: Boolean, default: undefined },
  },
  emits: { 'update:visible': (_next: boolean) => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultVisible);
    return () => {
      const shown = isControlled(props.visible) ? Boolean(props.visible) : uncontrolled.value;
      if (!shown) return null;
      return h('div', { role: 'alert', 'data-dui': 'alert', 'data-part': 'root', 'data-status': props.status, 'data-unstyled': presence(props.unstyled ?? config?.unstyled ?? false) }, [
        h('div', [props.title ? h('strong', { 'data-part': 'title' }, props.title) : null, h('div', { 'data-part': 'body' }, slots.default?.())]),
        props.closable
          ? h('button', { type: 'button', 'aria-label': '关闭', 'data-part': 'closeButton', onClick: () => { if (!isControlled(props.visible)) uncontrolled.value = false; emit('update:visible', false); } }, '×')
          : null,
      ]);
    };
  },
});
`,
);

add(
  'packages/react/src/components/tag/tag.tsx',
  `import { useState, type ReactNode } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Tag({
  variant = 'soft',
  color = 'neutral',
  size = 'md',
  closable,
  checkable,
  checked,
  defaultChecked = false,
  onClose,
  onCheckedChange,
  children,
}: {
  variant?: 'solid' | 'soft' | 'outline';
  color?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  closable?: boolean;
  checkable?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onClose?: () => void;
  onCheckedChange?: (next: boolean) => void;
  children?: ReactNode;
}) {
  const config = useDuiConfigOptional();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const current = isControlled(checked) ? Boolean(checked) : uncontrolled;
  return (
    <span
      data-dui="tag"
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-checked={presence(checkable && current)}
      data-unstyled={presence(config?.unstyled ?? false)}
      onClick={() => {
        if (!checkable) return;
        const next = !current;
        if (!isControlled(checked)) setUncontrolled(next);
        onCheckedChange?.(next);
      }}
    >
      {children}
      {closable ? (
        <button type="button" aria-label="删除" data-part="close" onClick={(event) => { event.stopPropagation(); onClose?.(); }}>
          ×
        </button>
      ) : null}
    </span>
  );
}
`,
);

add(
  'packages/vue/src/components/tag/tag.ts',
  `import { defineComponent, h, ref, type PropType } from 'vue';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils';
import { useConfigOptional } from '../../context';

export const Tag = defineComponent({
  name: 'DuiTag',
  props: {
    variant: { type: String as PropType<'solid' | 'soft' | 'outline'>, default: 'soft' },
    color: { type: String, default: 'neutral' },
    size: { type: String as PropType<'sm' | 'md'>, default: 'md' },
    closable: { type: Boolean, default: false },
    checkable: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: false },
  },
  emits: { 'update:modelValue': (_next: boolean) => true, close: () => true },
  setup(props, { emit, slots }) {
    const config = useConfigOptional();
    const uncontrolled = ref(props.defaultChecked);
    return () => {
      const current = isControlled(props.modelValue) ? Boolean(props.modelValue) : uncontrolled.value;
      return h('span', {
        'data-dui': 'tag',
        'data-part': 'root',
        'data-variant': props.variant,
        'data-color': props.color,
        'data-size': props.size,
        'data-checked': presence(props.checkable && current),
        'data-unstyled': presence(config?.unstyled ?? false),
        onClick: () => {
          if (!props.checkable) return;
          const next = !current;
          if (!isControlled(props.modelValue)) uncontrolled.value = next;
          emit('update:modelValue', next);
        },
      }, [
        slots.default?.(),
        props.closable ? h('button', { type: 'button', 'aria-label': '删除', 'data-part': 'close', onClick: (event: MouseEvent) => { event.stopPropagation(); emit('close'); } }, '×') : null,
      ]);
    };
  },
});
`,
);

add(
  'packages/react/src/components/avatar/avatar.tsx',
  `import { useState, type ReactNode } from 'react';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  shape = 'circle',
}: {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}) {
  const config = useDuiConfigOptional();
  const [failed, setFailed] = useState(false);
  const initials = (name ?? '').trim().slice(0, 1) || '?';
  return (
    <span data-dui="avatar" data-size={size} data-shape={shape} data-unstyled={presence(config?.unstyled ?? false)}>
      {src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} /> : <span data-part="fallback">{initials}</span>}
    </span>
  );
}

export function AvatarGroup({ max = 5, children }: { max?: number; children?: ReactNode }) {
  const items = Array.isArray(children) ? children : children ? [children] : [];
  const extra = items.length - max;
  return (
    <span data-dui="avatar-group">
      {items.slice(0, max)}
      {extra > 0 ? <span data-dui="avatar" data-part="overflow">+{extra}</span> : null}
    </span>
  );
}
`,
);

add(
  'packages/vue/src/components/avatar/avatar.ts',
  `import { defineComponent, h, ref } from 'vue';
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
      return h('span', { 'data-dui': 'avatar-group' }, [...items.slice(0, props.max), items.length > props.max ? h('span', { 'data-dui': 'avatar', 'data-part': 'overflow' }, \`+\${items.length - props.max}\`) : null]);
    };
  },
});
`,
);

add(
  'packages/react/src/components/image/image.tsx',
  `import { useState } from 'react';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Image({
  src,
  alt,
  width,
  height,
  fit = 'cover',
  loading = 'lazy',
  fallbackSrc,
  aspectRatio,
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  loading?: 'eager' | 'lazy';
  fallbackSrc?: string;
  aspectRatio?: string | number;
}) {
  const config = useDuiConfigOptional();
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  return (
    <span data-dui="image" data-fit={fit} data-unstyled={presence(config?.unstyled ?? false)} style={{ width, height, aspectRatio }}>
      {failed && !fallbackSrc ? <span data-part="fallback">图片加载失败</span> : (
        <img
          src={current}
          alt={alt}
          loading={loading}
          onError={() => {
            if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
            else setFailed(true);
          }}
        />
      )}
    </span>
  );
}
`,
);

add(
  'packages/vue/src/components/image/image.ts',
  `import { defineComponent, h, ref, watch, type PropType } from 'vue';
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
`,
);

async function main() {
  for (const [rel, contents] of Object.entries(files)) {
    await write(rel, contents);
  }
  console.log(`wrote ${Object.keys(files).length} files`);
}

void main();
