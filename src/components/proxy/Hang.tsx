'use client';

import { ReactNode, useLayoutEffect } from 'react';
import { useT } from '@/components/i18n';
import { FT } from '@/components/project/ProjectPage';
import { Proto, Rect } from './Proto';
import { SCREENS, ScreenId } from './screens';
import { Key, Ticks } from './Show';

type T = <V,>(fr: V, en: V) => V;

/**
 * The hang. The page is treated as a wall, and the wall is white everywhere: things are placed on it at a chosen distance,
 * not stretched to its width. Nothing here dresses what is shown: no ground, no shadow, no frame beyond a hairline that
 * says where a white screen ends on a white page. What changes from one piece to the next is the piece.
 */
export const EDGE = '0 0 0 1px #dcdfe2';

/**
 * How things arrive on the wall. A piece (a screen, a part of one, a print) comes once, when it enters the window:
 * a slow fade and a few pixels, nothing else. Pieces that enter together follow each other by a breath.
 * Without script, or for those who asked for less motion, everything is simply there.
 */
export function useHang() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const html = document.documentElement;
    const all = Array.from(document.querySelectorAll<HTMLElement>('[data-hang]'));
    // what is already in the window when the page opens stays as it is: nothing blinks
    const vh = window.innerHeight;
    all.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.top < vh && r.bottom > 0) {
        el.dataset.in = '';
        el.dataset.rest = '';
      }
    });
    html.classList.add('px-js');
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        seen
          .sort((p, q) => p.getBoundingClientRect().top - q.getBoundingClientRect().top || p.getBoundingClientRect().left - q.getBoundingClientRect().left)
          .forEach((el, i) => {
            io.unobserve(el);
            el.style.setProperty('--hang-i', String(Math.min(i, 4)));
            el.dataset.in = '';
            window.setTimeout(() => (el.dataset.rest = ''), 1800 + Math.min(i, 4) * 110);
          });
      },
      { rootMargin: '0px 0px -9% 0px', threshold: 0.01 }
    );
    all.forEach((el) => !('in' in el.dataset) && io.observe(el));
    return () => {
      io.disconnect();
      html.classList.remove('px-js');
    };
  }, []);
}

/** Where each screen lives in the coded prototype: a plate is a way in, the real screen is one click away at its own size. */
export const SCREEN_HREF: Record<ScreenId, string> = {
  'aujourdhui': '/proxy/prototype/01-aujourdhui.html',
  'validation': '/proxy/prototype/02-validation.html',
  'journal': '/proxy/prototype/03-journal.html',
  'autonomie': '/proxy/prototype/04-autonomie.html',
  'arret': '/proxy/prototype/05-arret.html',
  'm-demande': '/proxy/prototype/06-mobile.html',
  'premier-jour': '/proxy/prototype/07-premier-jour.html',
  'question': '/proxy/prototype/08-question.html',
  'erreur': '/proxy/prototype/09-erreur.html',
  'bilan': '/proxy/prototype/10-bilan.html',
  'm-accueil': '/proxy/prototype/m-accueil.html',
  'm-journal': '/proxy/prototype/m-journal.html',
  'm-pause': '/proxy/prototype/m-pause.html',
};

/**
 * A whole screen seen from a distance: small, straight on the white wall, with a hairline for an edge.
 * It says where things are; the close-ups next to it say what they are. `marks` frames the parts that are enlarged.
 * The plate opens the real screen in the prototype.
 */
