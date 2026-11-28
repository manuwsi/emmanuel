'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n';
import { LivePresence } from './Live';
import { Presence } from '@/components/project/DesignSystem';

type T = <V,>(fr: V, en: V) => V;

const INK = '#121212';
const WARN = '#c9461f';
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
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-0 md:gap-y-2" role="tablist" aria-label={t('Quatre moments du mercredi de Léa', 'Four moments of Léa’s Wednesday')}>
        {cases.map((k, i) => (
          <button key={k.time} type="button" role="tab" aria-selected={i === c} onClick={() => setC(i)} className="group flex items-baseline gap-2 py-[6px] text-left transition-colors duration-300 md:py-0" style={{ color: i === c ? INK : 'rgba(0,0,0,.45)' }}>
            <span className="h-[7px] w-[7px] shrink-0 translate-y-[-1px] rounded-full transition-colors duration-300" style={{ background: i === c ? (k.path[2] === 4 ? WARN : INK) : 'transparent', boxShadow: i === c ? undefined : 'inset 0 0 0 1px rgba(0,0,0,.4)' }} />
            <span className="tabular-nums">{k.time}</span>
            <span className={i === c ? 'font-medium' : 'underline decoration-black/25 underline-offset-[3px]'}>{k.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 border-t border-[#dcdfe2] md:grid-cols-4">
        {cols.map((col, ci) => (
          <div key={col.h} className={`grid grid-cols-[120px_1fr] items-baseline py-[10px] md:block md:py-4 md:pr-5 ${ci > 0 ? 'border-t border-black/10 md:border-t-0' : ''}`}>
            <p className="text-black/60">
              <span className="tabular-nums">0{ci + 1}</span> · {col.h}
            </p>
            <ul className="space-y-[7px] md:mt-3">
              {col.items.map((it, k) => {
                const hit = cur.path[ci] === k;
                const warn = col.warn.includes(k);
                return (
                  <li key={it} className={`items-start gap-[10px] transition-colors duration-300 ${hit ? 'flex' : 'hidden md:flex'}`} style={{ color: hit ? (warn ? WARN : INK) : 'rgba(0,0,0,.34)' }}>
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

function useActiveBeat(ids: string[], on: boolean) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');
  useEffect(() => {
    if (!on) return;
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-38% 0px -58% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key, on]);
  return active;
}

function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const set = () => setWide(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return wide;
}

/** While a moment takes the whole width of the page ([data-bleed]), the rail steps aside instead of being cut by it. */
function useAway(on: boolean) {
  const [away, setAway] = useState(false);
  useEffect(() => {
    if (!on) return;
    const els = document.querySelectorAll('[data-bleed]');
    if (!els.length) return;
    const over = new Set<Element>();
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? over.add(e.target) : over.delete(e.target)));
        setAway(over.size > 0);
      },
      { rootMargin: '-10% 0px -14% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [on]);
  return away;
}

export function Rail({ moments, labels }: { moments: Moment[]; labels: Record<Moment['state'], string> }) {
  // the rail keeps this state to itself: the page around it never re-renders while it is read.
  // On a phone it is not displayed, so it watches nothing and nothing ticks.
  const wide = useWide();
  const active = useActiveBeat(moments.map((m) => m.id), wide);
  const away = useAway(wide);
  const cur = moments.find((m) => m.id === active) ?? moments[0];
  if (!wide) return null;
  const stop = cur.state === 'stop';
  return (
    <div className={`px-rail sticky top-[19vh] motion-reduce:transition-none ${FT}`} style={{ opacity: away ? 0 : 1, transform: away ? 'translateY(-8px)' : 'none', pointerEvents: away ? 'none' : undefined, visibility: away ? 'hidden' : 'visible', transitionProperty: 'opacity, transform, visibility' }}>
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
