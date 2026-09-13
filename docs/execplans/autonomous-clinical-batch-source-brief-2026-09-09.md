# Source and case-design brief for the twenty-concept batch

Parent-owned planning brief; checked 2026-09-09. Store original factual synthesis
and bibliography only. This is agent editorial work under owner delegation,
not a named-clinician approval. The active implementation plan governs scope.

## Clinical pathways and stable concepts

Each new concept has four genuinely different patient-linked variants. Use four
parallel blueprints per pathway, with one unique primary concept per node.
Names use `{patientName}`; age/sex use coherent editorial instantiation profiles.
No race-based disease weights, invented clinical probabilities, doses, exact
follow-up intervals, or universal demographic eligibility rules.

1. `concept.gallstones.initial-ultrasound`: suspected uncomplicated gallstones;
   a current outpatient has recurrent resolved upper-abdominal pain, no fever,
   jaundice, ongoing severe pain, or systemic instability. Ask for imaging.
2. `concept.gallstones.symptomatic-surgical-referral`: after actual US delivery,
   stones without duct dilation/inflammatory complications plus the patient's
   recurrent compatible symptoms support elective surgical assessment and
   cholecystectomy counseling. Four two-node cases, US gate after node one.
3. `concept.gallstones.incidental-observation`: four separate asymptomatic
   incidental-stone cases with no suspicious gallbladder features; usual
   observation/counseling, no automatic prophylactic surgery. Do not force an
   asymptomatic management concept onto a symptomatic patient's pathway.
4. `concept.nephrolithiasis.noncontrast-ct-evaluation`: stable nonpregnant adult
   with unresolved diagnostic uncertainty, preferably prior indeterminate US;
   noncontrast CT clarifies stone presence, site and obstruction.
5. `concept.nephrolithiasis.recurrent-metabolic-evaluation`: after actual CT
   confirms stone disease without an urgent obstructed-infection presentation,
   recurrence supports stone analysis and urine/metabolic evaluation for
   prevention planning. Four two-node cases, CT gate. No preventive drug rules.
6. `concept.celiac.initial-serology`: patient with persistent compatible GI
   symptoms eating gluten; tTG-IgA with total-IgA context is a usual initial
   serologic assessment. Blood-test gate delivers positive serology with
   adequate IgA, without claiming serology is always definitive.
7. `concept.celiac.duodenal-biopsy-confirmation`: routine adult confirmation
   with upper endoscopy and duodenal biopsies; no absolute claim that every
   adult everywhere must undergo biopsy. Second actual test gate delivers
   pathology interpreted as compatible with celiac disease in this context.
8. `concept.celiac.gluten-free-treatment`: confirmed celiac disease leads to
   a gluten-free diet with dietitian support. Four three-node cases and two
   genuine test waits. Gluten avoidance before diagnostic testing can alter
   results; patients continue gluten through diagnostic workup. Do not teach
   an exact gluten-challenge protocol or a universal no-biopsy restriction.
9. `concept.colorectal.positive-fit-colonoscopy`: positive screening FIT needs
   diagnostic colonoscopy; positive FIT alone does not diagnose cancer.
10. `concept.colorectal.histologic-confirmation`: colonoscopy identifies a
    suspicious lesion and samples it; histologic examination of tissue is the
    confirming evidence. Do not invent a colonoscopy that neglects biopsy just
    to create a second question. Later question may concern the pending
    histologic result or limits of gross appearance. Four two-node cases.
11. `concept.iron-deficiency.iron-studies`: current unexplained anemia prompts
    iron studies; low ferritin supports depleted iron stores. Laboratory gate
    delivers unequivocal iron deficiency, without numeric threshold teaching.
12. `concept.iron-deficiency.gi-evaluation`: unexplained confirmed IDA in adult
    men or explicitly postmenopausal patients merits GI evaluation, generally
    upper endoscopy plus colonoscopy. Four two-node cases. Verified BSG and
    NHLBI source details are recorded below.
13. `concept.soft-tissue-mass.extremity-mri`: deep/enlarging or US-indeterminate
    extremity mass warrants MRI for local characterization before biopsy.
14. `concept.soft-tissue-mass.specialist-planned-biopsy`: suspicious MRI prompts
    sarcoma-team referral and planned image-guided core biopsy, preserving the
    future surgical approach. No unplanned office excision. Four two-node cases
    with real MRI gates. Do not call an unbiopsied mass a proven sarcoma.

Two scored nodes require facility stage >=1; three require >=2 in the existing
engine. Keep these progression rules and honest external testing routes. The
four incidental gallstone and 24 Graves cases can be single-node clinic cases.
Planned new-case total: 28, of which 24 have real test gates. Complete total:
52 case blueprints, 80 scored variants, 20 concepts. Verify actual counts later.

## Directly checked sources and bounded facts

All access dates below are 2026-09-09. Government organization is institutional
author unless otherwise stated. Clinical authority and reuse are separate.

