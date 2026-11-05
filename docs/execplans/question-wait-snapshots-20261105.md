# Question wait estimates: one snapshot per open question

## Goal and scope

Repair owner flag `6818c905` for
`question.colon-cancer.preoperative-cross-sectional-staging.v4.r4`: a hepatic
ultrasound choice counted down while the other estimates remained fixed.
All displayed choice waits and their breakdowns must describe the same moment.
Every testing choice, including distractors, retains its runtime estimate.

Owned lane: player chart/answer-choice presentation, a shared UI snapshot
helper, and tests. Do not edit `apps/player/src/session/**`, clinical content,
or domain operation/service modules. Shared tree; preserve concurrent work.
No Git, agents, installs, network, browser automation, or release actions.

## Design decision

Use a presentation snapshot when the question first becomes visible, for the
entire displayed choice set. Reopening the chart or moving to another question
takes a fresh snapshot. Capture both the estimate and its detail text. Keep
answer identity/order, selection, disabled/read-only gates, and callbacks live.
Do not freeze accepted service/result countdowns or save this UI state.

`docs/features/diagnostic-timing-future-design.md` requires runtime quotes that
include queues and walking, derived from the accepted order's planner; it does
not require continuously refreshed answer labels. A snapshot uses that same
pure forecast without changing scheduling, allocation, or accepted frozen work.
The actual order still obtains its authoritative quote when accepted.

## Investigation and evidence

- The domain forecast subtracts the current facility tick from projected work
  completion. Existing resource work has an absolute end tick, so its remaining
  queue shrinks; an idle/external route starts relative to the current tick and
  keeps the same duration.
- The view model recalculates this forecast for unanswered current choices.
  Both chart layouts currently render the changing labels directly.
- `packages/game-domain/src/selectors.ts:1002–1004` returns the forecast's final
  end tick minus `state.facilityTick`. This is correct runtime forecasting, not
  a domain scheduling defect.
- `apps/player/src/session/viewModels.ts:1144–1160` obtains the current choice
  forecast and formats it against the current facility tick. Team discussions
  use the same presentation at line 1399. Previously `ChartPanel.tsx:529` and
  `MobileChart.tsx:53–57` displayed those live labels directly.
- All choices already used live forecasts. There was no ultrasound-specific
  countdown widget: the busy route's remaining queue decreased, whereas a new
  idle/external order still needed the same work duration. Updating all choices
  live therefore already produced the confusing mixed appearance. Freezing the
  complete comparison is the requested presentation repair.
- Deterministic reproduction uses the reported `v4.r4` variant, the existing
  domain timing fixture, installed ultrasound room/technician with accepted
  work until tick 60, the production preview/formatting helpers, and five real
  `ADVANCE_TICK` commands. Ultrasound: **146 → 141 game minutes**, queue
  **60 → 55**; an external alternative stays **529**. Both component layouts
  failed before the repair (2/2 regressions, 5.67 s; `red.log`).
- No domain timing helper, session file, clinical content or save contract was
  changed. No Level 5 bound inputs change in this lane.

## Implementation

`ui/useQuestionWaitSnapshots.ts` snapshots only `etaLabel` and `detailLabel`,
atomically for a visible question's complete choice set. Identity uses chart,
decision, variant, prompt (for legacy/team adapters), and the unordered choice
IDs. Reordering choices does not refresh the snapshot. A newly visible choice
set (for example, mode preparation finishing) takes one fresh snapshot for all
its choices. Empty/preparing choices never create a premature snapshot.

Both `ChartPanel` and `MobileChart` apply this hook to their decision steps;
their existing team-discussion adapters inherit it. The snapshot resets on
close/unmount, chart change or question change, and retains only questions in
the currently open chart. Selection, disabled flags, answer order, feedback,
callbacks and accepted-result/patient phase clocks continue to use current
props. No new copy or gameplay state was added.

## Milestones and acceptance

1. Reproduce changing ultrasound wait and stable alternative with the real
   domain forecast and advancing facility ticks. Record a failing component
   regression for phone and desktop.
2. Apply a common UI-only snapshot to both charts (including their shared team
   discussion adapters). Test refresh boundaries and live action gates, and
   ensure pending result countdowns continue updating.
3. Run focused Vitest tests, full player tests with sandbox preload and
   `--pool=threads`, and player typecheck. Record exact output and shared-tree
   limitations. Add a concise handoff with browser verification steps.

## Progress

