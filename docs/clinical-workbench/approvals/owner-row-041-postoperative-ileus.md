# Owner Row 41: Exact Postoperative-Ileus Approval

Status: Clinically approved and deferred to Future Hospital Floor

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-041.2026-08-06`

Content version: `clinical.owner-row-041.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 41
- Source record: `owner-concept.sheet1.row-041`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-05-v3`
- Scope decision:
  `decision.owner-row-041.future-hospital-floor-parenteral-nutrition.2026-08-06`

The owner approved the one-concept scope, four complete single-select Question
Variants, answer sets, keyed answers, explanations, Future Hospital Floor
release point, and the use of `parenteral nutrition` rather than `TPN` as the
keyed label. Automated validation is structural verification, not clinical
approval.

## Approved Tested Concept

`concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible`

- Concept type: `management`
- Educational difficulty: advanced postoperative management
- Release point: `release.future.hospital_floor`
- Numeric facility level: none assigned
- Required setting: `hospital_floor`
- Required capability: none assigned
- Current-game eligibility: deferred

All four Question Variants share this one campaign-scoped FSRS identity.

## Approved clinical scope

The approved patient has severe postoperative ileus persisting beyond seven
days after major abdominal surgery. Mechanical obstruction and other
precipitating pathology have been excluded, reversible contributors have been
addressed, and adequate oral or enteral nutrition remains infeasible.

Parenteral nutrition supplies nutritional support while the gastrointestinal
route is unusable. It does not directly reverse the ileus, replace continued
evaluation, or prevent transition back to oral or enteral nutrition when
function returns.

The postoperative day and high nasogastric output are contextual findings, not
standalone indications. The package does not establish a universal
wait-until-day-seven rule for malnourished, critically ill, or otherwise
high-risk patients. Access route, formulation, dosing, and nutrition-team
workflow are deferred.

## Approved Question Variants

Every variant contains four single-select choices, one keyed answer, complete
distractor rationales, and shuffled answer order.

### Direct nutritional decision

`question.postoperative-ileus.prolonged-direct-nutrition-decision.v1`

Approved answer: `Initiate parenteral nutrition`

Incorrect choices:

- Continue maintenance IV fluids alone
- Begin full-rate gastric tube feeding
- Return to the operating room for ileus alone

### Management alternatives

`question.postoperative-ileus.prolonged-management-alternatives.v1`

Approved answer: `Initiate parenteral nutrition`

Incorrect choices:

- Give neostigmine as routine ileus treatment
- Continue NPO without nutritional support
- Start erythromycin as definitive therapy

### Patient selection

`question.postoperative-ileus.parenteral-nutrition-patient-selection.v1`

Approved answer:
`POD 8 with severe ileus, no obstruction, and enteral feeding infeasible`

Incorrect choices:

- POD 2 with mild distention while oral liquids meet nutritional needs
- POD 4 with ileus while enteral feeding safely meets nutritional needs
- POD 8 with high NG output while obstruction remains incompletely evaluated

### Nutrition-support boundary

`question.postoperative-ileus.parenteral-nutrition-support-boundary.v1`

Approved answer:
`Provide nutrition while enteral feeding remains infeasible`

Incorrect choices:

- Directly restore bowel motility and terminate the ileus
- Replace further evaluation for postoperative mechanical obstruction
- Prevent any future transition back to enteral nutrition

## Answer-length safeguard

The correct choice is not the uniquely longest answer in any approved
variant. The keyed answers remain concise enough for the chart.

## Runtime boundary

This package remains outside the current runtime. It has no numeric level and
may not be admitted until Future Hospital Floor progression and inpatient
nutrition-support systems are designed and separately authorized.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact teaching revision.
