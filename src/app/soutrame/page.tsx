'use client';

/**
 * SOUTRAME.CYCLE — brand shop (Cycle 01 · Chimera School)
 *
 * Direction: a white shop page, the codes of the best independent fashion shops.
 *  - Text logo fixed bottom-left, Menu / Bag fixed bottom-right, breadcrumb top-left.
 *  - Each piece is a full-width row of photographs you scroll sideways, with a thin caption under it.
 *  - Type is small and in sentence case; the photographs carry the hierarchy.
 * What stays SOUTRAME:
 *  - TRAME (the inner thread): images are woven in strip by strip; buttons fill the same way.
 *  - CYCLE: the campaign panels loop through the shoot.
 *  - The universe (snow, mantra, the mark) lives in its own black chapter.
 *
 * To open sales, fill in DROP below:
 *  - price: a default price; each piece in PIECES carries its own (provisional: 170 / 140 / 280 €)
 *  - sizes: e.g. ['S', 'M', 'L']
 *  - checkoutUrl: the Stripe Payment Link (https://buy.stripe.com/...)
 * While checkoutUrl is null, every buy button reads "Coming soon" and is disabled.
 *
 * INTRO_VIDEO: drop a black-and-white film in /public/soutrame/ and set its path to open the page on it.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLang, useT } from '@/components/i18n';
import ArrowOut from '@/components/ArrowOut';

const DROP = {
  price: null as string | null,
  sizes: [] as string[],
  checkoutUrl: null as string | null,
  instagram: 'https://www.instagram.com/manu.wsi/',
};

const INTRO_VIDEO = '/soutrame/intro.mp4' as string | null; // set to null to open straight on the campaign

/** Shown greyed-out in the size picker until DROP.sizes is filled in. */
const SIZE_PREVIEW = ['S', 'M', 'L', 'XL'];

const BG = '#ffffff';
const INK = '#0a0a0a';
const PHOTO = '#e2e1de'; // the studio backdrop of the retouched shots
const EASE = [0.22, 1, 0.36, 1] as const;
/** The text logo: General Sans Bold, set tight. */
const WORDMARK = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.045em' } as const;
const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.03em' } as const;
/** Ade Display is kept for a single, more intimate line: the mantra. */
const MANTRA = { fontFamily: 'var(--font-ade), serif' } as const;
/** The shop's working voice: small, regular, sentence case. */
const TXT = 'text-[13px] leading-[1.35] tracking-[0.005em]';

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
    kind: { fr: 'Veste', en: 'Jacket' },
    colour: { fr: 'Ivoire / gris', en: 'Ivory / grey' },
    image: img('crop-jacket'),
    hover: img('crop-jacket-back'),
    gallery: ['crop-jacket', 'crop-jacket-back', 'jacket-front', 'jacket-34', 'jacket-detail-hood', 'jacket-detail-front', 'jacket-detail-sleeve', 'jacket-detail-back', 'jacket-flat'].map(img),
    price: '170 €' as string | null,
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
    kind: { fr: 'Pantalon / short', en: 'Trousers / shorts' },
    colour: { fr: 'Ivoire / gris', en: 'Ivory / grey' },
    image: img('crop-pant-long'),
    hover: img('crop-pant-shorts'),
    gallery: ['crop-pant-long', 'crop-pant-shorts', 'pant-front', 'pant-side', 'pant-back', 'pant-detail-pocket', 'pant-detail-side', 'pant-flat'].map(img),
    price: '140 €' as string | null,
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
    kind: { fr: 'Ensemble', en: 'Set' },
    colour: { fr: 'veste + pantalon, 30 € d’économie', en: 'jacket + trousers, save €30' },
    image: img('jacket-front'),
    hover: img('look-set-shorts'),
    gallery: ['jacket-front', 'look-set-shorts', 'crop-jacket', 'crop-pant-long', 'look-hood', 'jacket-back'].map(img),
    price: '280 €' as string | null,
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

