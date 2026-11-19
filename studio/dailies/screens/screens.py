"""Dailies — concept screens. Fictional studio and client; visuals from Emmanuel's own Higan project."""
import asyncio, sys
from playwright.async_api import async_playwright

GS = '/home/claude/emmanuel/src/fonts/GeneralSans-'
NR = '/home/claude/dailies/node_modules/@fontsource/newsreader/files/newsreader-latin-'
GM = '/home/claude/dailies/node_modules/@fontsource/geist-mono/files/geist-mono-latin-'
I = 'file:///home/claude/dailies/img/'

FONTS = ''.join(
    f"@font-face{{font-family:GS;font-weight:{w};src:url('file://{GS}{n}.otf')}}"
    for w, n in [(300, 'Light'), (400, 'Regular'), (500, 'Medium'), (600, 'Semibold')]
) + ''.join(
    f"@font-face{{font-family:NR;font-weight:{w};src:url('file://{NR}{w}-normal.woff2')}}" for w in (300, 400, 500)
) + f"@font-face{{font-family:NR;font-style:italic;font-weight:400;src:url('file://{NR}400-italic.woff2')}}" + ''.join(
    f"@font-face{{font-family:GM;font-weight:{w};src:url('file://{GM}{w}-normal.woff2')}}" for w in (400, 500)
)

BASE = FONTS + """
*{box-sizing:border-box;margin:0;padding:0}
body{width:1440px;height:900px;overflow:hidden;font-family:GS;font-size:13px;line-height:1.35;-webkit-font-smoothing:antialiased}
img{display:block;width:100%;height:100%;object-fit:cover}
.mono{font-family:GS;font-variant-numeric:tabular-nums;letter-spacing:0}
.row{display:flex;align-items:center}
.sp{flex:1}
"""

# ---------- team side: dark, dense ----------
DARK = BASE + """
body{background:#0b0b0c;color:#ececed}
.mut{color:#8b8b91}.dim{color:#5c5c62}
.chip{background:#ececed;color:#0b0b0c;padding:6px 11px;border-radius:4px;font-weight:500;white-space:nowrap}
.pill{border:1px solid #2a2a2e;border-radius:30px;padding:5px 12px;color:#b9b9bf;white-space:nowrap}
.pill.on{background:#ececed;color:#0b0b0c;border-color:#ececed}
.line{border-top:1px solid #1f1f22}
.st{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.st i{width:7px;height:7px;border-radius:50%;display:inline-block}
.ok i{background:#7fd99a}.rev i{background:#f2c46b}.fb i{background:#ff7a66}.gen i{background:#7aa7ff}.todo i{background:#4a4a50}
.btn{background:#ececed;color:#0b0b0c;border-radius:4px;padding:10px 16px;font-weight:500;white-space:nowrap}
.btn2{border:1px solid #2f2f33;border-radius:4px;padding:9px 14px;color:#d8d8dc;white-space:nowrap}
.k{color:#8b8b91;font-size:12px}
"""

STATUS = {'ok': 'Validé', 'rev': 'Dans la v3 envoyée', 'fb': 'Retour à traiter', 'gen': 'En génération', 'int': 'Revue interne', 'todo': 'À générer'}
SHOTS = [  # n, name, img, status, version, credits, duration
    ('01', 'La planète', 'planet', 'ok', 'v2', 18, 4.0),
    ('02', 'La côte', 'shore-1', 'rev', 'v3', 41, 3.5),
    ('03', 'Le fleuve rouge', 'shore-river', 'ok', 'v1', 9, 3.0),
    ('04', 'La brume', 'shore-light', 'fb', 'v2', 26, 4.5),
    ('05', 'La fleur', 'flower-red', 'rev', 'v4', 38, 4.0),
    ('06', 'La métamorphose', 'metamorphosis', 'gen', 'v5', 52, 4.5),
    ('07', 'La créature', 'creature', 'rev', 'v2', 22, 3.5),
    ('08', 'Le flacon', 'packshot', 'ok', 'v1', 8, 3.0),
]
USED = sum(s[5] for s in SHOTS)  # 214
BUDGET = 400


def st(k):
    cls = 'rev' if k == 'int' else k
    return f'<span class="st {cls}"><i></i>{STATUS[k]}</span>'


