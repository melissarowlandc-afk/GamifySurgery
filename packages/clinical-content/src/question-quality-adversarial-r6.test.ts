import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
 QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE as live, QUESTION_QUALITY_PRE_ADVERSARIAL_R6_RELEASE as before,
 QUESTION_QUALITY_PRE_ADVERSARIAL_R7_REVISIONS as current, QUESTION_QUALITY_REVISIONS as pilot,
 QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS as revisions, QUESTION_QUALITY_ADVERSARIAL_R6_AUTHORING_CONCEPTS as versions,
 QUESTION_QUALITY_ADVERSARIAL_R6_CLAIMS as claims, QUESTION_QUALITY_ADVERSARIAL_R6_SOURCES as sources,
 QUESTION_QUALITY_PRE_ADVERSARIAL_R7_TIMING_ENTRIES as timings, applyQuestionQualityAdversarialR6Revisions,
} from "./index";
import type {SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionQualityRevision} from "./question-quality-pilot-20261028";
const entry=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/adversarial-r6-before-20261102.json",import.meta.url),"utf8")) as {
 cases:SyntheticClinicalCase[];revisions:QuestionQualityRevision[];timings:AnswerChoiceTimingRegistryEntry[];
 review:Array<{id:string;verdict:string;basicVerdict?:string;cues:unknown[];fairness:unknown[];suggestions:unknown[]}>;
 concepts:typeof live.concepts;approvals:Array<{auditId:string}>;
};
const clean=<T>(v:T):T=>v===undefined?v:JSON.parse(JSON.stringify(v)) as T;
const caseOf=(id:string)=>live.cases.find(c=>c.id===id)!;

