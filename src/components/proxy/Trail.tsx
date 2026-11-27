'use client';

import { useRef, useState } from 'react';
import { useT } from '../i18n';
import { useSeen } from './Figures';
import { EASE, GM, INK, Kind, Mark, MUT, NR, OFF, T, Tail, useSize } from './marks';
import './proto.css';

const hm = (h: number, m: number) => h + m / 60;
const T0 = 8;
const T1 = 12.2;
const NOW = hm(10, 45);

/** Proxy's Wednesday morning, as its journal holds it: when, in which domain, with how much freedom, and until when it can be taken back. */
const ACTS: { t: number; lane: number; kind: Kind; until?: number; info?: number }[] = [
  { t: hm(8, 30), lane: 3, kind: 'alone' },
  { t: hm(8, 58), lane: 1, kind: 'told', until: hm(10, 58), info: 0 },
  { t: hm(9, 15), lane: 2, kind: 'alone', info: 1 },
  { t: hm(9, 42), lane: 3, kind: 'alone', until: hm(21, 42), info: 2 },
  { t: hm(10, 3), lane: 2, kind: 'proposed' },
  { t: hm(10, 12), lane: 0, kind: 'approved', info: 3 },
  { t: hm(10, 41), lane: 2, kind: 'approved', info: 4 },
  { t: hm(10, 41), lane: 1, kind: 'told', info: 5 },
  { t: hm(10, 41), lane: 3, kind: 'told', info: 5 },
];
const when = (t: number) => 250 + ((t - T0) / (NOW - T0)) * 1700;

