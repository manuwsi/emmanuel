'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import './proto.css';

type T = <V,>(fr: V, en: V) => V;

const INK = '#121212';
const WARN = '#c9461f';
const OFF = '#d8dbde';
const MUT = '#6c7176';
const LINE = '#e5e7e9';
const GM = { fontFamily: 'PXGM, ui-monospace, monospace' } as const;
const NR = { fontFamily: 'PXNR, Georgia, serif', letterSpacing: '-0.015em' } as const;

/* ───────────── Animated presence ───────────── */

const FRAMES: Record<string, string[]> = {
  work: ['..a...aha.ahaha.aha...a..', '.....a...a..a..a...a.....', '..h...aaa.hahah.aaa...h..', '.a.a.a...a..a..a...a.a.a.'],
  wait: ['......a.a.......a.a......'],
  done: ['............a............'],
  stop: ['w...w.w.w...w...w.w.w...w'],
};

export function LivePresence({ state, size = 9 }: { state: 'work' | 'wait' | 'done' | 'stop'; size?: number }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (state !== 'work' || !el) return;
    // it only works while someone can see it: nothing ticks off screen, or where it is not displayed
    let id: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !id) id = setInterval(() => setI((x) => (x + 1) % FRAMES.work.length), 260);
      else if (!e.isIntersecting && id) {
        clearInterval(id);
        id = undefined;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (id) clearInterval(id);
    };
  }, [state]);
  const f = FRAMES[state][state === 'work' ? i : 0];
  return (
    <div ref={ref} className="grid grid-cols-5 w-fit" style={{ gap: size * 0.7 }}>
      {f.split('').map((c, k) => (
        <span
          key={k}
          className="block rounded-full transition-colors duration-200"
          style={{ width: size, height: size, background: c === 'a' ? INK : c === 'h' ? '#868b90' : c === 'w' ? WARN : OFF }}
        />
      ))}
    </div>
  );
}

/* ───────────── The validation moment, for real ───────────── */

type Phase = 'ask' | 'running' | 'done' | 'declined';

