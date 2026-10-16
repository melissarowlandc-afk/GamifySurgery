# Gray braid second-character fitting test

## Goal and approval state
Owner approved Green walk and action review, then requested applying the system
to another character, noting gray braid complexity. Fit Gray braid to the same
approved motion and actions, with faithful original identity and separate braid.

## Requirements and constraints
Preserve original head/face pixels and natural proportions. Braid must not be
stretched across head/torso; register its root and choose front/back occlusion
per view. Use clean arm-free torso and separate sleeve/hand/leg layers. Keep
approved cadence, E/W reduced backward arm swing, shoulders, floor contact.
Support stand/walk S/E/W/N, South jump/clipboard, sitting S/E/W/N with snap.
Do not modify approved Green outputs or integrate into game before review.
Do not commit/push. Preserve unrelated dirty work in beta checkout.

## Milestones and ownership
1. Sol action_pose_design: read-only original-art/parts inventory and adapter
   design. Parent owns decisions and source-referenced art preparation.
2. Delegate bounded Gray standing/walk rig and validation, inspect source vs fit
   with head/braid integrity and E/W/N motion as explicit visual gates.
3. Delegate action adaptation and validation after base fitting gate.
4. Delegate inline comparison preview with source, directions and action controls;
   parent reviews code, frames and independently reruns meaningful checks.

## Acceptance and validation
Original faces remain rigid and recognizable, no duplicated torso details,
clipped skull, floating shoulders, visible matte fringe or braid/face distortion.
Shared gait/action timing and endpoints, attached sleeves/hands, floor contact,
correct thumb direction and braid root. Review output starts paused, supports
pause/scrub and safe image decode/finite indices; responsive 320/736px.

## Baseline references
Green directional manifest7c8ebc5615ad3bd425957376acc1fc99a523e9a024bc1fb6e6bdcf835ee45932.
Green actions manifest40ec1233e16bc52650817646b564da7fed669ac1a99f2cd738e8aa79e7b3dc59.
Previous plan docs/execplans/restore-walk-baseline.md records approved corrections.

## Progress
Sol inventory delegated. Next: inspect original Gray braid art, prepare only
missing parts, then delegate implementation before editing any rig code.

Original confirmed: Photos for Codex 2/Patients or Staff or Other Characters/
exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png,1536x1024,
SHA1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4.
Sol found source-profiles.json masks with per-view head/hair polygons. Extract
faceCrown and braidTail separately, exact sourceRGB, crown top39 native scale.
S braid over chest, E/W behind torso, N over back; move with body offset only.

Base atlas generated with built-in imagegen and saved gray-braid/assets/
gray-base-parts-v1-matte.png. Parent viewed: 4columns S/E/W/N, torso/sleeves/hands/
legs rows. Profile shoes mistakenly alternate facing; explicitly use correct
shoe donor per facing (never reflect full body). Preserve longer jacket hem.
Sol delegated base rig+source mask+validation milestone in new gray-braid folder.
Action atlas generated separately; parent rejected attached knee chunks under
seated hands and requested a targeted imagegen removal before importing.

Identity extraction proof at artifacts/character-movement/gray-braid-v1/
gray-original-vs-extracted-identity.png reviewed by parent: recognizable original
face/glasses and complete braid outline, accepted source identity layers.
Initial representative fit rejected for exposed armhole rims/matte halo and
narrow torso relative to native head. Sol correcting base fit. Shared motion
means same gait/timing/deltas and joint roles, not forcing identical absolute
shoulder width if that pinches Gray's source proportions. Character-calibrated
rest anchors are allowed and must be recorded; no head enlargement.
Final corrected action atlas saved gray-action-parts-v1-matte.png; parent
confirmed isolated arms with no knee chunks. Ready for later action milestone.

Parent reviewed revised source-vs-fit, representative allviews, fullEast8frames
and rig calibration. Base visuals accepted for owner review: S/N shoulders use
46/114 (own fit) with shared gait; perview torso uniform scales. Exact original
heads/braid remain. Base validator initially failed atlas-fringe737; Sol finishing
import before handing back base gate. After PASS proceed sequential actions,
preserving accepted base frames. Sourcecomparison PNG labels need marginfix.

