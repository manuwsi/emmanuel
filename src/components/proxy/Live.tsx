'use client';

import { useEffect, useRef, useState } from 'react';
import './proto.css';

const INK = '#121212';
const WARN = '#c9461f';
const OFF = '#d8dbde';

/* ───────────── Animated presence ───────────── */

const FRAMES: Record<string, string[]> = {
  work: ['..a...aha.ahaha.aha...a..', '.....a...a..a..a...a.....', '..h...aaa.hahah.aaa...h..', '.a.a.a...a..a..a...a.a.a.'],
  wait: ['......a.a.......a.a......'],
  done: ['............a............'],
  stop: ['w...w.w.w...w...w.w.w...w'],
};

export function LivePresence({ state, size = 9 }: { state: 'work' | 'wait' | 'done' | 'stop'; size?: number }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (state !== 'work' || !el) return;
    // it only works while someone can see it: nothing ticks off screen, or where it is not displayed
    let id: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !id) id = setInterval(() => setI((x) => (x + 1) % FRAMES.work.length), 260);
      else if (!e.isIntersecting && id) {
        clearInterval(id);
        id = undefined;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (id) clearInterval(id);
    };
  }, [state]);
  const f = FRAMES[state][state === 'work' ? i : 0];
  return (
    <div ref={ref} className="grid grid-cols-5 w-fit" style={{ gap: size * 0.7 }}>
      {f.split('').map((c, k) => (
        <span
          key={k}
          className="block rounded-full transition-colors duration-200"
          style={{ width: size, height: size, background: c === 'a' ? INK : c === 'h' ? '#868b90' : c === 'w' ? WARN : OFF }}
        />
      ))}
    </div>
  );
}
