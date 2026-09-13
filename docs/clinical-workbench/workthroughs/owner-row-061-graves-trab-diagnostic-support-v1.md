# Owner Row 61: Graves TRAb Diagnostic Support — Review Draft v1

Status: `needs_clinician_review`; proposed second review set only, with no
runtime or publication authorization

- Review version: `review.owner-row-061.graves-trab-diagnostic-support.2026-09-09.1`
- Workthrough date: 2026-09-09
- Reviewer required: Melissa Rowland, MD (surgeon)
- Source record: `owner-concept.sheet1.row-061`
- Stable Tested Concept: `concept.graves.trab-diagnostic-support`

## Approval boundary

The 2026-08-31 receipt approves the seed scope of identifying TRAb as
diagnostic support in the approved Graves workup. The 2026-09-09 approval of
the separate recognition set does not approve this draft. All four exact
versions below, their claims, and their source metadata remain
`needs_clinician_review`. This artifact does not approve a Patient Presentation
Variant, Question Variant, explanation, evidence package, runtime use, or
publication.

## Proposed learning and release metadata

- Learning objective: use TRAb as etiologic support for Graves disease when a
  patient already has biochemical thyrotoxicosis; recognize that thyroid
  function tests establish function rather than Graves cause, and that a
  negative TRAb result does not fully exclude Graves disease.
- Educational tier: proposed foundational.
- Patient acuity: proposed stable outpatient.
- Clinical setting: proposed clinic evaluation.
- Semantic release point: inherited `release.l0.clinic_evaluation` for
  counseling/referral.
- Proposed capability mapping: Examination Room and Founder physician; tests
  may be ordered offsite and results reviewed in clinic. No onsite laboratory,
  nuclear-medicine, or imaging facility unlock is proposed.

The release point is a semantic circulation point, not release authorization.
The capability mapping requires owner confirmation. This concept does not
choose treatment, radioactive iodine, pregnancy/lactation management,
thyroid-eye-disease management, a mandatory imaging sequence, or a separate
antibody domain. All four variants below are alternate encounters for one FSRS
identity and one scored decision each.

## Atomic evidence claims

### `claim.graves-trab-diagnostic-support.positive-trab-supports-etiology`

In a patient with compatible clinical findings and biochemical thyrotoxicosis,
a positive TRAb result supports Graves disease as the etiology.

- Evidence category: etiologic evaluation
- Certainty/limitation: supportive in clinical context, not a stand-alone
  replacement for the complete evaluation.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.ata.graves-disease.undated`,
  `source.niddk.graves-disease.2021`

### `claim.graves-trab-diagnostic-support.negative-trab-not-full-exclusion`

A negative TRAb result does not fully exclude Graves disease when the clinical
and biochemical context remains compatible.

- Evidence category: safety boundary
- Certainty/limitation: the result changes diagnostic support but does not
  independently resolve the cause or prescribe a next imaging step.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.ata.graves-disease.undated`

### `claim.graves-trab-diagnostic-support.function-versus-cause`

TSH, T4, and T3 results describe thyroid function, whereas TRAb supplies
etiologic antibody evidence relevant to Graves disease.

- Evidence category: evaluation distinction
- Certainty/limitation: this draft uses qualitative result labels only and does
  not teach thresholds, assay selection beyond TRAb, or broad antibody panels.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.ata.thyroid-function-tests.undated`,
  `source.niddk.thyroid-tests.2017`

### `claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context`

A low TSH result with a high free T4 result is a biochemical pattern of thyroid
hormone excess; those functional results do not by themselves identify Graves
disease as the cause.

- Evidence category: clinical context
- Certainty/limitation: qualitative functional context only; this draft does
  not teach thresholds, severity classification, or a treatment decision.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.ata.thyroid-function-tests.undated`

### `claim.graves-trab-diagnostic-support.symptom-goiter-context`

Palpitations, heat intolerance, unintentional weight loss, and diffuse thyroid
enlargement can accompany Graves disease; these findings alone do not establish
the cause of thyrotoxicosis.

