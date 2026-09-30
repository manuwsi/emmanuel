'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang, useT } from '@/components/i18n';

/**
 * Soutrame showroom.
 * A different world from the portfolio on purpose: white, quiet, almost no text.
 * Mood first, information second.
 */

const photos = ['/soutrame/front.jpg', '/soutrame/down.jpg', '/soutrame/side.jpg'];

const sans = { fontFamily: '"General Sans", "Helvetica Neue", Helvetica, Arial, sans-serif' };

function Pill({ children, className = '', ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      {...props}
      className={`h-9 rounded-full bg-neutral-100 px-4 text-[0.78rem] leading-none text-neutral-900 transition-colors hover:bg-neutral-200 ${className}`}
    >
      {children}
    </button>
  );
}

function Chimera({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/soutrame/chimera.svg" alt="" aria-hidden className={className} style={style} draggable={false} />;
}

function Topbar() {
  const t = useT();
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-12 pt-4 md:pt-12" style={sans}>
      <div ref={ref} className="relative flex gap-2 justify-self-start">
        <button
          type="button"
          aria-label={t('Menu', 'Menu')}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="h-9 w-9 rounded-full bg-neutral-100 grid place-items-center transition-colors hover:bg-neutral-200"
        >
          <Chimera className="h-4 w-4" />
        </button>
        <Link
          href="/"
          className="h-9 rounded-full bg-neutral-100 px-4 grid place-items-center text-[0.78rem] text-neutral-900 transition-colors hover:bg-neutral-200"
        >
          {t('Travaux', 'Work')}
        </Link>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -6, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(8px)' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="absolute left-0 top-12 w-56 overflow-hidden rounded-3xl bg-neutral-100/80 backdrop-blur-2xl p-5 text-[0.85rem] text-neutral-900"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 top-2 h-44 w-44 rounded-full bg-neutral-500/40 blur-3xl"
              />
              <ul className="relative space-y-3">
                <li><Link href="/" className="hover:opacity-60 transition-opacity">{t('Travaux', 'Work')}</Link></li>
                <li><Link href="/about" className="hover:opacity-60 transition-opacity">{t('À propos', 'About')}</Link></li>
                <li><a href="mailto:emmanuelijjou@gmail.com" className="hover:opacity-60 transition-opacity">Contact</a></li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <span className="justify-self-center text-[0.95rem] md:text-[1.35rem] font-semibold uppercase tracking-tight text-black">
        Soutrame
      </span>

      <div className="flex gap-2 justify-self-end">
        <Pill onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} aria-label={t('Changer de langue', 'Switch language')}>
          {lang === 'fr' ? 'EN' : 'FR'}
        </Pill>
      </div>
    </header>
  );
}

function Hero() {
  const t = useT();
  return (
    <section className="relative h-[100svh] w-full overflow-hidden" style={sans}>
      {/* fog */}
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        <motion.span
          className="block h-[46vmax] w-[46vmax] rounded-full bg-neutral-400/50 blur-[90px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      >
        <Chimera className="w-36 md:w-56 h-auto" />
      </motion.div>
      <div className="absolute inset-x-4 md:inset-x-12 bottom-16 md:bottom-24 flex items-end justify-between text-[0.72rem] text-neutral-700">
        <span>Drop 01</span>
        <span>{t('Bientôt', 'Soon')}</span>
      </div>
    </section>
  );
}

function Card({ index }: { index: number }) {
  const t = useT();
  const [hover, setHover] = useState(false);
  const isEmblem = index === 3;
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: (index % 4) * 0.06 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="min-w-0"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-100">
        {isEmblem ? (
          <>
            <span aria-hidden className="absolute left-1/2 top-1/2 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400/60 blur-3xl" />
            <div className="absolute inset-0 grid place-items-center">
              <Chimera className="w-1/2 h-auto transition-transform duration-700 ease-out" style={{ transform: hover ? 'scale(1.06)' : 'scale(1)' }} />
            </div>
          </>
        ) : (
          <>
            <Image
              src={photos[index]}
              alt={t('Soutrame — ensemble, drop 01', 'Soutrame — set, drop 01')}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
              priority={index < 2}
            />
            <Image
              src={photos[(index + 1) % photos.length]}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-opacity duration-500"
              style={{ opacity: hover ? 1 : 0 }}
            />
          </>
        )}
      </div>
      <div className="mt-3 text-[0.72rem] leading-snug text-neutral-900" style={sans}>
        <p>{isEmblem ? t('La chimère', 'The chimera') : t('Ensemble (Drop 01)', 'Set (Drop 01)')}</p>
        <p className="text-neutral-500">{t('Bientôt', 'Soon')}</p>
      </div>
    </motion.article>
  );
}

function Density({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div
      className="fixed bottom-4 md:bottom-8 left-4 md:left-12 z-40 flex items-center gap-3 rounded-full bg-white/60 backdrop-blur-xl pl-4 pr-4 h-9 text-[0.72rem] text-neutral-700"
      style={sans}
    >
      <input
        type="range"
        min={1}
        max={4}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Colonnes"
        className="h-px w-20 md:w-28 cursor-pointer appearance-none bg-neutral-400 accent-black [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-neutral-400 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-neutral-400 [&::-moz-range-thumb]:bg-white"
      />
      <span className="tabular-nums w-2 text-right">{value}</span>
    </div>
  );
}

export default function Page() {
  const t = useT();
  const [cols, setCols] = useState(4);

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) setCols(2);
  }, []);

  return (
    <main className="block overflow-x-clip snap-none min-h-screen bg-white text-black [@media(pointer:fine)]:cursor-none">
      <Topbar />
      <Hero />
      <section className="px-4 md:px-12 pb-28">
        <div className="grid gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} index={i} />
          ))}
        </div>
        <div className="mt-24 flex items-center justify-between text-[0.72rem] text-neutral-500" style={sans}>
          <span>© {new Date().getFullYear()} Soutrame</span>
          <Link href="/" className="hover:text-black transition-colors">
            {t('Retour au portfolio', 'Back to portfolio')} →
          </Link>
        </div>
      </section>
      <Density value={cols} onChange={setCols} />
    </main>
  );
}
