# Character movement — GS-012

## Complete — owner approves master and requests successor task

On2026-09-13 owner approves final master poses and asks for a new task solely
for converting approved designs into surfaces/attachments. Master development
is complete; no required implementation remains here. Canonical handoff:
docs/handoffs/APPROVED_CHARACTER_SURFACE_FITTING.md. Earlier pending-review
notes below are superseded. No costume conversion/game integration performed.

## Delivered — South clipboard height

Manifest915cc7a0501fb8df50f2a0e7b19304acbbadfa99b9243f2db796fe413fad7de9.
Sol rig raised South board/anchors12; root reviewed fourview/source, passed
existing geometry/browser checks and verified other39 records unchanged:
5ff11398be636328581e5a9e3b097f53c77726b3192391faedf5f4d833603226.
Preview refreshed985116B native280x350. Owner South review next. Local only.

Owner approves other three clipboard directions; raise only South clipboard
and holding anchors12 units, solve fixed-length arms. Sol rig owns bounded
correction; root reviews South and hash-preserves all other39 action records,
rebuilds preview and runs existing checks. No other action/runtime scope.

## Delivered correction — clipboard reverse-side layering and tilt

Sealed action manifest SHA256:
3b804c23aaf100cb910d62fb1d73a961c5b495324d75345e641de9503e8fbcab.
Sol rig worker changed clipboard plane/anchors and rightArm-board-leftArm
render order. Root reviewed four views and actual source, independently passed
geometry/browser validation and unchanged jump/sit hash85a5b357...1e1022.
Preview985724 bytes, native280x350, lossless art and quality90 guide; defaults
clipboardSouth. All32 jump states/8statics and exactpause pass, screenshot
reviewed. Owner clipboard review next. No runtime/costumes/push.

Owner clarifies South anatomical LEFT arm in front of board, RIGHT behind;
top board edge farther anterior/away from torso than bottom in E/W. This
supersedes previous clipboard plane/layer interpretation. Sol rig worker owns
clipboard-only canonical-actions changes and focused checks. Preserve all
walk/sit/jump assets; root reviews four views, repacks and validates preview.

## Delivered revision — asymmetric clipboard support

Final action manifest SHA256:
03ffa95a9ced40ca510f3b5a99b5dbef83b0621e27f0e675a227c33970ddece1.
Sol rig worker defined one sloped board plane and anatomical left underside
support/right upper-face rest anchors, with view-correct drawing. Root reviewed
four-view art and actual plane/role validation and independently passed40-pose
geometry checks. Jump+sit records remain byte-identical under hash
85a5b3577ff18fe51d7a28fbd7d66d371abe2970485f0ab5b64268e5ff1e1022;
all68 approved master PNGs pass unchanged. Sol preview worker changed only the
initial action/direction to Holding clipboard South and matching checks.
Preview rebuilt native280x350, lossless art/quality90 guide,982948 bytes.
Root browser validation passes32 jump states,8statics, exact pause/resume,
initial clipboardSouth,320/736 layouts and zero errors; screenshot inspected.
Owner clipboard review next; no runtime/costume work or push.

Owner accepts remaining sitting/jump poses; only clipboard needs revision.
Anatomical LEFT forearm supports board underneath; RIGHT hand rests on upper
surface. Apply consistent3D support across4 directions and view-correct depth.
Sol rig worker owns canonical-actions tools/artifacts; preserve every sitting
and jump geometry/PNG. Root reviews4 holds, checks named-hand contact and
ordering, rebuilds action preview and browser validation. No runtime/costumes.

## Delivered milestone — remaining master actions

Final action manifest SHA256:
ebd077d0e38ba2650dbcbc9e55b3b4865871eec70c6acfefff74f83605dc359c.
Sol reauthored_pilot_rig authored canonical-actions geometry/art/package and
focused validator. Sol native_preview_repair authored isolated action preview
tools/controller/browser validator. Root inspected source, corrected initial
clipboard height, seated elbow direction and North seated layering during
review, inspected final four jump sheets and eight statics, independently
passed action geometry and browser validators. 40 fixed-bone poses; all 32 jump
states, 8 statics, air/ground checks, grip checks, exact pause/resume and native
320/736 layouts pass. Approved c9cc master and all68 assets unchanged.
New canonical-master-actions.html is974686 bytes, native280x350 with unchanged
body scale, lossless art/quality90 guide. Existing walk preview untouched.
Owner action approval next before costume proof. Clipboard holding is stationary.
Both workers held; no runtime conversion, commit or push. Local checkpoint.

Owner accepts current walk/standing revision c9ccf24d...18c309 and requires
approval of seated East/West/North plus star jumps and clipboard holding before
mapping. Deliver separate master-action preview: four-direction sitting,
four-direction stationary clipboard holding, eight-phase star jumps in all four
directions. Shared anatomy/material contract; no identity art/runtime changes.
Sol rig worker owns new canonical-actions tools/artifacts, may expose reusable
renderer helpers with pixel-identical old approved outputs. Sol preview worker
owns isolated canonical-actions-preview and new canonical-master-actions HTML.
Retain existing master walk preview unchanged. Root architecture/art review,
source/validation review and final acceptance. Eight jump stages must include
gather, takeoff/opening, airborne star, closing and soft landing; fixed bones,
visible floor clearance, pose-specific depth and no clipping. Holding is still,
hands contact clipboard; seated direction has anatomically appropriate thighs,
knees, shins, chair depth. Final preview exact pause/manual phases/native scale.

## Delivered revision — visible standing arms and elbow flexion

Final manifest SHA256:
c9ccf24da87a4f89e1f464a65819d205bf0b2930950f9c60105a64c6d618c309.
Sol rig worker narrowed the shared frontal torso and fixed the elbow IK branch.
Root rejected the initial anterior elbow offset and verified the corrected
posterior offset: forearm flexes anteriorly, rear arm straighter than forward.
Root inspected all four full-cycle sheets/statics and code, independently ran
full geometry/browser validation (32 manual phases, 34 poses, exact pause),
and confirmed lower-body hash unchanged at
3e84c1a0d8a8ce96d327fe0f40f55911f47f2eb5842d70724795aff2c5739e7d.
Native lossless preview rebuilt, 728878 bytes. Owner review next. No runtime or
costume conversion; worker held. Local checkpoint, no push.

Owner requests South standing arms visible alongside torso, and E/W elbows
never bending backward beyond straight. Forward arm may flex more; rear arm
straightens. Sol rig worker owns canonical-master tools/artifacts; retain all
32 phases, medial thumbs, North hand occlusion, legs behind torso, fixed bone
lengths and lower-body gait. Root reviews signed flexion checks and full-cycle
art, rebuilds preview and runs browser validation. No costume/runtime scope.

## Delivered revision — leg depth and medial thumbs

Sealed manifest SHA256:
532d2d22781d44f06b941d806dfd2c033ed2d70fc929a2fac4f4cbb1a7996c26.
Sol reauthored_pilot_rig implemented this revision. Root inspected renderer and
semantic checks, all four eight-phase review sheets and browser screenshot;
independently passed full geometry and browser validators. All 32 manual poses,
exact pause/resume and statics pass. Gait latent SHA remains exactly unchanged:
3990dcd69da3862855d018df87857ff7ec1c58450a88070877adbc3f9294164c.
Lossless native preview rebuilt at 726282 bytes. North clean hands have no thumb
protrusion; guide retains medial/anterior landmark. E/W both legs precede torso
in actual renderer and manifest policy. Next: owner motion review. Local only.

Owner requests all eight poses in each direction retained, both E/W legs behind
torso, and forward-oriented medial thumbs with North thumbs visually hidden.
Sol reauthored_pilot_rig owns canonical-master tools/artifacts only. Preserve
gait and proportions; revise projected hand appearance, draw order and semantic
checks, rebuild all 32 plus statics/guides. Root reviews code/full-cycle images,
runs geometry and browser validators and rebuilds preview. No costume/runtime
scope. North guide may expose the anatomical thumb landmark while clean art
occludes it; never require visible North thumb pixels as an acceptance check.

## Delivered — plain canonical master review

Master preview manifest SHA256:
12128590c8b0179adc9495d8e63d1a400b2e77955679c9874e79811db6439dd8.
Sol reauthored_pilot_rig implemented the isolated canonical-master geometry,
renderer, 32 walks, two statics, guides and semantic validation. Sol
native_preview_repair implemented the isolated canonical-master-preview
builder/controller/browser validation. Root reviewed source, all four eight-pose
sheets and statics, ran both validators independently and inspected browser
screenshots. All 34 poses retain fixed bone lengths; rendered neck/crown,
thumb/foot landmarks and seated anatomy checks pass. Browser checks pass all
32 manual states, exact pause bytes, resume, autoplay, statics, guide/overlay,
native 240x310 dimensions and 320/736 layouts without errors. Preview uses
lossless PNG and is 730878 bytes. Accepted pilot a70e4915...dd79 remains intact.

Next: owner motion review of the plain master; then Green cardigan/Gray braid
surface and attachment proof using identical geometry. Material-region/local
coordinate metadata is defined; actual identity texture application is still
the next milestone, not yet proven. No runtime integration, broad conversion,
commit or push. Both workers held. Local backup checkpoint.

## Active — canonical master body replacement

Owner authorizes proposed architecture replacement. FIRST review milestone is
plain canonical body with four eight-phase walks, standing South and seated
South; owner approval precedes applying Green cardigan/Gray braid costumes.
Shared fixed anatomy, rigid shins and thighs with knee articulation, canonical
thumb/heel/toe landmarks, continuous neck/chin attachment and uncut crown.
N/S both arms behind torso; E/W far arm behind legs; fixed eight-pose timing.
Neutral diagnostic materials and independent skeleton guide. No source sprite
cropping or per-character joint fitting. No runtime integration or wider batch.
Sol owns isolated canonical-master tools/artifacts; root architecture/review.
Retain previous accepted pilot untouched. Then apply two identities to identical
geometry as surface textures/attachments after owner master-body acceptance.
Validation must address semantic anatomy, not just connectivity: straight shin,
foot angle, thumb direction, visible neck contact, full head bounds, fixed
segment lengths, phase timing and exact pause. Final native-resolution preview.

## Revision delivered — anatomy and native-resolution preview

Final revised batch manifest SHA256:
be69cfe393a8a5eeb896eb3e92d1b97efe0c53f5c673fc140ea49a06e7372d32.
Sol reauthored_pilot_rig increased arm widths .52->.60 and .60->.68, retained
shoulder pivots, mirrored complete South arm sources for inward thumbs, and
introduced measured row-width torso envelopes shared by artwork and guide.
Braid head masks retain full crown contours; three explicit small source-only
exclusions remove detached E/N/W outline runs without cropping the whole crown.
Root reviewed original/head proof, neutral01/03 and all eight full-cycle sheets.

Terra investigated preview sizing but its reduced controller failed review.
Sol native_preview_repair replaced that draft with the proven state model,
native240x310 packing, q80 artwork/guide/source, and all controls. Final inline
batch-02-character-walks.html is973706bytes. Previous pair/four-character inline
files untouched this revision. No generated source art was replaced.

Root independently passed mesh8/8, new64-frame validation (including complete
legs, necks, shoulders, depth, source hashes, zero magenta and isolated statics),
and accepted-pilot64 validation at unchanged a70e4915...dd79. All64 baseline
leg geometry records compare exactly unchanged. Final browser validator passes
64 pixel-hash poses, byte-exact pause for both, resume/autoplay, four statics,
source/guide/overlay, embedded/disk atlas parity and320/736px layouts, no errors.
Root inspected final screenshots and actual renderer/controller/validator code.

Next: owner motion review of revised pair. All implementation workers held;
no required implementation remains. No runtime integration, wider batch,
commit or push. Local checkpoint; source originals and approved pair preserved.

## Active revision — batch02 anatomy and image quality

Owner approves Olive/Gray overshirt; freeze a70 pilot unchanged. Owner rejects
new pair's small arms, rectangular torsos, clipped braid crown, pixelation,
and outward South thumbs. Sol owns batch02 measured anatomy corrections and
neutral/01/03 review before full bake. Root reviews source proportions and
preview resampling/compression; preview changes delegated after diagnosis.
Preserve gait/legs, N/S arms behind torso, identity originals and E/W layering.
Restore authentic crown silhouette rather than clipping top rows to hide strays.
Acceptance: visually fuller natural arms/torso, inward South thumbs, original
crown intact and clear detail at review scale; complete cycles and pause tests.
No runtime or wider roster work. Prior batch18439 is rejected reference only.
Terra owns new batch-02-preview tools/artifacts and batch-02-character-walks
inline files only. Decision: focus on revised pair at native240x310, retaining
independent raster guides; old pair/four-character preview remain unchanged.
Remove downsample/enlarge pipeline and pixelated CSS, retain source comparison
and all review controls, fail rather than silently reduce resolution for1MB.

## Delivered 2026-09-12 — four-character review, batch 02

Completed two additional approved designs: Green cardigan (patient.adult.046)
and Gray braid (preview-only retained.gray-braid). Sol reauthored_pilot_rig
owned measured profiles, fitting, complete-surface limbs, head selection,
baking and packaging. Terra four_character_preview built the comparison and
browser checks. Root prepared image_gen sources, reviewed actual code and all
eight full-cycle sheets, requested/correctly reviewed head-stray and seated
crop cleanup, and independently ran validators. Initial Terra source-mask
diagnostics were rejected as incorrect; Sol remeasured them. The old retained
preview worker's incomplete scaffold was replaced, not accepted as validation.

Final batch manifest: artifacts/character-movement/reauthored-batch-02/
two-character-preview/manifest.json; SHA256
18439dc47d03dccdfa82dbc397a767e4a64f2e41d47f45707f43f3aebeb0c890.
Frozen corrected pilot SHA256:
a70e491593b6c772b68bb6765cd822cdb5627bd710fd4562124c270ea4acdd79.
Both arms render before the torso throughout all North/South phases for all
four characters. Pilot East/West and geometry preserved.

