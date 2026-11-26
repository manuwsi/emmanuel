/** URL of the resized version Next serves for a public image (same files the grid already loads). */
export function optimized(src: string, w = 1080, q = 85) {
  if (process.env.NEXT_PUBLIC_UNOPTIMIZED === '1') return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
}

const pool = new Map<string, Promise<HTMLImageElement>>();

/** Load (once) a picture we want to draw in a canvas. */
export function loadImage(src: string, w = 1080): Promise<HTMLImageElement> {
  const url = optimized(src, w);
  let p = pool.get(url);
  if (!p) {
    p = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img);
      img.src = url;
    });
    pool.set(url, p);
  }
  return p;
}
