# Owner Row 61: Graves RAI Appropriate-Candidate Counseling — Review Draft v1

Status: `needs_clinician_review`; proposed third review set only, with no
runtime or publication authorization

- Review version: `review.owner-row-061.graves-rai-appropriate-candidate.2026-09-09.1`
- Workthrough date: 2026-09-09
- Reviewer required: Melissa Rowland, MD (surgeon)
- Source record: `owner-concept.sheet1.row-061`
- Stable Tested Concept: `concept.graves.rai-appropriate-candidate`

## Approval boundary

The 2026-08-31 receipt approves the seed scope of selecting the reviewed
recurrent-Graves scenario for RAI evaluation. The 2026-09-09 recognition and
TRAb approvals do not approve this draft. All four exact versions below, their
claims, and their source metadata remain `needs_clinician_review`. This draft
does not approve a Patient Presentation Variant, Question Variant, explanation,
evidence package, runtime use, or publication.

## Proposed learning and release metadata

- Learning objective: recognize recurrent hyperthyroidism after antithyroid-drug
  withdrawal as a setting where RAI evaluation is a reasonable counseling
  option, while retaining surgery and continued or restarted antithyroid-drug
  treatment as choices shaped by clinical factors and patient preferences.
- Educational tier: proposed foundational.
- Patient acuity: proposed stable outpatient.
- Clinical setting: proposed clinic evaluation.
- Semantic release point: inherited `release.l0.clinic_evaluation` for
  counseling/referral.
- Proposed capability mapping: Examination Room and Founder physician; RAI
  counseling or referral may occur in clinic, with nuclear-medicine specialist
  consultation and treatment occurring offsite if later approved. No onsite RAI,
  nuclear-medicine facility unlock, or treatment administration is proposed.

The release point is a semantic circulation point, not release authorization.
The capability mapping requires owner confirmation. Pregnancy, lactation, and
active thyroid-eye-disease boundaries are separate future scored concepts. They
may appear only as background eligibility facts here and are not scored in this
set. All four variants below are alternate encounters for one FSRS identity and
one scored decision each.

## Atomic evidence claims

### `claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal`

For Graves disease, recurrent hyperthyroidism after antithyroid-drug withdrawal
is a setting in which RAI therapy may be considered.

- Evidence category: counseling selection
- Certainty/limitation: a guideline-supported indication for consideration, not
  a mandate or a universal preferred treatment for every recurrence.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.eanm.benign-thyroid-rai-guideline.2023`

### `claim.graves-rai-appropriate-candidate.preference-sensitive-options`

Antithyroid drugs, RAI, and surgery are treatment options for Graves disease;
their selection should incorporate the patient’s circumstances and preferences.

- Evidence category: counseling selection
- Certainty/limitation: this draft presents a bounded counseling choice and
  does not establish a universal treatment hierarchy.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.ata.graves-disease.undated`,
  `source.niddk.graves-disease.2021`

### `claim.graves-rai-appropriate-candidate.rai-treatment-role`

RAI is a nonsurgical, disease-directed treatment that destroys overactive
thyroid cells. Antithyroid drugs reduce thyroid-hormone production, while
beta-blocking medicines can control symptoms without reducing hormone
production.

- Evidence category: treatment role
- Certainty/limitation: distinguishes the broad roles of these options for the
  counseling question; it does not specify a dose, preparation regimen,
  treatment timeline, or universal treatment preference.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.eanm.benign-thyroid-rai-guideline.2023`,
  `source.niddk.graves-disease.2021`

### `claim.graves-rai-appropriate-candidate.graves-context`

Palpitations and heat intolerance are compatible with Graves hyperthyroidism;
a diffuse goiter and a positive TRAb result can add support for Graves disease
in the appropriate clinical context.

- Evidence category: diagnostic context
- Certainty/limitation: these features support the established diagnosis in
  the patient presentations but do not independently select RAI treatment.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.ata.graves-disease.undated`,
  `source.niddk.graves-disease.2021`

### `claim.graves-rai-appropriate-candidate.eligibility-context`

RAI evaluation requires individualized selection. Pregnancy and current
breastfeeding are contraindications to RAI treatment, while active thyroid eye
disease requires individualized assessment.

- Evidence category: eligibility boundary
- Certainty/limitation: these are background eligibility facts for this set;
  they do not replace the separate pregnancy, lactation, or thyroid-eye-disease
  concepts and do not create a self-directed treatment algorithm.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.eanm.benign-thyroid-rai-guideline.2023`

### `claim.graves-rai-appropriate-candidate.specialist-counseling-context`

RAI evaluation includes specialist counseling, informed consent, and practical
precaution instructions before treatment.

- Evidence category: treatment planning
- Certainty/limitation: a clinical counseling claim only; it does not determine
  where RAI is delivered or teach jurisdiction-specific requirements. The
  game's clinic-only counseling and referral boundary is release metadata, not
  a medical claim.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.eanm.benign-thyroid-rai-guideline.2023`

## Draft Patient Presentation and Question Variants

