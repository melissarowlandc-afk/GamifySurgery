# Early-level foregut and biliary source brief - 2026-09-13

## Scope and status

This is a source brief, not an ExecPlan or clinical approval. It supports five
possible two-concept families for internal facility stages 0-2. All future
clinical records, claims, cases, question variants, and explanations must remain
`needs_clinician_review` with no named-clinician approval until a clinician
reviews the authored version.

The comparison baseline was
`.local-dev/patient-library-before-root-2026-09-13.json` (123 concepts). No
active concept teaches choledocholithiasis risk-stratified evaluation, a
post-cholecystectomy bile-leak pathway, pancreatic pseudocyst classification or
drainage, pre-antireflux physiologic testing, or post-bariatric hypoglycemia.
The existing gallstone ultrasound/referral pair is adjacent to, but does not
duplicate, duct-stone evaluation. The existing pancreatic-cyst MRCP/MCN pair is
neoplastic-cyst content and does not duplicate an inflammatory pseudocyst.

Sources were checked 2026-09-13. The statements below are short original
syntheses. No commercial corpus, SCORE Portal material, recalled examination
content, source excerpt, table, algorithm, or full-text source was added to the
repository. Runtime wait estimates are gameplay placeholders and must not be
presented as medical timelines.

## Public SCORE scope

Coverage source `SRC-SCORE-GS-2025-26` is the public SCORE *General Surgery
Curriculum Outline | 2025-2026*. The labels Common and Uncommon describe
curriculum depth, not examination frequency. Physical PDF pages are one greater
than the printed page numbers.

| Proposed family | Exact public SCORE topic, locator, and depth | Mapping |
| --- | --- | --- |
| Choledocholithiasis | Biliary -> Diseases/Conditions -> **Benign Biliary Obstruction**, Common, printed p. 3 / physical PDF p. 4. Related operation: Biliary -> Operations/Procedures -> **Common Bile Duct Exploration and Choledochoscopy**, Common, same page. | Explicit disease family; EUS/MRCP risk stratification and ERCP extraction are inferred clinical applications. ERCP is not separately named. |
| Post-cholecystectomy bile leak | Biliary -> Diseases/Conditions -> **Iatrogenic Bile Duct Injury**, Common, printed p. 3 / physical PDF p. 4. | Explicit disease family; CE-MRCP and endoscopic stenting of a minor leak are inferred applications. Do not map this pair to the separately listed Uncommon operation **Iatrogenic Bile Duct Injury Repair**, because the pair excludes operative repair. |
| Pancreatic pseudocyst | Pancreas -> Diseases/Conditions -> **Acute Pancreatitis**, Common, printed p. 4 / physical PDF p. 5. | Inferred sequela within an explicit acute-pancreatitis family. Pancreatic pseudocyst and endoscopic drainage are not separately named in the public outline. Keep the scenario tied to prior interstitial edematous acute pancreatitis; otherwise this mapping weakens. |
| Pre-antireflux testing | Esophagus -> Diseases/Conditions -> **Gastroesophageal Reflux and Barrett Esophagus**, Common; Esophagus -> Operations/Procedures -> **Antireflux Procedures**, Common; printed p. 5 / physical PDF p. 6. | Explicit family and procedure; the individual physiologic tests are inferred clinical applications. |
| Post-bariatric hypoglycemia | Stomach -> Operations/Procedures -> **Bariatric Surgery**, Uncommon, printed p. 6 / physical PDF p. 7. | Inferred postoperative complication within an explicit Uncommon procedure. PBH is not separately named. This is the weakest early-level board mapping of the five, but the clinical pair is coherent and outpatient-safe. |

## Recommended two-concept contracts

### Family 1 - stable suspected choledocholithiasis

**Suggested placement:** stage 1. Use a stable outpatient referral pathway, not
acute cholangitis or gallstone pancreatitis.

1. `claim.early.choledocholithiasis.intermediate-eus-mrcp` - In a stable adult
   with intermediate probability of a common-bile-duct stone, use EUS or MRCP
   to confirm the stone rather than exposing the patient to diagnostic ERCP.
   If a single answer must be keyed, state why noninvasive MRCP is the selected
   modality (for example, local availability and a patient preference to avoid
   an invasive test); do not imply that MRCP is universally superior to EUS.
   **Sources:** `SRC-ASGE-CHOLEDO-2019`, corroborated by
   `SRC-ESGE-CBDS-2019`. **Category/certainty:** evaluation; guideline-backed,
   conditional choice between two accepted tests.
