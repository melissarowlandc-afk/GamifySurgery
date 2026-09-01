# Implement Approved Clinical Content Batch — 2026-08-31

## Goal

Implement every exact, clinically approved question set from the current owner
review sequence without widening its approved release point: make the complete
Level 0 clinic sets playable now, package the complete future Level 3 and
future ED sets as validated deferred data, and leave the incomplete Graves/RAI
seeds outside runtime until their exact question variants are reviewed.

## Requirements

- Preserve every approved stable concept ID so existing and future FSRS history
  remains attached to the intended retrieval target.
- Record Melissa Rowland, MD's 2026-08-31 exact approval of the row-62 MEN2A
  batch before runtime integration.
- The approved MEN2A 2B stem is exactly:
  "An asymptomatic patient with hereditary medullary thyroid carcinoma has
  completed the neck evaluation and is preparing for thyroid intervention.
  Which occult condition must be excluded before proceeding?"
  It must not include the earlier sentence stating that the record contains no
  pheochromocytoma evaluation.
- Runtime answer choices must shuffle on every presentation.
- One scored question must have exactly one primary stable concept.
- Preserve the approved Level 0, Level 3, and future-ED release boundaries.
- Preserve existing frozen encounters and saves; this should be an additive
  content change with no save migration.

## Constraints and non-goals

- Do not author, package, or admit the six row-61 Graves/RAI concepts. Their
  receipt approves only six seed scopes, not runtime stems/answers, and the
  remaining eighteen variants plus the source/claim package still require
  exact clinician review.
- Do not import row-53 phyllodes or row-54 trauma/VKA into the active synthetic
  release. Current game state supports numeric facility stages 0–2 and cannot
  safely enforce their approved Level 3 or future-ED boundaries.
- Do not change the clinical meaning or wording of an approved question,
  answer, or explanation. Mechanical conversion from receipt fields into the
  typed data model must preserve the exact reviewed text.
- Independently authored source metadata and atomic-claim prose remain
  `needs_clinician_review` unless the exact version was itself shown and
  approved; exact reviewed question records may be `clinically_approved`.
- Do not touch, revert, stage, commit, or push unrelated Front Desk,
  Examination Room, art, screenshot, local-photo, or other user/worker changes.
- No merge, deployment, Pages publication, or GitHub push is authorized by
  this plan.

## Relevant repository state

- Branch: `beta`, tracking `origin/beta`; worktree contains unrelated graphics
  and clinical-review changes that must be preserved.
- Active clinical content is assembled in
  `packages/clinical-content/src/synthetic-content.ts` and exported by
  `packages/clinical-content/src/index.ts`.
- Active concept admission is asserted in
  `packages/game-domain/tests/approved-clinical-admission.test.ts`.
- Existing active package pattern:
  `packages/clinical-content/src/approved-data/lymphangitis-recognition.ts`.
- Existing deferred-data pattern:
  `packages/clinical-content/src/approved-data/right-thoracotomy-trauma-exposure.ts`.
- Approval receipts and queue records are under
  `docs/clinical-workbench/approvals/` and
  `docs/clinical-workbench/concept-release-point-review-queue.json`.

## Decisions already made

### Complete Level 0 sets to admit now

- Row 66: one concept, four variants.
- Row 87: one concept, four variants.
- Row 109: one concept, four variants.
- Row 62 MEN2A: three concepts, twelve variants, including the corrected 2B.
- Total active addition: six concepts and twenty-four variants/cases.

### Complete future sets to package but keep inactive

- Row 53 phyllodes: nine concepts and thirty-three variants at
  `release.l3.ambulatory_or_qi`.
- Row 54 trauma/VKA: five concepts and twenty variants at
  `release.future.ed_trauma`.
- Total deferred package addition: fourteen concepts and fifty-three variants.

### Incomplete set to withhold

- Row 61 Graves/RAI: six stable scopes and six seed descriptions only. It is
  not part of this implementation and becomes the first clinical review task
  after this batch.

## Milestones and ownership

### Milestone 1 — MEN2A approval record and complete Level 0 implementation

Owner: one sequential `terra_worker`.

Owned files/modules:

- New row-62 approval receipt and its focused ExecPlan/queue updates.
- New approved-data modules and tests for rows 66, 87, 109, and 62.
- `packages/clinical-content/src/index.ts`.
- `packages/clinical-content/src/synthetic-content.ts`.
- `packages/game-domain/tests/approved-clinical-admission.test.ts`.
- This plan's Progress/Discoveries/Exact next action sections.

Acceptance:

- Six new stable concepts and exactly twenty-four approved question variants
  are typed, exported, active at Level 0, and answer-shuffled.
- Each variant maps to one concept and one patient-linked case/blueprint.
- MEN2A 2B omits the disallowed cueing sentence.
- Source/claim/review metadata preserves the approval distinction.
- Focused clinical-content and game-domain tests pass.

