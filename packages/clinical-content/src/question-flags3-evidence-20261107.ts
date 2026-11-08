import type {EvidenceClaim,ClinicalSource} from "./pilot-schema";

export const QUESTION_FLAGS3_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]=[
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.positive-result-denominator",
    "statement": "For a positive test result, positive predictive value uses reference-positive tested people divided by all people with positive test results.",
    "basisClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Offline application of the recorded facts only; original source access/check dates retained. Exact case and option ranking need clinician review.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.audit-calculation",
    "statement": "In the constructed audit, 40 reference-positive and 95 reference-negative positive screens give 40/(40+95), approximately 30%, reference positivity among positive screens.",
    "basisClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The counts are original finite teaching data. The derived percentage is not an empirical MRSA assay characteristic, an infection diagnosis or a treatment recommendation.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.audit-alternative-denominators",
    "statement": "In this constructed audit, 40/(40+10) is 80% sensitivity, 855/(855+95) is 90% specificity, and 95/(40+95) is about 70% reference negativity among positive screens.",
    "basisClaimIds": [
      "claim.gs028se.statistics.sensitivity-specificity",
      "claim.gs028se.statistics.predictive-value-prevalence"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Original arithmetic from constructed counts, not published test performance or a clinical decision threshold.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.motor-pattern-scope",
    "statement": "An above-reference median junction relaxation pressure in the primary acquisition together with absent propagated contractions can support an achalasia motor pattern even when the upright relaxation pressure is within reference limits.",
    "basisClaimIds": [
      "claim.qq20261102a.primary-position-achalasia"
    ],
    "sourceIds": [
      "source.qq20261102a.chicago"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Retains the primary-position classification claim and its protocol-adequacy limitation. No device-specific numerical cutoff, subtype or treatment indication is introduced.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.junction-wall-target",
    "statement": "Achalasia-pattern physiology does not exclude a secondary junction process; focal cardia/junction wall thickening with weight loss and unrevealing mucosal samples warrants targeted wall assessment, for which EUS with directed sampling is an appropriate next investigation in this case.",
    "basisClaimIds": [
      "claim.qq20261102b.secondary-achalasia-assessment",
      "claim.qbp2ar2.junction-wall-assessment"
    ],
    "sourceIds": [
      "source.qq20261102b.acg-achalasia",
      "source.qq20261102c.acg-physiology2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Existing CT findings are already provided. No claim that EUS universally outranks CT, no malignant diagnosis inferred from a scan, and no needle/device protocol or exact weight/time threshold.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.groin-compartment",
    "statement": "A groin sac neck below the inguinal ligament and medial to the common femoral vein identifies the femoral-canal route.",
    "basisClaimIds": [
      "claim.qbp2ar2.femoral-anatomy-application"
    ],
    "sourceIds": [
      "source.bread-butter.picasso-groin-ultrasound-2021",
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Anatomical classification only; the constructed ultrasound is not a copied image or source table and establishes no urgency or operative technique by itself.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.direct-comparator",
    "statement": "A direct inguinal hernia passes through Hesselbach's triangle medial to the inferior epigastric vessels.",
    "basisClaimIds": [
      "claim.inguinal-hernia.direct-anatomic-location"
    ],
    "sourceIds": [
      "source.review.inguinal-releasing-incisions.2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Recorded technical-anatomy fact; one narrative-review source. Clinical approval of an old claim does not approve this new distractor application.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.indirect-comparator",
    "statement": "An indirect inguinal hernia enters the deep ring lateral to the inferior epigastric vessels.",
    "basisClaimIds": [
      "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric"
    ],
    "sourceIds": [
      "source.bread-butter.picasso-groin-ultrasound-2021"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "One recorded imaging-anatomy review. No clinical risk or choice of operative approach is inferred from the vessel relationship alone.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.reducible-femoral-plan",
    "statement": "A stable reducible femoral hernia supports timely elective repair planning despite mild symptoms; the selected minimally symptomatic male inguinal watchful-waiting rule does not extend to femoral anatomy.",
    "basisClaimIds": [
      "claim.bread-butter.femoral-hernia.timely-repair",
      "claim.bread-butter.inguinal-hernia.watchful-waiting"
    ],
    "sourceIds": [
      "source.bread-butter.herniasurge-2018",
      "source.bread-butter.herniasurge-update-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Femoral repair direction has one adequate recorded guideline; the 2023 update cross-checks the inguinal observation boundary. No fixed deadline, risk percentage or technique is taught.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.acute-boundary",
    "statement": "Persistent pain, irreducibility, obstruction or ischemic concern would change the stable femoral-herniation scenario to urgent assessment; the described reducing, nontender finding without obstructive symptoms does not establish that emergency.",
    "basisClaimIds": [
      "claim.bread-butter.femoral-hernia.timely-repair"
    ],
    "sourceIds": [
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Case-bound acuity distinction from the recorded claim limitation, not a rule that absence of a single symptom excludes incarceration or ischemia.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  }
];
export const QUESTION_FLAGS3_BASIS_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]=[
  {
    "contentVersion": "development-batch.2026-09-29.statistics-ethics.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028se.statistics.predictive-value-prevalence",
    "statement": "Positive predictive value uses all positive test results as its denominator and depends on prevalence in the tested population as well as on sensitivity and specificity.",
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The direction exercises assume sensitivity, specificity, and the testing process remain fixed while prevalence changes.",
    "applicablePopulation": "Fictional educational and quality-improvement datasets with the assumptions stated in each question.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "development-batch.2026-09-29.statistics-ethics.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028se.statistics.sensitivity-specificity",
    "statement": "Sensitivity is the proportion testing positive among reference-positive cases, while specificity is the proportion testing negative among reference-negative cases.",
    "sourceIds": [
      "source.cdc.test-accuracy.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The fictional reference classification is treated as correct solely for teaching the denominators.",
    "applicablePopulation": "Fictional educational and quality-improvement datasets with the assumptions stated in each question.",
    "lastCheckedOn": "2026-09-29"
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
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.secondary-achalasia-assessment",
    "statement": "Older patients with achalasia-pattern physiology and substantial recent weight loss can require targeted assessment for a secondary junction lesion.",
    "sourceIds": [
      "source.qq20261102b.acg-achalasia"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate directly retrieved primary guideline for the added alarm-based application. EUS/cross-sectional choice is individualized; no exact weight/time threshold or probability is invented.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "id": "claim.qbp2ar2.junction-wall-assessment",
    "statement": "An achalasia-pattern pressure study does not exclude an infiltrative junction lesion; focal wall thickening with unrevealing mucosal samples can warrant endoscopic ultrasonographic assessment and directed deeper sampling.",
    "basisClaimIds": [
      "claim.qq20261102b.secondary-achalasia-assessment",
      "claim.qq20261102c.hrm-incomplete-placement"
    ],
    "sourceIds": [
      "source.qq20261102b.acg-achalasia",
      "source.qq20261102c.acg-physiology2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Exact target and sampling technique need foregut review. This does not claim EUS is universally superior to cross-sectional assessment; a new CT abnormality is already provided.",
    "applicablePopulation": "The bounded synthetic clinical/process scenario in batch 2a round two; no universal decision algorithm.",
    "lastCheckedOn": "2026-11-04",
    "verificationScope": "Offline independent synthesis using existing source records and previously checked atomic facts; no new source retrieval or changed access date. Exact clinical application remains for review.",
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "claim.qbp2ar2.femoral-anatomy-application",
    "statement": "A groin sac entering below the inguinal ligament and medial to the common femoral vein follows the femoral canal; this anatomy changes the applicability of male inguinal watchful waiting.",
    "basisClaimIds": [
      "claim.bread-butter.femoral-hernia.timely-repair",
      "claim.bread-butter.inguinal-hernia.watchful-waiting"
    ],
    "sourceIds": [
      "source.bread-butter.picasso-groin-ultrasound-2021",
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "An independently written anatomical application of existing groin references; the exact constructed study requires clinician confirmation. No risk estimate, fixed deadline or operative technique is introduced.",
    "applicablePopulation": "The bounded synthetic clinical/process scenario in batch 2a round two; no universal decision algorithm.",
    "lastCheckedOn": "2026-11-04",
    "verificationScope": "Offline independent synthesis using existing source records and previously checked atomic facts; no new source retrieval or changed access date. Exact clinical application remains for review.",
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "contentVersion": "clinical.owner-rows-008-025.2026-08-06.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-06",
      "contentVersion": "clinical.owner-rows-008-025.2026-08-06.1"
    },
    "id": "claim.inguinal-hernia.direct-anatomic-location",
    "statement": "A direct inguinal hernia protrudes through Hesselbach's triangle medial to the inferior epigastric vessels.",
    "sourceIds": [
      "source.review.inguinal-releasing-incisions.2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "The supporting source is a technical narrative review rather than a diagnostic-performance study.",
    "applicablePopulation": "Adults undergoing evaluation of direct inguinal operative anatomy.",
    "lastCheckedOn": "2026-07-30"
  },
  {
    "contentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric",
    "statement": "An indirect inguinal hernia enters the inguinal canal through the deep ring lateral to the inferior epigastric vessels.",
    "sourceIds": [
      "source.bread-butter.picasso-groin-ultrasound-2021"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "high",
    "limitation": "The vessel relationship classifies anatomy but does not establish acuity or select a repair technique.",
    "applicablePopulation": "Adults whose operative or imaging report directly describes a groin hernia's relationship to the inferior epigastric vessels.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bread-butter.femoral-hernia.timely-repair",
    "statement": "A stable reducible femoral hernia warrants timely elective surgical repair planning even when symptoms are mild or absent.",
    "sourceIds": [
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Pain, irreducibility, obstruction, or ischemic concern changes the pathway to emergency assessment; the evidence base is largely observational.",
    "applicablePopulation": "Stable adults with a confirmed reducible femoral hernia and no emergency feature.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bread-butter.inguinal-hernia.watchful-waiting",
    "statement": "Watchful waiting is a safe option for informed men with asymptomatic or minimally symptomatic reducible inguinal hernias, although later repair is common when symptoms develop.",
    "sourceIds": [
      "source.bread-butter.herniasurge-2018",
      "source.bread-butter.herniasurge-update-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This does not apply to women, femoral hernias, activity-limiting symptoms, irreducibility, obstruction, or strangulation.",
    "applicablePopulation": "Men with a confirmed reducible inguinal hernia and absent or minimal symptoms.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "development-batch.2026-09-10.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.achalasia.high-resolution-manometry",
    "statement": "High-resolution esophageal manometry is the confirmatory physiologic test when achalasia is suspected after structural obstruction and concerning pseudoachalasia have been appropriately excluded.",
    "sourceIds": [
      "source.sc.seoul-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The accepted guideline rates diagnostic evidence as low despite strong consensus. This claim does not prescribe subtype thresholds or a treatment algorithm.",
    "applicablePopulation": "Stable adults with persistent solids-and-liquids dysphagia and regurgitation after an adequate EGD excludes mechanical obstruction and concerning pseudoachalasia.",
    "lastCheckedOn": "2026-09-10"
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
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.hrm-rapid-swallow-interpretation",
    "statement": "A rapid-swallow manometry sequence assesses inhibition and post-sequence contractile reserve; it is not interchangeable with separated baseline swallows for esophageal-body classification.",
    "sourceIds": [
      "source.qq20261102d.acg2020",
      "source.qq20261102d.chicago2021"
    ],
    "limitation": "Previously verified primary physiology guidance and classification consensus reused offline. Interpretation depends on adequate acquisition; no exact swallow count, volume, interval or pressure cutoff is introduced.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.hrm-rapid-drink-purpose",
    "statement": "A rapid-drink manometry challenge assesses esophageal outflow under liquid loading rather than replacing the ordinary separated-swallow peristaltic assessment.",
    "sourceIds": [
      "source.qq20261102d.acg2020",
      "source.qq20261102d.chicago2021"
    ],
    "limitation": "Existing primary-source verification reused offline. This is a protocol-purpose distinction, not a universal preference over other corroborating studies or an invented quantitative criterion.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  }
];
export const QUESTION_FLAGS3_SOURCES:(ClinicalSource&{sourceStatus:string;supportedNewClaimIds:string[];intendedUse:string})[]=[
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.cdc.test-accuracy.2026",
    "title": "Principles of Epidemiology: Lesson 5, Appendix A",
    "completeCitation": "Centers for Disease Control and Prevention. Principles of Epidemiology: Lesson 5, Appendix A. Last reviewed 2012-05-18. Accessed 2026-09-29.",
    "organizationOrJournal": "Centers for Disease Control and Prevention",
    "authors": [
      "Centers for Disease Control and Prevention"
    ],
    "publicationYear": 2012,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html",
    "accessedOn": "2026-09-29",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.",
    "authorityAssessment": "Archived federal reference for sensitivity, specificity, and predictive-value denominators; older guidance is a limitation.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028se.statistics.sensitivity-specificity",
      "claim.gs028se.statistics.predictive-value-prevalence",
      "claim.n2.cc09f9ba1740",
      "claim.n2.bf4203993008",
      "claim.n2.889064151d42",
      "claim.n2.02709278d0d4",
      "claim.flags3.20261107.positive-result-denominator",
      "claim.flags3.20261107.audit-calculation",
      "claim.flags3.20261107.audit-alternative-denominators"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.positive-result-denominator",
      "claim.flags3.20261107.audit-calculation",
      "claim.flags3.20261107.audit-alternative-denominators"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.fda.predictive-values.2026",
    "title": "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
    "completeCitation": "U.S. Food and Drug Administration. Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers. Section: What does predictive value mean? Accessed 2026-09-29.",
    "organizationOrJournal": "U.S. Food and Drug Administration",
    "authors": [
      "U.S. Food and Drug Administration"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers",
    "accessedOn": "2026-09-29",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.",
    "authorityAssessment": "Federal patient-facing cross-check that positive predictive value falls when prevalence is lower, holding test performance context constant; no COVID-19 clinical claim is reused.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence",
      "claim.n2.cc09f9ba1740",
      "claim.n2.889064151d42",
      "claim.flags3.20261107.positive-result-denominator",
      "claim.flags3.20261107.audit-calculation",
      "claim.flags3.20261107.audit-alternative-denominators"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.positive-result-denominator",
      "claim.flags3.20261107.audit-calculation",
      "claim.flags3.20261107.audit-alternative-denominators"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
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
      "claim.qq20261102a.esophageal-physiology-sequence",
      "claim.flags3.20261107.motor-pattern-scope"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.motor-pattern-scope"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.acg-achalasia",
    "title": "ACG clinical guideline: achalasia",
    "completeCitation": "Vaezi MF, Pandolfino JE, Yadlapati RH, Greer KB, Kavitt RT. ACG Clinical Guidelines: Diagnosis and Management of Achalasia. Am J Gastroenterol. 2020;115(9):1393-1411. doi:10.14309/ajg.0000000000000731.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Vaezi MF",
      "Pandolfino JE",
      "Yadlapati RH",
      "Greer KB",
      "Kavitt RT"
    ],
    "publicationYear": 2020,
    "doi": "10.14309/ajg.0000000000000731",
    "pmid": "32773454",
    "officialUrl": "https://gi.org/guideline/diagnosis-and-management-of-achalasia/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ACG; no reusable license assumed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification of complete guideline through the Portuguese gastroenterology society-hosted PDF: https://www.spg.pt/wp-content/uploads/2023/03/ACG-Clinical-Guidelines-Diagnosis-and-Management-of-Achalasia.pdf . Direct publisher route was inaccessible; no paywalled snippet used, no PDF or prose stored.",
    "authorityAssessment": "Primary professional-society guideline supports targeted cross-sectional/EUS assessment when older patients with achalasia-pattern physiology have substantial short-term weight loss. No invented risk score, cutoff or probability.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.secondary-achalasia-assessment",
      "claim.qbp2ar2.junction-wall-assessment",
      "claim.flags3.20261107.junction-wall-target"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.junction-wall-target"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
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
      "claim.qq20261102c.hrm-protocol-and-provocation",
      "claim.qbp2ar2.junction-wall-assessment",
      "claim.flags3.20261107.junction-wall-target"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.junction-wall-target"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.picasso-groin-ultrasound-2021",
    "title": "High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways",
    "completeCitation": "Picasso R, Pistoia F, Zaottini F, Airaldi S, Miguel Perez M, Pansecchi M, Tovt L, Sanguinetti S, Moller I, Bruns A, Martinoli C. High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways. J Ultrason. 2021;21(84):e53-e62. doi:10.15557/JoU.2021.0008. PMID:33791116. PMCID:PMC8008201.",
    "organizationOrJournal": "Journal of Ultrasonography / Polish Ultrasound Society",
    "authors": [
      "Picasso R",
      "Pistoia F",
      "Zaottini F",
      "Airaldi S",
      "Miguel Perez M",
      "Pansecchi M",
      "Tovt L",
      "Sanguinetti S",
      "Moller I",
      "Bruns A",
      "Martinoli C"
    ],
    "publicationYear": 2021,
    "doi": "10.15557/JoU.2021.0008",
    "pmid": "33791116",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8008201/",
    "accessedOn": "2026-09-17",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Only an independently written anatomy fact is stored; no source prose, images, diagrams, videos, or tables reproduced. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Open peer-reviewed imaging-anatomy review directly supporting the deep-ring and vessel relationship.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.1c9136f72fb2",
      "claim.qbp2ar2.femoral-anatomy-application",
      "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric",
      "claim.flags3.20261107.groin-compartment",
      "claim.flags3.20261107.indirect-comparator"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.groin-compartment",
      "claim.flags3.20261107.indirect-comparator"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.herniasurge-2018",
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
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Multisociety international guideline defining the selected watchful-waiting phenotype and timely femoral-hernia repair direction.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.7b235321cfc5",
      "claim.qbp2ar2.femoral-anatomy-application",
      "claim.bread-butter.femoral-hernia.timely-repair",
      "claim.bread-butter.inguinal-hernia.watchful-waiting",
      "claim.flags3.20261107.groin-compartment",
      "claim.flags3.20261107.reducible-femoral-plan",
      "claim.flags3.20261107.acute-boundary"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.groin-compartment",
      "claim.flags3.20261107.reducible-femoral-plan",
      "claim.flags3.20261107.acute-boundary"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.review.inguinal-releasing-incisions.2023",
    "title": "The Role of Releasing Incisions in Emergency Inguinal Hernia Repair",
    "completeCitation": "Weitzner ZN, Chen DC. The Role of Releasing Incisions in Emergency Inguinal Hernia Repair. J Abdom Wall Surg. 2023;2:11378. doi:10.3389/jaws.2023.11378.",
    "organizationOrJournal": "Journal of Abdominal Wall Surgery",
    "authors": [
      "ZN Weitzner",
      "DC Chen"
    ],
    "publicationYear": 2023,
    "doi": "10.3389/jaws.2023.11378",
    "pmid": null,
    "officialUrl": "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2023.11378/full",
    "accessedOn": "2026-07-30",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Credit the authors and publication, link the license, and exclude figures, supplementary video, separately credited material, and third-party assets.",
    "authorityAssessment": "A current technical narrative review suitable for the bounded spatial anatomy of direct inguinal hernia; it is not comparative or diagnostic-performance evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.inguinal-hernia.direct-anatomic-location",
      "claim.inguinal-hernia.direct-posterior-wall-defect",
      "claim.inguinal-hernia.direct-search-boundary",
      "claim.flags3.20261107.direct-comparator"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.direct-comparator"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.herniasurge-update-2023",
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
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current international guideline update corroborating safety and later crossover for watchful waiting in selected men.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r3.7b235321cfc5",
      "claim.bread-butter.inguinal-hernia.watchful-waiting",
      "claim.flags3.20261107.reducible-femoral-plan"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags3.20261107.reducible-femoral-plan"
    ],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sc.seoul-achalasia-2020",
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
    "accessedOn": "2026-09-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.",
    "authorityAssessment": "Society evidence-based guideline directly checked for HRM after structural assessment and the absent-peristalsis/impaired-relaxation pattern. Diagnostic evidence is low with strong consensus; the inaccessible corrigendum is not represented as reviewed.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.achalasia.high-resolution-manometry",
      "claim.achalasia.manometric-recognition"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
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
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
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
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102d.acg2020",
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
    "authorityAssessment": "Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102d.hrm-solid-meal-provocation"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102d.chicago2021",
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
    "authorityAssessment": "Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102d.hrm-solid-meal-provocation"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [],
    "intendedUse": "Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status."
  }
];
export const QUESTION_FLAGS3_CLAIM_PROVENANCE=[
  {
    "claimId": "claim.flags3.20261107.positive-result-denominator",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.gs028se.statistics.predictive-value-prevalence",
        "originalLastCheckedOn": "2026-09-29",
        "sourceIds": [
          "source.cdc.test-accuracy.2026",
          "source.fda.predictive-values.2026"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.audit-calculation",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.gs028se.statistics.predictive-value-prevalence",
        "originalLastCheckedOn": "2026-09-29",
        "sourceIds": [
          "source.cdc.test-accuracy.2026",
          "source.fda.predictive-values.2026"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.audit-alternative-denominators",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.gs028se.statistics.sensitivity-specificity",
        "originalLastCheckedOn": "2026-09-29",
        "sourceIds": [
          "source.cdc.test-accuracy.2026"
        ],
        "originalReviewStatus": "needs_clinician_review"
      },
      {
        "claimId": "claim.gs028se.statistics.predictive-value-prevalence",
        "originalLastCheckedOn": "2026-09-29",
        "sourceIds": [
          "source.cdc.test-accuracy.2026",
          "source.fda.predictive-values.2026"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.motor-pattern-scope",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.qq20261102a.primary-position-achalasia",
        "originalLastCheckedOn": "2026-11-02",
        "sourceIds": [
          "source.qq20261102a.chicago"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.junction-wall-target",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.qq20261102b.secondary-achalasia-assessment",
        "originalLastCheckedOn": "2026-11-02",
        "sourceIds": [
          "source.qq20261102b.acg-achalasia"
        ],
        "originalReviewStatus": "needs_clinician_review"
      },
      {
        "claimId": "claim.qbp2ar2.junction-wall-assessment",
        "originalLastCheckedOn": "2026-11-04",
        "sourceIds": [
          "source.qq20261102b.acg-achalasia",
          "source.qq20261102c.acg-physiology2020"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.groin-compartment",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.qbp2ar2.femoral-anatomy-application",
        "originalLastCheckedOn": "2026-11-04",
        "sourceIds": [
          "source.bread-butter.picasso-groin-ultrasound-2021",
          "source.bread-butter.herniasurge-2018"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.direct-comparator",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.inguinal-hernia.direct-anatomic-location",
        "originalLastCheckedOn": "2026-07-30",
        "sourceIds": [
          "source.review.inguinal-releasing-incisions.2023"
        ],
        "originalReviewStatus": "clinically_approved"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.indirect-comparator",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric",
        "originalLastCheckedOn": "2026-09-17",
        "sourceIds": [
          "source.bread-butter.picasso-groin-ultrasound-2021"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.reducible-femoral-plan",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.bread-butter.femoral-hernia.timely-repair",
        "originalLastCheckedOn": "2026-09-17",
        "sourceIds": [
          "source.bread-butter.herniasurge-2018"
        ],
        "originalReviewStatus": "needs_clinician_review"
      },
      {
        "claimId": "claim.bread-butter.inguinal-hernia.watchful-waiting",
        "originalLastCheckedOn": "2026-09-17",
        "sourceIds": [
          "source.bread-butter.herniasurge-2018",
          "source.bread-butter.herniasurge-update-2023"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "claimId": "claim.flags3.20261107.acute-boundary",
    "checkedOn": "2026-11-07",
    "basis": [
      {
        "claimId": "claim.bread-butter.femoral-hernia.timely-repair",
        "originalLastCheckedOn": "2026-09-17",
        "sourceIds": [
          "source.bread-butter.herniasurge-2018"
        ],
        "originalReviewStatus": "needs_clinician_review"
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  }
] as const;
