# Standard character atlas protocol and Gray Overshirt rebuild

## Goal
Owner rejected most Overshirt arm orientations (clipboard accepted). Establish
one repeatable atlas, anatomical naming, joint attachment and depth contract;
remake Overshirt's atlas and fit review using it. Future characters must follow
this contract instead of inheriting ad hoc donor swaps and silhouette tweaks.

## Constraints
Preserve original character identity and accepted Green/Gray Braid outputs.
Keep accepted Overshirt clipboard appearance where compatible. New v2 assets
and renderer; don't overwrite rejected v1 evidence. Stand/walk4directions,
South jump/clipboard and4staticseats. Local preview only; no integration/push.
No arbitrary image mirroring to correct accessories; no whole-arm affine
stretching to fake elbow anatomy. Preserve unrelated work in dirty checkout.

## Initial architecture proposal (superseded by fixed pages below)
- Fixed packed atlas:8columns (anatomical L/R pair per S,E,W,N view),10rows,
  256px cells. Immutable named slot IDs, reserved cells explicitly empty.
- Row0 head/torso;1 upper arms L/R;2 forearm+hand L/R;3 thighs L/R;
  4 shins L/R;5 shoes L/R;6 seated lowerbody/seated torso;
  7 optional seated bent-arm overrides L/R;8 South clipboard arms L/R;
  9 optional hair front/back. Separate pages may be used during generation,
  but importer always packs the same canonical atlas and manifest.
- L/R always anatomical. Projection:South Lscreenright/Rleft;North Lscreenleft/
  Rright;East nearR/farL;West nearL/farR. Accessories follow anatomical IDs.
- Head uses original pixels with neck-base landmark, aligned to torso neck
  socket. No top-of-head placement rules or garment fragments in head mask.
- Bone parts use named start/end landmarks and canonical rest axes. Uniform
  normalization to slot coordinates, never anisotropic image stretch. Runtime
  bone lengths preserve character proportions. Wrist is not hand centroid;
  ankle is not shoe center; elbow is not cuff centroid without anatomy evidence.
- Upper arms and forearms separate, with overlapping joint collars and rigid
  transforms. IK/pose bend plane explicit per view; no donor guessing from
  bounding-box order. Hands remain attached to forearms; shoes to ankle/sole.
- Fixed layer roles per direction/action:profile far arm behind torso, near arm
  in front;South arms in front,North behind. Head/neck connection same skeleton.
  Hair/prop depth roles explicit. No universal redraw of both hands/caps on top.
- Generation templates, schema, blank/labeled atlas, importer/linter, visual
  orientation/anchor proofs and regression suite are deliverables, not just docs.

## Acceptance
Actual pixels show correct elbow bending, thumb orientation and watch side in
every direction/action. Complete original crown/chin and continuous neck; no
floating wrists, double collars, disconnected shoulders or far-arm leakage.
Check fixed slot semantics, attachment residuals, source accessory ROIs, rigid
bone transforms, cuff-to-heel coverage, no artificial seams, floor contact,
deterministic phases/endpoints and no clipping. Metadata assertions alone never
constitute visual approval. Review all8E/W/Nwalk frames and allactions internally.

## Milestones and ownership
1. Sol read-only architecture critique/source joint inspection; parent decides
   final standard. Parent creates source-referenced generation inputs/prompts.
2. Delegate protocol/schema/template/packer + Overshirt import and base v2 rig.
   Parent independently inspects atlas/anchors and base poses before actions.
3. Delegate actions and validation using same contract; preserve clipboard.
4. Delegate updated review with atlas/anchor inspection; parent final browser
   validation, documentation/handoff, owner review.

## Progress
Sol architecture critique complete; foundation implementation delegated to Sol.
Final layout simplifies above proposal to fixed pages: each S/E/W/N columns;
upper5rows torso/upperL/R/forearmHandL/R; lower6rows thighL/R/shinL/R/shoeL/R;
identity3rows head/backhair/fronthair; actions4rows seatedtorso/lower/armL/R;
clipboard South anatomicalL/R pair. All256px cells. Mandatory semantic landmarks.
Parent generated new upper artwork with builtin imagegen, then removed residual
torso sleeves in targeted edit. Saved assets and actual prompts in
tools/character-mapping/layered-pilot/gray-overshirt-v2/assets/. New upper parts
have separated sleeves/forearms and correct visible profile thumb orientation.
Next import these pieces with measured landmarks and build v2 after foundation.

