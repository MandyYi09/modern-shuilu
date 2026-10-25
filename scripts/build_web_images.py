# Run with Python 3 and Pillow after updating source artwork.
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
pub=root/'apps/web/public/paintings'
# Display derivatives only; original and print assets stay intact.
for folder,source,edge,quality in [('display','original',1200,80),('character-thumb','character-web',180,76)]:
    (pub/folder).mkdir(exist_ok=True)
    for path in (pub/source).glob('*.webp'):
        image=Image.open(path); image.thumbnail((edge,edge),Image.Resampling.LANCZOS)
        image.save(pub/folder/path.name,'WEBP',quality=quality,method=6)
regions=json.loads((root/'apps/web/src/lib/detail-regions.json').read_text())
(pub/'detail').mkdir(exist_ok=True)
for id,clues in regions.items():
    original=Image.open(pub/'original'/f'{id}.webp')
    for clue,(x,y,w,h) in clues.items():
        W,H=original.size
        crop=original.crop((round(x*W),round(y*H),round((x+w)*W),round((y+h)*H)))
        crop.thumbnail((480,480),Image.Resampling.LANCZOS)
        crop.save(pub/'detail'/f'{id}-{clue}.webp','WEBP',quality=84,method=6)
