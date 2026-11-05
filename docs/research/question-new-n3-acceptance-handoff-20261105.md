# N3 five-version acceptance handoff — 2026-11-05

Manager-directed acceptance is implemented in the shared main working tree.
Exactly the five frozen review-two PASS versions enter fresh default play as
`needs_clinician_review` drafts. No clinical approval or release/deployment was
performed. No Git, installs, network, agents, rebind or external messages.

## Exact accepted versions

All rows use source view `n3-round3`, the explicit
`QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE`, and decision
`docs/research/question-new-n3-manager-decision-20261105.md`.

| Acceptance ID | Question variant | Registered concept |
| --- | --- | --- |
| `review.n3.bilateral-carotid-symptom-attribution.v2` | `question.n3.bilateral-carotid-symptom-attribution.v2` | `concept.n3.bilateral-carotid-symptom-attribution` |
| `review.n3.postsplenectomy-nodule-function-before-targeting.v2` | `question.n3.postsplenectomy-nodule-function-before-targeting.v2` | `concept.n3.postsplenectomy-nodule-function-before-targeting` |
| `review.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v2` | `question.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v2` | `concept.n3.dysphagia-biopsy-territory-after-negative-endoscopy` |
| `review.n3.tumor-screen-versus-family-test-sequence.v2` | `question.n3.tumor-screen-versus-family-test-sequence.v2` | `concept.n3.tumor-screen-versus-family-test-sequence.v2` |
| `review.n3.gastric-lymphoma-new-large-cell-process.v2` | `question.n3.gastric-lymphoma-new-large-cell-process.v2` | `concept.n3.gastric-lymphoma-new-large-cell-process.v2` |

Each has its exact case/node tuple and header pin in a separate manifest block.
The existing accepted-concept helper includes these five exact matching
meanings. No new concept/version was authored and no old FSRS history moved.
The three v3 repairs, pleural v1 and all 32 parked cases remain excluded.

All five packet-variant and authored-case SHA-256 values equal the round-three
packet's `frozenPreservation` records. Every accepted key has an empty held-key
claim list. Authored clinical definitions, claims, sources, mappings, review
packets and review-status metadata remain unchanged. See the
[scope receipt](question-new-n3-acceptance-scope-20261105.json) for exact tuples,
both frozen hashes, concept hashes and existing test-order bindings.

## Projection and compatibility

Moved construction of the unchanged eight-case round-three source into
`synthetic-content.ts`, after its catalog and before the default projection.
The source wrapper re-exports the same binding. This avoids a catalog/source
import cycle without changing source contents or admitting the whole view.
The view's SHA-256 remains
`0563b9812b4eaf1b28ac79dc307da695773d096f3929965c33810f80abff9cb9`.

The manifest stays the sole projection authority. No selector, admission,
reducer, routing, save/cloud implementation, domain runtime, or format changed.
Existing G03/G05 whole-case relations and all previous accepted/fallback cases
are unchanged. No timing/order append or service execution was needed; the exact
v2 external-only order records were already archived.

Five new player tests admit each accepted case from the actual default,
preserve its existing history, save/reopen format 3, complete the frozen question
with its original randomized choice IDs and concept, and reopen the completed
state. The 14 earlier legacy snapshot/journal tests remain intact and pass.
Three N3 domain supply tests now distinguish the five exact accepted default v2
versions from their explicit historical catalogs; all unaccepted default
admissions remain rejected, and prior frozen-completion checks remain.

Historical preservation tests first prove the complete authorized five-case /
five-meaning delta, then reconstruct their earlier epoch. New exact source
migration receipts pin current integration bytes before comparing preserved
source against the original captures. No previous capture/receipt was refreshed,
captured assertion removed, timing budget or timeout extended.

The strict pilot test counts any key one character longer than its nearest
distractor. Frozen gastric-lymphoma v2 has 63 characters versus 62. Its manager
acceptance and whole-case hash are pinned in a separate narrow exception;
the twelve original approved exceptions and all other strict length checks
remain. This is documented acceptance of unchanged reviewed wording, not a
clinical approval or a content rewrite.

## Counts and hashes

| Default measure | Before | After |
| --- | ---: | ---: |
| Cases | 1,136 | 1,141 |
| Decision nodes | 1,447 | 1,452 |
| Distinct active question IDs | 1,442 | 1,447 |
| Active concept IDs | 444 | 449 |
| Registered meanings | 600 | 605 |
| Manifest accepted rows | 64 | 69 |
| Legacy bindings | 1,423 | 1,423 |
| Whole-case replacement relations | 2 | 2 |
| Timing records | 2,215 | 2,215 |

Manifest version: `question-ship.2026-11-05.v3` → `.v4`.
All 1,136 previous cases, all 600 previous meaning objects, all 64 prior rows
and the full main catalog are exact. The 157 protected unchanged files include
N3 clinical/evidence definitions, review/capture records and cloud files; the
four authorized N3 source-wrapper/test edits are reported separately.

SHA-256 of `JSON.stringify(SYNTHETIC_CLINICAL_RELEASE)`:

- Before: `9d22fca317de853e1647bac1c4b2e727600627ccf9edb9acbe1e784ff927d98f`.
- After: `77261db946b72dbf0f001e6ce11aab75928b561a19a8a17a874274f08b185a30`.

Unchanged timing-array SHA-256:
`3728af1d3c0c074476b9340e7b4fc555d07fadb4945be689e43d1177f06fdd97`.

## Files changed

Existing runtime files (three):

