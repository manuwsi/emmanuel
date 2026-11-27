"""Render the covers/openings of studio/covers/index.html to images in public/.
usage: python3 render.py [id ...]"""
import asyncio, sys, pathlib
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent
PUB = HERE.parent.parent / 'public'
JOBS = {
  'colosse': [('cover', 1600, 1200, 1, 'colosse/cover-v4.jpg'), ('open', 1440, 900, 2, 'colosse/opening.jpg')],
  'proxy':   [('cover', 1600, 1200, 1, 'proxy/cover-v4.jpg'),   ('open', 1440, 900, 2, 'proxy/opening.jpg')],
  'elan':    [('cover', 1600, 1200, 1, 'elan/cover-v4.jpg')],
}
async def main(ids):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        for id_ in ids:
            for kind, w, h, dpr, out in JOBS[id_]:
                for lang in ['fr']:
                    pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=dpr)
                    await pg.goto(f'file://{HERE}/index.html?id={id_}&w={w}&h={h}&lang={lang}')
                    await pg.wait_for_function('window.__ready === true', timeout=20000)
                    await pg.wait_for_timeout(200)
                    dest = PUB / out
                    await pg.locator('#s').screenshot(path=str(dest), type='jpeg', quality=90)
                    print('wrote', dest.relative_to(PUB), w * dpr, h * dpr)
                    await pg.close()
        await b.close()
asyncio.run(main(sys.argv[1:] or list(JOBS)))
