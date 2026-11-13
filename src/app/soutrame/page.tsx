'use client';

/**
 * SOUTRAME.CYCLE — brand shop (Cycle 01 · Chimera School)
 *
 * Direction: the garment comes first. Large photography, a calm layout, and a single
 * signature taken from the brand concept:
 *  - TRAME (the inner thread): images are woven in strip by strip, on the hero, the
 *    product cards, the lookbook and the product sheet. Buttons fill the same way.
 *  - CYCLE (nothing is linear, it comes back): the hero shows the lookbook as an endless loop.
 * Type: Ade Display (titles, uppercase) for the brand voice, General Sans for everything else.
 * Frosted glass only appears over photography, as an echo of the nylon's sheen.
 *
 * To open sales, fill in DROP below:
 *  - price: e.g. '240 €' for the set (or a price per piece in PIECES)
 *  - sizes: e.g. ['S', 'M', 'L']
 *  - checkoutUrl: the Stripe Payment Link (https://buy.stripe.com/...)
 * While checkoutUrl is null, every buy button reads "Coming soon" and is disabled.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useLang, useT } from '@/components/i18n';

const DROP = {
  price: null as string | null,
  sizes: [] as string[],
  checkoutUrl: null as string | null,
  instagram: 'https://www.instagram.com/manu.wsi/',
};

/** Shown greyed-out in the size picker until DROP.sizes is filled in. */
const SIZE_PREVIEW = ['S', 'M', 'L', 'XL'];

const EASE = [0.22, 1, 0.36, 1] as const;
/** Titles: General Sans, the brand typeface, set tight and uppercase. */
const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.025em' } as const;
/** Ade Display is kept for a single, more intimate line: the mantra. */
const MANTRA = { fontFamily: 'var(--font-ade), serif' } as const;

type Shot = { src: string; label: { fr: string; en: string } };

const LOOKBOOK: Shot[] = [
  { src: '/soutrame/front.jpg', label: { fr: 'Face', en: 'Front' } },
  { src: '/soutrame/hood-pull.jpg', label: { fr: 'Capuche', en: 'Hood up' } },
  { src: '/soutrame/back-34.jpg', label: { fr: 'Dos, trois-quarts', en: 'Back, three-quarter' } },
  { src: '/soutrame/side.jpg', label: { fr: 'Profil', en: 'Side' } },
  { src: '/soutrame/hood-profile.jpg', label: { fr: 'Capuche, profil', en: 'Hood, profile' } },
  { src: '/soutrame/sitting.jpg', label: { fr: 'Assis', en: 'Seated' } },
  { src: '/soutrame/back.jpg', label: { fr: 'Dos', en: 'Back' } },
  { src: '/soutrame/detail-jacket.jpg', label: { fr: 'Détail veste', en: 'Jacket detail' } },
  { src: '/soutrame/detail-waist.jpg', label: { fr: 'Détail taille', en: 'Waist detail' } },
  { src: '/soutrame/detail-hem.jpg', label: { fr: 'Ourlet et cordons', en: 'Hem and drawcords' } },
];

const PIECES = [
  {
    id: '01',
    name: 'Chimera School Track Jacket',
    short: { fr: 'Veste', en: 'Jacket' },
    image: '/soutrame/front.jpg',
    hover: '/soutrame/detail-jacket.jpg',
    gallery: ['/soutrame/front.jpg', '/soutrame/hood-pull.jpg', '/soutrame/detail-jacket.jpg', '/soutrame/hood-profile.jpg', '/soutrame/back-34.jpg'],
    price: null as string | null,
    details: {
      fr: [
        'Veste de survêtement courte à capuche',
        'Fermeture brandebourg en cordon tressé',
        'Empiècements en mesh, découpe en étoile au dos',
        'Poches zippées, cordons à l’ourlet et aux poignets',
        'Chimère brodée sur la poitrine',
      ],
      en: [
        'Cropped hooded track jacket',
        'Braided cord frog closure',
        'Mesh inserts, star-shaped back panel',
        'Zipped pockets, drawcords at hem and cuffs',
        'Embroidered chimera on the chest',
      ],
    },
  },
  {
    id: '02',
    name: 'Chimera School Zip-off Pant',
    short: { fr: 'Pantalon', en: 'Trousers' },
    image: '/soutrame/back.jpg',
    hover: '/soutrame/detail-waist.jpg',
    gallery: ['/soutrame/back.jpg', '/soutrame/side.jpg', '/soutrame/detail-waist.jpg', '/soutrame/detail-hem.jpg', '/soutrame/sitting.jpg'],
    price: null as string | null,
    details: {
      fr: [
        'Pantalon large, jambes zippées : se porte en short',
        'Empiècements en mesh et rivets métalliques',
        'Poches zippées en biais',
        'Poches cargo au dos, cerf brodé',
        'Taille élastique à cordon',
      ],
      en: [
        'Wide trousers with zip-off legs: wear them as shorts',
        'Mesh panels and metal studs',
        'Angled zipped pockets',
        'Back cargo pockets, embroidered deer',
        'Elastic drawstring waist',
      ],
    },
  },
];

