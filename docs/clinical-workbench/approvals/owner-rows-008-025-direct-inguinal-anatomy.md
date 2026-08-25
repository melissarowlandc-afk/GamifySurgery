# Owner Rows 8 and 25: Exact Clinical Approval

Status: Clinically approved Level 3 backlog; not in the current playable release

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-rows-008-025.2026-08-06`

Content version: `clinical.owner-rows-008-025.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source rows: 8 and 25
- Source records:
  - `owner-concept.sheet1.row-008`
  - `owner-concept.sheet1.row-025`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-hernia-concept-intake-2026-07-30-v1`

The exact merged revision approved in the owner conversation is the
authoritative clinical-review event. Automated validation confirms structural
consistency; it is not clinical approval.

## Approved canonical concept

- Tested Concept: `concept.inguinal-hernia.direct-operative-anatomy`
- Display name: Direct inguinal hernia operative anatomy
- Educational difficulty: foundational operative anatomy
- Release point: `release.l3.ambulatory_or_qi`
- Required setting: Ambulatory OR
- Tutorial eligibility: false
- FSRS identity: one card shared by all three approved Question Variants

Rows 8 and 25 are intentionally merged because classification, posterior-wall
mechanism, and bounded operative search all resolve to the same anatomic
relationship among a direct inguinal defect, Hesselbach's triangle, the
inferior epigastric vessels, and the transversalis fascia. Only one variant may
be scored in an encounter; variants are not consecutive questions testing the
same card twice.

## Approved immutable identities

Patient Presentation Variants:

- `presentation.inguinal-hernia.direct-anatomy.classification`
- `presentation.inguinal-hernia.direct-anatomy.mechanism`
- `presentation.inguinal-hernia.direct-anatomy.operative-search`

Question Variants:

- `question.inguinal-hernia.direct-anatomy.classification`
- `question.inguinal-hernia.direct-anatomy.mechanism`
- `question.inguinal-hernia.direct-anatomy.operative-search`

Evidence Claims:

- `claim.inguinal-hernia.direct-anatomic-location`
- `claim.inguinal-hernia.direct-posterior-wall-defect`
- `claim.inguinal-hernia.direct-search-boundary`

The approved stems, answer sets, keyed answers, shared feedback, correction
behavior, evidence claims, and source record live in
`packages/clinical-content/src/approved-data/direct-inguinal-operative-anatomy.ts`.

## Scope corrections retained

- The row-25 word `deep` is not used as a standalone locator.
- The operative-search variant explicitly asks where to inspect for a possible
  direct defect.
- Failure to find a cord-associated sac does not establish a direct defect or
  exclude every other occult groin lesion.
- The classification and mechanism variants remain alternative expressions of
  one concept, not two separate FSRS cards.
- Incorrect answers use corrective-forward intermediate behavior; they do not
  manufacture a patient complication.

## Evidence limitation

`source.review.inguinal-releasing-incisions.2023` is a current CC BY 4.0
technical narrative review supporting the bounded spatial anatomy. It is not
comparative evidence or a diagnostic-performance study. The one-source
limitation and the lower-certainty operative-search boundary remain explicit.

## Runtime boundary

The content is deliberately held outside
`SYNTHETIC_CLINICAL_RELEASE`. Level 3 and its Ambulatory OR encounter framework
do not yet exist in the playable prototype, so admitting these questions now
would misclassify their setting. Activation requires the existing immutable
content version to be projected into a future authorized Level 3 release; the
approval itself does not authorize unrelated Level 3 implementation.
