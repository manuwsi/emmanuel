/**
 * DOT — the site's motion system, same language as the DOT Reel.
 * Pictures never just fade in: they arrive as a halftone (dark areas first, in big dots),
 * the dots swell until they touch, then the sharp picture settles on top.
 * The wave starts from a point (the cursor, the click, the bottom of the screen).
 */

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => {
  t = clamp(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Cheap stable noise per cell, so the wave front is organic instead of a perfect circle. */
const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Sample = { cols: number; rows: number; rgb: string[]; dark: Float32Array };

export type Origin = { x: number; y: number }; // 0..1 in the box

export type RenderOpts = {
  /** Spread of the wave: higher = the front is narrower and travels more visibly. */
  spread?: number;
  /** Solid colour instead of the picture (page transitions). */
  solid?: string;
  /** Wave runs from the far edges back to the origin. */
  invert?: boolean;
  /** Draw the sharp picture over the dots at the end (default true when there is a picture). */
  sharp?: boolean;
};

/**
 * One canvas that can bloom any picture (or a flat colour) in dots.
 * Sampling is cached per picture and per size, so scrubbing it every frame is cheap.
 */
export class DotCanvas {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private cache = new Map<string, Sample>();
  private img: HTMLImageElement | null = null;
  private fit: { sx: number; sy: number; sw: number; sh: number } | null = null;
  private position: [number, number] = [0.5, 0.5];

  constructor(private canvas: HTMLCanvasElement, public cell = 9) {
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    canvas.width = 0;
    canvas.height = 0;
  }

  resize(w: number, h: number) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.cache.clear();
    if (this.img) this.computeFit();
    // the bitmap itself is only allocated when something is drawn (see ensure)
    if (this.canvas.width > 0) this.ensure();
  }

  /** Allocate the bitmap at the right size (lazily: dozens of idle canvases would cost a lot of memory). */
  private ensure() {
    const cw = Math.max(1, Math.round(this.w * this.dpr));
    const ch = Math.max(1, Math.round(this.h * this.dpr));
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
    }
  }

  /** Give the memory back once the animation is over. */
  release() {
    this.canvas.width = 0;
    this.canvas.height = 0;
    if (this.off) {
      this.off.width = 0;
      this.off.height = 0;
    }
  }

  /** The picture to bloom, shown like CSS object-fit: cover. */
  setImage(img: HTMLImageElement | null, position: [number, number] = [0.5, 0.5]) {
    this.img = img;
    this.position = position;
    if (img) this.computeFit();
  }

  private computeFit() {
    const img = this.img!;
    const iw = img.naturalWidth || 1;
    const ih = img.naturalHeight || 1;
    const s = Math.max(this.w / iw, this.h / ih);
    const sw = this.w / s;
    const sh = this.h / s;
    this.fit = { sx: (iw - sw) * this.position[0], sy: (ih - sh) * this.position[1], sw, sh };
  }

  private sample(): Sample | null {
    const img = this.img;
    if (!img || !img.complete || !img.naturalWidth || !this.fit) return null;
    const cols = Math.ceil(this.w / this.cell);
    const rows = Math.ceil(this.h / this.cell);
    const key = `${img.currentSrc || img.src}|${cols}x${rows}`;
    const hit = this.cache.get(key);
    if (hit) return hit;
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const o = off.getContext('2d', { willReadFrequently: true })!;
    o.imageSmoothingEnabled = true;
    o.imageSmoothingQuality = 'high';
    const { sx, sy, sw, sh } = this.fit;
    // the last column/row may hang over the edge: sample the matching slice
    o.drawImage(img, sx, sy, sw * ((cols * this.cell) / this.w), sh * ((rows * this.cell) / this.h), 0, 0, cols, rows);
    let data: Uint8ClampedArray;
    try {
      data = o.getImageData(0, 0, cols, rows).data;
    } catch {
      return null;
    }
    const rgb: string[] = new Array(cols * rows);
    const dark = new Float32Array(cols * rows);
    for (let k = 0; k < cols * rows; k++) {
      const r = data[k * 4], g = data[k * 4 + 1], b = data[k * 4 + 2];
      rgb[k] = `rgb(${r},${g},${b})`;
      dark[k] = 1 - (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }
    const s = { cols, rows, rgb, dark };
    this.cache.set(key, s);
    return s;
  }

  clear() {
    if (!this.canvas.width) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * p = 0: nothing. p = 1: the whole picture, sharp.
   * In between, a wave travels from `origin`: each cell goes tiny dot → halftone dot → solid tile.
   */
  render(p: number, origin: Origin, opts: RenderOpts = {}) {
    const { ctx, cell, w, h } = this;
    const solid = opts.solid;
    const S = opts.spread ?? 1.5;
    const sample = solid ? null : this.sample();
    if (p <= 0.0001) {
      this.clear();
      return;
    }
    this.ensure();
    this.clear();
    if (!solid && !sample) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const cols = sample ? sample.cols : Math.ceil(w / cell);
    const rows = sample ? sample.rows : Math.ceil(h / cell);
    const ox = origin.x * w;
    const oy = origin.y * h;
    const maxD = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy)) || 1;
    // solid: dots grow past √2/2 · cell so they merge into a flat colour.
    // picture: they stop as a dense halftone; the sharp picture settles behind the wave front instead.
    const R = solid ? cell * 0.72 : cell * 0.64;
    const half = cell / 2;
    const front = p * (1 + S);

    if (solid) ctx.fillStyle = solid;
    for (let j = 0; j < rows; j++) {
      const cy = j * cell + half;
      for (let i = 0; i < cols; i++) {
        const cx = i * cell + half;
        let d = Math.hypot(cx - ox, cy - oy) / maxD;
        d = clamp(d + (hash(i, j) - 0.5) * 0.07);
        if (opts.invert) d = 1 - d;
        const local = clamp(front - d * S);
        if (local <= 0) continue;
        const k = easeOut(local);
        let r: number;
        const idx = j * cols + i;
        if (solid) {
          r = R * k;
          if (r >= R * 0.985) {
            ctx.fillRect(i * cell, j * cell, cell + 0.5, cell + 0.5);
            continue;
          }
        } else {
          const dk = sample!.dark[idx];
          // halftone phase: dark areas grow first, light areas stay as specks
          const ht = clamp(k * (0.12 + 1.3 * dk));
          r = R * (ht + (1 - ht) * smooth(0.5, 1, k));
          ctx.fillStyle = sample!.rgb[idx];
        }
        if (r < 0.25) continue;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // the sharp picture settles behind the front, as a soft disc growing from the origin
    if (!solid && opts.sharp !== false && this.img && this.fit) {
      const d1 = ((front - 0.97) / S) * maxD;
      const d2 = ((front - 0.5) / S) * maxD;
      if (d2 > 0) {
        const off = this.layer();
        const o = off.getContext('2d')!;
        o.setTransform(1, 0, 0, 1, 0, 0);
        o.globalCompositeOperation = 'source-over';
        o.clearRect(0, 0, off.width, off.height);
        o.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        o.imageSmoothingQuality = 'high';
        const { sx, sy, sw, sh } = this.fit;
        o.drawImage(this.img, sx, sy, sw, sh, 0, 0, w, h);
        if (d1 < maxD * 1.02) {
          const g = o.createRadialGradient(ox, oy, Math.max(0, d1), ox, oy, Math.max(d1 + 1, d2));
          g.addColorStop(0, 'rgba(0,0,0,1)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          o.globalCompositeOperation = 'destination-in';
          o.fillStyle = g;
          o.fillRect(0, 0, w, h);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(off, 0, 0);
      }
    }
  }

  private off: HTMLCanvasElement | null = null;
  private layer() {
    if (!this.off) this.off = document.createElement('canvas');
    if (this.off.width !== this.canvas.width || this.off.height !== this.canvas.height) {
      this.off.width = this.canvas.width;
      this.off.height = this.canvas.height;
    }
    return this.off;
  }
}

/** Run fn(progress 0→1) over `ms`, returns a cancel function. */
export function tween(ms: number, fn: (t: number) => void, done?: () => void) {
  let raf = 0;
  const t0 = performance.now();
  const step = (now: number) => {
    const t = clamp((now - t0) / ms);
    fn(t);
    if (t < 1) raf = requestAnimationFrame(step);
    else done?.();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** How long the first-visit slate still covers the page (ms), so things don't animate behind it. */
export function introWait() {
  if (typeof window === 'undefined') return 0;
  const w = window as unknown as { __introEnd?: number };
  if (w.__introEnd === undefined) {
    w.__introEnd = document.documentElement.dataset.intro === '1' ? performance.now() + 1050 : 0;
  }
  return Math.max(0, w.__introEnd - performance.now());
}
