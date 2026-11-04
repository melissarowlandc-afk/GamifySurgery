# APP demand / scored-arrival identity diagnosis — 2026-11-03

## Decision and scope

**Classification (b): the unconditional identity invariant conflicts with the
accepted patient-flow rules. No domain fix or assertion change.** The failure is
real and reproducible; it is not a stale numerical pin. The manager must decide
the assertion's intended scope before this lane proceeds further.

The existing manager decision in
`docs/execplans/level4-launch-plan-20261008.md:5543` already closes this class of
divergence as working as intended: APP staffing may change satisfaction and
walkout commitment, hence live concept reservations. Selection must be independent
of RNG consumption, not of different patient-flow state. It explicitly rejects a
pending-case reservation mechanism. This finding independently matches that
decision rather than proposing to reverse it.

Only this handoff, `docs/execplans/app-arrival-selector-20261103.md`, an append to
the current handoff and private `.local-dev/app-arrival-selector-20261103/`
diagnostics belong to this milestone. Runtime, test assertions, clinical content,
question/test-choice-order files, canonical evidence and launch pins are untouched.
No Git, installs, network, agents, owner save access or release-tree writes.
The active cloud lane is preserved.

## Stable reproduction and first differing call

The exact existing Vitest fairness test fails with CI=true, threads, one worker:
**1 failed / 4 filtered, 91.56 s**, assertion at
`packages/game-domain/tests/level-four-integration.test.ts:340`. The seed is
`level-four-m9-fairness`; setup and stepping use the original fixture unmodified.

An in-memory observer wraps the actual selector loaded by the existing Node source
loader. It observes the selector result after the original call and records its
pre-selection state; on-disk source is never substituted. Both sides make 25
selector calls (24 routine, one employee discussion). The first differing selector
input and first differing selected case are **call 23, routine sequence 21,
tick 1255**, real timestamp **1791622440000**. No earlier eligibility, compatible
pool, reservation or selection difference exists between APP-on and APP-off.

| At tick 1255 | APP on | APP off |
| --- | --- | --- |
| New encounter | encounter.auto.4.21 | encounter.auto.4.21 |
| Eligible cases | 1,012 | 1,012 (identical IDs/order) |
| Capabilities | 20 | 20 (identical) |
| Compatible cases | 991 | 993 |
| Reserved concepts | 7 | 6 |
| Unseen concept pool | 336 | 337 |
| Concept draw index | 95 | 124 |
| Chosen case | case.fhh.suggestive-results-confirmation | case.gs028f.melanoma-bowel.c1-spread-relationship |
| Chosen concept | concept.fhh.recognition-and-confirmation | concept.gs028f.oncology.small-bowel-melanoma-cutaneous-origin |

Both draws use `clinical_case_selection` and
`routine.21.new_concept.concept.v1`. The only reservation difference is
`concept.pediatric-clinic.reactive-neck-node-observation`. The only extra compatible
cases in APP-off are `case.pediatric-clinic.neck-nodes-after-cold` and
`case.pediatric-clinic.shrinking-mobile-neck-nodes`.

Across the full 1,440-minute trace, **both runs have 24 arrivals, identical arrival
IDs/classes/times, and identical learning state**. Case identity first differs at
the tick above. This is not evidence that the stronger time/count invariant holds
for every seed or under capacity exhaustion; it holds for this exact reproducer.

## Causal chain and source evidence

1. `reducer.ts:6063` builds stage/capability/employee-discussion-compatible cases;
   `reducer.ts:6079` calls `selectRoutineClinicalCase`. Both runs pass the same
   eligible list here; APP capacity does not change this eligibility call.
2. `clinical-selection.ts:62` reserves concepts in unresolved, still-answerable
   charts, excluding `leaving_after_walkout`. `clinical-selection.ts:69` requires
   every concept in a case to be unseen/due and unreserved. These rules work for
   paired cases too; the differing reservation here belongs to a single-concept
   pediatric case.
