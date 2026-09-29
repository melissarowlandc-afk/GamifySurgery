# GS-026 — Character stills and walking designs

## Owner closeout approval — September 29, 2026

Owner requested pushing GS-026 to GitHub and authorizes completing and closing
the task after that push. Record the exact scoped branch/commit and verify the
remote contains it before final closure. Push completion and task archival have
not been independently verified by GS Manager. This approval does not authorize
a website deployment or change clinical approval status.

## Unique employee coverage — September 29, 2026

Owner requested a distinct employee character for every supported employee
opening and no concurrent duplicate hires. Added25 new staff identities/200
standing and seated cardinal poses:3 Periop nurses,2 endoscopy nurses,
3 endoscopists,1 phlebotomist,8 EVS and8 GLP-1 NPs. The staff pool is now47
for43 configured openings; dedicated nursing pools cover their capacities
without competing for the shared foundation nurse. Full runtime registry is
153 identities/1254 assets. All128 prior identity records and1054 prior image
bytes are preserved. Movement remains the selected directional still+3px/2Hz
bounce; all walking experiments/approvals remain historical and untouched.

Hiring reserves every active and visibly departing staff design globally,
rejecting an exhausted pool before charging. Save loading retains deterministic
first keepers and all existing unique designs, then repairs later collisions.
Existing transient-departure reload behavior is unchanged. Unsupported legacy
over-capacity saves retain employees even if a role's art pool cannot repair
every duplicate; no save failure or automatic dismissal is introduced.

Plan: `docs/execplans/unique-employee-character-coverage.md`.
Review: `artifacts/character-statics/gs026-employee-expansion-v1/review.html`.
Reusable pipeline: `tools/character-mapping/gs026-employee-expansion-v1/README.md`.
New art has agent production QA/local integration authorization, not individual
owner art approval. Prompt records002-013 are explicitly reconstructed because
verbatim generation requests were not retained. Local-only; no GitHub backup
push or deployment. Owner pathway remains START_GAME.cmd/127.0.0.1:4173.

## Selected movement — September 29, 2026

Owner selected the little step bounce at height3/tempo2 and authorized applying
it to every game character: directional standing stills with a small bounce,
without walking-frame animation. Integration is complete locally under
`docs/execplans/character-step-bounce-runtime.md`. This supersedes runtime walking
selection and the pending corrected-gait integration; preserve all existing
artifacts, approvals and unfinished walking work as history.

All128 identities resolve to standing art while moving. The shared3px/2Hz bounce
lifts only the body; stop/seat grounds it, pause/build freezes it, and routes,
depth, scale and seating anchors remain unchanged. Sol implemented; parent
reviewed scoped diffs/final screenshots and independently verified52 focused
tests and player TypeScript. Vite build and2 browser tests (bounce and existing
loading/scale regression) PASS. No publication or backup push occurred.

## Movement alternatives — September 29, 2026

Owner requests five lower-effort alternatives to per-character walking, including
gliding, hopping and legless designs. The [five-option animated comparison](../../artifacts/character-movement/gs026-movement-alternatives/review.html)
is complete locally under `docs/execplans/character-movement-alternatives.md`; research notes at
`docs/reviews/gs026-movement-alternatives-research.md`. Existing art and all prior
approvals/walking work are preserved. Runtime movement is unchanged while these
options are compared; the wider gait-preview integration below is not the current
task. Owner prefers investigating smaller/faster soft hops; a focused
[little step bounce comparison](../../artifacts/character-movement/gs026-movement-alternatives/hop-review.html)
is ready at3px/2Hz defaults with height/tempo controls. Owner subsequently selected
these defaults for runtime integration, as recorded above.

## Current result — September 28, 2026

Owner rejected batch03 gait anatomy after the review below: missing profile
passing poses and confusing North/South foot motion. Its prior production
acceptance is reopened. Corrective work is tracked in
`docs/execplans/character-gait-pose-correction.md`. The correction is a separate
64-frame [corrected preview](../../artifacts/character-movement/gs026-gait-correction-pilot/review.html)
using visual pose templates, genuine passing poses, source-sheet
scale calibration and wider transparent stride canvases. Root inspected all eight
normalized direction sheets and their combined map-size strip. This is agent
review, not direct owner acceptance; fully unattended generation remains unproven.
At that historical checkpoint runtime remained at the prior batch03; the
September29 standing-bounce selection above now supersedes runtime walking.
Owner-approved earlier identities and all stills are preserved. Do not treat the historical
batch03 completion statement below as current visual acceptance.

### Historical batch03 integration — acceptance reopened

