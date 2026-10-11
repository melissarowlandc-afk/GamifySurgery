"""Reproducible local post-processing for the 2026-10-10 icon concepts.
Uses installed Pillow only. All writes stay inside this artifact directory.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
PALETTE = [
    "#232720", "#30342d", "#35382f", "#4c5449", "#666d60",
    "#7e8476", "#999e91", "#b6b9aa", "#cac8bb", "#d8d7cb",
    "#e0ded0", "#e8e7d6", "#f0eddd", "#faf7e8", "#fffdf4",
    "#3f5949",
]


def rgb(value: str) -> tuple[int, int, int]:
    return tuple(bytes.fromhex(value.lstrip("#")))


def write_json(path: Path, value: object) -> None:
    path.resolve().relative_to(ROOT)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def options() -> list[dict]:
    return json.loads((ROOT / "options.json").read_text(encoding="utf-8"))


def prepare() -> None:
    for name in ("icons", "preview-60", "receipts/generated", "receipts/references"):
        (ROOT / name).mkdir(parents=True, exist_ok=True)
    source = REPO / "apps/player/public/art/characters/founders-v4/founders-portrait-v4.png"
    with Image.open(source) as atlas:
        founder = atlas.convert("RGBA").crop((400, 0, 512, 176))
    background = Image.new("RGBA", founder.size, rgb("#4c5449") + (255,))
    background.alpha_composite(founder)
    background.convert("RGB").save(ROOT / "receipts/references/rounds-doctor-approved.png")
    background.resize((448, 704), Image.Resampling.NEAREST).convert("RGB").save(
        ROOT / "receipts/references/rounds-doctor-approved-enlarged.png"
    )
    refs = [
        "apps/player/public/art/characters/founders-v4/founders-portrait-v4.png",
        "apps/player/public/art/characters/founders-v4/manifest.json",
        "apps/player/public/art/environment/clinic-environment-atlas-v1.png",
        "apps/player/public/art/rooms/level-1-v1/examination-fixtures-v1.png",
        "apps/player/src/ui/OpeningSequence.tsx",
        "apps/player/src/ui/OpeningSequence.css",
        "apps/player/src/styles/tokens.css",
        "apps/player/src/styles/global.css",
        "apps/player/src/content/founderAppearancePresets.ts",
    ]
    write_json(ROOT / "receipts/reference-hashes.json", [
        {"path": name, "sha256": digest(REPO / name)} for name in refs
    ])
    print("Prepared approved founder crop and read-only reference hashes.")


def palette_image() -> Image.Image:
    palette = Image.new("P", (1, 1))
    colors = [rgb(value) for value in PALETTE]
    colors += [colors[0]] * (256 - len(colors))
    palette.putpalette([channel for color in colors for channel in color])
    return palette


def clean_clock_backdrop(drawing: Image.Image, background: tuple[int, int, int]) -> int:
    """Remove disconnected generator speckles outside the single clock silhouette."""
    pixels = drawing.load()
    foreground = {(x, y) for y in range(drawing.height) for x in range(drawing.width)
                  if pixels[x, y] != background}
    components = []
    remaining = set(foreground)
    while remaining:
        start = remaining.pop()
        component, queue = {start}, [start]
        while queue:
            x, y = queue.pop()
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    neighbor = (x + dx, y + dy)
                    if neighbor in remaining:
                        remaining.remove(neighbor)
                        component.add(neighbor)
                        queue.append(neighbor)
        components.append(component)
    keep = max(components, key=len)
    removed = foreground - keep
    for point in removed:
        pixels[point] = background
    return len(removed)


def ingest(number: int, source: Path) -> None:
    option = next(item for item in options() if item["number"] == number)
    stem = f'{number:02d}-{option["slug"]}'
    raw_path = ROOT / f"receipts/generated/{stem}.png"
    with Image.open(source) as source_image:
        original_size, original_mode = source_image.size, source_image.mode
        rgba = source_image.convert("RGBA")
        flat = Image.new("RGBA", rgba.size, (240, 237, 221, 255))
        flat.alpha_composite(rgba)
        original = flat.convert("RGB")
        raw_path.write_bytes(source.read_bytes())
    prompts = json.loads((ROOT / "receipts/prompts.json").read_text(encoding="utf-8"))
    spec = next(item for item in prompts if item["number"] == number)
    marker = "Scene/backdrop: flat opaque "
    background_hex = spec["prompt"].split(marker)[1].split(",")[0]
    background_rgb = rgb(background_hex)
    # A 52px drawing on a 64px canvas gives a safe central 81.25% envelope.
    # Preserve the full generated subject; no crop or redraw. Nearest-neighbor
    # sampling retains the founder's eye highlights better than BOX averaging.
    sampling = Image.Resampling.NEAREST if number == 8 else Image.Resampling.BOX
    drawing = original.resize((52, 52), sampling)
    if number == 8:
        drawing = drawing.quantize(colors=32, method=Image.Quantize.MEDIANCUT,
                                  dither=Image.Dither.NONE).convert("RGB")
    else:
        drawing = drawing.quantize(palette=palette_image(),
                                  dither=Image.Dither.NONE).convert("RGB")
    # Generated flat backgrounds may have slight color noise. Snap only pixels
    # very close to the requested backdrop, so there is no inset square frame.
    pixels = list(drawing.get_flattened_data())
    snapped = []
    for color in pixels:
        distance = sum((color[i] - background_rgb[i]) ** 2 for i in range(3))
        snapped.append(background_rgb if distance <= 30 ** 2 else color)
    drawing.putdata(snapped)
    removed_backdrop_pixels = clean_clock_backdrop(drawing, background_rgb) if number == 2 else 0
    native = Image.new("RGB", (64, 64), background_rgb)
    native.paste(drawing, (6, 6))
    icon = native.resize((1024, 1024), Image.Resampling.NEAREST)
    icon_path = ROOT / f"icons/{stem}.png"
    preview_path = ROOT / f"preview-60/{stem}.png"
    icon.save(icon_path, optimize=True)
    icon.resize((60, 60), Image.Resampling.NEAREST).save(preview_path, optimize=True)
    record = {
        "number": number, "slug": option["slug"],
        "status": "generated_and_postprocessed_concept_only",
        "tool": "image_gen.imagegen (built-in)",
        "prompt_file": "receipts/prompts.json", "prompt_number": number,
        "original_builtin_path": str(source),
        "original_builtin_sha256": digest(source),
        "original_size": list(original_size), "original_mode": original_mode,
        "raw_copy": str(raw_path.relative_to(ROOT)).replace("\\", "/"),
        "raw_copy_sha256": digest(raw_path),
        "raw_copy_note": "Byte-for-byte copy of the built-in generated PNG; original is preserved at the default tool location.",
        "postprocessed_at_utc": datetime.now(timezone.utc).isoformat(),
        "processing": [
            "Composite any alpha onto opaque cream; retain full generated image.",
            "NEAREST downsample to 52x52 to preserve eye highlights." if number == 8 else "BOX downsample to a 52x52 logical-pixel drawing.",
            "Map to 16 game colors with no dither (founder: 32 adaptive colors to preserve existing skin/hair).",
            "Snap near-background colors to the specified solid game backdrop.",
            "Center at (6,6) on opaque 64x64 canvas.",
            "Nearest-neighbor enlarge 16x to 1024x1024 RGB PNG.",
            "Nearest-neighbor downscale the final square to 60x60 RGB PNG.",
        ],
        "disconnected_clock_backdrop_pixels_removed": removed_backdrop_pixels,
        "output": str(icon_path.relative_to(ROOT)).replace("\\", "/"),
        "output_sha256": digest(icon_path),
        "preview": str(preview_path.relative_to(ROOT)).replace("\\", "/"),
        "preview_sha256": digest(preview_path),
        "reference_identity": "founder.04 / The Rounds Doctor" if number == 8 else None,
    }
    if number == 2:
        record["processing"].insert(4, "Remove disconnected backdrop speckles outside the clock silhouette.")
    write_json(ROOT / f"receipts/{stem}.json", record)
    print(f"{stem}: raw {original_size} {original_mode}; icon 1024x1024 RGB; preview 60x60 RGB.")


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    paths = [
        Path("C:/Windows/Fonts/courbd.ttf" if bold else "C:/Windows/Fonts/cour.ttf"),
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
    ]
    for path in paths:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default(size=size)


def centered(draw: ImageDraw.ImageDraw, x: float, y: float, value: str,
             face: ImageFont.ImageFont, fill: str) -> None:
    box = draw.textbbox((0, 0), value, font=face)
    draw.text((x - (box[2] - box[0]) / 2, y), value, fill=fill, font=face)


def contact_sheet() -> None:
    sheet = Image.new("RGB", (1648, 1536), "#f0eddd")
    draw = ImageDraw.Draw(sheet)
    ink, soft = "#232720", "#4c5449"
    draw.text((56, 34), "STITCHIN' TIME / APP ICON OPTIONS", font=font(36, True), fill=ink)
    draw.text((58, 83), "20 concepts  |  180 px gallery  |  exact 60 px Home Screen previews",
              font=font(18), fill=soft)
    for index, option in enumerate(options()):
        col, row = index % 5, index // 5
        cell_x, cell_y = 74 + col * 300, 132 + row * 244
        stem = f'{option["number"]:02d}-{option["slug"]}'
        with Image.open(ROOT / f"icons/{stem}.png") as icon:
            thumb = icon.resize((180, 180), Image.Resampling.NEAREST)
        sheet.paste(thumb, (cell_x + 60, cell_y))
        centered(draw, cell_x + 150, cell_y + 192,
                 f'{option["number"]:02d}  {option["short_name"]}', font(19, True), ink)
    for top, background, foreground, label in [
        (1164, "#232720", "#faf7e8", "60 PX / DARK HOME SCREEN"),
        (1318, "#e0ded0", "#232720", "60 PX / LIGHT HOME SCREEN"),
    ]:
        draw.rectangle((32, top, 1615, top + 139), fill=background)
        draw.text((52, top + 13), label, font=font(17, True), fill=foreground)
        for index, option in enumerate(options()):
            stem = f'{option["number"]:02d}-{option["slug"]}'
            with Image.open(ROOT / f"preview-60/{stem}.png") as preview:
                tile = preview.convert("RGB")
            # Round only the display simulation; all delivered PNGs remain square.
            mask = Image.new("L", (60, 60), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, 59, 59), radius=13, fill=255)
            x = 64 + index * 76
            sheet.paste(tile, (x, top + 48), mask)
            centered(draw, x + 30, top + 111, f'{option["number"]:02d}',
                     font(15, True), foreground)
    draw.text((56, 1484), "Concept art only. Final assets: opaque square 1024 px PNG; iOS applies the corner mask.",
              font=font(16), fill=soft)
    sheet.save(ROOT / "contact-sheet.png", optimize=True)
    print("Contact sheet: 1648x1536 RGB, 20 x 180px plus 20 x 60px on each backdrop.")


def validate() -> None:
    findings, hashes = [], set()
    expected = options()
    prompts = json.loads((ROOT / "receipts/prompts.json").read_text(encoding="utf-8"))
    assert len(expected) == 20
    assert [option["number"] for option in expected] == list(range(1, 21))
    for option in expected:
        stem = f'{option["number"]:02d}-{option["slug"]}'
        icon_path = ROOT / f"icons/{stem}.png"
        preview_path = ROOT / f"preview-60/{stem}.png"
        with Image.open(icon_path) as source:
            icon = source.copy()
            assert source.format == "PNG"
        with Image.open(preview_path) as source:
            preview = source.copy()
            assert source.format == "PNG"
        assert icon.size == (1024, 1024) and icon.mode == "RGB"
        assert preview.size == (60, 60) and preview.mode == "RGB"
        grid = icon.resize((64, 64), Image.Resampling.NEAREST)
        rebuilt = grid.resize((1024, 1024), Image.Resampling.NEAREST)
        assert ImageChops.difference(icon, rebuilt).getbbox() is None
        assert ImageChops.difference(
            preview, icon.resize((60, 60), Image.Resampling.NEAREST)
        ).getbbox() is None
        background = grid.getpixel((0, 0))
        assert all(grid.getpixel(point) == background for point in [
            (63, 0), (0, 63), (63, 63), (32, 0), (0, 32), (63, 32), (32, 63)
        ])
        # Exclude quiet canvas; subject/shadow cannot touch icon edges.
        difference = ImageChops.difference(grid, Image.new("RGB", grid.size, background))
        bbox = difference.getbbox()
        assert bbox and bbox[0] >= 6 and bbox[1] >= 6 and bbox[2] <= 58 and bbox[3] <= 58
        sha = digest(icon_path)
        assert sha not in hashes
        hashes.add(sha)
        receipt = json.loads((ROOT / f"receipts/{stem}.json").read_text(encoding="utf-8"))
        tool_receipt = json.loads((ROOT / f"receipts/{stem}-tool.json").read_text(encoding="utf-8"))
        assert receipt["output_sha256"] == sha
        assert receipt["preview_sha256"] == digest(preview_path)
        raw_path = ROOT / receipt["raw_copy"]
        assert digest(raw_path) == receipt["raw_copy_sha256"] == receipt["original_builtin_sha256"]
        prompt = next(item for item in prompts if item["number"] == option["number"])
        assert tool_receipt["tool_arguments"]["prompt"] == prompt["prompt"]
        assert tool_receipt["tool_arguments"]["transparent_background"] is False
        if option["number"] == 8:
            assert tool_receipt["tool_arguments"]["referenced_image_paths"] == prompt["referenced_image_paths"]
        findings.append({
            "number": option["number"], "slug": option["slug"],
            "icon": {"size": [1024, 1024], "mode": "RGB", "sha256": sha},
            "preview": {"size": [60, 60], "mode": "RGB", "sha256": digest(preview_path)},
            "native_pixel_grid": [64, 64],
            "subject_and_shadow_bbox_native": list(bbox),
            "opaque_square_uniform_corners": True,
            "exact_nearest_neighbor_preview": True,
        })
    assert len(list((ROOT / "icons").glob("*.png"))) == 20
    assert len(list((ROOT / "preview-60").glob("*.png"))) == 20
    assert len(list((ROOT / "receipts/generated").glob("*.png"))) == 20
    assert len(list((ROOT / "receipts").glob("*-tool.json"))) == 20
    with Image.open(ROOT / "contact-sheet.png") as sheet:
        assert sheet.format == "PNG" and sheet.size == (1648, 1536) and sheet.mode == "RGB"
    textual = [p for p in ROOT.rglob("*") if p.suffix in (".json", ".md", ".py", ".txt")]
    for path in textual:
        data = path.read_bytes()
        assert not data.startswith(b"\xef\xbb\xbf"), path
        assert b"\r" not in data, path
        data.decode("utf-8")
    checks = {
        "status": "PASS", "icons": 20, "previews": 20, "distinct_icon_hashes": 20,
        "icons_1024_rgb_png": True, "previews_60_rgb_png": True,
        "no_transparency_or_pre_rounded_corners": True,
        "crisp_64_pixel_grid_enlarged_16x": True,
        "foreground_safety_envelope": "within 6..58 on 64px; important subject is further inset",
        "utf8_without_bom_and_lf": True,
        "generation_receipts_and_raw_source_hashes": "20/20 verified; prompt arguments match stored prompt set",
        "git_install_web_commands": "none",
        "artifact_scope": "artifacts/app-icon-options-20261010/",
        "visual_review": "Contact sheet and individual candidates inspected by worker; see HANDOFF.md.",
        "files": findings,
    }
    write_json(ROOT / "receipts/validation.json", checks)
    print("PASS: 20 distinct 1024x1024 RGB PNGs; 20 exact 60x60 previews; crisp pixel grids; opaque square corners; safe margins; UTF-8 no BOM / LF.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["prepare", "ingest", "finalize", "validate"])
    parser.add_argument("--number", type=int)
    parser.add_argument("--source", type=Path)
    args = parser.parse_args()
    if args.command == "prepare":
        prepare()
    elif args.command == "ingest":
        assert args.number is not None and args.source is not None
        ingest(args.number, args.source)
    elif args.command == "finalize":
        contact_sheet()
        validate()
    else:
        validate()


if __name__ == "__main__":
    main()
