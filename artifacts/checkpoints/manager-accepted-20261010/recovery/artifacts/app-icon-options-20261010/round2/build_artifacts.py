"""Package Round 2 icon concepts without changing application or Round 1 files.

Built-in imagegen originals and complete call receipts are kept byte-for-byte.
Pillow is used only for the user-requested raster postprocessing and previews.
"""

import argparse
from collections import Counter, deque
import hashlib
import json
from pathlib import Path
import shutil
from statistics import median

from PIL import Image, ImageChops, ImageColor, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent.parent
RESAMPLE = Image.Resampling.NEAREST


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rgb(image, background):
    if image.mode == "RGBA" or "transparency" in image.info:
        rgba = image.convert("RGBA")
        flattened = Image.new("RGBA", image.size, background + (255,))
        flattened.alpha_composite(rgba)
        return flattened.convert("RGB")
    return image.convert("RGB")


def clean_and_fit(raw, background, grid, is_room=False):
    """Snap to pixels, flatten exterior background, and fit subject within 81.25%."""
    small = rgb(raw, background).resize((grid, grid), RESAMPLE)
    pixels = small.load()
    edge = []
    for i in range(grid):
        edge.extend([pixels[i, 0], pixels[i, grid - 1], pixels[0, i], pixels[grid - 1, i]])
    measured = tuple(int(median([p[channel] for p in edge])) for channel in range(3))
    tolerance = 32 if grid == 128 else 26
    candidate = [[max(abs(pixels[x, y][i] - measured[i]) for i in range(3)) <= tolerance
                  for x in range(grid)] for y in range(grid)]
    exterior = set()
    queue = deque()
    for i in range(grid):
        queue.extend([(i, 0), (i, grid - 1), (0, i), (grid - 1, i)])
    while queue:
        x, y = queue.popleft()
        if (x, y) in exterior or not (0 <= x < grid and 0 <= y < grid) or not candidate[y][x]:
            continue
        exterior.add((x, y))
        queue.extend([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)])
    mask = Image.new("L", small.size, 255)
    mask_pixels = mask.load()
    for x, y in exterior:
        pixels[x, y] = background
        mask_pixels[x, y] = 0
    bounds = mask.getbbox()
    if not bounds:
        raise ValueError("Empty foreground")
    subject = small.crop(bounds)
    subject_mask = mask.crop(bounds)
    inner = grid * 13 // 16
    factor = inner / max(subject.size)
    fitted_size = (max(1, round(subject.width * factor)), max(1, round(subject.height * factor)))
    subject = subject.resize(fitted_size, RESAMPLE)
    subject_mask = subject_mask.resize(fitted_size, RESAMPLE)
    canvas = Image.new("RGB", (grid, grid), background)
    offset = ((grid - fitted_size[0]) // 2, (grid - fitted_size[1]) // 2)
    canvas.paste(subject, offset, subject_mask)
    # Rooms need more shades for their many real furniture materials; object marks need fewer.
    palette_colors = 256 if is_room else 64
    palette_method = Image.Quantize.MEDIANCUT if is_room else Image.Quantize.MAXCOVERAGE
    reduced = canvas.quantize(colors=palette_colors,
                              method=palette_method, dither=Image.Dither.NONE).convert("RGB")
    reduced_pixels = reduced.load()
    full_mask = Image.new("L", (grid, grid), 0)
    full_mask.paste(subject_mask, offset)
    for y in range(grid):
        for x in range(grid):
            if not full_mask.getpixel((x, y)):
                reduced_pixels[x, y] = background
    details = {
        "native_grid": grid,
        "resampling": "nearest-neighbor for native grid, fitted subject, 1024 export and 60 preview",
        "adaptive_palette_colors": palette_colors,
        "adaptive_palette_method": "median cut with room material shades" if is_room else "maximum coverage, preserving small saturated accents",
        "dithering": "none",
        "measured_source_background_rgb": measured,
        "flat_export_background_rgb": background,
        "edge_connected_background_tolerance": tolerance,
        "source_foreground_bounds_at_native_grid": bounds,
        "fitted_subject_size_at_native_grid": fitted_size,
        "fitted_subject_offset_at_native_grid": offset,
        "maximum_subject_extent": "81.25% of square; important content inside central approximately 80%",
    }
    return reduced.resize((1024, 1024), RESAMPLE), details


def build_icon(option, spec):
    stem = option["id"] + "-" + option["slug"]
    tool_path = ROOT / "receipts" / (stem + "-tool.json")
    tool = read_json(tool_path)
    source = Path(tool["source_path"])
    raw_path = ROOT / "receipts" / "generated" / (stem + ".png")
    if source.is_file():
        shutil.copyfile(source, raw_path)
    elif not raw_path.is_file():
        raise FileNotFoundError(f"Neither built-in original nor archived raw exists for {stem}")
    with Image.open(raw_path) as raw:
        image, processing = clean_and_fit(raw, ImageColor.getrgb(option["background"]), spec["native_grid"], option["number"] <= 5)
        raw_info = {"dimensions": list(raw.size), "mode": raw.mode, "format": raw.format}
    icon_path = ROOT / "icons" / (stem + ".png")
    preview_path = ROOT / "preview-60" / (stem + ".png")
    image.save(icon_path)
    image.resize((60, 60), RESAMPLE).save(preview_path)
    write_json(ROOT / "receipts" / (stem + "-processing.json"), {
        "id": option["id"],
        "raw_original": {"path": str(raw_path.relative_to(ROOT)).replace("\\", "/"),
                         "sha256": sha256(raw_path), **raw_info},
        "tool_receipt": str(tool_path.relative_to(ROOT)).replace("\\", "/"),
        "processing": processing,
        "final": {"path": str(icon_path.relative_to(ROOT)).replace("\\", "/"),
                  "sha256": sha256(icon_path), "dimensions": [1024, 1024], "mode": "RGB"},
        "preview": {"path": str(preview_path.relative_to(ROOT)).replace("\\", "/"),
                    "sha256": sha256(preview_path), "dimensions": [60, 60], "mode": "RGB"},
    })
    print(f"Packaged {option['id']}: 1024 RGB + 60 RGB, {spec['native_grid']}px native grid")


def font(size, bold=False):
    path = Path("C:/Windows/Fonts") / ("courbd.ttf" if bold else "cour.ttf")
    return ImageFont.truetype(str(path), size)


def centered(draw, text, cx, y, face, fill):
    box = draw.textbbox((0, 0), text, font=face)
    draw.text((cx - (box[2] - box[0]) / 2, y), text, font=face, fill=fill)


def contact_sheet(options):
    sheet = Image.new("RGB", (1952, 1888), "#f4e9cf")
    draw = ImageDraw.Draw(sheet)
    draw.text((64, 33), "STITCHIN' TIME | ROUND 2", font=font(36, True), fill="#214e42")
    draw.text((64, 83), "25 colorful pixel-art app-icon concepts | artwork 180 px | Home Screen samples 60 px",
              font=font(19), fill="#445349")
    groups = ["01-05  FRONT DESK", "06-10  STITCH CLOCKS", "11-15  STITCHED HEARTS",
              "16-20  THREADGLASSES", "21-25  ON-CALL COFFEE"]
    for row in range(5):
        heading_y = 132 + row * 264
        draw.text((64, heading_y), groups[row], font=font(22, True), fill="#214e42")
        for col in range(5):
            option = options[row * 5 + col]
            stem = option["id"] + "-" + option["slug"]
            cx = 263 + col * 356
            y = heading_y + 36
            with Image.open(ROOT / "icons" / (stem + ".png")) as icon:
                sheet.paste(icon.resize((180, 180), RESAMPLE), (cx - 90, y))
            centered(draw, option["id"] + "  " + option["short_name"], cx, y + 193,
                     font(17, True), "#232720")
    for top, color, label, ink in [(1514, "#152e2a", "DARK HOME SCREEN | actual 60 px", "#f4e9cf"),
                                    (1682, "#f7edd8", "LIGHT HOME SCREEN | actual 60 px", "#214e42")]:
        draw.rectangle((48, top, 1904, top + 134), fill=color)
        draw.text((72, top + 9), label, font=font(17, True), fill=ink)
        mask = Image.new("L", (60, 60), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, 59, 59), radius=13, fill=255)
        for i, option in enumerate(options):
            stem = option["id"] + "-" + option["slug"]
            x = 80 + i * 72
            with Image.open(ROOT / "preview-60" / (stem + ".png")) as preview:
                sheet.paste(preview, (x, top + 39), mask)
            centered(draw, option["id"], x + 30, top + 105, font(13), ink)
    draw.text((64, 1846), "Saved icons: opaque square PNGs. Rounded masks appear only in these Home Screen preview rows.",
              font=font(17), fill="#445349")
    sheet.save(ROOT / "contact-sheet.png")
    print("Built contact-sheet.png: 1952 x 1888 RGB; 25 at 180px plus 25 at 60px on each background")


