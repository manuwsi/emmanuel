'use client';

import { useEffect, useId, useState } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const SATELLITES = [58, -58, 102, -102, 152, -152];

/** The SOUTRAME mark (the cluster), kept as the brand symbol. `assemble` animates the satellites in. */
export function Mark({ className = '', assemble = false }: { className?: string; assemble?: boolean }) {
  return (
    <svg viewBox="-71.78 -46.68 143.55 113.12" fill="currentColor" className={className} aria-hidden>
      <motion.circle cx="0" cy="0" r="30" initial={assemble ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: EASE }} />
      {SATELLITES.map((deg, i) => {
        const t = (deg * Math.PI) / 180;
        const x = Math.round(56 * Math.sin(t) * 100) / 100;
        const y = Math.round(-56 * Math.cos(t) * 100) / 100;
        return (
          <motion.g key={deg} initial={assemble ? { opacity: 0, x: Math.round(x * 6) / 10, y: Math.round(y * 6) / 10 } : false} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.06 }}>
            <rect x="-4.5" y="-56" width="9" height="56" transform={`rotate(${deg})`} />
            <circle cx={x} cy={y} r="17" />
          </motion.g>
        );
      })}
    </svg>
  );
}

/**
 * The same mark, in a soft, liquid treatment: pale grey forms that fuse into each other (a "goo" filter),
 * diffuse gradients, and small dots at the heart of each satellite. A dark dot travels from one satellite
 * to the next: the cycle. Geometry is untouched — only the material changes.
 */
export function SoftMark({ className = '', animate = true }: { className?: string; animate?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % SATELLITES.length), 420);
    return () => clearInterval(id);
  }, [animate]);
  const pts = SATELLITES.map((deg) => {
    const t = (deg * Math.PI) / 180;
    return { deg, x: Math.round(56 * Math.sin(t) * 100) / 100, y: Math.round(-56 * Math.cos(t) * 100) / 100 };
  });
  return (
    <svg viewBox="-96 -76 192 168" className={className} aria-hidden>
      <defs>
        <filter id={`sm-goo-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
        </filter>
        <radialGradient id={`sm-sat-${uid}`} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#f4f4f3" />
          <stop offset="70%" stopColor="#e3e3e2" />
          <stop offset="100%" stopColor="#d6d6d5" />
        </radialGradient>
        <radialGradient id={`sm-core-${uid}`} cx="40%" cy="36%" r="75%">
          <stop offset="0%" stopColor="#f6f6f5" />
          <stop offset="65%" stopColor="#e6e6e5" />
          <stop offset="100%" stopColor="#d4d4d3" />
        </radialGradient>
        <radialGradient id={`sm-halo-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the liquid body: everything fuses through the goo filter */}
      <g filter={`url(#sm-goo-${uid})`}>
        <motion.circle cx="0" cy="0" r="30" fill={`url(#sm-core-${uid})`} initial={animate ? { scale: 0.4 } : false} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: EASE }} />
        {pts.map((p, i) => (
          <motion.g key={p.deg} initial={animate ? { x: -p.x * 0.85, y: -p.y * 0.85 } : false} animate={{ x: 0, y: 0 }} transition={{ duration: 1.5, ease: EASE, delay: 0.15 + i * 0.07 }}>
            <rect x="-4.5" y="-56" width="9" height="56" transform={`rotate(${p.deg})`} fill="#dcdcdb" />
            <circle cx={p.x} cy={p.y} r="17" fill={`url(#sm-sat-${uid})`} />
          </motion.g>
        ))}
      </g>

      {/* soft light on the core */}
      <circle cx="-7" cy="-8" r="18" fill={`url(#sm-halo-${uid})`} opacity="0.7" />

      {/* small dots at the heart of each satellite; one is active and travels round */}
      {pts.map((p, i) => (
        <motion.g key={p.deg} initial={animate ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.1 + i * 0.05 }}>
          <circle cx={p.x} cy={p.y} r={i === active ? 8.5 : 0} fill="#c9c9c8" style={{ transition: 'r 0.35s ease' }} />
          <circle cx={p.x} cy={p.y} r={i === active ? 3.6 : 2.4} fill={i === active ? '#111' : '#a9a9a8'} style={{ transition: 'r 0.35s ease, fill 0.35s ease' }} />
        </motion.g>
      ))}
    </svg>
  );
}

