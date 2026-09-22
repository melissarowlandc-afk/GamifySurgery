from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "Photos for Codex 2" / "Codex Rooms 2" / "GS-015" / "front-desk-upkeep-atlas-01.png"
OUT = Path(__file__).with_name("front-desk-upkeep-preview.webp")
META = Path(__file__).with_name("upkeep-atlas.json")

source = Image.open(SOURCE).convert("RGBA")
# The two cooler states use equal-size, baseline-registered crops. The litter
# crops follow alpha>=32 bounds with a 12-pixel source pad.
crops = {
    "full": source.crop((220, 110, 514, 820)),
    "empty": source.crop((627 + 140, 110, 627 + 434, 820)),
    "litterD1": source.crop((190, 850 + 126, 544, 850 + 318)),
    "litterB4": source.crop((627 + 142, 850 + 126, 627 + 460, 850 + 318)),
}

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

atlas.save(OUT, "WEBP", quality=82, method=6, exact=True)
META.write_text(json.dumps({
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSize": list(source.size),
    "alphaThreshold": 32,
    "coolerRegistration": {
        "fullCrop": [220, 110, 514, 820],
        "emptyCrop": [767, 110, 1061, 820],
        "base": {"left": 47, "right": 250, "bottom": 700},
        "note": "Both states share crop dimensions and base registration; the floor footprint remains the accepted A5 footprint."
    },
    "atlasSize": list(atlas.size),
    "crops": metadata,
}, indent=2), encoding="utf-8")
print(json.dumps({"bytes": OUT.stat().st_size, "atlasSize": list(atlas.size), "crops": metadata}, indent=2))
