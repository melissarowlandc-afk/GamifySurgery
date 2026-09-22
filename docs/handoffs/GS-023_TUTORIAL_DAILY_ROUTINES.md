# GS-023 — Tutorial and daily clinic routines

Status: three approved outcomes implemented and technically verified locally,
2026-09-18. Owner playtest acceptance pending. Approved graduation exception
also implemented and technically verified locally.
Active plan: [tutorial-daily-clinic-routines](../execplans/tutorial-daily-clinic-routines.md).

## Owner-approved scope

Owner approved the three-outcome proposal with one correction: introduce
Management, trash and water while the second, two-part tutorial patient is
away for the timed service, not between the first and second patients.

- Three optional informational cards, Got It progression, temporary pause,
  optional existing Management panel, durable per-campaign tip progress.
- Click the Front Desk or its chair to seat the founder before secretary hire;
  return after completed assigned work, preserving active work/reservations and
  newer commands. Hiring ends automatic desk returns.
- Empty cooler triggers secretary refill in the next idle front-desk gap;
  arriving/waiting patients interrupt unfinished refill and take priority.

Any-chair seating, room/door design, new art, broad pathfinding, clinical content,
economics/global service timing, unrelated feedback and deployment are excluded.
Preserve GS-021 Management Employees and Services & income, provider reservations,
retail priorities/receipts; GS-020 mobile imaging; GS-017 alerts/chart behavior.

## Tutorial milestone verified

Terra implemented the initial cards/persistence. Astra actual-diff review found
durable repository omissions and reload/pause defects. Sol corrected those,
added real repository regressions, and completed isolated browser verification.

Astra independently passed player tutorial/pause/storage/repository tests 56/56.
Sol player typecheck and static build passed. Browser 1/1 passed on isolated
port56893: natural fresh campaign through second-patient send-out, first-card
reload with no memory acknowledgments, unchanged paused clock, optional
Management tabs and Done, later-card reload, water tip and final time release.
Astra reviewed screenshots and passed result status. Three screenshots:
`artifacts/screenshots/gs-023-sendout-management-before-reload.png`,
`gs-023-sendout-trash-before-reload.png`, `gs-023-sendout-water.png`.
Detailed ignored receipt: `.local-dev/gs-023-m1-validation.md`.

The final parent integrated run below supersedes the tutorial-only snapshot.

## Routine implementation and final acceptance evidence

Terra started the nullable-cooler/desk-command edits; Sol routine_completion
completed scheduling, service priorities, rendered click wiring and regressions.
Parent reviewed actual baseline-relative diffs, including target occupancy,
unreachable return, reserved work, same-tick admission and refill credit order.
Automatic arrivals keep their original order; only refill completion is deferred
until arrivals have been considered. Full, removed and inaccessible cooler
targets cannot credit refill. Existing service/provider work remains reserved.

Parent visual review rejected the initial browser seating claim: the actor
reached B3 but stood beside the empty chair. Sol added idle-desk seated semantics
with work/retail/reservation guards and a regression for feedback-pending provider
reservations after their phase deadline. Corrected browser proof asserts the
actual visible Phaser seated/front frame, not just location. Parent independently
viewed the final seated image and the refilled secretary-return image.

Final parent verification on frozen code:

- Domain:512/512 in45files, serial maxWorkers1 (168.40s).
- Player:466/466 in77files, maxWorkers2 (30.63s).
- All7 workspace typechecks passed; dependency and launcher boundaries passed.
- Explicit isolated build passed into `.local-dev/gs-023-final-build`;
  only the existing large-chunk advisory and outside-project output notice.
- Combined desktop Chromium3/3 passed (1.4m) on private dev origin
  http://127.0.0.1:4198: rendered desk click to actual seated pose; empty cooler
  travel, fill100% and secretary return; natural fresh tutorial send-out cards,
  first/later reload, optional Management and final pause restoration.
- Parent inspected final screenshots after that combined run. Own4198 preview
  stopped; native netstat independently confirmed no4198 listening socket.

Ignored logs: `.local-dev/gs-023-{domain,player,typecheck,build,browser}-final.log`.
Browser result: `.local-dev/gs-023-final-browser-results/.last-run.json` (passed).
Routine images: `artifacts/screenshots/gs-023-founder-seated-at-front-desk.png`
and `gs-023-receptionist-refilled-and-returned.png`. Correction receipt:
`.local-dev/gs-023-m2-seat-correction-receipt.txt`.

Unit/domain checks cover newer command precedence, hire during return,
occupied/unreachable desk, missing/removed cooler, same-tick patient arrival,
interruption/retry, saved in-progress refill, and provider release/retail
regressions. This is technical acceptance of the three approved outcomes, not
owner playtest approval or full all-wrong graduation acceptance.

## Separate all-wrong graduation finding — exception approved

