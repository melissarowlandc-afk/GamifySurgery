# Anal cancer: independent review response

**Current result: 5 pass-preserved / 5 revised / 2 parked.** Ten current questions in ten self-contained clinic cases. All current clinical versions remain `needs_clinician_review`. The five v2 revisions have no independent PASS.

Current explicit import: `ANAL_CANCER_CURRENT_ARTIFACTS` in `packages/clinical-content/src/question-topic-anal-cancer-20261111.ts`. The original v1 exports and the initial packet below are a preserved review archive, not the current admission queue. No shared registry, manifest, runtime, selector, FSRS, save, manager handoff, commit, push or deployment changed.

## Review basis and bounded plan

Decision source: `docs/research/question-topic-anal-cancer-review-20261111.json`, SHA-256 `d3001beee96024405269333eaa28225ce81ba4a520f635c6ec07fa944e4d3ab9`. Five PASS and seven REVISE; no FAIL. Manager direction permits splitting exact PASS wording from returned companions and parking a once-attempted revision when a fair harder ranking cannot be supported.

```json
{
  "goal": "Preserve five exact independent PASS items; revise or park seven returned items once; no current mixed-review multi-part composition.",
  "constraints": [
    "Five-file lane only; shared tree preserved.",
    "No agents, installs, commits, pushes, deployment or external messages.",
    "All clinical material stays needs_clinician_review.",
    "Original v1 arrays remain historical reviewed artifacts; current exports form a separate explicit-import response queue."
  ],
  "milestones": [
    "Freeze exact reviewed question, scored-node and visible header/profile content.",
    "Author one response per returned item; verify new facts from permitted public sources.",
    "Split preserved PASS nodes into standalone compositions where returned companions cannot be admitted.",
    "Regenerate packet and source mappings; add preservation/composition tests; run only focused Vitest and clinical-content typecheck."
  ],
  "nextAction": "Manager re-reviews five exact v2 questions and the two standalone PASS compositions, coordinates the out-of-lane typecheck fix, and decides exact admission. Preserve all three unresolved clinical holds."
}
```

```json
[
  {
    "date": "2026-11-11",
    "result": "Independent review reconciled: five PASS and seven REVISE; no FAIL. Reviewed original clinical inputs preserved as baseline."
  },
  {
    "date": "2026-11-11",
    "result": "Preserved every reviewed v1 question and original case byte-equivalent at serialization; authored five v2 revisions, parked two after concrete single attempts, and isolated all passing nodes into standalone current compositions."
  },
  {
    "date": "2026-11-11",
    "result": "Response complete: 5 pass-preserved / 5 revised / 2 parked. Focused file 21/21 PASS; both JSON outputs parse. Package typecheck fails only in the out-of-lane pancreas topic at 997:48. No shared file changed."
  }
]
```

## Item status and counts

| Reviewed exact version | Status | Current exact version | Current case |
|---|---|---|---|

| question.topic.anal-cancer.regional-node-treatment.v1 | pass-preserved | question.topic.anal-cancer.regional-node-treatment.v1 | case.topic.anal-cancer.regional-node-treatment.standalone.v1 |

| question.topic.anal-cancer.treat-intraepithelial-lesion.v1 | pass-preserved | question.topic.anal-cancer.treat-intraepithelial-lesion.v1 | case.topic.anal-cancer.treat-intraepithelial-lesion.standalone.v1 |

| question.topic.anal-cancer.irradiated-groin-recurrence.v1 | pass-preserved | question.topic.anal-cancer.irradiated-groin-recurrence.v1 | case.topic.anal-cancer.groin-recurrence.v1 |

| question.topic.anal-cancer.metastatic-first-systemic-line.v1 | pass-preserved | question.topic.anal-cancer.metastatic-first-systemic-line.v1 | case.topic.anal-cancer.distant-recurrence.v1 |

| question.topic.anal-cancer.clear-margin-observation.v1 | pass-preserved | question.topic.anal-cancer.clear-margin-observation.v1 | case.topic.anal-cancer.margin-favorable.v1 |

| question.topic.anal-cancer.sample-provenance.v1 | revised | question.topic.anal-cancer.sample-provenance.v2 | case.topic.anal-cancer.sample-depth.v2 |

| question.topic.anal-cancer.local-staging-record.v1 | revised | question.topic.anal-cancer.local-staging-record.v2 | case.topic.anal-cancer.local-extent.v2 |

| question.topic.anal-cancer.cytology-to-histology.v1 | revised | question.topic.anal-cancer.cytology-to-histology.v2 | case.topic.anal-cancer.screening-target.v2 |

| question.topic.anal-cancer.adverse-margin-histology.v1 | revised | question.topic.anal-cancer.adverse-margin-histology.v2 | case.topic.anal-cancer.margin-initial.v2 |

| question.topic.anal-cancer.salvage-local-failure.v1 | revised | question.topic.anal-cancer.salvage-local-failure.v2 | case.topic.anal-cancer.salvage-standalone.v2 |

| question.topic.anal-cancer.new-nodule-after-hsil.v1 | parked | none | none |

| question.topic.anal-cancer.confirm-local-recurrence.v1 | parked | none | none |

```json
{
  "reviewed": 12,
  "originalPass": 5,
  "originalRevise": 7,
  "originalFail": 0,
  "passPreserved": 5,
  "revised": 5,
  "parked": 2,
  "currentQuestions": 10,
  "currentCases": 10,
  "currentConcepts": 10,
  "activeMultiPartCases": 0,
  "passNodesSplitFromMixedCases": 2,
  "neutralFinalRoutingAdditions": 1,
  "newConceptMeanings": 1,
  "stableRevisedConceptIdentities": 4,
  "newSourceRecords": 2,
  "totalSourceRecords": 11,
  "newAtomicClaims": 4,
  "totalAtomicClaims": 29,
  "currentTestingChoiceProposals": 11
}
```

Seven returned items each received one response attempt: five retained as explicit v2 drafts and two parked without a key. Four revisions retain the scored meaning; the initial-treatment margin item has a new concept version. Initial-program audit counts remain historical in JSON `counts`; current response counts are JSON `reviewRound.counts`.

## Exact PASS preservation and case composition

All five complete authored QuestionVariant objects, scored node fields, patient headers, demographics and finite profiles match the reviewed baseline. The three originally standalone cases remain complete-case exact. Regional-treatment and HSIL-treatment PASS nodes were isolated from their returned companions using their same reviewed header/profile and scored wording.

The previously middle HSIL-treatment node needs final routing in its new standalone case. It receives only the existing neutral `no_terminal_outcome` convention, reusing reviewed rationale text. No task, option, key, rationale, explanation, exhibit, current update or patient-profile wording changes. This routing/composition needs manager recheck; a new full-composition PASS is not asserted.

| PASS version | Question SHA-256 (both versions) | Scored-node SHA-256 (both) | Split | Neutral routing added |
|---|---|---|---|---|

| question.topic.anal-cancer.regional-node-treatment.v1 | 0f15f2970de71c99f4830d3759b85aa8ca55b8821f08376f248ba1d1f2a159ef | d554eb4e8ce2b4052b825105d9fcbce25483f3d6a8829ec5fdbaa9856d0e2e6c | true | false |

| question.topic.anal-cancer.treat-intraepithelial-lesion.v1 | a28ce18d9b9f2c7747373fef59750233b466268fafba7f71869b23bae99e93ed | 457d5f832bf34533e3f0eff4528f81090b29584bff2f0f3910a36008eaaf2fcd | true | true |

| question.topic.anal-cancer.irradiated-groin-recurrence.v1 | d2cf9d8658d01d6ea0c5ce10313bd149ddaaae9fb7d287019ea830eeb4f29111 | 9509613103f9d5e24a3091a50b1be1722e2f34dc4a76bd7fc5f9076933c19f63 | false | false |

| question.topic.anal-cancer.metastatic-first-systemic-line.v1 | 2ab2ad08267435a4e14194c9ef0eab96ac257a896df437d784fb9d75f0a675d3 | 33c6a9755f44ba341d7d306b5fe069e8a9460a19b06e7e615148f61d6d473c7c | false | false |

| question.topic.anal-cancer.clear-margin-observation.v1 | a2d23447a0b751957c6768f91ea46fbfad3ba26c2893a1906578bec9059fe268 | b4d35a8ec65b16be3e1c0182fac52185202bc2be44647b25e6c8057f541fd75d | false | false |

```json
{
  "archiveOnly": "The v1 seven-case mixed review set is retained verbatim for provenance, not the current preview queue.",
  "currentEntryPoint": "ANAL_CANCER_CURRENT_ARTIFACTS",
  "currentPolicy": "All ten current cases are standalone. No pass/revised or pass/parked companion composition is active.",
  "passSplits": "Regional treatment and HSIL treatment retain the exact reviewed patient/header/profile and scored wording. The middle HSIL node gains only neutral final routing.",
  "notNewPass": "Five revised exact v2 items and two changed standalone PASS compositions still require manager/independent recheck; there is no author-granted PASS.",
  "futureNaturalSequences": [
    {
      "nodes": [
        "sample-provenance.v2",
        "local-staging-record.v2",
        "regional-node-treatment.v1"
      ],
      "disposition": "Proposal only. Recompose after every node has an applicable independent PASS and a full-sequence cue review; preserve the existing PASS wording."
    }
  ],
  "selection": "Standalone current supply uses existing unseen/due rules. No FSRS, selector or paired-case eligibility change."
}
```

Every current case contains one scored node. No mixed PASS/revised or PASS/parked multi-part case is offered. Natural recomposition remains a manager proposal only after every companion has applicable independent PASS and the full visible sequence has been reviewed.

## Issue-by-issue dispositions

### question.topic.anal-cancer.sample-provenance.v1 - revised

Clarity issue: The task asks for a 'sampling procedure', but 'Deeper sections of the outside tissue block' processes an existing sample rather than sampling the patient. This category mismatch partially eliminates a distractor before clinical reasoning.

Response: The task now asks which diagnostic step to arrange, so acquisition and processing of retained tissue are both valid categories.

Reviewed cue: `A separate soft skin tag lies posterior to the anal verge.`

Concern: Together with the specimen label, 'separate' makes the wrong-target problem explicit. A reader can match the remaining mass to the only choice naming that mass without interpreting the histology. The anatomic distinction is necessary, but this option set does not make its interpretation demanding.

Response: Removed the separate soft skin tag; the biopsy is from the clinically correct site, leaving specimen layers rather than obvious anatomic mismatch as the problem.

Reviewed cue: `Anoscopy-guided biopsy of the canal mass`

Concern: Only this option repeats the unresolved 'canal'/'mass' target. The two other choices concern a swab or the already benign block; the key wins by target matching.

Response: No option repeats canal mass as a unique target label. Incisional biopsy competes with deeper-block review until the epithelial-only inventory is interpreted.

Fairness disposition: Retains the representative-tissue principle while requiring interpretation of high-grade epithelium versus unrepresented invasion. No biopsy depth threshold or technique hierarchy is invented.

Suggestions: Used a matched-target specimen-adequacy problem and a neutral task. The rubric records a block-inventory counterfactual; no basic-recognition acceptance is claimed.

### question.topic.anal-cancer.local-staging-record.v1 - revised

Reviewed cue: `The archive contains the full series.`

Concern: Directly supplies the location and completeness of the information needed by 'Specialist review of the archived pelvic MRI'. Retrieval beats repeating acquisition by ordinary reading, without knowledge of anal-cancer staging.

Response: Removed the complete archive and record-retrieval key. The current specimen, CT interface and canal findings create a clinical imaging decision.

Reviewed cue: `No diagnostic pelvic series appears on the transferred media.`

Concern: Explicitly names a transfer omission, immediately after affirming completed acquisition. The only option addressing that named omission is review of the archive.

Response: Removed the transfer-media omission rather than hiding whether a scan was acquired; this new scenario does not ask retrieval versus repetition.

Reviewed cue: `pelvic staging review`

Concern: The task's 'review' also matches the sole review option; both alternatives request a new acquisition. The key is uniquely the nonduplicative information-retrieval plan.

Response: Removed pelvic staging review and all sole-review option wording. All options are actual staging acquisitions.

Fairness disposition: PET remains a complementary staging investigation. CT local interface and examination now drive local extent and acquisition scope; this is not an administrative task with decorative CT findings.

Suggestions: Compared MRI, endoanal ultrasound and PET/CT using local anatomy and stenosis. The ultrasound limitation is supported by a rights-checked imaging review, with current society support for MRI local staging.

### question.topic.anal-cancer.regional-node-treatment.v1 - pass-preserved

Fairness disposition: Exact reviewed question, scored node, patient header and finite profiles are preserved. Editorial PASS remains separate from clinical sign-off; optional suggestions were not applied.

Suggestions: Preserved the exact PASS wording, including optional post-answer asides. No optional edit or high-difficulty claim is added.

### question.topic.anal-cancer.cytology-to-histology.v1 - revised

Reviewed cue: `no anal tissue specimen submitted`

Concern: Names the missing action. Only 'High-resolution anoscopy with directed biopsies' supplies tissue; the reader need not interpret the particular cytologic abnormality to identify that option.

Response: Deleted no anal tissue specimen submitted. The actual submitted skin-wart specimen and standard examination are shown instead.

Reviewed cue: `Repeat anal cytology and HPV testing`

Concern: Repeats both tests already presented as completed and abnormal. Against an MRI labeled for staging and a tissue-acquisition option, it makes simple diagnostic-sequence elimination easy.

Response: Removed repeat-swab and staging-MRI alternatives. Two procedures now acquire directed biopsies; interpretation requires specimen compartment and acquisition scope.

Fairness disposition: Feedback explicitly applies to this high-grade anal result, not every abnormal screening combination. Normal palpation and a low-grade perianal wart are not treated as clearance of the anal epithelium.

Suggestions: Used documented targeting/acquisition scope with HRA versus standard visualization and pathology review. No unsupported screening cutoff or basic-item label was introduced.

### question.topic.anal-cancer.treat-intraepithelial-lesion.v1 - pass-preserved

Fairness disposition: Exact reviewed question, scored node, patient header and finite profiles are preserved. Editorial PASS remains separate from clinical sign-off; optional suggestions were not applied.

Suggestions: Preserved the exact PASS wording, including optional post-answer asides. No optional edit or high-difficulty claim is added.

### question.topic.anal-cancer.new-nodule-after-hsil.v1 - parked

Reviewed cue: `Anoscopy with directed biopsy of the nodule`

Concern: Only this option names the task's 'new anal nodule'. The other options are the same repeat-screening and staging-MRI alternatives already rejected in the first node.

Response: Attempted a tissue-route comparison rather than a key uniquely naming the nodule against swab/MRI.

Reviewed cue: `The swab and palpation answer different questions.`

Concern: This exact earlier-node explanation preteaches why swab results do not settle a tissue lesion. Returning the same biopsy-versus-swab-versus-MRI choice mostly rehearses that distinction.

Response: Removed the earlier scored sequence; the returned node will not follow a feedback-rehearsed diagnostic distinction.

Reviewed cue: `the present nodule is a new finding`

Concern: Repeats 'New indurated ulcerated anal-canal nodule' and 'new focal pain'. The repeated novelty reinforces the targeted-nodule choice rather than adding decision information.

Response: Removed repeated assertions that the nodule is new; one clinical finding plus negative cytology remains in the attempted draft.

Fairness disposition: The clinical biopsy principle remains sound. The once-attempted route contest lacked supported observations ranking potentially adequate sampling methods, so it is parked rather than keyed ambiguously.

Suggestions: Tried the suggested distinct tissue-sampling decision, then withheld it when a fair single route could not be supported. It may remain unscored follow-up teaching.

### question.topic.anal-cancer.irradiated-groin-recurrence.v1 - pass-preserved

Fairness disposition: Exact reviewed question, scored node, patient header and finite profiles are preserved. Editorial PASS remains separate from clinical sign-off; optional suggestions were not applied.

Suggestions: Preserved the exact PASS wording, including optional post-answer asides. No optional edit or high-difficulty claim is added.

### question.topic.anal-cancer.metastatic-first-systemic-line.v1 - pass-preserved

Fairness disposition: Exact reviewed question, scored node, patient header and finite profiles are preserved. Editorial PASS remains separate from clinical sign-off; optional suggestions were not applied.

Suggestions: Preserved the exact PASS wording, including optional post-answer asides. No optional edit or high-difficulty claim is added.

### question.topic.anal-cancer.clear-margin-observation.v1 - pass-preserved

Fairness disposition: Exact reviewed question, scored node, patient header and finite profiles are preserved. Editorial PASS remains separate from clinical sign-off; optional suggestions were not applied.

Suggestions: Preserved the exact PASS wording, including optional post-answer asides. No optional edit or high-difficulty claim is added.

### question.topic.anal-cancer.adverse-margin-histology.v1 - revised

Clarity issue: The task is understandable, but the treatment choice does not say whether chemoradiation is postoperative adjuvant treatment. With the tumor already excised and 12-mm clear margins, that distinction matters to the claim being taught.

Response: The current item explicitly asks initial definitive treatment after an incisional biopsy, with the lesion still present. It no longer ambiguously prescribes postoperative CRT.

Fairness disposition: Did not extrapolate exclusion from favorable initial excision into mandatory adjuvant CRT after wide complete excision. The original postoperative ranking remains withheld; current initial-treatment facts support a different explicit concept version.

Suggestions: Used the suggested before-definitive-excision scenario. Replaced wider re-excision/surveillance with initial definitive CRT, local excision and APR; new concept preserves old postoperative history.

### question.topic.anal-cancer.confirm-local-recurrence.v1 - parked

Reviewed cue: `Dedicated diagnostic T2 and diffusion images show focal scar-site thickening.`

Concern: The distractor 'Repeat pelvic MRI with diffusion imaging' repeats the specifically completed study without any acquisition problem or interval change. It is a disposable repeat-test foil.

Response: Removed the already-completed diffusion-MRI repeat foil in the once-attempted diagnostic-route revision.

Reviewed cue: `Anoscopy-guided biopsy of the scar nodule`

Concern: Only this option directly names the new nodule in the task and examination. Combined with an explicitly nondiagnostic MRI, the set strongly advertises targeted tissue acquisition.

Response: No uniquely targeted nodule-biopsy label is scored; the tissue-method contest cannot be ranked from supported target/access observations and is parked.

Reviewed cue: `Obtain histology before selecting radical salvage treatment.`

Concern: This is legitimate post-answer teaching for the current investigation, but 'radical salvage treatment' previews the next node's only radical surgical salvage option. It is a sequence cue, not leakage into the current answer.

Response: Attempted feedback now ends with distinguishing viable tumor from treatment change, not radical salvage. This item is not executed before the revised salvage question.

Fairness disposition: The existing late recurrence-confirmation principle remains valid. A fair hard route decision would require additional supported access/depth criteria; those were not invented.

Suggestions: Used one neutral-feedback tissue-method attempt, then parked it. Current biopsy/restaging are explicit outside-record prerequisites in the standalone salvage item.

### question.topic.anal-cancer.salvage-local-failure.v1 - revised

Reviewed cue: `Obtain histology before selecting radical salvage treatment.`

Concern: The preceding node's explanation has already announced radical salvage as the coming treatment direction. The new positive biopsy now unlocks the sole operation, 'Salvage abdominoperineal resection', without requiring a fresh choice of treatment intent.

Response: The preceding confirmation item is parked and absent from the current case. Its attempted feedback no longer names radical salvage.

Reviewed cue: `confirmed local failure`

Concern: The task supplies a classification the staging findings could otherwise require the learner to establish. Alongside the prior radical-salvage scaffold, it further weakens the disseminated-disease treatment competitor.

Response: Changed the task to which plan to recommend for the anal-canal cancer, leaving the tissue, history and restaging to establish isolated local failure.

Fairness disposition: Preserved biopsy, prior definitive therapy, current anatomy and distant staging. The independent review itself described the unscaffolded item as potentially moderate/two-step; the current case supplies those findings independently.

Suggestions: Removed prior answer rehearsal and the classification in the task. The new exact v2 still needs independent review; no new PASS is inferred.

## Revised before/after packets

**key shown first for review only.** Runtime choices remain randomized. Before material is archived review context; it is not current pre-answer context. All observations in the new exhibits are independently constructed finite teaching records, not real patient records or universal cutoffs.

### question.topic.anal-cancer.sample-provenance.v2

Status **revised**, not independently passed. Before: `question.topic.anal-cancer.sample-provenance.v1`. Current node `node.topic.anal-cancer.sample-provenance.v2`; case `case.topic.anal-cancer.sample-depth.v2`; concept `concept.anal-scc.biopsy-and-staging` (reuse). Previous concept `none`.

#### Before - exact reviewed version

Presentation: {patientName}, a 59-year-old woman, attends clinic for persistent bleeding from an anal lesion after an outside procedure.

Complaint: Anal bleeding

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Clinic examination",
      "value": "A firm, friable mass occupies the left lateral anal canal. A separate soft skin tag lies posterior to the anal verge."
    },
    {
      "label": "Outside procedure map",
      "value": "The excised specimen is labelled posterior perianal skin tag."
    },
    {
      "label": "Histology",
      "value": "The skin-tag specimen contains benign keratinized squamous epithelium and fibrous tissue."
    }
  ]
}
```

Task: Which sampling procedure should the clinic arrange now for {patientName}’s bleeding anal lesion?

**key shown first for review only.**

- **KEY** Anoscopy-guided biopsy of the canal mass (`choice.topic.anal-cancer.sample-provenance.mass`).

  - Rationale: The benign posterior skin specimen does not represent the left canal mass. Obtain tissue from the unresolved lesion.

  - Temptation: Use the benign finding locally while checking which lesion was sampled.

  - Changed circumstance: A concerning posterior skin lesion would instead justify targeted posterior skin sampling.

  - Claims: claim.question-topic.anal-cancer.representative-tissue, claim.question-topic.anal-cancer.sampling-limits. Timing: timing.test.biopsy.

- Anal cytology with HPV genotyping (`choice.topic.anal-cancer.sample-provenance.swab`).

  - Rationale: A screening swab does not establish histology of this firm visible lesion.

  - Temptation: Choose a less invasive HPV assessment after seeing benign tissue.

  - Changed circumstance: Anal cytology can screen an eligible asymptomatic person with HIV rather than diagnose a mass.

  - Claims: claim.question-topic.anal-cancer.representative-tissue, claim.question-topic.anal-cancer.abnormal-cytology-hra. Timing: timing.test.pathology_review.

- Deeper sections of the outside tissue block (`choice.topic.anal-cancer.sample-provenance.levels`).

  - Rationale: Additional sections can reassess the submitted skin tissue but cannot sample the separate canal mass.

  - Temptation: Look for missed cancer in the existing block without reconciling its anatomic target.

  - Changed circumstance: If the block represented the suspicious lesion and retained relevant deeper tissue, additional sections could clarify an initially nondiagnostic sample.

  - Claims: claim.question-topic.anal-cancer.representative-tissue, claim.question-topic.anal-cancer.sampling-limits. Timing: timing.test.pathology_review.

Explanation: The benign histology belongs to a different target. Obtain representative tissue from the canal mass; subsequent cancer staging depends on its diagnosis.

#### After - exact new candidate

Patient: Evelyn Marsh, 59, Female. Complaint: Anal bleeding.

Presentation: Evelyn Marsh, a 59-year-old woman, attends clinic for persistent bleeding after an outside anal biopsy.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These are separate fields.

Question SHA-256 `b6ef4d257a2ab319786232a9e0c1c0f7b1683a7d204abc30c23deeeb52906f84`; node SHA-256 `9a93ddc72d7072ebd8203749ffaaeee9a0a6b3fd52473dd72717470977801b19`.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Clinic examination",
      "value": "A firm anal-wall nodule lies beneath a shallow left-lateral ulcer and bleeds with contact."
    },
    {
      "label": "Outside procedure map",
      "value": "Forceps biopsies were taken from the left-lateral ulcer edge."
    },
    {
      "label": "Histology",
      "value": "Squamous epithelial strips show high-grade atypia. No connective tissue is present on the examined levels."
    },
    {
      "label": "Block inventory",
      "value": "The remaining embedded material consists of epithelial strips."
    }
  ]
}
```

Complete task: **Which diagnostic step should the clinic arrange now for Evelyn Marsh’s anal lesion?**

**key shown first for review only.**

- **KEY** Anoscopy-guided incisional biopsy (`choice.topic.anal-cancer.sample-provenance.v2.incision`).

  - Rationale: The biopsy sampled the correct surface site but contains no tissue that characterizes the underlying firm nodule. Obtain representative lesion architecture rather than infer that epithelial dysplasia excludes invasion.

  - Temptation: Reconcile the sampled layers with the palpable abnormality before selecting how to obtain diagnostic tissue.

  - Changed circumstance: If the block contained unexamined connective tissue representing the nodule, specialist deeper-level review could clarify invasion without a new acquisition.

  - Claims: claim.question-topic.anal-cancer.representative-tissue, claim.question-topic.anal-cancer.sampling-limits, claim.question-topic.anal-cancer.r2.epithelial-sample-limits. Timing: timing.test.biopsy.

- Specialist review with additional block sections (`choice.topic.anal-cancer.sample-provenance.v2.levels`).

  - Rationale: Additional sections can reassess the submitted epithelium but cannot create unsampled underlying tissue. The block inventory does not supply the nodule's architecture.

  - Temptation: Treat a correct surface biopsy location as proof that the clinically important deeper tissue is in the block.

  - Changed circumstance: This is reasonable when retained tissue actually includes the unresolved lesion compartment and further sections can evaluate it.

  - Claims: claim.question-topic.anal-cancer.sampling-limits, claim.question-topic.anal-cancer.r2.epithelial-sample-limits. Timing: timing.test.pathology_review.

- Repeat anal cytology with HPV testing (`choice.topic.anal-cancer.sample-provenance.v2.swab`).

  - Rationale: A swab cannot supply tissue architecture of this palpable lesion or settle whether its deeper tissue is invasive.

  - Temptation: Use a less invasive epithelial test to resolve a question about underlying lesion architecture.

  - Changed circumstance: Anal cytology can be used for appropriate asymptomatic screening rather than as the diagnostic endpoint for a palpable nodule.

  - Claims: claim.question-topic.anal-cancer.representative-tissue, claim.question-topic.anal-cancer.abnormal-cytology-hra. Timing: timing.test.pathology_review.

Post-answer explanation: The sampled site is correct, but represented tissue matters as well as location. Epithelial atypia does not characterize the firm underlying nodule; obtain representative tissue rather than use extra levels of epithelial material as proof about invasion.

Five manual checks, author judgment only:

1. **Cue attack:** The neutral diagnostic-step task allows both tissue acquisition and processing of existing tissue. Removed the separate benign tag and labels repeating canal mass only in the key. All labels name a diagnostic process; deeper-section review remains a credible competitor until the layer/block observations are interpreted.

2. **Stage/category:** Three diagnostic plans: new tissue acquisition, additional evaluation of retained tissue, and epithelial screening. No treatment option is mixed in.

3. **Two consequential steps:** Distinguish epithelial high-grade atypia from an assessment of invasion in the underlying palpable nodule. Then Use the epithelial-only block inventory to choose representative new tissue rather than additional levels that cannot include the missing compartment.

4. **Difficulty:** Fair moderate PGY-2/3 author prediction. Layer-versus-target adequacy creates two linked inferences; no hard label or basic-item exception is claimed. Closest error: Assume a biopsy from the correct lesion location necessarily contains the tissue needed to assess its full clinical abnormality. Consequence: The nodule's diagnosis could be delayed by treating surface dysplasia or another epithelial result as an adequate assessment of deeper disease.

5. **One best answer:** Incisional lesion tissue addresses the unrepresented architecture; review cannot recover tissue not submitted and a swab cannot establish it. Decider: Both examined levels and retained block material contain epithelial strips, whereas examination identifies a firm underlying nodule. Counterfactual: Change the block inventory to retained unexamined connective tissue representing the nodule: specialist deeper-level review becomes a reasonable first diagnostic step.

Deletion test:

- Remove the nodule finding and the need to assess underlying architecture is no longer established.
- Remove the block inventory and deeper levels become a genuinely unresolved alternative.
- Keep the sampled location because this revision deliberately tests depth/architecture rather than another wrong-site match.

Sequence: Standalone response case. No earlier answer establishes sampling insufficiency or rehearses the biopsy choice; no later staging result is visible.

Repair/re-solve: Addressed category mismatch and both target-matching cues. Re-solved matched-location but unrepresented-layer evidence against retained-block review; no exact biopsy depth cutoff or unsupported route hierarchy is invented.

### question.topic.anal-cancer.local-staging-record.v2

Status **revised**, not independently passed. Before: `question.topic.anal-cancer.local-staging-record.v1`. Current node `node.topic.anal-cancer.local-staging-record.v2`; case `case.topic.anal-cancer.local-extent.v2`; concept `concept.n3.anal-cancer-distant-staging-versus-local-extent` (reuse). Previous concept `none`.

#### Before - exact reviewed version

Presentation: {patientName}, a 59-year-old woman, attends clinic for persistent bleeding from an anal lesion after an outside procedure.

Complaint: Anal bleeding

Earlier visible feedback: The benign histology belongs to a different target. Obtain representative tissue from the canal mass; subsequent cancer staging depends on its diagnosis.

Current update: Biopsy of {patientName}’s canal mass now shows invasive squamous carcinoma.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Diagnostic CT chest, abdomen and pelvis",
      "value": "No distant lesion is identified. The interface between the anal mass and posterior vaginal wall is indistinct."
    },
    {
      "label": "MRI acquisition log",
      "value": "Dedicated pelvic T2 and diffusion series were completed. The archive contains the full series."
    },
    {
      "label": "Transferred MRI media",
      "value": "Contains scout/localizer images. No diagnostic pelvic series appears on the transferred media."
    }
  ]
}
```

Task: Which step should the clinic arrange next to complete {patientName}’s pelvic staging review before treatment planning?

**key shown first for review only.**

- **KEY** Specialist review of the archived pelvic MRI (`choice.topic.anal-cancer.local-staging-record.review`).

  - Rationale: Local anatomy remains a planning question, but the diagnostic acquisition exists. Obtain and review it rather than equate incomplete transfer with an unperformed scan.

  - Temptation: Reconcile acquisition, storage and transferred-series records.

  - Changed circumstance: If the examination ended after localizers and the archive had no diagnostic series, dedicated MRI acquisition would be needed.

  - Claims: claim.question-topic.anal-cancer.mri-local. Timing: timing.test.general_diagnostic.

- Repeat dedicated pelvic MRI acquisition (`choice.topic.anal-cancer.local-staging-record.repeat`).

  - Rationale: The completed diagnostic series is retained in the archive; the current limitation is the transferred media.

  - Temptation: Infer that missing exported series were never acquired.

  - Changed circumstance: A technically incomplete or nondiagnostic original examination would justify a new acquisition.

  - Claims: claim.question-topic.anal-cancer.mri-local. Timing: timing.test.mri.

- Obtain a new FDG PET/CT acquisition (`choice.topic.anal-cancer.local-staging-record.pet`).

  - Rationale: Metabolic staging can complement standard studies but does not replace the acquired anatomic assessment of this interface.

  - Temptation: Substitute a new whole-body study for resolution of local anatomy.

  - Changed circumstance: An unresolved nodal or distant distribution question can justify complementary metabolic assessment.

  - Claims: claim.question-topic.anal-cancer.mri-local, claim.question-topic.anal-cancer.ct-distant. Timing: timing.test.pet_ct.

Explanation: Local anatomy matters despite CT without distant disease. The full pelvic MRI was acquired and retained; transfer and specialist review resolve the current information gap without repeating acquisition.

#### After - exact new candidate

Patient: Evelyn Marsh, 59, Female. Complaint: Treatment planning.

Presentation: Evelyn Marsh, a 59-year-old woman, attends clinic after biopsy of an anal-canal lesion.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These are separate fields.

Question SHA-256 `02946e3ef57e2fd743fc2a1d1faa7b810f28dd7a37048eaade13e6d8a3d058f0`; node SHA-256 `96f94496f4e71c726dd96fd389ee7eb5105eb85cace0d7f8243481a3b715061a`.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Biopsy",
      "value": "Invasive squamous carcinoma from the anal-canal lesion."
    },
    {
      "label": "Examination",
      "value": "A firm annular narrowing limits passage beyond the distal canal. Stool continues to pass; there is no vomiting."
    },
    {
      "label": "Diagnostic CT chest, abdomen and pelvis",
      "value": "A bulky canal mass contacts the posterior vaginal wall; that interface is indistinct. No distant lesion is identified."
    }
  ]
}
```

Complete task: **Which additional imaging investigation should be arranged for Evelyn Marsh’s anal-cancer treatment planning?**

**key shown first for review only.**

- **KEY** Pelvic MRI (`choice.topic.anal-cancer.local-staging-record.v2.mri`).

  - Rationale: The unresolved issue is the primary's relationship to adjacent pelvic structures. MRI provides local anatomic coverage without passing a probe through the narrowed canal.

  - Temptation: Interpret the unresolved local interface and the acquisition constraint together.

  - Changed circumstance: If adequate local MRI already mapped the interface but the remaining question were systemic nodal distribution, PET/CT could supply complementary staging information.

  - Claims: claim.question-topic.anal-cancer.mri-local, claim.question-topic.anal-cancer.r2.eus-stenosis-limit. Timing: timing.test.mri.

- Endoanal ultrasonography (`choice.topic.anal-cancer.local-staging-record.v2.eus`).

  - Rationale: Ultrasound can assess selected local lesions, but canal narrowing limits probe-based assessment and its coverage is less comprehensive for the represented pelvic extent question.

  - Temptation: Use a local wall-staging modality without accounting for the stenotic acquisition or required field of view.

  - Changed circumstance: For a small nonstenotic lesion when MRI cannot be obtained, endoanal ultrasound is a reasonable local-assessment alternative.

  - Claims: claim.question-topic.anal-cancer.mri-local, claim.question-topic.anal-cancer.r2.eus-stenosis-limit. Timing: timing.test.advanced_diagnostic.

- FDG PET/CT (`choice.topic.anal-cancer.local-staging-record.v2.pet`).

  - Rationale: Metabolic staging can supplement the workup, but the current unresolved question concerns a specific local soft-tissue interface rather than a demonstrated systemic distribution gap.

  - Temptation: Treat completed distant staging as a reason to add another whole-body study instead of resolving local extent.

  - Changed circumstance: An unresolved nodal or distant distribution question after appropriate local assessment can justify complementary PET/CT.

  - Claims: claim.question-topic.anal-cancer.mri-local, claim.question-topic.anal-cancer.ct-distant. Timing: timing.test.pet_ct.

Post-answer explanation: Distant CT assessment does not settle local invasion. The indistinct pelvic interface and narrowed canal favor pelvic MRI over probe-based ultrasound or another whole-body metabolic study for the current planning question.

Five manual checks, author judgment only:

1. **Cue attack:** Removed archive completeness, transfer omissions and the task word review. All alternatives are actual imaging acquisitions with estimates; the key is the shortest label. No modality is named as missing or already waiting to be retrieved.

2. **Stage/category:** Three named staging investigations; MRI and ultrasound genuinely compete for local assessment, while PET has a complementary distribution role.

3. **Two consequential steps:** Separate the unresolved adjacent-organ interface from the completed distant staging question. Then Account for canal narrowing and the required anatomic coverage when choosing MRI rather than probe-based ultrasound.

