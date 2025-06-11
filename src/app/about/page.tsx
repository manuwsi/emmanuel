'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
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
      <header className="fixed top-0 z-50 w-full px-6 md:px-10 py-6 flex justify-between text-xs md:text-sm uppercase tracking-wider">
        <div>
          <span>Emmanuel</span> — <span>Paris, France</span>
        </div>
        <nav className="space-x-6 md:space-x-8">
          <Link href="/">[Works]</Link>
          <span className="line-through">[About]</span>
          <a href="mailto:emmanuelijjou@gmail.com">[Contact]</a>
        </nav>
      </header>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-10 pt-32">
        <div className="max-w-4xl w-full space-y-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-semibold"
          >
            About Me
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-gray-400 uppercase text-sm tracking-widest"
          >
            Designer Digital • Paris
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8 text-left mx-auto max-w-3xl text-sm md:text-base leading-relaxed text-gray-300"
          >
            <p>
              Designer spécialisé en UI et Product Design, j&apos;ai développé une approche exigeante et contemporaine du design numérique. Formé en studio au sein d&apos;OKCC, j&apos;ai collaboré sur des projets variés mêlant design d&apos;interfaces, direction artistique et branding.
            </p>
            <p>
              Curieux et rigoureux, je cherche à concevoir des expériences esthétiques, fonctionnelles et adaptées aux nouveaux usages digitaux. Sensible aux secteurs du luxe, de la tech et de la mode, je reste ouvert à tous les univers où design et innovation se rencontrent. Actuellement basé à Paris, je suis disponible pour collaborer sur des projets exigeants et ambitieux.
            </p>
          </motion.div>

          {/* LINKS TO SOCIALS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 flex justify-center space-x-6"
          >
            <a
              href="https://www.linkedin.com/in/emmanuel-ijjou-00a7a9213/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              LinkedIn
            </a>
            <a
              href="mailto:emmanuelijjou@gmail.com"
              className="border border-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Mail
            </a>
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-xs tracking-widest text-neutral-500 mb-10">
        © {new Date().getFullYear()} Emmanuel
      </footer>
    </main>
  );
}
