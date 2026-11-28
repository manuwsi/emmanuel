# onde_film.py W H : a short film of « L'onde » (work, then waiting, then the stop), frame by frame from the page's own shader.
# Writes frames/fNNNN.jpg next to this file; then: ffmpeg -framerate 30 -i frames/f%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 15 film.mp4
import asyncio, re, json, base64, sys, os
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = open(os.path.join(HERE, '../../../src/components/proxy/ondeShader.ts')).read()
os.makedirs(os.path.join(HERE, 'frames'), exist_ok=True)
grab = lambda name: re.search(r'export const ' + name + r' = /\* glsl \*/ `(.*?)`;', SRC, re.S).group(1)
VERT, FRAG = grab('VERT'), grab('FRAG')
WORK = json.loads(re.search(r"export const WORK = (\[.*?\]);", SRC).group(1).replace("'", '"'))
WAIT = re.search(r"export const WAIT = '(.*?)';", SRC).group(1); STOP = re.search(r"export const STOP = '(.*?)';", SRC).group(1)
CAM = re.search(r'export function camera\(aspect: number\).*?\{(.*?)\n\}', SRC, re.S).group(1).replace('(a: number, b: number)', '(a, b)')
W, H = int(sys.argv[1]), int(sys.argv[2]); FPS = 30; SS = 2
# seconds: [start, state]
PLAN = [[0, 'work'], [6.24, 'wait'], [11.44, 'stop']]; END = 16.5
HTML = '''<!doctype html><html><body style="margin:0;background:#000"><canvas id="c"></canvas><canvas id="o"></canvas><script>
const VERT = %s, FRAG = %s, WORK = %s, WAIT = %s, STOP = %s, PLAN = %s;
function camera(aspect) {%s}
const c = document.getElementById('c'); c.width = %d; c.height = %d; const o = document.getElementById('o'); o.width = %d; o.height = %d;
const gl = c.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
const a = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
const u = (n) => gl.getUniformLocation(pr, n); gl.viewport(0, 0, c.width, c.height);
const cam = camera(c.width / c.height); gl.uniform2f(u('uRes'), c.width, c.height); gl.uniform4f(u('uCam'), cam[0], cam[1], cam[2], cam[3]); gl.uniform2f(u('uLens'), cam[4], 0);
const D = new Float32Array(100).fill(-100); let n = 0, tick = -9, state = 'work', lamp = 0, salvo = -10, last = -5;
const rnd = (i) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
const drop = (k, amp, t) => { n++; t += (rnd(n) - 0.5) * 0.11; amp *= 0.85 + 0.3 * rnd(n + 0.5); const q = k * 4; if (D[q] <= D[q + 2]) { D[q] = t; D[q + 1] = amp; } else { D[q + 2] = t; D[q + 3] = amp; } };
const all = (p, t) => { for (let k = 0; k < 25; k++) if (p[k] === 'a') drop(k, 1, t); };
const falling = (i) => { const f = WORK[((i %% 4) + 4) %% 4], pv = WORK[(((i - 1) %% 4) + 4) %% 4]; for (let k = 0; k < 25; k++) { if (f[k] === 'a' && pv[k] !== 'a') drop(k, 1, i * 0.52); else if (f[k] === 'h' && pv[k] === '.') drop(k, 0.5, i * 0.52); } };
window.frame = (T, dt) => {
  // the state of the plan at this time
  let s = 'work'; for (const [t0, st] of PLAN) if (T >= t0) s = st;
  if (s !== state) { state = s; if (s === 'stop') all(STOP, T); if (s === 'wait') { salvo = T; all(WAIT, T); } }
  while ((tick + 1) * 0.52 <= T) { tick++; if (state === 'work') falling(tick); else if (state === 'wait' && tick * 0.52 - salvo > 0.52 * 3.5) { salvo = tick * 0.52; all(WAIT, salvo); } }
  lamp += ((state === 'stop' ? 1 : 0) - lamp) * (1 - Math.exp(-dt / 0.5));
  gl.uniform1f(u('uT'), T); gl.uniform4fv(u('uD[0]'), D); gl.uniform1f(u('uLamp'), lamp); gl.uniform1f(u('uSeed'), Math.floor(T * 14) %% 997);
  gl.drawArrays(gl.TRIANGLES, 0, 3); gl.finish();
  const g = o.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(c, 0, 0, o.width, o.height);
  return o.toDataURL('image/jpeg', 0.97).slice(23);
};
</script></body></html>''' % (json.dumps(VERT), json.dumps(FRAG), json.dumps(WORK), json.dumps(WAIT), json.dumps(STOP), json.dumps(PLAN), CAM, W * SS, H * SS, W, H)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await (await b.new_context(viewport={'width': 400, 'height': 300})).new_page(); await pg.set_content(HTML)
        # the water is never met empty: a few seconds run before the first frame
        for i in range(-150, 0): 
            if i % 30 == 0: await pg.evaluate(f'frame({i / FPS}, {1 / FPS}) && 0')
        N = int(END * FPS)
        for i in range(N):
            data = await pg.evaluate(f'frame({i / FPS}, {1 / FPS})')
            open(os.path.join(HERE, f'frames/f{i:04d}.jpg'), 'wb').write(base64.b64decode(data))
            if i % 30 == 0: print(i, N, flush=True)
        await b.close()
asyncio.run(main())