describe("sixth author revision: exact frozen versions and additive interpretation drafts",()=>{
 it("revises exactly sixteen returned identities and indexes every one of the 117 notes",()=>{
  expect(revisions).toHaveLength(16);expect(new Set(revisions.map(r=>r.auditId))).toEqual(new Set(entry.review.filter(r=>r.verdict==="REVISE").map(r=>r.id)));
  let notes=0;
  for(const r of revisions){const old=entry.revisions.find(p=>p.auditId===r.auditId)!,review=entry.review.find(p=>p.id===r.auditId)!;
   expect(r.previousQuestionVariantId).toBe(old.questionVariantId);expect(r.questionVariantId).toBe(old.questionVariantId.replace(/\.r(\d+)$/,(_,n:string)=>".r"+(Number(n)+1)));
   expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-02.v9"});
   expect(r.reviewResponse!.sourceReviewId).toContain("adversarial-review5-20261102.json#"+r.auditId);
   for(const k of ["cues","fairness","suggestions"] as const){expect(r.reviewResponse!.noteResponses[k]).toHaveLength(review[k].length);notes+=review[k].length;}
   const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;expect(n.questionVariantId).toBe(r.questionVariantId);expect(n.shuffleAnswers).toBe(true);expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
   expect(r.basicRecallIntentional).not.toBe(true);
  }expect(notes).toBe(117);
 });
 it("preserves all 57 PASS questions and exact shared presentation/profile/node values",()=>{
  const passed=entry.review.filter(r=>r.verdict==="PASS");expect(passed).toHaveLength(57);
  for(const p of passed){const old=entry.revisions.find(r=>r.auditId===p.id)!,now=current.find(r=>r.auditId===p.id)!,a=caseOf(now.caseId),b=entry.cases.find(c=>c.id===old.caseId)!;
   expect(clean(now.question),p.id).toEqual(clean(old.question));expect(a.presentation,p.id).toBe(b.presentation);expect(a.chiefComplaint,p.id).toBe(b.chiefComplaint);expect(clean(a.approvedInstantiationProfiles),p.id).toEqual(clean(b.approvedInstantiationProfiles));expect(clean(a.decisionNodes.find(n=>n.id===now.nodeId)),p.id).toEqual(clean(b.decisionNodes.find(n=>n.id===old.nodeId)));
  }
 });
 it("keeps all three accepted basic versions including B29, and eleven named approvals exact",()=>{
  const basic=entry.review.filter(r=>r.basicVerdict==="ACCEPT_BASIC");expect(basic.map(r=>r.id).sort()).toEqual(["B01","B10","B29"]);
  for(const p of basic)expect(clean(current.find(r=>r.auditId===p.id)!.question)).toEqual(clean(entry.revisions.find(r=>r.auditId===p.id)!.question));
  expect(revisions.some(r=>r.auditId==="B29")).toBe(false);expect(entry.approvals).toHaveLength(11);
  for(const a of entry.approvals){const old=entry.revisions.find(r=>r.auditId===a.auditId)!,now=pilot.find(r=>r.auditId===a.auditId)!;expect(clean(now.question)).toEqual(clean(old.question));expect(now.question.reviewStatus).toBe("clinically_approved");const cs=caseOf(now.caseId),b=entry.cases.find(c=>c.id===now.caseId)!;expect(JSON.stringify(cs.decisionNodes.find(n=>n.id===now.nodeId))).toBe(JSON.stringify(b.decisionNodes.find(n=>n.id===old.nodeId)));}
 });
 it("adds three explicit construct versions without replacing any of the 389 previous definitions",()=>{
  expect(versions).toHaveLength(3);expect(live.concepts).toHaveLength(392);expect(live.concepts.slice(0,389)).toEqual(entry.concepts);
  for(const v of versions){expect(entry.concepts.some(c=>c.id===v.previousConceptId)).toBe(true);expect(v.reviewStatus).toBe("needs_clinician_review");expect(v.lastClinicianReview).toBeNull();expect(v.versioningReason).toBeTruthy();for(const id of v.revisedItemIds)expect(revisions.find(r=>r.auditId===id)!.question.conceptId).toBe(v.id);}
 });
 it("retains all 1740 old timing identities and appends sixteen exact new rows",()=>{
  expect(timings).toHaveLength(1756);for(const row of entry.timings)expect(clean(timings.find(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId))).toEqual(row);
  for(const r of revisions){const row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row).toBeDefined();if(row.classification.kind==="test_choices")expect(row.classification.choices.map(c=>c.choiceId)).toEqual(r.question.answerChoices.map(c=>c.id));}
  for(const id of ["B03-context","B11-context","B12-context","B17-context","B18-context","B19-context"]){const r=revisions.find(r=>r.auditId===id)!,row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row.classification.kind).toBe("test_choices");if(row.classification.kind==="test_choices"){expect(row.classification.choices.every(c=>c.timing.kind==="test")).toBe(true);expect(new Set(row.classification.choices.map(c=>c.timing.kind==="test"?c.timing.timingProfileId:null)).size).toBe(1);}}
 });
 it("does not mutate entry cases or unrelated cases and projects explicit result contracts",()=>{
  const input=structuredClone(before.cases),serialized=JSON.stringify(input);applyQuestionQualityAdversarialR6Revisions(input);expect(JSON.stringify(input)).toBe(serialized);
  const targets=new Set(revisions.map(r=>r.caseId));for(const cs of before.cases)if(!targets.has(cs.id))expect(caseOf(cs.id)).toEqual(cs);
  for(const r of revisions){const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;expect(n.resultGateAfter).toEqual(r.clinicalBinding.nextResultGate);expect(n.primaryConceptId).toBe(r.clinicalBinding.nextConceptId);}
 });
 it("changes only B05's keyed service to the existing MRI route and retains all other contracts",()=>{
  expect(revisions.filter(r=>r.clinicalBinding.previousKeyServiceId!==r.clinicalBinding.nextKeyServiceId).map(r=>r.auditId)).toEqual(["B05"]);
  const r=revisions.find(r=>r.auditId==="B05")!;expect(r.clinicalBinding.previousKeyServiceId).toBe("service.ultrasound");expect(r.clinicalBinding.nextKeyServiceId).toBe("service.mri");expect(r.clinicalBinding.nextResultGate).toMatchObject({resultTypeId:"service.mri",allowedServiceRouteIds:["route.mri.outsourced"]});
  const key=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!.answerChoices.find(c=>c.isCorrect)!;expect(key.serviceRequest?.serviceId).toBe("service.mri");
 });
 it("maps all three new claims to four fully recorded reused primary sources",()=>{
  expect(claims).toHaveLength(3);expect(sources).toHaveLength(4);for(const claim of claims){expect(revisions.some(r=>r.question.supportingEvidenceClaimIds.includes(claim.id))).toBe(true);expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.limitation).toBeTruthy();for(const id of claim.sourceIds){const s=sources.find(s=>s.id===id)!;expect(s.evidenceClaimIds).toContain(claim.id);expect(s.completeCitation).toBeTruthy();expect(s.officialUrl).toMatch(/^https:/);expect(s.licenseLabel).toBeTruthy();expect(s.authorityAssessment).toContain("offline");}}
 });
});
