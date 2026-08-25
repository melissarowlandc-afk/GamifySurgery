# Owner Row 43: Exact Severe-Burn Enteral-Nutrition Approval

Status: Clinically approved and deferred to Future ICU

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-043.2026-08-06`

Content version: `clinical.owner-row-043.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 43
- Source record: `owner-concept.sheet1.row-043`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-05-v3`
- Scope decision:
  `decision.owner-row-043.future-icu-early-enteral-nutrition.2026-08-06`

The owner approved one FSRS concept and four complete single-select Question
Variants, including their patient presentations, answer sets, keyed answers,
explanations, safety boundaries, and Future ICU release point. Automated
validation is structural verification, not clinical approval.

## Approved Tested Concept

`concept.severe-burn.early-enteral-nutrition`

- Concept type: `management`
- Educational difficulty: advanced critical-care nutrition
- Release point: `release.future.icu`
- Numeric facility stage: unassigned
- Required clinical setting: `icu`
- Required facility capability: none
- Current-game eligibility: deferred

All four Question Variants share this one campaign-scoped FSRS identity.

## Approved clinical scope

For a patient with an extensive burn who has been adequately resuscitated,
cannot meet nutritional needs orally, has a usable gastrointestinal tract, and
has no enteral contraindication, begin enteral nutrition as soon as feasible
within the first 24 hours after injury. Enteral nutrition is the preferred
initial route while the gastrointestinal tract remains usable; routine
first-line parenteral nutrition is not the approved answer.

The retained eight-hour presentation is a concrete patient scenario, not a
universal eight-hour deadline. The evidence supports early nutrition but does
not establish one universal eight-hour cutoff.

Ongoing shock, incomplete resuscitation, suspected intestinal ischemia, or
mechanical obstruction falls outside this teaching scenario. Falling outside
the scope does not itself prescribe parenteral nutrition or another action.
Feeding access, formula, advancement, nutritional targets, tolerance
management, burn-resuscitation details, and management of contraindications
remain separate future concepts.

## Approved Question Variants

Every variant contains a brief patient presentation, four single-select
choices, one keyed answer, complete distractor rationales, and shuffled answer
order.

### Eight-hour patient scenario

`question.severe-burn.early-enteral-nutrition-eight-hour.v1`

Presentation: Eight hours after an extensive burn, the patient is stable after
resuscitation, the gastrointestinal tract is functional, no enteral
contraindication exists, and oral intake cannot meet nutritional needs.

Approved answer: `Begin enteral tube feeding now`

Incorrect choices:

- Continue IV fluids without nutrition for 48 hours
- Start parenteral nutrition before attempting enteral feeding
- Wait until all grafting procedures are complete

### Timing

`question.severe-burn.early-enteral-nutrition-timing.v1`

Approved answer: `As soon as feasible within the first 24 hours`

Incorrect choices:

- Only after bowel sounds have returned
- After 48 hours of observation without nutrition
- Once all planned operations have been completed

### Route

`question.severe-burn.early-enteral-nutrition-route.v1`

Approved answer:
`Use enteral nutrition while the GI tract is functional`

Incorrect choices:

- Use parenteral nutrition as routine first-line support
- Provide maintenance crystalloid as sole nutritional therapy
- Delay nutrition until spontaneous oral intake is sufficient

### Patient selection

`question.severe-burn.early-enteral-nutrition-patient-selection.v1`

Approved answer:
`Extensive burn, adequately resuscitated, with no enteral contraindication`

Incorrect choices:

- Extensive burn with ongoing shock and incomplete hemodynamic resuscitation
- Extensive burn with suspected intestinal ischemia or mechanical obstruction
- Limited burn with nutritional needs already met through ordinary oral intake

## Answer-length safeguard

The correct choice is not the uniquely longest answer in any approved
variant. Labels remain concise enough for the chart.

## Runtime boundary

This package is not added to the playable Level 0-1 release. It has no numeric
facility-level assignment and may not be admitted until Future ICU progression
and burn critical-care systems are designed and separately authorized.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact content version.