4. **Difficulty:** Fair moderate PGY-2/3 prediction from local-versus-distant scope and modality limitations; not an administrative retrieval item and not independently passed. Closest error: Choose endoanal ultrasound as a local wall test without incorporating the stenotic acquisition and broader pelvic interface. Consequence: The chosen investigation may not answer the local treatment-planning question or may fail to acquire the required extent.

5. **One best answer:** Current society guidance favors MRI for local extent; the technical canal constraint further weakens ultrasound for this particular presentation. PET is not portrayed as having no staging role. Decider: A narrowed canal and an indistinct tumor–vaginal interface remain despite a diagnostic distant CT assessment. Counterfactual: Keep a local-assessment task but change to a small nonstenotic lesion and an inability to obtain MRI: endoanal ultrasound becomes a reasonable offered alternative.

Deletion test:

- Without the CT interface the clinical local-extent consequence is less specific.
- Without narrowing the strongest ultrasound acquisition discriminator disappears.
- Ongoing stool passage without vomiting keeps the constructed visit in a stable staging phase rather than an obstruction emergency.

Sequence: Standalone imaging question; neither an earlier tissue question nor a completed-MRI retrieval explanation supplies the key. The preserved regional-treatment PASS is in a separate case.

Repair/re-solve: Replaced the low-yield retrieval problem with a consequential local staging choice. Verified ultrasound limitations from a rights-checked open imaging review and local MRI preference from current society guidance; no unperformed-study ambiguity is hidden.

### question.topic.anal-cancer.cytology-to-histology.v2

Status **revised**, not independently passed. Before: `question.topic.anal-cancer.cytology-to-histology.v1`. Current node `node.topic.anal-cancer.cytology-to-histology.v2`; case `case.topic.anal-cancer.screening-target.v2`; concept `concept.topic.anal-cancer.cytology-hra.v1` (reuse). Previous concept `concept.anal-hsil.high-risk-hpv-association`.

#### Before - exact reviewed version

Presentation: {patientName}, a 48-year-old man living with HIV, attends clinic to review outside anal-screening results.

Complaint: Anal screening review

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Screening specimen",
      "value": "Anal swab with high-grade squamous cytologic abnormalities and oncogenic HPV detected."
    },
    {
      "label": "Current examination",
      "value": "No palpable anal lesion."
    },
    {
      "label": "Outside procedural record",
      "value": "Anal swab collection and digital examination; no anal tissue specimen submitted."
    }
  ]
}
```

Task: Which diagnostic investigation should the clinic arrange next for {patientName}’s anal-screening findings?

**key shown first for review only.**

- **KEY** High-resolution anoscopy with directed biopsies (`choice.topic.anal-cancer.cytology-to-histology.hra`).

  - Rationale: Cytology detects abnormal cells but does not supply tissue architecture. HRA identifies and samples flat lesions that need not be palpable.

  - Temptation: Connect specimen type with the limits of a normal examination.

  - Changed circumstance: If representative tissue already showed invasive cancer and local extent were unresolved, pelvic staging MRI would fit the next task.

  - Claims: claim.question-topic.anal-cancer.abnormal-cytology-hra, claim.question-topic.anal-cancer.normal-palpation. Timing: timing.test.biopsy.

- Repeat anal cytology and HPV testing (`choice.topic.anal-cancer.cytology-to-histology.swab`).

  - Rationale: Another swab does not resolve this high-grade screening result with histology.

  - Temptation: Use normal palpation to downgrade the abnormal screen.

  - Changed circumstance: Cytology can be used to screen an eligible asymptomatic person rather than replace evaluation of an already high-grade result.

  - Claims: claim.question-topic.anal-cancer.abnormal-cytology-hra, claim.question-topic.anal-cancer.normal-palpation. Timing: timing.test.pathology_review.

- Pelvic MRI with local-staging sequences (`choice.topic.anal-cancer.cytology-to-histology.mri`).

  - Rationale: The swab has not established invasive cancer; MRI does not replace lesion histology at this stage.

  - Temptation: Equate a high cytologic grade with a tissue diagnosis of invasive cancer.

  - Changed circumstance: Biopsy-established anal cancer requiring primary and pelvic-node assessment supports pelvic MRI.

  - Claims: claim.question-topic.anal-cancer.mri-local, claim.question-topic.anal-cancer.abnormal-cytology-hra. Timing: timing.test.mri.

Explanation: The swab and palpation answer different questions. Abnormal cytologic screening requires HRA-directed histologic assessment; a nonpalpable lesion can still be present.

#### After - exact new candidate

Patient: Daniel Mercer, 48, Male. Complaint: Anal screening review.

Presentation: Daniel Mercer, a 48-year-old man living with HIV, attends clinic to review anal-screening findings after outside anoscopy.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These are separate fields.

Question SHA-256 `cc6dd3e025d2991a3575d28351ac0c8d579c871cfeccfe75e306edbb9ea42b83`; node SHA-256 `76b96baa7f4b074a12fa36f327f618c15ad1dfd6e56cc2bf3b8f593bf438cb4f`.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Anal swab",
      "value": "High-grade squamous cytologic abnormalities and oncogenic HPV detected."
    },
    {
      "label": "Outside examination",
      "value": "Digital examination found no mass. Standard anoscopy was performed with white light; a pedunculated perianal wart was sampled."
    },
    {
      "label": "Submitted wart tissue",
      "value": "Low-grade squamous changes in perianal skin, without invasion in the represented tissue."
    }
  ]
}
```

Complete task: **Which diagnostic plan should the clinic arrange next for Daniel Mercer’s anal-screening findings?**

**key shown first for review only.**

- **KEY** High-resolution anoscopy with directed biopsies (`choice.topic.anal-cancer.cytology-to-histology.v2.hra`).

  - Rationale: The low-grade skin-wart specimen does not resolve high-grade cells in an anal swab. HRA more precisely delineates flat epithelial lesions that a normal palpation or standard white-light examination can miss.

  - Temptation: Match the represented specimen and examination acquisition to the question raised by the high-grade anal screen.

  - Changed circumstance: If high-grade cells were traced to a fully assessed represented lesion and the unresolved issue were its slide interpretation, targeted pathology review could be appropriate instead.

  - Claims: claim.question-topic.anal-cancer.abnormal-cytology-hra, claim.question-topic.anal-cancer.normal-palpation, claim.question-topic.anal-cancer.sampling-limits, claim.question-topic.anal-cancer.r2.hra-flat-lesions. Timing: timing.test.biopsy.

- Standard anoscopy with directed biopsies (`choice.topic.anal-cancer.cytology-to-histology.v2.standard`).

  - Rationale: Repeating white-light assessment does not provide HRA's more precise delineation of potential flat lesions behind the discordant high-grade screen.

  - Temptation: Treat a second standard examination as equivalent to the different acquisition needed after the first did not resolve the screen.

  - Changed circumstance: When HRA is unavailable, standard anoscopy with biopsy of identified lesions is a supported pathway, with its scope made explicit.

  - Claims: claim.question-topic.anal-cancer.abnormal-cytology-hra, claim.question-topic.anal-cancer.r2.hra-flat-lesions. Timing: timing.test.biopsy.

- Specialist review of the wart histology (`choice.topic.anal-cancer.cytology-to-histology.v2.slides`).

  - Rationale: Review can refine the submitted skin diagnosis but does not inspect the anal epithelium that produced the high-grade screening cells.

  - Temptation: Use the low-grade tissue result as if it represented every possible anal lesion.

  - Changed circumstance: A diagnostic uncertainty within a representative biopsy of the actual unresolved lesion can justify specialist slide review.

  - Claims: claim.question-topic.anal-cancer.sampling-limits, claim.question-topic.anal-cancer.abnormal-cytology-hra. Timing: timing.test.pathology_review.

Post-answer explanation: This high-grade anal cytology result remains unresolved by a low-grade perianal wart specimen and a standard examination. Arrange HRA-directed assessment; normal palpation does not establish that flat epithelial disease is absent.

Five manual checks, author judgment only:

1. **Cue attack:** Deleted the named missing-tissue sentence and staging-MRI foil. Two options now obtain directed biopsies, so tissue acquisition does not uniquely mark the key. The standard examination and actual skin specimen must be interpreted rather than simply matched to an omitted action.

2. **Stage/category:** Three diagnostic plans: a different visualization acquisition, repeat standard acquisition, and review of submitted tissue.

3. **Two consequential steps:** Distinguish the sampled perianal wart's low-grade histology from the unresolved high-grade anal screening result. Then Use the examination's white-light acquisition and normal palpation limits to choose HRA for potential flat lesions.

4. **Difficulty:** Fair moderate PGY-2/3 prediction from provenance plus acquisition scope. No unsupported screening cutoff or accepted basic-role label is used. Closest error: Accept the benign/low-grade submitted skin specimen and another standard anoscopy as a complete assessment of the high-grade anal result. Consequence: High-grade epithelial disease can remain unlocalized and unbiopsied despite a reassuring tissue result from another compartment.

5. **One best answer:** For this high-grade anal result, HRA addresses the unresolved compartment/acquisition; repeat standard examination and skin-slide review do not supply that scope. Decider: The submitted specimen is perianal wart tissue and the prior canal examination used standard white-light visualization. Counterfactual: If HRA were unavailable, standard anoscopy with biopsy of identified lesions becomes the supported offered pathway; that exception is not invented as a universal equivalent acquisition.

Deletion test:

- Without specimen location, the low-grade tissue could incorrectly be assumed to represent the high-grade source.
- Without acquisition details, standard anoscopy cannot be fairly compared with HRA.
- The high-grade result stays because this is not an algorithm for every abnormal screening combination.

Sequence: Standalone diagnostic case. The preserved HSIL treatment PASS is isolated, so neither this feedback nor later treatment feedback rehearses a companion's answer.

Repair/re-solve: Addressed both cue findings and narrowed feedback to this high-grade result. Added a supported standard-versus-high-resolution competitor rather than an already-completed swab or premature staging test.

### question.topic.anal-cancer.adverse-margin-histology.v2

Status **revised**, not independently passed. Before: `question.topic.anal-cancer.adverse-margin-histology.v1`. Current node `node.topic.anal-cancer.adverse-margin-histology.v2`; case `case.topic.anal-cancer.margin-initial.v2`; concept `concept.topic.anal-cancer.margin-initial-treatment.v2` (new_meaning). Previous concept `concept.topic.anal-cancer.margin-adjuvant-selection.v1`.

#### Before - exact reviewed version

Presentation: {patientName}, a 57-year-old woman, attends clinic after outside excision of a perianal skin lesion.

Complaint: Skin excision follow-up

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Operative map",
      "value": "The lesion was on hair-bearing perianal skin; anoscopy showed no mucosal extension. The excision did not enter sphincter muscle."
    },
    {
      "label": "Definitive specimen",
      "value": "1.6-cm invasive squamous carcinoma, poorly differentiated. No lymphovascular or perineural invasion reported. All margins are negative; nearest measured clearance is 12 mm."
    },
    {
      "label": "Regional and distant assessment",
      "value": "No suspicious groin or pelvic node; no distant metastasis identified."
    }
  ]
}
```

Task: What should be planned next for {patientName}’s excised anal-margin squamous cancer?

**key shown first for review only.**

- **KEY** Fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.adverse-margin-histology.crt`).

  - Rationale: Poor differentiation excludes this lesion from the selected excision pathway despite small size and generous negative clearance.

  - Temptation: Use differentiation as a treatment-selection feature rather than equating small size with favorable biology.

  - Changed circumstance: Change to well-differentiated histology with the same generous clearance and surveillance becomes appropriate.

  - Claims: claim.question-topic.anal-cancer.selected-margin-excision, claim.question-topic.anal-cancer.adverse-margin-histology, claim.question-topic.anal-cancer.crt-regimen. Timing: no_test therapeutic plan.

- Clinical and anoscopic surveillance (`choice.topic.anal-cancer.adverse-margin-histology.follow`).

  - Rationale: Negative margins do not remove the adverse differentiation that puts this lesion outside the selected excision pathway.

  - Temptation: Use margin negativity as the only postoperative eligibility criterion.

  - Changed circumstance: Well-differentiated histology with the same generous clearance supports surveillance.

  - Claims: claim.question-topic.anal-cancer.selected-margin-excision, claim.question-topic.anal-cancer.adverse-margin-histology. Timing: timing.test.clinical_procedure.

- Wider perianal re-excision (`choice.topic.anal-cancer.adverse-margin-histology.wider`).

  - Rationale: Clearance is already generous and negative. More local resection does not address the actual treatment boundary in this record.

  - Temptation: Treat the invasive label or adverse histology as an unsolved local-clearance problem.

  - Changed circumstance: Gross residual disease or an involved edge creates a new clearance issue. The precise re-excision-versus-adjuvant ranking is held for clinical adjudication, not taught here.

  - Claims: claim.question-topic.anal-cancer.selected-margin-excision, claim.question-topic.anal-cancer.margin-disagreement-held. Timing: no_test therapeutic plan.

Explanation: Small size and negative margins do not make poorly differentiated anal-margin SCC a favorable excision case. Offer multidisciplinary chemoradiation planning rather than another clearance operation or surveillance.

#### After - exact new candidate

Patient: Renee Carter, 57, Female. Complaint: Perianal lesion.

Presentation: Renee Carter, a 57-year-old woman, attends clinic after incisional biopsy of a perianal skin lesion.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These are separate fields.

Question SHA-256 `06d76758c2c55a9dedf1773da6b09b7bb0ce85bd62b28dcda77c4a8c168ed6e2`; node SHA-256 `a65de5228f283ca2b1a0ad84f078fc399cdae763d2ad72c66e48efa9fbc074af`.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Examination",
      "value": "A 1.6-cm lesion is confined to hair-bearing perianal skin. Anoscopy shows no mucosal extension."
    },
    {
      "label": "Incisional biopsy",
      "value": "Poorly differentiated invasive squamous carcinoma. The lesion remains in place after sampling."
    },
    {
      "label": "Pelvic MRI",
      "value": "No sphincter or adjacent-organ involvement; no suspicious regional node."
    },
    {
      "label": "CT chest and abdomen",
      "value": "No distant lesion identified."
    }
  ]
}
```

Complete task: **Which initial definitive treatment should be offered to Renee Carter for the perianal squamous cancer?**

**key shown first for review only.**

- **KEY** Definitive fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.adverse-margin-histology.v2.crt`).

  - Rationale: Poor differentiation excludes this still-present perianal SCC from the selected favorable local-excision group despite small size and skin location. A definitive chemoradiation pathway addresses the initial-treatment setting.

  - Temptation: Use differentiation as a selection feature rather than equating small skin-based disease with a favorable excision candidate.

  - Changed circumstance: A small well-differentiated node-negative skin-margin lesion amenable to negative-margin excision can instead be considered for local excision.

  - Claims: claim.question-topic.anal-cancer.adverse-margin-histology, claim.question-topic.anal-cancer.r2.perianal-crt-initial, claim.question-topic.anal-cancer.crt-regimen. Timing: no_test therapeutic plan.

- Wide local excision of the perianal lesion (`choice.topic.anal-cancer.adverse-margin-histology.v2.local`).

  - Rationale: Small size, skin location and absent nodes make this tempting, but poor differentiation defeats the favorable local-excision selection in this scenario.

  - Temptation: Apply favorable-site and size observations while ignoring adverse histology.

  - Changed circumstance: With well-differentiated histology and otherwise suitable small node-negative skin-based disease, local excision is a supported option.

  - Claims: claim.question-topic.anal-cancer.selected-margin-excision, claim.question-topic.anal-cancer.adverse-margin-histology. Timing: no_test therapeutic plan.

- Abdominoperineal resection with colostomy (`choice.topic.anal-cancer.adverse-margin-histology.v2.apr`).

  - Rationale: An adverse differentiation result is not itself a reason for primary APR of this nonmetastatic skin-margin tumor. Radical resection has a different role in appropriate local failure after treatment.

  - Temptation: Escalate an adverse histologic feature directly to radical surgery instead of selecting the supported initial oncologic pathway.

  - Changed circumstance: Confirmed resectable isolated anal-canal recurrence after definitive chemoradiation can support salvage APR.

  - Claims: claim.question-topic.anal-cancer.r2.perianal-crt-initial, claim.question-topic.anal-cancer.salvage-apr. Timing: no_test therapeutic plan.

Post-answer explanation: Poor differentiation excludes this small skin-margin tumor from the favorable local-excision pathway. With the lesion still present after incisional biopsy, plan definitive chemoradiation rather than treating size and site as sufficient for excision.

Five manual checks, author judgment only:

1. **Cue attack:** Removed the already-excised 12-mm-clearance setting. The task explicitly fixes the initial definitive-treatment phase, while the biopsy gives poor grade without announcing its management consequence. Each option is a specific cancer treatment.

2. **Stage/category:** Three initial definitive treatment plans. No postoperative observation or re-clearance option is mixed into an upfront treatment question.

3. **Two consequential steps:** Recognize that small skin-based node-negative disease looks favorable except for poor differentiation. Then Apply the adverse-grade exclusion to select definitive chemoradiation rather than local excision or automatic radical surgery.

4. **Difficulty:** Fair moderate PGY-2/3 prediction with a credible local-excision competitor. Uncertainty about postoperative treatment is excluded rather than relabeled as difficulty. Closest error: Choose local excision from site and size while ignoring differentiation. Consequence: Initial treatment may follow a favorable-lesion exception that the actual histology does not satisfy.

5. **One best answer:** Current society exclusion of poorly differentiated tumors from selected excision and the locoregional CRT pathway support the key in this initial setting. Decider: Poorly differentiated invasive SCC in a lesion still present after incisional sampling. Counterfactual: Change poor to well differentiation with the small skin-based node-negative presentation otherwise retained: wide local excision becomes a supported offered option.

Deletion test:

- Without incisional sampling and retained lesion, treatment phase becomes ambiguous again.
- Without grade the main local-excision competitor may be appropriate.
- Site, extent and nodal assessment preserve a fair initial-treatment comparison.

Sequence: Standalone new clinical meaning. The exact favorable postoperative PASS is preserved separately; its answer is not earlier feedback for this case.

Repair/re-solve: Did not assert an unsupported postoperative CRT ranking. Changed to the reviewer's suggested initial-treatment setting, assigned an explicit new concept version and kept the original adjuvant question archived/unadmitted.

### question.topic.anal-cancer.salvage-local-failure.v2

Status **revised**, not independently passed. Before: `question.topic.anal-cancer.salvage-local-failure.v1`. Current node `node.topic.anal-cancer.salvage-local-failure.v2`; case `case.topic.anal-cancer.salvage-standalone.v2`; concept `concept.topic.anal-cancer.salvage-apr.v1` (reuse). Previous concept `concept.anal-scc.localized-chemoradiation-referral`.

#### Before - exact reviewed version

Presentation: {patientName}, a 64-year-old woman, comes to clinic to review a new anal finding 18 months after definitive anal-cancer chemoradiation.

Complaint: Recurrent anal bleeding

Earlier visible feedback: Change from a flat scar to a firm bleeding nodule matters, but it is not itself tissue proof of recurrence. Obtain histology before selecting radical salvage treatment.

Current update: {patientName} remains independent in daily activities at her clinic follow-up.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Current biopsy",
      "value": "Invasive squamous carcinoma matching the original anal primary."
    },
    {
      "label": "Prior treatment",
      "value": "Completed definitive pelvic chemoradiation followed by a documented complete response."
    },
    {
      "label": "Current MRI",
      "value": "Tumor occupies the canal and sphincter complex. Pelvic sidewall planes are preserved; no adjacent-organ or nodal lesion described."
    },
    {
      "label": "CT chest, abdomen and pelvis",
      "value": "No distant metastatic lesion identified."
    }
  ]
}
```

Task: Which cancer-treatment plan should now be recommended for {patientName}’s confirmed local failure?

**key shown first for review only.**

- **KEY** Salvage abdominoperineal resection (`choice.topic.anal-cancer.salvage-local-failure.apr`).

  - Rationale: This is confirmed isolated local failure in a previously irradiated primary with an anatomic basis for complete resection. APR is the standard salvage operative pathway.

  - Temptation: Use tissue, previous treatment and current distribution together.

  - Changed circumstance: Disseminated distant metastases would make systemic treatment the main pathway.

  - Claims: claim.question-topic.anal-cancer.salvage-apr. Timing: no_test therapeutic plan.

- Repeat definitive fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.salvage-local-failure.crt`).

  - Rationale: That repeats the primary full definitive pathway after local failure. Selected reirradiation requires specialist planning and is not automatic repetition of initial treatment.

  - Temptation: Apply the initial treatment rule again without incorporating prior radiation and local failure.

  - Changed circumstance: An untreated nonmetastatic canal primary fits initial concurrent chemoradiation.

  - Claims: claim.question-topic.anal-cancer.nonmetastatic-crt, claim.question-topic.anal-cancer.crt-regimen, claim.question-topic.anal-cancer.salvage-apr. Timing: no_test therapeutic plan.

- Retifanlimab with carboplatin and paclitaxel (`choice.topic.anal-cancer.salvage-local-failure.systemic`).

  - Rationale: This systemic option addresses inoperable recurrent or metastatic disease. The confined failure has a standard potentially curative local salvage pathway.

  - Temptation: Read recurrent as synonymous with inoperable or metastatic.

  - Changed circumstance: Inoperable pelvic recurrence or disseminated metastases supports systemic oncology planning.

  - Claims: claim.question-topic.anal-cancer.salvage-apr, claim.question-topic.anal-cancer.first-line-retifanlimab. Timing: no_test therapeutic plan.

Explanation: This is a salvage decision after tissue-confirmed local failure. With no distant disease and preserved resection planes, recommend multidisciplinary salvage APR planning.

#### After - exact new candidate

Patient: Maria Bennett, 64, Female. Complaint: Recurrent anal bleeding.

Presentation: Maria Bennett, a 64-year-old woman, comes to clinic to review a new anal finding 18 months after definitive anal-cancer chemoradiation.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These are separate fields.

Question SHA-256 `15ddd795e0a87b86cf428b19574cf798c0a81a3b23a5c5e3f0acc8ff19ae1fc7`; node SHA-256 `82b65bb52d0e94858e0cb03e28de54d124102bb9a3b2881ed4f2e67e965581de`.

Current update: Maria remains independent in daily activities at her clinic follow-up.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Current biopsy",
      "value": "Invasive squamous carcinoma matching the original anal primary."
    },
    {
      "label": "Prior treatment",
      "value": "Completed definitive pelvic chemoradiation followed by a documented complete response."
    },
    {
      "label": "Current MRI",
      "value": "Tumor occupies the canal and sphincter complex. Pelvic sidewall planes are preserved; no adjacent-organ or nodal lesion described."
    },
    {
      "label": "CT chest, abdomen and pelvis",
      "value": "No distant metastatic lesion identified."
    }
  ]
}
```

Complete task: **Which cancer-treatment plan should be recommended for Maria Bennett’s anal-canal cancer?**

**key shown first for review only.**

- **KEY** Salvage abdominoperineal resection (`choice.topic.anal-cancer.salvage-local-failure.v2.apr`).

  - Rationale: This is confirmed isolated local failure in a previously irradiated primary with an anatomic basis for complete resection. APR is the standard salvage operative pathway.

  - Temptation: Use tissue, previous treatment and current distribution together.

  - Changed circumstance: Disseminated distant metastases would make systemic treatment the main pathway.

  - Claims: claim.question-topic.anal-cancer.salvage-apr. Timing: no_test therapeutic plan.

- Repeat definitive fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.salvage-local-failure.v2.crt`).

  - Rationale: That repeats the primary full definitive pathway after local failure. Selected reirradiation requires specialist planning and is not automatic repetition of initial treatment.

  - Temptation: Apply the initial treatment rule again without incorporating prior radiation and local failure.

  - Changed circumstance: An untreated nonmetastatic canal primary fits initial concurrent chemoradiation.

  - Claims: claim.question-topic.anal-cancer.nonmetastatic-crt, claim.question-topic.anal-cancer.crt-regimen, claim.question-topic.anal-cancer.salvage-apr. Timing: no_test therapeutic plan.

- Retifanlimab with carboplatin and paclitaxel (`choice.topic.anal-cancer.salvage-local-failure.v2.systemic`).

  - Rationale: This systemic option addresses inoperable recurrent or metastatic disease. The confined failure has a standard potentially curative local salvage pathway.

  - Temptation: Read recurrent as synonymous with inoperable or metastatic.

  - Changed circumstance: Inoperable pelvic recurrence or disseminated metastases supports systemic oncology planning.

  - Claims: claim.question-topic.anal-cancer.salvage-apr, claim.question-topic.anal-cancer.first-line-retifanlimab. Timing: no_test therapeutic plan.

Post-answer explanation: This is a salvage decision after tissue-confirmed local failure. With no distant disease and preserved resection planes, recommend multidisciplinary salvage APR planning.

Five manual checks, author judgment only:

1. **Cue attack:** Removed confirmed local failure from the lead-in and removed the preceding confirmation question from this composition. No earlier explanation announces radical salvage. The resident must interpret the biopsy, old treatment and current distribution.

2. **Stage/category:** Three specific cancer-treatment plans after current biopsy and restaging; no diagnostic-information key competes with treatments.

3. **Two consequential steps:** Use biopsy-matched tumor, prior definitive radiation and current negative distant staging to infer isolated local failure. Then Use the preserved planes and local extent to select a salvage resection pathway instead of repeating initial therapy or assuming metastatic intent.

4. **Difficulty:** Fair moderate PGY-2/3 prediction, matching the independent review's assessment when the preceding radical-salvage scaffold is absent. Closest error: Treat recurrence as automatically metastatic/inoperable, or repeat the initial full definitive regimen without incorporating prior radiation. Consequence: The plan can abandon potentially curative local salvage or repeat a failed initial-treatment pathway.

5. **One best answer:** The supplied tissue, prior therapy and resection/distribution context support multidisciplinary salvage APR planning among the offered plans. Decider: Viable canal tumor after a prior complete response, preserved sidewall planes and no distant lesion. Counterfactual: Replace the negative distant study with disseminated biopsy-confirmed visceral metastases: the offered systemic regimen becomes the main pathway.

Deletion test:

- Without old definitive radiation, the initial CRT option can become appropriate.
- Without current biopsy the lesion is not confirmed viable disease.
- Without distant restaging and preserved planes, the local salvage versus systemic comparison is underspecified.

Sequence: Standalone current case. The returned confirmation node is parked and supplies no preceding feedback, while the current exhibit explicitly supplies all prerequisite histology and restaging.

Repair/re-solve: Addressed both sequence and task cues, preserving the clinically necessary findings and the original supported treatment meaning. The earlier diagnostic explanation was rewritten neutrally in its parked attempt; it is not executed before this node.

## Parked after one revision attempt

### question.topic.anal-cancer.new-nodule-after-hsil.v1 - parked

```json
{
  "presentation": "Daniel Mercer, a 48-year-old man with treated anal HSIL, attends clinic six months later with focal pain.",
  "observations": [
    "Indurated ulcerated canal nodule",
    "Negative screening cytology"
  ],
  "task": "Which tissue-assessment approach should be arranged for Daniel Mercer’s anal finding?",
  "options": [
    "Office HRA-directed biopsy",
    "Anoscopy-guided incisional biopsy",
    "Ultrasound-guided core biopsy"
  ],
  "feedback": "Current lesion histology, rather than the screening swab, must explain the clinical finding."
}
```

Issue response: Removed repeated new-finding sentences and the repeated biopsy/swab/MRI answer set. A once-attempted tissue-route comparison has no supported patient-specific observation ranking these potentially adequate methods. Adding an invented route restriction would replace easy recognition with unfair ambiguity.

Reason: The fair retained principle is a straightforward diagnostic safety rule already represented by the revised biopsy item. No accepted basic role exists; no executable key is emitted for this unsupported route contest.

Next action: Manager may retain unscored follow-up teaching or commission a specifically sourced route/target case. Do not admit this archived question as a fresh moderate scored companion.

No current question ID and no key are emitted. Claims supporting the limited clinical principle: claim.question-topic.anal-cancer.new-lesion-after-hsil, claim.question-topic.anal-cancer.representative-tissue, claim.question-topic.anal-cancer.sampling-limits.

### question.topic.anal-cancer.confirm-local-recurrence.v1 - parked

```json
{
  "presentation": "Maria Bennett, a 64-year-old woman, attends clinic with a scar-site nodule after prior anal-cancer chemoradiation.",
  "observations": [
    "Previously flat scar is now nodular and bleeds",
    "Current local imaging is indeterminate"
  ],
  "task": "Which diagnostic approach should be arranged for Maria Bennett’s scar-site finding?",
  "options": [
    "Anoscopy-guided incisional biopsy",
    "Image-guided core biopsy",
    "Specialist review of prior biopsy material"
  ],
  "feedback": "Obtain current histology to distinguish viable tumor from treatment-related change."
}
```

Issue response: Removed the completed diffusion-MRI repeat foil and all radical-salvage wording from the attempted feedback. The proposed tissue-method alternatives need an actual supported depth/access observation to rank them; prior material cannot diagnose the acquired nodule, leaving either two adequate routes or a weak foil.

Reason: Cannot establish a distinct harder unambiguous diagnostic key from the supported facts after one revision attempt. Keep the confirmation principle as background; the new standalone salvage item receives current biopsy/restaging as prerequisites.

Next action: No scored confirmation companion. A future diagnostic-route item requires a sourced target/access problem and a fresh independent review.

No current question ID and no key are emitted. Claims supporting the limited clinical principle: claim.question-topic.anal-cancer.recurrence-histology, claim.question-topic.anal-cancer.representative-tissue, claim.question-topic.anal-cancer.sampling-limits.

## Clinical meaning, evidence and remaining holds

```json
{
  "question": "question.topic.anal-cancer.adverse-margin-histology.v2",
  "previousQuestion": "question.topic.anal-cancer.adverse-margin-histology.v1",
  "newConcept": "concept.topic.anal-cancer.margin-initial-treatment.v2",
  "previousConcept": "concept.topic.anal-cancer.margin-adjuvant-selection.v1",
  "reason": "Postoperative adjuvant treatment after wide excision is materially different from initial treatment of a still-present adverse-grade lesion. No prior FSRS history is moved."
}
```

The postoperative adverse-grade question is not repaired by calling its key adjuvant. The new item changes to initial treatment with the lesion still present; the old postoperative ranking remains explicitly withheld. No FSRS history transfers to the new initial-treatment construct.

```json
[
  {
    "id": "hold.topic.anal-cancer.early-response-eight-weeks",
    "inheritedHoldId": "review.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "status": "unkeyed_owner_decision_preserved",
    "beforeVariantId": "question.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "originalDecisionVariantSha256": "173e96c9fbc033644703e829dbf8bf134a3ab1757ebf829dfe6c8bf39bdd4f51",
    "recordFile": "docs/research/question-new-n3-round4-20261110.json",
    "constructedClinicFrame": "Patrick Rowan, a 61-year-old man, attends clinic for review of outside response examinations after anal-cancer chemoradiation.",
    "chiefComplaint": "Treatment response review",
    "observations": [
      "Eight weeks after COMPLETION of chemoradiation, serial examinations show continued lesion shrinkage.",
      "A small ulcer remains; no enlarging mass, new node or worsening symptoms."
    ],
    "competingActions": [
      "Repeat clinical response assessment",
      "Anoscopy-guided biopsy now",
      "Salvage abdominoperineal resection"
    ],
    "isCorrect": null,
    "questionVariantId": null,
    "evidenceClaimIds": [
      "claim.question-topic.anal-cancer.response-clock-held",
      "claim.question-topic.anal-cancer.progression-biopsy-held"
    ],
    "reason": "Fresh research does not resolve an explicit owner hold. The 26-week evidence clock starts at INITIATION; the held vignette uses completion. No scored key is emitted.",
    "nextAction": "Melissa endorses the exact response/biopsy/APR boundary and its clock; manager then authorizes a keyed version and independent review."
  },
  {
    "id": "hold.topic.anal-cancer.close-margin-management",
    "status": "unkeyed_new_evidence_disagreement",
    "questionVariantId": null,
    "isCorrect": null,
    "constructedClinicFrame": "Named adult patient in clinic after excision of a small perianal SCC; no scored draft is emitted.",
    "competingActions": [
      "Re-excision",
      "Adjuvant chemoradiation",
      "Surveillance"
    ],
    "evidenceClaimIds": [
      "claim.question-topic.anal-cancer.margin-disagreement-held"
    ],
    "reason": "Clearance definitions and close-margin management differ across society guidance. The keyed margin siblings instead use 12-mm observed clearance.",
    "nextAction": "Melissa selects a jurisdiction-specific guideline and exact clearance/re-excision boundary before a draft is keyed."
  },
  {
    "id": "hold.topic.anal-cancer.postoperative-poor-grade",
    "status": "unkeyed_clinical_ranking",
    "questionVariantId": null,
    "isCorrect": null,
    "archivedQuestionVariantId": "question.topic.anal-cancer.adverse-margin-histology.v1",
    "competingActions": [
      "Postoperative chemoradiation",
      "Surveillance after complete excision"
    ],
    "reason": "Independent review could not certify this exact postoperative ranking from an initial-excision exclusion. The new v2 changes care phase and does not resolve this held scenario.",
    "nextAction": "Melissa must adjudicate exact postoperative evidence before this scenario is keyed again."
  }
]
```

## Owner approvals needed

### review-response.exact-clinical-signoff

Review the five new exact v2 versions, especially specimen layers, HRA acquisition scope and initial poor-grade perianal treatment. Clinical sign-off remains pending for preserved PASS items as well.

Affected identities: question.topic.anal-cancer.sample-provenance.v2, question.topic.anal-cancer.local-staging-record.v2, question.topic.anal-cancer.cytology-to-histology.v2, question.topic.anal-cancer.adverse-margin-histology.v2, question.topic.anal-cancer.salvage-local-failure.v2. Boundary: Independent editorial PASS is not named clinical approval.

### review-response.preserved-holds

The early eight-week response clock, close/positive-margin management and postoperative poor-grade ranking remain unresolved; none is keyed in the current response.

Affected identities: hold.topic.anal-cancer.early-response-eight-weeks, hold.topic.anal-cancer.close-margin-management, hold.topic.anal-cancer.postoperative-poor-grade. Boundary: No worker research or initial-treatment scenario change resolves these exact held clinical questions.

Existing exact clinical approvals in the initial inventory remain unchanged. The five reviewed PASS versions in this batch are editorial passes, not clinical approvals.

## Research, source rights and exact mappings

Full source records and all source-to-claim-to-question mappings: [source ledger](sources-question-topic-anal-cancer-20261111.json). Current field mappings are JSON `reviewRound.current.statementMappings`; archived mappings remain intact. Original access dates are retained. Two source records and four atomic claims were added for this response.

### source.question-topic.anal-cancer.durot-mri-2017

