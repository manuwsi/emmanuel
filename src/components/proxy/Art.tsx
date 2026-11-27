'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n';

const INK = '#0a0a0a';
const GREY = '#b9bdc3';
const WARN = '#c9461f';

type Kind = 'alone' | 'tell' | 'approved' | 'pending' | 'stop';
type Dot = { x: number; y: number; k: Kind; r?: number };

/** Small deterministic random, so the picture is the same on every visit. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on] as const;
}

/* ---------------------------------------------------------------------------------------------- */

const X0 = 190;
const X1 = 1580;
const DAY = (X1 - X0) / 5;
const ROW0 = 96;
const ROWH = 96;
const hx = (day: number, hour: number) => X0 + day * DAY + ((hour - 8) / 11) * DAY * 0.92 + DAY * 0.04;

/**
 * A week of Léa's life with Proxy, one dot per action, in the language of Proxy's own log:
 * solid = done alone, thick ring = done then told, grey = approved by Léa, thin ring = waiting, orange = the pause.
 * An illustration, not data: it shows the shape of trust, domain by domain.
 */
function weekDots(): Dot[] {
  const r = rng(26);
  const rows: { k: Kind[]; per: [number, number] }[] = [
    { k: ['tell', 'tell', 'tell', 'approved'], per: [2, 4] }, // calendar
    { k: ['alone'], per: [4, 7] }, // files
    { k: ['approved', 'alone', 'approved'], per: [1, 2] }, // purchases
    { k: ['approved', 'approved', 'pending'], per: [2, 4] }, // emails to new contacts
    { k: ['pending'], per: [0, 1] }, // transfers
  ];
  const out: Dot[] = [];
  rows.forEach((row, ri) => {
    for (let d = 0; d < 5; d++) {
      const n = row.per[0] + Math.floor(r() * (row.per[1] - row.per[0] + 1));
      const hours = Array.from({ length: n }, () => 8.3 + r() * 10.2).sort((a, b) => a - b);
      let last = -99;
      let flip = 1;
      hours.forEach((h) => {
        // Wednesday morning is drawn by hand below
        if (d === 2 && h > 9 && h < 11.6) return;
        const x = hx(d, h);
        let y = ROW0 + ri * ROWH;
        if (x - last < 24) {
          y += 15 * flip;
          flip = -flip;
        } else last = x;
        out.push({ x, y, k: row.k[Math.floor(r() * row.k.length)] });
      });
    }
  });
  // Wednesday, as told in the case
  const y = (ri: number) => ROW0 + ri * ROWH;
  for (let i = 0; i < 14; i++) out.push({ x: hx(2, 9.7) - 21 + (i % 7) * 7, y: y(1) - 4 + Math.floor(i / 7) * 8, k: 'alone', r: 2.6 }); // 09:42, 14 invoices filed
  out.push({ x: hx(2, 10.2), y: y(3), k: 'approved' }); // 10:12, the quote to Nadia
  out.push({ x: hx(2, 10.67), y: y(2), k: 'approved' }); // 10:40, the €89 train
  out.push({ x: hx(2, 10.68), y: y(0), k: 'tell' }); // 10:41, added to the calendar
  out.push({ x: hx(2, 11.28), y: y(4), k: 'stop' }); // 11:17, the pause on payments
  return out;
}

function Glyph({ k, r = 9, cx, cy, style }: { k: Kind; r?: number; cx: number; cy: number; style?: React.CSSProperties }) {
  if (k === 'alone') return <circle cx={cx} cy={cy} r={r} fill={INK} style={style} />;
  if (k === 'approved') return <circle cx={cx} cy={cy} r={r} fill={GREY} style={style} />;
  if (k === 'tell') return <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke={INK} strokeWidth={4} style={style} />;
  if (k === 'pending') return <circle cx={cx} cy={cy} r={r - 0.75} fill="none" stroke={INK} strokeWidth={1.5} style={style} />;
  return (
    <g style={style}>
      <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={WARN} strokeWidth={1} opacity={0.5} />
      <circle cx={cx} cy={cy} r={r} fill={WARN} />
    </g>
  );
}

