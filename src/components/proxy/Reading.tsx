'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n';

type T = <V,>(fr: V, en: V) => V;

/**
 * Two readings of the same page. The gallery is the page as it is walked through: the pictures, the screens,
 * one sentence per moment. The study is the same page with its reasoning unfolded. Nothing is removed from one
 * to the other: the text stays in the page, folded, and each fold also opens on its own.
 */
type Ctx = { study: boolean; set: (v: boolean) => void };
const C = createContext<Ctx>({ study: false, set: () => {} });
export const useReading = () => useContext(C);

const KEY = 'proxy-reading';

/** What is under the middle of the window, outside any fold: it must not move while the text around it folds or unfolds. */
function anchor(): HTMLElement | null {
  const els = document.elementsFromPoint(window.innerWidth * 0.62, window.innerHeight * 0.5) as HTMLElement[];
  for (const el of els) {
    if (el.closest('[data-fold-in]') || getComputedStyle(el).position === 'fixed') continue;
    const block = el.closest<HTMLElement>('figure, h3, article, section');
    if (block) return block;
  }
  return null;
}

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [study, setStudy] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const keep = useRef<{ el: HTMLElement; top: number } | null>(null);

  // a link can ask for the study (…/proxy?lecture=etude); otherwise the last choice is kept.
  // Decided before the first paint, and without any sliding: the page opens in the reading that was chosen
  useLayoutEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const asked = q.get('lecture') ?? q.get('reading');
      const v = asked ?? window.localStorage.getItem(KEY);
      if (v === 'etude' || v === 'study') {
        root.current?.setAttribute('data-reading-jump', '');
        setStudy(true);
      }
    } catch {}
  }, []);

  const set = useCallback((v: boolean) => {
    const el = anchor();
    keep.current = el ? { el, top: el.getBoundingClientRect().top } : null;
    // the whole page changes at once: the folds do not slide, the text appears in place
    root.current?.setAttribute('data-reading-jump', '');
    setStudy(v);
    try {
      window.localStorage.setItem(KEY, v ? 'etude' : 'galerie');
    } catch {}
  }, []);

  useLayoutEffect(() => {
    const k = keep.current;
    keep.current = null;
    if (k && k.el.isConnected) {
      const d = k.el.getBoundingClientRect().top - k.top;
      if (Math.abs(d) > 1) {
        const y = window.scrollY + d;
        const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o: { immediate: boolean; force?: boolean }) => void; resize: () => void } }).__lenis;
        if (l) {
          l.resize();
          l.scrollTo(y, { immediate: true, force: true });
        } else window.scrollTo(0, y);
      }
    }
    const id = requestAnimationFrame(() => root.current?.removeAttribute('data-reading-jump'));
    return () => cancelAnimationFrame(id);
  }, [study]);

  return (
    <C.Provider value={{ study, set }}>
      <div ref={root} data-reading={study ? 'study' : 'gallery'}>
        {children}
      </div>
    </C.Provider>
  );
}

/**
 * A fold: the reasoning behind what is shown. Closed in the gallery, open in the study; in the gallery each one opens on its own.
 * The text is always in the page (search engines and screen readers get it), simply not in the way.
 */
export function Why({ children, label, className = '', inner = 'space-y-3' }: { children: ReactNode; label?: string; className?: string; inner?: string }) {
  const t = useT() as T;
  const { study } = useReading();
  const [own, setOwn] = useState(false);
  // when the whole page changes reading, each fold follows it again
  useEffect(() => setOwn(false), [study]);
  const open = study || own;
  return (
    <div className={className}>
      <div className="px-fold" data-open={open ? '' : undefined}>
        <div data-fold-in aria-hidden={!open} inert={!open}>
          <div className={inner}>{children}</div>
        </div>
      </div>
      {!study && (
        <button type="button" onClick={() => setOwn((o) => !o)} aria-expanded={open} className={`px-fold-btn text-black/60 ${own ? 'mt-2' : ''}`}>
          <span aria-hidden className="mr-[0.45em] inline-block w-[0.6em]">
            {own ? '−' : '+'}
          </span>
          {own ? t('Réduire', 'Less') : (label ?? t('Le raisonnement', 'The reasoning'))}
        </button>
      )}
    </div>
  );
}

/**
 * The switch between the two readings, in the folio's own idiom (the same two-word form as the language switch, next to it).
 * It belongs to this page only.
 */
export function ReadingSwitch() {
  const t = useT() as T;
  const { study, set } = useReading();
  return (
    <div role="group" aria-label={t('Lecture de la page', 'How to read the page')} className="fixed right-[62px] top-0 z-50 whitespace-nowrap px-2 py-1.5 text-[13px] leading-[1.35] text-white mix-blend-difference md:right-[76px] md:px-3">
      <button type="button" onClick={() => set(false)} aria-pressed={!study} title={t('Les images et les écrans, une phrase par moment', 'The pictures and the screens, one sentence per moment')} className={`px-quiet ${study ? 'opacity-50 hover:opacity-100' : ''}`}>
        {t('Galerie', 'Gallery')}
      </button>
      <span className="opacity-50"> / </span>
      <button type="button" onClick={() => set(true)} aria-pressed={study} title={t('La même page, avec tout le raisonnement', 'The same page, with all the reasoning')} className={`px-quiet ${study ? '' : 'opacity-50 hover:opacity-100'}`}>
        {t('Étude', 'Study')}
      </button>
    </div>
  );
}

/** The same choice, said once in a sentence where the case begins. */
export function ReadingLine({ className = '' }: { className?: string }) {
  const t = useT() as T;
  const { study, set } = useReading();
  return (
    <p className={className}>
      {study
        ? t('Vous lisez l’étude complète : tout le raisonnement est déplié. ', 'You are reading the full study: all the reasoning is unfolded. ')
        : t('La page se parcourt d’abord comme une galerie. Le raisonnement est replié sous chaque moment. ', 'The page is first walked through like a gallery. The reasoning is folded under each moment. ')}
      <button type="button" onClick={() => set(!study)} className="px-quiet text-[#0a0a0a] underline decoration-black/25 underline-offset-[3px] hover:decoration-black">
        {study ? t('Revenir à la galerie', 'Back to the gallery') : t('Lire l’étude complète', 'Read the full study')}
      </button>
    </p>
  );
}
