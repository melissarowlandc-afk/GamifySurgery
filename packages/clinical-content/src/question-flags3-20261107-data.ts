import type {QuestionVariant} from "./pilot-schema";
export interface Flags3Definition {auditId:string;ownerFlagId:string;caseId:string;nodeId:string;questionVariantId:string;question:QuestionVariant;currentUpdate?:string;originalVariantId:string;originalConceptId:string;conceptMeaning:string;conceptVersionReason:string;}
export const QUESTION_FLAGS3_DEFINITIONS:Flags3Definition[]=[
  {
    "auditId": "F3-01",
    "ownerFlagId": "F3-01",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-07.flags3-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.predictive-value-prevalence.v4.r1",
      "conceptId": "concept.statistics-ethics.predictive-value-prevalence",
      "stem": "For a positive screen such as {patientName}'s, what percentage in this audit had MRSA detected by reference culture?",
      "answerChoices": [
        {
          "id": "choice.flags3.20261107.f3-01.key",
          "label": "About 30%",
          "isCorrect": true,
          "rationale": "The relevant group is all positive screens: 40 with MRSA detected and 95 without it. Thus 40/135 is about 30%.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags3.20261107.f3-01.d1",
          "label": "About 70%",
          "isCorrect": false,
          "rationale": "This is 95/135, the reference-negative share of positive screens. It reverses which reference outcome the question asks about.",
          "distractorRationale": "This is 95/135, the reference-negative share of positive screens. It reverses which reference outcome the question asks about."
        },
        {
          "id": "choice.flags3.20261107.f3-01.d2",
          "label": "About 80%",
          "isCorrect": false,
          "rationale": "This is 40/50, the sensitivity within reference-positive patients. The patient starts with a positive screen, so that is the wrong denominator.",
          "distractorRationale": "This is 40/50, the sensitivity within reference-positive patients. The patient starts with a positive screen, so that is the wrong denominator."
        },
        {
          "id": "choice.flags3.20261107.f3-01.d3",
          "label": "About 90%",
          "isCorrect": false,
          "rationale": "This is 855/950, the specificity within reference-negative patients. It does not estimate reference positivity after a positive screen.",
          "distractorRationale": "This is 855/950, the specificity within reference-negative patients. It does not estimate reference positivity after a positive screen."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed preoperative screening audit. All consecutive patients received both tests.",
        "columnHeaders": [
          "Reference culture: MRSA detected",
          "Reference culture: MRSA not detected"
        ],
        "rowHeaders": [
          "Screen positive",
          "Screen negative"
        ],
        "cells": [
          [
            "40",
            "95"
          ],
          [
            "10",
            "855"
          ]
        ]
      },
      "explanation": "Start with the positive-screen row, then distinguish the two reference outcomes. Forty of the 135 positive screens have MRSA detected by culture, giving about 30%. Sensitivity and specificity use reference-status denominators instead; about 70% here is the reference-negative share of positive screens. These original constructed counts do not describe real MRSA assay performance or diagnose infection.",
      "supportingEvidenceClaimIds": [
        "claim.flags3.20261107.positive-result-denominator",
        "claim.flags3.20261107.audit-calculation",
        "claim.flags3.20261107.audit-alternative-denominators"
      ]
    },
    "originalVariantId": "question.statistics-ethics.predictive-value-prevalence.v4",
    "originalConceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "conceptMeaning": "same",
    "conceptVersionReason": "The existing concept already includes calculating PPV and distinguishing it from test characteristics. Only the clinical frame, data representation and wording change."
  },
  {
    "auditId": "F3-02",
    "ownerFlagId": "F3-02",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r7",
    "question": {
      "contentVersion": "question-authoring.2026-11-07.flags3-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v2.r7",
      "conceptId": "concept.achalasia.secondary-junction-lesion-assessment.v1",
      "stem": "Which procedure should be requested next for {patientName}'s swallowing problem?",
      "answerChoices": [
        {
          "id": "choice.flags3.20261107.f3-02.key",
          "label": "Endoscopic ultrasound with guided sampling",
          "isCorrect": true,
          "rationale": "The motor pattern can coexist with a secondary junction process. Weight loss, one-sided wall thickening and resistance despite unrevealing mucosal samples make wall assessment and directed tissue acquisition the next target.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags3.20261107.f3-02.d1",
          "label": "Functional lumen imaging with distensibility measurement",
          "isCorrect": false,
          "rationale": "The positional pressure difference could tempt further functional testing. A distensibility measurement would not determine what accounts for the focal CT wall abnormality beyond the sampled mucosa.",
          "distractorRationale": "The positional pressure difference could tempt further functional testing. A distensibility measurement would not determine what accounts for the focal CT wall abnormality beyond the sampled mucosa."
        },
        {
          "id": "choice.flags3.20261107.f3-02.d2",
          "label": "Timed barium swallow with tablet passage",
          "isCorrect": false,
          "rationale": "Quantifying emptying is credible for a motility question. It would not establish the cause of the focal junction-wall finding that remains unresolved after the mucosal samples.",
          "distractorRationale": "Quantifying emptying is credible for a motility question. It would not establish the cause of the focal junction-wall finding that remains unresolved after the mucosal samples."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Investigation record",
        "items": [
          {
            "label": "Upper endoscopy",
            "value": "No mucosal mass or fixed luminal narrowing. Resistance when the scope crossed the gastroesophageal junction."
          },
          {
            "label": "Junction mucosal biopsy",
            "value": "Mucosa present; malignant cells not identified."
          },
          {
            "label": "CT: gastric cardia and junction",
            "value": "Wall thickening is greater on one side and extends across the gastroesophageal junction."
          },
          {
            "label": "Pressure study: primary supine series",
            "value": "Catheter spans the junction. Median relaxation pressure above this laboratory's upper reference limit during separated water swallows."
          },
          {
            "label": "Pressure study: upright series",
            "value": "Median relaxation pressure within this laboratory's reference interval."
          },
          {
            "label": "Pressure study: body channels",
            "value": "No propagated distal contractions in either position."
          }
        ]
      },
      "explanation": "The primary pressure acquisition can support an achalasia motor pattern despite the upright reference-range value. That pattern does not establish a primary cause. Interpret the focal wall finding, weight loss and resistance together with the limited mucosal sample: endoscopic ultrasound can assess and sample the wall target. Another emptying or distensibility measurement addresses function rather than that unresolved target.",
      "supportingEvidenceClaimIds": [
        "claim.flags3.20261107.motor-pattern-scope",
        "claim.flags3.20261107.junction-wall-target"
      ]
    },
    "currentUpdate": "At the return visit, {patientName} reports continued unintentional weight loss.",
    "originalVariantId": "question.achalasia.manometric-recognition.v2.r6",
    "originalConceptId": "concept.achalasia.secondary-junction-lesion-assessment.v1",
    "conceptMeaning": "same",
    "conceptVersionReason": "The scored objective remains secondary junction-lesion assessment despite achalasia-pattern physiology. Reports and task are clarified; no new pressure threshold or tissue protocol is introduced."
  },
  {
    "auditId": "F3-03-type",
    "ownerFlagId": "F3-03",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.flags3.groin-ultrasound-classification.20261107",
    "questionVariantId": "question.groin-hernia.ultrasound-type.v1",
    "question": {
      "contentVersion": "question-authoring.2026-11-07.flags3-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.groin-hernia.ultrasound-type.v1",
      "conceptId": "concept.groin-hernia.ultrasound-compartment-classification.v1",
      "stem": "Which type of hernia do the ultrasound findings identify in {patientName}?",
      "answerChoices": [
        {
          "id": "choice.flags3.20261107.f3-03-type.key",
          "label": "Femoral hernia",
          "isCorrect": true,
          "rationale": "The neck lies below the inguinal ligament and medial to the common femoral vein, identifying the femoral-canal route.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags3.20261107.f3-03-type.d1",
          "label": "Direct inguinal hernia",
          "isCorrect": false,
          "rationale": "Direct inguinal anatomy is defined at Hesselbach's triangle medial to the inferior epigastric vessels. The recorded neck instead follows the below-ligament compartment beside the common femoral vein.",
          "distractorRationale": "Direct inguinal anatomy is defined at Hesselbach's triangle medial to the inferior epigastric vessels. The recorded neck instead follows the below-ligament compartment beside the common femoral vein."
        },
        {
          "id": "choice.flags3.20261107.f3-03-type.d2",
          "label": "Indirect inguinal hernia",
          "isCorrect": false,
          "rationale": "An indirect inguinal sac enters the deep ring lateral to the inferior epigastric vessels. The reported below-ligament neck and venous relationship identify a different route.",
          "distractorRationale": "An indirect inguinal sac enters the deep ring lateral to the inferior epigastric vessels. The reported below-ligament neck and venous relationship identify a different route."
        }
      ],
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
      "explanation": "The sac neck's relationship to the ligament and vein identifies a femoral hernia. Direct and indirect inguinal labels refer to different anatomical routes.",
      "supportingEvidenceClaimIds": [
        "claim.flags3.20261107.groin-compartment",
        "claim.flags3.20261107.direct-comparator",
        "claim.flags3.20261107.indirect-comparator"
      ]
    },
    "originalVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r10",
    "originalConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "conceptMeaning": "new_version",
    "conceptVersionReason": "New separately scored diagnostic sub-objective: classify a groin sac from ultrasound landmarks. The original repair-priority concept is retained for the following management node; no history is transferred between the two constructs."
  },
  {
    "auditId": "F3-03",
    "ownerFlagId": "F3-03",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r11",
    "question": {
      "contentVersion": "question-authoring.2026-11-07.flags3-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r11",
      "conceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "stem": "Which plan should be offered for {patientName}'s groin hernia at this visit?",
      "answerChoices": [
        {
          "id": "choice.flags3.20261107.f3-03.key",
          "label": "Plan elective hernia repair",
          "isCorrect": true,
          "rationale": "The established femoral anatomy supports timely elective repair despite improved function. The reducing, nontender presentation without obstructive features does not establish an emergency.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags3.20261107.f3-03.d1",
          "label": "Plan scheduled hernia surveillance",
          "isCorrect": false,
          "rationale": "Observation can be appropriate for selected minimally symptomatic inguinal hernias in men. Improvement in lifting does not extend that observation rule to the identified femoral route.",
          "distractorRationale": "Observation can be appropriate for selected minimally symptomatic inguinal hernias in men. Improvement in lifting does not extend that observation rule to the identified femoral route."
        },
        {
          "id": "choice.flags3.20261107.f3-03.d2",
          "label": "Plan emergency hernia exploration",
          "isCorrect": false,
          "rationale": "The femoral type warrants repair planning, but the current record does not show the persistent painful irreducible or obstructed presentation needed to favor emergency exploration here.",
          "distractorRationale": "The femoral type warrants repair planning, but the current record does not show the persistent painful irreducible or obstructed presentation needed to favor emergency exploration here."
        }
      ],
      "explanation": "Combine the established type with the current acuity. A stable reducing femoral hernia warrants timely elective repair planning even when symptoms have improved. The inguinal watchful-waiting rule for selected men does not apply to this anatomy. New pain, irreducibility or obstructive/ischemic concern would change the urgency; no fixed deadline or repair technique is specified.",
      "supportingEvidenceClaimIds": [
        "claim.flags3.20261107.reducible-femoral-plan",
        "claim.flags3.20261107.acute-boundary"
      ]
    },
    "currentUpdate": "The groin bulge disappears when {patientName} lies down. The groin is nontender, the abdomen is soft and not distended, and he reports no vomiting.",
    "originalVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r10",
    "originalConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "conceptMeaning": "same",
    "conceptVersionReason": "The original management objective and concept ID remain: apply femoral anatomy and acuity to repair priority. Classification is now independently scored in a new preceding node."
  }
];
export const QUESTION_FLAGS3_AUTHORING_CONCEPTS=[
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.predictive-value-prevalence",
    "displayName": "Relate positive predictive value to prevalence",
    "learningObjective": "Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.flags3.20261107.positive-result-denominator",
      "claim.flags3.20261107.audit-calculation",
      "claim.flags3.20261107.audit-alternative-denominators"
    ],
    "previousConceptId": null,
    "conceptMeaning": "same",
    "conceptVersionReason": "The existing concept already includes calculating PPV and distinguishing it from test characteristics. Only the clinical frame, data representation and wording change.",
    "historyMigration": "None. Preserve all original definitions/cards. The new classification construct does not inherit management history."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.achalasia.secondary-junction-lesion-assessment.v1",
    "displayName": "Investigate a secondary junction lesion despite achalasia-pattern physiology",
    "learningObjective": "Integrate positional motor findings with a discordant wall abnormality and select etiologic assessment before attributing the pattern to primary achalasia.",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "conceptType": "workup",
    "evidenceClaimIds": [
      "claim.flags3.20261107.motor-pattern-scope",
      "claim.flags3.20261107.junction-wall-target"
    ],
    "previousConceptId": null,
    "conceptMeaning": "same",
    "conceptVersionReason": "The scored objective remains secondary junction-lesion assessment despite achalasia-pattern physiology. Reports and task are clarified; no new pressure threshold or tissue protocol is introduced.",
    "historyMigration": "None. Preserve all original definitions/cards. The new classification construct does not inherit management history."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.groin-hernia.ultrasound-compartment-classification.v1",
    "displayName": "Classify a groin sac by ultrasound compartment",
    "learningObjective": "Classify a groin sac by interpreting its neck relative to the inguinal ligament and vascular landmarks.",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "conceptType": "diagnosis",
    "evidenceClaimIds": [
      "claim.flags3.20261107.groin-compartment",
      "claim.flags3.20261107.direct-comparator",
      "claim.flags3.20261107.indirect-comparator"
    ],
    "previousConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "conceptMeaning": "new_version",
    "conceptVersionReason": "New separately scored diagnostic sub-objective: classify a groin sac from ultrasound landmarks. The original repair-priority concept is retained for the following management node; no history is transferred between the two constructs.",
    "historyMigration": "None. Preserve all original definitions/cards. The new classification construct does not inherit management history."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "displayName": "Recognize the femoral exception to inguinal watchful waiting",
    "learningObjective": "Use current vascular/ligament landmarks to reclassify a groin sac and apply the repair boundary despite improved function.",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "conceptType": "management",
    "evidenceClaimIds": [
      "claim.flags3.20261107.reducible-femoral-plan",
      "claim.flags3.20261107.acute-boundary"
    ],
    "previousConceptId": null,
    "conceptMeaning": "same",
    "conceptVersionReason": "The original management objective and concept ID remain: apply femoral anatomy and acuity to repair priority. Classification is now independently scored in a new preceding node.",
    "historyMigration": "None. Preserve all original definitions/cards. The new classification construct does not inherit management history."
  }
] as const;
export const QUESTION_FLAGS3_HEADERS=[
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
    "patientName": "Nathan Brooks",
    "age": 54,
    "sex": "Male",
    "complaint": "Positive screening result",
    "presentation": "{patientName}, a 54-year-old man, attends the preoperative clinic to discuss a positive nasal MRSA screening result."
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "patientName": "Gavin Keller",
    "age": 66,
    "sex": "Male",
    "complaint": "Difficulty swallowing",
    "presentation": "{patientName}, a 66-year-old man, visits the surgery clinic because food and drinks pause behind the sternum and return at night."
  },
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "patientName": "Elliot Reed",
    "age": 59,
    "sex": "Male",
    "complaint": "Intermittent groin bulge",
    "presentation": "{patientName}, a 59-year-old man, returns to the surgery clinic with an intermittent right groin bulge. He now completes his usual caregiving lifts."
  }
] as const;
