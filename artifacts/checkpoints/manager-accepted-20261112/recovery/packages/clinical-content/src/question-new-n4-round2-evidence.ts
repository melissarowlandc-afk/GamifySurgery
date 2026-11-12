// Original atomic synthesis and bibliography only; inherited facts retain exact dates and rights.
import type {ClinicalSource,EvidenceClaim} from "./pilot-schema";
import {QUESTION_NEW_N4_CLAIMS as inheritedClaims,QUESTION_NEW_N4_SOURCES as inheritedSources,QUESTION_NEW_N4_CLAIM_PROVENANCE as inheritedProvenance} from "./question-new-n4-evidence-20261110";

export const QUESTION_NEW_N4_ROUND2_NEW_CLAIMS:Array<EvidenceClaim & Record<string,unknown>> = [
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.retractile-maintained-position",
    "statement": "A true retractile testis can be placed in the scrotum without tension and remains there after release.",
    "sourceIds": [
      "source.n4r2.cua-puc-cryptorchidism-2017"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Clinical examination must be relaxed and reproducible; this statement does not classify every initially high testis.",
    "applicablePopulation": "Children undergoing testicular-position assessment",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.retractile-surveillance",
    "statement": "A true retractile testis needs documented positional follow-up for later ascent rather than routine orchiopexy.",
    "sourceIds": [
      "source.n4r2.cua-puc-cryptorchidism-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No exact follow-up interval or age threshold for acquired ascent is authored.",
    "applicablePopulation": "Children with clinically established true retractile testes",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.acquired-ascent-operative-boundary",
    "statement": "A previously scrotal testis that persistently cannot maintain scrotal position supports acquired-ascent assessment and an orchiopexy plan rather than the true-retractile surveillance pathway.",
    "sourceIds": [
      "source.n4r2.cua-puc-cryptorchidism-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exact timing for acquired ascent varies with clinical assessment; a healthy child with reproducible persistent findings is constructed. No automatic operation based on an old referral label.",
    "applicablePopulation": "Children with reproducible acquired testicular ascent",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.post-impaction-esophageal-sampling",
    "statement": "Index endoscopy for adult food impaction should obtain representative esophageal specimens to evaluate an underlying eosinophilic process.",
    "sourceIds": [
      "source.n4r2.oggh-eoe-impaction-2024",
      "source.n4r2.esge-tissue-sampling-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The source recommends distributed levels; adequate safe sampling and clinical context remain necessary.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.impaction-trauma-sampling-confounder",
    "statement": "Mechanical irritation at the food-impaction site can confound histology; representative specimens should avoid that injury, while a suspicious focal mass or stenosis still requires directed sampling.",
    "sourceIds": [
      "source.n4r2.oggh-eoe-impaction-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This boundary concerns mechanical injury, not a prohibition on sampling a suspicious lesion.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.ppi-before-eoe-biopsy",
    "statement": "Starting proton-pump inhibition before adequate diagnostic esophageal sampling can mask the histologic evidence sought for eosinophilic esophagitis.",
    "sourceIds": [
      "source.n4r2.oggh-eoe-impaction-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Do not extrapolate to withholding necessary treatment in a different clinical emergency.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.pedunculated-hot-snare",
    "statement": "Hot-snare resection is the recommended endoscopic removal method for pedunculated colorectal polyps.",
    "sourceIds": [
      "source.n4r2.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "The constructed lesion is pedunculated without a separately described invasive-cancer phenotype.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.pedunculated-stalk-prophylaxis",
    "statement": "ESGE suggests dilute epinephrine injection and/or mechanical stalk hemostasis before resection when a pedunculated polyp has a head at least 2 cm or a stalk at least 1 cm.",
    "sourceIds": [
      "source.n4r2.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Weak recommendation with low-quality evidence. Mechanical loop treatment is one supported option; no claim that it is universally superior to injection.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.critical-view-three-observations",
    "statement": "Critical-view assessment combines a cleared hepatocystic triangle, separation of the lower gallbladder from its liver attachment, and confirmation of two structures entering the gallbladder.",
    "sourceIds": [
      "source.n4r2.safe-chole-multisociety-2020",
      "source.n4r2.safe-chole-culture-2019"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Two tubes or two windows do not independently establish all three anatomical observations. No universal safe-dissection guarantee.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.critical-view-not-common-duct-exposure",
    "statement": "Routine exposure of the cystic-common duct junction is not required to establish the critical view and can create avoidable injury risk.",
    "sourceIds": [
      "source.n4r2.safe-chole-culture-2019"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One adequate open explanatory review for this technical boundary; a distinct specific clinical indication may require other dissection.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.ioc-air-false-positive",
    "statement": "Air can produce false-positive intraoperative cholangiographic filling defects and lead to unnecessary duct interventions.",
    "sourceIds": [
      "source.n4r2.sages-intraoperative-imaging-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One adequate current primary guideline; a moving lucency suggests but does not prove air.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.ioc-complete-study",
    "statement": "An adequate reassuring cholangiogram evaluates both right and left proximal ductal trees, passage into the duodenum and the presence of filling defects.",
    "sourceIds": [
      "source.n4r2.sages-intraoperative-imaging-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "De-airing and repeating the incomplete study is an original application of the quality requirements, not a quoted mandatory protocol.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.ioc-confirmed-stone-treatment",
    "statement": "A confirmed ductal stone detected during intraoperative imaging can prompt a selected duct-clearance strategy rather than being treated as a normal cholangiogram.",
    "sourceIds": [
      "source.n4r2.sages-intraoperative-imaging-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This does not choose duct exploration over ERCP in every setting or mandate treatment of an unconfirmed lucency.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.groin-recurrence-opposite-plane",
    "statement": "After an anterior groin hernia repair, recurrence is generally repaired through a posterior approach; after posterior repair, an anterior approach is recommended.",
    "sourceIds": [
      "source.n4r2.ehs-hernia-surge-summary-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The constructed exposure identifies the prior plane. This does not choose TAPP over every posterior technique or mandate continuation by a particular surgeon.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.bcs-all-targets",
    "statement": "Breast-conserving surgery must account for removal of the known malignant target rather than an incidental marker from another biopsy site.",
    "sourceIds": [
      "source.n4r2.asbrs-bcs-resource-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The two markers and retained target are constructed observations. This does not establish a microscopic margin width or a universal cavity-shave technique.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.bcs-specimen-confirmation",
    "statement": "Specimen radiography or ultrasound should confirm that the intended breast lesion has been removed when image-guided localization is used.",
    "sourceIds": [
      "source.n4r2.asbrs-bcs-resource-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One adequate current society resource guide; clinical-radiographic concordance and specimen orientation require local assessment.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.permanent-macroporous-material",
    "statement": "For stable emergency ventral/incisional hernia repairs in which mesh is selected, current EHS guidance suggests permanent macroporous synthetic material over other mesh types.",
    "sourceIds": [
      "source.n4r2.ehs-emergency-ventral-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Emergency scope; indirect corroboration only for the constructed selected elective-enterotomy repair. Exact elective key remains mapped to the inherited selected-enterotomy claims.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.mesh-compartment-contact",
    "statement": "Uncoated polypropylene is generally placed away from direct bowel contact; expanded PTFE is a material used for intraperitoneal visceral-contact applications.",
    "sourceIds": [
      "source.n4r2.sages-ahs-mesh-catalog-undated"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One society review, not a comparative recommendation for every implant or contaminated field. Counterfactual contact distinction only; selected-enterotomy material key uses inherited claims.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.child-groin-dynamic-contents",
    "statement": "A pediatric inguinal hernia can appear with straining and recede when relaxed; an isolated hydrocele contains fluid rather than herniated bowel.",
    "sourceIds": [
      "source.n4r2.queensland-child-inguinal-hernia",
      "source.n4r2.south-tees-child-groin-2024"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "The quiet fluid-only image does not itself establish later bowel entry; that inference requires current clinical findings.",
    "applicablePopulation": "Children with intermittent groin/scrotal swelling",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.child-hernia-repair",
    "statement": "A clinically established pediatric inguinal hernia warrants surgical repair; a reducible presentation can be managed with a planned herniotomy.",
    "sourceIds": [
      "source.n4r2.queensland-child-inguinal-hernia",
      "source.n4r2.south-tees-child-groin-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No exact delay or repair interval is taught; real timing follows pediatric clinical assessment.",
    "applicablePopulation": "Children with clinically established reducible inguinal hernia",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.child-hernia-urgent-boundary",
    "statement": "A persistently irreducible pediatric inguinal hernia or concerning obstruction/strangulation findings warrants urgent surgical assessment rather than routine observation.",
    "sourceIds": [
      "source.n4r2.queensland-child-inguinal-hernia",
      "source.n4r2.south-tees-child-groin-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No exact time-to-strangulation probability or vital-sign cutoff is inferred.",
    "applicablePopulation": "Children with groin hernias and concerning current findings",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.gastrointestinal-magnesium-loss",
    "statement": "Continuing gastrointestinal losses or malabsorption can cause magnesium depletion.",
    "sourceIds": [
      "source.n4r2.nih-magnesium-2026"
    ],
    "evidenceCategory": "epidemiology",
    "certainty": "moderate",
    "limitation": "Verified for a parked design; does not independently distinguish competing diagnostic tests in the proposed item.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.magnesium-potassium-loss",
    "statement": "Magnesium depletion can increase urinary potassium loss and coexist with hypokalemia, requiring correction of both deficits.",
    "sourceIds": [
      "source.n4r2.nih-potassium-2022",
      "source.n4r2.nih-magnesium-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Verified for a parked design. The attempted potassium-response revision still selected magnesium without its added response data and was not emitted.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.thyroglossal-excision-extent",
    "statement": "A Sistrunk operation removes a thyroglossal cyst, its tract and a central hyoid segment to reduce recurrence.",
    "sourceIds": [
      "source.n4r2.cambridge-thyroglossal-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Verified for a parked design; merely adding a prior cyst-only excision did not make the proposed next operation a non-recall decision.",
    "applicablePopulation": "Children with an established thyroglossal duct cyst",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.thyroglossal-thyroid-check",
    "statement": "Preoperative assessment of a suspected thyroglossal cyst includes confirming an orthotopic thyroid gland.",
    "sourceIds": [
      "source.n4r2.cambridge-thyroglossal-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The public source does not directly support a new functional-imaging rule or test threshold; no such key was authored.",
    "applicablePopulation": "Children with a suspected thyroglossal duct cyst",
    "lastCheckedOn": "2026-11-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4r2.celiac-sampling-territories",
    "statement": "When duodenal biopsies are obtained for suspected celiac disease, ESGE recommends at least six specimens from different duodenal locations including two from the bulb.",
    "sourceIds": [
      "source.n4r2.esge-tissue-sampling-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Verified for a parked design. Do not infer that every other precise bulb/distal split is inadequate without source support.",
    "applicablePopulation": "Adults in the constructed current-procedure scenario",
    "lastCheckedOn": "2026-11-10"
  }
];

export const QUESTION_NEW_N4_ROUND2_NEW_SOURCES:Array<ClinicalSource & Record<string,unknown>> = [
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.cua-puc-cryptorchidism-2017",
    "title": "CUA-PUC cryptorchidism guideline",
    "completeCitation": "Braga LH, Lorenzo AJ, Romao RLP. Canadian Urological Association–Pediatric Urologists of Canada guideline for the diagnosis, management, and followup of cryptorchidism. Can Urol Assoc J. 2017;11(7):E251–E260. doi:10.5489/cuaj.4585.",
    "organizationOrJournal": "Canadian Urological Association Journal",
    "authors": [
      "Braga LH",
      "Lorenzo AJ",
      "Romao RLP"
    ],
    "publicationYear": 2017,
    "officialUrl": "https://cuaj.ca/index.php/journal/article/download/4585/3197",
    "doi": "10.5489/cuaj.4585",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Canadian Urological Association; noncommercial use conditions, not a CC license",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Pediatric urology society guideline; acquired-ascent timing is not a new exact age rule.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.retractile-maintained-position",
      "claim.n4r2.retractile-surveillance",
      "claim.n4r2.acquired-ascent-operative-boundary"
    ],
    "verificationUse": "Direct examination and management boundary verification; publisher PDF read."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.oggh-eoe-impaction-2024",
    "title": "ÖGGH adult EoE and food-impaction position paper",
    "completeCitation": "Schlager H, Baumann-Durchschein F, Steidl K, Häfner M, Dinkhauser P, Weitersberger M, Holzinger J, Mader M, Gröchenig HP, Madl C, Schreiner P. Diagnosis and management of eosinophilic esophagitis and esophageal food impaction in adults: a position paper issued by the Austrian Society of Gastroenterology and Hepatology. Wien Klin Wochenschr. 2024;136(Suppl 10):479–499. doi:10.1007/s00508-024-02401-w.",
    "organizationOrJournal": "Wiener klinische Wochenschrift / ÖGGH",
    "authors": [
      "Schlager H",
      "Baumann-Durchschein F",
      "Steidl K",
      "Häfner M",
      "Dinkhauser P",
      "Weitersberger M",
      "Holzinger J",
      "Mader M",
      "Gröchenig HP",
      "Madl C",
      "Schreiner P"
    ],
    "publicationYear": 2024,
    "officialUrl": "https://link.springer.com/article/10.1007/s00508-024-02401-w",
    "doi": "10.1007/s00508-024-02401-w",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. Attribution retained in the complete citation; original synthesis, no expression adapted.",
    "authorityAssessment": "Society position paper and expert consensus, not a randomized comparison of every biopsy strategy.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.post-impaction-esophageal-sampling",
      "claim.n4r2.impaction-trauma-sampling-confounder",
      "claim.n4r2.ppi-before-eoe-biopsy"
    ],
    "verificationUse": "Direct index-biopsy, trauma-confounding and pre-biopsy PPI verification; full publisher text and license read."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.esge-polypectomy-2024",
    "title": "ESGE colorectal polypectomy guideline update",
    "completeCitation": "Ferlitsch M, Hassan C, Bisschops R, Bhandari P, Dinis-Ribeiro M, Risio M, et al. Colorectal polypectomy and endoscopic mucosal resection: European Society of Gastrointestinal Endoscopy Guideline—Update 2024. Endoscopy. 2024. Published online April 26, 2024. doi:10.1055/a-2304-3219.",
    "organizationOrJournal": "Endoscopy / European Society of Gastrointestinal Endoscopy",
    "authors": [
      "Ferlitsch M",
      "Hassan C",
      "Bisschops R",
      "Bhandari P",
      "Dinis-Ribeiro M",
      "Risio M",
      "Paspatis GA",
      "Moss A",
      "Libânio D",
      "Lorenzo-Zúñiga V",
      "Voiosu AM",
      "Rutter MD",
      "Pellisé M",
      "Moons LMG",
      "Probst A",
      "Awadie H",
      "Amato A",
      "Takeuchi Y",
      "Repici A",
      "Rahmi G",
      "Koecklin HU",
      "Albéniz E",
      "Rockenbauer LM",
      "Waldmann E",
      "Messmann H",
      "Triantafyllou K",
      "Jover R",
      "Gralnek IM",
      "Dekker E",
      "Bourke MJ"
    ],
    "publicationYear": 2024,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2304-3219.pdf",
    "doi": "10.1055/a-2304-3219",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE / Thieme; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Current society guideline; hot-snare recommendation strong/high-quality, wide-stalk prophylaxis suggestion weak/low-quality.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.pedunculated-hot-snare",
      "claim.n4r2.pedunculated-stalk-prophylaxis"
    ],
    "verificationUse": "Direct head/stalk dimensions and prevention criteria verified in the official PDF."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.safe-chole-multisociety-2020",
    "title": "Safe cholecystectomy multi-society guideline",
    "completeCitation": "Brunt LM, Deziel DJ, Telem DA, Strasberg SM, Aggarwal R, Asbun H, et al. Safe Cholecystectomy Multi-Society Practice Guideline and State-of-the-Art Consensus Conference on Prevention of Bile Duct Injury During Cholecystectomy. Ann Surg. 2020;272:3–23. doi:10.1097/SLA.0000000000003791.",
    "organizationOrJournal": "SAGES / Annals of Surgery",
    "authors": [
      "Brunt LM",
      "Deziel DJ",
      "Telem DA",
      "Strasberg SM",
      "Aggarwal R",
      "Asbun H",
      "Bonjer J",
      "McDonald M",
      "Alseidi A",
      "Ujiki M",
      "Riall TS",
      "Hammill C",
      "Moulton CA",
      "Pucher PH",
      "Parks RW",
      "Ansari MT",
      "Connor S",
      "Dirks RC",
      "Anderson B",
      "Altieri MS",
      "Tsamalaidze L",
      "Stefanidis D"
    ],
    "publicationYear": 2020,
    "officialUrl": "https://www.sages.org/publications/guidelines/safe-cholecystectomy-multi-society-practice-guideline//",
    "doi": "10.1097/SLA.0000000000003791",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright society guidance; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Multi-society safety guideline; critical-view identification recommendation uses expert opinion, not a guarantee of injury prevention.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.critical-view-three-observations"
    ],
    "verificationUse": "Targeted critical-view safety verification on the official society page."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.safe-chole-culture-2019",
    "title": "Safe laparoscopic cholecystectomy review",
    "completeCitation": "Gupta V, Jain G. Safe laparoscopic cholecystectomy: Adoption of universal culture of safety in cholecystectomy. World J Gastrointest Surg. 2019;11(2):62–84. doi:10.4240/wjgs.v11.i2.62.",
    "organizationOrJournal": "World Journal of Gastrointestinal Surgery",
    "authors": [
      "Gupta V",
      "Jain G"
    ],
    "publicationYear": 2019,
    "officialUrl": "https://www.wjgnet.com/1948-9366/full/v11/i2/62.htm",
    "doi": "10.4240/wjgs.v11.i2.62",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. Attribution retained; noncommercial draft review use. Reassess license scope before any commercial reuse; no figure/table copied.",
    "authorityAssessment": "Peer-reviewed safety review, independent explanatory cross-check rather than a graded guideline.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n4r2.critical-view-three-observations",
      "claim.n4r2.critical-view-not-common-duct-exposure"
    ],
    "verificationUse": "Targeted anatomical criteria and common-duct dissection boundary cross-check."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.sages-intraoperative-imaging-2025",
    "title": "SAGES intraoperative common bile duct imaging guideline",
    "completeCitation": "Kumar SK, Shehata DG, Cetrulo LN, Ignacio R, Chiu J, Davis BR, et al. SAGES Guidelines for the Use of Intraoperative Imaging of the Common Bile Duct. SAGES. September 2025.",
    "organizationOrJournal": "Society of American Gastrointestinal and Endoscopic Surgeons",
    "authors": [
      "Kumar SK",
      "Shehata DG",
      "Cetrulo LN",
      "Ignacio R",
      "Chiu J",
      "Davis BR",
      "McDonald M",
      "Bloom MB",
      "Ayloo S",
      "Kchaou A",
      "Orthopoulos G",
      "Pucher PH",
      "Oliphant U",
      "Hallowell PT",
      "Serrot F",
      "Overby D",
      "Moreno-Paquentin E",
      "Slater BJ",
      "Miraflor E"
    ],
    "publicationYear": 2025,
    "officialUrl": "https://www.sages.org/publications/guidelines/guidelines-for-the-use-of-intraoperative-imaging-of-the-cbd/",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright SAGES; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Society systematic guideline; the conditional routine-imaging recommendation is not taught as a mandate.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.ioc-air-false-positive",
      "claim.n4r2.ioc-complete-study",
      "claim.n4r2.ioc-confirmed-stone-treatment"
    ],
    "verificationUse": "Direct verification of false-positive air defects, complete study criteria and the consequence of confirmed stones."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.ehs-hernia-surge-summary-2019",
    "title": "Official summary of International groin hernia guidelines",
    "completeCitation": "HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22:1–165. doi:10.1007/s10029-017-1668-x. Official European Hernia Society summary, 2019, chapter 20.",
    "organizationOrJournal": "European Hernia Society / Hernia",
    "authors": [
      "HerniaSurge Group"
    ],
    "publicationYear": 2018,
    "officialUrl": "https://europeanherniasociety.eu/wp-content/uploads/2023/04/Groin_ENG_cov13178_ehs_groin_hernia_management_a5_en_10_lr_1.pdf",
    "doi": "10.1007/s10029-017-1668-x",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright professional-society guideline summary; targeted verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Multi-society groin-hernia guideline. The official summary, rather than the full 165-page journal document, was read for the opposite-plane recommendation.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.groin-recurrence-opposite-plane"
    ],
    "verificationUse": "Direct recurrent anterior/posterior repair recommendation verification in the public society summary."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.asbrs-bcs-resource-2026",
    "title": "ASBrS breast-conserving surgery resource guide",
    "completeCitation": "Obeng-Gyasi S, Joseph KP; American Society of Breast Surgeons Critical Writing, Editing and Research Committee. Resource Guide: Breast Conserving Surgery. ASBrS. February 24, 2026.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "Obeng-Gyasi S",
      "Joseph KP",
      "ASBrS Critical Writing, Editing and Research Committee"
    ],
    "publicationYear": 2026,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-breast-conserving-surgery-2026-02-24.pdf",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright 2026 American Society of Breast Surgeons; targeted guidance verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Expert-informed focused resource guide, explicitly not represented here as a formal graded guideline.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.bcs-all-targets",
      "claim.n4r2.bcs-specimen-confirmation"
    ],
    "verificationUse": "Direct verification of malignant-target removal and specimen-imaging confirmation."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.ehs-emergency-ventral-2026",
    "title": "EHS emergency ventral and incisional hernia guideline",
    "completeCitation": "Stabilini C, Theodorou A, Pawlak M, Antoniou S, Berrevoet F, Bougard H, et al. EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions. J Abdom Wall Surg. 2026;5:16228. doi:10.3389/jaws.2026.16228. Published March 11, corrected March 20, 2026.",
    "organizationOrJournal": "Journal of Abdominal Wall Surgery / European Hernia Society",
    "authors": [
      "Stabilini C",
      "Theodorou A",
      "Pawlak M",
      "Antoniou S",
      "Berrevoet F",
      "Bougard H",
      "Bracale U",
      "Capoccia Giovannini S",
      "Fortelny R",
      "Gaarder C",
      "Garcia-Urena MA",
      "Gilmore K",
      "Gomez-Ochoa SA",
      "Köckerling F",
      "Mäkäräinen E",
      "Morales-Conde S",
      "Pecchini F",
      "Pereira Rodríguez JA",
      "Quiroga-Centeno AC",
      "Renard Y",
      "Romain B",
      "Schembari E",
      "Deerenberg E"
    ],
    "publicationYear": 2026,
    "officialUrl": "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2026.16228/full",
    "doi": "10.3389/jaws.2026.16228",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution (publisher open-access license)",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. Attribution retained; source scope and correction date recorded.",
    "authorityAssessment": "Current EHS emergency guideline. Material evidence low/very low; emergency scope is separate from elective reconstruction.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n4r2.permanent-macroporous-material"
    ],
    "verificationUse": "Current corroboration of permanent macroporous synthetic material when mesh is chosen. Not direct validation of timing after an inadvertent elective enterotomy."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.sages-ahs-mesh-catalog-undated",
    "title": "SAGES/AHS hernia mesh review and catalog",
    "completeCitation": "Nau P, Kanney J, Higgins R, Sherwinter D, Duke M, Auyang E, et al. SAGES/AHS Hernia Mesh Review and Catalog. SAGES. Undated public version accessed November 10, 2026.",
    "organizationOrJournal": "Society of American Gastrointestinal and Endoscopic Surgeons / Americas Hernia Society",
    "authors": [
      "Nau P",
      "Kanney J",
      "Higgins R",
      "Sherwinter D",
      "Duke M",
      "Auyang E",
      "Poulose B",
      "Goldblatt M",
      "Blatnik J",
      "Witkowski E",
      "Sandler B",
      "Miller H",
      "Milone L",
      "Szoka N",
      "Lak K",
      "Perez A",
      "Chung A",
      "Lee L",
      "Pierce R",
      "Dapri G",
      "Saad W",
      "Renton D"
    ],
    "publicationYear": null,
    "officialUrl": "https://www.sages.org/publications/sages-ahs-hernia-mesh-review-catalog/",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright professional-society guidance; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Expert society mesh-material review, not a formal graded guideline or current head-to-head implant trial. Publication year not stated; null rather than invented.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n4r2.mesh-compartment-contact"
    ],
    "verificationUse": "Targeted material/contact safety-boundary verification. Original factual synthesis; no catalog entries, product list, table or source expression copied."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.queensland-child-inguinal-hernia",
    "title": "Queensland children’s inguinal hernia guidance",
    "completeCitation": "Department of Paediatric Surgery and Urology, Queensland Children’s Hospital. Inguinal hernia. Fact sheet FS177. Reviewed December 2016; public page updated October 2023.",
    "organizationOrJournal": "Children’s Health Queensland, Queensland Government",
    "authors": [
      "Department of Paediatric Surgery and Urology, Queensland Children’s Hospital"
    ],
    "publicationYear": 2023,
    "officialUrl": "https://www.childrens.health.qld.gov.au/health-a-to-z/inguinal-hernia",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government patient guidance; rights retained except as allowed by government terms",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Public pediatric surgical guidance, not a graded trial or exact scheduling standard. Older clinical review date explicitly retained.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.child-groin-dynamic-contents",
      "claim.n4r2.child-hernia-repair",
      "claim.n4r2.child-hernia-urgent-boundary"
    ],
    "verificationUse": "Targeted dynamic presentation, herniotomy and nonreduction urgency verification."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.south-tees-child-groin-2024",
    "title": "NHS congenital inguinal hernia and hydrocoeles guidance",
    "completeCitation": "South Tees Hospitals NHS Foundation Trust. Congenital inguinal hernia and hydrocoeles. Updated August 30, 2024.",
    "organizationOrJournal": "South Tees Hospitals NHS Foundation Trust",
    "authors": [
      "South Tees Hospitals NHS Foundation Trust"
    ],
    "publicationYear": 2024,
    "officialUrl": "https://www.southtees.nhs.uk/services/children-and-young-people/specialty/general-surgery/congenital-inguinal-hernia-and-hydrocoeles/",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "government_guidance",
    "licenseLabel": "NHS public guidance; copyright retained, no blanket OGL assumption",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Public pediatric surgical guidance; distinction between fluid and bowel contents, not a diagnostic accuracy study.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n4r2.child-groin-dynamic-contents",
      "claim.n4r2.child-hernia-repair",
      "claim.n4r2.child-hernia-urgent-boundary"
    ],
    "verificationUse": "Independent targeted contents and operative-need cross-check."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.nih-magnesium-2026",
    "title": "NIH magnesium professional fact sheet",
    "completeCitation": "Office of Dietary Supplements, National Institutes of Health. Magnesium: Fact Sheet for Health Professionals. Updated January 6, 2026.",
    "organizationOrJournal": "NIH Office of Dietary Supplements",
    "authors": [
      "NIH Office of Dietary Supplements"
    ],
    "publicationYear": 2026,
    "officialUrl": "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "government_guidance",
    "licenseLabel": "US government factual guidance; public domain conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Government nutrient evidence summary; not a full acute high-output-stoma treatment protocol.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.gastrointestinal-magnesium-loss",
      "claim.n4r2.magnesium-potassium-loss"
    ],
    "verificationUse": "Parked-topic verification of gastrointestinal magnesium-loss mechanism. No new candidate keyed from this mechanism."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.nih-potassium-2022",
    "title": "NIH potassium professional fact sheet",
    "completeCitation": "Office of Dietary Supplements, National Institutes of Health. Potassium: Fact Sheet for Health Professionals. Updated June 2, 2022.",
    "organizationOrJournal": "NIH Office of Dietary Supplements",
    "authors": [
      "NIH Office of Dietary Supplements"
    ],
    "publicationYear": 2022,
    "officialUrl": "https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "government_guidance",
    "licenseLabel": "US government factual guidance; public domain conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Government nutrient evidence summary, not a comparative diagnostic-test ranking trial.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.magnesium-potassium-loss"
    ],
    "verificationUse": "Parked-topic verification of the magnesium/potassium relationship; no invented replacement dose."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.cambridge-thyroglossal-2024",
    "title": "NHS thyroglossal duct cyst guidance",
    "completeCitation": "Cambridge University Hospitals NHS Foundation Trust, Children’s Services / Paediatric Surgery and Urology. Thyroglossal duct cyst: information for parents and carers. Version 3, document 100973, approved September 9, 2024.",
    "organizationOrJournal": "Cambridge University Hospitals NHS Foundation Trust",
    "authors": [
      "Cambridge University Hospitals NHS Foundation Trust"
    ],
    "publicationYear": 2024,
    "officialUrl": "https://www.cuh.nhs.uk/patient-information/thyroglossal-duct-cyst-information-for-parents-and-carers/",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "government_guidance",
    "licenseLabel": "NHS public guidance; copyright retained, no blanket OGL assumption",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Public pediatric surgical guidance; does not supply a comparative protocol for every recurrent neck mass.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n4r2.thyroglossal-excision-extent",
      "claim.n4r2.thyroglossal-thyroid-check"
    ],
    "verificationUse": "Direct verification for the parked thyroglossal proposal; no candidate emitted."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.n4r2.esge-tissue-sampling-2021",
    "title": "ESGE upper gastrointestinal tissue sampling guideline",
    "completeCitation": "Pouw RE, Barret M, Biermann K, Bisschops R, Czakó L, Gecse KB, et al. Endoscopic tissue sampling—Part 1: Upper gastrointestinal and hepatopancreatobiliary tracts. ESGE Guideline. Endoscopy. 2021. Published online September 17, 2021. doi:10.1055/a-1611-5091.",
    "organizationOrJournal": "Endoscopy / European Society of Gastrointestinal Endoscopy",
    "authors": [
      "Pouw RE",
      "Barret M",
      "Biermann K",
      "Bisschops R",
      "Czakó L",
      "Gecse KB",
      "de Hertogh G",
      "Hucl T",
      "Iacucci M",
      "Jansen M",
      "Rutter M",
      "Savarino E",
      "Spaander MCW",
      "Schmidt PT",
      "Vieth M",
      "Dinis-Ribeiro M",
      "van Hooft JE"
    ],
    "publicationYear": 2021,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2021_a_1611_5091.pdf",
    "doi": "10.1055/a-1611-5091",
    "pmid": null,
    "accessedOn": "2026-11-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE / Thieme; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
    "authorityAssessment": "Society tissue-sampling guideline. Sampling-count requirements do not create a difficult item by themselves.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n4r2.post-impaction-esophageal-sampling",
      "claim.n4r2.celiac-sampling-territories"
    ],
    "verificationUse": "EoE sampling-level cross-check and celiac parked-design verification."
  }
];

const newProvenance = [
  {
    "claimId": "claim.n4r2.retractile-maintained-position",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.retractile-surveillance",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.acquired-ascent-operative-boundary",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.post-impaction-esophageal-sampling",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.impaction-trauma-sampling-confounder",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.ppi-before-eoe-biopsy",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.pedunculated-hot-snare",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.pedunculated-stalk-prophylaxis",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.critical-view-three-observations",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.critical-view-not-common-duct-exposure",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.ioc-air-false-positive",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.ioc-complete-study",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.ioc-confirmed-stone-treatment",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.groin-recurrence-opposite-plane",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.bcs-all-targets",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.bcs-specimen-confirmation",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.permanent-macroporous-material",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.mesh-compartment-contact",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.child-groin-dynamic-contents",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.child-hernia-repair",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.child-hernia-urgent-boundary",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.gastrointestinal-magnesium-loss",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.magnesium-potassium-loss",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.thyroglossal-excision-extent",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.thyroglossal-thyroid-check",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  },
  {
    "claimId": "claim.n4r2.celiac-sampling-territories",
    "inheritedClaimId": null,
    "statementUnchanged": false,
    "sourceRetrieval": true,
    "localMappingCheckedOn": "2026-11-10",
    "verificationDateRefreshed": false,
    "verificationBasis": "Direct targeted permitted-source factual verification on 2026-11-10; source rights and authority recorded separately."
  }
];

export const QUESTION_NEW_N4_ROUND2_ACCESS_AUDIT = [
  {
    "site": "EAU / Uroweb",
    "disposition": "EXCLUDED",
    "reason": "Explicit AI-use restriction in site terms. No EAU clinical facts adopted."
  },
  {
    "site": "American College of Surgeons / facs.org",
    "disposition": "EXCLUDED",
    "reason": "Footer prohibits third-party AI use without authorization. No ACS facts adopted. Do not confuse ACS with the separate ASBrS source."
  },
  {
    "site": "Rosen contaminated-mesh trial, JAMA / PMC",
    "disposition": "NO_NEW_VERIFICATION_USE",
    "reason": "Rights check found AMA all-rights-reserved, not a reusable CC license. PMC access was not treated as reuse permission. Existing inherited claim/source metadata remain dated and unchanged; this reading did not extend or refresh them."
  },
  {
    "site": "EAU, paywalled GIE full text, Nature challenge page, full 165-page groin PDF tool size rejection",
    "disposition": "NO_BYPASS",
    "reason": "Access/terms/size boundary respected. Alternative independent permitted primary guidance was used only within its actual scope."
  },
  {
    "site": "2025 WSES appendicitis edition (published 2026)",
    "disposition": "CURRENT_EXACT_KEY_UNVERIFIED",
    "reason": "Bibliographic update identified; full current pediatric appendicolith boundary was not verified within permitted access. No old 2020 threshold silently promoted as the current key."
  }
];

export const QUESTION_NEW_N4_ROUND2_CLAIMS=[...inheritedClaims,...QUESTION_NEW_N4_ROUND2_NEW_CLAIMS];
export const QUESTION_NEW_N4_ROUND2_SOURCES=[...inheritedSources,...QUESTION_NEW_N4_ROUND2_NEW_SOURCES];
export const QUESTION_NEW_N4_ROUND2_CLAIM_PROVENANCE=[...inheritedProvenance,...newProvenance];
export const QUESTION_NEW_N4_ROUND2_SOURCE_LINKS=QUESTION_NEW_N4_ROUND2_SOURCES.map(s=>({sourceId:s.id,label:s.title,href:s.officialUrl??"https://doi.org/"+s.doi,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"}));
