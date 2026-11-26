'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { projects } from '../projects';
import { lenisScrollTo } from './SmoothScroll';

type Block = { top: number; h: number; x: number; w: number };

/**
 * A minimap of the case on the right edge: every picture and video is a small block of dots,
 * at its real place and proportion; a frame shows where you are. Click to jump.
 */
export default function CaseRail() {
  const pathname = usePathname();
  const isCase = projects.some((p) => p.link === pathname);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [doc, setDoc] = useState({ h: 1, vw: 1, vh: 1 });
  const frame = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLDivElement[]>([]);

  // map the page
  useEffect(() => {
    if (!isCase) return;
    let timer = 0;
    const scan = () => {
      const zone = document.getElementById('next-zone');
      const end = zone ? zone.getBoundingClientRect().top + scrollY : document.documentElement.scrollHeight;
      const els = Array.from(document.querySelectorAll<HTMLElement>('img, video, canvas, iframe, svg'));
      const out: Block[] = [];
      for (const el of els) {
        if (el.closest('[data-rail-skip], header, nav, #next-zone') || el.closest('.fixed')) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 120 || r.width < 160) continue;
        const top = r.top + scrollY;
        if (top > end) continue;
        // skip pictures nested inside a block we already have
        if (out.some((b) => top >= b.top - 1 && top + r.height <= b.top + b.h + 1 && r.left >= b.x - 1 && r.left + r.width <= b.x + b.w + 1)) continue;
        out.push({ top, h: r.height, x: r.left, w: r.width });
      }
      setBlocks(out);
      setDoc({ h: end, vw: innerWidth, vh: innerHeight });
    };
    const later = () => {
      clearTimeout(timer);
      timer = window.setTimeout(scan, 250);
    };
    scan();
    const ro = new ResizeObserver(later);
    ro.observe(document.body);
    window.addEventListener('resize', later);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', later);
      clearTimeout(timer);
    };
  }, [isCase, pathname]);

  const H = Math.min(doc.vh * 0.46, 420);
  const scale = H / Math.max(1, doc.h);
  const W = 26;

  // follow the scroll
  useEffect(() => {
    if (!isCase) return;
    let raf = 0;
    const tick = () => {
      const y = scrollY;
      if (frame.current) {
        frame.current.style.transform = `translateY(${Math.min(H - doc.vh * scale, y * scale)}px)`;
        frame.current.style.height = `${Math.max(6, doc.vh * scale)}px`;
      }
      items.current.forEach((el, i) => {
        const b = blocks[i];
        if (!el || !b) return;
        const on = b.top < y + doc.vh && b.top + b.h > y;
        el.style.opacity = on ? '1' : '0.45';
      });
      if (rail.current) rail.current.style.opacity = y > doc.h - doc.vh * 0.6 ? '0' : '1';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isCase, blocks, H, scale, doc]);

  if (!isCase || blocks.length < 3) return null;

  return (
    <div
      ref={rail}
      className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 text-white mix-blend-difference transition-opacity duration-500 md:block"
      style={{ width: W, height: H }}
      data-rail-skip
      data-cursor="label"
      data-label="↕"
      role="navigation"
      aria-label="Minimap"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        lenisScrollTo(Math.max(0, (e.clientY - r.top) / scale - doc.vh / 2));
      }}
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/20" />
      {blocks.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) items.current[i] = el;
          }}
          className="dotfill absolute transition-opacity duration-300"
          style={{
            top: b.top * scale,
            height: Math.max(2, b.h * scale),
            left: (b.x / doc.vw) * W,
            width: Math.max(3, (b.w / doc.vw) * W),
            backgroundColor: 'rgba(255,255,255,0.12)',
          }}
        />
      ))}
      <div ref={frame} className="absolute -left-[3px] -right-[3px] top-0 border border-white" />
    </div>
  );
}
