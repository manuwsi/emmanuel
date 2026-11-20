"""Colosse v2 — the cockpit as a living technical drawing: section, front view, plan view."""
import asyncio, sys, math, random
from playwright.async_api import async_playwright

GS = '/home/claude/emmanuel/src/fonts/GeneralSans-'
GM = '/home/claude/dailies/node_modules/@fontsource/geist-mono/files/geist-mono-latin-'
FONTS = ''.join(f"@font-face{{font-family:GS;font-weight:{w};src:url('file://{GS}{n}.otf')}}" for w, n in [(400, 'Regular'), (500, 'Medium'), (600, 'Semibold')]) + \
    ''.join(f"@font-face{{font-family:GM;font-weight:{w};src:url('file://{GM}{w}-normal.woff2')}}" for w in (400, 500))
import os
LIGHT = os.environ.get('LIGHT') == '1'
SUF = '-light' if LIGHT else ''
if LIGHT:
    INK, BG, SIG, AMB, RED, WATER, RGB = '#0a0a0a', '#ffffff', '#0a0a0a', '#c97d00', '#e3382a', '#3b7cb0', '10,10,10'
else:
    INK, BG, SIG, AMB, RED, WATER, RGB = '#ecebe4', '#0b0b0a', '#d6ff4a', '#ffb547', '#ff5b4a', '#7fb2d9', '236,235,228'
CSS = FONTS + f"""*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1440px;height:900px;overflow:hidden;background:{BG};color:{INK};font-family:GS;-webkit-font-smoothing:antialiased}}
svg text{{font-family:GM;font-size:10px;fill:{INK}}}
.t{{font-family:GS}}"""

S0, S1, X0, X1 = 3080, 3560, 40, 1400
def X(m): return X0 + (m - S0) * (X1 - X0) / (S1 - S0)
SURF, VS = 232, 10.7
def Y(d): return SURF + d * VS
HEAD = 3320.4
AX, RAD = 22, 5          # axis depth, radius
CROWN, INV = AX - RAD, AX + RAD


def op(a): return f'rgba({RGB},{a})'


def defs():
    return f"""<defs>
<pattern id="h-remb" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="{op(.22)}"/><circle cx="6" cy="6" r=".6" fill="{op(.15)}"/></pattern>
<pattern id="h-marn" width="16" height="10" patternUnits="userSpaceOnUse"><line x1="1" y1="3" x2="7" y2="3" stroke="{op(.17)}" stroke-width=".8"/><line x1="9" y1="8" x2="15" y2="8" stroke="{op(.17)}" stroke-width=".8"/></pattern>
<pattern id="h-calc" width="18" height="9" patternUnits="userSpaceOnUse"><line x1="0" y1="8.5" x2="18" y2="8.5" stroke="{op(.13)}" stroke-width=".7"/><line x1="4" y1="0" x2="4" y2="4.2" stroke="{op(.13)}" stroke-width=".7"/><line x1="13" y1="4.5" x2="13" y2="8.5" stroke="{op(.13)}" stroke-width=".7"/><line x1="0" y1="4.3" x2="18" y2="4.3" stroke="{op(.08)}" stroke-width=".6"/></pattern>
<pattern id="h-argi" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="{op(.13)}" stroke-width=".8"/></pattern>
<pattern id="h-void" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="5" stroke="{RED}" stroke-width="1" stroke-opacity=".7"/></pattern>
<pattern id="h-ring" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="{op(.35)}" stroke-width=".7"/></pattern>
<marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L7,4 L0,7" fill="none" stroke="{INK}" stroke-width="1"/></marker>
<marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L7,4 L0,7" fill="none" stroke="{RED}" stroke-width="1"/></marker>
</defs>"""


def wave(d, amp, ph, step=6):
    return [(X(m), Y(d + amp * math.sin((m - S0) / 38 + ph))) for m in range(S0, S1 + 1, step)]


def pl(pts): return ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)


LAYERS = [('Remblais', 0, 3.5, 'h-remb', 0), ('Marnes et caillasses', 3.5, 12.5, 'h-marn', 0.5), ('Calcaire grossier', 12.5, 27.8, 'h-calc', 0.8), ('Argile plastique', 27.8, 36, 'h-argi', 0.6)]


