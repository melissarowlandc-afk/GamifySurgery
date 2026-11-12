# Whole-case ship replacement and N3 guard integration — 2026-11-05

Completed both integration tasks in the shared main working tree. No deployment,
Git, network, installs, agents, external messages or release-worktree edits.
No question wording, clinical claims or source records were changed.

## Accepted whole cases

The manifest now supports explicit `{replaces, with}` relations. `replaces`
identifies exactly one legacy case by case ID or exact question ID; `with`
identifies an exact accepted draft row. The entire source case must have exact
accepted node/concept tuples and an explicit source header. Invalid/conflicting
relations retain the legacy fallback and report a diagnostic. The boundary
remains the clinical projection; no domain-side admission check was added.

| Item | Legacy case replaced in fresh play | Exact admitted draft |
| --- | --- | --- |
| G03 | `case.gs028c.palpable-breast.paired-dense-focal` | `question.palpable-breast.negative-mammogram-targeted-us.v1.r4` |
| G05 | `case.asymptomatic-phpt.incidental-calcium` | `question.asymptomatic-phpt.age-based-surgery.v1.r3` |

Each fresh case now has one node instead of the legacy two. Case IDs remain
stable. Both stay `needs_clinician_review`, with no clinician approval metadata
added. G03 is a manager acceptance despite the independent review's residual
ease finding; G05 independently passed. The [decision record](question-flags2-round3-manager-decision-20261105.md)
preserves that distinction. G06 and all earlier acceptances are unchanged;
G01/G02/G04-R/G05-staging/G07 remain parked. **No N3 acceptance.**

Legacy frozen definitions, choice IDs, waits, exact order records and concept
records remain available. Format-3 waiting/in-progress snapshots and committed
journals for each legacy case reopen and finish both original nodes, scoring
their original question/concept IDs. Prior FSRS reviews remain exact, duplicate
answers remain idempotent, and no old history is assigned to the newly authored
meanings. Fresh admissions use the exact new one-node definitions. Save and
journal formats are unchanged.

## Counts and hashes

| Default projection measure | Intake | After |
| --- | ---: | ---: |
| Cases | 1,136 | 1,136 |
| Decision nodes | 1,449 | 1,447 |
| Distinct active question IDs | 1,444 | 1,442 |
| Distinct active concept IDs | 442 | 444 |
| Registered historical/current concepts | 598 | 600 |
| Manifest accepted rows | 62 | 64 |
| Legacy manifest bindings | 1,423 | 1,423 |
| Explicit whole-case relations | 0 | 2 |
| Timing records | 2,213 | 2,215 |

Manifest ID moves from `question-ship.2026-11-05.v2` to `.v3`. Four exact
`future_planned` test-choice records append; no service execution was added.
The original timing array remains an exact prefix, SHA-256
`37c2a72afea9b9c0fbd5c9e5b3cf8d9807e3ac1e1191f1ba27259e939cad1bcb`.

SHA-256 of `JSON.stringify(SYNTHETIC_CLINICAL_RELEASE)`:

- Intake: `e55903f57c02a79d32172b439163e85ee6f577d56ca3b4f3ca4d1877bf24fc3a`.
- After: `9d22fca317de853e1647bac1c4b2e727600627ccf9edb9acbe1e784ff927d98f`.

G03 case hash:
`d1e4c36adda962d3c71886571f59cc04875f696872ebdc151bb4b4fdf02c2f8a`
→ `f3c8bfc0d1b7ddccf6a6dd6db3ddc1758ffb7d25c59bca604ad084c827c25dd8`.
G05 case hash:
`1b7ba7688e3deab3a9f7f5384c3f8845f2722a89f58d830ce751eb71f54af468`
→ `6687400885952c629d985de543379ed647ef013bd0c6d3c2c2cbb1a1e274843a`.

All **1,134 other default cases**, all **598 original concept objects**, all
**62 earlier acceptance rows** and all **1,423 legacy bindings** are exact.
The [scope receipt](question-ship-case-replacements-scope-20261105.json) lists
every retired fresh question, retained old/new concept ID and source digest.

## Guard and fixture integration

Applied the N3 guard patch's exact timing/export append recognition. Original
flags2 captures, all captured file assertions and existing budgets remain.
An additional exact source-migration receipt pins the authorized integration
bytes before checking their preserved intake source against the old captures.
Historical default comparisons first verify the complete two-case/two-concept
delta and then reconstruct the earlier epoch. No broad exclusions were added.

Three later-acceptance assumptions also needed test-only updates:

- N3 round-two reconstruction now uses the explicitly historical default/manifest.
- N3 round-three timing-tail assertion includes the two later G03/G05 rows while
  retaining the original prefix and uniqueness checks.
- Batch2b's returned B2B36 draft remains unaccepted; its case now equals accepted
  G03 r4 rather than the superseded legacy fallback. All other fallbacks remain.

The board-expansion fixture checks G05 r3's intentional one-node completion;
all other two-node gate assertions remain. Frozen two-node G05 completion is
covered by the player snapshot/journal tests. The save-test driver acknowledges
real feedback and drains the journal during real waits, retaining its original
240-tick readiness bound and existing timeouts.

The scope proof verifies **153 protected N3/cloud files unchanged** and records
the two related N3 test expectation edits separately. All N3 clinical/runtime
definitions and evidence source files, exact flags2 round-three source objects,
packet, source ledger and original capture remain unchanged.

