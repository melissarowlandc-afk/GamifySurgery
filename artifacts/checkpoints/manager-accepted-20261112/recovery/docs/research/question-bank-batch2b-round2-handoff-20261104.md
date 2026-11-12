# Batch 2b round-two handoff — 2026-11-05

**STOP for independent review and manager integration. Nothing is shipped.** Thirty-seven returned items and the omitted F13 receive 38 candidate versions in 37 cases. B2B06 and B2B10 remain byte-exact PASS cases and are marked pipelinePassed in the new packet. The original round-one packet/review, batch-2a authoring/packet, prior approvals and question-new-* files are not edited by this worker. All new clinical versions, 31 materially changed concept versions and 69 atomic application/extension claims remain needs_clinician_review. Melissa Rowland remains clinical sign-off. Author checks are not independent or clinical approval.

Packet: `docs/research/question-bank-batch2b-round2-20261104.json` (40 records). **Key shown first for review only; runtime choices remain randomized.** Before fields reproduce the independently reviewed round-one drafts. F13 before is the manager-kept live v4; its unaccepted r4 is separately identified as the technical binding source, never described as shipped. All 292 returned cue/fairness/suggestion notes have indexed responses. Each revised record includes the deciding finding, two reasoning steps, closest credible error, counterfactual, stage/category check, visible prior feedback/results, source limitations and exact lint spans.

The final self-check replaced B2B01’s weak balloon-dilation foil with covered-metal stenting, removed the supplied gas interpretation from B2B34, made its hidden current gap clearer with coherent constructed panels, and replaced B2B30’s trivial low-glucose match with persistent ketone-acidosis infusion planning. B2B30 has a separate concept because the scored clinical meaning changes. The final B2B36 distractor clarification adds the shared anatomical word “breast”, removing an avoidable convergence signal. A B2B31 presentation clarification also makes the operative record, rather than the patient, describe the graft event. Neither clarification changes an ID, key, option count, concept, service, gate or timing profile; exact label bindings were regenerated and the final 62 clinical / 14 domain focused checks cover it. The latest full clinical rerun covers both clarifications. The full domain/player runs began before them; their native counts are retained with that limit, alongside fresh exact-binding and default-release controls.

## Manifest and frozen compatibility

`sourceView: "batch2b-round2"` is registered with the existing manager-owned ship projection. This worker adds **zero acceptance rows** and edits neither question-ship-manifest.ts nor question-ship-projection.ts. Review candidates stay in a separate source view. The integration adds new concept definitions to the live projection only when an exact manifest acceptance names the corresponding candidate; unaccepted drafts create no new live FSRS cards. The structural same-code control proves the complete manifest-selected release is identical with this round’s wrapper omitted: zero new live variants/cards. All 2,034 captured timing rows and 614 exact order records remain exact.

Fifty-two additive candidate test-choice records use existing timing profiles: two unchanged result-gate routes and fifty nonexecuted planning previews. No treatment or hospital-work executor, duration, selector, routing rule, save schema, frozen encounter or existing history is changed. B2B19 deliberately changes a new retrieval key from a fresh-ultrasound service to no service; its old executable identity remains retained. The B2B24 and B2B36 result gates are byte-exact. Source-view preservation verifies 1,152 untouched cases and 1,464 untouched decision nodes. B2B15 removes coaching from a shared presentation with a versioned presentation revision; its earlier question/options/feedback remain exact and are not an owner-approved version. B2B12 retains the presentation needed for its preceding confidentiality decision.

After acceptance, the manager must use the exact packet variant/concept tuple, the registered sourceView and the appropriate `headerSources[caseId] = "batch2b-round2"` for changed patient/context fields. Check the complete mixed accepted/fallback sequence, especially B2B15, B2B24 and B2B36/B2B37. Acceptance does not transfer clinical approval or any old FSRS history to a changed scored objective. No node is accepted automatically by passing a test.

## Source limitations and holds

The source ledger records 118 claims including retained basis claims and 44 source records, with full existing bibliographic metadata, access dates, authority, reuse restrictions, intended use and claim mappings. These are source records, not 44 independent corroborators. One-source limitations and lack of independently verified comparative rankings are explicit. No network, new source retrieval, access-date advance, source-prose storage or clinical-source approval is claimed. The new applications/extensions still need direct alignment and clinician review.

