# Owner Row 39: Exact Gastric MALT Approval

Status: Clinically approved and deferred to Level 2 Endoscopy

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-039.2026-08-06`

Content version: `clinical.owner-row-039.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 39
- Source record: `owner-concept.sheet1.row-039`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-03-v2`
- Scope decision:
  `decision.owner-row-039.two-concept-integrated-pathology-and-eradication.2026-08-06`

The owner approved the two-concept split, six complete single-select Question
Variants, two optional two-decision pairings, answer sets, keyed answers,
explanations, Level 2 Endoscopy release point, and clinical boundaries below.
The final answer labels incorporate the owner's explicit instruction to keep
answers brief and to prevent the correct choice from being identifiable as the
longest option. Automated validation is structural verification, not clinical
approval.

## Approved Tested Concepts

### Pathologic recognition

`concept.gastric-malt-lymphoma.pathologic-recognition`

- Concept type: `diagnosis`
- Educational difficulty: intermediate
- Release point: `release.l2.endoscopy`
- Earliest facility stage: 2
- Required setting: `endoscopy`
- Required capability: `capability.endoscopy`
- Current-game eligibility: deferred

### Eradication-first management

`concept.gastric-malt-lymphoma.hpylori-eradication-first-line`

- Concept type: `management`
- Educational difficulty: intermediate
- Release point: `release.l2.endoscopy`
- Earliest facility stage: 2
- Required setting: `endoscopy`
- Required capability: `capability.endoscopy`
- Current-game eligibility: deferred

Each concept remains one campaign-scoped FSRS identity across its three
Question Variants.

## Approved clinical scope

Gastric MALT lymphoma is taught through integrated morphology and
immunophenotyping: a small B-cell infiltrate with lymphoepithelial lesions and
a compatible phenotype, commonly CD20 positive with CD5, CD10, and cyclin D1
absent. CD20 alone establishes B-cell lineage and does not diagnose MALT
lymphoma.

For confirmed localized low-grade H. pylori-positive gastric MALT without
large-cell transformation or threatening disease, H. pylori eradication is
appropriate initial lymphoma-directed treatment without concurrent
gastrectomy, chemotherapy, or radiotherapy. This supersedes the source-row
shorthand `antibiotics alone`: eradication must be confirmed and lymphoma
response reassessed endoscopically and histologically.

Large-cell transformation, meaningful progression, threatening organ effects,
or failure after an adequate eradication pathway requires reassessment and may
require radiotherapy or systemic treatment. The package does not teach one
universal second-line regimen or a specific H. pylori drug regimen.

## Approved Question Variants

Each variant includes a patient context, four single-select choices, one keyed
answer, complete distractor rationales, and shuffled answer order.

### Integrated diagnosis

`question.gastric-malt.integrated-pathology-diagnosis.v1`

Approved answer: `Gastric MALT lymphoma`.

Incorrect choices:

- Diffuse large B-cell lymphoma involving the stomach
- Gastric adenocarcinoma with reactive lymphoid inflammation
- Mantle cell lymphoma involving the gastric mucosa

### Pathology-profile selection

`question.gastric-malt.pathology-profile-selection.v1`

Approved answer: small CD20-positive B cells forming lymphoepithelial lesions,
with CD5, CD10, and cyclin D1 absent.

Incorrect choices are comparably detailed profiles for diffuse large B-cell
lymphoma, signet-ring adenocarcinoma, and mantle cell lymphoma.

### CD20 boundary

`question.gastric-malt.cd20-alone-boundary.v1`

Approved answer: `CD20 confirms B-cell lineage, not MALT lymphoma by itself`.

Incorrect choices falsely use CD20 alone to prove MALT lymphoma, DLBCL, or a
reactive infiltrate.

### Initial treatment

`question.gastric-malt.localized-hpylori-positive-initial-treatment.v1`

Approved answer:
`H. pylori eradication therapy, then response reassessment`.

Incorrect choices:

- Immediate gastrectomy followed by routine postoperative surveillance
- Immediate R-CHOP before attempting H. pylori eradication therapy
- Definitive gastric radiotherapy without an initial eradication attempt

### Patient selection

`question.gastric-malt.eradication-patient-selection.v1`

Approved answer: localized H. pylori-positive low-grade gastric MALT without
transformation.

Incorrect choices cover DLBCL, progression after confirmed eradication, and
disseminated symptomatic disease with threatened organ function.

### Follow-up boundary

`question.gastric-malt.eradication-response-reassessment.v1`

Approved answer:
`Eradicate H. pylori first, then reassess the lymphoma response`.

Incorrect choices falsely substitute CD20-directed therapy, generalize
eradication to every CD20-positive gastric lymphoma, or require gastrectomy
before response assessment.

## Answer-length safeguard

The correct choice is not the uniquely longest answer in any approved variant.
Correct labels carry only the decision-essential wording; nuance remains in
the explanation. Distractors retain enough specificity to be plausible and to
avoid a recurrent visual length cue.

## Runtime boundary

The package remains outside the playable Level 0-1 release. Its two
two-decision and two single-decision blueprints may be admitted only after
Level 2 Endoscopy and the Endoscopy Room encounter framework exist.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact teaching revision.
