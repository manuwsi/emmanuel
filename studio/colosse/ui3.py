"""Colosse v2 — three more screens in the technical-drawing language: handover, ring build, hyperbaric intervention."""
import asyncio, math
from playwright.async_api import async_playwright
from ui2 import CSS, INK, BG, SIG, AMB, RED, op, defs, SUF

MONO = "font-family:GM;font-size:11px;letter-spacing:.04em"


def header(title, state, col, clock):
    return f"""<div style="position:absolute;left:40px;right:40px;top:22px;display:flex;align-items:center;gap:16px">
<span style="font-weight:600;font-size:17px;letter-spacing:.04em">YSÉE</span>
<span style="{MONO};color:{op(.55)}">{title}</span><span style="flex:1"></span>
<span style="{MONO};display:flex;align-items:center;gap:7px;color:{col}"><i style="width:7px;height:7px;border-radius:50%;background:{col};display:inline-block"></i>{state}</span>
<span style="font-family:GS;font-size:17px;font-variant-numeric:tabular-nums">{clock}</span></div>"""


def label(x, y, t, c=None): return f'<text x="{x}" y="{y}" style="font-size:10.5px;fill:{c or op(.55)};letter-spacing:.06em">{t}</text>'


def cartouche(x, y, w, rows, title):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{30 + 34 * len(rows)}" fill="none" stroke="{op(.5)}" stroke-width=".8"/>'
    s += f'<text x="{x + 12}" y="{y + 20}" style="font-size:10.5px;fill:{op(.55)};letter-spacing:.06em">{title}</text>'
    for i, (k, v) in enumerate(rows):
        yy = y + 30 + i * 34
        s += f'<line x1="{x}" y1="{yy}" x2="{x + w}" y2="{yy}" stroke="{op(.25)}" stroke-width=".7"/><line x1="{x + 130}" y1="{yy}" x2="{x + 130}" y2="{yy + 34}" stroke="{op(.25)}" stroke-width=".7"/>'
        s += f'<text x="{x + 12}" y="{yy + 21}" style="fill:{op(.5)}">{k}</text><text x="{x + 142}" y="{yy + 22}" style="font-family:GS;font-size:13px;fill:{INK}">{v}</text>'
    return s


