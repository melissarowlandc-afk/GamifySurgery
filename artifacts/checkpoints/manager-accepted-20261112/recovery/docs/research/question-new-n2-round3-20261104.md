# N2 round three and question ship gate handoff

Calendar 2026-11-05; requested batch stamp 20261104. Authoring/gate implementation complete; integrated release validation remains red. No release, clinical approval or Level 5 rebind is represented by this handoff.

## Review packet and preserved versions

- [Round-three packet](question-new-n2-round3-20261104.json): 39 exact variants, key first for review only. SHA-256: `b5f83447c60ce610b72289f605934ecd3f58fe461c50083c2af94724c56b5495`.
- All 26 REVISE and one FAIL have new v3 drafts: 11 Level 3 and 16 Level 4. The twelve review-two PASS case/question/concept versions remain exact. All 79 captured N1 files and its prior plan remain byte-exact while N1 review runs.
- [Manual self-check](question-new-n2-round3-self-check-20261104.json): five concrete criteria per returned item, every choice's counterfactual, and responses retaining all 188 review notes. Predictions: 25 moderate/two hard. These are same-author judgments, not independent acceptance or measured resident performance.
- The 68 exact batch-one PASS exemplars were retained as calibration references; B02, B25, B34, B35 and B35-context guided discordant-measurement, treatment-response, compartment/route and acquisition-purpose construction. No clinical rule was borrowed by analogy.
- Five meanings retain their IDs; 22 changed meanings use separate IDs and leave prior cards intact. These are replacement versions, not 22 additional independent fresh-supply slots. No question or concept definition in the other rewrite lane was edited.

The last manual pass removed explicitly failed-option trials and supplied intake adequacy, removed a missing-duct target and symptom-resolution shortcut, and removed medication-adjustment permission wording. A new original pressure graphic replaces the tabulated measurements and provides the complete raw accessible record. New case feedback describes team review rather than implementation details. Every proposed test, including distractors, has an existing modality-matched placeholder profile; no authored runtime wait, dose or universal cutoff was added.

## Evidence ceiling

[Source ledger](sources-question-new-n2-round3-20261104.json): 148 atomic records, 102 source records, 85 distinct DOI/URL publication keys, 65 one-publication claims. Nineteen new local syntheses include eighteen targeted clinical/source-verification holds. Original source access/check dates, authority and rights assessments remain recorded; there was no external retrieval. Cross-check leads are not represented as verified support for extensions.

The holds cover ongoing naloxone strategy, intermittent capnography acquisition, depolarizing twitch interpretation, renal/procedural anticoagulant selection, refeeding prescription response, delivered supplemental nutrition, protein-module prescribing, pelvic source control, recurrent anastomotic dilation, ulcer rescue sequence, fissure flap choice, focal neurologic imaging, current perioperative consent, prepared graft bed, flap salvage, extravasation assessment, transplant assay/sample purpose and ischemia procedure choice with active hemorrhage. Exact scope and inherited round-two limits are in the packet. All new versions remain `needs_clinician_review`; Melissa Rowland remains clinical sign-off. None of these twenty-seven v3 drafts is admitted to fresh play.

## Single manifest and live behavior

[Manifest](../../packages/clinical-content/src/question-ship-manifest.ts), [integration contract](question-ship-integration-20261104.md), [39 composed accepted/fallback cases](question-ship-preview-20261104.json).

The single manifest contains 1,423 explicit legacy tuples plus forty directed acceptances: nine N1 review-two PASS, twelve N2 review-two PASS, nine manager-approved flags and ten batch-2a items. The selected rewrite versions are exact retained versions, including earlier PASS versions carried through a later stage. Every unaccepted rewrite node keeps the pre-flag live node; B2A03 remains the old first node alongside accepted B2A02. The rewrite writer's batch-2b retained source view and accepted-concept helper are preserved, with no B2B acceptance invented here. Future exact-entry/header/concept/timing steps are documented in the contract.

Current catalog: 1,189 cases and 585 registered concepts. Default live projection: 1,131 cases, 1,444 nodes and 422 active concept identities. Its patient concepts first appearing at Level 3/4 are 34/19, with 77/30 patient case variants at those stages. Twenty-one N1/N2 accepted cases are admitted (11 at Level 3, ten at Level 4); individual FSRS history still decides unseen/due eligibility. The 75–100-fresh-concept target per major level remains unmet.

The gate applies at manual admission, patient/employee selection, availability and direct protected/tutorial encounter creation. Unknown tuples, changed concepts, omitted/duplicate nodes and unaccepted question versions fail closed. Drafts and historical definitions remain inspectable. All registered concepts remain available for saved histories, while cases define actual supply. No arrival clock, balance weight or FSRS scheduling algorithm changed.

Frozen serialized encounters remain readable and can complete/scored once; native tests exercise this without fresh admission of the old version. This proof does not establish all cloud command-log replay compatibility. The manager/save worker must verify reconstruction of previously committed admissions using their original frozen definition/context. Seven cloud tests failed in the full player run; no cloud code was edited here.

## Validation

Native logs and complete per-file failure indexes: `.local-dev/question-new-n2-round3-ship-gate-20261104/validation.json`. All Vitest commands use `--pool=threads --maxWorkers=2`.

