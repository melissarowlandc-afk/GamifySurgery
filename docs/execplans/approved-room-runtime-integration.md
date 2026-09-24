# GS-015 approved room runtime integration

## Goal and authorization — September 24, 2026

Owner explicitly approved the September22 furniture size changes and requests
replacement of old in-game rooms with all approved designs, implementation now,
and push. This supersedes prior runtime-separate restrictions for room work.
Sixteen approved designs plus FrontDesk03/X-ray02/CT01/EndoscopySouth04/East02
furniture revisions are the visual source of truth. No additional room design.
Seated character source-proportion repair remains deferred.

Replace active rendering/layouts while preserving room IDs, campaign saves,
clinical content, progression, room functionality and unrelated dirty work.
Original proofs/art remain recoverable. Do not implement this as flattened
screenshots that prevent actor layering, dynamic doors or fixture ownership.
Push authorization covers a scoped GitHub checkpoint; no main merge/Pages
deployment is implied. Canonical local pathway remains START_GAME.cmd and
http://127.0.0.1:4173 in the owner's existing browser profile.

## Repository baseline

Shared beta is heavily dirty from prior work. Existing tracked diff and status
saved in ignored .local-dev/gs015-runtime-2026-09-24 before any runtime edit.
HEAD c26c96a. Existing origin/backup/new-computer-2026-09-22 is a potential
complete baseline for a scoped integration checkpoint; verify content before
using it, rather than committing unrelated local changes. Never broad-stage.
Node/Chrome/dependencies available; npm is not on PATH. Use installed direct
CLIs when necessary, preserving launch/save origins.

## Ownership and milestones

1. Sol room_runtime_map: read-only map of proof/runtime interfaces, required
   geometry/depth/navigation/asset adapters and implementation milestones.
2. Named implementation worker(s), sequential write ownership: convert approved
   proof data/assets into a maintained runtime contract, then renderer/domain
   wiring. Exact file ownership assigned after investigation.
3. Integration tests and visual playtest: all16 designs, furniture revisions,
   rotations, doors/adjacency, use points, occupancy, pathing and save reload.
4. Parent reviews actual diff and evidence, records any limitations, performs
   scoped source/asset/secret/privacy checks, commits/pushes and verifies remote.

Parent owns architecture, planning, approval records, review and push. Workers
preserve unrelated work, do not spawn/install/commit/push/deploy or alter plans.

## Acceptance and progress

- All approved room types use the new active visuals and approved geometry;
  old rendering is not mixed into replaced rooms.
- Live doors/adjacency, collision/use points, actor depth and occupied variants
  function in the game; no invisible blocker or unreachable required service.
- Existing saves/identities preserved; no source-character redesign.
- Focused tests, typecheck/build, integration/browser captures reviewed.
- Scoped checkpoint exists remotely; branch/commit and opening pathway recorded.

In progress: read-only runtime mapping delegated; dirty baseline preserved.

## Architecture decisions and evidence

- September24 owner chose automatic Recovery relocation/reconnection if6x6
  cannot expand in place. Preserve same room ID/upgrades/staff/operations; no
  charges or capacity increase. Terra recovery_migration_design investigates
  migration separately read-only while Sol exports assets/contracts.
- Approved rectangular rotated views use counterclockwise domain270, not
  current UI90. Offer approved0/270; migrate old90 to270 with unchanged room
  bounds, then reconcile actor routes/use points. Preserve absolute doors where
  proof-valid; relocate invalid legacy doors as specified below.
  Do not invert global rotation semantics. Recovery fixed orientation0.
- Legacy room.imaging_control is non-buildable and has no approved proof;
  retain ID compatibility, do not fabricate approved art or delete saves.
- Sol room_runtime_map owns milestone1 export/public GS015 packs/manifest/new
  typed presentation contract/tests only. Next milestone replaces the active
  FacilityScene switch with modular depth/visibility/state-aware rendering.
