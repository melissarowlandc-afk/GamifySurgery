# GS-016 — Remove the prebuilt examination room

Updated 2026-09-17. Status: owner accepted; local backup verified; GitHub push awaiting approval review.
Owner confirmation: "The examination room is gone at the start like it's
supposed to be. Let's resolve GS-016" (2026-09-17). No deployment authorized.

## Cause and correction

GS-011-001 was genuine fresh-campaign behavior. The player campaign-opening
path calls `appendLocalCampaign` / `createLocalCampaign`, then domain
`createInitialGameState`, which copies balance `facility.initialRooms`.
That list explicitly contained `room.instance.starter_examination`; the reducer
also created its connected door. The tutorial consequently taught a second room.

Fresh campaigns now initialize with only the existing Front Desk and exterior
entrance. Examination-room availability, footprint, unlock, $160 construction
price and explicit door rules are unchanged. Starting cash remains $120.

Removing the free room alone would block tutorial care and funding. The two
specific protected Level-0 opening encounters can therefore use the Front Desk
only while no examination room exists. Ordinary patients still require a
reachable examination room; a built but disconnected room does not qualify for
the exception. The existing two-patient tutorial then teaches the first room
and its door. The full wrong-answer path pays $25 for the first encounter and
$35 for the second encounter's two decisions. At tick 196, after mandatory
testing waits and posted upkeep, the original $120 start leaves $160.50,
enough to buy the room. The existing Emergency Cash consult remains available
without a room if additional reading time or upkeep creates a shortfall.
No economy change remains.

Save restoration/migration was inspected but not modified. Regression coverage
checks that a fresh campaign remains room-free on reload and that an existing
historical starter-ID room/door retains its identity, cash and XP on reload.
No save cleanup or blanket room deletion is performed.

## Ownership and review

Terra `exam_room_fix` diagnosed and implemented the three runtime source edits,
focused storage/tutorial/domain regressions, and dependent test fixtures. Astra
reviewed actual changes against a pre-task copy of the already dirty working
tree, rather than treating inherited changes as GS-016 work.

Sol `exam_room_acceptance` completed wrong-answer funding/construction coverage,
the delayed-reader recovery check and actual player-facing browser acceptance.
Astra reviewed the actual scoped diffs, independently ran the unit/type/build
checks and inspected both screenshots and the browser validation receipt.
Plan: `../execplans/fix-prebuilt-examination-room.md`.

GS-015 room appearance/layout and GS-013 character work were preserved. The PM
board was not changed. No shared renderer, room artwork, clinical source,
dependency, launcher or save-runtime changes belong to this task.

Runtime ownership is limited to `packages/balance-config/src/prototype-balance.ts`,
`packages/game-domain/src/reducer.ts`, and
`apps/player/src/session/tutorialViewModels.ts`.
Regression ownership includes the adjacent balance/tutorial tests,
player `prototypeStorage`, `chartFeedbackPresentation` and
`surgeryCenterServicePreviews` tests; domain `game-domain`, `board-expansion-batch`,
`board-expansion-20260912-batch`, `early-levels-20260913-batch`,
`facility-experience`, `patient-alert-delay`, `surgery-center-batch`,
`timing-encounters` and `twenty-concept-batch` tests; and the two named browser
specs in the validation record. Dependent fixtures explicitly provide their
required clinical room; original clinical and routing assertions are retained.

Pre-task versions of changed tracked files and the preexisting untracked
staffed-checkin spec are retained in ignored `.local-dev/gs-016-baseline/` for
the later scoped backup audit. Do not stage inherited dirty hunks as this fix.

## Validation record

- Baseline domain suite: 318/319 passed; one surgery-center timeout under full
  concurrency. Its isolated rerun passed4/4 before source edits.
- Parent: `npm run test --workspace @gamify-surgery/balance-config -- --maxWorkers=2`
  passed13/13.
- Parent: `npm run test --workspace @gamify-surgery/player -- --maxWorkers=4`
  passed434/434 across72 files.
- Parent: `npm run test --workspace @gamify-surgery/game-domain -- --maxWorkers=1`
  passed321/321 across35 files in81.43seconds. Serial execution avoids the
  baseline heavy-batch timeout under concurrent test/build/browser work.
