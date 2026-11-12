import {beforeProgramBatch3AcceptanceRelease} from "./question-program-batch3-acceptance-test-support";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  QUESTION_NEW_N2_ROUND2_PRE_RELEASE as before,
  QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE as after,
  QUESTION_BANK_BATCH2B_ROUND2_REVISIONS as revisions,
  QUESTION_BANK_BATCH2B_ROUND2_AUTHORING_CONCEPTS as concepts,
  QUESTION_BANK_BATCH2B_ROUND2_CLAIMS as claims,
  QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES as oldTimings,
  QUESTION_BANK_BATCH2B_ROUND2_TIMING_ENTRIES as timings,
  ANSWER_CHOICE_TIMING_REGISTRY,
  applyQuestionBankBatch2bRound2Revisions,
  QUESTION_QUALITY_CLINICAL_APPROVALS,
  SYNTHETIC_CLINICAL_RELEASE as actualLive,
} from "./index";
import { syntheticClinicalReleaseSchema } from "./schema";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";
const capture=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-bank-batch2b-round2-before-20261104.json",import.meta.url),"utf8")) as {files:Record<string,string>;approvals:unknown;packet:Array<{id:string;caseId:string;nodeId:string}>};
const clone=<T>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;

const live=beforeProgramBatch3AcceptanceRelease(actualLive);

