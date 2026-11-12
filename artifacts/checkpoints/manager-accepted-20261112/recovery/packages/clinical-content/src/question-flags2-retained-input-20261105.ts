import type { SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry } from "./schema";

/** Five exact pre-rewrite cases, retained independently of the moving catalog/gate. */
export const QUESTION_FLAGS2_RETAINED_INPUT: SyntheticClinicalRelease = {
  "id": "clinical.flags2-retained-input.20261105.v1",
  "schemaVersion": 1,
  "publicationStatus": "synthetic_unapproved_prototype",
  "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
  "concepts": [
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
      "id": "concept.ptld.tissue-diagnosis-coordination",
      "displayName": "Coordinate tissue diagnosis for PTLD",
      "learningObjective": "Coordinate transplant and hematology evaluation with tissue pathology rather than diagnosing PTLD from EBV DNA or imaging alone.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.statistics-ethics.predictive-value-prevalence",
      "displayName": "Relate positive predictive value to prevalence",
      "learningObjective": "Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
      "displayName": "Plan trigger-free anaesthesia for MH susceptibility",
      "learningObjective": "Arrange specialist trigger-free anaesthetic and facility planning for known or credibly documented MH susceptibility.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
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
      "chiefComplaint": "Low platelet surgical consultation",
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
      "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed.",
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
          "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
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
          "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
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
          "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
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
          "presentation": "{patientName} is four to eight months into presumed ITP with stable isolated thrombocytopenia above 30 × 10^9/L, no major bleeding, reliable hematology follow-up, and feasible medical alternatives. Compatible history, medication review, repeat counts, and peripheral-smear review have already been completed; viral serology has not yet been completed."
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
          "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3",
          "primaryConceptId": "concept.persistent-itp.defer-elective-splenectomy",
          "currentUpdate": "HIV and hepatitis-C testing are negative; the evaluation remains compatible with presumed primary ITP after the broader clinical review.",
          "stem": "With {patientName}'s several-month persistent ITP, no major bleeding, and feasible medical care, which plan fits?",
          "answerChoices": [
            {
              "id": "defer_3",
              "label": "Defer elective splenectomy",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "immediate_3",
              "label": "Schedule elective splenectomy now",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "bone_marrow_3",
              "label": "Arrange bone marrow evaluation before deciding on surgery",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "repeat_serology_3",
              "label": "Repeat viral serology before planning",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "For persistent ITP of only several months without major bleeding and with feasible medical care, defer elective splenectomy until at least one year after diagnosis when possible.",
          "sourceLabels": [
            "International ITP consensus (2019)",
            "ASH ITP guideline summary (2026)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "immediate_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The teaching encounter recorded “Schedule elective splenectomy now.”",
              "clinicalRationale": "For persistent ITP of only several months without major bleeding and with feasible medical care, defer elective splenectomy until at least one year after diagnosis when possible.",
              "sourceLabels": [
                "International ITP consensus (2019)",
                "ASH ITP guideline summary (2026)"
              ]
            },
            {
              "answerChoiceId": "bone_marrow_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The teaching encounter recorded “Arrange bone marrow evaluation before deciding on surgery.”",
              "clinicalRationale": "For persistent ITP of only several months without major bleeding and with feasible medical care, defer elective splenectomy until at least one year after diagnosis when possible.",
              "sourceLabels": [
                "International ITP consensus (2019)",
                "ASH ITP guideline summary (2026)"
              ]
            },
            {
              "answerChoiceId": "repeat_serology_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The teaching encounter recorded “Repeat viral serology before planning.”",
              "clinicalRationale": "For persistent ITP of only several months without major bleeding and with feasible medical care, defer elective splenectomy until at least one year after diagnosis when possible.",
              "sourceLabels": [
                "International ITP consensus (2019)",
                "ASH ITP guideline summary (2026)"
              ]
            }
          ]
        }
      ],
      "learningSummary": "HIV and hepatitis-C testing helps exclude secondary causes before concluding primary ITP, but negative serology alone does not establish the diagnosis. For persistent ITP of only several months without major bleeding and with feasible medical care, defer elective splenectomy until at least one year after diagnosis when possible."
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
      "chiefComplaint": "Family MH history",
      "presentation": "{patientName}, a 35-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy.",
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
          "presentation": "{patientName}, a 35-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
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
          "presentation": "{patientName}, a 35-year-old man, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
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
          "presentation": "{patientName}, a 60-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
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
          "presentation": "{patientName}, a 60-year-old man, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
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
          "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2",
          "primaryConceptId": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
          "stem": "Which action best incorporates this information into surgical planning?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Request trigger-free planning",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_2",
              "label": "Ignore family-linked documentation",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_2",
              "label": "Select a trigger-containing anesthetic",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_2",
              "label": "Give crisis medication in clinic now",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
          "sourceLabels": [
            "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
            "JSA guideline for management of malignant hyperthermia in 2025",
            "Perioperative Management of MH Suspected or Susceptible Patients"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Ignore family-linked documentation.”",
              "clinicalRationale": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d2_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Select a trigger-containing anesthetic.”",
              "clinicalRationale": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d3_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Give crisis medication in clinic now.”",
              "clinicalRationale": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia."
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
      "chiefComplaint": "High calcium evaluation",
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
      "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well.",
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
          "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
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
          "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
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
          "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
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
          "presentation": "{patientName} has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."
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
          "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1",
          "primaryConceptId": "concept.asymptomatic-phpt.three-site-dxa",
          "stem": "For {patientName}'s skeletal assessment, which study should be obtained now?",
          "answerChoices": [
            {
              "id": "three_site_dxa_1",
              "label": "DXA of spine, hip, and distal radius",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.dxa"
              }
            },
            {
              "id": "single_site_dxa_1",
              "label": "Single-site DXA of the lumbar spine alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "bone_scan_1",
              "label": "Nuclear bone scan for occult skeletal disease",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "neck_ultrasound_1",
              "label": "Neck ultrasound for parathyroid localization",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Three-site DXA assesses the lumbar spine, hip, and distal one-third radius during skeletal evaluation of confirmed primary hyperparathyroidism.",
          "sourceLabels": [
            "Fifth International Workshop PHPT guideline (2022)"
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
          "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1",
          "primaryConceptId": "concept.asymptomatic-phpt.age-based-surgery",
          "currentUpdate": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
          "stem": "Given {patientName}'s confirmed disease and completed skeletal assessment, which next management approach is appropriate?",
          "answerChoices": [
            {
              "id": "surgical_assessment_1",
              "label": "Refer for parathyroid surgical assessment",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "observe_only_1",
              "label": "Continue observation because no complication was found",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "localize_first_1",
              "label": "Obtain neck ultrasound before discussing surgery",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "bone_clinic_only_1",
              "label": "Refer only for bone-health follow-up",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "For confirmed asymptomatic primary hyperparathyroidism, age under 50 years independently supports parathyroid surgical assessment. The age-appropriate normal bone-density report does not replace that criterion.",
          "sourceLabels": [
            "Fifth International Workshop PHPT guideline (2022)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "observe_only_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The teaching encounter recorded “Continue observation because no complication was found.”",
              "clinicalRationale": "For confirmed asymptomatic primary hyperparathyroidism, age under 50 years independently supports parathyroid surgical assessment. The age-appropriate normal bone-density report does not replace that criterion.",
              "sourceLabels": [
                "Fifth International Workshop PHPT guideline (2022)"
              ]
            },
            {
              "answerChoiceId": "localize_first_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The teaching encounter recorded “Obtain neck ultrasound before discussing surgery.”",
              "clinicalRationale": "For confirmed asymptomatic primary hyperparathyroidism, age under 50 years independently supports parathyroid surgical assessment. The age-appropriate normal bone-density report does not replace that criterion.",
              "sourceLabels": [
                "Fifth International Workshop PHPT guideline (2022)"
              ]
            },
            {
              "answerChoiceId": "bone_clinic_only_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The teaching encounter recorded “Refer only for bone-health follow-up.”",
              "clinicalRationale": "For confirmed asymptomatic primary hyperparathyroidism, age under 50 years independently supports parathyroid surgical assessment. The age-appropriate normal bone-density report does not replace that criterion.",
              "sourceLabels": [
                "Fifth International Workshop PHPT guideline (2022)"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Three-site DXA assesses the lumbar spine, hip, and distal one-third radius during skeletal evaluation of confirmed primary hyperparathyroidism. For confirmed asymptomatic primary hyperparathyroidism, age under 50 years independently supports parathyroid surgical assessment. The age-appropriate normal bone-density report does not replace that criterion."
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
      "chiefComplaint": "Positive-test question",
      "presentation": "{patientName}, a 67-year-old man, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation.",
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
          "presentation": "{patientName}, a 67-year-old man, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
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
          "presentation": "{patientName}, a 67-year-old woman, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
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
          "presentation": "{patientName}, a 42-year-old man, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
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
          "presentation": "{patientName}, a 42-year-old woman, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation."
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
          "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2",
          "primaryConceptId": "concept.statistics-ethics.predictive-value-prevalence",
          "stem": "How does the new investigational breast-cancer blood test's positive predictive value change between the hypothetical populations when sensitivity and specificity remain fixed as stated?",
          "answerChoices": [
            {
              "id": "correct_lower-prevalence",
              "label": "Positive predictive value decreases",
              "isCorrect": true,
              "rationale": "With sensitivity and specificity fixed, lower prevalence means false positives form a larger share of positive screens. Positive predictive value therefore decreases.",
              "serviceRequest": null
            },
            {
              "id": "d1_lower-prevalence",
              "label": "Positive predictive value increases",
              "isCorrect": false,
              "rationale": "This reverses the stated comparison. Lower prevalence decreases the true-positive share among positive screens under these fixed-test assumptions.",
              "serviceRequest": null
            },
            {
              "id": "d2_lower-prevalence",
              "label": "Positive predictive value stays fixed",
              "isCorrect": false,
              "rationale": "Two populations can have the same test characteristics but different predictive values because prevalence differs.",
              "serviceRequest": null
            },
            {
              "id": "d3_lower-prevalence",
              "label": "Positive predictive value is indeterminate",
              "isCorrect": false,
              "rationale": "The exhibit lacks an exact percentage, but still establishes a decrease under the lower-prevalence, fixed-test assumptions.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Positive predictive value decreases in the lower-prevalence setting under the stated assumptions. Unchanged sensitivity and specificity do not make predictive value constant.",
          "teachingPoint": "A test's positive predictive value depends on the population as well as its sensitivity and specificity. With those test characteristics fixed, lower prevalence makes false positives a larger share of positive screens, so predictive value falls. A fixed test is not a fixed predictive value; the exhibit establishes direction without an exact percentage.",
          "exhibit": {
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
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
            "Pancreatic Cancer Treatment (PDQ): Health Professional Version"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_lower-prevalence",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Positive predictive value decreases in the lower-prevalence setting under the stated assumptions. Unchanged sensitivity and specificity do not make predictive value constant.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d2_lower-prevalence",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Positive predictive value decreases in the lower-prevalence setting under the stated assumptions. Unchanged sensitivity and specificity do not make predictive value constant.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d3_lower-prevalence",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Positive predictive value decreases in the lower-prevalence setting under the stated assumptions. Unchanged sensitivity and specificity do not make predictive value constant.",
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
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
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
      "chiefComplaint": "Review biopsy report",
      "presentation": "{patientName}, a 43-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together.",
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
          "presentation": "{patientName}, a 43-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
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
          "presentation": "{patientName}, a 43-year-old man with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
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
          "presentation": "{patientName}, a 68-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
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
          "presentation": "{patientName}, a 68-year-old man with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
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
          "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4",
          "primaryConceptId": "concept.ptld.tissue-diagnosis-coordination",
          "stem": "Which care structure is most appropriate?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Transplant-hematology planning",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_4",
              "label": "Independent medication changes in clinic",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Repeat biopsy before reading pathology",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_4",
              "label": "Routine annual surveillance only",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
          "sourceLabels": [
            "AST PTLD and EBV guideline",
            "Comprehensive review of PTLD after solid organ transplantation"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Independent medication changes in clinic.”",
              "clinicalRationale": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
              "sourceLabels": [
                "AST PTLD and EBV guideline",
                "Comprehensive review of PTLD after solid organ transplantation"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat biopsy before reading pathology.”",
              "clinicalRationale": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
              "sourceLabels": [
                "AST PTLD and EBV guideline",
                "Comprehensive review of PTLD after solid organ transplantation"
              ]
            },
            {
              "answerChoiceId": "d3_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Routine annual surveillance only.”",
              "clinicalRationale": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
              "sourceLabels": [
                "AST PTLD and EBV guideline",
                "Comprehensive review of PTLD after solid organ transplantation"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen."
    }
  ]
};

export const QUESTION_FLAGS2_RETAINED_TIMING_INPUTS: AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "three_site_dxa_1",
          "choiceLabel": "DXA of spine, hip, and distal radius",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.dxa"
          }
        },
        {
          "choiceId": "single_site_dxa_1",
          "choiceLabel": "Single-site DXA of the lumbar spine alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.dxa"
          }
        },
        {
          "choiceId": "bone_scan_1",
          "choiceLabel": "Nuclear bone scan for occult skeletal disease",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "neck_ultrasound_1",
          "choiceLabel": "Neck ultrasound for parathyroid localization",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "surgical_assessment_1",
          "choiceLabel": "Refer for parathyroid surgical assessment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "observe_only_1",
          "choiceLabel": "Continue observation because no complication was found",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "localize_first_1",
          "choiceLabel": "Obtain neck ultrasound before discussing surgery",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "bone_clinic_only_1",
          "choiceLabel": "Refer only for bone-health follow-up",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "defer_3",
          "choiceLabel": "Defer elective splenectomy",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "immediate_3",
          "choiceLabel": "Schedule elective splenectomy now",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "bone_marrow_3",
          "choiceLabel": "Arrange bone marrow evaluation before deciding on surgery",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.bone_marrow"
          }
        },
        {
          "choiceId": "repeat_serology_3",
          "choiceLabel": "Repeat viral serology before planning",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.viral_serology"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028d.anesthesia.b-family-testing-record",
    "nodeId": "node.gs028d.anesthesia.b-family-testing-record.1",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2",
    "classification": {
      "kind": "no_test"
    }
  }
];

/** Exact candidate orders for manager integration after acceptance. Global domain registry is not edited in this lane. */
export const QUESTION_FLAGS2_CANDIDATE_TEST_ORDER_RECORDS = [
  {
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r1",
    "choiceId": "choice.flags2.20261105.g01.d2",
    "choiceLabel": "Arrange marrow sampling; schedule splenectomy after the pathology report returns",
    "timingProfileId": "timing.test.bone_marrow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
    "choiceId": "three_site_dxa_1",
    "choiceLabel": "Dual-energy X-ray absorptiometry at spine, hip and distal forearm",
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
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
    "choiceId": "choice.flags2.20261105.g05-staging.d1",
    "choiceLabel": "Quantitative CT of the lumbar spine and hip",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
    "choiceId": "choice.flags2.20261105.g05-staging.d2",
    "choiceLabel": "Radionuclide bone scintigraphy of the axial skeleton",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
    "choiceId": "correct_4",
    "choiceLabel": "Core-needle biopsy with a peripheral solid-tissue target",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
    "choiceId": "choice.flags2.20261105.g07.d1",
    "choiceLabel": "Fine-needle aspiration with a peripheral solid-tissue target",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
    "choiceId": "choice.flags2.20261105.g07.d2",
    "choiceLabel": "Core-needle biopsy with a central fluid-region target",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
    "choiceId": "choice.flags2.20261105.g07.d3",
    "choiceLabel": "Fine-needle aspiration with a central fluid-region target",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
