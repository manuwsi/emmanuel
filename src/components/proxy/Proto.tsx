'use client';

import { CSSProperties, memo, useEffect, useRef } from 'react';
import './proto.css';
import { SCREENS, ScreenId } from './screens';

/**
 * One markup object per screen, created once. React sets innerHTML again whenever this object changes identity,
 * which would rebuild the screen (and undo anything animated inside it) on every render of the page.
 */
export const MARKUP = Object.fromEntries((Object.keys(SCREENS) as ScreenId[]).map((k) => [k, { __html: SCREENS[k].html }])) as Record<ScreenId, { __html: string }>;

/** x, y, width, height in the screen's own pixels (1440 × 900 for desktop screens, 390 × 844 on the phone). */
export type Rect = readonly [number, number, number, number];

/**
 * A screen of the coded prototype, rendered live (the product's real markup, not a capture).
 * `region` shows only a part of it, at the frame's width.
 */
export const Proto = memo(function Proto({ id, region, label, className = '', style }: { id: ScreenId; region?: Rect; label: string; className?: string; style?: CSSProperties }) {
  const s = SCREENS[id];
  const [x, y, w, h] = region ?? [0, 0, s.w, s.h];
  const ref = useRef<HTMLDivElement>(null);
  useScaleFallback(ref, w);
  return (
    <div ref={ref} role="img" aria-label={label} className={`px-frame ${className}`} style={{ aspectRatio: `${w} / ${h}`, ['--pw' as string]: w, ...style }}>
      <div className="px-cam">
        <div className="px" style={{ width: s.w, height: s.h, transform: x || y ? `translate(${-x}px, ${-y}px)` : undefined }} dangerouslySetInnerHTML={MARKUP[id]} />
      </div>
    </div>
  );
});

/** Browsers without CSS trigonometry or container units get the same scale from a ResizeObserver. */
export function useScaleFallback(ref: React.RefObject<HTMLElement | null>, w: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el || (CSS.supports('width', '1cqw') && CSS.supports('scale', 'tan(atan2(1px, 1px))'))) return;
    const cam = el.querySelector<HTMLElement>('.px-cam');
    if (!cam) return;
    const ro = new ResizeObserver(() => cam.style.setProperty('--k', String(el.clientWidth / w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, w]);
}
