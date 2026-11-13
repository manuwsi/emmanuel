'use client';

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

/**
 * SOUTRAME.CYCLE — brand shop page (Cycle 01 · Chimera School).
 *
 * To open sales, fill in DROP below:
 *  - price: e.g. '240 €' for the set (or a price per piece in PIECES)
 *  - sizes: e.g. ['S', 'M', 'L']
 *  - checkoutUrl: the Stripe Payment Link (https://buy.stripe.com/...)
 * While checkoutUrl is null, every buy button shows "Coming soon" and is disabled.
 */
const DROP = {
  price: null as string | null,
  sizes: [] as string[],
  checkoutUrl: null as string | null,
  instagram: 'https://www.instagram.com/manu.wsi/',
};

/** Shown greyed-out in the size picker until DROP.sizes is filled in. */
const SIZE_PREVIEW = ['S', 'M', 'L', 'XL'];

const W = 1080;
const H = 1350;
const EASE = [0.22, 1, 0.36, 1] as const;

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

/* ───────────────────────── helpers ───────────────────────── */

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`${/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative '}overflow-hidden border border-white/[0.12] bg-white/[0.04] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent"
      />
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word opacity tied to scroll. */
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
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}{' '}
    </motion.span>
  );
}

function BuyButton({ full = false }: { full?: boolean }) {
  const t = useT();
  const open = Boolean(DROP.checkoutUrl);
  const base = `group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] ${full ? 'w-full' : ''}`;
  if (!open) {
    return (
      <span aria-disabled="true" className={`${base} cursor-default border border-white/15 bg-white/[0.04] text-white/55 backdrop-blur-xl`}>
        <span className="mr-2.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
        {t('Bientôt disponible', 'Coming soon')}
      </span>
    );
  }
  return (
    <a href={DROP.checkoutUrl as string} target="_blank" rel="noopener noreferrer" className={`${base} bg-[#ecebe6] text-[#0b0b0b]`}>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">
        {t('Précommander', 'Pre-order')}
        {DROP.price ? ` — ${DROP.price}` : ''}
      </span>
    </a>
  );
}

/* ───────────────────────── sections ───────────────────────── */