[Cancer of the Anal Canal: Diagnosis, Staging and Follow-Up with MRI](https://www.kjronline.org/DOIx.php?id=10.3348/kjr.2017.18.6.946). Durot C, Dohan A, Boudiaf M, Servois V, Soyer P, Hoeffel C. Cancer of the Anal Canal: Diagnosis, Staging and Follow-Up with MRI. Korean J Radiol. 2017;18(6):946-956. doi:10.3348/kjr.2017.18.6.946. Published online September 21, 2017. Accessed November 11, 2026.

Medical authority: Peer-reviewed specialist imaging review supports the technical field-of-view and stenosis limits of endoanal ultrasound. Current local-staging preference is separately cross-checked against SEOM 2026.

Rights: CC BY-NC 4.0; independently synthesized underlying facts only. No adapted image, source text, table or algorithm is distributed. Commercial incorporation of licensed expression is not authorized; only original factual synthesis and attribution are used.

Limitation: Older imaging review. No diagnostic-performance percentage, stage threshold, imaging protocol dimension, figure or then-emerging diffusion claim is reproduced.

### source.question-topic.anal-cancer.nci-diagnosis-2025

[Anal Cancer Diagnosis & Prognosis](https://www.cancer.gov/types/anal/diagnosis-prognosis). National Cancer Institute. Anal Cancer Diagnosis & Prognosis. Updated May 16, 2025. Accessed November 11, 2026.

Medical authority: Government diagnostic overview supports direct lesion tissue sampling and defines endoanal ultrasound acquisition; not a granular biopsy technique or anesthesia guideline.

Rights: U.S. government text; NCI reuse policy applies. Independent factual synthesis and source link only; no source wording, photograph, graphic or full text stored.

Limitation: Does not establish a universal biopsy depth, timing, anesthesia rule or hierarchy among equally adequate sampling techniques.

| New atomic claim | Independently written statement | Sources | Limitation |
|---|---|---|---|

| claim.question-topic.anal-cancer.r2.epithelial-sample-limits | An epithelial-only specimen cannot establish absence of invasion in unsampled underlying lesion tissue. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.nci-diagnosis-2025 | Application of representative-lesion biopsy and specimen logic, not a quantified sensitivity/depth rule. The biopsy and block inventory in the draft are constructed observations. |

| claim.question-topic.anal-cancer.r2.eus-stenosis-limit | Endoanal ultrasound is limited by a stenotic canal and has less regional anatomic coverage than pelvic MRI. | source.question-topic.anal-cancer.durot-mri-2017 | One adequate specialist imaging review directly supports the ultrasound limitation; current SEOM independently supports pelvic MRI for local extent. No exact canal diameter or tumor-size cutoff is asserted. |

| claim.question-topic.anal-cancer.r2.hra-flat-lesions | HRA delineates flat anal epithelial lesions more precisely than standard anoscopy. | source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026 | Current federal guideline explicitly distinguishes these acquisitions. This is not a universal algorithm for every cytology/HPV combination. |

| claim.question-topic.anal-cancer.r2.perianal-crt-initial | Locoregional perianal SCC outside the selected favorable local-excision group is treated with a chemoradiation pathway. | source.question-topic.anal-cancer.nci-pdq-2025; source.question-topic.anal-cancer.seom-2026 | Applied to initial treatment of a still-present poorly differentiated lesion. Does not infer a postoperative adjuvant recommendation after wide complete excision. |

ASCRS official PDF returned 404, toolkit access had moved, and the ESMO-hosted mirror timed out; no claim relies on their snippets. No proprietary corpus, source excerpt, full article, protected image/table/algorithm or new gameplay network call was introduced.

- All five original PASS predictions are moderate, not hard.
- Current systemic-regimen detail remains supplemental contemporary oncology coverage, not a verified commonly tested core board concept.
- Two diagnostic safety rules are archived/parked after a single attempted revision, rather than inflated into hard scored content.
- Five v2 revisions are fair-moderate author predictions requiring independent review.

## Timing, order and integration proposals

Ten current exact timing tuples contain eleven diagnostic-choice estimates using existing placeholder profiles, including wrong options. All order proposals remain `not_executed / future_planned`; no service request or result gate is created. The two PASS splits have new case tuples with the same reviewed classifications and choice labels. Legacy timing records remain untouched.

| Question | Choice | Exact label | Profile |
|---|---|---|---|

| question.topic.anal-cancer.treat-intraepithelial-lesion.v1 | choice.topic.anal-cancer.treat-intraepithelial-lesion.monitor | Active monitoring with repeat HRA | timing.test.clinical_procedure |

| question.topic.anal-cancer.clear-margin-observation.v1 | choice.topic.anal-cancer.clear-margin-observation.follow | Clinical and anoscopic surveillance | timing.test.clinical_procedure |

| question.topic.anal-cancer.sample-provenance.v2 | choice.topic.anal-cancer.sample-provenance.v2.incision | Anoscopy-guided incisional biopsy | timing.test.biopsy |

| question.topic.anal-cancer.sample-provenance.v2 | choice.topic.anal-cancer.sample-provenance.v2.levels | Specialist review with additional block sections | timing.test.pathology_review |

| question.topic.anal-cancer.sample-provenance.v2 | choice.topic.anal-cancer.sample-provenance.v2.swab | Repeat anal cytology with HPV testing | timing.test.pathology_review |

| question.topic.anal-cancer.local-staging-record.v2 | choice.topic.anal-cancer.local-staging-record.v2.mri | Pelvic MRI | timing.test.mri |

| question.topic.anal-cancer.local-staging-record.v2 | choice.topic.anal-cancer.local-staging-record.v2.eus | Endoanal ultrasonography | timing.test.advanced_diagnostic |

| question.topic.anal-cancer.local-staging-record.v2 | choice.topic.anal-cancer.local-staging-record.v2.pet | FDG PET/CT | timing.test.pet_ct |

| question.topic.anal-cancer.cytology-to-histology.v2 | choice.topic.anal-cancer.cytology-to-histology.v2.hra | High-resolution anoscopy with directed biopsies | timing.test.biopsy |

| question.topic.anal-cancer.cytology-to-histology.v2 | choice.topic.anal-cancer.cytology-to-histology.v2.standard | Standard anoscopy with directed biopsies | timing.test.biopsy |

| question.topic.anal-cancer.cytology-to-histology.v2 | choice.topic.anal-cancer.cytology-to-histology.v2.slides | Specialist review of the wart histology | timing.test.pathology_review |

All external source links preserve `_blank`, `noopener noreferrer`, and `no-referrer`.

- Use CURRENT_ARTIFACTS for this response. All original v1 arrays, snapshots and history stay exact.
- Do not admit five revised v2 items on the strength of author checks or tests.
- Check the two standalone PASS compositions; only HSIL final routing changes, with reviewed rationale text reused and no outcome claim.
- New initial-treatment concept is distinct from the retained postoperative concept.
- Import exact current timing/order tuples after acceptance; retain old case/choice timing records for frozen encounters.
- No multi-part current case is exposed until every scored companion has applicable independent PASS and full-sequence review.

## Focused validation - complete current output

Focused file: **21 passed / 0 failed**, exit 0, 3.94s. Two JSON files parse. Package typecheck exits 1 because `question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts:997:48` supplies `string | undefined` where `clinicalRationale` requires `string`. No diagnostic names this topic. That concurrent lane is unchanged.

### npm.cmd test -- --pool=threads src/question-topic-anal-cancer-20261111.test.ts - exit 0

Working directory: `packages/clinical-content`.

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-anal-cancer-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  19:00:42
   Duration  3.94s (transform 2.71s, setup 0ms, import 3.71s, tests 58ms, environment 0ms)
```

### npm.cmd run typecheck - exit 1

Working directory: `packages/clinical-content`.

```text
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts(997,48): error TS2322: Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }[]' is not assignable to type '({ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; })[]'.
  Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; }'.
    Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; }'.
      Types of property 'clinicalRationale' are incompatible.
        Type 'string | undefined' is not assignable to type 'string'.
          Type 'undefined' is not assignable to type 'string'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

### node -e "for (const f of ['docs/research/question-topic-anal-cancer-20261111.json','docs/research/sources-question-topic-anal-cancer-20261111.json']) {JSON.parse(require('fs').readFileSync(f,'utf8')); console.log('JSON.parse PASS '+f);}" - exit 0

Working directory: `repository root`.

```text
JSON.parse PASS docs/research/question-topic-anal-cancer-20261111.json
JSON.parse PASS docs/research/sources-question-topic-anal-cancer-20261111.json
```

Tests verify structure, exact preservation, version/claim/timing mappings and composition. No new independent PASS or clinical approval is inferred.

Only the requested focused file and clinical-content typecheck; no broad suite, browser, install, commit, push, shared-file repair or deployment.

## Final bounded response handoff

Counts: **5 pass-preserved / 5 revised / 2 parked**, covering all twelve reviewed items. Ten current standalone clinic cases, zero mixed multi-part cases. Five v2 versions and two changed standalone compositions need independent/manager recheck; all current clinical records remain `needs_clinician_review`.

Manager next action: Manager re-reviews five exact v2 questions and the two standalone PASS compositions, coordinates the out-of-lane typecheck fix, and decides exact admission. Preserve all three unresolved clinical holds.

Only the original five owned files changed. This checkpoint remains local and uncommitted; manager owns any later GitHub backup, integration and owner reminder.

---

# Archived initial program packet

Everything below is the original fourteen-variant topic audit and first twelve-node proposal packet. Its counts, validation runs and mixed v1 compositions are historical; use the current response section and `reviewRound` JSON for this dispatch.

# Anal cancer topic program ? wave 8

Authoring version `question-topic.anal-cancer.2026-11-11.v1`. All new/revised questions, concepts, claims, presentations and finite profiles remain **needs_clinician_review**. Melissa Rowland is the named clinical sign-off. This is a local explicit-import sidecar; no manifest admission, independent PASS, clinical approval, commit, push or publication occurred.

## Assignment ? self-filled from the manager program

The following complete primary-topic records come from `docs/research/question-topic-program-20261111.json`. The empty hold/reuse/freeze arrays are intentional. The historical N3 case/node reuse is also explained below. The worker owns exactly these five files:

- `packages/clinical-content/src/question-topic-anal-cancer-20261111.ts`
- `packages/clinical-content/src/question-topic-anal-cancer-20261111.test.ts`
- `docs/research/question-topic-anal-cancer-20261111.json`
- `docs/research/question-topic-anal-cancer-20261111.md`
- `docs/research/sources-question-topic-anal-cancer-20261111.json`

### taxonomy

```json
{
  "slug": "anal-cancer",
  "title": "Anorectal — anal HSIL and cancer",
  "priority": "medium",
  "scopeIn": "Anal HSIL/HPV, anal-canal and margin neoplasia, tissue diagnosis, local/distant staging, chemoradiation response and salvage decisions.",
  "scopeOut": "Rectal adenocarcinoma belongs to colorectal-polyps-cancer. Benign fistula and fissure belong to anorectal-benign-pelvic-floor.",
  "priorityReason": "A distinct disease pathway prevents mixing anal and rectal staging or treatment.",
  "researchAgenda": [
    "Canal versus margin treatment implications",
    "Response trajectory versus salvage surgery",
    "HPV-related precursor and surveillance concepts"
  ],
  "counts": {
    "liveConcepts": 3,
    "liveNodes": 12,
    "liveCases": 8,
    "liveVariants": 12,
    "liveAcceptedNodes": 0,
    "liveOriginalNodes": 12,
    "registeredConcepts": 3,
    "registeredWithoutLiveNodes": 0,
    "drafts": 2,
    "draftVariants": 2,
    "draftConcepts": 2,
    "explicitOwnerHeldVersions": 1,
    "unassembledDraftVariants": 0,
    "unkeyedParkedSlots": 0,
    "withheldTeachingPoints": 0,
    "liveClinicalConcepts": 3
  },
  "coverageSignal": "thin",
  "coverageReason": "At most four distinct live clinical concept identities cover this scope. Variants repeat those identities.",
  "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
  "workerLane": [
    "packages/clinical-content/src/question-topic-anal-cancer-20261111.ts",
    "packages/clinical-content/src/question-topic-anal-cancer-20261111.test.ts",
    "docs/research/question-topic-anal-cancer-20261111.json",
    "docs/research/question-topic-anal-cancer-20261111.md",
    "docs/research/sources-question-topic-anal-cancer-20261111.json"
  ],
  "wave": 8
}
```

### programId

```json
"question-topic-program.2026-11-11.v1"
```

### snapshotCapturedAt

```json
"2026-11-11T15:28:05.732Z"
```

### release

```json
{
  "id": "clinical.synthetic.prototype.v1",
  "manifestId": "question-ship.2026-11-10.v9",
  "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
  "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
  "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
  "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
}
```

### startingCounts

```json
{
  "liveConcepts": 3,
  "liveNodes": 12,
  "liveCases": 8,
  "liveVariants": 12,
  "liveAcceptedNodes": 0,
  "liveOriginalNodes": 12,
  "registeredConcepts": 3,
  "registeredWithoutLiveNodes": 0,
  "drafts": 2,
  "draftVariants": 2,
  "draftConcepts": 2,
  "explicitOwnerHeldVersions": 1,
  "unassembledDraftVariants": 0,
  "unkeyedParkedSlots": 0,
  "withheldTeachingPoints": 0,
  "liveClinicalConcepts": 3
}
```

### inventory

```json
[
  {
    "recordId": "inventory.92e73cef590dfe9c",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-hsil.high-risk-hpv-association",
    "caseId": "case.anal-hsil.hpv.3a",
    "nodeIds": [
      "node.anal-hsil.hpv.3a"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3a.v1"
    ],
    "chiefComplaint": "Anal pathology follow-up",
    "taskTextShort": "Which viral category is etiologically associated with this lesion?",
    "taskText": "Which viral category is etiologically associated with this lesion?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "clinically_approved"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
      "line": 59,
      "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 57,
        "export": "EARLY_GAME_CLINIC_BATCH_CASES",
        "locator": "exact identity literal"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.anal-hsil.hrhpv-association"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-hsil.hpv.3a",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.3b8d4e6bd04f7c88",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-hsil.high-risk-hpv-association",
    "caseId": "case.anal-hsil.hpv.3b",
    "nodeIds": [
      "node.anal-hsil.hpv.3b"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3b.v1"
    ],
    "chiefComplaint": "Anal pathology follow-up",
    "taskTextShort": "Which virus is etiologically linked to this dysplastic lesion?",
    "taskText": "Which virus is etiologically linked to this dysplastic lesion?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "clinically_approved"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
      "line": 59,
      "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 60,
        "export": "EARLY_GAME_CLINIC_BATCH_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 2,
    "sourceEvidenceClaimIds": [
      "claim.anal-hsil.hrhpv-association"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-hsil.hpv.3b",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.4f5fe86dd4bbf309",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-hsil.high-risk-hpv-association",
    "caseId": "case.anal-hsil.hpv.3c",
    "nodeIds": [
      "node.anal-hsil.hpv.3c"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3c.v1"
    ],
    "chiefComplaint": "Anal pathology follow-up",
    "taskTextShort": "Which viral category is directly associated with the dysplastic lesion?",
    "taskText": "Which viral category is directly associated with the dysplastic lesion?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "clinically_approved"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
      "line": 59,
      "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 57,
        "export": "EARLY_GAME_CLINIC_BATCH_CASES",
        "locator": "exact identity literal"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.anal-hsil.hrhpv-association"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-hsil.hpv.3c",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.f498641c2214021a",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-hsil.high-risk-hpv-association",
    "caseId": "case.anal-hsil.hpv.3d",
    "nodeIds": [
      "node.anal-hsil.hpv.3d"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3d.v1"
    ],
    "chiefComplaint": "Anal pathology follow-up",
    "taskTextShort": "Which persistent infection is the shared oncogenic association?",
    "taskText": "Which persistent infection is the shared oncogenic association?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "clinically_approved"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
      "line": 59,
      "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 60,
        "export": "EARLY_GAME_CLINIC_BATCH_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.anal-hsil.hrhpv-association"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-hsil.hpv.3d",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.838db25c3412474c",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.biopsy-and-staging",
    "caseId": "case.anal-squamous-cell-cancer.bleeding-lesion",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.bleeding-lesion.1"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v1"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "taskText": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.biopsy-and-explicit-staging"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.bleeding-lesion.1",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.cef13a4052a4a8b1",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.localized-chemoradiation-referral",
    "caseId": "case.anal-squamous-cell-cancer.bleeding-lesion",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.bleeding-lesion.2"
    ],
    "variantIds": [
      "question.anal-scc.localized-chemoradiation-referral.v1"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "taskText": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.localized-chemoradiation-referral"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.bleeding-lesion.2",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.9087f391e441a637",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.biopsy-and-staging",
    "caseId": "case.anal-squamous-cell-cancer.clinic-exam",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.clinic-exam.1"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v3"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "taskText": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.biopsy-and-explicit-staging"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.clinic-exam.1",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.026f4029f183ea3c",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.localized-chemoradiation-referral",
    "caseId": "case.anal-squamous-cell-cancer.clinic-exam",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.clinic-exam.2"
    ],
    "variantIds": [
      "question.anal-scc.localized-chemoradiation-referral.v3"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "taskText": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.localized-chemoradiation-referral"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.clinic-exam.2",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.5b4551f22e8bd36c",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.biopsy-and-staging",
    "caseId": "case.anal-squamous-cell-cancer.new-mass",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.new-mass.1"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v2"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "taskText": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.biopsy-and-explicit-staging"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.new-mass.1",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.83b81dd85e694a90",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.localized-chemoradiation-referral",
    "caseId": "case.anal-squamous-cell-cancer.new-mass",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.new-mass.2"
    ],
    "variantIds": [
      "question.anal-scc.localized-chemoradiation-referral.v2"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "taskText": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.localized-chemoradiation-referral"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.new-mass.2",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.573bff9b8ddc9586",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.biopsy-and-staging",
    "caseId": "case.anal-squamous-cell-cancer.persistent-ulcer",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.persistent-ulcer.1"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v4"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "taskText": "Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.biopsy-and-explicit-staging"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.persistent-ulcer.1",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.a14e4c11a79d7e7b",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.anal-scc.localized-chemoradiation-referral",
    "caseId": "case.anal-squamous-cell-cancer.persistent-ulcer",
    "nodeIds": [
      "node.anal-squamous-cell-cancer.persistent-ulcer.2"
    ],
    "variantIds": [
      "question.anal-scc.localized-chemoradiation-referral.v4"
    ],
    "chiefComplaint": "Anal pain or bleeding",
    "taskTextShort": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "taskText": "With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?",
    "status": "live original",
    "retentionState": "default release",
    "live": true,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "line": 4,
      "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 36,
        "export": "BOARD_EXPANSION_20260912_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 48,
        "export": "BOARD_EXPANSION_20260912_CASES",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.analscc.localized-chemoradiation-referral"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.anal-squamous-cell-cancer.persistent-ulcer.2",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.cac395652388ad5b",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.n3.anal-cancer-distant-staging-versus-local-extent",
    "caseId": "case.n3.anal-cancer-distant-staging-versus-local-extent.v1",
    "nodeIds": [
      "node.n3.anal-cancer-distant-staging-versus-local-extent.v1"
    ],
    "variantIds": [
      "question.n3.anal-cancer-distant-staging-versus-local-extent.v1"
    ],
    "chiefComplaint": "Anal treatment planning",
    "taskTextShort": "Which investigation best completes {patientName}'s local staging for the treatment team?",
    "taskText": "Which investigation best completes {patientName}'s local staging for the treatment team?",
    "status": "draft parked",
    "retentionState": "retained nonlive definition",
    "live": false,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [],
    "fileLocation": {
      "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
      "line": 28,
      "export": "QUESTION_NEW_N3_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
        "line": 28,
        "export": "QUESTION_NEW_N3_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
        "line": 33,
        "export": "QUESTION_NEW_N3_CASES",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.n3.1295b506fa79",
      "claim.n3.4201e02052b2"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.n3.anal-cancer-distant-staging-versus-local-extent.v1",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  },
  {
    "recordId": "inventory.a53e64c672c8ef3a",
    "inventoryKind": "materialized case/node",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "secondaryTags": [],
    "conceptId": "concept.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "caseId": "case.n3.anal-cancer-distant-staging-versus-local-extent.v1",
    "nodeIds": [
      "node.n3.anal-cancer-distant-staging-versus-local-extent.v1"
    ],
    "variantIds": [
      "question.n3.anal-cancer-distant-staging-versus-local-extent.v2"
    ],
    "chiefComplaint": "Anal treatment planning",
    "taskTextShort": "Which initial treatment should {patientName} be offered?",
    "taskText": "Which initial treatment should {patientName} be offered?",
    "status": "held for owner",
    "retentionState": "explicit owner decision hold",
    "live": false,
    "declaredClinicalReviewStatuses": [
      "needs_clinician_review"
    ],
    "editorialAcceptance": null,
    "recordedHoldIds": [
      "review.n3.anal-cancer-distant-staging-versus-local-extent.v2"
    ],
    "fileLocation": {
      "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
      "line": 33,
      "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
        "line": 33,
        "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "caseMaterializerLocations": [
      {
        "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
        "line": 39,
        "export": "QUESTION_NEW_N3_ROUND2_CASES",
        "locator": "exported computed definition"
      }
    ],
    "distinctRetainedNodeSerializations": 1,
    "sourceEvidenceClaimIds": [
      "claim.n3.1295b506fa79",
      "claim.n3.4201e02052b2"
    ],
    "casePrimaryTopicSlug": "anal-cancer",
    "crossTopicCase": false,
    "canonicalNodeTopicAssignments": [
      {
        "nodeId": "node.n3.anal-cancer-distant-staging-versus-local-extent.v1",
        "primaryTopicSlug": "anal-cancer"
      }
    ]
  }
]
```

### concepts

```json
[
  {
    "conceptId": "concept.anal-hsil.high-risk-hpv-association",
    "displayName": "Anal HSIL and high-risk HPV",
    "learningObjective": "Identify high-risk human papillomavirus as the approved etiologic association of anal HSIL.",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "registeredInDefaultRelease": true,
    "activeInDefaultRelease": true,
    "status": "live original",
    "liveCases": 4,
    "liveNodeOccurrences": 4,
    "inventoryRecordIds": [
      "inventory.92e73cef590dfe9c",
      "inventory.3b8d4e6bd04f7c88",
      "inventory.4f5fe86dd4bbf309",
      "inventory.f498641c2214021a"
    ],
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 14,
        "export": "EARLY_GAME_CLINIC_BATCH_CONCEPTS",
        "locator": "exact identity literal"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
    "registryOnly": false
  },
  {
    "conceptId": "concept.anal-scc.biopsy-and-staging",
    "displayName": "Biopsy with CT and MRI staging of an anal-canal lesion",
    "learningObjective": "Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "registeredInDefaultRelease": true,
    "activeInDefaultRelease": true,
    "status": "live original",
    "liveCases": 4,
    "liveNodeOccurrences": 4,
    "inventoryRecordIds": [
      "inventory.838db25c3412474c",
      "inventory.9087f391e441a637",
      "inventory.5b4551f22e8bd36c",
      "inventory.573bff9b8ddc9586"
    ],
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CONCEPTS",
        "locator": "exact identity literal"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 12,
        "export": "BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
    "registryOnly": false
  },
  {
    "conceptId": "concept.anal-scc.localized-chemoradiation-referral",
    "displayName": "Chemoradiation referral for localized anal-canal SCC",
    "learningObjective": "Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "registeredInDefaultRelease": true,
    "activeInDefaultRelease": true,
    "status": "live original",
    "liveCases": 4,
    "liveNodeOccurrences": 4,
    "inventoryRecordIds": [
      "inventory.cef13a4052a4a8b1",
      "inventory.026f4029f183ea3c",
      "inventory.83b81dd85e694a90",
      "inventory.a14e4c11a79d7e7b"
    ],
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
        "line": 4,
        "export": "ANAL_SQUAMOUS_CELL_CANCER_CONCEPTS",
        "locator": "exact identity literal"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
        "line": 12,
        "export": "BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      }
    ],
    "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
    "registryOnly": false
  },
  {
    "conceptId": "concept.n3.anal-cancer-distant-staging-versus-local-extent",
    "displayName": "Local staging before anal-cancer treatment",
    "learningObjective": "Distinguish completed distant staging from completed local staging before committing a newly diagnosed anal-canal cancer to a definitive treatment pathway.",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "registeredInDefaultRelease": false,
    "activeInDefaultRelease": false,
    "status": "draft parked",
    "liveCases": 0,
    "liveNodeOccurrences": 0,
    "inventoryRecordIds": [
      "inventory.cac395652388ad5b"
    ],
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
        "line": 18,
        "export": "QUESTION_NEW_N3_AUTHORING_CONCEPTS",
        "locator": "exported computed definition"
      }
    ],
    "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
    "registryOnly": false
  },
  {
    "conceptId": "concept.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "displayName": "Local staging before anal-cancer treatment",
    "learningObjective": "Use anal-canal origin, biopsy and completed staging to choose initial treatment rather than infer a rectal-resection pathway from sphincter involvement.",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "registeredInDefaultRelease": false,
    "activeInDefaultRelease": false,
    "status": "draft parked",
    "liveCases": 0,
    "liveNodeOccurrences": 0,
    "inventoryRecordIds": [
      "inventory.a53e64c672c8ef3a"
    ],
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
        "line": 53,
        "export": "QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS",
        "locator": "exported computed definition"
      }
    ],
    "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
    "registryOnly": false
  }
]
```

### caseAssignments

```json
[
  {
    "caseId": "case.anal-hsil.hpv.3a",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.92e73cef590dfe9c"
    ],
    "nodeIds": [
      "node.anal-hsil.hpv.3a"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3a.v1"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.anal-hsil.hpv.3b",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.3b8d4e6bd04f7c88"
    ],
    "nodeIds": [
      "node.anal-hsil.hpv.3b"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3b.v1"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.anal-hsil.hpv.3c",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.4f5fe86dd4bbf309"
    ],
    "nodeIds": [
      "node.anal-hsil.hpv.3c"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3c.v1"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.anal-hsil.hpv.3d",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.f498641c2214021a"
    ],
    "nodeIds": [
      "node.anal-hsil.hpv.3d"
    ],
    "variantIds": [
      "question.anal-hsil.hpv.3d.v1"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.anal-squamous-cell-cancer.bleeding-lesion",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.838db25c3412474c",
      "inventory.cef13a4052a4a8b1"
    ],
    "nodeIds": [
      "node.anal-squamous-cell-cancer.bleeding-lesion.1",
      "node.anal-squamous-cell-cancer.bleeding-lesion.2"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v1",
      "question.anal-scc.localized-chemoradiation-referral.v1"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.anal-squamous-cell-cancer.clinic-exam",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.9087f391e441a637",
      "inventory.026f4029f183ea3c"
    ],
    "nodeIds": [
      "node.anal-squamous-cell-cancer.clinic-exam.1",
      "node.anal-squamous-cell-cancer.clinic-exam.2"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v3",
      "question.anal-scc.localized-chemoradiation-referral.v3"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.anal-squamous-cell-cancer.new-mass",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.5b4551f22e8bd36c",
      "inventory.83b81dd85e694a90"
    ],
    "nodeIds": [
      "node.anal-squamous-cell-cancer.new-mass.1",
      "node.anal-squamous-cell-cancer.new-mass.2"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v2",
      "question.anal-scc.localized-chemoradiation-referral.v2"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.anal-squamous-cell-cancer.persistent-ulcer",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "liveTopicSlugs": [
      "anal-cancer"
    ],
    "inventoryRecordIds": [
      "inventory.573bff9b8ddc9586",
      "inventory.a14e4c11a79d7e7b"
    ],
    "nodeIds": [
      "node.anal-squamous-cell-cancer.persistent-ulcer.1",
      "node.anal-squamous-cell-cancer.persistent-ulcer.2"
    ],
    "variantIds": [
      "question.anal-scc.biopsy-and-staging.v4",
      "question.anal-scc.localized-chemoradiation-referral.v4"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  },
  {
    "caseId": "case.n3.anal-cancer-distant-staging-versus-local-extent.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": false,
    "liveTopicSlugs": [],
    "inventoryRecordIds": [
      "inventory.cac395652388ad5b",
      "inventory.a53e64c672c8ef3a"
    ],
    "nodeIds": [
      "node.n3.anal-cancer-distant-staging-versus-local-extent.v1"
    ],
    "variantIds": [
      "question.n3.anal-cancer-distant-staging-versus-local-extent.v1",
      "question.n3.anal-cancer-distant-staging-versus-local-extent.v2"
    ],
    "crossTopic": false,
    "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
  }
]
```

### nodeAssignments

```json
[
  {
    "nodeId": "node.anal-hsil.hpv.3a",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.92e73cef590dfe9c"
    ]
  },
  {
    "nodeId": "node.anal-hsil.hpv.3b",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.3b8d4e6bd04f7c88"
    ]
  },
  {
    "nodeId": "node.anal-hsil.hpv.3c",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.4f5fe86dd4bbf309"
    ]
  },
  {
    "nodeId": "node.anal-hsil.hpv.3d",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.f498641c2214021a"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.bleeding-lesion.1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.838db25c3412474c"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.bleeding-lesion.2",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.cef13a4052a4a8b1"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.clinic-exam.1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.9087f391e441a637"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.clinic-exam.2",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.026f4029f183ea3c"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.new-mass.1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.5b4551f22e8bd36c"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.new-mass.2",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.83b81dd85e694a90"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.persistent-ulcer.1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.573bff9b8ddc9586"
    ]
  },
  {
    "nodeId": "node.anal-squamous-cell-cancer.persistent-ulcer.2",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.a14e4c11a79d7e7b"
    ]
  },
  {
    "nodeId": "node.n3.anal-cancer-distant-staging-versus-local-extent.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": false,
    "conceptIds": [
      "concept.n3.anal-cancer-distant-staging-versus-local-extent",
      "concept.n3.anal-cancer-distant-staging-versus-local-extent.v2"
    ],
    "inventoryRecordIds": [
      "inventory.cac395652388ad5b",
      "inventory.a53e64c672c8ef3a"
    ]
  }
]
```

### variantAssignments

```json
[
  {
    "variantId": "question.anal-hsil.hpv.3a.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.92e73cef590dfe9c"
    ]
  },
  {
    "variantId": "question.anal-hsil.hpv.3b.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.3b8d4e6bd04f7c88"
    ]
  },
  {
    "variantId": "question.anal-hsil.hpv.3c.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.4f5fe86dd4bbf309"
    ]
  },
  {
    "variantId": "question.anal-hsil.hpv.3d.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "inventoryRecordIds": [
      "inventory.f498641c2214021a"
    ]
  },
  {
    "variantId": "question.anal-scc.biopsy-and-staging.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.838db25c3412474c"
    ]
  },
  {
    "variantId": "question.anal-scc.biopsy-and-staging.v2",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.5b4551f22e8bd36c"
    ]
  },
  {
    "variantId": "question.anal-scc.biopsy-and-staging.v3",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.9087f391e441a637"
    ]
  },
  {
    "variantId": "question.anal-scc.biopsy-and-staging.v4",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.biopsy-and-staging"
    ],
    "inventoryRecordIds": [
      "inventory.573bff9b8ddc9586"
    ]
  },
  {
    "variantId": "question.anal-scc.localized-chemoradiation-referral.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.cef13a4052a4a8b1"
    ]
  },
  {
    "variantId": "question.anal-scc.localized-chemoradiation-referral.v2",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.83b81dd85e694a90"
    ]
  },
  {
    "variantId": "question.anal-scc.localized-chemoradiation-referral.v3",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.026f4029f183ea3c"
    ]
  },
  {
    "variantId": "question.anal-scc.localized-chemoradiation-referral.v4",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": true,
    "conceptIds": [
      "concept.anal-scc.localized-chemoradiation-referral"
    ],
    "inventoryRecordIds": [
      "inventory.a14e4c11a79d7e7b"
    ]
  },
  {
    "variantId": "question.n3.anal-cancer-distant-staging-versus-local-extent.v1",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": false,
    "conceptIds": [
      "concept.n3.anal-cancer-distant-staging-versus-local-extent"
    ],
    "inventoryRecordIds": [
      "inventory.cac395652388ad5b"
    ]
  },
  {
    "variantId": "question.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "primaryTopicSlug": "anal-cancer",
    "secondaryTopicSlugs": [],
    "live": false,
    "conceptIds": [
      "concept.n3.anal-cancer-distant-staging-versus-local-extent.v2"
    ],
    "inventoryRecordIds": [
      "inventory.a53e64c672c8ef3a"
    ]
  }
]
```

### identityReuseNotes

```json
[]
```

### recordedHolds

```json
[
  {
    "id": "review.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "kind": "owner_decision",
    "recordFile": "docs/research/question-new-n3-round4-20261110.json",
    "reason": "Initial chemoradiation recognition is already covered; a response-versus-salvage decision needs a clinician-endorsed timing boundary.",
    "match": {
      "variantId": "question.n3.anal-cancer-distant-staging-versus-local-extent.v2",
      "caseId": "case.n3.anal-cancer-distant-staging-versus-local-extent.v1"
    },
    "ownerQuestion": "At eight weeks after anal-cancer chemoradiation, if the lesion is steadily shrinking but a small ulcer remains without progressive findings, should the key be repeat response assessment rather than abdominoperineal resection?",
    "inventoryRecordIds": [
      "inventory.a53e64c672c8ef3a"
    ]
  }
]
```

### unkeyedDraftSlots

```json
[]
```

### withheldTeachingPoints

```json
[]
```

### frozenIndependentPassReferences

```json
[]
```

### clinicalApprovalReferences

```json
[
  {
    "id": "approval.melissa-rowland-md.owner-row-109.2026-08-31",
    "sourceRow": 109,
    "reviewer": "Melissa Rowland, MD",
    "reviewedOn": "2026-08-31",
    "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
    "approvedConceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "approvedPresentationVariantIds": [
      "presentation.anal-hsil.hpv.3a",
      "presentation.anal-hsil.hpv.3b",
      "presentation.anal-hsil.hpv.3c",
      "presentation.anal-hsil.hpv.3d"
    ],
    "approvedQuestionVariantIds": [
      "question.anal-hsil.hpv.3a.v1",
      "question.anal-hsil.hpv.3b.v1",
      "question.anal-hsil.hpv.3c.v1",
      "question.anal-hsil.hpv.3d.v1"
    ],
    "approvedEvidenceClaimIds": [],
    "approvedReleasePointIds": [
      "release.l0.clinic_evaluation"
    ],
    "runtimeAnswerShuffle": true,
    "decision": "approved",
    "recordFile": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
    "sourceSha256": "d0d467063de537b35945597e306fc3dac7eed431ed4db26cad790fd5030b2baa",
    "scopeLimitation": "Exact original approved question and presentation definitions only. Clinic materialization/header repair is separately captured and is not promoted to a new exact clinical approval."
  }
]
```

### activeManagerHandoff

```json
"docs/handoffs/CURRENT_THREAD_HANDOFF.md"
```

### activeManagerPlan

```json
null
```

### scopeBoundaryNotes

```json
[
  "Rectal adenocarcinoma belongs to colorectal-polyps-cancer; no rectal scored companion is added.",
  "Benign anorectal disease belongs to anorectal-benign-pelvic-floor.",
  "No primary-topic case crosses a topic boundary; the N3 historical case/node IDs intentionally refer to two different constructs."
]
```

### activeManagerPlanNote

```json
"No dedicated topic-program ExecPlan exists. Active coordination: docs/handoffs/CURRENT_THREAD_HANDOFF.md and docs/research/question-topic-program-20261111.md. Worker durable progress stays in these owned files."
```

## Scope, snapshot, drift, progress and next action

Included scope: Anal HSIL/HPV, anal-canal and margin neoplasia, tissue diagnosis, local/distant staging, chemoradiation response and salvage decisions. Boundary: Rectal adenocarcinoma belongs to colorectal-polyps-cancer. Benign fistula and fissure belong to anorectal-benign-pelvic-floor.

