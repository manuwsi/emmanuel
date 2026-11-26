'use client';

import { useEffect, useRef } from 'react';

/** How far into the case you are, next to its name in the top-left corner. */
export default function ReadProgress() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const zone = document.getElementById('next-zone');
      // the "keep scrolling" zone at the end does not count as reading
      const end = zone ? Math.max(1, zone.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4) : max;
      const v = Math.round(Math.min(1, Math.max(0, window.scrollY / Math.max(1, Math.min(max, end)))) * 100);
      if (v !== last && ref.current) {
        last = v;
        ref.current.textContent = `${v}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref} className="ml-3 inline-block min-w-[3ch] tabular-nums opacity-50">0%</span>;
}
