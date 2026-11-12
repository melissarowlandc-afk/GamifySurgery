# Question cue audit — 2026-10-28

Status: research and editorial review only. Clinical interpretation of audit flags is `needs_clinician_review`. This document describes repository wording; it does not validate the clinical keys, rescind existing approvals, or approve revisions.

Companion documents: [strategy](question-writing-strategy-20261028.md) and [source register](sources-question-writing-20261028.md).

## Scope and reproducible sample

Read-only inspection used the assembled `SYNTHETIC_CLINICAL_RELEASE` from [synthetic-content.ts](../../packages/clinical-content/src/synthetic-content.ts), release ID `clinical.synthetic.prototype.v1`. This is the default release in [game-domain context](../../packages/game-domain/src/context.ts). Its 1,110 cases have earliest facility stages 0:640, 1:259, 2:125, 3:66 and 4:20. These are unlock indices, not resident training levels or measured difficulty. There are no stage-5 cases in this export; a level-5 player's eligibility is not a separate authored question stratum.

The sample contains **40 distinct question variant IDs: eight at each stage**, spanning vascular, biliary, endocrine, nutrition, breast, bowel, wound, urology, imaging, perioperative care, ostomy, pediatrics, ethics and statistics. It is an equal-stage systematic editorial sample, not a random sample, a census or a play-frequency-weighted estimate.

Selection on the 2026-10-28 working files:

1. At each stage, flatten every case's decision nodes and sort by `case.id + "|" + node.id` using Node's default `localeCompare`.
2. Build a Map keyed by `primaryConceptId`; the **last** sorted case/node represents each concept. This avoids filling the sample with near-duplicate variants.
3. Sort representatives by `primaryConceptId`. Select zero-based indices `floor(i * (U - 1) / 7)`, for `i=0..7`.
4. The stage-specific U values were **176, 121, 47, 22, 10**. The exact selected identities are fixed below; prefer them if sorting behavior differs on another machine.
5. Read presentation, lead-in, current update, earlier returned result narratives and the current exhibit. Do not read future results into an earlier decision. Eight selected nodes are follow-up decisions. The audit uses canonical assembled text, including wording-repair layers; it does not sample every demographic profile or run a browser.
6. Read answer labels, not post-answer rationales, as candidate cues. The player view model gates `teachingPoint` on an existing answer; that field was **not** counted as pre-answer teaching. See [viewModels.ts](../../apps/player/src/session/viewModels.ts). Earlier feedback may still affect later decisions; browser acceptance should inspect that context separately.

Node 24.19.0 loaded the existing TypeScript modules with an in-memory resolve hook; no build, dependency installation, source script, test run or Git operation was used. A read-only SHA-256 manifest over 281 non-test TypeScript files in clinical-content/src and clinical-authoring/src produced `4f17533f963951cf68c00ad4e53eb99649748de2c9cd846b2157350f84fa7d18` at 2026-10-28T21:42:25Z. No source text or external article was saved as an audit corpus.

## Coding rules and limits

One AI-assisted reviewer coded the sample. There is no inter-rater reliability estimate or learner-response validation. Findings identify **review candidates**, not demonstrated effects on resident performance. In particular, a negative often appropriately makes an alternative less likely; absence of a symptom does not generally exclude a disease.