These are four separate fictional adult clinic encounters. First names are
illustrative review-only cosmetic labels, not runtime IDs, patient-age
eligibility rules, or required demographic fields. Any future generated identity
and character appearance must remain consistent within the encounter and vary
only within the approved clinical profile. All displays below are review order
only; a future runtime display must shuffle choices. The key is stated below
each complete answer set for exact review.

### `presentation.graves-rai-appropriate-candidate.v1` / `question.graves-rai-appropriate-candidate.v1`

**Current patient presentation:** Elena returns because palpitations and heat
intolerance recurred after withdrawal of an antithyroid drug. Her endocrinology
record documents established Graves disease and confirms recurrent
hyperthyroidism after withdrawal. She is stable in clinic; the chart explicitly
records that she is not pregnant or breastfeeding and has no active thyroid eye
disease. After discussing the available treatments, she asks for a definitive
nonsurgical option.

**Question:** Which counseling option best fits this patient's stated goal?

1. Restart antithyroid-drug treatment
2. Discuss RAI evaluation and referral
3. Arrange thyroidectomy consultation
4. Use beta-blocking medication for symptom control only

**Key:** 2 — Discuss RAI evaluation and referral.

**Explanation:** Confirmed recurrence after antithyroid-drug withdrawal is a
setting in which RAI evaluation is reasonable to discuss. RAI fits Elena's goal
because it is a nonsurgical treatment intended to destroy overactive thyroid
tissue. This does not promise freedom from later medication. Thyroidectomy and
antithyroid-drug treatment remain valid choices when they better fit a patient's
clinical circumstances and preferences; beta-blocking medication controls
symptoms without lowering thyroid-hormone production.

- Claim mapping: `claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal`,
  `claim.graves-rai-appropriate-candidate.preference-sensitive-options`,
  `claim.graves-rai-appropriate-candidate.rai-treatment-role`,
  `claim.graves-rai-appropriate-candidate.graves-context`,
  `claim.graves-rai-appropriate-candidate.eligibility-context`,
  `claim.graves-rai-appropriate-candidate.specialist-counseling-context`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-appropriate-candidate.v2` / `question.graves-rai-appropriate-candidate.v2`

**Current patient presentation:** Marcus returns because palpitations and heat
intolerance came back after withdrawal of an antithyroid drug. His chart
documents established Graves disease, including a prior positive TRAb result
and diffuse thyroid enlargement, and the endocrinology record confirms
recurrent hyperthyroidism after withdrawal. He is stable today and asks whether
RAI evaluation is reasonable.

**Question:** Which feature of this patient's record most strongly supports
considering RAI evaluation?

1. Initial report of palpitations at diagnosis
2. Prior positive TRAb result in the chart
3. Recurrent hyperthyroidism after drug withdrawal
4. Diffuse thyroid enlargement on examination

**Key:** 3 — Recurrent hyperthyroidism after drug withdrawal.

**Explanation:** The confirmed recurrence after antithyroid-drug withdrawal is
the record feature that directly supports considering RAI evaluation. The prior
TRAb result and diffuse enlargement support the Graves diagnosis, while the
initial palpitation history describes hormone excess; those findings do not by
themselves establish the same treatment-selection setting.

- Claim mapping: `claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal`,
  `claim.graves-rai-appropriate-candidate.preference-sensitive-options`,
  `claim.graves-rai-appropriate-candidate.graves-context`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-appropriate-candidate.v3` / `question.graves-rai-appropriate-candidate.v3`

**Current patient presentation:** Noor attends follow-up for established Graves
disease because palpitations and heat intolerance returned after withdrawal of
an antithyroid drug. She is stable and asks about RAI if the outside records
confirm that overt hyperthyroidism returned after a documented remission. The
clinician is reviewing her follow-up course after withdrawal before counseling
her about treatment options.

**Question:** Which follow-up course in this patient's records best supports
discussing RAI as a definitive option?

1. Thyroid function remained normal after medication withdrawal
2. Overt hyperthyroidism returned after a documented remission
3. Symptoms returned while thyroid function remained normal
4. Thyroid hormone levels remained low after medication withdrawal

**Key:** 2 — Overt hyperthyroidism returned after a documented remission.

**Explanation:** Confirmed recurrence of overt Graves hyperthyroidism after
antithyroid-drug withdrawal is a setting in which RAI may be considered as a
definitive option. Normal thyroid function, symptoms without biochemical
recurrence, or persistently low thyroid hormone levels do not establish that
recurrent hyperthyroid setting.

