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
      <header className="fixed top-0 z-50 w-full px-4 md:px-10 py-4 flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0 text-[0.6rem] md:text-sm uppercase tracking-wider">
        <span className="text-center">Emmanuel — Paris, France</span>
        <nav className="flex space-x-6 md:space-x-8">
          <Link href="/" className="hover:underline transition-all duration-300">[Works]</Link>
          <Link href="/about" className="hover:underline transition-all duration-300">[About]</Link>
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
            Pleated Assortment
          </h1>

          <h2 className="text-base md:text-lg text-gray-400 uppercase tracking-wide">
            Furniture Collection Inspired by Issey Miyake
          </h2>
          <p className="text-sm md:text-base max-w-2xl text-gray-300 leading-relaxed">
            Pleated Assortment is a 2024 experimental project where a furniture collection was generated based on the garment design philosophy of Issey Miyake. It served as a playground to explore UI concepts for a modern e-commerce experience.
          </p>

          {/* META */}
          <div className="flex flex-wrap gap-6 text-xs md:text-sm uppercase tracking-widest text-gray-500 pt-8">
            <span>2024</span>
            <span>Creative Direction</span>
            <span>UI/UX Design</span>
            <span>Product Visualization</span>
          </div>
        </motion.div>

        {/* IMAGES */}
        {['pleated1.png', 'pleated2.png', 'pleated3.png'].map((src, index) => (
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
                src={`/${src}`}
                alt={`Pleated Assortment ${index + 1}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </motion.div>
        ))}

        {/* VIDEO */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <video
            src="/pleatedvid.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full max-w-4xl h-[45vh] md:h-[70vh] object-contain"
          />
        </motion.div>

        {/* TOOLS SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Tools</h3>
          <p className="text-sm md:text-base text-gray-300">
            Figma — DALL·E
          </p>
        </motion.div>

        {/* NEXT PROJECT BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mt-32"
        >
          <Link href="/aether">
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

          {/* FOOTER */}
          <footer className="mt-20 mb-10 text-center text-xs tracking-widest text-neutral-500">
            © {new Date().getFullYear()} Emmanuel
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
