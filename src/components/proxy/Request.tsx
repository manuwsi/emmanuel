'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { LivePresence } from './Live';
import { useSeen } from './Figures';
import './proto.css';

type T = <V,>(fr: V, en: V) => V;
type Phase = 'ask' | 'running' | 'done' | 'declined';

const INK = '#121212';
const WARN = '#c9461f';
const MUT = '#6c7176';
const HAIR = '#dcdfe2';
const GM: CSSProperties = { fontFamily: 'PXGM, ui-monospace, monospace' };
const NR: CSSProperties = { fontFamily: 'PXNR, Georgia, serif', letterSpacing: '-0.015em' };
const EASE = 'cubic-bezier(.65,0,.2,1)';
/** Where the page is cut, across its width. */
const SEAM = 57;
/** The four steps along the line; the payment is the last one before the cut. */
const AT = [0, 40, 62.5, 81];

/**
 * The train request, as the page itself: white while everything can still be taken back,
 * ink once the money has left. Léa's answer plays the rest — approve, and Proxy crosses the line;
 * decline, and the other side goes away.
 */
export function Request() {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLElement>(0.4);
  const [phase, setPhase] = useState<Phase>('ask');
  const [step, setStep] = useState(0);
  const [rule, setRule] = useState(false);
  const [left, setLeft] = useState(30);
  const [undone, setUndone] = useState(false);
  const [refunded, setRefunded] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);
  useEffect(() => {
    if (phase !== 'done' || undone || left <= 0) return;
    const id = setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, left, undone]);

  const approve = () => {
    setPhase('running');
    setStep(0);
    [1, 2, 3].forEach((n, k) => timers.current.push(setTimeout(() => setStep(n), 520 + 780 * k)));
    timers.current.push(setTimeout(() => setPhase('done'), 520 + 780 * 2 + 700));
  };
  const reset = () => {
    clear();
    setPhase('ask');
    setStep(0);
    setLeft(30);
    setUndone(false);
    setRefunded(false);
    setRule(false);
  };

  const gone = phase === 'declined';
  const state = phase === 'running' ? 'work' : phase === 'ask' ? 'wait' : 'done';
  const status =
    phase === 'ask'
      ? t('Proxy attend ta décision · 10:40', 'Proxy is waiting for your decision · 10:40')
      : phase === 'running'
        ? t('Proxy réserve', 'Proxy is booking')
        : gone
          ? t('Rien n’a été réservé', 'Nothing was booked')
          : t('C’est fait, tout est dans le journal · 10:41', 'Done, everything is in the log · 10:41');

  const steps = [
    { t: t('Réserver le 7 h 56', 'Book the 7:56'), d: t('siège côté fenêtre', 'window seat'), tag: t('réversible', 'reversible'), after: t('réservé', 'booked') },
    { t: t('Payer 89 €', 'Pay €89'), d: t('carte pro •••• 4417', 'work card •••• 4417'), tag: t('irréversible', 'irreversible'), after: t('payé · 10:41', 'paid · 10:41'), warn: true },
    { t: t('Agenda et billet', 'Calendar and ticket'), d: t('rangé dans « Déplacements »', 'filed under “Travel”'), tag: t('réversible', 'reversible'), after: t('fait · 10:41', 'done · 10:41') },
    { t: t('Prévenir Atelier Brume', 'Tell Atelier Brume'), d: t('tu relis avant l’envoi', 'you review before it is sent'), tag: t('réversible', 'reversible'), after: t('à relire', 'to review') },
  ];
  const verb = t('Réserver', 'Book');
  const date = t('jeudi 4 décembre, 7 h 56.', 'Thursday 4 December, 7:56.');
  const price = t('89 €', '€89');

  const rise = (ms: number): CSSProperties => ({ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(0.28em)', transition: `opacity 700ms ${EASE} ${ms}ms, transform 900ms ${EASE} ${ms}ms` });
  const fade = (ms: number): CSSProperties => ({ opacity: on ? 1 : 0, transition: `opacity 700ms ease ${ms}ms` });
  /** What stands on the far side of the cut: white on ink, or a ghost of itself when Léa declines. */
  const far = (a = 1): CSSProperties => ({ color: gone ? `rgba(18,18,18,${0.16})` : `rgba(255,255,255,${a})`, transition: 'color 700ms ease' });

  const amount = (dark: boolean) => (
    <>
      <p style={{ ...NR, fontSize: 'clamp(40px, 4vw, 58px)', lineHeight: 1 }}>{price}</p>
      <p className="mt-2 text-[12px]" style={{ opacity: 0.6 }}>{t('au-dessus de ta limite', 'over your limit')}</p>
      <div className="mt-3 flex h-[4px] w-[190px]" aria-hidden>
        <span className="h-full" style={{ width: `${(60 / 89) * 100}%`, background: dark ? '#fff' : INK }} />
        <span className="h-full flex-1" style={{ background: `repeating-linear-gradient(90deg, ${WARN} 0 2px, transparent 2px 4px)` }} />
      </div>
      <p className="mt-2 text-[10.5px]" style={{ ...GM, opacity: 0.6 }}>{t('limite 60 € · 89 €', 'limit €60 · €89')}</p>
    </>
  );

  const answer = (
    <>
      {phase === 'ask' && (
        <>
          <label className="flex cursor-pointer select-none items-center gap-3 text-[13px]">
            <input type="checkbox" checked={rule} onChange={(e) => setRule(e.target.checked)} className="h-4 w-4 accent-[#121212]" />
            {t('Ensuite, réserver seul les trains de moins de 100 €', 'Next time, book trains under €100 on your own')}
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
            <button type="button" onClick={approve} className="inline-flex h-[40px] items-center px-5 font-medium text-white" style={{ background: INK }}>
              {t('Valider et réserver', 'Approve and book')}
            </button>
            <button type="button" onClick={() => setPhase('declined')} className="inline-flex h-[40px] items-center px-5 font-medium" style={{ boxShadow: `inset 0 0 0 1px ${INK}` }}>
              {t('Refuser', 'Decline')}
            </button>
            <span className="ml-3" style={{ color: MUT }}>{t('Rien n’est payé avant ta validation.', 'Nothing is paid before you approve.')}</span>
          </div>
        </>
      )}
      {phase !== 'ask' && (
        <div className="text-[13px] leading-[1.5]">
          {gone && <p className="max-w-[420px]">{t('Proxy n’a rien réservé et rien n’est payé. La demande reste écrite au journal, avec ton refus.', 'Proxy booked nothing and nothing is paid. The request stays in the log, with your refusal.')}</p>}
          <button type="button" onClick={reset} className={`underline underline-offset-[3px] ${gone ? 'mt-3' : ''}`}>
            {t('Recommencer', 'Start over')}
          </button>
        </div>
      )}
    </>
  );

  const log = (
    <div className="text-[13px] leading-[1.45]" style={{ color: gone ? INK : '#fff', transition: 'color 700ms ease' }}>
      <p className="text-[11px] uppercase tracking-[0.08em]" style={{ ...GM, opacity: 0.55 }}>{t('Journal', 'Log')}</p>
      <div className="mt-2 border-t" style={{ borderColor: gone ? HAIR : 'rgba(255,255,255,.22)' }}>
        {phase !== 'done' && <p className="py-3" style={{ opacity: gone ? 1 : 0.6 }}>{gone ? t('10:40 · Demande refusée par toi. Rien d’engagé.', '10:40 · Request declined by you. Nothing committed.') : t('Rien pour l’instant.', 'Nothing yet.')}</p>}
        {phase === 'done' && (
          <>
            <div className="flex items-baseline gap-3 border-b py-[9px]" style={{ borderColor: 'rgba(255,255,255,.22)' }}>
              <span style={{ ...GM, opacity: 0.55 }}>10:41</span>
              <span className="flex-1">{refunded ? t('Billet remboursé, 89 €', 'Ticket refunded, €89') : t('Train réservé, 89 €', 'Train booked, €89')}</span>
              {!refunded && <button type="button" onClick={() => setRefunded(true)} className="underline underline-offset-[3px]">{t('Rembourser', 'Refund')}</button>}
            </div>
            <div className="flex items-baseline gap-3 border-b py-[9px]" style={{ borderColor: 'rgba(255,255,255,.22)' }}>
              <span style={{ ...GM, opacity: 0.55 }}>10:41</span>
              <span className="flex-1">{undone ? t('Retiré de l’agenda', 'Removed from calendar') : t('Ajouté à l’agenda, billet rangé', 'Added to calendar, ticket filed')}</span>
              {!undone && left > 0 && <button type="button" onClick={() => setUndone(true)} className="tabular-nums underline underline-offset-[3px]">{t('Annuler', 'Undo')} · 0:{String(left).padStart(2, '0')}</button>}
              {!undone && left <= 0 && <span style={{ opacity: 0.55 }}>{t('définitif', 'final')}</span>}
            </div>
            {rule && (
              <div className="flex items-baseline gap-3 border-b py-[9px]" style={{ borderColor: 'rgba(255,255,255,.22)' }}>
                <span style={{ ...GM, opacity: 0.55 }}>10:41</span>
                <span className="flex-1">{t('Nouvelle règle : trains de moins de 100 € en « agir, puis prévenir »', 'New rule: trains under €100 set to “act, then tell”')}</span>
              </div>
            )}
            <p className="pt-2 text-[12px]" style={{ opacity: 0.55 }}>
              {refunded
                ? t('Le paiement ne se défait pas, mais ce billet est remboursable sans frais : Proxy lance le remboursement.', 'A payment can’t be undone, but this ticket is refundable at no cost: Proxy starts the refund.')
                : t('Le délai d’annulation est raccourci à 30 secondes pour la démo.', 'The undo window is shortened to 30 seconds for the demo.')}
            </p>
          </>
        )}
      </div>
    </div>
  );

  const stepState = (k: number) => {
    const done = phase === 'done' ? k < 3 : phase === 'running' && step > k;
    const back = phase === 'done' && ((k === 0 && refunded) || (k === 2 && undone));
    return { done: done && !back, back };
  };

  return (
    <section ref={ref} data-top-dark aria-label={t('La demande de validation du billet de train', 'The train ticket approval request')} className="px-moment relative w-full overflow-hidden bg-white" style={{ color: INK }}>
      {/* ───────── wide screens: the cut runs down the page ───────── */}
      <div className="relative hidden lg:block" style={{ height: 'clamp(760px, 100svh, 1200px)' }}>
        <div aria-hidden className="absolute inset-y-0 right-0 motion-reduce:!transition-none" style={{ left: `${SEAM}%`, background: INK, transformOrigin: gone ? 'right' : 'left', transform: `scaleX(${on && !gone ? 1 : 0})`, transition: `transform 1000ms ${EASE} ${gone ? 0 : 200}ms` }} />
        <div aria-hidden className={`absolute inset-y-0 z-10 -translate-x-1/2 motion-reduce:!transition-none ${phase !== 'ask' && !gone && step >= 2 ? 'px-seam-hit' : ''}`} style={{ left: `${SEAM}%`, width: 2, background: WARN, transformOrigin: 'top', transform: `translateX(-50%) scaleY(${on ? 1 : 0})`, transition: `transform 800ms ${EASE}` }} />
        <span className="absolute text-[11px] uppercase tracking-[0.08em]" style={{ left: `calc(${SEAM}% + 14px)`, top: 70, color: WARN, ...GM, ...fade(900) }}>{t('Point de non-retour', 'Point of no return')}</span>

        <div className="absolute left-3 top-[62px] flex items-center gap-4" style={fade(300)}>
          <LivePresence state={state} size={7} />
          <span className="text-[11px] uppercase tracking-[0.08em]" style={{ color: MUT, ...GM }} aria-live="polite">{status}</span>
        </div>

        <div className="absolute right-3 top-[58px] flex flex-col items-end text-right" style={{ ...far(), ...fade(1000) }}>{amount(!gone)}</div>

        {/* the request, in Proxy's own voice */}
        <div className="absolute inset-x-0" style={{ top: '17.5%', ...NR, fontSize: 'min(9.4vw, 15svh, 148px)', lineHeight: 0.98 }}>
          <p className="pl-3 motion-reduce:!transition-none" style={rise(350)}>{verb}</p>
          <div className="relative grid" style={{ gridTemplateColumns: `${SEAM}% 1fr` }}>
            <span className="pr-[0.46em] text-right motion-reduce:!transition-none" style={rise(500)}>Paris</span>
            <span className="pl-[0.46em] motion-reduce:!transition-none" style={{ ...rise(820), color: gone ? 'rgba(18,18,18,.16)' : '#fff', transition: `${rise(820).transition}, color 700ms ease` }}>Lyon,</span>
            {/* the arrow is drawn, not typed: ink before the cut, white after it */}
            <svg aria-hidden viewBox="0 0 100 40" className="absolute motion-reduce:!transition-none" style={{ left: `${SEAM}%`, top: '0.385em', width: '0.7em', height: '0.28em', overflow: 'visible', opacity: on ? 1 : 0, transform: `translateX(${on ? '-50%' : '-125%'})`, transition: `opacity 600ms ease 650ms, transform 1000ms ${EASE} 650ms` }}>
              <defs>
                <clipPath id="px-arrow-a"><rect x="-10" y="-10" width="60" height="60" /></clipPath>
                <clipPath id="px-arrow-b"><rect x="50" y="-10" width="60" height="60" /></clipPath>
              </defs>
              {[['url(#px-arrow-a)', INK], ['url(#px-arrow-b)', gone ? 'rgba(18,18,18,.16)' : '#fff']].map(([clip, stroke]) => (
                <g key={clip} clipPath={clip} fill="none" stroke={stroke} strokeWidth="4.2" style={{ transition: 'stroke 700ms ease' }}>
                  <path d="M3 20H96" />
                  <path d="M80 5.5 96.5 20 80 34.5" strokeLinejoin="miter" />
                </g>
              ))}
            </svg>
          </div>
          <div className="grid" style={{ gridTemplateColumns: `${SEAM}% 1fr`, fontSize: '0.37em', lineHeight: 1.1, marginTop: '0.5em' }}>
            <span />
            <span className="motion-reduce:!transition-none" style={{ paddingLeft: 'calc(0.46em / 0.37)', ...rise(980), color: gone ? 'rgba(18,18,18,.16)' : 'rgba(255,255,255,.75)', transition: `${rise(980).transition}, color 700ms ease` }}>{date}</span>
          </div>
        </div>

        {/* what Proxy will do, in order */}
        <div className="absolute inset-x-0" style={{ bottom: 184, height: 150 }}>
          <span aria-hidden className="absolute left-3 right-0 top-[9px] h-px origin-left bg-white motion-reduce:!transition-none" style={{ mixBlendMode: 'difference', transform: `scaleX(${on ? 1 : 0})`, transition: `transform 1300ms ${EASE} 700ms` }} />
          <span aria-hidden className="absolute left-3 top-[8px] h-[3px] origin-left bg-white motion-reduce:!transition-none" style={{ mixBlendMode: 'difference', width: `calc(${AT[3]}% - 12px)`, transform: `scaleX(${phase === 'done' ? AT[2] / AT[3] : phase === 'running' ? AT[Math.min(step, 2)] / AT[3] : 0})`, transition: `transform 760ms ${EASE}` }} />
          {steps.map((s, k) => {
            const dark = AT[k] > SEAM && !gone;
            const ghost = AT[k] > SEAM && gone;
            const { done, back } = stepState(k);
            const ink = ghost ? 'rgba(18,18,18,.16)' : dark ? '#fff' : INK;
            const sub = ghost ? 'rgba(18,18,18,.16)' : dark ? 'rgba(255,255,255,.6)' : MUT;
            const paid = s.warn && done;
            return (
              <div key={k} className="absolute top-0 motion-reduce:!transition-none" style={{ left: k === 0 ? 12 : `${AT[k]}%`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(10px)', transition: `opacity 600ms ease ${1000 + k * 140}ms, transform 800ms ${EASE} ${1000 + k * 140}ms` }}>
                <span className="block h-[19px] w-[19px] rounded-full" style={{ background: s.warn ? (paid ? WARN : '#fff') : back ? 'transparent' : ink, boxShadow: s.warn ? `inset 0 0 0 2.5px ${WARN}` : back ? `inset 0 0 0 2px ${ink}` : undefined, transform: `scale(${done ? 1.16 : 1})`, transition: 'background-color 400ms ease, color 700ms ease, transform 500ms cubic-bezier(.3,1.6,.5,1)' }} />
                <p className="mt-5 text-[11px]" style={{ ...GM, color: sub, transition: 'color 700ms ease' }}>{back ? '↺' : done ? '✓' : `0${k + 1}`}</p>
                <p className={`mt-1 whitespace-nowrap text-[17px] font-medium leading-[1.2] tracking-[-0.01em] ${back ? 'line-through' : ''}`} style={{ color: s.warn && !ghost ? WARN : ink, transition: 'color 700ms ease' }}>{s.t}</p>
                <p className="mt-1 whitespace-nowrap text-[13px]" style={{ color: sub, transition: 'color 700ms ease' }}>{s.d}</p>
                <span className="mt-3 inline-flex h-[22px] items-center whitespace-nowrap border px-2 text-[11.5px]" style={{ borderColor: s.warn ? WARN : ghost ? 'rgba(18,18,18,.12)' : dark ? 'rgba(255,255,255,.3)' : HAIR, color: s.warn ? (paid ? '#fff' : WARN) : ghost ? 'rgba(18,18,18,.16)' : dark ? 'rgba(255,255,255,.75)' : '#4c5156', background: paid ? WARN : 'transparent', transition: 'background-color 400ms ease, color 400ms ease' }}>
                  {(done || (phase === 'done' && k === 3)) && !back ? s.after : s.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* her answer, and what it leaves behind */}
        <div className="absolute bottom-[84px] left-3" style={{ width: `calc(${SEAM}% - 40px)`, ...fade(1500) }}>{answer}</div>
        <div className="absolute bottom-[48px] right-3" style={{ left: `calc(${AT[2]}% )`, ...fade(1500) }}>{log}</div>
      </div>

      {/* ───────── narrow screens: the cut runs across ───────── */}
      <div className="lg:hidden">
        <div className="px-3 pb-7 pt-10">
          <div className="flex items-center gap-4">
            <LivePresence state={state} size={6} />
            <span className="text-[10.5px] uppercase tracking-[0.08em]" style={{ color: MUT, ...GM }}>{status}</span>
          </div>
          <div className="mt-7" style={{ ...NR, fontSize: 'min(21vw, 132px)', lineHeight: 0.96 }}>
            <p>{verb}</p>
            <p>Paris</p>
          </div>
          <ol className="mt-8 border-t" style={{ borderColor: HAIR }}>
            {steps.slice(0, 2).map((s, k) => {
              const { done, back } = stepState(k);
              const paid = s.warn && done;
              return (
                <li key={k} className="flex items-center gap-3 border-b py-[11px] text-[14px]" style={{ borderColor: HAIR }}>
                  <span className="block h-[13px] w-[13px] shrink-0 rounded-full" style={{ background: s.warn ? (paid ? WARN : '#fff') : back ? 'transparent' : INK, boxShadow: s.warn ? `inset 0 0 0 2px ${WARN}` : back ? `inset 0 0 0 1.5px ${INK}` : undefined }} />
                  <span className={`flex-1 font-medium ${back ? 'line-through' : ''}`} style={{ color: s.warn ? WARN : INK }}>{s.t}<span className="block text-[12.5px] font-normal" style={{ color: MUT }}>{s.d}</span></span>
                  <span className="inline-flex h-[22px] items-center whitespace-nowrap border px-2 text-[11.5px]" style={{ borderColor: s.warn ? WARN : HAIR, color: s.warn ? (paid ? '#fff' : WARN) : '#4c5156', background: paid ? WARN : 'transparent' }}>{done && !back ? s.after : s.tag}</span>
                </li>
              );
            })}
          </ol>
          <div className="mt-6">{answer}</div>
        </div>

        <div className="relative">
          <div aria-hidden className="h-[2px] w-full" style={{ background: WARN }} />
          <span className="absolute right-3 top-[-22px] text-[10.5px] uppercase tracking-[0.08em]" style={{ color: WARN, ...GM }}>{t('Point de non-retour', 'Point of no return')}</span>
        </div>

        <div className="px-3 pb-12 pt-7 motion-reduce:!transition-none" style={{ background: gone ? '#fff' : INK, transition: 'background-color 700ms ease' }}>
          <div style={{ ...NR, lineHeight: 0.96 }}>
            <p style={{ fontSize: 'min(21vw, 132px)', ...far() }}><span aria-hidden className="mr-[0.14em] inline-block" style={{ fontSize: '0.62em', transform: 'translateY(-0.12em)' }}>↓</span>Lyon,</p>
            <p className="mt-3" style={{ fontSize: 'min(7.4vw, 46px)', lineHeight: 1.1, ...far(0.75) }}>{date}</p>
          </div>
          <div className="mt-7 flex flex-col items-start" style={far()}>{amount(!gone)}</div>
          <ol className="mt-8 border-t" style={{ borderColor: gone ? HAIR : 'rgba(255,255,255,.22)' }}>
            {steps.slice(2).map((s, i) => {
              const k = i + 2;
              const { done, back } = stepState(k);
              return (
                <li key={k} className="flex items-center gap-3 border-b py-[11px] text-[14px]" style={{ borderColor: gone ? HAIR : 'rgba(255,255,255,.22)', ...far() }}>
                  <span className="block h-[13px] w-[13px] shrink-0 rounded-full" style={{ background: back ? 'transparent' : 'currentColor', boxShadow: back ? 'inset 0 0 0 1.5px currentColor' : undefined }} />
                  <span className={`flex-1 font-medium ${back ? 'line-through' : ''}`}>{s.t}<span className="block text-[12.5px] font-normal" style={{ opacity: 0.6 }}>{s.d}</span></span>
                  <span className="inline-flex h-[22px] items-center whitespace-nowrap border px-2 text-[11.5px]" style={{ borderColor: gone ? HAIR : 'rgba(255,255,255,.3)', opacity: 0.85 }}>{(done || (phase === 'done' && k === 3)) && !back ? s.after : s.tag}</span>
                </li>
              );
            })}
          </ol>
          <div className="mt-8">{log}</div>
        </div>
      </div>
    </section>
  );
}