Batch03 adds Gray Overshirt (`patient.adult.032`) and Gray Braid
(`retained.gray-braid`) through the shared pipeline: five walking identities,
160 slots total. All96 prior slots remain unchanged; owner accepted the v2
Navy/Beanie correction. Two new identities use current standing references,
not legacy rig drafts or the conflicting Gray Braid probe ID. Five image calls
this batch included one targeted Braid N/S proportion retry. Final Braid N/S
uses documented reordering/holds; other new directions use source reading order.
Current [walking batch review](../../artifacts/character-movement/gs026-uniform-walk-batch-v3/review.html).
The v1/v2 reviews and rejected sources remain preserved as history.

### Previous rhythm correction

North/South follow-up: owner requested less stuttering for Navy and Beanie.
Their existing poses are now regrouped into one lead-foot half-cycle followed
by the other, with four intentional held slots. Cadence remains180ms; no art
generation or movement-speed changes. Blue, East/West and all stills are intact.
Review [before/after at map size](../../artifacts/character-movement/gs026-uniform-walk-batch-v2/review.html).
The v1 review and source history remain preserved; v2 is the current sequence.

Owner accepted the Blue pilot and authorized an autonomous, uniform expansion.
Blue Glasses, Navy Vest (`patient.adult.035`) and Brown Beanie (`patient.adult.043`)
now have four-direction walking:96 runtime frames,64 reused byte-for-byte and32
new normalized North/South frames. Blue has direct owner approval; the four new
directions passed agent production review under owner authorization. All stills
and source history remain preserved. Other identities retain standing glides.

The shared config, prompt template, extractor and validator live in
`tools/character-mapping/gs026-uniform-walk-batch/`. Three generation calls
completed this batch, including one targeted Navy South proportion correction.
Future batches add config records and source sheets, not per-character rigs or
runtime code. Automated checks supplement agent visual review; this is a proven
three-character batch, not a claim that all128 identities are finished.
Review [uniform batch](../../artifacts/character-movement/gs026-uniform-walk-batch-v1/review.html).
Plan: `docs/execplans/uniform-walk-expansion.md`. Local only, no publication.

### Earlier pilot milestone

Owner authorized a simple reusable four-direction walking pilot. Blue Glasses
(`patient.adult.039`) now plays its32 recovered frames in the local game, with
eight phases per direction, movement-only playback, static stop/seat poses and
pause/build freeze. All other identities retain standing glides. The opt-in
registry/playback can accept future character frame sets without custom rigs.
East/West retain prior GS019 owner acceptance; North/South are review drafts.
Review [animated pilot](../../artifacts/character-movement/gs026-simple-walk-pilot/review.html).
Plan: `docs/execplans/simple-cardinal-walk-pilot.md`. Five live browser regressions
pass; original stills and approvals are preserved. Local only, no publication.

## Current result — September 24, 2026

Follow-up correction complete locally: directional art prefetch and same-person
bitmap retention remove gray placeholders at cold turns. Oversized designs use
one downward-only identity scale across every standing/seated direction and
clipboard, based on the default founder's visible standing height. Source art
and seated corrections remain intact. Four runtime browser regressions passed,
including delayed moving-facing and paused seat loading; player494 tests pass.
See `docs/execplans/character-still-loading-and-scale.md` and screenshots in
`artifacts/screenshots/gs026-loading-scale/`.

The owner subsequently authorized integrating all completed stills, including
corrected seats, replacing active legacy character artwork and using directional
standing glides on existing paths. That instruction supersedes the review hold
and default no-runtime scope below. Local integration is complete under
`docs/execplans/character-stills-runtime-integration.md`:128 identities,
1054 source-matching PNGs, save-compatible cosmetic IDs, corrected seat alignment,
shared standing/seated scale, portraits and36 founder choices. Walking animation
is disabled. Ten focused browser tests passed; screenshots are in
`artifacts/screenshots/gs026-runtime/`. Source approvals and unfinished walking
remain preserved. Use START_GAME.cmd / http://127.0.0.1:4173 in the usual profile.
No GitHub backup or website publication was performed.

After recovery and the owner's explicit correction instruction, all oversized
seated poses identified in the older roster are corrected:22 characters,
88 poses. Review `artifacts/character-statics/gs026-seated-correction-v1/review.html`.
The complete overlay selects those poses while preserving all originals,
standing poses, unaffected seats, approval history and walking work. Production
QA and preservation checks passed. At that milestone, owner visual approval was
pending and nothing was runtime-integrated or pushed. See `docs/execplans/character-stills-walking.md`
for scope, evidence and final validation. The original recovery instructions
below remain historical context; the subsequent integration instruction governs.

Prepared September 24, 2026 at owner's request to locate the old character work
or establish a continuation. No native task has been created: task listing,
reading and creation tools are unavailable. Historical conversation existence
and archive status are unknown. Do not describe those conversations as lost.

## First action and scope

