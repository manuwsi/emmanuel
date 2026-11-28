'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import DotIn from '@/components/dot/DotIn';
import { useT } from '@/components/i18n';
import { Proto, Rect, useScaleFallback } from './Proto';
import { ScreenId } from './screens';

const HAIR = '#dcdfe2';

/** Small square key (A, B, C) that ties a close-up to its place on the whole screen. */
export function Key({ k, className = '', small = false }: { k: string; className?: string; small?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center bg-[#121212] font-medium leading-none text-white ${small ? 'h-[11px] w-[11px] text-[8px]' : 'h-[15px] w-[15px] text-[10px]'} ${className}`} aria-hidden>
      {k}
    </span>
  );
}

/** Four corner ticks, like a viewfinder: they frame a part without boxing it. */
export function Ticks({ small = false }: { small?: boolean }) {
  const c = `absolute border-[#121212] ${small ? 'h-[6px] w-[6px]' : 'h-[9px] w-[9px]'}`;
  return (
    <>
      <i className={`${c} -left-px -top-px border-l border-t`} />
      <i className={`${c} -right-px -top-px border-r border-t`} />
      <i className={`${c} -bottom-px -left-px border-b border-l`} />
      <i className={`${c} -bottom-px -right-px border-b border-r`} />
    </>
  );
}

/**
 * A part of a screen at reading size. The frame is never wider than the part's own pixels × `max`,
 * so the interface is not blown up on large displays. On a phone a part too wide for the screen keeps
 * `min` × its pixels and is moved sideways with the finger: plain native scrolling, nothing driven by script.
 */
export function Region({ id, rect, label, k, min = 0.86, max = 1.12, className = '', eager = false, children }: { id: ScreenId; rect: Rect; label: string; k?: string; min?: number; max?: number; className?: string; eager?: boolean; children?: ReactNode }) {
  const t = useT();
  const wrap = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);
  const w = rect[2];
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setOver(el.scrollWidth - el.clientWidth > 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <figure className={className}>
      <div ref={wrap} className="px-part relative overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ maxWidth: w * max, boxShadow: `0 0 0 1px ${HAIR}` }}>
        <div style={{ width: `max(100%, ${w * min}px)` }}>
          <Proto id={id} region={rect} label={label} eager={eager} className="w-full bg-white" />
        </div>
      </div>
      {(children || k || over) && (
        <figcaption className="mt-2 flex max-w-[440px] gap-2 text-[14px] leading-[1.6] text-black/60 md:text-[13px]">
          {k && <Key k={k} className="mt-[3px] shrink-0" />}
          <span>
            {children}
            {over && <span className="whitespace-nowrap text-black/40"> {t('Glisser →', 'Swipe →')}</span>}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/* ───────────────────────── The photographs, alive ───────────────────────── */

const WORK = ['..a...aha.ahaha.aha...a..', '.....a...a..a..a...a.....', '..h...aaa.hahah.aaa...h..', '.a.a.a...a..a..a...a.a.a.'];

/** Makes a presence matrix inside a live screen breathe (Proxy at work), only while it is on screen. */
export function usePresence(ref: React.RefObject<HTMLElement | null>, selector: string, ms = 520) {
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dots = Array.from(root.querySelectorAll<HTMLElement>(`${selector} i`));
    if (dots.length !== 25) return;
    let i = 0;
    let id: ReturnType<typeof setInterval> | undefined;
    const paint = () => {
      const f = WORK[i % WORK.length];
      dots.forEach((d, k) => (d.className = f[k] === '.' ? '' : f[k]));
      i += 1;
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !id) id = setInterval(paint, ms);
      else if (!e.isIntersecting && id) {
        clearInterval(id);
        id = undefined;
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      if (id) clearInterval(id);
    };
  }, [ref, selector, ms]);
}

/** What the laptop of the photograph shows: the top 853.85 px of the 900 px screen. */
const LAPTOP_SCREEN: Rect = [0, 0, 1440, 853.85];

/**
 * The laptop photograph, whole. Its screen is the live "Today" screen laid exactly over the printed one
 * (the screen in the picture is straight-on: 1248 × 740 px at 656, 218 of 2560 × 1920), so Proxy's presence
 * keeps working inside the photograph.
 */
export function LaptopPhoto({ alt, priority = false, className = '', style }: { alt: string; priority?: boolean; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  usePresence(ref, '.dm.xl');
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '4 / 3', ...style }}>
      <Image src="/proxy/photo-laptop-v4.jpg" alt={alt} fill priority={priority} quality={90} sizes="(min-width: 768px) 75vw, 100vw" className="object-contain" />
      {/* on a phone the photograph is enough: its screen is too small there for a live one to add anything */}
      <div ref={ref} className="absolute hidden md:block" style={{ left: `${(656 / 2560) * 100}%`, top: `${(218 / 1920) * 100}%`, width: `${(1248 / 2560) * 100}%` }} aria-hidden>
        <Proto id="aujourdhui" region={LAPTOP_SCREEN} label="" eager className="w-full bg-white" />
      </div>
    </div>
  );
}

