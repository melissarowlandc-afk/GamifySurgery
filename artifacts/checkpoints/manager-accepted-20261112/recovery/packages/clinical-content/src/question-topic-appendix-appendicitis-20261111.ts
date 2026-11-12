import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import type {
  AnswerChoiceTimingClassification,
  AnswerChoiceTimingRegistryEntry,
  CaseExhibit,
  SyntheticClinicalCase,
  TestedConcept,
} from "./schema";

/** Explicit-import authoring sidecar. The manager controls release admission. */
export const APPENDIX_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const SOURCE = {
  wses2020: "source.appendix-appendicitis.wses-2020",
  sages2024: "source.appendix-appendicitis.sages-2024",
  ascrs2025: "source.appendix-appendicitis.ascrs-2025",
  alliance2024: "source.appendix-appendicitis.alliance-2024",
  wses2017: "source.appendix-appendicitis.wses-iai-2017",
  niddk2021: "source.appendix-appendicitis.niddk-2021",
} as const;

const sourceDefinitions: ClinicalSource[] = [
  {
    ...APPENDIX_TOPIC_DRAFT,
    id: SOURCE.wses2020,
    title: "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
    completeCitation: "Di Saverio S, Podda M, De Simone B, et al. Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines. World J Emerg Surg. 2020;15:27. doi:10.1186/s13017-020-00306-3.",
    organizationOrJournal: "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    authors: ["Salomone Di Saverio", "Mauro Podda", "Belinda De Simone", "et al."],
    publicationYear: 2020,
    doi: "10.1186/s13017-020-00306-3",
    pmid: "32295644",
    officialUrl: "https://link.springer.com/article/10.1186/s13017-020-00306-3",
    accessedOn: "2026-11-11",
    sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes: "Article-level CC BY 4.0 checked in Rights and permissions. Independently synthesized factual applications with attribution. No source prose, tables, figures or algorithms reproduced. A 2025 edition published in 2026 was identified. Exact updated recommendations require a permitted full-text check.",
    authorityAssessment: "GRADE-based international surgical guidance. Older edition, used with newer permitted guidance where available. Recommendations 1.12, 6.3-6.4 and 7.1-7.2 were checked directly.",
    usageRole: "both",
    evidenceClaimIds: [],
  },
  {
    ...APPENDIX_TOPIC_DRAFT,
    id: SOURCE.sages2024,
    title: "SAGES guideline for the diagnosis and treatment of appendicitis",
    completeCitation: "Kumar SS, Collings AT, Lamm R, et al. SAGES guideline for the diagnosis and treatment of appendicitis. Surg Endosc. 2024;38:2974-2994. doi:10.1007/s00464-024-10813-y.",
    organizationOrJournal: "Society of American Gastrointestinal and Endoscopic Surgeons / Surgical Endoscopy",
    authors: ["Sunjay S. Kumar", "Amelia T. Collings", "Ryan Lamm", "Ivy N. Haskins", "Stefan Scholz", "Pramod Nepal", "Arianne T. Train", "Dimitrios I. Athanasiadis", "Philip H. Pucher", "Joel F. Bradley III", "Nader M. Hanna", "Francisco Quinteros", "Nisha Narula", "Bethany J. Slater"],
    publicationYear: 2024,
    doi: "10.1007/s00464-024-10813-y",
    pmid: "38740595",
    officialUrl: "https://www.sages.org/publications/guidelines/guideline-for-the-diagnosis-and-treatment-of-appendicitis/",
    accessedOn: "2026-11-11",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyright SAGES. Targeted factual verification only.",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Public society guideline used for targeted verification of KQ1-3 and KQ6-8. No protected expression reproduced. The legal page returned 403 on direct open, with copyright/privacy information available in search. No affirmative AI-use permission is claimed. No known AI-use prohibition was found for this society page. Sage Publishing is a different publisher and its restricted material was excluded.",
    authorityAssessment: "Multidisciplinary GRADE surgical guideline. Operative and interval recommendations are conditional, with low or very-low certainty. The general interval policy differs from WSES 2020.",
    usageRole: "both",
    evidenceClaimIds: [],
  },
  {
    ...APPENDIX_TOPIC_DRAFT,
    id: SOURCE.ascrs2025,
    title: "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
    completeCitation: "Gaertner WB, Brown SR, Deutsch M, Jafari MD, Krane MK, Simianu VV, Valente MA, Lightner AL, Feingold DL, Paquette IM. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Appendiceal Neoplasms. Dis Colon Rectum. 2025;68(7):815-834. doi:10.1097/DCR.0000000000003796.",
    organizationOrJournal: "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum",
    authors: ["Wolfgang B. Gaertner", "Shaun R. Brown", "Michael Deutsch", "Mehraneh D. Jafari", "Mukta K. Krane", "Vlad V. Simianu", "Michael A. Valente", "Amy L. Lightner", "Daniel L. Feingold", "Ian M. Paquette"],
    publicationYear: 2025,
    doi: "10.1097/DCR.0000000000003796",
    pmid: "40262165",
    officialUrl: "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982016/all/Management_of_Appendiceal_Neoplasms__2025_?q=management+practice",
    accessedOn: "2026-11-11",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyright ASCRS 2025. Targeted factual verification only.",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Read the public society guideline and publicly linked guideline PDF for targeted factual checks. The former free-resource URL now points to another location. No authentication or paywall bypass was used. ASCRS Access to and Use of Works Policy checked. No content, table, algorithm, image or source excerpt is retained. The published guideline is a factual cross-check, with independently written claims and fictional cases.",
    authorityAssessment: "Current specialty GRADE guideline, literature search through February 2025. Several recommendations rest on observational data. Many exact tumor-management decisions have this single directly verified publication in this packet.",
    usageRole: "both",
    evidenceClaimIds: [],
  },
  {
    ...APPENDIX_TOPIC_DRAFT,
    id: SOURCE.alliance2024,
    title: "Intra-abdominal infections survival guide, Global Alliance 2024",
    completeCitation: "Sartelli M, Barie P, Agnoletti V, et al. Intra-abdominal infections survival guide: a position statement by the Global Alliance For Infections In Surgery. World J Emerg Surg. 2024;19:22. doi:10.1186/s13017-024-00552-9.",
    organizationOrJournal: "Global Alliance For Infections In Surgery / World Journal of Emergency Surgery",
    authors: ["Massimo Sartelli", "Philip Barie", "Vanni Agnoletti", "et al."],
    publicationYear: 2024,
    doi: "10.1186/s13017-024-00552-9",
    pmid: null,
    officialUrl: "https://link.springer.com/article/10.1186/s13017-024-00552-9",
    accessedOn: "2026-11-11",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes: "Article license and Springer Nature TDM reservation policy checked. The policy permits CC BY use with attribution. Factual synthesis and constructed applications are original. No source text or exhibits are reproduced.",
    authorityAssessment: "Contemporary multidisciplinary consensus on intra-abdominal infection, with graded statements. Statements 2-3 and 8-9 support source-control assessment and short-course treatment. It shares some authors and evidence with WSES publications, so corroboration is partly overlapping.",
    usageRole: "both",
    evidenceClaimIds: [],
  },
  {
    ...APPENDIX_TOPIC_DRAFT,
    id: SOURCE.wses2017,
    title: "WSES global intra-abdominal infection guidelines, 2017",
    completeCitation: "Sartelli M, Chichom-Mefire A, Labricciosa FM, et al. The management of intra-abdominal infections from a global perspective: 2017 WSES guidelines for management of intra-abdominal infections. World J Emerg Surg. 2017;12:29. doi:10.1186/s13017-017-0141-6.",
    organizationOrJournal: "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    authors: ["Massimo Sartelli", "Alain Chichom-Mefire", "Francesco M. Labricciosa", "et al."],
    publicationYear: 2017,
    doi: "10.1186/s13017-017-0141-6",
    pmid: null,
    officialUrl: "https://link.springer.com/article/10.1186/s13017-017-0141-6",
    accessedOn: "2026-11-11",
    sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes: "Article-level license verified. Original atomic factual synthesis with attribution. Statement 30 was checked for localized postoperative abscess and statement 31 for generalized postoperative peritonitis. Older guidance is cross-checked against Global Alliance 2024.",
    authorityAssessment: "Surgical consensus with graded recommendations. The postoperative-abscess recommendation is low certainty. Substantial authorship and evidence overlap with Global Alliance 2024 limits independence.",
    usageRole: "both",
    evidenceClaimIds: [],
  },
  {
    ...APPENDIX_TOPIC_DRAFT,
    id: SOURCE.niddk2021,
    title: "NIDDK treatment for appendicitis",
    completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Treatment for Appendicitis. National Institutes of Health. Reviewed July 2021. Accessed November 11, 2026.",
    organizationOrJournal: "NIDDK / National Institutes of Health",
    authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"],
    publicationYear: 2021,
    publicationDateNote: "Last reviewed July 2021. Publication date is not separately stated.",
    doi: null,
    pmid: null,
    officialUrl: "https://www.niddk.nih.gov/health-information/digestive-diseases/appendicitis/treatment",
    accessedOn: "2026-11-11",
    sourceClass: "government_guidance",
    licenseLabel: "US government health-information page. Third-party material excluded.",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Used for a narrow general treatment cross-check. Independently written factual statements only. Images and external linked material are excluded.",
    authorityAssessment: "Government patient guidance provides broad treatment context. It does not establish operative extent, imaging protocols, size cutoffs or exact antibiotic duration.",
    usageRole: "cross_check",
    evidenceClaimIds: [],
  },
];

type ClaimDefinition = Omit<EvidenceClaim, keyof typeof APPENDIX_TOPIC_DRAFT | "lastCheckedOn">;
const claimDefinitions: ClaimDefinition[] = [
  {
    id: "claim.appendix-appendicitis.initial-abscess-selection",
    statement: "Initial nonoperative treatment and laparoscopic surgery both have guideline support for selected appendiceal abscess presentations.",
    sourceIds: [SOURCE.wses2020, SOURCE.sages2024], evidenceCategory: "management", certainty: "conflicting",
    limitation: "WSES recommendations 6.1-6.2 condition the approach on expertise and setting. SAGES KQ3 conditionally favors surgery while identifying a discrete abscess and significant cecal inflammation as reasons to consider initial nonoperative care. A universal comparative key is withheld.",
    applicablePopulation: "Stable patients with a primary appendiceal abscess or phlegmon.",
  },
  {
    id: "claim.appendix-appendicitis.young-interval-disagreement",
    statement: "The verified guidelines differ on routine interval appendectomy after successful nonoperative treatment in an asymptomatic younger adult.",
    sourceIds: [SOURCE.wses2020, SOURCE.sages2024], evidenceCategory: "management", certainty: "conflicting",
    limitation: "WSES 2020 recommendation 6.3 advises against routine interval appendectomy in patients younger than 40, reserving it for recurrence. SAGES 2024 KQ8 conditionally favors interval appendectomy in adults. The newer WSES full recommendation needs permitted verification. No general younger-adult item is keyed.",
    applicablePopulation: "Asymptomatic younger adults after successful nonoperative management of appendiceal abscess or phlegmon.",
  },
  {
    id: "claim.appendix-appendicitis.intermediate-net-boundary",
    statement: "Management of appendiceal NETs measuring 1-2 cm requires a more individualized assessment than the larger-tumor resection rule.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "low",
    limitation: "One directly verified current specialty guideline describes controversy and consideration of pathology, patient factors and multidisciplinary review. A mandatory colectomy rule based on one intermediate-size adverse feature is withheld.",
    applicablePopulation: "Adults with an appendiceal NET measuring 1-2 cm.",
  },
  {
    id: "claim.appendix-appendicitis.uncomplicated-postoperative-antibiotics",
    statement: "Definitively treated uncomplicated appendicitis generally requires no postoperative therapeutic antibiotic course.",
    sourceIds: [SOURCE.wses2020, SOURCE.wses2017], evidenceCategory: "management", certainty: "high",
    limitation: "Supports a ranked future gap. The directly verified guidelines share authors and evidence. A sufficiently discriminating new operative-classification question remains to be authored, with the newer guideline checked before exact duration rules are used.",
    applicablePopulation: "Patients after definitive appendectomy for uncomplicated appendicitis.",
  },
  {
    id: "claim.appendix-appendicitis.pregnancy-imaging-sequence",
    statement: "MRI can follow inconclusive ultrasound when appendicitis remains suspected during pregnancy.",
    sourceIds: [SOURCE.wses2020], evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "One directly verified guideline, recommendation 1.13.2, supports the relationship. This is a ranked scope gap with no keyed new pregnancy item. Current population-specific guidance and a consequential close alternative require further permitted verification.",
    applicablePopulation: "Pregnant patients with suspected appendicitis after inconclusive ultrasound.",
  },
  {
    id: "claim.appendix-appendicitis.lamn-complete-resection",
    statement: "Appendectomy is sufficient surgical treatment for a margin-negative LAMN with an intact wall and no peritoneal involvement.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "moderate",
    limitation: "One directly verified current specialty guideline, recommendation 12. Used for counterfactuals and the boundary against invasive carcinoma. Surveillance details remain outside the scored task.",
    applicablePopulation: "Completely resected, nonperforated LAMN without peritoneal disease.",
  },
  {
    id: "claim.appendix-appendicitis.small-favorable-net-resection",
    statement: "A subcentimeter appendiceal NET without unfavorable features can be treated by appendectomy that includes the mesoappendix.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "low",
    limitation: "One directly verified current specialty guideline, recommendation 7. Used as a counterfactual boundary. This packet supplies no universal rule for 1-2-cm tumors or a surveillance schedule.",
    applicablePopulation: "A completely removed appendiceal NET smaller than 1 cm with favorable histology.",
  },
  {
    id: "claim.appendix-appendicitis.persistent-pain-negative-imaging",
    statement: "Progressive or persistent right-sided abdominal pain after negative imaging can warrant exploratory laparoscopy for appendicitis or another cause.",
    sourceIds: [SOURCE.wses2020, SOURCE.niddk2021], evidenceCategory: "management", certainty: "moderate",
    limitation: "WSES recommendation 1.12 directly supports exploration after a progressive clinical course. NIDDK corroborates surgery for ongoing symptoms only at a general level. An adequate negative examination initially supports observation. The 2025 WSES exact update was unavailable for permitted full-text verification.",
    applicablePopulation: "Adults with unresolved right iliac fossa symptoms after cross-sectional evaluation and serial assessment.",
  },
  {
    id: "claim.appendix-appendicitis.ct-after-nondiagnostic-us",
    statement: "CT can resolve persistent diagnostic uncertainty after nondiagnostic ultrasound in a stable nonpregnant adult with suspected appendicitis.",
    sourceIds: [SOURCE.wses2020, SOURCE.sages2024], evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "Used to audit the old modality questions. MRI is also definitive. The legacy availability sentence does much of their discriminating work.",
    applicablePopulation: "Stable nonpregnant adults with uncertain appendicitis.",
  },
  {
    id: "claim.appendix-appendicitis.appendicolith-nom-risk",
    statement: "An appendicolith makes an antibiotics-first appendicitis course less favorable and strengthens the case for appendectomy.",
    sourceIds: [SOURCE.wses2020, SOURCE.sages2024], evidenceCategory: "safety_boundary", certainty: "moderate",
    limitation: "A treatment-risk modifier within shared clinical decisions. No universal prohibition, exact failure probability or uniquely required treatment for every patient is asserted. Used for the legacy audit.",
    applicablePopulation: "Adults considering nonoperative treatment of imaging-confirmed appendicitis.",
  },
  {
    id: "claim.appendix-appendicitis.post-abscess-neoplasm",
    statement: "An older adult recovering from an appendiceal abscess warrants evaluation for an underlying appendiceal or colonic neoplasm.",
    sourceIds: [SOURCE.ascrs2025, SOURCE.wses2020, SOURCE.sages2024], evidenceCategory: "evaluation", certainty: "low",
    limitation: "The drafted patient is 62 with a persistent focal appendiceal abnormality. No age threshold or mandatory policy for all younger adults is keyed. The publications differ on routine interval appendectomy.",
    applicablePopulation: "Adults after nonoperative treatment of complicated appendicitis, especially older patients or those with suspicious interval imaging.",
  },
  {
    id: "claim.appendix-appendicitis.colonoscopy-neoplasm",
    statement: "Suspected appendiceal neoplasia calls for colonoscopy to assess synchronous colonic disease before formal resection planning.",
    sourceIds: [SOURCE.ascrs2025, SOURCE.wses2020], evidenceCategory: "evaluation", certainty: "low",
    limitation: "ASCRS recommendation 1 is the direct current guideline. WSES independently supports colonic screening in the post-abscess older-adult context. Neither establishes colonoscopy as a complete histologic examination of the appendix.",
    applicablePopulation: "Patients with suspected appendiceal tumors, including an older adult with a persistent post-abscess appendiceal nodule.",
  },
  {
    id: "claim.appendix-appendicitis.interval-tissue-evaluation",
    statement: "Interval appendectomy is favored after complicated appendicitis in an older adult with persistent imaging suspicion for appendiceal neoplasia.",
    sourceIds: [SOURCE.ascrs2025, SOURCE.sages2024], evidenceCategory: "management", certainty: "low",
    limitation: "Conditional guidance. The case has resolved infection, a focal residual nodule and a free appendiceal base. Normal cecal mucosa does not supply histology of that mural nodule. Exact timing and a universal younger-adult rule are withheld.",
    applicablePopulation: "An older adult after successful nonoperative treatment of appendiceal abscess with a suspicious persistent lesion.",
  },
  {
    id: "claim.appendix-appendicitis.intact-abnormal-appendix",
    statement: "An abnormal appendix encountered incidentally can be removed intact with a grossly clear base, preserving definitive specimen assessment before deciding on oncologic colectomy.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "low",
    limitation: "One directly verified current specialty guideline, recommendation 2. The base and extent govern resection. Suspected mucinous lesions require avoidance of rupture. No automatic operation is specified for extensive peritoneal disease.",
    applicablePopulation: "An incidentally dilated, unruptured appendix with a separable uninvolved base and no peritoneal deposits.",
  },
  {
    id: "claim.appendix-appendicitis.lamn-margin",
    statement: "A microscopic positive margin in an otherwise completely removed, nonperforated LAMN does not automatically require further resection.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "low",
    limitation: "One directly verified current specialty guideline. The underlying data are limited. This proposal requires exact pathology, absence of gross residual disease, no perforation and no peritoneal mucin. Melissa must review observation against local re-excision. Surveillance intensity is left open.",
    applicablePopulation: "Completely excised nonperforated low-grade appendiceal mucinous neoplasm with microscopic margin involvement and no peritoneal disease.",
  },
  {
    id: "claim.appendix-appendicitis.lamn-versus-invasive",
    statement: "Infiltrative malignant glands distinguish appendiceal adenocarcinoma from a noninfiltrative low-grade mucinous neoplasm.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "definition", certainty: "moderate",
    limitation: "One directly verified current specialty guideline. A fully evaluated permanent specimen is supplied in the draft. A small biopsy or uncertain frozen section would not establish the same extent.",
    applicablePopulation: "Permanent pathology assessment of an appendectomy specimen.",
  },
  {
    id: "claim.appendix-appendicitis.adenocarcinoma-colectomy",
    statement: "Nonmetastatic appendiceal adenocarcinoma generally warrants oncologic right hemicolectomy with regional nodal assessment.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "low",
    limitation: "One directly verified current specialty guideline, recommendation 13. The draft has invasion into mesoappendiceal fat, adequate staging and a fit patient. The recommendation is not generalized to isolated LAMN or disseminated peritoneal disease.",
    applicablePopulation: "Fit adults with invasive appendiceal adenocarcinoma and no distant or peritoneal metastases.",
  },
  {
    id: "claim.appendix-appendicitis.goblet-cell-identity",
    statement: "Infiltrative appendiceal goblet-cell epithelial tumors follow an adenocarcinoma treatment pathway despite possible focal neuroendocrine-marker expression.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "low",
    limitation: "One directly verified current specialty guideline. The exact diagnosis is confirmed on expert permanent review. A stain result by itself is insufficient to reclassify the tumor.",
    applicablePopulation: "Localized appendiceal goblet cell adenocarcinoma.",
  },
  {
    id: "claim.appendix-appendicitis.net-functional-staging",
    statement: "Somatostatin-receptor PET/CT can clarify staging of a well-differentiated appendiceal NET when cross-sectional imaging leaves possible metastases unresolved.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "One directly verified current specialty guideline, recommendation 5. Ga-DOTA PET/CT is favored over older receptor scintigraphy for sensitivity and over FDG PET/CT in well-differentiated NETs. Exact comparative performance estimates are excluded.",
    applicablePopulation: "Patients with appendiceal NETs larger than 2 cm or indeterminate metastatic findings.",
  },
  {
    id: "claim.appendix-appendicitis.net-resection",
    statement: "For a nonmetastatic appendiceal NET larger than 2 cm, right hemicolectomy addresses the regional nodal basin even after a margin-negative appendectomy.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "low",
    limitation: "One directly verified current specialty guideline, recommendation 7. The exact greater-than-2-cm threshold is directly stated there. Management of tumors measuring 1-2 cm is withheld as a disputed boundary.",
    applicablePopulation: "A fit adult with a 2.6-cm well-differentiated appendiceal NET and no distant disease.",
  },
  {
    id: "claim.appendix-appendicitis.peritoneal-mucin-treatment",
    statement: "Selected patients with appendiceal mucinous neoplasia and peritoneal dissemination merit peritoneal-surface surgical assessment for cytoreduction and intraperitoneal treatment.",
    sourceIds: [SOURCE.ascrs2025], evidenceCategory: "management", certainty: "moderate",
    limitation: "One directly verified current specialty guideline, recommendations 13-15. Right colectomy does not by itself address diffuse peritoneal disease. Systemic chemotherapy has limited activity in low-grade disease. Referral does not assert that every patient is operable or requires one HIPEC regimen.",
    applicablePopulation: "A fit patient with biopsy-confirmed low-grade appendiceal mucinous peritoneal disease and no distant solid-organ metastases.",
  },
  {
    id: "claim.appendix-appendicitis.postoperative-ct",
    statement: "Intravenous contrast-enhanced CT helps localize an intra-abdominal infectious source and plan source control in a stable postoperative adult.",
    sourceIds: [SOURCE.alliance2024, SOURCE.wses2017], evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "The publications overlap in authorship and underlying evidence. Clinical recovery followed by renewed deep abdominal symptoms is constructed patient data. CT is compared with focused superficial ultrasound and abdominal radiographs, not with an equally comprehensive appropriate alternative.",
    applicablePopulation: "A stable adult with suspected intra-abdominal infection after appendectomy.",
  },
  {
    id: "claim.appendix-appendicitis.localized-abscess-drainage",
    statement: "A localized postoperative abscess without generalized peritonitis can be treated with image-guided catheter drainage and antibiotics when the collection has a safe access route.",
    sourceIds: [SOURCE.wses2017, SOURCE.alliance2024], evidenceCategory: "management", certainty: "low",
    limitation: "WSES statement 30 and Global Alliance source-control guidance directly support this pathway. Their evidence overlaps. No abscess-size cutoff or universal superiority over operative drainage is claimed. The case supplies a single accessible collection and persistent infection despite antibiotics.",
    applicablePopulation: "A stable adult after appendectomy with a persistent accessible pelvic abscess and no demonstrated ongoing enteric leak.",
  },
  {
    id: "claim.appendix-appendicitis.diffuse-leak-exploration",
    statement: "Generalized postoperative peritonitis or uncontrolled enteric leakage requires prompt operative source control.",
    sourceIds: [SOURCE.wses2017, SOURCE.alliance2024], evidenceCategory: "management", certainty: "moderate",
    limitation: "Used as the decision-changing counterfactual to localized percutaneous drainage. Operation and route depend on physiology and anatomy. Resuscitation and antibiotics are shared background care.",
    applicablePopulation: "Postoperative patients with uncontrolled contamination or generalized peritonitis.",
  },
  {
    id: "claim.appendix-appendicitis.completed-short-course",
    statement: "After adequate source control and clinical recovery, a completed short antibiotic course need not be extended until every inflammatory laboratory result normalizes.",
    sourceIds: [SOURCE.alliance2024, SOURCE.sages2024, SOURCE.wses2020], evidenceCategory: "management", certainty: "moderate",
    limitation: "The patient has already completed four days after drainage. Global Alliance statement 8 directly supports this completed-course scenario and compares fixed treatment with physiologic-normalization endpoints. This item does not ask for a minimum duration or override a shorter current appendicitis protocol. Exact new WSES duration requires a permitted full-text check. Persistent illness would change the task to renewed source assessment.",
    applicablePopulation: "An immunocompetent adult with a drained appendectomy-associated abscess, clinical recovery and a falling mildly elevated leukocyte count.",
  },
];

