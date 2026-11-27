'use client';

/** Shared building blocks for the rewritten case studies (same language as Colosse and Foil). */

import { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NextProject from '@/components/dot/NextProject';
import DotText from '@/components/dot/DotText';

export const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.03em' } as const;
export const WRAP = 'px-2 md:px-3 w-full max-w-[1400px] mx-auto';

export function Title({ title, kicker, subtitle }: { title: string; kicker?: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="space-y-4">
      <h1 className="text-[16vw] md:text-[9.5vw] font-medium leading-[0.84] tracking-[-0.055em]">
        {title}
        {kicker && <span className="block text-black/30">{kicker}</span>}
      </h1>
      <h2 className="text-[13px] leading-[1.35] text-black/50">{subtitle}</h2>
    </motion.div>
  );
}

export function Lede({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[1050px] text-[30px] md:text-[60px] leading-[1.02] ${className}`} style={DISPLAY}>
      {children}
    </p>
  );
}

export function Meta({ rows, children }: { rows: [string, string][]; children: ReactNode }) {
  return (
    <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 border-t border-black/15 pt-6">
      <dl className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-6 content-start">
        {rows.map(([k, v]) => (
          <div key={k} className="space-y-1">
            <dt className="text-[13px] text-black/45">{k}</dt>
            <dd className="text-[13px] leading-[1.35]">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="md:col-span-8 space-y-5 text-[15px] md:text-[17px] leading-[1.55] max-w-2xl">{children}</div>
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
      className="pt-28 pb-8 md:pt-40 md:pb-12"
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-4 border-t border-black/15 pt-3">
        <h3 className="text-[13px] leading-[1.35] text-black/45">
          <DotText text={`${String(n).padStart(2, '0')} → ${title}`} play="view" />
        </h3>
        {aside && <span className="text-[13px] tabular-nums">{aside}</span>}
      </div>
      {lede && (
        <p className="mt-8 md:mt-12 max-w-[980px] text-[28px] md:text-[52px] leading-[1.04]" style={DISPLAY}>
          {lede}
        </p>
      )}
      {children && (
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-start-5 md:col-span-8 text-[15px] md:text-[17px] leading-[1.55] max-w-2xl space-y-4">{children}</div>
        </div>
      )}
    </motion.section>
  );
}

export function Principles({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {items.map((p, i) => (
        <div key={p.k} className="border-t-[3px] border-[#0a0a0a] pt-3">
          <div className="text-[13px] text-black/45">0{i + 1}</div>
          <div className="mt-2 text-[22px] leading-[1.1]" style={DISPLAY}>{p.k}</div>
          <p className="mt-3 text-[15px] leading-[1.5] text-black/75">{p.v}</p>
        </div>
      ))}
    </div>
  );
}

/** Edge-to-edge picture, slow reveal, thin caption. */
export function Bleed({ src, alt, aspect, mobileAspect, caption, position = 'center', priority = false, bg = '#f2f1ee' }: { src: string; alt: string; aspect: string; mobileAspect?: string; caption?: string; position?: string; priority?: boolean; bg?: string }) {
  return (
    <figure className="w-full">
      <div className="relative w-full overflow-hidden [aspect-ratio:var(--am)] md:[aspect-ratio:var(--ad)]" style={{ ['--ad' as string]: aspect, ['--am' as string]: mobileAspect ?? aspect, background: bg }}>
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
          <Image src={src} alt={alt} fill priority={priority} sizes="100vw" quality={90} className="object-cover" style={{ objectPosition: position }} />
        </motion.div>
      </div>
      {caption && <figcaption className="px-2 md:px-3 pt-2 text-[13px] text-black/50">{caption}</figcaption>}
    </figure>
  );
}

export function Next({ path }: { path: string }) {
  return <NextProject path={path} />;
}