| Code | Operational definition |
| --- | --- |
| N | At least one explicit clinical absence, normal finding or absent decision prerequisite in the pre-answer context. Includes safety-scope negatives; excludes mere missing study data and generic “stable/well” wording alone. |
| E | An explicit absence/exclusion is directly aligned with an offered distractor, or a redundant cluster strongly pre-filters alternatives. “Aligned” includes weakening, not proven medical exclusion. Eight candidate judgments require clinician review. |
| D | A known or suspected target diagnosis/mechanism is explicitly labeled before answering. Often legitimate for a subsequent management task; this is **not** a claim that the diagnosis or key was improperly disclosed. Raw characteristic findings alone do not receive D. |
| K | The proposed keyed test, measure or action is itself named/permitted before options, including an abbreviation/expanded-name match. |
| T | A key-relevant interpretation is supplied rather than derived. A22 is an overt analytic teaching statement; the other four supply an intermediate interpretation. Whether that step belongs to the objective needs review. |
| H | Options mix semantic categories or fall outside the classification scope requested by the lead-in. |
| X | Explanatory/categorical/self-disqualifying option wording gives a nonclinical rejection route: universal mandates, absolute prohibition, irrelevant-risk claims, or explicitly incomplete follow-up. |
| G | A task-scope contradiction or logical shortcut is visible without the intended medical inference. |
| W | A meaningful multiword keyed phrase is repeated in pre-answer text and absent from the distractors. Manual semantic flag, not an unimplemented automated similarity score. |
| R | Recall/recognition dominates the observable task. This describes cognitive demand, not measured ease and not automatically a flaw. |
| L | Mechanical review flag: longest option word count divided by shortest is at least 2.0. |
| U | The key is uniquely longest by token count. Descriptive; not by itself a defect. |

Word tokens match `[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*`. Hyphenated words count once; abbreviations count once; punctuation does not count. **All option-count vectors below show the key first, then the three authored distractors, for review only.** Every selected item has four options and `shuffleAnswers: true`; runtime order must remain randomized. No grammar-only clue, all/none-of-the-above set, or confirmed convergence defect was identified in this sample. These are zero observed findings, not guarantees about the full bank.

## Statistics

All denominators are the 40 sampled variants; codes overlap.

| Feature | n/40 | Percent | Interpretation |
| --- | ---: | ---: | --- |
| N: any pertinent/scope negative | 27 | 67.5% | Many are necessary for safe scope. |
| E: negative/exclusion aligned to offered options | 8 | 20.0% | A06, A08, A17, A27, A28, A30, A38, A40. |
| D: diagnosis/mechanism explicitly labeled | 19 | 47.5% | Context disclosure; not 19 “given-away keys.” |
| K: keyed answer named/permitted | 3 | 7.5% | A02, A23, A25. |
| T: intermediate interpretation/teaching | 5 | 12.5% | A04, A11, A22, A28, A30; overt teaching subset 1/40. |
| H: heterogeneous/out-of-scope options | 2 | 5.0% | A06, A31. |
| X: explanatory/categorical rejection cue | 5 | 12.5% | A01, A03, A11, A12, A38. |
| G: logical/task-scope shortcut | 4 | 10.0% | A17, A30, A31, A37. |
| W: exclusive meaningful phrase repeat | 1 | 2.5% | A23; other semantic naming is captured by K. |
| R: recall/recognition dominant | 13 | 32.5% | Does not imply recall items are always easy. |
| L: length ratio at least 2.0 | 6 | 15.0% | None of these six has a uniquely longest key. |
| U: uniquely longest key | 2 | 5.0% | A27 and A38, ratios only 1.4 and 1.2. |
| At least one E/K/T/H/X/G/W flag | 19 | 47.5% | Editorial candidate rate, **not** an estimated bank defect rate. |

| Earliest facility stage | Cases in export | Sample n | N | At least one E/K/T/H/X/G/W |
| --- | ---: | ---: | ---: | ---: |
| 0 | 640 | 8 | 3 | 6 |
| 1 | 259 | 8 | 7 | 2 |
| 2 | 125 | 8 | 4 | 3 |
| 3 | 66 | 8 | 5 | 5 |
| 4 | 20 | 8 | 8 | 3 |

All 40 enable answer shuffling; all 40 have four choices. Thirty-five have instantiation profiles: 24 have four profiles, two have two, nine have one; five have none. Profile count does not establish different reasoning demands. For example, A28's first profile repeats the canonical clinical story with demographic context.