function Hero() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yMain = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const yA = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const yB = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);
  const yC = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // subtle mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const px = useTransform(sx, (v) => v * -18);
  const py = useTransform(sy, (v) => v * -12);
  const px2 = useTransform(sx, (v) => v * 30);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      {/* ambient blurred glow from the hero shot */}
      <div aria-hidden className="absolute inset-0 scale-125 opacity-50 blur-[90px] saturate-50">
        <Image src="/soutrame/front.jpg" alt="" fill priority sizes="40vw" className="object-cover" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0b0b0b_75%)]" />

      {/* floating shots, PAF-style */}
      <motion.div style={{ y: yA, x: px2 }} className="absolute left-[6%] top-[22%] hidden w-[13vw] max-w-[220px] md:block">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.9, scale: 1 }} transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}>
          <Image src="/soutrame/hood-profile.jpg" alt="" width={W} height={H} sizes="13vw" className="h-auto w-full" />
        </motion.div>
      </motion.div>
      <motion.div style={{ y: yB, x: px }} className="absolute left-[24%] top-[58%] hidden w-[7vw] max-w-[120px] md:block">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ duration: 1.6, ease: EASE, delay: 0.8 }}>
          <Image src="/soutrame/detail-hem.jpg" alt="" width={W} height={H} sizes="7vw" className="h-auto w-full" />
        </motion.div>
      </motion.div>
      <motion.div style={{ y: yC, x: px2 }} className="absolute right-[7%] top-[16%] hidden w-[16vw] max-w-[260px] md:block">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.95, scale: 1 }} transition={{ duration: 1.6, ease: EASE, delay: 0.65 }}>
          <Image src="/soutrame/back-34.jpg" alt="" width={W} height={H} sizes="16vw" className="h-auto w-full" />
        </motion.div>
      </motion.div>
      <motion.div style={{ y: yB, x: px }} className="absolute right-[26%] top-[66%] hidden w-[8vw] max-w-[130px] md:block">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 1.6, ease: EASE, delay: 1 }}>
          <Image src="/soutrame/detail-jacket.jpg" alt="" width={W} height={H} sizes="8vw" className="h-auto w-full" />
        </motion.div>
      </motion.div>

      {/* main shot */}
      <div className="absolute left-1/2 top-1/2 w-[78vw] max-w-[440px] -translate-x-1/2 -translate-y-1/2 md:w-[28vw]">
      <motion.div style={{ y: yMain, x: py }}>
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(16px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
          className="shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]"
        >
          <Image src="/soutrame/front.jpg" alt="Chimera School Track Jacket" width={W} height={H} priority sizes="(min-width:768px) 28vw, 78vw" className="h-auto w-full" />
        </motion.div>
      </motion.div>
      </div>

      {/* bottom-left title + nav */}
      <motion.div style={{ opacity: fade }} className="absolute bottom-6 left-5 z-10 md:bottom-10 md:left-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="text-[11px] uppercase tracking-[0.22em] text-white/50">
          {t('Première collection', 'First collection')} · Cycle 01
        </motion.p>
        <nav className="mt-3 flex flex-col text-[34px] leading-[1.08] tracking-tight md:text-[52px]">
          {[
            { href: '#collection', label: 'Chimera School' },
            { href: '#lookbook', label: 'Lookbook' },
            { href: '#manifesto', label: t('Manifeste', 'Manifesto') },
          ].map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1 + i * 0.12 }}
              className={`w-fit transition-colors duration-500 ${i === 0 ? 'text-[#ecebe6]' : 'text-white/35 hover:text-[#ecebe6]'}`}
            >
              {l.label}
            </motion.a>
          ))}
        </nav>
      </motion.div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-8 right-8 z-10 hidden text-right text-[11px] uppercase tracking-[0.22em] text-white/40 md:block">
        {t('Défiler', 'Scroll')}
        <motion.span
          className="mx-auto mt-3 block h-10 w-px bg-white/30"
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}

type Piece = (typeof PIECES)[number];

