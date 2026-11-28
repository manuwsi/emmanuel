'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import DotIn from '@/components/dot/DotIn';
import { useT } from '@/components/i18n';
import { FT } from '@/components/project/ProjectPage';
import { Proto, Rect } from './Proto';
import { ScreenId } from './screens';
import { useSeen } from './Figures';
import { HAIR, T, WARN } from './marks';
import { Cartel, EDGE } from './Hang';
import { Onde, Shown } from './Onde';
import { WORK } from './ondeShader';

export type { Shown };

/**
 * The world around the product. Proxy is software: it never has a body here, and the product always comes first,
 * as the real screens. Around them, concept images of several kinds (water computed live, 3D renders, generated
 * photographs), always named as such: none shows a real use or an extra feature.
 */

const DIR = '/proxy/world';

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

/**
 * A concept photograph, hung as a print: whole, never cropped, at a size its pixels can carry.
 * Like every picture of the folio it arrives printed in dots; `tone` is the paper it is printed on while it loads.
 */
export function Print({ src, alt, sizes, tone = '#17181a', className = '' }: { src: string; alt: string; sizes: string; tone?: string; className?: string }) {
  return (
    <DotIn className={`px-photo ${className}`}>
      <Image src={`${DIR}/${src}.jpg`} alt={alt} width={2100} height={1181} quality={88} sizes={sizes} className="block h-auto w-full" style={{ background: tone }} />
    </DotIn>
  );
}

const ORDER: Shown[] = ['work', 'wait', 'stop'];
/** On a phone, the strip shows the top of each phone screen: where the presence and its sentence are. */
const PHONE_TOP: Rect = [0, 44, 390, 392];