The sample does **not** support a general claim that the key is usually longest. A15, A18 and A20 illustrate reasonably parallel option construction; A24 has perfectly matched option length but tests a fact directly. No distractor can be called statistically non-functioning without an appropriate response denominator.

## Item-level table

Observations below are short original paraphrases of project-owned variants. A proposed elimination relationship is a wording-review hypothesis, `needs_clinician_review`, not a new clinical teaching claim.

### Earliest facility stage 0

| Audit | Stable question variant and case | Observation / potential exploit | Codes | Option words |
| --- | --- | --- | --- | --- |
| A01 | `question.aaa.female-perioperative-mortality.repair-approaches.v1`<br>`case.aaa.female-perioperative-mortality.repair-approaches` (node 1) | AAA repair counseling: one distractor limits the sex association to rupture and another makes sex irrelevant after EVAR; categorical claims invite rejection without comparing evidence. | D, X, R | 11/12/10/8 |
| A02 | `question.cholecystitis.hida-after-equivocal-ultrasound.v2`<br>`case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs` (node 1) | Gallstone follow-up: the presentation says HIDA is available, and the key is its expanded test name. This is a direct answer-name cue, although test availability is legitimate context. | D, K, L | 2/2/3/4 |
| A03 | `question.fhh.parathyroid-surgery-counseling.v1.p2e.confidentiality.v2`<br>`case.gs028se.p2e.confidentiality.v2.fhh` (node 2) | Confirmed FHH counseling: the update already says surgery is not offered; distractors include an assured cure and thyroid removal. The diagnosis is legitimate context, but the comparison is weak. | D, X, R, L | 6/10/8/5 |
| A04 | `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2`<br>`case.gs028f.nutrition.c1-where-phosphate-went` (node 1) | Refeeding follow-up: an insulin-associated phosphate shift is supplied before asking which compartment receives phosphate. The interpreted mechanism removes an inferential step. | N, D, T, R | 5/6/6/6 |
| A05 | `question.iodinated-contrast.physiologic-versus-allergic-like-reaction.v2`<br>`case.gs028e.radiology.c3-limited-hives` (node 1) | Contrast reaction classification: wheals are recoded as urticaria in the lead-in. The option set is parallel; this remains mostly recognition, with no counted direct key cue. | R | 4/4/4/5 |
| A06 | `question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1`<br>`case.gs028b.nipple-discharge.paired-bloody-single-duct` (node 1) | Bloody nipple discharge: absent lactation weakens the milk-production option; absent fever also lowers an infectious distractor without excluding infection. Classification labels are mixed with a disease diagnosis. | N, E, H, R | 3/3/3/3 |
| A07 | `question.small-bowel-obstruction.urgent-surgical-escalation.v2`<br>`case.gs028.small-bowel-obstruction.b-systemic-decline` (node 1) | Deteriorating obstruction: the positive reassessment findings carry the decision. Parallel action choices; no counted technical cue. Ease or safety importance is not itself a flaw. | D | 3/4/5/4 |
| A08 | `question.wound.secondary-intention-healing.v1`<br>`case.gs028e.wound-healing-remaining.c2-skin-excision-plan` (node 1) | Open wound healing: the stem excludes a graft and planned later closure while those approaches are offered. The remaining task is primarily naming the described healing method. | N, E, R | 4/5/5/4 |

### Earliest facility stage 1