2. `claim.early.choledocholithiasis.confirmed-stone-therapy` - Once MRCP or EUS
   confirms a common-bile-duct stone in a patient fit for intervention, refer
   for therapeutic duct clearance; ERCP is appropriate in the explicitly
   selected preoperative endoscopic pathway, followed by the already planned
   cholecystectomy pathway. **Sources:** `SRC-ASGE-CHOLEDO-2019`, corroborated
   by `SRC-ESGE-CBDS-2019`. **Category/certainty:** management/referral; strong
   support for treating a confirmed stone, but the order relative to
   cholecystectomy depends on local surgical and endoscopic expertise.

**Safe scenario and reveal contract:** an adult with biliary symptoms and
gallstones is afebrile, hemodynamically stable, without jaundice, cholangitis,
pancreatitis, or a stone already visible on initial imaging, and does not meet
the guideline's direct-ERCP high-risk profile. Intermediate-risk features are
explicit. Node 1 orders external MRCP (or groups “EUS or MRCP” as the correct
answer). Only that order may reveal a common-bile-duct filling defect consistent
with a stone. Node 2 refers for therapeutic ERCP/duct clearance in the chosen
preoperative endoscopic pathway; it must not simulate ERCP in the clinic.

**Ambiguity boundaries:** EUS and MRCP are both guideline-supported; either
becomes an unfair distractor unless the stem supplies a modality-specific
reason or groups them. Do not send an intermediate-risk patient straight to
diagnostic ERCP. Do not teach preoperative ERCP as the only valid sequence:
ASGE also permits postoperative ERCP or laparoscopic duct treatment according
to expertise. Do not merge this with cholangitis, persistent obstruction in
gallstone pancreatitis, or the existing uncomplicated gallstone pair.

### Family 2 - stable post-cholecystectomy bile leak

**Suggested placement:** stage 2. Use a stable postoperative consultation with
external imaging and endoscopy capability.

1. `claim.early.bile-leak.ce-mrcp-anatomic-localization` - When a stable
   suspected postoperative bile leak requires anatomical localization,
   classification, and assessment of duct continuity, contrast-enhanced MRCP
   is the purposeful noninvasive study. Hepatobiliary scintigraphy (HIDA) can
   demonstrate an active leak but has poor spatial resolution and commonly
   needs another test. **Source:** `SRC-WSES-BDI-2021`.
   **Category/certainty:** evaluation; weak recommendation/moderate-quality
   evidence for adding CE-MRCP to the initial cross-sectional assessment.
2. `claim.early.bile-leak.minor-leak-ercp-stent` - A confirmed minor
   post-cholecystectomy bile-duct leak with maintained duct continuity and no
   common-duct or common-hepatic-duct transection can be referred for ERCP with
   internal plastic-stent treatment. **Sources:** `SRC-WSES-BDI-2021`,
   corroborated by `SRC-ESGE-BILIARY-STENT-2018`.
   **Category/certainty:** management/referral; the ESGE stent recommendation
   is strong with moderate-quality evidence, while WSES emphasizes the minor
   injury and escalation boundaries.

**Safe scenario and reveal contract:** an adult returns after cholecystectomy
with persistent localized discomfort or bilious drain output but is stable and
has no diffuse peritonitis, sepsis, hemodynamic instability, or uncontrolled
collection. Initial US/CT may show a nonspecific collection but cannot label it
as bile. Node 1 asks which study best defines the anatomy and orders external
CE-MRCP. Only CE-MRCP may reveal a cystic-duct-stump leak, preserved duct
continuity, no major transection, and no obstructing stone. Node 2 refers for
ERCP with internal plastic stent; it does not perform endoscopy locally.

**Ambiguity boundaries:** if the question asks only whether active leakage is
present, HIDA is also defensible; key CE-MRCP only when anatomy/localization and
continuity are the stated task. Conventional non-contrast MRCP is not
interchangeable with hepatobiliary contrast-enhanced MRCP for demonstrating
active extravasation. Do not allow the first order to reveal an ERCP result.
Exclude diffuse biliary peritonitis, sepsis, major duct transection, devascularized
duct, main-duct discontinuity, and a collection requiring urgent drainage or
source control. Those cases need different pathways.

### Family 3 - symptomatic mature pancreatic pseudocyst

