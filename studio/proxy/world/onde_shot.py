# onde_shot.py out W H state T [ss=2] : one frame of « L'onde », computed by the page's own shader, in headless Chrome.
# state: work | wait | stop. T: seconds. ss: supersampling. SINCE=<seconds> in the environment: the moment the state was switched to (from work).
# Needs: pip install playwright && playwright install chromium
import asyncio, sys, re, json, os
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = open(os.path.join(HERE, '../../../src/components/proxy/ondeShader.ts')).read()
def grab(name):
    m = re.search(r'export const ' + name + r' = /\* glsl \*/ `(.*?)`;', SRC, re.S); return m.group(1)
VERT, FRAG = grab('VERT'), grab('FRAG')
WORK = json.loads(re.search(r"export const WORK = (\[.*?\]);", SRC).group(1).replace("'", '"'))
WAIT = re.search(r"export const WAIT = '(.*?)';", SRC).group(1); STOP = re.search(r"export const STOP = '(.*?)';", SRC).group(1)
CAM = re.search(r'export function camera\(aspect: number\).*?\{(.*?)\n\}', SRC, re.S).group(1).replace('(a: number, b: number)', '(a, b)')
out, W, H, state, T = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], float(sys.argv[5])
ss = float(sys.argv[6]) if len(sys.argv) > 6 else 2; extra = sys.argv[7] if len(sys.argv) > 7 else ''
HTML = '''<!doctype html><html><body style="margin:0;background:#000"><canvas id="c" style="display:block;width:%dpx;height:%dpx"></canvas><script>
const VERT = %s, FRAG = %s, WORK = %s, WAIT = %s, STOP = %s;
function camera(aspect) {%s}
function rnd(i) { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); }
function simulate(state, T, since) {
  const D = new Float32Array(100).fill(-100);
  let n = 0; const drop = (k, t, amp) => { n++; t += (rnd(n) - 0.5) * 0.11; amp *= 0.85 + 0.3 * rnd(n + 0.5); const o = k * 4; if (D[o] <= D[o + 2]) { D[o] = t; D[o + 1] = amp; } else { D[o + 2] = t; D[o + 3] = amp; } };
  let prev = '.'.repeat(25);
  for (let i = 0, t = 0; t <= T; i++, t = i * 0.52) {
    const st = (since !== undefined && t >= since) ? state : (since !== undefined ? 'work' : state);
    if (st === 'work') { const f = WORK[i %% 4]; for (let k = 0; k < 25; k++) { if (f[k] === 'a' && prev[k] !== 'a') drop(k, t, 1); else if (f[k] === 'h' && prev[k] === '.') drop(k, t, 0.5); } prev = f; }
    if (st === 'wait' && i %% 4 === 0) for (let k = 0; k < 25; k++) if (WAIT[k] === 'a') drop(k, t, 1);
    if (st === 'stop' && since !== undefined && Math.abs(t - since) < 0.26) for (let k = 0; k < 25; k++) if (STOP[k] === 'a') drop(k, t, 1);
  }
  return D;
}
window.draw = (state, T, lamp, since) => {
  const c = document.getElementById('c'); c.width = %d; c.height = %d;
  const gl = c.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr)); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(pr, n);
  gl.viewport(0, 0, c.width, c.height);
  let cam = camera(c.width / c.height); %s
  gl.uniform2f(u('uRes'), c.width, c.height); gl.uniform1f(u('uT'), T); gl.uniform4fv(u('uD[0]'), simulate(state, T, since));
  gl.uniform4f(u('uCam'), cam[0], cam[1], cam[2], cam[3]); gl.uniform2f(u('uLens'), cam[4], window.SIDE || 0); gl.uniform1f(u('uLamp'), lamp); gl.uniform1f(u('uSeed'), 3);
  const t0 = performance.now(); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.finish(); return performance.now() - t0;
};
</script></body></html>''' % (W, H, json.dumps(VERT), json.dumps(FRAG), json.dumps(WORK), json.dumps(WAIT), json.dumps(STOP), CAM, int(W * ss), int(H * ss), extra)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await (await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=ss)).new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.set_content(HTML)
        lamp = 1 if state == 'stop' else 0
        since = os.environ.get('SINCE')
        try:
            ms = await pg.evaluate(f'draw({json.dumps(state)}, {T}, {os.environ.get("LAMP", lamp)}, {since if since else "undefined"})')
        except Exception as e:
            print('ERR', str(e)[:1500]); await b.close(); return
        await pg.locator('#c').screenshot(path=out); print(out, 'ms', round(ms), errs[:2])
        await b.close()
asyncio.run(main())
