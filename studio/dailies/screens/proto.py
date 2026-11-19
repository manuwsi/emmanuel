"""Export the screens as a small clickable prototype (static HTML, relative assets)."""
import asyncio, os, re, shutil
from playwright.async_api import async_playwright
import screens as S

OUT = '/home/claude/emmanuel/public/dailies/prototype'
os.makedirs(OUT + '/img', exist_ok=True); os.makedirs(OUT + '/fonts', exist_ok=True)
for f in os.listdir('/home/claude/dailies/img'):
    shutil.copy('/home/claude/dailies/img/' + f, OUT + '/img/' + f)

ORDER = ['01-projet', '02-plan', '03-comparer', '04-revue', '05-validation', '10-valide', '06-retours', '07-budget', '08-echec', '09-mobile']
NAMES = {'01-projet': 'Projet', '02-plan': 'Plan et variantes', '03-comparer': 'Comparer deux versions', '04-revue': 'Revue client',
         '05-validation': 'Validation', '10-valide': 'Version validée', '06-retours': 'Retours à traiter', '07-budget': 'Budget dépassé',
         '08-echec': 'Génération ratée', '09-mobile': 'Mobile, ancien lien'}
# (screen, exact label) -> target screen
LINKS = {
    '01-projet': [('La côte', '02-plan'), ('Envoyer au client', '04-revue'), ('Versions', '02-plan'), ('Retours', '06-retours')],
    '02-plan': [('Comparer avec la v4', '03-comparer'), ('Plans', '01-projet'), ('Retours', '06-retours')],
    '03-comparer': [('Envoyer la v4 au client', '04-revue'), ('Garder la v3', '02-plan'), ('Plans', '01-projet'), ('Retours', '06-retours')],
    '04-revue': [('Valider cette version', '05-validation')],
    '05-validation': [('Valider la version 4', '10-valide'), ('Fermer', '04-revue')],
    '10-valide': [('Revoir le film', '04-revue')],
    '06-retours': [('Régénérer le plan 06', '07-budget'), ('Plans', '01-projet'), ('Versions', '02-plan')],
    '07-budget': [('Envoyer la demande', '08-echec'), ('Annuler', '06-retours')],
    '08-echec': [('Plans', '01-projet'), ('Retours', '06-retours')],
    '09-mobile': [('Ouvrir la version 3', '04-revue'), ('Voir la version 3', '04-revue')],
}
FONT_FILES = {}

def localise(html):
    html = html.replace('file:///home/claude/dailies/img/', 'img/')
    def font(m):
        src = m.group(1); name = os.path.basename(src)
        FONT_FILES[name] = src
        return f"url('fonts/{name}')"
    return re.sub(r"url\('file://([^']+)'\)", font, html)

SHELL = """<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dailies — {title}</title><style>html{{background:{bg};height:100%;overflow:hidden}}body{{width:auto!important;height:100vh!important;margin:0!important;overflow:hidden!important}}#stage{{position:absolute;top:0;width:{w}px;height:{h}px;transform-origin:0 0;overflow:hidden}}
[data-go]{{cursor:pointer;outline:2px solid transparent;transition:outline-color .2s}}
.hint [data-go]{{outline-color:#7aa7ffcc;outline-offset:2px}}
#bar{{position:fixed;left:0;right:0;bottom:0;display:flex;gap:14px;align-items:center;padding:10px 14px;font:13px/1.3 -apple-system,Inter,sans-serif;color:#ddd;background:#000d;z-index:9}}#bar a{{color:#fff}}@media(max-width:600px){{#bar span:last-child{{display:none}}}}</style></head>
<body><div id="stage">{body}</div>
<div id="bar"><a href="index.html">← Tous les écrans</a><span style="opacity:.6">{title}</span><span style="flex:1"></span><span style="opacity:.6">Cliquez sur un bouton, ou appuyez sur H pour voir les zones cliquables</span></div>
<script>
const W={w},H={h};function fit(){{const s=Math.min(innerWidth/W,(innerHeight-40)/H);const st=document.getElementById('stage');st.style.transform='scale('+s+')';st.style.left=Math.max(0,(innerWidth-W*s)/2)+'px';}}fit();addEventListener('resize',fit);
document.querySelectorAll('[data-go]').forEach(e=>e.addEventListener('click',()=>location.href=e.dataset.go+'.html'));
addEventListener('keydown',e=>{{if(e.key==='h'||e.key==='H')document.documentElement.classList.toggle('hint')}});
document.addEventListener('click',e=>{{if(!e.target.closest('[data-go],#bar')){{document.documentElement.classList.add('hint');setTimeout(()=>document.documentElement.classList.remove('hint'),900)}}}});
</script></body></html>"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        for k in ORDER:
            mobile = k == '09-mobile'
            await pg.set_viewport_size({'width': 390, 'height': 844} if mobile else {'width': 1440, 'height': 900})
            open('/home/claude/dailies/gen/_s.html', 'w').write(f'<html><head><meta charset="utf-8"></head><body>{S.SCREENS[k]()}</body></html>')
            await pg.goto('file:///home/claude/dailies/gen/_s.html', wait_until='networkidle')
            for label, target in LINKS.get(k, []):
                n = await pg.evaluate("""([l,t])=>{let n=0;for(const e of document.querySelectorAll('body *')){if(e.children.length===0&&e.textContent.trim()===l){let el=e;while(el.parentElement&&el.parentElement!==document.body&&el.parentElement.textContent.trim()===l)el=el.parentElement;
                  const card=el.closest('div[style*="width:322px"]');(card||el).setAttribute('data-go',t);n++;}}return n}""", [label, target])
                assert n, (k, label)
            body = await pg.evaluate('document.body.innerHTML')
            bg = '#f1efea' if k in ('04-revue', '05-validation', '10-valide', '09-mobile') else '#0b0b0c'
            html = SHELL.format(title=NAMES[k], bg=bg, body=localise(body), w=390 if mobile else 1440, h=844 if mobile else 900)
            open(f'{OUT}/{k}.html', 'w').write(html)
        await b.close()
    for name, src in FONT_FILES.items():
        shutil.copy(src, f'{OUT}/fonts/{name}')
    items = ''.join(f'<a href="{k}.html"><img src="thumbs/{k}.jpg"><span>{i + 1:02d} — {NAMES[k]}</span></a>' for i, k in enumerate(ORDER))
    open(f'{OUT}/index.html', 'w').write(f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dailies — prototype</title>
<style>body{{margin:0;background:#0b0b0c;color:#ececed;font:14px/1.4 -apple-system,Inter,sans-serif;padding:32px 20px 60px}}h1{{font-weight:500;font-size:34px;letter-spacing:-.02em;margin:0}}p{{color:#8b8b91;max-width:640px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px 16px;margin-top:28px}}a{{color:inherit;text-decoration:none}}a img{{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;border-radius:4px;display:block;margin-bottom:9px;background:#1a1a1c}}</style></head>
<body><h1>Dailies — prototype</h1><p>Concept d’outil pour les studios qui produisent des vidéos en IA. Studio, client et film fictifs ; visuels issus de mon projet Higan. À voir sur ordinateur. Parcours conseillé : Projet → Plan → Comparer → Revue client → Validation.</p>
<p><a href="01-projet.html" style="color:#fff;text-decoration:underline">Commencer le parcours →</a> · <a href="/dailies" style="text-decoration:underline">Lire le case study</a></p><div class="g">{items}</div></body></html>""")

asyncio.run(main())
