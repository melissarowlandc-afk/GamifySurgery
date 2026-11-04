import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
 SYNTHETIC_CLINICAL_RELEASE as live, QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE as before,
 QUESTION_QUALITY_CURRENT_REVISIONS as current, QUESTION_QUALITY_REVISIONS as pilot,
 QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS as revisions, QUESTION_QUALITY_ADVERSARIAL_R7_AUTHORING_CONCEPTS as versions,
 QUESTION_QUALITY_ADVERSARIAL_R7_CLAIMS as claims, QUESTION_QUALITY_ADVERSARIAL_R7_SOURCES as sources,
 ANSWER_CHOICE_TIMING_REGISTRY as timings, applyQuestionQualityAdversarialR7Revisions,
} from "./index";
import type {SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionQualityRevision} from "./question-quality-pilot-20261028";
const entry=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/adversarial-r7-before-20261102.json",import.meta.url),"utf8")) as {
 cases:SyntheticClinicalCase[];revisions:QuestionQualityRevision[];timings:AnswerChoiceTimingRegistryEntry[];
 review:Array<{id:string;verdict:string;basicVerdict?:string;cues:unknown[];fairness:unknown[];suggestions:unknown[]}>;
 concepts:typeof live.concepts;approvals:Array<{auditId:string}>;
};
const clean=<T>(v:T):T=>v===undefined?v:JSON.parse(JSON.stringify(v)) as T;
const caseOf=(id:string)=>live.cases.find(c=>c.id===id)!;

