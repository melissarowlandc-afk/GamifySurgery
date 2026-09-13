# Owner Row 61: Graves RAI Lactation Contraindication — Review Draft v1

Status: `needs_clinician_review`; proposed fifth review set only, with no
runtime or publication authorization

- Review version: `review.owner-row-061.graves-rai-lactation-contraindication.2026-09-09.1`
- Workthrough date: 2026-09-09
- Reviewer required: Melissa Rowland, MD (surgeon)
- Source record: `owner-concept.sheet1.row-061`
- Stable Tested Concept: `concept.graves.rai-lactation-contraindication`

## Approval boundary and proposed metadata

The 2026-08-31 receipt approves this seed scope only. The four 2026-09-09
exact approvals do not approve this draft. Every exact version, claim, and
source record below remains `needs_clinician_review`.

- Learning objective: recognize current breastfeeding as a contraindication to
  therapeutic iodine-131 (RAI) for Graves disease, and recognize the
  pre-treatment counseling boundary for feeding the current child.
- Educational tier: proposed foundational.
- Patient acuity: proposed stable outpatient.
- Clinical setting: proposed clinic evaluation.
- Semantic release point: inherited `release.l0.clinic_evaluation` for
  counseling/referral.
- Proposed capability mapping: Examination Room and Founder physician; clinic
  counseling/referral only, with no onsite RAI or nuclear-medicine unlock.

RAI in this packet means therapeutic iodine-131 for Graves disease; it does not
refer to every diagnostic radionuclide. Current lactation is an explicit locked
clinical fact, never inferred from name, gender, pronouns, or appearance.
Names and appearances are illustrative review renderings only. Any future
generated identity and matching character appearance must remain coherent within
the approved clinical constraints throughout one encounter. Release, capability,
evidence, runtime admission, and publication remain separate gates. Pregnancy
and thyroid-eye-disease boundaries are separate concepts and are not scored here.

## Atomic evidence claims

### `claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication`

Current breastfeeding contraindicates therapeutic iodine-131 treatment for a
patient with Graves disease.

- Evidence category: treatment safety boundary
- Certainty/limitation: applies to therapeutic iodine-131; it does not prohibit
  counseling, referral, or individualized endocrine and pediatric guidance.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.eanm.benign-thyroid-rai-guideline.2023`,
  `source.lactmed.sodium-iodide-i131.2026`,
  `source.ata.radioactive-iodine.undated`

### `claim.graves-rai-lactation-contraindication.milk-infant-thyroid-exposure`

Therapeutic iodine-131 can enter breast milk and expose the nursing infant's
thyroid to radioiodine.

- Evidence category: safety mechanism
- Certainty/limitation: explains the lactation exclusion without teaching an
  infant dose, radiation measurement, emergency response, or exposure protocol.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.lactmed.sodium-iodide-i131.2026`,
  `source.ata.radioactive-iodine.undated`

### `claim.graves-rai-lactation-contraindication.pre-treatment-feeding-boundary`

For therapeutic iodine-131, breastfeeding cessation must be planned before
treatment.

