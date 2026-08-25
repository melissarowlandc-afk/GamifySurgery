# Approve accessory-spleen location concept (owner row 58)

## Goal

Implement the owner-approved accessory-spleen anatomy concept from `Gamify Surgery Concepts (4).xlsx`, Sheet1 row 58, as replaceable Level 0 clinical content with four reviewed variants, complete provenance, focused tests, and active-release integration.

## Requirements

- Create one stable anatomy concept for the splenic hilum as the most common location of an accessory spleen.
- Release it at `release.l0.clinic_evaluation` as a clinic discussion surrounding referral for hospital splenectomy; do not simulate hospital surgery.
- Add the four explicitly approved one-patient variants: preoperative counseling, imaging review, operative planning, and reverse location recognition.
- Each decision is single-select, has exactly three concise answer choices, one correct choice, and shuffled display order.
- Use original patient-specific presentations without copying source prose.
- Preserve one primary concept per scored decision and campaign-scoped FSRS behavior.
- Record Melissa Rowland, MD's explicit approval on 2026-08-21 and workbook provenance to row 58.
- Keep source-metadata review separate from the clinically approved content version.

## Approved variants

1. Hereditary-spherocytosis preoperative counseling: splenic hilum (correct), pancreatic tail, greater omentum.
2. Preoperative imaging review: adjacent to splenic hilum (correct), near hepatic hilum, along splenocolic ligament.
3. Hospital-splenectomy planning discussion: splenic hilum (correct), gastrosplenic ligament, greater omentum.
4. Reverse location recognition: nodule at splenic hilum (correct), nodule beside pancreatic tail, nodule within greater omentum.

## Constraints and non-goals

- Do not teach an exact prevalence percentage.
- Do not add management of recurrent hemolysis, completion splenectomy, or reoperation; those require a separately approved concept.
- Do not imply that inspection of only one location is sufficient during splenectomy.
- Do not add a multistep encounter yet. The future pairing with recognition of retained accessory splenic tissue remains deferred.
- Do not add gameplay, balance, facility, or visual changes.
- Preserve unrelated dirty-worktree changes. Do not commit or push.

## Evidence basis

- Vikse J, et al. *The prevalence and morphometry of an accessory spleen: A meta-analysis and systematic review of 22,487 patients.* Int J Surg. 2017;45:18-28. doi:10.1016/j.ijsu.2017.07.045. PMID:28716661.
- NCBI Bookshelf, *Accessory Spleen*, as an independent clinical cross-check. Record complete locally verifiable metadata and access date; do not invent missing metadata.
- Both sources support the stable anatomical teaching point that the splenic hilum is the most common location. Store no copied prose or exact percentage.

## Relevant repository state

- Approved packages live under `packages/clinical-content/src/approved-data/`.
- Active clinician-reviewed cases are integrated through `packages/clinical-content/src/synthetic-content.ts` and exported from `packages/clinical-content/src/index.ts`.
- The exact active-case assertion currently lives in `packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts`.
- The working tree contains extensive unrelated user work that must remain untouched.

## Milestones

1. Terra creates the row-58 source, claim, approval, concept, four variants, four cases, and four encounter blueprints.
2. Terra integrates the concept and cases into the current Level 0 release and exact-case assertions.
3. Terra records the owner approval under `docs/clinical-workbench/approvals/` and adds focused tests.
4. Sol reviews the actual diff and independently reruns focused, typecheck, and full package validation.

## File or module ownership

- New: `packages/clinical-content/src/approved-data/accessory-spleen-location.ts`
- New: `packages/clinical-content/src/approved-data/accessory-spleen-location.test.ts`
- New: `docs/clinical-workbench/approvals/owner-row-058-accessory-spleen-location.md`
- Modify only required integration points in `packages/clinical-content/src/synthetic-content.ts`, `packages/clinical-content/src/index.ts`, and the active-release exact-case assertion.
- Update this ExecPlan's Progress, Discoveries, and Exact next action only.

## Acceptance criteria

- Exactly one new concept, four question variants, four active Level 0 cases, and four blueprints.
- Every question has three shuffled choices and exactly one key.
- Every case is a one-patient clinic narrative and uses no timed service or result gate.
- The correct location is the splenic hilum; no question contains an invented exact percentage.
- No case teaches completion splenectomy or other unapproved management.
- Sources contain required metadata, atomic claims link to those sources, source metadata remains `needs_clinician_review`, and the approved content records are `clinically_approved`.
- The package appears exactly once in the active release without altering prior stable IDs.

## Validation

- `npm test --workspace @gamify-surgery/clinical-content -- accessory-spleen-location.test.ts breast-cyst-pathway.test.ts playable-patient-narrative.test.ts`
- `npm run typecheck --workspace @gamify-surgery/clinical-content`
- `npm test --workspace @gamify-surgery/clinical-content`
- Bounded `git diff --check` on owned paths.

## Progress

- [x] Owner approved the four variants.
- [x] Terra implementation and validation.
- [x] Sol diff review and final regression validation.

## Discoveries

- This concept is appropriate as a standalone Level 0 anatomy decision. A future multistep pairing requires separate approval of the retained-accessory-spleen recognition concept.
- The verified NCBI Bookshelf StatPearls metadata provides an independent cross-check for both recorded anatomy claims.

## Exact next action

No row-58 implementation work remains. Await the owner's next concept-review request.