def topbar(crumbs, tab, right='', used=USED):
    """Hyeja-style corner nav: two solid chips (Menu + the render counter, like 'Cart 0'), a breadcrumb, sub-pills."""
    pct = used / BUDGET * 100
    bar = '#ff7a66' if pct > 95 else '#0b0b0c'
    tabs = ''.join(f'<span class="pill{" on" if t == tab else ""}">{t}</span>' for t in ['Plans', 'Versions', 'Retours', 'Livraison'])
    crumb = ' <span class="dim">/</span> '.join(crumbs)
    return f"""<div style="padding:14px 16px 0">
<div class="row" style="gap:6px">
  <span class="chip">Menu</span>
  <span class="chip row" style="gap:9px">Rendus <span class="mono" style="font-size:12px">{used} / {BUDGET}</span>
    <span style="width:46px;height:4px;background:#0b0b0c22;border-radius:2px;overflow:hidden;display:inline-block"><span style="display:block;height:100%;width:{pct:.0f}%;background:{bar}"></span></span></span>
  <span class="pill" style="margin-left:6px;border-color:transparent;color:#b9b9bf">{crumb}</span>
  <span class="sp"></span>{right}
  <span class="row" style="padding-left:7px">{''.join(f'<span style="width:26px;height:26px;border-radius:50%;background:{c};border:2px solid #0b0b0c;margin-left:-7px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#0b0b0c">{t}</span>' for c, t in [('#c9b8ff', 'IN'), ('#9fe0c0', 'TH')])}</span>
</div>
<div class="row" style="gap:6px;margin-top:10px;padding-left:2px"><span class="dim" style="margin-right:4px">↳</span>{tabs}</div>
</div>"""


def thumb(img, w, h, extra=''):
    return f'<div style="width:{w}px;height:{h}px;border-radius:3px;overflow:hidden;background:#1a1a1c;{extra}"><img src="{I}{img}.jpg"></div>'


# 1 — project: every shot and where it stands
def s1_project():
    cards = ''
    for n, name, img, s, v, cr, d in SHOTS:
        cards += f"""<div style="width:322px">
{thumb(img, 322, 181)}
<div class="row" style="margin-top:9px"><span class="mono dim" style="width:26px">{n}</span><span style="font-weight:500">{name}</span><span class="sp"></span><span class="mono mut">{v}</span></div>
<div class="row k" style="margin-top:5px;padding-left:26px">{st(s)}<span class="sp"></span><span class="mono">{str(d).replace('.', ',')} s · {cr} cr</span></div>
</div>"""
    total = sum(s[6] for s in SHOTS)
    seg = ''.join(
        f'<div style="flex:{d};height:30px;border-radius:2px;overflow:hidden;position:relative"><img src="{I}{img}.jpg" style="opacity:.75">'
        f'<span style="position:absolute;left:0;right:0;bottom:0;height:3px;background:{dict(ok="#7fd99a",rev="#f2c46b",fb="#ff7a66",gen="#7aa7ff",todo="#4a4a50")[s]}"></span></div>'
        for n, name, img, s, v, cr, d in SHOTS)
    counts = {k: sum(1 for x in SHOTS if x[3] == k) for k in STATUS}
    return f"""<style>{DARK}</style>
{topbar(['Studio Rive', 'Higan — From the Other Shore'], 'Plans')}
<div style="padding:30px 32px 0">
 <div class="row" style="align-items:flex-end">
  <div><div class="k">Projet · client Higan · film parfum</div>
   <div style="font-size:40px;font-weight:500;letter-spacing:-.03em;margin-top:6px">From the Other Shore</div></div>
  <span class="sp"></span>
  <div class="row" style="gap:36px;margin-bottom:6px">
   {''.join(f'<div><div class="k">{a}</div><div style="font-size:15px;margin-top:3px">{b}</div></div>' for a, b in [('Durée', f'{total:.0f} s · 8 plans'), ('Livraison', '12 décembre'), ('Validés', f'{counts["ok"]} / 8'), ('Dans la v3', f'{counts["rev"]} plans')])}
   <span class="btn">Envoyer au client</span>
  </div>
 </div>
 <div style="margin-top:20px"><div class="row" style="gap:14px"><span class="k" style="width:120px">Budget de rendus</span>
  <div style="flex:1;height:8px;background:#1d1d20;border-radius:2px;display:flex;overflow:hidden"><div style="width:53.5%;background:#ececed"></div><div style="width:37.5%;background:repeating-linear-gradient(135deg,#8b8b91 0 3px,transparent 3px 7px)"></div></div>
  <span class="mono">214 utilisés</span><span class="mono mut">≈ 150 pour finir</span><span class="mono mut">marge 36 cr</span>
  <span class="row" style="gap:4px;margin-left:8px"><span class="pill on" style="padding:3px 10px">Crédits</span><span class="pill" style="padding:3px 10px">Euros</span></span></div></div>
 <div style="margin-top:18px"><div class="row k" style="margin-bottom:8px"><span>Montage · 0:00 → 0:30</span><span class="sp"></span>
   <span class="row" style="gap:14px">{st('ok')}{st('rev')}{st('fb')}{st('gen')}</span></div>
  <div class="row" style="gap:3px">{seg}</div></div>
 <div style="display:flex;flex-wrap:wrap;gap:26px 24px;margin-top:26px">{cards}</div>
</div>"""


