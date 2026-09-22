# Minor Procedure preview art provenance

- Parent-reviewed, owner-pending furniture source: `Photos for Codex 2/Codex Rooms 2/GS-015/minor-procedure-furniture-atlas-01.png` (1024 × 1536 RGBA). Its exact generation prompt is preserved beside it as `.prompt.txt`.
- Parent-reviewed, owner-pending replacement table: `Photos for Codex 2/Codex Rooms 2/GS-015/minor-procedure-table-north-02.png` (1024 × 1536 RGBA). Its exact prompt is preserved beside it.
- Parent-reviewed, owner-pending wall light: `Photos for Codex 2/Codex Rooms 2/GS-015/minor-procedure-wall-light-01.png` (1254 × 1254 RGBA). Its exact prompt is preserved beside it.
- `pack-assets.py` performs technical alpha-aware crops only. It does not rotate, stretch, repaint, or semantically edit a source sprite. The browser atlas is a quality-88 WebP display derivative; it is lossy and is not a replacement source asset.
- Replacement table crop: source `(235,143,790,1359)`, 555 × 1216. Measured non-shadow floor contact `(277.5,1212)` and near foot-seat attachment `(277.5,901)`.
- Original-atlas crops: trolley `(123,615,412,944)`, sink `(598,579,863,965)`, cabinet `(148,977,388,1454)`, stool `(597,1040,863,1467)`. Their measured floor contacts are recorded in `atlas.json`. The original floor-light crop is no longer packed or rendered.
- Wall-light crop: source `(398,159,867,1053)`, 469 × 894. Its source mounting point `(227,171)` registers to the center of the N2 wall; it has no floor contact or collision footprint.
- Stool crop is 266 × 427 with non-shadow floor contact `(132,423)` and lower-cushion attachment `(132,207)`.
- At preview scale the replacement table attachment rises 47.07px above its floor projection and the stool attachment rises 50.67px. The 3.60px difference is retained rather than stretching either asset. Actual occupied-character attachment remains unverified.
