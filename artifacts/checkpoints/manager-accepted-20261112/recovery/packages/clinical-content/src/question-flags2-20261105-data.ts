import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Retained candidates, never ship-manifest acceptance or clinical sign-off. */
export const QUESTION_FLAGS2_DEFINITIONS: QuestionBankBatch2aRevision[] = [
  {
    "id": "revision.flags2.20261105.g01",
    "auditId": "G01",
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "previousQuestionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-09-12.1"
    ],
    "previousStem": "With {patientName}'s several-month persistent ITP, no major bleeding, and feasible medical care, which plan fits?",
    "previousChoiceLabels": [
      "Defer elective splenectomy",
      "Schedule elective splenectomy now",
      "Arrange bone marrow evaluation before deciding on surgery",
      "Repeat viral serology before planning"
    ],
    "previousCurrentUpdate": "HIV and hepatitis-C testing are negative; the evaluation remains compatible with presumed primary ITP after the broader clinical review.",
    "previousExhibit": null,
    "currentUpdate": "The returned HIV and hepatitis-C serology is negative. Platelet counts since the relapse have remained above 30 × 10^9/L. Bruises have recurred, but there has been no mucosal or internal bleeding. Hematology is continuing treatment and follow-up; {patientName} asks about an operation after the relapse.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the relapse in relation to the short disease duration and current bleeding course. Then: Keep the surgical-timing decision separate from diagnostic testing or completion of operative preparation.",
    "reviewerNotes": "The eight retained siblings key HIV/HCV evaluation followed by deferral, never routine marrow testing. The diagnostic source record does not map marrow indications, and its publisher access was unavailable at the earlier check. The ASH record has a 2026 title/DOI but a URL ending 0824; its bibliographic identity needs verification. No source conflict is established offline. Do not claim agreement on a universal marrow sequence.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "defer_3": "defer_3",
      "choice.flags2.20261105.g01.d1": "immediate_3",
      "choice.flags2.20261105.g01.d2": "bone_marrow_3"
    },
    "choiceServiceOverrides": {
      "defer_3": null,
      "choice.flags2.20261105.g01.d1": null,
      "choice.flags2.20261105.g01.d2": null
    },
    "choiceTimingOverrides": {
      "defer_3": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g01.d1": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g01.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.bone_marrow"
      }
    },
    "question": {
      "id": "question.persistent-itp.defer-elective-splenectomy.v3.r1",
      "conceptId": "concept.persistent-itp.defer-elective-splenectomy",
      "stem": "Which plan should be recommended for {patientName}'s splenectomy consultation?",
      "answerChoices": [
        {
          "id": "defer_3",
          "label": "Continue treatment; reassess elective splenectomy when disease duration reaches a year",
          "isCorrect": true,
          "rationale": "This remains an early persistent course. In this nonemergency presentation, ongoing treatment and reassessment are preferable to committing to early elective splenectomy; the recorded ASH claim supports waiting at least a year when possible.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2.20261105.g01.d1",
          "label": "Arrange vaccination; schedule splenectomy after preoperative immunization is complete",
          "isCorrect": false,
          "distractorRationale": "Vaccination is relevant when an operation is selected, but completing it does not resolve whether elective splenectomy is appropriate at this early point. This choice turns preparation for surgery into its indication."
        },
        {
          "id": "choice.flags2.20261105.g01.d2",
          "label": "Arrange marrow sampling; schedule splenectomy after the pathology report returns",
          "isCorrect": false,
          "distractorRationale": "A marrow result would not itself resolve the early elective-surgery timing issue. This is not a claim that marrow evaluation is never appropriate: a separate indication requires its own assessment, and negative HIV/HCV results do not mandate a universal marrow-then-surgery sequence."
        }
      ],
      "explanation": "This remains an early persistent course. In this nonemergency presentation, ongoing treatment and reassessment are preferable to committing to early elective splenectomy; the recorded ASH claim supports waiting at least a year when possible. Vaccination is relevant when an operation is selected, but completing it does not resolve whether elective splenectomy is appropriate at this early point. This choice turns preparation for surgery into its indication. A marrow result would not itself resolve the early elective-surgery timing issue. This is not a claim that marrow evaluation is never appropriate: a separate indication requires its own assessment, and negative HIV/HCV results do not mandate a universal marrow-then-surgery sequence.",
      "teachingPoint": "This remains an early persistent course. In this nonemergency presentation, ongoing treatment and reassessment are preferable to committing to early elective splenectomy; the recorded ASH claim supports waiting at least a year when possible.",
      "supportingEvidenceClaimIds": [
        "claim.persistent-itp.hiv-hcv-secondary-evaluation",
        "claim.persistent-itp.defer-elective-splenectomy",
        "claim.elective-splenectomy.vaccine-review-14-days-if-possible",
        "claim.flags2.20261105.g01.application",
        "claim.flags2.20261105.timing-versus-diagnostic-completion"
      ],
      "contentVersion": "clinical.question-flags2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.persistent-itp.defer-elective-splenectomy",
      "nextConceptId": "concept.persistent-itp.defer-elective-splenectomy",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Retain the clinical objective and historical FSRS concept; wording, patient observations and option structure revised."
    },
    "ownerProgramReview": {
      "ownerItemId": "G01",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Audited all eight ITP siblings. Removed the implied universal marrow-after-viral-screening ladder and the repeated-serology foil. The two wrong sequences both prematurely convert completed preparation into a surgical indication.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
    "previousPresentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed.",
    "previousProfilePresentations": [
      {
        "id": "profile.persistent-itp.hematology-followup.female.57",
        "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.57",
        "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
      },
      {
        "id": "profile.persistent-itp.hematology-followup.female.55",
        "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.55",
        "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.persistent-itp.hematology-followup",
        "patientPresentationVariantId": "presentation.persistent-itp.hematology-followup",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Low platelet surgical consultation",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 57,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2.20261105.",
      "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1"
    },
    "chiefComplaint": "Splenectomy consultation",
    "previousChiefComplaint": "Low platelet surgical consultation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.persistent-itp.hematology-followup.female.57"
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.57"
      },
      {
        "id": "profile.persistent-itp.hematology-followup.female.55"
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.55"
      }
    ]
  },
  {
    "id": "revision.flags2.20261105.g02",
    "auditId": "G02",
    "caseId": "case.gs028d.anesthesia.b-family-testing-record",
    "nodeId": "node.gs028d.anesthesia.b-family-testing-record.1",
    "previousQuestionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which action best incorporates this information into surgical planning?",
    "previousChoiceLabels": [
      "Request trigger-free planning",
      "Ignore family-linked documentation",
      "Select a trigger-containing anesthetic",
      "Give crisis medication in clinic now"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish a prior uneventful exposure from an assessment of familial susceptibility. Then: Check both the maintenance drug and intubating relaxant in the proposed regimen.",
    "reviewerNotes": "Existing JSA/EMHG records support suspected-susceptibility planning, but the original atomic mapping did not specify individual drugs, contracture-test family history or prior uneventful exposure. No anaesthesia protocol, dose or workstation preparation rule is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.flags2.20261105.g02.d1": "d1_2",
      "choice.flags2.20261105.g02.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.flags2.20261105.g02.d1": null,
      "choice.flags2.20261105.g02.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g02.d1": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g02.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r1",
      "conceptId": "concept.mh.family-history-and-regimen-components.v1",
      "stem": "Which general-anaesthetic regimen should be proposed for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Propofol infusion with remifentanil; rocuronium for intubation",
          "isCorrect": true,
          "rationale": "The first-degree family result warrants managing the patient as potentially susceptible until assessed. An uncomplicated previous exposure does not establish absence of susceptibility. This regimen avoids both volatile anaesthetics and succinylcholine.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2.20261105.g02.d1",
          "label": "Sevoflurane maintenance with fentanyl; cisatracurium for intubation",
          "isCorrect": false,
          "distractorRationale": "This is a familiar anaesthetic regimen and reproduces a drug previously tolerated, but sevoflurane remains an MH trigger. A prior uneventful anaesthetic does not clear the family-history risk."
        },
        {
          "id": "choice.flags2.20261105.g02.d2",
          "label": "Propofol infusion with fentanyl; succinylcholine for intubation",
          "isCorrect": false,
          "distractorRationale": "Intravenous maintenance can be suitable, but the induction/intubation component also matters: succinylcholine remains a trigger. A plan is not made trigger-free merely by replacing the maintenance agent."
        }
      ],
      "explanation": "The first-degree family result warrants managing the patient as potentially susceptible until assessed. An uncomplicated previous exposure does not establish absence of susceptibility. This regimen avoids both volatile anaesthetics and succinylcholine. This is a familiar anaesthetic regimen and reproduces a drug previously tolerated, but sevoflurane remains an MH trigger. A prior uneventful anaesthetic does not clear the family-history risk. Intravenous maintenance can be suitable, but the induction/intubation component also matters: succinylcholine remains a trigger. A plan is not made trigger-free merely by replacing the maintenance agent.",
      "teachingPoint": "The first-degree family result warrants managing the patient as potentially susceptible until assessed. An uncomplicated previous exposure does not establish absence of susceptibility. This regimen avoids both volatile anaesthetics and succinylcholine.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.mh.trigger-free-plan",
        "claim.flags2.20261105.g02.application",
        "claim.flags2.20261105.mh-prior-exposure",
        "claim.flags2.20261105.mh-volatile-trigger",
        "claim.flags2.20261105.mh-relaxant-trigger",
        "claim.flags2.20261105.mh-nontriggering-regimen"
      ],
      "contentVersion": "clinical.question-flags2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
      "nextConceptId": "concept.mh.family-history-and-regimen-components.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The old task scored transmission of already-established susceptibility. This version scores interpretation of family history and prior exposure plus drug-class application; keep the old communication concept for frozen encounters/FSRS."
    },
    "ownerProgramReview": {
      "ownerItemId": "G02",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Pulled the exact v2 owner flag into this batch; the v4 queue sibling remains queued separately. Replaced ignore-the-record/crisis-in-clinic foils with actual drug regimens and an exposure-history misconception.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
    "previousPresentation": "{patientName}, a 35-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.35",
        "presentation": "{patientName}, a 35-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.35",
        "presentation": "{patientName}, a 35-year-old man, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.60",
        "presentation": "{patientName}, a 60-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.60",
        "presentation": "{patientName}, a 60-year-old man, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2.20261105.",
      "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1"
    },
    "chiefComplaint": "Colectomy anesthesia review",
    "previousChiefComplaint": "Family MH history",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.35"
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.35"
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.60"
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.60"
      }
    ]
  },
  {
    "id": "revision.flags2.20261105.g05",
    "auditId": "G05",
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "previousQuestionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Given {patientName}'s confirmed disease and completed skeletal assessment, which next management approach is appropriate?",
    "previousChoiceLabels": [
      "Refer for parathyroid surgical assessment",
      "Continue observation because no complication was found",
      "Obtain neck ultrasound before discussing surgery",
      "Refer only for bone-health follow-up"
    ],
    "previousCurrentUpdate": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
    "previousExhibit": null,
    "currentUpdate": "The completed spine, hip and distal-radius bone-density measurements are within the age-appropriate reference range. {patientName} has no hypercalcemic symptoms.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the normal skeletal and renal findings as an absence of demonstrated organ complications. Then: Apply the separate age criterion rather than treating normal DXA as a reason to cancel operative assessment.",
    "reviewerNotes": "The existing single Fifth Workshop guideline supports the age and DXA facts. The mention of cinacalcet is a competing nonoperative pathway, not an endorsed regimen; no dose or initiation threshold is taught. Obtain clinician confirmation of option parity and management fit.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "surgical_assessment_1": "surgical_assessment_1",
      "choice.flags2.20261105.g05.d1": "observe_only_1",
      "choice.flags2.20261105.g05.d2": "localize_first_1"
    },
    "choiceServiceOverrides": {
      "surgical_assessment_1": null,
      "choice.flags2.20261105.g05.d1": null,
      "choice.flags2.20261105.g05.d2": null
    },
    "choiceTimingOverrides": {
      "surgical_assessment_1": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g05.d1": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g05.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.asymptomatic-phpt.age-based-surgery.v1.r1",
      "conceptId": "concept.asymptomatic-phpt.age-based-surgery",
      "stem": "Which management recommendation should be made for {patientName}?",
      "answerChoices": [
        {
          "id": "surgical_assessment_1",
          "label": "Recommend parathyroidectomy through endocrine surgery",
          "isCorrect": true,
          "rationale": "The patient remains younger than 50 in every retained presentation profile. That independent guideline criterion supports parathyroidectomy even when skeletal and renal assessment shows no complication. DXA characterizes baseline skeletal status; it does not create the age-based indication or have to become abnormal first.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2.20261105.g05.d1",
          "label": "Recommend biochemical surveillance through endocrinology follow-up",
          "isCorrect": false,
          "distractorRationale": "Monitoring is a genuine pathway when surgery is not selected, but normal organ assessment does not remove the independent age-based criterion in this patient. No contraindication or refusal of surgery has been introduced."
        },
        {
          "id": "choice.flags2.20261105.g05.d2",
          "label": "Recommend cinacalcet therapy through endocrinology follow-up",
          "isCorrect": false,
          "distractorRationale": "A named calcium-lowering medical pathway is more plausible than a generic bone-clinic foil. It does not replace discussion of an independently indicated operation in this represented, asymptomatic patient. This option teaches no medication dose or mandatory treatment algorithm."
        }
      ],
      "explanation": "The patient remains younger than 50 in every retained presentation profile. That independent guideline criterion supports parathyroidectomy even when skeletal and renal assessment shows no complication. DXA characterizes baseline skeletal status; it does not create the age-based indication or have to become abnormal first. Monitoring is a genuine pathway when surgery is not selected, but normal organ assessment does not remove the independent age-based criterion in this patient. No contraindication or refusal of surgery has been introduced. A named calcium-lowering medical pathway is more plausible than a generic bone-clinic foil. It does not replace discussion of an independently indicated operation in this represented, asymptomatic patient. This option teaches no medication dose or mandatory treatment algorithm.",
      "teachingPoint": "The patient remains younger than 50 in every retained presentation profile. That independent guideline criterion supports parathyroidectomy even when skeletal and renal assessment shows no complication. DXA characterizes baseline skeletal status; it does not create the age-based indication or have to become abnormal first.",
      "supportingEvidenceClaimIds": [
        "claim.asymptomatic-phpt.age-under-50-surgery",
        "claim.asymptomatic-phpt.three-site-dxa",
        "claim.flags2.20261105.g05.application",
        "claim.flags2.20261105.phpt-parallel-assessment",
        "claim.flags2.20261105.phpt-cinacalcet-role"
      ],
      "contentVersion": "clinical.question-flags2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.asymptomatic-phpt.age-based-surgery",
      "nextConceptId": "concept.asymptomatic-phpt.age-based-surgery",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Retain the clinical objective and historical FSRS concept; wording, patient observations and option structure revised."
    },
    "ownerProgramReview": {
      "ownerItemId": "G05",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Separated baseline skeletal characterization from surgical eligibility, with a linked first-node revision that requests DXA alongside the operative opinion. Removed the because-no-complication and bone-clinic foils; named both competing management pathways.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
    "previousPresentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well.",
    "previousProfilePresentations": [
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.47",
        "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.47",
        "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.46",
        "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.46",
        "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.asymptomatic-phpt.incidental-calcium",
        "patientPresentationVariantId": "presentation.asymptomatic-phpt.incidental-calcium",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "High calcium evaluation",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2.20261105.",
      "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1"
    },
    "chiefComplaint": "High calcium follow-up",
    "previousChiefComplaint": "High calcium evaluation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.47"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.47"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.46"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.46"
      }
    ]
  },
  {
    "id": "revision.flags2.20261105.g05-staging",
    "auditId": "G05-staging",
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "previousQuestionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "For {patientName}'s skeletal assessment, which study should be obtained now?",
    "previousChoiceLabels": [
      "DXA of spine, hip, and distal radius",
      "Single-site DXA of the lumbar spine alone",
      "Nuclear bone scan for occult skeletal disease",
      "Neck ultrasound for parathyroid localization"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "linked_baseline_assessment_not_a_hard_resident_item",
    "intendedInference": "Recognize that skeletal assessment characterizes organ involvement rather than establishes the already-present age criterion. Then: Select the guideline-specified baseline modality and sites.",
    "reviewerNotes": "This linked task remains a foundational staging choice, not a new claim of moderate/hard difficulty. It is separated from the resident-level age/organ-assessment decision and flagged honestly for independent review.",
    "contextCompanion": true,
    "basicRecallIntentional": true,
    "basicRecallJustification": "This linked task remains a foundational staging choice, not a new claim of moderate/hard difficulty. It is separated from the resident-level age/organ-assessment decision and flagged honestly for independent review.",
    "choiceSourceIds": {
      "three_site_dxa_1": "three_site_dxa_1",
      "choice.flags2.20261105.g05-staging.d1": "single_site_dxa_1",
      "choice.flags2.20261105.g05-staging.d2": "bone_scan_1"
    },
    "choiceServiceOverrides": {
      "three_site_dxa_1": "service.dxa",
      "choice.flags2.20261105.g05-staging.d1": null,
      "choice.flags2.20261105.g05-staging.d2": null
    },
    "choiceTimingOverrides": {
      "three_site_dxa_1": {
        "kind": "test",
        "timingProfileId": "timing.test.dxa"
      },
      "choice.flags2.20261105.g05-staging.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.advanced_diagnostic"
      },
      "choice.flags2.20261105.g05-staging.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      }
    },
    "question": {
      "id": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
      "conceptId": "concept.asymptomatic-phpt.three-site-dxa",
      "stem": "Which baseline skeletal study should be arranged alongside {patientName}'s operative consultation?",
      "answerChoices": [
        {
          "id": "three_site_dxa_1",
          "label": "Dual-energy X-ray absorptiometry at spine, hip and distal forearm",
          "isCorrect": true,
          "rationale": "The recorded Fifth Workshop recommendation includes the lumbar spine, hip and distal one-third radius. This assesses skeletal involvement while the independent operative indication is considered.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2.20261105.g05-staging.d1",
          "label": "Quantitative CT of the lumbar spine and hip",
          "isCorrect": false,
          "distractorRationale": "This is a named quantitative bone-density modality, but it does not supply the standard three-site DXA assessment represented by the guideline."
        },
        {
          "id": "choice.flags2.20261105.g05-staging.d2",
          "label": "Radionuclide bone scintigraphy of the axial skeleton",
          "isCorrect": false,
          "distractorRationale": "This is a named skeletal study, but it does not provide the specified baseline bone-density assessment at the guideline sites."
        }
      ],
      "explanation": "The recorded Fifth Workshop recommendation includes the lumbar spine, hip and distal one-third radius. This assesses skeletal involvement while the independent operative indication is considered. This is a named quantitative bone-density modality, but it does not supply the standard three-site DXA assessment represented by the guideline. This is a named skeletal study, but it does not provide the specified baseline bone-density assessment at the guideline sites.",
      "teachingPoint": "The recorded Fifth Workshop recommendation includes the lumbar spine, hip and distal one-third radius. This assesses skeletal involvement while the independent operative indication is considered.",
      "supportingEvidenceClaimIds": [
        "claim.asymptomatic-phpt.three-site-dxa",
        "claim.asymptomatic-phpt.age-under-50-surgery",
        "claim.flags2.20261105.g05-staging.application"
      ],
      "contentVersion": "clinical.question-flags2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.asymptomatic-phpt.three-site-dxa",
      "nextConceptId": "concept.asymptomatic-phpt.three-site-dxa",
      "previousKeyServiceId": "service.dxa",
      "nextKeyServiceId": "service.dxa",
      "previousResultGate": {
        "id": "gate.asymptomatic-phpt.dxa.1",
        "resultTypeId": "service.dxa",
        "pendingLabel": "External DXA assessment pending",
        "resultNarrative": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.dxa.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.asymptomatic-phpt.dxa.1",
        "resultTypeId": "service.dxa",
        "pendingLabel": "External DXA assessment pending",
        "resultNarrative": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.dxa.outsourced"
        ]
      },
      "reason": "Retain the clinical objective and historical FSRS concept; wording, patient observations and option structure revised."
    },
    "ownerProgramReview": {
      "ownerItemId": "G05",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Necessary linked repair in the same flagged case: made assessment concurrent with the operative opinion and removed the X-alone foil. Retained the existing DXA service/result gate, all original identities and the baseline-skeletal concept.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.flags2.20261105.g06",
    "auditId": "G06",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
    "previousQuestionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "How does the new investigational breast-cancer blood test's positive predictive value change between the hypothetical populations when sensitivity and specificity remain fixed as stated?",
    "previousChoiceLabels": [
      "Positive predictive value decreases",
      "Positive predictive value increases",
      "Positive predictive value stays fixed",
      "Positive predictive value is indeterminate"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Unnamed investigational pancreatic-cancer blood test: invented testing-population assumptions for practice. These comparisons supply no real test performance or personal disease probability.",
      "items": [
        {
          "label": "Sensitivity",
          "value": "Same in the two hypothetical populations"
        },
        {
          "label": "Specificity",
          "value": "Same in the two hypothetical populations"
        },
        {
          "label": "Prevalence",
          "value": "Lower in population B than in population A"
        }
      ]
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the testing population at specimen collection rather than the later care setting. Then: Compute reference-positive cases among all positive screens for that cohort.",
    "reviewerNotes": "Only statistical definitions and arithmetic are taught. No empirical MRSA performance estimate, universal screening policy, infection diagnosis, decolonization regimen or individualized probability is asserted. Recorded CDC/FDA metadata reused offline; underlying reference dates retained.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_lower-prevalence": "correct_lower-prevalence",
      "choice.flags2.20261105.g06.d1": "d1_lower-prevalence",
      "choice.flags2.20261105.g06.d2": "d2_lower-prevalence",
      "choice.flags2.20261105.g06.d3": "d3_lower-prevalence"
    },
    "choiceServiceOverrides": {
      "correct_lower-prevalence": null,
      "choice.flags2.20261105.g06.d1": null,
      "choice.flags2.20261105.g06.d2": null,
      "choice.flags2.20261105.g06.d3": null
    },
    "choiceTimingOverrides": {
      "correct_lower-prevalence": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g06.d1": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g06.d2": {
        "kind": "no_test"
      },
      "choice.flags2.20261105.g06.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.statistics-ethics.predictive-value-prevalence.v2.r1",
      "conceptId": "concept.predictive-value.collection-population-denominator.v1",
      "stem": "Using this audit, what approximate positive predictive value should be used for {patientName}'s reported PCR result?",
      "answerChoices": [
        {
          "id": "correct_lower-prevalence",
          "label": "About 70%",
          "isCorrect": true,
          "rationale": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2.20261105.g06.d1",
          "label": "About 92%",
          "isCorrect": false,
          "distractorRationale": "This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population."
        },
        {
          "id": "choice.flags2.20261105.g06.d2",
          "label": "About 90%",
          "isCorrect": false,
          "distractorRationale": "This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity."
        },
        {
          "id": "choice.flags2.20261105.g06.d3",
          "label": "About 5%",
          "isCorrect": false,
          "distractorRationale": "This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction."
        }
      ],
      "explanation": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%. This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population. This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity. This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction.",
      "teachingPoint": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%.",
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.predictive-value-prevalence",
        "claim.gs028se.statistics.sensitivity-specificity",
        "claim.pancreatic-adenocarcinoma.body-tail-distal-pancreatectomy",
        "claim.flags2.20261105.g06.application",
        "claim.flags2.20261105.ppv-pre-admission",
        "claim.flags2.20261105.ppv-intensive-care",
        "claim.flags2.20261105.ppv-fixed-sensitivity",
        "claim.flags2.20261105.ppv-fixed-specificity",
        "claim.flags2.20261105.ppv-cohort-prevalence"
      ],
      "contentVersion": "clinical.question-flags2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed local audit for this clinical numeracy exercise; counts are not published assay performance or prevalence estimates.",
        "columnHeaders": [
          "PCR positive / culture positive",
          "PCR positive / culture negative",
          "PCR negative / culture positive",
          "PCR negative / culture negative"
        ],
        "rowHeaders": [
          "Pre-admission clinic specimens",
          "ICU specimens"
        ],
        "cells": [
          [
            "45",
            "19",
            "5",
            "931"
          ],
          [
            "180",
            "16",
            "20",
            "784"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.statistics-ethics.predictive-value-prevalence",
      "nextConceptId": "concept.predictive-value.collection-population-denominator.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The old task asked only the direction of change under a supplied lower-prevalence label. This scores cohort selection and positive-result denominator calculation; retain the original direction-of-change concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "G06",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Pulled the exact v2 flag into this batch; the v3 queue sibling stays separately queued. Replaced a hypothetical cancer-test direction question and brochure slogan with a concrete preoperative PCR result, a coherent two-cohort audit and plausible denominator/cohort errors.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
    "previousPresentation": "{patientName}, a 67-year-old man, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67",
        "presentation": "{patientName}, a 67-year-old man, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
      },
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67",
        "presentation": "{patientName}, a 67-year-old woman, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
      },
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42",
        "presentation": "{patientName}, a 42-year-old man, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
      },
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42",
        "presentation": "{patientName}, a 42-year-old woman, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 67,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2.20261105.",
      "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1"
    },
    "chiefComplaint": "Preoperative result discussion",
    "previousChiefComplaint": "Positive-test question",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67"
      },
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67"
      },
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42"
      },
      {
        "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42"
      }
    ]
  },
  {
    "id": "revision.flags2.20261105.g07",
    "auditId": "G07",
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "previousQuestionVariantId": "question.ptld.tissue-diagnosis-coordination.v4",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which care structure is most appropriate?",
    "previousChoiceLabels": [
      "Transplant-hematology planning",
      "Independent medication changes in clinic",
      "Repeat biopsy before reading pathology",
      "Routine annual surveillance only"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Infer that an EBV blood result plus a fragment-poor aspirate does not establish tissue classification. Then: Combine the need for representative tissue with the observed solid versus fluid/debris compartments to select method and target.",
    "reviewerNotes": "The original source claim deliberately excluded biopsy technique. A separate recorded neck-mass core claim supports selected tissue/ancillary needs, not a universal PTLD biopsy rule. The combined technique/target application needs direct source-to-claim and clinician confirmation; excisional biopsy remains a possible broader pathway outside this scoped image-guided request.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.flags2.20261105.g07.d1": "d1_4",
      "choice.flags2.20261105.g07.d2": "d2_4",
      "choice.flags2.20261105.g07.d3": "d3_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.flags2.20261105.g07.d1": null,
      "choice.flags2.20261105.g07.d2": null,
      "choice.flags2.20261105.g07.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.flags2.20261105.g07.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.flags2.20261105.g07.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.flags2.20261105.g07.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "question": {
      "id": "question.ptld.tissue-diagnosis-coordination.v4.r1",
      "conceptId": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
      "stem": "Which image-guided sampling request should be made next for {patientName}'s neck lymph node?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Core-needle biopsy with a peripheral solid-tissue target",
          "isCorrect": true,
          "rationale": "The prior aspirate does not supply tissue architecture for classification. Sampling the solid, perfused portion with a core addresses both tissue adequacy and target selection; plasma EBV DNA cannot classify PTLD.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2.20261105.g07.d1",
          "label": "Fine-needle aspiration with a peripheral solid-tissue target",
          "isCorrect": false,
          "distractorRationale": "This targets a more representative part of the node, but repeats cytology when the unresolved question requires tissue for classification after the limited aspirate. The distinction is not a claim that FNA is never useful."
        },
        {
          "id": "choice.flags2.20261105.g07.d2",
          "label": "Core-needle biopsy with a central fluid-region target",
          "isCorrect": false,
          "distractorRationale": "This obtains a core in name but targets the fluid/debris component rather than the solid tissue needed for representative classification."
        },
        {
          "id": "choice.flags2.20261105.g07.d3",
          "label": "Fine-needle aspiration with a central fluid-region target",
          "isCorrect": false,
          "distractorRationale": "This would emphasize fluid/cellular material from the central component, leaving both the tissue-architecture and solid-target questions unresolved."
        }
      ],
      "explanation": "The prior aspirate does not supply tissue architecture for classification. Sampling the solid, perfused portion with a core addresses both tissue adequacy and target selection; plasma EBV DNA cannot classify PTLD. This targets a more representative part of the node, but repeats cytology when the unresolved question requires tissue for classification after the limited aspirate. The distinction is not a claim that FNA is never useful. This obtains a core in name but targets the fluid/debris component rather than the solid tissue needed for representative classification. This would emphasize fluid/cellular material from the central component, leaving both the tissue-architecture and solid-target questions unresolved.",
      "teachingPoint": "The prior aspirate does not supply tissue architecture for classification. Sampling the solid, perfused portion with a core addresses both tissue adequacy and target selection; plasma EBV DNA cannot classify PTLD.",
      "supportingEvidenceClaimIds": [
        "claim.ptld.tissue",
        "claim.gs028f.neck.core-biopsy-alternative",
        "claim.flags2.20261105.g07.application",
        "claim.flags2.20261105.ptld-target-and-method"
      ],
      "contentVersion": "clinical.question-flags2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "keyValue",
        "caption": "Neck ultrasound observations",
        "items": [
          {
            "label": "Peripheral portion of the node",
            "value": "Solid tissue with internal Doppler flow"
          },
          {
            "label": "Central portion of the node",
            "value": "Fluid-like material and debris; no internal Doppler flow"
          }
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.ptld.tissue-diagnosis-coordination",
      "nextConceptId": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The original already-classified PTLD case asked only which teams coordinate care. This version scores tissue adequacy and sampling target; preserve the old coordination concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "G07",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaced generic care structures with four explicit sampling requests. The learner must interpret specimen adequacy and actual node observations; no PTLD diagnosis is supplied and no treatment regimen is invented.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun} with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
    "previousPresentation": "{patientName}, a 43-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.43",
        "presentation": "{patientName}, a 43-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.43",
        "presentation": "{patientName}, a 43-year-old man with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.68",
        "presentation": "{patientName}, a 68-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.68",
        "presentation": "{patientName}, a 68-year-old man with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2.20261105.",
      "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1"
    },
    "chiefComplaint": "Enlarging neck node",
    "previousChiefComplaint": "Review biopsy report",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.43"
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.43"
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.68"
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.68"
      }
    ]
  }
];

