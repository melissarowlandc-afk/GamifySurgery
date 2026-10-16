# Character movement review

Updated: 2026-09-11. Owning task: **GS-012 — Character movement**.

Current approval status: the owner provided Cortan approval on 2026-09-11 in
both tasks. GS-010 resumed the approved four-character/142-pose resident private
workflow with its Sol worker. Historical pending-approval notes are superseded;
actual artwork/process acceptance remains separate. GitHub backup is not needed
to continue and no push has been requested.
Stable movement references use `MOV-NNN`; GS-011 can link directly to each
heading without moving or renumbering the original observation.

## MOV-000 — Scope and map directions

**Owner definitions (2026-09-10):** Character means founders, patients,
employees, and passersby on the sidewalk. Movement should look the same across
all four groups. Up on the map is north; right is east, down is south, and left
is west. This establishes a shared visual movement standard; no change to
travel speed, routes, or saved-game state has been requested.

<a id="mov-001"></a>

## MOV-001 — East/west walking cycle

**Status:** Owner agreed to the clarified shared-template direction on
2026-09-10. The isolated base-walk preview is technically validated. The owner
said "That looks great" and raised the proportion-fitting question in MOV-002.
The gait is accepted as a motion reference; character fitting and the game fix
are not yet implemented or accepted.

**Owner report (2026-09-10):** Arms and legs do not move correctly while
characters walk east or west. No particular identity or recorded scene has
been identified yet.

**Owner's desired cycle:**

1. Right leg and left arm far forward.
2. Passing/neutral: arms down at the sides, right foot planted with the
   supporting leg straight, left leg swinging through with its knee slightly bent.
3. Left leg and right arm far forward.
4. Passing/neutral: arms down at the sides, left foot planted with the
   supporting leg straight, right leg swinging through with its knee slightly bent.

There must be at least one intermediate position between each main position.
The walk need not be highly detailed, but needs more detail than the current
animation. All four character groups are in scope.

**Owner clarification (2026-09-10):** At neutral, arms hang down at each side.
The leg that was in front is on the ground and straight; the leg that was
behind swings through neutral with its knee slightly bent. This defines a
passing pose with one supporting leg and one moving leg. The two passing
moments swap the legs' roles; they require corresponding distinct limb poses.

**Working interpretation:** At least eight successive pose positions per full
cycle, including an intermediate between the final passing pose and the first
stride. Passing is part of continuous walking. Merely holding existing poses
for more frames would not add the requested limb detail.

**Owner's architecture question:** Should every character have separate pose
sprites, or should appearance act as a costume on a base body with shared poses?

**Agreed direction (owner: "Okay sounds good", 2026-09-10):** Use a
shared gait/pose definition, fit character-specific appearance to it, and
export finished sprite frames for the game. This combines common motion with
pixel-art control. Existing complete-character images need deliberate asset
preparation; they are not already interchangeable limb/clothing layers.
Preserve character identity and body proportions. Prove the base gait before
expanding across the roster. Runtime skeletal animation is an alternative,
not an approved migration.

**Related history:** The earlier
[horizontal gait plan](../execplans/correct-horizontal-character-gaits.md)
describes a four-position A/neutral/B/neutral cycle and prior direction fixes.
Its historical completion does not reproduce or resolve this new observation.

**Current source evidence (Terra investigation, reviewed by Astra):**

- `apps/player/src/art/lateralGaitCycle.ts:8` selects exactly
  `walk-a -> walk-neutral -> walk-b -> walk-neutral` for side travel. Its
  existing test asserts that four-beat sequence. No intermediate limb poses
  are selected between those beats.
- `apps/player/src/art/characterBitmapArt.ts:102` maps generic v3 actors to
  full-body frames and side idle for neutral; the founder resolver at line 118
  likewise falls back to idle. The patient resolver at line 133 has dedicated
  A/neutral/B frames. Appearance selects the family, so a passer using an
  authored patient appearance follows that patient's resolver. Timing alone
  does not establish equal visible motion across those families.
- `apps/player/src/facility/FacilityScene.ts:4334` calls the shared gait
  selector; `drawPixelPerson` at line 4859 displays a complete actor frame.
  `tools/build-clean-character-actors.mjs:1` documents why the legacy builder
  uses complete frames instead of separately cropped head/body planes.
- These findings explain the current pose limit and differing neutral art.
  They do not prove the exact on-screen defect, opposite-arm correctness, or
  any resolution of the owner's report. Existing tests were read, not run.

