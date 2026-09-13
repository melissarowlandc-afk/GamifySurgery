# Owner Row 61: Graves Clinical-Pattern Recognition — Review Draft v2

Status: `needs_clinician_review`; review artifact only, with no runtime or
publication authorization

- Review version: `review.owner-row-061.graves-pattern-recognition.2026-09-09.2`
- Workthrough date: 2026-09-09
- Reviewer required: Melissa Rowland, MD (surgeon)
- Source record: `owner-concept.sheet1.row-061`
- Stable Tested Concept: `concept.graves.clinical-pattern-recognition`

## Version and approval boundary

The v1 artifact is preserved. This v2 supersedes v1 only for patient-presentation
wording, following owner feedback that every question must make sense inside a
current patient presentation. The owner’s positive content feedback is not
exact named-clinician approval of this wording.

The 2026-08-31 receipt approves the stable concept's seed **scope**: recognize
the approved classic Graves clinical pattern. The original seed wording is not
available. Accordingly, the four exact versions below, including the version
that reconstructs the seed's retrieval direction, are newly authored and each
remains `needs_clinician_review`. This draft does not approve a question stem,
answer set, explanation, Patient Presentation Variant, encounter blueprint,
evidence package, runtime use, or publication.

## Proposed learning and release metadata

- Learning objective: recognize an adult clinical pattern that supports Graves
  disease: symptoms compatible with thyroid-hormone excess together with
  diffuse thyroid enlargement and characteristic eye or pretibial skin findings
  when present. A learner must not infer that every person with Graves disease
  has every feature.
- Educational tier: proposed foundational.
- Patient acuity: proposed stable outpatient.
- Clinical setting: proposed clinic evaluation.
- Semantic release point: proposed `release.l0.clinic_evaluation`.
- Proposed capability mapping: Examination Room and Founder physician; any
  already available offsite laboratory information is reviewed presentation
  context. No scored laboratory-interpretation decision, onsite laboratory or
  imaging gate, or treatment is proposed.

The release point is a semantic circulation point, not release authorization.
The capability mapping itself requires owner confirmation. This recognition
concept does not select TRAb testing, interpret laboratory values, choose
radioactive iodine, or manage pregnancy, lactation, or thyroid eye disease;
those are separately approved row-61 concept scopes. All four variants below
remain alternate encounters for one FSRS identity and one scored decision each.

## Atomic evidence claims

### `claim.graves-pattern-recognition.classic-clinical-constellation`

Thyroid-hormone-excess symptoms with diffuse thyroid enlargement and bilateral
proptosis form a clinical pattern that supports Graves disease.

- Evidence category: recognition
- Certainty/limitation: a supporting pattern, not a stand-alone diagnostic
  rule; Graves disease may occur without proptosis.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.niddk.graves-disease.2021`,
  `source.ata.graves-disease.undated`

### `claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific`

Palpitations, heat intolerance, tremor, sweating, unintentional weight loss,
and muscle weakness can occur with thyroid-hormone excess but do not alone
establish its cause.

- Evidence category: safety boundary
- Certainty/limitation: the variants use a fuller clinical pattern and do not
  teach diagnosis from symptoms alone.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.niddk.hyperthyroidism.2021`

### `claim.graves-pattern-recognition.pretibial-dermopathy-association`

Pretibial dermopathy, such as thickened raised plaques over the anterior shins,
is an associated Graves finding that can add support to an otherwise compatible
clinical pattern.

- Evidence category: recognition
- Certainty/limitation: an associated finding, not a required feature or
  independent diagnostic rule.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.niddk.graves-disease.2021`,
  `source.ata.graves-disease.undated`

### `claim.graves-pattern-recognition.nodular-thyroid-disease-boundary`

Overactive thyroid nodules can cause thyroid-hormone excess, so hormone-excess
symptoms do not by themselves distinguish Graves disease from nodular disease.

- Evidence category: differential boundary
- Certainty/limitation: a competing cause of thyroid-hormone excess; this
  draft does not teach imaging, laboratory testing, or management.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.niddk.hyperthyroidism.2021`