3. The same `encounter.auto.4.16` arrives at tick **949** as
   `case.pediatric-clinic.neck-nodes-after-cold` in both runs. Both check in at
   **969** and reach the same pediatric waiting-room chair. APP-on check-in has
   total facility penalty **4**; APP-off has penalty **6**, with an additional
   **2 visible-litter points**. `facility-experience.ts:213` computes that penalty;
   `reducer.ts:2397` freezes/applies actual conditions at check-in.
4. The world trace records different litter locations starting at tick **338**.
   At tick **926**, APP-on litter.13 is in the workshop, APP-off litter.13 in the
   reading room. The EVS worker removes APP-on litter.13 at **952**. At check-in
   969, APP-on has no litter; APP-off still has that one
   item. Litter candidates exclude employee positions at `reducer.ts:6337`, so
   physical staffing/traffic can change a purpose-derived environmental draw's
   candidate set. This is a world-state dependency, not a clinical RNG cursor.
5. Waiting decay and commitment are implemented at `reducer.ts:8694` and
   `reducer.ts:8759`. APP-off reaches satisfaction **45**, threshold **45**, and
   commits to `leaving_after_walkout` at **1248**. At 1255 APP-on is still
   answerable with satisfaction **46**, threshold **45**, and no movement; it
   commits at **1258**. Physical exit/finalization occurs at **1276 / 1286**.
   This differs from the previously fixed dependence on physical exit progress:
   the logical commitment itself is ten ticks apart.
