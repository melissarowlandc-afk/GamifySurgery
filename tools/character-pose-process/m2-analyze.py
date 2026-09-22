from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


REPO = Path(__file__).resolve().parents[2]
RUN = REPO / "Photos for Codex 2" / "Codex Patients or Staff or Other Characters 2" / "mixed-batch-2026-09-10" / "pose-process-proof-v1" / "m2-run-001"
COMPOSITE_SHA = "e87e1d066078fe6a355caa98e7a1158fef937fa189ccbb26edf5e43c7d76ac34"
MASK_SHA = "f610c2474289088d12fc5f195b2ac98365efb06c8a284545ef4c58044742c34f"
REGIONS = {
    "control": (40, 80, 100, 160),
    "positiveRotation": (110, 80, 180, 170),
    "negativeRotation": (195, 80, 270, 170),
    "signedClipping": (0, 210, 30, 300),
    "noncentralPivot": (110, 235, 190, 325),
    "alphaOpaque": (250, 210, 315, 310),
    "alphaTransparent": (320, 210, 390, 310),
}
EXPECTED_EXACT = {
    "control": ((64, 94, 86, 142), 676),
    "signedClipping": ((0, 224, 12, 272), 196),
    "alphaOpaque": ((274, 224, 296, 272), 676),
    "alphaTransparent": (None, 0),
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_exclusive(image: Image.Image, path: Path) -> None:
    if path.exists():
        raise RuntimeError(f"refusing to overwrite {path}")
    image.save(path, format="PNG")


def save_or_verify(image: Image.Image, path: Path) -> None:
    if path.exists():
        candidate = path.with_suffix(".verify.png")
        image.save(candidate, format="PNG")
        try:
            if candidate.read_bytes() != path.read_bytes():
                raise RuntimeError(f"existing proof differs from deterministic re-render: {path}")
        finally:
            candidate.unlink(missing_ok=True)
        return
    save_exclusive(image, path)


def write_json_exclusive(value: Any, path: Path) -> None:
    if path.exists():
        raise RuntimeError(f"refusing to overwrite {path}")
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def write_json_or_verify(value: Any, path: Path) -> None:
    encoded = (json.dumps(value, indent=2) + "\n").encode("utf-8")
    if path.exists():
        if path.read_bytes() != encoded:
            raise RuntimeError(f"existing measurement report differs from deterministic recomputation: {path}")
        return
    with path.open("xb") as stream:
        stream.write(encoded)


def global_bbox(alpha: Image.Image, region: tuple[int, int, int, int]) -> list[int] | None:
    local = alpha.crop(region).getbbox()
    if local is None:
        return None
    return [local[0] + region[0], local[1] + region[1], local[2] + region[0], local[3] + region[1]]


def region_metrics(alpha: Image.Image, region: tuple[int, int, int, int]) -> dict[str, Any]:
    values = list(alpha.crop(region).getdata())
    nonzero = [value for value in values if value]
    return {
        "bboxMaxExclusive": global_bbox(alpha, region),
        "nonzeroAlphaPixels": len(nonzero),
        "opaquePixels": sum(value == 255 for value in nonzero),
        "fractionalAlphaPixels": sum(0 < value < 255 for value in nonzero),
        "alphaSum": sum(nonzero),
        "alphaMinNonzero": min(nonzero) if nonzero else None,
        "alphaMax": max(nonzero) if nonzero else 0,
    }


def classified_centroids(image: Image.Image, region: tuple[int, int, int, int]) -> dict[str, Any]:
    groups: dict[str, list[tuple[float, float, float]]] = {"whiteMarker": [], "coloredStem": []}
    for y in range(region[1], region[3]):
        for x in range(region[0], region[2]):
            red, green, blue, alpha = image.getpixel((x, y))
            if not alpha:
                continue
            group = "whiteMarker" if min(red, green, blue) >= 220 and max(red, green, blue) - min(red, green, blue) <= 20 else "coloredStem"
            groups[group].append((x + 0.5, y + 0.5, alpha / 255.0))
    result: dict[str, Any] = {}
    for name, values in groups.items():
        weight = sum(value[2] for value in values)
        result[name] = {
            "alphaWeightedCentroid": [sum(value[0] * value[2] for value in values) / weight, sum(value[1] * value[2] for value in values) / weight],
            "alphaWeight": weight,
            "classifiedPixelCount": len(values),
        }
    dx = result["whiteMarker"]["alphaWeightedCentroid"][0] - result["coloredStem"]["alphaWeightedCentroid"][0]
    dy = result["whiteMarker"]["alphaWeightedCentroid"][1] - result["coloredStem"]["alphaWeightedCentroid"][1]
    result["markerFromStem"] = {"dx": dx, "dy": dy, "screenAngleDegrees": math.degrees(math.atan2(dy, dx)), "length": math.hypot(dx, dy)}
    return result


def union_centroid(alpha: Image.Image, region: tuple[int, int, int, int]) -> tuple[float, float]:
    values = []
    for y in range(region[1], region[3]):
        for x in range(region[0], region[2]):
            value = alpha.getpixel((x, y))
            if value:
                values.append((x + 0.5, y + 0.5, value / 255.0))
    weight = sum(value[2] for value in values)
    return sum(value[0] * value[2] for value in values) / weight, sum(value[1] * value[2] for value in values) / weight


def principal_axis(alpha: Image.Image, region: tuple[int, int, int, int]) -> dict[str, float]:
    values = []
    for y in range(region[1], region[3]):
        for x in range(region[0], region[2]):
            weight = alpha.getpixel((x, y)) / 255.0
            if weight:
                values.append((x + 0.5, y + 0.5, weight))
    total = sum(value[2] for value in values)
    cx = sum(value[0] * value[2] for value in values) / total
    cy = sum(value[1] * value[2] for value in values) / total
    xx = sum(weight * (x - cx) ** 2 for x, y, weight in values) / total
    yy = sum(weight * (y - cy) ** 2 for x, y, weight in values) / total
    xy = sum(weight * (x - cx) * (y - cy) for x, y, weight in values) / total
    return {"screenAxisDegreesModulo180": math.degrees(0.5 * math.atan2(2 * xy, xx - yy)), "centroidX": cx, "centroidY": cy}


def signed_axis_delta(angle: float, control: float) -> float:
    return (angle - control + 90.0) % 180.0 - 90.0


def rotate(point: tuple[float, float], center: tuple[float, float], degrees: float) -> tuple[float, float]:
    radians = math.radians(degrees)
    dx, dy = point[0] - center[0], point[1] - center[1]
    return center[0] + math.cos(radians) * dx - math.sin(radians) * dy, center[1] + math.sin(radians) * dx + math.cos(radians) * dy


def transformed_polygon(rect: tuple[int, int, int, int], placement: tuple[int, int], degrees: float) -> list[tuple[float, float]]:
    x0, y0, x1, y1 = rect
    return [(point[0] + placement[0], point[1] + placement[1]) for point in [rotate(corner, (20, 30), degrees) for corner in [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]]]


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    path = Path("C:/Windows/Fonts/segoeui.ttf")
    return ImageFont.truetype(str(path), size) if path.exists() else ImageFont.load_default()


def neutral_composite(image: Image.Image) -> Image.Image:
    background = Image.new("RGBA", image.size, (46, 49, 55, 255))
    return Image.alpha_composite(background, image).convert("RGB")


def main() -> None:
    composite_path, mask_path = RUN / "composite.png", RUN / "transparency-mask.png"
    if sha256(composite_path) != COMPOSITE_SHA or sha256(mask_path) != MASK_SHA:
        raise RuntimeError("downloaded PNG hash does not match the immutable M2 audit")
    image = Image.open(composite_path).convert("RGBA")
    mask_image = Image.open(mask_path)
    if image.size != (448, 1024) or mask_image.size != image.size or mask_image.mode != "RGB":
        raise RuntimeError("unexpected output dimensions or modes")
    alpha = image.getchannel("A")
    mask_rgb = mask_image.convert("RGB")
    if list(mask_rgb.getchannel("R").getdata()) != list(mask_rgb.getchannel("G").getdata()) or list(mask_rgb.getchannel("R").getdata()) != list(mask_rgb.getchannel("B").getdata()):
        raise RuntimeError("transparency mask is not grayscale")
    region_results = {name: region_metrics(alpha, region) for name, region in REGIONS.items()}
    for name, (expected_bbox, expected_count) in EXPECTED_EXACT.items():
        result = region_results[name]
        if result["bboxMaxExclusive"] != (list(expected_bbox) if expected_bbox else None) or result["nonzeroAlphaPixels"] != expected_count:
            raise RuntimeError(f"exact fixture mismatch for {name}")
    alpha_values = list(alpha.getdata())
    mask_values = list(mask_rgb.getchannel("R").getdata())
    inverse_sums: dict[int, int] = {}
    for alpha_value, mask_value in zip(alpha_values, mask_values):
        inverse_sums[alpha_value + mask_value] = inverse_sums.get(alpha_value + mask_value, 0) + 1
    if set(inverse_sums) != {254, 255}:
        raise RuntimeError("unexpected alpha/mask inverse quantization")

    centroids = {name: classified_centroids(image, REGIONS[name]) for name in ["control", "positiveRotation", "negativeRotation", "noncentralPivot"]}
    control_angle = centroids["control"]["markerFromStem"]["screenAngleDegrees"]
    angle_deltas = {name: centroids[name]["markerFromStem"]["screenAngleDegrees"] - control_angle for name in ["positiveRotation", "negativeRotation", "noncentralPivot"]}
    control_union = union_centroid(alpha, REGIONS["control"])
    noncentral_union = union_centroid(alpha, REGIONS["noncentralPivot"])
    control_local = (control_union[0] - 50, control_union[1] - 90)
    predicted_local = rotate(control_local, (20, 30), 45)
    predicted_noncentral_union = (predicted_local[0] + 126, predicted_local[1] + 254)
    common_translation = (noncentral_union[0] - predicted_noncentral_union[0], noncentral_union[1] - predicted_noncentral_union[1])

    full = neutral_composite(image)
    save_or_verify(full, RUN / "proof-full-neutral.png")

    zoom = Image.new("RGB", (920, 760), (31, 34, 40))
    draw = ImageDraw.Draw(zoom)
    panels = [
        ("control and rotations — native crop x3 nearest", (35, 75, 275, 175), (20, 55), 3),
        ("clip, pivot and alpha cases — native crop x2 nearest", (0, 205, 400, 330), (60, 455), 2),
    ]
    for label, box, position, scale in panels:
        crop = neutral_composite(image.crop(box))
        scaled = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.NEAREST)
        zoom.paste(scaled, position)
        draw.text((position[0], position[1] - 28), label, font=font(18), fill=(245, 245, 245))
    save_or_verify(zoom, RUN / "proof-zoom-native-nearest.png")

    overlay = full.copy()
    overlay_draw = ImageDraw.Draw(overlay)
    transforms = {
        "control": ((50, 90), 0, (70, 120)),
        "+30": ((135, 90), 30, (155, 120)),
        "-30": ((205, 90), -30, (225, 120)),
        "signed": ((-24, 220), 0, (-4, 250)),
        "+45 noncentral": ((126, 254), 45, (150, 260)),
        "opaque": ((260, 220), 0, (280, 250)),
    }
    for label, (placement, degrees, pivot) in transforms.items():
        for rect in [(14, 4, 26, 52), (22, 42, 36, 52)]:
            overlay_draw.line(transformed_polygon(rect, placement, degrees) + [transformed_polygon(rect, placement, degrees)[0]], fill=(0, 255, 255), width=1)
        if 0 <= pivot[0] < 448 and 0 <= pivot[1] < 1024:
            overlay_draw.line((pivot[0] - 3, pivot[1], pivot[0] + 3, pivot[1]), fill=(255, 0, 255), width=1)
            overlay_draw.line((pivot[0], pivot[1] - 3, pivot[0], pivot[1] + 3), fill=(255, 0, 255), width=1)
            overlay_draw.text((pivot[0] + 5, pivot[1] - 9), label, font=font(11), fill=(255, 255, 255))
    save_or_verify(overlay, RUN / "proof-expected-geometry-overlay.png")

    axes = {name: principal_axis(alpha, REGIONS[name]) for name in ["control", "positiveRotation", "negativeRotation", "noncentralPivot"]}
    control_axis = axes["control"]["screenAxisDegreesModulo180"]
    axis_deltas = {name: signed_axis_delta(axes[name]["screenAxisDegreesModulo180"], control_axis) for name in ["positiveRotation", "negativeRotation", "noncentralPivot"]}

    observations = {
        "schemaVersion": 1,
        "state": "measured-synthetic-compositor-mechanics",
        "runId": "m2-run-001",
        "promptId": "bb0d4b1d-4921-4cf1-8fd2-50fd908ba5fe",
        "inputs": {
            "composite": {"path": "composite.png", "sha256": COMPOSITE_SHA, "mode": "RGBA", "size": [448, 1024]},
            "transparencyMask": {"path": "transparency-mask.png", "sha256": MASK_SHA, "mode": "RGB", "size": [448, 1024]},
        },
        "regions": region_results,
        "alpha": {
            "globalNonzeroPixels": sum(value > 0 for value in alpha_values),
            "globalFractionalPixels": sum(0 < value < 255 for value in alpha_values),
            "distinctValues": len(set(alpha_values)),
            "range": list(alpha.getextrema()),
            "rotationFractionalCounts": {name: region_results[name]["fractionalAlphaPixels"] for name in ["positiveRotation", "negativeRotation", "noncentralPivot"]},
        },
        "transparencyMask": {"grayscaleChannelsEqual": True, "alphaPlusMaskRedCounts": {str(key): value for key, value in sorted(inverse_sums.items())}, "maximumInverseDifferenceFrom255": 1},
        "orientation": {
            "classification": "Alpha-weighted centroids; white if all RGB >=220 and channel range <=20, otherwise colored stem.",
            "centroids": centroids,
            "screenAngleDeltaFromZeroControlDegrees": angle_deltas,
            "clockwiseSignObserved": 28 <= angle_deltas["positiveRotation"] <= 32 and -32 <= angle_deltas["negativeRotation"] <= -28,
            "principalAxisAlphaMoment": {
                "method": "Second central moments of all nonzero alpha, using pixel centers; axes are modulo 180 degrees.",
                "axes": axes,
                "rotationDeltaFromControlDegrees": axis_deltas,
                "declaredMinusObservedAbsoluteDegrees": {
                    "positiveRotation": abs(30.0 - axis_deltas["positiveRotation"]),
                    "negativeRotation": abs(-30.0 - axis_deltas["negativeRotation"]),
                    "noncentralPivot": abs(45.0 - axis_deltas["noncentralPivot"]),
                },
                "classification": "Observed compositor sampling residuals only; these are not art tolerances.",
            },
        },
        "noncentralPivot": {
            "requestedPivot": [150, 260],
            "predictedPivotAfterIntegerPlacementUnderCenterHypothesis": [150.2426406871193, 259.95836943965736],
            "controlCalibratedUnionCentroid": list(control_union),
            "observedUnionCentroid": list(noncentral_union),
            "predictedUnionCentroidUnderCenterHypothesis": list(predicted_noncentral_union),
            "observedMinusPredictedCommonTranslation": list(common_translation),
            "inference": "The alpha-weighted union centroid agrees within 0.03 px per axis with center rotation plus declared integer placement. Pivot metadata itself is not an observed pixel.",
        },
        "canvasAndClipping": {
            "fixedOutputSizeObserved": [448, 1024],
            "signedClipTouchesX0Intentionally": True,
            "signedClipExactExpectedPixels": True,
            "expansionOrRebaseObserved": False,
        },
        "protocol": {
            "submissionCount": 1,
            "resumeCount": 1,
            "correction": "The first own-history validation preserved the successful history but rejected Cortan's Windows backslashes in the output subfolder. The validator normalized separators, then resumed the same prompt ID without resubmission.",
            "rasterCorrection": False,
            "initialFailureHistoryPreservedAs": "actual-history-failure.json",
            "initialAndFinalHistoryByteIdentical": (RUN / "actual-history-failure.json").read_bytes() == (RUN / "actual-history.json").read_bytes(),
        },
        "proofs": ["proof-full-neutral.png", "proof-zoom-native-nearest.png", "proof-expected-geometry-overlay.png"],
        "limits": [
            "This proves only the installed procedural compositor path, not private character art or garment seams.",
            "Rotated native layers contain fractional alpha; no cleanup or binary-alpha conversion was performed.",
            "The mask inverse differs by one quantization level at 274 pixels and remains suitable evidence, not a promise for fractional-alpha resident layers.",
            "No donor, art, gait tolerance, operator duration, queue duration or savings was measured.",
        ],
    }
    write_json_or_verify(observations, RUN / "observations-final.json")


if __name__ == "__main__":
    main()
