import type { HTMLAttributes, ReactNode } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface EmptyProps
  extends StyledParts<'root' | 'illustration' | 'title' | 'description' | 'action'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'> {
  title?: string;
  description?: string;
  size?: 'compact' | 'normal';
  children?: ReactNode;
}

export function Empty({
  title = '暂无数据',
  description,
  size = 'normal',
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: EmptyProps) {
  const config = useDuiConfigOptional();
  return (
    <div
      {...rest}
      data-dui="empty"
      data-size={size}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
      {...partProps('root', classNames, styles)}
    >
      <div data-part="illustration" className={classNames?.illustration} style={styles?.illustration} aria-hidden>
        ✿
      </div>
      <div data-part="title" className={classNames?.title} style={styles?.title}>
        {title}
      </div>
      {description ? (
        <div data-part="description" className={classNames?.description} style={styles?.description}>
          {description}
        </div>
      ) : null}
      {children ? (
        <div data-part="action" className={classNames?.action} style={styles?.action}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
