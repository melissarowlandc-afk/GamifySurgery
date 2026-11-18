# Room remodeling (2026-11-16)

## Goal and approved scope

Make built rooms movable/rotatable with their idle contents and allow several
transforms to be staged, then committed as one atomic final-layout blueprint.
Staff home-room IDs remain assigned. Only genuine active care/test/service work
blocks transforms. No new costs, durations, closure queues or blocker system.
Existing Build Mode pause, access validation, Undo and save/replay rules remain.

## Ownership and shared tree

Worker owns room-transform reducer helpers/new command and build UI/session
adapters/tests. Do not edit spatial/forecast/scheduling/selectors, clinical
content, or the other worker's gameSession/coordinator/operational engine files
or HIRE_STAFF validation. Preserve the completed continuous-loading and flag
tool/wait-label work. No Git, agents, browser, network/DB, installs or deploys.
Raw preimages are in `.local-dev/room-remodel-20261116/before/`; the final
scoped source hashes are in `final-source-freeze.json` in that artifact folder.

## Evidence and decisions

- Initial reducer move/rotate gate `roomHasActiveCharacterOrRoute` counts home
  assignments, stationary occupants and any intersecting path; those are not
  evidence of active work. Door removal still needs its existing conservative
  guard, so it will retain that helper.
- Use existing displaced-routing/care-aware APIs without changing pathfinding.
  Apply every final room transform before one pass over affected occupants/routes.
- The tester diagnosis proves command-exception misclassification, but does not
  identify a throwing move site. Stale-ID hardening is not claimed as that root fix.
- Blueprint is presentation state until one APPLY_REMODEL_PLAN command; no save
  format changes. Validate both UI preview and commit using the same domain helper.
- Confirmed original gate: `reducer.ts:1231` (including the employee home-room
  check at `:1301`); the move/rotate handlers at `:9567`/`:9648` now use
  `roomHasActiveRemodelWork` (`room-remodel.ts:53`). Door removal alone retains
  the original conservative gate. Final-plan validation is at
  `room-remodel.ts:81`, content/route transformation at `:134`, and the command
  dispatch at `reducer.ts:11171`.

## Milestones and progress

- [x] Read current reducer, routing, build adapters and crash diagnosis.
- [x] Domain validation, carried contents, route repair and atomic command/tests.
- [x] Shared desktop/phone blueprint state, outlines, staging/undo/cancel/apply.
- [x] Crash hardening and component/session regressions.
- [x] Execute focused/domain/full player, Level 5 comparison, seven types and boundaries/build; record remaining failures honestly below.
- [x] Pacing alone last; exact results, browser steps and scoped port manifest.

## Acceptance and validation

New tests: staffed move, translated/rotated occupants, passing-route repair,
active work block, swaps/final overlap rejection, all-or-none, stale IDs and
determinism/replay. Domain known baseline: 27 failures; record exact comparison.
Full player uses CI=true, documented offline preload and --pool=threads.
Level 5 CHECK must remain 35,342 / 6,966,492 / 551 / 0 (no remodel commands).
Run seven workspace types, repository boundaries and player build. Last CPU
validation: pacing alone, reference 26,281 +/-10%. Manager runs Playwright.

## Next action

Implementation and sandbox validation are complete. Manager reviews the scoped
port, resolves the separate catalog/binding issues and reruns the combined tree
quietly after concurrent edits settle, then performs the browser acceptance
below. No rebinding, commit, release or deployment was performed by this worker.

## Implementation and safety review

`room-remodel.ts` separates genuine patient/service reservations and active
diagnostic work from home assignments, waiting occupants and ordinary routes.
MOVE_ROOM and ROTATE_ROOM keep their existing receipts/rejection text. Door
removal retains the old conservative guard. All changed rooms are installed
before occupants are transformed from their ORIGINAL footprints, so a swap
never carries somebody twice. Rotation snaps to a deterministic nearest
navigable tile (distance, y, x), with the existing room anchor fallback.
Translations retain exact already-valid native furniture and family contacts,
including fine-grid coordinates; they must not be quantized to a different
chair or ordinary walking tile.
Room IDs, assignments, learning, frozen cases, money and facility time remain.

