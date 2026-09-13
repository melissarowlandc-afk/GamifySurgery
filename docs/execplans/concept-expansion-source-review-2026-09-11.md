# September 11 concept-expansion source review

## Scope and status

This brief supports source and curriculum decisions for GS-011-007 and four
tentative two-concept families. It does not approve clinical content, authorize
publication, or establish ABSITE frequency. The owner sheet is a prompt source,
not medical authority. All future records remain `needs_clinician_review` until
a named clinician reviews them.

All claims below are short, original factual syntheses. Sources and applicable
reuse terms were checked on 2026-09-11. Copyrighted guidance is used only for
targeted factual verification; source prose, tables, figures, and algorithms
must not be reproduced.

## Public SCORE 2025–2026 mapping

Source: Surgical Council on Resident Education. *General Surgery Curriculum
Outline | 2025–2026*. Official public PDF:
https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf
(accessed 2026-09-11). The public outline is copyrighted and provides broad
residency scope/depth, not question frequency or the content of proprietary
SCORE modules. Physical PDF page numbers are printed page numbers plus one.

| Candidate family | Exact public locator | Mapping conclusion |
| --- | --- | --- |
| GS-011-007 celiac serology | No `Celiac` topic and no tTG/total-IgA detail appears in the public outline. `Small Intestine` begins on printed p. 6 / physical p. 7. | **Supplemental / retain existing.** Do not infer explicit SCORE coverage from a broad organ heading and do not claim that absence predicts exam frequency. |
| Lactational breast abscess | `Breast` → `Diseases/Conditions` → `Benign Inflammatory Disease of the Breast` and `Breast Disease During Pregnancy and Lactation`, both **Common**, printed p. 9 / physical p. 10. Related procedure: `Percutaneous Breast Biopsy and Cyst Aspiration`, **Common**, same page. | **Explicit family; details inferred.** Lactational disease and inflammatory breast disease are named; ultrasound and abscess-drainage choices are not individually named. |
| Post-thyroidectomy voice change | `Endocrine` → `Operations/Procedures` → `Thyroidectomy`, **Common**, printed p. 10 / physical p. 11. | **Inferred within explicit procedure.** Voice evaluation and EBSLN localization are not named separately. |
| Zenker diverticulum | `Esophagus` → `Operations/Procedures` → `Cricopharyngeal Myotomy and Resection of Zenker Diverticulum`, **Uncommon**, printed p. 5 / physical p. 6. | **Explicit family; diagnostic details inferred.** Zenker is named, while contrast-swallow sequencing and false-pouch anatomy are not. |
| Femoral access pseudoaneurysm | No post-access pseudoaneurysm topic. Related `Arterial Disease` entries are `Peripheral Arterial Aneurysms`, **Uncommon**, printed p. 14 / physical p. 15, and `Peripheral Aneurysms Repair`, `Endovascular Intervention Principles`, and `Ultrasound in the Diagnosis and Management of Vascular Diseases`, all **Uncommon**, printed p. 15 / physical p. 16. | **Supplemental / related only.** Do not conflate an access-site false aneurysm with the named true peripheral aneurysm. |
| Intermittent claudication / lower-extremity PAD | `Arterial Disease` → `Diseases/Conditions` → `Peripheral Vascular Occlusive Disease`, **Common**, printed p. 14 / physical p. 15. Related revascularization procedures are **Uncommon** on printed p. 15 / physical p. 16. | **Explicit family.** Resting ABI and structured exercise are inferred details within the named common disease topic. |
| Primary hyperparathyroidism | `Endocrine` → `Hyperparathyroidism`, **Common**, and `Parathyroidectomy`, **Common**, printed p. 10 / physical p. 11. | **Explicit.** |
| Cushing syndrome | `Endocrine` → `Hypercortisolism and Cushing Syndrome/Disease`, **Common**, printed p. 10 / physical p. 11. | **Explicit.** |
| Pancreatic cyst | `Pancreas` → `Pancreatic Cystic Neoplasms`, **Uncommon**, printed p. 4 / physical p. 5. | **Explicit.** |
| Colon adenocarcinoma | `Large Intestine` → `Colon Cancer`, **Common**, printed p. 7 / physical p. 8. | **Explicit.** |
| Rectal cancer | `Anorectal` → `Rectal Cancer`, **Common**, printed p. 8 / physical p. 9. | **Explicit.** |
| Carotid stenosis | `Arterial Disease` → `Carotid Artery Disease`, **Common**, printed p. 14 / physical p. 15; `Procedures for Carotid Artery Stenosis`, **Uncommon**, printed p. 15 / physical p. 16. | **Explicit.** Disease evaluation maps to the common topic; intervention selection also relates to the uncommon procedure topic. |

