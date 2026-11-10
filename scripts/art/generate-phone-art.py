"""Offline deterministic phone derivatives of existing public project artwork.

No AI/content editing; premultiplied-alpha Lanczos resize, at most half native
resolution and 2048 pixels per side. Characters, tiled materials, frontage and
architecture retain their native sources. Runtime never decodes the originals
for these room/decor variants. --verify checks source, dimensions and pixel hashes.
"""
from pathlib import Path
from PIL import Image
import hashlib, json, sys

root = Path(__file__).resolve().parents[2]
data = json.loads((root / '.local-dev/phone-art-generation/input.json').read_text(encoding='utf-8'))
output = root / 'apps/player/public/art/phone'
output.mkdir(parents=True, exist_ok=True)
rows = {}
verify = '--verify' in sys.argv
for asset in data:
    if not asset['id'].startswith(('gs015:', 'level4:', 'level5:', 'room-touchup:')):
        continue
    if asset['nativeWidth'] * asset['nativeHeight'] < 256 * 256:
        continue
    source = root / 'apps/player/public' / asset['relativePath']
    name = hashlib.sha256(asset['id'].encode()).hexdigest()[:16] + '.png'
    relative = 'art/phone/' + name
    with Image.open(source) as original:
        original = original.convert('RGBA')
        if original.size != (asset['nativeWidth'], asset['nativeHeight']):
            raise ValueError('Source dimensions changed: ' + asset['id'])
        # Power-of-two sampling keeps authored crop boundaries aligned. PNG
        # premultiplication avoids dark fringes around translucent silhouettes.
        divisor = 2
        while max((original.width + divisor - 1) // divisor, (original.height + divisor - 1) // divisor) > 2048:
            divisor *= 2
        size = ((original.width + divisor - 1) // divisor, (original.height + divisor - 1) // divisor)
        image = original.convert('RGBa').resize(size, Image.Resampling.LANCZOS).convert('RGBA')
        target = output / name
        if verify:
            with Image.open(target) as existing:
                if existing.size != size or existing.convert('RGBA').tobytes() != image.tobytes():
                    raise ValueError('Phone derivative differs: ' + relative)
        else:
            image.save(target, optimize=True)
        rows[asset['id']] = {'path': relative, 'width': size[0], 'height': size[1],
            'sourceWidth': original.width, 'sourceHeight': original.height,
            'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
            'pixelSha256': hashlib.sha256(image.tobytes()).hexdigest()}
manifest = root / 'apps/player/src/mobile/performance/phoneArt.generated.json'
text = json.dumps(rows, indent=2, sort_keys=True) + '\n'
if verify:
    if json.loads(manifest.read_text()) != rows:
        raise ValueError('Phone derivative manifest differs')
else:
    manifest.write_text(text, encoding='utf-8')
print(json.dumps({'verified': verify, 'variants': len(rows), 'nativeRgbaBytes': sum(r['sourceWidth']*r['sourceHeight']*4 for r in rows.values()),
    'phoneRgbaBytes': sum(r['width']*r['height']*4 for r in rows.values()), 'maxSide': max(max(r['width'],r['height']) for r in rows.values())}))