**Discussion status:** The neutral-pose clarification is resolved. The side-view
gait now has a defined limb sequence for a future base-walk visual review.
The owner agreed to the shared-template direction. The first scoped work is
an isolated motion preview under [the execution plan](../execplans/character-movement.md).
That reference milestone changed no game renderer or roster. Subsequent owner
feedback accepts the motion study; body proportions are scoped below, and
MOV-004 separately authorizes the later pause/arrival source change.

**Preview result (2026-09-10):** The
[base-walk preview source](character-movement/side-walk-preview.html) now shows
all eight poses in both directions, with play/pause and exact pose stepping.
Terra made the first draft; Sol corrected rendering/geometry and playback
issues. Astra reviewed actual source, isolated checks and rendered evidence.
The final source and display copy are identical at SHA-256
`4cf509ce2a0d579aad1eff38d04cf2ebb8489a2a02a9496cac9680dd7e933e75`.
Parent's 585 focused assertions passed, with responsive light/dark visual QA,
no runtime errors/network requests, and nine protected runtime/launcher paths
unchanged. This is an in-place motion study, not character art, world-space
foot-lock validation, or a game fix. The owner's subsequent positive motion
feedback does not establish that the preview matches any character's anatomy.

<a id="mov-002"></a>

## MOV-002 — Fit the gait to character proportions

**Owner feedback (2026-09-10):** The eight-pose walk looks great, but the owner
asks whether its body proportions match the actual characters so their
appearance can be mapped onto the motion.

**Confirmed preview limitation:** The motion diagram was not fitted to any
character. Its head radius (16), arm lengths (30/31), leg lengths (44/44), and
shoulder/hip positions are illustrative geometry. Sprite registration at
128 by 192 with a floor anchor at (64,181) does not establish anatomical joint
positions or make those diagram dimensions compatible with the artwork.

**Evidence:** Terra `inspect_movement_animation` checked the preview geometry,
existing registration code, GS-010's approved v2 metadata, and current pose
contract read-only. Astra visually compared the approved v2 four-direction
board with the existing founder and patient side-idle atlases. The artwork has
larger heads and fuller, more varied silhouettes than the diagram. Neither
the old atlas metadata nor the new v2 manifest supplies a fitted anatomy map.
No per-character joint measurements, retargeting, or raster edits were performed.

**Design decision:** Share the eight phases and opposing limb relationships;
fit head size, torso/limb lengths, shoulder/hip locations and stride reach to
each approved body shape. Preserve the character's silhouette and identity.
The fitted skeleton guides matching finished sprite frames; existing whole-
character PNGs are not already prepared clothing/body layers. Verify one
representative approved character in motion before extending the fitting work.
Motion timing is accepted; proportional fitting and final appearance need review.

**GS-010 dependency:** The original side A/neutral/B contract and upper-body-fixed
pilot did not satisfy MOV-001. GS-010 has now confirmed eight distinct lateral
sprites per direction with full opposing arm swing, two passing poses and four
transitions. Both earlier lower-limb pilots are complete and preserved as trials;
neither is final MOV-001 art. Front/back A/B and seated/exam stay separate.
Existing full resident processing approval remains; do not ask for it again.

**Coordination:** GS-012 sent this contract mismatch and the accepted movement
requirements to **GS-010 — Patients and employees** using the native task
message tool on 2026-09-10. Requested walking-only contract/ownership alignment,
preserving its approved processing scope and all completed/in-flight work.
No new render or queue operation was requested. GS-010 replied and requested a
bounded Patient 01 fitting reference from its approved right/left idle masters
(448 by 1024). GS-012 confirmed ownership: GS-010 keeps all raster edits,
generation/jobs, masks and private packages; GS-012 prepares numeric joint
geometry and an independent vector study only. No private raster edits, copies,
uploads or raster-derived preview rendering by GS-012. No shared runtime/atlas
edits by either task in this milestone. Sol `correct_side_walk_preview` completed
the new fitting paths and acceptance criteria in M2 of the active plan. Parent
review returned specific geometry/rendering/coordinate corrections, which Sol
implemented before final technical acceptance.

**Fitting reference result:**
[Patient 01 fit data](character-movement/patient-01-fit.json) and its
[vector study](character-movement/patient-01-fitted-walk.html) now use the approved
art's approximate head/torso/limb proportions. All eight phases in both directions
include explicit 128 by 192 frame and 448 by 1024 master coordinates. A fixed
scale and per-view source axis preserve floor registration across the cycle;
head/torso bob is a rigid translation. Observed silhouettes, inferred joint
centers and uncertainty, and authored motion choices are separate fields.
This is not a raster costume or proof of final character artwork.

