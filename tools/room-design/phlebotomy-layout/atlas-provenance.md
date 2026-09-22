# Phlebotomy Station proof art provenance

The proof uses parent-generated and parent-reviewed source sheets without semantic edits or pixel rotation:

- South source: `Photos for Codex 2/Codex Rooms 2/GS-015/phlebotomy-furniture-south-01.png`
- Current East source: `Photos for Codex 2/Codex Rooms 2/GS-015/phlebotomy-furniture-east-02.png`
- Current curtained-window source: `Photos for Codex 2/Codex Rooms 2/GS-015/phlebotomy-curtained-window-02.png`
- Exact prompts: the matching `.prompt.txt` files beside those sources
- Generation record: `Photos for Codex 2/Codex Rooms 2/GS-015/phlebotomy-art.md`

`south.webp`, `east.webp` and `window.webp` are alpha-preserving technical packs of the source rectangles recorded in `south.json`, `east.json` and `window.json`. The higher-camera East sheet is newly drawn cardinal art; the proof never rotates South pixels in the image plane. The earlier East technical pack and metadata are preserved as `east-01.webp` and `east-01.json` for comparison. The earlier outdoor-view window technical pack and metadata are preserved as `window-01.webp` and `window-01.json`; revision 02 replaces only the central view with a closed white translucent sheer and contains no recognizable exterior scenery.

## Registered source contacts

Coordinates below are relative to each packed crop. They are inspectable presentation anchors, not runtime character-fitting approval.

| View | Fixture | Ground contact | Visible seat contact | Rendered height |
| --- | --- | ---: | ---: | ---: |
| South | chair | (324, 730) | (324, 438) | 143 px |
| East 02 | chair | (319, 793) | (539, 512) | 164.45 px |
| South | stool | (202, 420) | (202, 100) | 66.25 px |
| East 02 | stool | (216, 498) | (217, 123) | 76.19 px |
| South | sink cabinet | (275, 680) | n/a | 120.73 px |
| East 02 | sink cabinet | (242, 804) | n/a | 138.84 px |

The East chair's source-derived visible seat contact is on the cushion front rather than the foreground armrest. It shifts 44.83 rendered pixels to the right of its ground contact and rises 57.26 pixels. The East stool rises 55.26 pixels, putting the two visible seat contacts within three rendered pixels while retaining their independently measured source contacts. Every fixture preserves its crop aspect ratio. East chair and stool render 15 percent taller than revision 01. The East sink remains 138.84 pixels tall; owner approval restored only the South sink to its pre-enlargement 120.73-pixel height.

## Spatial contract

- South room: 3 × 2, chair ground `(1.5, .98)`, stool ground `(1.5, 1.70)`, sink ground `(.43, .30)`.
- 90-degree counterclockwise transform: `(x, y) -> (y, 3 - x)`.
- East room: 2 × 3, chair ground `(.98, 1.5)`, stool ground `(1.70, 1.5)`. The sink retains nominal rotated ground `(.30, 2.57)` and uses an explicit art-only registration offset `(+.10,+.31)` to plant its physical base at `(.40,2.88)` near the south wall; its logical footprint and conflicts are unchanged.
- Chair blocker: South `x=1.05..1.95, y=.50...98`; East `x=.50...98, y=1.05..1.95`.
- The chair is permanent and solid. The stool is permanent and nonblocking. The sink/tube group is optional and nonblocking.
- Sink conflicts are world `N1`, `WA`, and backed `N1`; after rotation the door conflicts appear at local `WC` and `S1`, never `S2`.
- Patient/staff cardinal poses are South/North, then East/West after rotation. Actual occupied-character fitting remains a later runtime milestone.
- The South view installs 80-pixel curtained windows only on N2 and N3; N1 remains uninstalled even when the optional sink is hidden. The East view retains windows on N1 and N2. Each installed window is centered from `Y-86` through `Y-6`, wall-only and noncolliding, and hides independently for only its own north doorway or backed-north state.
- The floor is a continuous 24-pixel ivory terrazzo tile pattern with restrained rose and warm-gray variation. Its pattern origin is the room floor origin and continues through side half-seams and south floor-base apertures without resetting; no 120-pixel gameplay-cell grid is drawn.
