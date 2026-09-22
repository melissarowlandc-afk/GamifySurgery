from pathlib import Path
import base64
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "Photos for Codex 2" / "Codex Rooms 2" / "GS-015" / "bathroom-furniture-atlas-01.png"
OUT = Path(__file__).with_name("bathroom-assets.webp")
META = Path(__file__).with_name("atlas.json")

source = Image.open(SOURCE).convert("RGBA")
boxes = {
    "toilet": (190, 95, 530, 730),
    "sink": (735, 145, 1100, 715),
    "mirror": (465, 730, 790, 1160),
}
crops = {name: source.crop(box) for name, box in boxes.items()}
padding = 8
width = max(image.width for image in crops.values()) + 2 * padding
height = sum(image.height + padding for image in crops.values()) + padding
atlas = Image.new("RGBA", (width, height))
metadata = {}
y = padding
for name, image in crops.items():
    atlas.alpha_composite(image, (padding, y))
    metadata[name] = {"x": padding, "y": y, "w": image.width, "h": image.height}
    y += image.height + padding
atlas.save(OUT, "WEBP", quality=88, method=6, exact=True)
META.write_text(json.dumps({
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSize": list(source.size),
    "sourceBoxes": boxes,
    "atlasSize": list(atlas.size),
    "crops": metadata,
    "contacts": {
        "toilet": {"x": 164, "y": 594, "note": "non-shadow pedestal contact"},
        "sink": {"x": 180, "y": 521, "note": "non-shadow pedestal contact"},
        "alphaBoundsBottom": {"toilet": 607, "sink": 533},
    },
}, indent=2), encoding="utf-8")
print(json.dumps({"bytes": OUT.stat().st_size, "atlasSize": list(atlas.size), "crops": metadata}, indent=2))
