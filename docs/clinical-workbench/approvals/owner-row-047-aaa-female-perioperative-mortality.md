# Owner Row 47: Exact AAA Sex-Associated Perioperative Mortality Approval

Status: Clinically approved and implemented at Level 0 Clinic Evaluation

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-047.2026-08-06`

Content version: `clinical.owner-row-047.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 47
- Source record: `owner-concept.sheet1.row-047`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-03-v3`
- Scope decision:
  `decision.owner-row-047.l0-female-sex-aaa-perioperative-mortality.2026-08-06`

The owner approved one FSRS concept and four complete single-select Question
Variants. Automated validation is structural verification, not clinical
approval.

## Approved Tested Concept

`concept.aaa.female-sex-associated-perioperative-mortality`

- Concept type: `applied_science`
- Release point: `release.l0.clinic_evaluation`
- Earliest facility stage: 0
- Required clinical setting: `clinic`
- Required facility capability: none
- Current-game eligibility: admitted to the active development release

All four variants share one campaign-scoped FSRS identity. The concept teaches
an observed group-level outcome association, not an individualized
prognostic calculation or a repair-approach decision.

## Approved clinical scope

Contemporary pooled and registry evidence generally reports higher observed
perioperative mortality among women than men after elective repair of intact
abdominal aortic aneurysm. The association has been reported after both EVAR
and open repair.

This is a population-level association. It informs counseling and risk
assessment but neither determines an individual patient's outcome nor makes
female sex a contraindication to repair or EVAR.

The concept excludes ruptured AAA, thoracoabdominal aneurysm, screening
eligibility, individual repair fitness, and selection between EVAR and open
repair.

## Approved Question Variants

Every variant contains a brief presentation, four single-select choices, one
keyed answer, an original explanation, complete wrong-answer dispositions,
and shuffled answer order.

### Direct outcome association

`question.aaa.female-perioperative-mortality.direct.v1`

Presentation: A 72-year-old woman with an intact infrarenal AAA has met
criteria for elective repair. She asks whether operative outcomes differ
between women and men.

Approved answer:
`Women have higher observed perioperative mortality than men`

Incorrect choices:

- Women have lower operative mortality because rupture occurs at smaller
  diameters
- EVAR eliminates the observed difference in outcomes between sexes
- Every risk-adjusted contemporary study reports identical outcomes

### Repair approaches

`question.aaa.female-perioperative-mortality.repair-approaches.v1`

Presentation: A surgical clinic is counseling patients who are considering
elective repair of intact infrarenal AAAs.

Approved answer:
`Women have higher perioperative mortality after both EVAR and open repair`

Incorrect choices:

- Women have higher mortality only after ruptured aneurysm repair, not
  elective repair
- Men have higher mortality after EVAR but not open repair
- Selecting EVAR makes sex irrelevant to perioperative risk

### Appropriate interpretation

`question.aaa.female-perioperative-mortality.interpretation.v1`

Presentation: A clinician is explaining sex-associated AAA outcomes to a
patient before vascular-surgery referral.

Approved answer:
`Female sex is associated with increased perioperative mortality at the group level`

Incorrect choices:

- Female sex guarantees a poor outcome regardless of anatomy, comorbidity, or
  repair approach
- Female sex is a contraindication to EVAR
- Women should undergo repair regardless of aneurysm size or operative risk

### Mixed boundaries

`question.aaa.female-perioperative-mortality.mixed-boundaries.v1`

Presentation: A 73-year-old woman with an asymptomatic infrarenal AAA is
reviewing future management options.

Approved answer:
`Women have higher observed perioperative mortality after AAA repair`

Incorrect choices:

- Women may routinely continue surveillance until the aneurysm reaches 6.5 cm
- Severe cardiac risk makes EVAR mandatory once the aneurysm reaches 5.0 cm
- EVAR's lower early mortality proves benefit for repair below accepted
  thresholds

The repair thresholds and early-repair evidence constrain distractors in the
mixed variant; they are not separate scored concepts in this package.

## Multi-decision assessment

A single decision is preferred for this concept. A clinically coherent
sequence would require separate AAA screening, surveillance, repair-threshold,
or procedural-selection concepts. Those decisions have not been approved and
must not be forced into this FSRS identity merely to make the encounter
longer.

The standing review workflow now requires an explicit multi-decision
suitability assessment for every concept. When a natural sequence exists, it
should be proposed; when an essential link is missing, the owner should receive
one targeted question.

## Evidence limitations

The perioperative outcome evidence is primarily observational. Effect sizes
and contributing mechanisms vary by cohort, anatomy, repair approach, era,
and adjustment method. The package therefore teaches the direction of the
observed association without inventing an individual probability or causal
mechanism.

The 2022 ACC/AHA size thresholds and absence of demonstrated survival benefit
from routine early repair of smaller asymptomatic AAAs are included only as
boundaries against the approved distractors. Individual management still
requires specialist assessment.

## Answer-length safeguard

The correct choice is not the uniquely longest answer in any approved
variant. Labels remain concise enough for the chart.

## Runtime boundary

The exact four reviewed variants are admitted to the active Level 0
development release. Existing frozen encounters and campaign-scoped FSRS
histories retain their stable identities.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact content version.
