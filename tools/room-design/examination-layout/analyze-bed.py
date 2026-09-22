from pathlib import Path
from PIL import Image

SOURCE = Path("Photos for Codex 2/Codex Rooms 2/GS-015/examination-bed-east-02.png")
OUT = Path("tools/room-design/examination-layout/examination-bed-east-02.webp")

image = Image.open(SOURCE).convert("RGBA")
alpha = image.getchannel("A")
print(f"image={image.size} mode={image.mode}")
for threshold in (32, 128, 200, 240):
    mask = alpha.point(lambda value, threshold=threshold: 255 if value >= threshold else 0)
    print(f"alpha>={threshold}: bbox={mask.getbbox()}")

# The source-body contact uses the opaque feet/plinth, excluding the broad
# semitransparent cast shadow. Report runs near the opaque lower edge.
solid = alpha.point(lambda value: 255 if value >= 200 else 0)
left, top, right, bottom = solid.getbbox()
rows = []
for y in range(max(top, bottom - 20), bottom):
    xs = [x for x in range(left, right) if alpha.getpixel((x, y)) >= 200]
    if xs:
        rows.append((y, min(xs), max(xs) + 1, len(xs)))
print(f"solid_bottom_rows={rows}")

body_box = solid.getbbox()
image.crop(body_box).save(OUT, "WEBP", lossless=True, method=6)
print(f"body_box={body_box}")
print(f"preview={OUT} bytes={OUT.stat().st_size}")
