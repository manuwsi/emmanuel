/**
 * The motion grammar of the site: one curve per intention, never the same everywhere.
 * (Kept in sync with the --ease-* variables in globals.css.)
 */
export const EASE = {
  /** an image arrives: slow start, then the dots meet quickly */
  print: [0.6, 0, 0.25, 1],
  /** the page leaves: the screen gets covered, accelerating */
  ink: [0.55, 0, 0.75, 0.2],
  /** the page arrives: the dots draw back, decelerating for a long time */
  unink: [0.16, 1, 0.3, 1],
  /** a text appears */
  arrive: [0.22, 1, 0.36, 1],
  /** something changes state (fold, caption) */
  state: [0.4, 0, 0.2, 1],
} as const;

export const DUR = { print: 1150, printStagger: 110, ink: 480, unink: 680, arrive: 700, state: 320 } as const;

export type Curve = readonly [number, number, number, number];

/** cubic-bezier evaluated in JS (for canvas animations), same result as the CSS curve. */
export function bezier([x1, y1, x2, y2]: Curve) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-4 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
