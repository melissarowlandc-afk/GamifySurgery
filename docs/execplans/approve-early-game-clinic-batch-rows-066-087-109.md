# Approve and Later Integrate Early-Game Clinic Batch: Rows 66, 87, and 109

## Goal

Preserve Melissa Rowland, MD's 2026-08-31 approval of three Level 0 Clinic
Evaluation concepts and exactly 12 patient-linked review versions, now actively
implemented at Level 0 in the development preview.

## Scope and decisions

- Workbook provenance is `Gamify Surgery Concepts (4).xlsx`, `Sheet1`, rows
  66, 87, and 109. Rows 1-91 are unchanged from workbook (3); row 109 is a
  new workbook-(4) row.
- Approved identities are
  `concept.ipaa.pouchitis-common-post-ipaa-complication`,
  `concept.choledochal-cyst.type-iva-combined-duct-dilation`, and
  `concept.anal-hsil.high-risk-hpv-association`, with four exact versions each.
- All three are Level 0 counseling/evaluation content using already
  available off-site imaging or pathology where stated. No diagnosis, treatment,
  screening, procedure, or onsite imaging is approved.
- Review receipts show keys first only for review. Runtime must independently
  shuffle answer choices. Any wording change or new variant needs exact
  named-clinician re-review.

## Evidence and safety boundaries

- Row 66 is limited to UC/IPAA inflammatory-pouch frequency; it does not teach
  diagnosis, treatment, or a rate.
- Row 87 is limited to Type IVA anatomic classification from reviewed MRCP; it
  does not authorize an operation or infer a diagnosis from nonspecific ductal
  dilation.
- Row 109 is limited to the etiologic association of anal HSIL with persistent
  high-risk HPV. It does not equate every HPV infection with HSIL or teach a
  screening or treatment decision.

## Files

- Immutable receipts: `docs/clinical-workbench/approvals/owner-row-066-pouchitis-after-ipaa.md`,
  `owner-row-087-type-iva-bile-duct-cyst.md`, and `owner-row-109-anal-hsil-hpv.md`.
- Queue/intake records: `docs/clinical-workbench/concept-release-point-review-queue.json`,
  `NEW_CONCEPT_INTAKE_2026-08-10.md`, and `NEW_CONCEPT_INTAKE_2026-08-31.md`.

## Non-goals

No additional variants, source ingestion, staging, commit, push, merge,
deployment, or publication.

## Progress

- [x] Owner approved exactly 12 review versions on 2026-08-31.
- [x] Workbook-(4) intake reconciled through row 122.
- [x] The exact approved variants are implemented in the development-preview
  Level 0 release on 2026-08-31.

## Exact next action

Continue owner concept review. Any new atomic-claim wording, wording revision,
or new variant requires exact clinician review before runtime admission.
