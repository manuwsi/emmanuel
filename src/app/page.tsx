'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';
import { projects, type Project } from '@/components/projects';
import { MarkFor } from '@/components/ProjectMark';
import DotImage from '@/components/dot/DotImage';
import DotSwap from '@/components/dot/DotSwap';
import DotText from '@/components/dot/DotText';
import { introWait } from '@/components/dot/engine';
import '../styles/globals.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const TXT = 'text-[13px] leading-[1.35]';
const key = (p: Project) => p.link.replace(/^\//, '');

/** One project: a card in a regular grid — every cover in the same 4:3 frame, then a thin caption. */
function ProjectCard({ project, index, small = false }: { project: Project; index: number; small?: boolean }) {
  const t = useT();
  const card = useRef<HTMLAnchorElement>(null);
  const title = t(project.title.fr, project.title.en);
  return (
    <motion.article initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 0.6, ease: EASE }}>
      <Link
        ref={card}
        href={project.link}
        className="group block"
        aria-label={t(`Voir le projet ${title}`, `View project ${title}`)}
        data-cursor="project"
        data-mark={key(project)}
        data-label={t('Voir', 'View')}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <DotImage
            src={project.image}
            hover={project.hover}
            alt={title}
            priority={index < 2}
            sizes={small ? '(min-width:768px) 33vw, 100vw' : '(min-width:768px) 50vw, 100vw'}
            cell={small ? 7 : 8}
          />
        </div>
        <div className="h-[2px] w-full bg-black/10">
          <div className="h-full w-0 bg-[#0a0a0a] transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full" />
        </div>
        <div className={`${TXT} flex items-start justify-between gap-4 px-2 pt-1.5 md:px-0`}>
          <div>
            <p className="font-medium">
              <DotText text={title} play="view hover" hoverTarget={card} />
            </p>
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

function GroupLabel({ children, count, first = false, right }: { children: React.ReactNode; count: number; first?: boolean; right?: React.ReactNode }) {
  return (
    <div className={`${TXT} flex items-baseline justify-between px-2 pb-1.5 md:px-0 ${first ? 'pt-6' : 'pt-24 md:pt-32'}`}>
      <p>
        {children} <span className="ml-2 tabular-nums text-black/45">{count}</span>
      </p>
      {right}
    </div>
  );
}

type View = 'grid' | 'index';

function ViewToggle({ view, setView }: { view: View; setView: (v: View) => void }) {
  const t = useT();
  const opts: [View, string][] = [
    ['grid', t('Grille', 'Grid')],
    ['index', 'Index'],
  ];
  return (
    <div role="group" aria-label={t('Affichage', 'Display')}>
      {opts.map(([v, label], i) => (
        <span key={v}>
          {i > 0 && <span className="text-black/30"> / </span>}
          <button type="button" onClick={() => setView(v)} aria-pressed={view === v} className={view === v ? '' : 'text-black/40 transition-colors hover:text-black'}>
            <DotText text={label} play="hover" />
          </button>
        </span>
      ))}
    </div>
  );
}

/**
 * The Index: every project as one line of type. The one you point at (or the one in the middle of the
 * screen when you just scroll) lights up, its neighbours fade with distance, and its cover spreads in dots.
 */
function IndexView() {
  const t = useT();
  const list = useRef<HTMLDivElement>(null);
  const rows = useRef<HTMLAnchorElement[]>([]);
  const frame = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0.5 });
  const srcs = useRef(projects.map((p) => p.image)).current;

  // without a pointer on the list, the line nearest the reading point is the active one
  useEffect(() => {
    let raf = 0;
    const pick = () => {
      raf = 0;
      if (hovering.current) return;
      const mobile = innerWidth < 768;
      const target = innerHeight * (mobile ? 0.72 : 0.5);
      let best = 0;
      let bd = Infinity;
      rows.current.forEach((r, i) => {
        if (!r) return;
        const b = r.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - target);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      setActive((a) => (a === best ? a : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const activate = (i: number) => {
    const r = rows.current[i]?.getBoundingClientRect();
    const f = frame.current?.getBoundingClientRect();
    if (r && f) setOrigin({ x: innerWidth < 768 ? 0.5 : 0, y: Math.min(1.1, Math.max(-0.1, (r.top + r.height / 2 - f.top) / f.height)) });
    setActive(i);
  };

  const p = projects[active];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 gap-3 md:grid-cols-12">
      {/* the frame */}
      <div className="sticky top-8 z-10 order-first bg-white pb-3 md:order-last md:col-span-5 md:col-start-8 md:self-start md:pt-[10vh]">
        <div ref={frame}>
          <DotSwap srcs={srcs} active={active} origin={origin} className="aspect-[16/10] w-full md:aspect-[4/3]" />
        </div>
        <div className={`${TXT} mt-2 flex items-start justify-between gap-4 px-2 md:px-0`}>
          <div>
            <p className="font-medium">
              <DotText key={p.link} text={t(p.title.fr, p.title.en)} />
            </p>
            <p className="text-black/50">{t(p.subtitle.fr, p.subtitle.en)}</p>
          </div>
          <span className="flex items-center gap-2.5 tabular-nums text-black/55">
            <MarkFor link={p.link} />
            {String(active + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* the lines */}
      <div
        ref={list}
        className="md:col-span-7 md:pb-[30vh] md:pt-[10vh]"
        onPointerEnter={(e) => e.pointerType === 'mouse' && (hovering.current = true)}
        onPointerLeave={() => (hovering.current = false)}
      >
        {projects.map((proj, i) => {
          const d = Math.abs(i - active);
          return (
            <Link
              key={proj.link}
              href={proj.link}
              ref={(el) => {
                if (el) rows.current[i] = el;
              }}
              onPointerEnter={(e) => e.pointerType === 'mouse' && activate(i)}
              onFocus={() => activate(i)}
              data-cursor="project"
              data-mark={key(proj)}
              data-label={t('Voir', 'View')}
              className="grid grid-cols-[2.6ch_1fr_auto] items-baseline gap-x-3 border-t border-black/10 px-2 py-2.5 transition-opacity duration-500 md:px-0 md:py-3"
              style={{ opacity: Math.max(0.13, 1 - d * 0.3) }}
            >
              <span className={`${TXT} tabular-nums text-black/50`}>{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[9.5vw] font-medium leading-[0.95] tracking-[-0.045em] md:text-[clamp(30px,3.7vw,64px)]">
                <DotText text={t(proj.title.fr, proj.title.en)} play="mount hover" delay={i * 40} />
              </span>
              <span className={`${TXT} hidden text-right text-black/50 md:block`}>{t(proj.subtitle.fr, proj.subtitle.en)}</span>
            </Link>
          );
        })}
        <div className="border-t border-black/10" />
      </div>
    </motion.div>
  );
}

export default function Home() {
  const t = useT();
  const featured = projects.filter((p) => p.group === 'featured');
  const more = projects.filter((p) => p.group === 'more');
  const explorations = projects.filter((p) => p.group === 'explorations');
  const [view, setViewState] = useState<View>('grid');

  useEffect(() => {
    try {
      const v = localStorage.getItem('view');
      if (v === 'index' || v === 'grid') setViewState(v);
    } catch {}
  }, []);
  const setView = (v: View) => {
    setViewState(v);
    try {
      localStorage.setItem('view', v);
    } catch {}
  };

  const contactCard = (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 1, ease: EASE, delay: 0.16 }}>
      <a href="mailto:emmanuelijjou@gmail.com" className="group block" data-cursor="label" data-label={t('Écrire', 'Write')}>
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

  const headline = t('Product Designer à Paris.', 'Product Designer in Paris.');
  const [lead] = useState(() => introWait() / 1000);

  return (
    <main className="!block min-h-screen w-full !overflow-visible bg-white pb-16 text-[#0a0a0a] [scroll-snap-type:none]">
      <Header active="work" />

      {/* statement */}
      <section className="flex min-h-[78svh] flex-col justify-end px-2 pb-6 md:px-3">
        <h1 key={headline} className="max-w-[14ch] text-[13vw] font-medium leading-[0.9] tracking-[-0.045em] md:text-[min(6vw,96px)]">
          {headline.split(' ').map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
              <motion.span
                className="inline-block"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: lead + 0.25 + i * 0.07 }}
              >
                {w}
                {i < headline.split(' ').length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className={`${TXT} mt-8 grid grid-cols-1 gap-4 md:grid-cols-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: lead + 0.7 }}
        >
          <p className="md:col-span-2 md:max-w-[480px]">
            {t('Précédemment OKCC, studio créatif — ', 'Previously OKCC, creative studio — ')}Hennessy, Shu Uemura, Louis Vuitton, L&apos;Oréal, YSL Beauty, HOKA.
          </p>
          <p className="text-black/50 md:col-span-1">{t('Disponible — CDI, Paris ou remote', 'Available — full-time, Paris or remote')}</p>
          <a href="#work" className="hover:underline md:text-right">
            {t('Voir les projets', 'See the work')} ↓
          </a>
        </motion.div>
      </section>

      <div id="work" className="scroll-mt-6 px-0 md:px-3">
        {view === 'index' ? (
          <>
            <GroupLabel first count={projects.length} right={<ViewToggle view={view} setView={setView} />}>
              {t('Tous les projets', 'All projects')}
            </GroupLabel>
            <IndexView />
          </>
        ) : (
          <>
            <GroupLabel first count={featured.length} right={<ViewToggle view={view} setView={setView} />}>
              {t('Sélection', 'Selected work')}
            </GroupLabel>
            <div className="grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-2 md:gap-y-16">
              {featured.map((project, i) => (
                <ProjectCard key={project.link} project={project} index={i} />
              ))}
            </div>

            <GroupLabel count={more.length}>{t('Autres projets', 'More work')}</GroupLabel>
            <div className="grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-y-14">
              {more.map((project, i) => (
                <ProjectCard key={project.link} project={project} index={featured.length + i} small />
              ))}
              {more.length % 3 !== 0 && contactCard}
            </div>

            <GroupLabel count={explorations.length}>{t('Explorations', 'Explorations')}</GroupLabel>
            <div className="grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-y-14">
              {explorations.map((project, i) => (
                <ProjectCard key={project.link} project={project} index={featured.length + more.length + i} small />
              ))}
            </div>
          </>
        )}
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