describe("seventh and final author revision: exact frozen versions and additive interpretation drafts",()=>{
 it("revises exactly eleven returned identities and indexes every one of the 107 notes",()=>{
  expect(revisions).toHaveLength(11);expect(new Set(revisions.map(r=>r.auditId))).toEqual(new Set(entry.review.filter(r=>r.verdict==="REVISE").map(r=>r.id)));
  let notes=0;
  for(const r of revisions){const old=entry.revisions.find(p=>p.auditId===r.auditId)!,review=entry.review.find(p=>p.id===r.auditId)!;
   expect(r.previousQuestionVariantId).toBe(old.questionVariantId);expect(r.questionVariantId).toBe(old.questionVariantId.replace(/\.r(\d+)$/,(_,n:string)=>".r"+(Number(n)+1)));
   expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,contentVersion:"question-authoring.2026-11-02.v10"});
   expect(r.reviewResponse!.sourceReviewId).toContain("adversarial-review6-20261102.json#"+r.auditId);
   for(const k of ["cues","fairness","suggestions"] as const){expect(r.reviewResponse!.noteResponses[k]).toHaveLength(review[k].length);notes+=review[k].length;}
   const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;expect(n.questionVariantId).toBe(r.questionVariantId);expect(n.shuffleAnswers).toBe(true);expect([3,4]).toContain(n.answerChoices.length);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
   expect(r.basicRecallIntentional).not.toBe(true);
  }expect(notes).toBe(107);
 });
 it("preserves all 62 PASS questions and exact shared presentation/profile/node values",()=>{
  const passed=entry.review.filter(r=>r.verdict==="PASS");expect(passed).toHaveLength(62);
  for(const p of passed){const old=entry.revisions.find(r=>r.auditId===p.id)!,now=current.find(r=>r.auditId===p.id)!,a=caseOf(now.caseId),b=entry.cases.find(c=>c.id===old.caseId)!;
   expect(clean(now.question),p.id).toEqual(clean(old.question));expect(a.presentation,p.id).toBe(b.presentation);expect(a.chiefComplaint,p.id).toBe(b.chiefComplaint);expect(clean(a.approvedInstantiationProfiles),p.id).toEqual(clean(b.approvedInstantiationProfiles));expect(clean(a.decisionNodes.find(n=>n.id===now.nodeId)),p.id).toEqual(clean(b.decisionNodes.find(n=>n.id===old.nodeId)));
  }
 });
 it("keeps all three accepted basic versions including B29, and eleven named approvals exact",()=>{
  const basic=entry.review.filter(r=>["B01","B10","B29"].includes(r.id));expect(basic.map(r=>r.id).sort()).toEqual(["B01","B10","B29"]);
  for(const p of basic)expect(clean(current.find(r=>r.auditId===p.id)!.question)).toEqual(clean(entry.revisions.find(r=>r.auditId===p.id)!.question));
  expect(revisions.some(r=>r.auditId==="B29")).toBe(false);expect(entry.approvals).toHaveLength(11);
  for(const a of entry.approvals){const old=entry.revisions.find(r=>r.auditId===a.auditId)!,now=pilot.find(r=>r.auditId===a.auditId)!;expect(clean(now.question)).toEqual(clean(old.question));expect(now.question.reviewStatus).toBe("clinically_approved");const cs=caseOf(now.caseId),b=entry.cases.find(c=>c.id===now.caseId)!;expect(JSON.stringify(cs.decisionNodes.find(n=>n.id===now.nodeId))).toBe(JSON.stringify(b.decisionNodes.find(n=>n.id===old.nodeId)));}
 });
 it("adds four explicit construct versions without replacing any of the 392 previous definitions",()=>{
  expect(versions).toHaveLength(4);expect(live.concepts).toHaveLength(396);expect(live.concepts.slice(0,392)).toEqual(entry.concepts);
  for(const v of versions){expect(entry.concepts.some(c=>c.id===v.previousConceptId)).toBe(true);expect(v.reviewStatus).toBe("needs_clinician_review");expect(v.lastClinicianReview).toBeNull();expect(v.versioningReason).toBeTruthy();for(const id of v.revisedItemIds)expect(revisions.find(r=>r.auditId===id)!.question.conceptId).toBe(v.id);}
 });
 it("retains all 1756 old timing identities and appends eleven exact new rows",()=>{
  expect(timings).toHaveLength(1767);for(const row of entry.timings)expect(clean(timings.find(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId))).toEqual(row);
  for(const r of revisions){const row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row).toBeDefined();if(row.classification.kind==="test_choices")expect(row.classification.choices.map(c=>c.choiceId)).toEqual(r.question.answerChoices.map(c=>c.id));}
  for(const id of ["B03-context","B12-context","B17-context","B18-context","B19-context"]){const r=revisions.find(r=>r.auditId===id)!,row=timings.find(t=>t.questionVariantId===r.questionVariantId)!;expect(row.classification.kind).toBe("test_choices");if(row.classification.kind==="test_choices"){expect(row.classification.choices.every(c=>c.timing.kind==="test")).toBe(true);expect(new Set(row.classification.choices.map(c=>c.timing.kind==="test"?c.timing.timingProfileId:null)).size).toBe(1);}}
 });
 it("does not mutate entry cases or unrelated cases and projects explicit result contracts",()=>{
  const input=structuredClone(before.cases),serialized=JSON.stringify(input);applyQuestionQualityAdversarialR7Revisions(input);expect(JSON.stringify(input)).toBe(serialized);
  const targets=new Set(revisions.map(r=>r.caseId));for(const cs of before.cases)if(!targets.has(cs.id))expect(caseOf(cs.id)).toEqual(cs);
  for(const r of revisions){const n=caseOf(r.caseId).decisionNodes.find(n=>n.id===r.nodeId)!;expect(n.resultGateAfter).toEqual(r.clinicalBinding.nextResultGate);expect(n.primaryConceptId).toBe(r.clinicalBinding.nextConceptId);}
 });
 it("keeps all keyed services, result contracts and case node counts unchanged",()=>{
  expect(revisions.filter(r=>r.clinicalBinding.previousKeyServiceId!==r.clinicalBinding.nextKeyServiceId)).toEqual([]);
  for(const r of revisions)expect(r.clinicalBinding.nextResultGate).toEqual(r.clinicalBinding.previousResultGate);
  for(const cs of before.cases)expect(caseOf(cs.id).decisionNodes.length).toBe(cs.decisionNodes.length);
 });
 it("maps two new limited claims to three fully recorded reused primary sources",()=>{
  expect(claims).toHaveLength(2);expect(sources).toHaveLength(3);for(const claim of claims){expect(revisions.some(r=>r.question.supportingEvidenceClaimIds.includes(claim.id))).toBe(true);expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.limitation).toBeTruthy();for(const id of claim.sourceIds){const s=sources.find(s=>s.id===id)!;expect(s.evidenceClaimIds).toContain(claim.id);expect(s.completeCitation).toBeTruthy();expect(s.officialUrl).toMatch(/^https:/);expect(s.licenseLabel).toBeTruthy();expect(s.authorityAssessment).toContain("offline");}}
 });
 it("supplies the missing local invasion observation without pre-answering the frozen tract task",()=>{
  const skin=revisions.find(r=>r.auditId==="B17-context")!;expect(skin.currentUpdate).toContain("represented dermis contains none of those cells");
  const mr=revisions.find(r=>r.auditId==="B19-context")!;const visible=JSON.stringify([mr.question.stem,mr.question.answerChoices,mr.question.explanation,mr.currentUpdate,mr.question.exhibit]);
  expect(visible).not.toMatch(/rectus|adductor|compartment|incisional|core biopsy|path A|path B/i);
  const later=current.find(r=>r.auditId==="B19")!;expect(clean(later.question)).toEqual(clean(entry.revisions.find(r=>r.auditId==="B19")!.question));
 });

});
