# Reauthored pilot — source preparation

Date: 2026-09-12. Built-in imagegen was used; no CLI/API fallback.
These are working animation layers for two approved designs, not new designs.
Original references are immutable. Owner accepted the animated two-character
result on 2026-09-12, manifest bd090ff4c1647a43c65b4ff0eda3fcbce5003525669e6c9dbe0c43ed16d0d842.
The next authorized scope is two additional examples; no game integration.

## Selected pilot binding outcome

All eight views are measured in `tools/character-mapping/reauthored-pilot/source-profiles.json`.
Approved original heads replace generated heads. Torso crops must begin below
all generated face/hair/beard pixels; verify naked torso layers before assembly.
Confirm actual facing from the source image: the far-right walking cell is East,
not West. West heads use the original top-row West standing view.

Measure anatomical wrist independently from a rolled-sleeve cuff. Measure ankle
and shoe sole separately. Use fixed view-level calibration and complete source
widths, with hidden shoulder/hip overlap. Shoes use rigid ankle-bound regions
overlapping trouser fabric at the authored cuff; never shrink them per pose to
avoid folded geometry. Render all eight phases and check both individual limbs
and the assembled character for gaps, folds, matte fringes and duplicate layers.
Inspect light/dark backgrounds and normal display scale as well as contact sheets.

Refinement review adds a per-character chirality requirement: the thumb side
should read anterior to the body in a relaxed arm position. View labels alone
do not establish this. Olive North's authored hands read naturally; gray North
requires local arm reflection while preserving anatomical left/watch ownership.
Fit the visible sleeve cap as well as the shoulder pivot. A source anchor buried
too far inside a rounded cap can make a correctly located pivot look shrugged.
Check South standing separately, then profile swing extremes and passing poses.

This pilot establishes two accepted examples, not automatic roster readiness.
The final package includes new walk/standing assemblies and original sitting
references; sitting/bed rig binding still needs a separate proof before rollout.

## Inputs and selected outputs

- Olive reference: `Photos for Codex 2/Patients or Staff or Other Characters/exec-06e158f5-4ec0-4b07-b336-befe1f93b121.png`.
- Gray reference: `Photos for Codex 2/Patients or Staff or Other Characters/exec-33437146-564e-4cb1-a7e2-ad41504ea752.png`.
- Olive selected source: `olive-rig-ready-v1.png`, copied from generated `exec-f4ba0ea4-ff6d-4dc3-929a-588b58d6e107.png`.
- Gray selected source: `gray-rig-ready-v1.png`, copied from generated `exec-319e0f60-b5d3-4187-9fdd-dbda4e280a29.png`.

Original generation files remain under the task's `.codex/generated_images`
directory. The selected project sources live here and must not be overwritten.

## Production prompt specification

Preserve the exact reference character's identity, face, hair, clothing,
accessories, colors and pixel-art style. Reauthor complete unoccluded neutral
animation parts, not cropped fragments of overlapping posed illustrations.
Four rows are South/front, East/right profile, North/back, West/left profile.
Six columns are assembled reference, head plus full torso core, anatomical left
arm including connected hand, anatomical right arm including connected hand,
anatomical left leg including connected shoe, anatomical right leg including
connected shoe. Include covered shoulder/hip surfaces for under-torso overlap.
Keep all parts complete, with generous background padding, substantial garment
thickness, no chopped joints or detached hands/feet. Both shoes in a side-view
row face the same direction. Gray's watch belongs only to anatomical left.
No labels, gridlines, scenery, additional objects or exterior shadows.

The initial transparency request produced a baked checkerboard and was rejected.
The selected atlas instead uses flat magenta #FF00FF for deterministic source
extraction. Extracted assets must have real alpha, no remaining magenta fringe,
and no global removal of white/cream/gray clothing pixels.

## Final targeted edit prompts (verbatim)

Olive:

> Change ONLY the dark hollow armholes and gold rims on the four SECOND-COLUMN torso pieces. Fill those dark holes and gold rims with matching olive jacket fabric so each detached torso has a solid seamless shoulder/side surface for attaching the separatearm layers. NO sleeves or armstubs added. No black holes or goldrings remain on the torso. Preserve all other pixels, layout, faces, completeparts, colors, flatmagenta background. This is an invisible hidden-surface preparation correction, not a designchange.

Gray:

> Change ONLY the SECOND COLUMN in ALL FOUR rows of this production atlas. Remove the gray sleeves and all protruding armstubs from those four head+torso pieces completely. Result: a sleeveless gray OVERSHIRT TORSO CORE retaining the full original shirt length, chestpocket, buttons, sides, hem and whiteT-shirt, connected to unchanged head. Reconstruct smooth solid gray fabric at shoulders and sides under removedsleeves. NO actual holes, dark sockets, circles or goldrings. No sleeves/arms/hands in these torso pieces. Preserve torso width and length and everyfacepixel. Allother20cells EXACTLYunchanged includingcompletearms withtheirhands andlegswithshoes. Keepflatmagenta #FF00FFbackground andsame1536x1024layout. These are torso layers of a puppet, whose sleeves are separate parts in columns3and4.

## Binding requirements discovered in review

The generated assembly references have a larger head/body ratio than the
approved originals. They do not redefine the approved proportions. Prefer
original native-view head artwork as the identity anchor, with the newly
prepared complete torso and limbs. Measure and normalize each source part once;
do not force its width into the old narrow strips. Preserve the prepared
hand/shoe within its connected limb surface. Review the complete neutral
assembly against the approved original before accepting moving frames.
