'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DotCanvas, Origin, reducedMotion, tween } from './engine';
import DotText from './DotText';
import { projects } from '../projects';
import { useLang } from '../i18n';

const INK = '#0a0a0a';

type Lenis = { stop: () => void; start: () => void; scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean }) => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/** Name of a page, shown on the slate while the dots cover the screen. */
function titleFor(path: string, lang: 'fr' | 'en') {
  const p = projects.find((x) => x.link === path);
  if (p) return lang === 'fr' ? p.title.fr : p.title.en;
  if (path === '/') return lang === 'fr' ? 'Travaux' : 'Work';
  if (path.startsWith('/about')) return lang === 'fr' ? 'À propos' : 'About';
  if (path.startsWith('/soutrame')) return 'Soutrame';
  return 'Emmanuel Ijjou';
}

/**
 * Page changes as a ripple of ink dots: they swell from the click until they cover the screen,
 * the name of the next page decodes in the middle, then the dots shrink away from the centre.
 * The very first visit of a session opens on the same slate, with the name.
 */
export default function Transitions() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useLang();
  const cv = useRef<HTMLCanvasElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const eng = useRef<DotCanvas | null>(null);
  const state = useRef<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const target = useRef<string | null>(null);
  const cancel = useRef<() => void>(() => {});
  const [slate, setSlate] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const langRef = useRef(lang);
  langRef.current = lang;

  const size = () => {
    eng.current?.resize(window.innerWidth, window.innerHeight);
  };

  const reveal = (wait = 120) => {
    const e = eng.current!;
    state.current = 'revealing';
    cancel.current();
    const t0 = window.setTimeout(() => {
      if (veil.current) veil.current.style.display = 'none';
      setSlate(null);
      cancel.current = tween(
        640,
        (t) => e.render(1 - t, { x: 0.5, y: 0.5 }, { solid: INK, invert: true, spread: 1.6 }),
        () => {
          e.release();
          state.current = 'idle';
          setActive(false);
          // wheel inertia from the previous page has died out by now
          lenis()?.start();
        }
      );
    }, wait);
    const prev = cancel.current;
    cancel.current = () => {
      clearTimeout(t0);
      prev();
    };
  };

  // first visit of the session: the slate with the name, then the dots open on the page
  useEffect(() => {
    const e = new DotCanvas(cv.current!, 22);
    eng.current = e;
    size();
    window.addEventListener('resize', size);
    const intro = document.documentElement.dataset.intro === '1';
    if (intro) {
      try {
        sessionStorage.setItem('dot-intro', '1');
      } catch {}
      if (reducedMotion()) {
        if (veil.current) veil.current.style.display = 'none';
        delete document.documentElement.dataset.intro;
      } else {
        setActive(true);
        setSlate('Emmanuel Ijjou');
        state.current = 'covered';
        e.render(1, { x: 0.5, y: 0.5 }, { solid: INK });
        window.setTimeout(() => {
          delete document.documentElement.dataset.intro;
          reveal(0);
        }, 900);
      }
    }
    return () => window.removeEventListener('resize', size);
  }, []);

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
      goRef.current(url.pathname + url.search + url.hash, { x: ev.clientX / innerWidth, y: ev.clientY / innerHeight });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  /** Also used by the "keep scrolling to the next project" zone. */
  const go = (href: string, origin: Origin) => {
    const e = eng.current!;
    target.current = href.split(/[?#]/)[0];
    state.current = 'covering';
    // the old page stops moving under the dots (wheel inertia would otherwise carry into the new page)
    lenis()?.stop();
    setActive(true);
    cancel.current();
    cancel.current = tween(
      520,
      (t) => e.render(t, origin, { solid: INK, spread: 1.5 }),
      () => {
        state.current = 'covered';
        e.render(1, origin, { solid: INK });
        setSlate(titleFor(target.current!, langRef.current));
        router.push(href);
        // never stay stuck on the slate
        window.setTimeout(() => {
          if (state.current === 'covered') {
            lenis()?.start();
            reveal(0);
          }
        }, 2500);
      }
    );
  };

  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    (window as unknown as { __dotGo?: typeof go }).__dotGo = (h, o) => goRef.current(h, o);
  }, []);

  // the new page is there: open the dots on it
  useEffect(() => {
    if (state.current === 'covered' && target.current === pathname) {
      window.scrollTo(0, 0);
      lenis()?.scrollTo(0, { immediate: true, force: true });
      reveal(260);
    }
  }, [pathname]);

  return (
    <>
      {/* solid ink in the first paint, so the intro never shows the page before the slate (see the script in layout) */}
      <div ref={veil} id="dot-veil" aria-hidden className="pointer-events-none fixed inset-0 z-[96] hidden bg-[#0a0a0a]" />
      <canvas
        ref={cv}
        aria-hidden
        className={`fixed inset-0 z-[95] h-screen w-screen ${active ? 'pointer-events-auto' : 'pointer-events-none'}`}
      />
      {slate && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[97] flex items-center justify-center text-white">
          <span className="text-[13px] font-medium uppercase tracking-[0.02em]">
            <DotText text={slate} />
          </span>
        </div>
      )}
    </>
  );
}

/** Navigate with the dot transition from code (falls back to a plain push). */
export function dotGo(href: string, origin: Origin = { x: 0.5, y: 0.5 }) {
  const fn = (window as unknown as { __dotGo?: (h: string, o: Origin) => void }).__dotGo;
  if (fn) fn(href, origin);
  else window.location.href = href;
}
