# Radiology Reading Room — layout study

This is a geometry and seated-character calibration study only. It does not create a proof, alter runtime, select clinical staffing, or authorize Level 4 gameplay.

The proposed room is **4 × 4 tiles** at 120 px per tile. It is viable at the established 0.18-tile actor radius, 0.04 lattice and 0.20 wall boundary, so no 5 × 5 enlargement is proposed. The deliberately quiet room has no added wall furniture: only the four central desks and four chairs are in scope. The four north backing states still belong to the room-shell control matrix even though no fixture hides for them.

The permanent central assembly follows the reference arrangement's clockwise pinwheel rather than a symmetric four-desk square: the NW desk arm extends west and attaches along the core's left edge, with a north chair facing south; the NE arm extends north from the core's top edge with an east chair facing west; the SE arm extends east from the core's right edge with a south chair facing north; the SW arm extends south from the core's bottom edge with a west chair facing east. Thin dividers project along the matching arm edges and slightly beyond their desk tips. This is an original, orthographic game adaptation, not a copied set plan or visual replica.

Four existing shipped seated sprites are proposed solely as cardinal-pose references. The `role` labels in `seat-sources.json` are deliberately placeholders and make no clinical staffing claim. The proof must retain each identity’s normal scale and align that pose’s authored seat-contact anchor to its owning chair.

Furniture scale targets are the established 80 px desk worktop rise and 45 px chair seat rise. The desk arms occupy a 2.60 × 2.60 tile central footprint before the surrounding chairs, preserving a roughly 145 px individual-arm visible length at the intended art calibration rather than shrinking the furniture uniformly. For every facing, groundY minus seatContactY is the image-vertical 45 px rise (0.375 tile); facing does not rotate the anchor relation. The physical collision data describes measured opaque floor-contact bases; pixel-art dividers, screens, chair backs and desktops remain separately documented visual projections rather than generic rectangular blockers.

After selected art packing, these active values superseded the abstract first
pass. The NW base reaches its measured feet, the continuous SE base includes
its opaque bridge pixels, and chair blockers cover measured caster widths.
NW/NE contacts moved south or east to meet their worktops, SE moved west of its
continuous base, and SW moved west so its reader remains legible. The original
pre-art values and hashes remain recorded under
`history/pre-art-reconciliation-2026-10-03/`.

`validate-layout.cjs` builds routes from the southwest circulation hub to all sixteen possible door segments and to all four approach transitions. It verifies each lattice path again at 0.005-tile interpolation, confirms contacts are inside their owning chairs, verifies all four source assets and hashes, and writes `route-audit.json`.

Run:

```powershell
node tools/room-design/level-4/radiology-reading/layout-study/validate-layout.cjs
```
