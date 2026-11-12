import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
 QUESTION_NEW_N1_PRE_RELEASE as live, QUESTION_FLAGS_PRE_ROUND3_RELEASE as before,
 QUESTION_FLAG_ROUND3_REVISIONS as revisions, QUESTION_FLAG_ROUND3_AUTHORING_CONCEPTS as concepts,
 QUESTION_FLAG_ROUND3_CLAIMS as claims, QUESTION_FLAGS_PRE_ROUND3_TIMING_ENTRIES as oldTimings,
 QUESTION_FLAG_ROUND3_TIMING_ENTRIES as newTimings, QUESTION_QUALITY_CLINICAL_APPROVALS as approvals,
 applyQuestionFlagRound3Revisions,
} from "./index";
const timings=[...oldTimings,...newTimings];
const baseline=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags-round3-before-20261104.json",import.meta.url),"utf8")) as {
 release:typeof live;timings:typeof timings;approvals:typeof approvals;packet:{id:string;caseId:string;nodeId:string}[];
};
const clean=<T>(x:T):T=>JSON.parse(JSON.stringify(x)) as T;
const ids=["F02","F03","F04","F05","F06","F07","F08","F09","F10","F11","F13","F15","F16","F17"];
describe("question flags final author round: preservation and clinical contracts",()=>{
 it("retains the exact entry bank and every non-target case/node, including both passes and batch 2a",()=>{
  expect(clean(before)).toEqual(baseline.release);expect(clean(approvals)).toEqual(baseline.approvals);
  let cases=0,nodes=0;
  for(const old of before.cases){const now=live.cases.find(c=>c.id===old.id)!,rr=revisions.filter(r=>r.caseId===old.id);
   if(!rr.length){expect(clean(now),old.id).toEqual(clean(old));cases++;}
   expect(now.decisionNodes.map(n=>n.id)).toEqual(old.decisionNodes.map(n=>n.id));
   for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){expect(clean(now.decisionNodes.find(x=>x.id===n.id)),n.id).toEqual(clean(n));nodes++;}
  }
  expect(cases).toBe(1096);expect(nodes).toBe(1409);
  for(const id of ["F01","F12","F14"]){const p=baseline.packet.find(p=>p.id===id)!;expect(clean(live.cases.find(c=>c.id===p.caseId))).toEqual(clean(before.cases.find(c=>c.id===p.caseId)));}
 });
 it("adds exactly fourteen r4 drafts and eight independently versioned scored constructs",()=>{
  expect(revisions.map(r=>r.auditId)).toEqual(ids);expect(concepts).toHaveLength(8);
  expect(live.concepts.slice(0,before.concepts.length)).toEqual(before.concepts);
  expect(before.concepts).toHaveLength(414);expect(live.concepts).toHaveLength(422);
  for(const r of revisions){
   expect(r.questionVariantId).toBe(r.previousQuestionVariantId.replace(/\.r3$/,".r4"));
   expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-04.v13"});
   const version=concepts.find(c=>c.revisedItemIds.includes(r.auditId));
   if(version){expect(version.previousConceptId).toBe(r.clinicalBinding.previousConceptId);expect(version.reviewStatus).toBe("needs_clinician_review");expect(version.lastClinicianReview).toBeNull();}
   else expect(r.clinicalBinding.nextConceptId).toBe(r.clinicalBinding.previousConceptId);
  }
 });
 it("preserves old timing rows and supplies an exact timing for every offered new test",()=>{
  expect(clean(oldTimings)).toEqual(baseline.timings);expect(oldTimings).toHaveLength(1810);
  expect(clean(timings.slice(0,1810))).toEqual(baseline.timings);expect(timings).toHaveLength(1824);
  for(const r of revisions){const row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row).toBeDefined();
   if(row.classification.kind==="test_choices")for(const choice of row.classification.choices){
    expect(choice.choiceLabel).toBe(r.question.answerChoices.find(c=>c.id===choice.choiceId)!.label);
    expect(choice.timing).toEqual(r.choiceTimingOverrides![choice.choiceId]);
   }
  }
 });
 it("preserves node/result/key-service identities and complete patient/task presentation",()=>{
  for(const r of revisions){const a=before.cases.find(c=>c.id===r.caseId)!,b=live.cases.find(c=>c.id===r.caseId)!;
   const old=a.decisionNodes.find(n=>n.id===r.nodeId)!,n=b.decisionNodes.find(n=>n.id===r.nodeId)!;
   expect(n.resultGateAfter).toEqual(old.resultGateAfter);expect(n.primaryConceptId).toBe(r.clinicalBinding.nextConceptId);
   expect(n.answerChoices.find(c=>c.isCorrect)!.serviceRequest).toEqual(old.answerChoices.find(c=>c.isCorrect)!.serviceRequest);
   expect(n.shuffleAnswers).toBe(true);expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
   expect(b.presentation).toContain("{patientName}");expect(b.presentation).toMatch(/\d+-year-old (woman|man|person)/);expect(n.stem).toContain("{patientName}");
   expect(b.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
  }
 });
 it("corrects the F15 premise consistently without inventing gas numbers or a treatment instruction",()=>{
  const r=revisions.find(r=>r.auditId==="F15")!,q=r.question;
  expect(q.exhibit?.kind).toBe("table");expect(JSON.stringify(q.exhibit)).toContain("Within the interval");
  expect(q.answerChoices.find(c=>c.isCorrect)!.label).toContain("acidemia not demonstrated");
  expect(q.answerChoices.filter(c=>c.label.includes("acidemia not demonstrated"))).toHaveLength(2);
  expect(q.answerChoices.filter(c=>c.label.includes("respiratory acidemia demonstrated"))).toHaveLength(2);
  expect(q.explanation).not.toContain("fits respiratory acidemia");
 });
 it("keeps the later abscess task untouched and maps every new application claim",()=>{
  const r=revisions.find(r=>r.auditId==="F11")!,a=before.cases.find(c=>c.id===r.caseId)!,b=live.cases.find(c=>c.id===r.caseId)!;
  expect(b.decisionNodes[1]).toEqual(a.decisionNodes[1]);expect(b.presentation).toContain("procedure has not yet occurred");
  expect(claims).toHaveLength(13);
  for(const c of claims){expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.sourceIds.length).toBeGreaterThan(0);expect(c.basisClaimIds.length).toBeGreaterThan(0);expect(c.verificationScope).toContain("no fresh source retrieval");}
 });
 it("rejects a projection over a changed starting clinical identity",()=>{
  const cases=clean(before.cases);cases.find(c=>c.id===revisions[0]!.caseId)!.decisionNodes[0]!.primaryConceptId="concept.altered";
  expect(()=>applyQuestionFlagRound3Revisions(cases)).toThrow(/clinical binding changed/);
 });
});
