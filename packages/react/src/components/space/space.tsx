import { Children, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { resolveSpace } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export interface SpaceProps extends StyledParts<'root'>, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  direction?: 'horizontal' | 'vertical';
  size?: number | string;
  wrap?: boolean;
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  split?: ReactNode;
  children?: ReactNode;
}

export function Space({
  direction = 'horizontal',
  size = 2,
  wrap = false,
  align = 'center',
  split,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: SpaceProps) {
  const config = useDuiConfigOptional();
  const items = Children.toArray(children).filter((child) => child != null);
  return (
    <div
      {...rest}
      data-dui="space"
      data-direction={direction}
      data-wrap={presence(wrap)}
      data-align={align}
      data-unstyled={presence(unstyled ?? config?.unstyled ?? false)}
      className={cx(classNames?.root, className)}
      style={{ ...styles?.root, ...style, ['--dui-space-gap' as string]: resolveSpace(size) }}
      {...partProps('root', classNames, styles)}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && split ? <span data-part="split">{split}</span> : null}
          <div data-part="item">{child}</div>
        </Fragment>
      ))}
    </div>
  );
}
