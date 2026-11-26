'use client';

import { useEffect, useRef } from 'react';
import { DotCanvas, Origin, reducedMotion, tween } from './engine';
import { loadImage } from './img';

/**
 * One frame, many pictures: each new one spreads in dots over the previous one.
 * Used by the Index view of the home page.
 */
export default function DotSwap({ srcs, active, origin, cell = 9, className = '' }: { srcs: string[]; active: number; origin: Origin; cell?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const shown = useRef<HTMLImageElement>(null);
  const eng = useRef<DotCanvas | null>(null);
  const cur = useRef(-1);
  const want = useRef(active);
  const flight = useRef<{ to: number; img: HTMLImageElement; p: number; cancel: () => void } | null>(null);
  const originRef = useRef(origin);
  originRef.current = origin;
  want.current = active;

  useEffect(() => {
    const el = box.current!;
    const e = new DotCanvas(cv.current!, cell);
    eng.current = e;
    const fit = () => {
      const r = el.getBoundingClientRect();
      e.resize(r.width, r.height);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // warm the cache so every swap is instant
    srcs.forEach((s) => loadImage(s, 1200));
    return () => ro.disconnect();
  }, [cell, srcs]);

  useEffect(() => {
    const to = active;
    if (to === cur.current && !flight.current) return;
    let alive = true;
    loadImage(srcs[to], 1200).then((img) => {
      if (!alive || want.current !== to) return;
      const e = eng.current!;
      const dom = shown.current!;
      // a swap already running: keep its picture if it was mostly there
      const f = flight.current;
      if (f) {
        f.cancel();
        if (f.p > 0.5) {
          dom.src = f.img.src;
          cur.current = f.to;
        }
        flight.current = null;
        e.clear();
      }
      if (to === cur.current) return;
      if (reducedMotion()) {
        dom.src = img.src;
        cur.current = to;
        return;
      }
      e.setImage(img);
      const o = originRef.current;
      const fl = { to, img, p: 0, cancel: () => {} };
      fl.cancel = tween(
        620,
        (t) => {
          fl.p = t;
          e.render(t, o, { spread: 1.25 });
        },
        () => {
          dom.src = img.src;
          cur.current = to;
          flight.current = null;
          const clear = () => want.current === to && !flight.current && e.clear();
          if (dom.decode) dom.decode().then(clear, clear);
          else clear();
        }
      );
      flight.current = fl;
    });
    return () => {
      alive = false;
    };
  }, [active, srcs]);

  return (
    <div ref={box} className={`relative overflow-hidden bg-neutral-100 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={shown} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