type Piece = (typeof PIECES)[number];

/* ───────────────────────── brand primitives ───────────────────────── */

const SATELLITES = [58, -58, 102, -102, 152, -152];

/** The SOUTRAME mark, rebuilt on a strict geometry. `assemble` animates the satellites in. */
function Mark({ className = '', assemble = false }: { className?: string; assemble?: boolean }) {
  return (
    <svg viewBox="-71.78 -46.68 143.55 113.12" fill="currentColor" className={className} aria-label="SOUTRAME" role="img">
      <motion.circle cx="0" cy="0" r="30" initial={assemble ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: EASE }} />
      {SATELLITES.map((deg, i) => {
        const t = (deg * Math.PI) / 180;
        const x = 56 * Math.sin(t);
        const y = -56 * Math.cos(t);
        return (
          <motion.g key={deg} initial={assemble ? { opacity: 0, x: x * 0.6, y: y * 0.6 } : false} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.06 }}>
            <rect x="-4.5" y="-56" width="9" height="56" transform={`rotate(${deg})`} />
            <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="17" />
          </motion.g>
        );
      })}
    </svg>
  );
}

/** Frosted panel — only over photography, as an echo of the nylon's sheen. */
function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
  return (
    <div className={`${positioned ? '' : 'relative '}border border-white/[0.16] bg-[#151515]/35 backdrop-blur-2xl backdrop-saturate-[1.4] ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_40%)]" />
      {children}
    </div>
  );
}

/** Square button. On hover, the fill is woven in, thread by thread. */
function Btn({ children, href, disabled = false, full = false, external = false }: { children: React.ReactNode; href?: string; disabled?: boolean; full?: boolean; external?: boolean }) {
  const cls = `group relative inline-flex h-[52px] items-center justify-between gap-8 overflow-hidden border px-5 text-[13px] ${full ? 'w-full' : 'w-full sm:w-auto sm:min-w-[280px]'} ${
    disabled ? 'cursor-not-allowed border-white/15 text-white/45' : 'border-[#ecebe6] text-[#ecebe6]'
  }`;
  const inner = (
    <>
      {!disabled && (
        <span aria-hidden className="absolute inset-0 flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={`block flex-1 scale-x-0 bg-[#ecebe6] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 ${i % 2 ? 'origin-right' : 'origin-left'}`}
              style={{ transitionDelay: `${i * 35}ms` }}
            />
          ))}
        </span>
      )}
      <span className="relative transition-colors duration-300 group-hover:text-[#0b0b0b]">{children}</span>
      <span className="relative transition-colors duration-300 group-hover:text-[#0b0b0b]">{disabled ? '' : '→'}</span>
    </>
  );
  if (disabled)
    return (
      <span aria-disabled="true" className={cls}>
        {inner}
      </span>
    );
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  );
}

function BuyButton({ full = false }: { full?: boolean }) {
  const t = useT();
  return DROP.checkoutUrl ? (
    <Btn href={DROP.checkoutUrl} external full={full}>
      {t('Précommander', 'Pre-order')}
      {DROP.price ? ` — ${DROP.price}` : ''}
    </Btn>
  ) : (
    <Btn disabled full={full}>
      {t('Bientôt disponible', 'Coming soon')}
    </Btn>
  );
}

