import { defineComponent, h, markRaw, onMounted, onUnmounted, provide, ref, shallowReactive, watch, type PropType } from 'vue';
import {
  defineTheme,
  type Density,
  type Direction,
  type LocaleConfig,
  type MotionPreference,
  type Size,
  type ThemeConfig,
} from '@xiaoli-ui/tokens';
import { ToastStore } from '@xiaoli-ui/internal-core';
import { applyThemeToHost, createPortalHost, resolveContainer } from '@xiaoli-ui/internal-dom';
import { configKey, useConfigOptional, type DuiConfig } from '../../context';

const fallback = defineTheme({ id: 'xiaoli-default', mode: 'light' });

export const ConfigProvider = defineComponent({
  name: 'DuiConfigProvider',
  props: {
    theme: { type: Object as PropType<ThemeConfig>, default: undefined },
    locale: { type: Object as PropType<LocaleConfig>, default: undefined },
    dir: { type: String as PropType<Direction>, default: undefined },
    density: { type: String as PropType<Density>, default: undefined },
    size: { type: String as PropType<Size>, default: undefined },
    unstyled: { type: Boolean, default: undefined },
    motion: { type: String as PropType<MotionPreference>, default: undefined },
    portalContainer: { type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement | null)>, default: undefined },
    portalClassName: { type: String, default: undefined },
    initialMode: { type: String as PropType<'light' | 'dark'>, default: 'light' },
  },
  setup(props, { slots }) {
    const parent = useConfigOptional();
    const toastStore = parent?.toastStore ?? new ToastStore();
    const root = ref<HTMLElement | null>(null);
    const host = ref<HTMLElement | null>(null);
    const systemDark = ref(false);
    const systemReady = ref(false);

    const state = shallowReactive<DuiConfig>({
      theme: parent?.theme ?? fallback,
      resolvedMode: 'light',
      dir: 'ltr',
      density: 'comfortable',
      size: 'md',
      unstyled: false,
      motion: 'system',
      locale: { locale: 'zh-CN' },
      portalHost: null,
      toastStore: markRaw(toastStore),
    });

    const sync = () => {
      let theme;
      try {
        theme = defineTheme(props.theme ?? { id: parent?.theme.id ?? 'xiaoli-default' }, parent?.theme);
      } catch (error) {
        console.warn('[xiaoli-ui] 主题解析失败，回退到上一有效配置', error);
        theme = parent?.theme ?? fallback;
      }
      const resolvedMode =
        theme.mode === 'system'
          ? systemReady.value
            ? systemDark.value
              ? 'dark'
              : 'light'
            : props.initialMode
          : theme.mode === 'dark'
            ? 'dark'
            : 'light';
      const applied =
        theme.mode === 'system'
          ? defineTheme({
              id: theme.id,
              mode: resolvedMode,
              tokens: theme.tokens,
              components: theme.components,
              density: theme.density,
              radius: theme.radius,
              motion: theme.motion,
            })
          : theme;
      state.theme = applied;
      state.resolvedMode = resolvedMode;
      state.dir = props.dir ?? parent?.dir ?? 'ltr';
      state.density = props.density ?? applied.density;
      state.size = props.size ?? parent?.size ?? 'md';
      state.unstyled = props.unstyled ?? parent?.unstyled ?? false;
      state.motion = props.motion ?? applied.motion;
      state.locale = props.locale ?? parent?.locale ?? { locale: 'zh-CN' };
      state.portalHost = host.value;

      const dataset = {
        'data-dui-theme': applied.id,
        'data-mode': resolvedMode,
        'data-density': state.density,
        'data-motion': state.motion,
        dir: state.dir,
      };
      if (root.value) applyThemeToHost(root.value, applied.cssVars, dataset);
      if (host.value) {
        applyThemeToHost(host.value, applied.cssVars, dataset);
        if (props.portalClassName) host.value.className = props.portalClassName;
      }
    };

    provide(configKey, state);
    watch(() => [props.theme, props.dir, props.density, props.size, props.unstyled, props.motion, props.locale, systemDark.value, systemReady.value], sync, {
      deep: true,
      immediate: true,
    });

    let media: MediaQueryList | undefined;
    const onMedia = () => {
      if (!media) return;
      systemDark.value = media.matches;
      systemReady.value = true;
    };

    onMounted(() => {
      const doc = root.value?.ownerDocument ?? document;
      const explicit = resolveContainer(props.portalContainer, null);
      host.value = explicit ?? createPortalHost(doc);
      state.portalHost = host.value;
      if (state.theme.mode === 'system') {
        media = window.matchMedia('(prefers-color-scheme: dark)');
        onMedia();
        media.addEventListener('change', onMedia);
      }
      sync();
    });

    onUnmounted(() => {
      media?.removeEventListener('change', onMedia);
      if (host.value && !props.portalContainer) host.value.remove();
      if (!parent) toastStore.dispose();
    });

    return () =>
      h(
        'div',
        {
          ref: root,
          'data-dui': 'config-provider',
          'data-part': 'root',
          'data-dui-theme': state.theme.id,
          'data-mode': state.resolvedMode,
          'data-density': state.density,
          'data-motion': state.motion,
          dir: state.dir,
          style: state.theme.cssVars,
        },
        slots.default?.(),
      );
  },
});
