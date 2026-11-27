'use client';

import { CSSProperties, RefObject, useEffect, useState } from 'react';

export type T = <V,>(fr: V, en: V) => V;

export const INK = '#121212';
export const WARN = '#c9461f';
export const GREY = '#868b90';
export const OFF = '#d8dbde';
export const HAIR = '#dcdfe2';
export const MUT = '#6c7176';
export const GM: CSSProperties = { fontFamily: 'PXGM, ui-monospace, monospace' };
export const NR: CSSProperties = { fontFamily: 'PXNR, Georgia, serif', letterSpacing: '-0.015em' };
export const EASE = 'cubic-bezier(.65,0,.2,1)';

/** How the journal writes an action: the sign says how much Proxy was allowed to do. */
export type Kind = 'alone' | 'told' | 'approved' | 'proposed';

export function Mark({ kind, d = 30, className = '', style }: { kind: Kind; d?: number; className?: string; style?: CSSProperties }) {
  const s: CSSProperties =
    kind === 'alone'
      ? { background: INK }
      : kind === 'told'
        ? { background: '#fff', boxShadow: `inset 0 0 0 ${Math.max(2.5, d * 0.2)}px ${INK}` }
        : kind === 'approved'
          ? { background: GREY }
          : { background: '#fff', boxShadow: `inset 0 0 0 ${Math.max(1.5, d * 0.07)}px ${GREY}` };
  return <span aria-hidden className={`block shrink-0 rounded-full ${className}`} style={{ width: d, height: d, ...s, ...style }} />;
}

/** The undo window, as the journal draws it here: a tail of dots that thins out until the deadline. */
export function Tail({ n = 5, className = '' }: { n?: number; className?: string }) {
  return (
    <svg width={n * 9 + 2} height="10" className={className} aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={5 + i * 9} cy={5} r={4 - (2.6 * i) / Math.max(1, n - 1)} fill={INK} />
      ))}
    </svg>
  );
}

export function useSize(ref: RefObject<HTMLElement | null>) {
  const [s, set] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => set((p) => (p[0] === el.clientWidth && p[1] === el.clientHeight ? p : [el.clientWidth, el.clientHeight]));
    const ro = new ResizeObserver(read);
    ro.observe(el);
    read();
    return () => ro.disconnect();
  }, [ref]);
  return s;
}