## GS-011-007 celiac serology

The existing concept `concept.celiac.initial-serology` is clinically coherent
and should remain unchanged: while an adult is eating gluten, tTG-IgA is the
usual preferred initial serologic test and total IgA supplies the context needed
to recognize IgA deficiency. IgA deficiency changes test selection, and a
positive compatible adult result commonly leads to duodenal-biopsy confirmation.

This is **supplemental**, not an exact public SCORE locator. Preserve the current
source records and limitations in
`packages/clinical-content/src/development-batch/2026-09-09/celiac.ts`.

- **source.niddk.celiac-tests.2021:** National Institute of Diabetes and
  Digestive and Kidney Diseases. *Celiac Disease Tests*. Last reviewed February
  2021. https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals
- **source.niddk.celiac-diagnosis.2020:** National Institute of Diabetes and
  Digestive and Kidney Diseases. *Diagnosis of Celiac Disease*. Last reviewed
  October 2020. https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis
- **Authority/reuse:** current US-government professional/patient guidance;
  federal factual material is generally public domain, but exclude third-party
  material, images, and agency marks and do not imply endorsement.

## Lactational breast abscess

### Recommended two concepts

1. `claim.expansion.lactational-abscess.targeted-ultrasound`: In a stable
   lactating adult with a persistent focal tender or erythematous breast mass
   suspicious for a collection, targeted breast ultrasound is appropriate to
   evaluate for an abscess. This does not make every episode of mastitis an
   imaging indication or exclude inflammatory cancer and other masses.
2. `claim.expansion.lactational-abscess.selected-drainage`: A confirmed,
   uncomplicated drainable lactational abscess needs source control; image-guided
   needle aspiration with fluid culture is a reasonable initial approach in a
   suitable collection. Repeated aspiration, catheter drainage, or surgery may
   be needed based on anatomy and clinical course. Antibiotic choice and culture
   review remain individualized. Breastfeeding or expressed milk generally can
   continue from the affected side when the infant's mouth and pump flange avoid
   purulent drainage, open infected tissue, and the drain site.

Use a stable outpatient who has no sepsis, skin necrosis, rapidly progressive
infection, immunocompromised infant, or concern for malignancy. Do not state
that every abscess must be aspirated, omit antibiotics/culture context, or give
an exact drug regimen. This is distinct from the existing noninflammatory breast
cyst pathway.

### Sources

- **source.expansion.abm-mastitis-2022:** Mitchell KB, Johnson HM, Rodríguez JM,
  Eglash A, Scherzinger C, Zakariija-Grkovic I, Widmer Cash K, Berens P, Miller
  B; Academy of Breastfeeding Medicine. *Academy of Breastfeeding Medicine
  Clinical Protocol #36: The Mastitis Spectrum, Revised 2022.* Breastfeeding
  Medicine. 2022;17(5):360-376. doi:10.1089/bfm.2022.29207.kbm. Official PDF:
  https://abm.memberclicks.net/assets/DOCUMENTS/PROTOCOLS/36-mitchell-et-al-2022-academy-of-breastfeeding-medicine-clinical-protocol-36-the-mastitis-spectrum-revised-2022.pdf
  **Class/authority:** professional-society protocol; direct authority for
  source control, aspiration/culture, alternatives, continued breastfeeding,
  and individualized antibiotics. Abscess recommendations are levels 2–3,
  strength C. **Reuse:** copyright Mary Ann Liebert; the accessed PDF says
  personal use only. Targeted factual verification only; no reusable license.
