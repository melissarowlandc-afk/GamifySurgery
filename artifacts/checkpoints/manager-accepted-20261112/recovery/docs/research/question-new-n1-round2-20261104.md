# N1 round-two author response - 2026-11-04

The 37 REVISE items and one FAIL item have new exact versions. The two independent PASS versions are frozen. [Round-two packet](question-new-n1-round2-20261104.json) shows the key first **for review only**; runtime choices are shuffled. [Per-item author checks](question-new-n1-round2-self-check-20261104.json) cover all 38 revisions. Every exact new version remains **needs_clinician_review**, independent round-two review is pending, pipelinePassed is false, and no public release is authorized. N2 was neither edited nor self-reviewed in this turn.

## Response to the independent review

The [first review](question-new-n1-review-20261104.json) returned two PASS, 37 REVISE and one FAIL; it judged 30 easy, ten moderate, and only five two-step. A clean lexical result did not establish applied reasoning. All 290 returned-item notes are retained in the packet with their grouped section responses for direct reinspection; no note has been deleted or marked independently resolved by the author.

Each revised item has a manually written cover-key attack, same-stage/category explanation, two consequential reasoning steps, competing resident error, predicted PGY-2/3 difficulty, unique-best-answer justification and counterfactual that changes the choice. The author predicts 37 moderate and one hard; these are uncalibrated judgments requiring independent review. The two PASS versions receive no new self-verdict. The [authoring standard](../clinical/question-authoring-standard.md) now records this five-part pre-handoff gate for future batches (v14).

Selected substantive repairs:

| Returned problem | Revised decision and comparison |
| --- | --- |
| Overlapping benign-phyllodes excisions (FAIL) | Interpret a mapped capsular extension first, then apply the displayed benign policy and least-tissue objective. The smallest cut crosses the extension; one remaining contour removes the whole lesion without the avoidable nipple/extra-tissue loss. |
| Specialist phyllodes margin rules without adequate context | Supply a short original source-mapped policy reference. Reconcile actual grade, oriented specimen/shave records and tissue consequences before choosing a specific re-excision extent. Different grades and faces lead to different decisions. |
| Nutrition labels and obvious route eliminators | Compare recorded delivered energy/protein, confounded formula changes or actual feeding response with requirements. Options specify competing route/formula plans at the same decision stage. |
| Diagnostic recall and prematurely reassuring reports | Reconcile IgA and gluten exposure together, actual biopsy specimen sites, specimen-radiograph/clip targeting, proximal-vein coverage, or sampling architecture before choosing a specific next protocol. |
| Anticoagulant product-name recall | Interpret apparently improving pressure/INR despite continuing hemorrhage, then select the sequence of rapid factor replacement and resuscitation. Every option includes four-factor PCC. |
| Anatomy/exposure labels supplied in stems | Interpret original constructed groin, ileal-wall or contrast-entry diagrams, then choose a concrete repair/resection/exposure. Thoracic options balance side and incision plane. |
| Diagnosis supplied before a spread-pattern question | Evaluate new abnormalities at three sites in a patient with two prior malignancies; select representative distant tissue and comparison with both priors for the stated local-treatment staging goal. Origin is unresolved. |

The author's first round-two drafts still contained weaknesses: class-only IgA recall, an excision table solvable by choosing its smallest number, an obvious sole changing biopsy target, product-name PCC recall and uniquely longest keys. Those drafts were rewritten and the five checks reapplied. Exact per-item reasoning and these repairs are in the self-check artifact. Related cases have no fixed sequence; feedback can reinforce knowledge, so standalone review cannot establish absence of all cross-item learning effects.

## Exact versions, supply and facility scope

There are 38 new question/profile/presentation versions (26 Level 3, 12 Level 4). Together with the two frozen PASS versions the packet remains 40 items (28 Level 3, 12 Level 4), 35 with three choices and five with four. Original N1 definitions and its original packet are untouched; a separated projection changes only fresh assembled cases. Old N1 frozen encounters, timing tuples, exact order records and histories remain available. Both original PASS cases/questions retain their intake SHA-256 values:

