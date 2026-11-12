import {beforeFlags3AcceptanceTimings} from "./question-flags3-acceptance-test-support";
import {describe,expect,it} from "vitest";
import {beforeN3AcceptanceRelease,beforeN3AcceptanceManifest} from "./question-new-n3-acceptance-test-support";
import {PROTOTYPE_BALANCE_RELEASE} from "@gamify-surgery/balance-config";
import {QUESTION_CATALOG_RELEASE as catalog,SYNTHETIC_CLINICAL_RELEASE as currentLive} from "./synthetic-content";
import {QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE as source} from "./question-new-n3-round3-source-20261105";
import {QUESTION_NEW_N3_ROUND2_ITEMS as oldItems,QUESTION_NEW_N3_ROUND2_CASES as oldCases,QUESTION_NEW_N3_ROUND2_QUESTIONS as oldQuestions,
 QUESTION_NEW_N3_ROUND2_REVIEW_TIMING as oldTiming,QUESTION_NEW_N3_ROUND2_SELF_CHECKS as oldChecks,QUESTION_NEW_N3_ROUND2_STATEMENT_MAPPINGS as oldMappings,
 QUESTION_NEW_N3_ROUND2_CLAIMS as oldClaims,QUESTION_NEW_N3_ROUND2_SOURCES as oldSources} from "./question-new-n3-round2-20261105";
import {QUESTION_NEW_N3_ROUND3_ITEMS as items,QUESTION_NEW_N3_ROUND3_CASES as cases,QUESTION_NEW_N3_ROUND3_QUESTIONS as questions,
 QUESTION_NEW_N3_ROUND3_REVISIONS as revisions,QUESTION_NEW_N3_ROUND3_REVIEW_TIMING as timing,
 QUESTION_NEW_N3_ROUND3_SELF_CHECKS as checks,QUESTION_NEW_N3_ROUND3_STATEMENT_MAPPINGS as mappings,
 QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES as newTiming,QUESTION_NEW_N3_ROUND3_FROZEN_PASS_IDS as frozen,
 QUESTION_NEW_N3_ROUND3_CLAIMS as claims,QUESTION_NEW_N3_ROUND3_SOURCES as sources,
 QUESTION_NEW_N3_ROUND3_PARKED_CASE_IDS as parked,QUESTION_NEW_N3_ROUND3_NEW_CONCEPT_VERSIONS as meanings,
 applyQuestionNewN3Round3Revisions} from "./question-new-n3-round3-20261105";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualRegistry} from "./answer-choice-timing";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES as acceptedFlags2Timing} from "./question-flags2-whole-case-accepted-20261105";
