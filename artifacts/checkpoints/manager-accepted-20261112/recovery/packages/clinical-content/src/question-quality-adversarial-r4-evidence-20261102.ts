import type { ClinicalSource, EvidenceClaim } from "./pilot-schema";

/** Original atomic synthesis; clinical review pending, no source prose stored. */
export const QUESTION_QUALITY_ADVERSARIAL_R4_CLAIMS: EvidenceClaim[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.flumazenil-seizure-control-contraindication",
    "statement": "Flumazenil is contraindicated when a benzodiazepine was required to control a potentially life-threatening seizure state.",
    "sourceIds": [
      "source.qq20261102c.flumazenil2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One adequate primary label. The raw seizure-course application requires anesthesia/neurology review; no duration cutoff or antidote dose is authored.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.midazolam-route-and-monitoring",
    "statement": "Boosted protease inhibitors can increase parenteral midazolam exposure, requiring individualized monitored use.",
    "sourceIds": [
      "source.qq20261102c.nysdoh"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Retained verified government guidance; no dose, washout, automatic reversal instruction or duration inferred.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.hrm-incomplete-placement",
    "statement": "An esophageal pressure study without adequate junction-crossing acquisition cannot establish reliable junction relaxation classification.",
    "sourceIds": [
      "source.qq20261102c.acg-physiology2020",
      "source.qq20261102c.chicago"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Assisted completion is a case-specific application. Persistent failure despite assisted placement may justify complementary FLIP; the cases do not assert manometry must always be repeated.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.hrm-protocol-and-provocation",
    "statement": "Adequate separated-swallow protocols and selected provocative maneuvers help determine whether manometry addresses the patient's obstructive symptoms.",
    "sourceIds": [
      "source.qq20261102c.acg-physiology2020",
      "source.qq20261102c.chicago"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The technical protocol and symptom challenge need specialist review; no new quantitative threshold, fluid volume or meal recipe is authored.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.groin-imaging-after-negative-study",
    "statement": "Persistent groin diagnostic uncertainty after ultrasound can warrant dynamic cross-sectional imaging, especially with a competing musculoskeletal explanation.",
    "sourceIds": [
      "source.qq20261102c.hernia2018",
      "source.qq20261102c.hernia2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Repeat targeted ultrasound for an untested site/provocation is an authored technical application, not a new universal guideline hierarchy. No accuracy rate is claimed.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.groin-symptom-attribution",
    "statement": "A painless reducible inguinal hernia in a man may be observed while symptoms from another site receive separate evaluation.",
    "sourceIds": [
      "source.qq20261102c.hernia2018",
      "source.qq20261102c.hernia2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Case localization/provocation is synthetic and must be clinically reviewed; neither positive imaging nor a repair consultation guarantees resolution of separate pain.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.thyroid-cystic-node-discordance",
    "statement": "Suspicious cervical-node imaging can require targeted FNA and selected thyroglobulin washout despite a nondiagnostic cystic-fluid aspirate.",
    "sourceIds": [
      "source.qq20261102c.ata2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate current primary guideline; washout interpretation with an intact thyroid has limitations. The fictional 12-mm short axis is an observation above the documented sampling criterion, not an invented criterion.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
    "statement": "A partial skin specimen may not establish the diagnosis or maximum invasive depth of an unsampled residual lesion.",
    "sourceIds": [
      "source.qq20261102c.esmo-melanoma2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly retrieved current guideline supports full-thickness complete diagnostic sampling and maximum-depth/edge reporting. Exact completion technique and sequencing after a specific partial specimen remain clinical inference pending specialist review; completion is not universal when the initial specimen already suffices for planning.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.melanoma-suspicious-node-pathway",
    "statement": "Sentinel-node assessment of occult melanoma does not replace evaluation of a proven-positive or unresolved suspicious regional node.",
    "sourceIds": [
      "source.qq20261102c.esmo-melanoma2025",
      "source.qq20261102c.nci-melanoma"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Core targeting after a blood-only miss is an authored specimen-adequacy application, not a quantified accuracy claim; no particular systemic regimen or automatic dissection is asserted.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.colon-indeterminate-liver-mri",
    "statement": "Dedicated contrast MRI can characterize a subcentimeter liver lesion left indeterminate by single-phase CT in a patient with extrahepatic cancer.",
    "sourceIds": [
      "source.qq20261102c.acr-liver2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate directly retrieved criteria document. Multiphase CT is also valid but is not offered as wrong; PET is not ruled out universally for larger lesions. The 8-mm focus is fictional.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.colon-adequate-regions-and-chest-ct",
    "statement": "Adequate abdominopelvic staging does not replace diagnostic whole-chest assessment for colon cancer.",
    "sourceIds": [
      "source.qq20261102c.ascrs2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Retained same-day verified primary coverage rule; current direct access failed. Partial cardiac CT, small nodule and use of the accepted MRI alternative are constructed applications; no nodule follow-up cutoff is invented.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.sarcoma-mri-coverage-and-target",
    "statement": "Local MRI for suspected soft-tissue malignancy should depict the full lesion and relevant compartment relationships before biopsy planning.",
    "sourceIds": [
      "source.qq20261102c.essr2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Previously verified primary society guidance. Missing enhancement/viability information is a separate target-planning application, requiring radiologist review; no contrast dose or imaging diagnosis is inferred.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
    "statement": "A characteristic submucosal lipoma need not receive another specimen solely because overlying mucosal tissue is normal.",
    "sourceIds": [
      "source.qq20261102c.sel2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One complete primary guideline rechecked for wall layers, diagnostic lipoma patterns and selective tissue acquisition. The normal-mucosa scenario is an anatomic application; atypical or genuinely indeterminate lesions require another pathway.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.gastric-clonality-classification-boundary",
    "statement": "Gastric B-cell clonality alone cannot establish a specific lymphoma without integrated morphology and clinical correlation.",
    "sourceIds": [
      "source.qq20261102c.bsh2024",
      "source.qq20261102c.malt-review2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Neither preserved glands nor a clonal result independently resolves every case. No unique ranking of repeat endoscopy versus fusion testing is claimed.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.gastric-large-cell-transformation-boundary",
    "statement": "Individual larger B cells do not by themselves establish the confluent large-cell component of transformed marginal-zone lymphoma.",
    "sourceIds": [
      "source.qq20261102c.bsh2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One adequate primary guideline; a hematopathologist must verify the actual architecture. No Ki-67 cutoff or treatment regimen is authored.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.gastric-eradication-response-pathway",
    "statement": "Localized H. pylori-associated indolent gastric MALT lymphoma is generally managed initially with eradication and histologic response assessment.",
    "sourceIds": [
      "source.qq20261102c.bsh2024",
      "source.qq20261102c.malt-review2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Not an eradication-only rule for every aggressive component or disease extent. No antibiotic selection or dose added.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.hpylori-test-conditions",
    "statement": "The BSH gastric-MALT pathway specifies infection reassessment at least six weeks after therapy starts and two weeks after stopping PPI.",
    "sourceIds": [
      "source.qq20261102c.bsh2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Exact timing directly supported by that guideline; this is a clinical-history condition, not a game wait duration or a new universal cancer-response deadline.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.gastric-regressing-residual-monitoring",
    "statement": "Asymptomatic residual gastric MALT without adverse progression can be actively monitored after eradication.",
    "sourceIds": [
      "source.qq20261102c.bsh2024",
      "source.qq20261102c.malt-review2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The exact clinical/endoscopic/histologic response and follow-up schedule need hematology review; elapsed time alone does not decide failure.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.gastric-molecular-persistence",
    "statement": "Persistent molecular clonality after eradication does not by itself require additional gastric lymphoma treatment.",
    "sourceIds": [
      "source.qq20261102c.bsh2024",
      "source.qq20261102c.malt-review2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Interpret alongside symptoms, morphology and extent; not a rule to ignore overt progression.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.gastric-negative-fusion-not-exclusion",
    "statement": "Absence of BIRC3-MALT1 does not exclude otherwise supported gastric MALT lymphoma.",
    "sourceIds": [
      "source.qq20261102c.bsh2024",
      "source.qq20261102c.malt-review2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The molecular finding is not universal and absence does not guarantee eradication response or exclude every mimic.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.gastric-progressive-local-escalation",
    "statement": "Symptomatic or overtly progressive localized gastric MALT after eradication warrants consideration of involved-site radiotherapy.",
    "sourceIds": [
      "source.qq20261102c.bsh2024",
      "source.qq20261102c.malt-review2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Discussion requires reassessment of extent and histology; no radiation dose, precise failure deadline or automatic treatment is authored.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.uncertain-target-benefit-not-excluded",
    "statement": "A nonsignificant result can remain compatible with a worthwhile target effect when its interval includes that effect.",
    "sourceIds": [
      "source.qq20261102c.nist-p",
      "source.qq20261102c.nist-ci"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Constructed study/protocol only; neither target benefit nor equivalence follows from a p-value alone. No real adoption threshold.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.pancreatic-arterial-focus-before-drainage",
    "statement": "A suspected arterial bleeding source associated with a pancreatic collection requires vascular assessment and control before routine collection drainage.",
    "sourceIds": [
      "source.qq20261102c.ksge2021",
      "source.qq20261102c.ilatam2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Synthetic enhancement/channel and blood-loss findings need IR review. Resuscitation, individual vascular technique and rescue surgery remain clinical decisions; no new hemodynamic cutoff.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.pancreatic-mri-contents",
    "statement": "MRI can better define nonliquid collection contents that remain uncertain on CT before intervention planning.",
    "sourceIds": [
      "source.qq20261102c.ksge2021",
      "source.qq20261102c.ilatam2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Not a claim MRI is mandatory after every CT or that all fluid-sensitive brightness is viable tissue.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.pancreatic-necrosis-step-up",
    "statement": "A drainage-first step-up strategy can precede necrosectomy for an appropriately selected symptomatic walled-off necrotic collection.",
    "sourceIds": [
      "source.qq20261102c.ksge2021",
      "source.qq20261102c.ilatam2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Extent, access, infection and response determine intervention. No universal mandate to debride every solid fragment or fixed maturation interval.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.pancreatic-duct-mapping",
    "statement": "MRCP can assess suspected pancreatic duct disruption or disconnection before selecting a drainage strategy.",
    "sourceIds": [
      "source.qq20261102c.ksge2021",
      "source.qq20261102c.ilatam2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Current guidance includes low-quality evidence; secretin is preferable when available but is not silently made a required resource in these cases.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.pancreatic-partial-leak-bridge",
    "statement": "A selected small communicating collection with a partial pancreatic duct leak may be treated by transpapillary bridging when transmural access is unsuitable.",
    "sourceIds": [
      "source.qq20261102c.ksge2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One adequate retrieved technical guideline: it describes a small collection under 5 cm and partial rather than complete disruption. The 4-cm case is fictional, not a new cutoff. Exact bridging feasibility requires endoscopy review.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.pancreatic-disconnected-long-term-drainage",
    "statement": "Symptomatic recurrent collections associated with a disconnected viable upstream gland may require sustained transluminal plastic-stent drainage.",
    "sourceIds": [
      "source.qq20261102c.ilatam2026",
      "source.qq20261102c.ksge2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Current recommendation rests on low-quality evidence. No universal stent duration, cure guarantee or ban on later surgery; assess anatomy and individual response.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.pdsa-source-specific-next-test",
    "statement": "A small improvement test can compare a source-specific adaptation while retaining checks and measuring both burden and record agreement.",
    "sourceIds": [
      "source.qq20261102c.ahrq-pdsa",
      "source.qq20261102c.ahrq-measures"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Current/prior/dispensing records and times are fictional local inputs. No empirical prefill benefit or patient/question analytics is claimed.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.breast-core-target-discordance",
    "statement": "Benign breast tissue that does not explain the suspicious imaging target warrants further representative histologic assessment.",
    "sourceIds": [
      "source.qq20261102c.breast-eusobi2020",
      "source.qq20261102c.asbrs2024-archived"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Repeat core, vacuum-assisted or surgical sampling may be appropriate. The missed-target case does not rank all possible techniques universally; skin sampling alone does not clear an unsampled parenchymal lesion.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy",
    "statement": "Recurrent peptic-ulcer bleeding after initial successful hemostasis can warrant repeat endoscopic therapy, with consideration of an OTS clip.",
    "sourceIds": [
      "source.qq20261102c.esge-ulcer2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current full primary guideline. Actual resuscitation/access and prior course matter; not a universal requirement to repeat endoscopy despite any instability or contraindication.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.ulcer-failed-repeat-embolization",
    "statement": "Transcatheter embolization should be considered after unsuccessful repeat endoscopic hemostasis when available.",
    "sourceIds": [
      "source.qq20261102c.esge-ulcer2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current primary guideline. Surgery may be needed when embolization is unavailable/unsuccessful or individual circumstances require it; no universal vital-sign threshold.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.sarcoma-enhancement-biopsy-target",
    "statement": "Contrast-enhanced MRI can help identify viable regions within a soft-tissue mass for representative biopsy targeting.",
    "sourceIds": [
      "source.qq20261102c.essr2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate directly retrieved current primary society consensus; the exact sequence and individual target require MSK review. No contrast dose, signal cutoff or automatic benign/malignant classification is inferred.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.groin-inadequate-study-certainty",
    "statement": "An outside study that did not assess the clinical groin site or provoking event can leave the hernia diagnosis unresolved.",
    "sourceIds": [
      "source.qq20261102c.hernia2018",
      "source.qq20261102c.hernia2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Diagnostic-concordance application of targeted assessment guidance, not a measured sensitivity claim or a universal rule against photographic diagnosis. The actual photograph and acquisition need clinical review; dynamic MRI is not asserted inferior to adequate ultrasound.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.qi-comparison-input-control",
    "statement": "Keeping the clinical input source constant helps distinguish an entry-method change from a simultaneous record-source change in a process comparison.",
    "sourceIds": [
      "source.qq20261102c.nist-comparison",
      "source.qq20261102c.ahrq-pdsa",
      "source.qq20261102c.ahrq-measures"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Original application of experimental-control guidance to a constructed local PDSA comparison. Not a universal one-factor-at-a-time requirement, randomized-trial claim, guarantee of software benefit or clinical recommendation.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R4_SOURCES: ClinicalSource[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.nysdoh",
    "title": "Perioperative Care in Adults With HIV",
    "completeCitation": "Shin SJ, Vail R, Shah S, Fine SM, McGowan JP, Merrick ST, Radix AE, Rodrigues JC, Hoffmann CJ, Norton BL, Gonzalez CJ; NYSDOH AIDS Institute. Perioperative Care in Adults With HIV. Clinical Guidelines Program; November 4, 2024.",
    "organizationOrJournal": "New York State Department of Health AIDS Institute",
    "authors": [
      "Sangyoon Jason Shin",
      "Rona Vail",
      "Sanjiv Shah",
      "Steven M Fine",
      "Joseph P McGowan",
      "Samuel T Merrick",
      "Asa E Radix",
      "Jessica Rodrigues",
      "Christopher J Hoffmann",
      "Brianna L Norton",
      "Charles J Gonzalez"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.hivguidelines.org/guideline/hiv-perioperative/",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government guidance; site and third-party reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Previously verified current government perioperative guidance retained for boosted-PI parenteral midazolam exposure/monitoring; no new dose rule. Same publication as source.qq20261102b.nysdoh-hiv; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.midazolam-route-and-monitoring"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.chicago",
    "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
    "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
    "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
    "authors": [
      "Rena Yadlapati",
      "Peter J Kahrilas",
      "Mark R Fox",
      "Albert J Bredenoord",
      "C Prakash Gyawali",
      "Sabine Roman",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.1111/nmo.14058",
    "pmid": "33373111",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
    "accessedOn": "2026-11-02",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
    "authorityAssessment": "Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.hrm-incomplete-placement",
      "claim.qq20261102c.hrm-protocol-and-provocation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.hernia2018",
    "title": "International guidelines for groin hernia management",
    "completeCitation": "The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.",
    "organizationOrJournal": "Hernia / HerniaSurge Group",
    "authors": [
      "The HerniaSurge Group"
    ],
    "publicationYear": 2018,
    "doi": "10.1007/s10029-017-1668-x",
    "pmid": "29330835",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced.",
    "authorityAssessment": "Full primary guideline rechecked this round for dynamic imaging after negative studies, competing musculoskeletal causes and watchful waiting in selected men. Same publication as source.qq20261102a.hernia2018; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.groin-imaging-after-negative-study",
      "claim.qq20261102c.groin-symptom-attribution",
      "claim.qq20261102c.groin-inadequate-study-certainty"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.hernia2023",
    "title": "Update of the international HerniaSurge guidelines for groin hernia management",
    "completeCitation": "Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.",
    "organizationOrJournal": "BJS Open / HerniaSurge Collaboration",
    "authors": [
      "Cesare Stabilini",
      "Nadine van Veenendaal",
      "Eske Aasvang",
      "Ferdinando Agresta",
      "Theo Aufenacker",
      "Frederik Berrevoet",
      "Ine Burgmans",
      "David Chen",
      "Andrew de Beaux",
      "Barbora East",
      "José Garcia-Alamino",
      "Nadia Henriksen",
      "Ferdinand Köckerling",
      "Jan Kukleta",
      "Maarten Loos",
      "Manuel Lopez-Cano",
      "Ralph Lorenz",
      "Marc Miserez",
      "Agneta Montgomery",
      "Salvador Morales-Conde",
      "Chris Oppong",
      "Maciej Pawlak",
      "Mauro Podda",
      "Wolfgang Reinpold",
      "David Sanders",
      "Alberto Sartori",
      "Hanh Minh Tran",
      "Mireia Verdaguer",
      "Reiko Wiessner",
      "Michael Yeboah",
      "Willem Zwaans",
      "Maarten Simons"
    ],
    "publicationYear": 2023,
    "doi": "10.1093/bjsopen/zrad080",
    "pmid": "37862616",
    "officialUrl": "https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced.",
    "authorityAssessment": "Current update retained alongside its 2018 foundation; it is not represented as a separate randomized study proving an individual pain source. Same publication as source.qq20261102a.hernia2023; a new record ID does not create independent evidence.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261102c.groin-imaging-after-negative-study",
      "claim.qq20261102c.groin-symptom-attribution",
      "claim.qq20261102c.groin-inadequate-study-certainty"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ata2025",
    "title": "2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer",
    "completeCitation": "Ringel MD, Sosa JA, Baloch Z, Bischoff L, Bloom G, Brent GA, et al. 2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer. Thyroid. 2025;35(8):841-985. doi:10.1177/10507256251363120.",
    "organizationOrJournal": "American Thyroid Association / Thyroid",
    "authors": [
      "Matthew D Ringel",
      "Julie Ann Sosa",
      "Zubair Baloch",
      "Lindsay Bischoff",
      "Gary Bloom",
      "Gregory A Brent",
      "et al."
    ],
    "publicationYear": 2025,
    "doi": "10.1177/10507256251363120",
    "pmid": null,
    "officialUrl": "https://thyca.org/wp-content/uploads/DTCGuidelines.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright American Thyroid Association; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full primary guideline rechecked through the public ThyCa PDF. Supports suspicious cystic-node assessment, targeted FNA and selected thyroglobulin washout; intact-thyroid limitations preserved. Same publication as source.qq20261102a.ata2025; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.thyroid-cystic-node-discordance"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ascrs2022",
    "title": "The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer",
    "completeCitation": "Vogel JD, Felder SI, Bhama AR, Hawkins AT, Langenfeld SJ, Shaffer VO, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer. Dis Colon Rectum. 2022;65(2):148-177. doi:10.1097/DCR.0000000000002323.",
    "organizationOrJournal": "American Society of Colon and Rectal Surgeons / Diseases of the Colon and Rectum",
    "authors": [
      "Jon D Vogel",
      "Scott I Felder",
      "Anuradha R Bhama",
      "Alexander T Hawkins",
      "Sean J Langenfeld",
      "Vaughn O Shaffer",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1097/DCR.0000000000002323",
    "pmid": null,
    "officialUrl": "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982018/all/Management_of_Colon_Cancer__2022_",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASCRS; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyright ASCRS/Wolters Kluwer. Targeted factual verification through the public complete society guideline only; no source prose, tables, algorithms or images stored. The older official PDF URL returned 404; a moved/expired toolkit route was not used as evidence.",
    "authorityAssessment": "Retain the complete primary guideline verified in the preceding same-day correction and its already mapped coverage/MRI-alternative claims. Current direct fetch returned 403; no new conclusion is based on its search snippet. The new liver-specific choice is independently checked against the full ACR criteria. Same publication as source.qq20261102b.ascrs-colon; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.colon-adequate-regions-and-chest-ct"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.essr2023",
    "title": "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where?",
    "completeCitation": "Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.",
    "organizationOrJournal": "European Radiology",
    "authors": [
      "Noebauer-Huhmann IM",
      "Vanhoenacker FM",
      "Vilanova JC",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s00330-023-10425-5",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s00330-023-10425-5",
    "accessedOn": "2026-11-02",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .",
    "authorityAssessment": "Full current primary MSK guideline rechecked this round at https://pmc.ncbi.nlm.nih.gov/articles/PMC11213759/ for whole-lesion/compartment coverage and enhancement-based viable biopsy targeting. CC BY 4.0 independently confirmed; original factual synthesis only, no consensus table/protocol values copied. Exact case protocols still need radiologist review. Same publication as source.qq20261102a.essr2023; a new record ID does not create independent evidence.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102c.sarcoma-mri-coverage-and-target",
      "claim.qq20261102c.sarcoma-enhancement-biopsy-target"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.bsh2024",
    "title": "Guideline for the diagnosis and management of marginal zone lymphomas: A British Society of Haematology Guideline",
    "completeCitation": "Walewska R, Eyre TA, Barrington S, Brady J, Fields P, Iyengar S, et al.; British Society of Haematology. Guideline for the diagnosis and management of marginal zone lymphomas. Br J Haematol. 2024;204(1):86-107. doi:10.1111/bjh.19064. First published November 13, 2023.",
    "organizationOrJournal": "British Society of Haematology / British Journal of Haematology",
    "authors": [
      "Renata Walewska",
      "Toby A Eyre",
      "Sally Barrington",
      "Jessica Brady",
      "Paul Fields",
      "Sunil Iyengar",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1111/bjh.19064",
    "pmid": null,
    "officialUrl": "https://b-s-h.org.uk/media/x0bbg4bs/guideline-for-the-diagnosis-and-management-of-marginal-zone-lymphomas-a-british-society.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright BSH/Wiley; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full primary guideline rechecked this round for integrated diagnosis, large-cell transformation, infection testing, residual disease and escalation boundaries; no lymphoma response deadline invented. Same publication as source.qq20261102b.bsh-mzl; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.gastric-clonality-classification-boundary",
      "claim.qq20261102c.gastric-large-cell-transformation-boundary",
      "claim.qq20261102c.gastric-eradication-response-pathway",
      "claim.qq20261102c.hpylori-test-conditions",
      "claim.qq20261102c.gastric-regressing-residual-monitoring",
      "claim.qq20261102c.gastric-molecular-persistence",
      "claim.qq20261102c.gastric-negative-fusion-not-exclusion",
      "claim.qq20261102c.gastric-progressive-local-escalation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.sel2022",
    "title": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: ESGE Guideline",
    "completeCitation": "Deprez PH, Moons LMG, O'Toole D, Gincul R, Seicean A, Pimentel-Nunes P, et al. Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Pierre H Deprez",
      "Leon MG Moons",
      "Dermot O'Toole",
      "Rodica Gincul",
      "Andrada Seicean",
      "Pedro Pimentel-Nunes",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1055/a-1751-5742",
    "pmid": null,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE; all rights reserved; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full primary guideline rechecked this round for subepithelial wall layers, characteristic lipoma diagnosis, selective tissue acquisition and no surveillance when clearly diagnosed/asymptomatic. Same publication as source.qq20261102a.esge-sel2022; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.classic-lipoma-normal-mucosal-sample"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ksge2021",
    "title": "Clinical Practice Guidelines for the Endoscopic Management of Peripancreatic Fluid Collections",
    "completeCitation": "Oh CH, Lee JK, Song TJ, Park JS, Lee JM, Son JH, et al. Clinical Endoscopy. 2021;54(4):505-521. doi:10.5946/ce.2021.185.",
    "organizationOrJournal": "Korean Society of Gastrointestinal Endoscopy",
    "authors": [
      "Oh CH",
      "Lee JK",
      "Song TJ",
      "Park JS",
      "Lee JM",
      "Son JH",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.5946/ce.2021.185",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8357592/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC 3.0; copyright Korean Society of Gastrointestinal Endoscopy",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "https://creativecommons.org/licenses/by-nc/3.0/ . Targeted factual verification only; no article text, algorithm, table, figure or protocol copied/adapted. Current document explicitly uses version 3.0, not an assumed 4.0 license.",
    "authorityAssessment": "Full primary guideline rechecked for contents/duct imaging, apposition, partial leaks, arterial bleeding and post-procedure risks. Older technical guidance corroborated against current 2026 recommendations. Same publication as source.ksge.pancreatic-fluid-collections.2021; a new record ID does not create independent evidence.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261102c.pancreatic-arterial-focus-before-drainage",
      "claim.qq20261102c.pancreatic-mri-contents",
      "claim.qq20261102c.pancreatic-necrosis-step-up",
      "claim.qq20261102c.pancreatic-duct-mapping",
      "claim.qq20261102c.pancreatic-partial-leak-bridge",
      "claim.qq20261102c.pancreatic-disconnected-long-term-drainage"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.nist-p",
    "title": "Critical values and p values",
    "completeCitation": "National Institute of Standards and Technology. Engineering Statistics Handbook: Critical values and p values. Accessed 2026-09-29.",
    "organizationOrJournal": "National Institute of Standards and Technology",
    "authors": [
      "National Institute of Standards and Technology"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing government statistical-methods reference retained for null testing; the hypothetical benefit target is not a clinical recommendation. Same publication as source.qq20261102b.nist-p; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.uncertain-target-benefit-not-excluded"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.nist-ci",
    "title": "What are confidence intervals?",
    "completeCitation": "National Institute of Standards and Technology. Engineering Statistics Handbook: What are confidence intervals? Accessed 2026-09-29.",
    "organizationOrJournal": "National Institute of Standards and Technology",
    "authors": [
      "National Institute of Standards and Technology"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing government methods reference retained for effect intervals and uncertainty; no posterior probability of a true treatment effect is claimed. Same publication as source.qq20261102b.nist-ci; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.uncertain-target-benefit-not-excluded"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ahrq-pdsa",
    "title": "Plan-Do-Check-Act Cycle",
    "completeCitation": "Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.",
    "organizationOrJournal": "Agency for Healthcare Research and Quality",
    "authors": [
      "Agency for Healthcare Research and Quality"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing government improvement guidance retained for testing an adaptation from local observations rather than declaring an untested prefill benefit. Same publication as source.qq20261102b.ahrq-pdca; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.pdsa-source-specific-next-test",
      "claim.qq20261102c.qi-comparison-input-control"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ahrq-measures",
    "title": "Chapter 6. Track Performance with Metrics",
    "completeCitation": "Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29.",
    "organizationOrJournal": "Agency for Healthcare Research and Quality",
    "authors": [
      "Agency for Healthcare Research and Quality"
    ],
    "publicationYear": 2016,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing government improvement guidance retained for process/outcome/balancing measures; constructed workflow data are not real patients or gameplay analytics. Same publication as source.qq20261102b.ahrq-metrics; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.pdsa-source-specific-next-test",
      "claim.qq20261102c.qi-comparison-input-control"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.flumazenil2025",
    "title": "Flumazenil prescribing information",
    "completeCitation": "Fresenius Kabi USA, LLC. Flumazenil Injection, USP: prescribing information. DailyMed/National Library of Medicine. Label updated March 27, 2025; current label archive version published April 16, 2025.",
    "organizationOrJournal": "Fresenius Kabi / DailyMed, US National Library of Medicine",
    "authors": [
      "Fresenius Kabi USA, LLC"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a72d9fc1-121c-455d-93a9-002378c9968f",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government-hosted manufacturer labeling; no public-domain license inferred for all label content",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted safety-fact verification only; no dosing table, prose or manufacturer material reproduced.",
    "authorityAssessment": "Primary current product labeling explicitly addresses benzodiazepine use for potentially life-threatening conditions and airway support. A single adequate authoritative label for this contraindication; the constructed seizure-course interpretation requires clinical review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.flumazenil-seizure-control-contraindication"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.acg-physiology2020",
    "title": "ACG esophageal physiologic testing guideline",
    "completeCitation": "Gyawali CP, Carlson DA, Chen JW, Patel A, Wong RJ, Yadlapati RH. ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing. Am J Gastroenterol. 2020;115(9):1412-1428. doi:10.14309/ajg.0000000000000734.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Gyawali CP",
      "Carlson DA",
      "Chen JW",
      "Patel A",
      "Wong RJ",
      "Yadlapati RH"
    ],
    "publicationYear": 2020,
    "doi": "10.14309/ajg.0000000000000734",
    "pmid": "32769426",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9468980/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Public author manuscript; reusable license not established",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "No algorithms, protocol tables, source text or exact maneuver quantities copied. Factual verification of society guidance only.",
    "authorityAssessment": "Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.hrm-incomplete-placement",
      "claim.qq20261102c.hrm-protocol-and-provocation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.esmo-melanoma2025",
    "title": "ESMO cutaneous melanoma guideline",
    "completeCitation": "Amaral T, Ottaviano M, Arance A, Blank C, Chiarion-Sileni V, Donia M, et al.; ESMO Guidelines Committee. Cutaneous melanoma: ESMO Clinical Practice Guideline for diagnosis, treatment and follow-up. Ann Oncol. 2025;36(1):10-30. doi:10.1016/j.annonc.2024.11.006.",
    "organizationOrJournal": "European Society for Medical Oncology / Annals of Oncology",
    "authors": [
      "Amaral T",
      "Ottaviano M",
      "Arance A",
      "Blank C",
      "Chiarion-Sileni V",
      "Donia M",
      "ESMO Guidelines Committee"
    ],
    "publicationYear": 2025,
    "doi": "10.1016/j.annonc.2024.11.006",
    "pmid": "39550033",
    "officialUrl": "https://doi.org/10.1016/j.annonc.2024.11.006",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Publisher society copyright; targeted verification only (PMC manuscript separately reports CC BY)",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Access route: https://www.icpf.pf/wp-content/uploads/2025/08/ESMO-2025-Melanome.pdf . PMC routes returned a browser check, so no inaccessible snippet was evidence. No staging tables, margin table, figure or treatment algorithm copied.",
    "authorityAssessment": "Full guideline read through the public cancer-institute-hosted copy for complete diagnostic biopsy, microstaging, clinically negative sentinel assessment and stage-based workup. Partial-specimen and missed-node applications are independently authored clinical inferences, not a universal completion algorithm.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
      "claim.qq20261102c.melanoma-suspicious-node-pathway"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.nci-melanoma",
    "title": "NCI melanoma treatment professional summary",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ): Health Professional Version. National Cancer Institute; live summary, accessed November 2, 2026.",
    "organizationOrJournal": "US National Cancer Institute",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI factual material; PDQ attribution and third-party conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "No AJCC staging table, copyrighted third-party content, images or source prose reproduced; underlying facts independently synthesized.",
    "authorityAssessment": "Current full government summary cross-checks the occult-node purpose of SLNB and distinction from clinically detected disease. Not an independent rule for the exact biopsy technique after a missed sample.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.melanoma-suspicious-node-pathway"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.acr-liver2020",
    "title": "ACR liver lesion initial characterization criteria",
    "completeCitation": "American College of Radiology Expert Panel on Gastrointestinal Imaging; Chernyak V, Horowitz JM, Kamel IR, et al. ACR Appropriateness Criteria: Liver Lesion-Initial Characterization. Revised 2020.",
    "organizationOrJournal": "American College of Radiology",
    "authors": [
      "Chernyak V",
      "Horowitz JM",
      "Kamel IR",
      "ACR Expert Panel on Gastrointestinal Imaging"
    ],
    "publicationYear": 2020,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://acsearch.acr.org/docs/69472/Narrative/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ACR; no reusable license inferred",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Direct ACR route returned 403. Full primary document read at University of Florida: https://widionline.xray.ufl.edu/admin/getmedia/1b06a743-8cef-45fd-b324-900d057083e1/Liver-Lesion-%E2%80%94-Initial-Characterization-%281%29.pdf . No rating table copied; 8 mm is a fictional observation within the documented subcentimeter scenario.",
    "authorityAssessment": "Full criteria checked for subcentimeter single-phase CT findings in known extrahepatic malignancy. MRI/multiphase CT alternatives are preserved; routine PET is not made universally inappropriate for larger lesions.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.colon-indeterminate-liver-mri"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.breast-eusobi2020",
    "title": "EUSOBI image-guided breast biopsy recommendations",
    "completeCitation": "Bick U, Trimboli RM, Athanasiou A, Balleyguier C, Baltzer PAT, Bernathova M, et al.; European Society of Breast Imaging. Image-guided breast biopsy and localisation: recommendations for information to women and referring physicians by the European Society of Breast Imaging. Insights Imaging. 2020;11:12. doi:10.1186/s13244-019-0803-x.",
    "organizationOrJournal": "European Society of Breast Imaging / Insights into Imaging",
    "authors": [
      "Bick U",
      "Trimboli RM",
      "Athanasiou A",
      "Balleyguier C",
      "Baltzer PAT",
      "Bernathova M",
      "European Society of Breast Imaging"
    ],
    "publicationYear": 2020,
    "doi": "10.1186/s13244-019-0803-x",
    "pmid": "32025985",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7002629/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0; copyright the authors",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Original synthesis with citation only; no source prose, patient images or figures copied.",
    "authorityAssessment": "Full primary society recommendations directly support checking target/specimen concordance and further histology after discordance; multiple repeat techniques may be appropriate.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.breast-core-target-discordance"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.asbrs2024-archived",
    "title": "ASBrS archived high-risk lesion resource guide",
    "completeCitation": "American Society of Breast Surgeons. Resource Guide: Surgical Management of Benign or High-Risk Lesions. 2024. Archived version, accessed November 2, 2026.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "American Society of Breast Surgeons"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-high-risk-lesions.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASBrS; archived guidance, no reuse license",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Full archived PDF read; alternate rg-high-risk-lesions URL served the same edition. No source table, gauge, lesion threshold or expression adapted.",
    "authorityAssessment": "Cross-check only of the general discordance principle and repeat-core/vacuum/excision alternatives. The visible Archived label is preserved; this is not represented as current comprehensive lesion-management guidance.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261102c.breast-core-target-discordance"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.malt-review2023",
    "title": "Independent gastric MALT clinical review",
    "completeCitation": "Matysiak-Budnik T, Priadko K, Bossard C, Chapelle N, Ruskoné-Fourmestraux A. Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View. Cancers. 2023;15(15):3811. doi:10.3390/cancers15153811.",
    "organizationOrJournal": "Cancers",
    "authors": [
      "Matysiak-Budnik T",
      "Priadko K",
      "Bossard C",
      "Chapelle N",
      "Ruskoné-Fourmestraux A"
    ],
    "publicationYear": 2023,
    "doi": "10.3390/cancers15153811",
    "pmid": "37568627",
    "officialUrl": "https://doi.org/10.3390/cancers15153811",
    "accessedOn": "2026-11-02",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; copyright the authors",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Full licensed original publication read via https://pdfs.semanticscholar.org/7789/4b60720f600d0fb1b6fc625dfb1613d5109e.pdf after publisher/PMC retrieval restrictions. No source expression, figures or tables copied.",
    "authorityAssessment": "Independent open clinical review cross-checks morphology/clonality limits, fusion-test prevalence, residual-disease monitoring and treatment after eradication. Not a second guideline or proof of an exact individual response deadline.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.gastric-clonality-classification-boundary",
      "claim.qq20261102c.gastric-eradication-response-pathway",
      "claim.qq20261102c.gastric-regressing-residual-monitoring",
      "claim.qq20261102c.gastric-molecular-persistence",
      "claim.qq20261102c.gastric-negative-fusion-not-exclusion",
      "claim.qq20261102c.gastric-progressive-local-escalation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ilatam2026",
    "title": "Current Ibero-Latin American acute pancreatitis guideline",
    "completeCitation": "Cárdenas-Jaén K, Guilabert L, Martínez-Moneo E, Mancilla C, Bispo M, Moutinho-Ribeiro P, et al. AEG-AESPANC-OPGE-SIED-SPG Ibero-Latin American Guidelines on Acute Pancreatitis (iLATAM-AP). United European Gastroenterol J. 2026;14(5):e70190. doi:10.1002/ueg2.70190.",
    "organizationOrJournal": "AEG/AESPANC/OPGE/SIED/SPG / United European Gastroenterology Journal",
    "authors": [
      "Cárdenas-Jaén K",
      "Guilabert L",
      "Martínez-Moneo E",
      "Mancilla C",
      "Bispo M",
      "Moutinho-Ribeiro P",
      "et al."
    ],
    "publicationYear": 2026,
    "doi": "10.1002/ueg2.70190",
    "pmid": "42216617",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13240590/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC-ND 4.0; copyright the authors",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "https://creativecommons.org/licenses/by-nc-nd/4.0/ . No adaptation of guideline expression, algorithm, table or figures. Underlying clinical facts independently synthesized with citation.",
    "authorityAssessment": "Current full primary guideline directly addresses MRCP/duct discontinuity, transluminal drainage, long-term plastic stents and step-up intervention. Duct/stent recommendations include low-quality evidence and must remain clinician-reviewed.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.pancreatic-arterial-focus-before-drainage",
      "claim.qq20261102c.pancreatic-mri-contents",
      "claim.qq20261102c.pancreatic-necrosis-step-up",
      "claim.qq20261102c.pancreatic-duct-mapping",
      "claim.qq20261102c.pancreatic-disconnected-long-term-drainage"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.esge-ulcer2026",
    "title": "ESGE peptic-ulcer bleeding guideline update",
    "completeCitation": "Gralnek IM, Morris J, Laursen SB, Camus M, Tziatzios G, Debels LK, Nigam GB, Erőss B, Goetz M, Forbes N, Cúrdia Gonçalves T, Kurek K, Bretthauer M, Tham TC. Endoscopic diagnosis and management of peptic ulcer bleeding: ESGE Guideline-Update 2026. Endoscopy. 2026;58(8):899-924. doi:10.1055/a-2863-8314.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Gralnek IM",
      "Morris J",
      "Laursen SB",
      "Camus M",
      "Tziatzios G",
      "Debels LK",
      "Nigam GB",
      "Erőss B",
      "Goetz M",
      "Forbes N",
      "Cúrdia Gonçalves T",
      "Kurek K",
      "Bretthauer M",
      "Tham TC"
    ],
    "publicationYear": 2026,
    "doi": "10.1055/a-2863-8314",
    "pmid": "42127996",
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE/Thieme 2026; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification, no algorithm/figure/table copied. Correction doi:10.1055/a-2881-7411 (PMID42173116) was identified; its separate PDF could not be retrieved. The actual recommendation text in the current official PDF was checked; no claim that every correction/supplement was independently adjudicated.",
    "authorityAssessment": "Current full official PDF checked for repeat hemostasis in recurrent bleeding, consideration of OTS clips and embolization after failed second hemostasis. This supersedes reliance on 2021 as the latest version.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy",
      "claim.qq20261102c.ulcer-failed-repeat-embolization"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.nist-comparison",
    "title": "NIST experimental-design guidance on controlled factors",
    "completeCitation": "National Institute of Standards and Technology; SEMATECH. NIST/SEMATECH e-Handbook of Statistical Methods. Section 5.3.3.2: Randomized block designs. Undated live section; accessed November 2, 2026.",
    "organizationOrJournal": "US National Institute of Standards and Technology / SEMATECH",
    "authors": [
      "National Institute of Standards and Technology",
      "SEMATECH"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "US government methods guidance; third-party conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Full official section checked. Original methods application only; no source text, example, formula, table or diagram copied. Applied alongside existing AHRQ small-test/measurement guidance.",
    "authorityAssessment": "Primary statistical-methods guidance for controlling extraneous variation while changing a factor of interest. Same handbook as the retained p-value/interval sections, not independent clinical evidence. The source does not prescribe a universal PDSA protocol or prove any clinical software benefit.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.qi-comparison-input-control"
    ]
  }
];
