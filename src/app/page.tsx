'use client';

import { RefObject, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/globals.css';

const projects = [
  {
    title: 'Post Archive Faction',
    subtitle: '2025 — Creative Direction, Fashion Tech',
    image: '/PAF1.png',
    link: '/post-archive-faction',
  },
  {
    title: 'Hennessy with OKCC',
    subtitle: '2025 — UI Design',
    image: '/hennessy.png',
    link: '/hennessy',
  },
  {
    title: 'Shu Uemura',
    subtitle: '2024 — UI Design, AI Beauty Tutor',
    image: '/shu-flow-01-cover.png',
    link: '/shu-uemura',
  },
  {
    title: 'Serena',
    subtitle: '2024 — Concept, Design & Wireframing',
    image: '/serena-cover.png',
    link: '/serena',
  },
  {
    title: 'Z_Lab',
    subtitle: '2025 — Web Redesign, UI/UX Design',
    image: '/1.png',
    link: '/z_lab',
  },
  {
    title: 'SPECTRE',
    subtitle: '2025 — Editorial Design, AI Art Direction',
    image: '/spectre1.png',
    link: '/spectre',
  },
  {
    title: 'AI Visual Research',
    subtitle: '2025 — Motion Design, AI Art Direction',
    image: '/f1-cover.png',
    link: '/ai-research',
  },
  {
    title: 'Pleated Assortment',
    subtitle: '2024 — Product Visualization, UI/UX Design',
    image: '/pleatedcover.png',
    link: '/pleated',
  },
  {
    title: 'Aether',
    subtitle: '2024 — Design System, Tarot Game',
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
  project: {
    title: string;
    subtitle: string;
    image: string;
    link: string;
  };
  index: number;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
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
          alt={project.title}
          fill
          priority={index < 2}
          sizes="(max-width: 768px) 90vw, 65vw"
          className="object-cover blur-[5px] scale-105 transition-[filter] duration-700 group-hover:blur-[1px]"
        />
      </motion.div>

      {/* The whole card is the link: large, easy hitbox */}
      <Link
        href={project.link}
        aria-label={`Voir le projet ${project.title}`}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-center px-6 md:px-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
      >
        <motion.h2
          className="text-[8vw] md:text-[4vw] leading-[1.1] font-ivy font-light tracking-tight text-white drop-shadow-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {project.title}
        </motion.h2>
        <motion.p
          className="mt-4 md:mt-5 text-[0.65rem] md:text-xs uppercase tracking-widest text-gray-300 font-light"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {project.subtitle}
        </motion.p>
        <motion.span
          className="mt-8 md:mt-10 inline-block border border-white px-7 py-3 md:px-9 md:py-3.5 uppercase text-[0.65rem] md:text-[0.7rem] tracking-widest text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Voir le projet →
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

      {/* Header */}
      <header className="fixed top-0 z-50 w-full px-4 md:px-10 py-4 flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0 text-[0.6rem] md:text-sm uppercase tracking-wider">
        <span className="text-center">Emmanuel — Paris, France</span>
        <nav className="flex space-x-6 md:space-x-8">
          <Link href="#" className="pointer-events-none line-through hover:underline transition-all duration-300 uppercase tracking-wider">[Travaux]</Link>
          <Link href="/about" className="hover:underline transition-all duration-300">[À propos]</Link>
          <a href="mailto:emmanuelijjou@gmail.com" className="hover:underline transition-all duration-300">[Contact]</a>
        </nav>
      </header>

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