Requested baseline: manifest 145 rows, 1,151 cases / 1,462 nodes / 610 registered concepts. Program capture: `2026-11-11T15:28:05.732Z`, manifest `question-ship.2026-11-10.v9`.

Actual capture at `2026-11-11T22:55:41.303Z`: manifest `question-ship.2026-11-11.v12`, 1250 cases / 1514 nodes / 813 registered concepts. The current accepted array has 404 entries; this is not asserted to equal live accepted-node occurrences. Shared integration advanced globally. All twelve assigned live topic variants remain present; all four assigned source-file hashes match the program snapshot and final input check. No concurrent edit was overwritten.

Counts: **14 exact variants audited; 4 Keep; 3 Rewrite; 7 Retire-and-replace proposals; 9 new questions.** Twelve proposed exact questions form seven cases, with three reused concepts and seven new meanings (ten concepts in the sidecar). The nine new questions include two meaningful opposite-key margin variants of one construct.

Count basis: twelve live and two retained variants; twenty-six raw/live case-node context reviews, representing fifteen distinct node serializations. HPV 3b has different original and live task wording under the same variant ID. Four original clinical approvals are preserved as history; no freeze is silently broadened to the materialized clinic header.

Conditional future supply would be four preserved originals plus twelve proposed questions, or sixteen topic questions versus twelve live at capture, if the manager accepts all proposals and the six duplicate live retirements. This is a proposal, not a live-bank count change.

```json
[
  {
    "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
    "programSha256": "d0d467063de537b35945597e306fc3dac7eed431ed4db26cad790fd5030b2baa",
    "currentSha256": "d0d467063de537b35945597e306fc3dac7eed431ed4db26cad790fd5030b2baa"
  },
  {
    "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
    "programSha256": "3800adfc58e1ff89b1a88d5244bbb46b0e78b110df239f363e68bd8babc2ec4f",
    "currentSha256": "3800adfc58e1ff89b1a88d5244bbb46b0e78b110df239f363e68bd8babc2ec4f"
  },
  {
    "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
    "programSha256": "b1558d6ad01cc14b99f53e498ed48e355d222aa4e04d51c9589fed03112f923a",
    "currentSha256": "b1558d6ad01cc14b99f53e498ed48e355d222aa4e04d51c9589fed03112f923a"
  },
  {
    "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
    "programSha256": "16c622e73d76a8b12a6c676de202ae31d166eb2c922848bc06f0514e5b7b2569",
    "currentSha256": "16c622e73d76a8b12a6c676de202ae31d166eb2c922848bc06f0514e5b7b2569"
  },
  {
    "file": "packages/clinical-content/src/pilot-content.ts",
    "programSha256": "2c0d3b7e5232eb9602640601e736aa79a0d2991be19a4258f89aa38d772ac963",
    "currentSha256": "2c0d3b7e5232eb9602640601e736aa79a0d2991be19a4258f89aa38d772ac963"
  },
  {
    "file": "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
    "programSha256": "c5d197ac06c7bc715e5433c79938296ebb181e07f0e61098e41cd7fee7a3a3bd",
    "currentSha256": "c5d197ac06c7bc715e5433c79938296ebb181e07f0e61098e41cd7fee7a3a3bd"
  },
  {
    "file": "docs/research/question-new-n3-round4-20261110.json",
    "programSha256": "fa63d078fd8db6903f1edfb88a812c802e699f22a834103aa0c084b66f8915d3",
    "currentSha256": "fa63d078fd8db6903f1edfb88a812c802e699f22a834103aa0c084b66f8915d3"
  },
  {
    "file": "docs/clinical/question-authoring-standard.md",
    "programSha256": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671",
    "currentSha256": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671"
  }
]
```

```json
{
  "checkedAt": "2026-11-11T23:25:45.224Z",
  "assignedSourceFiles": [
    {
      "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
      "sha256": "d0d467063de537b35945597e306fc3dac7eed431ed4db26cad790fd5030b2baa",
      "matchesCaptured": true
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
      "sha256": "3800adfc58e1ff89b1a88d5244bbb46b0e78b110df239f363e68bd8babc2ec4f",
      "matchesCaptured": true
    },
    {
      "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
      "sha256": "b1558d6ad01cc14b99f53e498ed48e355d222aa4e04d51c9589fed03112f923a",
      "matchesCaptured": true
    },
    {
      "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
      "sha256": "16c622e73d76a8b12a6c676de202ae31d166eb2c922848bc06f0514e5b7b2569",
      "matchesCaptured": true
    }
  ]
}
```

```json
[
  {
    "date": "2026-11-11",
    "milestone": "Assignment and exact source snapshots captured; permitted-source survey completed; authoring in progress."
  },
  {
    "date": "2026-11-11",
    "milestone": "Audit, twelve drafts, seven case compositions, explicit-import runtime structures and source mappings complete. Next: focused tests, package typecheck, review packet rendering and final reconciliation."
  },
  {
    "date": "2026-11-11",
    "milestone": "Final manual cue pass strengthened the wrong-site specimen distractor to deeper-block review, removed framing-only updates, ranked twelve testable decisions and documented remaining source/clinical holds."
  },
  {
    "date": "2026-11-11",
    "milestone": "All fourteen focused checks pass. Package typecheck currently reports one out-of-lane pancreas-topic error. Exact output and full review packet are being finalized."
  }
]
```

Next action: manager inspects the actual five-file diff, routes independent adversarial review, obtains Melissa?s exact clinical decisions, resolves the out-of-lane package typecheck error, and chooses admission/retirement. Shared handoff and planning files are manager-owned and were not edited.

## Ranked testable concepts and coverage/gap matrix

Owner-directed qualitative surgery-resident testing relevance and clinical consequence. No official exam percentage, recalled question, SCORE corpus or measured performance claim.

The survey covered anatomy, pathology, diagnosis/staging, initial treatment, precursor management, response, salvage and follow-up. No separate embryology recall objective earned a consequential decision in this topic. ?Most testable? is an editorial priority assessment, not a claim about an examination?s actual question frequency.

| Rank | Decision family | Existing exact variants | Proposed nodes | Coverage / gap |
|---|---|---|---|---|

| 1 | Regional disease versus metastatic treatment intent | question.anal-scc.localized-chemoradiation-referral.v1; question.anal-scc.localized-chemoradiation-referral.v3; question.anal-scc.localized-chemoradiation-referral.v2; question.anal-scc.localized-chemoradiation-referral.v4 | question.topic.anal-cancer.regional-node-treatment.v1 | Four redundant live initial-treatment variants; one raw-distribution rewrite. |

| 2 | Representative tissue and specimen provenance | question.anal-scc.biopsy-and-staging.v1; question.anal-scc.biopsy-and-staging.v3; question.anal-scc.biopsy-and-staging.v2; question.anal-scc.biopsy-and-staging.v4 | question.topic.anal-cancer.sample-provenance.v1; question.topic.anal-cancer.new-nodule-after-hsil.v1 | Four supplied-workup live variants; one rewrite plus one consequential negative-screen variant using the same stable identity. |

| 3 | Regression versus progression after chemoradiation | question.n3.anal-cancer-distant-staging-versus-local-extent.v2 | none | No scored response item. Existing owner hold remains unkeyed. |

| 4 | Confirmed isolated local failure and salvage APR | none | question.topic.anal-cancer.confirm-local-recurrence.v1; question.topic.anal-cancer.salvage-local-failure.v1 | Previously absent; new two-node clinic record-review case. |

| 5 | Canal versus margin, differentiation and clearance | none | question.topic.anal-cancer.clear-margin-observation.v1; question.topic.anal-cancer.adverse-margin-histology.v1 | Previously absent. Two independent opposite-key siblings share one new construct; close-margin management remains unkeyed. |

| 6 | Abnormal cytology versus tissue diagnosis | none | question.topic.anal-cancer.cytology-to-histology.v1 | No existing scored diagnostic HSIL pathway; new first node. |

| 7 | Treat confirmed anal HSIL in adults with HIV | none | question.topic.anal-cancer.treat-intraepithelial-lesion.v1 | Previously only HPV-cause recall; new management node. |

| 8 | Usable local staging versus completed distant staging | question.n3.anal-cancer-distant-staging-versus-local-extent.v1 | question.topic.anal-cancer.local-staging-record.v1 | Retained N3 v1 rewritten with the same meaning and a new exact question. |

| 9 | Previously irradiated isolated groin recurrence | none | question.topic.anal-cancer.irradiated-groin-recurrence.v1 | Previously absent; new standalone. |

| 10 | Metastatic first-line versus post-platinum therapy | none | question.topic.anal-cancer.metastatic-first-systemic-line.v1 | New standalone reflecting the 2025 FDA approval and 2026 NCI update. |

| 11 | Oncogenic HPV causal association | question.anal-hsil.hpv.3a.v1; question.anal-hsil.hpv.3b.v1; question.anal-hsil.hpv.3c.v1; question.anal-hsil.hpv.3d.v1 | none | Four exact approved originals kept; redundant one-step coverage, no new basic acceptance. |

| 12 | Superficially invasive canal cancer and exact excision eligibility | question.anal-scc.localized-chemoradiation-referral.v1; question.anal-scc.localized-chemoradiation-referral.v3; question.anal-scc.localized-chemoradiation-referral.v2; question.anal-scc.localized-chemoradiation-referral.v4 | none | Withheld gap; exact canal criteria need current permitted source verification and Melissa. |

### 1. Regional disease versus metastatic treatment intent

Decision: Choose the initial treatment pathway after locating nodal spread. Raw evidence: Anal-canal squamous histology, inguinal-node sample, distant CT and local MRI.

Closest credible error: Call an inguinal node distant disease or import a rectal-resection rule. Consequence: Wrong cancer-treatment intent instead of standard curative local-regional care.

Testing relevance: Core surgery oncology decision; ranking is qualitative editorial judgment, not exam-frequency data.

Concepts: `concept.anal-scc.localized-chemoradiation-referral`. Claims: `claim.question-topic.anal-cancer.inguinal-regional`, `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.crt-regimen`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 1,
  "title": "Regional disease versus metastatic treatment intent",
  "existingVariants": [
    "question.anal-scc.localized-chemoradiation-referral.v1",
    "question.anal-scc.localized-chemoradiation-referral.v3",
    "question.anal-scc.localized-chemoradiation-referral.v2",
    "question.anal-scc.localized-chemoradiation-referral.v4"
  ],
  "inventoryRecords": [
    "inventory.cef13a4052a4a8b1",
    "inventory.026f4029f183ea3c",
    "inventory.83b81dd85e694a90",
    "inventory.a14e4c11a79d7e7b"
  ],
  "auditVerdicts": [
    {
      "recordId": "inventory.cef13a4052a4a8b1",
      "verdict": "Rewrite"
    },
    {
      "recordId": "inventory.026f4029f183ea3c",
      "verdict": "Retire-and-replace"
    },
    {
      "recordId": "inventory.83b81dd85e694a90",
      "verdict": "Retire-and-replace"
    },
    {
      "recordId": "inventory.a14e4c11a79d7e7b",
      "verdict": "Retire-and-replace"
    }
  ],
  "proposedQuestions": [
    "question.topic.anal-cancer.regional-node-treatment.v1"
  ],
  "coverage": "Four redundant live initial-treatment variants; one raw-distribution rewrite."
}
```

### 2. Representative tissue and specimen provenance

Decision: Decide which current lesion still needs diagnostic tissue. Raw evidence: Procedure map, specimen label, examined target and conflicting negative screening.

Closest credible error: Apply benign wrong-site tissue or a negative swab to an unsolved palpable lesion. Consequence: Delayed diagnosis.

Testing relevance: Frequent practical reasoning error transferable across colorectal cases.

Concepts: `concept.anal-scc.biopsy-and-staging`. Claims: `claim.question-topic.anal-cancer.representative-tissue`, `claim.question-topic.anal-cancer.sampling-limits`, `claim.question-topic.anal-cancer.new-lesion-after-hsil`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 2,
  "title": "Representative tissue and specimen provenance",
  "existingVariants": [
    "question.anal-scc.biopsy-and-staging.v1",
    "question.anal-scc.biopsy-and-staging.v3",
    "question.anal-scc.biopsy-and-staging.v2",
    "question.anal-scc.biopsy-and-staging.v4"
  ],
  "inventoryRecords": [
    "inventory.838db25c3412474c",
    "inventory.9087f391e441a637",
    "inventory.5b4551f22e8bd36c",
    "inventory.573bff9b8ddc9586"
  ],
  "auditVerdicts": [
    {
      "recordId": "inventory.838db25c3412474c",
      "verdict": "Rewrite"
    },
    {
      "recordId": "inventory.9087f391e441a637",
      "verdict": "Retire-and-replace"
    },
    {
      "recordId": "inventory.5b4551f22e8bd36c",
      "verdict": "Retire-and-replace"
    },
    {
      "recordId": "inventory.573bff9b8ddc9586",
      "verdict": "Retire-and-replace"
    }
  ],
  "proposedQuestions": [
    "question.topic.anal-cancer.sample-provenance.v1",
    "question.topic.anal-cancer.new-nodule-after-hsil.v1"
  ],
  "coverage": "Four supplied-workup live variants; one rewrite plus one consequential negative-screen variant using the same stable identity."
}
```

### 3. Regression versus progression after chemoradiation

Decision: Distinguish slow response from failure before biopsy or salvage. Raw evidence: Serial examinations, treatment initiation and completion dates, ulcer trajectory and new progressive findings.

Closest credible error: Call a shrinking early residual ulcer treatment failure. Consequence: Premature radical treatment or delayed response evaluation.

Testing relevance: High-value gap, specifically requested by earlier review; exact timing clock needs Melissa.

Concepts: `concept.n3.anal-cancer-distant-staging-versus-local-extent.v2`. Claims: `claim.question-topic.anal-cancer.response-clock-held`, `claim.question-topic.anal-cancer.progression-biopsy-held`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 3,
  "title": "Regression versus progression after chemoradiation",
  "existingVariants": [
    "question.n3.anal-cancer-distant-staging-versus-local-extent.v2"
  ],
  "inventoryRecords": [
    "inventory.a53e64c672c8ef3a"
  ],
  "auditVerdicts": [
    {
      "recordId": "inventory.a53e64c672c8ef3a",
      "verdict": "Retire-and-replace"
    }
  ],
  "proposedQuestions": [],
  "coverage": "No scored response item. Existing owner hold remains unkeyed."
}
```

### 4. Confirmed isolated local failure and salvage APR

Decision: Confirm viable recurrence and choose the salvage pathway after restaging. Raw evidence: Prior complete response, new scar nodule, representative biopsy, prior radiation and resection planes.

Closest credible error: Treat imaging as tissue proof or equate any recurrence with metastatic disease. Consequence: Unjustified radical surgery or missed curative salvage opportunity.

Testing relevance: Consequential operation selection with distinct diagnostic and treatment phases.

Concepts: `concept.topic.anal-cancer.recurrence-confirmation.v1`, `concept.topic.anal-cancer.salvage-apr.v1`. Claims: `claim.question-topic.anal-cancer.recurrence-histology`, `claim.question-topic.anal-cancer.salvage-apr`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 4,
  "title": "Confirmed isolated local failure and salvage APR",
  "existingVariants": [],
  "inventoryRecords": [],
  "auditVerdicts": [],
  "proposedQuestions": [
    "question.topic.anal-cancer.confirm-local-recurrence.v1",
    "question.topic.anal-cancer.salvage-local-failure.v1"
  ],
  "coverage": "Previously absent; new two-node clinic record-review case."
}
```

### 5. Canal versus margin, differentiation and clearance

Decision: Select postoperative care after a skin-margin SCC excision. Raw evidence: Operative site map, differentiation, measured clearance and nodal assessment.

Closest credible error: Apply blanket canal CRT or use negative margins to ignore adverse differentiation. Consequence: Overtreatment or insufficient treatment.

Testing relevance: Commonly testable exception to the main anal-cancer pathway, with a consequential histologic discriminator.

Concepts: `concept.topic.anal-cancer.margin-adjuvant-selection.v1`. Claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.adverse-margin-histology`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 5,
  "title": "Canal versus margin, differentiation and clearance",
  "existingVariants": [],
  "inventoryRecords": [],
  "auditVerdicts": [],
  "proposedQuestions": [
    "question.topic.anal-cancer.clear-margin-observation.v1",
    "question.topic.anal-cancer.adverse-margin-histology.v1"
  ],
  "coverage": "Previously absent. Two independent opposite-key siblings share one new construct; close-margin management remains unkeyed."
}
```

### 6. Abnormal cytology versus tissue diagnosis

Decision: Arrange directed histology despite normal palpation. Raw evidence: Swab cytology, HPV result, physical examination and actual prior specimen history.

Closest credible error: Repeat screening or stage an unproven invasive cancer. Consequence: Missed precursor or incorrectly inferred cancer diagnosis.

Testing relevance: Practical screening-to-diagnosis transition, not viral association recall.

Concepts: `concept.topic.anal-cancer.cytology-hra.v1`. Claims: `claim.question-topic.anal-cancer.abnormal-cytology-hra`, `claim.question-topic.anal-cancer.normal-palpation`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 6,
  "title": "Abnormal cytology versus tissue diagnosis",
  "existingVariants": [],
  "inventoryRecords": [],
  "auditVerdicts": [],
  "proposedQuestions": [
    "question.topic.anal-cancer.cytology-to-histology.v1"
  ],
  "coverage": "No existing scored diagnostic HSIL pathway; new first node."
}
```

### 7. Treat confirmed anal HSIL in adults with HIV

Decision: Choose lesion treatment instead of monitoring or cancer therapy. Raw evidence: Epithelial architecture, represented stroma, HIV context and accessible focal lesions.

Closest credible error: Equate no invasion and HIV suppression with no treatment indication. Consequence: Leave a treatable precursor untreated or overtreat with cancer therapy.

Testing relevance: Current evidence changes a real decision; do not claim modality superiority or extrapolate ANCHOR to every population.

Concepts: `concept.topic.anal-cancer.hsil-treatment-hiv.v1`. Claims: `claim.question-topic.anal-cancer.hsil-intraepithelial`, `claim.question-topic.anal-cancer.treat-hsil-hiv`, `claim.question-topic.anal-cancer.hyfrecation`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 7,
  "title": "Treat confirmed anal HSIL in adults with HIV",
  "existingVariants": [],
  "inventoryRecords": [],
  "auditVerdicts": [],
  "proposedQuestions": [
    "question.topic.anal-cancer.treat-intraepithelial-lesion.v1"
  ],
  "coverage": "Previously only HPV-cause recall; new management node."
}
```

### 8. Usable local staging versus completed distant staging

Decision: Resolve the correct staging information gap. Raw evidence: CT scope plus separate acquisition, archive and export records.

Closest credible error: Repeat a completed acquisition or substitute metabolic imaging for local anatomy. Consequence: Unnecessary testing or incomplete treatment planning.

Testing relevance: Acquisition adequacy and local/distant scope are clinically actionable; no inconsequential stage-label objective.

Concepts: `concept.n3.anal-cancer-distant-staging-versus-local-extent`. Claims: `claim.question-topic.anal-cancer.mri-local`, `claim.question-topic.anal-cancer.ct-distant`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 8,
  "title": "Usable local staging versus completed distant staging",
  "existingVariants": [
    "question.n3.anal-cancer-distant-staging-versus-local-extent.v1"
  ],
  "inventoryRecords": [
    "inventory.cac395652388ad5b"
  ],
  "auditVerdicts": [
    {
      "recordId": "inventory.cac395652388ad5b",
      "verdict": "Rewrite"
    }
  ],
  "proposedQuestions": [
    "question.topic.anal-cancer.local-staging-record.v1"
  ],
  "coverage": "Retained N3 v1 rewritten with the same meaning and a new exact question."
}
```

### 9. Previously irradiated isolated groin recurrence

Decision: Choose regional rather than primary-site salvage. Raw evidence: Current biopsy, control of the canal primary, distant staging and archived groin field.

Closest credible error: APR for every recurrence or re-treat an irradiated groin automatically. Consequence: Wrong target or wrong radiation-field assumption.

Testing relevance: Harder specialist-adjacent decision still within surgical oncology scope; evidence is consensus-heavy.

Concepts: `concept.topic.anal-cancer.inguinal-salvage.v1`. Claims: `claim.question-topic.anal-cancer.irradiated-groin-salvage`, `claim.question-topic.anal-cancer.salvage-apr`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 9,
  "title": "Previously irradiated isolated groin recurrence",
  "existingVariants": [],
  "inventoryRecords": [],
  "auditVerdicts": [],
  "proposedQuestions": [
    "question.topic.anal-cancer.irradiated-groin-recurrence.v1"
  ],
  "coverage": "Previously absent; new standalone."
}
```

### 10. Metastatic first-line versus post-platinum therapy

Decision: Read the actual earlier drugs before selecting a systemic pathway. Raw evidence: Biopsy-matched disseminated recurrence and prior fluorouracil?mitomycin radiosensitization.

Closest credible error: Treat any prior chemotherapy as platinum-refractory metastatic therapy. Consequence: Wrong line-specific systemic plan.

Testing relevance: Current treatment-line literacy matters more than memorizing unsupported doses or old regimens.

Concepts: `concept.topic.anal-cancer.metastatic-line-selection.v1`. Claims: `claim.question-topic.anal-cancer.first-line-retifanlimab`, `claim.question-topic.anal-cancer.post-platinum-monotherapy`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 10,
  "title": "Metastatic first-line versus post-platinum therapy",
  "existingVariants": [],
  "inventoryRecords": [],
  "auditVerdicts": [],
  "proposedQuestions": [
    "question.topic.anal-cancer.metastatic-first-systemic-line.v1"
  ],
  "coverage": "New standalone reflecting the 2025 FDA approval and 2026 NCI update."
}
```

### 11. Oncogenic HPV causal association

Decision: Distinguish the causal viral association from immunosuppression. Raw evidence: Anal/vulvar precursor pathology and HIV/transplant context.

Closest credible error: Call HIV, CMV or BK the direct oncogenic association. Consequence: Incorrect etiologic counseling.

Testing relevance: Foundational biology has value, but four association variants have lower marginal yield than the new decision gaps.

Concepts: `concept.anal-hsil.high-risk-hpv-association`. Claims: `claim.question-topic.anal-cancer.oncogenic-hpv`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 11,
  "title": "Oncogenic HPV causal association",
  "existingVariants": [
    "question.anal-hsil.hpv.3a.v1",
    "question.anal-hsil.hpv.3b.v1",
    "question.anal-hsil.hpv.3c.v1",
    "question.anal-hsil.hpv.3d.v1"
  ],
  "inventoryRecords": [
    "inventory.92e73cef590dfe9c",
    "inventory.3b8d4e6bd04f7c88",
    "inventory.4f5fe86dd4bbf309",
    "inventory.f498641c2214021a"
  ],
  "auditVerdicts": [
    {
      "recordId": "inventory.92e73cef590dfe9c",
      "verdict": "Keep"
    },
    {
      "recordId": "inventory.3b8d4e6bd04f7c88",
      "verdict": "Keep"
    },
    {
      "recordId": "inventory.4f5fe86dd4bbf309",
      "verdict": "Keep"
    },
    {
      "recordId": "inventory.f498641c2214021a",
      "verdict": "Keep"
    }
  ],
  "proposedQuestions": [],
  "coverage": "Four exact approved originals kept; redundant one-step coverage, no new basic acceptance."
}
```

### 12. Superficially invasive canal cancer and exact excision eligibility

Decision: Decide whether a rare very-early lesion can avoid definitive CRT. Raw evidence: Complete excision specimen, exact depth/spread, clearance and adverse features.

Closest credible error: Generalize every small anal-canal lesion into an excision exception. Consequence: Undertreatment or needless CRT.

Testing relevance: Potentially testable but exact histologic eligibility cannot be improvised.

Concepts: `concept.anal-scc.localized-chemoradiation-referral`. Claims: `claim.question-topic.anal-cancer.selected-margin-excision`.

Exact inventory, sibling versions and dispositions:

```json
{
  "rank": 12,
  "title": "Superficially invasive canal cancer and exact excision eligibility",
  "existingVariants": [
    "question.anal-scc.localized-chemoradiation-referral.v1",
    "question.anal-scc.localized-chemoradiation-referral.v3",
    "question.anal-scc.localized-chemoradiation-referral.v2",
    "question.anal-scc.localized-chemoradiation-referral.v4"
  ],
  "inventoryRecords": [
    "inventory.cef13a4052a4a8b1",
    "inventory.026f4029f183ea3c",
    "inventory.83b81dd85e694a90",
    "inventory.a14e4c11a79d7e7b"
  ],
  "auditVerdicts": [
    {
      "recordId": "inventory.cef13a4052a4a8b1",
      "verdict": "Rewrite"
    },
    {
      "recordId": "inventory.026f4029f183ea3c",
      "verdict": "Retire-and-replace"
    },
    {
      "recordId": "inventory.83b81dd85e694a90",
      "verdict": "Retire-and-replace"
    },
    {
      "recordId": "inventory.a14e4c11a79d7e7b",
      "verdict": "Retire-and-replace"
    }
  ],
  "proposedQuestions": [],
  "coverage": "Withheld gap; exact canal criteria need current permitted source verification and Melissa."
}
```

Remaining boundaries and source limitations:

- Nine source records are not nine independent trials; several discuss ANCHOR or the same FDA approval.
- The NCI 2025 PDQ summary predates the metastatic retifanlimab indication; a current 2026 government drug page cross-checks it.
- SEOM is a society guideline published in 2026 despite 2025 in the title; CC BY-NC-ND does not authorize adapted material. Only targeted facts are used.
- No proprietary corpus, protected figure, copied table/algorithm, full article, source excerpt or paywalled snippet is stored.
- ASTRO terms rendering was incomplete; only its public original announcement is used for bounded broad facts, without claiming redistribution rights.
- Exact HSIL six-month HRA timing has one adequate guideline and limited comparative evidence.
- Close-margin and response-clock disagreement are recorded, not averaged into keys.
- Postoperative poor-grade margin-case treatment is an explicitly disclosed application of the guideline excision exclusion, not a direct postoperative trial result. Melissa must adjudicate that exact draft before clinical approval.

- Existing eight-week response hold
- Close/positive-margin ranking
- Exact superficially invasive canal-cancer excision eligibility
- Risk-group screening eligibility and NIH/IANS HPV-only algorithm difference
- Regimen modifications, radiation dose/de-escalation and treatment toxicity require further targeted sources before authoring

- No separate embryology recall item was added: no consequential topic decision was identified beyond clinically useful site/histology distinctions.
- No race/ethnicity disease-selection variable, editorial demographic weight, exact cancer probability or treatment dose was authored.
- HIV is clinically relevant to HSIL evidence scope and is not a demographic weighting variable.
- Drug schedules, radiation doses, de-escalation, toxicity substitutions and rare histology pathways remain outside these supported drafts.
- All hospital/oncology records are reviewed in an existing clinic frame; no new facility setting is proposed.

## Complete audit table

A verdict proposes future supply; none deletes an original definition, save, FSRS history or exact approval. Every assigned variant and its distinct visible context is reviewed. Registry-only assigned identities: zero. Assigned unkeyed slots: zero. Inherited specific owner hold: one, carried below.

| Inventory record | Exact variant | Concept | Status | Verdict | Proposed replacement |
|---|---|---|---|---|---|

| inventory.92e73cef590dfe9c | question.anal-hsil.hpv.3a.v1 | concept.anal-hsil.high-risk-hpv-association | live original | Keep | retain exact |

| inventory.3b8d4e6bd04f7c88 | question.anal-hsil.hpv.3b.v1 | concept.anal-hsil.high-risk-hpv-association | live original | Keep | retain exact |

| inventory.4f5fe86dd4bbf309 | question.anal-hsil.hpv.3c.v1 | concept.anal-hsil.high-risk-hpv-association | live original | Keep | retain exact |

| inventory.f498641c2214021a | question.anal-hsil.hpv.3d.v1 | concept.anal-hsil.high-risk-hpv-association | live original | Keep | retain exact |

| inventory.838db25c3412474c | question.anal-scc.biopsy-and-staging.v1 | concept.anal-scc.biopsy-and-staging | live original | Rewrite | question.topic.anal-cancer.sample-provenance.v1 |

| inventory.cef13a4052a4a8b1 | question.anal-scc.localized-chemoradiation-referral.v1 | concept.anal-scc.localized-chemoradiation-referral | live original | Rewrite | question.topic.anal-cancer.regional-node-treatment.v1 |

| inventory.9087f391e441a637 | question.anal-scc.biopsy-and-staging.v3 | concept.anal-scc.biopsy-and-staging | live original | Retire-and-replace | question.topic.anal-cancer.new-nodule-after-hsil.v1 |

| inventory.026f4029f183ea3c | question.anal-scc.localized-chemoradiation-referral.v3 | concept.anal-scc.localized-chemoradiation-referral | live original | Retire-and-replace | question.topic.anal-cancer.salvage-local-failure.v1 |

| inventory.5b4551f22e8bd36c | question.anal-scc.biopsy-and-staging.v2 | concept.anal-scc.biopsy-and-staging | live original | Retire-and-replace | question.topic.anal-cancer.cytology-to-histology.v1 |

| inventory.83b81dd85e694a90 | question.anal-scc.localized-chemoradiation-referral.v2 | concept.anal-scc.localized-chemoradiation-referral | live original | Retire-and-replace | question.topic.anal-cancer.clear-margin-observation.v1; question.topic.anal-cancer.adverse-margin-histology.v1 |

| inventory.573bff9b8ddc9586 | question.anal-scc.biopsy-and-staging.v4 | concept.anal-scc.biopsy-and-staging | live original | Retire-and-replace | question.topic.anal-cancer.confirm-local-recurrence.v1 |

| inventory.a14e4c11a79d7e7b | question.anal-scc.localized-chemoradiation-referral.v4 | concept.anal-scc.localized-chemoradiation-referral | live original | Retire-and-replace | question.topic.anal-cancer.irradiated-groin-recurrence.v1; question.topic.anal-cancer.metastatic-first-systemic-line.v1 |

| inventory.cac395652388ad5b | question.n3.anal-cancer-distant-staging-versus-local-extent.v1 | concept.n3.anal-cancer-distant-staging-versus-local-extent | draft parked | Rewrite | question.topic.anal-cancer.local-staging-record.v1 |

| inventory.a53e64c672c8ef3a | question.n3.anal-cancer-distant-staging-versus-local-extent.v2 | concept.n3.anal-cancer-distant-staging-versus-local-extent.v2 | held for owner | Retire-and-replace | question.topic.anal-cancer.salvage-local-failure.v1 |

## Exact before packets and audit reasons

**key shown first for review only.** Original choices, explanations and review metadata are retained as authored repository material. Raw and current materialized contexts are shown separately; later results are not treated as pre-answer context. Full original case objects and profiles are also retained in JSON `before`.

### question.anal-hsil.hpv.3a.v1

Inventory `inventory.92e73cef590dfe9c`; verdict **Keep**. Source `packages/clinical-content/src/approved-data/early-game-clinic-batch.ts` ? `EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS`. Concept `concept.anal-hsil.high-risk-hpv-association`; case `case.anal-hsil.hpv.3a`; nodes `node.anal-hsil.hpv.3a`.

Before content version `clinical.owner-rows-066-087-109.2026-08-31.1`; question SHA-256 `731584895f8ad7a6da4701341502856b6386be2f2a72f139452a89fefd05518c`. Approval: `approval.melissa-rowland-md.owner-row-109.2026-08-31`; independent PASS: none. Recorded holds: none.

- The lesion is named before a causal-virus association task; no management inference. Abstract original presentation and long generic complaint fail current presentation guidance.
- Preserve exact original clinical approval and its source. Current one-step difficulty is a limitation, not a new basic/onboarding acceptance. No new independent PASS or clinical approval is asserted.
- Raw and live headers are separately captured. Exact original approval does not extend to newer named/aged clinic materializations.

Replacement definitions: none; retain exact original.

#### Before ? retained source export

Node SHA-256 `3977992913cf8d33c87bb81c467532d98065df3a6425c66df8b74f3caab4e93c`; full case SHA-256 `9685f51292a328e70e5ff52cb48a2f1119ce1c8299156f9e45e0f4d62a2138ef`.

Complaint: Reviewing an approved clinic teaching question

Presentation: A patient's biopsy shows anal high-grade squamous intraepithelial lesion (anal HSIL; historically high-grade AIN).

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which viral category is etiologically associated with this lesion?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- Human immunodeficiency virus (`hiv`). Existing rationale: This does not match the exact approved answer.

