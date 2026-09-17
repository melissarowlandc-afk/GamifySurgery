# GS-016 — Fresh campaigns require player-built examination rooms

## Goal and acceptance

Fix GS-011-001: a genuinely new campaign has no examination room. Normal
construction adds it under existing prices, unlocks and placement rules.
Existing campaigns retain rooms/progress; reload must not reseed a room.
Verify first-patient, staffing and onboarding coherence in disposable storage.
Owner accepted on 2026-09-17: "The examination room is gone at the start like
it's supposed to be. Let's resolve GS-016". Scoped backup/closeout authorized;
no deployment or further feedback implementation.

## Repository state and constraints

2026-09-17: shared beta worktree has extensive inherited dirty source, tests,
art and documentation. Read repository AGENTS.md, feedback entry/proposed scope,
current handoff, GS-015 room handoff and GS-001 save-repository result.
GS-015 owns appearance/layout; GS-013 owns characters. No renderer/art edits.
Preserve live browser sessions, saves and canonical 127.0.0.1:4173 server.
Use disposable browser storage and a separate test server at 127.0.0.1:4186.
Do not edit the PM board, clinical content or other feedback entries.
Tracked source/tests were copied before edits to
C:/Users/KYLEKE~1/AppData/Local/Temp/GS-016-baseline for task-only diff review.
Preexisting untracked files require separate snapshots before modification.

## Findings and final decisions

- Actual campaign creation: appendLocalCampaign / createLocalCampaign ->
  createInitialGameState -> balance facility.initialRooms. That list explicitly
  seeded an exam room; reducer added its door. The old starter-room test passed,
  reproducing the defect independently of the owner's save.
- Remove that room and automatic door. Tutorial teaches the first exam room.
- Starting cash stays 120 and construction stays 160. Permit exactly the two
  protected Level 0 tutorial IDs at the Front Desk only while zero exam rooms
  exist. Ordinary encounters and built-but-disconnected rooms retain normal
  care requirements. Preserve original two-patient-before-build lesson order.
- The full all-incorrect path pays 25 then 35, including the second case's two
  decisions. After mandatory waits and upkeep, tick 196 cash is 160.50. The
  normal room purchase succeeds. An interim estimate mistakenly used 25 for the
  second payout; its provisional cash increase was reverted. No balance change
  remains. A delayed branch verifies the existing 25 Emergency Cash consultation
  recovers a subsequent upkeep shortfall and allows normal construction.
- Restoration/migration needs no runtime change; test both absent-room reload
  and historical starter-ID room/door/progress preservation.

## Milestones and ownership

1. Terra exam_room_fix: completed bounded diagnosis and source implementation.
   Owns GS-016 hunks in packages/balance-config/src/prototype-balance.ts,
   packages/game-domain/src/reducer.ts, and
   apps/player/src/session/tutorialViewModels.ts; focused adjacent tests,
   prototypeStorage.test.ts, and dependent domain/player fixture corrections.
2. Sol exam_room_acceptance: completes real-command minimum-payout and delayed
   recovery regression in game-domain.test.ts; dependent timing-encounters,
   twenty-concept and board-expansion-20260912 fixture corrections; new
   tests/e2e/fresh-campaign-examination-room.spec.ts; minimal existing
   staffed-checkin-pathing.spec.ts fixture correction and gs-016 screenshots.
   Preserve clinical/routing assertions; explicitly provide built rooms where
   old tests assumed free starting rooms. No renderer or persistence edits.
3. Astra: actual baseline-relative diff review, independent validation and
   screenshot inspection, handoff and only GS-011-001 status/reference update.

Workers share files, preserve unrelated work, do not spawn further agents,
commit, push, deploy, install dependencies or alter durable planning. One
write-capable worker was active at a time. No PM messaging/polling loops.

## Validation and progress

- Baseline full domain 318/319: one 15-second surgery-center timeout. Isolated
  baseline rerun 4/4 passed. Old starter initialization test 1/1 reproduced defect.
- Parent final full domain: 35 files / 321 tests passed with --maxWorkers=1 (81.43s).
  Earlier concurrent runs exposed fixture dependencies and heavy-batch timeout;
  fixtures were corrected and final serial run passed without timeout edits.
- Parent full player: 72 files / 434 tests passed with --maxWorkers=4.
- Parent balance: 13/13 passed. All workspace typechecks and boundaries passed.
- Parent production player build passed to isolated TEMP/GS-016-player-build;
  normal output and shared server preserved. Existing chunk-size notice only,
  plus the expected outside-root output-directory notice.
- Sol focused minimum-payout, construction, restore and delayed Emergency Cash
  recovery passed. Parent reviewed those actual tests and source hunks.
- Parent visually inspected both screenshots: fresh has only Front Desk and
  120 starting cash; built has the examination room and completed 1/1 goal.
- Sol browser acceptance passed: fresh creation/build/door/reload1/1 and
  existing-save staffing/check-in2/2. Parent reviewed spec diffs and receipt.
- Parent reran game-domain.test.ts after delayed-reader coverage:9/9 passed.
- Changed-file baselines are retained in ignored .local-dev/gs-016-baseline
  for the later scoped backup audit; this includes the preexisting untracked
  staffed-checkin spec. No unrelated source paths changed in baseline comparison.

## Next action

Technical work complete; exact commands and evidence are recorded in
docs/handoffs/GS-016_PREBUILT_EXAMINATION_ROOM.md. Only GS-011-001's status and
reference were updated in the feedback log. Owner accepted on 2026-09-17.
Sol exam_room_acceptance now audits the baseline-relative scope and prepares
isolated backup artifacts; Astra records acceptance, reviews the exact staged
scope, commits/pushes, verifies the remote and archives. Preserve all unrelated
dirty hunks; no merge, deployment or next feedback batch is authorized.

## Closeout checkpoint

Sol completed the reconstruction audit. Astra restored the committed archive:
22/22 hashes passed and non-empty target refusal passed. Local backup commit
5c5cfbf80f85d27969e6a76bf28773241766f393 is on
backup/gs-016-accepted-2026-09-17. Automatic approval review rejected the push
for lack of recognized payload/destination authorization. Await the requested
exact approval, then push, verify remote and archive; do not bypass rejection.
