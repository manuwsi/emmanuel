'use client';

import { RefObject, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';
import '../styles/globals.css';

type Project = {
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  image: string;
  link: string;
};

const same = (s: string) => ({ fr: s, en: s });

const projects: Project[] = [
  {
    title: same('Post Archive Faction'),
    subtitle: { fr: '2025 — Direction créative, mode & tech', en: '2025 — Creative direction, fashion tech' },
    image: '/PAF1.png',
    link: '/post-archive-faction',
  },
  {
    title: { fr: 'Hennessy avec OKCC', en: 'Hennessy with OKCC' },
    subtitle: { fr: '2025 — UI Design, 3D', en: '2025 — UI design, 3D' },
    image: '/hennessy.png',
    link: '/hennessy',
  },
  {
    title: same('Shu Uemura'),
    subtitle: { fr: '2024 — UI Design, coach beauté IA', en: '2024 — UI design, AI beauty tutor' },
    image: '/shu-flow-01-cover.png',
    link: '/shu-uemura',
  },
  {
    title: same('Serena'),
    subtitle: { fr: '2024 — Concept, wireframes & UI', en: '2024 — Concept, wireframes & UI' },
    image: '/serena-cover.png',
    link: '/serena',
  },
  {
    title: same('Z_Lab'),
    subtitle: { fr: '2025 — Refonte de site, UI/UX', en: '2025 — Website redesign, UI/UX' },
    image: '/1.png',
    link: '/z_lab',
  },
  {
    title: same('SPECTRE'),
    subtitle: { fr: '2025 — Design éditorial, direction artistique IA', en: '2025 — Editorial design, AI art direction' },
    image: '/spectre1.png',
    link: '/spectre',
  },
  {
    title: { fr: 'Recherche visuelle IA', en: 'AI Visual Research' },
    subtitle: { fr: '2025 — Motion, direction artistique IA', en: '2025 — Motion, AI art direction' },
    image: '/f1-cover.png',
    link: '/ai-research',
  },
  {
    title: same('Pleated Assortment'),
    subtitle: { fr: '2024 — Direction créative, UI/UX', en: '2024 — Creative direction, UI/UX' },
    image: '/pleatedcover.png',
    link: '/pleated',
  },
  {
    title: same('Aether'),
    subtitle: { fr: '2024 — Design system, jeu de tarot', en: '2024 — Design system, tarot deck' },
    image: '/AETHERCOVER.png',
    link: '/aether',
  },
];

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
          className="object-cover blur-[5px] scale-105 transition-[filter] duration-700 group-hover:blur-[1px]"
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

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {projects.map((project, i) => (
          <div key={project.link} className="snap-center flex-shrink-0">
            <ProjectSection project={project} index={i} containerRef={scrollRef} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-[0.6rem] md:text-xs tracking-widest text-neutral-500">
        © {new Date().getFullYear()} Emmanuel
      </footer>
    </main>
  );
}
