'use client';

import { ReactNode, useState } from 'react';
import { useT } from '../i18n';

type T = <V,>(fr: V, en: V) => V;

/** Fonts used by the prototypes, loaded only on pages that show a system. */
function Fonts() {
  return (
    <style>{`
@font-face{font-family:DSNR;font-weight:400;src:url('/proxy/prototype/fonts/newsreader-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:DSGM;font-weight:400;src:url('/proxy/prototype/fonts/geist-mono-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:DSGM;font-weight:500;src:url('/proxy/prototype/fonts/geist-mono-latin-500-normal.woff2') format('woff2')}
`}</style>
  );
}
const NR = { fontFamily: 'DSNR, Georgia, serif', letterSpacing: '-0.01em' } as const;
const GM = { fontFamily: 'DSGM, ui-monospace, monospace' } as const;

function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`block text-[11px] uppercase tracking-[0.08em] ${className}`}>{children}</span>;
}

/* ───────────────────────── PROXY — a specimen sheet in dots ───────────────────────── */

const P = { paper: '#f7f6f3', ink: '#121212', grey: '#8d8b85', line: '#e3e0d9', off: '#d6d3cc', warn: '#c9461f' };

/** A 5×5 grid where the number of lit dots says how much of a screen the colour takes. */
function Dose({ n, color }: { n: number; color: string }) {
  return (
    <div className="grid grid-cols-5 gap-[5px] w-fit">
      {Array.from({ length: 25 }).map((_, i) => (
        <span key={i} className="block w-[7px] h-[7px] rounded-full" style={{ background: i < n ? color : 'transparent', boxShadow: i < n && color === P.paper ? `inset 0 0 0 1px ${P.off}` : `inset 0 0 0 1px ${i < n ? color : P.line}` }} />
      ))}
    </div>
  );
}

const PRES: Record<string, string> = {
  work: '..a...aha.ahaha.aha...a..',
  wait: '......a.a.......a.a......',
  stop: 'w...w.w.w...w...w.w.w...w',
  idle: '............a............',
  done: 'aaaaa.....aaaaa.....aaaaa',
};
export function Presence({ k, size = 8 }: { k: string; size?: number }) {
  return (
    <div className="grid grid-cols-5 w-fit" style={{ gap: size * 0.7 }}>
      {PRES[k].split('').map((c, i) => (
        <span key={i} className="block rounded-full transition-colors duration-500" style={{ width: size, height: size, background: c === 'a' ? P.ink : c === 'h' ? P.grey : c === 'w' ? P.warn : P.off }} />
      ))}
    </div>
  );
}