- Evidence category: treatment-planning boundary
- Certainty/limitation: this is pre-treatment counseling, not an exposure
  emergency. It supplies no interval, dose, or weaning protocol.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.eanm.benign-thyroid-rai-guideline.2023`,
  `source.lactmed.sodium-iodide-i131.2026`,
  `source.ata.radioactive-iodine.undated`

### `claim.graves-rai-lactation-contraindication.same-child-no-resumption-recommendation`

After therapeutic iodine-131, standard guidance advises against resuming
breastfeeding the current child.

- Evidence category: post-treatment feeding recommendation
- Certainty/limitation: this recommendation does not claim a lifelong anatomic
  inability to breastfeed, address a future child after a future pregnancy, or
  supply a resumption interval, dose, or protocol.
- Last checked: 2026-09-09
- Clinical review status: `needs_clinician_review`
- Supporting sources: `source.lactmed.sodium-iodide-i131.2026`,
  `source.ata.radioactive-iodine.undated`

### `claim.graves-rai-lactation-contraindication.graves-context-findings`

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

### `presentation.graves-rai-lactation-contraindication.v1` / `question.graves-rai-lactation-contraindication.v1`

**Current patient presentation:** Marisol has established Graves disease and is
currently breastfeeding her infant. At a stable outpatient counseling visit,
she asks whether therapeutic iodine-131 could be given now.

**Question:** Which statement best describes therapeutic iodine-131 for this
patient now?

1. It is available while she is breastfeeding
2. It is available after routine clinic counseling
3. It is available after endocrine referral
4. It is contraindicated while she is breastfeeding

**Key:** 4 — It is contraindicated while she is breastfeeding.

**Explanation:** Current breastfeeding contraindicates therapeutic iodine-131.
This does not prevent counseling, referral, or individualized planning.

- Claim mapping: `claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-lactation-contraindication.v2` / `question.graves-rai-lactation-contraindication.v2`

**Current patient presentation:** Dana returns to discuss treatment options for
established Graves disease because her symptoms are interfering with daily
activities. She is stable in clinic, and the team is reviewing updated records
before deciding whether therapeutic iodine-131 is suitable.

**Question:** Which finding in this patient's updated record would make
therapeutic iodine-131 contraindicated now?

1. Current breastfeeding
2. Persistent hand tremor
3. Positive TRAb result
4. Diffuse thyroid enlargement

**Key:** 1 — Current breastfeeding.

**Explanation:** Current breastfeeding changes the treatment-safety boundary
for therapeutic iodine-131. The other findings provide Graves context but do
not state this lactation contraindication.

- Claim mapping: `claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication`,
  `claim.graves-rai-lactation-contraindication.graves-context-findings`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-lactation-contraindication.v3` / `question.graves-rai-lactation-contraindication.v3`

**Current patient presentation:** Aisha is currently breastfeeding and attends
a Graves counseling visit to understand why therapeutic iodine-131 is unsafe
for her infant. She asks what risk leads the team to exclude that treatment.

**Question:** Which effect best explains excluding therapeutic iodine-131 for
this patient?

1. It stays in maternal tissue and is absent from milk
2. It passes into milk and reaches the infant’s thyroid
3. It reaches milk but cannot be absorbed by the infant
4. It reaches the infant but is excluded from thyroid tissue

**Key:** 2 — It passes into milk and reaches the infant’s thyroid.

**Explanation:** Therapeutic iodine-131 can enter breast milk and expose the
nursing infant's thyroid to radioiodine.

- Claim mapping: `claim.graves-rai-lactation-contraindication.milk-infant-thyroid-exposure`
- Exact-version status: `needs_clinician_review`

### `presentation.graves-rai-lactation-contraindication.v4` / `question.graves-rai-lactation-contraindication.v4`

**Current patient presentation:** Lien is currently breastfeeding and is
considering therapeutic iodine-131 for Graves disease. Before any treatment is
scheduled, she asks whether a brief pump-and-discard pause would let her resume
breastfeeding this child afterward.

**Question:** If she chooses therapeutic iodine-131, which counseling
recommendation best fits this patient's plan?

1. Resume breastfeeding this child after a brief interruption
2. Do not resume breastfeeding this child after treatment
3. Resume breastfeeding this child when thyroid symptoms improve
4. Resume breastfeeding this child if feeds are less frequent

**Key:** 2 — Do not resume breastfeeding this child after treatment.

**Explanation:** Breastfeeding cessation must be planned before therapeutic
iodine-131. Standard guidance advises against resuming breastfeeding the
current child after treatment.

- Claim mapping: `claim.graves-rai-lactation-contraindication.pre-treatment-feeding-boundary`,
  `claim.graves-rai-lactation-contraindication.same-child-no-resumption-recommendation`
- Exact-version status: `needs_clinician_review`

## Source records and claim mapping

