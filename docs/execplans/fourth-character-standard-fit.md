# Fourth character: atlas-first reproducible fitting

## Goal and owner authorization
2026-09-15: owner accepted Gray Overshirt's final fitting and authorized a fourth
character. Apply lessons from Green, Gray Braid and Gray Overshirt; inspect and
correct problems independently before presenting a review.

## Scope and constraints
Stand and eight-frame walk in South/East/West/North; static sitting in all four
directions; South-only straight-arm star jump and clipboard. Start from fixed
character-atlas/v1 pages, anatomical side/direction conventions and measured
anchors. Preserve source identity and proportions with separate arm-free torso,
clean sleeve caps, forearms/hands and lower parts. Original heads stay rigid.
No stretch-fill, character-specific anatomy branches, or unreviewed donor reuse.
Local preview only: no game integration, roster rollout, commit, push or deploy.
Dirty repository contains extensive unrelated game/clinical work; preserve it.

## Frozen approved baselines
- Gray Overshirt render: 2237b42a100316adcba0624290663e4b03d490d23806cce333d986f2d2d8b09c
- Gray Overshirt atlas: ed5d4da9fe27b849301c837571b005f08258bec548262c1fb0604a0552286e3b
- Gray Braid: e954be5d89fedea444381c51ec7c5441ffa55e336452223b81e3a079a24989a2
- Green South: 36c22f3b951e1eccb5b8cecdafb05f5ecd37130e2204e0faefea4edefd5754c7
- Green directional: 7c8ebc5615ad3bd425957376acc1fc99a523e9a024bc1fb6e6bdcf835ee45932
- Green actions: 40ec1233e16bc52650817646b564da7fed669ac1a99f2cd738e8aa79e7b3dc59

## Milestones and ownership
1. Terra fourth_character_inventory: bounded read-only source/candidate inventory.
2. Parent: choose source, inspect original, prepare any required imagegen artwork
   against the standard atlas; persist exact prompts and provenance.
3. One implementation worker: new character importer/profile/atlas, reuse shared
   rendering, complete poses and meaningful validation. No writes to approved
   character assets. Parent reviews source/parts before assembled fit acceptance.
4. Parent and worker iterate privately from source-vs-fit and three-baseline
   comparisons: every direction/frame, full jump, seats and clipboard. Correct
   defects before owner review; record discoveries in reusable protocol.
5. Worker builds compact inline review after visual gate; parent independently
   verifies core tests, frozen baselines and browser behavior, records handoff.

## Acceptance and validation
Source head/crown/chin/neck preserved; garment torso width/axis faithful; clean
parts with no collar on arms or duplicated limbs. Anatomical sides, thumb/elbow
and shoe orientation correct. Shoulders connect, hands remain appropriately
spaced, upper sleeves visible to cuffs; depth occludes far limbs. Visible gait
in S/N, restrained profile swing, heels under ankles across E/W cycle. Straight
jump with fixed bones and exact stand endpoint. Four natural seats with chair
context; compact clipboard arms on torso sockets and board contacts. Compare
native and enlarged renders against original and approved three, not just joint
coordinates. Validate atlas source/alpha/provenance and rendered pixels. Browser
decode/failure gate, all controls/actions, light/dark and320/736 widths; <1MB.

