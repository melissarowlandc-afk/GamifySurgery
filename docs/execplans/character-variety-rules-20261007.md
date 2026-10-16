# Character variety rules — 2026-10-07

Manager revision below supersedes the original implementation and handoff, which were not accepted. The earlier sections remain as an audit trail.


## Goal and assignment

Implement the Claude Code GamifySurgery manager's bounded Sol worker task: new
patient-like actors avoid an occupied design whenever another acceptable adult
design exists, favor less recently used designs, and verify staff uniqueness.
Existing actors retain their saved looks. Keep all choices deterministic.

## Scope, repository state, and constraints

- Owned lane: precise appearance selection logic in
  `packages/game-domain/src/appearance.ts`, a catalog helper only if needed,
  `packages/game-domain/tests/character-variety.test.ts`, and legitimate
  appearance/rotation expectation changes. The existing catalog's three
  appearance-rotation assertions also require updates because they explicitly
  expected a duplicate immediately after exact-band exhaustion. This document
  is the worker handoff.
- The working tree contains extensive concurrent work, including substantial
  existing changes in `appearance.ts`. Preserve it byte for byte outside the
  precise selection regions. A concurrent worker owns gs028/patient-supply tests.
- No schema, art, balance, dependency, clinical-content, Git mutation, external
  message, release, deployment, or browser/storage changes. No sub-agents.
- No clinical material is authored or approved by this task. Frozen profiles,
  concept IDs, encounters, and clinical data must remain intact.
- Pre-edit source snapshots and complete command logs are under ignored
  `artifacts/logs/character-variety-20261007/`.

## Decisions and discoveries

- New selections: unoccupied exact age band; then unoccupied same-sex adult
  bands in increasing band distance, grouping equally near bands; only after
  the same-sex adult pool is occupied, choose the least recently used acceptable
  design. Never-used entries win LRU ties; the existing seeded stream breaks
  equal-recency ties. Pediatric/future-only/inactive art stays ineligible.
- `selectPatientStillId` and roster identity normalization must retain valid
  same-sex adult saved stills selected from a fallback age band. They must still
  reject sex-incompatible/pediatric selection and preserve unknown future saved
  IDs according to existing compatibility behavior.
- Existing `selectStaffStillId` already excludes occupied staff designs,
  including an explicitly supplied current ID, and returns `undefined` when
  its role pool is exhausted. `HIRE_STAFF` reserves all current and departing
  employee stills and rejects exhaustion before charging cash.
- Recency can merge retained encounter/retired-encounter history, visitor
  operations, retail external actors, and current pedestrians using existing
  timestamps and stable actor IDs. Visitor creation is timestamped; shoppers
  and pedestrians have only a last-movement timestamp. No save additions are
  needed for this retained-record recency.
- Limitation: exited pedestrians are deleted, and finished visitor/retail
  history is eventually pruned without retaining their designs. Complete
  lifetime recency for those deleted records cannot be recovered by selection
  functions; no schema or retention changes will be made. Manager review must
  distinguish retained-record recency from lifetime cross-actor history.

## Milestones and acceptance

1. Capture the full game-domain suite and root typecheck before source edits.
2. Implement exact-band-first nearest-band fallback and retained-actor recency;
   preserve selected looks across save normalization.
3. Focused simulations for both sexes/band boundaries and pool exhaustion,
   recency across actor kinds, deterministic reloads, clinically frozen profiles,
   and every staff role's uniqueness/exhaustion.
4. Run the full game-domain suite and root typecheck; attribute every failure
   against baseline and concurrent gs028/patient-supply changes. Inspect the
   actual scoped delta against the byte snapshots.
5. Append the final handoff with files, selection order, staff pool/capacity
   table, exact commands/output, remaining limitations, and manager next action.