export function Planche({
  id,
  label,
  n,
  name,
  marks = [],
  className = '',
  note,
}: {
  id: ScreenId;
  label: string;
  n?: string;
  name?: ReactNode;
  marks?: { k: string; rect: Rect }[];
  className?: string;
  note?: ReactNode;
}) {
  const t = useT() as T;
  const s = SCREENS[id];
  return (
    <figure data-hang className={className}>
      <a href={SCREEN_HREF[id]} className="group block" aria-label={`${label}. ${t('Ouvrir cet écran dans le prototype', 'Open this screen in the prototype')}`}>
        <div className="px-edge relative">
          <Proto id={id} label="" className="w-full bg-white" />
          {marks.map((m) => (
            <span
              key={m.k}
              aria-hidden
              className="absolute"
              style={{ left: `${(m.rect[0] / s.w) * 100}%`, top: `${(m.rect[1] / s.h) * 100}%`, width: `${(m.rect[2] / s.w) * 100}%`, height: `${(m.rect[3] / s.h) * 100}%` }}
            >
              <Ticks small />
              <Key k={m.k} small className="absolute -left-[5px] -top-[5px] -translate-x-full" />
            </span>
          ))}
        </div>
      </a>
      {(name || note) && (
        <figcaption className={`${FT} mt-2 flex items-baseline justify-between gap-4 text-black/60`}>
          <span>
            {n && <span className="tabular-nums">{n} · </span>}
            <span className="text-[#0a0a0a]">{name}</span>
            {note && <> {note}</>}
          </span>
          <a href={SCREEN_HREF[id]} className="px-quiet shrink-0 whitespace-nowrap underline decoration-black/25 underline-offset-[3px] hover:text-[#0a0a0a] hover:decoration-black/60">
            {t('Ouvrir l’écran', 'Open the screen')} ↗
          </a>
        </figcaption>
      )}
    </figure>
  );
}

/** The label next to a picture, as on a gallery wall: what it is called, then what it is made of. */
export function Cartel({ title, medium, children, className = '', light = false }: { title: ReactNode; medium: ReactNode; children?: ReactNode; className?: string; light?: boolean }) {
  return (
    <div className={`${FT} ${light ? 'text-white/60' : 'text-black/60'} ${className}`}>
      <p className={`font-medium ${light ? 'text-white' : 'text-[#0a0a0a]'}`}>{title}</p>
      <div>{medium}</div>
      {children && <div className="mt-3 max-w-[340px]">{children}</div>}
    </div>
  );
}

/**
 * The product on a phone, at two distances at once. On the left, one screen at its real size, cut where the thumb stops.
 * On the right, the three phone screens seen from afar: each one opens the real screen.
 * The two share the row in the proportion of their shapes, so they keep one height at any width.
 */
export function PhoneDuo({
  detail,
  items,
  children,
  className = '',
}: {
  detail: { id: ScreenId; rect: Rect; label: string };
  items: { id: ScreenId; label: string; name: ReactNode }[];
  children?: ReactNode;
  className?: string;
}) {
  const t = useT() as T;
  const [, , w, h] = detail.rect;
  // the three phones take the width of five of the week's nine columns when the detail is at its real size
  const wall = 577;
  return (
    <figure data-hang className={className} style={{ maxWidth: w + 12 + wall }}>
      <div className="flex items-start gap-3">
        <div className="min-w-0" style={{ flex: `${w} 1 0%`, boxShadow: EDGE }}>
          <Proto id={detail.id} region={detail.rect} label={detail.label} className="w-full bg-white" />
        </div>
        <div className="flex min-w-0 items-start justify-end gap-[6.4%]" style={{ flex: `${wall} 1 0%`, aspectRatio: `${wall} / ${h}` }}>
          {items.map((it) => (
            <a key={it.id} href={SCREEN_HREF[it.id]} className="group block w-[21.6%]" aria-label={`${it.label}. ${t('Ouvrir cet écran dans le prototype', 'Open this screen in the prototype')}`}>
              <div className="px-edge">
                <Proto id={it.id} label="" className="w-full bg-white" />
              </div>
              <span className={`${FT} mt-2 block whitespace-nowrap text-black/60`}>{it.name}</span>
            </a>
          ))}
        </div>
      </div>
      {children && <figcaption className={`${FT} mt-2 max-w-[440px] text-black/60`}>{children}</figcaption>}
    </figure>
  );
}
