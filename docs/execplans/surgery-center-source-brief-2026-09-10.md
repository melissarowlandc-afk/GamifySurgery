# Surgery-center batch: original content and source brief

Owner authority: independently create, review, and implement twenty additional
concepts (2026-09-10). Active plan:
`docs/execplans/implement-surgery-center-concepts-2026-09-10.md`.
This is authoring guidance and metadata, not clinician approval or copied source
text. All runtime authoring records remain `needs_clinician_review` with null
named-clinician review. A separate owner-delegated agent receipt records exact
editorial acceptance. No public clinical release is authorized.

## Product and roster decisions

Ten families, two distinct concepts each, four original two-node patients per
family: exactly 20 concepts, 80 variants, 40 multi-step encounters. Eight families
use a genuine service gate between questions (32 gates); fissure and pilonidal
care use clinical examination without unnecessary testing.
All cases are stable outpatient evaluation, planning, or follow-up. Procedure
planning does not imply that definitive OR surgery is performed in a Level1
clinic. Levels0-2 remain the playable scope; Level3 stays locked.

Stable meanings (IDs may use the exact suggested suffixes below; do not rename
after authoring without root review):

1. `concept.thyroid-nodule.fna-selection`
2. `concept.thyroid-nodule.follicular-invasion-histology`
3. `concept.primary-hyperparathyroidism.biochemical-confirmation`
4. `concept.primary-hyperparathyroidism.symptomatic-surgery-assessment`
5. `concept.inguinal-hernia.equivocal-exam-ultrasound`
6. `concept.inguinal-hernia.symptomatic-elective-repair`
7. `concept.anal-fissure.acute-recognition`
8. `concept.anal-fissure.initial-conservative-care`
9. `concept.internal-hemorrhoids.anoscopy-evaluation`
10. `concept.internal-hemorrhoids.office-banding-selection`
11. `concept.esophageal-dysphagia.upper-endoscopy`
12. `concept.barrett-esophagus.intestinal-metaplasia`
13. `concept.achalasia.high-resolution-manometry`
14. `concept.achalasia.manometric-recognition`
15. `concept.pigmented-skin-lesion.complete-diagnostic-biopsy`
16. `concept.melanoma.sentinel-node-staging`
17. `concept.postoperative-seroma.ultrasound-characterization`
18. `concept.postoperative-seroma.uncomplicated-observation`
19. `concept.pilonidal-disease.chronic-sinus-recognition`
20. `concept.pilonidal-disease.off-midline-closure-planning`

Terra's active/deferred semantic inventory found these additive with the stated
boundaries. Generic abscess incision/drainage was rejected because
`concept.prototype.abscess.primary-treatment` already tests it. Preserve the
existing FHH workup/recognition/no-surgery meanings, Graves and MEN2A sequencing,
deferred direct-inguinal operative anatomy, ventral-hernia pulmonary optimization,
gastroparesis gastric-emptying evaluation, and phyllodes nodal-staging exception.

## Shared authoring requirements

- New files live under `packages/clinical-content/src/development-batch/2026-09-10/`.
  Copy/adapt the prior helper locally; never edit the Sept9 hash-bound helper or
  imports to old clinical families. Version `development-batch.2026-09-10.1`;
  source/claim check date `2026-09-10`. New generic helper names may mirror prior
  helper interfaces, but all dates and provenance must be truthful.
- Each question is a current patient presentation using `{name}` and clinically
  relevant history/findings, not a decontextualized adult or definition quiz.
  Use several plausible ages and sex/profile choices where clinically valid;
  preserve game-generated name and appearance matching, and don't embed age,
  name, or inconsistent gendered pronouns in fixed text. Race never selects disease.
- Four variants should vary the clinical story, setting/detail or patient concern,
  not merely one adjective or name. Keep one primary scored concept per node.
  Return results only after the ordered service, with a meaningful current-update
  narrative before the second question. No future pathology in the intake chart.
- All choices shuffle. Four plausible parallel choices of comparable length and
  specificity; no consistently longest key. Explain boundaries in the explanation
  rather than giving the correct option extra qualifying text.
