import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";

/** Exact live case and timing at intake; no acceptance implied. */
export const QUESTION_FLAGS4_RETAINED_INPUT:SyntheticClinicalRelease={
  "id": "clinical.flags4-retained-input.20261108.v1",
  "publicationStatus": "synthetic_unapproved_prototype",
  "schemaVersion": 1,
  "disclaimer": "Synthetic educational prototype. Not clinically approved and not medical advice.",
  "concepts": [
    {
      "id": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
      "displayName": "Explain refeeding-related phosphate shifts",
      "learningObjective": "Explain how carbohydrate-associated insulin and the return to anabolic metabolism can lower serum phosphate through cellular uptake in a compatible refeeding course.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    }
  ],
  "cases": [
    {
      "id": "case.gs028f.nutrition.c1-metabolic-transition",
      "displayName": "Restarting nutrition safely",
      "patientPresentationVariantId": "presentation.gs028f.nutrition.c1-metabolic-transition",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Feeding recovery explanation",
      "presentation": "{patientName}, a 31-year-old woman, discusses a resolved outside refeeding-related electrolyte episode after sustained undernutrition. The hospital dietitian explained that nutrition restarted cellular building processes. The patient asks what broad metabolic transition helps explain the change.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028f.nutrition.c1-metabolic-transition.female.31",
          "prototypeDemographics": {
            "ageYears": 31,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 31-year-old woman, discusses a resolved outside refeeding-related electrolyte episode after sustained undernutrition. The hospital dietitian explained that nutrition restarted cellular building processes. The patient asks what broad metabolic transition helps explain the change."
        },
        {
          "id": "profile.gs028f.nutrition.c1-metabolic-transition.male.31",
          "prototypeDemographics": {
            "ageYears": 31,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 31-year-old man, discusses a resolved outside refeeding-related electrolyte episode after sustained undernutrition. The hospital dietitian explained that nutrition restarted cellular building processes. The patient asks what broad metabolic transition helps explain the change."
        },
        {
          "id": "profile.gs028f.nutrition.c1-metabolic-transition.female.58",
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
          "presentation": "{patientName}, a 58-year-old woman, discusses a resolved outside refeeding-related electrolyte episode after sustained undernutrition. The hospital dietitian explained that nutrition restarted cellular building processes. The patient asks what broad metabolic transition helps explain the change."
        },
        {
          "id": "profile.gs028f.nutrition.c1-metabolic-transition.male.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old man, discusses a resolved outside refeeding-related electrolyte episode after sustained undernutrition. The hospital dietitian explained that nutrition restarted cellular building processes. The patient asks what broad metabolic transition helps explain the change."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AuSPEN consensus statements on refeeding syndrome",
        "Refeeding physiology in a neurocritical cohort report"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028f.nutrition.c1-metabolic-transition.1",
          "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3",
          "primaryConceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
          "stem": "Which metabolic transition accompanies this patient's documented refeeding course?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Catabolic metabolism toward anabolic metabolism",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Anabolic metabolism toward catabolic metabolism",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "Catabolic metabolism toward intensified catabolic metabolism",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_3",
              "label": "Anabolic metabolism toward intensified anabolic metabolism",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The correct answer is “Catabolic metabolism toward anabolic metabolism.” Renewed nutrition changes the predominant metabolic state. That transition and insulin-associated cellular uptake help explain the supplied phosphate course.",
          "sourceLabels": [
            "AuSPEN consensus statements on refeeding syndrome",
            "Refeeding physiology in a neurocritical cohort report"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Anabolic metabolism toward catabolic metabolism.”",
              "clinicalRationale": "The correct answer is “Catabolic metabolism toward anabolic metabolism.” Renewed nutrition changes the predominant metabolic state. That transition and insulin-associated cellular uptake help explain the supplied phosphate course.",
              "sourceLabels": [
                "AuSPEN consensus statements on refeeding syndrome",
                "Refeeding physiology in a neurocritical cohort report"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Catabolic metabolism toward intensified catabolic metabolism.”",
              "clinicalRationale": "The correct answer is “Catabolic metabolism toward anabolic metabolism.” Renewed nutrition changes the predominant metabolic state. That transition and insulin-associated cellular uptake help explain the supplied phosphate course.",
              "sourceLabels": [
                "AuSPEN consensus statements on refeeding syndrome",
                "Refeeding physiology in a neurocritical cohort report"
              ]
            },
            {
              "answerChoiceId": "d3_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Anabolic metabolism toward intensified anabolic metabolism.”",
              "clinicalRationale": "The correct answer is “Catabolic metabolism toward anabolic metabolism.” Renewed nutrition changes the predominant metabolic state. That transition and insulin-associated cellular uptake help explain the supplied phosphate course.",
              "sourceLabels": [
                "AuSPEN consensus statements on refeeding syndrome",
                "Refeeding physiology in a neurocritical cohort report"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The correct answer is “Catabolic metabolism toward anabolic metabolism.” Renewed nutrition changes the predominant metabolic state. That transition and insulin-associated cellular uptake help explain the supplied phosphate course."
    }
  ]
};
export const QUESTION_FLAGS4_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]=[
  {
    "caseId": "case.gs028f.nutrition.c1-metabolic-transition",
    "nodeId": "node.gs028f.nutrition.c1-metabolic-transition.1",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3",
    "classification": {
      "kind": "no_test"
    }
  }
];
