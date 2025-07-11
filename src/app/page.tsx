'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Lenis from '@studio-freight/lenis';
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
}: {
  project: {
    title: string;
    subtitle: string;
    image: string;
    link: string;
  };
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);

  return (
    <motion.section
      ref={ref}
      className="relative w-[70vw] md:w-[56vw] h-[45vh] md:h-[72vh] flex-shrink-0 group overflow-hidden shadow-2xl transform-gpu"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute w-full h-full top-0 left-0"
        style={{ y: imageY }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover w-full h-full blur-[1.5px]"
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/25 backdrop-blur-sm text-center">
        <motion.h2
          className="text-[5vw] md:text-[4vw] font-ivy font-light tracking-tight text-white drop-shadow-md"
          style={{ y: textY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {project.title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link
            href={project.link}
            className="mt-4 border border-white px-4 py-2 md:px-6 md:py-2 uppercase text-[0.6rem] md:text-[0.65rem] tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            Open Project →
          </Link>
        </motion.div>
        <motion.p
          className="text-[0.6rem] md:text-xs mt-4 text-gray-300 font-light"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {project.subtitle}
        </motion.p>
      </div>
    </motion.section>
  );
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.07 });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <main className="w-screen h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans cursor-none">
      {/* Background Noise */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full z-[-1] opacity-10"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundSize: '300% 300%',
          backgroundRepeat: 'repeat',
          filter: 'blur(1px)',
        }}
      />

      {/* Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 z-[998] bg-white rounded-full pointer-events-none mix-blend-difference"
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      />

      {/* Header */}
      <header className="fixed top-0 z-50 w-full px-4 md:px-10 py-4 flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0 text-[0.6rem] md:text-sm uppercase tracking-wider">
        <span className="text-center">Emmanuel — Paris, France</span>
        <nav className="flex space-x-6 md:space-x-8">
          <Link href="#" className="pointer-events-none line-through hover:underline transition-all duration-300 uppercase tracking-wider">[Works]</Link>
          <Link href="/about" className="hover:underline transition-all duration-300">[About]</Link>
          <a href="mailto:emmanuelijjou@gmail.com" className="hover:underline transition-all duration-300">[Contact]</a>
        </nav>
      </header>

      {/* Projects */}
      <div
        ref={scrollRef}
        className="h-full w-full flex overflow-x-scroll overflow-y-hidden items-center gap-[10vw] px-[8vw] md:px-[12vw]"
      >
        {projects.map((project, i) => (
          <ProjectSection key={i} project={project} />
        ))}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-[0.6rem] md:text-xs tracking-widest text-neutral-500">
        © {new Date().getFullYear()} Emmanuel
      </footer>
    </main>
  );
}
