# APP demand and scored-arrival identity diagnosis (2026-11-03)

## Goal, ownership and constraints

The diagnosis reproduced the live round-six content's Level 4 APP on/off arrival
identity failure and classified it as (b), conflicting with accepted patient-flow
semantics. The manager has now accepted that diagnosis and authorized the scoped
test assertion implementation described below. Preserve the original diagnosis
and validation as historical evidence; current scope permits no runtime fix.

Own only this diagnosis, the fairness test in level-four-integration.test.ts and
its necessary imports, plus this plan/current handoff. No runtime, clinical
content, question/test-choice-order, evidence, save/cloud/entry or character
edits. The cloud worker is active in apps/player/src/session/cloud; preserve its
work. No Git, installs, network, agents, or rebind. Only live-tree writes.

## Repository state and stable inputs

Read AGENTS.md, current handoff and the round-six author handoff. The author
reports equal 24 arrival counts/times but a case difference for encounter.auto.4.21
at tick 1255. Current retained M9 is rebind 12: 28,804 commands / 6,010,006 cents.
Live reducer.ts and waiting-destinations.ts match released runtime after newline
normalization; test-choice-orders.ts differs as part of the paused question lane.
Existing retained-input mismatches are recorded before work. No source was edited.
Baseline: .local-dev/app-arrival-selector-20261103/baseline-hashes.json (810 files).
Saved before domain sources and read-only diagnostics live in the same directory.

## Milestones and acceptance

- [x] Read instructions/handoffs, capture baseline and start exact focused test.
- [x] Instrument genuine selector calls without changing on-disk runtime source;
  locate the first pool/active-concept/eligibility and chosen-case difference.
- [x] Classify (a) bug with compatible minimal fix or (b) legitimate invariant
  conflict; record evidence and preserve the assertion in either case.
- [x] Run focused, Level 4/5 domain files, full domain (threads), seven typechecks.
- [x] Conditional fix gate assessed: no fix (b), so no fresh full M9 replay.
  Released fairness and legacy-load controls run; zero bound input changes.
- [x] Verify source/content/evidence preservation and append manager handoff.

## Validation and decisions

Use PowerShell npm.cmd, CI=true and --pool=threads with bounded workers. Capture
JSON/native exits. Distinguish pre-existing clinical binding/history drift and
timing failures from the APP identity failure. Current full suite is shared with
cloud work; domain/clinical inputs must remain fixed for diagnosis.

The selector uses purpose-derived deterministic randomness, not a shared mutable
RNG cursor. It excludes all concepts in an answerable encounter and admits a
multi-decision case only when every concept is unseen/due and unreserved. Trace
the actual active reservations, eligible cases, compatible pools and draw inputs
before deciding whether those semantics or eligibility gates cause the failure.

## Next action

Manager reviews the completed scoped assertion and validation below. The earlier
diagnosis and its then-failing assertion are retained as historical evidence.
Implementation/validation is complete; runtime/content/evidence remain unchanged.

## Accepted assertion scope (manager instruction, 2026-11-03)

Manager accepts classification (b), consistent with the 2026-10-17 decision:
APP staffing may change real walkout timing and the live concept pool; scored
selection must be independent of RNG consumption when actual selection inputs
agree. No pending-case reservation mechanism.

Own only the fairness test in packages/game-domain/tests/level-four-integration.test.ts
(and necessary imports), this plan and handoff records. Observe actual selector
calls without changing their behavior. Preserve equal 24-hour arrival counts and
times. Require equal non-flow selection inputs, equal choices for identical
effective pools, and specific flow witnesses plus counterfactual replay for every
different pool. A prior proven flow-dependent case difference may explain its
later concept reservations; unexplained differences must fail. At least one
arrival must compare identical inputs. The released overlay must prove 24/24
identical inputs and identities, rather than merely allow flow exceptions.

New baseline/receipts: .local-dev/app-arrival-selector-20261103/accepted-scope/.
No Git, installs, network, runtime, clinical/question or evidence changes. Shared
cloud work remains outside ownership. The test file is not a Level 5 bound input.

- [x] Implement scoped assertions and inspect their exact diff.
- [x] Run the complete Level 4 file with live content and read-only GS-release overlay.
- [x] Run full domain (threads) and all seven workspace typechecks.
- [x] Audit unchanged Level 5 inputs and update the handoff with exact results.

Implementation: a scoped, finally-restored spy observes actual selector arguments
and unchanged return values at the genuine tick-internal call. Every arrival is
linked to an observed call. Counts, classes, IDs and arrival times must match.
Seed, generator version, sequence, tick, real timestamp, complete eligible case
definitions and learning histories must match. Matching active-concept,
compatible-case and due/unseen concept pools require matching case/concept/kind.

