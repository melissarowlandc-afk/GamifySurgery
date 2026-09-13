# Complex concept expansion source review — September 12, 2026

## Status and scope

This is a bounded source review for four proposed two-concept families. It is an
agent editorial artifact, not named-clinician approval. Any later clinical
content remains `needs_clinician_review`. Facts below are independently worded;
no source prose, tables, figures, algorithms, or questions are reproduced.

The existing admitted bank was searched for `GIST`, `stromal`, `hepatic
adenoma`, `mesenteric isch`, `aldosteron`, `adrenal venous`, and related terms.
No scored concept already teaches any of the eight proposed objectives. GIST
appears as an unrelated colonic-mass distractor, and candidate sheet row 105 is
not an authority. In particular, its implication that every high-risk 10 cm
KIT-mutant gastric GIST needs neoadjuvant treatment is rejected.

## SCORE 2025–2026 scope mapping

Source: Surgical Council on Resident Education (SCORE), *General Surgery
Curriculum Outline, 2025–2026*. Official PDF:
https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf
(accessed 2026-09-12). The locally verified outline is 27 physical PDF pages,
SHA-256 `2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.
The outline is publicly readable but copyrighted; use is limited to factual
scope/location verification and citation.

| Family | Exact outline path | Depth | Locator | Interpretation |
| --- | --- | --- | --- | --- |
| Gastric GIST | Stomach → Diseases/Conditions → Gastrointestinal Stromal and Neuroendocrine Tumors and Lymphomas | Common | printed p. 6; physical PDF p. 7 | Family is explicit. EUS/core sampling criteria, molecular testing, and neoadjuvant selection are inferred details. |
| Hepatic adenoma | Liver → Diseases/Conditions → Primary Hepatic Neoplasms | Common | printed p. 4; physical PDF p. 5 | Adenoma is not named separately; inclusion within the explicit family is inferred. |
| Chronic mesenteric ischemia | Arterial Disease → Operations/Procedures → Procedures for Mesenteric Occlusive Disease | Uncommon | printed p. 15; physical PDF p. 16 | The outline separately names *Acute Mesenteric Ischemia* under Small Intestine (Common; printed p. 6, physical p. 7). Do not use that acute locator for this chronic objective. Chronic CTA/referral detail is inferred from the uncommon procedure topic. |
| Primary aldosteronism | Endocrine → Diseases/Conditions → Primary Aldosteronism; Endocrine → Operations/Procedures → Adrenalectomy | Common disease; Uncommon operation | printed p. 10; physical PDF p. 11 | Disease family is explicit. ARR preparation and CT/AVS sequencing are inferred details. |

SCORE depth is curricular scope, not a claim about examination frequency.

## Accepted objectives and atomic facts

### Gastric GIST

**Objective 1 — obtain tissue when it will change immediate planning.** In a
stable adult with a gastric subepithelial mass whose imaging diagnosis is
uncertain, or with a locally advanced lesion for which preoperative systemic
therapy is being considered, EUS-guided tissue acquisition is appropriate.
Core biopsy is preferred to cytology-only aspiration when feasible because
histology and molecular characterization require adequate tissue. A readily
resectable lesion with characteristic imaging does not automatically require
preoperative biopsy. Percutaneous biopsy is not the default when EUS is
feasible because tumor disruption or intraperitoneal spill must be avoided.

**Objective 2 — select neoadjuvant imatinib by anatomy and genotype.** Complete
resection remains standard for localized, technically resectable GIST. A large
or locally advanced gastric GIST is not, by size or mitotic activity alone, an
automatic indication for neoadjuvant imatinib. A defensible case requires
multidisciplinary judgment that shrinkage could make an otherwise morbid or
function-sacrificing resection safer, tissue confirmation, and an
imatinib-sensitive molecular result before treatment. Resistant genotypes,
including PDGFRA D842V and many KIT/PDGFRA-wild-type tumors, exclude the keyed
imatinib plan. The objective should stop at referral/planning and should not
teach dose, duration, response interval, or adjuvant duration.

**Case boundary.** Use a nonmetastatic gastric mass that is difficult to resect
without major adjacent-organ or gastric-function loss. The first result can
report a GIST-compatible core and an imatinib-sensitive mutation. Do not report
a definitive mitotic-risk category from a limited core, and do not use an
incidentally found small lesion where surveillance and resection are both
reasonable.

Atomic claim IDs proposed for later content:

- `claim.gastric-gist.selected-tissue-acquisition`: EUS core sampling is
  appropriate when diagnosis/molecular data are needed for a locally advanced
  gastric subepithelial lesion; routine biopsy is not required before every
  straightforward resection. Supported by `source.geis-gist-2023`.
- `claim.gastric-gist.mutation-guided-neoadjuvant-planning`: neoadjuvant
  imatinib is a multidisciplinary option when tumor shrinkage is expected to
  reduce operative morbidity and an imatinib-sensitive genotype is confirmed;
  tumor size alone is insufficient. Supported by `source.geis-gist-2023` and
  `source.nci-gist-pdq-2024`.

### Hepatic adenoma

**Objective 1 — characterize with multiphasic MRI.** In a stable patient with
an indeterminate solid liver lesion and no established malignant diagnosis,
multiphasic liver MRI is the preferred cross-sectional study for distinguishing
hepatic adenoma from other focal liver lesions. MRI can support some adenoma
subtypes, but imaging cannot reliably identify every molecular subtype or
exclude malignancy in every indeterminate lesion. Atypical cases belong in a
multidisciplinary review rather than an automatic biopsy pathway.

**Objective 2 — select resection by sex, size, and growth.** Resection is
recommended for hepatic adenoma in men regardless of size. In women, exogenous
hormone withdrawal and weight management when applicable precede reassessment;
an adenoma at least 5 cm that persists after an observation period, or one that
continues to grow, supports resection. A proven beta-catenin-activated adenoma
also favors resection regardless of size. A clean teaching case should use one
clear branch, preferably a man with an MRI-characterized adenoma or a woman
with a lesion remaining at least 5 cm/growing after risk-factor modification.
Do not imply that all adenomas require surgery.

**Case boundary.** Stable outpatient, no active hemorrhage, no cirrhosis or
known extrahepatic cancer, and no imaging features that already establish
malignancy. If using the female branch, state that hormone exposure and weight
risk have already been addressed and that interval reassessment is complete.
Do not turn surveillance interval into the tested fact unless separately
approved.

Atomic claim IDs proposed for later content:

- `claim.hepatic-adenoma.mri-characterization`: multiphasic MRI is preferred
  for suspected hepatic adenoma and has important subtype/malignancy limits.
  Supported by `source.acg-focal-liver-2024`, cross-checked against
  `source.easl-benign-liver-summary-2020`.
- `claim.hepatic-adenoma.selected-resection`: resection selection depends on
  sex, lesion size, molecular risk when known, and growth after risk-factor
  modification; surgery is not universal. Supported by both liver sources.

### Chronic mesenteric ischemia

**Objective 1 — use CTA after compatible clinical evaluation.** In a stable
adult with reproducible postprandial abdominal pain, reduced intake or weight
loss, atherosclerotic risk, and reasonable exclusion of common alternatives,
CTA is the principal anatomic test for suspected occlusive chronic mesenteric
ischemia. Duplex ultrasound can screen in experienced hands but does not
replace CTA for treatment planning. Catheter angiography is reserved mainly
for treatment or unresolved anatomy rather than the routine first diagnostic
test.

**Objective 2 — refer confirmed symptomatic multivessel disease for
revascularization planning.** Compatible symptoms plus significant celiac and
superior mesenteric arterial disease make occlusive chronic mesenteric ischemia
highly likely and generally do not require a functional confirmation test.
Symptomatic occlusive disease warrants prompt multidisciplinary vascular
assessment for revascularization. The question should not force a specific
open versus endovascular method, device, or target-vessel sequence; anatomy,
comorbidity, and local expertise determine those choices.

**Case boundary.** Stable chronic symptoms without peritonitis, acute severe
pain, lactate-driven emergency framing, embolic presentation, bowel necrosis,
or nonocclusive disease. Return concrete multivessel CA/SMA stenotic disease
and document that alternative GI causes have been evaluated. Avoid teaching an
exact stenosis threshold unless the final case and clinician review explicitly
need it.

Atomic claim IDs proposed for later content:

- `claim.chronic-mesenteric-ischemia.cta`: CTA is the key anatomic diagnostic
  study in suspected occlusive chronic mesenteric ischemia. Supported by
  `source.european-cmi-2020`, `source.svs-cmi-2021`, and current procedural
  cross-check `source.cirse-mesenteric-2025`.
- `claim.chronic-mesenteric-ischemia.revascularization-referral`: confirmed
  symptomatic multivessel occlusive disease warrants expert vascular review
  for revascularization; the concept does not select a particular technique.
  Supported by all three CMI sources.

### Primary aldosteronism

**Objective 1 — screen with aldosterone, renin, ARR, and an interpretable
potassium/medication context.** Screening measures plasma or serum aldosterone
and renin and derives the aldosterone-to-renin ratio. Potassium is measured to
interpret aldosterone because hypokalemia can suppress it and create a false
negative. Interfering antihypertensive drugs must be reviewed and managed using
a safe, feasible strategy; blanket medication withdrawal is inappropriate.
Use local assay interpretation rather than teaching one universal numerical
cutoff.

**Objective 2 — use adrenal CT plus AVS before lateralized surgery in an
appropriate adult.** A patient with confirmed primary aldosteronism who wants
and is a candidate for adrenalectomy generally undergoes adrenal CT and adrenal
venous sampling before choosing unilateral surgery, because AVS distinguishes
lateralizing from bilateral secretion more reliably than CT alone. The narrow
exception for a very young person with marked biochemical disease,
hypokalemia, and a clear unilateral adrenal adenoma should not be included in
the case. Patients who do not want surgery or are not operative candidates can
follow medical management and should not be forced through AVS.

**Case boundary.** Stable hypertensive adult old enough that the guideline's
young-patient exception does not apply. Node one must state potassium and
medication review/adjustment rather than presenting ARR as context-free. Node
two follows biochemical confirmation and informed interest in surgery; it asks
for localization planning, not whether the patient has primary aldosteronism.
Do not teach exact withdrawal periods, ARR cutoffs, AVS indices, or drug doses.

Atomic claim IDs proposed for later content:

- `claim.primary-aldosteronism.arr-screening`: aldosterone plus renin/ARR is
  the screening approach, interpreted with potassium and safely managed
  medication interference. Supported by `source.endocrine-pa-2025`.
- `claim.primary-aldosteronism.ct-avs-localization`: candidates considering
  adrenalectomy generally need adrenal CT plus AVS before lateralized surgical
  treatment, subject to a narrow young-patient exception. Supported by
  `source.endocrine-pa-2025`.

Only one adequate, current primary guideline was retained for the two primary
aldosteronism claims. That limitation must remain explicit in later evidence
records.

## Source records

### `source.geis-gist-2023`

- Citation: Serrano C, Martín-Broto J, Asencio-Pascual JM, López-Guerrero JA,
  Rubió-Casadevall J, Bagué S, García-del-Muro X, Fernández-Hernández JA,
  Herrero L, López-Pousa A, Poveda A, Martínez-Marín V; GEIS. 2023 GEIS
  Guidelines for gastrointestinal stromal tumors. *Therapeutic Advances in
  Medical Oncology*. 2023;15:17588359231192388.
- DOI/URLs: https://doi.org/10.1177/17588359231192388 ; official GEIS PDF
  https://grupogeis.org/documentos/guias-geis/2023-GEIS-guidelines-for-GIST.pdf ;
  indexed open article https://pmc.ncbi.nlm.nih.gov/articles/PMC10467260/
- Date/authority: published 2023-08-24; multidisciplinary Spanish Group for
  Sarcoma Research clinical guideline; primary authority for both objectives.
- Reuse: © authors 2023, CC BY-NC 4.0; attribution and noncommercial-use limits
  apply. Targeted factual extraction only; no protected expression retained.
- Limits: evidence for neoadjuvant treatment is selective and
  multidisciplinary; limited biopsy cannot establish definitive mitotic-risk
  classification. Accessed 2026-09-12.

### `source.nci-gist-pdq-2024`

- Citation: PDQ Adult Treatment Editorial Board. *Gastrointestinal Stromal
  Tumors Treatment (PDQ®): Health Professional Version*. Bethesda, MD:
  National Cancer Institute. Latest displayed update 2024-12-13.
- URL: https://www.cancer.gov/types/soft-tissue-sarcoma/hp/gist-treatment-pdq
- Authority/use: peer-reviewed federal evidence summary and independent
  cross-check, not a formal NCI policy or clinical-practice guideline.
- Reuse: NCI text may be reused with credit; PDQ trademark and third-party
  images have separate restrictions. Reuse policy reviewed 2025-03-12:
  https://www.cancer.gov/policies/copyright-reuse . No images used.
- Limits: supports selective marginally resectable/organ-preserving use and
  genotype review; it does not support a blanket size rule. Accessed
  2026-09-12.

### `source.acg-focal-liver-2024`

- Citation: Frenette C, Mendiratta-Lala M, Salgia R, Wong RJ, Sauer BG, Pillai
  A. ACG Clinical Guideline: Focal Liver Lesions. *American Journal of
  Gastroenterology*. 2024;119(7):1235–1271. Epub 2024-01-26.
- DOI/official URLs: https://doi.org/10.14309/ajg.0000000000002857 ; ACG
  guideline listing https://gi.org/guidelines/ ; official ACG highlights
  https://gi.org/wp-content/uploads/2025/04/GuidelineHighlight_FLL.pdf
- Authority: current American College of Gastroenterology clinical guideline;
  primary authority for MRI characterization and selected management.
- Reuse: © 2024 American College of Gastroenterology, all rights reserved.
  Public access does not grant redistribution; use is limited to targeted fact
  verification and citation. No source prose or visual content is reused.
- Limits: recommendations are conditional and patient selection remains
  individualized. Accessed 2026-09-12.

### `source.easl-benign-liver-summary-2020`

- Citation: Colombo M. EASL Clinical Practice Guidelines on the Management of
  Benign Liver Tumors. *Clinical Liver Disease (Hoboken)*. 2020;15(4):133–135.
  DOI: https://doi.org/10.1002/cld.933 . It identifies and summarizes the EASL
  2016 guideline, *Journal of Hepatology*. 2016;65:386–398,
  DOI https://doi.org/10.1016/j.jhep.2016.04.001 .
- Public record: https://pmc.ncbi.nlm.nih.gov/articles/PMC7206317/
- Authority/use: society-guideline summary used only as an independent
  cross-check for MRI and sex/size/growth selection.
- Reuse: © 2020 AASLD; reproduced EASL recommendations carry © 2016 EASL and
  explicit permission language. Treat as copyrighted targeted factual
  verification, not reusable open content. The linked Wiley host was not
  opened or used because its current terms prohibit AI ingestion.
- Limits: older than the 2024 ACG guideline and not an independent systematic
  update. Accessed 2026-09-12.

### `source.european-cmi-2020`

- Citation: Terlouw LG, Moelker A, Abrahamsen J, Acosta S, Bakker OJ,
  Baumgartner I, Boyer L, Corcos O, van Dijk LJD, Duran M, Geelkerken RH,
  Illuminati G, Jackson RW, Kärkkäinen JM, Kolkman JJ, Lönn L, Mazzei MA,
  Nuzzo A, Pecoraro F, Raupach J, Verhagen HJM, Zech CJ, van Noord D, Bruno MJ.
  European guidelines on chronic mesenteric ischaemia. *United European
  Gastroenterology Journal*. 2020;8(4):371–395. Published 2020-04-16.
- DOI/URL: https://doi.org/10.1177/2050640620916681 ;
  https://pmc.ncbi.nlm.nih.gov/articles/PMC7226699/
- Authority: joint multidisciplinary European clinical guideline; primary
  authority for compatible-history plus imaging diagnosis, CTA, and
  multivessel reasoning.
- Reuse: © authors 2020, CC BY-NC 4.0; attribution and noncommercial limits
  apply.
- Limits: several recommendations rely on low-quality observational evidence
  and expert agreement; the content should test referral, not a single device
  or approach. Accessed 2026-09-12.

### `source.svs-cmi-2021`

- Citation: Huber TS, Björck M, Chandra A, Clouse WD, Dalsing MC, Oderich GS,
  Smeds MR, Murad MH. Chronic mesenteric ischemia: Clinical practice guidelines
  from the Society for Vascular Surgery. *Journal of Vascular Surgery*.
  2021;73(1 Suppl):87S–115S. Epub 2020-11-07.
- DOI/public record: https://doi.org/10.1016/j.jvs.2020.10.029 ;
  https://pubmed.ncbi.nlm.nih.gov/33171195/
- Authority/use: primary SVS guideline; the publicly readable PubMed abstract
  independently supports expedited CTA workup and revascularization.
- Reuse: © 2020 Society for Vascular Surgery/Elsevier, all rights reserved.
  Only public bibliographic metadata and abstract-level facts were used; no
  publisher full text or protected expression was ingested.
- Limits: abstract-level cross-check cannot support detailed technique rules.
  Accessed 2026-09-12.

### `source.cirse-mesenteric-2025`

- Citation: Loffroy R, Basile A, Dósa E, Maleux G, Peynircioglu B, Chevallier O.
  CIRSE Standards of Practice for the Interventional Radiology Management of
  Acute and Chronic Arterial Mesenteric Ischaemia. *Cardiovascular and
  Interventional Radiology*. 2025;48(8):1091–1103. Published online
  2025-07-10.
- DOI/URLs: https://doi.org/10.1007/s00270-025-04080-0 ; official society index
  https://www.cirse.org/publications/standards-of-practice/cirse-documents/ ;
  https://pmc.ncbi.nlm.nih.gov/articles/PMC12325428/
- Authority/use: current CIRSE standards-of-practice document and procedural
  cross-check. It expressly is not a systematic review or clinical-practice
  guideline, so it does not replace the European/SVS guidelines.
- Reuse: © authors 2025, CC BY 4.0; attribution/link/change-notice requirements
  apply.
- Limits: interventional-radiology scope; use only to confirm CTA remains
  essential and symptomatic multivessel disease enters revascularization
  planning. Accessed 2026-09-12.

### `source.endocrine-pa-2025`

- Citation: Adler GK, Stowasser M, Correa RR, Khan N, Kline G, McGowan MJ,
  Mulatero P, Murad MH, Touyz RM, Vaidya A, Williams TA, Yang J, Young WF,
  Zennaro MC, Brito JP. Primary Aldosteronism: An Endocrine Society Clinical
  Practice Guideline. *Journal of Clinical Endocrinology & Metabolism*.
  2025;110(9):2453–2495. DOI: https://doi.org/10.1210/clinem/dgaf284 .
- Official society page: https://www.endocrine.org/clinical-practice-guidelines/primary-aldosteronism-2
  (published/last updated 2025-07-14); metadata:
  https://pubmed.ncbi.nlm.nih.gov/40658480/
- Authority: current Endocrine Society guideline, co-sponsored by endocrine and
  hypertension societies; primary authority for both objectives.
- Reuse: © Endocrine Society 2025, all rights reserved. The public Endocrine
  Society recommendation page and PubMed metadata were used for targeted fact
  verification. The OUP full article was not ingested or relied upon.
- Limits: screening and CT/AVS recommendations are conditional and require
  individual feasibility, surgical preference/candidacy, assay context, and
  recognition of the narrow young-patient AVS exception. Accessed 2026-09-12.

## Editorial recommendation

All eight objectives are source-defensible within the stated case boundaries.
The main risks are overgeneralization: biopsy and neoadjuvant imatinib are not
universal for gastric GIST; resection is not universal for hepatic adenoma;
chronic mesenteric ischemia must not be framed as an acute abdomen; and CT alone
does not ordinarily establish adrenal lateralization for a surgical candidate.
The GIST, hepatic-adenoma, and primary-aldosteronism pairs are within explicit
Common SCORE families. Chronic mesenteric ischemia is the weakest board-scope
match because only the mesenteric occlusive procedure family is explicit and
is Uncommon; retain it only if the owner accepts that inferred scope.
