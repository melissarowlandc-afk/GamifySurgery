import { buildFamily } from "./family-builder";
import { variants } from "./spec-utils";
import { REMAINING10_SOURCES as S } from "./source-catalog-remaining10";

const RCA = "claim.gs028f.safety.rca-retrospective";
const FMEA = "claim.gs028f.safety.fmea-prospective";

const safetyVariants = variants([
  {
    "slug": "wrong-medicine-close-call",
    "complaint": "Medication handoff review",
    "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, comes for follow-up after an outside procedure. Another person's medication bag was nearly handed over at discharge, but the mismatch was caught. The center is reconstructing that particular event and examining identification and handoff processes. The patient has received a letter about the review and asks what kind of investigation the center is conducting.",
    "stem": "Which safety method fits reconstruction of {patientName}'s completed medication-handoff close call and its contributing systems problems?",
    "correct": [
      "Root cause analysis",
      "The review starts with a specific completed close call and reconstructs how identification and handoff systems contributed. That is the retrospective purpose of RCA."
    ],
    "wrong": [
      [
        "Healthcare failure mode and effects analysis",
        "Healthcare FMEA anticipates possible process failures prospectively. This review instead starts with a particular close call that already occurred."
      ],
      [
        "Individual performance audit",
        "The described review examines contributing identification and handoff systems. An individual performance judgment alone does not describe that event-centered systems purpose."
      ],
      [
        "Patient satisfaction survey",
        "The patient asks about reconstruction of a specific safety event. Measuring satisfaction would answer a different question from how the systems contributed."
      ]
    ],
    "explanation": "This is root cause analysis: reconstruction of a completed close call to identify systems contributors. The review is retrospective, rather than a prospective assessment of possible future failures.",
    "claims": [
      "claim.gs028f.safety.rca-retrospective",
      "claim.gs028f.safety.fmea-prospective"
    ],
    "ageYears": [
      40,
      68
    ],
    "sexLabels": [
      "Female",
      "Male"
    ]
  },
  {
    "slug": "future-handoff",
    "complaint": "Discharge-process questions",
    "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, is preparing for care at an outside procedural center. The center plans a new discharge-medication handoff and has not started using it. Its safety team will examine each step for possible failures and consider safeguards in advance. The patient asks about the review mentioned in the center's letter before the planned care visit.",
    "stem": "Which safety method fits advance assessment of possible failures in {patientName}'s planned discharge-medication handoff process?",
    "correct": [
      "Healthcare FMEA",
      "The team is anticipating ways a process might fail before using it. That prospective process-centered task fits healthcare FMEA."
    ],
    "wrong": [
      [
        "Root cause analysis",
        "RCA reconstructs a completed event or close call. No such event is the starting point of this planned workflow assessment."
      ],
      [
        "Individual performance audit",
        "The planned task examines potential failures across process steps. It is not primarily an assessment of one worker's performance."
      ],
      [
        "Patient satisfaction survey",
        "The team is identifying potential process failures before launch. Asking about satisfaction would not identify the prospective method described."
      ]
    ],
    "explanation": "Healthcare FMEA fits the prospective assessment of possible handoff failures before the workflow starts. The starting point is a planned process, not a completed event to reconstruct.",
    "claims": [
      "claim.gs028f.safety.rca-retrospective",
      "claim.gs028f.safety.fmea-prospective"
    ],
    "ageYears": [
      33,
      62
    ],
    "sexLabels": [
      "Male",
      "Female"
    ]
  },
  {
    "slug": "delayed-report-purpose",
    "complaint": "Delayed report review",
    "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings an outside center's completed investigation after a biopsy report reached the wrong inbox and follow-up was delayed. The document calls the review root cause analysis and discusses the reporting and handoff systems involved. The patient asks what that label means before discussing the center's findings and the proposed changes at today's follow-up visit.",
    "stem": "What is root cause analysis intended to assess in {patientName}'s completed delayed-report event?",
    "correct": [
      "Reconstruct the event and its systems contributors",
      "RCA works backward from the completed routing event to examine how systems contributed. It is broader than assigning an individual performance verdict."
    ],
    "wrong": [
      [
        "Predict failures before launching an untested process",
        "That anticipatory task describes healthcare FMEA. This document instead starts with a particular routing event that has already occurred."
      ],
      [
        "Compare satisfaction scores across completed clinic visits",
        "Comparing satisfaction does not reconstruct the delayed-report event or identify its contributing systems problems. It answers a different review question."
      ],
      [
        "Judge an individual worker's performance in isolation",
        "Individual blame is not RCA's central purpose. Restricting the review to one worker leaves its contributing systems question unanswered."
      ]
    ],
    "explanation": "RCA reconstructs the completed delayed-report event and examines systems contributors. It does not primarily forecast a new workflow or decide blame for one worker in isolation.",
    "claims": [
      "claim.gs028f.safety.rca-retrospective",
      "claim.gs028f.safety.fmea-prospective"
    ],
    "ageYears": [
      47,
      73
    ],
    "sexLabels": [
      "Female",
      "Male"
    ]
  },
  {
    "slug": "fmea-question",
    "complaint": "Labeling-process questions",
    "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, asks about an outside clinic's safety meeting before a planned specimen-labeling workflow starts. The team says it is using healthcare FMEA and plans to examine possible failures in each step. No completed labeling event is being reconstructed. The patient has brought the meeting notice and asks what the planned review is intended to do.",
    "stem": "Which discussion focus fits healthcare FMEA of the planned specimen-labeling workflow that {patientName} asks about?",
    "correct": [
      "Potential failures before a problem occurs",
      "Healthcare FMEA examines how the planned process could fail before those problems occur. It does not require a completed event as its starting point."
    ],
    "wrong": [
      [
        "Contributors to a completed labeling event",
        "That focus starts with a past event and fits the retrospective purpose of RCA. The described meeting is about a planned workflow."
      ],
      [
        "Individual blame for a completed labeling error",
        "Blame for a past error neither describes the prospective process task nor supplies its focus on potential failures."
      ],
      [
        "Prior patients' satisfaction with the labeling encounter",
        "Satisfaction may be another question, but it does not describe healthcare FMEA's stated task of anticipating potential process failures."
      ]
    ],
    "explanation": "Focus on potential failures before the labeling workflow starts. That prospective process purpose defines the healthcare FMEA task described here, without requiring a previous labeling error.",
    "claims": [
      "claim.gs028f.safety.rca-retrospective",
      "claim.gs028f.safety.fmea-prospective"
    ],
    "ageYears": [
      29,
      57
    ],
    "sexLabels": [
      "Male",
      "Female"
    ]
  }
]);

