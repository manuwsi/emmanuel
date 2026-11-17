'use client';

/** Shared pieces for the Foil case: the woven image reveal, the fixed chrome, the drag strip. */

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useLang, useT } from '@/components/i18n';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const TXT = 'text-[13px] leading-[1.35] tracking-[0.005em]';
export const WORDMARK = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.045em' } as const;
export const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.03em' } as const;

export function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const u = () => setPhone(mq.matches);
    u();
    mq.addEventListener('change', u);
    return () => mq.removeEventListener('change', u);
  }, []);
  return phone;
}

/** Image revealed by a single smooth mask, with a slow settle . */
export function Weave({ src, alt, priority = false, sizes, delay = 0, force = false, position = 'center' }: { src: string; alt: string; priority?: boolean; sizes: string; delay?: number; force?: boolean; position?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const seen = useInView(host, { once: true, margin: '0px 0px -12% 0px' });
  const go = force || seen;
  return (
    <div ref={host} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: go ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        transition={{ duration: 1.3, ease: EASE, delay }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: go ? 1 : 1.08 }}
          transition={{ duration: 1.8, ease: EASE, delay }}
        >
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 1, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Edge-to-edge render with a thin caption underneath. */
export function Plate({ src, alt, caption, aspect, mobileAspect = '4/5', mobileSrc, priority = false, dark = true }: { src: string; alt: string; caption?: string; aspect: string; mobileAspect?: string; mobileSrc?: string; priority?: boolean; dark?: boolean }) {
  const phone = usePhone();
  return (
    <figure>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: phone ? mobileAspect : aspect, background: dark ? '#0b0c0e' : '#e2e1de' }}>
        <Weave src={phone && mobileSrc ? mobileSrc : src} alt={alt} sizes="100vw" priority={priority} force={priority} />
      </div>
      {caption && <figcaption className={`${TXT} px-2 pt-1.5 text-black/55 md:px-3`}>{caption}</figcaption>}
    </figure>
  );
}