**Suggested placement:** stage 2. Use remote follow-up after interstitial
edematous acute pancreatitis with external therapeutic endoscopy.

1. `claim.early.pseudocyst.ct-classification` - After interstitial edematous
   acute pancreatitis, a mature, encapsulated, homogeneous fluid collection
   with a defined wall and no solid necrotic component is compatible with a
   pancreatic pseudocyst rather than walled-off necrosis. **Sources:**
   `SRC-ATLANTA-2013`, corroborated by `SRC-ASGE-PFC-2016`.
   **Category/certainty:** diagnosis/classification; strong consensus
   definition. Use “compatible with” because cross-sectional imaging must also
   exclude a cystic neoplasm, pseudoaneurysm, and other noninflammatory lesions.
2. `claim.early.pseudocyst.symptomatic-endoscopic-drainage` - A symptomatic
   mature pancreatic pseudocyst warrants drainage evaluation, and endoscopic
   drainage can be selected as initial therapy before surgical drainage when
   anatomy is suitable and surgical/interventional-radiology backup is
   available. **Source:** `SRC-ASGE-PFC-2016`, corroborated by
   `SRC-KSGE-PFC-2021`. **Category/certainty:** management/referral;
   guideline-supported. Symptoms, maturity, and suitable anatomy must be
   explicit; size alone is not an indication.

**Safe scenario and reveal contract:** a stable adult has persistent early
satiety, vomiting from compression, or ongoing pain after a resolved episode of
interstitial edematous pancreatitis. The case has no fever, bleeding, sepsis,
ongoing organ failure, pseudoaneurysm concern, or necrotizing pancreatitis.
Node 1 interprets an explicitly ordered contrast-enhanced CT showing a mature
encapsulated homogeneous fluid collection without solid debris and classifies
it as pseudocyst-compatible. Node 2 uses the stated symptoms plus suitable
adjacency to the stomach or duodenum to refer externally for EUS-guided
endoscopic drainage. Do not make the clinic perform drainage.

**Ambiguity boundaries:** do not key intervention from diameter alone. Do not
call a collection with necrotic debris a pseudocyst; that may be walled-off
necrosis and has a different treatment pathway. Do not reuse the existing
neoplastic pancreatic-cyst MRCP/MCN concept. A returned CT must explicitly
exclude pseudoaneurysm and suspicious neoplastic features before the drainage
answer. The mature-wall timing is source-supported, but no fixed medical
duration needs to appear in the authored question.

### Family 4 - unproven GERD before antireflux surgery

**Suggested placement:** stage 1 or 2. The pair is a stable outpatient
physiologic-testing sequence.

1. `claim.early.gerd.off-ppi-reflux-monitoring` - For suspected but unproven
   GERD with no objective reflux evidence on endoscopy, ambulatory reflux
   monitoring off acid-suppressive therapy is used to establish or refute GERD
   before invasive treatment. **Sources:** `SRC-ACG-GERD-2022`, corroborated by
   `SRC-ICARUS-2019`. **Category/certainty:** evaluation; ACG strong
   recommendation with low-quality evidence, independently supported by the
   international preoperative consensus.
2. `claim.early.gerd.hrm-before-operative-planning` - After objective reflux is
   documented and an antireflux procedure is being considered, high-resolution
   manometry is required before operative planning to exclude achalasia and
   absent contractility; HRM by itself does not diagnose GERD. **Sources:**
   `SRC-ACG-GERD-2022`, corroborated by `SRC-ICARUS-2019`.
   **Category/certainty:** preoperative evaluation; guideline/consensus-backed.

**Safe scenario and reveal contract:** an adult with persistent typical reflux
symptoms is stable, has no dysphagia, weight loss, bleeding, anemia, vomiting,
or known Barrett esophagus, and has a normal endoscopy without unequivocal
erosive disease. The patient is considering surgery but GERD is not objectively
established. Node 1 orders ambulatory reflux monitoring off PPI; only that order
may reveal abnormal acid exposure supporting GERD. Node 2 then orders external
HRM; only HRM may reveal intact peristalsis and absence of achalasia or absent
contractility, after which specialist operative counseling may proceed.

**Ambiguity boundaries:** testing on PPI answers a different question in a
patient with already proven GERD and persistent symptoms; it is not the key for
this unproven-GERD case. HRM cannot replace reflux monitoring and must not be
used as a GERD-confirmation test. A positive pH result does not itself select a
specific antireflux operation. A normal HRM does not obligate surgery.

