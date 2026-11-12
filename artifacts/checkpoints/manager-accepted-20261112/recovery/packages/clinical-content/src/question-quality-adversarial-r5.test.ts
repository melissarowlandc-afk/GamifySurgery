import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
 QUESTION_QUALITY_PRE_ADVERSARIAL_R6_RELEASE as live, QUESTION_QUALITY_PRE_ADVERSARIAL_R5_RELEASE as before,
 QUESTION_QUALITY_PRE_ADVERSARIAL_R6_REVISIONS as current, QUESTION_QUALITY_REVISIONS as pilot,
 QUESTION_QUALITY_ADVERSARIAL_R5_REVISIONS as revisions, QUESTION_QUALITY_ADVERSARIAL_R5_AUTHORING_CONCEPTS as versions,
 QUESTION_QUALITY_ADVERSARIAL_R5_CLAIMS as claims, QUESTION_QUALITY_ADVERSARIAL_R5_SOURCES as sources,
 QUESTION_QUALITY_PRE_ADVERSARIAL_R6_TIMING_ENTRIES as timings, applyQuestionQualityAdversarialR5Revisions,
} from "./index";
import type {SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionQualityRevision} from "./question-quality-pilot-20261028";
const entry=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/adversarial-r5-before-20261102.json",import.meta.url),"utf8")) as {
 cases:SyntheticClinicalCase[];revisions:QuestionQualityRevision[];timings:AnswerChoiceTimingRegistryEntry[];
 review:Array<{id:string;verdict:string;basicVerdict?:string;cues:unknown[];fairness:unknown[];suggestions:unknown[]}>;
 concepts:typeof live.concepts;approvals:Array<{auditId:string}>;
};
const clean=<T>(v:T):T=>v===undefined?v:JSON.parse(JSON.stringify(v)) as T;
const caseOf=(id:string)=>live.cases.find(c=>c.id===id)!;

