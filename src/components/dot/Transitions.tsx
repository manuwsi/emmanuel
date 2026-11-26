'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DotCanvas, Origin, reducedMotion, tween } from './engine';
import DotText from './DotText';

const INK = '#0a0a0a';

type Lenis = { stop: () => void; start: () => void; scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean }) => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Two moments only:
 * - the very first visit of a session opens on an ink slate with the name, which dissolves in dots;
 * - every page change after that is quiet: the page fades to white and the next one fades in.
 */
export default function Transitions() {
  const router = useRouter();
  const pathname = usePathname();
  const cv = useRef<HTMLCanvasElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);
  const state = useRef<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const target = useRef<string | null>(null);
  const [slate, setSlate] = useState(false);

  // first visit of the session: the slate with the name, then the dots open on the page
  useEffect(() => {
    if (document.documentElement.dataset.intro !== '1') return;
    try {
      sessionStorage.setItem('dot-intro', '1');
    } catch {}
    if (reducedMotion()) {
      if (veil.current) veil.current.style.display = 'none';
      delete document.documentElement.dataset.intro;
      return;
    }
    const e = new DotCanvas(cv.current!, 22);
    e.resize(window.innerWidth, window.innerHeight);
    e.render(1, { x: 0.5, y: 0.5 }, { solid: INK });
    setSlate(true);
    const t = window.setTimeout(() => {
      delete document.documentElement.dataset.intro;
      if (veil.current) veil.current.style.display = 'none';
      setSlate(false);
      tween(
        900,
        (k) => e.render(1 - k, { x: 0.5, y: 0.5 }, { solid: INK, invert: true, spread: 1.6 }),
        () => e.release()
      );
    }, 950);
    return () => clearTimeout(t);
  }, []);

  const setFade = (on: boolean, ms: number) => {
    const f = fade.current;
    if (!f) return;
    f.style.transition = `opacity ${ms}ms cubic-bezier(.4,0,.2,1)`;
    f.style.opacity = on ? '1' : '0';
    f.style.pointerEvents = on ? 'auto' : 'none';
  };

  const reveal = () => {
    state.current = 'revealing';
    window.setTimeout(() => {
      setFade(false, 520);
      window.setTimeout(() => {
        state.current = 'idle';
        lenis()?.start();
      }, 540);
    }, 90);
  };

  /** Also used by the "keep scrolling to the next project" zone. */
  const go = (href: string) => {
    target.current = href.split(/[?#]/)[0];
    state.current = 'covering';
    lenis()?.stop();
    setFade(true, 260);
    window.setTimeout(() => {
      state.current = 'covered';
      router.push(href);
      window.setTimeout(() => state.current === 'covered' && reveal(), 2500);
    }, 280);
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
      goRef.current(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', onClick, true);
    (window as unknown as { __dotGo?: (h: string) => void }).__dotGo = (h) => goRef.current(h);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // the new page is there: fade it in from the top
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
      {/* solid ink in the first paint, so the intro never shows the page before the slate (see the script in layout) */}
      <div ref={veil} id="dot-veil" aria-hidden className="pointer-events-none fixed inset-0 z-[96] hidden bg-[#0a0a0a]" />
      <canvas ref={cv} aria-hidden className="pointer-events-none fixed inset-0 z-[95] h-screen w-screen" />
      <div ref={fade} aria-hidden className="pointer-events-none fixed inset-0 z-[45] bg-white opacity-0" />
      {slate && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[97] flex items-center justify-center text-white">
          <span className="text-[13px] font-medium uppercase tracking-[0.02em]">
            <DotText text="Emmanuel Ijjou" play="mount" delay={120} />
          </span>
        </div>
      )}
    </>
  );
}

/** Navigate with the quiet fade from code (falls back to a plain page load). */
export function dotGo(href: string, _origin?: Origin) {
  void _origin;
  const fn = (window as unknown as { __dotGo?: (h: string) => void }).__dotGo;
  if (fn) fn(href);
  else window.location.href = href;
}