- Hepatitis C virus (`hcv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: Anal HSIL is HPV-associated; this does not mean every HPV infection represents HSIL.

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

#### Before ? current live clinic materialization

Node SHA-256 `3977992913cf8d33c87bb81c467532d98065df3a6425c66df8b74f3caab4e93c`; full case SHA-256 `b85b3de83647398889b965e04fece7191eaf4f2fe62e0fc2c8b4320be01e73ba`.

Complaint: Anal pathology follow-up

Presentation: {patientName}'s biopsy shows anal high-grade squamous intraepithelial lesion (anal HSIL; historically high-grade AIN).

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which viral category is etiologically associated with this lesion?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- Human immunodeficiency virus (`hiv`). Existing rationale: This does not match the exact approved answer.

- Hepatitis C virus (`hcv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: Anal HSIL is HPV-associated; this does not mean every HPV infection represents HSIL.

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

### question.anal-hsil.hpv.3b.v1

Inventory `inventory.3b8d4e6bd04f7c88`; verdict **Keep**. Source `packages/clinical-content/src/approved-data/early-game-clinic-batch.ts` ? `EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS`. Concept `concept.anal-hsil.high-risk-hpv-association`; case `case.anal-hsil.hpv.3b`; nodes `node.anal-hsil.hpv.3b`.

Before content version `clinical.owner-rows-066-087-109.2026-08-31.1`; question SHA-256 `2f4c0cbfb76571f93637b54567b02c5f9e4337afdc49b1e2fe66dc7777d22a29`. Approval: `approval.melissa-rowland-md.owner-row-109.2026-08-31`; independent PASS: none. Recorded holds: none.

- The raw approved task is ?Which answer is appropriate?? and depends on presentation. The current materialized task clarifies the causal-virus request; it is a separately hashed changed context, not a newly approved exact version.
- Preserve exact original clinical approval and its source. Current one-step difficulty is a limitation, not a new basic/onboarding acceptance. No new independent PASS or clinical approval is asserted.
- Raw and live headers are separately captured. Exact original approval does not extend to newer named/aged clinic materializations.

Replacement definitions: none; retain exact original.

#### Before ? retained source export

Node SHA-256 `3685321382a7a4252827a66f52e46be9d8f0e22f796d9100cdd3a430d4926de1`; full case SHA-256 `2fd0c9dabdc85255378a223dda7bf7ada3c6f4c4cc64e13a680ced687126b41a`.

Complaint: Reviewing an approved clinic teaching question

Presentation: A patient with anal HSIL asks which virus is etiologically linked to this dysplastic lesion.

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which answer is appropriate?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- Human immunodeficiency virus (`hiv`). Existing rationale: This does not match the exact approved answer.

- Epstein–Barr virus (`ebv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: High-risk human papillomavirus

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

#### Before ? current live clinic materialization

Node SHA-256 `269d6063e940faf0c61622afcb2c1319229ed6f1d17f51f0eb83ca805cc86775`; full case SHA-256 `2e948a6fe4e60bfcf039c5cf9d61787e9b5a2125531f58c40eaf8d45280372e9`.

Complaint: Anal pathology follow-up

Presentation: {patientName} returns to clinic for follow-up of documented anal HSIL.

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which virus is etiologically linked to this dysplastic lesion?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- Human immunodeficiency virus (`hiv`). Existing rationale: This does not match the exact approved answer.

- Epstein–Barr virus (`ebv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: High-risk human papillomavirus

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

### question.anal-hsil.hpv.3c.v1

Inventory `inventory.4f5fe86dd4bbf309`; verdict **Keep**. Source `packages/clinical-content/src/approved-data/early-game-clinic-batch.ts` ? `EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS`. Concept `concept.anal-hsil.high-risk-hpv-association`; case `case.anal-hsil.hpv.3c`; nodes `node.anal-hsil.hpv.3c`.

Before content version `clinical.owner-rows-066-087-109.2026-08-31.1`; question SHA-256 `06a4fb3e2148323eeb6b6e95206e572b35ca10095686e7e0c45f979e747acd17`. Approval: `approval.melissa-rowland-md.owner-row-109.2026-08-31`; independent PASS: none. Recorded holds: none.

- Transplant context makes BK/CMV recognizable temptations, but identifying the viral cause remains one-step association recall. No accepted basic exception was found.
- Preserve exact original clinical approval and its source. Current one-step difficulty is a limitation, not a new basic/onboarding acceptance. No new independent PASS or clinical approval is asserted.
- Raw and live headers are separately captured. Exact original approval does not extend to newer named/aged clinic materializations.

Replacement definitions: none; retain exact original.

#### Before ? retained source export

Node SHA-256 `53ec20c903399bdfbc10df03af9cd470acdd6da8219a943adfdc0b6c57d4a1e9`; full case SHA-256 `fcc9745960d88714b6e5d753eec3d3e147c7d2068985b96ead6309381134a05d`.

Complaint: Reviewing an approved clinic teaching question

Presentation: A solid-organ transplant recipient has off-site pathology confirming anal HSIL.

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which viral category is directly associated with the dysplastic lesion?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- BK polyomavirus (`bk_polyomavirus`). Existing rationale: This does not match the exact approved answer.

- Cytomegalovirus (`cmv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: Immunosuppression is patient context; high-risk HPV is the lesion’s viral association.

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

#### Before ? current live clinic materialization

Node SHA-256 `53ec20c903399bdfbc10df03af9cd470acdd6da8219a943adfdc0b6c57d4a1e9`; full case SHA-256 `ac7bbd8b63dcaceebb4195a75e0d61038b79f4b1b405384ae30728617811e3f0`.

Complaint: Anal pathology follow-up

Presentation: {patientName}, a solid-organ transplant recipient, has off-site pathology confirming anal HSIL.

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which viral category is directly associated with the dysplastic lesion?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- BK polyomavirus (`bk_polyomavirus`). Existing rationale: This does not match the exact approved answer.

- Cytomegalovirus (`cmv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: Immunosuppression is patient context; high-risk HPV is the lesion’s viral association.

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

### question.anal-hsil.hpv.3d.v1

Inventory `inventory.f498641c2214021a`; verdict **Keep**. Source `packages/clinical-content/src/approved-data/early-game-clinic-batch.ts` ? `EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS`. Concept `concept.anal-hsil.high-risk-hpv-association`; case `case.anal-hsil.hpv.3d`; nodes `node.anal-hsil.hpv.3d`.

Before content version `clinical.owner-rows-066-087-109.2026-08-31.1`; question SHA-256 `e2fd8c1a847ab9f320d9967066586b6b5964cdfea9108e1cb36ab714b1232e1f`. Approval: `approval.melissa-rowland-md.owner-row-109.2026-08-31`; independent PASS: none. Recorded holds: none.

- Prior vulvar HSIL rehearses the shared HPV association and the task asks the same causal-virus rule. Preserve clinically constrained female context in any future revised profile.
- Preserve exact original clinical approval and its source. Current one-step difficulty is a limitation, not a new basic/onboarding acceptance. No new independent PASS or clinical approval is asserted.
- Raw and live headers are separately captured. Exact original approval does not extend to newer named/aged clinic materializations.

Replacement definitions: none; retain exact original.

#### Before ? retained source export

Node SHA-256 `64796c9171b88d3721f8d8e2b63bc44f9e988b126cb64f57ec2734cb555c6a62`; full case SHA-256 `e72dc24889bcad828a95cb30013f0b6ab45ca07aa7b543e215e9bc8f426c30f7`.

Complaint: Reviewing an approved clinic teaching question

Presentation: Patient with a prior vulvar HSIL is evaluated for a new anal squamous intraepithelial lesion.

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which persistent infection is the shared oncogenic association?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- Herpes simplex virus type 2 (`hsv2`). Existing rationale: This does not match the exact approved answer.

- Epstein–Barr virus (`ebv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: High-risk human papillomavirus

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

#### Before ? current live clinic materialization

Node SHA-256 `64796c9171b88d3721f8d8e2b63bc44f9e988b126cb64f57ec2734cb555c6a62`; full case SHA-256 `85af5b8a79813e2c9ac52b17f538eec5b788efd888ac271386dd13db2201e3d5`.

Complaint: Anal pathology follow-up

Presentation: {patientName}, who has a prior vulvar HSIL, is evaluated for a new anal squamous intraepithelial lesion.

Patient identity/demographics: {"patientDisplayName":"Clinic Patient","prototypeDemographics":null}

Finite profiles (exact; none means none authored here):

```json
[]
```

Complete task: Which persistent infection is the shared oncogenic association?

**key shown first for review only.**

- **KEY** High-risk human papillomavirus (`hrhpv`). Existing rationale: (none authored)

- Herpes simplex virus type 2 (`hsv2`). Existing rationale: This does not match the exact approved answer.

- Epstein–Barr virus (`ebv`). Existing rationale: This does not match the exact approved answer.

Existing explanation: High-risk human papillomavirus

After-choice gate (not pre-answer): null

Context audit: Association recall in this context remains limited. The original approval is preserved; later header/task changes are not promoted to an approved exact version.

### question.anal-scc.biopsy-and-staging.v1

Inventory `inventory.838db25c3412474c`; verdict **Rewrite**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.biopsy-and-staging`; case `case.anal-squamous-cell-cancer.bleeding-lesion`; nodes `node.anal-squamous-cell-cancer.bleeding-lesion.1`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `74902fd668116d6a47dff7affce9df296f39932f56cf3cb3c23fd2267c7c104e`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The presentation already announces ordered CT and pelvic MRI alongside tissue evaluation; the key repeats the supplied plan.
- The key uniquely combines biopsy/staging while MRI alone, CEA and colonoscopy without lesion biopsy have weaker scope. ?Alone/without? wording announces omissions.
- Four siblings have the same objective/options and cosmetic complaint/age differences; all finite profiles and visible sequence were inspected.
- Rewrite one representative with actual specimen-provenance interpretation; retain its workup identity.

Replacement definitions: `question.topic.anal-cancer.sample-provenance.v1`.

#### Before ? retained source export

Node SHA-256 `485507bdc41178560a7d52b439ba862ef9df10294a4451486dcc6c5f3dbc2742`; full case SHA-256 `efde0022b1262450aa672ad4ce2890f6a45e9a722dbab696f16d1a607305e5bf`.

Complaint: I have bleeding and pain near my anus.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":59,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_1`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_1`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_1`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_1`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.1","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

#### Before ? current live clinic materialization

Node SHA-256 `485507bdc41178560a7d52b439ba862ef9df10294a4451486dcc6c5f3dbc2742`; full case SHA-256 `1b21bb53712f36840b41ec980624e061b6e00aa1f3261747d91e5fef0d32c843`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":59,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_1`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_1`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_1`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_1`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.1","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

### question.anal-scc.localized-chemoradiation-referral.v1

Inventory `inventory.cef13a4052a4a8b1`; verdict **Rewrite**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.localized-chemoradiation-referral`; case `case.anal-squamous-cell-cancer.bleeding-lesion`; nodes `node.anal-squamous-cell-cancer.bleeding-lesion.2`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `4d0d9764cfa7e1d1c788568fc82e634c6dc7835fca34d6b417bb8b44c403e4f2`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The prior returned result and update supply confirmed nonmetastatic canal SCC, then the question asks the standard referral association.
- Local-excision/radiation-alone choices are incomplete contrasts; primary APR is a wrong-stage foil. None creates a close current distribution or response decision.
- Four cosmetic siblings duplicate one treatment rule. Previous feedback supplies care phase; no accepted basic exception is recorded.
- Rewrite with a raw involved inguinal node and real named treatment pathways.

Replacement definitions: `question.topic.anal-cancer.regional-node-treatment.v1`.

#### Before ? retained source export

Node SHA-256 `f07f286e7469b1c972ecf55560e8e2c721c1c45a4c16777baa6d5030674e0be8`; full case SHA-256 `efde0022b1262450aa672ad4ce2890f6a45e9a722dbab696f16d1a607305e5bf`.

Complaint: I have bleeding and pain near my anus.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":59,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v1: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_1`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_1`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_1`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_1`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

#### Before ? current live clinic materialization

Node SHA-256 `f07f286e7469b1c972ecf55560e8e2c721c1c45a4c16777baa6d5030674e0be8`; full case SHA-256 `1b21bb53712f36840b41ec980624e061b6e00aa1f3261747d91e5fef0d32c843`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":59,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.59",
    "prototypeDemographics": {
      "ageYears": 59,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.female.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.bleeding-lesion.male.61",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v1: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_1`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_1`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_1`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_1`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

### question.anal-scc.biopsy-and-staging.v3

Inventory `inventory.9087f391e441a637`; verdict **Retire-and-replace**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.biopsy-and-staging`; case `case.anal-squamous-cell-cancer.clinic-exam`; nodes `node.anal-squamous-cell-cancer.clinic-exam.1`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `117869540130738d2096dabf55e9cfe9cbf8bbef5ae4e29e6e7ea97d3c9111f5`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The presentation already announces ordered CT and pelvic MRI alongside tissue evaluation; the key repeats the supplied plan.
- The key uniquely combines biopsy/staging while MRI alone, CEA and colonoscopy without lesion biopsy have weaker scope. ?Alone/without? wording announces omissions.
- Four siblings have the same objective/options and cosmetic complaint/age differences; all finite profiles and visible sequence were inspected.
- Propose retirement from future supply and replace with the specified supported diagnostic gap; all history and frozen definitions remain.

Replacement definitions: `question.topic.anal-cancer.new-nodule-after-hsil.v1`.

#### Before ? retained source export

Node SHA-256 `85da34ef193b2eb045320c32c0964bc1854975c22dfdce79914200c5f3209747`; full case SHA-256 `10b1ac27e256b53b5f9bb1a5ec65956c9e3faa638ca8e0fe48f92a0cfa400f5d`.

Complaint: I was told a lump near my anus needs more testing.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":54,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_3`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_3`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_3`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_3`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.3","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

#### Before ? current live clinic materialization

Node SHA-256 `85da34ef193b2eb045320c32c0964bc1854975c22dfdce79914200c5f3209747`; full case SHA-256 `e231a10d194780334a8a2bde53ce0d7c00b43f89fef729280bf4796ae2b96f44`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":54,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_3`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_3`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_3`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_3`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.3","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

### question.anal-scc.localized-chemoradiation-referral.v3

Inventory `inventory.026f4029f183ea3c`; verdict **Retire-and-replace**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.localized-chemoradiation-referral`; case `case.anal-squamous-cell-cancer.clinic-exam`; nodes `node.anal-squamous-cell-cancer.clinic-exam.2`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `ab19560dad8131faf8f68d52004aa5c9759a58f61c1c0fe0f5f9721cc142f378`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The prior returned result and update supply confirmed nonmetastatic canal SCC, then the question asks the standard referral association.
- Local-excision/radiation-alone choices are incomplete contrasts; primary APR is a wrong-stage foil. None creates a close current distribution or response decision.
- Four cosmetic siblings duplicate one treatment rule. Previous feedback supplies care phase; no accepted basic exception is recorded.
- Propose replacing duplicate future supply with a distinct margin, local-salvage, groin-salvage or systemic-line objective.

Replacement definitions: `question.topic.anal-cancer.salvage-local-failure.v1`.

#### Before ? retained source export

Node SHA-256 `afd79cd7991a630d900c06dcf00abfc45095476d1137e16d89d9780721ce891d`; full case SHA-256 `10b1ac27e256b53b5f9bb1a5ec65956c9e3faa638ca8e0fe48f92a0cfa400f5d`.

Complaint: I was told a lump near my anus needs more testing.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":54,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v3: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_3`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_3`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_3`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_3`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

#### Before ? current live clinic materialization

Node SHA-256 `afd79cd7991a630d900c06dcf00abfc45095476d1137e16d89d9780721ce891d`; full case SHA-256 `e231a10d194780334a8a2bde53ce0d7c00b43f89fef729280bf4796ae2b96f44`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":54,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.54",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.female.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.clinic-exam.male.56",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v3: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_3`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_3`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_3`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_3`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

### question.anal-scc.biopsy-and-staging.v2

Inventory `inventory.5b4551f22e8bd36c`; verdict **Retire-and-replace**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.biopsy-and-staging`; case `case.anal-squamous-cell-cancer.new-mass`; nodes `node.anal-squamous-cell-cancer.new-mass.1`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `a1fb9d5f0c7e12a24634d3f902baf100a96358b853d0995dc4406e1493ddf09a`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The presentation already announces ordered CT and pelvic MRI alongside tissue evaluation; the key repeats the supplied plan.
- The key uniquely combines biopsy/staging while MRI alone, CEA and colonoscopy without lesion biopsy have weaker scope. ?Alone/without? wording announces omissions.
- Four siblings have the same objective/options and cosmetic complaint/age differences; all finite profiles and visible sequence were inspected.
- Propose retirement from future supply and replace with the specified supported diagnostic gap; all history and frozen definitions remain.

Replacement definitions: `question.topic.anal-cancer.cytology-to-histology.v1`.

#### Before ? retained source export

Node SHA-256 `ba2326ef34fd246ca0fdd36eed4bd6156e9ed699e8c302e84a06d2887c67a63b`; full case SHA-256 `c9420d1383bf59af87923f0ea01745d0f433245905a2caf0544d6221af029fcc`.

Complaint: My bleeding and a new lump near my anus have not gone away.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":66,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_2`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_2`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_2`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_2`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.2","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

#### Before ? current live clinic materialization

Node SHA-256 `ba2326ef34fd246ca0fdd36eed4bd6156e9ed699e8c302e84a06d2887c67a63b`; full case SHA-256 `df8ba3714d199f58208b849212876b740301f18a239039e3c3f5c6b9e13d329b`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":66,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_2`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_2`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_2`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_2`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.2","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

### question.anal-scc.localized-chemoradiation-referral.v2

Inventory `inventory.83b81dd85e694a90`; verdict **Retire-and-replace**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.localized-chemoradiation-referral`; case `case.anal-squamous-cell-cancer.new-mass`; nodes `node.anal-squamous-cell-cancer.new-mass.2`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `1a1bf3a70850558fb9ced2a68ea9afc868e03c617d3b3787a6098c79218cadb6`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The prior returned result and update supply confirmed nonmetastatic canal SCC, then the question asks the standard referral association.
- Local-excision/radiation-alone choices are incomplete contrasts; primary APR is a wrong-stage foil. None creates a close current distribution or response decision.
- Four cosmetic siblings duplicate one treatment rule. Previous feedback supplies care phase; no accepted basic exception is recorded.
- Propose replacing duplicate future supply with a distinct margin, local-salvage, groin-salvage or systemic-line objective.

Replacement definitions: `question.topic.anal-cancer.clear-margin-observation.v1`, `question.topic.anal-cancer.adverse-margin-histology.v1`.

#### Before ? retained source export

Node SHA-256 `5c28d4be5bcca59f5463e0dab34d0b66293736c931f4e0129d888fd273eb888c`; full case SHA-256 `c9420d1383bf59af87923f0ea01745d0f433245905a2caf0544d6221af029fcc`.

Complaint: My bleeding and a new lump near my anus have not gone away.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":66,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v2: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_2`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_2`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_2`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_2`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

#### Before ? current live clinic materialization

Node SHA-256 `5c28d4be5bcca59f5463e0dab34d0b66293736c931f4e0129d888fd273eb888c`; full case SHA-256 `df8ba3714d199f58208b849212876b740301f18a239039e3c3f5c6b9e13d329b`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":66,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.66",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.female.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.new-mass.male.64",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v2: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_2`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_2`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_2`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_2`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

### question.anal-scc.biopsy-and-staging.v4

Inventory `inventory.573bff9b8ddc9586`; verdict **Retire-and-replace**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.biopsy-and-staging`; case `case.anal-squamous-cell-cancer.persistent-ulcer`; nodes `node.anal-squamous-cell-cancer.persistent-ulcer.1`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `6660fd5d2446fcffa5d0ebde0fb96d9a092631372c0268b8512b25f835f7272d`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The presentation already announces ordered CT and pelvic MRI alongside tissue evaluation; the key repeats the supplied plan.
- The key uniquely combines biopsy/staging while MRI alone, CEA and colonoscopy without lesion biopsy have weaker scope. ?Alone/without? wording announces omissions.
- Four siblings have the same objective/options and cosmetic complaint/age differences; all finite profiles and visible sequence were inspected.
- Propose retirement from future supply and replace with the specified supported diagnostic gap; all history and frozen definitions remain.

Replacement definitions: `question.topic.anal-cancer.confirm-local-recurrence.v1`.

#### Before ? retained source export

Node SHA-256 `7a497845f63611e86210f9cb9798b3b2f6c961bef238abf10f414b2b11e0c658`; full case SHA-256 `5609501f0114f7b72b6cad8b918f44245f1fdee7899679959e2f63545b3ec451`.

Complaint: I have bleeding and pain near my anus that has not healed.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":71,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_4`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_4`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_4`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_4`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.4","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

#### Before ? current live clinic materialization

Node SHA-256 `7a497845f63611e86210f9cb9798b3b2f6c961bef238abf10f414b2b11e0c658`; full case SHA-256 `bba49b2b62959866049c6f1ea7442214e6c7bd751a7f3db4039a39de622b7953`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":71,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Complete task: Which initial specialist evaluation should be arranged for {patientName}'s anal-canal lesion?

**key shown first for review only.**

- **KEY** Biopsy with ordered staging (`biopsy_staging_4`). Existing rationale: (none authored)

- Pelvic MRI alone (`mri_only_4`). Existing rationale: Imaging alone does not establish SCC.

- Serum CEA measurement (`cea_4`). Existing rationale: CEA does not confirm the lesion histology.

- Colonoscopy without lesion biopsy (`colonoscopy_4`). Existing rationale: Endoscopy without tissue sampling does not establish the anal lesion diagnosis.

Existing explanation: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

After-choice gate (not pre-answer): {"id":"gate.analscc.biopsy-staging.4","resultTypeId":"service.anal_lesion_biopsy_staging","pendingLabel":"External lesion biopsy and staging pending","resultNarrative":"Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.","readiness":"all","allowedServiceRouteIds":["route.anal_lesion_biopsy_staging.outsourced"]}

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

### question.anal-scc.localized-chemoradiation-referral.v4

Inventory `inventory.a14e4c11a79d7e7b`; verdict **Retire-and-replace**. Source `packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts` ? `ANAL_SQUAMOUS_CELL_CANCER_QUESTIONS`. Concept `concept.anal-scc.localized-chemoradiation-referral`; case `case.anal-squamous-cell-cancer.persistent-ulcer`; nodes `node.anal-squamous-cell-cancer.persistent-ulcer.2`.

Before content version `development-batch.2026-09-12.1`; question SHA-256 `3500227b2051c327d145c583faecd9d35ee908d51b9e8885c6d99e7eb342456d`. Approval: `none`; independent PASS: none. Recorded holds: none.

- The prior returned result and update supply confirmed nonmetastatic canal SCC, then the question asks the standard referral association.
- Local-excision/radiation-alone choices are incomplete contrasts; primary APR is a wrong-stage foil. None creates a close current distribution or response decision.
- Four cosmetic siblings duplicate one treatment rule. Previous feedback supplies care phase; no accepted basic exception is recorded.
- Propose replacing duplicate future supply with a distinct margin, local-salvage, groin-salvage or systemic-line objective.

Replacement definitions: `question.topic.anal-cancer.irradiated-groin-recurrence.v1`, `question.topic.anal-cancer.metastatic-first-systemic-line.v1`.

#### Before ? retained source export

Node SHA-256 `15297fec6b881368c24b9d3aeca65b9c7454c99579ca4b69f39349622a980442`; full case SHA-256 `5609501f0114f7b72b6cad8b918f44245f1fdee7899679959e2f63545b3ec451`.

Complaint: I have bleeding and pain near my anus that has not healed.

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":71,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v4: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_4`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_4`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_4`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_4`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

#### Before ? current live clinic materialization

Node SHA-256 `15297fec6b881368c24b9d3aeca65b9c7454c99579ca4b69f39349622a980442`; full case SHA-256 `bba49b2b62959866049c6f1ea7442214e6c7bd751a7f3db4039a39de622b7953`.

Complaint: Anal pain or bleeding

Presentation: {patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation.

Patient identity/demographics: {"patientDisplayName":"{patientName}","prototypeDemographics":{"ageYears":71,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.71",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.female.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  },
  {
    "id": "profile.anal-squamous-cell-cancer.persistent-ulcer.male.69",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "presentation": "{patientName} is stable after specialist examination identifies a suspicious lesion in the anal canal and no acute obstruction or systemic instability. The specialist has ordered CT of the chest, abdomen, and pelvis plus pelvic MRI alongside tissue evaluation."
  }
]
```

Earlier visible feedback:

- question.anal-scc.biopsy-and-staging.v4: Arrange tissue biopsy with CT chest/abdomen/pelvis and pelvic MRI for a suspicious anal-canal lesion.

Current update: Specialist biopsy confirms squamous cell carcinoma; CT of the chest, abdomen, and pelvis plus pelvic MRI show anal-canal disease without distant metastasis.

Complete task: With {patientName}'s confirmed nonmetastatic anal-canal SCC, which referral is appropriate?

**key shown first for review only.**

- **KEY** Definitive chemoradiation (`chemoradiation_4`). Existing rationale: (none authored)

- Schedule local excision alone (`local_excision_4`). Existing rationale: The case is anal-canal SCC, not the excluded small perianal-margin scenario.

- Radiotherapy alone (`observe_4`). Existing rationale: The constrained staged scenario calls for combined chemoradiation planning rather than radiotherapy alone.

- Abdominoperineal resection (`apr_4`). Existing rationale: Immediate surgery is not the broad intended first referral for this staged anal-canal scenario.

Existing explanation: Refer nonmetastatic anal-canal SCC after CT and pelvic MRI for definitive chemoradiation planning.

After-choice gate (not pre-answer): null

Context audit: Prior result/feedback rehearse the initial-treatment rule; ages/sex changes do not rescue reasoning.

### question.n3.anal-cancer-distant-staging-versus-local-extent.v1

Inventory `inventory.cac395652388ad5b`; verdict **Rewrite**. Source `packages/clinical-content/src/question-new-n3-20261105.ts` ? `QUESTION_NEW_N3_QUESTIONS`. Concept `concept.n3.anal-cancer-distant-staging-versus-local-extent`; case `case.n3.anal-cancer-distant-staging-versus-local-extent.v1`; nodes `node.n3.anal-cancer-distant-staging-versus-local-extent.v1`.

Before content version `clinical.question-new-n3.2026-11-05.v1`; question SHA-256 `21c80bdca2f9abb35f9d67960811cede67c91220259af0355b552db48b8dc54d`. Approval: `none`; independent PASS: none. Recorded holds: none.

- Presentation states the need for local anatomy and the task asks for local staging, leaving MRI as the only new relevant local investigation.
- The unrelated old hip radiograph is decorative. Definitive biopsy and completed CT make the other investigations weak foils; the added exhibit largely fails deletion.
- Rewrite the same local-versus-distant completeness objective with acquisition/archive/export evidence.

Replacement definitions: `question.topic.anal-cancer.local-staging-record.v1`.

#### Before ? retained source export

Node SHA-256 `c3d24e5cf026f454521d97550d12084c07a084211f2892bdb1f5eff800ff1833`; full case SHA-256 `ac0f9ceb8b823d06c7c8805f4aa3bd192592a6d866ec4f10a3e252d364a52600`.

Complaint: Anal treatment planning

Presentation: {patientName}, a 61-year-old man, attends the clinic after biopsy of an anal-canal lesion showed squamous carcinoma. A transferred summary says staging is complete because CT found no distant disease. The treatment team needs the local anatomy before final planning.

Patient identity/demographics: {"patientDisplayName":"Patrick Rowan","prototypeDemographics":{"ageYears":61,"sexLabel":"Male"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.n3.anal-cancer-distant-staging-versus-local-extent.v1",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Anal treatment planning",
    "presentation": "{patientName}, a 61-year-old man, attends the clinic after biopsy of an anal-canal lesion showed squamous carcinoma. A transferred summary says staging is complete because CT found no distant disease. The treatment team needs the local anatomy before final planning."
  }
]
```

```json
{
  "kind": "keyValue",
  "caption": "Original constructed teaching record; fictional patient observations",
  "items": [
    {
      "label": "Pathology",
      "value": "Anal-canal squamous cell carcinoma confirmed on representative biopsy."
    },
    {
      "label": "CT chest, abdomen and pelvis",
      "value": "No distant metastases; local report does not define sphincter and adjacent pelvic involvement."
    },
    {
      "label": "Other study attachment",
      "value": "Pelvic radiograph obtained for an old hip injury."
    },
    {
      "label": "Current treatment record",
      "value": "Diagnostic biopsy completed; definitive treatment planning visit pending."
    }
  ]
}
```

Complete task: Which investigation best completes {patientName}'s local staging for the treatment team?

**key shown first for review only.**

- **KEY** Magnetic resonance imaging of the pelvis (`choice.n3.anal-cancer-distant-staging-versus-local-extent.mri`). Existing rationale: The negative distant study does not replace the pelvic local-extent component.

- Computed tomography of the chest, abdomen and pelvis (`choice.n3.anal-cancer-distant-staging-versus-local-extent.ct`). Existing rationale: This repeats the completed distant-distribution question rather than defining the outstanding local anatomy.

- Repeat superficial biopsy of the anal lesion (`choice.n3.anal-cancer-distant-staging-versus-local-extent.biopsy`). Existing rationale: Histology is already established; another superficial sample does not supply the requested local extent.

Existing explanation: The biopsy establishes SCC and the CT addresses distant disease. The outstanding local-extent assessment is pelvic MRI. A pelvic radiograph is not the relevant staging modality. The subsequent treatment decision is made after complete staging; the question does not choose a radiation field or operation.

After-choice gate (not pre-answer): null

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

### question.n3.anal-cancer-distant-staging-versus-local-extent.v2

Inventory `inventory.a53e64c672c8ef3a`; verdict **Retire-and-replace**. Source `packages/clinical-content/src/question-new-n3-round2-20261105.ts` ? `QUESTION_NEW_N3_ROUND2_QUESTIONS`. Concept `concept.n3.anal-cancer-distant-staging-versus-local-extent.v2`; case `case.n3.anal-cancer-distant-staging-versus-local-extent.v1`; nodes `node.n3.anal-cancer-distant-staging-versus-local-extent.v1`.

Before content version `clinical.question-new-n3.2026-11-05.v2`; question SHA-256 `d872ada50d3dfa70f5eccb8d321bf49ff194b0960367d1930cbd74b88309f5b8`. Approval: `none`; independent PASS: none. Recorded holds: review.n3.anal-cancer-distant-staging-versus-local-extent.v2.

- The retained v2 initial-treatment item was returned REVISE/easy/twoStep false. ?Rather than on the perianal skin? and no prior pelvic radiation disclose boundaries or feasibility.
- The broad CRT key is defensible but duplicates four live variants and supplies site, diagnosis and stage before recall.
- Round-four hold review.n3.anal-cancer-distant-staging-versus-local-extent.v2 explicitly asks Melissa to decide the eight-week response-versus-salvage boundary; this remains unkeyed.
- Retire-and-replace is only a future-supply proposal. New confirmed local-failure salvage is a new construct, not a transfer of the held v2 history.

Replacement definitions: `question.topic.anal-cancer.salvage-local-failure.v1`.

#### Before ? retained source export

Node SHA-256 `f8ad416d5ee5cfa7aeb1bb16b5e01aa08c8f2ce426744c824e46edffa88c14dd`; full case SHA-256 `6a82f6e8e0f98add0df86dc9147c3c8ff0c07c490026756b7eddef18172fef00`.

Complaint: Anal treatment planning

Presentation: {patientName}, a 55-year-old woman, attends the colorectal clinic after biopsy of a bleeding anal-canal lesion. She is independently active and has not previously received pelvic radiation. Her completed staging studies are shown.

Patient identity/demographics: {"patientDisplayName":"Denise Walsh","prototypeDemographics":{"ageYears":55,"sexLabel":"Female"}}

Finite profiles (exact; none means none authored here):

```json
[
  {
    "id": "profile.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "prototypeDemographics": {
      "ageYears": 55,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Anal treatment planning",
    "presentation": "{patientName}, a 55-year-old woman, attends the colorectal clinic after biopsy of a bleeding anal-canal lesion. She is independently active and has not previously received pelvic radiation. Her completed staging studies are shown."
  }
]
```

```json
{
  "kind": "keyValue",
  "caption": "Original constructed teaching record; fictional patient observations",
  "items": [
    {
      "label": "Biopsy",
      "value": "Invasive squamous cell carcinoma."
    },
    {
      "label": "Examination",
      "value": "Lesion centered within the anal canal rather than on the perianal skin; continence preserved."
    },
    {
      "label": "Pelvic MRI",
      "value": "A 3.4-cm canal lesion extends into the sphincter complex without adjacent-organ invasion. No enlarged regional node is identified."
    },
    {
      "label": "CT chest/abdomen/pelvis",
      "value": "No distant metastasis identified."
    }
  ]
}
```

Complete task: Which initial treatment should {patientName} be offered?

**key shown first for review only.**

- **KEY** Definitive combined chemoradiation (`choice.n3r2.anal-cancer-distant-staging-versus-local-extent.crt`). Existing rationale: The anal-canal squamous primary remains nonmetastatic on completed staging. Sphincter involvement does not by itself convert it to a rectal-cancer resection problem; definitive chemoradiation is the supported broad initial path.

- Abdominoperineal resection (`choice.n3r2.anal-cancer-distant-staging-versus-local-extent.apr`). Existing rationale: This gives sphincter involvement an automatic operative consequence rather than applying the anal-canal squamous treatment pathway.

- Transanal local excision (`choice.n3r2.anal-cancer-distant-staging-versus-local-extent.local`). Existing rationale: The lesion's canal origin and represented sphincter extent are not a limited superficial local-lesion problem suited to this proposed operation.

Existing explanation: The completed assessment shows an anal-canal squamous primary without distant spread. The correct initial broad pathway is definitive chemoradiation, despite local sphincter involvement. Radical rectal-type surgery and limited transanal excision arise from different readings of the site and extent. No chemotherapy agents, radiation dose, staging cutoff or salvage indication is newly prescribed.

After-choice gate (not pre-answer): null

Context audit: The supplied workup or missing-local-study cue persists across finite profiles; a new contextual inference is required.

## Proposed after packets

**key shown first for review only.** Runtime decision nodes have `shuffleAnswers: true`. The legacy schema field `approvedInstantiationProfiles` does not confer clinical approval on these draft finite profiles. Clinical care remains an outside plan or record review; no new service request/result gate executes a test. Later records appear only at their own node.

### Case case.topic.anal-cancer.new-lesion.v1

Patient: **Evelyn Marsh**, 59, Female. Complaint: **Anal bleeding**.

Presentation: Evelyn Marsh, a 59-year-old woman, attends clinic for persistent bleeding from an anal lesion after an outside procedure.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These fields are separate. Case SHA-256 `cbf678a39bf6ee332b8b2f2e9068aaf00fb3355cc543e31ab4ac8bd34a1b8e33`.

Sequence: sample-provenance ? local-staging-record ? regional-node-treatment.

#### question.topic.anal-cancer.sample-provenance.v1

Node `node.topic.anal-cancer.sample-provenance.v1`; concept `concept.anal-scc.biopsy-and-staging` (reuse); previous concept `none`. Creation: Rewrite. Before: question.anal-scc.biopsy-and-staging.v1.

Question SHA-256 `6012b1666e086c08613bd396d85ad1717124d1f8c0d49b8f744904fd006808a8`; node SHA-256 `e2072205b5487961e67b70b1035680186b4375c333cdbf4d3b9c464607eb9972`.

Objective: Obtain representative tissue from a suspicious anal-canal lesion before interpreting a benign outside specimen as clearance.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Clinic examination",
      "value": "A firm, friable mass occupies the left lateral anal canal. A separate soft skin tag lies posterior to the anal verge."
    },
    {
      "label": "Outside procedure map",
      "value": "The excised specimen is labelled posterior perianal skin tag."
    },
    {
      "label": "Histology",
      "value": "The skin-tag specimen contains benign keratinized squamous epithelium and fibrous tissue."
    }
  ]
}
```

Complete task: **Which sampling procedure should the clinic arrange now for Evelyn Marsh’s bleeding anal lesion?**

**key shown first for review only.**

- **KEY** Anoscopy-guided biopsy of the canal mass (`choice.topic.anal-cancer.sample-provenance.mass`).

  - Feedback rationale: The benign posterior skin specimen does not represent the left canal mass. Obtain tissue from the unresolved lesion.

  - Temptation/error: Use the benign finding locally while checking which lesion was sampled.

  - Changed circumstance: A concerning posterior skin lesion would instead justify targeted posterior skin sampling.

  - Atomic claims: `claim.question-topic.anal-cancer.representative-tissue`, `claim.question-topic.anal-cancer.sampling-limits`. Timing: `timing.test.biopsy`.

- Anal cytology with HPV genotyping (`choice.topic.anal-cancer.sample-provenance.swab`).

  - Feedback rationale: A screening swab does not establish histology of this firm visible lesion.

  - Temptation/error: Choose a less invasive HPV assessment after seeing benign tissue.

  - Changed circumstance: Anal cytology can screen an eligible asymptomatic person with HIV rather than diagnose a mass.

  - Atomic claims: `claim.question-topic.anal-cancer.representative-tissue`, `claim.question-topic.anal-cancer.abnormal-cytology-hra`. Timing: `timing.test.pathology_review`.

- Deeper sections of the outside tissue block (`choice.topic.anal-cancer.sample-provenance.levels`).

  - Feedback rationale: Additional sections can reassess the submitted skin tissue but cannot sample the separate canal mass.

  - Temptation/error: Look for missed cancer in the existing block without reconciling its anatomic target.

  - Changed circumstance: If the block represented the suspicious lesion and retained relevant deeper tissue, additional sections could clarify an initially nondiagnostic sample.

  - Atomic claims: `claim.question-topic.anal-cancer.representative-tissue`, `claim.question-topic.anal-cancer.sampling-limits`. Timing: `timing.test.pathology_review`.

Post-answer explanation: The benign histology belongs to a different target. Obtain representative tissue from the canal mass; subsequent cancer staging depends on its diagnosis.

Supporting claims: `claim.question-topic.anal-cancer.representative-tissue`, `claim.question-topic.anal-cancer.sampling-limits`, `claim.question-topic.anal-cancer.abnormal-cytology-hra`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** Covered the key across header and specimen map. No field calls the mass cancer or says it was not sampled. Two anatomic targets replace the named omission; all options acquire or process diagnostic specimens and the key is not uniquely qualified.

2. **Stage/category:** Three diagnostic specimen approaches: acquire lesion tissue, repeat screening, or process existing tissue; no treatment foil.

3. **Two consequential steps:** Assign the benign report to the posterior skin specimen, separate from the left canal mass. Then Choose tissue from the unexplained lesion rather than screening or deeper sections of a different target.

4. **Difficulty prediction:** Moderate PGY-2/3 prediction from specimen provenance and screening-versus-diagnostic sampling; not measured or independently passed. Closest error: Treating benign tissue from one site as exclusion of disease at another palpable site. Consequence: A wrong-site interpretation delays diagnosis of the canal mass.

5. **One best answer:** Direct biopsy of the accessible unexplained mass resolves the current histology among the offered samples. Decider: Procedure map and current examination identify different anatomic lesions. Counterfactual: If the submitted block represented the suspicious lesion and contained unexamined relevant deeper tissue, additional sections could reasonably clarify its diagnosis; that is not the current wrong-target record.

Deletion pass:

- Deleting the specimen map removes the basis for locating the benign result.
- Deleting the mass-versus-tag distinction makes the biopsy target ambiguous.
- Name, age and short clinic frame are required patient context, not key discriminators.

Full-sequence check: First node. Neither later histology nor staging is visible. Feedback gives no later nodal classification or treatment regimen.

Repair and re-solve: Removed the already-ordered keyed workup and explicit missing-biopsy sentence. Final attack rejected repeat sampling of a soft benign tag as too weak; replaced it with credible deeper-block review and re-solved the target mismatch. All three diagnostic paths have estimates.

#### question.topic.anal-cancer.local-staging-record.v1

Node `node.topic.anal-cancer.local-staging-record.v1`; concept `concept.n3.anal-cancer-distant-staging-versus-local-extent` (reuse); previous concept `none`. Creation: Rewrite. Before: question.n3.anal-cancer-distant-staging-versus-local-extent.v1.

Question SHA-256 `7d910845bef2c7a2138ededb1bdfa3b785f9d4a260cdf0c3d42dea1960ea88c2`; node SHA-256 `20340a7b4bff69d3187ddfe4867221c7f01c1f87637ef4cc2b07d9ffcbd7180b`.

Objective: Distinguish completed distant staging from a usable local-staging assessment before treatment planning.

Current update: Biopsy of Evelyn’s canal mass now shows invasive squamous carcinoma.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Diagnostic CT chest, abdomen and pelvis",
      "value": "No distant lesion is identified. The interface between the anal mass and posterior vaginal wall is indistinct."
    },
    {
      "label": "MRI acquisition log",
      "value": "Dedicated pelvic T2 and diffusion series were completed. The archive contains the full series."
    },
    {
      "label": "Transferred MRI media",
      "value": "Contains scout/localizer images. No diagnostic pelvic series appears on the transferred media."
    }
  ]
}
```

Complete task: **Which step should the clinic arrange next to complete Evelyn Marsh’s pelvic staging review before treatment planning?**

**key shown first for review only.**

- **KEY** Specialist review of the archived pelvic MRI (`choice.topic.anal-cancer.local-staging-record.review`).

  - Feedback rationale: Local anatomy remains a planning question, but the diagnostic acquisition exists. Obtain and review it rather than equate incomplete transfer with an unperformed scan.

  - Temptation/error: Reconcile acquisition, storage and transferred-series records.

  - Changed circumstance: If the examination ended after localizers and the archive had no diagnostic series, dedicated MRI acquisition would be needed.

  - Atomic claims: `claim.question-topic.anal-cancer.mri-local`. Timing: `timing.test.general_diagnostic`.

- Repeat dedicated pelvic MRI acquisition (`choice.topic.anal-cancer.local-staging-record.repeat`).

  - Feedback rationale: The completed diagnostic series is retained in the archive; the current limitation is the transferred media.

  - Temptation/error: Infer that missing exported series were never acquired.

  - Changed circumstance: A technically incomplete or nondiagnostic original examination would justify a new acquisition.

  - Atomic claims: `claim.question-topic.anal-cancer.mri-local`. Timing: `timing.test.mri`.

- Obtain a new FDG PET/CT acquisition (`choice.topic.anal-cancer.local-staging-record.pet`).

  - Feedback rationale: Metabolic staging can complement standard studies but does not replace the acquired anatomic assessment of this interface.

  - Temptation/error: Substitute a new whole-body study for resolution of local anatomy.

  - Changed circumstance: An unresolved nodal or distant distribution question can justify complementary metabolic assessment.

  - Atomic claims: `claim.question-topic.anal-cancer.mri-local`, `claim.question-topic.anal-cancer.ct-distant`. Timing: `timing.test.pet_ct`.

Post-answer explanation: Local anatomy matters despite CT without distant disease. The full pelvic MRI was acquired and retained; transfer and specialist review resolve the current information gap without repeating acquisition.

Supporting claims: `claim.question-topic.anal-cancer.mri-local`, `claim.question-topic.anal-cancer.ct-distant`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** The task does not name a missing test. Two options share MRI and pelvic wording, so modality matching cannot select the key. All plans have timing proposals, including specialist review; no unique wait exemption cues the answer.

2. **Stage/category:** Three imaging-assessment steps: review an existing acquisition, repeat it, or acquire a different modality.

3. **Two consequential steps:** Recognize an unresolved local tumor–vaginal interface despite completed distant CT assessment. Then Distinguish missing exported series from an unperformed acquisition and use the retained diagnostic examination.

4. **Difficulty prediction:** Moderate to hard PGY-2/3 prediction from local-versus-distant scope plus acquisition-versus-export evidence. Closest error: Repeat MRI because the referral media contains only localizers. Consequence: Misreading transfer status adds unnecessary testing or leaves planning anatomy unresolved.

5. **One best answer:** The needed local acquisition exists in the archive, so obtaining specialist review is the justified next step. Decider: The scanner log and archive confirm completed diagnostic pelvic series. Counterfactual: If the log showed an examination stopped after localizers and no diagnostic series existed, repeat dedicated MRI becomes best.

Deletion pass:

- Without the log/archive rows retrieval cannot be ranked against repeat scanning.
- Without the CT interface finding the local anatomic planning consequence is less explicit.
- The media row establishes the actual information failure rather than an author conclusion.

Full-sequence check: Prior feedback only resolves tissue provenance. This feedback does not name inguinal staging or the next treatment answer.

Repair and re-solve: Removed the old hip radiograph and the statement that local staging is missing. Re-solved separate acquisition/archive/export observations; preserve the original N3 construct, not its held v2 treatment identity.

#### question.topic.anal-cancer.regional-node-treatment.v1

Node `node.topic.anal-cancer.regional-node-treatment.v1`; concept `concept.anal-scc.localized-chemoradiation-referral` (reuse); previous concept `none`. Creation: Rewrite. Before: question.anal-scc.localized-chemoradiation-referral.v1.

Question SHA-256 `0f15f2970de71c99f4830d3759b85aa8ca55b8821f08376f248ba1d1f2a159ef`; node SHA-256 `4f81ed8b67072b1f617368c53dd227ea003bc8104fb94d734d3de97b59a6381c`.

Objective: Select initial treatment after interpreting inguinal involvement as regional anal-cancer disease.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Biopsy",
      "value": "Invasive squamous carcinoma from the anal-canal mass."
    },
    {
      "label": "Pelvic MRI",
      "value": "A 4.2-cm canal primary involves the sphincter complex. Bladder, urethra and vaginal walls are separate from the mass."
    },
    {
      "label": "Left inguinal-node FNA",
      "value": "Squamous carcinoma matching the canal primary."
    },
    {
      "label": "Diagnostic CT chest, abdomen and pelvis",
      "value": "No other metastatic site identified."
    }
  ]
}
```

Complete task: **Which initial cancer treatment should be offered to Evelyn Marsh on the basis of these completed findings?**

**key shown first for review only.**

- **KEY** Radiation with concurrent fluorouracil and mitomycin (`choice.topic.anal-cancer.regional-node-treatment.crt`).

  - Feedback rationale: An involved inguinal node is regional disease. This untreated canal primary remains on a curative chemoradiation pathway.

  - Temptation/error: Integrate nodal geography and histology before choosing treatment intent.

  - Changed circumstance: Disseminated distant disease would shift the main pathway toward systemic treatment.

  - Atomic claims: `claim.question-topic.anal-cancer.inguinal-regional`, `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.crt-regimen`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Retifanlimab with carboplatin and paclitaxel (`choice.topic.anal-cancer.regional-node-treatment.systemic`).

  - Feedback rationale: This systemic option addresses inoperable recurrent or metastatic disease; the involved inguinal node does not establish distant spread.

  - Temptation/error: Call a node outside the mesorectum a distant metastasis.

  - Changed circumstance: Multiple biopsy-confirmed distant metastases without prior platinum would support a first-line systemic regimen.

  - Atomic claims: `claim.question-topic.anal-cancer.inguinal-regional`, `claim.question-topic.anal-cancer.first-line-retifanlimab`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Primary abdominoperineal resection with colostomy (`choice.topic.anal-cancer.regional-node-treatment.apr`).

  - Feedback rationale: Sphincter involvement in this newly treated squamous primary does not create the post-chemoradiation failure indication for APR.

  - Temptation/error: Import a rectal-resection rule or treat sphincter invasion as an automatic operation indication.

  - Changed circumstance: Confirmed resectable isolated canal recurrence after definitive chemoradiation can support salvage APR.

  - Atomic claims: `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.salvage-apr`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

Post-answer explanation: Inguinal spread is regional for anal SCC. A canal squamous primary without distant disease is treated with definitive chemoradiation using an established concurrent regimen; nodal positivity does not itself require a metastatic pathway or primary APR.

Supporting claims: `claim.question-topic.anal-cancer.inguinal-regional`, `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.crt-regimen`, `claim.question-topic.anal-cancer.first-line-retifanlimab`, `claim.question-topic.anal-cancer.salvage-apr`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** Raw site and sampling results replace a supplied nonmetastatic stage label. No lead-in term uniquely matches one plan. Each option is a real named cancer treatment; no alone/individualized or explanatory qualifier.

2. **Stage/category:** Three initial cancer-treatment pathways with shared background care.

3. **Two consequential steps:** Classify the sampled inguinal node as regional and retain the anal-canal squamous identity. Then Use that distribution and untreated phase to select curative concurrent chemoradiation.

4. **Difficulty prediction:** Moderate to hard PGY-2/3 prediction from nodal anatomy and treatment phase; replaces supplied diagnosis/stage followed by referral recall. Closest error: Choose metastatic systemic treatment because the involved inguinal node is outside the pelvis. Consequence: Misclassification diverts the patient from standard potentially curative local-regional treatment.

5. **One best answer:** The bulky node-positive untreated canal primary fits chemoradiation; a tiny superficial-lesion exception does not apply. Decider: The only secondary site is inguinal; diagnostic distant staging is otherwise clear. Counterfactual: Replace groin-only disease with multiple biopsy-confirmed hepatic metastases and the systemic combination becomes the main pathway.

Deletion pass:

- Delete the node site and regional-versus-distant intent is unresolved.
- Delete distant staging and disseminated disease may change intent.
- Primary site and histology prevent importing a rectal adenocarcinoma pathway.

Full-sequence check: Earlier nodes establish tissue and recover imaging but do not teach inguinal classification or name treatment. This node introduces the node sample and earns a separate decision.

Repair and re-solve: Removed explicit nonmetastatic labeling, local-excision caricatures and treatment-feasibility permissions. Re-solved three specific pathways.

### Case case.topic.anal-cancer.hsil.v1

Patient: **Daniel Mercer**, 48, Male. Complaint: **Anal screening review**.

Presentation: Daniel Mercer, a 48-year-old man living with HIV, attends clinic to review outside anal-screening results.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These fields are separate. Case SHA-256 `1c0761fe9bfac75b365cca6bfcd08fbd498d4a21ef92b42cbeca3472008c2d2c`.

Sequence: cytology-to-histology ? treat-intraepithelial-lesion ? new-nodule-after-hsil.

#### question.topic.anal-cancer.cytology-to-histology.v1

Node `node.topic.anal-cancer.cytology-to-histology.v1`; concept `concept.topic.anal-cancer.cytology-hra.v1` (new_meaning); previous concept `concept.anal-hsil.high-risk-hpv-association`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `4069aea3a8a155ed56bc79dc1662b99a9e09123dcd9e1f7cb97738017521bfb8`; node SHA-256 `1a50208a1564f85b455a7c8535a36d01184e98f646f447500859bf9f4ca7f70d`.

Objective: Use HRA-directed tissue assessment after abnormal anal cytology despite normal palpation in an adult with HIV.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Screening specimen",
      "value": "Anal swab with high-grade squamous cytologic abnormalities and oncogenic HPV detected."
    },
    {
      "label": "Current examination",
      "value": "No palpable anal lesion."
    },
    {
      "label": "Outside procedural record",
      "value": "Anal swab collection and digital examination; no anal tissue specimen submitted."
    }
  ]
}
```