# ---------- 3. Relève : la nuit dessinée le long du tunnel ----------
def releve():
    x0, x1 = 120, 1300; yc, yi = 330, 480
    rings = list(range(1279, 1287)); rw = (x1 - x0) / len(rings)
    s = f'<svg width="1440" height="900" style="position:absolute;left:0;top:0">{defs()}'
    s += label(40, 96, 'COUPE DÉTAILLÉE · CE QUI A ÉTÉ CREUSÉ CETTE NUIT · 9,6 m')
    # soil above/below
    s += f'<rect x="{x0}" y="{yc - 120}" width="{x1 - x0}" height="120" fill="url(#h-calc)"/><rect x="{x0}" y="{yi}" width="{x1 - x0}" height="70" fill="url(#h-calc)"/>'
    for y in (yc, yi):
        s += f'<line x1="{x0 - 40}" y1="{y}" x2="{x1 + 50}" y2="{y}" stroke="{INK}" stroke-width="1"/>'
    for i, r in enumerate(rings):
        x = x0 + i * rw
        s += f'<rect x="{x:.1f}" y="{yc}" width="{rw:.1f}" height="{yi - yc}" fill="{BG}" stroke="{op(.45)}" stroke-width=".8"/>'
        s += f'<rect x="{x:.1f}" y="{yc}" width="{rw:.1f}" height="8" fill="url(#h-ring)"/><rect x="{x:.1f}" y="{yi - 8}" width="{rw:.1f}" height="8" fill="url(#h-ring)"/>'
        s += f'<text x="{x + rw / 2:.1f}" y="{yc + 86}" text-anchor="middle" style="font-family:GS;font-size:15px;fill:{op(.8)}">{r}</text>'
        s += f'<text x="{x + rw / 2:.1f}" y="{yc + 102}" text-anchor="middle" style="fill:{op(.4)};font-size:9.5px">ANNEAU</text>'
    s += f'<line x1="{x0 - 40}" y1="{(yc + yi) / 2}" x2="{x1 + 50}" y2="{(yc + yi) / 2}" stroke="{op(.2)}" stroke-dasharray="14 4 2 4" stroke-width=".7"/>'
    # machine face at the end
    s += f'<line x1="{x1 + 50}" y1="{yc - 4}" x2="{x1 + 50}" y2="{yi + 4}" stroke="{INK}" stroke-width="3"/><text x="{x1 + 58}" y="{yc + 4}" style="fill:{op(.6)}">ROUE</text>'
    # dimension of the night
    yd = yi + 104
    s += f'<line x1="{x0}" y1="{yd}" x2="{x1}" y2="{yd}" stroke="{INK}" stroke-width=".8" marker-start="url(#ar)" marker-end="url(#ar)"/><line x1="{x0}" y1="{yd - 6}" x2="{x0}" y2="{yd + 6}" stroke="{INK}"/><line x1="{x1}" y1="{yd - 6}" x2="{x1}" y2="{yd + 6}" stroke="{INK}"/>'
    s += f'<text x="{(x0 + x1) / 2}" y="{yd - 7}" text-anchor="middle" style="font-family:GS;font-size:13px">9,6 m · 22:00 → 06:00</text>'
    # events pinned where they happened
    ev = [(0.6, '22:00', 'Prise de poste', op(.7), 0, 'start'), (2.4, '23:40', '4 molettes changées, secteur 3', op(.7), 1, 'start'),
          (4.3, '01:15', 'Pression basse secteur 8 · revenue après 6 m', AMB, 0, 'end'), (5.6, '02:09', 'Vide probable détecté · décision A', RED, 1, 'start'),
          (7.6, '05:50', 'Fin de poste', op(.7), 0, 'start')]
    for pos, t, txt, c, row, anc in ev:
        x = x0 + pos * rw; ty = yc - 100 - row * 46
        s += f'<line x1="{x:.1f}" y1="{yc}" x2="{x:.1f}" y2="{ty + 8}" stroke="{c}" stroke-width=".8"/><circle cx="{x:.1f}" cy="{yc}" r="3.5" fill="{c}"/>'
        tx = x + 6 if anc == 'start' else x - 6
        s += f'<text x="{tx:.1f}" y="{ty - 8}" text-anchor="{anc}" style="fill:{c};font-size:10.5px">{t}</text><text x="{tx:.1f}" y="{ty + 6}" text-anchor="{anc}" style="font-family:GS;font-size:13px;fill:{INK if c == op(.7) else c}">{txt}</text>'
    # ahead : void
    s += f'<text x="1400" y="{yi + 40}" text-anchor="end" style="fill:{RED}">VIDE · 20 m DEVANT</text><text x="1400" y="{yi + 54}" text-anchor="end" style="fill:{RED};opacity:.7">comblement en cours</text>'
    # bottom: watch + changes + cartouche
    yb = 668
    s += f'<line x1="40" y1="{yb - 20}" x2="1400" y2="{yb - 20}" stroke="{op(.2)}"/>'
    s += label(40, yb + 4, 'À SURVEILLER EN PRIORITÉ', AMB)
    s += f'<text x="40" y="{yb + 34}" style="font-family:GS;font-size:19px">Tassement sous l\'école du 14</text>'
    s += f'<text x="40" y="{yb + 90}" style="font-family:GS;font-size:52px;font-weight:500;letter-spacing:-1.5px">2,0</text><text x="122" y="{yb + 90}" style="font-family:GS;font-size:15px;fill:{op(.5)}">mm · alerte à 6 · seuil 10</text>'
    # small settlement chart over the night
    pts = [(40 + i * 40, yb + 170 - v * 10) for i, v in enumerate([0.2, 0.3, 0.4, 0.6, 1.1, 1.6, 1.9, 2.0])]
    s += f'<line x1="40" y1="{yb + 170 - 60}" x2="330" y2="{yb + 170 - 60}" stroke="{AMB}" stroke-dasharray="2 3" stroke-width=".8"/><text x="336" y="{yb + 113}" style="fill:{AMB}">6 mm</text>'
    s += f'<polyline points="{" ".join(f"{x},{y}" for x, y in pts)}" fill="none" stroke="{INK}" stroke-width="1.3"/>'
    for x, y in pts: s += f'<circle cx="{x}" cy="{y}" r="2" fill="{INK}"/>'
    s += f'<line x1="40" y1="{yb + 172}" x2="330" y2="{yb + 172}" stroke="{op(.3)}"/>'
    s += label(470, yb + 4, 'CE QUI CHANGE POUR LE POSTE DU MATIN')
    for i, (k, a, b) in enumerate([('Vitesse cible', '12 m/jour', '4 m/jour'), ('Pression de consigne', '2,40 bar', '2,55 bar'), ('Coulis devant la roue', 'non', 'oui, en continu')]):
        yy = yb + 40 + i * 48
        s += f'<text x="470" y="{yy}" style="fill:{op(.5)}">{k.upper()}</text>'
        s += f'<text x="470" y="{yy + 22}" style="font-family:GS;font-size:16px;fill:{op(.45)};text-decoration:line-through">{a}</text><text x="{470 + 110}" y="{yy + 22}" style="font-family:GS;font-size:16px">→  {b}</text>'
    s += cartouche(960, yb - 6, 440, [('ÉTABLI PAR', 'Équipe de nuit · R. Haddad'), ('DÉCISION 02:09', 'M. Ferrand, ingénieur de quart'), ('REPRIS PAR', '—')], 'RELÈVE N° 214 · 06:00')
    s += '</svg>'
    btn = f'<div style="position:absolute;left:1102px;top:828px;width:298px;background:{SIG};color:{BG};padding:12px;text-align:center;font-weight:500;font-size:14px">Signer et prendre le poste</div>'
    return f'<html><head><style>{CSS}</style></head><body>{s}{header("RELÈVE · POUR L’ÉQUIPE DU MATIN", "FIN DE POSTE", op(.7), "05:58")}{btn}</body></html>'


