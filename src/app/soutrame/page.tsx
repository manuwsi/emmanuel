'use client';

/**
 * SOUTRAME.CYCLE — brand shop (Cycle 01 · Chimera School)
 *
 * Design system, derived from the brand concept:
 *  - TRAME (the inner thread): a visible 12-column hairline grid runs behind the whole page,
 *    every block snaps to it, and images are revealed strip by strip, like a weave.
 *  - CYCLE (nothing is linear, it comes back): the hero shows the lookbook as an endless loop
 *    with a counter that restarts; sections are indexed like phases.
 *  - "Technical and augmented": square, hairline UI, bracketed mono labels, frosted glass only
 *    where it echoes the nylon's sheen (over imagery).
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
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
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
const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace';

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
  { src: '/soutrame/detail-hem.jpg', label: { fr: 'Ourlet & cordons', en: 'Hem & drawcords' } },
];

const PIECES = [
  {
    id: '01',
    name: 'Chimera School Track Jacket',
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
function Mark({ className = '', assemble = false, delay = 0 }: { className?: string; assemble?: boolean; delay?: number }) {
  return (
    <svg viewBox="-71.78 -46.68 143.55 113.12" fill="currentColor" className={className} aria-label="SOUTRAME" role="img">
      <motion.circle cx="0" cy="0" r="30" initial={assemble ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: EASE, delay }} />
      {SATELLITES.map((deg, i) => {
        const t = (deg * Math.PI) / 180;
        const x = 56 * Math.sin(t);
        const y = -56 * Math.cos(t);
        return (
          <motion.g
            key={deg}
            initial={assemble ? { opacity: 0, x: x * 0.6, y: y * 0.6 } : false}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + 0.25 + i * 0.06 }}
          >
            <rect x="-4.5" y="-56" width="9" height="56" transform={`rotate(${deg})`} />
            <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="17" />
          </motion.g>
        );
      })}
    </svg>
  );
}

/** Bracketed technical label. */
function Tag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-[10.5px] uppercase tracking-[0.14em] ${className}`} style={{ fontFamily: MONO }}>
      {children}
    </span>
  );
}

/** The trame: hairline 12-column grid behind the whole page (4 columns on mobile). */
function Trame() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 px-5 md:px-8">
      <div className="grid h-full grid-cols-4 border-r border-white/[0.045] md:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`border-l border-white/[0.045] ${i > 3 ? 'hidden md:block' : ''}`} />
        ))}
      </div>
    </div>
  );
}

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.06] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

/** Frosted panel — only used over imagery, as an echo of the nylon's sheen. */
function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
  return (
    <div className={`${positioned ? '' : 'relative '}border border-white/[0.14] bg-[#141414]/40 backdrop-blur-2xl backdrop-saturate-[1.4] ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_38%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.05)_100%)]" />
      {children}
    </div>
  );
}

/** Square, hairline button. On hover, horizontal threads weave in from alternating sides. */
function Btn({
  children,
  href,
  onClick,
  disabled = false,
  full = false,
  external = false,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  external?: boolean;
}) {
  const cls = `group relative inline-flex h-12 items-center justify-between gap-6 overflow-hidden border px-4 text-left ${full ? 'w-full' : 'w-full sm:w-auto sm:min-w-[300px]'} ${
    disabled ? 'cursor-not-allowed border-white/15 text-white/45' : 'border-[#ecebe6]/70 text-[#ecebe6]'
  }`;
  const inner = (
    <>
      {disabled ? (
        <span aria-hidden className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 7px)' }} />
      ) : (
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
      <span className="relative transition-colors duration-300 group-hover:text-[#0b0b0b]">
        <Tag>{children}</Tag>
      </span>
      <span className="relative transition-colors duration-300 group-hover:text-[#0b0b0b]">
        <Tag>{disabled ? '[ — ]' : '[ → ]'}</Tag>
      </span>
    </>
  );
  if (disabled)
    return (
      <span aria-disabled="true" className={cls}>
        {inner}
      </span>
    );
  if (href)
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
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
      {t('Bientôt disponible — Cycle 01', 'Coming soon — Cycle 01')}
    </Btn>
  );
}

