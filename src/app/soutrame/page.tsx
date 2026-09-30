'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import '@fontsource-variable/instrument-sans';
import { useLang, useT } from '@/components/i18n';

/**
 * Soutrame showroom.
 * A different world from the portfolio on purpose: white, quiet, almost no text.
 * Mood first, information second.
 */

const pieces = [
  { name: { fr: 'Veste', en: 'Jacket' }, views: ['/soutrame/veste-front.jpg', '/soutrame/veste-side.jpg'] },
  { name: { fr: 'Pantalon', en: 'Trousers' }, views: ['/soutrame/pantalon-front.jpg', '/soutrame/pantalon-down.jpg'] },
  { name: { fr: 'Ensemble', en: 'Full set' }, views: ['/soutrame/look-front.jpg', '/soutrame/look-side.jpg'] },
];

const sans = { fontFamily: '"Instrument Sans Variable", "Helvetica Neue", Helvetica, Arial, sans-serif' };

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
          <Chimera className="h-5 w-5" />
        </button>
        <Link
          href="/"
          className="hidden sm:grid h-9 rounded-full bg-neutral-100 px-4 place-items-center text-[0.78rem] text-neutral-900 transition-colors hover:bg-neutral-200"
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

      <span className="justify-self-center text-[0.9rem] md:text-[1.25rem] font-semibold uppercase tracking-[0.18em] text-black pl-[0.18em]">
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

function Card({ index }: { index: number }) {
  const t = useT();
  const [hover, setHover] = useState(false);
  const piece = pieces[index];
  const name = t(piece.name.fr, piece.name.en);
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: index * 0.08 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="min-w-0"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        {piece.views.map((src, v) => (
          <Image
            key={src}
            src={src}
            alt={v === 0 ? `Soutrame — ${name}, drop 01` : ''}
            aria-hidden={v !== 0}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: (hover ? 1 : 0) === v ? 1 : 0 }}
            priority={v === 0}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-4 text-[0.72rem] leading-snug text-neutral-900" style={sans}>
        <p>{name}</p>
        <p className="text-neutral-500">{t('Drop 01 — bientôt', 'Drop 01 — soon')}</p>
      </div>
    </motion.article>
  );
}

export default function Page() {
  const t = useT();
  return (
    <main className="block overflow-x-clip snap-none min-h-screen bg-white text-black [@media(pointer:fine)]:cursor-none">
      <Topbar />
      <section className="px-4 md:px-12 pt-28 md:pt-36 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6">
          {pieces.map((_, i) => (
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
    </main>
  );
}
