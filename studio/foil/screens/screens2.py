import asyncio, math, random
from playwright.async_api import async_playwright
FD='/home/claude/elan/r3d/node_modules/@fontsource/geist-sans/files'
FF=''.join(f"@font-face{{font-family:Geist;font-weight:{w};src:url('file://{FD}/geist-sans-latin-{w}-normal.woff2') format('woff2')}}" for w in (200,300,400,500,600))
C='file:///home/claude/ecrin/tex/cards/'
REAL='file:///home/claude/ecrin/tex/real/reshiram.png'
R_='file:///home/claude/ecrin/tex/real/'
ZEK=R_+'zekrom.png'; ROG=R_+'roger.png'; STA=R_+'stardust.png'; MEW=R_+'mewtwo.png'
CSS=FF+"""*{box-sizing:border-box;margin:0}
body{width:390px;height:844px;background:#050608;color:#f1f1f3;font-family:Geist;overflow:hidden;position:relative}
.glow{position:absolute;inset:0;filter:blur(60px);opacity:.9;pointer-events:none}
.sb{position:relative;display:flex;justify-content:space-between;padding:16px 28px 0;font-size:14px;font-weight:500}
.lab{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#9a9ca6}
.mut{color:#9a9ca6}
.g{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(30px);border-radius:20px}
.num{font-weight:200;letter-spacing:-.04em}
.h{position:relative;padding:20px 22px 0}
.chip{border:1px solid rgba(255,255,255,.25);border-radius:30px;padding:7px 13px;font-size:13px;color:#d6d7dc;white-space:nowrap}
.chip.on{background:#f1f1f3;color:#050608;border-color:#f1f1f3}
.holo{color:#fff}
.btn{background:#f1f1f3;color:#050608;border-radius:30px;padding:16px;text-align:center;font-weight:500;font-size:16px}
.tab{position:absolute;left:14px;right:14px;bottom:18px;display:flex;justify-content:space-around;padding:13px 0;font-size:12px;color:#9a9ca6}.tab b{color:#fff;font-weight:500}
img{display:block}
.row{display:flex;justify-content:space-between;align-items:baseline;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:15px}
"""
def glow(cols):
    return '<div style="position:absolute;inset:0;background:radial-gradient(120% 60% at 50% 0%,#15171c 0%,#050608 70%)"></div>'
def glow_old(cols):
    pos=[(20,12),(88,40),(30,88)]
    return '<div class="glow">'+''.join(f'<div style="position:absolute;left:{x}%;top:{y}%;width:280px;height:280px;margin:-140px;border-radius:50%;background:{c}"></div>' for (x,y),c in zip(pos,cols))+'</div>'
HOLO=['#6a5cff55','#00d0ff44','#ff6aa244']
COOL=['#2a4cff44','#00c8ff33','#ffffff14']
def sb(): return '<div class="sb"><span>9:41</span><span>•••</span></div>'
def tab(a):
    return '<div class="tab g" style="border-radius:30px">'+''.join(f'<span>{("<b>"+n+"</b>") if n==a else n}</span>' for n in ['Accueil','Collection','Scan','Marchés','Voyage'])+'</div>'
def dotspark(vals,w,h,r=1.9,op=.9):
    mx,mn=max(vals),min(vals); o=''
    n=len(vals)*4
    for i in range(n):
        f=i/(n-1)*(len(vals)-1); a=int(f); b=min(a+1,len(vals)-1); v=vals[a]+(vals[b]-vals[a])*(f-a)
        x=i*w/(n-1); y=h-(v-mn)/(mx-mn)*(h-10)-5
        for k in range(0,int((h-y)/9)+1):
            yy=y+k*9; o+=f'<circle cx="{x:.1f}" cy="{yy:.1f}" r="{max(.5,r*(1-k*.12)):.2f}" fill="#fff" fill-opacity="{max(.05,op-k*.13):.2f}"/>'
    return f'<svg width="{w}" height="{h}">{o}</svg>'