/** Index line opening each section, aligned on the trame. */
function SectionHead({ index, label, right }: { index: string; label: string; right?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 items-center border-b border-white/[0.08] pb-4 text-white/55 md:grid-cols-12">
      <Tag className="col-span-1">[{index}]</Tag>
      <Tag className="col-span-2 md:col-span-5">{label}</Tag>
      <div className="col-span-1 text-right md:col-span-6">{right}</div>
    </div>
  );
}

/** Image revealed strip by strip — the weave. */
function Weave({ src, alt, strips = 12, priority = false, sizes }: { src: string; alt: string; strips?: number; priority?: boolean; sizes: string }) {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: strips }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 overflow-hidden"
          style={{ top: `${(i * 100) / strips}%`, height: `${100 / strips + 0.2}%`, transformOrigin: i % 2 ? 'right' : 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.045 }}
        >
          <div className="absolute inset-x-0" style={{ top: `-${i * 100}%`, height: `${strips * 100}%` }}>
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

function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}{' '}
    </motion.span>
  );
}

/* ───────────────────────── intro ───────────────────────── */

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(onDone, reduce ? 0 : 1900);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#0b0b0b] text-[#ecebe6]" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: EASE }}>
      <Mark assemble className="w-16 md:w-20" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="mt-8 text-white/60">
        <Tag>SOUTRAME.CYCLE — Cycle 01</Tag>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── hero: the cycle ───────────────────────── */

const CYCLE_MS = 4200;

