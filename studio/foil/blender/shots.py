import sys, math
sys.path.insert(0,'/home/claude/ecrin/b3d'); sys.path.insert(0,'/home/claude/elan/b3d')
from cards import *
def dark():
    reset(); world((0.02,0.02,0.025),0.3); cyclo((0.04,0.04,0.05),rough=0.5,spec=0.4)
def hero(n=None):
    dark()
    c=card('C1'); c.rotation_euler=(math.radians(4),0,math.radians(-22)); c.location=(0,0,4.6)
    area('key',(-7,-10,9),(0,0,4.5),10,700); area('rim',(8,-3,6),(0,0,4.5),2,900,size_y=9); area('top',(2,-6,12),(0,0,4.5),4,300,size_y=4)
    camera((2.5,-31,5.6),(0,0,4.6),lens=85,fstop=5.6)
    return 1700,1275

import scene as S
S.TEX='/home/claude/ecrin/tex/'
def phones():
    reset(); world((0.02,0.02,0.025),0.3); cyclo((0.05,0.05,0.06),rough=0.5,spec=0.4)
    m=materials(case=(0.62,0.63,0.66))
    for i,t in enumerate(['p_Collection.png','p_Fiche.png','p_Valeur.png']):
        p=phone(t,m,name=f'T{i}'); place(p,loc=((i-1)*2.85,0,0),tilt=79,yaw=-16); ground(p)
    area('key',(-8,-10,10),(0,0,2.2),10,900); area('rim',(9,-4,6),(0,0,2.2),2,2600,size_y=9); area('top',(1,-6,12),(0,0,2.2),5,300)
    camera((1.8,-23.5,3.6),(0.1,-.2,2.12),lens=85,fstop=8)
    return 1700,1062
def duo():
    reset(); world((0.02,0.02,0.025),0.3); cyclo((0.05,0.05,0.06),rough=0.5,spec=0.4)
    m=materials(case=(0.62,0.63,0.66))
    p=phone('p_Collection.png',m); place(p,loc=(2.9,1.0,0),tilt=79,yaw=-14,scale=1.5); ground(p)
    c=card('C2'); c.rotation_euler=(math.radians(8),0,math.radians(22)); c.location=(-3.3,-1.2,3.6); c.scale=(0.62,0.62,0.62)
    area('key',(-8,-10,10),(0,0,3),10,800); area('rim',(9,-4,6),(0,0,3),2,2600,size_y=9); area('top',(1,-6,12),(0,0,3),5,300)
    camera((0.3,-37,4.4),(0,0,3.3),lens=85,fstop=8)
    return 1700,1062


def angles():
    reset(); world((0.02,0.02,0.025),0.3); cyclo((0.05,0.05,0.06),rough=0.5,spec=0.4)
    for i,y in enumerate([-34,0,34]):
        c=card(f'A{i}'); c.rotation_euler=(math.radians(3),0,math.radians(y)); c.location=((i-1)*7.4,0,4.5)
    area('key',(-7,-10,9),(0,0,4.5),10,520); area('rim',(9,-4,6),(0,0,4.5),2,500,size_y=9); area('top',(1,-6,12),(0,0,4.5),5,300)
    camera((0,-52,5.4),(0,0,4.5),lens=85,fstop=8)
    return 1700,956

def turn_frames():
    import bpy
    reset(); world((0.02,0.02,0.025),0.3); cyclo((0.05,0.05,0.06),rough=0.5,spec=0.4)
    c=card('T'); c.location=(0,0,4.5)
    area('key',(-7,-10,9),(0,0,4.5),10,520); area('rim',(9,-4,6),(0,0,4.5),2,500,size_y=9); area('top',(1,-6,12),(0,0,4.5),5,300)
    camera((0,-33,5.0),(0,0,4.5),lens=85,fstop=8)
    n=24
    for i in range(n):
        a=math.sin(2*math.pi*i/n)*38
        c.rotation_euler=(math.radians(3),0,math.radians(a))
        render(f'/home/claude/ecrin/out/turn/t_{i:02d}.png',900,1125,20)
    return None

if __name__=='__main__':
    name=sys.argv[1]; samples=int(sys.argv[2]) if len(sys.argv)>2 else 32
    r=globals()[name]()
    if r: render(f'/home/claude/ecrin/out/{name}.png',r[0],r[1],samples)