function Collection({ onOpen }: { onOpen: (p: Piece) => void }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <section id="collection" className="relative scroll-mt-0 px-5 py-28 md:px-8 md:py-40">
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Cycle 01 — {t('La collection', 'The collection')}</p>
          <h2 className="mt-4 text-[44px] leading-[0.95] tracking-tight md:text-[96px]">Chimera School</h2>
        </div>
        <p className="max-w-[360px] text-[14px] leading-relaxed text-white/55">
          {t(
            'Une veste et un pantalon. Peu de pièces, mais pensées : une tenue d’uniforme revisitée, entre technique et broderie.',
            'One jacket, one pair of trousers. Few pieces, carefully considered: a reworked uniform, between technical wear and embroidery.'
          )}
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {PIECES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.12}>
            <article
              className="group relative cursor-pointer overflow-hidden"
              onClick={() => onOpen(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p)}
              aria-label={`${p.name} — ${t('voir la fiche', 'view product')}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={p.image} alt={p.name} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] group-hover:opacity-0" />
                <Image src={p.hover} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="scale-[1.06] object-cover opacity-0 transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-hover:opacity-100" />
                <span className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.22em] text-black/50 mix-blend-difference md:left-5 md:top-5">
                  {p.id}
                </span>
              </div>

              {/* frosted info panel floating over the photo */}
              <Glass className="absolute inset-x-3 bottom-3 rounded-2xl p-5 md:inset-x-5 md:bottom-5 md:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[17px] font-medium md:text-[19px]">{p.name}</h3>
                  <span className="shrink-0 text-[13px] text-white/60">{p.price ?? DROP.price ?? t('Prix à venir', 'Price soon')}</span>
                </div>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:grid-rows-[1fr] max-md:grid-rows-[1fr]">
                  <ul className="overflow-hidden text-[13px] leading-relaxed text-white/65">
                    <div className="pt-4" />
                    {(lang === 'fr' ? p.details.fr : p.details.en).map((d) => (
                      <li key={d} className="flex gap-3 py-0.5">
                        <span className="mt-[10px] h-px w-3 shrink-0 bg-white/40" />
                        {d}
                      </li>
                    ))}
                    <li className="pt-4 text-[11px] uppercase tracking-[0.22em] text-white/80">
                      {t('Voir la pièce', 'View piece')} →
                    </li>
                  </ul>
                </div>
              </Glass>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-[12px] uppercase tracking-[0.22em] text-white/50">
          {DROP.sizes.length > 0 ? `${t('Tailles', 'Sizes')} — ${DROP.sizes.join(' / ')}` : t('Tailles annoncées bientôt', 'Sizes announced soon')}
        </div>
        <BuyButton />
      </Reveal>
    </section>
  );
}


function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-white/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 text-left text-[11px] uppercase tracking-[0.22em] text-white/80">
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="text-[16px] font-light leading-none">
          +
        </motion.span>
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [piece, onClose]);

  return (
    <AnimatePresence>
      {piece && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          {/* backdrop: the page stays visible, blurred */}
          <motion.button
            aria-label={t('Fermer', 'Close')}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={piece.name}
            className="absolute inset-y-0 right-0 flex w-full max-w-[1120px] flex-col overflow-y-auto border-l border-white/10 bg-[#0e0e0e]/70 backdrop-blur-3xl md:flex-row md:overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.9, ease: EASE }}
            data-lenis-prevent
          >
            {/* gallery */}
            <div className="relative md:w-[58%]">
              <div className="relative aspect-[4/5] w-full md:h-full md:aspect-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={piece.gallery[img]}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <Image src={piece.gallery[img]} alt={`${piece.name} — ${img + 1}`} fill sizes="(min-width:768px) 650px, 100vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                <button
                  aria-label={t('Image précédente', 'Previous image')}
                  onClick={() => setImg((i) => (i - 1 + piece.gallery.length) % piece.gallery.length)}
                  className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize"
                />
                <button
                  aria-label={t('Image suivante', 'Next image')}
                  onClick={() => setImg((i) => (i + 1) % piece.gallery.length)}
                  className="absolute inset-y-0 right-0 w-2/3 cursor-e-resize"
                />
                <Glass className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full px-3 py-2.5">
                  {piece.gallery.map((g, i) => (
                    <button
                      key={g}
                      aria-label={`${t('Image', 'Image')} ${i + 1}`}
                      onClick={() => setImg(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === img ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                    />
                  ))}
                </Glass>
              </div>
            </div>

            {/* info */}
            <div className="relative flex flex-col p-6 md:w-[42%] md:overflow-y-auto md:p-10">
              <div className="flex items-start justify-between gap-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Cycle 01 — {piece.id}</p>
                <button onClick={onClose} className="-mr-2 -mt-2 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/60 transition hover:bg-white/10 hover:text-white">
                  {t('Fermer', 'Close')} ✕
                </button>
              </div>
              <h3 className="mt-6 text-[30px] leading-[1.05] tracking-tight md:text-[38px]">{piece.name}</h3>
              <p className="mt-3 text-[15px] text-white/70">{piece.price ?? DROP.price ?? t('Prix annoncé bientôt', 'Price announced soon')}</p>

              {/* thumbnails */}
              <div className="mt-8 grid grid-cols-5 gap-2">
                {piece.gallery.map((g, i) => (
                  <button key={g} onClick={() => setImg(i)} className={`relative aspect-[4/5] overflow-hidden transition duration-500 ${i === img ? 'opacity-100 ring-1 ring-white/70' : 'opacity-40 hover:opacity-80'}`}>
                    <Image src={g} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>

              {/* sizes */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em]">
                  <span className="text-white/80">{t('Taille', 'Size')}</span>
                  {!sizesLive && <span className="text-white/40">{t('Ouverture prochainement', 'Opening soon')}</span>}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      disabled={!sizesLive}
                      onClick={() => setSize(s)}
                      className={`rounded-full border py-3 text-[12px] tracking-[0.12em] transition duration-300 ${
                        size === s
                          ? 'border-white bg-white text-black'
                          : sizesLive
                            ? 'border-white/20 bg-white/[0.03] hover:border-white/60'
                            : 'cursor-not-allowed border-white/10 text-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <BuyButton full />
              </div>

              <div className="mt-10">
                <Accordion title={t('Description', 'Description')} defaultOpen>
                  <ul className="space-y-1.5">
                    {(lang === 'fr' ? piece.details.fr : piece.details.en).map((d) => (
                      <li key={d} className="flex gap-3">
                        <span className="mt-[10px] h-px w-3 shrink-0 bg-white/40" />
                        {d}
                      </li>
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

              <p className="mt-auto pt-10 text-[11px] uppercase tracking-[0.22em] text-white/30">I can never be food.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Lookbook() {
  const t = useT();
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const shot = LOOKBOOK[active];

  // keyboard navigation
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
    <section id="lookbook" className="relative overflow-hidden border-t border-white/[0.08]">
      {/* ambient background follows the selected shot */}
      <AnimatePresence mode="sync">
        <motion.div
          key={shot.src + '-bg'}
          aria-hidden
          className="absolute inset-0 scale-125 blur-[100px] saturate-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Image src={shot.src} alt="" fill sizes="30vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/40 to-[#0b0b0b]" />

      <div className="relative grid min-h-[100svh] grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* thumbnail column */}
        <div className="order-2 flex gap-3 overflow-x-auto px-5 pb-8 md:order-1 md:flex-col md:items-center md:gap-6 md:max-h-[100svh] md:overflow-y-auto md:px-0 md:pb-16 md:pt-32 [scrollbar-width:none]">
          {LOOKBOOK.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={s.label[lang]}
              className={`relative w-[64px] shrink-0 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:w-[84px] ${
                i === active ? 'scale-105 opacity-100' : 'opacity-35 hover:opacity-80'
              }`}
            >
              <Image src={s.src} alt="" width={W} height={H} sizes="84px" className="h-auto w-full" />
              {i === active && <motion.span layoutId="lb-dot" className="absolute -left-3 top-1/2 hidden h-1 w-1 -translate-y-1/2 rounded-full bg-white md:block" />}
            </button>
          ))}
        </div>

        {/* immersive scene */}
        <div className="relative order-1 flex items-center justify-center px-5 pb-6 pt-24 md:order-2 md:px-16 md:py-24">
          <div className="relative w-full max-w-[560px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={shot.src}
                initial={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.985, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: EASE }}
                className="shadow-[0_60px_140px_-40px_rgba(0,0,0,0.9)]"
              >
                <Image src={shot.src} alt={`Chimera School — ${shot.label[lang]}`} width={W} height={H} sizes="(min-width:768px) 560px, 90vw" className="h-auto w-full" />
              </motion.div>
            </AnimatePresence>

            <Glass className="absolute -bottom-4 left-4 right-4 flex items-center justify-between rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.2em] md:-right-10 md:left-auto md:bottom-10 md:w-[280px]">
              <AnimatePresence mode="wait">
                <motion.span key={shot.src} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
                  {shot.label[lang]}
                </motion.span>
              </AnimatePresence>
              <span className="tabular-nums text-white/50">
                {String(active + 1).padStart(2, '0')} / {String(LOOKBOOK.length).padStart(2, '0')}
              </span>
            </Glass>
          </div>

          <p className="absolute left-5 top-8 text-[11px] uppercase tracking-[0.22em] text-white/45 md:left-16 md:top-10">
            Lookbook — Cycle 01
          </p>
          <p className="absolute right-8 top-10 hidden text-[11px] uppercase tracking-[0.22em] text-white/30 md:block">
            {t('Survoler pour parcourir', 'Hover to browse')}
          </p>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const t = useT();
  return (
    <section id="manifesto" className="relative overflow-hidden border-t border-white/[0.08] px-5 py-32 md:px-8 md:py-48">
      <div aria-hidden className="absolute -right-[20%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-white/[0.04] blur-[120px]" />
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">SOUTRAME.CYCLE — {t('Manifeste', 'Manifesto')}</p>
        </Reveal>
        <ScrollWords
          text="I can never be food."
          className="mt-8 text-[56px] leading-[0.95] tracking-tight md:text-[150px]"
        />
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-16">
          <Reveal>
            <ScrollWords
              className="text-[18px] leading-[1.5] text-[#ecebe6] md:text-[22px]"
              text={t(
                'SOUTRAME fait référence à la trame qu’on a tous en nous : ce qui se construit à force de vécu, de doutes, de retours. CYCLE rappelle que rien n’est linéaire : on avance, on bloque, on revient.',
                'SOUTRAME refers to the inner thread we all carry: what gets built through experience, doubt and return. CYCLE is a reminder that nothing is linear: we move forward, we stall, we come back.'
              )}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Glass className="rounded-2xl p-6 md:p-8">
              <p className="text-[14px] leading-relaxed text-white/65 md:text-[15px]">
                {t(
                  '« I can never be food » n’est pas une phrase agressive. C’est une affirmation intérieure : ne pas être consommé, ne pas être vidé, ne pas être formaté. Même quand c’est difficile, quelque chose refuse de disparaître.',
                  '“I can never be food” is not an aggressive line. It is an inner statement: not to be consumed, not to be emptied, not to be shaped by what surrounds us. Even when it is hard, something refuses to disappear.'
                )}
              </p>
            </Glass>
          </Reveal>
        </div>
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
    <div className="relative min-h-screen bg-[#0b0b0b] text-[#ecebe6] antialiased selection:bg-white selection:text-black" style={{ fontFamily: 'var(--font-general-sans), Inter, sans-serif' }}>
      <Grain />

      {/* scroll progress */}
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-white/60" />

      {/* top bar — PAF-style small label + frosted pill */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-start justify-between bg-gradient-to-b from-[#0b0b0b]/90 via-[#0b0b0b]/40 to-transparent px-5 pb-10 pt-5 md:px-8 md:pt-6">
        <a href="#" className="text-[11px] leading-[1.35] tracking-[0.04em]">
          <span className="block font-medium">SOUTRAME.CYCLE</span>
          <span className="block text-white/50">Cycle 01 — Chimera School</span>
        </a>
        <Glass className="flex items-center gap-1 rounded-full p-1 text-[11px] uppercase tracking-[0.18em]">
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="rounded-full px-3.5 py-2 text-white/60 transition hover:text-white"
            aria-label={t('Switch to English', 'Passer en français')}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <a href="#collection" className="rounded-full bg-white/[0.08] px-3.5 py-2 transition hover:bg-white/[0.16]">
            {t('Boutique', 'Shop')}
          </a>
        </Glass>
      </header>

      <Hero />
      <Collection onOpen={setOpenPiece} />
      <Lookbook />
      <Manifesto />
      <ProductSheet piece={openPiece} onClose={closeSheet} />

      {/* footer */}
      <footer className="relative border-t border-white/[0.08] px-5 pb-10 pt-20 md:px-8">
        <Reveal>
          <p className="text-[15vw] font-medium leading-[0.8] tracking-[-0.04em] text-white/[0.92] md:text-[12.5vw]">SOUTRAME</p>
        </Reveal>
        <div className="mt-10 flex flex-col gap-6 text-[11px] uppercase tracking-[0.22em] text-white/50 md:flex-row md:items-end md:justify-between">
          <span>{t('Peu de pièces, mais pensées. Par cycles.', 'Few pieces, carefully considered. In cycles.')}</span>
          <div className="flex gap-6">
            <a href={DROP.instagram} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
              Instagram
            </a>
            <Link href="/" className="transition hover:text-white">
              {t('Designé par Emmanuel Ijjou', 'Designed by Emmanuel Ijjou')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
