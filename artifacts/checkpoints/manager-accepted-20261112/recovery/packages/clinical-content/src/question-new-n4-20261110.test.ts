import {createHash} from "node:crypto";
import {describe,expect,it} from "vitest";
import {PROTOTYPE_BALANCE_RELEASE as balance} from "@gamify-surgery/balance-config";
import {SYNTHETIC_CLINICAL_RELEASE as live,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {ANSWER_CHOICE_TIMING_REGISTRY as globalTiming} from "./answer-choice-timing";
import {PEDIATRIC_CLINIC_FAMILY_CONTEXTS as globalFamilies} from "./index";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {syntheticClinicalReleaseSchema} from "./schema";
const sha=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const before={live:sha(live),catalog:sha(catalog),timing:sha(globalTiming),families:sha(globalFamilies),manifest:sha(manifest)};
const b=await import("./question-new-n4-20261110");

describe("N4 explicit current-procedure and specialty-clinic drafts",()=>{
 it("imports an isolated strict stage without mutating default content or registries",()=>{
  expect(syntheticClinicalReleaseSchema.safeParse(b.QUESTION_NEW_N4_SOURCE_RELEASE).success).toBe(true);
  expect(syntheticClinicalReleaseSchema.safeParse(b.QUESTION_NEW_N4_CATALOG_RELEASE).success).toBe(true);
  expect({live:sha(live),catalog:sha(catalog),timing:sha(globalTiming),families:sha(globalFamilies),manifest:sha(manifest)}).toEqual(before);
  for(const cs of b.QUESTION_NEW_N4_CASES){const qid=cs.decisionNodes[0]!.questionVariantId;
   const accepted=manifest.accepted.some(a=>a.questionVariantId===qid);
   expect(live.cases.some(c=>c.decisionNodes.some(n=>n.questionVariantId===qid))).toBe(accepted);
   // Authoring itself installs neither exact timing nor family metadata. A
   // manager can install accepted exact rows in a later independent milestone.
   expect(globalTiming.some(t=>t.questionVariantId===qid)).toBe(accepted);
  }
 });
 it("excludes manually failed drafts while retaining an explicit backlog catalog",()=>{
  const candidate=new Set(b.QUESTION_NEW_N4_CASES.map(c=>c.id));
  expect(b.QUESTION_NEW_N4_CATALOG_CASES.filter(c=>!candidate.has(c.id)).map(c=>c.id).sort()).toEqual(
   b.QUESTION_NEW_N4_SELF_CHECK_PARKS.map(p=>`case.n4.${p.slug}.v1`).sort());
  expect(b.QUESTION_NEW_N4_SELF_CHECK_PARKS.every(p=>p.authorVerdict==="PARK_FAILED_RESIDENT_RUBRIC")).toBe(true);
  expect(b.QUESTION_NEW_N4_CASES.length).toBeGreaterThan(20);
 });
 it("retains existing meanings exactly and gives a distinct identity to the new construct",()=>{
  for(const i of b.QUESTION_NEW_N4_ITEMS){const old=catalog.concepts.find(c=>c.id===i.conceptId);
   if(i.conceptRelation==="existing_meaning_variant")expect(b.QUESTION_NEW_N4_CONCEPTS.find(c=>c.id===i.conceptId)).toEqual(old);
   else expect(old).toBeUndefined();
  }
 });
 it("requires the room capabilities and avoids circular orders for current procedures",()=>{
  for(const [index,cs]of b.QUESTION_NEW_N4_CASES.entries()){
   const i=b.QUESTION_NEW_N4_ITEMS[index]!;
   expect(cs.routineEligible).toBe(true);expect(cs.tutorialEligible).toBe(false);
   if(i.group==="intra_op"){expect(cs.requiredClinicalSetting).toBe("ambulatory_surgery");expect(cs.requiredCapabilityIds).toContain("capability.ambulatory_or");}
   if(i.group==="intra_endoscopy"){expect(cs.requiredClinicalSetting).toBe("endoscopy");expect(cs.requiredCapabilityIds).toContain("capability.endoscopy");}
   if(i.group==="wound_ostomy"){expect(cs.requiredClinicalSetting).toBe("clinic");expect(cs.earliestFacilityStage).toBe(4);expect(cs.requiredCapabilityIds).toContain("capability.wound_ostomy_clinic");}
   expect(i.phase.length).toBeGreaterThan(10);
   for(const n of cs.decisionNodes){expect(n.resultGateAfter).toBeNull();expect(n.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);}
  }
 });
 it("supplies exact existing child/parent/art bindings and no enacted pediatric tests",()=>{
  for(const family of b.QUESTION_NEW_N4_FAMILY_BINDINGS){
   const old=globalFamilies.find(f=>f.caseId===family.basisCaseId&&f.profileId===family.basisProfileId)!;
   expect(old).toBeDefined();
   for(const key of ["childName","childStillId","parentName","parentRelationship","parentCount","parentPlacement","prototypeDemographics"] as const)expect(family[key]).toEqual(old[key]);
   const cs=b.QUESTION_NEW_N4_CASES.find(c=>c.id===family.caseId)!;
   expect(cs.pediatricProfile).toEqual({version:"pediatric-patient-profile.v1",requiresParent:true,clinicalScope:"outpatient"});
   expect(cs.approvedInstantiationProfiles).toHaveLength(1);expect(cs.approvedInstantiationProfiles![0]!.id).toBe(family.profileId);
   expect(cs.prototypeDemographics).toEqual(family.prototypeDemographics);expect(cs.patientDisplayName).toBe(family.childName);
   expect(cs.requiredCapabilityIds).toContain("capability.pediatric_examination");
   expect(b.QUESTION_NEW_N4_TIMING_ENTRIES.find(t=>t.caseId===cs.id)!.classification.kind).toBe("no_test");
  }
 });
 it("keeps source facts/dates exact and gives all new records unapproved status",()=>{
  for(const p of b.QUESTION_NEW_N4_CLAIM_PROVENANCE){const old=b.QUESTION_NEW_N4_BASIS_CLAIMS.find(c=>c.id===p.inheritedClaimId)!;
   const claim=b.QUESTION_NEW_N4_CLAIMS.find(c=>c.id===p.claimId)!;
   expect(claim.statement).toBe(old.statement);expect(claim.limitation).toBe(old.limitation);expect(claim.lastCheckedOn).toBe(old.lastCheckedOn);
   expect(claim.sourceIds).toEqual(old.sourceIds);expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.lastClinicianReview).toBeNull();
   for(const id of claim.sourceIds){const s=b.QUESTION_NEW_N4_SOURCES.find(s=>s.id===id)!;expect(s.evidenceClaimIds).toContain(claim.id);
    for(const field of ["completeCitation","organizationOrJournal","accessedOn","licenseLabel","reuseStatus","authorityAssessment","sourceClass","usageRole"] as const)expect(s[field]).toBeTruthy();
    expect(s.officialUrl||s.doi).toBeTruthy();}
  }
  for(const q of b.QUESTION_NEW_N4_QUESTIONS){expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();}
  for(const c of b.QUESTION_NEW_N4_AUTHORING_CONCEPTS)expect(c.reviewStatus).toBe("needs_clinician_review");
  for(const link of b.QUESTION_NEW_N4_SOURCE_LINKS)expect([link.target,link.rel,link.referrerPolicy]).toEqual(["_blank","noopener noreferrer","no-referrer"]);
 });
 it("binds every diagnostic estimate to an existing profile and exact choice tuple",()=>{
  for(const t of b.QUESTION_NEW_N4_TIMING_ENTRIES){const n=b.QUESTION_NEW_N4_CASES.find(c=>c.id===t.caseId)!.decisionNodes[0]!;
   if(t.classification.kind==="no_test")continue;
   expect(t.classification.choices).toHaveLength(n.answerChoices.length);
   for(const a of t.classification.choices){expect(n.answerChoices.find(c=>c.id===a.choiceId)!.label).toBe(a.choiceLabel);
    if(a.timing.kind!=="test")continue;const profileId=a.timing.timingProfileId;
    expect(balance.answerChoiceTimingProfiles.some(p=>p.id===profileId)).toBe(true);
    const order=b.QUESTION_NEW_N4_CANDIDATE_TEST_ORDER_RECORDS.find(o=>o.questionVariantId===t.questionVariantId&&o.choiceId===a.choiceId)!;
    expect(order).toMatchObject({caseId:t.caseId,nodeId:t.nodeId,choiceLabel:a.choiceLabel,timingProfileId:profileId,disposition:{kind:"not_executed"}});
   }
  }
 });
 it.each(b.QUESTION_NEW_N4_CASES.map((cs,index)=>[cs.id,index] as const))("keeps %s complete with parallel finite-profile facts and manual reasoning",(_id,index)=>{
  const cs=b.QUESTION_NEW_N4_CASES[index]!,q=b.QUESTION_NEW_N4_QUESTIONS[index]!,i=b.QUESTION_NEW_N4_ITEMS[index]!,check=b.QUESTION_NEW_N4_SELF_CHECKS[index]!;
  expect(cs.presentation).toContain("{patientName}");expect(cs.presentation).toContain(i.age+"-year-old");
  const visible=JSON.stringify({presentation:cs.presentation,stem:q.stem,exhibit:q.exhibit,options:q.answerChoices.map(a=>a.label)});
  expect(visible).not.toMatch(new RegExp("\\b"+i.name.split(" ")[0]+"\\b"));
  expect(cs.prototypeDemographics).toEqual({ageYears:i.age,sexLabel:i.sex});expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
  expect(cs.approvedInstantiationProfiles![0]!.presentation).toBe(cs.presentation);
  expect(cs.decisionNodes[0]!.shuffleAnswers).toBe(true);expect(q.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);expect([3,4]).toContain(q.answerChoices.length);
  expect(q.answerChoices.every(a=>a.rationale)).toBe(true);expect(check.reasoning.interpret).toBeTruthy();expect(check.reasoning.decision).toBeTruthy();
  expect(check.reasoning.decidingObservation).toBeTruthy();expect(check.ablation.counterfactual).toBeTruthy();
  expect(q.answerChoices.some(a=>a.id===check.ablation.counterfactualChoiceId)).toBe(true);
  expect(check.singleBest.keyClaimIds.every(id=>q.supportingEvidenceClaimIds.includes(id))).toBe(true);
  expect(check.singleBest.heldKeyClaims).toEqual([]);expect(check.independent).toBe(false);expect(check.clinicalApproval).toBe(false);
  expect(check.authorVerdict).not.toBe("PASS");
 });
});