Independent acceptance evidence: 8/8 mesh tests; pilot 64-frame validator;
batch 64 frames/guides, 256 positive meshes, 128 connected complete legs,
64 neck contacts, 128 shoulders, 4 isolated statics, original hashes and zero
magenta remnants. Four-character browser check passes 128 manual walk states,
8 statics, exact frozen canvas bytes, resume, source/guide controls, 320/736px
layouts and no browser errors. Final fragment is 956373 bytes; source and frame
hashes match both manifests. Root inspected final images and screenshots.

Output: task visualization directory/four-character-walks.html; earlier
retained-character-walks.html also refreshed for the owner's N/S correction.
Sitting remains the approved original static reference, not a new chair rig.
Built-in image_gen source paths/prompt set are in batch-02/sources/ART_DIRECTION.md.
No runtime integration, wider conversion, commit or push. Local checkpoint.
Next: owner reviews characters 3/4 in motion; preserve final outputs until
feedback. Workers held/completed. No remaining implementation milestone.

Updated: 2026-09-11. Active items: MOV-001 through MOV-006.

## Current owner rejection — structural limb rendering repair

## Active 2026-09-12 — two approved designs, reauthored animation pilot

PILOT STEERING COMPLETE: a70e491593b6c772b68bb6765cd822cdb5627bd710fd4562124c270ea4acdd79
is the new frozen reference. Root inspected all 32 N/S frames, reran validator,
compared all64 geometry objects unchanged, and refreshed old-pair inline preview.
Sol resumed batch02 with the same frontal layering rule. Braid masks under
independent Terra diagnostic review in batch02/mask-audit; other files Sol-owned.

USER STEERING: both arms must always be behind torso for ALL North/South
walking frames, for all four characters. This explicitly authorizes updating
accepted pilot draw order only. Sol pauses batch fitting at safe point, corrects
pilot N/S layering and rebakes/validates, then resumes batch with the same rule.
Preserve E/W, targets and identities. Corrected pilot becomes frozen baseline.

OWNER ACCEPTED bd090ff4 pilot on 2026-09-12. New authorized milestone: TWO
additional approved characters, green-cardigan elderly man (0b03b9bb source)
and gray-braid dark-jacket woman (16c48adf source). Preserve accepted pair and
original designs; no game integration or broad conversion. Root prepares
complete directional source art and retains original identity layers. Sol
investigates reusable batch-02 renderer/profile path, then owns fitting/baking
and validation. Acceptance: 32 walk frames each, South neutral, original seated
reference, original comparison and independent rig overlay, pause stability,
thumb chirality, fitted shoulder caps and head/neck registration, connected
limbs/shoes, no foreign pixels. Review checkpoints before full motion packaging.
Next: generate two layer atlases; measure and fit per identity, not blind-copy
the prior characters' pixel coordinates. Final inline comparison includes the
accepted originals and the two new candidates. Root updates durable record.

FINE FIT DELIVERED FOR REVIEW: Sol corrected West right source chirality,
shifted Gray East head -3px and both West heads +3px, and put the South neutral
near arm behind the torso. Guides use the same head offsets. Root reviewed
before/after poses, all 24 affected walk frames and actual code; independently
passed 8/8 tests and 64-frame validation. All 1,024 leg fields and 40 unaffected
walk images remain unchanged. Four Gray East even-phase neck blend pixels
were neutralized only within head/body overlap, preserving alpha and originals.
Final manifest SHA256:
`bd090ff4c1647a43c65b4ff0eda3fcbce5003525669e6c9dbe0c43ed16d0d842`.
Inline preview refreshed; Sol complete. Next: owner visual review, no runtime
integration or wider batch. Local checkpoint only.

FINE FIT REQUEST: owner requests West anatomical right thumb correction, gray
East head rearward fit, both West heads rearward fit, and South standing right
shoulder cap seated behind the torso seam like the left. Sol owns focused
profile/render corrections and before/after checkpoints before final rebake.
Preserve leg geometry, timing, original identities and unaffected views; root
reviews actual art, code and validation, then refreshes the same inline preview.
No game integration, wider conversion or push. Baseline manifest 00364c45.

REFINEMENT DELIVERED FOR OWNER REVIEW: Sol implemented smaller arms (olive
.56 and gray .54 uniform width/hand scales), South shoulder inset 10px,
East/West shoulder pivots 3px forward and 4px lower, and gray North local arm
reflection while preserving anatomical IDs/watch ownership. Root reviewed all
eight cycle sheets and the code; corrected an additional South walking seam
mismatch with an explicit shoulder height of 79px above each phase hip.
Both accepted standing neutrals remain byte-identical after that final fix.
Root independently passed 8/8 tests and the 64-frame validator, including
32 South shoulder-height assertions; all 1,024 leg fields remain unchanged.
Inline phase/pause/resume/static/guide/source and 320/736px checks pass.
Final manifest SHA256:
`00364c452f0f54062415cba8698977ac65760e8f2c71f2e560d73c701fb9f4e8`.
Sol completed; no wider conversion or runtime integration. Next: owner review.

REFINEMENT REQUEST: owner likes the improvement; requests slightly smaller arms
in all poses, relaxed/inset South standing shoulders, lower/forward East/West
shoulder pivots, and natural anterior thumb orientation (gray North currently
outward, olive North preferable). Sol owns measured profile/renderer refinements
and rebakes. Root reviews neutral and stride/passing checkpoints before complete
64-frame packaging. Preserve leg geometry, phase timing, identities and North
body motion. No wider conversion or runtime integration. Character-specific
source chirality is allowed; do not assume both North donors share handedness.

ACTIVE FOLLOW-UP: owner reports improved art but incorrect East far-arm depth
and orientation, West arm orientation/attachments, South outward shoulders and
backward/outward hands, North shoulders outside torso, and lateral neck gaps.
Sol reauthored_pilot_rig owns bounded renderer/profile repairs and rebakes;
Terra gray_source_measurements audits source chirality read-only. Root reviews
source anatomy, depth order and actual rendered checkpoints before full bake.
Preserve leg gait, timing and North body motion. No runtime/wider roster changes.
Acceptance requires correct anatomical arm pairing/chirality, far arm behind
legs, shoulder seams within torso, and neck overlap across all eight phases;
one connected alpha component alone is insufficient. Next: diagnose and render
E/W01+03 plus S/N neutral for both identities, review, then refresh motion UI.

Diagnosis: far arm was composited after both legs; lateral near/far shoulders
were separated along chest depth instead of sharing the shoulder region.
Terra source audit confirms anatomical IDs/watch ownership correct. Local arm
chirality correction is East LEFT only, West BOTH, South BOTH, North NEITHER.
Reflect local part coordinates/art, never swap anatomical sides or gait phases.
Front/back shoulders need an inward fit; lateral head/body requires direct
neck overlap evidence rather than incidental full-character connectivity.

FOLLOW-UP DELIVERED FOR REVIEW: Sol corrected local arm chirality, shared
lateral shoulder anchors, front/back shoulder inset, far-arm depth, and lateral
head registration; removed the retained original collar flap from Olive West.
Terra audited source handedness read-only. Root reviewed all eight complete
contact sheets and the actual code changes, reran 8/8 tests plus the 64-frame
validator, and compared all 1,024 leg fields against the prior manifest: unchanged.
Validation: 384 positive mesh records, 64 neck contacts, 128 shoulder checks,
64 depth-order checks, 16 contralateral checks, original hashes preserved.
UI phase/pause/resume/static/source/guide and 320/736px checks pass. All three
embedded atlases and both manifest pins match the final manifest SHA256
`2b15ebd7303fd96eee98f608a298418cc4304b4d480968d94342ceb370262fdd`.
Both workers complete. Next: owner visual review; no game/wider-roster change.

COMPLETED FOR OWNER REVIEW: both approved designs now have 32 walk frames each,
new South standing neutrals and original seated reference poses in the inline
preview. Sol implemented the rig/profile/bake milestone; Terra measured sources
read-only; root reviewed all eight contact sheets, reran 8 tests and the 64-frame
validator, and verified UI pause/static behavior and all three embedded atlases.
Manifest: `artifacts/character-movement/reauthored-pilot/two-character-preview/manifest.json`,
SHA256 `81f6c4cb9e076ae802c60586c0dbbed4ddba1efbcc404d3f62a05f1d3ee5b2c1`.
No broader conversion/runtime integration. Owner motion acceptance is pending.
See current GS-012 handoff for exact validation, limitations and next action.

Owner authorized the proposed preparation process for TWO examples before
wider conversion or game integration. Every design in both named source folders
is approved, as are the secretary, nurse and two additional patients. Approval
of designs does not imply acceptance of prior mapped walks. Retain originals.
Use olive jacket patient.adult.033 and gray overshirt patient.adult.032 so the
owner can compare the improved preparation directly with earlier attempts.

Milestones: (1) reauthor complete neutral directional animation parts from
approved references using built-in imagegen; preserve identity/style/proportions,
provide hidden surfaces and actual transparency; (2) fit a rig to the prepared
parts with measured full silhouettes, shared eight-phase gait semantics and
continuous limb/terminal attachments; (3) review two characters in all four
walking directions plus standing/sitting, then package an inline motion preview.
Do not reuse old hard-cut donors or fixed narrow texture strips. No per-pose
patch accumulation; if source preparation fails, correct the source once.
No game integration, wider conversion, push, or peer-task coordination.

Root owns art direction, generated source preparation, review and planning.
Sol will own the bounded rig/renderer implementation under new
tools/character-mapping/reauthored-pilot/ and corresponding artifact folder.
Validation must include actual donor/source fidelity, joint/ankle continuity,
stable volume, no foreign pixels, native/map-scale motion and pause/static UI.
Passing coordinate or alpha checks alone is insufficient. Next: generate
complete isolated per-view parts and establish their measured rig anchors.
Prepared source candidates now exist at
`artifacts/character-movement/reauthored-pilot/sources/{olive,gray}-rig-ready-v1.png`.
Built-in imagegen reauthored complete limbs, then corrected baked checkerboard,
retained sleeves in torso layers, and visible armhole decoration. Selected
sources use flat magenta for clean alpha extraction; source packet records
prompts and provenance. Generated head/body ratios drifted, so root directed
reuse of original HEAD ONLY pixels and once-only measured torso/part calibration.
2026-09-12 checkpoint: root reviewed original-head olive neutral/E01/E03 images, requested torso .58, arms .62 and legs .55 calibration, and corrected cuff/sole anchor measurement. Revised images retain complete attached limbs and floor contact; this is an intermediate fit review, not owner acceptance. Root independently ran 8/8 engine tests and flagged misleading rigid-terminal test semantics for correction. Sol is building olive E/W eight-phase cycles before the remaining pilot views.
Sol `reauthored_pilot_rig` built full-surface skinning/schema tests and is binding
olive neutral/E01/E03 as the first actual assembly checkpoint. Do not accept
synthetic tests or source-sheet appearance as completed motion proof.

2026-09-12 owner feedback supersedes the candidate review below: mapping still
looks poor, with overly thin limb sections, stray colors outside the body and
feet appearing detached. Do not treat v2 technical checks as visual acceptance
or use it to qualify the roster. The owner asks whether to redesign characters
or change the mapping approach, pointing to both original source folders.
Current task is read-only source/process assessment with Sol
`source_readiness_review`; no further sprite patching or roster conversion is
authorized by this decision question. Preserve approved identities and originals.
Assessment complete: parent confirmed 55 patient/reference PNGs and 31 founder
PNGs (file counts, not asserted identity counts), inspected current width and
terminal mapping code; Sol reviewed four original sheets and four v2 direction
sheets. Recommendation: preserve designs but reauthor animation-ready layered
art with complete occluded surfaces, correct per-view contours and attachment
anchors. Stop iterating automatic flattened cutouts. Prove a patient, ordinary
human founder and a nonstandard silhouette before batching. Share gait phases
across fitted body profiles; do not promise one universal body. No artwork or
runtime changes were made during this assessment; Sol is complete.

Latest outcome: revised connected-limb candidate delivered in the existing
inline preview after root review of all four direction sheets and donor bodies.
Sol corrected both lateral cuffs and N/S source contamination. Root reran final
builder metadata, then independently validated 64 frames/2,048 triangles/256
terminal pairs, unchanged motion geometry, two original source hashes and four
byte-identical static poses. No detached opaque components >4 pixels; gray E07
and W02 each retain one isolated pixel, explicitly reported. UI validation passed
pause/resume, all eight phases/four directions, static poses, guide/source modes
and 320/736px bounds. All three embedded atlas bytes match generated files.
Manifest SHA: `a4bee50d536967bc9798a2ed466b17a890c72b9f246b5bec1a8748f700e58031`.
HTML SHA: `89ecfb3f4ff1091be1f5805a091029d5b81efd08d925c304559a668c9b0642c5`.
Current artifact: `artifacts/character-movement/retained-mesh-spike/all-directions-v2/`.
Source originals, runtime and the rest of the roster are unchanged. Owner visual
review is pending; numeric validation is not approval. Prior rejected roster
evidence remains preserved. Local only, no push. All workers stopped.
Delegation: Sol diagnosed; Terra proved gray E8 and updated rejection registry;
fresh Sol implemented corrected E/W/N/S and validation. Root reviewed actual
diffs/pixels, ran checks, and performed only the small existing-builder packaging
integration plus durable planning/process/handoff updates.

The owner rejected walking in every direction: arms/legs are chunky and get
cut off strangely. Astra agrees the preceding candidate acceptance was premature.
These are structural artwork defects, not minor cosmetic seams. The old frames,
sources and evidence stay preserved, but must not qualify another character or
production batch. Passing endpoints, hashes and UI checks did not prove quality.

Fresh Sol `continuous_walk_repair` owns only new
`tools/character-mapping/retained-continuous-walk/` and matching artifacts.
First diagnose actual source/donor/render pixels, then propose a reusable
continuous limb deformation or equivalent sound method before implementation.
The initial repair target is gray overshirt `patient.adult.032`, eight east
phases. Preserve all source identity/proportions/watch and the shared gait.
Reject arbitrary circular joint caps, hard mask seams and pose-specific patch
accumulation. Astra owns method decisions and actual native/animated review;
expand only after a clean full-cycle representative. Both characters/all four
directions still require correction before a replacement preview is complete.
No peer tasks, runtime edits, new character designs or external generation.