### Family 5 - late post-bariatric hypoglycemia

**Suggested placement:** stage 1. This is appropriate as a stable outpatient
recognition and initial-care pair, although its public SCORE mapping is
Uncommon and inferred.

1. `claim.early.pbh.whipple-triad-spontaneous-sample` - Diagnose suspected
   post-bariatric hypoglycemia only when typical symptoms coincide with
   biochemically confirmed hypoglycemia below 3.0 mmol/L (54 mg/dL), preferably
   in a venous plasma sample, and symptoms improve when hypoglycemia is
   corrected, completing Whipple's triad after alternative causes are
   considered. This exact threshold is directly supported by the cited current
   guideline. Do not use OGTT or another dynamic provocation test to establish
   PBH. **Source:**
   `SRC-SFE-PBH-2024`; the preference for avoiding OGTT is corroborated by
   `SRC-ESPEN-UEG-OBESITY-2022`, although that older guideline differs by
   accepting a mixed-meal provocation test. **Category/certainty:** diagnosis;
   current society guidance with moderate certainty. Follow the newer SfE
   no-provocation recommendation for this family and preserve the source
   disagreement.
2. `claim.early.pbh.initial-dietary-care` - Initial care for confirmed PBH is
   specialist bariatric dietitian assessment and an individualized post-bariatric
   eating plan emphasizing smaller, more frequent meals, controlled carbohydrate
   portions, and lower-glycemic carbohydrate choices before medication or
   procedural escalation. **Sources:** `SRC-SFE-PBH-2024`, corroborated by
   `SRC-ESPEN-UEG-OBESITY-2022`. **Category/certainty:** management; moderate
   guidance certainty, with an evidence base dominated by small and
   uncontrolled dietary studies.

**Safe scenario and reveal contract:** an adult remotely post-bariatric surgery
has recurrent postmeal autonomic symptoms, remains stable, and has no fasting
episodes, diabetes medication exposure, critical illness, liver or kidney
failure, alcohol-related episode, or severe neuroglycopenia requiring emergency
care. Node 1 arranges a laboratory-quality venous plasma glucose measurement
during a spontaneous symptomatic episode and documents a venous plasma glucose
below 3.0 mmol/L (54 mg/dL) plus symptom resolution after correction. Only that
paired observation may reveal Whipple's triad; OGTT is not an option that can
reveal the diagnosis. Node 2 refers to a bariatric dietitian and selects
individualized dietary care without exact gram targets or meal intervals in the
question.

**Ambiguity boundaries:** symptoms alone are insufficient. CGM may help
education later but is not the diagnostic key in the cited current guideline.
Fasting hypoglycemia, an atypical relationship to surgery or meals, or failure
to meet Whipple's triad requires evaluation for another cause. Do not conflate
PBH with early dumping symptoms. Do not teach a medication, operative revision,
or pancreatectomy in this early pair.

**Editorial recommendation:** retain PBH if the batch needs a high-quality
outpatient postoperative complication. If every new family must be explicitly
named and Common in SCORE, replace this family rather than relabel it as dumping
syndrome: early dumping is also not separately named in the public outline and
would still map only by inference. PBH has the clearer two-node evidence
contract.

## Source records

### SRC-SCORE-GS-2025-26

- **Citation/organization/year:** Surgical Council on Resident Education
  (SCORE). *General Surgery Curriculum Outline | 2025-2026*. 2025-2026 edition.