- Synthetic ages, normal vital signs and workflow ticks are editorial simulation
  values, not disease prevalence, diagnostic thresholds, or clinical turnaround.
  Avoid unsourced exact treatment doses, intervals, thresholds, or probabilities.
- Every material clinical statement, including necessary exclusion/limitation
  rationale, maps to an independently written atomic claim and accepted source.
  Source records include authors, year/date where known, title, organization or
  journal, DOI/URL, source class, medical authority, rights and intended use,
  supported claim IDs. Undated pages use null year, not website copyright year.

## Accepted first authoring milestone: endocrine and groin hernia

### Thyroid nodule (4 cases, 8 variants)

Intake: a referred thyroid nodule, normal TSH, suspicious ultrasound findings
explicitly meeting accepted biopsy criteria. Avoid unsupported size cutoffs by
stating that the radiology report recommends FNA. No immediate airway compromise
or uninvestigated thyrotoxicosis. First question selects ultrasound-guided thyroid
FNA. Gate `service.thyroid_fna` / `route.thyroid_fna.outsourced` (new honest external
contract, to be added at integration). Cytology returns a follicular neoplasm.
Second question asks which tissue finding distinguishes a follicular adenoma
from carcinoma: capsular or vascular invasion on histologic evaluation. Do not
teach that cytology alone or another cytology sample proves that invasion, or
that every indeterminate nodule mandates immediate lobectomy. Molecular testing
can refine risk and influence individualized management; invasion itself requires
histologic assessment. Four cases can vary discovery/referral and concerns while
maintaining the same valid workup stage.

Accepted sources directly checked by Astra:

- `source.sc.ata-thyroid-nodules`: American Thyroid Association. Thyroid Nodules.
  Institutional author; article undated (year null). Patient education, current
  public page accessed 2026-09-10. https://www.thyroid.org/thyroid-nodules/ .
  Supports TSH/ultrasound evaluation and FNA cytology after appropriate selection.
- `source.sc.ata-thyroid-cytopathology`: American Thyroid Association. Quality
  Assurance in Thyroid Cytopathology. Institutional author unless the source
  identifies a named author; undated (year null). Professional laboratory guidance.
  https://www.thyroid.org/professionals/laboratory-services-library/quality-assurance-cytopathology/ .
  Supports limitation of follicular cytology and capsular/vascular histology.
- Both are copyrighted society educational guidance used only for targeted facts
  and citations. Terms reviewed at
  https://www.thyroid.org/about-american-thyroid-association/terms-of-use/ . No
  source prose/tables/images reused. Medical authority is society education,
  not a newly verified guideline; two pages from the same society are not an
  independent cross-check. Record this limitation. Do not adopt outdated blanket
  statements about total/completion thyroidectomy, exact malignancy rates, or
  Bethesda thresholds from these pages.

### Primary hyperparathyroidism (4 cases, 8 variants)

Intake: prior hypercalcemia with kidney stone or fragility-fracture history;
now referred for endocrine surgical evaluation. Renal function/vitamin D and
medication context are already reviewed; inherited mimic evaluation has already
been performed and does not support FHH (e.g. prior urinary calcium not reduced,
previous normal calcium/family evaluation in context). Do not imply urine calcium
alone absolutely excludes FHH. First question selects repeat serum calcium with
intact PTH to establish the biochemical pattern before localization. Use
`service.basic_labs`, routes `route.basic_labs.outsourced` and
`route.basic_labs.phlebotomy_sendout`. Gate returns persistent hypercalcemia with
inappropriately nonsuppressed/elevated PTH; do not invent unrelated tests in the
result. Second question integrates confirmed PHPT with renal/bone involvement
to recommend parathyroid surgical assessment/planning. No universal surgical
rule for every PTH elevation; no localization-as-diagnosis; no emergency treatment
of severe symptomatic hypercalcemia in this stable clinic setting.

Accepted source directly checked by Astra:

