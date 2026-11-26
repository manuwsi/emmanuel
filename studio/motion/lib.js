/* DOT motion kit — shared by the case-study loops (rendered frame by frame by render.py).
   Every composition defines window.T (loop length, s), window.setup() (async) and window.draw(t).
   Same language as the site: pictures arrive in halftone dots, the sharp picture settles behind the wave. */

const W = 1920, H = 1080;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eo = (t) => 1 - Math.pow(1 - clamp(t), 3);
const eio = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eio5 = (t) => { t = clamp(t); return t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2; };
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
const mod = (a, n) => ((a % n) + n) % n;

const cv = document.getElementById('c');
cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
ctx.imageSmoothingQuality = 'high';

function load(src) {
  return new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.onerror = () => { console.log('missing ' + src); r(i); }; i.src = src; });
}
async function loadAll(list) { return Promise.all(list.map(load)); }

/** source rect for object-fit: cover */
function coverRect(img, w, h, px = 0.5, py = 0.5) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const s = Math.max(w / iw, h / ih), sw = w / s, sh = h / s;
  return [(iw - sw) * px, (ih - sh) * py, sw, sh];
}
function drawCover(c, img, x, y, w, h, px, py) {
  const [sx, sy, sw, sh] = coverRect(img, w, h, px, py);
  c.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function rrect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

/* ---- halftone ---------------------------------------------------------- */
const sampleCache = new Map();
function sample(img, w, h, cell, px = 0.5, py = 0.5) {
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const key = img.src + '|' + cols + 'x' + rows + '|' + px + py;
  let s = sampleCache.get(key);
  if (s) return s;
  const o = document.createElement('canvas'); o.width = cols; o.height = rows;
  const x = o.getContext('2d', { willReadFrequently: true });
  x.imageSmoothingQuality = 'high';
  const [sx, sy, sw, sh] = coverRect(img, w, h, px, py);
  x.drawImage(img, sx, sy, sw * (cols * cell / w), sh * (rows * cell / h), 0, 0, cols, rows);
  const d = x.getImageData(0, 0, cols, rows).data;
  const rgb = [], lum = new Float32Array(cols * rows);
  for (let k = 0; k < cols * rows; k++) {
    rgb.push(`rgb(${d[k * 4]},${d[k * 4 + 1]},${d[k * 4 + 2]})`);
    lum[k] = (0.2126 * d[k * 4] + 0.7152 * d[k * 4 + 1] + 0.0722 * d[k * 4 + 2]) / 255;
  }
  s = { cols, rows, rgb, lum };
  sampleCache.set(key, s);
  return s;
}

const layer = document.createElement('canvas'); layer.width = W; layer.height = H;
const lctx = layer.getContext('2d'); lctx.imageSmoothingQuality = 'high';

/**
 * Bloom `img` into the rect (x,y,w,h): p 0 → nothing, 1 → sharp picture.
 * o: { origin:[ox,oy] in rect (0..1), cell, spread, ink: 'dark'|'light' (which tones grow first), clip(c) }
 */
function bloom(c, img, x, y, w, h, p, o = {}) {
  if (p <= 0) return;
  const cell = o.cell || 12, S = o.spread || 1.4;
  const [oxr, oyr] = o.origin || [0.5, 0.5];
  const s = sample(img, w, h, cell, o.px, o.py);
  const ox = oxr * w, oy = oyr * h;
  const maxD = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));
  const R = cell * 0.64, front = p * (1 + S), half = cell / 2, light = o.ink === 'light';
  c.save();
  if (o.clip) o.clip(c); else { c.beginPath(); c.rect(x, y, w, h); }
  c.clip();
  for (let j = 0; j < s.rows; j++) for (let i = 0; i < s.cols; i++) {
    const cx = i * cell + half, cy = j * cell + half;
    const d = clamp(Math.hypot(cx - ox, cy - oy) / maxD + (hash(i, j) - 0.5) * 0.07);
    const local = clamp(front - d * S);
    if (local <= 0) continue;
    const k = eo(local), idx = j * s.cols + i;
    const tone = light ? s.lum[idx] : 1 - s.lum[idx];
    const ht = clamp(k * (0.12 + 1.3 * tone));
    const r = R * (ht + (1 - ht) * sm(0.5, 1, k));
    if (r < 0.3) continue;
    c.fillStyle = s.rgb[idx];
    c.beginPath(); c.arc(x + cx, y + cy, r, 0, 6.2832); c.fill();
  }
  // sharp picture behind the front
  const band = o.band ?? 0.47, d1 = ((front - 0.97) / S) * maxD, d2 = ((front - 0.97 + band) / S) * maxD;
  if (d2 > 0) {
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.globalCompositeOperation = 'source-over';
    lctx.clearRect(0, 0, W, H);
    drawCover(lctx, img, x, y, w, h, o.px, o.py);
    if (d1 < maxD * 1.02) {
      const g = lctx.createRadialGradient(x + ox, y + oy, Math.max(0, d1), x + ox, y + oy, Math.max(d1 + 1, d2));
      g.addColorStop(0, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
      lctx.globalCompositeOperation = 'destination-in';
      lctx.fillStyle = g; lctx.fillRect(x, y, w, h);
    }
    c.drawImage(layer, 0, 0);
  }
  c.restore();
}

/** A picture rendered as a still halftone (amount 0..1 = dot size), in its own colours or one ink. */
function halftone(c, img, x, y, w, h, o = {}) {
  const cell = o.cell || 10, s = sample(img, w, h, cell, o.px, o.py), half = cell / 2, R = cell * 0.62;
  const light = o.ink === 'light', amt = o.amount ?? 1;
  c.save();
  if (o.clip) o.clip(c); else { c.beginPath(); c.rect(x, y, w, h); }
  c.clip();
  if (o.color) c.fillStyle = o.color;
  for (let j = 0; j < s.rows; j++) for (let i = 0; i < s.cols; i++) {
    const idx = j * s.cols + i;
    const tone = light ? s.lum[idx] : 1 - s.lum[idx];
    const r = R * clamp((0.06 + 1.05 * tone) * amt);
    if (r < 0.35) continue;
    if (!o.color) c.fillStyle = s.rgb[idx];
    c.beginPath(); c.arc(x + i * cell + half, y + j * cell + half, r, 0, 6.2832); c.fill();
  }
  c.restore();
}

/** A field of faint dots, the background texture of the reels. */
function dotField(c, color, gap = 40, r = 1.6, alpha = 1) {
  c.save(); c.globalAlpha = alpha; c.fillStyle = color;
  for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) { c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); }
  c.restore();
}

window.isReady = () => window.__ready === true;
window.addEventListener('load', async () => {
  await document.fonts.ready;
  await window.setup();
  window.__ready = true;
  if (location.hash === '#play') {
    const t0 = performance.now();
    const loop = (n) => { window.draw(((n - t0) / 1000) % window.T); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  } else window.draw(0);
});
