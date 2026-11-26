"""Render a DOT loop to MP4 + poster.

  python3 -m http.server 8765 -d studio/motion   (in another shell)
  python3 studio/motion/render.py colosse-shift            -> public/motion/colosse-shift.mp4 + public/posters/colosse-shift.jpg
  python3 studio/motion/render.py colosse-shift test 0 2.5 -> stills in /tmp
"""
import asyncio, io, os, subprocess, sys
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

FPS = 30
SUB = 2          # sub-frames per frame, averaged: a touch of motion blur
SHUTTER = 0.5
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, '..', '..', 'public')


async def main(name, mode, args):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--force-color-profile=srgb'])
        pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
        pg.on('console', lambda m: print('console:', m.text, flush=True))
        pg.on('pageerror', lambda e: print('pageerror:', e, flush=True))
        await pg.goto(f'http://127.0.0.1:8765/{name}.html')
        await pg.wait_for_function('isReady()', timeout=120000)
        T = await pg.evaluate('window.T')
        cv = await pg.query_selector('#c')

        async def frame(t):
            await pg.evaluate(f'draw({t % T})')
            buf = await cv.screenshot(type='png')
            return np.asarray(Image.open(io.BytesIO(buf)).convert('RGB'), dtype=np.float32)

        if mode == 'test':
            for a in args:
                arr = await frame(float(a))
                Image.fromarray(arr.astype('uint8')).save(f'/tmp/{name}_{a}.jpg', quality=85)
            print('stills ok')
        else:
            os.makedirs(os.path.join(PUB, 'motion'), exist_ok=True)
            out = os.path.join(PUB, 'motion', f'{name}.mp4')
            ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1920x1080', '-r', str(FPS), '-i', '-',
                                   '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
            n = round(T * FPS)
            poster = None
            for f in range(n):
                acc = None
                for s in range(SUB):
                    t = f / FPS + ((s + .5) / SUB - .5) * SHUTTER / FPS
                    arr = await frame(t)
                    acc = arr if acc is None else acc + arr
                img = (acc / SUB).round().clip(0, 255).astype('uint8')
                ff.stdin.write(img.tobytes())
                if f == 0:
                    poster = img
                if f % 60 == 0:
                    print(f'{name} {f}/{n}', flush=True)
            ff.stdin.close(); ff.wait()
            Image.fromarray(poster).save(os.path.join(PUB, 'posters', f'{name}.jpg'), quality=82)
            print('done', out, os.path.getsize(out) // 1024, 'KB')
        await b.close()

asyncio.run(main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'render', sys.argv[3:]))