- B2B32 and B2B34: hold the exact albumin-correction equation/unit/reference aid until permitted source verification. Their observed chemistry/gas values are synthetic; visible cells, arithmetic and rounded pH/CO2/bicarbonate consistency are checked. The supplied laboratory reference is not asserted as a universal clinical cutoff.
- F13: verify the SASM awake gas-exchange exception and ranked investigation before acceptance. Keep its actual manager-selected v4 unchanged until then. F14 is untouched on its existing KEEP/source hold; the neck-node KEEP decision and passed B2B06 are preserved.
- Remaining new procedure/medication/assay applications retain explicit clinician/source-alignment limits, notably anticoagulated leak intervention, transplant cell targeting, withdrawal treatment, deep abscess origin and tissue-sampling adequacy. No exact doses, intervention intervals, outcome probabilities or demographic weights are invented.

## Per-item response and local fallback

The fallback below is the current local manifest-selected identity, not a verified deployed-build check. Original/intermediate definitions remain retained. All individual reviewer notes and responses are in the packet; no retirement or rollback is applied.

| Item | New candidate | Change / response | Current local fallback |
|---|---|---|---|
| B2B01 | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6 | Moves the patient into the active inpatient discussion, replaces remote drainage and balloon-dilation foils with a covered-metal-stent alternative, and gives a patient-specific reason to distinguish two otherwise overlapping endoscopic interventions. | question.postlaparoscopy.benign-referred-shoulder-pain.v2 |
| B2B02 | question.immunology.preformed-antibody-hyperacute-rejection.v1.r6 | Replaces three mechanism-labelled review plans with a balanced four-cell target/serum matrix. The antibody archive now changes the required assay rather than confirm a diagnosis already named in the key. | question.immunology.preformed-antibody-hyperacute-rejection.v1 |
| B2B03 | question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r6 | All pathways now share resuscitation and urgent exploration. The scored decision is a real transfusion error instead of urgent referral against two delays; the hospital chronology is explicit. | question.cirrhosis-perioperative-risk.multifactor-assessment.v3 |
| B2B04 | question.lymphangitis.heel-inguinal.v1.r6 | Removes the disputed open-versus-aspiration ranking and redundant cavity confirmation. The actual Doppler observation now changes the next action, and the three requests are specific neighboring ultrasound investigations. | question.lymphangitis.heel-inguinal.v1 |
| B2B07 | question.statistics-ethics.capacity-refusal.v3.r2 | Removes the model refusal speech and psychiatric-permission foil. Three concrete consent steps compete at the same point, and the key does not declare global incapacity. | question.statistics-ethics.capacity-refusal.v3 |
| B2B08 | question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2 | Removes the whole-breast residual malignant-field shortcut. A balanced four-operation matrix makes present response a real temptation while the original phenotype changes planning. | question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2 |
| B2B09 | question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r2 | All options are concrete operative sequences at the same intraoperative stage. Removes the urgent-versus-observe contrast and differentiates the arterial case from the venous sibling. | question.acute-mesenteric-ischemia.peritonitis-exploration.v3 |
| B2B11 | question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4.r2 | Removes the highlighted-age trap and stacked ward-recovery reassurance. All choices are named source-control interventions; the new raw cardiac trajectory changes the plan. | question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4 |
| B2B12 | question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4.r2 | Removes improvement and usual-appearance reassurance from the new update. A balanced local-treatment/analgesic matrix replaces a standard-treatment matching task. The earlier consent-to-share presentation remains because it supplies the frozen first question, and its irrelevance to this second task is disclosed. | question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4 |
| B2B13 | question.pathologic-nipple-discharge.diagnostic-imaging.v4.r2 | Removes the screening-versus-diagnostic wording giveaway. Four concrete target/method requests form a balanced matrix; the competing discharge histories no longer substitute for the sampling decision. | question.pathologic-nipple-discharge.diagnostic-imaging.v4 |
| B2B14 | question.appendicitis.stable-adult-ct.v4.r2 | Removes the unsuccessful-ultrasound and benign-ovarian exclusions. All options are actual CT requests at one stage, with necessary pregnancy/contrast context. | question.appendicitis.stable-adult-ct.v4 |
| B2B15 | question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r2 | Deletes the shared referral lecture about albumin and missing risk domains while retaining the earlier assessment question word-for-word. The follow-up tests an actual medication change rather than another automatic postpone-and-treat rule. | question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1 |
| B2B16 | question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2.r2 | All four options are active hospital treatment plans. Removes surgery-versus-assessment and problem-restating options; a balanced matrix makes both treatment components matter. | question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2 |
| B2B17 | question.dialysis-access.clinical-dysfunction-referral.v4.r2 | Replaces service-name matching and an unsupported infection treatment with three concrete vascular investigations. Removes generalized weight gain that did not change the prior referral. | question.dialysis-access.clinical-dysfunction-referral.v4 |
| B2B18 | question.hyperkalaemia.severe-community-result-transfer.v3.r2 | Deletes the irrelevant older potassium row and both outpatient-delay foils. All options are named IV interventions in the same hospital sequence; the persistent potassium and changed ECG must be interpreted together. | question.hyperkalaemia.severe-community-result-transfer.v3 |
| B2B19 | question.palpable-breast.negative-mammogram-targeted-us.v4.r2 | Key contains no quadrant copied from the stem. Neutral acquisition records distinguish review from repeat imaging; all three choices are concrete diagnostic steps. | question.palpable-breast.negative-mammogram-targeted-us.v4 |
| B2B20 | question.perianal-abscess.prompt-drainage.v4.r2 | Replaces routine aspiration foils with a balanced anatomical-route/adjunct matrix. MRI is necessary because the disease is not a visible superficial pocket. | question.perianal-abscess.prompt-drainage.v4 |
| B2B21 | question.postoperative-delirium.multicomponent-prevention-plan.v4.r2 | Deletes all artificial competing prevention bundles and hydration priority. Current non-drug measures and dangerous behaviour establish why a medication decision is being made; the raw drug history changes it. | question.postoperative-delirium.multicomponent-prevention-plan.v4 |
| B2B22 | question.acute-mesenteric-ischemia.peritonitis-exploration.v2.r2 | Removes clinic/transfer ambiguity and both later-review foils. Distinguishes this sibling by a different vascular compartment and action, not lactate wording. | question.acute-mesenteric-ischemia.peritonitis-exploration.v2 |
| B2B23 | question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r2 | Replaces the decorative lipase row with a local complication that changes treatment. A balanced timing/duct matrix removes a uniquely cautious or comprehensive key. | question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3 |
| B2B24 | question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2 | Adds the agreed conservation scope and an original spatial exhibit. Every option includes M, and P is no longer eliminated by an explicit negative row. The histology and geometry must determine the endpoint. | question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1 |
| B2B25 | question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r2 | Deletes the unsupported HIDA adequacy sentence and routine early-versus-drainage comparison. Three named operations compete after actual exposure, not an author label saying the critical view is impossible. | question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2 |
| B2B26 | question.cholecystitis.hida-after-equivocal-ultrasound.v3.r2 | Removes contrast CT from an unresolved equal-ranking comparison. Retains credible neighboring ductal and upper-GI questions, supplies raw ultrasound findings and uses no availability or test-property lead-in. | question.cholecystitis.hida-after-equivocal-ultrasound.v3 |
| B2B29 | question.hyperkalaemia.severe-community-result-transfer.v2.r2 | Names ramipril, removes the irrelevant pre-drug normal panel and both outpatient-delay foils. Current rather than earlier data select among three IV agents. | question.hyperkalaemia.severe-community-result-transfer.v2 |
| B2B30 | question.hyperkalaemia.severe-community-result-transfer.v4.r2 | Replaces the first draft’s trivial low-glucose-to-glucose match with serial raw ketone, chemistry and gas data. The four balanced infusion plans test two linked decisions; none is a uniquely comprehensive rescue bundle. | question.hyperkalaemia.severe-community-result-transfer.v4 |
| B2B31 | question.immunology.preformed-antibody-hyperacute-rejection.v4.r2 | Replaces another classic rejection explanation with a balanced system/time matrix and an actual bench-record discrepancy, distinct from the class-II cell-target sibling. | question.immunology.preformed-antibody-hyperacute-rejection.v4 |
| B2B32 | question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r2 | Removes every supplied gap conclusion and retrospective testing ambiguity. The calculation aid and coherent current numbers require work, and all alternatives are concrete cause-directed laboratory requests. | question.metabolic-acidosis.albumin-corrected-anion-gap.v1 |
| B2B33 | question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r2 | Acts at the current hospital decision time, removes the prior-author-error label and supplied adjusted result, and tests a concrete assay rather than a generic past-episode review. | question.metabolic-acidosis.albumin-corrected-anion-gap.v2 |
| B2B34 | question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2 | Both episodes are plausible active acid-base problems. The supplied aid requires calculation; the choices are actual current tests or record requests, not admission/current labels. | question.metabolic-acidosis.albumin-corrected-anion-gap.v3 |
| B2B35 | question.metabolic-acidosis.confirm-with-blood-gas.v3.r2 | Gives actual paired results instead of merely withholding a gas; the collection discrepancy determines the next specimen. No old explanatory note tells the learner which conclusion was mistaken. | question.metabolic-acidosis.confirm-with-blood-gas.v3 |
| B2B36 | question.palpable-breast.negative-mammogram-targeted-us.v1.r2 | Removes the narrated site-concordance verdict and location-repeating key. The actual acquisition, not age or the noun lump, distinguishes it from the retrieval sibling. | question.palpable-breast.negative-mammogram-targeted-us.v1 |
| B2B37 | question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r2 | Moves beyond the simple biopsy-despite-negative-imaging rule. A balanced target/method matrix contains two plausible independent sampling errors; all options are tissue requests. | question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1 |
| B2B38 | question.perianal-abscess.prompt-drainage.v1.r2 | Removes redundant superficial imaging and aspiration foils. The sibling tests a different real anatomical route, with the same balanced option structure. | question.perianal-abscess.prompt-drainage.v1 |
| B2B39 | question.perianal-abscess.prompt-drainage.v2.r2 | Removes the unsupported neutropenia severity/timing premise. Source control is already performed, so no omitted medical-first-versus-drainage decision is hidden. Both remaining decisions have explicit anatomical/host data. | question.perianal-abscess.prompt-drainage.v2 |
| B2B40 | question.perianal-abscess.prompt-drainage.v3.r2 | Deletes the misplaced anal-canal haemorrhoid exclusion and repeated normal-host checklist. All choices are named fistula procedures, and a real competing consideration changes the usual low-tract answer. | question.perianal-abscess.prompt-drainage.v3 |
| B2B41 | question.preoperative-nutrition.nutritional-risk-screening.v2.r2 | Removes the overt decline story, failing-baseline foil and route-permission sentence. All options are active named nutrition orders; actual delivery now changes the result. | question.preoperative-nutrition.nutritional-risk-screening.v2 |
| B2B42 | question.preoperative-nutrition.oral-enteral-first-line.v2.r2 | Gives the real indication for gastrointestinal imaging and actual feeding observations. Removes the repeated oral-plan foil and generic functional-gut permission wording; all options name specific accesses. | question.preoperative-nutrition.oral-enteral-first-line.v2 |
| F13 | question.preoperative-osa.validated-risk-screening.v4.r5 | Includes F13 explicitly. Replaces all alone/generic risk-message options with three named investigations and a current physiological conflict. The earlier source/difficulty deferral remains visible, not silently treated as an accepted rewrite. | question.preoperative-osa.validated-risk-screening.v4 |

