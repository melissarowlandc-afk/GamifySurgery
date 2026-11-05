import type { EvidenceClaim } from "./pilot-schema";

/** Offline mappings. Original source dates retained; explicit extensions remain held. */
export const QUESTION_FLAGS2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = [
  {
    "id": "claim.flags2.20261105.g01.application",
    "statement": "In the represented short, nonemergency ITP course, relapse and returned negative viral serology do not remove the reason to defer elective splenectomy.",
    "basisClaimIds": [
      "claim.persistent-itp.hiv-hcv-secondary-evaluation",
      "claim.persistent-itp.defer-elective-splenectomy",
      "claim.elective-splenectomy.vaccine-review-14-days-if-possible"
    ],
    "sourceIds": [
      "source.board.itp-consensus-2019",
      "source.board.itp-ash-2026",
      "source.splenectomy.cdc-altered-immunocompetence.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "The eight retained siblings key HIV/HCV evaluation followed by deferral, never routine marrow testing. The diagnostic source record does not map marrow indications, and its publisher access was unavailable at the earlier check. The ASH record has a 2026 title/DOI but a URL ending 0824; its bibliographic identity needs verification. No source conflict is established offline. Do not claim agreement on a universal marrow sequence. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Verify the ITP consensus marrow boundary and the existing ASH bibliographic identity before manager acceptance. No network access was authorized for this milestone."
  },
  {
    "id": "claim.flags2.20261105.timing-versus-diagnostic-completion",
    "statement": "In the represented stable, several-month ITP course, completing secondary-cause testing does not itself satisfy the separate timing rationale for elective splenectomy.",
    "basisClaimIds": [
      "claim.persistent-itp.hiv-hcv-secondary-evaluation",
      "claim.persistent-itp.defer-elective-splenectomy"
    ],
    "sourceIds": [
      "source.board.itp-consensus-2019",
      "source.board.itp-ash-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Logical application of the two recorded claims, not a new universal marrow-testing algorithm. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Verify the ITP consensus marrow boundary and the existing ASH bibliographic identity before manager acceptance. No network access was authorized for this milestone."
  },
  {
    "id": "claim.flags2.20261105.g02.application",
    "statement": "For the represented familial MH risk, the proposed propofol/remifentanil/rocuronium regimen is the nontriggering option.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Existing JSA/EMHG records support suspected-susceptibility planning, but the original atomic mapping did not specify individual drugs, contracture-test family history or prior uneventful exposure. No anaesthesia protocol, dose or workstation preparation rule is invented. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Directly align prior-exposure and named-agent facts to the recorded permitted MH guidance, and obtain clinician review, before acceptance."
  },
  {
    "id": "claim.flags2.20261105.mh-prior-exposure",
    "statement": "A prior uncomplicated anaesthetic does not establish that a person with a credible first-degree MH-susceptibility history is free of that risk.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Extension from the recorded guidance covering suspected as well as confirmed susceptibility; direct alignment of the prior-exposure statement requires verification. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Directly align prior-exposure and named-agent facts to the recorded permitted MH guidance, and obtain clinician review, before acceptance."
  },
  {
    "id": "claim.flags2.20261105.mh-volatile-trigger",
    "statement": "Sevoflurane is a volatile anaesthetic MH trigger.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Named-agent application; direct alignment is held. No dose, workstation protocol or crisis algorithm is supplied. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Directly align prior-exposure and named-agent facts to the recorded permitted MH guidance, and obtain clinician review, before acceptance."
  },
  {
    "id": "claim.flags2.20261105.mh-relaxant-trigger",
    "statement": "Succinylcholine is a depolarizing neuromuscular blocker that can trigger MH.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Named-agent application; direct alignment is held. No rapid-sequence protocol or dose is supplied. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Directly align prior-exposure and named-agent facts to the recorded permitted MH guidance, and obtain clinician review, before acceptance."
  },
  {
    "id": "claim.flags2.20261105.mh-nontriggering-regimen",
    "statement": "Propofol, remifentanil and rocuronium are nontriggering agents in the proposed general-anaesthetic regimen.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Named-regimen application; direct named-agent alignment is held. A full anaesthetic prescription or workstation preparation rule is not supplied. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Directly align prior-exposure and named-agent facts to the recorded permitted MH guidance, and obtain clinician review, before acceptance."
  },
  {
    "id": "claim.flags2.20261105.g05.application",
    "statement": "The represented patient remains eligible for age-based parathyroid surgical assessment despite normal skeletal findings.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.age-under-50-surgery",
      "claim.asymptomatic-phpt.three-site-dxa"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "The existing single Fifth Workshop guideline supports the age and DXA facts. The mention of cinacalcet is a competing nonoperative pathway, not an endorsed regimen; no dose or initiation threshold is taught. Obtain clinician confirmation of option parity and management fit. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.phpt-parallel-assessment",
    "statement": "A normal DXA result does not remove the independent age-under-50 surgical criterion in primary hyperparathyroidism.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.age-under-50-surgery",
      "claim.asymptomatic-phpt.three-site-dxa"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Independent synthesis of two already-recorded Fifth Workshop statements; no new surgical threshold, age-dependent bone-density cutoff or requirement to delay referral is added. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.phpt-cinacalcet-role",
    "statement": "Cinacalcet is a calcium-lowering medical option in primary hyperparathyroidism.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "New narrow mapping to the same Fifth Workshop guideline; original age claim does not itself establish a prescribing algorithm. Requires focused source-to-claim confirmation and clinician review. No dose, threshold or recommendation to start it in this patient is supplied. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.g05-staging.application",
    "statement": "Baseline skeletal assessment in confirmed primary hyperparathyroidism includes DXA at the lumbar spine, hip and distal one-third radius.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.three-site-dxa",
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "This linked task remains a foundational staging choice, not a new claim of moderate/hard difficulty. It is separated from the resident-level age/organ-assessment decision and flagged honestly for independent review. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.g06.application",
    "statement": "Collection in the pre-admission clinic makes that constructed audit cohort the relevant population for this positive-result calculation.",
    "basisClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence",
      "claim.gs028se.statistics.sensitivity-specificity",
      "claim.pancreatic-adenocarcinoma.body-tail-distal-pancreatectomy"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026",
      "source.pancreatic-cancer-multidisciplinary-consensus.2020",
      "source.nci-pdq.pancreatic-cancer-treatment.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Only statistical definitions and arithmetic are taught. No empirical MRSA performance estimate, universal screening policy, infection diagnosis, decolonization regimen or individualized probability is asserted. Recorded CDC/FDA metadata reused offline; underlying reference dates retained. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.ppv-pre-admission",
    "statement": "The constructed pre-admission positive predictive value is 45/(45+19), approximately 70%.",
    "basisClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Original constructed counts and direct mathematical derivation, not an empirical MRSA estimate. Culture is the stipulated reference classification for this exercise. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.ppv-intensive-care",
    "statement": "The constructed ICU positive predictive value is 180/(180+16), approximately 92%.",
    "basisClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Original constructed counts and direct mathematical derivation; no transfer of this proportion to another clinical population is asserted. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.ppv-fixed-sensitivity",
    "statement": "Each constructed cohort has sensitivity 90%, calculated among reference-positive cases.",
    "basisClaimIds": [
      "claim.gs028se.statistics.sensitivity-specificity"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "A mathematical property of the displayed counts, not an assay-performance estimate. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.ppv-fixed-specificity",
    "statement": "Each constructed cohort has specificity 98%, calculated among reference-negative cases.",
    "basisClaimIds": [
      "claim.gs028se.statistics.sensitivity-specificity"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "A mathematical property of the displayed counts, not an assay-performance estimate. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.ppv-cohort-prevalence",
    "statement": "The constructed reference-positive fractions are 5% in pre-admission specimens and 20% in ICU specimens.",
    "basisClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence"
    ],
    "sourceIds": [
      "source.cdc.test-accuracy.2026",
      "source.fda.predictive-values.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "Original teaching counts yield these fractions; they are not MRSA-prevalence estimates or screening-policy guidance. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline derivation/application of recorded facts; clinician review remains required."
  },
  {
    "id": "claim.flags2.20261105.g07.application",
    "statement": "For this limited-aspirate neck-node case, the intended next image-guided sample is a core of the peripheral solid component.",
    "basisClaimIds": [
      "claim.ptld.tissue",
      "claim.gs028f.neck.core-biopsy-alternative"
    ],
    "sourceIds": [
      "source.ptld.ast-2019",
      "source.ptld.frontiers-review-2026",
      "source.gs028f.uk.head-neck-guidelines.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "The original source claim deliberately excluded biopsy technique. A separate recorded neck-mass core claim supports selected tissue/ancillary needs, not a universal PTLD biopsy rule. The combined technique/target application needs direct source-to-claim and clinician confirmation; excisional biopsy remains a possible broader pathway outside this scoped image-guided request. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Verify PTLD-specific adequacy and target/method preference against the recorded permitted guideline/review before acceptance. A neck guideline is not independent corroboration of every PTLD-specific extension."
  },
  {
    "id": "claim.flags2.20261105.ptld-target-and-method",
    "statement": "When a transplant recipient's limited neck-node aspirate leaves tissue classification unresolved, selected core sampling can provide tissue; in this constructed heterogeneous node, the solid vascular portion is the intended representative target rather than the central fluid/debris component.",
    "basisClaimIds": [
      "claim.ptld.tissue",
      "claim.gs028f.neck.core-biopsy-alternative"
    ],
    "sourceIds": [
      "source.ptld.ast-2019",
      "source.ptld.frontiers-review-2026",
      "source.gs028f.uk.head-neck-guidelines.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.",
    "limitation": "PTLD classification and selected neck-core principles are recorded. The combined target/method recommendation is a new application; direct PTLD-specific tissue-method/target alignment remains held. Do not generalize core sampling as preferable to excision in all PTLD workups. Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Verify PTLD-specific adequacy and target/method preference against the recorded permitted guideline/review before acceptance. A neck guideline is not independent corroboration of every PTLD-specific extension."
  }
];
