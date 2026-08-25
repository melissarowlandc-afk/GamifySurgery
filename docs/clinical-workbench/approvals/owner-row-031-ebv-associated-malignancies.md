# Owner Row 31: Exact Clinical Approval

Status: Clinically approved and implemented in the development prototype

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-031.2026-08-06`

Content version: `clinical.owner-row-031.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 31
- Source record: `owner-concept.sheet1.row-031`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-03-v2`

The owner conversation approved the exact model and the three fully written
Question Variants below. Automated validation is structural verification, not
clinical approval.

## Approved canonical concept

`concept.ebv.associated-malignancy-recognition`

- concept type: `applied_science`
- release point: `release.l0.clinic_evaluation`
- required clinical setting: clinic
- required facility capabilities: none
- FSRS identity: one card shared by all approved association variants

The approved objective is to recognize canonical EBV-associated malignancies
while preserving the boundary that an association is not universal across
every tumor and is not an individual cancer-risk prediction.

Adding `applied_science` to the runtime concept-type vocabulary was explicitly
approved with this concept. It avoids misclassifying a knowledge association
as diagnosis, workup, or management.

## Approved immutable identities

Patient Presentation Variants:

- `presentation.ebv-associated-malignancy.burkitt`
- `presentation.ebv-associated-malignancy.gastric`
- `presentation.ebv-associated-malignancy.nasopharyngeal`

Question Variants:

- `question.ebv-associated-malignancy.burkitt.v1`
- `question.ebv-associated-malignancy.gastric.v1`
- `question.ebv-associated-malignancy.nasopharyngeal.v1`

Evidence Claims:

- `claim.ebv.associated-malignancies.classic`
- `claim.ebv.gastric-adenocarcinoma.subtype`
- `claim.ebv.association-not-universal`

The exact stems, answer sets, keyed answers, feedback, terminal consequences,
evidence claims, and source records live in
`packages/clinical-content/src/approved-data/ebv-associated-malignancies.ts`.

## Approved question scope

The three implemented variants key:

1. Burkitt lymphoma as the recognized EBV association in a general oncology
   referral review.
2. Gastric adenocarcinoma as an epithelial malignancy with an EBV-associated
   molecular subset.
3. Nasopharyngeal carcinoma as the recognized head-and-neck association.

Each encounter contains one single-select scored decision, shuffles answer
order, and updates the same concept card. The presentation is an oncology or
pathology referral discussion rather than counseling an otherwise healthy
person that prior EBV infection predicts future cancer.

## Deferred exact variant

Hodgkin lymphoma remains inside the approved canonical association scope, but
its separate Question Variant was not implemented because exact stem and
distractor wording were not shown during this approval. It may be added only
after exact review.

## Runtime boundary

The three cases are included in the owner/development release. That release
retains the global `synthetic_unapproved_prototype` publication label and is
not an approved public clinical release. This receipt approves only the exact
row-31 revision described above.
