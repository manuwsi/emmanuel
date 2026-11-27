/**
 * The halftone of white dots used to cover and uncover the page (page changes, the launch of the site).
 * k: 0 → 1 along the move. cover: dots grow outwards from the origin; reveal: they shrink outwards from it.
 */
export function drawHalftone(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  origin: { x: number; y: number },
  k: number,
  mode: 'cover' | 'reveal',
  color = '#fff'
) {
  const pitch = w < 768 ? 12 : 14;
  const rmax = pitch * 0.74; // a little more than half the diagonal: at full size the dots close the page
  const { x: ox, y: oy } = origin;
  const maxD = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));
  const band = maxD * 0.42; // width of the halftone edge
  const front = k * (maxD + band);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color;
  if (mode === 'cover' && k >= 1) {
    ctx.fillRect(0, 0, w, h);
    return;
  }
  ctx.beginPath();
  for (let y = pitch / 2; y < h + pitch; y += pitch) {
    for (let x = pitch / 2; x < w + pitch; x += pitch) {
      let s = (front - Math.hypot(x - ox, y - oy)) / band;
      s = s < 0 ? 0 : s > 1 ? 1 : s;
      const r = rmax * (mode === 'cover' ? s : 1 - s);
      if (r > 0.3) {
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
    }
  }
  ctx.fill();
}

/** Size a full-screen canvas for the device and return its 2D context, drawn in CSS pixels. */
export function fitCanvas(c: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.round(innerWidth * dpr);
  c.height = Math.round(innerHeight * dpr);
  const ctx = c.getContext('2d');
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