## Progress and next action
Terra inventory complete; selected patient.adult.043 Brown Beanie, original
Photos for Codex 2/Patients or Staff or Other Characters/exec-092d31ac-7592-4634-8883-167ddac564df.png,
SHA1ded19438dc0df3f0fa7f4cdadddddbfa3750632d47a27c7c721c8e9cdacb636.
Parent inspected original1536x1024. Sol fourth_character_fit owns new
brown-beanie-v1 importer/profile/build/tests/proofs; source measurement and
identity/torso/upper import in progress. Parent generated upper, seated lower,
clipboard and lower parts with built-in image_gen; prompts saved beside assets.
Upper generated torso incorrectly retains sleeves: exclude it, use original
arm-free torso masks. S/N forearm source rows swapped despite prompt: actual
thumb anatomy determines import into canonical slots; upper rows are correct.
Clipboard source pair also reversed, mapped by actual shoulder/hand direction.
Lower v2 removes false knee cuff bands; v4 corrects too-light trouser color.
Apparent background glow in image viewer is not actual matte at sampled pixels:
RGBA checks confirmed alpha0; v3 alpha edit unnecessary and unused. Prefer exact
original S/N lower pixels; E/W requires generated isolated parts because original
standing legs overlap. Inspect original profile torso mask width before accept.
First assembled draft self-review found E/W lower transform/size failures, hem
gaps and artificial elbow/knee source borders. Second draft fixes hem gaps and
boot scale, but separate trouser segments retain visible borders. Parent supplied
profile-continuous-legs-v1.png for importer to split into fixed slots with cloth
overlap. Actual generated order E/W/E/W is recorded; never assume prompt order.
New normalization-aware lower loader is required because original-sized parts
are packed at2x, unlike previous translation-only parts. Approved loader unchanged.
Full actions built; parent reviewed straight jump, compact clipboard, four seats.
Parent caught and worker corrected S/N seated waist landmarks off-center before
assembly. Upper source border crops reduce artificial elbow rings. Persistent
E/W lower wedges escalated to read-only Sol fourth_lower_seam_diagnosis while
primary worker prepared comparison/validation. Parent suspected old quad() maps
only corners0/1/3; diagnostic Sol confirmed missing corner2 residual12.8–13.4px
on shins01/05 and17.8–18.9px on thighs03/07, matching actual holes. Root cause is
geometry, not source art. Primary worker now implementing generic two-triangle
quad mapping and alpha coverage tests in new normalized lower path, keeping
approved legacy renderer unchanged. New helper belongs standard-atlas for reuse.
Core complete and parent visually accepted for owner presentation. Two-triangle
mapping initially introduced shared-edge antialias cracks; one-pixel internal
overlap and straight-quad fallback removed them. Parent inspected all five final
comparison sheets (all eight phases in each direction, stands and actions) against
Green, Gray Braid and Gray Overshirt, plus earlier source and full-action proofs.
Independent Brown validator PASS: 49 fresh renders, 54 atlas records, 20,142 exact
original opaque head pixels, profile shin alpha minimum252, six frozen manifests.
Independent combined standard/lower tests PASS19, including approved lower36
comparisons. All49 freshly rendered approved Overshirt PNG hashes also remained
byte-identical to the frozen version. Core atlas SHA
f7d2cad5c6502e6870a91c0b4b2eb0378f6014f084edf41498397f8344ac47e0;
artifact manifest93abda3d401c224b72e33318f6fd6007aaca731c269028c683bfb3c7695e0588.
Sol fourth_character_fit complete; Sol fourth_lower_seam_diagnosis read-only
investigation complete. Terra fourth_character_inventory now owns final new
inline review packaging/browser validation, with core frozen. Parent retains
final screenshot review and handoff. No owner approval of fourth fitting yet.

## Completion checkpoint
Owner correction request reopens this checkpoint: prefer Approved Green as review
reference; Brown trunk/legs misalign, chin clips, arms too small, and profile torso
retains sleeve pixels. Prior parent visual acceptance was insufficient. Sol
fourth_character_fit owns core correction and meaningful source-coverage/seam
checks; parent reviews source/proofs, then delegates Green preview adaptation.
Preserve all approved baselines. Do not label the previous fitting owner approved.
Parent supplied source-referenced `profile-arm-free-torso-v2.png` with exact
built-in imagegen prompt adjacent; full side cloth replaces the sleeve-contaminated
front strip. Core diagnosis located profile pelvic center errors: masked-strip
axis was about9px away from actual original trouser center. Terra has disjoint
ownership of only two inline build/validation scripts to prepare Approved Green
adaptation while Sol edits core; final packaging waits on parent core freeze.
Parent additionally supplied `upper-broader-v2.png` and exact adjacent prompt.
Original warm hand pixels end at local y235 in all views, only11px below hem224;
parent independent pixel scan prevented an incorrect proposed25px arm extension.
Main arm defect is width, corrected in source art while retaining joint lengths.
Expanded E/W beard masks address demonstrated missing original pixels (old exact
RGB checks tested only surviving pixels). First corrected assembly inspected by
parent: full side torso, broader arms and intact chin materially improved; final
profile shoulder/rest and all-action review remain before preview regeneration.

