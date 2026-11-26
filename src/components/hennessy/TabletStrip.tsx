'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/** The tablet screens in order, each in a slim black bezel, dragged sideways. */
export default function TabletStrip({ items, hint }: { items: { src: string; n: string; title: string; text: string }[]; hint: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [progress, setProgress] = useState(0);
  const drag = useRef<{ x: number; left: number } | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      const first = el.firstElementChild as HTMLElement | null;
      const step = first ? first.offsetWidth + 8 : 1;
      setAt(Math.min(items.length - 1, Math.round(el.scrollLeft / step)));
    };
    on();
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [items.length]);

  const goTo = (i: number) => {
    const el = track.current;
    const c = el?.children[i] as HTMLElement | undefined;
    if (el && c) el.scrollTo({ left: c.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={track}
        onPointerDown={(e) => { if (e.pointerType === 'mouse' && track.current) drag.current = { x: e.clientX, left: track.current.scrollLeft }; }}
        onPointerMove={(e) => { const d = drag.current; if (d && track.current) track.current.scrollLeft = d.left - (e.clientX - d.x); }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        className="flex cursor-grab select-none gap-2 overflow-x-auto px-2 md:px-3 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((s) => (
          <div key={s.src} className="shrink-0 w-[86vw] md:w-[62vw] bg-[#efece6] px-[5%] py-[6%] md:px-[6%] md:py-[5%]">
            <div className="rounded-[2.2%/3%] bg-[#0d0d0f] p-[2.2%] shadow-[0_30px_60px_-30px_rgba(0,0,0,.45)]">
              <div className="relative overflow-hidden rounded-[1%/1.4%]" style={{ aspectRatio: '1366/1024' }}>
                <Image src={s.src} alt={s.title} fill unoptimized draggable={false} sizes="(min-width:768px) 60vw, 86vw" className="object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-2 md:mx-3 mt-2 relative h-[3px] bg-black/10">
        <div className="absolute inset-y-0 left-0 bg-[#0a0a0a] transition-[width] duration-200" style={{ width: `${10 + progress * 90}%` }} />
      </div>
      <div className="px-2 md:px-3 pt-3 grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[92px]">
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div key={at} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-[32px_1fr] gap-x-2 text-[13px] leading-[1.45]">
              <span className="text-black/45 tabular-nums">{items[at].n}</span>
              <span><span className="font-medium">{items[at].title}</span> <span className="text-black/60">{items[at].text}</span></span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="md:col-span-4 flex md:justify-end gap-3 text-[13px] tabular-nums">
          <span className="text-black/45 mr-1">{hint} →</span>
          {items.map((it, i) => (
            <button key={it.n} onClick={() => goTo(i)} className={i === at ? 'text-black' : 'text-black/30 hover:text-black/70'} aria-label={it.title}>
              {it.n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
