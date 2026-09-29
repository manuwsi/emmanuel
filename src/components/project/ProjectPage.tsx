'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nextProject } from '../projects';
import Header from '../Header';
import { useT } from '../i18n';
import '../../styles/globals.css';

type Meta = { year: string; context: string; role: string; tools: string; award?: string };

export function ProjectPage({
  title,
  subtitle,
  meta,
  intro,
  children,
}: {
  title: string;
  subtitle: string;
  meta: Meta;
  intro: ReactNode;
  children: ReactNode;
}) {
  const t = useT();
  const pathname = usePathname();
  const np = nextProject(pathname);
  const next = { href: np.link, title: t(np.title.fr, np.title.en) };
  const metaRows = [
    { label: t('Année', 'Year'), value: meta.year },
    { label: t('Contexte', 'Context'), value: meta.context },
    { label: t('Rôle', 'Role'), value: meta.role },
    { label: t('Outils', 'Tools'), value: meta.tools },
    ...(meta.award ? [{ label: t('Distinction', 'Award'), value: meta.award }] : []),
  ];

  return (
    <main className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden relative flex flex-col">
      <Header />

      <div className="pt-32 md:pt-40 px-6 md:px-10 w-full max-w-6xl mx-auto flex-grow">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-8xl font-ivy font-light tracking-tight text-white">
            {title}
          </h1>
          <h2 className="text-sm md:text-base text-gray-400 uppercase tracking-widest">
            {subtitle}
          </h2>
        </motion.div>

        {/* META + INTRO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 border-t border-neutral-800 pt-10"
        >
          <dl className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-6 content-start">
            {metaRows.map((m) => (
              <div key={m.label} className="space-y-1">
                <dt className="text-[0.65rem] uppercase tracking-widest text-neutral-400">{m.label}</dt>
                <dd className="text-sm text-gray-200">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="md:col-span-8 space-y-6 text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
            {intro}
          </div>
        </motion.div>

        {/* GALLERY */}
        <div className="mt-20 md:mt-28 space-y-6 md:space-y-10">{children}</div>

        {/* NEXT PROJECT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-40 border-t border-neutral-800 pt-12 flex flex-col items-center gap-6"
        >
          <span className="text-[0.65rem] uppercase tracking-widest text-neutral-400">{t('Projet suivant', 'Next project')}</span>
          <Link href={next.href} className="group">
            <span className="text-3xl md:text-5xl font-ivy font-light tracking-tight text-neutral-300 group-hover:text-white transition">
              {next.title} →
            </span>
          </Link>
        </motion.div>

        <footer className="mt-24 mb-10 text-center text-xs tracking-widest text-neutral-400">
          © {new Date().getFullYear()} Emmanuel
        </footer>
      </div>
    </main>
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
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  video?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
      className={`w-full ${className}`}
    >
      {video ? (
        <LazyVideo src={src} width={width} height={height} alt={alt} />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 1152px"
          className="w-full h-auto block"
        />
      )}
    </motion.div>
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
    <div className={`grid ${mobileClass} ${colClass} ${alignClass} gap-4 md:gap-8 ${className}`}>
      {children}
    </div>
  );
}

/** Text interlude between visuals. */
export function Chapter({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="pt-20 pb-6 md:pt-28 md:pb-10 grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      <h3 className="md:col-span-4 text-[0.65rem] md:text-xs uppercase tracking-widest text-neutral-400">
        {title}
      </h3>
      {children && (
        <div className="md:col-span-8 text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl space-y-4">
          {children}
        </div>
      )}
    </motion.div>
  );
}
