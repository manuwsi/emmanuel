'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';
import { projects, type Project } from '@/components/projects';
import '../styles/globals.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const TXT = 'text-[13px] leading-[1.35]';

/** One project: a full-width image, then a thin caption — like a piece in a collection. */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const t = useT();
  const title = t(project.title.fr, project.title.en);
  return (
    <motion.article initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1.1, ease: EASE }}>
      <Link href={project.link} className="group block" aria-label={t(`Voir le projet ${title}`, `View project ${title}`)}>
        {/* a cover is only shown full-bleed when its resolution allows it; smaller ones sit at their real size on a neutral ground */}
        {project.size[0] >= 1400 ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 md:aspect-auto md:h-[86svh]">
            <Image
              src={project.image}
              alt={title}
              fill
              priority={index < 1}
              sizes="100vw"
              className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025]"
            />
          </div>
        ) : (
          <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#f1f0ed] md:aspect-auto md:h-[86svh]">
            <div
              className="relative transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.02]"
              style={{ height: `min(${project.size[1]}px, 84%)`, maxWidth: `min(${project.size[0]}px, 90%)`, aspectRatio: `${project.size[0]} / ${project.size[1]}` }}
            >
              <Image src={project.image} alt={title} fill priority={index < 1} sizes={`${project.size[0]}px`} className="object-contain" />
            </div>
          </div>
        )}
        <div className="h-[3px] w-full bg-black/10">
          <div className="h-full w-[12%] bg-[#0a0a0a] transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full" />
        </div>
        <div className={`${TXT} grid grid-cols-2 gap-x-4 px-2 pt-1.5 md:grid-cols-4 md:px-3`}>
          <span className="font-medium">{title}</span>
          <span className="text-right text-black/50 md:text-left">{t(project.subtitle.fr, project.subtitle.en)}</span>
          <span className="hidden tabular-nums text-black/50 md:block">{String(index + 1).padStart(2, '0')}</span>
          <span className="col-span-2 group-hover:underline md:col-span-1 md:text-right">{t('Voir le projet', 'View project')} →</span>
        </div>
      </Link>
    </motion.article>
  );
}

function GroupLabel({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <p className={`${TXT} px-2 pb-1.5 pt-24 md:px-3 md:pt-32`}>
      {children} <span className="ml-2 tabular-nums text-black/45">{count}</span>
    </p>
  );
}

export default function Home() {
  const t = useT();
  const product = projects.filter((p) => p.group === 'product').length;
  const explorations = projects.length - product;

  return (
    <main className="!block min-h-screen w-full !overflow-visible bg-white pb-16 text-[#0a0a0a] [scroll-snap-type:none]">
      <Header active="work" />

      {/* statement */}
      <section className="flex min-h-[78svh] flex-col justify-end px-2 pb-6 md:px-3">
        <motion.h1
          className="max-w-[14ch] text-[13vw] font-medium leading-[0.9] tracking-[-0.045em] md:text-[min(6vw,96px)]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {t('Emmanuel Ijjou, Product Designer.', 'Emmanuel Ijjou, Product Designer.')}
        </motion.h1>
        <motion.div
          className={`${TXT} mt-8 grid grid-cols-1 gap-4 md:grid-cols-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p className="md:col-span-2 md:max-w-[480px]">
            {t(
              'Basé à Paris. Je conçois des applications web et mobile, de l’entretien utilisateur à l’écran final : Serena, un assistant administratif pour les agriculteurs, et Shu Uemura AI:tutor, un coach maquillage par IA.',
              'Based in Paris. I design web and mobile apps, from user interviews to the final screen: Serena, an admin assistant for farmers, and Shu Uemura AI:tutor, an AI make-up coach.'
            )}
          </p>
          <p className="text-black/50 md:col-span-1">
            {t('Un an chez OKCC, studio créatif, pour', 'One year at OKCC, creative studio, for')} Hennessy, Shu Uemura, Louis Vuitton, L&apos;Oréal, YSL Beauty, HOKA.
          </p>
          <a href="#work" className="hover:underline md:text-right">
            {t('Voir les projets', 'See the work')} ↓
          </a>
        </motion.div>
      </section>

      <div id="work">
        {projects.map((project, i) => (
          <Fragment key={project.link}>
            {i === 0 && <GroupLabel count={product}>Product design</GroupLabel>}
            {project.group === 'explorations' && projects[i - 1]?.group === 'product' && (
              <GroupLabel count={explorations}>{t('Explorations visuelles — direction artistique, 3D, marque', 'Visual explorations — art direction, 3D, brand')}</GroupLabel>
            )}
            <div className={i > 0 && projects[i - 1]?.group === project.group ? 'mt-16 md:mt-24' : ''}>
              <ProjectRow project={project} index={i} />
            </div>
          </Fragment>
        ))}
      </div>

      <footer className={`${TXT} mt-32 grid grid-cols-2 gap-y-6 px-2 pb-10 md:grid-cols-4 md:px-3`}>
        <div>
          <p>Contact</p>
          <a href="mailto:emmanuelijjou@gmail.com" className="text-black/55 hover:text-black">
            emmanuelijjou@gmail.com
          </a>
        </div>
        <div>
          <p>{t('Disponible', 'Available')}</p>
          <p className="text-black/55">{t('CDI, Paris ou remote', 'Full-time, Paris or remote')}</p>
        </div>
        <div>
          <p>{t('Profil', 'Profile')}</p>
          <Link href="/about" className="text-black/55 hover:text-black">
            {t('À propos', 'About')} →
          </Link>
        </div>
        <p className="text-black/40 md:text-right">© {new Date().getFullYear()} Emmanuel Ijjou</p>
      </footer>
    </main>
  );
}