describe("fifth author revision: scoped repairs and frozen reviewed versions",()=>{
 it("revises exactly the 26 returned versions with all 172 specific note responses",()=>{
  expect(revisions).toHaveLength(26);
  expect(new Set(revisions.map(r=>r.auditId))).toEqual(new Set(entry.review.filter(r=>r.verdict==="REVISE").map(r=>r.id)));
  let notes=0;
  for(const r of revisions){
   const old=entry.revisions.find(p=>p.auditId===r.auditId)!,review=entry.review.find(p=>p.id===r.auditId)!;
   expect(r.previousQuestionVariantId).toBe(old.questionVariantId);
   expect(r.questionVariantId).toBe(old.questionVariantId.replace(/\.r(\d+)$/,(_,n:string)=>".r"+(Number(n)+1)));
   expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-02.v8"});
   expect(r.reviewResponse!.sourceReviewId).toContain("adversarial-review4-20261102.json#"+r.auditId);
   for(const k of ["cues","fairness","suggestions"] as const){expect(r.reviewResponse!.noteResponses[k]).toHaveLength(review[k].length);notes+=review[k].length;}
   const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;
   expect(n.questionVariantId).toBe(r.questionVariantId);expect(n.shuffleAnswers).toBe(true);
   expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
  }
  expect(notes).toBe(172);
 });
 it("preserves all 47 exact PASS questions and their visible presentation/profile/node fields",()=>{
  const passed=entry.review.filter(r=>r.verdict==="PASS");expect(passed).toHaveLength(47);
  for(const p of passed){
   const old=entry.revisions.find(r=>r.auditId===p.id)!,now=current.find(r=>r.auditId===p.id)!,a=caseOf(now.caseId),b=entry.cases.find(c=>c.id===old.caseId)!;
   expect(clean(now.question),p.id).toEqual(clean(old.question));
   expect(a.presentation,p.id).toBe(b.presentation);expect(a.chiefComplaint,p.id).toBe(b.chiefComplaint);
   expect(clean(a.approvedInstantiationProfiles),p.id).toEqual(clean(b.approvedInstantiationProfiles));
   expect(clean(a.decisionNodes.find(n=>n.id===now.nodeId)),p.id).toEqual(clean(b.decisionNodes.find(n=>n.id===old.nodeId)));
  }
 });
 it("keeps eleven exact owner approvals and the two active frozen basic versions",()=>{
  expect(entry.approvals).toHaveLength(11);
  for(const a of entry.approvals){const old=entry.revisions.find(r=>r.auditId===a.auditId)!,now=pilot.find(r=>r.auditId===a.auditId)!;
   expect(clean(now.question)).toEqual(clean(old.question));expect(now.question.reviewStatus).toBe("clinically_approved");
   const cs=caseOf(now.caseId),b=entry.cases.find(c=>c.id===now.caseId)!;expect(cs.presentation).toBe(b.presentation);expect(cs.chiefComplaint).toBe(b.chiefComplaint);expect(cs.approvedInstantiationProfiles).toEqual(b.approvedInstantiationProfiles);
  }
  const frozenBasic=entry.review.filter(r=>r.basicVerdict==="ACCEPT_BASIC"&&r.id!=="B29");expect(frozenBasic).toHaveLength(2);
  for(const a of frozenBasic)expect(current.find(r=>r.auditId===a.id)!.question).toEqual(entry.revisions.find(r=>r.auditId===a.id)!.question);
 });
 it("repairs B29 under the express manager exception while retaining its old version",()=>{
  const r=revisions.find(r=>r.auditId==="B29")!,old=entry.revisions.find(r=>r.auditId==="B29")!;
  expect(r.basicRecallIntentional).toBe(true);expect(r.reviewResponse!.selfCheck.difficulty).toBe("foundational");
  expect(r.currentUpdate).toContain("post-reversal clinical assessment has not yet been completed");
  expect(r.question.exhibit).toEqual(old.question.exhibit);
  expect(r.question.answerChoices.map(c=>c.label)).toEqual(old.question.answerChoices.map(c=>c.label));
  expect(before.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!.questionVariantId).toBe(old.questionVariantId);
  expect(revisions.filter(r=>r.basicRecallIntentional).map(r=>r.auditId)).toEqual(["B29"]);
 });
 it("adds one explicit evidence-status construct and preserves all 388 prior concept identities",()=>{
  expect(versions).toHaveLength(1);expect(live.concepts).toHaveLength(389);expect(live.concepts.slice(0,388)).toEqual(entry.concepts);
  const v=versions[0]!;expect(v.id).toBe("concept.colonic-lipoma.endoscopic-recognition.v3");expect(v.previousConceptId).toBe("concept.colonic-lipoma.endoscopic-recognition.v2");
  expect(v.reviewStatus).toBe("needs_clinician_review");expect(v.lastClinicianReview).toBeNull();expect(v.versioningReason).toBeTruthy();
  expect(new Set(v.revisedItemIds)).toEqual(new Set(["B21-context","B22-context"]));
  for(const id of v.revisedItemIds)expect(revisions.find(r=>r.auditId===id)!.question.conceptId).toBe(v.id);
 });
 it("retains every frozen timing row, changes no keyed service and does not mutate source cases",()=>{
  expect(timings).toHaveLength(1740);
  for(const row of entry.timings)expect(clean(timings.find(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId))).toEqual(row);
  const source=structuredClone(before.cases),serialized=JSON.stringify(source);applyQuestionQualityAdversarialR5Revisions(source);expect(JSON.stringify(source)).toBe(serialized);
  const targets=new Set(revisions.map(r=>r.caseId));for(const cs of before.cases)if(!targets.has(cs.id))expect(caseOf(cs.id)).toEqual(cs);
  expect(revisions.filter(r=>r.clinicalBinding.previousKeyServiceId!==r.clinicalBinding.nextKeyServiceId)).toHaveLength(0);
  for(const r of revisions){const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;expect(n.resultGateAfter).toEqual(r.clinicalBinding.nextResultGate);expect(n.primaryConceptId).toBe(r.clinicalBinding.nextConceptId);}
 });
 it("maps new clinical assertions to five original claims with explicit source reuse limitations",()=>{
  expect(claims).toHaveLength(5);expect(sources).toHaveLength(4);
  for(const claim of claims){expect(revisions.some(r=>r.question.supportingEvidenceClaimIds.includes(claim.id)),claim.id).toBe(true);expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.limitation).toBeTruthy();
   for(const id of claim.sourceIds){const s=sources.find(s=>s.id===id)!;expect(s.evidenceClaimIds).toContain(claim.id);expect(s.completeCitation).toBeTruthy();expect(s.officialUrl).toMatch(/^https:/);expect(s.licenseLabel).toBeTruthy();expect(s.authorityAssessment).toContain("offline");}
  }
 });
 it("keeps all testing-choice previews and the passed ulcer rescue/skin staging contexts",()=>{
  for(const r of revisions){const row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row).toBeDefined();if(row.classification.kind!=="test_choices")continue;
   expect(row.classification.choices.map(c=>c.choiceId)).toEqual(r.question.answerChoices.map(c=>c.id));
   for(const choice of r.question.answerChoices)if(/\b(?:MRI|CT|ultrasound|manometry|FNA|PET)\b/i.test(choice.label))
    expect(row.classification.choices.find(c=>c.choiceId===choice.id)!.timing.kind,r.auditId+" "+choice.label).toBe("test");
  }
  for(const id of ["B21-context","B22-context"]){const r=revisions.find(r=>r.auditId===id)!;expect(timings.find(t=>t.questionVariantId===r.questionVariantId)!.classification.kind).toBe("no_test");}
  for(const id of ["B40-context","B11","B12","B17","B18"]){const old=entry.revisions.find(r=>r.auditId===id)!,now=current.find(r=>r.auditId===id)!;expect(now.question).toEqual(old.question);}
 });
});
