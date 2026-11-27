'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DotIn from '../dot/DotIn';
import DotText from '../dot/DotText';
import More from '../dot/More';
import { usePathname } from 'next/navigation';
import NextProject from '../dot/NextProject';
import Header from '../Header';
import { useT } from '../i18n';
import '../../styles/globals.css';

/** The one text size of the case pages (14 px on a phone, 13 px on desktop). */
export const FT = 'text-[14px] leading-[1.6] md:text-[13px]';

type Meta = { year: string; context: string; role: string; tools: string; award?: string };

export function ProjectPage({
  title,
  subtitle,
  meta,
  intro,
  lede,
  hero,
  children,
}: {
  title: string;
  subtitle: string;
  meta: Meta;
  intro: ReactNode;
  /** One plain sentence saying what the project is, shown large under the title (as on Foil). */
  lede?: string;
  /** Optional visual + summary shown right under the title, before the meta block. */
  hero?: ReactNode;
  children: ReactNode;
}) {
  const t = useT();
  const pathname = usePathname();
  const metaRows = [
    { label: t('Année', 'Year'), value: meta.year },
    { label: t('Contexte', 'Context'), value: meta.context },
    { label: t('Rôle', 'Role'), value: meta.role },
    { label: t('Outils', 'Tools'), value: meta.tools },
    ...(meta.award ? [{ label: t('Distinction', 'Award'), value: meta.award }] : []),
  ];

  return (
    <main className="relative block min-h-screen w-full overflow-x-clip bg-white font-sans text-[#0a0a0a] [scroll-snap-type:none]">
      <Header crumb={title} />

      <div className="px-2 pt-24 md:px-3 md:pt-[24vh]">
        <CaseHead title={title} subtitle={subtitle} lede={lede} intro={intro} rows={metaRows.map((m) => [m.label, m.value] as [string, string])} />

        {hero && (
          <div className="fine-flow fine-hero mt-16 md:mt-24">
            {hero}
          </div>
        )}

        {/* THE CASE — notes on the left, pictures in the middle column */}
        <div className="fine-flow mt-4">{children}</div>
      </div>
      <NextProject path={pathname} />
    </main>
  );
}

/** The opening of every case, the same everywhere: title, what it is, the facts. Small, side by side. */
export function CaseHead({ title, kicker, subtitle, lede, intro, rows }: { title: string; kicker?: string; subtitle: string; lede?: ReactNode; intro?: ReactNode; rows: [string, string][] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className={`grid grid-cols-1 gap-x-3 gap-y-8 md:grid-cols-12 ${FT}`}>
      <div className="md:col-span-3">
        <h1 data-intro-target className="font-medium">
          {title}
          {kicker && <span className="text-black/55"> {kicker}</span>}
        </h1>
        <h2 className="text-black/55">{subtitle}</h2>
      </div>
      <div className="space-y-3 md:col-span-4 md:col-start-4 md:pr-6">
        {lede && <p className="font-medium">{lede}</p>}
        {intro && <div className="space-y-3 text-black/70">{intro}</div>}
      </div>
      <dl className="grid grid-cols-2 content-start gap-x-3 gap-y-4 md:col-span-3 md:col-start-9">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-black/55">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}

/** Image or video displayed at its native aspect ratio (no letterboxing, no cropping). */
export function Media({
  src,
  alt,
  width,
  height,
  video = false,
  className = '',
  priority = false,
  crisp = false,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  video?: boolean;
  className?: string;
  priority?: boolean;
  /** Serve the file as is (no recompression): for line drawings and interface screens with fine detail. */
  crisp?: boolean;
  caption?: ReactNode;
}) {
  // a flat desktop screen (16:10 capture) is laid on a light plate, like a print on a table,
  // so every screen of the folio is presented the same way next to the photo mockups
  const screen = !video && /\.webp$/.test(src) && Math.abs(width / height - 1.6) < 0.02;
  return (
    <figure className={`w-full ${className}`}>
      <DotIn className={screen ? 'bg-[#f1f1ef] p-[4%] md:p-[5.5%]' : ''}>
        {video ? (
          <LazyVideo src={src} width={width} height={height} alt={alt} />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            unoptimized={crisp}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`block h-auto w-full ${screen ? 'shadow-[0_22px_44px_-26px_rgba(0,0,0,0.38)] ring-1 ring-black/[0.06]' : ''}`}
          />
        )}
      </DotIn>
      {caption && <figcaption className={`${FT} mt-2 mb-4 text-black/55`}>{caption}</figcaption>}
    </figure>
  );
}

/**
 * Video that only downloads and plays while on screen (pauses when scrolled away),
 * with a poster frame so it never shows as an empty block.
 */
function LazyVideo({ src, width, height, alt }: { src: string; width: number; height: number; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = src;
          el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      poster={`/posters/${src.split('/').pop()!.replace(/\.mp4$/, '.jpg')}`}
      aria-label={alt}
      className="w-full h-auto block"
    />
  );
}

/** Side-by-side row: 2, 3 or 4 columns on desktop. */
export function Row({
  cols = 2,
  mobileCols = 1,
  align = 'start',
  children,
  className = '',
}: {
  cols?: 2 | 3 | 4;
  mobileCols?: 1 | 2;
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
  className?: string;
}) {
  const colClass = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[cols];
  const mobileClass = mobileCols === 2 ? 'grid-cols-2' : 'grid-cols-1';
  const alignClass = { start: 'items-start', center: 'items-center', end: 'items-end' }[align];
  return (
    <div className={`grid ${mobileClass} ${colClass} ${alignClass} gap-2 ${className}`}>
      {children}
    </div>
  );
}

/**
 * A chapter: a note in the left column (sticky beside the first picture that follows), on desktop.
 * With `n` the label reads "01 → Title"; `lede` is the one sentence to remember, in medium weight.
 */
export function Chapter({ title, n, lede, children }: { title: string; n?: number; lede?: string; children?: ReactNode }) {
  const label = n ? `${String(n).padStart(2, '0')} → ${title}` : title;
  return (
    <>
      <div className="fine-gap" aria-hidden />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }} className="fine-note" data-chapter={label}>
        <h3 className="text-black/55">
          <DotText text={label} play="view" />
        </h3>
        {lede && <p className="mt-3 font-medium">{lede}</p>}
        {children && (lede ? <More className="text-black/70">{children}</More> : <div className="mt-3 text-black/70">{children}</div>)}
      </motion.div>
    </>
  );
}

/** The 30-second read: three short statements. */
export function Summary({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className={`grid grid-cols-1 gap-6 border-t border-black/15 pt-3 md:grid-cols-3 md:gap-3 ${FT}`}>
      {items.map((x) => (
        <div key={x.k}>
          <span className="block text-black/55">{x.k}</span>
          <p className="mt-1">{x.v}</p>
        </div>
      ))}
    </div>
  );
}
