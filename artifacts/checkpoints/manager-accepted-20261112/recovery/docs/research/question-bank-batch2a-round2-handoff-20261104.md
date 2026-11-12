# Batch 2a round two — worker handoff

Authored 2026-11-04; validation/handoff completed across midnight UTC. STOP for independent review and manager integration. Nothing shipped; no Git, installs, network, source retrieval, clinical approval or analytics. All ten new variants and eight claims remain `needs_clinician_review`; Melissa Rowland is clinical sign-off.

Regenerated both eleven-item packets: `question-bank-batch2a-round2-20261104.json` and `question-bank-batch2a-20261104.json`. **Key shown first for review only; runtime choices are randomized.** B2A01 is the exact independently passed version, marked pipelinePassed/basicAccepted; this is not clinical approval. The fourteen flag drafts, F01/F12/F14, old source definitions, earlier approvals and old picture assets were not edited.

## Review response and author checks

All 121 first-review cue/fairness/suggestion notes have individually indexed responses in reviewResponse.noteResponses. Every revised item has the requested five-part self-check: cover-the-key cue attack, parallel same-stage/category choices, interpret then apply, predicted PGY-2/3 moderate difficulty, and one best answer with visible decision-critical context. These are author judgments pending independent review, not measured difficulty or self-granted pipeline passes. Initial draft issues caught in self-check were rewritten, including uniquely long keys, component convergence, named missing steps and permission/feasibility wording.

| Item | Before → after | Response; exact per-note details in JSON |
|---|---|---|
| B2A02 | question.achalasia.manometric-recognition.v2.r5 → question.achalasia.manometric-recognition.v2.r6 | Removed the adequacy label and the operation-versus-oral-therapy contrast. All choices are named specialist investigations. Added interval wall observations that change the next action; the old unverified treatment ranking is not scored by this version. |
| B2A03 | question.achalasia.high-resolution-manometry.v2.r7 → question.achalasia.high-resolution-manometry.v2.r8 | All options are parallel acquisitions within the same test, removing the unfinished-test-to-repeat shortcut and the ambiguous barium-versus-repeat hierarchy. The acquisition log replaces inference from retained images; intolerance/recovery framing is deleted because no next-modality sequence is scored. |
| B2A04 | question.achalasia.high-resolution-manometry.v3.r9 → question.achalasia.high-resolution-manometry.v3.r10 | Kept an actual image and accessible observations, supplied the integral analysis that peak height cannot establish, and replaced the unsupported preserved-clearance label with a balanced interpretation/action matrix. The choice now changes care. |
| B2A05 | question.inguinal-hernia.symptomatic-elective-repair.v4.r9 → question.inguinal-hernia.symptomatic-elective-repair.v4.r10 | Removed symptom-resolution exclusions, reduction-causes-relief wording, unsupported repeat testing and an unneeded third pain source. A second inguinal care plan prevents diagnosis-name matching; the hip finding remains a genuine competitor. Added the location needed for the inguinal designation. |
| B2A06 | question.inguinal-hernia.equivocal-exam-ultrasound.v2.r7 → question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8 | Used an actual acquisition worksheet and current examination, not saved views as proof of a missing study. Removed MRI/CT hierarchy and compared four specific ultrasound protocols; key is neither the only standing option nor the only canal option. |
| B2A07 | question.inguinal-hernia.symptomatic-elective-repair.v2.r9 → question.inguinal-hernia.symptomatic-elective-repair.v2.r10 | Made the ultrasound finding visible, retained the useful duty-log inference, and replaced overlapping generic priority labels with named treatment referrals. Removed the preselected hernia-observation plan and shared continued-activity wording. |
| B2A08 | question.inguinal-hernia.symptomatic-elective-repair.v3.r9 → question.inguinal-hernia.symptomatic-elective-repair.v3.r10 | Differentiated this item from the work-limiting inguinal cases. Replaced unsupported repeat imaging with real management competitors, and made current anatomy change the ranking of observation versus repair. |
| B2A09 | question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r9 → question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r10 | Deleted closure feasibility and classic irregular/dark lesion labels. The mapped interval change, not the opening description, creates the sampling decision. All alternatives are specific diagnostic plans, including a targeted deep biopsy and photographic surveillance rather than an old-block-only foil or a biopsy named as superficial. The original scenario’s small-size observation is retained without an invented numerical measurement. |
| B2A10 | question.quality-improvement.pdsa-act-and-iterate.v3.r9 → question.quality-improvement.pdsa-act-and-iterate.v3.r10 | Removed the as-needed synonym match, the unsupported duplicate filter and the repeat-manual comparator. All choices are novel named process changes; the crossed exhibit makes source and method competing explanations. |
| B2A11 | question.adrenal-incidentaloma.one-mg-dst.v4.r2 → question.adrenal-incidentaloma.one-mg-dst.v4.r3 | Made the stage explicit and moved beyond initial-screen recall. All choices are named endocrine studies with parallel specificity; the key is no longer the only dose/challenge option. No broad multi-axis workup question or automatic adrenalectomy inference remains. |