### `claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary`

Subacute thyroiditis can present with a painful enlarged thyroid and is a
competing clinical presentation when thyroid-hormone excess is documented.

- Evidence category: differential boundary
- Certainty/limitation: this draft identifies a competing presentation only;
  it does not teach thyroiditis testing or treatment.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting source: `source.niddk.hyperthyroidism.2021`

## Draft Patient Presentation and Question Variants

These are four separate fictional adult encounters. First names are illustrative
review-only cosmetic labels, not runtime IDs, patient-age eligibility rules, or
required demographic fields. All displays below are review order only; a future
runtime display must shuffle choices. The key is stated below each complete
answer set for exact review.

### `presentation.graves-pattern-recognition.v1` / `question.graves-pattern-recognition.v1`

**Current patient presentation:** Maya attends clinic because palpitations,
heat intolerance, hand tremor, and unintentional weight loss are interfering
with daily activities. Her current examination shows a diffusely enlarged
thyroid and bilateral proptosis.

**Question:** Which cause of thyrotoxicosis most likely explains this patient's
findings?

1. Toxic multinodular goiter
2. Painful subacute thyroiditis
3. Graves disease
4. Toxic adenoma

**Key:** 3 — Graves disease.

**Explanation:** The diffuse thyroid enlargement with bilateral proptosis
supports Graves disease in the setting of symptoms compatible with
thyroid-hormone excess. Painful subacute thyroiditis and nodular causes are
alternative causes of thyrotoxicosis, but do not describe this full pattern.

- Claim mapping: `claim.graves-pattern-recognition.classic-clinical-constellation`,
  `claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific`,
  `claim.graves-pattern-recognition.nodular-thyroid-disease-boundary`,
  `claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-pattern-recognition.v2` / `question.graves-pattern-recognition.v2`

**Current patient presentation:** Jonah is seen in clinic after outside testing
documented thyrotoxicosis. During today’s examination, the clinician notes fine
hand tremor, resting tachycardia, bilateral proptosis, and muscle weakness.

**Question:** Which finding in this patient's examination most strongly
supports Graves disease as the cause?

1. Fine hand tremor
2. Resting tachycardia
3. Bilateral proptosis
4. Muscle weakness

**Key:** 3 — Bilateral proptosis.

**Explanation:** Fine tremor, resting tachycardia, and muscle weakness may
accompany thyroid-hormone excess from more than one cause. Bilateral proptosis
is the finding here that most strongly supports Graves disease; it is
supportive, not required in every patient.

- Claim mapping: `claim.graves-pattern-recognition.classic-clinical-constellation`,
  `claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-pattern-recognition.v3` / `question.graves-pattern-recognition.v3`

**Current patient presentation:** Leah returns to clinic after outside testing
documented thyrotoxicosis and reports neck fullness. Graves disease is being
considered. A focused thyroid and eye examination is planned today.

**Question:** Which examination pattern in this patient would most support
Graves disease?

1. A tender enlarged thyroid and localized neck pain
2. Multiple discrete thyroid nodules and fine hand tremor
3. One discrete thyroid nodule and a rapid pulse
4. Diffuse thyroid enlargement and bilateral proptosis

**Key:** 4 — Diffuse thyroid enlargement and bilateral proptosis.

**Explanation:** The keyed finding pattern combines diffuse enlargement and
bilateral proptosis. Painful thyroid enlargement and nodular thyroid findings
describe competing clinical presentations; this item does not determine their
final diagnoses.

- Claim mapping: `claim.graves-pattern-recognition.classic-clinical-constellation`,
  `claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific`,
  `claim.graves-pattern-recognition.nodular-thyroid-disease-boundary`,
  `claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-pattern-recognition.v4` / `question.graves-pattern-recognition.v4`

**Current patient presentation:** Priya attends clinic for sweating,
palpitations, difficulty tolerating heat, and new changes over the shins. Her
examination shows diffuse thyroid enlargement and thickened raised plaques over
the anterior shins. Proptosis is not present.

