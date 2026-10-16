# Restore the walking baseline

## Goal and owner decision
Owner rejected v6 forward walking as regression. Recover the strongest earlier
walk and show an honest comparison before further gait changes. Standing and
sitting may switch instantly; smooth transitions are no longer a requirement.

## Constraints
- Freeze artwork; no new ImageGen assets, recoloring, costume or face changes.
- Preserve previous outputs and unrelated dirty work; no live-game integration,
  dependency installation, commit, push or deployment.
- Separate earlier motion quality from rejected texture fitting. Never claim
  appearance approval based on passing tests or earlier motion approval.
- Comparison must identify versions and timing. A gait-only candidate must use
  identical frozen art to current v6; recovered historical frames may be shown
  as historical references with their actual artwork, not mislabeled same-art.
- Stand/sit control changes directly between fixed pose endpoints, with no
  intermediate frames or crossfade.

## Milestones and ownership
1. Terra motion_review_finish investigates saved earlier gait lineage read-only.
2. Astra selects baseline based on saved evidence and visual comparison.
3. Delegate bounded comparison/recovery implementation and snap-state controls.
4. Parent reviews actual motion and validates hashes, playback and snap behavior.

## Acceptance
Earlier walk recovered with provenance; current regressed v6 retained for direct
comparison; artwork changes excluded; instant stand/sit works. Deliver a concise
review focused on selecting motion, not another broad roster pipeline.

## Progress
Plan created. Repo instructions/current layered plan/scoped dirty tree read.
Terra assigned to identify at most three relevant earlier front-walk candidates.

Investigation selected earlier canonical master c9cc gait, preserved in
surface-fitting/raster-retry/manifest.json, states mode=walking,direction=south,
fitted.green and neutral frames,8phases at180ms. M4 north/south reference has
documented owner acceptance and matching sagittal passing-knee contract. Parent
inspected earlier phases1/3/7 and neutral3; historical art fitting remains bad.

Implementation assigned to Terra: new non-destructive rollback comparison of
earlier saved gait and rejected v6. Default motion-only view; optional actual
saved artwork clearly labeled as different historical fittings. Preserve native
cadence180ms/100ms, common elapsed playback and phase scrub when paused. Use each
version's existing stand/seated endpoints with immediate pose changes. This
milestone recovers the reference; it does not claim a same-art gait retarget or
publish an approved replacement. No new assets or gait algorithms authorized.

Completed recovery comparison: Terra built walk-rollback/build-walk-rollback.mjs
and validate-walk-rollback.mjs. Output is walk-rollback-comparison.html in the
active visualization directory; provenance and screenshots are saved under
artifacts/character-movement/walk-rollback. Parent reviewed implementation and
screenshots, requested fixed standing-height/floor registration, native cadence
and scrub corrections, and separate fixed seated endpoint registration.
Parent reran validator: PASS (no errors), including playback, static endpoint
pixels, floor registration, disabled static controls and 320/736px layouts.
Final frozen layered-pilot asset hashes match the starting snapshot exactly.
Reference recovery milestone complete; owner motion review is next. Historical
art fitting remains rejected. No game replacement or same-art retarget claimed.

## Continuation: same-art walking proof
Owner said "Let's keep going" after the comparison. Continue in this task with
a bounded south-walk transfer proof, retaining the recovered reference and v6.
This authorizes implementation exploration, not a claim of visual approval.
Terra motion_review_finish owns read-only transfer diagnosis first; parent
selects the approach before assigning the renderer/export/review milestone.
Keep all existing asset bytes fixed. Head stays rigid; torso remains arm-free;
arms remain separate. Recover knee-based bending and phase relationships from
canonical motion, avoiding whole-leg shifts that detach hips. Straight thigh
and shin centerlines, local knee bending, attached rigid shoes, eight phases
at 180ms, fixed stand/sit endpoints. No game integration or new art generation.
Validate actual rendered continuity, rigid head, asset hashes, pose controls
and native timing; inspect contact frames before presenting an animation.

