# Clinical approval receipt: owner row 29 HCC Milan criteria

Status: exact revision approved and implemented in the development-preview
clinical release

- Reviewer: Melissa Rowland, MD
- Review date: 2026-08-06
- Approval ID:
  `approval.melissa-rowland-md.owner-row-029.2026-08-06`
- Content version: `clinical.owner-row-029.2026-08-06.2`
- Supersedes: `clinical.owner-row-029.2026-08-06.1`
- Source workbook: `Gamify Surgery Concepts (2).xlsx`, `Sheet1`, row 29
- Source record: `owner-concept.sheet1.row-029`

## Approved concept

- Stable Tested Concept:
  `concept.hcc.milan-transplant-evaluation`
- Type: disposition
- FSRS identity: one card shared by every approved presentation and question
  variant below
- Release point: `release.l0.clinic_evaluation`
- Required capability: none
- Tutorial eligible: no

The approved learning objective is to apply standard Milan tumor-number, size,
macrovascular-invasion, and extrahepatic-disease criteria to recognize when HCC
tumor burden supports transplant-center evaluation. Meeting the criteria is not
automatic listing. Being outside standard Milan criteria is not represented as
permanent exclusion from every transplant-center, downstaging, or other
specialist pathway.

## Approved patient-to-criteria variants

1. One 4.8-cm lesion, without macrovascular invasion or extrahepatic disease:
   within standard Milan criteria and appropriate for transplant-center
   evaluation.
2. Three lesions measuring 2.2, 2.6, and 2.9 cm, without either exclusion:
   within standard Milan criteria and appropriate for transplant-center
   evaluation.
3. One 6.0-cm lesion without either exclusion: outside standard Milan criteria
   because the solitary lesion exceeds 5 cm.
4. Four lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, without either exclusion:
   outside standard Milan criteria because more than three lesions are present.
5. Two lesions measuring 2.1 and 2.8 cm with macrovascular invasion: outside
   standard Milan criteria because of macrovascular invasion.
6. One 3.8-cm lesion with confirmed extrahepatic disease: outside standard
   Milan criteria because of extrahepatic disease.

Each encounter has exactly one scored, single-select decision.

## Approved criteria-to-patient variants

Four independently worded single-select questions ask the learner to select the
one complete patient profile that falls within standard Milan criteria. Their
answer sets cover:

- a solitary lesion at the 5.0-cm boundary;
- multifocal disease with and without macrovascular invasion or extrahepatic
  disease;
- three lesions with the largest at 3.0 versus 3.1 cm; and
- otherwise identical solitary profiles distinguished by invasion, spread, or
  an excessive lesion size.

These reverse-direction questions remain the same Tested Concept and do not
manufacture additional mastery variants merely because their wording or answer
direction changes.

## Approved bounded runtime variation

Each exact case may select one of three complete approved presentation profiles:

- ages 52, 61, or 69 years;
- sex displayed as `Not specified`;
- one of three neutral staging-review lead-ins; and
- the case's locked clinical fact bundle.

Age and lead-in selection are editorial variety, not an epidemiologic
distribution. The runtime may not independently recombine lesion number, lesion
size, macrovascular invasion, or extrahepatic disease. Name, canonical avatar,
profile selection, and answer order use separate deterministic streams. The
selected profile and displayed answer order are frozen into the encounter and
survive save/reload.

## Evidence and boundaries

The independently written claims are supported by:

- Singal AG, Llovet JM, Yarchoan M, et al. *AASLD Practice Guidance on
  prevention, diagnosis, and treatment of hepatocellular carcinoma*.
  Hepatology. 2023;78(6):1922-1965.
  doi:10.1097/HEP.0000000000000466.
- Dove L, Chadha RM, Lai JC, et al. *AASLD AST Practice Guideline on adult
  liver transplantation: Candidate evaluation*. Hepatology.
  2026;83(6):1609-1645. doi:10.1097/HEP.0000000000001644.

Deferred concepts include AFP and allocation policy, downstaging selection,
complete transplant candidacy, and individualized treatment outside standard
Milan criteria.

## Approval boundary

Version `.2` applies the owner's approved answer-length cue mitigation without
changing the answer key, clinical meaning, Question Variant IDs, or Concept
ID. This receipt approves only content version
`clinical.owner-row-029.2026-08-06.2`. Any material change to the clinical
meaning, profile bundles, correct-answer mapping, explanations, or boundary
language requires a new version and named clinician review. Automated tests
verify structure; they do not provide clinical approval.
