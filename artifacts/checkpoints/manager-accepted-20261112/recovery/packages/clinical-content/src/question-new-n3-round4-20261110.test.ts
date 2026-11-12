import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {PROTOTYPE_BALANCE_RELEASE} from "@gamify-surgery/balance-config";
import {syntheticClinicalReleaseSchema} from "./schema";
import {SYNTHETIC_CLINICAL_RELEASE as live,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as globalTimings} from "./answer-choice-timing";
import {QUESTION_NEW_N3_ROUND3_CASES as priorThird} from "./question-new-n3-round3-20261105";
import {QUESTION_NEW_N3_ROUND2_CASES as priorSecond} from "./question-new-n3-round2-20261105";
import {
 QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE as source,QUESTION_NEW_N3_ROUND4_DEFINITIONS as definitions,
 QUESTION_NEW_N3_ROUND4_CASES as cases,QUESTION_NEW_N3_ROUND4_QUESTIONS as questions,
 QUESTION_NEW_N3_ROUND4_RETAINED_CASES as retained,QUESTION_NEW_N3_ROUND4_AUTHORING_CONCEPTS as concepts,
 QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES as timings,QUESTION_NEW_N3_ROUND4_CANDIDATE_TEST_ORDER_RECORDS as orders,
 QUESTION_NEW_N3_ROUND4_CLAIMS as claims,QUESTION_NEW_N3_ROUND4_BASIS_CLAIMS as basis,
 QUESTION_NEW_N3_ROUND4_CLAIM_PROVENANCE as provenance,QUESTION_NEW_N3_ROUND4_SOURCES as sources,
 QUESTION_NEW_N3_ROUND4_SOURCE_LINKS as links,QUESTION_NEW_N3_ROUND4_SELF_CHECKS as checks,
} from "./question-new-n3-round4-20261110";
const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const packet=read("docs/research/question-new-n3-round4-20261110.json") as {
 dispositionCounts:Record<string,number>;parked32Counts:Record<string,number>;
 triage:{rows:Array<{slug:string;caseId:string;inputGroup:string;decision:string;previousReviewId:string}>};
 ownerApprovalsNeeded:Array<{slug:string;question:string;candidateEmitted:boolean}>;
 frozenPreservation:Array<{id:string;authoredCaseSha256:string;variantSha256:string;liveExact:boolean}>;
 variants:Array<{id:string;questionVariantId:string;exactVersionSha256:string;after:{Options:string[]};selfCheck:unknown}>;
 lintTotals:{findings:number;profileContexts:number;uniqueVariants:number};
};
const hash=(x:unknown)=>createHash("sha256").update(JSON.stringify(x)).digest("hex");