# ---------- 4. Voussoirs : construire l'anneau ----------
def voussoirs():
    cx, cy, R, T = 470, 470, 300, 46
    s = f'<svg width="1440" height="900" style="position:absolute;left:0;top:0">{defs()}'
    s += label(40, 96, 'VUE DE FACE · ANNEAU 1 284 · 6 VOUSSOIRS + 1 CLÉ')
    segs = [(-90 + 26, 54, 'V1', 'posé'), (-36 + 26, 54, 'V2', 'posé'), (18 + 26, 54, 'V3', 'posé'), (72 + 26, 54, 'V4', 'pose'), (126 + 26, 54, 'V5', 'attente'), (180 + 26, 54, 'V6', 'attente'), (234 + 26, 22, 'CLÉ', 'attente')]
    for a0, span, name, st in segs:
        a1 = a0 + span - 1.2; a0r, a1r = math.radians(a0 + 1.2), math.radians(a1)
        ro, ri = R, R - T
        p = f'M{cx + ro * math.cos(a0r):.1f},{cy + ro * math.sin(a0r):.1f} A{ro},{ro} 0 0 1 {cx + ro * math.cos(a1r):.1f},{cy + ro * math.sin(a1r):.1f} L{cx + ri * math.cos(a1r):.1f},{cy + ri * math.sin(a1r):.1f} A{ri},{ri} 0 0 0 {cx + ri * math.cos(a0r):.1f},{cy + ri * math.sin(a0r):.1f} Z'
        fill = 'url(#h-ring)' if st == 'posé' else (BG)
        stroke = SIG if st == 'pose' else (INK if st == 'posé' else op(.35))
        dash = '' if st != 'attente' else 'stroke-dasharray="4 4"'
        s += f'<path d="{p}" fill="{fill}" stroke="{stroke}" stroke-width="{2 if st == "pose" else 1}" {dash}/>'
        am = math.radians((a0 + a0 + span) / 2); rl = R + 26
        s += f'<text x="{cx + rl * math.cos(am):.1f}" y="{cy + rl * math.sin(am) + 4:.1f}" text-anchor="middle" style="font-size:11px;fill:{stroke}">{name}</text>'
    # erector arm toward V4
    am = math.radians(72 + 26 + 27)
    ex, ey = cx + (R - T - 20) * math.cos(am), cy + (R - T - 20) * math.sin(am)
    s += f'<circle cx="{cx}" cy="{cy}" r="34" fill="none" stroke="{op(.6)}"/><circle cx="{cx}" cy="{cy}" r="5" fill="{INK}"/>'
    s += f'<line x1="{cx}" y1="{cy}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{SIG}" stroke-width="3"/><rect x="{ex - 14:.1f}" y="{ey - 8:.1f}" width="28" height="16" fill="{BG}" stroke="{SIG}" transform="rotate({math.degrees(am) + 90:.0f} {ex:.1f} {ey:.1f})"/>'
    s += f'<text x="{cx + 44}" y="{cy + 34}" style="fill:{op(.6)}">ÉRECTEUR · 125°</text>'
    # key position marker
    # ovalisation dims
    s += f'<line x1="{cx - R + T}" y1="{cy}" x2="{cx + R - T}" y2="{cy}" stroke="{op(.3)}" stroke-dasharray="3 3"/>'
    s += f'<text x="{cx + 120}" y="{cy - 6}" style="fill:{op(.6)}">Ø INT. 8,70 m</text>'
    # right panel
    x = 880
    s += label(x, 96, 'VOUSSOIR EN COURS')
    s += f'<text x="{x}" y="150" style="font-family:GS;font-size:44px;font-weight:500;letter-spacing:-1px;fill:{SIG}">V4</text><text x="{x + 70}" y="150" style="font-family:GS;font-size:16px;fill:{op(.6)}">sur 7 · 4 min 20 s</text>'
    checks = [('Position angulaire', '98,2°', 'tolérance ± 0,5', 'ok'), ('Décalage avec V3', '3 mm', 'max 8', 'ok'), ('Joint d\'étanchéité', 'intact', 'contrôle caméra', 'ok'), ('Boulons', '0 / 4', 'à serrer', 'todo')]
    for i, (k, v, n, st) in enumerate(checks):
        yy = 210 + i * 58
        c = INK if st == 'ok' else AMB
        s += f'<line x1="{x}" y1="{yy - 22}" x2="1400" y2="{yy - 22}" stroke="{op(.15)}"/>'
        s += f'<text x="{x}" y="{yy}" style="fill:{op(.5)}">{k.upper()}</text><text x="{x}" y="{yy + 22}" style="font-family:GS;font-size:17px;fill:{c}">{v}</text><text x="{x + 160}" y="{yy + 21}" style="fill:{op(.4)}">{n}</text>'
        s += f'<text x="1400" y="{yy + 21}" text-anchor="end" style="fill:{SIG if st == "ok" else AMB}">{"✓" if st == "ok" else "…"}</text>'
    # tail detail (longitudinal)
    y0 = 480
    s += label(x, y0, 'DÉTAIL · QUEUE DU BOUCLIER')
    s += f'<rect x="{x}" y="{y0 + 20}" width="520" height="150" fill="url(#h-calc)"/>'
    s += f'<rect x="{x}" y="{y0 + 70}" width="300" height="20" fill="url(#h-ring)" stroke="{INK}" stroke-width=".8"/>'
    for k in range(5): s += f'<line x1="{x + k * 60}" y1="{y0 + 70}" x2="{x + k * 60}" y2="{y0 + 90}" stroke="{INK}" stroke-width=".8"/>'
    s += f'<rect x="{x + 240}" y="{y0 + 54}" width="280" height="12" fill="{BG}" stroke="{INK}"/>'
    s += f'<rect x="{x + 240}" y="{y0 + 66}" width="8" height="4" fill="{INK}"/>'
    for k in range(3): s += f'<path d="M{x + 260 + k * 14},{y0 + 66} l6,6 l6,-6" fill="none" stroke="{op(.7)}"/>'
    s += f'<rect x="{x + 120}" y="{y0 + 52}" width="120" height="18" fill="{SIG}" fill-opacity=".18"/>'
    s += f'<text x="{x + 180}" y="{y0 + 44}" text-anchor="middle" style="fill:{SIG}">COULIS INJECTÉ · 92 %</text>'
    s += f'<text x="{x + 300}" y="{y0 + 112}" style="fill:{op(.6)}">brosses d\'étanchéité ×3</text><text x="{x + 20}" y="{y0 + 112}" style="fill:{op(.6)}">anneaux posés</text>'
    s += f'<text x="{x + 400}" y="{y0 + 46}" style="fill:{op(.6)}">bouclier</text>'
    s += '</svg>'
    return f'<html><head><style>{CSS}</style></head><body>{s}{header("VOUSSOIRS · CONSTRUCTION DE L’ANNEAU", "POSE EN COURS", SIG, "02:16")}</body></html>'