East's near limbs are anatomical right; west's are anatomical left. Reflecting
labeled joint geometry retains the phase and swaps drawing order. A plain raster
flip changes the anatomical interpretation and requires a half-cycle permutation
for this symmetric gait: 1/5, 2/6, 3/7 and 4/8. The independently approved side
masters are not pixel-mirror substitutes. Schematic shoulder offsets and the
normalization of the idle far-shoe stagger are explicitly documented limitations.

Sol's 2,446 checks and Astra's independent 3,191 checks pass. Astra reviewed
original artwork, numeric alpha observations, actual source, and six rendered
main-pose/responsive light/dark screenshots. Ground contact, consistent lengths,
opposite limb swing, both passing poses, transitions, native-unit transforms,
reflection semantics, playback and responsive display pass. The two masters,
foundation manifest, accepted M1 preview and nine protected game/launcher files
remain unchanged. Validation is in `artifacts/character-movement/patient-01-fit/`.
Reference paths, hashes, validation and limitations were delivered to GS-010.
Its representative raster walk and the owner's appearance review remain pending.

<a id="mov-003"></a>

## MOV-003 — Natural north/south eight-pose walks

**Exact owner request (2026-09-10):** "Great, now let's do the same thing for how
the characters walk north and south. Currently when walking north the body kind
of sways side to side. Also currently when walking south the legs just go in and
out. I just want a natural eight pose walk north and eight pose walk south that
fits the body proportions"

**Scope:** All character groups in MOV-000. North is map-up/back view; south is
map-down/front view. Prepare the same proportion-fitted motion reference process,
preserving the delivered lateral reference. This supersedes the earlier front/
back A/B-only target. No accepted final north/south artwork or game fix yet.

**Movement interpretation:** Eight distinct phases in each direction, sharing
the anatomical gait sequence of MOV-001. Stable torso/head centerline and width,
modest vertical bob, feet stepping forward/back in stable lanes, knee bend and
foot lift through passing, opposite arm swing, and coherent depth/overlap. Feet
must not merely spread inward/outward. North/back and south/front have opposite
screen-left/right anatomical mapping, but retain the same phase identities.

**Read-only evidence (Terra, parent reviewed):**

- `routeMotion.ts:324` maps negative Y travel to back/north. `FacilityScene.ts`
  advances the shared phase and calls the common selector.
- `lateralGaitCycle.ts:8` selects only A/B for front/back; no passing or
  transition frames. Founder/patient resolvers select direction-specific A/B.
- `characterBitmapArt.ts:102` resolves generic v3 walking to left-facing art
  before checking direction; this is an additional later integration concern.
- `characterArt.ts:1665` and `:1889` encode vertical arm offsets and horizontal
  leg shifts in front/back procedural fallback. Loaded bitmap art is preferred;
  this explains a possible source of the pattern, not a live reproduction of
  what the owner saw. Current atlas contracts still lack eight front/back poses.

**Sources/ownership:** GS-010 confirmed Patient 01 `standing-master.png` and
`back-idle-master.png` in production-foundation-v2 as the intended approved
448 by 1024 masters. GS-012 owns the new numeric/vector reference and review;
GS-010 retains all raster packages/jobs/masks and its approval handling. Its
private-art processing is currently paused after its own automatic approval
rejection; it explicitly requested that this separately owned reference proceed.
No raster processing, upload, runtime change or extra approval request by GS-012.

**Reference result:** Sol `correct_side_walk_preview` completed M4 in
`character-movement/patient-01-north-south-fit.json` and
`character-movement/patient-01-north-south-walk.html`, with an identical thread
display copy. Eight explicit phases in each direction use the approved Patient
01 head/torso/limb proportions as an approximate fitting guide. Body/head X and
torso widths stay fixed; feet stay in stable lanes. Opposing arms, straight
support legs and lifted bent passing legs are defined in latent 3D and projected
separately for front and back. The maximum projected body rise is about 4 pixels.

The 0.88 vertical / 0.22 depth projection is an authored stylization, not a
calibrated camera. Fixed lengths belong to latent 3D; projected 2D limbs
foreshorten. Frame and native 448 by 1024 points, projected lift/bob scalars,
source registration, depth ordering and local ground contacts are explicit.
Source image registration never mirrors either independent approved master.
Each sole uses its own projected ground depth rather than a single screen row.
The head, torso, hands, trouser lanes and broad shoe widths fit the observed
silhouette approximately; hidden joints and final clothing remain interpretive.

