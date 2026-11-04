# Difficult, fair single-best-answer questions — strategy, 2026-10-28

**Phase 1 adoption and superseding owner decision (2026-10-28):** routine
resident difficulty intent is 40–65% predicted success and stretch intent is
25–45%; three/four credible options are accepted. These are reviewer predictions,
not measured gates. The owner has ruled out per-question correctness collection
and analytics. Quality assurance uses the authoring standard, advisory cue lint,
owner/clinician review and voluntary tester question flags. The current
[authoring standard](../clinical/question-authoring-standard.md) governs this
phase; the former performance-report proposal is removed. All clinical drafts
still need clinician review.

**Manager review, 2026-10-29:** the pilot remains in the working tree only and
must not ship until owner review and required clinician approval. All 14 tasks
and five companions were checked for cues relocated into the lead-in; the
[pilot review](question-pilot-review-20261028.md) records each decision and the
current/prior draft comparison. The canonical standard now includes a separate
neutral-task review and advisory decision-principle checks.

Historical first-milestone status: research proposal for manager/owner review.
That research milestone changed no game content, question data, code or tests.
The subsequently authorized phase-1 implementation is recorded in the
[handoff](question-quality-phase1-handoff-20261028.md). Every illustrative
clinical rewrite and its clinical claim remains `needs_clinician_review`;
no named clinician has approved these versions. This is an educational-software
authoring strategy, not medical advice.

Companions: [40-variant audit](question-cue-audit-20261028.md) and [source records, rights and claim mappings](sources-question-writing-20261028.md). Source access and literature check date: 2026-10-28.

## Recommendation

Design difficulty around **a consequential decision between credible alternatives**. Let a resident interpret observations, recognize a mechanism or weigh the next action. Keep the information needed to identify one best answer. The owner's wish for “vague and challenging” is best implemented as less preinterpretation and less differential pre-filtering, while keeping the task and decision context precise.

Dustin's feedback is a useful hypothesis, not calibration in the target population. A psychiatrist's performance cannot establish difficulty for surgical residents. In the audit, 27/40 variants contain a negative finding, but only 8/40 were flagged for negatives/exclusions aligned with offered distractors. Three directly name or permit the key; five supply an intermediate interpretation; five have categorical or self-disqualifying option wording. Nineteen have at least one E/K/T/H/X/G/W editorial flag. These overlapping, single-reviewer findings are not population estimates. The key is uniquely longest in only 2/40, so making all options longer is not an evidence-based remedy.

The immediate priority is to remove direct answer disclosure and weak comparisons, then increase the reasoning required where that matches the concept. Removing every negative would make some questions unsafe or underdetermined.

## Evidence summary

These are short original syntheses, not extracts or adaptations of external question items. QWE IDs identify nonclinical assessment claims. Empirical findings in undergraduate, nursing or veterinary cohorts require cautious extrapolation to surgical residents.