export function ProxySystem() {
  const t = useT() as T;
  const colours = [
    { name: t('Papier', 'Paper'), hex: P.paper, n: 25, role: t('Fond de tous les écrans', 'Background of every screen') },
    { name: t('Encre', 'Ink'), hex: P.ink, n: 9, role: t('Texte, action principale', 'Text, primary action') },
    { name: t('Gris', 'Grey'), hex: P.grey, n: 6, role: t('Ce qui est secondaire', 'What is secondary') },
    { name: t('Filet', 'Hairline'), hex: P.line, n: 4, role: t('Séparer, jamais encadrer', 'Separate, never box in') },
    { name: t('Éteint', 'Off'), hex: P.off, n: 3, role: t('Points au repos', 'Dots at rest') },
    { name: t('Alerte', 'Alert'), hex: P.warn, n: 1, role: t('L’irréversible, la pause. Une fois par écran.', 'The irreversible, the pause. Once per screen.') },
  ];
  return (
    <section className="mt-6" style={{ background: P.paper, color: P.ink }}>
      <Fonts />
      {/* header strip */}
      <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b" style={{ borderColor: P.line }}>
        <div className="flex items-center gap-3">
          <Presence k="work" size={4} />
          <span className="text-[13px] font-medium">Proxy</span>
          <span className="text-[13px]" style={{ color: P.grey }}>{t('— système', '— system')}</span>
        </div>
        <span className="text-[11px]" style={{ ...GM, color: P.grey }}>v1 · 6 {t('couleurs', 'colours')} · 3 {t('familles', 'families')} · 0 px {t('de rayon', 'radius')}</span>
      </div>

      {/* colours: each one a dose */}
      <div className="px-5 md:px-8 pt-8 pb-3">
        <Label className="text-black/45">{t('Couleur · le nombre de points dit la place qu’elle prend', 'Colour · the number of dots says how much room it takes')}</Label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 border-t" style={{ borderColor: P.line }}>
        {colours.map((c, i) => (
          <div key={c.hex} className={`p-5 md:p-6 flex flex-col gap-5 border-b md:border-b-0 ${i % 2 === 0 ? 'border-r' : 'md:border-r'} ${i === 5 ? 'md:border-r-0' : ''}`} style={{ borderColor: P.line }}>
            <Dose n={c.n} color={c.hex} />
            <div className="space-y-1">
              <span className="block text-[13px] font-medium" style={i === 5 ? { color: P.warn } : undefined}>{c.name}</span>
              <span className="block text-[11px]" style={{ ...GM, color: P.grey }}>{c.hex}</span>
              <span className="block text-[12px] leading-snug pt-1" style={{ color: P.grey }}>{c.role}</span>
            </div>
          </div>
        ))}
      </div>

      {/* type */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-t" style={{ borderColor: P.line }}>
        <div className="md:col-span-6 p-5 md:p-8 md:border-r" style={{ borderColor: P.line }}>
          <div className="flex justify-between text-[11px]" style={{ ...GM, color: P.grey }}><span>Newsreader 400</span><span>40 / 1.08</span></div>
          <p className="mt-6 text-[34px] md:text-[48px] leading-[1.06]" style={NR}>{t('Réserver Paris → Lyon, jeudi 7\u00a0h\u00a056.', 'Book Paris → Lyon, Thursday\u00a07:56.')}</p>
          <p className="mt-4 text-[12px]" style={{ color: P.grey }}>{t('Pour ce que Proxy va faire, ou te demande. Une phrase, jamais un titre de rubrique.', 'For what Proxy is about to do, or asks you. A sentence, never a section heading.')}</p>
        </div>
        <div className="md:col-span-3 p-5 md:p-8 border-t md:border-t-0 md:border-r" style={{ borderColor: P.line }}>
          <div className="flex justify-between text-[11px]" style={{ ...GM, color: P.grey }}><span>General Sans</span><span>14 / 1.45</span></div>
          <p className="mt-6 text-[15px] leading-[1.45]">{t('Payer 89 € avec ta carte pro.', 'Pay €89 with your work card.')}</p>
          <p className="mt-2 text-[15px] leading-[1.45]" style={{ color: P.grey }}>{t('Réversible jusqu’au départ', 'Reversible until departure')}</p>
          <p className="mt-4 text-[12px]" style={{ color: P.grey }}>{t('L’interface et les étapes.', 'Interface and steps.')}</p>
        </div>
        <div className="md:col-span-3 p-5 md:p-8 border-t md:border-t-0" style={{ borderColor: P.line }}>
          <div className="flex justify-between text-[11px]" style={{ ...GM, color: P.grey }}><span>Geist Mono</span><span>11</span></div>
          <p className="mt-6 text-[13px] leading-[1.9]" style={GM}>10:41 · 89 €<br />142 € / 300 €<br />•••• 4417</p>
          <p className="mt-4 text-[12px]" style={{ color: P.grey }}>{t('Heures, montants, traces. Ce qu’on vérifie.', 'Times, amounts, traces. What you check.')}</p>
        </div>
      </div>

      {/* components */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t" style={{ borderColor: P.line }}>
        <div className="p-5 md:p-8 md:border-r space-y-5" style={{ borderColor: P.line }}>
          <Label className="text-black/45">{t('Actions', 'Actions')}</Label>
          <div className="flex flex-wrap gap-2 text-[13px]">
            <span className="px-4 py-[10px] font-medium" style={{ background: P.ink, color: P.paper }}>{t('Valider', 'Approve')}</span>
            <span className="px-4 py-[10px]" style={{ boxShadow: `inset 0 0 0 1px ${P.ink}` }}>{t('Modifier', 'Edit')}</span>
            <span className="px-4 py-[10px]" style={{ boxShadow: `inset 0 0 0 1px ${P.line}` }}>{t('Refuser', 'Decline')}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[12px]">
            <span className="px-2 py-[3px]" style={{ boxShadow: `inset 0 0 0 1px ${P.line}`, color: P.grey }}>{t('Agenda', 'Calendar')}</span>
            <span className="px-2 py-[3px]" style={{ background: P.ink, color: P.paper }}>{t('Tout', 'All')}</span>
            <span className="px-2 py-[3px]" style={{ boxShadow: `inset 0 0 0 1px ${P.warn}`, color: P.warn }}>{t('Irréversible', 'Irreversible')}</span>
          </div>
          <p className="text-[12px]" style={{ color: P.grey }}>{t('Trois poids : plein, filet noir, filet clair. Le refus n’est jamais rouge.', 'Three weights: filled, black hairline, light hairline. Declining is never red.')}</p>
        </div>
        <div className="p-5 md:p-8 md:border-r border-t md:border-t-0 space-y-4" style={{ borderColor: P.line }}>
          <Label className="text-black/45">{t('Autonomie', 'Autonomy')}</Label>
          {[t('Observer', 'Observe'), t('Proposer', 'Propose'), t('Agir, puis prévenir', 'Act, then tell'), t('Agir seul', 'Act alone')].map((l, i) => (
            <div key={l} className="grid grid-cols-[1fr_120px] items-center gap-4">
              <span className="text-[13px]">{l}</span>
              <div className="flex gap-[3px]">
                {[0, 1, 2, 3].map((j) => (
                  <span key={j} className="h-[5px] flex-1" style={{ background: j <= i ? P.ink : P.line }} />
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-[1fr_120px] items-center gap-4">
            <span className="text-[13px]" style={{ color: P.grey }}>{t('Suggéré', 'Suggested')}</span>
            <span className="h-[5px]" style={{ background: `repeating-linear-gradient(90deg, ${P.grey} 0 2px, transparent 2px 5px)` }} />
          </div>
        </div>
        <div className="p-5 md:p-8 border-t md:border-t-0 space-y-5" style={{ borderColor: P.line }}>
          <Label className="text-black/45">{t('Présence', 'Presence')}</Label>
          <div className="flex gap-8">
            {(['work', 'wait', 'stop'] as const).map((k) => (
              <div key={k} className="space-y-3">
                <Presence k={k} size={7} />
                <span className="block text-[12px]" style={k === 'stop' ? { color: P.warn } : { color: P.grey }}>
                  {k === 'work' ? t('travaille', 'working') : k === 'wait' ? t('attend', 'waiting') : t('arrêté', 'stopped')}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[12px]" style={{ color: P.grey }}>{t('Le seul élément animé. Toujours accompagné d’une phrase.', 'The only animated element. Always comes with a sentence.')}</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── DAILIES — a contact sheet ───────────────────────── */

const D = {
  studio: { bg: '#0b0b0c', surface: '#1a1a1c', line: '#1f1f22', ink: '#ececed', mut: '#8b8b91', dim: '#5c5c62' },
  client: { bg: '#f1efea', surface: '#ffffff', line: '#dcd9d1', ink: '#141414', mut: '#76736c', dim: '#b5b1a8' },
};
const STATUS = (t: T) => [
  { c: '#4a4a50', fr: t('À faire', 'To do') },
  { c: '#7aa7ff', fr: t('En génération', 'Generating') },
  { c: '#f2c46b', fr: t('Dans la version', 'In the cut') },
  { c: '#ff7a66', fr: t('Retour à traiter', 'Feedback') },
  { c: '#7fd99a', fr: t('Validé', 'Approved') },
];

function Perfs() {
  return (
    <div className="flex justify-between px-3 py-[6px] bg-[#0b0b0c]">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="block w-[10px] h-[6px] rounded-[1.5px] bg-[#f1efea]/80" />
      ))}
    </div>
  );
}

function Frame({ n, label, dark = false, children }: { n: string; label: string; dark?: boolean; children: ReactNode }) {
  const m = dark ? D.studio : D.client;
  return (
    <div className="flex flex-col" style={{ background: m.bg, color: m.ink }}>
      <div className="flex justify-between px-4 pt-3 text-[11px]" style={{ color: m.mut }}>
        <span className="tabular-nums">{n}</span>
        <span>{label}</span>
      </div>
      <div className="flex-1 p-4 md:p-5 flex flex-col justify-center gap-3 min-h-[200px]">{children}</div>
    </div>
  );
}

export function DailiesSystem() {
  const t = useT() as T;
  const s = STATUS(t);
  return (
    <section className="mt-6 bg-[#0b0b0c]">
      <Fonts />
      <Perfs />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[6px] px-[6px]">
        {/* 01 two modes */}
        <Frame n="A01" label={t('Studio', 'Studio')} dark>
          <div className="flex gap-2">
            {Object.entries(D.studio).map(([k, v]) => (
              <span key={k} title={`${k} ${v}`} className="h-12 flex-1" style={{ background: v, boxShadow: `inset 0 0 0 1px ${D.studio.line}` }} />
            ))}
          </div>
          <p className="text-[12px] leading-snug" style={{ color: D.studio.mut }}>{t('Sombre, pour juger des images pendant des heures.', 'Dark, to judge images for hours.')}</p>
          <span className="text-[11px]" style={{ ...GM, color: D.studio.dim }}>#0b0b0c · #1a1a1c · #ececed</span>
        </Frame>
        <Frame n="A02" label={t('Client', 'Client')}>
          <div className="flex gap-2">
            {Object.entries(D.client).map(([k, v]) => (
              <span key={k} title={`${k} ${v}`} className="h-12 flex-1" style={{ background: v, boxShadow: `inset 0 0 0 1px ${D.client.line}` }} />
            ))}
          </div>
          <p className="text-[12px] leading-snug" style={{ color: D.client.mut }}>{t('Clair et calme : le client ne voit qu’une version.', 'Light and calm: the client sees one version.')}</p>
          <span className="text-[11px]" style={{ ...GM, color: D.client.mut }}>#f1efea · #ffffff · #141414</span>
        </Frame>
        {/* 03 type */}
        <Frame n="A03" label={t('Typo studio', 'Studio type')} dark>
          <p className="text-[34px] font-medium leading-[1] tracking-[-0.03em]">214 / 400</p>
          <p className="text-[13px]" style={{ color: D.studio.mut }}>General Sans · {t('chiffres tabulaires', 'tabular figures')}</p>
          <p className="text-[12px] leading-snug" style={{ color: D.studio.dim }}>{t('Rendus, crédits, durées : tout s’aligne en colonne.', 'Renders, credits, durations: everything lines up.')}</p>
        </Frame>
        <Frame n="A04" label={t('Typo client', 'Client type')}>
          <p className="text-[34px] leading-[1.02]" style={NR}>From the Other Shore</p>
          <p className="text-[13px]" style={{ color: D.client.mut }}>Newsreader · {t('le titre du film', 'the film’s title')}</p>
          <p className="text-[12px] leading-snug" style={{ color: D.client.mut }}>{t('Côté client, le film passe avant l’outil.', 'On the client side, the film comes before the tool.')}</p>
        </Frame>
      </div>
      <Perfs />
      {/* status strip: the life of a shot */}
      <div className="px-[6px]">
        <div className="bg-[#0b0b0c] text-[#ececed] px-4 md:px-5 py-5">
          <div className="flex justify-between text-[11px] text-[#8b8b91]"><span>B01</span><span>{t('La vie d’un plan', 'The life of a shot')}</span></div>
          <div className="mt-5 grid grid-cols-5">
            {s.map((x, i) => (
              <div key={x.c} className="relative">
                <span className="block h-[3px]" style={{ background: x.c }} />
                <span className="absolute -top-[5px] left-0 w-[13px] h-[13px] rounded-full" style={{ background: x.c, boxShadow: '0 0 0 3px #0b0b0c' }} />
                <span className="block mt-4 text-[12px] pr-2">{x.fr}</span>
                <span className="block text-[11px] text-[#5c5c62]" style={GM}>0{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[12px] text-[#8b8b91] max-w-xl">{t('Cinq statuts, une pastille de 7 px. Une couleur par étape, toujours dans cet ordre, sur tous les écrans.', 'Five statuses, a 7 px dot. One colour per step, always in this order, on every screen.')}</p>
        </div>
      </div>
      <Perfs />
      {/* components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[6px] px-[6px]">
        <Frame n="C01" label={t('Actions studio', 'Studio actions')} dark>
          <div className="flex flex-wrap gap-2 text-[13px]">
            <span className="px-4 py-[10px] rounded-[4px] font-medium bg-[#ececed] text-[#0b0b0c]">{t('Envoyer au client', 'Send to client')}</span>
            <span className="px-[14px] py-[9px] rounded-[4px] border border-[#2f2f33] text-[#d8d8dc]">{t('Comparer', 'Compare')}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[12px]">
            <span className="px-3 py-[5px] rounded-full bg-[#ececed] text-[#0b0b0c]">{t('Plans', 'Shots')}</span>
            <span className="px-3 py-[5px] rounded-full border border-[#2a2a2e] text-[#b9b9bf]">{t('Versions', 'Versions')}</span>
            <span className="px-3 py-[5px] rounded-full border border-[#2a2a2e] text-[#b9b9bf]">{t('Retours', 'Feedback')}</span>
          </div>
        </Frame>
        <Frame n="C02" label={t('Actions client', 'Client actions')}>
          <span className="block py-[14px] text-center text-[12px] font-medium uppercase tracking-[0.06em] bg-[#141414] text-[#f1efea]">{t('Valider cette version', 'Approve this version')}</span>
          <div className="flex flex-wrap gap-2 text-[12px]">
            <span className="px-[11px] py-[6px] rounded-[3px] bg-white">{t('À 0:17 · plan 05', 'At 0:17 · shot 05')}</span>
            <span className="px-3 py-[5px] rounded-full bg-white">{t('Sur tout le film', 'On the whole film')}</span>
          </div>
        </Frame>
        <Frame n="C03" label={t('Règles', 'Rules')} dark>
          <ul className="text-[12px] leading-[1.7] text-[#b9b9bf]">
            <li><span style={GM} className="text-[#5c5c62] mr-2">4 px</span>{t('rayon des boutons', 'button radius')}</li>
            <li><span style={GM} className="text-[#5c5c62] mr-2">1 px</span>{t('filets #1f1f22', '#1f1f22 hairlines')}</li>
            <li><span style={GM} className="text-[#5c5c62] mr-2">13 px</span>{t('taille de base', 'base size')}</li>
            <li><span style={GM} className="text-[#5c5c62] mr-2">30 px</span>{t('pilules pour filtrer', 'pills to filter')}</li>
          </ul>
        </Frame>
      </div>
      <Perfs />
    </section>
  );
}

/* ───────────────────────── COLOSSE — a technical plate, day and night ───────────────────────── */

const C = {
  day: { ink: '#0a0a0a', bg: '#ffffff', sig: '#0a0a0a', red: '#e3382a', amb: '#c97d00', water: '#3b7cb0', rgb: '10,10,10' },
  night: { ink: '#ecebe4', bg: '#0b0b0a', sig: '#d6ff4a', red: '#ff5b4a', amb: '#ffb547', water: '#7fb2d9', rgb: '236,235,228' },
};

export function ColosseSystem() {
  const t = useT() as T;
  const [night, setNight] = useState(false);
  const m = night ? C.night : C.day;
  const line = `rgba(${m.rgb},.2)`;
  const mut = `rgba(${m.rgb},.55)`;
  const tokens = [
    { k: '--ink', role: t('Texte, terrain', 'Text, ground'), d: C.day.ink, n: C.night.ink },
    { k: '--bg', role: t('Fond', 'Background'), d: C.day.bg, n: C.night.bg },
    { k: '--sig', role: t('Le présent : la roue, maintenant', 'The present: the wheel, now'), d: C.day.sig, n: C.night.sig },
    { k: '--red', role: t('Alarme : arrêter ou décider', 'Alarm: stop or decide'), d: C.day.red, n: C.night.red },
    { k: '--amb', role: t('Attention : surveiller', 'Caution: keep watching'), d: C.day.amb, n: C.night.amb },
    { k: '--water', role: t('Nappe d’eau', 'Water table'), d: C.day.water, n: C.night.water },
  ];
  return (
    <section className="mt-6 border transition-colors duration-300" style={{ background: m.bg, color: m.ink, borderColor: line }}>
      <Fonts />
      {/* plate header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-8 py-4 border-b" style={{ borderColor: line }}>
        <span className="text-[11px] tracking-[0.06em]" style={{ ...GM, color: mut }}>COLOSSE · {t('PLAQUE SYSTÈME', 'SYSTEM PLATE')} · REV. 2</span>
        <div className="flex text-[12px]" style={{ boxShadow: `inset 0 0 0 1px rgba(${m.rgb},.35)` }}>
          {[false, true].map((v) => (
            <button key={String(v)} onClick={() => setNight(v)} className="px-3 py-[7px]" style={night === v ? { background: m.ink, color: m.bg } : undefined}>
              {v ? t('Cabine · nuit', 'Cab · night') : t('Jour', 'Day')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* token table */}
        <div className="md:col-span-7 md:border-r" style={{ borderColor: line }}>
          <div className="grid grid-cols-[96px_1fr_64px_64px] md:grid-cols-[120px_1fr_80px_80px] px-5 md:px-8 py-3 text-[10.5px] tracking-[0.06em]" style={{ ...GM, color: mut }}>
            <span>TOKEN</span><span>{t('RÔLE', 'ROLE')}</span><span>{t('JOUR', 'DAY')}</span><span>{t('NUIT', 'NIGHT')}</span>
          </div>
          {tokens.map((x) => (
            <div key={x.k} className="grid grid-cols-[96px_1fr_64px_64px] md:grid-cols-[120px_1fr_80px_80px] items-center px-5 md:px-8 py-3 border-t" style={{ borderColor: line }}>
              <span className="text-[12px]" style={GM}>{x.k}</span>
              <span className="text-[13px] pr-3">{x.role}</span>
              {[x.d, x.n].map((hex, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-[18px] h-[18px]" style={{ background: hex, boxShadow: `inset 0 0 0 1px ${line}`, outline: (i === 1) === night ? `1px solid ${m.ink}` : 'none', outlineOffset: 2 }} />
                  <span className="hidden md:inline text-[10px]" style={{ ...GM, color: mut }}>{hex.slice(1)}</span>
                </span>
              ))}
            </div>
          ))}
          <p className="px-5 md:px-8 py-4 border-t text-[12px]" style={{ borderColor: line, color: mut }}>
            {t('Mêmes noms, deux jeux de valeurs. Les écrans ne connaissent que les tokens : passer en cabine ne change aucun composant.', 'Same names, two sets of values. Screens only know the tokens: switching to cab mode changes no component.')}
          </p>
        </div>

        {/* readouts and controls */}
        <div className="md:col-span-5 flex flex-col">
          <div className="px-5 md:px-8 py-6 border-t md:border-t-0 border-b" style={{ borderColor: line }}>
            <span className="text-[10.5px] tracking-[0.06em]" style={{ ...GM, color: mut }}>{t('PROFONDEUR', 'DEPTH')}</span>
            <div className="mt-1 text-[44px] md:text-[56px] font-medium tracking-[-0.02em] tabular-nums leading-none">−22,4 m</div>
            <span className="text-[11px]" style={{ ...GM, color: mut }}>{t('General Sans 500 · chiffres tabulaires', 'General Sans 500 · tabular figures')}</span>
            {/* the line of the present over a ground section */}
            <svg viewBox="0 0 300 70" className="mt-5 w-full h-[70px]">
              <defs>
                <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke={`rgba(${m.rgb},.3)`} strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="20" width="300" height="50" fill="url(#hatch)" />
              <rect x="0" y="44" width="300" height="10" fill={m.water} opacity=".35" />
              <ellipse cx="214" cy="40" rx="16" ry="9" fill={m.bg} stroke={m.red} strokeWidth="1.5" />
              <line x1="180" y1="0" x2="180" y2="70" stroke={m.sig} strokeWidth="2" />
              <text x="184" y="10" fontSize="9" fill={m.ink} style={GM}>{t('MAINTENANT', 'NOW')}</text>
            </svg>
          </div>
          <div className="px-5 md:px-8 py-6 space-y-4 flex-1">
            <span className="block text-[10.5px] tracking-[0.06em]" style={{ ...GM, color: mut }}>{t('COMMANDES', 'CONTROLS')}</span>
            <div className="flex flex-wrap gap-2 text-[14px]">
              <span className="px-[14px] py-[11px] font-medium" style={{ background: m.sig, color: m.bg }}>{t('Option A', 'Option A')}</span>
              <span className="px-[14px] py-[11px]" style={{ boxShadow: `inset 0 0 0 1px rgba(${m.rgb},.35)` }}>{t('Option B', 'Option B')}</span>
              <span className="px-[14px] py-[11px]" style={{ opacity: 0.35, boxShadow: `inset 0 0 0 1px rgba(${m.rgb},.35)` }}>{t('Reprendre', 'Resume')}</span>
            </div>
            <div className="inline-flex text-[12px]" style={{ boxShadow: `inset 0 0 0 1px rgba(${m.rgb},.35)` }}>
              {['1 h', '6 h', '24 h'].map((v, i) => (
                <span key={v} className="px-[10px] py-2" style={i === 1 ? { background: m.ink, color: m.bg } : undefined}>{v}</span>
              ))}
            </div>
            <div className="px-4 py-3 text-[13px]" style={{ boxShadow: `inset 0 0 0 1px ${m.red}` }}>
              <span className="block text-[10.5px] tracking-[0.06em]" style={{ ...GM, color: m.red }}>{t('ANOMALIE · 14 M DEVANT LA ROUE', 'ANOMALY · 14 M AHEAD OF THE WHEEL')}</span>
              <span className="block mt-1">{t('Vide probable, sous une école.', 'Probable void, under a school.')}</span>
            </div>
            <p className="text-[12px]" style={{ color: mut }}>{t('Pas de rayon, pas d’ombre : des cadres de 1 px, lisibles sous les néons comme dans le noir.', 'No radius, no shadow: 1 px frames, readable under strip lights and in the dark.')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