- `packages/clinical-content/src/question-ship-manifest.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/clinical-content/src/question-new-n3-round3-source-20261105.ts`

Existing test/support files (twelve):

- `packages/clinical-content/src/question-ship-manifest.test.ts`
- `packages/clinical-content/src/question-ship-case-replacements.test.ts`
- `packages/clinical-content/src/question-ship-case-replacements-test-support.ts`
- `packages/clinical-content/src/question-new-n3-20261105.test.ts`
- `packages/clinical-content/src/question-new-n3-round2-20261105.test.ts`
- `packages/clinical-content/src/question-new-n3-round3-20261105.test.ts`
- `packages/clinical-content/src/question-bank-batch2b-acceptance-20261105.test.ts`
- `packages/clinical-content/src/pilot-content.test.ts`
- `packages/game-domain/tests/question-new-n3-supply.test.ts`
- `packages/game-domain/tests/question-new-n3-round2-supply.test.ts`
- `packages/game-domain/tests/question-new-n3-round3-supply.test.ts`
- `apps/player/src/questionShipSaveCompatibility.test.ts`

New test/tool files (nine):

- `packages/clinical-content/src/question-new-n3-acceptance-20261105.test.ts`
- `packages/clinical-content/src/question-new-n3-acceptance-test-support.ts`
- `tools/question-quality/capture-question-new-n3-acceptance-20261105.mjs`
- `tools/question-quality/record-question-new-n3-acceptance-source-20261105.mjs`
- `tools/question-quality/check-question-new-n3-acceptance-20261105.mjs`
- `tools/question-quality/fixtures/question-new-n3-acceptance-before-20261105.json`
- `tools/question-quality/fixtures/question-new-n3-acceptance-supplemental-before-20261105.json`
- `tools/question-quality/fixtures/question-new-n3-acceptance-domain-before-20261105.json`
- `tools/question-quality/fixtures/question-new-n3-acceptance-source-migration-20261105.json`

Documents: this new handoff, scope/validation receipts, the new execution plan
`docs/execplans/question-new-n3-acceptance-20261105.md`, and an additive entry in
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Local snapshots/logs are under
`.local-dev/question-new-n3-acceptance-20261105/`. No private feedback or external
source prose was copied.

## Level 5 inputs

Exactly one already-bound input changes this milestone:
`packages/clinical-content/src/synthetic-content.ts`.

- Intake SHA: `4e9ee3b1e50b4d33c0b2569254eda75fc60c57f3c91be8f39c51a898d797804c`.
- Current SHA: `e93b4deae7bda1134869b80324d77c5698e075e65b97815eb4f991c8aba5ef81`.
- Existing evidence SHA: `6d9870d53383af7da6ee7547ba702410a2545882876faa1696c0e1217fae311c`.

The manifest and source wrapper are two further modified runtime dependencies
not individually listed in that input map. No new runtime file, index/timing
edit, domain runtime edit, Level 5 evidence/pin/checkpoint or rebind. Manager
owns release-worktree integration and rebinding. All room/staff balance/domain
files are untouched by this lane.

## Validation

Exact commands and log hashes are in the [validation receipt](question-new-n3-acceptance-validation-20261105.json).

| Working directory / command | Closing output |
| --- | --- |
| `packages/clinical-content`: `npm.cmd test -- --pool=threads` | **121 files / 1337 tests passed; 47.56 s; exit 0** |
| `packages/game-domain`: `npm.cmd test -- --pool=threads` | **201 files passed / 3 failed; 5138 tests passed / 28 failed / 1 skipped (5167 total); 297.08 s; exit 1** |
| Root: `npm.cmd run typecheck` | **All seven workspaces passed; exit 0** |
| `apps/player`: focused command below | **2 files passed / 1 failed; 66 tests passed / 1 failed (67 total); 82.85 s; exit 1** |

`npm.cmd test -- --pool=threads src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx`

Player uses the existing command-local sandbox preload. All **19 ship/save tests**
pass, including all five new N3 default-admission/frozen-save completions;
flagFreeze passes. The one remaining player failure is the prior
`separateCampaign.test.ts:54` retired-encounter codec-limit failure, unchanged
from the preceding milestone. No cloud limit was relaxed.

All three N3 domain supply/frozen-completion files pass after updating their
15 old blanket-exclusion assertions to exact accepted-version expectations.
The focused four-file run is 107 pass / one patient-supply timeout; the isolated
patient-supply run is three pass / one timeout. Its original 10-second limit and
source are untouched. This failure's cause is not attributed to N3 or the
concurrent domain lane. No full-green domain/player claim.

Closing domain failures, by exact title:

- tests/approved-clinical-admission.test.ts > approved clinical admission boundaries > keeps the unapproved prototype runtime release limited to explicitly admitted concepts
- tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 9
- tests/patient-supply.test.ts > routine patient supply > records the current clinical inventory and exact unseen-patient boundary by stage

The validation JSON compares every title with the prior milestone and lists
which prior room/staff failures no longer occur. Room/staff files were not
edited. Level 5 binding/legacy behavioral evidence remains the manager's rebind
work; the pre-existing registry fixture still expects 585 meanings (600 at
intake, now 605).

Raw logs: `.local-dev/question-new-n3-acceptance-20261105/clinical-full-close.log`,
`domain-full-close.log`, `typecheck-close.log`, `player-focused-close.log`.

This checkpoint is local only. Manager owns inspection, release-worktree rebind,
unrelated failure follow-up and any separately authorized GitHub backup. Stop
after this bounded acceptance; no additional N3 or other item accepted.