# 2 — one shot: its variants, each with where it comes from
def s2_shot():
    vs = [('v1', 'shore-1b', 'Midjourney → Kling', 9, ''), ('v2', 'shore-2', 'Kling', 11, ''), ('v3', 'shore-1', 'Kling', 12, 'sel'), ('v4', 'shore-river', 'Runway', 9, 'new')]
    strip = ''
    for v, img, model, cr, tag in vs:
        on = tag == 'sel'
        strip += f"""<div style="width:206px">
<div style="position:relative;outline:{'2px solid #ececed' if on else '1px solid #232326'};outline-offset:{'3px' if on else '0'};border-radius:3px">{thumb(img, 206, 116)}
{'<span class="chip" style="position:absolute;left:6px;top:6px;padding:3px 7px;font-size:11px">Choisie</span>' if on else ''}{'<span class="pill" style="position:absolute;left:6px;top:6px;padding:2px 8px;font-size:11px;background:#0b0b0caa;border-color:#7aa7ff;color:#cfe0ff">Nouvelle</span>' if tag == 'new' else ''}</div>
<div class="row" style="margin-top:9px"><span class="mono" style="font-weight:500">{v}</span><span class="sp"></span><span class="mono mut">{cr} cr</span></div>
<div class="k" style="margin-top:3px">{model}</div></div>"""
    return f"""<style>{DARK}</style>
{topbar(['Studio Rive', 'From the Other Shore', 'Plan 02'], 'Versions')}
<div style="display:flex;gap:28px;padding:20px 32px 0">
 <div style="width:880px">
  <div class="row"><span class="mono dim" style="margin-right:12px">02</span><span style="font-size:26px;font-weight:500;letter-spacing:-.02em">La côte</span>
   <span style="margin-left:16px">{st('rev')}</span><span class="sp"></span><span class="k">0:04,0 → 0:07,5 · 3,5 s</span></div>
  <div style="margin-top:16px;position:relative">{thumb('shore-1', 880, 470)}
   <div class="row" style="position:absolute;left:14px;right:14px;bottom:12px;gap:12px">
    <span class="chip" style="padding:5px 9px">▶</span>
    <div style="flex:1;height:3px;background:#ffffff33;border-radius:2px"><div style="width:38%;height:100%;background:#fff"></div></div>
    <span class="mono" style="color:#fff">0:01,3 / 0:03,5</span></div></div>
  <div class="row" style="margin-top:20px;margin-bottom:10px"><span class="k">Variantes gardées · 4</span><span class="k" style="margin-left:14px">13 écartées, masquées</span><span class="sp"></span><span class="k">Afficher tout</span></div>
  <div class="row" style="gap:16px;align-items:flex-start">{strip}</div>
 </div>
 <div style="flex:1;padding-top:44px">
  <div class="row"><span class="k">Prompt de la v3</span><span class="sp"></span><span class="k">Modifiable avant de régénérer</span></div>
  <div style="margin-top:10px;border:1px solid #2f2f33;border-radius:4px;padding:12px 14px;font-size:15px;line-height:1.45">Vue aérienne d’une côte noire, vagues blanches, une bande de lys rouges le long du rivage, lumière froide et rasante, <span style="background:#7aa7ff33;border-radius:2px">brume plus dense au loin</span><span style="display:inline-block;width:1.5px;height:17px;background:#ececed;vertical-align:-3px;margin-left:1px"></span></div>
  <div class="line" style="margin-top:20px"></div>
  {''.join(f'<div class="row" style="padding:11px 0;border-bottom:1px solid #1f1f22"><span class="k" style="width:120px">{a}</span><span class="{c}">{b}</span></div>' for a, b, c in [('Modèle', 'Kling · image → vidéo', ''), ('Image de départ', 'v1, image fixe', ''), ('Graine', '48 210 377', 'mono'), ('Durée', '5 s, coupée à 3,5 s', ''), ('Coût', '12 crédits', 'mono'), ('Par', 'Théo · 17 nov., 16:42', '')])}
  <div class="row" style="margin-top:16px;gap:10px">{thumb('shore-1b', 92, 52)}<span class="k">Image de départ<br><span style="color:#ececed">shore_v1_still.png</span></span></div>
  <div style="margin-top:26px;display:flex;flex-direction:column;gap:8px">
   <span class="btn" style="text-align:center">Comparer avec la v4</span>
   <span class="btn2" style="text-align:center">Régénérer avec ce prompt · ≈ 12 cr</span>
  </div>
 </div>
</div>"""