// Wording revision: 2026-10-15, round 2 Phase 2A.
const family = buildFamily({
  slug: "patient-safety", label: "Which safety review fits?", sources: [S.rca, S.fmea],
  claims: [
    { id: RCA, statement: "Root cause analysis retrospectively reconstructs an adverse event or close call to identify contributing systems problems, rather than treating individual blame as its central purpose.", sourceIds: [S.rca.id], category: "definition", certainty: "high", limitation: "Current AHRQ primer, reviewed June 15, 2024, directly supports the retrospective systems purpose. This is method classification, not a complete RCA protocol, proof of legal liability, mandated institutional policy or a guarantee of improvement.", population: "Patients discussing an already completed patient-specific safety event." },
    { id: FMEA, statement: "Healthcare failure mode and effects analysis is a proactive method for identifying potential process failures before those problems occur.", sourceIds: [S.fmea.id], category: "definition", certainty: "high", limitation: "Current VA NCPS proactive-risk overview, updated August 28, 2026, supports the healthcare FMEA variant. No claim that every prospective assessment is FMEA, no copied scoring matrix or decision tree, and no statement that the method eliminates risk.", population: "Patients discussing prospective safety review of a planned healthcare process." },
  ],
  concepts: [{
    id: "concept.gs028f.outcomes.rca-versus-fmea-purpose", displayName: "Match RCA and FMEA to the safety task",
    learningObjective: "Distinguish retrospective event-centered root cause analysis from prospective process-centered healthcare failure mode and effects analysis.", stage: 0, educationalTier: 0, conceptType: "applied_science", evidenceClaimIds: [RCA, FMEA],
    variants: safetyVariants,
  }],
});

// This batch's older builder does not forward teachingPoint. Attach the existing
// optional field locally to both authoring questions and runtime nodes.
const lessons: Record<string, string> = {
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v1": "Root cause analysis starts with an event or close call that already happened and reconstructs contributing systems problems. Here the medication handoff is the starting event. Remember: start with what happened and examine how the process contributed. Healthcare FMEA instead looks ahead for possible process failures; neither label is a verdict of individual blame.",
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v2": "Healthcare FMEA looks ahead at a process to identify potential failures before those problems occur. Here the planned discharge handoff is being examined before use. Remember the starting point: a process to anticipate, rather than an event to reconstruct. That purpose differs from retrospective RCA and does not guarantee that all risk will disappear.",
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v3": "An RCA label identifies a retrospective systems question: what happened in this event, and which process problems contributed? The delayed routing event is its starting point. Remember to look beyond a worker in isolation. The method's purpose does not, by itself, establish legal liability, assign individual blame, or guarantee that improvement has occurred.",
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v4": "Healthcare FMEA asks how a planned process might fail before those problems occur. This meeting therefore focuses on potential labeling failures, rather than reconstructing a past event. Remember: look ahead at the process. That is a method classification, not a promise of zero risk or a complete set of scoring and safeguard instructions."
};
const choiceRationales = new Map(safetyVariants.flatMap(variant => [variant.correct, ...variant.distractors]).map(choice => [choice.id, choice.rationale]));
export const PATIENT_SAFETY_FAMILY = {
  ...family,
  questions: family.questions.map(question => ({
    ...question, teachingPoint: lessons[question.id]!,
    answerChoices: question.answerChoices.map(choice => ({
      ...choice, rationale: choiceRationales.get(choice.id)!,
      distractorRationale: choice.isCorrect ? null : choiceRationales.get(choice.id)!,
    })),
  })),
  cases: family.cases.map(clinicalCase => ({
    ...clinicalCase,
    decisionNodes: clinicalCase.decisionNodes.map(node => ({
      ...node, teachingPoint: lessons[node.questionVariantId]!,
      answerChoices: node.answerChoices.map(choice => ({ ...choice, rationale: choiceRationales.get(choice.id)! })),
    })),
  })),
};