| Frozen original PASS | Original case SHA-256 |
| --- | --- |
| Benign-phyllodes positive-margin discussion | 565f064692425f83f27c948e3c7f2c227cf3bf453deaf8903f17647ea48a6858 |
| Overt aldosterone phenotype | 67e7cc8d1d5a6ac72e5d270a03a90805b5e1c2a62c77e6dbc9db02a0d54aa971 |

Thirty-two meanings keep their stable concept identities. Six changed constructs have explicit new IDs with old-to-new reasons: adult celiac confirmation/sample provenance, gastric organ-specific resection, calcification specimen/target reconciliation, unresolved phyllodes distant-target evaluation, mixed-gas reassessment and active-VKA-bleeding reversal sequence. Old definitions/history are retained; no history transfer or FSRS reset is introduced. **This revision does not create 38 new supply concepts.** The native progressed fixture treats old identities as future-due and exposes exactly the six proposed changed identities as unseen.

The isolated round-two projection has 513 registered concepts, 469 active routine patient concepts, 1,189 cases and 1,502 nodes, versus 507/469/1,189/1,502 immediately before it. This is separate from the concurrently moving whole bank (later 520/474/1,189/1,502 after another worker's batch 2b). Do not add 38 to N0/N2 supply totals or assume a review reset.

Twenty-three revised cases have constructed exhibits, including three original local PNG diagrams. SVG sources and the local renderer are in tools/question-new-n1-round2; all three displayed images were visually checked. They are fictional teaching constructions, not copied diagnostic/source images. All questions remain clinic decisions or explicitly framed outside-hospital record/plan review. No new executable service, room, result gate, probability, threshold or medication dose was added. There are 47 existing-profile testing previews, 15 keyed, replacing 34/12 (+13/+3); all new exact records are external-only/non-executed and durations stay runtime metadata.

## Evidence and source limits

[Evidence/source ledger](sources-question-new-n1-round2-20261104.json): 97 atomic claims, 74 source records and 73 DOI-or-official-URL publication keys. Thirty-seven claims have only one recorded publication; multiple record IDs are not independent corroboration. Eighty-four unchanged N1 claims and eight unchanged previously recorded catalog claims retain their actual previous check/access dates. Five new local syntheses separately record their derivations and basis dates; no retrieval/currentness claim is made.

Three named-drug syntheses (methimazole, propranolol and enoxaparin) require targeted exact-support verification before clinical approval. The other two new syntheses concern target representation and interpretation of the constructed gas record. The no-network instruction prevented external verification in this turn. These are explicit draft source holds, not new verification dates or clinical approval. No proprietary corpus, copied article prose/table/figure or new source retrieval was used.

## Cue results and validation

The current cue linter reports **zero findings for the 38 revised variants / 76 profile contexts**. The complete 40-item packet retains one finding on the explicitly frozen aldosterone PASS: key-only word overlap for the complaint word "Adrenal." It is disclosed unchanged; no exception or suppression was added. All 40 variants have complete metadata and rationales. The linter cannot prove difficulty, clinical accuracy or a unique best answer.

Final checks before concurrent batch-2b registration:

| Check | Result |
| --- | --- |
| Full clinical-content, threads/two workers | 105 files, 926 passed, native exit0, 67.04s |
| Focused domain: new round two, original N1, frozen N2, withdrawal, selection, cadence, approved-content gate | Seven files, 286 passed, native exit0, 19.88s |
| Cue-linter tests | 33 passed, native exit0, 1.644s |
| Workspace typechecks | All seven workspaces, native exit0 |

Final integrated checks on the moving shared tree:

| Check | Native result | Disposition |
| --- | --- | --- |
| Full player, threads/two workers | **352 files / 3,453 passed**, exit0, 719.84s | Existing local Vite Windows net-use EPERM fallback preloaded; no browser playtest. |
| Full domain, threads/two workers | **4,653 passed / 49 failed / one skipped** in 186 files, exit1, 553.76s | 26 Level 5 binding/history assertions; 22 older content/flow/order/count/supply assertions; one own fixture assumption repaired after this run started. |
| Integrated full clinical repeat | 923 passed / three failed in 105 files, exit1, 94.85s | Own assembly-scope test repaired; two other-cohort failures: timing inventory +40 retained rows, nine new uniquely longest keys. |
| Final N1 clinical file after test repair | **41 passed**, exit0, 4.04s | Preserved assembly assertions plus exact live N1 case bindings. |
| Integrated focused domain repeat after fixture repair | 285 passed / one failed in seven files, exit1, 18.99s | All 85 new N1, 87 original N1 and 85 frozen N2 admission checks pass. Sole failure is seven concurrent unapproved concept IDs absent from the shared prototype allowlist. |
| Integrated seven-workspace typecheck repeat | **All seven passed**, exit0 | No N1 or shared type diagnostic. |

The full domain loaded the earlier N1 fixture before its repair. The repaired fixture makes every non-N1 identity future-due, including identities from later concurrent cohorts, and exposes exactly the six proposed N1 construct versions. The final focused run includes this repair. Clinical tests now compare the actual preserved post-N1 assembly before later cohorts and also verify all 38 live N1 revisions. These are test-scope repairs; runtime content did not change after the pre-broad-run snapshot.

The seven new runtime modules remain hash-identical to that snapshot. Shared registries, other cohort modules/tools and two own test files changed during the broad validation window; exact names/hashes and native exits are in .local-dev/question-new-n1-round2-20261104/validation.json and scope-audit.json. Its domain-failure-index.json retains all 49 headers/assertions. No gate is waived: **whole-tree integration is not green**. The initial own long-key/story/timing-count and retained-case-view problems were repaired without weakening assertions. Other lanes and Level 5 evidence remain untouched.

## Files and manager integration

New runtime modules:

- packages/clinical-content/src/question-new-n1-round2-types.ts
- packages/clinical-content/src/question-new-n1-round2-abdominal.ts
- packages/clinical-content/src/question-new-n1-round2-breast.ts
- packages/clinical-content/src/question-new-n1-round2-perioperative.ts
- packages/clinical-content/src/question-new-n1-round2-evidence-20261104.ts
- packages/clinical-content/src/question-new-n1-round2-20261104.ts
- packages/game-domain/src/question-new-n1-round2-test-orders.ts

New tests: packages/clinical-content/src/question-new-n1-round2-20261104.test.ts (41 checks) and packages/game-domain/tests/question-new-n1-round2-admission.test.ts (85 checks). Shared test hunks scope the original N1 test to its preserved assembly, retain old timing rows, add six unapproved prototype identities, account for this lane's +6 concept/+13 study/+3 key deltas, and include the pre-round-two cases in the exact frozen-record inventory. No other question definitions are rewritten. Before-edit shared-file copies and remaining peer-only differences are retained in the local audit; port owned hunks, not entire shared files.

**Existing Level 5 bound inputs changed:** packages/clinical-content/src/index.ts, packages/clinical-content/src/synthetic-content.ts, packages/clinical-content/src/answer-choice-timing.ts and packages/game-domain/src/test-choice-orders.ts. The seven new runtime modules above and three apps/player/public/clinical-exhibits/question-new-n1-r2-{groin,meckel,thorax}.png assets are new transitive/display inputs. No Level 5 evidence, pin or checkpoint was written or rebound. The manager owns frozen integration/retest, independent review, source verification, Melissa Rowland clinical sign-off and eventual release-tree binding.

No Git, installs, network, agents, browser, reducer/player runtime-code/cloud/Supabase changes, external message, release, deployment or origin/profile/launcher/save-path change. Concurrent source changes are preserved. Work is local and unbacked-up; after manager acceptance the owner may say **"push to GitHub"** for the separately authorized checkpoint.
