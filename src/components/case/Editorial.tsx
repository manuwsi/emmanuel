'use client';

import { ElementType, Fragment, ReactNode, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * A sentence set as a piece: its words rise out of their own line, one after the other, when it comes into view
 * (or at once on load for an opening). Reading order and screen readers get the plain sentence.
 */
export function Lines({ text, as: Tag = 'p', className = '', onLoad = false, step = 32 }: { text: string; as?: ElementType; className?: string; onLoad?: boolean; step?: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (onLoad) {
      const t = window.setTimeout(() => (el.dataset.in = ''), 120);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = '';
        io.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onLoad]);
  const words = text.split(' ');
  const per = Math.min(step, 640 / Math.max(1, words.length));
  return (
    <Tag ref={ref} className={`ln ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="ln-w">
              <span style={{ transitionDelay: `${Math.round(i * per)}ms` }}>{w}</span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

/**
 * A picture edge to edge. As it comes up the screen it settles from a slightly closer framing to its own:
 * the change of scale is driven by the scroll itself, so it follows the reader's pace.
 */
export function Full({ src, alt, ratio = '16 / 9', mobileRatio, position = 'center', priority = false, children }: { src: string; alt: string; ratio?: string; mobileRatio?: string; position?: string; priority?: boolean; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], still ? [1, 1, 1] : [1.14, 1.02, 1]);
  return (
    <figure ref={ref} className="relative w-full overflow-hidden bg-[#f1f1ef] [aspect-ratio:var(--rm)] md:[aspect-ratio:var(--rd)]" style={{ ['--rd' as string]: ratio, ['--rm' as string]: mobileRatio ?? ratio }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image src={src} alt={alt} fill priority={priority} sizes="100vw" quality={88} className="object-cover" style={{ objectPosition: position }} />
      </motion.div>
      {children}
    </figure>
  );
}