/** Fixed chrome: breadcrumb, language, wordmark, index. */
export function Chrome({ chapters }: { chapters: { id: string; label: string }[] }) {
  const t = useT();
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [close]);
  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
  };
  return (
    <>
      <div className={`${TXT} fixed left-0 top-0 z-40 px-2 py-1.5 text-white mix-blend-difference md:px-3`}>
        <Link href="/" className="hover:underline">Emmanuel Ijjou</Link> → Foil
      </div>
      <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className={`${TXT} fixed right-0 top-0 z-40 px-2 py-1.5 text-white mix-blend-difference hover:underline md:px-3`} aria-label={t('Switch to English', 'Passer en français')}>
        {lang === 'fr' ? 'EN' : 'FR'}
      </button>
      <a href="#top" className="fixed bottom-0 left-0 z-40 flex items-end gap-2 px-2 pb-1 text-white mix-blend-difference md:px-3" aria-label="Foil">
        <span className="block text-[22px] uppercase leading-none md:text-[26px]" style={WORDMARK}>Foil</span>
        <span className="mb-[3px] grid grid-cols-3 gap-[2px]" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="block h-[3px] w-[3px] rounded-full bg-white" style={{ opacity: [0, 4, 8].includes(i) ? 1 : 0.35 }} />
          ))}
        </span>
      </a>
      <div className={`${TXT} fixed bottom-0 right-0 z-40 px-2 pb-1.5 text-white mix-blend-difference md:px-3`}>
        <button onClick={() => setOpen(true)} className="hover:underline">Index</button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[420px] flex-col bg-white p-3 text-[#0a0a0a]"
              initial={{ clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              exit={{ clipPath: 'inset(0 0 0 100%)' }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <button onClick={close} className={`${TXT} self-end hover:underline`}>{t('Fermer', 'Close')}</button>
              <nav className="mt-14 flex flex-col gap-1">
                {chapters.map((c, i) => (
                  <button key={c.id} onClick={() => go(c.id)} className="flex items-baseline gap-3 text-left text-[30px] leading-[1.1] transition hover:opacity-50" style={DISPLAY}>
                    <span className={`${TXT} w-5 tabular-nums text-black/40`}>{String(i + 1).padStart(2, '0')}</span>
                    {c.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/** A thin-ruled editorial row: number, title, text. */
export function Row({ n, title, text, dark = false }: { n: string; title: string; text: string; dark?: boolean }) {
  return (
    <Reveal>
      <div className={`grid grid-cols-12 gap-x-3 border-t py-5 md:py-7 ${dark ? 'border-white/20' : 'border-black/20'}`}>
        <span className={`${TXT} col-span-2 tabular-nums md:col-span-1 ${dark ? 'text-white/45' : 'text-black/40'}`}>{n}</span>
        <h3 className="col-span-10 text-[26px] leading-[1.05] md:col-span-5 md:text-[40px]" style={DISPLAY}>{title}</h3>
        <p className={`col-span-10 col-start-3 mt-3 max-w-[460px] text-[15px] leading-[1.45] md:col-span-4 md:col-start-8 md:mt-1 ${dark ? 'text-white/60' : 'text-black/60'}`}>{text}</p>
      </div>
    </Reveal>
  );
}

/** Edge-to-edge strip of phone screens: drag, scroll, or use the numbers. */
export function Strip({ items, label, hint }: { items: { src: string; name: string; group: string }[]; label: string; hint: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [progress, setProgress] = useState(0);
  const drag = useRef<{ x: number; left: number } | null>(null);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      const first = el.firstElementChild as HTMLElement | null;
      const step = first ? first.offsetWidth + 4 : 1;
      setAt(Math.min(items.length - 1, Math.round(el.scrollLeft / step)));
    };
    on();
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [items.length]);
  const goTo = (i: number) => {
    const el = track.current;
    const c = el?.children[i] as HTMLElement | undefined;
    if (el && c) el.scrollTo({ left: c.offsetLeft, behavior: 'smooth' });
  };
  return (
    <div>
      <p className={`${TXT} px-2 pb-2 md:px-3`}>
        {label} <span className="ml-2 text-black/45">{hint} →</span>
      </p>
      <div
        ref={track}
        onPointerDown={(e) => { if (e.pointerType === 'mouse' && track.current) drag.current = { x: e.clientX, left: track.current.scrollLeft }; }}
        onPointerMove={(e) => { const d = drag.current; if (d && track.current) track.current.scrollLeft = d.left - (e.clientX - d.x); }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        className="flex cursor-grab select-none gap-1 overflow-x-auto active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((s) => (
          <div key={s.src} className="relative flex aspect-[4/5] w-[78vw] shrink-0 items-center justify-center bg-[#0b0c0e] md:aspect-auto md:h-[82svh] md:w-[calc(82svh*0.8)]">
            <div className="relative h-[86%] aspect-[780/1688]">
              <Image src={s.src} alt={s.name} fill sizes="(min-width:768px) 40vw, 70vw" className="rounded-[4%] object-cover" draggable={false} />
            </div>
          </div>
        ))}
      </div>
      <div className="relative h-[3px] w-full bg-black/10">
        <div className="absolute inset-y-0 left-0 bg-[#0a0a0a] transition-[width] duration-200" style={{ width: `${8 + progress * 92}%` }} />
      </div>
      <div className={`${TXT} flex items-start justify-between gap-4 px-2 pt-1.5 md:px-3`}>
        <AnimatePresence mode="wait">
          <motion.span key={at} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {items[at].group ? `${items[at].group} → ` : ''}{items[at].name}
          </motion.span>
        </AnimatePresence>
        <div className="hidden gap-2 tabular-nums md:flex">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={i === at ? 'text-black' : 'text-black/30 hover:text-black/70'} aria-label={`${i + 1}`}>{i}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