Parent foundation review caught and requested fixes for silent clipping before
bounds validation, neighboring-part alpha acceptance, and accessory duplication
across mutually exclusive action overrides. Canonical rest placement defaults
are also required. Preserve the established gait while repacking lower art;
this milestone targets arms, neck and ordering rather than redesigning legs.
Frozen baseline hashes verified unchanged: Green South36c22f3b..., directions
7c8ebc56..., actions40ec1233..., Gray Braid e954be5d....

Foundation complete: parent reviewed source/schema/packer/linter/docs and
independently ran 14/14 tests PASS; labeled upper template inspected. Layout
hash6baa2ceef7bc16fc8a9f87b1ab2d99757275876e20170dc8fc4d60cf4c6cbbee.
Sol now owns v2 measured import and base stand/walk rig milestone. Terra has a
read-only review-packaging preparation task; no concurrent write ownership.

Base draft review rejected contaminated sleeve crops, inferred percentage-based
anchors, North collar retained in head mask, and hand-end used as wrist. Sol is
correcting explicit upper/identity landmarks and rigid chains. Parent supplied
actual component bounds and inspected coordinate overlays. New torso v3 removes
profile oval shoulder outlines; prompts and image saved alongside priorinputs.

Lower migration split into isolated Terra modules after repeated draft leg
regressions. Exception to normally one writer: Terra exclusively owns new
lower-parts-v2.mjs/lower-render-v2.mjs/lower-v2.test.mjs; Sol owns existing v2
upper/rig/builder/validator and shared schema. No shared implementation files.
Terra must directly preserve accepted v1 ribbon/shoe behavior through standard
slots, with source pixel translations and explicit authored seams. Sol to
integrate Terra API only after handback. Parent diagnosed crossed profile ankle
normal, perpendicular knee-overlap offsets and constant-floor swingfoot bug.
Shoe normalization revised to horizontal sole registration baseline, preserving
upright source art; toe/heel/ankle remain separate anatomical landmarks.

Parent accepted all32 upper-body walk frames after explicit source-crop/joint
corrections and near-full projected arm reach South/North. Profiles E/W held
fixed after visual acceptance. Neck seams/crown/chin checked at4x. Sol now owns
actions + extraction of reusable renderer with character measurements in data.
Original Terra lower handback rejected (approximate renderer/no frame tests).
Fresh terra_worker standard_lower_migration owns same isolated3lowerfiles and
delivered real36frame port. Parent ran tests and inspectedproof, found knee
wedge from missing hidden sourcecloth beyondnominalbands; worker correcting
underlap and exacthorizontal ankle normal before integration acceptance.

Parent accepted final lower migration after independent 36-frame comparison and
enlarged actual-knee checks. Hidden source cloth underlap preserves the continuous
trouser ribbon; heel/ankle anchoring and lifted sole heights retain approved gait.
Parent also accepted the corrected South jump (all hands within margins), all
four static seats and South clipboard. Integrated East/West/North contact sheets
reviewed. Foundation regression suite independently passes 15/15.

Final milestone: Sol completes shared renderer/action validation and final atlas
rebuild; Terra owns only inline review builder/validator/output and Parts mode.
Separate UI/core ownership permits concurrent finishing without shared edits.
Remaining acceptance: run final core/browser checks, inspect Parts screenshots,
pin final manifest, verify frozen baselines, and update handoff for owner review.

Final core accepted. Parent reran core validator PASS: 54 packed parts, 36 base
frames and 13 action frames; atlas suite 15/15 and lower comparison 36 frames.
Render manifest a34acf866769bb8ecce952fe25a2ba847bb7954abb31388bc4298b9851951635;
atlas manifest 45617421ba0dc27168fe799d897b9b297545f7aa33d99d3a389b01c6cf5aa02d.
All four frozen Green/Gray Braid manifest hashes still match. Core is frozen.
Terra completed lower migration and draft Motion/Parts packaging. Parent review
found Parts decode/control/test gaps; repeated partial handbacks escalated the
remaining isolated UI milestone to Sol. Sol now exclusively owns the two v2
inline-review scripts and their outputs. Parent will review browser evidence.