## Validation commands

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
```

Focused test command will include the new variety tests, existing appearance
and rotation tests, employee uniqueness, and character-still persistence tests,
with the same thread pool/worker limit.

## Progress

- Inspected applicable repository instructions and current handoff.
- Captured pre-edit source snapshots. Full baseline: exit 1, `6 failed | 89
  passed (95)` test files and `8 failed | 3098 passed (3106)` tests; duration
  `321.26s`. Exact output: `artifacts/logs/character-variety-20261007/baseline-game-domain.log`.
- Baseline `npm.cmd run typecheck`: exit 0; all seven workspace typechecks passed.
- Applied precise selection-region edits; no catalog or staff selector edits.
  Added 29 focused variety tests and updated only the old exact-band exhaustion
  expectation to require exhaustion of the entire same-sex adult pool.
- Focused validation: `5 passed (5)` files, `60 passed (60)` tests, exit 0;
  duration `3.92s`. Root typecheck subsequently passed, exit 0. An intermediate
  new-test type error (`maximumInstances` can be null) was corrected by omitting
  rooms without a configured finite maximum from the capacity simulation.
- Inspected unified deltas and reverse-reconstructed the exact baseline bytes:
  all unrelated bytes and CRLF line endings in `appearance.ts` and the rotation
  test are preserved. Catalog and existing `appearance.test.ts` remain byte-exact.
- Read-only runtime catalog/config audit confirmed the following tables. Final
  validation and per-failure attribution are recorded in the handoff below.
- First full post-edit run: `3 failed | 93 passed (96)` files, `6 failed | 3129
  passed (3135)` tests, exit 1, duration `446.35s`. Two busy-reading failures
  matched baseline; six other baseline failures cleared during concurrent work.
  Four task-related failures were corrected: three obsolete exact-band duplicate
  expectations in catalog appearance tests, plus eager access to a missing
  `waiting` timestamp in an incomplete legacy fixture. The selector now treats
  missing encounter arrival as the oldest unknown tick; records without a look
  are still omitted from recency. No schema or unrelated test changes.
- Final focused run, now including catalog and Level 2 persistence:
  `7 passed (7)` files, `77 passed (77)` tests, exit 0, duration `5.57s`.
  Root typecheck rerun: exit 0. The corrected bytes were used for the final full
  suite, whose completed result is recorded below.
- Final scope review: `appearance.ts` +62/-32 lines, rotation test +1/-2,
  catalog appearance tests +10/-4; reverse-applied receipts reconstruct original
  files exactly. Catalog production data and original `appearance.test.ts` are
  untouched. New tests are 29 cases. No change to staff selectors, schemas,
  clinical data, art, balance, or saves.
- During the last full run, unrelated reading-upgrade tests expanded from 70 to
  89 and produced three new failures. An isolated original-appearance control
  was created under ignored logs; its selector source is the exact original
  SHA256 `ec439709c4ef79ab2de222a8754e64d17cb13699229d6754cccda94eb024d0e9`,
  with imports relocated and a load marker only. No production source was
  swapped. After concurrent fixes, the three reading tests passed with both
  original and current appearance modules. Both busy-reading CT tests still
  failed identically in both controls (queue 0, expected positive).
- The parallel attribution commands each ran the same five named scenarios:
  `1 failed | 1 passed (2)` files, `2 failed | 3 passed | 452 skipped (457)`
  tests, exit 1. Original-control duration `3.71s`; current duration `3.74s`.
  Detailed receipts: `baseline-appearance-control-attribution.log` and
  `current-appearance-attribution.log` under the task log directory. A first
  control-config startup failed with sandbox `spawn EPERM`; using a plain
  import-free config resolved it, with no sandbox escalation or installs.

## Patient map simulation evidence

Each sex was simulated separately at ages 24/38/54/70, covering all four target
bands. Every simulation filled the entire same-sex adult pool without any
duplicate, enforced nondecreasing distance from the preferred band, paired the
saved roster identity with the chosen still's visual sex/band, and then selected
the global LRU still on unavoidable exhaustion. Freeing just the most distant
actor also caused that sole free design to win over occupied exact-band looks.

| Sex | Young adult | Adult | Middle aged | Older adult | Unique actors before duplicate |
| --- | ---: | ---: | ---: | ---: | ---: |
| Female | 9 | 21 | 22 | 13 | 65 |
| Male | 9 | 15 | 19 | 12 | 55 |

## Staff pool versus capacity

`maximumEmployees` is the existing balance role field. Actual hiring uses
`getRoomStaffCapacity`, whose per-room slots multiplied by balance-config
`maximumInstances` yield the final column. Those fields are not interchangeable.
Read-only audit receipt: `artifacts/logs/character-variety-20261007/pool-capacity-audit.json`.

| Role | Eligible looks | Balance maximumEmployees | Maximum built-room capacity |
| --- | ---: | ---: | ---: |
| Receptionist | 4 | 1 | 1 |
| Imaging Technician | 3 | 3 | 3 |
| Peri-op Nurse | 7 | 2 | 6 |
| Endoscopy Nurse | 6 | 2 | 5 |
| Endoscopist | 5 | 2 | 5 |
| Phlebotomist | 3 | 2 | 3 |
| EVS Worker | 10 | 2 | 10 |
| GLP-1 NP | 10 | 10 | 10 |
| Laboratory Technician | 2 | 2 | 2 |
| Surgeon | 2 | 2 | 2 |
| OR Nurse | 2 | 2 | 2 |
| Pharmacist | 2 | 2 | 2 |
| Repair Person | 2 | 2 | 1 |
| Radiologist | 16 | 4 | 16 |

All 68 maximum room slots can be assigned globally distinct designs in both
forward and reversed role order. Peri-op and endoscopy pools share one foundation
nurse still, and the occupied set is global. Every role's entire art pool was
exhausted with mixed current/departing reservations; selection returned
`undefined`, including when a requested saved ID was itself occupied. Freeing
one departing look returned that exact design. Existing hiring integration tests
verify rejection text and unchanged cash, followed by a successful freed-look
hire. No staff implementation, art, capacity, or balance changes were needed.

## Baseline failure inventory

All failures below were present before implementation:

1. `diagnostic-orders.test.ts:212`: serial/concurrent radiologist reads — two
   staffed positions expected; only `northwest` used (set size 1 instead of 2).
2. `diagnostic-timing.test.ts:91`: installed interpretation while a radiologist
   trains — `external` instead of expected `local`.
3. `employee-training-benefits.test.ts:500`: paused reading processing —
   `external` instead of expected `local`.
4. `employee-training-benefits.test.ts:520`: retained paused reading processing —
   diagnostic processing operation ID is null instead of non-null.
5. `gs028-20261007-variety2-batch.test.ts:426`: persistent-solid CT pair with
   busy reading — queue minutes 0 instead of positive.
6. Same file/line: cystic-is-not-benign CT pair with busy reading — queue minutes
   0 instead of positive.
7. `gs028-statistics-ethics-batch.test.ts:195`: active release has 351 concepts
   instead of expected 331.
8. `room-upgrade-reading.test.ts:144`: alternate-room quote duration 4.5 instead
   of expected 3.

## Sol worker handoff

Implementation, focused validation, full-suite comparison, root typecheck, and
scope review are complete. All task-related checks pass. Integrated acceptance
remains with the manager; two baseline CT queue failures remain outside this lane.

### Files changed

- `packages/game-domain/src/appearance.ts`: retained-actor recency; nearest
  same-sex adult band fallback; global adult-pool LRU on unavoidable exhaustion;
  saved fallback still/roster preservation; missing legacy arrival guard.
- `packages/game-domain/tests/character-variety.test.ts`: new, 29 tests covering
  eight full-pool map simulations, nearby-band recency, sex/child exclusions,
  all retained actor kinds, deterministic tie ordering, frozen-profile reload,
  every staff role's exhaustion, and 68 globally unique maximum room slots.
- `packages/game-domain/tests/patient-appearance-rotation.test.ts`: exact edit
  changing exhaustion coverage from one age band to the full same-sex pool.
- `packages/game-domain/src/characterStillCatalog.test.ts`: three appearance
  selection assertions now require a fresh design after exact-band exhaustion;
  all cohort membership, preservation, art registration, and other checks remain.
- `docs/execplans/character-variety-rules-20261007.md`: task record and handoff.

`characterStillCatalog.ts`, staff selection implementation, art, balance, clinical
content, save schemas, existing actors, and browser storage were not modified.
The scoped byte/diff receipt is `artifacts/logs/character-variety-20261007/scope-verification.json`.

### New selection order

1. Free active adult designs in the exact frozen-profile age band.
2. If exhausted, free active adult designs of the same specified sex at the
   nearest band distance; equally near younger/older bands share one pool.
   Continue to farther adult bands only when every nearer band is occupied.
3. Within the selected free pool, never-used designs precede LRU designs; equal
   recency uses the existing seeded appearance stream/key.
4. Only after every acceptable same-sex adult design is on-map, select the
   global LRU design from that pool, with deterministic ties. An unspecified
   sex retains the existing ability to choose either compatible civilian sex.

Frozen demographics are unchanged. No adult design is newly selected for a
child, and inactive staff/future-only pediatric art cannot enter this pool.
Compatible saved adjacent-band looks and roster identities now survive reload.

### Recency boundary and outstanding interpretation

Recency includes retained encounters and retired encounter still uses, visitor
operations (including finished visitors), retail external actors (including
departed shoppers and companions), and current pedestrians. Visitor creation
ticks and retail/pedestrian last-movement ticks supply existing deterministic
ordering; no save field or side-effect cache was added.

Exited pedestrians and pruned external records have lost their look information.
The implementation stops at this existing-state boundary. If the manager
requires complete lifetime recency for those deleted actors, that stronger
requirement remains open and needs a separately authorized persisted-history or
retention design; it cannot be honestly claimed by this selection-only lane.

### Staff conclusion

The table above gives every role's art pool, balance role maximum, and actual
maximum built-room capacity. Current and departing designs are reserved
globally. Exhaustion returns no still; hiring rejects with
`No unused {Role} character design is available yet.` before charging cash.
After a departing actor clears the map, its freed look can be hired again.
No staff changes were needed. All 68 maximum room slots passed global uniqueness
in forward/reversed role order, including the one shared foundation nurse look.

### Exact validation output and attribution

Baseline and final full suite used the same command:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
```

