import { useState, type ReactNode } from 'react';
import { presence } from '../../utils/dom';
export function PullRefresh({ onRefresh, children }: { onRefresh?: () => Promise<void> | void; children?: ReactNode; }) {
  const [refreshing, setRefreshing] = useState(false);
  return <div data-dui="pull-refresh" data-refreshing={presence(refreshing)}><button type="button" onClick={async () => { setRefreshing(true); await onRefresh?.(); setRefreshing(false); }}>{refreshing ? '刷新中…' : '下拉刷新'}</button>{children}</div>;
}