- NIDDK. Diagnosis of Gallstones. Reviewed November 2017.
  https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones/diagnosis
  Government patient guidance: US detects gallstones; CT can miss them. Original
  clinical facts only, no source prose, diagrams, numeric sensitivity or rules.
- NIDDK. Treatment for Gallstones. Reviewed November 2017.
  https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones/treatment
  Government patient guidance: asymptomatic stones usually need no treatment;
  symptomatic disease is referred for treatment, usually cholecystectomy.
- Fujita N, Yasuda I, Endo I, et al. Evidence-based clinical practice guidelines
  for cholelithiasis 2021. Journal of Gastroenterology. 2023;58:801-833.
  Published July 15, 2023. DOI 10.1007/s00535-023-02014-6.
  https://link.springer.com/article/10.1007/s00535-023-02014-6
  JSGE peer-reviewed guideline, GRADE/consensus; directly read diagnosis and
  CQ3-(1)-1/2. US/labs in suspected stones; laparoscopic cholecystectomy for
  symptomatic stones; routine prophylactic surgery generally not recommended
  for asymptomatic stones, with higher-risk exceptions. Do not teach regional
  surveillance schedules, cancer-risk thresholds, medications or copied tables.
  Rights directly checked: CC BY 4.0, attribution/license link and statement
  that our educational synthesis is original and modified; no copied figures.
- NIDDK. Diagnosis of Kidney Stones. Reviewed May 2017.
  https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/diagnosis
  Government patient guidance: noncontrast CT can identify size/location and
  obstruction. Urine/blood testing contributes to evaluation. Do not teach CT
  as universally first-line for every patient, especially pregnancy/children.
- NIDDK. Treatment for Kidney Stones. Reviewed May 2017.
  https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/treatment
  Stone composition analysis and 24-hour urine volume/mineral assessment can
  guide prevention after stone passage/removal. No copied drug/dosing table.
  The attempted current-guideline cross-check is excluded for source-rights
  reasons below; record the older, single-agency limitation.
- NIDDK. Celiac Disease Tests. Reviewed February 2021.
  https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals?dkrd=www2.niddk.nih.gov
  Professional government guidance: tTG-IgA is preferred in most patients;
  total IgA matters because deficiency can undermine IgA tests; IgG testing
  has a role in deficiency; positive serology usually leads to upper endoscopy
  with duodenal biopsies. Patient needs gluten exposure for accurate testing.
  Do not adopt this older page's absolute adult no-biopsy statement.
- NIDDK. Diagnosis of Celiac Disease. Reviewed October 2020.
  https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis
  Government patient guidance: blood tests and small-intestine biopsies are
  usual diagnostic tools; starting a gluten-free diet can alter test results.
- NIDDK. Treatment for Celiac Disease. Reviewed October 2020.
  https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/treatment
  Government patient guidance: gluten-free diet treats celiac disease;
  specialist dietitian helps with a nutritionally appropriate diet; follow-up
  assesses response. No exact treatment-response times or supplement rules.
- National Cancer Institute. Screening Tests to Detect Colorectal Cancer and
  Polyps. Reviewed October 29, 2024.
  https://www.cancer.gov/types/colorectal/screening-fact-sheet
  Government evidence synthesis: positive stool screening needs colonoscopy;
  abnormal colonoscopic tissue is removed or biopsied and examined for cancer.
  Do not teach FIT as a tissue diagnosis or assign stage from this workup.
- Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor
  imaging in adults: European Society of Musculoskeletal Radiology-Guidelines
  2023-overview, and primary local imaging: how and where? European Radiology.
  2024;34:4427-4437. Published December 7, 2023.
  DOI 10.1007/s00330-023-10425-5.
  https://link.springer.com/article/10.1007/s00330-023-10425-5
  Peer-reviewed ESSR expert consensus: MRI characterizes deep/enlarging or
  indeterminate masses; suspicious cases should reach a tumor center before
  biopsy/surgery; biopsy is planned and image guided. Do not copy algorithms,
  use numeric size thresholds or claim every superficial lump needs MRI.
  Rights directly checked: CC BY 4.0, attribution/license link and original
  modified synthesis notice; third-party art excluded.
- PDQ Adult Treatment Editorial Board. Soft Tissue Sarcoma Treatment,
  Health Professional Version. Bethesda, MD: National Cancer Institute.
  Updated February 21, 2025. PMID 26389481.
  https://www.cancer.gov/types/soft-tissue-sarcoma/hp/adult-soft-tissue-treatment-pdq
  Expert editorial evidence synthesis, independent of NCI policy. Imaging
  precedes intervention; image-guided core or selected planned incisional
  biopsy and experienced pathology review; planning protects future resection.