Baseline (exit 1, before implementation):

```text
 Test Files  6 failed | 89 passed (95)
      Tests  8 failed | 3098 passed (3106)
   Start at  21:51:07
   Duration  321.26s (transform 2.55s, setup 0ms, import 32.92s, tests 281.17s, environment 5ms)
```

Final full run (exit 1, all task-related checks passing):

```text
 Test Files  2 failed | 94 passed (96)
      Tests  5 failed | 3149 passed (3154)
   Start at  22:11:36
   Duration  473.80s (transform 2.92s, setup 0ms, import 48.57s, tests 414.88s, environment 7ms)
```

The +48 test difference is 29 new variety cases plus a concurrent net increase
of 19 reading-upgrade tests. The final full run observed two unchanged baseline CT
failures and three concurrently developed reading failures. The latter three
subsequently passed in matched original/current appearance control runs. This
is not a claim that a subsequent whole-suite run was green.

| Failure | Before edits | Final full run / follow-up attribution |
| --- | --- | --- |
| Diagnostic serial/concurrent read positions | Failed, 1 position instead of 2 | Cleared in concurrent work; final suite passed |
| Installed interpretation during radiologist training | Failed, external instead of local | Cleared in concurrent work; final suite passed |
| Paused reading queue remains local | Failed, external instead of local | Cleared in concurrent work; final suite passed |
| Paused reading processing reservation survives | Failed, null job ID | Cleared in concurrent work; final suite passed |
| GS028 persistent-solid busy-reading CT pair | Failed, queue 0 instead of positive | Still fails; identical with original and current appearance modules |
| GS028 cystic-is-not-benign busy-reading CT pair | Failed, queue 0 instead of positive | Still fails; identical with original and current appearance modules |
| Statistics/ethics active-release counts | Failed, 351 concepts instead of 331 | Cleared by concurrent work; final suite passed |
| Accepted alternate reading-room quote | Failed, 4.5 instead of 3 minutes | Cleared in concurrent work; final suite passed |
| Projected seat claims / training departures | No baseline failure; reading file grew from 70 to 89 tests | Final full run failed (start 60.5/end 65 instead of 56/60.5); later passed in both controls |
| Future alternate-room training departure | No baseline failure | Final full run failed (80/84.5 instead of 9/12); later passed in both controls |
| Terminal-image forecast replay | No baseline failure | Final full run failed (105/109.5 instead of 91/95.5); reproduced once with original appearance, then passed in both controls after concurrent fixes |