/** A photograph, whole: never cropped, never enlarged beyond its pixels. */
export function Photo({ src, alt, className = '', sizes = '(min-width: 768px) 40vw, 100vw' }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <DotIn className={`px-photo ${className}`}>
      <Image src={src} alt={alt} width={2560} height={1920} quality={90} sizes={sizes} className="block h-auto w-full" />
    </DotIn>
  );
}

/**
 * The lock screen of the photograph, rebuilt at reading size: the notification is where everything starts.
 * It arrives once, when the figure comes on screen, and pushes the earlier one down.
 */
export function LockScreen({ label, date, now, first, second, compact = false }: { label: string; date: string; now: string; first: string; second: string; compact?: boolean }) {
  const H = compact ? 232 : 452;
  const y0 = compact ? 16 : 212;
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useScaleFallback(ref, 390);
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
      { threshold: 0.7 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const E = 'cubic-bezier(0.22, 1, 0.36, 1)';
  return (
    <div ref={ref} role="img" aria-label={label} className="px-frame w-full" style={{ aspectRatio: `390 / ${H}`, ['--pw' as string]: 390, boxShadow: `0 0 0 1px ${HAIR}` }}>
      <div className="px-cam">
        <div className="px" style={{ width: 390, height: H, background: '#e3e6e9', backgroundImage: 'radial-gradient(circle, #d3d7db 4.5px, transparent 5px)', backgroundSize: '41px 44px', backgroundPosition: '4px 14px' }}>
          {!compact && <div style={{ position: 'absolute', left: 0, right: 0, top: 38, textAlign: 'center', fontSize: 17, fontWeight: 500 }}>{date}</div>}
          {!compact && <div style={{ position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center', fontSize: 88, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.1 }}>10:39</div>}
          <div style={{ position: 'absolute', left: 6, right: 6, top: y0, height: 98, borderRadius: 24, background: '#fbfbfc', padding: '15px 16px', display: 'flex', gap: 12, alignItems: 'center', opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(-16px) scale(0.97)', transition: `opacity 420ms ease 250ms, transform 700ms ${E} 250ms` }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: '#121212', flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(3, 5px)', gridAutoRows: '5px', gap: 4, placeContent: 'center' }}>
              {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((d, i) => (
                <i key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: d ? '#fff' : 'transparent', display: 'block' }} />
              ))}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <b style={{ fontSize: 15, fontWeight: 600 }}>Proxy</b>
                <span style={{ fontSize: 13, color: '#8a9096' }}>{now}</span>
              </span>
              <span style={{ display: 'block', fontSize: 15, lineHeight: 1.36, color: '#34383c' }}>{first}</span>
            </span>
          </div>
          <div style={{ position: 'absolute', left: 6, right: 6, top: y0 + 110, height: 74, borderRadius: 24, background: 'rgba(255,255,255,.6)', padding: '14px 18px', transform: on ? 'none' : 'translateY(-110px)', transition: `transform 700ms ${E} 250ms` }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <b style={{ fontSize: 15, fontWeight: 600 }}>Proxy</b>
              <span style={{ fontSize: 13, color: '#8a9096' }}>09:42</span>
            </span>
            <span style={{ display: 'block', fontSize: 15, lineHeight: 1.36, color: '#34383c' }}>{second}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { useScaleFallback };