export function LiveRequest() {
  const t = useT() as T;
  const [phase, setPhase] = useState<Phase>('ask');
  const [step, setStep] = useState(0); // steps completed
  const [rule, setRule] = useState(false);
  const [left, setLeft] = useState(30);
  const [agendaUndone, setAgendaUndone] = useState(false);
  const [refunded, setRefunded] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const steps = [
    { label: t('Réserver le 7 h 56, siège côté fenêtre', 'Book the 7:56, window seat'), note: t('réversible', 'reversible') },
    { label: t('Payer 89 € avec la carte pro', 'Pay €89 with the work card'), note: t('irréversible', 'irreversible'), warn: true },
    { label: t('Ajouter à l’agenda, ranger le billet', 'Add to calendar, file the ticket'), note: t('réversible', 'reversible') },
  ];

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  useEffect(() => {
    if (phase !== 'done' || agendaUndone || left <= 0) return;
    const id = setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, left, agendaUndone]);

  const approve = () => {
    setPhase('running');
    setStep(0);
    [1, 2, 3].forEach((n, k) => timers.current.push(setTimeout(() => setStep(n), 700 * (k + 1))));
    timers.current.push(setTimeout(() => setPhase('done'), 700 * 3 + 300));
  };
  const reset = () => {
    clear();
    setPhase('ask');
    setStep(0);
    setLeft(30);
    setAgendaUndone(false);
    setRefunded(false);
    setRule(false);
  };

  const state = phase === 'running' ? 'work' : phase === 'ask' ? 'wait' : 'done';
  const sentence =
    phase === 'ask'
      ? t('Proxy attend ta décision', 'Proxy is waiting for your decision')
      : phase === 'running'
        ? t('Proxy réserve', 'Proxy is booking')
        : phase === 'declined'
          ? t('Rien n’a été réservé', 'Nothing was booked')
          : t('C’est fait, tout est dans le journal', 'Done, everything is in the log');

  return (
    <div className="-mx-2 bg-white md:mx-0" style={{ boxShadow: '0 0 0 1px #dcdfe2' }}>
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* request */}
        <div className="md:col-span-7 p-4 md:p-8 md:border-r" style={{ borderColor: LINE }}>
          <div className="flex items-start gap-5">
            <LivePresence state={state} size={8} />
            <div className="min-w-0">
              <span className="block text-[11px] uppercase tracking-[0.08em]" style={{ color: MUT }}>{sentence}</span>
              <p className="mt-2 text-[24px] md:text-[30px] leading-[1.1]" style={NR}>
                {t('Paris → Lyon, jeudi 7 h 56', 'Paris → Lyon, Thursday 7:56')}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: MUT }}>
                <span style={GM} className="text-black">89 €</span> · {t('ta limite : 60 €', 'your limit: €60')}
              </p>
            </div>
          </div>

          <ol className="mt-6 border-t" style={{ borderColor: LINE }}>
            {steps.map((s, k) => {
              const doneStep = step > k && !(k === 2 && agendaUndone) && !(k === 0 && refunded);
              const undone = (k === 2 && agendaUndone) || (k === 0 && refunded);
              const active = phase === 'running' && step === k;
              return (
                <li key={k} className="flex items-center gap-3 py-3 border-b text-[14px]" style={{ borderColor: LINE }}>
                  <span className="w-[18px] text-center text-[12px]" style={GM}>
                    {undone ? '↺' : doneStep ? '✓' : active ? '…' : k + 1}
                  </span>
                  <span className={`flex-1 ${undone ? 'line-through text-black/60' : ''}`}>{s.label}</span>
                  {s.warn ? (
                    <span className="text-[11px] px-2 py-[2px]" style={{ boxShadow: `inset 0 0 0 1px ${WARN}`, color: WARN }}>{s.note}</span>
                  ) : (
                    <span className="text-[12px]" style={{ color: MUT }}>{s.note}</span>
                  )}
                </li>
              );
            })}
          </ol>

          {phase === 'ask' && (
            <div className="mt-5 space-y-4">
              <label className="flex items-center gap-3 text-[14px] cursor-pointer select-none">
                <input type="checkbox" checked={rule} onChange={(e) => setRule(e.target.checked)} className="w-4 h-4 accent-[#121212]" />
                {t('Ensuite, réserver seul les trains de moins de 100 €', 'Next time, book trains under €100 on your own')}
              </label>
              <div className="flex flex-wrap gap-2">
                <button onClick={approve} className="px-5 py-3 text-[14px] font-medium text-white" style={{ background: INK }}>
                  {t('Valider et réserver', 'Approve and book')}
                </button>
                <button onClick={() => setPhase('declined')} className="px-5 py-3 text-[14px]" style={{ boxShadow: `inset 0 0 0 1px ${LINE}` }}>
                  {t('Refuser', 'Decline')}
                </button>
              </div>
              <p className="text-[12px]" style={{ color: MUT }}>{t('Rien n’est payé avant ta validation.', 'Nothing is paid before you approve.')}</p>
            </div>
          )}
          {phase === 'declined' && (
            <div className="mt-5 text-[14px] leading-relaxed">
              <p>{t('Proxy n’a rien réservé. Il te propose le 6 h 58 à 64 €, sous ta limite, avec une heure d’attente à l’arrivée.', 'Proxy booked nothing. It suggests the 6:58 at €64, under your limit, with an hour’s wait on arrival.')}</p>
            </div>
          )}
        </div>

        {/* log */}
        <div className="md:col-span-5 p-4 md:p-8 border-t md:border-t-0" style={{ borderColor: LINE, background: '#f4f5f6' }}>
          <span className="block text-[11px] uppercase tracking-[0.08em]" style={{ color: MUT }}>{t('Journal', 'Log')}</span>
          <div className="mt-3 border-t" style={{ borderColor: LINE }}>
            {phase !== 'done' && (
              <p className="py-4 text-[13px]" style={{ color: MUT }}>
                {phase === 'declined' ? t('10:40 · Demande refusée par toi. Rien d’engagé.', '10:40 · Request declined by you. Nothing committed.') : t('Rien pour l’instant.', 'Nothing yet.')}
              </p>
            )}
            {phase === 'done' && (
              <>
                <div className="py-3 border-b text-[13px]" style={{ borderColor: LINE }}>
                  <div className="flex gap-3">
                    <span style={{ ...GM, color: MUT }}>10:41</span>
                    <span className="flex-1">{refunded ? t('Billet remboursé, 89 €', 'Ticket refunded, €89') : t('Train réservé, 89 €', 'Train booked, €89')}</span>
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="w-[38px]" />
                    <span className="flex-1" style={{ color: MUT }}>{t('Déclencheur : validé par toi', 'Trigger: approved by you')}</span>
                    {!refunded && (
                      <button onClick={() => setRefunded(true)} className="underline underline-offset-2">
                        {t('Rembourser', 'Refund')}
                      </button>
                    )}
                  </div>
                </div>
                <div className="py-3 border-b text-[13px]" style={{ borderColor: LINE }}>
                  <div className="flex gap-3">
                    <span style={{ ...GM, color: MUT }}>10:41</span>
                    <span className="flex-1">{agendaUndone ? t('Retiré de l’agenda', 'Removed from calendar') : t('Ajouté à l’agenda', 'Added to calendar')}</span>
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="w-[38px]" />
                    <span className="flex-1" style={{ color: MUT }}>{t('Suite de ta validation', 'Follows your approval')}</span>
                    {!agendaUndone && left > 0 && (
                      <button onClick={() => setAgendaUndone(true)} className="underline underline-offset-2 tabular-nums">
                        {t('Annuler', 'Undo')} · 0:{String(left).padStart(2, '0')}
                      </button>
                    )}
                    {!agendaUndone && left <= 0 && <span style={{ color: MUT }}>{t('définitif', 'final')}</span>}
                  </div>
                </div>
                {rule && (
                  <div className="py-3 border-b text-[13px]" style={{ borderColor: LINE }}>
                    <div className="flex gap-3">
                      <span style={{ ...GM, color: MUT }}>10:41</span>
                      <span className="flex-1">{t('Nouvelle règle : trains de moins de 100 € en « agir, puis prévenir »', 'New rule: trains under €100 set to “act, then tell”')}</span>
                    </div>
                  </div>
                )}
                <p className="pt-3 text-[12px] leading-relaxed" style={{ color: MUT }}>
                  {refunded
                    ? t('Le paiement ne se défait pas, mais ce billet est remboursable sans frais : Proxy lance le remboursement.', 'A payment can’t be undone, but this ticket is refundable at no cost: Proxy starts the refund.')
                    : t('Le délai d’annulation est raccourci à 30 secondes pour la démo.', 'The undo window is shortened to 30 seconds for the demo.')}
                </p>
              </>
            )}
            {phase !== 'ask' && (
              <button onClick={reset} className="mt-4 text-[13px] underline underline-offset-2" style={{ color: INK }}>
                {t('Recommencer', 'Start over')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