Ordinary affected paths use existing displaced/care-aware route helpers;
unreachable support work waits/returns using existing idle, service, optional
retail and amenity handling. Pediatric paired travel uses planPediatricPair.
The reducer's existing reconcileFrozenPatientTravel handles accepted legacy
test itineraries, including disconnected-door waits; no replacement timing or
forecast engine was introduced. Future return legs are repaired as well.

APPLY_REMODEL_PLAN validates all final footprints, bounds, unique/still-existing
room IDs, protected room transforms and active work before cloning/applying.
It records one operation/event and uses the existing committed Build Undo.
The preview returns invalid room IDs; invalid intermediate drafts are editable
but Apply is disabled. Approved furniture orientations are reused unchanged.
In particular, new blueprints reject unsupported 90/180 orientations that the
old load migration would normalize. The old ROTATE_ROOM command semantics are
retained for legacy journal replay; normal UI uses approved blueprint rotations.
No domain/save schema bump or account save-format change was made.

Drafts live only in the paused presentation hook: stage, edit, Undo staged
step, Cancel, Apply. Staged outlines share the existing ghost graphics on both
layouts; no extra full-world render per pointer movement. Desktop/phone room
taps directly edit a blueprint, and phone edits start at the staged position.
Construction tools are set aside until Apply/Cancel, and leaving Build Mode
with a draft produces a visible ordinary rejection. No closure queue, price,
construction clock or detailed blocker UI was added.

Move previews now check final geometry/work/access without cloning a campaign
or running occupant/path transforms on each drag. Apply performs that work once.
The actual reducer still revalidates a plan after any asynchronous rebase.

### Native contacts and route safety

Synthetic probes exposed two details that a walking-tile-only carry misses:
the gym's exact bench contact and the Executive chair slightly north of its
room's tile origin. Translations preserve authored native/support/pediatric
contacts and path knots exactly, including moves toward the origin; otherwise
floating-point subtraction can change a seat identity. Ownership follows the
existing tile-centre convention. Rotations still snap to valid navigable tiles.
The regression table covers every registered Level 5 native contact, pediatric
seats, internal paths, native exits and inspectors; it does not change their
navigation contracts or spatial code.

Affected crossing routes use the existing native entry/exit and displaced
routing APIs. A genuinely missing door yields the existing wait/return behavior;
a regression restores that door with PLACE_DOOR and verifies travel resumes.
The one extra founder retry branch uses a remodel-specific target ID on the
existing return_to_front_desk activity. It preserves ordinary/legacy return
behavior, adds no persisted field, and calls existing routing helpers only.
Service flow and frozen patient travel reconcile after the final geometry.

Active off-site outbound/return legs and terminal diagnostic travel remain
protected even after their chart resolves. An idle origin room can move while
the patient is away; a queued forecast alone does not block it. Tests distinguish
these states from actual active work. No test duration, staffing rule, pathing
rule, random stream, finance or progression behavior was changed.

A final route audit reproduced one legacy retry edge: after a remodel made an
off-site departure unreachable, clearing its current movement left the stale
offsiteTravel cache available to beginPendingResultTravel (`reducer.ts:4947`).
The new regression failed before the fix (1 failed / 28 filtered out). The
remodel helper now invalidates only that undelivered legacy departure cache;
ensureLegacyOffsiteTravel (`reducer.ts:5604`) uses its existing current-layout
retry and minimum-clock rules. The frozen result, service duration, learning,
answers and physical waiting point remain intact. Active diagnostic-plan
handling and already-started return legs are unchanged. The final focused run
passes 3 files / 83 tests (27.10 s). No forecast/spatial helper was edited.

### Crash audit

