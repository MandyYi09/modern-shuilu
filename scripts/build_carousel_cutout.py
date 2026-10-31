"""Compress the approved Doumu cutout without changing its artwork or alpha mask."""
from pathlib import Path
from PIL import Image

folder = Path(__file__).resolve().parents[1] / 'apps/web/public/paintings/carousel'
source = Image.open(folder / '438-original-cutout.png').convert('RGBA')
for width in (180, 360, 720):
    height = round(source.height * width / source.width)
    source.resize((width, height), Image.Resampling.LANCZOS).save(
        folder / f'438-cutout-{width}.webp', quality=88, method=6,
    )
