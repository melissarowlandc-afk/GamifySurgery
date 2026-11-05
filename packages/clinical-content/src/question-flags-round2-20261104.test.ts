import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
  QUESTION_BANK_PRE_BATCH2A_RELEASE as live,QUESTION_FLAGS_ROUND1_RELEASE as before,
  QUESTION_FLAG_ROUND2_REVISIONS as revisions,QUESTION_FLAG_ROUND2_AUTHORING_CONCEPTS as concepts,
  QUESTION_FLAGS_ROUND1_TIMING_ENTRIES as oldTimings,QUESTION_BANK_PRE_BATCH2A_TIMING_ENTRIES as timings,
  QUESTION_QUALITY_CLINICAL_APPROVALS as approvals,applyQuestionFlagRound2Revisions,
} from "./index";
import type {SyntheticClinicalCase} from "./schema";
const baseline=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags-round2-before-20261104.json",import.meta.url),"utf8")) as {
 release:typeof live;timings:typeof timings;approvals:typeof approvals;
};
const clean=<T>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;

describe("question flags round two: additive application drafts",()=>{
  it("retains the complete round-one bank, old concepts, approvals and all unflagged records",()=>{
    expect(clean(before)).toEqual(baseline.release);expect(clean(approvals)).toEqual(baseline.approvals);
    expect(live.concepts.slice(0,before.concepts.length)).toEqual(before.concepts);
    let frozenCases=0,frozenNodes=0;
    for(const old of before.cases){const now=live.cases.find(c=>c.id===old.id)!;
      const rr=revisions.filter(r=>r.caseId===old.id);
      if(!rr.length){expect(clean(now),old.id).toEqual(clean(old));frozenCases++;}
      expect(now.decisionNodes.map(n=>n.id)).toEqual(old.decisionNodes.map(n=>n.id));
      for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){expect(clean(now.decisionNodes.find(x=>x.id===n.id)),n.id).toEqual(clean(n));frozenNodes++;}
    }
    expect(frozenCases).toBe(1094);expect(frozenNodes).toBe(1407);
  });
  it("creates exactly sixteen r3 drafts and explicitly versions fourteen changed constructs",()=>{
    expect(revisions).toHaveLength(16);expect(concepts).toHaveLength(14);expect(live.concepts).toHaveLength(412);
    for(const r of revisions){
      expect(r.questionVariantId).toBe(r.previousQuestionVariantId.replace(/\.r2$/,".r3"));
      expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-04.v12"});
      expect(r.adversarialReview?.status).toBe("awaiting_independent_re_review");
      const c=concepts.find(c=>c.revisedItemIds.includes(r.auditId));
      if(c){expect(c.previousConceptId).toBe(r.clinicalBinding.previousConceptId);expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();}
      else {expect(["F06","F10"]).toContain(r.auditId);expect(r.clinicalBinding.nextConceptId).toBe(r.clinicalBinding.previousConceptId);}
    }
  });
  it("preserves old timing identities and supplies exact classifications for every new choice",()=>{
    expect(oldTimings).toHaveLength(1783);expect(timings).toHaveLength(1799);
    expect(clean(timings.slice(0,oldTimings.length))).toEqual(baseline.timings);
    for(const r of revisions){
      const row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row).toBeDefined();
      if(row.classification.kind==="test_choices"){
        expect(row.classification.choices.map(c=>[c.choiceId,c.choiceLabel])).toEqual(r.question.answerChoices.map(c=>[c.id,c.label]));
        for(const c of row.classification.choices)expect(c.timing).toEqual(r.choiceTimingOverrides![c.choiceId]);
      }else expect(Object.values(r.choiceTimingOverrides!).every(t=>t.kind==="no_test")).toBe(true);
    }
  });
  it("keeps node/result/key-service contracts and complete patient/task presentation",()=>{
    for(const r of revisions){
      const a=before.cases.find(c=>c.id===r.caseId)!,b=live.cases.find(c=>c.id===r.caseId)!;
      const old=a.decisionNodes.find(n=>n.id===r.nodeId)!,n=b.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.primaryConceptId).toBe(r.clinicalBinding.nextConceptId);expect(n.resultGateAfter).toEqual(old.resultGateAfter);
      expect(n.answerChoices.find(c=>c.isCorrect)!.serviceRequest).toEqual(old.answerChoices.find(c=>c.isCorrect)!.serviceRequest);
      expect(n.shuffleAnswers).toBe(true);expect([3,4]).toContain(n.answerChoices.length);
      expect(b.chiefComplaint!.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(b.presentation).toContain("{patientName}");expect(b.presentation).toMatch(/\d+-year-old (?:woman|man|person)/);
      expect(n.stem).toContain("{patientName}");
      for(const text of [n.stem,n.explanation,n.teachingPoint??"",...n.answerChoices.map(a=>a.rationale)])
        expect(text).not.toMatch(/pipeline|invented|handed to the learner|recorded[^.!?]{0,80}\bclaim\b|this item|source.verification/i);
    }
  });
  it("keeps the unsupported thyroid variant unchanged and the future abscess task intact",()=>{
    expect(revisions.some(r=>r.auditId==="F14")).toBe(false);
    const held=before.cases.find(c=>c.decisionNodes.some(n=>n.questionVariantId==="question.thyroid-nodule.fna-selection.v2"))!;
    expect(live.cases.find(c=>c.id===held.id)).toEqual(held);
    const r=revisions.find(r=>r.auditId==="F11")!,a=before.cases.find(c=>c.id===r.caseId)!,b=live.cases.find(c=>c.id===r.caseId)!;
    expect(b.decisionNodes[1]).toEqual(a.decisionNodes[1]);
    expect(b.presentation).toContain("procedure has not yet occurred");
  });
  it("rejects projection onto a different starting clinical binding",()=>{
    const cases=clean(before.cases) as SyntheticClinicalCase[];
    cases.find(c=>c.id===revisions[0]!.caseId)!.decisionNodes[0]!.primaryConceptId="concept.altered";
    expect(()=>applyQuestionFlagRound2Revisions(cases)).toThrow(/clinical binding changed/);
  });
});
