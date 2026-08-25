# Owner Row 37: Exact Postoperative Chylous-Ascites Approval

Status: Clinically approved and deferred to Future - Hospital Floor

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-037.2026-08-06`

Content version: `clinical.owner-row-037.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 37
- Source record: `owner-concept.sheet1.row-037`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-03-v2`
- Scope decision:
  `decision.owner-row-037.future-hospital-floor-three-concept-pathway.2026-08-06`

The owner approved the exact three-concept split, the complete three-decision
patient pathway, every answer set, the keyed answers, explanations, result
sequence, and the clinical boundaries recorded below. Automated validation is
structural verification, not clinical approval.

## Approved release and setting

Every element uses `release.future.hospital_floor` and
`requiredClinicalSetting: hospital_floor`.

No numeric facility level has been assigned. The patient may first present to
the surgical clinic, but evaluation and treatment transition into the future
hospital pathway. Nothing in this receipt authorizes current runtime
admission.

## Approved Tested Concepts

Each scored decision owns a separate campaign-scoped FSRS identity:

1. `concept.postoperative-ascites.cross-sectional-evaluation` (`workup`)
2. `concept.chylous-ascites.fluid-confirmation` (`workup`)
3. `concept.postoperative-chylous-ascites.initial-hospital-management`
   (`management`)

The three concepts must not be combined into one mastery card.

## Approved three-decision encounter

Blueprint:
`blueprint.postoperative-chylous-ascites.clinic-to-hospital.v1`

Initial presentation:

> A patient recently underwent extensive abdominal surgery at another center.
> They present to the surgical clinic with progressive abdominal swelling,
> diffuse discomfort, and early satiety. They are hemodynamically stable
> without peritonitis.

### Decision 1: initial imaging

Question:

> Which initial imaging study is most appropriate for this stable
> postoperative presentation?

Approved answer: CT of the abdomen and pelvis with IV contrast.

Approved incorrect choices:

- Abdominal radiographs
- Hepatobiliary scintigraphy
- Upper gastrointestinal contrast series

Approved result: CT shows large-volume intraperitoneal fluid without
obstruction, hemorrhage, or a discrete abscess. Imaging establishes the extent
of ascites, not its composition.

### Decision 2: fluid confirmation

Question:

> What is the most appropriate next step to determine the cause of the
> ascites?

Approved answer: image-guided diagnostic paracentesis with fluid triglycerides
and studies for infection and other plausible postoperative leaks.

Approved incorrect choices:

- Diagnose chylous ascites from the CT appearance alone
- Proceed directly to lymphangiography without sampling the fluid
- Repeat CT after a period of unrestricted diet

Approved result: paracentesis produces milky fluid with elevated triglycerides
and no evidence of infection, bile leak, or pancreatic leak, confirming
postoperative chylous ascites.

### Decision 3: initial treatment

The final presentation establishes large, symptomatic ascites that
reaccumulates after diagnostic sampling.

Question:

> What is the most appropriate initial treatment plan?

Approved answer: admit for symptom-directed peritoneal drainage, a
low-long-chain-triglyceride diet enriched with medium-chain triglycerides, and
nutritional, fluid, and electrolyte monitoring.

Approved incorrect choices:

- Discharge with an unrestricted diet and no nutritional or fluid monitoring
- Proceed immediately to lymphangiography and embolization before conservative
  treatment
- Proceed immediately to operative lymphatic ligation

## Clinical boundaries

- CT identifies the presence, distribution, and associated findings of
  ascites; it does not establish chylous composition by appearance alone.
- Fluid sampling confirms the suspected chylous process and evaluates
  competing postoperative causes.
- The approved content does not teach an unsourced universal triglyceride
  cutoff.
- Drainage is symptom- and accumulation-dependent rather than mandatory for
  every lymphatic leak.
- Invasive localization or repair remains an individualized option for
  selected persistent or refractory disease, not the initial default in this
  stable presentation.
- Stable low-output diet-first variants may be considered later but are not
  part of this exact approved encounter.
- A rigid escalation timeline and a generic portosystemic-shunt pathway are
  excluded.

## Evidence and publication boundary

Four independently written atomic evidence claims retain direct links to four
complete source records. Source-metadata review remains
`needs_clinician_review`, independently of the named approval of this exact
teaching revision.

The approved package remains outside the playable release until Hospital Floor
progression, admission, drainage, nutrition, and inpatient monitoring systems
have been designed and separately authorized.
