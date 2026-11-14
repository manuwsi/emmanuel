'use client';

/**
 * SOUTRAME.CYCLE — brand shop (Cycle 01 · Chimera School)
 *
 * Direction: a real shop, quiet and image-led. The page takes the exact tone of the studio
 * backdrop (#e2e1de), so the photographs melt into it and the garment is the only thing that
 * stands out. Type stays small; the hierarchy comes from the images and the grid.
 *  - TRAME (the inner thread): images are woven in strip by strip (campaign, product hover,
 *    product sheet, lookbook). Buttons fill the same way.
 *  - CYCLE (nothing is linear, it comes back): the campaign panels loop through the shoot.
 *  - Snow: the scattered dots of the CYCLE posters, drifting behind everything.
 *
 * To open sales, fill in DROP below:
 *  - price: e.g. '240 €' (or a price per piece in PIECES)
 *  - sizes: e.g. ['S', 'M', 'L']
 *  - checkoutUrl: the Stripe Payment Link (https://buy.stripe.com/...)
 * While checkoutUrl is null, every buy button reads "Coming soon" and is disabled.
 *
 * INTRO_VIDEO: drop a black-and-white film in /public/soutrame/ and set its path to open the page on it.
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

const INTRO_VIDEO = null as string | null; // e.g. '/soutrame/intro.mp4'

/** Shown greyed-out in the size picker until DROP.sizes is filled in. */
const SIZE_PREVIEW = ['S', 'M', 'L', 'XL'];

const BG = '#e2e1de'; // the studio backdrop, measured on the retouched shots
const INK = '#121212';
const EASE = [0.22, 1, 0.36, 1] as const;
/** Titles: General Sans, the brand typeface, set tight and uppercase. */
const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.025em' } as const;
/** Ade Display is kept for a single, more intimate line: the mantra. */
const MANTRA = { fontFamily: 'var(--font-ade), serif' } as const;
/** Small uppercase label, the shop's working voice. */
const LABEL = 'text-[11px] uppercase tracking-[0.08em]';

const img = (n: string) => `/soutrame/${n}.jpg`;

type Shot = { src: string; label: { fr: string; en: string } };

const LOOKBOOK: Shot[] = [
  { src: img('jacket-front'), label: { fr: 'Face', en: 'Front' } },
  { src: img('look-hood'), label: { fr: 'Capuche', en: 'Hood up' } },
  { src: img('jacket-34'), label: { fr: 'Trois-quarts', en: 'Three-quarter' } },
  { src: img('look-seated'), label: { fr: 'Assis', en: 'Seated' } },
  { src: img('jacket-back'), label: { fr: 'Dos', en: 'Back' } },
  { src: img('look-set-shorts'), label: { fr: 'Jambes zippées, en short', en: 'Legs zipped off, as shorts' } },
  { src: img('pant-side'), label: { fr: 'Profil', en: 'Side' } },
  { src: img('jacket-detail-hood'), label: { fr: 'Brandebourg', en: 'Frog closure' } },
  { src: img('pant-long-back'), label: { fr: 'Dos, ensemble', en: 'Back, full set' } },
  { src: img('pant-detail-pocket'), label: { fr: 'Poche et mesh', en: 'Pocket and mesh' } },
];

type Category = 'jackets' | 'pants' | 'sets';