- Evidence category: clinical context
- Certainty/limitation: supporting presentation context only; a full clinical
  evaluation remains necessary.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.ata.graves-disease.undated`,
  `source.niddk.graves-disease.2021`

## Draft Patient Presentation and Question Variants

These are four separate fictional adult clinic encounters. First names are
illustrative review-only cosmetic labels, not runtime IDs, patient-age
eligibility rules, or required demographic fields. All displays below are
review order only; a future runtime display must shuffle choices. The key is
stated below each complete answer set for exact review.

### `presentation.graves-trab-diagnostic-support.v1` / `question.graves-trab-diagnostic-support.v1`

**Current patient presentation:** Carmen attends clinic to discuss palpitations
and heat intolerance. Outside testing has already documented biochemical
thyrotoxicosis, but the cause remains unclear after today’s focused history and
examination.

**Question:** Which blood test would most directly add etiologic support for
Graves disease in this patient?

1. Total T3 measurement
2. Free T4 measurement
3. TSH measurement
4. TRAb measurement

**Key:** 4 — TRAb measurement.

**Explanation:** The available thyroid function results establish that Carmen
has thyrotoxicosis but do not identify its cause. A TRAb result adds antibody
evidence relevant to Graves etiology; this question does not select treatment
or require an imaging pathway.

- Claim mapping: `claim.graves-trab-diagnostic-support.function-versus-cause`,
  `claim.graves-trab-diagnostic-support.positive-trab-supports-etiology`,
  `claim.graves-trab-diagnostic-support.symptom-goiter-context`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-trab-diagnostic-support.v2` / `question.graves-trab-diagnostic-support.v2`

**Current patient presentation:** Daniel returns to clinic after palpitations
and heat intolerance prompted outside testing. The report shows low TSH and
high free T4. Today’s examination shows diffuse thyroid enlargement, and the
ordered TRAb result is positive.

**Question:** Which cause best fits this patient's current findings and test
results?

1. Painless thyroiditis
2. Toxic adenoma
3. Toxic multinodular goiter
4. Graves disease

**Key:** 4 — Graves disease.

**Explanation:** Daniel’s thyroid function results establish hormone excess,
while the positive TRAb result adds etiologic support for Graves disease in the
current clinical context. The function results alone would not identify the
cause.

- Claim mapping: `claim.graves-trab-diagnostic-support.positive-trab-supports-etiology`,
  `claim.graves-trab-diagnostic-support.function-versus-cause`,
  `claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context`,
  `claim.graves-trab-diagnostic-support.symptom-goiter-context`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-trab-diagnostic-support.v3` / `question.graves-trab-diagnostic-support.v3`

**Current patient presentation:** Iris is evaluated in clinic for palpitations
and heat intolerance. Outside testing shows low TSH and high free T4, and
today’s examination shows diffuse thyroid enlargement. Her TRAb result is
negative.

**Question:** Which interpretation best fits this patient's negative TRAb
result?

1. Graves disease is excluded
2. Thyroiditis is established
3. Graves disease remains possible
4. Nodular autonomy is established

**Key:** 3 — Graves disease remains possible.

**Explanation:** A negative TRAb result does not fully exclude Graves disease
when the clinical and biochemical context remains compatible. This result does
not by itself establish another cause or determine the degree of hormone
excess.

- Claim mapping: `claim.graves-trab-diagnostic-support.negative-trab-not-full-exclusion`,
  `claim.graves-trab-diagnostic-support.function-versus-cause`,
  `claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context`,
  `claim.graves-trab-diagnostic-support.symptom-goiter-context`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-trab-diagnostic-support.v4` / `question.graves-trab-diagnostic-support.v4`

**Current patient presentation:** Omar returns to clinic to discuss
palpitations and unintentional weight loss. Outside results have already shown
low TSH and high free T4, so thyrotoxicosis is established while its cause
remains under evaluation. Supplemental results are available for review today.

**Question:** Which supplemental result most specifically supports Graves
disease as the cause in this patient?

1. A high total T3 result
2. A low TSH result
3. A positive TRAb result
4. A high free T4 result

**Key:** 3 — A positive TRAb result.

**Explanation:** TSH, T4, and T3 results describe thyroid function. A positive
TRAb result supplies antibody evidence that supports a Graves etiology in the
appropriate clinical context.

