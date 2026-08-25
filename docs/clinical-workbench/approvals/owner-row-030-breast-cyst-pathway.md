# Owner Row 30: Exact Clinical Approval

Status: Clinically approved and implemented in the development prototype

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-030.2026-08-06`

Content version: `clinical.owner-row-030.2026-08-06.2`

Supersedes: `clinical.owner-row-030.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 30
- Source record: `owner-concept.sheet1.row-030`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Intermediate pathway decision:
  `decision.owner-row-030.symptomatic-simple-cyst-aspiration.2026-08-06`
- Evidence handoff: `owner-concept-intake-2026-08-03-v2`

The exact revision approved in the owner conversation is the authoritative
clinical-review event. Automated validation confirms structural consistency;
it is not clinical approval.

## Approved canonical concepts

The approved two-decision encounters intentionally score two different
concepts. Each decision updates exactly one FSRS card.

1. `concept.breast-mass.under-30-initial-ultrasound`
   - release point: `release.l0.clinic_evaluation`
   - concept type: workup
2. `concept.breast-cyst.asymptomatic-simple-observation`
   - release point: `release.l0.clinic_evaluation`
   - concept type: management
3. `concept.breast-cyst.symptomatic-simple-aspiration`
   - release point: `release.l1.minor_procedure`
   - concept type: management
   - capability gate: operational Minor Procedure Room

The initial-ultrasound concept has two wording/presentation variants but one
FSRS identity.

## Approved immutable identities

Patient Presentation Variants:

- `presentation.breast-cyst.under-30-asymptomatic-simple`
- `presentation.breast-cyst.under-30-painful-simple`

Question Variants:

- `question.breast-mass.under-30-initial-ultrasound.v1`
- `question.breast-cyst.asymptomatic-simple-observation.v1`
- `question.breast-mass.under-30-initial-ultrasound.v2`
- `question.breast-cyst.symptomatic-simple-aspiration.v1`

Evidence Claims:

- `claim.breast-mass.under-30.initial-ultrasound`
- `claim.breast-cyst.simple-ultrasound-phenotype`
- `claim.breast-cyst.simple-asymptomatic.observation`
- `claim.breast-cyst.simple-symptomatic.aspiration`

The approved stems, answer sets, keyed answers, feedback, constrained
terminal consequences, evidence claims, and source records live in
`packages/clinical-content/src/approved-data/breast-cyst-pathway.ts`.

## Approved encounter behavior

### Level 0 asymptomatic iteration

1. Select targeted breast ultrasound as the initial study for the narrowly
   scoped patient younger than 30.
2. The patient physically leaves for off-site ultrasound and returns.
3. When the result is concordant with an unequivocal simple cyst and the cyst
   is not bothersome, select no cyst-directed procedure and ordinary
   age-/risk-appropriate care.

This encounter is the protected second tutorial patient after withdrawal of
the earlier synthetic tutorial question. It teaches timed off-site care using
approved content.

### Level 1 painful iteration

1. Select targeted breast ultrasound.
2. The patient physically leaves for off-site ultrasound and returns.
3. When the result is concordant with an unequivocal simple cyst causing
   persistent focal discomfort, offer needle aspiration for symptom relief.

The painful iteration becomes eligible only when Level 1 is active and the
Minor Procedure Room capability exists.

An incorrect imaging answer is recorded as incorrect and uses
corrective-forward behavior: the approved ultrasound is performed rather than
forcing repeated guessing. A wrong final answer retains its authored
noncatastrophic consequence and is not silently changed into a correct answer.

## Scope boundaries

- The variants exclude pregnancy, lactation, known high-risk status, overt
  inflammatory findings, and suspicious examination findings.
- Complicated cysts, complex cystic-and-solid masses, dermal lesions, and
  clinically discordant imaging are excluded.
- Bloody aspirate, residual mass, recurrence, and a post-aspiration third
  decision remain separate future work.
- Pain alone does not make routine surgical excision the initial procedure.

## Runtime boundary

The cases are included in the owner/development release. That mixed release
retains the global `synthetic_unapproved_prototype` publication label and is
not an approved public clinical release. The exact row-30 content is clinically
approved. Version `.2` shortens the asymptomatic-management keyed label to
remove an answer-length cue without changing its meaning, key, stable Question
Variant ID, or Concept ID. Unrelated or withdrawn prototype content is not
promoted by this receipt.