The isolated control used only the original appearance snapshot under ignored
logs, with import relocation/load instrumentation. It did not replace production
files or change another worker's lane. Its successful load is recorded with the
original SHA256. Each matched attribution run executed five named scenarios:

```text
 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 3 passed | 452 skipped (457)
```

Exact targeted command (current appearance; the original control adds
`--config ../../artifacts/logs/character-variety-20261007/baseline-appearance-control.config.mjs`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/room-upgrade-reading.test.ts tests/gs028-20261007-variety2-batch.test.ts --testNamePattern 'retains projected seat claims|quotes an accepted alternate copy|replays all new terminal image components|paired-persistent-solid with busy_reading|paired-cystic-is-not-benign with busy_reading' --pool=threads --maxWorkers=1
```

Final focused command (exit 0):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/character-variety.test.ts tests/patient-appearance-rotation.test.ts src/appearance.test.ts src/characterStillCatalog.test.ts tests/employee-still-uniqueness.test.ts tests/character-still-persistence.test.ts tests/level-two-persistence.test.ts --pool=threads --maxWorkers=1
```

```text
 Test Files  7 passed (7)
      Tests  77 passed (77)
   Start at  22:11:15
   Duration  5.57s (transform 1.89s, setup 0ms, import 4.39s, tests 514ms, environment 0ms)
```

Final root typecheck after the concurrent reading fixes (exit 0):

```powershell
npm.cmd run typecheck
```

All seven workspaces passed: clinical-context-workbench, player, balance-config,
clinical-authoring, clinical-content, clinical-research, and game-domain.

Full, unabridged stdout/stderr and exit codes are under
`artifacts/logs/character-variety-20261007/`: `baseline-game-domain.log`,
`post-game-domain.log`, `final-game-domain.log`, `final-focused-game-domain.log`,
`handoff-typecheck.log`, both `*-appearance-*-attribution.log` receipts, scoped
diffs/byte verification, and `validation-attribution.json`. The final byte scope
check still reverse-reconstructed each assigned pre-edit snapshot exactly.

### Manager next action

Review the actual scoped source/test diff and the retained-history limitation,
then accept this worker milestone or request a separate history design. The
manager owns unrelated reading/queue failures and integrated/browser acceptance.
This checkpoint remains local: no commit, push, merge, deployment, release,
installation, or external message was performed. After acceptance, remind the
owner to say **"push to GitHub"** for the manager's audited backup checkpoint.
The global `CURRENT_THREAD_HANDOFF.md` remains manager-owned and was not edited.
Owner opening pathway is unchanged: `START_GAME.cmd` →
`http://127.0.0.1:4173`, same persistent browser profile and saves.

## Manager revision - 2026-10-07 (authoritative handoff)

### Owner decision and final behavior

The manager reported the later owner decision: "I am okay with duplicates when
necessary. I think that it is okay if the recently seen history only counts
patients." The shown age and sex must stay compatible with the chosen design;
adjacent-band borrowing is unacceptable. This revision supersedes all earlier
adjacent-band selection, saved-look preservation, and external-recency claims.

The final selection order is the original implementation:

1. Restrict candidates to the exact profile age band and compatible specified
   sex using `patientStillEligibleEntries(profile.sexLabel, profile.ageYears)`.
2. Use unoccupied candidates from that band whenever one is available.
3. Within that pool, never-used patient looks precede the least recently used
   patient look; the latest occurrence of a repeated patient look defines its
   recency. The existing seeded appearance stream and selection key break ties.
4. If the exact band is fully occupied, choose the least recently used look
   from that same band, with the same never-used priority and seeded ties.
   A duplicate is correct even when other age bands have free designs.

On-map reservations still include patient encounters, visitors, retail actors,
and ambient pedestrians. Recency is exactly the original encounter plus
`retiredEncounterSummary.recentStillUses` logic. No visitor recency was needed
by a pre-existing test. Existing saved-look selection and normalization are
restored without the adjacent-band compatibility exceptions. Adult, sex,
inactive-art, clinical-profile, save-schema, and seeded-stream behavior is
unchanged from the pre-edit source.

### Final file scope

- `packages/game-domain/src/appearance.ts`: all worker production edits reverted;
  byte-for-byte identical to `appearance.before.ts`, SHA256
  `ec439709c4ef79ab2de222a8754e64d17cb13699229d6754cccda94eb024d0e9`.
- `packages/game-domain/tests/patient-appearance-rotation.test.ts`: restored
  byte-for-byte to its initial snapshot; the original exact-band exhaustion
  expectation remains correct.
- `packages/game-domain/src/characterStillCatalog.test.ts`: restored byte-for-byte
  to its initial snapshot. The original GS-033 roster/cohort tests, including
  four GS-033 patient reachability and exact-band LRU exhaustion, remain intact.
  None of this worker's catalog expectation changes was independent of the
  rejected adjacent-band feature, so none was retained.
- `packages/game-domain/tests/character-variety.test.ts`: reduced from 29 to 25
  cases (212 lines). Eight simulations cover Female/Male at ages 24/38/54/70,
  fill the exact band plus two patients, verify sex/band/roster consistency,
  require unique designs until the band is full, then assert LRU duplicates
  while adjacent bands remain free. Other cases cover unoccupied/never-used/
  latest-use priority, all 14 staff role pools with mixed current/departing
  reservations, maximum room capacity in both role orders, and an actual
  exhausted hire rejecting before either cash representation changes.
- `docs/execplans/character-variety-rules-20261007.md`: appended this revision
  and marked the earlier handoff superseded.

Net worker changes from the initial snapshots are only the new reduced test
file and this task document. Catalog production data and existing
`appearance.test.ts` also remain byte-identical to their initial snapshots.
No independent roster correction was made or retained by this worker; pre-existing
GS-033 work was preserved. No staff implementation, clinical content, art,
balance, schema, dependency, global handoff, Git, or browser changes were made.

Exact restoration receipts, byte checks, and the reduced-test diff are under
`artifacts/logs/character-variety-20261007/`:
`revision-restoration.json`, `revision-scope-verification.json`, and
`revision-character-variety.diff`. The original rejected versions are retained
there as `revision-before-*` snapshots.

### Exact-band map simulation evidence

The passing simulations keep every actor on the map and add two patients beyond
each exact pool's size. All other adult age bands remain unoccupied. The first
repeat is the oldest patient design, followed by the next-oldest design.

| Sex | Age / exact band | Exact-band designs | Simulated patients | Distinct looks |
| --- | --- | ---: | ---: | ---: |
| Female | 24 / young_adult | 9 | 11 | 9 |
| Female | 38 / adult | 21 | 23 | 21 |
| Female | 54 / middle_aged | 22 | 24 | 22 |
| Female | 70 / older_adult | 13 | 15 | 13 |
| Male | 24 / young_adult | 9 | 11 | 9 |
| Male | 38 / adult | 15 | 17 | 15 |
| Male | 54 / middle_aged | 19 | 21 | 19 |
| Male | 70 / older_adult | 12 | 14 | 12 |

### Staff pool and capacity (unchanged)

The balance role maximum is distinct from actual built-room capacity, which
runtime hiring obtains from `getRoomStaffCapacity`.

| Role | Eligible looks | Balance maximumEmployees | Maximum built-room capacity |
| --- | ---: | ---: | ---: |
| Receptionist | 4 | 1 | 1 |
| Imaging Technician | 3 | 3 | 3 |
| Peri-op Nurse | 7 | 2 | 6 |
| Endoscopy Nurse | 6 | 2 | 5 |
| Endoscopist | 5 | 2 | 5 |
| Phlebotomist | 3 | 2 | 3 |
| EVS Worker | 10 | 2 | 10 |
| GLP-1 NP | 10 | 10 | 10 |
| Laboratory Technician | 2 | 2 | 2 |
| Surgeon | 2 | 2 | 2 |
| OR Nurse | 2 | 2 | 2 |
| Pharmacist | 2 | 2 | 2 |
| Repair Person | 2 | 2 | 1 |
| Radiologist | 16 | 4 | 16 |

Current and departing employees reserve their stills globally, including the
shared foundation nurse look across two role pools. All 68 maximum built-room
slots have distinct designs in both role orders. A fully reserved role pool
returns `undefined`; `HIRE_STAFF` rejects with
`No unused {Role} character design is available yet.` before charging. It never
substitutes a staff duplicate. A departing actor's look can be reused after it
is released from the departing roster. Existing save normalization is unchanged.

### Revision validation (complete)

Focused validation passed (73 tests), and the full suite completed with eight
failures outside this lane. Root typecheck passed both before the full run and
again afterward because other tests changed during it. Test commands use
`--pool=threads --maxWorkers=1`; those Vitest flags do not apply to the TypeScript
typecheck command. No appearance/staff checks failed.

Focused command (exit 0):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/character-variety.test.ts tests/patient-appearance-rotation.test.ts src/appearance.test.ts src/characterStillCatalog.test.ts tests/employee-still-uniqueness.test.ts tests/character-still-persistence.test.ts tests/level-two-persistence.test.ts --pool=threads --maxWorkers=1
```

```text
 Test Files  7 passed (7)
      Tests  73 passed (73)
   Start at  22:33:00
   Duration  6.00s (transform 1.98s, setup 0ms, import 4.72s, tests 546ms, environment 0ms)
```

Root typecheck (exit 0):

```powershell
npm.cmd run typecheck
```

All seven workspace typechecks passed. Exact stdout/stderr is preserved in
`revision-typecheck.log`; focused output is in `revision-focused-game-domain.log`,
with corresponding `.exit.txt` receipts.

Full suite command (exit 1, no tests excluded):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
```

Exact final summary:

```text
 Test Files  2 failed | 94 passed (96)
      Tests  8 failed | 3149 passed (3157)
   Start at  22:33:11
   Duration  462.04s (transform 2.49s, setup 0ms, import 41.86s, tests 410.56s, environment 6ms)
```

The original baseline was `6 failed | 89 passed (95)` files and
`8 failed | 3098 passed (3106)` tests. The 51-case increase is 25 new variety
cases plus a net increase of 26 reading-upgrade cases (70 -> 96). Six original
baseline failures cleared; the two GS028 busy-reading failures remain. Six
additional failures are in the concurrently changed reading test file.

| Final failure | Exact observed difference | Attribution |
| --- | --- | --- |
| GS028 CT `paired-persistent-solid`, `busy_reading` (`tests/gs028-20261007-variety2-batch.test.ts:426`) | Queue minutes 0, expected greater than 0 | Identical original baseline failure; also previously reproduced with the original-appearance control |
| GS028 CT `paired-cystic-is-not-benign`, `busy_reading` (same line) | Queue minutes 0, expected greater than 0 | Identical original baseline failure; also previously reproduced with the original-appearance control |
| Compatible preferred reader, `reverse=false` (`tests/room-upgrade-reading.test.ts:128`) | Start 4.5/end 9, expected 6.5/11 | Not a baseline failure; concurrently expanded reading test lane |
| Compatible preferred reader, `reverse=true` (same line) | Start 4.5/end 9, expected 6.5/11 | Not a baseline failure; concurrently expanded reading test lane |
| Legacy `manual30` integer boundaries, `interrupted=false` (`tests/room-upgrade-reading.test.ts:147`) | Start 4.5/end 34.5, expected 5/35 | Not a baseline failure; concurrently expanded reading test lane |
| Legacy `manual30` integer boundaries, `interrupted=true` (same line) | Start 4.5/end 34.5, expected 5/35 | Not a baseline failure; concurrently expanded reading test lane |
| Dependency-ready queue, `now=20` (`tests/room-upgrade-reading.test.ts:164`) | Ready 220/queue 0, expected ready 90/queue 130; start/end 220/225 match | Not a baseline failure; concurrently expanded reading test lane |
| Dependency-ready queue, `now=21` (same line) | Ready 221/queue 0, expected ready 91/queue 130; start/end 221/226 match | Not a baseline failure; concurrently expanded reading test lane |

The six cleared baseline failures are diagnostic serial/concurrent seating,
radiologist-training local interpretation, both paused-reading processing
scenarios, statistics/ethics release counts, and accepted alternate-room reading
duration. The three reading failures in the earlier rejected handoff also pass
in this revision's full run.

The observed reading test file was modified at
`2026-10-08T02:35:10.521469+00:00` (22:35:10 local), after this full run began at
22:33:11 and after the first root typecheck. Its captured SHA256 is
`67a6c76bec2ee77b2569038ec42028fc7d5a181db1b3c0086834fa4e3a21e048`.
A read-only snapshot and file hashes are retained as
`revision-observed-room-upgrade-reading.test.ts` and
`revision-observed-concurrent-files.json` in the ignored task logs. Production
`appearance.ts` is byte-identical to the original snapshot both before and
after this full run; there is no remaining worker gameplay-code delta to
attribute these reading failures to. The concurrent reading/GS028 files were
not edited by this worker. This is a failed integrated suite, not a green-suite
claim or an acceptance of those other-lane failures.

Final root typecheck (exit 0):

```powershell
npm.cmd run typecheck
```

Exact stdout:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present

> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json

> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Unabridged stdout/stderr, including all eight assertion diffs and exit codes,
is in `revision-full-game-domain.log`, `revision-focused-game-domain.log`,
`revision-typecheck.log`, and `revision-final-typecheck.log`, with matching
`.exit.txt` receipts. Machine-readable baseline/final failure matching is in
`revision-validation-attribution.json`. The final post-validation byte proof
is `revision-final-scope-verification.json`.

### Manager next action after revision

Review the reduced new tests and restoration receipts; the final production
appearance delta is zero. The accepted scope requires no recency/schema or
age-band design decision. All eight integrated failures remain for their owning
reading/GS028 lanes; their exact test IDs and assertion differences are above.
The global `CURRENT_THREAD_HANDOFF.md`, integrated acceptance, and checkpoint
backup remain manager-owned. This work is local only, with no commit, push,
install, art/balance change, deployment, publication, or external message.
