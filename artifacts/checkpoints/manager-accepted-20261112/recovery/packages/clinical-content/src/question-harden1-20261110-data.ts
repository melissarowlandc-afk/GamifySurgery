import type {QuestionVariant} from "./pilot-schema";
import type {SyntheticClinicalRelease} from "./schema";
export interface Harden1Definition {auditId:string;originalTargetIds:string[];caseId:string;nodeId:string;header:{patientName:string;age:number;sex:"Male"|"Female";complaint:string;presentation:string};currentUpdate:string|null;educationalTier:number;acuity:string;question:QuestionVariant;concept:SyntheticClinicalRelease["concepts"][number]&{reviewStatus:"needs_clinician_review";contentVersion:string;aiAssistedDrafting:boolean;lastClinicianReview:null;educationalTier:number;evidenceClaimIds:string[];previousConceptId:string;relatedPreviousConceptIds:string[];conceptMeaning:string;conceptVersionReason:string;historyMigration:string};}
export const QUESTION_HARDEN1_DEFINITIONS:Harden1Definition[]=[
  {
    "auditId": "H1-HERNIA",
    "originalTargetIds": [
      "H1-01",
      "H1-02"
    ],
    "caseId": "case.harden1.groin-wall-threat.20261110",
    "nodeId": "node.harden1.groin-wall-threat.20261110",
    "header": {
      "patientName": "Elliot Reed",
      "age": 59,
      "sex": "Male",
      "complaint": "Painful groin lump",
      "presentation": "{patientName}, a 59-year-old man, presents to the surgery clinic with a newly tender right groin lump. He still passes stool and has not vomited."
    },
    "currentUpdate": null,
    "educationalTier": 1,
    "acuity": "urgent",
    "question": {
      "contentVersion": "question-authoring.2026-11-10.harden1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.groin-hernia.ultrasound-type-and-intervention.v2",
      "conceptId": "concept.groin-hernia.femoral-defect-repair-priority.v2",
      "stem": "Which hernia type and hernia-directed intervention fit these findings in {patientName}?",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Targeted groin ultrasound",
        "items": [
          {
            "label": "Sac neck",
            "value": "Inferior to the inguinal ligament; medial to the common femoral vein."
          },
          {
            "label": "Bowel at the neck",
            "value": "Part of one bowel wall protrudes through the opening. The remaining lumen stays within the abdomen."
          },
          {
            "label": "Compression",
            "value": "The protruding wall remains at the opening."
          },
          {
            "label": "Doppler",
            "value": "No mural signal in the protruding wall. Adjacent bowel has mural signal at the same settings."
          }
        ]
      },
      "answerChoices": [
        {
          "id": "choice.harden1.20261110.groin.key",
          "label": "Femoral hernia; operative exploration",
          "isCorrect": true,
          "rationale": "The below-ligament neck medial to the vein identifies the femoral route. The trapped partial wall with absent mural signal raises concern for strangulation despite the patent remaining lumen; emergency operative exploration is appropriate rather than a manual reduction attempt.",
          "distractorRationale": null
        },
        {
          "id": "choice.harden1.20261110.groin.d1",
          "label": "Femoral hernia; manual reduction",
          "isCorrect": false,
          "rationale": "This identifies the route correctly and applies an intervention appropriate for selected acute nonreducing hernias without suspected strangulation. It overweights stool passage: the reported mural perfusion raises a different concern even while the remaining lumen permits passage.",
          "distractorRationale": "This identifies the route correctly and applies an intervention appropriate for selected acute nonreducing hernias without suspected strangulation. It overweights stool passage: the reported mural perfusion raises a different concern even while the remaining lumen permits passage."
        },
        {
          "id": "choice.harden1.20261110.groin.d2",
          "label": "Indirect inguinal hernia; operative exploration",
          "isCorrect": false,
          "rationale": "This recognizes threatened bowel but misclassifies the neck. An indirect inguinal sac enters above the ligament, lateral to the inferior epigastric vessels, rather than through the reported compartment.",
          "distractorRationale": "This recognizes threatened bowel but misclassifies the neck. An indirect inguinal sac enters above the ligament, lateral to the inferior epigastric vessels, rather than through the reported compartment."
        },
        {
          "id": "choice.harden1.20261110.groin.d3",
          "label": "Indirect inguinal hernia; manual reduction",
          "isCorrect": false,
          "rationale": "This combines two plausible misreadings: assigning an inguinal route from a groin lump and treating continued intestinal passage as evidence that a reduction attempt is appropriate. Both the neck compartment and mural findings oppose that combination.",
          "distractorRationale": "This combines two plausible misreadings: assigning an inguinal route from a groin lump and treating continued intestinal passage as evidence that a reduction attempt is appropriate. Both the neck compartment and mural findings oppose that combination."
        }
      ],
      "explanation": "The neck below the inguinal ligament and medial to the vein identifies a femoral hernia.\nA trapped portion of bowel wall can lose perfusion while the remaining lumen still permits passage: a Richter-type configuration. Suspected strangulation warrants emergency operative exploration, rather than manual reduction.\nThe closest error is femoral hernia with manual reduction: stool passage does not establish wall viability. Reduction can be appropriate in selected acute nonreducing hernias without suspected strangulation. This asks the hernia-directed intervention, not the first resuscitation order or repair technique.",
      "supportingEvidenceClaimIds": [
        "claim.harden1.20261110.femoral-compartment",
        "claim.harden1.20261110.indirect-compartment",
        "claim.harden1.20261110.partial-wall-passage",
        "claim.harden1.20261110.mural-perfusion",
        "claim.harden1.20261110.suspected-strangulation-repair",
        "claim.harden1.20261110.reduction-boundary"
      ]
    },
    "concept": {
      "contentVersion": "question-authoring.2026-11-10.harden1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.groin-hernia.femoral-defect-repair-priority.v2",
      "displayName": "Groin ultrasound and intervention",
      "learningObjective": "Interpret the ultrasound neck compartment and partial bowel-wall perfusion to select hernia type and operative exploration versus manual reduction despite continued intestinal passage.",
      "conceptType": "management",
      "earliestFacilityStage": 1,
      "educationalTier": 1,
      "evidenceClaimIds": [
        "claim.harden1.20261110.femoral-compartment",
        "claim.harden1.20261110.indirect-compartment",
        "claim.harden1.20261110.partial-wall-passage",
        "claim.harden1.20261110.mural-perfusion",
        "claim.harden1.20261110.suspected-strangulation-repair",
        "claim.harden1.20261110.reduction-boundary"
      ],
      "previousConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "relatedPreviousConceptIds": [
        "concept.groin-hernia.ultrasound-compartment-classification.v1"
      ],
      "conceptMeaning": "new_version",
      "conceptVersionReason": "Material expansion from elective femoral-repair priority and a separate landmark classification to one integrated type/intervention construct with suspected partial-wall ischemia. New v2; neither original card is reassigned or retired. The pair-to-one proposal requires manager composition review.",
      "historyMigration": "None. Old definitions, FSRS cards, frozen encounters and saves remain intact; candidate-only version is separately scored if accepted."
    }
  },
  {
    "auditId": "H1-PHOSPHATE",
    "originalTargetIds": [
      "H1-03"
    ],
    "caseId": "case.harden1.phosphate-handling.20261110",
    "nodeId": "node.harden1.phosphate-handling.20261110",
    "header": {
      "patientName": "Maya Chen",
      "age": 31,
      "sex": "Female",
      "complaint": "Nutrition follow-up",
      "presentation": "{patientName}, a 31-year-old woman, returns to the surgery clinic to review results from her nutrition restart after prolonged poor intake. Serum creatinine was stable at sampling."
    },
    "currentUpdate": null,
    "educationalTier": 1,
    "acuity": "routine",
    "question": {
      "contentVersion": "question-authoring.2026-11-10.harden1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3",
      "conceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2",
      "stem": "Which interpretation of {patientName}'s renal phosphate handling is supported by these results?",
      "exhibit": {
        "kind": "table",
        "caption": "Simultaneous blood and urine samples, before phosphate replacement (constructed data)",
        "columnHeaders": [
          "Serum (mg/dL)",
          "Urine (mg/dL)"
        ],
        "rowHeaders": [
          "Phosphate",
          "Creatinine"
        ],
        "cells": [
          [
            "1.0",
            "10"
          ],
          [
            "1.0",
            "20"
          ]
        ]
      },
      "answerChoices": [
        {
          "id": "choice.harden1.20261110.phosphate.key",
          "label": "Renal phosphate loss is inappropriately high.",
          "isCorrect": true,
          "rationale": "Fractional phosphate excretion is (10 x 1.0)/(1.0 x 20) x 100 = 50%. With concurrent serum phosphate of 1.0 mg/dL, that is inappropriate loss rather than the expected conservation. It does not identify the cause of the renal loss or exclude concurrent redistribution.",
          "distractorRationale": null
        },
        {
          "id": "choice.harden1.20261110.phosphate.d1",
          "label": "Renal phosphate conservation is appropriately increased.",
          "isCorrect": false,
          "rationale": "This anchors on nutrition restart and its familiar cellular-shift explanation without testing the renal response. Creatinine-normalized phosphate excretion is 50%, not the low excretion expected during this degree of hypophosphatemia.",
          "distractorRationale": "This anchors on nutrition restart and its familiar cellular-shift explanation without testing the renal response. Creatinine-normalized phosphate excretion is 50%, not the low excretion expected during this degree of hypophosphatemia."
        },
        {
          "id": "choice.harden1.20261110.phosphate.d2",
          "label": "Renal phosphate handling remains unclassifiable here.",
          "isCorrect": false,
          "rationale": "This assumes a timed urine collection is required before any interpretation. Simultaneous phosphate and creatinine concentrations permit fractional-excretion assessment; the supplied pretreatment samples show inappropriate loss. They do not quantify daily phosphate balance.",
          "distractorRationale": "This assumes a timed urine collection is required before any interpretation. Simultaneous phosphate and creatinine concentrations permit fractional-excretion assessment; the supplied pretreatment samples show inappropriate loss. They do not quantify daily phosphate balance."
        }
      ],
      "explanation": "Fractional phosphate excretion = (urine phosphate x serum creatinine)/(serum phosphate x urine creatinine) x 100 = (10 x 1)/(1 x 20) x 100 = 50%.\nAt a low simultaneous serum phosphate, the kidney should conserve phosphate; this result supports a renal-loss component.\nFeeding-associated cellular uptake can coexist, but does not account for this renal response. The samples assess current handling, not daily phosphate balance or the specific cause of loss.",
      "supportingEvidenceClaimIds": [
        "claim.harden1.20261110.phosphate-fraction",
        "claim.harden1.20261110.phosphate-conservation",
        "claim.harden1.20261110.phosphate-redistribution",
        "claim.harden1.20261110.phosphate-diagnostic-boundary",
        "claim.harden1.20261110.phosphate-multifactorial"
      ]
    },
    "concept": {
      "contentVersion": "question-authoring.2026-11-10.harden1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2",
      "displayName": "Renal phosphate handling after nutrition restart",
      "learningObjective": "Normalize simultaneous serum and urine phosphate with creatinine, then distinguish inappropriate renal loss from the expected conservation during hypophosphatemia after a nutrition restart.",
      "conceptType": "applied_science",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "evidenceClaimIds": [
        "claim.harden1.20261110.phosphate-fraction",
        "claim.harden1.20261110.phosphate-conservation",
        "claim.harden1.20261110.phosphate-redistribution",
        "claim.harden1.20261110.phosphate-diagnostic-boundary",
        "claim.harden1.20261110.phosphate-multifactorial"
      ],
      "previousConceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
      "relatedPreviousConceptIds": [],
      "conceptMeaning": "new_version",
      "conceptVersionReason": "The old objective recalls insulin-linked cellular uptake. This v2 instead tests interpretation of paired renal-handling data and avoids assigning every postfeeding fall to redistribution. That is a material change, so the old concept/card and live question remain exact.",
      "historyMigration": "None. Old definitions, FSRS cards, frozen encounters and saves remain intact; candidate-only version is separately scored if accepted."
    }
  }
];
export const QUESTION_HARDEN1_STATEMENT_MAPPINGS=[
  {
    "contentVersion": "question-authoring.2026-11-10.harden1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.harden1.groin-wall-threat.20261110",
    "questionVariantId": "question.groin-hernia.ultrasound-type-and-intervention.v2",
    "evidenceClaimIds": [
      "claim.harden1.20261110.femoral-compartment",
      "claim.harden1.20261110.indirect-compartment",
      "claim.harden1.20261110.partial-wall-passage",
      "claim.harden1.20261110.mural-perfusion",
      "claim.harden1.20261110.suspected-strangulation-repair",
      "claim.harden1.20261110.reduction-boundary"
    ],
    "fields": [
      {
        "field": "presentation / ultrasound bowel at neck / compression",
        "claimIds": [
          "claim.harden1.20261110.partial-wall-passage"
        ],
        "kind": "Original qualitative constructed observations",
        "limitation": "No copied case, disease-selection weight, probability, exact duration or published image."
      },
      {
        "field": "ultrasound sac neck / anatomy labels and rationales",
        "claimIds": [
          "claim.harden1.20261110.femoral-compartment",
          "claim.harden1.20261110.indirect-compartment"
        ],
        "kind": "Anatomical interpretation",
        "limitation": "The neck, not superficial lump location, determines type."
      },
      {
        "field": "ultrasound Doppler / urgency / explanation",
        "claimIds": [
          "claim.harden1.20261110.partial-wall-passage",
          "claim.harden1.20261110.mural-perfusion",
          "claim.harden1.20261110.suspected-strangulation-repair"
        ],
        "kind": "Evaluation and urgency synthesis",
        "limitation": "Concern for strangulation; no claim of proven necrosis or diagnostic accuracy."
      },
      {
        "field": "manual-reduction comparator / author counterfactual",
        "claimIds": [
          "claim.harden1.20261110.reduction-boundary"
        ],
        "kind": "Verified management boundary",
        "limitation": "Counterfactual changes the full clinical/imaging assessment of strangulation concern; detectable Doppler alone does not exclude strangulation."
      }
    ],
    "demographicBasis": "Fictional name; canonical age, sex and neutral vitals retained from the exact live source. No sex-specific risk or disease probability inferred."
  },
  {
    "contentVersion": "question-authoring.2026-11-10.harden1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.harden1.phosphate-handling.20261110",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3",
    "evidenceClaimIds": [
      "claim.harden1.20261110.phosphate-fraction",
      "claim.harden1.20261110.phosphate-conservation",
      "claim.harden1.20261110.phosphate-redistribution",
      "claim.harden1.20261110.phosphate-diagnostic-boundary",
      "claim.harden1.20261110.phosphate-multifactorial"
    ],
    "fields": [
      {
        "field": "presentation / simultaneous pretreatment table",
        "claimIds": [
          "claim.harden1.20261110.phosphate-fraction",
          "claim.harden1.20261110.phosphate-conservation",
          "claim.harden1.20261110.phosphate-redistribution"
        ],
        "kind": "Original finite synthetic observations",
        "limitation": "1.0/10/1.0/20 mg/dL are constructed paired concentrations, not a threshold, study dataset or clinical performance estimate. Stable creatinine and pretreatment timing constrain interpretation."
      },
      {
        "field": "key / rationales / worked fraction",
        "claimIds": [
          "claim.harden1.20261110.phosphate-fraction",
          "claim.harden1.20261110.phosphate-conservation"
        ],
        "kind": "Source-supported formula and independent arithmetic",
        "limitation": "50% is derived from original inputs; no laboratory reference-range boundary is needed for this remote result."
      },
      {
        "field": "feedback / concurrent contributors",
        "claimIds": [
          "claim.harden1.20261110.phosphate-redistribution",
          "claim.harden1.20261110.phosphate-diagnostic-boundary",
          "claim.harden1.20261110.phosphate-multifactorial"
        ],
        "kind": "Diagnostic boundary",
        "limitation": "No exclusive cause or refeeding syndrome diagnosis, treatment, timing rule or new management protocol."
      }
    ],
    "demographicBasis": "Fictional name; canonical age, sex and neutral vitals retained from the exact live source. No sex-specific risk or disease probability inferred."
  }
] as const;
