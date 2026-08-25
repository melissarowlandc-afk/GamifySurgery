# Clinical approval receipt: owner row 35 breast-imaging recognition

Status: exact recognition revision approved and held for Level 3 activation

- Reviewer: Melissa Rowland, MD
- Review date: 2026-08-06
- Approval ID:
  `approval.melissa-rowland-md.owner-row-035.2026-08-06`
- Content version: `clinical.owner-row-035.2026-08-06.1`
- Source workbook: `Gamify Surgery Concepts (2).xlsx`, `Sheet1`, row 35
- Source record: `owner-concept.sheet1.row-035`
- Scope decision:
  `decision.owner-row-035.two-concept-imaging-split.2026-08-06`

## Approved concepts

1. `concept.breast-imaging.suspicious-mass-morphology`
   - type: diagnosis
   - FSRS identity: one card across four alternative mass-morphology variants
2. `concept.breast-imaging.suspicious-calcification-pattern`
   - type: diagnosis
   - FSRS identity: one card across four alternative calcification-pattern
     variants

Both concepts use release point `release.l3.ambulatory_or_qi`. The clinical
questions occur in clinic or preoperative evaluation and do not require an
operational Ambulatory OR.

Developing or focal asymmetry is not called an "asymmetric mass" in this
revision. It remains a separate possible future concept.

## Approved question variants

All eight questions are single-select, have four complete answer choices, and
shuffle answer order. Each has a brief patient presentation before the
question.

### Mass morphology

1. `question.breast-imaging.mass.select-concerning-profile.v1`
   - Correct: An irregular mass with spiculated margins
   - Incorrect: An oval, circumscribed, fat-containing mass
   - Incorrect: A round mass with a sharply circumscribed margin
   - Incorrect: An oval, circumscribed low-density mass
2. `question.breast-imaging.mass.select-concerning-profile.v2`
   - Correct: Irregular shape with a spiculated margin
   - Incorrect: Oval shape with a circumscribed margin
   - Incorrect: Round shape with a circumscribed margin
   - Incorrect: Fat-containing density with a circumscribed margin
3. `question.breast-imaging.mass.identify-spiculated-margin.v1`
   - Correct: Spiculated
   - Incorrect: Circumscribed
   - Incorrect: Obscured
   - Incorrect: Indistinct
4. `question.breast-imaging.mass.density-boundary.v1`
   - Correct: Density is one descriptor and must be interpreted with shape,
     margin, associated features, comparison imaging, and the final assessment
   - Incorrect: Every high-density mass is malignant
   - Incorrect: Every low-density mass is benign
   - Incorrect: Density alone determines the final BI-RADS category

### Calcification patterns

1. `question.breast-imaging.calcification.select-concerning-pattern.v1`
   - Correct: Fine linear or fine linear-branching calcifications in a
     segmental distribution
   - Incorrect: Vascular calcifications following parallel tracks
   - Incorrect: Large, smooth rod-like calcifications
   - Incorrect: Coarse, densely calcified, confluent calcifications
2. `question.breast-imaging.calcification.select-suspicious-morphology.v1`
   - Correct: Fine pleomorphic calcifications
   - Incorrect: Vascular calcifications
   - Incorrect: Rim calcifications
   - Incorrect: Layering calcifications
3. `question.breast-imaging.calcification.select-benign-profile.v1`
   - Correct: Coarse, large, densely calcified, confluent calcifications
   - Incorrect: Fine pleomorphic calcifications
   - Incorrect: Fine linear-branching calcifications
   - Incorrect: Coarse heterogeneous calcifications
4. `question.breast-imaging.calcification.distribution-boundary.v1`
   - Correct: Segmental distribution must be interpreted with morphology and
     the complete imaging assessment; it does not independently diagnose
     cancer
   - Incorrect: Segmental distribution automatically confirms breast cancer
   - Incorrect: Calcification distribution has no role in imaging assessment
   - Incorrect: Every diffuse calcification pattern requires tissue diagnosis

Exact stems, presentations, explanations, distractor rationales, evidence
mappings, and immutable identities are stored in
`packages/clinical-content/src/approved-data/suspicious-breast-imaging.ts`.

## Approved encounter organization

Six single-decision blueprints begin with diagnostic imaging results already
in hand:

- two mass-description or interpretation encounters;
- four calcification-pattern encounters.

Two additional approved mass-morphology variants are intended to become the
second decisions of sequential encounters. Those sequential blueprints are
present in the development backlog but are not yet clinically approved because
their new first-step workup questions were authored after this exact approval.

## Proposed sequential workup extension

The proposed first step is intentionally a third FSRS identity:

`concept.breast-mass.age-30-to-39.initial-diagnostic-imaging`

It asks a patient age 30 to 39 with a new palpable mass to select diagnostic
mammography or tomosynthesis with targeted breast ultrasound. The two exact
stems and complete distractor sets remain `needs_clinician_review`. They must
not be silently merged into either approved recognition card.

The age range is deliberate. The current ACR palpable-mass criteria rate
diagnostic mammography or tomosynthesis and ultrasound as appropriate initial
modalities for ages 30 to 39. For age 40 or older, diagnostic mammography or
tomosynthesis is the usual initial study and ultrasound is added selectively.

## Evidence and safety boundaries

The independently written claims are supported by:

- Destounis SV, Friedewald SM, Grimm LJ, Poplack SP, Sung JS. Mammography.
  In: *ACR BI-RADS v2025 Manual*. Reston, VA: American College of
  Radiology; 2025.
- National Cancer Institute. *Mammograms*. Updated December 2, 2025.
- Expert Panel on Breast Imaging; Klein KA, Kocher M, Lourenco AP, et al.
  *ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update*.
  J Am Coll Radiol. 2023;20(5S):S146-S163.
  doi:10.1016/j.jacr.2023.02.013.

This revision teaches imaging-feature recognition. Suspicious morphology is
not a tissue diagnosis and does not directly authorize cancer surgery. Biopsy
selection and biopsy-proven breast-cancer management remain separate content.

## Runtime boundary

The exact recognition content is approved, but the current playable release
ends at Level 1. The approved recognition package remains in the deferred
backlog until Level 3 content admission exists.

The two sequential encounters have an additional gate: their first-step
workup questions require exact named-clinician approval before the blueprints
can become clinically approved.

## Approval boundary

This receipt approves only content version
`clinical.owner-row-035.2026-08-06.1`. It does not approve
`clinical.owner-row-035.workup-draft.2026-08-06.1`.

A material change to the approved clinical meaning, stems, answer sets, keyed
answers, explanations, boundary language, or concept-to-question mapping
requires a new version and named-clinician review. Automated tests verify
structure; they do not provide clinical approval.