- Existing player typecheck and28 layout/cutaway tests passed before edits.
- Fetched verified remote backup cdf984b696515d9cb90f7a05cc33dc7a3d3f30f3.
  All537 app src/public, package src and root package files compared byte-for-
  byte using Git blob hashes match current files. This supplies a coherent
  parent for a scoped integration checkpoint without unrelated dirty staging.
- Isolated checkpoint worktree created at .local-dev/gs015-runtime-checkpoint
  on codex/gs015-approved-rooms, parent cdf984b. Git longpaths override required
  for inherited artifact names; main beta worktree untouched.
- Narrow parallel-write exception: Sol recovery_runtime_migration owns only
  domain schema/persistence/new migration helper/tests and Recovery balance
  geometry while room_runtime_map owns only app asset/presentation files.
  Independent files allow save migration to progress alongside packaging.
  No renderer/domain navigation edits outside these assigned scopes yet.
- Parent verified29 exported image packs match approved proof bytes. Parent
  rejected initial grouped overview fixture metadata as insufficient: resolved
  per-instance draws must carry exact crop, size, contact and individual
  door/backing ownership for every approved orientation before integration.
- Extraction implementation now instruments proof canvas drawImage and dataset
  models to recover exact per-instance crops/draw envelopes/anchors in every
  authored view. Export remains a development tool; runtime consumes static
  typed data and public atlases, never proof HTML or a browser scraper.
- Recovery migration design: try in-place then deterministic nearest legal
  6x6; preserve affected neighboring door access with free hallway connectors;
  preserve IDs/economy/capacity; reproject actors/litter and reroute active paths.
  Validate doors, connectivity and FrontDesk-to-Recovery access atomically.
  Fully packed no-solution saves must remain recoverable, never partly written
  or reset. Frozen clinical service state/timers must not be erased.
- Integration QA can use tests/e2e/helpers.ts and facility canvas
  __facilityGame.scene.getScene("facility-scene") in an isolated automated
  browser. Existing Level2 helper builds an old4x3 Recovery at34,24 with adjacent
  hallway/frontdesk/phlebotomy, useful as a v7 relocation regression fixture;
  new v8 fixtures must use approved geometry explicitly.
- Actual launcher readiness failed: Node/npm missing message despite available
  Codex Node and complete installed project dependencies. Terra furniture_revision
  is reused for an isolated launcher-only compatibility milestone (scripts only):
  discover available local Node, allow existing-dependency start without npm,
  preserve standard npm route and exact origin/health/hidden watcher behavior.
  No installations, durable PATH changes or save/browser-profile operations.
  Terra completed launcher change; parent inspected diff, replaced hard-coded
  username with USERPROFILE as a tiny portability correction, reran launcher
  contract and canonical-origin readiness PASS. No origin/profile change.
- Recovery milestone complete: parent inspected helper/persistence/balance diff
  and reran4 meaningful migration tests PASS. Worker reports full domain520 and
  balance27 tests plus three typechecks PASS. Schema8 migration preserves IDs,
  state, one functional waiting anchor/capacity and economy; automatically
  relocates/reconnects, with atomic no-solution failure and idempotent reload.
- Sol recovery_runtime_migration now owns domain navigation parity and idempotent
  rectangular90-to270 normalization using approved proof geometry, with a new
  shared balance contract/generator (no client imports across domain boundary).
  Terra furniture_revision now owns client renderer/actor attachments/Endoscopy
  derived presentation and approved build rotations. Sol room_runtime_map only
  finishes exact asset-contract review corrections before handing off.
- Asset-contract milestone accepted after parent reran25 focused tests and
  both validators: all29 atlas bytes and all16 proof hashes/coordinate/state
  captures PASS. Renderer first draft reviewed against verified cdf baseline;
  parent returned procedural partition ownership, exact shell material/height,
  actor contact registration and legacy imaging-control bypass for correction.
  Terra continues browser/transition QA; Sol room_runtime_map supplies bounded
  read-only exact procedural-source guidance. Domain navigation remains active.