def validate(options, specs):
    errors = []
    hashes = set()
    checks = []
    original_matches = 0
    for option, spec in zip(options, specs):
        stem = option["id"] + "-" + option["slug"]
        icon_path = ROOT / "icons" / (stem + ".png")
        preview_path = ROOT / "preview-60" / (stem + ".png")
        raw_path = ROOT / "receipts" / "generated" / (stem + ".png")
        tool_path = ROOT / "receipts" / (stem + "-tool.json")
        processing_path = ROOT / "receipts" / (stem + "-processing.json")
        if not all(p.is_file() for p in [icon_path, preview_path, raw_path, tool_path, processing_path]):
            errors.append(option["id"] + ": missing file")
            continue
        tool, processing = read_json(tool_path), read_json(processing_path)
        if tool["args"] != {"prompt": spec["prompt"], "transparent_background": False,
                            "referenced_image_paths": spec["referenced_image_paths"]}:
            errors.append(option["id"] + ": prompt receipt mismatch")
        if sha256(raw_path) != processing["raw_original"]["sha256"]:
            errors.append(option["id"] + ": raw hash mismatch")
        builtin_source = Path(tool["source_path"])
        if builtin_source.is_file():
            if sha256(raw_path) != sha256(builtin_source):
                errors.append(option["id"] + ": raw differs from built-in original")
            else:
                original_matches += 1
        digest = sha256(icon_path)
        if digest != processing["final"]["sha256"] or sha256(preview_path) != processing["preview"]["sha256"]:
            errors.append(option["id"] + ": export hash mismatch")
        if digest in hashes:
            errors.append(option["id"] + ": duplicated icon")
        hashes.add(digest)
        with Image.open(icon_path) as icon, Image.open(preview_path) as preview:
            if icon.format != "PNG" or icon.mode != "RGB" or icon.size != (1024, 1024):
                errors.append(option["id"] + ": incorrect icon format")
            if preview.format != "PNG" or preview.mode != "RGB" or preview.size != (60, 60):
                errors.append(option["id"] + ": incorrect preview format")
            if ImageChops.difference(preview, icon.resize((60, 60), RESAMPLE)).getbbox():
                errors.append(option["id"] + ": preview mismatch")
            native = icon.resize((spec["native_grid"], spec["native_grid"]), RESAMPLE)
            if ImageChops.difference(icon, native.resize((1024, 1024), RESAMPLE)).getbbox():
                errors.append(option["id"] + ": noninteger pixel edges")
            background = ImageColor.getrgb(option["background"])
            bounds = ImageChops.difference(icon, Image.new("RGB", icon.size, background)).getbbox()
            if bounds and not (bounds[0] >= 88 and bounds[1] >= 88 and bounds[2] <= 936 and bounds[3] <= 936):
                errors.append(option["id"] + ": foreground outside central approximately 80%")
            checks.append({"id": option["id"], "icon_sha256": digest, "foreground_bounds": bounds,
                           "native_grid": spec["native_grid"], "unique_colors": len(icon.getcolors(20000) or [])})
    for folder in ["icons", "preview-60", "receipts/generated"]:
        if len(list((ROOT / folder).glob("*.png"))) != 25:
            errors.append(folder + ": incorrect PNG count")
    baseline = read_json(ROOT / "receipts" / "round1-baseline.json")
    changed_round1 = []
    for record in baseline:
        path = REPO / record["path"]
        if not path.exists() or sha256(path) != record["sha256"]:
            changed_round1.append(record["path"])
    if changed_round1:
        errors.append("Round 1 changed: " + ", ".join(changed_round1))
    references = read_json(ROOT / "receipts" / "reference-hashes.json")
    changed_sources = []
    for record in references:
        path = REPO / record["path"]
        if not path.exists() or sha256(path) != record["sha256"]:
            changed_sources.append(record["path"])
    if changed_sources:
        errors.append("Game reference sources changed: " + ", ".join(changed_sources))
    for path in ROOT.rglob("*"):
        if path.is_file() and path.suffix in {".json", ".py", ".md"}:
            data = path.read_bytes()
            try:
                data.decode("utf-8")
            except UnicodeDecodeError:
                errors.append(str(path.relative_to(ROOT)) + ": not UTF-8")
            if data.startswith(b"\xef\xbb\xbf") or b"\r" in data:
                errors.append(str(path.relative_to(ROOT)) + ": BOM or CR line ending")
    sheet_path = ROOT / "contact-sheet.png"
    if not sheet_path.is_file():
        errors.append("Missing contact sheet")
    else:
        with Image.open(sheet_path) as sheet:
            if sheet.size != (1952, 1888) or sheet.mode != "RGB":
                errors.append("Incorrect contact sheet dimensions/mode")
    result = {"status": "PASS" if not errors else "FAIL", "icons": len(checks),
              "unique_icons": len(hashes), "previews": 25, "raw_originals": 25,
              "builtin_originals_verified_byte_identical": original_matches,
              "round1_files_unchanged": len(baseline) - len(changed_round1),
              "game_reference_files_unchanged": len(references) - len(changed_sources),
              "checks": checks, "errors": errors}
    write_json(ROOT / "receipts" / "validation.json", result)
    print(json.dumps({key: value for key, value in result.items() if key != "checks"}, indent=2))
    if errors:
        raise SystemExit(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--numbers", nargs="+", type=int)
    parser.add_argument("--validate", action="store_true")
    args = parser.parse_args()
    options = read_json(ROOT / "options.json")
    specs = read_json(ROOT / "receipts" / "prompts.json")
    for folder in ["icons", "preview-60", "receipts/generated"]:
        (ROOT / folder).mkdir(exist_ok=True, parents=True)
    if not args.validate:
        for option, spec in zip(options, specs):
            if args.numbers is None or option["number"] in args.numbers:
                build_icon(option, spec)
        if all((ROOT / "icons" / (option["id"] + "-" + option["slug"] + ".png")).is_file() for option in options):
            contact_sheet(options)
    if args.validate or args.numbers is None:
        validate(options, specs)


if __name__ == "__main__":
    main()
