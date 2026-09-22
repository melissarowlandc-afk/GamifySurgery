# Layered character pilot

> OWNER REJECTED v6 forward gait as regression. Do not treat its validated
> technical checkpoint as motion approval. Smooth sit/stand requirement removed;
> instant pose switches are explicitly acceptable. Active reset plan:
> docs/execplans/restore-walk-baseline.md. Freeze artwork and recover earlier walk.

## Goal
Owner rejected both previous fittings and approved rebuilding the existing
designs as animation-ready layered 2D artwork. First deliver Green cardigan
with a faithful standing appearance, a natural walking cycle and a convincing
sit-down sequence. Then test Gray braid using the same production system.

## Superseding decision
The fixed canonical silhouette is no longer the target for this pilot. Artwork
defines proportions and silhouette; bones provide pivots and movement. Preserve
old canonical files and original source sheets unchanged as historical inputs.
Do not claim previous technical checks imply owner appearance approval.

## Requirements
- Match existing identity, head/body ratio, hair/face, garment construction,
  painted pixel detail and outline at intended in-game size.
- Clean layered parts with reconstructed hidden surfaces. No arbitrary source
  rectangles stretched into primitive clips; no duplicated garment/limb details.
- Mostly rigid head/face, separate hair extensions. Art may rotate and use
  controlled deformation or replacement pose parts where appropriate.
- Shared named skeleton structure and motion rules; explicit proportion profiles
  are permitted. Foot plant, travel speed and sit/stand transitions must agree.
- Prove one character before expanding. Local preview/export only; no game
  integration, bulk roster conversion, installation, commit/push/deployment.

## Baseline and ownership
Repository beta with extensive unrelated dirty work. AGENTS and current tree
read at start. Immutable Green source:
Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png
SHA256 fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63.
Astra owns product/asset direction, plan, visual acceptance and integration.
Terra layered_character_pilot owns bounded investigation, then explicit assigned
implementation. Workers share the tree; preserve unrelated work and do not spawn.

## Milestones
1. Inspect source/tools; settle asset contract and prepare clean layered artwork.
2. Assemble Green standing proof. Compare directly at source/native scale; reject
   head distortion, changed proportions, missing details, stray pixels or seams.
3. Animate Green walk and sit-down/stand-up sequence; export frames and review
   motion in a simple floor/chair context. No mass packaging before visual gate.
4. Test Gray on the proven shared system if Green gate succeeds; deliver compact
   owner review and document remaining limitations honestly.

## Validation
Original inputs unchanged; rest assembly fidelity; rigid face proportions;
complete component alpha; foot contact/no sliding; floor and seat registration;
exact pause and frame selection; no runtime errors or clipped moving parts.
Visual review is mandatory and separate from automated technical checks.

## Progress
Plan created. Terra investigating existing tools/runtime and asset contract.
Astra preparing source-guided asset work. Next: first faithful layered Green
standing proof; do not reuse rejected fitting output as an acceptable baseline.

Investigation: existing game uses complete-frame Phaser Image atlas selection.
No Spine/Aseprite/Krita/ffmpeg executable found; installed Canvas supports a
standalone baked-frame pilot without installing dependencies. Retain semantic
pose/registration ideas only, not rejected UV/mesh renderers.
First built-in ImageGen SOUTH parts atlas produced at generated_images thread
path exec-ae4e8a48-adb5-4775-b75f-a391c4c96962.png. Candidate separates head,
torso, sleeves, hands and trouser/shoe pieces; generated assembled reference has
too-large head and is not the appearance baseline. Terra now owns asset copy,
alpha/part inventory and standing-only rigid-part assembly to original source
landmarks, with uniform per-part import scaling and no head reshaping.

Asset blocker: the first atlas and one built-in ImageGen background-extraction
repair are both completely opaque (1254 by 1254, zero transparent pixels).
Both versions and repair provenance are preserved under layered-pilot/assets.
No standing proof has been rendered or visually accepted. Explicit user
direction to switch to programmatic background removal is pending; do not
perform that image edit until received. Terra is correcting independent proof
layout and validation issues meanwhile. Next action: resolve transparent parts,
render standing comparison, and inspect fidelity before any animation work.

2026-09-14: Owner explicitly authorized programmatic checkerboard removal.
The permission blocker is resolved. Terra's last correction turn failed due to
model capacity; Sol surface_pipeline now owns background removal, retained-RGB
verification, light/dark proof, scaffold corrections and standing comparison.
Keep original versions unchanged. Parent notes generated parts still differ in
face detail; transparent extraction alone does not establish source fidelity.

Background removal completed and independently checked: v3 transparent atlas
SHA256 c31a4940b6b0e98c144a61fed4a5f1279b9335158318d2ed2789c5c786cba84c.
1,189,902 exterior pixels cleared; all 382,614 retained pixels preserve exact
RGB; original source and generated v1 hashes unchanged. Sol implemented the
alpha-only exterior flood, light/dark atlas proofs, and standing scaffolding.
Parent read code, reran validator successfully and inspected atlas/standing
proof. Transparency milestone is complete. Standing fidelity gate FAILED:
generated face differs, torso shape differs, and knee seams remain visible.
No animation or game integration performed. Next artwork milestone must correct
the parts themselves to the original design before walk/sit or Gray expansion.