## Validation

Exact closing results and raw-log hashes are in the
[validation receipt](question-ship-case-replacements-validation-20261105.json).

| Working directory / command | Closing output |
| --- | --- |
| `packages/clinical-content`: `npm.cmd test -- --pool=threads` | **120 files passed; 1,329 tests passed; 31.16 s; exit 0** |
| `packages/game-domain`: `npm.cmd test -- --pool=threads` | **199 files passed / 5 failed; 5,132 tests passed / 32 failed / 1 skipped (5,165 total); 267.55 s; exit 1** |
| Repository root: `npm.cmd run typecheck` | **All seven workspace typechecks passed; exit 0** |
| `apps/player`: command below | **2 files passed / 1 failed; 61 tests passed / 1 failed (62 total); 38.96 s; exit 1** |

```text
npm.cmd test -- --pool=threads src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx
```

Player tests used the existing command-local preload
`tools/question-quality/adversarial-r5-player-preload-20261102.cjs` for the
sandbox's process restriction. **All 14 questionShipSaveCompatibility tests
pass**, including both legacy whole-case snapshots and journals, and the
flagFreeze file passes. The sole player failure is
`separateCampaign.test.ts:54`, retained retired encounters:
`CloudCodecError: JSON string exceeds the codec limit.` The same failure is in
the pre-integration N3 closing full-player log. No codec limits or cloud files
were changed.

All **27 prior domain failure titles** recur: 26 Level 5 binding/legacy
behavioral-evidence checks and one stale `approved-clinical-admission` registry
expectation (585 expected; already 598 at intake, now 600). The final shared-tree
run adds five room/staff-support failures in `app-appointments`,
`level-five-support` (two) and `room-upgrade-support` (two). These are outside
this integration lane; their cause was not established here. The test count
also grew by 19 between the first and final domain runs. No assertions or
timeouts in those paths were changed. The G05 board fixture failure found in
the first run is repaired and passes in the closing full run.

Raw logs: `.local-dev/question-ship-case-replacements-20261105/`
`clinical-full-close.log`, `domain-full-final.log`, `typecheck-close.log`,
`player-focused.log`. Prior comparison logs and every exact failed test title
are recorded in the validation JSON. Full clinical is green; full domain and
the requested player group remain red as explicitly listed above.

## Files changed

Existing runtime files (six):

- `packages/clinical-content/src/question-ship-manifest.ts`
- `packages/clinical-content/src/question-ship-projection.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/game-domain/src/test-choice-orders.ts`

New runtime files (two):

- `packages/clinical-content/src/question-ship-case-replacements.ts`
- `packages/clinical-content/src/question-flags2-whole-case-accepted-20261105.ts`

Existing build/test files (eleven):

- `packages/clinical-content/src/question-ship-manifest-validation.ts`
- `packages/clinical-content/src/question-ship-manifest.test.ts`
- `packages/clinical-content/src/answer-choice-timing.test.ts`
- `packages/clinical-content/src/question-flags2-20261105.test.ts`
- `packages/clinical-content/src/question-flags2-round2-20261105.test.ts`
- `packages/clinical-content/src/question-flags2-round3-20261105.test.ts`
- `packages/clinical-content/src/question-new-n3-round2-20261105.test.ts`
- `packages/clinical-content/src/question-new-n3-round3-20261105.test.ts`
- `packages/clinical-content/src/question-bank-batch2b-acceptance-20261105.test.ts`
- `packages/game-domain/tests/board-expansion-batch.test.ts`
- `apps/player/src/questionShipSaveCompatibility.test.ts`

New test/tool files (seven):

- `packages/clinical-content/src/question-ship-case-replacements.test.ts`
- `packages/clinical-content/src/question-ship-case-replacements-test-support.ts`
- `tools/question-quality/capture-question-ship-case-replacements-20261105.mjs`
- `tools/question-quality/record-question-ship-case-replacements-source-20261105.mjs`
- `tools/question-quality/check-question-ship-case-replacements-20261105.mjs`
- `tools/question-quality/fixtures/question-ship-case-replacements-before-20261105.json`
- `tools/question-quality/fixtures/question-ship-case-replacements-source-migration-20261105.json`

New documents: this handoff, the manager-decision/scope/validation records linked
above, and `docs/execplans/question-ship-case-replacements-20261105.md`.
Appended the scoped handoff to `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.
Local scratch snapshots/logs remain under the path above; no private feedback
or external source text was copied.

## Level 5 inputs and manager follow-up

Exactly **four already-bound inputs** changed in
`tools/qa/level-five-integration-results-20261012.json`'s input list:

- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/game-domain/src/test-choice-orders.ts`

The scope JSON records intake/current/evidence hashes separately. The modified
manifest/projector are two additional existing runtime inputs not currently
listed there. The resolver and accepted-flags2 helper are two new runtime
dependencies, also not currently listed. No Level 5 evidence, pins,
checkpoints or rebind were edited. The manager owns the release-worktree rebind
and legacy behavioral-evidence refresh.

Remaining risks: G03's accepted residual ease; all accepted content still needs
named clinical review; the reported domain/player failures need their owning
lanes. This checkpoint exists only in the local working tree. The manager owns
integration/release and any separately authorized GitHub backup. Stop here;
no N3 acceptance, additional rewrite, or next batch was performed.
