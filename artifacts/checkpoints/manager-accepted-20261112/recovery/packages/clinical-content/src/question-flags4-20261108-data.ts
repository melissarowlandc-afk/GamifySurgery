import type {QuestionVariant} from "./pilot-schema";
export interface Flags4Definition {auditId:string;caseId:string;nodeId:string;originalVariantId:string;questionVariantId:string;currentUpdate:string;question:QuestionVariant;conceptMeaning:string;conceptVersionReason:string;}
export const QUESTION_FLAGS4_DEFINITIONS:Flags4Definition[]=[
  {
    "auditId": "F4-01",
    "caseId": "case.gs028f.nutrition.c1-metabolic-transition",
    "nodeId": "node.gs028f.nutrition.c1-metabolic-transition.1",
    "originalVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r1",
    "currentUpdate": "Serum phosphate fell as carbohydrate feeding resumed.",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.flags4-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r1",
      "conceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
      "stem": "Which physiological process links carbohydrate reintroduction to {patientName}'s phosphate decline?",
      "answerChoices": [
        {
          "id": "choice.flags4.20261108.key",
          "label": "Increased cellular uptake of phosphate",
          "isCorrect": true,
          "rationale": "Carbohydrate reintroduction can increase insulin-associated cellular uptake, moving phosphate from the circulation into cells. This is the feeding-related mechanism being asked about.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags4.20261108.d1",
          "label": "Increased urinary excretion of phosphate",
          "isCorrect": false,
          "rationale": "This selects removal from the body rather than redistribution into cells. It confuses a different route of phosphate handling with the metabolic response to carbohydrate reintroduction.",
          "distractorRationale": "This selects removal from the body rather than redistribution into cells. It confuses a different route of phosphate handling with the metabolic response to carbohydrate reintroduction."
        },
        {
          "id": "choice.flags4.20261108.d2",
          "label": "Decreased intestinal absorption of phosphate",
          "isCorrect": false,
          "rationale": "This treats the lower serum concentration as reduced transfer from the intestine. It does not identify the insulin-linked redistribution associated with carbohydrate reintroduction.",
          "distractorRationale": "This treats the lower serum concentration as reduced transfer from the intestine. It does not identify the insulin-linked redistribution associated with carbohydrate reintroduction."
        }
      ],
      "explanation": "Carbohydrate reintroduction increases insulin-associated phosphate uptake into cells as metabolism shifts toward synthesis.\nThe renal and intestinal options describe removal or reduced entry, rather than this redistribution.\nA phosphate fall by itself does not establish refeeding syndrome.",
      "supportingEvidenceClaimIds": [
        "claim.flags4.20261108.carbohydrate-phosphate-uptake",
        "claim.flags4.20261108.anabolic-transition",
        "claim.flags4.20261108.diagnostic-boundary"
      ]
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "The existing concept explicitly tests carbohydrate-associated insulin, cellular phosphate uptake and the anabolic transition. This revision asks about the phosphate-handling process within that objective; no diagnostic, treatment or threshold objective is added."
  }
];
export const QUESTION_FLAGS4_HEADER={
  "caseId": "case.gs028f.nutrition.c1-metabolic-transition",
  "patientName": "Maya Chen",
  "age": 31,
  "sex": "Female",
  "complaint": "Nutrition follow-up",
  "presentation": "{patientName}, a 31-year-old woman, is reviewed after a monitored nutrition restart following prolonged poor intake."
} as const;
