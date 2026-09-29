'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';
import { projects, type Project } from '@/components/projects';
import '../styles/globals.css';

// Composant enfant qui gère les hooks proprement
function ProjectSection({
  project,
  index,
  containerRef,
}: {
  project: Project;
  index: number;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const t = useT();
  const title = t(project.title.fr, project.title.en);
  const ref = useRef<HTMLElement>(null);
  // Horizontal parallax, driven by the horizontal scroller (not the window)
  const { scrollXProgress } = useScroll({
    container: containerRef,
    target: ref,
    axis: 'x',
    offset: ['start end', 'end start'],
  });
  const imageX = useTransform(scrollXProgress, [0, 1], ['-6%', '6%']);

  return (
    <motion.section
      ref={ref}
      className="relative w-[78vw] md:w-[56vw] h-[52vh] md:h-[72vh] flex-shrink-0 group overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, root: containerRef }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute inset-y-0 -inset-x-[8%] will-change-transform"
        style={{ x: imageX }}
      >
        <Image
          src={project.image}
          alt={title}
          fill
          priority={index < 2}
          sizes="(max-width: 768px) 90vw, 65vw"
          className={`object-cover scale-105 transition-[filter] duration-700 ${project.softCover ? 'blur-[12px] group-hover:blur-[8px]' : 'blur-[5px] group-hover:blur-[1px]'}`}
        />
      </motion.div>

      {/* The whole card is the link: large, easy hitbox */}
      <Link
        href={project.link}
        aria-label={t(`Voir le projet ${title}`, `View project ${title}`)}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-center px-6 md:px-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
      >
        <motion.h2
          className="text-[8vw] md:text-[4vw] leading-[1.1] font-ivy font-light tracking-tight text-white drop-shadow-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mt-4 md:mt-5 text-[0.65rem] md:text-xs uppercase tracking-widest text-gray-300 font-light"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {t(project.subtitle.fr, project.subtitle.en)}
        </motion.p>
        <motion.span
          className="mt-8 md:mt-10 inline-block border border-white px-7 py-3 md:px-9 md:py-3.5 uppercase text-[0.65rem] md:text-[0.7rem] tracking-widest text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {t('Voir le projet →', 'View project →')}
        </motion.span>
      </Link>
    </motion.section>
  );
}

function Intro() {
  const t = useT();
  return (
    <motion.section
      className="w-[78vw] md:w-[38vw] flex-shrink-0 flex flex-col justify-center gap-6 md:gap-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
    >
      <span className="text-[0.7rem] uppercase tracking-widest text-neutral-400">Emmanuel Ijjou</span>
      <h1 className="text-[11vw] md:text-[4.6vw] leading-[1.02] font-ivy font-light tracking-tight">
        {t('Product Designer à Paris.', 'Product Designer in Paris.')}
      </h1>
      <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-md">
        {t(
          'Je conçois des interfaces et des expériences digitales pour le luxe, la beauté et la tech, de la recherche utilisateur à l’UI, avec l’IA comme outil de création.',
          'I design interfaces and digital experiences for luxury, beauty and tech, from user research to UI, with AI as a creative tool.'
        )}
      </p>
      <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
        {t('Formé chez OKCC pour', 'Trained at OKCC for')} Hennessy, Shu Uemura, Louis Vuitton, L&apos;Oréal, Dior, YSL Beauty.
      </p>
      <span className="text-[0.7rem] uppercase tracking-widest text-white flex items-center gap-3">
        <span className="hidden md:inline">{t('Faites défiler', 'Scroll')}</span>
        <span className="md:hidden">{t('Glissez', 'Swipe')}</span>
        <motion.span
          aria-hidden
          animate={{ x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          →
        </motion.span>
      </span>
    </motion.section>
  );
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const { scrollXProgress } = useScroll({ container: scrollRef, axis: 'x' });

  // Track which project is centred (state changes only when the index changes)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = container.getBoundingClientRect().left + container.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Smooth horizontal scrolling with the mouse wheel (desktop).
  // Touch devices keep native horizontal swipe.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let target = container.scrollLeft;
    let raf = 0;

    const tick = () => {
      const current = container.scrollLeft;
      const next = current + (target - current) * 0.12;
      if (Math.abs(target - next) < 0.5) {
        container.scrollLeft = target;
        raf = 0;
        return;
      }
      container.scrollLeft = next;
      raf = requestAnimationFrame(tick);
    };

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      if (!raf) target = container.scrollLeft;
      const max = container.scrollWidth - container.clientWidth;
      target = Math.max(0, Math.min(max, target + delta));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="w-screen h-[100svh] bg-[#0a0a0a] text-white overflow-hidden font-sans [@media(pointer:fine)]:cursor-none">
      <Header active="work" />
      {/* Projects */}
      <div
        ref={scrollRef}
        className="h-full w-full flex overflow-x-auto overflow-y-hidden items-center gap-[8vw] md:gap-[10vw] px-[11vw] md:px-[12vw] snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain"
      >
        <div className="snap-center flex-shrink-0">
          <Intro />
        </div>
        {projects.map((project, i) => (
          <div
            key={project.link}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="snap-center flex-shrink-0"
          >
            <ProjectSection project={project} index={i} containerRef={scrollRef} />
          </div>
        ))}
      </div>

      {/* Bottom bar: counter, progress, copyright */}
      <div className="absolute bottom-0 inset-x-0 px-4 md:px-10 pb-4 md:pb-5 pointer-events-none">
        <div className="h-px w-full bg-neutral-800 mb-3 overflow-hidden">
          <motion.div className="h-full bg-white origin-left" style={{ scaleX: scrollXProgress }} />
        </div>
        <div className="flex justify-between items-center text-[0.65rem] md:text-xs tracking-widest text-neutral-400">
          <span className="tabular-nums">
            <span className="text-white">{String(active + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}
          </span>
          <span>© {new Date().getFullYear()} Emmanuel Ijjou</span>
        </div>
      </div>
    </main>
  );
}