6. Removing the concept reservation from an in-memory clone of APP-on (changing
   only this encounter's movement to its APP-off leaving state) produces exactly
   the APP-off choice. Restoring that reservation in APP-off (movement=null)
   produces exactly the APP-on choice. The original selector is used for both
   counterfactuals; no selector algorithm is replaced.
7. `clinical-selection.ts:129` chooses uniformly from the current compatible
   concept pool, then a compatible case variant. `randomness.ts:197` derives a
   fresh generator per seed/stream/purpose; `randomness.ts:216` uses unbiased
   rejection plus modulo by pool length. Different eligible pool lengths can
   yield different cases from the same purpose. There is no shared RNG consumed
   by provider traffic.

Existing tests explicitly require reservation of all concepts in active charts
(`clinical-selection.test.ts:145`) and release on committed walkout independently
of physical departure (`clinical-selection.test.ts:161`). Enforcing unconditional
APP-on/off identity here would require changing these semantics, making routine
patience/environment independent of genuine operations, or designing another
reservation/admission policy. None is a compatible minimal bug fix, and the prior
manager decision expressly rejects the pending-case workaround. The assertion
was left unchanged as requested.

## Why the new content exposes it

A read-only loader overlay supplies all clinical-content source and
`test-choice-orders.ts` bytes from GS-release while keeping the live runtime.
This released-content control has **24 equal identities/times**, equal learning,
and no selector-input differences. No live files are swapped.
All **380** read-only GS-release bound inputs match retained M9 hashes exactly;
every domain source except the explicitly overlaid question-lane
`test-choice-orders.ts` is identical to live after newline normalization. Those
release hashes are saved in `released-input-hashes.json`.

The initial eligible case IDs/count are identical across released/current content
(1,012), but their primary-concept references differ. The initial unseen pool is
**336 released / 343 live**: 12 referenced IDs added and 5 removed. Definitions
retained for old saves are not automatically current-case selector candidates.
Thus the same sequence-0 purpose already draws a different case at tick 1:
released laparoscopy-respiratory / live postoperative-scapula. The whole prefix
changes. At sequence 16, released content chooses a paired nutrition chart;
current content chooses the pediatric neck-node chart. In the released control
the former chart commits at 1255 on / 1245 off, before the tick-1255 selector
call, so its reservation agrees. The pediatric chart's commitments straddle that
call (1258 on / 1248 off). Physical exit is not the reservation boundary.

The new paired-only versions are not incorrectly gated by APP availability in
this failure: both sides have identical eligibility, current concept references,
capabilities and learning. The mismatch comes later from a valid reservation
filter after different patient experiences.

This control compares the entire current batch (including round six) with the
retained pre-batch release. It does not claim that just the last three round-six
definitions alone cause the changed prefix.

## Validation

All requested validation completed. Both integration files ran in full within
the full domain suite on the same unchanged inputs:

- Focused fairness test: 1 failed / 4 filtered; reproducible identity failure,
  91.56 s, native exit 1.
- Full-run Level 4 file: 4 pass / 1 same fairness failure, 156.60 s.
- Full-run Level 5 file: 10 pass / 26 fail, 415.35 s. One retained-input binding
  failure and 25 legacy loaded-hash failures (five levels times schemas 5–9).
  Released-content control matches all 25 hashes. Live loads initialize 392
  histories versus 370 released; deleting only those 22 extra histories from
  diagnostic clones restores every retained hash exactly. No runtime or expected
  value was edited. All four continuous-play/reload checks, real final-minute
  settlements, and the genuinely lower retry pass with current content.
- Seven workspace typechecks: PASS, native exit 0 (`npm.cmd run typecheck`).
- Full domain: **4,346 pass / 27 fail / 1 skipped**, **166 files** (164 pass /
  2 fail), **892.93 s**, native exit 1. Every failure is classified above: one
  APP reservation/identity assertion, one source-binding guard, 25 history hashes.
  There are no timeout or additional failures. The existing skip is the opt-in
  `EVIDENCE_FULL_REPLAY` oracle at `game-evidence-incremental.test.ts:31`.
- Selector unit tests: **8/8**. Original minute-900 APP regression, both gift-only
  fairness checks, service-queue waiting **39/39**, nurse visit tests, garden-return
  regressions and Level 5 launch **8/8** pass.

Commands, native output and JSON results live in
`.local-dev/app-arrival-selector-20261103/`. `domain-full.json` and its log cover
the requested full domain run and both Level 4/Level 5 integration files using
`CI=true`, `--pool=threads --maxWorkers=2`.

Exact PowerShell validation commands (report destinations abbreviated to `$scratch`
for readability; the actual logs contain the absolute output path):

```powershell
$scratch = 'C:/Users/rowla/Projects/GamifySurgery/.local-dev/app-arrival-selector-20261103'
$env:CI='true'
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/level-four-integration.test.ts -t 'preserves scored case identities and arrival count/times' --reporter=default --reporter=json --outputFile=$scratch/focused-before.json
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=$scratch/domain-full.json
npm.cmd run typecheck
```

Read-only diagnostic commands, run from the live root:

```powershell
node .local-dev/app-arrival-selector-20261103/trace-selection.mjs
node .local-dev/app-arrival-selector-20261103/trace-selection.mjs --released
node .local-dev/app-arrival-selector-20261103/trace-world.mjs
node .local-dev/app-arrival-selector-20261103/counterfactual-selection.mjs
node .local-dev/app-arrival-selector-20261103/legacy-load-control.mjs --released
node .local-dev/app-arrival-selector-20261103/legacy-load-control.mjs
```

Diagnostics exit 0. Node's experimental type-stripping notice on stderr is an
informational runtime warning. `failure-classification.json` lists all 27 failed
assertions and their messages; `validation.json` records commands and summaries.

## Evidence preservation and manager gate

**Level 5 bound inputs changed by this milestone: none.** All 810 baseline-tracked
files matched after validation, before appending this diagnosis to the current
handoff. That append preserves its prior bytes. Retained M9 stays **28,804 commands / 6,010,006
closing cents**. No fresh full M9 campaign or rewrite is claimed: the released
fairness control was run; the conditional released-content regeneration proof
applies to option (a), and no runtime fix is proposed here.

Six retained-input mismatches already existed at entry and remain unchanged:

- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/game-domain/src/reducer.ts` (newline-only versus release)
- `packages/game-domain/src/waiting-destinations.ts` (newline-only versus release)

Exact hashes are in `preservation-current.json`; baseline hashes include canonical
evidence and fixtures. No evidence is rebound, normalized or regenerated.

Risk/remaining decision: the unchanged live suite retains a real failing broad
identity assertion. The manager must reconcile its scope with the recorded
accepted patient-flow policy. This worker does not waive it, change it, or accept
the question batch for release. Diagnostic traces contain synthetic development
states and remain local. No save schema, gameplay, clinical approval or opening
pathway changes. The handoff is local and unbacked-up; backup/release decisions
remain with the manager.
