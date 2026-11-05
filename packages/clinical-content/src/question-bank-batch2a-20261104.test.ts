import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  QUESTION_FLAGS_PRE_ROUND3_RELEASE as live, QUESTION_BANK_PRE_BATCH2A_RELEASE as before,
  QUESTION_BANK_BATCH2A_REVISIONS as revisions, QUESTION_BANK_BATCH2A_AUTHORING_CONCEPTS as concepts,
  QUESTION_BANK_BATCH2A_CLAIMS as claims, QUESTION_FLAG_ROUND2_REVISIONS as pendingFlags,
  QUESTION_BANK_PRE_BATCH2A_TIMING_ENTRIES as oldTimings, QUESTION_FLAGS_PRE_ROUND3_TIMING_ENTRIES as timings,
  QUESTION_QUALITY_CLINICAL_APPROVALS as approvals, applyQuestionBankBatch2aRevisions,
} from "./index";
import { caseExhibitSchema, syntheticClinicalReleaseSchema } from "./schema";
const baseline=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-bank-batch2a-before-20261104.json",import.meta.url),"utf8")) as {
  release:typeof live; timings:typeof timings; flagRound2Revisions:typeof pendingFlags; approvals:typeof approvals;
};
const clean=<T>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;

describe("whole-bank program batch 2a: versioned owner feedback",()=>{
  it("retains the full starting bank, exact approvals and all sixteen pending flag revisions",()=>{
    expect(clean(before)).toEqual(baseline.release);
    expect(clean(approvals)).toEqual(baseline.approvals);
    expect(clean(pendingFlags)).toEqual(baseline.flagRound2Revisions);
    for(const r of pendingFlags)expect(clean(live.cases.find(c=>c.id===r.caseId))).toEqual(clean(before.cases.find(c=>c.id===r.caseId)));
    expect(live.concepts.slice(0,before.concepts.length)).toEqual(before.concepts);
    expect(before.concepts).toHaveLength(412);expect(live.concepts).toHaveLength(414);
  });
  it("changes only the eleven declared nodes and their necessary shared presentation/summary",()=>{
    expect(revisions).toHaveLength(11);let preservedCases=0,preservedNodes=0;
    for(const old of before.cases){
      const now=live.cases.find(c=>c.id===old.id)!,rr=revisions.filter(r=>r.caseId===old.id);
      expect(now.decisionNodes.map(n=>n.id)).toEqual(old.decisionNodes.map(n=>n.id));
      if(!rr.length){expect(clean(now),old.id).toEqual(clean(old));preservedCases++;}
      for(const node of old.decisionNodes)if(!rr.some(r=>r.nodeId===node.id)){
        expect(clean(now.decisionNodes.find(n=>n.id===node.id)),node.id).toEqual(clean(node));preservedNodes++;
      }
    }
    expect(preservedCases).toBe(1101);expect(preservedNodes).toBe(1412);
    // These passed companions and the source-held F14 are explicit freeze cases.
    for(const id of ["case.achalasia.water-and-solids","case.achalasia.slow-meals"]){
      const old=before.cases.find(c=>c.id===id)!,r=revisions.find(r=>r.caseId===id)!;
      expect(clean(live.cases.find(c=>c.id===id)!.decisionNodes.find(n=>n.id!==r.nodeId)))
        .toEqual(clean(old.decisionNodes.find(n=>n.id!==r.nodeId)));
    }
    const held=before.cases.find(c=>c.decisionNodes.some(n=>n.questionVariantId==="question.thyroid-nodule.fna-selection.v2"))!;
    expect(clean(live.cases.find(c=>c.id===held.id))).toEqual(clean(held));
  });
  it("versions only the two changed scored constructs and keeps every draft unapproved",()=>{
    expect(concepts.map(c=>c.id)).toEqual(["concept.achalasia.physiology-directed-treatment.v1","concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5"]);
    for(const r of revisions){
      expect(r.questionVariantId).not.toBe(r.previousQuestionVariantId);
      expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-04.v13"});
      const n=live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.shuffleAnswers).toBe(true);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);expect([3,4]).toContain(n.answerChoices.length);
      expect(n.stem).toContain("{patientName}");
      const changed=r.clinicalBinding.nextConceptId!==r.clinicalBinding.previousConceptId;
      expect(changed).toBe(["B2A02","B2A09"].includes(r.auditId));
      for(const id of r.question.supportingEvidenceClaimIds)expect(id.startsWith("claim.")).toBe(true);
    }
    for(const c of concepts){expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();expect(before.concepts.some(x=>x.id===c.previousConceptId)).toBe(true);}
    expect(claims).toHaveLength(3);
    for(const c of claims){expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.verificationScope).toContain("No treatment section was freshly retrieved");expect(c.sourceIds.length).toBeGreaterThan(0);}
  });
  it("retains all old timing identities and supplies exact waits for all new testing choices",()=>{
    expect(oldTimings).toHaveLength(1799);expect(timings).toHaveLength(1810);
    expect(clean(timings.slice(0,1799))).toEqual(baseline.timings);
    for(const r of revisions){
      const matches=timings.filter(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);expect(matches).toHaveLength(1);
      const row=matches[0]!;
      if(row.classification.kind==="test_choices"){
        expect(row.classification.choices.map(c=>[c.choiceId,c.choiceLabel])).toEqual(r.question.answerChoices.map(c=>[c.id,c.label]));
        for(const c of row.classification.choices)expect(c.timing).toEqual(r.choiceTimingOverrides![c.choiceId]);
      }else expect(Object.values(r.choiceTimingOverrides!).every(t=>t.kind==="no_test")).toBe(true);
    }
  });
  it("changes B06 to a real ultrasound gate while retaining its frozen MRI contract",()=>{
    const r=revisions.find(r=>r.auditId==="B2A06")!,old=before.cases.find(c=>c.id===r.caseId)!,now=live.cases.find(c=>c.id===r.caseId)!;
    expect(old.decisionNodes[0]!.resultGateAfter!.resultTypeId).toBe("service.mri");
    expect(now.decisionNodes[0]!.resultGateAfter).toMatchObject({id:old.decisionNodes[0]!.resultGateAfter!.id,resultTypeId:"service.ultrasound",allowedServiceRouteIds:["route.ultrasound.outsourced","route.ultrasound.in_house"]});
    expect(now.decisionNodes[0]!.answerChoices.find(c=>c.isCorrect)!.serviceRequest).toEqual({serviceId:"service.ultrasound"});
    const companion=revisions.find(r=>r.auditId==="B2A07")!;
    expect(now.decisionNodes[1]).toEqual({...old.decisionNodes[1]!,questionVariantId:companion.questionVariantId,currentUpdate:old.decisionNodes[1]!.currentUpdate!.replace("Following the MRI","After the targeted ultrasound"),sourceLabels:[...old.decisionNodes[1]!.sourceLabels,"AI-assisted revision: needs_clinician_review (question-authoring.2026-11-04.v13)"]});
    for(const x of revisions.filter(x=>x.auditId!=="B2A06"))expect(x.clinicalBinding.nextResultGate).toEqual(x.clinicalBinding.previousResultGate);
  });
  it("accepts legacy exhibits and local images while rejecting unsafe image paths",()=>{
    for(const c of before.cases)for(const n of c.decisionNodes)if(n.exhibit)expect(caseExhibitSchema.safeParse(n.exhibit).success).toBe(true);
    const images=revisions.filter(r=>r.question.exhibit?.kind==="image");expect(images).toHaveLength(2);
    for(const r of images){const e=r.question.exhibit!;expect(caseExhibitSchema.safeParse(e).success).toBe(true);
      for(const path of ["https://example.org/image.png","../clinical-exhibits/a.png","clinical-exhibits/../a.png","/clinical-exhibits/a.png","clinical-exhibits/a.svg"])
        expect(caseExhibitSchema.safeParse({...e,assetPath:path}).success,path).toBe(false);
    }
    expect(syntheticClinicalReleaseSchema.safeParse(live).success).toBe(true);
  });
  it("refuses applying the revisions to a different clinical contract",()=>{
    const altered=clean(before.cases);altered.find(c=>c.id===revisions[0]!.caseId)!.decisionNodes[1]!.primaryConceptId="concept.changed";
    expect(()=>applyQuestionBankBatch2aRevisions(altered)).toThrow(/clinical binding changed/);
  });
});
