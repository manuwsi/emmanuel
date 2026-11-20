'use client';

import { usePathname } from 'next/navigation';
import { Mark } from './SoutrameMarks';

/**
 * One small mark per project, drawn in dots on a 5×5 grid and shown next to the name in the bottom-left corner.
 * 0 = empty, 1 = faint dot, 2 = full dot.
 */
const GRIDS: Record<string, number[][]> = {
  // Colosse: the cutterhead seen from the front, spokes and a hub
  colosse: [
    [0, 1, 2, 1, 0],
    [1, 0, 1, 0, 1],
    [2, 1, 2, 1, 2],
    [1, 0, 1, 0, 1],
    [0, 1, 2, 1, 0],
  ],
  // Dailies: a strip of film, one frame chosen among the takes
  dailies: [
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 2, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
  ],
  // Élan: a ring of dots, a short arc lit: one interval in progress
  elan: [
    [0, 1, 2, 2, 0],
    [1, 0, 0, 0, 2],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  // Foil: a diagonal catching the light
  foil: [
    [2, 1, 0, 0, 0],
    [1, 2, 1, 0, 0],
    [0, 1, 2, 1, 0],
    [0, 0, 1, 2, 1],
    [0, 0, 0, 1, 2],
  ],
  // Serena: furrows in a field, the last one sown
  serena: [
    [1, 1, 1, 1, 2],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 2],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 2],
  ],
  // Shu Uemura AI:tutor: a spark
  'shu-uemura': [
    [0, 0, 1, 0, 0],
    [0, 0, 2, 0, 0],
    [1, 2, 2, 2, 1],
    [0, 0, 2, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  // Hennessy: grain fading out, generative
  hennessy: [
    [2, 2, 2, 1, 1],
    [2, 2, 1, 1, 0],
    [2, 1, 1, 0, 1],
    [1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0],
  ],
  // Z_Lab: a plan, a square with a lit corner
  z_lab: [
    [2, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // HIGAN: the silhouette of a bottle
  higan: [
    [0, 0, 2, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  // Post Archive Faction: a frame with an object inside
  'post-archive-faction': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // Aether: a diamond, a card
  aether: [
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 2, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  // SPECTRE: columns of text
  spectre: [
    [2, 2, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 2, 2],
    [1, 1, 0, 1, 1],
  ],
  'ai-research': [
    [0, 1, 0, 0, 2],
    [1, 0, 0, 1, 0],
    [0, 0, 2, 0, 0],
    [2, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
  ],
};

export function DotMark({ grid, className = '' }: { grid: number[][]; className?: string }) {
  return (
    <svg viewBox="0 0 25 25" className={className} fill="currentColor" aria-hidden>
      {grid.flatMap((row, y) =>
        row.map((v, x) => (v ? <circle key={`${x}-${y}`} cx={2.5 + x * 5} cy={2.5 + y * 5} r={v === 2 ? 2.3 : 1.55} opacity={v === 2 ? 1 : 0.5} /> : null))
      )}
    </svg>
  );
}

export function projectKey(pathname: string) {
  const k = pathname.replace(/^\//, '').split('/')[0];
  return k;
}

/** The mark that goes with the current page, or nothing on the home and about pages. */
export default function ProjectMark({ className = 'h-[19px] w-[19px] md:h-[24px] md:w-[24px]' }: { className?: string }) {
  const key = projectKey(usePathname() ?? '');
  if (key === 'soutrame-ecommerce' || key === 'soutrame') return <Mark className="h-[15px] w-[19px] md:h-[19px] md:w-[24px]" />;
  const grid = GRIDS[key];
  return grid ? <DotMark grid={grid} className={className} /> : null;
}

export { GRIDS };

/** The mark of a project, from its link (used on the home page). */
export function MarkFor({ link, className = 'h-[15px] w-[15px]' }: { link: string; className?: string }) {
  const key = projectKey(link);
  if (key === 'soutrame-ecommerce' || key === 'soutrame') return <Mark className="h-[12px] w-[15px]" />;
  const grid = GRIDS[key];
  return grid ? <DotMark grid={grid} className={className} /> : null;
}
