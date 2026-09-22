from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[3]
out = Path(__file__).parent / 'packed'
out.mkdir(exist_ok=True)

for source in (Path(__file__).parent / 'assets').glob('*.png'):
    image = Image.open(source).convert('RGBA')
    # Browser-review derivative only: preserves the full composition at a smaller
    # transfer size. The viewer restores all room/character geometry uniformly.
    image.save(out / f'{source.stem}.webp', 'WEBP', quality=52, method=6)

patient = root / 'artifacts' / 'character-statics' / 'gs-018-v1' / 'patients-001-010' / 'patient.adult.001'
for source in patient.glob('*.png'):
    Image.open(source).convert('RGBA').save(out / source.with_suffix('.webp').name, 'WEBP', quality=76, method=6)
