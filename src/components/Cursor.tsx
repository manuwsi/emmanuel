'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { GRIDS } from './ProjectMark';
import { useT } from './i18n';
import DotText from './dot/DotText';

/**
 * Custom cursor, desktop only: a single dot.
 * Over a link it swells; over a project it unfolds into that project's own 5×5 mark, with a word next to it.
 * Position lives in motion values (no React re-render on mouse move).
 */
type Mode = { kind: 'idle' } | { kind: 'link' } | { kind: 'project'; key: string; label?: string } | { kind: 'label'; label: string };

const SOUTRAME: number[][] = [
  [0, 1, 0, 1, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 2, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 1, 0, 1, 0],
];

export default function Cursor() {
  const t = useT();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: 'idle' });
  const modeKey = useRef('idle');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    let shown = false;
    const read = (el: Element | null): Mode => {
      const tagged = el?.closest<HTMLElement>('[data-cursor]');
      if (tagged) {
        const kind = tagged.dataset.cursor;
        if (kind === 'project') return { kind: 'project', key: tagged.dataset.mark ?? '', label: tagged.dataset.label };
        if (kind === 'label') return { kind: 'label', label: tagged.dataset.label ?? '' };
        if (kind === 'none') return { kind: 'idle' };
      }
      if (el?.closest('a, button, [role="button"], label, select')) return { kind: 'link' };
      return { kind: 'idle' };
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown) {
        shown = true;
        setVisible(true);
      }
      const m = read(e.target as Element);
      const k = m.kind + ('key' in m ? m.key : '') + ('label' in m ? m.label ?? '' : '');
      if (k !== modeKey.current) {
        modeKey.current = k;
        setMode(m);
      }
    };
    const leave = () => {
      shown = false;
      setVisible(false);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const grid = mode.kind === 'project' ? (mode.key.startsWith('soutrame') ? SOUTRAME : GRIDS[mode.key]) : undefined;
  const label = mode.kind === 'project' ? mode.label ?? t('Voir', 'View') : mode.kind === 'label' ? mode.label : undefined;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[998] text-white mix-blend-difference will-change-transform"
      style={{ x, y, opacity: visible ? 1 : 0 }}
    >
      {/* the dot */}
      <motion.span
        className="absolute left-0 top-0 block h-2 w-2 rounded-full bg-white"
        style={{ translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: grid ? 0 : mode.kind === 'link' ? 2.6 : mode.kind === 'label' ? 1 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* the project's mark, unfolding from the centre */}
      <AnimatePresence>
        {grid && (
          <motion.svg
            key={mode.kind === 'project' ? mode.key : 'g'}
            viewBox="0 0 25 25"
            className="absolute left-0 top-0 h-[30px] w-[30px]"
            style={{ translateX: '-50%', translateY: '-50%' }}
            fill="currentColor"
            initial="out"
            animate="in"
            exit="out"
          >
            {grid.flatMap((row, gy) =>
              row.map((v, gx) =>
                v ? (
                  <motion.circle
                    key={`${gx}-${gy}`}
                    cx={2.5 + gx * 5}
                    cy={2.5 + gy * 5}
                    r={v === 2 ? 2.3 : 1.55}
                    opacity={v === 2 ? 1 : 0.55}
                    style={{ transformOrigin: `${2.5 + gx * 5}px ${2.5 + gy * 5}px` }}
                    variants={{
                      out: { scale: 0, transition: { duration: 0.15 } },
                      in: { scale: 1, transition: { type: 'spring', stiffness: 520, damping: 22, delay: (Math.abs(gx - 2) + Math.abs(gy - 2)) * 0.035 } },
                    }}
                  />
                ) : null
              )
            )}
          </motion.svg>
        )}
      </AnimatePresence>

      {/* a word next to it */}
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            className="absolute left-0 top-0 whitespace-nowrap text-[12px] font-medium uppercase leading-none tracking-[0.02em]"
            style={{ translateY: '-50%' }}
            initial={{ x: grid ? 14 : 10, opacity: 0 }}
            animate={{ x: grid ? 24 : 12, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <DotText text={label} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
