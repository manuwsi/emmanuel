'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { projects } from '../projects';
import { lenisScrollTo } from './SmoothScroll';
import { optimized } from './img';

/** A tiny version of the picture (or of the video's poster) for the minimap. */
function thumbOf(el: HTMLElement): string | undefined {
  let src: string | null = null;
  if (el instanceof HTMLImageElement) src = el.getAttribute('src');
  else if (el instanceof HTMLVideoElement) src = el.getAttribute('poster');
  if (!src) return undefined;
  if (src.startsWith('/_next/image')) {
    const u = new URL(src, location.href).searchParams.get('url');
    if (!u) return undefined;
    src = u;
  }
  if (!src.startsWith('/')) return undefined;
  return optimized(src, 96, 60);
}

type Block = { top: number; h: number; x: number; w: number; thumb?: string };

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
        out.push({ top, h: r.height, x: r.left, w: r.width, thumb: thumbOf(el) });
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

  const H = Math.min(doc.vh * 0.5, 460);
  const scale = H / Math.max(1, doc.h);
  const W = 52;

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
        el.style.opacity = on ? '1' : '0.35';
      });
      if (rail.current) rail.current.style.opacity = y > doc.h - doc.vh * 0.6 ? '0' : '1';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isCase, blocks, H, scale, doc]);

  // only where there is a free margin on the right: never over a picture
  const right = blocks.reduce((m, b) => Math.max(m, b.x + b.w), 0);
  if (!isCase || blocks.length < 3 || doc.vw - right < W + 40) return null;

  return (
    <div
      ref={rail}
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 cursor-pointer transition-opacity duration-500 md:block"
      style={{ width: W, height: H }}
      data-rail-skip
      role="navigation"
      aria-label="Minimap"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        lenisScrollTo(Math.max(0, (e.clientY - r.top) / scale - doc.vh / 2));
      }}
    >
      {blocks.map((b, i) => {
        // the content column fills the minimap's width
        const left = blocks.reduce((m, x) => Math.min(m, x.x), Infinity);
        const span = Math.max(1, right - left);
        return (
          <div
            key={i}
            ref={(el) => {
              if (el) items.current[i] = el;
            }}
            className="absolute bg-neutral-200 bg-cover bg-center transition-opacity duration-300"
            style={{
              top: b.top * scale,
              height: Math.max(2, b.h * scale),
              left: ((b.x - left) / span) * W,
              width: Math.max(3, (b.w / span) * W),
              backgroundImage: b.thumb ? `url("${b.thumb}")` : undefined,
            }}
          />
        );
      })}
      <div ref={frame} className="absolute -left-[4px] -right-[4px] top-0 border border-[#0a0a0a]" />
    </div>
  );
}