- **source.expansion.acr-lactation-imaging-2026:** Expert Panel on Breast
  Imaging; Dogan BE, Salkowski LR, Weinstein SP, Bartell S, Chikarmane S, Dibble
  EH, Dodelzon K, Goldfarb S, Kasales C, Kunjummen JM, Kuzmiak CM, Maimone S,
  Patel M, Paulis LV, Yoon-Flannery K, Lewin AA. *ACR Appropriateness Criteria®
  Breast Imaging During Lactation.* Journal of the American College of
  Radiology. 2026;23(8):1768-1785. doi:10.1016/j.jacr.2026.03.002. Official
  narrative: https://acsearch.acr.org/docs/3196809/Narrative
  **Class/authority:** current professional-society imaging guideline; direct
  cross-check for targeted ultrasound in suspected lactational infection or
  abscess and for safe image-guided aspiration. **Reuse:** copyright ACR,
  all rights reserved; ACR Legal permits only limited uses and forbids
  reproduction without permission. No AI-specific prohibition was found in the
  applicable legal page. Targeted factual verification only.
- **source.expansion.cdc-mrsa-breastfeeding-2025:** Centers for Disease Control
  and Prevention. *Methicillin-Resistant Staphylococcus aureus (MRSA) and
  Breastfeeding.* September 23, 2025.
  https://www.cdc.gov/breastfeeding-special-circumstances/hcp/illnesses-conditions/mrsa.html
  **Class/authority:** US-government guidance; limited independent cross-check
  for continued feeding and drain/open-tissue precautions in staphylococcal or
  MRSA infection, not authority for all abscess-drainage selection. **Reuse:**
  federal factual material generally public domain; exclude third-party content,
  marks, and images.

## Persistent voice change after thyroidectomy

### Recommended two concepts

1. `claim.expansion.post-thyroidectomy-voice.laryngeal-examination`: A patient
   with persistent voice change after thyroid surgery should have laryngeal
   visualization with assessment of vocal-fold status. Symptoms alone should
   not be labeled as recurrent-laryngeal-nerve injury because edema, intubation
   injury, muscle/scar effects, EBSLN injury, and RLN dysfunction can overlap.
2. `claim.expansion.post-thyroidectomy-voice.ebsln-localization`: The EBSLN
   supplies the cricothyroid muscle, which supports vocal-fold tension, high
   pitch, and projection. Loss of projection or upper range after superior-pole
   dissection, especially with otherwise preserved ordinary voice and vocal-fold
   mobility, supports EBSLN/cricothyroid dysfunction rather than the existing
   classic RLN-hoarseness concept. Present this as localization after evaluation,
   not a claim that superior thyroid artery handling always causes injury.

This pair belongs after surgery and must not become an intraoperative anatomy
question. It is intentionally distinct from an existing RLN concept. Specialized
voice testing or laryngeal EMG may be needed in practice; a short case should
not portray the symptom pattern as independently definitive.

### Sources

- **source.expansion.kslpl-thyroid-voice-2022:** Ryu CH, Lee SJ, Cho JG, Choi
  IJ, Choi YS, Hong YT, Jung SY, Kim JW, Lee DY, Lee DK, Lee G, Lee SJ, Lee YC,
  Lee YS, Nam IC, Park KN, Park YM, Sung ES, Son HY, Seo IH, Lee BJ, Lim JY;
  Korean Society of Laryngology, Phoniatrics and Logopedics Guideline Task
  Force. *Care and Management of Voice Change in Thyroid Surgery: Korean Society
  of Laryngology, Phoniatrics and Logopedics Clinical Practice Guideline.*
  Clinical and Experimental Otorhinolaryngology. 2022;15(1):24-48.
  doi:10.21053/ceo.2021.00633. https://doi.org/10.21053/ceo.2021.00633
  **Class/authority:** evidence-based professional-society guideline; direct
  authority for postoperative voice check, laryngeal examination when voice
  changes, and EBSLN/cricothyroid function. The laryngeal-exam recommendation is
  strong with moderate-quality evidence. **Reuse:** CC BY-NC 4.0; attribution
  required, noncommercial reuse only.
- **source.expansion.ata-thyroid-surgery-2026:** American Thyroid Association.
  *Thyroid Surgery.* Undated live patient/professional education, accessed
  2026-09-11. https://www.thyroid.org/thyroid-surgery/
  **Class/authority:** professional-society education; independent cross-check
  distinguishing RLN-associated hoarseness from EBSLN-associated loss of
  projection/high pitch. **Reuse:** ATA copyright; its terms permit access/use
  for personal or educational purposes and accurate attributed deep links, but
  not republication. Targeted factual verification only. Terms:
  https://www.thyroid.org/about-american-thyroid-association/terms-of-use/

