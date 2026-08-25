# Owner Row 35: Suspicious Breast-Imaging Features Workthrough

Status: Core two-concept/eight-question revision approved; proposed sequential
workup extension still requires exact clinician review

Workthrough date: 2026-08-06

Reviewer required: Melissa Rowland, MD (surgeon)

Source record: `owner-concept.sheet1.row-035`

Melissa Rowland, MD approved the two recognition concepts, their eight complete
answer sets, their Level 3 release point, and a short patient presentation
before each question on 2026-08-06. Those exact records are stored in
`packages/clinical-content/src/approved-data/suspicious-breast-imaging.ts`.

The subsequently authored age-30-to-39 initial-imaging concept, its two exact
question variants, and the two sequential encounter blueprints remain
`needs_clinician_review`. Nothing in this workthrough is admitted to the
current Level 0-1 runtime.

## Source-row intent

The source row asks the learner to recognize imaging features concerning for
breast malignancy. It combines mass shape/margin/density with calcification
morphology and distribution, then places the material near the preoperative
breast-cancer workflow.

The phrase "asymmetric mass" should not be preserved as one imaging finding.
The current ACR mammography lexicon treats a mass and an asymmetry as distinct
finding types. A developing or focal asymmetry can become a separate future
concept if the owner wants to teach that pathway.

Suspicious imaging also should not lead directly to cancer surgery without
tissue diagnosis. This draft teaches feature recognition only. A later
biopsy-proven breast-cancer management concept can teach surgical planning.

## Approved recognition split

1. `concept.breast-imaging.suspicious-mass-morphology`
   - concept type: diagnosis
   - proposed release point: `release.l3.ambulatory_or_qi`
   - required setting for the decision: clinic/preoperative evaluation
   - required facility capability: none
2. `concept.breast-imaging.suspicious-calcification-pattern`
   - concept type: diagnosis
   - proposed release point: `release.l3.ambulatory_or_qi`
   - required setting for the decision: clinic/preoperative evaluation
   - required facility capability: none

The Level 3 release follows the owner's note that this material should join the
breast-surgery pathway once Ambulatory OR content is available. The recognition
decision itself occurs before surgery and does not require an operational OR.

## Approved atomic evidence claims

### `claim.breast-imaging.mass.suspicious-morphology`

An irregular mammographic mass with a spiculated margin is a concerning
morphologic combination that warrants suspicious assessment rather than benign
reassurance.

- Evidence category: evaluation
- Certainty/limitation: authoritative reporting lexicon with independent
  government cross-check; imaging morphology is not itself a tissue diagnosis
- Last checked: 2026-08-06
- Clinical review status: `needs_clinician_review`
- Supporting sources:
  `source.acr.birads-mammography-summary.2025`,
  `source.nci.mammograms.2025`

### `claim.breast-imaging.mass.density-not-diagnostic-alone`

Mass density is one mammographic descriptor and must be interpreted with shape,
margin, associated features, comparison imaging, and the final radiologist
assessment rather than being used alone to diagnose or exclude malignancy.

- Evidence category: safety boundary
- Certainty/limitation: reporting safeguard; this draft does not assign a
  BI-RADS category from density alone
- Last checked: 2026-08-06
- Clinical review status: `needs_clinician_review`
- Supporting sources:
  `source.acr.birads-mammography-summary.2025`,
  `source.nci.mammograms.2025`

### `claim.breast-imaging.calcification.suspicious-pattern`

Fine pleomorphic or fine linear/fine linear-branching calcifications are
suspicious morphologies. A linear or segmental distribution can add concern
when interpreted with morphology and the complete examination.

- Evidence category: evaluation
- Certainty/limitation: authoritative reporting lexicon; no morphology or
  distribution descriptor independently establishes cancer
- Last checked: 2026-08-06
- Clinical review status: `needs_clinician_review`
- Supporting sources:
  `source.acr.birads-mammography-summary.2025`,
  `source.nci.mammograms.2025`

### `claim.breast-imaging.calcification.typically-benign-patterns`

Vascular, large rod-like, rim, layering, and coarse densely calcified patterns
are among calcification appearances categorized as typically benign in the
current mammography lexicon.

- Evidence category: evaluation
- Certainty/limitation: classification applies to the complete radiologist
  assessment; the game must not infer benignity from an isolated word when
  other suspicious features are present
- Last checked: 2026-08-06
- Clinical review status: `needs_clinician_review`
- Supporting source:
  `source.acr.birads-mammography-summary.2025`

## Source records

### `source.acr.birads-mammography-summary.2025`

- Complete citation: Destounis SV, Friedewald SM, Grimm LJ, Poplack SP,
  Sung JS. Mammography. In: *ACR BI-RADS v2025 Manual*. Reston, VA:
  American College of Radiology; 2025. Public resource used: ACR BI-RADS
  v2025 Mammography Lexicon Summary Form, Appendix B.
- Organization: American College of Radiology
- Authors: Stamatia V. Destounis, Sarah M. Friedewald, Lars J. Grimm,
  Steven P. Poplack, Jessica S. Sung
