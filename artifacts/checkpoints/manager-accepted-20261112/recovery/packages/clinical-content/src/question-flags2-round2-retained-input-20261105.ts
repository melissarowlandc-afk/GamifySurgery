import type { SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry } from "./schema";

/** Exact round-one input plus the directly flagged live G03 and unretired G04. */
export const QUESTION_FLAGS2_ROUND2_RETAINED_INPUT: SyntheticClinicalRelease = {
  "id": "clinical.flags2-round2-retained-input.20261105.v1",
  "schemaVersion": 1,
  "publicationStatus": "synthetic_unapproved_prototype",
  "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
  "concepts": [
    {
      "id": "concept.persistent-itp.hiv-hcv-secondary-evaluation",
      "displayName": "HIV and hepatitis-C evaluation in presumed ITP",
      "learningObjective": "Select HIV and hepatitis-C testing before concluding primary ITP in compatible isolated thrombocytopenia.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.persistent-itp.defer-elective-splenectomy",
      "displayName": "Deferring elective splenectomy in persistent ITP",
      "learningObjective": "Defer elective splenectomy when feasible in stable persistent ITP of only several months.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.mh.family-history-and-regimen-components.v1",
      "displayName": "Integrate familial MH risk with all components of a proposed anaesthetic",
      "learningObjective": "Interpret a documented first-degree susceptibility result despite prior uneventful exposure, then distinguish triggering drugs across anaesthetic components.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.palpable-breast.negative-mammogram-targeted-us",
      "displayName": "Targeted ultrasound after negative mammography",
      "learningObjective": "Order targeted ultrasound for an adult at least 40 with a persistent palpable finding after negative diagnostic mammography.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "displayName": "Biopsy suspicious palpable mass despite negative imaging",
      "learningObjective": "Obtain tissue diagnosis for a persistently suspicious palpable mass despite negative mammography and targeted ultrasound.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
      "displayName": "Check pregnancy in pelvic-pain assessment",
      "learningObjective": "Select pregnancy hCG testing during assessment of reproductive-age pelvic or abdominal pain when pregnancy is possible.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.asymptomatic-phpt.three-site-dxa",
      "displayName": "Three-site skeletal assessment in asymptomatic primary hyperparathyroidism",
      "learningObjective": "Select lumbar-spine, hip, and distal forearm DXA for skeletal assessment after primary hyperparathyroidism is confirmed.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.asymptomatic-phpt.age-based-surgery",
      "displayName": "Age-based surgical assessment in asymptomatic primary hyperparathyroidism",
      "learningObjective": "Recognize age under 50 years as an independent reason to discuss parathyroid surgery after confirmed asymptomatic disease.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.predictive-value.collection-population-denominator.v1",
      "displayName": "Match a positive result to its collection population and denominator",
      "learningObjective": "Identify the relevant tested cohort from collection chronology, then calculate positive predictive value rather than sensitivity or pretest prevalence.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
      "displayName": "Choose target and tissue method after a limited transplant-recipient node aspirate",
      "learningObjective": "Interpret the specimen and node compartments, then select representative tissue for classification rather than equating plasma EBV DNA or a sampling label with adequate pathology.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    }
  ],
  "cases": [
    {
      "id": "case.persistent-itp.hematology-followup",
      "displayName": "Persistent ITP surgical-opinion follow-up",
      "patientPresentationVariantId": "presentation.persistent-itp.hematology-followup",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 57,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Splenectomy consultation",
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.persistent-itp.hematology-followup",
        "patientPresentationVariantId": "presentation.persistent-itp.hematology-followup",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Splenectomy consultation",
        "revisedPresentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.female.57",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.female.57",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.male.57",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.male.57",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 57-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.female.55",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.female.55",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 55-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.male.55",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.male.55",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 55-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.persistent-itp.hematology-followup.female.57",
          "prototypeDemographics": {
            "ageYears": 57,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Splenectomy consultation",
          "presentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
        },
        {
          "id": "profile.persistent-itp.hematology-followup.male.57",
          "prototypeDemographics": {
            "ageYears": 57,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Splenectomy consultation",
          "presentation": "{patientName}, a 57-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
        },
        {
          "id": "profile.persistent-itp.hematology-followup.female.55",
          "prototypeDemographics": {
            "ageYears": 55,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Splenectomy consultation",
          "presentation": "{patientName}, a 55-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
        },
        {
          "id": "profile.persistent-itp.hematology-followup.male.55",
          "prototypeDemographics": {
            "ageYears": 55,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Splenectomy consultation",
          "presentation": "{patientName}, a 55-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "International ITP consensus (2019)",
        "ASH ITP guideline summary (2026)"
      ],
      "decisionNodes": [
        {
          "id": "node.persistent-itp.hematology-followup.1",
          "questionVariantId": "question.persistent-itp.hiv-hcv-secondary-evaluation.v3",
          "primaryConceptId": "concept.persistent-itp.hiv-hcv-secondary-evaluation",
          "stem": "Before labeling {patientName}'s thrombocytopenia primary ITP, which testing should be arranged?",
          "answerChoices": [
            {
              "id": "viral_serology_3",
              "label": "HIV and HCV serology",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.hiv_hcv_serology"
              }
            },
            {
              "id": "bone_scan_3",
              "label": "Bone marrow examination",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "abdominal_ct_3",
              "label": "Abdominal ultrasound",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "platelet_repeat_3",
              "label": "Repeat platelet count",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "HIV and hepatitis-C testing helps exclude secondary causes before concluding primary ITP, but negative serology alone does not establish the diagnosis.",
          "sourceLabels": [
            "International ITP consensus (2019)",
            "ASH ITP guideline summary (2026)"
          ],
          "resultGateAfter": {
            "id": "gate.itp.viral-serology.3",
            "resultTypeId": "service.hiv_hcv_serology",
            "pendingLabel": "External viral-serology results pending",
            "resultNarrative": "HIV and hepatitis-C testing are negative; the evaluation remains compatible with presumed primary ITP after the broader clinical review.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.hiv_hcv_serology.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.persistent-itp.hematology-followup.2",
          "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r1",
          "primaryConceptId": "concept.persistent-itp.defer-elective-splenectomy",
          "currentUpdate": "The returned HIV and hepatitis-C serology is negative. Platelet counts since the relapse have remained above 30 × 10^9/L. Bruises have recurred, but there has been no mucosal or internal bleeding. Hematology is continuing treatment and follow-up; {patientName} asks about an operation after the relapse.",
          "stem": "Which plan should be recommended for {patientName}'s splenectomy consultation?",
          "answerChoices": [
            {
              "id": "defer_3",
              "label": "Continue treatment; reassess elective splenectomy when disease duration reaches a year",
              "isCorrect": true,
              "rationale": "This remains an early persistent course. In this nonemergency presentation, ongoing treatment and reassessment are preferable to committing to early elective splenectomy; the recorded ASH claim supports waiting at least a year when possible.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g01.d1",
              "label": "Arrange vaccination; schedule splenectomy after preoperative immunization is complete",
              "isCorrect": false,
              "rationale": "Vaccination is relevant when an operation is selected, but completing it does not resolve whether elective splenectomy is appropriate at this early point. This choice turns preparation for surgery into its indication.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g01.d2",
              "label": "Arrange marrow sampling; schedule splenectomy after the pathology report returns",
              "isCorrect": false,
              "rationale": "A marrow result would not itself resolve the early elective-surgery timing issue. This is not a claim that marrow evaluation is never appropriate: a separate indication requires its own assessment, and negative HIV/HCV results do not mandate a universal marrow-then-surgery sequence.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "This remains an early persistent course. In this nonemergency presentation, ongoing treatment and reassessment are preferable to committing to early elective splenectomy; the recorded ASH claim supports waiting at least a year when possible. Vaccination is relevant when an operation is selected, but completing it does not resolve whether elective splenectomy is appropriate at this early point. This choice turns preparation for surgery into its indication. A marrow result would not itself resolve the early elective-surgery timing issue. This is not a claim that marrow evaluation is never appropriate: a separate indication requires its own assessment, and negative HIV/HCV results do not mandate a universal marrow-then-surgery sequence.",
          "teachingPoint": "This remains an early persistent course. In this nonemergency presentation, ongoing treatment and reassessment are preferable to committing to early elective splenectomy; the recorded ASH claim supports waiting at least a year when possible.",
          "sourceLabels": [
            "International ITP consensus (2019)",
            "ASH ITP guideline summary (2026)",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags2.20261105.g01.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Arrange vaccination; schedule splenectomy after preoperative immunization is complete”.",
              "clinicalRationale": "Vaccination is relevant when an operation is selected, but completing it does not resolve whether elective splenectomy is appropriate at this early point. This choice turns preparation for surgery into its indication.",
              "sourceLabels": [
                "International ITP consensus (2019)",
                "ASH ITP guideline summary (2026)"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g01.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Arrange marrow sampling; schedule splenectomy after the pathology report returns”.",
              "clinicalRationale": "A marrow result would not itself resolve the early elective-surgery timing issue. This is not a claim that marrow evaluation is never appropriate: a separate indication requires its own assessment, and negative HIV/HCV results do not mandate a universal marrow-then-surgery sequence.",
              "sourceLabels": [
                "International ITP consensus (2019)",
                "ASH ITP guideline summary (2026)"
              ]
            }
          ]
        }
      ],
      "learningSummary": "HIV and hepatitis-C testing helps exclude secondary causes before concluding primary ITP, but negative serology alone does not establish the diagnosis. This remains an early persistent course. In this nonemergency presentation, ongoing treatment and reassessment are preferable to committing to early elective splenectomy; the recorded ASH claim supports waiting at least a year when possible. Vaccination is relevant when an operation is selected, but completing it does not resolve whether elective splenectomy is appropriate at this early point. This choice turns preparation for surgery into its indication. A marrow result would not itself resolve the early elective-surgery timing issue. This is not a claim that marrow evaluation is never appropriate: a separate indication requires its own assessment, and negative HIV/HCV results do not mandate a universal marrow-then-surgery sequence."
    },
    {
      "id": "case.gs028d.anesthesia.b-family-testing-record",
      "displayName": "Preanesthetic planning",
      "patientPresentationVariantId": "presentation.gs028d.anesthesia.b-family-testing-record",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Colectomy anesthesia review",
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.gs028d.anesthesia.b-family-testing-record",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.b-family-testing-record",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Colectomy anesthesia review",
        "revisedPresentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.female.35",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.female.35",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.male.35",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.male.35",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 35-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.female.60",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.female.60",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 60-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.male.60",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.male.60",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 60-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028d.anesthesia.b-family-testing-record.female.35",
          "prototypeDemographics": {
            "ageYears": 35,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Colectomy anesthesia review",
          "presentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
        },
        {
          "id": "profile.gs028d.anesthesia.b-family-testing-record.male.35",
          "prototypeDemographics": {
            "ageYears": 35,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Colectomy anesthesia review",
          "presentation": "{patientName}, a 35-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
        },
        {
          "id": "profile.gs028d.anesthesia.b-family-testing-record.female.60",
          "prototypeDemographics": {
            "ageYears": 60,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Colectomy anesthesia review",
          "presentation": "{patientName}, a 60-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
        },
        {
          "id": "profile.gs028d.anesthesia.b-family-testing-record.male.60",
          "prototypeDemographics": {
            "ageYears": 60,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Colectomy anesthesia review",
          "presentation": "{patientName}, a 60-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
        "JSA guideline for management of malignant hyperthermia in 2025",
        "Perioperative Management of MH Suspected or Susceptible Patients"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028d.anesthesia.b-family-testing-record.1",
          "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r1",
          "primaryConceptId": "concept.mh.family-history-and-regimen-components.v1",
          "stem": "Which general-anaesthetic regimen should be proposed for {patientName}?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Propofol infusion with remifentanil; rocuronium for intubation",
              "isCorrect": true,
              "rationale": "The first-degree family result warrants managing the patient as potentially susceptible until assessed. An uncomplicated previous exposure does not establish absence of susceptibility. This regimen avoids both volatile anaesthetics and succinylcholine.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g02.d1",
              "label": "Sevoflurane maintenance with fentanyl; cisatracurium for intubation",
              "isCorrect": false,
              "rationale": "This is a familiar anaesthetic regimen and reproduces a drug previously tolerated, but sevoflurane remains an MH trigger. A prior uneventful anaesthetic does not clear the family-history risk.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g02.d2",
              "label": "Propofol infusion with fentanyl; succinylcholine for intubation",
              "isCorrect": false,
              "rationale": "Intravenous maintenance can be suitable, but the induction/intubation component also matters: succinylcholine remains a trigger. A plan is not made trigger-free merely by replacing the maintenance agent.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The first-degree family result warrants managing the patient as potentially susceptible until assessed. An uncomplicated previous exposure does not establish absence of susceptibility. This regimen avoids both volatile anaesthetics and succinylcholine. This is a familiar anaesthetic regimen and reproduces a drug previously tolerated, but sevoflurane remains an MH trigger. A prior uneventful anaesthetic does not clear the family-history risk. Intravenous maintenance can be suitable, but the induction/intubation component also matters: succinylcholine remains a trigger. A plan is not made trigger-free merely by replacing the maintenance agent.",
          "teachingPoint": "The first-degree family result warrants managing the patient as potentially susceptible until assessed. An uncomplicated previous exposure does not establish absence of susceptibility. This regimen avoids both volatile anaesthetics and succinylcholine.",
          "sourceLabels": [
            "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
            "JSA guideline for management of malignant hyperthermia in 2025",
            "Perioperative Management of MH Suspected or Susceptible Patients",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags2.20261105.g02.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Sevoflurane maintenance with fentanyl; cisatracurium for intubation”.",
              "clinicalRationale": "This is a familiar anaesthetic regimen and reproduces a drug previously tolerated, but sevoflurane remains an MH trigger. A prior uneventful anaesthetic does not clear the family-history risk.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g02.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Propofol infusion with fentanyl; succinylcholine for intubation”.",
              "clinicalRationale": "Intravenous maintenance can be suitable, but the induction/intubation component also matters: succinylcholine remains a trigger. A plan is not made trigger-free merely by replacing the maintenance agent.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The first-degree family result warrants managing the patient as potentially susceptible until assessed. An uncomplicated previous exposure does not establish absence of susceptibility. This regimen avoids both volatile anaesthetics and succinylcholine. This is a familiar anaesthetic regimen and reproduces a drug previously tolerated, but sevoflurane remains an MH trigger. A prior uneventful anaesthetic does not clear the family-history risk. Intravenous maintenance can be suitable, but the induction/intubation component also matters: succinylcholine remains a trigger. A plan is not made trigger-free merely by replacing the maintenance agent."
    },
    {
      "id": "case.gs028c.palpable-breast.paired-dense-focal",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-dense-focal",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 44,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Persistent breast lump",
      "presentation": "{patientName}, a 44-year-old woman, has a reproducible focal lump in dense breast tissue. Diagnostic mammography is negative, and the exact palpable area has not been assessed with ultrasound.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
          "prototypeDemographics": {
            "ageYears": 44,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 44-year-old woman, has a reproducible focal lump in dense breast tissue. Diagnostic mammography is negative, and the exact palpable area has not been assessed with ultrasound."
        },
        {
          "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old woman, has a reproducible focal lump in dense breast tissue. Diagnostic mammography is negative, and the exact palpable area has not been assessed with ultrasound."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.paired-dense-focal.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which imaging study should evaluate {patientName}'s persistent palpable breast finding after negative diagnostic mammography?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Targeted breast ultrasound",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_1",
              "label": "Repeat diagnostic mammography",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            },
            {
              "id": "d2_1",
              "label": "Breast MRI",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d3_1",
              "label": "Contrast-enhanced chest CT",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ct"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A persistent palpable finding after negative mammography requires targeted ultrasound of the exact clinical area.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": {
            "id": "gate.gs028c.dense-focal",
            "resultTypeId": "service.ultrasound",
            "pendingLabel": "Targeted breast ultrasound pending",
            "resultNarrative": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.ultrasound.in_house",
              "route.ultrasound.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.gs028c.palpable-breast.paired-dense-focal.2",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "currentUpdate": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
          "stem": "Which next diagnostic step should evaluate {patientName}'s clinically suspicious palpable breast mass despite negative mammography and ultrasound?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Breast-specialist biopsy referral",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_1",
              "label": "Repeat targeted breast ultrasound",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d3_1",
              "label": "Repeat diagnostic mammography",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Contrast-enhanced breast MRI.”",
              "clinicalRationale": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat targeted breast ultrasound.”",
              "clinicalRationale": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat diagnostic mammography.”",
              "clinicalRationale": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "A persistent palpable finding after negative mammography requires targeted ultrasound of the exact clinical area. Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis."
    },
    {
      "id": "case.gs028f.gynecology.c1-late-period",
      "displayName": "A possible pregnancy changes the question",
      "patientPresentationVariantId": "presentation.gs028f.gynecology.c1-late-period",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 24,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Pelvic ache",
      "presentation": "{patientName}, a 24-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028f.gynecology.c1-late-period.female.24",
          "prototypeDemographics": {
            "ageYears": 24,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 24-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway."
        },
        {
          "id": "profile.gs028f.gynecology.c1-late-period.female.32",
          "prototypeDemographics": {
            "ageYears": 32,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 32-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Pregnancy Test",
        "Early pregnancy loss",
        "Ectopic pregnancy",
        "Ectopic Pregnancy"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028f.gynecology.c1-late-period.1",
          "questionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1",
          "primaryConceptId": "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
          "stem": "Which laboratory test should assess possible pregnancy during this patient's pelvic-pain evaluation?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Serum hCG measurement",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.basic_labs"
              }
            },
            {
              "id": "d1_1",
              "label": "Complete blood count",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.basic_labs"
              }
            },
            {
              "id": "d2_1",
              "label": "Serum lipase testing",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.basic_labs"
              }
            },
            {
              "id": "d3_1",
              "label": "Serum creatinine testing",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.basic_labs"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
          "sourceLabels": [
            "Pregnancy Test",
            "Early pregnancy loss",
            "Ectopic pregnancy",
            "Ectopic Pregnancy"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Complete blood count.”",
              "clinicalRationale": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
              "sourceLabels": [
                "Pregnancy Test",
                "Early pregnancy loss",
                "Ectopic pregnancy",
                "Ectopic Pregnancy"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Serum lipase testing.”",
              "clinicalRationale": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
              "sourceLabels": [
                "Pregnancy Test",
                "Early pregnancy loss",
                "Ectopic pregnancy",
                "Ectopic Pregnancy"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Serum creatinine testing.”",
              "clinicalRationale": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
              "sourceLabels": [
                "Pregnancy Test",
                "Early pregnancy loss",
                "Ectopic pregnancy",
                "Ectopic Pregnancy"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings."
    },
    {
      "id": "case.asymptomatic-phpt.incidental-calcium",
      "displayName": "Asymptomatic primary-hyperparathyroidism assessment",
      "patientPresentationVariantId": "presentation.asymptomatic-phpt.incidental-calcium",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "High calcium follow-up",
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.asymptomatic-phpt.incidental-calcium",
        "patientPresentationVariantId": "presentation.asymptomatic-phpt.incidental-calcium",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "High calcium follow-up",
        "revisedPresentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.female.47",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.female.47",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.male.47",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.male.47",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 47-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.female.46",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.female.46",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.male.46",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.male.46",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.female.47",
          "prototypeDemographics": {
            "ageYears": 47,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "High calcium follow-up",
          "presentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
        },
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.male.47",
          "prototypeDemographics": {
            "ageYears": 47,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "High calcium follow-up",
          "presentation": "{patientName}, a 47-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
        },
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.female.46",
          "prototypeDemographics": {
            "ageYears": 46,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "High calcium follow-up",
          "presentation": "{patientName}, a 46-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
        },
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.male.46",
          "prototypeDemographics": {
            "ageYears": 46,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "High calcium follow-up",
          "presentation": "{patientName}, a 46-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fifth International Workshop PHPT guideline (2022)"
      ],
      "decisionNodes": [
        {
          "id": "node.asymptomatic-phpt.incidental-calcium.1",
          "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
          "primaryConceptId": "concept.asymptomatic-phpt.three-site-dxa",
          "stem": "Which baseline skeletal study should be arranged alongside {patientName}'s operative consultation?",
          "answerChoices": [
            {
              "id": "three_site_dxa_1",
              "label": "Dual-energy X-ray absorptiometry at spine, hip and distal forearm",
              "isCorrect": true,
              "rationale": "The recorded Fifth Workshop recommendation includes the lumbar spine, hip and distal one-third radius. This assesses skeletal involvement while the independent operative indication is considered.",
              "serviceRequest": {
                "serviceId": "service.dxa"
              }
            },
            {
              "id": "choice.flags2.20261105.g05-staging.d1",
              "label": "Quantitative CT of the lumbar spine and hip",
              "isCorrect": false,
              "rationale": "This is a named quantitative bone-density modality, but it does not supply the standard three-site DXA assessment represented by the guideline.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g05-staging.d2",
              "label": "Radionuclide bone scintigraphy of the axial skeleton",
              "isCorrect": false,
              "rationale": "This is a named skeletal study, but it does not provide the specified baseline bone-density assessment at the guideline sites.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The recorded Fifth Workshop recommendation includes the lumbar spine, hip and distal one-third radius. This assesses skeletal involvement while the independent operative indication is considered. This is a named quantitative bone-density modality, but it does not supply the standard three-site DXA assessment represented by the guideline. This is a named skeletal study, but it does not provide the specified baseline bone-density assessment at the guideline sites.",
          "teachingPoint": "The recorded Fifth Workshop recommendation includes the lumbar spine, hip and distal one-third radius. This assesses skeletal involvement while the independent operative indication is considered.",
          "sourceLabels": [
            "Fifth International Workshop PHPT guideline (2022)",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)"
          ],
          "resultGateAfter": {
            "id": "gate.asymptomatic-phpt.dxa.1",
            "resultTypeId": "service.dxa",
            "pendingLabel": "External DXA assessment pending",
            "resultNarrative": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.dxa.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.asymptomatic-phpt.incidental-calcium.2",
          "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r1",
          "primaryConceptId": "concept.asymptomatic-phpt.age-based-surgery",
          "currentUpdate": "The completed spine, hip and distal-radius bone-density measurements are within the age-appropriate reference range. {patientName} has no hypercalcemic symptoms.",
          "stem": "Which management recommendation should be made for {patientName}?",
          "answerChoices": [
            {
              "id": "surgical_assessment_1",
              "label": "Recommend parathyroidectomy through endocrine surgery",
              "isCorrect": true,
              "rationale": "The patient remains younger than 50 in every retained presentation profile. That independent guideline criterion supports parathyroidectomy even when skeletal and renal assessment shows no complication. DXA characterizes baseline skeletal status; it does not create the age-based indication or have to become abnormal first.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g05.d1",
              "label": "Recommend biochemical surveillance through endocrinology follow-up",
              "isCorrect": false,
              "rationale": "Monitoring is a genuine pathway when surgery is not selected, but normal organ assessment does not remove the independent age-based criterion in this patient. No contraindication or refusal of surgery has been introduced.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g05.d2",
              "label": "Recommend cinacalcet therapy through endocrinology follow-up",
              "isCorrect": false,
              "rationale": "A named calcium-lowering medical pathway is more plausible than a generic bone-clinic foil. It does not replace discussion of an independently indicated operation in this represented, asymptomatic patient. This option teaches no medication dose or mandatory treatment algorithm.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The patient remains younger than 50 in every retained presentation profile. That independent guideline criterion supports parathyroidectomy even when skeletal and renal assessment shows no complication. DXA characterizes baseline skeletal status; it does not create the age-based indication or have to become abnormal first. Monitoring is a genuine pathway when surgery is not selected, but normal organ assessment does not remove the independent age-based criterion in this patient. No contraindication or refusal of surgery has been introduced. A named calcium-lowering medical pathway is more plausible than a generic bone-clinic foil. It does not replace discussion of an independently indicated operation in this represented, asymptomatic patient. This option teaches no medication dose or mandatory treatment algorithm.",
          "teachingPoint": "The patient remains younger than 50 in every retained presentation profile. That independent guideline criterion supports parathyroidectomy even when skeletal and renal assessment shows no complication. DXA characterizes baseline skeletal status; it does not create the age-based indication or have to become abnormal first.",
          "sourceLabels": [
            "Fifth International Workshop PHPT guideline (2022)",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags2.20261105.g05.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Recommend biochemical surveillance through endocrinology follow-up”.",
              "clinicalRationale": "Monitoring is a genuine pathway when surgery is not selected, but normal organ assessment does not remove the independent age-based criterion in this patient. No contraindication or refusal of surgery has been introduced.",
              "sourceLabels": [
                "Fifth International Workshop PHPT guideline (2022)"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g05.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Recommend cinacalcet therapy through endocrinology follow-up”.",
              "clinicalRationale": "A named calcium-lowering medical pathway is more plausible than a generic bone-clinic foil. It does not replace discussion of an independently indicated operation in this represented, asymptomatic patient. This option teaches no medication dose or mandatory treatment algorithm.",
              "sourceLabels": [
                "Fifth International Workshop PHPT guideline (2022)"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The recorded Fifth Workshop recommendation includes the lumbar spine, hip and distal one-third radius. This assesses skeletal involvement while the independent operative indication is considered. This is a named quantitative bone-density modality, but it does not supply the standard three-site DXA assessment represented by the guideline. This is a named skeletal study, but it does not provide the specified baseline bone-density assessment at the guideline sites. The patient remains younger than 50 in every retained presentation profile. That independent guideline criterion supports parathyroidectomy even when skeletal and renal assessment shows no complication. DXA characterizes baseline skeletal status; it does not create the age-based indication or have to become abnormal first. Monitoring is a genuine pathway when surgery is not selected, but normal organ assessment does not remove the independent age-based criterion in this patient. No contraindication or refusal of surgery has been introduced. A named calcium-lowering medical pathway is more plausible than a generic bone-clinic foil. It does not replace discussion of an independently indicated operation in this represented, asymptomatic patient. This option teaches no medication dose or mandatory treatment algorithm."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 67,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Preoperative result discussion",
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
        "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Preoperative result discussion",
        "revisedPresentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 67-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 42-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 42-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67",
          "prototypeDemographics": {
            "ageYears": 67,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67",
          "prototypeDemographics": {
            "ageYears": 67,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 67-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42",
          "prototypeDemographics": {
            "ageYears": 42,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 42-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42",
          "prototypeDemographics": {
            "ageYears": 42,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 42-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
        "Pancreatic Cancer Treatment (PDQ): Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
          "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2.r1",
          "primaryConceptId": "concept.predictive-value.collection-population-denominator.v1",
          "stem": "Using this audit, what approximate positive predictive value should be used for {patientName}'s reported PCR result?",
          "answerChoices": [
            {
              "id": "correct_lower-prevalence",
              "label": "About 70%",
              "isCorrect": true,
              "rationale": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g06.d1",
              "label": "About 92%",
              "isCorrect": false,
              "rationale": "This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g06.d2",
              "label": "About 90%",
              "isCorrect": false,
              "rationale": "This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g06.d3",
              "label": "About 5%",
              "isCorrect": false,
              "rationale": "This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%. This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population. This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity. This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction.",
          "teachingPoint": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%.",
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
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
            "Pancreatic Cancer Treatment (PDQ): Health Professional Version",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags2.20261105.g06.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 92%”.",
              "clinicalRationale": "This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g06.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 90%”.",
              "clinicalRationale": "This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g06.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 5%”.",
              "clinicalRationale": "This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%. This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population. This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity. This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction."
    },
    {
      "id": "case.gs028b.ptld.b-pathology-returned",
      "displayName": "Post-transplant lymphoproliferative disorder",
      "patientPresentationVariantId": "presentation.gs028b.ptld.b-pathology-returned",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Enlarging neck node",
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.gs028b.ptld.b-pathology-returned",
        "patientPresentationVariantId": "presentation.gs028b.ptld.b-pathology-returned",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Enlarging neck node",
        "revisedPresentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.female.43",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.male.43",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.female.68",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.male.68",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.ptld.b-pathology-returned.female.43",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Enlarging neck node",
          "presentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
        },
        {
          "id": "profile.gs028b.ptld.b-pathology-returned.male.43",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Enlarging neck node",
          "presentation": "{patientName}, a 43-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
        },
        {
          "id": "profile.gs028b.ptld.b-pathology-returned.female.68",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Enlarging neck node",
          "presentation": "{patientName}, a 68-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
        },
        {
          "id": "profile.gs028b.ptld.b-pathology-returned.male.68",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Enlarging neck node",
          "presentation": "{patientName}, a 68-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AST PTLD and EBV guideline",
        "Comprehensive review of PTLD after solid organ transplantation"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.ptld.b-pathology-returned.1",
          "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
          "primaryConceptId": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
          "stem": "Which image-guided sampling request should be made next for {patientName}'s neck lymph node?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Core-needle biopsy with a peripheral solid-tissue target",
              "isCorrect": true,
              "rationale": "The prior aspirate does not supply tissue architecture for classification. Sampling the solid, perfused portion with a core addresses both tissue adequacy and target selection; plasma EBV DNA cannot classify PTLD.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g07.d1",
              "label": "Fine-needle aspiration with a peripheral solid-tissue target",
              "isCorrect": false,
              "rationale": "This targets a more representative part of the node, but repeats cytology when the unresolved question requires tissue for classification after the limited aspirate. The distinction is not a claim that FNA is never useful.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g07.d2",
              "label": "Core-needle biopsy with a central fluid-region target",
              "isCorrect": false,
              "rationale": "This obtains a core in name but targets the fluid/debris component rather than the solid tissue needed for representative classification.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g07.d3",
              "label": "Fine-needle aspiration with a central fluid-region target",
              "isCorrect": false,
              "rationale": "This would emphasize fluid/cellular material from the central component, leaving both the tissue-architecture and solid-target questions unresolved.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The prior aspirate does not supply tissue architecture for classification. Sampling the solid, perfused portion with a core addresses both tissue adequacy and target selection; plasma EBV DNA cannot classify PTLD. This targets a more representative part of the node, but repeats cytology when the unresolved question requires tissue for classification after the limited aspirate. The distinction is not a claim that FNA is never useful. This obtains a core in name but targets the fluid/debris component rather than the solid tissue needed for representative classification. This would emphasize fluid/cellular material from the central component, leaving both the tissue-architecture and solid-target questions unresolved.",
          "teachingPoint": "The prior aspirate does not supply tissue architecture for classification. Sampling the solid, perfused portion with a core addresses both tissue adequacy and target selection; plasma EBV DNA cannot classify PTLD.",
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
          },
          "sourceLabels": [
            "AST PTLD and EBV guideline",
            "Comprehensive review of PTLD after solid organ transplantation",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags2.20261105.g07.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Fine-needle aspiration with a peripheral solid-tissue target”.",
              "clinicalRationale": "This targets a more representative part of the node, but repeats cytology when the unresolved question requires tissue for classification after the limited aspirate. The distinction is not a claim that FNA is never useful.",
              "sourceLabels": [
                "AST PTLD and EBV guideline",
                "Comprehensive review of PTLD after solid organ transplantation"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g07.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Core-needle biopsy with a central fluid-region target”.",
              "clinicalRationale": "This obtains a core in name but targets the fluid/debris component rather than the solid tissue needed for representative classification.",
              "sourceLabels": [
                "AST PTLD and EBV guideline",
                "Comprehensive review of PTLD after solid organ transplantation"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g07.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Fine-needle aspiration with a central fluid-region target”.",
              "clinicalRationale": "This would emphasize fluid/cellular material from the central component, leaving both the tissue-architecture and solid-target questions unresolved.",
              "sourceLabels": [
                "AST PTLD and EBV guideline",
                "Comprehensive review of PTLD after solid organ transplantation"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The prior aspirate does not supply tissue architecture for classification. Sampling the solid, perfused portion with a core addresses both tissue adequacy and target selection; plasma EBV DNA cannot classify PTLD. This targets a more representative part of the node, but repeats cytology when the unresolved question requires tissue for classification after the limited aspirate. The distinction is not a claim that FNA is never useful. This obtains a core in name but targets the fluid/debris component rather than the solid tissue needed for representative classification. This would emphasize fluid/cellular material from the central component, leaving both the tissue-architecture and solid-target questions unresolved."
    }
  ]
};

export const QUESTION_FLAGS2_ROUND2_RETAINED_TIMINGS: AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "defer_3",
          "choiceLabel": "Continue treatment; reassess elective splenectomy when disease duration reaches a year",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.flags2.20261105.g01.d1",
          "choiceLabel": "Arrange vaccination; schedule splenectomy after preoperative immunization is complete",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.flags2.20261105.g01.d2",
          "choiceLabel": "Arrange marrow sampling; schedule splenectomy after the pathology report returns",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.bone_marrow"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gs028d.anesthesia.b-family-testing-record",
    "nodeId": "node.gs028d.anesthesia.b-family-testing-record.1",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "correct_1",
          "choiceLabel": "Targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "d1_1",
          "choiceLabel": "Repeat diagnostic mammography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "d2_1",
          "choiceLabel": "Breast MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "d3_1",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "correct_1",
          "choiceLabel": "Serum hCG measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "d1_1",
          "choiceLabel": "Complete blood count",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "d2_1",
          "choiceLabel": "Serum lipase testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "d3_1",
          "choiceLabel": "Serum creatinine testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "three_site_dxa_1",
          "choiceLabel": "Dual-energy X-ray absorptiometry at spine, hip and distal forearm",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.dxa"
          }
        },
        {
          "choiceId": "choice.flags2.20261105.g05-staging.d1",
          "choiceLabel": "Quantitative CT of the lumbar spine and hip",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.flags2.20261105.g05-staging.d2",
          "choiceLabel": "Radionuclide bone scintigraphy of the axial skeleton",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "correct_4",
          "choiceLabel": "Core-needle biopsy with a peripheral solid-tissue target",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.flags2.20261105.g07.d1",
          "choiceLabel": "Fine-needle aspiration with a peripheral solid-tissue target",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.flags2.20261105.g07.d2",
          "choiceLabel": "Core-needle biopsy with a central fluid-region target",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.flags2.20261105.g07.d3",
          "choiceLabel": "Fine-needle aspiration with a central fluid-region target",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  }
];

/** Planned candidate records; these do not change global execution or admit drafts. */
export const QUESTION_FLAGS2_ROUND2_CANDIDATE_TEST_ORDER_RECORDS = [
  {
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r2",
    "choiceId": "defer_3",
    "choiceLabel": "Marrow aspirate and core biopsy",
    "timingProfileId": "timing.test.bone_marrow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r2",
    "choiceId": "choice.flags2r2.20261105.g01.d1",
    "choiceLabel": "Peripheral-blood flow cytometry assay",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r2",
    "choiceId": "choice.flags2r2.20261105.g01.d2",
    "choiceLabel": "Peripheral-blood myeloid sequencing assay",
    "timingProfileId": "timing.test.genetic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.anesthesia.b-family-testing-record",
    "nodeId": "node.gs028d.anesthesia.b-family-testing-record.1",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r2",
    "choiceId": "correct_2",
    "choiceLabel": "Plan propofol–remifentanil anesthesia; arrange contracture testing separately",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.anesthesia.b-family-testing-record",
    "nodeId": "node.gs028d.anesthesia.b-family-testing-record.1",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r2",
    "choiceId": "choice.flags2r2.20261105.g02.d2",
    "choiceLabel": "Plan propofol–remifentanil anesthesia after muscle-contracture testing",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r3",
    "choiceId": "correct_1",
    "choiceLabel": "Request targeted breast ultrasound",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.in_house",
        "route.ultrasound.outsourced"
      ]
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r3",
    "choiceId": "choice.flags2r2.20261105.g03.d2",
    "choiceLabel": "Request spot-compression breast mammography",
    "timingProfileId": "timing.test.mammography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1.r1",
    "choiceId": "correct_1",
    "choiceLabel": "Transvaginal ultrasonography with gynecologic assessment",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1.r1",
    "choiceId": "choice.flags2r2.20261105.g04-r.d1",
    "choiceLabel": "Appendiceal MRI with general-surgical assessment",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1.r1",
    "choiceId": "choice.flags2r2.20261105.g04-r.d2",
    "choiceLabel": "Diagnostic uterine aspiration with histopathologic assessment",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
    "choiceId": "three_site_dxa_1",
    "choiceLabel": "Left hip and distal one-third radius",
    "timingProfileId": "timing.test.dxa",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.dxa",
      "allowedRouteIds": [
        "route.dxa.outsourced"
      ]
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
    "choiceId": "choice.flags2r2.20261105.g05-staging.d1",
    "choiceLabel": "Right hip and distal one-third radius",
    "timingProfileId": "timing.test.dxa",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
    "choiceId": "choice.flags2r2.20261105.g05-staging.d2",
    "choiceLabel": "Left hip and ultradistal radius",
    "timingProfileId": "timing.test.dxa",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
    "choiceId": "choice.flags2r2.20261105.g05-staging.d3",
    "choiceLabel": "Right hip and ultradistal radius",
    "timingProfileId": "timing.test.dxa",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
    "choiceId": "surgical_assessment_1",
    "choiceLabel": "Calcium-sensing receptor gene assay",
    "timingProfileId": "timing.test.genetic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
    "choiceId": "choice.flags2r2.20261105.g05.d1",
    "choiceLabel": "Parathyroid sestamibi scintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
    "choiceId": "choice.flags2r2.20261105.g05.d2",
    "choiceLabel": "PTH-related peptide assay",
    "timingProfileId": "timing.test.metabolic_workup",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r2",
    "choiceId": "correct_4",
    "choiceLabel": "Excisional biopsy with fresh/fixed allocation",
    "timingProfileId": "timing.test.excisional_biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r2",
    "choiceId": "choice.flags2r2.20261105.g07.d1",
    "choiceLabel": "Core biopsy with fresh/fixed allocation",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r2",
    "choiceId": "choice.flags2r2.20261105.g07.d2",
    "choiceLabel": "Excisional biopsy with formalin fixation",
    "timingProfileId": "timing.test.excisional_biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r2",
    "choiceId": "choice.flags2r2.20261105.g07.d3",
    "choiceLabel": "Core biopsy with formalin fixation",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
