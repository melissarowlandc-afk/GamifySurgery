import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as content from "./index";
import {
  QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE as live, QUESTION_QUALITY_PRE_BATCH1_RELEASE as before,
  QUESTION_QUALITY_SOURCE_RELEASE as original,
} from "./synthetic-content";
import { QUESTION_QUALITY_BATCH1_REVISIONS as batch, applyQuestionQualityBatch1Revisions } from "./question-quality-batch1-20261102";
import { QUESTION_QUALITY_REVISIONS as pilot, QUESTION_QUALITY_OWNER_ROUND2_REVISIONS as roundTwo, applyQuestionQualityRevisions, type QuestionQualityRevision } from "./question-quality-pilot-20261028";
import { QUESTION_QUALITY_20261102_CLAIMS as claims, QUESTION_QUALITY_20261102_SOURCES as sources } from "./question-quality-round3-batch1-evidence-20261102";
import { ANSWER_CHOICE_TIMING_REGISTRY as timings, QUESTION_QUALITY_BATCH1_TIMING_ENTRIES as newTimings } from "./answer-choice-timing";
import type { SyntheticClinicalCase, AnswerChoiceTimingRegistryEntry } from "./schema";
import { historicalCaseText, questionText } from "./question-quality-review.test.helpers";

const snapshot=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/round3-batch1-before-20261102.json",import.meta.url),"utf8")) as {
  cases:SyntheticClinicalCase[]; revisions:QuestionQualityRevision[]; timings:AnswerChoiceTimingRegistryEntry[];
  proposal:{variants:Array<{questionVariantId:string;caseIds:string[]}>};
};
const clean=<T>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;
const currentNode=(r:QuestionQualityRevision)=>live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;
const oldNode=(r:QuestionQualityRevision)=>before.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;

