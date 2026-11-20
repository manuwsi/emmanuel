'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * The cutterhead drawn in dots, the same way as the project marks.
 * It turns slowly on its own and faster as the page is scrolled: the deeper you go, the harder it digs.
 */
const R = 100;

function dots() {
  const out: { x: number; y: number; r: number; o: number }[] = [];
  // rim: two rings
  for (let k = 0; k < 120; k++) {
    const a = (k / 120) * Math.PI * 2;
    out.push({ x: Math.cos(a) * R, y: Math.sin(a) * R, r: 1.25, o: 0.55 });
  }
  for (let k = 0; k < 96; k++) {
    const a = (k / 96) * Math.PI * 2 + 0.03;
    out.push({ x: Math.cos(a) * (R - 6), y: Math.sin(a) * (R - 6), r: 0.9, o: 0.3 });
  }
  // six spokes: cutters as full dots, alternating sides
  for (let s = 0; s < 6; s++) {
    const a = (s / 6) * Math.PI * 2 + 0.26;
    const nx = -Math.sin(a), ny = Math.cos(a);
    for (let k = 0; k < 12; k++) {
      const d = 18 + k * 6.6;
      const side = k % 2 ? 3.2 : -3.2;
      out.push({ x: Math.cos(a) * d + nx * side, y: Math.sin(a) * d + ny * side, r: 2.4, o: 1 });
      out.push({ x: Math.cos(a) * d - nx * side * 1.9, y: Math.sin(a) * d - ny * side * 1.9, r: 0.9, o: 0.35 });
    }
    // short arm between spokes
    const b = a + Math.PI / 6;
    for (let k = 0; k < 6; k++) {
      const d = 56 + k * 6.4;
      out.push({ x: Math.cos(b) * d, y: Math.sin(b) * d, r: 1.7, o: 0.8 });
    }
  }
  // hub
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * Math.PI * 2;
    out.push({ x: Math.cos(a) * 11, y: Math.sin(a) * 11, r: 1.5, o: 0.7 });
  }
  out.push({ x: 0, y: 0, r: 4.2, o: 1 });
  return out;
}

const DOTS = dots();

export default function Cutter({ className = '' }: { className?: string }) {
  const { scrollY } = useScroll();
  const turn = useSpring(useTransform(scrollY, (v) => v * 0.12), { stiffness: 60, damping: 20 });
  return (
    <div className={className} aria-hidden>
      <motion.svg viewBox="-104 -104 208 208" className="w-full h-full" style={{ rotate: turn }}>
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
          {DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#0a0a0a" opacity={d.o} />
          ))}
        </motion.g>
      </motion.svg>
    </div>
  );
}
