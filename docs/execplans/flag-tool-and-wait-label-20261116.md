# Question flag status tool and diagnostic preview labels - 2026-11-16

## Goal and scope

Add the owner-approved question-flag status command and batch form, with strict
preflight validation, user disambiguation and independent read-back. Present
unchosen diagnostic waits as hypothetical estimates; actual ordered work keeps
remaining-time wording. Preserve every testing choice's runtime quote, including
distractors, and the existing open-question snapshot behavior.

Own scripts/beta-invites command/feedback modules, README and tests, plus player
timing presentation and related tests. Clinical-content, domain, balance,
gameplay, saved data, SQL and browser storage are read-only. Shared tree:
preserve concurrent edits. No Git, agents, network/live DB, installs or deploys.
Supabase skill read for existing local schema/client conventions; explicit
offline restriction overrides its remote-documentation steps.

## Repository state and decisions

- Starting owned bytes and hashes: .local-dev/flag-tool-wait-label-20261116/before
  and intake.json. Unowned source guards recorded separately. No repository
  resets or whole-file release ports.
- question_flags identity is (user_id, flag_id), not flag_id alone. Validate
  all syntax and all batch targets before PATCH. Bound values to the existing
  80-character version / 500-character resolution-note checks. Only fixed status
  accepts/requires a version; all other statuses clear it. Open clears resolved
  time; other statuses use this command's current UTC time.
- Batch calls are sequential, not a transaction. A transport failure can leave
  a confirmed prefix; report that prefix without claiming unconfirmed success.
- Selector forecasts are pure hypothetical plans; duration can fall with a
  resource queue. Change presentation only, to "If ordered now: about ...".
  No timing, routing, order, FSRS or catalogue edits. Chart-open wait snapshots
  still keep choices consistent while a question is visible.

## Milestones and acceptance

1. [done] Inspect schema/patterns; add single/batch command and fake-client
   regressions covering validation, ambiguity, exact scope and read-back errors.
2. [done] Explicit hypothetical wait labels and pure-preview regressions,
   keeping ordered countdowns and queue-aware calculations unchanged.
3. [done] Owner-tool tests, focused player/domain, full CI player/threads,
   seven typechecks, boundaries and build. Run pacing alone last (26,281 +/-10%).
   Verify Level5 CHECK remains 35,342 / 6,966,492 / 551 / 0 without rebind.
4. [done] Exact outputs, paths/hashes, scoped port patch and handoff.

## Validation and discoveries

- Existing owner suite before: 206/206 PASS. Final owner suite: 232/232 PASS,
  10 suites, fake SDK fetch/files only. No credentials or live project accessed.
- Initial four-file player control: 25/25 PASS, 10.88 s. Final eight-file focus:
  52/52 PASS, 29.20 s, including two new phone/desktop purity tests and existing
  differential/queue/countdown checks. First added DOM text assertion incorrectly
  assumed no wrapper/details; corrected to match the actual container while
  retaining exact etaLabel assertions. No pre-existing assertion was weakened.
- Domain diagnostic orders/timing: 44/44 PASS, two files, 35.16 s.
- Full player CI/preload/threads: 472 files / 5,653 tests PASS, no failures or
  skips, 869.31 s, exit 0. This shared tree includes additional concurrent tests;
  this lane adds only the two preview-purity cases. All tests/assertions retained.
- Initial root build: all seven workspace typechecks and boundaries PASS,
  22,539 tracked paths plus launcher contract, 700 modules, 11.38 s, exit 0.
  Offline preload blocks optional net-use and Git probes. Boundary adapter reads
  the current checksum-verified index without a Git process; current dependency,
  source/private-prefix and launcher checks still execute.
- Native CHECK already matches 35,342 / 6,966,492 / 551 / 0, final tick 33,091.
  An extra comparison to the prior worker's public sample hashes is inapplicable:
  that control froze a different source epoch (14 non-overlay input differences
  at first inspection, 13 after a concurrent restoration).
  No failed cross-epoch comparison is presented as passing. Four unowned domain
  sources changed transiently during this task, then three returned to their
  intake hashes; reducer.ts and a later index.ts edit remain outside this lane.
  Preserve all of it. Exact observed intake/current deltas are recorded privately.
