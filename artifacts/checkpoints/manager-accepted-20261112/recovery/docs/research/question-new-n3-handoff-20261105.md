# N2 source-screened acceptance and N3 draft handoff

N2 review three now supplies fourteen accepted versions after source screening. Its nineteen editorial PASS candidates include five whose keys depend on targeted verification holds; those five remain catalog-only. The twenty REVISE versions are parked without further rewriting. The [manager decision](question-new-manager-decision-20261105.md) lists every accepted ID and maps all ten v3 PASS individually. The [machine-readable disposition](question-new-n2-source-hold-disposition-20261105.json) includes the exact accepted, held and parked lists. No N2 question definition was edited. Before N3 authoring, manifest/projection tests passed 12/12 and all seven typechecks passed; that milestone was reported separately.

N3 supplies forty proposed new integrated decision constructs, one variant each: sixteen at Level 3 and twenty-four at Level 4. All remain `needs_clinician_review`, with no manifest acceptance. The [key-first, review-only packet](question-new-n3-20261105.json) contains the original findings, complete choices and feedback, five-part author self-check, option counterfactuals, nearest existing objectives, proposed identity boundary, source mapping and exact case hash for every item. Author predictions are thirty-five moderate and five hard; independent difficulty, novelty and answer-validity review remain pending. Melissa Rowland is the clinical sign-off.

The proposed identities combine clinical interpretation with a changed action: replacement-fluid composition versus achieved nutrition; a new bowel mechanism during nutrition support; superficial response versus a persistent deep source; actual treatment exposure versus a referral's failure label; test specimen/timepoint scope; and progressive tissue findings despite a favorable circulating marker. Existing objectives are linked explicitly. If independent review finds only a wording or patient-detail variant, retain the established concept ID rather than shipping another FSRS identity.

## Supply and evidence

The [structural supply census](question-new-n3-supply-20261105.json) excludes employee discussions and assumes room capabilities are present. The current live projection unlocks 37 patient concepts at Level 3 and 21 at Level 4. If all forty proposed identities are independently sustained and later accepted, those reserves would become 53 and 45 respectively. The earlier editorial target of 75–100 fresh concepts per late level remains unmet. N3 contributes no live supply now. The native supply test consumes each unseen identity, observes no selection when all reviews are future-due, and resumes selection when a review becomes due; arrival/selection code is unchanged.

At the full-suite run point the live release had 1,136 cases and 597 registered meanings. Closing state has 1,136 cases and 598 meanings after the concurrent G06 acceptance; the explicit catalog has 1,229 cases and 625 meanings. Twelve live meanings and sixteen batch2b acceptance rows, then one G06 meaning/row, were added by the rewrite lane and preserved. None of the forty N3 meanings enters default history initialization. All 40 N3 cases are usable through the explicit catalog without a second runtime manifest check.

The [source ledger](question-new-n3-source-ledger-20261105.json) maps 70 unchanged atomic factual syntheses to 73 recorded source entries, retaining the original citation, authority, reuse terms, access date and claim-check date. No source was retrieved or newly verified. Every key has explicit direct fact support and no dependency on the eighteen N2 targeted holds. Eighteen keys have only one recorded publication; those limitations remain visible. Multiple source records are not treated as proof of independent corroboration. Patient observations and chronology are fictional; no new numerical guideline rule, medication dose or turnaround value was invented. No source prose, figures, tables or algorithms were reproduced.

Priority follows the existing Level 3/4 coverage report: practical fluids/nutrition, perioperative and wound decisions, abdominal/GI disease and vascular care, with selected transplant, thoracic, trauma and endocrine gaps. Topic structure remains the public ABS outline source already recorded in [the N0 coverage report](question-coverage-gaps-20261104.md); no new outline text was copied.

## Files and integration

New clinical files: `question-new-n3-types.ts`, `question-new-n3-level3.ts`, `question-new-n3-level4.ts`, `question-new-n3-evidence-20261105.ts`, `question-new-n3-20261105.ts` and its test, all under `packages/clinical-content/src/`. New domain files: `src/question-new-n3-test-orders.ts` and `tests/question-new-n3-supply.test.ts`. Offline tools are in `tools/question-new-n3/`; the active plan is `docs/execplans/question-new-n3-20261105.md`.

Shared integration appends N3 exports, catalog cases/concepts, exact timing rows and external-only test-order records. `QUESTION_NEW_N3_PRE_RELEASE` and `QUESTION_NEW_N3_PRE_TIMING_ENTRIES` preserve the preceding stages. The N3 concept helper runs only while building the default content projection, preserving all prior meanings and adding an N3 meaning only for an exact accepted tuple. Future acceptance still needs an explicit manifest tuple and catalog header source; no N3 tuple was seeded.

Affected fixtures retain their assertions: the complete timing-archive count adds the forty new rows; N1/N2 round-three timing checks bind to their retained stage and compare every prior row by exact tuple lookup and full equality. This avoids repeated scans of the expanding archive without changing a timeout or relaxing a preservation check. The manifest fixture uses the retained pre-N3 catalog for its historical census. The withdrawal fixture appends all forty exact N3 case IDs to its complete catalog expectation. N3 timing preservation compares the entire ordered retained stage by exact tuple and full equality, permitting later distinct peer rows without relaxing any missing/changed/duplicate-row check.

Forty N1/N2 definition files remain byte-exact against intake. Flags2/batch2b source and capture edits made concurrently belong to the rewrite lane; this worker did not edit them. No production admission, selection, availability, reducer, player session/cloud, Supabase or Level 5 evidence/pin/checkpoint file was edited. No Git, installs, network, agents, external messages, deployment or opening-pathway change occurred.

