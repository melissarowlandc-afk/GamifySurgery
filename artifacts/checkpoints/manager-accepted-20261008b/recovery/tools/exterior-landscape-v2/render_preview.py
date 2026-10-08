"""Whole-site offline QA compositing of untouched existing runtime sprites.

This is a placement proof, not a browser screenshot or runtime game art. It
matches measured anchors, native proportions, tree-gap cleanup, contact order,
construction/sidewalk exclusions and the facility tile-size formula. A plainly
labelled rectangle represents the starter room; no room art is painted.
"""

import argparse
import hashlib
import json
import math
from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont, ImageOps

sys.dont_write_bytecode = True
from sources import LAYOUT_PATH, QA_PATH, ROOT, inside_site, lawn_patch_bounds, plant_bounds, source_frames

COLUMNS, ROWS = 72, 32
VIEWPORT = {"width": 920, "height": 325}
FRONT_DESK = {"x": 33, "y": 28, "width": 5, "height": 4}


def tile_size(zoom):
    north = 242 / (622 / 4)
    full = max(1, math.floor(min(VIEWPORT["width"] / COLUMNS, VIEWPORT["height"] / (ROWS + north + 1))))
    working = max(full, math.floor(min(VIEWPORT["width"] / 14, VIEWPORT["height"] / (6 + north + 1))))
    value = full + (working - full) * max(0, min(1, (zoom - 0.1) / 0.9)) if zoom <= 1 else working * zoom
    return max(1, math.floor(value + 0.5))


