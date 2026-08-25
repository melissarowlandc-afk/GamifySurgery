# Owner Row 48: Exact Desmoid Management Pathway Approval

Status: Clinically approved and implemented at Level 0 Clinic Evaluation

Approval date: 2026-08-10

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-048.2026-08-10`

Content version: `clinical.owner-row-048.2026-08-10.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 48
- Source record: `owner-concept.sheet1.row-048`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-03-v3`
- Scope decision:
  `decision.owner-row-048.two-concept-desmoid-management-pathway.2026-08-10`

The owner approved two FSRS concepts, eight complete single-select Question
Variants, and one two-decision encounter using two of those variants.
Automated validation is structural verification, not clinical approval.

## Approved Tested Concepts

### Initial active surveillance

`concept.desmoid.initial-active-surveillance`

- Concept type: `management`
- Release point: `release.l0.clinic_evaluation`
- Earliest facility stage: 0
- Required clinical setting: `clinic`
- Required facility capability: none
- Current-game eligibility: admitted to the active development release

The concept selects specialist active surveillance for a newly diagnosed,
stable or minimally symptomatic desmoid without persistent progression,
critical-site threat, obstruction, or meaningful functional deterioration.

### Progressing abdominal-wall surgical option

`concept.desmoid.progressing-abdominal-wall-surgical-option`

- Concept type: `management`
- Release point: `release.l0.clinic_evaluation`
- Earliest facility stage: 0
- Required clinical setting: `clinic`
- Required facility capability: none; surgery is represented as specialist
  counseling/referral rather than an onsite Level 0 procedure
- Current-game eligibility: admitted to the active development release

The concept selects function-preserving resection after multidisciplinary
review for persistently progressing, symptomatic, resectable abdominal-wall
disease when expected morbidity is acceptably low. It is not a general rule
for every desmoid location.

## Approved Question Variants

Every scored decision has four single-select choices, one keyed answer,
shuffled answer order, concise original feedback, and one primary FSRS
concept.

### Initial surveillance: new diagnosis

Correct: `Active surveillance with specialist follow-up`

Incorrect:

- Immediate wide excision solely to obtain a large negative margin
- Routine cytotoxic chemotherapy for every confirmed desmoid
- Incision and drainage of the solid tumor

### Initial surveillance: select the patient

Correct: `Newly diagnosed stable desmoid without a threat to function`

Incorrect:

- Serial enlargement with worsening pain and mobility
- Intra-abdominal disease producing bowel obstruction
- Critical-site disease with progressive functional compromise

### Initial surveillance: general principle

Correct: `Many newly diagnosed desmoids begin with active surveillance`

Incorrect:

- Every confirmed desmoid requires immediate surgery before meaningful
  progression occurs
- Delayed resection permits distant metastasis
- Surveillance imaging directly treats the tumor

### Initial surveillance: stable follow-up

Correct: `Continue active surveillance`

Incorrect:

- Proceed to radical resection despite stable symptoms
- Begin combined chemotherapy and radiation automatically
- Perform incision and drainage

### Abdominal-wall surgery: progressing painful disease

Correct:
`Function-preserving resection after multidisciplinary review`

Incorrect:

- Continue observation despite progressive functional loss
- Incision and drainage
- Radical excision regardless of avoidable functional morbidity

### Abdominal-wall surgery: select the candidate

Correct:
`Progressing resectable abdominal-wall tumor with low expected morbidity`

Incorrect:

- Stable asymptomatic tumor without documented progression
- Mesenteric tumor whose resection would require major organ sacrifice and
  substantial avoidable morbidity
- Critical head-and-neck tumor with unacceptable functional morbidity

### Abdominal-wall surgery: margin principle

Correct:
`Preserve function rather than pursuing a wide margin at any cost`

Incorrect:

- Sacrifice function whenever a wider microscopic margin is possible
- Treat every positive microscopic margin with automatic radiation
- Assume complete resection eliminates recurrence risk

### Abdominal-wall surgery: location-specific option

Correct:
`Surgery may be proposed for progressing abdominal-wall disease`

Incorrect:

- Surgery is mandatory for every desmoid location
- All progressing desmoids require cytotoxic chemotherapy regardless of
  tumor location
- Symptoms convert a desmoid into a metastatic malignancy

Three incorrect labels were lengthened without changing their clinical
meaning to prevent the correct response from becoming the uniquely longest
choice. This implements the owner's standing answer-length safeguard.

## Approved multi-decision encounter

The first decision selects active surveillance for a newly diagnosed,
noncritical abdominal-wall desmoid. The second decision begins with the words
“At a later specialist follow-up” and introduces persistent enlargement,
increasing pain, impaired mobility, resectability, and acceptably low expected
morbidity before asking about function-preserving resection.

This is an authored later visit. The simulation does not pretend that months
of surveillance elapsed in a few minutes of facility time, and it does not
schedule an artificial test-result timer between the decisions.

## Clinical boundaries

- Surveillance is active specialist management, not absence of follow-up.
- Persistent progression, critical-site threat, obstruction, or meaningful
  functional decline requires renewed active-treatment planning.
- Abdominal-wall location may make surgery reasonable; surgery is neither
  mandatory nor preferred automatically for all locations.
- Function and cosmesis are not sacrificed merely to pursue a wider
  microscopic margin.
- A positive microscopic margin does not automatically mandate radiation.
- Desmoid tumors can be locally infiltrative and recurrent but do not
  metastasize.

No universal surveillance interval, drug sequence, response probability, or
operative-margin width is invented in this package.

## Runtime boundary

Seven encounter blueprints expose all eight reviewed Question Variants. One
blueprint contains the approved two-decision sequence; the remaining six are
focused single-decision variants. Existing frozen encounters and
campaign-scoped FSRS histories retain their stable identities.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact content version.
