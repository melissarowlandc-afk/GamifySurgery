# Endoscopy isolated-proof atlas provenance

The proof uses five parent-reviewed PNG sources from `Photos for Codex 2/Codex Rooms 2/GS-015/`:

- `endoscopy-equipment-south-01.png` (2048 x 768): South-facing tower, cabinet, and sink.
- `endoscopy-equipment-east-01.png` (2048 x 768): fresh 90-degree-counterclockwise room view; west sides predominate and the furniture fronts face East.
- `endoscopy-bed-south-01.png` (1536 x 1024): empty head-North procedure bed.
- `endoscopy-bed-east-02.png` (1619 x 971): compact higher-camera empty head-West procedure bed. Revision 01 is preserved beside it but is unused because its profile was too long and thin.
- `endoscopy-occupied-beds-dark-01.png` (1536 x 1024): the approved dim-room occupied replacements for both cardinal views, with the larger generic covered patient and head. The left sprite is head-North with the face turned West; the right sprite is head-West with the face turned South.

Each prompt is preserved next to its PNG as `<source-name>.prompt.txt`. `pack-assets.py` performs technical processing only: alpha-at-least-16 bounding boxes, ten transparent pixels of padding, removal of sub-threshold alpha haze, cardinal-frame packing, and WebP encoding at quality 72. It does not repaint, reshape, rotate, or synthesize source pixels.

`south.json` and `east.json` record every source size, solid-alpha bound, padded crop, packed frame, and source-global floor contact. `sprite-config.json` records crop-relative contacts and presentation heights. The South tower/cabinet/sink render at 165/80/105 pixels; their East side views render at 165/120/125 pixels so their broad top surfaces remain substantial. The South empty and occupied tables render at 205 pixels. The compact East empty and occupied tables render at 110 pixels; the empty frame remains about 195 pixels wide.

The logical table ground is shared by both empty and occupied states. The source-measured `procedureAttach` point is exported separately for future state handoff; no individual patient sprite is drawn in the occupied state. The exact behavior boundary is in `handoff-contract.json`.

For the East table, ground registration uses the right/east foot-end wheel contact (`1161.5,474` empty and `1450,825` occupied in their respective source files), rather than the image center. The rotated logical ground `(1.95,2.5)` therefore remains the rotated South foot contact. It places the patient approach `(2.3,2.5)` beyond the foot instead of inside the bed art. The East-empty source also contained a detached low-alpha speck below the bed; the clean solid component bound ends at source y=474 and excludes that speck from the technical crop.

The occupied South crop uses solid bounds `(73,51)..(532,974)` and ground `(302.5,974)`. The occupied East crop uses solid bounds `(593,328)..(1527,825)` and ground `(1450,825)`. These presentation contacts register the replacement frames; empty and occupied states continue to share the same logical ground, footprint and navigation blocker. The exact generation/edit prompt is preserved as `endoscopy-occupied-beds-dark-01.prompt.txt` beside the approved source PNG.

The packed WebPs are preview derivatives only. The PNGs remain the canonical art sources.
