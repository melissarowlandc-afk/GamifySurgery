import {describe,expect,it} from "vitest";
import {PROTOTYPE_BALANCE_RELEASE} from "@gamify-surgery/balance-config";
import {QUESTION_CATALOG_RELEASE as catalog,QUESTION_NEW_N3_PRE_RELEASE as before,SYNTHETIC_CLINICAL_RELEASE as live} from "./synthetic-content";
import {QUESTION_NEW_N3_CASES as cases,QUESTION_NEW_N3_ITEMS as items,QUESTION_NEW_N3_QUESTIONS as questions,
 QUESTION_NEW_N3_AUTHORING_CONCEPTS as concepts,QUESTION_NEW_N3_TESTED_CONCEPTS as tested,QUESTION_NEW_N3_CLAIMS as claims,
 QUESTION_NEW_N3_SOURCES as sources,QUESTION_NEW_N3_CLAIM_PROVENANCE as provenance,QUESTION_NEW_N3_SELF_CHECKS as checks,
 QUESTION_NEW_N3_TIMING_ENTRIES as timing,withAcceptedQuestionNewN3Concepts} from "./question-new-n3-20261105";
import {ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_NEW_N3_PRE_TIMING_ENTRIES} from "./answer-choice-timing";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {validateSyntheticClinicalRelease} from "./schema";

describe("N3 draft catalog and projection boundary",()=>{
 it("adds forty separate proposed objectives without changing any prior case or concept",()=>{
  expect(cases).toHaveLength(40);expect(new Set(tested.map(c=>c.id)).size).toBe(40);
  expect(cases.filter(c=>c.earliestFacilityStage===3)).toHaveLength(16);
  expect(cases.filter(c=>c.earliestFacilityStage===4)).toHaveLength(24);
  expect(catalog.cases).toEqual([...before.cases,...cases]);expect(catalog.concepts).toEqual([...before.concepts,...tested]);
  expect(()=>validateSyntheticClinicalRelease({...catalog,concepts:tested,cases})).not.toThrow();
  for(const c of concepts)for(const id of c.nearestExistingConceptIds)expect(before.concepts.some(old=>old.id===id),id).toBe(true);
 });
 it("keeps every N3 draft and its new history identity outside the default release",()=>{
  expect(manifest.accepted.some(r=>r.acceptanceId.startsWith("review.n3."))).toBe(false);
  expect(live.cases.some(c=>c.id.startsWith("case.n3."))).toBe(false);
  expect(live.concepts.some(c=>c.id.startsWith("concept.n3."))).toBe(false);
  const projected=withAcceptedQuestionNewN3Concepts(catalog,before.concepts);
  expect(projected.concepts).toEqual(before.concepts);expect(projected.cases).toBe(catalog.cases);
 });
 it("includes a new meaning only for its exact accepted tuple when building a future projection",()=>{
  const cs=cases[0]!,n=cs.decisionNodes[0]!;
  const row={acceptanceId:"test.only",caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,conceptId:n.primaryConceptId,sourceView:"catalog",decision:"test fixture, not acceptance"};
  expect(withAcceptedQuestionNewN3Concepts(catalog,before.concepts,{...manifest,accepted:[row]}).concepts).toEqual([...before.concepts,tested[0]]);
  expect(withAcceptedQuestionNewN3Concepts(catalog,before.concepts,{...manifest,accepted:[{...row,questionVariantId:n.questionVariantId+".unknown"}]}).concepts).toEqual(before.concepts);
 });
 it.each(items.map((i,index)=>[i.slug,index] as const))("binds %s to evidence, a full self-check and finite presentation",(_slug,index)=>{
  const i=items[index]!,cs=cases[index]!,q=questions[index]!,n=cs.decisionNodes[0]!,check=checks[index]!;
  expect(catalog.cases.find(c=>c.id===cs.id)).toEqual(cs);
  expect(q).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null});
  expect(n.shuffleAnswers).toBe(true);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);expect([3,4]).toContain(n.answerChoices.length);
  expect(n.answerChoices.every(c=>c.serviceRequest===null)).toBe(true);expect(n.resultGateAfter).toBeNull();
  expect(cs.requiredCapabilityIds).toEqual([]);expect(cs.requiredClinicalSetting).toBe("clinic");
  expect(cs.prototypeDemographics).toEqual({ageYears:i.age,sexLabel:i.sex});expect(cs.presentation).toContain(`${i.age}-year-old`);
  expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);expect(cs.approvedInstantiationProfiles).toHaveLength(1);
  expect(check.twoStep.interpretFindings).not.toBe(check.twoStep.consequentialDecision);
  expect(check.options).toHaveLength(n.answerChoices.length);expect(check.options.every(c=>c.correctUnder.length>30)).toBe(true);
  expect(check.singleDefensibleBestAnswer.heldKeyClaims).toEqual([]);expect(check.independent).toBe(false);
  for(const id of q.supportingEvidenceClaimIds){const claim=claims.find(c=>c.id===id)!;expect(claim).toBeDefined();
   for(const sourceId of claim.sourceIds)expect(sources.find(s=>s.id===sourceId)?.evidenceClaimIds).toContain(id);
  }
  const t=timing[index]!;expect(ANSWER_CHOICE_TIMING_REGISTRY).toContainEqual(t);
  if(t.classification.kind==="test_choices")for(const choice of t.classification.choices){
   expect(n.answerChoices.find(c=>c.id===choice.choiceId)?.label).toBe(choice.choiceLabel);
   const selectedTiming=choice.timing;
   if(selectedTiming.kind==="test")expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.some(p=>p.id===selectedTiming.timingProfileId)).toBe(true);
  }
 });
 it("preserves all historical exact timing identities and inherited source/check dates",()=>{
  const expected=[...QUESTION_NEW_N3_PRE_TIMING_ENTRIES,...timing];
  const exactKey=(row:typeof expected[number])=>JSON.stringify([row.caseId,row.nodeId,row.questionVariantId]);
  const keys=new Set(expected.map(exactKey));
  // Later lanes can append new identities; every row in this retained stage
  // must remain present, ordered, unique and byte-equivalent in the archive.
  expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(row=>keys.has(exactKey(row)))).toEqual(expected);
  for(const p of provenance){const claim=claims.find(c=>c.id===p.claimId)!;expect(claim.lastCheckedOn).toBe(p.inheritedLastCheckedOn);expect(p.statementUnchanged).toBe(true);expect(claim.reviewStatus).toBe("needs_clinician_review");}
  for(const source of sources){expect(source.completeCitation).toBeTruthy();expect(source.officialUrl||source.doi).toBeTruthy();expect(source.authorityAssessment).toBeTruthy();expect(source.licenseLabel).toBeTruthy();expect(source.usageRole).toBeTruthy();}
 });
});
