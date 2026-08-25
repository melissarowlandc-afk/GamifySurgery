# Approve and Integrate Owner Row 115: Obstructive Jaundice and Vitamin K

## Goal

Record the owner's 2026-08-21 clinician approval of one narrow Level 0 concept linking obstructive jaundice to impaired vitamin K absorption and coagulopathy, add four approved patient-specific question variants to the owner/development release, and preserve the concept as a possible future decision within a separate multi-decision biliary encounter without altering previously approved row-111 content.

## Requirements

- Preserve one FSRS identity: `concept.obstructive-jaundice.vitamin-k-coagulopathy`.
- Add four one-decision, Level 0 Clinic Evaluation cases with three shuffled single-select choices each.
- Variant 1 must ask which vitamin explains the bleeding findings and use vitamin names only as answer labels: Vitamin K, Vitamin D, and Vitamin A. Do not append manifestations to those labels.
- Variant 2 must test reduced vitamin K absorption as the mechanism, with concise similarly styled distractors.
- Variant 3 must ask for the expected laboratory finding without telling the player that the obstruction has impaired absorption of a fat-soluble vitamin.
- Variant 4 must use a reverse patient presentation and ask which deficiency explains the bleeding.
- Keep each presentation about one individual patient, place presentation text only in the presentation field, balance answer length, and mark exactly one correct choice.
- Record named clinician approval, workbook provenance to `Gamify Surgery Concepts (4).xlsx` Sheet1 row 115, complete source metadata, and atomic evidence claims.

## Constraints and non-goals

- Do not bundle vitamin A, D, or E manifestations into the approved FSRS identity; they remain possible separate future concepts.
- Do not claim that every patient with obstructive jaundice develops vitamin K deficiency or bleeding.
- Do not add exact probabilities, deficiency timelines, treatment doses, invasive procedures, service timers, or result gates.
- Do not change or append decisions to the already approved distal-cholangiocarcinoma row-111 package in this milestone.
- Do not add new gameplay, balance, or facility systems.
- Preserve unrelated dirty-worktree changes. Do not commit or push.

## Relevant repository state

- Clinically approved active packages live in `packages/clinical-content/src/approved-data/` and are merged through `packages/clinical-content/src/synthetic-content.ts`.
- Public exports are listed in `packages/clinical-content/src/index.ts`.
- The active-release exact-case regression assertion is maintained in `packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts`.
- Approval records live in `docs/clinical-workbench/approvals/`.

## Decisions already made

- Release point: `release.l0.clinic_evaluation`.
- Concept type: applied science/complication, represented by one narrow concept identity.
- Core point: reduced bile delivery in obstructive jaundice can impair intestinal vitamin K absorption, producing vitamin K-related coagulation abnormalities including increased PT/INR and bleeding manifestations.
- Variant 1 answer labels are vitamins only so the manifestations do not reveal the key.
- Variant 3 does not disclose fat-soluble-vitamin malabsorption in the stem or presentation.
- The owner explicitly approved the revised package on 2026-08-21.

## Milestones and file ownership

1. Terra creates and tests the bounded row-115 package under `packages/clinical-content/src/approved-data/`.
2. Terra integrates the four active Level 0 cases and exports all row-115 records through existing clinical-content entry points.
3. Terra records the owner approval under `docs/clinical-workbench/approvals/`.
4. Sol reviews the actual diff and reruns focused, typecheck, and complete clinical-content validation.

## Acceptance criteria

- Exactly one stable concept, four question variants, four active cases, and four encounter blueprints are recorded.
- All four cases enter only the owner/development Level 0 release.
- Every question has exactly three shuffled single-select choices and one key.
- Variant 1 choices are exactly `Vitamin K`, `Vitamin D`, and `Vitamin A`, with Vitamin K correct.
- Variant 3 contains no phrase that discloses impaired fat-soluble-vitamin absorption.
- Each decision updates exactly the row-115 primary concept.
- Sources and atomic claims satisfy repository provenance fields, with independently synthesized wording.
- No legacy prototype case is admitted and no row-111 content is changed.

## Validation

- `npm test --workspace @gamify-surgery/clinical-content -- obstructive-jaundice-vitamin-k.test.ts breast-cyst-pathway.test.ts playable-patient-narrative.test.ts`
- `npm run typecheck --workspace @gamify-surgery/clinical-content`
- `npm test --workspace @gamify-surgery/clinical-content`
- `git diff --check`

## Progress

- [x] Owner approved the package with two wording corrections.
- [x] Current obstructive-jaundice and vitamin K references checked.
- [x] Terra implementation and validation.
- [x] Sol diff review and final regression validation.
- [ ] Present next ranked concept.

## Discoveries

- The 2025 open-access vitamin K review supports vitamin K deficiency as a coagulopathy with increased PT/INR, while current obstructive-jaundice references support impaired vitamin K absorption when bile delivery is reduced.
- The other fat-soluble-vitamin manifestations in workbook row 115 should not be silently combined into this concept because that would weaken FSRS specificity.
- The four active one-decision cases remain independent; no row-111 multidecision link was created.
- Sol review restored the explicit distal-obstruction context in Variant 1, replaced internal wording in Variant 3, completed the six-author source citation, and recorded the verified CC BY-NC 4.0 reuse status.
- Final validation passed 31 clinical-content test files with 216 tests, package typechecking, and the bounded diff whitespace check.

## Exact next action

Present row 92, the next ranked early-release concept, for owner review as a distinct HCC resection-selection identity that can later pair with the already approved Milan-criteria concept.