| Audit | Stable question variant and case | Observation / potential exploit | Codes | Option words |
| --- | --- | --- | --- | --- |
| A09 | `question.aaa.one-time-ultrasound-screening.v1`<br>`case.aaa.retired-carpenter` (node 1) | AAA screening: absence of pain establishes a screening context. Four equally short test labels; the negative is justified rather than coded as excess elimination. | N | 2/2/2/2 |
| A10 | `question.choledocholithiasis.intermediate-mrcp.v4`<br>`case.choledocholithiasis.resolved-colic` (node 1) | Possible duct stone: no cholangitis and no definite obstructing stone support the decision context. MRCP is shorter than its distractors; abbreviation alone is not proof of cueing. | N, D, L | 1/2/2/2 |
| A11 | `question.differentiated-thyroid-cancer.individualized-surgical-extent.v1`<br>`case.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology` (node 2) | Thyroid operative planning: the update supplies favorable extent and no other high-risk driver. Wrong answers mandate total surgery for everyone, avoid evaluation entirely, or use age alone. | N, D, T, X | 6/6/4/6 |
| A12 | `question.high-output-ileostomy.sodium-glucose-oral-rehydration.v1`<br>`case.bread-butter.high-output-ileostomy.watery-output` (node 2) | Ileostomy fluid planning: absence of obstructive/infectious symptoms and acute kidney injury defines outpatient feasibility. An option forbidding all oral fluids is a conspicuous extreme. | N, X | 4/6/5/5 |
| A13 | `question.nephrolithiasis.recurrent-metabolic-evaluation.v2`<br>`case.nephrolithiasis.uncertain-ureteral-stone` (node 2) | Recurrent stones: acute infection and obstruction are excluded before a prevention question. These negatives are largely outside the current option comparison; the prevention options have comparable detail. | N, D | 9/9/8/10 |
| A14 | `question.postoperative-dvt.venous-duplex.v4`<br>`case.postoperative-dvt.postop-visit` (node 1) | Postoperative leg swelling: a long list excludes chest symptoms, limb threat, cancer, prior VTE and other treatment issues before an imaging question. Much of that information does not distinguish the offered tests. | N, L | 3/2/3/5 |
| A15 | `question.soft-tissue-mass.extremity-mri.v2`<br>`case.soft-tissue-mass.upper-arm` (node 1) | Enlarging soft-tissue mass: an inconclusive ultrasound precedes local-imaging selection. Imaging options are homogeneous and similarly specific; no counted technical cue. | — | 6/5/6/6 |
| A16 | `question.zenker-diverticulum.false-pouch-anatomy.v1`<br>`case.zenker-diverticulum.regurgitated-food` (node 2) | Returned swallow study: the result describes a posterior pouch; the item asks its wall layers. A plausible anatomic set, but predominantly an association-recall task. | N, R, L | 3/2/4/5 |

### Earliest facility stage 2

| Audit | Stable question variant and case | Observation / potential exploit | Codes | Option words |
| --- | --- | --- | --- | --- |
| A17 | `question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3`<br>`case.adrenal-incidentaloma.renal-cancer-mass` (node 1) | Adrenal biopsy preparation: normal cortisol screening reduces the attraction of repeating dexamethasone testing. Offering the biopsy itself as the test that must precede that biopsy creates a logical shortcut. | N, E, G | 2/3/2/3 |
| A18 | `question.celiac.initial-serology.v3`<br>`case.celiac.weight-loss-discomfort` (node 1) | Possible celiac disease: gluten exposure is retained as an interpretive prerequisite. Laboratory strategies have comparable detail; no counted technical cue. | N | 7/7/5/6 |
| A19 | `question.esophageal-dysphagia.upper-endoscopy.v4`<br>`case.esophageal-dysphagia.restaurant-meals` (node 1) | Persistent solid-food dysphagia: no current impaction or emergency feature establishes timing. The investigations are homogeneous; those negatives do not directly delete the listed alternatives. | N | 4/3/4/3 |
| A20 | `question.inflammatory-breast-cancer.neoadjuvant-sequence.v1`<br>`case.inflammatory-breast-cancer.rapid-redness` (node 2) | Breast cancer sequence: the returned biopsy and staging are already known. Absence of distant disease supplies needed management scope; all four sequences are five words long. | N, D | 5/5/5/5 |
| A21 | `question.quality-improvement.pdsa-act-and-iterate.v4`<br>`case.gs028se.pdsa-act-qi-measures.a-incomplete-data` (node 1) | QI cycle: missing outcome observations drive the Act decision. The exhibit duplicates the scenario but does not supply an explicit preferred action; comparable action options. | — | 8/7/7/8 |
| A22 | `question.statistics-ethics.fisher-exact.v2`<br>`case.gs028se.fisher-exact-study-design.a-tiny-pilot` (node 1) | Statistical test: the exhibit already judges the large-sample approximation unreliable, and the lead-in calls the table sparse. The learner need not derive that assessment from the counts. | T | 3/4/3/3 |
| A23 | `question.statistics-ethics.risk-ratio-odds-ratio.v4`<br>`case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical` (node 1) | Effect measure: the stem and exhibit label the estimate an odds ratio; the key says to report an odds ratio. The exact meaningful phrase is exclusive to the key. | K, W, R | 7/7/8/8 |
| A24 | `question.wound-healing.vitamin-c.vitamin-identification.v1`<br>`case.l2.wound-healing.vitamin-c.vitamin-identification.v1` (node 1) | Collagen cofactor: a general postoperative wrapper surrounds a direct vitamin fact. All options have two words; increasing stem length would not by itself increase cognitive demand. | R | 2/2/2/2 |

