'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n';
import { FT } from '@/components/project/ProjectPage';
import { Proto, Rect } from './Proto';
import { ScreenId } from './screens';
import { Key, usePresence } from './Show';
import { SCREEN_HREF } from './Hang';
import { useSeen } from './Figures';
import { useSize } from './marks';

type T = <V,>(fr: V, en: V) => V;

/**
 * One plate. `from` is a square of a real screen, seen from a step back (a whole button, a whole gauge); `rect` is the square
 * inside it that the plate is about. The screen is laid out once for the wide view, and a camera closes in on the detail:
 * when the plate arrives, and again each time the hand leaves it. Under the hand, the camera steps back to show where
 * the detail comes from.
 */
type Plate = { k: string; id: ScreenId; rect: Rect; from: Rect; label: string; name: string; rule: string; live?: boolean };

function PlateView({ p, on, i, cell }: { p: Plate; on: boolean; i: number; cell: number }) {
  const t = useT() as T;
  const ref = useRef<HTMLAnchorElement>(null);
  // the presence keeps working, even from this close
  usePresence(ref, p.live ? '.dm.xl' : '.px-none', 520);
  // once every plate has arrived, they answer the hand without waiting for each other
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    if (!on) return;
    const id = window.setTimeout(() => setArrived(true), 3200);
    return () => window.clearTimeout(id);
  }, [on]);
  const [mx, my, mw] = p.rect;
  const [cx, cy, cw] = p.from;
  const S = cw / mw;
  // the point of the wide view that does not move while the camera closes in on the detail
  const ox = ((S * (mx - cx)) / cw / (S - 1)) * 100;
  const oy = ((S * (my - cy)) / cw / (S - 1)) * 100;
  const times = cell ? Math.round(cell / mw) : 0;
  return (
    <a
      ref={ref}
      href={SCREEN_HREF[p.id]}
      className="px-plate group relative block aspect-square overflow-hidden bg-white"
      aria-label={`${p.label}${times ? t(`, agrandi ${times} fois`, `, enlarged ${times} times`) : ''}. ${t('Ouvrir cet écran dans le prototype', 'Open this screen in the prototype')}`}
    >
      <div className="px-plate-cam h-full w-full" data-on={on ? '' : undefined} style={{ ['--s' as string]: S, transformOrigin: `${ox}% ${oy}%`, transitionDelay: on && !arrived ? `${i * 110}ms` : undefined }}>
        <Proto id={p.id} region={p.from} label="" eager={p.live} className="h-full w-full" />
      </div>
      <Key k={p.k} className="absolute left-2 top-2" />
      {times > 0 && (
        <span aria-hidden className={`${FT} px-plate-times absolute bottom-[6px] right-2 tabular-nums text-white mix-blend-difference`} data-on={arrived ? '' : undefined}>
          × {times}
        </span>
      )}
    </a>
  );
}

/**
 * The design system, as a picture before it is a sheet. Six rules; each is shown where it applies, on the real interface,
 * from very close: the markup of the screens is the same as everywhere on the page, only the distance changes.
 * Nothing is redrawn, so nothing can drift from the product.
 */
