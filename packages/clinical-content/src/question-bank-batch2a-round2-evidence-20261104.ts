import type { EvidenceClaim } from "./pilot-schema";

/** Offline applications; original source access dates remain unchanged. */
export const QUESTION_BANK_BATCH2A_ROUND2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = [
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
    "id": "claim.qbp2ar2.reserve-emptying-boundary",
    "statement": "Reduced post-swallow contractile reserve is not itself evidence of obstructed junction outflow or an indication for pneumatic dilation; timed contrast emptying can supply complementary evidence in an unresolved obstructive-symptom assessment.",
    "basisClaimIds": [
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102.motility-egjoo"
    ],
    "sourceIds": [
      "source.qq20261102d.acg2020",
      "source.qq20261102d.chicago2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "An offline application of recorded physiological guidance. The software-derived integral, not peak height, is the reserve observation. No clearance conclusion from pressure alone, numerical criterion, universal test sequence or FLIP inferiority is asserted.",
    "applicablePopulation": "The bounded synthetic clinical/process scenario in batch 2a round two; no universal decision algorithm.",
    "lastCheckedOn": "2026-11-04",
    "verificationScope": "Offline independent synthesis using existing source records and previously checked atomic facts; no new source retrieval or changed access date. Exact clinical application remains for review.",
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "claim.qbp2ar2.functional-groin-target",
    "statement": "When several groin abnormalities coexist, an elective hernia referral should be tied to the demonstrated protrusion-associated functional restriction rather than to a positive unrelated scan or completion of modified work.",
    "basisClaimIds": [
      "claim.qq20261102a.symptomatic-groin-planning",
      "claim.qq20261102c.groin-symptom-attribution"
    ],
    "sourceIds": [
      "source.qq20261102a.hernia2018",
      "source.qq20261102a.hernia2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Original synthetic symptom-attribution application. Neither an exercise response nor a radiograph proves the cause of all pain; referral does not guarantee benefit or replace risk/preferences assessment.",
    "applicablePopulation": "The bounded synthetic clinical/process scenario in batch 2a round two; no universal decision algorithm.",
    "lastCheckedOn": "2026-11-04",
    "verificationScope": "Offline independent synthesis using existing source records and previously checked atomic facts; no new source retrieval or changed access date. Exact clinical application remains for review.",
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "claim.qbp2ar2.dynamic-groin-protocol",
    "statement": "A groin ultrasound request can specify the clinical site and posture/provocation associated with an intermittent contour, rather than assuming that an attachment examination or a non-reproducing position has assessed that question.",
    "basisClaimIds": [
      "claim.inguinal-hernia.equivocal-exam-ultrasound",
      "claim.qq20261102c.groin-inadequate-study-certainty"
    ],
    "sourceIds": [
      "source.sc.herniasurge-2018",
      "source.sc.niddk-inguinal-hernia"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Exact acquisition ranking requires clinical review. No numerical accuracy, universal MRI disadvantage, or exclusion of every vascular alternative is claimed.",
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
    "id": "claim.qbp2ar2.skin-specimen-map",
    "statement": "A benign melanocytic fragment remains a valid fragment diagnosis but does not settle a changed residual focus outside its mapped footprint; diagnostic sampling should provide the architecture and depth needed for that remainder.",
    "basisClaimIds": [
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
    ],
    "sourceIds": [
      "source.sc.nci-melanoma-pdq-2025",
      "source.qq20261102c.esmo-melanoma2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The localized upper-arm setting supports the offered complete diagnostic approach; selected partial sampling remains appropriate in other circumstances. No fixed margin, lesion size or invasion threshold is authored.",
    "applicablePopulation": "The bounded synthetic clinical/process scenario in batch 2a round two; no universal decision algorithm.",
    "lastCheckedOn": "2026-11-04",
    "verificationScope": "Offline independent synthesis using existing source records and previously checked atomic facts; no new source retrieval or changed access date. Exact clinical application remains for review.",
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "claim.qbp2ar2.source-method-pilot",
    "statement": "A crossed source-by-transfer-method pilot can support testing a source-reconciliation hypothesis when discrepancies track the source across both methods, while retaining completeness and burden measurements.",
    "basisClaimIds": [
      "claim.qq20261102c.pdsa-source-specific-next-test",
      "claim.qq20261102b.pdsa-hypothesis-not-proof"
    ],
    "sourceIds": [
      "source.qq20261102c.ahrq-pdsa",
      "source.qq20261102c.ahrq-measures"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The exhibit is a constructed process illustration, not empirical evidence or proof of a causal mechanism. Counts/times are not clinical thresholds, adoption rules or gameplay analytics.",
    "applicablePopulation": "The bounded synthetic clinical/process scenario in batch 2a round two; no universal decision algorithm.",
    "lastCheckedOn": "2026-11-04",
    "verificationScope": "Offline independent synthesis using existing source records and previously checked atomic facts; no new source retrieval or changed access date. Exact clinical application remains for review.",
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "claim.qbp2ar2.cortisol-etiologic-stage",
    "statement": "After abnormal cortisol suppression assessment, basal ACTH helps classify the etiologic pathway before an incidental adrenal nodule is assigned a functional role; a specialized dynamic/localization study does not replace that branch assessment.",
    "basisClaimIds": [
      "claim.brief.adrenal-incidentaloma.one-mg-dst",
      "claim.cushing.acth-guides-adrenal-imaging",
      "claim.cushing.confirm-before-localization"
    ],
    "sourceIds": [
      "source.brief.ese-adrenal-incidentaloma-2023",
      "source.board.cushing-endotext-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Only one recorded source directly supports the ACTH etiologic branch; the incidentaloma guideline supports the preceding assessment. Exact specialized-test ranking needs endocrine review. No suppression cutoff or ACTH-dependent localization algorithm is copied or invented.",
    "applicablePopulation": "The bounded synthetic clinical/process scenario in batch 2a round two; no universal decision algorithm.",
    "lastCheckedOn": "2026-11-04",
    "verificationScope": "Offline independent synthesis using existing source records and previously checked atomic facts; no new source retrieval or changed access date. Exact clinical application remains for review.",
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  }
];
