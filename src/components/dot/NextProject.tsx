'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { nextProject, projects } from '../projects';
import { useT } from '../i18n';
import { MarkFor } from '../ProjectMark';
import { DotCanvas, reducedMotion, smooth } from './engine';
import { loadImage } from './img';
import { dotGo } from './Transitions';

/**
 * The end of every case: keep scrolling and the next project builds itself in dots,
 * the line fills, and you are carried over to it. A click on the name works too.
 */
export default function NextProject({ path }: { path: string }) {
  const t = useT();
  const np = nextProject(path);
  const index = projects.findIndex((p) => p.link === np.link);
  const zone = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const e = new DotCanvas(cv.current!, 10);
    let img: HTMLImageElement | null = null;
    let raf = 0;
    let last = -1;
    loadImage(np.image, 1200).then((i) => {
      img = i;
      e.setImage(i);
      last = -1;
    });
    const fit = () => {
      if (!frame.current) return;
      const r = frame.current.getBoundingClientRect();
      e.resize(r.width, r.height);
      if (img) e.setImage(img);
      last = -1;
    };
    fit();
    window.addEventListener('resize', fit);

    let near = false;
    const io = new IntersectionObserver(([en]) => {
      near = en.isIntersecting;
      if (near && !raf) raf = requestAnimationFrame(tick);
    }, { rootMargin: '50% 0px' });
    io.observe(zone.current!);

    const tick = () => {
      if (!near) {
        raf = 0;
        return;
      }
      const z = zone.current;
      if (!z || !frame.current) {
        raf = 0;
        return;
      }
      const top = z.getBoundingClientRect().top + window.scrollY;
      const range = z.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / range));
      if (Math.abs(p - last) > 0.001) {
        last = p;
        if (line.current) line.current.style.transform = `scaleX(${p})`;
        if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
        // the picture is already half there when the zone starts, and complete a bit before the end
        e.render(smooth(0, 0.92, 0.18 + p * 0.86), { x: 0.5, y: 1.15 }, { spread: 1.3 });
        if (p >= 0.995 && !fired.current && !reducedMotion()) {
          fired.current = true;
          const r = frame.current.getBoundingClientRect();
          dotGo(np.link, { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight });
        }
        if (p < 0.9) fired.current = false;
      }
      raf = requestAnimationFrame(tick);
    };
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
    };
  }, [np.image, np.link]);

  const title = t(np.title.fr, np.title.en);

  return (
    <section id="next-zone" ref={zone} className="relative mt-32 h-[185vh] w-full md:mt-48">
      <div className="sticky top-0 flex h-[100svh] w-full flex-col justify-center px-2 md:px-3">
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 text-[14px] leading-[1.6] md:grid-cols-12 md:text-[13px]">
          <div className="md:col-span-3 md:pr-7">
            <p className="flex justify-between border-t border-black/15 pt-2 text-black/45">
              <span>{t('Projet suivant', 'Next project')}</span>
              <span className="tabular-nums">
                {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
            </p>
            <Link href={np.link} className="mt-3 flex items-center gap-2.5 font-medium" data-cursor="project" data-mark={np.link.slice(1)} data-label={t('Voir', 'View')}>
              {title}
              <MarkFor link={np.link} />
            </Link>
            <p className="text-black/45">{t(np.subtitle.fr, np.subtitle.en)}</p>
          </div>
          <div className="md:col-span-7 md:col-start-4">
            <div ref={frame} className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
              <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
            </div>
            <div className="mt-3 h-px w-full bg-black/15">
              <div ref={line} className="h-full w-full origin-left bg-[#0a0a0a]" style={{ transform: 'scaleX(0)' }} />
            </div>
            <div className="mt-1.5 flex justify-between text-black/45">
              <span>{t('Continuez à défiler', 'Keep scrolling')} ↓</span>
              <span ref={pct} className="tabular-nums">0%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
