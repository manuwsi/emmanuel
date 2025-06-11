'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../../styles/globals.css';

export default function ProjectPage() {
  const pathname = usePathname();
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
          <Link href="/" className={pathname === '/' ? 'line-through' : 'hover:underline transition-all duration-300'}>
            [Works]
          </Link>
          <Link href="/about" className={pathname === '/about' ? 'line-through' : 'hover:underline transition-all duration-300'}>
            [About]
          </Link>
          <a
            href="mailto:emmanuelijjou@gmail.com"
            className="hover:underline transition-all duration-300"
          >
            [Contact]
          </a>
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
            Post Archive Faction
          </h1>

          <h2 className="text-base md:text-lg text-gray-400 uppercase tracking-wide">
            Futurist Garment System
          </h2>
          <p className="text-sm md:text-base max-w-2xl text-gray-300 leading-relaxed">
            PAF is an experimental design project exploring hybrid aesthetics, functional layering, and the abstraction of technical garment language. The UI concepts take inspiration from utilitarian grids, modularity, and the future of digital fashion storytelling.
          </p>

          {/* META */}
          <div className="flex flex-wrap gap-6 text-xs md:text-sm uppercase tracking-widest text-gray-500 pt-8">
            <span>2025</span>
            <span>Creative Direction</span>
            <span>Product Design</span>
            <span>Fashion Tech</span>
          </div>
        </motion.div>

        {/* VIDEO 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <video
            src="/FIN 1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full max-w-4xl h-[45vh] md:h-[70vh] object-cover"
          />
        </motion.div>

        {/* IMAGE 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full h-[40vh] md:h-[60vh] max-w-4xl">
            <Image
              src="/PAF2.png"
              alt="PAF Image 2"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </motion.div>

        {/* VIDEO 2 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <video
            src="/PAF4.MP4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full max-w-4xl h-[45vh] md:h-[70vh] object-cover"
          />
        </motion.div>

        {/* IMAGE 2 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full h-[40vh] md:h-[60vh] max-w-4xl">
            <Image
              src="/PAF3.png"
              alt="PAF Image 3"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </motion.div>

        {/* VIDEO 3 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <video
            src="/PAF5.mov"
            autoPlay
            muted
            loop
            playsInline
            className="w-full max-w-4xl h-[45vh] md:h-[70vh] object-contain"
          />
        </motion.div>

        {/* IMAGE 3 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full h-[40vh] md:h-[60vh] max-w-4xl">
            <Image
              src="/PAF1.png"
              alt="Project Image 1"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </motion.div>

        {/* TOOLS SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Tools</h3>
          <p className="text-sm md:text-base text-gray-300">
            Figma — After Effects — MidJourney — Kling
          </p>
        </motion.div>

        {/* NEXT PROJECT BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-32"
        >
          <Link href="/z_lab">
            <div className="group relative cursor-pointer px-6 py-3 border border-neutral-700 w-48 md:w-64 flex items-center justify-center hover:border-transparent transition-all duration-300">
              <span className="relative text-xs font-light uppercase tracking-widest text-neutral-400 group-hover:text-white transition">
                Next Project →
              </span>
              {/* Corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-500 group-hover:border-white transition"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-500 group-hover:border-white transition"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-500 group-hover:border-white transition"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-500 group-hover:border-white transition"></div>
            </div>
          </Link>
        </motion.div>

        {/* FOOTER */}
        <footer className="mt-20 mb-10 text-center text-xs tracking-widest text-neutral-500">
          © {new Date().getFullYear()} Emmanuel
        </footer>
      </div>
    </main>
  );
}