The 2025 ATA differentiated-thyroid-cancer guideline also identifies the EBSLN
as the motor supply to cricothyroid and as vulnerable during superior-pole
dissection, but it is an intraoperative preservation source rather than the
primary authority for this postoperative pair: Ringel MD, Sosa JA, Baloch Z,
et al. *2025 American Thyroid Association Management Guidelines for Adult
Patients with Differentiated Thyroid Cancer.* Thyroid. 2025;35(8):841-985.
doi:10.1177/10507256251363120. https://pubmed.ncbi.nlm.nih.gov/40844370/

## Zenker diverticulum

### Recommended two concepts

1. `claim.expansion.zenker.contrast-swallow`: When the presentation specifically
   suggests a proximal pharyngoesophageal pouch—such as cervical dysphagia with
   regurgitation of retained food—contrast swallow with fluoroscopy is an
   appropriate first anatomic test to demonstrate a Zenker diverticulum. This
   must not be generalized to all esophageal dysphagia: after oropharyngeal
   disease is excluded, endoscopy is generally preferred for persistent
   uninvestigated esophageal dysphagia and mucosal disease.
2. `claim.expansion.zenker.false-pouch-anatomy`: A posterior pouch of mucosa and
   submucosa arising above the cricopharyngeus supports Zenker anatomy and
   reflects impaired cricopharyngeal opening/increased pharyngeal pressure. A
   lateral pouch below the cricopharyngeus suggests a different entity. Use the
   returned swallow anatomy for recognition; do not ask for treatment selection.

This directly resolves sheet row 154: an EGD-first answer is not preferred in a
classic suspected Zenker presentation, but EGD remains important in other
dysphagia pathways and may complement imaging. Avoid procedural management in
this family because technique selection is evolving and the 2020 ESGE preference
for flexible endoscopic treatment was weak and based on low-quality evidence.

### Sources

- **source.expansion.zen-rad-2021:** Ishaq S, Siau K, Lee M, Shalmani HM, Kuwai
  T, Priestnall L, Muhammad H, Hall A, Mulder CJ, Neumann H, Aziz A. *Zenker's
  Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict
  Severity and Treatment Outcomes? The “Zen-Rad” Study.* Dysphagia.
  2021;36(3):393-401; published online June 19, 2020.
  doi:10.1007/s00455-020-10148-5.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC8163680/
  **Class/authority:** prospective, single-center observational study of 67
  symptomatic patients; direct evidence that barium-swallow imaging is
  established for Zenker and can show the pouch/cricopharyngeal relationship.
  It does not establish a universal measurement protocol or test sequence for
  every dysphagia presentation. **Reuse:** CC BY 4.0; attribution required.
- **source.expansion.foregut-diverticula-2021:** Roh S. *Foregut Diverticula.*
  Korean Journal of Family Medicine. 2021;42(3):191-196.
  doi:10.4082/kjfm.18.0092. https://www.kjfm.or.kr/upload/pdf/kjfm-18-0092.pdf
  **Class/authority:** peer-reviewed clinical review; independent support for
  the false-pouch/cricopharyngeal anatomy and mechanism. **Reuse:** CC BY-NC
  4.0; attribution required, noncommercial reuse only.
- **source.expansion.cag-dysphagia-2018:** Liu LWC, Andrews CN, Armstrong D,
  Diamant N, Jaffer N, Lazarescu A, Li M, Martino R, Paterson W, Leontiadis GI,
  Tse F. *Clinical Practice Guidelines for the Assessment of Uninvestigated
  Esophageal Dysphagia.* Journal of the Canadian Association of Gastroenterology.
  2018;1(1):5-19. doi:10.1093/jcag/gwx008.
  https://www.cag-acg.org/_Library/clinical_cpgs_position_papers/CAG_CPG_Esophageal_Dysphagia_JCAG_Feb2018.pdf
  **Class/authority:** professional-society consensus guideline; limitation
  source showing that EGD generally leads for persistent esophageal dysphagia
  and that barium and endoscopy can be complementary in preoperative Zenker
  assessment. **Reuse:** CC BY-NC 4.0; attribution required, noncommercial reuse
  only.

## Femoral access pseudoaneurysm

### Recommended two concepts

