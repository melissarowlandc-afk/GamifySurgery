# Approve and Later Integrate Owner Row 53: Phyllodes Pathology Follow-up

## Goal

Preserve Melissa Rowland, MD's 2026-08-31 approval of nine phyllodes stable
concepts and exactly 33 patient-based question versions, while deferring all
runtime implementation until an explicit later batch instruction.

## Requirements

- Preserve the nine stable IDs listed in the approval receipt.
- Preserve exactly 33 approved versions: four per concept except three each
  for borderline close-margin management, malignant close-margin management,
  and no-routine-axillary-staging.
- Future use is `release.l3.ambulatory_or_qi` pathology-follow-up/planning
  counseling only. Do not imply onsite surgery or current runtime admission.
- Runtime answer order must shuffle; the approval receipt shows the key first
  only for clinician review.
- Preserve one primary concept per scored node and separate per-concept FSRS
  history.

## Constraints and non-goals

- Approval is limited to the exact 33 documented question versions. Any wording
  revision or new variant requires exact named-clinician re-review.
- Do not admit this package into the active runtime, synthetic-content assembly,
  routine-case IDs, encounters, or an allowlist; do not change balance, commit,
  push, merge, deploy, add radiotherapy, chemotherapy, surveillance schedules,
  recurrence rates, or other concepts in this milestone.
- Threshold statements are consensus/evidence-sensitive management boundaries,
  not universal biological cutoffs.

## Relevant repository state

- Workbook provenance: `Gamify Surgery Concepts (3).xlsx`, Sheet1 row 53,
  `owner-concept.sheet1.row-053`; the same row is present in `(4).xlsx`.
- Exact approval receipt:
  `docs/clinical-workbench/approvals/owner-row-053-phyllodes.md`.
- The queue record is
  `docs/clinical-workbench/concept-release-point-review-queue.json`.

## Decisions already made

- Reviewer: Melissa Rowland, MD; approval date: 2026-08-31.
- Evidence anchors: 2025 ASBrS/SBI benign fibroepithelial-lesion guidance
  (PMID 41123921) and 2025 UK Association of Breast Surgery recommendations
  (PMCID PMC12374188).
- Benign complete excision is not a fixed-width margin rule. Borderline target
  is 5 mm; under 3 mm prompts re-excision and 3 to under 5 mm is individualized.
  Malignant target is 10 mm; under 5 mm prompts re-excision, while 5 to under
  10 mm has recommended re-excision with surveillance considered only after
  explicit risk/benefit discussion.
- No routine sentinel-node or axillary staging occurs for nonsuspicious nodes.
  Suspicious nodes receive image-guided histopathologic needle biopsy before
  any MDT-linked dissection discussion.

## Later milestones and ownership

1. After the explicit owner batch-implementation instruction, Terra completed
   complete source metadata and atomic claims with evidence limitations.
2. Terra completed a typed, tested deferred Level 3 package containing only
   the exact approved versions, exported as deferred data only.
3. Runtime admission remains deferred; current facility stages cannot safely
   enforce this Level 3 semantic boundary.
4. Every later wording change or new variant returns to the owner for exact
   named-clinician review before runtime admission.
5. Sol reviews the actual implementation diff and validation evidence.

## Acceptance criteria for this approval-record milestone

- The queue and approval receipt agree on nine concepts and 33 exact versions,
  a two-record source package, and nine atomic claims.
- The future Level 3 counseling/planning and no-runtime boundary is explicit.
- The data module and focused tests remain exported deferred data only; no
  active runtime assembly changes.

## Validation

- Parse the queue JSON.
- Confirm 33 approved row-53 variants and the next-review pointer to row 54.
- Run targeted mojibake and `git diff --check` checks.

## Progress

- [x] Conditional wording corrections reviewed by the owner.
- [x] Final approval of the exact 33 versions recorded.
- [x] Explicit batch-implementation instruction received.
- [x] Source/claim package, exact deferred module, focused tests, and export
  completed without runtime admission.
- [ ] Sol validation review remains pending.

## Exact next action

Sol validates the deferred package and then delegates the independent row-54
future-ED package. Any wording revision or new variant must receive exact
named-clinician re-review before runtime admission.