# 3 — compare two versions before sending
def s3_compare():
    def side(v, img, model, cr, prompt, tag):
        return f"""<div style="width:676px">
<div class="row" style="margin-bottom:10px;height:28px"><span class="mono" style="font-size:14px;font-weight:500">{v}</span><span class="k" style="margin-left:12px">{model} · {cr} crédits</span><span class="sp"></span>{tag}</div>
{thumb(img, 676, 380)}
<div style="margin-top:14px;font-size:14px;line-height:1.5;color:#c9c9ce">{prompt}</div></div>"""
    p3 = 'Vue aérienne d’une côte noire, vagues blanches, une bande de lys rouges le long du rivage, lumière froide et rasante, brume légère.'
    p4 = 'Vue aérienne d’une côte noire, vagues blanches, <span style="background:#7aa7ff33;color:#dfe9ff;border-radius:2px;padding:0 2px">un fleuve de lys rouges qui s’enfonce dans les terres</span>, lumière froide et rasante, <span style="background:#ff7a6633;color:#ffe0db;border-radius:2px;padding:0 2px;text-decoration:line-through">brume légère</span>.'
    return f"""<style>{DARK}</style>
{topbar(['Studio Rive', 'From the Other Shore', 'Plan 02', 'Comparer'], 'Versions')}
<div style="padding:26px 32px 0">
 <div class="row"><span style="font-size:26px;font-weight:500;letter-spacing:-.02em">v3 ou v4 ?</span><span class="k" style="margin-left:16px">Plan 02 · La côte · lecture synchronisée</span><span class="sp"></span>
  <span class="pill">Côte à côte</span><span class="pill" style="margin-left:6px;border-color:transparent">Superposer</span></div>
 <div class="row" style="gap:24px;margin-top:22px;align-items:flex-start">
  {side('v3', 'shore-1', 'Kling', 12, p3, '<span class="k">Choisie aujourd’hui</span>')}
  {side('v4', 'shore-river', 'Runway', 9, p4, '<span class="pill" style="padding:2px 9px;border-color:#7aa7ff;color:#cfe0ff">Nouvelle</span>')}
 </div>
 <div class="row" style="margin-top:22px;gap:14px"><span class="chip" style="padding:5px 9px">▶</span>
  <div style="flex:1;height:3px;background:#2a2a2e;border-radius:2px"><div style="width:38%;height:100%;background:#ececed"></div></div>
  <span class="mono mut">0:01,3 / 0:03,5</span></div>
 <div class="line" style="margin-top:22px"></div>
 <div class="row" style="margin-top:18px;gap:10px"><span class="k">Le client verra uniquement la version envoyée. La v3 reste dans l’historique du plan.</span><span class="sp"></span>
  <span class="btn2">Garder la v3</span><span class="btn">Envoyer la v4 au client</span></div>
</div>"""


# ---------- client side: light, editorial ----------
LIGHT = BASE + """
body{background:#f1efea;color:#141414}
.mut{color:#76736c}
.serif{font-family:NR;font-weight:400;letter-spacing:-.01em}
.chip{background:#fff;padding:6px 11px;border-radius:3px;white-space:nowrap}
.pill{background:#fff;border-radius:30px;padding:5px 12px;white-space:nowrap}
.btn{background:#141414;color:#f1efea;padding:15px 18px;text-align:center;letter-spacing:.06em;font-size:12px;font-weight:500;text-transform:uppercase}
"""

COMMENTS = [
    ('0:12', '04', 'La brume', 'shore-light', 'Mia', 'Plus de rouge dans la brume, on perd la couleur de la marque.', ''),
    ('0:17', '05', 'La fleur', 'flower-red', 'Mia', 'La fleur est parfaite. On garde.', ''),
    ('0:22', '06', 'La métamorphose', 'metamorphosis', 'Mia', 'La transition est trop rapide, on ne comprend pas que la fleur devient la créature.', ''),
]


def client_top(right='Version 3 · à valider'):
    return f"""<div class="row" style="padding:14px 16px 0;gap:6px"><span class="chip">Menu</span><span class="chip">{right}</span>
<span class="pill" style="margin-left:6px;background:transparent">Higan <span class="mut">/</span> From the Other Shore</span><span class="sp"></span>
<span class="mut">Studio Rive · tour de retours <span style="color:#141414">2 sur 3</span> prévus au devis</span></div>
<div class="row" style="gap:6px;padding:10px 18px 0"><span class="mut" style="margin-right:4px">↳</span>
{''.join(f'<span class="pill" style="{"background:#141414;color:#f1efea" if t == "Film" else ""}">{t}</span>' for t in ['Film', 'Plans', 'Versions précédentes'])}</div>"""