GS-016 already proves wrong answers fund the first Examination Room, door and
reload. Do not label that missing. Its proof stops before Level1 graduation.
Terra wrong_answer_acceptance replayed seed player-built-exam: two wrong-answer
tutorials plus the first ordinary two-decision recovery patient reach10 XP but
remain below the satisfaction gate. Astra independently reproduced the result.
Two patients remain queued, so this is a blocked route, not proof all possible
continuations are impossible. It does expose a gap in a guaranteed completion
claim: admissions stop at the XP threshold and completed scores cannot be
repaired by chores.

Ignored diagnostic and qualified result:
`.local-dev/gs-023-all-wrong-level-one-blocker.test.ts` and adjacent `.output.md`.
Parent independently passed the one diagnostic test.

Owner approved ("Yes you may") a narrow Level0 graduation rule: completing
both protected tutorial patients and building the accessible Examination Room
permits advancement regardless of answer-derived XP/satisfaction, preserving
real scores and later-level gates. Terra wrong_answer_acceptance owns M4
implementation and regressions, with Astra independent review and validation.
Earlier pending-approval records are historical; approval is now explicit.

M4 runtime is implemented in domain selectors and the player view model. The
existing functional-room check and explicit Advance button remain authoritative.
When both protected encounters are completed and the Examination Room is
accessible, Goals shows tutorial completion and the room instead of requiring
answer-derived XP/satisfaction. The all-wrong HUD truthfully reads 6/10 XP.
The normal per-level XP reset still occurs on advancement; saved answers,
learning histories and final patient satisfaction are unchanged. Later level
requirements and the ordinary Level-0 eligibility path are unchanged.

Parent reviewed the captured task-relative runtime diffs and passed domain
516/516, player467/467, all7 workspace typechecks, dependency/launcher checks,
and isolated build `.local-dev/gs-023-m4-build`. Focused final domain16/16
also covers natural mixed/all-correct advancement, missing or walked-out
tutorial patient, missing/inaccessible room, reload/history and later gates.
Logs: `.local-dev/gs-023-m4-{domain-final,domain-focused-final,player-final,
typecheck-final,build}.log`. Sol final natural desktop browser proof passed1/1
in1.4m: exactly3 wrong answers, normal $160 room debit and door placement,
completed Goals, honest6/10XP, deliberate Level1 advancement, and reload retaining
Level1/both completed encounters/three wrong answers. Parent reviewed passed
log/result, actual corrected spec and screenshot (84% satisfaction, $47.50).
Browser evidence: `.local-dev/gs-023-m4-sol-final.log`,
`.local-dev/gs-023-m4-sol-final-results/.last-run.json`, and
`artifacts/screenshots/gs-023-tutorial-graduation-ready.png`.
Earlier browser failures were test setup/workflow omissions: correct-only
feedback closure, existing tutorial coaches, and disabled opt-in Phaser hook.
No runtime edits were needed for those failures.
Parent stopped its M4 private4198 preview (PID14484) through the original process
session; native netstat confirmed no4198 listener afterward. Owner4173/save
were not operated. M4 remains local/uncommitted, with no push or deployment.

M4 ownership: Terra wrong_answer_acceptance implemented runtime and regressions;
Astra reviewed actual changes and independently ran validation; Sol
routine_completion owns browser-spec correction and proof. Pre-edit baselines
are in `.local-dev/gs-023-m4-baseline`. The added buildViewModels.test.ts test
was not snapshotted before editing; parent inspected its narrow import/test
addition directly. Do not misrepresent that file as having a captured baseline.

## Shared work, environment and closeout

Base branch beta at c26c96a111103d8665e33c9258ef54071d729f14 has extensive
inherited edits. Task-relative baselines: `.local-dev/gs-023-m1-baseline`,
`gs-023-m1-review-baseline`, `gs-023-m2-baseline`. Whole-path staging is unsafe.
Additional audit caveat: App.tsx and FacilityCanvas.tsx M2 pre-edit snapshots
were missed. Parent inspected their narrow onSeatFounderAtFrontDesk wiring
hunks directly; do not label reconstructed preimages as captured originals.
All other baseline-relative source/test edits were reviewed. Existing unrelated
edits remain. No PM-board edits, commit, push, deployment or owner-save operations.

Canonical opening remains START_GAME.cmd -> http://127.0.0.1:4173 in the owner's
existing profile; test origin/storage is separate. M1 worker used default build
output before copying to its isolated preview, so apps/player/dist was
regenerated once. No owner server was restarted. Further builds must use
explicit isolated --outDir. Initial shutdown report missed a lingering preview
child; exact M1 PID13468 was stopped and parent native netstat confirmed port56893
closed, without targeting owner4173 PID6300.

Feedback entries019/020/021/022/032 record implementation/technical verification
with owner playtest pending;018 records preserved GS-016 evidence and the new
graduation gap. Unrelated entries and PM board were preserved.

Next: owner playtests the three outcomes and approved graduation exception.
Use START_GAME.cmd and the existing127.0.0.1:4173 profile. A fresh test
campaign naturally shows the tips during the second patient's offsite wait;
existing campaigns beyond that wait do not rewind. Check desk return before
hire and secretary empty-water refill afterward. No save reset is required.
After owner acceptance, standing direction authorizes scoped audit/backup/remote
verification/archive; no deployment or unrelated source staging is implicit.