function Hero({ ready }: { ready: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = (i + 1) % LOOKBOOK.length;
  const prev = (i - 1 + LOOKBOOK.length) % LOOKBOOK.length;

  useEffect(() => {
    if (!ready || paused) return;
    const id = setTimeout(() => setI((v) => (v + 1) % LOOKBOOK.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [i, paused, ready]);

  // scroll + pointer parallax on the viewer
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yViewer = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, (v) => v * -4), { stiffness: 80, damping: 20 });
  const ry = useSpring(useTransform(mx, (v) => v * 5), { stiffness: 80, damping: 20 });

  const meta: [string, string][] = [
    [t('Collection', 'Collection'), 'Cycle 01'],
    [t('Nom', 'Name'), 'Chimera School'],
    [t('Pièces', 'Pieces'), '02'],
    [t('Lieu', 'Place'), 'Paris — 2026'],
    [t('Statut', 'Status'), DROP.checkoutUrl ? t('Précommande ouverte', 'Pre-order open') : t('Bientôt', 'Soon')],
  ];

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative z-10 px-5 pb-10 pt-24 md:h-[100svh] md:min-h-[680px] md:px-8 md:pb-8"
    >
      <div className="grid h-full grid-cols-4 gap-y-10 md:grid-cols-12 md:gap-y-0">
        {/* left — title & index */}
        <motion.div style={{ opacity: fade }} className="order-2 col-span-4 flex flex-col justify-end md:order-1 md:col-span-4 md:pr-8">
          <Tag className="text-white/50">
            {t('Première collection', 'First collection')} — Cycle 01
          </Tag>
          <h1 className="mt-4 text-[56px] font-medium leading-[0.88] tracking-[-0.04em] md:text-[min(7.2vw,108px)]">
            Chimera
            <br />
            School
          </h1>
          <nav className="mt-8 border-t border-white/[0.1]">
            {[
              { href: '#collection', n: '01', label: t('Collection', 'Collection') },
              { href: '#lookbook', n: '02', label: 'Lookbook' },
              { href: '#manifesto', n: '03', label: t('Manifeste', 'Manifesto') },
            ].map((l) => (
              <a key={l.href} href={l.href} className="group flex items-center justify-between border-b border-white/[0.1] py-3">
                <span className="flex items-center gap-4">
                  <Tag className="text-white/40">{l.n}</Tag>
                  <span className="text-[15px] text-white/80 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-white">{l.label}</span>
                </span>
                <Tag className="text-white/30 transition-colors group-hover:text-white">→</Tag>
              </a>
            ))}
          </nav>
          <div className="mt-6">
            <BuyButton />
          </div>
        </motion.div>

        {/* center — the cycle */}
        <div className="order-1 col-span-4 flex items-center justify-center md:order-2 md:col-span-4">
          <motion.div style={{ y: yViewer, rotateX: rx, rotateY: ry, transformPerspective: 1200 }} className="relative w-full md:w-[min(100%,calc((100svh-10rem)*0.8))]">
            <button
              onClick={() => setI(next)}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-label={t('Image suivante du cycle', 'Next image in the cycle')}
              className="relative block aspect-[4/5] w-full overflow-hidden bg-[#141414]"
            >
              {/* the previous image stays underneath while the next one is woven in */}
              <Image src={LOOKBOOK[prev].src} alt="" fill sizes="(min-width:768px) 34vw, 92vw" className="object-cover" />
              {ready ? (
                <Weave key={LOOKBOOK[i].src} src={LOOKBOOK[i].src} alt={`Chimera School — ${LOOKBOOK[i].label[lang]}`} priority={i === 0} sizes="(min-width:768px) 34vw, 92vw" />
              ) : (
                <Image src={LOOKBOOK[0].src} alt="Chimera School" fill priority sizes="(min-width:768px) 34vw, 92vw" className="object-cover" />
              )}
              {['left-2 top-2 border-l border-t', 'right-2 top-2 border-r border-t', 'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((c) => (
                <span key={c} aria-hidden className={`absolute h-3 w-3 border-black/40 ${c}`} />
              ))}
            </button>
            <div className="mt-3 flex items-center gap-3 text-white/60">
              <Tag className="tabular-nums">{String(i + 1).padStart(2, '0')}</Tag>
              <div className="relative h-px flex-1 bg-white/15">
                <motion.div
                  key={`${i}-${paused}-${ready}`}
                  className="absolute inset-y-0 left-0 bg-white/80"
                  initial={{ width: '0%' }}
                  animate={{ width: paused || !ready ? '0%' : '100%' }}
                  transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                />
              </div>
              <Tag className="tabular-nums">{String(LOOKBOOK.length).padStart(2, '0')}</Tag>
            </div>
            <div className="mt-1.5 flex justify-between text-white/40">
              <Tag>{LOOKBOOK[i].label[lang]}</Tag>
              <Tag>{t('Cycle sans fin', 'Endless cycle')}</Tag>
            </div>
          </motion.div>
        </div>

        {/* right — specs & next */}
        <motion.div style={{ opacity: fade }} className="order-3 col-span-4 flex flex-col justify-between md:col-span-3 md:col-start-10">
          <dl className="border-t border-white/[0.1]">
            {meta.map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 border-b border-white/[0.1] py-2.5">
                <dt>
                  <Tag className="text-white/40">{k}</Tag>
                </dt>
                <dd className="text-right">
                  <Tag className="text-white/80">{v}</Tag>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 hidden md:block">
            <Tag className="text-white/40">{t('Suivant dans le cycle', 'Next in the cycle')}</Tag>
            <button onClick={() => setI(next)} className="group mt-3 flex w-full items-end gap-4 text-left">
              <div className="relative aspect-[4/5] w-[38%] overflow-hidden bg-[#141414]">
                <AnimatePresence mode="wait">
                  <motion.div key={LOOKBOOK[next].src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <Image src={LOOKBOOK[next].src} alt="" fill sizes="12vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="pb-1">
                <Tag className="block tabular-nums text-white/40">{String(next + 1).padStart(2, '0')}</Tag>
                <span className="mt-1 block text-[14px] text-white/80">{LOOKBOOK[next].label[lang]}</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── collection ───────────────────────── */

function Collection({ onOpen }: { onOpen: (p: Piece) => void }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <section id="collection" className="relative z-10 px-5 pb-28 pt-24 md:px-8 md:pb-40 md:pt-36">
      <SectionHead index="01" label={t('Collection — Cycle 01', 'Collection — Cycle 01')} right={<Tag className="text-white/40">02 {t('pièces', 'pieces')}</Tag>} />

      <div className="mt-12 grid grid-cols-4 gap-y-8 md:mt-16 md:grid-cols-12">
        <Reveal className="col-span-4 md:col-span-8">
          <h2 className="text-[52px] font-medium leading-[0.9] tracking-[-0.04em] md:text-[min(9vw,132px)]">Chimera School</h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-4 self-end md:col-span-3 md:col-start-10">
          <p className="text-[14px] leading-relaxed text-white/60">
            {t(
              'Une veste et un pantalon. Peu de pièces, mais pensées : un uniforme revisité, entre vêtement technique, mesh et broderie.',
              'One jacket, one pair of trousers. Few pieces, carefully considered: a reworked uniform, between technical wear, mesh and embroidery.'
            )}
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-4 gap-y-14 md:mt-20 md:grid-cols-12">
        {PIECES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1} className={`col-span-4 md:col-span-6 ${i === 1 ? 'md:mt-40' : ''}`}>
            <article
              className={`group cursor-pointer ${i === 0 ? 'md:pr-4' : 'md:pl-4'}`}
              onClick={() => onOpen(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p)}
              aria-label={`${p.name} — ${t('voir la pièce', 'view piece')}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#141414]">
                <Image src={p.image} alt={p.name} fill sizes="(min-width:768px) 48vw, 100vw" className="object-cover transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035]" />
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
                <Glass className="absolute bottom-3 left-3 right-3 px-4 py-3 md:bottom-4 md:left-4 md:right-auto md:w-[min(360px,80%)]">
                  <div className="relative flex items-center justify-between gap-4">
                    <Tag className="text-white/60">{p.id} / 02</Tag>
                    <Tag className="text-white/90">{t('Voir la pièce', 'View piece')} →</Tag>
                  </div>
                </Glass>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-x-4 border-t border-white/[0.1] pt-4">
                <h3 className="col-span-4 text-[17px] font-medium md:text-[19px]">{p.name}</h3>
                <Tag className="col-span-2 self-center text-right text-white/60">{p.price ?? DROP.price ?? t('Prix à venir', 'Price soon')}</Tag>
                <ul className="col-span-6 mt-3 space-y-1 text-[13px] leading-relaxed text-white/50">
                  {(lang === 'fr' ? p.details.fr : p.details.en).slice(0, 3).map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
              </div>
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
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 text-left text-white/80">
        <Tag>{title}</Tag>
        <Tag className="text-white/50">{open ? '[ – ]' : '[ + ]'}</Tag>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-5 text-[13px] leading-relaxed text-white/60">{children}</div>
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
            className="absolute inset-y-0 right-0 flex w-full max-w-[1120px] flex-col overflow-y-auto border-l border-white/10 bg-[#101010]/75 backdrop-blur-3xl md:flex-row md:overflow-hidden"
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
                <Glass className="absolute bottom-4 left-4 px-3 py-2">
                  <Tag className="relative tabular-nums text-white/85">
                    {String(img + 1).padStart(2, '0')} / {String(piece.gallery.length).padStart(2, '0')}
                  </Tag>
                </Glass>
              </div>
            </div>

            {/* info */}
            <div className="relative flex flex-col p-6 md:w-[42%] md:overflow-y-auto md:p-10">
              <div className="flex items-start justify-between gap-6">
                <Tag className="text-white/45">Cycle 01 — {piece.id} / 02</Tag>
                <button onClick={onClose} className="-mr-2 -mt-2 px-2 py-2 text-white/60 transition hover:text-white">
                  <Tag>[ {t('Fermer', 'Close')} ✕ ]</Tag>
                </button>
              </div>
              <h3 className="mt-8 text-[30px] font-medium leading-[1.02] tracking-[-0.02em] md:text-[40px]">{piece.name}</h3>
              <Tag className="mt-4 text-white/65">{piece.price ?? DROP.price ?? t('Prix annoncé bientôt', 'Price announced soon')}</Tag>

              <div className="mt-8 grid grid-cols-5 gap-1.5">
                {piece.gallery.map((g, i) => (
                  <button
                    key={g}
                    onClick={() => setImg(i)}
                    aria-label={`${t('Image', 'Image')} ${i + 1}`}
                    className={`relative aspect-[4/5] overflow-hidden transition duration-500 ${i === img ? 'opacity-100 outline outline-1 outline-offset-2 outline-white/70' : 'opacity-35 hover:opacity-80'}`}
                  >
                    <Image src={g} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <Tag className="text-white/80">{t('Taille', 'Size')}</Tag>
                  {!sizesLive && <Tag className="text-white/40">{t('Ouverture prochaine', 'Opening soon')}</Tag>}
                </div>
                <div className="mt-3 grid grid-cols-4 border-l border-t border-white/15">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      disabled={!sizesLive}
                      onClick={() => setSize(s)}
                      className={`h-12 border-b border-r border-white/15 transition duration-300 ${
                        size === s ? 'bg-[#ecebe6] text-[#0b0b0b]' : sizesLive ? 'hover:bg-white/[0.06]' : 'cursor-not-allowed text-white/30'
                      }`}
                    >
                      <Tag>{s}</Tag>
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
                      <li key={d}>— {d}</li>
                    ))}
                  </ul>
                </Accordion>
                <Accordion title={t('Matière & entretien', 'Material & care')}>
                  {t('Composition et conseils d’entretien communiqués à l’ouverture des précommandes.', 'Composition and care instructions shared when pre-orders open.')}
                </Accordion>
                <Accordion title={t('Précommande & livraison', 'Pre-order & shipping')}>
                  {t(
                    'Pièces produites en petite série. Les délais de fabrication et de livraison seront précisés à l’ouverture des précommandes.',
                    'Pieces made in a small run. Production and shipping times will be shared when pre-orders open.'
                  )}
                </Accordion>
                <div className="border-t border-white/10" />
              </div>

              <div className="mt-auto flex items-center justify-between pt-10 text-white/30">
                <Tag>I can never be food.</Tag>
                <Mark className="w-6" />
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setActive((a) => (a + 1) % LOOKBOOK.length);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setActive((a) => (a - 1 + LOOKBOOK.length) % LOOKBOOK.length);
    };
    const el = document.getElementById('lookbook');
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) window.addEventListener('keydown', onKey);
      else window.removeEventListener('keydown', onKey);
    });
    if (el) io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <section id="lookbook" className="relative z-10 overflow-hidden px-5 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
      {/* ambient light follows the selected shot */}
      <AnimatePresence mode="sync">
        <motion.div key={shot.src + '-bg'} aria-hidden className="absolute inset-0 scale-125 blur-[110px] saturate-[0.4]" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
          <Image src={shot.src} alt="" fill sizes="30vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/30 to-[#0b0b0b]" />

      <div className="relative">
        <SectionHead index="02" label="Lookbook — Cycle 01" right={<Tag className="hidden text-white/35 md:inline">{t('Survoler · ← →', 'Hover · ← →')}</Tag>} />

        <div className="mt-10 grid grid-cols-4 gap-y-8 md:mt-14 md:grid-cols-12">
          {/* thumbnails — two columns on the trame */}
          <div className="order-2 col-span-4 grid grid-cols-5 gap-2 md:order-1 md:col-span-2 md:grid-cols-2 md:content-start md:gap-3">
            {LOOKBOOK.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={s.label[lang]}
                className={`relative aspect-[4/5] overflow-hidden transition duration-500 ${i === active ? 'opacity-100 outline outline-1 outline-offset-2 outline-white/70' : 'opacity-30 hover:opacity-80'}`}
              >
                <Image src={s.src} alt="" fill sizes="10vw" className="object-cover" />
              </button>
            ))}
          </div>

          {/* scene */}
          <div className="order-1 col-span-4 md:order-2 md:col-span-5 md:col-start-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414]">
              <Image src={LOOKBOOK[(active - 1 + LOOKBOOK.length) % LOOKBOOK.length].src} alt="" fill sizes="(min-width:768px) 42vw, 92vw" className="object-cover" />
              <Weave key={shot.src} src={shot.src} alt={`Chimera School — ${shot.label[lang]}`} strips={10} sizes="(min-width:768px) 42vw, 92vw" />
            </div>
          </div>

          {/* caption */}
          <div className="order-3 col-span-4 flex flex-col justify-end md:col-span-3 md:col-start-10">
            <Tag className="tabular-nums text-white/40">
              {String(active + 1).padStart(2, '0')} / {String(LOOKBOOK.length).padStart(2, '0')}
            </Tag>
            <AnimatePresence mode="wait">
              <motion.p
                key={shot.src}
                className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[36px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {shot.label[lang]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-6 border-t border-white/[0.1] pt-3">
              <Tag className="text-white/40">Chimera School — Paris, 2026</Tag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── manifesto ───────────────────────── */

function Manifesto() {
  const t = useT();
  return (
    <section id="manifesto" className="relative z-10 px-5 pb-32 pt-24 md:px-8 md:pb-48 md:pt-32">
      <SectionHead index="03" label={t('Manifeste', 'Manifesto')} right={<Mark className="ml-auto w-5 text-white/40" />} />
      <ScrollWords text="I can never be food." className="mt-14 text-[56px] font-medium leading-[0.92] tracking-[-0.04em] md:mt-20 md:text-[min(12vw,176px)]" />
      <div className="mt-16 grid grid-cols-4 gap-y-10 md:mt-24 md:grid-cols-12">
        <div className="col-span-4 md:col-span-6">
          <ScrollWords
            className="text-[19px] leading-[1.5] md:text-[24px]"
            text={t(
              'SOUTRAME fait référence à la trame qu’on a tous en nous : ce qui se construit à force de vécu, de doutes, de retours. CYCLE rappelle que rien n’est linéaire : on avance, on bloque, on revient.',
              'SOUTRAME refers to the inner thread we all carry: what gets built through experience, doubt and return. CYCLE is a reminder that nothing is linear: we move forward, we stall, we come back.'
            )}
          />
        </div>
        <Reveal className="col-span-4 md:col-span-3 md:col-start-10" delay={0.1}>
          <div className="border-t border-white/[0.12] pt-4">
            <Tag className="text-white/40">« I can never be food »</Tag>
            <p className="mt-4 text-[14px] leading-relaxed text-white/60">
              {t(
                'Ce n’est pas une phrase agressive. C’est une affirmation intérieure : ne pas être consommé, ne pas être vidé, ne pas être formaté. Même quand c’est difficile, quelque chose refuse de disparaître.',
                'Not an aggressive line, but an inner statement: not to be consumed, not to be emptied, not to be shaped by what surrounds us. Even when it is hard, something refuses to disappear.'
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function SoutramePage() {
  const t = useT();
  const { lang, setLang } = useLang();
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
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
      <Trame />
      <Grain />

      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-[#ecebe6]/70" />

      {/* header, aligned on the trame */}
      <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/70 to-transparent px-5 pb-8 pt-5 md:px-8">
        <div className="grid grid-cols-4 items-start md:grid-cols-12">
          <a href="#" className="col-span-2 flex items-center gap-3 md:col-span-3">
            <Mark className="w-7 shrink-0" />
            <span className="text-[13px] font-medium tracking-[0.02em]">SOUTRAME.CYCLE</span>
          </a>
          <Tag className="hidden pt-1 text-white/45 md:col-span-3 md:col-start-5 md:block">Cycle 01 — Chimera School</Tag>
          <nav className="col-span-2 flex justify-end gap-5 pt-1 text-white/70 md:col-span-3 md:col-start-10">
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="transition hover:text-white" aria-label={t('Switch to English', 'Passer en français')}>
              <Tag>[ {lang === 'fr' ? 'EN' : 'FR'} ]</Tag>
            </button>
            <a href="#collection" className="transition hover:text-white">
              <Tag>[ {t('Boutique', 'Shop')} ]</Tag>
            </a>
          </nav>
        </div>
      </header>

      <Hero ready={ready} />
      <Collection onOpen={setOpenPiece} />
      <Lookbook />
      <Manifesto />

      <footer className="relative z-10 px-5 pb-8 md:px-8">
        <div className="grid grid-cols-4 items-end gap-y-8 border-t border-white/[0.1] pt-10 md:grid-cols-12">
          <div className="col-span-4 md:col-span-8">
            <Mark className="mb-6 w-14 text-white/90" />
            <p className="text-[17vw] font-medium leading-[0.78] tracking-[-0.055em] md:text-[11.5vw]">SOUTRAME</p>
          </div>
          <div className="col-span-4 flex flex-col gap-2 text-white/55 md:col-span-3 md:col-start-10 md:items-end">
            <Tag>{t('Peu de pièces, mais pensées.', 'Few pieces, carefully considered.')}</Tag>
            <a href={DROP.instagram} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
              <Tag>[ Instagram ↗ ]</Tag>
            </a>
            <Link href="/" className="transition hover:text-white">
              <Tag>[ {t('Designé par Emmanuel Ijjou', 'Designed by Emmanuel Ijjou')} ]</Tag>
            </Link>
          </div>
        </div>
      </footer>

      <ProductSheet piece={openPiece} onClose={closeSheet} />
    </div>
  );
}
