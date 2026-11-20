'use client';

import { useEffect, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useT } from '../i18n';

/** Fixed depth gauge: scrolling the page is digging down, from the street to the tunnel axis (22 m). */
const AXIS = 22;
const LAYERS = [
  { to: 3.5, fr: 'Remblais', en: 'Fill' },
  { to: 12.5, fr: 'Marnes et caillasses', en: 'Marl and rubble' },
  { to: 27.8, fr: 'Calcaire grossier', en: 'Coarse limestone' },
];

export default function Depth() {
  const t = useT();
  const { scrollYProgress } = useScroll();
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setP(v));
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const d = Math.min(AXIS, Math.max(0, (p / 0.92) * AXIS));
  const layer = LAYERS.find((l) => d <= l.to) ?? LAYERS[LAYERS.length - 1];
  const H = 260;

  return (
    <div
      className={`fixed z-30 right-2 md:right-3 bottom-[44px] min-[1600px]:bottom-auto min-[1600px]:top-1/2 min-[1600px]:-translate-y-1/2 pointer-events-none transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden
    >
      {/* desktop: vertical ruler */}
      <div className="hidden min-[1600px]:flex items-start gap-2">
        <div className="text-right pt-0.5">
          <div className="text-[13px] tabular-nums leading-none">−{d.toFixed(1).replace('.', ',')} m</div>
          <div className="text-[11px] text-black/45 mt-1 whitespace-nowrap">{t(layer.fr, layer.en)}</div>
        </div>
        <svg width="18" height={H} className="overflow-visible">
          {Array.from({ length: AXIS + 1 }).map((_, i) => (
            <line key={i} x1={i % 5 ? 10 : 4} x2="18" y1={(i / AXIS) * H} y2={(i / AXIS) * H} stroke="#0a0a0a" strokeOpacity={i % 5 ? 0.25 : 0.6} strokeWidth="1" />
          ))}
          <line x1="18" x2="18" y1="0" y2={H} stroke="#0a0a0a" strokeOpacity=".3" />
          <circle cx="11" cy={(d / AXIS) * H} r="3.5" fill="#0a0a0a" />
        </svg>
      </div>
      {/* mobile: one line */}
      <div className="min-[1600px]:hidden text-[12px] tabular-nums bg-white/90 px-1.5 py-0.5">
        −{d.toFixed(1).replace('.', ',')} m · <span className="text-black/50">{t(layer.fr, layer.en)}</span>
      </div>
    </div>
  );
}
