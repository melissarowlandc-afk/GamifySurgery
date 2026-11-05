# Waiting chart attendance regression ? 2026-11-04

## Goal and scope
Reproduce the owner report that opening a seated waiting encounter does not send the patient and founder to an available examination room. Compare current routing against the archived pre-8997e411 release sources without Git. Fix the smallest confirmed defect while preserving busy service queues in waiting areas.

## Constraints and ownership
Live shared worktree only. Owned lane: domain service/reducer movement and focused regression tests; player presentation only if evidence requires it. Preserve the concurrent question and cloud/save lanes. No clinical content, question, test-choice-orders, evidence/results, save formats, installs, network, Git, or rebind. Manager owns release and evidence acceptance.

## Repository state and evidence
Baseline hashes and source copies: `.local-dev/waiting-chart-attendance-20261104/`. Retained release replay: 26,362 commands, 6,056,335 cents, 410 completions, zero walkouts. Exact pre-routing release sources are readable in `GS-release/.local-dev/service-queue-waiting-release-20261102/before/`. Seven source binding mismatches already existed at entry (clinical timing/index/schema/synthetic content, reducer, test-choice-orders, waiting-destinations); distinguish these from this lane.

## Milestones and acceptance
1. Reproduce chart attendance and compare pre-routing behavior; record causal source evidence.
2. Minimal fix plus regressions for patient/founder exam movement and busy service waiting.
3. Focused, Level 4/5 integration tests, full domain/player (threads), seven typechecks; Level 5 replay CHECK only with exact attribution and changed bound-input list.
4. Record receipts, validation, risks, and manager handoff. Do not rebind evidence.

## Progress
- Baseline captured; traced OPEN_CHART through chooseCareRoom, founder gating, and waiting/service dispatch.
- Found exact archived release-port sources for the pre-routing comparison. No runtime edit yet.

## Next action
Manager to supply the actual failing encounter/session state. Current, released and archived routine/pediatric probes pass; no runtime patch is justified yet. Full validation and CHECK receipts are complete below.

## Reproduction evidence (implementation unchanged)
The connected fixture uses real desk check-in and seat allocation, with valid facility access and operational waiting/exam rooms. Live domain checks pass for first open, save/reload, explicit founder chair, close/reopen, a temporarily occupied exam, and simultaneous queued visitor/encounter service work. Player projection releases the waiting support pose, shows both walks, and shows both exam-room endpoints.

The same fixture under an in-memory GS-release source overlay passes all six domain checks. The archived pre-routing reducer/service/pediatric overlay passes the four attendance checks and the encounter-service interaction. Its visitor queue check fails at the old desk position (x35 rather than inside waiting x29?32), confirming that the overlay really removes the service-waiting change. No physical source swaps were made.

`reduceOpenChart` (live reducer:3389; archive:3595), `chooseCareRoom` (live:965; archive:964), and `isFounderReservedForService` (live:10344; archive:10534) are identical after newline normalization in pre-routing, current release, and live code. Hash receipts: `function-comparison.json`. Current OPEN_CHART clears `waitingDestination` at reducer:3651 and starts `walking_to_care` at :3672; founder attendance is set at :3640. Queued service movement is scoped to that operation's actor at service-operations:1255?1258. The new visitor presentation helper is only called for service visitors (FacilityScene:7411).

The owner report is not yet reproduced and its actual root cause is not established. No runtime fix is justified by these results. A concise async question requests the patient's visit state/name/label to distinguish first visits from pending test/procedure charts. Do not mislabel positive tests as proof that the owner's report is resolved.

Validation is running: Level 4/5 files then full domain, full player with sandbox preload, and frozen-input Level 5 CHECK; seven typechecks passed. All new tests currently pass on unchanged runtime.