Implementation assigned to Terra: separate v7 renderer/build/validation and
green-restored-walk.html review. Use actual canonical-master pose output after
lineage verification (M4 fit JSON is an earlier reference, not automatically
the recovered gait). Calibrate once to frozen artwork proportions. Runtime
segmentation is rig binding only, with continuous thigh/shin texture coordinates
and rigid shoe regions; reject visible seams/repeated details. Preserve v6
stand/sit frames exactly. Parent reviews contact sheet before final comparison.

Parent rejected Terra's first v7 contact sheet: overlapping shin/shoe crops
duplicated shoes, disconnected sleeves omitted hands, and uniform segment
scaling changed trouser widths. Terra stopped. Sol surface_pipeline now owns
v7 renderer/export/validation for substantive binding correction; no other
worker may edit those files. Canonical module confirmed (cdee5985 prefix),
approved manifest c9ccf24d. Parent will inspect corrected contact proof before
assigning review packaging. Draft failure is not a delivered improvement.

V7 proof completed. Sol corrected binding with disjoint source bands, fixed
trouser width, localized knee seams, rigid shoes and connected sleeves/hands.
Removed duplicated arm body bob. Parent inspected final contact sheet and
renderer; independently ran validate-green-v7-motion.mjs: PASS, eight frames,
nine asset pins, exact opaque head pixels, same-transform torso checks,
connected alpha components through leg and arm joints, unchanged static poses.
All frozen asset-directory hashes equal this turn's starting snapshot. Parent
also measured actual strong-alpha soles: planted pixels at286 vs target287;
maximum lifted-foot raster offset1.375px. No visible duplicated shoe remnants.

Terra packaged green-restored-walk.html (321675 bytes), with exclusive ownership
of review builder/validator while Sol finished core validation. Parent found
pause/scrub clock jumps in first UI and returned correction; separate native
clocks now preserve rendered frames. Parent reran validate-v7-inline-review.mjs:
PASS and inspected final walk screenshot. UI pins final manifest
5babda5e3064dc711701934235b8b4213598acb31cd705678d1e5619c851bae3.

Next: owner judges same-art motion. This is a south-facing in-place proof;
canonical depth motion remains subtle in front projection. No game integration,
traveling walk, roster expansion or appearance approval is claimed. Current
stand/sit switch directly between byte-identical v6 endpoints. Local checkpoint
only; no commit/push. User may request GitHub backup.

## Owner correction: sleeves, shoulder attachment, leg spacing
Owner reports sleeves too large, weak shoulder-to-torso connection, hands moving
independently of sleeves, and legs too far apart. Sol owns new v8 rig/build/core
validation preserving v7 for comparison. Narrow sleeves and leg lanes; derive
hand position from transformed cuff anchor so both move together. Calibrate
shoulder overlap to torso. Fixed head/torso artwork and gait cadence retained.
Standing should receive the same proportional fixes (supersedes byte-identical
v6 standing constraint); sitting still switches instantly. Source asset files
remain untouched. Parent reviews contact proof and actual diff before packaging.

V8 correction completed: Sol calibrated source shoulder/cuff anchors, narrowed
sleeves (cross-axis scale0.29), derived hands from transformed cuffs and narrowed
hip lanes40->30px. Standing uses corrected proportions; sitting is unchanged.
Parent inspected contact/render code and independently passed core validation:
32 recomputed transform endpoints,16 arm component connections, minimum334px
shoulder/torso alpha overlap, preserved head/torso and9 asset hash pins.
Terra packaged correctedv8 vs previousv7 at matching eight180ms phases. Parent
requested true1..8 scrub, unique root and accurate provenance; fixes completed.
Parent independently passed UI validation and inspected screenshot. Final core
manifest0f1e463c546ba454250fd24fecf29d0e8d63fbff7f44269ab26ffa73dd97921b;
review green-arm-leg-fit.html regenerated against it. No game integration or
push. Await owner visual review of these specific fit corrections.

## Directional checks and hand layering
Owner says v8 looks better and shoulders look great; preserve shoulder fit.
Move hands in front of torso while sleeves remain behind (walk and stand).
Sol owns bounded draw-order correction plus raster occlusion verification.
Owner requests testing harder east/west/north walking. Terra inventories actual
source views and available view-specific layered assets read-only before parent
selects implementation; never mirror a front view to fake a side/back character.
Next milestone must show actual E/W/N motion evidence, with any artwork gaps
identified honestly. Preserve prior outputs and unrelated work; no game push.