The supplied diagnosis does not identify the tester's failing command/site.
Existing direct reducers already reject unknown rooms/definitions. Session
handlers now also reject stale rooms/definitions and callbacks after Build Mode
closes, and a move plus approved rotation is one atomic command (rather than
silently ignoring orientation). Malformed, duplicate and stale blueprint entries
are rejected before dereference. An allowlisted remodel source/command tag was
added to commandFailure diagnostics. The other worker's command-containment
files and HIRE_STAFF line were not edited. Do not claim the unknown live TypeError
was reproduced or identified by this work.

### Browser acceptance (manager)

Add `tests/e2e/room-remodel.spec.ts` for desktop-chrome, laptop-chrome,
compact-desktop-chrome and phone-chrome:

1. Use public Level 2/5 QA fixtures; exit/reenter Build Mode, select a staffed
   inactive room, move it. Home ID/occupants/doors follow; one committed Undo
   restores them. Active visit/test/procedure still rejects visibly.
2. Blueprint: stage A over B (red outline/Needs attention/Apply disabled), stage
   B over A (valid outlines/Apply enabled). Saved world/clock/cash unchanged
   until Apply, then one operation carries both; reload retains exact room IDs.
3. Approved rotation plus wing shift; idle founder/patient/parent follow; no
   path crosses the vacated room through grass. Unreachable routes wait/return.
4. Edit a staged row, Undo staged, Cancel, rapid/double Apply, and stale/rebased
   room. No modal/prompt/cost is introduced and no partial layout commits.

Rerun `build-mode-usability.spec.ts`, `management-mode.spec.ts`,
`room-upgrades.spec.ts`, `phone-ui-space.spec.ts`, `ui-density.spec.ts`,
`splitter-map-shade.spec.ts`, plus cloud-saves/cloud-recovery for the new
command's journal/snapshot/undo boundary. Update only the obsolete expectation
that idle occupants prevent moving or that a moving room has no Rotate control.
Retain every access, protected entrance, active-work, saved-byte and fencing
assertion. Physical rendering/touch targets/outline contrast remain browser QA.

### Scoped file inventory

The port manifest gives exact paths, base/post SHA-256 hashes and a hunk patch.
Do not overwrite a different release's complete App/reducer/session files.

| Area | Files (relative to the stated directory) |
| --- | --- |
| `packages/game-domain/src` | `room-remodel.ts` (new), `reducer.ts`, `types.ts`, `index.ts` |
| `packages/game-domain/tests` | `room-remodel.test.ts` (new), `level-five-support.test.ts`, `pediatric-family.test.ts` |
| `apps/player/src/session` | `remodelBlueprint.ts` (new), `useRemodelBlueprint.ts` (new), `roomRemodel.test.tsx` (new), `buildModePresentation.ts`, `usePrototypeSession.ts` |
| `apps/player/src/session/cloud` | `commandFailure.ts`, `commandFailure.test.ts` |
| `apps/player/src/facility` | `FacilityScene.ts`, `types.ts` |
| `apps/player/src` | `App.tsx`, `AppShell.tsx` |
| `apps/player/src/mobile` | `MobileShell.tsx`, `testDom.ts` |
| `apps/player/src/mobile/build` | `MobileBuildCatalog.tsx`, `MobileBuildControls.tsx`, `MobileBuild.test.tsx`, `buildSession.ts`, `buildSession.test.ts`, `sceneBuild.test.ts`, `useMobileBuild.ts` |
| `apps/player/src/ui` | `RemodelControls.tsx` (new), `remodel.css` (new), `BuildPanel.tsx`, `BuildPanel.test.tsx` |
| Documentation | This ExecPlan and an append-only `docs/handoffs/CURRENT_THREAD_HANDOFF.md` block |

### Level 5 bindings

Changed bound inputs: packages/game-domain/src/reducer.ts, types.ts, index.ts;
new import input room-remodel.ts. No CHECK/evidence bindings were edited or
rebound. Manager must collect/review the added source input before release.

## Validation record