## Versioning, continuity and evidence

Six newly scored constructs require separate concept versions (old concepts retained):

- `concept.achalasia.secondary-junction-lesion-assessment.v1` — The scored action changes from selecting a primary-achalasia treatment to investigating a secondary junction lesion. Retain the prior treatment construct and all held treatment claims.
- `concept.esophageal-physiology.reserve-before-junction-intervention.v1` — The prior task classified two pressure axes. This version makes that interpretation consequential for investigation versus intervention; preserve the older classification construct.
- `concept.groin-ultrasound.symptom-provocation-protocol.v1` — The scored decision changes from selecting a next imaging modality to selecting the actual acquisition within ultrasound. Retain the original imaging-adequacy construct.
- `concept.groin-hernia.femoral-defect-repair-priority.v1` — The scored objective changes from symptom-prioritized inguinal repair to anatomical reclassification and the femoral repair exception. Retain the previous inguinal care-priority construct.
- `concept.quality-improvement.source-by-method-next-pilot.v1` — The scored discriminator changes from correcting an as-needed import omission to selecting a source-aware hypothesis from a crossed process pilot. Retain the prior Act/adapt objective and histories.
- `concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1` — The task changes from recalling the initial incidentaloma screen to selecting the subsequent etiologic classification step. Retain the original screening concept and exact dose mapping.

Four new constructs are paired-only; two are standalone. No selector/routing change is made. The owned schema-validated projection preserves 1,181 whole cases and 1,492 non-target nodes exactly, retains all 501 entry concepts and adds six. The captured valid bank has 1,189 cases / 1,502 node occurrences. Zero new variant-ID collisions. Ten timing rows and seventeen exact choice-order records are additive: four existing-service gates and thirteen explicitly nonexecuted previews. The 1,903 prior timing rows and old choice records remain retained. Frozen encounters/saves are not rewritten.

B2A04 adds an existing outsourced contrast-swallow gate, with raw returned findings and explicit later-pressure-study chronology; the following passed question/current update remains exact. B2A08 corrects the earlier inguinal label with new interval anatomy, rather than silently contradicting it. There is no runtime/save-envelope/choice-randomization change.

Evidence ledger: 42 current/prior/basis atomic claims and 36 existing source records, including eight new independently written application claims. Source authority, reuse/license status, original access dates and mapping limitations are retained. No fresh source verification is claimed. The prior B2A02 Heller/PPI/nitrate treatment hold remains on its retained version; the new scored construct concerns a secondary junction lesion, using existing directly checked guidance, with the exact sampling approach still for clinical review.

The new pressure schematic is original project artwork generated offline with System.Drawing, not a copied figure or patient trace; visually inspected at 1200×720. It includes software integral observations so reduced reserve is not inferred from peak height. Prior B01/B03 PNGs remain byte-exact.

## Advisory lint

Last complete same-v8 comparison (2026-11-05T00:05:15.458Z): 1497 variants / 6197 finite contexts on each side; whole-bank findings **2043 → 2035**. Selected ten **13 → 4**; forbidden owner-rule findings **0 → 0**. The same preceding N1/N2 definitions are present on both sides.

- B2A02: unique-key-test-name; exact phrases/fields and author dispositions retained.
- B2A04: convergence; exact phrases/fields and author dispositions retained.
- B2A05: convergence; exact phrases/fields and author dispositions retained.
- B2A06: convergence; exact phrases/fields and author dispositions retained.

No rule or warning is suppressed. The linter implementation is unchanged; report metadata includes the additive versions. The current combined-bank CLI now fails before inventory at the separate N1 round-two binding error below, so the preceding complete comparison is not presented as a scan of the latest combined tree.

## Validation and moving-tree limits

Commands use existing dependencies, npm.cmd and --pool=threads. Full domain used --maxWorkers=1; full player used --maxWorkers=2 with the existing absolute preload path. No assertions or deadlines were weakened. Logs and immutable input locks are in tools/question-quality with this milestone prefix.

