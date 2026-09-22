# Examination furniture atlas technical provenance

- Original: `Photos for Codex 2/Codex Rooms 2/GS-015/examination-furniture-atlas-01.png`
- Original SHA-256: `913F903EC0FAE53F0362BC4C15B5A08123FB0D3436DEAF59C738BBBC63364202`
- Original format: 1254 × 1254 RGBA PNG, retained unchanged
- Technical preview: `examination-furniture-atlas-01.webp`
- Preview SHA-256: `7170A690A61C26059B74BD8CC64E6D58B2F6E98CAE364DBABE01D5D547E2D2B8`
- Conversion: Pillow `RGBA` input saved as lossless WebP with `method=6`; no resize, repaint, regeneration, or semantic edit
- Alpha measurement threshold: `alpha >= 32`

Coordinates below are source-atlas pixels. Crop boxes use `(left, top, width, height)`. Base references use crop-local `(left, right-exclusive, bottom-exclusive)` coordinates from the final thresholded alpha row.

| Fixture | Alpha crop | Source base reference |
| --- | --- | --- |
| Examination table | `(200, 60, 264, 545)` | `(44, 213, 545)` |
| Sink cabinet | `(763, 157, 322, 426)` | `(40, 282, 426)` |
| Rolling stool | `(201, 799, 264, 357)` | `(124, 140, 357)` |
| Diagnostic panel | `(780, 792, 296, 338)` | `(99, 120, 338)` |

`analyze-atlas.py` reproduces the threshold boxes, bottom-row evidence, and lossless preview conversion.

## Horizontal bed revision

- Original: `Photos for Codex 2/Codex Rooms 2/GS-015/examination-bed-east-02.png`
- Original SHA-256: `C47CC4F81EE6C62134ED6083EFF48614054FC2AA7A36772A25933CBEAFAB2A8A`
- Original format: 1536 × 1024 RGBA PNG, retained unchanged
- Technical crop: `examination-bed-east-02.webp`
- Technical crop SHA-256: `B37C1A5514717CC56F3C1890D5C6D7B0A5BEC7334739826FCFFF77DB67D59833`
- Solid-body crop at `alpha >= 200`: source box `(198, 271, 1215, 492)`
- Crop-local floor-contact reference: `(57, 1148, 492)`
- Crop-local near cushion edge: `y=264`
- Conversion: Pillow cropped exact source pixels and saved RGBA lossless WebP with `method=6`; no resampling, rotation, repaint, regeneration, or semantic edit

The isolated proof draws the supplied east-facing source unchanged. Its chair-seat comparison uses floor contact to the near cushion edge, rather than total sprite height. At the selected scales, bed and stool each rise about 30.4 canvas pixels from floor contact to that seat edge.

The self-contained fragment also uses `examination-props-01.webp`, a crop-only strip containing the unchanged sink, stool, and diagnostic source pixels. It is 882 × 426 and has SHA-256 `A0298C96073E4482C3A0DEC05EDBD4555F30F1035CC6C0403E686137EE3EBEF3`. The strip coordinates are sink `(0,0,322,426)`, stool `(322,69,264,357)`, and diagnostic `(586,88,296,338)`; source-atlas coordinates and base references remain those above. `analyze-bed.py` and `analyze-atlas.py` reproduce both technical assets.

## Compact bed and west-view assets

Original PNGs remain unchanged: `examination-bed-east-03.png` SHA-256 `3871830DABB4D3632664E0A95A8362F4D990AD99ED552B855B0A3CEE7CC3B70F`, `examination-bed-north-03.png` SHA-256 `9D1F9A053AA1122ED5F86EBCB3DB077E8E859376D4D2C5EDBEE70D56126FFA3B`, and `examination-sink-west-01.png` SHA-256 `3380F8ABA7CB09D8413DA7CE7D51895A5F0C5B0035EAFE6238248CF89C929741`. Their alpha >= 200 technical crops are `(259,205,1077,586)`, `(336,75,487,1219)`, and `(435,194,397,827)`. Lossless technical WebPs remain beside the proof.

Separately named `-display.webp` files use Pillow WebP quality 88, method 6, at unchanged crop dimensions so the self-contained fragment remains below 1 MB. These are browser-preview encodings, with no warp, repaint, or semantic edit.
