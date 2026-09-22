from pathlib import Path
from PIL import Image

SOURCE = Path("Photos for Codex 2/Codex Rooms 2/GS-015/examination-furniture-atlas-01.png")
OUT = Path("tools/room-design/examination-layout/examination-furniture-atlas-01.webp")
PROPS_OUT = Path("tools/room-design/examination-layout/examination-props-01.webp")
QUADRANTS = {
    "table": (0, 0, 627, 627),
    "sink": (627, 0, 1254, 627),
    "stool": (0, 627, 627, 1254),
    "diagnostic": (627, 627, 1254, 1254),
}

image = Image.open(SOURCE).convert("RGBA")
print(f"image={image.size} mode={image.mode}")
for name, box in QUADRANTS.items():
    crop = image.crop(box)
    alpha = crop.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= 32 else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError(f"{name}: no alpha>=32 pixels")
    left, top, right, bottom = bbox
    rows = []
    for y in range(max(top, bottom - 16), bottom):
        xs = [x for x in range(left, right) if alpha.getpixel((x, y)) >= 32]
        if xs:
            rows.append((y, min(xs), max(xs) + 1, len(xs)))
    print(f"{name}: bbox={bbox} bottom_rows={rows}")

image.save(OUT, "WEBP", lossless=True, method=6)
print(f"preview={OUT} bytes={OUT.stat().st_size}")

# Technical crop-only strip: exact source pixels, no resampling. The obsolete
# vertical table quadrant is omitted now that a separately authored east-head
# bed is used.
strip = Image.new("RGBA", (882, 426), (0, 0, 0, 0))
placements = {"sink": (0, 0), "stool": (322, 69), "diagnostic": (586, 88)}
for name in ("sink", "stool", "diagnostic"):
    qx0, qy0, _, _ = QUADRANTS[name]
    alpha_bbox = image.crop(QUADRANTS[name]).getchannel("A").point(
        lambda value: 255 if value >= 32 else 0
    ).getbbox()
    source_box = tuple(
        value + (qx0 if index % 2 == 0 else qy0)
        for index, value in enumerate(alpha_bbox)
    )
    strip.alpha_composite(image.crop(source_box), placements[name])
strip.save(PROPS_OUT, "WEBP", lossless=True, method=6)
print(f"props_preview={PROPS_OUT} bytes={PROPS_OUT.stat().st_size}")