Use the existing local project <repository-root>, not a clean
default-branch worktree. Read AGENTS.md, current handoff and project board;
inspect dirty Git state before edits. You share files with others: preserve all
unrelated work. Present the recovered stills and walking proofs, summarize
accepted versus incomplete coverage, and ask what character/batch the owner
wants next before generating or integrating new artwork.

This is the character-art continuation. GS-025 owns layering/pathing; coordinate
scope through the owner/manager rather than overlapping runtime edits. Do not
rewrite completed stills or automatically resume all historical next actions.

## Original tasks and current file-backed results

- **GS-018 — Existing-character statics**, historical task
  `01a0b014-c58a-7332-9c2d-fdc8a78b4eee`: handoff
  `docs/handoffs/GS-018_EXISTING_CHARACTER_STATICS.md` records 88 identities,
  704 cardinal standing/seated poses plus 30 approved founder clipboard poses.
  Package: `artifacts/character-statics/gs-018-v1/coverage-manifest.json`.
- **GS-022 — New character statics**, historical task
  `01a0b16c-195c-7c61-a896-a4a8d3e79625`: all 20 employee and 20 patient/public
  front identities approved. Its pending-280-pose summary is superseded by the
  completion packages below; do not regenerate those poses from stale notes.
  Source identities: `artifacts/character-statics/gs-022-new-v1/`.
- **Employee20 cardinal stills**: read
  `docs/handoffs/EMPLOYEE20_CARDINAL_STATICS.md`; 160 PNG views in
  `artifacts/character-statics/employee20-statics-v1/`, including 20 unchanged
  approved fronts and 140 generated views. Owner identity approval and production
  visual QA remain distinct; no blanket runtime readiness inferred.
- **Patient/public20 cardinal stills**: read
  `docs/handoffs/PATIENT_PUBLIC20_CARDINAL_STATICS.md`; corresponding 160 PNGs
  in `artifacts/character-statics/patient-public20-statics-v1/`. Preserve front
  approval receipts, seated anchors, original sources and exact prompts.
- **GS-019 — Founder walking and star jumps**, historical task
  `01a0b014-db24-7e13-b866-8a3c88cef01d`: closed by owner direction, not full
  roster completion. Read `docs/handoffs/GS-019_FOUNDER_MOTION.md` and its final
  receipt. Accepted eight-phase West/East cycles are Blue Glasses v7, Navy Vest
  v3 and Brown Beanie v1 under `artifacts/character-movement/`:
  `gs019-blue-west/whole-body-candidate-v7/`,
  `gs019-navy-walk/west-candidate-v3/`, and
  `gs019-beanie-walk/west-candidate-v1/`.
- Blue North/South are reviewed drafts without established final owner approval.
  Navy/Brown lack new North/South cycles. Gray Braid has only phases 01/05;
  its v3-source probe is unreviewed and its runtime identity conflicts with the
  inherited crosswalk. Resolve source hashes/identity before reuse. No complete
  all-character walking or new founder star-jump coverage is claimed.
- Earlier combined history: GS-013 — Character surface fitting,
  `01a09b55-147e-72f0-b413-e8b6827c7287`, split into GS-018/019.
  Read GS-013_STATICS_AND_MOTION_SPLIT.md and
  APPROVED_CHARACTER_SURFACE_FITTING.md only as historical lineage; later
  scoped records and current owner direction govern.

## Ownership, acceptance and validation

Initial milestone is source recovery and owner selection, not art production.
Before substantive work create `docs/execplans/character-stills-walking.md`
with exact chosen identities, poses, owned asset/tool paths, acceptance and
validation commands. Use installed custom workers per AGENTS.md. Own only the
selected art package under artifacts/character-statics or character-movement,
its tools/character-mapping scripts, scoped proofs and handoff. No runtime,
room, session, clinical, economy, launcher or package changes by default.

Use current manifests/approval receipts to verify identity, immutable approved
source hashes, full cardinal/phase coverage, alpha, grounding, native proportions,
seated contacts and game-size review. Use existing package validators documented
in the specific handoffs. Inspect artwork and animated playback, not only numeric
checks. Accepted gait is not permission to replace it during cleanup. Respect
reference-only identities, incomplete probes and original privacy restrictions;
private source/rejected art must not be included in a public backup.

Normally one writer per shared area. Preserve GS-025 layering/pathing ownership
and GS-015 approved rooms. Do not claim isolated artwork is integrated gameplay.
Do not install dependencies, push, publish or deploy without applicable explicit
authorization. Preserve owner server/saves and canonical START_GAME.cmd at
http://127.0.0.1:4173. On completion record exact validation, owner acceptance,
asset paths and backup status separately; update the current handoff. Manager
and GS-006 remain ongoing tasks.