const PIECES = [
  {
    id: 'jacket',
    category: 'jackets' as Category,
    name: 'Chimera School Track Jacket',
    colour: { fr: 'Ivoire / gris', en: 'Ivory / grey' },
    image: img('jacket-front'),
    hover: img('jacket-back'),
    gallery: ['jacket-front', 'jacket-34', 'jacket-side', 'jacket-back', 'jacket-detail-hood', 'jacket-detail-front', 'jacket-detail-sleeve', 'jacket-detail-back', 'jacket-flat'].map(img),
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
    id: 'pant',
    category: 'pants' as Category,
    name: 'Chimera School Zip-off Pant',
    colour: { fr: 'Ivoire / gris', en: 'Ivory / grey' },
    image: img('pant-front'),
    hover: img('pant-flat'),
    gallery: ['pant-front', 'pant-side', 'pant-back', 'pant-long-back', 'pant-detail-pocket', 'pant-detail-side', 'pant-flat', 'pant-flat-shorts'].map(img),
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
  {
    id: 'set',
    category: 'sets' as Category,
    name: 'Chimera School Set',
    colour: { fr: 'Veste + pantalon', en: 'Jacket + pant' },
    image: img('jacket-34'),
    hover: img('look-set-shorts'),
    gallery: ['jacket-34', 'look-hood', 'jacket-front', 'look-set-shorts', 'look-seated', 'pant-long-back'].map(img),
    price: null as string | null,
    details: {
      fr: [
        'L’ensemble complet : Track Jacket et Zip-off Pant',
        'Pensé comme un uniforme, à porter ensemble ou séparément',
        'Le pantalon se transforme en short',
      ],
      en: [
        'The full set: Track Jacket and Zip-off Pant',
        'Designed as a uniform, worn together or apart',
        'The trousers turn into shorts',
      ],
    },
  },
];

type Piece = (typeof PIECES)[number];

const FILTERS: { id: Category | 'all'; fr: string; en: string }[] = [
  { id: 'all', fr: 'Tout', en: 'All' },
  { id: 'jackets', fr: 'Vestes', en: 'Jackets' },
  { id: 'pants', fr: 'Pantalons', en: 'Pants' },
  { id: 'sets', fr: 'Ensembles', en: 'Sets' },
];

const priceOf = (p: Piece) => p.price ?? DROP.price;

/* ───────────────────────── brand primitives ───────────────────────── */

const SATELLITES = [58, -58, 102, -102, 152, -152];

/** The SOUTRAME mark, rebuilt on a strict geometry. `assemble` animates the satellites in. */
function Mark({ className = '', assemble = false }: { className?: string; assemble?: boolean }) {
  return (
    <svg viewBox="-71.78 -46.68 143.55 113.12" fill="currentColor" className={className} aria-label="SOUTRAME" role="img">
      <motion.circle cx="0" cy="0" r="30" initial={assemble ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: EASE }} />
      {SATELLITES.map((deg, i) => {
        const t = (deg * Math.PI) / 180;
        const x = Math.round(56 * Math.sin(t) * 100) / 100;
        const y = Math.round(-56 * Math.cos(t) * 100) / 100;
        return (
          <motion.g key={deg} initial={assemble ? { opacity: 0, x: Math.round(x * 6) / 10, y: Math.round(y * 6) / 10 } : false} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.06 }}>
            <rect x="-4.5" y="-56" width="9" height="56" transform={`rotate(${deg})`} />
            <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="17" />
          </motion.g>
        );
      })}
    </svg>
  );
}

/** Square button. On hover, the fill is woven in, thread by thread. */
function Btn({ children, href, disabled = false, full = false, external = false, onClick }: { children: React.ReactNode; href?: string; disabled?: boolean; full?: boolean; external?: boolean; onClick?: () => void }) {
  const cls = `group relative inline-flex h-[50px] items-center justify-between gap-8 overflow-hidden border px-5 ${LABEL} ${full ? 'w-full' : 'w-full sm:w-auto sm:min-w-[260px]'} ${
    disabled ? 'cursor-not-allowed border-black/15 text-black/40' : 'border-[#121212] text-[#121212]'
  }`;
  const inner = (
    <>
      {!disabled && (
        <span aria-hidden className="absolute inset-0 flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={`block flex-1 scale-x-0 bg-[#121212] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 ${i % 2 ? 'origin-right' : 'origin-left'}`}
              style={{ transitionDelay: `${i * 35}ms` }}
            />
          ))}
        </span>
      )}
      <span className="relative transition-colors duration-300 group-hover:text-[#e2e1de]">{children}</span>
      <span className="relative transition-colors duration-300 group-hover:text-[#e2e1de]">{disabled ? '' : '→'}</span>
    </>
  );
  if (disabled)
    return (
      <span aria-disabled="true" className={cls}>
        {inner}
      </span>
    );
  if (onClick)
    return (
      <button onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  );
}

function BuyButton({ full = false, price }: { full?: boolean; price?: string | null }) {
  const t = useT();
  return DROP.checkoutUrl ? (
    <Btn href={DROP.checkoutUrl} external full={full}>
      {t('Précommander', 'Pre-order')}
      {price ? ` — ${price}` : ''}
    </Btn>
  ) : (
    <Btn disabled full={full}>
      {t('Bientôt disponible', 'Coming soon')}
    </Btn>
  );
}