- Paired native before/after presentation controls use one stable 778-file public
  source capture (67,860,527 B) in separate processes; every quote must leave the
  serialized state unchanged, and all 41 serialized samples must match exactly.
  No live source is overwritten, no private save is read, no rebind occurs.
  Paired CHECK PASSES: both runs 35,342 / 6,966,492 / 551 / 0, final tick
  33,091; all 41 serialized samples have identical hashes/byte lengths. Each run
  exercises nine actual testing-choice quotes without changing the state. Before
  282.74 s / after 263.36 s. This replaces neither canonical data nor input pins.
  Current-checkout build repeated after drift also PASSES: seven typechecks,
  boundaries/launcher, 701 modules, 10.47 s, exit 0. Final pacing alone PASSES:
  first finish 26,377 vs 26,281 (+0.365282904%, within +/-10%), 442 completions,
  zero walkouts, closing cash 5,913,995 cents. No canonical data was rewritten.
- The first private native harness failed at TS-loader setup (static imports ran
  before registration); it was corrected to dynamic imports. Original logs are
  retained and not counted as a successful replay. All product sources stayed
  frozen throughout these harness corrections.

## Next action

Bounded implementation/validation complete. Manager reviews the scoped port,
reruns integration against the settled shared tree and executes any real flag
updates only after the relevant fixes are live. No next task started.

## Scoped files and implementation

| Path | Change |
| --- | --- |
| scripts/beta-invites/beta-feedback.mjs | Shared flag-status argument/file validation, complete-identity preflight, four-column update and separate read-back; existing feedback command/digest retained. |
| scripts/beta-invites/beta-invites.mjs | CLI/help and interactive single-flag command; batch JSON is validated before credentials/client creation. |
| scripts/beta-invites/beta-flag-status.test.mjs | New synthetic SDK-fetch tests; no live credentials, filesystem feedback writes or network. |
| scripts/beta-invites/README.md | Usage, batch format, ambiguity, note/version/time rules and partial-failure behavior. |
| apps/player/src/session/diagnosticTimingPresentation.ts | Prefix only hypothetical test quotes with "If ordered now: about"; no duration/forecast/order changes. |
| apps/player/src/session/diagnosticTimingPresentation.test.ts | Exact new quote goldens; actual ordered countdown assertions retained. |
| apps/player/src/session/answerChoiceTimingPresentation.test.ts | Exact hypothetical label with independent raw quote duration. |
| apps/player/src/session/clinicalServiceLabels.test.ts | Exact fallback quote label. |
| apps/player/src/session/diagnosticTimingViewModels.test.ts | Both chart choice lists retain the same complete quote. |
| apps/player/src/session/multistepChoiceTiming.test.ts | Exact multistep quote label; totals/breakdown unchanged. |
| apps/player/src/session/surgeryCenterServicePreviews.test.ts | Exact service-choice quote label; routing/timing/history checks unchanged. |
| apps/player/src/ui/QuestionWaitSnapshots.test.tsx | Phone/desktop serialized-state/order/service immutability regressions; queue advance and visible snapshot checks. |

This ExecPlan and an additive CURRENT_THREAD_HANDOFF block complete the port.
The final manifest records exact before/after hashes and a scoped patch; no
clinical-content, domain, balance, source-pin or SQL file belongs to the port.

## Root cause, safety and operational limits

selectors.ts:995-1008 builds and forecasts a hypothetical diagnostic plan. Its
total is the forecast end minus the current facility tick. An installed busy
resource can therefore reduce a new quote while an offsite/idle alternative is
unchanged. diagnosticChoicePreviews caches only one projection; it neither
accepts a choice nor allocates work. The old compact presentation was just a
bare duration. The explicit hypothetical label prevents confusing that quote
with an ordered test's remaining time. Existing chart-open snapshots remain
consistent across all choices; closing/reopening refreshes the quote. Fresh
quotes continue to use the current queue, including distractors and walking.

