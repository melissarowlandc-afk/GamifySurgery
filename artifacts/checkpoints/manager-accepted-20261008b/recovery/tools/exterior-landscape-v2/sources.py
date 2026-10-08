"""Read existing runtime sprite measurements; never repaint or export game art."""

from pathlib import Path
import math
import re

ROOT = Path(__file__).resolve().parents[2]
LAYOUT_PATH = ROOT / "apps/player/src/facility/data/exterior-landscape-v2.json"
QA_PATH = ROOT / "docs/design/exterior-frontage/qa-20261008/landscape-v2"
MANIFEST_PATH = ROOT / "apps/player/src/art/bitmapAssetManifest.ts"


def source_frames():
    text = MANIFEST_PATH.read_text(encoding="utf-8")
    frames = {}
    for match in re.finditer(
        r'"(landscape:[\w-]+)": landscapingFrame\("[^"]+", '
        r'\{ x: (\d+), y: (\d+), width: (\d+), height: (\d+) \}', text
    ):
        key, x, y, width, height = match.groups()
        width, height = int(width), int(height)
        frames[key] = {
            "path": "apps/player/public/art/environment/clinic-landscaping-atlas-v1.png",
            "rect": [int(x), int(y), width, height],
            "width": width, "height": height,
            "anchorX": width / 2, "anchorY": height,
        }
    for match in re.finditer(
        r'frontageAsset\("(frontage:[\w-]+)", (\d+), (\d+), '
        r'\{ x: ([\d.]+), y: ([\d.]+) \}', text
    ):
        key, width, height, anchor_x, anchor_y = match.groups()
        frames[key] = {
            "path": f"apps/player/public/art/environment/frontage-v2/{key[9:]}.png",
            "rect": None, "width": int(width), "height": int(height),
            "anchorX": float(anchor_x), "anchorY": float(anchor_y),
        }
    return frames


def plant_bounds(plant, frames, padding=0):
    source = frames[plant["frameId"]]
    scale = plant["width"] / source["width"]
    return (
        plant["x"] - source["anchorX"] * scale - padding,
        plant["y"] - source["anchorY"] * scale - padding,
        plant["width"] + 2 * padding,
        source["height"] * scale + 2 * padding,
    )


def inside_site(bounds, columns, rows):
    x, y, width, height = bounds
    return x >= 0 and y >= 0 and x + width <= columns and y + height <= rows


def lawn_patch_bounds(patch):
    width, height = patch["width"], patch["width"] / 2
    c, s = abs(math.cos(patch.get("rotation", 0))), abs(math.sin(patch.get("rotation", 0)))
    w, h = width * c + height * s, width * s + height * c
    return patch["x"] - w / 2, patch["y"] - h / 2, w, h
