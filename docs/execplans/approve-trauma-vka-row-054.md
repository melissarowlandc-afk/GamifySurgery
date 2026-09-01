# Approve and Later Integrate Owner Row 54: Trauma VKA Emergency Reversal

## Goal

Preserve Melissa Rowland, MD's 2026-08-31 approval of five trauma/VKA stable
concepts and exactly 20 patient-linked review versions, package them as
exported deferred data after the later explicit batch instruction, and defer
all active runtime admission.

## Requirements

- Preserve these independent FSRS identities:
  `concept.trauma-vka.emergency-reversal-scope`,
  `concept.trauma-vka.four-factor-pcc-selection`,
  `concept.trauma-vka.concurrent-iv-vitamin-k`,
  `concept.trauma-vka.rapid-concentrated-pcc-versus-plasma`, and
  `concept.trauma-vka.four-factor-pcc-composition`.
- Preserve four approved patient-linked versions per identity, 20 total.
- Keep the future Hospital/ED release boundary. Reversal is one component
  alongside hemorrhage control and trauma resuscitation; it never replaces them.
- Runtime choices must shuffle. The receipt shows the key first only for review.
- Preserve one primary concept per scored node and per-concept FSRS history.

## Constraints and non-goals

- Approval is limited to the exact 20 documented versions. Any wording revision
  or new variant needs exact named-clinician re-review.
- Do not admit this package into active runtime, synthetic-content assembly,
  routine-case IDs, encounters, or an allowlist; do not add balance changes,
  dosing, staging, commit, push, merge, or deployment.
- Do not extend VKA-specific reversal to DOAC/non-VKA anticoagulants or to an
  elevated INR without documented VKA exposure plus the approved bleeding or
  urgent-intervention scope.

## Relevant repository state

- Workbook provenance: `Gamify Surgery Concepts (3).xlsx`, Sheet1 row 54,
  `owner-concept.sheet1.row-054`.
- Exact approval receipt:
  `docs/clinical-workbench/approvals/owner-row-054-trauma-vka.md`.
- The structured record is
  `docs/clinical-workbench/concept-release-point-review-queue.json`.

## Decisions already made

- Reviewer: Melissa Rowland, MD; approval date: 2026-08-31.
- Future release: Hospital/ED only; no current runtime admission.
- 4F-PCC is the VKA-specific rapid factor-replacement product in the approved
  scope, with concurrent IV vitamin K. Plasma is a fallback when 4F-PCC is
  unavailable; no dosing is recorded.
- The 4F-PCC teaching set is factors II, VII, IX, and X. Delivery/volume
  advantage is a separate concept from product selection.

## Later milestones and ownership

1. After the explicit owner batch-implementation instruction, Terra completed
   source metadata and independently authored atomic claims with evidence
   limitations; those source and claim records remain `needs_clinician_review`.
2. Terra completed an exported, typed, focused-tested deferred future
   Hospital/ED package containing only the exact approved versions.
3. Active runtime admission remains deferred because the present runtime cannot
   safely enforce this future-ED semantic boundary.
4. Any later wording change or new variant returns for exact named-clinician
   review before runtime admission.
5. Sol reviewed the implementation diff and validation evidence.

## Acceptance criteria for this approval-record milestone

- The queue and receipt agree on five concepts, 20 exact versions, 4 source
  records, and 5 atomic claims.
- The VKA-specific, source-control/resuscitation, no-dosing, deferred-only,
  and no-active-runtime boundaries are explicit.
- The exported data module and focused test stay outside active runtime
  assembly.

## Validation

- Run the clinical-content typecheck and focused/package clinical-content tests.
- Parse queue JSON and confirm 20 approved row-54 versions, five IDs, four
  source records, five claims, deferred-only metadata, row-61 unchanged, and
  pending-review count 81.
- Confirm no trauma/VKA import in `synthetic-content.ts` and no active concept
  or case admission; run targeted mojibake and `git diff --check` checks.

## Progress

- [x] Owner reviewed the v1 question architecture and final wording edits.
- [x] Exact 20-version approval recorded.
- [x] Explicit batch-implementation instruction received.
- [x] Source/claim package, exact deferred module, focused tests, and export
  completed without active runtime admission.
- [x] Sol reviewed the exact package and final validation. Focused clinical
  coverage passed 4 files / 23 tests; the final sequential root suite passed
  144 files / 895 tests, root typecheck passed all seven workspaces, the player
  build passed with only its existing large-chunk advisory, and `git diff
  --check` passed.

## Exact next action

Do not admit row 54 into active runtime. Later capability and future-release
work requires the appropriate release boundary plus exact named-clinician
approval for every wording revision or new variant.
