'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useT } from '@/components/i18n';
import DotText from '@/components/dot/DotText';

/**
 * The opening of Colosse: the cutterhead, drawn in dots, three layers turning at their own speed like a machine.
 * Scrolling drives it: the wheel turns, comes closer, and the three numbers of the machine come up one after the other.
 * Numbers from the case: about ten metres wide, over 1,600 tonnes, about a dozen metres a day.
 */
const R = 100;
type D = { x: number; y: number; r: number; o: number; ring?: boolean };
const polar = (a: number, d: number) => ({ x: Math.cos(a) * d, y: Math.sin(a) * d });

function shield(): D[] {
  const out: D[] = [];
  for (let k = 0; k < 180; k++) out.push({ ...polar((k / 180) * Math.PI * 2, R), r: 0.9, o: 0.45 });
  for (let k = 0; k < 24; k++) out.push({ ...polar((k / 24) * Math.PI * 2 + 0.07, R + 3.4), r: 1.5, o: 0.9 });
  for (let k = 0; k < 140; k++) out.push({ ...polar((k / 140) * Math.PI * 2 + 0.02, R - 5.5), r: 0.7, o: 0.28 });
  return out;
}

function head(): D[] {
  const out: D[] = [];
  for (let s = 0; s < 6; s++) {
    const a = (s / 6) * Math.PI * 2 + 0.26;
    const nx = -Math.sin(a), ny = Math.cos(a);
    // the spoke: disc cutters (a full dot inside a ring), alternating sides
    for (let k = 0; k < 11; k++) {
      const d = 20 + k * 6.9;
      const side = k % 2 ? 3.6 : -3.6;
      out.push({ x: Math.cos(a) * d + nx * side, y: Math.sin(a) * d + ny * side, r: 2.6, o: 1, ring: k % 3 === 0 });
      out.push({ x: Math.cos(a) * d - nx * side * 1.8, y: Math.sin(a) * d - ny * side * 1.8, r: 0.8, o: 0.35 });
    }
    // the bucket openings between spokes, near the rim
    const b = a + Math.PI / 6;
    for (let k = 0; k < 9; k++) {
      const t = (k - 4) / 4;
      out.push({ ...polar(b + t * 0.16, 84), r: 1.1, o: 0.7 });
      out.push({ ...polar(b + t * 0.16, 74), r: 1.1, o: 0.7 });
    }
    for (let k = 0; k < 3; k++) {
      out.push({ ...polar(b - 0.16, 76.5 + k * 2.5), r: 1.1, o: 0.7 });
      out.push({ ...polar(b + 0.16, 76.5 + k * 2.5), r: 1.1, o: 0.7 });
    }
    // short arm between spokes
    for (let k = 0; k < 5; k++) out.push({ ...polar(b, 40 + k * 6.2), r: 1.8, o: 0.85 });
  }
  return out;
}

function hub(): D[] {
  const out: D[] = [];
  for (let k = 0; k < 22; k++) out.push({ ...polar((k / 22) * Math.PI * 2, 13), r: 1.2, o: 0.65 });
  for (let k = 0; k < 8; k++) out.push({ ...polar((k / 8) * Math.PI * 2 + 0.2, 8), r: 1.6, o: 1 });
  out.push({ x: 0, y: 0, r: 4.4, o: 1 });
  return out;
}

const SHIELD = shield();
const HEAD = head();
const HUB = hub();

const Dots = ({ list }: { list: D[] }) => (
  <>
    {list.map((d, i) =>
      d.ring ? (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r={d.r + 1.4} fill="none" stroke="#0a0a0a" strokeWidth={0.55} opacity={0.55} />
          <circle cx={d.x} cy={d.y} r={d.r} fill="#0a0a0a" opacity={d.o} />
        </g>
      ) : (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#0a0a0a" opacity={d.o} />
      )
    )}
  </>
);

export default function Wheel() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6 });
  const rHead = useTransform(p, [0, 1], [0, still ? 0 : 230]);
  const rShield = useTransform(p, [0, 1], [0, still ? 0 : -40]);
  const rHub = useTransform(p, [0, 1], [0, still ? 0 : 520]);
  const scale = useTransform(p, [0, 1], [1, still ? 1 : 1.28]);
  const x = useTransform(p, [0, 1], ['0vw', still ? '0vw' : '-9vw']);
  const grid = useTransform(p, [0, 1], ['0px', still ? '0px' : '-120px']);
  const [step, setStep] = useState(still ? 3 : 0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (still) return;
    setStep(v > 0.62 ? 3 : v > 0.38 ? 2 : v > 0.14 ? 1 : 0);
  });

  const facts = [
    { v: '≈ 10 m', k: t('de diamètre, la roue de coupe', 'across, the cutterhead') },
    { v: '1 600 t', k: t('et plus, la machine entière', 'and more, the whole machine') },
    { v: '≈ 12 m', k: t('creusés par jour sous Paris', 'dug a day under Paris') },
  ];

  return (
    <section ref={ref} className="relative h-[170vh] md:h-[210vh]" aria-label={t('Colosse, la roue de coupe du tunnelier', 'Colosse, the cutterhead of the tunnel boring machine')}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 [background-image:radial-gradient(circle,rgba(10,10,10,.10)_1px,transparent_1.6px)] [background-size:20px_20px]"
          style={{ backgroundPositionY: grid }}
        />
        <motion.div
          aria-hidden
          className="absolute right-[-52vw] top-[44%] h-[118vw] w-[118vw] md:right-[-12vw] md:top-1/2 md:h-[78vw] md:w-[78vw]"
          style={{ scale, x, y: '-50%' }}
        >
          <svg viewBox="-106 -106 212 212" className="h-full w-full">
            <motion.g style={{ rotate: rShield }}>
              <Dots list={SHIELD} />
            </motion.g>
            <motion.g style={{ rotate: rHead }}>
              <motion.g animate={still ? undefined : { rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}>
                <Dots list={HEAD} />
              </motion.g>
            </motion.g>
            <motion.g style={{ rotate: rHub }}>
              <Dots list={HUB} />
            </motion.g>
          </svg>
        </motion.div>

        <div className="absolute left-2 top-24 text-[14px] leading-[1.6] md:left-3 md:top-[22vh] md:text-[13px]">
          <p className="font-medium">Colosse</p>
          <p className="text-black/55">
            <span className="bg-white">{t('Poste de pilotage d’un tunnelier, 2026', 'Cockpit of a tunnel boring machine, 2026')}</span>
          </p>
        </div>

        <dl className="absolute bottom-24 left-2 space-y-5 text-[14px] leading-[1.6] md:bottom-[14vh] md:left-3 md:text-[13px]">
          {facts.map((f, i) => (
            <div key={f.v} className="transition-opacity duration-500" style={{ opacity: step > i ? 1 : 0 }}>
              <dt className="inline-block bg-white pr-1 text-[26px] font-medium leading-none tracking-[-0.03em] tabular-nums md:text-[2.1vw]">
                {step > i ? <DotText key={`${f.v}-on`} text={f.v} play="mount" /> : f.v}
              </dt>
              <dd className="mt-1 text-black/55">
                <span className="bg-white">{f.k}</span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="absolute bottom-24 right-2 text-[14px] text-black/55 transition-opacity duration-500 md:bottom-[14vh] md:right-3 md:text-[13px]" style={{ opacity: step === 0 ? 1 : 0 }}>
          {t('Descendre ↓', 'Go down ↓')}
        </p>
      </div>
    </section>
  );
}
