import { useState } from 'react';
import { presence } from '../../utils/dom';
import { useDuiConfigOptional } from '../config-provider/context';

export function Image({
  src,
  alt,
  width,
  height,
  fit = 'cover',
  loading = 'lazy',
  fallbackSrc,
  aspectRatio,
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  loading?: 'eager' | 'lazy';
  fallbackSrc?: string;
  aspectRatio?: string | number;
}) {
  const config = useDuiConfigOptional();
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  return (
    <span data-dui="image" data-fit={fit} data-unstyled={presence(config?.unstyled ?? false)} style={{ width, height, aspectRatio }}>
      {failed && !fallbackSrc ? <span data-part="fallback">图片加载失败</span> : (
        <img
          src={current}
          alt={alt}
          loading={loading}
          onError={() => {
            if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
            else setFailed(true);
          }}
        />
      )}
    </span>
  );
}