For different pools, every differing live reservation must have a specific
same-chart walkout commitment witness (departing at/below threshold versus still
live above threshold), or descend from an earlier already-proven flow-dependent
identity. Frozen case/concept identities must match the original captured
selection. Swapping only witnessed encounters must reproduce the entire opposite
pool and actual selector result in both directions. Unmatched live charts,
unexplained parents, changed common inputs and zero comparable arrivals fail.
Archived/retained terminal charts both reserve nothing and are irrelevant.

The read-only release validation config sets LEVEL_FOUR_M9_RELEASE_CONTROL=1:
the test additionally requires exactly 24 arrivals, 24 identical-input
comparisons, 24 identical case identities and zero flow exceptions. The overlay
loads only clinical-content source and test-choice-orders from GS-release; all
test/runtime files remain live. No source swaps or evidence writes.

Completed validation for current test bytes:

- Full Level 4 live: 5/5 pass, 136.34 s, native exit 0.
- Full Level 4 released overlay: 5/5 pass, 134.30 s, native exit 0, strict 24/24.
- Seven workspace typechecks: pass, native exit 0 after the final correction.
- Full domain threads/maxWorkers=2: 4,347 pass / 26 pre-existing fail / 1 existing
  opt-in skip, 166 files (165 pass / 1 fail), 863.24 s, native exit 1. Level 4 is
  5/5 inside the full run too. Every remaining failure belongs to the unchanged
  Level 5 file: one retained-input binding mismatch and 25 added-history loaded
  hashes. No other failures or timeouts. The previously failing APP assertion is
  now a pass, accounting for the improvement from 4,346/27 to 4,347/26.
- Final seven-workspace typecheck after all concurrent test edits: pass, native
  exit 0 (7.74 s).

Two private negative checks also reject the intended faults. A load transform
changes only captured test observations after the genuine 24-hour simulation;
repository test/runtime bytes remain unchanged. Altering the first off-side case
identity with identical inputs fails the identical-input assertion at arrival 0,
tick 1. Marking an otherwise-live chart completed to release its concept without
a walkout fails the flow witness guard at arrival 1, tick 58. Each probe exits 1
with exactly the intended failed test; four unrelated tests are filtered.
Receipts: negative-checks.json and negative-{identity,reservation}.json/log.

Initial development run exposed the test's overly strict requirement that
terminal tombstones exist on both sides; corrected to compare reservations
before requiring a live witness. The release config's default bundler hit the
sandbox's spawn EPERM restriction; --configLoader=native resolved it without
changing repository configuration. Its module-type notice is informational.
Private attempt-1 receipts and final reports are retained in accepted-scope/.

Only imports and this one test changed (owned-test.diff). No Level 5 bound input
changed. Concurrent updates to five other domain tests (approved admission,
patient supply and diagnostics/patient supply, surgery-center batch, choice-order
inventory), three question research records and the current handoff were observed
and preserved. All five changed test files pass in the full run; final typechecks
cover the current shared tree. Runtime, clinical and question source inputs remain
at the milestone baseline. The owned test's hash is unchanged across both positive
content runs, negative probes, full suite and final typechecks. All 380 read-only
release inputs also remain at their retained hashes. No evidence or launch pins
were rewritten. No Git, installs, network, runtime or clinical-content edits.

Exact PowerShell commands from the live root (CI=true for test commands):

```powershell
$env:CI='true'
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/level-four-integration.test.ts --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GamifySurgery/.local-dev/app-arrival-selector-20261103/accepted-scope/level-four-live.json
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --configLoader=native --config=C:/Users/rowla/Projects/GamifySurgery/.local-dev/app-arrival-selector-20261103/accepted-scope/released-vitest.config.ts tests/level-four-integration.test.ts --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GamifySurgery/.local-dev/app-arrival-selector-20261103/accepted-scope/level-four-released.json
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GamifySurgery/.local-dev/app-arrival-selector-20261103/accepted-scope/domain-full.json
npm.cmd run typecheck
```

Handoff/receipts: CURRENT_THREAD_HANDOFF.md append and accepted-scope/validation.json,
owned-files.json, owned-test.diff, failure-classification.json, positive and
negative JSON/logs, private read-only overlay/probe configs and preservation hashes.
Local only; manager retains integration, backup and release acceptance. Remaining
26 Level 5 failures are outside this test-only authorization and are not waived.

## Historical diagnosis and decision (before manager acceptance, 2026-11-03)

Classification **(b)**: the unconditional identity comparison conflicts with
the accepted active-concept/walkout semantics under real APP-dependent facility
state. The original assertion remains unchanged and failing. A manager decision
is required before changing its scope or game policy. No domain fix is made.

