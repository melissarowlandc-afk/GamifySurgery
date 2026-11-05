import type { EvidenceClaim } from "./pilot-schema";

/** Atomic offline mappings; original source metadata/access dates retained. No fresh clinical verification. */
export const QUESTION_BANK_BATCH2B_ROUND2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = [
  {
    "id": "claim.qbp2b.r2.b2b01.application",
    "statement": "The anatomy supports internal diversion of a communicating minor leak.",
    "basisClaimIds": [
      "claim.early.bile-leak.minor-leak-ercp-stent",
      "claim.early.bile-leak.ce-mrcp-anatomic-localization"
    ],
    "sourceIds": [
      "source.wses.bile-duct-injury.2021",
      "source.esge.biliary-stenting.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No anticoagulant dose, interruption interval or bleeding probability is taught. Exact source alignment for the no-sphincterotomy strategy is required; no claim that every leak must receive the same intervention. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.leak-anticoagulation",
    "statement": "Plastic-stent diversion without sphincterotomy can treat a communicating postoperative bile leak while avoiding the additional bleeding exposure of papillary division.",
    "basisClaimIds": [
      "claim.early.bile-leak.minor-leak-ercp-stent",
      "claim.early.bile-leak.ce-mrcp-anatomic-localization"
    ],
    "sourceIds": [
      "source.wses.bile-duct-injury.2021",
      "source.esge.biliary-stenting.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Existing leak sources; the specific antithrombotic extension requires direct clinician/source alignment before acceptance. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.bile-leak-plastic-versus-metal",
    "statement": "Plastic stenting is an established initial endoscopic option for a communicating postoperative leak; a covered metal stent is a competing option for selected refractory or complex leaks rather than proof that ongoing output after external drainage has defeated plastic diversion.",
    "basisClaimIds": [
      "claim.early.bile-leak.minor-leak-ercp-stent",
      "claim.early.bile-leak.ce-mrcp-anatomic-localization"
    ],
    "sourceIds": [
      "source.esge.biliary-stenting.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "The exact leak-grade and prior-treatment ranking requires source alignment. No universal hardware rule or intervention interval is claimed. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b02.application",
    "statement": "B cells provide the class-II target relevant to the DQ signal; the pre-event specimen can address whether reactivity preceded the injury.",
    "basisClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.qf3.preimplantation-specimen-inference"
    ],
    "sourceIds": [
      "source.gs028e.hyperacute_matsuda2016",
      "source.gs028e.ahrq_transplant2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No fluorescence threshold, antibody-strength cutoff, desensitization protocol or assertion that a single test proves the entire injury mechanism is introduced. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b-cell-class-ii-crossmatch",
    "statement": "Donor B-cell testing can investigate a class-II HLA antibody question not settled by a donor T-cell crossmatch; a preimplantation recipient specimen is needed to examine pre-existing reactivity.",
    "basisClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.qf3.preimplantation-specimen-inference"
    ],
    "sourceIds": [
      "source.gs028e.hyperacute_matsuda2016",
      "source.gs028e.ahrq_transplant2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Cell-target biology is a new qualitative extension of recorded transplant references; exact-source alignment is required. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b03.application",
    "statement": "A prolonged cirrhotic INR is not an isolated transfusion target.",
    "basisClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation",
      "claim.qf3.cirrhosis-urgent-hernia-boundary",
      "claim.qbp2b.b2b03.application"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Single recorded AGA expert review; the exact viscoelastic application remains clinician review. No laboratory number is invented and no bleeding-risk probability is assigned. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.cirrhotic-inr-plan",
    "statement": "Cirrhotic INR prolongation does not by itself justify prophylactic factor transfusion to a target before surgery; clinical bleeding and other haemostatic findings matter.",
    "basisClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation",
      "claim.qf3.cirrhosis-urgent-hernia-boundary",
      "claim.qbp2b.b2b03.application"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Qualitative perioperative application; no factor dose, INR target or viscoelastic transfusion threshold. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b04.application",
    "statement": "Pulsatile flow within a communicating cavity raises a vascular mimic rather than a simple drainable abscess.",
    "basisClaimIds": [
      "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      "claim.bread-butter.skin-infection.equivocal-ultrasound",
      "claim.bread-butter.cutaneous-abscess.incision-drainage"
    ],
    "sourceIds": [
      "source.msd-manual-professional.lymphangitis.2026",
      "source.bread-butter.acep-sonoguide-abscess",
      "source.bread-butter.idsa-ssti-2014"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New qualitative application of existing recorded ACEP guidance; exact image/arterial request needs clinician verification. No availability statement, invented size threshold or antibiotic protocol. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.vascular-mimic-map",
    "statement": "Internal pulsatile Doppler flow and a communicating channel in a presumed soft-tissue collection require vascular characterization before it is treated as an uncomplicated abscess.",
    "basisClaimIds": [
      "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      "claim.bread-butter.skin-infection.equivocal-ultrasound",
      "claim.bread-butter.cutaneous-abscess.incision-drainage"
    ],
    "sourceIds": [
      "source.bread-butter.acep-sonoguide-abscess"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Qualitative application of the recorded ultrasound/vascular-mimic boundary; no claim that colour alone establishes a complete arterial diagnosis. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b07.application",
    "statement": "The record raises a concrete concern about appreciation, despite an ability to recite general facts.",
    "basisClaimIds": [
      "claim.gs028se.capacity-refusal.1",
      "claim.gs028se.capacity-refusal.3"
    ],
    "sourceIds": [
      "source.gs028se.ama-consent-2-1-1",
      "source.gs028se.ama-capacity-2-1-2"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No jurisdiction-specific legal threshold, psychiatric diagnosis or automatic guardianship rule. Named clinician and applicable local consent process still required. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b08.application",
    "statement": "The initial skin/lymphatic presentation establishes an inflammatory phenotype whose operative approach is not de-escalated merely because skin and nodal appearances respond.",
    "basisClaimIds": [
      "claim.nact.bcs-selection",
      "claim.nact.response-mapping",
      "claim.brief.ibc.core-biopsy-confirmation",
      "claim.brief.ibc.trimodality-sequence"
    ],
    "sourceIds": [
      "source.nact.asbrs-2025",
      "source.bcs.asbrs-2026",
      "source.brief.dawood-ibc-consensus-2011",
      "source.brief.nci-ibc-diagnosis-2025",
      "source.brief.ueno-ibc-consensus-2018",
      "source.brief.nci-ibc-treatment-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No universal rule for every post-neoadjuvant patient; the inflammatory-disease consensus and exact clinical context need breast-specialist verification. Skin response does not establish pathological eradication. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.inflammatory-response-operation",
    "statement": "The inflammatory breast-cancer presentation continues to determine breast/axillary operative planning after neoadjuvant response; clinical disappearance of skin changes does not alone establish eligibility for breast conservation or axillary de-escalation.",
    "basisClaimIds": [
      "claim.nact.bcs-selection",
      "claim.nact.response-mapping",
      "claim.brief.ibc.core-biopsy-confirmation",
      "claim.brief.ibc.trimodality-sequence"
    ],
    "sourceIds": [
      "source.brief.ueno-ibc-consensus-2018",
      "source.brief.nci-ibc-treatment-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No response probability or numeric eligibility cutoff; exact operation/axillary wording requires clinical sign-off. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b09.application",
    "statement": "Physiological derangement and uncertain remaining viability support staged reassessment rather than immediate anastomosis and definitive closure.",
    "basisClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration"
    ],
    "sourceIds": [
      "source.wses.ami.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Single recorded WSES guideline; clinician reviews exact operative scenario. No claim that every dusky loop is dead or that every mesenteric operation requires discontinuity. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.ischaemic-bowel-staging",
    "statement": "After revascularization and removal of frankly nonviable bowel, uncertain remaining viability with physiological derangement can justify bowel discontinuity and planned second-look surgery rather than an immediate anastomosis.",
    "basisClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration"
    ],
    "sourceIds": [
      "source.wses.ami.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No fixed second-look interval, resection length or vasopressor threshold. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b11.application",
    "statement": "Ongoing gallbladder infection needs source control, but the new active cardiac episode changes immediate operative fitness; drainage is the offered bridge.",
    "basisClaimIds": [
      "claim.gs028c.cholecystitis.index-admission-cholecystectomy"
    ],
    "sourceIds": [
      "source.wses.cholecystitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "One recorded WSES guideline. Exact cardiac/source-control application requires surgical/anaesthetic review; neither age nor a biomarker in isolation establishes operative unsuitability. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.cholecystitis-active-cardiac-event",
    "statement": "When persistent acute gallbladder infection requires source control but a current major cardiac event makes immediate surgery unsuitable, gallbladder drainage can bridge to reassessment.",
    "basisClaimIds": [
      "claim.gs028c.cholecystitis.index-admission-cholecystectomy"
    ],
    "sourceIds": [
      "source.wses.cholecystitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Case-specific high-risk-versus-unfit distinction; no cardiac risk score, time after MI, mandatory delay or mortality estimate. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b12.application",
    "statement": "The observations support a localized superficial process managed with local measures; the active marginal-ulcer history changes the analgesic choice.",
    "basisClaimIds": [
      "claim.mondor-disease.ultrasound-phenotype",
      "claim.mondor-disease.supportive-management-and-boundaries",
      "claim.gs028c.marginal-ulcer.nsaid"
    ],
    "sourceIds": [
      "source.statpearls.mondor-disease.2023",
      "source.amano-shimizu.mondor-review.2018",
      "source.asmbs.marginal-ulcer.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No paracetamol dose or guarantee of safety in every comorbidity. Exact analgesic substitution remains clinical review; the first confidentiality node and shared presentation are not edited. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b13.application",
    "statement": "The benign result is from a different sonographic target and has not sampled the calcification field.",
    "basisClaimIds": [
      "claim.discharge.pathologic-pattern",
      "claim.discharge.imaging",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.discharge.acr-2022",
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No BI-RADS probability, lesion-size threshold or claim that a negative ultrasound resolves calcifications. New guidance/representativity application remains clinician/source-alignment review. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.breast-target-representativity",
    "statement": "A benign specimen from a different target does not resolve a separate suspicious mammographic calcification field; repeat sampling must address the field with an appropriate demonstrated guidance modality.",
    "basisClaimIds": [
      "claim.discharge.pathologic-pattern",
      "claim.discharge.imaging",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.discharge.acr-2022",
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Original target/provenance synthesis, not a copied sampling algorithm. Exact calcification and guidance wording requires breast source alignment. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b14.application",
    "statement": "The acute abdominal pattern needs a broad appendiceal/alternative-pathology assessment; microscopic haematuria does not by itself turn the task into a stone-only or excretory-tract study.",
    "basisClaimIds": [
      "claim.gs028c.appendicitis.ct-after-nondiagnostic-us"
    ],
    "sourceIds": [
      "source.sages.appendicitis.2024",
      "source.wses.appendicitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No invented contrast threshold, dose, phase timing or claim that noncontrast CT never diagnoses appendicitis. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.acute-abdominal-ct-protocol",
    "statement": "For a nonpregnant adult with an acute right-lower-quadrant inflammatory presentation and no stated contrast contraindication, an IV-contrast abdominopelvic CT request evaluates the abdominal differential rather than a urinary-only protocol.",
    "basisClaimIds": [
      "claim.gs028c.appendicitis.ct-after-nondiagnostic-us"
    ],
    "sourceIds": [
      "source.sages.appendicitis.2024",
      "source.wses.appendicitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Protocol specificity is a new extension of the recorded appendicitis imaging guidance; exact protocol/source alignment is required. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b15.application",
    "statement": "The new renal/fluid trajectory makes continued NSAID exposure important to address.",
    "basisClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Necessary shared-presentation revision is versioned separately; the first node remains exact and retains sufficient cirrhosis/elective-procedure context. Renal deterioration needs urgent clinical assessment beyond this analgesic task. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.cirrhosis-nsaid-renal-boundary",
    "statement": "NSAIDs can impair renal perfusion in cirrhosis and should not be substituted within the same class as a response to a new renal/fluid deterioration.",
    "basisClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No dose, causal certainty from temporal association or universal paracetamol regimen; immediate renal/decompensation assessment remains necessary. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b16.application",
    "statement": "The stool, posture and chemistry observations suggest a treatment-related volume/electrolyte precipitant.",
    "basisClaimIds": [
      "claim.cirrhosis.optimize-decompensation"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "The data do not prove a single cause of confusion or replace infection/bleeding/neurological assessment. Specific source extension is explicitly pending clinician alignment. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.catharsis-volume-precipitant",
    "statement": "Excessive cathartic losses in a patient with cirrhosis can worsen volume/electrolyte status and mentation; current bowel output and clinical response matter when adjusting therapy.",
    "basisClaimIds": [
      "claim.cirrhosis.optimize-decompensation"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New qualitative treatment-response extension; exact hepatic-encephalopathy management alignment must be verified. No ammonia target, stool quota, dose or replacement protocol. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b17.application",
    "statement": "The combined dialysis-performance and collateral pattern points toward an outflow problem extending beyond the cannulation segment; the study must include the central route.",
    "basisClaimIds": [
      "claim.gs028d.access.dysfunction-referral"
    ],
    "sourceIds": [
      "source.ukka.vascular-access.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Single recorded UKKA guideline; exact investigation/protocol requires access-team review. No test availability or permission sentence. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.access-central-outflow-map",
    "statement": "Arm swelling, prolonged puncture bleeding, collateral veins and dialysis-performance changes can require assessment of access and central venous outflow rather than only hand arterial perfusion.",
    "basisClaimIds": [
      "claim.gs028d.access.dysfunction-referral"
    ],
    "sourceIds": [
      "source.ukka.vascular-access.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Case-specific investigation selection; no stenosis threshold, routine asymptomatic surveillance claim or mandated angioplasty result. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b18.application",
    "statement": "The electrical response does not establish potassium lowering.",
    "basisClaimIds": [
      "claim.gs028d.hyperkalaemia.severe-transfer",
      "claim.gs028d.hyperkalaemia.mechanisms"
    ],
    "sourceIds": [
      "source.ukka.hyperkalaemia.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Recorded UKKA calcium recommendation is weak 2C; no dose, interval, survival benefit or universal re-dosing threshold is asserted. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b19.application",
    "statement": "The report attachment is not the entire acquired examination.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No declaration that coverage alone proves image adequacy or benignity. This is a current reconciliation step, not a negative-imaging discharge rule. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.breast-existing-series-reconciliation",
    "statement": "An attached report from another target does not prove the palpable site was never acquired; a documented stored target series should be reconciled before ordering a duplicate examination.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Target-acquisition/provenance inference, not a rule to delay tissue assessment of a clinically suspicious lesion. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b20.application",
    "statement": "An upward intersphincteric route favors internal drainage; spreading inflammation/systemic illness supports adjunctive antibiotics.",
    "basisClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Complex infection requires colorectal assessment and appropriate resuscitation; the MRI description and new route claim remain clinician/source-alignment review. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.supralevator-origin-drainage",
    "statement": "Drainage of a supralevator abscess depends on its origin: upward intersphincteric extension can be drained internally, whereas extension from the ischioanal space requires an external route.",
    "basisClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New anatomical application of recorded guideline; direct section alignment and the constructed MRI are required. No depth/size cutoff. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b21.application",
    "statement": "The actual home exposure and interruption make withdrawal a relevant driver; a benzodiazepine can treat that mechanism rather than merely suppress the behaviour.",
    "basisClaimIds": [
      "claim.gs028d.delirium.multicomponent-plan"
    ],
    "sourceIds": [
      "source.esaic.delirium.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Not a universal diagnosis of withdrawal or an order outside monitored hospital care. Source alignment for the named agents is a hold; no dose or blanket superiority over all ICU regimens. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.withdrawal-delirium-exception",
    "statement": "Benzodiazepines are not routine delirium treatment, but withdrawal from a regular benzodiazepine is a clinically distinct indication to address the withdrawal mechanism.",
    "basisClaimIds": [
      "claim.gs028d.delirium.multicomponent-plan"
    ],
    "sourceIds": [
      "source.esaic.delirium.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New named-drug/withdrawal extension; direct guideline/drug-source alignment is required before acceptance. No dose, withdrawal latency or severity score. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b22.application",
    "statement": "The raw phase findings localize thrombosis to the mesenteric venous route.",
    "basisClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration"
    ],
    "sourceIds": [
      "source.wses.ami.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Single WSES source and original synthetic CT description; specialist assessment and ongoing reassessment remain necessary. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.mesenteric-venous-initial-treatment",
    "statement": "Mesenteric venous thrombosis without peritonitis can initially be managed with anticoagulation; peritonitis or bowel nonviability changes the need for operative assessment.",
    "basisClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration"
    ],
    "sourceIds": [
      "source.wses.ami.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No anticoagulant dose, duration, clot-length threshold or claim that imaging rules out all evolving ischaemia. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b23.application",
    "statement": "The local complication changes the timing despite clinical improvement; the current duct findings do not establish a separate ERCP indication.",
    "basisClaimIds": [
      "claim.gs028c.pancreatitis.index-admission-cholecystectomy"
    ],
    "sourceIds": [
      "source.acg.acute-pancreatitis.2024",
      "source.wses.severe-pancreatitis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Timing is interval reassessment of the local complication, not an arbitrary wait. Exact complicated-disease source alignment is required; no lipase-normalization gate. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.pancreatitis-local-complication-timing",
    "statement": "A persisting local complication after biliary pancreatitis can require interval reassessment before cholecystectomy rather than automatic use of the mild uncomplicated same-admission pathway.",
    "basisClaimIds": [
      "claim.gs028c.pancreatitis.index-admission-cholecystectomy"
    ],
    "sourceIds": [
      "source.acg.acute-pancreatitis.2024",
      "source.wses.severe-pancreatitis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New extension to complicated pancreatitis against recorded guidance; no fixed waiting interval, size threshold or inference of sterility. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b24.application",
    "statement": "The residual calcification field has malignant in-situ histology at C, so the MRI enhancement edge is not the complete target.",
    "basisClaimIds": [
      "claim.nact.response-mapping",
      "claim.nact.bcs-selection"
    ],
    "sourceIds": [
      "source.nact.asbrs-2025",
      "source.bcs.asbrs-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "The unchanged later gate/operation question remains compatible with localized disease in one conservation field. No claim of tumour-free margins or complete exclusion of invasion from sampled cores. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.residual-calcification-bracketing",
    "statement": "Post-neoadjuvant localization must integrate the original marked site and biopsy-supported residual disease, including a malignant calcification field beyond the current enhancement edge.",
    "basisClaimIds": [
      "claim.nact.response-mapping",
      "claim.nact.bcs-selection"
    ],
    "sourceIds": [
      "source.nact.asbrs-2025",
      "source.bcs.asbrs-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Original spatial example; no claim that enhancement defines microscopic margins or that every residual calcification is malignant. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b25.application",
    "statement": "The anatomy calls for a bailout rather than continued total dissection, and the remaining wall is not a sound basis for a closed remnant.",
    "basisClaimIds": [
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
      "claim.gs028g.subtotal-cholecystectomy.remnant-classification"
    ],
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No numerical tissue/duct threshold, fixed timing or claim that all conversions are wrong. Clinical and exact source alignment of the completion choice required. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.subtotal-remnant-tissue-choice",
    "statement": "Subtotal technique selection must account for whether the remnant can be safely closed; a fenestrating operation leaves an open remnant, while a reconstituting operation closes it.",
    "basisClaimIds": [
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
      "claim.gs028g.subtotal-cholecystectomy.remnant-classification"
    ],
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New tissue-quality application; conversion and other bailout strategies remain legitimate outside this offered comparison. No claim of universal superiority. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b26.application",
    "statement": "Persistent acute gallbladder-pattern symptoms and inflammation remain unresolved by the wall/fluid observations; scintigraphy is the offered investigation that addresses that discordance.",
    "basisClaimIds": [
      "claim.gs028c.cholecystitis.hida-after-equivocal-us"
    ],
    "sourceIds": [
      "source.wses.cholecystitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Best offered test in this scoped scenario, not a universal HIDA-over-CT hierarchy. Nuclear preparation/augmentation interpretation is not scored, and no exact test threshold or wait is authored. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b29.application",
    "statement": "The new electrical toxicity requires the calcium question to be addressed even though a shifting intervention has begun to lower the measured potassium.",
    "basisClaimIds": [
      "claim.gs028d.hyperkalaemia.severe-transfer",
      "claim.gs028d.hyperkalaemia.mechanisms"
    ],
    "sourceIds": [
      "source.ukka.hyperkalaemia.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No calcium/insulin dose, re-dosing interval or outcome benefit. Recorded UKKA calcium evidence remains weak 2C. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b30.application",
    "statement": "Glucose has fallen without resolution of the ketone acidosis.",
    "basisClaimIds": [
      "claim.gs028e.sglt2.ketoacidosis-without-marked-hyperglycemia",
      "claim.gs028e.sglt2.ketoacidosis-precipitating-context",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.fda.empagliflozin-label.2025.s063",
      "source.dailymed.empagliflozin-label.2026",
      "source.fda.ertugliflozin-label.2026.s012",
      "source.mhra.sglt2-ketoacidosis-safety.2016",
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "This is a material objective change, not another potassium variant. No dose, universal stopping threshold, time to resolution or insulin-transition protocol is taught. New treatment alignment requires source/clinician review. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.persistent-ketone-acidosis-substrate",
    "statement": "During insulin treatment of ketoacidosis, falling glucose does not establish resolution of ketone acidosis; glucose supplementation can permit continued insulin while that metabolic process is treated.",
    "basisClaimIds": [
      "claim.gs028e.sglt2.ketoacidosis-without-marked-hyperglycemia",
      "claim.gs028e.sglt2.ketoacidosis-precipitating-context",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Qualitative treatment principle only; constructed panel values are observations, not resolution, infusion-rate or glucose-trigger criteria. Direct alignment of the specific treatment plan is required before acceptance. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b31.application",
    "statement": "The erythrocyte reactions raise an ABO compatibility question not answered by a negative HLA assay; the pre-event serum can examine the preceding antibody state.",
    "basisClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.qf3.preimplantation-specimen-inference"
    ],
    "sourceIds": [
      "source.gs028e.hyperacute_matsuda2016",
      "source.gs028e.ahrq_transplant2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No antibody titre, ABO-incompatible protocol, autoantibody exclusion or claim that the displayed tests alone prove the event mechanism. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.abo-versus-hla-record",
    "statement": "A negative HLA compatibility test does not answer an ABO incompatibility question; red-cell typing and preimplantation antibody records address a distinct potential pre-existing humoral pathway.",
    "basisClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.qf3.preimplantation-specimen-inference"
    ],
    "sourceIds": [
      "source.gs028e.hyperacute_matsuda2016",
      "source.gs028e.ahrq_transplant2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New qualitative compatibility-system application. ABO-incompatible protocols exist; no blanket eligibility prohibition or titre cutoff is claimed. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b32.application",
    "statement": "The raw gap is 12 but the stated correction makes it 19.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Exact equation, units and reference mapping are explicitly source-held pending targeted verification. Values are constructed and arithmetic-checked, not extracted patient data or an empirical probability. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.gap-calculation-aid",
    "statement": "The conventional albumin correction adds 0.25 mmol/L to the anion gap for each g/L albumin below 40; the displayed synthetic calculations use the supplied laboratory reference, not an empirical patient threshold.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "The prior local claim explicitly withheld arithmetic. This new equation/unit/reference mapping needs separate exact-source verification before acceptance; no fresh retrieval is claimed. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b33.application",
    "statement": "A near-normal pH and glucose do not resolve the elevated-gap component.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas",
      "claim.gs028e.sglt2.ketoacidosis-without-marked-hyperglycemia",
      "claim.gs028e.sglt2.ketoacidosis-precipitating-context"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019",
      "source.fda.empagliflozin-label.2025.s063",
      "source.dailymed.empagliflozin-label.2026",
      "source.fda.ertugliflozin-label.2026.s012",
      "source.mhra.sglt2-ketoacidosis-safety.2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Qualitative gas directions do not quantify compensation or prove a single disorder. No glucose, ketone, medication-hold or treatment threshold is added. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b34.application",
    "statement": "The displayed correction changes admission/current gaps from raw 14/12 to adjusted 14/19.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "The exact aid/reference has the same explicit source hold as B2B32. Current lactate/ketones are requested now; no late testing is claimed to reconstruct an old specimen. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b35.application",
    "statement": "The simultaneous gas does not support the chemistry bicarbonate implication, and the collection record provides a reason to verify that panel from a separate site.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.blood-gas",
      "claim.n1r2.gas-record-interpretation"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019",
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Constructed arithmetic consistency, not a universal method-difference threshold or definitive contamination diagnosis. Exact specimen-handling application needs clinician/laboratory review. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.discordant-gas-chemistry-specimen",
    "statement": "A contemporaneous gas/chemistry discrepancy should be reconciled before a low chemistry CO2 result is treated as proof of metabolic acidemia; collection provenance can identify which specimen needs verification.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.blood-gas",
      "claim.n1r2.gas-record-interpretation"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Original internal-consistency/provenance inference, not a claim that all disagreements are saline contamination. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b36.application",
    "statement": "A labelled M series is not equivalent to an interpretable examination of tissue at M.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "The following ultrasound gate and persistent-lump assessment remain compatible. The imaging request does not replace tissue assessment of an unresolved suspicious examination. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.obscured-breast-acquisition",
    "statement": "A skin-marker label does not establish target adequacy when the tissue beneath it is obscured; repeat targeted acquisition can be necessary despite a nominally negative report.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Original acquisition-adequacy inference; no image accuracy or universal MRI exclusion. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b37.application",
    "statement": "The benign-appearing cytology belongs to another target and does not resolve the clinically suspicious area.",
    "basisClaimIds": [
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Not a claim that FNA is universally inappropriate or that palpation core always succeeds. Specialist assessment may select another definitive sampling strategy if the target cannot be reliably sampled. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.palpable-core-target-after-cytology",
    "statement": "A benign or limited needle result from a different target does not resolve a clinically suspicious palpable abnormality; representative histologic sampling must address the actual clinical target.",
    "basisClaimIds": [
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Target/provenance plus architecture application; exact core-versus-cytology wording requires breast-source alignment. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b38.application",
    "statement": "The high component comes from the ischioanal route, supporting external drainage.",
    "basisClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No universal no-antibiotic rule. Complex disease and the exact guideline scope require colorectal source/clinical review after adequate drainage. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b39.application",
    "statement": "The high sphincter-crossing tract favors drainage/staged planning rather than routine division; the transplant immunosuppressive regimen remains relevant despite normal neutrophils and no fever.",
    "basisClaimIds": [
      "claim.fistula.loose-seton-for-high-transsphincteric-tract",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.board.fistula-ascrs-2022",
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Not a recommendation for every chemotherapy-associated infection or every transplant patient. No neutrophil/platelet cutoff, drug dose or universal seton rule. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.transplant-regimen-host-assessment",
    "statement": "Normal neutrophil results do not by themselves establish normal immune function in a transplant recipient receiving ongoing tacrolimus, mycophenolate and glucocorticoid therapy.",
    "basisClaimIds": [
      "claim.fistula.loose-seton-for-high-transsphincteric-tract",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.board.fistula-ascrs-2022",
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Named established exposure, not a recommendation for a universal transplant regimen or dose. Medication/source alignment remains for review. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b40.application",
    "statement": "The low course does not erase the existing functional deficit and prior sphincter division; drainage with later sphincter-preserving planning avoids automatically adding division now.",
    "basisClaimIds": [
      "claim.fistula.loose-seton-for-high-transsphincteric-tract",
      "claim.bread-butter.perianal-abscess.prompt-drainage"
    ],
    "sourceIds": [
      "source.board.fistula-ascrs-2022",
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No claim that every low tract needs a seton or that a cutting seton is universally prohibited; precise function/operative strategy requires review. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.baseline-function-before-fistulotomy",
    "statement": "Apparent low fistula anatomy must be interpreted alongside baseline continence and prior sphincter surgery before choosing a sphincter-dividing procedure.",
    "basisClaimIds": [
      "claim.fistula.loose-seton-for-high-transsphincteric-tract",
      "claim.bread-butter.perianal-abscess.prompt-drainage"
    ],
    "sourceIds": [
      "source.board.fistula-ascrs-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New low-tract/function application; exact staged strategy needs colorectal verification. No tract-percentage or continence-risk probability. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b41.application",
    "statement": "The actual recorded intake totals the current individual targets.",
    "basisClaimIds": [
      "claim.nutrition.screen",
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "sourceIds": [
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Individual numbers are constructed and clinician-review dependent, not population norms. No intake percentage/duration gate or guarantee of absorption is authored. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.nutrition-intake-audit",
    "statement": "Route escalation should consider actual delivered intake against assessed needs; albumin during inflammation does not independently establish an unmet intake requirement.",
    "basisClaimIds": [
      "claim.nutrition.screen",
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "sourceIds": [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "The numbers are transparent constructed prescription/delivery arithmetic, not a new energy/protein requirement formula or a malnutrition diagnostic threshold. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.b2b42.application",
    "statement": "The observed delivery problem is gastric; a postpyloric trial can address that compartment before treating the entire enteral route as unusable.",
    "basisClaimIds": [
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "sourceIds": [
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "No feeding threshold, tube-placement guarantee, aspiration-safety conclusion, duration or formula/dose. Source-specific access recommendation remains clinical alignment. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.postpyloric-before-route-abandonment",
    "statement": "Failure of gastric delivery does not necessarily establish failure of postpyloric enteral nutrition; access choice should address the observed compartment before abandoning the enteral route.",
    "basisClaimIds": [
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "sourceIds": [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "New access-specific extension; exact postpyloric application requires source alignment. Transit does not prove absorption or future feeding tolerance. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.f13.application",
    "statement": "The awake oxygenation and chemistry observations raise a current ventilation/gas-exchange question not answered by daytime sleepiness or a sleep-probability report.",
    "basisClaimIds": [
      "claim.gs028d.osa.validated-screen",
      "claim.qf2.sleep-questionnaire-domain-interpretation",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.sasm.osa-screening.2016",
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "Exact SASM/awake-gas prioritization is source-held pending targeted permitted verification. No obesity, CO2, saturation, sleep-score threshold, drug dose, monitoring or automatic surgery-delay rule is invented. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  },
  {
    "id": "claim.qbp2b.r2.osa-awake-gas-exchange",
    "statement": "Abnormal awake gas-exchange findings in a patient with possible OSA warrant a separate preoperative cardiopulmonary assessment; a sleepiness report does not resolve that question.",
    "basisClaimIds": [
      "claim.gs028d.osa.validated-screen",
      "claim.qf2.sleep-questionnaire-domain-interpretation",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.sasm.osa-screening.2016",
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.",
    "limitation": "This precise new application was not in the previously checked screening claim. Direct SASM exception and awake-gas prioritization verification is a source hold; no new cutoff or surgical-delay protocol. Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-bank-batch2b-round2.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval."
  }
];