def card(img,w,tilt=0,sheen=True):
    return f'<div style="position:relative;width:{w}px"><img src="{img}" width="{w}" style="border-radius:{w*.045:.0f}px;box-shadow:0 30px 60px #000c">' + (f'<div style="position:absolute;inset:0;border-radius:{w*.045:.0f}px;background:linear-gradient(115deg,transparent 30%,rgba(120,220,255,.28) 45%,rgba(255,160,220,.25) 55%,transparent 70%);mix-blend-mode:screen"></div>' if sheen else '')+'</div>'
def home():
    row=''.join(f'<div style="display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #ffffff14;font-size:14px"><span>{n}<span class="mut"> · {g}</span></span><span>{v}</span></div>' for n,g,v in [('Mewtwo Delta','Pokémon FR','▲ 31 %'),('Gol D. Roger','One Piece JP','▲ 26 %'),('Stardust Dragon','Yu-Gi-Oh! EN','▼ 3 %')])
    return f"""{glow(HOLO)}{sb()}<div class="h"><div class="lab">Valeur de ta collection</div>
<div class="num" style="font-size:64px;margin-top:6px;line-height:1">4 218<span style="font-size:28px"> €</span></div>
<div style="font-size:14px;margin-top:6px"><span class="holo" style="font-weight:500">▲ 12,4 %</span> <span class="mut">depuis tes achats</span></div></div>
<div style="position:relative;margin:2px 22px 0;overflow:hidden;width:346px">{dotspark([30,31,30,33,35,34,38,40,39,43,46,49],346,80)}</div>
<div style="position:relative;display:flex;justify-content:center;margin-top:10px;transform:rotate(-4deg)">{card(REAL,186)}</div>
<div class="g" style="position:absolute;left:14px;right:14px;bottom:96px;padding:4px 16px 2px"><div class="lab" style="padding-top:10px">Mouvements du jour</div>{row}</div>{tab('Accueil')}"""
def constellation():
    random.seed(5); dots=''; cl=[(110,300,'Pokémon',92,'#ffffff'),(270,260,'One Piece',31,'#b9bcc4'),(240,430,'Yu-Gi-Oh!',25,'#7d818b')]
    for cx,cy,name,n,col in cl:
        for i in range(n*2):
            a=random.random()*6.283; r=(random.random()**.6)*(30+n*.7); x=cx+r*math.cos(a); y=cy+r*math.sin(a)
            s=random.choice([1.2,1.6,2,2.6,3.4,5]); dots+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{s}" fill="#fff" fill-opacity="{.35+random.random()*.6:.2f}"/>'
        dots+=f'<text x="{cx}" y="{cy+(30+n*.7)+22}" fill="{col}" font-size="12" text-anchor="middle" font-family="Geist">{name} · {n}</text>'
    sel='<circle cx="118" cy="288" r="12" fill="none" stroke="#fff" stroke-width="1.2"/><circle cx="118" cy="288" r="5" fill="#fff"/>'
    return f"""{glow(COOL)}{sb()}<div class="h"><div class="lab">Constellation</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Ta collection<br>en points</div></div>
<svg style="position:absolute;left:0;top:70px" width="390" height="600">{dots}{sel}</svg>
<div class="g" style="position:absolute;left:14px;right:14px;bottom:96px;padding:16px;display:flex;gap:14px;align-items:center"><img src="{REAL}" width="54" style="border-radius:3px"><div style="flex:1"><div style="font-size:16px;font-weight:500">Reshiram ex</div><div class="mut" style="font-size:12px">Pokémon · JP · 174/086</div></div><div style="text-align:right"><div style="font-size:20px">1 240 €</div><div class="holo" style="font-size:12px;font-weight:500">▲ 18 %</div></div></div>
<div style="position:absolute;left:22px;right:22px;bottom:204px;display:flex;gap:6px"><span class="chip on">Valeur</span><span class="chip">Écart</span><span class="chip">Langue</span></div>{tab('Collection')}"""
def grid():
    L=[('REAL','Pokémon · JP','1 240','+18 %'),('ROG','One Piece · JP','860','+26 %'),('STA','Yu-Gi-Oh! · EN','212','−3 %'),('ZEK','Pokémon · EN','180','+7 %'),('MEW','Pokémon · FR','410','+31 %'),(2,'One Piece · JP','86','+4 %'),(4,'Pokémon · CN','64','+22 %'),(5,'One Piece · EN','138','+9 %'),(7,'Yu-Gi-Oh! · JP','95','+2 %')]
    cells=''
    for i,g,v,d in L:
        src={'REAL':REAL,'ROG':ROG,'STA':STA,'ZEK':ZEK,'MEW':MEW}.get(i) or f'{C}c{i:02d}.png'
        cells+=f'<div><img src="{src}" width="104" style="border-radius:5px;height:{int(104*1.38)}px;object-fit:cover">'+f'<div style="display:flex;justify-content:space-between;margin-top:7px;font-size:13px"><span>{v} €</span><span class="mut">{"▼" if d[0]=="−" else "▲"} {d[1:]}</span></div><div class="mut" style="font-size:11px">{g}</div></div>'
    return f"""{glow(COOL)}{sb()}<div class="h"><div class="lab">148 cartes</div><div class="num" style="font-size:44px;margin-top:4px">4 218 €</div></div>
<div style="position:relative;display:flex;gap:6px;padding:14px 22px 0"><span class="chip on">Tout</span><span class="chip">Pokémon</span><span class="chip">One Piece</span><span class="chip">Yu-Gi-Oh!</span></div>
<div style="position:relative;display:flex;gap:6px;padding:8px 22px 0"><span class="chip">JP</span><span class="chip">CN</span><span class="chip">EN</span><span class="chip">FR</span><span class="chip">Brut</span><span class="chip">PSA</span></div>
<div style="position:relative;display:grid;grid-template-columns:repeat(3,104px);gap:16px 14px;padding:18px 22px">{cells}</div><div style="position:absolute;left:0;right:0;bottom:0;height:200px;background:linear-gradient(transparent,#050608 70%)"></div>{tab('Collection')}"""
def scan():
    c=''.join(f'<div style="position:absolute;{p};width:36px;height:36px;border:0 solid #fff;border-width:{b}"></div>' for p,b in [('left:0;top:0','2px 0 0 2px'),('right:0;top:0','2px 2px 0 0'),('left:0;bottom:0','0 0 2px 2px'),('right:0;bottom:0','0 2px 2px 0')])
    beam=''.join(f'<circle cx="{8+i*7.5:.1f}" cy="4" r="{1.2+1.1*math.sin(i/3)**2:.1f}" fill="#ffffff"/>' for i in range(45))
    return f"""{glow(['#00d0ff33','#6a5cff33','#00000000'])}{sb()}<div class="h"><div class="lab">Ajouter</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Cadre la carte</div></div>
<div style="position:absolute;left:62px;top:150px;width:266px;height:372px">{c}<img src="{REAL}" width="236" style="position:absolute;left:15px;top:20px;border-radius:9px"><svg style="position:absolute;left:0;top:190px;filter:drop-shadow(0 0 8px #ffffff)" width="266" height="10">{beam}</svg></div>
<div class="g" style="position:absolute;left:14px;right:14px;bottom:130px;padding:16px"><div style="display:flex;justify-content:space-between"><span class="lab">Carte reconnue</span><span class="holo" style="font-weight:500">98 %</span></div><div style="font-size:18px;margin-top:6px">Reshiram ex · 174/086</div><div class="mut" style="font-size:13px">Pokémon · Japonais · SV11W</div></div>
<div class="btn" style="position:absolute;left:22px;right:22px;bottom:50px">Continuer</div>"""
def ajout():
    R=lambda a,b: f'<div class="row"><span class="mut">{a}</span><span>{b}</span></div>'
    return f"""{glow(HOLO)}{sb()}<div class="h"><div class="lab">Prix d'achat</div><div class="num" style="font-size:60px;margin-top:6px;line-height:1">168 000<span style="font-size:26px"> ¥</span></div><div style="font-size:18px;margin-top:6px" class="holo">= 1 040 €</div><div class="mut" style="font-size:13px;margin-top:4px">au taux du jour d'achat · 1 € = 161,5 ¥</div></div>
<div class="g" style="position:relative;margin:22px 22px 0;padding:6px 16px">{R('Lieu','Tokyo · boutique')}{R('Date','15 nov. 2026')}{R('État','Quasi neuf')}{R('Gradation','Brut')}</div>
<div style="position:relative;display:flex;gap:6px;padding:16px 22px 0"><span class="chip on">¥ Yen</span><span class="chip">¥ Yuan</span><span class="chip">€ Euro</span></div>
<div class="btn" style="position:absolute;left:22px;right:22px;bottom:50px">Ajouter à la collection</div>"""
def fiche():
    return f"""{glow(HOLO)}{sb()}<div class="h" style="display:flex;justify-content:space-between"><span class="mut" style="font-size:14px">‹ Collection</span><span class="mut" style="font-size:14px">Pokémon · JP</span></div>
<div style="position:relative;display:flex;justify-content:center;margin-top:14px;transform:rotate(-3deg)">{card(REAL,214)}</div>
<div class="h" style="padding-top:22px"><div style="font-size:26px;font-weight:300;letter-spacing:-.04em">Reshiram ex</div><div class="mut" style="font-size:13px">SV11W · 174/086 · Illustration spéciale</div>
<div style="display:flex;align-items:baseline;gap:12px;margin-top:10px"><span class="num" style="font-size:46px">1 240 €</span><span class="holo" style="font-size:15px;font-weight:500">▲ 18 %</span></div></div>
<div style="position:absolute;left:22px;top:548px;width:346px;overflow:hidden">{dotspark([20,22,21,24,26,25,29,31,30,34,36,38],346,60)}</div><div class="g" style="position:absolute;left:14px;right:14px;bottom:96px;padding:6px 16px"><div class="row" style="border:0;padding:9px 0"><span class="mut">Payé</span><span>1 040 €</span></div><div class="row" style="border:0;padding:9px 0"><span class="mut">Gain latent</span><span class="holo" style="font-weight:500">+ 200 €</span></div></div>{tab('Collection')}"""
def marches():
    bars=''
    for n,v,c in [('Japon',1240,'#ffffff'),('Chine',1180,'#b9bcc4'),('Europe',1310,'#7d818b'),('États-Unis',1290,'#e2e4e8')]:
        w=int(v/1310*250); dots=''.join(f'<circle cx="{4+i*8}" cy="6" r="2.6" fill="{c}"/>' for i in range(int(w/8)))
        bars+=f'<div style="margin-top:20px"><div style="display:flex;justify-content:space-between;font-size:15px"><span>{n}</span><span>{v:,} €</span></div><svg width="300" height="14">{dots}</svg></div>'.replace(',',' ')
    return f"""{glow(COOL)}{sb()}<div class="h"><div class="lab">Reshiram ex · valeur par marché</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Où elle vaut<br>le plus</div></div>
<div style="position:relative;padding:12px 28px 0">{bars}</div>
<div class="g" style="position:absolute;left:14px;right:14px;bottom:96px;padding:16px"><div class="lab">Écart Japon → Europe</div><div style="font-size:28px;font-weight:300;margin-top:4px" class="holo">+ 70 €</div><div class="mut" style="font-size:12px;margin-top:2px">avant frais et envoi</div></div>{tab('Marchés')}"""
def evolution():
    cols=''
    random.seed(2)
    for i in range(30):
        h=60+i*7+random.random()*18; n=int(h/9)
        for k in range(n): cols+=f'<circle cx="{14+i*11}" cy="{325-k*9}" r="{2.3-k*.04:.2f}" fill="#fff" fill-opacity="{.95-k*.025:.2f}"/>'
    return f"""{glow(HOLO)}{sb()}<div class="h"><div class="lab">Évolution · 12 mois</div><div class="num" style="font-size:60px;margin-top:6px;line-height:1">+ 718 €</div><div class="mut" style="font-size:14px;margin-top:4px">depuis tes achats, change compris</div></div>
<svg style="position:absolute;left:12px;top:200px" width="366" height="340">{cols}</svg>
<div style="position:absolute;left:22px;right:22px;top:566px;display:flex;gap:6px"><span class="chip on">12 mois</span><span class="chip">3 mois</span><span class="chip">Tout</span></div>
<div class="g" style="position:absolute;left:14px;right:14px;bottom:96px;padding:6px 16px">{''.join(f'<div class="row" style="padding:10px 0;{"border:0" if k==1 else ""}"><span>{a}</span><span class="mut">{b}</span></div>' for k,(a,b) in enumerate([('Meilleure carte','Reshiram ex'),('Meilleur mois','Septembre')]))}</div>{tab('Collection')}"""
def repartition():
    rings=''
    for r,n,col,vals in [(150,90,'#ffffff',.62),(110,56,'#b9bcc4',.21),(72,34,'#7d818b',.17)]:
        for i in range(n):
            a=i/n*6.283-1.57; rings+=f'<circle cx="{195+r*math.cos(a):.1f}" cy="{330+r*math.sin(a):.1f}" r="{2.6 if i/n<vals else 1.2}" fill="{col if i/n<vals else "#fff"}" fill-opacity="{1 if i/n<vals else .3}"/>'
    return f"""{glow(COOL)}{sb()}<div class="h"><div class="lab">Répartition</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Où est ta valeur</div></div>
<svg style="position:absolute;left:0;top:80px" width="390" height="500">{rings}<text x="195" y="338" fill="#fff" text-anchor="middle" font-size="30" font-weight="200" font-family="Geist">4 218 €</text></svg>
<div class="g" style="position:absolute;left:14px;right:14px;bottom:96px;padding:6px 16px">{''.join(f'<div class="row" style="padding:10px 0;{"border:0" if k==2 else ""}"><span><span style="color:{c}">●</span> {a}</span><span class="mut">{b}</span></div>' for k,(a,b,c) in enumerate([('Pokémon','2 640 € · 62 %','#ffffff'),('One Piece','890 € · 21 %','#b9bcc4'),('Yu-Gi-Oh!','688 € · 17 %','#7d818b')]))}</div>{tab('Collection')}"""
def alertes():
    A=lambda n,s,t,on: f'<div class="row"><div><div style="font-size:16px">{n}</div><div class="mut" style="font-size:12px">{s}</div></div><div style="text-align:right"><div style="font-size:15px">{t}</div><div class="mut" style="font-size:12px">{on}</div></div></div>'
    return f"""{glow(HOLO)}{sb()}<div class="h"><div class="lab">Alertes de prix</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Prévenu quand<br>le prix bouge</div></div>
<div class="g" style="position:relative;margin:20px 14px 0;padding:6px 16px">{A('Reshiram ex','Pokémon · JP','≥ 1 400 €','1 240 € aujourd’hui')}{A('Marée','One Piece · JP','≥ 120 €','86 € aujourd’hui')}{A('Dune','Yu-Gi-Oh! · EN','≤ 190 €','212 € aujourd’hui')}</div>
<div class="g" style="position:relative;margin:14px 14px 0;padding:16px"><div class="lab">Nouvelle alerte</div><div style="font-size:30px;margin-top:6px" class="num">≥ 1 400 €</div><svg width="318" height="22" style="margin-top:8px">{''.join(f'<circle cx="{4+i*8}" cy="11" r="{3 if i==28 else 1.6}" fill="#fff" fill-opacity="{1 if i<=28 else .3}"/>' for i in range(39))}</svg></div>
<div class="btn" style="position:absolute;left:22px;right:22px;bottom:50px">Créer l'alerte</div>"""
def voyage():
    row=''.join(f'<div class="row" style="padding:11px 0"><span>{a}<span class="mut"> · {b}</span></span><span>{c}</span></div>' for a,b,c in [('Reshiram ex','Akihabara','168 000 ¥'),('Marée','Shibuya','13 800 ¥'),('Dune','Nakano','34 200 ¥')])
    return f"""{glow(COOL)}{sb()}<div class="h"><div class="lab">Voyage · Tokyo</div><div class="num" style="font-size:56px;margin-top:6px;line-height:1">216 000<span style="font-size:24px"> ¥</span></div><div class="mut" style="font-size:14px;margin-top:4px">dépensés sur 242 000 ¥ prévus</div></div>
<svg style="position:relative;margin:16px 22px 0" width="346" height="22">{''.join(f'<circle cx="{4+i*8}" cy="11" r="2.4" fill="#fff" fill-opacity="{1 if i<39 else .25}"/>' for i in range(43))}</svg>
<div class="g" style="position:relative;margin:14px 14px 0;padding:8px 16px">{row}</div>
<div class="g" style="position:relative;margin:14px 14px 0;padding:14px 16px;display:flex;justify-content:space-between"><div><div class="lab">En euros</div><div style="font-size:22px;margin-top:4px">1 337 €</div></div><div style="text-align:right"><div class="lab">Taux moyen</div><div style="font-size:22px;margin-top:4px">161,5</div></div></div>{tab('Voyage')}"""
def vendre():
    R=lambda a,b,s='': f'<div class="row"><span class="mut">{a}</span><span {s}>{b}</span></div>'
    return f"""{glow(HOLO)}{sb()}<div class="h"><div class="lab">Revente · Reshiram ex</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Ton gain<br>net</div></div>
<div class="g" style="position:relative;margin:20px 14px 0;padding:6px 16px">{R('Prix de vente','1 310 €')}{R('Frais de plateforme','− 131 €')}{R('Envoi assuré','− 14 €')}{R('Payé (taux du jour d’achat)','− 1 040 €')}</div>
<div class="h" style="padding-top:26px"><div class="lab">Gain net</div><div class="num holo" style="font-size:72px;line-height:1;margin-top:4px">+ 125 €</div><div class="mut" style="font-size:13px;margin-top:6px">+ 12 % après frais</div></div>
<div class="btn" style="position:absolute;left:22px;right:22px;bottom:50px">Mettre en vente</div>"""
def serie():
    own=set([0,1,2,4,5,6,8,9,10,11,13,14,16,17,18,20,21,22,23,25,26,27,29,30,31,33,34,36,37,38,40,41,43,44,45,47,48,50,51,52,54,55,56,58,59,61,62,63,64,66,67,68,69,70,72,73,74,76,77,78,80,81,82,84,85])
    d=''
    for i in range(86):
        x=18+(i%10)*33; y=14+(i//10)*33
        d+=f'<circle cx="{x}" cy="{y}" r="{5 if i in own else 3}" fill="{"#ffffff" if i in own else "none"}" stroke="#fff" stroke-opacity="{0 if i in own else .35}" stroke-width="1"/>' if i!=7 else f'<circle cx="{x}" cy="{y}" r="9" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="{x}" cy="{y}" r="3" fill="#fff"/>'
    return f"""{glow(COOL)}{sb()}<div class="h"><div class="lab">Série · SV11W</div><div class="num" style="font-size:64px;margin-top:6px;line-height:1">{len(own)}<span style="font-size:26px;color:#9a9ca6"> / 86</span></div><div class="mut" style="font-size:14px;margin-top:4px">76 % de la série complétée</div></div>
<svg style="position:absolute;left:22px;top:190px" width="346" height="320">{d}</svg>
<div class="g" style="position:absolute;left:14px;right:14px;bottom:96px;padding:16px;display:flex;gap:14px;align-items:center"><div style="flex:1"><div class="lab">Prochaine à chasser</div><div style="font-size:17px;margin-top:4px">Carte 008/086</div><div class="mut" style="font-size:12px">il t’en manque 21 · environ 740 €</div></div><div class="btn" style="padding:10px 16px;font-size:13px">Voir</div></div>{tab('Collection')}"""
def vitrine():
    sh=f'<div style="position:absolute;left:20px;right:20px;top:470px;height:2px;background:linear-gradient(90deg,transparent,#fff8,transparent)"></div>'
    return f"""{glow(HOLO)}{sb()}<div class="h"><div class="lab">Ma vitrine</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Tes trois plus<br>belles cartes</div></div>
<div style="position:absolute;left:0;right:0;top:190px;display:flex;justify-content:center;gap:0">
<div style="transform:rotate(-8deg) translateY(30px);margin-right:-30px">{card(ROG,112,sheen=False)}</div><div style="z-index:2">{card(REAL,150)}</div><div style="transform:rotate(8deg) translateY(30px);margin-left:-30px">{card(ZEK,112,sheen=False)}</div></div>{sh}
<div style="position:absolute;left:30px;right:30px;top:480px;height:60px;background:linear-gradient(#ffffff14,transparent);transform:scaleY(-1);opacity:.4;filter:blur(3px)"></div>
<div class="h" style="position:absolute;left:0;right:0;top:520px;display:flex;justify-content:space-around;text-align:center"><div><div class="num" style="font-size:30px">148</div><div class="lab">cartes</div></div><div><div class="num" style="font-size:30px">3</div><div class="lab">jeux</div></div><div><div class="num" style="font-size:30px">4 218 €</div><div class="lab">valeur</div></div></div>
<div class="btn" style="position:absolute;left:22px;right:22px;bottom:50px">Partager ma vitrine</div>"""
def radar():
    R=lambda n,g,v,vals,im=None: f'<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.1)"><img src="{im}" width="34" style="border-radius:3px;margin-right:10px"><div style="flex:1"><div style="font-size:16px">{n}</div><div class="mut" style="font-size:12px">{g}</div></div><div style="overflow:hidden;width:76px;margin-right:16px">{dotspark(vals,76,34,r=1.1,op=.8)}</div><div style="text-align:right"><div style="font-size:15px">{v[0]}</div><div class="holo" style="font-size:12px;font-weight:500">{v[1]}</div></div></div>'
    return f"""{glow(HOLO)}{sb()}<div class="h"><div class="lab">Radar</div><div style="font-size:28px;font-weight:300;letter-spacing:-.04em;margin-top:4px">Les cartes dont<br>le prix monte</div></div>
<div style="position:relative;display:flex;gap:6px;padding:14px 22px 0"><span class="chip on">Tout</span><span class="chip">Pokémon</span><span class="chip">One Piece</span><span class="chip">Yu-Gi-Oh!</span></div>
<div class="g" style="position:relative;margin:16px 14px 0;padding:4px 16px">{R('Zekrom ex','Pokémon · EN',('180 €','▲ 38 %'),[10,11,12,14,15,18,22,26],ZEK)}{R('Gol D. Roger','One Piece · JP',('860 €','▲ 26 %'),[10,10,11,13,14,16,18,21],ROG)}{R('Stardust Dragon','Yu-Gi-Oh! · EN',('212 €','▲ 19 %'),[10,12,11,13,14,15,17,19],STA)}{R('Mewtwo Delta','Pokémon · FR',('410 €','▲ 12 %'),[10,11,11,12,13,13,14,15],MEW)}</div>
<div class="btn" style="position:absolute;left:22px;right:22px;bottom:50px">Ajouter à mes souhaits</div>"""
S={'Accueil':home,'Constellation':constellation,'Collection':grid,'Scan':scan,'Ajout':ajout,'Fiche':fiche,'Marches':marches,'Evolution':evolution,'Repartition':repartition,'Alertes':alertes,'Voyage':voyage,'Vendre':vendre,'Serie':serie,'Vitrine':vitrine,'Radar':radar}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2.5)
        for k,f in S.items():
            open('/home/claude/ecrin/tex/_s.html','w').write(f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{f()}</body></html>")
            await pg.goto('file:///home/claude/ecrin/tex/_s.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'/home/claude/ecrin/tex/q_{k}.png')
        await b.close()
asyncio.run(main())
