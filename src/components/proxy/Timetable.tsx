'use client';

import { useRef } from 'react';
import { useT } from '../i18n';
import { useSeen } from './Figures';
import { GM, GREY, INK, MUT, T, WARN, useSize } from './marks';
import './proto.css';

const hm = (h: number, m: number) => h + m / 60;
const T0 = 6;
const SPAN = 5.25;
const RDV = 10.5;

/**
 * What Proxy compared before asking, drawn the way railways have drawn their timetables since Marey:
 * time runs one way, the line the other, and each train is a stroke between the two stations.
 */
export function Timetable() {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  const wide = useRef<HTMLDivElement>(null);
  const tall = useRef<HTMLDivElement>(null);
  const [w, h] = useSize(wide);
  const [vw, vh] = useSize(tall);
  const trains = [
    { dep: hm(6, 58), arr: hm(8, 55), price: t('64 €', '€64'), d: t('6 h 58', '6:58'), a: t('8 h 55', '8:55'), note: t('1 h 35 d’attente sur place', 'a 1 h 35 wait on arrival') },
    { dep: hm(7, 56), arr: hm(9, 53), price: t('89 €', '€89'), d: t('7 h 56', '7:56'), a: t('9 h 53', '9:53'), note: t('arrive avant le rendez-vous', 'arrives before the meeting'), pick: true },
    { dep: hm(8, 56), arr: hm(10, 53), price: t('102 €', '€102'), d: t('8 h 56', '8:56'), a: t('10 h 53', '10:53'), note: t('trop tard pour 10 h 30', 'too late for 10:30'), late: true },
  ];
  const rdv = t('RDV 10 h 30', 'Meeting 10:30');
  const tone = (tr: (typeof trains)[number]) => (tr.pick ? INK : tr.late ? WARN : GREY);
  const draw = (len: number, ms: number) => ({ strokeDasharray: len, strokeDashoffset: on ? 0 : len, transition: `stroke-dashoffset 1100ms cubic-bezier(.65,0,.2,1) ${ms}ms` });
  const show = (ms: number) => ({ opacity: on ? 1 : 0, transition: `opacity 600ms ease ${ms}ms` });

  // wide: time runs left to right, Paris above, Lyon below
  const L = 118;
  const x = (tt: number) => L + ((tt - T0) / SPAN) * (w - L - 16);
  const yP = 92;
  const yL = h - 96;
  // narrow: time runs down, Paris on the left, Lyon further right
  const top = 78;
  const y = (tt: number) => top + ((tt - T0) / SPAN) * (vh - top - 14);
  const xP = 92;
  const xL = vw * 0.6;

  return (
    <figure ref={ref} aria-label={t('Les trois trains comparés par Proxy, entre Paris et Lyon', 'The three trains Proxy compared, between Paris and Lyon')} className="px-moment text-[#0a0a0a]">
      <div ref={wide} className="relative hidden w-full md:block" style={{ height: 'clamp(420px, 52svh, 500px)' }}>
        {w > 0 && (
          <>
            <svg width={w} height={h} className="absolute inset-0 block" aria-hidden>
              {[6, 7, 8, 9, 10, 11].map((tt) => (
                <g key={tt}>
                  <line x1={x(tt)} x2={x(tt)} y1={yP - 22} y2={yL + 22} stroke="#eceef0" />
                  <text x={x(tt)} y={h - 8} textAnchor="middle" fontSize="10.5" fill={MUT} style={GM}>{tt} h</text>
                </g>
              ))}
              <line x1={0} x2={w} y1={yP} y2={yP} stroke={INK} strokeWidth={1.25} />
              <line x1={0} x2={w} y1={yL} y2={yL} stroke={INK} strokeWidth={1.25} />
              <line x1={x(RDV)} x2={x(RDV)} y1={yP - 40} y2={yL + 40} stroke={INK} strokeWidth={1.4} strokeDasharray="0.1 5.5" strokeLinecap="round" style={show(1500)} />
              {/* the wait, on the platform */}
              <g style={show(1700)}>
                {trains.filter((tr) => !tr.late).map((tr) => {
                  const n = Math.max(0, Math.round((x(RDV) - x(tr.arr) - 40) / 12));
                  return Array.from({ length: n }, (_, i) => <circle key={tr.d + i} cx={x(tr.arr) + 22 + i * 12} cy={yL} r={2.6} fill="#fff" stroke={tr.pick ? INK : GREY} strokeWidth={1.2} />);
                })}
              </g>
              {trains.map((tr, k) => {
                const len = Math.hypot(x(tr.arr) - x(tr.dep), yL - yP);
                return (
                  <g key={tr.d}>
                    {tr.pick ? (
                      <line x1={x(tr.dep)} y1={yP} x2={x(tr.arr)} y2={yL} stroke={INK} strokeWidth={5} style={draw(len, 500)} />
                    ) : (
                      <line x1={x(tr.dep)} y1={yP} x2={x(tr.arr)} y2={yL} stroke={tone(tr)} strokeWidth={3} strokeDasharray="0.1 10.5" strokeLinecap="round" style={show(250 + k * 160)} />
                    )}
                    <circle cx={x(tr.dep)} cy={yP} r={tr.pick ? 10 : 6} fill={tr.pick ? INK : '#fff'} stroke={tone(tr)} strokeWidth={2} style={show(200 + k * 160)} />
                    <circle cx={x(tr.arr)} cy={yL} r={tr.pick ? 10 : 6} fill={tr.pick ? INK : '#fff'} stroke={tone(tr)} strokeWidth={2} style={show(tr.pick ? 1500 : 500 + k * 160)} />
                  </g>
                );
              })}
              <g style={show(1500)}>
                <circle cx={x(RDV)} cy={yL} r={14} fill="#fff" stroke={INK} strokeWidth={2.5} />
                <circle cx={x(RDV)} cy={yL} r={4.2} fill={INK} />
              </g>
            </svg>
            <p className="absolute left-0 text-[32px] font-medium leading-none tracking-[-0.03em]" style={{ top: yP - 50 }}>Paris</p>
            <p className="absolute left-0 text-[32px] font-medium leading-none tracking-[-0.03em]" style={{ top: yL + 18 }}>Lyon</p>
            {trains.map((tr, k) => (
              <div key={tr.d} style={show(300 + k * 160)}>
                <div className="absolute -translate-x-1/2 text-center" style={{ left: x(tr.dep), top: yP - (tr.pick ? 78 : 56) }}>
                  <p className={tr.pick ? 'text-[32px] font-medium leading-none tracking-[-0.03em]' : 'text-[16px] font-medium leading-none'} style={{ color: tr.pick ? INK : tr.late ? WARN : MUT }}>{tr.price}</p>
                  <p className="mt-[7px] text-[10.5px]" style={{ ...GM, color: tr.pick ? INK : MUT }}>{tr.d}</p>
                </div>
                <div className="absolute -translate-x-1/2 whitespace-nowrap text-center" style={{ left: x(tr.arr), top: yL + 22 }}>
                  <p className="text-[10.5px]" style={{ ...GM, color: tr.pick ? INK : tr.late ? WARN : MUT }}>{tr.a}</p>
                  <p className="mt-1 text-[12.5px]" style={{ color: tr.pick ? INK : tr.late ? WARN : MUT, fontWeight: tr.pick ? 500 : 400 }}>{tr.note}</p>
                </div>
              </div>
            ))}
            <p className="absolute -translate-x-1/2 whitespace-nowrap text-[10.5px] uppercase tracking-[0.08em]" style={{ left: x(RDV), top: yP - 62, ...GM, ...show(1500) }}>{rdv}</p>
          </>
        )}
      </div>

      <div ref={tall} className="relative w-full md:hidden" style={{ height: 600 }}>
        {vw > 0 && (
          <>
            <svg width={vw} height={vh} className="absolute inset-0 block" aria-hidden>
              {[6, 7, 8, 9, 10, 11].map((tt) => (
                <g key={tt}>
                  <line y1={y(tt)} y2={y(tt)} x1={xP - 18} x2={xL + 18} stroke="#eceef0" />
                  <text x={0} y={y(tt) + 4} fontSize="10.5" fill={MUT} style={GM}>{tt} h</text>
                </g>
              ))}
              <line y1={top - 14} y2={vh} x1={xP} x2={xP} stroke={INK} strokeWidth={1.25} />
              <line y1={top - 14} y2={vh} x1={xL} x2={xL} stroke={INK} strokeWidth={1.25} />
              <line y1={y(RDV)} y2={y(RDV)} x1={xP - 30} x2={vw} stroke={INK} strokeWidth={1.4} strokeDasharray="0.1 5.5" strokeLinecap="round" style={show(1500)} />
              <g style={show(1700)}>
                {trains.filter((tr) => !tr.late).map((tr) => {
                  const n = Math.max(0, Math.round((y(RDV) - y(tr.arr) - 36) / 11));
                  return Array.from({ length: n }, (_, i) => <circle key={tr.d + i} cy={y(tr.arr) + 20 + i * 11} cx={xL} r={2.4} fill="#fff" stroke={tr.pick ? INK : GREY} strokeWidth={1.2} />);
                })}
              </g>
              {trains.map((tr, k) => {
                const len = Math.hypot(xL - xP, y(tr.arr) - y(tr.dep));
                return (
                  <g key={tr.d}>
                    {tr.pick ? (
                      <line x1={xP} y1={y(tr.dep)} x2={xL} y2={y(tr.arr)} stroke={INK} strokeWidth={4.5} style={draw(len, 500)} />
                    ) : (
                      <line x1={xP} y1={y(tr.dep)} x2={xL} y2={y(tr.arr)} stroke={tone(tr)} strokeWidth={2.8} strokeDasharray="0.1 9.5" strokeLinecap="round" style={show(250 + k * 160)} />
                    )}
                    <circle cx={xP} cy={y(tr.dep)} r={tr.pick ? 9 : 5.5} fill={tr.pick ? INK : '#fff'} stroke={tone(tr)} strokeWidth={2} style={show(200 + k * 160)} />
                    <circle cx={xL} cy={y(tr.arr)} r={tr.pick ? 9 : 5.5} fill={tr.pick ? INK : '#fff'} stroke={tone(tr)} strokeWidth={2} style={show(tr.pick ? 1500 : 500 + k * 160)} />
                  </g>
                );
              })}
              <g style={show(1500)}>
                <circle cx={xL} cy={y(RDV)} r={12} fill="#fff" stroke={INK} strokeWidth={2.5} />
                <circle cx={xL} cy={y(RDV)} r={3.8} fill={INK} />
              </g>
            </svg>
            <p className="absolute -translate-x-1/2 text-[24px] font-medium leading-none tracking-[-0.03em]" style={{ left: xP, top: 24 }}>Paris</p>
            <p className="absolute -translate-x-1/2 text-[24px] font-medium leading-none tracking-[-0.03em]" style={{ left: xL, top: 24 }}>Lyon</p>
            {trains.map((tr, k) => (
              <div key={tr.d} style={show(300 + k * 160)}>
                <div className="absolute text-right" style={{ right: vw - xP + 16, top: y(tr.dep) - (tr.pick ? 30 : 20) }}>
                  <p className={tr.pick ? 'text-[24px] font-medium leading-none tracking-[-0.03em]' : 'text-[14px] font-medium leading-none'} style={{ color: tr.pick ? INK : tr.late ? WARN : MUT }}>{tr.price}</p>
                  <p className="mt-[5px] text-[10.5px]" style={{ ...GM, color: tr.pick ? INK : MUT }}>{tr.d}</p>
                </div>
                <div className="absolute" style={{ left: xL + 18, right: 0, top: y(tr.arr) - 8 }}>
                  <p className="text-[10.5px]" style={{ ...GM, color: tr.pick ? INK : tr.late ? WARN : MUT }}>{tr.a}</p>
                  <p className="mt-[2px] text-[12.5px] leading-[1.25]" style={{ color: tr.pick ? INK : tr.late ? WARN : MUT, fontWeight: tr.pick ? 500 : 400 }}>{tr.note}</p>
                </div>
              </div>
            ))}
            <p className="absolute whitespace-nowrap bg-white pr-2 text-[10.5px] uppercase tracking-[0.08em]" style={{ left: 0, top: y(RDV) - 7, ...GM, ...show(1500) }}>{rdv}</p>
          </>
        )}
      </div>
    </figure>
  );
}