Complete task: **Which diagnostic investigation should the clinic arrange next for Daniel Mercer’s anal-screening findings?**

**key shown first for review only.**

- **KEY** High-resolution anoscopy with directed biopsies (`choice.topic.anal-cancer.cytology-to-histology.hra`).

  - Feedback rationale: Cytology detects abnormal cells but does not supply tissue architecture. HRA identifies and samples flat lesions that need not be palpable.

  - Temptation/error: Connect specimen type with the limits of a normal examination.

  - Changed circumstance: If representative tissue already showed invasive cancer and local extent were unresolved, pelvic staging MRI would fit the next task.

  - Atomic claims: `claim.question-topic.anal-cancer.abnormal-cytology-hra`, `claim.question-topic.anal-cancer.normal-palpation`. Timing: `timing.test.biopsy`.

- Repeat anal cytology and HPV testing (`choice.topic.anal-cancer.cytology-to-histology.swab`).

  - Feedback rationale: Another swab does not resolve this high-grade screening result with histology.

  - Temptation/error: Use normal palpation to downgrade the abnormal screen.

  - Changed circumstance: Cytology can be used to screen an eligible asymptomatic person rather than replace evaluation of an already high-grade result.

  - Atomic claims: `claim.question-topic.anal-cancer.abnormal-cytology-hra`, `claim.question-topic.anal-cancer.normal-palpation`. Timing: `timing.test.pathology_review`.

- Pelvic MRI with local-staging sequences (`choice.topic.anal-cancer.cytology-to-histology.mri`).

  - Feedback rationale: The swab has not established invasive cancer; MRI does not replace lesion histology at this stage.

  - Temptation/error: Equate a high cytologic grade with a tissue diagnosis of invasive cancer.

  - Changed circumstance: Biopsy-established anal cancer requiring primary and pelvic-node assessment supports pelvic MRI.

  - Atomic claims: `claim.question-topic.anal-cancer.mri-local`, `claim.question-topic.anal-cancer.abnormal-cytology-hra`. Timing: `timing.test.mri`.

Post-answer explanation: The swab and palpation answer different questions. Abnormal cytologic screening requires HRA-directed histologic assessment; a nonpalpable lesion can still be present.

Supporting claims: `claim.question-topic.anal-cancer.abnormal-cytology-hra`, `claim.question-topic.anal-cancer.normal-palpation`, `claim.question-topic.anal-cancer.mri-local`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** The task requests a diagnostic investigation without naming HRA. Specimen provenance is a swab, not a biopsy. All testing choices have exact wait proposals. The key does not have a unique rationale or cautious qualifier in its label.

2. **Stage/category:** Three named diagnostic investigations, with no treatment or generic referral foil.

3. **Two consequential steps:** Identify cytology as screening and recognize that normal palpation does not clear flat epithelial disease. Then Obtain directed histology rather than repeat screening or skip to invasive-cancer staging.

4. **Difficulty prediction:** Moderate PGY-2/3 prediction from the conflict between specimen type and reassuring examination. HRA vocabulary alone is not claimed to make the item difficult. Closest error: Repeat the swab because there is no palpable tumor. Consequence: False reassurance delays histologic diagnosis of precursor disease or cancer.

5. **One best answer:** HRA-directed biopsy resolves the current abnormal screen among the three offered investigations. Decider: High-grade cells on an anal swab without tissue histology. Counterfactual: With biopsy-confirmed invasive SCC and unresolved local extent, pelvic MRI becomes the appropriate offered next-stage test.

Deletion pass:

- Without swab provenance the report could be mistaken for histology.
- Without normal palpation the main reassurance error is no longer tested.
- The procedural log establishes the actual specimen history instead of a named instruction to obtain biopsy.

Full-sequence check: First node. Feedback stops at histologic assessment and does not identify a lesion treatment or future follow-up finding.

Repair and re-solve: Removed the earlier proposed biopsy-confirmed HSIL premise, which skipped the diagnostic inference. Re-solved all three investigations.

#### question.topic.anal-cancer.treat-intraepithelial-lesion.v1

Node `node.topic.anal-cancer.treat-intraepithelial-lesion.v1`; concept `concept.topic.anal-cancer.hsil-treatment-hiv.v1` (new_meaning); previous concept `concept.anal-hsil.high-risk-hpv-association`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `a28ce18d9b9f2c7747373fef59750233b466268fafba7f71869b23bae99e93ed`; node SHA-256 `7f6dea32aa0d0d9fd5c28f35dd2d6d25dca622b8db3b753de436b5a4942a3d44`.

Objective: Treat biopsy-established anal HSIL in an adult with HIV rather than infer that virologic control removes its importance.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "HRA",
      "value": "Two accessible flat epithelial lesions; no indurated nodule."
    },
    {
      "label": "Both targeted biopsies",
      "value": "Full-thickness squamous atypia. The basement membrane is intact; represented subepithelial tissue contains no invasive nests."
    },
    {
      "label": "HIV care",
      "value": "Virologic suppression maintained on antiretroviral therapy."
    }
  ]
}
```

Complete task: **Which lesion-directed management should be offered to Daniel Mercer after these biopsy findings?**

**key shown first for review only.**

- **KEY** HRA-guided electrocautery ablation (`choice.topic.anal-cancer.treat-intraepithelial-lesion.ablate`).

  - Feedback rationale: The represented disease is intraepithelial. Treating HSIL in adults with HIV reduces cancer progression; electrocautery is a reasonable option for these accessible lesions.

  - Temptation/error: Separate absence of invasion from absence of a treatment indication.

  - Changed circumstance: An unbiopsied indurated lesion would require tissue assessment before ablation.

  - Atomic claims: `claim.question-topic.anal-cancer.hsil-intraepithelial`, `claim.question-topic.anal-cancer.treat-hsil-hiv`, `claim.question-topic.anal-cancer.hyfrecation`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Active monitoring with repeat HRA (`choice.topic.anal-cancer.treat-intraepithelial-lesion.monitor`).

  - Feedback rationale: Monitoring was a real competing strategy, but current HIV guidance recommends treatment of biopsy-confirmed HSIL. Virologic suppression does not replace lesion care.

  - Temptation/error: Read intact membrane and controlled HIV as grounds to wait for progression.

  - Changed circumstance: Ongoing HRA surveillance is appropriate after successful lesion treatment.

  - Atomic claims: `claim.question-topic.anal-cancer.treat-hsil-hiv`, `claim.question-topic.anal-cancer.post-hsil-hra`. Timing: `timing.test.clinical_procedure`.

- Fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.treat-intraepithelial-lesion.crt`).

  - Feedback rationale: The tissue shows intraepithelial disease rather than an invasive canal cancer; cancer chemoradiation would overtreat the represented lesions.

  - Temptation/error: Read full-thickness epithelial atypia as invasion through its boundary.

  - Changed circumstance: Representative tissue showing invasive anal-canal SCC with appropriate staging supports a cancer chemoradiation pathway.

  - Atomic claims: `claim.question-topic.anal-cancer.hsil-intraepithelial`, `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.crt-regimen`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

Post-answer explanation: Intact epithelial boundaries and represented stroma distinguish HSIL from invasive cancer. Treat these lesions despite virologic suppression; electrocautery is a supported option, not a proven superior modality.

Supporting claims: `claim.question-topic.anal-cancer.hsil-intraepithelial`, `claim.question-topic.anal-cancer.treat-hsil-hiv`, `claim.question-topic.anal-cancer.hyfrecation`, `claim.question-topic.anal-cancer.post-hsil-hra`, `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.crt-regimen`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** The report supplies epithelial and stromal observations without a diagnosis label or pre-answer cancer-prevention rule. The key is shortest. ART is shared background care, not attached to a uniquely complete option.

2. **Stage/category:** Three real management strategies: ablation, active HRA monitoring and invasive-cancer chemoradiation. Monitoring is the closest competitor.

3. **Two consequential steps:** Interpret the epithelial atypia with an intact membrane and represented negative stroma as intraepithelial disease. Then Use the HIV-specific treatment evidence to choose lesion treatment despite suppression.

4. **Difficulty prediction:** Moderate PGY-2/3 prediction requiring tissue architecture and post-ANCHOR evidence. No ranking among otherwise eligible ablative/topical treatments is claimed. Closest error: Equate no invasion plus controlled HIV with permission to observe untreated HSIL. Consequence: The error leaves a treatable precursor untreated or leads to invasive-cancer overtreatment.

5. **One best answer:** Electrocautery is the supported offered lesion treatment; effective topical/other ablative approaches are not declared inferior. Decider: Fully represented intraepithelial lesions in an adult with HIV match the treatment evidence. Counterfactual: Change the tissue to invasive stromal nests in a staged canal primary and chemoradiation becomes appropriate.

Deletion pass:

- Without represented subepithelial tissue, the biopsy may not resolve invasion fairly.
- Without HIV context, the strongest trial population no longer matches directly.
- Accessible focal lesions establish the proposed local-treatment setting.

Full-sequence check: Prior feedback says why tissue is needed, not how a confirmed precursor is treated. Feedback here does not state the next nodule’s target or a fixed next-test interval.

Repair and re-solve: Rejected an unsupported contest for the best ablation modality. Re-solved treatment versus genuine monitoring using architecture and HIV-specific evidence.

#### question.topic.anal-cancer.new-nodule-after-hsil.v1

Node `node.topic.anal-cancer.new-nodule-after-hsil.v1`; concept `concept.anal-scc.biopsy-and-staging` (reuse); previous concept `none`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `37050f827708ef9d7b0ab7c7e47bcb664bdbf0959381b689821e02ccfc6eb22e`; node SHA-256 `c470caf789d863a7615e4c404634894d68b8c673e8d8c450f627ca777b568ef3`.

Objective: Reassess a new palpable anal lesion after HSIL treatment despite a reassuring screening swab.

Current update: Six months after treatment, Daniel reports new focal pain.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Current examination",
      "value": "New indurated ulcerated anal-canal nodule."
    },
    {
      "label": "Anal cytology",
      "value": "No intraepithelial lesion or malignancy reported in the swab."
    },
    {
      "label": "Previous treatment",
      "value": "HRA-directed ablation of the two prior flat lesions; the present nodule is a new finding."
    }
  ]
}
```

Complete task: **Which diagnostic investigation should the clinic arrange for Daniel Mercer’s new anal nodule?**

**key shown first for review only.**

- **KEY** Anoscopy with directed biopsy of the nodule (`choice.topic.anal-cancer.new-nodule-after-hsil.sample`).

  - Feedback rationale: A negative screening swab does not establish the histology of a new suspicious palpable lesion. Sample the current target.

  - Temptation/error: Give the new clinical lesion priority over a reassuring screen.

  - Changed circumstance: With representative biopsy-confirmed SCC and unresolved local extent, MRI becomes a next-stage investigation.

  - Atomic claims: `claim.question-topic.anal-cancer.new-lesion-after-hsil`, `claim.question-topic.anal-cancer.representative-tissue`. Timing: `timing.test.biopsy`.

- Repeat anal cytology and HPV testing (`choice.topic.anal-cancer.new-nodule-after-hsil.swab`).

  - Feedback rationale: Another screening specimen does not diagnose this new indurated nodule.

  - Temptation/error: Use another swab to resolve a conflict requiring lesion tissue.

  - Changed circumstance: Screening belongs in asymptomatic surveillance when there is no suspicious current lesion.

  - Atomic claims: `claim.question-topic.anal-cancer.new-lesion-after-hsil`, `claim.question-topic.anal-cancer.post-hsil-hra`. Timing: `timing.test.pathology_review`.

- Pelvic MRI with local-staging sequences (`choice.topic.anal-cancer.new-nodule-after-hsil.mri`).

  - Feedback rationale: MRI can define extent later but does not replace tissue evaluation of the new lesion.

  - Temptation/error: Treat the nodule as known invasive cancer because HSIL was previously treated.

  - Changed circumstance: After tissue confirms invasive disease, pelvic MRI can inform local staging.

  - Atomic claims: `claim.question-topic.anal-cancer.mri-local`, `claim.question-topic.anal-cancer.representative-tissue`. Timing: `timing.test.mri`.

Post-answer explanation: The new lesion changes screening follow-up into a diagnostic problem. Obtain tissue despite the negative swab; treatment of different flat lesions does not settle this finding.

Supporting claims: `claim.question-topic.anal-cancer.new-lesion-after-hsil`, `claim.question-topic.anal-cancer.representative-tissue`, `claim.question-topic.anal-cancer.post-hsil-hra`, `claim.question-topic.anal-cancer.mri-local`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** No pre-answer field says needs biopsy. All options are investigations with wait proposals. The different target preserves chronology rather than naming a diagnosis. Negative cytology is purposeful conflicting evidence.

2. **Stage/category:** Three diagnostic investigations for the current lesion.

3. **Two consequential steps:** Recognize that negative screening and treatment of other lesions do not clear a new suspicious nodule. Then Obtain current lesion histology before choosing cancer staging or further dysplasia treatment.

4. **Difficulty prediction:** Moderate PGY-2/3 prediction from a conflicting negative screen and changed target. This is a new variant of the existing tissue-workup concept, not a new construct. Closest error: Let negative cytology and prior ablation overrule a newly palpable lesion. Consequence: Screening reassurance can delay recognition of invasive disease.

5. **One best answer:** Lesion biopsy answers unresolved current histology; the screen cannot establish that result. Decider: New induration and ulceration are unlike the earlier flat sampled lesions. Counterfactual: If representative tissue already showed SCC and local extent were unresolved, MRI becomes the appropriate offered next-stage test.

Deletion pass:

- Without the new lesion this becomes a different routine-surveillance problem.
- Without the negative swab the competing reassurance error loses its basis.
- Distinct target chronology prevents treating old tissue as a current result.

Full-sequence check: First node: abnormal screen with normal palpation. This node: negative screen with a new mass. Prior feedback supplies neither the new finding nor its conclusion; this encounter contains no repeated scored concept ID.

Repair and re-solve: Reused the existing workup identity to avoid concept inflation. Six months is a sourced follow-up setting, not a test turnaround or universal symptom deadline.

### Case case.topic.anal-cancer.margin-favorable.v1

Patient: **Paula Ellis**, 62, Female. Complaint: **Skin excision follow-up**.

Presentation: Paula Ellis, a 62-year-old woman, attends clinic after outside excision of a perianal skin lesion.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These fields are separate. Case SHA-256 `58fe4cde5e84b86da368bf75d286c4e3c29a878b920fad15289ce64e6bbb02b7`.

Sequence: clear-margin-observation.

#### question.topic.anal-cancer.clear-margin-observation.v1

Node `node.topic.anal-cancer.clear-margin-observation.v1`; concept `concept.topic.anal-cancer.margin-adjuvant-selection.v1` (new_meaning); previous concept `concept.anal-scc.localized-chemoradiation-referral`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `a2d23447a0b751957c6768f91ea46fbfad3ba26c2893a1906578bec9059fe268`; node SHA-256 `b621935c6a6d75370af1122ad58c199324b88f09174ec5e3ef3a1907e81d0d47`.

Objective: Choose postoperative care for a small anal-margin SCC using site, differentiation and clearance rather than a blanket canal pathway.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Operative map",
      "value": "The lesion was on hair-bearing perianal skin; anoscopy showed no mucosal extension. The excision did not enter sphincter muscle."
    },
    {
      "label": "Definitive specimen",
      "value": "1.4-cm invasive squamous carcinoma, well differentiated. No lymphovascular or perineural invasion reported. All margins are negative; nearest measured clearance is 12 mm."
    },
    {
      "label": "Regional and distant assessment",
      "value": "No suspicious groin or pelvic node; no distant metastasis identified."
    }
  ]
}
```

Complete task: **What should be planned next for Paula Ellis’s excised anal-margin squamous cancer?**

**key shown first for review only.**

- **KEY** Clinical and anoscopic surveillance (`choice.topic.anal-cancer.clear-margin-observation.follow`).

  - Feedback rationale: The small well-differentiated skin-based tumor has generous negative clearance and no nodal disease; further immediate cancer treatment is not required among these options.

  - Temptation/error: Apply the selected margin-lesion pathway rather than the cancer label in isolation.

  - Changed circumstance: Poorly differentiated histology with the same site and clearance would favor the offered chemoradiation plan.

  - Atomic claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.adverse-margin-histology`. Timing: `timing.test.clinical_procedure`.

- Wider perianal re-excision (`choice.topic.anal-cancer.clear-margin-observation.wider`).

  - Feedback rationale: Clearance is already generous and negative. More local resection does not address the actual treatment boundary in this record.

  - Temptation/error: Treat the invasive label or adverse histology as an unsolved local-clearance problem.

  - Changed circumstance: Gross residual disease or an involved edge creates a new clearance issue. The precise re-excision-versus-adjuvant ranking is held for clinical adjudication, not taught here.

  - Atomic claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.margin-disagreement-held`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.clear-margin-observation.crt`).

  - Feedback rationale: This adds treatment beyond the represented favorable, adequately excised skin-margin lesion; canal origin or an adverse histologic feature would change the judgment.

  - Temptation/error: Apply the usual anal-canal regimen to every anal-region squamous cancer.

  - Changed circumstance: The same lesion with poorly differentiated histology favors this cancer-treatment pathway.

  - Atomic claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.adverse-margin-histology`, `claim.question-topic.anal-cancer.crt-regimen`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

Post-answer explanation: The small skin-based, well-differentiated, node-negative SCC has generous negative clearance. Use surveillance rather than automatically treating it as a canal primary; no minimum margin cutoff is taught.

Supporting claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.adverse-margin-histology`, `claim.question-topic.anal-cancer.crt-regimen`, `claim.question-topic.anal-cancer.margin-disagreement-held`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** The task supplies no key-only preservation goal. All options are specific postoperative plans. Twelve millimeters is an observed specimen clearance, not a claimed universal rule; the report does not call the patient eligible for surveillance.

2. **Stage/category:** Three postoperative cancer-care plans, identical across independent sibling cases; no cautious diagnostic key against premature treatments.

3. **Two consequential steps:** Distinguish an adequately excised favorable skin-margin cancer from a canal primary. Then Apply the selected excision pathway to avoid unnecessary adjuvant treatment.

4. **Difficulty prediction:** Moderate PGY-2/3 prediction. A resident familiar with selected excision may find this easier; independent review must assess value rather than infer an accepted basic exception. Closest error: Apply routine canal chemoradiation to a favorable excised skin-margin tumor. Consequence: Avoidable chemoradiation or repeat local surgery.

5. **One best answer:** This lesion lies beyond disputed close-margin boundaries and has no canal extension, adverse differentiation or regional disease requiring added treatment among these choices. Decider: Well differentiation, skin origin, small size, generous clearance and no regional disease. Counterfactual: Change well to poor differentiation with everything else held constant and chemoradiation becomes best.

Deletion pass:

- Without the operative map canal versus skin origin is unresolved.
- Without differentiation the two sibling plans cannot be distinguished.
- Without clearance/nodal assessment another added-treatment indication could remain.
- Negative lymphovascular/perineural findings keep grade as the deliberate changed adverse feature.

Full-sequence check: Standalone sibling cases, never a fixed two-node sequence. One new stable construct with two consequential variants and opposite keys; no cosmetic name-only variant count.

Repair and re-solve: Rejected a close-margin contest because guidance differs. Used generous observed clearance and changed histology. Wider-excision counterfactual explicitly preserves the unresolved margin decision rather than ranking it.

### Case case.topic.anal-cancer.margin-poor.v1

Patient: **Renee Carter**, 57, Female. Complaint: **Skin excision follow-up**.

Presentation: Renee Carter, a 57-year-old woman, attends clinic after outside excision of a perianal skin lesion.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These fields are separate. Case SHA-256 `78d5a163ad2ab4fe1e254a69893f326a3aeaa32083143cd75a9b46b245c3ae8f`.

Sequence: adverse-margin-histology.

#### question.topic.anal-cancer.adverse-margin-histology.v1

Node `node.topic.anal-cancer.adverse-margin-histology.v1`; concept `concept.topic.anal-cancer.margin-adjuvant-selection.v1` (new_meaning); previous concept `concept.anal-scc.localized-chemoradiation-referral`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `dcca8ab29c3bee5229aac9bf1032a23db3529fbf8b7d31bd0596d9aa8c99a71d`; node SHA-256 `8e06bc453b06c33c00b1ce8da4be5bf57684e893fb9832dc4f828db7129cad9e`.

Objective: Choose postoperative care for a small anal-margin SCC using site, differentiation and clearance rather than a blanket canal pathway.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Operative map",
      "value": "The lesion was on hair-bearing perianal skin; anoscopy showed no mucosal extension. The excision did not enter sphincter muscle."
    },
    {
      "label": "Definitive specimen",
      "value": "1.6-cm invasive squamous carcinoma, poorly differentiated. No lymphovascular or perineural invasion reported. All margins are negative; nearest measured clearance is 12 mm."
    },
    {
      "label": "Regional and distant assessment",
      "value": "No suspicious groin or pelvic node; no distant metastasis identified."
    }
  ]
}
```

Complete task: **What should be planned next for Renee Carter’s excised anal-margin squamous cancer?**

**key shown first for review only.**

- **KEY** Fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.adverse-margin-histology.crt`).

  - Feedback rationale: Poor differentiation excludes this lesion from the selected excision pathway despite small size and generous negative clearance.

  - Temptation/error: Use differentiation as a treatment-selection feature rather than equating small size with favorable biology.

  - Changed circumstance: Change to well-differentiated histology with the same generous clearance and surveillance becomes appropriate.

  - Atomic claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.adverse-margin-histology`, `claim.question-topic.anal-cancer.crt-regimen`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Clinical and anoscopic surveillance (`choice.topic.anal-cancer.adverse-margin-histology.follow`).

  - Feedback rationale: Negative margins do not remove the adverse differentiation that puts this lesion outside the selected excision pathway.

  - Temptation/error: Use margin negativity as the only postoperative eligibility criterion.

  - Changed circumstance: Well-differentiated histology with the same generous clearance supports surveillance.

  - Atomic claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.adverse-margin-histology`. Timing: `timing.test.clinical_procedure`.

- Wider perianal re-excision (`choice.topic.anal-cancer.adverse-margin-histology.wider`).

  - Feedback rationale: Clearance is already generous and negative. More local resection does not address the actual treatment boundary in this record.

  - Temptation/error: Treat the invasive label or adverse histology as an unsolved local-clearance problem.

  - Changed circumstance: Gross residual disease or an involved edge creates a new clearance issue. The precise re-excision-versus-adjuvant ranking is held for clinical adjudication, not taught here.

  - Atomic claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.margin-disagreement-held`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