NIDDK rights directly checked at https://www.niddk.nih.gov/copyright : most
government text is copyright-free; third-party materials/logos are excluded;
credit agency, no endorsement. NCI rights directly checked at
https://www.cancer.gov/policies/copyright-reuse : text generally copyright-free
unless indicated; credit/link original, no logo/PDQ branding of our own content.
Record `public_domain_conditions_apply` and original factual synthesis only.
Creative Commons link: https://creativecommons.org/licenses/by/4.0/ .

## IDA source verification handback accepted from Sol

Snook J, Bhala N, Beales ILP, Cannings D, Kightley C, Logan RPH, Pritchard DM,
Sidhu R, Surgenor S, Thomas W, Verma AM, Goddard AF. British Society of
Gastroenterology guidelines for the management of iron deficiency anaemia in
adults. Gut. 2021;70(11):2030-2051. DOI 10.1136/gutjnl-2021-325210.
https://www.bsg.org.uk/clinical-resource/guidelines-iron-deficiency-anaemia-in-adults
Official directly readable PDF:
https://www.bsg.org.uk/getmedia/3e13dd5c-8e7b-4110-87c5-dcc1feee495d/Iron-Deficiency-Anaemia-in-Adults.pdf

Sol directly checked the official BSG PDF and rights. Society guideline,
externally peer-reviewed; publication remains 2021 even though BSG reports
review in 2026. Iron studies confirm iron deficiency in an already anaemic
patient; ferritin is useful, with other iron measures when inflammation can
produce falsely normal ferritin. Newly diagnosed unexplained confirmed IDA in
adult men/postmenopausal patients generally warrants gastroscopy and
colonoscopy, with suitability and individual context considered. No assertion
that isolated low ferritin proves anaemia or that normal ferritin always excludes
deficiency. No exact thresholds or UK referral deadlines.

Rights: CC BY-NC 4.0, © authors/employers 2021; use
`cc_by_nc_4_0_restricted`, cite original and license, indicate original factual
synthesis. Current owner/development use only; commercial reuse needs a fresh
source-rights review or permission. No copied prose, tables or algorithms.
https://creativecommons.org/licenses/by-nc/4.0/

Optional WHO corroboration is not needed in the runtime source list; its
CC BY-NC-SA 3.0 IGO license requires a different rights representation.
EAU 2026 is excluded: Sol found express restrictions on AI/external-software
use. Do not derive or cite teaching content from it. Kidney-stone teaching
uses the directly verified NIDDK sources, with an explicit older/single-agency
evidence limitation and no claim of universal first-line CT.

## Additional directly checked independent corroboration

- National Heart, Lung, and Blood Institute. Anemia: Iron-Deficiency Anemia.
  Updated March 24, 2022.
  https://www.nhlbi.nih.gov/health/anemia/iron-deficiency-anemia
  Government patient guidance: CBC/hemoglobin, iron and ferritin are part of
  diagnostic assessment. Use only the prose-level relationship, not its image
  of numeric diagnostic cutoffs. Original factual cross-check, no copied art
  or prose; targeted verification rights classification is sufficient.
- American College of Gastroenterology. Celiac Disease. Original authors
  Connor G. Loftus and Joseph A. Murray; updates by Patrick McCabe (2021)
  and Claire Jansson-Knodell (April 2026).
  https://gi.org/topics/celiac-disease/
  Society patient education, not the full guideline. Directly read treatment
  and diagnosis: gluten avoidance before testing can cause false negatives;
  confirmed celiac disease needs ongoing gluten avoidance with expert
  dietitian support. ACG's linked 2023 patient one-pager independently states
  lifelong gluten-free treatment and dietitian support:
  https://webfiles.gi.org/links/patients/Celiac_OnePager_2023.pdf
  Use the 2026 page for bounded current cross-check, ordinary copyright,
  `copyrighted_targeted_verification_only`; facts/citation only, no protected
  wording, lists, tables or images. Do not reproduce its absolute phrasing
  about all adult biopsy requirements or adopt unreviewed extra management.

Older government page review dates must not be represented as current guideline
dates. ACG patient education is not a substitute for the full 2023 guideline.

## Supplemental atomic mappings checked at final authoring review

On 2026-09-09 Astra directly revisited the same official NIDDK pages above:

- Celiac Disease Tests supports the limited role of IgG-based testing in IgA
  deficiency and explains why HLA susceptibility typing does not establish
  active celiac disease. Add these as separate atomic supporting claims for
  the initial-serology alternatives, without numeric performance claims.
- Treatment for Gallstones identifies ERCP as a way to remove a stone lodged
  in the common bile duct. Add that separate supporting fact for the duct-
  intervention alternatives; do not equate it with gallbladder stone treatment.
- Diagnosis of Kidney Stones distinguishes urine evidence relevant to infection
  from CT evaluation of stone location/obstruction. Keep clinical/urine context
  separate from imaging, with its own mapped supporting claim. This does not
  make a negative urinalysis an absolute exclusion of infection.

These supplement existing sources, rather than expanding the concept roster.
No source prose or numeric rules are reproduced.
