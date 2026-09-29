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

  const desktopImages = [
    { src: '/serena-dashboard.png', alt: 'Serena — Dashboard' },
    { src: '/serena-tasks.png', alt: 'Serena — Gestion des tâches' },
    { src: '/serena-documents.png', alt: 'Serena — Documents' },
    { src: '/serena-doc-viewer.png', alt: 'Serena — Lecture de document' },
  ];
  const mobileImages = [
    { src: '/serena-mobile-chat.png', alt: 'Serena — Assistant mobile' },
    { src: '/serena-mobile-scan.png', alt: 'Serena — Scan de document' },
    { src: '/serena-mobile-tasks.png', alt: 'Serena — Tâches mobile' },
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
            Serena
          </h1>

          <h2 className="text-base md:text-lg text-gray-400 uppercase tracking-wide">
            Un assistant IA pour l&apos;administratif agricole — Projet école
          </h2>

          <div className="max-w-2xl space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
            <p>
              1,5 suicides par jour en France dans le secteur agricole. Les agriculteurs
              passent aujourd&apos;hui jusqu&apos;à 1h par jour, et une journée entière de leur
              week-end, à gérer des tâches administratives, une charge mentale qui
              s&apos;ajoute à un métier déjà exigeant.
            </p>
            <p>
              Serena répond à ce constat avec un assistant pensé pour prendre en charge
              l&apos;ensemble de ces démarches : automatisé, disponible, transparent sur
              l&apos;usage des données, et personnalisé selon les besoins de chaque
              exploitation.
            </p>
            <p>
              Le projet a été mené en équipe. Des interviews terrain avec des agriculteurs ont
              nourri la compréhension du besoin réel, aux côtés d&apos;une analyse de marché
              (140 000 clients ISAGRI, 51,6% du territoire national occupé par
              l&apos;activité agricole). J&apos;ai porté le concept produit et le design, du
              wireframing des premières pistes jusqu&apos;aux maquettes finales, desktop et
              mobile.
            </p>
            <p>
              L&apos;assistant IA est pensé comme un fil conducteur plutôt qu&apos;un simple
              chatbot : suggestions d&apos;actions contextuelles sur le tableau de bord,
              gestion des tâches priorisées, bibliothèque de documents classés
              automatiquement, et scan de document depuis le mobile pour alimenter
              l&apos;assistant directement depuis le terrain.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs md:text-sm uppercase tracking-widest text-gray-500 pt-8">
            <span>ESD</span>
            <span>Concept</span>
            <span>Wireframing</span>
            <span>UI Design</span>
          </div>
        </motion.div>

        {/* DESKTOP SCREENS */}
        {desktopImages.map((img, index) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full h-[35vh] md:h-[55vh] max-w-4xl">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}

        {/* MOBILE SCREENS */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          {mobileImages.map((img) => (
            <div key={img.src} className="relative w-[45%] md:w-[22%] h-[45vh]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* IDENTITE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <h3 className="text-sm uppercase tracking-widest text-neutral-500">Identité</h3>

          <div className="flex justify-center">
            <div className="relative w-40 h-14 md:w-48 md:h-16">
              <Image src="/serena-logo.png" alt="Logo Serena" fill className="object-contain" />
            </div>
          </div>

          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Au-delà de l&apos;interface, Serena porte une identité pensée pour rassurer plutôt
            qu&apos;imposer : un vert profond et un jaune chaleureux, loin du vocabulaire froid
            des logiciels de gestion habituels du secteur.
          </p>

          <div className="flex justify-center gap-4 md:gap-6">
            {[
              { hex: '#0d3b2a', label: 'Vert profond' },
              { hex: '#629784', label: 'Vert sauge' },
              { hex: '#f0d94a', label: 'Jaune' },
              { hex: '#e6f9d4', label: 'Vert clair' },
            ].map((c) => (
              <div key={c.hex} className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-neutral-700"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[0.6rem] md:text-xs uppercase tracking-widest text-neutral-500">
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          <blockquote className="border-l border-neutral-700 pl-6 text-left mx-auto max-w-md text-sm md:text-base italic text-gray-300">
            « Serena s&apos;exprime avec calme, clarté et bienveillance. »
          </blockquote>
        </motion.div>

        {/* LE MODELE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-4"
        >
          <h3 className="text-sm uppercase tracking-widest text-neutral-500">Le modèle</h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Le projet allait jusqu&apos;à une stratégie de croissance complète (abonnements et
            success fees, grille tarifaire de 89€/mois à 699€/an) et des projections
            budgétaires sur plusieurs années, structurées en phases de déploiement. Présenté
            devant un jury en fin de cursus.
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
            Figma — Prototypage
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
          <Link href="/z_lab">
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