describe("batch 2b round-two candidate safety and compatibility",()=>{
  it("changes only the thirty-eight returned/omitted nodes in thirty-seven retained cases",()=>{
    expect(revisions).toHaveLength(38);expect(new Set(revisions.map(r=>r.caseId)).size).toBe(37);
    expect(after.cases).toHaveLength(before.cases.length);
    for(const old of before.cases){
      const current=after.cases.find(c=>c.id===old.id)!;
      const rr=revisions.filter(r=>r.caseId===old.id);
      if(!rr.length)expect(current,old.id).toEqual(old);
      expect(current.decisionNodes.map(n=>n.id)).toEqual(old.decisionNodes.map(n=>n.id));
      for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id))expect(current.decisionNodes.find(x=>x.id===n.id),n.id).toEqual(n);
    }
    expect(syntheticClinicalReleaseSchema.safeParse(after).success).toBe(true);
  });
  it("freezes both independently passed cases and all clinical approvals exactly",()=>{
    for(const id of ["B2B06","B2B10"]){const p=capture.packet.find(p=>p.id===id)!;expect(after.cases.find(c=>c.id===p.caseId)).toEqual(before.cases.find(c=>c.id===p.caseId));}
    expect(clone(QUESTION_QUALITY_CLINICAL_APPROVALS)).toEqual(capture.approvals);
    for(const [path,hash]of Object.entries(capture.files).filter(([p])=>/question-bank-batch2a|question-quality-.*20261102|clinical-exhibits\/batch2a/.test(p)))expect(createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex"),path).toBe(hash);
  });
  it("retains old cards and separately versions the changed scored decisions",()=>{
    expect(concepts).toHaveLength(31);expect(after.concepts.slice(0,before.concepts.length)).toEqual(before.concepts);
    for(const c of concepts){expect(before.concepts.some(p=>p.id===c.previousConceptId)).toBe(true);expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();expect(c.versioningReason.length).toBeGreaterThan(40);}
    expect(revisions.find(r=>r.auditId==="B2B18")!.question.conceptId).toBe(revisions.find(r=>r.auditId==="B2B29")!.question.conceptId);
    expect(revisions.find(r=>r.auditId==="B2B20")!.question.conceptId).toBe(revisions.find(r=>r.auditId==="B2B38")!.question.conceptId);
    expect(revisions.find(r=>r.auditId==="B2B19")!.clinicalBinding).toMatchObject({previousKeyServiceId:"service.ultrasound",nextKeyServiceId:null});
  });
  it("retains exact existing gates and all old timing rows",()=>{
    expect(ANSWER_CHOICE_TIMING_REGISTRY.slice(0,oldTimings.length)).toEqual(oldTimings);
    expect(ANSWER_CHOICE_TIMING_REGISTRY.slice(oldTimings.length,oldTimings.length+timings.length)).toEqual(timings);
    expect(timings).toHaveLength(38);
    for(const r of revisions)expect(r.clinicalBinding.nextResultGate,r.auditId).toEqual(r.clinicalBinding.previousResultGate);
    expect(revisions.filter(r=>r.clinicalBinding.nextResultGate).map(r=>r.auditId)).toEqual(["B2B24","B2B36"]);
  });
  it("keeps new clinical claims mapped, limited, and unapproved",()=>{
    expect(claims).toHaveLength(69);
    for(const c of claims){expect(c.sourceIds.length).toBeGreaterThan(0);expect(c.basisClaimIds.length).toBeGreaterThan(0);expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();expect(c.verificationScope).toContain("no source retrieval");}
  });
  it("registers candidates without manager acceptance or clinical promotion",()=>{
    for(const r of revisions){
      const accepted=QUESTION_SHIP_MANIFEST.accepted.find(a=>a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId);
      const selected=live.cases.find(c=>c.id===r.caseId)?.decisionNodes.find(n=>n.id===r.nodeId);
      if(!accepted)expect(selected?.questionVariantId,r.auditId).not.toBe(r.questionVariantId);
      else expect(selected).toMatchObject({questionVariantId:r.questionVariantId,primaryConceptId:r.question.conceptId});
    }
    expect(revisions.find(r=>r.auditId==="F13")!.previousQuestionVariantId).toBe("question.preoperative-osa.validated-risk-screening.v4.r4");
  });
  it("rejects changed source concept and gate contracts",()=>{
    const cases=clone(before.cases),r=revisions[0]!;
    cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!.primaryConceptId="concept.unrelated";
    expect(()=>applyQuestionBankBatch2bRound2Revisions(cases)).toThrow(/binding changed/);
    const gated=clone(before.cases),g=revisions.find(r=>r.auditId==="B2B36")!;
    gated.find(c=>c.id===g.caseId)!.decisionNodes.find(n=>n.id===g.nodeId)!.resultGateAfter!.resultNarrative+=" drift";
    expect(()=>applyQuestionBankBatch2bRound2Revisions(gated)).toThrow(/binding changed/);
  });
  it.each(revisions)("keeps $auditId named, versioned, randomized and fully timed",r=>{
    const cs=after.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
    expect(n.questionVariantId).not.toBe(r.previousQuestionVariantId);expect(n.shuffleAnswers).toBe(true);expect(n.stem).toContain("{patientName}");
    expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
    expect(n.answerChoices.some(c=>/\balone\b|\bindividuali[sz]ed\b|\btailored\b/i.test(c.label))).toBe(false);
    for(const profile of [{presentation:cs.presentation,chiefComplaint:cs.chiefComplaint},...(cs.approvedInstantiationProfiles??[])]){expect(profile.presentation).toContain("{patientName}");expect(profile.presentation).toMatch(/\d+-year-old (?:woman|man|person)/);expect(profile.presentation).not.toMatch(/\{ageYears\}|\{sexNoun\}/);expect((profile.chiefComplaint??cs.chiefComplaint??"").trim().split(/\s+/).length).toBeLessThanOrEqual(5);}
    const t=timings.filter(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);expect(t).toHaveLength(1);
    if(t[0]!.classification.kind==="test_choices")for(const c of n.answerChoices){const row=t[0]!.classification.choices.find(x=>x.choiceId===c.id)!;expect(row.choiceLabel).toBe(c.label);expect(row.timing).toEqual(r.choiceTimingOverrides![c.id]);}
    expect(r.question.reviewStatus).toBe("needs_clinician_review");
  });
});