- Claim mapping: `claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal`,
  `claim.graves-rai-appropriate-candidate.preference-sensitive-options`,
  `claim.graves-rai-appropriate-candidate.graves-context`,
  `claim.graves-rai-appropriate-candidate.rai-treatment-role`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-appropriate-candidate.v4` / `question.graves-rai-appropriate-candidate.v4`

**Current patient presentation:** Jonah returns because palpitations and heat
intolerance recurred after withdrawal of an antithyroid drug. His chart
documents established Graves disease, and the endocrinology record confirms
recurrent hyperthyroidism after withdrawal. He is stable in clinic and asks
whether RAI is compulsory because antithyroid-drug treatment and surgery were
also discussed.

**Question:** What is the appropriate role of RAI in this patient's counseling?

1. RAI is required whenever hyperthyroidism recurs
2. RAI is excluded after prior antithyroid-drug treatment
3. RAI is reserved for recurrence after thyroid surgery
4. RAI can be weighed with antithyroid drugs and surgery

**Key:** 4 — RAI can be weighed with antithyroid drugs and surgery.

**Explanation:** RAI is a reasonable option to discuss after confirmed recurrent
Graves hyperthyroidism following antithyroid-drug withdrawal. It is not
compulsory after every recurrence, excluded because of prior drug treatment, or
reserved until after surgery. The choice among RAI, antithyroid-drug treatment,
and surgery depends on clinical circumstances and the patient's preferences.

- Claim mapping: `claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal`,
  `claim.graves-rai-appropriate-candidate.preference-sensitive-options`,
  `claim.graves-rai-appropriate-candidate.graves-context`
- Exact-version status: `needs_clinician_review`

## Source records and claim mapping

| Stable source ID | Complete citation and official URL | Accessed | Source class / authority | Rights and intended use | Supported claims |
| --- | --- | --- | --- | --- | --- |
| `source.eanm.benign-thyroid-rai-guideline.2023` | Campennì A, Avram AM, Verburg FA, Iakovou I, Hänscheid H, de Keizer B, Petranović Ovčariček P, Giovanella L. [“The EANM guideline on radioiodine therapy of benign thyroid disease.”](https://link.springer.com/article/10.1007/s00259-023-06274-5) *European Journal of Nuclear Medicine and Molecular Imaging*. 2023;50:3324–3348. Published July 3, 2023. DOI: 10.1007/s00259-023-06274-5. | 2026-09-09 | Professional guideline; direct authority for recurrent-Graves RAI indication and selection boundaries | CC BY 4.0 article license: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Original factual synthesis only; no source-expression, tables, or algorithms reproduced. Source-record status: `needs_clinician_review`. | `claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal`; `claim.graves-rai-appropriate-candidate.rai-treatment-role`; `claim.graves-rai-appropriate-candidate.eligibility-context`; `claim.graves-rai-appropriate-candidate.specialist-counseling-context` |
| `source.ata.graves-disease.undated` | American Thyroid Association. [“Graves’ Disease”](https://www.thyroid.org/graves-disease/). Undated; institutional author. | 2026-09-09 | Professional-society patient-education page; authority for treatment-option, preference, symptom, goiter, and TRAb context | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification and citation only; no source-expression reuse or redistribution. Source-record status: `needs_clinician_review`. | `claim.graves-rai-appropriate-candidate.preference-sensitive-options`; `claim.graves-rai-appropriate-candidate.graves-context` |
| `source.niddk.graves-disease.2021` | National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. [“Graves’ Disease”](https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease). Last reviewed November 2021; institutional author. | 2026-09-09 | U.S. government patient-education page; independent cross-check for treatment options, treatment roles, and symptom context | Rights/access: [NIDDK copyright policy](https://www.niddk.nih.gov/copyright) permits general public information subject to stated exceptions. Fact verification only; independently written synthesis, no source-expression reuse. Source-record status: `needs_clinician_review`. | `claim.graves-rai-appropriate-candidate.preference-sensitive-options`; `claim.graves-rai-appropriate-candidate.rai-treatment-role`; `claim.graves-rai-appropriate-candidate.graves-context` |

Source-to-claim mappings appear with each claim and variant-to-claim mappings
appear with each exact question version. No source prose, tables, figures, or
algorithms are reproduced. The EANM guideline is the only directly verified
source in this packet for recurrence after antithyroid-drug withdrawal as an
RAI indication; the ATA and NIDDK sources independently cross-check treatment
options but do not independently establish that indication. KTA 2025, ETA 2018,
and NICE NG145 are not used as verified evidence in this draft.

## Material evidence and owner decisions still required

1. Confirm or revise every complete patient presentation, question, choice,
   key, explanation, and claim mapping. No exact version in this draft is
   approved.
2. Confirm that the recurrence-after-withdrawal indication and preference-
   sensitive option boundaries are appropriate at the proposed foundational
   tier.
3. Confirm that background eligibility facts are sufficient and remain distinct
   from the separately scored pregnancy, lactation, and thyroid-eye-disease
   concepts.
4. Confirm the proposed Examination Room and Founder-physician capability
   mapping. No capability mapping is approved by the historical receipt.
5. Review the source records and atomic claims independently. Their metadata
   and prose remain `needs_clinician_review`; direct independent support for the
   recurrence indication is limited to the currently verified EANM guideline.
6. This proposed third set does not alter the current two-of-ten batch count.
   Implementation, release, evidence, capability, and publication remain
   separate gates.

Until a named clinician approves an exact version, this concept remains outside
runtime admission and publication. Approval of this concept would not approve
the other three remaining Graves/RAI concept sets or a multi-decision pathway.