The existing migrations enforce the flag statuses and exact fixed-version
constraint, 80-character versions and 500-character notes. Validation matches
PostgreSQL character counts, rejects invalid Unicode/NUL text, and normalizes
UUID case. A full batch's syntax and identities are resolved before writes.
Ambiguity uses an exact count rather than trusting the first returned row or
the provider page cap. Each PATCH and read-back uses both user_id and flag_id.
Only status, fixed_in_version, resolution_note and resolved_at are written.

The batch is intentionally sequential, not atomic; a transport error may leave
an already confirmed prefix. The error reports that count and stops without
claiming any unconfirmed success. Owner commands should run sequentially; a
separate administrator editing a resolution concurrently can cause a read-back
mismatch, which is reported as unconfirmed. The clock is the owner command's
current UTC time at each write. No schema/RPC/server change is needed or made.
Manager executes any real owner command only after its fix is live. Actual
credential/grant/network behavior was not exercised in this offline task.

## Exact validation and handoff

PowerShell, npm.cmd, CI=true for Vitest; existing offline net-use/Git-blocking
preload. No test/assertion/timeout/performance budget was relaxed. Complete logs,
native JSON and exit files are in .local-dev/flag-tool-wait-label-20261116/.

```text
node --test --test-isolation=none scripts/beta-invites/*.test.mjs
tests 232; suites 10; pass 232; fail/cancelled/skipped/todo 0
duration_ms 226.1621; exit 0

# apps/player, named eight-file focus, --pool=threads
Test Files  8 passed (8)
     Tests  52 passed (52)
  Duration  29.20s
exit 0

# packages/game-domain, diagnostic-orders + diagnostic-timing, --pool=threads
Test Files  2 passed (2)
     Tests  44 passed (44)
  Duration  35.16s
exit 0

# apps/player, CI=true npm.cmd test -- --pool=threads
# Also verbose/JSON reporters for complete, attributable results.
Test Files  472 passed (472)
     Tests  5653 passed (5653)
  Duration  869.31s
exit 0; zero skipped tests / collection errors

npm.cmd run build
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
[all seven workspace typechecks passed]
701 modules transformed.
built in 10.47s
exit 0

# Isolated before/after public source controls, no canonical writes
PAIRED CHECK PASS: 35342 / 6966492 / 551 / 0;
all 41 serialized samples byte-identical; final tick 33091
9 testing quotes exercised in each run; before/after exit 0

# Final QA command, run alone after all Vite/tests/build/native work
node tools/qa/content-pacing-check.mjs
firstFinishTick 26377; referenceTick 26281
driftPercent 0.3652829039990868
closingCashCents 5913995; completions 442; walkouts 0
caseCount 1436; registeredMeanings 1142
exit 0
```

The seven workspace checks are clinical-context-workbench (client and server),
player, balance-config, clinical-authoring, clinical-content, clinical-research
and game-domain. Non-failing Vite chunk/plugin and Node experimental-transform
advisories remain. The boundary adapter's live index checksum/inventory receipt
is retained; no Git process was run. The full player's test/runtime inputs were
loaded before the persistent concurrent reducer.ts edit. The final build/types
were rerun afterward; later index.ts drift is recorded in the receipt. The
native controls freeze one public input epoch. Manager
should rerun integration once the concurrent lane settles, rather than treating
any shared-tree run as a lock over another worker's sources.

Port exactly the 12 code/test/README paths above, this plan and the additive
CURRENT_THREAD_HANDOFF block. Raw before/after hashes and the normalized scoped
patch are in port-manifest.json and runtime-normalized.patch under the private
artifact directory. No SQL, domain, balance, clinical/topic/pin, private source
capture or generated dist asset is part of that port. No source outside the
owned paths was edited by this worker. Concurrent unowned changes and public
control input epochs are recorded separately; they are preserved.

Remaining operational limits: batch writes are not transactional; real hosted
credentials/grants/read-back remain manager-run. No live status was changed.
This is a local uncommitted checkpoint; manager retains review, port, backup and
release decisions. No Git, agents, installs, network/live DB, browser storage or
deploy operations occurred. Owner launch/origin is unchanged.
