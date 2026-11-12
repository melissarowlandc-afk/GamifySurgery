import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
  QUESTION_FLAGS_ROUND1_RELEASE as live,QUESTION_FLAGS_PRE_REVISION_RELEASE as before,
  QUESTION_FLAG_REVISIONS as revisions,QUESTION_FLAG_AUTHORING_CONCEPTS as concepts,
  QUESTION_FLAGS_ROUND1_TIMING_ENTRIES as timings,QUESTION_FLAGS_PRE_REVISION_TIMING_ENTRIES as oldTimings,
  QUESTION_QUALITY_CLINICAL_APPROVALS as approvals,QUESTION_QUALITY_REVISIONS as pilot,
  applyQuestionFlagRevisions,
} from "./index";
import type {SyntheticClinicalCase} from "./schema";
const snapshot=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags-before-20261104.json",import.meta.url),"utf8")) as {
  release:typeof live;flags:Array<{flagId:string;questionVariantId:string;live:unknown[];batch1Revisions:unknown[]}>;
  approvals:typeof approvals;
};
const clean=<T>(v:T):T=>v===undefined?v:JSON.parse(JSON.stringify(v)) as T;

describe("owner/tester voluntary question flags: bounded additive drafts",()=>{
  it("binds 18 flags to 17 still-live old variants, 16 drafts and one explicit source hold",()=>{
    expect(snapshot.flags).toHaveLength(18);expect(new Set(snapshot.flags.map(f=>f.questionVariantId)).size).toBe(17);
    expect(revisions).toHaveLength(16);expect(new Set(revisions.map(r=>r.previousQuestionVariantId))).toEqual(new Set(snapshot.flags.filter(f=>f.questionVariantId!=="question.thyroid-nodule.fna-selection.v2").map(f=>f.questionVariantId)));
    for(const r of revisions){
      expect(r.questionVariantId).toBe(r.previousQuestionVariantId+".r2");
      expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-04.v11"});
      expect(r.flagReview.flagIds).toEqual(snapshot.flags.filter(f=>f.questionVariantId===r.previousQuestionVariantId).map(f=>f.flagId));
      const n=live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.questionVariantId).toBe(r.questionVariantId);expect(n.shuffleAnswers).toBe(true);
      expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
    }
  });
  it("retains the exact starting assembly and all unflagged cases, nodes and approved pilot records",()=>{
    expect(clean(before)).toEqual(snapshot.release);
    for(const cs of before.cases){const now=live.cases.find(c=>c.id===cs.id)!;
      const changed=revisions.filter(r=>r.caseId===cs.id);
      if(!changed.length)expect(clean(now),cs.id).toEqual(clean(cs));
      else for(const n of cs.decisionNodes)if(!changed.some(r=>r.nodeId===n.id))expect(clean(now.decisionNodes.find(x=>x.id===n.id)),n.id).toEqual(clean(n));
    }
    expect(clean(approvals)).toEqual(snapshot.approvals);expect(approvals).toHaveLength(11);
    for(const a of approvals){const r=pilot.find(r=>r.auditId===a.auditId)!;
      expect(r.question.reviewStatus).toBe("clinically_approved");expect(revisions.some(n=>n.caseId===r.caseId)).toBe(false);
    }
  });
  it("versions the changed referral target and DCIS setting while retaining all 396 earlier concepts",()=>{
    expect(live.concepts.slice(0,396)).toEqual(before.concepts);expect(live.concepts).toHaveLength(398);expect(concepts).toHaveLength(2);
    const r=revisions.find(r=>r.auditId==="F10")!,c=concepts.find(c=>c.revisedItemIds.includes("F10"))!;
    expect(c.id).toBe("concept.dcis.sentinel-node-mastectomy.v1");expect(c.previousConceptId).toBe(r.clinicalBinding.previousConceptId);
    expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();expect(c.versioningReason).toContain("oncoplastic");
    const target=concepts.find(c=>c.revisedItemIds.includes("F03"))!;
    expect(target.id).toBe("concept.varicose-veins.axial-trunk-referral-target.v1");expect(target.previousConceptId).toBe(revisions.find(r=>r.auditId==="F03")!.clinicalBinding.previousConceptId);
    for(const r of revisions.filter(r=>!["F03","F10"].includes(r.auditId)))expect(r.question.conceptId).toBe(r.clinicalBinding.previousConceptId);
  });
  it("retains every previous timing row and appends 16 exact choice-identity records",()=>{
    expect(oldTimings).toHaveLength(1767);expect(timings).toHaveLength(1783);
    expect(clean(timings.slice(0,oldTimings.length))).toEqual(clean(oldTimings));
    for(const r of revisions){
      const row=timings.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId)!;
      expect(row).toBeTruthy();if(row.classification.kind!=="test_choices")continue;
      expect(row.classification.choices.map(c=>[c.choiceId,c.choiceLabel])).toEqual(r.question.answerChoices.map(c=>[c.id,c.label]));
      for(const c of row.classification.choices){const old=oldTimings.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.previousQuestionVariantId)!;
        if(r.choiceTimingOverrides?.[c.choiceId])expect(c.timing).toEqual(r.choiceTimingOverrides[c.choiceId]);
        else if(old.classification.kind==="test_choices")expect(c.timing).toEqual(old.classification.choices.find(ch=>ch.choiceId===r.choiceSourceIds![c.choiceId])!.timing);
      }
    }
  });
  it("shows testing previews for every prospective neck-biopsy option without creating a local service",()=>{
    const r=revisions.find(r=>r.auditId==="F05")!,row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;
    expect(row.classification.kind).toBe("test_choices");
    if(row.classification.kind==="test_choices")expect(row.classification.choices.map(c=>c.timing)).toEqual([
      {kind:"test",timingProfileId:"timing.test.biopsy"},{kind:"test",timingProfileId:"timing.test.biopsy"},{kind:"test",timingProfileId:"timing.test.biopsy"},
    ]);
    expect(Object.values(r.choiceServiceOverrides!)).toEqual([null,null,null]);
  });
  it("keeps result-gate/service contracts and later thyroid/DNR tasks exact",()=>{
    for(const r of revisions){
      const a=before.cases.find(c=>c.id===r.caseId)!,b=live.cases.find(c=>c.id===r.caseId)!;
      const old=a.decisionNodes.find(n=>n.id===r.nodeId)!,now=b.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(now.resultGateAfter).toEqual(old.resultGateAfter);
      expect(now.answerChoices.find(c=>c.isCorrect)!.serviceRequest).toEqual(old.answerChoices.find(c=>c.isCorrect)!.serviceRequest);
      expect(a.decisionNodes.map(n=>n.id)).toEqual(b.decisionNodes.map(n=>n.id));
    }
  });
  it("records source/scope holds rather than claiming fresh verification or approval",()=>{
    expect(revisions.find(r=>r.auditId==="F05")!.flagReview.scopeDecision).toContain("no verified public ABSITE");
    expect(revisions.some(r=>r.auditId==="F14")).toBe(false);
    const held=live.cases.find(c=>c.id==="case.thyroid-nodule.incidental-imaging")!;
    expect(held).toEqual(before.cases.find(c=>c.id===held.id));
    expect(revisions.find(r=>r.auditId==="F10")!.flagReview.sourceDecision).toContain("No fresh");
    for(const r of revisions)expect(r.flagReview.status).toBe("awaiting_independent_and_clinician_review");
  });
  it("requires the exact previous question and clinical binding before projection",()=>{
    const altered=clean(before.cases) as SyntheticClinicalCase[];
    altered.find(c=>c.id===revisions[0]!.caseId)!.decisionNodes[0]!.questionVariantId+=".changed";
    expect(()=>applyQuestionFlagRevisions(altered)).toThrow(/source binding changed/);
  });
});
