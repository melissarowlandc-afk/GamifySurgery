import type { EvidenceClaim } from "./pilot-schema";

/** Direct original-claim applications; no new candidate has a keyed source hold. */
export const QUESTION_FLAGS2_ROUND3_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = [
  {
    "id": "claim.flags2r3.20261105.clinical-target",
    "statement": "A persistent clinically concerning breast target requires tissue assessment despite mammography and targeted ultrasonography without a correlate.",
    "basisClaimIds": [
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described persistent clinical breast target after site-correct imaging; the separate fibroadenoma retains its own concordance.",
    "limitation": "Single ACR guideline for the clinical-target decision plus recorded ASBrS/SBI guidance for the separate concordant fibroadenoma. No MRI contraindication, surveillance interval, biopsy-device ranking or empirical false-negative rate is taught.",
    "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.flags2r3.20261105.benign-scope",
    "statement": "Observation of a stable, asymptomatic, concordant core-proven fibroadenoma applies to that lesion; a separate discordant clinical target is outside that observation claim.",
    "basisClaimIds": [
      "claim.bread-butter.fibroadenoma.concordant-observation",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.bread-butter.asbrs-sbi-fibroepithelial-2025",
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described persistent clinical breast target after site-correct imaging; the separate fibroadenoma retains its own concordance.",
    "limitation": "Single ACR guideline for the clinical-target decision plus recorded ASBrS/SBI guidance for the separate concordant fibroadenoma. No MRI contraindication, surveillance interval, biopsy-device ranking or empirical false-negative rate is taught.",
    "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.flags2r3.20261105.sampling-scope",
    "statement": "When a concerning palpable breast target has no imaging correlate, the tissue-diagnosis requirement does not mandate one biopsy device or imaging-guided technique.",
    "basisClaimIds": [
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described persistent clinical breast target after site-correct imaging; the separate fibroadenoma retains its own concordance.",
    "limitation": "Single ACR guideline for the clinical-target decision plus recorded ASBrS/SBI guidance for the separate concordant fibroadenoma. No MRI contraindication, surveillance interval, biopsy-device ranking or empirical false-negative rate is taught.",
    "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.flags2r3.20261105.calcium-confirmation",
    "statement": "In the recorded low-clearance, longstanding hypercalcemia phenotype, a pathogenic FHH-associated CASR finding supports confirmation; the low clearance ratio by itself would not.",
    "basisClaimIds": [
      "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
      "claim.fhh.low-cccr-supports-but-does-not-confirm",
      "claim.fhh.genetic-and-family-confirmation"
    ],
    "sourceIds": [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the scoped stable, uncomplicated inherited-calcium phenotype with a recorded pathogenic confirmation; not a VUS, mutation-negative case, progressive change or coexisting PHPT.",
    "limitation": "PARAT/Fifth Workshop support the confirmed uncomplicated FHH management boundary; NIDDK supports biochemical diagnosis before localization. Duplicate Fifth Workshop source records are one publication. No negative gene result, uncertain variant, progressive disease, coexisting PHPT, cinacalcet indication/dose or localization test-performance rule is taught.",
    "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.flags2r3.20261105.calcium-management",
    "statement": "Confirmed uncomplicated FHH with stable mild hypercalcemia is generally observed rather than treated with parathyroid surgery, which usually does not correct the inherited disorder.",
    "basisClaimIds": [
      "claim.fhh.reassurance-observation-avoid-parathyroid-surgery"
    ],
    "sourceIds": [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the scoped stable, uncomplicated inherited-calcium phenotype with a recorded pathogenic confirmation; not a VUS, mutation-negative case, progressive change or coexisting PHPT.",
    "limitation": "PARAT/Fifth Workshop support the confirmed uncomplicated FHH management boundary; NIDDK supports biochemical diagnosis before localization. Duplicate Fifth Workshop source records are one publication. No negative gene result, uncertain variant, progressive disease, coexisting PHPT, cinacalcet indication/dose or localization test-performance rule is taught.",
    "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.flags2r3.20261105.age-scope",
    "statement": "The under-50 parathyroidectomy criterion applies after PHPT is established; normal baseline DXA is not a requirement for referral or the determinant of the inherited-disease management decision.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.age-under-50-surgery",
      "claim.asymptomatic-phpt.three-site-dxa",
      "claim.fhh.reassurance-observation-avoid-parathyroid-surgery"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022",
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the scoped stable, uncomplicated inherited-calcium phenotype with a recorded pathogenic confirmation; not a VUS, mutation-negative case, progressive change or coexisting PHPT.",
    "limitation": "PARAT/Fifth Workshop support the confirmed uncomplicated FHH management boundary; NIDDK supports biochemical diagnosis before localization. Duplicate Fifth Workshop source records are one publication. No negative gene result, uncertain variant, progressive disease, coexisting PHPT, cinacalcet indication/dose or localization test-performance rule is taught.",
    "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.flags2r3.20261105.localization-scope",
    "statement": "A localization image does not itself establish the biochemical diagnosis; it does not replace the genetic/biochemical distinction between PHPT and FHH.",
    "basisClaimIds": [
      "claim.primary-hyperparathyroidism.biochemical-pattern",
      "claim.fhh.genetic-and-family-confirmation"
    ],
    "sourceIds": [
      "source.sc.niddk-primary-hyperparathyroidism",
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the scoped stable, uncomplicated inherited-calcium phenotype with a recorded pathogenic confirmation; not a VUS, mutation-negative case, progressive change or coexisting PHPT.",
    "limitation": "PARAT/Fifth Workshop support the confirmed uncomplicated FHH management boundary; NIDDK supports biochemical diagnosis before localization. Duplicate Fifth Workshop source records are one publication. No negative gene result, uncertain variant, progressive disease, coexisting PHPT, cinacalcet indication/dose or localization test-performance rule is taught.",
    "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
];