def player(frame, w, h, at=0.42, markers=True):
    total = sum(s[6] for s in SHOTS)
    segs = ''.join(f'<div style="flex:{s[6]};border-left:1px solid #f1efea;height:100%"></div>' for s in SHOTS)
    labels = ''.join(f'<div style="flex:{s[6]};padding-left:4px" class="mono mut">{s[0]}</div>' for s in SHOTS)
    ms = ''
    if markers:
        for t, *_ in COMMENTS:
            m, sec = t.split(':'); x = (int(m) * 60 + int(sec)) / total * 100
            ms += f'<span style="position:absolute;left:{x:.1f}%;top:-5px;width:9px;height:9px;margin-left:-4px;border-radius:50%;background:#141414;border:2px solid #f1efea"></span>'
    return f"""<div style="width:{w}px">{thumb(frame, w, h, 'border-radius:0')}
<div style="position:relative;margin-top:14px;height:6px;background:#dcd9d1;display:flex">
<div style="position:absolute;left:0;top:0;bottom:0;width:{at * 100:.0f}%;background:#141414"></div>{segs}{ms}</div>
<div class="row" style="margin-top:7px">{labels}</div></div>"""


# 4 — client review: watch, comment on a precise shot
def s4_review():
    cm = ''
    for t, n, name, img, who, text, state in COMMENTS:
        cm += f"""<div style="padding:12px 0;border-top:1px solid #dcd9d1">
<div class="row" style="gap:10px"><span class="mono">{t}</span><span class="mut">Plan {n} · {name}</span><span class="sp"></span><span class="mut" style="font-size:12px">{state}</span></div>
<div class="row" style="gap:12px;margin-top:10px;align-items:flex-start">{thumb(img, 72, 40, 'border-radius:0;flex:none')}<div style="font-size:14px;line-height:1.45">{text}</div></div></div>"""
    return f"""<style>{LIGHT}</style>
{client_top()}
<div style="display:flex;gap:40px;padding:26px 32px 0">
 <div>{player('flower-red', 900, 506, at=0.55)}
  <div class="row" style="margin-top:26px;align-items:flex-end">
   <div><div class="serif" style="font-size:38px;line-height:1">From the Other Shore</div>
   <div class="mut" style="margin-top:8px">Film parfum · 30 s · version 3, envoyée par Inès le 18 novembre</div></div>
   <span class="sp"></span><span class="mono" style="font-size:13px">0:17 / 0:30</span></div>
 </div>
 <div style="flex:1;padding-top:2px">
  <div style="background:#fff;padding:14px 16px">
   <div class="row"><span style="font-weight:500">Ce qui a changé depuis la v2</span><span class="sp"></span><span class="mut" style="font-size:12px">2 plans</span></div>
   {''.join(f'<div class="row" style="gap:10px;margin-top:10px">{thumb(i, 46, 26, "border-radius:0;flex:none")}<span class="mono">{t}</span><span>{x}</span><span class="sp"></span><span class="mut" style="font-size:12px">Voir</span></div>' for i, t, x in [('shore-1', '0:04', 'Plan 02 · nouvelle prise de vue'), ('flower-red', '0:15', 'Plan 05 · fond plus clair')])}</div>
  <div class="row" style="margin-top:20px"><span class="mut">Vos retours · {len(COMMENTS)}</span><span class="sp"></span><span class="mut">Tout lire</span></div>
  <div style="margin-top:4px">{cm}</div>
  <div style="margin-top:6px;background:#fff;padding:14px 14px 12px">
   <div class="row" style="gap:6px"><span class="pill" style="background:#141414;color:#f1efea;padding:3px 10px;font-size:12px">À 0:17 · plan 05</span><span class="pill" style="background:#f1efea;padding:3px 10px;font-size:12px">Sur tout le film</span></div>
   <div style="margin-top:10px;font-size:14px;color:#a5a29a">Écrire un retour…</div></div>
  <div class="btn" style="margin-top:16px">Valider cette version</div>
  <div class="mut" style="font-size:12px;margin-top:10px;text-align:center">Ou envoyer vos retours au studio</div>
 </div>
</div>"""