- Publication year: 2025
- DOI: none
- Official URL:
  https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS
- Public summary-form URL:
  https://edge.sitecorecloud.io/americancoldf5f-acrorgf92a-productioncb02-3650/media/ACR/Files/RADS/BI-RADS/BI-RADS-Summary-Form-Mammography.pdf
- Access date: 2026-08-06
- Source class: professional-society reporting standard and public lexicon
  summary
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no manual prose, definitions, tables, clinical images, or
  algorithms reproduced
- Intended use: primary terminology and feature-classification evidence
- Supported evidence-claim IDs:
  `claim.breast-imaging.mass.suspicious-morphology`,
  `claim.breast-imaging.mass.density-not-diagnostic-alone`,
  `claim.breast-imaging.calcification.suspicious-pattern`,
  `claim.breast-imaging.calcification.typically-benign-patterns`
- Medical authority: current authoritative ACR breast-imaging lexicon

### `source.nci.mammograms.2025`

- Complete citation: National Cancer Institute. *Mammograms*. Updated
  December 2, 2025.
- Organization: National Cancer Institute
- Authors: National Cancer Institute
- Publication year: 2025
- DOI: none
- Official URL:
  https://www.cancer.gov/types/breast/screening/mammograms
- Access date: 2026-08-06
- Source class: current government patient and clinician information
- License/reuse status: NCI reuse conditions apply; independently written
  facts only; exclude protected illustrations and separately credited material
- Intended use: independent cross-check for concerning mass morphology,
  calcification grouping, BI-RADS follow-up boundaries, and the distinction
  between imaging suspicion and tissue diagnosis
- Supported evidence-claim IDs:
  `claim.breast-imaging.mass.suspicious-morphology`,
  `claim.breast-imaging.mass.density-not-diagnostic-alone`,
  `claim.breast-imaging.calcification.suspicious-pattern`
- Medical authority: current U.S. government cancer-information resource

### `source.acr.palpable-breast-masses.2022-update`

- Complete citation: Expert Panel on Breast Imaging; Klein KA, Kocher M,
  Lourenco AP, et al. *ACR Appropriateness Criteria Palpable Breast Masses:
  2022 Update*. J Am Coll Radiol. 2023;20(5S):S146-S163.
  doi:10.1016/j.jacr.2023.02.013.
- Organization: American College of Radiology; Journal of the American College
  of Radiology
- Authors: Katherine A. Klein, Maddi Kocher, Ana P. Lourenco, Bethany L.
  Niell, Debbie L. Bennett, ACR Expert Panel on Breast Imaging
- Publication year: 2023
- DOI: 10.1016/j.jacr.2023.02.013
- PMID: 37236740
- Official URL: https://acsearch.acr.org/docs/69495/Narrative
- Access date: 2026-08-06
- Source class: professional-society guideline
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no appropriateness table or protected prose reproduced
- Intended use: evidence for the proposed age-30-to-39 first-step workup
  concept
- Supported evidence-claim ID:
  `claim.breast-mass.age-30-to-39.initial-diagnostic-imaging`
- Medical authority: authoritative ACR imaging-appropriateness guidance
- Limitation: currently the only adequate source mapped to the exact proposed
  combined-imaging teaching point

## Approved complete recognition question package

All questions are single-select. Correct-answer position will be shuffled at
runtime.

### Approved mass-morphology variants

#### `question.breast-imaging.mass.select-concerning-profile.v1`

**Stem:** Which mammographic mass profile is most concerning for malignancy?

- **An irregular mass with spiculated margins** — correct
- An oval, circumscribed, fat-containing mass
- A round mass with a sharply circumscribed margin
- An oval, circumscribed low-density mass

**Approved explanation:** Irregular shape and a spiculated margin form the most
concerning combination among these options. Imaging suspicion is not the same
as a tissue diagnosis.

#### `question.breast-imaging.mass.select-concerning-profile.v2`

**Stem:** Which combination of mammographic mass descriptors should receive
the most suspicious assessment?

- **Irregular shape with a spiculated margin** — correct
- Oval shape with a circumscribed margin
- Round shape with a circumscribed margin
- Fat-containing density with a circumscribed margin

**Approved explanation:** The irregular, spiculated combination is the most
concerning profile in this answer set.

#### `question.breast-imaging.mass.identify-spiculated-margin.v1`

**Stem:** A mammography report describes thin lines radiating outward from the
edge of a breast mass. Which margin descriptor best matches that finding?

- **Spiculated** — correct
- Circumscribed
- Obscured
- Indistinct

**Approved explanation:** Radiating lines from the margin describe a spiculated
mass. The term is a morphology descriptor, not histologic proof of cancer.

#### `question.breast-imaging.mass.density-boundary.v1`

**Stem:** Which statement about mammographic mass density is most accurate?

- **Density is one descriptor and must be interpreted with shape, margin,
  associated features, comparison imaging, and the final assessment** —
  correct
- Every high-density mass is malignant
- Every low-density mass is benign
- Density alone determines the final BI-RADS category

**Approved explanation:** Density contributes to assessment but cannot diagnose or
exclude malignancy by itself.

