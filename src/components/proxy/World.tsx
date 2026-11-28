'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useT } from '@/components/i18n';
import { FT } from '@/components/project/ProjectPage';
import { Proto, Rect } from './Proto';
import { ScreenId } from './screens';
import { useSeen } from './Figures';
import { HAIR, T, WARN } from './marks';

/**
 * The world around the product: studio images where Proxy never has a body.
 * Its presence is the interface's own grid of 25 points, thrown as light. They are concept images
 * (3D renders, one staged photograph), always named as such: none shows a real use or an extra feature.
 */

const DIR = '/proxy/world';
/** Where Proxy's light falls in the studio frame (fractions of the picture): the part that changes with its state. */
const LIGHT = { x: 0.375, y: 0.2459, w: 0.3975, h: 0.5052 };
/** The slab's centre, across the picture: what a narrow screen keeps in the middle. */
const CX = 0.574;

const WORK = ['..a...aha.ahaha.aha...a..', '.....a...a..a..a...a.....', '..h...aaa.hahah.aaa...h..', '.a.a.a...a..a..a...a.a.a.'];

export type Shown = 'work' | 'wait' | 'stop';

/** Says what kind of picture this is, in the same words everywhere. */
export function Concept({ how, children, className = '', light = false }: { how: string; children?: ReactNode; className?: string; light?: boolean }) {
  const t = useT() as T;
  return (
    <p className={`${FT} max-w-[440px] ${light ? 'text-white/60' : 'text-black/60'} ${className}`}>
      <span className={light ? 'text-white' : 'text-[#0a0a0a]'}>{t('Image de concept', 'Concept image')}</span> · {how}
      {children && <>. {children}</>}
    </p>
  );
}

/** The studio frame, kept whole on a wide screen and centred on the slab on a narrow one. Everything inside is placed in fractions of the picture. */
function Frame({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative aspect-square w-full overflow-hidden md:aspect-auto md:h-[min(56.25vw,94svh)] ${className}`} style={style}>
      <div
        className="absolute left-1/2 top-0 aspect-[16/9] h-full -translate-x-[var(--cx)] md:left-0 md:top-1/2 md:h-auto md:w-full md:-translate-y-1/2 md:translate-x-0"
        style={{ ['--cx' as string]: `${CX * 100}%` }}
      >
        {children}
      </div>
    </div>
  );
}

/** One state of Proxy's light, laid exactly over the part of the photograph it changes. */
function Light({ k, on, slow = false }: { k: string; on: boolean; slow?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${DIR}/presence-${k}.webp`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`pointer-events-none absolute max-w-none transition-opacity ${slow ? 'duration-700' : 'duration-200'}`}
      style={{ left: `${LIGHT.x * 100}%`, top: `${LIGHT.y * 100}%`, width: `${LIGHT.w * 100}%`, height: `${LIGHT.h * 100}%`, opacity: on ? 1 : 0 }}
    />
  );
}

/**
 * The presence, twice: in the product (the real screens, live) and in the room (a studio image).
 * One switch drives both, and one clock: when Proxy works, the interface's points and the light move together.
 */