**Question:** Which cause of thyrotoxicosis most likely explains this patient's
findings?

1. Painful subacute thyroiditis
2. Toxic adenoma
3. Graves disease
4. Toxic multinodular goiter

**Key:** 3 — Graves disease.

**Explanation:** The compatible symptoms, diffuse enlargement, and pretibial
dermopathy support Graves disease even though proptosis is absent. Neither
proptosis nor dermopathy is required to identify Graves disease.

- Claim mapping: `claim.graves-pattern-recognition.classic-clinical-constellation`,
  `claim.graves-pattern-recognition.pretibial-dermopathy-association`,
  `claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific`,
  `claim.graves-pattern-recognition.nodular-thyroid-disease-boundary`,
  `claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary`
- Exact-version status: `needs_clinician_review`

## Source records and claim mapping

| Stable source ID | Complete citation and official URL | Accessed | Source class / authority | Rights and intended use | Supported claims |
| --- | --- | --- | --- | --- | --- |
| `source.niddk.graves-disease.2021` | National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. [“Graves’ Disease”](https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease). Last reviewed November 2021; institutional author. | 2026-09-09 | U.S. government patient-education page; high authority for basic recognition facts | Rights/access: [NIDDK copyright policy](https://www.niddk.nih.gov/copyright) permits general public information subject to stated exceptions. Fact verification only; independently written synthesis, no source-expression reuse. Source-record status: `needs_clinician_review`. | `claim.graves-pattern-recognition.classic-clinical-constellation`; `claim.graves-pattern-recognition.pretibial-dermopathy-association` |
| `source.niddk.hyperthyroidism.2021` | National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. [“Hyperthyroidism (Overactive Thyroid)”](https://www.niddk.nih.gov/health-information/endocrine-diseases/hyperthyroidism). Last reviewed August 2021; institutional author. | 2026-09-09 | U.S. government patient-education page; high authority for symptom and differential boundaries | Rights/access: [NIDDK copyright policy](https://www.niddk.nih.gov/copyright) permits general public information subject to stated exceptions. Fact verification only; independently written synthesis, no source-expression reuse. Source-record status: `needs_clinician_review`. | `claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific`; `claim.graves-pattern-recognition.nodular-thyroid-disease-boundary`; `claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary` |
| `source.ata.graves-disease.undated` | American Thyroid Association. [“Graves’ Disease”](https://www.thyroid.org/graves-disease/). Undated; institutional author. | 2026-09-09 | Professional-society patient-education page; targeted cross-check authority for recognition features | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification and citation only; no source-expression reuse or redistribution. Source-record status: `needs_clinician_review`. | `claim.graves-pattern-recognition.classic-clinical-constellation`; `claim.graves-pattern-recognition.pretibial-dermopathy-association` |

Source-to-claim mappings appear with each claim and variant-to-claim mappings
appear with each exact question version. No source prose, tables, figures, or
algorithms are reproduced in this artifact.

## Material evidence and owner decisions still required

1. Confirm or revise every complete patient presentation, stem, choice, key,
   explanation, and claim mapping above. The 2026-08-31 receipt does not
   approve this wording.
2. Confirm that bilateral proptosis and the plain-language pretibial-dermopathy
   description are appropriate for the proposed foundational tier, and that
   every distractor remains clinically fair.
3. Confirm the proposed Examination Room and Founder-physician capability
   mapping. No capability mapping is approved by the receipt.
4. Accept or revise the evidence package after full metadata and atomic-claim
   review. The accessible NIDDK and ATA pages are sufficient factual anchors
   for this draft, but evidence acceptance is not complete.
5. The historical 2018 ETA anchor was not directly reverified for this draft:
   its PMC access returned a CAPTCHA and DOI access returned 403 on 2026-09-09.
   This artifact does not rely on search-result snippets or represent that
   guideline as currently rechecked.

Until named clinician approval records this exact version, the concept remains
outside runtime admission and publication. Approval of this concept would not
approve the other five Graves/RAI concepts, treatment decisions, or a
multi-decision pathway.