/** The SOUTRAME mark (the cluster), kept as the brand symbol. `assemble` animates the satellites in. */
function Mark({ className = '', assemble = false }: { className?: string; assemble?: boolean }) {
  return (
    <svg viewBox="-71.78 -46.68 143.55 113.12" fill="currentColor" className={className} aria-hidden>
      <motion.circle cx="0" cy="0" r="30" initial={assemble ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: EASE }} />
      {SATELLITES.map((deg, i) => {
        const t = (deg * Math.PI) / 180;
        const x = Math.round(56 * Math.sin(t) * 100) / 100;
        const y = Math.round(-56 * Math.cos(t) * 100) / 100;
        return (
          <motion.g key={deg} initial={assemble ? { opacity: 0, x: Math.round(x * 6) / 10, y: Math.round(y * 6) / 10 } : false} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.06 }}>
            <rect x="-4.5" y="-56" width="9" height="56" transform={`rotate(${deg})`} />
            <circle cx={x} cy={y} r="17" />
          </motion.g>
        );
      })}
    </svg>
  );
}

/** Square button. On hover, the fill is woven in, thread by thread. */
function Btn({ children, href, disabled = false, full = false, external = false, onClick }: { children: React.ReactNode; href?: string; disabled?: boolean; full?: boolean; external?: boolean; onClick?: () => void }) {
  const cls = `group relative inline-flex h-[48px] items-center justify-between gap-8 overflow-hidden border px-4 ${TXT} ${full ? 'w-full' : 'w-full sm:w-auto sm:min-w-[260px]'} ${
    disabled ? 'cursor-not-allowed border-black/15 text-black/40' : 'border-[#0a0a0a] text-[#0a0a0a]'
  }`;
  const inner = (
    <>
      {!disabled && (
        <span aria-hidden className="absolute inset-0 flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={`block flex-1 scale-x-0 bg-[#0a0a0a] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 ${i % 2 ? 'origin-right' : 'origin-left'}`}
              style={{ transitionDelay: `${i * 35}ms` }}
            />
          ))}
        </span>
      )}
      <span className="relative transition-colors duration-300 group-hover:text-white">{children}</span>
      <span className="relative transition-colors duration-300 group-hover:text-white">{disabled ? '' : '→'}</span>
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

/** Image woven in, strip by strip. `inView` delays the weave until the image enters the screen. */
function Weave({ src, alt, strips = 12, priority = false, sizes, delay = 0, inView = false }: { src: string; alt: string; strips?: number; priority?: boolean; sizes: string; delay?: number; inView?: boolean }) {
  const stripH = 100 / strips + 0.2; // % of the container; the small overlap hides seams between strips
  const host = useRef<HTMLDivElement>(null);
  const seen = useInView(host, { once: true, margin: '0px 0px -15% 0px' });
  const go = !inView || seen; // one observer for the whole image, so every strip weaves together
  return (
    <div ref={host} className="absolute inset-0">
      {Array.from({ length: strips }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 overflow-hidden"
          style={{ top: `${(i * 100) / strips}%`, height: `${stripH}%`, transformOrigin: i % 2 ? 'right' : 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: go ? 1 : 0 }}
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

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1.1, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/* ───────────────────────── universe ─────────────────────────
 * Snow: the scattered dots of the SOUTRAME CYCLE posters, set in motion.
 * It lives inside the black chapter only, sized to it, and sleeps when off screen.
 */
function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
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
    let visible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const make = (y?: number): Flake => {
      const z = Math.random();
      return { x: Math.random() * w, y: y ?? Math.random() * h, r: 0.5 + z * z * 2.2, z, sway: 0.2 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2 };
    };

    const resize = () => {
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(160, (w * h) / 9000));
      flakes = Array.from({ length: count }, () => make());
      if (reduce) paintAll();
    };

    const paintAll = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        ctx.globalAlpha = 0.35 + f.z * 0.6;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    };

    const onMove = (e: PointerEvent) => {
      targetWind = (e.clientX / window.innerWidth - 0.5) * 0.9;
    };

    const draw = (time: number) => {
      wind += (targetWind - wind) * 0.02;
      for (const f of flakes) {
        f.y += 0.12 + f.z * 0.55;
        f.x += Math.sin(time * 0.0004 * f.sway + f.phase) * 0.18 + wind * (0.3 + f.z);
        if (f.y - f.r > h) Object.assign(f, make(-f.r * 2));
        if (f.x < -10) f.x = w + 10;
        if (f.x > w + 10) f.x = -10;
      }
      paintAll();
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    const ro = new ResizeObserver(resize);
    resize();
    io.observe(host);
    ro.observe(host);
    window.addEventListener('pointermove', onMove);
    document.addEventListener('visibilitychange', start);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />;
}

/* ───────────────────────── intro ───────────────────────── */

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(onDone, reduce ? 0 : 1500);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5" style={{ background: BG, color: INK }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: EASE }}>
      <Mark assemble className="w-12 md:w-14" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="text-[18px] uppercase leading-none" style={WORDMARK}>
        Soutrame
      </motion.span>
    </motion.div>
  );
}

