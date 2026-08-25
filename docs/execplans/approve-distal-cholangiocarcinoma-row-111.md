# Approve and Integrate Owner Row 111: Distal Cholangiocarcinoma

## Goal

Record the owner's 2026-08-21 approval of separate distal-cholangiocarcinoma tissue-evaluation and resection-selection concepts, admit the Level 0 hospital-referral variants to the owner/development release, and preserve the Level 2 Endoscopy variants as an exact approved deferred package with an eight-facility-hour result requirement.

## Requirements

- Preserve two FSRS identities: one workup concept and one management concept.
- Implement four encounter blueprints: a deferred Level 2 two-decision encounter, a deferred Level 2 workup-only encounter, an active Level 0 treatment-only encounter, and an active Level 0 reverse-location encounter.
- The Level 2 workup cases require `release.l2.endoscopy`, `capability.endoscopy`, and an editorial 480-minute result gate when the future Endoscopy Suite runtime is admitted.
- Use varied three-choice workup distractors rather than an all-EUS/ERCP choice set.
- In the treatment decisions, put `Refer to hospital HPB surgery for` in the question stem and keep the answer labels procedure-only. The correct answer must not have unique referral wording.
- Include `Bile-duct excision with hepaticojejunostomy` as an operative distractor.
- Keep answer display shuffled and every scored node bound to exactly one primary concept.
- Record named clinician approval, workbook provenance to `Gamify Surgery Concepts (4).xlsx` Sheet1 row 111, complete source metadata, and atomic evidence claims.

## Constraints and non-goals

- Distal cholangiocarcinoma surgery is hospital-only; do not schedule or simulate a Whipple in the ambulatory center.
- Do not use CA 19-9 as diagnostic confirmation.
- Do not admit the endoscopic workup cases to the currently playable Level 0-1 release before the Endoscopy Suite encounter framework exists.
- Do not add Level 2 rooms, staff, gameplay, or a partially functional service route to the Level 0-1 balance release.
- Treat 480 minutes as a separately labeled editorial simulation value, not a clinical turnaround-time claim.
- Preserve unrelated dirty-worktree changes. Do not commit or push.

## Relevant repository state

- Clinically approved active packages live in `packages/clinical-content/src/approved-data/` and are merged by `packages/clinical-content/src/synthetic-content.ts`.
- Approved future-level material follows the deferred question-pool/blueprint/backlog pattern used by existing Level 2 packages.
- The active release exact-case assertion lives in `packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts`.
- The current balance schema intentionally supports only playable Levels 0-1, so the future 480-minute endoscopy service requirement belongs in deferred content metadata until the Level 2 runtime exists.

## Decisions already made

- Workup concept: Level 2 Endoscopy, operational Endoscopy Suite required, eight-hour result turnaround.
- Resection-selection concept: Level 0 Clinic Evaluation for hospital referral.
- Combined encounter: Level 2 because the first decision uses the Endoscopy Suite.
- Correct tissue plan for the approved jaundiced operable distal-obstruction profile: EUS-guided sampling with ERCP brushings.
- Correct operation referral: hospital HPB surgery for Whipple evaluation.
- Shared-referral stem prevents the correct answer from receiving unique wording.
- General surgery-action rule: ASC-eligible operations change from referral to scheduling only when the required ambulatory capability is operational; hospital-only operations always remain specialist hospital referrals. This package exercises only the hospital-only branch.

## Milestones and file ownership

1. Terra creates and tests the bounded row-111 clinical package under `packages/clinical-content/src/approved-data/`.
2. Terra integrates only active Level 0 cases and exports all active/deferred row-111 records through the existing clinical-content entry points.
3. Terra records the approval and the approved general surgery-action wording rule in the narrowest relevant documentation.
4. Sol reviews the actual diff and reruns focused, typecheck, and complete clinical-content validation.

## Acceptance criteria

- Exactly two stable concepts, five question variants, and four encounter blueprints are recorded.
- Only the treatment-only and reverse-location Level 0 cases enter the active release.
- The two Level 2 blueprints remain approved but deferred, require `capability.endoscopy`, and preserve the 480-minute editorial requirement.
- Every question has three shuffled single-select choices with one key.
- Treatment stems share the hospital-HPB referral wording; procedure labels alone appear in answer choices.
- The correct procedure is pancreaticoduodenectomy/Whipple; the requested hepaticojejunostomy distractor is present.
- Sources and claims satisfy repository provenance policy.
- No legacy prototype case is re-admitted.

## Validation

- `npm test --workspace @gamify-surgery/clinical-content -- distal-cholangiocarcinoma.test.ts breast-cyst-pathway.test.ts playable-patient-narrative.test.ts`
- `npm run typecheck --workspace @gamify-surgery/clinical-content`
- `npm test --workspace @gamify-surgery/clinical-content`
- `git diff --check`

## Progress

- [x] Owner approved the revised two-concept/four-blueprint package and shared-referral-stem wording.
- [x] Current BSG and NCI sources checked.
- [x] Terra implementation and validation.
- [x] Sol diff review and final regression validation.
- [ ] Present next ranked concept.

## Discoveries

- The active Level 0-1 balance release does not yet model Level 2 rooms or services; adding a live endoscopy route now would exceed this content milestone.
- Existing approved Level 2 packages provide a deferred backlog pattern that preserves exact content and capability requirements without exposing unavailable encounters.
- The active release contains only the two Level 0 management cases; the deferred L2 workup blueprints retain capability and editorial simulation metadata outside runtime admission.
- Sol review caught and corrected a metadata-boundary defect: all deferred workup choices now carry explicit eight-hour editorial service metadata, while the later hospital-referral decision carries no service timer.
- Treatment choices are procedure-only noun phrases; the correct key uses `Whipple pancreaticoduodenectomy` without unique parenthetical or referral formatting.
- Each deferred workup answer now carries its own stable deferred service ID and explicit 480-minute editorial timing, while the shared result gate remains at variant and blueprint scope.

## Exact next action

The row-111 package is integrated and regression-validated. Select and present the next strongest unreviewed concept from the owner workbook when the review sequence continues.
