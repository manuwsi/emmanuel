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
      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 border-t border-black/15 pt-10"
    >
      <h2 className="md:col-span-4 text-[13px] text-black/45">{title}</h2>
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
    <main className="w-full min-h-screen bg-white text-[#0a0a0a] font-sans overflow-x-hidden relative flex flex-col [scroll-snap-type:none]">
      <Header active="about" />

      <div className="pt-32 md:pt-40 px-6 md:px-10 w-full max-w-6xl mx-auto flex-grow">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8 md:space-y-10"
        >
          <span className="block text-[13px] text-black/45">
            {t('À propos', 'About')}
          </span>
          <h1 className="text-4xl md:text-7xl font-medium tracking-[-0.03em] tracking-tight leading-[1.05] max-w-4xl">
            {t(
              'J’ai commencé par l’image. Aujourd’hui, je conçois des produits.',
              'I started with images. Now I design products.'
            )}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="md:col-start-5 md:col-span-8 space-y-5 text-sm md:text-base text-black/70 leading-relaxed max-w-2xl">
              {t(
                <>
                  <p>
                    Pendant un an chez OKCC, studio créatif pour le luxe et la beauté, j&apos;ai dessiné
                    les écrans d&apos;un coach beauté IA pour Shu Uemura, fait la direction artistique 3D
                    de l&apos;expérience Hennessy X.O à VivaTech (Lovie Award), et monté un process
                    d&apos;images produit générées par IA pour Louis Vuitton.
                  </p>
                  <p>
                    Sur Serena, une app pour les agriculteurs, j&apos;ai fait l&apos;inverse : partir du
                    terrain. Questionnaire, entretiens, deux versions de wireframes avant la moindre UI.
                    C&apos;est là que j&apos;ai su que je voulais faire du produit.
                  </p>
                  <p>
                    À côté, je construis Soutrame, ma marque de vêtements. J&apos;ai dessiné le premier
                    ensemble, suivi la fabrication avec l&apos;usine, organisé le shooting et conçu le site.
                  </p>
                  <p>
                    Je cherche un poste de Product Designer, à Paris ou en remote.
                  </p>
                </>,
                <>
                  <p>
                    For a year at OKCC, a creative studio for luxury and beauty, I designed the screens of
                    an AI beauty coach for Shu Uemura, led the 3D art direction of the Hennessy X.O
                    experience at VivaTech (Lovie Award), and set up an AI product-image process for
                    Louis Vuitton.
                  </p>
                  <p>
                    On Serena, an app for farmers, I worked the other way round: starting from the field.
                    A survey, interviews, two rounds of wireframes before any UI. That is where I knew I
                    wanted to do product.
                  </p>
                  <p>
                    On the side, I am building Soutrame, my clothing label. I designed the first set,
                    followed production with the factory, ran the shoot and designed the site.
                  </p>
                  <p>I am looking for a Product Designer role, in Paris or remote.</p>
                </>
              )}
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="/CV_Emmanuel_Ijjou.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#0a0a0a] bg-[#0a0a0a] text-white px-5 py-3 text-[13px] hover:bg-transparent hover:text-[#0a0a0a] transition-colors duration-300"
                >
                  {t('Télécharger le CV', 'Download CV')}
                </a>
                <a
                  href="https://www.linkedin.com/in/emmanuel-ijjou-00a7a9213/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#0a0a0a] px-5 py-3 text-[13px] hover:bg-[#0a0a0a] hover:text-white transition-colors duration-300"
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:emmanuelijjou@gmail.com"
                  className="border border-[#0a0a0a] px-5 py-3 text-[13px] hover:bg-[#0a0a0a] hover:text-white transition-colors duration-300"
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
                <li key={c} className="text-lg md:text-xl font-medium tracking-[-0.03em] text-black/80">
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          {/* AWARD */}
          <Section title={t('Distinction', 'Award')}>
            <p className="text-lg md:text-2xl font-medium tracking-[-0.03em]">Lovie Award — Best Experience Art Direction</p>
            <p className="mt-2 text-sm text-black/50">
              {t('Hennessy X.O Second Skin, avec OKCC — VivaTech 2025', 'Hennessy X.O Second Skin, with OKCC — VivaTech 2025')}
            </p>
          </Section>

          {/* EXPERIENCE */}
          <Section title={t('Expérience', 'Experience')}>
            <div className="space-y-12">
              {experience.map((e) => (
                <div key={e.where} className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                    <h3 className="text-base md:text-lg">
                      {e.role} <span className="text-black/50">· {e.where}</span>
                    </h3>
                    <span className="text-xs tracking-widest uppercase text-black/45 tabular-nums">{e.date}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-black/70 leading-relaxed">
                    {e.items.map((it) => (
                      <li key={it} className="pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-black/40">
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
            <ul className="space-y-3 text-sm md:text-base text-black/80">
              <li>Master Digital Design <span className="text-black/50">· ESD — École Supérieure du Digital, Paris</span></li>
              <li>Bachelor Création Digitale <span className="text-black/50">· ESD — École Supérieure du Digital, Paris</span></li>
            </ul>
          </Section>

          {/* SKILLS */}
          <Section title={t('Compétences', 'Skills')}>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((s) => (
                <div key={s.k} className="space-y-1">
                  <dt className="text-[13px] text-black/45">{s.k}</dt>
                  <dd className="text-sm text-black/80 leading-relaxed">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* LANGUAGES */}
          <Section title={t('Langues', 'Languages')}>
            <p className="text-sm md:text-base text-black/80">
              {t('Français (natif) · Anglais (bilingue)', 'French (native) · English (fluent)')}
            </p>
          </Section>
        </div>

        <footer className="mt-32 mb-10 text-center text-xs tracking-widest text-black/45">
          © {new Date().getFullYear()} Emmanuel Ijjou
        </footer>
      </div>
    </main>
  );
}