export function SystemCloseUp() {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLDivElement>(0.4);
  const grid = useRef<HTMLDivElement>(null);
  // the width of one plate, to say how many times the interface is enlarged
  const [gw] = useSize(grid);
  const cell = gw ? ((grid.current?.firstElementChild as HTMLElement | null)?.clientWidth ?? 0) : 0;
  const plates: Plate[] = [
    {
      k: 'A',
      id: 'validation',
      rect: [1071, 809.5, 34, 34],
      from: [1064, 722, 178, 178],
      label: t('Le coin du bouton « Valider et réserver »', 'The corner of the “Approve and book” button'),
      name: t('0 px', '0 px'),
      rule: t('Aucun arrondi. L’action principale est un aplat d’encre.', 'No rounded corners. The primary action is a block of ink.'),
    },
    {
      k: 'B',
      id: 'aujourdhui',
      rect: [194.5, 117, 47, 47],
      from: [180, 76, 200, 200],
      label: t('Les deux premières lettres de la phrase « Proxy compare deux offres »', 'The first two letters of the sentence “Proxy compare deux offres”'),
      name: 'Newsreader',
      rule: t('La voix de Proxy : une phrase, jamais un titre de rubrique.', 'Proxy’s voice: a sentence, never a section heading.'),
    },
    {
      k: 'C',
      id: 'validation',
      rect: [307.5, 420.8, 30, 30],
      from: [236, 350, 170, 170],
      label: t('L’étiquette « irréversible » de l’étape de paiement', 'The “irréversible” tag of the payment step'),
      name: t('Orange', 'Orange'),
      rule: t('Réservé à l’irréversible et à la pause. Une fois par écran.', 'Kept for the irreversible and the pause. Once per screen.'),
    },
    {
      k: 'D',
      id: 'aujourdhui',
      rect: [73, 117, 86, 86],
      from: [44, 88, 144, 144],
      label: t('Le centre de la grille de présence, pendant que Proxy travaille', 'The centre of the presence grid, while Proxy is working'),
      name: t('25 points', '25 dots'),
      rule: t('La présence. Le seul élément animé, toujours avec sa phrase.', 'The presence. The only animated element, always with its sentence.'),
      live: true,
    },
    {
      k: 'E',
      id: 'aujourdhui',
      rect: [1088, 14, 46, 46],
      from: [1030, 0, 165, 165],
      label: t('Le budget de la semaine, dans la barre du haut', 'The week’s budget, in the top bar'),
      name: 'Geist Mono',
      rule: t('Heures, montants, traces : ce qu’on vérifie.', 'Times, amounts, traces: what you check.'),
    },
    {
      k: 'F',
      id: 'aujourdhui',
      rect: [1235, 154, 30, 30],
      from: [1084, 68, 332, 332],
      label: t('Deux segments de la jauge d’autonomie d’un domaine', 'Two segments of a domain’s autonomy gauge'),
      name: t('4 niveaux', '4 levels'),
      rule: t('L’autonomie d’un domaine : un segment plein par niveau accordé.', 'A domain’s autonomy: one filled segment per level granted.'),
    },
  ];
  return (
    <figure ref={ref} data-world="system" className="px-moment">
      {/* one sheet cut in six by hairlines: the product's own way of separating without boxing */}
      <div ref={grid} data-hang className="grid grid-cols-2 gap-px bg-[#dcdfe2] p-px sm:grid-cols-3">
        {plates.map((p, i) => (
          <PlateView key={p.k} p={p} on={on} i={i} cell={cell} />
        ))}
      </div>
      <figcaption className={`${FT} mt-4`}>
        <ul className="grid grid-cols-1 gap-x-3 gap-y-3 text-black/60 sm:grid-cols-3">
          {plates.map((p) => (
            <li key={p.k} className="flex gap-2 pr-4">
              <Key k={p.k} className="mt-[3px] shrink-0" />
              <span>
                <span className="text-[#0a0a0a]">{p.name}</span> · {p.rule}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[440px] text-black/60">
          <span className="text-[#0a0a0a]">{t('L’interface elle-même', 'The interface itself')}</span> ·{' '}
          {t('six détails des écrans du prototype, vus de très près. Rien n’est redessiné. ', 'six details of the prototype’s screens, seen from very close. Nothing is redrawn. ')}
          <span className="hidden [@media(hover:hover)]:inline">{t('Survolez une plaque : la caméra recule et montre d’où elle vient.', 'Hover a plate: the camera steps back and shows where it comes from.')}</span>
          <span className="[@media(hover:hover)]:hidden">{t('Chaque plaque ouvre l’écran d’où elle vient.', 'Each plate opens the screen it comes from.')}</span>
        </p>
      </figcaption>
    </figure>
  );
}
