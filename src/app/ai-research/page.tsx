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

  const pieces = [
    {
      type: 'video',
      src: '/f1-aesthetic.mp4',
      title: 'F1 Aesthetic',
      caption: 'Une monoplace vue à travers un prisme thermique et radiographique, entre transparence et chaleur pure.',
    },
    {
      type: 'video',
      src: '/ai-underwater.mp4',
      title: 'Liquid Figure',
      caption: 'Une silhouette prise dans une matière liquide, quelque part entre le métal et l’eau.',
    },
    {
      type: 'video',
      src: '/ai-crowd-yellow.mp4',
      title: 'Crowd Study — Yellow',
      caption: 'Une foule figée dans un aplat de couleur, à mi-chemin entre la peinture et le glitch.',
    },
    {
      type: 'video',
      src: '/ai-crowd-negative.mp4',
      title: 'Crowd Study — Negative',
      caption: 'La même idée de foule, inversée, presque spectrale.',
    },
    {
      type: 'video',
      src: '/ai-double-exposure.mp4',
      title: 'Double Exposure',
      caption: 'Un portrait fondu dans le tissu urbain d’une ville la nuit.',
    },
    {
      type: 'image',
      src: '/ai-red-figure.png',
      title: 'Material Study',
      caption: 'Une étude de matière : laque rouge, courbes et lumière.',
    },
  ];

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
            AI Visual Research
          </h1>

          <h2 className="text-base md:text-lg text-gray-400 uppercase tracking-wide">
            Exploration visuelle, IA &amp; 3D
          </h2>

          <div className="max-w-2xl space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
            <p>
              Un espace de recherche personnelle où je teste ce que l&apos;IA et la 3D peuvent
              apporter à l&apos;image au-delà du réalisme : matière, couleur, distorsion,
              composition. Chaque pièce part d&apos;une question simple, comment représenter
              autrement la chaleur, la foule, la matière, le mouvement.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs md:text-sm uppercase tracking-widest text-gray-500 pt-8">
            <span>2025</span>
            <span>Motion Design</span>
            <span>AI Art Direction</span>
          </div>
        </motion.div>

        {/* PIECES */}
        {pieces.map((piece, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            viewport={{ once: true }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-full flex justify-center">
              {piece.type === 'video' ? (
                <video
                  src={piece.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full max-w-4xl h-[35vh] md:h-[60vh] object-cover"
                />
              ) : (
                <div className="relative w-full max-w-2xl h-[45vh] md:h-[65vh]">
                  <Image
                    src={piece.src}
                    alt={piece.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <div className="text-center max-w-md space-y-1">
              <h3 className="text-xs uppercase tracking-widest text-neutral-400">{piece.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{piece.caption}</p>
            </div>
          </motion.div>
        ))}

        {/* TOOLS SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Outils</h3>
          <p className="text-sm md:text-base text-gray-300">
            Midjourney — Runway — Kling — Reve — Blender — After Effects
          </p>
        </motion.div>

        {/* NEXT PROJECT BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mt-32"
        >
          <Link href="/">
            <div className="group relative cursor-pointer px-6 py-3 border border-neutral-700 w-48 md:w-64 flex items-center justify-center hover:border-transparent transition-all duration-300">
              <span className="relative text-xs font-light uppercase tracking-widest text-neutral-400 group-hover:text-white transition">
                Projet suivant →
              </span>
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