const registry=beforeFlags3AcceptanceTimings(actualRegistry);
const priorIndex=(slug:string)=>oldItems.findIndex(i=>i.slug===slug);
const live=beforeN3AcceptanceRelease(currentLive),manifest=beforeN3AcceptanceManifest(currentManifest);
describe("N3 final-round candidate source and exact version preservation",()=>{
 it("submits three repairs, freezes five PASS and parks thirty-two without deleting catalog drafts",()=>{
  expect(revisions).toHaveLength(3);expect(cases).toHaveLength(8);expect(frozen).toHaveLength(5);expect(parked).toHaveLength(32);
  expect(source.cases).toEqual(cases);expect(source.concepts).toHaveLength(8);expect(meanings).toHaveLength(1);
  for(const id of parked)expect(catalog.cases.some(c=>c.id===id)).toBe(true);
  expect(parked).toContain("case.n3.pleural-source-versus-systemic-response.v1");
 });
 it("retains every frozen PASS definition, timing, mapping and author record exactly",()=>{
  for(const id of frozen){const slug=id.replace(/^review\.n3\./,"").replace(/\.v2$/,"");const index=items.findIndex(i=>i.slug===slug),old=priorIndex(slug);
   for(const [current,previous] of [[cases,oldCases],[questions,oldQuestions],[timing,oldTiming],[checks,oldChecks],[mappings,oldMappings]] as const)
    expect(current[index]).toBe(previous[old]);
  }
 });
 it("keeps default and main catalog unchanged, and projects only an explicit matching fresh version",()=>{
  expect(manifest.accepted.some(r=>r.acceptanceId.startsWith("review.n3."))).toBe(false);
  expect(live.cases.some(c=>c.id.startsWith("case.n3."))).toBe(false);expect(live.concepts.some(c=>c.id.startsWith("concept.n3."))).toBe(false);
  for(const r of revisions){const id="case.n3."+r.slug+".v1",old=catalog.cases.find(c=>c.id===id)!;
   expect(old.decisionNodes[0]!.questionVariantId).toBe("question.n3."+r.slug+".v2");
   expect(applyQuestionNewN3Round3Revisions([old])[0]).toEqual(cases.find(c=>c.id===id));
   const unknown={...old,decisionNodes:[{...old.decisionNodes[0]!,questionVariantId:"question.unknown"}]};
   expect(applyQuestionNewN3Round3Revisions([unknown])[0]).toBe(unknown);
  }
 });
 it("retains the complete recorded evidence objects and original verification dates",()=>{
  expect(claims).toBe(oldClaims);expect(sources).toBe(oldSources);
  expect(claims.every(c=>c.reviewStatus==="needs_clinician_review")).toBe(true);
 });
 it("archives exact new timing identities after every previous tuple",()=>{
  expect(newTiming).toHaveLength(3);expect(acceptedFlags2Timing).toHaveLength(2);
  expect(registry.slice(-5)).toEqual([...newTiming,...acceptedFlags2Timing]);
  const keys=registry.map(t=>JSON.stringify([t.caseId,t.nodeId,t.questionVariantId]));expect(new Set(keys).size).toBe(keys.length);
  for(const t of oldTiming)expect(registry).toContainEqual(t);
 });
 it.each(cases.map((cs,index)=>[cs.id,index]as const))("binds %s to one supported reviewable question and complete runtime estimates",(_id,index)=>{
  const cs=cases[index]!,i=items[index]!,q=questions[index]!,node=cs.decisionNodes[0]!,revision=revisions.find(r=>r.slug===i.slug);
  expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();expect(q.conceptId).toBe(node.primaryConceptId);
  expect(node.shuffleAnswers).toBe(true);expect(node.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);expect([3,4]).toContain(node.answerChoices.length);
  expect(cs.requiredCapabilityIds).toEqual([]);expect(node.resultGateAfter).toBeNull();expect(node.answerChoices.every(c=>c.serviceRequest===null)).toBe(true);
  expect(cs.prototypeDemographics).toEqual({ageYears:i.age,sexLabel:i.sex});expect(cs.presentation).toContain(i.age+"-year-old");
  expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);expect(cs.approvedInstantiationProfiles?.[0]?.presentation).toBe(cs.presentation);
  expect(source.cases).toContainEqual(cs);expect(registry).toContainEqual(timing[index]);
  const t=timing[index]!;if(t.classification.kind==="test_choices")for(const c of t.classification.choices){
   expect(node.answerChoices.find(x=>x.id===c.choiceId)?.label).toBe(c.choiceLabel);
   if(c.timing.kind==="test"){const profile=c.timing.timingProfileId;expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.some(p=>p.id===profile)).toBe(true);}
  }
  for(const id of q.supportingEvidenceClaimIds){const claim=claims.find(c=>c.id===id)!;expect(claim).toBeDefined();
   for(const sid of claim.sourceIds)expect(sources.find(s=>s.id===sid)?.evidenceClaimIds).toContain(id);
  }
  if(revision){expect(node.questionVariantId.endsWith(".v3")).toBe(true);expect(revision.item.interpret.length).toBeGreaterThan(20);expect(revision.item.apply.length).toBeGreaterThan(20);
   const check=checks[index]!;expect("calibratedRejectionTests" in check).toBe(true);
   if("calibratedRejectionTests" in check)expect(node.answerChoices.some(c=>c.id===check.calibratedRejectionTests.dataAblation.thenBestChoiceId)).toBe(true);
  }
 });
});
