# Owner Row 34: Colonic-Lipoma Workthrough

Status: Completed; superseded by exact approval

Workthrough date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Source record: `owner-concept.sheet1.row-034`

The exact concept, question, evidence-claim, and encounter-blueprint package
was subsequently approved as
`approval.melissa-rowland-md.owner-row-034.2026-08-06`. The immutable final
receipt is `../approvals/owner-row-034-colonic-lipoma.md`.

## Approved scope decision

Decision ID:
`decision.owner-row-034.two-concept-split.2026-08-06`

The owner approved resolving source row 34 into two separate FSRS identities:

1. `concept.colonic-lipoma.endoscopic-recognition`
   - concept type: diagnosis
   - release point: `release.l2.endoscopy`
2. `concept.colonic-lipoma.asymptomatic-management`
   - concept type: management
   - release point: `release.l2.endoscopy`

The split prevents recognition of a characteristic lesion and management of a
clearly characterized asymptomatic lesion from being treated as one mastery
card. Both concepts become eligible when endoscopy gameplay is available.

This decision does **not** yet approve exact Patient Presentation Variants,
Question Variants, answer sets, explanations, consequences, or runtime
admission. Those artifacts remain `needs_clinician_review` until the owner
explicitly approves their exact versions.

## Draft scope boundaries

The recognition concept is being drafted around a smooth, yellowish,
soft-appearing colonic subepithelial lesion that indents with gentle probing
and then regains its shape. A positive cushion/pillow sign supports a lipoma
diagnosis, but an absent sign must not be used to exclude lipoma.

The management concept is being drafted for a clearly characterized,
asymptomatic colonic lipoma without bleeding, ulceration, obstruction, pain,
intussusception, or diagnostic uncertainty. The intended answer is no
lipoma-directed removal or dedicated surveillance; ordinary colorectal
screening or surveillance continues according to the rest of the examination
and the patient's usual indications.

The following remain outside the observation-only variant:

- bleeding or ulceration;
- pain or obstructive symptoms;
- intussusception;
- an atypical, firm, or otherwise indeterminate lesion;
- discordant endoscopic, imaging, biopsy, or clinical findings; and
- selection of a particular endoscopic or surgical resection technique.

These features may justify further evaluation or treatment, but no exact
intervention pathway is approved by this scope decision.

## Atomic evidence claims under review

### `claim.colonic-lipoma.characteristic-endoscopic-phenotype`

A smooth, yellowish, soft subepithelial lesion that indents with gentle probing
has an endoscopic phenotype strongly supportive of a gastrointestinal lipoma.
Because the cushion/pillow sign has limited sensitivity, its absence alone
does not exclude the diagnosis.

- Evidence category: diagnostic recognition
- Certainty/limitation: characteristic positive phenotype is supportive; a
  negative sign is not exclusionary, and atypical lesions require their own
  diagnostic pathway
- Last checked: 2026-08-06
- Clinical review status: `clinically_approved` in content version
  `clinical.owner-row-034.2026-08-06.1`
- Supporting sources:
  `source.asge.subepithelial-lesions.2017`,
  `source.esge.subepithelial-lesions.2022`

### `claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up`

A clearly characterized asymptomatic gastrointestinal lipoma does not require
lipoma-directed therapy or dedicated surveillance.

- Evidence category: management
- Certainty/limitation: applies only when the diagnosis is clear and the lesion
  is asymptomatic; it does not replace otherwise indicated colorectal
  screening or surveillance
- Last checked: 2026-08-06
- Clinical review status: `clinically_approved` in content version
  `clinical.owner-row-034.2026-08-06.1`
- Supporting sources:
  `source.asge.subepithelial-lesions.2017`,
  `source.aga.subepithelial-lesions.2022`,
  `source.esge.subepithelial-lesions.2022`

### `claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway`

Bleeding, ulceration, clinically significant symptoms, obstruction, or an
uncertain diagnosis makes the observation-only pathway inapplicable and
requires further evaluation for an individualized management decision.

- Evidence category: management boundary
- Certainty/limitation: this claim does not select an exact resection method;
  approach depends on lesion features, patient factors, and available
  expertise
- Last checked: 2026-08-06
- Clinical review status: `clinically_approved` in content version
  `clinical.owner-row-034.2026-08-06.1`
- Supporting sources:
  `source.asge.subepithelial-lesions.2017`,
  `source.aga.subepithelial-lesions.2022`,
  `source.esge.subepithelial-lesions.2022`

## Source records

### `source.asge.subepithelial-lesions.2017`