COMPLETE — ready for owner visual review. Sol finished the shared decode/failure
gate, Motion/Parts transitions, anatomical atlas inspector and browser tests.
Parent independently passed the final Chrome validator and inspected light,
dark and mobile screenshots. One tiny parent integration correction resolves
CSS theme colors before drawing canvas anchors/chairs; rebuilt and reran all
browser checks PASS. Final inline fragment is 948,518 bytes, pinned to the same
a34acf8667... render manifest. File: thread visualization directory,
gray-overshirt-standard-fit.html. Protocol: docs/features/character-atlas-protocol.md.
Actual built-in generation prompts: v2/assets/generation-prompts.md.
No runtime integration, commit, push or deployment. Next action: owner reviews
Motion and Parts; use this fixed protocol for the next character after feedback.

## Owner correction pass — September 15 (active)
Owner found East head behind the visible neck, almost stationary South/North
arms, South shoulder caps in front rather than behind torso, anatomical-left
arm larger in ordinary poses and right arm larger in clipboard. Prior internal
acceptance did not catch these visual failures. Sol owns bounded core diagnosis
and corrections; parent reviews actual enlarged seams, all walk phases and
cross-pose arm-size comparisons before rebuilding review. Preserve accepted
lower gait and frozen Green/Gray Braid. Add motion excursion, arm-scale balance
and visible seam/layer regression evidence; metadata alignment alone is not
sufficient. Next milestone: visual core gate, then same inline preview rebuild,
independent core/browser checks and handoff update. No push or integration.

Diagnosis confirmed: fixed .997 arm reach cancels source vertical swing (South
relative wrist movement <0.2px, North about1px). Left forearm wrist points at the
watch rather than palm root enlarge the distal hand by about9px South. East
center-only head/torso registration misses the visible nape/collar location.
Complete South arms drawn after torso necessarily put caps in front. Corrections
must use true wrist points, authored neck registration, projected arm swing and
separate proximal/distal depth. Clipboard has separate bent-arm scale evaluation.

Parent visual gate accepted corrected East neck4x, South/North8-frame sheets,
East/West8-frame sheets, all seats, jump and enlarged clipboard. Source wrist
points corrected; East native head offset +8px; South proximal sleeves behind
torso with distal cuffs/forearms ahead; S/N use shared projected-length motion.
Independent core PASS on a6eb9943616bd5e93514eff1af5bc705c6df8a06444349a2511010be97d9d56b:
South relative wrist excursion6.1087px, North8.1719px, base forearm source-scale
ratios <=1.036; clipboard source scales .349735/.350732. Parent also passed15
foundation tests and36-frame lower comparison. Frozen Green/Gray Braid hashes
match. Remaining: regenerated inline preview/browser check and final handoff.

CORRECTION COMPLETE — ready for owner review. Final manifest
ba2938f4765c13b19827928e45948531e0bc7c7b06f12a1eb555532304ba37c4;
atlas0b06392f208a598ffa14b277d4783ae92520aa9fc214edbd7103d0246191e94c.
Sol completed corrections, measured proofs, protocol and preview regeneration.
Parent independently passed final core and Chrome validators, inspected final
neck before/after, paired arm scale proof and preview screenshot. Same inline
gray-overshirt-standard-fit.html936810bytes. Numeric results above unchanged.
No new image generation. All lower and approved character baselines preserved.
No implementation milestone left undelegated. Local only, no commit/push/runtime
integration. Next action is owner visual feedback on this corrected preview.

## Torso and sleeve correction (active)
Owner reports South torso too wide/shifted to character right; North too wide;
South cuffs high and disconnected after upper arms hidden by torso across
stand/walk/sit/jump/clipboard. Fresh Sol torso_sleeve_correction owns core
diagnosis/implementation/proofs. Parent owns original-art proportion review and
any necessary imagegen. Must separate body-axis registration from neck socket,
preserve torso proportions, and retain visible sleeve continuity while the
shoulder connection remains behind torso. No disconnected cuff redraw workaround.
Preserve East neck, S/N swing and paired arm balance, lower gait and frozen
Green/Gray Braid. Core visual gate before same-preview regeneration. No push.

Diagnosis: generated South source width~178 overheight~200 maps to~80px trunk;
original innertrunk~61px. Neckmid175.5 versusbodymid163.5 produces~6px drift.
Parent approved original South/North arm-free torso extraction with native source
pixels and measured body/neck/shoulder/hip points. No new imagegen needed. Parent
inspected first extracts and flagged a residual North hand strip for removal.
Next: inspect centered/narrower assembled torso and complete sleeve visibility
in all South actions; check cuffheight against originalsource rather than limb
endpoints alone, then regression/preview rebuild.

