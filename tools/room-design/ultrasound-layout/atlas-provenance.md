# Ultrasound Room revision-02 art provenance

- Parent-reviewed source: `Photos for Codex 2/Codex Rooms 2/GS-015/ultrasound-furniture-atlas-02.png` (1225 × 1284 RGBA; exact prompt beside it).
- Alpha ≥32 connected-component bounds: bed `(45,266,779,599)`, console `(849,46,1173,643)`, cabinet `(229,662,530,1234)`, stool `(772,739,1107,1239)`. `pack-assets.py` adds an 8px technical crop margin.
- Contacts are the measured floor supports/casters: horizontal bed `(378,341)` within its crop, console `(144,604)` at the physical caster-body midpoint rather than the probe overhang, cabinet `(158,580)`, stool `(175,508)`.
- The patient seat is the horizontal bed's south/front mattress lip near the east foot `(669.667,167)`; its projected screen x aligns with the stool seat's shared logical x=2.2. Stool seat is `(175,236)`, roughly 48px above the floor at its rendered width.

`pack-assets.py` performs crop/packing into `ultrasound-assets.webp` only. It preserves orientation, pixel content, and source aspect; no original raster is changed.


## Revision-03 wall print and scale audit

- Parent-reviewed wall asset: `Photos for Codex 2/Codex Rooms 2/GS-015/ultrasound-wall-print-01.png` (1086 × 1448 RGBA; exact prompt beside it). Alpha ≥32 bounds are `(155,250,940,1212)` and the packed crop adds 8px margins. It is center-registered in the N2 tall wall at 0.4 tile (48px), with no floor footprint; the complete group hides for open or backed N2.
- No furniture was resized. The revision-02 table remains 1.8 tiles (216px) wide with a 50.1px patient lip rise; stool remains 0.52 tile (62.4px) wide with a 48.4px technician seat rise; console remains 0.78 tile (93.6px) wide. The new horizontal-art silhouettes are shorter than revision-01 (stool 91.7px versus 100.2px, console 168.8px versus 181px), which can change perceived scale without a width or seat-height regression.
- Console registration now places its floor contact at C1 north edge `(0.8,2.33)`. The declared south lane from `(0.2,2.7)` to `(1.4,2.7)` is `front-of-console`; it is a preview-layer contract only and does not modify runtime sorting.