## Advisory lint

Same v8 linter: selected 38 13 → 7 findings; owner-rule findings 2 → 0. The comparison uses the 37 reviewed round-one drafts plus F13 kept-live v4, not its rejected r4. The controlled authoring catalog has 1497 variants / 1189 cases; whole-catalog findings 1903 → 1895. Two additional warnings disappear from the retained earlier node’s visible context when B2B15’s shared coaching presentation is removed. No non-target node body changes.

The current manifest-selected live view is a different population: 1439 variants / 1131 cases / 1444 nodes, 6081 finite contexts, 2039 findings in 954 variants. It includes explicitly retained older versions with known cues. The linter continues to expose those defects; restoring a fallback is not a claim of quality. No warnings are suppressed.

The seven remaining candidate advisories concern one longer non-key biliary label, balanced breast/axillary and sampling matrices, a necessary glucose term, named investigation modalities, and the oral-route term in the intake decision. Exact phrases/fields and author dispositions are retained for independent attack. A clean lexical scan is not proof of difficulty or fairness. The queue updates only these forty rows; 1,457 unrelated rows stay exact. The retire/merge list contains proposals only. Batch 2c remains an unchanged proposal; no next-batch authoring occurs.

## Validation

| Check | Exact native result |
|---|---|
| clinical-post | 1073 pass / 50 fail / 0 skip / 1123 total |
| domain-handoff | 4556 pass / 452 fail / 1 skip / 5009 total |
| player-handoff | 3518 pass / 14 fail / 0 skip / 3532 total |
| clinical-verified | 62 pass / 0 fail / 0 skip / 62 total |
| domain-post | 14 pass / 0 fail / 0 skip / 14 total |
| player-focused | 21 pass / 0 fail / 0 skip / 21 total |
| player-variety | 20 pass / 0 fail / 0 skip / 20 total |
| lint-tests-verified | 33 pass / 0 fail / 0 skip / 33 total |
| author-checks-post | 8 pass / 0 fail / 0 skip / 8 total |
| typecheck-post | 7/7 workspaces pass |

