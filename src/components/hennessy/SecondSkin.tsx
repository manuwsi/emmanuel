'use client';

/**
 * The tablet journey, playable: dominant colour, secondary colour, the artwork grows, it wraps the bottle.
 * A simplified simulation (flow-field strokes), not Florian Zumbrunn's algorithms.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useT } from '@/components/i18n';

type C = { id: string; fr: string; en: string; hex: string };
const PALETTE: C[] = [
  { id: 'vf', fr: 'Vert foncé', en: 'Dark green', hex: '#2f7a4c' },
  { id: 'bf', fr: 'Bleu foncé', en: 'Dark blue', hex: '#2048b0' },
  { id: 'bm', fr: 'Bleu métal', en: 'Metal blue', hex: '#5b88ad' },
  { id: 'bc', fr: 'Bleu clair', en: 'Light blue', hex: '#78c0e4' },
  { id: 'ro', fr: 'Rose', en: 'Pink', hex: '#e786b6' },
  { id: 'vi', fr: 'Violet', en: 'Purple', hex: '#6a3d9e' },
  { id: 'ja', fr: 'Jaune', en: 'Yellow', hex: '#f0c63a' },
  { id: 'ab', fr: 'Abricot', en: 'Apricot', hex: '#f2ad76' },
  { id: 'rg', fr: 'Rouge', en: 'Red', hex: '#d3323a' },
  { id: 'rm', fr: 'Rouge métal', en: 'Metal red', hex: '#a6574c' },
  { id: 'of', fr: 'Orange foncé', en: 'Dark orange', hex: '#df5d29' },
  { id: 'bl', fr: 'Blanc', en: 'White', hex: '#f4f1ea' },
];

// paint-dab silhouettes, so the swatches read like strokes rather than flat chips
const DABS = ['58% 42% 55% 45% / 48% 58% 42% 52%', '45% 55% 40% 60% / 55% 45% 60% 40%', '62% 38% 50% 50% / 42% 55% 45% 58%'];

const BOTTLE = 'M128,112 C128,160 44,192 26,282 C14,342 34,404 92,410 L208,410 C266,404 286,342 274,282 C256,192 172,160 172,112 Z';

function hexRgb(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function jitter(h: string, r: () => number, amt = 26) {
  const [a, b, c] = hexRgb(h);
  const k = () => Math.round((r() - 0.5) * amt);
  return `rgb(${Math.max(0, Math.min(255, a + k()))},${Math.max(0, Math.min(255, b + k()))},${Math.max(0, Math.min(255, c + k()))})`;
}
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const AW = 480, AH = 640; // artwork
const BW = 300, BH = 420; // bottle

export default function SecondSkin() {
  const t = useT();
  const [dom, setDom] = useState<C | null>(null);
  const [sec, setSec] = useState<C | null>(null);
  const [phase, setPhase] = useState<'dom' | 'sec' | 'gen' | 'done' | 'ok'>('dom');
  const art = useRef<HTMLCanvasElement>(null);
  const bottle = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  const paintBottle = useCallback((empty = false) => {
    const b = bottle.current, a = art.current;
    if (!b) return;
    const g = b.getContext('2d')!;
    g.clearRect(0, 0, BW, BH);
    const path = new Path2D(BOTTLE);
    g.save();
    g.clip(path);
    if (empty || !a) {
      g.fillStyle = '#1a1a1c';
      g.fillRect(0, 0, BW, BH);
    } else {
      g.drawImage(a, -40, 40, BW + 80, (BW + 80) * (AH / AW));
    }
    // volume: dark edges, soft highlight on the left shoulder
    const v = g.createRadialGradient(BW * 0.42, BH * 0.62, 30, BW * 0.5, BH * 0.66, 190);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(0.7, 'rgba(0,0,0,0.18)');
    v.addColorStop(1, 'rgba(0,0,0,0.62)');
    g.fillStyle = v;
    g.fillRect(0, 0, BW, BH);
    const hl = g.createLinearGradient(40, 0, 120, 0);
    hl.addColorStop(0, 'rgba(255,255,255,0)');
    hl.addColorStop(0.5, 'rgba(255,255,255,0.22)');
    hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl;
    g.beginPath();
    g.ellipse(78, 300, 16, 82, -0.25, 0, Math.PI * 2);
    g.fill();
    g.restore();
    // neck ring + gold cap
    g.fillStyle = '#121214';
    g.fillRect(124, 92, 52, 22);
    const cap = g.createLinearGradient(118, 0, 182, 0);
    cap.addColorStop(0, '#8a6a2c');
    cap.addColorStop(0.45, '#e7c878');
    cap.addColorStop(1, '#7a5a22');
    g.fillStyle = cap;
    g.beginPath();
    g.roundRect(118, 40, 64, 56, 6);
    g.fill();
  }, []);

  useEffect(() => {
    paintBottle(true);
    return () => cancelAnimationFrame(raf.current);
  }, [paintBottle]);

  const generate = useCallback(
    (d: C, s: C) => {
      const c = art.current;
      if (!c) return;
      cancelAnimationFrame(raf.current);
      setPhase('gen');
      const g = c.getContext('2d')!;
      const seed = (Math.random() * 1e9) | 0;
      const r = rng(seed);
      const o = [r() * 6, r() * 6, r() * 6, r() * 6];
      const fx = 0.004 + r() * 0.004, fy = 0.005 + r() * 0.004;
      const field = (x: number, y: number) =>
        (Math.sin(x * fx + o[0]) + Math.sin(y * fy + o[1]) + Math.sin((x + y) * 0.0035 + o[2]) * 1.3 + Math.sin((x - y) * 0.0045 + o[3])) * 1.45;
      // ground: the dominant colour, washed with the secondary
      g.fillStyle = '#f4f1ea';
      g.fillRect(0, 0, AW, AH);
      const wash = g.createLinearGradient(0, 0, AW * 0.4, AH);
      wash.addColorStop(0, jitter(d.hex, r, 10));
      wash.addColorStop(1, jitter(s.hex, r, 10));
      g.globalAlpha = 0.62;
      g.fillStyle = wash;
      g.fillRect(0, 0, AW, AH);
      g.globalAlpha = 1;
      const N = 2200;
      const P = Array.from({ length: N }, () => {
        const k = r();
        const col = k < 0.55 ? d.hex : k < 0.86 ? s.hex : k < 0.95 ? '#f7f4ee' : '#141416';
        return { x: r() * AW, y: r() * AH, c: jitter(col, r, 34), w: 0.7 + r() * 2.8, a: 0.16 + r() * 0.34, life: 50 + r() * 130 };
      });
      let f = 0;
      const step = () => {
        for (let k = 0; k < 2; k++) {
          for (const p of P) {
            if (p.life <= 0) continue;
            const ang = field(p.x, p.y);
            const nx = p.x + Math.cos(ang) * 2.4, ny = p.y + Math.sin(ang) * 2.4;
            g.strokeStyle = p.c;
            g.globalAlpha = p.a;
            g.lineWidth = p.w;
            g.beginPath();
            g.moveTo(p.x, p.y);
            g.lineTo(nx, ny);
            g.stroke();
            p.x = nx; p.y = ny; p.life--;
            if (p.x < -10 || p.x > AW + 10 || p.y < -10 || p.y > AH + 10) { p.x = r() * AW; p.y = r() * AH; }
          }
        }
        g.globalAlpha = 1;
        f++;
        paintBottle();
        if (f < 80) raf.current = requestAnimationFrame(step);
        else setPhase('done');
      };
      raf.current = requestAnimationFrame(step);
    },
    [paintBottle]
  );

  const reset = () => {
    cancelAnimationFrame(raf.current);
    setDom(null); setSec(null); setPhase('dom');
    const c = art.current;
    if (c) c.getContext('2d')!.clearRect(0, 0, AW, AH);
    paintBottle(true);
  };

  const pick = (c: C) => {
    if (phase === 'dom') { setDom(c); }
    else if (phase === 'sec') { setSec(c); }
  };

  const head =
    phase === 'dom' ? t('Choisis la couleur dominante', 'Choose the dominant colour')
    : phase === 'sec' ? t('Choisis la couleur secondaire', 'Choose the secondary colour')
    : phase === 'gen' ? t('L’œuvre se génère…', 'The artwork is being generated…')
    : phase === 'done' ? t('Ta seconde peau', 'Your second skin')
    : t('Merci', 'Thank you');

  const current = phase === 'dom' ? dom : phase === 'sec' ? sec : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 bg-[#efece6]">
      {/* stage */}
      <div className="md:col-span-7 relative flex items-end justify-center gap-[6%] px-6 pt-10 pb-8 md:px-10 md:pt-16 md:pb-12 min-h-[440px] md:min-h-[620px]">
        <canvas
          ref={art}
          width={AW}
          height={AH}
          aria-label={t('L’œuvre générée', 'The generated artwork')}
          className={`w-[34%] max-w-[220px] shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)] transition-opacity duration-700 ${phase === 'dom' || phase === 'sec' ? 'opacity-0' : 'opacity-100'}`}
          style={{ aspectRatio: `${AW}/${AH}` }}
        />
        <div className="relative w-[46%] max-w-[300px]">
          <canvas ref={bottle} width={BW} height={BH} aria-label={t('La bouteille Hennessy X.O', 'The Hennessy X.O bottle')} className="block w-full h-auto" />
          <div className="mx-auto -mt-1 h-3 w-[70%] rounded-[50%] bg-black/25 blur-md" />
        </div>
      </div>

      {/* tablet side */}
      <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-black/10 px-4 py-8 md:px-8 md:py-12 flex flex-col">
        <div className="flex items-center justify-between text-[12px] text-black/45">
          <span>{phase === 'dom' ? '1 / 3' : phase === 'sec' ? '2 / 3' : '3 / 3'}</span>
          {phase !== 'dom' && (
            <button onClick={reset} className="underline underline-offset-2 hover:text-black">
              {t('Recommencer', 'Start over')}
            </button>
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.h4
            key={head}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-[22px] md:text-[26px] leading-[1.1]"
            style={{ fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {head}
          </motion.h4>
        </AnimatePresence>

        {(phase === 'dom' || phase === 'sec') && (
          <>
            <div className="mt-6 grid grid-cols-4 gap-x-3 gap-y-5">
              {PALETTE.map((c, i) => {
                const on = current?.id === c.id;
                const taken = phase === 'sec' && dom?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => !taken && pick(c)}
                    disabled={taken}
                    aria-pressed={on}
                    className={`group flex flex-col items-center gap-1.5 text-[11px] leading-tight ${taken ? 'opacity-25 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`block h-9 w-11 transition-transform duration-200 ${on ? 'scale-110 ring-2 ring-[#0a0a0a] ring-offset-2 ring-offset-[#efece6]' : 'group-hover:scale-105'}`}
                      style={{ background: c.hex, borderRadius: DABS[i % 3], boxShadow: c.id === 'bl' ? 'inset 0 0 0 1px rgba(0,0,0,.12)' : undefined }}
                    />
                    <span className={on ? 'text-black' : 'text-black/55'}>{t(c.fr, c.en)}</span>
                  </button>
                );
              })}
            </div>
            <button
              disabled={!current}
              onClick={() => {
                if (phase === 'dom') setPhase('sec');
                else if (dom && sec) generate(dom, sec);
              }}
              className="mt-8 border border-[#0a0a0a] py-2.5 text-[12px] tracking-[0.08em] uppercase transition-colors disabled:border-black/20 disabled:text-black/30 enabled:hover:bg-[#0a0a0a] enabled:hover:text-white"
            >
              {phase === 'dom' ? t('Valider', 'Confirm') : t('Générer ma création', 'Generate my artwork')}
            </button>
          </>
        )}

        {(phase === 'gen' || phase === 'done') && (
          <div className="mt-6 space-y-3">
            <div className="flex gap-3 text-[13px] text-black/60">
              {dom && <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-full" style={{ background: dom.hex }} />{t(dom.fr, dom.en)}</span>}
              {sec && <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-full" style={{ background: sec.hex }} />{t(sec.fr, sec.en)}</span>}
            </div>
            <button
              disabled={phase !== 'done'}
              onClick={() => setPhase('ok')}
              className="mt-4 w-full bg-[#0a0a0a] py-2.5 text-[12px] tracking-[0.08em] uppercase text-white disabled:opacity-30"
            >
              {t('Valider cette création', 'Approve this artwork')}
            </button>
            <button
              disabled={phase !== 'done'}
              onClick={() => dom && sec && generate(dom, sec)}
              className="w-full border border-[#0a0a0a] py-2.5 text-[12px] tracking-[0.08em] uppercase disabled:opacity-30 enabled:hover:bg-[#0a0a0a] enabled:hover:text-white transition-colors"
            >
              {t('Générer une nouvelle œuvre', 'Generate a new artwork')}
            </button>
          </div>
        )}

        {phase === 'ok' && (
          <p className="mt-6 max-w-sm text-[15px] leading-[1.5] text-black/70">
            {t(
              'Sur la vraie tablette, l’écran remercie le visiteur : son œuvre sera imprimée, et le bras robotisé peut commencer la personnalisation de sa seconde peau.',
              'On the real tablet, the screen thanks the visitor: the artwork will be printed, and the robotic arm can start customising their second skin.'
            )}
          </p>
        )}

        <p className="mt-auto pt-10 text-[12px] leading-[1.45] text-black/45">
          {t(
            'Simulation simplifiée, pour faire vivre le parcours. Les vraies œuvres viennent des algorithmes de Florian Zumbrunn.',
            'A simplified simulation, to bring the journey to life. The real artworks come from Florian Zumbrunn’s algorithms.'
          )}
        </p>
      </div>
    </div>
  );
}