| Log suffix | Exact output | Scope/result |
|---|---|---|
| clinical-complete | Test Files  104 passed (104); Tests  885 passed (885); Duration  108.49s (transform 4.12s, setup 0ms, import 89.02s, tests 9.54s, environment 6ms) | Last complete clinical-content run; prior to the later N1 integration failure |
| domain-repaired | Test Files  1 failed \| 183 passed (184); Tests  26 failed \| 4590 passed \| 1 skipped (4617); Duration  806.94s (transform 7.75s, setup 0ms, import 235.26s, tests 554.05s, environment 12ms) | Last complete game-domain run; expected Level 5 failures only in that source window |
| domain-focused | Test Files  4 passed (4); Tests  22 passed (22); Duration  7.47s (transform 2.32s, setup 0ms, import 6.86s, tests 238ms, environment 0ms) | Four exact-binding/admission/inventory test files |
| domain-isolated | Test Files  2 passed (2); Tests  346 passed (346); Duration  19.48s (transform 2.00s, setup 0ms, import 4.21s, tests 15.09s, environment 0ms) | Inventory and preceding flag-preview expectation at original deadlines |
| player-final | Test Files  2 failed \| 350 passed (352); Tests  2 failed \| 3451 passed (3453); Duration  704.73s (transform 18.51s, setup 0ms, import 486.68s, tests 880.05s, environment 34ms) | Complete player run with existing preload, threads and two workers |
| player-isolated | Test Files  1 failed \| 1 passed (2); Tests  1 failed \| 1 passed (2); Duration  36.40s (transform 2.38s, setup 0ms, import 4.63s, tests 31.59s, environment 0ms) | Original projection deadline passes; protected cloud performance guard still fails |
| lint-tests | ℹ tests 33; ℹ pass 33; ℹ fail 0; ℹ duration_ms 1633.4007 | Last all-passing linter run before N1 assembly changed |
| lint-tests-handoff | ℹ tests 33; ℹ pass 32; ℹ fail 1; ℹ duration_ms 1098.5539 | Fresh linter run: one bank-import test blocked by N1 binding |
| clinical-scope-final | Test Files  1 failed (1); Tests  no tests; Duration  2.22s (transform 1.31s, setup 0ms, import 0ms, tests 0ms, environment 0ms) | Fresh clinical scope test: suite import blocked; no tests run |
| player-focused-final | Test Files  3 failed (3); Tests  no tests; Duration  4.98s (transform 1.66s, setup 0ms, import 0ms, tests 0ms, environment 0ms) | Fresh three presentation suites: imports blocked; no tests run |

Root `npm.cmd run typecheck`: all seven workspaces pass in `question-bank-batch2a-round2-typecheck-handoff-20261104.log`. The initial full clinical length failure was fixed, followed by full 885/885 passes. Early interrupted domain/player attempts are not counted as completed validation. An initial focused-player command used a relative preload path and failed MODULE_NOT_FOUND; it was corrected to the absolute preload for the final attempt listed above.

The full player failure in diagnosticProjectionDifferential.test.ts was a 30-second timeout; the original-deadline isolated rerun passes. The cloud diagnosticWorkloadPerformance.test.ts guard fails both full and isolated: isolated tick+overview 49.1916 ms against its unchanged 16 ms budget. No cloud code/test or performance threshold was edited. A read-only disposable fixture control finds the same active cases and byte-exact state after removing only six new empty concept histories; this narrows the content delta but does not establish timing causation. Cloud/performance owner review remains required.

**Latest combined-tree blocker:** `N1 round-two prior binding changed: case.n1.breast-mass-morphology.v1` from the separate question-new-n1-round2 stage. Fresh bank CLI, one clinical suite and all three affected presentation suites fail at import (zero tests run); the fresh linter run is 32/33, with its bank-dependent test failing at the same import. Those files/stage were left untouched. Earlier full runs are source-window evidence, not proof that the present combined tree starts or is green.

The separate N1 stage arrived during validation. This round exposes a stable QUESTION_BANK_BATCH2A_ROUND2_RELEASE stage and asserts that its timing rows form a retained prefix so another worker can append after it. Current source/packet correctness was rechecked with the actual owned projection and real release schema, independently of the later failing assembly: ten versions, six constructs, eight claims, 121 note responses and all protected source/asset hashes pass. This does not bypass or validate the default combined assembly.

Input-window JSONs for full/final/repaired launches record external changes separately. The repaired launch covers 4,882 files; later shared changes include N1 files, its assembly/timing/order appends and reducer.ts, plus this round’s stable-stage test alias. Do not attribute those other-lane edits to this batch or overwrite them. Earlier four-file in-memory hunk restoration proves other appended content was retained at that earlier checkpoint; later shared hashes naturally differ.

## Exact Level 5 failures and inputs

All 26 failures in the repaired full-domain run are in tests/level-five-integration.test.ts:

