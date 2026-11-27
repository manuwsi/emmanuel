'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GRIDS, projectKey } from '../ProjectMark';
import DotText from './DotText';

/** How far into the case the reader is, 0 → 1 (the "next project" zone does not count). */
function progress() {
  const zone = document.getElementById('next-zone');
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const end = zone ? zone.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4 : max;
  return Math.min(1, Math.max(0, window.scrollY / Math.max(1, Math.min(max, end))));
}

/**
 * The project's own 5×5 mark, next to the name in the corner, fills dot by dot as you read:
 * it starts faint and is complete when you reach the end of the case.
 */
export function ReadingMark({ className = 'h-[19px] w-[19px] md:h-[24px] md:w-[24px]' }: { className?: string }) {
  const key = projectKey(usePathname() ?? '');
  const grid = GRIDS[key];
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!grid) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      setP((old) => {
        const v = Math.round(progress() * 100) / 100;
        return Math.abs(v - old) >= 0.01 ? v : old;
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, [grid]);

  if (!grid) return null;
  // the dots light up from the centre of the mark outwards
  const cells = grid.flatMap((row, y) => row.map((v, x) => ({ x, y, v }))).filter((c) => c.v);
  const order = [...cells].sort((a, b) => Math.hypot(a.x - 2, a.y - 2) - Math.hypot(b.x - 2, b.y - 2) || a.y - b.y || a.x - b.x);
  const lit = (c: { x: number; y: number }) => order.findIndex((o) => o.x === c.x && o.y === c.y) < Math.round(p * order.length);

  return (
    <svg viewBox="0 0 25 25" className={className} fill="currentColor" aria-label={`${Math.round(p * 100)} %`} role="img">
      {cells.map((c) => (
        <circle
          key={`${c.x}-${c.y}`}
          cx={2.5 + c.x * 5}
          cy={2.5 + c.y * 5}
          r={c.v === 2 ? 2.3 : 1.55}
          style={{ opacity: lit(c) ? (c.v === 2 ? 1 : 0.55) : 0.16, transition: 'opacity 380ms ease' }}
        />
      ))}
    </svg>
  );
}

/** The chapter you are in, after the project's name in the breadcrumb; it decodes in dots when it changes. */
export function ChapterCrumb() {
  const pathname = usePathname();
  const [label, setLabel] = useState('');
  const last = useRef('');

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let cur = '';
      document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el) => {
        if (el.getBoundingClientRect().top < line) cur = el.dataset.chapter ?? '';
      });
      const zone = document.getElementById('next-zone');
      if (zone && zone.getBoundingClientRect().top < line) cur = '';
      if (cur !== last.current) {
        last.current = cur;
        setLabel(cur);
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // the chapter is only written in the breadcrumb on wide screens: on a phone nothing is measured while scrolling
    const wide = window.matchMedia('(min-width: 768px)');
    const attach = () => {
      window.removeEventListener('scroll', on);
      if (!wide.matches) return;
      tick();
      window.addEventListener('scroll', on, { passive: true });
    };
    attach();
    wide.addEventListener('change', attach);
    return () => {
      wide.removeEventListener('change', attach);
      window.removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (!label) return null;
  return (
    <span className="hidden opacity-50 md:inline">
      {' '}
      · <DotText key={label} text={label} play="mount" />
    </span>
  );
}