### Milestone 2 — Deferred phyllodes and trauma/VKA packages

Owner: a later sequential `terra_worker` after Sol accepts Milestone 1.

Owned files/modules:

- New approved-data modules and tests for rows 53 and 54.
- Any narrowly required source/claim metadata in their approval receipts.
- `packages/clinical-content/src/index.ts` only for exports.
- This plan's Progress/Discoveries/Exact next action sections.

Acceptance:

- Fourteen concepts and exactly fifty-three approved variants are represented
  in typed, tested approved-data packages.
- Row 53 retains Level 3 and row 54 retains future-ED semantic release IDs,
  `earliestFacilityStage: null`, and explicit deferred eligibility.
- Neither set is imported by `synthetic-content.ts`, routine case IDs, or the
  active release.
- Tests explicitly prove their absence from the active release.

### Milestone 3 — Integration validation and handoff

Owner: Sol for review/acceptance; return nontrivial corrections to Terra.

- Review actual diffs and all worker validation evidence.
- Run focused and repository-wide validation.
- Reconcile approval plans, queue state, this plan, and
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.
- Report the Graves approval gap and prepare its exact variants as the next
  owner-review batch; do not implement them in this milestone.

## Validation

Focused:

```powershell
npm.cmd run typecheck --workspace @gamify-surgery/clinical-content
npm.cmd test --workspace @gamify-surgery/clinical-content
npm.cmd test --workspace @gamify-surgery/game-domain -- approved-clinical-admission clinical-selection
npm.cmd run typecheck --workspace @gamify-surgery/game-domain
git diff --check
```

Integrated:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
```

## Progress

- [x] Sol read repository instructions, handoff, dirty worktree, approval
  receipts, and active/deferred package patterns.
- [x] Terra completed a read-only inventory: twenty complete concepts and
  seventy-seven exact variants are packageable; Graves remains incomplete.
- [x] Milestone 1: document MEN2A approval and integrate twenty-four Level 0
  variants across six concepts; implementation and documentation reconciliation
  are complete.
- [x] Sol reviewed and accepted Milestone 1 focused validation.
- [x] Milestone 2A1: package row 53's thirty-three deferred phyllodes
  variants across nine concepts as exported, tested deferred data without
  active admission; source/claim records and queue/receipt reconciliation are
  complete.
- [x] Sol accepted the row-53 deferred-package authoring substep.
- [x] Milestone 2B1: author row 54's twenty deferred trauma/VKA variants
  across five concepts as a future-ED data module only.
- [x] Milestone 2B2: add exhaustive focused tests for row 54's exact variants,
  approval/source/claim boundaries, and active-release exclusion.
- [x] Milestone 2B3: export row 54 as deferred data and reconcile its
  receipt, queue, and implementation record without active admission.
- [x] Milestone 2: deferred row-53 and row-54 packages are complete; both are
  exported, tested deferred data without active admission.
- [x] Sol reviewed and accepted Milestone 2 focused validation.
- [x] Milestone 3: Sol completed integrated validation, queue/plan/handoff
  reconciliation, and the owner handoff.

## Discoveries

- Current `GameState.facilityLevel` and `SyntheticClinicalCase` support only
  numeric stages 0–2. Future semantic release IDs exist in documentation and
  deferred packages but cannot be safely admitted by the current reducer.
- Campaign-scoped FSRS initializes a concept history when first answered, and
  admitted encounters freeze their selected authored case. Additive Level 0
  concepts therefore require no save migration.
- The row-61 Graves receipt explicitly withholds runtime authoring and the
  eighteen unseen variants; a general instruction to implement approved work
  cannot substitute for exact clinical approval of unseen content.
- Independently authored source and atomic-claim wording remains
  `needs_clinician_review`; exact clinician-approved questions are active only
  in the owner/development-preview release.
- Exhaustive expected-case fixtures protect the active admission order: the
  withdrawal fixture lists `EARLY_GAME_CLINIC_BATCH_CASES`, then
  `ROW_062_CASES`, before Level 2 IDs. A stale list was corrected and the
  focused repair checks plus the final full suite passed.
- An early parallel gate timed out in the clinical-research DOCX boundary test
  under resource contention. Its isolated rerun passed, and the later
  sequential full suite passed all clinical-research tests; no unresolved test
  failure remains.

## Exact next action

Start a new bounded owner-review thread for the 24 Graves/RAI draft variants:
six early-game concepts with four exact patient-linked variants each. The row-61
receipt approves only six seed scopes, so do not implement Graves/RAI until the
exact wording and source/claim package receive named-clinician approval.

This substantial validated checkpoint remains local and unpushed. Ask the owner
to say **"push to GitHub"** before a scoped audit, commit, and backup push.