Hands-front completed by Sol; prior shoulder geometry preserved. Manifest
36c22f3b951e1eccb5b8cecdafb05f5ecd37130e2204e0faefea4edefd5754c7.
Directional inventory confirms no clean E/W/N layered torso assets; retained
donor kits belong to other identities. Parent authorizes source-referenced
ImageGen preparation of missing hidden torso/limb surfaces to enable requested
directional testing (supersedes no-new-art constraint for these new views only).
Original source sheet and all South assets remain immutable; original E/W/N
heads retained rigid. Do not use rejected UV primitive fitting or mirrored front.

First generated directional atlas rejected: top row still contained sleeves.
Targeted edit removed arm lobes; corrected atlas exec-1e74c3b6-4728-4769-aa40-
2e7418884cd7.png (generated_images/current-thread) uses magenta import matte.
Sol owns directional/ tools and directional-v1 artifacts, source-referenced
prepared torso/limbs plus original exact E/W/N heads. Gate: static assemblies
and contact frames before review UI; fixed perview calibration, eight180ms
canonical phases, perview near/far layering, no other-direction seated work.
Parent independently reran hands-front v8 core validator PASS and inspected
contact; Terra refreshed South comparison with final36c22f3b manifest pin.

Directional visual iterations: parent rejected floating profile necks and
pointed knee corners. Next attempted head cutoff/rounded limb clipping also
rejected because it removed chin pixels and narrowed pants. Terra diagnosed
precise source head keep regions read-only; Sol restored complete source faces
and retained clothing-free neck boundary. Parent accepted updated static source
comparison. Sol replaced narrow clipping with shared knee cross-section UV
strips; parent inspected east03/north03 checkpoint: full trouser widths and
faces restored, no diamond holes. Full contact/validation and three-view review
packaging now finishing. New body art remains a source-referenced prototype,
not owner appearance-approved; South shoulder fit unchanged.

Directional check milestone complete. Sol finalized 24E/W/N frames,8 perview,
180ms each, static endpoints, original source heads, and prepared torso/limbs.
Final manifestd9f7631fb340139ba3c7dc64a9709f801a8bf207a6710a51acd5bf2ba0d1d9f8.
Parent inspected final static/contact and independently ran
directional/validate-directional-v1.mjs: PASS (24 deterministic frames,
12818 original headRGB pixels,101944 rendered headpixels,96 leg joint and48
arm connections,24 floor checks, zero retained preparationRGB changes).
Original full source sheet SHA remainsfa38e9e4…fd63.

Terra packaged green-directional-walk.html (273196 bytes), allthree views
simultaneously; parent reviewed code, requested decode-before-ready and single
RAF-loop corrections, inspected screenshot and independently ran inline
validator: PASS playback/pause/scrub/resume/stand/320&736px. South
green-arm-leg-fit.html refreshed at hands-front36c22f3b manifest. Both previews
must be shown to owner. Newly prepared directional bodies remain visual-review
prototypes; no game integration, roster rollout, seatedEWN, commit or push.
Next action: owner judges E/W/N gait and appearance at this checkpoint.

## Owner correction: neck attachment and profile arm orientation
Owner reports floating heads and backwards downstage arms; thumbs must point
forward in East/West. Sol owns bounded directional core correction. Preserve
complete original faces and South approved shoulder fit. Inspect whole sleeve,
elbow and hand donor orientation together; correct near arm chain, not only
thumb. Require visible neck/collar attachment and explicit forward thumb
landmarks with rendered closeups; prior connected-component tests were
insufficient for owner-visible attachment. Parent reviews before UI refresh.

Correction complete. Terra independently confirmed reversed near donor mapping;
Sol preserved canonical near sides but swapped matched sleeve/hand source pairs:
East near uses left donor, West near uses right donor. Far chain reflected only
in limb-local coordinates to keep both thumbs forward. Head registration lowered
rigidly3px with exact original neck-skin bridge; no face/head sourceRGB changes.
Parent inspected all8 E/W closeups and native static comparison: full faces,
attached neck/collar transition and forward thumbs. Discarded flared old-collar
bridge before final. Parent independently passed core validator:24frames,
36 thumb direction checks,48 actual neck overlap checks, exact sourcehead/neck
pixels and previous gait/continuity/floor invariants.
Final manifest8473daade9fa7d32dc5356b05177957b87f6c9f3439b6d337cb4d3bf8ea9ec71.
Terra refreshed green-directional-walk.html(270740bytes), parent independently
passed browser validator and inspected refreshed screenshot. South shoulder fit
and runtime untouched. Local review checkpoint, no push; owner visual review next.