Sol's direct pixel/code diagnosis confirmed rigid straight-edged masks plus
8x8 textures enlarged onto radius 9/11 joint disks. Astra approved a connected
source-backed two-bone mesh for the bounded gray/east repair: shared elbow/knee
edges, measured width stations, rigid hands/shoes attached beneath real cuffs,
proximal edges hidden beneath original torso/hem, no joint disks or per-pose
painting. Keep width controlled through bends rather than unbounded miters.
Validate mesh continuity/triangle winding and compare actual native animation.
The approved shared motion compiler and original design remain unchanged.

Execution adjustment: Sol supplied the accepted diagnosis but wrote no files
while drafting a large renderer. Astra stopped that writer and delegated a
smaller first implementation checkpoint to Terra `limb_mesh_spike`, owning new
`tools/character-mapping/retained-mesh-spike/` and matching artifacts only.
Prove one connected gray near/right leg in east01/03 before a full character
renderer. Sol remains idle. This narrows the feedback loop; it does not relax
the requirement to repair the whole requested walking preview.
Sol's pending patch landed at stop: `retained-continuous-walk/gray-east-kit.json`
and `build-near-leg-proof.mjs`. They are preserved unrun drafts, not validated
evidence. Terra was notified and may reuse sound code in its separate folder;
the draft shoe mask/sole measurements need actual pixel verification.
Terra's small connected-leg source/01/03 render is now inspected: the knee has
no disk/zigzag join, one alpha component and no bright-neutral background pixels
after donor-local keying; eight triangles per pose have matching winding.
The shoe is deliberately omitted at this checkpoint. Astra approved extension
to the gray character's full east eight-phase cycle in the same spike folders:
four continuous limbs, intact rigid terminal hands/shoes, original head/torso,
correct watch side, no exposed hip/cuff gaps. Whole-cycle visual quality remains
unproved; do not mark any rejected roster member repaired from the leg test.

Full gray/east checkpoint initially omitted complete terminal artwork because
the mesh ended at wrist/ankle. Terra added whole masked rigid hand/shoe draws.
Root then rejected the checkpoint again: left-hand source elbow/wrist was
incorrectly mapped to target wrist/hand, shrinking the hand; the trouser donor
also left a proximal gap beneath the hem. Terra owns these bounded corrections.
Do not hide detached pixels by component deletion when the transform is wrong.
Both leg surfaces now draw before the body; shoes draw beneath trouser cuffs.
Source-mask/attachment visual review still gates expansion to all directions.
Corrected gray east01..08 was then reviewed by Astra: intact hands/shoes,
continuous knees, proximal trouser source registered beneath hem. E07 has one
isolated sampled opaque pixel at (100,263), documented rather than deleted to
hide a transform defect. The other seven have one opaque silhouette component.
Astra authorized Terra to expand the mechanism in the same owned spike folders
to both retained identities and all four directions (64 walks), preserving
compiled geometry, original static poses, guides, identities and source hashes.
Use native N/S source donors and individually reflected/reordered W limbs;
no finished-frame mirroring, joint disks, per-pose repair or runtime changes.
The next deliverable is a new compatible all-directions manifest and actual
four-direction contact sheets; UI packaging follows only after root review.
Terra did not implement the expanded milestone despite clarification and a
narrowed 32-frame E/W assignment; no lateral-v2 files were written. Astra
escalated implementation to fresh Sol `mesh_walk_expansion`, same spike-folder
ownership, first delivering both identities' E/W connected-mesh cycles. Terra
is stopped. The original gray E8 checkpoint remains intact and reviewed.
Sol implemented `build-lateral-v2.mjs` and 32 E/W frames. Root inspected code
and both contact sheets, catching overly clipped hand masks and a reverted
gray source hip; the worker corrected these and rebuilt. Root reviewed the
new sheets and authorized the next bounded N/S milestone plus a consolidated
64-walk/4-static manifest. This is candidate acceptance for continued review,
not owner approval or production readiness. Source originals remain unchanged.
Lateral validation then identified detached olive shoe components in E/W01–02;
root's larger native-sheet review confirmed small cuff gaps. These are a
remaining acceptance blocker (distinct from isolated one-pixel samples).
Sol must correct the source cuff/ankle coverage once before delivering the
consolidated candidate; the old shin mask ended above its source ankle.
Sol repaired lateral cuff registration and reported no detached shoe components.
The first consolidated 64-frame build then exposed N/S donor contamination in
root review: broad shoe rectangles included slivers of the opposite shoe;
generic torso masks retained stationary orange hand pixels near the gray waist.
These are rejected source masks, not motion-template errors. Sol owns measured
shoe side clipping and per-character/view torso contour correction, plus
background-only removal preserving interior white/cream clothing. Root will
review fresh N/S donor/body sheets and full cycles before preview packaging.

## Delivered retained-character review batch

The requested real identities now have a complete review candidate:
`patient.adult.033` (olive jacket) and `patient.adult.032` (gray overshirt),
each with eight poses in all four directions plus original South standing and
sitting. All original source files remain unchanged. Sol `retained_donor_merge`
prepared measured donors/composites; Terra `retained_inline_preview` packaged
the inline controls; Terra `mapping_contract_audit` built the preservation
register. No game integration, commit, push or external generation.

Astra inspected all four direction contact sheets and static guides, reviewed
renderer/validator code, and independently ran the read-only art validator:
64 recompiled geometries, 704 applied transforms, 640 endpoints, 141 output
hashes, 168 donor checks, four static registrations; max residual
0.00009088647542832942 px. Full inline playback/static/source/guide/320/736
checks passed. Astra made only tiny final heading/aria-label integration fixes.
The final pack has 68 registered frames at one fixed pixel scale/baseline;
Astra byte-matched all three embedded atlases and their manifest/placement
hashes. No relative source-image dependency remains.

Sealed manifest:
`artifacts/character-movement/retained-donor-merge/all-directions-v1/all-directions-manifest.json`
SHA `3736df231f28dbcb5eaa8b4420ca7cdb726cddfb69d72b565209aef0ab788ee7`.
Inline preview: thread visualization directory `retained-character-walks.html`,
563934 bytes, SHA
`7586868c60ed586952629a84de26c5810530187bd3990b7f091df1145a923c8b`.
Preservation register SHA
`1d06d8f3c5b7748d90fbe6ba6387195d65672b7881edd3b81597386f1182f574`.

This completes the bounded two-character in-thread example, not production
qualification or the entire roster conversion. Reconstructed clothing/joint
seams remain visible. The register preserves all 55 reference PNGs: 50 exact
patient joins, five role/identity exceptions including the style guide; founders
remain separately preserved. Other 48 patients and founder fits are pending.
Next work is source-backed fitting of subsequent retained batches and resolution
of explicit exceptions; no new-design production until intended coverage and
conversion effort are accepted. Earlier partial/rejected checkpoints below are
history and do not override this delivered-candidate state.

## Current continuation checkpoint

The subsequent read-only audit resolved the patient crosswalk: all 50
`patients-v1` sourceSha256 values match 50 unique retained PNGs exactly. The
olive-jacket source is `patient.adult.033`; gray overshirt is `patient.adult.032`.
Five other source files have no patient match, including a documented style
guide. The 30 founders remain a separate family (10 nonhuman). Earlier notes
below saying the whole patient crosswalk is unresolved are superseded.
Terra `mapping_contract_audit` now owns an isolated metadata-only milestone in
new `tools/character-mapping/retained-roster/` and matching artifacts: reproducible
55-source/50-patient crosswalk, five exceptions and separate founder inventory.
This deliberate disjoint-write exception cannot change sources, art or UI;
all untouched characters remain pending, the two examples east-only candidates.

Parent accepted the corrected preservation registry after inspecting code and
rerunning its read-only validator. It initially pointed at a rejected artifact;
Terra corrected the evidence to the true east-v2 manifest and derived founder
exceptions from stable IDs. Style-guide coverage remains not applicable pending
role, not 34 required character poses.

Initial north/south donor output rejected on actual pixel review: several arms
were empty, a thigh contained a hand, and a shoe was a shard. Rest-source crops
have different centers and shoulder/hip heights from the walking crops. Shared
uncorrected mask coordinates caused these errors. Parent inspected source grids
and supplied measured landmarks; Sol must correct per-view registrations and
inspect full donor masks before compiling the final cycles. West candidate
remains recognizable; front/back outputs are not accepted merely because the
manifest exists. UI Terra remains ready for valid final directional assets.

Parent independently ran the east-v2 read-only validator: 16 compiled phases,
176 applied transforms, 48 frame hashes, all floor/support/ratio checks passed;
maximum endpoint residual 0.0000908865 px. Parent directly viewed corrected
gray-overshirt phase01 and the visible independent fitted guide. Accepted for
expansion only; reconstructed fabric and joint seams remain review candidates.
Sol `retained_donor_merge` now owns the next complete two-character milestone:
eight west/north/south phases, South standing and seated registration, with a
unified manifest. Use the same retained sheets, measured per-view donor kits,
existing lateral/north-south solvers and preserved anatomical asymmetries.
Terra `retained_inline_preview` continues isolated UI packaging. Terra
`mapping_contract_audit` has a read-only exact source inventory/coverage-input
milestone, without reopening approval history. Full retained coverage is not
established by the two examples. No peer-task coordination or runtime changes.

## Consolidated ownership and real-art milestone (2026-09-11)

Owner-directed PM consolidation supersedes earlier GS-010 ownership and peer
signoff boundaries: GS-012 owns source preparation, mapping, previews, exception
fixes and coverage validation. GS-010 is on production hold. Do not message,
poll or wait on peer tasks. Preserve transferred assets and the existing Cortan
receipt; recovery of that seated-image job does not gate independent local art
mapping. Existing external authorization boundaries remain unchanged.

Sol `finish_mapping_demo` owns the next bounded implementation milestone in new
`tools/character-mapping/retained-art-proof/` and
`artifacts/character-movement/retained-art-proof/`: select two retained source
designs, inspect actual pixels, record reusable piece/joint/body mappings and
show east stride/passing against accepted motion with source comparison.
No generic replacements, newer four-character substitution, broad approval
reaudit, game/runtime edits or external generation. Astra reviews actual art,
provenance, geometry and limitations before delegating the complete 8-phase
four-direction standing/sitting comparison. Next extend an explicit coverage/
exception record across the intended retained roster; two examples cannot
establish all-character compatibility. Bulk new designs await owner acceptance
of full intended coverage. Keep prior evidence and rejected work intact.

Selected retained originals (Astra directly inspected both complete sheets):
- `Photos for Codex 2/Patients or Staff or Other Characters/exec-06e158f5-4ec0-4b07-b336-befe1f93b121.png`, auburn hair/glasses/olive jacket/cream knit top;
  SHA-256 `769d93e7a29a9c2b02b8cb8efa8054ec93260cc7e85c0894c1dbd00fce0ce79d`.
- `Photos for Codex 2/Patients or Staff or Other Characters/exec-33437146-564e-4cb1-a7e2-ad41504ea752.png`, dark hair/beard/gray overshirt/white tee;
  SHA-256 `b1fc32d443e65c5dcae0237ed51cbdc6838ef37a83fce9eefb0b5a254286d670`.
Both are 1536x1024 multi-pose retained sheets. Source filename/hash identifies
this proof; unresolved runtime IDs do not gate local fitting. Preserve larger
head-to-leg proportions, jacket overlap, rolled cuffs and watch asymmetry.

First actual render reviewed and rejected by Astra: the source cutout approach
preserved identifiable head/torso texture but polygon measurements lost hair,
arms and shoes and created severe shards/gaps. Passing solver checks and zero
browser errors did not establish artwork fit. Sol must preserve the rejected
attempt, remeasure against coordinate-labeled actual donor crops, prove source
reconstruction from the piece union before articulation, and measure actual
sole contacts. No full-cycle expansion or production acceptance until corrected
stride/passing renders pass visual review. Current renderer is diagnostic only.

V2 also rejected after direct parent pixel review: woman reconstruction99.9714%,
man100%, straight support and sole scalar checks pass, but passing renders show
rotated overlap triangles and near arm remains rigid with torso. Preserved under
`artifacts/character-movement/retained-art-proof/rejected-v2/`. Previous Sol
stopped writes. New Sol `retained_donor_merge` solely owns NEW
`tools/character-mapping/retained-donor-merge/` and matching artifact folder.
Its milestone merges retained standing torso and separate side-view limb donors
to resolve missing body surfaces and moving-arm/shard defects for east01/03.
No external generation required while same-character donors suffice. Parent
continues actual pixel/source/provenance review before full-cycle delegation.
Terra independently checked landmarks; its initial arm-depth swap suggestion
was retracted as screen-position inference. Keep near large backward arm/right
and far small forward arm/left according to source overlap, with uncertainty.

Donor-merge first render rejected: phase01 was incorrectly supplied as the
unaltered original stride, and standing-head registration changed head scale in
phase03. Second render uses mappings in both phases but still has duplicated
sleeve/hand pixels and detached shoulder strokes. Astra reviewed actual native
screenshots and implementation. Sol's immediate scope is now the woman's clean
donor contact sheet plus source mask overlays, with torso free of baked-in arms,
independent upper/forearm pieces, intact original head and exclusive leg/shoe
surfaces. Inspect donor pixels before composing more poses; hold the man and
full cycles until this source preparation succeeds. No acceptance claimed.

Woman candidate now passes basic articulation for expansion after same-source
west-idle far sleeve, plain-back jacket hidden-surface fill, reusable joint caps,
accepted motion ratios, shoulder placement and layer order corrections. Parent
inspected actual native/overlay pixels and code. Cosmetic reconstructed fabric
and joint edges remain unaccepted for production. Latest reviewed phase SHAs
`b7361b5c0c1c015c18632317d090da8eab2f46da4cb9ec46220587e73811072b`
and `761ebd6596c6bf85e72380b23a220d6d64696168ed2a3a4a5555f2ae716bccfb`.
Parent found two remaining code/evidence fixes: actual torso destination/clip
must replace stale provenance; trimming a shin mask must not move its anatomical
ankle anchor and inflate limb width through normalization.

