# Owner Row 61: Graves RAI Pregnancy Contraindication — Review Draft v1

Status: `needs_clinician_review`; proposed fourth review set only, with no
runtime or publication authorization

- Review version: `review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1`
- Workthrough date: 2026-09-09
- Reviewer required: Melissa Rowland, MD (surgeon)
- Source record: `owner-concept.sheet1.row-061`
- Stable Tested Concept: `concept.graves.rai-pregnancy-contraindication`

## Approval boundary and proposed metadata

The 2026-08-31 receipt approves this seed scope only. The three 2026-09-09
exact approvals do not approve this draft. Every exact version, claim, and
source record below remains `needs_clinician_review`.

- Learning objective: recognize current pregnancy as a contraindication to RAI
  treatment for Graves disease, while continuing appropriate endocrine and
  obstetric assessment without RAI during pregnancy.
- Educational tier: proposed foundational.
- Patient acuity: proposed stable outpatient.
- Clinical setting: proposed clinic evaluation.
- Semantic release point: inherited `release.l0.clinic_evaluation` for
  counseling/referral.
- Proposed capability mapping: Examination Room and Founder physician; clinic
  counseling/referral only, with no onsite RAI or nuclear-medicine unlock.

Pregnancy is an explicit locked clinical fact, never inferred from name,
pronouns, appearance, or a cosmetic generated identity. Names, ages, genders,
and appearances are illustrative review renderings only and may later vary
within approved clinical constraints while staying consistent within one
encounter. Release, capability, evidence, runtime admission, and publication
remain separate gates. Lactation and thyroid-eye-disease boundaries are
separate concepts and are not scored here.

## Atomic evidence claims

### `claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication`

RAI treatment is contraindicated throughout pregnancy for a patient with Graves
disease.

- Evidence category: treatment safety boundary
- Certainty/limitation: applies to RAI treatment; it does not prohibit clinical
  counseling, referral, or other individualized pregnancy care.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.eanm.benign-thyroid-rai-guideline.2023`,
  `source.niddk.thyroid-disease-pregnancy.2017`

### `claim.graves-rai-pregnancy-contraindication.fetal-thyroid-harm-mechanism`

Radioiodine can cross the placenta, be taken up by the fetal thyroid, and harm
or destroy fetal thyroid tissue, causing permanent hypothyroidism.

- Evidence category: safety mechanism
- Certainty/limitation: explains the treatment exclusion; this draft does not
  teach timing, dose, fetal testing, or pregnancy-loss counseling.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.ata.hyperthyroidism-in-pregnancy.undated`

### `claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary`

Avoiding RAI during pregnancy does not end care: endocrine and obstetric
assessment and individually tailored monitoring can continue.

- Evidence category: care-continuity boundary
- Certainty/limitation: no regimen, dose, surgery timing, or assertion that all
  pregnant patients require medication is taught.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.niddk.thyroid-disease-pregnancy.2017`,
  `source.ata.hyperthyroidism-in-pregnancy.undated`

### `claim.graves-rai-pregnancy-contraindication.graves-context-findings`

Palpitations, tremor, diffuse thyroid enlargement, and a positive TRAb result
can provide clinical and diagnostic context supporting Graves disease.

- Evidence category: diagnostic context
- Certainty/limitation: background context only; it is not a separate scored
  recognition or antibody-interpretation concept in this packet.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.ata.graves-disease.undated`

## Draft Patient Presentation and Question Variants

These are four separate fictional adult clinic encounters. Review choice
positions may include a key first; runtime choices must shuffle. Keys below are
review order only.

### `presentation.graves-rai-pregnancy-contraindication.v1` / `question.graves-rai-pregnancy-contraindication.v1`

**Current patient presentation:** Maya attends a Graves counseling visit after
learning that she is currently pregnant. She asks whether RAI could provide a
definitive treatment during this pregnancy.

**Question:** Which statement best describes RAI treatment for this patient?

1. It is acceptable only early in pregnancy
2. It is acceptable only late in pregnancy
3. It is contraindicated throughout pregnancy
4. It is acceptable after obstetric referral

**Key:** 3 — It is contraindicated throughout pregnancy.

**Explanation:** Current pregnancy contraindicates RAI treatment. This does
not prevent counseling or appropriate endocrine and obstetric assessment.

- Claim mapping: `claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication`,
  `claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-pregnancy-contraindication.v2` / `question.graves-rai-pregnancy-contraindication.v2`

**Current patient presentation:** Elena returns for RAI counseling after a
Graves recurrence. Updated records are arriving before treatment selection; she
has tremor and palpitations but remains stable in clinic.

**Question:** Which new finding would make RAI treatment contraindicated now?

1. Confirmed current pregnancy
2. Persistent hand tremor
3. Positive TRAb result
4. Diffuse thyroid enlargement

**Key:** 1 — Confirmed current pregnancy.

**Explanation:** Confirmed pregnancy changes the treatment-safety boundary for
RAI. The other findings may describe Graves disease or its activity but do not
state this pregnancy contraindication.

