'use client';

/**
 * Case format v2 — read the big picture first, then the detail.
 * One grid (12 columns, 12 px gutters, the same as the home page), two type sizes:
 * DISPLAY for one sentence per section, TEXT for everything else (labels only differ by opacity).
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/Header';
import NextProject from '@/components/dot/NextProject';
import DotText from '@/components/dot/DotText';
import { Media } from '@/components/project/ProjectPage';
import '@/styles/globals.css';

export const TEXT = 'text-[15px] leading-[1.6]';
export const DISPLAY = 'text-[30px] leading-[1.06] tracking-[-0.035em] md:text-[clamp(34px,3.5vw,58px)] md:leading-[1.04]';
export const DISPLAY_STYLE = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500 } as const;
export const PAD = 'px-2 md:px-3';
export const GRID = 'grid grid-cols-1 gap-x-3 md:grid-cols-12';

const fade = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.9 } };

export function CaseShell({ crumb, path, children }: { crumb: string; path: string; children: ReactNode }) {
  return (
    <main className="relative block min-h-screen w-full overflow-x-clip bg-white text-[#0a0a0a] [scroll-snap-type:none]">
      <Header crumb={crumb} />
      {children}
      <NextProject path={path} />
    </main>
  );
}

/** The label of a section: "01 → Title", decoded in dots once when it comes on screen. */
export function Label({ children, n }: { children: string; n?: number }) {
  const text = n !== undefined ? `${String(n).padStart(2, '0')} → ${children}` : children;
  return (
    <p className={`${TEXT} text-black/45`}>
      <DotText text={text} play="view" />
    </p>
  );
}

/** A section opener: label on the left, one large sentence, then the text in the reading column. */
export function Section({ n, label, lede, children, id, className = '' }: { n?: number; label: string; lede?: ReactNode; children?: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`${PAD} scroll-mt-10 pt-32 md:pt-48 ${className}`}>
      <motion.div {...fade} className={`${GRID} border-t border-black/15 pt-3`}>
        <div className="md:col-span-3">
          <Label n={n}>{label}</Label>
        </div>
        {lede && (
          <h2 className={`${DISPLAY} mt-6 md:col-span-9 md:mt-0 md:max-w-[22ch]`} style={DISPLAY_STYLE}>
            {lede}
          </h2>
        )}
      </motion.div>
      {children && <div className="mt-12 md:mt-16">{children}</div>}
    </section>
  );
}

/** Body copy in the reading column (columns 4 to 9). */
export function Body({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${GRID} ${className}`}>
      <div className={`${TEXT} space-y-4 md:col-span-6 md:col-start-4 max-w-[640px]`}>{children}</div>
    </div>
  );
}

/** The step back: four short statements side by side. */
export function Recul({ items }: { items: { k: string; v: ReactNode }[] }) {
  return (
    <motion.div {...fade} className={`${GRID} gap-y-8`}>
      {items.map((x, i) => (
        <div key={x.k} className={`md:col-span-3 ${i === 0 ? '' : ''}`}>
          <p className={`${TEXT} text-black/45`}>{x.k}</p>
          <p className={`${TEXT} mt-2`}>{x.v}</p>
        </div>
      ))}
    </motion.div>
  );
}

/** Year, context, role, tools: one quiet line. */
export function Facts({ items }: { items: [string, string][] }) {
  return (
    <div className={`${GRID} gap-y-5 border-t border-black/15 pt-3`}>
      {items.map(([k, v]) => (
        <div key={k} className="md:col-span-3">
          <p className={`${TEXT} text-black/45`}>{k}</p>
          <p className={TEXT}>{v}</p>
        </div>
      ))}
    </div>
  );
}

/** Media on the grid: full width, or a run of 2 or 3 equal columns, always 12 px apart. */
export function Plates({ cols = 1, children, className = '' }: { cols?: 1 | 2 | 3; children: ReactNode; className?: string }) {
  const c = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' }[cols];
  return <div className={`${PAD} grid grid-cols-1 gap-3 ${c} ${className}`}>{children}</div>;
}

export function Plate({ src, alt, w, h, video = false, crisp = false, caption, priority = false, aspect, position = 'center' }: { src: string; alt: string; w: number; h: number; video?: boolean; crisp?: boolean; caption?: string; priority?: boolean; aspect?: string; position?: string }) {
  return (
    <figure>
      {aspect && !video ? (
        <motion.div {...fade} className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
          <Image src={src} alt={alt} fill unoptimized={crisp} priority={priority} sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
        </motion.div>
      ) : (
        <Media src={src} alt={alt} width={w} height={h} video={video} crisp={crisp} priority={priority} />
      )}
      {caption && <figcaption className={`${TEXT} mt-2 text-black/45`}>{caption}</figcaption>}
    </figure>
  );
}
