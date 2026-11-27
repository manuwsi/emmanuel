'use client';

import { useRef, useState } from 'react';
import { useT } from '../i18n';
import { useSeen } from './Figures';
import { GM, INK, Kind, Mark, T, Tail, useSize } from './marks';
import './proto.css';

const H = 'text-[24px] font-medium leading-[1.14] tracking-[-0.03em] md:text-[30px] md:leading-[1.12]';

/** How high each domain's name sits above the ramp: one line each, so names never collide wherever the pins are moved. */
const UP = [152, 68, 124, 96, 40];
/** Léa's own settings, domain by domain. */
const HOME = [2, 3, 2, 2, 4];

function Sign({ level }: { level: number }) {
  if (level === 1) return <span aria-hidden className="block h-[11px] w-px bg-black/30" />;
  if (level === 2)
    return (
      <span aria-hidden className="flex items-center gap-[6px]">
        <Mark kind="proposed" d={11} />
        <span className="block h-px w-[18px]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #868b90 0 2px, transparent 2px 5px)' }} />
        <Mark kind="approved" d={11} />
      </span>
    );
  return (
    <span aria-hidden className="flex items-center gap-[5px]">
      <Mark kind={(level === 3 ? 'told' : 'alone') as Kind} d={11} />
      <Tail n={4} />
    </span>
  );
}

/**
 * Autonomy as a printed ramp: four densities for four levels. The denser the screen of dots, the more Proxy does without Léa.
 * Her five domains are pinned where she set them.
 */
