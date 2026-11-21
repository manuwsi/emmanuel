'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useT } from '@/components/i18n';

type Pair = { name: string; day: string; night: string; alt: string };
type Labels = { left: string; right: string; leftAlt: string; rightAlt: string; aria: string };

/** Two versions of the same screen: drag the line to compare (day / cab mode by default). */
export default function Compare({ pairs, width = 2880, height = 1800, labels }: { pairs: Pair[]; width?: number; height?: number; labels?: Labels }) {
  const t = useT();
  const L: Labels = labels ?? {
    left: t('Jour', 'Day'),
    right: t('Cabine', 'Cab'),
    leftAlt: t('jour', 'day'),
    rightAlt: t('mode cabine', 'cab mode'),
    aria: t('Comparer jour et mode cabine', 'Compare day and cab mode'),
  };
  const [i, setI] = useState(0);
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const p = pairs[i];
  return (
    <figure className="w-full">
      {pairs.length > 1 && (
        <div className="mb-3 flex gap-1 text-[13px]">
          {pairs.map((q, k) => (
            <button
              key={q.name}
              onClick={() => setI(k)}
              className={`border px-2.5 py-1 transition-colors ${k === i ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white' : 'border-black/25 hover:border-black'}`}
            >
              {q.name}
            </button>
          ))}
        </div>
      )}
      <div
        ref={box}
        className="relative w-full cursor-ew-resize select-none overflow-hidden border border-black/15 [touch-action:pan-y]"
        style={{ aspectRatio: `${width}/${height}` }}
        onPointerDown={(e) => {
          drag.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          move(e.clientX);
        }}
        onPointerMove={(e) => drag.current && move(e.clientX)}
        onPointerUp={() => (drag.current = false)}
        onPointerCancel={() => (drag.current = false)}
      >
        <Image src={p.night} alt={`${p.alt}, ${L.rightAlt}`} fill unoptimized draggable={false} className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={p.day} alt={`${p.alt}, ${L.leftAlt}`} fill unoptimized draggable={false} className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -ml-px w-[2px] bg-white mix-blend-difference" />
          <div className="absolute top-1/2 -ml-[18px] -mt-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-[#0a0a0a] bg-white text-[12px] text-[#0a0a0a]">
            ↔
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={L.aria}
          className="sr-only"
        />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
        <span>← {L.left}</span>
        <span className="text-center text-black/50">{t('Fais glisser la ligne', 'Drag the line')}</span>
        <span>{L.right} →</span>
      </figcaption>
    </figure>
  );
}
