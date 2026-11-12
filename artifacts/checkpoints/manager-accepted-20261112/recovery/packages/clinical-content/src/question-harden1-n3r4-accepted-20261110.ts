import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {QUESTION_HARDEN1_SOURCE_RELEASE,QUESTION_HARDEN1_QUESTIONS,QUESTION_HARDEN1_CONCEPTS,QUESTION_HARDEN1_TIMING_ENTRIES} from "./question-harden1-20261110";
import {QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE,QUESTION_N3R4_ACCEPTED_QUESTIONS,QUESTION_N3R4_ACCEPTED_REVIEWS,
 QUESTION_N3R4_ACCEPTED_TIMINGS,QUESTION_HARDEN1_N3R4_ACCEPTANCE_ROWS} from "./question-harden1-n3r4-accepted-data-20261110";

/** Manager acceptance is editorial. Every exact reviewed clinical version
 * remains needs_clinician_review; no content or meaning is silently rewritten. */
export const QUESTION_HARDEN1_ACCEPTANCE_SOURCE=QUESTION_HARDEN1_SOURCE_RELEASE;
export const QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS=QUESTION_HARDEN1_N3R4_ACCEPTANCE_ROWS;
export const QUESTION_HARDEN1_N3R4_ACCEPTED_QUESTIONS=[...QUESTION_HARDEN1_QUESTIONS.filter(q=>QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS.some(r=>r.questionVariantId===q.id)),...QUESTION_N3R4_ACCEPTED_QUESTIONS];
export const QUESTION_HARDEN1_N3R4_ACCEPTED_CASES=QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS.map(r=>
 (r.sourceView==="harden1-round1"?QUESTION_HARDEN1_ACCEPTANCE_SOURCE:QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE).cases.find(c=>c.id===r.caseId)!);
const accepted=(id:string)=>QUESTION_SHIP_MANIFEST.accepted.some(r=>r.questionVariantId===id&&QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS.some(a=>
 a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView));
export const QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=[
 ...QUESTION_HARDEN1_TIMING_ENTRIES,...QUESTION_N3R4_ACCEPTED_TIMINGS].filter(t=>accepted(t.questionVariantId));
export function withAcceptedHarden1N3r4Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 const ids=new Set(release.concepts.map(c=>c.id));
 const added=[...QUESTION_HARDEN1_CONCEPTS,...QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE.concepts].filter(c=>!ids.has(c.id)&&QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId)));
 return {...release,concepts:[...release.concepts,...added.map(c=>({id:c.id,displayName:c.displayName,learningObjective:c.learningObjective,earliestFacilityStage:c.earliestFacilityStage,conceptType:c.conceptType}))]};
}
export {QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE,QUESTION_N3R4_ACCEPTED_REVIEWS};
export {QUESTION_HARDEN1_SOURCE_RELEASE,QUESTION_HARDEN1_QUESTIONS,QUESTION_HARDEN1_CONCEPTS,
 QUESTION_HARDEN1_CLAIMS,QUESTION_HARDEN1_BASIS_CLAIMS,QUESTION_HARDEN1_SOURCES,QUESTION_HARDEN1_STATEMENT_MAPPINGS,
 QUESTION_HARDEN1_RETAINED_INPUT} from "./question-harden1-20261110";
