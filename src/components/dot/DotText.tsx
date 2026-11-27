'use client';

import { useCallback, useEffect, useRef } from 'react';
import { introWait, reducedMotion } from './engine';

/**
 * Text that is set in dots before it turns solid: each letter passes through braille cells
 * (⠁ ⠃ ⠇ ⡇ ⣇ ⣧ ⣷ ⣿, more dots each step) then lands on the real glyph.
 * The real glyph keeps its place the whole time, so nothing in the layout moves.
 *
 * play: 'mount' (on load and whenever the text changes), 'hover', 'view' (first time on screen), combinable.
 */
const STEP = 34; // ms per braille step
const STEPS = 5;
const MAX = 700; // a whole text composes in 700 ms at most (24 ms between letters for short ones)

function cell(n: number) {
  // a braille cell with n random dots lit
  let mask = 0;
  const bits = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
  for (let i = 0; i < n; i++) mask |= 1 << bits[i];
  return String.fromCharCode(0x2800 + mask);
}

export default function DotText({
  text,
  play = 'mount',
  delay = 0,
  className = '',
  hoverTarget,
}: {
  text: string;
  play?: string;
  delay?: number;
  className?: string;
  /** Re-decode when this ancestor is hovered instead of the text itself (e.g. a whole card). */
  hoverTarget?: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const running = useRef(false);

  const run = useCallback((wait = 0, fromHidden = false) => {
    const root = ref.current;
    if (!root || reducedMotion()) {
      root?.querySelectorAll<HTMLElement>('.dc').forEach((c) => {
        delete c.dataset.b;
        delete c.dataset.h;
      });
      return;
    }
    if (running.current && !fromHidden) return;
    running.current = true;
    cancelAnimationFrame(raf.current);
    const chars = Array.from(root.querySelectorAll<HTMLElement>('.dc'));
    if (fromHidden) chars.forEach((c) => (c.dataset.h = ''));
    const t0 = performance.now() + wait;
    const last: number[] = chars.map(() => -2);
    const stagger = Math.min(24, Math.max(6, (MAX - STEPS * STEP) / Math.max(1, chars.length)));
    const tick = (now: number) => {
      let busy = false;
      chars.forEach((c, i) => {
        const step = Math.floor((now - t0 - i * stagger) / STEP);
        if (step === last[i]) {
          if (step < STEPS) busy = true;
          return;
        }
        last[i] = step;
        if (step < 0) {
          busy = true;
          return;
        }
        delete c.dataset.h;
        if (step < STEPS) {
          c.dataset.b = cell(Math.min(8, 1 + Math.round((step / (STEPS - 1)) * 7)));
          busy = true;
        } else {
          delete c.dataset.b;
        }
      });
      if (busy) raf.current = requestAnimationFrame(tick);
      else running.current = false;
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  // mount / text change; 'intro' only while the first-visit slate is on screen (never on later pages)
  useEffect(() => {
    const wait = introWait();
    if (play.includes('mount') || (play.includes('intro') && wait > 0)) run(delay + wait, true);
    return () => cancelAnimationFrame(raf.current);
  }, [text, play, delay, run]);

  // first time on screen
  useEffect(() => {
    if (!play.includes('view')) return;
    const el = ref.current!;
    el.querySelectorAll<HTMLElement>('.dc').forEach((c) => (c.dataset.h = ''));
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run(delay, true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, play, delay, run]);

  // hover on an ancestor
  useEffect(() => {
    const target = hoverTarget?.current;
    if (!target || !play.includes('hover')) return;
    const on = (e: PointerEvent) => e.pointerType === 'mouse' && run(0);
    target.addEventListener('pointerenter', on);
    return () => target.removeEventListener('pointerenter', on);
  }, [hoverTarget, play, run]);

  const words = text.split(' ');
  return (
    <span
      ref={ref}
      className={`dt ${className}`}
      onPointerEnter={play.includes('hover') && !hoverTarget ? (e) => e.pointerType === 'mouse' && run(0) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, wi) => (
          <span key={wi}>
            {wi > 0 && ' '}
            <span className="whitespace-nowrap">
              {Array.from(w).map((ch, ci) => (
                <span key={ci} className="dc">
                  {ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