| Check | Result | Exit |
| --- | --- | --- |
| Final scoped clinical, exact PASS, timing, historical N2 and narrative checks | Tests  98 passed (98) in five files | 0 |
| Final native admission/supply/tutorial/frozen-history/accepted rewrite and exact order checks | Tests  134 passed (134) in two files | 0 |
| Batch cue lint | 39 variants/78 contexts, zero findings; unchanged linter, no suppressions | 0 |
| Seven workspace typechecks | All seven pass | 0 |
| Full clinical-content | Tests  50 failed | 1073 passed (1123); Test Files  4 failed | 108 passed (112); 92.54 s | 1 |
| Full domain | Tests  454 failed | 4535 passed | 1 skipped (4990); Test Files  27 failed | 172 passed (199); 554.94 s | 1 |
| Full player, native config loader | Tests  12 failed | 3517 passed (3529); Test Files  6 failed | 365 passed (371); 966.58 s | 1 |
| Global lint tests | 32 pass/one fail: rewritten-context assertion reads the live F02 fallback | 1 |

The final clinical fifty failures are 33 locked N1-R3 stage/default-live assertions, one batch-2a stage assertion, twelve old GS028 runtime admission fixtures and four GS028 schema/save fixtures that construct old content through fresh admission. The older N2 structural test now imports its retained exact author stage without changing any assertion or question data. The narrative checker recognizes the ordinary verb “attends”; the frozen NPV PASS prose is unchanged. Shared timing tests keep the historical golden counts and verify every actual live tuple plus every retained exact order.

The domain run includes 26 Level 5 raw-binding/history checks and many historical/arbitrary-case admission fixtures that conflict with the new acceptance contract. Its two inventory failures were subsequently repaired and all eight inventory checks pass in the final scoped run. The reference availability reader now shares the gate predicate; differential checks pass on accepted, rejected and mixed pools. Do not infer a new full-domain failure count by subtraction.

Player failures: five availability-view-model fixture expectations; diagnostic workload performance; two operational-session tests (startup projection and fencing); two operational-state-patch tests; retired separate-campaign handling; watchdog recovery. Budgets, timeouts and assertions were not increased/waived. No claim is made that all cloud failures predate or are independent of the gate; the worktree changed during runs. The native player config is an exact local copy of the real config with only the private-module plugin import's .ts extension added for the sandbox loader; no player config/source edit.

An optional extra boundary check was blocked when the repository verifier internally attempted a read-only Git spawn (`spawnSync git EPERM`). It was not retried. No direct Git command, successful Git operation or Git mutation occurred. The required local validations above ran independently.

Late changes after broad snapshots are explicit in `scope-audit.json`: raw-data/cue repairs to unaccepted N2 drafts, modality-placeholder corrections, neutral feedback wording, availability-reference alignment, historical test scopes, and moving the new order append outside the untouched N1 marker. The order of records did not change in that final comment separation. Final focused checks cover the final exact packet. These receipts do not certify a frozen release tree.

## Files and Level 5 inputs

New runtime modules (eleven):

- `packages/clinical-content/src/question-new-n2-round3-20261104.ts`
- `packages/clinical-content/src/question-new-n2-round3-abdominal.ts`
- `packages/clinical-content/src/question-new-n2-round3-evidence-20261104.ts`
- `packages/clinical-content/src/question-new-n2-round3-nutrition.ts`
- `packages/clinical-content/src/question-new-n2-round3-perioperative.ts`
- `packages/clinical-content/src/question-new-n2-round3-research.ts`
- `packages/clinical-content/src/question-new-n2-round3-specialty.ts`
- `packages/clinical-content/src/question-new-n2-round3-types.ts`
- `packages/clinical-content/src/question-ship-manifest.ts`
- `packages/clinical-content/src/question-ship-projection.ts`
- `packages/game-domain/src/question-new-n2-round3-test-orders.ts`

New tests: `packages/clinical-content/src/question-new-n2-round3-20261104.test.ts`, `question-ship-manifest.test.ts`; `packages/game-domain/tests/question-ship-gate.test.ts`. New offline tooling: `tools/question-new-n2-round3/`. Original PNG: `apps/player/public/clinical-exhibits/question-new-n2-r3-pressure.png` (1200 × 720; visually inspected). The plan is [question-new-n2-round3-ship-gate-20261104.md](../execplans/question-new-n2-round3-ship-gate-20261104.md).

Eight changed already-recorded Level 5 inputs:

- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/game-domain/src/clinical-case-eligibility.ts`
- `packages/game-domain/src/clinical-selection.ts`
- `packages/game-domain/src/routine-patient-availability.ts`
- `packages/game-domain/src/reducer.ts`

The changed `routineAvailabilityReference.testSupport.ts` is an existing unrecorded source-discovery input in the older evidence map. Shared tests changed: timing inventory, order inventory, historical N2-R2 structural import and story-verb recognition. Prior N1 registry bodies reproduce after export-alias normalization. Removing only the gate import and four guard/comment lines reproduces the reducer's immediate pre-gate bytes exactly, preserving the performance lane.

Exact scoped paths, hashes, frozen-version proofs and snapshot deltas are in `.local-dev/question-new-n2-round3-ship-gate-20261104/scope-audit.json`, `scoped-files.json` and `frozen-integrity.json`. Port scoped hunks rather than replacing shared registries. No Level 5 evidence, pin, checkpoint, budget or expected-result file was edited/rebound. Manager runs actual integration in the accepted, frozen release tree.

No installs, network, sub-agents, external messages, player session/cloud implementation, Supabase, deployment, origin/profile/launcher or save-path changes. No remote backup was created by this worker. Manager owns independent review, targeted source verification, Melissa Rowland's clinical sign-off, historical fixture/cloud replay integration, Level 5 binding and any separately authorized checkpoint.
