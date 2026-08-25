# Approve and Integrate Owner Row 92: HCC Resection Selection

## Goal

Record the owner's 2026-08-21 clinician approval of one Level 0 HCC resection-selection concept, add four approved three-choice question variants to the owner/development release, and add one active two-decision encounter that first applies the already-approved Milan-criteria concept and then applies the new resection-selection concept.

## Requirements

- Preserve a new FSRS identity: `concept.hcc.compensated-cirrhosis-resection-selection`.
- Keep it separate from the existing `concept.hcc.milan-transplant-evaluation` identity.
- Add exactly four new management question variants, each with three shuffled single-select choices and one key.
- Add four standalone Level 0 Clinic Evaluation cases plus one Level 0 combined two-decision case that reuses one already-approved Milan decision as its first node and one row-92 management decision as its second node.
- Every resection-keyed presentation must establish one solitary HCC, preserved/Child-Pugh A liver function, no clinically significant portal hypertension, adequate future liver remnant, and no macrovascular invasion or extrahepatic disease when those boundaries are relevant.
- The correct disposition is hospital HPB-surgery referral for hepatic resection evaluation. Do not simulate or schedule the operation in the ambulatory center.
- Keep answer wording parallel so the correct option is not uniquely signaled by phrasing or length.
- Record named clinician approval, workbook provenance to `Gamify Surgery Concepts (4).xlsx` Sheet1 row 92, complete source metadata, and atomic evidence claims.

## Approved variants

1. Direct treatment selection for a solitary 4.0-cm peripheral HCC in an ideal resection candidate. Three choices: HPB surgery for hepatic resection (correct), transplant center for liver transplantation, interventional radiology for thermal ablation.
2. Milan-criteria trap for a solitary 4.6-cm HCC: preserved hepatic reserve supports resection (correct), Milan eligibility requires transplantation, or solitary disease requires thermal ablation.
3. Candidate-profile recognition: preserved function/no clinically significant portal hypertension/adequate remnant (correct), preserved function/significant portal hypertension/inadequate remnant, or decompensated function/no distant disease/inadequate remnant.
4. Required operative consideration: adequate future liver remnant (correct), normal serum AFP, or Milan eligibility alone.

## Constraints and non-goals

- Child-Pugh A status alone must never be presented as sufficient for resection selection.
- Do not teach that clinically significant portal hypertension is an absolute contraindication to every limited resection; this package teaches only the clear favorable profile.
- Do not teach Milan criteria as automatic transplant listing or automatic treatment selection.
- Do not add AFP thresholds, transplant-allocation policy, downstaging policy, ablation-size rules, operative technique, survival estimates, treatment timing, or result/service timers.
- Do not modify the meaning, stable IDs, answer choices, or approval state of the existing row-29 Milan content.
- Do not add gameplay, facility, or balance changes. Preserve unrelated dirty-worktree changes. Do not commit or push.

## Relevant repository state

- The existing Milan concept and cases are in `packages/clinical-content/src/approved-data/hcc-milan-criteria.ts`.
- Clinically approved active packages are integrated through `packages/clinical-content/src/synthetic-content.ts` and exported by `packages/clinical-content/src/index.ts`.
- Existing multi-decision active cases demonstrate that a first node may have `resultGateAfter: null`, empty terminal dispositions, and advance after feedback acknowledgement.
- The active-release exact-case assertion is maintained in `packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts`.

## Decisions already made

- Release point: `release.l0.clinic_evaluation`.
- Concept type: `management`.
- The surgery is hospital-only, so the game action remains referral to hospital HPB surgery.
- The combined encounter uses two independent primary concepts and therefore two independent campaign-scoped FSRS updates.
- No test or timed service occurs between these two decisions; the second decision follows an authored assessment update after feedback acknowledgement.
- New row-92 questions use three answer choices. The combined encounter may reuse an existing row-29 four-choice decision without changing that previously approved question.

## Evidence basis

- AASLD 2023 guidance supports resection as treatment of choice for limited tumor burden in well-compensated cirrhosis without clinically significant portal hypertension when an adequate future liver remnant is available.
- EASL 2025 guidance supports liver resection for a single HCC larger than 2 cm when hepatic function is preserved and sufficient remnant volume can be maintained, while emphasizing multiparametric selection and nuance around portal hypertension.

## Milestones and file ownership

1. Terra creates and tests the bounded row-92 package under `packages/clinical-content/src/approved-data/`.
2. Terra integrates its five active Level 0 cases and exports its records through existing clinical-content entry points.
3. Terra records the approval under `docs/clinical-workbench/approvals/`.
4. Sol reviews the actual diff and reruns focused, typecheck, and full clinical-content validation.

## Acceptance criteria

- Exactly one new stable concept, four new question variants, four standalone cases, one combined two-decision case, and five encounter blueprints are recorded.
- Each new row-92 question has exactly three shuffled choices and one correct choice.
- The combined case's primary-concept sequence is Milan criteria then HCC resection selection; it contains no service gate.
- All cases are Level 0 clinic encounters and hospital referral language is preserved.
- No case claims that Child-Pugh A alone determines treatment or that portal hypertension is universally prohibitive.
- Sources and claims satisfy repository provenance policy with independently synthesized wording.
- No row-29 identifiers or question content are changed.

## Validation

- `npm test --workspace @gamify-surgery/clinical-content -- hcc-resection-selection.test.ts hcc-milan-criteria.test.ts breast-cyst-pathway.test.ts playable-patient-narrative.test.ts`
- `npm run typecheck --workspace @gamify-surgery/clinical-content`
- `npm test --workspace @gamify-surgery/clinical-content`
- `git diff --check`

## Progress

- [x] Owner approved the four variants and two-decision pairing.
- [x] Current AASLD and EASL guidance checked.
- [x] Terra implementation and validation.
- [x] Sol diff review and final regression validation.
- [x] Present next ranked concept.

## Discoveries

- Row 29 already supplies an approved Milan-criteria decision suitable for reuse without creating another FSRS identity.
- Current guidance requires a multiparametric resection profile; the workbook's original Child-Pugh A descriptor is not sufficient by itself.
- EASL 2025 bibliographic metadata was not locally verifiable, so the package retains the locally verified AASLD source only and records that limitation.

## Exact next action

Await owner review of the next ranked concept; do not implement it before explicit approval.