- Parent full player suite480 tests/78 files PASS before final renderer/navigation
  corrections. Boundary verifier PASS. Parent inspected actual browser overview
  and rejected old dark wall textures and overlapping Recovery test placement;
  Terra must replace shell grammar and use a valid6x6 runtime test fixture.
  Subsequent capture startup blocked temporarily by in-progress domain schema
  validation (solid terminal contacts); workers coordinated, no user-save issue.
- Furniture candidate metadata/README now record September24 owner approval;
  historical baseline capture remains intact. No source art or proof HTML changed.
- Renderer review escalation: Terra's initial matrix repeated identical camera
  views and renderer still approximated proof procedures/actor contacts. Sol
  room_runtime_map accepted bounded corrective renderer ownership (FacilityScene
  and new helpers/tests), after exact shell/procedure contract27 tests passed.
  Terra now owns only dedicated browser matrix and occupancy transition tests.
  Parent retains review; no claim of final visual acceptance or push yet.
- Source truth ruling: canonical proof dataset collision declarations override
  inaccurate hand-translated semantic entries. Sol corrected bathroom/waiting
  collision metadata; domain uses declared proof blockers and terminal contacts.
- Parent independently reran focused Endoscopy occupancy tests PASS (5 tests):
  legacy arrival/service-completion boundaries and active reserved visitor
  operation restore the empty table after in-service exit. Full visual helper
  readiness/per-room camera checks still under correction before acceptance.
- Parent reviewed dynamic collision implementation and requested reciprocal-door
  ownership, rotated slots, overlapping-owner safety, and old orientation0 save
  route reconciliation tests (not only Recovery/90-degree saves). Sol domain
  owns these remaining correctness checks; focused20 tests passed beforehand.
- Capture harness issues were test-side: missing opt-in facility-gait-proof,
  tutorial overlays and accumulating clamped camera pan. Parent diagnosed each;
  Terra test-only worker corrects and regenerates real isolated room closeups.
- Parent reviewed all21 freshly cropped room/orientation images after exact
  shell/procedural integration: approved artwork/layouts visually correct.
  Caught remaining duplicate legacy environment water cooler under the approved
  Front Desk cooler; Sol correcting legacy draw bypass while preserving refill
  interaction/labels. Also caught old ratio-based Build door UI filtering new
  approved bays; Sol renderer/domain coordinate approved slot legality.
- Parent full player suite now491 tests/79 files PASS. Remaining browser QA:
  seated actor contacts, Endoscopy occupied/restore, dynamic door/backing and
  Recovery per-bay hiding. Sol owns the interaction test after Terra provided
  only a harness. Terra completed the useful21-room matrix/camera corrections.
- Routing architecture discovery: proof navigation resolves0.04-tile aisles;
  domain is1x1. Removing actual door-threshold exemptions breaks approved and
  legacy doors. Parent directed retaining explicit real-door-only coarse
  exception for compatibility, with no clinical timer/economy changes, while
  Sol renderer investigates localized visual per-segment path refinement around
  proof solids. No claim of perfect visual navigation until observed/validated.

- Follow-up geometry diagnosis: legacy Exam E2 and CT W2/W3 physically intersect
  permanent inflated fixtures; a visual warp cannot fix them. Parent authorized
  deterministic invalid-door relocation/reconnection as necessary approved-room
  compatibility work: retain door/room IDs and network access, use nearest legal
  shared boundary when possible, otherwise free hallway reconnection. Atomic
  migration failure preserves the original save. No clinical timing changes.
  This supersedes unconditional absolute-door preservation; renderer must not
  fabricate safe passage through solids. New Build slots follow validated doors.
- Capacity audit: Front Desk previously has2 waiting anchors, approved art1 chair.
  Preserve2 by explicitly marking a safe standing overflow queue anchor; render
  only the actual visitor-chair occupant seated. Waiting4/Recovery1/others0 stay
  unchanged. No second chair, seated-art resizing or staff-seat repurposing.
- Prepared isolated checkpoint asset payload only (53 files:29 WebPs/provenance
  plus approved furniture proof workspace). Parent scoped extension/privacy
  check and credential-boundary pattern scan PASS; no raw/private inputs copied.
  Initial naive substring scan matched a desk identifier; word-boundary scan
  removed that false positive. No Git staging/commit/push performed yet.
