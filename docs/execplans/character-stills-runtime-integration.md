# GS-026 — Integrate all completed stills with directional glide movement

Status: COMPLETE LOCALLY, September24,2026. All required implementation and
scoped live verification completed; no publication or GitHub backup performed.

## Goal and authority
Owner instruction September24,2026: put all completed character stills into the
game, use corrected seated patients, remove the current character artwork, and
show the directional standing still while traveling along existing paths. No
walking animation now. This authorizes local runtime integration of the reviewed
packages; it does not request GitHub backup or website publication.

## Requirements and boundaries
- Include all128 completed identities:88 GS018 (using GS026 complete overlay),
  20 employees and20 patient/public characters;1024 cardinals plus30 clipboard
  poses where appropriate. Preserve stable character identity mapping.
- Replace active legacy artwork/animation paths. Preserve source archives,
  approved historical versions, unfinished motion and unrelated dirty work.
- Standing South/East/West/North frames remain static while actors follow their
  existing paths. Seated actors use matching cardinal sit poses and authored
  seat-contact anchors at the same anatomical scale as standing.
- Preserve founder/staff/patient roles, sex/age constraints, existing saves and
  clinical identities; no invented clinical demographics or new clinical content.
  Include reference-only source identities in asset coverage without silently
  assigning uncertain historical crosswalks.
- No procedural old-character fallback in active gameplay once assets load;
  investigate all UI portraits/selection and facility actor paths.
- Source art is immutable. Packaging may copy or compose native-size frames,
  preserving rendering pixels and explicit source hashes; no AI regeneration.
- Owner plays via START_GAME.cmd at http://127.0.0.1:4173 in the existing profile.
  Isolated synthetic browser tests may use a disclosed separate origin/profile;
  never imply test campaigns replace or inherit the owner's save.

## Repository state
Extensively dirty shared beta worktree contains completed GS023 procedure work,
room/character rendering changes and other unrelated tasks. Inspected AGENTS,
current handoff, prior GS026 plan and tracked status before starting. Do not
reset, broadly stage, erase save data or overwrite other task changes.
Prior corrected-art milestone: all22 affected IDs/88 seats validated; complete
overlay retains616 GS018 poses,30clipboard,320newer statics,48accepted walkframes.

## Milestones and ownership
1. Read-only runtime map: Terra recover_stills investigates loader/selection,
   saved IDs, render/anchor/motion seams and applicable validation. Parent audits
   completed input packages and decides catalog/compatibility architecture.
2. Bounded asset packaging/catalog milestone, delegated after runtime seam review.
   Explicit versioned public directory and generated metadata only; source hashes
   and all128identity/1054pose coverage verified; no source archive deletions.
3. Bounded runtime integration milestone, one named worker owns agreed runtime
   modules/tests. Remove active legacy rendering and use static directional
   travel while preserving spatial movement. Parent reviews actual diffs.
4. Bounded visual/runtime verification and fixes: targeted unit tests, workspace
   types/boundaries, build, isolated browser proof. Parent inspects screenshots,
   compares anchors/scales and saves final handoff.

## Acceptance and validation
Coverage exactly128IDs/1024cardinals/30clipboard; all88correctedseats selected.
Input hashes and native artwork preserved. Old saved identities resolve without
campaign resets; new roster has reachable appropriate selection/spawn paths.
Travel changes facing without cycling/bobbing/mirroring authored East/West.
Path geometry/speed, arrival and seating logic remain intact. Validate all4
directions, corrected old patients, newer patient and employee, founders,
clipboard/portraits, existing-save compatibility and no old-art fallback.
Test commands and actual evidence recorded as implementation becomes concrete.

## Progress / next action
Terra runtime investigation delegated. Parent confirmed three completed packages
and their role/demographic/approval metadata. Integration authorization supersedes
the prior owner-review hold, while historical approval receipts remain immutable.
Next: decide packaging/catalog seam from runtime investigation and delegate it.