- Claim mapping: `claim.graves-trab-diagnostic-support.function-versus-cause`,
  `claim.graves-trab-diagnostic-support.positive-trab-supports-etiology`,
  `claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context`,
  `claim.graves-trab-diagnostic-support.symptom-goiter-context`
- Exact-version status: `needs_clinician_review`

## Source records and claim mapping

| Stable source ID | Complete citation and official URL | Accessed | Source class / authority | Rights and intended use | Supported claims |
| --- | --- | --- | --- | --- | --- |
| `source.ata.graves-disease.undated` | American Thyroid Association. [“Graves’ Disease”](https://www.thyroid.org/graves-disease/). Undated; institutional author. | 2026-09-09 | Professional-society patient-education page; targeted authority for TRAb/TSI diagnostic context | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification and citation only; no source-expression reuse or redistribution. Source-record status: `needs_clinician_review`. | `claim.graves-trab-diagnostic-support.positive-trab-supports-etiology`; `claim.graves-trab-diagnostic-support.negative-trab-not-full-exclusion`; `claim.graves-trab-diagnostic-support.symptom-goiter-context` |
| `source.ata.thyroid-function-tests.undated` | American Thyroid Association. [“Thyroid Function Tests”](https://www.thyroid.org/thyroid-function-tests/). Undated; institutional author. | 2026-09-09 | Professional-society patient-education page; targeted authority for function and antibody-test distinctions | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification and citation only; no source-expression reuse or redistribution. Source-record status: `needs_clinician_review`. | `claim.graves-trab-diagnostic-support.function-versus-cause`; `claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context` |
| `source.niddk.graves-disease.2021` | National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. [“Graves’ Disease”](https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease). Last reviewed November 2021; institutional author. | 2026-09-09 | U.S. government patient-education page; independent cross-check for Graves symptoms, goiter, and TSI mechanism/diagnostic context | Rights/access: [NIDDK copyright policy](https://www.niddk.nih.gov/copyright) permits general public information subject to stated exceptions. Fact verification only; independently written synthesis, no source-expression reuse. It is not direct evidence for every TRAb assay. Source-record status: `needs_clinician_review`. | `claim.graves-trab-diagnostic-support.positive-trab-supports-etiology`; `claim.graves-trab-diagnostic-support.symptom-goiter-context` |
| `source.niddk.thyroid-tests.2017` | National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. [“Thyroid Tests”](https://www.niddk.nih.gov/health-information/diagnostic-tests/thyroid). Last reviewed May 2017; institutional author. | 2026-09-09 | U.S. government patient-education page; independent cross-check for thyroid-function testing | Rights/access: [NIDDK copyright policy](https://www.niddk.nih.gov/copyright) permits general public information subject to stated exceptions. Fact verification only; independently written synthesis, no source-expression reuse. Source-record status: `needs_clinician_review`. | `claim.graves-trab-diagnostic-support.function-versus-cause` |

Source-to-claim mappings appear with each claim and variant-to-claim mappings
appear with each exact question version. No source prose, tables, figures, or
algorithms are reproduced. NICE NG145 is intentionally excluded because its
terms do not permit this AI use; the historical 2018 ETA guideline was not
directly reverified and is not used as evidence in this draft.

## Material evidence and owner decisions still required

1. Confirm or revise every complete patient presentation, question, choice,
   key, explanation, and claim mapping. No exact version in this draft is
   approved.
2. Confirm the qualitative function-versus-cause distinction and the negative
   TRAb boundary are appropriate at the proposed foundational tier.
3. Confirm the proposed Examination Room and Founder-physician capability
   mapping. No capability mapping is approved by the historical receipt.
4. Review the source records and atomic claims independently. Their metadata
   and prose remain `needs_clinician_review`.
5. The negative-TRAb boundary has one directly verified source in this draft
   (`source.ata.graves-disease.undated`); an independently verified direct
   cross-check remains a limitation.
6. This proposed second set does not alter the current one-of-ten batch count.
   Implementation, release, evidence, capability, and publication remain
   separate gates.

Until a named clinician approves an exact version, this concept remains outside
runtime admission and publication. Approval of this concept would not approve
the other four remaining Graves/RAI concept sets or a multi-decision pathway.