/* ───────────────────────── chrome: breadcrumb, text logo, menu, bag ───────────────────────── */

function Drawer({ open, onClose, side, label, children }: { open: boolean; onClose: () => void; side: 'left' | 'right'; label: string; children: React.ReactNode }) {
  const t = useT();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-black/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-label={label}
            className={`fixed inset-y-0 z-[81] flex w-full flex-col bg-white p-5 sm:w-[420px] ${side === 'left' ? 'left-0' : 'right-0'}`}
            initial={{ x: side === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'left' ? '-100%' : '100%' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className={`${TXT} flex items-center justify-between`}>
              <span>{label}</span>
              <button onClick={onClose} className="text-black/50 transition hover:text-black">
                {t('Fermer', 'Close')}
              </button>
            </div>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Chrome({ filter, setFilter, count }: { filter: Category | 'all'; setFilter: (f: Category | 'all') => void; count: number }) {
  const t = useT();
  const { lang, setLang } = useLang();
  const [menu, setMenu] = useState(false);
  const [bag, setBag] = useState(false);
  const [filters, setFilters] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);
  const closeBag = useCallback(() => setBag(false), []);
  const go = (id: string) => {
    setMenu(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 350);
  };
  const current = FILTERS.find((f) => f.id === filter)!;
  const { scrollYProgress } = useScroll();
  const spin = useTransform(scrollYProgress, [0, 1], [0, 720]);

  return (
    <>
      {/* top-left: breadcrumb, count, filter */}
      <div className={`${TXT} fixed left-0 top-0 z-40 flex items-start gap-3 px-2 py-1.5 mix-blend-difference text-white md:px-3`}>
        <a href="#shop" className="hover:underline">
          Shop → {lang === 'fr' ? current.fr : current.en}
        </a>
        <span className="tabular-nums opacity-60">{count}</span>
        <div className="relative">
          <button onClick={() => setFilters((v) => !v)} className="hover:underline" aria-expanded={filters}>
            {t('Filtrer', 'Filter')}
          </button>
          <AnimatePresence>
            {filters && (
              <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }} className="absolute left-0 top-6 flex flex-col gap-1">
                {FILTERS.map((f) => (
                  <li key={f.id}>
                    <button
                      onClick={() => {
                        setFilter(f.id);
                        setFilters(false);
                        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`whitespace-nowrap ${filter === f.id ? 'underline' : 'opacity-60 hover:opacity-100'}`}
                    >
                      {lang === 'fr' ? f.fr : f.en}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* top-right: language */}
      <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className={`${TXT} fixed right-0 top-0 z-40 px-2 py-1.5 text-white mix-blend-difference hover:underline md:px-3`} aria-label={t('Switch to English', 'Passer en français')}>
        {lang === 'fr' ? 'EN' : 'FR'}
      </button>

      {/* bottom-left: the text logo, and the cluster that turns as you scroll — the cycle, always on screen */}
      <a href="#" className="fixed bottom-0 left-0 z-40 flex items-end gap-2 px-2 pb-1 text-white mix-blend-difference md:px-3" aria-label="SOUTRAME — haut de page">
        <span className="block text-[22px] uppercase leading-none md:text-[26px]" style={WORDMARK}>
          Soutrame
        </span>
        <motion.span style={{ rotate: spin }} className="mb-[3px] block w-[17px] md:w-[20px]">
          <Mark className="w-full" />
        </motion.span>
      </a>

      {/* bottom-right: menu, bag */}
      <div className={`${TXT} fixed bottom-0 right-0 z-40 flex gap-4 px-2 pb-1.5 text-white mix-blend-difference md:px-3`}>
        <button onClick={() => setMenu(true)} className="hover:underline">
          Menu
        </button>
        <button onClick={() => setBag(true)} className="hover:underline">
          {t('Panier', 'Bag')} (0)
        </button>
      </div>

      <Drawer open={menu} onClose={closeMenu} side="left" label="Menu">
        <nav className="mt-16 flex flex-col gap-1">
          {[
            ['shop', 'Shop', 'Shop'],
            ['lookbook', 'Lookbook', 'Lookbook'],
            ['cycle', 'Cycle', 'Cycle'],
            ['info', 'Informations', 'Information'],
          ].map(([id, fr, en]) => (
            <button key={id} onClick={() => go(id)} className="text-left text-[34px] leading-[1.05] transition hover:opacity-50" style={DISPLAY}>
              {lang === 'fr' ? fr : en}
            </button>
          ))}
        </nav>
        <div className={`${TXT} mt-auto flex flex-col gap-1 text-black/55`}>
          <a href={DROP.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black">
            Instagram
            <ArrowOut />
          </a>
          <Link href="/" className="hover:text-black">
            {t('Designé par Emmanuel Ijjou', 'Designed by Emmanuel Ijjou')}
          </Link>
        </div>
      </Drawer>

      <Drawer open={bag} onClose={closeBag} side="right" label={t('Panier', 'Bag')}>
        <div className="flex flex-1 flex-col items-start justify-center gap-4">
          <p className="text-[22px] leading-tight" style={DISPLAY}>
            {t('Ton panier est vide.', 'Your bag is empty.')}
          </p>
          <p className={`${TXT} max-w-[300px] text-black/55`}>
            {t('Les précommandes du Cycle 01 ouvrent bientôt. Le drop sera annoncé sur Instagram.', 'Pre-orders for Cycle 01 open soon. The drop will be announced on Instagram.')}
          </p>
          <div className="mt-2 w-full">
            <Btn href={DROP.instagram} external full>
              {t('Être prévenu', 'Get notified')}
            </Btn>
          </div>
        </div>
      </Drawer>
    </>
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
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section id="campaign" ref={ref} className="relative z-[1] h-[100svh] min-h-[560px] overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div style={{ y }} className="absolute inset-0 grid grid-cols-1 gap-1 md:grid-cols-3">
        {PANELS.map((set, k) => {
          // panel k moves on every third tick, offset by k
          const step = Math.floor((tick + (2 - k)) / 3);
          const cur = set[step % set.length];
          const prev = set[(step - 1 + set.length) % set.length];
          return (
            <div key={k} className={`relative h-full overflow-hidden ${k > 0 ? 'hidden md:block' : ''}`} style={{ background: PHOTO }}>
              {step > 0 && <Image src={prev} alt="" fill sizes="(min-width:768px) 70vw, 200vw" className="object-cover" />}
              {ready ? (
                <Weave key={cur} src={cur} alt="Chimera School — Cycle 01" priority={step === 0} sizes="(min-width:768px) 70vw, 200vw" delay={step === 0 ? k * 0.15 : 0} />
              ) : (
                <Image src={cur} alt="Chimera School" fill priority sizes="(min-width:768px) 70vw, 200vw" className="object-cover" />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* labels, mid-height, like a campaign page */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1, delay: 0.8 }} className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-start justify-between px-2 text-[14px] font-semibold leading-[1.15] md:px-3 md:text-[15px]">
        <h1>
          Cycle 01
          <br />
          Chimera School
        </h1>
        <nav className="pointer-events-auto text-right">
          <a href="#lookbook" className="block hover:underline">
            {t('Collection', 'Collection')}
          </a>
          <a href="#shop" className="block hover:underline">
            Shop
          </a>
        </nav>
      </motion.div>
    </section>
  );
}

function IntroFilm() {
  const t = useT();
  if (!INTRO_VIDEO) return null;
  return (
    <section className="relative z-[1] h-[100svh] overflow-hidden bg-black">
      <video src={INTRO_VIDEO} poster="/soutrame/intro-poster.jpg" autoPlay muted loop playsInline preload="auto" className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-start justify-between px-2 text-[14px] font-semibold leading-[1.15] text-white mix-blend-difference md:px-3 md:text-[15px]">
        <p>
          Cycle 01
          <br />
          Chimera School
        </p>
        <a href="#campaign" className="pointer-events-auto text-right hover:underline">
          {t('Entrer', 'Enter')} ↓
        </a>
      </div>
    </section>
  );
}

/* ───────────────────────── shop ─────────────────────────
 * A clear product grid: each card opens on the piece itself (flat lay), the worn look on hover,
 * and says plainly what it is — jacket, trousers, or the full set.
 */

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

function ProductCard({ p, index, onOpen }: { p: Piece; index: number; onOpen: (p: Piece) => void }) {
  const t = useT();
  const { lang } = useLang();
  const sizes = '(min-width:768px) 33vw, 100vw';
  return (
    <button onClick={() => onOpen(p)} className="group block w-full text-left" aria-label={`${p.name} — ${t('voir la pièce', 'view piece')}`}>
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: PHOTO }}>
        <Weave src={p.image} alt={p.name} inView priority={index === 0} sizes={sizes} delay={index * 0.1} />
        <HoverWeave src={p.hover} sizes={sizes} />
      </div>
      <div className="h-[2px] w-full bg-black/10">
        <div className="h-full w-0 bg-[#0a0a0a] transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full" />
      </div>
      <div className={`${TXT} flex items-start justify-between gap-4 px-2 pt-1.5 md:px-0`}>
        <div>
          <p>{p.name}</p>
          <p className="text-black/50">
            {p.kind[lang]} — {p.colour[lang]}
          </p>
        </div>
        <span className="shrink-0">{priceOf(p) ?? t('Prix à venir', 'Price soon')}</span>
      </div>
    </button>
  );
}

function Shop({ filter, onOpen }: { filter: Category | 'all'; onOpen: (p: Piece) => void }) {
  const t = useT();
  const shown = PIECES.filter((p) => filter === 'all' || p.category === filter);
  return (
    <section id="shop" className="relative z-[1] scroll-mt-8 px-0 pb-28 pt-10 md:px-3 md:pb-36 md:pt-16">
      <p className={`${TXT} mb-2 px-2 md:px-0`}>
        Shop → Cycle 01 <span className="ml-2 text-black/45">{t('Veste et pantalon, séparément ou en ensemble', 'Jacket and trousers, separately or as a set')}</span>
      </p>
      <motion.div layout className="grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
              <ProductCard p={p} index={i} onOpen={onOpen} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── product sheet ─────────────────────────
 * A full product page in an overlay: the images stacked on the left, the buying
 * information pinned on the right.
 */

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-black/15">
      <button onClick={() => setOpen((o) => !o)} className={`${TXT} flex w-full items-center justify-between py-3 text-left`}>
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="text-[15px] font-light leading-none">
          +
        </motion.span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className={`${TXT} pb-4 text-black/60`}>{children}</div>
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
          <div className={`${TXT} sticky top-0 z-10 flex items-center justify-between bg-white/85 px-2 py-1.5 backdrop-blur-md md:px-3`}>
            <button onClick={onClose} className="hover:underline">
              Shop → {piece.name}
            </button>
            <button onClick={onClose} className="hover:underline" aria-label={t('Fermer', 'Close')}>
              {t('Fermer', 'Close')}
            </button>
          </div>

          <div key={piece.id} className="grid grid-cols-1 md:grid-cols-12">
            {/* images: first one woven in, the rest two by two */}
            <div className="md:col-span-8">
              <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible">
                {piece.gallery.map((g, i) => (
                  <div key={g} className="relative aspect-[4/5] w-[86vw] shrink-0 snap-start overflow-hidden md:w-auto" style={{ background: PHOTO }}>
                    {i === 0 ? (
                      <Weave src={g} alt={`${piece.name} — 1`} strips={12} priority sizes="(min-width:768px) 33vw, 86vw" delay={0.35} />
                    ) : (
                      <Image src={g} alt={`${piece.name} — ${i + 1}`} fill sizes="(min-width:768px) 33vw, 86vw" className="object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* buying information, pinned while the images scroll */}
            <div className="px-2 md:col-span-4 md:px-6">
              <div className="pb-16 pt-6 md:sticky md:top-10 md:pt-4">
                <h3 className="text-[22px] leading-[1.05] md:text-[26px]" style={DISPLAY}>
                  {piece.name}
                </h3>
                <div className={`${TXT} mt-2 flex justify-between text-black/55`}>
                  <span>{piece.colour[lang]}</span>
                  <span>{priceOf(piece) ?? t('Prix annoncé bientôt', 'Price announced soon')}</span>
                </div>

                <div className="mt-8">
                  <div className={`${TXT} flex items-center justify-between`}>
                    <span>{t('Taille', 'Size')}</span>
                    {!sizesLive && <span className="text-black/40">{t('Ouverture prochaine', 'Opening soon')}</span>}
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-1">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        disabled={!sizesLive}
                        onClick={() => setSize(s)}
                        className={`h-10 border text-[12px] transition duration-300 ${
                          size === s ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white' : sizesLive ? 'border-black/20 hover:border-black/60' : 'cursor-not-allowed border-black/10 text-black/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <BuyButton full price={priceOf(piece)} />
                </div>
                <p className={`${TXT} mt-2 text-black/45`}>
                  {t('Petite série, produite à la commande. Annonce du drop sur Instagram.', 'Small run, made to order. The drop is announced on Instagram.')}
                </p>

                <div className="mt-8">
                  <Accordion title={t('Description', 'Description')} defaultOpen>
                    <ul className="space-y-1">
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
                  <div className="border-t border-black/15" />
                </div>
              </div>
            </div>
          </div>

          {/* complete the look */}
          <div className="px-2 pb-16 pt-10 md:px-3">
            <p className={`${TXT} mb-2`}>{t('Compléter la silhouette', 'Complete the look')}</p>
            <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
              {others.map((p) => (
                <button key={p.id} onClick={() => onOpen(p)} className="group text-left">
                  <div className="relative aspect-[4/5] overflow-hidden" style={{ background: PHOTO }}>
                    <Image src={p.image} alt={p.name} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
                  </div>
                  <p className={`${TXT} mt-1.5`}>{p.name}</p>
                  <p className={`${TXT} text-black/50`}>{priceOf(p) ?? t('Prix à venir', 'Price soon')}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── lookbook ─────────────────────────
 * The campaign as one strip, edge to edge: drag it, scroll it sideways, or use the numbers.
 * A rule in ink shows how far along you are.
 */

function Lookbook() {
  const t = useT();
  const { lang } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [progress, setProgress] = useState(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      const first = el.firstElementChild as HTMLElement | null;
      const step = first ? first.offsetWidth + 4 : 1;
      setAt(Math.min(LOOKBOOK.length - 1, Math.round(el.scrollLeft / step)));
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  };

  // drag to scroll with a mouse; touch keeps its native swipe
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <section id="lookbook" className="relative z-[1] scroll-mt-8 pb-28 pt-8 md:pb-36">
      <p className={`${TXT} px-2 pb-2 md:px-3`}>
        Lookbook → {t('la campagne', 'the campaign')} <span className="ml-2 text-black/45">{t('Faire glisser', 'Drag')} →</span>
      </p>
      <div
        ref={track}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="flex cursor-grab select-none gap-1 overflow-x-auto active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {LOOKBOOK.map((s, i) => (
          <div key={s.src} className="relative aspect-[4/5] w-[82vw] shrink-0 overflow-hidden md:h-[78svh] md:w-auto" style={{ background: PHOTO }}>
            {i < 3 ? (
              <Weave src={s.src} alt={`Chimera School — ${s.label[lang]}`} inView strips={10} sizes="(min-width:768px) 50vw, 82vw" delay={i * 0.12} />
            ) : (
              <Image src={s.src} alt={`Chimera School — ${s.label[lang]}`} fill sizes="(min-width:768px) 50vw, 82vw" className="object-cover" draggable={false} />
            )}
          </div>
        ))}
      </div>
      <div className="relative h-[3px] w-full bg-black/10">
        <div className="absolute inset-y-0 left-0 bg-[#0a0a0a] transition-[width] duration-200" style={{ width: `${12 + progress * 88}%` }} />
      </div>
      <div className={`${TXT} flex items-start justify-between gap-4 px-2 pt-1.5 md:px-3`}>
        <AnimatePresence mode="wait">
          <motion.span key={at} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {LOOKBOOK[at].label[lang]}
          </motion.span>
        </AnimatePresence>
        <div className="flex gap-2 tabular-nums">
          {LOOKBOOK.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={i === at ? 'text-black' : 'text-black/30 hover:text-black/70'} aria-label={`${t('Image', 'Image')} ${i + 1}`}>
              {i}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── the universe: one black chapter ───────────────────────── */

function Universe() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xLeft = useTransform(scrollYProgress, [0, 0.4, 1], ['-14vw', '0vw', '3vw']);
  const xRight = useTransform(scrollYProgress, [0, 0.4, 1], ['14vw', '0vw', '-3vw']);
  const line = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
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
    <section id="cycle" ref={ref} className="relative z-[1] overflow-hidden bg-[#0a0a0a] text-white">
      <Snow />
      <div className="relative flex min-h-[70svh] flex-col items-center justify-center px-4 py-28">
        <div className="flex w-full flex-col items-center gap-2 md:flex-row md:justify-center md:gap-[4vw]">
          <motion.p style={{ x: wide ? xLeft : 0, ...DISPLAY }} className="whitespace-nowrap text-[12vw] uppercase leading-none md:text-[5.2vw]">
            Soutrame
          </motion.p>
          <motion.span style={{ scaleX: line }} aria-hidden className="hidden h-px w-[6vw] origin-center bg-white/50 md:block" />
          <motion.p style={{ x: wide ? xRight : 0, ...DISPLAY }} className="whitespace-nowrap text-[12vw] uppercase leading-none md:text-[5.2vw]">
            Cycle
          </motion.p>
        </div>
      </div>
      {/* the capsule, as a short collection note in the shop's own small voice */}
      <div className="relative grid grid-cols-1 gap-y-8 px-2 pb-28 md:grid-cols-4 md:gap-x-3 md:px-3 md:pb-40">
        <Reveal>
          <p className="text-[14px] font-semibold leading-[1.15] md:text-[15px]">
            Cycle 01
            <br />
            Chimera School
          </p>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-2">
          <p className={`${TXT} max-w-[440px] text-white/80`}>
            {t(
              'Première capsule de SOUTRAME. Un ensemble en deux pièces : une veste de survêtement courte à capuche, fermée au col par un brandebourg tressé, et un pantalon large dont les jambes se détachent. Nylon ivoire, empiècements en mesh gris. Chimère brodée sur la poitrine, cerf sur la poche arrière.',
              'SOUTRAME’s first capsule. A two-piece set: a cropped hooded track jacket, closed at the collar by a braided frog, and wide trousers with zip-off legs. Ivory nylon, grey mesh panels. Chimera embroidered on the chest, deer on the back pocket.'
            )}
          </p>
          <p className={`${TXT} mt-4 max-w-[440px] text-white/50`}>{t('Dessinée à Paris. Petite série, produite à la commande.', 'Designed in Paris. Small run, made to order.')}</p>
        </Reveal>
        <Reveal delay={0.2} className="flex items-start justify-between md:flex-col md:items-end md:gap-6">
          {/* the chimera embroidered on the jacket, kept small */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/soutrame/chimera.svg" alt="" className="h-12 w-auto md:h-14" />
          <p className="text-[15px] uppercase leading-none text-white/60 md:text-[16px]" style={MANTRA}>
            I can never be food.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── information ───────────────────────── */

function Info() {
  const t = useT();
  const soon = 'text-black/35';
  return (
    <footer id="info" className={`${TXT} relative z-[1] px-2 pb-16 pt-10 md:px-3 md:pb-20`}>
      <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
        <div className="flex flex-col">
          <p>{t('Informations', 'Information')}</p>
          <span className={soon}>{t('Livraison', 'Shipping')}</span>
          <span className={soon}>{t('Retours et échanges', 'Returns & exchanges')}</span>
          <span className={soon}>{t('Conditions générales de vente', 'Terms of sale')}</span>
          <span className={soon}>{t('Mentions légales', 'Legal notice')}</span>
        </div>
        <div className="flex flex-col">
          <p>Contact</p>
          <a href={DROP.instagram} target="_blank" rel="noopener noreferrer" className="text-black/55 hover:text-black">
            Instagram
            <ArrowOut />
          </a>
        </div>
        <div className="flex flex-col">
          <p>Cycle 01</p>
          <span className="text-black/55">Chimera School</span>
          <span className="text-black/55">{t('Précommandes bientôt', 'Pre-orders soon')}</span>
        </div>
        <div className="flex flex-col">
          <p>Studio</p>
          <Link href="/" className="text-black/55 hover:text-black">
            {t('Designé par Emmanuel Ijjou', 'Designed by Emmanuel Ijjou')}
          </Link>
        </div>
      </div>
      <p className={`mt-10 ${soon}`}>{t('Les pages d’information seront publiées à l’ouverture des ventes.', 'Information pages will be published when sales open.')}</p>
    </footer>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function SoutramePage() {
  const [openPiece, setOpenPiece] = useState<Piece | null>(null);
  const closeSheet = useCallback(() => setOpenPiece(null), []);
  const [ready, setReady] = useState(false);
  const finishIntro = useCallback(() => setReady(true), []);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const count = PIECES.filter((p) => filter === 'all' || p.category === filter).length;

  // smooth scrolling (Lenis is already a dependency of the site)
  useEffect(() => {
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      if (cancelled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      lenis = new Lenis({ duration: 1.2, smoothWheel: true });
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
    <div className="relative min-h-screen antialiased selection:bg-[#0a0a0a] selection:text-white" style={{ background: BG, color: INK, fontFamily: 'var(--font-general-sans), Inter, sans-serif' }}>
      <AnimatePresence>{!ready && <Intro onDone={finishIntro} />}</AnimatePresence>
      <Chrome filter={filter} setFilter={setFilter} count={count} />

      <IntroFilm />
      <Campaign ready={ready} />
      <Shop filter={filter} onOpen={setOpenPiece} />
      <Lookbook />
      <Universe />
      <Info />

      <ProductSheet piece={openPiece} onClose={closeSheet} onOpen={setOpenPiece} />
    </div>
  );
}