Parent accepted assembled source-torso stands/walks/all South actions: width and
centering now follow original body; South upper length41/restreach70 restores
cuff height and complete sleeves. Clipboard size check found narrower trunk's
new shoulder sockets changed bent-arm scale ratio. Parent directs adjustment
of support-hand contact along boardbottom while retaining actual torso shoulder
sockets, rather than adding an action-specific displaced shoulder attachment.

TORSO/SLEEVE PASS COMPLETE — ready for owner review. Sol torso_sleeve_correction
implemented original S/N cloth extraction, body-axis registration, South sleeve
length/cuff correction, fixed-socket clipboard contact x79, regression checks,
protocol update and preview rebuild. Parent inspected actual renderer/importer,
all direction/action sheets, updated clipboard and enlarged torso/cuff contact.
Independent PASS: final core49frames, atlas15tests, lower36comparison, final
Chrome preview validator. Actual South cloth rows60–62px centered79.5; North
58–64px centered77.5–79 (retained source-cloth asymmetry). At least68 visible
sleeve pixels in each sampled South upper-arm band across poses; clipboard
bands also retain continuous sleeves. S/N swing and paired arm scale preserved.
Final render f79c71e5ce4116d954cc7fb2698c1c36bb48c995740dbdf0468bec0df9e25bf9;
atlas91473e17b46758d85500432e1204817730492bbc7a8fd47b8b4b2d74c7662f85.
Same gray-overshirt-standard-fit.html922518bytes with matching provenance.
No new imagegen, no runtime integration/commit/push; frozen Green/Gray Braid
hashes unchanged. No qualifying implementation left undelegated. Await feedback.

## Shoulder, profile sleeve and action refinement (active, 2026-09-15)
Owner requests narrower South/North shoulders with unchanged hand paths, higher
East/West attachments without collar fragments on sleeve art, straight jump
arms as a shared rule, and smaller clipboard arms with left elbow closer in.
Sol torso_sleeve_correction owns core/importer/protocol/proofs and preview build;
parent owns source-art cleanup, decisions and independent acceptance. Preserve
original torso/head identity, lower gait and frozen Green/Gray Braid artifacts.
Parent generated upper-sleeve-cleanup-v5.png using built-in image_gen; inspected
four clean rounded E/W caps. Import only those four parts, preserving all other
existing source selections. Exact prompt saved beside asset. Proposed clipboard
height34/contact y171 keeps shoulders on real torso sockets at smaller arm scale.
Acceptance: before/after shoulder and hand coordinates, source-art hygiene,
enlarged profile walk/seat attachment review, straight constant-length jump,
compact clipboard with valid contacts, core/foundation/lower/browser regressions.
COMPLETE FOR OWNER REVIEW: Sol implemented importer/rig/shared straight-arm
solver and pose rule, regression checks, protocol and same preview rebuild.
Parent reviewed actual code and all four walk sheets, source/stand comparison,
four seats, full jump and clipboard. Parent independently reran core49frames,
foundation16, lower36 comparison and final Chrome review: all PASS.
S/N sockets narrow5/5.0495px with wrist drift at most0.05px; South stand hand
ends change inward0.4px from rotation, motion samples move outward~1.26px.
E/W sockets rise~10px while hand-height drift remains below0.3px. Clipboard
source scales~.298/.304; anatomical-left elbow moves inward5.35px. Straight
jump01–07 has collinear fixed bones;08 remains exactstand. N elbow tolerance
10→10.1 accommodates measured10.0501; original paired scale bounds unchanged.
Render2237b42a100316adcba0624290663e4b03d490d23806cce333d986f2d2d8b09c;
atlased5d4da9fe27b849301c837571b005f08258bec548262c1fb0604a0552286e3b.
Preview916935bytes with matching provenance. Frozen Green/Gray Braid manifest
hashes independently verified unchanged. Imagegen asset/prompt saved locally.
No implementation milestone left undelegated; parent retained art preparation,
planning and acceptance. No runtime integration/commit/push. Next: owner visual
feedback, then a separate character trial to demonstrate protocol independence.