# 5 — validation: one panel, one button, no doubt about which version
def s5_validate():
    rows = ''.join(f'<div class="row" style="padding:10px 0;border-top:1px solid #e4e1da"><span class="mut" style="width:150px">{a}</span><span>{b}</span></div>'
                   for a, b in [('Durée', '30 secondes, 8 plans'), ('Version', '4, envoyée le 24 novembre'), ('Vos retours sur la v3', '2 sur 2 traités'), ('Format de livraison', '16:9 et 9:16, 4K'), ('Fichiers livrés le', '26 novembre')])
    return f"""<style>{LIGHT}</style>
<div style="position:absolute;inset:0;opacity:.35;filter:blur(1px)">{client_top('Version 4 · à valider')}
<div style="padding:26px 32px 0">{player('flower-red', 900, 506, at=1)}</div></div>
<div style="position:absolute;inset:0;background:#f1efea55"></div>
<div style="position:absolute;left:16px;top:14px" class="row"><span class="chip">Menu</span><span class="chip" style="margin-left:6px">Fermer</span></div>
<div style="position:absolute;left:452px;top:150px;width:536px;background:#fff;box-shadow:0 30px 80px #0000001a">
 <div class="row" style="align-items:stretch">{thumb('flower-red', 210, 118, 'border-radius:0;flex:none')}
  <div style="padding:14px 16px;flex:1;display:flex;flex-direction:column"><div class="serif" style="font-size:22px;line-height:1.1">From the Other Shore</div>
  <div class="mut" style="margin-top:6px">Version 4</div><span class="sp"></span><div class="row"><span class="mono">0:30</span><span class="sp"></span><span class="mut">Higan</span></div></div></div>
 <div style="padding:6px 16px 4px">{rows}</div>
 <div class="row" style="gap:10px;padding:14px 16px;border-top:1px solid #e4e1da"><span style="width:16px;height:16px;border:1.5px solid #141414;display:inline-flex;align-items:center;justify-content:center;font-size:11px">✓</span>
  <span style="font-size:13px">Je valide la version 4 pour la livraison</span></div>
 <div class="btn" style="margin:0 16px 16px">Valider la version 4</div>
</div>
<div class="mut" style="position:absolute;left:452px;top:592px;width:536px;font-size:12px;text-align:center">Le studio est prévenu tout de suite. Les versions 1 à 3 restent consultables.</div>"""


# 6 — feedback to handle: each comment becomes a task on the right shot
def s6_feedback():
    items = [
        ('06', 'La métamorphose', 'metamorphosis', '0:22', 'La transition est trop rapide, on ne comprend pas que la fleur devient la créature.', 'Théo', 'À faire', '≈ 14 cr', True),
        ('04', 'La brume', 'shore-light', '0:12', 'Plus de rouge dans la brume, on perd la couleur de la marque.', 'Théo', 'En cours · v3 en génération', '≈ 11 cr', False),
        ('05', 'La fleur', 'flower-red', '0:17', 'La fleur est parfaite. On garde.', '—', 'Rien à faire', '', False),
    ]
    out = ''
    for n, name, img, t, text, who, state, cost, open_ in items:
        out += f"""<div class="row" style="gap:22px;padding:18px 0;border-top:1px solid #1f1f22;align-items:flex-start;{'opacity:.5' if state == 'Rien à faire' else ''}">
{thumb(img, 220, 124, 'flex:none')}
<div style="width:520px"><div class="row" style="gap:10px"><span class="mono">{t}</span><span class="mut">Plan {n} · {name}</span></div>
<div style="font-size:17px;line-height:1.4;margin-top:8px">« {text} »</div><div class="k" style="margin-top:8px">Mia, Higan · version 3</div></div>
<span class="sp"></span>
<div style="width:300px">{''.join(f'<div class="row" style="padding:5px 0"><span class="k" style="width:90px">{a}</span><span>{b}</span></div>' for a, b in [('Assigné à', who), ('État', state), ('Coût estimé', cost or '—')])}
{'<div class="row" style="gap:8px;margin-top:12px"><span class="btn">Régénérer le plan 06</span><span class="btn2">Répondre</span></div>' if open_ else ''}</div></div>"""
    return f"""<style>{DARK}</style>
{topbar(['Studio Rive', 'From the Other Shore'], 'Retours')}
<div style="padding:30px 32px 0">
 <div class="row" style="align-items:flex-end"><div><div class="k">Retours du client sur la version 3</div>
  <div style="font-size:32px;font-weight:500;letter-spacing:-.025em;margin-top:6px">2 retours à traiter</div></div><span class="sp"></span>
  <span class="k">Chaque retour est rattaché au plan et au moment exact où il a été écrit.</span></div>
 <div style="margin-top:22px">{out}<div class="line"></div></div>
</div>"""