Architecture decision: individual unchanged PNGs with registry-driven lazy
loading for live identities, not1054 startup requests. Sol owns new
tools/character-mapping/gs026-runtime-stills/, public/art/characters/gs026-stills-v1/
and characterStillRegistry.ts/generated.json/tests. Typed lookups expose native
size, bounds and body/floor/seat anchors; public metadata excludes source paths.
Terra completed read-only loader/render/domain mapping. Parent reviewed actual
characterBitmapArt resolver and FacilityScene drawing/support seams. Existing
support code aligns ground only; integration must use authored seat-contact
against chair support without changing per-pose scale or world routes.

Selection architecture: optional persisted stillId is cosmetic and separate
from existing patientIdentityId. Preserve saved patientIdentityId and clinical
demographics. New patient visual pool may use50known patients plus20GS022 public
with explicit age/sex metadata, after case demographics are fixed. Staff use
20explicit role designs plus foundation receptionist and generic nurse for
existing nursing roles. No specialty/clinical behavior is inferred from clothing.
30founder variants retain exact founder.01..30 mapping. Four retained refs and
two foundation patients lack authoritative age/sex metadata; expose those six
as explicit additional avatar designs in the existing founder visual picker,
not automatic clinical patients. This makes all128 reachable without fabricating
demographics. Historical source archives/labels remain intact. No legacy-human
fallback during new image loading; neutral loading/error presentation only.
Child cases must not receive adult-only art. Owner records/names remain stable.

Packaging first pass: Sol produced128IDs/1054byte-identical public PNGs (~41MB),
generated runtime registry and typed helper. Parent readactualbuilder/validator/
helper, independently ran registryvalidator PASS, then found8missingseatanchors
on P35/P39 accepted-reuse poses. Terra recovered all8 exacthash-joined authored
anchors from navy-vest-v1/manifest.json and blue-glasses-v1/manifest.json.
Sol now adding pinned reuse-anchor provenance and mandatory512sitanchor coverage.
All artwork bytes remain immutable; this is metadata recovery only.

Packaging accepted after correction: parent independently reran validator PASS
128IDs/1024cardinals/512finite seat anchors/30clipboards/88correctedseats;
all1054PNGs byte-identical. Newregistry hash b91e5bc4...; sources stay frozen.
Sol now owns domaincatalog/stillId/appearance/persistence andfocusedtests only,
with before-copies of existingdirtyfiles for task-scoped diff review. Rendering
and existingpicker changes are a subsequent milestone. Terra prepared browser
fixtures from existinghelpers and live __facilityGaitSnapshot devhook.

Renderer review discoveries: old getAuthoredCharacterPresentationMetrics scales
WIDTH bytile*1.35, which would make160x320 stills~33%taller than128x192 actors.
Use one global still scale preserving legacy canonical floor-span
(old width*181/128 versus newfloor287), approximatelywidthtile*1.064,height2width;
visually verify actual room fit. Same factor forstandandsit; no per-pose resizing.
Align seatedbaseY to worldseatY+(floorY-seatContactY)*scale. Preservepaused
render anchor afterthatadjustment. Existingfrozenproceduralrepresentation must
not preventnewassets appearingafterasyncload; nolegacyhumanfallback.

Browser verification plan: later isolated Vite http://127.0.0.1:4199 withfresh
Playwrightprofile, GAMIFY_E2E_EXTERNAL_SERVER=1/GAMIFY_E2E_BASE_URL set explicitly.
Neveropenowner4173profile. Reusepersisted PROFILE_KEY fixtures andlive scenehook;
checkP01/P40chairs,newpublic/newemployee,founder,4travelvectors/phaseinvariance,
pause/reload/resume,portrait/picker36choices. Updateobsoletelegacygait/3:2tests.

Domain milestone accepted: parent reviewed task-scoped appearance/persistence
diffs, catalog and tests, compared all40 GS022 metadata rows to registry, and
independently ran10 focused tests plus domain typecheck PASS. Review caught new
patient creation accidentally retaining legacy-only selection; Sol corrected it
and tested actual creation reachability of all20 new designs. Sol reports full
domain568 tests PASS. Existing clinical IDs and cases remain unchanged.
Sol now owns renderer/UI milestone with before-player snapshots, static cardinal
resolver, lazy frames, uniform scale/seat anchors, neutral fallback, portraits,
36 founder choices and128-entry developer QA. Terra UI seam review completed.
Next parent review actual scoped diffs, then isolated runtime/browser proof.