### Approved calcification-pattern variants

#### `question.breast-imaging.calcification.select-concerning-pattern.v1`

**Stem:** Which mammographic calcification pattern is most concerning for
malignancy?

- **Fine linear or fine linear-branching calcifications in a segmental
  distribution** — correct
- Vascular calcifications following parallel tracks
- Large, smooth rod-like calcifications
- Coarse, densely calcified, confluent calcifications

**Approved explanation:** Suspicious fine linear or branching morphology combined
with a segmental distribution is the most concerning profile in this answer
set.

#### `question.breast-imaging.calcification.select-suspicious-morphology.v1`

**Stem:** Which calcification morphology is categorized as suspicious on
mammography?

- **Fine pleomorphic calcifications** — correct
- Vascular calcifications
- Rim calcifications
- Layering calcifications

**Approved explanation:** Fine pleomorphic morphology is suspicious; the other
listed patterns are categorized as typically benign.

#### `question.breast-imaging.calcification.select-benign-profile.v1`

**Stem:** Which calcification profile is categorized as typically benign?

- **Coarse, large, densely calcified, confluent calcifications** — correct
- Fine pleomorphic calcifications
- Fine linear-branching calcifications
- Coarse heterogeneous calcifications

**Approved explanation:** The coarse densely calcified pattern is typically
benign. The other listed morphologies are in the suspicious lexicon.

#### `question.breast-imaging.calcification.distribution-boundary.v1`

**Stem:** Which statement about a segmental distribution of breast
calcifications is most accurate?

- **It is a distribution descriptor that must be interpreted with
  calcification morphology and the complete imaging assessment; it does not
  by itself diagnose cancer** — correct
- Segmental distribution automatically confirms breast cancer
- Calcification distribution has no role in imaging assessment
- Every diffuse calcification pattern requires tissue diagnosis

**Approved explanation:** Distribution modifies interpretation but does not
replace morphology, the rest of the examination, or tissue diagnosis when
indicated.

## Approved presentation and encounter organization

Every approved question is preceded by a brief patient presentation. Six
single-decision blueprints begin with completed imaging already in hand:

- two mass-description or interpretation visits;
- four calcification-pattern visits.

The other two approved mass-morphology questions are the planned second
decisions in sequential encounters. The patient first presents with a new
palpable mass, completes diagnostic imaging, returns with results, and then
answers one mass-morphology question.

The sequential first step is a distinct scored workup concept so it cannot
silently update either recognition card:

`concept.breast-mass.age-30-to-39.initial-diagnostic-imaging`

The age range is intentional. Current ACR guidance lists diagnostic
mammography or tomosynthesis and breast ultrasound as appropriate initial
modalities for women age 30 to 39 with a palpable breast mass. For women age
40 or older, diagnostic mammography or tomosynthesis is the usual initial
study and ultrasound is added selectively. The combined-order teaching
variant therefore uses the 30-to-39 population.

## Proposed exact workup variants still awaiting approval

### `question.breast-mass.age-30-to-39.initial-diagnostic-imaging.v1`

**Presentation:** A nonpregnant, nonlactating 34-year-old woman at average
breast-cancer risk presents with a new persistent palpable breast mass and no
overt inflammatory findings.

**Stem:** Which initial diagnostic imaging plan is most appropriate for this
presentation?

- **Order diagnostic mammography or tomosynthesis with targeted breast
  ultrasound** - proposed correct answer
- Order routine screening mammography only
- Order contrast-enhanced breast MRI as the sole initial study
- Observe without imaging unless the mass enlarges

**Draft explanation:** For this scoped patient age 30 to 39 with a new palpable
mass, diagnostic mammography or tomosynthesis and targeted ultrasound are
appropriate components of the initial imaging evaluation.

### `question.breast-mass.age-30-to-39.initial-diagnostic-imaging.v2`

**Presentation:** A nonpregnant, nonlactating 38-year-old woman at average
breast-cancer risk presents with a newly noticed discrete breast mass without
erythema, drainage, or other overt inflammatory findings.

**Stem:** What is the most appropriate initial diagnostic imaging approach?

- **Obtain diagnostic mammography or tomosynthesis and targeted breast
  ultrasound** - proposed correct answer
- Wait for the next annual screening mammogram
- Order PET/CT as the initial breast imaging study
- Proceed directly to surgical excision before diagnostic imaging

**Draft explanation:** For this scoped patient age 30 to 39, diagnostic
mammography or tomosynthesis and targeted ultrasound are appropriate initial
imaging modalities. Subsequent tissue diagnosis depends on the complete
assessment.

## Current approval boundary

- The two recognition concepts and eight original exact questions are
  clinically approved.
- The brief patient framing and six results-in-hand blueprints are recorded
  with that approved revision.
- Developing or focal asymmetry remains a separate future concept.
- The two new workup questions above and both sequential blueprints remain
  `needs_clinician_review` until their exact wording, distractors, and answer
  key receive named-clinician approval.
- All row-35 content remains deferred from runtime until Level 3 Ambulatory OR
  / QI content admission exists.