/** Image woven in, strip by strip. */
function Weave({ src, alt, strips = 12, priority = false, sizes, delay = 0 }: { src: string; alt: string; strips?: number; priority?: boolean; sizes: string; delay?: number }) {
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
          transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.045 }}
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

/** Hover reveal: a second image woven over the first, used on product cards. */
function HoverWeave({ src, sizes, strips = 10 }: { src: string; sizes: string; strips?: number }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      {Array.from({ length: strips }).map((_, k) => (
        <div
          key={k}
          className={`relative flex-1 scale-x-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 ${k % 2 ? 'origin-right' : 'origin-left'}`}
          style={{ transitionDelay: `${k * 30}ms` }}
        >
          <div className="absolute inset-x-0" style={{ top: `-${k * 100}%`, height: `${strips * 100}%` }}>
            <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
          </div>
        </div>
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
 * On the pale backdrop they read as white flakes with a faint shadow, never as decoration.
 */
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
      return { x: Math.random() * w, y: y ?? Math.random() * h, r: 0.6 + z * z * 2.6, z, sway: 0.2 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2 };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(100, (w * h) / 15000));
      flakes = Array.from({ length: count }, () => make());
    };

    const paint = (f: Flake, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    };

    const onMove = (e: PointerEvent) => {
      targetWind = (e.clientX / w - 0.5) * 0.9;
    };

    const draw = (time: number) => {
      wind += (targetWind - wind) * 0.02;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += 0.12 + f.z * 0.55;
        f.x += Math.sin(time * 0.0004 * f.sway + f.phase) * 0.18 + wind * (0.3 + f.z);
        if (f.y - f.r > h) Object.assign(f, make(-f.r * 2));
        if (f.x < -10) f.x = w + 10;
        if (f.x > w + 10) f.x = -10;
        paint(f, 0.45 + f.z * 0.5);
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduce) flakes.forEach((f) => paint(f, 0.45 + f.z * 0.4));
    else raf = requestAnimationFrame(draw);
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

/* ───────────────────────── intro ───────────────────────── */

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(onDone, reduce ? 0 : 1500);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[90] flex items-center justify-center" style={{ background: BG, color: INK }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: EASE }}>
      <Mark assemble className="w-14 md:w-16" />
    </motion.div>
  );
}

/* ───────────────────────── campaign ─────────────────────────
 * Three panels, edge to edge. They change one after the other, so the shoot keeps
 * coming back around: the cycle, without a slider.
 */

const PANELS = [
  ['jacket-front', 'pant-front', 'look-hood'],
  ['look-seated', 'jacket-detail-hood', 'look-set-shorts'],
  ['jacket-34', 'pant-side', 'jacket-back'],
].map((p) => p.map(img));
const STEP_MS = 1800;