1. `claim.expansion.femoral-access-pseudoaneurysm.duplex`: A new pulsatile groin
   mass, thrill, bruit, or pain after femoral arterial access should prompt
   duplex ultrasound to confirm a pseudoaneurysm and characterize sac, neck, and
   flow. The case must call this an iatrogenic false aneurysm, not the true
   femoral aneurysm associated with the existing sheet-126/AAA family.
2. `claim.expansion.femoral-access-pseudoaneurysm.selected-thrombin`: Ultrasound-
   guided thrombin injection is a reasonable minimally invasive treatment for a
   selected stable access-site pseudoaneurysm with suitable anatomy. Selection
   depends on the patient and lesion; infection, rapid expansion, skin compromise,
   distal ischemia or neurologic compression, and complex or wide-neck anatomy
   require vascular-specialist surgical/endovascular planning rather than a
   universal injection pathway.

Do not encode numeric sac/neck thresholds, success rates, thrombin dose, or a
universal hierarchy. The current consensus is specific to cardiovascular access
complications, and the independent study is small and retrospective.

### Sources

- **source.expansion.ehra-access-2025:** De Potter TJR, Valeriano C, Akerstrom
  F, Cassese S, Finlay M, Gupta D, Kautzner J, Miceli A, et al.; European Heart
  Rhythm Association, European Association of Percutaneous Cardiovascular
  Interventions, and ESC Working Group on Cardiovascular Surgery. *Vascular
  access and closure management for electrophysiological interventions in 2025:
  a Clinical Consensus Statement.* EP Europace. 2025;27(10):euaf115. Published
  October 14, 2025. doi:10.1093/europace/euaf115.
  https://academic.oup.com/europace/article/27/10/euaf115/8294206
  **Class/authority:** current multisociety clinical consensus; direct authority
  for ultrasound confirmation, individualized therapy, selected thrombin
  injection, and complicated-lesion exclusions. **Reuse:** CC BY-NC-ND 4.0.
  OUP's legal notice (updated September 3, 2026) generally prohibits AI use but
  expressly excepts uses allowed by an applicable Creative Commons license.
  Only independently expressed underlying facts are used; no adaptation or
  reproduction of source expression. Legal notice:
  https://academic.oup.com/pages/legal-notice
- **source.expansion.chae-pseudoaneurysm-2021:** Chae SY, Park C, Kim JK, Kim HO,
  Lee BC. *Ultrasound-Guided Percutaneous Thrombin Injection of Femoral Artery
  Pseudoaneurysms Caused by Vascular Access.* Journal of the Korean Society of
  Radiology. 2021;82(3):589-599. doi:10.3348/jksr.2020.0113.
  https://jksronline.org/pdf/10.3348/jksr.2020.0113
  **Class/authority:** retrospective, single-center study of 30 patients;
  independent cross-check for ultrasound diagnosis, lesion characterization,
  selected thrombin treatment, and complication boundaries. It is not a
  guideline and had incomplete follow-up, so it cannot support universal or
  numerical rules. **Reuse:** CC BY-NC 4.0; attribution required,
  noncommercial reuse only.

## Rights exclusions and authoring decisions

- **Exclude AAO-HNS and Wiley-hosted voice guidance.** The applicable AAO-HNS
  site terms explicitly prohibit transferring or using content with AI-based
  technologies; Wiley also carries an explicit AI-ingestion restriction. No
  facts from those pages are used here, and mirrors must not be sought to evade
  the terms.
- **Exclude the ACC postcatheterization pseudoaneurysm article.** ACC terms
  restrict automated retrieval and reuse. The EHRA/EAPCI/ESC CC-licensed
  consensus and Korean CC-licensed study supply the accepted factual basis.
- **Do not use the 2020 ESGE Zenker management recommendation as a gameplay key.**
  It is weak, low-quality, and unnecessary for the requested diagnostic/anatomy
  pair.
- **No overlap block:** lactational abscess is separate from uncomplicated cyst;
  EBSLN projection is separate from classic RLN hoarseness; Zenker is separate
  from distal esophageal dysphagia/achalasia; access pseudoaneurysm is separate
  from a true femoral aneurysm with AAA.

The first three candidate pairs are supportable within these constraints. The
largest evidence limitation is management certainty for lactational abscess
drainage; author it as a selected, uncomplicated image-guided source-control
decision with culture/antibiotic and breastfeeding context, not a universal
aspiration rule. **The access-pseudoaneurysm pair is source-supportable but was
rejected from this batch after curriculum review because it is only supplemental.**