| ID | Evidence and implication | Sources / limitation |
| --- | --- | --- |
| QWE01 | A focused lead-in should make sense before the choices are visible; options should answer the same question on the same decision dimension. The “cover the options” check tests completeness, **not** whether the answer is obvious. | [NBME, 2024](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf), [NABP, 2024](https://nabp.pharmacy/wp-content/uploads/2024/07/NAPLEX-Item-Writing-Best-Practices-2024.pdf) (QWS01–02); expert organizational guidance. |
| QWE02 | Length/grammar differences, repeated key words, categorical qualifiers, option subsets that exhaust the possibilities, convergence of repeated components, and implausible distractors can reward testwiseness. Irrelevant detail and ambiguous wording can also make a knowledgeable learner fail. | QWS01; [Rush et al., 2016](https://link.springer.com/article/10.1186/s12909-016-0773-3) (QWS04). A flaw's effect is not uniformly toward easier items. |
| QWE03 | Pertinent negatives are not prohibited. The NBME guide varies vignette detail with learner experience. Its guidance does not establish an optimal number of negatives or require equal numbers against every diagnosis. Our targeted search found no defensible numerical quota. | QWS01, chapters 5–6. The proposed information-selection rules below are a project synthesis, not a tested negative-count intervention. |
| QWE04 | In 514 four-option nursing items, only 13.8% had all three distractors functioning; 47.8% of distractors failed the study's functionality criteria. Common-error alternatives and actual option analysis matter more than filling slots. | [Tarrant, Ware & Mohammed, 2009](https://link.springer.com/article/10.1186/1472-6920-9-40) (QWS06). One program; not an expected rate for this game. |
| QWE05 | A 480-item medical-school analysis modeled reducing five options to four or three. Reliability and mean discrimination changed little, while mean marks rose modestly. Another study found no advantage from four versus three distractors. A smaller credible set can be preferable to filler. | [Kilgour & Tayyaba, 2016](https://link.springer.com/article/10.1007/s10459-015-9652-7) (QWS07); QWS04. Simulation/observational evidence, not a universal mandate for three options. |
| QWE06 | Higher cognitive complexity was associated with stronger discrimination in 1,925 veterinary items. A small preclinical medical intervention improving construction/cognitive level or distractors improved discrimination without a consistent difficulty change. | QWS04; [Ali & Ruit, 2015](https://link.springer.com/article/10.1007/s40037-015-0212-x) (QWS05). Better writing need not lower percent correct. |
| QWE07 | The key-features approach concentrates assessment on case-specific critical decisions where an incompletely prepared learner may fail, rather than rewarding exhaustive management lists. | [MCC development guide, 2012](https://mcc.ca/wp-content/uploads/CDM-Guidelines.pdf) (QWS03). Historical methodology; not a claim about the current licensing exam's format. A game SBA can borrow this focus without adopting multi-select scoring. |
| QWE08 | Retrieval and spacing can improve retention, and some benefits transfer to related tasks. Success on a repeated item is not sufficient evidence of transfer. Generalization depends on task and context. | [Fraundorf et al., 2023](https://link.springer.com/article/10.1186/s41235-023-00508-8) (QWS08), a board-funded scholarly review. No direct validation of this game's variants or FSRS parameters. |
| QWE09 | Percent correct and item discrimination answer different questions. A difficult item that stronger learners miss more often may be miskeyed, ambiguous, off-target or poorly matched to the cohort. | QWS01, chapter 4; QWS05. Metrics require suitable learners, denominators and an ability reference. |
| QWE10 | Game engagement does not establish assessment validity or learning gains. A randomized crossover medical gamification study found no clear overall learning advantage and encountered substantial participation issues. | [Kirsch & Spreckelsen, 2023](https://link.springer.com/article/10.1186/s12909-023-04258-5) (QWS15). One competitive evidence-based-medicine app; does not settle this game's design. |

For CC-licensed works, this document credits authors and links original publications; [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) apply as recorded per source. All summaries are newly written; no source prose, tables, algorithms, figures or external sample questions are reproduced.

## Game authoring rules and research recommendations

The canonical [authoring standard](../clinical/question-authoring-standard.md) now adopts these rules. Difficulty and option-count decisions are owner-approved; the suggested application/analysis mix remains an editorial recommendation. None of these percentages is a clinical threshold or measured release gate.

### 1. Specify the decision before writing the vignette

Record the primary concept ID and version, intended learner stage, important decision, prerequisite knowledge, evidence claim IDs, intended cognitive operation, expected common error and why one answer wins in this setting. Keep educational tier, patient acuity, facility capability and facility progression separate.

Choose a critical feature: an action to take, an investigation to select, a result to interpret, a localization to infer, or a management priority. For a resident-oriented set, propose **at least 80% application/analysis** and at most 20% justified foundational recall. Judge the work the learner actually performs; a long patient story around a vitamin fact is still recall. Count the target across an authored set, not against every foundational/tutorial encounter.

A useful two-step item requires an inference and then a decision, such as interpreting a pattern and choosing the next investigation. It should still score one primary concept. Two unrelated trivia hurdles do not create valid higher-order difficulty. If a new task materially changes the clinical meaning, create a new concept version rather than detaching old FSRS history by casually renaming IDs.

### 2. Write a precise, self-contained lead-in

Specify the task, decision time and comparison: for example, the most appropriate **next investigation now**, rather than an unspecified “best management.” Give the available setting/resources when they change the answer. Make the question complete after presentation and question text are separated.

Do not move the missing inference into the task. Safety, first-line, definitive,
most-sensitive/most-specific and gold-standard framing can announce the answer
rule when that rule is the learning objective. Use a neutral, complete task;
retain necessary patient goals and eligibility in the clinical context. Review
task words against every option for a key-only echo. Explicitly comparing one
of those properties can be a valid objective, so these are review questions,
not a blanket vocabulary ban.

Have an expert answer with options covered, then compare the answer against the offered alternatives. If experts cannot identify an intended answer without guessing the author's assumptions, add the missing context or change the task. Do not repair it by relying on one ridiculous option being less wrong than the rest.

Use the specific named patient, an age and sex consistent with the character/story, and usually a 1–5-word complaint. Do not repeat the presentation in the lead-in. Preserve clinically constrained profiles. The game keeps these project rules even where an external assessment guide recommends anonymous patients.

### 3. Select information by function, including negatives

Use a private authoring matrix before polishing prose:

| Finding | Author's required justification |
| --- | --- |
| Decisive positive | What inference does it support, and what prior knowledge is needed? |
| Safety/management prerequisite | Would removing it change urgency, eligibility, contraindications or the best next action? |
| Negative finding | Which alternative becomes less likely, and is that clinical distinction the intended skill? Is absence actually exclusionary? |
| Realistic contextual detail | Does it preserve a credible competing interpretation or necessary patient context without adding irrelevant reading load? |
| Interpretive label | Is this a prerequisite already established, or have we answered a step the learner is meant to do? |

Retain every safety-critical or answer-determining negative. Remove redundant exclusions that only audit the wrong answers for the learner. Prefer a measured finding to an author's declaration that a whole disease category has been ruled out, **when interpreting that finding is the intended learning objective**.

Do not demand a symptom present in every case of a disease, or treat an absent symptom as a definitive rule-out. Write down the evidentiary strength for every exclusion. A clinician must check that removing a negative does not create a second defensible key.

“Balancing negatives” should mean avoiding one-sided, item-specific filtering: compare several credible alternatives with a coherent mixture of positive and negative observations. It does **not** mean inventing a negative for each diagnosis or withholding all discriminating information. An expert should eventually eliminate inferior alternatives by reasoning; the author need not announce their elimination.

Do not add random normal findings to make the stem look balanced. Use a deletion test: remove a sentence provisionally, solve the item again, and determine whether the key, urgency or realistic competing reasoning changed. If nothing relevant changed, remove or shorten it. There is **no fixed maximum negative count**.

### 4. Withhold conclusions while retaining decision-critical data

| Legitimate withholding | Illegitimate withholding |
| --- | --- |
| Omit the diagnosis name when diagnosis is the task. Supply the observations needed to infer it. | Omit findings needed to distinguish two equally reasonable diagnoses, then call the item challenging. |
| Present laboratory values with units/reference context, image descriptions, morphology or observed behavior at the intended learner level. | Omit units, timing, medication exposure or another essential interpretive dependency. |
| Show a pathology panel or raw study table instead of stating the diagnostic/statistical conclusion being tested. | Remove required pathology extent or study-design information so several stages/tests fit. |
| Leave an unfiltered but clinically coherent differential for the learner to compare. | Add contradictory noise, rare exceptions or misleading history merely to manufacture difficulty. |
| At a diagnostic decision, ask which missing information should be obtained next. | Ask for definitive treatment while hiding the information that determines its indication or safety. |
| Reveal only results available at that encounter step. | Let later results, an answer explanation or a source title reveal the current key. |

Known diagnoses may remain explicit in management, anatomy or counseling items. A resident can know the diagnosis and still face a difficult decision. Interpretive labels are also appropriate if interpretation is outside the scored objective; raw data everywhere would add unnecessary work.

Do not teach the decision rule in a pre-answer sentence. Put teaching, exceptions and option rationales after the response. Review the whole visible encounter: complaint, presentation, current update, exhibit, prior feedback, lead-in and service previews. Do not retrieve sources or invoke an AI model during gameplay.

### 5. Build a credible, homogeneous option set

Start with the key and the **most attractive wrong answer**, then write other alternatives only if they represent a recognizable error. Record for each distractor:

- the misconception, wrong inference or sequencing error it represents;
- what finding makes it tempting to a less-prepared learner;
- what evidence makes it inferior in this exact case; and
- what changed case would make it reasonable, if applicable.

Examples of error mechanisms include prematurely treating before establishing a required diagnosis, ordering a later-line test too early, confusing two nearby anatomical structures, applying a correct rule to the wrong population, or treating a symptom while missing its mechanism. These are authoring categories, not claims that any specific clinical alternative is safe.

Use one semantic category and comparable specificity: all diagnoses, all investigations, all operative planes, or all next actions addressing the same task. Plans may have necessary components, but do not make one a careful treatment bundle and another a bare drug name. Align grammar and level of detail; remove explanations, “because,” rhetorical qualifications and conspicuous absolutes from labels. Necessary clinical qualifiers must be handled consistently.

Check repeated words, unique abbreviations, uniquely qualified options, paired opposites that exhaust possibilities, and **convergence**: the key should not be guessable by choosing the combination of components repeated most frequently across the answers. Avoid overlapping ranges, nested choices, all/none-of-the-above and options that contradict the lead-in's own scope. “No additional investigation” is a substantive possible action, distinct from a none-of-the-above escape.

Maintain randomized runtime order. Do not use a key's position as a variant feature. The owner accepts three or four total options; retain only credible distractors. Do not pad a fourth slot or add a fifth for apparent sophistication.

All testing choices, including distractors, must retain runtime wait estimates under the existing presentation rule. Do not bake fixed durations into prose. Review timing/route metadata for parity so the only fully specified preview does not signal the key; any change to this behavior is a separate implementation/design task.

## Difficulty and quality intent

First judge evidence, clarity and the intended inference. Reviewers predict
roughly 40–65% success for routine resident items and 25–45% for a stretch
subset. These owner targets describe authoring intent; the game neither measures
them nor uses them as gates. Keep tutorials and deliberately foundational
questions labelled, and explain why closer distractors should tempt a less
prepared resident while a better prepared resident can identify one best answer.

The assessment literature distinguishes difficulty from discrimination (QWE09).
That distinction informs fair design and clinician review here; it is not a
plan to collect gameplay answers, derive item statistics, or score testers.
No numeric performance review rule, minimum sample, answer-statistics input
format or automatic correctness-based flag is proposed.

## Repeated play, variants and FSRS

The targeted search found general retrieval/transfer evidence and medical game studies, but no direct evidence establishing an optimum negative count, variant count or anti-cue standard for an FSRS-driven surgical game. The following are design hypotheses requiring later validation.

Keep a stable concept identity for equivalent clinical meaning. Build variants around different presentations of the same decision: alternate relevant findings, a different representation of evidence, a plausible competing explanation or a different route to the same inference. Changing names, age within an allowed range, sex or sentence order alone does not demonstrate transfer. Never use race/ethnicity as a disease-selection variable, invent demographic probabilities, or allow unconstrained generated profiles.

A useful contrast set changes an answer-determining feature and asks whether the learner changes the choice for the right reason. A clinician must determine whether it remains the same concept/version or becomes a distinct objective. Do not force every variant to have a different answer merely to defeat memory.

Shuffle answer order while keeping choice IDs stable. Keep recognizable, meaningful answer terminology; disguising synonyms is not clinical difficulty. Feedback should explain the distinguishing inference after answering. Ask reviewers whether a later node tests a new decision or merely repeats what earlier feedback just taught.

The existing [campaign-scoped FSRS decision](../adr/0001-campaign-scoped-fsrs.md) and [pinned adapter decision](../adr/0013-pinned-fsrs-adapter.md) remain authoritative: the first scored answer maps to Again/Good; FSRS schedules concepts, and the project selector handles variant recency/interleaving. This research does not alter scheduler parameters, mastery, remediation, concept history or frozen saves. A high FSRS retrieval target is compatible with challenging first exposure; repeated accuracy is not an exam difficulty estimate.

## Worked examples: illustrative drafts only

**All three examples are original rewrites of project-owned audited variants, not external assessment items. They are `needs_clinician_review`, not applied to game data, and not approved for release.** Options are displayed **key first for review only**; runtime order must be randomized. Keys below are **intended** and require independent clinician/assessment review. No numeric probabilities, treatment timelines, medication doses or wait durations are introduced.

### Draft EX01 — make a statistical judgment from the data

Audit A22: `question.statistics-ethics.fisher-exact.v2`, case `case.gs028se.fisher-exact-study-design.a-tiny-pilot`; concept `concept.statistics-ethics.fisher-exact`.

**Before, paraphrased:** the exhibit announces that the large-sample approximation is unreliable, then the lead-in asks for the test for a sparse table. That supplies a principal analytic step.

**After — `needs_clinician_review`:**

Chief complaint: **Study result questions**

Alex Morgan, a 45-year-old man, attends clinic with questions about a proposed procedure. His report contains an invented pilot comparing two separate groups. Each participant appears once; the groups are not matched. Recurrence was recorded at two years.

| Invented study group | Recurrence | No recurrence |
| --- | ---: | ---: |
| Study intervention | 0 | 7 |
| Study comparator | 3 | 4 |

**Which test best compares two-year recurrence between the independent study groups in Alex Morgan's report?**

A. Fisher exact test  
B. Pearson chi-square test  
C. McNemar paired-proportions test  
D. Cochran Q test

Intended key: A. The counts are retained from the project's fictional exhibit, not a clinical effect estimate or an external table. The expert must assess sample structure and expected counts. B represents accepting an unsuitable approximation; C/D represent pairing/repeated-measures errors. [NIST Dataplot](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm) (QWS09) supports the statistical basis. Statistical claim QWM01: Fisher's exact method is appropriate for this independent, small 2×2 comparison; this does not claim it is the only possible exact analysis.

Fairness check: clinical context is not needed for the calculation, but independent groups, the outcome and counts are. Do not remove those to make the question harder. Reviewer should confirm the specified options and design give one best choice; do not add another valid exact test as a distractor.

### Draft EX02 — interpret pathology rather than receive its conclusion

Audit A28: `question.gs028g.merkel-cell.integrated-diagnosis.v1`, case `case.gs028g.merkel-cell.paired-skin-panel`; concept `concept.gs028g.merkel-cell.integrated-diagnosis`.

**Before, paraphrased:** the report identifies a primary cutaneous neuroendocrine process and explicitly excludes melanoma and lymphoma, both of which appear as answers.

**After — `needs_clinician_review`:**

Chief complaint: **Skin pathology review**

Maya Chen, a 43-year-old woman, comes to clinic to discuss a biopsy from a growing forearm nodule. The specimen contains closely packed small malignant cells in the dermis. Tumor staining shows CK20 in a dot pattern near the nuclei and positive synaptophysin; TTF-1 staining is negative.

**Which diagnosis best integrates Maya Chen's skin-biopsy findings?**

A. Cutaneous Merkel cell carcinoma  
B. Metastatic small-cell lung carcinoma  
C. Cutaneous malignant melanoma  
D. Cutaneous malignant lymphoma

Intended key: A, based on combined morphology and staining, not a declaration that named alternatives have been excluded. Clinical claims QWC01–02 apply. This presents an observed negative result that requires interpretation; it does not assert that a negative TTF-1 alone rules out a pulmonary primary. The age/sex is retained from the audited profile, not chosen from a prevalence weight.

The <a href="https://doi.org/10.1016/j.esmoop.2024.102977" target="_blank" rel="noopener noreferrer">2024 ESMO–EURACAN guideline</a> (QWS11) and <a href="https://www.nature.com/articles/s41571-018-0103-2" target="_blank" rel="noopener noreferrer">Harms et al.'s diagnostic review</a> (QWS10) support interpreting a panel with known exceptions. Reviewer must decide whether this abbreviated panel/morphology is adequate against every offered alternative, whether additional findings are necessary, and whether this is an appropriate level of pathology interpretation for the intended residents. Add necessary evidence if it is not adequate; withhold the item if two diagnoses remain equally defensible.

### Draft EX03 — infer the skin injury mechanism, then choose a focused action

Audit A30: `question.gs028g.peristomal-skin.restore-seal.v1`, case `case.gs028g.peristomal-skin.paired-wide-opening`; concept `concept.gs028g.peristomal-skin.restore-seal`.

**Before, paraphrased:** the question calls the dermatitis noninfectious and attributes it to an oversized opening; offered alternatives include antimicrobial treatment and enlarging that opening further.

**After — `needs_clinician_review`:**

Chief complaint: **Skin around stoma**

Leah Patel, a 43-year-old woman with an ileostomy, comes to clinic because of burning skin during pouch wear. On removing the appliance, the nurse sees liquid output against a moist eroded ring immediately next to the stoma. The cut opening extends beyond the stoma base, leaving that ring uncovered. Skin beneath the rest of the adhesive is intact. Leah is afebrile, and the stoma is viable.

**Which initial change best addresses the cause of Leah Patel's peristomal skin injury?**

A. Resize the barrier opening around the stoma  
B. Substitute a different adhesive barrier formulation  
C. Apply antifungal powder beneath the current barrier  
D. Schedule more frequent changes of the current pouch

Intended key: A. Clinical claims QWC03–04 apply. The learner must connect the exposure distribution to the ongoing cause. Other choices represent product-allergy attribution, fungal attribution and changing wear frequency without correcting fit. They are reasonable actions in other settings, not bizarre actions or complete alternative care plans.

The retained afebrile/viable observations set clinic safety context; they do not declare that fungal disease has been excluded. The <a href="https://psag.wocn.org/index.html" target="_blank" rel="noopener noreferrer">WOCN assessment guide</a> (QWS12), <a href="https://doi.org/10.1097/WON.0000000000000873" target="_blank" rel="noopener noreferrer">McNichol et al., 2022</a> (QWS13) and a limited independent <a href="https://riviste.fupress.net/index.php/if/article/view/2102" target="_blank" rel="noopener noreferrer">Dorigo review</a> (QWS14) support the fit/exposure rationale. WOCN and McNichol share contributors; they are not fully independent authorities. Clinician review must confirm the scenario sufficiently distinguishes allergy, fungal disease and other skin injury, and that “initial change” has a single best answer. Do not turn these observations into a universal dermatitis treatment rule.

### Atomic clinical-claim ledger for EX02–03

These claims are independently written, not imported into the clinical-content registry. Fictional case observations are invented teaching context, not patient data or evidence of incidence. Every implied diagnostic/management inference in these drafts is restricted to this ledger and awaits a named clinician's approval of the exact version.

| Stable claim ID | Atomic claim | Supporting source IDs | Category | Certainty / limitation | Last checked | Clinical review |
| --- | --- | --- | --- | --- | --- | --- |
| QWC01 | In a compatible cutaneous small-cell malignancy, CK20 staining near nuclei in a dot pattern supports consideration of Merkel cell carcinoma. | QWS10, QWS11 | Diagnostic pathology | Typical pattern, not an invariably present or uniquely sufficient marker. | 2026-10-28 | needs_clinician_review |
| QWC02 | Morphology and a combined immunohistochemical panel should inform this differential; TTF-1 negativity alone is insufficient to establish the diagnosis. | QWS10, QWS11 | Diagnostic limitation | Marker exceptions exist; adequacy of the illustrative panel is unresolved. | 2026-10-28 | needs_clinician_review |
| QWC03 | Ileostomy effluent contacting peristomal skin can cause irritant skin injury. | QWS12, QWS13, QWS14 | Mechanism / clinical assessment | Does not exclude other causes or coexistence of skin conditions. | 2026-10-28 | needs_clinician_review |
| QWC04 | When an opening leaves skin exposed to effluent, improving the barrier fit addresses that exposure mechanism. | QWS12, QWS13, QWS14 | Management principle | Society guide plus reviews, with contributor overlap and variable review quality; no universal product choice, dose or timing rule. | 2026-10-28 | needs_clinician_review |

QWM01 is a nonclinical statistical-method claim supported by QWS09, checked 2026-10-28; its worked item still requires review before use.

## Pre-publication checklist

A future item is reviewable only when the author can document all of the following:

- [ ] One important, versioned primary concept, intended resident level and explicit critical decision; no conflation with facility level or acuity.
- [ ] Atomic evidence claims, exact current citations, rights/access metadata and unresolved disagreement recorded. No copied bank/board material or source expression.
- [ ] Named patient, age, sex and short complaint meet project presentation rules; all allowed profiles preserve the clinical constraints.
- [ ] The lead-in fully states the task and time point after display splitting. A masked-options expert answer is possible.
- [ ] Necessary positives, negatives, results and resource assumptions are present. A deletion review has justified each exclusion; there is no arbitrary negative quota.
- [ ] The pre-answer chart/exhibit/feedback/preview does not supply the step being tested or name the key inadvertently.
- [ ] One best answer survives explicit comparison with every distractor. Two independent clinician solves are proposed for difficult or disputed items; any disagreement is resolved or the item withheld.
- [ ] Distractors represent documented error mechanisms, remain clinically credible before full reasoning and share a decision category, grammar and detail.
- [ ] Review length, absolutes, explanation clauses, word overlap, convergence, overlapping/paired choices and scope contradictions. Document dispositions of warnings.
- [ ] Key and distractor rationales follow answering. Answer shuffling and timing estimates for every testing choice are verified without fixed duration prose.
- [ ] Cognitive target reflects actual reasoning, and difficulty remains labelled as reviewer prediction rather than a measured gate.
- [ ] Clinical approval names a clinician and exact version. AI-assisted revisions remain `needs_clinician_review` until then; tests/lint/editorial signoff cannot approve them.
- [ ] Stable concept identity, new wording/variant version, release gating, frozen encounters and saves are preserved; no silent promotion to a public release.
- [ ] Quality review uses the standard, advisory cue lint, owner/clinician judgment and voluntary tester flags; no correctness analytics are introduced.

## Quality assurance without answer analytics

Use editorial review, source checking, independent clinician reasoning and the
already authorized voluntary tester question-flag/comment workflow. Owner and
clinician review resolve giveaway cues, unclear tasks and disputed keys against
the exact authored version. The advisory cue linter reports textual evidence
for review; it does not infer resident performance.

The owner has ruled out per-question correctness collection and analytics.
There is no answer-statistics report input, automatic performance flag or
sample-based gate. Voluntary flags are qualitative review requests; they do not
provide representative performance estimates. Do not mine saves, FSRS history,
usage receipts, security events or flag exports to derive item analytics.

Existing [privacy rules](../../SECURITY_AND_PRIVACY.md),
[usage contract](../../apps/player/src/playtime/usageTypes.ts) and
[voluntary flags](../../apps/player/src/session/hostedQuestionFlags.ts) retain
their operational purposes. This milestone changes no learning-history, save
or voluntary-feedback collection behavior and adds no new collection.

## Pipeline rollout and decisions

### Recommended sequence for a later authorized milestone

1. **Manager selects a small review batch** from direct-disclosure and pre-exclusion audit cases. Begin with a fixed concept/setting objective, not a bank-wide “remove negatives” rewrite. Keep tutorials and deliberately basic questions separately identified.
2. **Add an authoring review specification**, initially a sidecar/checklist: objective and critical feature; prerequisite versus tested inference; finding-to-option matrix; distractor misconception/rationale; predicted difficulty; cognitive target; evidence and clinical version; exact whole-display preview. The normalized [workspace template](../../clinical-data/templates/authoring-workspace.template.json) and [field guide](../clinical-workbench/PILOT_FIELD_GUIDE.md) do not yet provide full Question Variant authoring. Do not pretend this proposal is an existing field or bypass that planned layer.
3. **Run offline advisory lint on assembled questions**, after helper generation and wording repairs. Future implementation can use existing project tooling without a new dependency. Proposed checks: length ratio at least 2.0; key substantially longer than distractor median; meaningful phrase overlap/exclusive named tests; causal/rationale clauses and absolutes; near-duplicate options; option category mismatch; negative/exclusion phrases; current-update/exhibit labels; consistent timing metadata; and item-level shuffling. Grammar/convergence/medical plausibility need human judgment. Never auto-delete negatives or auto-rewrite clinical content.
4. **Review warnings with context.** Length/overlap flags are advisory; A10's abbreviation demonstrates a false-positive risk. The linter should report the exact phrase, field and compared options, not a mysterious “quality score.” Once rules are proven useful, only structural invariants already required by the schema should block compilation automatically. A clinician must judge missing information, competing answers and the meaning of numerical values.
5. **Masked-key review followed by comparison review.** A clinician solves the case, explains why the closest distractor loses and checks every allowed profile. A separate item-writing reviewer looks for testwise routes. Resolve disagreements and approve the exact revision through the existing workflow; the authoring package's workflow state is `needs_clinical_review`, while content review metadata uses `needs_clinician_review`. Neither may be silently translated into approval.
6. **Preview and release discipline.** Keep drafts in owner/development preview or an explicitly unapproved prototype. Later browser QA should inspect the actual named patient, separated task, prior feedback, option randomization and waits. Pin revision/content identity and preserve frozen encounters and saves. Difficulty remains an authoring/review prediction; no correctness analytics are planned.

### Owner/manager decisions and remaining scope

- Difficulty intent is approved at 40–65% predicted success for routine resident items and 25–45% for a stretch subset. Decide the stretch proportion, the application/analysis mix and the intended resident training range separately from facility unlocks.
- Three or four total options are approved. Identify intentionally easy tutorials/basic items separately. This milestone recommends no UI change.
- Keep question review qualitative through owner/clinician judgment and voluntary tester flags; no per-question correctness collection or analytics.
- Approve the implementation scope and batch sequence through the single manager. No additional workers, deployments or automated rewrites are initiated here.

### Clinician decisions

The exact discriminating findings and necessary negatives; whether diagnosis disclosure is a prerequisite or a giveaway; correctness and ranking of each distractor; admissible profile changes; adequate evidence for precise values; concept/version equivalence; and exact-version clinical approval. All three worked examples await these decisions. Difficulty estimates from an AI or linter cannot substitute for them.

## Handoff

Files written: only `docs/research/question-writing-strategy-20261028.md`, `question-cue-audit-20261028.md` and `sources-question-writing-20261028.md`. Research consulted public assessment guides, openly licensed item-writing studies, retrieval/game literature, targeted clinical verification sources and the repository's authoring/privacy/FSRS rules. Full records and exclusions are in the source register.

Key findings: pertinent negatives need a purpose test, not a quota; direct disclosure and preinterpreted findings are concrete priorities; credible common-error distractors and actual application create a better candidate for resident discrimination than vagueness. Quality review uses the standard, advisory lint, owner/clinician judgment and voluntary tester flags without correctness analytics.

Open: named clinician review of the audit and EX01–03, owner decisions above, qualitative review of voluntary tester feedback, source refresh before any clinical implementation, and manager acceptance of the documents. The shared `CURRENT_THREAD_HANDOFF.md` was intentionally not changed because the brief permits only these three new files. No Git, installs, content/code/test edits, public release or learner-data collection occurred. This milestone is local only; the manager owns any later authorized GitHub backup.

Documentation validation: all 40 variant/case identities and option word counts resolve against the assembled release; eight items per facility entry stage and eight follow-up decisions were confirmed. Local document links and source/claim mappings were checked. The 281-file clinical-content/authoring source manifest remained identical to the recorded snapshot. No game tests were run for this research-only milestone; these checks provide no clinical approval.

