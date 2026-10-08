"""Promote the approved Radiology Reading Room art to the runtime.

Approved proof: ../proof/radiology-reading-proof.html
(SHA256 D574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB,
approval receipt ../approval-2026-10-07.md).

The proof draws the island and chairs through `brightness(.64) saturate(.80)`,
its readers through `brightness(.66)`, then shades the floor area by 15%.
Owner direction (2026-10-07): the room is always dim and so are the people in
it. The game therefore bakes only the saturation here and applies the
combined brightness (.64 x .85 = .544) as one runtime multiply over the floor
area, which darkens furniture and seated readers equally.
Processed sources stay untouched.

Run: python -I prepare-runtime-assets.py
"""
import hashlib
import json
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(HERE, "..", "proof", "processed-assets")
OUT = os.path.join(HERE, "..", "..", "..", "..", "..", "apps", "player", "public", "art", "rooms", "level3-v1", "radiology-reading")
FILES = ["island.webp", "chair-northwest.webp", "chair-northeast.webp", "chair-southeast.webp", "chair-southwest.webp"]
BRIGHTNESS, SATURATE = 1.0, .80


def css_filter(image: Image.Image) -> Image.Image:
    s = SATURATE
    m = [
        (0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s),
        (0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s),
        (0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s),
    ]
    rgba = image.convert("RGBA")
    out = []
    for r, g, b, a in rgba.getdata():
        r, g, b = r * BRIGHTNESS, g * BRIGHTNESS, b * BRIGHTNESS
        nr = m[0][0] * r + m[0][1] * g + m[0][2] * b
        ng = m[1][0] * r + m[1][1] * g + m[1][2] * b
        nb = m[2][0] * r + m[2][1] * g + m[2][2] * b
        out.append((max(0, min(255, round(nr))), max(0, min(255, round(ng))), max(0, min(255, round(nb))), a))
    result = Image.new("RGBA", rgba.size)
    result.putdata(out)
    return result


def sha(path: str) -> str:
    with open(path, "rb") as handle:
        return hashlib.sha256(handle.read()).hexdigest().upper()


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    manifest = {"approvedProofSha256": "D574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB", "filter": "saturate(.80); brightness applied at runtime", "files": {}}
    for name in FILES:
        source = os.path.join(SOURCE, name)
        target = os.path.join(OUT, name)
        image = Image.open(source)
        css_filter(image).save(target, "WEBP", lossless=True)
        manifest["files"][name] = {"source": sha(source), "runtime": sha(target), "size": list(image.size)}
    with open(os.path.join(HERE, "runtime-assets-manifest.json"), "w") as handle:
        json.dump(manifest, handle, indent=1)
    print("wrote", len(FILES), "files to", os.path.normpath(OUT))


if __name__ == "__main__":
    main()
