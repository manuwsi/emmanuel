'use client';

import { ReactNode, useEffect, useRef } from 'react';

/**
 * Pictures arrive the way they are printed: a grid of tiny dots that grow until they touch.
 * Once, when the picture enters the screen; after that it is a normal picture again.
 */
export default function DotIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.done = '';
      return;
    }
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.in = '';
        t = window.setTimeout(() => (el.dataset.done = ''), 1300 + delay);
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`dot-in ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
