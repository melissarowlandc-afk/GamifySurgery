# Owner Row 42: Exact Gastric Splenectomy Approval

Status: Clinically approved and deferred to Level 2 Endoscopy and Future
Hospital OR

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-042.2026-08-06`

Content version: `clinical.owner-row-042.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 42
- Source record: `owner-concept.sheet1.row-042`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-05-v3`
- Scope decision:
  `decision.owner-row-042.staged-prophylactic-splenectomy-avoidance.2026-08-06`

The owner approved one FSRS concept, four complete single-select Question
Variants, their answer sets, keyed answers, explanations, and staged release
plan. Two counseling/referral variants begin at Level 2 Endoscopy; two
operative-planning variants remain deferred to Future Hospital OR. Automated
validation is structural verification, not clinical approval.

## Approved Tested Concept

`concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance`

- Concept type: `management`
- Educational difficulty: advanced operative oncology
- Earliest release point: `release.l2.endoscopy`
- Additional variant release point: `release.future.hospital_or`
- Earliest numeric facility stage: 2
- Eligible settings: `endoscopy`, `hospital_or`
- Current-game eligibility: deferred

All four Question Variants share this one campaign-scoped FSRS identity.

## Approved clinical scope

The concept applies to curative operative planning for resectable proximal
gastric adenocarcinoma without greater-curvature invasion, direct splenic
invasion, or suspected splenic-hilar disease. In this population, routine
prophylactic splenectomy does not improve survival and increases operative
morbidity. Spleen preservation is the approved teaching point.

This is not a claim that splenectomy is never appropriate. Greater-curvature
invasion, direct splenic invasion, and suspected splenic-hilar disease are
outside the approved routine-prophylaxis scenario. Falling outside that scope
does not itself prescribe an operation; it requires separately authored,
individualized oncologic planning.

Extent of gastrectomy, operative technique, full lymphadenectomy strategy,
and management of the excluded situations remain outside this concept.

## Approved Question Variants

Every variant contains a brief patient presentation, four single-select
choices, one keyed answer, complete distractor rationales, and shuffled answer
order.

### Level 2 post-endoscopy referral

`question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1`

Approved answer: `Avoid routine prophylactic splenectomy`

Incorrect choices:

- Add splenectomy to every total gastrectomy
- Add splenectomy for proximal location alone
- Add splenectomy solely to increase node yield

### Level 2 patient counseling

`question.gastric-adenocarcinoma.spleen-preservation-counseling.v1`

Approved answer:
`Spleen preservation maintains survival with less morbidity`

Incorrect choices:

- Routine splenectomy improves survival despite added operative morbidity
- Splenectomy is required for every curative resection
- Proximal location alone mandates splenic removal

### Future Hospital OR patient selection

`question.gastric-adenocarcinoma.spleen-preservation-patient-selection.v1`

Approved answer:
`Proximal cancer without greater-curvature, splenic, or hilar involvement`

Incorrect choices:

- Proximal cancer with direct tumor invasion extending into splenic parenchyma
- Proximal cancer with suspected metastatic disease in splenic-hilar nodes
- Proximal cancer with extensive tumor invasion along the greater curvature

### Future Hospital OR boundary

`question.gastric-adenocarcinoma.spleen-preservation-boundary.v1`

Approved answer: `Direct extension of the tumor into the spleen`

Incorrect choices:

- Location of the tumor in the proximal stomach
- A planned total gastrectomy for oncologic resection
- Need for standard regional lymph-node staging

## Answer-length safeguard

The correct choice is not the uniquely longest answer in any approved
variant. Labels remain concise enough for the chart.

## Runtime boundary

This package is not added to the playable Level 0-1 release. Level 2 variants
require the Level 2 Endoscopy release point and endoscopy capability. Hospital
OR variants have no numeric facility level and may not be admitted until the
Future Hospital OR progression and operative systems are designed and
separately authorized.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact teaching revision.