The existing Level 5 bound inputs changed by this lane are exactly:

- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/game-domain/src/test-choice-orders.ts`

New N3 files are imports of those registries, not additional edits to historical pinned files. The N2 manifest rows also changed as directed; concurrent batch2b rows remain intact. No Level 5 binding was refreshed; the manager owns release-tree reconciliation.

## Validation

Final receipts and raw logs are in `.local-dev/question-new-n3-20261105/validation.json` and its `finalSelection`. They preserve the original failing runs as well as the final results. Full-suite counts are the recorded run-point results; the flags2 round-two/G06 integration appended during closing checks. After that append, N3/manifest tests and all seven typechecks passed again.

- Full clinical-content: **1,215 passed, 0 failed; 115 files**, exit 0. Duration 89.23 s.
- Full game-domain: **5,055 passed, 27 failed, 1 skipped; 201 files** (199 passed / 2 failed), exit 1. Duration 569.88 s.
- Full player: **3,548 passed, 4 failed; 375 files** (371 passed / 4 failed), exit 1. Duration 775.58 s.
- Seven closing workspace typechecks: **7 passed**, exit 0.
- Question-quality lint tests: **33 passed, 0 failed**, exit 0.
- N3 cue lint: **0 findings across 40 variants / 80 presentation contexts**, including explicit choice rationales.
- Focused domain: **44 passed, 0 failed**, including every N3 case's stage/admission boundary, 16/40 unseen-reserve exhaustion, due re-entry, seeded answer positions, exact external-only timing records, and catalog-only frozen completion under default.
- Closing focused clinical plus manifest, after the G06 append: **56 passed, 0 failed; 2 files**, exit 0. Duration 3.88 s.

The new frozen-save test is `reopens a catalog-only N3 frozen chart under default and completes it with the same FSRS identity`. It admits under an explicit catalog, serializes, reopens under default, completes the actual chart flow and verifies the prior review remains attached with one correctly scored new review. The accepted six format-3/journal compatibility tests in `apps/player/src/questionShipSaveCompatibility.test.ts` are preserved and included in the full player run.

Initial validation exposed the missing forty-row timing count, a slow repeated-scan historical fixture, and a TypeScript narrowing error in the new test. Those were corrected; no initial failing run is represented as a passing final run. The initial domain run also had the catalog-count failure and the previously seen inventory timeout. The final full domain run passes both under the original budgets; no isolated retry was needed. A concurrent flags2 round-two caption narrowing error appeared in the first closing typecheck and was repaired by that lane; the final seven-workspace run passes. Exact commands, counts, log hashes and prior-failure attribution are recorded in the final validation receipt.

### Remaining full-suite failures

| File | Count | Evidence and ownership |
| --- | ---: | --- |
| `packages/game-domain/tests/level-five-integration.test.ts` | 26 | Same 26 in the earlier N2 round-two, gate round-three and accepted narrowing runs. Evidence, pins and checkpoints remain unchanged; manager release-tree rebind required. |
| `packages/game-domain/tests/approved-clinical-admission.test.ts` | 1 | Unchanged static expected list has 585 meanings; logged default has 597 after twelve concurrent accepted B2B meanings. The subsequent G06 row makes current default 598. Exact IDs and the pre-N3 reconstruction proof are in `concurrent-admission-fixture.json`; rewrite/manager integration owns the expected-list update. |
| `apps/player/src/session/breadButterPresentation.test.ts` | 1 | Hard-coded four-choice assertion conflicts with accepted B2B40 `question.perianal-abscess.prompt-drainage.v3.r2`, which has three. Exact proof in `concurrent-bread-butter-fixture.json`. This session path is outside this lane. |
| `apps/player/src/session/cloud/diagnosticWorkloadPerformance.test.ts` | 1 | Logged 1x tick + overview 64.6002 ms against unchanged 16 ms budget. Same failure before N3: N1 round-three 62.6299 ms, N2 round-two 95.8228 ms, narrowing 68.548 ms. |
| `apps/player/src/session/cloud/operationalSession.test.ts` | 1 | Same fencing-during-computation 5,000 ms timeout recorded before N3 in N1 round-three/gate/narrowing runs. |
| `apps/player/src/session/cloud/separateCampaign.test.ts` | 1 | Same retired-encounter `JSON string exceeds the codec limit` failure recorded in gate round-three and narrowing. |

No remaining failure is introduced by the N3 lane. The complete default release rebuilt from the pre-N3 catalog with the current accepted B2B/G06 helpers is deeply identical to the post-N3 default: closing SHA256 `e55903f57c02a79d32172b439163e85ee6f577d56ca3b4f3ca4d1877bf24fc3a`. The pre-G06 proof and all forty unchanged N1/N2 definition hashes are retained alongside the final scope receipt. The N2 rows are exact against the fourteen-row acceptance receipt; all 1,423 legacy bindings are unchanged.

Exact full-suite commands:

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --configLoader native --config ../../.local-dev/question-new-n3-20261105/player-native.config.ts
npm.cmd run typecheck
npm.cmd run clinical:lint:test
node tools/question-new-n3/review.mjs
```

The private native player config is an exact copy of the existing config except for adding `.ts` to its private-module-guard import. It preserves plugins, assertions, budgets and timeouts; it avoids the sandbox-blocked config-bundling subprocess. No application config or opening origin was changed.

Local worktree only. Independent N3 review, Melissa Rowland clinical sign-off, manager acceptance and release-tree binding remain separate. No backup push was performed; the manager owns the separately authorized “push to GitHub” checkpoint.