# 7 — over budget: asked before spending, never after
def s7_budget():
    return f"""<style>{DARK}</style>
<div style="position:absolute;inset:0;opacity:.3">{s6_feedback().split('</style>', 1)[1].replace('214 / 400', '391 / 400')}</div>
<div style="position:absolute;left:0;top:0;width:1440px;background:#0b0b0c">{topbar(['Studio Rive', 'From the Other Shore'], 'Retours', used=391)}</div>
<div style="position:absolute;left:450px;top:190px;width:540px;background:#141416;border:1px solid #2a2a2e;border-radius:6px;padding:26px 26px 22px">
 <div class="k">Plan 06 · La métamorphose</div>
 <div style="font-size:24px;font-weight:500;letter-spacing:-.02em;margin-top:8px;line-height:1.2">Cette génération dépasse le budget du projet</div>
 <div style="margin-top:18px;display:flex;height:8px;border-radius:2px;overflow:hidden;background:#1d1d20"><div style="width:97.75%;background:#ececed"></div><div style="width:2.25%;background:#ff7a66"></div></div>
 <div class="row k" style="margin-top:8px"><span class="mono">391 utilisés</span><span class="sp"></span><span class="mono" style="color:#ffb4a8">il reste 9 cr · cette génération ≈ 14 cr</span></div>
 <div style="margin-top:22px;display:flex;flex-direction:column;gap:8px">
  <div class="row" style="border:1px solid #ececed;border-radius:4px;padding:12px 14px;gap:12px"><div><div style="font-weight:500">Demander 50 crédits à Inès</div><div class="k" style="margin-top:3px">Elle reçoit la demande avec le retour client qui la justifie.</div></div><span class="sp"></span><span class="mono">≈ 14 cr</span></div>
  <div class="row" style="border:1px solid #2a2a2e;border-radius:4px;padding:12px 14px;gap:12px"><div><div style="font-weight:500">Faire un brouillon en basse définition</div><div class="k" style="margin-top:3px">Pour vérifier la transition avant de lancer la version finale.</div></div><span class="sp"></span><span class="mono">≈ 5 cr</span></div>
 </div>
 <div class="row" style="margin-top:20px;gap:8px"><span class="k">Rien n’est débité avant votre choix.</span><span class="sp"></span><span class="btn2">Annuler</span><span class="btn">Envoyer la demande</span></div>
</div>"""


# 8 — a failed generation, and one still running
def s8_failed():
    def card(v, img, model, cr, state):
        if state == 'fail':
            body = f'<div style="width:206px;height:116px;border-radius:3px;border:1px dashed #ff7a6688;display:flex;flex-direction:column;justify-content:center;padding:0 14px;gap:6px"><span class="st fb"><i></i>Échec</span><span class="k" style="line-height:1.3">Expirée après 10 min. Non comptée dans le budget.</span></div>'
        elif state == 'run':
            body = f'<div style="position:relative">{thumb(img, 206, 116, "filter:blur(6px) brightness(.6)")}<div style="position:absolute;left:12px;right:12px;bottom:12px"><div class="row k"><span class="st gen"><i></i>En cours</span><span class="sp"></span><span class="mono">62 %</span></div><div style="height:3px;background:#ffffff22;margin-top:6px"><div style="width:62%;height:100%;background:#7aa7ff"></div></div></div></div>'
        else:
            body = f'<div style="{"outline:2px solid #ececed;outline-offset:3px;border-radius:3px" if state == "sel" else ""}">{thumb(img, 206, 116)}</div>'
        return f'<div style="width:206px">{body}<div class="row" style="margin-top:9px"><span class="mono" style="font-weight:500">{v}</span><span class="sp"></span><span class="mono mut">{cr}</span></div><div class="k" style="margin-top:3px">{model}</div></div>'
    strip = ''.join(card(*c) for c in [('v4', 'meta-b', 'Kling', '10 cr', ''), ('v5', 'metamorphosis', 'Kling', '12 cr', 'sel'), ('v6', '', 'Runway', '0 cr', 'fail'), ('v7', 'metamorphosis', 'Kling', '≈ 14 cr', 'run')])
    return f"""<style>{DARK}</style>
{topbar(['Studio Rive', 'From the Other Shore', 'Plan 06'], 'Versions')}
<div style="display:flex;gap:28px;padding:20px 32px 0">
 <div style="width:880px">
  <div class="row"><span class="mono dim" style="margin-right:12px">06</span><span style="font-size:26px;font-weight:500;letter-spacing:-.02em">La métamorphose</span>
   <span style="margin-left:16px">{st('fb')}</span><span class="sp"></span><span class="k">0:20,0 → 0:24,5 · 4,5 s</span></div>
  <div style="margin-top:16px">{thumb('metamorphosis', 880, 470)}</div>
  <div class="row" style="margin-top:20px;margin-bottom:10px"><span class="k">Variantes gardées · 4</span><span class="k" style="margin-left:14px">9 écartées, masquées</span><span class="sp"></span><span class="k">Afficher tout</span></div>
  <div class="row" style="gap:16px;align-items:flex-start">{strip}</div>
 </div>
 <div style="flex:1;padding-top:44px">
  <div style="border:1px solid #ff7a6655;background:#ff7a6610;border-radius:4px;padding:14px 16px">
   <div class="row"><span class="st fb"><i></i>La v6 a échoué</span><span class="sp"></span><span class="k">17:58</span></div>
   <div style="margin-top:8px;line-height:1.45;color:#d8d8dc">Runway n’a pas répondu au bout de 10 minutes. La génération est annulée et n’est pas comptée dans le budget du projet.</div>
   <div class="row" style="gap:8px;margin-top:14px"><span class="btn">Relancer sur Runway</span><span class="btn2">Essayer avec Kling · ≈ 14 cr</span></div></div>
  <div class="k" style="margin-top:28px">Retour client à l’origine</div>
  <div style="margin-top:10px;font-size:15px;line-height:1.45">« La transition est trop rapide, on ne comprend pas que la fleur devient la créature. »</div>
  <div class="k" style="margin-top:8px">Mia, Higan · 0:22 · version 3</div>
  <div class="line" style="margin-top:22px"></div>
  <div class="row" style="padding:11px 0;border-bottom:1px solid #1f1f22"><span class="k" style="width:120px">v7 en cours</span><span>Kling · durée passée de 3 à 4,5 s</span></div>
  <div class="row" style="padding:11px 0;border-bottom:1px solid #1f1f22"><span class="k" style="width:120px">Prévenir</span><span>Inès quand la v7 est prête</span></div>
 </div>
</div>"""


