# Du rendu à la page : compose les passes, développe, et exporte les images du case study.
# python3 export.py [presence] [nuit] [consigne] [fenetre]   (sans argument : tout ce qui est prêt)
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comp import *
from PIL import Image, ImageFilter

DEST = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../public/proxy/world'))
os.makedirs(DEST, exist_ok=True)
ORANGE = (1.0, 0.115, 0.028)          # #c9461f as a light
A_EXP = -1.6; A_GAIN = 1.78           # the day frame
E_EXP = 1.0                           # the night frame
want = sys.argv[1:] or ['presence', 'nuit', 'consigne', 'fenetre']
have = lambda n: os.path.exists(f'{OUT}/{n}.exr')

def jpg(a, name, q=90):
    im = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8)); im.save(f'{DEST}/{name}.jpg', quality=q, subsampling=0, optimize=True, progressive=True)
    print(name + '.jpg', im.size, os.path.getsize(f'{DEST}/{name}.jpg') // 1024, 'KB'); return im

if 'presence' in want and have('F-A-base') and have('F-A-rest'):
    base = exr('F-A-base'); h, w = base.shape[:2]
    states = [s for s in ('work0', 'work1', 'work2', 'work3', 'wait', 'stop') if have(f'F-A-{s}')]
    rest = develop(base, exr('F-A-rest'), exposure=A_EXP, gain=A_GAIN)
    jpg(rest, 'presence')
    # where the light falls: the box of everything any state lights, with room for its glare
    lit = np.zeros((h, w), bool)
    for s in states + ['rest']: lit |= exr(f'F-A-{s}').max(axis=2) > 0.004
    ys, xs = np.where(lit); m = int(0.05 * w)
    x0, x1 = max(0, xs.min() - m), min(w, xs.max() + m); y0, y1 = max(0, ys.min() - m), min(h, ys.max() + m)
    x0 -= x0 % 2; y0 -= y0 % 2; x1 += x1 % 2; y1 += y1 % 2
    box = {'x': round(x0 / w, 4), 'y': round(y0 / h, 4), 'w': round((x1 - x0) / w, 4), 'h': round((y1 - y0) / h, 4)}
    cx = (xs.min() + xs.max()) / 2 / w
    # each state replaces that box; its edges are feathered so nothing can show where it meets the base
    f = int(0.018 * w); ax = np.ones(x1 - x0, np.float32); ay = np.ones(y1 - y0, np.float32)
    ramp = np.linspace(0, 1, f, dtype=np.float32) ** 2 * (3 - 2 * np.linspace(0, 1, f, dtype=np.float32)) if False else (lambda t: t * t * (3 - 2 * t))(np.linspace(0, 1, f, dtype=np.float32))
    ax[:f] = ramp; ax[-f:] = ramp[::-1]; ay[:f] = ramp; ay[-f:] = ramp[::-1]
    alpha = np.outer(ay, ax)
    for s in states:
        full = develop(base, exr(f'F-A-{s}'), exposure=A_EXP, gain=A_GAIN * (1.08 if s == 'stop' else 1.0), tint=ORANGE if s == 'stop' else (1, 1, 1))
        crop = full[y0:y1, x0:x1]
        rgba = np.dstack([crop, alpha])
        im = Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA')
        im.save(f'{DEST}/presence-{s}.webp', quality=88, method=6, alpha_quality=100)
        print(f'presence-{s}.webp', im.size, os.path.getsize(f'{DEST}/presence-{s}.webp') // 1024, 'KB')
    print('LIGHT', box, 'CX', round(float(cx), 4))

if 'nuit' in want and have('F-E-base') and have('F-A-done'):
    eb = exr('F-E-base')
    night = develop(eb, exr('F-A-done'), exposure=E_EXP, gain=A_GAIN * 2 ** (A_EXP - E_EXP), grain=0.016, vignette=0.22, seed=2)
    jpg(night, 'nuit')

if 'consigne' in want and have('F-C-base') and have('F-C-stop'):
    b = exr('F-C-base'); l = exr('F-C-stop')
    g = 0.86 / np.percentile(l[..., 0], 99.5)
    e = 0.45
    jpg(develop(b, l, exposure=e, tint=ORANGE, gain=g / (2 ** e), grain=0.015, vignette=0.22, seed=3), 'consigne')

if 'fenetre' in want and os.path.exists(f'{OUT}/../gen/train-1.png'):
    im = Image.open(f'{OUT}/../gen/train-1.png').convert('RGB')
    W2 = 2100; H2 = round(W2 * im.height / im.width)
    im = im.resize((W2, H2), Image.LANCZOS)
    a = np.asarray(im, np.float32) / 255
    # into the series: the same cool neutral, blacks that stop at ink, and the same grain over the enlargement
    lum = a.mean(axis=2, keepdims=True)
    a = lum + (a - lum) * 0.55                       # quieter colour
    a = a * np.array([0.985, 0.995, 1.012], np.float32)
    a = 0.028 + a * (1 - 0.028)                      # ink, not pure black
    rng = np.random.default_rng(7); g = rng.normal(0, 1, a.shape[:2]).astype(np.float32); g = 0.6 * g + 0.64 * blur(g, 0.8)
    amp = 0.013 * (0.55 + 0.9 * (1 - np.abs(a.mean(axis=2) - 0.45) * 1.6).clip(0, 1))
    a = a + (g * amp)[..., None]
    jpg(a, 'fenetre', 90)