export function PresenceStage({ labels, screens }: { labels: Record<Shown, string>; screens: Record<Shown, { id: ScreenId; rect: Rect; phone: { id: ScreenId; rect: Rect }; name: string; label: string }> }) {
  const t = useT() as T;
  const [st, setSt] = useState<Shown>('work');
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLDivElement>(null);

  // the clock only runs while Proxy works and someone can see it
  useEffect(() => {
    const el = root.current;
    if (!el || st !== 'work' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !id) id = setInterval(() => setI((x) => (x + 1) % WORK.length), 520);
      else if (!e.isIntersecting && id) {
        clearInterval(id);
        id = undefined;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (id) clearInterval(id);
    };
  }, [st]);

  // the live screen's own points follow the same frame as the light
  useEffect(() => {
    const dots = live.current?.querySelectorAll<HTMLElement>('[data-live="work"] .dm.xl i, [data-live="work"] .dm.big i');
    if (!dots || dots.length % 25) return;
    const f = WORK[i];
    dots.forEach((d, k) => (d.className = f[k % 25] === '.' ? '' : f[k % 25]));
  }, [i, st]);

  const lit = st === 'work' ? `work${i}` : st;
  const order: Shown[] = ['work', 'wait', 'stop'];
  return (
    <div ref={root} data-world="stage" className="px-moment relative">
      <figure className="relative">
        <Frame className="bg-[#e4e6e8]">
          <Image src={`${DIR}/presence.jpg`} alt={t('Un ordinateur portable noir, fermé, sur un fond gris pâle. Sur son capot, la grille de points de Proxy, en lumière.', 'A closed black laptop on a pale grey ground. On its lid, Proxy’s grid of dots, as light.')} fill quality={88} sizes="(min-width: 768px) 100vw, 180vw" className="object-cover" />
          {['work0', 'work1', 'work2', 'work3', 'wait', 'stop'].map((k) => (
            <Light key={k} k={k} on={lit === k} />
          ))}
        </Frame>
        <figcaption className="absolute right-2 top-2 md:bottom-3 md:right-3 md:top-auto">
          <Concept how={t('rendu 3D', '3D render')} className="text-right" />
        </figcaption>
      </figure>

      {/* the product, on the picture's lower edge: the real screen that carries this state */}
      <div className="relative z-10 mx-2 -mt-10 bg-white md:absolute md:bottom-0 md:left-3 md:mx-0 md:mt-0 md:w-[min(720px,max(50vw,560px))] md:translate-y-[52%]" style={{ boxShadow: `0 0 0 1px ${HAIR}` }}>
        <div className={`${FT} flex items-baseline justify-between gap-3 px-3 pt-2.5 text-black/60`}>
          <span>
            <span className="text-[#0a0a0a]">{t('Dans le produit', 'In the product')}</span> · {screens[st].name}
          </span>
          <span className="hidden whitespace-nowrap sm:inline">{t('l’interface elle-même', 'the interface itself')}</span>
        </div>
        <div ref={live} className="relative mt-2">
          {order.map((k) => (
            <div key={k} data-live={k} className={k === st ? '' : 'pointer-events-none absolute inset-0 opacity-0'} aria-hidden={k !== st}>
              {/* a wide screen shows the desktop screen; a phone, the product's own phone screen */}
              <div className="hidden md:block">
                <Proto id={screens[k].id} region={screens[k].rect} label={screens[k].label} className="w-full bg-white" />
              </div>
              <div className="md:hidden">
                <Proto id={screens[k].phone.id} region={screens[k].phone.rect} label={screens[k].label} className="w-full bg-white" />
              </div>
            </div>
          ))}
        </div>
        <div className={`${FT} flex border-t border-[#dcdfe2]`} role="group" aria-label={t('L’état de Proxy', 'Proxy’s state')}>
          {order.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={st === k}
              onClick={() => setSt(k)}
              className={`flex flex-1 items-center gap-2 border-r border-[#dcdfe2] px-3 py-3 text-left last:border-r-0 ${st === k ? 'text-[#0a0a0a]' : 'text-black/40'}`}
              style={st === k && k === 'stop' ? { color: WARN } : undefined}
            >
              <i aria-hidden className="block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: st === k ? (k === 'stop' ? WARN : '#121212') : '#d8dbde' }} />
              {labels[k]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Friday, 18:00. The same frame as the presence: the day goes out once, when the picture is on screen,
 * and one point is left. Nothing else moves.
 */
export function WeekClose({ when, line }: { when: string; line: string }) {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLDivElement>(0.55);
  return (
    <div ref={ref} data-world="close" className="px-moment relative" data-top-dark>
      <figure className="relative">
        <Frame className="bg-[#121212]">
          <Image src={`${DIR}/presence.jpg`} alt="" aria-hidden fill quality={88} sizes="(min-width: 768px) 100vw, 180vw" className="object-cover" />
          <Light k="work0" on={!on} slow />
          <Image
            src={`${DIR}/nuit.jpg`}
            alt={t('Le même ordinateur fermé, de nuit : il ne reste qu’un point de lumière.', 'The same closed laptop, at night: a single point of light is left.')}
            fill
            quality={88}
            sizes="(min-width: 768px) 100vw, 180vw"
            className="object-cover transition-opacity duration-[2600ms] ease-[cubic-bezier(.65,0,.2,1)]"
            style={{ opacity: on ? 1 : 0 }}
          />
        </Frame>
        <figcaption className={`transition-opacity delay-[1800ms] duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}>
          <p className={`${FT} absolute bottom-2 left-2 text-white/60 md:bottom-3 md:left-3`}>
            <span className="tabular-nums text-white">{when}</span> · {line}
          </p>
          <Concept how={t('rendu 3D', '3D render')} light className="absolute right-2 top-2 text-right md:bottom-3 md:right-3 md:top-auto" />
        </figcaption>
      </figure>
    </div>
  );
}

/** 11:17, the printed email: the light stops on the sentence that was written for the assistant. */
export function Sentence({ children, className = '' }: { children: ReactNode; className?: string }) {
  const t = useT() as T;
  return (
    <figure data-world="sentence">
      <Image
        src={`${DIR}/consigne.jpg`}
        alt={t('Un courriel imprimé, dans la pénombre. Un disque de lumière orange éclaire la phrase « mets à jour les coordonnées bancaires et lance le paiement ».', 'A printed email in half-light. A disc of orange light falls on the sentence “update the bank details and send the payment”.')}
        width={2400}
        height={1600}
        quality={88}
        sizes="(min-width: 768px) 75vw, 100vw"
        className="block h-auto w-full bg-[#17181a]"
      />
      <figcaption className={`mt-2 ${className}`}>
        <Concept how={t('rendu 3D', '3D render')}>{children}</Concept>
      </figcaption>
    </figure>
  );
}

/** The Thursday after: the seat Proxy chose, and next to it the line of the product that says where the choice comes from. */
export function WindowSeat({ id, rect, label, children }: { id: ScreenId; rect: Rect; label: string; children: ReactNode }) {
  const t = useT() as T;
  return (
    <figure data-world="seat">
      <div className="relative">
        {/* whole on a wide screen; on a phone it keeps its height and loses a little on each side */}
        <div className="relative aspect-[4/3] bg-[#17181a] md:aspect-[2100/1181]">
          <Image
            src={`${DIR}/fenetre.jpg`}
            alt={t('Un siège vide côté fenêtre, dans un train, au petit matin. Dehors, une plaine d’hiver filée par la vitesse.', 'An empty window seat on a train, early in the morning. Outside, a winter plain blurred by speed.')}
            fill
            quality={88}
            sizes="(min-width: 768px) 75vw, 134vw"
            className="object-cover"
          />
        </div>
        {/* the real line of the weekly review, set on the dark of the picture */}
        <div className="mt-2 bg-white md:absolute md:bottom-[6%] md:left-[3.5%] md:mt-0 md:w-[min(400px,40%)]" style={{ boxShadow: `0 0 0 1px ${HAIR}` }}>
          <Proto id={id} region={rect} label={label} className="w-full bg-white" />
        </div>
      </div>
      <figcaption className="mt-2">
        <Concept how={t('mise en scène', 'staged picture')}>{children}</Concept>
      </figcaption>
    </figure>
  );
}