## Replacement addendum: intermittent claudication / PAD

### Curriculum decision

This is the accepted replacement for access pseudoaneurysm. The exact public
SCORE locator is `Arterial Disease` → `Diseases/Conditions` → `Peripheral
Vascular Occlusive Disease`, **Common**, printed p. 14 / physical p. 15. The
current topic is broader than claudication, so the two detailed concepts are
inferred within that explicit family rather than claimed as separately named.
Invasive lower-extremity arterial procedures are listed separately as
**Uncommon**, which supports teaching stable claudication evaluation and initial
noninvasive care before intervention.

### Recommended two concepts

1. `claim.expansion.pad.resting-abi`: In an adult with exertional, non-joint calf
   discomfort that resolves with rest and examination findings suggestive of
   lower-extremity PAD, resting ankle-brachial index testing is an appropriate
   initial physiologic test to establish the diagnosis. A normal or high ABI can
   be misleading when ankle vessels are noncompressible, particularly in
   diabetes or chronic kidney disease; exercise ABI or toe-pressure evaluation
   may be needed when suspicion persists.
2. `claim.expansion.pad.structured-exercise`: For stable, functionally limiting
   intermittent claudication without rest pain, tissue loss, or acute ischemia,
   supervised exercise therapy or another structured exercise program is an
   initial treatment to improve walking performance, function, and quality of
   life. Risk-reduction treatment is already addressed in the case. Invasive
   revascularization is considered when claudication remains limiting despite
   guideline-directed medical therapy and structured exercise, rather than as
   the immediate next step for uncomplicated stable symptoms.

Keep the case within chronic stable claudication: reproducible exertional calf
symptoms, relief with rest, no ulcer or gangrene, no ischemic rest pain, no acute
change, and no limb threat. Do not use an ABI value as the sole measure of
functional limitation or imply that exercise normalizes ABI. Avoid prescribing
a universal program duration or medication regimen. A structured home/community
program is also evidence-based, but a supervised program gives the clearest
single board-style decision when it is available.

### Sources

- **source.expansion.nhlbi-pad-diagnosis-2022:** National Heart, Lung, and Blood
  Institute. *Peripheral Artery Disease — Diagnosis.* Last updated March 24,
  2022. https://www.nhlbi.nih.gov/health/peripheral-artery-disease/diagnosis
  **Class/authority:** US-government patient/professional education; direct
  support for symptom/examination context and ABI as the usual first diagnostic
  test, with exercise ABI and toe-brachial alternatives when resting ABI is
  insufficient. **Reuse:** US federal factual material is generally public
  domain; exclude third-party content, images, and agency marks and do not imply
  endorsement.
- **source.expansion.nhlbi-pad-treatment-2022:** National Heart, Lung, and Blood
  Institute. *Peripheral Artery Disease — Treatment.* Last updated March 24,
  2022. https://www.nhlbi.nih.gov/health/peripheral-artery-disease/treatment
  **Class/authority:** US-government guidance; direct support for supervised or
  structured home exercise and for reserving procedures or surgery until
  lifestyle change, exercise, and medical therapy are insufficient. **Reuse:**
  US federal factual material is generally public domain under the same limits.
- **source.expansion.sbacv-pad-2024:** Erzinger FL, Polimanti AC, Pinto DM, Murta
  G, Cury MV, da Silva RB, Biagioni RB, Belczak SQ, Joviliano EE, de Araujo WJB,
  de Oliveira JCP. *Brazilian Society of Angiology and Vascular Surgery
  guidelines on peripheral artery disease.* Jornal Vascular Brasileiro.
  2024;23:e20230059. doi:10.1590/1677-5449.202300592.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC11530000/
  **Class/authority:** current professional-society guideline and independent
  cross-check for ABI-based physiologic diagnosis, supervised exercise as
  initial claudication care, and the separation of stable claudication from
  chronic limb-threatening ischemia. **Reuse:** CC BY 4.0; attribution required.

### Excluded source

NICE CG147 is **excluded from the evidence set**. NICE's current open-content
license says AI use is not covered and requires a separate permission process;
no permission was available for this review. No clinical claim in this brief
relies on NICE content. The permitted NHLBI government pages and CC BY SBACV
guideline provide adequate support.
