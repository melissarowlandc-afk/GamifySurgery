# GS-023 — Tutorial and daily clinic routines

## Status and authority

2026-09-18 follow-up: owner approved the tutorial-only graduation exception
("Yes you may"). M4 now authorizes Level-0 advancement once both protected
tutorial patients are complete and an accessible Examination Room is built,
regardless of answer-derived XP/satisfaction. Preserve actual scores and all
later level requirements. Terra owns the bounded implementation and meaningful
regressions; Astra reviews the task-relative diff, independently validates,
and updates handoff/feedback. Capture a fresh pre-M4 baseline before edits.
No owner save manipulation, commit, push, deployment, or unrelated changes.

M4 implemented by Terra wrong_answer_acceptance and reviewed against captured
baselines by Astra. Only selectors.ts and player viewModels.ts change runtime:
the alternate Level-0 gate uses both protected completed encounters plus the
existing functional Examination Room requirement. Goals switch to explicit
tutorial completion; real HUD XP remains 6/10 for the all-wrong run. Existing
normal eligibility and deliberate LEVEL_UP (including its per-level XP reset)
are preserved. No save schema changes or fabricated learning records.
Parent verification: domain516/516, player467/467, all workspace typechecks,
boundaries and isolated production build passed. Focused final domain16/16
includes all-wrong, mixed and all-correct natural build/advance, reload/history,
missing/walked-out patient, missing/inaccessible room, and later-level gates.
Browser verification passed1/1 (1.4m) in Sol's final isolated4198 run. Astra
reviewed its log/result, final spec and screenshot. Terra corrected the initial
wrong-feedback close flow; Sol handled existing wait/alerts/advance coaches and
enabled the existing opt-in read-only Phaser hook. No runtime defect was found.
Exactly3 wrong answers, $160 room debit, real6/10XP and84% satisfaction, completed
goals, explicit Level1 advancement and reload were verified. Evidence:
.local-dev/gs-023-m4-sol-final.log and -results/.last-run.json; screenshot
artifacts/screenshots/gs-023-tutorial-graduation-ready.png. M4 complete locally.

Approved for implementation, 2026-09-18. Owner: "For those 'three short
explanations' do them while waiting for the 'two part' patient to come back to
the clinic. Otherwise, I accept these changes". This moves the tips into the
second tutorial patient's send-out/return wait; all other proposed defaults
are approved. Phase 1 made planning changes only. No redundant approval gate.

## Goal and boundaries

Explain Management, trash, and water; make the founder reliably return to the
Front Desk before secretary hire; finish patient-first secretary refill rules.
Feedback: GS-011-019/020/021/022/032. GS-011-018 is a regression acceptance
constraint, with existing GS-016 evidence to preserve. GS-011-023 (any chair)
is optional and excluded unless expressly added.

Preserve GS-021's approved 32-entry service/retail catalog, Management Employees
and Services & income tabs, provider reservations, work-before-shopping priority,
receipts and earnings. Preserve GS-020 ultrasound/mobile-tech behavior and
GS-017 alert cadence and chart behavior. Reuse current assets/animations.
No new room art, door redesign, broad pathfinding, economics, service timing
redesign, clinical content, PM board updates, or deployment.

## Repository state and ownership

Repository: C:/Users/Kyle Kent/Projects/GamifySurgery. Branch beta, HEAD
c26c96a111103d8665e33c9258ef54071d729f14 at intake. Extensive inherited tracked
and untracked changes include reducer, staff, persistence, types, App/AppShell,
session view models, renderer, tests, service operations and retail operations.
Whole-file git diffs are not task ownership. Recheck status and exact touched
hunks before implementation, preserve a task baseline, and use isolated
preview/build output and narrow patches. No shared checkout cleanup/staging.

Astra owns this plan, product decisions, review and acceptance; later handoff:
docs/handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md. Terra routine_investigation owns
read-only current behavior/test investigation. No worker may spawn, mutate,
install, publish, operate the owner's game/save, or contact peers during phase 1.
After approval, normally one explicitly scoped writer at a time.

## Prior evidence reviewed

- GS-016: two protected opening encounters can use Front Desk before the first
  Examination Room. Its all-wrong domain regression reaches tick 196 with
  $160.50 for the $160 room and tests construction/door/save-reload. Delayed
  reading recovery through existing Emergency Cash is covered. This is prior
  evidence, not a newly run GS-023 test or proof of every extended tutorial gate.
- GS-020: ultrasound-first Level 1, optional Level-2 X-ray, shared mobile techs
  and saved reservations; its focused run also retained all-wrong opening tests.
