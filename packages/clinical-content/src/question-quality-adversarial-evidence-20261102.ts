import type {ClinicalSource, EvidenceClaim} from "./pilot-schema";

/** Independently worded facts; all remain needs_clinician_review. */
export const QUESTION_QUALITY_ADVERSARIAL_CLAIMS: EvidenceClaim[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.gallbladder-filling-versus-emptying",
    "statement": "Gallbladder-filling scintigraphy evaluates cystic-duct patency, whereas stimulated ejection fraction evaluates gallbladder emptying.",
    "sourceIds": [
      "source.qq20261102a.snm-hida",
      "source.qq20261102a.wses"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One technique-specific guideline plus an independent acute-disease guideline. Normal ultrasound wall/fluid components do not exclude acute disease; a universal HIDA-over-every-CT/MRI ranking is not asserted.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.mixed-discharge-medication",
    "statement": "Metoclopramide can increase prolactin and produce galactorrhea.",
    "sourceIds": [
      "source.qq20261102a.reglan-label"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Primary regulatory label only for this drug fact; no dose, timing or causation of a focal breast lesion claimed. Separate existing discharge claims support assessment of spontaneous unilateral episodes.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.mixed-discharge-local-assessment",
    "statement": "Spontaneous unilateral nipple discharge warrants breast-local assessment rather than being explained away by expressed bilateral secretion.",
    "sourceIds": [
      "source.qq20261102a.pitarch"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Application synthesized from the separate pattern definitions in one open review, not a reported mixed-phenotype trial. Color alone is not a malignancy diagnosis; the medication-associated component can coexist.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.initial-breast-pathway",
    "statement": "In women over 40 with a pathologic discharge pattern, initial mammography is generally combined with ultrasound; MRI has a subsequent problem-solving role.",
    "sourceIds": [
      "source.qq20261102a.pitarch"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One current open imaging review, cross-checked against retained project discharge-imaging evidence. The exact age boundary is supported by the source; every supplied female profile is above it. Local imaging suitability remains clinician review.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.boosted-midazolam-routes",
    "statement": "Oral midazolam is contraindicated with ritonavir-boosted protease-inhibitor therapy.",
    "sourceIds": [
      "source.qq20261102a.nysdoh-hiv"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One adequately retrieved current guideline for this added interaction fact; NIH direct table returned 403 and is not counted as independent verification.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.boosted-parenteral-titration",
    "statement": "Parenteral midazolam may be considered with boosted protease inhibitors in an appropriately monitored setting, with dose reduction considered particularly for repeated doses.",
    "sourceIds": [
      "source.qq20261102a.nysdoh-hiv"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One verified current guideline. No exact dose, mandatory universal reduction, unsupervised administration or washout interval authored; anesthesia/HIV coordination required.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.art-continuity",
    "statement": "Avoid uncoordinated perioperative ART interruption; consult the HIV team when interruption cannot be avoided.",
    "sourceIds": [
      "source.qq20261102a.nysdoh-hiv"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One verified current guideline; administration feasibility and individual interactions still require clinical review. The existing named-regimen claim independently verifies the four-drug combination.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.pressure-not-peristalsis",
    "statement": "Simultaneous panesophageal pressurization is not preserved propagated peristalsis when classifying achalasia.",
    "sourceIds": [
      "source.qq20261102a.chicago",
      "source.qq20261102a.seoul"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Clinical application and the constructed phenotype require Melissa's review; no exact clinical probability, dose or timing is inferred.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.primary-position-achalasia",
    "statement": "Abnormal median IRP in the primary test position with absent peristalsis can establish achalasia; abnormal IRP in both positions is not required as it is for an EGJOO pattern.",
    "sourceIds": [
      "source.qq20261102a.chicago"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single primary classification consensus for the exact positional distinction; ten primary-position swallows and protocol adequacy require clinical confirmation. No device-specific IRP threshold invented.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.spastic-achalasia",
    "statement": "Premature or failed rather than normally peristaltic swallows with abnormal junction relaxation support a spastic achalasia pattern.",
    "sourceIds": [
      "source.qq20261102a.chicago",
      "source.qq20261102a.seoul"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The constructed case uses most premature swallows and remaining failed swallows; no subtype label is asked. Technical adequacy, latency reference and opioid effects require review.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.failed-contraction-threshold",
    "statement": "Chicago v4.0 classifies DCI below 100 mmHg.s.cm as failed contraction.",
    "sourceIds": [
      "source.qq20261102a.chicago"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "The exact cutoff is explicitly supported by the consensus. B04's 30-80 readings are synthetic examples inside that range, not an invented normal threshold or measured patient dataset.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.esophageal-physiology-sequence",
    "statement": "High-resolution manometry supplies esophageal motor classification when persistent obstructive swallowing symptoms remain after structural evaluation.",
    "sourceIds": [
      "source.qq20261102a.chicago",
      "source.qq20261102a.seoul"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "FLIP can complement inconclusive studies or be used in selected circumstances; it is not declared useless. No later pressure result is used to justify the earlier task.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.groin-initial-dynamic-assessment",
    "statement": "Ultrasound is an initial imaging approach for suspected groin hernia when examination does not establish the diagnosis.",
    "sourceIds": [
      "source.qq20261102a.hernia2018",
      "source.qq20261102a.hernia2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "MRI can be appropriate after unresolved assessment; the case establishes first imaging and an intermittent lump, without an availability cue.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.symptomatic-groin-planning",
    "statement": "Activity-limiting symptoms from an inguinal hernia favor discussion of elective repair rather than treating the patient as an asymptomatic watchful-waiting candidate.",
    "sourceIds": [
      "source.qq20261102a.hernia2018",
      "source.qq20261102a.hernia2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Risk, preferences and surgical assessment remain necessary; no compulsory operation, emergency state or outcome probability asserted.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.papillary-cytology-regional-survey",
    "statement": "Malignant thyroid cytology warrants preoperative ultrasound assessment of central and lateral cervical nodal compartments.",
    "sourceIds": [
      "source.qq20261102a.ata2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Current primary guideline supports the initial survey; additional CT/MRI or sampling can be appropriate for extensive/invasive or sonographically suspicious disease. No node-size threshold authored.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.papillary-cytology-pattern",
    "statement": "Papillary groups with nuclear grooves and intranuclear cytoplasmic inclusions support a papillary thyroid carcinoma interpretation.",
    "sourceIds": [
      "source.qq20261102a.ptc-cytology"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "A groove alone is insufficient; integrated architecture/nuclei and cytopathologist review are required. No histologic subtype or absolute specificity is taught.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.melanoma-integrated-node-staging",
    "statement": "Clinically node-negative invasive melanoma in the supplied greater-than-1-mm range calls for sentinel-node staging consideration; reassuring ultrasound does not replace microscopic nodal staging.",
    "sourceIds": [
      "source.qq20261102a.eado2024",
      "source.qq20261102a.nci-melanoma"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Existing synthetic thickness values are retained. No fixed metastatic probability or survival benefit asserted; subtype and patient suitability remain clinician review.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.melanoma-diagnostic-sampling",
    "statement": "When feasible, complete diagnostic removal of a suspicious melanocytic lesion supports assessment of its architecture and invasion depth.",
    "sourceIds": [
      "source.qq20261102a.eado2024",
      "source.qq20261102a.nci-melanoma"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The offered tangential option is explicitly limited to papillary dermis; this does not condemn every shave or require excision in anatomically unsuitable lesions.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.malignant-polyp-adverse-features",
    "statement": "Adverse invasive-polyp histology or incomplete resection can warrant oncologic regional resection despite a clear-looking scar.",
    "sourceIds": [
      "source.qq20261102a.ascrs-colon"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One verified primary guideline for this added scope: lymphovascular invasion, poor differentiation, involved deep margin and fragmentation are separately constructed case findings. Individual pedunculated/sessile risk and operative fitness require review; normal CT nodes do not prove microscopic negativity.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.colon-systemic-staging",
    "statement": "Chest, abdominal and pelvic CT is a standard initial colon-cancer staging pathway; routine PET-CT is not its automatic replacement.",
    "sourceIds": [
      "source.qq20261102a.ascrs-colon"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single retrieved guideline. Chest CT plus abdominal MRI is also an accepted pathway and is deliberately not offered as wrong; chest radiography is not equivalent thoracic staging. Contrast suitability assumed, not guaranteed.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.sarcoma-viable-biopsy-target",
    "statement": "Image-guided core sampling of a heterogeneous soft-tissue tumor should target viable tumor identified with enhancement or vascularity.",
    "sourceIds": [
      "source.qq20261102a.essr2015-target",
      "source.qq20261102a.seom2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Exact targeting is directly supported by older primary technique guidance; current society guidance corroborates planned image-guided core biopsy. No diagnostic certainty from MRI alone, invented needle size or tract rule added.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.sarcoma-local-imaging",
    "statement": "MRI is the preferred local characterization/staging study for a deep or indeterminate limb soft-tissue mass before planned biopsy.",
    "sourceIds": [
      "source.qq20261102a.essr2023",
      "source.qq20261102a.seom2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "CT is useful in selected circumstances; ultrasound can triage accessible lesions. The supplied prior ultrasound establishes deep extent, rather than merely a lesion beneath skin.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.subepithelial-integrated-pattern",
    "statement": "A homogeneous bright submucosal lesion with a yellow deformable endoscopic appearance supports lipoma characterization.",
    "sourceIds": [
      "source.qq20261102a.esge-sel2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One primary guideline for the added raw EUS detail; existing lipoma evidence separately supports no directed follow-up when confidently characterized and asymptomatic. Not all SELs can be diagnosed from EUS alone.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.gastric-depth-nodes-organ-plan",
    "statement": "A gastric primary extending into muscularis propria falls outside the early T1 nodal-dissection scope and supports a D2 framework in the represented operative plan.",
    "sourceIds": [
      "source.qq20261102a.jgca2021",
      "source.qq20261102a.korean-gastric"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The synthetic wall-layer observation must be checked by Melissa. No exact nodal station algorithm or disputed JGCA2025 hilar recommendation is used.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.gastric-spleen-preservation",
    "statement": "Prophylactic splenectomy is not routine for the represented proximal gastric cancer without greater-curvature or splenic invasion.",
    "sourceIds": [
      "source.qq20261102a.korean-gastric",
      "source.qq20261102a.jgca2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The separate contradictory English JGCA2025 hilar statement remains withheld. Direct invasion or therapeutic nodal indications can change scope; the case's fat plane is not proof against every microscopic extension.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.gastric-lineage-not-classification",
    "statement": "CD20 establishes B-cell lineage but is insufficient without representative morphology and ancillary assessment to classify gastric MALT lymphoma.",
    "sourceIds": [
      "source.qq20261102a.bsh-mzl",
      "source.qq20261102a.malt2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Repeat representative biopsies are warranted for the constructed crushed, architecture-poor sample. Clonality alone can occur in reactive inflammation and does not resolve every lymphoma subtype.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.gastric-malt-response-assessment",
    "statement": "Histologic gastric response assessment is needed after H. pylori-directed treatment of gastric MALT lymphoma; symptoms alone do not establish remission.",
    "sourceIds": [
      "source.qq20261102a.bsh-mzl",
      "source.qq20261102a.malt2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No eradication regimen, exact follow-up interval, universal response probability or automatic salvage rule authored.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.gastric-small-b-cell-differential",
    "statement": "Gastric small B-cell infiltration with gland involvement and a CD20/CD79a-positive, CD5/CD10/cyclin-D1-negative profile supports MALT lymphoma in integrated pathology review.",
    "sourceIds": [
      "source.qq20261102a.bsh-mzl",
      "source.qq20261102a.malt2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Markers have exceptions; this is not a unique single-stain rule, and lymphoma classification requires morphology, clinical context and expert review.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.null-test-versus-protocol-magnitude",
    "statement": "Testing against no effect and evaluating a prespecified meaningful effect or equivalence margin are different statistical questions.",
    "sourceIds": [
      "source.qq20261102a.nist-p",
      "source.qq20261102a.nist-ci",
      "source.qq20261102a.lakens2017"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "B26/B27/B31/B39 numbers, targets and intervals are constructed protocol inputs, not clinical thresholds or observed treatment effects. TOST .05 uses a 90% CI, not a substituted 95% CI; arithmetic/rounding is separately validated.",
    "applicablePopulation": "Explicitly fictional study datasets; methodology only, not observed intervention effects.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.odds-to-risk-conversion",
    "statement": "For a fixed covariate profile, multiply baseline odds by the conditional odds ratio, then convert resulting odds to risk as odds/(1+odds).",
    "sourceIds": [
      "source.qq20261102a.dhsc-odds"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Algebraic derivation from definitions, not a causal/marginal prediction. With baseline .40 and OR .60 the risk is 2/7, approximately 29%; all values are fictional inputs.",
    "applicablePopulation": "Explicitly fictional study datasets; methodology only, not observed intervention effects.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.relative-to-absolute-interval",
    "statement": "With a fixed reference risk, a risk-ratio interval transforms to a risk-difference interval by multiplying each endpoint by that risk and subtracting it.",
    "sourceIds": [
      "source.qq20261102a.dhsc-odds",
      "source.qq20261102a.nist-ci"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Derived algebra on fictional inputs: .20*(.40-1)=-.12 and .20*(1.20-1)=.04. A reference-risk uncertainty distribution is not supplied or assumed; intervals are not hard bounds on truth.",
    "applicablePopulation": "Explicitly fictional study datasets; methodology only, not observed intervention effects.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.sedation-supported-discharge",
    "statement": "After IV sedation, discharge planning includes assessed recovery and responsible adult support, not a driver-only transport booking.",
    "sourceIds": [
      "source.qq20261102a.bsg-sedation"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "One current specialist guideline plus retained existing local discharge advice. Local approved escort pathways may differ; no taxi-only shortcut, fixed recovery duration or blanket rule for unsedated/nitrous procedures taught.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.sedation-after-reversal",
    "statement": "Re-sedation can follow flumazenil reversal of midazolam, so apparent immediate recovery does not remove the need for further monitoring.",
    "sourceIds": [
      "source.qq20261102a.bsg-sedation"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One primary specialist guideline. No exact observation period or dose authored; prior benzodiazepine/opioid exposure and individual risk require review.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.pancreatic-contrast-characterization",
    "statement": "Pre-drainage cross-sectional imaging of a pancreatic fluid collection assesses wall, contents, adjacent organs and vessels.",
    "sourceIds": [
      "source.qq20261102a.ksge"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "CT/MRCP and EUS play complementary roles. The item compares specified CT contrast protocols, not CT against a falsely invalid MRI pathway; actual vascular and contrast suitability remain review requirements.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.collection-symptom-attribution",
    "statement": "Persistent attributable symptoms or obstruction can warrant drainage assessment of a walled pancreatic fluid collection.",
    "sourceIds": [
      "source.qq20261102a.ksge"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One verified guideline for this added application. Referral is for access/expertise and symptom attribution assessment, not immediate puncture; no size-only cutoff, exact elapsed time or invented vessel clearance authored.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.pdsa-outcome-balancing-adaptation",
    "statement": "Improvement-cycle decisions should consider whether process changes improve the intended outcome and add burden, then use the findings to plan the next test.",
    "sourceIds": [
      "source.qq20261102a.ahrq-pdca",
      "source.qq20261102a.ahrq-metrics"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "B36 is a fictional process pilot, not patient trial evidence or question correctness analytics. The data favor adapting the form over rollout or training-only repetition; no universal abandon threshold taught.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.ibc-core-versus-adjunctive-skin",
    "statement": "Breast core tissue confirms invasive carcinoma in a suspected inflammatory breast cancer presentation; skin punch can add dermal information but does not replace that confirmation.",
    "sourceIds": [
      "source.qq20261102a.ibc-consensus",
      "source.qq20261102a.nci-ibc"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Existing primary-consensus claim retained; dermal emboli are not required. The poorly informative prior aspirate motivates a tissue core, and staging is conditional on confirmation, preserving the existing external-service bundle.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.ibc-response-local-treatment",
    "statement": "Clinical response to neoadjuvant treatment does not by itself remove the mastectomy and regional radiation components of the represented operable stage III inflammatory breast cancer pathway.",
    "sourceIds": [
      "source.qq20261102a.nci-ibc-treatment",
      "source.qq20261102a.ago2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Conditional future planning, not a claim that systemic therapy occurred during biopsy wait; individual operability and response require review. No modern non-IBC de-escalation rule is extrapolated.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.ulcer-local-modality-choice",
    "statement": "A nonbleeding ulcer vessel can receive mechanical or contact-thermal hemostasis; epinephrine alone is inadequate, and topical agents are not routine sole initial therapy for that finding.",
    "sourceIds": [
      "source.qq20261102a.esge-ulcer"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Current specific guideline only for the new modality comparison; retained ACG evidence independently supports hemostasis indication. Powder can be appropriate rescue/temporizing therapy; after the failed clip the selected contact treatment supplements epinephrine rather than repeating monotherapy. No dose or universal rescue sequence authored.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_SOURCES: ClinicalSource[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.wses",
    "title": "WSES acute calculous cholecystitis guideline",
    "completeCitation": "Pisano M, Allievi N, Gurusamy K, et al. 2020 World Society of Emergency Surgery updated guidelines for acute calculous cholecystitis. World J Emerg Surg. 2020;15:61.",
    "organizationOrJournal": "World Journal of Emergency Surgery",
    "authors": [
      "Pisano M",
      "Allievi N",
      "Gurusamy K",
      "et al."
    ],
    "publicationYear": 2020,
    "doi": "10.1186/s13017-020-00336-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-020-00336-x",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY 4.0 verified on publisher record. https://creativecommons.org/licenses/by/4.0/. Original factual synthesis with citation; no source prose, algorithms, tables or figures copied/adapted.",
    "authorityAssessment": "Current openly licensed WSES guideline: components of clinical inflammation and imaging must be integrated; no single ultrasound observation excludes acute disease. Same publication as source.qq20261028.wses-cholecystitis-2020; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.gallbladder-filling-versus-emptying"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.snm-hida",
    "title": "SNM Practice Guideline for Hepatobiliary Scintigraphy 4.0",
    "completeCitation": "Tulchinsky M, Ciak BW, Delbeke D, Hilson A, Holes-Lewis KA, Stabin MG, Ziessman HA. SNM Practice Guideline for Hepatobiliary Scintigraphy 4.0. J Nucl Med Technol. 2010;38(4):210-218. doi:10.2967/jnmt.110.082289.",
    "organizationOrJournal": "Society of Nuclear Medicine / Journal of Nuclear Medicine Technology",
    "authors": [
      "Mark Tulchinsky",
      "Brian W Ciak",
      "Dominique Delbeke",
      "Andrew Hilson",
      "Kelly A Holes-Lewis",
      "Michael G Stabin",
      "Harvey A Ziessman"
    ],
    "publicationYear": 2010,
    "doi": "10.2967/jnmt.110.082289",
    "pmid": null,
    "officialUrl": "https://tech.snmjournals.org/content/jnmt/38/4/210.full.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright society; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Public full PDF parsed through the research index; direct journal fetch returned 403. Distinguishes filling/nonvisualization from stimulated emptying; preparation, false positives and technical limitations remain relevant. The newer public-comment draft is not treated as an adopted guideline.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.gallbladder-filling-versus-emptying"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.pitarch",
    "title": "An update on multimodal imaging strategies for nipple discharge: from detection to decision",
    "completeCitation": "Pitarch M, Alcantara R, Comerma L, Vazquez de Las Heras I, Azcona J, Wiedemann A, Prutki M, Fallenberg EM. An update on multimodal imaging strategies for nipple discharge: from detection to decision. Insights Imaging. 2025;16:70. doi:10.1186/s13244-025-01947-1.",
    "organizationOrJournal": "Insights into Imaging",
    "authors": [
      "Mireia Pitarch",
      "Rodrigo Alcantara",
      "Laura Comerma",
      "Ivonne Vazquez de Las Heras",
      "Javier Azcona",
      "Antonia Wiedemann",
      "Maja Prutki",
      "Eva Maria Fallenberg"
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s13244-025-01947-1",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13244-025-01947-1",
    "accessedOn": "2026-11-02",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0 (publisher rights statement checked)",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Original factual synthesis with attribution; no copied prose, figures, algorithms or case examples. No source text stored.",
    "authorityAssessment": "Open peer-reviewed imaging review: integrate spontaneous unilateral discharge separately from expressed bilateral secretion; initial mammography/targeted ultrasound and later problem-solving MRI. Same publication as source.qq20261029.pitarch-discharge-2025; this recheck is not an independent second source.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102a.mixed-discharge-local-assessment",
      "claim.qq20261102a.initial-breast-pathway"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.reglan-label",
    "title": "REGLAN (metoclopramide) tablets: prescribing information",
    "completeCitation": "ANI Pharmaceuticals, Inc. REGLAN (metoclopramide) tablets: FDA-approved prescribing information, revised February 2026, section 5.7. DailyMed set de55c133-eb08-4a35-91a2-5dc093027397, version 8.",
    "organizationOrJournal": "ANI Pharmaceuticals / FDA label published by NIH DailyMed",
    "authors": [
      "ANI Pharmaceuticals, Inc."
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=de55c133-eb08-4a35-91a2-5dc093027397&type=display",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government-hosted manufacturer label; underlying labeling rights/conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Primary regulatory label directly supports prolactin elevation and reported galactorrhea. Government hosting is recorded separately from manufacturer copyright; no dosing or implied breast-cancer causation is authored.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.mixed-discharge-medication"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.nysdoh-hiv",
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
    "authorityAssessment": "Current public perioperative guidance, read in full targeted sections. Direct route-specific midazolam and coordinated ART-continuity support; no fixed dose or washout invented. NIH PI table direct fetch was blocked, so no new claim relies on its inaccessible snippet.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.boosted-midazolam-routes",
      "claim.qq20261102a.boosted-parenteral-titration",
      "claim.qq20261102a.art-continuity"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.chicago",
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
    "authorityAssessment": "Primary classification consensus checked in the accessible complete manuscript: primary-position achalasia criterion, absent normal peristalsis, pressurization/spasm distinction and failed DCI below 100 mmHg.s.cm. Same publication as source.qq20261102.chicago-v4; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.pressure-not-peristalsis",
      "claim.qq20261102a.primary-position-achalasia",
      "claim.qq20261102a.spastic-achalasia",
      "claim.qq20261102a.failed-contraction-threshold",
      "claim.qq20261102a.esophageal-physiology-sequence"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.seoul",
    "title": "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
    "completeCitation": "Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.",
    "organizationOrJournal": "Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility",
    "authors": [
      "Jung HK",
      "Hong SJ",
      "Lee OY",
      "Pandolfino J",
      "Park H",
      "Miwa H",
      "Ghoshal UC",
      "Mahadeva S",
      "et al."
    ],
    "publicationYear": 2020,
    "doi": "10.5056/jnm20014",
    "pmid": "32235027",
    "officialUrl": "https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.",
    "authorityAssessment": "Independent guideline corroborates pressure-study classification following structural assessment; FLIP and reflux testing are not represented as complete substitutes for ordinary HRM classification. Same publication as source.sc.seoul-achalasia-2020; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.pressure-not-peristalsis",
      "claim.qq20261102a.spastic-achalasia",
      "claim.qq20261102a.esophageal-physiology-sequence"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.hernia2018",
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
    "authorityAssessment": "International guideline: ultrasound in uncertain clinical examination, dynamic cross-sectional imaging when unresolved; symptoms/function affect observation-versus-repair planning. Same publication as source.bread-butter.herniasurge-2018; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.groin-initial-dynamic-assessment",
      "claim.qq20261102a.symptomatic-groin-planning"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.hernia2023",
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
    "authorityAssessment": "Current update cross-check for watchful-waiting scope and later crossover; no invented operative threshold. Same publication as source.bread-butter.herniasurge-update-2023; this recheck is not an independent second source.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261102a.groin-initial-dynamic-assessment",
      "claim.qq20261102a.symptomatic-groin-planning"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ata2025",
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
    "authorityAssessment": "Full public guideline on the patient-advocacy organization's site; recommendation 7 supports initial central/lateral nodal ultrasound; CT/MRI adjuncts for extensive/invasive disease, not an assertion that they are never appropriate.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.papillary-cytology-regional-survey"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ptc-cytology",
    "title": "Cytologic hallmarks and differential diagnosis of papillary thyroid carcinoma subtypes",
    "completeCitation": "Harahap AS, Jung CK. Cytologic hallmarks and differential diagnosis of papillary thyroid carcinoma subtypes. J Pathol Transl Med. 2024;58(6):265-282. doi:10.4132/jptm.2024.10.11.",
    "organizationOrJournal": "Journal of Pathology and Translational Medicine",
    "authors": [
      "Agnes Stephanie Harahap",
      "Chan Kwon Jung"
    ],
    "publicationYear": 2024,
    "doi": "10.4132/jptm.2024.10.11",
    "pmid": null,
    "officialUrl": "https://www.jpatholtm.org/journal/view.php?number=17133",
    "accessedOn": "2026-11-02",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC 4.0; publisher notice checked",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Noncommercial restriction retained; https://creativecommons.org/licenses/by-nc/4.0/ . No article adaptation distributed.",
    "authorityAssessment": "Open pathology review, checked on publisher HTML after PMC captcha. Multiple nuclear and architectural findings, not a single groove, support papillary interpretation; no image or classification table reproduced.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.papillary-cytology-pattern"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.eado2024",
    "title": "European consensus-based interdisciplinary guideline for melanoma. Part 1: Diagnostics - Update 2024",
    "completeCitation": "Garbe C, Amaral T, Peris K, Hauschild A, Arenberger P, Basset-Seguin N, et al.; EADO, EDF and EORTC. European consensus-based interdisciplinary guideline for melanoma. Part 1: Diagnostics - Update 2024. Eur J Cancer. 2025;215:115152. doi:10.1016/j.ejca.2024.115152.",
    "organizationOrJournal": "EADO / EDF / EORTC / European Journal of Cancer",
    "authors": [
      "Claus Garbe",
      "Teresa Amaral",
      "Ketty Peris",
      "Axel Hauschild",
      "Petr Arenberger",
      "Nicole Basset-Seguin",
      "et al."
    ],
    "publicationYear": 2025,
    "doi": "10.1016/j.ejca.2024.115152",
    "pmid": null,
    "officialUrl": "https://eado.org/files/2025/01/2024-EADO-CMGuideline-Diagnostics-EJC.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Elsevier; freely available society PDF; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Complete publicly parsed society PDF read despite direct-fetch redirect loop. Valid through end 2026. Supports integrated depth/clinical nodal assessment, ultrasound not substituting for sentinel staging, and complete diagnostic excision when feasible.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.melanoma-integrated-node-staging",
      "claim.qq20261102a.melanoma-diagnostic-sampling"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.nci-melanoma",
    "title": "Melanoma Treatment (PDQ), Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.",
    "organizationOrJournal": "National Cancer Institute PDQ",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": "26389469",
    "officialUrl": "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government factual material; NCI and PDQ reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.",
    "authorityAssessment": "Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.melanoma-integrated-node-staging",
      "claim.qq20261102a.melanoma-diagnostic-sampling"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ascrs-colon",
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
    "officialUrl": "https://fascrs.org/ascrs/media/files/downloads/2022-Colon-Cancer-CPG.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASCRS; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Complete official PDF parsed via indexed source; direct request intermittently 404. Malignant-polyp histology/completeness and initial CT staging facts checked. Chest CT plus abdominal MRI is also valid and is deliberately not keyed wrong. AGA/ASGE independent guidance could not be retrieved; the new management claim has one verified guideline.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.malignant-polyp-adverse-features",
      "claim.qq20261102a.colon-systemic-staging"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.essr2023",
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
    "authorityAssessment": "Current ESSR consensus checked in full publisher HTML; MRI characterization/local staging of a deep or indeterminate limb lesion and referral before biopsy. Older ESSR targeting guidance is cross-checked, not a substitute for this current guideline. Same publication as source.essr.soft-tissue-imaging.2024; this recheck is not an independent second source.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102a.sarcoma-local-imaging"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.seom2024",
    "title": "SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024)",
    "completeCitation": "Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5.",
    "organizationOrJournal": "Spanish Society of Medical Oncology and Spanish Group for Sarcoma Research; Clinical and Translational Oncology",
    "authors": [
      "Cesar Serrano",
      "Marta Arregui",
      "Irene Carrasco",
      "Nadia Hindi",
      "Javier Martinez-Trufero",
      "Jeronimo Martinez-Garcia",
      "Aurea Molina",
      "Ana Paisan",
      "Raul Sanchez",
      "Maria Angeles Sala"
    ],
    "publicationYear": 2025,
    "doi": "10.1007/s12094-024-03842-5",
    "pmid": "39918719",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.",
    "authorityAssessment": "Independent society guideline for contrast MRI and coordinated image-guided core biopsy; specific viable-area selection additionally checked in ESSR technique guidance. Same publication as source.seom-geis.soft-tissue-sarcoma-guideline.2024; this recheck is not an independent second source.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102a.sarcoma-viable-biopsy-target",
      "claim.qq20261102a.sarcoma-local-imaging"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.essr2015-target",
    "title": "Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging",
    "completeCitation": "Noebauer-Huhmann IM, et al. Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging. Semin Musculoskelet Radiol. 2015;19(5):475-482. doi:10.1055/s-0035-1569251.",
    "organizationOrJournal": "European Society of Musculoskeletal Radiology / Seminars in Musculoskeletal Radiology",
    "authors": [
      "Iris-Melanie Noebauer-Huhmann",
      "et al."
    ],
    "publicationYear": 2015,
    "doi": "10.1055/s-0035-1569251",
    "pmid": null,
    "officialUrl": "https://pure.amsterdamumc.nl/ws/files/173173752/Soft-tissue-tumors-in-adults-essr-approved-guidelines-for-diagnostic-imaging.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Thieme; public institutional copy; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Older primary society technique guidance, complete PDF checked: target viable areas identified by enhancement/Doppler, coordinate route. Current ESSR and SEOM local-imaging/core guidance independently corroborate the general pathway; no invented needle size or timing.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.sarcoma-viable-biopsy-target"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.esge-sel2022",
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
    "authorityAssessment": "Complete public guideline checked: layer/echogenicity informs interpretation; characteristic lipoma is homogeneous hyperechoic submucosal tissue, and confidently characterized asymptomatic lipoma needs no lesion-specific follow-up. Do not generalize all SELs as diagnostic by EUS.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.subepithelial-integrated-pattern"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.korean-gastric",
    "title": "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
    "completeCitation": "Kim IH, Kang SJ, Choi W, et al. Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach (Update of 2022 Guideline). J Gastric Cancer. 2025;25(1):5-114. doi:10.5230/jgc.2025.25.e11.",
    "organizationOrJournal": "Journal of Gastric Cancer / Korean Gastric Cancer Association",
    "authors": [
      "In-Ho Kim",
      "Seung Joo Kang",
      "Wonyoung Choi",
      "Development Working Group for the Korean Practice Guideline for Gastric Cancer 2024 Task Force Team"
    ],
    "publicationYear": 2025,
    "doi": "10.5230/jgc.2025.25.e11",
    "pmid": "39822170",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11739648/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Use for factual synthesis with attribution. Do not reproduce guideline tables, flowcharts, figures, or extended prose.",
    "authorityAssessment": "Current full open guideline rechecked: D2 framework and avoidance of prophylactic splenectomy in the represented proximal tumor without greater-curvature invasion. This independently checked rule does not resolve the separately withheld contradictory JGCA2025 hilar wording. Same publication as source.korean-gastric-cancer-guideline.2024; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.gastric-depth-nodes-organ-plan",
      "claim.qq20261102a.gastric-spleen-preservation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.jgca2021",
    "title": "Japanese Gastric Cancer Treatment Guidelines 2021",
    "completeCitation": "Japanese Gastric Cancer Association. Japanese Gastric Cancer Treatment Guidelines 2021 (6th edition). Gastric Cancer. 2023;26(1):1-25. doi:10.1007/s10120-022-01331-8.",
    "organizationOrJournal": "Gastric Cancer / Japanese Gastric Cancer Association",
    "authors": [
      "Japanese Gastric Cancer Association"
    ],
    "publicationYear": 2023,
    "doi": "10.1007/s10120-022-01331-8",
    "pmid": "36342574",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9813208/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use for independently written factual synthesis with attribution. Do not reproduce guideline tables, algorithms, or figures.",
    "authorityAssessment": "Independent stage-based surgical scope and organ-preservation cross-check; no station-10 rule reproduced. Same publication as source.japanese-gastric-cancer-guideline.2021; this recheck is not an independent second source.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261102a.gastric-depth-nodes-organ-plan",
      "claim.qq20261102a.gastric-spleen-preservation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.bsh-mzl",
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
    "authorityAssessment": "Full public society PDF read. Tissue morphology/architecture plus immunophenotype, repeat endoscopy if uncertain, clonality not sufficient in isolation, and gastric histologic response assessment. Marker exceptions and expert pathology review remain explicit.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.gastric-lineage-not-classification",
      "claim.qq20261102a.gastric-malt-response-assessment",
      "claim.qq20261102a.gastric-small-b-cell-differential"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.malt2023",
    "title": "Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View",
    "completeCitation": "Matysiak-Budnik T, Priadko K, Bossard C, Chapelle N, Ruskoné-Fourmestraux A. Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View. Cancers (Basel). 2023;15(15):3811. doi:10.3390/cancers15153811.",
    "organizationOrJournal": "Cancers",
    "authors": [
      "Tamara Matysiak-Budnik",
      "Kateryna Priadko",
      "Céline Bossard",
      "Nicolas Chapelle",
      "Agnès Ruskoné-Fourmestraux"
    ],
    "publicationYear": 2023,
    "doi": "10.3390/cancers15153811",
    "pmid": "37568627",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10417821/",
    "accessedOn": "2026-11-02",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use with attribution and independently written synthesis. Do not reproduce source images, tables, or prose.",
    "authorityAssessment": "Independent open peer-reviewed gastric MALT review cross-check for representative biopsy, integrated classification and eradication/serial histologic response assessment. Same publication as source.matysiak-budnik-gastric-malt-management.2023; this recheck is not an independent second source.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102a.gastric-lineage-not-classification",
      "claim.qq20261102a.gastric-malt-response-assessment",
      "claim.qq20261102a.gastric-small-b-cell-differential"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.nist-p",
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
    "authorityAssessment": "Public primary government methodology rechecked: prespecified hypothesis testing; p is not an effect-size or equivalence decision. Same publication as source.nist.p-values.2026; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.null-test-versus-protocol-magnitude"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.nist-ci",
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
    "authorityAssessment": "Public primary government methodology for interval interpretation; no probability assigned to a fixed true value, no hard truth bounds inferred. Same publication as source.nist.confidence-intervals.2026; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.null-test-versus-protocol-magnitude",
      "claim.qq20261102a.relative-to-absolute-interval"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.lakens2017",
    "title": "Equivalence Tests: A Practical Primer for t Tests, Correlations, and Meta-Analyses",
    "completeCitation": "Lakens D. Equivalence Tests: A Practical Primer for t Tests, Correlations, and Meta-Analyses. Soc Psychol Personal Sci. 2017;8(4):355-362. doi:10.1177/1948550617697177.",
    "organizationOrJournal": "Social Psychological and Personality Science",
    "authors": [
      "Daniel Lakens"
    ],
    "publicationYear": 2017,
    "doi": "10.1177/1948550617697177",
    "pmid": null,
    "officialUrl": "https://pure.tue.nl/ws/portalfiles/portal/80918653/lakeequi2017.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright author/publisher; institutional private-research access; no CC license established",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Complete version-of-record PDF checked. TOST at alpha .05 uses a 90% interval within specified equivalence bounds; nonsignificance alone is not equivalence. No source spreadsheet, worked example or prose copied. The fictional protocol's margins are author-specified inputs, not medical thresholds.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.null-test-versus-protocol-magnitude"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.dhsc-odds",
    "title": "Public Health Technical Guidance: Odds ratio and relative risk",
    "completeCitation": "Department of Health and Social Care. Public Health Technical Guidance: Odds ratio and relative risk; and Proportions and odds. Undated live technical guidance. Accessed November 2, 2026.",
    "organizationOrJournal": "UK Department of Health and Social Care",
    "authors": [
      "Department of Health and Social Care"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://fingertips.phe.org.uk/static-reports/public-health-technical-guidance/Basic_statistics/Odds_ratios_relative_risk.html",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government public-sector information; OGL and third-party conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Government definitions of ratios/risk and linked odds definition support elementary conversions. Conditional covariate-profile baseline is explicit; no adjusted-to-marginal causal-risk claim is made.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.odds-to-risk-conversion",
      "claim.qq20261102a.relative-to-absolute-interval"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.bsg-sedation",
    "title": "British Society of Gastroenterology guidelines on sedation in gastrointestinal endoscopy",
    "completeCitation": "Sidhu R, Turnbull D, Haboubi H, Leeds JS, Healey C, Hebbar S, et al. British Society of Gastroenterology guidelines on sedation in gastrointestinal endoscopy. Gut. 2024;73:219-245. doi:10.1136/gutjnl-2023-330396.",
    "organizationOrJournal": "British Society of Gastroenterology / Gut",
    "authors": [
      "Reena Sidhu",
      "Duncan Turnbull",
      "Haboubi H",
      "John S Leeds",
      "Chris Healey",
      "Srisha Hebbar",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1136/gutjnl-2023-330396",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10850688/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Public guideline manuscript; reuse license not assumed; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full guideline checked: formal recovery/discharge assessment, responsible adult support, and re-sedation after flumazenil because midazolam action outlasts reversal. No exact observation/discharge duration authored.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.sedation-supported-discharge",
      "claim.qq20261102a.sedation-after-reversal"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ksge",
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
    "licenseLabel": "Creative Commons Attribution-NonCommercial 3.0",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Noncommercial independent factual synthesis with attribution; no figures, tables, or prose reused. The source's CC BY-NC 3.0 license does not match the schema's CC BY-NC 4.0 enum, so the conservative copyrighted status is recorded.",
    "authorityAssessment": "Full society guidance rechecked: symptoms/obstruction support drainage, endoscopic assessment for apposed collections, CT/MRCP for anatomy/vessels and EUS access verification. Imaging does not authorize immediate puncture; MRI remains a valid alternative outside the offered CT-protocol comparison. Same publication as source.ksge.pancreatic-fluid-collections.2021; this recheck is not an independent second source.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261102a.pancreatic-contrast-characterization",
      "claim.qq20261102a.collection-symptom-attribution"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ahrq-pdca",
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
    "authorityAssessment": "Public primary QI tool rechecked: test, study outcome and iterate. Does not define a universal abandon rule from lack of benefit. Same publication as source.ahrq.pdca.2026; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.pdsa-outcome-balancing-adaptation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ahrq-metrics",
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
    "authorityAssessment": "Independent government measures guidance supports distinguishing process uptake, clinical outcomes and balancing burden. All B36 counts/time observations are constructed fictional process data. Same publication as source.ahrq.qi-measures.2026; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.pdsa-outcome-balancing-adaptation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ibc-consensus",
    "title": "International expert panel on inflammatory breast cancer: consensus statement for standardized diagnosis and treatment",
    "completeCitation": "Dawood S, Merajver SD, Viens P, Vermeulen PB, Swain SM, Buchholz TA, et al. International expert panel on inflammatory breast cancer: consensus statement for standardized diagnosis and treatment. Ann Oncol. 2011;22(3):515-523. doi:10.1093/annonc/mdq345. PMID:20603440. PMCID:PMC3105293.",
    "organizationOrJournal": "Annals of Oncology",
    "authors": [
      "Dawood S",
      "Merajver SD",
      "Viens P",
      "Vermeulen PB",
      "Swain SM",
      "Buchholz TA",
      "et al."
    ],
    "publicationYear": 2011,
    "doi": "10.1093/annonc/mdq345",
    "pmid": "20603440",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/20603440/",
    "accessedOn": "2026-11-02",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Copyrighted journal article",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and citation only; no diagnostic table, algorithm, or source phrasing reproduced.",
    "authorityAssessment": "Primary international consensus already directly verified: core invasive-carcinoma confirmation with skin punch as adjunct, not interchangeable proof; underlying claim/limitations retained. Same publication as source.brief.dawood-ibc-consensus-2011; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.ibc-core-versus-adjunctive-skin"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.nci-ibc",
    "title": "Inflammatory Breast Cancer",
    "completeCitation": "National Cancer Institute. Inflammatory Breast Cancer. Updated December 2, 2025. Accessed September 17, 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/breast/breast-cancer-types/inflammatory",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government factual material; NCI reuse conditions and third-party exclusions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis with NCI attribution; third-party images, marks, and copied page prose excluded.",
    "authorityAssessment": "Federal diagnosis page rechecked; breast/skin tissue investigation and subsequent staging after cancer confirmation. Same publication as source.brief.nci-ibc-diagnosis-2025; this recheck is not an independent second source.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261102a.ibc-core-versus-adjunctive-skin"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.nci-ibc-treatment",
    "title": "Inflammatory Breast Cancer Treatment",
    "completeCitation": "National Cancer Institute. Inflammatory Breast Cancer Treatment. Posted December 2, 2025. Accessed November 2, 2026.",
    "organizationOrJournal": "National Cancer Institute, NIH",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/breast/treatment/inflammatory-breast-cancer",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government information; NCI reuse and third-party conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Current full federal page: stage III systemic therapy, modified radical mastectomy, postoperative radiation. Clinical response does not by itself change the represented pathway; AGO independently corroborates response independence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.ibc-response-local-treatment"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.ago2024",
    "title": "AGO Recommendations for the Diagnosis and Treatment of Patients with Early Breast Cancer: Update 2024",
    "completeCitation": "Park-Simon TW, et al.; AGO Breast Committee. Arbeitsgemeinschaft Gynakologische Onkologie Recommendations for the Diagnosis and Treatment of Patients with Early Breast Cancer: Update 2024. Breast Care. 2024;19:165-182. doi:10.1159/000538596.",
    "organizationOrJournal": "AGO Breast Committee / Breast Care",
    "authors": [
      "Tjoung-Won Park-Simon",
      "AGO Breast Committee",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1159/000538596",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11182637/pdf/brc-2024-0019-0003-538596.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Karger; public PDF; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full public PDF checked for IBC-specific trimodality regardless of neoadjuvant clinical response; no assumption that ordinary non-IBC breast de-escalation applies.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.ibc-response-local-treatment"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.esge-ulcer",
    "title": "Endoscopic diagnosis and management of peptic ulcer bleeding: ESGE Guideline - Update 2026",
    "completeCitation": "Gralnek IM, Morris J, Laursen SB, Camus M, Tziatzios G, Debels LK, et al. Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026. Endoscopy. 2026;58(8):899-924. doi:10.1055/a-2863-8314.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Ian M Gralnek",
      "John Morris",
      "Stig Borbjerg Laursen",
      "Marine Camus",
      "Georgios Tziatzios",
      "Lynn K Debels",
      "et al."
    ],
    "publicationYear": 2026,
    "doi": "10.1055/a-2863-8314",
    "pmid": "42127996",
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE; freely readable professional guidance, all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of hemostasis/PPI and rescue embolization only. No article text, algorithm, tables, illustrations, appendices, exact regimen or dosing schedule stored or reproduced.",
    "authorityAssessment": "Current complete ESGE2026 PDF rechecked: visible-vessel mechanical/thermal therapy, no epinephrine monotherapy; topical agents have rescue/temporizing roles and are not routine sole initial treatment for the represented vessel. Existing ACG claim supplies independent hemostasis indication. Same publication as source.qq20261102.esge-ulcer-2026; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.ulcer-local-modality-choice"
    ]
  }
];
