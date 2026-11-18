import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {QUESTION_FLAGS5_ACCEPTED_DATA as data} from "./question-flags5-accepted-data-20261116";

export const QUESTION_FLAGS5_ACCEPTED_ROWS = data.rows;
export const QUESTION_FLAGS5_ACCEPTED_SOURCE_VIEWS = Object.fromEntries(Object.entries(data.views).map(([name,view])=>[name,validateSyntheticClinicalRelease(view)]));
export const QUESTION_FLAGS5_ACCEPTED_CASES = Object.values(QUESTION_FLAGS5_ACCEPTED_SOURCE_VIEWS).flatMap(v=>v.cases);
export const QUESTION_FLAGS5_ACCEPTED_QUESTIONS = data.questions;
export const QUESTION_FLAGS5_FROZEN_PRESERVATION = data.frozen;
export const QUESTION_FLAGS5_ACCEPTED_NEW_CONCEPTS = data.newConcepts;
export const QUESTION_FLAGS5_ACCEPTED_CLAIMS = data.claims;
export const QUESTION_FLAGS5_ACCEPTED_BASIS_CLAIMS = data.basisClaims;
export const QUESTION_FLAGS5_ACCEPTED_SOURCES = data.sources;
export const QUESTION_FLAGS5_ACCEPTED_STATEMENT_MAPPINGS = data.mappings;
export const QUESTION_FLAGS5_WITHDRAWN_ROWS = data.withdrawnRows;
export const QUESTION_FLAGS5_ACCEPTANCE_DECISIONS = data.decisions;
function accepted(id:string):boolean {
  const row=data.rows.find(r=>r.questionVariantId===id);
  return !!row&&QUESTION_SHIP_MANIFEST.accepted.some(r=>r.acceptanceId===row.acceptanceId&&r.caseId===row.caseId&&
    r.nodeId===row.nodeId&&r.questionVariantId===row.questionVariantId&&r.conceptId===row.conceptId&&r.sourceView===row.sourceView);
}
export function withAcceptedQuestionFlags5Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const concepts=[...release.concepts];
  for(const {entry,index} of data.retainedConcepts)if(!concepts.some(c=>c.id===entry.id))concepts.splice(index,0,entry);
  for(const c of data.newConcepts)if(data.rows.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId))&&!concepts.some(x=>x.id===c.id))concepts.push(c);
  return {...release,concepts};
}
/** Withdrawing current authority never withdraws a frozen exact wait tuple. */
export function restoreQuestionFlags5HistoricalTimings(registry:AnswerChoiceTimingRegistryEntry[]):void {
  for(const {entry,index} of data.retainedTimings){
    const old=registry.filter(t=>t.caseId===entry.caseId&&t.nodeId===entry.nodeId&&t.questionVariantId===entry.questionVariantId);
    if(!old.length)registry.splice(index,0,JSON.parse(JSON.stringify(entry)) as AnswerChoiceTimingRegistryEntry);
    else if(old.length!==1||JSON.stringify(old[0])!==JSON.stringify(entry))throw new Error("Conflicting frozen flags5 timing: "+entry.questionVariantId);
  }
}
export const QUESTION_FLAGS5_ACCEPTED_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[] = JSON.parse(JSON.stringify(data.timings.filter(t=>accepted(t.questionVariantId))));
// Exact historical records remain available to encounters already holding them.
export const QUESTION_FLAGS5_ACCEPTED_TEST_ORDER_RECORDS = [...data.retainedOrders,...data.orders.filter(t=>accepted(t.questionVariantId))];
