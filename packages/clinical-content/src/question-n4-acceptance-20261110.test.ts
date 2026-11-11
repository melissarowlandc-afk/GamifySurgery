import {describe,expect,it} from "vitest";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {SYNTHETIC_CLINICAL_RELEASE as live,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as timing} from "./answer-choice-timing";
import {QUESTION_N4_ACCEPTED_ROWS as rows,QUESTION_N4_ACCEPTED_CASES as cases,QUESTION_N4_ACCEPTED_QUESTIONS as questions,
 QUESTION_N4_ACCEPTED_SOURCE_VIEWS as views,QUESTION_N4_FROZEN_PRESERVATION as bindings,QUESTION_N4_ACCEPTED_TIMING_ENTRIES as estimates,
 QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS as orders,QUESTION_N4_ACCEPTED_CASE_REVIEWS as reviews,
 QUESTION_NEW_N4_ROUND2_CATALOG_RELEASE as fullDraftCatalog} from "./question-n4-accepted-20261110";
import {beforeN4AcceptanceRelease as previous,beforeN4AcceptanceManifest as oldManifest,
 beforeN4AcceptanceTimings as oldTimings,beforeN4AcceptanceSource as oldSource} from "./question-n4-acceptance-test-support";
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-n4-acceptance-before-20261110.json");
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
describe("N4 exact eight independent PASS acceptances",()=>{
 it("appends exactly eight authority/header rows without replacing any existing case",()=>{
  expect(rows.map(r=>r.acceptanceId)).toEqual(before.accepted.map((r:{acceptanceId:string})=>r.acceptanceId));
  expect(oldManifest(manifest)).toEqual(before.manifest);
  expect(manifest.accepted).toHaveLength(145);expect(manifest.legacyBindings).toHaveLength(1423);expect(manifest.replacements).toHaveLength(4);
  expect(manifest.id).toBe("question-ship.2026-11-10.v9");expect(manifest.clinicalApproval).toBe(false);
  expect(digest(manifest)).toBe("08614aeff7c4b733c96b9aff7ac3b9774343e6bd2bfd46c520ae96c221056b42");
 });
 it("keeps all1143 prior cases and608 registered meanings exact while appending only eight/two",()=>{
  expect(digest(previous(live))).toBe(before.default.sha256);
  expect(live.cases).toHaveLength(1151);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1462);
  expect(live.concepts).toHaveLength(610);
  expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(454);
  expect(digest(live)).toBe("b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48");
  expect(digest(catalog)).toBe(before.catalogSha256);
 });
 it("withholds every nonaccepted N4 version, including seven returned round2 candidates and all parked executable drafts",()=>{
  expect(live.cases.filter(c=>c.id.startsWith("case.n4.")).map(c=>c.id)).toEqual(cases.map(c=>c.id));
  expect(fullDraftCatalog.cases).toHaveLength(35);
  for(const cs of fullDraftCatalog.cases){const accepted=rows.some(r=>r.questionVariantId===cs.decisionNodes[0]!.questionVariantId);
   expect(live.cases.some(c=>c.id===cs.id)).toBe(accepted);}
  const second=read("docs/research/question-new-n4-review2-20261110.json");
  expect(second.filter((r:{verdict:string})=>r.verdict==="REVISE")).toHaveLength(7);
  for(const returned of second.filter((r:{verdict:string})=>r.verdict==="REVISE"))
   expect(rows.some(r=>r.acceptanceId===returned.id)).toBe(false);
 });
 it("pins both complete source views and the exact clinical fields/versions reviewed",()=>{
  for(const [name,view]of Object.entries(views))expect(digest(view)).toBe(before.sourceViews[name].sha256);
  expect(bindings).toHaveLength(8);
  for(const [i,row]of rows.entries()){
   const old=before.accepted[i],question=questions[i]!,cs=cases[i]!;
   expect(question).toEqual(old.question);expect(cs).toEqual(old.case);
   expect(digest(old.case)).toBe(bindings[i]!.rawAuthoringCaseSha256);
   expect(digest(cs)).toBe(bindings[i]!.acceptedCaseSha256);expect(digest(question)).toBe(bindings[i]!.acceptedQuestionSha256);
   expect(question.reviewStatus).toBe("needs_clinician_review");expect(question.lastClinicianReview).toBeNull();
   expect(reviews[i]).toMatchObject({id:row.acceptanceId,reviewStatus:"needs_clinician_review",lastClinicianReview:null});
   expect(cs.decisionNodes[0]!.shuffleAnswers).toBe(true);expect(cs.decisionNodes).toHaveLength(1);
   expect(cs.decisionNodes[0]!.resultGateAfter).toBeNull();expect(cs.decisionNodes[0]!.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
   expect(live.cases.find(c=>c.id===cs.id)).toEqual(cs);
  }
 });
 it("retains every old estimate and appends exactly eight classifications /eight diagnostic-choice handoff rows",()=>{
  expect(oldTimings(timing)).toEqual(before.timing);expect(timing).toHaveLength(2295);expect(estimates).toHaveLength(8);
  expect(estimates.filter(t=>t.classification.kind==="test_choices")).toHaveLength(4);
  expect(orders).toHaveLength(8);
  for(const order of orders){const cs=cases.find(c=>c.id===order.caseId)!,choice=cs.decisionNodes[0]!.answerChoices.find(a=>a.id===order.choiceId)!;
   expect(choice.label).toBe(order.choiceLabel);expect(order.disposition).toEqual({kind:"not_executed",reason:"future_planned"});
  }
  expect(new Set(orders.map(o=>[o.caseId,o.nodeId,o.questionVariantId,o.choiceId].join("|"))).size).toBe(8);
 });
 it("creates no history migration and preserves the six reused concept definitions",()=>{
  const reused=before.accepted.filter((r:{concept:{id:string}})=>before.default.conceptIds.includes(r.concept.id));expect(reused).toHaveLength(6);
  for(const r of reused)expect(digest(live.concepts.find(c=>c.id===r.concept.id))).toBe(before.default.conceptHashes[r.concept.id]);
  const ids=live.concepts.filter(c=>!before.default.conceptIds.includes(c.id)).map(c=>c.id);
  expect(ids).toEqual(["concept.n4r2.mesh-material-and-contact-compartment","concept.n4r2.cholangiogram-quality-before-duct-treatment"]);
 });
 it("rejects unrelated content, authority and timing drift before historical reconstruction",()=>{
  const changed=structuredClone(live);changed.cases[0]!.presentation+=" changed";expect(()=>previous(changed)).toThrow();
  const bad=structuredClone(manifest);bad.accepted[0]!.conceptId+=".changed";expect(()=>oldManifest(bad)).toThrow();
  const altered=structuredClone(timing);altered[0]!.nodeId+=".changed";expect(()=>oldTimings(altered)).toThrow();
 });
 it("pins ten explicit clinical-only preimages/postimages without changing previous captures",()=>{
  const migration=read("tools/question-quality/fixtures/question-n4-acceptance-source-migration-20261110.json");expect(migration.files).toHaveLength(10);
  const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json",import.meta.url));
  expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("879402e37dbf395fa71cbde87eeea247723c017aa62ac3e0ff40c24141bc43d0");
  const releasePins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;testSupportSha256:string;paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string|null}>};
  expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-n4-acceptance-source-migration-20261110.json",import.meta.url))).digest("hex")).toBe(releasePins.capturedFixtureSha256);
  expect(createHash("sha256").update(readFileSync(new URL("./question-n4-acceptance-test-support.ts",import.meta.url))).digest("hex")).toBe(releasePins.testSupportSha256);
  expect(releasePins.paths).toHaveLength(3);
  for(const pin of releasePins.paths){const row=migration.files.find((r:{path:string})=>r.path===pin.path);expect(row).toBeDefined();
   expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
   const url=new URL("../../../"+pin.path,import.meta.url);
   if(pin.requiredReleaseSha256===null)expect(existsSync(url),pin.path+" excluded unaccepted source").toBe(false);
   else expect(createHash("sha256").update(readFileSync(url)).digest("hex")).toBe(pin.requiredReleaseSha256);
  }
  for(const row of migration.files){expect(row.path.startsWith("packages/clinical-content/src/")).toBe(true);
   const release=releasePins.paths.find(pin=>pin.path===row.path);
   if(release?.requiredReleaseSha256===null){
    expect(existsSync(new URL("../../../"+row.path,import.meta.url))).toBe(false);
    expect(createHash("sha256").update(row.beforeText).digest("hex")).toBe(row.beforeSha256);
    expect(row.beforeSha256).toBe(before.sourcePreimages.find((r:{path:string})=>r.path===row.path).beforeSha256);continue;
   }
   const current=readFileSync(new URL("../../../"+row.path,import.meta.url),"utf8");
   expect(createHash("sha256").update(oldSource(row.path,current)).digest("hex")).toBe(row.beforeSha256);}
 });
});