function Chart({ vertical, on, active, pick, lanes, nowLabel, undoLabel }: { vertical: boolean; on: boolean; active: number; pick: (i: number) => void; lanes: string[]; nowLabel: string; undoLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, h] = useSize(ref);
  const D = vertical ? 28 : 34;
  // the day runs along the main axis, the four domains across it
  const m0 = vertical ? 74 : 176;
  const mEnd = vertical ? h : w;
  const m = (t: number) => m0 + ((t - T0) / (T1 - T0)) * (mEnd - m0);
  const c0 = vertical ? 46 : 40;
  const cEnd = vertical ? w - 6 : h - 44;
  const c = (lane: number) => c0 + ((cEnd - c0) / 4) * (lane + 0.5);
  const xy = (mm: number, cc: number) => (vertical ? { x: cc, y: mm } : { x: mm, y: cc });
  const p = 24;
  const rows = Math.max(0, Math.floor((cEnd - c0) / p));
  const cols = Math.max(0, Math.ceil((mEnd - m(NOW)) / p));
  const ready = w > 0 && h > 0;
  return (
    <div ref={ref} className="relative w-full" style={{ height: vertical ? 660 : 'clamp(400px, 54svh, 520px)' }}>
      {ready && (
        <>
          <svg width={w} height={h} className="absolute inset-0 block" aria-hidden>
            {/* what is not written yet */}
            <g style={{ opacity: on ? 1 : 0, transition: 'opacity 900ms ease 1900ms' }}>
              {Array.from({ length: rows * cols }, (_, k) => {
                const q = xy(m(NOW) + p * ((k % cols) + 0.75), c0 + ((cEnd - c0) / rows) * (Math.floor(k / cols) + 0.5));
                return <circle key={k} cx={q.x} cy={q.y} r={1.25} fill={OFF} />;
              })}
            </g>
            {lanes.map((_, i) => {
              const a = xy(m0, c(i));
              const b = xy(m(NOW), c(i));
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e5e7e9" />;
            })}
            {/* the undo windows */}
            {ACTS.filter((a) => a.until).map((a, k) => {
              const s = m(a.t) + D / 2 + 9;
              const e = m(a.until!);
              const n = Math.max(1, Math.floor((Math.min(e, mEnd + 14) - s) / 13));
              const tick = e < mEnd;
              const q = xy(e, c(a.lane));
              return (
                <g key={k}>
                  {Array.from({ length: n }, (_, i) => {
                    const o = xy(s + i * 13, c(a.lane));
                    return <circle key={i} cx={o.x} cy={o.y} r={6 - 4.3 * Math.min(1, (i * 13) / (e - s))} fill={INK} style={{ opacity: on ? 1 : 0, transition: `opacity 300ms ease ${when(a.t) + 200 + i * 16}ms` }} />;
                  })}
                  {tick && <line x1={vertical ? q.x - 8 : q.x} x2={vertical ? q.x + 8 : q.x} y1={vertical ? q.y : q.y - 8} y2={vertical ? q.y : q.y + 8} stroke={INK} strokeWidth={2} style={{ opacity: on ? 1 : 0, transition: 'opacity 400ms ease 2100ms' }} />}
                </g>
              );
            })}
            {[8, 9, 10, 11, 12].map((t) => {
              const q = vertical ? { x: 8, y: m(t) + 4 } : { x: m(t), y: h - 12 };
              return <text key={t} x={q.x} y={q.y} textAnchor={vertical ? 'start' : 'middle'} fontSize="10.5" fill={MUT} style={GM}>{String(t).padStart(2, '0')}h</text>;
            })}
          </svg>

          {/* now: it sweeps the morning once, and the journal fills in behind it */}
          <span aria-hidden className="absolute block motion-reduce:!transition-none" style={vertical ? { left: c0 - 14, right: 0, top: m0, height: 2, background: INK, transform: `translateY(${on ? m(NOW) - m0 : 0}px)`, transition: 'transform 1700ms linear 250ms' } : { top: 8, bottom: 26, left: m0, width: 2, background: INK, transform: `translateX(${on ? m(NOW) - m0 : 0}px)`, transition: 'transform 1700ms linear 250ms' }} />
          <p className="absolute whitespace-nowrap text-[10.5px] uppercase tracking-[0.06em]" style={{ ...GM, ...(vertical ? { left: c0 - 10, top: m(NOW) + 9 } : { left: m(NOW) + 10, top: 6 }), opacity: on ? 1 : 0, transition: 'opacity 500ms ease 2000ms' }}>{nowLabel}</p>

          {lanes.map((n, i) => (
            <p key={n} className={`absolute font-medium ${vertical ? 'w-[76px] -translate-x-1/2 text-center text-[11.5px] leading-[1.15]' : 'left-3 -translate-y-1/2 text-[15px]'}`} style={vertical ? { left: c(i), top: 26 } : { top: c(i) }}>{n}</p>
          ))}

          {ACTS.map((a, k) => {
            const q = xy(m(a.t), c(a.lane));
            const sel = a.info !== undefined && a.info === active;
            const base = { left: q.x, top: q.y, transform: `translate(-50%,-50%) scale(${on ? 1 : 0})`, transition: `transform 520ms cubic-bezier(.3,1.5,.5,1) ${when(a.t)}ms` } as const;
            const dot = <Mark kind={a.kind} d={D} style={{ outline: sel ? `1px solid ${INK}` : '1px solid transparent', outlineOffset: 5, transition: 'outline-color 250ms ease' }} />;
            return a.info === undefined ? (
              <span key={k} className="absolute block motion-reduce:!transition-none" style={base}>{dot}</span>
            ) : (
              <button key={k} type="button" aria-pressed={sel} onClick={() => pick(a.info!)} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(a.info!)} onFocus={() => pick(a.info!)} className="absolute block rounded-full p-2 motion-reduce:!transition-none" style={base}>
                {dot}
              </button>
            );
          })}

          {ACTS.filter((a) => a.until && m(a.until) < mEnd).map((a, k) => {
            const q = xy(m(a.until!), c(a.lane));
            return <p key={k} className="absolute whitespace-nowrap text-[10.5px]" style={{ ...GM, color: MUT, ...(vertical ? { left: q.x + 13, top: q.y - 7 } : { left: q.x + 9, top: q.y - 7 }), opacity: on ? 1 : 0, transition: 'opacity 500ms ease 2150ms' }}>{undoLabel} 10:58</p>;
          })}
          <p className="absolute whitespace-nowrap text-[10.5px]" style={{ ...GM, color: MUT, ...(vertical ? { left: c(3) - 62, bottom: 8 } : { right: 12, top: c(3) - 30 }), opacity: on ? 1 : 0, transition: 'opacity 500ms ease 2150ms' }}>→ 21:42</p>
        </>
      )}
    </div>
  );
}

/**
 * The journal, as a score: every action is a note in its domain's line, written the way Proxy was allowed to play it,
 * and it trails dots for as long as Léa can still take it back.
 */
