import {validateSyntheticClinicalRelease,type SyntheticClinicalRelease,type AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {QUESTION_FLAGS5_FINAL_ACCEPTED_DATA as data} from "./question-flags5-final-accepted-data-20261116";

export const QUESTION_FLAGS5_FINAL_ACCEPTED_ROWS=data.rows;
export const QUESTION_FLAGS5_FINAL_ACCEPTED_SOURCE_VIEWS=Object.fromEntries(Object.entries(data.views).map(([name,view])=>[name,validateSyntheticClinicalRelease(view)]));
export const QUESTION_FLAGS5_FINAL_ACCEPTED_CASES=Object.values(QUESTION_FLAGS5_FINAL_ACCEPTED_SOURCE_VIEWS).flatMap(v=>v.cases);
export const QUESTION_FLAGS5_FINAL_ACCEPTED_QUESTIONS=data.questions;
export const QUESTION_FLAGS5_FINAL_FROZEN_PRESERVATION=data.frozen;
export const QUESTION_FLAGS5_FINAL_ACCEPTED_NEW_CONCEPTS=data.newConcepts;
export const QUESTION_FLAGS5_FINAL_AUTHORED_CONCEPTS=data.authoredConcepts;
export const QUESTION_FLAGS5_FINAL_ACCEPTED_CLAIMS=data.claims;
export const QUESTION_FLAGS5_FINAL_ACCEPTED_BASIS_CLAIMS=data.basisClaims;
export const QUESTION_FLAGS5_FINAL_ACCEPTED_SOURCES=data.sources;
export const QUESTION_FLAGS5_FINAL_STATEMENT_MAPPINGS=data.mappings;
function accepted(id:string):boolean {
  const row=data.rows.find(r=>r.questionVariantId===id);
  return !!row&&QUESTION_SHIP_MANIFEST.accepted.some(r=>r.acceptanceId===row.acceptanceId&&r.caseId===row.caseId&&
    r.nodeId===row.nodeId&&r.questionVariantId===row.questionVariantId&&r.conceptId===row.conceptId&&r.sourceView===row.sourceView);
}
export function withAcceptedQuestionFlags5FinalConcepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const concepts=[...release.concepts];
  for(const c of data.newConcepts)if(data.rows.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId))&&!concepts.some(p=>p.id===c.id))concepts.push(c);
  return {...release,concepts};
}
export const QUESTION_FLAGS5_FINAL_ACCEPTED_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=JSON.parse(JSON.stringify(data.timings.filter(t=>accepted(t.questionVariantId))));
export const QUESTION_FLAGS5_FINAL_ACCEPTED_TEST_ORDER_RECORDS=data.orders.filter(t=>accepted(t.questionVariantId));
