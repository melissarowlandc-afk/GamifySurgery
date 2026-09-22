# Peri-op / Recovery 6 x 6 proof provenance

Canonical parent-reviewed RGBA sources are under `Photos for Codex 2/Codex Rooms 2/GS-015/`; each generated source retains its prompt beside it.

- `recovery-beds-cardinal-03.png` supplies head-North, head-South, head-West and head-East beds derived to match the approved Examination geometry.
- `recovery-station-04.png` supplies the two-monitor blue nursing counter. Its source base reference `x=184..1072`, `y=1005` maps uniformly to 240 pixels; the `y=660` facade edge gives a 93.24-pixel facade, within five pixels of the approved Front Desk reference.
- `recovery-monitors-cardinal-01.png` supplies inward-facing South, North, East and West monitor views.
- `recovery-bay-art-01.png` supplies eight distinct framed scenes. All eight remain assigned. Four render on the tall north wall at N1, N3, N4 and N6; N1/N6 replace the former partition-mounted placements and obey their new north door/backing ownership. The other view-occluded assignments do not create false side-wall billboards.
- `tools/room-design/examination-layout/examination-props-01.webp` supplies the exact approved 264 x 357 stool crop. It renders 60 pixels wide with a 50.68-pixel base-to-seat rise.

`pack-assets.py` performs technical processing only: source zoning, alpha-at-least-16 bounds, up to eight transparent pixels of padding, sub-threshold alpha cleanup, uniform scaling and a quality-74 WebP pack. It does not rotate, repaint or reshape source pixels. `recovery.json` records source sizes, visible bounds, padded crops, frames and global contacts. `sprite-config.json` records crop-relative contacts and scale metrics.

Bed scale follows the approved Examination physical contract rather than padded image boxes: 186 pixels long and 84 pixels wide at 120 pixels per tile. Source-derived Recovery cushion rises are approximately North 41.47, South 41.47, West 41.85 and East 41.50 pixels, within 1.5 pixels of Examination's 42.48/42.95-pixel references. The floor projection, elevated cushion contact, footprint and route approach remain separate.

The generated `recovery.webp` and self-contained HTML are preview derivatives. Original PNGs remain canonical.