The latest full clinical command uses `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2`; game-domain and full player use `--pool=threads --maxWorkers=2`. Player uses the existing absolute adversarial-r5 preload. Lint tests use `npm.cmd run clinical:lint:test`; author checks use Node `--test --test-isolation=none`; seven-workspace types use `npm.cmd run typecheck`. The exact commands, native logs, per-test failure headings and summaries are retained under the round-two tool prefix. No assertions, thresholds, timeouts or protected evidence are weakened.

**The shared tree is not green.** The broad failures coincide with the separate manifest/new-content and cloud/runtime work; the same-code control proves this worker’s unaccepted candidates do not change live cases/cards, and frozen timing/order entries remain exact. This does not adjudicate every external failure or certify legacy continuations behind stale hash guards. Manager integration must resolve the actual failures. No source outside the assigned lane is changed to make tests pass.

Clinical failed files:
- `src/development-batch/2026-09-29-statistics-ethics/runtime-flow.test.ts`: 12/61 fail.
- `src/question-new-n1-round3-20261104.test.ts`: 33/43 fail.
- `src/question-bank-batch2a-round3-20261104.test.ts`: 1/9 fail.
- `src/development-batch/2026-09-29-statistics-ethics/schema-runtime.test.ts`: 4/5 fail.

Game-domain: 26 expected Level5 guards (one current-input binding, plus the 25 initial legacy state-hash checks for levels 0–4 × schemas 5–9) are listed exactly in the bound-input artifact. The other 426 failures are separately recorded, including unaccepted new-content admission expectations, inventory/pool snapshots, older runtime flows, fixture admission and one frozen batch-2a binding test. They are **not** called expected evidence failures.