Next bounded milestone delegated to same Sol `retained_donor_merge`: correct
those two findings, adapt the retained man's own donors and fit, then produce
all eight EAST phases for both designs with same pieces/scales/renderer and
source/overlay comparison plus read-only checks. Preserve reviewed candidate
and failures under versioned outputs. Other directions, standing/sitting and
full roster coverage still remain; no all-character or production acceptance.

East-v2 review corrections remain with Sol: man's body now clean after central
back-fabric patch, but source-hand pixels leaked through a thigh mask; exclude
them there. Independent guide UI used stale output key and blank images; fix
actual visible-image loading and UTF-8/template labels. Validator must verify
all expected applied transforms, actual matrix endpoints, output hashes and
recompiled geometry, not rely on declared status or empty trace loops.

One deliberate isolated-write parallel milestone: Terra `retained_inline_preview`
owns ONLY new `tools/character-mapping/retained-preview/` and the thread-scoped
`retained-character-walks.html` preview. Sol retains all art/donor ownership.
Terra reads art manifests and packages controls/playback/step/fitted-guide UI;
it cannot edit art or substitute missing directions. This avoids write overlap
while testing UI independently of art preparation. Rebuild preview as genuine
direction/still outputs arrive. Current genuine output scope remains east only.

## Current owner correction — preserve and map the approved roster

The owner clarified that the requested two-character demonstration must use
actual approved characters, and the full approved roster (estimated by the
owner at roughly 55 identities) must be retained and mapped. The M8 illustrative
costumes looked acceptable as a demonstration but did not meet that requirement.
Do not replace approved faces, hair, clothing or body shapes with generic
costumes. Share motion phases and fit them to each approved body/profile;
the Patient 01 body dimensions are not a universal replacement silhouette.

Terra completed the bounded read-only roster audit; Astra checked the source
plan and runtime manifests. There are 55 private PNG reference files, separately
from 50 patient and 30 founder runtime identities. No stable-ID manifest proves
a one-to-one link between those reference files and runtime identities. Runtime
membership alone does not establish historical owner design approval. Preserve
both libraries while linking sources, identities and approval records. The four
GS-010 foundation designs are owner-approved private designs, not yet animation
ready or registered in the public runtime catalog.
The next owner-facing preview must use two actual existing approved reference
identities once linked; do not assume the newer Patient 01/02 pair represents
the older roster. Patient 01 technical donor work remains process research.
Then proceed in batches across the remaining approved roster.
M8 remains an illustrative reference only. No new
generic visualization or production acceptance substitutes for actual art.
GS-010 has received the exact correction. Its existing Cortan service recovery,
donor production and measured image-piece binding remain outstanding.

## M8 — In-conversation two-character mapping demonstration

Owner requests two characters walking, standing and sitting on the appropriate
silhouette. Deliver an isolated interactive demonstration using two clearly
illustrative costumes on the accepted Patient 01 proportion/phase geometry;
do not represent these as completed GS-010 artwork or a measured second identity.
Walking must reuse all eight accepted poses in each cardinal direction. Both
costumes and the optional silhouette/joint overlay use the same geometry.
Standing faces south; sitting is a static illustrative chair pose; pause holds
the exact current phase. Include walking/standing/sitting, direction, pause and
phase inspection controls. No production assets, game, Cortan or GS-010 files change.
Terra owns the single thread-scoped two-character-mapping-demo.html fragment;
Astra reviews actual source/readback and records limitations. Existing accepted
references remain unchanged. This is a display milestone, not M7 art acceptance.

M8 draft review: Terra implemented the fragment and one correction. Parent
source review found remaining shoe/ground mismatches, insufficient seated body
lowering and silhouette coverage, and interface issues. Neither draft is
accepted. Sol `finish_mapping_demo` now owns the sole output file for a bounded
correction; Terra is finished. Astra independently compares embedded walking
coordinates to the accepted references while Sol corrects rendering/static poses.

M8 demonstration delivered: Sol completed the bounded correction; Astra read
the actual renderer/control source and final fragment. All 32 walking poses,
1,648 embedded scalar coordinates and visibility arrays exactly match the two
accepted references; all 96 added N/S foot/ground scalars also match. Final
script syntax and literal-fragment checks pass, and both source-reference
hashes remain unchanged. The first parent foot-data inspection command needed
object-expression parentheses; that was a review-command correction, not an
artifact defect. No browser or runtime visual test was run.

Output is the thread-scoped visualization directory's
two-character-mapping-demo.html, 28,924 bytes, SHA
`aa028edd26d49d989e7aaab665f74f2dd4cbbfc7f2e9e24fa06717f1c2ef012f`.
Both illustrative costumes share the geometry renderer; static standing/sitting
are demonstration poses, not calibrated production furniture or accepted
GS-010 artwork. Sitting translates head/torso down 18 units, meets the chair
seat and plants both soles at y181. Pause/manual stepping, direction and static
modes are represented in the inspected source. Terra made the draft and initial
correction; Sol made the final renderer correction; Astra performed independent
source/data review and planning only. No game/private-art operation occurred.


Current approval checkpoint (2026-09-11): the owner stated "Cortan approval
provided" in GS-012 and directly answered "Cortan approved" in GS-010. The
outstanding informed request is resolved for the four named characters and
their resident private artwork/derivatives at https://cortan.taile197db.ts.net,
within the 142-pose scope including corrections, mirrors and downloads, with
no local image uploads. GS-010 recorded the approval and resumed its active
Sol worker on the prepared Marisol seated-left V2 correction. Patient 01 actual
donor/clothed walking proof remains the next walking milestone. Earlier pending
approval statements below are historical. GitHub backup is not a prerequisite
to continuing; no push, runtime integration or roster expansion was authorized
by this approval update.

## Goal and owner requirements

