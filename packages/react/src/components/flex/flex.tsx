import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { isResponsiveObject, resolveSpace, type Responsive } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export type FlexDirection = 'row' | 'column';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type FlexPart = 'root';
export type FlexTag = 'div' | 'section' | 'nav' | 'main';

export interface FlexProps extends StyledParts<FlexPart>, Omit<HTMLAttributes<HTMLElement>, 'className' | 'style'> {
  direction?: Responsive<FlexDirection>;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: number | string | Responsive<number | string>;
  wrap?: boolean;
  as?: FlexTag;
  children?: ReactNode;
}

export function Flex({
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 0,
  wrap = false,
  as = 'div',
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: FlexProps) {
  const config = useDuiConfigOptional();
  const Component = as as ElementType;
  const isUnstyled = unstyled ?? config?.unstyled ?? false;
  const directionAttrs: Record<string, string> = {};
  if (isResponsiveObject(direction)) {
    for (const [bp, value] of Object.entries(direction)) {
      if (value) directionAttrs[`data-direction-${bp}`] = value;
    }
  } else {
    directionAttrs['data-direction-base'] = direction;
  }

  const gapValue = isResponsiveObject(gap) ? resolveSpace(gap.base ?? 0) : resolveSpace(gap);

  return (
    <Component
      {...rest}
      {...partProps('root', classNames, styles)}
      data-dui="flex"
      data-align={align}
      data-justify={justify}
      data-wrap={presence(wrap)}
      data-unstyled={presence(isUnstyled)}
      className={cx(classNames?.root, className)}
      style={{
        ...styles?.root,
        ...style,
        ['--dui-flex-gap' as string]: gapValue,
      }}
      {...directionAttrs}
    >
      {children}
    </Component>
  );
}