- Claim mapping: `claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication`,
  `claim.graves-rai-pregnancy-contraindication.graves-context-findings`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-pregnancy-contraindication.v3` / `question.graves-rai-pregnancy-contraindication.v3`

**Current patient presentation:** Priya, who is currently pregnant, meets the
clinic team to understand why RAI is excluded from her Graves treatment plan.
She asks what risk makes the treatment unsafe in pregnancy.

**Question:** Which effect best explains excluding RAI treatment for this
patient?

1. It blocks fetal thyroid hormone receptors
2. It causes fetal thyroid tissue damage
3. It prevents maternal thyroid blood flow
4. It prevents placental thyroid-hormone transfer

**Key:** 2 — It causes fetal thyroid tissue damage.

**Explanation:** Radioiodine can cross the placenta and be taken up by the fetal
thyroid, where it can damage thyroid tissue and cause permanent hypothyroidism.

- Claim mapping: `claim.graves-rai-pregnancy-contraindication.fetal-thyroid-harm-mechanism`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-pregnancy-contraindication.v4` / `question.graves-rai-pregnancy-contraindication.v4`

**Current patient presentation:** Nora is currently pregnant and worried that
excluding RAI means no one can continue helping with her Graves disease. She
comes to clinic to discuss what care can continue during pregnancy.

**Question:** Which counseling conclusion best fits this patient's care now?

1. Defer thyroid assessment until the pregnancy has ended
2. Reconsider RAI once the first trimester has ended
3. Continue endocrine and obstetric care without RAI
4. Proceed with RAI once thyroid hormone levels improve

**Key:** 3 — Continue endocrine and obstetric care without RAI.

**Explanation:** RAI remains excluded during pregnancy, but endocrine and
obstetric care can continue with care tailored to Nora.

- Claim mapping: `claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication`,
  `claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary`
- Exact-version status: `needs_clinician_review`

## Source records and claim mapping

| Stable source ID | Complete citation and official URL | Accessed | Source class / authority | Rights and intended use | Supported claims |
| --- | --- | --- | --- | --- | --- |
| `source.eanm.benign-thyroid-rai-guideline.2023` | Campennì A, Avram AM, Verburg FA, Iakovou I, Hänscheid H, de Keizer B, Petranović Ovčariček P, Giovanella L. [“The EANM guideline on radioiodine therapy of benign thyroid disease.”](https://link.springer.com/article/10.1007/s00259-023-06274-5) *European Journal of Nuclear Medicine and Molecular Imaging*. 2023;50:3324–3348. DOI: 10.1007/s00259-023-06274-5. | 2026-09-09 | Professional guideline; direct authority for RAI pregnancy contraindication | CC BY 4.0: [license](https://creativecommons.org/licenses/by/4.0/). Original factual synthesis only; no source prose, tables, or algorithms reproduced. Source-record status: `needs_clinician_review`. | `claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication` |
| `source.niddk.thyroid-disease-pregnancy.2017` | National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. [“Thyroid Disease & Pregnancy”](https://www.niddk.nih.gov/health-information/endocrine-diseases/pregnancy-thyroid-disease). Last reviewed December 2017; institutional author. | 2026-09-09 | U.S. government patient education; independent cross-check for pregnancy treatment boundary and ongoing care | Rights/access: [NIDDK copyright policy](https://www.niddk.nih.gov/copyright) permits public information subject to stated exceptions. Fact verification only; independently written synthesis, no source-expression reuse. Older patient education, not a current guideline. Source-record status: `needs_clinician_review`. | `claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication`; `claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary` |
| `source.ata.hyperthyroidism-in-pregnancy.undated` | American Thyroid Association. [“Hyperthyroidism in Pregnancy”](https://www.thyroid.org/hyperthyroidism-in-pregnancy/). Undated; institutional author. | 2026-09-09 | Professional-society patient education; authority for fetal mechanism and tailored ongoing care | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification only; no source-expression reuse. Source-record status: `needs_clinician_review`. | `claim.graves-rai-pregnancy-contraindication.fetal-thyroid-harm-mechanism`; `claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary` |
| `source.ata.graves-disease.undated` | American Thyroid Association. [“Graves’ Disease”](https://www.thyroid.org/graves-disease/). Undated; institutional author. | 2026-09-09 | Professional-society patient education; authority for Graves clinical and diagnostic context | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification only; no source-expression reuse. Source-record status: `needs_clinician_review`. | `claim.graves-rai-pregnancy-contraindication.graves-context-findings` |

Source-to-claim mappings appear with each claim and variant-to-claim mappings
appear with each exact question. No source prose, tables, figures, or algorithms
are reproduced. The 2026 ATA pregnancy guideline is intentionally excluded from
evidence because its publisher’s AI policy requires a separate license; NICE,
ETA, and KTA are also not used as verified evidence here.

## Material evidence and owner decisions still required

1. Confirm every presentation, question, choice, key, explanation, and claim
   mapping. No exact version in this draft is approved.
2. Confirm that treatment contraindication, fetal thyroid mechanism, and
   continued-assessment boundaries are appropriate at the foundational tier.
3. Confirm proposed clinic capability mapping; it is not approved by this
   historical scope receipt.
4. Review source and claim metadata independently; all remain
   `needs_clinician_review`.
5. This proposed fourth set does not change the approved batch count of three.
   Implementation remains held until ten separately approved sets exist.

Until named clinician approval records an exact version, this concept remains
outside runtime admission and publication. It does not approve the remaining
two Graves/RAI concept sets or a multi-decision pathway.
