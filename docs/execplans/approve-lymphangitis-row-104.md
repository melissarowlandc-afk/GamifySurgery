# Approve and Integrate Owner Row 104: Lymphangitis Recognition

## Goal

Record the owner's 2026-08-21 clinical approval of the reviewed lymphangitis-recognition concept and five exact question variants, then admit that approved package to the existing owner/development clinical release at `release.l0.clinic_evaluation`.

## Requirements

- Preserve one narrow FSRS concept: recognition of acute lymphangitis from a distal skin entry site, a tender erythematous streak extending proximally, and tender regional lymph nodes.
- Implement the five reviewed, single-select, three-choice variants with shuffled answer order.
- Keep every case to one scored decision; do not add treatment, organism, laboratory, imaging, probability, or timing claims.
- Give each vignette one brief, patient-specific presentation and keep the question stem out of the presentation column.
- Record named clinician approval, source provenance to `Gamify Surgery Concepts (4).xlsx`, Sheet1 row 104, and atomic source-to-claim provenance.
- Source metadata remains `needs_clinician_review`; the exact approved claim, concept, variants, and cases are `clinically_approved` by Melissa Rowland, MD.
- Add focused structural/release tests and update the durable approval record.

## Constraints and non-goals

- Do not change gameplay, balance, schemas, FSRS behavior, or unrelated clinical packages.
- Do not ingest proprietary sources or copy source prose.
- Preserve all unrelated dirty-worktree changes.
- Do not refresh the entire workbook queue in this milestone unless required for the exact row-104 approval record.

## Relevant repository state

- Approved content packages live in `packages/clinical-content/src/approved-data/` and are merged by `packages/clinical-content/src/synthetic-content.ts`.
- Public exports live in `packages/clinical-content/src/index.ts`.
- Approval receipts live in `docs/clinical-workbench/approvals/`.
- The working tree contains extensive unrelated owner work; only files enumerated below are owned by this milestone.

## Decisions already made

- Release point: `release.l0.clinic_evaluation`.
- Concept split: one diagnosis/recognition concept only.
- Variants: five reviewed recognition variants, including direct-pattern and reverse-finding forms.
- Answer format: single-select, exactly three choices, one correct choice, shuffled.
- Evidence scope: classic clinical recognition only.

## Milestones and file ownership

1. Terra implements the package and focused test:
   - `packages/clinical-content/src/approved-data/lymphangitis-recognition.ts`
   - `packages/clinical-content/src/approved-data/lymphangitis-recognition.test.ts`
2. Terra integrates and records approval:
   - `packages/clinical-content/src/synthetic-content.ts`
   - `packages/clinical-content/src/index.ts`
   - `docs/clinical-workbench/approvals/owner-row-104-lymphangitis-recognition.md`
3. Sol reviews the actual diff and validation evidence, runs any needed regression check, and then presents the next ranked unreviewed concept.

## Acceptance criteria

- Exactly one stable concept and five approved cases/question variants are present once in the active development release.
- Every decision has exactly three choices, exactly one key, shuffled order, and complete bounded wrong-final dispositions.
- All five cases are routine-eligible, non-tutorial, Level 0 clinic cases with no result gate or capability requirement.
- Source IDs, claim IDs, approval IDs, variant IDs, and case IDs are unique and fully linked.
- Release validation, focused tests, and package typecheck pass.

## Validation

- `npm test --workspace @gamify-surgery/clinical-content -- lymphangitis-recognition.test.ts`
- `npm run typecheck --workspace @gamify-surgery/clinical-content`
- If focused checks pass, run the complete clinical-content package test suite.

## Progress

- [x] Owner approved the concept and five reviewed variants.
- [x] Source review retained MSD Manual Professional as the sole adequate targeted-verification record for the classic phenotype.
- [x] Terra implementation and focused tests.
- [x] Sol diff review and regression validation.
- [x] Remove hard-coded patient names from presentation prose so runtime-generated chart identities cannot conflict.
- [x] Present the next ranked concept for owner review.

## Discoveries

- Workbook row 104 contains no complete evidence packet, so the implementation needs repository-native source and atomic-claim records.
- Existing approved packages intentionally keep source-metadata review state separate from clinician approval of the exact teaching content.
- The focused lymphangitis and affected breast-cyst tests, clinical-content typecheck, and complete clinical-content suite pass after the exact active-case assertion was extended with the five newly admitted lymphangitis cases.
- A candidate source was removed because its terms prohibit automated/AI access and derivative use. The atomic claim documents the resulting single-source limitation, while source metadata remains `needs_clinician_review`.
- Sol reran the focused package/narrative tests (10/10), package typecheck, and the complete clinical-content suite (198/198) after the final presentation-only correction.

## Exact next action

Await the owner's decision on the next ranked concept; do not implement it before explicit approval.