- `source.sc.niddk-primary-hyperparathyroidism`: National Institute of Diabetes
  and Digestive and Kidney Diseases. Primary Hyperparathyroidism. Last reviewed
  March2019 (2019). Government patient education; institutional author, acknowledged
  reviewer John P. Bilezikian MD. Official URL
  https://www.niddk.nih.gov/health-information/endocrine-diseases/primary-hyperparathyroidism .
  Accessed 2026-09-10. Supports biochemical diagnosis, FHH differential evaluation,
  kidney/bone complications, surgery, and localization as planning. Government
  factual material; NIDDK copyright terms reviewed at
  https://www.niddk.nih.gov/copyright (May2024); third-party images/logos excluded.
  A society cross-check is pending root verification; record single-source
  management limitation if none is accepted. Do not fabricate guideline status.

### Equivocal symptomatic inguinal hernia (4 cases, 8 variants)

Intake: intermittent groin bulge or activity-related discomfort; current physical
exam equivocal, without incarceration/obstruction/strangulation symptoms. An
experienced dynamic ultrasound service is available. First question selects
targeted dynamic groin ultrasound to clarify anatomy. An obvious hernia generally
does not need routine imaging; ultrasound performance is operator-dependent and
negative/nondiagnostic findings can warrant MRI or CT according to context.
Use `service.ultrasound`, `route.ultrasound.outsourced` and
`route.ultrasound.in_house`. Returned study confirms reducible inguinal hernia,
and patient describes meaningful activity limitation. Second question selects
elective repair discussion/planning. Avoid treating watchful waiting in minimally
symptomatic men as the default for these symptomatic cases. No universal repair
technique, mesh or operative-anatomy teaching. In women, keep femoral hernia in
the differential; a positive case explicitly confirms inguinal anatomy and the
assessment includes femoral region. Do not claim ultrasound rules out all femoral
hernias. Stated male-only profiles are also reasonable if needed for coherence.

Accepted guideline directly checked by Astra:

- `source.sc.herniasurge-2018`: The HerniaSurge Group. International guidelines
  for groin hernia management. Hernia.2018;22(1):1-165. Published 2018-01-12.
  DOI10.1007/s10029-017-1668-x. PMID29330835.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/ . Accessed2026-09-10.
  International society evidence-based guideline; diagnosis chapter acknowledges
  weak evidence around equivocal/occult imaging. Supports exam-first, selected
  ultrasound, further imaging after nondiagnostic studies, and symptomatic repair.
  Article explicitly CC BY-NC4.0 (https://creativecommons.org/licenses/by-nc/4.0/).
  Attribute source/license and state that claims/questions are original factual
  synthesis; local noncommercial development only, commercial reuse needs review.
- NIDDK inguinal-hernia government page is an independent cross-check pending
  final targeted root read/date extraction. Do not cite unverified snippets.

## Remaining source acceptance and case boundaries

The six anorectal/pilonidal concepts have a Sol read-only clinical/source handback;
root is confirming accessible source locations and host AI-use restrictions.
Remaining metadata and accepted facts will be appended before their authoring
milestone. No generic abscess-drainage replacement may enter the roster.

The upper-GI families use EGD for persistent dysphagia followed by a Barrett
biopsy interpretation, and HRM after structural obstruction is excluded followed
by achalasia physiology interpretation. Do not imply Barrett metaplasia itself
causes obstructive dysphagia; a compatible accompanying benign peptic narrowing
may be described after EGD. Use generic EGD, never celiac duodenal-biopsy service.

Melanoma uses a skin-specific complete excisional diagnostic biopsy followed by
pathology-dependent discussion of sentinel-node staging in intermediate-thickness,
clinically node-negative melanoma. Distinguish diagnostic narrow excision from
definitive wide excision. A superficial shave can lose staging information;
do not falsely prohibit every deep saucerization technique.

Seroma cases are follow-up after benign breast excision to match the directly
verified UCLA breast-imaging source. Ultrasound clarifies an uncertain superficial
collection, then a simple small asymptomatic collection without infection, wound
tension or implant is observed. Do not aspirate just to force a procedure.

## Excluded sources and evidence limits

Wiley Online Library terms explicitly prohibit AI ingestion/analysis/processing.
The PHPT Fifth International Workshop article was therefore excluded; no alternate
mirror is used to evade those terms. No proprietary textbook, UpToDate, StatPearls
corpus, commercial bank, NCCN mirror or recalled ABSITE questions is an input.
Inaccessible search snippets are discovery only, not evidence. Full source text,
source excerpts, images and tables are not stored in this repository.

Curriculum relevance only: American Board of Surgery. General Surgery Content
Outline for ABS In-Training Examination (ABSITE), updated01/2021, retrieved
2026-09-10, https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/ .
Its endocrine, hernia, alimentary/esophageal/anorectal, skin/soft-tissue and
perioperative categories support topic selection. No inference about exact exam
frequency of these twenty individual concepts is claimed.

## Final accepted-source addendum (2026-09-10)

This addendum supersedes all pending-source statements above. All links below
were directly read by Astra, with targeted key facts and rights checked; Sol's
source investigation informed selection but its subsequently withdrawn references
are not accepted. Evidence authority remains separate from reuse permissions.

### Additional first-milestone metadata

- Correct ATA professional source title: **Quality Assurance in Cytopathology and
  Histopathology of the Thyroid**. No named author/date found; institutional ATA,
  year null, same URL and limited professional-education scope as above.
- `source.sc.aaes-phpt-treatment`: American Association of Endocrine Surgeons.
  Hyperparathyroidism Treatment. Patient education, institutional author, undated
  (year null), https://endocrinediseases.org/parathyroid/hyperparathyroidism-treatment/ .
  Copyright AAES, targeted original factual synthesis/citation only, no open
  license or reproduction. Directly corroborates symptomatic kidney stones and
  fragility fractures as reasons to favor parathyroid surgery. Important source
  limitation: this undated page still cites the 2014 workshop for asymptomatic
  criteria; none of its asymptomatic cutoffs, percentages, surveillance intervals,
  drug regimens, costs or long-term outcome claims is used. Cross-check only for
  symptomatic management with NIDDK, not a current verified formal guideline.
- `source.sc.niddk-inguinal-hernia`: NIDDK. Inguinal Hernia. Last reviewed
  September2019 (year2019), government patient education, institutional author,
  acknowledged reviewer Neal E. Seymour MD.
  https://www.niddk.nih.gov/health-information/digestive-diseases/inguinal-hernia .
  Independently published government cross-check for selected imaging after an
  unclear examination, elective repair, and watchful waiting limited to men with
  few/no symptoms. It cites HerniaSurge, so not independent underlying trial
  evidence. Government copyright conditions above; no timeline or rate adopted.

### Anal fissure: accepted 2 concepts / 4 patients

Recent painful defecation, scant bright-red blood, and a superficial midline tear
seen on gentle inspection support an acute fissure. No chronic scar/sentinel
tag, lateral/multiple/painless lesion, or infection. First node identifies the
cause of the patient's presentation. Second node asks initial conservative care:
fiber, sufficient fluids, and comfortable soft formed stools with sitz baths.
No artificial service gate. Persistent or atypical symptoms merit reassessment;
do not assert that all rectal bleeding is explained by the tear. No exact grams,
duration cutoff, bath schedule, medication concentration or healing percentage.

- `source.sc.siucp-fissure-2023`: Brillantino A, Renzi A, Talento P, Iacobellis F,
  Brusciano L, Monaco L, Izzo D, Giordano A, Pinto M, Fantini C, Gasparrini M,
  Schiano Di Visconte M, et al. The Italian Unitary Society of Colon-proctology
  (SIUCP: Societa Italiana Unitaria di Colonproctologia) guidelines for the
  management of anal fissure. BMC Surgery.2023;23:311. Published2023-10-13.
  DOI10.1186/s12893-023-02223-z. Direct readable society-hosted article:
  https://www.siucp.eu/public/documenti/638659057322833204_linee-guida-ragadi.pdf .
  Society GRADE guideline; supports recognition, inspection, no routine testing
  in classic acute disease, and initial conservative care (moderate evidence).
  CC BY4.0, https://creativecommons.org/licenses/by/4.0/ ; original independently
  written factual synthesis with attribution; no copied article expression.
- `source.sc.ascrs-fissure-patient`: ASCRS. Anal Fissure Expanded Information.
  Society patient education, institutional author, undated (year null).
  https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Anal-Fissure-Expanded-Information.aspx .
  Copyright ASCRS; targeted factual verification/citation only. Corroborates
  presentation/conservative care; lower authority than formal CPG, date unknown.

### Internal hemorrhoids: accepted 2 concepts / 4 patients

Stable painless bleeding/prolapse persists despite fiber and bowel-habit care.
Patient is already appropriately evaluated for upstream colorectal causes,
screening is addressed, and no new alarm symptoms/iron-deficiency anemia are
present. Focused history, external inspection/digital exam are done but local
canal anatomy remains unconfirmed. First node selects anoscopy, then a real
`service.anoscopy` / `route.anoscopy.outsourced` gate returns internal hemorrhoids
with prolapse reducing spontaneously and no significant external component.
Second node selects office rubber-band ligation counseling/planning. No bleeding
disorder, antithrombotic complication, active infection or other condition that
makes office therapy inappropriate. Do not teach automatic colonoscopy repetition
after an already adequate workup, or attribute every rectal bleed to hemorrhoids.
Do not put infrared coagulation or sclerotherapy among otherwise equally valid
alternatives and claim banding is uniquely correct without supporting context.
Do not label ASCRS patient information as the inaccessible 2024 guideline or
claim a verified strongest-office-treatment recommendation from that guideline.

- `source.sc.ascrs-hemorrhoids-patient`: ASCRS. Hemorrhoids Expanded Information.
  Society patient education, institutional author, undated (year null).
  https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Hemorrhoids-Expanded-Information.aspx .
  Supports anoscopy, evaluation for other bleeding causes, conservative therapy,
  and banding for appropriate internal disease. Copyright ASCRS; targeted facts
  only. Source/date/authority limitation explicit: patient guidance, no verified
  formal current CPG in this batch. Page's procedural doses/times not adopted.
- `source.sc.niddk-hemorrhoids-treatment`: NIDDK. Treatment of Hemorrhoids.
  Government patient education, institutional author. Last reviewedOctober2016
  (2016). https://www.niddk.nih.gov/health-information/digestive-diseases/hemorrhoids/treatment .
  Supports office RBL for bleeding/prolapsing internal hemorrhoids, and more
  invasive therapy for selected refractory/large external disease. Government
  copyright conditions above. Independent factual cross-check, not a new CPG.
  No claim that alternative office modalities are invalid.

ASCRS patient-library rights policy directly checked:
https://www.fascrs.org/Web/My-ASCRS/ASCRS-Access-to-and-Use-of-Works-Policy.aspx .
Public educational access with copyright, no copied content, no AI prohibition
identified in this policy. This does NOT override ASCRS U/Unbound restrictions.

### Dysphagia and Barrett: accepted 2 concepts / 4 patients

Patient with chronic reflux develops persistent esophageal dysphagia (stable,
still tolerating liquids, no acute food impaction). First node selects upper-GI
endoscopy with appropriate esophageal biopsies. Real generic EGD gate returns
an adequately assessed benign peptic narrowing and an abnormal columnar segment
extending several centimeters above the gastroesophageal junction; pathology
shows specialized intestinal metaplasia without dysplasia/carcinoma. Second
node interprets that pathology as Barrett esophagus. Barrett metaplasia itself
is not presented as an obstructing lesion. Do not test screening demographics,
cancer probabilities, surveillance intervals, PPI protocols or dysplasia therapy.
Goblet-cell detail is not necessary to these scoped cases; use the directly
verified term specialized intestinal metaplasia.

- `source.sc.niddk-upper-gi-endoscopy`: NIDDK. Upper GI Endoscopy. Government
  patient education, institutional author, acknowledged reviewer Nicholas J.
  Shaheen MD. Last reviewedOctober2023 (2023).
  https://www.niddk.nih.gov/health-information/diagnostic-tests/upper-gi-endoscopy .
  Supports evaluation of swallowing problems, upper-GI inspection and biopsies,
  stricture evaluation/intervention, and subsequent pathology results. Clinical
  service timings in gameplay remain simulation, not these clinical intervals.
- `source.sc.niddk-barrett-diagnosis`: NIDDK. Diagnosis of Barrett's Esophagus.
  Last reviewedAugust2024 (2024), government patient education, institutional
  author. https://www.niddk.nih.gov/health-information/digestive-diseases/barretts-esophagus/diagnosis .
  Supports EGD plus histologic confirmation; does not by itself supply precise
  cellular definition. Same government reuse conditions.
- `source.sc.acg-barrett-patient-2024`: Gabbard SL, Gupta M (May2024 update);
  prior authors Azodo IA, Romero Y (2006), Shaheen NJ (2016). Barrett's Esophagus.
  American College of Gastroenterology. UpdatedMay2024. Society patient education.
  https://gi.org/topics/barretts-esophagus/ . Supports intestinal metaplasia,
  endoscopic columnar segment, dysphagia as indication for endoscopy and
  distinction from dysplasia/cancer. Copyright ACG, targeted facts/citation only;
  public page/footer privacy policy checked, no AI prohibition identified.
  This is not the complete ACG2022 guideline. No source prose/images retained.

Use existing generic `service.endoscopy` if it honestly models EGD/biopsy results
and its provider/Level2 constraints. Integration may add a clearly labeled generic
external EGD-with-esophageal-biopsy route if needed. Never repurpose celiac's
`service.upper_endoscopy_duodenal_biopsy` or biliary EUS/ERCP sampling.

### Achalasia: accepted 2 concepts / 4 patients

Patient has persistent solids-and-liquids dysphagia and regurgitation; prior EGD
already excludes mechanical obstruction and concerning pseudoachalasia. First
node chooses high-resolution esophageal manometry. New real external route:
`service.esophageal_manometry` / `route.esophageal_manometry.outsourced`.
Returned absent peristalsis plus impaired EGJ relaxation supports achalasia at
node2. No exact pressure/subtype threshold, cancer dismissal without prior workup,
or universal requirement for raised basal LES pressure. No treatment algorithm.

- `source.sc.seoul-achalasia-2020`: Jung HK, Hong SJ, Lee OY, Pandolfino J,
  Park H, Miwa H, Ghoshal UC, Mahadeva S, et al.; Korean Society of
  Neurogastroenterology and Motility. 2019 Seoul Consensus on Esophageal
  Achalasia Guidelines. Journal of Neurogastroenterology and Motility.
  2020;26(2):180-203. Published2020-04-30. DOI10.5056/jnm20014. PMID32235027.
  https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014 .
  Society evidence-based guideline. Direct diagnostic text supports HRM after
  structural assessment and absence of peristalsis/impaired relaxation. Low
  diagnostic evidence with strong consensus; sole accepted source for these
  precise manometric facts. Article CC BY-NC4.0, original factual synthesis,
  attribution/license URL required. No reproduced figures or algorithm. An
  indexed 2021 corrigendum exists (DOI10.5056/jnm20014C); its full text was not
  accessible during this verification. Treatment/subtype algorithm is outside
  the adopted diagnostic claims; do not assert its contents were directly read.

### Pigmented lesion and melanoma: accepted 2 concepts / 4 patients

Small accessible evolving superficial pigmented lesion has concerning change,
border or color asymmetry; diagnosis is not already asserted before biopsy.
First node chooses complete local diagnostic excision with narrow clinical
margins and sufficient depth for microstaging. Gate
`service.skin_excisional_biopsy` / `route.skin_excisional_biopsy.outsourced`.
Returned pathology explicitly gives intermediate-thickness invasive melanoma,
e.g.1.4-1.8mm, with no clinically palpable nodes. These values are fictional
results within NCI's directly discussed1.2-3.5mm intermediate-thickness evidence
range, not new cutoffs. Node2 asks sentinel-node staging discussion alongside
definitive wide-excision planning. Do not conflate this with complete lymph-node
dissection, automatic metastatic disease, or guaranteed survival benefit. Avoid
named diagnostic-margin widths, definitive-margin rules or systemic regimens.
If using shave distractor specify superficial shave, not all shave techniques.

- `source.sc.nci-melanoma-pdq-2025`: PDQ Adult Treatment Editorial Board.
  Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute.
  Updated2025-05-02 (2025), PMID26389469.
  https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq .
  Government professional evidence summary. Supports biopsy/microstaging and
  intermediate-thickness clinically node-negative sentinel staging. Government
  facts with NCI/PDQ reuse conditions; original synthesis, no PDQ-branded modified
  summary or third-party images. No blanket exclusion of all shave techniques
  from older wording is adopted.
- `source.sc.aad-melanoma-highlights`: American Academy of Dermatology. Melanoma
  clinical guideline (Guideline highlights). Institutional author, undated
  (year null). https://www.aad.org/member/clinical-quality/guidelines/melanoma .
  Society professional guideline highlights, not the unaccessed full JAAD CPG.
  Corroborates adequate biopsy histology and selected SLNB for pathological
  regional staging. Copyright AAD, attributed noncommercial educational factual
  use; terms directly checked https://www.aad.org/terms-use . No reproduced
  content, third-party database/corpus or model training, no figures. Terms
  distinguish attributed noncommercial educational use; do not claim open license.

### Postoperative seroma: accepted 2 concepts / 4 patients

Follow-up after benign breast excision, with a new superficial fullness that
cannot be confidently characterized on palpation. First question selects targeted
ultrasound (existing ultrasound service/routes) rather than presuming the cause.
Gate returns a small simple fluid collection with smooth wall, no solid component
or suspicious vascularity; patient has no fever/redness, wound tension, implant,
functional limitation or meaningful pain. Second question asks observation with
follow-up. Include review if symptoms worsen; do not invent aspiration, antibiotic
need, timed resolution or universal benignity from ultrasound alone.

- `source.sc.ucla-post-surgical-fluid`: Sparks H, Manchandia TC. Post-Surgical
  Fluid Collections: Causes, Symptoms, and Management. UCLA Health Department of
  Radiology, Breast Imaging Teaching Resources. Undated (year null).
  https://www.uclahealth.org/departments/radiology/education/breast-imaging-teaching-resources/cases/post-surgical-fluid-collections .
  Institutional physician teaching guidance, not society guideline. Directly
  supports simple fluid ultrasound features and observing small asymptomatic
  seromas without wound tension. Copyright University of California; no reusable
  article license shown; targeted original factual verification/citation only,
  no copied text/images. Public institutional policy at
  https://www.ucla.edu/terms-of-use checked; it is largely privacy disclosure and
  is not an explicit content reuse grant. No public AI-use ban identified.
  Specific imaging/management detail is a single institutional source; record
  this limitation rather than claim guideline validation.
- `source.sc.nci-seroma-dictionary`: National Cancer Institute. Seroma. NCI
  Dictionary of Cancer Terms. Government reference definition, institutional
  author, undated (year null).
  https://www.cancer.gov/publications/dictionaries/cancer-terms/def/seroma .
  Direct independent cross-check for clear-fluid collection after breast surgery,
  spontaneous resolution and selective needle drainage. Does not independently
  establish specific ultrasound features or a management algorithm. Government
  factual content, no third-party images/reproduced prose.

### Chronic pilonidal disease: accepted 2 concepts / 4 patients

Chronic/recurrent natal-cleft drainage and midline pits, with no current fluctuant
abscess, cellulitis or systemic illness. First node identifies chronic pilonidal
sinus disease, preserving examination to exclude anal fistula when appropriate.
Second node is an elective consultation: after discussion of open healing,
minimally invasive approaches and excision, patient/surgeon have specifically
chosen excision with primary closure. Ask where the closure should lie: away
from the natal midline. No universal excision mandate, no false superiority of
one named flap over all others, no routine imaging or healing-delay service.

- `source.sc.siccr-pilonidal-2021`: Milone M, Basso L, Manigrasso M, Pietroletti R,
  Bondurri A, La Torre M, Milito G, Pozzo M, Segre D, Perinotti R, Gallo G.
  Consensus statement of the Italian society of colorectal surgery (SICCR):
  management and treatment of pilonidal disease. Techniques in Coloproctology.
  2021;25(12):1269-1280. Published2021-06-27. DOI10.1007/s10151-021-02487-8.
  PMID34176001. https://pmc.ncbi.nlm.nih.gov/articles/PMC8580911/ .
  Society systematic-review/Delphi consensus. Directly read clinical diagnosis
  and conditional off-midline primary closure recommendation, with individualized
  alternatives and no single universally best flap. Article explicitly CC BY4.0
  (https://creativecommons.org/licenses/by/4.0/); original modified factual
  synthesis, attribution/license link required. Main management evidence source;
  ASCRS patient page is not an independent comparison of closure techniques.
- `source.sc.ascrs-pilonidal-patient`: ASCRS. Pilonidal Disease. Society patient
  education, institutional author, undated (year null).
  https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Pilonidal-Disease.aspx .
  Copyrighted targeted facts only under public-library policy above. Supports
  characteristic recurrent natal-cleft disease and individualized elective care.
  Do not adopt blanket hair-removal schedules/age cutoffs or general flap-outcome
  statements; those are outside these claims and can conflict with modern nuance.

### Additional exclusions after root verification

Sol's initial formal ASCRS PDF and ASCRS-U guideline references were withdrawn:
the PDFs return404 and ASCRS-U/Unbound terms prohibit automated access and using
the service to develop other goods/services. ESCP2024 at OUP is also excluded
because Oxford Academic's current Legal Notice prohibits AI use without an
established applicable open license. No content from these withdrawn locations
may be represented as accepted. The German pilonidal guideline's emergency
pandemic reuse notice is expired, so it is not treated as licensed open access;
the directly checked CC BY SICCR consensus supplies the needed facts instead.
No disputed hair-control teaching point is included. No additional user review
question is necessary for the accepted, explicitly scoped twenty meanings.

## Editorial and integration refinements after first actual-file review

- The initial thyroid report describes suspicious findings meeting biopsy
  criteria, rather than naming the exact FNA answer. Returned cytology states
  follicular neoplasm only; it must not supply the subsequent invasion answer.
  No new size threshold or scoring algorithm is introduced by this wording.
- Every node asks about the current patient's actual presentation or returned
  findings. Explanations use clinical language; authoring/prototype terminology
  belongs in metadata, not the player's clinical discussion.
- PHPT bone variants use an actual documented fragility fracture, not vague
  fragility risk. All variants include adequate prior contextual differential
  assessment. Management options must be distinct clinical strategies.
- EGD/Barrett uses existing generic `service.endoscopy` and
  `route.endoscopy.in_house`. These four cases start at Stage2 and require
  `capability.endoscopy` at admission; they cannot be generated in an unbuilt
  or unstaffed endoscopy facility. Current generic route models the timed care
  workflow and subsequent returned report; it is not a clinical pathology
  turnaround claim. No new level, provider role, or OR workflow is introduced.
- The remaining four new services (thyroid FNA, anoscopy, esophageal manometry,
  skin excisional biopsy) use explicitly external contracts. Existing lab and
  ultrasound routes remain unchanged. This avoids implying onsite procedural
  capacity that is not yet modeled by the minor-procedure room/provider system.
- Existing wrong-answer behavior records corrective teaching and an Again FSRS
  review, then follows the authored correct service gate after acknowledgment.
  Preserve this visible correction and verify it rather than changing the engine.
- Source publication year may be null for undated pages; extend the shared
  metadata interface and show an honest undated label. Do not invent dates or
  classify patient education as a formal clinical practice guideline.

### Endoscopy integration finding

Actual timed-flow validation exposed that the existing generic endoscopy route
could not accommodate a return walk: its three resource-bound phases used all
120 declared ticks. Root authorized a balance-only simulation correction for
this existing route: keep preparation30, procedure45, recovery45; append a
60-tick return/report phase without resource reservations; total180 ticks.
This explicitly supersedes the earlier preserve-existing-endoscopy-timing note.
No clinical timing claim, source fact, medical protocol, provider role, or game
level is changed. Previously frozen120-tick encounters remain untouched. All
four new EGD patients must complete actual procedure and return before the
Barrett question is exposed; no result injection or bypass is acceptable.