sourceDefinitions.push({ ...APPENDIX_TOPIC_DRAFT, ...{
  "id": "source.appendix-appendicitis.chenin-2022-cysts",
  "title": "MRI morphology of simple hepatic cysts (Chenin et al., 2022)",
  "completeCitation": "Chenin M, Paisant A, Lebigot J, Bazeries P, Debbi K, Ronot M, Laurent V, Aub? C. Cystic liver lesions: a pictorial review. Insights Imaging. 2022;13:116. doi:10.1186/s13244-022-01242-3.",
  "organizationOrJournal": "Insights into Imaging",
  "authors": [
    "M?gane Chenin",
    "Anita Paisant",
    "J?r?me Lebigot",
    "Paul Bazeries",
    "Kawtar Debbi",
    "Maxime Ronot",
    "Val?rie Laurent",
    "Christophe Aub?"
  ],
  "publicationYear": 2022,
  "doi": "10.1186/s13244-022-01242-3",
  "pmid": "35838923",
  "officialUrl": "https://link.springer.com/article/10.1186/s13244-022-01242-3",
  "accessedOn": "2026-11-11",
  "sourceClass": "narrative_review",
  "licenseLabel": "CC BY 4.0; https://creativecommons.org/licenses/by/4.0/",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level Rights and permissions verified at the publisher. Attribution to Chenin et al. Facts independently restated for a fictional staging record; no prose, table, algorithm, figure or image reproduced. The new application changes the context to an appendiceal NET case.",
  "authorityAssessment": "Peer-reviewed radiology educational review, used only for established cyst imaging morphology and the boundary of noninvasive characterization. It supplies no appendiceal NET management recommendation and is not independent corroboration of the surgical size threshold.",
  "usageRole": "evidence",
  "evidenceClaimIds": []
} });
claimDefinitions.push(
{
  "id": "claim.appendix-appendicitis.complete-specimen-assessment",
  "statement": "A limited appendiceal tissue sample does not establish the final classification of the unsampled lesion; permanent assessment of the complete resection specimen informs candidacy for regional oncologic resection.",
  "sourceIds": [
    "source.appendix-appendicitis.ascrs-2025"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "low",
  "limitation": "Targeted check of ASCRS 2025 recommendation 2 and epithelial classification. The fictional specimen map demonstrates a separate infiltrative focus; no probability of sampling error is asserted. One adequate directly verified guideline.",
  "applicablePopulation": "Appendiceal neoplasm after a limited outside review and complete permanent specimen review."
},
{
  "id": "claim.appendix-appendicitis.cellular-deposit-assessment",
  "statement": "A permanent biopsy containing low-grade mucinous epithelium in a deposit outside the appendix establishes cellular extra-appendiceal disease in that sampled site; an acellular sample from another site does not negate it.",
  "sourceIds": [
    "source.appendix-appendicitis.ascrs-2025"
  ],
  "evidenceCategory": "definition",
  "certainty": "moderate",
  "limitation": "ASCRS 2025 recommendations 2, 11 and 14 support representative biopsy, tissue-based cellularity and limitations of cytology. The conclusion is confined to represented tissue, not a claim that all deposits share that grade or that cytology should be routinely ordered.",
  "applicablePopulation": "Separately labelled mucin and solid-nodule samples obtained at appendectomy."
},
{
  "id": "claim.appendix-appendicitis.hepatic-cyst-mri",
  "statement": "A liver lesion with homogeneous fluid signal, a thin smooth wall and no enhancing internal tissue on adequate contrast MRI has the characteristic morphology of a simple hepatic cyst.",
  "sourceIds": [
    "source.appendix-appendicitis.chenin-2022-cysts"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Publisher full text and CC BY 4.0 verified. This is a narrow morphology claim, not a claim that a negative receptor scan excludes all liver metastases. Imaging must actually resolve the represented lesions.",
  "applicablePopulation": "Adequate precontrast, fluid-sensitive and postcontrast liver MRI of previously indeterminate lesions."
},
{
  "id": "claim.appendix-appendicitis.ct-series-scope",
  "statement": "A CT interpretation is limited to the images actually reviewed; an export missing already acquired images differs from an unperformed acquisition.",
  "sourceIds": [
    "source.appendix-appendicitis.alliance-2024"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "The source supports contrast CT for source localization. Retrieval versus repeat acquisition is the logical consequence of this fictional acquisition and transfer log, not a guideline-tested procedure ranking. The archive confirms the complete current acquisition and immediate review access; a changing clinical state or inadequate source images would invalidate the retrieval key.",
  "applicablePopulation": "Stable postoperative adult whose initial report used a subset of the current CT acquisition."
}
);

export const APPENDIX_TOPIC_CLAIMS: EvidenceClaim[] = claimDefinitions.map(claim => ({
  ...APPENDIX_TOPIC_DRAFT,
  ...claim,
  lastCheckedOn: "2026-11-11",
}));

export const APPENDIX_TOPIC_SOURCES: ClinicalSource[] = sourceDefinitions.map(source => ({
  ...source,
  evidenceClaimIds: APPENDIX_TOPIC_CLAIMS.filter(claim => claim.sourceIds.includes(source.id)).map(claim => claim.id),
}));

interface TopicChoice {
  id: string;
  label: string;
  isCorrect: boolean;
  rationale: string;
  claimIds: string[];
  timing: AnswerChoiceTimingClassification;
  temptation: string;
  counterfactual: string;
}

interface TopicReasoning {
  interpret: string;
  apply: string;
  closestError: string;
  decidingObservation: string;
  consequence: string;
  deletionTest: string;
  counterfactual: string;
  counterfactualChoiceId: string;
  cueAttack: string;
  stageCategory: string;
  difficulty: string;
  oneBestAnswer: string;
  sequenceCheck: string;
  repairRecord: string;
}

interface TopicNode {
  version?: 1 | 2;
  slug: string;
  conceptId: string;
  displayName: string;
  learningObjective: string;
  conceptType: TestedConcept["conceptType"];
  currentUpdate?: string;
  stem: string;
  exhibit?: CaseExhibit;
  choices: [TopicChoice, TopicChoice, TopicChoice];
  explanation: string;
  claimIds: string[];
  reasoning: TopicReasoning;
  previousConceptId: string | null;
  identityReason: string;
}

interface TopicCase {
  version?: 1 | 2;
  presentationVersion?: 1 | 2;
  slug: string;
  displayName: string;
  patientName: string;
  age: number;
  sex: "Female" | "Male";
  complaint: string;
  presentation: string;
  acuity: "stable" | "urgent_stable";
  nodes: TopicNode[];
}

const claimId = (suffix: string) => `claim.appendix-appendicitis.${suffix}`;
const noTest = { kind: "no_test" } as const;
const ctTiming = { kind: "test", timingProfileId: "timing.test.ct" } as const;

/** Key positions vary in source data. Every materialized runtime node also shuffles. */
export const APPENDIX_TOPIC_REVIEWED_CASE_DEFINITIONS: TopicCase[] = [
  {
    slug: "persistent-pain", displayName: "Persistent right-sided pain after imaging",
    patientName: "Nora Bennett", age: 46, sex: "Female", complaint: "Persistent right-sided pain",
    presentation: "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.",
    acuity: "urgent_stable",
    nodes: [
      {
        slug: "persistent-pain-exploration",
        conceptId: "concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1",
        displayName: "Progressive symptoms after negative imaging",
        learningObjective: "Integrate adequate negative imaging with a worsening serial examination to choose further operative evaluation.",
        conceptType: "workup",
        stem: "Which hospital evaluation should be recommended now for {patientName}'s worsening right-sided abdominal findings?",
        choices: [
          { id: "repeat-ct", label: "Repeat contrast-enhanced abdominal and pelvic CT", isCorrect: false,
            rationale: "A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration.",
            claimIds: [claimId("persistent-pain-negative-imaging")], timing: ctTiming,
            temptation: "Treat the earlier scan as an imaging problem that another identical study will settle.",
            counterfactual: "An incomplete outside acquisition with an unexamined symptomatic region would favor obtaining appropriate cross-sectional imaging before exploration." },
          { id: "laparoscopy", label: "Proceed to diagnostic abdominal laparoscopy", isCorrect: true,
            rationale: "Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause.",
            claimIds: [claimId("persistent-pain-negative-imaging")], timing: { kind: "test", timingProfileId: "timing.test.clinical_procedure" },
            temptation: "Respond to the documented clinical progression after the initial observation period.",
            counterfactual: "Resolving pain and a repeatedly soft abdomen would support continued observation." },
          { id: "observation", label: "Continue serial abdominal examinations in hospital", isCorrect: false,
            rationale: "Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration.",
            claimIds: [claimId("persistent-pain-negative-imaging")], timing: noTest,
            temptation: "Give the reassuring CT more weight than the interval examination.",
            counterfactual: "A clearly improving examination without new guarding would support continued monitored observation." },
        ],
        explanation: "The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.",
        claimIds: [claimId("persistent-pain-negative-imaging")],
        previousConceptId: "concept.appendicitis.ct-request-with-urinary-mimic.v1",
        identityReason: "The returned B2B14 task selected a CT protocol. This version scores escalation after adequate negative imaging and clinical progression. It requires a new concept identity and preserves the older protocol construct and history.",
        reasoning: {
          interpret: "Read the acquisition as adequate and the later guarding as genuine progression after an initially reasonable observation period.",
          apply: "Choose exploratory evaluation after the clinical course has outgrown reliance on the initial scan.",
          closestError: "Continue observation because the appendix was described as normal on CT.",
          decidingObservation: "New involuntary guarding and increasingly focal tenderness during observation.",
          consequence: "An evolving operative abdominal process remains untreated.",
          deletionTest: "The acquisition sentence distinguishes repeat imaging from exploration. Deleting the interval deterioration makes observation defensible. Pregnancy status and circulation delimit the acute pathway. Removed the classic migratory-pain and hematuria shortcuts from B2B14.",
          counterfactual: "Replace new guarding with steady pain resolution and a soft repeat examination. Continued hospital observation becomes the best offered plan.",
          counterfactualChoiceId: "observation",
          cueAttack: "All offered actions are credible hospital evaluations and the key has intermediate length. The task asks for evaluation without naming exploration, missed appendicitis or a missing action. The necessary deterioration is clinical evidence. A prior scan and its adequacy preserve a real competing observation strategy.",
          stageCategory: "Current hospital evaluation after completed imaging and observation. Three concrete diagnostic strategies.",
          difficulty: "Predicted moderate for PGY-2/3. The intended error is over-reliance on an adequate negative CT when the serial examination changes. Independent review must judge the strength of this competition.",
          oneBestAnswer: "The documented worsening after observation distinguishes exploration from simply repeating the same adequate scan or extending the same observation strategy.",
          sequenceCheck: "First node has no earlier feedback or future pathology. Its explanation discusses the escalation decision and supplies no later oncologic operation.",
          repairRecord: "The protocol-matching draft was replaced by a new escalation construct. A second manual pass retained scan adequacy and clinical chronology, and removed an extra fever sentence that added no decision information.",
        },
      },
      {
        slug: "invasive-adenocarcinoma-resection",
        conceptId: "concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1",
        displayName: "Completion surgery after invasive appendiceal pathology",
        learningObjective: "Use invasive histology and completed staging to select nodal-basin resection after a margin-negative appendectomy.",
        conceptType: "management",
        currentUpdate: "At later clinic follow-up, {patientName}'s hospital record shows that laparoscopy led to an intact appendectomy. Permanent review of the whole specimen identifies adenocarcinoma with infiltrative glands extending into mesoappendiceal fat. The appendiceal base margin is clear. Staging CT shows no distant or peritoneal disease, and colonoscopy shows no separate colonic lesion. She has recovered and is fit for further surgery.",
        stem: "Which further surgical plan should be recommended for {patientName}'s appendiceal tumor after this appendectomy?",
        choices: [
          { id: "right-colectomy", label: "Oncologic right hemicolectomy with regional nodes", isCorrect: true,
            rationale: "The infiltrative adenocarcinoma and localized staging support an oncologic right colectomy for regional nodal assessment despite a clear appendectomy margin.",
            claimIds: [claimId("lamn-versus-invasive"), claimId("adenocarcinoma-colectomy")], timing: noTest,
            temptation: "Address the regional oncologic field after establishing invasive epithelial disease.",
            counterfactual: "A completely excised nonperforated LAMN would support ending surgical resection after appendectomy." },
          { id: "cecal-cuff", label: "Limited cecal re-excision around the staple line", isCorrect: false,
            rationale: "A cecal cuff addresses local clearance. This specimen already has a clear base margin, while the invasive diagnosis creates a regional nodal question.",
            claimIds: [claimId("adenocarcinoma-colectomy"), claimId("intact-abnormal-appendix")], timing: noTest,
            temptation: "Equate completion cancer surgery with taking a wider local margin.",
            counterfactual: "An incidental lesion involving the appendiceal base without established invasive cancer could call for a limited cecal resection to obtain a grossly clear margin." },
          { id: "completed-resection", label: "Complete surgical treatment with the appendectomy", isCorrect: false,
            rationale: "Clear appendectomy margins establish local removal. The invasive histology still supports regional nodal-basin resection in this fit patient with localized disease.",
            claimIds: [claimId("adenocarcinoma-colectomy")], timing: noTest,
            temptation: "Apply the limited-resection approach for localized low-grade mucinous neoplasia to an invasive carcinoma.",
            counterfactual: "A margin-negative, nonperforated LAMN confined to the appendix would make completed appendectomy sufficient surgical treatment." },
        ],
        explanation: "Infiltrative glands extending into mesoappendiceal fat establish an invasive epithelial tumor. A clear base margin addresses local clearance. For this localized adenocarcinoma, the next surgical issue is the regional nodal basin, supporting oncologic right hemicolectomy.",
        claimIds: [claimId("lamn-versus-invasive"), claimId("adenocarcinoma-colectomy"), claimId("intact-abnormal-appendix"), claimId("lamn-complete-resection")],
        previousConceptId: null,
        identityReason: "New gap objective. The two legacy live concepts concern imaging and antibiotics-versus-operation selection, and contain no postoperative cancer-resection objective.",
        reasoning: {
          interpret: "Distinguish destructive invasive pathology from noninfiltrative mucinous disease and interpret a clear base margin as a local result.",
          apply: "Use localized staging and invasive histology to select regional oncologic resection.",
          closestError: "Treat the margin-negative appendectomy as complete oncologic surgery.",
          decidingObservation: "Permanent whole-specimen invasive glands into mesoappendiceal fat, paired with absence of disseminated disease on completed staging.",
          consequence: "Regional nodal disease remains unstaged and the recommended oncologic field remains unresected.",
          deletionTest: "Deleting permanent invasive histology makes the correct extent indeterminate. Removing completed staging creates a competing disseminated-disease pathway. The clear margin earns its place by making limited local completion appear attractive.",
          counterfactual: "Replace infiltrative carcinoma with margin-negative nonperforated LAMN confined to the appendix. Completed appendectomy becomes sufficient surgical treatment.",
          counterfactualChoiceId: "completed-resection",
          cueAttack: "Three surgical-extent plans answer the same task. The key contains no unique qualifier about safety or discussion. A clear margin supplies a credible reason to stop, while the invasive pattern must change that conclusion.",
          stageCategory: "Definitive surgical extent after permanent pathology and staging.",
          difficulty: "Predicted moderate for PGY-2/3 from confusing local margin clearance with adequate oncologic regional surgery.",
          oneBestAnswer: "The fully characterized invasive localized tumor supports right hemicolectomy. The specimen has already supplied local-margin clearance.",
          sequenceCheck: "The first node explains escalation after imaging and never mentions a malignancy or colectomy. All pathology and staging appear only in this later update.",
          repairRecord: "Replaced an isolated histology-label question with a consequential completion-operation task. Re-solved after moving staging and whole-specimen provenance into the current update.",
        },
      },
    ],
  },
  {
    slug: "post-abscess-lesion", displayName: "Appendiceal lesion after abscess recovery",
    patientName: "Owen Mercer", age: 62, sex: "Male", complaint: "Abscess follow-up",
    presentation: "{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy.",
    acuity: "stable",
    nodes: [
      {
        slug: "post-abscess-colonic-evaluation",
        conceptId: "concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
        displayName: "Colonic evaluation after an appendiceal abscess",
        learningObjective: "Recognize a post-abscess neoplasm concern and select colonic evaluation before formal resection planning.",
        conceptType: "workup",
        stem: "Which investigation should be completed before planning resection of {patientName}'s persistent right-lower-quadrant lesion?",
        choices: [
          { id: "core-biopsy", label: "CT-guided core biopsy of the appendiceal nodule", isCorrect: false,
            rationale: "A needle sample targets the appendiceal lesion but supplies limited tissue and leaves synchronous colonic disease unexamined. Current guidance supports colonoscopy in this preoperative setting.",
            claimIds: [claimId("colonoscopy-neoplasm"), claimId("intact-abnormal-appendix")], timing: { kind: "test", timingProfileId: "timing.test.biopsy" },
            temptation: "Seek a tumor label by the most direct apparent target before considering the adjacent colon.",
            counterfactual: "An unresectable extra-appendiceal mass whose histology will determine systemic therapy may require image-guided tissue sampling after specialist planning." },
          { id: "repeat-ct", label: "Contrast-enhanced abdominal and pelvic CT", isCorrect: false,
            rationale: "The available interval CT has already mapped a resolved collection and a persistent focal lesion. With infection clinically resolved, repeating that acquisition leaves the required colonic assessment outstanding.",
            claimIds: [claimId("colonoscopy-neoplasm"), claimId("postoperative-ct")], timing: ctTiming,
            temptation: "Continue following the prior abscess by imaging while leaving the colon unexamined.",
            counterfactual: "Renewed fever and focal pain after drainage would favor repeat CT to assess a residual infectious source before elective colonic workup." },
          { id: "colonoscopy", label: "Colonoscopy with examination of the cecum", isCorrect: true,
            rationale: "The older post-abscess patient with a persistent appendiceal abnormality warrants evaluation for neoplasia. Colonoscopy assesses synchronous colonic lesions that can alter resection planning.",
            claimIds: [claimId("post-abscess-neoplasm"), claimId("colonoscopy-neoplasm")], timing: { kind: "test", timingProfileId: "timing.test.lower_endoscopy" },
            temptation: "Evaluate the colon before choosing the definitive resection field.",
            counterfactual: "A recent complete high-quality colonoscopy with an adequate cecal examination would remove the need to repeat that examination solely for an unperformed-workup concern." },
        ],
        explanation: "Resolution of an appendiceal abscess leaves an underlying-neoplasm question in this older adult with a persistent nodule. Colonoscopy examines the colon for synchronous disease relevant to resection planning.",
        claimIds: [claimId("post-abscess-neoplasm"), claimId("colonoscopy-neoplasm"), claimId("intact-abnormal-appendix"), claimId("postoperative-ct")],
        previousConceptId: null, identityReason: "New gap objective after nonoperative treatment of complicated appendicitis.",
        reasoning: {
          interpret: "Separate resolution of infection from the persistent focal structural finding and the older patient's neoplasm concern.",
          apply: "Choose the preoperative investigation that examines potentially synchronous colonic disease.",
          closestError: "Biopsy the apparent appendiceal target while bypassing colonic evaluation.",
          decidingObservation: "Persistent appendiceal-cecal nodularity of uncertain origin after abscess resolution in a 62-year-old who has never had colonoscopy.",
          consequence: "A synchronous colonic lesion can be missed while an incomplete operative field is planned.",
          deletionTest: "The collapsed collection and resolved symptoms distinguish this workup from acute drainage. Nodularity of uncertain organ origin and the patient's age give the residual finding importance. Colonoscopy history establishes the acquisition need. Base anatomy remains obscured until the later reassessment.",
          counterfactual: "Replace symptom resolution with renewed fever and focal pain after drainage. Repeat CT to assess residual infection becomes the best offered investigation before elective colonic assessment.",
          counterfactualChoiceId: "repeat-ct",
          cueAttack: "The task asks for an investigation without stating colon screening. All choices are named diagnostic procedures. The key is shorter than both distractors. The nodule gives biopsy a real temptation, while prior abscess resolution and age must be integrated.",
          stageCategory: "Investigation before elective resection planning.",
          difficulty: "Predicted moderate for PGY-2/3 from choosing tissue targeting or repeated abscess imaging before colonic evaluation. The counterfactual changes the actual clinical trajectory and re-ranks the offered CT.",
          oneBestAnswer: "Suspected appendiceal neoplasia and absent prior colonic examination support colonoscopy before formal resection planning.",
          sequenceCheck: "First node supplies no later colonoscopy result. Feedback limits itself to the reason for colonic assessment and avoids the next operation's name.",
          repairRecord: "Removed an unnecessary tumor-marker result, a generic cancer-referral option and an inadequately competitive FDG study. The second pass uses a repeat-CT alternative with a concrete recurrent-infection counterfactual.",
        },
      },
      {
        slug: "post-abscess-interval-appendectomy",
        conceptId: "concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1",
        displayName: "Persistent appendiceal abnormality after abscess recovery",
        learningObjective: "Integrate a normal colonic lumen with persistent appendiceal imaging findings to choose interval tissue evaluation.",
        conceptType: "management",
        currentUpdate: "At follow-up, {patientName}'s colonoscopy has reached the cecum and shows normal mucosa, including the appendiceal orifice. After the surrounding inflammation clears, repeat CT traces the residual mural nodule to the retrocecal appendiceal tip. A normal segment separates it from the cecum, and the base is free. No peritoneal or distant lesions are seen. He is fit for surgery.",
        stem: "Which definitive plan should be recommended for {patientName}'s right-lower-quadrant lesion after this interval reassessment?",
        choices: [
          { id: "surveillance", label: "Continue surveillance with interval abdominal CT", isCorrect: false,
            rationale: "Normal cecal mucosa does not resolve the persistent appendiceal mural abnormality. In this older post-abscess patient with suspicious imaging, current conditional guidance favors interval appendectomy for tissue evaluation.",
            claimIds: [claimId("interval-tissue-evaluation"), claimId("post-abscess-neoplasm")], timing: ctTiming,
            temptation: "Combine symptom resolution and normal colonoscopy into a complete exclusion of underlying neoplasia.",
            counterfactual: "Prohibitive operative risk could favor a surveillance strategy after explicit multidisciplinary assessment of the residual uncertainty." },
          { id: "interval-appendectomy", label: "Perform interval appendectomy with intact retrieval", isCorrect: true,
            rationale: "Persistent suspicious appendiceal imaging after an abscess in this fit older patient supports interval appendectomy. The free base and absence of established invasive cancer support obtaining an intact specimen before deciding on a larger oncologic operation.",
            claimIds: [claimId("interval-tissue-evaluation"), claimId("intact-abnormal-appendix")], timing: noTest,
            temptation: "Obtain the affected organ's definitive tissue while respecting the represented extent.",
            counterfactual: "Proven invasive localized appendiceal adenocarcinoma would favor oncologic right hemicolectomy." },
          { id: "right-colectomy", label: "Perform oncologic right hemicolectomy with nodes", isCorrect: false,
            rationale: "Right hemicolectomy fits an established invasive localized carcinoma. This record supplies a suspicious localized appendix lesion with a free base and definitive histology pending.",
            claimIds: [claimId("intact-abnormal-appendix"), claimId("adenocarcinoma-colectomy")], timing: noTest,
            temptation: "Treat every suspicious appendiceal lesion as an already proven invasive cancer.",
            counterfactual: "Permanent tissue showing invasive localized adenocarcinoma would favor this oncologic extent." },
        ],
        explanation: "The colonoscopy evaluated the colonic lumen. The persistent appendiceal mural lesion still requires its own tissue assessment. In this fit older post-abscess patient, interval appendectomy with intact retrieval is the favored proposed plan. Definitive histology governs any subsequent oncologic extension.",
        claimIds: [claimId("interval-tissue-evaluation"), claimId("intact-abnormal-appendix"), claimId("adenocarcinoma-colectomy"), claimId("post-abscess-neoplasm")],
        previousConceptId: null, identityReason: "New gap objective. The held general younger-adult interval policy remains separate from this older patient with persistent suspicious imaging.",
        reasoning: {
          interpret: "Use the interval CT to resolve the lesion's appendiceal origin and free base, while limiting the normal colonoscopy result to the sampled colonic lumen.",
          apply: "Choose interval organ resection for definitive pathology, with the free base limiting the presently justified extent.",
          closestError: "Treat normal colonoscopy plus symptom resolution as permission to leave the persistent nodule under routine imaging surveillance.",
          decidingObservation: "New interval localization to the retrocecal appendiceal tip with a free base, paired with normal cecal mucosa and definitive appendiceal histology pending.",
          consequence: "Occult appendiceal neoplasia can remain uncharacterized, or an unnecessarily large resection can be undertaken.",
          deletionTest: "Deleting the update restores uncertain organ origin and an obscured base, so the specific limited operation cannot be justified from the earlier record. The repeat CT supplies the appendiceal compartment and actual clearance anatomy. Normal colonic mucosa is valid evidence about its sampled region. Deleting the persistent lesion would return the contested routine-interval policy.",
          counterfactual: "Replace the unresolved lesion with permanent evidence of invasive localized appendiceal adenocarcinoma. Right hemicolectomy becomes the best offered plan.",
          counterfactualChoiceId: "right-colectomy",
          cueAttack: "All choices are specific definitive management plans. The CT surveillance option has the same exact testing metadata as every offered CT. The key has comparable length to both alternatives. Normal colonoscopy is retained as meaningful evidence that can tempt a scope error.",
          stageCategory: "Definitive elective plan after infection resolution and colonic assessment.",
          difficulty: "Predicted moderate to hard for PGY-2/3 from confusing sampled mucosa with appendiceal pathology and choosing either under-treatment or premature oncologic extent.",
          oneBestAnswer: "The suspicious residual lesion, older age and fitness support interval appendectomy, while definitive invasive histology remains pending.",
          sequenceCheck: "The preceding explanation establishes the purpose of colonoscopy only. It supplies no interval operation. The earlier CT leaves origin and base anatomy unresolved, while this update adds actual organ localization and clearance anatomy alongside the normal mucosal result.",
          repairRecord: "The sequence deletion attack found that an initially supplied free base weakened the later update. Moved organ localization and base clearance into the acquired interval CT. Removed the normal-colonoscopy result from the task so the update earns that evidence. Re-solved all three plans without a blanket age cutoff or fixed interval.",
        },
      },
    ],
  },
  {
    slug: "incidental-mucinous-lesion", displayName: "Incidental appendiceal dilation and permanent pathology",
    patientName: "Leah Foster", age: 54, sex: "Female", complaint: "Operative findings review",
    presentation: "{patientName}, a 54-year-old woman, attends the clinic to review a proposed operative plan after diagnostic laparoscopy for persistent abdominal symptoms. The hospital record describes a smooth, distended appendiceal body and tip. The base has a narrow segment of normal-appearing tissue, and the appendix separates from the cecum. Its wall is intact, and inspection shows no peritoneal mucin or implants. Definitive pathology is pending.",
    acuity: "stable",
    nodes: [
      {
        slug: "incidental-lesion-intact-resection",
        conceptId: "concept.appendix-appendicitis.incidental-lesion-intact-resection.v1",
        displayName: "Initial extent for an unruptured appendiceal lesion",
        learningObjective: "Use the base anatomy and uncertain final tumor type to select intact limited resection before definitive oncologic pathology.",
        conceptType: "management",
        stem: "Which initial resection should be recommended for {patientName}'s appendiceal lesion on these operative findings?",
        choices: [
          { id: "right-colectomy", label: "Right hemicolectomy", isCorrect: false,
            rationale: "This extent is appropriate for an established invasive localized carcinoma. The observed dilated appendix with a free base still requires definitive whole-specimen classification.",
            claimIds: [claimId("intact-abnormal-appendix"), claimId("adenocarcinoma-colectomy")], timing: noTest,
            temptation: "Use a possible mucinous neoplasm to justify immediate oncologic colectomy.",
            counterfactual: "Established invasive adenocarcinoma confined to the regional field would support oncologic right colectomy." },
          { id: "appendectomy", label: "Appendectomy", isCorrect: true,
            rationale: "The free normal-appearing base permits limited intact removal. Avoiding rupture preserves the represented localized disease state while permanent pathology determines any further operation.",
            claimIds: [claimId("intact-abnormal-appendix")], timing: noTest,
            temptation: "Match the resection to the actual anatomy while obtaining the definitive specimen.",
            counterfactual: "Extension into the appendiceal base could require a cecal cuff to obtain a grossly clear margin." },
          { id: "cecal-cuff", label: "Partial cecectomy", isCorrect: false,
            rationale: "A cecal cuff can obtain clearance when the appendiceal base is involved. The record describes a separable appendix with a normal base segment available for intact removal.",
            claimIds: [claimId("intact-abnormal-appendix")], timing: noTest,
            temptation: "Take extra cecum to compensate for uncertainty about the lesion's histology.",
            counterfactual: "Gross involvement at the base, with otherwise localized disease, could justify limited cecal resection for clearance." },
        ],
        explanation: "The involved segment and the free base determine the initial resection field. Intact appendectomy can provide definitive whole-specimen assessment here. Avoiding rupture matters when the dilation represents a mucinous lesion, and permanent histology guides any oncologic extension.",
        claimIds: [claimId("intact-abnormal-appendix"), claimId("adenocarcinoma-colectomy")],
        previousConceptId: null, identityReason: "New anatomy-to-operative-extent objective in the assigned appendiceal-lesion scope.",
        reasoning: {
          interpret: "Identify a potentially mucinous appendiceal lesion whose base is physically free and whose disease appears localized.",
          apply: "Choose an intact limited specimen operation while reserving cancer-specific extent for definitive pathology.",
          closestError: "Remove a cecal cuff simply because the appendix is dilated.",
          decidingObservation: "A normal-appearing base segment and separability from the cecum, with intact wall and no peritoneal disease.",
          consequence: "Unnecessary bowel resection or rupture with loss of the localized operative state.",
          deletionTest: "The base anatomy changes appendectomy versus partial cecectomy. The wall and peritoneal observations distinguish a localized intact-resection problem. The pending permanent diagnosis prevents treating suspected tumor as proven invasive carcinoma.",
          counterfactual: "Move gross involvement into the appendiceal base while keeping disease localized. A partial cecal resection becomes the best offered limited-clearance operation.",
          counterfactualChoiceId: "cecal-cuff",
          cueAttack: "Three concise named operations compare extent at the same stage. Removed normal-base wording from the keyed label so the answer requires interpreting the base anatomy. Removed a pre-answer instruction to avoid rupture and retained the operative observations that make intact removal relevant.",
          stageCategory: "Initial operative resection extent for an incidentally abnormal appendix.",
          difficulty: "Predicted moderate for PGY-2/3 from confusing possible tumor type with current anatomic extent or escalating before permanent pathology.",
          oneBestAnswer: "The supplied normal base permits an intact appendectomy, while permanent histologic classification is pending.",
          sequenceCheck: "First node reveals no final grade or margin result. Feedback explains initial extent without teaching how to manage a microscopic positive LAMN margin.",
          repairRecord: "Replaced a remove-versus-ignore safety item with three plausible resection extents. A second cue pass removed normal-base wording from the key and used concise parallel operation names. Re-solved the involved-base counterfactual.",
        },
      },
      {
        slug: "lamn-microscopic-margin",
        conceptId: "concept.appendix-appendicitis.lamn-microscopic-margin.v1",
        displayName: "Microscopic margin after complete nonperforated LAMN resection",
        learningObjective: "Interpret microscopic margin involvement within an otherwise completely resected nonperforated LAMN before recommending additional bowel resection.",
        conceptType: "management",
        currentUpdate: "At later follow-up, {patientName}'s intact appendix has undergone expert permanent review. The complete specimen shows a low-grade appendiceal mucinous neoplasm with no infiltrative invasion. Low-grade mucinous epithelium reaches the microscopic base margin. The surgeon documented removal of all gross disease, an intact wall and no peritoneal mucin. Postoperative imaging shows no residual mass.",
        stem: "Which additional-resection plan should be recommended for {patientName} after this permanent pathology review?",
        choices: [
          { id: "cecal-cuff", label: "Re-excise the cecal staple line with a cecal cuff", isCorrect: false,
            rationale: "Local re-excision treats a residual-clearance problem. The represented lesion is completely removed macroscopically and nonperforated. Limited ASCRS-reviewed data support observation for microscopic margin involvement in this specific LAMN setting.",
            claimIds: [claimId("lamn-margin"), claimId("intact-abnormal-appendix")], timing: noTest,
            temptation: "Apply a general positive-margin rule without considering LAMN biology and gross completeness.",
            counterfactual: "Documented gross residual appendiceal-base lesion would create a local clearance indication for further resection." },
          { id: "right-colectomy", label: "Perform right hemicolectomy with regional nodes", isCorrect: false,
            rationale: "An invasive localized adenocarcinoma would support nodal-basin resection. The fully examined specimen shows noninfiltrative low-grade mucinous disease.",
            claimIds: [claimId("lamn-versus-invasive"), claimId("adenocarcinoma-colectomy"), claimId("lamn-margin")], timing: noTest,
            temptation: "Treat any appendiceal neoplasm with a positive microscopic margin as invasive cancer.",
            counterfactual: "Expert permanent review identifying invasive localized adenocarcinoma would support right hemicolectomy." },
          { id: "observation", label: "Observe after the completed appendiceal resection", isCorrect: true,
            rationale: "For a macroscopically complete, nonperforated LAMN with no peritoneal disease, limited data support observation despite microscopic margin involvement.",
            claimIds: [claimId("lamn-margin")], timing: noTest,
            temptation: "Apply the LAMN-specific margin evidence within the supplied complete specimen and operative record.",
            counterfactual: "Gross residual disease at the base or invasive histology would change the need and extent of further surgery." },
        ],
        explanation: "The margin result must be interpreted with the tumor's noninfiltrative biology, gross completeness and intact wall. The ASCRS 2025 guideline reviews limited data supporting observation after complete nonperforated LAMN removal despite a microscopic positive margin. Surveillance planning remains a separate clinician decision.",
        claimIds: [claimId("lamn-margin"), claimId("lamn-versus-invasive"), claimId("adenocarcinoma-colectomy"), claimId("intact-abnormal-appendix")],
        previousConceptId: null, identityReason: "New pathology-and-clearance objective. It must retain a separate identity from invasive adenocarcinoma completion colectomy.",
        reasoning: {
          interpret: "Integrate the microscopic margin with complete permanent sampling, noninfiltrative LAMN and absence of rupture or gross residual disease.",
          apply: "Use the specific LAMN margin evidence to choose observation over reflex local or regional resection.",
          closestError: "Schedule cecal re-excision for every positive microscopic appendectomy margin.",
          decidingObservation: "Microscopic low-grade epithelium at the margin within a macroscopically complete, nonperforated LAMN resection.",
          consequence: "An additional bowel operation can be performed without a supported residual-disease indication.",
          deletionTest: "Removing gross completeness makes local re-excision plausible. Removing full permanent review or intact-wall documentation erases the narrow evidence boundary. Postoperative imaging supplies the residual-mass assessment.",
          counterfactual: "Replace microscopic-only involvement with a documented gross residual base lesion. Local cecal re-excision becomes the best offered clearance plan, subject to its definitive histology.",
          counterfactualChoiceId: "cecal-cuff",
          cueAttack: "Three specific additional-resection policies are offered. The key is the shortest and uses the same action form. The full specimen and intact-wall findings are necessary eligibility evidence. The task avoids stating an indolent-tumor rule before the answer.",
          stageCategory: "Need for further resection after complete operative and permanent pathology review.",
          difficulty: "Predicted hard for PGY-2/3 because the familiar positive-margin rule competes with a narrow LAMN-specific exception supported by limited data.",
          oneBestAnswer: "Observation is the supported proposed key within the exact nonperforated, grossly complete LAMN boundary. Melissa must confirm the clinical ranking against local re-excision.",
          sequenceCheck: "The earlier node addresses initial anatomic resection. Its feedback never mentions microscopic margins or the observation policy tested here. The new expert report is essential.",
          repairRecord: "Removed a generic reassurance phrase from the presentation. Added whole-specimen provenance and the surgeon's gross-completeness record, then repeated the counterfactual against residual base disease.",
        },
      },
    ],
  },
  {
    slug: "peritoneal-mucin", displayName: "Peritoneal disease after appendiceal mucinous pathology",
    patientName: "Marcus Reed", age: 57, sex: "Male", complaint: "Increasing abdominal girth",
    presentation: "{patientName}, a 57-year-old man, attends the clinic after appendectomy pathology identified a low-grade mucinous neoplasm with a wall defect. His abdominal girth has continued to increase. CT shows mucinous-appearing material across the pelvis and upper abdomen with scalloping of the liver surface. A peritoneal implant biopsy contains low-grade mucinous epithelium. He remains active, without bowel obstruction or solid-organ metastases.",
    acuity: "stable",
    nodes: [
      {
        slug: "peritoneal-mucin-referral",
        conceptId: "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
        displayName: "Treatment field for appendiceal mucinous peritoneal disease",
        learningObjective: "Integrate cellular peritoneal pathology and disease distribution to choose the appropriate oncologic treatment service.",
        conceptType: "management",
        stem: "Which treatment referral should be recommended now for {patientName}'s appendiceal mucinous disease?",
        choices: [
          { id: "medical-oncology", label: "Medical oncology for initial systemic chemotherapy", isCorrect: false,
            rationale: "Systemic treatment can be important in high-grade, unresectable or selected metastatic epithelial disease. This fit patient has low-grade mucinous peritoneal disease, for which a peritoneal-surface surgical assessment addresses the represented treatment field.",
            claimIds: [claimId("peritoneal-mucin-treatment")], timing: noTest,
            temptation: "Treat all dissemination as a reason to begin systemic chemotherapy.",
            counterfactual: "High-grade unresectable disease or solid-organ metastases could favor a systemic-treatment pathway after multidisciplinary assessment." },
          { id: "peritoneal-service", label: "Peritoneal surgery for cytoreduction and HIPEC review", isCorrect: true,
            rationale: "Cellular low-grade mucin outside the appendix and broad peritoneal distribution support assessment for cytoreduction and intraperitoneal treatment. Specialist review determines resectability and the appropriate treatment components.",
            claimIds: [claimId("peritoneal-mucin-treatment")], timing: noTest,
            temptation: "Match the definitive treatment field to the peritoneal distribution and low-grade biology.",
            counterfactual: "An invasive carcinoma localized to the appendix and regional nodes would favor colorectal oncologic resection." },
          { id: "colorectal-service", label: "Colorectal surgery for completion right hemicolectomy", isCorrect: false,
            rationale: "A right colectomy addresses a regional bowel and nodal field. The represented low-grade mucinous disease occupies multiple peritoneal regions, which require a peritoneal-surface treatment assessment.",
            claimIds: [claimId("peritoneal-mucin-treatment"), claimId("adenocarcinoma-colectomy")], timing: noTest,
            temptation: "Transfer the localized appendiceal-cancer completion operation to disseminated mucinous disease.",
            counterfactual: "Nonmetastatic invasive appendiceal adenocarcinoma would support referral for oncologic right colectomy." },
        ],
        explanation: "The implant contains neoplastic epithelium and the imaging maps disease across the peritoneum. This fit patient needs a peritoneal-surface surgical assessment for cytoreduction and possible HIPEC. The final treatment depends on resectability, distribution and specialist review.",
        claimIds: [claimId("peritoneal-mucin-treatment"), claimId("adenocarcinoma-colectomy")],
        previousConceptId: null, identityReason: "New treatment-field objective. It is separate from local LAMN margin management and regional invasive-cancer resection.",
        reasoning: {
          interpret: "Use sampled epithelial cells to establish cellular peritoneal disease and the scan to map its distribution beyond a regional bowel field.",
          apply: "Select the service that evaluates cytoreduction and intraperitoneal therapy for low-grade peritoneal disease.",
          closestError: "Recommend a standard completion right colectomy for every appendiceal neoplasm.",
          decidingObservation: "Low-grade epithelium in a peritoneal implant together with disease spanning the pelvis and upper abdomen.",
          consequence: "A regional operation can leave the consequential peritoneal disease unaddressed.",
          deletionTest: "The implant biopsy distinguishes cellular disease from an uncharacterized fluid finding. Distribution determines the treatment field. Activity, obstruction status and solid-organ staging delimit a planned specialist treatment discussion.",
          counterfactual: "Replace the peritoneal findings with localized invasive appendiceal adenocarcinoma and completed negative distant staging. The colorectal referral for right hemicolectomy becomes appropriate.",
          counterfactualChoiceId: "colorectal-service",
          cueAttack: "All options are named service referrals for a specified treatment. Each has a comparable service-plus-plan structure. The task avoids a request for a peritoneal procedure. Raw imaging and sampled histology must jointly determine the field and biology.",
          stageCategory: "Definitive oncology treatment referral after tissue and cross-sectional characterization.",
          difficulty: "Predicted moderate to hard for PGY-2/3 from choosing between regional colectomy, systemic treatment and a peritoneal-surface operation.",
          oneBestAnswer: "The supplied low-grade cellular peritoneal disease and fitness support specialist cytoreduction/HIPEC assessment. Actual operability remains for that assessment.",
          sequenceCheck: "Standalone case. No preceding margin or colectomy explanation is visible and no later node is rehearsed.",
          repairRecord: "Replaced a single diagnostic-label question with a service-and-treatment-field decision. Added actual implant provenance so presumed mucin on imaging does not carry the diagnosis by itself.",
        },
      },
    ],
  },
  {
    slug: "goblet-cell-pathology", displayName: "Goblet cell appendiceal pathology",
    patientName: "Elena Brooks", age: 49, sex: "Female", complaint: "Appendectomy pathology review",
    presentation: "{patientName}, a 49-year-old woman, attends the clinic after appendectomy. The outside report called a 1.4-cm lesion a goblet cell carcinoid. Expert permanent review of the complete specimen describes infiltrative clusters of mucin-filled goblet cells in the appendiceal wall, with focal synaptophysin staining. The base margin is clear. CT shows no peritoneal or distant lesions, colonoscopy shows no separate colonic lesion, and she is fit for surgery.",
    acuity: "stable",
    nodes: [
      {
        slug: "goblet-cell-oncologic-resection",
        conceptId: "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
        displayName: "Resection after goblet cell adenocarcinoma",
        learningObjective: "Reconcile a historical carcinoid label with definitive goblet cell adenocarcinoma pathology when selecting completion surgery.",
        conceptType: "management",
        stem: "Which further surgical plan should be recommended for {patientName}'s appendiceal tumor after expert pathology review?",
        choices: [
          { id: "completed-resection", label: "Complete surgical treatment with the appendectomy", isCorrect: false,
            rationale: "A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway.",
            claimIds: [claimId("goblet-cell-identity"), claimId("adenocarcinoma-colectomy")], timing: noTest,
            temptation: "Anchor on the old carcinoid label, small measured size and focal neuroendocrine stain.",
            counterfactual: "A completely removed subcentimeter well-differentiated NET without unfavorable features would support completed appendectomy." },
          { id: "cecal-cuff", label: "Re-excise the appendiceal base with a cecal cuff", isCorrect: false,
            rationale: "The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved.",
            claimIds: [claimId("goblet-cell-identity"), claimId("adenocarcinoma-colectomy"), claimId("intact-abnormal-appendix")], timing: noTest,
            temptation: "Treat further surgery as a local-margin operation after a small appendiceal tumor.",
            counterfactual: "Gross localized base involvement of an unclassified appendiceal lesion could require limited cecal resection for clearance." },
          { id: "right-colectomy", label: "Perform right hemicolectomy with regional nodes", isCorrect: true,
            rationale: "The definitive infiltrative goblet cell adenocarcinoma diagnosis governs the plan. Current ASCRS guidance includes this tumor in the localized appendiceal adenocarcinoma recommendation for oncologic right colectomy.",
            claimIds: [claimId("goblet-cell-identity"), claimId("adenocarcinoma-colectomy")], timing: noTest,
            temptation: "Use the current epithelial cancer identity and localized stage to select regional oncologic resection.",
            counterfactual: "A fully excised small favorable NET would support ending surgery after appendectomy." },
        ],
        explanation: "The expert permanent diagnosis supersedes the historical carcinoid terminology. Goblet cell adenocarcinoma follows an adenocarcinoma treatment pathway despite focal neuroendocrine staining. With localized staging and fitness for surgery, oncologic right hemicolectomy addresses the regional nodes.",
        claimIds: [claimId("goblet-cell-identity"), claimId("adenocarcinoma-colectomy"), claimId("intact-abnormal-appendix"), claimId("small-favorable-net-resection")],
        previousConceptId: null, identityReason: "New histologic-identity-to-treatment objective. It preserves a distinct construct from well-differentiated appendiceal NET size decisions.",
        reasoning: {
          interpret: "Recognize an infiltrative goblet-cell epithelial tumor on the complete permanent specimen despite historical carcinoid terminology and focal neuroendocrine staining.",
          apply: "Choose the localized adenocarcinoma resection pathway despite the small size and clear local margin.",
          closestError: "Apply small-NET surgical rules because the original report used carcinoid.",
          decidingObservation: "Complete permanent sampling shows infiltrative mucin-filled goblet-cell clusters, with focal synaptophysin expression.",
          consequence: "A clinically distinct invasive epithelial cancer receives an inadequate regional surgical plan.",
          deletionTest: "Historical terminology, size and staining each establish the competing NET interpretation. Definitive review resolves it. Staging and fitness delimit the completion-operation recommendation. The clear margin distinguishes local from nodal completion.",
          counterfactual: "Replace expert review with a completely removed 0.7-cm grade-1 well-differentiated NET without unfavorable features. Complete treatment with appendectomy becomes the appropriate offered surgical plan.",
          counterfactualChoiceId: "completed-resection",
          cueAttack: "Three specific surgical-extent choices share the same task. The current report supplies morphology while withholding the updated tumor label, so the historical carcinoid wording requires reinterpretation. The key carries no unique counseling or caution qualifier.",
          stageCategory: "Completion surgical extent after definitive pathology and staging.",
          difficulty: "Predicted moderate to hard for PGY-2/3 because a familiar small-carcinoid rule competes with updated tumor identity.",
          oneBestAnswer: "The infiltrative goblet-cell epithelial morphology and localized stage favor the adenocarcinoma nodal-resection pathway.",
          sequenceCheck: "Standalone case. The learner has no earlier NET or colectomy explanation in the visible encounter.",
          repairRecord: "Removed an immunostain-only classification task. A second pass also removed the explicit updated diagnosis from the presentation, retaining complete permanent morphology and the concrete surgical consequence. Re-solved the small favorable NET counterfactual.",
        },
      },
    ],
  },
  {
    slug: "net-staging", displayName: "Appendiceal NET staging and regional surgery",
    patientName: "Isaac Palmer", age: 41, sex: "Male", complaint: "Appendiceal tumor review",
    presentation: "{patientName}, a 41-year-old man, attends the clinic after appendectomy identified a 2.6-cm well-differentiated grade-1 neuroendocrine tumor. The base margin is clear. Staging CT describes two small liver lesions that remain indeterminate on its acquired phases. The chest has no suspicious lesion. He is fit for further surgery.",
    acuity: "stable",
    nodes: [
      {
        slug: "net-receptor-staging",
        conceptId: "concept.appendix-appendicitis.net-indeterminate-metastases-staging.v1",
        displayName: "Functional staging of a well-differentiated appendiceal NET",
        learningObjective: "Combine well-differentiated NET biology and indeterminate cross-sectional staging to select receptor-targeted functional imaging.",
        conceptType: "workup",
        stem: "Which functional imaging study should next complete {patientName}'s appendiceal tumor staging?",
        choices: [
          { id: "fdg", label: "18F-FDG PET/CT", isCorrect: false,
            rationale: "The supplied tumor is well differentiated. Current ASCRS guidance favors somatostatin-receptor PET/CT over FDG PET/CT for detecting disease in this setting.",
            claimIds: [claimId("net-functional-staging")], timing: { kind: "test", timingProfileId: "timing.test.pet_ct" },
            temptation: "Apply a general metabolically active cancer-staging strategy to every appendiceal malignancy.",
            counterfactual: "A different, poorly differentiated or high-grade cancer biology can create an FDG-staging question. Exact use in that setting needs its own supported item." },
          { id: "dotatate", label: "68Ga-DOTATATE PET/CT", isCorrect: true,
            rationale: "The well-differentiated NET and unresolved possible metastatic lesions create a receptor-imaging indication. Ga-DOTA PET/CT can add staging information and has higher sensitivity than older receptor scintigraphy.",
            claimIds: [claimId("net-functional-staging")], timing: { kind: "test", timingProfileId: "timing.test.pet_ct" },
            temptation: "Match receptor-targeted imaging to the tumor biology and residual staging question.",
            counterfactual: "A documented service limitation preventing receptor PET/CT can make the older somatostatin-receptor scintigraphy pathway an alternative after specialist review." },
          { id: "pentetreotide", label: "111In-pentetreotide scintigraphy", isCorrect: false,
            rationale: "Older somatostatin-receptor scintigraphy targets a relevant pathway but has largely been replaced by more sensitive Ga-DOTA PET/CT when the latter is available.",
            claimIds: [claimId("net-functional-staging")], timing: { kind: "test", timingProfileId: "timing.test.nuclear_imaging" },
            temptation: "Choose the familiar older receptor study without comparing its current role with PET-based receptor imaging.",
            counterfactual: "Receptor PET/CT unavailability could support specialist use of the older receptor study. That resource-constrained ranking is outside the present unconstrained comparison." },
        ],
        explanation: "The lesion is a well-differentiated NET and the CT leaves possible metastatic disease unresolved. Somatostatin-receptor PET/CT can clarify staging in this situation. ASCRS describes Ga-DOTA PET/CT as more sensitive than older receptor scintigraphy for well-differentiated NET assessment.",
        claimIds: [claimId("net-functional-staging")], previousConceptId: null,
        identityReason: "New staging objective distinct from the subsequent resection-extent decision.",
        reasoning: {
          interpret: "Identify well-differentiated NET biology and distinguish an indeterminate liver result from either established metastasis or adequate negative staging.",
          apply: "Choose the current receptor-targeted functional imaging method to resolve the staging question.",
          closestError: "Choose FDG PET/CT because the patient has cancer, or choose older receptor scintigraphy without comparing its current role.",
          decidingObservation: "Grade-1 well-differentiated NET with possible liver involvement unresolved by the acquired CT phases.",
          consequence: "The residual metastatic question can be staged with a less appropriate functional technique before further surgery.",
          deletionTest: "Grade and differentiation determine the biologic target. Indeterminate liver lesions establish the need for additional staging. Tumor size keeps the case inside the guideline's explicit higher-risk imaging scope. Clear base margin preserves a competing assumption of completed local surgery.",
          counterfactual: "Make receptor PET/CT unavailable while preserving the well-differentiated tumor and staging uncertainty. Older somatostatin-receptor scintigraphy becomes the relevant offered alternative after specialist review.",
          counterfactualChoiceId: "pentetreotide",
          cueAttack: "All three options are functional nuclear studies with complete test estimates. The task says functional imaging without naming a receptor. The key is neither longest nor the sole specific modality. The grade and unresolved liver findings earn the inference.",
          stageCategory: "Functional staging study after cross-sectional imaging.",
          difficulty: "Predicted moderate for PGY-2/3 from confusing generic FDG staging with receptor-targeted NET staging and comparing current with older receptor imaging.",
          oneBestAnswer: "In the ordinary available-modality comparison, Ga-DOTA PET/CT best matches well-differentiated NET staging. The resource counterfactual changes that comparison explicitly.",
          sequenceCheck: "First node has no receptor study result or surgical recommendation in the visible context. Its feedback avoids the right-colectomy size rule tested later.",
          repairRecord: "Removed a generic PET-versus-no-imaging choice. Used three real functional studies, retained the actual CT uncertainty and removed a pre-answer receptor-availability sentence.",
        },
      },
      {
        slug: "net-regional-resection",
        conceptId: "concept.appendix-appendicitis.large-net-regional-resection.v1",
        displayName: "Regional surgery after a large appendiceal NET",
        learningObjective: "Distinguish clear local margins from regional oncologic adequacy after staging a large appendiceal NET.",
        conceptType: "management",
        currentUpdate: "At later follow-up, {patientName}'s completed liver characterization shows simple cysts, and the multidisciplinary staging review finds no distant disease. The permanent appendix specimen confirms a 2.6-cm well-differentiated NET with a clear base margin. The appendectomy included the mesoappendix, and he remains fit for surgery.",
        stem: "Which further surgical plan should be recommended for {patientName}'s localized 2.6-cm appendiceal NET?",
        choices: [
          { id: "completed-resection", label: "Complete surgical treatment with the appendectomy", isCorrect: false,
            rationale: "A clear local margin and mesoappendix removal establish the appendectomy field. The tumor exceeds the directly supported 2-cm size boundary for recommending regional right hemicolectomy.",
            claimIds: [claimId("net-resection")], timing: noTest,
            temptation: "Equate a margin-negative appendectomy with adequate regional treatment regardless of tumor size.",
            counterfactual: "A completely removed subcentimeter NET without unfavorable features can be adequately treated by appendectomy including the mesoappendix." },
          { id: "cecal-cuff", label: "Re-excise the appendiceal base with a cecal cuff", isCorrect: false,
            rationale: "A cecal cuff addresses local clearance. This tumor has a clear base margin, while its size makes the regional nodal field consequential.",
            claimIds: [claimId("net-resection"), claimId("intact-abnormal-appendix")], timing: noTest,
            temptation: "Treat completion surgery as a wider local-margin operation.",
            counterfactual: "A different localized lesion involving the base could call for a cecal cuff to obtain initial gross clearance. A margin-positive appendiceal NET requires its own oncologic review." },
          { id: "right-colectomy", label: "Perform right hemicolectomy with regional nodes", isCorrect: true,
            rationale: "For a fit patient with a nonmetastatic appendiceal NET larger than 2 cm, ASCRS guidance supports right hemicolectomy to address the regional nodal basin despite the clear appendectomy margin.",
            claimIds: [claimId("net-resection")], timing: noTest,
            temptation: "Apply the size and stage evidence to the regional surgical field.",
            counterfactual: "A completely excised subcentimeter favorable NET would favor ending surgical resection after appendectomy." },
        ],
        explanation: "Completed staging establishes a localized surgical problem. The clear base margin addresses local clearance, while the 2.6-cm tumor exceeds the ASCRS greater-than-2-cm boundary for right hemicolectomy with regional nodal assessment.",
        claimIds: [claimId("net-resection"), claimId("intact-abnormal-appendix"), claimId("small-favorable-net-resection")], previousConceptId: null,
        identityReason: "New regional-resection objective. The separate functional-staging concept retains its own identity and scheduling history.",
        reasoning: {
          interpret: "Read completed staging as localized disease and a clear base margin as evidence about the local appendectomy field.",
          apply: "Apply the directly sourced greater-than-2-cm boundary to the regional nodal operation.",
          closestError: "End surgery because the base margin is clear and the mesoappendix was included.",
          decidingObservation: "A confirmed 2.6-cm NET with no distant disease in a fit patient.",
          consequence: "The regional nodal basin receives neither the recommended resection nor its staging assessment.",
          deletionTest: "Without completed staging, the definitive treatment field remains unresolved. Without tumor size, the recommendation enters the controversial intermediate range. The clear margin and mesoappendix record make completed appendectomy a credible competing plan.",
          counterfactual: "Change the primary to a completely removed 0.7-cm well-differentiated NET with no unfavorable features. Completed appendectomy becomes the best offered surgical plan.",
          counterfactualChoiceId: "completed-resection",
          cueAttack: "Three specific surgical extents are compared. The question supplies the known diagnosis because operative extent is scored. No option is a generic discussion plan. The key has comparable length and no unique caution language. Clinical size recall remains part of the inference.",
          stageCategory: "Regional surgical extent after permanent pathology and completed staging.",
          difficulty: "Predicted moderate for PGY-2/3 from confusing local clearance with regional oncologic adequacy. Independent review should scrutinize whether the size rule is sufficiently discriminating.",
          oneBestAnswer: "The directly supported size boundary and localized staging support right hemicolectomy. The intermediate-size controversy is outside the supplied measurements.",
          sequenceCheck: "The preceding functional-imaging feedback discusses receptor staging only. This update supplies the actual completed staging result needed to choose the operative field.",
          repairRecord: "Replaced a size-threshold label question with a local-versus-regional completion plan. Kept the exact sourced boundary and added the completed local-field record for the closest error.",
        },
      },
    ],
  },
  {
    slug: "postoperative-source-control", displayName: "Post-appendectomy infection and recovery",
    patientName: "Maya Collins", age: 35, sex: "Female", complaint: "Pain after appendectomy",
    presentation: "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.",
    acuity: "urgent_stable",
    nodes: [
      {
        slug: "postoperative-infection-imaging",
        conceptId: "concept.appendix-appendicitis.postoperative-deep-infection-imaging.v1",
        displayName: "Investigation after post-appendectomy deterioration",
        learningObjective: "Use a renewed postoperative inflammatory course and symptom depth to select imaging that maps a possible intra-abdominal source.",
        conceptType: "workup",
        stem: "Which investigation should the acute-care team obtain next for {patientName}'s renewed symptoms after appendectomy?",
        choices: [
          { id: "port-ultrasound", label: "Targeted ultrasound of the abdominal port sites", isCorrect: false,
            rationale: "A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field.",
            claimIds: [claimId("postoperative-ct")], timing: { kind: "test", timingProfileId: "timing.test.ultrasound" },
            temptation: "Attribute postoperative infection to the incision and choose the most accessible target.",
            counterfactual: "A focal swollen erythematous port-site mass with otherwise reassuring recovery could make a targeted superficial study appropriate." },
          { id: "abdominal-ct", label: "Contrast-enhanced abdominal and pelvic CT", isCorrect: true,
            rationale: "The recovery-then-deterioration pattern raises a deep intra-abdominal source question. Intravenous contrast-enhanced CT maps collections and their relation to bowel for subsequent source-control planning.",
            claimIds: [claimId("postoperative-ct")], timing: ctTiming,
            temptation: "Map the deep postoperative field after integrating trajectory, fever and pelvic localization.",
            counterfactual: "An isolated superficial port-site mass with a reassuring abdominal course would shift the target to port-site imaging." },
          { id: "radiographs", label: "Upright and supine abdominal radiographs", isCorrect: false,
            rationale: "Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential.",
            claimIds: [claimId("postoperative-ct")], timing: { kind: "test", timingProfileId: "timing.test.radiography" },
            temptation: "Treat the distension as a bowel-gas question while underweighting the inflammatory trajectory.",
            counterfactual: "A distinct supported bowel-obstruction or foreign-body question could call for radiographs. The present source-control investigation has a different target." },
        ],
        explanation: "The return of fever and deep pelvic pain after initial recovery raises concern for a postoperative intra-abdominal source. CT with intravenous contrast maps the source and the anatomy needed for a treatment plan. A focused port study and plain films examine narrower targets.",
        claimIds: [claimId("postoperative-ct")], previousConceptId: null,
        identityReason: "New postoperative source-localization objective, distinct from the legacy initial adult appendicitis modality decision.",
        reasoning: {
          interpret: "Read renewed fever after initial recovery and deep pelvic symptoms as a source-localization problem despite distension and reassuring incisions.",
          apply: "Choose contrast-enhanced cross-sectional assessment of the entire relevant postoperative field.",
          closestError: "Request abdominal radiographs for distension and assume the rest of the postoperative course is expected ileus.",
          decidingObservation: "New fever and deep pelvic pain after eating had resumed.",
          consequence: "A deep collection or ongoing source remains uncharacterized and source control is delayed.",
          deletionTest: "Recovery followed by deterioration changes the interpretation of distension. Symptom depth and incision observations distinguish the imaging target. Stability, pregnancy status and contrast history delimit this CT comparison.",
          counterfactual: "Replace the deep inflammatory course with an isolated tender erythematous port-site mass and otherwise reassuring abdominal recovery. Targeted port-site ultrasound becomes the appropriate offered investigation.",
          counterfactualChoiceId: "port-ultrasound",
          cueAttack: "All three choices are real investigations and carry test estimates. The task avoids naming an abscess or CT. The negative incision observation localizes the clinical question, while the distension provides the credible radiograph temptation. The key is shorter than the port-site option.",
          stageCategory: "Current investigation of renewed postoperative symptoms.",
          difficulty: "Predicted moderate for PGY-2/3 from mistaking the renewed inflammatory course for uncomplicated ileus or a superficial wound problem.",
          oneBestAnswer: "Stable physiology permits cross-sectional localization, and the represented deep inflammatory problem calls for abdominal and pelvic source mapping.",
          sequenceCheck: "First node includes no collection measurement, drainage route or antibiotic endpoint. Those findings are revealed only in later updates.",
          repairRecord: "Replaced an abscess-diagnosis giveaway with a trajectory-and-target imaging task. Removed a sentence announcing the missing CT and supplied contrast-related context without a numeric cutoff.",
        },
      },
      {
        slug: "postoperative-abscess-drainage",
        conceptId: "concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1",
        displayName: "Source control of a localized post-appendectomy collection",
        learningObjective: "Interpret localized anatomy and treatment response to choose a source-control route after appendectomy.",
        conceptType: "management",
        currentUpdate: "The receiving hospital's CT shows a 5.5-cm rim-enhancing pelvic collection containing gas. It abuts the bladder and rectum, with a posterior catheter path clear of bowel. No enteric contrast leak or diffuse intraperitoneal fluid is seen. Fever and focal pain persist after intravenous antibiotics. {patientName} remains alert with stable blood pressure and no diffuse rigidity.",
        stem: "Which source-control plan should be recommended now for {patientName}'s postoperative pelvic collection?",
        choices: [
          { id: "antibiotics", label: "Continue intravenous antibiotics with serial examination", isCorrect: false,
            rationale: "Antibiotics can suffice for selected small or resolving collections. Persistent infection with this organized accessible collection supports evacuation as part of source control.",
            claimIds: [claimId("localized-abscess-drainage")], timing: noTest,
            temptation: "Treat stable physiology as evidence that antimicrobial treatment has controlled the source.",
            counterfactual: "A small collection shrinking with complete clinical improvement and no safe access route could support continued medical management." },
          { id: "operative-exploration", label: "Perform operative exploration with pelvic drainage", isCorrect: false,
            rationale: "Exploration can control generalized contamination, an ongoing enteric leak or a collection inaccessible to percutaneous treatment. The supplied single localized collection has a safe catheter route and stable physiology.",
            claimIds: [claimId("localized-abscess-drainage"), claimId("diffuse-leak-exploration")], timing: { kind: "test", timingProfileId: "timing.test.clinical_procedure" },
            temptation: "Treat every postoperative gas-containing collection as a failure requiring a return to the operating room.",
            counterfactual: "Diffuse rigidity and active enteric leakage would favor prompt operative source control." },
          { id: "catheter-drainage", label: "Perform image-guided pelvic catheter drainage", isCorrect: true,
            rationale: "Persistent infection and an organized localized collection call for source control. The safe posterior route and absence of generalized peritonitis support image-guided catheter drainage with ongoing antimicrobial care.",
            claimIds: [claimId("localized-abscess-drainage")], timing: { kind: "test", timingProfileId: "timing.test.clinical_procedure" },
            temptation: "Use the represented anatomic access and physiologic state to select a less invasive source-control route.",
            counterfactual: "A demonstrated ongoing bowel leak with generalized peritonitis would shift treatment to operative control of contamination." },
        ],
        explanation: "The organized collection and persistent fever indicate a residual source needing control. Stable physiology, localization and a safe catheter route support image-guided drainage with antimicrobial therapy. Generalized contamination or an uncontrolled enteric leak would change the source-control operation.",
        claimIds: [claimId("localized-abscess-drainage"), claimId("diffuse-leak-exploration")], previousConceptId: null,
        identityReason: "New postoperative treatment-route objective. It is separate from disputed initial treatment of a primary appendiceal phlegmon or abscess.",
        reasoning: {
          interpret: "Integrate an organized gas-containing collection and persistent symptoms as incomplete source control, then assess localization and the actual catheter path.",
          apply: "Choose image-guided drainage for the accessible localized source while continuing shared antimicrobial care.",
          closestError: "Continue antibiotics because the patient is stable, or operate because postoperative gas is interpreted as proof of uncontrolled bowel leakage.",
          decidingObservation: "Persistent infection, a single organized collection with a bowel-free catheter route and no represented ongoing leak or generalized peritonitis.",
          consequence: "Delayed source control or an unnecessarily invasive operation.",
          deletionTest: "Deleting persistent symptoms makes continued medical care more plausible. Deleting route anatomy makes the drainage recommendation underspecified. Generalized-peritonitis and leak observations constrain the choice against operative source control. The 5.5-cm value is a constructed case observation and supplies no universal drainage cutoff.",
          counterfactual: "Add diffuse rigidity and active enteric leakage on CT. Operative exploration with control of the leak becomes the best offered source-control plan.",
          counterfactualChoiceId: "operative-exploration",
          cueAttack: "All three options are concrete source-control policies. The key has intermediate length. The catheter path is necessary procedural anatomy, and is described without saying the procedure is available or will avoid delay. Every offered test/procedural choice has an explicit timing classification.",
          stageCategory: "Source-control route after cross-sectional anatomy and observed antibiotic response.",
          difficulty: "Predicted moderate to hard for PGY-2/3 from balancing persistent infection against stability, postoperative gas and actual source-control access.",
          oneBestAnswer: "For this localized accessible collection with persistent illness, catheter drainage is the favored proposed route. There is no claimed size-only rule or universal rank across all postoperative abscesses.",
          sequenceCheck: "The prior node explains source localization only. It supplies neither the drain route nor a general percutaneous-drainage recommendation. This update adds the decisive anatomy and response.",
          repairRecord: "Removed a sentence declaring the collection drainable and replaced it with the posterior path anatomy. Re-solved the operative-leak and resolving-collection counterfactuals.",
        },
      },
      {
        slug: "post-source-control-antibiotics",
        conceptId: "concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1",
        displayName: "Antibiotic endpoint after source control and recovery",
        learningObjective: "Interpret clinical recovery after adequate drainage when an inflammatory laboratory value remains mildly abnormal.",
        conceptType: "management",
        currentUpdate: "At later clinic review, catheter drainage has evacuated the collection, and the treating team has documented source control without ongoing bowel leakage. {patientName} has completed four days of an active antibiotic course after drainage. She is afebrile, eating, walking and free of abdominal pain. Her leukocyte count has fallen substantially and remains slightly above the laboratory reference interval. She is immunocompetent.",
        stem: "Which antibiotic plan should be recommended now for {patientName} after this completed course and source control?",
        choices: [
          { id: "wbc-normalization", label: "Continue treatment until the leukocyte count normalizes", isCorrect: false,
            rationale: "Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.",
            claimIds: [claimId("completed-short-course")], timing: noTest,
            temptation: "Use a mildly abnormal leukocyte count as proof of ongoing infection despite recovery.",
            counterfactual: "Renewed fever, pain or organ dysfunction would require a fresh source-control assessment and a supported active-treatment plan." },
          { id: "stop-course", label: "End antibiotic treatment after the completed course", isCorrect: true,
            rationale: "Adequate source control and complete clinical recovery support ending the completed short course. An isolated falling mildly elevated leukocyte count does not establish a need for extension.",
            claimIds: [claimId("completed-short-course")], timing: noTest,
            temptation: "Integrate source control, completed active therapy and the actual recovery trajectory.",
            counterfactual: "Persistent fever or recurrent abdominal findings would change the decision to renewed source assessment and active infection treatment." },
          { id: "imaging-clearance", label: "Continue treatment pending repeat abdominal and pelvic CT", isCorrect: false,
            rationale: "Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.",
            claimIds: [claimId("completed-short-course"), claimId("postoperative-ct")], timing: ctTiming,
            temptation: "Require another source-imaging assessment despite documented source control and clinical recovery.",
            counterfactual: "Recurrent deep pain and fever would support CT assessment for a residual or new source while therapy is reassessed." },
        ],
        explanation: "The relevant endpoint combines adequate source control, a completed active short course and clinical recovery. The fixed-course evidence does not require normalization of every inflammatory value. A recurrence of illness would trigger reassessment of the source and treatment plan.",
        claimIds: [claimId("completed-short-course"), claimId("postoperative-ct")], previousConceptId: null,
        identityReason: "New source-control-and-response endpoint objective. It does not install a fixed duration in diagnostic wait metadata or author a minimum appendicitis antibiotic duration.",
        reasoning: {
          interpret: "Separate a falling mildly abnormal leukocyte count from clinical evidence of persistent infection after adequate drainage.",
          apply: "End the completed active course instead of extending to a laboratory or radiographic endpoint.",
          closestError: "Continue antibiotics until the leukocyte count enters the laboratory reference interval.",
          decidingObservation: "Adequate source control, completed active treatment and afebrile pain-free functional recovery.",
          consequence: "Unnecessary antimicrobial exposure and investigation.",
          deletionTest: "Deleting source-control adequacy or clinical recovery invalidates the stop recommendation. The mildly abnormal falling count creates the closest competing endpoint. Four days is the constructed completed course with direct support from Global Alliance statement 8, not a newly authored mandatory minimum.",
          counterfactual: "Replace recovery with renewed deep pain and fever. Continuing active treatment while obtaining CT to assess a residual source becomes the best offered plan, with duration determined after reassessment.",
          counterfactualChoiceId: "imaging-clearance",
          cueAttack: "All labels specify antibiotic endpoints. The key and alternatives have comparable length. Every CT-containing plan has a CT estimate. No specific regimen is chosen because the active regimen is common background care. Removed a negative-culture result that would have provided an extra stopping cue.",
          stageCategory: "Antibiotic management after a completed active course and documented source control.",
          difficulty: "Predicted moderate for PGY-2/3 from treating incomplete laboratory normalization as treatment failure despite source control and recovery.",
          oneBestAnswer: "The represented completed-course scenario fits fixed short-course evidence. Minimum duration, resistant pathogens, immunosuppression and unresolved source-control scenarios require separate decisions.",
          sequenceCheck: "Prior feedback establishes the reason for drainage, while this node adds actual evacuation, clinical response and a completed antibiotic course. Earlier feedback states no antibiotic endpoint or duration.",
          repairRecord: "Replaced a duration-recall question with a source-control-and-recovery endpoint. Removed a new drug regimen and retained the observed completed course. The counterfactual was re-solved for recurrent illness.",
        },
      },
    ],
  },
];

export const APPENDIX_TOPIC_REVISION_DRAFT = { ...APPENDIX_TOPIC_DRAFT, contentVersion: "clinical.question-topic-appendix-appendicitis.2026-11-11.v2" } as const;
const nodeDraft = (node: TopicNode) => node.version === 2 ? APPENDIX_TOPIC_REVISION_DRAFT : APPENDIX_TOPIC_DRAFT;

// REVIEW-ROUND-ONE-REVISIONS
const APPENDIX_TOPIC_REVISION_NODES: Record<string, TopicNode> = {
  "invasive-adenocarcinoma-resection": {
    "slug": "invasive-adenocarcinoma-resection",
    "conceptId": "concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1",
    "displayName": "Completion surgery after invasive appendiceal pathology",
    "learningObjective": "Use invasive histology and completed staging to select nodal-basin resection after a margin-negative appendectomy.",
    "conceptType": "management",
    "currentUpdate": "At clinic follow-up, {patientName}'s hospital record documents an intact appendectomy. The outside review examined one tip block containing low-grade mucinous lining. Expert permanent review of the entire specimen maps a separate proximal focus of irregular malignant glands infiltrating mesoappendiceal fat. The base margin is clear. Chest, abdominal and pelvic staging shows no distant lesions or deposits on serosal surfaces. Colonoscopy shows no separate colonic lesion. She has recovered and is fit for surgery.",
    "stem": "Which next management plan should be recommended for {patientName}'s appendiceal tumor after the complete specimen review?",
    "choices": [
      {
        "id": "surveillance",
        "label": "Surveillance after the appendectomy",
        "isCorrect": false,
        "rationale": "The tip block does not represent the whole lesion. The separately mapped infiltrative focus changes the tumor classification and creates a regional nodal indication despite local margin clearance.",
        "claimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.lamn-complete-resection"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Anchor on the limited low-grade tip sample and equate a clear margin with definitive treatment.",
        "counterfactual": "If the complete intact specimen instead showed only noninfiltrative LAMN with clear margins and no perforation or extra-appendiceal involvement, further regional resection would not be indicated."
      },
      {
        "id": "right-colectomy",
        "label": "Right hemicolectomy with regional nodes",
        "isCorrect": true,
        "rationale": "The complete specimen establishes invasive glandular disease beyond the nonrepresentative tip block. With no represented distant or serosal disease, regional resection and nodal assessment are appropriate even though the appendectomy margin is clear.",
        "claimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Give the full specimen more evidentiary weight than a reassuring sample and distinguish local clearance from regional risk.",
        "counterfactual": "Replace the invasive focus with noninfiltrative low-grade mucinous lining throughout an intact margin-negative specimen; appendectomy would then suffice."
      },
      {
        "id": "cytoreduction",
        "label": "Cytoreduction with intraperitoneal chemotherapy",
        "isCorrect": false,
        "rationale": "Mesoappendiceal invasion is not the same finding as tumor deposits distributed on peritoneal surfaces. The current complete-specimen and staging record supports the regional pathway; cytoreduction and intraperitoneal treatment require a different disease distribution and specialist assessment.",
        "claimIds": [
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Treat mucinous histology or extension into mesoappendiceal fat as proof of a disseminated serosal process.",
        "counterfactual": "If separate serosal deposits containing mucinous tumor were demonstrated, specialist assessment for cytoreduction and intraperitoneal treatment would replace routine regional resection as the governing pathway."
      }
    ],
    "explanation": "A benign-appearing or low-grade sampled region cannot classify unsampled parts of a heterogeneous appendix. The full specimen demonstrates infiltrative glandular disease. A clear base addresses the local margin; it does not address regional nodes. Mesoappendiceal invasion without demonstrated serosal dissemination supports right hemicolectomy rather than the peritoneal-disease pathway.",
    "claimIds": [
      "claim.appendix-appendicitis.complete-specimen-assessment",
      "claim.appendix-appendicitis.lamn-versus-invasive",
      "claim.appendix-appendicitis.adenocarcinoma-colectomy",
      "claim.appendix-appendicitis.lamn-complete-resection",
      "claim.appendix-appendicitis.peritoneal-mucin-treatment"
    ],
    "previousConceptId": null,
    "identityReason": "New gap objective. The two legacy live concepts concern imaging and antibiotics-versus-operation selection, and contain no postoperative cancer-resection objective.",
    "reasoning": {
      "interpret": "Reconcile a low-grade tip block with a separately mapped infiltrative proximal focus in the complete specimen; classify by the demonstrated invasive component.",
      "apply": "Separate local margin clearance and direct mesoappendiceal invasion from regional nodal risk and from serosal dissemination, then recommend regional resection.",
      "closestError": "Choose surveillance by treating the limited tip block and clear base as a complete characterization of the lesion.",
      "decidingObservation": "The complete permanent specimen contains malignant glands infiltrating mesoappendiceal fat in tissue not represented by the reassuring tip block.",
      "consequence": "Leaving the regional nodal basin unassessed for an invasive primary, or escalating direct local invasion into an unsupported peritoneal treatment pathway.",
      "deletionTest": "Without the separate invasive focus, the whole-lesion conclusion and regional recommendation are unsupported. The margin distinguishes local clearance from nodal treatment. Staging distribution separates regional surgery from cytoreduction. The recovery and fitness observations delimit elective further resection.",
      "counterfactual": "Replace the mapped invasive focus with noninfiltrative low-grade lining throughout an intact margin-negative specimen without extra-appendiceal involvement. Surveillance after appendectomy becomes the best offered plan.",
      "counterfactualChoiceId": "surveillance",
      "cueAttack": "Removed the named adenocarcinoma interpretation, the key-only Oncologic adjective and the already-addressed cecal-cuff foil. The sample conflict is necessary evidence, not merely an omitted diagnosis label. All choices are specific next management plans and the neutral task accommodates observation.",
      "stageCategory": "Next management plan after complete pathology and staging, including surveillance and two distinct resection fields.",
      "difficulty": "Predicted moderate for PGY-2/3: the error is sampling-based anchoring and conflating a negative local margin with absence of regional risk. This is a fair moderate revision, not a claim of measured hard difficulty.",
      "oneBestAnswer": "The represented complete specimen and localized distribution support regional surgery under ASCRS recommendation 13. The competing noninfiltrative and disseminated pathways require different findings, not a different interpretation of the supplied margin.",
      "sequenceCheck": "The passed preceding exploration question, header, profile and explanation remain byte-identical. They disclose no tumor finding or resection rule. Only this later update and question are versioned.",
      "repairRecord": "One response to the independent REVISE: replaced diagnosis-to-Oncologic matching with a real limited-versus-complete specimen conflict, used a neutral task and replaced the weak local-clearance competitor. Re-solved the noninfiltrative and disseminated counterfactuals."
    },
    "version": 2
  },
  "post-abscess-colonic-evaluation": {
    "slug": "post-abscess-colonic-evaluation",
    "conceptId": "concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
    "displayName": "Colonic evaluation after an appendiceal abscess",
    "learningObjective": "Recognize a post-abscess neoplasm concern and select colonic evaluation before formal resection planning.",
    "conceptType": "workup",
    "stem": "Which investigation should be recommended now before definitive resection planning for {patientName}'s persistent junctional lesion?",
    "choices": [
      {
        "id": "interval-ct",
        "label": "Repeat contrast CT after inflammatory resolution",
        "isCorrect": false,
        "rationale": "Later CT can define the appendiceal base and extraluminal origin more clearly as inflammation subsides. It does not substitute for examination and sampling of a possible cecal mucosal lesion or the unexamined proximal colon.",
        "claimIds": [
          "claim.appendix-appendicitis.colonoscopy-neoplasm",
          "claim.appendix-appendicitis.interval-tissue-evaluation"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        "temptation": "Treat a reassuring summary from a partial luminal examination as completion of the colonic assessment, then defer evaluation to later cross-sectional imaging.",
        "counterfactual": "After an adequate complete colonoscopy shows normal cecal mucosa and no synchronous lesion, persistent inflammation obscuring the appendix can make later contrast CT the appropriate offered next investigation."
      },
      {
        "id": "colonoscopy",
        "label": "Colonoscopy with targeted mucosal sampling",
        "isCorrect": true,
        "rationale": "The images and specimen labels from the earlier luminal study do not represent the cecum. Complete luminal evaluation can identify and sample a cecal primary and assess synchronous colonic lesions before planning an appendiceal or colonic resection. It cannot dismiss an extramural appendiceal lesion when mucosa is normal.",
        "claimIds": [
          "claim.appendix-appendicitis.colonoscopy-neoplasm",
          "claim.appendix-appendicitis.post-abscess-neoplasm"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.endoscopy_with_sampling"
        },
        "temptation": "Interpret the actual anatomic reach of the earlier examination rather than accepting its summary as a whole-colon result.",
        "counterfactual": "If adequate cecal examination and sampling had already addressed the mucosa, while residual inflammation still prevented extraluminal localization, the offered later CT would address the remaining question."
      },
      {
        "id": "core-biopsy",
        "label": "CT-guided core sampling of the junctional mass",
        "isCorrect": false,
        "rationale": "A core from the extra-luminal junctional target would not provide a complete colonic mucosal examination. The origin is still uncertain and the current unexamined cecal compartment matters for the planned operation. The guideline supports colonoscopy for suspected appendiceal neoplasia; this is not a universal prohibition on image-guided biopsy.",
        "claimIds": [
          "claim.appendix-appendicitis.colonoscopy-neoplasm",
          "claim.appendix-appendicitis.complete-specimen-assessment"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        "temptation": "Seek tissue by the route visible on CT without checking whether the prior negative examination actually sampled the competing primary site.",
        "counterfactual": "If complete luminal assessment were adequate and normal, and an unresectable solid extra-luminal target needed tissue to guide nonsurgical treatment, image-guided core sampling could become appropriate."
      }
    ],
    "explanation": "The previous report covers the visualized colon, not the cecum: its images and biopsy labels stop distally. A persistent appendiceal-cecal junction lesion therefore still requires complete colonic mucosal assessment, including the possibility of a cecal primary and synchronous lesions. Normal mucosa would not exclude an appendiceal mural lesion. Later CT after inflammatory resolution still has a separate role in localizing the appendix and its base.",
    "claimIds": [
      "claim.appendix-appendicitis.colonoscopy-neoplasm",
      "claim.appendix-appendicitis.post-abscess-neoplasm",
      "claim.appendix-appendicitis.interval-tissue-evaluation",
      "claim.appendix-appendicitis.complete-specimen-assessment"
    ],
    "previousConceptId": null,
    "identityReason": "New gap objective after nonoperative treatment of complicated appendicitis.",
    "reasoning": {
      "interpret": "Use the actual photographed landmarks and biopsy labels to limit the scope of the earlier normal luminal report; it does not represent the cecal mucosa at the junctional lesion.",
      "apply": "Choose complete luminal examination and targeted sampling before fixing the operative field, while retaining later CT for the separate extraluminal localization question.",
      "closestError": "Accept the broad normal-report summary and wait for another CT to settle a possible cecal primary without examining the relevant mucosa.",
      "decidingObservation": "The prior luminal study ends in the descending colon and its biopsies are labelled rectum and sigmoid; the persistent lesion is at the cecal-appendiceal junction.",
      "consequence": "A cecal primary or synchronous colonic lesion can be missed and the wrong resection field planned.",
      "deletionTest": "The limited examination record creates the misleading negative and earns the site-scope inference. Persistent junctional tissue after clinical recovery creates the neoplasm question. Residual inflammation explains why interval CT retains a later role; this is not an identical already-completed-study foil.",
      "counterfactual": "Replace the limited prior record with an adequate complete colonoscopy documenting normal cecal mucosa and no synchronous lesion, while inflammation still obscures the appendix on CT. Repeat contrast CT after inflammatory resolution becomes the best offered next investigation.",
      "counterfactualChoiceId": "interval-ct",
      "cueAttack": "Removed the sentence naming an unperformed colonoscopy. The earlier record is supplied as raw anatomic scope rather than a statement that the required test is missing. The core target stays junctional rather than assumed appendiceal, and the CT option explicitly refers to a later changed inflammatory state.",
      "stageCategory": "Current pre-resection investigation; all alternatives are named tissue or imaging investigations with exact test timing metadata.",
      "difficulty": "Predicted moderate for PGY-2/3 from trusting the summary of an examination of the wrong site and allowing inflammation-based imaging follow-up to replace mucosal assessment. The retained scope details are clinically necessary, not optional difficulty padding.",
      "oneBestAnswer": "The cecum remains unrepresented and a colonic primary changes resection planning. Complete colonoscopy is guideline-supported for the persistent suspected appendiceal lesion. CT and core biopsy are not claimed intrinsically invalid; they answer different residual questions under the supplied record.",
      "sequenceCheck": "This revision uses a new standalone case and header. The entire original post-abscess pair, including the old first question and feedback, is retained unchanged solely as the frozen visible context for the PASS follow-up; that mixed-verdict pair is excluded from fresh preview.",
      "repairRecord": "One response to the independent REVISE: corrected target localization, gave the competing CT explicit interval timing, replaced the named missing-test cue with a scope-of-examination conflict, and separated mucosal diagnosis from later extraluminal localization."
    },
    "version": 2
  },
  "incidental-lesion-intact-resection": {
    "slug": "incidental-lesion-intact-resection",
    "conceptId": "concept.appendix-appendicitis.incidental-lesion-intact-resection.v1",
    "displayName": "Initial extent for an unruptured appendiceal lesion",
    "learningObjective": "Use the base anatomy and uncertain final tumor type to select intact limited resection before definitive oncologic pathology.",
    "conceptType": "management",
    "stem": "Which initial resection extent should be recommended for {patientName}'s unresected appendiceal lesion?",
    "choices": [
      {
        "id": "appendectomy",
        "label": "Appendectomy through the appendiceal base",
        "isCorrect": false,
        "rationale": "The described wall abnormality continues beyond the base into the adjacent cecal wall. Dividing at the base would leave a grossly abnormal segment, so this is not a margin-negative appendix-only situation.",
        "claimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Apply the usual appendix-only extent before mapping where the gross abnormality actually ends.",
        "counterfactual": "If a normal segment separated the lesion from a free base and cecum, intact appendectomy could achieve the initial gross margin."
      },
      {
        "id": "cecal-cuff",
        "label": "Partial cecectomy including the appendiceal base",
        "isCorrect": true,
        "rationale": "The gross abnormality crosses the base into a limited adjacent cecal segment, while the ileocecal valve and remaining cecum are separate. A partial cecectomy can encompass that field for complete permanent assessment. Unknown final histology does not itself establish a regional nodal indication.",
        "claimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.complete-specimen-assessment"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Use the observed boundary to obtain a grossly clear specimen without assuming a nodal operation from appearance alone.",
        "counterfactual": "If the whole permanent specimen later established localized invasive adenocarcinoma, the regional resection indication would change despite local clearance."
      },
      {
        "id": "right-colectomy",
        "label": "Right hemicolectomy with regional nodes",
        "isCorrect": false,
        "rationale": "A large or distended abnormal appendix raises concern but does not establish invasive histology. The limited gross base extension can be encompassed locally; the complete permanent specimen is needed before deciding whether regional nodal resection is indicated.",
        "claimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Translate cecal involvement and uncertain biology directly into a regional cancer operation.",
        "counterfactual": "A complete specimen demonstrating invasive adenocarcinoma without metastatic spread would support right hemicolectomy with regional nodes."
      }
    ],
    "explanation": "First map the gross abnormality: an appendix-only division would leave affected cecal wall. The observed extension is limited and separate from the remaining cecum and ileocecal valve, so partial cecectomy can include it for permanent assessment. No specimen has yet established invasive biology requiring a regional nodal operation. All offered resections share intact handling and protected retrieval; the scored difference is the resection field.",
    "claimIds": [
      "claim.appendix-appendicitis.intact-abnormal-appendix",
      "claim.appendix-appendicitis.complete-specimen-assessment",
      "claim.appendix-appendicitis.adenocarcinoma-colectomy"
    ],
    "previousConceptId": null,
    "identityReason": "New anatomy-to-operative-extent objective in the assigned appendiceal-lesion scope.",
    "reasoning": {
      "interpret": "Recognize that the continuous abnormal wall crosses the appendiceal transection plane, rather than treating a distended appendix as an appendix-only field.",
      "apply": "Obtain gross clearance with limited adjacent cecal resection while deferring the distinct regional-node indication to complete permanent pathology.",
      "closestError": "Escalate uncertain biology and any cecal extension into right hemicolectomy before the complete specimen establishes an invasive primary.",
      "decidingObservation": "Only the small contiguous cecal patch is involved grossly; the remainder and ileocecal valve are separate, and no tissue has yet classified the lesion.",
      "consequence": "Either leave gross abnormal wall by dividing at the base or perform an unsupported regional resection before definitive pathology.",
      "deletionTest": "Without the observed cecal extension, appendectomy becomes appropriate. Without its limited boundary, the partial-resection recommendation is underspecified. The no-sample chronology limits the conclusion about biology. All three options share safe handling, so retrieval wording cannot select the key.",
      "counterfactual": "Replace the continuous base-to-cecum abnormality with a normal appendiceal base and a normal tissue segment separating the lesion from the cecum. Appendectomy through the base becomes the best offered extent.",
      "counterfactualChoiceId": "appendectomy",
      "cueAttack": "Removed pathology-pending ambiguity and the paired repeated free-base cues. The key now requires interpreting positive gross extension and the boundary of evidence for an oncologic operation. Every option names a resection field; no option advertises uniquely careful retrieval.",
      "stageCategory": "Prospective initial resection of an appendix still in situ, with intact handling and protected retrieval common to every option.",
      "difficulty": "Predicted moderate for PGY-2/3: distinguish gross margin requirements from unknown biologic and nodal requirements. This remains a fair moderate anatomic decision rather than an unsupported hard oncology exception.",
      "oneBestAnswer": "ASCRS recommendation 2 directly supports appendectomy or partial cecectomy according to gross base involvement and full-specimen assessment before regional resection. The observation confines gross disease to a locally resectable patch; it does not claim a tumor-size rule.",
      "sequenceCheck": "The original microscopic-margin follow-up is parked and is not attached to this changed operation. This standalone version ends at the initial operation; later histology is not previewed.",
      "repairRecord": "One response to the independent REVISE: made the unresected state and absence of tissue explicit, chose extent as the single objective, shared retrieval care across options and replaced repeated free-base observations with consequential base-to-cecum extension."
    },
    "version": 2
  }
};

Object.assign(APPENDIX_TOPIC_REVISION_NODES, {
  "peritoneal-mucin-referral": {
    "slug": "peritoneal-mucin-referral",
    "conceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
    "displayName": "Treatment field for appendiceal mucinous peritoneal disease",
    "learningObjective": "Integrate cellular peritoneal pathology and disease distribution to choose the appropriate oncologic treatment service.",
    "conceptType": "management",
    "stem": "Which management pathway should be recommended for {patientName} after review of the separately labelled surgical specimens?",
    "choices": [
      {
        "id": "follow-up",
        "label": "Multidisciplinary review for follow-up without resection",
        "isCorrect": false,
        "rationale": "Margin-negative noninfiltrative disease confined to an intact appendix could support this pathway. The separate diaphragmatic nodule contains mucinous epithelium, so the appendix margin and negative pelvic nodule cannot establish confinement.",
        "claimIds": [
          "claim.appendix-appendicitis.lamn-complete-resection",
          "claim.appendix-appendicitis.cellular-deposit-assessment",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Generalize the clear appendix margin and benign pelvic specimen to every sampled site.",
        "counterfactual": "If expert review found the diaphragmatic nodule benign without mucinous epithelium, as in the pelvic nodule, and the intact margin-negative appendix were the only involved specimen, follow-up without further resection would be the best offered pathway."
      },
      {
        "id": "regional-resection",
        "label": "Multidisciplinary review for right hemicolectomy and nodes",
        "isCorrect": false,
        "rationale": "The whole appendix does not show destructive glandular invasion requiring the localized adenocarcinoma nodal pathway. The demonstrated tumor is in a separate surface deposit; a regional colectomy does not by itself address that distribution.",
        "claimIds": [
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.cellular-deposit-assessment",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "React to any tumor outside the appendix by enlarging the bowel and nodal resection field.",
        "counterfactual": "If the appendix instead contained invasive adenocarcinoma and both separately sampled nodules were benign, the regional right-hemicolectomy pathway would become appropriate."
      },
      {
        "id": "cytoreduction",
        "label": "Multidisciplinary review for cytoreduction and intraperitoneal therapy",
        "isCorrect": true,
        "rationale": "Low-grade mucinous epithelium in the separately labelled diaphragmatic nodule demonstrates cellular disease outside the appendix. This requires experienced-center assessment for cytoreduction with or without intraperitoneal treatment. Histology, extent and operative feasibility determine the final plan; the biopsy does not guarantee eligibility.",
        "claimIds": [
          "claim.appendix-appendicitis.cellular-deposit-assessment",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Respect the positive sample from its actual site rather than letting a negative sample or clear primary margin erase it.",
        "counterfactual": "If both nodules were benign and the complete intact appendix were the only involved specimen, no extra-appendiceal disease would be demonstrated and the follow-up pathway would replace this assessment."
      }
    ],
    "explanation": "The specimens represent different sites. A negative pelvic nodule and a clear appendiceal margin do not negate low-grade mucinous epithelium in the diaphragmatic nodule. That finding changes the disease field beyond the appendix. Experienced-center assessment for cytoreduction and possible intraperitoneal therapy is appropriate; this is not a promise of HIPEC or evidence that every deposit has been sampled. Regional colectomy is not a substitute for evaluating the demonstrated surface disease.",
    "claimIds": [
      "claim.appendix-appendicitis.lamn-complete-resection",
      "claim.appendix-appendicitis.lamn-versus-invasive",
      "claim.appendix-appendicitis.adenocarcinoma-colectomy",
      "claim.appendix-appendicitis.cellular-deposit-assessment",
      "claim.appendix-appendicitis.peritoneal-mucin-treatment"
    ],
    "previousConceptId": null,
    "identityReason": "New treatment-field objective. It is separate from local LAMN margin management and regional invasive-cancer resection.",
    "reasoning": {
      "interpret": "Map permanent histology to the actual specimen sites: a clear primary margin and a benign pelvic nodule cannot establish whole-patient confinement when a separately sampled diaphragmatic nodule contains mucinous epithelium.",
      "apply": "Choose the surface-disease treatment assessment rather than localized-primary surveillance or a regional nodal operation. Leave eligibility and intraperitoneal treatment selection to specialist assessment.",
      "closestError": "Accept the summary based on the primary specimen and the benign pelvic biopsy, then stop at follow-up despite the positive distant surface specimen.",
      "decidingObservation": "Low-grade mucinous epithelial strips are present within mucin in the separately labelled nodule from beneath the right diaphragm.",
      "consequence": "Cellular disease outside the appendix is excluded from treatment planning, or a regional bowel operation is substituted for the actual disease field.",
      "deletionTest": "Without the positive separately sited specimen, the complete intact margin-negative noninfiltrative appendix and benign pelvic nodule support the follow-up pathway. The benign pelvic sample creates real sampling tension; it cannot be extrapolated to the other nodule. Staging and preserved function delimit elective specialist assessment without claiming automatic resectability.",
      "counterfactual": "Change the diaphragmatic nodule result to benign tissue without mucinous epithelium, matching the pelvic nodule. With the complete intact margin-negative appendix as the only involved specimen, multidisciplinary review for follow-up without further resection becomes the best offered plan.",
      "counterfactualChoiceId": "follow-up",
      "cueAttack": "Removed the named peritoneal implant-to-Peritoneal surgery match and the uniquely cautious key. Every option is an equally committed multidisciplinary treatment-pathway review. Raw site-specific pathology, rather than a supplied disease-category label, changes the field and the action.",
      "stageCategory": "Multidisciplinary management-pathway assessment after separately labelled permanent specimens and staging, with no option promising immediate treatment.",
      "difficulty": "Predicted moderate for PGY-2/3 from accepting a reassuring primary-specimen summary and a negative sample at the wrong site. This is a site-and-tissue interpretation followed by a different treatment field, not basic specialty-name recognition.",
      "oneBestAnswer": "The positive sampled surface deposit requires assessment for the disease distribution it demonstrates. ASCRS recommendations 13-15 support the distinction from routine regional colectomy and individualized cytoreduction/HIPEC decisions; a single guideline remains the direct management source.",
      "sequenceCheck": "This remains standalone. No prior feedback labels the involved compartment or names the treatment pathway. The whole-appendix and two nodule results are current and explicitly attributed.",
      "repairRecord": "One response to the independent REVISE: used a consequential specimen-site conflict, removed the specialty-name match, and compared equally cautious pathway assessments. The counterfactual changes the positive tissue observation and changes the best plan."
    },
    "version": 2
  },
  "net-regional-resection": {
    "slug": "net-regional-resection",
    "conceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
    "displayName": "Regional surgery after a large appendiceal NET",
    "learningObjective": "Distinguish clear local margins from regional oncologic adequacy after staging a large appendiceal NET.",
    "conceptType": "management",
    "currentUpdate": "Dedicated liver MRI obtained after the staging CT resolves both previously indeterminate lesions. Each has uniform low T1 and high T2 signal, a smooth thin wall, and no mural nodule or enhancement on the acquired precontrast and postcontrast series. The remainder of liver MRI and chest, abdominal and pelvic staging shows no additional lesions. The whole appendix specimen contains a 2.6-cm well-differentiated grade-1 neuroendocrine tumor with a clear base margin; the mesoappendix was removed. {patientName} has recovered and remains fit for surgery.",
    "stem": "Which next management plan should be recommended for {patientName}'s appendiceal tumor after these acquired staging results?",
    "choices": [
      {
        "id": "completed-resection",
        "label": "Finish resection with appendectomy and follow-up",
        "isCorrect": false,
        "rationale": "The liver findings have benign cyst morphology, but the completely measured primary is larger than the guideline boundary for appendix-only treatment. A clear base does not address regional nodal risk.",
        "claimIds": [
          "claim.appendix-appendicitis.hepatic-cyst-mri",
          "claim.appendix-appendicitis.net-resection",
          "claim.appendix-appendicitis.small-favorable-net-resection"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Equate a low grade, clear margin and benign liver findings with a small favorable NET that needs no further resection.",
        "counterfactual": "If the fully measured tumor were smaller than 1 cm without unfavorable features and had been removed with its mesoappendix, ending resection at appendectomy would be the best offered plan."
      },
      {
        "id": "right-colectomy",
        "label": "Proceed with right hemicolectomy and regional nodes",
        "isCorrect": true,
        "rationale": "The acquired MRI observations characterize the represented liver lesions as simple cysts rather than leaving them indeterminate for staging. In this fit patient, the whole-specimen tumor size supports regional resection despite a clear appendectomy margin.",
        "claimIds": [
          "claim.appendix-appendicitis.hepatic-cyst-mri",
          "claim.appendix-appendicitis.net-resection"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Interpret the actual liver morphology, then distinguish regional treatment from local margin clearance.",
        "counterfactual": "A small favorable subcentimeter primary would remove the regional indication; an unresolved enhancing liver target would instead require additional staging assessment before fixing this plan."
      },
      {
        "id": "liver-biopsy",
        "label": "Obtain liver core biopsy before further resection",
        "isCorrect": false,
        "rationale": "These are resolved fluid-signal, nonenhancing lesions without internal solid tissue on adequate MRI, not persistent indeterminate targets. Biopsy would add an unsupported staging step. This conclusion comes from morphology, not a negative receptor scan.",
        "claimIds": [
          "claim.appendix-appendicitis.hepatic-cyst-mri",
          "claim.appendix-appendicitis.net-functional-staging"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        "temptation": "Carry the earlier CT uncertainty forward despite the newly acquired diagnostic morphology.",
        "counterfactual": "If an enhancing solid component remained unresolved on dedicated imaging and multidisciplinary review selected tissue confirmation to determine treatment intent, liver sampling before further resection could be appropriate."
      }
    ],
    "explanation": "The earlier CT uncertainty must be updated using the actual MRI: simple fluid signal, a thin wall and no enhancing internal tissue characterize the represented lesions as cysts. This is different from inferring cysts from absent receptor uptake. The whole-specimen primary exceeds the directly sourced greater-than-2-cm NET boundary, so regional nodal resection remains indicated despite a clear base margin. A smaller favorable tumor or unresolved liver staging would change this decision.",
    "claimIds": [
      "claim.appendix-appendicitis.hepatic-cyst-mri",
      "claim.appendix-appendicitis.net-resection",
      "claim.appendix-appendicitis.small-favorable-net-resection",
      "claim.appendix-appendicitis.net-functional-staging"
    ],
    "previousConceptId": null,
    "identityReason": "New regional-resection objective. The separate functional-staging concept retains its own identity and scheduling history.",
    "reasoning": {
      "interpret": "Use adequate precontrast, fluid-sensitive and postcontrast MRI morphology to resolve the two actual CT targets as simple cysts rather than assuming that absent receptor activity proves benignity.",
      "apply": "With those staging targets resolved, apply the complete primary specimen and regional nodal indication rather than treating local margin clearance as completion of all surgery.",
      "closestError": "Defer the operative plan for liver biopsy because the earlier CT used the word indeterminate, without incorporating the later morphology.",
      "decidingObservation": "Both actual CT targets are resolved on dedicated MRI as homogeneous fluid-signal lesions without enhancing internal tissue; the complete primary measures 2.6 cm.",
      "consequence": "An unnecessary invasive staging step delays the regional plan, or appendix-only treatment leaves the regional basin unaddressed.",
      "deletionTest": "Without the dedicated MRI, the prior CT uncertainty remains and immediate regional planning is underspecified. Without the full primary measurement, the regional indication is not established. The clear margin distinguishes local from regional treatment. Grade and mesoappendix information make the small-favorable counterfactual coherent.",
      "counterfactual": "Replace the whole-specimen primary measurement with a subcentimeter tumor lacking unfavorable features, preserving complete appendectomy with mesoappendix and benign MRI. Finish resection with appendectomy and follow-up becomes the best offered plan.",
      "counterfactualChoiceId": "completed-resection",
      "cueAttack": "The neutral task no longer repeats localized diagnosis or size. The weak cecal-cuff competitor is replaced by a staging-first plan driven by the prior actual uncertainty. All options are current post-staging management policies: finish, proceed regionally, or defer for targeted tissue. The key is neither uniquely cautious nor the only investigation with a preview.",
      "stageCategory": "Current operative planning after acquired staging: finish treatment, proceed with regional resection, or defer for additional targeted staging.",
      "difficulty": "Predicted moderate for PGY-2/3 from carrying an obsolete indeterminate-stage conclusion forward or confusing low grade and a negative local margin with a small favorable primary. The disputed 1-2-cm boundary is not used.",
      "oneBestAnswer": "Adequate diagnostic cyst morphology resolves the represented staging concern; ASCRS recommendation 7 directly supports regional surgery for this greater-than-2-cm nonmetastatic primary. MRI does not claim to exclude every microscopic metastasis, and no biopsy is universally ranked against receptor imaging.",
      "sequenceCheck": "The tracer-selection question is parked. The current version is a standalone clinic record with the earlier CT uncertainty in the header and the actual dedicated liver MRI in this update; no receptor result is invented or credited with cyst diagnosis.",
      "repairRecord": "One response to the independent REVISE: named the modality and acquisitions, replaced the handed-down staging conclusion with supported MRI observations, neutralized the task and replaced a margin-nullified cuff with a real staging competitor. Re-solved both the smaller-primary and unresolved-liver boundaries."
    },
    "version": 2
  }
});

Object.assign(APPENDIX_TOPIC_REVISION_NODES, {
  "postoperative-infection-imaging": {
    "slug": "postoperative-infection-imaging",
    "conceptId": "concept.appendix-appendicitis.postoperative-deep-infection-imaging.v2",
    "displayName": "Acquired CT versus transferred-series evidence after appendectomy",
    "learningObjective": "Interpret a postoperative CT acquisition and transfer record before choosing image retrieval or repeat investigation.",
    "conceptType": "workup",
    "stem": "Which imaging action should the acute-care team recommend next for {patientName}'s renewed postoperative symptoms on this acquisition and transfer record?",
    "choices": [
      {
        "id": "repeat-ct",
        "label": "Repeat contrast-enhanced abdominal and pelvic CT",
        "isCorrect": false,
        "rationale": "A repeat acquisition could be necessary for inadequate source images or a changed clinical state. Here the complete current contrast acquisition already exists and is available for review, while the reassuring report covers only the transferred subset.",
        "claimIds": [
          "claim.appendix-appendicitis.postoperative-ct",
          "claim.appendix-appendicitis.ct-series-scope"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        "temptation": "Treat incomplete transfer as proof that the required acquisition was never performed.",
        "counterfactual": "If the scanner and administration records instead showed that no contrast acquisition had occurred, with only the supplied noncontrast images available, a new contrast CT would become the best offered action."
      },
      {
        "id": "archive-review",
        "label": "Review the archived contrast-enhanced abdominal and pelvic CT",
        "isCorrect": true,
        "rationale": "The renewed illness still requires source localization, but the negative subset report cannot settle it. The acquisition log and actual archive establish that the needed current contrast images exist; reviewing them addresses the unresolved question without duplicating acquisition.",
        "claimIds": [
          "claim.appendix-appendicitis.postoperative-ct",
          "claim.appendix-appendicitis.ct-series-scope"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.general_diagnostic"
        },
        "temptation": "Distinguish absence from the transfer package from absence at the scanner, then use the actual current dataset.",
        "counterfactual": "If the postcontrast acquisition had never been performed, this review could not supply the missing anatomy and repeat contrast CT would be appropriate."
      },
      {
        "id": "mri",
        "label": "Obtain contrast-enhanced abdominal and pelvic MRI",
        "isCorrect": false,
        "rationale": "MRI is a real cross-sectional alternative, but the supplied record already contains the current contrast CT acquisition for the clinical question. Changing modalities does not first resolve the evidentiary error in accepting a subset report. No universal CT-versus-MRI ranking is claimed.",
        "claimIds": [
          "claim.appendix-appendicitis.postoperative-ct",
          "claim.appendix-appendicitis.ct-series-scope"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        "temptation": "Escalate to another modality because the outside report and symptoms disagree, without checking the actual acquired images.",
        "counterfactual": "If CT were genuinely unavailable or nondiagnostic and a clinically appropriate MRI pathway were selected after reviewing the acquisition limitations, MRI could be the appropriate alternative."
      }
    ],
    "explanation": "A reassuring interpretation applies to the supplied images, not to a different dataset still in the archive. Renewed fever and pain after recovery require source localization. The record establishes that complete current contrast CT images were acquired and remain available; review those images before repeating or replacing that acquisition. This conclusion depends on unchanged clinical status and adequate source images, not on the mere absence of exported files.",
    "claimIds": [
      "claim.appendix-appendicitis.postoperative-ct",
      "claim.appendix-appendicitis.ct-series-scope"
    ],
    "previousConceptId": "concept.appendix-appendicitis.postoperative-deep-infection-imaging.v1",
    "identityReason": "Materially changed from generic postoperative modality selection to the evidentiary scope of acquired versus reviewed CT images. The reviewed v1 concept and all history are retained; no FSRS transfer is proposed.",
    "reasoning": {
      "interpret": "Read the negative report as a statement about the transferred precontrast subset, then use the administration log, coverage and actual archive to establish what was acquired.",
      "apply": "Address the unresolved postoperative source question by reviewing the existing current contrast dataset rather than assuming it must be reacquired or replaced.",
      "closestError": "Repeat contrast CT because missing postcontrast files in the transfer package are mistaken for an unperformed acquisition.",
      "decidingObservation": "The scanner log and source archive confirm a complete abdominal and pelvic postcontrast acquisition from the same unchanged clinical episode, available for current radiologist review.",
      "consequence": "Unnecessary duplicate contrast acquisition and delayed interpretation, or false reassurance from a report with narrower image scope.",
      "deletionTest": "Deleting the acquisition log or archive availability makes retrieval versus repeat underspecified. Deleting unchanged clinical status removes the reason to rely on the same episode. Deleting renewed illness removes the source-localization need. No superficial wound finding is supplied to dismiss a mismatched ultrasound option.",
      "counterfactual": "Change the scanner and administration records to show that the postcontrast acquisition was never performed and only the supplied noncontrast images exist. Repeat contrast-enhanced abdominal and pelvic CT becomes the best offered action.",
      "counterfactualChoiceId": "repeat-ct",
      "cueAttack": "All options address the same abdominal and pelvic field with contrast-based cross-sectional assessment. There is no superficial ultrasound or plain-film foil. Safety facts do not uniquely license the key: the repeat CT is feasible too. The necessary acquisition record earns the retrieval decision and explicitly distinguishes acquired images from unperformed testing.",
      "stageCategory": "Current imaging action for the same postoperative source question: review an available acquired dataset, repeat acquisition, or acquire an alternative modality.",
      "difficulty": "Predicted moderate for PGY-2/3 from overrepeating a study after incomplete transfer or trusting a negative subset report. This is an explicitly changed evidence-scope construct and a fair moderate fallback, not a claim that generic postoperative CT selection became hard.",
      "oneBestAnswer": "The full current dataset and review access are explicit constructed records, not inferred from missing files. The clinical source supports contrast CT localization; the retrieval ranking follows these records and is not presented as a new guideline rule or a universal modality hierarchy.",
      "sequenceCheck": "The current header contains renewed postoperative illness but no source anatomy. This review identifies no collection, access route or antibiotic endpoint; the next node supplies the actual reviewed findings.",
      "repairRecord": "One response to the independent REVISE: replaced superficial-site and radiograph foils with credible imaging actions, made acquired-versus-transferred evidence consequential, and removed port-site negatives and contrast-permission matching. Versioned the materially changed concept and re-solved the unperformed-acquisition counterfactual."
    },
    "currentUpdate": "During this same episode, the hospital performed abdominal and pelvic CT. The transferred report says no collection is seen on the supplied images. Its image manifest lists a scout and precontrast axial images. The scanner log records both precontrast and intravenous-contrast acquisitions covering the abdomen and pelvis; the source archive contains the complete postcontrast dataset, available for current radiologist review. Symptoms and examination have not changed since that acquisition. Creatinine is within its reporting interval and no iodinated-contrast reaction occurred.",
    "version": 2
  },
  "postoperative-abscess-drainage": {
    "slug": "postoperative-abscess-drainage",
    "conceptId": "concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1",
    "displayName": "Source control of a localized post-appendectomy collection",
    "learningObjective": "Interpret localized anatomy and treatment response to choose a source-control route after appendectomy.",
    "conceptType": "management",
    "currentUpdate": "Review of the archived intravenous-contrast CT shows a 5.5-cm rim-enhancing pelvic collection containing gas, adjacent to the bladder and rectum. The interventional radiologist reviews the access-plane images: posterior to the collection are pelvic fat and overlying soft tissue; bowel and major vessels lie anterior or lateral to that plane. There is no diffuse intraperitoneal fluid. No enteric contrast was administered. Fever and focal pain persist during active intravenous antibiotic treatment. {patientName} remains alert with stable blood pressure and no diffuse rigidity.",
    "stem": "Which treatment plan should be recommended now for {patientName}'s continuing postoperative illness?",
    "choices": [
      {
        "id": "antibiotics",
        "label": "Continue antibiotics with serial abdominal examination",
        "isCorrect": false,
        "rationale": "Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue.",
        "claimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Use stable physiology to justify waiting despite an ongoing organized source and persistent symptoms.",
        "counterfactual": "A small resolving collection with sustained clinical improvement and no appropriate drainage access could support continued medical management and observation."
      },
      {
        "id": "operative-exploration",
        "label": "Add operative exploration with pelvic drainage",
        "isCorrect": false,
        "rationale": "Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible.",
        "claimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.diffuse-leak-exploration",
          "claim.appendix-appendicitis.ct-series-scope"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        },
        "temptation": "Treat gas in a postoperative collection as proof of generalized ongoing leakage requiring immediate operative exploration.",
        "counterfactual": "Replace stable localized findings with diffuse involuntary rigidity and circulatory deterioration. Prompt operative source control becomes the best offered plan."
      },
      {
        "id": "catheter-drainage",
        "label": "Add image-guided pelvic catheter drainage",
        "isCorrect": true,
        "rationale": "Persistent illness and an organized collection support evacuation. The radiologist-supplied geometry permits an image-guided approach while antibiotics continue. Clinical response and drainage findings must still be assessed; this is not proof that every leak has been excluded.",
        "claimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.ct-series-scope"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        },
        "temptation": "Combine treatment response with actual localization and access-plane anatomy instead of choosing by stability or gas alone.",
        "counterfactual": "New generalized rigidity or an uncontrolled bowel source would change the plan toward operative control rather than drainage of a localized target alone."
      }
    ],
    "explanation": "Persistent fever and pain with an organized localized collection support evacuation despite stable circulation. The assessed geometry and absence of generalized peritonitis favor image-guided drainage with continued antibiotics. The CT was acquired with intravenous contrast only: no claim of a negative enteric-contrast leak study is made. An uncontrolled bowel source or clinical deterioration would require renewed assessment and may require operation.",
    "claimIds": [
      "claim.appendix-appendicitis.localized-abscess-drainage",
      "claim.appendix-appendicitis.diffuse-leak-exploration",
      "claim.appendix-appendicitis.ct-series-scope"
    ],
    "previousConceptId": null,
    "identityReason": "New postoperative treatment-route objective. It is separate from disputed initial treatment of a primary appendiceal phlegmon or abscess.",
    "reasoning": {
      "interpret": "Infer an ongoing organized source from persistence during active therapy, then interpret the collection location and interventional radiologist's observed access-plane relationships.",
      "apply": "Select image-guided evacuation with shared antibiotics for this localized accessible target, while preserving reassessment for an uncontrolled source rather than claiming that all bowel leakage was excluded.",
      "closestError": "Continue antibiotics because blood pressure is stable; the other close error is treating gas as sufficient proof that operation is required.",
      "decidingObservation": "Persistent fever and pain accompany a single organized collection whose reviewed posterior plane contains soft tissue and fat while bowel and major vessels lie elsewhere.",
      "consequence": "Delayed evacuation of an ongoing source, or unnecessary immediate operative exploration for a target amenable to an image-guided approach.",
      "deletionTest": "Removing persistent illness makes continued medical care more plausible. Removing the assessed geometry makes the percutaneous route underspecified. Generalized-peritonitis observations constrain operation. The constructed 5.5-cm measurement describes this collection and does not install a universal drainage cutoff.",
      "counterfactual": "Replace stable circulation and absence of diffuse rigidity with deterioration and generalized involuntary rigidity. Add operative exploration with pelvic drainage becomes the best offered plan for prompt control of generalized contamination.",
      "counterfactualChoiceId": "operative-exploration",
      "cueAttack": "The neutral treatment task no longer announces source control. Active antibiotics are shared background care, and every option specifies a treatment policy. The observer and anatomy are identified without calling a route safe or declaring the lesion drainable. Both procedural options carry the same existing placeholder timing profile.",
      "stageCategory": "Current treatment of continuing postoperative illness after anatomy and antibiotic response are observed; active antibiotics continue in every option.",
      "difficulty": "Predicted moderate to hard for PGY-2/3 from balancing persistent illness, stable circulation, postoperative gas and actual access anatomy. Difficulty comes from selecting a route, not from concealing safety information or inventing a leak-negative acquisition.",
      "oneBestAnswer": "The localized target, assessed anatomy and persistent illness support image-guided drainage under the recorded WSES and Global Alliance sources. An IV-only scan is not used as an enteric-contrast exclusion of leakage. Continued assessment is required and the key makes no size-only or all-leak-excluded claim.",
      "sequenceCheck": "The preceding revised node only establishes which acquired images need review. This update introduces collection anatomy and active-treatment response. Later recovery and antibiotic endpoint are absent from this explanation.",
      "repairRecord": "One response to the independent REVISE: removed the unsupported no-enteric-leak observation, specified IV-only acquisition, neutralized the task, replaced the declared catheter path with attributed anatomy, and retained the real antibiotics-versus-evacuation and image-guided-versus-operative comparisons."
    },
    "version": 2
  },
  "post-source-control-antibiotics": {
    "slug": "post-source-control-antibiotics",
    "conceptId": "concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1",
    "displayName": "Antibiotic endpoint after source control and recovery",
    "learningObjective": "Interpret clinical recovery after adequate drainage when an inflammatory laboratory value remains mildly abnormal.",
    "conceptType": "management",
    "currentUpdate": "At later clinic review, catheter drainage has evacuated the collection, and the treating team has documented source control without ongoing bowel leakage. {patientName} has received four days of active antibiotics after drainage. She is afebrile, eating, walking and free of abdominal pain. Her leukocyte count has fallen substantially and remains slightly above the laboratory reference interval. She is immunocompetent.",
    "stem": "Which antibiotic plan should be recommended now for {patientName} at this later review?",
    "choices": [
      {
        "id": "wbc-normalization",
        "label": "Continue treatment until the leukocyte count normalizes",
        "isCorrect": false,
        "rationale": "Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.",
        "claimIds": [
          "claim.appendix-appendicitis.completed-short-course"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Use a mildly abnormal leukocyte count as proof of ongoing infection despite recovery.",
        "counterfactual": "Renewed fever, pain or organ dysfunction would require a fresh source-control assessment and a supported active-treatment plan."
      },
      {
        "id": "stop-course",
        "label": "Stop antibiotic treatment",
        "isCorrect": true,
        "rationale": "Adequate source control, four days of active therapy and clinical recovery support stopping treatment. An isolated falling mildly elevated leukocyte count does not establish a need for extension.",
        "claimIds": [
          "claim.appendix-appendicitis.completed-short-course"
        ],
        "timing": {
          "kind": "no_test"
        },
        "temptation": "Integrate source control, completed active therapy and the actual recovery trajectory.",
        "counterfactual": "Persistent fever or recurrent abdominal findings would change the decision to renewed source assessment and active infection treatment."
      },
      {
        "id": "imaging-clearance",
        "label": "Continue treatment pending repeat abdominal and pelvic CT",
        "isCorrect": false,
        "rationale": "Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.",
        "claimIds": [
          "claim.appendix-appendicitis.completed-short-course",
          "claim.appendix-appendicitis.postoperative-ct"
        ],
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        "temptation": "Require another source-imaging assessment despite documented source control and clinical recovery.",
        "counterfactual": "Recurrent deep pain and fever would support CT assessment for a residual or new source while therapy is reassessed."
      }
    ],
    "explanation": "The relevant endpoint combines adequate source control, a completed active short course and clinical recovery. The fixed-course evidence does not require normalization of every inflammatory value. A recurrence of illness would trigger reassessment of the source and treatment plan.",
    "claimIds": [
      "claim.appendix-appendicitis.completed-short-course",
      "claim.appendix-appendicitis.postoperative-ct"
    ],
    "previousConceptId": null,
    "identityReason": "New source-control-and-response endpoint objective. It does not install a fixed duration in diagnostic wait metadata or author a minimum appendicitis antibiotic duration.",
    "reasoning": {
      "interpret": "Distinguish a falling mildly elevated leukocyte count from persistent infection by using the afebrile pain-free functional recovery after documented source control.",
      "apply": "Apply the supported short-course endpoint to the actual days received and recovery rather than declaring the course complete before asking the learner to decide.",
      "closestError": "Continue antibiotics until the leukocyte count enters the laboratory reference interval.",
      "decidingObservation": "Documented source control and four days of active therapy with afebrile, pain-free recovery despite a mildly abnormal falling leukocyte count.",
      "consequence": "Unnecessary antimicrobial exposure and investigation.",
      "deletionTest": "Deleting source-control adequacy or clinical recovery invalidates the stop recommendation. The mildly abnormal falling count creates the closest competing endpoint. Four days is the constructed completed course with direct support from Global Alliance statement 8, not a newly authored mandatory minimum.",
      "counterfactual": "Replace recovery with renewed deep pain and fever. Continuing active treatment while obtaining CT to assess a residual source becomes the best offered plan, with duration determined after reassessment.",
      "counterfactualChoiceId": "imaging-clearance",
      "cueAttack": "The presentation states only what was received and observed. The task does not call the course completed and the key is a plain stopping action. Laboratory normalization and repeat CT remain credible competing endpoints with rationale kept after the answer. The CT-containing choice retains exact test timing metadata.",
      "stageCategory": "Antibiotic management at later recovery review after documented source control and an observed active-treatment interval.",
      "difficulty": "Predicted moderate for PGY-2/3 from treating incomplete laboratory normalization as treatment failure despite source control and recovery.",
      "oneBestAnswer": "The represented completed-course scenario fits fixed short-course evidence. Minimum duration, resistant pathogens, immunosuppression and unresolved source-control scenarios require separate decisions.",
      "sequenceCheck": "The later update explicitly supersedes the original febrile state. Earlier revised drainage feedback gives neither a duration nor a stopping rule. Source control is documented here rather than assumed from a planned procedure.",
      "repairRecord": "One response to the independent REVISE: changed completed to received in the pre-answer update, removed the completion conclusion from the task and key, preserved all recovery and residual leukocytosis evidence, and rechecked Global Alliance 2024 statement 8 for the exact four-day scenario."
    },
    "version": 2
  }
});

const reviewedCase = (slug: string) => APPENDIX_TOPIC_REVIEWED_CASE_DEFINITIONS.find(definition => definition.slug === slug)!;
const revisedCase = (slug: string, patch: Partial<TopicCase> = {}): TopicCase => {
  const definition = structuredClone(reviewedCase(slug));
  return { ...definition, version: 2, ...patch, nodes: definition.nodes
    .filter(node => !["lamn-microscopic-margin", "net-receptor-staging"].includes(node.slug))
    .map(node => APPENDIX_TOPIC_REVISION_NODES[node.slug] ?? node) };
};

/** Fresh preview excludes parked questions and the mixed-verdict frozen post-abscess pair. */
export const APPENDIX_TOPIC_PRE_SALVAGE_CASE_DEFINITIONS: TopicCase[] = [
  revisedCase("persistent-pain", { presentationVersion: 1 }),
  revisedCase("post-abscess-lesion", {
    slug: "post-abscess-colonic-evaluation",
    displayName: "Persistent junctional lesion after an incomplete luminal assessment",
    presentation: "{patientName}, a 62-year-old man, attends the clinic after antibiotics and drainage of a right-lower-quadrant abscess attributed to appendicitis. Pain and fever have resolved. Interval CT shows collapse of the collection and persistent nodularity at the appendiceal-cecal junction; inflammatory thickening still obscures the base and organ of origin. An earlier luminal report describes normal mucosa in the visualized colon. Its final photographed landmark is the descending colon, and biopsy labels identify rectum and sigmoid.",
  }),
  revisedCase("incidental-mucinous-lesion", {
    displayName: "Resection extent for an unresected abnormal appendiceal base",
    presentation: "{patientName}, a 54-year-old woman, attends the clinic to plan resection after diagnostic laparoscopy left her appendix in situ. No tissue was sampled. The operative images show a distended appendiceal body with continuous wall thickening across its base onto a small adjacent patch of cecum. The remaining cecum and ileocecal valve are separate from that patch, and no surface deposits or free mucin were seen. Every proposed resection would use intact handling and protected retrieval.",
  }),
  revisedCase("peritoneal-mucin", {
    displayName: "Treatment field after discordant site-specific specimens",
    complaint: "Pathology review",
    presentation: "{patientName}, a 57-year-old man, attends the clinic after appendectomy and separate removal of two small nodules seen during the operation. The complete appendix specimen has a clear base margin and low-grade mucinous lining without infiltrative glands. The pelvic nodule contains fibrous tissue without mucinous epithelium. The separately labelled nodule from beneath the right diaphragm contains mucin with strips of low-grade mucinous epithelium. Postoperative staging shows no solid-organ lesions or residual bulky mass. He remains active without bowel obstruction.",
  }),
  structuredClone(reviewedCase("goblet-cell-pathology")),
  revisedCase("net-staging", {
    displayName: "Regional planning after acquired liver lesion characterization",
    presentation: "{patientName}, a 41-year-old man, attends the clinic after appendectomy found a neuroendocrine tumor. The initial staging CT described two liver lesions as indeterminate on the acquired phases. He returns with the complete appendix pathology and the subsequent dedicated liver study for management planning.",
  }),
  revisedCase("postoperative-source-control", {
    presentation: "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode.",
  }),
];
// A revised first post-abscess question must not inherit or alter the PASS follow-up's prior context.
APPENDIX_TOPIC_PRE_SALVAGE_CASE_DEFINITIONS.find(definition => definition.slug === "post-abscess-colonic-evaluation")!.nodes = [APPENDIX_TOPIC_REVISION_NODES["post-abscess-colonic-evaluation"]!];


/** Standalone composition only: every scored node is copied from its exact prior PASS. */
const salvageDefinition = (parentSlug: string, nodeSlug: string, context: Pick<TopicCase, "displayName" | "complaint" | "presentation"> & Partial<Pick<TopicCase, "acuity">>): TopicCase => {
  const parent = APPENDIX_TOPIC_PRE_SALVAGE_CASE_DEFINITIONS.find(definition => definition.slug === parentSlug)
    ?? APPENDIX_TOPIC_REVIEWED_CASE_DEFINITIONS.find(definition => definition.slug === parentSlug)!;
  const node = parent.nodes.find(node => node.slug === nodeSlug)!;
  return { ...structuredClone(parent), ...context, slug: "salvage-" + nodeSlug, version: 1, presentationVersion: 1, nodes: [structuredClone(node)] };
};
export const APPENDIX_TOPIC_SALVAGE_CASE_DEFINITIONS: TopicCase[] = [
  salvageDefinition("persistent-pain", "persistent-pain-exploration", {
    displayName: "Standalone progressive findings after negative imaging",
    complaint: "Persistent right-sided pain",
    presentation: reviewedCase("persistent-pain").presentation,
  }),
  salvageDefinition("persistent-pain", "invasive-adenocarcinoma-resection", {
    displayName: "Standalone complete-specimen appendiceal tumor review",
    acuity: "stable",
    complaint: "Pathology review",
    presentation: "{patientName}, a 46-year-old woman, attends the clinic to review her hospital records after appendectomy.",
  }),
  salvageDefinition("post-abscess-lesion", "post-abscess-interval-appendectomy", {
    displayName: "Standalone interval appendiceal lesion review",
    complaint: "Abscess follow-up",
    presentation: "{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. Pain and fever have resolved, but interval CT showed persistent nodularity near the cecum after the collection collapsed.",
  }),
  salvageDefinition("postoperative-source-control", "postoperative-abscess-drainage", {
    displayName: "Standalone postoperative pelvic collection treatment",
    complaint: "Postoperative care review",
    presentation: "{patientName}, a 35-year-old woman, attends the clinic with hospital records after laparoscopic appendectomy for a perforated appendix.",
  }),
  salvageDefinition("postoperative-source-control", "post-source-control-antibiotics", {
    displayName: "Standalone antibiotic endpoint after drainage",
    acuity: "stable",
    complaint: "Recovery review",
    presentation: "{patientName}, a 35-year-old woman, attends the clinic with hospital records of a pelvic collection after appendectomy for a perforated appendix.",
  }),
];
// Accepted standalone cases are reused unchanged; all old complete compositions remain above.
// The returned archive-review node remains in retained compositions and is outside fresh salvage supply.
export const APPENDIX_TOPIC_CASE_DEFINITIONS: TopicCase[] = APPENDIX_TOPIC_PRE_SALVAGE_CASE_DEFINITIONS.flatMap(definition => {
  if (definition.slug === "persistent-pain") return APPENDIX_TOPIC_SALVAGE_CASE_DEFINITIONS.slice(0, 2);
  if (definition.slug === "postoperative-source-control") return APPENDIX_TOPIC_SALVAGE_CASE_DEFINITIONS.slice(3);
  return [definition];
}).concat(APPENDIX_TOPIC_SALVAGE_CASE_DEFINITIONS[2]!);

export const APPENDIX_TOPIC_ITEM_STATUSES = [
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.persistent-pain-exploration.v1", status: "pass-preserved", currentQuestionVariantId: "question.topic.appendix-appendicitis.persistent-pain-exploration.v1" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1", status: "pass-preserved", currentQuestionVariantId: "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.lamn-microscopic-margin.v1", status: "parked", currentQuestionVariantId: null },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1", status: "pass-preserved", currentQuestionVariantId: "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.net-receptor-staging.v1", status: "parked", currentQuestionVariantId: null },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.net-regional-resection.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.net-regional-resection.v2" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.postoperative-infection-imaging.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2" },
  { reviewedQuestionVariantId: "question.topic.appendix-appendicitis.post-source-control-antibiotics.v1", status: "revised", currentQuestionVariantId: "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2" },
] as const;


function buildTopicArtifacts(definitions: TopicCase[]) {
const APPENDIX_TOPIC_QUESTIONS: QuestionVariant[] = definitions.flatMap(clinicalCase =>
  clinicalCase.nodes.map(node => ({
    ...nodeDraft(node),
    id: `question.topic.appendix-appendicitis.${node.slug}.v${node.version ?? 1}`,
    conceptId: node.conceptId,
    stem: node.stem,
    answerChoices: node.choices.map(choice => ({
      id: `choice.topic.appendix-appendicitis.${node.slug}.${choice.id}.v${node.version ?? 1}`,
      label: choice.label,
      isCorrect: choice.isCorrect,
      rationale: choice.rationale,
      distractorRationale: choice.isCorrect ? null : choice.rationale,
    })),
    explanation: node.explanation,
    ...(node.exhibit ? { exhibit: node.exhibit } : {}),
    supportingEvidenceClaimIds: node.claimIds,
  })),
);

const APPENDIX_TOPIC_AUTHORING_CONCEPTS = definitions.flatMap(clinicalCase =>
  clinicalCase.nodes.map(node => ({
    ...nodeDraft(node),
    id: node.conceptId,
    displayName: node.displayName,
    learningObjective: node.learningObjective,
    conceptType: node.conceptType,
    educationalTier: 1,
    acuity: clinicalCase.acuity,
    earliestFacilityStage: 3,
    requiredCapabilityIds: [] as string[],
    evidenceClaimIds: node.claimIds,
    previousConceptId: node.previousConceptId,
    clinicalMeaning: node.previousConceptId ? "materially_changed" : node.version === 2 ? "unchanged_from_reviewed_v1" : "new_gap_objective",
    identityReason: node.identityReason,
  })),
);

const APPENDIX_TOPIC_TESTED_CONCEPTS: TestedConcept[] = APPENDIX_TOPIC_AUTHORING_CONCEPTS.map(concept => ({
  id: concept.id,
  displayName: concept.displayName,
  learningObjective: concept.learningObjective,
  conceptType: concept.conceptType,
  earliestFacilityStage: concept.earliestFacilityStage,
}));

const APPENDIX_TOPIC_CASES: SyntheticClinicalCase[] = definitions.map(definition => {
  const sourceIds = new Set(APPENDIX_TOPIC_CLAIMS
    .filter(claim => definition.nodes.some(node => node.claimIds.includes(claim.id)))
    .flatMap(claim => claim.sourceIds));
  const sourceLabels = APPENDIX_TOPIC_SOURCES.filter(source => sourceIds.has(source.id)).map(source => source.title);
  const demographics = { ageYears: definition.age, sexLabel: definition.sex };
  return {
    id: `case.topic.appendix-appendicitis.${definition.slug}.v${definition.version ?? 1}`,
    displayName: definition.displayName,
    patientPresentationVariantId: `presentation.topic.appendix-appendicitis.${definition.slug}.v${definition.presentationVersion ?? definition.version ?? 1}`,
    patientDisplayName: definition.patientName,
    prototypeDemographics: demographics,
    chiefComplaint: definition.complaint,
    presentation: definition.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.appendix-appendicitis.${definition.slug}.v${definition.presentationVersion ?? definition.version ?? 1}`,
      prototypeDemographics: demographics,
      chiefComplaint: definition.complaint,
      presentation: definition.presentation,
    }],
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 3,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels,
    decisionNodes: definition.nodes.map((node, nodeIndex) => ({
      id: `node.topic.appendix-appendicitis.${node.slug}.v${node.version ?? 1}`,
      questionVariantId: `question.topic.appendix-appendicitis.${node.slug}.v${node.version ?? 1}`,
      primaryConceptId: node.conceptId,
      ...(node.currentUpdate ? { currentUpdate: node.currentUpdate } : {}),
      stem: node.stem,
      ...(node.exhibit ? { exhibit: node.exhibit } : {}),
      answerChoices: node.choices.map(choice => ({
        id: `choice.topic.appendix-appendicitis.${node.slug}.${choice.id}.v${node.version ?? 1}`,
        label: choice.label,
        isCorrect: choice.isCorrect,
        rationale: choice.rationale,
        serviceRequest: null,
      })),
      shuffleAnswers: true,
      explanation: node.explanation,
      sourceLabels,
      resultGateAfter: null,
      terminalDispositions: nodeIndex === definition.nodes.length - 1 ? node.choices.filter(choice => !choice.isCorrect).map(choice => ({
        answerChoiceId: `choice.topic.appendix-appendicitis.${node.slug}.${choice.id}.v${node.version ?? 1}`,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative: "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
        clinicalRationale: choice.rationale,
        sourceLabels,
      })) : [],
    })),
    learningSummary: definition.nodes.map(node => node.explanation).join(" "),
  };
});

const APPENDIX_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = definitions.flatMap(definition =>
  definition.nodes.map(node => ({
    caseId: `case.topic.appendix-appendicitis.${definition.slug}.v${definition.version ?? 1}`,
    nodeId: `node.topic.appendix-appendicitis.${node.slug}.v${node.version ?? 1}`,
    questionVariantId: `question.topic.appendix-appendicitis.${node.slug}.v${node.version ?? 1}`,
    classification: node.choices.some(choice => choice.timing.kind === "test")
      ? {
        kind: "test_choices" as const,
        choices: node.choices.map(choice => ({
          choiceId: `choice.topic.appendix-appendicitis.${node.slug}.${choice.id}.v${node.version ?? 1}`,
          choiceLabel: choice.label,
          timing: choice.timing,
        })),
      }
      : { kind: "no_test" as const },
  })),
);

/** Exact planned actions and previews. No service or result contract is installed. */
const APPENDIX_TOPIC_ORDER_PROPOSALS = APPENDIX_TOPIC_CASES.flatMap(clinicalCase =>
  clinicalCase.decisionNodes.map(node => ({
    ...(node.questionVariantId.endsWith(".v2") ? APPENDIX_TOPIC_REVISION_DRAFT : APPENDIX_TOPIC_DRAFT),
    caseId: clinicalCase.id,
    nodeId: node.id,
    questionVariantId: node.questionVariantId,
    executionScope: "outside_hospital_plan_review" as const,
    serviceRequest: null,
    resultGateAfter: null,
    choices: node.answerChoices.map(choice => ({ choiceId: choice.id, choiceLabel: choice.label })),
    integrationDependency: "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services.",
  })),
);

const APPENDIX_TOPIC_SOURCE_LINKS = APPENDIX_TOPIC_SOURCES.map(source => ({
  ...APPENDIX_TOPIC_DRAFT,
  id: `link.appendix-appendicitis.${source.id.split(".").at(-1)}`,
  sourceId: source.id,
  label: source.title,
  href: source.officialUrl!,
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
  referrerPolicy: "no-referrer" as const,
}));

const APPENDIX_TOPIC_AUTHOR_CHECKS = definitions.flatMap(clinicalCase =>
  clinicalCase.nodes.map(node => ({
    ...nodeDraft(node),
    questionVariantId: `question.topic.appendix-appendicitis.${node.slug}.v${node.version ?? 1}`,
    reviewerRole: "author_self_check" as const,
    status: "author_checked_pending_independent_and_clinician_review" as const,
    pipelinePassed: false,
    ...node.reasoning,
    distractorChecks: node.choices.filter(choice => !choice.isCorrect).map(choice => ({
      choiceId: `choice.topic.appendix-appendicitis.${node.slug}.${choice.id}.v${node.version ?? 1}`,
      temptation: choice.temptation,
      rankingRationale: choice.rationale,
      counterfactual: choice.counterfactual,
      evidenceClaimIds: choice.claimIds,
    })),
  })),
);

const APPENDIX_TOPIC_STATEMENT_MAPPINGS = definitions.flatMap(clinicalCase =>
  clinicalCase.nodes.map(node => ({
    ...nodeDraft(node),
    caseId: `case.topic.appendix-appendicitis.${clinicalCase.slug}.v${clinicalCase.version ?? 1}`,
    questionVariantId: `question.topic.appendix-appendicitis.${node.slug}.v${node.version ?? 1}`,
    constructedObservations: {
      fields: ["prototypeDemographics", "presentation", "currentUpdate", "exhibit"],
      basis: "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below.",
    },
    clinicalAssertions: [
      { fields: ["learningObjective", "stem", "explanation", "learningSummary"], evidenceClaimIds: node.claimIds },
      ...node.choices.map(choice => ({
        fields: [`answerChoices[id=${choice.id}].label`, `answerChoices[id=${choice.id}].rationale`],
        evidenceClaimIds: choice.claimIds,
      })),
    ],
    reviewedCaseFields: ["chiefComplaint", "presentation", "approvedInstantiationProfiles[0].presentation"],
    sequenceScope: node.reasoning.sequenceCheck,
  })),
);

const APPENDIX_TOPIC_CASE_REVIEWS = definitions.map(clinicalCase => ({
  ...(clinicalCase.version === 2 ? APPENDIX_TOPIC_REVISION_DRAFT : APPENDIX_TOPIC_DRAFT),
  caseId: `case.topic.appendix-appendicitis.${clinicalCase.slug}.v${clinicalCase.version ?? 1}`,
  educationalTier: 1,
  acuity: clinicalCase.acuity,
  earliestFacilityStage: 3,
  requiredCapabilityIds: [] as string[],
  clinicalSettingScope: "current_clinic_decision_and_outside_hospital_record_review" as const,
  profileScope: "One fixed, unapproved finite age/sex profile per case. Runtime patientName materialization remains in use.",
  selectionConstraint: clinicalCase.nodes.length > 1
    ? "Paired-only in this sidecar. Existing selection requires every case concept to be unseen or due. A future-due companion can block selection. Any selected node position needs its recorded current context."
    : "Standalone coverage in this sidecar.",
}));


return {
  questions: APPENDIX_TOPIC_QUESTIONS,
  authoring_concepts: APPENDIX_TOPIC_AUTHORING_CONCEPTS,
  tested_concepts: APPENDIX_TOPIC_TESTED_CONCEPTS,
  cases: APPENDIX_TOPIC_CASES,
  timing_entries: APPENDIX_TOPIC_TIMING_ENTRIES,
  order_proposals: APPENDIX_TOPIC_ORDER_PROPOSALS,
  source_links: APPENDIX_TOPIC_SOURCE_LINKS,
  author_checks: APPENDIX_TOPIC_AUTHOR_CHECKS,
  statement_mappings: APPENDIX_TOPIC_STATEMENT_MAPPINGS,
  case_reviews: APPENDIX_TOPIC_CASE_REVIEWS,
};
}

/** Exact reviewed v1 definitions and materialized artifacts remain available as history. */
export const APPENDIX_TOPIC_REVIEWED_ARTIFACTS = buildTopicArtifacts(APPENDIX_TOPIC_REVIEWED_CASE_DEFINITIONS);
/** Preserve each PASS with its whole reviewed case, earlier feedback, question and original timing row. */
export const APPENDIX_TOPIC_FROZEN_PASS_CONTEXTS = APPENDIX_TOPIC_ITEM_STATUSES.filter(item => item.status === "pass-preserved").map(item => {
  const clinicalCase = APPENDIX_TOPIC_REVIEWED_ARTIFACTS.cases.find(candidate => candidate.decisionNodes.some(node => node.questionVariantId === item.reviewedQuestionVariantId))!;
  return {
    reviewedQuestionVariantId: item.reviewedQuestionVariantId,
    clinicalCase,
    currentNode: clinicalCase.decisionNodes.find(node => node.questionVariantId === item.reviewedQuestionVariantId)!,
    question: APPENDIX_TOPIC_REVIEWED_ARTIFACTS.questions.find(question => question.id === item.reviewedQuestionVariantId)!,
    timing: APPENDIX_TOPIC_REVIEWED_ARTIFACTS.timing_entries.find(entry => entry.questionVariantId === item.reviewedQuestionVariantId)!,
    clinicalApproval: false,
    independentEditorialVerdict: "PASS" as const,
  };
});
export const APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS = buildTopicArtifacts(APPENDIX_TOPIC_PRE_SALVAGE_CASE_DEFINITIONS);
const currentArtifacts = buildTopicArtifacts(APPENDIX_TOPIC_CASE_DEFINITIONS);
const salvageCaseIds = new Set(APPENDIX_TOPIC_SALVAGE_CASE_DEFINITIONS.map(definition => "case.topic.appendix-appendicitis." + definition.slug + ".v1"));
// Keep every scored field exact; former nonfinal nodes need neutral final-answer completion metadata.
for (const clinicalCase of currentArtifacts.cases) {
  if (!salvageCaseIds.has(clinicalCase.id)) continue;
  const questionVariantId = clinicalCase.decisionNodes[0]!.questionVariantId;
  const sourceCase = [...APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS.cases, ...APPENDIX_TOPIC_REVIEWED_ARTIFACTS.cases]
    .find(candidate => candidate.decisionNodes.some(node => node.questionVariantId === questionVariantId))!;
  const sourceNode = sourceCase.decisionNodes.find(node => node.questionVariantId === questionVariantId)!;
  const standaloneNode = structuredClone(sourceNode);
  if (standaloneNode.terminalDispositions.length === 0) {
    standaloneNode.terminalDispositions = clinicalCase.decisionNodes[0]!.terminalDispositions.map(disposition => ({
      ...disposition, sourceLabels: [...sourceNode.sourceLabels],
    }));
  }
  clinicalCase.decisionNodes = [standaloneNode];
  clinicalCase.sourceLabels = [...sourceNode.sourceLabels];
}
export const APPENDIX_TOPIC_SALVAGE_CASES = currentArtifacts.cases.filter(clinicalCase => salvageCaseIds.has(clinicalCase.id));
export const APPENDIX_TOPIC_SALVAGE_ITEMS = APPENDIX_TOPIC_SALVAGE_CASES.map(clinicalCase => {
  const node = clinicalCase.decisionNodes[0]!;
  return {
    status: "salvage" as const,
    caseId: clinicalCase.id,
    nodeId: node.id,
    questionVariantId: node.questionVariantId,
    conceptId: node.primaryConceptId,
    reviewPath: node.questionVariantId.endsWith(".v1")
      ? "docs/research/question-topic-appendix-appendicitis-review-20261111.json"
      : "docs/research/question-topic-appendix-appendicitis-review2-20261111.json",
    independentContextReviewRequired: true,
    clinicalReviewStatus: "needs_clinician_review" as const,
    changeScope: "Standalone case, minimal clinic header and required neutral completion metadata; scored wording, options and feedback unchanged.",
  };
});
for (const item of APPENDIX_TOPIC_SALVAGE_ITEMS) {
  const check = currentArtifacts.author_checks.find(check => check.questionVariantId === item.questionVariantId)!;
  check.sequenceCheck = "Standalone salvage: one exact previously passed node with no preceding scored task, result gate or answer feedback. The clinic header supplies only patient identity and the existing episode; all deciding observations remain in the preserved presentation/update.";
  check.repairRecord = "Manager-directed skipped-PASS salvage. Copied every scored field and the exact question, removed companions, and added only existing episode context. Former nonfinal nodes receive required neutral final-answer dispositions with verbatim choice rationale. The new visible case requires independent review; no PASS is inferred.";
  const mapping = currentArtifacts.statement_mappings.find(mapping => mapping.questionVariantId === item.questionVariantId)!;
  mapping.clinicalAssertions.push({
    fields: ["decisionNodes[id=" + item.nodeId + "].terminalDispositions[].clinicalRationale"],
    evidenceClaimIds: currentArtifacts.questions.find(question => question.id === item.questionVariantId)!.supportingEvidenceClaimIds,
  });
}

export const APPENDIX_TOPIC_QUESTIONS = currentArtifacts.questions;
export const APPENDIX_TOPIC_AUTHORING_CONCEPTS = currentArtifacts.authoring_concepts;
export const APPENDIX_TOPIC_TESTED_CONCEPTS = currentArtifacts.tested_concepts;
export const APPENDIX_TOPIC_CASES = currentArtifacts.cases;
export const APPENDIX_TOPIC_TIMING_ENTRIES = currentArtifacts.timing_entries;
export const APPENDIX_TOPIC_ORDER_PROPOSALS = currentArtifacts.order_proposals;
export const APPENDIX_TOPIC_SOURCE_LINKS = currentArtifacts.source_links;
export const APPENDIX_TOPIC_AUTHOR_CHECKS = currentArtifacts.author_checks;
export const APPENDIX_TOPIC_STATEMENT_MAPPINGS = currentArtifacts.statement_mappings;
export const APPENDIX_TOPIC_CASE_REVIEWS = currentArtifacts.case_reviews;

export const APPENDIX_TOPIC_PREVIEW_RELEASE = {
  id: "clinical.topic.appendix-appendicitis.2026-11-11.v2",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic authoring preview, not clinically approved. Exact versions require independent review, manager acceptance and Melissa Rowland's clinical review.",
  concepts: APPENDIX_TOPIC_TESTED_CONCEPTS,
  cases: APPENDIX_TOPIC_CASES,
} as const;

export const APPENDIX_TOPIC_MANIFEST = {
  ...APPENDIX_TOPIC_REVISION_DRAFT,
  id: "batch.question-topic.appendix-appendicitis.2026-11-11.v2",
  scope: "explicit_import_authoring_sidecar",
  independentPassPreservedCount: 3,
  revisedVariantCount: 8,
  parkedVariantCount: 2,
  retainedReviewedVariantCount: APPENDIX_TOPIC_REVIEWED_ARTIFACTS.questions.length,
  frozenContextOnlyVariantIds: [] as string[],
  salvageNodeCount: APPENDIX_TOPIC_SALVAGE_CASES.length,
  salvageCaseCount: APPENDIX_TOPIC_SALVAGE_CASES.length,
  retainedPreSalvageCaseCount: APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS.cases.length,
  caseCount: APPENDIX_TOPIC_CASES.length,
  nodeCount: APPENDIX_TOPIC_QUESTIONS.length,
  conceptCount: APPENDIX_TOPIC_TESTED_CONCEPTS.length,
  clinicalApproval: false,
  pipelinePassed: false,
  managerAccepted: false,
  publicReleaseAuthorized: false,
  executableOrdersAdded: false,
  changedMeaningPreviousConceptIds: APPENDIX_TOPIC_AUTHORING_CONCEPTS
    .map(concept => concept.previousConceptId).filter((id): id is string => id !== null),
  identityPolicy: "Every older definition and concept history is preserved. Changed clinical meanings receive topic-local new identities. No existing FSRS history is transferred.",
  integrationOwner: "Claude Code thread GamifySurgery manager",
} as const;