Give founders, patients, employees, and sidewalk passersby consistent visual
movement. Map-up is north. The first selected topic is east/west walking.
Keep the exact observation and owner wording in
[the movement review](../features/character-movement-review.md#mov-001).

The owner has now requested the same eight-pose, proportion-fitted treatment
for north/back and south/front walking. MOV-003 records the exact wording:
north currently sways side to side and south legs only go in and out. This
expands the directional gait definition; keep the delivered lateral reference
unchanged while GS-010 reviews raster applicability.

The owner accepted that north/south reference with "Okay, looks good", then
requested exact freeze on any pause and destination-aware resting poses in
MOV-004. This authorizes a bounded runtime presentation milestone independent
of unfinished raster production: freeze current position/facing/frame on pause;
on an unpaused floor stop use south-facing idle; at a chair/bed use its pose.
The M1/M2/M4 prohibition on game-source edits applied to those reference-only
milestones. M5 explicitly scopes the new runtime behavior and preserves all
other runtime work, sources, game session, saves, build and server.

The owner agreed to the clarified shared movement template and minimum
eight-position side-view gait with "Okay sounds good". This is agreement on
the proposed direction, not acceptance of an implemented visual result or
completion of GS-012. The owner subsequently said the motion preview looks
great and asked whether its proportions match the characters. This accepts
the gait as a motion reference; it does not validate the diagram's body
dimensions or its fit to character artwork. See MOV-002.

Four main poses, with a distinct intermediate between each, including wrap:

1. Right leg / left arm far forward.
2. Arms down; right leg straight with foot grounded; left leg passing through
   with a slightly bent knee.
3. Left leg / right arm far forward.
4. Arms down; left leg straight with foot grounded; right leg passing through
   with a slightly bent knee.

## Constraints and repository state

- Repository: `C:/Users/Kyle Kent/Projects/GamifySurgery`, branch `beta`, intake
  HEAD `40638f677b674bc59f74f6742d55c8dda027bae1`.
- Rechecked the dirty worktree on 2026-09-10. Extensive shared source, asset,
  test, and documentation edits remain. No reset, broad staging, or cleanup.
- Source review established four side-walk beats with only A/neutral/B art;
  founders/generic actors reuse idle for neutral. This is not live reproduction.
- Reliable saves remain the project priority. Do not alter routes, speed,
  sessions, identity, existing saves, launcher, game build, server, or browser.
- Canonical play: `START_GAME.cmd` then exactly `http://127.0.0.1:4173` in the
  intended persistent profile. Never use it for this isolated preview's QA.
- GS-010's current handoff reports its four-character idle/portrait foundation
  finished, with animation/runtime integration still false. GS-010 owns those
  designs and assets. GS-012 will establish exact ownership before any shared
  renderer/asset edits; M1 uses only new task-owned preview files.
- Do not edit the project board, clinical concepts, current broad handoff,
  character catalogs, existing art, or private image packages. M5 alone owns
  the explicitly coordinated runtime presentation files listed below.

## Architecture and decisions

Use one gait/pose definition to author character-specific appearance, then
export completed sprite frames into the existing full-character renderer.
First review a simple base-body motion study. It is a diagram of motion, not a
replacement character or proof of final pixel art. Preserve body proportions
and identity in any later fitting work. No runtime skeletal migration.

## Milestones and ownership

### M1 — Isolated eight-position motion preview (motion reference accepted)

Terra `side_walk_preview` produced the first draft and is complete. Sol
`correct_side_walk_preview` completed the bounded M1 correction, using only:

- `docs/features/character-movement/side-walk-preview.html` — new canonical
  self-contained preview fragment, no game imports.
- The identical display copy at
  `C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/character-walk-preview.html`.
- `artifacts/character-movement/sol-preview-review.json` — optional correction
  validation report only.

Astra owns this plan, the requirements record, scoped handoff, architectural
decisions, review, and QA notes/screenshots under the new
`artifacts/character-movement/` directory. The worker shares the dirty tree,
preserves all other edits, does not spawn workers, install dependencies,
change planning, start a server, touch the owner browser, publish, or commit.

Acceptance criteria:

- Show east and west views of the same eight-pose base walk, with a consistently
  facing head/profile and anatomical left/right limb identity.
- Main poses are 1/3/5/7; 2/4/6/8 visibly transition, including 8 back to 1.
- Full strides have opposite arm and leg forward. Both passing poses have
  arms down, the specified support leg straight and foot at ground, and the
  other knee visibly slightly bent while passing.
- Keep segment lengths coherent, avoid backwards-bending knees, and use
  distinct poses instead of duplicated idle frames. In-place motion study
  does not claim world-space foot-lock or validate game movement speed.
- A compact play/pause and previous/next control supports review of every pose.
  Current phase labels and a clear R/L legend support limb identification.
- Respect reduced-motion preference; no saved state, external API, game assets,
  or network dependency. Responsive and usable at 320px and desktop widths.
- Follow the visualize skill's fragment and theme contract. Keep labels concise.
- Parent reviews actual source and focused isolated checks. Any browser QA must
  use a fresh headless context with inline content, no game URL or shared server.
- Owner accepted the motion reference after reviewing the displayed preview;
  proportional fitting to character art remains M2.

Validation: syntax/readback checks, eight-pose geometric/sequence assertions,
isolation/preservation check, responsive/control verification in an isolated
context if needed, and visual review. Use installed tools only; do not run
game builds or its browser suite for this documentation-contained preview.

### M2 — Patient 01 reference reviewed (rendered-art fitting still pending)

GS-010 confirmed the eight DISTINCT lateral sprites per direction, opposing
arms/legs, two bent-knee passing poses and four transitions. Front/back A/B and
seated/exam remain separate. Both earlier lower-limb-only pilots are preserved;
neither is final MOV-001 artwork. Full resident processing approval remains.
Do not repeat the approval question or request a new render from GS-012.

Read-only source masters are under:
`Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2/characters/patient-01/`
and are named `right-idle-master.png` and `left-idle-master.png` (448 by 1024).
Astra has viewed both originals. The accepted motion diagram remains unchanged.

GS-010 owns all raster sources/edits, masks, Cortan/ComfyUI jobs, private review
and production packages, and its own planning. GS-012 owns gait definitions,
joint geometry and fitting review. Neither task changes runtime or atlases in
this milestone. GS-012 must not edit, copy, upload, or render private character
raster files. Read-only source inspection and pixel/alpha measurements are
permitted; deliver only numeric data and a separate mathematical vector study.

Sol completed this bounded geometry implementation (difficult visual fitting
and anatomical reflection semantics), with write ownership limited to:

- `docs/features/character-movement/patient-01-fit.json` — source dimensions,
  hashes, observed silhouette landmarks and uncertainty, inferred joints,
  proportions, registration, fixed segment lengths, eight explicit phases
  for both directions, and anatomical/reflection contract.
- `docs/features/character-movement/patient-01-fitted-walk.html` — isolated
  vector fitting preview using the numeric fit, without private raster data.
- Identical display copy at
  `C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-fitted-walk.html`.
- `artifacts/character-movement/patient-01-fit/worker-*` — reproducible fit
  generator/checks and worker validation evidence only.

Astra owns planning, independent read-only anatomical/source review, and new
`artifacts/character-movement/patient-01-fit/parent-*` validation evidence.
Sol shares the dirty tree, preserves others' work, and does not spawn agents,
install packages, commit/push/publish, alter planning, or start/touch game
servers, sessions, saves, or the owner's browser.

Acceptance criteria:

- Fit head envelope, shoulder/hip placement, torso depth/height, hand reach,
  leg lengths, shoe/floor position to Patient 01's actual approved side views.
  Separate observable pixel bounds from estimated hidden anatomy and authored
  motion choices; do not claim anatomically exact recovery from a clothed PNG.
- Preserve head/face identity and torso scale in the authoring contract. The
  vector study is a fitting guide, not a raster costume or accepted final art.
- Supply all eight phases per direction; main phases 1/3/5/7 satisfy MOV-001,
  with actual straight planted support and bent passing leg in 3/7, arms down
  at both passing poses, full opposite arm swing in 1/5, and four transitions.
- GS-010's follow-up requires explicit native 448 by 1024 joint coordinates
  alongside frame coordinates, including heel/toe/contact/lift, near/far identity,
  native segment lengths and uncertainty, and rigid head/torso bob per phase.
  Keep all scalar distances in the coordinate system declared for that block.
  GS-010 will consume those data with its installed resident image/mask tools;
  no GS-012 server job or raster guide creation is requested or permitted.
- Fixed lengths, forward-bending knees, no unreachable targets or shrinking
  limbs, no duplicated idle/phase, coherent shoe contact and bounded frame fit.
- Specify east/right-view near = anatomical right and west/left-view near =
  anatomical left under the south-side camera convention. Distinguish reflection
  of labeled joint coordinates (same phase plus layer reorder) from a plain
  raster flip (near/far identity swap and half-cycle phase permutation for the
  symmetric template). Preserve independent asymmetric approved masters.
- Document master-to-frame registration using actual manifest evidence,
  floor anchor (64,181), and one stable fit across all walking frames; avoid
  per-phase autoscaling. Flag any reach or canvas conflict before handback.
- Follow the visualize skill. Concise east/west vector study, consistent
  right/left identification, exact stepping and reduced-motion-safe playback;
  responsive 320/736 light/dark display with no private imagery or network.
- Reproducible Node checks using installed tools only, plus isolated fresh
  headless Chrome inline/sandbox QA with all requests blocked. No game URL.
  Parent independently reviews the actual data/source and visible main poses,
  checks geometry/reflection/controls, and verifies source masters unchanged.

Validation commands: `node artifacts/character-movement/patient-01-fit/worker-validate.mjs`
for worker evidence; parent supplies separate `parent-validate.mjs` after source
review. Run from the repository root; no game build or broad test suite.
Deliver reviewed reference paths/evidence to GS-010 for its own art work.
Final rendered-character fitting and owner acceptance remain later gates.

### M3 — Bounded runtime integration and representative flows

After the visual/asset contract is settled, reserve the exact gait selector,
manifest/resolver, atlas-builder, and proof-test paths. Delegate one bounded
integration milestone at a time. Use meaningful focused tests and separately
coordinated patient/employee/founder/passerby flow validation, then obtain
owner playtest acceptance. M2/M3 are sequencing context, not an active scope.

### M4 — North/south fitted eight-pose reference (technical review complete)

Terra `inspect_movement_animation` completed read-only preflight. Parent reviewed
the actual two-pose selector, bitmap resolvers and procedural fallback excerpts.
North is `back`, south is `front`. The fallback shifts the legs horizontally,
but loaded bitmap frames are preferred, so this is not a live reproduction.
Generic v3 walking additionally resolves to left-facing art irrespective of
front/back direction; record this for later integration, not a runtime edit now.

GS-010 confirmed Patient 01 sources in the same production-foundation-v2 directory:
`standing-master.png` (south/front) and `back-idle-master.png` (north/back).
Both are 448 by 1024 with floor edge 941 and top opaque edge 43. Front alpha
bounds are [71,43,405,941), back [68,43,409,941). Existing frame placements are
front [32,10] with resized [64,171], back [31,10] with resized [65,171]. Parent
viewed both originals. Use a stable scale/registration for all phases, preserving
these independent approved views. Do not alter the delivered M1/M2 reference.

GS-010 continues to own raster/private packages, masks, jobs and approvals. It
reported a new automatic approval rejection pausing its private-art processing;
that task is handling its remaining-work proposal/approval. This does not block
GS-012's numeric/vector work or authorize GS-012 raster work. No extra approval
question here. GS-010 explicitly confirmed continuing this separate reference.

Sol `correct_side_walk_preview` completed the bounded M4 implementation for
the depth projection and geometric/visual fitting. Exclusive new write paths:

- `docs/features/character-movement/patient-01-north-south-fit.json`.
- `docs/features/character-movement/patient-01-north-south-walk.html`.
- Identical display copy at
  `C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-north-south-walk.html`.
- `artifacts/character-movement/patient-01-north-south/worker-*` for the data
  generator, focused validator, evidence and vector-preview screenshots.

Astra owns the plan/MOV/handoff, read-only source/architecture review and
`artifacts/character-movement/patient-01-north-south/parent-*` evidence. Worker
shares the dirty tree, preserves others' work, and does not spawn agents,
install, commit/push/publish, edit planning, touch game/server/browser/saves,
modify/upload/render private rasters, or call Cortan/image generation.

Movement/design acceptance:

- Eight distinct phases for north and south. Preserve the accepted anatomical
  sequence: right leg/left arm forward, right support with left passing, left
  leg/right arm forward, left support with right passing; intermediate 2/4/6/8.
- Body/head centerline and torso width remain stable; small vertical rise/fall
  is allowed. No cyclic horizontal translation or exaggerated side-to-side roll.
- Feet advance and recover in stable lateral lanes, with real sagittal knee
  articulation, foot lift/heel-toe detail and opposing arms. Do not substitute
  horizontal leg spreading. A view of front/back needs depth/foreshortening.
- Use a small explicit 3D or sagittal latent gait model before projecting to
  front/back. Validate fixed segment lengths there, not incorrectly against
  foreshortened 2D lengths. Document the stylized camera/projection assumption;
  it is an authoring choice, not calibrated photogrammetry. No general rig engine.
- Supply all joints and foot/contact/support/depth/visibility data in latent
  coordinates, registered frame coordinates and explicit native 448 by 1024
  coordinates. Scale scalar lengths/lifts and bob consistently with their
  declared spaces. The same anatomical phase appears in both views: south/front
  anatomical right is screen-left; north/back anatomical right is screen-right.
- Ground is a projected plane: planted forward/back feet can sit on different
  screen rows. Compare each sole with its own projected ground contact, not one
  forced screen baseline. Fixed character anchor stays (64,181). Account for
  shoe/stroke extents and source/target bounds; do not autoscale each pose.
- Respect observed front/back head, shoulder/torso/hip widths, hand reach and
  leg proportions. Preserve identity/cloth scale in the art contract. Record
  exact source hashes/alpha separately from inferred hidden joints and uncertainty.
- Head/face versus back-of-head indication and depth-aware arm/leg overlap must
  make facing readable. The vector guide remains a schematic, not final art.
- Compact responsive north/back and south/front motion preview with play/pause,
  exact stepping, anatomical R/L color-plus-dash identity, useful initial render,
  reduced motion and visibility handling. Keep labels concise and theme-aware.
  Follow visualize skill with literal canonical HTML; generator replaces data
  markers only. No network, private images, external libraries or game imports.

Validation: worker `node artifacts/character-movement/patient-01-north-south/worker-validate.mjs`,
then independent parent validation and actual rendered main/transition pose
review at 320/736 widths in light/dark. Use installed Node and isolated fresh
headless Chrome with inline sandbox content and requests blocked; no game URL,
server, owner profile or game build. Preserve originals/runtime and previous
reference hashes. Send GS-010 the reviewed paths, exact owner wording and MOV-003
record. Rendered roster sprites and game integration remain subsequent work.

### M5 — Pause freeze and destination resting poses (active)

Terra `inspect_movement_animation` completed read-only preflight, with parent
review of the cited scene and view-model seams. Every real pause source
(manual, hidden tab, management, build and save/pause) converges on paused;
buildMode also freezes scene motion defensively. The scene freezes phase/delta
but then selects idle because `characterPose` treats paused as not moving.
Route synchronization and downstream pose/display resolution continue during
paused redraws. Patient and founder semantic seated/bed state can additionally
override a still-moving interpolation tail. Generic stationary founder/staff
activity/working poses conflict with the owner's explicit floor-standing rule.

Product decisions:

- Preserve each represented actor's last displayed world position, direction,
  right-facing flip and resolved pose while paused/build mode, including model
  refreshes and actor-list reordering. Pause must not resolve an arrival.
- Resume from frozen route progress and gait phase; paused elapsed time cannot
  be consumed as a catch-up jump. Preserve normal route handoffs and retained
  tails. A newly created actor with no last frame may initialize once; genuinely
  removed actor keys are pruned. Camera movement/zoom remains usable and may
  reproject a fixed world position.
- On actual unpaused floor stops use front/south standing idle for all groups,
  even when a founder activity label or employee home assignment exists. Keep
  task labels/timing/domain work intact; only their resting art changes.
- Use existing semantic chair/seated and patient exam-table/bed destinations
  only after both logical and interpolated arrival. Preserve their existing
  fixture registration/orientation and distinguish passing through a fixture
  from occupying it. No new furniture inference, pose raster, or atlas contract.
- Freeze is presentation-only and does not add persistent snapshot/save schema.
  First mount has no prior rendered sub-frame; use existing persisted location.

Implementation ownership: Terra `inspect_movement_animation` completed the
core implementation; Sol `correct_side_walk_preview` completed the bounded
validation correction. Existing source may be edited only
in `apps/player/src/facility/FacilityScene.ts`. Add a small pure presentation
state/pose helper and behavioral tests in
`apps/player/src/facility/characterMotionPresentation.ts` and
`characterMotionPresentation.test.ts`; a focused scene integration test at
`characterPauseArrival.test.ts` is also owned. A routeMotion test addition is
allowed only if necessary; routeMotion implementation, art resolvers/manifests,
session/domain, fixture builders and their unrelated dirty edits stay unchanged.
Parent approval of an expanded code seam requires concrete evidence, not a
larger opportunistic rewrite. GS-010 was notified of this narrow runtime
ownership; it owns all private art and atlas production.

Worker shares the dirty tree, preserves others' edits and the accepted reference
hashes, and does not spawn agents, install, edit planning, commit/push/publish,
use private raster/job tools, rebuild or start/restart any server, or touch the
owner browser/game/save. Parent owns planning, baseline copies and independent
review evidence under `artifacts/character-movement/pause-arrival/parent-*`.
Eight pre-change code/test snapshots and nine protected hashes were captured
there; use the FacilityScene baseline to review only this milestone's diff.

Validation/acceptance:

- Exercise the actual scene presentation wiring with lightweight test doubles,
  or a narrow shared production seam, in addition to pure helper tests. Avoid
  source-string assertions that merely repeat the implementation.
- All four groups freeze mid-step through paused/build redraws, changed model
  inputs and list reordering: unchanged position, facing, flip, gait/atlas frame.
  Repeated pause and resume does not drift or catch up. Preserve route-tail and
  handoff behavior, and prove floor idle/front and chair/exam arrival transitions.
- Keep no-prior-frame and absent-actor cleanup behavior defined. Cover fixture
  drawing offsets and avoid sitting in transit; existing idle/chair/bed routes
  and available bitmap contracts stay compatible.
- Worker runs focused tests with `npm run test --workspace @gamify-surgery/player
  -- src/facility/characterMotionPresentation.test.ts
  src/facility/characterPauseArrival.test.ts src/facility/routeMotion.test.ts
  src/art/lateralGaitCycle.test.ts src/facility/frontDeskPresentation.test.ts
  src/session/patientMovementViewModels.test.ts` (omit a nonexistent optional
  test path). Run `npm run typecheck --workspace @gamify-surgery/player` and
  `npm run test:boundaries`. No game build/e2e server.
- Parent reviews the actual baseline diff, test adequacy and outputs, then runs
  applicable independent checks. Report existing unrelated failures precisely.
  Live visual acceptance waits for an owner-authorized game reload/build time;
  do not disturb the running canonical session to validate this code change.

### M6 — Shared template to character authoring contract (complete)

The owner now asks GS-012 to work out character mapping and coordinate directly
with GS-010. MOV-005 records the exact request. This milestone establishes an
agreed authoring and later integration handoff; it does not start raster jobs
or change the game renderer. Accepted motion references and M5 remain intact.

Astra owns architecture, the GS-010 discussion, this plan, the MOV record and
the scoped handoff. Terra `mapping_contract_audit` owns one read-only audit of
current identity/atlas/pose seams, per-character fit requirements and future
integration acceptance. It may not edit files, spawn agents, process private
art, install, build, use the owner browser or send external messages. All work
shares the existing dirty tree and preserves unrelated changes.

Acceptance: confirm a common eight-phase/four-direction contract with GS-010;
separate shared anatomical motion from each character's measured body/garment
fit; settle source/registration/reflection metadata, pilot order and review
criteria; record actual agreement and outstanding dependencies precisely.
Existing art is full-character sprites, so any runtime skeletal migration is
outside this milestone. Patient 01 is a representative fit, not universal body
geometry. Keep patient visual-template IDs separate from encounter names.

Validate against the actual existing source/data contracts and GS-010's reply.
Documentation/contract work needs no game build or repeated M5 test suite.
GS-010 continues to own its private art, raster pipeline, packages, atlas
production and approval handling. Its current inventory is pending production;
coordination messages must not mark assets complete or resume rejected jobs.

Terra completed the read-only audit. Astra inspected the actual selector,
resolver/types, phase data, registration/reflection contracts and preview
clocks. GS-010 confirmed the architecture, exact inventory keys/counts, separate
character fitting, ownership and representative-first sequence in native replies
and its own art-plan contract. Parent incorporated all requested clarifications
in `docs/features/character-movement/character-template-mapping.md`, contract
`shared-character-walk-v1`, version 1. Accepted reference files are referenced
by hash without modification. All four M5 source/test hashes also remain intact.

The numeric addendum declares equal 1/8-cycle phases, 180 ms review frames,
pixel-edge/center and rounding conventions, geometric shoe contact targets,
lateral 2D versus north/south latent 3D length invariance, and concrete field
lookups into existing fits. Donor-specific raster fitting allowances remain
unset until measured pilot review; source confidence is not an art tolerance.
GS-010 explicitly confirmed this numeric addendum with no conflict and no further
version 1 design confirmation needed. It independently checked the four hashes,
both preview clocks and all 32 view/phase field lookups. The next art handoff is
Patient 01 east phases 01/03 after GS-010's compositor/donor
proofs and its existing production approval. No raster job or runtime change
is part of M6; runtime and broader roster integration remain later milestones.

### M7 — Repeatable character mapping pipeline (numeric compiler accepted; art process proof active)

MOV-006 directs process-first execution for a future roster of hundreds. Stop
new character-design expansion until the mapping method is proved on existing
designs. Prefer preserving their identity and adapting source pieces; selectively
rebuild incompatible/hidden source parts when pilot evidence supports that
choice. Preserve originals. Move forward one manifest-defined batch at a time.

M7A is a new local fit-target compiler and batch preflight tool. Terra
`mapping_contract_audit` completed read-only feasibility work; Astra reviewed
the existing generators and rig data. Those historical generators overwrite
accepted references and must not be run. Sol `correct_side_walk_preview` is
assigned the substantial geometry/tool implementation because it combines
constrained 2D/3D fitting, reliable batch outputs and meaningful failure tests.

Write ownership is limited to the new `tools/character-mapping/` directory,
new recipes/manifests under `docs/features/character-movement/recipes/` and
`batches/`, and worker evidence under
`artifacts/character-movement/mapping-pipeline/worker-*`. No edits to existing
reference JSON/HTML/generators, runtime, catalog, package.json/lockfile, private
image packages, shared art workflows, GS-010 planning or other dirty files.
Workers share the tree, preserve others' work, do not spawn, install, commit,
push, publish, send task messages, process images, use network/job tools, build,
run servers or touch the owner browser/save. Astra owns architecture, plans,
scoped handoffs, peer coordination and independent `parent-*` evidence.

Required M7A behavior:

- Pure numeric compiler with explicit measured/estimated character recipes,
  separate lateral 2D and north/south latent 3D dimensions, stable per-view
  registration/lineage, canonical phase IDs/timing and full 32 target records.
  Parameterize the shared motion rather than copying Patient 01 absolute joints
  onto another identity. Require a complete explicit fit; missing measurements
  remain blockers. No image reading/rendering and no live rig migration.
- Read-only Patient 01 reference fixture/example and three explicit pending-fit
  entries for the rest of the first GS-010 batch. Do not invent their landmarks,
  donor pivots, atlas IDs or approval/completion status. A target-only output is
  always pending raster review, never a completed frame or runtime-ready asset.
- Correct fixed-length/reachability/support/arm-phase math, proper coordinate
  units, geometric sole targets, fixed head/torso envelopes and registration,
  per-view layer/depth order and declared reflection permutation. Invalid fit,
  nonfinite/negative dimensions, unsafe reflection, missing inputs or geometry
  outside the declared target frame must fail with actionable diagnostics.
- Dependency fingerprint covers recipe, motion/reference and compiler inputs.
  Deterministic content-addressed target outputs; unchanged work reuses verified
  bytes. Stale/missing/tampered output fails check. Prevent duplicate identity or
  output keys and traversal/overwriting input/source paths; preserve old runs.
  A manifest runs only its named batch and reports pending measurements separately.
- Provide a small documented CLI for compile/check/batch preflight, useful
  machine-readable per-phase target data and batch summaries. Any donor fields
  remain declared input contracts until GS-010 supplies actual measurements.
  Do not create or submit image jobs. Capture local tool timing separately from
  unmeasured raster/manual effort.

M7A validation: Node-core tests for deterministic output, changed recipes/code
dependencies and tampering, missing measurements, invalid geometry/reflection,
path/duplicate-key safety and interruption-safe reuse. Compare Patient 01 output
with the accepted 32 reference poses without changing them; report maximum
numeric differences/rounding allowances explicitly. Exercise independently
changed limb/body parameters to prove lengths and support constraints are
recomputed, not merely copied. Run a clearly labeled synthetic hundreds-entry
batch for tool capacity only. Preserve all M5 and accepted reference hashes.
No game build or repeated unrelated player suite is needed for offline tooling.

M7B is GS-010's raster process proof: actual compositor rectangle proof, donor
inspection and east phases 01/03, then full loop and independent views. GS-010
owns all raster execution and its approval handling. Relay the owner's exact
new proceed instruction and ask that existing authorization be considered before
any duplicate approval question. No bypass of a rejected operation is allowed.
Capture actual jobs, corrections, operator/elapsed work and reusable pieces.
Joint review decides adapt versus selective rebuild from evidence. No numerical
pass alone proves visual quality or efficiency for hundreds of characters.

GS-010's native reply confirmed this process-first scope and ownership. It
reviewed the new proceed instruction but reports the existing private-image
processing approval condition remains unresolved; it will not retry or ask a
duplicate question. Its unaffected work is an offline compositor adapter and
effort ledger plus a normally reviewed nonprivate procedural mechanics proof.
The actual private Patient 01 donor/raster proof remains pending that art-side
boundary. Its lead currently favors adapting the approved head/face/outfit and
reconstructing missing donor surfaces, with no evidence for a whole-character
remake. Compiler/adapter interfaces were exchanged; no duplicate gait solver
or shared runtime writer is introduced.

M7C qualifies the first existing four-character batch and the reusable process
before further designs: measured recipes, complete required pose inventories,
art/geometry review, repeatable re-export, selective redo and explicit unresolved
items. Expand only after the representative and varied-outfit proofs pass.
Until then, target compilation, raster readiness and batch acceptance remain
distinct states; never imply the running game has received the new art.

M7A parent review, in progress: Sol's initial Node tests passed, but source and
CLI review returned asset-key aliases, immutable batch rerun bytes and ambiguous
lift-unit fields for correction. Parent then reproduced three further failures:
valid zero shoe offsets rejected by redundant validation, a misspelled selection
flag silently ignored, and a controlled Windows junction redirecting output
outside the selected output directory. The synthetic redirect stayed within
task-owned artifacts and its link was removed after evidence capture. Parent
also identified shoe-width padding incorrectly applied to every north/south
point, and missing compiler dependency in an all-pending batch fingerprint.
Sol owns this bounded validation hardening and its regression tests. Earlier
candidate output hashes are historical, not the accepted integration target.
Reproduction evidence: `artifacts/character-movement/mapping-pipeline/parent-probes/validation-hardening-reproductions.json`.

M7A accepted on 2026-09-10 after Astra read the actual implementation and
hardening changes, independently ran 14 Node tests (zero failures/skips), and
passed 8,809 additional assertions. All 2,480 compared frame/native/latent points
and 592 shared scalar values across 32 accepted poses have maximum deviation 0
(declared numeric rounding allowance 0.0001, not an art tolerance). Maximum
native/frame roundtrip error is 0.000009466 frame pixels. Whole-body enlargement
recomputes geometry and registration, and independent boundary fixtures cover
valid-zero offsets, a fitting head without shoe padding and a scaled heel
overflow. CLI compile/check, selected-only batches and byte-identical repeated
batch summaries pass. The test suite covers interrupted recovery, stale/tampered
files, invalid inputs/reflection and actual Windows junctions. Its synthetic
300-character / 9,600-target test took 4.077 seconds in the final parent run; this
measures local numeric work only. All 16 protected hashes are unchanged.

Reproducible parent command:
`node artifacts/character-movement/mapping-pipeline/parent-validate.mjs`.
Final evidence: `parent-review.json` and `parent-tests.tap` in that directory;
Sol's independent evidence is `worker-validation-m7a-hardened.json`. The first
parent harness invocation had an incorrect relative import depth; only the
parent harness was corrected before the successful run. Compiler source stayed
frozen during each acceptance run. Final review found one remaining early recipe
read in batch intake; Astra made the permitted one-line integration correction
to check linked ancestry before that read, then reran all acceptance checks and
an invalid-JSON-behind-junction regression. Earlier parent evidence is preserved
as `parent-review-before-batch-read-guard.json` and its matching test log. Sol's
hardening evidence precedes this one-line amendment; the current parent report
pins the final amended source. All M7A work is local/uncommitted.

Accepted target dependency fingerprint:
`5da58c99ef43e60b192fd8b2e71ab5eea7a27701ea262a66684e1b7635f37dda`.
Target SHA-256:
`f5c016d0575d0e22d0a6cbed5c12707b55076864a892924a3fa3ae169564f05c`.
The artifact is under `artifacts/character-movement/mapping-pipeline/parent-runs/mixed-20260910-patient-01/<fingerprint>/targets.json`.
First-four batch fingerprint:
`96a5ba85f7081cfda300ca2d3b1c03ca0a95f0b0aaea61c97b7942d11d49d764`;
one compiled numeric recipe, three explicit measurement blockers, zero accepted
raster frames. Exact paths, hashes and interface were delivered to GS-010 via
the native task tool on 2026-09-10.
GS-010 independently verified the amended artifact hash and dependency pin;
all 32 target records are byte-canonical-equal to the prior numeric output.
Only dependency evidence changed with the batch intake guard. Its M1 offline
procedural adapter also passed its own parent review (17 tests and 22 package
hashes). GS-010 subsequently reported successful actual M2 nonprivate compositor
execution; its final package is accepted and the binding layer is in progress. This
peer report is not GS-012 character-raster acceptance.

Terra's second read-only M7 audit confirmed numeric/adapter coordinate and
phase compatibility but identified an unimplemented binding seam. GS-010
accepted ownership as a small next offline milestone after its nonprivate
compositor mechanics proof. It must pin artifact bytes/dependency fingerprint,
select exact output keys, resolve endpoint paths without another gait solver,
and carry cardinal/asset views, native dimensions/registration, timing,
reflection lineage and reconciled layers. Synthetic pieces can test that seam;
actual donor crops/pivots/masks and private raster bindings remain art-side work.

Terra's focused follow-up found an explicit N/S bridge condition: M1's rigid
translate/rotate donor operator cannot represent changing projected limb lengths
across the eight-phase latent-3D walk. Patient 01 native projected forearm spans
96.946147 to 146.125601 pixels. This is expected projection, not broken fixed
anatomy. GS-010 received the evidence and requirement for declared projected
variants or a separately proved projection/deformation operator. Do not loosen
the rigid 1e-6 length check to hide foreshortening. Separately reconcile the
lateral target's four-decimal publication rounding with numerical invariants;
neither decision establishes any raster tolerance. Track projection setup and
reuse cost in the process proof; M1 lateral mechanics cannot qualify N/S.
GS-010 explicitly agreed. For lateral rounded targets it proposed the tighter
stage-derived native bound `sqrt(2)*0.0001/scale + sqrt(2)*0.0001`, adding at most
0.00005 only for comparison against a rounded native scalar. Astra confirmed
the intermediate-base/final-joint/native-endpoint stages and requires pinning
that policy to compiler bytes plus synthetic proportion/registration tests.
The broader existing 0.002-frame invariant is not a recommended art or bridge
tolerance. N/S still needs its explicit projection strategy.

M7B mechanics progress, reported by GS-010 after its parent review: synthetic
Cortan job `bb0d4b1d-4921-4cf1-8fd2-50fd908ba5fe` completed with 1,084 ms execution
from its own history and 71 ms observed download time. The fixed 84-node graph
SHA is `e2585246c2cdd59e615afff998002e5ddb0c2e5d452b85f1614f98350a96f1ba`.
The run is in the GS-010-owned mixed batch's
`pose-process-proof-v1/m2-run-001/`. GS-010 verified the receipt/history, six
audit hashes, fixed 448x1024 canvas, unrotated and signed-clipped controls,
transparency polarity and partial-alpha rotation edges. +30/-30/+45 degree
orientations and maximum centroid residual 0.0241 native pixels support center
rotation and noncentral-pivot compensation without extra rebase. These are
observations of this synthetic sampler, not donor/art acceptance tolerances.
One local Windows-subfolder protocol correction resumed the same recorded job;
no second submission and no private inputs, models or uploads were reported.

GS-012 read `tools/character-pose-process/m2-README.md` and acknowledged the
result without rerunning any network command or reading private images. The
final evidence package is received; the private character-processing condition
remains unchanged.

GS-010's final M2 package handback is now received. It reports 25 checks and
11 tests, 28 package files independently rehashed by its parent, and ledger
revision 4 with one protocol correction plus pixel review. GS-010 Sol is now
implementing B1, the agreed offline synthetic artifact-binding seam; M1/M2 and
the GS-012 compiler/targets remain frozen. Terra `mapping_contract_audit` is
assigned a read-only review of only the final M2 JSON/text evidence. It must not
read or hash PNGs, inspect character inputs, use network tools or edit files.
Astra retains architecture, peer coordination and B1 acceptance review.

Terra's final metadata review is complete. It verified report SHA
`27479b66494ff40ba393e37d4c41e7942776a2bcdaaaee247da3627061082eb7`
for `m2-final-validation.json` and
`452805c52920b95e397c2b053722fc76d4a5e038883e1583b136f3c732f4061f`
for `m2-final-checksums.json`. The manifest declares `observations-final.json`
SHA `8af7241468eb9281c14fd3a4c81c241f7206db1246c8d4dc3cedd3465dedbc71`.
Their directory is
`Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/pose-process-proof-v1/m2-run-001/`.
Astra read the final validation report: 25 named true checks, 11 passed tests,
one submission/one resume and explicitly unknown queue/operator time. Neither
GS-012 nor Terra independently read/hashed the PNGs; pixel proof remains
GS-010's parent-reviewed evidence. The observed alpha/mask inverse differs by
at most one quantization level in this fixture, not an exact inversion rule.
Unknown sampler settings, actual donor pivots/garments and art tolerances remain
unproved. GS-010 received this acceptance boundary for B1.

B1 semantic acceptance for GS-012's later review:

- Pin target artifact bytes/dependency fingerprint and the applicable numeric
  precision policy. Resolve exact output keys and declared native endpoint paths
  without retyping coordinates or duplicating the gait solver.
- Preserve stable character ID, cardinal and asset views, anatomical side,
  phase ID/index/normalized time, independent/reflected source lineage, native
  coordinate-space/canvas/registration and the required depth/layer ordering.
  Reject inconsistent combinations rather than silently defaulting them.
- Bind the same declared rigid lateral segment across phases within the agreed
  stage-derived numerical allowance; report residuals. Preserve floating-point
  placement until the documented single integer placement boundary.
- Exercise both side views and the cycle with synthetic pieces, changed
  proportions/registration, deterministic replay and stale/malformed/mismatched
  inputs. An endpoint path must name a permitted anatomical point, not arbitrary
  object traversal. Donor crops/pivots and source provenance remain declarations
  until art-side inspection.
- Reject unsupported north/south projection explicitly. Never interpret its
  large foreshortening as lateral numerical error or authorize arbitrary scaling.
- Keep outputs labeled synthetic/target-binding proof. No private image reads,
  writes, jobs, runtime integration, completed-character claim or art efficiency
  claim follows from this milestone.

Once GS-010 provides stable B1 code and tests, delegate Terra's read-only
semantic audit before any new implementation edits. GS-010 remains the sole
B1 writer; communicate findings to its parent rather than modifying its files.

First B1 candidate review is complete; acceptance is withheld pending its
bounded correction pass. Terra read the frozen resolver and confirmed exact
target/phase selection, native registration, anatomical references, lineage,
layer reconciliation, scale-one transforms and one placement quantization.
Its stage-derived residual allowance is sound for the pinned compiler. Real
Patient 01 remains donor-unbound and north/south remains diagnostic-only.
Astra reviewed the actual tests and JSON evidence without running the GS-010
evidence writers or reading image files. The candidate proves only east poses
01/03 with two upper-arm pieces and one proportion/registration profile.

Terra found that the fixture helper hardcodes east far/near groups, preventing
a bound west fixture although the resolver can accept correctly declared west
groups. Its patterns also permit hand references while the anatomy map supports
only upper-arm, forearm, thigh and shin. GS-010's parent separately found an
unguarded validator, hardcoded test counts and imprecise README claims. All
findings went to GS-010; no GS-012 edits were made to B1 files.

GS-010 accepted one correction milestone with Sol as sole writer: three
compiler-generated synthetic profiles, two lateral views and eight phases
(48 unexecuted graphs, 384 mappings). Include both arms and both legs across
the four supported segment types, one unchanged complete piece kit per profile,
genuine body-ratio variation and independent registration variation. Derive
layer groups from each target, align supported reference patterns, exercise
semantic guards through authenticated inputs, guard validation I/O and capture
actual test evidence. Keep the fixed 448x1024 canvas and the real-donor/N/S
gates. Preserve the previous candidate in binding-v1 and its tool snapshots;
new evidence belongs in binding-v2. The compiler, recipes and accepted targets
stay frozen. Next review starts only after GS-010 hands back a frozen package.

Corrected binding-v2 numerical/semantic review passed. Terra reviewed the frozen
core/fixture code and sampled saved graphs; Astra independently rehashed all
180 text/code entries and checked all 48 saved graphs and 384 actual AddLayer
mappings without invoking the emitter. The independent probe checked exact
request/kit reuse, all arm/leg segment identities, native endpoints, calculated
center-pivot rotations and placements, target-derived depth, scale one, phase
identity, lineage and registration. All six view/profile combinations have
eight distinct emitted poses; the 96 SaveImage prefixes are distinct. Maximum
rigid length residual is 0.0004035139337901228 native pixels, maximum placement
error per axis 0.4945438935758375 and maximum quantized distal error per axis
0.4944290858604745, each evaluated against its separate numerical bound.

Candidate metadata pins: final-validation.json
`7ed12b69b839855b12b06de2e334cc1b0cef8ed4abe60fc518a74080bbb89a8c`;
final-checksums.json
`778618803f11c2afbe76ac20baacaf8e2b8a1a137284ff881e5794a11c1aa954`.
Both are in the GS-010 mixed batch's pose-process-proof-v1/binding-v2 directory.
The report records 23 passed tests; GS-010's parent independently reran them
with zero skipped, reproduced all three compiler artifacts in memory and
checked the same complete emitted matrix. GS-012 did not run its evidence
writers or read image bytes. Terra confirmed authenticated semantic negatives
and the real-P01-unbound/N/S-diagnostic-only gates.

GS-012 sent conditional numerical acceptance and released the freeze for one
small GS-010-owned infrastructure cleanup. Its parent found missing linked-path
guards before build/generate mkdir/read, checksum tool reads and test spawning;
the legacy guarded validator also needs its schema hash checked. Give the v2
validator a strict read-only default with explicit sealing of versioned reports,
and align the remaining hand/torso reference patterns to supported limb parts.
Preserve all recipes, compiler artifacts, kits and 48 graphs byte-identical.
Review the final source diff/pins and actual relevant test evidence before full
B1 technical acceptance; repeat geometry only if that cleanup changes it.

Final v3 cleanup review: Terra accepted the scoped guards/schema/test-receipt
and narrowed reference patterns. Astra read the actual diffs and GS-010's
captured 25-pass/zero-skip receipt, verified all 195 final text/code hashes and
all 156 unchanged numeric/kit/request/resolved/graph hashes. Before acceptance,
Astra found a first-build regression: v2-build guards compiler-outputs with
mustExist:true before the compiler can create it. Terra confirmed this exact
failure by source review. GS-010 received the one-line mustExist:false
correction, which retains ancestry checks and the compiler's guarded creation.
Do not repeat the accepted geometry audit; await that correction and its final
hash/validation addendum. Existing v3 reports remain preserved.

Final B1 technical acceptance is complete. GS-010 made exactly the one-line
first-build correction and proved that the compiler creates a new isolated
output root with the same 32-target baseline bytes. Astra independently checked
the whole-source replacement, current builder syntax, all 194 other v3 package
entries and the new baseline artifact hash. No numeric/transform change or
additional geometry audit was needed. Terra's guard review and focused
first-build confirmation are complete; GS-012 made no B1 implementation edits.

The selected package is final-validation-v3.json SHA
`72efee86b3638575b4a3cfdd896629e35cc215719f189135b5eb9e8fbeb4d91f`
and historical final-checksums-v3.json SHA
`d5c233eb17772489943da6424136fa53b2674c0e44b85063812c48a34585f245`,
with exactly one explicit override: target-binding-v2-build.mjs SHA
`12b94dcee57adc20f6fe247a7a51225c6d53fa97fe7fbc635edd3eabc6d5b696`.
The override and fresh-output proof are recorded in the adjacent parent-evidence
directory's binding-v2-output-root-fix-addendum.json, SHA
`535b379339a2014337f2ddf4e64c8246e16bd0c34c26656bdcea4258cc5fcf00`.
Do not validate the current builder against its superseded v3 manifest entry.
The actual final focused receipt is 25 passed tests with zero skips; all 156
frozen numeric/kit/request/resolved/graph files retain their accepted hashes.
GS-010 received this final acceptance and no further B1 changes are requested.

Parallel next-step planning only: Terra is evaluating whether the accepted
north/south latent/native targets can drive a small calibrated affine projection
of a fixed appearance piece. This asks for the exact rest-axis/width/pivot,
foreshortening, registration and visibility contract plus the minimum synthetic
proof. The earlier rigid-2D limitation is settled and is not being reinvestigated.
No implementation, source image reading, node execution or template changes are
authorized in this audit. GS-010 has been notified; it retains compositor/art
ownership while Astra retains the eventual architecture decision.

The N/S feasibility audit is complete. A per-segment calibrated affine mapping
is mathematically possible from accepted native endpoints, but the installed
integer resize/rotation operations still need sampler, pivot, dimension-rounding
and occlusion proof. Astra wrote the precise limb-basis mapping and the
image-axis-aligned source requirement in
docs/features/character-movement/north-south-projection-proposal.md, then sent
GS-010 the proposed next synthetic walk milestone. Source anchors/pivots/width
remain fixed; longitudinal scale is derived solely from the pinned target.
No artwork, operation or north/south implementation has been accepted. Prepared
projected variants remain the fallback if the mechanics or art proof fails.

GS-010 read the full proposal and explicitly agreed to the separate gated
strategy, fixed 448x1024 proof canvas, fixed source anchors/width, T(p) pivot
mapping and separate resize/placement/raster observations. Its Sol worker is
doing the bounded read-only installed-operation investigation while a disjoint
local five-frame art package is finished. No N/S implementation or remote job
has been released; GS-010 will scope the synthetic milestone after that handback.
Private donor work and furniture integration retain their existing boundaries.

Separate GS-010 art handback received: production-poses-v2 contains five
parent-accepted standalone 128x192 frames: Patient 01 seated-left/right and
exam-table, Patient 02 seated-front/left. GS-010's receipt records 77 checks,
13 package hashes, five exact PNG copies and ten board image cells reviewed.
GS-012 read only the JSON receipt and verified the manifest/checksum-report
hashes; it did not inspect or hash image bytes. Manifest SHA is
`2d5bb27c5b984cc928d6b00e4fd755c92f9dbde21e56aae7d11008d4d73e4dd3`;
checksums.json SHA is
`aebb5ae51fb41b158eff4a6e02141ef66d10351b666da75d34f8d78e47ac230c`.
The receipt is pose-process-proof-v1/parent-evidence/production-poses-v2-parent-review.json
under the mixed batch. This is peer art acceptance, not GS-012 visual or
furniture/runtime acceptance. All 128 walking frames remain, plus eight seated
and one exam frame (137 remaining of 142). GS-010's Spark packaging is complete;
its only active Sol work is the N/S installed-operation investigation.

Agreed N1 design: GS-010's bounded north/south projection proof.
The installed-operation handback proposes ImageScale nearest-exact with explicit
dimensions/crop disabled, then native-size AddLayer rotation/placement in a
separate strategy. Astra agreed the realizable resized map must anchor P0 and
use T_actual(p), while retaining T_ideal as the desired reference and reporting
dimension, pivot, distal and final placement errors separately. Analytic bounds
for the declared synthetic kit and the precise formulas are now in the N/S
proposal. Its 16 immutable front/back pieces feed 16 baseline phase canvases,
one new true N/S-registration case and one controls canvas (36 outputs).
The old B1 registration fixture is lateral-only. A named synthetic-only
far-leg/far-arm/torso/near-leg/near-arm rule supplements the target's separate
arm/leg arrays; it grants no garment occlusion acceptance. GS-010 owns the
bounded implementation and normal submission review. M1/B1, private-art
handling and the accepted motion templates remain unchanged.

N1 v7 local preparation is now technically accepted. GS-010's Sol worker
implemented the separate projection strategy and its parent froze the package.
Terra `mapping_contract_audit` completed a read-only semantic review of actual
source, artifact authentication, native endpoint selection, source reuse,
registration variation, depth order and quantization. Astra read the validator,
tests and parent receipt, independently verified all 71 text/code entries and
the sealed 10-pass/zero-skip test receipt, and traversed the actual saved graph
without importing project code. The 18 fixed canvases have 36 unique outputs,
136 target limb mappings, seven isolated mechanics controls, 16 reused source
images and 17 fixed torso plates. Both baseline directions cover phases 01–08.

Astra independently recomputed actual ImageScale dimensions, AddLayer rotation,
center compensation, final placement, analytical anchor coordinates and layer
groups. Maximum dimension-only distal error is 0.4141664417698543 native pixels,
pivot-model error 0.03882810391592384 and placement-axis error
0.4966332205492563. These remain separate analytic errors, not raster/art
tolerances. The revised fixed plate overlaps every depth group in each baseline
canvas; reported intersection areas sum clipped primitive areas, not unions or
pixel counts. The new registration fixture changes all 16 N/S native records
while preserving frame, latent, projection and visibility data.

Frozen package: the mixed batch's pose-process-proof-v1/north-south-v1 directory.
Exact selected pins:

- prepared-graph.json: `a1c65208d2f6264786d6ad0fa53ad963ad19a91309efe0936b1eaa0d5e602e4a`
- transform-receipts.json: `96d9f0f3cc980b44ca57dbced358f82cf0fce7501a66e41e9b199950070b312f`
- manifest.json: `77ba0f98702a2498d08bdccd10e56884b8709da0b0e0332a87c10e81312a415b`
- checksums-v7.json: `0538537aaddf1faa87be64f6ac2f638026c3ba392bfd336c00c0ef2a51426dee`
- validation-v7.json: `359752770ef8eb6cb933a4e62f7e2e70e5eee34b78861c06235e3006660d185f`
- core: `7b0564122bbea1dff097c64b6752b545a0241d673bb81815eda946abb87c88ee`

The peer receipt is parent-evidence/north-south-v1-parent-final-review.json.
It records independently reproduced rejection cases and 384 opaque primitive
polygons checked across the 16 baseline canvases. GS-012 did not execute the
GS-010 generators/tests, write its evidence, read images or perform network jobs.
No additional N1 changes are requested; acceptance and exact pins were sent to
GS-010. All GS-012 work in this milestone was delegated read-only review,
parent acceptance and durable planning; GS-010 retained implementation ownership.

N2 execution and N3 analysis are now accepted for the bounded synthetic pixel
proof. GS-010's Sol worker implemented/executed the runner and produced local
analysis and review boards. Its parent inspected the source, independently
decoded all 36 original PNGs, checked the seven review entries, and reviewed all
18 overview cells, both eight-phase GIFs and native/analytical boards. N1 remains
frozen. The only recorded procedural submission is
`48396b34-2fb8-400d-a39f-e096ac055fe3`; the saved request and history contain the
exact accepted N1 graph. There are 18 composites and 18 masks at 448x1024,
totalling 4,740,053 bytes. Server execution was 11,209 ms; observed local download
was 1,717 ms. Queue/operator time and savings remain unmeasured.

Terra `mapping_contract_audit` reviewed the actual analyzer and JSON semantics
without running it or reading image bytes. Its nearest-exact source-row rule,
pixel-center moments, y-down rotation and actual-minus-expected angle from down
toward positive x are coherent. That angle convention is opposite the earlier
parent angle convention; magnitudes agree. Astra read the complete final peer
receipt, independently verified the six supplied text/code pins and three review
text/JSON entries, compared the entire request/history graph against N1, and
reconciled all 36 SaveImage declarations with history/manifest/download metadata,
the byte total, one recorded execution and timing/null fields. The pixel and
visual evidence remains GS-010's parent review; GS-012 did not run its analyzer,
tests or generators, read/hash images, rewrite its evidence or perform a job.

Accepted fixture observations, never production art tolerances:

- All 16 baseline composites differ, with eight ordered phases per direction.
- Pure controls have zero alpha or hidden-RGB mismatches in 14,756 comparisons.
  All 9,079 opaque control pixels differ from literal requested RGB by at most
  one channel level, including the no-resize case. The responsible stage is
  unisolated and rotated rounding can differ; no constant correction is justified.
- Rotation centroid components differ by at most 0.0004860729645770334 pixels
  from the discretely resized source's pixel-center moments transformed using
  actual rotation and quantized placement. Full-source centroid comparison is
  correctly omitted for the clipped control.
- All masks are grayscale. Alpha plus mask red is 254 at 8,498 pixels and 255
  at 8,249,038 pixels; it is not an exact inverse. Rotated output has 10,849
  fractional-alpha pixels spanning 1–254. No binary-alpha cleanup is qualified.
- Sixty-eight independently inspected opaque interior samples demonstrate all
  four declared depth relations in the 16 baseline cases plus changed registration.
  This proves the named synthetic policy, not garment occlusion or every pixel.

N2/N3 selected package is pose-process-proof-v1/north-south-run-001; N3 review
artifacts are in review-v1. Exact pins:

- actual-history.json: `99a2fbade8c596152b8f09b743b286a0f253ca84e05ad3223db5f18bdb288ed4`
- audit.json: `6aae2dab17a93e7ef57834d022b9c45f322e5f3fc9460226db8d85becaf180c3`
- north-south-analyze.py: `9000757d4e3e2da751aec63078f6da89a02db4b0393a6fddbbe5106c6c4e52cb`
- review-v1/analysis.json: `b64356b33b39141095dd1631529a67341726a59cdf4471f689b0131c4edab4dc`
- review-v1/checksums.json: `019f2fe0b5852abbbf10175546dd6f8c5d9679f6c70a05758e357369c0436192`
- parent-evidence/north-south-run-parent-final-review.json:
  `b63c7d1abe85063c663ef6b84ce6b742e463dc0f130e70b49aefa3ab8c59a7ff`

The separate final parent receipt is authoritative; frozen worker reports still
retain their earlier pending-parent-acceptance labels. GS-012 sent acceptance to
GS-010 and requested no additional implementation or render. All GS-010 and
GS-012 workers are idle. This milestone retained GS-010 implementation ownership;
GS-012's work was delegated semantic review, independent parent metadata review
and planning. No qualifying implementation was retained without delegation.

Next M7 action: actual Patient 01 donor mapping and clothed cycles, then the
other three outfits and measured preparation/correction effort. Synthetic source
alpha was binary; fractional-alpha source donors, hidden anatomy, seams, hands,
shoes and garments still require their own proof. The private Cortan approval
was provided by the owner on 2026-09-11, as recorded at the top of this plan.
No new synthetic milestone is needed at this checkpoint. The five standalone
art frames remain accepted by GS-010, with 137 frames outstanding and no
furniture/table/runtime integration acceptance. All work is local and uncommitted.

Review actual Patient 01 east 01/03 only after its existing private-image
condition is resolved, then full cycles and the other three outfits before
expansion. The overall process is not yet qualified for hundreds, despite M7A,
synthetic lateral B1 and north/south N1/N2/N3 completion. No image-processing or game operation
occurred in GS-012 for this M7 work.

## Progress and evidence

- [x] Record scope, compass convention, and owner-reported MOV-001.
- [x] Terra `inspect_movement_animation` inspected current gait/rendering;
  Astra reviewed the cited code. No live defect reproduction.
- [x] Owner clarified passing poses and agreed to the shared template direction.
- [x] Reserve new M1 preview-only paths and define acceptance before editing.
- [x] Terra M1 first draft and handback; parent rejected technical acceptance.
- [x] Sol bounded correction and handback.
- [x] Astra source/validation/visual review; preview prepared for owner review.
- [x] Owner base-gait visual feedback: looks great; accepted as a motion reference.
- [x] MOV-002 read-only proportion/asset-contract assessment; numerical fitting remains unvalidated.
- [x] GS-010 confirmed the updated lateral contract, named Patient 01 sources,
  and divided raster versus numeric/vector ownership; confirmation sent.
- [x] Scope M2 fitting implementation and validation before delegation.
- [x] Sol M2 implementation, parent-requested corrections, and evidence.
- [x] Astra independent fit/source/visual acceptance and handoff to GS-010.
- [ ] GS-010 representative rendered-walk review and owner appearance acceptance.
- [x] Record MOV-003 and inspect north/south source and approved masters.
- [x] GS-010 confirmed north/south masters and separate numeric/vector ownership.
- [x] Sol M4 north/south fit, projection, preview and validation.
- [x] Parent M4 independent source/geometry/visual review.
- [x] Deliver M4 paths/evidence and exact MOV-003 wording to GS-010.
- [x] Owner accepted the north/south motion reference ("Okay, looks good").
- [ ] Final rendered-character acceptance.
- [x] M5 pause/arrival read-only preflight, scoped implementation and validation.
- [ ] M5 live visual playtest after the next coordinated game build.
- [x] M6 runtime-contract audit, shared mapping specification and explicit GS-010 agreement.
- [x] M7A Sol numeric compiler/batch implementation, parent-requested hardening,
  independent geometry/CLI validation, and exact artifact delivery to GS-010.
- [x] M7 seam audit by Terra and agreement on GS-010 ownership of the binding layer.
- [x] M7B actual synthetic compositor mechanics and final evidence package,
  pixel review by GS-010 and JSON/hash/semantic review by GS-012.
- [x] M7B synthetic lateral target-binding proof and first-build correction.
- [x] M7B N1 north/south synthetic projection preparation and independent review.
- [x] M7B N2 actual north/south projection mechanics and N3 synthetic pixel proof.
- [ ] M7B actual donor and representative character raster proof.
- [ ] M7C first existing four-character process qualification and measured effort.

M5 draft review: Terra completed production changes in the four owned files
and reported 6 focused files / 41 tests, player typecheck and boundary checks
passing. Parent read the actual FacilityScene baseline diff and both new test
files. The snapshot/route/pose seams are coherent, but the claimed scene test
file only exercised helper values, a locally written ternary and a Map deletion;
it did not exercise production arrival, pause, cleanup or clock wiring. Parent
withheld technical acceptance and returned a bounded correction to Terra for
actual FacilityScene tests with lightweight Phaser/render doubles, plus any
test-discovered fixes restricted to M5 hunks. Existing helper projection tests
may remain. No game build/session activity is required for these regressions.

Terra replaced the tautological tests with a real FacilityScene harness and
again passed 6 files / 41 tests plus typecheck. Parent accepted that direction
but found remaining acceptance gaps: reordering a one-element list, no actual
keyed phase continuity assertion after reorder, no build-only/repeated pause,
only exam arrival with stale logical path, and no actual renderer representation
test. Terra stopped editing. Parent escalated the remaining bounded validation
and test-discovered M5 corrections to Sol `correct_side_walk_preview`, the sole
write-capable worker. Its ownership is the same four M5 files only. Required
checks and all game/private-art/preservation restrictions remain unchanged.

M5 final technical acceptance: Sol expanded the real FacilityScene harness to
cover multiple keyed actors reordered/inserted during pause, stable gait offsets
through resume, repeated pause/build-mode cycles, callback delta handling,
logical-versus-rendered furniture arrival, initial paused rendering, removed and
off-site actors, and actual bitmap/procedural frame, flip and representation
freezing. The tests exposed one defect: an actor first appearing while paused
could change horizontal facing on zero-delta resume. Sol fixed initial facing
inference without creating or advancing a paused route track. Astra reviewed
the actual baseline diff and all new tests, then made a tiny three-line test
extension including a founder whose input location disappears during pause.

Parent independent validation passed 7 files / 52 tests, player typecheck and
boundary verification (875 tracked paths plus launcher contract). All 25
protected/pre-existing reference and runtime files in the final preservation
report retain their captured hashes. Final evidence and exact code hashes:
`artifacts/character-movement/pause-arrival/parent-review.json`. Terra and Sol
are complete; no worker is active. M5 is technically accepted, local and
uncommitted. No game build, server, browser, save or asset operation occurred;
the running game does not yet contain these source changes.

M2 draft review: Astra independently inspected the original PNGs and numeric
alpha envelopes; source observations and a 13-file preservation baseline are
under `artifacts/character-movement/patient-01-fit/parent-*`. Sol produced a
coherent first fit. Parent source/visual review returned fixed-support-knee
lengths, rendered sole edge placement, hand reach, head/profile extent, visible
right-leg dash spacing, and native-coordinate units for correction. Those are
acceptance corrections in Sol's scope, not a final fitting acceptance. The
parent isolated test script is separate from the worker generator/validator.
The first parent draft screenshot wait used a horizontal path's visibility
instead of attachment and timed out; that was a harness issue, then corrected.

M2 final numeric/vector reference: Sol's required validator passed 2,446
assertions. Astra independently passed 3,191 assertions on the final files and
reviewed six screenshots covering poses 1/3/5/7 in both directions, 320px light
and 736px dark. Numeric and rendered fixed lengths, support/passing anatomy,
eight distinct phases, opposite arm swing, native-coordinate units, mirror and
half-cycle semantics, floor edge, controls, reduced motion and responsive
layouts pass. No runtime errors or network requests. All 13 baseline files
match: both approved masters, their foundation manifest, the unchanged accepted
M1 preview and nine protected runtime/launcher paths. No game build or suite.

Final hashes:

- JSON: `5e2ab5bcb5b390acb74fb45ef63b85e83df13ebaf2db102f32e38222700dd571`.
- Canonical/display fragment: `8b75bcb1b717b83d219b304ecdcb51627936cb22089107704da8b1447e330b24`.

Evidence: `artifacts/character-movement/patient-01-fit/worker-validation.json`
and `parent-review.json`; their validation scripts are reproducible from the
repository root. The fit JSON intentionally remains marked owner-unaccepted:
technical reference review does not accept final raster appearance. It records
hidden-joint uncertainty, schematic shoulder separation, common-ground
normalization of the ambiguous idle shoe stagger, and independent-view artwork.
GS-012 delivered the exact paths, hashes, coordinate fields, validation and
limitations to GS-010 using the native task tool on 2026-09-10. Delivery is not
GS-010 or owner visual acceptance. Sol's bounded milestone is complete.

M4 final numeric/vector reference: Sol's validator passed 2,572 assertions.
Astra independently passed 3,976 assertions on the final JSON/fragment and
visually inspected ten captures: all eight phases in both views at 736 light,
passing pose 3 at 320 light and passing pose 7 at 736 dark. Fixed latent lengths,
forward knee bend, support/passing anatomy, stable body X/torso widths/foot lanes,
opposing arm depth, eight distinct projections, native-coordinate/scalar units,
projected-ground contacts, shoe widths, controls, reduced motion and responsive
fit pass. All 18 baseline hashes match; no browser errors or network requests.

Parent review returned boot width, registration mirroring and scalar-unit
issues for Sol's correction. Native radii/shoulder Y and projected lift/bob now
use their declared units; latent heights are no longer labeled frame Y. The
first parent run then had a harness-only CSS dash parsing error (Number on a
computed `px` string); parseFloat corrected it without changing implementation.
The final source stayed stable throughout the successful parent run.

- JSON SHA-256: `7523c59921ec730ec343265e422f8b5d2c8cec5cf442504ea1f52b92ac3e50b2`.
- Canonical/display SHA-256: `d1b45d2796e4070b1db405424ea1478853638e42be76bf47571fc0e5dd32378a`.

Evidence and reproducible commands:
`node artifacts/character-movement/patient-01-north-south/worker-validate.mjs`
and `node artifacts/character-movement/patient-01-north-south/parent-validate.mjs`.
Read their `worker-validation.json` and `parent-review.json` reports. This is
technical acceptance of an approximate authoring guide, not final raster or
owner visual acceptance. The independent front/back master pixels remain intact;
the 0.88 vertical / 0.22 depth projection is an explicit stylization. Both views
retain the same anatomical phase identity. All GS-012 work is local/uncommitted.
GS-012 sent the final M4 paths, hashes, field/registration usage, exact owner
wording, MOV-003 link and technical limitations to GS-010 via the native task
message tool on 2026-09-10. This is successful delivery, not GS-010 or owner
visual acceptance, and does not trigger a raster job or alter approval handling.

## Next action

Parent's isolated headless run of the first draft found `shoulder is not
defined` and zero rendered paths; see
`artifacts/character-movement/initial-preview-review.json`. Source review also
found missing left-leg swing lift in the first half, collapsed support-knee
geometry, inconsistent limb reach, and shoulders below the hips. Syntax-only
worker checks did not catch these. This draft was not shown as an accepted
preview. Sol corrected the geometry/rendering and the subsequently discovered
reduced-motion initialization race. Parent visual review also prompted visible
right-limb dash gaps and foreground contrast for the selected-pose description.

Final canonical/display SHA-256:
`4cf509ce2a0d579aad1eff38d04cf2ebb8489a2a02a9496cac9680dd7e933e75`.
Sol's scoped review and Astra's independent fresh headless checks pass on that
exact source. Parent evidence: `artifacts/character-movement/parent-preview-review.json`,
585 assertions covering eight distinct poses, geometric and rendered segment
lengths, opposing swing, support/bent passing legs, mirrored identities,
half-cycle swaps, stepping/keyboard/wrap/play/pause, reduced-motion initial and
changed preferences, and responsive 320/736 layouts. Light/dark screenshots
were inspected; final visible dash and text contrast were rechecked. No runtime
errors or network requests; nine protected source/launcher hashes unchanged.
These are preview checks, separate from game-flow tests and owner acceptance
of proportion-fitted character art.

Preserve the delivered lateral and north/south references. M5 pause/arrival
source behavior is complete; live visual review follows the next coordinated
game build. M6's shared-character-walk-v1 authoring contract is confirmed.
Review GS-010's representative east 01/03 raster proof, then its full loop and
independent views before roster expansion or
eight-frame art integration. Numeric/vector reference acceptance does not
establish final clothed sprite appearance.

Keep the game session undisturbed and record actual
evidence in [the scoped handoff](../handoffs/GS-012_CHARACTER_MOVEMENT.md).
The task remains open through final artwork and owner playtest acceptance.
Once the owner agrees the overall task is complete, standing authorization
covers scoped audit, commit, GitHub backup, remote verification and archival.

2026-09-12 lateral pilot checkpoint: Sol rendered olive E/W 8 phases each.
Root inspected both contact sheets. Cuff binding now uses overlapping authored
trouser and rigid shoe regions pinned to ankle/sole; no per-pose scaling.
Independent West head was corrected after root caught an East-facing walking
source crop. Correct West uses original top-row standing view. Root accepts
these for candidate assembly only. Terra gray_source_measurements performed
read-only gray all-view and olive N/S measurements, then corrected rolled-sleeve
wrist and West source provenance after review. No worker edits outside Sol's
pilot ownership. Next: olive N/S, gray four-view fit, two-character inline motion.
