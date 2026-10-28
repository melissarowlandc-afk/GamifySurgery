# Door reachability and rendered openings — 2026-10-28

## Goal and requirements

Reproduce the owner's phone Build Mode report (Waiting Room, vertical Hallway,
Front Desk with sidewalk entrance; Undo (3)); make drawn openings and domain
access agree on desktop/phone, normal/Build Mode and the door tool. Explain the
specific repair in the Finish room access sheet. Existing saves and door records
must survive unchanged; no save-format or clinical-content changes.

## Ownership and constraints

Assigned Codex worker; no agents. Own doors.ts and door/placement tests,
facility door presentation, mobile/build and build view-model logic/tests.
The requested session/buildViewModels.ts does not exist: its implementation
currently lives in session/viewModels.ts, so edits there are limited to build
and door projections. Preserve all unrelated shared-tree edits. Another worker
owns cloud/**, App.tsx, usePrototypeSession.ts, CloudSaveControls and cloud e2e.
No installs, network, browser launch, commits/push/deploy or Level 5 evidence
edits. Manager owns browser/screenshot acceptance and evidence rebind.

## Repository state

- Applicable root AGENTS.md and recent CURRENT_THREAD_HANDOFF.md read.
- Broad pre-existing modified/untracked tree, including facility, doors.ts and
  build-view-model tests. Use before-images and hashes for the scoped audit.
- rg is unavailable; use filesystem enumeration and targeted text searches.
- A read-only `git status --short` was mistakenly run at setup despite the
  brief's no-Git constraint. No Git mutations; no further Git commands.
- Current doors.ts already rejects an interior door with no neighboring room;
  investigate actual render paths rather than assuming the supplied null case
  still exists in this worktree.

## Milestones and acceptance

1. Trace geometry/validation/projection/render/cache/undo/mobile commands. Record
   each divergence and file:line evidence. Reproduce the screenshot-shaped layout
   and retain red regression evidence where an actual defect is found.
2. Fix the bounded presentation/domain defects; share authoritative validation,
   preserve persisted door bytes, and provide actionable wall/room guidance.
3. Focused regression tests; full game-domain; full player using documented
   net-use EPERM preload and --pool=threads; root typecheck (seven workspaces).
   Record exact counts, logs, source diff, exact domain changes and residual risks.
4. Append CURRENT_THREAD_HANDOFF.md and return manager handoff. Local-only
   checkpoint; manager owns reviewed GitHub-backup reminder and browser checks.

## Validation commands

- `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads`
- `$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'`
- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`
- `npm.cmd run typecheck`

## Progress, discoveries and decisions

- Before-images, baseline hashes, actual filesystem diff and logs are retained
  under `.local-dev/door-reachability-20261028/` (no Git diff).
- Red regressions: player **1 file / 3 failed tests** (saved moved doors still
  opened walls in normal and Build; hallway below a room lacked a partition).
  Domain **1 file / 3 failed, 2 passed** (missing actionable guidance; actual
  two-door route already passed). Logs: player-red.log and domain-red.log.
- Implemented authoritative, cached, layout-keyed door projections. All saved
  records remain visible to repair tools; only validated thresholds remove
  source and reciprocal walls. A red X marks invalid records in phone/desktop
  play/Build. Invalid rotated offsets use the same clamped removal target.
- Fixed the omitted hallway-backed north wall, and the unconditional Front
  Desk entrance cutout when no valid entrance is present. Multi-piece hallways
  still share circulation without requiring artificial inter-piece doors.
- Domain access/legality graph is unchanged. Diagnostics now locate invalid
  doors by room, wall and section; unreachable components get an actual legal
  shared-wall suggestion, preferring their entrance-side bottleneck.
- Phone exit guidance explains how to use the named wall section. Existing
  phone preview/commit validation already uses the domain validator and a fresh
  preview at dispatch; no wrong-side/accepted-invalid command was reproduced.
- Focused validation: player **7 files / 100 tests PASS**, 4.98s; domain
  **4 files / 51 tests PASS**, 2.40s. Seven-workspace typecheck initially PASS;
  final full suites and typecheck pending.

## Reproduction and attribution limits

The regression layout uses the anchored 5x4 Front Desk and sidewalk entrance,
the actual Waiting Room footprint to its west, and five touching 1x1 hallway
tiles in between, extending above the rooms. Both real doors make the entire
layout reachable. With only the Waiting Room-to-Hallway door, all hallway tiles
and the Waiting Room are unreachable; their deduplicated display-name issues
match the screenshot's two affected room types. Adding the Front Desk west
door fixes the route. Actual phone session/tool/Undo regression exercises that
repair without changing the Waiting Room door.

The screenshot alone does not expose saved DoorState records, the exact shipped
source version, or the three Undo operations. No affected-device save or live
build was read (network/browser explicitly excluded). Therefore the owner's
specific record-level cause is **unverified**. In the supplied worktree an
orphan interior door is already invalid and produces an additional invalid-door
issue; the screenshot contains only unreachable-room issues. A missing upstream
door, or doors local to a disconnected component, reproduces those symptoms.
The blue vertical strip is the hallway's floor runner, not a doorway record.
Do not claim that a current valid-but-null door or stale Undo was established
on the owner's phone.

## Render/access divergence inventory

All modes use FacilityScene and the shared facility projection; phone adds its
door-section overlay. References below name final code; final line citations
and exact file/hash audit will be added at handoff.

| Case | Finding and disposition |
| --- | --- |
| Valid interior door with null neighbor | Not possible in current doors.ts: no neighbor is invalid. Defensively no opening for a legacy projection with a null neighbor. |
| Saved doors after owner/neighbor move, rotation, sale or Undo | Door records are room-relative; MOVE/ROTATE can leave them invalid. Old renderer cut source walls for every record. Project current validation, close invalid openings on both sides, mark X, preserve records. |
| Wrong neighbor along a shared wall | Door offset determines exactly one outside tile. Both domain and renderer use rotated footprints; authoritative neighbor ID is now checked against that tile. Adjacent offsets into distinct hallway pieces stay distinct. |
| Hallway-owned saved door | Current validator rejects hallway owners; tools add doors from the adjoining clinical room. Previously rendered anyway; now closed/flagged and still removable. |
| Duplicate reciprocal door records | Current validator rejects duplicate physical thresholds. Previously both could look open. Now flagged; removing a redundant record lets the remaining record validate. |
| Invalid offset / furniture / adjacent threshold / outside boundary | Previously raw saved records could cut walls despite failed validation. Now excluded from wall cutouts and marked; tool removal target stays at the marker. |
| Missing/invalid Front Desk entrance | Approved shell skipped south section 3 unconditionally. Now only skips/draws entrance framing for a valid opening. Canonical component shells already used explicit openings. |
| Hallway below room without door | Hall painter computed backed north runs but painted only exposed runs; northern room omitted its backed south wall. False opening reproduced. Paint backed hallway north wall, cutting only explicit validated doors. |
| Touching hallway pieces | Intended automatic graph connection; hall/hall partitions suppressed. Cardinal contact counts, diagonal contact does not. No per-tile doors needed. |
| Door local to unreachable component | Physically valid door counts as a local graph edge, but has no route to the entrance. Preserve its real opening; component guidance points at the missing upstream wall. |
| Door art / decor / blue strip | Corridor runner is tile-local floor art in roomTouchups.ts, rendered by drawTouchupCorridor; it is not a door. Wall bands and low wall faces are not connections. Preserve owner-approved art. |
| Green/red door-tool outlines | Available/blocked wall candidates, not built openings. Phone previews and PLACE_DOOR share validation; fresh check at tap. Existing invalid doors are separately red even when removal is permitted. |
| Stale projection/cache after Undo | Domain cache keys room geometry + doors; shared React/Phaser bridge receives current model; world signature includes rooms/doors. Actual phone repair/Undo passes. Added projected connection/neighbor/reason to world signature and cache key coverage. |
| Embedded default door / placement ghost | New-room view projection uses doorSide:null and explicitly says PLACE DOORS SEPARATELY. Built rooms use explicit getRoomDoorOpenings, not legacy doorSide. Dead historical raster-shell routines are not live call paths. |

## Scope/evidence guard

Current game-domain edits are exactly **src/doors.ts** and new
**tests/door-reachability.test.ts**. The first changes diagnostic strings and
legal-wall repair hints; BFS, hallway contact, validation and save schema are
unchanged. Manager must schedule the Level 5 source-input evidence rebind.
No Level 5 evidence/provenance/fixture was edited by this worker.

The read-only integration-input audit compares raw UTF-8 bytes (preserving
CRLF, as the guard does): **378 bound inputs; exactly one mismatch**, doors.ts.
Expected SHA-256: `15e10458911fbf15360b2e3f88021ec48f815e2653bb9c30d1b0bb7fc82375f0`.
Current SHA-256: `2ae1179bf1a82b0eb35120610895feb0b4347cb33c401e2bcf175242d9b42faa`.
See `.local-dev/door-reachability-20261028/evidence-rebind-needed.json`.

## File:line evidence

- `packages/game-domain/src/doors.ts:207`: hallway-owned door rejection;
  `:300`: an absent adjacent room is invalid (the supplied null/valid candidate
  is not present in this tree); `:456`: cardinal hallway connections; `:487`:
  BFS roots require a protected room and its validated exterior door.
- `packages/game-domain/src/reducer.ts:9642` and `:9725`: move/rotate keep
  persisted door records attached to their owner; geometry is revalidated.
  `:9815`: PLACE_DOOR uses the same validator as previews.
- `apps/player/src/session/buildViewModels.ts:9` and `:23`: current validation
  and resolved destination are projected without deleting saved records.
  `apps/player/src/session/viewModels.ts:2401` integrates this in both shells.
- `apps/player/src/facility/doorPresentation.ts:43`, `:65`, `:86`: slot bounds,
  authoritative destination agreement, then direct/reciprocal cutouts. Compare
  the before-image at `.local-dev/door-reachability-20261028/before/apps/player/src/facility/doorPresentation.ts:77`:
  the original cut the owner wall unconditionally for every persisted record.
- `apps/player/src/facility/FacilityScene.ts:2022` and `:2043`: backed hallway
  north partitions; `:3785`: every live shell's shared opening helper; `:3805`:
  shared marker/removal geometry; `:3911`: invalid-door red X in all modes.
  The two formerly unconditional Front Desk south-slot skips now check for an
  actual opening (search `offset === 2` in the same file).
- `apps/player/src/mobile/build/doorSections.ts:13`, `:22`, `:33`: preserve the
  actual owning room/side of existing doors and mark invalid thresholds;
  `buildSession.ts:71`: domain preview; `useMobileBuild.ts:66` and `:69`: fresh
  preview at tap, then dispatch the unchanged owning-room/side/offset request.
- `apps/player/src/facility/roomTouchups.ts:920`: the blue/other palette runner
  is tile-local corridor floor artwork, not a door or a graph edge.
- `packages/game-domain/src/facility-access-cache.ts:16`:
  geometry/door-dependent cache; `apps/player/src/session/usePrototypeSession.ts:843`
  and `:853`: Undo restores the whole prior state; `FacilityCanvas.tsx:132`
  updates the bridge every render; `facilityWorldSignature.ts:27` now includes
  projected door validity and destination. Actual phone Undo regression passes.
- `packages/game-domain/src/doors.ts:328`, `:335`, `:426`, `:528`: wall/section
  location, entrance-side repair hints, invalid-door diagnosis, unreachable-room
  instructions. `apps/player/src/mobile/build/MobileBuildControls.tsx:52`
  displays them in Finish room access with Doors-tool instructions.

## Validation notes

Final focused player: **7 files / 107 tests PASS**, 12.03s (one worker while the
domain run continued). Final focused domain: **4 files / 52 tests PASS**, 3.88s.
Final root typecheck: **all seven workspaces PASS**, exit 0, 6.52s. No test
deadline or configuration file was changed.

The first full domain run (overlapped with a full player run) completed at
**163 files; 4,306 passed / 5 failed = 4,311 tests**, 501.87s, exit 1. One failure
is the expected source evidence binding. Four are existing simulation timeout
cases: integration-running (30s), lower retry (300s), garden-before-offsite live
and legacy reload (5s each). The overlapping player run showed a 5s periop-nurse
simulation timeout and was interrupted through its own execution session before
completion; no full-player count/PASS is claimed for that attempt. A final full
domain run then completed without another full suite in this worker: **163
files; 161 passed / 2 failed; 4,307 passed / 5 failed = 4,312 tests**, 435.83s,
exit 1. It has the same one evidence binding failure and four simulation
timeouts. The final domain test source includes the diagonal-only hallway case.

Isolated domain rerun with one worker: **2 files / 12 tests PASS**, 9.43s,
including all six door regressions and all six garden cases. This resolves the
two garden timeout cases under reduced concurrency, without changing code,
deadlines or assertions. Selected integration rerun with one worker: **1 passed,
1 failed, 34 unselected/skipped**, 334.68s. The integration-running save/reload
case passes. The lower-retry case still exceeds its unchanged 300,000 ms budget
(304,861 ms observed). **Unresolved timing risk**, not established as pre-existing
or caused by this patch; no before-code long-run comparison was performed and
no assertion/deadline was weakened. Manager should investigate/profile or rerun
in its acceptance environment. Log: domain-integration-isolated.log.

Full player with the documented net-use EPERM preload and --pool=threads:
**289 files; 287 passed / 2 failed; 2,906 passed / 13 failed = 2,919 tests**,
192.20s, exit 1. All owned-lane tests pass. Twelve failures are the sign-in text
assertions in `App.cloudAccess.test.tsx`: the concurrently changed
`session/cloud/CloudAccount.tsx:233` contains U+00E2 U+20AC U+00A6 instead of
U+2026. It is outside this worker's lane and was not edited. See
`sign-in-text-evidence.json` and the full log. The thirteenth is the unchanged
5-second Level-3 periop-nurse simulation test. Its isolated rerun is **1 file /
3 tests PASS**, 10.64s, with one worker and unchanged deadlines/assertions.

All **1,266 source/test input hashes** captured at full-player start still
matched at completion (including the concurrent lane's then-current version).
Start/end snapshots match; this remains a shared-tree check with the cloud lane
in progress. `App.tsx` and cloud modules changed since this worker's initial
baseline, before the run.
See `shared-tree-validation.json`; no owned source changed during the run.

The cloud worker's changes since this worker's initial baseline are recorded
separately in audit.json; this worker has not modified them. Manager acceptance
must rerun against the final integrated source after that lane is complete.

## Authored files

New code/tests:

- `apps/player/src/session/buildViewModels.ts`
- `apps/player/src/facility/doorReachability.test.ts`
- `packages/game-domain/tests/door-reachability.test.ts`

Modified code/tests (preserving prior shared-tree changes):

- `packages/game-domain/src/doors.ts`
- `apps/player/src/session/viewModels.ts` (one import and door projection only)
- `apps/player/src/facility/FacilityScene.ts`
- `apps/player/src/facility/doorPresentation.ts`
- `apps/player/src/facility/doorPresentation.test.ts`
- `apps/player/src/facility/facilityWorldSignature.ts`
- `apps/player/src/facility/facilityWorldSignature.test.ts`
- `apps/player/src/facility/types.ts`
- `apps/player/src/mobile/build/doorSections.ts`
- `apps/player/src/mobile/build/types.ts`
- `apps/player/src/mobile/build/MobileBuildControls.tsx`
- `apps/player/src/mobile/build/MobileBuild.test.tsx`
- `apps/player/src/mobile/build/buildSession.test.ts`

Documentation: this new ExecPlan and an append-only CURRENT_THREAD_HANDOFF.md
entry at completion. Local before-images, diff, manifests, audit and logs are
excluded development evidence under `.local-dev/door-reachability-20261028/`.

## Manager acceptance / remaining work

- Review actual before/after diff and the above scope; preserve the concurrent
  cloud lane. Domain rule/graph was not relaxed and all door bytes survive reload.
- Rebind Level 5 evidence for the exactly listed domain edits, then rerun its
  guard. No evidence update or green full-domain claim is made by this worker.
- Investigate the lower-retry integration timeout; the other three domain
  timeout cases pass with one worker. Preserve all current assertions/deadlines.
- Resolve the separate cloud sign-in text failures through that lane's owner,
  then rerun full player and seven-workspace typecheck on integrated source.
- Rerun browser/screenshots on phone and desktop, normal/Build/Doors: screenshot
  core layout with Examination/Bathroom neighbors; missing upstream Front Desk
  west door; valid reciprocal cutouts; missing hallway-backed north wall;
  room/neighbor move, rotation, and three-action Undo; red X visibility and tap
  target; long Finish room access content at narrow heights/safe areas.
- Inspect the affected campaign/version if exact live incident attribution is
  required. The screenshot does not reveal its saved door records. Do not reset,
  reinstall or clear storage to inspect it.
- Local-only checkpoint. No commits, push, install, network, browser, deployment,
  external messages or agents. The initial read-only Git status mistake is
  explicitly recorded above; no later Git calls. Manager owns acceptance and
  the audited **"push to GitHub"** backup checkpoint/reminder.
- Opening pathways are unchanged: START_GAME.cmd -> exact
  `http://127.0.0.1:4173` in the intended persistent profile, and hosted
  `https://melissarowlandc-afk.github.io/GamifySurgery/` with separate storage.

## Next action

Implementation, scoped review, sandbox validation and this worker's handoff are
complete. Manager owns the acceptance items above, source evidence rebind,
integrated reruns and browser/screenshots. Full suites are explicitly not green.
