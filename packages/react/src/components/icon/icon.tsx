import type { CSSProperties, ReactNode, SVGAttributes } from 'react';
import { cx, partProps, presence } from '../../utils/dom';
import type { StyledParts } from '../../utils/types';
import { useDuiConfigOptional } from '../config-provider/context';

export type IconPart = 'root';

export interface IconProps extends StyledParts<IconPart> {
  size?: number | string;
  viewBox?: string;
  decorative?: boolean;
  label?: string;
  mirrorInRtl?: boolean;
  children?: ReactNode;
}

export function Icon({
  size = 20,
  viewBox = '0 0 24 24',
  decorative = true,
  label,
  mirrorInRtl = false,
  children,
  className,
  style,
  classNames,
  styles,
  unstyled,
}: IconProps) {
  const config = useDuiConfigOptional();
  const isUnstyled = unstyled ?? config?.unstyled ?? false;
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const svgProps: SVGAttributes<SVGSVGElement> = {
    viewBox,
    focusable: 'false',
  };

  if (decorative) {
    svgProps['aria-hidden'] = true;
  } else {
    svgProps.role = 'img';
    svgProps['aria-label'] = label;
  }

  const mergedStyle: CSSProperties = {
    ...styles?.root,
    ...style,
    ['--dui-icon-size' as string]: sizeValue,
  };

  return (
    <span
      {...partProps('root', classNames, styles)}
      data-dui="icon"
      data-mirror={presence(mirrorInRtl)}
      data-unstyled={presence(isUnstyled)}
      className={cx(classNames?.root, className)}
      style={mergedStyle}
    >
      <svg {...svgProps}>{children}</svg>
    </span>
  );
}