export function WeekArt() {
  const t = useT();
  const [ref, on] = useInView<HTMLDivElement>(0.15);
  // on a phone, the picture keeps Monday to Wednesday (the day told in the case) at a readable size
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const f = () => setPhone(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  const FS = phone ? 30 : 15;
  const K = phone ? 1.5 : 1;
  const dots = useRef(weekDots()).current;
  const domains = [t('Agenda', 'Calendar'), t('Fichiers', 'Files'), t('Achats', 'Purchases'), t('Courriels', 'Emails'), t('Virements', 'Transfers')];
  const days = [t('Lun.', 'Mon'), t('Mar.', 'Tue'), t('Mer.', 'Wed'), t('Jeu.', 'Thu'), t('Ven.', 'Fri')];
  const SWEEP = 1.8;
  const legend: [Kind, string][] = [
    ['alone', t('fait seul', 'done alone')],
    ['tell', t('fait, puis prévenu', 'done, then told')],
    ['approved', t('validé par Léa', 'approved by Léa')],
    ['pending', t('en attente', 'waiting')],
    ['stop', t('pause', 'pause')],
  ];

  return (
    <figure ref={ref}>
      <svg viewBox={phone ? '0 0 1010 590' : '0 0 1600 590'} className="block h-auto w-full" role="img" aria-label={t('Une semaine de Léa avec Proxy, un point par action', 'A week of Léa with Proxy, one dot per action')}>
        {/* days */}
        {days.map((d, i) => (
          <g key={d}>
            <line x1={X0 + i * DAY} x2={X0 + i * DAY} y1={36} y2={560} stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
            <text x={X0 + i * DAY + 8} y={30} fontSize={FS} fill="rgba(0,0,0,0.45)" fontFamily="var(--font-general-sans), Inter, sans-serif">
              {d}
            </text>
          </g>
        ))}
        <line x1={X1} x2={X1} y1={36} y2={560} stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
        {/* domains */}
        {domains.map((d, i) => (
          <g key={d}>
            <line x1={X0} x2={X1} y1={ROW0 + i * ROWH} y2={ROW0 + i * ROWH} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
            <text x={0} y={ROW0 + i * ROWH + 5} fontSize={FS} fill={INK} fontFamily="var(--font-general-sans), Inter, sans-serif">
              {d}
            </text>
          </g>
        ))}
        {/* the actions, appearing as the week goes by */}
        {dots.map((p, i) => (
          <Glyph
            key={i}
            k={p.k}
            r={(p.r ?? 9) * K}
            cx={p.x}
            cy={p.y}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              transform: on ? 'scale(1)' : 'scale(0)',
              opacity: on ? 1 : 0,
              transition: `transform 520ms cubic-bezier(.22,1,.36,1) ${((p.x - X0) / (X1 - X0)) * SWEEP}s, opacity 200ms ${((p.x - X0) / (X1 - X0)) * SWEEP}s`,
            }}
          />
        ))}
        {/* the present, sweeping once */}
        <line
          x1={X0}
          x2={X0}
          y1={40}
          y2={560}
          stroke={INK}
          strokeWidth={1.2}
          style={{
            transform: on ? `translateX(${X1 - X0}px)` : 'none',
            opacity: on ? 0 : 1,
            transition: `transform ${SWEEP}s linear, opacity 400ms ease ${SWEEP}s`,
          }}
        />
      </svg>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] leading-[1.6] text-black/45">
        <span className="text-black/45">{t('Une semaine de Léa avec Proxy, un point par action. Illustration.', 'A week of Léa with Proxy, one dot per action. Illustration.')}</span>
        {legend.map(([k, l]) => (
          <span key={k} className="inline-flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 44 44" aria-hidden>
              <Glyph k={k} cx={22} cy={22} r={k === 'stop' ? 7 : 9} />
            </svg>
            {l}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Trust, domain by domain. On day one every domain sits at "Proxy asks for everything";
 * when the line comes on screen, each one slides to where Léa has set it three weeks later.
 */
export function TrustLine() {
  const t = useT();
  const [ref, on] = useInView<HTMLDivElement>(0.4);
  const doms = [
    { name: t('Virements', 'Transfers'), x: 4 },
    { name: t('Courriels à un nouveau contact', 'Emails to a new contact'), x: 22 },
    { name: t('Achats au-dessus de 60 €', 'Purchases over €60'), x: 40 },
    { name: t('Agenda', 'Calendar'), x: 68 },
    { name: t('Classer des fichiers', 'Filing documents'), x: 94 },
  ];
  return (
    <figure ref={ref}>
      <div className="flex justify-between text-[15px] leading-[1.6]">
        <span>{t('Proxy demande tout', 'Proxy asks for everything')}</span>
        <span className="hidden tabular-nums text-black/45 md:inline">{on ? t("Trois semaines plus tard", "Three weeks later") : t("Premier jour", "Day one")}</span>
        <span>{t('Proxy agit en silence', 'Proxy acts silently')}</span>
      </div>
      <div className="relative mt-8 h-[190px] md:h-[150px]">
        <div className="absolute left-0 right-0 top-[14px] h-px bg-black/25" />
        <div className="absolute left-0 top-[8px] h-[13px] w-px bg-black/40" />
        <div className="absolute right-0 top-[8px] h-[13px] w-px bg-black/40" />
        {doms.map((d, i) => (
          <div
            key={d.name}
            className="absolute top-0"
            style={{
              left: `${on ? d.x : 1.5}%`,
              transform: 'translateX(-50%)',
              transition: `left 1.5s cubic-bezier(.65,0,.35,1) ${0.35 + i * 0.12}s`,
            }}
          >
            <span className="mx-auto block h-[29px] w-[29px] rounded-full border-[7px] border-white" style={{ background: INK }} />
            <span
              className="absolute w-[110px] text-[13px] leading-snug text-black/60 transition-opacity duration-500 md:w-[170px] md:text-[15px]"
              style={{
                top: i % 2 ? 92 : 44,
                left: i === 0 ? -4 : i === doms.length - 1 ? 'auto' : '50%',
                right: i === doms.length - 1 ? -4 : 'auto',
                transform: i === 0 || i === doms.length - 1 ? 'none' : 'translateX(-50%)',
                textAlign: i === 0 ? 'left' : i === doms.length - 1 ? 'right' : 'center',
                opacity: on ? 1 : 0,
                transitionDelay: `${1.6 + i * 0.12}s`,
              }}
            >
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
