# Proxy — les images d'univers

Proxy est un logiciel : il n'a jamais de corps dans ces images, et les vrais écrans passent toujours avant elles.
Une image calculée en direct par la page (« L'onde »), deux rendus 3D (Blender, Cycles) et une image générée.

## L'onde

Un lac immobile, une pluie qui tombe en grille : les 25 points de la présence. Ni photo ni fichier 3D : un fragment
shader (WebGL 1), calculé pour chaque pixel à chaque image, dans `src/components/proxy/ondeShader.ts`. Le composant
`Onde.tsx` le fait tourner dans la page (et le remplace par une image fixe si le navigateur ne peut pas).

- `onde_shot.py` — une image fixe du même shader, à n'importe quelle taille et proportion (la caméra se replace seule).
- `onde_film.py` — un film image par image : il travaille, il attend, il s'arrête.

```
# les deux images fixes de secours de la page
python3 onde_shot.py onde.png 1920 1080 work 8.84 2
python3 onde_shot.py onde-portrait.png 1080 1350 work 8.84 2
# un état précis : la croix qui tombe quand Proxy s'arrête
SINCE=9.36 python3 onde_shot.py stop.png 2160 2700 stop 10.2 2
```

## Les rendus 3D

- `studio.py` — la scène. `A` : l'ordinateur de Léa, fermé, sur fond gris pâle. `E` : le même cadre, de nuit (la seule image de l'ordinateur encore sur la page, le vendredi à 18 h). `C` : la macro du courriel de 11:17.
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