**Technical review:** Terra completed the read-only preflight; Sol implemented
the reference and corrections. Astra inspected both original masters, alpha
measurements, source/data, and ten vector screenshots covering all eight phases
in both views at 736 light plus 320 light and 736 dark. Worker validation passed
2,572 assertions; independent parent validation passed 3,976. The 18 protected
source/runtime/previous-reference hashes are unchanged, with no browser errors
or network requests. Evidence is under
`artifacts/character-movement/patient-01-north-south/`.

- Fit SHA-256: `7523c59921ec730ec343265e422f8b5d2c8cec5cf442504ea1f52b92ac3e50b2`.
- Canonical/display SHA-256: `d1b45d2796e4070b1db405424ea1478853638e42be76bf47571fc0e5dd32378a`.

**Status:** Numeric/vector reference technically reviewed. Final paths, hashes,
coordinate usage, evidence, exact wording and this MOV-003 record were delivered
to GS-010 through the native task tool on 2026-09-10. Delivery is not visual
acceptance or a request to start a raster job. The owner subsequently replied
"Okay, looks good" and accepted the north/south motion reference before adding
MOV-004. Final clothed sprites, roster fitting and runtime
integration remain subsequent work. All GS-012 work remains local/uncommitted.

<a id="mov-004"></a>

## MOV-004 — Freeze on pause; destination determines resting pose

**Exact owner request (2026-09-10):** "Okay, looks good. Then when the character
is moving, but for any reason the game becomes paused, the character needs to
freeze in the exact position/orientation/pose that they are currently in. When
a character stops moving in a location (not paused) that is the floor they
should stop and stand facing south \"the camera\". When a character stops moving
in a location that is a chair or patient bed, then the form the pose of the
chair or patient bed"

**Required behavior:** Applies to every group in MOV-000. Pausing is suspension,
not arrival: preserve the currently displayed world position, facing and exact
walking frame, including on subsequent paused redraws. Resume from that visual
state without a catch-up jump. Manual and automatic pauses follow one rule.
When movement ends while running, an ordinary floor location uses standing
idle facing south/front. An actual chair or patient-bed destination instead
uses its seated/exam pose and fixture orientation; do not adopt it mid-route.

**Scope:** M5 in the existing plan is a bounded presentation behavior change.
Preserve simulation speed/routes, saved campaign data and the accepted motion
references. Existing available chair/bed poses are used; this does not accept
or integrate unfinished GS-010 raster assets. GS-010 retains private art and
atlas production ownership. Source changes must preserve the already dirty tree
and be tested without rebuilding or touching the owner's active game session.

**Status:** Implemented and technically accepted on 2026-09-10. Terra completed
the preflight and core implementation; Sol expanded the real FacilityScene
regressions and fixed initial facing for actors first displayed during pause.
Astra reviewed the actual diff and tests, added a small founder coverage case,
and independently passed 7 files / 52 tests, player typecheck and project
boundary checks. All 25 protected files in the preservation report are intact.

The shared presentation wrapper freezes each actor's displayed world anchor,
facing, pose, appearance and bitmap/procedural representation. Resume drops
pause-spanning elapsed time; stable per-key gait offsets survive list reorder.
Floor arrival uses front idle; existing semantic chair/exam poses wait for both
logical and visible arrival. Snapshots are transient and add no saved state.
Owned source: `FacilityScene.ts`, new `characterMotionPresentation.ts` and the
two corresponding focused test files, all under `apps/player/src/facility/`.
Evidence: `artifacts/character-movement/pause-arrival/parent-review.json`.
Changes remain local/uncommitted and await the next game build and live visual
playtest. Existing chair/bed art is used; eight-frame raster integration remains
with GS-010.

<a id="mov-005"></a>

## MOV-005 — Map character artwork to the shared walking templates

**Exact owner request (2026-09-10):** "Okay, so now we need to figure out how
to map the characters to these shared walking templates. Talk with GS-010
which is working on designing more characters for the game so that you are
in synch"

**Scope/status:** GS-010 and GS-012 agreed the shared-phase/per-character-fit
architecture, exact inventory mapping, ownership and pilot sequence. Terra
completed the runtime contract audit; Astra reviewed the actual source/data and
recorded [the versioned mapping contract](character-movement/character-template-mapping.md).
Its numeric addendum incorporates GS-010's requested timing, coordinate,
ground-contact and tolerance clarifications. GS-010 explicitly confirmed the
complete version 1 contract with no further design confirmation needed.
All four character groups remain in scope. Patient 01's absolute joint
coordinates are its representative fit; each body/outfit needs its own fitting.
GS-010's next art handoff is Patient 01 east stride 01 and passing 03, followed
by its complete loop, independent views/turning and then the other outfits.
No raster production or runtime modification occurred in this coordination.