- GS-017: daily water/trash alerts after more than 60 facility minutes, chart
  feedback/close behavior and persisted cadence. Refill scheduling need not
  wait for the alert; do not change the alert cadence to teach chores.
- GS-021: owner accepted completion; actual service/retail implementation and
  final validation supersede historical proposal language in its catalog.
- GS-015 owns room design, GS-018/022 static art. GS-019 closed its isolated
  motion work without a full roster runtime rollout; do not integrate assets.
- Feedback log intake rows still say unverified here; they are not authoritative
  evidence that an implementation is absent.

## Approved outcomes

1. Short, contextual tutorial guidance for Management, trash and water. Explain
   real controls and both Management tabs. Reading tips must not impose a
   purchase, hire, correct answer, or wait for trash/empty water. Preserve the
   existing room/door tutorial. During the second (two-part) tutorial patient's
   send-out wait before returning to clinic, show three short cards:
   Management, trash, water. Do not show them between the two tutorial patients.
   Each advances with Got it; optional Open Management demonstrates its existing
   paused panel without requiring a purchase/hire. The new cards pause facility
   time while read and restore the prior pause state afterward, so reading does
   not drain opening funds or let the next arrival race the guide. Highlight the
   Management control, visible litter if present (otherwise the clinic), and
   cooler. Explain click-to-clean, low-water click-to-refill, and secretary
   empty-cooler automation. No forced litter spawn, emptying, chore or hiring.
2. Desk/chair click seats the founder before secretary hire. Completed assigned
   chores and patient work lead back to the desk; active work and newer player
   commands take priority. Stop automatic return once a secretary is hired.
   Reserved clinical services must never be interrupted by return/idle routines.
   Return after successful chore completion, released patient work and other
   completed assigned work only when no secretary is hired. A newer manual move
   cancels an automatic return and is honored at its requested destination;
   do not immediately bounce the founder back. Existing busy-work rejection
   remains; no new arbitrary task-cancel control. Failed/cancelled work must not
   fire a stale completion return. Hiring clears a pending automatic return
   without cancelling actual work. Once hired, do not place the founder in the
   secretary's desk chair. Unreachable/occupied desk means no teleport or loop.
