import asyncio, re
from playwright.async_api import async_playwright
P='/home/claude/emmanuel/public'
NR='/home/claude/dailies/node_modules/@fontsource/newsreader/files/newsreader-latin-'
GS='/home/claude/emmanuel/src/fonts/GeneralSans-'
FONT=f"@font-face{{font-family:NR;src:url('file://{NR}400-normal.woff2')}}@font-face{{font-family:GS;src:url('file://{GS}Regular.otf')}}@font-face{{font-family:GS;font-weight:500;src:url('file://{GS}Medium.otf')}}"
src=open('/home/claude/emmanuel/src/components/projects.ts').read()
items=re.findall(r"title: (?:same\('([^']+)'\)|\{ fr: '([^']+)'[^}]*\}),\s*subtitle: \{ fr: '([^']+)'.*?image: '([^']+)'.*?link: '([^']+)'",src,re.S)
def page(title,sub,right):
    return f"""<html><head><meta charset="utf-8"><style>{FONT}*{{margin:0;box-sizing:border-box}}body{{width:1200px;height:630px;background:#0b0b0c;color:#ececed;font-family:GS;position:relative;overflow:hidden}}
.l{{position:absolute;left:64px;top:0;bottom:0;width:470px;display:flex;flex-direction:column;justify-content:center}}
.k{{font-size:13px;letter-spacing:.08em;color:#9a9aa0}}h1{{font-family:NR;font-weight:400;font-size:{86 if len(title)<12 else 62}px;line-height:1;letter-spacing:-.02em;margin-top:22px}}
.s{{font-size:19px;line-height:1.35;color:#c9c9ce;margin-top:22px}}.u{{position:absolute;left:64px;bottom:44px;font-size:14px;color:#77777d}}
.r{{position:absolute;right:0;top:0;bottom:0;width:600px}}.r img{{width:100%;height:100%;object-fit:cover;display:block}}</style></head>
<body><div class="l"><div class="k">EMMANUEL IJJOU · PRODUCT DESIGNER</div><h1>{title}</h1><div class="s">{sub}</div></div><div class="u">ijjouemmanuel.com</div><div class="r">{right}</div></body></html>"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1200,'height':630})
        async def shot(html,out):
            open('/tmp/og.html','w').write(html); await pg.goto('file:///tmp/og.html',wait_until='networkidle'); await pg.wait_for_timeout(200)
            await pg.screenshot(path=out,type='jpeg',quality=88)
        for t1,t2,sub,img,link in items:
            title=t1 or t2; sub=sub.split(' — ',1)[-1]
            slug=link.strip('/')
            right=f'<img src="file://{P}{img}">'
            if slug=='dailies':
                right=f'<div style="position:absolute;inset:0;background:#18181a"></div><img src="file://{P}/dailies/01-projet.webp" style="position:absolute;left:40px;top:70px;width:500px;height:auto;border-radius:4px;box-shadow:0 20px 50px #0008"><img src="file://{P}/dailies/04-revue.webp" style="position:absolute;left:110px;top:270px;width:460px;height:auto;border-radius:4px;box-shadow:0 20px 50px #000a">'
            await shot(page(title,sub,right),f'{P}/og/{slug}.jpg'); print(slug)
        right='<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;height:100%;gap:8px;padding:48px 48px 48px 0">'+''.join(f'<div style="overflow:hidden;border-radius:4px"><img src="file://{P}{i}"></div>' for i in ['/dailies/cover.jpg','/elan/cover.jpg','/foil/cover.jpg','/hennessy.png'])+'</div>'
        await shot(page('Product Designer','UX/UI, produit et IA. Paris — Hennessy, Shu Uemura, Louis Vuitton, L’Oréal.',right),f'{P}/og.jpg'); print('og')
        await b.close()
asyncio.run(main())