Player failed files:
- `src/session/cloud/operationalSession.test.ts`: 1/18 fail.
- `src/session/cloud/diagnosticWorkloadPerformance.test.ts`: 1/1 fail.
- `src/session/cloud/separateCampaign.test.ts`: 1/12 fail.
- `src/session/cloud/operationalSessionPerformance.test.tsx`: 1/1 fail.
- `src/session/cloud/watchdogs.test.ts`: 1/13 fail.
- `src/session/patientAvailabilityViewModel.test.ts`: 5/11 fail.
- `src/session/cloud/operationalEnginePerformance.test.ts`: 1/1 fail.
- `src/session/cloud/operationalController.test.tsx`: 1/4 fail.
- `src/session/cloud/operationalStatePatch.test.ts`: 2/5 fail.

Historical test fixes are limited to the old batch-2b clinical/domain tests using the retained round-one release and timing archive instead of the moving live release, and one cue-linter test using its exact round-one flag source view. All assertions remain. The current live CLI scan still detects the fallback cue defects. The separate worker owns the observed global timing/inventory integration repairs; this worker does not claim those edits.

The final runtime lock covers five owned runtime/asset files and the tracked shared-tree subset. The final B2B36/B2B31 clarifications postdate the broad domain/player starts and are covered by the latest full clinical run, fresh exact-binding checks and current structural control. Earlier logs/locks are retained, not overwritten. Other-worker test additions change suite totals across windows. Untracked current paths and shared changes are disclosed in the validation-window artifact; an absence of changes among tracked paths is not a claim that every concurrently created file was monitored.

