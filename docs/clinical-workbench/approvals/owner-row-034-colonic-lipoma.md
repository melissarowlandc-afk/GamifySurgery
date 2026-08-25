# Clinical approval receipt: owner row 34 colonic lipoma

Status: exact revision approved and held for Level 2 Endoscopy activation

- Reviewer: Melissa Rowland, MD
- Review date: 2026-08-06
- Approval ID:
  `approval.melissa-rowland-md.owner-row-034.2026-08-06`
- Content version: `clinical.owner-row-034.2026-08-06.1`
- Source workbook: `Gamify Surgery Concepts (2).xlsx`, `Sheet1`, row 34
- Source record: `owner-concept.sheet1.row-034`
- Earlier scope decision:
  `decision.owner-row-034.two-concept-split.2026-08-06`

## Approved concepts

1. `concept.colonic-lipoma.endoscopic-recognition`
   - type: diagnosis
   - FSRS identity: one card across four alternative recognition variants
2. `concept.colonic-lipoma.asymptomatic-management`
   - type: management
   - FSRS identity: one card across four alternative management variants

Both concepts use release point `release.l2.endoscopy`. Recognition and
management remain separate mastery histories. A direct two-decision encounter
updates each card once.

## Approved question variants and complete answer sets

All variants are single-select and shuffle their answer order.

### Recognition: patient to diagnosis, version 1

Question ID:
`question.colonic-lipoma.recognition.patient-to-diagnosis.v1`

- Correct: Colonic lipoma
- Incorrect: Adenomatous polyp
- Incorrect: Colonic neuroendocrine tumor
- Incorrect: Gastrointestinal stromal tumor

### Recognition: patient to diagnosis, version 2

Question ID:
`question.colonic-lipoma.recognition.patient-to-diagnosis.v2`

- Correct: Colonic lipoma
- Incorrect: Colonic adenocarcinoma
- Incorrect: Inflammatory polyp
- Incorrect: Colonic neuroendocrine tumor

### Recognition: diagnosis to phenotype

Question ID:
`question.colonic-lipoma.recognition.diagnosis-to-phenotype.v1`

- Correct: A smooth, yellowish subepithelial lesion that indents with gentle
  pressure and regains its shape
- Incorrect: An irregular ulcerated mucosal mass that bleeds with contact
- Incorrect: A firm noncompressible subepithelial lesion with an atypical
  surface
- Incorrect: A blue, serpiginous vascular-appearing structure

### Recognition: negative-sign boundary

Question ID:
`question.colonic-lipoma.recognition.negative-sign-boundary.v1`

- Correct: An absent cushion or pillow sign does not by itself exclude lipoma;
  the full lesion assessment must guide further evaluation
- Incorrect: Lipoma has been excluded
- Incorrect: Gastrointestinal stromal tumor has been confirmed
- Incorrect: The patient requires immediate colectomy

### Management: patient to plan, version 1

Question ID:
`question.colonic-lipoma.management.patient-to-plan.v1`

- Correct: No lipoma-directed removal or dedicated surveillance; continue
  ordinary follow-up based on the rest of the colonoscopy and the patient's
  usual indications
- Incorrect: Immediate endoscopic resection solely because the lesion was
  found
- Incorrect: Annual colonoscopy solely to monitor the lipoma
- Incorrect: Segmental colectomy

### Management: patient to plan, version 2

Question ID:
`question.colonic-lipoma.management.patient-to-plan.v2`

- Correct: No lesion-specific treatment or surveillance
- Incorrect: Endoscopic ultrasound with tissue acquisition despite the
  characteristic appearance
- Incorrect: Endoscopic removal solely because the lesion was found
- Incorrect: Elective segmental colectomy

### Management: plan to patient

Question ID:
`question.colonic-lipoma.management.plan-to-patient.v1`

- Correct: A patient with a clearly characterized, asymptomatic colonic lipoma
  and no bleeding, ulceration, obstruction, or pain
- Incorrect: A patient with an indeterminate firm subepithelial lesion
- Incorrect: A patient with an ulcerated lesion and recurrent bleeding
- Incorrect: A patient with a lesion causing obstructive symptoms

### Management: observation boundary

Question ID:
`question.colonic-lipoma.management.observation-boundary.v1`

- Correct: Bleeding from an ulcerated lesion
- Incorrect: Continued absence of symptoms
- Incorrect: An unchanged smooth surface
- Incorrect: No evidence of obstruction

The exact stems, explanations, distractor rationales, evidence mappings, and
immutable identities are stored in
`packages/clinical-content/src/approved-data/colonic-lipoma.ts`.

## Approved encounter organization

- Two direct two-decision blueprints pair recognition followed by management.
- Two reverse-direction recognition variants are single-decision encounters.
- Two reverse-direction or boundary management variants are single-decision
  encounters.
- No approved encounter contains more than two scored decisions.
- Names, portraits, and non-answer-essential presentation framing may vary
  later without changing the keyed clinical facts.

## Evidence and boundaries

The independently written claims are supported by:

- Faulx AL, Kothari S, Acosta RD, et al. *The role of endoscopy in
  subepithelial lesions of the GI tract*. Gastrointest Endosc.
  2017;85(6):1117-1132. doi:10.1016/j.gie.2017.02.022.
- Sharzehi K, Sethi A, Savides T. *AGA Clinical Practice Update on Management
  of Subepithelial Lesions Encountered During Routine Endoscopy: Expert
  Review*. Clin Gastroenterol Hepatol. 2022;20(11):2435-2443.e4.
  doi:10.1016/j.cgh.2022.05.054.
- Deprez PH, Moons LMG, O'Toole D, et al. *Endoscopic management of
  subepithelial lesions including neuroendocrine neoplasms: ESGE Guideline*.
  Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.

The observation variants apply only to a clearly characterized asymptomatic
lipoma. Bleeding, ulceration, pain, obstruction, or diagnostic uncertainty
changes the pathway. This approval does not select a particular endoscopic or
surgical resection technique.

## Runtime boundary

The exact clinical content is approved, but the current playable release ends
at Level 1. The concepts, questions, evidence, and encounter blueprints remain
in the approved deferred backlog until the Level 2 Endoscopy runtime exists.
They must not be exposed early by relabeling them as Level 1 content.

## Approval boundary

This receipt approves only content version
`clinical.owner-row-034.2026-08-06.1`. A material change to the clinical
meaning, stems, answer sets, keyed answers, explanations, boundary language,
or concept-to-question mapping requires a new version and named-clinician
review. Automated tests verify structure; they do not provide clinical
approval.