Base complete manifestdca10e70f61d35e867c7edd310999fdc3f2a18e9bc068df17f210364df90634d.
Parent independently passed validator: 512699 retained atlasRGB,24091 opaque
original identityRGB,1163 root overlap pixels,32 distinct deterministic grounded
walk frames,64 cap/socket checks. Parent reviewed sourcecomparison/Eastfullcycle
and calibration. Fringe classifier uses alpha>=24 and near-equal R/B saturated
magenta; this is a limited color-family check, not proof of every possible edge
artifact. Sol traced actual sample values and removed matched source remnants.
Source maroon/interpolation samples excluded by explicit hue criterion.
Sol now owns sequential action adapter/build/validation in Gray folder, keeping
baseframes frozen. Next: parent review jump/seats/clipboard contacts.

Review UI planned: original design reference, fitted Gray, approved Green with
synchronized timing; action+direction selectors (jump/clipboard forceSouth),
pause/scrub/half-speed, static sitting/stand, chairtoggle for sitting. Uniform
reference display only, no aspect warp. Starts paused, internally sampledclock,
finiteindices, image decode gate, under1MB,320/736px validated. Original design
label distinguishes reference from generated prepared clothing/art. New preview
must not overwrite approved Green previews. Owner approval remains required.

Action first visual gate: Gray jump accepted, but initial seated/clipboard arms
too wide; Sol narrowing across arm axis while preserving cap/hand positions.
Seated profiles also looked standing: rigid long jacket hid horizontal thigh,
and lowerbody registration exposed trouser bulge behind back. Parent requested
forward hip registration and source-referenced arm-free seated torso variants
with jacket hem folded at hip/thigh (built-in imagegen inflight). This is a
garment-specific replacement, not a change to shared movement or original face.
Walk/jump/clipboard keep existing standing torso; seating gets distinct art.

Final core gate passed. Parent viewed revised seated contact: profile folded
coat, horizontal lap and grounded lower legs read correctly. Jump and narrowed
clipboard accepted for owner review. Sol finished core; parent inspected action
transforms/layer ordering and independently ran validate-gray-v1.mjs: PASS,
32 walk frames,13 action frames,24,091 exact original identity pixels,64 socket
checks,4 grounded/4 airborne jump frames and exact standing endpoint. Gray
manifest c2dcadbe52fe8375852aa6efc382d3a7db56dd84867250d028e8f4ee58b4a8c6.
Seated atlas/prompt saved alongside other Gray assets. Core now frozen.
Terra profile_swing_refinement owns comparison preview and browser validation.
Next: parent inspect preview, independently validate, then hand off for owner
approval. Green remains approved; Gray is not yet owner-approved.

Terra completed build-inline-review.mjs and validate-inline-review.mjs. Preview
gray-braid-character-fit.html is 774355 bytes, self-contained, original standing
reference plus fitted Gray and synchronized approved Green. Parent reviewed
builder and requested clipboard string loading, decode control enabling, chair
legs/theme and error semantics corrections; Terra implemented them. Parent
inspected screenshots and independently ran browser validator PASS: delayed
decode, malformed RAF, pause/scrub/half speed, all directions, static poses,
chair toggle, forced South actions, jump completion and 320/736 widths.
All implementation milestones complete; next action is owner visual feedback.
Original identity is exact; prepared garment/limb art is source-referenced
generation and requires per-character calibration. Braid is rigid, no secondary
physics in this first fit. No runtime integration or commit/push performed.

## Owner correction pass
Owner accepts S/N walking and sitting/jump/clipboard poses. Reports intermittent
crown clipping in all poses, West chin clipping, E/W reversed elbow curvature,
far shoulder/hand showing through torso and backward feet. Preserve approved
pose bodies/motion; restore original identity coverage as needed everywhere.
Sol action_pose_design owns bounded core investigation/fix plus regression
validation, source head proof and full E/W contacts. Parent observed current
profile renderer draws both cap overlays and hands after torso, explaining
far-arm leakage. Shoe and sleeve donor orientation need visual source checks.
Next: review Sol core result and independently validate; then delegate preview
refresh and validate before presenting. Green remains unchanged; local only.

Sol correction core complete. Parent inspected full E/W cycles and source-head
proof, rejected exposed near armholes and remaining rectangular crown exclusions,
then accepted revised result. E-left/W-right donors now selected for sleeves and
shoes; correct hands preserved. Far arm draws behind torso; only near cap/hand
overdraw. Exact-source profile shoulder patches cover authored black armholes.
Removed crown exclusions, tightened checker-background removal to retain gray
hair, expanded West chin mask. Pale S neck pixels verified source collar edge.
Parent inspected renderer/extraction and independently ran core validator PASS:
32 walk/13 action frames,25584 exact identity pixels,2869 exact shoulder pixels,
4 crown checks,96 donor checks,16 layer-policy checks. Visual cycle inspection
complements metadata assertions; automated tests alone do not prove appearance.
Accepted clothing atlases and movement calibration remain unchanged; restored
identity affects all poses. Final core manifest:
0831d294c0e67798b2e325ea4fc5e3df6636e28b1d3607fe7c8169f6aadef346.
Terra now owns preview pin refresh/rebuild and browser validation.