## Owner correction: skull cutout and shoulder sockets
Owner reports triangular missing region at skull base in E/W and wrong arm
attachment in profile/back. Sol owns source-mask/shoulder-anchor correction;
Terra independently audits exact source landmarks read-only. Preserve forward
thumb direction, gait/timing and South approved fit. Require full original skull
contour and actual sleeve shoulder-cap registration to torso socket, not merely
some alpha overlap. Parent reviews clean and anchor-overlay closeups before UI.

Completed skull/socket correction. Terra pinpointed E/W omitted nape polygons
and actual sleeve-cap centroids; Sol restored153 sourcehead pixels and bound
measured cap/cuff endpoints to perview torso sockets. Parent rejected first
socket y positions as too low; corrected to E134/W131/N128 with existing x and
cuff targets retained. Parent inspected clean and overlay stand/01/03/05/07
closeups: skull notch filled, upper shoulder contours connected, thumbs intact.
Parent independently passed core validator:24frames,108 affine anchor checks,
minimum110px local socket overlap,36 thumb checks, exact sourcehead/neck RGB.
Final manifest1eebdaf957a5d2765b6c2c7877c1b590e708ac0d34c994e0b9d269ad34320f56.
Terra refreshed green-directional-walk.html(277200bytes); parent independently
passed browser validator and inspected refreshed screenshot. South and runtime
untouched. Local checkpoint only; owner review next, no commit/push.

## Inline runtime error
Owner reports undefined.complete in green-directional-walk.html. Terra owns
bounded review-builder/validator fix and regenerated HTML. Investigate frame
index becoming invalid through RAF timestamp/input assumptions; reproduce
reported failure shape under host-like callback conditions. Preserve core art,
manifest, cadence and successful pause/scrub behavior. Parent reviews fix and
independently runs regression/browser checks before delivering updated preview.

Completed: Terra hardened frame indices, sampled performance.now() internally,
and gated controls until image decode completes. Parent reviewed the changed
runtime and independently passed validate-inline-review.mjs: delayed loading,
malformed RAF timestamps, playback, exact pause, scrub/resume, static stand,
and 736px/320px layouts. The specific host trigger is not proven; the invalid
frame path is guarded. Core manifest remains 1eebdaf957a5d2765b6c2c7877c1b590e708ac0d34c994e0b9d269ad34320f56.

## Approved walk and remaining action review
Owner likes the current directional walk; requests less backward arm swing in
E/W. Then review south-only star jump, seated endpoints in S/E/W/N, and south-only
clipboard. Standing-to-seated may snap. Preserve original character appearance,
approved shoulder sockets, head integrity, forward thumbs, and gait. Roster
fitting follows owner approval of these actions, not before.

Milestone 1: Terra profile_swing_refinement owns bounded E/W backward excursion
reduction and refreshed review with core/browser validation. Parent reviews
actual code and before/after renders.
Milestone 2: inventory existing action assets and delegate action-pose assembly
and review separately; keep walk unchanged after milestone 1. Require visually
coherent joints and original face, complete all four seated views, and functional
review controls. Parent owns acceptance and plan updates; no game integration,
commit, push or roster rollout in this task.

Action design investigation: Sol action_pose_design read-only while Terra owns
the swing implementation. Existing v8 sit is copied from v6 with broad seated
sleeves; it needs appearance review against newly approved shoulder fit. Original
sheet contains south/east seated references but no north seat. Prefer explicit
pose joints and layer order, and action-specific art only if existing parts
cannot produce convincing bent limbs. Acceptance: original faces rigid, no gaps
at shoulder/elbow/hip/knee, connected wrist/hand, natural planted seated feet,
star-jump crouch/takeoff/spread/landing without clipping, and clearly held prop.

