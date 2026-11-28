'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FRAG, STOP, VERT, WAIT, WORK, camera } from './ondeShader';

export type Shown = 'work' | 'wait' | 'stop';

/** Which drops fall when the clock ticks, and how heavy: the points that have just lit in the interface, frame by frame. */
function falling(tick: number): [number, number][] {
  const out: [number, number][] = [];
  const f = WORK[((tick % 4) + 4) % 4];
  const prev = WORK[(((tick - 1) % 4) + 4) % 4];
  for (let k = 0; k < 25; k++) {
    if (f[k] === 'a' && prev[k] !== 'a') out.push([k, 1]);
    else if (f[k] === 'h' && prev[k] === '.') out.push([k, 0.5]);
  }
  return out;
}

/** Seconds between two beats of the presence: the interface's own clock. */
const TICK = 0.52;

type Api = { fall: (state: Shown, tick: number) => void; turn: (state: Shown) => void };

/**
 * « L'onde », live: the shader on a canvas, over a still of itself.
 * The still is what shows first, and what stays if the browser cannot draw (no WebGL, a lost context, a device too slow).
 * Nothing is compiled before the picture comes near the window, and it only runs while it is in it.
 * With reduced motion the canvas draws one frame per state and nothing moves.
 */
export function Onde({ state, tick, alt, onLive }: { state: Shown; tick: number; alt: string; onLive?: (live: boolean) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<Api | null>(null);
  const [live, setLive] = useState(false);
  const told = useRef(onLive);
  told.current = onLive;
  const wanted = useRef(state);
  wanted.current = state;

  useEffect(() => {
    const el = wrap.current;
    const c = canvas.current;
    if (!el || !c) return;
    let gone = false;
    let undo: (() => void) | undefined;

    const init = () => {
      const gl = c.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false });
      if (!gl) return;
      // the picture needs real precision in its fragment shader: without it, the still stays
      const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      if (!hp || !hp.precision) return;
      const vs = gl.createShader(gl.VERTEX_SHADER);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      const pr = gl.createProgram();
      if (!vs || !fs || !pr) return;
      gl.shaderSource(vs, VERT);
      gl.shaderSource(fs, FRAG);
      gl.compileShader(vs);
      gl.compileShader(fs);
      gl.attachShader(pr, vs);
      gl.attachShader(pr, fs);
      gl.linkProgram(pr);
      let stopAll = () => {};
      undo = () => {
        stopAll();
        gl.deleteProgram(pr);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
      // where the browser can compile on the side, the page is not held up while it does
      const ext = gl.getExtension('KHR_parallel_shader_compile');
      const wait = () => {
        if (gone) return;
        if (ext && !gl.getProgramParameter(pr, ext.COMPLETION_STATUS_KHR)) {
          setTimeout(wait, 50);
          return;
        }
        if (gl.getProgramParameter(pr, gl.LINK_STATUS)) stopAll = run(gl, pr);
      };
      wait();
    };

    const run = (gl: WebGLRenderingContext, pr: WebGLProgram) => {
      gl.useProgram(pr);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = Object.fromEntries(['uRes', 'uT', 'uD', 'uCam', 'uLens', 'uLamp', 'uSeed'].map((n) => [n, gl.getUniformLocation(pr, n)]));

      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const D = new Float32Array(100).fill(-100);
      let T = 0;
      let n = 0;
      let lamp = 0;
      let lampTo = 0;
      let now: Shown = 'work';
      let scale = Math.min(window.devicePixelRatio || 1, 2);
      let raf = 0;
      let last = 0;
      let dead = false;
      let shown = false;
      let salvo = -10;

      // each point remembers its last two drops; a little irregularity in time and weight, as rain has
      const drop = (k: number, amp: number, at: number) => {
        n += 1;
        const r = (x: number) => {
          const v = Math.sin(x * 12.9898 + 4.1) * 43758.5453;
          return v - Math.floor(v);
        };
        const t = at + (r(n) - 0.5) * 0.11;
        const a = amp * (0.85 + 0.3 * r(n + 0.5));
        const o = k * 4;
        if (D[o] <= D[o + 2]) {
          D[o] = t;
          D[o + 1] = a;
        } else {
          D[o + 2] = t;
          D[o + 3] = a;
        }
      };
      const all = (pattern: string, at: number) => {
        for (let k = 0; k < 25; k++) if (pattern[k] === 'a') drop(k, 1, at);
      };
      // what the water looks like after a while in a state: it is never met empty
      const settle = (s: Shown) => {
        D.fill(-100);
        if (s === 'work') for (let i = -8; i < 0; i++) falling(i + 8).forEach(([k, a]) => drop(k, a, T + i * TICK));
        if (s === 'wait') all(WAIT, T - 0.62);
      };

      const size = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return false;
        const k = Math.min(scale, 2200 / w);
        const W = Math.max(2, Math.round(w * k));
        const H = Math.max(2, Math.round(h * k));
        if (c.width !== W || c.height !== H) {
          c.width = W;
          c.height = H;
        }
        gl.viewport(0, 0, W, H);
        const cam = camera(W / H);
        gl.uniform2f(U.uRes, W, H);
        gl.uniform4f(U.uCam, cam[0], cam[1], cam[2], cam[3]);
        gl.uniform2f(U.uLens, cam[4], 0);
        return true;
      };
      const draw = () => {
        gl.uniform1f(U.uT, T);
        gl.uniform4fv(U.uD, D);
        gl.uniform1f(U.uLamp, lamp);
        gl.uniform1f(U.uSeed, Math.floor(T * 14) % 997);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (!shown) {
          shown = true;
          setLive(true);
          told.current?.(true);
        }
      };
      const give = () => {
        stop();
        dead = true;
        setLive(false);
        told.current?.(false);
      };

      // too slow for this device: fewer pixels first, and if that is not enough, the still
      let acc = 0;
      let count = 0;
      let cuts = 0;
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(Math.max((t - last) / 1000, 0), 0.25);
        last = t;
        T += dt;
        lamp += (lampTo - lamp) * (1 - Math.exp(-dt / 0.5));
        draw();
        acc += dt;
        count += 1;
        if (count === 50) {
          if (acc / count > 0.04) {
            if (cuts < 3) {
              cuts += 1;
              scale *= 0.75;
              size();
            } else give();
          }
          acc = 0;
          count = 0;
        }
      };
      const start = () => {
        if (raf || dead || still) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      const turn = (s: Shown, at: 'once' | 'now') => {
        if (dead || s === now) return;
        now = s;
        lampTo = s === 'stop' ? 1 : 0;
        if (still || at === 'once') {
          // nothing to play: the state as it looks once settled
          lamp = lampTo;
          settle(s);
          if (still) draw();
        } else if (s === 'stop') {
          // the cross of the pause screen falls once, then the rain is over
          all(STOP, T);
        } else if (s === 'wait') {
          salvo = T;
          all(WAIT, T);
        }
      };

      settle('work');
      if (!size()) return () => {};
      turn(wanted.current, 'once');
      if (still) draw();

      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '10% 0px' });
      io.observe(el);
      const ro = new ResizeObserver(() => {
        if (!dead && size() && (still || !raf)) draw();
      });
      ro.observe(el);
      const lost = (e: Event) => {
        e.preventDefault();
        give();
      };
      c.addEventListener('webglcontextlost', lost);

      api.current = {
        fall: (s, i) => {
          if (still || dead || !raf) return;
          if (s === 'work') falling(i).forEach(([k, a]) => drop(k, a, T));
          // waiting: the four points of the request, together, once every four beats
          else if (s === 'wait' && T - salvo > TICK * 3.5) {
            salvo = T;
            all(WAIT, T);
          }
        },
        turn: (s) => turn(s, 'now'),
      };
      return () => {
        api.current = null;
        stop();
        io.disconnect();
        ro.disconnect();
        c.removeEventListener('webglcontextlost', lost);
        gl.deleteBuffer(buf);
      };
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        init();
      },
      { rootMargin: '200% 0px' }
    );
    near.observe(el);
    return () => {
      gone = true;
      near.disconnect();
      undo?.();
    };
  }, []);

  useEffect(() => {
    api.current?.turn(state);
  }, [state]);
  useEffect(() => {
    api.current?.fall(state, tick);
    // the state is read at the tick: a change of state has its own effect above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Image src="/proxy/world/onde.jpg" alt={alt} fill quality={84} sizes="100vw" className="hidden object-cover md:block" />
      <Image src="/proxy/world/onde-portrait.jpg" alt={alt} fill quality={84} sizes="100vw" className="object-cover md:hidden" />
      <canvas ref={canvas} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
