import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ANSWER_CHOICE_TIMING_REGISTRY, QUESTION_QUALITY_ADVERSARIAL_REVISIONS as revisions,
  QUESTION_QUALITY_ADVERSARIAL_CLAIMS as claims, QUESTION_QUALITY_ADVERSARIAL_SOURCES as sources,
  QUESTION_QUALITY_CLINICAL_APPROVALS as approvals, QUESTION_QUALITY_REVISIONS as pilot,
  QUESTION_QUALITY_HISTORICAL_REVISIONS as historical, QUESTION_QUALITY_PRE_ADVERSARIAL_R3_RELEASE as live,
  QUESTION_QUALITY_PRE_ADVERSARIAL_R3_TIMING_ENTRIES as v5Timings,
  QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE as before, applyQuestionQualityAdversarialRevisions,
  applyQuestionQualityRevisions,
} from "./index";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase } from "./schema";
import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";
const snapshot=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/adversarial-before-20261102.json",import.meta.url),"utf8")) as {
  cases:SyntheticClinicalCase[]; revisions:QuestionQualityRevision[];timings:AnswerChoiceTimingRegistryEntry[];
  adversarialReview:Array<{id:string;verdict:string;cues:unknown[];fairness:unknown[];suggestions:unknown[]}>;
};
const clean=<T>(x:T):T=>JSON.parse(JSON.stringify(x)) as T;
const clinicalText=(r:QuestionQualityRevision)=>{const {reviewStatus:_status,lastClinicianReview:_review,...text}=r.question;return text;};
describe("adversarial corrections, exact approvals and frozen contracts",()=>{
  it("versions all 73 reviewed identities with indexed note responses and a candid self-check",()=>{
    expect(revisions).toHaveLength(73);expect(revisions.filter(r=>r.contextCompanion)).toHaveLength(30);
    expect(new Set(revisions.map(r=>r.auditId))).toEqual(new Set(snapshot.adversarialReview.map(r=>r.id)));
    for(const r of revisions){
      const review=snapshot.adversarialReview.find(v=>v.id===r.auditId)!,old=snapshot.revisions.find(v=>v.auditId===r.auditId)!;
      expect(r.previousQuestionVariantId).toBe(old.questionVariantId);
      expect(r.questionVariantId).toBe(old.questionVariantId.replace(/\.r(\d+)$/,(_,n:string)=>".r"+(Number(n)+1)));
      expect(r.question.conceptId).toBe(old.question.conceptId);
      expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-02.v5"});
      expect(r.adversarialReview?.status).toBe("awaiting_independent_re_review");
      expect(r.reviewResponse?.originalVerdict).toBe(review.verdict);
      for(const group of ["cues","fairness","suggestions"] as const)expect(r.reviewResponse!.noteResponses[group]).toHaveLength(review[group].length);
      expect(r.reviewResponse!.selfCheck.reasoningSteps.length).toBeGreaterThanOrEqual(2);
      expect(r.reviewResponse!.selfCheck.oneBestAnswer).toBeTruthy();expect(r.reviewResponse!.selfCheck.closestDistractor).toBeTruthy();
      const n=live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.questionVariantId).toBe(r.questionVariantId);expect(n.shuffleAnswers).toBe(true);
      expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
    }
    expect(revisions.find(r=>r.auditId==="B10")!.educationalIntent).toBe("foundational_safety");
    expect(revisions.filter(r=>r.reviewResponse!.originalVerdict==="PASS")).toHaveLength(6);
  });
  it("records only the eleven exact owner-approved versions, retaining their clinical text",()=>{
    expect(approvals).toHaveLength(11);
    for(const a of approvals){
      const old=snapshot.revisions.find(r=>r.auditId===a.auditId)!,current=pilot.find(r=>r.auditId===a.auditId)!;
      expect(current.questionVariantId).toBe(old.questionVariantId);expect(clean(clinicalText(current))).toEqual(clean(clinicalText(old)));
      expect(current.question).toMatchObject({reviewStatus:"clinically_approved",lastClinicianReview:{reviewer:"Melissa Rowland (clinical sign-off)",reviewedOn:["A11","A30","A40"].includes(a.auditId)?"2026-11-02":"2026-10-29",contentVersion:old.question.contentVersion}});
      for(const duplicate of historical.filter(r=>r.questionVariantId===current.questionVariantId))expect(duplicate.question.lastClinicianReview).toEqual(current.question.lastClinicianReview);
    }
    expect(pilot.filter(r=>r.question.reviewStatus==="clinically_approved")).toHaveLength(11);
    for(const record of [...claims,...sources])expect(record.reviewStatus).toBe("needs_clinician_review");
  });
  it("retains every old timing entry exactly and never mutates frozen source cases",()=>{
    expect(v5Timings).toHaveLength(snapshot.timings.length+73);
    for(const row of snapshot.timings)expect(clean(ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId))).toEqual(row);
    const input=structuredClone(before.cases),serialized=JSON.stringify(input);applyQuestionQualityAdversarialRevisions(input);expect(JSON.stringify(input)).toBe(serialized);
    expect(live.concepts).toEqual(before.concepts);
    const targets=new Set(revisions.map(r=>r.caseId));
    for(const c of before.cases)if(!targets.has(c.id))expect(live.cases.find(n=>n.id===c.id)).toEqual(c);
    for(const id of targets){
      const a=live.cases.find(c=>c.id===id)!,b=before.cases.find(c=>c.id===id)!;
      const complaintRevision=revisions.find(r=>r.caseId===id&&r.chiefComplaint!==undefined);
      const contract=(c:SyntheticClinicalCase)=>{const {chiefComplaint,presentation:_p,patientPresentationRevision:_r,decisionNodes:_n,approvedInstantiationProfiles:profiles,...rest}=c;return {...rest,...(!complaintRevision?{chiefComplaint}:{}),profiles:profiles?.map(({chiefComplaint,presentation:_p,...profile})=>({...profile,...(!complaintRevision?{chiefComplaint}:{})}))};};
      expect(clean(contract(a))).toEqual(clean(contract(b)));
      if(complaintRevision){expect(a.chiefComplaint).toBe(complaintRevision.chiefComplaint);expect(a.patientPresentationRevision?.revisedChiefComplaint).toBe(a.chiefComplaint);for(const p of a.approvedInstantiationProfiles??[])expect(p.chiefComplaint).toBe(a.chiefComplaint);}
      for(const n of a.decisionNodes){const old=b.decisionNodes.find(o=>o.id===n.id)!;
        const gate=(n:typeof old)=>n.resultGateAfter?{...n.resultGateAfter,resultNarrative:undefined}:n.resultGateAfter;
        expect(gate(n)).toEqual(gate(old));expect(n.answerChoices.find(c=>c.isCorrect)!.serviceRequest??null).toEqual(old.answerChoices.find(c=>c.isCorrect)!.serviceRequest??null);
      }
    }
  });
  it("guards changes against stale update, exhibit and keyed-service bindings",()=>{
    const r=revisions.find(r=>r.auditId==="B01")!,cs=before.cases.find(c=>c.id===r.caseId)!;
    for(const field of ["currentUpdate","exhibit"] as const){const copy=structuredClone(cs),n=copy.decisionNodes.find(n=>n.id===r.nodeId)!;if(field==="currentUpdate")n.currentUpdate="Stale update";else n.exhibit={kind:"keyValue",items:[{label:"Stale",value:"Exhibit"}]};expect(()=>applyQuestionQualityAdversarialRevisions([copy])).toThrow(/revision source binding changed/);}
    const serviceChange=structuredClone(r),key=serviceChange.question.answerChoices.find(c=>c.isCorrect)!;
    serviceChange.choiceServiceOverrides![key.id]="service.ct";
    expect(()=>applyQuestionQualityRevisions([structuredClone(cs)],[serviceChange])).toThrow(/cannot silently change the keyed service/);
    // The complete application requires every selected case; the mismatch must
    // be rejected before that missing-target guard rather than silently applied.
  });
  it("keeps B40's named patient and duodenal location consistent across both tasks",()=>{
    const r=revisions.find(r=>r.auditId==="B40")!,cs=live.cases.find(c=>c.id===r.caseId)!;
    expect(cs.presentation).toContain("duodenal ulcer");expect(cs.presentation).not.toContain("gastric ulcer");
    const context=cs.decisionNodes.find(n=>n.id===revisions.find(r=>r.auditId==="B40-context")!.nodeId)!;
    expect(context.currentUpdate).toContain("same duodenal ulcer");expect(context.currentUpdate).not.toContain("gastric ulcer");
    expect(context.answerChoices.find(c=>c.isCorrect)!.label).toContain("bipolar");expect(context.stem).not.toMatch(/avoided|sole/);
  });
  it("keeps procedure wait previews parallel and attaches sampling estimates to the intended modalities",()=>{
    for(const id of ["B32","B33","B34","B35"]){const r=revisions.find(r=>r.auditId===id)!;
      const row=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId)!;
      expect(row.classification.kind).toBe("test_choices");if(row.classification.kind!=="test_choices")throw Error("Missing procedure estimates");
      expect(row.classification.choices.map(c=>c.timing)).toEqual([
        {kind:"test",timingProfileId:"timing.test.pseudocyst_drainage"},{kind:"test",timingProfileId:"timing.test.pseudocyst_drainage"},{kind:"test",timingProfileId:"timing.test.pseudocyst_drainage"},{kind:"test",timingProfileId:"timing.test.ct"},
      ]);
    }
    const r=revisions.find(r=>r.auditId==="B37")!,row=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.questionVariantId===r.questionVariantId)!;
    expect(row.classification.kind).toBe("test_choices");if(row.classification.kind!=="test_choices")throw Error("Missing sampling estimates");
    const aspiration=r.question.answerChoices.find(c=>c.label.includes("aspiration"))!,skin=r.question.answerChoices.find(c=>c.label.includes("Punch"))!;
    expect(row.classification.choices.find(c=>c.choiceId===aspiration.id)!.timing).toEqual({kind:"test",timingProfileId:"timing.test.ultrasound_guided_aspiration"});
    expect(row.classification.choices.find(c=>c.choiceId===skin.id)!.timing).toEqual({kind:"test",timingProfileId:"timing.test.nipple_areolar_biopsy"});
  });
  it("maps new clinical facts to real source metadata and keeps exact numeric limits explicit",()=>{
    const byId=new Map(sources.map(s=>[s.id,s]));expect(claims).toHaveLength(39);
    for(const c of claims){expect(c.lastCheckedOn).toBe("2026-11-02");expect(c.limitation).toBeTruthy();for(const id of c.sourceIds){const s=byId.get(id)!;expect(s,id).toBeDefined();expect(s.evidenceClaimIds).toContain(c.id);expect(s.completeCitation).toBeTruthy();expect(s.officialUrl).toMatch(/^https:\/\//);expect(s.licenseLabel).toBeTruthy();expect(s.authorityAssessment).toBeTruthy();}}
    expect(claims.find(c=>c.id.endsWith("failed-contraction-threshold"))!.statement).toContain("100");
    const b31=revisions.find(r=>r.auditId==="B31")!.question;expect(JSON.stringify(b31.exhibit)).toContain("90%");
    const b28=revisions.find(r=>r.auditId==="B28")!.question;expect(b28.answerChoices[0]!.label).toContain("29%");expect((.4/.6*.6)/(1+.4/.6*.6)).toBeCloseTo(2/7);
  });
});