def dim_v(x, d0, d1, label, col=INK, side=1, mk='ar'):
    y0, y1 = Y(d0), Y(d1)
    s = f'<line x1="{x - 6}" y1="{y0}" x2="{x + 6}" y2="{y0}" stroke="{col}" stroke-width=".8"/><line x1="{x - 6}" y1="{y1}" x2="{x + 6}" y2="{y1}" stroke="{col}" stroke-width=".8"/>'
    s += f'<line x1="{x}" y1="{y0 + 1}" x2="{x}" y2="{y1 - 1}" stroke="{col}" stroke-width=".8" marker-start="url(#{mk})" marker-end="url(#{mk})"/>'
    s += f'<text x="{x + 9 * side}" y="{(y0 + y1) / 2 + 3.5}" text-anchor="{"start" if side > 0 else "end"}" style="fill:{col};font-size:11px">{label}</text>'
    return s


def buildings(alert):
    r = random.Random(11); s = ''; m = S0 + 3
    marks = []
    while m < S1 - 8:
        w = r.choice([16, 19, 22, 25]); h = r.choice([15, 17, 18, 20]); x0, x1 = X(m), min(X(m + w) - 4, X1)
        school = 3346 <= m <= 3362
        col = RED if (alert and school) else op(.55)
        top = SURF - h * 4.6
        s += f'<rect x="{x0:.1f}" y="{top:.1f}" width="{x1 - x0:.1f}" height="{SURF - top:.1f}" fill="{BG}" stroke="{col}" stroke-width=".9"/>'
        # floors + windows
        fl = int(h / 3.1)
        for k in range(1, fl):
            yy = SURF - k * (SURF - top) / fl
            s += f'<line x1="{x0}" y1="{yy:.1f}" x2="{x1}" y2="{yy:.1f}" stroke="{op(.12)}" stroke-width=".6"/>'
            nw = int((x1 - x0) // 11)
            for j in range(nw):
                wx = x0 + 4 + j * (x1 - x0 - 6) / max(nw, 1)
                s += f'<rect x="{wx:.1f}" y="{yy + 3:.1f}" width="4" height="6" fill="none" stroke="{op(.22)}" stroke-width=".5"/>'
        s += f'<line x1="{x0 - 2}" y1="{top:.1f}" x2="{x1 + 2}" y2="{top:.1f}" stroke="{col}" stroke-width="1.2"/>'
        if school:
            s += f'<text x="{(x0 + x1) / 2:.1f}" y="{top - 8:.1f}" text-anchor="middle" style="fill:{col}">ÉCOLE · N°14</text>'
        mid = m + w / 2
        if 3290 < mid < 3390: marks.append(mid)
        m += w
    # settlement survey points
    vals = {0: '0,6', 1: '1,4', 2: '2,0', 3: '0,9', 4: '0,2'}
    for i, mm in enumerate(marks[:5]):
        x = X(mm); v = vals.get(i, '0,1')
        hot = alert and 3346 <= mm <= 3372
        c = RED if hot else (SIG if i == 2 and not alert else op(.8))
        s += f'<path d="M{x - 4:.1f},{SURF + 8} L{x + 4:.1f},{SURF + 8} L{x:.1f},{SURF + 1}" fill="{c}"/>'
        s += f'<text x="{x:.1f}" y="{SURF + 20}" text-anchor="middle" style="fill:{c};font-size:9.5px">{("> 15" if hot else v)} mm</text>'
    return s


def machine():
    t, h = 3212, HEAD
    yc, yi = Y(CROWN), Y(INV)
    s = ''
    # built tunnel: lining + ring ticks
    s += f'<rect x="{X(S0)}" y="{yc}" width="{X(t) - X(S0)}" height="{yi - yc}" fill="{BG}"/>'
    for y in (yc, yi):
        s += f'<rect x="{X(S0)}" y="{y - (3 if y == yc else 0)}" width="{X(t) - X(S0)}" height="3" fill="url(#h-ring)"/>'
        s += f'<line x1="{X(S0)}" y1="{y}" x2="{X(t)}" y2="{y}" stroke="{op(.6)}" stroke-width=".8"/>'
    for m in range(S0 + 2, t, 6):
        s += f'<line x1="{X(m):.1f}" y1="{yc}" x2="{X(m):.1f}" y2="{yi}" stroke="{op(.07)}" stroke-width=".6"/>'
    # back-up gantries
    for g in range(4):
        g0 = t + 2 + g * 21; g1 = g0 + 18
        s += f'<rect x="{X(g0):.1f}" y="{yc + 18}" width="{X(g1) - X(g0):.1f}" height="{yi - yc - 30}" fill="none" stroke="{op(.4)}" stroke-width=".8"/>'
        for k in (0.33, 0.66): s += f'<line x1="{X(g0 + 18 * k):.1f}" y1="{yc + 18}" x2="{X(g0 + 18 * k):.1f}" y2="{yi - 12}" stroke="{op(.2)}" stroke-width=".6"/>'
    # shield
    sh0 = h - 12
    s += f'<rect x="{X(sh0):.1f}" y="{yc - 2}" width="{X(h) - X(sh0):.1f}" height="{yi - yc + 4}" fill="{BG}" stroke="{INK}" stroke-width="1.3"/>'
    s += f'<line x1="{X(h - 3):.1f}" y1="{yc}" x2="{X(h - 3):.1f}" y2="{yi}" stroke="{op(.5)}" stroke-width=".8"/>'  # bulkhead
    s += f'<rect x="{X(h - 3):.1f}" y="{yc}" width="{X(h) - X(h - 3):.1f}" height="{yi - yc}" fill="url(#h-remb)"/>'  # chamber
    for k in range(5):
        yy = yc + 12 + k * (yi - yc - 24) / 4
        s += f'<line x1="{X(sh0 + 1):.1f}" y1="{yy:.1f}" x2="{X(h - 4):.1f}" y2="{yy:.1f}" stroke="{op(.35)}" stroke-width="2"/>'  # thrust rams
    s += f'<circle cx="{X(sh0 - 4):.1f}" cy="{(yc + yi) / 2:.1f}" r="13" fill="none" stroke="{op(.45)}" stroke-width=".8"/>'  # erector
    # cutterhead with teeth
    s += f'<line x1="{X(h):.1f}" y1="{yc - 3}" x2="{X(h):.1f}" y2="{yi + 3}" stroke="{INK}" stroke-width="3"/>'
    for k in range(13):
        yy = yc + k * (yi - yc) / 12
        s += f'<line x1="{X(h):.1f}" y1="{yy:.1f}" x2="{X(h) + 4:.1f}" y2="{yy:.1f}" stroke="{INK}" stroke-width="1"/>'
    # labels with leaders (below invert)
    lab = [(t + 40, 'Train suiveur', 0, 'middle'), (sh0 - 4, 'Érecteur', 1, 'end'), (h - 8, 'Vérins de poussée', 2, 'end'), (h - 1.5, 'Chambre', 0, 'start')]
    for m, txt, row, anc in lab:
        x = X(m); ly = yi + 20 + row * 14
        tx = x - 4 if anc == 'end' else (x + 4 if anc == 'start' else x)
        s += f'<line x1="{x:.1f}" y1="{yi - 4}" x2="{x:.1f}" y2="{ly - 3}" stroke="{op(.35)}" stroke-width=".6"/><text x="{tx:.1f}" y="{ly}" text-anchor="{anc}" style="fill:{op(.6)}">{txt}</text>'
    return s


def section(alert=False):
    s = f'<svg width="1440" height="640" style="position:absolute;left:0;top:0">{defs()}'
    # layers
    bounds = [[(X(S0), Y(0)), (X(S1), Y(0))]] + [wave(b, amp, i + 1) for i, (n, a, b, p, amp) in enumerate(LAYERS)]
    for i, (n, a, b, p, amp) in enumerate(LAYERS):
        top, bot = bounds[i], bounds[i + 1]
        if i == 3: bot = [(X(S0), Y(34.5)), (X(S1), Y(34.5))]
        s += f'<polygon points="{pl(top + bot[::-1])}" fill="url(#{p})"/>'
        if i: s += f'<polyline points="{pl(top)}" fill="none" stroke="{op(.28)}" stroke-width=".7"/>'
        s += f'<text x="{X0 + 4}" y="{(Y(a) + Y(min(b, 34))) / 2 + 3:.1f}" style="fill:{op(.55)};font-size:10px">{n.upper()}</text>'
    # fade bottom
    s += f'<rect x="0" y="{Y(31)}" width="1440" height="{Y(34.6) - Y(31)}" fill="url(#fade)"/>'
    s = s.replace('</defs>', f'<linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="{BG}" stop-opacity="0"/><stop offset="1" stop-color="{BG}"/></linearGradient></defs>')
    # water table
    wt = wave(8.2, 0.35, 2.2, 8)
    s += f'<polyline points="{pl(wt)}" fill="none" stroke="{WATER}" stroke-width=".9" stroke-dasharray="6 4"/>'
    wx = X(3168); wy = Y(8.2) - 5
    s += f'<path d="M{wx - 6},{wy - 8} L{wx + 6},{wy - 8} L{wx},{wy}" fill="none" stroke="{WATER}" stroke-width=".9"/><line x1="{wx - 4}" y1="{wy + 4}" x2="{wx + 4}" y2="{wy + 4}" stroke="{WATER}" stroke-width=".9"/><line x1="{wx - 2}" y1="{wy + 7}" x2="{wx + 2}" y2="{wy + 7}" stroke="{WATER}" stroke-width=".9"/>'
    s += f'<text x="{wx + 12}" y="{wy - 2}" style="fill:{WATER}">NAPPE  −8,2 m</text>'
    # surface
    s += f'<line x1="{X0}" y1="{SURF}" x2="{X1}" y2="{SURF}" stroke="{INK}" stroke-width="1.1"/>'
    s += buildings(alert)
    # existing metro
    mc, md, mr = 3428, 10, 3.6
    cx, cy = X(mc), Y(md)
    s += f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{mr * (X(S0 + 1) - X(S0)) + 3:.1f}" ry="{mr * VS:.1f}" fill="{BG}" stroke="{INK}" stroke-width="1"/>'
    s += f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{mr * (X(S0 + 1) - X(S0)) - 1:.1f}" ry="{mr * VS - 4:.1f}" fill="none" stroke="{op(.4)}" stroke-width=".7"/>'
    s += f'<text x="{cx + 22:.1f}" y="{cy - 22:.1f}" style="fill:{op(.75)}">MÉTRO EXISTANT</text>'
    s += dim_v(cx, md + mr, CROWN, '3,4 m', side=1)
    # future corridor
    s += f'<rect x="{X(HEAD):.1f}" y="{Y(CROWN)}" width="{X(S1) - X(HEAD):.1f}" height="{Y(INV) - Y(CROWN)}" fill="none" stroke="{op(.3)}" stroke-dasharray="2 4"/>'
    s += f'<line x1="{X(HEAD)}" y1="{Y(AX)}" x2="{X(S1)}" y2="{Y(AX)}" stroke="{op(.25)}" stroke-dasharray="14 4 2 4" stroke-width=".7"/>'
    s += f'<line x1="{X(S0)}" y1="{Y(AX)}" x2="{X(3212)}" y2="{Y(AX)}" stroke="{op(.25)}" stroke-dasharray="14 4 2 4" stroke-width=".7"/>'
    s += machine()
    # depth dimension
    s += dim_v(X(3196), 0, AX, '22,0 m  AXE', side=-1)
    # void
    if alert:
        vx0, vx1, vd0, vd1 = 3352, 3366, 12.2, 14.9
        pts = [(X(vx0), Y(13.6)), (X(vx0 + 3), Y(vd0)), (X(vx1 - 4), Y(vd0 + 0.2)), (X(vx1), Y(13.4)), (X(vx1 - 2), Y(vd1)), (X(vx0 + 2), Y(vd1 - 0.1))]
        s += f'<polygon points="{pl(pts)}" fill="url(#h-void)" stroke="{RED}" stroke-width="1.2"/>'
        s += dim_v(X(vx1 + 3), vd1, CROWN, '2,1 m', RED, 1, 'arr')
        s += f'<line x1="{X(vx0 + 7):.1f}" y1="{Y(vd0) - 2:.1f}" x2="{X(vx0 + 7):.1f}" y2="{SURF + 26}" stroke="{RED}" stroke-width=".8" stroke-dasharray="2 3"/>'
        s += f'<line x1="{X(vx0 - 1):.1f}" y1="{Y(13.6):.1f}" x2="{X(vx0 - 14):.1f}" y2="{Y(13.6) + 0:.1f}" stroke="{RED}" stroke-width=".8"/>'
        s += f'<text x="{X(vx0 - 15):.1f}" y="{Y(13.6) - 4:.1f}" text-anchor="end" style="fill:{RED};font-size:11px">VIDE PROBABLE · ≈ 6 m</text>'
        s += f'<text x="{X(vx0 - 15):.1f}" y="{Y(13.6) + 10:.1f}" text-anchor="end" style="fill:{RED};opacity:.75">ancienne carrière, comblement incomplet</text>'
        # distance ahead dimension
        y = Y(INV) + 52
        s += f'<line x1="{X(HEAD):.1f}" y1="{y}" x2="{X(vx0):.1f}" y2="{y}" stroke="{RED}" stroke-width=".8" marker-start="url(#arr)" marker-end="url(#arr)"/>'
        s += f'<text x="{(X(HEAD) + X(vx0)) / 2:.1f}" y="{y - 6}" text-anchor="middle" style="fill:{RED};font-size:11px">31,6 m</text>'
    # NOW line
    x = X(HEAD)
    s += f'<line x1="{x:.1f}" y1="{SURF - 128}" x2="{x:.1f}" y2="{Y(34)}" stroke="{SIG}" stroke-width="1"/>'
    s += f'<rect x="{x - 1:.1f}" y="{SURF - 146}" width="168" height="18" fill="{SIG}"/><text x="{x + 6:.1f}" y="{SURF - 133.5}" style="fill:{BG};font-weight:500">PK 3+320,4 · MAINTENANT</text>'
    # chainage ruler
    yy = Y(34.6) + 6
    for m in range(S0, S1 + 1, 10):
        hgt = 7 if m % 50 == 0 else 3
        s += f'<line x1="{X(m):.1f}" y1="{yy}" x2="{X(m):.1f}" y2="{yy + hgt}" stroke="{op(.45)}" stroke-width=".7"/>'
        if m % 50 == 0 and S0 < m < S1: s += f'<text x="{X(m):.1f}" y="{yy + 19}" text-anchor="middle" style="fill:{op(.5)}">3+{m % 1000:03d}</text>'
    s += '</svg>'
    return s


# ---------- bottom views ----------
def view_label(x, y, letter, title):
    return f'<text x="{x}" y="{y}" style="font-size:10.5px;fill:{op(.55)};letter-spacing:.06em">{letter} — {title}</text>'


def front_view(x, y, alert=False):
    cx, cy, R = x + 118, y + 112, 86
    s = view_label(x, y, 'A', 'VUE DE FACE · ROUE DE COUPE')
    s += f'<circle cx="{cx}" cy="{cy}" r="{R + 10}" fill="none" stroke="{op(.18)}" stroke-width=".7"/>'
    vals = [2.40, 2.41, 2.38, 2.42, 2.39, 2.40, 2.43, 2.27] if not alert else [2.40, 2.41, 2.38, 2.42, 2.39, 2.40, 2.43, 2.12]
    for i, v in enumerate(vals):
        a0 = -math.pi / 2 + i * math.pi / 4 + 0.05; a1 = a0 + math.pi / 4 - 0.1
        dev = abs(v - 2.4) / 2.4; c = op(.75) if dev < .05 else (AMB if dev < .1 else RED)
        rr = R + 10
        s += f'<path d="M{cx + rr * math.cos(a0):.1f},{cy + rr * math.sin(a0):.1f} A{rr},{rr} 0 0 1 {cx + rr * math.cos(a1):.1f},{cy + rr * math.sin(a1):.1f}" fill="none" stroke="{c}" stroke-width="{4 if c != op(.75) else 2}"/>'
    r = random.Random(4)
    for k in range(48):
        a = k * 2 * math.pi / 48; wear = r.random() ** 3
        if k in (7, 19, 33): wear = 0.92
        L = 6 + wear * 22; r0 = R - 4
        c = AMB if wear > .85 else op(.7)
        s += f'<line x1="{cx + r0 * math.cos(a):.1f}" y1="{cy + r0 * math.sin(a):.1f}" x2="{cx + (r0 - L) * math.cos(a):.1f}" y2="{cy + (r0 - L) * math.sin(a):.1f}" stroke="{c}" stroke-width="{1.6 if c == AMB else 1}"/>'
    s += f'<circle cx="{cx}" cy="{cy}" r="{R - 36}" fill="none" stroke="{op(.15)}" stroke-width=".7"/>'
    for k in range(6):
        a = k * math.pi / 3 + .26
        s += f'<line x1="{cx + 14 * math.cos(a):.1f}" y1="{cy + 14 * math.sin(a):.1f}" x2="{cx + (R - 36) * math.cos(a):.1f}" y2="{cy + (R - 36) * math.sin(a):.1f}" stroke="{op(.15)}" stroke-width=".7"/>'
    s += f'<text x="{cx}" y="{cy + 2}" text-anchor="middle" class="t" style="font-family:GS;font-size:22px;font-weight:500">{"2,36" if alert else "2,38"}</text><text x="{cx}" y="{cy + 18}" text-anchor="middle" style="fill:{op(.5)}">BAR</text>'
    tx = cx + R + 34
    rows = [('Pression du front', '2,38 bar', 'cible 2,40'), ('Secteur 8', '2,27 bar' if not alert else '2,12 bar', 'bas · sous bâti ancien' if not alert else 'chute en cours'), ('Molettes', '48', '3 usées · changer sous 40 m'), ('Rotation', '1,6 tr/min', '')]
    for i, (k, v, n) in enumerate(rows):
        yy = y + 40 + i * 44
        c = AMB if i in (1, 2) and not (alert and i == 1) else (RED if alert and i == 1 else INK)
        s += f'<text x="{tx}" y="{yy}" style="fill:{op(.5)}">{k.upper()}</text><text x="{tx}" y="{yy + 17}" style="font-family:GS;font-size:15px;fill:{c}">{v}</text>'
        if n: s += f'<text x="{tx + 82}" y="{yy + 16}" style="fill:{op(.45)}">{n}</text>'
    return s


def plan_view(x, y, w, alert=False):
    s = view_label(x, y, 'B', 'VUE EN PLAN · SURFACE')
    oy = y + 20; h = 176
    # streets
    s += f'<rect x="{x}" y="{oy + 70}" width="{w}" height="34" fill="none"/>'
    s += f'<line x1="{x}" y1="{oy + 70}" x2="{x + w}" y2="{oy + 70}" stroke="{op(.35)}" stroke-width=".8"/><line x1="{x}" y1="{oy + 104}" x2="{x + w}" y2="{oy + 104}" stroke="{op(.35)}" stroke-width=".8"/>'
    for sx in (x + 150, x + 390):
        s += f'<line x1="{sx}" y1="{oy}" x2="{sx}" y2="{oy + 70}" stroke="{op(.35)}" stroke-width=".8"/><line x1="{sx + 26}" y1="{oy}" x2="{sx + 26}" y2="{oy + 70}" stroke="{op(.35)}" stroke-width=".8"/>'
        s += f'<line x1="{sx}" y1="{oy + 104}" x2="{sx}" y2="{oy + h}" stroke="{op(.35)}" stroke-width=".8"/><line x1="{sx + 26}" y1="{oy + 104}" x2="{sx + 26}" y2="{oy + h}" stroke="{op(.35)}" stroke-width=".8"/>'
    r = random.Random(2)
    for bx0, bx1 in [(x, x + 150), (x + 176, x + 390), (x + 416, x + w)]:
        for by0, by1 in [(oy, oy + 70), (oy + 104, oy + h)]:
            xx = bx0 + 6
            while xx < bx1 - 20:
                ww = r.choice([22, 28, 34]); school = alert and bx0 == x + 176 and by0 == oy + 104 and 260 < xx - x < 330
                s += f'<rect x="{xx}" y="{by0 + 6}" width="{min(ww, bx1 - 6 - xx)}" height="{by1 - by0 - 12}" fill="{"rgba(227,56,42,.10)" if school else "none"}" stroke="{RED if school else op(.28)}" stroke-width=".7"/>'
                if school and not getattr(plan_view, 'done', False): s += f'<text x="{xx + 4}" y="{by1 - 10}" style="fill:{RED}">ÉCOLE</text>'; plan_view.done = True
                xx += ww + 3
    # tunnel trace (passes under the street, then turns under blocks)
    p0 = (x, oy + 87); p1 = (x + 250, oy + 87); p2 = (x + w, oy + 150)
    s += f'<path d="M{p0[0]},{p0[1]} L{p1[0]},{p1[1]} Q{x + 330},{oy + 87} {p2[0]},{p2[1]}" fill="none" stroke="{op(.4)}" stroke-width="14" stroke-opacity=".18"/>'
    s += f'<path d="M{p0[0]},{p0[1]} L{p1[0]},{p1[1]} Q{x + 330},{oy + 87} {p2[0]},{p2[1]}" fill="none" stroke="{op(.6)}" stroke-width=".8" stroke-dasharray="14 4 2 4"/>'
    mx = x + 236
    s += f'<rect x="{mx - 70}" y="{oy + 81}" width="70" height="12" fill="{BG}" stroke="{INK}" stroke-width="1"/><line x1="{mx}" y1="{oy + 78}" x2="{mx}" y2="{oy + 96}" stroke="{INK}" stroke-width="2.5"/>'
    s += f'<line x1="{mx}" y1="{oy - 4}" x2="{mx}" y2="{oy + h}" stroke="{SIG}" stroke-width="1"/>'
    if alert:
        s += f'<circle cx="{x + 300}" cy="{oy + 96}" r="11" fill="url(#h-void)" stroke="{RED}" stroke-width="1"/>'
    # north + scale
    s += f'<path d="M{x + w - 14},{oy + 8} L{x + w - 8},{oy + 24} L{x + w - 14},{oy + 20} L{x + w - 20},{oy + 24} Z" fill="{INK}"/><text x="{x + w - 14}" y="{oy + 36}" text-anchor="middle">N</text>'
    s += f'<line x1="{x}" y1="{oy + h + 14}" x2="{x + 71}" y2="{oy + h + 14}" stroke="{INK}" stroke-width="1"/><line x1="{x}" y1="{oy + h + 10}" x2="{x}" y2="{oy + h + 18}" stroke="{INK}"/><line x1="{x + 71}" y1="{oy + h + 10}" x2="{x + 71}" y2="{oy + h + 18}" stroke="{INK}"/><text x="{x + 80}" y="{oy + h + 18}" style="fill:{op(.5)}">25 m</text>'
    return s


def progress_view(x, y, alert=False):
    s = view_label(x, y, 'C', 'AVANCEMENT · POSTE DE NUIT')
    s += f'<text x="{x}" y="{y + 70}" style="font-family:GS;font-size:62px;font-weight:500;letter-spacing:-2px">8,4</text><text x="{x + 92}" y="{y + 70}" style="font-family:GS;font-size:16px;fill:{op(.5)}">/ 12 m</text>'
    # hourly bars 22h -> 06h
    hrs = [1.6, 1.8, 1.4, 1.7, 1.9, 0, 0, 0] if not alert else [1.6, 1.8, 1.4, 1.7, 0.3, 0, 0, 0]
    for i, v in enumerate(hrs):
        bx = x + i * 27; bh = v * 26
        s += f'<rect x="{bx}" y="{y + 140 - bh}" width="22" height="{max(bh, 1)}" fill="{(SIG if i == 4 else INK) if v else op(.15)}" fill-opacity="{1 if v else 1}"/>'
        s += f'<text x="{bx + 11}" y="{y + 156}" text-anchor="middle" style="fill:{op(.4)};font-size:9px">{(22 + i) % 24:02d}h</text>'
    s += f'<line x1="{x}" y1="{y + 140 - 1.5 * 26}" x2="{x + 214}" y2="{y + 140 - 1.5 * 26}" stroke="{op(.4)}" stroke-dasharray="2 3"/><text x="{x + 220}" y="{y + 140 - 1.5 * 26 + 3}" style="fill:{op(.45)}">1,5 m/h</text>'
    rows = [('ANNEAU', '1 284', 'voussoir 4/7'), ('POUSSÉE', '38 200 kN', ''), ('TASSEMENT MAX', '2,0 mm' if not alert else 'à surveiller', 'seuil 10')]
    for i, (k, v, n) in enumerate(rows):
        yy = y + 176 + i * 19
        s += f'<text x="{x}" y="{yy}" style="fill:{op(.5)}">{k}</text><text x="{x + 120}" y="{yy}" style="fill:{INK}">{v}</text><text x="{x + 200}" y="{yy}" style="fill:{op(.4)}">{n}</text>'
    return s


def header(state='EN CREUSEMENT', col=SIG, clock='02:14'):
    return f"""<div style="position:absolute;left:40px;right:40px;top:22px;display:flex;align-items:center;gap:16px">
<span style="font-weight:600;font-size:17px;letter-spacing:.04em">COLOSSE</span>
<span style="font-family:GM;font-size:11px;color:{op(.55)};letter-spacing:.04em">TUNNELIER YSÉE · COUPE LONGITUDINALE · TRONÇON FICTIF SOUS PARIS · ÉCHELLE VERTICALE ×3,4</span>
<span style="flex:1"></span>
<span style="font-family:GM;font-size:11px;display:flex;align-items:center;gap:7px;color:{col}"><i style="width:7px;height:7px;border-radius:50%;background:{col};display:inline-block"></i>{state}</span>
<span style="font-family:GM;font-size:11px;color:{op(.55)}">POSTE DE NUIT</span><span style="font-family:GS;font-size:17px;font-variant-numeric:tabular-nums">{clock}</span></div>"""


def page(alert):
    bottom = f'<svg width="1440" height="260" style="position:absolute;left:0;top:640px">{defs()}'
    bottom += f'<line x1="40" y1="0" x2="1400" y2="0" stroke="{op(.2)}" stroke-width=".8"/>'
    bottom += front_view(40, 28, alert)
    bottom += f'<line x1="520" y1="18" x2="520" y2="240" stroke="{op(.12)}"/>'
    bottom += plan_view(552, 28, 500, alert)
    bottom += f'<line x1="1084" y1="18" x2="1084" y2="240" stroke="{op(.12)}"/>'
    bottom += progress_view(1112, 28, alert) + '</svg>'
    return bottom


def decision():
    opts = [('A', 'Ralentir et combler', '4 m/jour, coulis injecté devant la roue', '+3 jours', '≈ 3 mm', True),
            ('B', 'Arrêter et sonder', 'Forage depuis la surface, rue fermée', '+2 jours', '≈ 1 mm', False),
            ('C', 'Continuer', 'Rythme normal', 'aucun délai', '> 15 mm', False)]
    rows = ''.join(f"""<div style="display:flex;gap:12px;padding:12px 0;border-top:1px solid {op(.14)};{'' if not on else ''}">
<span style="font-family:GM;font-size:11px;width:16px;color:{SIG if on else op(.5)}">{l}</span>
<div style="flex:1"><div style="font-size:14px;font-weight:500;color:{SIG if on else INK}">{t}</div><div style="font-size:12px;color:{op(.5)};margin-top:2px">{d}</div></div>
<div style="text-align:right;font-family:GM;font-size:11px"><div style="color:{RED if '>' in mm else INK}">{mm}</div><div style="color:{op(.45)};margin-top:3px">{dl}</div></div></div>""" for l, t, d, dl, mm, on in opts)
    return f"""<div style="position:absolute;right:40px;top:66px;width:360px;background:{BG};border:1px solid {RED};padding:16px 18px 14px">
<div style="font-family:GM;font-size:10.5px;color:{RED};letter-spacing:.06em">ANOMALIE · 02:09 · SONDE FRONTALE</div>
<div style="font-size:19px;font-weight:500;line-height:1.25;margin:8px 0 12px">Le sol répond comme un vide, 31 m devant la roue.</div>
{rows}
<div style="font-size:11.5px;color:{op(.5)};margin:10px 0 12px;line-height:1.45">Effet estimé sur le tassement de l'école. L'ingénieur de quart décide, sa décision est tracée.</div>
<div style="display:flex;gap:8px"><div style="flex:1.2;background:{SIG};color:{BG};padding:11px;text-align:center;font-weight:500;font-size:13px">Appliquer A</div><div style="flex:1;border:1px solid {op(.3)};padding:10px;text-align:center;font-size:13px">Appeler la géotechnique</div></div></div>"""


def html(alert):
    hdr = header('ANOMALIE DEVANT LA ROUE', RED, '02:11') if alert else header()
    return f"""<html><head><style>{CSS}</style></head><body>{section(alert)}{hdr}{page(alert)}{decision() if alert else ''}</body></html>"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=2)
        for n, a in [('v2-1-pilotage', False), ('v2-2-anomalie', True)]:
            path = f'/home/claude/colosse/out/{n}{SUF}.html'; open(path, 'w').write(html(a))
            await pg.goto('file://' + path); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(200)
            await pg.screenshot(path=f'/home/claude/colosse/out/{n}{SUF}.png')
        await b.close()

if __name__ == '__main__':
    asyncio.run(main())
