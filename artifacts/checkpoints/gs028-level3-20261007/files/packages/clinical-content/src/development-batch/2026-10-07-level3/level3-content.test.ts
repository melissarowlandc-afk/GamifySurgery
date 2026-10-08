/// <reference types="node" />
import {createHash} from "node:crypto";
import {writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {describe,expect,it} from "vitest";
import {syntheticClinicalCaseSchema,testedConceptSchema,answerChoiceTimingRegistryEntrySchema} from "../../schema";
import {SYNTHETIC_CLINICAL_RELEASE as release} from "../../synthetic-content";
import {ANSWER_CHOICE_TIMING_REGISTRY} from "../../answer-choice-timing";
import {
 GS028_20261007_LEVEL3_CASES as cases,GS028_20261007_LEVEL3_TESTED_CONCEPTS as concepts,
 GS028_20261007_LEVEL3_AUTHORING_CONCEPTS as authored,GS028_20261007_LEVEL3_QUESTIONS as questions,
 GS028_20261007_LEVEL3_CLAIMS as claims,GS028_20261007_LEVEL3_SOURCES as sources,
 GS028_20261007_LEVEL3_CASE_REVIEWS as reviews,GS028_20261007_LEVEL3_TIMING_ENTRIES as timings,
 GS028_20261007_LEVEL3_BATCH_MANIFEST as manifest,
} from "./level3-batch";
const ids=new Set(concepts.map(c=>c.id));const caseIds=new Set(cases.map(c=>c.id));
const sha=(v:unknown)=>createHash("sha256").update(JSON.stringify(v,null,2)+"\n").digest("hex");
describe("GS028 twenty level3-plus concepts",()=>{
 it("admits 20 objectives/80 variants with 18 purposeful two-node visits and independent siblings",()=>{
  expect(manifest).toMatchObject({testedConceptCount:20,authoringConceptCount:20,questionVariantCount:80,decisionNodeCount:80,caseCount:62,runtimeCaseProfileCount:248,questionProfileReferenceCount:320,resultGateCount:0,publicReleaseAuthorized:false});
  expect(cases.filter(c=>c.decisionNodes.length===2)).toHaveLength(18);
  for(const c of authored){
   const qs=questions.filter(q=>q.conceptId===c.id);expect(qs).toHaveLength(4);expect(new Set(qs.map(q=>q.stem)).size,c.id).toBe(4);
   expect(cases.filter(x=>x.decisionNodes.length===1&&x.decisionNodes[0]!.primaryConceptId===c.id).length,c.id).toBeGreaterThanOrEqual(2);
  }
 });
 it("accepts level3 and rejects unsupported future level4 in actual encounter schema",()=>{
  for(const c of cases){expect(c.earliestFacilityStage).toBe(3);expect(syntheticClinicalCaseSchema.parse(c)).toEqual(c);expect(syntheticClinicalCaseSchema.safeParse({...c,earliestFacilityStage:4}).success).toBe(false);}
  for(const c of concepts){expect(c.earliestFacilityStage).toBe(3);expect(testedConceptSchema.parse(c)).toEqual(c);}
 });
 it("retains draft clinical status and separates it from editorial acceptance",()=>{
  for(const item of [...authored,...questions,...claims,...sources,...reviews])expect(item).toMatchObject({reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null,contentVersion:manifest.contentVersion});
  for(const r of reviews)expect(r).toMatchObject({earliestFacilityStage:3,educationalTier:1,requiredClinicalSetting:"clinic",requiredCapabilityIds:[],agentReview:{clinicianSignOff:false}});
  expect(release.publicationStatus).toBe("synthetic_unapproved_prototype");
 });
 it("preserves the 303/900/1183 intake records outside the concurrent statistics-ethics overhaul",()=>{
  const old={...release,concepts:release.concepts.filter(c=>!ids.has(c.id)),cases:release.cases.filter(c=>!caseIds.has(c.id))};
  // The independent native-import intake remains immutable at 331/1012/1295
  // (SHA 20ec10aa...). Another authoring lane is concurrently rewriting the
  // preexisting 28-objective statistics/ethics packet, including four new pairs.
  // Exclude exactly that documented lane, never arbitrary differing records.
  const protectedIntake={...old,concepts:old.concepts.filter(c=>!c.id.startsWith("concept.statistics-ethics.")&&c.id!=="concept.quality-improvement.pdsa-act-and-iterate"),cases:old.cases.filter(c=>!c.id.startsWith("case.gs028se."))};
  expect([protectedIntake.concepts.length,protectedIntake.cases.length,protectedIntake.cases.flatMap(c=>c.decisionNodes).length]).toEqual([303,900,1183]);
  expect(sha(protectedIntake)).toBe("a5108ca54c38353b8f226075880da9b7ba97fe78b625eef2a87ade5033f8482a");
  expect([release.concepts.length,release.cases.length,release.cases.flatMap(c=>c.decisionNodes).length]).toEqual([351,1070,1375]);
 });
 it("has unique IDs, reciprocal atomic claims/sources and explicit evidence limitations",()=>{
  for(const records of [concepts,cases,questions,claims,sources])expect(new Set(records.map(x=>x.id)).size).toBe(records.length);
  for(const c of claims){expect(c.lastCheckedOn).toBe("2026-10-07");expect(c.limitation).toBeTruthy();expect(c.sourceIds.length).toBeGreaterThan(0);for(const id of c.sourceIds)expect(sources.find(s=>s.id===id)?.evidenceClaimIds).toContain(c.id);}
  for(const s of sources){expect(s.accessedOn).toBe("2026-10-07");expect(s.completeCitation).toBeTruthy();expect(s.authors.length).toBeGreaterThan(0);expect(s.officialUrl).toMatch(/^https:\/\//);expect(s.licenseLabel).toBeTruthy();expect(s.authorityAssessment).toBeTruthy();for(const id of s.evidenceClaimIds)expect(claims.find(c=>c.id===id)?.sourceIds).toContain(s.id);}
  for(const q of questions)for(const id of q.supportingEvidenceClaimIds)expect(claims.some(c=>c.id===id),q.id).toBe(true);
 });
 it.each(cases.map(c=>[c.id,c] as const))("reviews full instantiated authoring card %s",(_id,c)=>{
  expect(c.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
  expect(c.presentation).toContain("{patientName}");expect(c.presentation).not.toMatch(/^A patient/i);
  for(const n of c.decisionNodes){
   expect(n.answerChoices).toHaveLength(4);const keys=n.answerChoices.filter(a=>a.isCorrect);expect(keys).toHaveLength(1);expect(n.shuffleAnswers).toBe(true);
   expect(keys[0]!.label.length,n.questionVariantId).toBeLessThanOrEqual(Math.max(...n.answerChoices.filter(a=>!a.isCorrect).map(a=>a.label.length)));
   expect(n.explanation).toContain(`The correct answer is “${keys[0]!.label}.”`);
   expect(n.stem.trim().endsWith("?")).toBe(true);
   expect(n.resultGateAfter).toBeNull();
   const q=questions.find(q=>q.id===n.questionVariantId)!;expect(q.approvedInstantiationProfiles).toEqual(c.approvedInstantiationProfiles);expect(q.reachedCurrentUpdate).toBe(n.currentUpdate);
  }
  for(const p of c.approvedInstantiationProfiles){expect(p.prototypeDemographics?.ageYears).toBeGreaterThanOrEqual(18);expect(p.presentation).not.toMatch(/\{patient(Age|Sex)\}/);}
  if(c.decisionNodes.length===2){expect(c.decisionNodes[1]!.currentUpdate).toBeTruthy();expect(c.presentation).not.toContain(c.decisionNodes[1]!.currentUpdate!);}
 });
 it("registers each timing entry exactly once, with four specialist staging previews",()=>{
  let tests=0;
  for(const e of timings){expect(answerChoiceTimingRegistryEntrySchema.parse(e)).toEqual(e);expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(x=>x.caseId===e.caseId&&x.nodeId===e.nodeId&&x.questionVariantId===e.questionVariantId)).toEqual([e]);
   if(e.classification.kind==="test_choices")for(const ch of e.classification.choices)if(ch.timing.kind==="test")tests++;
  }expect(tests).toBe(4);
 });
 it("exports an ignored original review packet and validated public-safe count evidence",()=>{
  const out=resolve(process.cwd(),"../../.local-dev/gs028-20261007-level3/validation");mkdirSync(out,{recursive:true});
  writeFileSync(resolve(out,"authoring-review.json"),JSON.stringify({notice:"Original fictional authored cards. Key shown first for editorial review; runtime shuffles. All content needs clinician review.",manifest,cases,questions,claims,sources},null,2)+"\n");
  writeFileSync(resolve(out,"admission.json"),JSON.stringify({manifest,intakeSha256:"20ec10aa3cc60d3afff7b68b701bd93f8643ceb3481453088197550e339c9fd8",postReleaseSha256:sha(release)},null,2)+"\n");
  writeFileSync(resolve(out,"actual-release.json"),JSON.stringify(release,null,2)+"\n");
 });
});