Post-answer explanation: Small size and negative margins do not make poorly differentiated anal-margin SCC a favorable excision case. Offer multidisciplinary chemoradiation planning rather than another clearance operation or surveillance.

Supporting claims: `claim.question-topic.anal-cancer.selected-margin-excision`, `claim.question-topic.anal-cancer.adverse-margin-histology`, `claim.question-topic.anal-cancer.crt-regimen`, `claim.question-topic.anal-cancer.margin-disagreement-held`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** Options match the favorable sibling and the key switches. No pre-answer sentence calls poor grade high-risk or explains its consequence. Small size and negative margins must be weighed against differentiation.

2. **Stage/category:** Three postoperative cancer-care plans, identical across independent sibling cases; no cautious diagnostic key against premature treatments.

3. **Two consequential steps:** Recognize adverse differentiation despite otherwise favorable site, size and clearance. Then Choose the cancer-treatment pathway instead of surveillance or another clearance operation.

4. **Difficulty prediction:** Moderate to hard PGY-2/3 prediction because favorable size/site/margins make surveillance credible, but grade changes the pathway. Closest error: Observe because diameter and margins look favorable. Consequence: An important adverse feature is ignored when selecting postoperative care.

5. **One best answer:** Poor grade excludes the selected excision pathway; generous clearance makes re-excision a poor response to the actual adverse feature. Decider: Poor differentiation despite small skin-based disease and 12-mm negative clearance. Counterfactual: Change poor to well differentiation with everything else held constant and surveillance becomes best.

Deletion pass:

- Without the operative map canal versus skin origin is unresolved.
- Without differentiation the two sibling plans cannot be distinguished.
- Without clearance/nodal assessment another added-treatment indication could remain.
- Negative lymphovascular/perineural findings keep grade as the deliberate changed adverse feature.

Full-sequence check: Standalone sibling cases, never a fixed two-node sequence. One new stable construct with two consequential variants and opposite keys; no cosmetic name-only variant count.

Repair and re-solve: Rejected a close-margin contest because guidance differs. Used generous observed clearance and changed histology. Wider-excision counterfactual explicitly preserves the unresolved margin decision rather than ranking it.

### Case case.topic.anal-cancer.local-recurrence.v1

Patient: **Maria Bennett**, 64, Female. Complaint: **Recurrent anal bleeding**.

Presentation: Maria Bennett, a 64-year-old woman, comes to clinic to review a new anal finding 18 months after definitive anal-cancer chemoradiation.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These fields are separate. Case SHA-256 `b18b89e9e55a799cc6c5386a0c279e7ab420c7d1f78298eb9491c6510a4b107e`.

Sequence: confirm-local-recurrence ? salvage-local-failure.

#### question.topic.anal-cancer.confirm-local-recurrence.v1

Node `node.topic.anal-cancer.confirm-local-recurrence.v1`; concept `concept.topic.anal-cancer.recurrence-confirmation.v1` (new_meaning); previous concept `concept.anal-scc.biopsy-and-staging`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `388d0aa7c38124cee05d85aebd91ca1fd8a5409904afb19039a99d9434e340b7`; node SHA-256 `9dd90cdd22e7558a9a0d3b1b61b8dfce1c69cade5771701c29c472c83d9f795f`.

Objective: Confirm viable tumor histologically when a new treated-site finding may otherwise be mistaken for scar.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Prior follow-up",
      "value": "Clinical complete response after definitive fluorouracil–mitomycin chemoradiation; later examinations documented a flat scar."
    },
    {
      "label": "Current examination",
      "value": "New firm nodule within the scar, with contact bleeding."
    },
    {
      "label": "Pelvic MRI",
      "value": "Dedicated diagnostic T2 and diffusion images show focal scar-site thickening. The report cannot separate viable tumor from treatment-related change."
    }
  ]
}
```

Complete task: **Which investigation should the clinic arrange next for Maria Bennett’s new post-treatment anal nodule?**

**key shown first for review only.**

- **KEY** Anoscopy-guided biopsy of the scar nodule (`choice.topic.anal-cancer.confirm-local-recurrence.tissue`).

  - Feedback rationale: The new clinical abnormality needs current histology before radical salvage; indeterminate imaging is not tissue proof of recurrence.

  - Temptation/error: Resolve the scar-versus-tumor discrepancy with tissue.

  - Changed circumstance: With biopsy-confirmed recurrence and undefined local extent, MRI becomes the next staging step.

  - Atomic claims: `claim.question-topic.anal-cancer.recurrence-histology`, `claim.question-topic.anal-cancer.representative-tissue`. Timing: `timing.test.biopsy`.

- Repeat pelvic MRI with diffusion imaging (`choice.topic.anal-cancer.confirm-local-recurrence.mri`).

  - Feedback rationale: The dedicated diagnostic examination already leaves viability uncertain; repeating it does not provide histology of this accessible target.

  - Temptation/error: Assume the current scan lacked the appropriate acquisition or that another image proves viability.

  - Changed circumstance: If the existing images were only localizers or nondiagnostic, a proper pelvic acquisition would be appropriate.

  - Atomic claims: `claim.question-topic.anal-cancer.mri-local`, `claim.question-topic.anal-cancer.recurrence-histology`. Timing: `timing.test.mri`.

- FDG PET/CT for metabolic reassessment (`choice.topic.anal-cancer.confirm-local-recurrence.pet`).

  - Feedback rationale: Metabolic findings can complement restaging but do not provide histologic confirmation before radical salvage of an accessible nodule.

  - Temptation/error: Substitute uptake for viable-tumor confirmation in an irradiated field.

  - Changed circumstance: Established recurrence with unresolved distant distribution can justify complementary PET/CT.

  - Atomic claims: `claim.question-topic.anal-cancer.ct-distant`, `claim.question-topic.anal-cancer.recurrence-histology`. Timing: `timing.test.pet_ct`.

Post-answer explanation: Change from a flat scar to a firm bleeding nodule matters, but it is not itself tissue proof of recurrence. Obtain histology before selecting radical salvage treatment.

Supporting claims: `claim.question-topic.anal-cancer.recurrence-histology`, `claim.question-topic.anal-cancer.representative-tissue`, `claim.question-topic.anal-cancer.mri-local`, `claim.question-topic.anal-cancer.ct-distant`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** No pre-answer field calls this recurrent SCC or instructs biopsy. All choices are investigations with wait proposals. Acquired sequences, not an unsupported adequate-scan label, establish the imaging scope.

2. **Stage/category:** Three investigations for uncertain current lesion viability; treatment choices belong to the later node.

3. **Two consequential steps:** Interpret newly acquired nodularity against the previously flat scar while recognizing indeterminate post-treatment imaging. Then Seek histologic confirmation before radical salvage rather than treat another image as tissue proof.

4. **Difficulty prediction:** Moderate PGY-2/3 prediction from post-treatment evidence limits and a credible repeat-imaging error. No early-response timing rule is scored. Closest error: Accept functional imaging as sufficient proof for major salvage surgery. Consequence: Radical treatment could be offered for unconfirmed recurrence, or true recurrence diagnosed late.

5. **One best answer:** Biopsy addresses current viable-tumor uncertainty in an accessible newly abnormal target. Decider: New palpable change with a completed indeterminate local MRI and no current lesion histology. Counterfactual: If biopsy already confirmed recurrence and the only pelvic images were localizers, dedicated pelvic MRI becomes the appropriate offered next-stage test.

Deletion pass:

- Without prior flat scar this could be stable post-treatment change.
- Without acquisition details repeat MRI may be a reasonable completion test.
- The indeterminate report explains why imaging has not settled tissue viability.

Full-sequence check: First node. Feedback says confirmation is needed but names no APR or later treatment. Subsequent pathology/restaging are not visible.

Repair and re-solve: Removed redundant PET uptake from the exhibit. Retained a new trajectory and completed local acquisition, then re-solved the three tests.

#### question.topic.anal-cancer.salvage-local-failure.v1

Node `node.topic.anal-cancer.salvage-local-failure.v1`; concept `concept.topic.anal-cancer.salvage-apr.v1` (new_meaning); previous concept `concept.anal-scc.localized-chemoradiation-referral`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `6d7f49be60a629d2b7b7b642d7d967e183e832efc82264453117b93be145e4c7`; node SHA-256 `b4c0aa6c0cee7cc837e528795d0659c94d8192990e08183f76fc4f407f7aa94e`.

Objective: Select salvage APR for confirmed resectable isolated local failure after definitive chemoradiation.

Current update: Maria remains independent in daily activities at her clinic follow-up.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Current biopsy",
      "value": "Invasive squamous carcinoma matching the original anal primary."
    },
    {
      "label": "Prior treatment",
      "value": "Completed definitive pelvic chemoradiation followed by a documented complete response."
    },
    {
      "label": "Current MRI",
      "value": "Tumor occupies the canal and sphincter complex. Pelvic sidewall planes are preserved; no adjacent-organ or nodal lesion described."
    },
    {
      "label": "CT chest, abdomen and pelvis",
      "value": "No distant metastatic lesion identified."
    }
  ]
}
```

Complete task: **Which cancer-treatment plan should now be recommended for Maria Bennett’s confirmed local failure?**

**key shown first for review only.**

- **KEY** Salvage abdominoperineal resection (`choice.topic.anal-cancer.salvage-local-failure.apr`).

  - Feedback rationale: This is confirmed isolated local failure in a previously irradiated primary with an anatomic basis for complete resection. APR is the standard salvage operative pathway.

  - Temptation/error: Use tissue, previous treatment and current distribution together.

  - Changed circumstance: Disseminated distant metastases would make systemic treatment the main pathway.

  - Atomic claims: `claim.question-topic.anal-cancer.salvage-apr`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Repeat definitive fluorouracil–mitomycin chemoradiation (`choice.topic.anal-cancer.salvage-local-failure.crt`).

  - Feedback rationale: That repeats the primary full definitive pathway after local failure. Selected reirradiation requires specialist planning and is not automatic repetition of initial treatment.

  - Temptation/error: Apply the initial treatment rule again without incorporating prior radiation and local failure.

  - Changed circumstance: An untreated nonmetastatic canal primary fits initial concurrent chemoradiation.

  - Atomic claims: `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.crt-regimen`, `claim.question-topic.anal-cancer.salvage-apr`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Retifanlimab with carboplatin and paclitaxel (`choice.topic.anal-cancer.salvage-local-failure.systemic`).

  - Feedback rationale: This systemic option addresses inoperable recurrent or metastatic disease. The confined failure has a standard potentially curative local salvage pathway.

  - Temptation/error: Read recurrent as synonymous with inoperable or metastatic.

  - Changed circumstance: Inoperable pelvic recurrence or disseminated metastases supports systemic oncology planning.

  - Atomic claims: `claim.question-topic.anal-cancer.salvage-apr`, `claim.question-topic.anal-cancer.first-line-retifanlimab`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

Post-answer explanation: This is a salvage decision after tissue-confirmed local failure. With no distant disease and preserved resection planes, recommend multidisciplinary salvage APR planning.

Supporting claims: `claim.question-topic.anal-cancer.salvage-apr`, `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.crt-regimen`, `claim.question-topic.anal-cancer.first-line-retifanlimab`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** No header or lead-in names the operation. Removed an author assertion that R0 is feasible and retained the observed planes. Each option is a specific treatment; the key is not uniquely cautious or comprehensive.

2. **Stage/category:** Three treatment plans after confirmation and restaging; no diagnostic information-gathering key.

3. **Two consequential steps:** Combine viable tumor, prior radiation and distant restaging to identify isolated local failure. Then Use the anatomic context to choose salvage APR instead of primary-regimen repetition or a systemic inoperable/metastatic pathway.

4. **Difficulty prediction:** Moderate to hard PGY-2/3 prediction distinguishing untreated disease, isolated local failure and systemic recurrence. Closest error: Choose metastatic systemic therapy simply because the tumor recurred. Consequence: A potentially curative local salvage plan can be replaced with the wrong treatment intent.

5. **One best answer:** The represented tissue/distribution fits standard salvage APR; multidisciplinary assessment of complete resection remains required. Decider: Biopsy-proven canal recurrence in a previously irradiated field, preserved sidewall planes and no distant lesion. Counterfactual: Disseminated biopsy-confirmed distant disease makes the offered systemic regimen the main pathway.

Deletion pass:

- Without prior radiation, initial chemoradiation can become correct.
- Without current tissue, radical salvage is premature.
- Without distant restaging or resection planes, inoperable/metastatic systemic planning may compete.

Full-sequence check: Prior feedback only establishes the need for histology. This node introduces confirmation and the new distribution/resection evidence, without reusing a taught treatment answer.

Repair and re-solve: Balanced choice scopes, removed a weak local-excision foil and replaced feasibility permission with observed planes before re-solving.

### Case case.topic.anal-cancer.groin-recurrence.v1

Patient: **Noah Reed**, 67, Male. Complaint: **Groin lump**.

Presentation: Noah Reed, a 67-year-old man, attends clinic to review an outside groin-node biopsy three years after treatment of anal-canal cancer.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These fields are separate. Case SHA-256 `2cded84cbfb482a09325d1ca5614890bde3a249314cb9ce8e922b69b00aa4618`.

Sequence: irradiated-groin-recurrence.

#### question.topic.anal-cancer.irradiated-groin-recurrence.v1

Node `node.topic.anal-cancer.irradiated-groin-recurrence.v1`; concept `concept.topic.anal-cancer.inguinal-salvage.v1` (new_meaning); previous concept `concept.anal-scc.localized-chemoradiation-referral`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `d2cf9d8658d01d6ea0c5ce10313bd149ddaaae9fb7d287019ea830eeb4f29111`; node SHA-256 `89eff2d8eb5201e90e3230f4f55088f0dafdc6df495e6644514bcf5c977f1ccc`.

