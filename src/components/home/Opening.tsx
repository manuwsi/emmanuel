'use client';

import { useEffect, useRef } from 'react';
import { projects } from '../projects';
import { optimized } from '../dot/img';

const EASE = 'cubic-bezier(.65,0,.35,1)';
const N = projects.length;

/**
 * The opening of the home page, on every fresh visit.
 * One dot. It lines up into one dot per project, each dot opens into that project's cover,
 * then every cover travels to its place in the grid: the loading becomes the page.
 */
export default function Opening() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.homeIntro !== '1') return;
    const el = root.current!;
    const thumbs = Array.from(el.querySelectorAll<HTMLElement>('[data-thumb]'));
    const end = () => {
      delete html.dataset.homeIntro;
      el.style.display = 'none';
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return end();
    let gone = false;
    // the real covers appear under the thumbnails, which then melt away: the swap can't be seen
    const finish = async () => {
      if (gone) return;
      gone = true;
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('[data-cover] img')).slice(0, 8);
      await Promise.race([
        Promise.all(imgs.map((i) => (i.complete ? null : i.decode().catch(() => null)))),
        new Promise((r) => setTimeout(r, 1200)),
      ]);
      delete html.dataset.homeIntro;
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease', fill: 'forwards' }).onfinish = () => {
        el.style.display = 'none';
      };
    };

    const phone = innerWidth < 768;
    const dot = 8;
    const tw = phone ? 22 : 30;
    const th = tw * 0.75;
    const gap1 = phone ? 14 : 18;
    const gap2 = tw + (phone ? 5 : 8);
    const anims: Animation[] = [];
    const go = (e: HTMLElement, k: Keyframe[], o: KeyframeAnimationOptions) => {
      const a = e.animate(k, { fill: 'forwards', easing: EASE, ...o });
      anims.push(a);
      return a;
    };

    thumbs.forEach((t, i) => {
      const x1 = (i - (N - 1) / 2) * gap1;
      const x2 = (i - (N - 1) / 2) * gap2;
      // 1. the dots spread into a line
      go(t, [{ transform: 'translate(-50%,-50%) translateX(0px)' }, { transform: `translate(-50%,-50%) translateX(${x1}px)` }], { duration: 520, delay: 380 });
      // 2. each dot opens into its cover
      go(
        t,
        [
          { width: `${dot}px`, height: `${dot}px`, borderRadius: '50%', transform: `translate(-50%,-50%) translateX(${x1}px)` },
          { width: `${tw}px`, height: `${th}px`, borderRadius: '0%', transform: `translate(-50%,-50%) translateX(${x2}px)` },
        ],
        { duration: 520, delay: 950 + i * 22 }
      );
      const img = t.querySelector('img')!;
      go(img, [{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 1080 + i * 22, easing: 'ease' });
      // once the picture covers it, the black of the dot goes, so no dark hairline shows around the edges
      go(t, [{ backgroundColor: '#0a0a0a' }, { backgroundColor: 'rgba(10,10,10,0)' }], { duration: 200, delay: 1440 + i * 22, easing: 'linear' });
    });

    // 3. every cover travels to its place in the grid
    const t3 = window.setTimeout(() => {
      el.animate([{ backgroundColor: 'rgba(255,255,255,1)' }, { backgroundColor: 'rgba(255,255,255,0)' }], { duration: 520, fill: 'forwards', easing: 'ease' });
      // centre of the overlay, not of the window: on Windows the scrollbar takes 15 px off the side
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      thumbs.forEach((t, i) => {
        const link = t.dataset.thumb!;
        const target = document.querySelector<HTMLElement>(`[data-cover="${link}"]`);
        const r = t.getBoundingClientRect();
        if (!target) {
          go(t, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: i * 20 });
          return;
        }
        const g = target.getBoundingClientRect();
        // from its centre in the line to the card's rectangle (the element is centred on 50% / 50%)
        const fromX = r.left + r.width / 2 - cx;
        const toX = g.left + g.width / 2 - cx;
        const toY = g.top + g.height / 2 - cy;
        go(
          t,
          [
            { width: `${r.width}px`, height: `${r.height}px`, transform: `translate(-50%,-50%) translate(${fromX}px, 0px)` },
            { width: `${g.width}px`, height: `${g.height}px`, transform: `translate(-50%,-50%) translate(${toX}px, ${toY}px)` },
          ],
          { duration: 900, delay: i * 32 }
        );
      });
    }, 1700);

    const t4 = window.setTimeout(finish, 1700 + 900 + N * 32 + 60);
    return () => {
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div ref={root} id="home-opening" aria-hidden className="pointer-events-none fixed inset-0 z-[96] hidden bg-white">
      {projects.map((p, i) => (
        <div
          key={p.link}
          data-thumb={p.link}
          className="absolute left-1/2 top-1/2 overflow-hidden bg-[#0a0a0a]"
          style={{ width: 8, height: 8, borderRadius: '50%', transform: 'translate(-50%,-50%)', zIndex: N - i }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optimized(p.image, 640, 75)} alt="" className="h-full w-full object-cover" style={{ opacity: 0 }} />
        </div>
      ))}
    </div>
  );
}