- Complete citation: Faulx AL, Kothari S, Acosta RD, et al. The role of
  endoscopy in subepithelial lesions of the GI tract. *Gastrointestinal
  Endoscopy*. 2017;85(6):1117-1132.
- Organization or journal: American Society for Gastrointestinal Endoscopy;
  *Gastrointestinal Endoscopy*
- Authors: Ashley L. Faulx, Shivangi Kothari, Ruben D. Acosta, et al.
- Publication year: 2017
- DOI: https://doi.org/10.1016/j.gie.2017.02.022
- Official URL:
  https://www.asge.org/home/resources/publications/guidelines/the-role-of-endoscopy-in-subepithelial-lesions-of-the-gi-tract
- Access date: 2026-08-06
- Source class: professional-society guideline
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no protected wording, tables, figures, or algorithms
  reproduced
- Intended use: endoscopic-recognition evidence and management cross-check
- Supported evidence-claim IDs:
  `claim.colonic-lipoma.characteristic-endoscopic-phenotype`,
  `claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up`,
  `claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway`
- Medical authority: authoritative specialty-society guidance

### `source.aga.subepithelial-lesions.2022`

- Complete citation: Sharzehi K, Sethi A, Savides T. AGA Clinical Practice
  Update on Management of Subepithelial Lesions Encountered During Routine
  Endoscopy: Expert Review. *Clinical Gastroenterology and Hepatology*.
  2022;20(11):2435-2443.e4.
- Organization or journal: American Gastroenterological Association;
  *Clinical Gastroenterology and Hepatology*
- Authors: Kaveh Sharzehi, Amrita Sethi, Thomas Savides
- Publication year: 2022
- DOI: https://doi.org/10.1016/j.cgh.2022.05.054
- Official URL:
  https://gastro.org/clinical-guidance/management-of-subepithelial-lesions-sel-encountered-during-routine-endoscopy/
- Access date: 2026-08-06
- Source class: professional-society clinical practice update
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no protected wording reproduced
- Intended use: primary management evidence and symptom/ulceration/bleeding
  boundary
- Supported evidence-claim IDs:
  `claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up`,
  `claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway`
- Medical authority: authoritative professional-society expert review

### `source.esge.subepithelial-lesions.2022`

- Complete citation: Deprez PH, Moons LMG, O'Toole D, et al. Endoscopic
  management of subepithelial lesions including neuroendocrine neoplasms:
  European Society of Gastrointestinal Endoscopy (ESGE) Guideline.
  *Endoscopy*. 2022;54:412-429.
- Organization or journal: European Society of Gastrointestinal Endoscopy;
  *Endoscopy*
- Authors: Pierre H. Deprez, Leon M. G. Moons, Dermot O'Toole, et al.
- Publication year: 2022
- DOI: https://doi.org/10.1055/a-1751-5742
- Official URL:
  https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf
- Access date: 2026-08-06
- Source class: professional-society guideline
- License/reuse status: copyrighted; targeted factual verification and
  citation only; no protected wording, tables, figures, or algorithms
  reproduced
- Intended use: independent diagnostic and management cross-check
- Supported evidence-claim IDs:
  `claim.colonic-lipoma.characteristic-endoscopic-phenotype`,
  `claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up`,
  `claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway`
- Medical authority: authoritative international specialty-society guidance

## Exact package approval

The owner approved the following exact package on 2026-08-06. It remains
outside the playable Level 0-1 release until the Level 2 Endoscopy runtime
exists. The final receipt and versioned TypeScript record are authoritative.

### Proposed encounter structure

- Two direct, two-decision encounters:
  1. recognize the lesion;
  2. choose management after the diagnosis is established.
- Four additional one-decision encounters test the same two concepts in the
  reverse direction or at a safety boundary.
- No encounter contains more than two decisions.
- Names, portraits, and approved neutral demographic/narrative profiles may
  vary without changing the answer-essential clinical facts.
- Answer order is shuffled and then frozen into the saved encounter.

### Draft recognition variants

#### `question.colonic-lipoma.recognition.patient-to-diagnosis.v1`

**Stem:** During a routine colonoscopy, you find a smooth subepithelial lesion
with normal overlying mucosa and a faint yellow hue. It feels soft, indents
with gentle pressure from closed biopsy forceps, and then regains its shape.
What is the most likely diagnosis?

- **Colonic lipoma** — correct
- Adenomatous polyp
- Colonic neuroendocrine tumor
- Gastrointestinal stromal tumor

