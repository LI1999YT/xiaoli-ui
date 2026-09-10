import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
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
import { DuiConfigContext, useDuiConfigOptional, type DuiConfig } from './context';

export interface ConfigProviderProps {
  theme?: ThemeConfig;
  locale?: LocaleConfig;
  dir?: Direction;
  density?: Density;
  size?: Size;
  unstyled?: boolean;
  motion?: MotionPreference;
  portalContainer?: HTMLElement | (() => HTMLElement | null);
  portalClassName?: string;
  initialMode?: 'light' | 'dark';
  children?: ReactNode;
}

const defaultTheme = defineTheme({ id: 'xiaoli-default', mode: 'light' });

export function ConfigProvider({
  theme,
  locale,
  dir,
  density,
  size,
  unstyled,
  motion,
  portalContainer,
  portalClassName,
  initialMode = 'light',
  children,
}: ConfigProviderProps) {
  const parent = useDuiConfigOptional();
  const toastStore = useMemo(() => parent?.toastStore ?? new ToastStore(), [parent]);
  const ownedToast = !parent;
  const [systemDark, setSystemDark] = useState(false);
  const [systemReady, setSystemReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  const resolvedTheme = useMemo(() => {
    try {
      return defineTheme(theme ?? { id: parent?.theme.id ?? 'xiaoli-default' }, parent?.theme);
    } catch (error) {
      console.warn('[xiaoli-ui] 主题解析失败，回退到上一有效配置', error);
      return parent?.theme ?? defaultTheme;
    }
  }, [theme, parent]);

  const mode = resolvedTheme.mode;
  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? (systemReady ? (systemDark ? 'dark' : 'light') : initialMode) : mode === 'dark' ? 'dark' : 'light';

  const appliedTheme = useMemo(() => {
    if (resolvedTheme.mode !== 'system') return resolvedTheme;
    return defineTheme({ id: resolvedTheme.id, mode: resolvedMode, tokens: resolvedTheme.tokens, components: resolvedTheme.components, density: resolvedTheme.density, radius: resolvedTheme.radius, motion: resolvedTheme.motion });
  }, [resolvedTheme, resolvedMode]);

  const config: DuiConfig = {
    theme: appliedTheme,
    resolvedMode,
    dir: dir ?? parent?.dir ?? 'ltr',
    density: density ?? appliedTheme.density,
    size: size ?? parent?.size ?? 'md',
    unstyled: unstyled ?? parent?.unstyled ?? false,
    motion: motion ?? appliedTheme.motion,
    locale: locale ?? parent?.locale ?? { locale: 'zh-CN' },
    portalHost,
    toastStore,
  };

  useEffect(() => {
    if (mode !== 'system') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemDark(media.matches);
    sync();
    setSystemReady(true);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [mode]);

  useEffect(() => {
    const doc = rootRef.current?.ownerDocument ?? document;
    const explicit = resolveContainer(portalContainer, null);
    const host = explicit ?? createPortalHost(doc);
    hostRef.current = host;
    setPortalHost(host);
    return () => {
      if (!explicit && host.parentNode) host.remove();
      hostRef.current = null;
      setPortalHost(null);
      if (ownedToast) toastStore.dispose();
    };
  }, [portalContainer, ownedToast, toastStore]);

  useEffect(() => {
    const vars = appliedTheme.cssVars;
    const dataset = {
      'data-dui-theme': appliedTheme.id,
      'data-mode': resolvedMode,
      'data-density': config.density,
      'data-motion': config.motion,
      dir: config.dir,
    };
    if (rootRef.current) applyThemeToHost(rootRef.current, vars, dataset);
    if (hostRef.current) {
      applyThemeToHost(hostRef.current, vars, dataset);
      if (portalClassName) hostRef.current.className = portalClassName;
    }
  }, [appliedTheme, resolvedMode, config.density, config.motion, config.dir, portalClassName]);

  const style = appliedTheme.cssVars as CSSProperties;

  return (
    <DuiConfigContext.Provider value={{ ...config, portalHost }}>
      <div
        ref={rootRef}
        data-dui="config-provider"
        data-part="root"
        data-dui-theme={appliedTheme.id}
        data-mode={resolvedMode}
        data-density={config.density}
        data-motion={config.motion}
        dir={config.dir}
        style={style}
      >
        {children}
      </div>
    </DuiConfigContext.Provider>
  );
}
