'use client';

/** Shared building blocks for the rewritten case studies (same language as Colosse and Foil). */

import { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NextProject from '@/components/dot/NextProject';
import DotText from '@/components/dot/DotText';
import More from '@/components/dot/More';
import DotIn from '@/components/dot/DotIn';

export const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.03em' } as const;
export const WRAP = 'fine-flow px-2 md:px-3 w-full';
/** The one text size of the case pages (14 px on a phone, 13 px on desktop). */
const FT = 'text-[14px] leading-[1.6] md:text-[13px]';
/** Columns 4 to 10 of the 12-column grid: where pictures sit on desktop. */
const MEDIA = 'md:ml-[calc(25%+3px)] md:w-[calc(50%-6px)]';

export function Title({ title, kicker, subtitle }: { title: string; kicker?: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="fine-full space-y-4">
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
    <p className={`${FT} fine-full max-w-[460px] font-medium md:ml-[calc(25%+3px)] ${className}`}>
      {children}
    </p>
  );
}

export function Meta({ rows, children }: { rows: [string, string][]; children: ReactNode }) {
  return (
    <div className={`${FT} fine-full mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-3 border-t border-black/15 pt-3`}>
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

export function Chap({ n, title, lede, children }: { n: number; title: string; lede?: string; children?: ReactNode }) {
  const label = `${String(n).padStart(2, '0')} → ${title}`;
  return (
    <>
      <div className="fine-gap" aria-hidden />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="fine-note" data-chapter={label}>
        <h3 className="text-black/45">
          <DotText text={label} play="view" />
        </h3>
        {lede && <p className="mt-3 font-medium">{lede}</p>}
        {children && (lede ? <More className="text-black/70">{children}</More> : <div className="mt-3 space-y-3 text-black/70">{children}</div>)}
      </motion.div>
    </>
  );
}

export function Principles({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className={`${FT} grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3`}>
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
        <DotIn className="absolute inset-0">
          <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 50vw" quality={90} className="object-cover" style={{ objectPosition: position }} />
        </DotIn>
      </div>
      {caption && <figcaption className={`${FT} pt-1.5 text-black/45 ${MEDIA}`}>{caption}</figcaption>}
    </figure>
  );
}

export function Next({ path }: { path: string }) {
  return <NextProject path={path} />;
}
