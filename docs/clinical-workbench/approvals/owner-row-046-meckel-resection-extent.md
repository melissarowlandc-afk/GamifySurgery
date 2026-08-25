# Owner Row 46: Exact Meckel Resection-Extent Approval

Status: Clinically approved and deferred to Future Hospital OR

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-046.2026-08-06`

Content version: `clinical.owner-row-046.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 46
- Source record: `owner-concept.sheet1.row-046`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-05-v3`
- Scope decision:
  `decision.owner-row-046.future-hospital-or-meckel-resection-extent.2026-08-06`

The owner approved one FSRS concept and four complete single-select Question
Variants in two operative directions. Automated validation is structural
verification, not clinical approval.

## Approved Tested Concept

`concept.meckel-diverticulum.resection-extent`

- Concept type: `management`
- Educational difficulty: advanced Hospital OR management
- Release point: `release.future.hospital_or`
- Numeric facility stage: unassigned
- Required clinical setting: `hospital_or`
- Required facility capability: none
- Current-game eligibility: deferred

All four Question Variants share one campaign-scoped FSRS identity. They test
the same operative boundary from direct, reverse, and patient-selection
directions.

## Approved clinical scope

Use simple diverticulectomy for a long, narrow Meckel diverticulum when
inflammation is confined to the distal tip and the base and adjacent ileum are
healthy. Use bowel-inclusive resection when disease involves the base and
adjacent ileum; the exact approved segmental-resection variants specify
adjacent ileal involvement.

One small retrospective series of 15 adults with perforated Meckel
diverticula operationally classified a base width of 2 cm or greater as broad
and less than 2 cm as narrow. That exact number is approved only as
source-specific supporting morphology. It is not a universal definition or a
stand-alone indication for segmental ileal resection.

The 2 cm base-width observation must not be confused with diverticulum length
greater than 2 cm, which is a separate observation associated with symptomatic
presentation in another retrospective series.

The package does not use a sentence stating that tangential stapling would
narrow the lumen because that clue was explicitly removed during review.

## Approved Question Variants

Every variant contains a brief patient presentation, four single-select
choices, one keyed answer, complete distractor rationales, and shuffled answer
order.

### Measured broad base with adjacent ileal involvement

`question.meckel-diverticulum.measured-broad-base-segmental-resection.v1`

Presentation: A 22-year-old undergoing laparoscopy for suspected appendicitis
has a normal appendix and a Meckel diverticulum measuring 2 cm long with a
2.5 cm base. Inflammation extends through the base and into adjacent ileum.

Approved answer:
`Segmental ileal resection including the diverticulum`

Incorrect choices:

- Simple diverticulectomy at the involved base
- Inversion of the diverticulum without resection
- Appendectomy alone with observation of the diverticulum

### Long narrow diverticulum with tip-only inflammation

`question.meckel-diverticulum.narrow-tip-only-diverticulectomy.v1`

Presentation: A 19-year-old has a 5 cm long Meckel diverticulum with a 1 cm
base. Inflammation is confined to the distal tip; the base and adjacent ileum
are healthy.

Approved answer: `Simple diverticulectomy`

Incorrect choices:

- Segmental ileal resection including normal adjacent bowel
- Inversion of the diverticulum without resection
- Appendectomy alone with observation of the diverticulum

### Reverse morphology

`question.meckel-diverticulum.reverse-morphology-diverticulectomy.v1`

Approved answer:
`5 cm long, 1 cm healthy base, tip-only inflammation`

Incorrect choices:

- 2 cm long, 2.5 cm inflamed base, with adjacent ileal involvement
- Perforation at the diverticulum-ileum junction with base inflammation
- Inflammation extending through a broad base into the adjacent ileum

### Select the segmental-resection patient

`question.meckel-diverticulum.select-segmental-resection-patient.v1`

Approved answer:
`2 cm long, 2.5 cm inflamed base, with adjacent ileal involvement`

Incorrect choices:

- 5 cm long, 1 cm healthy base, with inflammation confined to the tip
- 4 cm long, 1 cm viable base, with completely normal adjacent ileum
- 6 cm long, 1.5 cm healthy base, with distal inflammation only

## Evidence limitations

The evidence is predominantly retrospective. Morphology does not perfectly
predict heterotopic mucosa, and newer multicenter evidence cautions against a
universal size-only rule. Wedge resection can be reasonable in selected
base-involved cases; this package does not separately test the wedge-versus-
segmental boundary. Its segmental variants instead include adjacent ileal
involvement.

Incidental asymptomatic management, bleeding, obstruction, tumor, a completely
patent omphalomesenteric duct, exact bowel-resection length, and anastomotic
technique remain outside this approval.

## Answer-length safeguard

The correct choice is not the uniquely longest answer in any approved
variant. Labels remain concise enough for the chart.

## Runtime boundary

This package is not added to the current playable release. It has no numeric
facility-level assignment and may not be admitted until Future Hospital OR
progression and operative-treatment systems are designed and separately
authorized.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact content version.
