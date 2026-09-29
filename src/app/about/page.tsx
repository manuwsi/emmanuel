'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';

export default function AboutPage() {
  const t = useT();
  return (
    <main className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden relative flex flex-col">
      <Header active="about" />

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-10 pt-32">
        <div className="max-w-4xl w-full space-y-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-ivy font-light tracking-tight text-white drop-shadow-md"
          >
            {t('À propos', 'About')}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-gray-400 uppercase text-sm tracking-widest"
          >
            Product Designer • Paris
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8 text-left mx-auto max-w-3xl text-sm md:text-base leading-relaxed text-gray-300"
          >
            {t(
              <>
                <p>
                  Designer spécialisé en UI et Product Design, j&apos;ai développé une approche
                  exigeante et contemporaine du design numérique. Formé en studio au sein
                  d&apos;OKCC, j&apos;ai collaboré sur des projets variés mêlant design
                  d&apos;interfaces, direction artistique et branding.
                </p>
                <p>
                  Curieux et rigoureux, je cherche à concevoir des expériences esthétiques,
                  fonctionnelles et adaptées aux nouveaux usages digitaux. Sensible aux secteurs du
                  luxe, de la tech et de la mode, je reste ouvert à tous les univers où design et
                  innovation se rencontrent. Actuellement basé à Paris, je suis disponible pour
                  collaborer sur des projets exigeants et ambitieux.
                </p>
              </>,
              <>
                <p>
                  A designer specialised in UI and product design, I have built a demanding,
                  contemporary approach to digital design. Trained in-studio at OKCC, I worked on a
                  wide range of projects combining interface design, art direction and branding.
                </p>
                <p>
                  Curious and rigorous, I aim to design experiences that are beautiful, functional
                  and suited to new digital habits. Drawn to luxury, tech and fashion, I remain open
                  to any field where design and innovation meet. Currently based in Paris, I am
                  available for demanding and ambitious projects.
                </p>
              </>
            )}
          </motion.div>

          {/* LINKS */}
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
              className="border border-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              LinkedIn
            </a>
            <a
              href="mailto:emmanuelijjou@gmail.com"
              className="border border-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              {t('E-mail', 'Email')}
            </a>
          </motion.div>
        </div>
      </div>

      <footer className="mt-16 text-center text-xs tracking-widest text-neutral-400 mb-10">
        © {new Date().getFullYear()} Emmanuel
      </footer>
    </main>
  );
}
