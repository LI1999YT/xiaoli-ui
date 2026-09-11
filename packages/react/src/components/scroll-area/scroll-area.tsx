import { type ReactNode, type UIEvent } from 'react';

export interface ScrollAreaProps {
  children?: ReactNode;
  height?: number | string;
  maxHeight?: number | string;
  onScrollPosition?: (next: { top: number; left: number }) => void;
}

export function ScrollArea({ children, height = 200, maxHeight, onScrollPosition }: ScrollAreaProps) {
  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    onScrollPosition?.({
      top: event.currentTarget.scrollTop,
      left: event.currentTarget.scrollLeft,
    });
  };

  return (
    <div data-dui="scroll-area">
      <div
        data-part="viewport"
        tabIndex={0}
        style={{ height, maxHeight }}
        onScroll={onScroll}
      >
        {children}
      </div>
    </div>
  );
}
