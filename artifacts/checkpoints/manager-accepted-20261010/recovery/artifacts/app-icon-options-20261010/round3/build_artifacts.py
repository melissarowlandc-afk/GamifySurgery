"""Export and validate the five generated Round 3 storefront concepts.

Uses existing Pillow for pixel-grid normalization, safe-area fitting, opaque
backgrounds, previews and the review contact sheet. No model/API/CLI calls.
"""
from collections import deque
from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
from statistics import median
import json

import PIL
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
GRID = 256
MAX_CONTENT = 208
SHEET_SIZE = (1400, 820)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def digest(path):
    return sha256(path.read_bytes()).hexdigest()


def rgb(hex_color):
    return tuple(int(hex_color[i:i + 2], 16) for i in (1, 3, 5))


def clean_and_fit(raw, target_bg):
    native = raw.convert("RGB").resize((GRID, GRID), Image.Resampling.NEAREST)
    pixels = native.load()
    edge_points = [(x, y) for x in range(GRID) for y in (0, GRID - 1)]
    edge_points += [(x, y) for y in range(1, GRID - 1) for x in (0, GRID - 1)]
    source_bg = tuple(round(median(pixels[x, y][c] for x, y in edge_points)) for c in range(3))
    eligible = {
        (x, y) for y in range(GRID) for x in range(GRID)
        if max(abs(pixels[x, y][c] - source_bg[c]) for c in range(3)) <= 36
    }
    queue = deque(p for p in edge_points if p in eligible)
    outside = set(queue)
    while queue:
        x, y = queue.popleft()
        for neighbor in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if neighbor in eligible and neighbor not in outside:
                outside.add(neighbor)
                queue.append(neighbor)
    mask = Image.new("L", (GRID, GRID), 255)
    mask_pixels = mask.load()
    for x, y in outside:
        mask_pixels[x, y] = 0
        pixels[x, y] = target_bg
    # Remove a few isolated background specks left by the generated texture.
    # Only detached components of at most 12 native pixels are cleared; the
    # continuous facade/interior and its fixtures are preserved.
    remaining = {(x, y) for y in range(GRID) for x in range(GRID) if mask_pixels[x, y]}
    removed_specks = 0
    while remaining:
        start = remaining.pop()
        component = [start]
        queue = deque([start])
        while queue:
            x, y = queue.popleft()
            for neighbor in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if neighbor in remaining:
                    remaining.remove(neighbor)
                    component.append(neighbor)
                    queue.append(neighbor)
        if len(component) <= 12:
            for x, y in component:
                mask_pixels[x, y] = 0
                pixels[x, y] = target_bg
            removed_specks += len(component)
    bounds = mask.getbbox()
    if not bounds:
        raise ValueError("Background cleanup removed the subject")
    crop = native.crop(bounds)
    crop_mask = mask.crop(bounds)
    ratio = MAX_CONTENT / max(crop.size)
    fitted = (round(crop.width * ratio), round(crop.height * ratio))
    crop = crop.resize(fitted, Image.Resampling.NEAREST)
    crop_mask = crop_mask.resize(fitted, Image.Resampling.NEAREST)
    position = ((GRID - fitted[0]) // 2, (GRID - fitted[1]) // 2)
    result = Image.new("RGB", (GRID, GRID), target_bg)
    result_mask = Image.new("L", (GRID, GRID), 0)
    result.paste(crop, position, crop_mask)
    result_mask.paste(crop_mask, position)
    # Preserve sampled RGB colors. A trial median-cut palette muted the small
    # blue cooler by grouping it with greens. The native pixel grid already
    # gives crisp edges without sacrificing the generated accent colors.
    clean = Image.new("RGB", (GRID, GRID), target_bg)
    clean.paste(result, (0, 0), result_mask)
    return clean, {
        "native_grid": [GRID, GRID],
        "source_edge_background_rgb": list(source_bg),
        "final_edge_background_rgb": list(target_bg),
        "background_cleanup": "four-connected edge flood; max channel distance 36 from edge median",
        "background_pixels_flattened_at_native_grid": len(outside),
        "detached_background_speck_pixels_removed": removed_specks,
        "source_subject_bbox_at_native_grid": list(bounds),
        "fitted_content_size_at_native_grid": list(fitted),
        "fitted_content_position_at_native_grid": list(position),
        "content_bbox_at_1024": [v * (1024 // GRID) for v in result_mask.getbbox()],
        "color_policy": "generated RGB colors preserved on the native grid; no palette reduction or dithering; exact background restored",
        "resize_filter": "nearest-neighbor",
    }


def font(size, bold=False):
    candidates = [
        Path("C:/Windows/Fonts") / ("courbd.ttf" if bold else "cour.ttf"),
        Path("C:/Windows/Fonts") / ("consolab.ttf" if bold else "consola.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default(size=size)


def centered(draw, text, center_x, y, fill, text_font):
    box = draw.textbbox((0, 0), text, font=text_font)
    draw.text((round(center_x - (box[2] - box[0]) / 2), y), text, fill=fill, font=text_font)


def contact_sheet(options):
    sheet = Image.new("RGB", SHEET_SIZE, "#f4e9cf")
    draw = ImageDraw.Draw(sheet)
    ink = "#232720"
    draw.text((58, 28), "Stitchin' Time - Round 3", fill=ink, font=font(38, True))
    draw.text((60, 83), "Five open-door clinic storefronts | 180 px concepts + actual 60 px previews", fill="#456350", font=font(19))
    centers = [188 + 256 * n for n in range(5)]
    for option, center in zip(options, centers):
        name = f"{option['id']}-{option['slug']}.png"
        icon = Image.open(ROOT / "icons" / name).convert("RGB")
        thumb = icon.resize((180, 180), Image.Resampling.NEAREST)
        sheet.paste(thumb, (center - 90, 148))
        centered(draw, option["id"], center, 347, "#366353", font(20, True))
        centered(draw, option["short_name"], center, 377, ink, font(20, True))
    rows = [
        (438, "#202b28", "#f4e9cf", "Dark Home Screen"),
        (600, "#fff8e7", ink, "Light Home Screen"),
    ]
    for top, color, text_color, label in rows:
        draw.rectangle((42, top, 1357, top + 140), fill=color)
        draw.text((65, top + 22), "60 px", fill=text_color, font=font(22, True))
        draw.text((65, top + 62), label, fill=text_color, font=font(17))
        for option, center in zip(options, [430, 620, 810, 1000, 1190]):
            name = f"{option['id']}-{option['slug']}.png"
            preview = Image.open(ROOT / "preview-60" / name).convert("RGB")
            sheet.paste(preview, (center - 30, top + 19))
            centered(draw, option["id"], center, top + 95, text_color, font(17, True))
    draw.text((59, 774), "Opaque square PNGs | crisp 4 px grid | central ~80% artwork | concept art only", fill="#456350", font=font(17))
    sheet.save(ROOT / "contact-sheet.png")


def build(options):
    processing = []
    for option in options:
        receipt = read_json(ROOT / "receipts" / "tool" / f"{option['id']}.json")
        raw_path = ROOT / receipt["copied_raw_path"]
        with Image.open(raw_path) as source:
            source_info = {"format": source.format, "size": list(source.size), "mode": source.mode}
            native, details = clean_and_fit(source, rgb(option["background_color"]))
        name = f"{option['id']}-{option['slug']}.png"
        icon_path = ROOT / "icons" / name
        preview_path = ROOT / "preview-60" / name
        native.resize((1024, 1024), Image.Resampling.NEAREST).save(icon_path)
        with Image.open(icon_path) as icon:
            icon.resize((60, 60), Image.Resampling.NEAREST).save(preview_path)
        record = {
            "id": option["id"],
            "raw_path": receipt["copied_raw_path"],
            "raw_sha256": digest(raw_path),
            "raw_image": source_info,
            "tool_receipt": f"receipts/tool/{option['id']}.json",
            "icon_path": icon_path.relative_to(ROOT).as_posix(),
            "icon_sha256": digest(icon_path),
            "preview_path": preview_path.relative_to(ROOT).as_posix(),
            "preview_sha256": digest(preview_path),
            "processing": details,
        }
        write_json(ROOT / "receipts" / f"{option['id']}-processing.json", record)
        processing.append(record)
    contact_sheet(options)
    write_json(ROOT / "receipts" / "generation-index.json", {
        "tool": "built-in image_gen.imagegen",
        "requested_variants": 5,
        "generation_calls": 5,
        "selected_outputs": processing,
        "prompt_set": "receipts/prompts.json",
        "reference_provenance": "receipts/reference-provenance.json",
        "postprocessing_runtime": {"python": "3.12.10", "Pillow": PIL.__version__},
        "contact_sheet": {"path": "contact-sheet.png", "size": list(SHEET_SIZE), "sha256": digest(ROOT / "contact-sheet.png")},
    })
    return processing


def validate(options, processing):
    checks = []

    def check(label, condition):
        checks.append({"check": label, "pass": bool(condition)})

    expected = [f"{o['id']}-{o['slug']}.png" for o in options]
    check("Five sequential IDs R3-01 through R3-05", [o["id"] for o in options] == [f"R3-{n:02d}" for n in range(1, 6)])
    check("Exactly five final PNGs", sorted(p.name for p in (ROOT / "icons").glob("*.png")) == sorted(expected))
    check("Exactly five 60 px previews", sorted(p.name for p in (ROOT / "preview-60").glob("*.png")) == sorted(expected))
    check("Five distinct final image hashes", len({r["icon_sha256"] for r in processing}) == 5)
    check("Five distinct preview hashes", len({r["preview_sha256"] for r in processing}) == 5)
    raw_match_count = 0
    for option, record in zip(options, processing):
        name = f"{option['id']}-{option['slug']}.png"
        with Image.open(ROOT / "icons" / name) as im:
            check(f"{option['id']}: PNG, 1024x1024, opaque RGB", im.format == "PNG" and im.size == (1024, 1024) and im.mode == "RGB")
            native = im.resize((GRID, GRID), Image.Resampling.NEAREST)
            rebuilt = native.resize((1024, 1024), Image.Resampling.NEAREST)
            check(f"{option['id']}: exact 4 px grid", rebuilt.tobytes() == im.tobytes())
            target = rgb(option["background_color"])
            border = [im.getpixel((x, y)) for x in range(1024) for y in (0, 1023)]
            border += [im.getpixel((x, y)) for y in range(1024) for x in (0, 1023)]
            check(f"{option['id']}: full-bleed square background", all(p == target for p in border))
            bounds = record["processing"]["content_bbox_at_1024"]
            check(f"{option['id']}: central approximately 80% content", bounds[0] >= 96 and bounds[1] >= 96 and bounds[2] <= 928 and bounds[3] <= 928)
            with Image.open(ROOT / "preview-60" / name) as preview:
                check(f"{option['id']}: PNG, 60x60, opaque RGB", preview.format == "PNG" and preview.size == (60, 60) and preview.mode == "RGB")
                check(f"{option['id']}: preview matches export", preview.tobytes() == im.resize((60, 60), Image.Resampling.NEAREST).tobytes())
        receipt = read_json(ROOT / "receipts" / "tool" / f"{option['id']}.json")
        original_path = Path(receipt["source_path"])
        raw_match = original_path.exists() and digest(original_path) == record["raw_sha256"]
        raw_match_count += raw_match
        check(f"{option['id']}: preserved original generation bytes", raw_match)
        check(f"{option['id']}: full prompt and reference paths in receipt", bool(receipt["request"]["prompt"]) and len(receipt["request"]["referenced_image_paths"]) == 2)
    with Image.open(ROOT / "contact-sheet.png") as sheet:
        check("Contact sheet is opaque RGB PNG at 1400x820", sheet.format == "PNG" and sheet.size == SHEET_SIZE and sheet.mode == "RGB")
    baseline = read_json(ROOT / "receipts" / "preservation-baseline.json")
    changed_prior = [p for p, original in baseline["prior_round_files"].items() if not (REPO / p).exists() or digest(REPO / p) != original]
    changed_game = [p for p, original in baseline["studied_game_sources"].items() if not (REPO / p).exists() or digest(REPO / p) != original]
    check(f"All {len(baseline['prior_round_files'])} prior-round files preserved", not changed_prior)
    check(f"All {len(baseline['studied_game_sources'])} studied game sources unchanged", not changed_game)
    text_paths = [p for p in ROOT.rglob("*") if p.is_file() and p.suffix in (".json", ".md", ".py", ".txt")]
    bad_text = []
    for path in text_paths:
        data = path.read_bytes()
        try:
            data.decode("utf-8")
            valid = not data.startswith(b"\xef\xbb\xbf") and b"\r" not in data
        except UnicodeDecodeError:
            valid = False
        if not valid:
            bad_text.append(path.relative_to(ROOT).as_posix())
    check("All Round 3 text files are UTF-8 without BOM and LF", not bad_text)
    failures = [r for r in checks if not r["pass"]]
    output = {
        "status": "PASS" if not failures else "FAIL",
        "validated_at": datetime.now(timezone.utc).isoformat(),
        "check_count": len(checks),
        "checks": checks,
        "summary": {"icons": 5, "previews": 5, "raw_originals_match": raw_match_count, "prior_round_files_preserved": len(baseline["prior_round_files"]) - len(changed_prior), "game_sources_unchanged": len(baseline["studied_game_sources"]) - len(changed_game)},
        "changed_prior_paths": changed_prior,
        "changed_game_source_paths": changed_game,
        "invalid_text_paths": bad_text,
        "visual_review": "receipts/visual-review.json; manual review of generated scenes and contact sheet required",
    }
    write_json(ROOT / "receipts" / "validation.json", output)
    print(f"{output['status']}: {len(checks)} checks; 5 icons + 5 previews; {raw_match_count} original generation bytes verified")
    print(f"Preserved {output['summary']['prior_round_files_preserved']} prior-round files; {output['summary']['game_sources_unchanged']} studied game sources unchanged")
    if failures:
        raise SystemExit(json.dumps(failures, indent=2))


def main():
    options = read_json(ROOT / "options.json")
    processing = build(options)
    validate(options, processing)


if __name__ == "__main__":
    main()
