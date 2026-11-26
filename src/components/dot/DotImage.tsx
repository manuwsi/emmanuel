'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { DotCanvas, Origin, introWait, reducedMotion, tween } from './engine';

/**
 * A cover that arrives in dots when it enters the screen, and — when it has a second picture —
 * lets that picture spread in dots from wherever the cursor comes in.
 */
export default function DotImage({
  src,
  hover,
  alt,
  sizes,
  priority = false,
  cell = 8,
  quality = 90,
  from = { x: 0.5, y: 1.1 },
  className = '',
  intrinsic,
  unoptimized = false,
  duration = 1350,
}: {
  src: string;
  hover?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  cell?: number;
  quality?: number;
  /** Where the entrance wave starts, 0..1 in the frame (default: just below the bottom edge). */
  from?: Origin;
  className?: string;
  /** Natural size: the picture keeps its own proportions instead of filling its parent. */
  intrinsic?: { width: number; height: number };
  unoptimized?: boolean;
  duration?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const base = useRef<HTMLImageElement | null>(null);
  const over = useRef<HTMLImageElement | null>(null);
  const eng = useRef<DotCanvas | null>(null);
  const st = useRef({ loaded: false, seen: false, entered: false, p: 0, target: 0, origin: { x: 0.5, y: 0.5 } as Origin, raf: 0, last: 0 });

  // engine + size
  useEffect(() => {
    const el = box.current!;
    const e = new DotCanvas(cv.current!, cell);
    eng.current = e;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      e.resize(r.width, r.height);
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    e.resize(r.width, r.height);
    return () => ro.disconnect();
  }, [cell]);

  const show = (img: HTMLImageElement | null, on: boolean) => {
    if (img) img.style.opacity = on ? '1' : '0';
  };

  // entrance: once loaded AND on screen
  const tryEnter = () => {
    const s = st.current;
    if (!s.loaded || !s.seen || s.entered) return;
    s.entered = true;
    const e = eng.current;
    if (!e || reducedMotion()) {
      show(base.current, true);
      return;
    }
    e.setImage(base.current);
    window.setTimeout(() => tween(
      duration,
      (t) => e.render(t, from, { spread: 1.2 }),
      () => {
        show(base.current, true);
        e.release();
        s.p = 0;
      }
    ), introWait());
  };

  useEffect(() => {
    const el = box.current!;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          st.current.seen = true;
          tryEnter();
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    // never leave a blank frame if something goes wrong
    const safety = window.setTimeout(() => {
      if (st.current.loaded && !st.current.entered) show(base.current, true);
    }, 6000);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hover: the second picture spreads from the cursor, and folds back towards where it leaves
  const loop = () => {
    const s = st.current;
    const e = eng.current;
    if (!e) return;
    const now = performance.now();
    const dt = Math.min(48, now - (s.last || now));
    s.last = now;
    const dir = s.target > s.p ? 1 : -1;
    s.p = Math.min(1, Math.max(0, s.p + (dir * dt) / (dir > 0 ? 720 : 560)));
    if (s.p >= 1) {
      show(over.current, true);
      e.release();
    } else if (s.p <= 0) {
      show(over.current, false);
      e.release();
    } else {
      show(over.current, false);
      e.setImage(over.current);
      e.render(s.p, s.origin, { spread: 1.4 });
    }
    if (s.p !== s.target) s.raf = requestAnimationFrame(loop);
    else s.raf = 0;
  };

  const pointer = (ev: React.PointerEvent, on: boolean) => {
    const s = st.current;
    if (!hover || ev.pointerType !== 'mouse' || !s.entered || !over.current?.complete || reducedMotion()) return;
    const r = box.current!.getBoundingClientRect();
    // the origin only moves when the picture is at rest, otherwise the dots would jump
    if (s.p === 0 || s.p === 1) s.origin = { x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height };
    s.target = on ? 1 : 0;
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(loop);
    }
  };

  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);

  return (
    <div
      ref={box}
      className={`${intrinsic ? 'relative w-full' : 'absolute inset-0'} ${className}`}
      onPointerEnter={(e) => pointer(e, true)}
      onPointerLeave={(e) => pointer(e, false)}
    >
      <Image
        ref={base}
        src={src}
        alt={alt}
        {...(intrinsic ? { width: intrinsic.width, height: intrinsic.height } : { fill: true })}
        priority={priority}
        sizes={sizes}
        quality={quality}
        unoptimized={unoptimized}
        className={intrinsic ? 'block h-auto w-full' : 'object-cover'}
        style={{ opacity: 0 }}
        onLoad={() => {
          st.current.loaded = true;
          tryEnter();
        }}
      />
      <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      {hover && (
        <Image ref={over} src={hover} alt="" aria-hidden fill sizes={sizes} quality={quality} className="pointer-events-none object-cover" style={{ opacity: 0 }} />
      )}
    </div>
  );
}
