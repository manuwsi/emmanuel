'use client';

import { CSSProperties, memo, useEffect, useRef } from 'react';
import './proto.css';
import { SCREENS, ScreenId } from './screens';

/** x, y, width, height in the screen's own pixels (1440 × 900 for desktop screens, 390 × 844 on the phone). */
export type Rect = readonly [number, number, number, number];

/**
 * Writes a screen's markup into its frame, once. The frame keeps its place by its proportions alone,
 * so the markup can arrive late without moving anything: a screen is built when it comes near the viewport,
 * and a frame that is not displayed (the wide-screen pictures on a phone, and the reverse) is never built at all.
 */
export function useScreenMarkup(frame: React.RefObject<HTMLElement | null>, target: React.RefObject<HTMLElement | null>, id: ScreenId, eager = false) {
  useEffect(() => {
    const el = frame.current;
    const px = target.current;
    if (!el || !px || px.firstChild) return;
    const fill = () => {
      if (!px.firstChild) px.innerHTML = SCREENS[id].html;
    };
    // `eager`: needed as soon as the page is ready (something animates inside it), if it is displayed at all
    if (eager && el.offsetParent !== null) return fill();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fill();
      },
      { rootMargin: '120% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [frame, target, id, eager]);
}

/**
 * A screen of the coded prototype, rendered live (the product's real markup, not a capture).
 * `region` shows only a part of it, at the frame's width.
 */
export const Proto = memo(function Proto({ id, region, label, className = '', style, eager = false }: { id: ScreenId; region?: Rect; label: string; className?: string; style?: CSSProperties; eager?: boolean }) {
  const s = SCREENS[id];
  const [x, y, w, h] = region ?? [0, 0, s.w, s.h];
  const ref = useRef<HTMLDivElement>(null);
  const px = useRef<HTMLDivElement>(null);
  useScaleFallback(ref, w);
  useScreenMarkup(ref, px, id, eager);
  return (
    <div ref={ref} role="img" aria-label={label} className={`px-frame ${className}`} style={{ aspectRatio: `${w} / ${h}`, ['--pw' as string]: w, ...style }}>
      <div className="px-cam">
        <div ref={px} className="px" style={{ width: s.w, height: s.h, transform: x || y ? `translate(${-x}px, ${-y}px)` : undefined }} />
      </div>
    </div>
  );
});

/**
 * The scale is first worked out in CSS alone (so the screens are right before any script runs), then confirmed
 * from the frame's real width: every browser ends on the same value, whatever it makes of CSS trigonometry.
 */
export function useScaleFallback(ref: React.RefObject<HTMLElement | null>, w: number) {
  useEffect(() => {
    const el = ref.current;
    const cam = el?.querySelector<HTMLElement>('.px-cam');
    if (!el || !cam) return;
    const set = () => {
      if (!el.clientWidth) return;
      cam.style.setProperty('--k', String(el.clientWidth / w));
      cam.dataset.k = '';
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, w]);
}