Renderer/UI milestone accepted pending live proof. Sol implemented central
registry-only resolver, lazy full-image Phaser textures, static walk-neutral
travel, uniform scale and authored seat targets, neutral failure/loading state,
portraits,36 founder choices and128-entry gallery. Parent reviewed actual diffs
and caught/fixed unknown-ID legacy fallback, paused cold-load seat adjustment,
unsupported seat offsets, standing front-desk offsets and failed-load retry loop.
Parent independently ran7 focused player files/38 tests and player types PASS;
Sol reports full player490 tests PASS plus final43 focused tests. Parent verified
no active old atlas/procedural character callsites, boundaries/launcher PASS,
isolated production build PASS in .local-dev/gs026-integration/build-proof.
Before-player captures cover17 files. Shared untracked characterMotionPresentation
was missed; record this gap, do not fabricate a pre-edit capture. Parent reviewed
its limited neutral-representation/seat-alignment additions against prior reads.

Terra now owns browser proof tests/screenshots only; no production edits. Parent
started isolated4199 Vite (session28425) after disclosing separate test storage.
Canonical owner4173 remains unchanged. Live proof outstanding: four directions,
constant frame while moving, chair contacts, paused load/save, portraits/extras.

Core live proof accepted: Terra new character-stills-glide.spec.ts passes2tests
on4199. Parent read actual assertions and inspected founder36, corrected P01/P40
seats, standing comparison and four-direction screenshots. Test uses adjacent
cardinal nodes through ordinary Scene.update, checks position advance with exact
constant standing asset hashes/frames, walk-neutral, no flip, equal stand/sit
scale, authored chair contacts, paused redraw anchors and founder36 save/reload.
Synthetic render composition is distinct from the persisted founder proof.
Parent independently reran full player490 tests, all workspace typechecks and
final artwork integrity validator PASS. Canonical4173 health returned200.

Remaining validation milestone: Sol owns three pre-captured character E2Es whose
old atlas/DOM/gait expectations are intentionally obsolete. Terra stopped after
coreproof without updating them despite authority; parent delegated completion
to Sol. Parent also flagged old mixed head/body founder saves: prior renderer
projected identity by head; verify and preserve that cosmetic migration so old
hybrid descriptors do not become neutral. No source art or clinical changes.

Final acceptance: Sol updated all3 compatibility E2Es;8/8 passed on4199. Legacy
mixed-founder mapping is restored in central normalization using the saved head
identity, preserving body/head fields and valid explicit/unknown still IDs.
Parent reviewed the actual final normalizer/catalog/persistence regression and
independently ran3 domain files/16 tests PASS, player/domain types PASS and final
isolated production build PASS. Parent independently reran corebrowser2/2 PASS
(14.4s), inspected corrected seated/standing, allcardinal, founder36, chartportrait,
mobile and zoom160 images. Combined focused browser coverage10/10 passed.
The gallery and movement tests preserve identity/portrait/reload coverage without
retaining obsolete atlas, mirrored-staff or gait-cycle expectations.

All work delegated as required: Sol packaging/domain/renderer/UI/compatibility;
Terra recovery/audits/live browser proof. Astra integration decisions, actual
diff and visual review, independent verification and durable planning/handoff.
No qualifying implementation milestone was left undelegated. Before-edit gaps:
characterMotionPresentation was missed; the immediate pre-final normalizer
restoration copy was also missed. Original before-domain and before-E2E receipts
remain; no fabricated capture. Shared unrelated changes were not reverted.

Testserver4199 stopped and verified unavailable; canonical4173 health200 remains,
corrected P01 seated publicasset HEAD200. Owner browser storage was never opened
by these synthetic tests. No durable pathway change. Runtime assets/source
archives and source hashes intact. Scoped implementation diff whitespace check
PASS; whole-worktree check reports unrelated existing handoff whitespace, left
untouched. Local checkpoint only; remind owner to say "push to GitHub" for backup.
Next action: owner playtest via START_GAME.cmd in the usual4173 profile.
