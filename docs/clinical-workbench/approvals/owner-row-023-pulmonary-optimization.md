# Owner Row 23: Exact Clinical Approval

Status: Clinically approved and implemented in the development prototype

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-023.2026-08-06`

Content version: `clinical.owner-row-023.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 23
- Source record: `owner-concept.sheet1.row-023`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence packet: `ventral-hernia-evidence-foundation-v1`

The exact revision approved in the owner conversation is the authoritative
clinical-review event. Automated validation confirms structural consistency;
it is not a substitute for that approval.

## Approved canonical content

- Tested Concept:
  `concept.ventral-hernia.elective-pulmonary-optimization`
- Display name: Pulmonary optimization before elective incisional-hernia
  repair
- Release point: `release.l0.clinic_evaluation`
- Required setting: outpatient clinic
- Tutorial eligibility: first approved variant is the protected first tutorial
  patient; the second remains an ordinary case
- FSRS identity: one card shared by both approved Question Variants

The approved learning objective is to select pulmonary optimization before
finalizing elective repair for a stable adult with a reducible, nonemergent
incisional hernia and poorly controlled COPD. Acute irreducibility,
obstruction, escalating pain, peritoneal findings, or systemic deterioration
is an explicit boundary requiring a different pathway.

## Approved immutable identities

Patient Presentation Variants:

- `presentation.ventral-hernia.pulmonary-optimization.a`
- `presentation.ventral-hernia.pulmonary-optimization.b`

Question Variants:

- `question.ventral-hernia.pulmonary-optimization.v1`
- `question.ventral-hernia.pulmonary-optimization.v2`

Evidence Claims:

- `claim.ventral-hernia.elective-pulmonary-optimization`
- `claim.ventral-hernia.urgent-feature-boundary`

The approved stems, answer sets, keyed answers, feedback, and constrained
incorrect-outcome summaries live in
`packages/clinical-content/src/approved-data/ventral-hernia-pulmonary-optimization.ts`.
An underlying change in clinical meaning requires a new content version; mere
patient or wording variation must preserve the canonical concept ID.

## Evidence mapping

- `source.ehs.midline-incisional.2023` supports the elective optimization
  claim.
- `source.ehs.emergency-ventral.2026` supports the urgent-feature boundary.
- `source.wses.emergency-hernia.2017` is an independent corroborating
  cross-check for that boundary.

The source records retain complete citations, identifiers, links, access dates,
source class, reuse status, authority assessment, usage role, and reverse claim
links. Their metadata-review status remains distinct from the clinician
approval of this exact teaching revision.

## Runtime boundary

Following the owner's withdrawal of the older prototype patient questions, the
first approved variant now opens the protected Level 0 chart tutorial. The
second remains an ordinary Level 0 case. Both are included in the existing
development fixture, whose release-level status remains
`synthetic_unapproved_prototype` because the same fixture still contains other
unapproved prototype cases. This approval does not silently promote those
other cases or authorize a public clinical release.