- **URL/access:** https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf;
  accessed 2026-09-13. The reviewed 27-page public PDF has SHA-256
  `2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.
- **Class/authority:** official public curriculum outline; coverage source only,
  not clinical guidance or an examination-frequency source.
- **Rights/reuse:** public copyrighted SCORE/ABS material; targeted mapping and
  original summary only, no reusable license asserted.
- **Use/claims:** board mapping for all five families. No clinical claim relies
  on this source.

### SRC-ASGE-CHOLEDO-2019

- **Citation:** Buxbaum JL, Abbas Fehmi SM, Sultan S, Fishman DS, Qumseya BJ,
  Cortessis VK, et al.; ASGE Standards of Practice Committee. *ASGE guideline
  on the role of endoscopy in the evaluation and management of
  choledocholithiasis.* Gastrointestinal Endoscopy. 2019;89(6):1075-1105.e15.
  doi:10.1016/j.gie.2018.10.001.
- **Organization/authors/year:** American Society for Gastrointestinal
  Endoscopy; Buxbaum, Abbas Fehmi, Sultan, Fishman, Qumseya, Cortessis, et al.;
  2019.
- **URL/access:** https://www.asge.org/home/resources/publications/guidelines/asge-guideline-on-the-role-of-endoscopy-in-the-evaluation-and-management-of-choledocholithiasis;
  accessed 2026-09-13.
- **Class/rights:** professional-society guideline; copyrighted society/journal
  material, targeted factual verification only, no reusable license asserted.
- **Use/claims:** primary support for
  `claim.early.choledocholithiasis.intermediate-eus-mrcp` and support for
  `claim.early.choledocholithiasis.confirmed-stone-therapy` and the
  expertise-dependent ERCP/cholecystectomy sequence.

### SRC-ESGE-CBDS-2019

- **Citation:** Manes G, Paspatis G, Aabakken L, Anderloni A, Arvanitakis M,
  Ah-Soune P, et al. *Endoscopic management of common bile duct stones:
  European Society of Gastrointestinal Endoscopy (ESGE) guideline.* Endoscopy.
  2019;51(5):472-491. doi:10.1055/a-0862-0346.
- **Organization/authors/year:** European Society of Gastrointestinal
  Endoscopy; Manes, Paspatis, Aabakken, Anderloni, Arvanitakis, Ah-Soune, et al.;
  2019.
- **URL/access:** https://www.esge.com/endoscopic-management-of-common-bile-duct-stones-esge-guideline;
  accessed 2026-09-13.
- **Class/rights:** professional-society guideline; copyrighted Georg Thieme
  Verlag/ESGE material, targeted factual verification only, no reusable license
  asserted.
- **Use/claims:** independent corroboration for both choledocholithiasis claims:
  EUS/MRCP when suspicion persists without adequate ultrasound evidence and
  extraction of confirmed common-bile-duct stones in patients fit for treatment.

### SRC-WSES-BDI-2021

- **Citation:** de'Angelis N, Catena F, Memeo R, Coccolini F, Martínez-Pérez A,
  Romeo OM, et al. *2020 WSES guidelines for the detection and management of
  bile duct injury during cholecystectomy.* World Journal of Emergency Surgery.
  2021;16:30. doi:10.1186/s13017-021-00369-w.
- **Organization/authors/year:** World Society of Emergency Surgery;
  de'Angelis, Catena, Memeo, Coccolini, Martínez-Pérez, Romeo, et al.; 2021.
- **URL/access:** https://link.springer.com/article/10.1186/s13017-021-00369-w;
  accessed 2026-09-13.
- **Class/rights:** professional-society consensus guideline, open access under
  CC BY 4.0. Independently worded claim summaries with attribution; no figures,
  tables, or source prose reused.
- **Use/claims:** primary support for
  `claim.early.bile-leak.ce-mrcp-anatomic-localization` and support for
  `claim.early.bile-leak.minor-leak-ercp-stent`, including the HIDA spatial
  limitation and major-injury exclusions.

### SRC-ESGE-BILIARY-STENT-2018

- **Citation:** Dumonceau JM, Tringali A, Papanikolaou IS, Blero D,
  Mangiavillano B, Schmidt A, et al. *Endoscopic biliary stenting: indications,
  choice of stents, and results: ESGE Clinical Guideline - Updated October
  2017.* Endoscopy. 2018;50:910-930. doi:10.1055/a-0659-9864.
- **Organization/authors/year:** European Society of Gastrointestinal
  Endoscopy; Dumonceau, Tringali, Papanikolaou, Blero, Mangiavillano, Schmidt,
  et al.; 2018.
- **URL/access:** https://www.esge.com/endoscopic-biliary-stenting-indications-choice-of-stents-and-results-2017;
  accessed 2026-09-13.
- **Class/rights:** professional-society clinical guideline; copyrighted Georg
  Thieme Verlag/ESGE material, targeted factual verification only, no reusable
  license asserted.
- **Use/claims:** independent management corroboration for
  `claim.early.bile-leak.minor-leak-ercp-stent`; specifically limited to leaks
  not caused by common-bile-duct or common-hepatic-duct transection.

### SRC-ATLANTA-2013

- **Citation:** Banks PA, Bollen TL, Dervenis C, Gooszen HG, Johnson CD, Sarr
  MG, Tsiotos GG, Vege SS; Acute Pancreatitis Classification Working Group.
  *Classification of acute pancreatitis - 2012: revision of the Atlanta
  classification and definitions by international consensus.* Gut.
  2013;62(1):102-111. doi:10.1136/gutjnl-2012-302779.
- **Organization/authors/year:** Acute Pancreatitis Classification Working
  Group / Gut; Banks, Bollen, Dervenis, Gooszen, Johnson, Sarr, Tsiotos, Vege;
  2013.
- **URL/access:** https://gut.bmj.com/content/62/1/102;
  accessed 2026-09-13.
- **Class/rights:** international consensus classification; publicly readable
  copyrighted journal material, targeted factual verification only, no
  reusable license asserted.
- **Use/claims:** primary classification support for
  `claim.early.pseudocyst.ct-classification`; no management claim.

### SRC-ASGE-PFC-2016

- **Citation:** ASGE Standards of Practice Committee; Muthusamy VR,
  Chandrasekhara V, Acosta RD, Bruining DH, Chathadi KV, Eloubeidi MA, et al.
  *The role of endoscopy in the diagnosis and treatment of inflammatory
  pancreatic fluid collections.* Gastrointestinal Endoscopy.
  2016;83(3):481-488. doi:10.1016/j.gie.2015.11.027.
- **Organization/authors/year:** American Society for Gastrointestinal
  Endoscopy; Muthusamy, Chandrasekhara, Acosta, Bruining, Chathadi, Eloubeidi,
  et al.; 2016.
- **URL/access:** https://www.asge.org/home/resources/publications/guidelines/2016_inflammatory_pancreatic_fluid_collections;
  accessed 2026-09-13.
- **Class/rights:** professional-society practice guideline; copyrighted
  society/journal material, targeted factual verification only, no reusable
  license asserted.
- **Use/claims:** corroborates `claim.early.pseudocyst.ct-classification` and is
  primary management support for
  `claim.early.pseudocyst.symptomatic-endoscopic-drainage`.

### SRC-KSGE-PFC-2021

- **Citation:** Oh CH, Lee JK, Song TJ, Park JS, Lee JM, Son JH, et al.
  *Clinical Practice Guidelines for the Endoscopic Management of Peripancreatic
  Fluid Collections.* Clinical Endoscopy. 2021;54(4):505-521.
  doi:10.5946/ce.2021.185.
- **Organization/authors/year:** Korean Society of Gastrointestinal Endoscopy;
  Oh, Lee, Song, Park, Lee, Son, et al.; 2021.
- **URL/access:** https://pmc.ncbi.nlm.nih.gov/articles/PMC8357592/;
  accessed 2026-09-13.
- **Class/rights:** professional-society clinical practice guideline; CC BY-NC
  3.0. Independently worded noncommercial factual synthesis with attribution.
- **Use/claims:** independent corroboration for symptomatic collection drainage
  and pre-procedure cross-sectional characterization in
  `claim.early.pseudocyst.symptomatic-endoscopic-drainage`.

### SRC-ACG-GERD-2022

- **Citation:** Katz PO, Dunbar KB, Schnoll-Sussman FH, Greer KB, Yadlapati R,
  Spechler SJ. *ACG Clinical Guideline: Guidelines for the Diagnosis and
  Management of Gastroesophageal Reflux Disease.* American Journal of
  Gastroenterology. 2022;117(1):27-56.
  doi:10.14309/ajg.0000000000001538.
- **Organization/authors/year:** American College of Gastroenterology; Katz,
  Dunbar, Schnoll-Sussman, Greer, Yadlapati, Spechler; 2022.
- **URL/access:** https://pmc.ncbi.nlm.nih.gov/articles/PMC8754510/;
  accessed 2026-09-13.
- **Class/rights:** professional-society clinical guideline; copyrighted ACG
  journal material available as an author manuscript, targeted factual
  verification only, no reusable license asserted.
- **Use/claims:** primary support for both GERD claims and the limits that HRM
  does not diagnose GERD and objective evidence should precede invasive therapy.

### SRC-ICARUS-2019

- **Citation:** Pauwels A, Boecxstaens V, Andrews CN, Attwood SE, Berrisford R,
  Bisschops R, et al. *How to select patients for antireflux surgery? The
  ICARUS guidelines (international consensus regarding preoperative
  examinations and clinical characteristics assessment to select adult
  patients for antireflux surgery).* Gut. 2019;68(11):1928-1941.
  doi:10.1136/gutjnl-2019-318260.
- **Organization/authors/year:** ICARUS international consensus group / Gut;
  Pauwels, Boecxstaens, Andrews, Attwood, Berrisford, Bisschops, et al.; 2019.
- **URL/access:** https://pubmed.ncbi.nlm.nih.gov/31375601/;
  accessed 2026-09-13.
- **Class/rights:** international Delphi consensus guideline; free-to-read
  copyrighted BMJ material with no commercial reuse, targeted factual
  verification only.
- **Use/claims:** independent corroboration for both GERD claims: off-therapy
  reflux monitoring when endoscopy lacks unequivocal reflux disease and
  manometry before antireflux surgery to rule out major motility disorders.

### SRC-SFE-PBH-2024

- **Citation:** Hazlehurst J, Khoo B, Brito Lobato C, Ilesanmi I, Abbott S,
  Chan T, et al. *Society for Endocrinology guidelines for the diagnosis and
  management of post-bariatric hypoglycaemia.* Endocrine Connections.
  2024;13(5):e230285. doi:10.1530/EC-23-0285.
- **Organization/authors/year:** Society for Endocrinology; Hazlehurst, Khoo,
  Brito Lobato, Ilesanmi, Abbott, Chan, et al.; 2024.
- **URL/access:** https://www.endocrinology.org/clinical-practice/clinical-guidance/society-for-endocrinology-guidance/;
  full-text record https://pmc.ncbi.nlm.nih.gov/articles/PMC11046333/;
  accessed 2026-09-13.
- **Class/rights:** current professional-society guideline; CC BY 4.0.
  Independently worded claim summaries with attribution.
- **Use/claims:** primary support for
  `claim.early.pbh.whipple-triad-spontaneous-sample` and
  `claim.early.pbh.initial-dietary-care`, including venous plasma preference,
  exclusion of alternative causes, no OGTT/MMT provocation for diagnosis, and
  dietitian-led initial care.

### SRC-ESPEN-UEG-OBESITY-2022

- **Citation:** Bischoff SC, Barazzoni R, Busetto L, Campmans-Kuijpers M,
  Cardinale V, Chermesh I, et al. *European guideline on obesity care in
  patients with gastrointestinal and liver diseases - Joint European Society
  for Clinical Nutrition and Metabolism / United European Gastroenterology
  guideline.* United European Gastroenterology Journal. 2022;10(7):665-722.
  doi:10.1002/ueg2.12280.
- **Organization/authors/year:** ESPEN and United European Gastroenterology;
  Bischoff, Barazzoni, Busetto, Campmans-Kuijpers, Cardinale, Chermesh, et al.;
  2022.
- **URL/access:** https://onlinelibrary.wiley.com/doi/10.1002/ueg2.12280;
  accessed 2026-09-13.
- **Class/rights:** joint professional-society guideline, open access. The
  displayed page did not expose a specific reuse license during this review, so
  treat it as copyrighted and use only targeted factual verification; no
  reusable license is asserted.
- **Use/claims:** corroborates avoidance of OGTT and dietary care for both PBH
  claims. **Conflict/limit:** it accepted a provocative mixed-meal test, whereas
  the newer `SRC-SFE-PBH-2024` recommends against both OGTT and MMT for PBH
  diagnosis. The proposed game contract follows the newer guidance and does not
  author either provocation test as correct.

## Hand-off decisions

1. All five families can proceed to clinician-review authoring if the exact
   exclusions and result-reveal contracts above are preserved.
2. Use CE-MRCP, not HIDA, as the keyed bile-leak test when the question asks for
   localization and continuity. A HIDA-keyed question would need a different
   task limited to demonstrating an active leak and would still need follow-up
   anatomy.
3. Phrase the duct-stone second node as the selected preoperative endoscopic
   pathway, not a universal rule that ERCP must precede cholecystectomy.
4. Keep pseudocyst tied to prior interstitial edematous acute pancreatitis and
   explicitly free of solid debris; otherwise the pseudocyst-versus-walled-off-
   necrosis answer becomes unsafe.
5. PBH is clinically preferable to substituting early dumping syndrome for
   this two-node design. It is nevertheless an inferred Uncommon SCORE mapping;
   replace the whole family if the batch requires explicit Common topics only.