- Repository instructions, current handoff, timing design and both chart
  presentations inspected. No session/domain/clinical edits made.
- Implementation complete. Ten new phone/desktop component regressions cover
  real resource queues, close/reopen/chart/question identity, delayed/legacy
  choices, live gates/order/selection, pending countdowns and team discussions.
- Focused validation: **8 files / 66 tests passed**, 9.89 s (sandbox preload,
  `CI=true`, `--pool=threads`). Player typecheck passed.
- Full player: **373 files passed / 1 failed (374); 3,550 tests passed / 1 failed
  (3,551)**, 475.89 s. The sole failure is the existing retired-encounter codec
  string limit, described below; this is not a fully green suite.
- All four owned source/test hashes stayed unchanged throughout validation.
  Read-only `viewModels.ts`, `diagnosticTimingPresentation.ts` and domain
  `selectors.ts` also match their start-of-task hashes.
- Implementation and requested sandbox validation complete. Manager browser
  review and the independent codec failure remain outside this lane.

## Validation receipts and limitation

Artifacts: `.local-dev/question-wait-snapshots-20261105/` (local, not a release).

| Check | Exact result | Receipt |
| --- | --- | --- |
| Before-fix busy-resource regression | 1 file failed; 2/2 tests failed; 5.67 s | `red.log` |
| Final focused | 8 files / 66 tests passed; 9.89 s | `focused.log` |
| Full player | 373 files passed / 1 failed; 3,550 tests passed / 1 failed; 475.89 s | `full-player.log` |
| Player typecheck | Exit 0 | `typecheck.log` |
| Independent codec reproduction | 1 test failed / 11 skipped; 6.65 s | `existing-codec-failure.log` |

The full-suite failure is
`src/session/cloud/separateCampaign.test.ts > explicit separate account campaign
for a divergent local branch > retains real retired encounters which no longer
exist in the playable state`:
`CloudCodecError: JSON string exceeds the codec limit.`
The stack reaches `codecJson.ts:63` from `encodeCloudEvidenceCheckpoint` at
`separateCampaign.test.ts:54`. It reproduces in isolation without importing the
chart UI/hook, and matches the pre-existing retired-codec failure recorded in
`docs/execplans/evidence-tick-perf-20261104.md:98` and the prior current handoff.
Session/cloud files are explicitly excluded from this milestone; no limit or
safety assertion was weakened.

Commands (PowerShell, current root; preload only accommodates the sandbox's
Windows network-drive probe and prevents Git invocation):

```powershell
$env:CI='true'
$env:NODE_OPTIONS=(($env:NODE_OPTIONS+' --require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/restroom-reception-refill-20261104/validation-preload.cjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/ui/QuestionWaitSnapshots.test.tsx src/mobile/MobileChart.test.tsx src/ui/ChartPanel.test.tsx src/ui/EmployeeDiscussionPanel.test.tsx src/ui/chartStructuredFeedback.test.tsx src/ui/QuestionFlagControl.test.tsx src/session/answerChoiceTimingPresentation.test.ts src/session/diagnosticTimingViewModels.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck --workspace @gamify-surgery/player
```

## Files and handoff

- `apps/player/src/ui/useQuestionWaitSnapshots.ts` — shared, transient wait-only
  snapshots, bounded to the currently displayed chart questions.
- `apps/player/src/ui/ChartPanel.tsx` — apply snapshot to desktop decision steps.
- `apps/player/src/mobile/MobileChart.tsx` — apply snapshot to phone decision
  steps; both team-discussion adapters inherit their respective chart behavior.
- `apps/player/src/ui/QuestionWaitSnapshots.test.tsx` — ten new regressions.
- `docs/execplans/question-wait-snapshots-20261105.md` — this plan and receipts.
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md` — additive worker handoff; preserve
  other workers' handoffs.

Manager browser verification: in a disposable campaign, keep an operational
ultrasound room/technician busy, open the colon-cancer preoperative staging
question, and record every choice's wait/breakdown. Let five facility minutes
pass without closing it: every choice keeps the opening estimate/breakdown.
Close/reopen: the whole choice group receives fresh estimates. Submit/enact an
order: the accepted result's countdown continues normally. Repeat on phone and
desktop; check one team discussion as well. No browser run is claimed here.
The owner launcher/origin/profile remain unchanged.

Local work only: no Git, install, network, database, deploy or release action.
Manager owns integration, the unrelated codec failure, and any checkpoint.
