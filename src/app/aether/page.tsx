'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// import { usePathname } from 'next/navigation'; ❌ inutilisé
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
          transition={{ duration: 0.5 }}
          className="space-y-6 text-left"
        >
          <h1 className="text-4xl md:text-6xl font-ivy font-light tracking-tight text-white drop-shadow-md">
            Aether
          </h1>

          <h2 className="text-base md:text-lg text-gray-400 uppercase tracking-wide">
            Design system pour un jeu de tarot — Projet d&apos;équipe
          </h2>
          <div className="max-w-2xl space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
            <p>
              Aether est un jeu de tarot complet imaginé à quatre. Le défi n&apos;était pas
              seulement de dessiner 22 cartes, mais de construire un design system capable de
              les générer toutes de façon cohérente : une colorimétrie, des textures, des
              ornements et un traitement du texte pensés comme des briques assemblées à
              chaque carte, IA et retouche manuelle à l&apos;appui pour garder la qualité et
              l&apos;originalité de chaque rendu.
            </p>
            <p>
              Autour de ce système, nous avons construit un lore entier : les âmes des défunts
              traversent le royaume d&apos;Aether entre mort et purgatoire, chaque arcane
              majeure incarnant une étape de ce voyage initiatique. Nous sommes même allés
              jusqu&apos;à inventer un alphabet de treize caractères propre à cet univers. J&apos;ai
              contribué à l&apos;ensemble du projet, de la construction de l&apos;univers à la
              direction visuelle des cartes.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs md:text-sm uppercase tracking-widest text-gray-500 pt-8">
            <span>2024</span>
            <span>Design System</span>
            <span>Art Direction</span>
            <span>Worldbuilding</span>
          </div>
        </motion.div>

        {/* IMAGES */}
        {["aether-design-system.png", "AETHER1.png", "AETHER2.png", "aether-cards-grid.png", "AETHER3.jpg", "AETHER4.jpg", "aether-alphabet.png", "AETHER5.png", "AETHER6.jpg"].map((filename, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-4xl">
              <Image
                src={`/${filename}`}
                alt={`Aether Image ${index + 1}`}
                layout="responsive"
                width={1920}
                height={1080}
                objectFit="contain"
              />
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
            Figma — Photoshop — Midjourney
          </p>
        </motion.div>

        {/* NEXT PROJECT BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mt-32"
        >
          <Link href="/post-archive-faction">
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

          {/* FOOTER */}
          <footer className="mt-20 mb-10 text-center text-xs tracking-widest text-neutral-500">
            © {new Date().getFullYear()} Emmanuel
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
