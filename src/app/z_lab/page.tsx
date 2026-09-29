'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/globals.css';

export default function ProjectPage() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <main className="w-screen min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative flex flex-col">
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 z-[998] bg-white rounded-full pointer-events-none mix-blend-difference"
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      />

      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full px-4 md:px-10 py-4 flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0 text-[0.6rem] md:text-sm uppercase tracking-wider">
        <span className="text-center">Emmanuel — Paris, France</span>
        <nav className="flex space-x-6 md:space-x-8">
          <Link href="/" className="hover:underline transition-all duration-300">[Travaux]</Link>
          <Link href="/about" className="hover:underline transition-all duration-300">[À propos]</Link>
          <a href="mailto:emmanuelijjou@gmail.com" className="hover:underline transition-all duration-300">[Contact]</a>
        </nav>
      </header>

      {/* CONTENT */}
      <div className="pt-32 px-6 md:px-10 max-w-6xl mx-auto flex-grow space-y-24">
        {/* TITLE & INFO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6 text-left"
        >
          <h1 className="text-4xl md:text-6xl font-ivy font-light tracking-tight text-white drop-shadow-md">
            Z_Lab
          </h1>

          <h2 className="text-base md:text-lg text-gray-400 uppercase tracking-wide">
            Refonte de site — Studio d&apos;architecture, projet école
          </h2>
          <div className="max-w-2xl space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
            <p>
              Z_Lab est un studio d&apos;architecture coréen connu pour ses espaces minimaux et
              sophistiqués. En étudiant leurs réalisations, une chose revenait sans cesse : la
              ligne, présente aussi bien dans leur architecture que dans leur identité
              visuelle. C&apos;est devenu le fil conducteur du projet.
            </p>
            <p>
              J&apos;ai commencé par un audit de leur site existant pour identifier ce qui
              desservait leur image, avant de construire un ensemble cohérent qui reflète
              vraiment leur professionnalisme et leur parti pris artistique.
            </p>
          </div>

          {/* META */}
          <div className="flex flex-wrap gap-6 text-xs md:text-sm uppercase tracking-widest text-gray-500 pt-8">
            <span>2025</span>
            <span>Creative Direction</span>
            <span>UI/UX Design</span>
            <span>Web Redesign</span>
          </div>
        </motion.div>

        {/* IMAGES */}
        {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full h-[40vh] md:h-[60vh] max-w-4xl">
              <Image
                src={`/${num}.png`}
                alt={`Z_Lab Image ${num}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </motion.div>
        ))}

        {/* TOOLS SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Outils</h3>
          <p className="text-sm md:text-base text-gray-300">
            Figma — Protopie
          </p>
        </motion.div>

        {/* NEXT PROJECT BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mt-32"
        >
          <Link href="/spectre">
            <div className="group relative cursor-pointer px-6 py-3 border border-neutral-700 w-48 md:w-64 flex items-center justify-center hover:border-transparent transition-all duration-300">
              <span className="relative text-xs font-light uppercase tracking-widest text-neutral-400 group-hover:text-white transition">
                Projet suivant →
              </span>
              {/* Corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-500 group-hover:border-white transition"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-500 group-hover:border-white transition"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-500 group-hover:border-white transition"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-500 group-hover:border-white transition"></div>
            </div>
          </Link>

          {/* FOOTER */}
          <footer className="mt-20 mb-10 text-center text-xs tracking-widest text-neutral-500">
            © {new Date().getFullYear()} Emmanuel
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
