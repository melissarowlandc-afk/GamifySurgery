"""Uniform exports and comparison proofs; no painting or alpha replacement."""
from pathlib import Path
import hashlib
import importlib.util
import json
from PIL import Image, ImageDraw

PACK = Path(__file__).resolve().parent
ROOT = PACK.parents[2]
RUNTIME = ROOT / "apps/player/public/art/environment/frontage-v2"
spec = importlib.util.spec_from_file_location("frontage_base_export", PACK.parent / "export_art.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
base.PACK = PACK


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def comparison():
    proof_dir = PACK / "proof"
    proof_dir.mkdir(exist_ok=True)
    sheet = Image.new("RGB", (1500, 970), "#d1cec2")
    draw = ImageDraw.Draw(sheet)
    draw.text((16, 10), "Reviewed v2 versus fuller v3 beds: actual reduced pixels + 3x inspection copies", fill="#262b23")
    draw.text((16, 28), "Offline 920x325 / 64x40 fixture; runtime envelope 1.55T x 0.484375T, contact sidewalkTop+0.50T", fill="#262b23")
    samples = [("24px pilot", 24), ("140%", 52), ("110%", 41), ("100%", 37), ("70%", 27), ("50%", 20), ("minimum 10%", 7)]
    for row, (label, tile) in enumerate(samples):
        y = 64 + row * 128
        draw.text((16, y), f"{label}, T={tile}: {1.55*tile:.2f}x{0.484375*tile:.2f}px", fill="#262b23")
        for column, (side, version) in enumerate([(s, v) for s in ["west", "east"] for v in ["v2", "v3"]]):
            x = column * 375
            draw.text((x + 16, y + 17), f"{side} {version}", fill="#262b23")
            asset = Image.open(RUNTIME / f"bed-{side}-{version}.png")
            reduced = asset.resize((max(1, round(1.55*tile)), max(1, round(0.484375*tile))), Image.Resampling.LANCZOS)
            sheet.paste(reduced, (x + 16, y + 40), reduced)
            enlarged = reduced.resize((reduced.width*3, reduced.height*3), Image.Resampling.NEAREST)
            sheet.paste(enlarged, (x + 112, y + 37), enlarged)
    sheet.save(proof_dir / "bed-comparison.png")
    native = Image.new("RGB", (1100, 440), "#9ba187")
    draw = ImageDraw.Draw(native)
    for row, version in enumerate(["v2", "v3"]):
        for column, side in enumerate(["west", "east"]):
            x, y = 14 + column*550, 18 + row*214
            draw.text((x, y), f"{side} {version}: native 512x160; anchor (256,160)", fill="#252920")
            asset = Image.open(RUNTIME / f"bed-{side}-{version}.png")
            native.paste(asset, (x, y+28), asset)
    native.save(proof_dir / "bed-native.png")
    return {"canvas": [920, 325], "syntheticSite": [64, 40], "samples": [{"label": label, "tileSize": tile} for label, tile in samples], "browserQA": "not implied by offline proof"}


if __name__ == "__main__":
    assets = [base.export(f"bed-{side}-v3", ((512, 160), (256, 160), "prop")) for side in ["west", "east"]]
    if any(asset is None for asset in assets):
        raise ValueError("Both built-in generated originals are required")
    for side, asset in zip(["west", "east"], assets):
        reference = RUNTIME / f"bed-{side}-v2.png"
        asset["reference"] = {"role": "edit target", "path": str(reference.relative_to(ROOT)).replace("\\", "/"), "sha256": digest(reference)}
        asset["displayTiles"] = {"width": 1.55, "height": 0.484375, "contactOffsetY": 0.5}
    concept = ROOT / "docs/design/exterior-frontage/concept-05-b-stone-with-inset.png"
    receipt = {
        "date": "2026-10-08",
        "revision": "bed-v3-fuller-planting",
        "generator": "built-in image_gen.imagegen; two precise-object edits; no API/CLI or purchases",
        "request": "Manager review: fuller/taller mounded foliage and visible white/pink clusters inside the existing bed envelope and rear sidewalk band",
        "conceptDirection": {"path": str(concept.relative_to(ROOT)).replace("\\", "/"), "sha256": digest(concept), "role": "viewed for direction only; no pixels extracted or passed as edit input"},
        "assets": assets,
        "bedComparisonProof": comparison(),
        "unchangedKit": {asset["export"]: asset["exportSha256"] for asset in json.loads((PACK.parent / "provenance.json").read_text(encoding="utf-8"))["assets"]},
    }
    (PACK / "provenance.json").write_text(json.dumps(receipt, indent=2)+"\n", encoding="utf-8")
    print(json.dumps({"exports": len(assets), "assets": [{"id": asset["id"], "size": asset["nativeSize"], "anchor": asset["anchor"], "alphaBounds": asset["alphaBounds"], "hash": asset["exportSha256"]} for asset in assets]}, indent=2))
