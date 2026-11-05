import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE as before, QUESTION_BANK_BATCH2A_ROUND3_RELEASE as after,
  QUESTION_NEW_N1_ROUND3_PRE_RELEASE as current, QUESTION_BANK_BATCH2A_ROUND3_REVISIONS as revisions,
  QUESTION_BANK_BATCH2A_ROUND3_AUTHORING_CONCEPTS as concepts, QUESTION_BANK_BATCH2A_ROUND3_CLAIMS as claims,
  QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES as oldTimings, QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES as timings,
  ANSWER_CHOICE_TIMING_REGISTRY, QUESTION_QUALITY_CLINICAL_APPROVALS, QUESTION_BANK_BATCH2B_REVISIONS as protected2b,
  applyQuestionBankBatch2aRound3Revisions,
  QUESTION_BANK_PRE_BATCH2B_RELEASE as batch2bBefore, QUESTION_NEW_N2_ROUND2_PRE_RELEASE as batch2bAfter,
  QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES as batch2bOldTimings, QUESTION_NEW_N2_ROUND2_PRE_TIMING_ENTRIES as batch2bEndTimings,
  QUESTION_BANK_BATCH2B_TIMING_ENTRIES as batch2bTimings,
} from "./index";
import { syntheticClinicalReleaseSchema } from "./schema";
const clean=<T>(v:T):T=>v===undefined?v:JSON.parse(JSON.stringify(v)) as T;
const entry=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-bank-batch2a-round3-before-20261104.json",import.meta.url),"utf8")) as {release:typeof current;files:Record<string,string>;approvals:typeof QUESTION_QUALITY_CLINICAL_APPROVALS;packet:Array<{id:string;caseId:string;nodeId:string}>};

