'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor, desktop only.
 * Position lives in motion values (no React re-render on mouse move),
 * and the component renders nothing on touch / coarse-pointer devices.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let shown = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown) {
        shown = true;
        setVisible(true);
      }
    };
    const leave = () => {
      shown = false;
      setVisible(false);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 w-5 h-5 z-[998] bg-white rounded-full pointer-events-none mix-blend-difference will-change-transform"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
    />
  );
}