export function Trail() {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLElement>(0.25);
  const [active, setActive] = useState(0);
  const lanes = [t('Courriels', 'Email'), t('Agenda', 'Calendar'), t('Achats et voyages', 'Purchases and travel'), t('Fichiers', 'Files')];
  const info = [
    { time: '08:58', what: t('Point avec Nadia décalé de 10 h à 11 h.', 'Catch-up with Nadia moved from 10 to 11.'), cause: t('Déclencheur : courriel de Nadia, 08:51, « on peut décaler à 11 h ? »', 'Trigger: email from Nadia, 08:51, “can we move it to 11?”'), kind: 'told' as Kind, state: t('fait, puis prévenu', 'done, then told'), undo: t('annulable jusqu’à 10:58', 'undoable until 10:58') },
    { time: '09:15', what: t('Facture Adobe payée, 59,99 €.', 'Adobe invoice paid, €59.99.'), cause: t('Déclencheur : abonnement connu, sous 60 €', 'Trigger: known subscription, under €60'), kind: 'alone' as Kind, state: t('fait seul', 'done alone'), undo: t('reçu rangé', 'receipt filed') },
    { time: '09:42', what: t('14 factures classées.', '14 invoices filed.'), cause: t('Déclencheur : la règle « Fichiers : agir seul »', 'Trigger: the rule “Files: act alone”'), kind: 'alone' as Kind, state: t('fait seul', 'done alone'), undo: t('annulable jusqu’à 21:42', 'undoable until 21:42') },
    { time: '10:12', what: t('Devis v3 envoyé à Nadia.', 'Quote v3 sent to Nadia.'), cause: t('Déclencheur : un message de Léa. Proxy a demandé à quelle Nadia avant d’envoyer.', 'Trigger: a message from Léa. Proxy asked which Nadia before sending.'), kind: 'approved' as Kind, state: t('validé par Léa', 'approved by Léa'), undo: t('envoyé', 'sent') },
    { time: '10:41', what: t('Train Paris → Lyon réservé, 89 €.', 'Paris → Lyon train booked, €89.'), cause: t('Déclencheur : la demande de 10:40', 'Trigger: the 10:40 request'), kind: 'approved' as Kind, state: t('validé par Léa', 'approved by Léa'), undo: t('remboursable', 'refundable') },
    { time: '10:41', what: t('Trajet ajouté à l’agenda, billet rangé.', 'Trip added to the calendar, ticket filed.'), cause: t('Déclencheur : la suite de la validation de Léa', 'Trigger: follows Léa’s approval'), kind: 'told' as Kind, state: t('fait, puis prévenu', 'done, then told'), undo: t('annulable jusqu’à 11:11', 'undoable until 11:11') },
  ];
  const cur = info[active];
  const chart = (vertical: boolean) => <Chart vertical={vertical} on={on} active={active} pick={setActive} lanes={lanes} nowLabel={t('Maintenant 10:45', 'Now 10:45')} undoLabel={t('annulable jusqu’à', 'undoable until')} />;
  const legend: [Kind, string][] = [['alone', t('fait seul', 'done alone')], ['told', t('fait, puis prévenu', 'done, then told')], ['approved', t('validé par Léa', 'approved by Léa')], ['proposed', t('proposé, en attente', 'proposed, waiting')]];
  return (
    <section ref={ref} aria-label={t('Le journal de Proxy : la matinée du mercredi, action par action', 'Proxy’s log: Wednesday morning, action by action')} className="px-moment relative w-full bg-white" style={{ color: INK }}>
      <div className="hidden md:block">{chart(false)}</div>
      <div className="md:hidden">{chart(true)}</div>

      {/* the note under the pointer, read in full: what, why, and what can still be undone */}
      <div className="border-t px-3 pb-2 pt-5 md:pt-6" style={{ borderColor: INK }} aria-live="polite">
        <div key={active} className="px-read grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-12 md:items-end">
          <p className="text-[40px] leading-none tracking-[-0.02em] md:col-span-2 md:text-[54px] xl:text-[64px]" style={GM}>{cur.time}</p>
          <p className="text-[30px] leading-[1.06] md:col-span-6 md:col-start-4 md:text-[40px] xl:text-[46px]" style={{ ...NR, textWrap: 'balance' }}>{cur.what}</p>
          <div className="text-[13px] leading-[1.5] md:col-span-3 md:col-start-10">
            <p className="flex items-center gap-2 font-medium"><Mark kind={cur.kind} d={12} />{cur.state} · {cur.undo}</p>
            <p className="mt-1 text-black/60">{cur.cause}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-3 pt-6 text-[12.5px] text-black/60 md:pt-8">
        {legend.map(([k, n]) => (
          <span key={k} className="flex items-center gap-2"><Mark kind={k} d={11} />{n}</span>
        ))}
        <span className="flex items-center gap-2"><Tail n={5} />{t('encore annulable', 'still undoable')}</span>
        <span className="ml-auto hidden text-black/40 md:block">{t('Survoler une action pour la lire', 'Hover an action to read it')}</span>
        <span className="w-full text-black/40 md:hidden">{t('Toucher une action pour la lire', 'Tap an action to read it')}</span>
      </div>
      <span className="hidden">{EASE}</span>
    </section>
  );
}
