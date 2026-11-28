'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useT } from '@/components/i18n';
import { FT } from '@/components/project/ProjectPage';
import { Proto, Rect } from './Proto';
import { ScreenId } from './screens';
import { useSeen } from './Figures';
import { HAIR, T, WARN } from './marks';
import { Onde, Shown } from './Onde';
import { WORK } from './ondeShader';

export type { Shown };

/**
 * The world around the product. Proxy is software: it never has a body here, and the product always comes first,
 * as the real screens. Around them, concept images of several kinds (water computed live, 3D renders, one staged
 * photograph), always named as such: none shows a real use or an extra feature.
 */

const DIR = '/proxy/world';
/** Where Proxy's light falls in the studio frame (fractions of the picture): the part that changes with its state. */
const LIGHT = { x: 0.375, y: 0.2459, w: 0.3975, h: 0.5052 };
/** The laptop's centre, across the picture: what a narrow screen keeps in the middle. */
const CX = 0.574;

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

/** The studio frame, kept whole on a wide screen and centred on the laptop on a narrow one. Everything inside is placed in fractions of the picture. */
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

const ORDER: Shown[] = ['work', 'wait', 'stop'];

/** The three states of Proxy, as a switch. The same one sits under the product and on the picture: they share one state. */
function Switch({ st, set, labels, dark = false, className = '' }: { st: Shown; set: (s: Shown) => void; labels: Record<Shown, string>; dark?: boolean; className?: string }) {
  const t = useT() as T;
  return (
    <div
      role="group"
      aria-label={t('L’état de Proxy', 'Proxy’s state')}
      className={`${FT} pointer-events-auto inline-flex ${dark ? 'bg-[rgba(16,18,20,.5)] text-white backdrop-blur-sm' : 'bg-white'} ${className}`}
      style={{ boxShadow: dark ? '0 0 0 1px rgba(255,255,255,.16)' : `0 0 0 1px ${HAIR}, 0 18px 40px -18px rgba(18,18,18,.35)` }}
    >
      {ORDER.map((k) => {
        const on = st === k;
        return (
          <button
            key={k}
            type="button"
            aria-pressed={on}
            onClick={() => set(k)}
            className={`flex items-center gap-2 whitespace-nowrap border-r px-3 py-3 last:border-r-0 md:px-4 ${dark ? 'border-white/20' : 'border-[#dcdfe2]'} ${on ? (dark ? 'text-white' : 'text-[#0a0a0a]') : dark ? 'text-white/50' : 'text-black/40'}`}
            style={on && k === 'stop' ? { color: dark ? '#ff7a4d' : WARN } : undefined}
          >
            <i aria-hidden className="block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: on ? (k === 'stop' ? (dark ? '#ff7a4d' : WARN) : dark ? '#fff' : '#121212') : dark ? 'rgba(255,255,255,.28)' : '#d8dbde' }} />
            {labels[k]}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The presence. First the product: three real screens, whole and as large as the window allows, one per state.
 * Then a picture of the same thing with no object in it: still water, and a rain that falls on the grid's 25 points.
 * One switch drives both, and one clock: a point lights in the interface, a drop falls.
 */
export function PresenceStage({
  labels,
  screens,
  note,
  children,
}: {
  labels: Record<Shown, string>;
  screens: Record<Shown, { id: ScreenId; phone: ScreenId; name: string; label: string; says: string }>;
  note: ReactNode;
  children: ReactNode;
}) {
  const t = useT() as T;
  const [st, setSt] = useState<Shown>('work');
  const [i, setI] = useState(0);
  const [k, setK] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLDivElement>(null);

  // one clock for the interface's points and for the rain; it only runs while someone can see them
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !id) id = setInterval(() => setI((x) => x + 1), 520);
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
  }, []);

  // the live screen's own points follow the clock while Proxy works
  useEffect(() => {
    const dots = live.current?.querySelectorAll<HTMLElement>('[data-live="work"] .dm.xl i, [data-live="work"] .dm.big i');
    if (!dots || dots.length % 25) return;
    const f = WORK[i % WORK.length];
    dots.forEach((d, n) => (d.className = f[n % 25] === '.' ? '' : f[n % 25]));
  }, [i, st]);

  // the size the screen is really shown at, said next to it
  useEffect(() => {
    const el = live.current;
    if (!el) return;
    const set = () => setK(el.clientWidth / (window.matchMedia('(min-width: 768px)').matches ? 1440 : 390));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pct = Math.round(k * 100);

  return (
    <div ref={root}>
      {/* the product: a real screen, whole, on the studio's pale ground */}
      <section data-world="stage" className="px-moment relative bg-[#e4e6e8]" aria-label={t('Les trois états de Proxy, sur trois écrans du produit', 'Proxy’s three states, on three screens of the product')}>
        <div className="px-2 pb-3 pt-3 md:px-3 md:pb-5 md:pt-4 lg:px-[4.4vw] lg:pb-7 lg:pt-6">
          <div className="mx-auto max-w-[1440px]">
            <div className={`${FT} flex items-baseline justify-between gap-3 text-black/60`}>
              <span>
                <span className="text-[#0a0a0a]">{t('Dans le produit', 'In the product')}</span> · {screens[st].name}
              </span>
              <span className="whitespace-nowrap tabular-nums">
                {t('l’interface elle-même', 'the interface itself')}
                {pct > 0 && <span className="hidden sm:inline">{pct >= 99 ? t(', à sa taille', ', at full size') : t(`, à ${pct} % de sa taille`, `, at ${pct}% of its size`)}</span>}
              </span>
            </div>
            <div
              ref={live}
              className="relative mx-auto mt-3 aspect-[390/844] w-[86%] bg-white md:mt-4 md:aspect-[1440/900] md:w-full"
              style={{ boxShadow: '0 0 0 1px rgba(18,18,18,.07), 0 44px 90px -46px rgba(18,18,18,.38), 0 14px 28px -18px rgba(18,18,18,.14)' }}
            >
              {ORDER.map((s) => (
                <div key={s} data-live={s} className={`absolute inset-0 transition-opacity duration-300 ${s === st ? '' : 'pointer-events-none opacity-0'}`} aria-hidden={s !== st}>
                  {/* a wide window shows the desktop screen; a phone, the product's own phone screen, close to its real size */}
                  <div className="hidden md:block">
                    <Proto id={screens[s].id} label={screens[s].label} className="w-full bg-white" />
                  </div>
                  <div className="md:hidden">
                    <Proto id={screens[s].phone} label={screens[s].label} className="w-full bg-white" />
                  </div>
                </div>
              ))}
            </div>
            {/* the switch stays within reach for as long as the screen is in the window */}
            <div className="pointer-events-none sticky bottom-[52px] z-10 mt-3 flex justify-center md:bottom-12 md:mt-5">
              <Switch st={st} set={setSt} labels={labels} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-x-3 px-2 pt-3 md:grid-cols-12 md:px-3 md:pt-4">
        <p className={`${FT} max-w-[440px] text-black/60 md:col-span-9 md:col-start-4`}>{note}</p>
      </div>

      {/* the same presence with no object at all: water, computed live */}
      <figure data-world="onde" className="px-moment relative pt-16 md:pt-[14vh]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#22252a] md:aspect-auto md:h-[min(56.25vw,94svh)]">
          <Onde
            state={st}
            tick={i}
            onLive={setIsLive}
            alt={t(
              'Un lac immobile à l’aube, sous la brume. Une pluie y tombe en grille : vingt-cinq gouttes, chacune au centre de ses ronds dans l’eau.',
              'A still lake at dawn, under mist. Rain falls on it in a grid: twenty-five drops, each at the centre of its rings.'
            )}
          />
          <Concept how={isLive ? t('calculée en direct par cette page', 'computed live by this page') : t('calculée par le code de cette page', 'computed by this page’s code')} className="absolute right-2 top-2 text-right md:right-3 md:top-3" />
          {/* like the presence in the product, the picture never goes without its sentence. If the browser cannot draw, the still shows Proxy at work and offers no switch */}
          <div className="absolute inset-x-2 bottom-2 flex flex-col items-start gap-3 md:inset-x-3 md:bottom-3 md:flex-row md:items-end md:justify-between">
            <p className={`${FT} max-w-[440px] text-white/70`} aria-live="polite">
              <span className="text-white">{labels[isLive ? st : 'work']}</span> · {screens[isLive ? st : 'work'].says}
            </p>
            {isLive && <Switch st={st} set={setSt} labels={labels} dark />}
          </div>
        </div>
        <figcaption className="grid grid-cols-1 gap-x-3 px-2 pt-2 md:grid-cols-12 md:px-3">
          <p className={`${FT} max-w-[440px] text-black/60 md:col-span-9 md:col-start-4`}>{children}</p>
        </figcaption>
      </figure>
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
          <Concept how={t('rendu 3D', '3D render')} light className="absolute right-2 top-2 text-right md:bottom-3 md:right-3 md:top-auto">
            {t('L’ordinateur de Léa, refermé pour le week-end', 'Léa’s laptop, shut for the weekend')}
          </Concept>
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
