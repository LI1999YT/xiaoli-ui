import { useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { isControlled } from '@xiaoli-ui/internal-core';
import { presence } from '../../utils/dom';

export interface PullRefreshProps {
  refreshing?: boolean;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
  maxDistance?: number;
  disabled?: boolean;
  children?: ReactNode;
}

type PullState = 'idle' | 'pulling' | 'ready' | 'refreshing';

export function PullRefresh({
  refreshing,
  onRefresh,
  threshold = 64,
  maxDistance = 120,
  disabled = false,
  children,
}: PullRefreshProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const [distance, setDistance] = useState(0);
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const busy = isControlled(refreshing) ? Boolean(refreshing) : internalRefreshing;
  const state: PullState = busy ? 'refreshing' : distance >= threshold ? 'ready' : distance > 0 ? 'pulling' : 'idle';

  const finish = async () => {
    if (disabled || busy) return;
    if (!isControlled(refreshing)) setInternalRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      if (!isControlled(refreshing)) setInternalRefreshing(false);
      setDistance(0);
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    if (disabled || busy) return;
    const viewport = viewportRef.current;
    if (!viewport || viewport.scrollTop > 0) return;
    startY.current = event.touches[0]?.clientY ?? 0;
    pulling.current = true;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!pulling.current || disabled || busy) return;
    const viewport = viewportRef.current;
    if (viewport && viewport.scrollTop > 0) {
      pulling.current = false;
      setDistance(0);
      return;
    }
    const delta = (event.touches[0]?.clientY ?? 0) - startY.current;
    if (delta <= 0) {
      setDistance(0);
      return;
    }
    const damped = Math.min(maxDistance, delta * 0.55);
    setDistance(damped);
    if (damped > 8) event.preventDefault();
  };

  const onTouchEnd = () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (distance >= threshold) {
      void finish();
      return;
    }
    setDistance(0);
  };

  const label = state === 'refreshing' ? '刷新中…' : state === 'ready' ? '松开刷新' : state === 'pulling' ? '下拉刷新' : '下拉或点击刷新';

  return (
    <div data-dui="pull-refresh" data-refreshing={presence(busy)} data-state={state}>
      <div data-part="indicator" aria-live="polite">
        {label}
      </div>
      <button type="button" data-part="refreshButton" disabled={disabled || busy} onClick={() => void finish()}>
        {busy ? '刷新中…' : '刷新'}
      </button>
      <div
        ref={viewportRef}
        data-part="content"
        style={{ transform: distance || busy ? `translateY(${busy ? Math.min(threshold, maxDistance) : distance}px)` : undefined }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          pulling.current = false;
          if (!busy) setDistance(0);
        }}
      >
        {children}
      </div>
    </div>
  );
}