### Earliest facility stage 3

| Audit | Stable question variant and case | Observation / potential exploit | Codes | Option words |
| --- | --- | --- | --- | --- |
| A25 | `question.gs028g.hiv-perioperative.art-continuity.v1`<br>`case.gs028g.hiv-perioperative.paired-routine-elective` (node 1) | Perioperative ART: the stem expressly permits continuation, then asks which plan to use. The continuation wording makes the intended answer visible before comparing plans. | D, K | 6/5/6/5 |
| A26 | `question.gs028g.incidental-gallbladder.t1a-depth.v1`<br>`case.gs028g.incidental-gallbladder.paired-lamina-only` (node 1) | Gallbladder depth: lamina-propria involvement and an uninvolved muscle layer precede a staging-label question. The negative is needed for the distinction; this is not excess elimination. | N, D, R | 2/2/2/2 |
| A27 | `question.gs028g.laparoscopy-respiratory.co2-absorption.v2`<br>`case.gs028g.laparoscopy-respiratory.paired-ventilation-load` (node 1) | Laparoscopic CO2: a normal circuit, no hyperthermia and no airway obstruction directly oppose all three distractor mechanisms. The key is the only mechanism not pre-excluded. | N, E, R, U | 7/5/5/6 |
| A28 | `question.gs028g.merkel-cell.integrated-diagnosis.v1`<br>`case.gs028g.merkel-cell.paired-skin-panel` (node 1) | Skin malignancy: the integrated report expressly excludes melanoma and lymphoma, both offered answers, and identifies a primary cutaneous neuroendocrine process before asking for the diagnosis. | N, E, D, T | 3/4/4/4 |
| A29 | `question.gs028g.neuromuscular-recovery.quantitative-assessment.v1`<br>`case.gs028g.neuromuscular-recovery.paired-head-lift` (node 1) | Neuromuscular recovery: an isolated head lift without objective measurement leads to assessment selection. Option lengths vary, but the key is the shortest; no counted direct cue. | D, L | 3/5/6/4 |
| A30 | `question.gs028g.peristomal-skin.restore-seal.v1`<br>`case.gs028g.peristomal-skin.paired-wide-opening` (node 2) | Peristomal skin care: the stem supplies a noninfectious diagnosis and attributes it to the pouch opening. Antibiotic/antifungal options and enlarging an already oversized opening are easy exclusions. | N, E, D, T, G | 6/4/4/7 |
| A31 | `question.gs028g.subtotal-cholecystectomy.remnant-classification.v1`<br>`case.gs028g.subtotal-cholecystectomy.paired-unsafe-triangle` (node 2) | Subtotal procedure: the update states the remnant was left open. Two answers are subtotal subtypes, while total removal and tube drainage fall outside the requested classification. | H, G, R | 3/3/3/3 |
| A32 | `question.variety3.hair-no-interference.v1`<br>`case.variety3.hair-no-interference` (node 1) | Hair preparation: noninterference is repeated as a decision prerequisite. All options are five words; retain the prerequisite if it determines the plan rather than deleting it to create uncertainty. | N | 5/5/5/5 |