The prior manager decision at
docs/execplans/level4-launch-plan-20261008.md:5543 explicitly accepts selection
changes caused by APP-driven satisfaction/walkout timing, requires stateless RNG
independence rather than identical patient-flow state, and rejects a pending-case
reservation mechanism. This diagnosis independently reproduces that mechanism.

Exact focused Vitest run: 1 failed / 4 filtered, 91.56 seconds. Seven workspace
typechecks pass, native exit 0. Full domain threads/maxWorkers=2 completes in
892.93 seconds, native exit 1: 4,346 pass / 27 fail / 1 pre-existing opt-in skip,
166 files (164 pass / 2 fail). Level 4: 4 pass / 1 identical fairness failure
(156.60 seconds). Level 5: 10 pass / 26 fail (415.35 seconds). Its failures are one
pre-existing clinical source-binding mismatch and 25 pre-existing legacy hashes
changed only by initialization of 22 added concept histories. Released-content
controls match all 25 retained hashes; removing only the 22 new histories from
live diagnostic clones restores all 25 hashes. No other failures or timeouts.
clinical-selection: 8/8; original minute-900 APP regression, gift-only fairness,
service-queue waiting (39/39), nurse and garden-return regressions all pass.

Detailed commands, every failed test/category and receipts:
docs/handoffs/app-arrival-selector-20261103.md and
.local-dev/app-arrival-selector-20261103/{domain-full.json,
failure-classification.json,validation.json}. All 380 read-only GS-release source
inputs match the retained M9 bindings exactly; live/release runtime is identical
after newline normalization except the explicitly overlaid question-lane file.

Instrumented genuine calls (in-memory source-loader observer, unchanged source):
both sides have 24 arrivals with identical times and learning state. First
input/choice divergence is routine sequence 21 at tick 1255, id
encounter.auto.4.21. Eligible cases are identical (1012) and capabilities identical
(20). APP-on chooses case.fhh.suggestive-results-confirmation; APP-off chooses
case.gs028f.melanoma-bowel.c1-spread-relationship. Compatible pools are 991/993;
unseen concept pools 336/337; the same routine.21.new_concept.concept.v1 purpose
draws index 95/124. Only the reactive-neck-node concept reservation differs.

Encounter.auto.4.16 arrived at tick 949 as the same pediatric neck-node case in
both runs. Check-in is tick 969: APP-on has no litter and penalty 4; APP-off has
one visible litter item and penalty 6. Both reach the same pediatric waiting
chair. APP-off commits to leaving_after_walkout at 1248 (45 satisfaction);
APP-on remains answerable at 1255 (46, threshold 45), commits at 1258. Physical
exit occurs at 1276/1286 respectively. This is logical commitment timing, not the
already-fixed dependence on physical exit progress. A counterfactual that changes
only this encounter's movement/reservation swaps the selected cases exactly in
both directions. Retaining a terminal chart's reservation or releasing a live
chart's reservation would reverse existing tested selector semantics.

Released-content control uses all clinical-content source bytes plus
test-choice-orders.ts read from GS-release via an in-memory loader overlay;
runtime remains current live and no files are swapped. All 24 identities/times
match on/off; there are no selector input differences. New primary-concept
references change the initial unseen pool from 336 to 343 (12 referenced IDs
added, 5 removed), so the deterministic prefix changes starting at tick 1. The
new sequence picks the pediatric chart at sequence 16; released content picks a
paired nutrition chart whose commitment is by the tick-1255 selection on both
sides (APP-on 1255; APP-off 1245). No
APP-dependent eligibility or paired-only eligibility defect is observed.

Artifacts are in .local-dev/app-arrival-selector-20261103: focused-before.json,
live-selection-trace.json, released-selection-trace.json, saved first-input
states, counterfactual-selection.json and world-trace.json. The latter records
litter placement divergence starting at tick 338, and different litter locations
at tick 926 causing visible-litter pressure at the tick-969 check-in.

No Level 5 bound input was changed by this milestone. All 810 baseline-monitored
files matched after validation; only CURRENT_THREAD_HANDOFF.md then received an
append with its previous bytes preserved. Six pre-existing retained-binding mismatches were recorded:
clinical answer-choice-timing/index/synthetic-content; domain test-choice-orders;
and newline-only reducer/waiting-destinations. Canonical evidence is untouched.
Since no fix is proposed, the conditional released-content full M9 regeneration
proof is inapplicable; the released fairness control was run, not a fresh M9
campaign. Retained M9 remains 28,804 commands / 6,010,006 cents.
