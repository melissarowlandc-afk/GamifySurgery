# Answered chart action recovery

## Goal
Fix owner-reported answered questions losing all completion/enact/done actions, leaving patients waiting until satisfaction causes departure. Preserve completed features, dirty work and saves. Recover already-stuck active encounters where safe without replaying answers/rewards or skipping required tests.

## Intake and constraints
2026-09-29: root AGENTS/current handoff read, shared worktree467 dirty entries. Endoscopy goal/setup is complete. Concurrent periop-preparation M2 owns domain operation/result-gate integration; GS028 content and GS026 movement work also active. Inspect fresh state, preserve all and snapshot touched files before edits. No clinical-content meaning changes, economy changes, install, commit/push/deploy, save resets, or owner server/profile manipulation. Owner pathway START_GAME.cmd -> http://127.0.0.1:4173 usual persistent profile remains unchanged.

## Ownership and milestones
- [x] Parent: intake, async request for example (not a blocker), planning and delegation.
- [x] Sol `/root/test_order_architecture`: read-only domain lifecycle diagnosis/reproduction/proposed correction.
- [x] Parent: independent chart UI/action visibility investigation; decide bounded implementation ownership after evidence.
- [x] Sol `/root/test_order_architecture`: minimal fix and saved-state recovery plus correct/wrong natural approach and recovery regressions.
- [x] Independent parent review/checks and private browser proof; no owner save access.
- [x] Update current handoff and report exact verification/limitations.

## Acceptance
Answering correct or incorrect, terminal or intermediate questions leaves a valid next action or explicit real ongoing work. Reopen/reload must not strand a patient. Required onsite/external tests still execute, departure still waits appropriately, and scores/receipts are not duplicated. Preserve frozen content/saves and concurrent prep features. Verify representative natural UI flow, not only fabricated state. Private browser separate free port/profile, cleanup afterward.

## Progress / next action
Sol is investigating domain transitions read-only; parent checks ChartPanel/viewModels and session action mapping. Await concrete root cause before implementation. User-specific example pending but broad investigation continues.

## Confirmed defect and implementation decision
Sol found and parent verified walking_to_care arrival unconditionally resets lifecycle to active_action_required after handling resolved and active_pending_result. Answering final questions is allowed during the approach. Final submission sets resolved_summary_available, completed step, terminal feedback and settlement; arrival overwrites that lifecycle. Correct final feedback is already acknowledged, so no canFile/ACK/pending button remains. Wrong final feedback cannot be acknowledged because the command requires resolved_summary_available. Close/reopen then strands an already-answered patient until walkout.

Sol authorized to change ONLY care-arrival lifecycle handling and narrow persisted known-signature recovery, plus targeted regression tests. Snapshot current source; concurrent periop M2 writes disjoint functions in reducer/persistence, so contextual patches only. Preserve terminal completion, active service work and exact-once rewards. No resurrection of already-walked-out patients. Inspect closed/waiting version of corrupted signature. Propose any broader OPEN_CHART recovery before editing it.

Sol visitor_browser_acceptance owns ONLY new tests/e2e/answered-chart-action-recovery.spec.ts and ignored browser artifacts using private4198. Browser reproduces final answer during approach then arrival, correct/wrong, reload, visible next action and departure. No fabricated post-answer state; pre-fix evidence only if truly observed. Parent has inspected UI/footer/close helper and CSS; no UI source defect established. No user-specific example yet, but concrete reproduction is sufficient to proceed.

## Implementation and reviewed evidence
Sol added a seven-line resolved_summary_available guard in completePatientMovement.walking_to_care. Persistence repairs only active_action_required + completed resolution + final current step completed with an answer + terminalFeedback + settlementId, clearing stale idle/feed attention. Existing pending work and walked-out encounters are excluded. No schema bump, new UI behavior, rewards, answers, fees or test execution changes. Close leaves the corrupted lifecycle active_action_required, so reload repairs both open and closed/waiting versions. Nonfinal terminal branches are not supported (clinical schema rejects them); last-node guard is intentional.

Root reviewed actual baseline-relative reducer/persistence hunks and all four new regression cases. Source snapshots: `.local-dev/answered-chart-recovery/before/`; reviewed scoped diffs alongside parent logs in same evidence root. Sol's focused recovery/timing/service-procedure suites68/68 pass, including queued terminal tests and exact-once service fees. No observed pre-fix execution claimed: prior code and regression boundary prove the overwrite by inspection; shared source was not swapped under concurrent work. User-specific case never required for this concrete race.

Parent verification: new recovery tests pass; chart UI/session6/6 pass; domain and player types pass; isolated production build, app boundaries and launcher contract pass. Full domain run1012/1016 passed with four five-second timeouts in two GS028 batch suites and no assertion failures. Both affected suites rerun serially with20-second timeout pass382/382 (27.06s); no remaining observed domain failure. No test timeout source/config changes made.

Browser primary run: three applicable scenarios pass (three project-gated skips): correct and incorrect final answers during care approach remain actionable after actual arrival/reload; compact wrong-answer feedback/footer remains accessible. Parent reviewed screenshots of both action variants and compact layout. Wrong Dismiss is confirmed one-click ACK+file+departure; an initial test's redundant second-click expectation was corrected. Additional motion-proof attempt used throttled saved-state sampling and is not needed for the button-fix acceptance; final browser receipt/cleanup pending. Do not claim pre-fix browser reproduction or owner-save execution.

## Final acceptance and next action
Final dedicated browser run3 PASS/3 project skips in48.0s; parent inspected exact final spec, transcript-derived result, dedicated browser-results/.last-run.json and all three final screenshots. Only departure state/native actor presence is asserted, no full visible-walking screenshot claim. Owned private4198 VitePID49892 stopped, worker verified process/HTTP closed and parent confirmed no listener. Sol test_order_architecture implemented; Sol visitor_browser_acceptance validated in browser; parent reviewed actual diffs/tests/images and ran independent regression/type/build checks. All implementation delegated, no parent runtime edits.

Complete locally. Owner should Save & Close, reopen through START_GAME.cmd at http://127.0.0.1:4173 in usual browser profile, and resume existing campaign. Deserialization repairs still-present affected completed encounters; already-walked-out patients are not revived. Owner save not inspected or modified by tools. Existing dirty and concurrent work preserved. No commit/push/deploy; say "push to GitHub" for audited backup. Next task is owner playtest/any specific additional example, not rebuilding completed features.