### Earliest facility stage 4

| Audit | Stable question variant and case | Observation / potential exploit | Codes | Option words |
| --- | --- | --- | --- | --- |
| A33 | `question.pediatric-clinic.testis-no-longer-stays-down.v2`<br>`case.pediatric-clinic.testis-no-longer-stays-down` (node 1) | Testicular position: the lead-in names suspected acquired ascent after describing the examination. No acute pain/swelling sets outpatient scope; diagnosis disclosure is context for disposition. | N, D | 6/7/5/6 |
| A34 | `question.pediatric-clinic.supraclavicular-neck-lump.v1`<br>`case.pediatric-clinic.supraclavicular-neck-lump` (node 1) | Supraclavicular node: no recent respiratory or overlying skin infection weakens a reactive narrative; no airway/swallowing problem sets urgency. Positive location and growth still need interpretation. | N | 5/5/5/5 |
| A35 | `question.pediatric-clinic.child-wants-plan-explained.v2`<br>`case.pediatric-clinic.child-wants-plan-explained` (node 1) | Assent discussion: a reactive, nonurgent problem is established, and the child explicitly requests an explanation. The communication task is transparent; this alone does not establish an item-writing defect. | N, D | 7/8/8/7 |
| A36 | `question.pediatric-clinic.intermittent-groin-swelling.v2`<br>`case.pediatric-clinic.intermittent-groin-swelling` (node 1) | Intermittent groin bulge: the lead-in calls it an inguinal hernia before disposition is chosen. No pain, vomiting or skin change establishes outpatient scope. | N, D | 5/4/6/6 |
| A37 | `question.pediatric-clinic.prominent-chest-brace-question.v1`<br>`case.pediatric-clinic.prominent-chest-brace-question` (node 1) | Pectus treatment preference: the case introduces bracing and requests active nonsurgical treatment. Direct surgery contradicts that stated goal, while observation does not supply the requested active treatment. | N, D, G | 4/6/6/4 |
| A38 | `question.pediatric-clinic.shrinking-mobile-neck-nodes.v2`<br>`case.pediatric-clinic.shrinking-mobile-neck-nodes` (node 1) | Improving neck nodes: several absent alarm findings weaken the urgent-oncology option. A discharge option explicitly omits reassessment instructions, making it self-disqualifying. | N, E, X, U | 6/5/5/5 |
| A39 | `question.pediatric-clinic.sunken-chest-exercise-limits.v1`<br>`case.pediatric-clinic.sunken-chest-exercise-limits` (node 1) | Sunken chest and exercise symptoms: the lead-in supplies the pectus label. No rest/acute symptoms constrains timing; referral plans are parallel, with no counted direct cue. | N, D | 6/5/8/6 |
| A40 | `question.pediatric-clinic.upper-midline-lump.v1`<br>`case.pediatric-clinic.upper-midline-lump` (node 1) | Upper-midline defect: the vignette explicitly denies navel and groin bulges, exactly where the three alternative hernias are located. The remaining task is a straightforward location-to-name association. | N, E, R | 2/2/3/3 |

## Where to inspect the authoring inputs

The assembled IDs above are authoritative. Main source lanes, relative to `packages/clinical-content/src/`, are:

