from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "Photos for Codex 2" / "Codex Rooms 2" / "GS-015" / "evs-furniture-atlas-02.png"
BUCKET_SOURCE = ROOT / "Photos for Codex 2" / "Codex Rooms 2" / "GS-015" / "evs-furniture-atlas-01.png"
OUT = Path(__file__).resolve().parent
image = Image.open(SOURCE).convert("RGBA")
objects = {
    "shelf1": (image, (0, 0, 655, 652), (328, 641), "atlas02"),
    "shelf2": (image, (655, 0, 1312, 652), (980, 641), "atlas02"),
    "clutter1": (image, (0, 652, 655, 1199), (320, 1150), "atlas02"),
    "clutter2": (image, (655, 652, 1312, 1199), (975, 1150), "atlas02"),
}
bucket_image = Image.open(BUCKET_SOURCE).convert("RGBA")
objects["bucket"] = (bucket_image, (1080, 0, 1536, 1024), (1334, 954), "atlas01")
crops = {}
for name, (source_image, zone, contact, source_id) in objects.items():
    zone_image = source_image.crop(zone)
    bbox = zone_image.getbbox()
    if bbox is None:
        raise RuntimeError(f"{name} has no visible alpha")
    crop = zone_image.crop(bbox)
    crops[name] = (crop, {
        "sourceZone": list(zone),
        "sourceVisibleBounds": [zone[0] + bbox[0], zone[1] + bbox[1], zone[0] + bbox[2], zone[1] + bbox[3]],
        "ground": [contact[0] - zone[0] - bbox[0], contact[1] - zone[1] - bbox[1]],
        "sourceId": source_id,
    })

gap = 8
width = sum(crop.width for crop, _ in crops.values()) + gap * (len(crops) - 1)
height = max(crop.height for crop, _ in crops.values())
packed = Image.new("RGBA", (width, height))
metadata = {"source": str(SOURCE.relative_to(ROOT)).replace("\\", "/"), "sourceSize": list(image.size), "bucketSource": str(BUCKET_SOURCE.relative_to(ROOT)).replace("\\", "/"), "bucketSourceSize": list(bucket_image.size), "packedFrames": {}}
x = 0
for name, (crop, entry) in crops.items():
    packed.alpha_composite(crop, (x, 0))
    metadata["packedFrames"][name] = {"x": x, "y": 0, "w": crop.width, "h": crop.height, **entry}
    x += crop.width + gap
packed.save(OUT / "evs.webp", "WEBP", quality=88, method=6, exact=True)
(OUT / "evs.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
print(f"{packed.size[0]}x{packed.size[1]} {OUT / 'evs.webp'}")