<a id="mov-006"></a>

## MOV-006 — Prove an efficient mapping process before roster expansion

**Exact owner request (2026-09-10):** "Okay, proceed. So make sure there is a
robust process for mapping the characters to the silhouette. When the game is
done there will be hundreds of characters so I want to make sure we have a good
process for doing this that is efficient before we keep making more character
designs. Once you have a good process, either we need to re-make the characters
we have so far or just map them to the silhouettes and we can proceed with that
at a batch at a time"

**Scope/status:** M7 moves from the agreed contract to reusable local tooling
and a representative art proof. GS-010 received the exact request and the
process-first expansion constraint. Terra completed compiler/geometry preflight
and an adapter seam audit. Sol implemented the offline fit-target/batch tool and
parent-requested hardening; Astra reviewed the actual source and independently
passed 14 Node tests and 8,809 geometry/CLI/preservation assertions. Patient 01's
32 numeric targets exactly match the accepted references. Batch rerun/resume,
selective processing and dependency checks are implemented; the other three
characters explicitly await their own measurements. See
[the production process](character-movement/production-process.md) and
`artifacts/character-movement/mapping-pipeline/parent-review.json`.

GS-010 owns the actual compositor proof and a narrow artifact-to-piece binding
layer, followed by real donor/raster trials. The owner resolved its private-image
approval condition on 2026-09-11; GS-010 recorded the informed approval and resumed
the resident workflow. No duplicate approval question is needed.
Prefer adapting existing identities; remaking source parts is an evidence-based
pilot decision, not a blanket redesign. No new character expansion until the
process works across the existing sample outfits. Target-only tests do not
establish completed raster art or production efficiency.

The synthetic lateral binding is now technically accepted: three body profiles,
all eight east/west phases and one unchanged arm/leg piece kit per profile.
Terra reviewed semantics; Astra independently checked all 48 saved graphs and
384 limb placements. Final cleanup evidence records 25 passing tests, and a
first-build correction preserves all accepted target/kit/graph bytes. The
[north/south projection proof](character-movement/north-south-projection-proposal.md)
now has accepted local N1 v7 preparation. Terra reviewed semantics; Astra checked
71 text/code hashes, the 10-pass receipt and 136 actual target mappings across
18 saved canvases. N2/N3 actual synthetic rendering is now accepted: GS-010
decoded and reviewed all 36 PNGs; Terra reviewed analysis semantics and Astra
matched the execution and output records to frozen N1. Observed color/alpha
rounding remains separate from production tolerances. The next proof is actual
clothed-character cycles and preparation effort; roster readiness remains pending.

## Ownership and acceptance boundaries

### Owner clarification: actual approved characters (2026-09-11)

The owner requested: "So can you show me an in thread example of two characters
walking, standing, and sitting while mapped appropriately to the silhouette
performing the appropriate eight pose walks (or just standing/sitting still)?"

After the illustrative M8 example, the owner clarified: "Okay this looks pretty
good, but those aren't any of the approved characters mapped to the silhouette.
Like I want to keep all of the characters that have already been approved (like
55 of them ish I think) and have them map to the silhouette".

M8 is an illustrative motion example, not fulfillment of the actual-character
preview. Preserve the full approved roster and fit shared motion to each body's
measurements. GS-010 owns the real Patient 01 pilot, then a second approved
character and subsequent migration batches. The approximate roster count needs
manifest verification; no generic replacements or new designs are requested.

- GS-012 owns this record and
  [the scoped handoff](../handoffs/GS-012_CHARACTER_MOVEMENT.md).
- GS-010 owns character generation/roster assets. Its current scoped handoff
  describes new idle/portrait packages without runtime integration. Coordinate
  precise asset and renderer ownership before implementing MOV-001.
- M1/M2/M4 changed only isolated references and validation evidence. M5 changed
  the four coordinated presentation source/test files above. Assets, saves,
  browser state, the running build and server remain undisturbed.
- Before substantial implementation, document requirements, owned source/test
  paths, acceptance criteria, and milestones in
  `docs/execplans/character-movement.md`, then delegate the bounded milestone.
- Technical checks and owner visual/playtest acceptance are separate. Keep
  the task open through discussion and intermediate milestones.
