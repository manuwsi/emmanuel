'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';

const clients = [
  'Hennessy',
  'Louis Vuitton',
  'Shu Uemura',
  'L’Oréal Professionnel',
  'YSL Beauty',
  'Garnier',
  'HOKA',
  'L’Oréal x Roblox',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 border-t border-neutral-800 pt-10"
    >
      <h2 className="md:col-span-4 text-[0.65rem] md:text-xs uppercase tracking-widest text-neutral-400">{title}</h2>
      <div className="md:col-span-8">{children}</div>
    </motion.section>
  );
}

export default function AboutPage() {
  const t = useT();

  const experience = [
    {
      role: 'Digital Designer',
      where: t('Freelance', 'Freelance'),
      date: t('Depuis nov. 2025', 'Since Nov. 2025'),
      items: [
        t(
          'Mission OKCC × L’Oréal Professionnel (2 semaines) : conception et production de vidéos animées générées par IA.',
          'OKCC × L’Oréal Professionnel mission (2 weeks): designed and produced AI-generated animated videos.'
        ),
      ],
    },
    {
      role: 'Digital Designer',
      where: t('OKCC — alternance', 'OKCC — work-study'),
      date: t('Oct. 2024 — sept. 2025', 'Oct. 2024 — Sept. 2025'),
      items: [
        t(
          'UI et maquettes d’une application IA de personnalisation beauté pour Shu Uemura, itérées avec le client.',
          'UI and screens for an AI beauty personalisation app for Shu Uemura, iterated with the client.'
        ),
        t(
          'Direction artistique et assets 3D de l’expérience Hennessy X.O à VivaTech — Lovie Award, Best Experience Art Direction.',
          'Art direction and 3D assets for the Hennessy X.O experience at VivaTech — Lovie Award, Best Experience Art Direction.'
        ),
        t('Conception d’une expérience interactive en point de vente pour HOKA.', 'Designed an interactive in-store experience for HOKA.'),
        t(
          'Mise en place d’un process de génération IA (Nano Banana) pour produire des shootings produit aux spécifications précises — Louis Vuitton.',
          'Built an AI generation process (Nano Banana) to produce product shoots to precise specifications — Louis Vuitton.'
        ),
        t(
          'Production 3D et direction créative sur d’autres projets : Louis Vuitton, L’Oréal x Roblox, YSL Beauty, Garnier.',
          '3D production and creative direction on further projects: Louis Vuitton, L’Oréal x Roblox, YSL Beauty, Garnier.'
        ),
      ],
    },
  ];

  const skills = [
    { k: 'Design', v: t('Figma, wireframing, prototypage interactif, design d’interface, design system', 'Figma, wireframing, interactive prototyping, interface design, design systems') },
    { k: t('Méthodologie', 'Methodology'), v: t('Méthode agile, collaboration avec les équipes de développement', 'Agile, working closely with development teams') },
    { k: '3D', v: 'Blender' },
    { k: t('IA générative', 'Generative AI'), v: 'Midjourney, Runway, Kling, Reve, Nano Banana' },
  ];

  return (
    <main className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden relative flex flex-col">
      <Header active="about" />

      <div className="pt-32 md:pt-40 px-6 md:px-10 w-full max-w-6xl mx-auto flex-grow">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8 md:space-y-10"
        >
          <span className="block text-[0.7rem] uppercase tracking-widest text-neutral-400">
            {t('À propos', 'About')}
          </span>
          <h1 className="text-4xl md:text-7xl font-ivy font-light tracking-tight leading-[1.05] max-w-4xl">
            {t(
              'Product Designer à Paris, entre interface, direction artistique et IA.',
              'Product Designer in Paris, between interface, art direction and AI.'
            )}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="md:col-start-5 md:col-span-8 space-y-5 text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
              {t(
                <>
                  <p>
                    Je conçois des interfaces et des expériences digitales, de la compréhension du
                    besoin jusqu&apos;aux maquettes finales. J&apos;ai passé un an chez OKCC, studio
                    créatif au service du luxe et de la beauté, sur des projets pour Shu Uemura,
                    Hennessy, Louis Vuitton ou L&apos;Oréal.
                  </p>
                  <p>
                    Ma particularité : je maîtrise l&apos;IA générative comme un outil de production
                    à part entière, pour prototyper, tester des directions visuelles et produire des
                    images au niveau d&apos;exigence des marques de luxe.
                  </p>
                </>,
                <>
                  <p>
                    I design interfaces and digital experiences, from understanding the need to the
                    final screens. I spent a year at OKCC, a creative studio working for luxury and
                    beauty brands, on projects for Shu Uemura, Hennessy, Louis Vuitton and L&apos;Oréal.
                  </p>
                  <p>
                    What sets me apart: I use generative AI as a real production tool, to prototype,
                    explore visual directions and produce imagery that meets luxury brands&apos;
                    standards.
                  </p>
                </>
              )}
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="/CV_Emmanuel_Ijjou.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white bg-white text-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors duration-300"
                >
                  {t('Télécharger le CV', 'Download CV')}
                </a>
                <a
                  href="https://www.linkedin.com/in/emmanuel-ijjou-00a7a9213/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:emmanuelijjou@gmail.com"
                  className="border border-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                >
                  {t('E-mail', 'Email')}
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-24 md:mt-32 space-y-16 md:space-y-20">
          {/* CLIENTS */}
          <Section title={t('Clients', 'Clients')}>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
              {clients.map((c) => (
                <li key={c} className="text-lg md:text-xl font-ivy font-light text-gray-200">
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          {/* AWARD */}
          <Section title={t('Distinction', 'Award')}>
            <p className="text-lg md:text-2xl font-ivy font-light text-white">Lovie Award — Best Experience Art Direction</p>
            <p className="mt-2 text-sm text-gray-400">
              {t('Hennessy X.O Second Skin, avec OKCC — VivaTech 2025', 'Hennessy X.O Second Skin, with OKCC — VivaTech 2025')}
            </p>
          </Section>

          {/* EXPERIENCE */}
          <Section title={t('Expérience', 'Experience')}>
            <div className="space-y-12">
              {experience.map((e) => (
                <div key={e.where} className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                    <h3 className="text-base md:text-lg text-white">
                      {e.role} <span className="text-gray-400">· {e.where}</span>
                    </h3>
                    <span className="text-xs tracking-widest uppercase text-neutral-400 tabular-nums">{e.date}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300 leading-relaxed">
                    {e.items.map((it) => (
                      <li key={it} className="pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-neutral-500">
                        <span className="pl-2 block">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* EDUCATION */}
          <Section title={t('Formation', 'Education')}>
            <ul className="space-y-3 text-sm md:text-base text-gray-200">
              <li>Master Digital Design <span className="text-gray-400">· ESD — École Supérieure du Digital, Paris</span></li>
              <li>Bachelor Création Digitale <span className="text-gray-400">· ESD — École Supérieure du Digital, Paris</span></li>
            </ul>
          </Section>

          {/* SKILLS */}
          <Section title={t('Compétences', 'Skills')}>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((s) => (
                <div key={s.k} className="space-y-1">
                  <dt className="text-[0.65rem] uppercase tracking-widest text-neutral-400">{s.k}</dt>
                  <dd className="text-sm text-gray-200 leading-relaxed">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* LANGUAGES */}
          <Section title={t('Langues', 'Languages')}>
            <p className="text-sm md:text-base text-gray-200">
              {t('Français (natif) · Anglais (bilingue)', 'French (native) · English (fluent)')}
            </p>
          </Section>
        </div>

        <footer className="mt-32 mb-10 text-center text-xs tracking-widest text-neutral-400">
          © {new Date().getFullYear()} Emmanuel Ijjou
        </footer>
      </div>
    </main>
  );
}
