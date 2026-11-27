'use client';

import { useEffect, useRef, useState } from 'react';
import { GRIDS, projectKey } from '../ProjectMark';
import { projects } from '../projects';
import { useT } from '../i18n';
import { bezier, EASE } from '../dot/motion';
import { drawHalftone, fitCanvas } from '../dot/halftone';

/**
 * The launch of the site. One 5×5 matrix of dots reads through the twelve projects, mark after mark,
 * like a machine flipping through the work; it ends full, then opens: its dots become the halftone
 * that draws back from the centre and leaves the home page underneath.
 * Shown on a fresh load of the home page only (the inline script in layout sets data-home-intro).
 */
const STEP = 110; // ms per mark
const uninkE = bezier(EASE.unink);
const FULL = Array.from({ length: 5 }, () => [2, 2, 2, 2, 2]);

export default function Launch() {
  const t = useT();
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const matrix = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(-1);
  const [phase, setPhase] = useState<'read' | 'full' | 'open'>('read');
  const marks = projects.map((p) => GRIDS[projectKey(p.link)] ?? FULL);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.dataset.homeIntro !== '1') return;
    const finish = () => {
      delete html.dataset.homeIntro;
      el.style.display = 'none';
      window.dispatchEvent(new Event('dot:launched'));
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
    const timers: number[] = [];
    let raf = 0;
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    marks.forEach((_, k) => at(140 + k * STEP, () => setI(k)));
    const tFull = 140 + marks.length * STEP;
    at(tFull, () => setPhase('full'));
    at(tFull + 220, () => {
      setPhase('open');
      const c = canvas.current;
      const m = matrix.current;
      if (!c || !m) return finish();
      const ctx = fitCanvas(c);
      const b = m.getBoundingClientRect();
      const origin = { x: b.left + b.width / 2, y: b.top + b.height / 2 };
      // the first frame covers everything, so nothing shows between the white and the dots
      if (ctx) drawHalftone(ctx, c.clientWidth, c.clientHeight, origin, 0, 'reveal');
      el.style.background = 'transparent';
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 820);
        if (ctx) drawHalftone(ctx, c.clientWidth, c.clientHeight, origin, uninkE(p), 'reveal');
        if (p < 1) raf = requestAnimationFrame(step);
        else finish();
      };
      raf = requestAnimationFrame(step);
    });
    return () => {
      timers.forEach((x) => clearTimeout(x));
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grid = phase === 'read' ? (i >= 0 ? marks[i] : null) : FULL;
  const p = i >= 0 ? projects[i] : null;

  return (
    <div ref={root} id="launch" aria-hidden className="fixed inset-0 z-[96] hidden bg-white">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div className="absolute left-1/2 top-1/2 flex -translate-y-1/2 items-center" style={{ marginLeft: -40 }}>
        <div ref={matrix} className="grid grid-cols-5 gap-[5px] md:gap-[6px]">
          {Array.from({ length: 25 }, (_, k) => {
            const v = grid ? grid[Math.floor(k / 5)][k % 5] : 0;
            const open = phase === 'open';
            return (
              <span
                key={k}
                className="block h-[8px] w-[8px] rounded-full bg-[#0a0a0a] md:h-[10px] md:w-[10px]"
                style={{
                  transform: `scale(${open ? 2.6 : v === 2 ? 1 : v === 1 ? 0.6 : 0})`,
                  opacity: open ? 0 : v === 1 ? 0.5 : 1,
                  transition: open
                    ? `transform 520ms cubic-bezier(.16,1,.3,1) ${(Math.abs((k % 5) - 2) + Math.abs(Math.floor(k / 5) - 2)) * 30}ms, opacity 420ms ease ${(Math.abs((k % 5) - 2) + Math.abs(Math.floor(k / 5) - 2)) * 30}ms`
                    : 'transform 130ms cubic-bezier(.22,1,.36,1), opacity 130ms ease',
                }}
              />
            );
          })}
        </div>
        <div
          className="ml-5 w-[150px] text-[13px] leading-[1.45] transition-opacity duration-300 md:ml-6"
          style={{ opacity: phase === 'open' || !p ? 0 : 1 }}
        >
          <p className="tabular-nums">{phase === 'read' && p ? `${String(i + 1).padStart(2, '0')} / ${projects.length}` : 'Emmanuel Ijjou'}</p>
          <p className="truncate text-black/55">{phase === 'read' && p ? t(p.title.fr, p.title.en) : t('Product Designer', 'Product Designer')}</p>
        </div>
      </div>
    </div>
  );
}
