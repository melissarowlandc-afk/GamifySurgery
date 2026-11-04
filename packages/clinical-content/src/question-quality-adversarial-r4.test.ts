import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";
import {
  QUESTION_QUALITY_PRE_ADVERSARIAL_R5_RELEASE as live, QUESTION_QUALITY_PRE_ADVERSARIAL_R4_RELEASE as before,
  QUESTION_QUALITY_PRE_ADVERSARIAL_R5_REVISIONS as current, QUESTION_QUALITY_REVISIONS as pilot,
  QUESTION_QUALITY_ADVERSARIAL_R4_REVISIONS as revisions,
  QUESTION_QUALITY_ADVERSARIAL_R4_AUTHORING_CONCEPTS as versions,
  QUESTION_QUALITY_ADVERSARIAL_R4_CLAIMS as claims, QUESTION_QUALITY_ADVERSARIAL_R4_SOURCES as sources,
  QUESTION_QUALITY_PRE_ADVERSARIAL_R5_TIMING_ENTRIES as timings, applyQuestionQualityAdversarialR4Revisions,
} from "./index";
import type {SyntheticClinicalCase, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionQualityRevision} from "./question-quality-pilot-20261028";

const entry=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/adversarial-r4-before-20261102.json",import.meta.url),"utf8")) as {
  cases:SyntheticClinicalCase[]; revisions:QuestionQualityRevision[]; timings:AnswerChoiceTimingRegistryEntry[];
  review:Array<{id:string; verdict:string; basicVerdict?:string; cues:unknown[]; fairness:unknown[]; suggestions:unknown[]}>;
  concepts:typeof live.concepts; approvals:Array<{auditId:string}>;
};
const clean=<T>(v:T):T=>v===undefined?v:JSON.parse(JSON.stringify(v)) as T;
const caseOf=(id:string)=>live.cases.find(c=>c.id===id)!;

