# Développement des images : la pièce (base) + la lumière de Proxy (passes), composées en linéaire, puis rendues comme une photographie.
import os, sys
import numpy as np, cv2, OpenEXR
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')

def exr(name):
    with OpenEXR.File(f'{OUT}/{name}.exr') as f:
        ch = f.channels()
        a = ch['RGBA'].pixels if 'RGBA' in ch else ch['RGB'].pixels
    return np.ascontiguousarray(a[:, :, :3], dtype=np.float32)

def neutral(c):
    """Khronos PBR Neutral: the tone curve Blender applies, so colours stay the product's own."""
    c = np.maximum(c, 0.0)
    start = 0.8 - 0.04; desat = 0.15
    x = c.min(axis=2, keepdims=True)
    off = np.where(x < 0.08, x - 6.25 * x * x, 0.04)
    c = c - off
    peak = c.max(axis=2, keepdims=True)
    d = 1.0 - start
    new = 1.0 - d * d / (peak + d - start)
    scaled = c * (new / np.maximum(peak, 1e-8))
    g = 1.0 - 1.0 / (desat * (peak - new) + 1.0)
    out = scaled * (1 - g) + new * g
    return np.where(peak < start, c, out)

def srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)

def blur(a, sigma):
    return cv2.GaussianBlur(a, (0, 0), sigmaX=sigma, sigmaY=sigma, borderType=cv2.BORDER_REFLECT)

def develop(base, light=None, tint=(1, 1, 1), gain=1.0, exposure=-1.0, bloom=1.0, grain=0.012, vignette=0.10, seed=1, warm=0.0):
    """One photograph: room + Proxy's light, a little glare where the light is strong, the lens's fall-off, the film's grain."""
    h, w = base.shape[:2]
    lin = base * (2.0 ** exposure)
    if light is not None:
        L = light * np.array(tint, np.float32) * gain * (2.0 ** exposure)
        k = w / 2400.0
        # glare: what a lens does to a small, strong light. Two radii: a tight glow, then a wide veil.
        glare = 0.085 * blur(L, 7 * k) + 0.035 * blur(L, 26 * k) + 0.012 * blur(L, 90 * k)
        lin = lin + L + bloom * glare
    # the lens darkens a little toward the corners
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r2 = ((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (w / 2)) ** 2
    lin = lin * (1.0 - vignette * r2)[..., None]
    out = srgb(neutral(lin))
    if grain:
        rng = np.random.default_rng(seed)
        g = rng.normal(0, 1, (h, w)).astype(np.float32)
        g = 0.6 * g + 0.4 * blur(g, 0.8) * 1.6        # a grain with a little body, not digital noise
        lum = out.mean(axis=2)
        amp = grain * (0.55 + 0.9 * (1 - np.abs(lum - 0.45) * 1.6).clip(0, 1))   # strongest in the mid-tones, as on film
        out = out + (g * amp)[..., None]
    return np.clip(out, 0, 1)

def save(a, path, q=92):
    im = Image.fromarray((a * 255 + 0.5).astype(np.uint8))
    im.save(path, quality=q, subsampling=0) if path.endswith('.jpg') else im.save(path)
    return im

if __name__ == '__main__':
    # validation: the composite must match Blender's own beauty render
    base = exr('t-base'); light = exr('t-work0')
    mine = develop(base, light, bloom=0, grain=0, vignette=0)
    ref = np.asarray(Image.open(f'{OUT}/t-beauty.png').convert('RGB'), np.float32) / 255
    diff = np.abs(mine - ref)
    print('mean abs diff', float(diff.mean()), 'p99', float(np.percentile(diff, 99)), 'max', float(diff.max()))
    save(mine, f'{OUT}/t-comp.jpg'); save(develop(base, light), f'{OUT}/t-comp-dev.jpg')
    save(develop(base, exr('t-work0'), tint=(1.0, 0.17, 0.035)), f'{OUT}/t-comp-orange.jpg')
