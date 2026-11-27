'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Origin, reducedMotion } from './engine';
import { bezier, DUR, EASE } from './motion';
import { drawHalftone, fitCanvas } from './halftone';

type Lenis = { stop: () => void; start: () => void; scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean }) => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

const inkE = bezier(EASE.ink);
const uninkE = bezier(EASE.unink);

/**
 * Changing page is printed: from the point you clicked, a halftone of white dots grows until it covers the page,
 * then on the next page the dots draw back from that same point. The thread of the click is kept, no generic fade.
 */
export default function Transitions() {
  const router = useRouter();
  const pathname = usePathname();
  const canvas = useRef<HTMLCanvasElement>(null);
  const origin = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const state = useRef<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const target = useRef<string | null>(null);

  const draw = (k: number, mode: 'cover' | 'reveal') => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (c && ctx) drawHalftone(ctx, c.clientWidth, c.clientHeight, origin.current, k, mode);
  };

  const play = (mode: 'cover' | 'reveal', ms: number, done: () => void) => {
    const c = canvas.current;
    if (!c) return done();
    fitCanvas(c);
    c.style.display = 'block';
    c.style.pointerEvents = 'auto';
    const ease = mode === 'cover' ? inkE : uninkE;
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      draw(ease(p), mode);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else done();
    };
    raf.current = requestAnimationFrame(step);
  };

  const reveal = () => {
    state.current = 'revealing';
    // one frame for the new page to paint under the white
    window.setTimeout(() => {
      play('reveal', DUR.unink, () => {
        const c = canvas.current;
        if (c) {
          c.style.display = 'none';
          c.style.pointerEvents = 'none';
        }
        state.current = 'idle';
        lenis()?.start();
      });
    }, 60);
  };

  const go = (href: string, at?: { x: number; y: number }) => {
    target.current = href.split(/[?#]/)[0];
    state.current = 'covering';
    origin.current = at ?? { x: innerWidth / 2, y: innerHeight / 2 };
    lenis()?.stop();
    play('cover', DUR.ink, () => {
      state.current = 'covered';
      router.push(href);
      window.setTimeout(() => state.current === 'covered' && reveal(), 2500);
    });
  };
  const goRef = useRef(go);
  goRef.current = go;

  // intercept internal links
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const a = (ev.target as Element | null)?.closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.noTransition !== undefined) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page (hash links, language…)
      if (/\.(html|pdf|jpg|png|mp4|webp|zip)$/i.test(url.pathname)) return;
      if (reducedMotion() || state.current !== 'idle') return;
      ev.preventDefault();
      goRef.current(url.pathname + url.search + url.hash, ev.clientX || ev.clientY ? { x: ev.clientX, y: ev.clientY } : undefined);
    };
    document.addEventListener('click', onClick, true);
    (window as unknown as { __dotGo?: (h: string) => void }).__dotGo = (h) => goRef.current(h);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // the new page is there: back to the top, and the dots draw back
  useEffect(() => {
    if (state.current === 'covered' && target.current === pathname) {
      window.scrollTo(0, 0);
      lenis()?.scrollTo(0, { immediate: true, force: true });
      reveal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[45] hidden h-full w-full" />
    </>
  );
}

/** Navigate with the printed transition from code (falls back to a plain page load). */
export function dotGo(href: string, _origin?: Origin) {
  void _origin;
  const fn = (window as unknown as { __dotGo?: (h: string) => void }).__dotGo;
  if (fn) fn(href);
  else window.location.href = href;
}
