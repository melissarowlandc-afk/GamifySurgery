# Owner approval — row 61 Graves disease and RAI counseling boundaries

- Date: 2026-08-31
- Reviewer: Melissa Rowland, MD
- Approval ID: `approval.melissa-rowland-md.owner-row-061.2026-08-31`
- Workbook provenance: `Gamify Surgery Concepts (3).xlsx`, Sheet1 row 61,
  `owner-concept.sheet1.row-061`; the row is unchanged in `Gamify Surgery
  Concepts (4).xlsx`.

## Decision

Melissa Rowland, MD approved the following six future FSRS identities:

1. `concept.graves.clinical-pattern-recognition`
2. `concept.graves.trab-diagnostic-support`
3. `concept.graves.rai-appropriate-candidate`
4. `concept.graves.rai-pregnancy-contraindication`
5. `concept.graves.rai-lactation-contraindication`
6. `concept.graves.rai-active-ted-avoidance`

The eventual release point is `release.l0.clinic_evaluation`, limited to
clinic counseling and referral. Radioactive iodine is never administered
onsite.

## Exact approved seed variants

Only the six reviewed seed question versions/scopes below are clinically approved:

1. Recognize the approved classic Graves clinical pattern.
2. Identify TRAb as diagnostic support in the approved Graves workup.
3. Select the reviewed recurrent-Graves scenario for RAI evaluation.
4. Recognize the approved pregnancy boundary against RAI.
5. Recognize the approved current-lactation boundary against RAI.
6. Avoid RAI in the approved active moderate-to-severe thyroid-eye-disease
   scenario.

These are seed-question-version/scope receipts, not authored runtime question
records. Any later wording change requires exact named-clinician approval.
They do not authorize new questions, answer sets, explanations, patient
presentations, encounter blueprints, service timing, treatment administration,
or gameplay.

## Authoring and release boundary

Each stable concept ultimately requires at least four authored question variants
with distinct patient presentations and retrieval directions. Every scored node
must retain exactly one primary concept and its own per-concept FSRS history.

The eighteen unseen variants needed to reach that target are not approved.
They, and any revision to a seed question's wording, remain
`needs_clinician_review` and must be shown for exact named-clinician approval
before any runtime admission. This decision authorizes later batch
implementation only after explicit owner instruction; it does not authorize
implementation now.

## Evidence and provenance disposition

Current evidence anchors reviewed for the future implementation are the 2018
ETA Graves guideline (TRAb), 2023 EANM benign-thyroid RAI guideline, 2025 KTA
hyperthyroidism RAI guideline, 2022 ATA/ETA thyroid-eye-disease consensus, and
2026 ATA pregnancy/postpartum guideline. Full source metadata, independently
written atomic claims, certainty/limitation fields, source-to-claim mappings,
and reuse records remain required implementation prerequisites. Until then, no
new source or claim package is represented as runtime-ready.
