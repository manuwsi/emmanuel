'use client';

import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useT } from '../i18n';

/**
 * The scale, as a camera pulling back: one person, then a bus, then the cutterhead, then the whole machine.
 * Everything is drawn in metres; the scroll only moves the viewBox.
 */
const W0 = 5.2, W1 = 150;
const STAGES = [
  { at: 0, big: '1,80 m', fr: 'Une personne.', en: 'One person.' },
  { at: 0.27, big: '12 m', fr: 'Un bus.', en: 'A bus.' },
  { at: 0.52, big: 'Ø 10 m', fr: 'La roue de coupe.', en: 'The cutterhead.' },
  { at: 0.76, big: '110 m', fr: 'La machine entière. 1 655 tonnes.', en: 'The whole machine. 1,655 tonnes.' },
];

function wheelDots() {
  const out: [number, number, number][] = [];
  for (let k = 0; k < 90; k++) {
    const a = (k / 90) * Math.PI * 2;
    out.push([Math.cos(a) * 5, Math.sin(a) * 5, 0.09]);
  }
  for (let s = 0; s < 6; s++) {
    const a = (s / 6) * Math.PI * 2 + 0.26;
    for (let k = 0; k < 9; k++) {
      const d = 0.8 + k * 0.5;
      out.push([Math.cos(a) * d, Math.sin(a) * d, 0.13]);
    }
  }
  out.push([0, 0, 0.3]);
  return out;
}
const WHEEL = wheelDots();

export default function Scale() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setP(Math.min(1, Math.max(0, v))));

  const w = W0 * Math.pow(W1 / W0, Math.min(1, p / 0.9));
  const h = w * 0.62;
  const x0 = -0.9 - w * 0.02;
  const y0 = -h * 0.8;
  const stage = [...STAGES].reverse().find((s) => p >= s.at) ?? STAGES[0];
  const sw = w / 900; // stroke that stays about 1px

  return (
    <div ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute left-2 md:left-3 top-16 md:top-20 z-10 text-[14px] leading-[1.6] md:text-[13px]" data-chapter={t('01 → L’échelle', '01 → The scale')}>
          <div className="text-black/45">{t('01 → L’échelle', '01 → The scale')}</div>
          <div key={stage.big} className="mt-3 text-[14vw] md:text-[4.6vw] leading-[0.85] tracking-[-0.05em] font-medium tabular-nums">
            {stage.big}
          </div>
          <div className="mt-2">{t(stage.fr, stage.en)}</div>
        </div>
        <svg viewBox={`${x0} ${y0} ${w} ${h}`} className="w-full h-[62vh] md:h-[70vh] mt-auto mb-[8vh]" preserveAspectRatio="xMinYMax meet">
          {/* ground */}
          <line x1={-50} x2={400} y1={0} y2={0} stroke="#0a0a0a" strokeWidth={sw * 1.4} />
          {Array.from({ length: 41 }).map((_, i) => (
            <line key={i} x1={i * 5} x2={i * 5} y1={0} y2={i % 2 ? 0.25 * (w / 20) : 0.5 * (w / 20)} stroke="#0a0a0a" strokeOpacity=".4" strokeWidth={sw} />
          ))}
          {/* person */}
          <circle cx={0.25} cy={-1.64} r={0.13} fill="#0a0a0a" />
          <line x1={0.25} x2={0.25} y1={-1.5} y2={-0.85} stroke="#0a0a0a" strokeWidth={0.1} strokeLinecap="round" />
          <line x1={0.25} x2={0.12} y1={-0.85} y2={0} stroke="#0a0a0a" strokeWidth={0.09} strokeLinecap="round" />
          <line x1={0.25} x2={0.38} y1={-0.85} y2={0} stroke="#0a0a0a" strokeWidth={0.09} strokeLinecap="round" />
          <line x1={0.25} x2={0.05} y1={-1.42} y2={-0.95} stroke="#0a0a0a" strokeWidth={0.07} strokeLinecap="round" />
          <line x1={0.25} x2={0.45} y1={-1.42} y2={-0.95} stroke="#0a0a0a" strokeWidth={0.07} strokeLinecap="round" />
          {/* bus */}
          <g fill="none" stroke="#0a0a0a" strokeWidth={sw * 1.2}>
            <rect x={1.6} y={-3.1} width={12} height={2.75} rx={0.25} />
            {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={2.1 + i * 1.85} y={-2.8} width={1.5} height={1.1} />)}
            <circle cx={3.6} cy={-0.32} r={0.45} />
            <circle cx={11.4} cy={-0.32} r={0.45} />
          </g>
          {/* cutterhead, standing on the ground */}
          <g transform="translate(21 -5)">
            {WHEEL.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#0a0a0a" opacity={r > 0.1 ? 1 : 0.55} />)}
          </g>
          {/* the machine behind the wheel: 110 m */}
          <g fill="none" stroke="#0a0a0a" strokeWidth={sw * 1.2}>
            <rect x={26.5} y={-10} width={110} height={10} />
            {Array.from({ length: 21 }).map((_, i) => (
              <line key={i} x1={32 + i * 5} x2={32 + i * 5} y1={-10} y2={0} strokeOpacity=".25" />
            ))}
            <line x1={26.5} x2={136.5} y1={-5} y2={-5} strokeDasharray={`${w / 60} ${w / 200}`} strokeOpacity=".4" />
          </g>
          {/* dimension of the machine */}
          <g stroke="#0a0a0a" strokeWidth={sw}>
            <line x1={26.5} x2={136.5} y1={-12.5} y2={-12.5} />
            <line x1={26.5} x2={26.5} y1={-13.3} y2={-11.7} />
            <line x1={136.5} x2={136.5} y1={-13.3} y2={-11.7} />
          </g>
        </svg>
        <div className="absolute right-2 md:right-3 bottom-12 text-[12px] leading-[1.5] text-black/45 text-right max-w-[260px]">
          {t('Dimensions d’un tunnelier du Grand Paris Express (Tiphaine, ligne 15 Ouest). Tout est à la même échelle.', 'Dimensions of a Grand Paris Express TBM (Tiphaine, line 15 West). Everything is drawn to the same scale.')}
        </div>
      </div>
    </div>
  );
}
