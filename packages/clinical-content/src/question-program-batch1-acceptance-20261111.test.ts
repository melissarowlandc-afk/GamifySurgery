import {beforeProgramBatch2AcceptanceRelease,beforeProgramBatch2AcceptanceManifest,beforeProgramBatch2AcceptanceTimings} from "./question-program-batch2-acceptance-test-support";
import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTiming} from "./answer-choice-timing";
import {QUESTION_PROGRAM_BATCH1_ACCEPTED_CASES as cases,QUESTION_PROGRAM_BATCH1_ACCEPTED_ROWS as rows,
 QUESTION_PROGRAM_BATCH1_ACCEPTED_QUESTIONS as questions,QUESTION_PROGRAM_BATCH1_ACCEPTED_SOURCE_VIEWS as views,
 QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES as estimates,QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS as orders,
 QUESTION_PROGRAM_BATCH1_RETAINED_CASES as retired,QUESTION_PROGRAM_BATCH1_REPLACEMENTS as relations,
 QUESTION_PROGRAM_BATCH1_FROZEN_PRESERVATION as frozen,QUESTION_PROGRAM_BATCH1_CLAIMS as claims} from "./question-program-batch1-accepted-20261111";
import {beforeProgramBatch1AcceptanceRelease as previous,beforeProgramBatch1AcceptanceManifest as oldManifest,
 beforeProgramBatch1AcceptanceTimings as oldTimings,beforeProgramBatch1AcceptanceSource as oldSource} from "./question-program-batch1-acceptance-test-support";
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json");
const decision=read("docs/research/question-topic-acceptance-batch1-dispositions-20261111.json");
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const live=beforeProgramBatch2AcceptanceRelease(actualLive),manifest=beforeProgramBatch2AcceptanceManifest(actualManifest),timing=beforeProgramBatch2AcceptanceTimings(actualTiming);
describe("topic acceptance batch1 exact complete clinic cases",()=>{
 it("accepts only the22 complete-case nodes and records every requested/skipped disposition",()=>{
  expect(decision.requested).toBe(41);expect(decision.accepted).toBe(22);expect(decision.skipped).toBe(19);
  expect(rows).toHaveLength(22);expect(cases).toHaveLength(18);
  expect(rows.map(r=>r.questionVariantId).sort()).toEqual(decision.items.filter((r:{status:string})=>r.status==="accepted").map((r:{questionVariantId:string})=>r.questionVariantId).sort());
  for(const cs of cases)for(const n of cs.decisionNodes)expect(rows.filter(r=>r.caseId===cs.id&&r.nodeId===n.id&&r.questionVariantId===n.questionVariantId)).toHaveLength(1);
  for(const r of decision.items.filter((r:{status:string})=>r.status==="skipped"))expect(rows.some(a=>a.questionVariantId===r.questionVariantId)).toBe(false);
 });
 it("pins exact authority, two one-to-one replacements and the new default",()=>{
  expect(oldManifest(manifest)).toEqual(before.manifest);expect(manifest.id).toBe("question-ship.2026-11-11.v10");expect(manifest.clinicalApproval).toBe(false);
  expect(manifest.accepted).toHaveLength(167);expect(manifest.replacements).toHaveLength(6);expect(manifest.legacyBindings).toHaveLength(1423);
  expect(digest(manifest)).toBe("d736d9c5d6901917f947a94e309723d073bb74b68f57e40c5a469c73d6b015a6");
  expect(live.cases).toHaveLength(1167);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1482);expect(live.concepts).toHaveLength(631);
  expect(digest(live)).toBe("7cc62b6e5d9c79133a163bfee8bf810d01a430aa28760d1265b02807b799dee8");
  expect(digest(catalog)).toBe(before.catalogSha256);expect(digest(previous(live))).toBe(before.default.sha256);
 });
 it("keeps610 old identities and all untouched cases exact, restoring the retired two only for historical assertions",()=>{
  const prior=previous(live);expect(prior.cases).toHaveLength(1151);expect(prior.concepts).toHaveLength(610);
  expect(retired).toHaveLength(2);expect(relations).toHaveLength(2);
  for(const cs of retired){expect(live.cases.some(c=>c.id===cs.id)).toBe(false);expect(prior.cases.find(c=>c.id===cs.id)).toEqual(cs);
   expect(live.concepts.some(c=>c.id===cs.decisionNodes[0]!.primaryConceptId)).toBe(true);}
 });
 it("retains exact reviewed clinical fields/IDs and separates the technical learning-summary projection",()=>{
  for(const cs of cases){const captured=before.topics.flatMap((t:{candidates:Array<{case:{id:string}}>})=>t.candidates).find((r:{case:{id:string}})=>r.case.id===cs.id);
   const expected=structuredClone(captured.case);expected.learningSummary=cs.decisionNodes.map(n=>n.explanation).join(" ");
   if(cs.id.includes("critical-respiratory-ventilation")){
    expected.presentation=expected.presentation.replaceAll(cs.patientDisplayName,"{patientName}");
    for(const p of expected.approvedInstantiationProfiles)p.presentation=p.presentation.replaceAll(cs.patientDisplayName,"{patientName}");
    for(const n of expected.decisionNodes){n.stem=n.stem.replaceAll(cs.patientDisplayName,"{patientName}");
     if(cs.id.endsWith("extubation-rescue.v1"))n.currentUpdate=n.currentUpdate.replaceAll("Elena","{patientName}");}
   }
   expect(cs).toEqual(expected);
   expect(digest(cs)).toBe(frozen.find(r=>r.caseId===cs.id)!.retainedCaseSha256);
   expect(cs.requiredClinicalSetting).toBe("clinic");expect(cs.routineEligible).toBe(true);
   for(const n of cs.decisionNodes){const q=questions.find(q=>q.id===n.questionVariantId)!,old=captured.nodeRecords.find((r:{question:{id:string}})=>r.question.id===q.id);
    expect(q).toEqual(old.question);expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
    expect(n).toEqual(expected.decisionNodes.find((v:{id:string})=>v.id===n.id));expect(old.evidence.item.verdict).toBe("PASS");expect(n.shuffleAnswers).toBe(true);
    expect(n.resultGateAfter).toBeNull();expect(n.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
    for(const id of q.supportingEvidenceClaimIds)expect(claims.some(c=>c.id===id)).toBe(true);
   }
  }
 });
 it("freezes accepted-only source archives without importing mutable topic-worker exports",()=>{
  expect(Object.keys(views)).toHaveLength(6);
  for(const row of decision.sourceViews)expect(digest(views[row.name]!)).toBe(row.sha256);
  const file=readFileSync(new URL("./question-program-batch1-accepted-20261111.ts",import.meta.url),"utf8");
  expect(file).not.toMatch(/from\s+["']\.\/question-topic-/);
 });
 it("keeps all old timing rows and exports15 accepted diagnostic tuples for deferred runtime installation",()=>{
  expect(oldTimings(timing)).toEqual(before.timing);expect(timing).toHaveLength(2317);expect(estimates).toHaveLength(22);expect(orders).toHaveLength(15);
  for(const r of orders){expect(r.disposition).toEqual({kind:"not_executed",reason:"future_planned"});
   const cs=cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;expect(n.questionVariantId).toBe(r.questionVariantId);
   expect(n.answerChoices.find(c=>c.id===r.choiceId)!.label).toBe(r.choiceLabel);}
 });
 it("rejects unrelated source/authority/timing drift before epoch reconstruction",()=>{
  const changed=structuredClone(live);changed.cases.find(c=>!cases.some(a=>a.id===c.id))!.presentation+=" drift";expect(()=>previous(changed)).toThrow();
  const bad=structuredClone(manifest);bad.accepted[0]!.conceptId+=".drift";expect(()=>oldManifest(bad)).toThrow();
  const altered=structuredClone(timing);altered[0]!.nodeId+=".drift";expect(()=>oldTimings(altered)).toThrow();
 });
 it("pins nine owned clinical deltas without changing worker files or prior captures",()=>{
  const migration=read("tools/question-quality/fixtures/question-topic-acceptance-batch1-source-migration-20261111.json");expect(migration.files).toHaveLength(9);
  const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch1-release-source-pins-20261111.json",import.meta.url));
  expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("e1aaf452713f2a938226ea1201a0268232c6c7e09a800f854a2058eaacb2bafd");
  const releasePins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;testSupportSha256:string;paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string}>};
  expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-topic-acceptance-batch1-source-migration-20261111.json",import.meta.url))).digest("hex")).toBe(releasePins.capturedFixtureSha256);
  expect(createHash("sha256").update(readFileSync(new URL("./question-program-batch1-acceptance-test-support.ts",import.meta.url))).digest("hex")).toBe(releasePins.testSupportSha256);
  expect(releasePins.paths).toHaveLength(2);
  for(const pin of releasePins.paths){const row=migration.files.find((row:{path:string})=>row.path===pin.path);expect(row).toBeDefined();
   expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
   expect(createHash("sha256").update(readFileSync(new URL("../../../"+pin.path,import.meta.url))).digest("hex")).toBe(pin.requiredReleaseSha256);}

  for(const row of migration.files){expect(row.path).not.toMatch(/\/question-topic-/);expect(row.path).toMatch(/^packages\/clinical-content\//);
   expect(createHash("sha256").update(oldSource(row.path,readFileSync(new URL("../../../"+row.path,import.meta.url),"utf8"))).digest("hex")).toBe(row.beforeSha256);}
 });
});
