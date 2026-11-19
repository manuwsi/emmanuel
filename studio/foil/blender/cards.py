import sys, math
sys.path.insert(0,'/home/claude/elan/b3d')
from scene import *
TX='/home/claude/ecrin/tex/'
REAL=dict(front='real/reshiram.png',mask='real/mask_real.png',lum=False,holo=0.62)

def img(nodes,path,cs='sRGB',ext='CLIP'):
    n=nodes.new('ShaderNodeTexImage'); n.image=bpy.data.images.load(path); n.image.colorspace_settings.name=cs; n.extension=ext; return n

def card_mat(name='Carte', holo=1.0, front='card_front.png', mask='card_mask.png', lum=True):
    m=newmat(name); nt=m.node_tree; N=nt.nodes; Lk=nt.links
    for n in list(N): N.remove(n)
    out=N.new('ShaderNodeOutputMaterial'); b=N.new('ShaderNodeBsdfPrincipled')
    tc=N.new('ShaderNodeTexCoord')
    f=img(N,TX+front); k=img(N,TX+mask,'Non-Color')
    Lk.new(tc.outputs['UV'],f.inputs['Vector']); Lk.new(tc.outputs['UV'],k.inputs['Vector'])
    # holo : angle de vue + balayage diagonal
    lw=N.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value=0.5
    sep=N.new('ShaderNodeSeparateXYZ'); Lk.new(tc.outputs['Object'],sep.inputs[0])
    add=N.new('ShaderNodeMath'); add.operation='ADD'; Lk.new(sep.outputs['X'],add.inputs[0]); Lk.new(sep.outputs['Y'],add.inputs[1])
    mul=N.new('ShaderNodeMath'); mul.operation='MULTIPLY'; mul.inputs[1].default_value=0.11; Lk.new(add.outputs[0],mul.inputs[0])
    mix=N.new('ShaderNodeMath'); mix.operation='ADD'; Lk.new(mul.outputs[0],mix.inputs[0]); 
    mul2=N.new('ShaderNodeMath'); mul2.operation='MULTIPLY'; mul2.inputs[1].default_value=1.6; Lk.new(lw.outputs['Facing'],mul2.inputs[0]); Lk.new(mul2.outputs[0],mix.inputs[1])
    ramp=N.new('ShaderNodeValToRGB'); ramp.color_ramp.interpolation='LINEAR'
    cols=[(0,(0.75,0.72,0.95)),(0.2,(0.55,0.85,0.98)),(0.4,(0.65,0.98,0.80)),(0.6,(0.98,0.93,0.62)),(0.8,(0.98,0.68,0.78)),(1,(0.75,0.72,0.95))]
    ramp.color_ramp.elements[0].position=0; ramp.color_ramp.elements[0].color=(*cols[0][1],1)
    ramp.color_ramp.elements[1].position=1; ramp.color_ramp.elements[1].color=(*cols[-1][1],1)
    for p,c in cols[1:-1]:
        e=ramp.color_ramp.elements.new(p); e.color=(*c,1)
    fr=N.new('ShaderNodeMath'); fr.operation='FRACT'; Lk.new(mix.outputs[0],fr.inputs[0]); Lk.new(fr.outputs[0],ramp.inputs[0])
    # masque foil : zone illustration * (1 - points blancs)
    lum=N.new('ShaderNodeRGBToBW'); Lk.new(f.outputs['Color'],lum.inputs[0])
    inv=N.new('ShaderNodeMath'); inv.operation='SUBTRACT'; inv.inputs[0].default_value=1.0; Lk.new(lum.outputs[0],inv.inputs[1])
    mk=N.new('ShaderNodeMath'); mk.operation='MULTIPLY'; Lk.new(k.outputs['Color'],mk.inputs[0])
    if lum: Lk.new(inv.outputs[0],mk.inputs[1])
    else: mk.inputs[1].default_value=1.0
    amt=N.new('ShaderNodeMath'); amt.operation='MULTIPLY'; amt.inputs[1].default_value=holo; Lk.new(mk.outputs[0],amt.inputs[0])
    mx=N.new('ShaderNodeMix'); mx.data_type='RGBA'; Lk.new(amt.outputs[0],mx.inputs['Factor']); Lk.new(f.outputs['Color'],mx.inputs['A']); Lk.new(ramp.outputs['Color'],mx.inputs['B'])
    Lk.new(mx.outputs['Result'],b.inputs['Base Color'])
    # reflets : foil plus brillant/metallique
    mm=N.new('ShaderNodeMath'); mm.operation='MULTIPLY'; mm.inputs[1].default_value=0.45; Lk.new(mk.outputs[0],mm.inputs[0])
    Lk.new(mm.outputs[0],b.inputs['Metallic'])
    rr=N.new('ShaderNodeMath'); rr.operation='SUBTRACT'; rr.inputs[0].default_value=0.42; rr.inputs[1].default_value=0.0; Lk.new(rr.outputs[0],b.inputs['Roughness'])
    b.inputs['Coat Weight'].default_value=1.0; b.inputs['Coat Roughness'].default_value=0.05
    b.inputs['Roughness'].default_value=0.38
    Lk.new(b.outputs[0],out.inputs[0])
    return m

def back_mat():
    m=newmat('Dos'); nt=m.node_tree; N=nt.nodes; Lk=nt.links
    b=N.get('Principled BSDF'); t=img(N,TX+'card_back.png'); Lk.new(t.outputs['Color'],b.inputs['Base Color'])
    b.inputs['Roughness'].default_value=0.28; b.inputs['Coat Weight'].default_value=1.0; b.inputs['Coat Roughness'].default_value=0.06
    return m

def card(name='Carte', holo=0.5, front='card_front.png', w=0.63, h=0.88, t=0.018, s=10.0, mask='card_mask.png', lum=True):
    mf=card_mat(name+'F',holo,front,mask,lum); mb=back_mat()
    me=bpy.data.meshes.new(name); 
    bm=bmesh.new(); 
    hw,hh=w*s/2,h*s/2; tt=t*s
    # boîte fine
    v=[bm.verts.new(p) for p in [(-hw,-tt/2,-hh),(hw,-tt/2,-hh),(hw,-tt/2,hh),(-hw,-tt/2,hh),(-hw,tt/2,-hh),(hw,tt/2,-hh),(hw,tt/2,hh),(-hw,tt/2,hh)]]
    F=lambda *i: bm.faces.new([v[j] for j in i])
    ff=F(0,1,2,3)   # face avant (y-)
    fb=F(7,6,5,4)   # dos
    for i in [(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)]: F(*i).material_index=2
    ff.material_index=0; fb.material_index=1
    uv=bm.loops.layers.uv.new()
    for l,uvv in zip(ff.loops,[(0,0),(1,0),(1,1),(0,1)]): l[uv].uv=uvv
    for l,uvv in zip(fb.loops,[(0,1),(1,1),(1,0),(0,0)]): l[uv].uv=uvv
    bm.to_mesh(me); bm.free()
    edge=principled('Tranche',(0.85,0.86,0.88),rough=0.4)
    for mt in (mf,mb,edge): me.materials.append(mt)
    o=link(bpy.data.objects.new(name,me))
    bv=o.modifiers.new('B','BEVEL'); bv.width=0.035*s*0.35; bv.segments=3; bv.limit_method='ANGLE'
    for p in me.polygons: p.use_smooth=False
    return o