Owner continued and explicitly identified sleeve remnants in the torso. Current
bounded milestone: remove both sleeves from torso, keep independent arms at
shoulder pivots, show isolated before/after torso and raised-arm diagnostic.
Sol owns v4 assembly/proofs without overwriting v3; Astra owns targeted torso
ImageGen edit and visual review. Built-in edit produced exec-cd7eb874-9d04-474f-
8b8a-b2ca94a18f3f.png; central trunk shape now has no hanging sleeves. Inspect
alpha and source-scale assembly before acceptance. Source fidelity concerns
about head, clothing texture and knee seams remain; no walking/sitting yet.

V4 torso correction complete: versioned asset green-south-torso-arm-free-v4.png
preserves generated alpha. Sol implemented isolated before/after, standing and
raised-arm diagnostics. Parent inspected actual outputs and code and reran
validate-green-torso-v4-proof.mjs successfully (input hashes, alpha, uniform
scale, shoulder pivots, moved pixels, unclipped raised bounds). Torso sleeve
remnants are removed. Full character visual gate remains open: face detail,
segmented trouser seams and shoulder overlap at wider arm angles need refinement
before production animation. Local-only checkpoint; no game integration/push.

Next active milestone v5: preserve exact source head and continuous trouser/shoe
cutouts with authorized background removal and rectangular extraction, without
redraw or nonuniform fitting. Sol owns extraction and standing/raised proof;
keep v4 arm-free torso and adjust separate-arm shoulder overlap. This removes
avoidable identity drift and generated knee cut lines. Parent reviews original
pixel preservation and visual match before commissioning motion milestone.

Motion acceptance contract for the first SOUTH proof after v5 review:
- Same standing assembly at both ends of stand/sit; rigid source head throughout.
- Walk cycle must lift and plant alternate feet, counter-swing arms and use
  restrained torso motion; show both in-place and travel context with measured
  floor contact. Continuous leg sampling cannot duplicate garment pixels at
  piece joins or draw outlined cut ends across knees.
- Sitting uses a chair with a known seat height and a stable final contact.
  Replacement lower-body artwork from the original seated pose is permitted
  where a front-view rigid cutout cannot represent foreshortening cleanly.
  Explicitly distinguish pose replacement from continuous rig deformation.
- Export finite frame sequences and a local review with play/pause/frame scrub,
  source still comparison, and floor/chair context. Do not overwrite game atlases.
- Review foot sliding, shoulder gaps, neck/waist coverage, timing and sit/stand
  continuity visually; assertions supplement this and never certify art quality.

V5 reviewed: exact source head extraction retains 4,573 RGB-identical pixels at
scale 1. Clean continuous trouser artwork uses uniform scale 0.08387698 with
10px hip overlap under hem and floor y287; pair width73.80px vs source~78.
Deeper shoulder pivots keep raised sleeve caps connected. Parent reran v5
validator and reviewed comparison. Accepted as a motion-test baseline only,
with clothing-width differences still noted (not exact-likeness approval).

Active v6 milestone assigned to Sol: reusable named rig/profile, deterministic
SOUTH walk cycle and sit/stand transition, exported frames/atlas/contact sheets,
functional playback review and contact/rigid-head/bounds/endpoint validation.
Built-in seated lower-body edit exec-8da0a611-1da1-4507-b323-c4c168389a52.png
will be copied into assets; prompt layered-seated-leg-edit-prompt.txt. Preserve
source identity, avoid double-exposure leg crossfade, document pose replacement.
Review baseline arm length against source and improve uniformly if warranted.

V6 core milestone completed by Sol and independently reviewed/validated by
parent. Exports under artifacts/character-movement/layered-pilot/v6-motion:
16 walk,16 sit-down,8 seated hold,16 reverse stand-up frames and atlas1280x2240.
Manifest fd66a2c69edd852cfee33b4d9bafea74b02069d06750553857f125803ea355dd.
Core validator PASS:56 deterministic renders,56 rigid-head checks,56 support
checks; maximum measured support-center error0.408px; exact reverse/endpoints.
Corrected symmetric leg splay to restrained in-place alternate foot lifts and
opposed arm motion. Sitting now uses bent-arm art with hands on lap,16px body
drop. Runtime elbow segmentation was rejected visually and removed; intact
pre-swap sleeves rotate inward. Pose replacement at frame10 remains visible.
No claim of exact likeness or production-ready natural motion; SOUTH only,
no travel/world retargeting,Gray conversion or game integration yet.

Review packaging: Spark wrote initial builder/validator but became unresponsive
without browser evidence; parent independently found missing chair context and
unwanted technical labels/card styling. Spark interrupted (no Spark rate/quota
evidence, availability record unchanged). Terra motion_review_finish now owns
only review builder/validator/fragment and browser checks; core manifest locked.

Review completed by Terra: green-layered-motion.html,741497bytes, matches locked
manifest. Parent independently reran validate-v6-inline-review.mjs:PASS, four
sequences, playback/pause/scrub/ends/speed,320/736px no overflow,zero JS/console
errors; inspected final source/seated screenshot with visible chair. Delivered
as a reviewable motion draft, not final likeness approval. Next: address clothing
width/detail and perceptible seated-art swap before side views,world travel or
Gray conversion. Original baseline/master inputs and live game remain unchanged.
