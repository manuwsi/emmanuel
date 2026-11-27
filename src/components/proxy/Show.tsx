'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import DotIn from '@/components/dot/DotIn';
import { useT } from '@/components/i18n';
import { Proto, Rect, useScaleFallback, useScreenMarkup } from './Proto';
import { SCREENS, ScreenId } from './screens';

const HAIR = '#dcdfe2';
const INK = '#121212';

/** Small square key (A, B, C) that ties a close-up to its place on the whole screen. */
export function Key({ k, className = '' }: { k: string; className?: string }) {
  return (
    <span className={`inline-flex h-[15px] w-[15px] items-center justify-center bg-[#121212] text-[10px] font-medium leading-none text-white ${className}`} aria-hidden>
      {k}
    </span>
  );
}

/** Four corner ticks, like a viewfinder: they frame a part without boxing it. */
function Ticks() {
  const c = 'absolute h-[9px] w-[9px] border-[#121212]';
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
 * A whole screen, shown as it is: one hairline around it, nothing else.
 * `marks` frames the parts that are enlarged next to it, each with its key.
 */
export function Plate({ id, label, marks = [], className = '' }: { id: ScreenId; label: string; marks?: { k: string; rect: Rect }[]; className?: string }) {
  const s = SCREENS[id];
  return (
    <div className={`relative ${className}`} style={{ boxShadow: `0 0 0 1px ${HAIR}` }}>
      <Proto id={id} label={label} className="w-full bg-white" />
      {marks.map((m) => (
        <span
          key={m.k}
          aria-hidden
          className="absolute"
          style={{
            left: `${(m.rect[0] / s.w) * 100}%`,
            top: `${(m.rect[1] / s.h) * 100}%`,
            width: `${(m.rect[2] / s.w) * 100}%`,
            height: `${(m.rect[3] / s.h) * 100}%`,
          }}
        >
          <Ticks />
          <Key k={m.k} className="absolute -top-px left-[13px] -translate-y-1/2" />
        </span>
      ))}
    </div>
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

/**
 * The enlarged parts of a screen. On a display wide enough for the whole screen to be read as it is,
 * the enlargements step aside and only their notes remain, keyed to the ticks on the screen.
 */
export function Details({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-details mt-12 grid grid-cols-1 items-start gap-x-3 gap-y-10 md:mt-16 md:grid-cols-9 ${className}`}>{children}</div>;
}

/* ───────────────────────── The film: one screen, read shot by shot ───────────────────────── */

export type Shot = { rect: Rect; title: string; note: ReactNode };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * A screen stays in place while the page scrolls; the frame travels inside it from one part to the next.
 * Everything is the live interface, so each close-up is as sharp as the whole. Scroll drives it both ways:
 * nothing plays on its own, nothing has to be waited for.
 */
export function Film({ id, shots, label, name, zoom = 1.18 }: { id: ScreenId; shots: Shot[]; label: string; name?: ReactNode; zoom?: number }) {
  const s = SCREENS[id];
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLSpanElement>(null);
  const px = useRef<HTMLDivElement>(null);
  useScreenMarkup(frame, px, id);
  const [active, setActive] = useState(0);
  const n = shots.length;

  useEffect(() => {
    const w = wrap.current;
    const f = frame.current;
    const c = cam.current;
    if (!w || !f || !c) return;
    let raf = 0;
    let last = -1;
    c.dataset.k = '';
    const fit = (r: Rect, fw: number, fh: number) => {
      // a part is never enlarged beyond `zoom` × its real size: close enough to read, never blown up
      const whole = r[2] >= s.w - 1;
      const k = Math.min(fw / r[2], fh / r[3], whole ? Infinity : zoom);
      return { k, cx: r[0] + r[2] / 2, cy: r[1] + r[3] / 2 };
    };
    const tick = () => {
      raf = 0;
      const fw = f.clientWidth;
      const fh = f.clientHeight;
      const box = w.getBoundingClientRect();
      const span = Math.max(1, box.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -box.top / span)) * (n - 1);
      const i = Math.min(n - 2, Math.floor(p));
      // each shot is held, then the frame moves during the middle of the interval
      const t = ease(Math.min(1, Math.max(0, (p - i - 0.22) / 0.56)));
      const A = shots[i].rect;
      const B = shots[i + 1].rect;
      const a = fit(A, fw, fh);
      const b = fit(B, fw, fh);
      const k = Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * t);
      const cx = a.cx + (b.cx - a.cx) * t;
      const cy = a.cy + (b.cy - a.cy) * t;
      let tx = fw / 2 - cx * k;
      let ty = fh / 2 - cy * k;
      // never show beyond the edges of the screen
      tx = s.w * k >= fw ? Math.min(0, Math.max(fw - s.w * k, tx)) : (fw - s.w * k) / 2;
      ty = s.h * k >= fh ? Math.min(0, Math.max(fh - s.h * k, ty)) : (fh - s.h * k) / 2;
      c.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${k})`;
      // the part being read stays clear, the rest of the screen steps back (one veil with a window in it: painted, never laid out)
      const x0 = A[0] + (B[0] - A[0]) * t;
      const y0 = A[1] + (B[1] - A[1]) * t;
      const x1 = x0 + A[2] + (B[2] - A[2]) * t;
      const y1 = y0 + A[3] + (B[3] - A[3]) * t;
      if (veil.current) veil.current.style.clipPath = `polygon(evenodd, 0 0, ${s.w}px 0, ${s.w}px ${s.h}px, 0 ${s.h}px, 0 0, ${x0}px ${y0}px, ${x0}px ${y1}px, ${x1}px ${y1}px, ${x1}px ${y0}px, ${x0}px ${y0}px)`;
      const now = Math.round(p);
      if (now !== last) {
        last = now;
        setActive(now);
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // the film exists on wide screens only: on a phone nothing listens to the scroll
    const wide = window.matchMedia('(min-width: 768px)');
    const ro = new ResizeObserver(on);
    const attach = () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      ro.disconnect();
      if (!wide.matches) return;
      ro.observe(f);
      window.addEventListener('scroll', on, { passive: true });
      window.addEventListener('resize', on);
      tick();
    };
    attach();
    wide.addEventListener('change', attach);
    return () => {
      wide.removeEventListener('change', attach);
      ro.disconnect();
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, [shots, n, s.w, s.h, zoom]);

  return (
    <div ref={wrap} style={{ height: `${(n - 1) * 62 + 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center">
        <div ref={frame} role="img" aria-label={label} className="px-frame w-full bg-white" style={{ aspectRatio: `${s.w} / ${s.h}`, maxHeight: 'calc(100svh - 200px)', boxShadow: `0 0 0 1px ${HAIR}`, ['--pw' as string]: s.w }}>
          <div ref={cam} className="px-cam" style={{ width: s.w, height: s.h }}>
            <div ref={px} className="px" style={{ width: s.w, height: s.h, position: 'absolute', left: 0, top: 0, userSelect: 'none', pointerEvents: 'none' }} />
            <span ref={veil} className="absolute inset-0 bg-white/[0.74]" style={{ clipPath: 'polygon(0 0, 0 0, 0 0)' }} aria-hidden />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-9 gap-x-3 text-[13px] leading-[1.6]">
          <div className="col-span-3">
            {name && <p className="text-black/60">{name}</p>}
            <ol className="mt-1 flex gap-[10px] tabular-nums text-black/40" aria-hidden>
              {shots.map((sh, i) => (
                <li key={sh.title} className="transition-colors duration-300" style={{ color: i === active ? INK : undefined }}>
                  {String(i + 1).padStart(2, '0')}
                </li>
              ))}
            </ol>
          </div>
          <div className="relative col-span-6 min-h-[66px]">
            {shots.map((sh, i) => (
              <p key={sh.title} className="absolute inset-x-0 top-0 max-w-[520px] transition-opacity duration-300" style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
                <span className="font-medium">{sh.title}</span> <span className="text-black/60">{sh.note}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
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
 * The day's axis of the log. When it comes on screen the day is written once, in order:
 * each action lands at its hour, then the undo windows run out to the right.
 */
export function JournalAxis({ label, rect, k, children }: { label: string; rect: Rect; k?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const axis = Array.from(root.querySelectorAll<HTMLElement>('.px div')).find((d) => d.style.height === '316px');
    if (!axis) return;
    const kids = Array.from(axis.children) as HTMLElement[];
    const px = (v: string) => parseFloat(v) || 0;
    const dots = kids.filter((k) => k.tagName === 'SPAN' && k.style.borderRadius === '50%').sort((a, b) => px(a.style.left) - px(b.style.left));
    const strokes = kids.filter((k) => k.tagName === 'DIV' && k.style.height === '2px');
    const ends = kids.filter((k) => k.style.width === '2px' && k.style.height === '10px');
    const now = kids.find((k) => k.style.width === '2px' && k.style.height === '280px');
    const labels = kids.filter((k) => k.tagName === 'SPAN' && k.style.borderRadius !== '50%' && px(k.style.top) < 290);
    // "now" is named as soon as its line is drawn; the notes on the undo windows come with them
    const nowLabel = labels.find((k) => (k.textContent ?? '').startsWith('MAINTENANT'));
    const notes = labels.filter((k) => k !== nowLabel);
    if (nowLabel) nowLabel.style.opacity = '0';
    const E = 'cubic-bezier(0.22, 1, 0.36, 1)';
    dots.forEach((d) => {
      d.style.opacity = '0';
      d.style.transform = 'scale(0.3)';
    });
    strokes.forEach((d) => {
      d.style.transformOrigin = '0 50%';
      d.style.transform = 'scaleX(0)';
    });
    [...ends, ...notes].forEach((d) => (d.style.opacity = '0'));
    if (now) {
      now.style.transformOrigin = '50% 0';
      now.style.transform = 'scaleY(0)';
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const step = 85;
        if (now) {
          now.style.transition = `transform 500ms ${E}`;
          now.style.transform = 'none';
        }
        if (nowLabel) {
          nowLabel.style.transition = 'opacity 400ms ease 300ms';
          nowLabel.style.opacity = '1';
        }
        dots.forEach((d, i) => {
          d.style.transition = `opacity 300ms ease ${200 + i * step}ms, transform 520ms ${E} ${200 + i * step}ms`;
          d.style.opacity = '1';
          d.style.transform = 'none';
        });
        const after = 200 + dots.length * step;
        strokes.forEach((d) => {
          d.style.transition = `transform 900ms cubic-bezier(0.6, 0, 0.25, 1) ${after}ms`;
          d.style.transform = 'none';
        });
        [...ends, ...notes].forEach((d) => {
          d.style.transition = `opacity 400ms ease ${after + 700}ms`;
          d.style.opacity = '1';
        });
      },
      { threshold: 0.45 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="md:col-span-9">
      <Region id="journal" rect={rect} label={label} k={k} min={0.7} max={1.02} eager className="px-keep">
        {children}
      </Region>
    </div>
  );
}

/** The phone screens, side by side near their real size: the product's own mobile layouts, live. On a phone, a strip to swipe. */
export function Phones({ items }: { items: { id: ScreenId; label: string; name: ReactNode }[] }) {
  return (
    <div className="-mx-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-9 md:gap-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
      {items.map((it) => (
        <figure key={it.id} className="w-[78vw] shrink-0 snap-center md:col-span-3 md:w-auto">
          <div style={{ boxShadow: `0 0 0 1px ${HAIR}` }}>
            <Proto id={it.id} label={it.label} className="w-full bg-white" />
          </div>
          <figcaption className="mt-2 text-[14px] leading-[1.6] text-black/60 md:text-[13px]">{it.name}</figcaption>
        </figure>
      ))}
    </div>
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
