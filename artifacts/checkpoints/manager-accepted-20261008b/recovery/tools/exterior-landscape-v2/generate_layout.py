"""Offline, versioned variable-density Poisson-disc landscape authoring.

The shipped game imports the output JSON. This program is never invoked by the
game. Random dart positions are continuous over the entire site; spatial bins
only accelerate distance queries and do not generate positions or cell motifs.
"""

import argparse
from collections import Counter, defaultdict
import hashlib
import json
import math
from pathlib import Path
import random
import sys

sys.dont_write_bytecode = True
from sources import LAYOUT_PATH, source_frames

SEED = 2026100802
COLUMNS, ROWS = 96, 64
TREES = [f"landscape:tree-{name}" for name in ("round", "open", "column", "crown")]
SHRUBS = [f"landscape:shrub-{name}" for name in ("cluster", "round", "small")]
GRASSES = [f"frontage:grass-{name}-v2" for name in ("low", "clover", "upright")]


def ellipse_distance(x, y, region):
    dx, dy = x - region["x"], y - region["y"]
    c, s = math.cos(region["rotation"]), math.sin(region["rotation"])
    return ((dx * c + dy * s) / region["radiusX"]) ** 2 + ((dy * c - dx * s) / region["radiusY"]) ** 2


class DistanceIndex:
    def __init__(self):
        self.bins = defaultdict(list)

    def add(self, x, y, radius, kind):
        self.bins[(int(x // 4), int(y // 4))].append((x, y, radius, kind))

    def nearby(self, x, y, distance=6):
        for by in range(math.floor((y - distance) / 4), math.floor((y + distance) / 4) + 1):
            for bx in range(math.floor((x - distance) / 4), math.floor((x + distance) / 4) + 1):
                yield from self.bins.get((bx, by), ())

    def clear(self, x, y, radius, kind):
        for px, py, pr, pk in self.nearby(x, y):
            # Crowns can overlap a little in groves. Mixed understory can occupy
            # the same grove without stamping the same companion pattern.
            distance = (radius + pr) * (1 if kind == pk else 0.34)
            if (x - px) ** 2 + (y - py) ** 2 < distance ** 2:
                return False
        return True

    def proximity(self, x, y, kinds, radius):
        distances = [(x - px) ** 2 + (y - py) ** 2 for px, py, _, kind in self.nearby(x, y, radius)
                     if kind in kinds]
        return math.exp(-min(distances) / radius ** 2) if distances else 0


def generate():
    rng = random.Random(SEED)
    frames = source_frames()
    # Deliberately unequal authored meadow locations, not a repeated template.
    clearings = [
        {"key": f"meadow-{i:02}", "x": x, "y": y, "radiusX": rx, "radiusY": ry, "rotation": rotation}
        for i, (x, y, rx, ry, rotation) in enumerate([
            (18, 11, 6.5, 4.2, -0.4), (48, 20, 7.5, 4.3, 0.5),
            (65, 6, 4.7, 3, -0.7), (29, 44, 8.8, 6.7, 0.8), (76, 51, 7.7, 5.8, 0.2),
        ])
    ]
    groves = []
    while len(groves) < 25:
        x, y = rng.uniform(3, COLUMNS - 3), rng.uniform(3, ROWS - 3)
        if any(ellipse_distance(x, y, clearing) < 1.1 for clearing in clearings):
            continue
        if any((x - grove["x"]) ** 2 + (y - grove["y"]) ** 2 < 9.5 ** 2 for grove in groves):
            continue
        groves.append({"key": f"site-grove-{len(groves):02}", "x": round(x, 4), "y": round(y, 4),
                       "radiusX": round(rng.uniform(3, 5.8), 4), "radiusY": round(rng.uniform(2.2, 4.5), 4),
                       "rotation": round(rng.uniform(-math.pi, math.pi), 4),
                       "strength": round(rng.uniform(0.65, 1), 4)})
    flower_pockets = []
    while len(flower_pockets) < 38:
        x, y = rng.uniform(1, COLUMNS - 1), rng.uniform(1, ROWS - 1)
        if any((x - pocket["x"]) ** 2 + (y - pocket["y"]) ** 2 < 5 ** 2 for pocket in flower_pockets):
            continue
        flower_pockets.append({"x": round(x, 4), "y": round(y, 4), "radius": round(rng.uniform(1.6, 3.6), 4)})

    def grove_at(x, y):
        return max(groves, key=lambda grove: grove["strength"] * math.exp(-ellipse_distance(x, y, grove)))

    def grove_density(x, y):
        grove = grove_at(x, y)
        return grove["strength"] * math.exp(-ellipse_distance(x, y, grove))

    def meadow_multiplier(x, y):
        q = min(ellipse_distance(x, y, clearing) for clearing in clearings)
        return 0.035 + 0.965 * max(0, min(1, (q - 0.35) / 1.1))

    def flower_density(x, y):
        return max(math.exp(-((x - p["x"]) ** 2 + (y - p["y"]) ** 2) / p["radius"] ** 2)
                   for p in flower_pockets)

    index = DistanceIndex()
    plants, attempts = [], {}
    kinds = [("tree", 430), ("shrub", 330), ("flowers", 180), ("grass", 380)]
    for kind, count in kinds:
        accepted, trial = 0, 0
        while accepted < count and trial < 180_000:
            trial += 1
            # Uniform continuous site-wide darts, then a smooth density gate.
            cx, cy = rng.uniform(0, COLUMNS), rng.uniform(0, ROWS)
            grove = grove_density(cx, cy)
            meadow = meadow_multiplier(cx, cy)
            if kind == "tree":
                density = (0.12 + 0.88 * grove) * meadow
                draw = rng.random()
                width = rng.uniform(0.65, 0.95) if draw < 0.1 else rng.uniform(2.25, 2.65) if draw > 0.88 else rng.uniform(0.95, 2.25)
                frame_id, radius = rng.choice(TREES), width * 0.43 + 0.1
            elif kind == "shrub":
                density = (0.1 + 0.5 * grove + 0.4 * index.proximity(cx, cy, {"tree"}, 2.4)) * meadow
                width = rng.uniform(0.45, 1.5)
                frame_id, radius = rng.choice(SHRUBS), width * 0.52 + 0.06
            elif kind == "flowers":
                density = 0.045 + 0.8 * flower_density(cx, cy) + 0.15 * index.proximity(cx, cy, {"shrub"}, 1.6)
                width = rng.uniform(0.72, 1.28)
                color = "yellow" if cy < 12 and rng.random() < 0.09 else rng.choice(["white", "pink"])
                frame_id, radius = f"landscape:flowers-{color}", width * 0.61 + 0.05
            else:
                density = 0.26 + 0.4 * grove + 0.34 * (1 - meadow)
                width = rng.uniform(0.26, 0.82)
                frame_id, radius = rng.choice(GRASSES), width * 0.51 + 0.06
            if rng.random() > density or not index.clear(cx, cy, radius, kind):
                continue
            source = frames[frame_id]
            height = width * source["height"] / source["width"]
            if cx - width / 2 < 0.2 or cx + width / 2 > COLUMNS - 0.2 or cy - height / 2 < 0.2 or cy + height / 2 > ROWS - 0.2:
                continue
            contact_x = cx - width / 2 + source["anchorX"] * width / source["width"]
            contact_y = cy - height / 2 + source["anchorY"] * width / source["width"]
            grove = grove_at(cx, cy)
            key = f"site-landscape-{kind}-{accepted:04}"
            plants.append({"key": key, "groupKey": grove["key"] if ellipse_distance(cx, cy, grove) < 1.8 else key,
                           "frameId": frame_id, "x": round(contact_x, 4), "y": round(contact_y, 4), "width": round(width, 4)})
            index.add(cx, cy, radius, kind)
            accepted += 1
        if accepted != count:
            raise RuntimeError(f"Could not fit {count} {kind} placements: {accepted}")
        attempts[kind] = trial

    patches, patch_index, trial = [], DistanceIndex(), 0
    while len(patches) < 95 and trial < 30_000:
        trial += 1
        x, y = rng.uniform(0, COLUMNS), rng.uniform(0, ROWS)
        width, angle = rng.uniform(4.3, 13.5), rng.uniform(-1.35, 1.35)
        half_w = (abs(math.cos(angle)) * width + abs(math.sin(angle)) * width / 2) / 2
        half_h = (abs(math.sin(angle)) * width + abs(math.cos(angle)) * width / 2) / 2
        if x - half_w < 0 or x + half_w > COLUMNS or y - half_h < 0 or y + half_h > ROWS:
            continue
        if not patch_index.clear(x, y, width * 0.2, "lawn") or rng.random() > 0.45 + 0.55 * grove_density(x, y):
            continue
        patches.append({"key": f"frontage:lawn:site-{len(patches):03}",
                        "assetId": rng.choice(["frontage:lawn-sage-v2", "frontage:lawn-olive-v2"]),
                        "x": round(x, 4), "y": round(y, 4), "width": round(width, 4),
                        "alpha": round(rng.uniform(0.16, 0.32), 4), "rotation": round(angle, 4),
                        "flipX": rng.random() < 0.5, "flipY": rng.random() < 0.5})
        patch_index.add(x, y, width * 0.2, "lawn")
    if len(patches) != 95:
        raise RuntimeError("Could not fit lawn overlays")
    return {
        "schemaVersion": 2,
        "layoutId": "exterior-site-landscape-v2-20261008",
        "site": {"columns": COLUMNS, "rows": ROWS},
        "generator": {"path": "tools/exterior-landscape-v2/generate_layout.py", "seed": SEED,
                      "algorithm": "continuous site-wide variable-density Poisson-disc darts; irregular elliptical groves/meadows; independent species layers",
                      "runtimeGeneration": False, "attempts": attempts},
        "groves": groves, "clearings": clearings, "flowerPockets": flower_pockets,
        "plants": plants, "lawnPatches": patches,
    }


def encoded_layout():
    return (json.dumps(generate(), indent=2, ensure_ascii=False) + "\n").encode("utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="reproduce in memory and verify frozen bytes; do not write")
    parser.add_argument("--output", type=Path, default=LAYOUT_PATH)
    args = parser.parse_args()
    content = encoded_layout()
    if args.check:
        if args.output.read_bytes() != content:
            raise SystemExit("Frozen layout differs from the versioned generator")
        print("PASS: frozen layout reproduced byte-for-byte.")
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_bytes(content)
        print("Wrote", args.output)
    result = json.loads(content)
    print(json.dumps({"plants": len(result["plants"]), "lawnPatches": len(result["lawnPatches"]),
                      "species": dict(sorted(Counter(p["frameId"] for p in result["plants"]).items())),
                      "sha256": hashlib.sha256(content).hexdigest()}, indent=2))
