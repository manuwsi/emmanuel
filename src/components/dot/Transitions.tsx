'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Origin, reducedMotion } from './engine';

type Lenis = { stop: () => void; start: () => void; scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean }) => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/** Every page change is quiet: the page fades to white and the next one fades in from the top. */
export default function Transitions() {
  const router = useRouter();
  const pathname = usePathname();
  const fade = useRef<HTMLDivElement>(null);
  const state = useRef<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const target = useRef<string | null>(null);


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
