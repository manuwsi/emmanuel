'use client';

import Image from 'next/image';
import Link from 'next/link';
import { nextProject, projects } from '../projects';
import { useT } from '../i18n';
import { MarkFor } from '../ProjectMark';
import DotIn from './DotIn';

const FT = 'text-[14px] leading-[1.6] md:text-[13px]';

/**
 * The end of every case. No scrolling trick: the next project, quietly, then the twelve marks side by side.
 * The mark of the case you just read is the one drawn in full (it filled up in the corner while you were reading).
 */
export default function NextProject({ path }: { path: string }) {
  const t = useT();
  const np = nextProject(path);
  const index = projects.findIndex((p) => p.link === np.link);
  const title = t(np.title.fr, np.title.en);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section id="next-zone" className={`${FT} mt-32 w-full px-2 pb-28 md:mt-48 md:px-3 md:pb-36`}>
      <div className="grid grid-cols-1 gap-x-3 gap-y-4 border-t border-black/15 pt-2 md:grid-cols-12">
        <div className="md:col-span-3 md:pr-7">
          <p className="flex justify-between text-black/45">
            <span>{t('Projet suivant', 'Next project')}</span>
            <span className="tabular-nums">
              {pad(index + 1)} / {pad(projects.length)}
            </span>
          </p>
          <Link href={np.link} className="mt-3 flex items-center gap-2.5 font-medium">
            {title}
            <MarkFor link={np.link} />
          </Link>
          <p className="text-black/45">{t(np.subtitle.fr, np.subtitle.en)}</p>
        </div>
        <Link
          href={np.link}
          aria-label={title}
          className="block md:col-span-6 md:col-start-4"
        >
          <DotIn className="relative aspect-[16/10] w-full overflow-hidden">
            <Image src={np.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </DotIn>
        </Link>
      </div>

      {/* the twelve marks: an index that only this site could have */}
      <nav aria-label={t('Tous les projets', 'All projects')} className="mt-20 grid grid-cols-1 gap-x-3 gap-y-4 md:mt-28 md:grid-cols-12">
        <p className="text-black/45 md:col-span-3">{t('Les douze projets', 'The twelve projects')}</p>
        <ol className="grid grid-cols-6 gap-y-5 md:col-span-9 md:col-start-4 md:grid-cols-12">
          {projects.map((p, i) => {
            const here = p.link === path;
            return (
              <li key={p.link}>
                <Link href={p.link} aria-label={t(p.title.fr, p.title.en)} aria-current={here ? 'page' : undefined} className="inline-flex flex-col items-start gap-1.5">
                  <span className={here ? '' : 'opacity-25'}>
                    <MarkFor link={p.link} className="h-[18px] w-[18px]" />
                  </span>
                  <span className={`text-[11px] tabular-nums ${here ? '' : 'text-black/45'}`}>{pad(i + 1)}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
}