- Parent independently ran approved-room-interactions.spec.ts desktop3/3 PASS
  and visually accepted seated Front Desk with one cooler, Recovery reciprocal
  N3 opening hiding only N3 bed/partitionN, and Endoscopy covered/empty/restored
  0/270. Captures in artifacts/screenshots/approved-room-runtime/interactions.
  Sol source-audits rotated supplemental window owners before renderer closeout.
- Final renderer source audit corrected rotated Phlebotomy/Telehealth physical
  north window ownership and Telehealth per-view plant contacts. Parent reviewed
  explicit per-fixture ownership assertions and independently reran the full
  player suite:496 tests/80 files PASS, player typecheck PASS, both asset/proof
  validators PASS, boundary and launcher contracts PASS. Final browser run:
  5/5 PASS (21-room matrix plus4 live interaction scenarios); fresh Front Desk
  capture visually confirms one approved cooler and revised desk proportions.
- Final save review caught reciprocal door validation that checked only the
  owning room. Sol recovery_runtime_migration is correcting both physical
  thresholds, preserving the nearest valid shared connection before hallway
  detours, and adding hall-owned/clinical-neighbor-owned invalid-door regressions.
  Parent also requested preservation of distinct valid waiting destinations and
  standing/chair kinds on migration rather than collapsing queues to one anchor.
- Parent full domain run exposed13 failures across4 test files: older synthetic
  doorway placements, GLP-1 access, and deterministic patient-supply snapshot
  changes from travel geometry. Worker updates test fixtures/expectations while
  preserving authored service durations, learning and payment assertions.
- Additional save-preservation review requires ordinary Waiting Room standing
  overflow to remain distinct from its4 chair anchors, and completed frozen
  result history to survive demolition of its former destination room. Only
  active travel should require live room references and route reconciliation.

## Validated implementation closeout — September24

- Sol room_runtime_map completed asset extraction, exact per-instance contracts,
  modular renderer, floor/wall/partition fidelity and live interaction tests.
  Sol recovery_runtime_migration completed shared navigation, schema8 geometry,
  door/orientation/active-route migrations and save-preservation regressions.
  Terra furniture_revision completed approved furniture candidates, launcher
  compatibility and the21-view browser matrix; Terra recovery_migration_design
  supplied the bounded migration investigation. Parent reviewed actual diffs,
  source parity and captures, with only tiny launcher/comment integration fixes.
- Final worker full domain535/46 files PASS, balance33/3 files PASS. Parent
  independently ran final player496/80 PASS, balance33 PASS, migration plus
  persistence19 PASS, and full domain534 PASS with one15s concurrent-load
  surgery-center timeout; isolated affected file4/4 PASS in6.61s test time.
  Three package typechecks, production build, asset/proof/navigation validators,
  boundary and launcher checks PASS. Browser5/5 PASS covers all21 views and
  seated/cooler, reciprocal Recovery, rotated ownership and Endoscopy variants.
- Final review also fixed old-save GLP schedule loss from evaluating6x6 Recovery
  before relocation. Raw payout slots/ticks are normalized after geometry;
  schema2 uses its scaled raw values. Historical frozen results are not rewritten.
  Crowded-room standing destinations remain safe and distinct; incoming patients
  target their reserved waiting destination. Front180 normalizes0; unsupported
  Front90/270 and packed no-solution layouts fail atomically with raw data intact.
- Runtime navigation remains an integer grid; explicitly proof-valid sub-tile
  doorway approaches are bounded exceptions. Solid furniture contacts can be
  endpoints but never general transit shortcuts. No economy, workload or clinical
  content changes. Seated source-sprite proportion repair remains deferred.
- Scoped checkpoint assembled separately on codex/gs015-approved-rooms from
  cdf984b. Shared beta/index and unrelated dirty work preserved. Final audit,
  commit/push and remote verification are the only remaining actions.