# 9 — client on mobile, opening an old link
def s9_mobile():
    cm = ''.join(f'<div style="padding:12px 0;border-top:1px solid #dcd9d1"><div class="row" style="gap:8px"><span class="mono">{t}</span><span class="mut">Plan {n} · {name}</span></div><div style="margin-top:6px;font-size:14px;line-height:1.4">{text}</div></div>' for t, n, name, text in [('0:04', '02', 'La côte', 'Le cadre est trop serré, on ne voit pas assez le rivage.'), ('0:15', '05', 'La fleur', 'Le fond est trop sombre, la fleur se perd.')])
    return f"""<style>{LIGHT} body{{width:390px;height:844px}}</style>
<div class="row" style="padding:52px 14px 0;gap:6px"><span class="chip">Menu</span><span class="chip">Version 2</span><span class="sp"></span><span class="mut" style="font-size:12px">Studio Rive</span></div>
<div style="margin:14px 14px 0;background:#141414;color:#f1efea;padding:12px 14px">
 <div style="font-size:13px">Ce lien ouvre la version 2. La version 3 est arrivée le 18 novembre.</div>
 <div class="row" style="margin-top:10px"><span style="text-decoration:underline;text-underline-offset:3px">Voir la version 3</span><span class="sp"></span><span style="opacity:.6;font-size:12px">Fermer</span></div></div>
<div style="margin-top:14px;opacity:.55">{thumb('shore-2', 390, 219, 'border-radius:0')}</div>
<div style="padding:12px 14px 0">
 <div class="serif" style="font-size:26px;line-height:1.05">From the Other Shore</div>
 <div class="mut" style="margin-top:6px;font-size:12px">Version 2 · remplacée, plus validable</div>
 <div class="mut" style="margin-top:18px;font-size:12px">Vos retours sur la v2 · traités dans la v3</div>
 <div style="margin-top:6px">{cm}</div>
</div>
<div style="position:absolute;left:14px;right:14px;bottom:28px" class="btn">Ouvrir la version 3</div>"""



# 10 — after validation: what happens next
def s10_done():
    return f"""<style>{LIGHT}</style>
{client_top('Version 4 · validée')}
<div style="display:flex;gap:56px;padding:40px 32px 0 120px;align-items:center">
 {thumb('packshot-p', 400, 500, 'border-radius:0;flex:none')}
 <div style="max-width:520px">
  <div class="mut">Validée par Mia le 25 novembre à 10:42</div>
  <div class="serif" style="font-size:52px;line-height:1.02;margin-top:14px">La version 4 est validée.</div>
  <div style="font-size:16px;line-height:1.5;margin-top:20px">Le studio a été prévenu. Vous recevrez les fichiers 16:9 et 9:16 en 4K le 26 novembre, par e-mail et sur cette page.</div>
  <div class="row" style="gap:10px;margin-top:30px"><span class="btn" style="padding:13px 18px">Revoir le film</span><span class="mut">Télécharger le récapitulatif</span></div>
 </div>
</div>"""


SCREENS = {'01-projet': s1_project, '02-plan': s2_shot, '03-comparer': s3_compare, '04-revue': s4_review, '05-validation': s5_validate, '06-retours': s6_feedback, '07-budget': s7_budget, '08-echec': s8_failed, '09-mobile': s9_mobile, '10-valide': s10_done}


async def main(only):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=2)
        for k, f in SCREENS.items():
            if only and k not in only:
                continue
            open('/home/claude/dailies/gen/_s.html', 'w').write(f'<html><head><meta charset="utf-8"></head><body>{f()}</body></html>')
            await pg.set_viewport_size({'width': 390, 'height': 844} if k == '09-mobile' else {'width': 1440, 'height': 900})
            await pg.goto('file:///home/claude/dailies/gen/_s.html', wait_until='networkidle')
            await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'/home/claude/dailies/out/{k}.png')
            print(k)
        await b.close()

if __name__ == '__main__':
    asyncio.run(main(sys.argv[1:]))
