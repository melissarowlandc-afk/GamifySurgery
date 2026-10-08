"""Independent whole-site density and axis-autocorrelation inspection."""

import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import statistics
import sys

sys.dont_write_bytecode = True
from sources import LAYOUT_PATH, QA_PATH, inside_site, lawn_patch_bounds, plant_bounds, source_frames


def density_autocorrelation(points, columns, rows):
    """Pearson correlation of 0.5-tile density bins, shifted 3..16 tiles.

    Short-range Poisson spacing and deliberate groves are allowed. A repeated
    garden/patch lattice produces positive peaks at its period and multiples.
    Positions do not get snapped by the game: bins exist only for this audit.
    """
    width, height = columns * 2, rows * 2
    grid = [[0 for _ in range(width)] for _ in range(height)]
    for point in points:
        x, y = int(point["x"] * 2), int(point["y"] * 2)
        if 0 <= x < width and 0 <= y < height:
            grid[y][x] += 1
    result = {}
    for axis in ("x", "y"):
        profile = []
        for shift in range(6, 33):
            pairs = [(grid[y][x], grid[y + (shift if axis == "y" else 0)][x + (shift if axis == "x" else 0)])
                     for y in range(height - (shift if axis == "y" else 0))
                     for x in range(width - (shift if axis == "x" else 0))]
            left_mean = sum(a for a, _ in pairs) / len(pairs)
            right_mean = sum(b for _, b in pairs) / len(pairs)
            numerator = sum((a - left_mean) * (b - right_mean) for a, b in pairs)
            denominator = math.sqrt(sum((a - left_mean) ** 2 for a, _ in pairs) * sum((b - right_mean) ** 2 for _, b in pairs))
            profile.append({"lagTiles": shift / 2, "correlation": round(numerator / denominator if denominator else 0, 6)})
        result[axis] = profile
    return result


def audit(layout, columns=72, rows=32):
    frames = source_frames()
    plants = [plant for plant in layout["plants"] if inside_site(plant_bounds(plant, frames, 0.12), columns, rows)]
    sectors = [sum(x <= p["x"] < min(columns, x + 8) and y <= p["y"] < min(rows, y + 8) for p in plants)
               for y in range(0, rows, 8) for x in range(0, columns, 8)]
    acf = density_autocorrelation(plants, columns, rows)
    patches = [patch for patch in layout["lawnPatches"] if inside_site(lawn_patch_bounds(patch), columns, rows)]
    lawn_acf = density_autocorrelation(patches, columns, rows)
    return {"site": {"columns": columns, "rows": rows}, "plants": len(plants),
            "species": dict(sorted(Counter(plant["frameId"] for plant in plants).items())),
            "densityPerTile": round(len(plants) / (columns * rows), 6),
            "eightTileSectors": {"counts": sectors, "minimum": min(sectors), "maximum": max(sectors),
                                 "coefficientOfVariation": round(statistics.pstdev(sectors) / statistics.mean(sectors), 6)},
            "densityAutocorrelation": acf,
            "maxAxisCorrelation": max(p["correlation"] for axis in acf.values() for p in axis),
            "lawnPatches": len(patches), "lawnDensityAutocorrelation": lawn_acf,
            "maxLawnAxisCorrelation": max(p["correlation"] for axis in lawn_acf.values() for p in axis)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--layout", type=Path, default=LAYOUT_PATH)
    parser.add_argument("--output", type=Path, default=QA_PATH / "layout-audit.json")
    args = parser.parse_args()
    content = args.layout.read_bytes()
    result = {"layoutSha256": hashlib.sha256(content).hexdigest(),
              "activeSite": audit(json.loads(content)),
              "fullField": audit(json.loads(content), 96, 64)}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    for key in ("activeSite", "fullField"):
        summary = {name: result[key][name] for name in ("plants", "lawnPatches", "densityPerTile", "maxAxisCorrelation", "maxLawnAxisCorrelation")}
        print(key, json.dumps(summary))
