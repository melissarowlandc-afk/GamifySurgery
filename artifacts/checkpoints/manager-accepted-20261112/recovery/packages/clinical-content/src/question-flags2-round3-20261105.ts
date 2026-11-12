import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, SyntheticClinicalRelease, TestedConcept } from "./schema";
import { validateSyntheticClinicalRelease } from "./schema";
import { applyQuestionBankBatch2aRevisions } from "./question-bank-batch2a-20261104";
import { questionQualityTimingRevisions } from "./question-quality-pilot-20261028";
import { QUESTION_FLAGS2_ROUND3_DEFINITIONS, QUESTION_FLAGS2_ROUND3_CONCEPT_VERSIONS } from "./question-flags2-round3-20261105-data";
import { QUESTION_FLAGS2_ROUND3_RETAINED_INPUT, QUESTION_FLAGS2_ROUND3_RETAINED_TIMINGS } from "./question-flags2-round3-retained-input-20261105";

export const QUESTION_FLAGS2_ROUND3_REVISIONS = QUESTION_FLAGS2_ROUND3_DEFINITIONS;
export const QUESTION_FLAGS2_ROUND3_QUESTIONS = QUESTION_FLAGS2_ROUND3_REVISIONS.map(r => r.question);
export const QUESTION_FLAGS2_ROUND3_AUTHORING_CONCEPTS = QUESTION_FLAGS2_ROUND3_CONCEPT_VERSIONS;
export const QUESTION_FLAGS2_ROUND3_TESTED_CONCEPTS: TestedConcept[] = QUESTION_FLAGS2_ROUND3_AUTHORING_CONCEPTS.map(
  ({id,displayName,learningObjective,earliestFacilityStage,conceptType}) => ({id,displayName,learningObjective,earliestFacilityStage,conceptType}),
);
export const QUESTION_FLAGS2_ROUND3_SOURCE_VIEW_NAME = "flags2-round3" as const;

/** Retained authoring view only. The explicit one-node composition must be
 * reviewed before integration; it is never applied to the default live bank. */
export function applyQuestionFlags2Round3Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  for (const r of QUESTION_FLAGS2_ROUND3_REVISIONS) {
    const cs=cases.find(c=>c.id===r.caseId);
    const original=QUESTION_FLAGS2_ROUND3_RETAINED_INPUT.cases.find(c=>c.id===r.caseId);
    if (JSON.stringify(cs)!==JSON.stringify(original)) throw new Error("Flags2 round3 exact retained source binding changed: "+r.auditId);
  }
  return applyQuestionBankBatch2aRevisions(cases,QUESTION_FLAGS2_ROUND3_REVISIONS).map(cs=>{
    const r=QUESTION_FLAGS2_ROUND3_REVISIONS.find(r=>r.caseId===cs.id);
    if (!r) return cs;
    const projected=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
    const node={...projected,terminalDispositions:projected.answerChoices.filter(a=>!a.isCorrect).map(a=>({
      answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
      consequenceNarrative:"The encounter recorded “"+a.label+"”.",
      clinicalRationale:a.rationale??projected.explanation,sourceLabels:projected.sourceLabels,
    }))};
    return {...cs,decisionNodes:[node],learningSummary:node.explanation,
      ...(cs.patientPresentationRevision?{patientPresentationRevision:{...cs.patientPresentationRevision,
        revisedDecisionStems:cs.patientPresentationRevision.revisedDecisionStems?.filter(n=>n.decisionNodeId===node.id),
      }}:{}),
    };
  });
}

export function createQuestionFlags2Round3SourceView(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const ids=new Set(release.concepts.map(c=>c.id));
  return {...release,id:"clinical.flags2-round3-retained-source.20261105.v1",
    concepts:[...release.concepts,...QUESTION_FLAGS2_ROUND3_TESTED_CONCEPTS.filter(c=>!ids.has(c.id))],
    cases:applyQuestionFlags2Round3Revisions(release.cases)};
}
export const QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE=validateSyntheticClinicalRelease(createQuestionFlags2Round3SourceView(QUESTION_FLAGS2_ROUND3_RETAINED_INPUT));
export function questionFlags2Round3TimingRevisions(entries:AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
  return questionQualityTimingRevisions(entries,QUESTION_FLAGS2_ROUND3_REVISIONS);
}
export const QUESTION_FLAGS2_ROUND3_TIMING_ENTRIES=questionFlags2Round3TimingRevisions(QUESTION_FLAGS2_ROUND3_RETAINED_TIMINGS);

export { QUESTION_FLAGS2_ROUND3_PARKED } from "./question-flags2-round3-20261105-data";
export { QUESTION_FLAGS2_ROUND3_CLAIMS } from "./question-flags2-round3-evidence-20261105";
export { QUESTION_FLAGS2_ROUND3_RETAINED_INPUT, QUESTION_FLAGS2_ROUND3_RETAINED_TIMINGS, QUESTION_FLAGS2_ROUND3_CANDIDATE_TEST_ORDER_RECORDS } from "./question-flags2-round3-retained-input-20261105";