describe("batch 2a final author round three",()=>{
  it("changes only the seven returned nodes and retains every other stage case and node",()=>{
    expect(revisions.map(r=>r.auditId)).toEqual(["B2A03","B2A04","B2A05","B2A06","B2A07","B2A10","B2A11"]);
    let untouchedCases=0,untouchedNodes=0;
    for(const old of before.cases){const now=after.cases.find(c=>c.id===old.id)!,rr=revisions.filter(r=>r.caseId===old.id);
      expect(now.decisionNodes.map(n=>n.id)).toEqual(old.decisionNodes.map(n=>n.id));
      if(!rr.length){expect(clean(now),old.id).toEqual(clean(old));untouchedCases++;}
      for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){expect(clean(now.decisionNodes.find(x=>x.id===n.id)),n.id).toEqual(clean(n));untouchedNodes++;}
    }
    expect(untouchedCases).toBe(before.cases.length-6);expect(untouchedNodes).toBe(before.cases.flatMap(c=>c.decisionNodes).length-7);
    expect(syntheticClinicalReleaseSchema.safeParse(after).success).toBe(true);
  });
  it("keeps four exact PASS fields, clinical approvals and every batch-2b target unchanged",()=>{
    expect(clean(QUESTION_QUALITY_CLINICAL_APPROVALS)).toEqual(entry.approvals);
    for(const p of entry.packet.filter(p=>["B2A01","B2A02","B2A08","B2A09"].includes(p.id))){
      const old=entry.release.cases.find(c=>c.id===p.caseId)!,now=current.cases.find(c=>c.id===p.caseId)!;
      expect(now.presentation).toBe(old.presentation);expect(now.chiefComplaint).toBe(old.chiefComplaint);
      expect(clean(now.approvedInstantiationProfiles)).toEqual(clean(old.approvedInstantiationProfiles));
      expect(clean(now.decisionNodes.find(n=>n.id===p.nodeId)),p.id).toEqual(clean(old.decisionNodes.find(n=>n.id===p.nodeId)));
    }
    for(const r of protected2b){const old=entry.release.cases.find(c=>c.id===r.caseId)!,now=current.cases.find(c=>c.id===r.caseId)!;
      expect(now.presentation).toBe(old.presentation);expect(clean(now.decisionNodes.find(n=>n.id===r.nodeId)),r.auditId).toEqual(clean(old.decisionNodes.find(n=>n.id===r.nodeId)));
    }
    for(const[path,sha]of Object.entries(entry.files).filter(([p])=>/question-bank-batch2b/.test(p)&&!p.endsWith('.test.ts'))){
      expect(createHash('sha256').update(readFileSync(new URL('../../../'+path,import.meta.url))).digest('hex'),path).toBe(sha);
    }
  });
  it("retains all prior concepts and versions only the five materially changed objectives",()=>{
    expect(after.concepts.slice(0,before.concepts.length)).toEqual(before.concepts);expect(concepts).toHaveLength(5);
    expect(after.concepts).toHaveLength(before.concepts.length+5);
    for(const r of revisions){expect(r.questionVariantId).not.toBe(r.previousQuestionVariantId);expect(r.question).toMatchObject({reviewStatus:'needs_clinician_review',lastClinicianReview:null});
      expect(r.clinicalBinding.nextConceptId!==r.clinicalBinding.previousConceptId).toBe(!['B2A07','B2A10'].includes(r.auditId));
    }
    for(const c of concepts){expect(before.concepts.some(old=>old.id===c.previousConceptId)).toBe(true);expect(c.reviewStatus).toBe('needs_clinician_review');expect(c.lastClinicianReview).toBeNull();}
  });
  it("keeps the frozen batch-2b projection contract before the separate N2 append",()=>{
    expect(batch2bAfter.concepts).toHaveLength(batch2bBefore.concepts.length+7);
    for(const cs of batch2bBefore.cases){const now=batch2bAfter.cases.find(c=>c.id===cs.id)!;
      if(!protected2b.some(r=>r.caseId===cs.id))expect(clean(now),cs.id).toEqual(clean(cs));
      for(const n of cs.decisionNodes)if(!protected2b.some(r=>r.caseId===cs.id&&r.nodeId===n.id))expect(clean(now.decisionNodes.find(v=>v.id===n.id)),n.id).toEqual(clean(n));
    }
    expect(batch2bEndTimings.slice(batch2bOldTimings.length)).toEqual(batch2bTimings);
  });
  it("keeps complete named tasks, parallel credible option counts and all prior service gates",()=>{
    for(const r of revisions){const cs=after.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.shuffleAnswers).toBe(true);expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);expect(n.stem).toContain('{patientName}');
      expect(n.answerChoices.some(a=>/\balone\b|individuali[sz]ed|tailored|shared.decision/i.test(a.label))).toBe(false);
      if(cs.participant?.kind==='employee_discussion')expect(cs.prototypeDemographics).toBeUndefined();
      else expect(cs.presentation).toMatch(/\d+-year-old (woman|man|person)/);
      expect((cs.chiefComplaint??'').split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(r.clinicalBinding.nextResultGate).toEqual(r.clinicalBinding.previousResultGate);expect(r.clinicalBinding.nextKeyServiceId).toBe(r.clinicalBinding.previousKeyServiceId);
    }
  });
  it("retains old wait identities and binds seven new rows including the shared contrast request",()=>{
    expect(timings).toHaveLength(7);expect(ANSWER_CHOICE_TIMING_REGISTRY.slice(0,oldTimings.length)).toEqual(oldTimings);
    for(const r of revisions){const t=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(t).toBeTruthy();
      if(t.classification.kind==='test_choices')for(const choice of t.classification.choices){expect(choice.choiceLabel).toBe(r.question.answerChoices.find(a=>a.id===choice.choiceId)!.label);expect(choice.timing).toEqual(r.choiceTimingOverrides![choice.choiceId]);}
    }
    const common=timings.find(t=>t.questionVariantId===revisions.find(r=>r.auditId==='B2A04')!.questionVariantId)!;
    expect(common.classification.kind).toBe('test_choices');if(common.classification.kind==='test_choices')expect(common.classification.choices.map(c=>c.timing)).toEqual(Array(3).fill({kind:'test',timingProfileId:'timing.test.contrast_swallow'}));
  });
  it("keeps the image neutral and avoids an unsupported management-ranking task",()=>{
    const r=revisions.find(r=>r.auditId==='B2A04')!;expect(r.currentUpdate).toBeNull();expect(r.question.stem).toContain('report');
    const e=r.question.exhibit!;expect(e.kind).toBe('image');if(e.kind!=='image')throw new Error('Image required');
    expect(e.assetPath).toBe('clinical-exhibits/batch2a-r3-b04-pressure.png');
    const bytes=readFileSync(new URL('../../../apps/player/public/'+e.assetPath,import.meta.url));
    expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);expect(bytes.readUInt32BE(16)).toBe(760);expect(bytes.readUInt32BE(20)).toBe(1220);
    expect(r.question.answerChoices.some(a=>/dilation|myotomy/i.test(a.label))).toBe(false);
  });
  it("provides paired error locations instead of inferring a cause from equal marginal counts",()=>{
    const r=revisions.find(r=>r.auditId==='B2A10')!,e=r.question.exhibit!;expect(e.kind).toBe('table');if(e.kind!=='table')throw new Error('Paired table required');
    expect(e.cells).toHaveLength(5);expect(e.columnHeaders).not.toContain('Median staff minutes');
    expect(e.cells.filter(row=>row[1]==='Present'&&row[2]==='Absent')).toHaveLength(2);
    expect(e.cells.filter(row=>row[2]==='Present'&&row[3]==='Present'&&row[4]==='Absent')).toHaveLength(1);
    expect(e.cells.filter(row=>row[2]==='Present'&&row[3]==='Absent'&&row[4]==='Present')).toHaveLength(1);
    const cs=after.cases.find(c=>c.id===r.caseId)!;expect(cs.participant?.kind).toBe('employee_discussion');expect(cs.prototypeDemographics).toBeUndefined();expect(cs.chiefComplaint).toBe('Medication list audit');
  });
  it("keeps nine atomic mappings unapproved and rejects a changed source contract",()=>{
    expect(claims).toHaveLength(9);for(const claim of claims){expect(claim.sourceIds.length).toBeGreaterThan(0);expect(claim.basisClaimIds.length).toBeGreaterThan(0);expect(claim.reviewStatus).toBe('needs_clinician_review');expect(claim.lastClinicianReview).toBeNull();expect(claim.verificationScope).toContain('no source retrieval');}
    const cases=clean(before.cases),r=revisions[0]!;cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!.primaryConceptId='concept.changed';
    expect(()=>applyQuestionBankBatch2aRound3Revisions(cases)).toThrow(/clinical binding changed/);
  });
});
