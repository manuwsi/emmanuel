import sys, math
sys.path.insert(0,'/home/claude/ecrin/b3d'); sys.path.insert(0,'/home/claude/elan/b3d')
from cards import *
import scene as S
S.TEX='/home/claude/ecrin/tex/'
def stage(bg=(0.05,0.05,0.06)):
    reset(); world((0.02,0.02,0.025),0.3); cyclo(bg,rough=0.5,spec=0.4)
def lights(t,k=1.0,rim=500):
    area('key',(-7,-10,9),t,10,520*k); area('rim',(9,-4,6),t,2,rim,size_y=9); area('top',(1,-6,12),t,5,300*k)
def hero2():
    stage(); c=card('H',**REAL); c.rotation_euler=(math.radians(4),0,math.radians(-22)); c.location=(0,0,4.6)
    lights((0,0,4.5),1.2); camera((2.5,-31,5.6),(0,0,4.6),lens=85,fstop=5.6); return 1700,1275
def angles2():
    stage()
    for i,y in enumerate([-34,0,34]):
        c=card(f'A{i}',**REAL); c.rotation_euler=(math.radians(3),0,math.radians(y)); c.location=((i-1)*7.4,0,4.5)
    lights((0,0,4.5),1.0,500); camera((0,-52,5.4),(0,0,4.5),lens=85,fstop=8); return 1700,956
def phones2():
    stage(); m=materials(case=(0.62,0.63,0.66))
    for i,t in enumerate(['q_Accueil.png','q_Fiche.png','q_Constellation.png']):
        p=phone(t,m,name=f'T{i}'); place(p,loc=((i-1)*2.85,0,0),tilt=79,yaw=-16); ground(p)
    area('key',(-8,-10,10),(0,0,2.2),10,900); area('rim',(9,-4,6),(0,0,2.2),2,2600,size_y=9); area('top',(1,-6,12),(0,0,2.2),5,300)
    camera((1.8,-23.5,3.6),(0.1,-.2,2.12),lens=85,fstop=8); return 1700,1062
def lineup():
    stage(); m=materials(case=(0.62,0.63,0.66))
    for i,t in enumerate(['q_Constellation.png','q_Accueil.png','q_Fiche.png','q_Serie.png','q_Vitrine.png']):
        p=phone(t,m,name=f'L{i}'); place(p,loc=((i-2)*2.55,(abs(i-2))*0.5,0),tilt=79,yaw=-12+(i-2)*4); ground(p)
    area('key',(-8,-10,10),(0,0,2.2),12,950); area('rim',(9,-4,6),(0,0,2.2),2,2600,size_y=9); area('top',(1,-6,12),(0,0,2.2),5,300)
    camera((0.4,-29,3.5),(0,0,2.15),lens=85,fstop=8); return 1700,956
def duo2():
    stage(); m=materials(case=(0.62,0.63,0.66))
    p=phone('q_Accueil.png',m); place(p,loc=(2.9,1.0,0),tilt=79,yaw=-14,scale=1.5); ground(p)
    c=card('C2',**REAL); c.rotation_euler=(math.radians(8),0,math.radians(22)); c.location=(-3.3,-1.2,3.6); c.scale=(0.62,0.62,0.62)
    lights((0,0,3),1.0,2600); camera((0.3,-37,4.4),(0,0,3.3),lens=85,fstop=8); return 1700,1062
def collection():
    stage()
    cards=[('real/reshiram.png',.719,.42),('real/roger.png',.757,.2),('real/stardust.png',.714,.22),('real/zekrom.png',.719,.28),('real/mewtwo.png',.714,.2)]
    for i,(f,asp,h) in enumerate(cards):
        c=card(f'K{i}',front=f,mask='real/mask_real.png',lum=False,holo=h,w=0.88*asp)
        x=(i-2)*7.0; c.rotation_euler=(math.radians(3),0,math.radians(-(i-2)*9)); c.location=(x,abs(i-2)*0.45,4.5)
    lights((0,0,4.5),1.0,500); camera((0,-90,5.0),(0,0,4.5),lens=85,fstop=8); return 2000,800
def turn():
    stage(); c=card('T',**REAL); c.location=(0,0,4.5); lights((0,0,4.5),1.2,600); camera((0,-33,5.0),(0,0,4.5),lens=85,fstop=8)
    n=24
    for i in range(n):
        c.rotation_euler=(math.radians(3),0,math.radians(math.sin(2*math.pi*i/n)*38))
        render(f'/home/claude/ecrin/out/turn/t_{i:02d}.png',800,1000,18)
if __name__=='__main__':
    name=sys.argv[1]; samples=int(sys.argv[2]) if len(sys.argv)>2 else 32
    r=globals()[name]()
    if r: render(f'/home/claude/ecrin/out/{name}.png',r[0],r[1],samples)