Terra preview packaging complete. Parent caught nonuniform source-reference
scaling during code review; Terra corrected to exact 1x original pixels with
body-axis registration and source sole row307 aligned to floor287. New inline
`brown-beanie-standard-fit.html` is881946bytes; provenance in
`artifacts/character-movement/brown-beanie-v1/review/ui-provenance.json` pins the
Brown atlas/render and approved Overshirt reference hashes. Parent independently
ran `validate-inline-review.mjs`: PASS decode/failure gate, malformed RAF,
play/pause/scrub/half-speed, all actions and chair, jump stops08, atlas directions,
light/dark and736/320 layouts. Parent inspected desktop/mobile and all four
chair-context seats plus jump04 in the browser; core appearance gate retained.
Parent also SHA-verified all49 saved frame files and156 comparison inputs.
Ready for owner review; fitting task complete, appearance approval pending.
Next: respond to owner feedback, or select another character only when asked.
Local-only checkpoint; no integration, commit, push or deployment. Remind owner
to say "push to GitHub" for backup. Qualifying implementation was delegated;
parent retained source preparation, integration review and acceptance as planned.

## Owner correction pass, 2026-09-15
Reopened by further owner feedback: E/W seated torso/waist misalignment;
undersized arms including clipboard; E/W arm swing rear-biased and legs wiggly;
South toes too inward. Sol owns core/atlas/geometry correction, parent source
preparation and independent review, Terra final UI rebuild after visual freeze.
New durable scope: only founders require clipboard and star jump going forward.
Brown retains both as this practice fitting, and its clipboard arms must be fixed.
Parent supplied upper-broader-v3 and clipboard-broader-v2 source art/prompts.
Seated alignment diagnosis: full-bbox centering ignored waistband location;
changing waist annotation exposed missing inverse packing rotation. Parent found
the scale-only placement bug, Sol corrected full inverse transform; parent
accepted the revised four-seat geometry. Parent also identified actual South
side mismatch: legacy geometry left hip x65 but anatomical atlas left donor is
source x123 (screen right). Fix anatomical boundary rather than spacing the
swapped boots; add side/phase regression. Do not relabel atlas slots to legacy.

Sol corrected E/W chin masks using original beard pixels, replaced the retained
profile sleeve/front-strip torso with complete arm-free cloth, registered hips,
and imported broader source sleeves/hands without excessive arm length changes.
Profile shoulder/rest placement also refined. Parent inspected revised four
stands, all32 walk frames, all8 jump frames, four seats and clipboard; accepted
for owner review, not owner-approved. All three approved character comparisons
rebuilt; Green is now the review's synchronized reference as requested.
Parent independently ran Brown49-frame validator and18 standard/lower tests,
then Chrome review validator: all PASS. Chin validation includes16 original
points and187 pose checks; prior six approved manifests remain frozen.
Atlas c6fa5408deb8f3ae214e5c1dd2e475e9205020182d17151de5ce514d481bb624;
render954bcd68d2207868a79a9db184854cd0c05b3d807d238c2b2dba5d73202c6684.
Terra rebuilt same inline path at870749bytes with all three Green manifests
pinned. Parent inspected new E/W walking and East chair screenshots with Green.
Source art from built-in imagegen and exact prompts saved in Brown assets folder.
No game integration/commit/push/deploy. Owner feedback is next.
Final targeted validator samples isolated lower art (excluding moving hands),
giving profile sweater/trouser center error at most2px across stand/walk. Parent
reran final validator PASS. Source/before/after South outer sleeve strips measure
21/23px,14/14px,17/17px respectively: improved, still slimmer than original.
Source/before/after four-view proof saved in correction-review; no claim of exact
source arm silhouette or owner acceptance. All implementation delegated to Sol
and Terra; parent handled source preparation and independent review as planned.

### Current pass status (supersedes prior ready checkpoint)
Latest owner pass remains active. Parent visually accepted corrected four-seat
waist registration/full inverse normalization, broader v3 long sleeves with
plain elbow overlaps, broader v2 clipboard arms, anatomical South boot mapping,
and E/W forward/backward arm factors 1.45/.42. Side leg texture wiggle remains
under investigation by Sol. Rejected rigid/width experiments are not accepted
outputs. Parent requested numerical scale diagnosis before any further source
regeneration. Final manifests, preview and validation must be rebuilt afterward.

### Owner pass 2 complete for review, 2026-09-15
Sol implemented the final correction; Terra rebuilt and browser-checked the
Green-synchronized preview. Parent reviewed actual renderer/importer/validator
changes and all direction/action contact sheets plus fresh E/W chair/browser
proofs. Rigid leg diagnosis found shortened visual ankle was shrinking the shin;
full canonical ankle tucked behind the boot plus fixed1.35 transverse calibration,
155-row source knee overlap and individual20px rounded clips resolved the rejected
thin-leg/cut-corner trials. Parent accepted appearance for owner review only.
Seated waist inverse includes rotation; South anatomical side conversion applies
to arms/lower and practice jump. E/W arm factors1.45 forward/.42 backward.
Larger source sleeves now19/20px vs original21/23; clipboard source also broader.
No claim of exact original silhouette. Mild cloth folds remain at bent knees.

