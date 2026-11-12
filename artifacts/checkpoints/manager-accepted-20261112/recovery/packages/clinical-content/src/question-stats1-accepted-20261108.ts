import type {SyntheticClinicalCase,SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_STATS1_SOURCE_RELEASE,QUESTION_STATS1_REVISIONS,QUESTION_STATS1_STATEMENT_MAPPINGS} from "./question-stats1-20261108";
import {QUESTION_STATS1_SOURCES} from "./question-stats1-evidence-20261108";
import {QUESTION_STATS1_REPAIRED_DEFINITIONS,QUESTION_STATS1_REPAIRED_CLAIMS} from "./question-stats1-accepted-data-20261108";
import {QUESTION_STATS1_RETAINED_INPUT,QUESTION_STATS1_RETAINED_TIMINGS} from "./question-stats1-retained-input-20261108";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";

/** Explicit manager acceptance view. The independently reviewed source stays
 * immutable; 42 PASS questions/cases are reused exactly, not reconstructed. */
export const QUESTION_STATS1_ACCEPTED_SOURCE_VIEW_NAME="stats1-accepted" as const;
export const QUESTION_STATS1_ACCEPTED_REVISIONS=QUESTION_STATS1_REVISIONS.map(r=>
 QUESTION_STATS1_REPAIRED_DEFINITIONS.find(p=>p.auditId===r.auditId)??r);
export const QUESTION_STATS1_ACCEPTED_QUESTIONS=QUESTION_STATS1_ACCEPTED_REVISIONS.map(r=>r.question);
export const QUESTION_STATS1_ACCEPTED_CASES:SyntheticClinicalCase[]=QUESTION_STATS1_SOURCE_RELEASE.cases.map(cs=>{
 const r=QUESTION_STATS1_REPAIRED_DEFINITIONS.find(r=>r.caseId===cs.id);
 if(!r)return cs;
 const q=r.question,old=cs.decisionNodes[0]!;
 const choices=q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,
  rationale:a.rationale??a.distractorRationale??q.explanation,serviceRequest:null}));
 return {...cs,decisionNodes:[{...old,questionVariantId:q.id,stem:q.stem,exhibit:q.exhibit,
  answerChoices:choices,explanation:q.explanation,teachingPoint:q.explanation,
  terminalDispositions:choices.filter(a=>!a.isCorrect).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
   consequenceNarrative:"Review the statistical method before continuing.",clinicalRationale:a.rationale,sourceLabels:old.sourceLabels})),
 }],learningSummary:q.explanation};
});
export const QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_STATS1_SOURCE_RELEASE,id:"clinical.stats1-accepted-source.20261108.v2",cases:QUESTION_STATS1_ACCEPTED_CASES,
});
/** Superseding G06 removes its old registration trigger, not its stable
 * meaning. Restore only an exactly accepted missing concept at the same
 * registry stage, before later accepted concepts, without altering old cards. */
export function withAcceptedQuestionStats1Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 const ids=new Set(release.concepts.map(c=>c.id));
 const extra=QUESTION_STATS1_RETAINED_INPUT.concepts.filter(c=>!ids.has(c.id)&&QUESTION_STATS1_ACCEPTED_REVISIONS.some(r=>
  r.question.conceptId===c.id&&QUESTION_SHIP_MANIFEST.accepted.some(a=>a.acceptanceId===r.auditId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&
   a.questionVariantId===r.questionVariantId&&a.conceptId===c.id&&a.sourceView==="stats1-accepted")));
 return extra.length?{...release,concepts:[...release.concepts,...extra]}:release;
}
/** These two archive rows previously depended on superseded acceptance IDs.
 * Keep them at their original positions in the global timing sequence. */
export const QUESTION_STATS1_RETIRED_FLAGS2_TIMING_ENTRIES=QUESTION_STATS1_RETAINED_TIMINGS.filter(t=>
 t.questionVariantId===QUESTION_STATS1_REVISIONS.find(r=>r.auditId==="S42")!.originalVariantId);
export const QUESTION_STATS1_RETIRED_FLAGS3_TIMING_ENTRIES=QUESTION_STATS1_RETAINED_TIMINGS.filter(t=>
 t.questionVariantId===QUESTION_STATS1_REVISIONS.find(r=>r.auditId==="S44")!.originalVariantId);
/** Every accepted choice is a statistical analysis, never a patient test order.
 * Keep all previous exact timing rows for frozen historical encounters. */
export const QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=QUESTION_STATS1_ACCEPTED_REVISIONS.map(r=>({
 caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,classification:{kind:"no_test"},
}));
export const QUESTION_STATS1_ACCEPTED_STATEMENT_MAPPINGS=QUESTION_STATS1_STATEMENT_MAPPINGS.map(m=>{
 const r=QUESTION_STATS1_REPAIRED_DEFINITIONS.find(r=>r.caseId===m.caseId);
 return {...m,...(r?{contentVersion:r.question.contentVersion,questionVariantId:r.questionVariantId,
  evidenceClaimIds:r.question.supportingEvidenceClaimIds}:{}),
  identity:"Unchanged stable concept. Exact manager acceptance grants no clinical approval; all historical bindings, frozen cases and FSRS histories remain attached to their original identities.",
  sourceView:"stats1-accepted",managerDecision:"docs/research/question-stats1-manager-decision-20261108.md"};
});
export const QUESTION_STATS1_ACCEPTED_SOURCES=QUESTION_STATS1_SOURCES.map(s=>({...s,
 evidenceClaimIds:[...new Set([...s.evidenceClaimIds,...QUESTION_STATS1_REPAIRED_CLAIMS.filter(c=>c.sourceIds.includes(s.id)).map(c=>c.id)])]}));
export {QUESTION_STATS1_REPAIRED_CLAIMS};
