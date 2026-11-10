import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
/** Immutable exact live source at intake. Authoring comparison only. */
export const QUESTION_HARDEN1_RETAINED_INPUT:SyntheticClinicalRelease={
  "id": "clinical.harden1-retained-input.20261110.v1",
  "publicationStatus": "synthetic_unapproved_prototype",
  "schemaVersion": 1,
  "disclaimer": "Synthetic educational prototype. Not clinically approved and not medical advice.",
  "concepts": [
    {
      "id": "concept.groin-hernia.ultrasound-compartment-classification.v1",
      "displayName": "Classify a groin sac by ultrasound compartment",
      "learningObjective": "Classify a groin sac by interpreting its neck relative to the inguinal ligament and vascular landmarks.",
      "earliestFacilityStage": 1,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "displayName": "Recognize the femoral exception to inguinal watchful waiting",
      "learningObjective": "Use current vascular/ligament landmarks to reclassify a groin sac and apply the repair boundary despite improved function.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
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
      "id": "case.inguinal-hernia.caregiving-strain",
      "displayName": "Equivocal symptomatic groin presentation",
      "patientPresentationVariantId": "presentation.flags3.inguinal-hernia.caregiving-strain.20261107.v2",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "Elliot Reed",
      "prototypeDemographics": {
        "ageYears": 59,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Intermittent groin bulge",
      "presentation": "{patientName}, a 59-year-old man, returns to the surgery clinic with an intermittent right groin bulge.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags3.inguinal-hernia.caregiving-strain.20261107.v2",
          "prototypeDemographics": {
            "ageYears": 59,
            "sexLabel": "Male"
          },
          "chiefComplaint": "Intermittent groin bulge",
          "presentation": "{patientName}, a 59-year-old man, returns to the surgery clinic with an intermittent right groin bulge."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways",
        "International guidelines for groin hernia management",
        "The Role of Releasing Incisions in Emergency Inguinal Hernia Repair",
        "Update of the international HerniaSurge guidelines for groin hernia management"
      ],
      "decisionNodes": [
        {
          "id": "node.flags3.groin-ultrasound-classification.20261107",
          "questionVariantId": "question.groin-hernia.ultrasound-type.v1",
          "primaryConceptId": "concept.groin-hernia.ultrasound-compartment-classification.v1",
          "stem": "Which type of hernia do the ultrasound findings identify in {patientName}?",
          "answerChoices": [
            {
              "id": "choice.flags3.20261107.f3-03-type.key",
              "label": "Femoral hernia",
              "isCorrect": true,
              "rationale": "The neck lies below the inguinal ligament and medial to the common femoral vein, identifying the femoral-canal route.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags3.20261107.f3-03-type.d1",
              "label": "Direct inguinal hernia",
              "isCorrect": false,
              "rationale": "Direct inguinal anatomy is defined at Hesselbach's triangle medial to the inferior epigastric vessels. The recorded neck instead follows the below-ligament compartment beside the common femoral vein.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags3.20261107.f3-03-type.d2",
              "label": "Indirect inguinal hernia",
              "isCorrect": false,
              "rationale": "An indirect inguinal sac enters the deep ring lateral to the inferior epigastric vessels. The reported below-ligament neck and venous relationship identify a different route.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The sac neck's relationship to the ligament and vein identifies a femoral hernia. Direct and indirect inguinal labels refer to different anatomical routes.",
          "teachingPoint": "The sac neck's relationship to the ligament and vein identifies a femoral hernia. Direct and indirect inguinal labels refer to different anatomical routes.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Targeted dynamic groin ultrasound",
            "items": [
              {
                "label": "Sac neck",
                "value": "Below the inguinal ligament."
              },
              {
                "label": "Relation to the common femoral vein",
                "value": "Immediately medial to the vein."
              }
            ]
          },
          "sourceLabels": [
            "High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways",
            "International guidelines for groin hernia management",
            "The Role of Releasing Incisions in Emergency Inguinal Hernia Repair"
          ],
          "resultGateAfter": null,
          "terminalDispositions": []
        },
        {
          "id": "node.inguinal-hernia.caregiving-strain.2",
          "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r12",
          "primaryConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
          "currentUpdate": "Ultrasound classification: femoral hernia. {patientName} now completes his usual caregiving lifts. The groin bulge disappears when he lies down. The groin is nontender, the abdomen is soft and not distended, and he reports no vomiting.",
          "stem": "Which plan should be offered for {patientName}'s groin hernia at this visit?",
          "answerChoices": [
            {
              "id": "choice.flags3.20261107.f3-03.key",
              "label": "Plan elective hernia repair",
              "isCorrect": true,
              "rationale": "The established femoral anatomy supports timely elective repair despite improved function. The reducing, nontender presentation without obstructive features does not establish an emergency.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags3.20261107.f3-03.d1",
              "label": "Plan scheduled hernia surveillance",
              "isCorrect": false,
              "rationale": "Observation can be appropriate for selected minimally symptomatic inguinal hernias in men. Improvement in lifting does not extend that observation rule to the identified femoral route.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags3.20261107.f3-03.d2",
              "label": "Plan emergency hernia exploration",
              "isCorrect": false,
              "rationale": "The femoral type warrants repair planning, but the current record does not show the persistent painful irreducible or obstructed presentation needed to favor emergency exploration here.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Combine the established type with the current acuity. A stable reducing femoral hernia warrants timely elective repair planning even when symptoms have improved. The inguinal watchful-waiting rule for selected men does not apply to this anatomy. New pain, irreducibility or obstructive/ischemic concern would change the urgency; no fixed deadline or repair technique is specified.",
          "teachingPoint": "Combine the established type with the current acuity. A stable reducing femoral hernia warrants timely elective repair planning even when symptoms have improved. The inguinal watchful-waiting rule for selected men does not apply to this anatomy. New pain, irreducibility or obstructive/ischemic concern would change the urgency; no fixed deadline or repair technique is specified.",
          "sourceLabels": [
            "International guidelines for groin hernia management",
            "Update of the international HerniaSurge guidelines for groin hernia management"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags3.20261107.f3-03.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the interpretation before continuing.",
              "clinicalRationale": "Observation can be appropriate for selected minimally symptomatic inguinal hernias in men. Improvement in lifting does not extend that observation rule to the identified femoral route.",
              "sourceLabels": [
                "International guidelines for groin hernia management",
                "Update of the international HerniaSurge guidelines for groin hernia management"
              ]
            },
            {
              "answerChoiceId": "choice.flags3.20261107.f3-03.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the interpretation before continuing.",
              "clinicalRationale": "The femoral type warrants repair planning, but the current record does not show the persistent painful irreducible or obstructed presentation needed to favor emergency exploration here.",
              "sourceLabels": [
                "International guidelines for groin hernia management",
                "Update of the international HerniaSurge guidelines for groin hernia management"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The sac neck's relationship to the ligament and vein identifies a femoral hernia. Direct and indirect inguinal labels refer to different anatomical routes. Combine the established type with the current acuity. A stable reducing femoral hernia warrants timely elective repair planning even when symptoms have improved. The inguinal watchful-waiting rule for selected men does not apply to this anatomy. New pain, irreducibility or obstructive/ischemic concern would change the urgency; no fixed deadline or repair technique is specified."
    },
    {
      "id": "case.gs028f.nutrition.c1-metabolic-transition",
      "displayName": "Restarting nutrition safely",
      "patientPresentationVariantId": "presentation.flags4.nutrition.metabolic-transition.20261108",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "Maya Chen",
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
      "chiefComplaint": "Nutrition follow-up",
      "presentation": "{patientName}, a 31-year-old woman, is reviewed after a monitored nutrition restart following prolonged poor intake.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags4.nutrition.metabolic-transition.20261108",
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
          "chiefComplaint": "Nutrition follow-up",
          "presentation": "{patientName}, a 31-year-old woman, is reviewed after a monitored nutrition restart following prolonged poor intake."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Refeeding physiology in a neurocritical cohort report",
        "AuSPEN consensus statements on refeeding syndrome"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028f.nutrition.c1-metabolic-transition.1",
          "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2",
          "primaryConceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
          "stem": "Which physiological process links carbohydrate reintroduction to {patientName}'s phosphate decline?",
          "answerChoices": [
            {
              "id": "choice.flags4.20261108.key",
              "label": "Increased cellular uptake of phosphate",
              "isCorrect": true,
              "rationale": "Carbohydrate reintroduction can increase insulin-associated cellular uptake, moving phosphate from the circulation into cells. This is the feeding-related mechanism being asked about.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags4.20261108.d1",
              "label": "Increased urinary excretion of phosphate",
              "isCorrect": false,
              "rationale": "This selects removal from the body rather than redistribution into cells. It confuses a different route of phosphate handling with the metabolic response to carbohydrate reintroduction.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags4.20261108.d2",
              "label": "Decreased intestinal absorption of phosphate",
              "isCorrect": false,
              "rationale": "This treats the lower serum concentration as reduced transfer from the intestine. It does not identify the insulin-linked redistribution associated with carbohydrate reintroduction.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Carbohydrate reintroduction increases insulin-associated phosphate uptake into cells as metabolism shifts toward synthesis.\nThe renal and intestinal options describe removal or reduced entry, rather than this redistribution.\nA phosphate fall by itself does not establish refeeding syndrome.",
          "teachingPoint": "Carbohydrate reintroduction increases insulin-associated phosphate uptake into cells as metabolism shifts toward synthesis.\nThe renal and intestinal options describe removal or reduced entry, rather than this redistribution.\nA phosphate fall by itself does not establish refeeding syndrome.",
          "sourceLabels": [
            "Refeeding physiology in a neurocritical cohort report",
            "AuSPEN consensus statements on refeeding syndrome"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags4.20261108.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the phosphate-handling mechanism before continuing.",
              "clinicalRationale": "This selects removal from the body rather than redistribution into cells. It confuses a different route of phosphate handling with the metabolic response to carbohydrate reintroduction.",
              "sourceLabels": [
                "Refeeding physiology in a neurocritical cohort report",
                "AuSPEN consensus statements on refeeding syndrome"
              ]
            },
            {
              "answerChoiceId": "choice.flags4.20261108.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the phosphate-handling mechanism before continuing.",
              "clinicalRationale": "This treats the lower serum concentration as reduced transfer from the intestine. It does not identify the insulin-linked redistribution associated with carbohydrate reintroduction.",
              "sourceLabels": [
                "Refeeding physiology in a neurocritical cohort report",
                "AuSPEN consensus statements on refeeding syndrome"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Carbohydrate reintroduction increases insulin-associated phosphate uptake into cells as metabolism shifts toward synthesis.\nThe renal and intestinal options describe removal or reduced entry, rather than this redistribution.\nA phosphate fall by itself does not establish refeeding syndrome."
    }
  ]
};
export const QUESTION_HARDEN1_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]=[
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.flags3.groin-ultrasound-classification.20261107",
    "questionVariantId": "question.groin-hernia.ultrasound-type.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r12",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028f.nutrition.c1-metabolic-transition",
    "nodeId": "node.gs028f.nutrition.c1-metabolic-transition.1",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2",
    "classification": {
      "kind": "no_test"
    }
  }
];
