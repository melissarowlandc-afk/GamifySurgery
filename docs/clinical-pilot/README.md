# Five-diagnosis clinical-content pilot

Status: AI-assisted draft, `needs_clinician_review`

Content version: `pilot.2026-07-29.4`

This directory documents the legally screened Level 0–1 pilot for:

1. simple traumatic laceration;
2. uncomplicated cutaneous abscess;
3. symptomatic cholelithiasis presenting as biliary colic;
4. adult inguinal hernia; and
5. suspected acute appendicitis.

The pilot is playable only inside the repository's existing
`synthetic_unapproved_prototype` clinical release. Nothing here records Melissa
or any other clinician as having approved the content, and automated checks are
not clinical approval.

## Architecture mapping

The implementation extends the existing clinical runtime projection instead of
creating a second encounter engine.

| Requested concern | Existing structure retained | Pilot extension |
|---|---|---|
| Clinical release | `SyntheticClinicalRelease` with a campaign-pinned release ID | The same unapproved release ID projects the five pilot families while per-item `contentVersion` records the new draft |
| Diagnosis and encounter schemas | Existing `SyntheticClinicalCase` and `DecisionNode` frozen runtime shapes | A validated registry adds families, phenotypes, claims, sources, concepts, question variants, and templates |
| Patient generator | Encounter creation already freezes a case, name, portrait, and answer order | A pure deterministic pilot materializer adds constrained adult demographics, BMI, findings, and physiology before the existing freeze step |
| Question system | One `primaryConceptId` per scored `DecisionNode` | Each pilot concept owns two independently written variants with stable answer semantics and distractor rationales |
| FSRS | Campaign histories are keyed by concept ID | Wording variants retain the same concept ID, so they share one history |
| Facility progression | Balance release levels and room/staff capabilities | Templates store an independent facility-stage gate; phenotypes and concepts separately store required capability IDs |
| Acuity and educational difficulty | Previously implicit in static cases | Each phenotype records both fields independently |
| Services | Existing routes cover synthetic analysis, X-ray, and outsourced basic labs | The pilot does not invent ultrasound, CT, referral, or transfer services; referral/transfer are dispositions and inappropriate available tests are not substituted |
| Save compatibility | Saves pin the clinical release ID and freeze generated cases | The release ID remains unchanged; older frozen encounters continue to carry their original content |
| Chart back | Existing learning summary appears only after completion | Completed pilot charts add concise claim-linked sections and a safe external source/review view |
| Administrative preview | Existing development-only Prototype tools | The pilot selector forces diagnosis, phenotype, tier, concept, wording variant, and seed without adding a player-facing cheat |

## Important boundaries

- Educational tier, patient acuity, facility progression, and current
  capability are different data fields.
- Clinical-probability notes are qualitative evidence statements.
  `simulationWeight` is an explicitly editorial gameplay sampling choice.
- Optional-finding labels remain qualitative. The preview deterministically
  selects one available category and one detail for presentation variety and
  does not turn `common`, `possible`, or `uncommon` into clinical percentages.
- All pilot patients are fictional adults, are nonpregnant by phenotype
  constraint, and have no meaningful comorbidity at Levels 0–1.
- Names, portraits, and other nonclinical characteristics remain independent
  from disease selection.
- Race and ethnicity are not disease-selection variables.
- Vital signs are drawn from a compatible physiology overlay, not from one
  diagnosis-wide “typical” vital-sign set.
- No gameplay-time web retrieval or AI call is used.
- No full source text, source excerpt, copied table, figure, algorithm,
  commercial question, or textbook PDF is stored.

## Review documents

- [Source manifest](SOURCE_MANIFEST.md)
- [Clinician review packet](CLINICIAN_REVIEW_PACKET.md)
- [Implementation handoff](HANDOFF.md)

## Withheld topics

The pilot intentionally withholds disputed, weakly supported, overly
facility-specific, or rights-restricted teaching points. These include a
universal laceration closure window, routine laceration antibiotics, detailed
abscess antibiotic choice or duration, universal surgery for uncomplicated
symptomatic gallstones, watchful waiting for all groin-hernia populations,
appendicitis imaging as one universal sequence, and definitive inpatient
appendicitis treatment.
