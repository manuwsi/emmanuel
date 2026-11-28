# Proxy — les images d'univers

Trois rendus 3D (Blender, Cycles) et une image générée. Le produit n'y a jamais de corps : sa présence est
la grille de 25 points de l'interface, projetée en lumière.

- `studio.py` — la scène. `A` : l'ordinateur fermé sur fond gris pâle. `E` : le même cadre, de nuit. `C` : la macro du courriel de 11:17.
- `comp.py` — le développement : la pièce et la lumière de Proxy sont rendues séparément, additionnées en linéaire, puis développées (halo, vignettage, grain).
- `export.py` — compose les passes et écrit les images dans `public/proxy/world/`.

## Refaire les images

Il faut Blender en module Python (`pip install bpy`), plus `numpy`, `opencv-python`, `OpenEXR` et `Pillow`.

```
# la pièce, sans Proxy
python3 studio.py A 2400 192 --pass=base --exr --name=F-A-base
# la lumière de Proxy, seule, un rendu par état (la zone suffit)
for s in rest work0 work1 work2 work3 wait done stop; do
  python3 studio.py A 2400 40 --pass=light --state=$s --exr --name=F-A-$s --border=0.385,0.295,0.765,0.715
done
# la nuit, et la macro
python3 studio.py E 2400 160 --pass=base --exr --name=F-E-base
python3 studio.py C 2100 160 --ar=3:2 --phi=9 --elev=40 --dist=0.40 --mrz=-4 --grz=20 --gsize=0.34 --pass=base --exr --name=F-C-base
python3 studio.py C 2100 72  --ar=3:2 --phi=9 --elev=40 --dist=0.40 --mrz=-4 --grz=20 --gsize=0.34 --pass=light --state=stop --exr --name=F-C-stop
# puis
python3 export.py
```

Pour une sortie plus grande, changer la largeur (2400) : tout le reste suit. `--blend` enregistre aussi la scène en `.blend`.

Si `export.py` annonce une autre zone de lumière (`LIGHT`, `CX`), reporter ces valeurs en tête de `src/components/proxy/World.tsx`.

Le texte du courriel de la macro est celui du prototype, mot pour mot. `fenetre.jpg` est une image générée (le prompt est dans le document de direction artistique), désaturée et grainée par `export.py`.

Les rendus `.exr` et les textures ne sont pas versionnés.
