import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { resolveSpace } from '@xiaoli-ui/internal-core';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export type CardVariant = 'elevated' | 'outlined' | 'plain';
export type CardPart = 'root' | 'cover' | 'header' | 'title' | 'extra' | 'body' | 'footer';
export type CardTag = 'div' | 'section' | 'article';

export interface CardProps extends StyledParts<CardPart>, Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'title'> {
  variant?: CardVariant;
  padding?: number | string;
  hoverable?: boolean;
  as?: CardTag;
  cover?: ReactNode;
  title?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export function Card({
  variant = 'outlined',
  padding = 4,
  hoverable = false,
  as = 'div',
  cover,
  title,
  extra,
  footer,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
  ...rest
}: CardProps) {
  const config = useDuiConfigOptional();
  const Component = as as ElementType;
  const isUnstyled = unstyled ?? config?.unstyled ?? false;

  return (
    <Component
      {...rest}
      data-dui="card"
      data-variant={variant}
      data-hoverable={presence(hoverable)}
      data-unstyled={presence(isUnstyled)}
      className={cx(classNames?.root, className)}
      style={{
        ...styles?.root,
        ...style,
        ['--dui-card-padding' as string]: resolveSpace(padding),
      }}
      {...partProps('root', classNames, styles)}
    >
      {cover ? <div {...partProps('cover', classNames, styles)}>{cover}</div> : null}
      {title || extra ? (
        <div {...partProps('header', classNames, styles)}>
          {title ? <h3 {...partProps('title', classNames, styles)}>{title}</h3> : null}
          {extra ? <div {...partProps('extra', classNames, styles)}>{extra}</div> : null}
        </div>
      ) : null}
      <div {...partProps('body', classNames, styles)}>{children}</div>
      {footer ? <div {...partProps('footer', classNames, styles)}>{footer}</div> : null}
    </Component>
  );
}
