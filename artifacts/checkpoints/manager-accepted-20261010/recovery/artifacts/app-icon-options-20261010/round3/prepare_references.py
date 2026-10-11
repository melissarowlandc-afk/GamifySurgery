"""Prepare local game-art references and a preservation baseline for Round 3."""
from pathlib import Path
from hashlib import sha256
import json
import shutil

from PIL import Image

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
PRIOR = ROOT.parent
REF = ROOT / "receipts" / "references"


def digest(path):
    return sha256(path.read_bytes()).hexdigest()


def write_json(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def sprite(path, rect=None):
    im = Image.open(REPO / path).convert("RGBA")
    if rect:
        im = im.crop(rect)
    # The approved atlases contain isolated low-alpha specks outside props.
    alpha = im.getchannel("A").point(lambda v: 0 if v < 64 else v)
    im.putalpha(alpha)
    bounds = alpha.getbbox()
    return im.crop(bounds) if bounds else im


def paste_fit(board, im, box):
    x, y, w, h = box
    ratio = min(w / im.width, h / im.height)
    im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.Resampling.NEAREST)
    board.paste(im, (x + (w - im.width) // 2, y + (h - im.height) // 2), im)


def main():
    for directory in (REF, ROOT / "icons", ROOT / "preview-60", ROOT / "receipts" / "generated", ROOT / "receipts" / "tool"):
        directory.mkdir(parents=True, exist_ok=True)

    baseline_path = ROOT / "receipts" / "preservation-baseline.json"
    if not baseline_path.exists():
        prior_files = {
            p.relative_to(REPO).as_posix(): digest(p)
            for p in sorted(PRIOR.rglob("*"))
            if p.is_file() and ROOT not in p.parents
        }
        source_paths = [
            "apps/player/public/art/environment/clinic-environment-atlas-v1.png",
            "apps/player/public/art/environment/clinic-landscaping-atlas-v1.png",
            "apps/player/public/art/environment/frontage-v2/bed-west-v3.png",
            "apps/player/public/art/environment/frontage-v2/bed-east-v3.png",
            "apps/player/public/art/environment/frontage-v2/paving-v2.png",
            "apps/player/public/art/environment/frontage-v2/curb-a-v2.png",
            "apps/player/public/art/environment/frontage-v2/entry-inset-v2.png",
            "apps/player/public/art/rooms/front-desk-v4/front-desk-shell-v4.png",
            "apps/player/public/art/rooms/front-desk-v2/front-desk-components-v2.png",
            "apps/player/src/styles/tokens.css",
            "apps/player/src/ui/OpeningSequence.tsx",
            "apps/player/src/ui/OpeningSequence.css",
            "apps/player/src/art/bitmapAssetManifest.ts",
            "apps/player/src/facility/frontDeskPresentation.ts",
            "apps/player/src/facility/exteriorFrontage.ts",
        ]
        sources = {p: digest(REPO / p) for p in source_paths}
        write_json(baseline_path, {"prior_round_files": prior_files, "studied_game_sources": sources})
        print(f"Preservation baseline: {len(prior_files)} prior-round files, {len(sources)} game sources")

    env = "apps/player/public/art/environment/clinic-environment-atlas-v1.png"
    frontage = "apps/player/public/art/environment/frontage-v2/"
    exterior = Image.new("RGB", (1024, 768), "#f4e9cf")
    placements = [
        (env, (91, 108, 337, 273), (45, 35, 410, 250), "approved cream wall and deep-green posts"),
        (env, (88, 376, 321, 577), (558, 25, 390, 280), "approved doorway trim"),
        (frontage + "paving-v2.png", None, (65, 318, 255, 155), "warm stone sidewalk"),
        (frontage + "entry-inset-v2.png", None, (385, 337, 330, 115), "cream entry inset"),
        (frontage + "curb-a-v2.png", None, (90, 486, 844, 54), "front curb"),
        (frontage + "bed-west-v3.png", None, (30, 550, 470, 180), "approved west flower bed"),
        (frontage + "bed-east-v3.png", None, (522, 550, 470, 180), "approved east flower bed"),
    ]
    for path, rect, box, _ in placements:
        paste_fit(exterior, sprite(path, rect), box)
    exterior_path = REF / "approved-frontage-materials.png"
    exterior.save(exterior_path)

    room_path = PRIOR / "round2" / "receipts" / "references" / "front-desk-approved-composition.png"
    copied_room = REF / "front-desk-approved-composition.png"
    shutil.copyfile(room_path, copied_room)
    interior = Image.new("RGB", (1024, 1024), "#f4e9cf")
    room = Image.open(copied_room).convert("RGB").resize((560, 560), Image.Resampling.NEAREST)
    interior.paste(room, (232, 5))
    atlas = "apps/player/public/art/rooms/front-desk-v2/front-desk-components-v2.png"
    furniture = [
        (atlas, (476, 78, 996, 392), (155, 620, 615, 340), "cream-topped deep-teal desk with computer and phone"),
        (atlas, (1064, 184, 1215, 508), (812, 568, 178, 400), "blue water cooler"),
        (atlas, (48, 19, 257, 393), (25, 360, 174, 311), "green cabinet and white plant pot"),
        (atlas, (651, 439, 764, 542), (40, 756, 122, 122), "cream clock with dark rim"),
    ]
    for path, rect, box, _ in furniture:
        paste_fit(interior, sprite(path, rect), box)
    interior_path = REF / "approved-front-desk-interior.png"
    interior.save(interior_path)
    write_json(ROOT / "receipts" / "reference-provenance.json", {
        "purpose": "Reference boards only; all final storefront concepts use built-in image generation.",
        "exterior_note": "The current game frontage comprises wall, doorway, paving, curb and flower-bed assets. A front elevation, outward-open door and optional awning are new concept interpretations requested by the owner.",
        "interior_note": "Top-down room is copied unchanged from the Round 2 composition of the approved v4 room shell and approved in-game furniture. The model must translate this into a front view through the doorway.",
        "reference_boards": [
            {"path": exterior_path.relative_to(ROOT).as_posix(), "sha256": digest(exterior_path), "sources": [{"source": p, "crop_xyxy": r, "board_box_xywh": b, "role": role} for p, r, b, role in placements]},
            {"path": interior_path.relative_to(ROOT).as_posix(), "sha256": digest(interior_path), "room_reference": copied_room.relative_to(ROOT).as_posix(), "sources": [{"source": p, "crop_xyxy": r, "board_box_xywh": b, "role": role} for p, r, b, role in furniture]},
        ],
        "room_composition_recipe": "../round2/receipts/front-desk-composition.json",
        "room_composition_sha256": digest(copied_room),
        "earlier_concept_inspected": "../icons/04-clinic-facade.png; framing inspiration only, not a palette reference",
    })
    print("Prepared two actual-game reference boards and an unchanged room reference")


if __name__ == "__main__":
    main()