Milestone 1 complete: Terra reduced E/W rearward cuff displacement 24.78px to
17.346px (0.70 scale); forward remains 24.78px. Parent reviewed armTargets
change and contact sheet, independently passed directional core validator and
inline browser validator including malformed timestamp regression. New manifest
7c8ebc5615ad3bd425957376acc1fc99a523e9a024bc1fb6e6bdcf835ee45932.

Sol found canonical-actions/action-geometry.mjs already defines the requested
jump, four seated endpoints and clipboard. Sol owns first new action milestone:
south jump rig/build/validation in layered-pilot/actions and actions-v1 outputs.
Parent prepares source-referenced seated replacement atlas with built-in
imagegen in parallel (separate assets ownership). Use exact original heads and
approved torso parts; replacements limited to seated lowerbody/bent arms and
clipboard bent arms, because mapping standing hands onto bent poses distorts
their anatomy. No existing walk assets are replaced.

Jump review gate passed: parent rejected two-piece and curved-strip sleeves for
visible wedges/repeated outline fans. Sol changed to intact original sleeve
affines for shallow jump bends. Parent reviewed 8-frame contact and code, then
independently passed validator: 8 distinct deterministic frames, 36584 exact
opaque head pixels, 14 sleeve/hand connectivity and shoulder overlaps, 28 exact
cap/cuff transforms, 4 grounded + 4 airborne phases, exact v8 standing endpoint.
Sol now owns sequential seated/clipboard assembly and alpha import milestone.
Parent supplied seated and clipboard magenta atlases via built-in imagegen,
with source prompts in actions/assets; initial transparent requests returned
opaque checkerboards so background-only edits supplied keyable matte instead.

Review packaging contract after core acceptance: separate green-actions-review
with action selector (Star jump, Sitting, Clipboard). South-only jump/clipboard;
all four seated directions visible together (responsive 2x2/stack). Jump starts
paused, runs once to ready, supports pause/exact frame scrub/replay and half
speed. Sitting and clipboard are static endpoints; optional standing comparison
is a snap only. Reuse internally sampled performance clock, finite index clamps,
decode-before-controls and visible failure handling from fixed walk preview.
Pin embedded frames to manifest hashes and keep under 1MB. Validate primary
interactions, malformed RAF input, no JS errors, and 320/736px layouts.

Static visual gate passed after parent corrections: lower seated hands to lap,
keep actual floor287, distinguish waistY205 from chair support seatY236; preserve
rigid heads/torso. Clipboard initially had oversized overlapping hands and a
lowered left shoulder; parent rejected both. Final smaller arms use original
shoulder sockets, with support palm under smaller board and edge hand above.
Parent inspected final sitting4view and clipboard4x. Sol finishing import/fringe
and static invariants; use visible-alpha saturated-matte check to distinguish
real fringe from 1/255-alpha interpolation and legitimate dark source colors.

Core action milestone complete: Sol handed back manifest
40ec1233e16bc52650817646b564da7fed669ac1a99f2cd738e8aa79e7b3dc59.
Parent independently passed final action validator: jump invariants above plus
4 deterministic seated endpoints, 17469 rigid headpixels, 4 floor registrations,
8 arm anchors; clipboard deterministic endpoint, 4573 rigid headpixels and
support/edge placement. Zero visible saturated matte pixels. Parent reviewed
actual preparation, rig mapping and validator code plus final static images.
Terra profile_swing_refinement now owns separate actions inline builder and
browser validator only, with chair context separate from character sprites.

Packaging complete: Terra built green-actions-review.html and browser validator.
Parent reviewed runtime and chair screenshots, independently passed browser
checks. Tiny parent integration corrections: removed premature 'approved' title,
used checkbox utility classes, theme-aware chair fallbacks, and added chair legs
to floor. Rebuilt/rechecked browser validator PASS: delayed decode, malformedRAF,
once-through jump, pause/scrub/replay/half-speed/ready, all statics/chair toggle,
320/736px. Final HTML201569bytes; core manifest remains40ec1233…e7b3dc59,
walk remains7c8ebc56…e45932. Both previews delivered; owner action approval is
next. No character roster fitting, game integration, commit or push performed.
