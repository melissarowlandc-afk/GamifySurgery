import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
  QUESTION_BANK_BATCH2A_ROUND2_RELEASE as live, QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE as before,
  QUESTION_BANK_BATCH2A_ROUND2_REVISIONS as revisions, QUESTION_BANK_BATCH2A_ROUND2_AUTHORING_CONCEPTS as concepts,
  QUESTION_BANK_BATCH2A_ROUND2_CLAIMS as claims, QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES as oldTimings,
  ANSWER_CHOICE_TIMING_REGISTRY as currentTimings, QUESTION_BANK_BATCH2A_ROUND2_TIMING_ENTRIES as addedTimings,
  QUESTION_QUALITY_CLINICAL_APPROVALS as approvals,
  applyQuestionBankBatch2aRound2Revisions,
} from "./index";
import {syntheticClinicalReleaseSchema} from "./schema";
const baseline=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-bank-batch2a-round2-before-20261104.json",import.meta.url),"utf8")) as {release:typeof before;timings:typeof oldTimings;approvals:typeof approvals};
const clean=<T>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;
const newContent=(id:string)=>/^question\.n\d+\./.test(id);
const timings=[...oldTimings,...addedTimings];

describe("batch 2a round two: independent-review corrections",()=>{
  it("keeps the PASS case, flag drafts, new-content cases and all other nodes exact",()=>{
    // The other author can revise N1/N2 during this turn. Every current N1/N2
    // case is still compared exactly across our projection in the loop below;
    // the immutable entry assertion covers the bank outside that separate lane.
    expect(clean(before.cases.filter(c=>!c.decisionNodes.some(n=>newContent(n.questionVariantId)))))
      .toEqual(baseline.release.cases.filter(c=>!c.decisionNodes.some(n=>newContent(n.questionVariantId))));
    expect(clean(approvals)).toEqual(baseline.approvals);
    expect(revisions.map(r=>r.auditId)).toEqual(["B2A02","B2A03","B2A04","B2A05","B2A06","B2A07","B2A08","B2A09","B2A10","B2A11"]);
    let cases=0,nodes=0;
    for(const old of before.cases){const now=live.cases.find(c=>c.id===old.id)!,rr=revisions.filter(r=>r.caseId===old.id);
      expect(now.decisionNodes.map(n=>n.id)).toEqual(old.decisionNodes.map(n=>n.id));
      if(!rr.length){expect(clean(now),old.id).toEqual(clean(old));cases++;}
      for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){expect(clean(now.decisionNodes.find(x=>x.id===n.id)),n.id).toEqual(clean(n));nodes++;}
    }
    expect(cases).toBe(1181);expect(nodes).toBe(1492);expect(live.cases).toHaveLength(before.cases.length);
    expect(clean(live.cases.find(c=>c.id==="case.achalasia.water-and-solids"))).toEqual(clean(before.cases.find(c=>c.id==="case.achalasia.water-and-solids")));
  });
  it("retains prior concepts, versions only changed objectives, and leaves every new definition unapproved",()=>{
    expect(live.concepts.slice(0,before.concepts.length)).toEqual(before.concepts);expect(concepts).toHaveLength(6);
    expect(live.concepts).toHaveLength(before.concepts.length+6);
    for(const r of revisions){expect(r.questionVariantId).not.toBe(r.previousQuestionVariantId);expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null});
      const n=live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.shuffleAnswers).toBe(true);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);expect([3,4]).toContain(n.answerChoices.length);
      expect(n.stem).toContain("{patientName}");expect(r.question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      expect(r.clinicalBinding.nextConceptId!==r.clinicalBinding.previousConceptId).toBe(["B2A02","B2A04","B2A06","B2A08","B2A10","B2A11"].includes(r.auditId));
    }
    for(const c of concepts){expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();expect(before.concepts.some(old=>old.id===c.previousConceptId)).toBe(true);}
  });
  it("retains every old wait and supplies exact classification rows for all new choices",()=>{
    expect(clean(oldTimings.filter(t=>!newContent(t.questionVariantId)))).toEqual(baseline.timings.filter(t=>!newContent(t.questionVariantId)));
    expect(clean(timings.slice(0,oldTimings.length))).toEqual(clean(oldTimings));
    expect(timings).toHaveLength(oldTimings.length+10);
    expect(clean(currentTimings.slice(0,timings.length))).toEqual(clean(timings));
    for(const r of revisions){const rows=timings.filter(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);expect(rows).toHaveLength(1);
      const t=rows[0]!;if(t.classification.kind==="test_choices"){
        expect(t.classification.choices.map(c=>[c.choiceId,c.choiceLabel])).toEqual(r.question.answerChoices.map(c=>[c.id,c.label]));
        for(const c of t.classification.choices)expect(c.timing).toEqual(r.choiceTimingOverrides![c.choiceId]);
      }else expect(Object.values(r.choiceTimingOverrides!).every(t=>t.kind==="no_test")).toBe(true);
    }
  });
  it("versions the changed contrast gate and retains all other clinical gates",()=>{
    for(const r of revisions){const old=before.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!,now=live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;
      if(r.auditId==="B2A04"){
        expect(old.resultGateAfter!.resultTypeId).toBe("service.esophageal_manometry");expect(now.resultGateAfter).toMatchObject({resultTypeId:"service.contrast_swallow",allowedServiceRouteIds:["route.contrast_swallow.outsourced"]});
        expect(now.answerChoices.find(a=>a.isCorrect)!.serviceRequest).toEqual({serviceId:"service.contrast_swallow"});
      }else expect(now.resultGateAfter).toEqual(old.resultGateAfter);
    }
    expect(syntheticClinicalReleaseSchema.safeParse(live).success).toBe(true);
  });
  it("keeps application provenance explicit instead of promoting a source or clinical approval",()=>{
    expect(claims).toHaveLength(8);for(const c of claims){expect(c.sourceIds.length).toBeGreaterThan(0);expect(c.basisClaimIds.length).toBeGreaterThan(0);expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();expect(c.verificationScope).toContain("no new source retrieval");}
    const r=revisions.find(r=>r.auditId==="B2A02")!;
    expect(r.question.supportingEvidenceClaimIds.some(id=>id.startsWith("claim.qbp2a.achalasia-"))).toBe(false);
  });
  it("keeps old images and adds a distinct original PNG with equivalent accessible observations",()=>{
    const r=revisions.find(r=>r.auditId==="B2A04")!,e=r.question.exhibit!;expect(e.kind).toBe("image");
    if(e.kind!=="image")throw new Error("Expected new pressure exhibit");
    expect(e.assetPath).toBe("clinical-exhibits/batch2a-r2-b04-pressure.png");expect(e.description).toContain("integral");
    const bytes=readFileSync(new URL("../../../apps/player/public/"+e.assetPath,import.meta.url));expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
  });
  it("rejects application against a drifted prior clinical contract",()=>{
    const cases=clean(before.cases),r=revisions[0]!;cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!.primaryConceptId="concept.changed";
    expect(()=>applyQuestionBankBatch2aRound2Revisions(cases)).toThrow(/clinical binding changed/);
  });
});