## Exact Level5 bound inputs changed by this milestone

- `packages/clinical-content/src/answer-choice-timing.ts` — own additive registry/source-view hunk; shared file also contains other workers’ edits.
- `packages/clinical-content/src/index.ts` — own additive registry/source-view hunk; shared file also contains other workers’ edits.
- `packages/clinical-content/src/synthetic-content.ts` — own additive registry/source-view hunk; shared file also contains other workers’ edits.
- `packages/game-domain/src/test-choice-orders.ts` — own additive registry/source-view hunk; shared file also contains other workers’ edits.
- `packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts` — new bound input.
- `packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts` — new bound input.
- `packages/clinical-content/src/question-bank-batch2b-round2-evidence-20261104.ts` — new bound input.
- `packages/game-domain/src/question-bank-batch2b-round2-test-orders.ts` — new bound input.

These eight paths match the existing collector’s non-test TS/JSON package roots. The PNG, tests, docs and question-quality tools are excluded. `question-bank-batch2b-round2-bound-inputs-20261104.json` records before/current hashes and the exact 26 expected evidence-failure names. The manager must perform a real Level5 rebind and legacy behavioral refresh after combined acceptance. No evidence, driver, recorded hash, snapshot-save or Level4/5 test is edited here.

## Exact file ownership

Production/asset files (only own hunks in shared registries):
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts`
- `packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts`
- `packages/clinical-content/src/question-bank-batch2b-round2-evidence-20261104.ts`
- `packages/game-domain/src/question-bank-batch2b-round2-test-orders.ts`
- `apps/player/public/clinical-exhibits/batch2b-r2-b24-breast-map.png`

Tests:
- `packages/clinical-content/src/question-bank-batch2b-round2-20261104.test.ts`
- `packages/game-domain/tests/question-bank-batch2b-round2-bindings.test.ts`
- `packages/clinical-content/src/question-bank-batch2b-20261104.test.ts`
- `packages/game-domain/tests/question-bank-batch2b-bindings.test.ts`
- `tools/question-quality/lint.test.mjs`

Docs:
- `docs/execplans/question-bank-program-20261104.md`
- `docs/research/question-bank-program-queue-20261104.json`
- `docs/research/question-bank-retire-merge-proposals-20261104.md`
- `docs/research/question-bank-batch2b-round2-20261104.json`
- `docs/research/sources-question-bank-batch2b-round2-20261104.json`
- `docs/research/question-bank-batch2b-round2-cue-audit-20261104.md`
- `docs/research/question-bank-batch2b-round2-handoff-20261104.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`

Authoring/control scripts:
- `tools/question-quality/build-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/capture-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/control-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/draw-question-bank-batch2b-round2-20261104.ps1`
- `tools/question-quality/handoff-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/integrate-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/lock-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/question-bank-batch2b-round2-specs-20261104.mjs`
- `tools/question-quality/question-bank-batch2b-round2-specs.test.mjs`
- `tools/question-quality/queue-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/review-question-bank-batch2b-round2-20261104.mjs`
- `tools/question-quality/summarize-question-bank-batch2b-round2-validation-20261104.mjs`

Generated artifacts also include the immutable intake fixture, packet/source ledger, cue inventories, queue delta/refresh, bound-input hashes, validation locks/windows/summary and native logs. The machine file list is `tools/question-quality/question-bank-batch2b-round2-files-20261104.json`. No question-new-* file, cloud/save implementation, Supabase, selector/routing, entry/loading/art lane or Level5 evidence is edited by this worker.

## Manager next action

Run the independent round-two review on all 38 returned/omitted candidates, with the full visible sequence and the retained advisories. Keep the two PASS records frozen. Verify the three explicit source holds and the new comparative applications before acceptance. Decide whether the suggested transplant, acquisition and SGLT2 concept granularity warrants later merge proposals; no retirement or history migration is applied. Reconcile the large shared-tree failures before release and schedule the real evidence refresh. Everything remains in the working tree; no Git backup, network write, install or publication occurs.