3. Reuse existing secretary refill/return machinery, but start at the next idle
   front-desk gap once water is empty instead of waiting an extra hour. Preserve
   existing refill duration, pause semantics and clinical reservations. Explicit
   patient-arrival, blocked-target and cancellation rules: do not leave for a
   refill while a patient awaits check-in or is approaching/returning to the
   desk. If that happens during travel/refill, abandon the uncompleted refill
   with no water gain, return for the patient, and retry in a later quiet gap.
   Check patient priority before awarding refill completion on the same tick.
   A full cooler causes no trip; only one worker may own a refill. A missing or
   unreachable cooler aborts/leaves no chore, with no success reward or repeated
   alerts; retry only when an accessible cooler and idle opportunity exist.
   If the desk is unreachable, stop safely rather than teleport. Preserve
   existing alert cadence. Empty-only is the recommended trigger (matching
   today's automation), not Terra's optional low-water threshold expansion.

## Current-source evidence and reviewed differences

Terra routine_investigation completed the read-only milestone. Astra inspected
the actual source for the central findings; no test execution is claimed here.

- tutorialViewModels.ts:511 has the between-patients card; :798 has alerts
  followed by the room tutorial. No Management/trash/water steps exist.
  usePrototypeSession.ts:266 initializes acknowledgments as an in-memory Set;
  its Management opening already pauses time (:703). ManagementPanel.ts:42
  exposes the two existing tabs.
- reducer.ts:370 plans a return after released patient work based on an
  operational receptionist; :4140-4234 clears completed chore activity without
  that return. :6251 protects active explicit work/service reservations.
  viewModels.ts:1112-1142 only marks attend_encounter/sit_in_chair as seated.
  Dedicated desk click/seating and all-chore return remain gaps.
- reducer.ts:3790-3854 uses empty-since/hire plus configured refill delay, no
  incoming/awaiting-patient check; :3856-3922 completes refill work. Existing
  receptionist-water-refill.test.ts covers the 60-minute delay, routing,
  duplicate prevention and reload; it does not prove arrival preemption.
- service-operations.ts:243-306 reserves providers and checks facility tasks;
  retail-operations.ts:130 observes founder reservations. The revised scheduler
  must retain these boundaries, not replace a service task with desk/refill work.
- Existing founder-map-movement tests cover encounter return, persistence and
  a newer manual move overriding return; reuse and extend them.

Concrete shared-file overlap: reducer/types/persistence, tutorialViewModels,
usePrototypeSession/viewModels, FacilityScene and adjacent tests already contain
unrelated edits. This is a scoped-diff requirement, not permission to rewrite
the files. No external ownership/approval loop is needed for phase 1.

## Compatibility and acceptance requirements

Existing rooms, cash, XP, encounters, clinical history, receipts and unlocked
levels persist. Completed tutorials must not restart. Existing in-progress
tutorials retain state-derived progress and existing durable acknowledgments;
past in-memory acknowledgments cannot be reconstructed. Persist the three new
card acknowledgments and tutorial-owned pause restoration per campaign. Legacy
Level-0 campaigns may receive these cards once during the second patient's
active send-out wait; campaigns past that wait skip them rather than rewind.
Save/reload must not duplicate chores, replay completed new tips, or unpause an
intentionally paused campaign. Do not broadly redesign all historical tips.

Validate the normal all-wrong tutorial through its actual completion boundary,
including required room/door construction and progression; reuse GS-016 fixtures
and preserve honest answer feedback. Check representative mixed/correct paths.
No developer grants or owner-campaign manipulation as all-wrong proof. Optional
spending and indefinite waiting are not an unlimited-resource guarantee.

After approval, meaningful domain tests must cover task priorities, return and
cancel, patient arrival during refill, hiring, unreachable/removed targets,
service reservations and save/reload. Player tests cover tip placement/advance
and saved progress. Run affected workspace tests, npm run typecheck,
npm run test:boundaries, isolated player build, and focused disposable browser
verification of tutorial/desk/refill paths. Broaden tests for actual integration
risks, not to rerun unrelated work without reason.

Canonical owner opening remains START_GAME.cmd -> http://127.0.0.1:4173 in the
existing browser profile. Any test origin/profile has separate storage. Do not
restart the owner server or load/reset the owner save.

## Milestones and next action

- Phase 1: Terra current-source investigation and Astra evidence review complete;
  concrete three-outcome proposal approved 2026-09-18 with send-out placement.
- M1 complete: Terra implementation, Sol correction, parent independent tests
  and visual review of second-patient wait tips and durable pause/progress.
- M2 complete: Terra partial work, Sol routine_completion implementation and
  seated-pose correction; parent diff/validation/visual acceptance.
- M3 complete technically: parent integrated tests/typechecks/isolated build and
  three-case browser run; applicable feedback and GS-023 handoff updated.
- M4 complete: approved tutorial graduation exception, full checks and natural
  all-wrong browser proof passed; parent reviewed actual code and screenshot.
  Owner playtest remains pending.
- After owner acceptance: scoped audit/backup/remote verification/archive under
  standing authorization; no automatic deployment or unrelated staging.

Next action: owner playtest.
Source changes are local/uncommitted.
Shared state/instructions were reread on approval; phase1 only created this plan.

## Implementation validation log

- 2026-09-18 parent baseline before M2: npm run test --workspace
  @gamify-surgery/game-domain -- tests/founder-map-movement.test.ts
  tests/receptionist-water-refill.test.ts tests/game-domain.test.ts --maxWorkers=1:
  26/26 passed, 3 files. Current assertions include old refill delay behavior;
  this is baseline evidence, not acceptance of the new rules.
- M2 review concerns: existing missing-cooler helper falls back to founder
  location; explicitly prevent phantom refill. Current scheduler admits new
  patients after chore completion; check same-tick due arrivals before awarding
  refill work, without broadly changing clinical service scheduling. Existing
  Front Desk art anchor is B3 and rendered desk/chair positions differ from
  floor tiles; click hit areas must use rendered fixture bounds and preserve
  Build Mode, litter, cooler, patient and employee interactions.
- M1 first handback: player tutorial/storage 25/25 and player typecheck passed.
  Parent reviewed each actual baseline-relative file diff. Not yet accepted:
  IndexedDB repository would drop new metadata, reload could replay prerequisite
  tips and release pause early, and pause ownership/nested modes lack tests.
  Returned to Terra for narrow corrections and durable-repository/helper tests;
  cooler-specific target and explicit travel/legacy negative cases requested.
- Terra wrong_answer_acceptance is investigating the full all-wrong Level-1
  boundary read-only while M1 proceeds. Existing GS-016 test ends after room,
  door and reload; Level 0 requires 10 XP. Extra ordinary Level-0 arrivals exist
  while XP remains below threshold; practical completion is being verified.
- All-wrong investigation found a pre-existing full-graduation gap: the seed
  player-built-exam reaches 10 XP after a two-decision recovery case but remains
  below the >90 satisfaction gate; prior GS-016 evidence is funding/build only.
  Completed satisfaction scores are immutable. Continuing arrivals alone does
  not guarantee recovery with all answers wrong. Parent requested retained
  diagnostic evidence and asked owner via async question to approve a narrow
  Level-0 tutorial-completion exception: both protected tutorials completed plus
  accessible Examination Room permits advancement regardless of answer-derived
  XP/satisfaction, preserving real scores and later-level requirements. This
  additional rule is PENDING approval; continue approved M1/M2 meanwhile.
- Parent independently ran retained ignored diagnostic
  .local-dev/gs-023-all-wrong-level-one-blocker.test.ts: 1/1 passed, confirming
  the blocked state. Output record alongside it qualifies that two queued
  patients remain, so this is not proof every further route is impossible.
- M1 second review found unchanged earlier between-patients prompt and the
  first-tip/no-ack reload case still lose sequence ownership. Claimed durable
  repository coverage was only an existing suite run, not new metadata tests.
  Escalated to Sol tutorial_state_review, sole writer for M1 correction and
  isolated browser acceptance; Terra routine_investigation has stopped writing.
- Sol corrected earlier-tip rewind, first-card reload ownership and release-save
  ordering; added real IndexedDB roundtrip/clear/legacy/multi-campaign tests.
  Parent reviewed actual correction diffs and independently passed focused
  player tutorial/pause/storage/repository tests 56/56. Source accepted pending
  isolated browser evidence. Sol is preparing the browser spec before writer
  ownership transfers to M2.
- M1 frozen source/test ownership transferred. Sol tutorial_state_review runs
  isolated snapshot browser proof (may correct only its new e2e spec).
- Terra started M2 but handed back incomplete after nullable cooler guard,
  chore return and desk command; old domain tests 17/17 and typecheck passed,
  which do not establish new behavior. Parent inspected partial actual diff.
  Sol routine_completion is now sole runtime writer completing M2 and its
  acceptance tests, using .local-dev/gs-023-m2-baseline. Terra stopped writing.
- M1 browser passed 1/1 on isolated static snapshot at port 56893; own listener
  stopped. Real fresh campaign reaches second-patient offsite tips; reload at
  first and later cards retains pause/progress; optional Management tabs/Done
  preserve pause; final Got It releases it and ticks advance. Parent inspected
  Management/water screenshots and passed .last-run.json. Evidence screenshots:
  artifacts/screenshots/gs-023-sendout-{management-before-reload,
  trash-before-reload,water}.png. Browser spec hash after corrected tab selectors:
  DADE1F4F394FA75FFBF6C5B12D7B62936E01A420F79D4CDF66E8E9C34891E2C5.
  Static build passed. No M2 behavior is claimed from this M1 snapshot.
- Receipt reviewed at .local-dev/gs-023-m1-validation.md. Limitation: M1 worker
  used default player build output before copying it into the isolated static
  snapshot, so apps/player/dist was regenerated. Do not claim normal generated
  build artifacts were untouched. No owner server/save was operated. All
  subsequent builds must use explicit isolated --outDir (M2 worker instructed).
- Parent native netstat contradicted initial M1 shutdown claim (56893 child
  PID13468 still listening). Sol stopped that exact owned process; parent
  independently verified no :56893 row afterward. Owner4173 PID6300 untouched.
  Corrected receipt hash: 4028A4655737B4D309040289B258575B27B366FEB03B00BD306C5DF88A6B585B.
- M2 focused domain59/player23, typechecks/boundaries and initial browser2
  passed. Parent actual visual review REJECTED initial founder screenshot:
  logical B3 arrival rendered standing beside an empty chair. Returned to Sol
  for narrow view-model seated semantics + actual seated regression/screenshot;
  secretary refill/return image passed review. Do not treat the initial browser
  location-only assertion as seating acceptance.
- Parent full domain validation on frozen domain changes passed512/512 in45
  files (168.40s), .local-dev/gs-023-domain-final.log. This preserves GS-016
  opening funding proof; full graduation limitation remains separately pending.
- Final parent player466/466 (77files), all7 workspace typechecks, boundaries
  and explicit isolated build passed. Final private4198 Chromium3/3 passed for
  actual seated pose, complete refill-and-return, and tutorial/reload/Management
  pause flow together. Parent inspected final screenshots and stopped own
  preview; native netstat confirmed no4198 LISTENING row. Logs/evidence/ownership
  caveats are recorded in docs/handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md.
- All qualifying implementation was delegated. Actual workers: Terra
  routine_investigation (investigation, M1 initial and M2 partial), Terra
  wrong_answer_acceptance (read-only graduation investigation), Sol
  tutorial_state_review (M1 corrections/browser), Sol routine_completion
  (M2 completion/seated correction). Astra retained decisions, reviewed actual
  diffs/images, ran independent validation and wrote planning/reporting docs.
