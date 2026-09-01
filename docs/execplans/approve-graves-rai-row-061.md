# Approve and Later Integrate Owner Row 61: Graves Disease and RAI Counseling

## Goal

Preserve the 2026-08-31 clinician approval for six Graves/RAI concept scopes
and exactly six reviewed seed question versions/scopes, while explicitly deferring all runtime
implementation until the owner gives a later batch instruction.

## Requirements

- Preserve six independent FSRS identities:
  `concept.graves.clinical-pattern-recognition`,
  `concept.graves.trab-diagnostic-support`,
  `concept.graves.rai-appropriate-candidate`,
  `concept.graves.rai-pregnancy-contraindication`,
  `concept.graves.rai-lactation-contraindication`, and
  `concept.graves.rai-active-ted-avoidance`.
- Preserve approval only for the six reviewed seed question versions/scopes: classic-pattern
  recognition, TRAb support, recurrent-Graves RAI evaluation, pregnancy,
  current lactation, and active moderate-to-severe thyroid-eye-disease
  avoidance.
- Keep the future Level 0 release point limited to Clinic Evaluation
  counseling/referral. RAI is never administered onsite.
- Require at least four authored variants per concept, each with distinct
  patient presentations and retrieval directions, and exactly one primary
  concept per scored node.
- Preserve separate FSRS history for each concept.

## Constraints and non-goals

- The eighteen unseen expansion variants and every later seed-wording revision
  are `needs_clinician_review`; do not represent them as approved or
  runtime-ready.
- Do not add runtime allowlist entries, game content, encounters, source
  packages, tests, balance changes, service timers, commits, pushes, or
  deployments in this approval-record milestone.
- Do not use source prose or proprietary question content. Full source
  metadata and independently written atomic evidence claims remain required
  before implementation.
- Preserve unrelated worktree changes, including the Front Desk graphics work
  and the ignored local owner-review asset workspace.

## Relevant repository state

- The approval receipt is
  `docs/clinical-workbench/approvals/owner-row-061-graves-rai.md`.
- The structured queue record is
  `docs/clinical-workbench/concept-release-point-review-queue.json`.
- Approved runtime packages belong under
  `packages/clinical-content/src/approved-data/`, but none is authorized now.

## Decisions already made

- Reviewer: Melissa Rowland, MD; approval date: 2026-08-31.
- Workbook provenance: `Gamify Surgery Concepts (3).xlsx`, Sheet1 row 61,
  `owner-concept.sheet1.row-061`; unchanged in `(4).xlsx`.
- Evidence anchors reviewed: 2018 ETA Graves, 2023 EANM benign-thyroid RAI,
  2025 KTA hyperthyroidism RAI, 2022 ATA/ETA thyroid-eye-disease consensus,
  and 2026 ATA pregnancy/postpartum guidance.
- No runtime admission is approved. The six reviewed seed versions/scopes do
  not silently approve the remaining eighteen variants or any later revisions.

## Later milestones and ownership

1. After an explicit owner batch-implementation instruction, Terra authors the
   future source metadata and atomic claims, retaining all source/provenance
   requirements.
2. Terra authors the six seed records and the eighteen expansion variants as
   `needs_clinician_review`, with no runtime admission for unseen content.
3. The owner reviews every expansion variant exactly; only named approval may
   promote it.
4. After complete approval, Terra integrates the bounded runtime package and
   focused tests; Sol reviews the actual diff and validation evidence.

## Acceptance criteria for this approval-record milestone

- The queue distinguishes the six approved seed question versions/scopes from
  the eighteen unapproved expansion variants and all later wording revisions.
- The approval receipt preserves the six stable identities, release boundary,
  source-anchor prerequisite, and no-onsite-RAI rule.
- No runtime, source package, test, or gameplay file is changed.

## Validation

- `node -e "JSON.parse(require('fs').readFileSync('docs/clinical-workbench/concept-release-point-review-queue.json','utf8'))"`
- `git diff --check`

## Progress

- [x] Named clinician approved six scopes and six exact seed variants.
- [x] Approval, provenance, future release, and expansion-review boundaries recorded.
- [ ] Await explicit batch-implementation instruction.

## Discoveries

- The workbook row is unchanged between the owner’s `(3)` and `(4)` files.
- No pre-existing authored row-61 question/variant package exists in tracked or
  ignored workbench data.

## Exact next action

Continue owner concept review. Do not implement row 61 until an explicit batch
instruction; then author the remaining variants as `needs_clinician_review` and
return them for exact named-clinician approval before runtime admission.
