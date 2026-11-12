import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
  QUESTION_QUALITY_PRE_ADVERSARIAL_R4_RELEASE as live, QUESTION_QUALITY_PRE_ADVERSARIAL_R3_RELEASE as before,
  QUESTION_QUALITY_PRE_ADVERSARIAL_R4_REVISIONS as current, QUESTION_QUALITY_REVISIONS as pilot,
  QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS as revisions,
  QUESTION_QUALITY_ADVERSARIAL_R3_CLAIMS as claims, QUESTION_QUALITY_ADVERSARIAL_R3_SOURCES as sources,
  QUESTION_QUALITY_PRE_ADVERSARIAL_R4_TIMING_ENTRIES as timings, applyQuestionQualityAdversarialR3Revisions,
} from "./index";
import type {SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionQualityRevision} from "./question-quality-pilot-20261028";
const entry=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/adversarial-r3-before-20261102.json",import.meta.url),"utf8")) as {
  cases:SyntheticClinicalCase[];revisions:QuestionQualityRevision[];timings:AnswerChoiceTimingRegistryEntry[];
  review:Array<{id:string;verdict:string;cues:unknown[];fairness:unknown[];suggestions:unknown[]}>;
  concepts:typeof live.concepts;approvals:Array<{auditId:string}>;
};
const clean=<T>(v:T):T=>v===undefined?v:JSON.parse(JSON.stringify(v)) as T;
const caseOf=(id:string)=>live.cases.find(c=>c.id===id)!;
describe("third author revision: passed identities, deliberate basic scope and frozen compatibility",()=>{
  it("advances exactly the 56 returned versions and binds every second-review note",()=>{
    expect(revisions).toHaveLength(56);
    expect(new Set(revisions.map(r=>r.auditId))).toEqual(new Set(entry.review.filter(r=>r.verdict==="REVISE").map(r=>r.id)));
    expect(revisions.filter(r=>r.basicRecallIntentional)).toHaveLength(35);
    for(const r of revisions){
      const old=entry.revisions.find(p=>p.auditId===r.auditId)!,review=entry.review.find(p=>p.id===r.auditId)!;
      expect(r.previousQuestionVariantId).toBe(old.questionVariantId);
      expect(r.questionVariantId).toBe(old.questionVariantId.replace(/\.r(\d+)$/,(_,n:string)=>".r"+(Number(n)+1)));
      expect(r.question.conceptId).toBe(old.question.conceptId);
      expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-02.v6"});
      expect(r.reviewResponse!.sourceReviewId).toContain("adversarial-review2-20261102.json#"+r.auditId);
      for(const k of ["cues","fairness","suggestions"] as const)expect(r.reviewResponse!.noteResponses[k]).toHaveLength(review[k].length);
      if(r.basicRecallIntentional){expect(r.basicRecallJustification).toBeTruthy();expect(r.reviewResponse!.selfCheck.difficulty).toBe("foundational");}
      else expect(r.reviewResponse!.selfCheck.reasoningSteps.length).toBeGreaterThanOrEqual(2);
      const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.questionVariantId).toBe(r.questionVariantId);expect(n.shuffleAnswers).toBe(true);
      expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
    }
  });
  it("preserves all seventeen passed questions, visible patient contexts and eleven exact clinical approvals",()=>{
    const passed=entry.review.filter(r=>r.verdict==="PASS");expect(passed).toHaveLength(17);
    for(const p of passed){
      const old=entry.revisions.find(r=>r.auditId===p.id)!,now=current.find(r=>r.auditId===p.id)!;
      const a=caseOf(now.caseId),b=entry.cases.find(c=>c.id===old.caseId)!;
      expect(clean(now.question)).toEqual(clean(old.question));
      expect(a.presentation).toBe(b.presentation);expect(a.chiefComplaint).toBe(b.chiefComplaint);
      expect(clean(a.approvedInstantiationProfiles)).toEqual(clean(b.approvedInstantiationProfiles));
      expect(clean(a.decisionNodes.find(n=>n.id===now.nodeId))).toEqual(clean(b.decisionNodes.find(n=>n.id===old.nodeId)));
    }
    for(const a of entry.approvals){
      const old=entry.revisions.find(r=>r.auditId===a.auditId)!,now=pilot.find(r=>r.auditId===a.auditId)!;
      expect(clean(now.question)).toEqual(clean(old.question));expect(now.question.reviewStatus).toBe("clinically_approved");
    }
    expect(live.concepts).toEqual(entry.concepts);
  });
  it("retains all 1613 timing rows and immutable source cases while changing only explicit editorial fields",()=>{
    expect(timings).toHaveLength(1669);
    for(const t of entry.timings)expect(clean(timings.find(x=>x.caseId===t.caseId&&x.nodeId===t.nodeId&&x.questionVariantId===t.questionVariantId))).toEqual(t);
    const source=structuredClone(before.cases),serialized=JSON.stringify(source);
    applyQuestionQualityAdversarialR3Revisions(source);expect(JSON.stringify(source)).toBe(serialized);
    const targets=new Set(revisions.map(r=>r.caseId));
    for(const c of before.cases)if(!targets.has(c.id))expect(caseOf(c.id)).toEqual(c);
    for(const c of live.cases.filter(c=>targets.has(c.id))){
      const old=before.cases.find(o=>o.id===c.id)!;
      for(const n of c.decisionNodes){
        const prev=old.decisionNodes.find(p=>p.id===n.id)!;
        expect(n.answerChoices.find(a=>a.isCorrect)!.serviceRequest??null).toEqual(prev.answerChoices.find(a=>a.isCorrect)!.serviceRequest??null);
        const operationalGate=(node:typeof n)=>node.resultGateAfter?{...node.resultGateAfter,resultNarrative:undefined}:node.resultGateAfter;
        expect(operationalGate(n)).toEqual(operationalGate(prev));
      }
    }
  });
  it("maps all added facts to independently written claims and explicit source rights/limitations",()=>{
    expect(claims).toHaveLength(22);expect(sources).toHaveLength(18);
    const byId=new Map(sources.map(s=>[s.id,s]));
    for(const claim of claims){
      expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.limitation).toBeTruthy();
      for(const id of claim.sourceIds){const s=byId.get(id)!;expect(s,id).toBeDefined();expect(s.evidenceClaimIds).toContain(claim.id);expect(s.completeCitation).toBeTruthy();expect(s.licenseLabel).toBeTruthy();expect(s.reuseNotes).toBeTruthy();expect(s.authorityAssessment).toBeTruthy();}
    }
    const used=new Set(revisions.flatMap(r=>r.question.supportingEvidenceClaimIds));
    for(const c of claims)expect(used.has(c.id),c.id).toBe(true);
  });
  it("keeps new explicit testing alternatives timed and distinguishes mutually exclusive pancreatic protocols",()=>{
    const a06=revisions.find(r=>r.auditId==="A06")!,row=timings.find(t=>t.questionVariantId===a06.questionVariantId)!;
    expect(row.classification.kind).toBe("test_choices");
    if(row.classification.kind!=="test_choices")throw Error("Missing explicit MRI wait");
    const mri=a06.question.answerChoices.find(c=>c.label.includes("pituitary MRI"))!;
    expect(row.classification.choices.find(c=>c.choiceId===mri.id)!.timing).toEqual({kind:"test",timingProfileId:"timing.test.mri"});
    for(const id of ["B32-context","B33-context","B34-context","B35-context"]){
      const r=revisions.find(r=>r.auditId===id)!,labels=r.question.answerChoices.map(c=>c.label);
      expect(labels.filter(s=>s.includes("intravenous contrast given"))).toHaveLength(1);
      expect(labels.filter(s=>s.includes("intravenous contrast omitted"))).toHaveLength(2);
      expect(new Set(labels).size).toBe(3);
    }
    const b40=revisions.find(r=>r.auditId==="B40-context")!;
    expect(b40.currentUpdate).toContain("same duodenal ulcer");expect(b40.currentUpdate).not.toContain(", but");
  });
});
