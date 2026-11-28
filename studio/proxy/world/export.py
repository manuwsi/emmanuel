# Du rendu à la page : compose les passes, développe, et exporte les images du case study.
# python3 export.py [nuit] [consigne] [fenetre]   (sans argument : tout ce qui est prêt)
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comp import *
from PIL import Image, ImageFilter

DEST = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../public/proxy/world'))
os.makedirs(DEST, exist_ok=True)
ORANGE = (1.0, 0.115, 0.028)          # #c9461f as a light
A_EXP = -1.6; A_GAIN = 1.78           # the reference exposure of the series (the day frame it was set on is no longer on the page)
E_EXP = 1.0                           # the night frame
want = sys.argv[1:] or ['nuit', 'consigne', 'fenetre']
have = lambda n: os.path.exists(f'{OUT}/{n}.exr')

def jpg(a, name, q=90):
    im = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8)); im.save(f'{DEST}/{name}.jpg', quality=q, subsampling=0, optimize=True, progressive=True)
    print(name + '.jpg', im.size, os.path.getsize(f'{DEST}/{name}.jpg') // 1024, 'KB'); return im

# Friday, 18:00 — the laptop shut, small in a dark room, seen from across it. Two frames of the same picture:
# the grid lit on its lid, then the single point that is left. The page dissolves from one to the other, once.
if 'nuit' in want and have('W-E-base') and have('W-E-work0') and have('W-E-done'):
    eb = exr('W-E-base')
    for light, name in (('W-E-work0', 'nuit-grille'), ('W-E-done', 'nuit-point')):
        jpg(develop(eb, exr(light), exposure=E_EXP, gain=A_GAIN * 2 ** (A_EXP - E_EXP), grain=0.016, vignette=0.22, seed=2), name, q=88)

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
