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
    <section id="next-zone" ref={zone} className="relative mt-32 h-[185vh] w-full md:mt-40">
      <div className="sticky top-0 flex h-[100svh] w-full flex-col justify-center px-2 md:px-3">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex items-baseline justify-between border-t-[3px] border-[#0a0a0a] pt-2 text-[13px] leading-[1.35]">
            <span className="text-black/45">
              {t('Projet suivant', 'Next project')}
            </span>
            <span className="tabular-nums text-black/45">
              {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 items-end gap-6 md:mt-8 md:grid-cols-12 md:gap-3">
            <div className="md:col-span-6">
              <Link href={np.link} className="inline-flex items-start gap-3">
                <span className="text-[13vw] font-medium leading-[0.92] tracking-[-0.045em] md:text-[5.4vw]">{title}</span>
              </Link>
              <p className="mt-3 flex items-center gap-2.5 text-[13px] text-black/55">
                <MarkFor link={np.link} />
                {t(np.subtitle.fr, np.subtitle.en)}
              </p>
            </div>
            <div ref={frame} className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 md:col-span-6">
              <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
            </div>
          </div>

          <div className="mt-8 md:mt-10">
            <div className="h-[2px] w-full bg-black/10">
              <div ref={line} className="h-full w-full origin-left bg-[#0a0a0a]" style={{ transform: 'scaleX(0)' }} />
            </div>
            <div className="mt-2 flex justify-between text-[13px] text-black/45">
              <span>{t('Continuez à défiler', 'Keep scrolling')} ↓</span>
              <span ref={pct} className="tabular-nums">0%</span>
            </div>
          </div>
        </div>
        <footer className="absolute bottom-12 right-2 text-[13px] text-black/40 md:right-3">© {new Date().getFullYear()} Emmanuel Ijjou</footer>
      </div>
    </section>
  );
}