All Vitest commands use `CI=true`, `--pool=threads` and the existing sandbox
preload `.local-dev/ios-reload-loop-20261107/validation-preload.cjs`.
Logs, exit receipts and JSON reports are retained under
`.local-dev/room-remodel-20261116/`.

| Check | Exact result |
| --- | --- |
| Domain focused (remodel, facility-management, care-room-access, staff-care-room-access) | 4 files / 46 tests PASS, 11.64 s |
| Domain compatibility focus, before final legacy-cache fix | 3 files / 82 tests PASS, 29.19 s |
| Domain final focus, including fail-before legacy-cache regression | 3 files / 83 tests PASS, 27.10 s |
| Player focused (session, build session, desktop/phone Build, scene, command diagnostics) | 6 files / 80 tests PASS, 18.38 s |
| Full player, first runtime epoch | 484 files / 5,891 tests PASS, 1,103.43 s; `player-full.json` |
| Full domain, before updating obsolete movement expectations | 226 files pass / 6 fail; 6,212 tests pass / 31 fail / 1 skip of 6,244; 724.73 s |
| Full domain, before final legacy-cache fix | 228 files pass / 4 fail; 6,214 tests pass / 29 fail / 1 skip of 6,244; 793.29 s; `domain-full-final.json` |
| Final complete full domain | 228 files pass / 4 fail; 6,215 tests pass / 29 fail / 1 skip of 6,245; 753.64 s; `domain-full-complete.json` |
| Final combined full player | 484 files / 5,891 tests PASS, 1,049.95 s; `player-full-combined.json` |
| Repository boundaries / launcher | PASS: 22,539 tracked paths; launcher protocol 1 |
| Seven workspace typechecks | PASS (root build invokes all seven) |
| First root build / player production build | PASS: 716 modules, 14.53 s |
| Final root build / player production build | PASS: boundaries, all seven types and 719 modules, 13.50 s; `build-combined.log` |
| Historical Level 5 CHECK | FAIL against requested 35,342 / 6,966,492 / 551 / 0: measured shared-tree epoch gives 35,216 / 6,928,382 / 549 / 0 |
| Read-only pre/post-remodel Level 5 comparison | PASS: 41 exact serialized checkpoint hashes plus all final totals; no rebind or shared-file replacement |
| Pacing, alone last | PASS: tick 26,281 / 5,958,386 cents / 440 completions / 0 walkouts; reference 26,281, drift 0%; exit 0 |

The initial full domain run's 31 failures comprise the 27 recorded baseline
failures, the two obsolete movement assertions updated above, and two unrelated
catalog-binding failures (`test-choice-order-inventory.test.ts` and
`topic-runtime-bindings.test.ts`). The latter cover an orphan retained PTLD
choice and batch 8 accepted-record count (8 versus 12). Neither file nor their
clinical inputs was edited in this lane. Final results must preserve this
distinction rather than describing the first full run as green.
The final rerun passes both updated movement tests and every remodel test:
its 29 failures are exactly the 27 recorded failures plus those two catalog
bindings. The final legacy-cache-fix rerun adds its passing regression and has
the same exact 29 failure names. `domain-complete-failures.json` retains all
names/messages; none belongs to a file edited for this milestone.

The historical CHECK assertion remains intact and failed honestly. The measured
numbers match the prior command-containment handoff's recorded shared-tree
result. A separate comparison loads only the captured pre-remodel domain entry,
types and reducer through an in-memory Node source hook, retaining all other
current sources; it compares every serialized checkpoint hash and the final
totals. It cannot approve or replace the manager's historical binding.
The comparison passed with exactly 35,216 / 6,928,382 / 549 / 0 and final state
SHA-256 `b45fc3490a1e2bc63c1d847cb24f260c0cfc12494d69c1e13c994ecadbc4d52e`.
The subsequent legacy-departure fallback is confined to applyRoomRemodel;
the public driver contains zero MOVE_ROOM, ROTATE_ROOM or APPLY_REMODEL_PLAN
commands, so that fallback cannot run in this journey. No binding was changed.

