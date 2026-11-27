'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Origin, reducedMotion } from './engine';

type Lenis = { stop: () => void; start: () => void; scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean }) => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Two moments only:
 * - the very first visit of a session opens on one dot, which travels to the title as it composes itself;
 * - every page change after that is quiet: the page fades to white and the next one fades in.
 */
export default function Transitions() {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);
  const state = useRef<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const target = useRef<string | null>(null);

  // first visit of the session: a single dot in the middle of a white page travels to the title,
  // and the title composes itself in dots from there (DotText 'intro'); then everything is just the page.
  useEffect(() => {
    if (document.documentElement.dataset.intro !== '1') return;
    try {
      sessionStorage.setItem('dot-intro', '1');
    } catch {}
    const v = veil.current;
    const dot = v?.querySelector<HTMLElement>('[data-dot]');
    const done = () => {
      delete document.documentElement.dataset.intro;
      if (v) v.style.display = 'none';
    };
    if (!v || !dot || reducedMotion()) return done();
    const target = document.querySelector<HTMLElement>('[data-intro-target]') ?? document.querySelector<HTMLElement>('main h1');
    const t1 = window.setTimeout(() => {
      if (target) {
        const r = target.getBoundingClientRect();
        const fs = parseFloat(getComputedStyle(target).fontSize) || 16;
        const x = r.left + fs * 0.3 - innerWidth / 2;
        const y = r.top + fs * 0.45 - innerHeight / 2;
        dot.style.transition = 'transform 620ms cubic-bezier(.65,0,.35,1)';
        dot.style.transform = `translate(${x}px, ${y}px) scale(1.4)`;
      }
    }, 520);
    const t2 = window.setTimeout(() => {
      v.style.transition = 'background-color 420ms ease';
      v.style.backgroundColor = 'rgba(255,255,255,0)';
      dot.style.transition = 'transform 260ms ease, opacity 260ms ease';
      dot.style.opacity = '0';
    }, 1120);
    const t3 = window.setTimeout(done, 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
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
      {/* white in the first paint, with one dot in the middle (see the script in layout) */}
      <div ref={veil} id="dot-veil" aria-hidden className="pointer-events-none fixed inset-0 z-[96] hidden bg-white">
        <span data-dot className="absolute left-1/2 top-1/2 -ml-[4px] -mt-[4px] block h-2 w-2 rounded-full bg-[#0a0a0a]" />
      </div>
      <div ref={fade} aria-hidden className="pointer-events-none fixed inset-0 z-[45] bg-white opacity-0" />
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
