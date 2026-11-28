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
# les images fixes de secours de la page : la vue large (écran large, téléphone) et la vue de près
python3 onde_shot.py onde.png 1920 1080 work 8.84 2
python3 onde_shot.py onde-portrait.png 1080 1350 work 8.84 2
VIEW=close python3 onde_shot.py onde-detail.png 900 900 work 8.84 2
# un état précis : la croix qui tombe quand Proxy s'arrête
SINCE=9.36 python3 onde_shot.py stop.png 2160 2700 stop 10.2 2
```

## Les rendus 3D

- `studio.py` — la scène. `E` : l'ordinateur de Léa, fermé, de nuit, petit dans le cadre (la seule image de l'ordinateur sur la page, le vendredi à 18 h). `C` : la macro du courriel de 11:17. `A`, le même ordinateur de jour, n'est plus utilisé par la page.
- `comp.py` — le développement : la pièce et la lumière de Proxy sont rendues séparément, additionnées en linéaire, puis développées (halo, vignettage, grain).
- `export.py` — compose les passes et écrit les images dans `public/proxy/world/`.

## Refaire les images

Il faut Blender en module Python (`pip install bpy`), plus `numpy`, `opencv-python`, `OpenEXR` et `Pillow`.

```
# la nuit, vue de loin (4:5) : la pièce, puis la lumière seule, pour la grille et pour le point qui reste
python3 studio.py E 1400 160 --ar=4:5 --dist=1.9 --lens=50 --elev=24 --lx=0.10 --ly=0.25 --pass=base --exr --name=W-E-base
for s in work0 done; do
  python3 studio.py E 1400 48 --ar=4:5 --dist=1.9 --lens=50 --elev=24 --lx=0.10 --ly=0.25 --pass=light --state=$s --exr --name=W-E-$s --border=0.12,0.33,0.58,0.56
done
# la macro du courriel
python3 studio.py C 2100 160 --ar=3:2 --phi=9 --elev=40 --dist=0.40 --mrz=-4 --grz=20 --gsize=0.34 --pass=base --exr --name=F-C-base
python3 studio.py C 2100 72  --ar=3:2 --phi=9 --elev=40 --dist=0.40 --mrz=-4 --grz=20 --gsize=0.34 --pass=light --state=stop --exr --name=F-C-stop
# puis
python3 export.py
```

Pour une sortie plus grande, changer la largeur (1400, 2100) : tout le reste suit. `--blend` enregistre aussi la scène en `.blend`.

Le texte du courriel de la macro est celui du prototype, mot pour mot.

`fenetre.jpg`, `piano.jpg` et `fil.jpg` sont des images générées (1536 × 864, une génération chacune ; les prompts sont dans le document de direction artistique). `export.py` les fait entrer dans la série : même neutre froid, noirs arrêtés à l'encre, même grain. Sur `fil.jpg`, le fil est ramené à l'orange du produit (#C9461F). Les fichiers source sont à poser dans `gen/` (`train-1.png`, `piano-1.jpg`, `fil-1.jpg`). `python3 export.py buee` développe aussi la vitre embuée, gardée en réserve et absente de la page.

Les rendus `.exr` et les textures ne sont pas versionnés.
