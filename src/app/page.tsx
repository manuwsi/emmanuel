'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';
import { projects, type Project } from '@/components/projects';
import { MarkFor } from '@/components/ProjectMark';
import '../styles/globals.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const TXT = 'text-[13px] leading-[1.35]';

/** One project: a card in a regular grid — every cover in the same 4:3 frame, then a thin caption. */
function ProjectCard({ project, index, small = false }: { project: Project; index: number; small?: boolean }) {
  const t = useT();
  const title = t(project.title.fr, project.title.en);
  return (
    <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 1, ease: EASE, delay: (index % (small ? 3 : 2)) * 0.08 }}>
      <Link href={project.link} className="group block" aria-label={t(`Voir le projet ${title}`, `View project ${title}`)}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <Image
            src={project.image}
            alt={title}
            fill
            priority={index < 2}
            sizes={small ? '(min-width:768px) 33vw, 100vw' : '(min-width:768px) 50vw, 100vw'}
            quality={90}
            className="object-cover"
          />
        </div>
        <div className="h-[2px] w-full bg-black/10">
          <div className="h-full w-0 bg-[#0a0a0a] transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full" />
        </div>
        <div className={`${TXT} flex items-start justify-between gap-4 px-2 pt-1.5 md:px-0`}>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-black/50">{t(project.subtitle.fr, project.subtitle.en)}</p>
          </div>
          <span className="flex shrink-0 items-center gap-2.5 tabular-nums text-black/55 transition-colors group-hover:text-black">
            <MarkFor link={project.link} />
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function GroupLabel({ children, count, first = false }: { children: React.ReactNode; count: number; first?: boolean }) {
  return (
    <p className={`${TXT} px-2 pb-1.5 md:px-0 ${first ? 'pt-6' : 'pt-24 md:pt-32'}`}>
      {children} <span className="ml-2 tabular-nums text-black/45">{count}</span>
    </p>
  );
}

export default function Home() {
  const t = useT();
  const featured = projects.filter((p) => p.group === 'featured');
  const more = projects.filter((p) => p.group === 'more');
  const explorations = projects.filter((p) => p.group === 'explorations');

  const contactCard = (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 1, ease: EASE, delay: 0.16 }}>
      <a href="mailto:emmanuelijjou@gmail.com" className="group block">
        <div className="relative flex aspect-[4/3] w-full flex-col justify-between bg-[#0a0a0a] p-5 text-white md:p-6">
          <p className={TXT + ' text-white/55'}>{t('Disponible — CDI, Paris ou remote', 'Available — full-time, Paris or remote')}</p>
          <p className="text-[9vw] font-medium leading-[0.95] tracking-[-0.04em] md:text-[2.4vw]">
            {t('Un poste, un projet ?', 'A role, a project?')}
            <br />
            <span className="text-white/55 transition-colors duration-500 group-hover:text-white">{t('Écrivez-moi', 'Write to me')} →</span>
          </p>
        </div>
        <div className="h-[2px] w-full bg-black/10">
          <div className="h-full w-0 bg-[#0a0a0a] transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full" />
        </div>
        <div className={`${TXT} flex items-start justify-between gap-4 px-2 pt-1.5 md:px-0`}>
          <div>
            <p className="font-medium">Contact</p>
            <p className="text-black/50">emmanuelijjou@gmail.com</p>
          </div>
        </div>
      </a>
    </motion.div>
  );

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
          {t('Product Designer à Paris.', 'Product Designer in Paris.')}
        </motion.h1>
        <motion.div
          className={`${TXT} mt-8 grid grid-cols-1 gap-4 md:grid-cols-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p className="md:col-span-2 md:max-w-[480px]">
            {t(
              'Je conçois des produits où l’interface doit tenir sous la contrainte : le cockpit d’un tunnelier, un agent IA qui agit pour vous, une montre qu’on lit en courant.',
              'I design products whose interface has to hold up under pressure: the cockpit of a tunnel boring machine, an AI agent that acts for you, a watch you read while running.'
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

      <div id="work" className="px-0 md:px-3">
        <GroupLabel first count={featured.length}>
          {t('Sélection', 'Selected work')}
        </GroupLabel>
        <div className="grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-2 md:gap-y-16">
          {featured.map((project, i) => (
            <ProjectCard key={project.link} project={project} index={i} />
          ))}
        </div>

        <GroupLabel count={more.length}>{t('Autres projets — clients OKCC et concepts', 'More work — OKCC clients and concepts')}</GroupLabel>
        <div className="grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-y-14">
          {more.map((project, i) => (
            <ProjectCard key={project.link} project={project} index={featured.length + i} small />
          ))}
          {more.length % 3 !== 0 && contactCard}
        </div>

        <GroupLabel count={explorations.length}>{t('Explorations visuelles — direction artistique, 3D, marque', 'Visual explorations — art direction, 3D, brand')}</GroupLabel>
        <div className="grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-y-14">
          {explorations.map((project, i) => (
            <ProjectCard key={project.link} project={project} index={featured.length + more.length + i} small />
          ))}
        </div>
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