The boundary command uses `boundary-readonly-index.cjs` to supply the stock
verifier with a checksum-verified index inventory without invoking Git or
writing the index. The verifier still scans runtime sources/dependencies and
runs the normal launcher check. `boundary-inventory-receipt.json` records this.

### Concurrent App integration during validation

After the first green full-player/build run, the forecast worker added App
diagnostic-display preference integration. Those unrelated hunks were preserved
and are recorded separately in `concurrent-App-observation.diff`; they must not
be included in the remodel port. The task's validated App postimage has SHA-256
`96c0ccbc3232bbaff6d69fb1dfd10dbc4144ff01455b9c643035d9850e753b69`.
A fresh full-player/build pass completed after the sequential CHECK comparison:
5,891/5,891 player tests and all seven types/boundaries/build pass. App's merged
bytes were stable across that final pipeline. The port uses the three
remodel-only App additions, preserving both previous loading work and the other
lane; it explicitly excludes that lane's preference hunks.

The source epochs also caught six OUTSIDE-lane changes during the final run:

| Concurrent path | Observed change |
| --- | --- |
| `apps/player/src/session/diagnosticDisplayDemand.test.ts` | Added after collection; NOT included in the 484-file player result |
| `packages/game-domain/src/diagnostic-timing.ts` | Modified |
| `packages/game-domain/src/diagnosticCalendarFork.ts` | Added |
| `packages/game-domain/src/diagnosticForecastEvents.ts` | Added |
| `packages/game-domain/src/diagnosticForecastVersions.ts` | Modified |
| `packages/game-domain/src/employee-training.ts` | Modified |

All were preserved, excluded from this port, and left to their owning worker.
The epochs contain 1,979 source/test files at start and 1,982 at end. Exact
before/after hashes are in `final-concurrent-source-changes.json`. Therefore the
reported full results are the recorded collection/source epochs, not a claim
that every latest concurrent byte/test was exercised in a quiet full run.
Manager must rerun the settled integrated tree. No owned remodel source changed
through that final pipeline or pacing. No test/build command ran after pacing.

## Handoff and remaining acceptance

`validation-receipt.json` records the exact outputs and environment. Final
preservation checks find no changes to the six protected concurrent files, all
12 previous flag-tool/wait-label files, or the 38 unowned loading files. The
three intentional loading overlaps are App, FacilityScene and testDom. The
other worker's HIRE_STAFF function body is byte-identical after newline
normalization. `final-preservation-review.json` retains these receipts.

Final commands (reporter/output paths are in the respective logs):

```powershell
$env:CI='true'
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/ios-reload-loop-20261107/validation-preload.cjs'
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GamifySurgery/.local-dev/room-remodel-20261116/domain-full-complete.json
npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GamifySurgery/.local-dev/room-remodel-20261116/player-full-combined.json
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/room-remodel-20261116/boundary-readonly-index.cjs'
npm.cmd run build
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/ios-reload-loop-20261107/validation-preload.cjs'
node tools/qa/content-pacing-check.mjs
```

The scoped port contains 31 source/test paths plus this ExecPlan and one
append-only handoff block. `port-manifest.json` records exact base/task-postimage
SHA-256 hashes, raw preimages/postimages and `port/room-remodel.patch`.
App's current working-tree hash is recorded separately from its remodel-only
postimage so the concurrent preference work cannot accidentally enter this port.

Remaining manager work: browser/physical-phone ghost, touch, Undo and cloud
replay acceptance; quiet combined-tree validation after the other lane settles;
the two catalog failures and historical Level 5 binding review. The tester's
original TypeError site remains unproven; defensive stale/malformed input tests
and the independently reproduced legacy route-cache fix are the precise claims.
There are no new remodel costs/times, closure queues, SQL/RPC changes, save-format
changes, clinical edits or canonical-origin changes. Local working-tree work
only; manager owns integration and the GitHub checkpoint.
