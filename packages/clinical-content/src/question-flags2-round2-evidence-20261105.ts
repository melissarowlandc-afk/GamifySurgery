import type { EvidenceClaim } from "./pilot-schema";

/** Offline atomic mappings with explicit keyed-extension holds. */
export const QUESTION_FLAGS2_ROUND2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = [
  {
    "id": "claim.flags2r2.20261105.changed-cytopenia-boundary",
    "statement": "New anemia, neutropenia and altered blood-cell morphology during follow-up require diagnostic reassessment rather than automatic attribution to previously isolated ITP.",
    "basisClaimIds": [
      "claim.persistent-itp.hiv-hcv-secondary-evaluation"
    ],
    "sourceIds": [
      "source.board.itp-consensus-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: directly verify the ITP-consensus changed-cytopenia/marrow boundary and comparative workup with hematology before acceptance. The existing claim covers isolated-thrombocytopenia evaluation, not this full marrow-versus-flow-versus-sequencing ranking. No exact one-year rule or automatic HIV/HCV-to-marrow sequence is taught. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.marrow-versus-blood-studies",
    "statement": "For the constructed multilineage/morphology change, marrow aspiration and trephine examination are the intended next investigation; blood flow or myeloid sequencing may contribute but do not replace that assessment.",
    "basisClaimIds": [
      "claim.persistent-itp.hiv-hcv-secondary-evaluation"
    ],
    "sourceIds": [
      "source.board.itp-consensus-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: directly verify the ITP-consensus changed-cytopenia/marrow boundary and comparative workup with hematology before acceptance. The existing claim covers isolated-thrombocytopenia evaluation, not this full marrow-versus-flow-versus-sequencing ranking. No exact one-year rule or automatic HIV/HCV-to-marrow sequence is taught. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.mh-family-panel-boundary",
    "statement": "A prior uneventful anesthetic and a negative gene panel without an identified familial causative variant do not establish absence of familial MH susceptibility.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: align negative-panel/prior-exposure interpretation, named agents, preparation premise, surgery-before-testing and dantrolene-prophylaxis ranking directly with the recorded JSA/EMHG guidance before acceptance. No new dose, preparation duration, flush protocol or guarantee from a checklist is authored. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.mh-testing-not-prerequisite",
    "statement": "With an appropriate nontriggering anesthetic and facility preparation, susceptibility testing can be pursued separately rather than made a prerequisite to the planned operation.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: align negative-panel/prior-exposure interpretation, named agents, preparation premise, surgery-before-testing and dantrolene-prophylaxis ranking directly with the recorded JSA/EMHG guidance before acceptance. No new dose, preparation duration, flush protocol or guarantee from a checklist is authored. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.mh-no-routine-prophylaxis",
    "statement": "Prophylactic dantrolene is not the intended routine addition to the represented nontriggering anesthetic plan.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: align negative-panel/prior-exposure interpretation, named agents, preparation premise, surgery-before-testing and dantrolene-prophylaxis ranking directly with the recorded JSA/EMHG guidance before acceptance. No new dose, preparation duration, flush protocol or guarantee from a checklist is authored. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.mh-named-plan",
    "statement": "Propofol, remifentanil and rocuronium form the proposed nontriggering drug components; the worksheet also specifies MH workstation and crisis-response preparation.",
    "basisClaimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceIds": [
      "source.jsa.malignant-hyperthermia.2026",
      "source.emhg.mh-susceptible.2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: align negative-panel/prior-exposure interpretation, named agents, preparation premise, surgery-before-testing and dantrolene-prophylaxis ranking directly with the recorded JSA/EMHG guidance before acceptance. No new dose, preparation duration, flush protocol or guarantee from a checklist is authored. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.breast-acquisition-site",
    "statement": "The complete recorded ultrasound acquisition at a separate palpable marker does not establish sonographic evaluation of the current persistent clinical site.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "One adequate recorded ACR guideline directly supports targeted ultrasound at the persistent mammographically occult clinical site. The complete two-site acquisition record supplies the logical distinction from archive retrieval; no inference is made from a missing export alone. Protocol realism and option ranking still need clinical review, but this is not a new unsupported imaging rule or a fresh source verification. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline logical application of recorded claims with their original source limitations. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.breast-repeat-versus-retrieve",
    "statement": "When the complete acquisition record addresses a different site, obtaining targeted imaging at the current finding answers a different adequacy question from retrieving those archived images.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "One adequate recorded ACR guideline directly supports targeted ultrasound at the persistent mammographically occult clinical site. The complete two-site acquisition record supplies the logical distinction from archive retrieval; no inference is made from a missing export alone. Protocol realism and option ranking still need clinical review, but this is not a new unsupported imaging rule or a fresh source verification. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline logical application of recorded claims with their original source limitations. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.pregnancy-falling-hcg-boundary",
    "statement": "A falling but still detectable hCG concentration does not establish an intrauterine location or exclude an ectopic pregnancy in this symptomatic case.",
    "basisClaimIds": [
      "claim.gs028f.pregnancy.early-negative-limit",
      "claim.gs028f.ectopic.symptoms-require-assessment",
      "claim.gs028f.ectopic.hcg-does-not-locate"
    ],
    "sourceIds": [
      "source.gs028f.nlm.pregnancy-test.2025",
      "source.gs028f.qld.early-pregnancy-loss.2025",
      "source.gs028f.nhs.ectopic-pregnancy.2022",
      "source.gs028f.nlm.ectopic-pregnancy"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: verify the falling-hCG/location boundary, exact transvaginal acquisition and priority over the two offered diagnostic pathways directly with the recorded early-pregnancy guidance before acceptance. No hCG discriminatory threshold, repeat interval, methotrexate rule or definitive ectopic diagnosis is invented. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.pregnancy-localization-before-disposition",
    "statement": "With worsening focal symptoms, spotting and the supplied unlocated pregnancy record, prompt gynecologic assessment with appropriate pelvic ultrasonography is intended before assigning an outpatient miscarriage pathway or an appendiceal explanation.",
    "basisClaimIds": [
      "claim.gs028f.pregnancy.early-negative-limit",
      "claim.gs028f.ectopic.symptoms-require-assessment",
      "claim.gs028f.ectopic.hcg-does-not-locate"
    ],
    "sourceIds": [
      "source.gs028f.nlm.pregnancy-test.2025",
      "source.gs028f.qld.early-pregnancy-loss.2025",
      "source.gs028f.nhs.ectopic-pregnancy.2022",
      "source.gs028f.nlm.ectopic-pregnancy"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: verify the falling-hCG/location boundary, exact transvaginal acquisition and priority over the two offered diagnostic pathways directly with the recorded early-pregnancy guidance before acceptance. No hCG discriminatory threshold, repeat interval, methotrexate rule or definitive ectopic diagnosis is invented. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.pregnancy-modality-ranking",
    "statement": "The intended same-day first plan is transvaginal ultrasound with gynecologic assessment rather than appendiceal MRI or diagnostic uterine aspiration under these observations.",
    "basisClaimIds": [
      "claim.gs028f.pregnancy.early-negative-limit",
      "claim.gs028f.ectopic.symptoms-require-assessment",
      "claim.gs028f.ectopic.hcg-does-not-locate"
    ],
    "sourceIds": [
      "source.gs028f.nlm.pregnancy-test.2025",
      "source.gs028f.qld.early-pregnancy-loss.2025",
      "source.gs028f.nhs.ectopic-pregnancy.2022",
      "source.gs028f.nlm.ectopic-pregnancy"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: verify the falling-hCG/location boundary, exact transvaginal acquisition and priority over the two offered diagnostic pathways directly with the recorded early-pregnancy guidance before acceptance. No hCG discriminatory threshold, repeat interval, methotrexate rule or definitive ectopic diagnosis is invented. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.phpt-native-hip-acquisition",
    "statement": "The intended baseline hip DXA acquisition in this constructed arthroplasty record is the native contralateral hip, not the region containing the prosthetic joint.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.three-site-dxa",
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: align the native-versus-prosthetic hip DXA selection and exact radial-region comparison with permitted densitometry guidance before acceptance. The recorded Fifth Workshop claim directly supports the three sites, but does not independently verify every hardware/ROI detail. The operative referral was already ordered, not conditional on DXA. This orders the regions of an already-requested baseline study during a provisional PHPT workup; it does not mandate DXA for confirmed FHH. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.phpt-radial-region",
    "statement": "The PHPT baseline forearm site is the distal one-third radius; an ultradistal radial measurement is not the same acquisition.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.three-site-dxa",
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: align the native-versus-prosthetic hip DXA selection and exact radial-region comparison with permitted densitometry guidance before acceptance. The recorded Fifth Workshop claim directly supports the three sites, but does not independently verify every hardware/ROI detail. The operative referral was already ordered, not conditional on DXA. This orders the regions of an already-requested baseline study during a provisional PHPT workup; it does not mandate DXA for confirmed FHH. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.phpt-parallel-referral",
    "statement": "The requested baseline skeletal characterization does not have to confer eligibility before the operative consultation pathway begins.",
    "basisClaimIds": [
      "claim.asymptomatic-phpt.three-site-dxa",
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: align the native-versus-prosthetic hip DXA selection and exact radial-region comparison with permitted densitometry guidance before acceptance. The recorded Fifth Workshop claim directly supports the three sites, but does not independently verify every hardware/ROI detail. The operative referral was already ordered, not conditional on DXA. This orders the regions of an already-requested baseline study during a provisional PHPT workup; it does not mandate DXA for confirmed FHH. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.phpt-fhh-ratio-boundary",
    "statement": "A calcium-to-creatinine clearance ratio below 0.01 supports suspicion for FHH but does not confirm it; the constructed collection and renal/vitamin-D/thiazide context are supplied to make that observation interpretable.",
    "basisClaimIds": [
      "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
      "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation",
      "claim.fhh.low-cccr-supports-but-does-not-confirm",
      "claim.fhh.genetic-and-family-confirmation",
      "claim.primary-hyperparathyroidism.biochemical-pattern",
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
      "source.sc.niddk-primary-hyperparathyroidism",
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Recorded PARAT consensus and Fifth Workshop claims directly support the inherited pattern, the exact ratio boundary, its limitations and genetic/family evaluation. Duplicate source IDs for the Fifth Workshop are one publication, not independent corroboration. The new case is a provisional calcium–PTH workup, not a statement that confirmed PHPT should wait for an abnormal DXA. No fresh source access, genetic-test sensitivity, malignancy algorithm or empiric drug regimen is asserted. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline logical application of recorded claims with their original source limitations. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.phpt-inherited-before-localization",
    "statement": "Suggestive longstanding family biochemistry and relative hypocalciuria support genetic/family evaluation before localization is treated as the remaining PHPT operative step.",
    "basisClaimIds": [
      "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
      "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation",
      "claim.fhh.low-cccr-supports-but-does-not-confirm",
      "claim.fhh.genetic-and-family-confirmation",
      "claim.primary-hyperparathyroidism.biochemical-pattern",
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
      "source.sc.niddk-primary-hyperparathyroidism",
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Recorded PARAT consensus and Fifth Workshop claims directly support the inherited pattern, the exact ratio boundary, its limitations and genetic/family evaluation. Duplicate source IDs for the Fifth Workshop are one publication, not independent corroboration. The new case is a provisional calcium–PTH workup, not a statement that confirmed PHPT should wait for an abnormal DXA. No fresh source access, genetic-test sensitivity, malignancy algorithm or empiric drug regimen is asserted. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline logical application of recorded claims with their original source limitations. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.phpt-diagnosis-before-age-criterion",
    "statement": "Age under 50 and normal skeletal assessment do not resolve the diagnostic distinction between PHPT and an inherited calcium-sensing disorder; the operative age criterion applies to established PHPT.",
    "basisClaimIds": [
      "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
      "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation",
      "claim.fhh.low-cccr-supports-but-does-not-confirm",
      "claim.fhh.genetic-and-family-confirmation",
      "claim.primary-hyperparathyroidism.biochemical-pattern",
      "claim.asymptomatic-phpt.age-under-50-surgery"
    ],
    "sourceIds": [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
      "source.sc.niddk-primary-hyperparathyroidism",
      "source.board.phpt-fifth-workshop-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Recorded PARAT consensus and Fifth Workshop claims directly support the inherited pattern, the exact ratio boundary, its limitations and genetic/family evaluation. Duplicate source IDs for the Fifth Workshop are one publication, not independent corroboration. The new case is a provisional calcium–PTH workup, not a statement that confirmed PHPT should wait for an abnormal DXA. No fresh source access, genetic-test sensitivity, malignancy algorithm or empiric drug regimen is asserted. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline logical application of recorded claims with their original source limitations. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.ptld-limited-aspirate-classification",
    "statement": "EBV detection in blood or scattered aspirated cells does not replace representative tissue classification of the suspected post-transplant lymphoid process.",
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
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: directly verify accessible-node excision versus a well-planned core and the fresh/fixed tissue allocation with permitted PTLD/lymphoma guidance and hematopathology before acceptance. Existing PTLD/neck-core claims do not independently establish every technique or laboratory-processing preference. No universal core-versus-excision rule is claimed. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.ptld-excision-versus-core",
    "statement": "For the constructed accessible supraclavicular node and unresolved tissue classification, excisional sampling is the intended plan; core remains a legitimate alternative when excision is not appropriate.",
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
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: directly verify accessible-node excision versus a well-planned core and the fresh/fixed tissue allocation with permitted PTLD/lymphoma guidance and hematopathology before acceptance. Existing PTLD/neck-core claims do not independently establish every technique or laboratory-processing preference. No universal core-versus-excision rule is claimed. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  },
  {
    "id": "claim.flags2r2.20261105.ptld-fresh-fixed-handling",
    "statement": "A plan for both fresh and fixed tissue is intended to support unresolved flow studies and histology; fixation of the entire new specimen does not supply the planned fresh-cell analysis.",
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
    "applicablePopulation": "Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.",
    "limitation": "Key hold: directly verify accessible-node excision versus a well-planned core and the fresh/fixed tissue allocation with permitted PTLD/lymphoma guidance and hematopathology before acceptance. Existing PTLD/neck-core claims do not independently establish every technique or laboratory-processing preference. No universal core-versus-excision rule is claimed. Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.",
    "lastCheckedOn": "2026-11-05",
    "contentVersion": "evidence.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline source/claim consistency only; source-verification hold on the new keyed application. No source retrieval or refreshed access date."
  }
];