/** Image woven in, strip by strip. */
function Weave({ src, alt, strips = 12, priority = false, sizes }: { src: string; alt: string; strips?: number; priority?: boolean; sizes: string }) {
  const stripH = 100 / strips + 0.2; // % of the container; the small overlap hides seams between strips
  return (
    <div className="absolute inset-0">
      {Array.from({ length: strips }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 overflow-hidden"
          style={{ top: `${(i * 100) / strips}%`, height: `${stripH}%`, transformOrigin: i % 2 ? 'right' : 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.045 }}
        >
          {/* sized and offset in container units, so the woven image lines up pixel-for-pixel with the one underneath */}
          <div className="absolute inset-x-0" style={{ top: `-${((i * 100) / strips / stripH) * 100}%`, height: `${(100 / stripH) * 100}%` }}>
            <Image src={src} alt={i === 0 ? alt : ''} fill priority={priority} sizes={sizes} className="object-cover" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}


/* ───────────────────────── universe ─────────────────────────
 * Snow: the scattered dots of the SOUTRAME CYCLE posters, set in motion.
 * Silence, cold, too-large spaces: atmosphere without explanation.
 * Drawn on a single canvas behind the content; depth = size, speed and blur.
 */
const UNIVERSE = {
  landscape: null as string | null, // e.g. '/soutrame/landscape.jpg' — misty plain from the "Cycle 01" announcement
};

function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    type Flake = { x: number; y: number; r: number; z: number; sway: number; phase: number };
    let w = 0;
    let h = 0;
    let flakes: Flake[] = [];
    let wind = 0;
    let targetWind = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const make = (y?: number): Flake => {
      const z = Math.random(); // 0 = far, 1 = near
      return {
        x: Math.random() * w,
        y: y ?? Math.random() * h,
        r: 0.5 + z * z * 2.6,
        z,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000));
      flakes = Array.from({ length: count }, () => make());
    };

    const onMove = (e: PointerEvent) => {
      targetWind = (e.clientX / w - 0.5) * 0.9;
    };

    const draw = (time: number) => {
      wind += (targetWind - wind) * 0.02;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        const speed = 0.12 + f.z * 0.55;
        f.y += speed;
        f.x += Math.sin(time * 0.0004 * f.sway + f.phase) * 0.18 + wind * (0.3 + f.z);
        if (f.y - f.r > h) Object.assign(f, make(-f.r * 2));
        if (f.x < -10) f.x = w + 10;
        if (f.x > w + 10) f.x = -10;
        ctx.globalAlpha = 0.18 + f.z * 0.5;
        ctx.shadowBlur = f.z > 0.8 ? 6 : 0;
        ctx.shadowColor = 'rgba(236,235,230,0.6)';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ecebe6';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduce) {
      // a still, quiet snowfield
      for (const f of flakes) {
        ctx.globalAlpha = 0.18 + f.z * 0.4;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ecebe6';
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}

/** "SOUTRAME — CYCLE": the two words drift toward each other as you scroll, in the snow. */
function CycleInterlude() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xLeft = useTransform(scrollYProgress, [0, 0.5, 1], ['-14vw', '0vw', '4vw']);
  const xRight = useTransform(scrollYProgress, [0, 0.5, 1], ['14vw', '0vw', '-4vw']);
  const line = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  // the words only drift on wide screens; on mobile they are stacked
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <section ref={ref} className="relative z-[1] overflow-hidden">
      {UNIVERSE.landscape && (
        <div aria-hidden className="absolute inset-0">
          <Image src={UNIVERSE.landscape} alt="" fill sizes="100vw" className="object-cover opacity-40 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-transparent to-[#0b0b0b]" />
        </div>
      )}
      <div className="relative flex min-h-[90svh] flex-col items-center justify-center px-5 py-28 md:px-8">
        <div className="flex w-full flex-col items-center gap-2 md:flex-row md:justify-center md:gap-[4vw]">
          <motion.p style={{ x: wide ? xLeft : 0, ...DISPLAY }} className="whitespace-nowrap text-[12vw] uppercase leading-none md:text-[5.2vw]">
            Soutrame
          </motion.p>
          <motion.span style={{ scaleX: line }} aria-hidden className="hidden h-px w-[6vw] origin-center bg-white/50 md:block" />
          <motion.p style={{ x: wide ? xRight : 0, ...DISPLAY }} className="whitespace-nowrap text-[12vw] uppercase leading-none md:text-[5.2vw]">
            Cycle
          </motion.p>
        </div>
        <Reveal className="mt-14 text-center">
          <p className="text-[13px] text-white/50">{t('Annonce de la première collection', 'Announcing the first collection')}</p>
          <p className="mt-3 text-[20px] uppercase leading-none md:text-[24px]">
            <span style={DISPLAY}>Cycle 01</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── intro ───────────────────────── */

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(onDone, reduce ? 0 : 1600);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0b0b0b] text-[#ecebe6]" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: EASE }}>
      <Mark assemble className="w-16 md:w-20" />
    </motion.div>
  );
}

/* ───────────────────────── hero ───────────────────────── */

const CYCLE_MS = 4500;

function Hero({ ready, onOpen }: { ready: boolean; onOpen: (p: Piece) => void }) {
  const t = useT();
  const { lang } = useLang();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const prev = (i - 1 + LOOKBOOK.length) % LOOKBOOK.length;

  useEffect(() => {
    if (!ready || paused) return;
    const id = setTimeout(() => setI((v) => (v + 1) % LOOKBOOK.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [i, paused, ready]);

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section ref={ref} className="relative z-[1] px-5 pb-16 pt-20 md:h-[100svh] md:min-h-[700px] md:px-8 md:pb-8 md:pt-20">
      <div className="grid h-full grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
        {/* the cycle */}
        <div className="relative md:col-span-6 md:col-start-1 md:flex md:h-full md:items-center">
          <motion.div style={{ y: yImg }} className="relative w-full md:w-[min(100%,calc((100svh-9rem)*0.8))]">
            <button
              onClick={() => setI((v) => (v + 1) % LOOKBOOK.length)}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-label={t('Image suivante', 'Next image')}
              className="relative block aspect-[4/5] w-full overflow-hidden bg-[#141414]"
            >
              <Image src={LOOKBOOK[prev].src} alt="" fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
              {ready ? (
                <Weave key={LOOKBOOK[i].src} src={LOOKBOOK[i].src} alt={`Chimera School — ${LOOKBOOK[i].label[lang]}`} priority={i === 0} sizes="(min-width:768px) 58vw, 100vw" />
              ) : (
                <Image src={LOOKBOOK[0].src} alt="Chimera School" fill priority sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
              )}
            </button>
            {/* cycle progress, kept as a single hairline */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/20">
              <motion.div
                key={`${i}-${paused}-${ready}`}
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: paused || !ready ? '0%' : '100%' }}
                transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </div>

        {/* the collection */}
        <div className="relative flex flex-col justify-center md:col-span-5 md:col-start-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-[13px] text-white/50">
            {t('Cycle 01 — première collection', 'Cycle 01 — first collection')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
            className="mt-4 text-[42px] uppercase leading-[0.92] md:text-[min(4.4vw,68px)]"
            style={DISPLAY}
          >
            Chimera
            <br />
            School
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1, delay: 0.6 }} className="mt-5 max-w-[380px] text-[14px] leading-relaxed text-white/65">
            {t(
              'Une veste et un pantalon. Un uniforme revisité, entre vêtement technique, mesh et broderie.',
              'One jacket, one pair of trousers. A reworked uniform, between technical wear, mesh and embroidery.'
            )}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1, delay: 0.75 }} className="mt-8 border-t border-white/10">
            {PIECES.map((p) => (
              <button key={p.id} onClick={() => onOpen(p)} className="group flex w-full items-center gap-4 border-b border-white/10 py-3 text-left">
                <div className="relative aspect-[4/5] w-11 shrink-0 overflow-hidden bg-[#141414]">
                  <Image src={p.image} alt="" fill sizes="56px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1">
                  <span className="block text-[14px] text-white/90">{p.name}</span>
                  <span className="mt-0.5 block text-[13px] text-white/45">{p.price ?? DROP.price ?? t('Prix à venir', 'Price soon')}</span>
                </div>
                <span className="text-[13px] text-white/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white">{t('Voir', 'View')} →</span>
              </button>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1, delay: 0.9 }} className="mt-6">
            <BuyButton />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── collection ───────────────────────── */

function Collection({ onOpen }: { onOpen: (p: Piece) => void }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <section id="collection" className="relative z-[1] px-5 pb-28 pt-24 md:px-8 md:pb-40 md:pt-40">
      <Reveal className="mx-auto flex max-w-[1080px] flex-wrap items-end justify-between gap-6">
        <h2 className="text-[30px] uppercase leading-[0.95] md:text-[44px]" style={DISPLAY}>
          {t('La collection', 'The collection')}
        </h2>
        <p className="text-[13px] text-white/50">{t('Deux pièces — Cycle 01', 'Two pieces — Cycle 01')}</p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-[1080px] grid-cols-1 gap-y-16 md:mt-16 md:grid-cols-2 md:gap-x-12">
        {PIECES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1} className={i === 1 ? 'md:mt-28' : ''}>
            <article
              className="group cursor-pointer"
              onClick={() => onOpen(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p)}
              aria-label={`${p.name} — ${t('voir la pièce', 'view piece')}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#141414]">
                <Image src={p.image} alt={p.name} fill sizes="(min-width:768px) 48vw, 100vw" className="object-cover transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
                {/* on hover, the detail shot is woven in */}
                <div className="absolute inset-0 flex flex-col">
                  {Array.from({ length: 10 }).map((_, k) => (
                    <div
                      key={k}
                      className={`relative flex-1 scale-x-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 ${k % 2 ? 'origin-right' : 'origin-left'}`}
                      style={{ transitionDelay: `${k * 30}ms` }}
                    >
                      <div className="absolute inset-x-0" style={{ top: `-${k * 100}%`, height: '1000%' }}>
                        <Image src={p.hover} alt="" fill sizes="(min-width:768px) 48vw, 100vw" className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
                <Glass className="absolute bottom-4 left-4 px-4 py-2.5">
                  <span className="relative text-[13px] text-white">{t('Voir la pièce', 'View piece')} →</span>
                </Glass>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="text-[15px] md:text-[16px]">{p.name}</h3>
                <span className="shrink-0 text-[13px] text-white/55">{p.price ?? DROP.price ?? t('Prix à venir', 'Price soon')}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-white/50">{(lang === 'fr' ? p.details.fr : p.details.en).slice(0, 2).join(' · ')}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── product sheet ───────────────────────── */

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-white/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 text-left text-[14px] text-white/85">
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="text-[18px] font-light leading-none text-white/60">
          +
        </motion.span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-5 text-[14px] leading-relaxed text-white/60">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ProductSheet({ piece, onClose }: { piece: Piece | null; onClose: () => void }) {
  const t = useT();
  const { lang } = useLang();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const sizes = DROP.sizes.length > 0 ? DROP.sizes : SIZE_PREVIEW;
  const sizesLive = DROP.sizes.length > 0 && Boolean(DROP.checkoutUrl);

  useEffect(() => {
    setImg(0);
    setSize(null);
  }, [piece]);

  useEffect(() => {
    if (!piece) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setImg((i) => (i + 1) % piece.gallery.length);
      if (e.key === 'ArrowLeft') setImg((i) => (i - 1 + piece.gallery.length) % piece.gallery.length);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [piece, onClose]);

  return (
    <AnimatePresence>
      {piece && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button aria-label={t('Fermer', 'Close')} onClick={onClose} className="absolute inset-0 bg-black/45 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={piece.name}
            className="absolute inset-y-0 right-0 flex w-full max-w-[1120px] flex-col overflow-y-auto border-l border-white/10 bg-[#101010]/80 backdrop-blur-3xl md:flex-row md:overflow-hidden"
            initial={{ clipPath: 'inset(0 0 0 100%)' }}
            animate={{ clipPath: 'inset(0 0 0 0%)' }}
            exit={{ clipPath: 'inset(0 0 0 100%)' }}
            transition={{ duration: 0.9, ease: EASE }}
            data-lenis-prevent
          >
            {/* gallery */}
            <div className="relative md:w-[58%]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414] md:aspect-auto md:h-full">
                <Image src={piece.gallery[(img - 1 + piece.gallery.length) % piece.gallery.length]} alt="" fill sizes="(min-width:768px) 650px, 100vw" className="object-cover" />
                <Weave key={piece.gallery[img]} src={piece.gallery[img]} alt={`${piece.name} — ${img + 1}`} strips={10} sizes="(min-width:768px) 650px, 100vw" />
                <button aria-label={t('Image précédente', 'Previous image')} onClick={() => setImg((i) => (i - 1 + piece.gallery.length) % piece.gallery.length)} className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize" />
                <button aria-label={t('Image suivante', 'Next image')} onClick={() => setImg((i) => (i + 1) % piece.gallery.length)} className="absolute inset-y-0 right-0 w-2/3 cursor-e-resize" />
              </div>
            </div>

            {/* info */}
            <div className="relative flex flex-col p-6 md:w-[42%] md:overflow-y-auto md:p-10">
              <div className="flex items-start justify-between gap-6">
                <span className="text-[13px] text-white/50">Cycle 01 — Chimera School</span>
                <button onClick={onClose} className="-mr-2 -mt-1 px-2 py-1 text-[13px] text-white/60 transition hover:text-white">
                  {t('Fermer', 'Close')} ✕
                </button>
              </div>
              <h3 className="mt-6 text-[24px] uppercase leading-[1.05] md:text-[30px]" style={DISPLAY}>
                {piece.name}
              </h3>
              <p className="mt-4 text-[15px] text-white/70">{piece.price ?? DROP.price ?? t('Prix annoncé bientôt', 'Price announced soon')}</p>

              <div className="mt-8 grid grid-cols-5 gap-1.5">
                {piece.gallery.map((g, i) => (
                  <button
                    key={g}
                    onClick={() => setImg(i)}
                    aria-label={`${t('Image', 'Image')} ${i + 1}`}
                    className={`relative aspect-[4/5] overflow-hidden transition duration-500 ${i === img ? 'opacity-100' : 'opacity-35 hover:opacity-80'}`}
                  >
                    <Image src={g} alt="" fill sizes="80px" className="object-cover" />
                    {i === img && <motion.span layoutId="sheet-thumb" className="absolute inset-x-0 bottom-0 h-0.5 bg-white" />}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-white/85">{t('Taille', 'Size')}</span>
                  {!sizesLive && <span className="text-white/40">{t('Ouverture prochaine', 'Opening soon')}</span>}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      disabled={!sizesLive}
                      onClick={() => setSize(s)}
                      className={`h-12 border text-[13px] transition duration-300 ${
                        size === s ? 'border-[#ecebe6] bg-[#ecebe6] text-[#0b0b0b]' : sizesLive ? 'border-white/20 hover:border-white/60' : 'cursor-not-allowed border-white/10 text-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <BuyButton full />
              </div>

              <div className="mt-10">
                <Accordion title={t('Description', 'Description')} defaultOpen>
                  <ul className="space-y-1.5">
                    {(lang === 'fr' ? piece.details.fr : piece.details.en).map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </Accordion>
                <Accordion title={t('Matière et entretien', 'Material and care')}>
                  {t('Composition et conseils d’entretien communiqués à l’ouverture des précommandes.', 'Composition and care instructions shared when pre-orders open.')}
                </Accordion>
                <Accordion title={t('Précommande et livraison', 'Pre-order and shipping')}>
                  {t(
                    'Pièces produites en petite série. Les délais de fabrication et de livraison seront précisés à l’ouverture des précommandes.',
                    'Pieces made in a small run. Production and shipping times will be shared when pre-orders open.'
                  )}
                </Accordion>
                <div className="border-t border-white/10" />
              </div>

              <div className="mt-auto flex justify-end pt-10 text-white/25">
                <Mark className="w-7" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── lookbook ───────────────────────── */

function Lookbook() {
  const t = useT();
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const shot = LOOKBOOK[active];

  return (
    <section id="lookbook" className="relative z-[1] overflow-hidden px-5 pb-28 pt-24 md:px-8 md:pb-40 md:pt-32">
      {/* soft light that follows the selected shot */}
      <AnimatePresence mode="sync">
        <motion.div key={shot.src + '-bg'} aria-hidden className="absolute inset-0 scale-125 blur-[120px] saturate-[0.4]" initial={{ opacity: 0 }} animate={{ opacity: 0.28 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
          <Image src={shot.src} alt="" fill sizes="30vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/30 to-[#0b0b0b]" />

      <div className="relative">
        <Reveal>
          <h2 className="text-[30px] uppercase leading-[0.95] md:text-[44px]" style={DISPLAY}>
            Lookbook
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-y-6 md:mt-16 md:grid-cols-12 md:gap-x-8">
          <div className="relative md:col-span-4 md:col-start-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414]">
              <Image src={LOOKBOOK[(active - 1 + LOOKBOOK.length) % LOOKBOOK.length].src} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              <Weave key={shot.src} src={shot.src} alt={`Chimera School — ${shot.label[lang]}`} strips={10} sizes="(min-width:768px) 50vw, 100vw" />
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={shot.src} className="mt-4 text-[14px] text-white/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                {shot.label[lang]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:col-span-12 md:mt-6 md:justify-center md:gap-3 [scrollbar-width:none]">
            {LOOKBOOK.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={s.label[lang]}
                className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden transition duration-500 md:w-20 ${i === active ? 'opacity-100' : 'opacity-35 hover:opacity-80'}`}
              >
                <Image src={s.src} alt="" fill sizes="80px" className="object-cover" />
                {i === active && <motion.span layoutId="lb-thumb" className="absolute inset-x-0 bottom-0 h-0.5 bg-white" />}
              </button>
            ))}
          </div>
          <p className="text-center text-[13px] text-white/35 md:col-span-12">{t('Survoler les images pour parcourir', 'Hover the images to browse')}</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── manifesto ───────────────────────── */

function Manifesto() {
  const t = useT();
  return (
    <section id="manifesto" className="relative z-[1] px-5 pb-32 pt-24 md:px-8 md:pb-48 md:pt-32">
      <div className="relative mx-auto max-w-[980px] text-center">
        <Reveal>
          <Mark className="mx-auto w-10 text-white/80" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 text-[32px] uppercase leading-[0.95] md:text-[60px]" style={MANTRA}>
            I can never be food.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-[560px] text-[15px] leading-[1.75] text-white/65">
            {t(
              'SOUTRAME, c’est la trame qu’on a tous en nous : ce qui se construit à force de vécu, de doutes et de retours. CYCLE rappelle que rien n’est linéaire. On avance, on bloque, on revient. « I can never be food » n’est pas une phrase agressive, c’est une affirmation intérieure : ne pas être consommé, ne pas être formaté.',
              'SOUTRAME is the inner thread we all carry: what gets built through experience, doubt and return. CYCLE is a reminder that nothing is linear. We move forward, we stall, we come back. “I can never be food” is not an aggressive line, it is an inner statement: not to be consumed, not to be shaped by what surrounds us.'
            )}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function SoutramePage() {
  const t = useT();
  const { lang, setLang } = useLang();
  const [openPiece, setOpenPiece] = useState<Piece | null>(null);
  const closeSheet = useCallback(() => setOpenPiece(null), []);
  const [ready, setReady] = useState(false);
  const finishIntro = useCallback(() => setReady(true), []);

  // smooth scrolling (Lenis is already a dependency of the site)
  useEffect(() => {
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      if (cancelled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0b0b0b] text-[#ecebe6] antialiased selection:bg-[#ecebe6] selection:text-[#0b0b0b]" style={{ fontFamily: 'var(--font-general-sans), Inter, sans-serif' }}>
      <AnimatePresence>{!ready && <Intro onDone={finishIntro} />}</AnimatePresence>
      <Snow />

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-[#0b0b0b] to-transparent px-5 pb-6 pt-5 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <Mark className="w-7 shrink-0" />
          <span className="text-[13px] font-medium uppercase leading-none tracking-[0.08em]">
            Soutrame.Cycle
          </span>
        </a>
        <nav className="flex items-center gap-6 text-[13px] text-white/70">
          <a href="#collection" className="hidden transition hover:text-white sm:inline">
            {t('Collection', 'Collection')}
          </a>
          <a href="#lookbook" className="hidden transition hover:text-white sm:inline">
            Lookbook
          </a>
          <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="transition hover:text-white" aria-label={t('Switch to English', 'Passer en français')}>
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
        </nav>
      </header>

      <Hero ready={ready} onOpen={setOpenPiece} />
      <Collection onOpen={setOpenPiece} />
      <CycleInterlude />
      <Lookbook />
      <Manifesto />

      <footer className="relative z-[1] px-5 pb-8 md:px-8">
        <div className="flex flex-col gap-10 border-t border-white/10 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4 md:gap-8">
            <p className="text-[14vw] uppercase leading-[0.8] md:text-[8vw]" style={DISPLAY}>
              Soutrame
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[13px] text-white/55 md:items-end">
            <a href={DROP.instagram} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
              Instagram ↗
            </a>
            <Link href="/" className="transition hover:text-white">
              {t('Designé par Emmanuel Ijjou', 'Designed by Emmanuel Ijjou')}
            </Link>
          </div>
        </div>
      </footer>

      <ProductSheet piece={openPiece} onClose={closeSheet} />
    </div>
  );
}
