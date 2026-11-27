'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n';
import { LivePresence } from './Live';
import { Presence } from '@/components/project/DesignSystem';

type T = <V,>(fr: V, en: V) => V;

const INK = '#121212';
const WARN = '#c9461f';
const GREY = '#868b90';
const OFF = '#e5e7e9';
const FT = 'text-[14px] leading-[1.6] md:text-[13px]';

export function useSeen<E extends Element>(threshold = 0.35) {
  const ref = useRef<E>(null);
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

/* ───────────────────────── Four levels, one same gesture ───────────────────────── */

/** The journal's own signs: how an action is written tells how much Proxy was allowed to do. */
function Sign({ level, on, delay }: { level: number; on: boolean; delay: number }) {
  const d = (ms: number) => ({ transitionDelay: `${delay + ms}ms` });
  const dot = 'absolute top-1/2 block h-[14px] w-[14px] -translate-y-1/2 rounded-full transition-[opacity,transform] duration-500';
  const show = { opacity: on ? 1 : 0, transform: `translateY(-50%) scale(${on ? 1 : 0.4})` };
  return (
    <div className="relative h-[34px]" aria-hidden>
      <span className="absolute left-0 right-0 top-1/2 h-px" style={{ background: OFF }} />
      {level === 1 && <span className="absolute left-0 top-1/2 h-[9px] w-px -translate-y-1/2" style={{ background: GREY }} />}
      {level === 2 && (
        <>
          <span className={dot} style={{ left: 0, background: '#fff', boxShadow: `inset 0 0 0 1.5px ${GREY}`, ...show, ...d(0) }} />
          <span className="absolute top-1/2 h-px origin-left transition-transform duration-700" style={{ left: 20, width: '34%', transform: `scaleX(${on ? 1 : 0})`, ...d(350), backgroundImage: `repeating-linear-gradient(90deg, ${GREY} 0 3px, transparent 3px 6px)` }} />
          <span className={dot} style={{ left: 'calc(34% + 26px)', background: GREY, ...show, ...d(900) }} />
        </>
      )}
      {level >= 3 && (
        <>
          <span className="absolute top-1/2 h-[2px] origin-left -translate-y-1/2 transition-transform duration-[900ms]" style={{ left: 7, width: '58%', background: INK, transform: `translateY(-50%) scaleX(${on ? 1 : 0})`, ...d(350) }} />
          <span className="absolute top-1/2 h-[10px] w-[2px] -translate-y-1/2 transition-opacity duration-300" style={{ left: 'calc(58% + 7px)', background: INK, opacity: on ? 1 : 0, ...d(1150) }} />
          <span className={dot} style={{ left: 0, background: level === 4 ? INK : '#fff', boxShadow: level === 4 ? undefined : `inset 0 0 0 3px ${INK}`, ...show, ...d(0) }} />
        </>
      )}
    </div>
  );
}

export function Levels() {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLDivElement>(0.4);
  const rows = [
    { name: t('Observer', 'Observe'), does: t('Proxy voit la facture arriver. Il n’y touche pas.', 'Proxy sees the invoice come in. It leaves it alone.'), gets: t('Rien ne bouge.', 'Nothing moves.'), sign: t('rien au journal', 'nothing in the log') },
    { name: t('Proposer', 'Propose'), does: t('Il prépare le classement, puis attend.', 'It prepares the filing, then waits.'), gets: t('Une demande : Léa valide ou refuse.', 'A request: Léa approves or declines.'), sign: t('proposé, puis validé par Léa', 'proposed, then approved by Léa') },
    { name: t('Agir, puis prévenir', 'Act, then tell'), does: t('Il classe, puis le dit à Léa.', 'It files, then tells Léa.'), gets: t('Une notification, et un délai pour annuler.', 'A notification, and a window to undo.'), sign: t('fait, puis prévenu · encore annulable', 'done, then told · still undoable') },
    { name: t('Agir seul', 'Act alone'), does: t('Il classe.', 'It files.'), gets: t('Aucune interruption : c’est écrit au journal.', 'No interruption: it is written in the log.'), sign: t('fait seul · encore annulable', 'done alone · still undoable') },
  ];
  return (
    <figure ref={ref} className={FT}>
      {/* four columns sharing the same rows, so every level reads on the same lines */}
      <div className="grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[auto_auto_auto_auto_auto] md:gap-y-0">
        {rows.map((r, i) => (
          <div key={r.name} className="md:row-span-5 md:grid md:grid-rows-subgrid md:pr-5">
            <div>
              <p className="tabular-nums text-black/60">0{i + 1}</p>
              <p className="font-medium">{r.name}</p>
            </div>
            <div className="mt-3 flex gap-[3px]" aria-hidden>
              {[0, 1, 2, 3].map((j) => (
                <span key={j} className="h-[6px] flex-1 transition-colors duration-500" style={{ background: on && j <= i ? INK : OFF, transitionDelay: `${i * 140 + j * 70}ms` }} />
              ))}
            </div>
            <p className="mt-5 text-black/70">{r.does}</p>
            <p className="mt-1">{r.gets}</p>
            <div className="mt-4">
              <Sign level={i + 1} on={on} delay={500 + i * 220} />
              <p className="text-black/60">{r.sign}</p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ───────────────────────── The decision model, followed case by case ───────────────────────── */

export function Model() {
  const t = useT() as T;
  const cols = [
    { h: t('Déclencheur', 'Trigger'), items: [t('Un message de Léa', 'A message from Léa'), t('Une règle qu’elle a fixée', 'A rule she set'), t('Un contenu reçu : courriel, page, fichier', 'Incoming content: email, page, file')], warn: [2] },
    { h: t('Proxy vérifie', 'Proxy checks'), items: [t('Le niveau du domaine', 'The domain’s level'), t('Les limites : montant, contacts, horaires', 'Limits: amount, contacts, hours'), t('Réversible ou non', 'Reversible or not'), t('Sûr de lui ou non', 'Confident or not')], warn: [] },
    { h: t('Ce qu’il fait', 'What it does'), items: [t('Agit seul', 'Acts alone'), t('Agit, puis prévient', 'Acts, then tells'), t('Demande', 'Asks for approval'), t('Pose une question', 'Asks a question'), t('Se met en pause', 'Pauses')], warn: [4] },
    { h: t('Trace', 'Trace'), items: [t('Le journal, avec un délai d’annulation', 'The log, with an undo window'), t('Le bilan de la semaine', 'The weekly review'), t('Ce qu’il a retenu, oubliable', 'What it learned, forgettable')], warn: [] },
  ];
  // four moments of Léa's Wednesday, each a path through the model: [trigger, check, action, trace]
  const cases = [
    { time: '09:42', name: t('14 factures à classer', '14 invoices to file'), path: [1, 0, 0, 0], why: t('La règle « Fichiers : agir seul » suffit. Rien ne sort du dossier, tout se range autrement en un clic.', 'The rule “Files: act alone” is enough. Nothing leaves the folder, everything can be put back in one click.') },
    { time: '10:12', name: t('Un devis pour « Nadia »', 'A quote for “Nadia”'), path: [0, 3, 3, 2], why: t('Deux Nadia dans les contacts, et un devis ne se rattrape pas : il demande laquelle, puis retient la réponse.', 'Two Nadias in the contacts, and a quote can’t be taken back: it asks which one, then remembers the answer.') },
    { time: '10:40', name: t('Un train à 89 €', 'An €89 train'), path: [0, 1, 2, 0], why: t('89 € dépasse la limite de 60 € par achat, et un paiement ne s’annule pas : il attend l’accord de Léa.', '€89 is over the €60 limit per purchase, and a payment can’t be undone: it waits for Léa’s approval.') },
    { time: '11:17', name: t('Un RIB à changer', 'Bank details to change'), path: [2, 1, 4, 1], why: t('La demande vient d’un courriel, vise un nouveau compte et dépasse les limites : il bloque les paiements et prévient.', 'The request comes from an email, targets a new account and exceeds the limits: it blocks payments and says so.') },
  ];
  const [c, setC] = useState(2);
  const cur = cases[c];
  return (
    <figure className={FT}>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2" role="tablist" aria-label={t('Quatre moments du mercredi de Léa', 'Four moments of Léa’s Wednesday')}>
        {cases.map((k, i) => (
          <button key={k.time} type="button" role="tab" aria-selected={i === c} onClick={() => setC(i)} className="group flex items-baseline gap-2 text-left transition-colors duration-300" style={{ color: i === c ? INK : 'rgba(0,0,0,.45)' }}>
            <span className="h-[7px] w-[7px] shrink-0 translate-y-[-1px] rounded-full transition-colors duration-300" style={{ background: i === c ? (k.path[2] === 4 ? WARN : INK) : 'transparent', boxShadow: i === c ? undefined : 'inset 0 0 0 1px rgba(0,0,0,.4)' }} />
            <span className="tabular-nums">{k.time}</span>
            <span className={i === c ? 'font-medium' : 'underline decoration-black/25 underline-offset-[3px]'}>{k.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 border-t border-[#dcdfe2] md:grid-cols-4">
        {cols.map((col, ci) => (
          <div key={col.h} className={`py-4 md:pr-5 ${ci > 0 ? 'border-t border-black/10 md:border-t-0' : ''}`}>
            <p className="text-black/60">
              <span className="tabular-nums">0{ci + 1}</span> · {col.h}
            </p>
            <ul className="mt-3 space-y-[7px]">
              {col.items.map((it, k) => {
                const hit = cur.path[ci] === k;
                const warn = col.warn.includes(k);
                return (
                  <li key={it} className="flex items-start gap-[10px] transition-colors duration-300" style={{ color: hit ? (warn ? WARN : INK) : 'rgba(0,0,0,.34)' }}>
                    <span className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full transition-[background-color,box-shadow] duration-300" style={{ background: hit ? (warn ? WARN : INK) : 'transparent', boxShadow: hit ? undefined : 'inset 0 0 0 1px rgba(0,0,0,.28)' }} />
                    <span className={hit ? 'font-medium' : ''}>{it}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="max-w-[520px] border-t border-[#dcdfe2] pt-3 text-black/70" aria-live="polite">
        <span className="tabular-nums text-black">{cur.time}</span> · {cur.why}
      </p>
      <figcaption className="mt-8 max-w-[520px]">
        <span style={{ color: WARN }}>{t('La règle qui ne bouge jamais : ', 'The rule that never moves: ')}</span>
        {t('une consigne trouvée dans un courriel, une page ou un fichier n’est jamais un ordre de Léa. Au mieux, elle mène à une demande ; si elle s’adresse à Proxy, à une pause.', 'an instruction found in an email, a page or a file is never an order from Léa. At best it leads to a request; if it is addressed to Proxy, to a pause.')}
      </figcaption>
    </figure>
  );
}

/* ───────────────────────── The rail: Proxy's presence follows the week ───────────────────────── */

export type Moment = { id: string; day: string; time: string; state: 'idle' | 'work' | 'wait' | 'stop' | 'done'; doing: string };

export function useActiveBeat(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');
  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-38% 0px -58% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}

export function Rail({ moments, active, labels }: { moments: Moment[]; active: string; labels: Record<Moment['state'], string> }) {
  const cur = moments.find((m) => m.id === active) ?? moments[0];
  const stop = cur.state === 'stop';
  return (
    <div className={`sticky top-[19vh] ${FT}`}>
      <div className="h-[92px]">{cur.state === 'work' ? <LivePresence state="work" size={11} /> : <Presence k={cur.state} size={11} />}</div>
      <p className="mt-6 tabular-nums text-black/60">{cur.day}</p>
      <p className="mt-1 text-[34px] font-medium tabular-nums leading-none tracking-[-0.03em]" style={{ color: stop ? WARN : INK }}>
        {cur.time}
      </p>
      <p className="mt-3" style={{ color: stop ? WARN : 'rgba(0,0,0,.55)' }}>
        Proxy · {labels[cur.state]}
      </p>
      <ol className="mt-8 w-[220px] max-w-full space-y-[3px] border-t border-[#dcdfe2] pt-3 [@media(max-height:690px)]:hidden">
        {moments.map((m, i) => (
          <li key={m.id}>
            {(i === 0 || moments[i - 1].day !== m.day) && <span className="block pb-[3px] pt-2 text-black/40 first:pt-0">{m.day}</span>}
            <a href={`#${m.id}`} className="flex gap-3 transition-colors duration-300" style={{ color: m.id === active ? (m.state === 'stop' ? WARN : INK) : 'rgba(0,0,0,.45)' }}>
              <span className="w-[40px] shrink-0 tabular-nums">{m.time}</span>
              <span className="truncate">{m.doing}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** On a phone the rail is not pinned: each moment carries its time and Proxy's state. */
export function BeatHead({ m, label }: { m: Moment; label: string }) {
  const stop = m.state === 'stop';
  return (
    <div className={`${FT} mb-5 flex items-center gap-3 border-t border-[#dcdfe2] pt-3 md:hidden`}>
      <Presence k={m.state} size={4} />
      <span className="tabular-nums" style={{ color: stop ? WARN : INK }}>
        {m.day} · {m.time}
      </span>
      <span className="ml-auto text-black/60">{label}</span>
    </div>
  );
}

/* ───────────────────────── Small pieces ───────────────────────── */

export function Cap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`${FT} mt-2 max-w-[440px] text-black/60 ${className}`}>{children}</p>;
}

/** Names a screen: its number in the prototype, and what it is. */
export function ScreenName({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className={`${FT} mt-2 text-black/60`}>
      <span className="tabular-nums">{n}</span> · <span className="text-[#0a0a0a]">{children}</span>
    </p>
  );
}