function Campaign({ ready }: { ready: boolean }) {
  const t = useT();
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!ready || paused) return;
    const id = setTimeout(() => setTick((v) => v + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [tick, paused, ready]);

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <section ref={ref} className="relative z-[1] h-[88svh] min-h-[560px] overflow-hidden md:h-[100svh]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div style={{ y }} className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
        {PANELS.map((set, k) => {
          // panel k moves on every third tick, offset by k
          const step = Math.floor((tick + (2 - k)) / 3);
          const cur = set[step % set.length];
          const prev = set[(step - 1 + set.length) % set.length];
          return (
            <div key={k} className={`relative h-full overflow-hidden ${k > 0 ? 'hidden md:block' : ''}`}>
              {step > 0 && <Image src={prev} alt="" fill sizes="(min-width:768px) 34vw, 100vw" className="object-cover" />}
              {ready ? (
                <Weave key={cur} src={cur} alt={`Chimera School — Cycle 01`} priority={step === 0} sizes="(min-width:768px) 34vw, 100vw" delay={step === 0 ? k * 0.15 : 0} />
              ) : (
                <Image src={cur} alt="Chimera School" fill priority sizes="(min-width:768px) 34vw, 100vw" className="object-cover" />
              )}
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-5 px-5 pb-6 md:flex-row md:items-end md:justify-between md:gap-6 md:px-8 md:pb-8"
      >
        <div>
          <p className={`${LABEL} text-black/55`}>{t('Cycle 01 — première collection', 'Cycle 01 — first collection')}</p>
          <h1 className="mt-2 text-[34px] uppercase leading-[0.92] md:text-[min(4vw,58px)]" style={DISPLAY}>
            Chimera School
          </h1>
        </div>
        <a href="#shop" className={`${LABEL} shrink-0 border-b border-black/40 pb-1 transition hover:border-black`}>
          {t('Voir la collection', 'Shop the collection')}
        </a>
      </motion.div>
    </section>
  );
}

function IntroFilm() {
  if (!INTRO_VIDEO) return null;
  return (
    <section className="relative z-[1] h-[100svh] overflow-hidden bg-black">
      <video src={INTRO_VIDEO} autoPlay muted loop playsInline className="h-full w-full object-cover grayscale" />
    </section>
  );
}

/* ───────────────────────── shop ───────────────────────── */

function ProductCard({ p, onOpen, priority = false }: { p: Piece; onOpen: (p: Piece) => void; priority?: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const sizes = '(min-width:768px) 25vw, 50vw';
  return (
    <article
      className="group cursor-pointer"
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p)}
      aria-label={`${p.name} — ${t('voir la pièce', 'view piece')}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={p.image} alt={p.name} fill priority={priority} sizes={sizes} className="object-cover" />
        <HoverWeave src={p.hover} sizes={sizes} />
        <span className={`${LABEL} absolute left-3 top-3 text-black/55`}>{t('Précommande', 'Pre-order')}</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className={`${LABEL} text-[#121212]`}>{p.name}</h3>
          <p className={`${LABEL} mt-1 text-black/45`}>{p.colour[lang]}</p>
        </div>
        <span className={`${LABEL} shrink-0 text-black/60`}>{priceOf(p) ?? t('Prix à venir', 'Price soon')}</span>
      </div>
    </article>
  );
}

function Shop({ onOpen }: { onOpen: (p: Piece) => void }) {
  const t = useT();
  const { lang } = useLang();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const shown = PIECES.filter((p) => filter === 'all' || p.category === filter);

  return (
    <section id="shop" className="relative z-[1] scroll-mt-14 px-5 pb-24 pt-16 md:px-8 md:pb-36 md:pt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-b border-black/10 pb-4">
        <h2 className={`${LABEL} text-[#121212]`}>Shop — Cycle 01</h2>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={t('Filtrer', 'Filter')}>
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`${LABEL} transition ${filter === f.id ? 'text-[#121212] underline underline-offset-4' : 'text-black/45 hover:text-black'}`}>
              {lang === 'fr' ? f.fr : f.en}
            </button>
          ))}
        </nav>
        <span className={`${LABEL} text-black/45`}>
          {shown.length} {t(shown.length > 1 ? 'pièces' : 'pièce', shown.length > 1 ? 'pieces' : 'piece')}
        </span>
      </div>

      <motion.div layout className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
              <ProductCard p={p} onOpen={onOpen} priority={i < 2} />
            </motion.div>
          ))}
          {filter === 'all' && (
            <motion.figure key="editorial" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative col-span-2 md:col-span-1">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={img('look-seated')} alt="Chimera School — Cycle 01" fill sizes="(min-width:768px) 25vw, 100vw" className="object-cover" />
              </div>
              <figcaption className={`${LABEL} mt-3 text-black/45`}>
                <a href="#lookbook" className="transition hover:text-black">
                  {t('Voir le lookbook', 'See the lookbook')} →
                </a>
              </figcaption>
            </motion.figure>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── product sheet ─────────────────────────
 * A full product page in an overlay: the images stacked on the left, the buying
 * information pinned on the right, like a shop's product page.
 */

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-black/10">
      <button onClick={() => setOpen((o) => !o)} className={`${LABEL} flex w-full items-center justify-between py-4 text-left text-[#121212]`}>
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="text-[16px] font-light leading-none text-black/50">
          +
        </motion.span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-5 text-[13px] leading-relaxed text-black/60">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ProductSheet({ piece, onClose, onOpen }: { piece: Piece | null; onClose: () => void; onOpen: (p: Piece) => void }) {
  const t = useT();
  const { lang } = useLang();
  const [size, setSize] = useState<string | null>(null);
  const sizes = DROP.sizes.length > 0 ? DROP.sizes : SIZE_PREVIEW;
  const sizesLive = DROP.sizes.length > 0 && Boolean(DROP.checkoutUrl);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSize(null);
    scroller.current?.scrollTo({ top: 0 });
  }, [piece]);

  useEffect(() => {
    if (!piece) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [piece, onClose]);

  const others = piece ? PIECES.filter((p) => p.id !== piece.id) : [];

  return (
    <AnimatePresence>
      {piece && (
        <motion.div
          ref={scroller}
          role="dialog"
          aria-modal="true"
          aria-label={piece.name}
          className="fixed inset-0 z-[70] overflow-y-auto"
          style={{ background: BG, color: INK }}
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0 0 0%)' }}
          exit={{ clipPath: 'inset(0 0 0 100%)' }}
          transition={{ duration: 0.9, ease: EASE }}
          data-lenis-prevent
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 md:px-8" style={{ background: `${BG}d9`, backdropFilter: 'blur(14px)' }}>
            <button onClick={onClose} className={`${LABEL} text-black/60 transition hover:text-black`}>
              ← {t('Retour au shop', 'Back to shop')}
            </button>
            <Mark className="w-6" />
            <button onClick={onClose} className={`${LABEL} text-black/60 transition hover:text-black`} aria-label={t('Fermer', 'Close')}>
              {t('Fermer', 'Close')} ✕
            </button>
          </div>

          <div key={piece.id} className="grid grid-cols-1 gap-x-8 px-5 pb-20 md:grid-cols-12 md:px-8">
            {/* images: first one woven in, the rest stacked two by two */}
            <div className="md:col-span-7">
              <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-2 md:overflow-visible md:px-0">
                {piece.gallery.map((g, i) => (
                  <div key={g} className={`relative aspect-[4/5] w-[85vw] shrink-0 snap-center overflow-hidden md:w-auto ${i === 0 ? 'md:col-span-2' : ''}`}>
                    {i === 0 ? (
                      <Weave src={g} alt={`${piece.name} — 1`} strips={12} priority sizes="(min-width:768px) 58vw, 85vw" delay={0.35} />
                    ) : (
                      <Image src={g} alt={`${piece.name} — ${i + 1}`} fill sizes="(min-width:768px) 29vw, 85vw" className="object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* buying information, pinned while the images scroll */}
            <div className="md:col-span-4 md:col-start-9">
              <div className="pt-8 md:sticky md:top-[72px] md:pt-10">
                <p className={`${LABEL} text-black/45`}>Cycle 01 — Chimera School</p>
                <h3 className="mt-4 text-[26px] uppercase leading-[1] md:text-[30px]" style={DISPLAY}>
                  {piece.name}
                </h3>
                <div className={`${LABEL} mt-4 flex justify-between text-black/60`}>
                  <span>{piece.colour[lang]}</span>
                  <span>{priceOf(piece) ?? t('Prix annoncé bientôt', 'Price announced soon')}</span>
                </div>

                <div className="mt-8">
                  <div className={`${LABEL} flex items-center justify-between`}>
                    <span>{t('Taille', 'Size')}</span>
                    {!sizesLive && <span className="text-black/40">{t('Ouverture prochaine', 'Opening soon')}</span>}
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        disabled={!sizesLive}
                        onClick={() => setSize(s)}
                        className={`h-11 border text-[12px] transition duration-300 ${
                          size === s ? 'border-[#121212] bg-[#121212] text-[#e2e1de]' : sizesLive ? 'border-black/20 hover:border-black/60' : 'cursor-not-allowed border-black/10 text-black/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <BuyButton full price={priceOf(piece)} />
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-black/45">
                  {t('Petite série, produite à la commande. Annonce du drop sur Instagram.', 'Small run, made to order. The drop is announced on Instagram.')}
                </p>

                <div className="mt-8">
                  <Accordion title={t('Description', 'Description')} defaultOpen>
                    <ul className="space-y-1.5">
                      {(lang === 'fr' ? piece.details.fr : piece.details.en).map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </Accordion>
                  <Accordion title={t('Guide des tailles', 'Size guide')}>
                    {t('Coupe ample. Le mannequin mesure 1,82 m. Le guide détaillé sera publié à l’ouverture des précommandes.', 'Relaxed fit. The model is 1.82 m tall. A detailed guide will be published when pre-orders open.')}
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
                  <div className="border-t border-black/10" />
                </div>
              </div>
            </div>
          </div>

          {/* complete the look */}
          <div className="border-t border-black/10 px-5 pb-16 pt-8 md:px-8">
            <p className={`${LABEL} text-[#121212]`}>{t('Compléter la silhouette', 'Complete the look')}</p>
            <div className="mt-5 grid grid-cols-2 gap-x-3 md:grid-cols-4 md:gap-x-4">
              {others.map((p) => (
                <ProductCard key={p.id} p={p} onOpen={onOpen} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── cycle interlude ───────────────────────── */

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
    <section id="cycle" ref={ref} className="relative z-[1] overflow-hidden">
      <div className="relative flex min-h-[80svh] flex-col items-center justify-center px-5 py-28 md:px-8">
        <div className="flex w-full flex-col items-center gap-2 md:flex-row md:justify-center md:gap-[4vw]">
          <motion.p style={{ x: wide ? xLeft : 0, ...DISPLAY }} className="whitespace-nowrap text-[12vw] uppercase leading-none md:text-[5.2vw]">
            Soutrame
          </motion.p>
          <motion.span style={{ scaleX: line }} aria-hidden className="hidden h-px w-[6vw] origin-center bg-black/40 md:block" />
          <motion.p style={{ x: wide ? xRight : 0, ...DISPLAY }} className="whitespace-nowrap text-[12vw] uppercase leading-none md:text-[5.2vw]">
            Cycle
          </motion.p>
        </div>
        <Reveal className="mt-14 text-center">
          <p className={`${LABEL} text-black/50`}>{t('Annonce de la première collection', 'Announcing the first collection')}</p>
          <p className="mt-3 text-[20px] uppercase leading-none md:text-[24px]" style={DISPLAY}>
            Cycle 01
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── lookbook ───────────────────────── */

function Lookbook() {
  const t = useT();
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const shot = LOOKBOOK[active];

  return (
    <section id="lookbook" className="relative z-[1] scroll-mt-14 px-5 pb-28 pt-10 md:px-8 md:pb-36">
      <div className="flex items-baseline justify-between border-b border-black/10 pb-4">
        <h2 className={`${LABEL} text-[#121212]`}>Lookbook — Cycle 01</h2>
        <span className={`${LABEL} text-black/45`}>
          {String(active + 1).padStart(2, '0')} / {String(LOOKBOOK.length).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8">
        <div className="relative md:col-span-4 md:col-start-5">
          <button onClick={() => setActive((a) => (a + 1) % LOOKBOOK.length)} aria-label={t('Image suivante', 'Next image')} className="relative block aspect-[4/5] w-full cursor-e-resize overflow-hidden">
            <Image src={LOOKBOOK[(active - 1 + LOOKBOOK.length) % LOOKBOOK.length].src} alt="" fill sizes="(min-width:768px) 34vw, 100vw" className="object-cover" />
            <Weave key={shot.src} src={shot.src} alt={`Chimera School — ${shot.label[lang]}`} strips={10} sizes="(min-width:768px) 34vw, 100vw" />
          </button>
          <AnimatePresence mode="wait">
            <motion.p key={shot.src} className={`${LABEL} mt-3 text-black/55`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {shot.label[lang]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:col-span-12 md:mt-4 md:justify-center md:gap-2.5 [scrollbar-width:none]">
          {LOOKBOOK.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={s.label[lang]}
              className={`relative aspect-[4/5] w-14 shrink-0 overflow-hidden transition duration-500 md:w-[72px] ${i === active ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
            >
              <Image src={s.src} alt="" fill sizes="80px" className="object-cover" />
              {i === active && <motion.span layoutId="lb-thumb" className="absolute inset-x-0 bottom-0 h-0.5 bg-[#121212]" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── manifesto ───────────────────────── */

function Manifesto() {
  const t = useT();
  return (
    <section id="manifesto" className="relative z-[1] scroll-mt-14 px-5 pb-28 pt-16 md:px-8 md:pb-40 md:pt-24">
      <div className="relative mx-auto max-w-[920px] text-center">
        <Reveal>
          <Mark className="mx-auto w-9" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 text-[30px] uppercase leading-[0.95] md:text-[54px]" style={MANTRA}>
            I can never be food.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-[540px] text-[14px] leading-[1.75] text-black/60">
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

/* ───────────────────────── footer ───────────────────────── */

function Footer() {
  const t = useT();
  const col = 'flex flex-col gap-2';
  const soon = `${LABEL} text-black/35`;
  return (
    <footer className="relative z-[1] px-5 pb-6 md:px-8">
      <div className="grid grid-cols-2 gap-y-10 border-t border-black/10 pt-8 md:grid-cols-4">
        <div className={col}>
          <p className={`${LABEL} text-[#121212]`}>Shop</p>
          <a href="#shop" className={`${LABEL} text-black/55 transition hover:text-black`}>Cycle 01</a>
          <a href="#lookbook" className={`${LABEL} text-black/55 transition hover:text-black`}>Lookbook</a>
        </div>
        <div className={col}>
          <p className={`${LABEL} text-[#121212]`}>{t('Informations', 'Information')}</p>
          <span className={soon}>{t('Livraison', 'Shipping')}</span>
          <span className={soon}>{t('Retours', 'Returns')}</span>
          <span className={soon}>{t('CGV et mentions légales', 'Terms and legal notice')}</span>
          <span className={`${LABEL} text-black/35`}>{t('— à l’ouverture des ventes', '— when sales open')}</span>
        </div>
        <div className={col}>
          <p className={`${LABEL} text-[#121212]`}>{t('Suivre', 'Follow')}</p>
          <a href={DROP.instagram} target="_blank" rel="noopener noreferrer" className={`${LABEL} text-black/55 transition hover:text-black`}>
            Instagram ↗
          </a>
        </div>
        <div className={col}>
          <p className={`${LABEL} text-[#121212]`}>Studio</p>
          <Link href="/" className={`${LABEL} text-black/55 transition hover:text-black`}>
            {t('Designé par Emmanuel Ijjou', 'Designed by Emmanuel Ijjou')}
          </Link>
        </div>
      </div>
      <div className="mt-16 flex items-end justify-between gap-6">
        <p className="text-[15vw] uppercase leading-[0.78] md:text-[10.5vw]" style={DISPLAY}>
          Soutrame
        </p>
        <Mark className="mb-1 w-8 shrink-0 md:w-12" />
      </div>
    </footer>
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
  const [scrolled, setScrolled] = useState(false);

  // the shop owns the whole canvas: body takes the backdrop tone (no dark edge on overscroll)
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = BG;
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const navLink = `${LABEL} text-black/60 transition hover:text-black`;

  return (
    <div className="relative min-h-screen antialiased selection:bg-[#121212] selection:text-[#e2e1de]" style={{ background: BG, color: INK, fontFamily: 'var(--font-general-sans), Inter, sans-serif' }}>
      <AnimatePresence>{!ready && <Intro onDone={finishIntro} />}</AnimatePresence>
      <Snow />

      <header
        className="fixed inset-x-0 top-0 z-40 grid grid-cols-3 items-center px-5 py-4 transition-[background-color,backdrop-filter] duration-500 md:px-8"
        style={{ background: scrolled ? `${BG}cc` : 'transparent', backdropFilter: scrolled ? 'blur(14px)' : 'none' }}
      >
        <nav className="flex items-center gap-5">
          <a href="#shop" className={navLink}>Shop</a>
          <a href="#lookbook" className={`${navLink} hidden sm:inline`}>Lookbook</a>
          <a href="#manifesto" className={`${navLink} hidden md:inline`}>Cycle</a>
        </nav>
        <a href="#" className="flex items-center justify-center gap-2.5" aria-label="SOUTRAME.CYCLE">
          <Mark className="w-6 shrink-0" />
          <span className="hidden text-[12px] font-medium uppercase leading-none tracking-[0.08em] sm:inline">Soutrame.Cycle</span>
        </a>
        <nav className="flex items-center justify-end gap-5">
          <a href={DROP.instagram} target="_blank" rel="noopener noreferrer" className={`${navLink} hidden sm:inline`}>
            Instagram
          </a>
          <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className={navLink} aria-label={t('Switch to English', 'Passer en français')}>
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
        </nav>
      </header>

      <IntroFilm />
      <Campaign ready={ready} />
      <Shop onOpen={setOpenPiece} />
      <CycleInterlude />
      <Lookbook />
      <Manifesto />
      <Footer />

      <ProductSheet piece={openPiece} onClose={closeSheet} onOpen={setOpenPiece} />
    </div>
  );
}
