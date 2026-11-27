'use client';

import Image from 'next/image';
import Link from 'next/link';
import { nextProject, projects } from '../projects';
import { useT } from '../i18n';
import { MarkFor } from '../ProjectMark';
import DotIn from './DotIn';

const FT = 'text-[14px] leading-[1.6] md:text-[13px]';

/**
 * The end of every case. No scrolling trick: the next project, quietly.
 */
export default function NextProject({ path, whole = false }: { path: string; whole?: boolean }) {
  const t = useT();
  const np = nextProject(path);
  const index = projects.findIndex((p) => p.link === np.link);
  const title = t(np.title.fr, np.title.en);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section id="next-zone" className={`${FT} mt-32 w-full px-2 pb-28 md:mt-48 md:px-3 md:pb-36`}>
      <div className="grid grid-cols-1 gap-x-3 gap-y-4 border-t border-black/15 pt-2 md:grid-cols-12">
        <div className="md:col-span-3 md:pr-7">
          <p className="flex justify-between text-black/55">
            <span>{t('Projet suivant', 'Next project')}</span>
            <span className="tabular-nums">
              {pad(index + 1)} / {pad(projects.length)}
            </span>
          </p>
          <Link href={np.link} className="mt-3 flex items-center gap-2.5 font-medium">
            {title}
            <MarkFor link={np.link} />
          </Link>
          <p className="text-black/55">{t(np.subtitle.fr, np.subtitle.en)}</p>
        </div>
        <Link
          href={np.link}
          aria-label={title}
          className="block md:col-span-6 md:col-start-4"
        >
          {/* `whole`: the next project's picture at its own proportions, nothing cut */}
          <DotIn className={`relative w-full overflow-hidden ${whole ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
            <Image src={np.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className={whole ? 'object-contain' : 'object-cover'} />
          </DotIn>
        </Link>
      </div>

    </section>
  );
}
