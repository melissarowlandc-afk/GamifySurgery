from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "Photos for Codex 2" / "Codex Rooms 2" / "GS-015" / "waiting-furniture-atlas-01.png"
OUT = Path(__file__).with_name("waiting-assets.webp")
META = Path(__file__).with_name("atlas.json")

regions = {
    "bench": (0, 0, 690, 450),
    "chairEast": (700, 0, 1226, 460),
    "chairWest": (0, 450, 580, 880),
    "table": (580, 450, 1226, 875),
    "rack": (0, 875, 700, 1283),
    "plant": (700, 875, 1226, 1283),
}

source = Image.open(SOURCE).convert("RGBA")
crops = {}
for name, region in regions.items():
    image = source.crop(region)
    alpha = image.getchannel("A").point(lambda value: 255 if value >= 32 else 0)
    bbox = alpha.getbbox()
    if bbox is None:
        raise RuntimeError(f"No visible pixels in {name}")
    pad = 3
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(image.width, bbox[2] + pad)
    bottom = min(image.height, bbox[3] + pad)
    crops[name] = image.crop((left, top, right, bottom))

padding = 8
width = max(image.width for image in crops.values()) + padding * 2
height = sum(image.height + padding for image in crops.values()) + padding
atlas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
metadata = {}
y = padding
for name, image in crops.items():
    x = padding
    atlas.alpha_composite(image, (x, y))
    metadata[name] = {"x": x, "y": y, "w": image.width, "h": image.height}
    y += image.height + padding

atlas.save(OUT, "WEBP", quality=88, method=6, exact=True)
META.write_text(json.dumps({"source": str(SOURCE.relative_to(ROOT)), "sourceSize": list(source.size), "alphaThreshold": 32, "padding": padding, "atlasSize": list(atlas.size), "crops": metadata}, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT), "bytes": OUT.stat().st_size, "atlasSize": list(atlas.size), "crops": metadata}, indent=2))
