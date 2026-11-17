'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useT } from '@/components/i18n';

const CARDS = [
  { id: 'reshiram', name: 'Reshiram ex', game: 'Pokémon · JP', w: 645, h: 900, value: '1 240', delta: '+18', paid: '1 040' },
  { id: 'roger', name: 'Gol D. Roger', game: 'One Piece · JP', w: 681, h: 900, value: '860', delta: '+26', paid: '690' },
  { id: 'stardust', name: 'Stardust Dragon', game: 'Yu-Gi-Oh! · EN', w: 643, h: 900, value: '212', delta: '−3', paid: '219' },
  { id: 'zekrom', name: 'Zekrom ex', game: 'Pokémon · EN', w: 647, h: 900, value: '180', delta: '+7', paid: '168' },
  { id: 'mewtwo', name: 'Mewtwo Delta', game: 'Pokémon · FR', w: 643, h: 900, value: '410', delta: '+31', paid: '313' },
];

export default function HoloCard() {
  const t = useT();
  const [i, setI] = useState(0);
  const card = CARDS[i];
  const stage = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLDivElement>(null);
  const hover = useRef(false);

  const set = (x: number, y: number) => {
    const n = el.current;
    if (!n) return;
    n.style.setProperty('--px', x.toFixed(3));
    n.style.setProperty('--py', y.toFixed(3));
  };

  // mouvement au repos : la carte respire, même sans souris (mobile compris)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      set(0.4, 0.35);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      if (!hover.current) {
        const s = (now - start) / 1000;
        set(0.5 + Math.sin(s * 0.9) * 0.28, 0.5 + Math.cos(s * 0.7) * 0.22);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    hover.current = true;
    set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
  };

  const neg = card.delta.startsWith('−');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 bg-[#08090b] text-white">
      <div
        ref={stage}
        onPointerMove={onMove}
        onPointerLeave={() => (hover.current = false)}
        className="md:col-span-7 relative min-h-[520px] md:min-h-[720px] flex items-center justify-center overflow-hidden touch-pan-y"
        style={{ background: 'radial-gradient(90% 70% at 50% 0%, #17191e 0%, #08090b 70%)', perspective: '1100px' }}
      >
        <div
          ref={el}
          className="relative"
          style={
            {
              '--px': 0.4,
              '--py': 0.35,
              width: 'min(300px, 62vw)',
              aspectRatio: `${card.w} / ${card.h}`,
              transform: 'rotateY(calc((var(--px) - 0.5) * 30deg)) rotateX(calc((0.5 - var(--py)) * 30deg))',
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 40px 50px rgba(0,0,0,.7))',
            } as React.CSSProperties
          }
        >
          <Image
            unoptimized
            key={card.id}
            src={`/foil/cards/${card.id}.webp`}
            alt={`${card.name}, ${card.game}`}
            width={card.w}
            height={card.h}
            sizes="320px"
            className="w-full h-full block rounded-[4.5%]"
            priority
          />
          <div
            className="absolute inset-0 rounded-[4.5%] pointer-events-none"
            style={{
              background: 'linear-gradient(115deg, transparent 18%, rgba(255,119,115,.65) 28%, rgba(255,237,95,.6) 36%, rgba(168,255,95,.55) 44%, rgba(131,255,247,.65) 52%, rgba(120,148,255,.65) 60%, rgba(216,117,255,.6) 68%, transparent 80%)',
              backgroundSize: '260% 260%',
              backgroundPosition: 'calc(var(--px) * 100%) calc(var(--py) * 100%)',
              mixBlendMode: 'color-dodge',
              opacity: 0.5,
            }}
          />
          <div
            className="absolute inset-0 rounded-[4.5%] pointer-events-none"
            style={{
              background: 'linear-gradient(115deg, transparent 18%, rgba(255,119,115,.65) 28%, rgba(255,237,95,.6) 36%, rgba(168,255,95,.55) 44%, rgba(131,255,247,.65) 52%, rgba(120,148,255,.65) 60%, rgba(216,117,255,.6) 68%, transparent 80%)',
              backgroundSize: '260% 260%',
              backgroundPosition: 'calc(var(--px) * 100%) calc(var(--py) * 100%)',
              mixBlendMode: 'multiply',
              opacity: 0.55,
            }}
          />
          <div
            className="absolute inset-0 rounded-[4.5%] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at calc(var(--px) * 100%) calc(var(--py) * 100%), rgba(255,255,255,.7), rgba(255,255,255,0) 42%)',
              mixBlendMode: 'overlay',
            }}
          />
        </div>
        <span className="absolute left-6 bottom-5 text-[12px] text-white/45">
          {t('Bouge sur la carte', 'Move over the card')}
        </span>
      </div>

      <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-white/15 flex flex-col">
        <div className="p-6 md:p-8 border-b border-white/15">
          <span className="text-[12px] tracking-[0.08em] uppercase text-white/45">{card.game}</span>
          <h4 className="text-2xl font-light tracking-[-0.03em] mt-1">{card.name}</h4>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-5xl font-extralight tracking-[-0.04em] tabular-nums">{card.value} €</span>
            <span className="text-sm">{neg ? '▼' : '▲'} {card.delta.slice(1)} %</span>
          </div>
          <p className="text-[13px] text-white/45 mt-1">{t(`Payé ${card.paid} €, valeur de marché aujourd’hui`, `Paid ${card.paid} €, market value today`)}</p>
        </div>
        <ul className="flex-1">
          {CARDS.map((c, k) => (
            <li key={c.id}>
              <button
                onClick={() => setI(k)}
                aria-pressed={k === i}
                className={`w-full flex items-center gap-4 px-6 md:px-8 py-4 border-b border-white/10 text-left transition-colors ${k === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
              >
                <Image unoptimized loading="eager" src={`/foil/cards/${c.id}.webp`} alt="" width={c.w} height={c.h} sizes="40px" className="w-10 h-auto rounded-[3px]" />
                <span className="flex-1">
                  <span className="block text-[15px]">{c.name}</span>
                  <span className="block text-[12px] text-white/45">{c.game}</span>
                </span>
                <span className="text-[14px] tabular-nums text-white/70">{c.value} €</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