# ---------- 5. Intervention hyperbare ----------
def hyperbare():
    s = f'<svg width="1440" height="900" style="position:absolute;left:0;top:0">{defs()}'
    # left: front view of cutterhead with 3 worn cutters + path
    cx, cy, R = 330, 420, 230
    s += label(40, 96, 'VUE DE FACE · MOLETTES À REMPLACER')
    s += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{INK}" stroke-width="1.4"/><circle cx="{cx}" cy="{cy}" r="{R - 10}" fill="none" stroke="{op(.3)}"/>'
    for k in range(6):
        a = math.radians(k * 60 + 15)
        s += f'<line x1="{cx + 40 * math.cos(a):.1f}" y1="{cy + 40 * math.sin(a):.1f}" x2="{cx + (R - 10) * math.cos(a):.1f}" y2="{cy + (R - 10) * math.sin(a):.1f}" stroke="{op(.5)}" stroke-width="16" stroke-opacity=".12"/>'
        for j in range(6):
            rr = 60 + j * 30; o = 9 if j % 2 else -9
            px, py = cx + rr * math.cos(a) - o * math.sin(a), cy + rr * math.sin(a) + o * math.cos(a)
            worn = (k, j) in [(1, 4), (3, 2), (5, 5)]
            s += f'<rect x="{px - 5:.1f}" y="{py - 2:.1f}" width="10" height="4" fill="{AMB if worn else op(.6)}" transform="rotate({k * 60 + 15} {px:.1f} {py:.1f})"/>'
            if worn:
                s += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="12" fill="none" stroke="{AMB}"/>'
    s += f'<circle cx="{cx}" cy="{cy}" r="36" fill="none" stroke="{INK}"/>'
    # manway + path
    s += f'<rect x="{cx - 26}" y="{cy + R - 70}" width="52" height="40" fill="{BG}" stroke="{SIG}" stroke-dasharray="3 3"/><text x="{cx}" y="{cy + R - 44}" text-anchor="middle" style="fill:{SIG}">ACCÈS</text>'
    s += f'<path d="M{cx},{cy + R - 70} C{cx + 10},{cy + 120} {cx + 140},{cy + 110} {cx + 150},{cy + 52}" fill="none" stroke="{SIG}" stroke-width="1" stroke-dasharray="2 4"/>'
    s += f'<text x="{cx}" y="{cy + R + 40}" text-anchor="middle" style="fill:{op(.55)}">ROUE BLOQUÉE · POSITION DE MAINTENANCE 15°</text>'
    # right: decompression profile
    x0, y0, w, h = 720, 160, 640, 280
    s += label(x0, 96, 'PROFIL DE PRESSION · ÉQUIPE DANS LA CHAMBRE')
    s += f'<line x1="{x0}" y1="{y0 + h}" x2="{x0 + w}" y2="{y0 + h}" stroke="{op(.4)}"/><line x1="{x0}" y1="{y0}" x2="{x0}" y2="{y0 + h}" stroke="{op(.4)}"/>'
    for b in (1, 2, 3):
        yy = y0 + h - b * 80
        s += f'<line x1="{x0}" y1="{yy}" x2="{x0 + w}" y2="{yy}" stroke="{op(.1)}"/><text x="{x0 - 8}" y="{yy + 3}" text-anchor="end" style="fill:{op(.45)}">{b} bar</text>'
    # times in minutes: 0 comp 0-15 to 2.5, work 15-195, decomp stages 195-300
    def P(t, p): return x0 + t / 300 * w, y0 + h - p * 80
    prof = [(0, 0), (15, 2.5), (195, 2.5), (205, 1.2), (225, 1.2), (232, 0.9), (262, 0.9), (268, 0.6), (290, 0.6), (300, 0)]
    pts = ' '.join(f'{P(t, p)[0]:.1f},{P(t, p)[1]:.1f}' for t, p in prof)
    s += f'<polyline points="{pts}" fill="none" stroke="{op(.35)}" stroke-width="1.2" stroke-dasharray="4 3"/>'
    done = [pt for pt in prof if pt[0] <= 112] + [(112, 2.5)]
    s += f'<polyline points="{" ".join(f"{P(t, p)[0]:.1f},{P(t, p)[1]:.1f}" for t, p in done)}" fill="none" stroke="{INK}" stroke-width="2"/>'
    nx, ny = P(112, 2.5)
    s += f'<line x1="{nx:.1f}" y1="{y0 - 10}" x2="{nx:.1f}" y2="{y0 + h}" stroke="{SIG}"/><circle cx="{nx:.1f}" cy="{ny:.1f}" r="4" fill="{SIG}"/>'
    s += f'<text x="{nx + 6:.1f}" y="{y0 - 2}" style="fill:{SIG}">MAINTENANT · 1 h 52 SOUS PRESSION</text>'
    for t, lab in [(0, '0'), (60, '1 h'), (120, '2 h'), (180, '3 h'), (240, '4 h'), (300, '5 h')]:
        s += f'<text x="{P(t, 0)[0]:.1f}" y="{y0 + h + 18}" text-anchor="middle" style="fill:{op(.45)}">{lab}</text>'
    s += f'<text x="{P(250, 1.2)[0]:.1f}" y="{P(250, 1.2)[1] - 10:.1f}" text-anchor="middle" style="fill:{op(.55)}">PALIERS DE DÉCOMPRESSION</text>'
    # sortie limite
    lx, _ = P(195, 0)
    s += f'<line x1="{lx:.1f}" y1="{y0}" x2="{lx:.1f}" y2="{y0 + h}" stroke="{AMB}" stroke-dasharray="3 3"/><text x="{lx + 6:.1f}" y="{y0 + 14}" style="fill:{AMB}">SORTIE AU PLUS TARD 05:15</text>'
    # crew
    yc = 520
    s += label(x0, yc, 'ÉQUIPE · 3 PERSONNES')
    crew = [('K. Diallo', 'chef d\'équipe', 'molette 1 / 3 changée', SIG), ('L. Moreau', 'technicien', 'en cours · bras 4', INK), ('S. Benali', 'technicien', 'en cours · bras 4', INK)]
    for i, (n, r, st, c) in enumerate(crew):
        yy = yc + 34 + i * 46
        s += f'<line x1="{x0}" y1="{yy - 20}" x2="{x0 + w}" y2="{yy - 20}" stroke="{op(.15)}"/>'
        s += f'<text x="{x0}" y="{yy + 4}" style="font-family:GS;font-size:16px">{n}</text><text x="{x0 + 150}" y="{yy + 3}" style="fill:{op(.5)}">{r.upper()}</text><text x="{x0 + w}" y="{yy + 3}" text-anchor="end" style="fill:{c}">{st}</text>'
    s += f'<line x1="{x0}" y1="{yc + 152}" x2="{x0 + w}" y2="{yc + 152}" stroke="{op(.15)}"/>'
    s += f'<text x="{x0}" y="{yc + 186}" style="fill:{op(.5)}">CONTACT</text><text x="{x0 + 150}" y="{yc + 187}" style="font-family:GS;font-size:15px">Interphone ouvert · dernier échange il y a 40 s</text>'
    s += '</svg>'
    stop = f'<div style="position:absolute;left:720px;top:780px;width:640px;display:flex;gap:10px"><div style="flex:1;border:1px solid {op(.3)};padding:12px;text-align:center;font-size:14px">Parler à l\'équipe</div><div style="flex:1;border:1px solid {RED};color:{RED};padding:12px;text-align:center;font-size:14px">Rappeler l\'équipe maintenant</div></div>'
    return f'<html><head><style>{CSS}</style></head><body>{s}{header("INTERVENTION SOUS PRESSION · CHAMBRE D’ABATTAGE", "ÉQUIPE DANS LA CHAMBRE", AMB, "03:07")}{stop}</body></html>'


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=2)
        for n, f in [('v2-3-releve', releve), ('v2-4-voussoirs', voussoirs), ('v2-5-hyperbare', hyperbare)]:
            path = f'/home/claude/colosse/out/{n}{SUF}.html'; open(path, 'w').write(f())
            await pg.goto('file://' + path); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(200)
            await pg.screenshot(path=f'/home/claude/colosse/out/{n}{SUF}.png')
        await b.close()

asyncio.run(main())