**Draft explanation:** A soft, yellowish subepithelial lesion that indents and
rebounds demonstrates a characteristic cushion/pillow-sign phenotype that
strongly supports colonic lipoma.

#### `question.colonic-lipoma.recognition.patient-to-diagnosis.v2`

**Stem:** An asymptomatic patient has a rounded colonic lesion beneath
normal-appearing mucosa. Gentle probing produces a temporary indentation, and
the lesion returns to its original contour when pressure is released. Which
diagnosis best fits this endoscopic appearance?

- Colonic lipoma — correct
- Colonic adenocarcinoma
- Inflammatory polyp
- Colonic neuroendocrine tumor

**Draft explanation:** The soft, deformable subepithelial appearance with
shape recovery is most consistent with a lipoma.

#### `question.colonic-lipoma.recognition.diagnosis-to-phenotype.v1`

**Stem:** Which colonoscopy description most strongly supports a colonic
lipoma?

- **A smooth, yellowish subepithelial lesion that indents with gentle pressure
  and regains its shape** — correct
- An irregular ulcerated mucosal mass that bleeds with contact
- A firm noncompressible subepithelial lesion with an atypical surface
- A blue, serpiginous vascular-appearing structure

**Draft explanation:** The soft yellowish lesion with a positive
cushion/pillow sign is the characteristic profile among these options.

#### `question.colonic-lipoma.recognition.negative-sign-boundary.v1`

**Stem:** A colonic subepithelial lesion does not indent when gently probed.
Which interpretation is most accurate?

- **An absent cushion/pillow sign does not by itself exclude lipoma; the full
  lesion assessment must guide further evaluation** — correct
- Lipoma has been excluded
- Gastrointestinal stromal tumor has been confirmed
- The patient requires immediate colectomy

**Draft explanation:** The cushion/pillow sign is highly supportive when
present but has limited sensitivity. A negative maneuver is not diagnostic of
another lesion and does not independently dictate treatment.

### Draft management variants

#### `question.colonic-lipoma.management.patient-to-plan.v1`

**Stem:** The lesion has a characteristic endoscopic appearance of a colonic
lipoma. The patient has no pain, bleeding, ulceration, obstructive symptoms, or
other concerning features. What is the most appropriate lipoma-directed plan?

- **No lipoma-directed removal or dedicated surveillance; continue ordinary
  follow-up based on the rest of the colonoscopy and the patient's usual
  indications** — correct
- Immediate endoscopic resection solely because the lesion was found
- Annual colonoscopy solely to monitor the lipoma
- Segmental colectomy

**Draft explanation:** A clearly characterized asymptomatic lipoma does not
require lesion-directed treatment or dedicated surveillance. Other findings
and ordinary screening indications still determine routine follow-up.

#### `question.colonic-lipoma.management.patient-to-plan.v2`

**Stem:** Colonoscopy demonstrates a clearly characterized colonic lipoma with
normal overlying mucosa. The finding is incidental, and the patient has no
symptoms attributable to it. What should you recommend for this lesion?

- No lesion-specific treatment or surveillance — correct
- Endoscopic ultrasound with tissue acquisition despite the characteristic
  appearance
- Endoscopic removal solely because the lesion was found
- Elective segmental colectomy

**Draft explanation:** Observation without lipoma-specific follow-up is
appropriate when the diagnosis is clear and the lesion is asymptomatic.

#### `question.colonic-lipoma.management.plan-to-patient.v1`

**Stem:** Which patient is the best candidate for no lipoma-directed treatment
or dedicated surveillance?

- **A patient with a clearly characterized, asymptomatic colonic lipoma and no
  bleeding, ulceration, obstruction, or pain** — correct
- A patient with an indeterminate firm subepithelial lesion
- A patient with an ulcerated lesion and recurrent bleeding
- A patient with a lesion causing obstructive symptoms

**Draft explanation:** The no-intervention pathway applies only when the
diagnosis is clear and the lipoma is asymptomatic and uncomplicated.

#### `question.colonic-lipoma.management.observation-boundary.v1`

**Stem:** A previously incidental colonic lipoma is being managed without
lesion-specific treatment. Which new finding most clearly makes that
observation-only plan inappropriate?

- **Bleeding from an ulcerated lesion** — correct
- Continued absence of symptoms
- An unchanged smooth surface
- No evidence of obstruction

**Draft explanation:** Bleeding or ulceration moves the lesion outside the
approved asymptomatic observation pathway and warrants further evaluation for
individualized treatment. This question does not prescribe a particular
resection technique.
