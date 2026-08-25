# Approve and Integrate Owner Row 119: Incidental Gallbladder Polyp Management

## Goal

Record the owner's 2026-08-21 clinical approval of one Level 0 incidental gallbladder-polyp management concept and six exact question variants, then admit the package to the owner/development release.

## Requirements

- Preserve one FSRS identity: `concept.gallbladder-polyp.initial-management-category`.
- Teach only the concordant management categories approved by the owner: prompt surgical/cholecystectomy evaluation, ultrasound surveillance, or no further follow-up.
- Implement six one-decision, three-choice, shuffled variants: 16 mm surgical evaluation; 12 mm plus 5 mm adjacent focal wall thickening surgical evaluation; 8 mm thick-stalk without focal wall thickening or PSC ultrasound surveillance; 4 mm thin-stalk without suspicious features or PSC no further follow-up; reverse surgical-profile selection; reverse surveillance-profile selection.
- Use brief one-patient presentations and balanced concise choices. Do not hard-code a patient name that can conflict with the runtime identity.
- Record named approval and provenance to `Gamify Surgery Concepts (4).xlsx`, Sheet1 row 119.
- Record complete source metadata and atomic claims for the 2022 joint European guideline, 2022 SRU consensus, and 2025/2026 Canadian update endorsing SRU.
- Keep source metadata `needs_clinician_review`; the exact owner-approved claims, variants, and release assignment are `clinically_approved`.

## Constraints and non-goals

- Do not encode the spreadsheet's older hybrid rule, exact surveillance intervals, age/ethnicity selection, cirrhosis or gallstones as risk selectors, or disputed borderline thresholds.
- Do not add an ultrasound-ordering decision, result gate, surgery simulation, treatment outcome, or multi-decision encounter.
- Do not change gameplay, balance, schemas, progression, or unrelated clinical packages.
- Preserve all unrelated dirty-worktree changes. Do not commit or push.

## Relevant repository state

- Approved packages live in `packages/clinical-content/src/approved-data/` and are merged by `packages/clinical-content/src/synthetic-content.ts`.
- Public exports live in `packages/clinical-content/src/index.ts`.
- The active release's exact-case regression assertion currently lives in `packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts` and must be extended without admitting legacy prototype cases.

## Decisions already made

- Release point: `release.l0.clinic_evaluation`.
- Concept split: one management-category concept.
- Six exact variants and keys were approved by the owner.
- Exact follow-up schedules and framework-specific borderline rules are deferred.
- Multi-decision assessment: single decision is preferred because the approved patient arrives with an existing ultrasound result; ordering ultrasound would be a different concept.

## Milestones and file ownership

1. Terra implements and tests:
   - `packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts`
   - `packages/clinical-content/src/approved-data/gallbladder-polyp-management.test.ts`
2. Terra integrates and records approval:
   - `packages/clinical-content/src/synthetic-content.ts`
   - `packages/clinical-content/src/index.ts`
   - `packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts`
   - `docs/clinical-workbench/approvals/owner-row-119-gallbladder-polyp-management.md`
3. Sol inspects the actual content/diff, validates it, and presents the next ranked unreviewed concept.

## Acceptance criteria

- One stable concept and exactly six approved cases/question variants are admitted once.
- Each case is non-tutorial, routine-eligible, Level 0 clinic content with one shuffled three-choice decision, no service request/result gate, and bounded wrong-final dispositions.
- Correct answers match the six owner-approved keys.
- Evidence records explicitly preserve the European-versus-SRU threshold disagreement and limit the teaching point to concordant categories.
- The release validator, focused tests, narrative tests, package typecheck, and complete clinical-content suite pass.

## Validation

- `npm test --workspace @gamify-surgery/clinical-content -- gallbladder-polyp-management.test.ts breast-cyst-pathway.test.ts playable-patient-narrative.test.ts`
- `npm run typecheck --workspace @gamify-surgery/clinical-content`
- `npm test --workspace @gamify-surgery/clinical-content`

## Progress

- [x] Owner approved the one-concept, six-variant set and deferral of exact surveillance timing.
- [x] Current source reconciliation identified the guideline disagreement and the approved concordant profiles.
- [x] Terra implementation and validation.
- [x] Sol review and final regression validation.
- [x] Present next ranked concept.

## Discoveries

- The workbook's older hybrid thresholds are not a coherent current guideline framework.
- The joint European guideline and SRU/CAR framework agree on the approved profile-level categories while differing on other thresholds and surveillance schedules.
- The focused management, active-case assertion, and playable-narrative tests pass; package typecheck and the complete clinical-content suite pass with the six active cases.

## Exact next action

The approved row-119 package is integrated and regression-validated. Continue the owner review queue with distal cholangiocarcinoma, proposed as separate diagnostic-workup and resection-selection concepts that can form a two-decision encounter.
