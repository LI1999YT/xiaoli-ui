import { useEffect, useState, type ReactNode } from 'react';

export interface WatermarkProps {
  text?: string;
  gap?: number;
  children?: ReactNode;
}

function createPattern(text: string, gap: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = gap;
  canvas.height = gap;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.clearRect(0, 0, gap, gap);
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = '#6b4b63';
  ctx.font = '16px "Xiaoli Anime", sans-serif';
  ctx.translate(gap / 2, gap / 2);
  ctx.rotate((-18 * Math.PI) / 180);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  return canvas.toDataURL();
}

export function Watermark({ text = 'Xiaoli', gap = 140, children }: WatermarkProps) {
  const [image, setImage] = useState('');

  useEffect(() => {
    setImage(createPattern(text, gap));
  }, [text, gap]);

  return (
    <div data-dui="watermark">
      <div
        data-part="layer"
        aria-hidden
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: `${gap}px ${gap}px` } : undefined}
      />
      <div data-part="content">{children}</div>
    </div>
  );
}