| Stable source ID | Complete citation and official URL | Accessed | Source class / authority | Rights and intended use | Supported claims |
| --- | --- | --- | --- | --- | --- |
| `source.eanm.benign-thyroid-rai-guideline.2023` | Campennì A, Avram AM, Verburg FA, Iakovou I, Hänscheid H, de Keizer B, Petranović Ovčariček P, Giovanella L. [“The EANM guideline on radioiodine therapy of benign thyroid disease.”](https://link.springer.com/article/10.1007/s00259-023-06274-5) *European Journal of Nuclear Medicine and Molecular Imaging*. 2023;50:3324–3348. Published July 3, 2023. DOI: 10.1007/s00259-023-06274-5. | 2026-09-09 | Professional guideline; direct authority for therapeutic iodine-131 lactation contraindication and pre-treatment boundary | CC BY 4.0 article license: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Original factual synthesis only; no source prose, tables, or algorithms reproduced. Source-record status: `needs_clinician_review`. | `claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication`; `claim.graves-rai-lactation-contraindication.pre-treatment-feeding-boundary` |
| `source.lactmed.sodium-iodide-i131.2026` | National Institute of Child Health and Human Development. *Drugs and Lactation Database (LactMed®)* [Internet]. Bethesda (MD): National Institute of Child Health and Human Development; 2006–. [“Sodium Iodide I 131.”](https://www.ncbi.nlm.nih.gov/books/NBK501563/) Updated 2026 Aug 15. | 2026-09-09 | U.S. government lactation reference; independent cross-check for therapeutic iodine-131 lactation and infant-thyroid exposure boundaries | Government publication; [NCBI Bookshelf copyright guidance](https://www.ncbi.nlm.nih.gov/books/about/copyright/) was checked for this targeted use. LactMed® is an HHS trademark. Original factual synthesis and attribution only; no source prose, dose, timing, case detail, or bulk reuse. Source-record status: `needs_clinician_review`. | `claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication`; `claim.graves-rai-lactation-contraindication.milk-infant-thyroid-exposure`; `claim.graves-rai-lactation-contraindication.pre-treatment-feeding-boundary`; `claim.graves-rai-lactation-contraindication.same-child-no-resumption-recommendation` |
| `source.ata.radioactive-iodine.undated` | American Thyroid Association. [“Radioactive Iodine.”](https://www.thyroid.org/radioactive-iodine/) Undated; institutional author. | 2026-09-09 | Professional-society patient education; cross-check for therapeutic iodine-131 lactation, current-child feeding, and infant-thyroid protection boundaries | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification and citation only; no source-expression reuse or redistribution. Therapeutic iodine-131 facts only; its diagnostic iodine brochure wording is not generalized. Source-record status: `needs_clinician_review`. | `claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication`; `claim.graves-rai-lactation-contraindication.milk-infant-thyroid-exposure`; `claim.graves-rai-lactation-contraindication.pre-treatment-feeding-boundary`; `claim.graves-rai-lactation-contraindication.same-child-no-resumption-recommendation` |
| `source.ata.graves-disease.undated` | American Thyroid Association. [“Graves’ Disease.”](https://www.thyroid.org/graves-disease/) Undated; institutional author. | 2026-09-09 | Professional-society patient education; authority for Graves symptom, goiter, and TRAb context | Rights/access: [ATA terms of use](https://www.thyroid.org/about-american-thyroid-association/terms-of-use/) identify copyrighted content. Targeted factual verification and citation only; no source-expression reuse or redistribution. Source-record status: `needs_clinician_review`. | `claim.graves-rai-lactation-contraindication.graves-context-findings` |

Source-to-claim mappings appear with each claim and variant-to-claim mappings
appear with each exact question. No source prose, tables, figures, algorithms,
dose instructions, timing protocols, or case details are reproduced. The 2026
LactMed chapter is cited as a government lactation reference; the underlying
2026 ATA guideline is not claimed as directly verified. No routine resumption
protocol is inferred from individual case material. NICE, ETA, KTA, and other
unverified sources are not used as evidence in this draft.

## Material evidence and owner decisions still required

1. Confirm every presentation, question, choice, key, explanation, and claim
   mapping. No exact version in this draft is approved.
2. Confirm the therapeutic iodine-131 lactation contraindication, infant-thyroid
   exposure mechanism, and current-child feeding boundary at the foundational
   tier.
3. Confirm the proposed clinic capability mapping; it is not approved by the
   historical scope receipt.
4. Review source and claim metadata independently; all remain
   `needs_clinician_review`.
5. This proposed fifth set does not change the approved batch count of four.
   Implementation remains held until ten separately approved sets exist.

Until named clinician approval records an exact version, this concept remains
outside runtime admission and publication. It does not approve the remaining
thyroid-eye-disease set or a multi-decision pathway.
