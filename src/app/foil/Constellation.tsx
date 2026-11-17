'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/components/i18n';

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GAMES = [
  { id: 'pokemon', name: 'Pokémon', n: 92, value: 2640, delta: '+14', cx: 270, cy: 270, R: 170, dur: 9 },
  { id: 'onepiece', name: 'One Piece', n: 31, value: 890, delta: '+21', cx: 590, cy: 160, R: 95, dur: 11 },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', n: 25, value: 688, delta: '+3', cx: 610, cy: 395, R: 85, dur: 13 },
];

export default function Constellation() {
  const t = useT();
  const [sel, setSel] = useState<string | null>(null);

  const dots = useMemo(() => {
    const r = rng(11);
    return GAMES.map((g) =>
      Array.from({ length: g.n * 2 }, () => {
        const a = r() * Math.PI * 2;
        const d = Math.pow(r(), 0.6) * g.R;
        const sizes = [1.2, 1.6, 2, 2.6, 3.4, 5];
        return { x: g.cx + d * Math.cos(a), y: g.cy + d * Math.sin(a), r: sizes[Math.floor(r() * sizes.length)], o: 0.3 + r() * 0.65 };
      })
    );
  }, []);

  const shown = sel ? GAMES.filter((g) => g.id === sel) : GAMES;
  const total = shown.reduce((s, g) => s + g.value, 0);
  const count = shown.reduce((s, g) => s + g.n, 0);
  const fmt = (n: number) => n.toLocaleString('fr-FR').replace(/ /g, ' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 bg-[#08090b] text-white">
      <div className="md:col-span-8 relative" style={{ background: 'radial-gradient(90% 70% at 50% 0%, #17191e 0%, #08090b 70%)' }}>
        <svg viewBox="0 0 800 540" className="w-full h-auto block" role="img" aria-label={t('Constellation de la collection : un point par carte, regroupés par jeu', 'Collection constellation: one dot per card, grouped by game')}>
          {GAMES.map((g, gi) => (
            <g
              key={g.id}
              style={{ opacity: !sel || sel === g.id ? 1 : 0.12, transition: 'opacity .5s', animation: `ecDrift ${g.dur}s ease-in-out infinite alternate` }}
              onPointerEnter={() => setSel(g.id)}
              onPointerLeave={() => setSel(null)}
              className="cursor-pointer"
            >
              <circle cx={g.cx} cy={g.cy} r={g.R + 28} fill="transparent" />
              {dots[gi].map((d, k) => (
                <circle key={k} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r} fill="#fff" fillOpacity={d.o.toFixed(2)} />
              ))}
              <text x={g.cx} y={g.cy + g.R + 40} textAnchor="middle" fill="#fff" fillOpacity=".7" fontSize="15">
                {g.name} · {g.n}
              </text>
            </g>
          ))}
        </svg>
        <style>{`@keyframes ecDrift{from{transform:translate(0,0)}to{transform:translate(6px,-8px)}}@media (prefers-reduced-motion:reduce){svg g{animation:none!important}}`}</style>
      </div>
      <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/15 flex flex-col">
        <div className="p-6 md:p-8 border-b border-white/15">
          <span className="text-[12px] tracking-[0.08em] uppercase text-white/45">{sel ? shown[0].name : t('Toute la collection', 'Whole collection')}</span>
          <div className="text-5xl font-extralight tracking-[-0.04em] mt-2 tabular-nums">{fmt(total)} €</div>
          <p className="text-[13px] text-white/45 mt-1">{count} {t('cartes', 'cards')}</p>
        </div>
        <ul className="flex-1">
          {GAMES.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => setSel(sel === g.id ? null : g.id)}
                aria-pressed={sel === g.id}
                className={`w-full flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/10 text-left transition-colors ${sel === g.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
              >
                <span>
                  <span className="block text-[15px]">{g.name}</span>
                  <span className="block text-[12px] text-white/45">{g.n} {t('cartes', 'cards')}</span>
                </span>
                <span className="text-right">
                  <span className="block text-[14px] tabular-nums">{fmt(g.value)} €</span>
                  <span className="block text-[12px] text-white/45">▲ {g.delta.slice(1)} %</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="p-6 md:p-8 text-[12px] text-white/40">{t('Passe sur un groupe, ou choisis un jeu dans la liste.', 'Hover a group, or pick a game in the list.')}</p>
      </div>
    </div>
  );
}