Objective: Select regional salvage for isolated inguinal recurrence using primary-site status and prior radiation coverage.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Earlier treatment",
      "value": "Definitive chemoradiation for anal-canal SCC; the archived radiation plan includes both inguinal basins."
    },
    {
      "label": "Current node",
      "value": "A mobile right inguinal node contains squamous carcinoma matching the original tumor."
    },
    {
      "label": "Current anal assessment",
      "value": "Anoscopy and examination show the treated primary site remains clinically clear."
    },
    {
      "label": "Restaging CT and pelvic MRI",
      "value": "Disease is confined to the right inguinal node; no distant site or pelvic sidewall involvement identified."
    }
  ]
}
```

Complete task: **Which local-regional salvage plan should the clinic recommend for Noah Reed’s current anal-cancer recurrence?**

**key shown first for review only.**

- **KEY** Right inguinal lymph-node dissection (`choice.topic.anal-cancer.irradiated-groin-recurrence.dissect`).

  - Feedback rationale: The active target is an isolated node in a previously irradiated groin. Regional dissection addresses that target rather than removing a controlled primary.

  - Temptation/error: Use recurrence geography and the archived field to select salvage.

  - Changed circumstance: With no previous groin irradiation, chemoradiation to that region could become reasonable.

  - Atomic claims: `claim.question-topic.anal-cancer.irradiated-groin-salvage`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Salvage abdominoperineal resection (`choice.topic.anal-cancer.irradiated-groin-recurrence.apr`).

  - Feedback rationale: APR addresses local primary-site failure; the active target here is inguinal and the canal primary remains controlled.

  - Temptation/error: Apply recurrence-after-chemoradiation means APR without locating the recurrence.

  - Changed circumstance: Biopsy-proven isolated resectable canal-primary recurrence supports APR.

  - Atomic claims: `claim.question-topic.anal-cancer.irradiated-groin-salvage`, `claim.question-topic.anal-cancer.salvage-apr`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Definitive chemoradiation to the right groin (`choice.topic.anal-cancer.irradiated-groin-recurrence.groin-crt`).

  - Feedback rationale: The original field included this groin. Selected reirradiation remains specialist work; the offered standard salvage for an isolated operable irradiated nodal target is dissection.

  - Temptation/error: Treat the groin as an untreated region or repeat the original regional strategy automatically.

  - Changed circumstance: An isolated inguinal recurrence in an unirradiated groin can be treated with chemoradiation.

  - Atomic claims: `claim.question-topic.anal-cancer.irradiated-groin-salvage`, `claim.question-topic.anal-cancer.nonmetastatic-crt`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

Post-answer explanation: Recurrence geography matters. Nodal failure in a previously treated groin with primary-site control supports inguinal dissection planning rather than automatic repeat groin chemoradiation or APR.

Supporting claims: `claim.question-topic.anal-cancer.irradiated-groin-salvage`, `claim.question-topic.anal-cancer.salvage-apr`, `claim.question-topic.anal-cancer.nonmetastatic-crt`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** Both dissection and chemoradiation name the groin, so target-word matching cannot select the key. The archived field is a raw observation, not a declaration that all further radiation is forbidden. No unique consultation or caution phrase appears in the key.

2. **Stage/category:** Three concrete local-regional salvage treatments after confirmation/restaging.

3. **Two consequential steps:** Locate recurrence in the groin while retaining the controlled canal primary. Then Read original radiation coverage and select regional surgical salvage for the already irradiated basin.

4. **Difficulty prediction:** Hard PGY-2/3 prediction requiring both recurrence geography and previous field coverage. Extent of dissection and reirradiation eligibility remain specialist decisions. Closest error: Repeat groin chemoradiation without checking the original field. Consequence: Wrong field/location assumptions can repeat an unsuitable treatment plan or direct surgery at the controlled primary.

5. **One best answer:** An isolated mobile confirmed node in the irradiated basin supports dissection among these choices; no universal prohibition on reirradiation is asserted. Decider: Prior radiation included the involved basin and the primary is clinically clear. Counterfactual: Keep isolated inguinal recurrence but change the old plan to no groin irradiation: groin chemoradiation becomes a reasonable competing salvage route.

Deletion pass:

- Without the original field, the dissection-versus-chemoradiation discriminator disappears.
- Without primary control, concurrent local failure could make APR relevant.
- Without tissue and distant staging, this is not established isolated nodal salvage.

Full-sequence check: Standalone case, not immediately after an APR node in a fixed sequence. The task names the patient, phase and cancer context independently.

Repair and re-solve: Replaced a generic referral answer with named dissection, APR and groin chemoradiation. Rechecked that regional classification does not alone choose between groin options.

### Case case.topic.anal-cancer.distant-recurrence.v1

Patient: **Deirdre Lane**, 60, Female. Complaint: **Liver biopsy review**.

Presentation: Deirdre Lane, a 60-year-old woman, attends clinic to review outside records after anal-canal cancer treatment and discovery of liver lesions.

Setting clinic; educational tier 2; patient acuity stable; facility progression level 3; required capabilities none. These fields are separate. Case SHA-256 `1fce50a9e6946a3d6cbda59b17438bf75692bf8e218458c093a718ae33059436`.

Sequence: metastatic-first-systemic-line.

#### question.topic.anal-cancer.metastatic-first-systemic-line.v1

Node `node.topic.anal-cancer.metastatic-first-systemic-line.v1`; concept `concept.topic.anal-cancer.metastatic-line-selection.v1` (new_meaning); previous concept `concept.anal-scc.localized-chemoradiation-referral`. Creation: new. Before: **empty ? new question**.

Question SHA-256 `2ab2ad08267435a4e14194c9ef0eab96ac257a896df437d784fb9d75f0a675d3`; node SHA-256 `86ff806980e105c7e54701d985f4981094b2cede9d85646292834f1efc3ad832`.

Objective: Select initial metastatic systemic treatment without misclassifying earlier radiosensitizing chemotherapy as platinum-refractory treatment.

```json
{
  "kind": "keyValue",
  "caption": "Constructed clinic teaching record; fictional patient observations",
  "items": [
    {
      "label": "Previous treatment",
      "value": "Definitive pelvic radiation with fluorouracil and mitomycin. No platinum agent or checkpoint inhibitor was given."
    },
    {
      "label": "Current staging",
      "value": "Multiple lesions in both liver lobes and bilateral lung nodules. The treated anal primary remains clinically clear."
    },
    {
      "label": "Liver biopsy",
      "value": "Squamous carcinoma matching the previous anal-canal primary."
    },
    {
      "label": "Current function",
      "value": "Independent in daily activities."
    }
  ]
}
```

Complete task: **Which systemic treatment should be discussed with oncology for Deirdre Lane’s current metastatic anal-canal squamous cancer?**

**key shown first for review only.**

- **KEY** Retifanlimab with carboplatin and paclitaxel (`choice.topic.anal-cancer.metastatic-first-systemic-line.combo`).

  - Feedback rationale: This is initial systemic treatment of disseminated recurrence, not progression on platinum. The combination has a current US first-line indication in this setting.

  - Temptation/error: Interpret the actual previous drugs and treatment intent before assigning a line of therapy.

  - Changed circumstance: Progression on or intolerance to platinum can instead support retifanlimab monotherapy.

  - Atomic claims: `claim.question-topic.anal-cancer.first-line-retifanlimab`, `claim.question-topic.anal-cancer.post-platinum-monotherapy`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Retifanlimab monotherapy (`choice.topic.anal-cancer.metastatic-first-systemic-line.mono`).

  - Feedback rationale: The stated history does not meet the post-platinum progression/intolerance context. Prior fluorouracil–mitomycin chemoradiation is not platinum-refractory metastatic therapy.

  - Temptation/error: Read any prior chemotherapy as enough for a post-platinum monotherapy path.

  - Changed circumstance: Progression on platinum-based treatment or platinum intolerance supports the approved monotherapy indication.

  - Atomic claims: `claim.question-topic.anal-cancer.post-platinum-monotherapy`, `claim.question-topic.anal-cancer.first-line-retifanlimab`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

- Fluorouracil and mitomycin chemotherapy (`choice.topic.anal-cancer.metastatic-first-systemic-line.fu-mmc`).

  - Feedback rationale: This imports the prior radiosensitizing drugs as the systemic plan for disseminated recurrence.

  - Temptation/error: Reuse familiar anal-cancer drugs without accounting for current metastatic treatment intent.

  - Changed circumstance: Concurrent fluorouracil and mitomycin with radiation remains established for an appropriate untreated nonmetastatic primary.

  - Atomic claims: `claim.question-topic.anal-cancer.crt-regimen`, `claim.question-topic.anal-cancer.nonmetastatic-crt`, `claim.question-topic.anal-cancer.first-line-retifanlimab`. Timing: `no_test ? therapeutic plan, no diagnostic work requested`.

Post-answer explanation: Her earlier chemoradiation did not include platinum or treat this disseminated recurrence. Retifanlimab with carboplatin–paclitaxel is a supported first-line systemic option; monotherapy concerns platinum progression or intolerance.

Supporting claims: `claim.question-topic.anal-cancer.first-line-retifanlimab`, `claim.question-topic.anal-cancer.post-platinum-monotherapy`, `claim.question-topic.anal-cancer.crt-regimen`, `claim.question-topic.anal-cancer.nonmetastatic-crt`.

Five manual author checks ? author judgment, not independent PASS:

1. **Cover-the-key:** The task names systemic treatment because all choices are systemic drug plans, not a key-only FDA-approved property. Two options share retifanlimab. No dose, schedule, survival claim or invented contraindication supplies the answer.

2. **Stage/category:** Three named systemic drug plans for the current metastatic decision; no operation or vague referral foil.

3. **Two consequential steps:** Interpret disseminated biopsy-matched recurrence and distinguish previous radiosensitizing fluorouracil–mitomycin from platinum therapy. Then Choose a first-line metastatic combination rather than post-platinum monotherapy or recycling the local-regional regimen.

4. **Difficulty prediction:** Moderate to hard PGY-2/3 prediction from treatment-line interpretation and the current 2025 approval absent from the old PDQ summary. Closest error: Select monotherapy because she has already had chemotherapy. Consequence: Misread regimen and intent lead to the wrong line-specific systemic pathway.

5. **One best answer:** Distribution and stated history match the combination indication among offered plans. This is a US option, not mandatory therapy or an overall-survival superiority claim. Decider: The prior regimen was fluorouracil–mitomycin with radiation, not platinum progression/intolerance. Counterfactual: Replace the history with progression on platinum-based systemic therapy and no prior checkpoint inhibitor: retifanlimab monotherapy becomes an indicated next-line option.

Deletion pass:

- Without exact previous drugs, monotherapy cannot be ranked fairly.
- Without dissemination and biopsy match, local salvage or another primary remains possible.
- Independence is minimal treatment context; no fitness score or threshold is invented.

Full-sequence check: Standalone clinic chart-review case; no earlier drug question rehearses the line-specific answer. Previous treatment is completely stated here.

Repair and re-solve: Used the May 2025 FDA approval and May 2026 NCI drug page. Replaced a weak surgery foil with a credible post-platinum monotherapy error and re-solved all drug plans.

## Identity preservation, approvals and selection constraints

```json
{
  "stableReused": [
    {
      "id": "concept.anal-scc.biopsy-and-staging",
      "decision": "Representative tissue remains the diagnostic prerequisite in the same biopsy/staging family. New negative-swab follow-up is a variant, not a new meaning; manager checks construct fit before integration."
    },
    {
      "id": "concept.n3.anal-cancer-distant-staging-versus-local-extent",
      "decision": "Retain local-versus-distant usable staging completeness, now testing acquisition versus export. Do not reuse held v2 treatment construct."
    },
    {
      "id": "concept.anal-scc.localized-chemoradiation-referral",
      "decision": "Preserve initial nonmetastatic canal-SCC pathway; regional node interpretation is the consequential prerequisite."
    }
  ],
  "newMeaningProposals": [
    {
      "contentVersion": "question-topic.anal-cancer.2026-11-11.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.anal-cancer.cytology-hra.v1",
      "displayName": "Use HRA-directed tissue assessment after abnormal anal cytology despite normal palpation in an adult with HIV.",
      "learningObjective": "Use HRA-directed tissue assessment after abnormal anal cytology despite normal palpation in an adult with HIV.",
      "conceptType": "workup",
      "earliestFacilityStage": 3,
      "educationalTier": 2,
      "previousConceptId": "concept.anal-hsil.high-risk-hpv-association",
      "conceptRelation": "new_meaning",
      "evidenceClaimIds": [
        "claim.question-topic.anal-cancer.abnormal-cytology-hra",
        "claim.question-topic.anal-cancer.normal-palpation",
        "claim.question-topic.anal-cancer.mri-local"
      ]
    },
    {
      "contentVersion": "question-topic.anal-cancer.2026-11-11.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.anal-cancer.hsil-treatment-hiv.v1",
      "displayName": "Treat biopsy-established anal HSIL in an adult with HIV rather than infer that virologic control removes its importance.",
      "learningObjective": "Treat biopsy-established anal HSIL in an adult with HIV rather than infer that virologic control removes its importance.",
      "conceptType": "management",
      "earliestFacilityStage": 3,
      "educationalTier": 2,
      "previousConceptId": "concept.anal-hsil.high-risk-hpv-association",
      "conceptRelation": "new_meaning",
      "evidenceClaimIds": [
        "claim.question-topic.anal-cancer.hsil-intraepithelial",
        "claim.question-topic.anal-cancer.treat-hsil-hiv",
        "claim.question-topic.anal-cancer.hyfrecation",
        "claim.question-topic.anal-cancer.post-hsil-hra",
        "claim.question-topic.anal-cancer.nonmetastatic-crt",
        "claim.question-topic.anal-cancer.crt-regimen"
      ]
    },
    {
      "contentVersion": "question-topic.anal-cancer.2026-11-11.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.anal-cancer.inguinal-salvage.v1",
      "displayName": "Select regional salvage for isolated inguinal recurrence using primary-site status and prior radiation coverage.",
      "learningObjective": "Select regional salvage for isolated inguinal recurrence using primary-site status and prior radiation coverage.",
      "conceptType": "management",
      "earliestFacilityStage": 3,
      "educationalTier": 2,
      "previousConceptId": "concept.anal-scc.localized-chemoradiation-referral",
      "conceptRelation": "new_meaning",
      "evidenceClaimIds": [
        "claim.question-topic.anal-cancer.irradiated-groin-salvage",
        "claim.question-topic.anal-cancer.salvage-apr",
        "claim.question-topic.anal-cancer.nonmetastatic-crt"
      ]
    },
    {
      "contentVersion": "question-topic.anal-cancer.2026-11-11.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.anal-cancer.metastatic-line-selection.v1",
      "displayName": "Select initial metastatic systemic treatment without misclassifying earlier radiosensitizing chemotherapy as platinum-refractory treatment.",
      "learningObjective": "Select initial metastatic systemic treatment without misclassifying earlier radiosensitizing chemotherapy as platinum-refractory treatment.",
      "conceptType": "management",
      "earliestFacilityStage": 3,
      "educationalTier": 2,
      "previousConceptId": "concept.anal-scc.localized-chemoradiation-referral",
      "conceptRelation": "new_meaning",
      "evidenceClaimIds": [
        "claim.question-topic.anal-cancer.first-line-retifanlimab",
        "claim.question-topic.anal-cancer.post-platinum-monotherapy",
        "claim.question-topic.anal-cancer.crt-regimen",
        "claim.question-topic.anal-cancer.nonmetastatic-crt"
      ]
    },
    {
      "contentVersion": "question-topic.anal-cancer.2026-11-11.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.anal-cancer.margin-adjuvant-selection.v1",
      "displayName": "Choose postoperative care for a small anal-margin SCC using site, differentiation and clearance rather than a blanket canal pathway.",
      "learningObjective": "Choose postoperative care for a small anal-margin SCC using site, differentiation and clearance rather than a blanket canal pathway.",
      "conceptType": "management",
      "earliestFacilityStage": 3,
      "educationalTier": 2,
      "previousConceptId": "concept.anal-scc.localized-chemoradiation-referral",
      "conceptRelation": "new_meaning",
      "evidenceClaimIds": [
        "claim.question-topic.anal-cancer.selected-margin-excision",
        "claim.question-topic.anal-cancer.adverse-margin-histology",
        "claim.question-topic.anal-cancer.crt-regimen",
        "claim.question-topic.anal-cancer.margin-disagreement-held"
      ]
    },
    {
      "contentVersion": "question-topic.anal-cancer.2026-11-11.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.anal-cancer.recurrence-confirmation.v1",
      "displayName": "Confirm viable tumor histologically when a new treated-site finding may otherwise be mistaken for scar.",
      "learningObjective": "Confirm viable tumor histologically when a new treated-site finding may otherwise be mistaken for scar.",
      "conceptType": "workup",
      "earliestFacilityStage": 3,
      "educationalTier": 2,
      "previousConceptId": "concept.anal-scc.biopsy-and-staging",
      "conceptRelation": "new_meaning",
      "evidenceClaimIds": [
        "claim.question-topic.anal-cancer.recurrence-histology",
        "claim.question-topic.anal-cancer.representative-tissue",
        "claim.question-topic.anal-cancer.mri-local",
        "claim.question-topic.anal-cancer.ct-distant"
      ]
    },
    {
      "contentVersion": "question-topic.anal-cancer.2026-11-11.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.anal-cancer.salvage-apr.v1",
      "displayName": "Select salvage APR for confirmed resectable isolated local failure after definitive chemoradiation.",
      "learningObjective": "Select salvage APR for confirmed resectable isolated local failure after definitive chemoradiation.",
      "conceptType": "management",
      "earliestFacilityStage": 3,
      "educationalTier": 2,
      "previousConceptId": "concept.anal-scc.localized-chemoradiation-referral",
      "conceptRelation": "new_meaning",
      "evidenceClaimIds": [
        "claim.question-topic.anal-cancer.salvage-apr",
        "claim.question-topic.anal-cancer.nonmetastatic-crt",
        "claim.question-topic.anal-cancer.crt-regimen",
        "claim.question-topic.anal-cancer.first-line-retifanlimab"
      ]
    }
  ],
  "preservedApproval": {
    "id": "approval.melissa-rowland-md.owner-row-109.2026-08-31",
    "sourceRow": 109,
    "reviewer": "Melissa Rowland, MD",
    "reviewedOn": "2026-08-31",
    "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
    "approvedConceptIds": [
      "concept.anal-hsil.high-risk-hpv-association"
    ],
    "approvedPresentationVariantIds": [
      "presentation.anal-hsil.hpv.3a",
      "presentation.anal-hsil.hpv.3b",
      "presentation.anal-hsil.hpv.3c",
      "presentation.anal-hsil.hpv.3d"
    ],
    "approvedQuestionVariantIds": [
      "question.anal-hsil.hpv.3a.v1",
      "question.anal-hsil.hpv.3b.v1",
      "question.anal-hsil.hpv.3c.v1",
      "question.anal-hsil.hpv.3d.v1"
    ],
    "approvedEvidenceClaimIds": [],
    "approvedReleasePointIds": [
      "release.l0.clinic_evaluation"
    ],
    "runtimeAnswerShuffle": true,
    "decision": "approved",
    "recordFile": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
    "sourceSha256": "d0d467063de537b35945597e306fc3dac7eed431ed4db26cad790fd5030b2baa",
    "scopeLimitation": "Exact original approved question and presentation definitions only. Clinic materialization/header repair is separately captured and is not promoted to a new exact clinical approval."
  },
  "frozenIndependentPassReferences": [],
  "fsrsPolicy": "New meanings receive new IDs. Never transfer old association/initial-workup/initial-treatment history to new constructs. All original definitions, timing/order records and frozen encounters remain exact."
}
```

The initial N3 local-staging concept and its v2 treatment construct share a historical case/node identity but are separate meanings. The topic program records both. This sidecar preserves the local-staging identity and creates fresh IDs for response/salvage ideas; it never transfers held treatment history. All exact old definitions and timing/order records remain untouched.

- Only five topic files changed. No ship manifest, barrel, registry, runtime, selector, FSRS, saves or other-topic edit.
- Manager admits exact accepted tuples, concepts, cases, timing/order and source-link entries after independent review.
- All seven cases use existing clinic setting and no added capability. Oncology treatment is a plan/outside-record review, not executed infusion, radiation or operation.
- Three multi-node cases have paired-only sidecar coverage. All concepts must be unseen/due; a future-due companion can block selection. No case repeats a scored concept ID.
- The workup concept is reused across two different cases; no new FSRS construct for a negative-screen wrapper.
- No cross-topic scored companion is needed; rectal adenocarcinoma and benign anorectal treatment stay in their own lanes.
- Testing profiles are existing placeholders, with exact choice identities/labels. Specialist review uses general_diagnostic; cytology/HPV uses pathology_review; clinician/manager must confirm those scope mappings before registry admission. No fixed duration is in authored prose.
- Historical exact approvals and all prior versions remain intact; live repaired clinic contexts are separately captured, not newly approved.

## Atomic claims, sources and rights

Full records and exact source?claim?question mappings: [source ledger](sources-question-topic-anal-cancer-20261111.json). Claim IDs below refer to that ledger; field-level assertions and constructed-observation boundaries are in JSON `statementMappings`. Original source prose, excerpts, article text, figures, tables and algorithms are absent.

| Source ID | Citation / official link | Rights and authority boundary |
|---|---|---|

| source.question-topic.anal-cancer.nci-pdq-2025 | [Anal Cancer Treatment (PDQ?)?Health Professional Version](https://www.cancer.gov/types/anal/hp/anal-treatment-pdq). PDQ Adult Treatment Editorial Board. Anal Cancer Treatment (PDQ?)?Health Professional Version. National Cancer Institute. Updated February 12, 2025. Accessed November 11, 2026. | U.S. government text; third-party figures and AJCC tables excluded ? The 2025 summary predates the May 2025 metastatic-drug approval. No AJCC table, protected image, incidence percentage or exact radiation dose is reused. |

| source.question-topic.anal-cancer.seom-2026 | [SEOM?GEMCAD?TTD clinical guidelines for anal cancer (2025)](https://link.springer.com/article/10.1007/s12094-025-04163-x). Guillot Morales M, Fern?ndez Montes A, Fern?ndez-Plana J, Ghanem Ca?ete I, Gil Raga M, Jim?nez-Castro J, Juez Martel I, Maurel Santasusana J, Polo Marqu?s E, G?mez-Espa?a MA. SEOM?GEMCAD?TTD clinical guidelines for anal cancer (2025). Clinical and Translational Oncology. 2026;28:1138?1150. doi:10.1007/s12094-025-04163-x. Published February 7, 2026. Accessed November 11, 2026. | CC BY-NC-ND 4.0; targeted factual verification only; no adapted content ? European guidance. Exact excision-margin thresholds differ from US society guidance. Response sections contain differing start-versus-completion clock wording. Both differences are withheld from scored teaching. |

| source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026 | [Human Papillomavirus Disease: Adult and Adolescent Opportunistic Infections](https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-opportunistic-infections/human). Panel on Guidelines for the Prevention and Treatment of Opportunistic Infections in Adults and Adolescents With HIV. Human Papillomavirus Disease. NIH ClinicalInfo. Updated July 9, 2024; reviewed March 16, 2026. Accessed November 11, 2026. | U.S. federal clinical guidance; no figures or screening algorithms reproduced ? HIV-specific recommendations; not generalized to every transplant or HIV-negative population. ANCHOR did not compare treatment modalities. No screening-age algorithm is copied. |

| source.question-topic.anal-cancer.nysdoh-hsil-2025 | [Screening for Anal Dysplasia and Cancer in Adults With HIV](https://www.hivguidelines.org/guideline/hiv-anal-cancer/). Hirsch B; Vail RM, Shah SS, Fine SM, McGowan JP, Merrick ST, Radix AE, Monroe AK, Rodrigues J, Hoffmann CJ, Norton BL, Gonzalez CJ; Medical Care Criteria Committee. Screening for Anal Dysplasia and Cancer in Adults With HIV. NYSDOH AIDS Institute / Johns Hopkins University Clinical Guidelines Program. February 25, 2025. Web footer updated October 8, 2026. Accessed November 11, 2026. | Copyright Johns Hopkins University Clinical Guidelines Program; factual verification and citation only ? Six-month HRA follow-up is an A3 recommendation; comparison of alternative surveillance schedules is not proven. HIV population and trained HRA referral apply. |

| source.question-topic.anal-cancer.astro-summary-2025 | [ASTRO issues its first clinical guideline on radiation therapy for anal cancer](https://www.astro.org/news-and-publications/news-and-media-center/news-releases/2025/astro-issues-its-first-clinical-guideline-on-radiation-therapy-for-anal-cancer). American Society for Radiation Oncology. ASTRO issues its first clinical guideline on radiation therapy for anal cancer. Official guideline announcement. February 27, 2025. Accessed November 11, 2026. | Copyright ASTRO; targeted verification from official guideline summary ? Official summary, not the full guideline. Not used to infer exact dose, surgical margin, response interval or detailed eligibility. |

| source.question-topic.anal-cancer.nci-anchor-2022 | [In people with HIV, treating precancerous anal lesions cuts risk of anal cancer by more than half](https://www.cancer.gov/news-events/press-releases/2022/hiv-hsil-anal-cancer-anchor-study). National Cancer Institute. In people with HIV, treating precancerous anal lesions cuts risk of anal cancer by more than half. June 15, 2022. Reports Palefsky JM, Lee JY, Jay N, et al. N Engl J Med. 2022;386:2273?2282. doi:10.1056/NEJMoa2201048. Accessed November 11, 2026. | U.S. government trial summary; third-party illustration excluded ? Trial enrolled adults with HIV aged at least 35. Does not establish a superior modality, eliminate cancer risk after treatment or give a general screening policy. Historical 2022 screening-policy text is superseded. |

| source.question-topic.anal-cancer.ars-2019 | [Executive Summary of the American Radium Society Appropriate Use Criteria for Treatment of Anal Cancer](https://pmc.ncbi.nlm.nih.gov/articles/PMC11101015/). Russo S, Anker CJ, Abdel-Wahab M, Azad N, Bianchi N, Das P, Goodman KA, Jones W III, Kennedy T, Kumar R, Lee P, Sharma N, Small W Jr, Suh WW, Jabbour SK. Executive Summary of the American Radium Society Appropriate Use Criteria for Treatment of Anal Cancer. Int J Radiat Oncol Biol Phys. 2019;105(3):591?605. doi:10.1016/j.ijrobp.2019.06.2544. Author manuscript in PMC, available May 17, 2024. Accessed November 11, 2026. | Rights-reserved author manuscript; targeted society-guideline factual verification only ? Older than the 2025 ASTRO and 2026 SEOM guidance. PMC availability does not establish a permissive license. No rating matrix, table, figure or source language is copied. |

| source.question-topic.anal-cancer.fda-retifanlimab-2025 | [FDA approves retifanlimab-dlwr with carboplatin and paclitaxel and as a single agent for squamous cell carcinoma of the anal canal](https://www.fda.gov/drugs/cancer-approvals/fda-approves-retifanlimab-dlwr-carboplatin-and-paclitaxel-and-single-agent-squamous-cell-carcinoma). U.S. Food and Drug Administration. FDA approves retifanlimab-dlwr with carboplatin and paclitaxel and as a single agent for squamous cell carcinoma of the anal canal. May 15, 2025. Accessed November 11, 2026. | U.S. government approval announcement; no drug-label text reproduced ? US approval/line-of-therapy boundary; not a claim that every patient must receive this regimen or that overall-survival superiority was established. No doses, schedules or effect sizes are taught. |

| source.question-topic.anal-cancer.nci-retifanlimab-2026 | [Retifanlimab-dlwr](https://www.cancer.gov/about-cancer/treatment/drugs/retifanlimab-dlwr). National Cancer Institute. Retifanlimab-dlwr. Posted April 12, 2023; updated May 4, 2026. Accessed November 11, 2026. | U.S. government drug-information text; no label reproduction ? Same approval and trial evidence as FDA, not independent randomized corroboration. Does not supply comprehensive toxicity or eligibility assessment. |

| Claim ID | Independently written atomic fact | Sources | Certainty / limitation |
|---|---|---|---|

| claim.question-topic.anal-cancer.representative-tissue | A clinically suspicious anal lesion requires representative lesion tissue for diagnosis. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026 | moderate: Independent clinical review of this exact claim and its application is pending. |

| claim.question-topic.anal-cancer.sampling-limits | A biopsy result applies to the tissue sampled; an unsampled palpable lesion still requires evaluation. | source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026; source.question-topic.anal-cancer.nysdoh-hsil-2025 | moderate: The wrong-site fictional specimen comparison is an author application of lesion-directed assessment, not a quantified biopsy-sensitivity claim. |

| claim.question-topic.anal-cancer.mri-local | Pelvic MRI assesses primary anal-cancer extent and pelvic nodes for treatment planning. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | moderate: Independent clinical review of this exact claim and its application is pending. |

| claim.question-topic.anal-cancer.ct-distant | Thoracic and abdominal CT assess distant spread; a low-dose PET localization acquisition is not equivalent to diagnostic staging CT. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | moderate: PET/CT is complementary. The constructed acquisition log explicitly identifies which CT protocol was performed. |

| claim.question-topic.anal-cancer.inguinal-regional | Inguinal lymph-node involvement is regional nodal disease in anal squamous cancer. | source.question-topic.anal-cancer.nci-pdq-2025; source.question-topic.anal-cancer.ars-2019 | moderate: Independent clinical review of this exact claim and its application is pending. |

| claim.question-topic.anal-cancer.nonmetastatic-crt | Definitive chemoradiation is the usual curative pathway for nonmetastatic anal-canal squamous cancer. | source.question-topic.anal-cancer.nci-pdq-2025; source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.astro-summary-2025 | high: Selected very early lesions are exceptions; this claim is applied to a bulky node-positive primary, not a superficial excision candidate. |

| claim.question-topic.anal-cancer.crt-regimen | Concurrent fluorouracil and mitomycin with radiation is an established anal-cancer chemoradiation regimen. | source.question-topic.anal-cancer.astro-summary-2025; source.question-topic.anal-cancer.nci-pdq-2025 | high: Alternative regimens exist; no dose, toxicity-based substitution or radiation schedule is ranked. |

| claim.question-topic.anal-cancer.abnormal-cytology-hra | Abnormal anal screening results warrant HRA assessment with directed biopsy for histologic confirmation in adults with HIV. | source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026; source.question-topic.anal-cancer.nysdoh-hsil-2025 | moderate: Independent clinical review of this exact claim and its application is pending. |

| claim.question-topic.anal-cancer.normal-palpation | Normal digital examination does not exclude flat anal HSIL detectable with HRA. | source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026; source.question-topic.anal-cancer.nysdoh-hsil-2025 | moderate: Independent clinical review of this exact claim and its application is pending. |

| claim.question-topic.anal-cancer.hsil-intraepithelial | HSIL is intraepithelial neoplasia; stromal invasion establishes an invasive rather than solely intraepithelial lesion. | source.question-topic.anal-cancer.nci-pdq-2025; source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026 | moderate: Independent clinical review of this exact claim and its application is pending. |

| claim.question-topic.anal-cancer.treat-hsil-hiv | Treating biopsy-confirmed anal HSIL reduces anal-cancer progression in adults with HIV. | source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026; source.question-topic.anal-cancer.nysdoh-hsil-2025; source.question-topic.anal-cancer.nci-anchor-2022 | high: ANCHOR supports treatment versus monitoring in adults with HIV aged at least 35; sources discussing that trial are not counted as different trials. No extrapolation to all risk populations. |

| claim.question-topic.anal-cancer.hyfrecation | Office-based hyfrecation is a reasonable initial treatment for accessible anal HSIL in adults with HIV. | source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026; source.question-topic.anal-cancer.nysdoh-hsil-2025 | moderate: NIH supports this approach; ANCHOR did not establish superiority over other effective HSIL treatments. No ranking among otherwise eligible topical and ablative modalities. |

| claim.question-topic.anal-cancer.post-hsil-hra | NYSDOH recommends HRA six months after successful treatment of anal HSIL. | source.question-topic.anal-cancer.nysdoh-hsil-2025 | moderate: Single adequate guideline supports this exact six-month recommendation (A3). It is not a universal proven optimal surveillance interval. |

| claim.question-topic.anal-cancer.new-lesion-after-hsil | A new palpable anal lesion after HSIL treatment requires lesion-directed evaluation despite reassuring screening cytology. | source.question-topic.anal-cancer.nysdoh-hsil-2025; source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026 | moderate: This is a symptomatic lesion-evaluation decision, not an empirically established negative-test threshold. |

| claim.question-topic.anal-cancer.selected-margin-excision | Small, well-differentiated, node-negative anal-margin cancers may be treated by margin-negative local excision without sphincter injury. | source.question-topic.anal-cancer.nci-pdq-2025; source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | moderate: Limited comparative evidence. The drafted favorable lesion is wholly skin-based; an exact minimum margin is not taught and adequate proposed clearance is deliberately beyond disputed boundaries. |

| claim.question-topic.anal-cancer.adverse-margin-histology | Poorly differentiated anal-margin squamous cancer is unsuitable for a local-excision treatment pathway. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.astro-summary-2025 | moderate: SEOM directly names poor differentiation; ASTRO summary supports selected excision only without higher-risk histology but supplies no granular threshold. Clinical ranking requires review. |

| claim.question-topic.anal-cancer.recurrence-histology | Suspected residual or recurrent anal cancer should be confirmed histologically before radical salvage surgery. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | moderate: Independent clinical review of this exact claim and its application is pending. |

| claim.question-topic.anal-cancer.salvage-apr | Resectable local anal-canal recurrence after chemoradiation without distant spread is a standard indication for salvage APR. | source.question-topic.anal-cancer.nci-pdq-2025; source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | moderate: Multidisciplinary review and an achievable complete resection matter; reirradiation and systemic approaches have selected roles, not blanket exclusion. |

| claim.question-topic.anal-cancer.irradiated-groin-salvage | Isolated inguinal nodal recurrence in a previously irradiated groin can be managed with inguinal node dissection. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | moderate: Recommendation is drawn from specialist consensus and limited data; no dissection extent, wound reconstruction, survival estimate or universal reirradiation prohibition is asserted. |

| claim.question-topic.anal-cancer.first-line-retifanlimab | FDA approved retifanlimab with carboplatin and paclitaxel for first-line inoperable recurrent or metastatic anal-canal squamous cancer. | source.question-topic.anal-cancer.fda-retifanlimab-2025; source.question-topic.anal-cancer.nci-retifanlimab-2026 | high: Same regulatory evidence, not two independent trials. A supported US option among the offered regimens; complete individualized oncology eligibility is outside the question. |

| claim.question-topic.anal-cancer.post-platinum-monotherapy | Retifanlimab monotherapy has an FDA indication after platinum progression or intolerance in recurrent or metastatic anal-canal squamous cancer. | source.question-topic.anal-cancer.fda-retifanlimab-2025; source.question-topic.anal-cancer.nci-retifanlimab-2026 | high: Do not confuse earlier fluorouracil?mitomycin radiosensitization with progression on platinum therapy. |

| claim.question-topic.anal-cancer.response-clock-held | Response may continue through 26 weeks from chemoradiation initiation when there is no progression. | source.question-topic.anal-cancer.ars-2019; source.question-topic.anal-cancer.seom-2026 | moderate: WITHHELD from scored use. SEOM response section uses treatment initiation, while another follow-up paragraph says after therapy; preserve the clock discrepancy and the owner eight-week hold. |

| claim.question-topic.anal-cancer.progression-biopsy-held | Documented progression during post-chemoradiation response assessment warrants prompt evaluation and biopsy. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | moderate: Only a boundary for the unkeyed owner hold; no new fixed biopsy interval is inferred. |

| claim.question-topic.anal-cancer.margin-disagreement-held | Society guidance differs on adequate anal-margin excision clearance and management of close margins. | source.question-topic.anal-cancer.seom-2026; source.question-topic.anal-cancer.ars-2019 | conflicting: WITHHELD: SEOM discusses greater than 1 mm histologic clearance; older US ARS discusses greater than 1 cm adequate clearance and re-excision. These are not silently equated, averaged or taught as a universal threshold. |

| claim.question-topic.anal-cancer.oncogenic-hpv | Persistent oncogenic HPV contributes to anal squamous neoplasia; HIV modifies risk rather than serving as the causal virus. | source.question-topic.anal-cancer.nih-hpv-oi-2024-reviewed-2026; source.question-topic.anal-cancer.nci-anchor-2022 | high: Fresh independent fact check does not alter or broaden the exact 2026-08-31 approvals. |

Excluded and limited sources:

```json
[
  {
    "id": "excluded.question-topic.anal-cancer.nccn",
    "url": "https://www.nccn.org/professionals/physician_gls/pdf/anal.pdf",
    "reason": "No NCCN PDF or third-party mirror ingested. Rights and AI restrictions are not established for this use; PMC or public snippets are not permission."
  },
  {
    "id": "excluded.question-topic.anal-cancer.ahrq-software",
    "url": "https://www.ncbi.nlm.nih.gov/books/NBK608904/",
    "reason": "Government-hosted report expressly requires written permission for incorporation into software. Not used as a question evidence source; no report expression or data incorporated."
  },
  {
    "id": "excluded.question-topic.anal-cancer.cdc-2021-hsil",
    "url": "https://www.cdc.gov/std/treatment-guidelines/hpv-cancer.htm",
    "reason": "The 2021 page describes ANCHOR as ongoing and limited treatment evidence. Not used to overrule newer 2024 federal guidance after the completed trial."
  },
  {
    "id": "excluded.question-topic.anal-cancer.elsevier-full-guidelines",
    "url": "https://www.practicalradonc.org/article/S1879-8500(25)00020-7/fulltext",
    "reason": "Full publisher guideline not ingested; exact rights/AI conditions not established. Official ASTRO public summary supplies only targeted broad facts."
  },
  {
    "id": "excluded.question-topic.anal-cancer.german-summary",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8572542/",
    "reason": "Consulted discovery/metadata; no permissive article license identified. Not used in the authored claims; targeted society sources already support the held clock boundary."
  }
]
```

- NIH, NYSDOH and NCI ANCHOR discussion share the ANCHOR trial. They do not constitute separate randomized replications.
- FDA and the NCI drug page describe one 2025 approval and its underlying trials.
- Distinct society consensus documents can share underlying studies. No exact testing-frequency or outcome probability is asserted.

All new claims checked 2026-11-11; reused historical approvals retain their original dates. Local mapping checks are separately recorded. No fresh retrieval or independent trial is invented from a second ID.

## Local timing/order proposals and safe source links

Eighteen testing-choice proposals cover keys and distractors using existing placeholder profiles. Specialist archived-MRI review uses general_diagnostic; swab cytology/HPV and additional pathology sections use pathology_review. These generic scope mappings need manager confirmation before integration. Therapeutic surgery, radiation and drug plans have no diagnostic execution request. No fixed turnaround appears in authored prose.

| Question | Choice identity | Exact label | Profile | Execution |
|---|---|---|---|---|

| question.topic.anal-cancer.sample-provenance.v1 | choice.topic.anal-cancer.sample-provenance.mass | Anoscopy-guided biopsy of the canal mass | timing.test.biopsy | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.sample-provenance.v1 | choice.topic.anal-cancer.sample-provenance.swab | Anal cytology with HPV genotyping | timing.test.pathology_review | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.sample-provenance.v1 | choice.topic.anal-cancer.sample-provenance.levels | Deeper sections of the outside tissue block | timing.test.pathology_review | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.local-staging-record.v1 | choice.topic.anal-cancer.local-staging-record.review | Specialist review of the archived pelvic MRI | timing.test.general_diagnostic | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.local-staging-record.v1 | choice.topic.anal-cancer.local-staging-record.repeat | Repeat dedicated pelvic MRI acquisition | timing.test.mri | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.local-staging-record.v1 | choice.topic.anal-cancer.local-staging-record.pet | Obtain a new FDG PET/CT acquisition | timing.test.pet_ct | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.cytology-to-histology.v1 | choice.topic.anal-cancer.cytology-to-histology.hra | High-resolution anoscopy with directed biopsies | timing.test.biopsy | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.cytology-to-histology.v1 | choice.topic.anal-cancer.cytology-to-histology.swab | Repeat anal cytology and HPV testing | timing.test.pathology_review | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.cytology-to-histology.v1 | choice.topic.anal-cancer.cytology-to-histology.mri | Pelvic MRI with local-staging sequences | timing.test.mri | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.treat-intraepithelial-lesion.v1 | choice.topic.anal-cancer.treat-intraepithelial-lesion.monitor | Active monitoring with repeat HRA | timing.test.clinical_procedure | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.new-nodule-after-hsil.v1 | choice.topic.anal-cancer.new-nodule-after-hsil.sample | Anoscopy with directed biopsy of the nodule | timing.test.biopsy | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.new-nodule-after-hsil.v1 | choice.topic.anal-cancer.new-nodule-after-hsil.swab | Repeat anal cytology and HPV testing | timing.test.pathology_review | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.new-nodule-after-hsil.v1 | choice.topic.anal-cancer.new-nodule-after-hsil.mri | Pelvic MRI with local-staging sequences | timing.test.mri | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.clear-margin-observation.v1 | choice.topic.anal-cancer.clear-margin-observation.follow | Clinical and anoscopic surveillance | timing.test.clinical_procedure | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.adverse-margin-histology.v1 | choice.topic.anal-cancer.adverse-margin-histology.follow | Clinical and anoscopic surveillance | timing.test.clinical_procedure | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.confirm-local-recurrence.v1 | choice.topic.anal-cancer.confirm-local-recurrence.tissue | Anoscopy-guided biopsy of the scar nodule | timing.test.biopsy | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.confirm-local-recurrence.v1 | choice.topic.anal-cancer.confirm-local-recurrence.mri | Repeat pelvic MRI with diffusion imaging | timing.test.mri | not_executed / future_planned; no service/gate |

| question.topic.anal-cancer.confirm-local-recurrence.v1 | choice.topic.anal-cancer.confirm-local-recurrence.pet | FDG PET/CT for metabolic reassessment | timing.test.pet_ct | not_executed / future_planned; no service/gate |

All nine external source links use `target="_blank"`, `rel="noopener noreferrer"`, `referrerPolicy="no-referrer"`. No runtime network or AI call is introduced. Full exact tuple/label timing classifications, including no-test alternatives, are in JSON `timingProposals`.

## Held/unkeyed and withheld ledger

Planning dispositions are outside scored-question verdict totals. No eight-week response key or close-margin key was emitted.

```json
[
  {
    "id": "hold.topic.anal-cancer.early-response-eight-weeks",
    "inheritedHoldId": "review.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "status": "unkeyed_owner_decision_preserved",
    "beforeVariantId": "question.n3.anal-cancer-distant-staging-versus-local-extent.v2",
    "originalDecisionVariantSha256": "173e96c9fbc033644703e829dbf8bf134a3ab1757ebf829dfe6c8bf39bdd4f51",
    "recordFile": "docs/research/question-new-n3-round4-20261110.json",
    "constructedClinicFrame": "Patrick Rowan, a 61-year-old man, attends clinic for review of outside response examinations after anal-cancer chemoradiation.",
    "chiefComplaint": "Treatment response review",
    "observations": [
      "Eight weeks after COMPLETION of chemoradiation, serial examinations show continued lesion shrinkage.",
      "A small ulcer remains; no enlarging mass, new node or worsening symptoms."
    ],
    "competingActions": [
      "Repeat clinical response assessment",
      "Anoscopy-guided biopsy now",
      "Salvage abdominoperineal resection"
    ],
    "isCorrect": null,
    "questionVariantId": null,
    "evidenceClaimIds": [
      "claim.question-topic.anal-cancer.response-clock-held",
      "claim.question-topic.anal-cancer.progression-biopsy-held"
    ],
    "reason": "Fresh research does not resolve an explicit owner hold. The 26-week evidence clock starts at INITIATION; the held vignette uses completion. No scored key is emitted.",
    "nextAction": "Melissa endorses the exact response/biopsy/APR boundary and its clock; manager then authorizes a keyed version and independent review."
  },
  {
    "id": "hold.topic.anal-cancer.close-margin-management",
    "status": "unkeyed_new_evidence_disagreement",
    "questionVariantId": null,
    "isCorrect": null,
    "constructedClinicFrame": "Named adult patient in clinic after excision of a small perianal SCC; no scored draft is emitted.",
    "competingActions": [
      "Re-excision",
      "Adjuvant chemoradiation",
      "Surveillance"
    ],
    "evidenceClaimIds": [
      "claim.question-topic.anal-cancer.margin-disagreement-held"
    ],
    "reason": "Clearance definitions and close-margin management differ across society guidance. The keyed margin siblings instead use 12-mm observed clearance.",
    "nextAction": "Melissa selects a jurisdiction-specific guideline and exact clearance/re-excision boundary before a draft is keyed."
  }
]
```

```json
[
  {
    "id": "withheld.topic.anal-cancer.response-clock",
    "claimIds": [
      "claim.question-topic.anal-cancer.response-clock-held"
    ],
    "reason": "SEOM response evaluation uses initiation; its later paragraph says after therapy. Preserve the clock discrepancy and existing owner hold."
  },
  {
    "id": "withheld.topic.anal-cancer.margin-cutoff",
    "claimIds": [
      "claim.question-topic.anal-cancer.margin-disagreement-held"
    ],
    "reason": "Greater-than-1-mm versus greater-than-1-cm statements are not equated or averaged; no close-margin ranking is scored."
  },
  {
    "id": "withheld.topic.anal-cancer.superficially-invasive",
    "claimIds": [],
    "reason": "Selected superficial canal-cancer excision requires exact histologic dimensions and adverse-feature exclusions from current permitted guidance; no key is inferred from generic early stage."
  },
  {
    "id": "withheld.topic.anal-cancer.screening-algorithm",
    "claimIds": [],
    "reason": "NIH and IANS differ on HPV-only screening. No universal eligibility or genotype-only algorithm is proposed."
  }
]
```

## Owner approvals needed

### owner.topic.anal-cancer.early-response

At eight weeks AFTER COMPLETION, with a shrinking lesion and small ulcer but no progression, should repeat response assessment outrank biopsy now and salvage APR? Specify initiation-versus-completion clock and exact reassessment boundary.

Affected exact identities: `question.n3.anal-cancer-distant-staging-versus-local-extent.v2`, `hold.topic.anal-cancer.early-response-eight-weeks`.

Evidence/review boundary: Existing explicit hold persists; new source checks are not clinical sign-off.

### owner.topic.anal-cancer.close-margin

For small well-differentiated perianal SCC with a close/positive margin, which clearance definition and re-excision-versus-adjuvant strategy should the bank teach? Select the jurisdiction-specific guideline and exact boundary.

Affected exact identities: `hold.topic.anal-cancer.close-margin-management`.

Evidence/review boundary: Society clearance definitions differ; no disputed point is keyed.

### owner.topic.anal-cancer.exact-drafts

Review these twelve exact drafts, including specimen architecture, poor-grade postoperative CRT, isolated irradiated-groin dissection and metastatic first-line versus post-platinum treatment. Confirm keys and closest alternatives.

Affected exact identities: `question.topic.anal-cancer.sample-provenance.v1`, `question.topic.anal-cancer.local-staging-record.v1`, `question.topic.anal-cancer.regional-node-treatment.v1`, `question.topic.anal-cancer.cytology-to-histology.v1`, `question.topic.anal-cancer.treat-intraepithelial-lesion.v1`, `question.topic.anal-cancer.new-nodule-after-hsil.v1`, `question.topic.anal-cancer.irradiated-groin-recurrence.v1`, `question.topic.anal-cancer.metastatic-first-systemic-line.v1`, `question.topic.anal-cancer.clear-margin-observation.v1`, `question.topic.anal-cancer.adverse-margin-histology.v1`, `question.topic.anal-cancer.confirm-local-recurrence.v1`, `question.topic.anal-cancer.salvage-local-failure.v1`.

Evidence/review boundary: Author checks/tests confer no independent PASS or clinical approval. Melissa is named clinical sign-off; manager controls review/admission.

### owner.topic.anal-cancer.adverse-postoperative-grade

After excision of a 1.6-cm skin-based, node-negative anal-margin SCC with 12-mm negative clearance but poor differentiation, should the drafted key be chemoradiation rather than surveillance or further excision?

Affected exact identities: `question.topic.anal-cancer.adverse-margin-histology.v1`, `concept.topic.anal-cancer.margin-adjuvant-selection.v1`.

Competing named actions: Clinical and anoscopic surveillance; Wider perianal re-excision; Fluorouracil?mitomycin chemoradiation.

Evidence/review boundary: SEOM excludes poorly differentiated tumors from the selected excision pathway. Application to this already-excised postoperative scenario and exact regimen is an author inference requiring Melissa; it is not claimed to be proven by a direct postoperative randomized trial.

### owner.topic.anal-cancer.irradiated-groin

For an isolated mobile biopsy-confirmed inguinal recurrence in a previously irradiated basin with a controlled anal primary, does dissection rank first among these choices?

Affected exact identities: `question.topic.anal-cancer.irradiated-groin-recurrence.v1`, `concept.topic.anal-cancer.inguinal-salvage.v1`.

Competing named actions: Right inguinal lymph-node dissection; Salvage abdominoperineal resection; Definitive chemoradiation to the right groin.

Evidence/review boundary: Current SEOM and older ARS support the nodal-salvage principle, but evidence is limited and exact reirradiation eligibility/dissection extent is not specified.

### owner.topic.anal-cancer.systemic-line

With disseminated biopsy-matched anal SCC after fluorouracil?mitomycin radiosensitization, and no prior platinum or checkpoint inhibitor, confirm the first-line combination key over post-platinum monotherapy.

Affected exact identities: `question.topic.anal-cancer.metastatic-first-systemic-line.v1`, `concept.topic.anal-cancer.metastatic-line-selection.v1`.

Competing named actions: Retifanlimab with carboplatin and paclitaxel; Retifanlimab monotherapy; Fluorouracil and mitomycin chemotherapy.

Evidence/review boundary: FDA 2025 and NCI 2026 support the line-specific indications. They describe the same approval evidence; no mandatory-use or overall-survival superiority claim is made.

## Decision log and manual advisory dispositions

- Preserved all four approved association originals with candid difficulty/presentation limitations.
- Proposed retirement of six duplicate live SCC variants plus held N3 v2; no removal executed.
- Kept the early-response hold unkeyed despite suggestive research.
- Used favorable/adverse margin siblings with identical options, opposite keys and generous observed clearance; no disputed cutoff scored.
- Reuse workup for new post-HSIL lesion variant; seven genuinely new meanings have separate identities.
- Removed framing-only updates and duplicated pre-answer observations in a final deletion pass.
- Initial static source-loader probes failed because extensionless dependencies linked before hook registration. Dynamic imports resolved probing without repository repair; no missing-module defect is asserted.

```json
{
  "automatedAssembledLint": "Not run in this focused worker lane; manager owns assembled-release advisory lint and cross-topic checks.",
  "manualCuePass": "All twelve exact nodes have concrete attacks and decision-changing counterfactuals. Metadata tests do not establish clinical correctness or independent PASS.",
  "acceptedWarnings": [
    "Known diagnosis is supplied for treatment tasks only.",
    "Necessary negative distant studies and sampled negative stroma stay because they define the treatment/invasion boundary.",
    "Exact 12-mm margin and constructed months/years are fictional observations, not newly asserted universal cutoffs.",
    "The favorable margin case may be easier for residents already familiar with the excision exception; no accepted basic label is claimed."
  ],
  "pendingIndependentReview": true
}
```

## Validation commands and complete outcomes

Run from `packages/clinical-content` unless the run says repository root. Latest focused file: **1 passed; 14 tests passed, 0 failed; exit 0; 2.69s**. Package typecheck: **exit 1**, with one out-of-lane pancreas error at 997:48; zero diagnostics name this topic. Both owned JSON outputs parse successfully. Package-wide green is not claimed.

### Run 1 ? exit 0

Working directory: `packages/clinical-content`. Command:

```powershell
npm.cmd test -- --pool=threads src/question-topic-anal-cancer-20261111.test.ts
```

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-anal-cancer-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  18:19:28
   Duration  3.76s (transform 2.42s, setup 0ms, import 3.52s, tests 39ms, environment 0ms)
```

### Run 2 ? exit 1

Working directory: `packages/clinical-content`. Command:

```powershell
npm.cmd run typecheck
```

```text
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-bariatric-metabolic-20261111.test.ts(92,14): error TS18048: 'c.chiefComplaint' is possibly 'undefined'.
src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts(997,48): error TS2322: Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }[]' is not assignable to type '({ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; })[]'.
  Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; }'.
    Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; }'.
      Types of property 'clinicalRationale' are incompatible.
        Type 'string | undefined' is not assignable to type 'string'.
          Type 'undefined' is not assignable to type 'string'.
src/question-topic-thyroid-nodules-cancer-20261111.test.ts(261,71): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

### Run 3 ? exit 0

Working directory: `packages/clinical-content`. Command:

```powershell
npm.cmd test -- --pool=threads src/question-topic-anal-cancer-20261111.test.ts
```

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-anal-cancer-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  18:22:52
   Duration  2.90s (transform 1.92s, setup 0ms, import 2.69s, tests 33ms, environment 0ms)
```

### Run 4 ? exit 1

Working directory: `packages/clinical-content`. Command:

```powershell
npm.cmd run typecheck
```

```text
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts(997,48): error TS2322: Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }[]' is not assignable to type '({ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; })[]'.
  Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; }'.
    Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; }'.
      Types of property 'clinicalRationale' are incompatible.
        Type 'string | undefined' is not assignable to type 'string'.
          Type 'undefined' is not assignable to type 'string'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

### Run 5 ? exit 0

Working directory: `packages/clinical-content`. Command:

```powershell
npm.cmd test -- --pool=threads src/question-topic-anal-cancer-20261111.test.ts
```

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-anal-cancer-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  18:26:28
   Duration  2.69s (transform 1.86s, setup 0ms, import 2.51s, tests 35ms, environment 0ms)
```

### Run 6 ? exit 1

Working directory: `packages/clinical-content`. Command:

```powershell
npm.cmd run typecheck
```

```text
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts(997,48): error TS2322: Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }[]' is not assignable to type '({ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; })[]'.
  Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; }'.
    Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; }'.
      Types of property 'clinicalRationale' are incompatible.
        Type 'string | undefined' is not assignable to type 'string'.
          Type 'undefined' is not assignable to type 'string'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

### Run 7 ? exit 0

Working directory: `repository root`. Command:

```powershell
node -e "for (const f of ['docs/research/question-topic-anal-cancer-20261111.json','docs/research/sources-question-topic-anal-cancer-20261111.json']) { JSON.parse(require('fs').readFileSync(f,'utf8')); console.log('JSON.parse PASS '+f); }"
```

```text
JSON.parse PASS docs/research/question-topic-anal-cancer-20261111.json
JSON.parse PASS docs/research/sources-question-topic-anal-cancer-20261111.json
```

- Only the requested focused test and clinical-content package typecheck were run. No broader suite, browser test or assembled-release lint was run.
- First typecheck also reported bariatric test line 92 and thyroid test line 261; those were absent on subsequent runs. No out-of-lane file was changed by this worker.
- All 12 author gates are self-checks. Tests establish structure, identity/mapping integrity and implementation, not clinical approval or independent PASS.

## Final bounded handoff

Final acceptance reconciliation (2026-11-11): **PASS** — 14 exact variants, 26 visible context audits, 15 distinct node serializations, 12 complete after packets, 7 clinic cases, 9 source records and 25 atomic claims. Both owned JSON outputs parse after finalization. All four assigned source-file SHA-256 values remain unchanged. Exactly the five owned files are new local artifacts; shared integration remains untouched. Worker work is complete pending manager/independent/clinical review. The package-wide typecheck is still not green because of the pancreas-lane error documented above.

Topic anal-cancer. Audited 14 / kept 4 / rewritten 3 / retirement-and-replacement proposals 7 / new questions 9. Twelve proposed questions, seven cases, three reused identities and seven new meanings. One inherited owner hold and one new unkeyed evidence-disagreement hold. Four exact original clinical approvals preserved; zero new independent PASS/clinical approvals.

Manager: review this packet and actual diff, obtain independent review and Melissa?s decisions, fix/coordinate the pancreas typecheck blocker, then decide exact admission and duplicate retirement. No shared integration, commit, push, deploy, install, agents or external message occurred. This draft checkpoint remains local; manager owns any later GitHub-backup checkpoint and owner reminder.
