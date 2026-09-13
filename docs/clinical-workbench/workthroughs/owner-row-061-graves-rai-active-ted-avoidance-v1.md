# Owner Row 61: Graves RAI Avoidance in Active Moderate-to-Severe TED — Review Draft v1

Status: `needs_clinician_review`; proposed sixth review set only, with no runtime or publication authorization

- Review version: `review.owner-row-061.graves-rai-active-ted-avoidance.2026-09-09.1`
- Workthrough date: 2026-09-09
- Reviewer required: Melissa Rowland, MD (surgeon)
- Source record: `owner-concept.sheet1.row-061`
- Stable Tested Concept: `concept.graves.rai-active-ted-avoidance`

## Approval boundary and proposed metadata

The 2026-08-31 receipt approves this seed scope only. The five 2026-09-09 exact
approvals do not approve this draft. Every exact version, claim, and source
record below remains `needs_clinician_review`.

- Learning objective: generally avoid therapeutic iodine-131 in ordinary Graves
  treatment counseling when specialist assessment documents active moderate-to-
  severe thyroid eye disease (TED).
- Educational tier: proposed foundational.
- Patient acuity: proposed stable outpatient; this is distinct from TED severity.
- Clinical setting: proposed clinic evaluation.
- Semantic release point: inherited `release.l0.clinic_evaluation` for counseling/referral.
- Proposed capability mapping: Examination Room and Founder physician; no onsite RAI.

Names are illustrative review examples. Future implementation may generate name,
age, gender/pronouns, and matching appearance only within approved clinical
constraints and consistently within one encounter. Specialist assessment supplies
TED activity/severity; the learner does not score it. Release, capability,
evidence, runtime admission, and publication remain separate gates.

## Atomic evidence claims

### `claim.graves-rai-active-ted-avoidance.general-avoidance`

In ordinary Graves treatment selection, therapeutic iodine-131 is generally
avoided when thyroid eye disease is active and moderate-to-severe.

- Evidence category: treatment-selection safety boundary
- Certainty/limitation: not an absolute lifetime prohibition; specialist
  exceptions may be considered when alternatives are not feasible.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.eanm.benign-thyroid-rai-guideline.2023`, `source.ata.thyroid-eye-disease.undated`

### `claim.graves-rai-active-ted-avoidance.worsening-risk`

Therapeutic iodine-131 may worsen existing thyroid eye disease.

- Evidence category: treatment risk
- Certainty/limitation: supports counseling avoidance in the documented active
  moderate-to-severe setting; it does not create an emergency-treatment rule.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.eanm.benign-thyroid-rai-guideline.2023`, `source.ata.thyroid-eye-disease.undated`, `source.niddk.graves-disease.2021`

### `claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction`

Improvement in thyroid symptoms alone does not establish that thyroid eye disease has become inactive.

- Evidence category: clinical-course context
- Certainty/limitation: this is a synthetic application: ATA and NIDDK document
  that TED can coexist with normal thyroid function, while the case independently
  states specialist-confirmed active disease. It does not establish a timeline or cause.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.ata.thyroid-eye-disease.undated`, `source.niddk.graves-disease.2021`

### `claim.graves-rai-active-ted-avoidance.graves-background-findings`

Palpitations, fine tremor, heat intolerance, diffuse goiter, and diffuse scan uptake can provide clinical context for Graves disease.

- Evidence category: diagnostic context
- Certainty/limitation: background context only, not an extra scored concept; these findings do not grade TED or independently select treatment.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.niddk.graves-disease.2021`

## Draft Patient Presentation and Question Variants

These are four separate fictional adult clinic encounters. Review choice positions
may include a key first; runtime choices must shuffle. Keys below are review order only.

### `presentation.graves-rai-active-ted-avoidance.v1` / `question.graves-rai-active-ted-avoidance.v1`

**Current patient presentation:** Omar has established Graves disease and asks
about therapeutic iodine-131 at a stable clinic visit. His ophthalmology note
documents active moderate-to-severe thyroid eye disease (TED).

**Question:** Which counseling conclusion best fits this patient's treatment discussion?

1. Favor iodine-131 to treat the thyroid and eye disease together
2. Avoid iodine-131 because it may aggravate the eye disease
3. Favor iodine-131 because eye disease does not affect treatment selection
4. Avoid iodine-131 because eye disease prevents uptake by the thyroid

**Key:** 2 — Avoid iodine-131 because it may aggravate the eye disease.

**Explanation:** Therapeutic iodine-131 can worsen existing TED. In ordinary
counseling, active moderate-to-severe TED is a reason to generally avoid it.

- Claim mapping: `claim.graves-rai-active-ted-avoidance.general-avoidance`, `claim.graves-rai-active-ted-avoidance.worsening-risk`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-active-ted-avoidance.v2` / `question.graves-rai-active-ted-avoidance.v2`

**Current patient presentation:** Mei returns to review Graves treatment options.
She is stable in clinic, and the team is reviewing updated records before deciding
whether therapeutic iodine-131 is suitable.

**Question:** Which finding in this patient's updated records would most strongly support avoiding therapeutic iodine-131?

1. Diffuse thyroid uptake on the diagnostic scan
2. Heat intolerance accompanied by a fine hand tremor
3. Active moderate-to-severe thyroid eye disease
4. Mild diffuse thyroid enlargement without compression

**Key:** 3 — Active moderate-to-severe thyroid eye disease.

**Explanation:** Active moderate-to-severe thyroid eye disease supports generally avoiding therapeutic iodine-131 because treatment may worsen the eye disease. The other findings provide Graves context.

- Claim mapping: `claim.graves-rai-active-ted-avoidance.general-avoidance`, `claim.graves-rai-active-ted-avoidance.worsening-risk`, `claim.graves-rai-active-ted-avoidance.graves-background-findings`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-active-ted-avoidance.v3` / `question.graves-rai-active-ted-avoidance.v3`

