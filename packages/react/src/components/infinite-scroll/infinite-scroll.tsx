import { type ReactNode } from 'react';
export function InfiniteScroll({ onLoadMore, hasMore = true, children }: { onLoadMore?: () => void; hasMore?: boolean; children?: ReactNode; }) {
  return <div data-dui="infinite-scroll">{children}{hasMore ? <button type="button" onClick={onLoadMore}>加载更多</button> : <span>没有更多了</span>}</div>;
}
