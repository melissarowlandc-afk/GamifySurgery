# Owner Row 30: Breast-Cyst Pathway Workthrough

Status: Completed; superseded by exact approval

Workthrough date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Source record: `owner-concept.sheet1.row-030`

The intermediate pathway decision below is preserved for audit history. The
owner subsequently approved the exact concept split, release points, and
question package as
`approval.melissa-rowland-md.owner-row-030.2026-08-06`. The immutable final
receipt is
`../approvals/owner-row-030-breast-cyst-pathway.md`.

## Intermediate approved pathway decision

Decision ID:
`decision.owner-row-030.symptomatic-simple-cyst-aspiration.2026-08-06`

For a persistently painful or bothersome, unequivocally simple breast cyst in
an appropriately scoped patient who wants symptom relief, aspiration is the
initial procedural treatment to offer. Routine surgical excision is not the
initial treatment for this phenotype.

At this intermediate point, the approval intentionally did not yet approve:

- an exact Tested Concept, Patient Presentation Variant, or Question Variant;
- a runtime release;
- the management of bloody aspirate, residual mass, recurrence, imaging
  discordance, or complex/solid features;
- surgical excision for pain alone; or
- a post-aspiration third decision.

## Atomic evidence claims under review

### `claim.breast-mass.under-30.initial-ultrasound`

For the scoped presentation of an adult woman younger than 30 years with a new
palpable breast mass, breast ultrasound is the appropriate initial imaging
study. Pregnancy, lactation, known high-risk status, suspicious examination
findings, and subsequent imaging decisions require their own scoped pathways.

- Evidence category: diagnostic evaluation
- Certainty/limitation: authoritative appropriateness guidance for the stated
  initial-imaging variant; exclusions must remain explicit
- Last checked: 2026-08-06
- Clinical review status: `clinically_approved` in content version
  `clinical.owner-row-030.2026-08-06.2`
- Supporting source: `source.acr.palpable-breast-masses.2022`

### `claim.breast-cyst.simple-asymptomatic.observation`

An unequivocally simple breast cyst that is not painful or otherwise
bothersome does not require routine drainage or surgical excision.

- Evidence category: management
- Certainty/limitation: professional-society recommendation; concerning,
  complex, or discordant findings are excluded
- Last checked: 2026-08-06
- Clinical review status: `clinically_approved` in content version
  `clinical.owner-row-030.2026-08-06.2`
- Supporting source: `source.asbrs.benign-breast-five-things.2023`

### `claim.breast-cyst.simple-symptomatic.aspiration`

For an unequivocally simple breast cyst that is large or causes discomfort,
fluid aspiration may be offered for symptom relief.

- Evidence category: management
- Certainty/limitation: supported by two professional organizations; this claim
  does not govern bloody aspirate, persistent mass, recurrence, imaging
  discordance, or complex/solid lesions
- Last checked: 2026-08-06
- Clinical review status: `clinically_approved` in content version
  `clinical.owner-row-030.2026-08-06.2`
- Supporting sources:
  `source.asbrs.benign-breast-five-things.2023`,
  `source.acog.benign-breast-conditions.2025`

## Source records

### `source.acr.palpable-breast-masses.2022`

- Complete citation: American College of Radiology. *ACR Appropriateness
  Criteria: Palpable Breast Masses*. Revised 2022.
- Organization: American College of Radiology
- Authors: ACR Appropriateness Criteria expert panel; individual panel authors
  are retained on the official document
- Publication year: 2022
- DOI: none
- Official URL: https://acsearch.acr.org/docs/69495/Narrative
- Access date: 2026-08-06
- Source class: professional-society appropriateness guideline
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no protected wording or tables reproduced
- Intended use: evidence support for the initial-imaging claim
- Supported claim IDs:
  `claim.breast-mass.under-30.initial-ultrasound`
- Medical authority: authoritative specialty-society guidance

### `source.asbrs.benign-breast-five-things.2023`

- Complete citation: American Society of Breast Surgeons Patient Safety and
  Quality Committee. *The American Society of Breast Surgeons—Benign Breast
  Disease: Five Things Physicians and Patients Should Question*. Released
  January 8, 2018; item 3 revised February 7, 2023.
- Organization: American Society of Breast Surgeons
- Authors: ASBrS Patient Safety and Quality Committee
- Publication year: 2023 revision
- DOI: none
- Official URL:
  https://www.breastsurgeons.org/docs/resources/ASBrS_benign_5things_list.pdf
- Access date: 2026-08-06
- Source class: professional-society recommendation
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no protected wording or tables reproduced
- Intended use: primary management evidence for asymptomatic and bothersome
  simple-cyst claims
- Supported claim IDs:
  `claim.breast-cyst.simple-asymptomatic.observation`,
  `claim.breast-cyst.simple-symptomatic.aspiration`
- Medical authority: authoritative breast-surgery society recommendation

### `source.acog.benign-breast-conditions.2025`

- Complete citation: American College of Obstetricians and Gynecologists.
  *Benign Breast Conditions*. FAQ026. Last updated May 2023; last reviewed May
  2025.
- Organization: American College of Obstetricians and Gynecologists
- Authors: organizational guidance; no individual authors listed
- Publication year: 2025 review
- DOI: none
- Official URL:
  https://www.acog.org/womens-health/faqs/benign-breast-problems-and-conditions
- Access date: 2026-08-06
- Source class: professional-society patient guidance
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no protected wording reproduced
- Intended use: independent management cross-check for drainage of a large or
  uncomfortable cyst
- Supported claim IDs:
  `claim.breast-cyst.simple-symptomatic.aspiration`
- Medical authority: authoritative professional-organization guidance

## Approved concept split

The source row resolves into three approved FSRS identities:

1. `concept.breast-mass.under-30-initial-ultrasound`
   - release point: `release.l0.clinic_evaluation`
2. `concept.breast-cyst.asymptomatic-simple-observation`
   - release point: `release.l0.clinic_evaluation`
3. `concept.breast-cyst.symptomatic-simple-aspiration`
   - release point: `release.l1.minor_procedure`
   - capability requirement: operational Minor Procedure Room

The exact stems, answer choices, feedback, consequences, evidence mapping, and
immutable identities are recorded in the final approval receipt and its
versioned TypeScript content module.

## Deferred branches

A post-aspiration third decision and any excision pathway remain deferred until
their exact phenotypes and supporting evidence are established. Pain alone
must not be used as a shortcut to routine excision.