Terra refreshed comparison to corrected pin (777971 bytes) and captured E/W
extremes. Parent inspected browser screenshot and independently passed inline
validator covering decode, malformed RAF, controls, actions and 320/736 layout.
Correction pass complete, awaiting owner visual feedback. No runtime changes or
commit/push. Sol core + Terra packaging were the only implementation workers.

## Foot attachment follow-up
Owner finds correction much better but one leg's foot does not match leg length.
Sol owns bounded drawLeg diagnosis/correction and regression validation, with
before/after ankle closeups and full profile cycles. Preserve approved gait,
head/arms/torso and correct toe orientation. Investigate source ankle vs sole
registration and fixed leg-band split; parent reviews actual renders then tests.
Next: accept core correction, delegate preview refresh, present for owner review.

Sol found profile shoe crop at82% included lower trouser stub; whole-shoe center
was about4px off ankle entry. Now profile shoe starts at85% seam and its measured
top-band centroid aligns to ankle X. Visual trouser endpoint follows shoe top
with horizontal terminal section and2px overlap; canonical gait/floor unchanged.
Parent rejected intermediate wedge gap, then accepted revised closeups/full
profile contacts and inspected renderer. Core validator independently PASS with
160 profile registration checks and64 S/N unchanged-path checks plus prior
32walk/13action checks. Final pin
d6bafa77de4ce2707e5c0fadec5eab2e60a51fbc7fc40113db2c6f1d18d75e03.
Terra delegated preview refresh; no unrelated changes or runtime integration.

Terra refreshed preview to final foot pin,778347bytes. Parent independently
passed browser validator after refresh. Foot follow-up complete for owner review.

## West heel registration
Owner still sees West leg landing at midfoot instead of heel. Terra owns narrow
West shoe anchor adjustment, preserving vertical sole/gait/trouser endpoint and
all other directions/actions. Inspect source heel at rear/right of West shoe;
move shoe forward/left relative ankle using heel anchor instead of top-band
centroid. Parent reviews before/after extreme steps before preview refresh.
Then core/browser validation and same inline refresh, local only.

Terra measured West heel-side upper shoe band: anchor x854.73 vs838.46,
shifting shoe4.72px forward/left. SoleY and trouser endpoints preserved. Build
asserted byte-identical other directions and all actions against previous pin.
Parent reviewed West extremes/fullcycle, inspected anchor code and independently
passed core and inline validators. Same preview refreshed777119bytes; finalpin
f7ea2c69ad2b9c787c4c5681a46abf51592941758688233c3cf82352ce272da3.
West heel correction complete for ownerreview, local only. Terra sole worker.

## West trailing-foot correction
Owner confirms leading West foot nowgood but trailing leg overhangs shoe rear.
Terra owns narrow phase-aware registration investigation/correction, preserving
good leading foot, gait/floor and all other directions/actions. Parent reviews
full West cycle before preview refresh. Avoid same fixed shift for both feet
when calf lean differs. Current baseline f7ea2c69...272da3; local only.

Terra initially blended trailing shoes toward center based on calf lean; parent
rejected remaining overhang in clean4x proof. Final geometry measures rendered
opaque cuff rear edge and extends trailing shoe heel1px beyond it. Leading shoes
remain fixed. Parent reviewed clean phase1/5 closeups and full8cycle, inspected
renderer and independently passed core validator. Requested final metadata-only
cleanup: preserve measured center anchor rather than modifying it to fit an old
constraint; validate actual cuff-edge coverage instead. Then final pin/preview.

Metadata cleanup complete; parent independently reran core and browser validators
PASS. Final raster/manifest unchanged by cleanup; final pin
e954be5d89fedea444381c51ec7c5441ffa55e336452223b81e3a079a24989a2.
Preview refreshed777971bytes. All other directions/actions preserved. Terra was
sole implementation worker. Owner review next; local only, no runtime changes.

Owner approved final Gray fit and requested a third character. Gray baseline is
now frozen at e954be5d...4989a2. Active follow-up: third-character-fit.md.