describe("fourth author revision: application versions and exact retained identities",()=>{
  it("advances the 45 unambiguous returned items and binds every relevant review-three note",()=>{
    expect(revisions).toHaveLength(45);
    expect(new Set(revisions.map(r=>r.auditId))).toEqual(new Set(entry.review.filter(r=>r.verdict!=="PASS"&&r.id!=="B29").map(r=>r.id)));
    for(const r of revisions){
      const old=entry.revisions.find(p=>p.auditId===r.auditId)!,review=entry.review.find(p=>p.id===r.auditId)!;
      expect(r.previousQuestionVariantId).toBe(old.questionVariantId);
      expect(r.questionVariantId).toBe(old.questionVariantId.replace(/\.r(\d+)$/,(_,n:string)=>".r"+(Number(n)+1)));
      expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-02.v7"});
      expect(r.basicRecallIntentional).not.toBe(true);expect(r.basicRecallJustification).toBeUndefined();
      expect(r.reviewResponse!.sourceReviewId).toContain("adversarial-review3-20261102.json#"+r.auditId);
      for(const k of ["cues","fairness","suggestions"] as const)expect(r.reviewResponse!.noteResponses[k]).toHaveLength(review[k].length);
      expect(r.reviewResponse!.selfCheck.reasoningSteps.length).toBeGreaterThanOrEqual(2);
      const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.questionVariantId).toBe(r.questionVariantId);expect(n.shuffleAnswers).toBe(true);
      expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
    }
  });
  it("preserves all 27 PASS versions, three accepted-basic versions and eleven exact clinical approvals",()=>{
    const frozen=entry.review.filter(r=>r.verdict==="PASS"||r.basicVerdict==="ACCEPT_BASIC");
    expect(frozen).toHaveLength(28);
    expect(frozen.filter(r=>r.verdict==="PASS")).toHaveLength(27);
    expect(frozen.filter(r=>r.basicVerdict==="ACCEPT_BASIC")).toHaveLength(3);
    for(const p of frozen){
      const old=entry.revisions.find(r=>r.auditId===p.id)!,now=current.find(r=>r.auditId===p.id)!;
      const a=caseOf(now.caseId),b=entry.cases.find(c=>c.id===old.caseId)!;
      expect(clean(now.question),p.id).toEqual(clean(old.question));
      expect(a.presentation,p.id).toBe(b.presentation);expect(a.chiefComplaint).toBe(b.chiefComplaint);
      expect(clean(a.approvedInstantiationProfiles),p.id).toEqual(clean(b.approvedInstantiationProfiles));
      expect(clean(a.decisionNodes.find(n=>n.id===now.nodeId)),p.id).toEqual(clean(b.decisionNodes.find(n=>n.id===old.nodeId)));
    }
    for(const a of entry.approvals){
      const old=entry.revisions.find(r=>r.auditId===a.auditId)!,now=pilot.find(r=>r.auditId===a.auditId)!;
      expect(clean(now.question)).toEqual(clean(old.question));expect(now.question.reviewStatus).toBe("clinically_approved");
    }
  });
  it("adds explicit new concept versions without replacing old concepts or migrating histories",()=>{
    expect(versions).toHaveLength(18);expect(live.concepts).toHaveLength(388);
    expect(live.concepts.slice(0,entry.concepts.length)).toEqual(entry.concepts);
    for(const v of versions){
      expect(v.id).toBe(v.previousConceptId+".v2");expect(entry.concepts.some(c=>c.id===v.previousConceptId)).toBe(true);
      expect(v.reviewStatus).toBe("needs_clinician_review");expect(v.lastClinicianReview).toBeNull();
      expect(v.versioningReason).toBeTruthy();expect(v.educationalTier).toBe(1);
      expect(v.revisedItemIds.length).toBeGreaterThan(0);expect(v.evidenceClaimIds.length).toBeGreaterThan(0);
      for(const id of v.revisedItemIds)expect(revisions.find(r=>r.auditId===id)!.question.conceptId).toBe(v.id);
    }
    for(const r of revisions)expect(r.question.conceptId).toBe(r.clinicalBinding.nextConceptId);
  });
  it("retains 1669 frozen timing rows and applies only recorded clinical binding changes",()=>{
    expect(timings).toHaveLength(1714);
    for(const row of entry.timings)expect(clean(timings.find(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId))).toEqual(row);
    const source=structuredClone(before.cases),serialized=JSON.stringify(source);
    applyQuestionQualityAdversarialR4Revisions(source);expect(JSON.stringify(source)).toBe(serialized);
    const targets=new Set(revisions.map(r=>r.caseId));
    for(const cs of before.cases)if(!targets.has(cs.id))expect(caseOf(cs.id)).toEqual(cs);
    expect(revisions.filter(r=>r.clinicalBinding.previousKeyServiceId!==r.clinicalBinding.nextKeyServiceId).map(r=>r.auditId).sort())
      .toEqual(["B06","B08","B09","B14-context","B33-context","B34-context","B35-context"]);
    for(const r of revisions){
      const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!,b=r.clinicalBinding;
      expect(n.primaryConceptId).toBe(b.nextConceptId);expect(n.resultGateAfter).toEqual(b.nextResultGate);
      expect(n.answerChoices.find(c=>c.isCorrect)!.serviceRequest?.serviceId??null).toBe(b.nextKeyServiceId);
      if(n.resultGateAfter){expect(n.resultGateAfter.resultTypeId).toBe(b.nextKeyServiceId);expect(n.resultGateAfter.allowedServiceRouteIds.length).toBeGreaterThan(0);}
    }
  });
  it("maps new facts to 35 atomic claims and 25 explicit source/rights records",()=>{
    expect(claims).toHaveLength(35);expect(sources).toHaveLength(25);
    const byId=new Map(sources.map(s=>[s.id,s])),used=new Set(revisions.flatMap(r=>r.question.supportingEvidenceClaimIds));
    for(const claim of claims){
      expect(used.has(claim.id),claim.id).toBe(true);expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.lastCheckedOn).toBe("2026-11-02");expect(claim.limitation).toBeTruthy();
      for(const id of claim.sourceIds){const s=byId.get(id)!;expect(s,id).toBeDefined();expect(s.evidenceClaimIds).toContain(claim.id);expect(s.completeCitation).toBeTruthy();expect(s.officialUrl).toMatch(/^https:/);expect(s.licenseLabel).toBeTruthy();expect(s.reuseNotes).toBeTruthy();expect(s.authorityAssessment).toBeTruthy();}
    }
  });
  it("uses existing testing profiles for the changed decisions and keeps the bleeding-ulcer sequence coherent",()=>{
    for(const r of revisions){
      const row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row).toBeDefined();
      if(row.classification.kind!=="test_choices")continue;
      expect(row.classification.choices.map(c=>c.choiceId)).toEqual(r.question.answerChoices.map(c=>c.id));
      for(const c of row.classification.choices)if(c.timing.kind==="test")expect(c.timing.timingProfileId).toMatch(/^timing\.test\./);
    }
    const first=revisions.find(r=>r.auditId==="B40")!,next=revisions.find(r=>r.auditId==="B40-context")!;
    expect(first.question.explanation.toLowerCase()).not.toContain("embol");
    expect(next.currentUpdate).toContain("same duodenal ulcer");
    expect(next.question.answerChoices[0]!.label).toBe("Transcatheter arterial embolization");
    const a25=revisions.find(r=>r.auditId==="A25-context")!;
    expect(a25.currentUpdate).toContain("without regaining awareness");
    expect(a25.question.conceptId).not.toBe(a25.clinicalBinding.previousConceptId);
  });
  it("resolves every revised age/sex field through the existing bound demographic profiles",()=>{
    for(const r of revisions.filter(r=>r.presentationTemplate)){
      const cs=caseOf(r.caseId);
      for(const p of [cs,...cs.approvedInstantiationProfiles??[]]){
        expect(p.presentation,r.auditId).not.toMatch(/\{(?:ageSex|ageYears|sexNoun)\}/);
        if(!p.prototypeDemographics)continue;
        const d=p.prototypeDemographics,sex=d.sexLabel==="Female"?"woman":d.sexLabel==="Male"?"man":"person";
        expect(p.presentation,r.auditId).toContain(`${d.ageYears}-year-old ${sex}`);
      }
    }
  });
});