**Current patient presentation:** Priya has Graves disease and an ophthalmology assessment documenting active moderate-to-severe thyroid eye disease. During treatment counseling, she asks what therapeutic iodine-131 could mean for her eye symptoms.

**Question:** Which statement best describes the possible effect on this patient's eye disease?

1. It improves eye disease before affecting thyroid hormone levels
2. It resolves eye disease once thyroid hormone levels normalize
3. It leaves existing eye disease unaffected by treatment
4. It can worsen the thyroid eye disease already present

**Key:** 4 — It can worsen the thyroid eye disease already present.

**Explanation:** Therapeutic iodine-131 may worsen existing TED, supporting
general avoidance in this documented active moderate-to-severe setting.

- Claim mapping: `claim.graves-rai-active-ted-avoidance.general-avoidance`, `claim.graves-rai-active-ted-avoidance.worsening-risk`, `claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-active-ted-avoidance.v4` / `question.graves-rai-active-ted-avoidance.v4`

**Current patient presentation:** Jonah returns for Graves follow-up. His palpitations have improved, but ophthalmology still documents active moderate-to-severe thyroid eye disease. He asks whether the improvement removes the concern about therapeutic iodine-131.

**Question:** Which conclusion best fits this patient's current counseling?

1. Proceed with iodine-131 because improved palpitations indicate inactive eye disease
2. Proceed with iodine-131 because thyroid symptoms determine eye-disease activity
3. Continue to avoid iodine-131 because active moderate-to-severe eye disease persists
4. Continue to avoid iodine-131 because improved palpitations indicate worsening eye disease

**Key:** 3 — Continue to avoid iodine-131 because active moderate-to-severe eye disease persists.

**Explanation:** Improved thyroid symptoms do not by themselves establish that
thyroid eye disease is inactive. Documented active moderate-to-severe thyroid eye disease still supports general avoidance.

- Claim mapping: `claim.graves-rai-active-ted-avoidance.general-avoidance`, `claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction`, `claim.graves-rai-active-ted-avoidance.graves-background-findings`
- Exact-version status: `needs_clinician_review`

## Source records and claim mapping

| Stable source ID | Complete citation and official URL | Accessed | Source class / authority | Rights and intended use | Supported claims |
| --- | --- | --- | --- | --- | --- |
| `source.eanm.benign-thyroid-rai-guideline.2023` | Campennì A, Avram AM, Verburg FA, Iakovou I, Hänscheid H, de Keizer B, Petranović Ovčariček P, Giovanella L. [“The EANM guideline on radioiodine therapy of benign thyroid disease.”](https://link.springer.com/article/10.1007/s00259-023-06274-5) *European Journal of Nuclear Medicine and Molecular Imaging*. 2023;50:3324–3348. Published July 3, 2023. DOI: 10.1007/s00259-023-06274-5. | 2026-09-09 | Professional guideline; direct authority for therapeutic iodine-131 TED avoidance and worsening risk | CC BY 4.0 [license](https://creativecommons.org/licenses/by/4.0/). Original factual synthesis only; no source prose, tables, or algorithms reproduced. Source-record status: `needs_clinician_review`. | `claim.graves-rai-active-ted-avoidance.general-avoidance`; `claim.graves-rai-active-ted-avoidance.worsening-risk` |
| `source.ata.thyroid-eye-disease.undated` | American Thyroid Association. [“Thyroid Eye Disease.”](https://www.thyroid.org/thyroid-eye-disease/) Undated; institutional author. | 2026-09-09 | Professional-society patient education; authority for TED severity/referral context, thyroid-function distinction, and RAI worsening risk | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification and citation only; no source-expression reuse. Source-record status: `needs_clinician_review`. | `claim.graves-rai-active-ted-avoidance.general-avoidance`; `claim.graves-rai-active-ted-avoidance.worsening-risk`; `claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction` |
| `source.niddk.graves-disease.2021` | National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. [“Graves’ Disease.”](https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease) Last reviewed November 2021; institutional author. | 2026-09-09 | U.S. government patient education; independent cross-check for TED worsening risk, thyroid-function distinction, and Graves background | Rights/access: [NIDDK copyright policy](https://www.niddk.nih.gov/copyright) permits government public information subject to stated exceptions. Original factual synthesis only; no source-expression or graphics reuse. Source-record status: `needs_clinician_review`. | `claim.graves-rai-active-ted-avoidance.worsening-risk`; `claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction`; `claim.graves-rai-active-ted-avoidance.graves-background-findings` |

Source-to-claim mappings appear with each claim and variant-to-claim mappings appear
with each exact question. No source prose, tables, figures, algorithms, steroid
regimens, doses, timing instructions, exception protocol, or emergency treatment
is reproduced. Specialist exceptions are a limitation, not a scored treatment
choice. NICE, KTA, ETA, and unreverified consensus guidance are not used here.

## Material evidence and owner decisions still required

1. Confirm every presentation, question, choice, key, explanation, and claim mapping.
2. Confirm the active moderate-to-severe TED avoidance boundary and specialist-exception limitation.
3. Confirm the proposed capability mapping; no capability or runtime admission is approved.
4. Review source records and atomic claims independently; all remain `needs_clinician_review`.
5. This proposed sixth set does not alter the approved five-of-ten batch count.

Until named clinician approval records an exact version, this concept remains outside
runtime admission and publication. It does not approve a multi-decision pathway.
