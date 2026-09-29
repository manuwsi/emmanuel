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

  const images = ['/shuuemura1.png', '/shuuemura2.png', '/shuuemura3.png'];

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
            Shu Uemura AI Tutor
          </h1>

          <h2 className="text-base md:text-lg text-gray-400 uppercase tracking-wide">
            UI Design for a personalized beauty assistant
          </h2>

          <div className="max-w-2xl space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
            <p>
              Shu Uemura voulait un assistant capable de guider ses clientes dans le choix et
              l&apos;application de leurs produits, comme un coach beauté personnel accessible
              depuis mobile.
            </p>
            <p>
              J&apos;ai conçu les maquettes de bout en bout, en échange direct avec le client
              sur trois itérations. Chacune a affiné un point précis : mieux mettre en avant
              le savoir-faire de la marque, rendre la personnalisation réellement fidèle au
              visage de chaque cliente, et jusqu&apos;au choix des décors, avec des mannequins
              IA posés devant du béton façon Tokyo pour ancrer l&apos;univers visuel.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs md:text-sm uppercase tracking-widest text-gray-500 pt-8">
            <span>2024</span>
            <span>UI Design</span>
            <span>OKCC</span>
          </div>
        </motion.div>

        {/* PARCOURS */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl"
        >
          {[
            { n: '01', t: 'Sélection du tutor', d: 'La cliente choisit son coach virtuel parmi Yoko, Ren ou Haruto, chacun avec sa propre identité.' },
            { n: '02', t: 'Chat conversationnel', d: 'Un échange guidé pour cerner les besoins et attentes de la cliente.' },
            { n: '03', t: 'Analyse faciale', d: 'Reconnaissance des traits du visage avec repères visuels pas-à-pas, pour une application réellement adaptée.' },
            { n: '04', t: 'Prise de rendez-vous', d: 'Passage naturel de l’app vers une expérience en point de vente.' },
          ].map((step) => (
            <div key={step.n} className="space-y-2">
              <span className="text-xs text-neutral-600 tracking-widest">{step.n}</span>
              <h3 className="text-sm uppercase tracking-wide text-white">{step.t}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{step.d}</p>
            </div>
          ))}
        </motion.div>

        {/* IMAGES */}
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full h-[30vh] md:h-[50vh] max-w-4xl">
              <Image
                src={src}
                alt={`Shu Uemura Image ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}

        {/* TEMPS FORT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-4"
        >
          <h3 className="text-sm uppercase tracking-widest text-neutral-500">Un temps fort</h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            En complément des maquettes, j&apos;ai produit une vidéo générée par IA pour
            présenter le concept directement au CEO de Shu Uemura, avant même le
            développement. Le concept a été très bien reçu, et le projet livré.
          </p>
        </motion.div>

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
            Figma — Runway — Kling
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
          <Link href="/serena">
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