describe("N3 round four explicit candidates and complete backlog triage",()=>{
 it("accounts for every returned item without generating a held or dropped key",()=>{
  expect(syntheticClinicalReleaseSchema.safeParse(source).success).toBe(true);expect(cases).toHaveLength(5);expect(source.cases).toEqual(cases);
  expect(source.concepts).toHaveLength(5);expect(packet.dispositionCounts).toEqual({REVISE_NOW:5,OWNER_DECISION:13,DROP_PROPOSAL:17});
  expect(packet.parked32Counts).toEqual({REVISE_NOW:4,OWNER_DECISION:11,DROP_PROPOSAL:17});
  expect(packet.triage.rows).toHaveLength(35);expect(new Set(packet.triage.rows.map(r=>r.slug)).size).toBe(35);
  expect(packet.triage.rows.filter(r=>r.inputGroup==="round3_return")).toHaveLength(3);
  for(const row of packet.triage.rows){expect(catalog.cases.some(c=>c.id===row.caseId)).toBe(true);
   expect(cases.some(c=>c.id===row.caseId)).toBe(row.decision==="REVISE_NOW");}
  for(const hold of packet.ownerApprovalsNeeded){expect(hold.candidateEmitted).toBe(false);expect(hold.question.match(/\?/g)).toHaveLength(1);
   expect((hold.question.match(/[.!?](?:\s|$)/g)??[]).length).toBeLessThanOrEqual(2);}
 });
 it("retains all five exact accepted PASS definitions and historical input references",()=>{
  const previousPacket=read("docs/research/question-new-n3-round3-20261105.json") as {variants:Array<{id:string;authoredTemplate:unknown}>};
  expect(packet.frozenPreservation).toHaveLength(5);
  for(const frozen of packet.frozenPreservation){const old=previousPacket.variants.find(v=>v.id===frozen.id)!;
   expect(hash(old)).toBe(frozen.variantSha256);expect(hash(old.authoredTemplate)).toBe(frozen.authoredCaseSha256);
   const acceptance=manifest.accepted.find(a=>a.acceptanceId===frozen.id)!;expect(acceptance).toBeDefined();
   expect(live.cases.find(c=>c.id===acceptance.caseId)).toEqual(old.authoredTemplate);}
  for(const [index,r] of definitions.entries())expect(retained[index]).toBe((r.previousReviewId.endsWith(".v3")?priorThird:priorSecond).find(c=>c.id===cases[index]!.id));
 });
 it("exports candidates without adding them to live/catalog/timing registries",()=>{
  for(const cs of cases){const id=cs.decisionNodes[0]!.questionVariantId,accepted=manifest.accepted.some(a=>a.questionVariantId===id);
   expect(catalog.cases.some(c=>c.decisionNodes.some(n=>n.questionVariantId===id))).toBe(false);
   expect(live.cases.some(c=>c.decisionNodes.some(n=>n.questionVariantId===id))).toBe(accepted);
   // The manager installs accepted exact estimates; authoring leaves globals alone.
   expect(globalTimings.some(t=>t.questionVariantId===id)).toBe(accepted);
  }
  expect(concepts.filter(c=>c.conceptMeaning==="existing_concept")).toHaveLength(2);
  expect(definitions.every(r=>r.conceptMeaning==="same"||r.conceptMeaning==="existing_concept")).toBe(true);
 });
 it("keeps atomic facts and their check dates exact while binding complete source metadata",()=>{
  expect(claims).toHaveLength(11);expect(sources).toHaveLength(14);
  for(const p of provenance){const c=claims.find(c=>c.id===p.claimId)!,old=basis.find(c=>c.id===p.inheritedClaimId)!;
   expect(c.statement).toBe(old.statement);expect(c.limitation).toBe(old.limitation);expect(c.lastCheckedOn).toBe(old.lastCheckedOn);
   expect(c.sourceIds).toEqual(old.sourceIds);expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();
   for(const id of c.sourceIds){const s=sources.find(s=>s.id===id)!;expect(s.evidenceClaimIds).toContain(c.id);
    for(const key of ["completeCitation","organizationOrJournal","accessedOn","sourceClass","licenseLabel","reuseStatus","authorityAssessment","usageRole"] as const)expect(s[key]).toBeTruthy();
    expect(s.doi||s.officialUrl).toBeTruthy();}
  }
  for(const link of links){expect(link.target).toBe("_blank");expect(link.rel).toBe("noopener noreferrer");expect(link.referrerPolicy).toBe("no-referrer");}
 });
 it("binds every testing alternative to an existing estimate without adding an executable service",()=>{
  expect(orders).toHaveLength(6);expect(timings.filter(t=>t.classification.kind==="test_choices")).toHaveLength(2);
  for(const t of timings){const node=cases.find(c=>c.id===t.caseId)!.decisionNodes[0]!;
   expect(node.resultGateAfter).toBeNull();expect(node.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
   if(t.classification.kind==="test_choices")for(const a of t.classification.choices){
    expect(node.answerChoices.find(c=>c.id===a.choiceId)?.label).toBe(a.choiceLabel);
    expect(a.timing.kind).toBe("test");if(a.timing.kind!=="test")throw Error("Every option here is a test");
    const profileId=a.timing.timingProfileId;
    expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.some(p=>p.id===profileId)).toBe(true);
    expect(orders.find(o=>o.choiceId===a.choiceId)?.disposition).toEqual({kind:"not_executed",reason:"external_only"});
   }
  }
 });
 it.each(cases.map((cs,index)=>[cs.id,index]as const))("keeps %s reviewable, complete and consistent across its finite profile",(_id,index)=>{
  const cs=cases[index]!,q=questions[index]!,r=definitions[index]!,p=packet.variants[index]!,profile=cs.approvedInstantiationProfiles![0]!;
  expect(cs.presentation).toContain("{patientName}");expect(cs.presentation).toContain(cs.prototypeDemographics!.ageYears+"-year-old");
  expect(profile.prototypeDemographics).toEqual(cs.prototypeDemographics);expect(profile.presentation).toBe(cs.presentation);expect(profile.chiefComplaint).toBe(cs.chiefComplaint);
  expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);expect(cs.requiredCapabilityIds).toEqual([]);expect([3,4]).toContain(cs.earliestFacilityStage);
  expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();expect(q.conceptId).toBe(cs.decisionNodes[0]!.primaryConceptId);
  expect(cs.decisionNodes[0]!.shuffleAnswers).toBe(true);expect(q.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);expect([3,4]).toContain(q.answerChoices.length);
  expect(q.answerChoices.every(a=>a.rationale)).toBe(true);expect(p.after.Options.filter(a=>a.startsWith("**KEY:** "))).toHaveLength(1);
  expect(p.exactVersionSha256).toBe(hash(cs));expect(p.selfCheck).toEqual(checks[index]);
  expect(checks[index]!.dataAblation.alternativeChoiceId).toBe(q.answerChoices.find(a=>a.id.endsWith("."+r.reasoning.counterfactualChoiceId))!.id);
  expect(checks[index]!.singleBestAnswer.heldKeyClaims).toEqual([]);expect(checks[index]!.authorVerdict).not.toBe("PASS");
 });
 it("records a clean full-visible-field lint without claiming independent PASS",()=>{
  expect(packet.lintTotals).toMatchObject({findings:0,profileContexts:10,uniqueVariants:5});
  expect(checks.every(c=>c.independent===false&&c.clinicalApproval===false)).toBe(true);
 });
});
