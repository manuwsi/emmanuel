"""Phone mockups in the portfolio DA: flat black device, white dotted paper, small captions."""
import asyncio, sys
from playwright.async_api import async_playwright
P = 'file:///home/claude/emmanuel/public/'
GS = '/home/claude/emmanuel/src/fonts/GeneralSans-'
CSS = f"""@font-face{{font-family:GS;font-weight:400;src:url('file://{GS}Regular.otf')}}@font-face{{font-family:GS;font-weight:500;src:url('file://{GS}Medium.otf')}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{overflow:hidden;position:relative;font-family:GS;color:#0a0a0a;-webkit-font-smoothing:antialiased}}
.paper{{background:#fff;background-image:radial-gradient(circle,rgba(10,10,10,.11) 1.5px,transparent 2.1px);background-size:30px 30px}}
.warm{{background:#f1efea}}
.ph{{position:absolute;background:#0a0a0a;}}
.ph .sc{{position:absolute;overflow:hidden;background:#000}}
.ph .sc img{{width:100%;height:100%;object-fit:cover;object-position:top;display:block}}
.ph .is{{position:absolute;background:#0a0a0a;border-radius:99px;z-index:2}}
.ph .bt{{position:absolute;background:#0a0a0a;border-radius:2px}}
.cap{{position:absolute;font-size:24px;letter-spacing:-.01em;line-height:1.25;white-space:nowrap}}
.cap b{{font-weight:500}} .cap span{{color:rgba(10,10,10,.5)}}
"""


def phone(src, x, y, w, shadow=True, island=False):
    h = w * 2.1667
    b = w * 0.03
    r = w * 0.165
    sr = r - b
    sh = 'box-shadow:0 %dpx %dpx -%dpx rgba(10,10,10,.28);' % (w * .18, w * .36, w * .2) if shadow else ''
    isl = f'<div class="is" style="width:{w*.28}px;height:{w*.082}px;left:{(w-w*.28)/2}px;top:{b+w*.035}px"></div>' if island else ''
    bt = (f'<div class="bt" style="left:-{w*.012}px;top:{h*.19}px;width:{w*.014}px;height:{h*.045}px"></div>'
          f'<div class="bt" style="left:-{w*.012}px;top:{h*.255}px;width:{w*.014}px;height:{h*.075}px"></div>'
          f'<div class="bt" style="left:-{w*.012}px;top:{h*.345}px;width:{w*.014}px;height:{h*.075}px"></div>'
          f'<div class="bt" style="right:-{w*.012}px;top:{h*.27}px;width:{w*.014}px;height:{h*.11}px"></div>')
    return (f'<div class="ph" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{r}px;{sh}">{bt}'
            f'<div class="sc" style="left:{b}px;top:{b}px;right:{b}px;bottom:{b}px;border-radius:{sr}px">{isl}<img src="{P}{src}"></div></div>')


def cap(x, y, n, txt, light=False):
    return f'<div class="cap" style="left:{x}px;top:{y}px"><b>{n}</b> <span>{txt}</span></div>'


def page(w, h, cls, body):
    return f'<html><head><style>{CSS}body{{width:{w}px;height:{h}px}}</style></head><body class="{cls}">{body}</body></html>'


W, H = 1667, 1250
JOBS = {
    # Shu Uemura — cover: the conversation, then the face analysis, the second one bleeding off the bottom
    'shu-cover-v3': page(W, H, 'paper',
        phone('shu-flow-03-chat.png', 300, 250, 370) + cap(300, 196, '03', 'Conversation avec Haruto') +
        phone('shu-flow-05-face-scan.png', 830, 150, 520) + cap(830, 96, '05', 'Analyse du visage')),
    'shu-hover-v3': page(W, H, 'warm',
        ''.join(phone(f, 118 + i * 370, 230, 320) for i, f in enumerate(['shu-flow-01-cover.png', 'shu-flow-02-select-haruto.png', 'shu-flow-06-brow-shape.png', 'shu-flow-09-recommendations.png']))),
    'serena-cover-v3': page(W, H, 'paper',
        phone('serena-mobile-scan.png', 300, 250, 370) + cap(300, 196, '01', 'Scanner un document') +
        phone('serena-mobile-tasks.png', 830, 150, 520) + cap(830, 96, '02', 'Gestionnaire des tâches')),
    'serena-hover-v3': page(W, H, 'warm',
        ''.join(phone(f, 263 + i * 400, 210, 340) for i, f in enumerate(['serena-mobile-chat.png', 'serena-mobile-scan.png', 'serena-mobile-tasks.png']))),
    # Foil — duo: home and card page
    'foil-duo': page(1700, 1062, 'paper',
        phone('foil/p/accueil.webp', 400, 140, 395) + cap(400, 88, '01', 'Accueil') +
        phone('foil/p/fiche.webp', 905, 140, 395) + cap(905, 88, '02', 'Fiche d’une carte')),
    'foil-lineup': page(1700, 956, 'paper',
        ''.join(phone(f'foil/p/{f}.webp', 95 + i * 312, 150, 262) + cap(95 + i * 312, 100, f'0{i+1}', n)
                for i, (f, n) in enumerate([('constellation', 'Constellation'), ('accueil', 'Accueil'), ('fiche', 'Fiche'), ('evolution', 'Évolution'), ('marches', 'Marchés')]))),
}


async def main(only):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, html in JOBS.items():
            if only and only not in name: continue
            w = 1700 if name.startswith('foil') else W
            h = {'foil-duo': 1062, 'foil-lineup': 956}.get(name, H)
            pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1)
            open(f'{name}.html', 'w').write(html)
            await pg.goto(f'file:///home/claude/mock/{name}.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'{name}.jpg', type='jpeg', quality=92)
            await pg.close()
        await b.close()

asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else ''))