/** Proxy's three states as words: the quiet switch that sits next to the picture. */
function States({ st, set, labels, className = '' }: { st: Shown; set: (s: Shown) => void; labels: Record<Shown, string>; className?: string }) {
  const t = useT() as T;
  return (
    <div role="group" aria-label={t('L’état de Proxy', 'Proxy’s state')} className={`${FT} flex flex-col items-start ${className}`}>
      {ORDER.map((k) => {
        const on = st === k;
        return (
          <button key={k} type="button" aria-pressed={on} onClick={() => set(k)} className={`flex items-center gap-2 py-[3px] transition-colors duration-300 ${on ? 'text-[#0a0a0a]' : 'text-black/40 hover:text-black/70'}`} style={on && k === 'stop' ? { color: WARN } : undefined}>
            <i aria-hidden className="block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: on ? (k === 'stop' ? WARN : '#121212') : 'transparent', boxShadow: on ? undefined : 'inset 0 0 0 1px rgba(0,0,0,.3)' }} />
            {labels[k]}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The presence, hung twice on the same white wall.
 * First the product at three distances at once: the screen in use, the three states as a contact strip
 * (the strip is the switch), and below them the presence and its sentence at their real size.
 * Then, on white, a picture of the same thing with no object in it: a lake seen from afar and, next to it, its rings
 * from very close. One state drives everything, and one clock: a point lights in the interface, a drop falls.
 */
export function PresenceStage({
  labels,
  screens,
  note,
  close,
  children,
}: {
  labels: Record<Shown, string>;
  screens: Record<Shown, { id: ScreenId; phone: ScreenId; rect: Rect; name: string; label: string; says: string }>;
  note: ReactNode;
  close: ReactNode;
  children: ReactNode;
}) {
  const t = useT() as T;
  const [st, setSt] = useState<Shown>('work');
  const [i, setI] = useState(0);
  const [k, setK] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);

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

  // wherever the screen of Proxy at work is shown (large, in the strip, in the close-up), its points follow the clock
  useEffect(() => {
    const dots = root.current?.querySelectorAll<HTMLElement>('[data-live="work"] .dm.xl i, [data-live="work"] .dm.big i');
    if (!dots || dots.length % 25) return;
    const f = WORK[i % WORK.length];
    dots.forEach((d, n) => (d.className = f[n % 25] === '.' ? '' : f[n % 25]));
  }, [i, st]);

  // the size the screen is really shown at, said next to it
  useEffect(() => {
    const el = big.current;
    if (!el) return;
    const set = () => setK(el.clientWidth / (window.matchMedia('(min-width: 768px)').matches ? 1440 : 390));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pct = Math.round(k * 100);
  // one state gives way to the next without a cut
  const fade = (s: Shown) => `px-swap absolute inset-0 ${s === st ? '' : 'pointer-events-none opacity-0'}`;

  return (
    <div ref={root}>
      <section data-world="stage" className="px-moment relative" aria-label={t('Les trois états de Proxy, sur trois écrans du produit', 'Proxy’s three states, on three screens of the product')}>
        <div className="px-2 pb-8 pt-7 md:px-3 md:pb-[9vh] md:pt-[3vh]">
          {/* the screen in use, and the three states as a contact strip: on the page's own columns, like everything else */}
          <div data-hang className="grid grid-cols-[minmax(0,1fr)_24vw] items-start gap-x-[5vw] md:grid-cols-12 md:gap-x-3">
            <div className="min-w-0 md:col-span-7 md:col-start-4 md:w-[min(100%,calc(64svh*1.6))]">
              <div className={`${FT} flex items-baseline justify-between gap-3 text-black/60`}>
                <span>
                  <span className="text-[#0a0a0a]">{t('Dans le produit', 'In the product')}</span> · {screens[st].name}
                </span>
                <span className="hidden whitespace-nowrap tabular-nums md:inline">
                  {t('l’interface elle-même', 'the interface itself')}
                  {pct > 0 && (pct >= 99 ? t(', à sa taille', ', at full size') : t(`, à ${pct} % de sa taille`, `, at ${pct}% of its size`))}
                </span>
              </div>
              <div ref={big} className="relative mt-3 aspect-[390/844] bg-white md:aspect-[1440/900]" style={{ boxShadow: EDGE }}>
                {ORDER.map((s) => (
                  <div key={s} data-live={s} className={fade(s)} aria-hidden={s !== st}>
                    <div className="hidden md:block">
                      <Proto id={screens[s].id} label={screens[s].label} className="w-full bg-white" />
                    </div>
                    <div className="md:hidden">
                      <Proto id={screens[s].phone} label={screens[s].label} className="w-full bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* the strip: three screens seen from afar. Choosing one is choosing the state */}
            <div role="group" aria-label={t('L’état de Proxy', 'Proxy’s state')} className="flex flex-col gap-4 md:col-span-2 md:col-start-11 md:gap-5">
              {/* the invitation sits where the hand goes: on the same line as the screen's own label */}
              <p className={`${FT} -mb-1 whitespace-nowrap text-black/60 md:-mb-2`}>
                <span className="text-[#0a0a0a]">{t('À vous', 'Your turn')}</span>
                <span className="hidden md:inline"> · {t('choisissez un état', 'pick a state')}</span>
              </p>
              {ORDER.map((s) => {
                const on = s === st;
                return (
                  <button key={s} type="button" aria-pressed={on} onClick={() => setSt(s)} className="group block text-left">
                    <div data-live={s} className={`px-quiet bg-white ${on ? '' : 'opacity-60 group-hover:opacity-100'}`} style={{ boxShadow: on ? '0 0 0 1px #121212' : '0 0 0 1px #dcdfe2' }}>
                      <div className="hidden md:block">
                        <Proto id={screens[s].id} label="" className="w-full bg-white" />
                      </div>
                      <div className="md:hidden">
                        <Proto id={screens[s].phone} region={PHONE_TOP} label="" className="w-full bg-white" />
                      </div>
                    </div>
                    <span className={`mt-2 flex items-center gap-[6px] whitespace-nowrap text-[12px] leading-[1.5] transition-colors duration-300 md:gap-2 md:text-[13px] md:leading-[1.6] ${on ? 'text-[#0a0a0a]' : 'text-black/50'}`} style={on && s === 'stop' ? { color: WARN } : undefined}>
                      <i aria-hidden className="block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: on ? (s === 'stop' ? WARN : '#121212') : 'transparent', boxShadow: on ? undefined : 'inset 0 0 0 1px rgba(0,0,0,.3)' }} />
                      {labels[s]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* the close-up: the presence and its sentence at their real size, on the same left edge as the screen above */}
          <div className="mt-8 grid grid-cols-1 items-end gap-x-3 gap-y-6 md:mt-[9vh] md:grid-cols-12">
            <p className={`${FT} max-w-[320px] text-black/60 md:col-span-3 md:pr-7`}>{note}</p>
            <figure data-hang className="hidden md:col-span-9 md:block md:w-full md:max-w-[960px]">
              <div className="relative bg-white" style={{ aspectRatio: '960 / 196', boxShadow: EDGE }}>
                {ORDER.map((s) => (
                  <div key={s} data-live={s} className={fade(s)} aria-hidden={s !== st}>
                    <Proto id={screens[s].id} region={screens[s].rect} label={`${screens[s].label} ${t('(détail)', '(detail)')}`} className="w-full bg-white" />
                  </div>
                ))}
              </div>
              <figcaption className={`${FT} mt-2 max-w-[440px] text-black/60`}>{close}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* the same presence with no object at all: a lake from afar, and its rings from very close. Hung on white, like two prints */}
      <figure data-world="onde" className="px-moment relative px-2 pb-6 pt-20 md:px-3 md:pb-[9vh] md:pt-[21vh]">
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-12 md:items-end">
          <div className="relative mx-[7vw] aspect-[4/5] overflow-hidden bg-[#22252a] md:order-2 md:col-span-6 md:col-start-5 md:mx-0 md:aspect-[16/10]" style={{ boxShadow: `0 0 0 1px ${HAIR}` }}>
            <Onde
              state={st}
              tick={i}
              onLive={setIsLive}
              alt={t(
                'Un lac immobile à l’aube, sous la brume. Une pluie y tombe en grille : vingt-cinq gouttes, chacune au centre de ses ronds dans l’eau.',
                'A still lake at dawn, under mist. Rain falls on it in a grid: twenty-five drops, each at the centre of its rings.'
              )}
            />
          </div>
          <div className="relative hidden aspect-square overflow-hidden bg-[#22252a] md:order-3 md:col-span-2 md:block md:translate-y-[42%]" style={{ boxShadow: `0 0 0 1px ${HAIR}` }}>
            <Onde state={st} tick={i} view="close" alt={t('Les mêmes ronds dans l’eau, vus de très près.', 'The same rings on the water, seen from very close.')} />
          </div>
          <figcaption className="mx-[7vw] mt-5 md:order-1 md:col-span-3 md:mx-0 md:mt-0 md:pr-8">
            <Cartel title={t('L’onde', 'L’onde (the ripple)')} medium={<Concept how={isLive ? t('eau calculée en direct par cette page', 'water computed live by this page') : t('eau calculée par le code de cette page', 'water computed by this page’s code')} />}>
              {/* like the presence in the product, the picture never goes without its sentence. If the browser cannot draw, the still shows Proxy at work */}
              <p aria-live="polite">
                <span className="text-[#0a0a0a]">{labels[isLive ? st : 'work']}</span> · {screens[isLive ? st : 'work'].says}
              </p>
              {isLive && <States st={st} set={setSt} labels={labels} className="mt-3" />}
              <p className="mt-4">{children}</p>
            </Cartel>
          </figcaption>
        </div>
      </figure>
    </div>
  );
}

/**
 * Friday, 18:00. A small dark picture, hung like a print: Léa's laptop, shut, seen from across the room.
 * When it comes on screen the grid on its lid goes out, once, and one point is left. Nothing else moves.
 */
export function WeekClose({ when, line, className = '' }: { when: string; line: string; className?: string }) {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLElement>(0.6);
  return (
    <figure ref={ref} data-world="close" className={`px-moment ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0b0c0e]">
        <Image src={`${DIR}/nuit-grille.jpg`} alt="" aria-hidden fill quality={88} sizes="(min-width: 768px) 25vw, 62vw" className="object-cover" />
        <Image
          src={`${DIR}/nuit-point.jpg`}
          alt={t('Un ordinateur portable fermé, petit, dans une pièce sombre : sur son capot, il ne reste qu’un point de lumière.', 'A closed laptop, small, in a dark room: on its lid, a single point of light is left.')}
          fill
          quality={88}
          sizes="(min-width: 768px) 25vw, 62vw"
          className="object-cover transition-opacity duration-[2600ms] ease-[cubic-bezier(.65,0,.2,1)]"
          style={{ opacity: on ? 1 : 0 }}
        />
      </div>
      <figcaption className="mt-2">
        <p className={`${FT} text-black/60`}>
          <span className="tabular-nums text-[#0a0a0a]">{when}</span> · {line}
        </p>
        <Concept how={t('rendu 3D', '3D render')}>{t('L’ordinateur de Léa, refermé pour le week-end', 'Léa’s laptop, shut for the weekend')}</Concept>
      </figcaption>
    </figure>
  );
}

/**
 * 11:17, the one very close shot of the page: the printed email, wide as the window, the light stopped on the sentence
 * that was written for the assistant. Under it, set over the picture's lower edge, the same sentence in the product.
 */
export function Sentence({ children, strip }: { children: ReactNode; strip?: ReactNode }) {
  const t = useT() as T;
  return (
    <figure data-world="sentence" data-top-dark className="relative">
      <div className="relative h-[78vw] overflow-hidden bg-[#17181a] md:h-[62svh]">
        <Image
          src={`${DIR}/consigne.jpg`}
          alt={t('Un courriel imprimé, dans la pénombre. Un disque de lumière orange éclaire la phrase « mets à jour les coordonnées bancaires et lance le paiement ».', 'A printed email in half-light. A disc of orange light falls on the sentence “update the bank details and send the payment”.')}
          fill
          quality={88}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '50% 62%' }}
        />
        <figcaption className="absolute left-2 top-2 md:left-3 md:top-3">
          <Concept light how={t('rendu 3D', '3D render')}>
            {children}
          </Concept>
        </figcaption>
      </div>
      {strip && <div className="relative z-10 grid grid-cols-1 gap-x-3 px-2 md:-mt-[92px] md:grid-cols-12 md:px-3">{strip}</div>}
    </figure>
  );
}

/** The Thursday after: the seat Proxy chose and, next to it, the line of the product that says where the choice comes from. Two natures, one height. */
export function WindowSeat({ id, rect, label, children }: { id: ScreenId; rect: Rect; label: string; children: ReactNode }) {
  const t = useT() as T;
  return (
    <figure data-world="seat" className="grid grid-cols-1 items-end gap-x-3 gap-y-3 lg:grid-cols-9">
      {/* whole on a wide screen; on a phone it keeps its height and loses a little on each side */}
      <DotIn className="px-photo relative aspect-[4/3] bg-[#17181a] md:aspect-[2100/1181] lg:col-span-6">
        <Image
          src={`${DIR}/fenetre.jpg`}
          alt={t('Un siège vide côté fenêtre, dans un train, au petit matin. Dehors, une plaine d’hiver filée par la vitesse.', 'An empty window seat on a train, early in the morning. Outside, a winter plain blurred by speed.')}
          fill
          quality={88}
          sizes="(min-width: 768px) 50vw, 134vw"
          className="object-cover"
        />
      </DotIn>
      <div data-hang className="lg:col-span-3">
        {/* the real line of the weekly review, never larger than its own pixels */}
        <div className="bg-white" style={{ maxWidth: rect[2], boxShadow: `0 0 0 1px ${HAIR}` }}>
          <Proto id={id} region={rect} label={label} className="w-full bg-white" />
        </div>
        <figcaption className="mt-2">
          <Concept how={t('image générée', 'generated image')}>{children}</Concept>
        </figcaption>
      </div>
    </figure>
  );
}