def intersects(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by


def visible_plants(layout, frames, tile, previous=False):
    side = (55 + 18) / (832 / 5)
    north = 242 / (622 / 4)
    south = (133 + 20) / (622 / 4)
    room = (33 - side, 28 - north, 5 + 2 * side, 4 + north + south)
    entrance = (33 + 2.5 - 0.72, ROWS - 0.35, 1.44, 0.98)
    sidewalk = (-4, ROWS, COLUMNS + 8, 4)
    plants = layout["plants"] if previous else [p for p in layout["plants"] if inside_site(plant_bounds(p, frames, 0.12), COLUMNS, ROWS)]
    return sorted([p for p in plants if not any(intersects(plant_bounds(p, frames, 0.12 + 0.5 / tile), e)
                                               for e in (room, entrance, sidewalk))], key=lambda p: (p["y"], p["x"], p["key"]))


def load_sprites(frames):
    sprites = {}
    for key, source in frames.items():
        sprite = Image.open(ROOT / source["path"]).convert("RGBA")
        if source["rect"]:
            x, y, width, height = source["rect"]
            sprite = sprite.crop((x, y, x + width, y + height))
        if key.startswith("landscape:tree-"):
            pixels = list(sprite.get_flattened_data() if hasattr(sprite,"get_flattened_data") else sprite.getdata())
            sprite.putdata([(r, g, b, 0) if a > 0 and min(r, g, b) >= 248 and max(r, g, b) - min(r, g, b) <= 5
                            else (r, g, b, a) for r, g, b, a in pixels])
        sprites[key] = sprite
    return sprites


def scaled(sprite, width, height=None):
    height = height if height is not None else width * sprite.height / sprite.width
    return sprite.resize((max(1, round(width)), max(1, round(height))), Image.Resampling.LANCZOS)


def put_at_anchor(canvas, sprite, source, x, y, width):
    scale = width / source["width"]
    canvas.alpha_composite(scaled(sprite, width), (round(x - source["anchorX"] * scale), round(y - source["anchorY"] * scale)))


def render(layout, zoom, previous, frames, sprites):
    tile, margin, header = tile_size(zoom), 28, 70
    left, top = margin, header
    canvas = Image.new("RGBA", (COLUMNS * tile + margin * 2, (ROWS + 1) * tile + header + margin), "#f5f1e8")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
    title_font = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 17)
    version = "Previous garden-cell field" if previous else "Frozen site-wide landscape v2"
    draw.text((margin, 10), f"{version} | {round(zoom * 100)}% equivalent | {tile} px/tile", font=title_font, fill="#313b30")
    detail = "Offline whole-site placement proof - 72x32 site; 920x325 tile-size fixture; DPR 1; expanded sheet, no camera crop."
    if draw.textlength(detail,font=font) <= canvas.width - margin * 2:
        draw.text((margin, 35), detail, font=font, fill="#4c5847")
    else:
        draw.text((margin, 33), "Offline 72x32 site; 920x325 tile-size fixture; DPR 1.", font=font, fill="#4c5847")
        draw.text((margin, 49), "Expanded whole-site sheet, no camera crop; original sprites.", font=font, fill="#4c5847")
    draw.rectangle((left, top, left + COLUMNS * tile - 1, top + ROWS * tile - 1), fill="#9ba187")
    for patch in layout["lawnPatches"]:
        if not inside_site(lawn_patch_bounds(patch), COLUMNS, ROWS):
            continue
        sprite = scaled(sprites[patch["assetId"]], patch["width"] * tile)
        if patch.get("flipX"):
            sprite = ImageOps.mirror(sprite)
        if patch.get("flipY"):
            sprite = ImageOps.flip(sprite)
        sprite.putalpha(sprite.getchannel("A").point(lambda alpha: round(alpha * patch["alpha"])))
        sprite = sprite.rotate(-math.degrees(patch.get("rotation", 0)), Image.Resampling.BICUBIC, expand=True)
        canvas.alpha_composite(sprite, (round(left + patch["x"] * tile - sprite.width / 2), round(top + patch["y"] * tile - sprite.height / 2)))
    plants = visible_plants(layout, frames, tile, previous)
    for plant in plants:
        put_at_anchor(canvas, sprites[plant["frameId"]], frames[plant["frameId"]],
                      left + plant["x"] * tile, top + plant["y"] * tile, plant["width"] * tile)
    paving_y = top + ROWS * tile
    material = scaled(sprites["frontage:paving-v2"], tile)
    for x in range(0, COLUMNS * tile, tile):
        canvas.alpha_composite(material, (left + x, paving_y))
    draw = ImageDraw.Draw(canvas)
    middle = paving_y + 0.44 * tile
    draw.line((left, middle, left + COLUMNS * tile, middle), fill="#b0afa1", width=1)
    for row in range(2):
        x = 1.2 if row == 0 else 0.6
        while x < COLUMNS:
            draw.line((left + x * tile, paving_y + row * 0.44 * tile,
                       left + x * tile, paving_y + (row + 1) * 0.44 * tile), fill="#b0afa1", width=1)
            x += 1.2
    # QA footprint marker only; the game continues rendering its existing room.
    draw.rectangle((left + 33 * tile, top + 28 * tile, left + 38 * tile - 1, top + 32 * tile - 1), fill="#ece5d5", outline="#696c61", width=1)
    draw.text((left + 33 * tile + 3, top + 28 * tile + 2), "Front Desk" if tile >= 15 else "FD", font=font, fill="#4c5847")
    draw.text((left + 33 * tile + 3, top + 28 * tile + 18), "QA marker" if tile >= 15 else "QA", font=font, fill="#4c5847")
    put_at_anchor(canvas, sprites["frontage:entry-inset-v2"], frames["frontage:entry-inset-v2"], left + 35 * tile, paving_y, tile)
    for side, local_x in (("west", 0.95), ("east", 4.05)):
        key = f"frontage:bed-{side}-v3"
        put_at_anchor(canvas, sprites[key], frames[key], left + (33 + local_x) * tile, paving_y + tile * 0.5, tile * 1.55)
    # Reduced curb is composited as a full band rather than introducing a
    # pixel minimum; the live integer-buffer correction is unit-tested.
    for i in range(math.ceil(COLUMNS / 1.92)):
        key = f"frontage:curb-{'a' if i % 2 == 0 else 'b'}-v2"
        sprite = scaled(sprites[key], 1.92 * tile, 0.12 * tile)
        remaining = COLUMNS * tile - round(i * 1.92 * tile)
        canvas.alpha_composite(sprite.crop((0, 0, min(sprite.width, remaining), sprite.height)),
                               (left + round(i * 1.92 * tile), round(paving_y + 0.88 * tile)))
    draw = ImageDraw.Draw(canvas)
    footer = f"{len(plants)} visible plants | Original sprites / natural ratios / contact sorting | Starter-room footprint is a labelled QA marker."
    if draw.textlength(footer,font=font) > canvas.width - margin * 2:
        footer = f"{len(plants)} visible plants | Natural ratios, contact sorting | FD = QA footprint marker."
    draw.text((margin, canvas.height - 23), footer, font=font, fill="#4c5847")
    return canvas.convert("RGB"), {"zoomPercent": round(zoom * 100), "tileSize": tile,
                                   "visiblePlants": len(plants), "size": list(canvas.size)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--previous", type=Path, help="optional captured intake data, to render the identical comparison fixture")
    parser.add_argument("--include-minimum", action="store_true", help="also inspect 10% / full-site tile-size equivalent")
    args = parser.parse_args()
    frames, layout = source_frames(), json.loads(LAYOUT_PATH.read_text(encoding="utf-8"))
    sprites, receipt = load_sprites(frames), {"layoutSha256": hashlib.sha256(LAYOUT_PATH.read_bytes()).hexdigest(),
                                            "viewportFixture": VIEWPORT, "site": {"columns": COLUMNS, "rows": ROWS},
                                            "dpr": 1, "browserCapture": False, "images": []}
    QA_PATH.mkdir(parents=True, exist_ok=True)
    versions = [("landscape-v2", layout, False)]
    if args.previous:
        versions.append(("previous", json.loads(args.previous.read_text(encoding="utf-8")), True))
    for name, data, previous in versions:
        for zoom in ((0.3, 0.7, 0.1) if args.include_minimum else (0.3, 0.7)):
            preview, metadata = render(data, zoom, previous, frames, sprites)
            output = QA_PATH / f"{name}-{round(zoom * 100)}.png"
            preview.save(output)
            metadata.update({"file": output.name, "sha256": hashlib.sha256(output.read_bytes()).hexdigest()})
            receipt["images"].append(metadata)
            print(output.name, json.dumps(metadata))
    (QA_PATH / "preview-receipt.json").write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