## Interim validation and limitations
- Focused domain: 66/66 across five files; final new chart file: 6/6. Focused player: 4/4 across two files.
- Current-release read-only overlay: 6/6 chart/service checks. Archived pre-routing overlay: 5/6, with the sole expected failure being a service visitor still at the desk; all four attendance checks pass. Complete ordinary traces are equal pre/live/release, and pediatric traces are equal pre/live. The archive's three source hashes match the release port receipt's before hashes.
- Full player: 336 files, 3,375/3,375 PASS. Seven typechecks PASS, including a final run after test edits.
- Level 4/5 files: 15 pass / 26 fail. All five Level 4 checks pass. Level 5 failures: source binding at test:47 plus all 25 old load hashes at :183 (before any tick). The release-content load control matches all 25 retained hashes. Live loading matches zero; deleting only added concept-history entries in an ephemeral control restores all 25. This confirms catalog growth, not movement, explains those load-hash failures. No assertion/pin/evidence was changed.
- An extra, unrequested `test:boundaries` attempt invokes Git to inspect tracked files; the sandbox rejected its spawn (`spawnSync git EPERM`). It is blocked under the No Git instruction and was not retried. No Git process started. This attempted indirect invocation is disclosed rather than represented as a successful check.
- Full domain and both CHECK replays remain running. Previous full replay receipts take about 44?46 minutes; the release control freezes all retained bound input bytes; the live run freezes that same 409-path map but also loads extra clinical modules. Writes outside private task receipts are rejected.

## Needed evidence for the owner report
The actual failing state is still needed: affected actor/encounter ID, lifecycle and current step, OPEN_CHART receipt, patient location/movement/reservations, founder activity and service reservation, pending diagnostic/service work, and room/door layout. A routine patient with a usable exam room is not stranded by either tested routing version. Do not declare the report fixed without that state or another reproducer.

## Full-domain classification
170 files: 4,354 pass / 29 fail / 1 existing opt-in skip, 915.57 s (threads, maxWorkers=2, CI timeouts). All six new attendance/service interaction checks pass. All 29 failures are classified in `failure-classification.json`:

- 26 Level 5 failures as above (one binding, 25 initial-load history hashes).
- `gs028-20261007-batch.test.ts:425`: pure ordinary-pool concept counts expect [144,257,274], receive [144,258,275]; case counts unchanged. Released-content control receives older [135,246,263], so current live test expectations target another catalog revision.
- `gs028-20261007-variety2-batch.test.ts:612`: pure counts expect [167,280,297], receive [167,281,298]; case counts unchanged. Released-content control receives [155,266,283], confirming the same catalog/expectation issue.
- `surgery-center-batch.test.ts:166`: all case reducer flows finish, but the final reviewed concept set gains two new clinical IDs (26 versus 24). This assertion passes with the released-content overlay.

No historical/content assertion was edited. Their live-only rerun reproduces 3/3 failures; the release overlay passes the surgery-center check and fails the two live-catalog count assertions with the older released counts. The existing skipped test is the opt-in historical 26,710-command replay in `game-evidence-incremental.test.ts`; the current full fresh replay is being run separately in CHECK mode.

## Final CHECK and handback
Both full CHECK replays completed with zero canonical evidence writes. Release control is exact: 26,362 commands / 6,056,335 cents / 410 completions / 0 walkouts, eight captured checkpoints and three reports identical. Live with 409 bound inputs frozen at 13:54 ET: 31,662 / 6,770,538 / 490 / 0; delta +5,300 commands, +714,203 cents, +80 completions. Clinical/question inputs differ; owned Level 5 bound-input changes are zero. Full checkpoint deltas and exact source provenance are in the private HANDOFF.md and level5-comparison.json.

Final focused reruns remain 66/66 domain and 4/4 player; seven current typechecks pass. The game-evidence OPEN_CHART command boundary also reaches both exam endpoints. All runtime files in this lane remain byte-identical to entry. No runtime fix was made, and the owner's failing state is still required. The bounded diagnosis/tests are handed back; the owner report is not resolved. No rebind or release action.

### Live replay provenance correction
File timestamps confirm the three batch-2a source modules were created before the live run (13:48?13:49 ET). They loaded at startup through the clinical index, and their data/evidence files changed at 14:04 ET. Their exact startup bytes were not separately archived by the 409-path retained-input freezer. Earlier wording saying batch-2a was outside the live run was incorrect and has been corrected in the handoff. Treat live 31,662/6,770,538/490/0 as an exploratory combined-clinical observation, not a fully source-bound acceptance replay. Released control remains exact, fully bound and unchanged. Only test-choice-orders differs on disk again after the captured bound-input map; all additional source changes are non-owned. No evidence rebind.