- M9 connected Level 5 reducer journey → binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash (recorded input binding).
- M9 Level 0–4 intake behavior after the ordinary cap-5 switch → matches the actual pre-M9 load and next 120 minutes: every pair of level {0,1,2,3,4} × schema {5,6,7,8,9} (25 separate initial-state SHA assertions, line 183). Each fails before its behavioral continuation. Other behavioral cases pass in that run; refreshed evidence must still be rerun by the manager.

Exactly these seven bound source inputs were changed by this milestone (four shared files also contain other workers’ appends):

- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/clinical-content/src/question-bank-batch2a-round2-20261104.ts`
- `packages/clinical-content/src/question-bank-batch2a-round2-20261104-data.ts`
- `packages/clinical-content/src/question-bank-batch2a-round2-evidence-20261104.ts`

The new PNG, documentation, question-quality tooling and .test.ts files are outside that source collector. No Level 5 evidence, Level 4/5 tests, release snapshot or rebind was edited. Manager owns the rebind and legacy behavioral-evidence refresh after integrating all lanes.

## Fixture changes and checks

New clinical/domain tests verify exact versions, schemas, retained histories, note coverage, timing and gates. The historical batch-2a binding suite now explicitly checks its retained round-one release stage. Admission expectations add exactly the six draft constructs without promoting approval. Inventory totals become 1,528 active study options / 160 terminal correct-test choices; the added runtime gate uses an existing service.

Six fixture files have documented expectation repairs. The read-only same-domain before/after control reproduces all three original supply snapshots before applying this round. Early-pool concept counts gain three at levels 1/2, with case counts unchanged; the new unseen-history mix legitimately changes seeded arrivals. Day 6 changes from a completed two-node perianal case to a completed one-node nutrition case. Sustained supply changes from 96 arrivals / 94 complete / 128 answers to 94 / 93 / 136, with zero walkouts in both; exact values are recorded in fixture-control JSON. All original commands, deadlines and 409 assertion call sites remain, plus one added exact guard (410 total).

The Oct-3 cohort study count 19→20 is a carried-over stale expectation from flag F13, not a new flag edit: the exact planned polysomnography preview already exists in both this round’s before and after bank. A new exact-row assertion documents it. F13 content stays frozen. Inventory’s one initial 10-second timeout passes in isolation and in the repaired full run without a timeout increase.

## Files and manager next actions

The machine-readable owned-files manifest lists every scoped path, current SHA and whether it was present at entry. Shared-file hashes include unrelated concurrent work; they are audit evidence, never instructions to replace whole files. Principal runtime/test paths:

- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/clinical-content/src/question-bank-batch2a-round2-20261104.ts`
- `packages/clinical-content/src/question-bank-batch2a-round2-20261104-data.ts`
- `packages/clinical-content/src/question-bank-batch2a-round2-evidence-20261104.ts`
- `packages/clinical-content/src/answer-choice-timing.test.ts`
- `packages/clinical-content/src/question-bank-batch2a-round2-20261104.test.ts`
- `packages/game-domain/tests/question-bank-batch2a-round2-bindings.test.ts`
- `packages/game-domain/tests/question-bank-batch2a-bindings.test.ts`
- `packages/game-domain/tests/approved-clinical-admission.test.ts`
- `packages/game-domain/tests/test-choice-order-inventory.test.ts`
- `packages/game-domain/tests/patient-supply.test.ts`
- `packages/game-domain/tests/diagnostics/patient-supply.test.ts`
- `packages/game-domain/tests/gs028-20261007-batch.test.ts`
- `packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts`
- `packages/game-domain/tests/surgery-center-batch.test.ts`
- `packages/game-domain/tests/gs028-20261003-batch.test.ts`
- `apps/player/public/clinical-exhibits/batch2a-r2-b04-pressure.png`
- `tools/question-quality/report.mjs`

Packets, source ledger, cue audit, queue, retire/merge ledger, original image generator, reproducible author/packet/verification/control tools and validation logs are included in the manifest. The standard remains v13; this round applies it rather than altering owner direction.

Queue update changes only the eleven batch rows and preserves 1,486 unrelated rows. Batch 2b has a refreshed next-forty proposal only; no variants were rewritten. Starting it is unsafe while the separate combined-bank assembly cannot import. Resume after manager integration and the review gate. Merge/retirement entries remain proposals only; F14 and neck-node KEEP decisions remain in force.

Manager actions: run independent review on the ten new drafts, resolve the separate N1 binding, rerun current combined lint/clinical/affected-player validation, investigate the protected cloud performance failure, then perform the owned Level 5 rebind/legacy refresh and acceptance. Keep old/fallback definitions if a draft is rejected; no worker release or save migration was performed.

This checkpoint exists only in the local shared working tree. No Git backup was created; any future “push to GitHub” instruction belongs with the manager after scoped review. No release or publication is authorized by a backup.