Independent parent PASS: Brown49 fresh renders, atlas54, six frozen manifests,
187 original chin pose checks, isolated knee alpha255/shin252, fixed transverse
ratio and effectively zero shear, seated inverse/waist/sole checks; standard/lower
18 tests and approved Overshirt49+36 lower regression. Saved49 PNG hashes and156
comparison input hashes verified. Chrome validator PASS for decode/error gate,
malformed RAF, play/pause/scrub/half-speed, actions/chairs, jump08, all atlas views,
themes and320/736 layouts. Final metadata correction15→155 changes only manifest
hashes; parent reran Brown validator and Terra synchronized package afterward.
Final atlas c700fbcbe12afb927599162600c063517337bfc98b364bb1581519ba133f6a4c;
render18c9faa19b5970c8919f3180f709438c73eee6dc5d768012bbfc8d559ebc0ea7.
Same preview brown-beanie-standard-fit.html878657bytes, pins final Brown +3Green.
Protocol and exact source prompt records updated. Only founders require clipboard
and star jump for future fits; Brown keeps both practice actions. Local-only,
no integration/commit/push/deploy. Next: owner appearance review, no roster rollout.
All qualifying implementation delegated; parent handled source art, diagnosis,
acceptance and planning/handoff. Invite owner to say "push to GitHub" for backup.

## Owner walk-only correction, 2026-09-17 (active)
Owner prefers cohesive whole-body static stands/seats and founder clipboard,
with fitting concentrated on S/E/W/N walks. Adopt hybrid as future protocol;
this pass addresses explicit Brown walking defects, without generating new
static art. Correct anatomical-left thumb S/N, widen E/W trousers to source
proportions, and place far/upstage hand behind legs as well as torso. Sol owns
bounded core implementation/tests/protocol, parent visual/source review and
planning, preview packaging follows core freeze. Preserve approved three and
unrelated repo work. Require signed inward thumb checks, real overlapping pixel
occlusion checks, measured garment width and stable knee/ankle connections.
Current prior fitting is not owner approved. No integration/push/deployment.

### September 17 core and review completion
Sol completed core corrections and protocol; Terra rebuilt the Green preview.
Parent inspected original art, all 32 walk poses, renderer/importer/validator
changes, seated/jump regressions and browser proofs. Source hands had duplicate
thumb directions. The importer reflects only anatomical-left S/N cells and their
corrected pixel landmarks. Parent caught stale intended-side thumb markers in
the first validator and required correction; final metadata did not alter art.

Fixed transverse scale 1.70 and 26px clipping give profile cloth widths of
19–24.5px versus sampled original walking widths of 22/27px. Brown's profile
order farArm → lower → torso → nearArm now executes as actual layers. Approved
renderer defaults remain unchanged.

Independent parent validation passed: Brown 49 frames, 36 inward-thumb checks,
595/923 far-arm/leg overlap pixels and 354/551 fully occluded pixels with zero
unexpected far-arm contribution; 19 standard/lower tests including 36 approved
lower frames; full approved Overshirt 49-frame validation. Six approved manifests
remain frozen. Verified 49 saved PNGs and 156 comparison inputs. Final Chrome
validator passed decode/error gates, controls, directions/actions, atlas views,
themes and desktop/mobile layouts. Parent inspected the fresh comparison proofs.

Final atlas: 611b9039143ca5a86222f4dd6ea384408f275818d4a42b4f5f87a6d7719a4894.
Render: 2f349824947cd327ce78f60b2ac547f2dcd90f2c9077dfd18896e769a74de3ac.
The 874272-byte preview pins final Brown and all three Green manifests. Owner
appearance review remains pending.

The future hybrid protocol uses whole-body stands/seats/founder clipboard and
fitted walking with consistent foot/seat/head/color registration. This pass did
not generate static poses. Corrected shared hands propagate to existing stand,
sit and jump poses; wider profile legs also affect standing. Clipboard is unchanged.
All qualifying implementation was delegated; parent retained diagnosis, source
and visual review, independent validation and planning. Local only, no integration
or push. Next action is owner review; invite “push to GitHub” for backup.