- A01: `approved-data/aaa-female-sex-perioperative-mortality.ts`; A03: `approved-data/familial-hypocalciuric-hypercalcemia.ts` plus `development-batch/2026-09-29-statistics-ethics/ethics-clinical-pairings.ts`.
- A02: `development-batch/2026-10-02-pre-endoscopy/urgent-families.ts`; A04: `development-batch/2026-10-07-variety-2/nutrition.ts`; A05/A08: `development-batch/2026-10-07-variety/` radiology/wound-healing files.
- A06/A11: `development-batch/2026-09-29-pre-endoscopy/` nipple-discharge/differentiated-thyroid-cancer files; A07: `development-batch/2026-09-28-pre-endoscopy/small-bowel-obstruction.ts`.
- A09: `development-batch/2026-09-17/abdominal-aortic-aneurysm.ts`; A14: `development-batch/2026-09-12/postoperative-dvt.ts`; A10: `development-batch/2026-09-13/choledocholithiasis.ts`; A12: `development-batch/2026-09-17-bread-and-butter/high-output-ileostomy.ts`.
- A13/A15/A18: `development-batch/2026-09-09/` nephrolithiasis/soft-tissue-mass/celiac files; A16: `development-batch/2026-09-11/zenker-diverticulum.ts`; A17/A20: `development-batch/2026-09-17/` adrenal-incidentaloma/inflammatory-breast-cancer files; A19: `development-batch/2026-09-10/esophageal-dysphagia.ts`.
- A21–A23: `development-batch/2026-09-29-statistics-ethics/statistics-variants.ts` and `statistics-qi.ts`; A24: `approved-data/vitamin-c-collagen-hydroxylation.ts` through `level-two-runtime.ts`.
- A25–A31: `development-batch/2026-10-07-level3/authoring.ts`, `atomic-facts.ts` and batch helpers.
- A32: `development-batch/2026-10-10-variety-3/perioperative.ts`; A33–A40: `development-batch/2026-10-08-pediatric-clinic/` testes, neck-node, communication, hernia and chest-wall authoring.
- Existing [wording repair data](../../packages/clinical-content/src/patient-library-wording-repair-data.ts), [clinical-content schema](../../packages/clinical-content/src/schema.ts), [authoring workflow](../../packages/clinical-authoring/src/workflow.ts), [authoring field guide](../clinical-workbench/PILOT_FIELD_GUIDE.md), and [workspace template](../../clinical-data/templates/authoring-workspace.template.json) were inspected for pipeline recommendations. No question-authoring fields are assumed to exist in that normalized workspace yet.

## Findings to take forward

1. Prioritize A02/A23/A25 direct naming, A27/A28 explicit pre-exclusion and A11/A12/A38 option wording for clinical/editorial review.
2. Review the purpose and decision timing of negatives before deleting them. A14 has many negatives relevant to other tasks; A26's uninvolved muscle layer is necessary for its staging distinction. Both can have N while only a subset of negatives needs revision.
3. Ask whether the intended target is recognition or interpretation. A22 can present counts without announcing the analytic conclusion. A28 can present pathology findings without a diagnostic summary that excludes named answer choices.
4. Check all pre-answer surfaces in the future browser review: current update, exhibit, chief complaint, prior feedback, source labels, test previews and the question itself. A stem-only linter would miss several findings.
5. Have a named clinician independently recode E/D/T and the cognitive objective before applying changes; retain the original counts as this audit's snapshot. A second resident-oriented reviewer should solve masked-key items and explain the decision. This milestone collected no tester answers.

## Handoff

Written: this audit plus the companion strategy and source register. Evidence: exact 40-ID sample, reproducible selection, descriptive code definitions and word-count vectors. Sources: repository runtime/authoring modules and privacy/FSRS documents; assessment-source interpretation is in the companion documents.

Open questions: which negatives are medically essential; which supplied diagnoses are intentional prerequisites; whether owner/clinician review and voluntary tester flags support the predicted difficulty and cue judgments; and whether profiles change reasoning rather than demographics. Clinical approval, implementation and telemetry remain outstanding decisions for later milestones. No game content, question data, code, tests, shared handoff, Git state or dependencies were edited by this research lane.