describe("owner round three and batch-one draft compatibility",()=>{
  it("covers exactly the forty proposed variants and twenty-eight visible-context identities with stable concepts",()=>{
    expect(batch.filter(r=>!r.contextCompanion).map(r=>r.previousQuestionVariantId)).toEqual(snapshot.proposal.variants.map(v=>v.questionVariantId));
    expect(batch.filter(r=>r.contextCompanion)).toHaveLength(28);
    expect(new Set(batch.map(r=>r.questionVariantId)).size).toBe(68);
    expect(live.concepts).toEqual(before.concepts);
    for(const r of batch){
      expect(r.questionVariantId).toBe(r.previousQuestionVariantId+".r2");
      expect(currentNode(r).primaryConceptId).toBe(oldNode(r).primaryConceptId);
      expect(r.question).toMatchObject({contentVersion:"question-authoring.2026-11-02.v4",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null});
      expect(currentNode(r).questionVariantId).toBe(r.questionVariantId);
      expect(currentNode(r).shuffleAnswers).toBe(true);
      expect([3,4]).toContain(currentNode(r).answerChoices.length);
      expect(currentNode(r).answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
      if(!r.contextCompanion)for(const c of r.question.answerChoices)expect(c.rationale??c.distractorRationale).toBeTruthy();
    }
  });
  it("leaves every non-batch case and all existing profile contracts unchanged without mutating the input",()=>{
    const targets=new Set(batch.map(r=>r.caseId));expect(targets.size).toBe(40);
    for(const c of before.cases)if(!targets.has(c.id))expect(live.cases.find(n=>n.id===c.id)).toEqual(c);
    const input=structuredClone(before.cases),frozen=JSON.stringify(input);applyQuestionQualityBatch1Revisions(input);expect(JSON.stringify(input)).toBe(frozen);
    for(const id of targets){
      const a=live.cases.find(c=>c.id===id)!,b=before.cases.find(c=>c.id===id)!;
      for(const f of ["id","patientPresentationVariantId","earliestFacilityStage","releasePointId","rewardTierId","requiredClinicalSetting","requiredCapabilityIds","prototypeVitalSigns","pediatricProfile","participant"] as const)expect(a[f],id+" "+f).toEqual(b[f]);
      expect(a.approvedInstantiationProfiles?.map(({presentation:_text,...p})=>p)).toEqual(b.approvedInstantiationProfiles?.map(({presentation:_text,...p})=>p));
      if(b.prototypeDemographics)expect(a.prototypeDemographics).toEqual(b.prototypeDemographics);
      else if(b.participant?.kind==="employee_discussion")expect(a.prototypeDemographics).toBeUndefined();
      else expect(a.prototypeDemographics).toEqual({ageYears:43,sexLabel:"Female"}); // Explicit synthetic adult binding, not a disease weight.
      expect(a.patientPresentationRevision).toMatchObject({contentVersion:"presentation-revision.question-quality.2026-11-02.v4",revisedPresentation:a.presentation,reviewStatus:"needs_clinician_review",lastClinicianReview:null});
      expect(a.presentation).not.toMatch(/\{ageYears\}|\{sexNoun\}/);
    }
  });
  it("retains every pre-round timing identity exactly and provides one exact current classification per revised node",()=>{
    for(const old of snapshot.timings)expect(timings.filter(t=>t.caseId===old.caseId&&t.nodeId===old.nodeId&&t.questionVariantId===old.questionVariantId)).toEqual([old]);
    expect(newTimings).toHaveLength(68);
    for(const r of batch){
      const current=newTimings.filter(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);expect(current).toHaveLength(1);
      if(current[0]!.classification.kind==="test_choices")expect(current[0]!.classification.choices.map(c=>[c.choiceId,c.choiceLabel])).toEqual(currentNode(r).answerChoices.map(c=>[c.id,c.label]));
      for(const [choiceId,profile] of Object.entries(r.timingProfileOverrides??{})){
        expect(profile).toBe("timing.test.ct");
        expect(current[0]!.classification.kind==="test_choices"&&current[0]!.classification.choices.find(c=>c.choiceId===choiceId)?.timing).toEqual({kind:"test",timingProfileId:"timing.test.ct"});
      }
    }
    // These alternatives changed order during editing. Preserve the actual
    // planned-method preview, rather than copying the old array-position hook.
    const lipomaA=newTimings.find(t=>t.questionVariantId==="question.colonic-lipoma.management.patient-to-plan.v1.r2")!;
    const lipomaB=newTimings.find(t=>t.questionVariantId==="question.colonic-lipoma.management.patient-to-plan.v2.r2")!;
    expect(lipomaA.classification.kind).toBe("test_choices");expect(lipomaB.classification.kind).toBe("test_choices");
    if(lipomaA.classification.kind==="test_choices"&&lipomaB.classification.kind==="test_choices"){
      expect(lipomaA.classification.choices.find(c=>c.choiceId==="choice.qq20261102.b21.d1")!.timing).toEqual({kind:"test",timingProfileId:"timing.test.lower_endoscopy"});
      expect(lipomaA.classification.choices.find(c=>c.choiceId==="choice.qq20261102.b21.d2")!.timing).toEqual({kind:"no_test"});
      expect(lipomaB.classification.choices.find(c=>c.choiceId==="choice.qq20261102.b22.d1")!.timing).toEqual({kind:"test",timingProfileId:"timing.test.endoscopy_with_sampling"});
    }
  });
  it("keeps all eleven owner-approved pilot drafts exact and retains the returned round-two definitions",()=>{
    const approved=["A04","A08","A11","A17","A22","A23","A27","A28","A30","A38","A40"];
    for(const id of approved){
      const old=snapshot.revisions.find(r=>r.auditId===id)!,now=pilot.find(r=>r.auditId===id)!;
      expect(questionText(now.question)).toEqual(questionText(old.question));
      expect(historicalCaseText(live.cases.find(c=>c.id===now.caseId))).toEqual(historicalCaseText(snapshot.cases.find(c=>c.id===old.caseId)));
      expect(now.ownerEditorialReview).toMatchObject({status:"approved_editorially",questionVariantId:now.questionVariantId});
      expect(now.question.reviewStatus).toBe("clinically_approved");
    }
    expect(pilot.filter(r=>r.ownerRound3Review).map(r=>r.auditId).sort()).toEqual(["A02","A06","A06-context","A25","A25-context"].sort());
    const reconstructed=applyQuestionQualityRevisions(original.cases,roundTwo);
    for(const old of snapshot.revisions){
      expect(questionText(roundTwo.find(r=>r.auditId===old.auditId)!.question)).toEqual(questionText(old.question));
      expect(historicalCaseText(reconstructed.find(c=>c.id===old.caseId))).toEqual(historicalCaseText(snapshot.cases.find(c=>c.id===old.caseId)));
    }
  });
  it("changes only gate narratives and preserves every mapped choice's operational contract",()=>{
    for(const r of batch){
      const a=currentNode(r),b=oldNode(r);
      if(r.resultNarrative){expect(a.resultGateAfter).toEqual({...b.resultGateAfter,resultNarrative:r.resultNarrative});}
      else expect(a.resultGateAfter).toEqual(b.resultGateAfter);
      for(const choice of a.answerChoices){
        const sourceId=r.choiceSourceIds?.[choice.id]??choice.id,old=b.answerChoices.find(c=>c.id===sourceId)!;
        expect(old).toBeDefined();expect(choice.serviceRequest).toEqual(old.serviceRequest);expect(choice.isCorrect).toBe(old.isCorrect);
        const previous=b.terminalDispositions.find(d=>d.answerChoiceId===sourceId),current=a.terminalDispositions.find(d=>d.answerChoiceId===choice.id);
        const operation=(d:typeof previous)=>{if(!d)return null;if(d.kind==="no_terminal_outcome"){const{answerChoiceId:_id,clinicalRationale:_reason,consequenceNarrative:_text,...rest}=d;return rest;}const{answerChoiceId:_id,...rest}=d;return rest;};
        expect(operation(current)).toEqual(operation(previous));
      }
    }
    for(const r of batch.filter(r=>/^B0[1-4]$/.test(r.auditId))){
      const c=live.cases.find(c=>c.id===r.caseId)!;
      expect(c.presentation).not.toMatch(/achalasia/i);
      for(const n of c.decisionNodes.slice(0,1))expect([n.explanation,n.teachingPoint,n.resultGateAfter?.resultNarrative].filter(Boolean).join(" ")).not.toMatch(/achalasia/i);
    }
  });
  it("fails closed when a presentation record, demographic constraint or returned result changes under the revision",()=>{
    const r=batch.find(r=>r.presentationContextBinding?.patientPresentationRevision)!;
    const changed=structuredClone(before.cases),c=changed.find(c=>c.id===r.caseId)!;
    c.patientPresentationRevision!.contentVersion="presentation-revision.unexpected";
    expect(()=>applyQuestionQualityBatch1Revisions(changed)).toThrow(/context revision source binding/);
    const ageChanged=structuredClone(before.cases),ageCase=ageChanged.find(c=>c.id===r.caseId)!;
    ageCase.prototypeDemographics!.ageYears+=1;
    expect(()=>applyQuestionQualityBatch1Revisions(ageChanged)).toThrow(/context revision source binding/);
    const withGate=batch.find(r=>r.resultNarrative)!;
    const gateChanged=structuredClone(before.cases),n=gateChanged.find(c=>c.id===withGate.caseId)!.decisionNodes.find(n=>n.id===withGate.nodeId)!;
    n.resultGateAfter!.resultNarrative="Unexpected result change";
    expect(()=>applyQuestionQualityBatch1Revisions(gateChanged)).toThrow(/Result narrative revision source binding/);
  });
  it("resolves the revised claim mappings and keeps all new evidence unapproved with the conflicting point withheld",()=>{
    const knownClaims=new Set<string>(),knownSources=new Set<string>(),seen=new WeakSet<object>();
    const visit=(v:unknown):void=>{if(!v||typeof v!=="object"||seen.has(v))return;seen.add(v);const x=v as Record<string,unknown>;if(typeof x.id==="string"&&Array.isArray(x.sourceIds))knownClaims.add(x.id);if(typeof x.id==="string"&&typeof x.completeCitation==="string")knownSources.add(x.id);Object.values(v).forEach(visit);};visit(content);
    for(const r of [...batch,...pilot])for(const id of r.question.supportingEvidenceClaimIds)expect(knownClaims.has(id),id).toBe(true);
    for(const claim of claims){expect(claim).toMatchObject({reviewStatus:"needs_clinician_review",lastCheckedOn:"2026-11-02",lastClinicianReview:null});for(const id of claim.sourceIds)expect(knownSources.has(id),id).toBe(true);expect(claim.limitation).toBeTruthy();}
    for(const source of sources){for(const f of ["completeCitation","organizationOrJournal","officialUrl","accessedOn","sourceClass","licenseLabel","reuseStatus","reuseNotes","authorityAssessment","usageRole"] as const)expect(source[f]).toBeTruthy();for(const id of source.evidenceClaimIds)expect(claims.some(c=>c.id===id&&c.sourceIds.includes(source.id))).toBe(true);}
    const withheld=claims.find(c=>c.certainty==="conflicting")!;expect(withheld.limitation).toContain("WITHHELD");expect([...batch,...pilot].some(r=>r.question.supportingEvidenceClaimIds.includes(withheld.id))).toBe(false);
  });
});