export function Autonomy() {
  const t = useT() as T;
  const [ref, on] = useSeen<HTMLElement>(0.2);
  const band = useRef<HTMLDivElement>(null);
  const [w] = useSize(band);
  const [lv, setLv] = useState<number | null>(null);
  const [dom, setDom] = useState<number | null>(null);
  // the visitor may move a domain along the ramp, as Léa does in the product
  const [at, setAt] = useState(HOME);
  const [drag, setDrag] = useState<number | null>(null);
  const moved = at.some((v, i) => v !== HOME[i]);
  const move = (i: number, level: number) => setAt((p) => (p[i] === level ? p : p.map((v, k) => (k === i ? Math.min(4, Math.max(1, level)) : v))));
  const levelAt = (clientX: number) => {
    const r = band.current?.getBoundingClientRect();
    return r ? Math.floor(((clientX - r.left) / r.width) * 4) + 1 : 1;
  };

  const levels = [
    { name: t('Observer', 'Observe'), does: t('Proxy voit la facture arriver. Il n’y touche pas.', 'Proxy sees the invoice come in. It leaves it alone.'), gets: t('Rien ne bouge.', 'Nothing moves.'), sign: t('rien au journal', 'nothing in the log') },
    { name: t('Proposer', 'Propose'), does: t('Il prépare le classement, puis attend.', 'It prepares the filing, then waits.'), gets: t('Une demande : Léa valide ou refuse.', 'A request: Léa approves or declines.'), sign: t('proposé, puis validé', 'proposed, then approved') },
    { name: t('Agir, puis prévenir', 'Act, then tell'), does: t('Il classe, puis le dit à Léa.', 'It files, then tells Léa.'), gets: t('Une notification, et un délai pour annuler.', 'A notification, and a window to undo.'), sign: t('fait, puis prévenu', 'done, then told') },
    { name: t('Agir seul', 'Act alone'), does: t('Il classe.', 'It files.'), gets: t('Aucune interruption : c’est écrit au journal.', 'No interruption: it is written in the log.'), sign: t('fait seul', 'done alone') },
  ];
  const domains = [
    { name: t('Courriels', 'Email'), level: 2, rule: t('Proches et clients connus. Jamais d’envoi à un nouveau contact sans Léa.', 'Family and known clients. Never a message to a new contact without Léa.') },
    { name: t('Agenda', 'Calendar'), level: 3, rule: t('Peut accepter, décaler et refuser. Rien avant 9 h ni après 19 h.', 'May accept, move and decline. Nothing before 9 am or after 7 pm.') },
    { name: t('Achats et paiements', 'Purchases and payments'), level: 2, rule: t('Seul jusqu’à 60 € par achat et 300 € par semaine.', 'Alone up to €60 per purchase and €300 per week.') },
    { name: t('Trains et déplacements', 'Trains and travel'), level: 2, next: 3, rule: t('Proxy suggère de passer en « agir, puis prévenir » sous 100 € : Léa a validé ses 12 dernières réservations sans rien modifier.', 'Proxy suggests moving to “act, then tell” under €100: Léa approved its last 12 bookings without changing anything.') },
    { name: t('Fichiers et documents', 'Files and documents'), level: 4, rule: t('Classer, renommer, archiver. Jamais supprimer.', 'File, rename, archive. Never delete.') },
  ];
  const shown = drag ?? dom;
  const focus = shown !== null ? at[shown] : lv;
  /** A pin's place inside its level: the domains that share a level spread evenly across it. */
  const slot = (i: number) => {
    const same = at.map((v, k) => (v === at[i] ? k : -1)).filter((k) => k >= 0);
    return (same.indexOf(i) + 1) / (same.length + 1);
  };

  // the ramp: a whole number of dots per level, so the four densities meet on a clean edge
  const cols = Math.max(8, Math.round(w / 30 / 4) * 4);
  const p = w / cols;
  const rows = 10;
  const R = [1.6, p * 0.168, p * 0.31, p / 2 + 0.25];
  const x = (level: number, f: number) => ((level - 1 + f) / 4) * w;
  const bandH = rows * p;

  return (
    <section ref={ref} aria-label={t('Les quatre niveaux d’autonomie et les réglages de Léa', 'The four autonomy levels and Léa’s settings')} className="px-moment relative w-full bg-white text-[#0a0a0a]">
      <div className="grid grid-cols-1 gap-x-3 gap-y-5 px-2 md:px-3 lg:grid-cols-12">
        <p className={`${H} max-w-[22em] lg:col-span-6 xl:col-span-5`}>{t('Quatre niveaux d’autonomie, réglés domaine par domaine. Plus la trame est dense, plus Proxy agit seul.', 'Four levels of autonomy, set domain by domain. The denser the screen, the more Proxy acts alone.')}</p>
        <div className="max-w-[440px] text-[14px] leading-[1.5] lg:col-span-3 lg:col-start-10 lg:min-h-[84px] lg:text-[13px]" aria-live="polite">
          {shown === null ? (
            <>
              <p className="text-black/60">{t('Toujours vrai, quel que soit le niveau', 'Always true, whatever the level')}</p>
              <p className="mt-1">{t('Une instruction trouvée dans un courriel ou une page web n’est jamais traitée comme un ordre de Léa.', 'An instruction found in an email or a web page is never treated as an order from Léa.')}</p>
            </>
          ) : (
            <div key={`${shown}-${at[shown]}`} className="px-read">
              <p className="text-black/60">{domains[shown].name} · <span style={GM}>0{at[shown]}</span> {levels[at[shown] - 1].name}</p>
              {at[shown] === HOME[shown] ? (
                <p className="mt-1">{domains[shown].rule}</p>
              ) : (
                <p className="mt-1">{levels[at[shown] - 1].gets} <span className="text-black/60">{t('Le réglage de Léa :', 'Léa’s setting:')} <span style={GM}>0{HOME[shown]}</span> {levels[HOME[shown] - 1].name}.</span></p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ───────── wide screens: one ramp across the page ───────── */}
      <div className="hidden lg:block">
        <div ref={band} className="relative mt-[178px] w-full" style={{ height: bandH || 300 }} onPointerLeave={() => drag === null && setDom(null)}>
          {w > 0 && (
            <svg width={w} height={bandH} className="absolute inset-0 block" aria-hidden>
              {[0, 1, 2, 3].map((z) => (
                <g key={z} style={{ opacity: focus === null || focus === z + 1 ? 1 : 0.13, transition: 'opacity 350ms ease' }}>
                  {Array.from({ length: (cols / 4) * rows }, (_, k) => {
                    const i = z * (cols / 4) + (k % (cols / 4));
                    const j = Math.floor(k / (cols / 4));
                    return <circle key={k} className="px-dot motion-reduce:!transition-none" cx={p * (i + 0.5)} cy={p * (j + 0.5)} r={R[z]} fill={INK} style={{ transform: `scale(${on ? 1 : 0})`, transitionDelay: `${i * 15 + j * 9}ms` }} />;
                  })}
                </g>
              ))}
            </svg>
          )}
          {w > 0 &&
            domains.map((d, i) => {
              const up = UP[i];
              const here = at[i];
              const px = x(here, slot(i));
              const dim = drag !== null ? drag !== i : (dom !== null && dom !== i) || (dom === null && lv !== null && lv !== here);
              const hint = d.next && here === HOME[i];
              const grab = {
                onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDrag(i);
                },
                onPointerMove: (e: React.PointerEvent<HTMLElement>) => drag === i && move(i, levelAt(e.clientX)),
                onPointerUp: () => setDrag(null),
                onPointerCancel: () => setDrag(null),
              };
              return (
                <div key={d.name} className="absolute left-0 w-0 motion-reduce:!transition-none" style={{ transform: `translateX(${px}px)`, top: -up, height: up + bandH / 2, opacity: on ? (dim ? 0.22 : 1) : 0, zIndex: drag === i ? 2 : 1, transition: `transform 420ms cubic-bezier(.3,.9,.3,1), opacity 400ms ease ${on && !dim && shown === null && lv === null && !moved ? 900 + i * 110 : 0}ms` }}>
                  <span aria-hidden className="absolute left-0 top-[20px] w-px" style={{ bottom: 14, background: INK, boxShadow: '0 0 0 1px #fff' }} />
                  {hint && (
                    <>
                      <span aria-hidden className="absolute bottom-0 h-[5px] translate-y-1/2 bg-white" style={{ left: 14, width: x(d.next!, 0.25) - px - 28 }}>
                        <span className="absolute inset-x-0 top-[2px] block h-px" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 3px, transparent 3px 7px)` }} />
                      </span>
                      <span aria-hidden className="absolute bottom-0 block h-[28px] w-[28px] -translate-x-1/2 translate-y-1/2 rounded-full bg-white" style={{ left: x(d.next!, 0.25) - px, outline: `1.5px dashed ${INK}`, outlineOffset: -2 }} />
                    </>
                  )}
                  <span {...grab} aria-hidden className="absolute bottom-0 left-0 block h-[28px] w-[28px] touch-pan-y rounded-full bg-white" style={{ boxShadow: `inset 0 0 0 2px ${INK}, 0 0 0 3px #fff`, cursor: drag === i ? 'grabbing' : 'grab', transform: `translate(-50%, 50%) scale(${drag === i ? 1.22 : 1})`, transition: 'transform 220ms cubic-bezier(.3,1.5,.5,1)' }} />
                  <button
                    type="button"
                    {...grab}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setDom(i)}
                    onFocus={() => setDom(i)}
                    onBlur={() => setDom(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') move(i, here + 1);
                      if (e.key === 'ArrowLeft') move(i, here - 1);
                    }}
                    aria-label={`${d.name} : ${levels[here - 1].name}`}
                    className={`absolute top-0 touch-pan-y select-none whitespace-nowrap border-[#121212] py-[2px] text-[13px] font-medium leading-[1.2] ${here === 4 ? 'right-0 border-r pl-3 pr-[9px] text-right' : 'left-[-1px] border-l pl-[9px] pr-3 text-left'}`}
                    style={{ cursor: drag === i ? 'grabbing' : 'grab' }}
                  >
                    {d.name}
                    {hint && <span className="font-normal text-black/60"> · {t('suggestion en attente', 'suggestion pending')} → <span style={GM}>03</span></span>}
                  </button>
                </div>
              );
            })}
        </div>
        <div className="grid grid-cols-4 px-3 pt-4 text-[13px] leading-[1.45]" onPointerLeave={() => setLv(null)}>
          {levels.map((l, i) => {
            const dim = focus !== null && focus !== i + 1;
            return (
              <button key={l.name} type="button" onPointerEnter={(e) => e.pointerType === 'mouse' && setLv(i + 1)} onFocus={() => setLv(i + 1)} onBlur={() => setLv(null)} onClick={() => setLv(lv === i + 1 ? null : i + 1)} aria-pressed={lv === i + 1} className="block pr-8 text-left transition-opacity duration-300" style={{ opacity: dim ? 0.3 : 1 }}>
                <span className="block text-black/60" style={GM}>0{i + 1}</span>
                <span className="block font-medium">{l.name}</span>
                <span className="mt-2 block text-black/60">{l.does}</span>
                <span className="block">{l.gets}</span>
                <span className="mt-3 flex h-[14px] items-center gap-3 text-black/60"><Sign level={i + 1} />{l.sign}</span>
              </button>
            );
          })}
        </div>
        <p className="flex items-baseline gap-5 px-3 pt-5 text-[12.5px] text-black/40">
          <span>{t('La même facture à classer, aux quatre niveaux. Survoler pour isoler, faire glisser un domaine pour changer son niveau.', 'The same invoice to file, at the four levels. Hover to isolate, drag a domain to change its level.')}</span>
          {moved && (
            <button type="button" onClick={() => setAt(HOME)} className="px-read text-[#0a0a0a] underline underline-offset-[3px]">
              {t('Revenir aux réglages de Léa', 'Back to Léa’s settings')}
            </button>
          )}
        </p>
      </div>

      {/* ───────── narrow screens: the ramp runs down the page, one density per level ───────── */}
      <div className="mt-8 lg:hidden">
        {levels.map((l, z) => {
          const here = domains.filter((d) => d.level === z + 1);
          const q = 15;
          const r = [1, 2.6, 4.7, q / 2 + 0.2][z];
          return (
            <div key={l.name} className="pb-7">
              <div aria-hidden className="h-[60px] w-full motion-reduce:!transition-none" style={{ backgroundImage: `radial-gradient(circle at center, ${INK} ${r}px, transparent ${r + 0.6}px)`, backgroundSize: `${q}px ${q}px`, backgroundPosition: 'center', opacity: on ? 1 : 0, transition: `opacity 600ms ease ${z * 160}ms` }} />
              <div className="grid max-w-[640px] grid-cols-[44px_1fr] px-2 pt-3 text-[14px] leading-[1.45] md:px-3">
                <p className="text-black/60" style={GM}>0{z + 1}</p>
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-black/60">{l.gets}</p>
                  <p className="mt-2 flex items-center gap-3 text-[13px] text-black/60"><Sign level={z + 1} />{l.sign}</p>
                  {here.length > 0 && (
                    <ul className="mt-3 border-t border-[#dcdfe2]">
                      {here.map((d) => (
                        <li key={d.name} className="border-b border-[#dcdfe2] py-[9px]">
                          <span className="font-medium">{d.name}</span>
                          {d.next && <span className="text-black/60"> · {t('suggestion en attente', 'suggestion pending')} → <span style={GM}>03</span></span>}
                          <span className="block text-[13px] text-black/60">{d.rule}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