export const QUESTION_FLAGS2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.mh.family-history-and-regimen-components.v1",
    "displayName": "Integrate familial MH risk with all components of a proposed anaesthetic",
    "learningObjective": "Interpret a documented first-degree susceptibility result despite prior uneventful exposure, then distinguish triggering drugs across anaesthetic components.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "previousConceptId": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
    "versioningReason": "The old task scored transmission of already-established susceptibility. This version scores interpretation of family history and prior exposure plus drug-class application; keep the old communication concept for frozen encounters/FSRS.",
    "revisedItemIds": [
      "G02"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.gs028d.mh.trigger-free-plan",
      "claim.flags2.20261105.g02.application",
      "claim.flags2.20261105.mh-prior-exposure",
      "claim.flags2.20261105.mh-volatile-trigger",
      "claim.flags2.20261105.mh-relaxant-trigger",
      "claim.flags2.20261105.mh-nontriggering-regimen"
    ],
    "contentVersion": "clinical.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.predictive-value.collection-population-denominator.v1",
    "displayName": "Match a positive result to its collection population and denominator",
    "learningObjective": "Identify the relevant tested cohort from collection chronology, then calculate positive predictive value rather than sensitivity or pretest prevalence.",
    "earliestFacilityStage": 0,
    "conceptType": "applied_science",
    "previousConceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "versioningReason": "The old task asked only the direction of change under a supplied lower-prevalence label. This scores cohort selection and positive-result denominator calculation; retain the original direction-of-change concept.",
    "revisedItemIds": [
      "G06"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.gs028se.statistics.predictive-value-prevalence",
      "claim.gs028se.statistics.sensitivity-specificity",
      "claim.pancreatic-adenocarcinoma.body-tail-distal-pancreatectomy",
      "claim.flags2.20261105.g06.application",
      "claim.flags2.20261105.ppv-pre-admission",
      "claim.flags2.20261105.ppv-intensive-care",
      "claim.flags2.20261105.ppv-fixed-sensitivity",
      "claim.flags2.20261105.ppv-fixed-specificity",
      "claim.flags2.20261105.ppv-cohort-prevalence"
    ],
    "contentVersion": "clinical.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
    "displayName": "Choose target and tissue method after a limited transplant-recipient node aspirate",
    "learningObjective": "Interpret the specimen and node compartments, then select representative tissue for classification rather than equating plasma EBV DNA or a sampling label with adequate pathology.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "previousConceptId": "concept.ptld.tissue-diagnosis-coordination",
    "versioningReason": "The original already-classified PTLD case asked only which teams coordinate care. This version scores tissue adequacy and sampling target; preserve the old coordination concept.",
    "revisedItemIds": [
      "G07"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.ptld.tissue",
      "claim.gs028f.neck.core-biopsy-alternative",
      "claim.flags2.20261105.g07.application",
      "claim.flags2.20261105.ptld-target-and-method"
    ],
    "contentVersion": "clinical.question-flags2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  }
];
