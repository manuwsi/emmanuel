'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { reducedMotion } from './engine';

type L = { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number | string | HTMLElement, o?: { immediate?: boolean; offset?: number; duration?: number }) => void; resize: () => void };

/**
 * Gentle inertia on the wheel (Lenis), everywhere except the shop, which runs its own.
 * Touch keeps the native scroll.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const off = pathname?.startsWith('/soutrame') && !pathname.startsWith('/soutrame-ecommerce');

  useEffect(() => {
    if (off || reducedMotion()) return;
    let lenis: L | null = null;
    let raf = 0;
    let alive = true;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      if (!alive) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 }) as unknown as L;
      (window as unknown as { __lenis?: L }).__lenis = lenis;
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: L }).__lenis;
    };
  }, [off]);

  // a new page always starts at the top
  useEffect(() => {
    const l = (window as unknown as { __lenis?: L }).__lenis;
    if (l && !location.hash) l.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}

export function lenisScrollTo(y: number) {
  const l = (window as unknown as { __lenis?: L }).__lenis;
  if (l) l.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}
