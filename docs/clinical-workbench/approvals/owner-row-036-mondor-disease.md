# Owner Row 36: Exact Mondor Disease Approval

Status: Clinically approved and implemented in the development prototype

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-036.2026-08-06`

Content version: `clinical.owner-row-036.2026-08-06.2`

Supersedes: `clinical.owner-row-036.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 36
- Source record: `owner-concept.sheet1.row-036`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-03-v2`

The owner approved the exact three-concept split, nine complete single-select
Question Variants, two sequential encounter arrangements, short variants,
answer sets, keyed answers, explanations, result-gate behavior, and scope
boundaries recorded below. Automated validation is structural verification,
not clinical approval.

## Approved Tested Concepts

All three concepts enter circulation at
`release.l0.clinic_evaluation`, require the clinic setting, and require no
constructed facility capability:

1. `concept.mondor-disease.clinical-recognition` (`diagnosis`)
2. `concept.mondor-disease.selective-imaging-evaluation` (`workup`)
3. `concept.mondor-disease.supportive-management` (`management`)

Each concept owns one independent campaign-scoped FSRS card. Recognition,
evaluation, and management mastery must not be merged.

## Approved Question Variants

Recognition:

- `question.mondor-disease.recognition.patient-to-diagnosis.v1`
- `question.mondor-disease.recognition.select-patient.v1`
- `question.mondor-disease.recognition.underlying-process.v1`

Selective imaging evaluation:

- `question.mondor-disease.evaluation.diagnostic-breast-imaging.v1`
- `question.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1`
- `question.mondor-disease.evaluation.ultrasound-finding.v1`

Supportive management:

- `question.mondor-disease.management.supportive-care.v1`
- `question.mondor-disease.management.safety-boundary.v1`
- `question.mondor-disease.management.select-supportive-patient.v1`

Each variant has four complete answer choices, exactly one keyed answer, and
shuffled display order. The exact stems, choices, explanations, and bounded
wrong-answer dispositions live in
`packages/clinical-content/src/approved-data/mondor-disease.ts`.
Version `.2` applies the owner's approved answer-length cue mitigation without
changing any key, clinical meaning, stable Question Variant ID, or Concept ID.

## Approved encounter organization

- `case.mondor-disease.full-pathway` contains three scored decisions:
  recognition, off-site diagnostic breast imaging, and supportive management.
- `case.mondor-disease.evaluation-and-management` contains two scored
  decisions: off-site diagnostic breast imaging and management after results.
- Six short cases cover the remaining reverse, imaging-finding,
  underlying-process, patient-selection, and safety-boundary variants.

The diagnostic imaging steps use a persisted off-site result gate. A wrong
intermediate answer is scored as wrong and proceeds corrective-forward with
the approved imaging action; it is not silently reclassified as correct.
`service.diagnostic_breast_imaging` is a simulation service whose 120-minute
prototype duration is an editorial balance value rather than a clinical
turnaround-time claim.

## Clinical boundaries

- The characteristic teaching phenotype is a tender superficial breast or
  anterior chest-wall cord with little surrounding inflammation.
- Imaging is selective rather than mandatory for every classic uncomplicated
  presentation.
- Targeted high-frequency ultrasound with color Doppler is the approved study
  when the superficial venous diagnosis is uncertain.
- Age-appropriate diagnostic breast imaging is used when focal symptoms
  warrant evaluation for underlying breast pathology.
- Supportive care applies only to a concordant uncomplicated case.
- Progressive diffuse breast change, adenopathy, a suspicious mass,
  infection, recurrent or migratory thrombophlebitis, and a relevant systemic
  or hypercoagulable condition remain outside the routine supportive pathway.

## Evidence and publication boundary

Four independently written atomic evidence claims retain direct links to
complete source records. Source metadata remains
`needs_clinician_review`, independently of the named clinical approval of the
exact teaching revision.

The cases are admitted only to the owner/development release. That mixed
release retains the global `synthetic_unapproved_prototype` publication label;
this receipt does not approve any other draft clinical content for public use.