- Parent: `npm run typecheck` passed all workspace typechecks.
- Parent: `npm run test:boundaries` passed dependency and launcher contracts.
- Parent: `npm run build --workspace @gamify-surgery/player -- --outDir C:/Users/KYLEKE~1/AppData/Local/Temp/GS-016-player-build`
  passed; existing large-chunk advisory and outside-root output notice only.
  Isolated output avoids replacing the owner's normal build artifacts.
- Sol's normal-command regression proves both incorrect tutorial encounters,
  their full mandatory waiting sequence, $160 room construction, explicit door
  construction, and save/reload preserving room, door, cash, XP and completions.
- Parent independently reran `npm run test --workspace @gamify-surgery/game-domain -- tests/game-domain.test.ts`
  after the delayed-reader branch was added: 9/9 passed.
- Sol browser environment: `GAMIFY_E2E_EXTERNAL_SERVER=1`,
  `GAMIFY_E2E_BASE_URL=http://127.0.0.1:4186`, disposable Chrome contexts.
  `npx playwright test tests/e2e/fresh-campaign-examination-room.spec.ts --project=desktop-chrome`
  passed 1/1 in 1.5 minutes. Real New Campaign/founder/clinic opening, no room,
  reload without reseeding, both opening patients through UI, $160 build card,
  real canvas room/door clicks, Done / Save, and reload retaining the same room,
  door, two completed encounters and XP. No room/state injection in this proof.
- `npx playwright test tests/e2e/staffed-checkin-pathing.spec.ts --project=desktop-chrome --workers=1`
  passed 2/2 in 46.8 seconds. These use explicit previously built-room save
  fixtures to preserve staffing, check-in, escort and delayed-alert assertions.
  Receipt: ignored `.local-dev/gs-016-e2e.log`.
- Astra visually reviewed [fresh campaign](../../artifacts/screenshots/gs-016-fresh-no-examination-room.png)
  and [player-built room](../../artifacts/screenshots/gs-016-player-built-examination-room.png).
  Fresh shows only Front Desk; built shows the room and the completed 1/1 goal.
- Baseline-relative whitespace checks passed for the source/test changes.

## Safe owner testing and remaining action

Canonical opening remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in the
owner's intended persistent browser profile. The public site is unchanged.
Validation used a separate `http://127.0.0.1:4186` server and disposable browser
storage; that test server was stopped after validation. These test campaigns
do not appear in the owner's normal profile.
The owner's active session was not manually reset/reloaded and the shared
server was not restarted.

After technical validation, review a newly created campaign: only Front Desk
should exist initially. Complete the two opening patients, then follow Build
Mode to buy an Examination Room and place its connecting door. Reload should
keep that room; existing campaigns keep their rooms and progress.

Owner acceptance on 2026-09-17 authorizes scoped audit, commit, GitHub backup,
remote verification and archival. Record the verified branch/commit below
before archival; no merge or deployment is implicit. Owner reports completion
to GS Manager. No next feedback batch is authorized in this task.

## Scoped backup boundary

The backup branch preserves an exact 22-file reconstruction package in
[docs/backups/GS-016](../backups/GS-016/README.md). It is not a standalone
runnable game or runtime integration: the accepted working state depends on
earlier uncommitted routing and persistence foundations. The package stores
the recorded baseline, exact task patch, SHA-256 manifest and restore script.
No unrelated runtime changes are included as an integrated source commit.

## Backup closeout receipt — 2026-09-17

Local package commit: 5c5cfbf80f85d27969e6a76bf28773241766f393.
Branch: backup/gs-016-accepted-2026-09-17.
Astra independently restored the committed Git archive and verified all 22
accepted SHA-256 hashes. Non-empty destination refusal also passed.
Terra implemented the fix; Sol validated acceptance and audited/prepared the
reconstruction package; Astra reviewed diffs, tests, screenshots and restore.

GitHub push was rejected by automatic approval review, which did not recognize
trusted authorization for this specific source/evidence payload and destination.
No remote backup is claimed. Exact payload/destination approval was requested.
After approval, push this backup branch to origin, verify its remote hash,
record verification and archive the task. No merge or deployment is authorized.
