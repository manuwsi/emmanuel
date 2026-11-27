'use client';

/** Shared building blocks for the rewritten case studies (same language as Colosse and Foil). */

import { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NextProject from '@/components/dot/NextProject';
import DotText from '@/components/dot/DotText';

export const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.03em' } as const;
export const WRAP = 'px-2 md:px-3 w-full';
/** The one text size of the case pages (14 px on a phone, 13 px on desktop). */
const FT = 'text-[14px] leading-[1.6] md:text-[13px]';
/** Columns 4 to 10 of the 12-column grid: where pictures sit on desktop. */
const MEDIA = 'md:ml-[calc(25%+3px)] md:w-[calc(58.333%-5px)]';

export function Title({ title, kicker, subtitle }: { title: string; kicker?: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="space-y-4">
      <h1 data-intro-target className={`${FT} font-medium`}>
        {title}
        {kicker && <span className="text-black/45"> {kicker}</span>}
      </h1>
      <h2 className={`${FT} !mt-0 text-black/45`}>{subtitle}</h2>
    </motion.div>
  );
}

export function Lede({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`${FT} max-w-[460px] font-medium md:ml-[calc(25%+3px)] ${className}`}>
      {children}
    </p>
  );
}

export function Meta({ rows, children }: { rows: [string, string][]; children: ReactNode }) {
  return (
    <div className={`${FT} mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-3 border-t border-black/15 pt-3`}>
      <dl className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-4 content-start">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-black/45">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="md:col-span-4 md:col-start-4 space-y-3 text-black/70 md:pr-6">{children}</div>
    </div>
  );
}

export function Chap({ n, title, aside, lede, children }: { n: number; title: string; aside?: string; lede?: string; children?: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-80px' }}
      className={`${FT} pt-24 pb-6 md:pt-36 md:pb-8`}
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-4 border-t border-black/15 pt-2">
        <h3 className="text-black/45">
          <DotText text={`${String(n).padStart(2, '0')} → ${title}`} play="view" />
        </h3>
        {aside && <span className="tabular-nums text-black/45">{aside}</span>}
      </div>
      {(lede || children) && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 md:gap-x-3">
          <div className="md:col-span-4 md:col-start-4 md:pr-6 space-y-3">
            {lede && <p className="font-medium">{lede}</p>}
            {children && <div className="space-y-3 text-black/70">{children}</div>}
          </div>
        </div>
      )}
    </motion.section>
  );
}

export function Principles({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className={`${FT} grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 ${MEDIA}`}>
      {items.map((p, i) => (
        <div key={p.k} className="border-t border-black/15 pt-2">
          <div className="text-black/45">0{i + 1}</div>
          <div className="mt-1 font-medium">{p.k}</div>
          <p className="mt-1 text-black/70">{p.v}</p>
        </div>
      ))}
    </div>
  );
}

/** Edge-to-edge picture, slow reveal, thin caption. */
export function Bleed({ src, alt, aspect, mobileAspect, caption, position = 'center', priority = false, bg = '#f2f1ee' }: { src: string; alt: string; aspect: string; mobileAspect?: string; caption?: string; position?: string; priority?: boolean; bg?: string }) {
  return (
    <figure className="w-full px-2 md:px-3">
      <div className={`relative w-full overflow-hidden [aspect-ratio:var(--am)] md:[aspect-ratio:var(--ad)] ${MEDIA}`} style={{ ['--ad' as string]: aspect, ['--am' as string]: mobileAspect ?? aspect, background: bg }}>
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
          <Image src={src} alt={alt} fill priority={priority} sizes="100vw" quality={90} className="object-cover" style={{ objectPosition: position }} />
        </motion.div>
      </div>
      {caption && <figcaption className={`${FT} pt-1.5 text-black/45 ${MEDIA}`}>{caption}</figcaption>}
    </figure>
  );
}

export function Next({ path }: { path: string }) {
  return <NextProject path={path} />;
}
