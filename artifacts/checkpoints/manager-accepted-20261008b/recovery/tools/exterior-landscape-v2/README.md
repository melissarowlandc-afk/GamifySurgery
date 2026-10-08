# Frozen site-wide landscaping v2

Owner refinement, 2026-10-08: one shared landscape over the entire grass site,
with natural irregular placement, groves, meadows and varied sizes. This replaces
both the garden-cell and lawn-patch lattices. Accepted Option B beds, paving,
curb, entry inset, trees and all other runtime PNGs remain unchanged.

## Frozen data and offline authoring

[Runtime source data](../../apps/player/src/facility/data/exterior-landscape-v2.json)
contains one 96x64 layout: 1,320 plants and 95 lawn overlays. The active 72x32
site uses 479 complete plant envelopes and 30 complete rotated lawn patches
before construction filtering. Legacy 64x40 and the 96x64 expansion fixture
crop the same data; no scaling, tiling, repetition or runtime reseeding.

`generate_layout.py`, seed **2026100802**, uses uniform continuous random darts
over the entire site and variable-radius Poisson-disc separation. Twenty-five
unequal rotated groves, five authored irregular meadows and independent flower
pockets vary density. Trees, shrubs, flowers and grass have independently sampled
positions and widths; a grove has no mandatory repeated set of companions.
Spatial bins only accelerate distance queries; they never seed cell motifs.
Lawn overlays use continuous site-wide contacts, unequal broad sizes, opacity,
rotation and flips. All random work happens offline. The game imports the frozen
JSON and derives each height from its existing native sprite measurement.

Frozen SHA-256:

    c939be12bfe7a089b50b80d3c6bec46587db856e8bf6ac39ed45c0710e22a824

Verify reproducibility without writing:

    python tools/exterior-landscape-v2/generate_layout.py --check

To intentionally author a new revision, run without `--check`, review the whole
site and update tests/proofs before accepting a new frozen file. Generation is
not called by a build, redraw, campaign creation, load, pan or construction.
The extent covers the current site and existing expansion fixtures. A future
world beyond 96x64 needs an explicit authored data revision, never tiled copies.

## Existing art inventory

No new game art was made. `sources.py` reads source rectangles and native anchors
from the bitmap manifest. Trees/shrubs/flowers reuse the unchanged landscaping
atlas; grass/lawn reuse the unchanged frontage-v2 PNGs. All are uniformly scaled.

| Sprite | Native pixels | Native anchor | Frozen world width |
| --- | --- | --- | --- |
| tree-round | 321x345 | 160.5,345 | 0.65-2.65 tiles |
| tree-open | 286x342 | 143,342 | 0.65-2.65 tiles |
| tree-column | 266x337 | 133,337 | 0.65-2.65 tiles |
| tree-crown | 271x307 | 135.5,307 | 0.65-2.65 tiles |
| shrub-cluster | 326x197 | 163,197 | 0.45-1.50 tiles |
| shrub-round | 205x198 | 102.5,198 | 0.45-1.50 tiles |
| shrub-small | 153x144 | 76.5,144 | 0.45-1.50 tiles |
| flowers-white | 201x172 | 100.5,172 | 0.72-1.28 tiles |
| flowers-yellow | 196x160 | 98,160 | 0.72-1.28 tiles; rare, north only |
| flowers-pink | 199x173 | 99.5,173 | 0.72-1.28 tiles |
| grass-low/clover/upright-v2 | 64x32 each | 32,28 | 0.26-0.82 tiles |
| lawn-sage/olive-v2 | 256x128 each | 128,64 | 4.30-13.50 tiles; alpha 0.16-0.32 |

## Placement and density verification

Focused tests check frozen contacts, all 13 plant frames, native proportions,
unique keys and module reload, no runtime RNG, full-site density and sector
coverage, varied grove populations, expansion stability, complete low-zoom
room/hallway/entrance/sidewalk exclusions, exact intersecting removal and contact
order. Lawn tests include rotation bounds, variation and immutable contacts.

The independent density audit uses half-tile bins only for analysis and scans
axis offsets 3-16 tiles. Both plant and lawn correlations must stay below 0.09;
a repeating-grid control must exceed 0.25. Groves and local Poisson separation
are allowed; the test targets periodic repetitions rather than uniform density.

    python tools/exterior-landscape-v2/audit_layout.py

[Audit output](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/layout-audit.json):

| Active 72x32 measurement | Previous cells | Frozen v2 |
| --- | --- | --- |
| Maximum plant-density axis correlation | 0.133454 | 0.021222 |
| Maximum lawn-density axis correlation | 0.164171 | 0.057696 |
| Plant density per tile, before construction | 0.230903 | 0.207899 |

The v2 8x8 analysis sectors contain 7-26 plants (density coefficient of variation
0.339741); the full 96x64 field has 4-27 per sector. These are coverage statistics,
not placement cells. Runtime getters crop full bounds; construction filters the
exact complete source/shadow/clearance/raster envelopes and keeps all other
contacts unchanged. Existing background contact sorting is retained.

## Offline placement proofs

    python tools/exterior-landscape-v2/render_preview.py --include-minimum

The proof uses existing runtime sprite pixels, the tree-gap cleanup rule,
native anchors/proportions, contact sorting and starter-room/entrance/sidewalk
exclusions. The Front Desk is explicitly a QA footprint marker, not new room
art. Approved frontage PNGs are composited unchanged for orientation. Pillow
resampling/rounding is an approximation of Canvas; live browser QA remains
required. The fixture is a 920x325 viewport, active 72x32 site, DPR 1. A whole-site
sheet expands past the viewport instead of cropping to the default camera.

| Equivalent game zoom | Computed tile size | Whole-site proof |
| --- | --- | --- |
| 30% | 15px | [New](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/landscape-v2-30.png) / [previous](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/previous-30.png), 1136x593 |
| 70% | 28px | [New](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/landscape-v2-70.png) / [previous](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/previous-70.png), 2072x1022 |
| Minimum 10% | 9px | [New](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/landscape-v2-10.png) / [previous](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/previous-10.png), 704x395 |

The comparisons capture the intake helpers' output; optional `--previous`
accepts that task-local snapshot. Current snapshot:
`.local-dev/exterior-frontage/landscape-v2-baseline/previous-layout.json`.
[Receipt](../../docs/design/exterior-frontage/qa-20261008/landscape-v2/preview-receipt.json)
records layout/output hashes, dimensions and actual pixel scales. New proofs are
reproducible from the repository source data and installed Pillow alone.

Worker-side validation: focused 77/77 pass; all seven workspace typechecks pass;
native-config player build passes (594 modules). Full player is 1111 passed / one
known unrelated thyroid pending-label failure. Browser spec strictly typechecks
and discovers 12 tests; browser execution remains with the manager. Exact logs
and scoped byte/hash review are under `.local-dev/exterior-frontage/landscape-v2-*`.
