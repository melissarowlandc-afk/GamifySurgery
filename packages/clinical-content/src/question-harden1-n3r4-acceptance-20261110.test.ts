import {beforeN4AcceptanceRelease,beforeN4AcceptanceManifest,beforeN4AcceptanceTimings} from "./question-n4-acceptance-test-support";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTiming} from "./answer-choice-timing";
import {QUESTION_HARDEN1_N3R4_ACCEPTED_CASES as cases,QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS as rows,
 QUESTION_HARDEN1_N3R4_ACCEPTED_QUESTIONS as questions,QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES as estimates,
 QUESTION_HARDEN1_ACCEPTANCE_SOURCE as harden,QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE as n3} from "./question-harden1-n3r4-accepted-20261110";
import {QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE as authoredN3,QUESTION_NEW_N3_ROUND4_CASES as rawN3} from "./question-new-n3-round4-20261110";
import {beforeHarden1N3r4AcceptanceRelease as previous,beforeHarden1N3r4AcceptanceManifest as previousManifest,
 beforeHarden1N3r4AcceptanceTimings as previousTiming,beforeHarden1N3r4AcceptanceSource as previousSource} from "./question-harden1-n3r4-acceptance-test-support";
const live=beforeN4AcceptanceRelease(actualLive),manifest=beforeN4AcceptanceManifest(actualManifest),timing=beforeN4AcceptanceTimings(actualTiming);
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json");
const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
describe("exact harden1 H1-03 and two N3R4 PASS acceptances",()=>{
 it("appends only three rows/headers and one whole-case relation",()=>{
  expect(rows.map(r=>r.acceptanceId)).toEqual(before.acceptedIds);
  expect(previousManifest(manifest)).toEqual(before.manifest);
  expect(manifest.accepted).toHaveLength(137);expect(manifest.legacyBindings).toHaveLength(1423);expect(manifest.replacements).toHaveLength(4);
  expect(manifest.clinicalApproval).toBe(false);expect(manifest.id).toBe("question-ship.2026-11-10.v8");
  expect(hash(manifest)).toBe("164db3d76d2f380d8ef3035e981dc703f05e2e6cf820a483cdd4dc7660946eaa");
 });
 it("changes only the reviewed replacement and two new cases, with exact old histories/meanings retained",()=>{
  expect(previous(live).cases.find(c=>c.id===before.oldCase.id)).toEqual(before.oldCase);
  expect(live.cases.some(c=>c.id===before.oldCase.id)).toBe(false);
  for(const cs of cases)expect(live.cases.find(c=>c.id===cs.id)).toEqual(cs);
  expect(live.cases).toHaveLength(1143);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1454);expect(live.concepts).toHaveLength(608);
  expect(hash(live)).toBe("01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4");
  expect(hash(catalog)).toBe(before.catalogSha256);expect(hash(previous(live))).toBe(before.default.sha256);
  expect(live.concepts.some(c=>c.id===before.oldCase.decisionNodes[0].primaryConceptId)).toBe(true);
 });
 it("preserves the entire live hernia pair and excludes both harden1 hernia provenance rows",()=>{
  const hernia=live.cases.find(c=>c.id==="case.inguinal-hernia.caregiving-strain")!;
  expect(hash(hernia)).toBe(before.default.caseHashes[hernia.id]);
  expect(hernia.decisionNodes.map(n=>n.questionVariantId)).toEqual(["question.groin-hernia.ultrasound-type.v1","question.inguinal-hernia.symptomatic-elective-repair.v3.r12"]);
  expect(manifest.accepted.some(a=>a.acceptanceId==="H1-01"||a.acceptanceId==="H1-02")).toBe(false);
  expect(live.cases.some(c=>c.decisionNodes.some(n=>n.questionVariantId==="question.groin-hernia.ultrasound-type-and-intervention.v2"))).toBe(false);
 });
 it("binds the exact reviewed views and fields instead of promoting any other N3 version",()=>{
  expect(hash(harden)).toBe(before.harden1.sourceSha256);expect(hash(n3)).toBe(before.n3.sourceSha256);expect(n3).toEqual(authoredN3);
  expect(rawN3).toEqual(before.n3.cases);expect(questions).toHaveLength(3);
  for(const q of questions){expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
   expect(q).toEqual([...before.harden1.questions,...before.n3.questions].find(p=>p.id===q.id));}
  for(const cs of authoredN3.cases)expect(live.cases.some(c=>c.id===cs.id)).toBe(rows.some(r=>r.caseId===cs.id));
 });
 it("retains every old timing identity and adds three rows covering all six testing choices",()=>{
  expect(previousTiming(timing)).toEqual(before.timing);expect(timing).toHaveLength(2287);expect(estimates).toHaveLength(3);
  expect(estimates.filter(t=>t.classification.kind==="test_choices")).toHaveLength(2);
  expect(estimates.flatMap(t=>t.classification.kind==="test_choices"?t.classification.choices:[])).toHaveLength(6);
  for(const cs of cases)expect(cs.decisionNodes[0]!.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
 });
 it("rejects unrelated release and authority drift when reconstructing the historical epoch",()=>{
  const drift=structuredClone(live);drift.cases.find(c=>!cases.some(a=>a.id===c.id))!.presentation+=" changed";expect(()=>previous(drift)).toThrow();
  const bad=structuredClone(manifest);bad.accepted[0]!.questionVariantId+=".changed";expect(()=>previousManifest(bad)).toThrow();
  const altered=structuredClone(timing);altered[0]!.nodeId+=".changed";expect(()=>previousTiming(altered)).toThrow();
 });
 it("pins each explicit authorized preimage without changing immutable captures",()=>{
  const migration=read("tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json");
  expect(migration.files).toHaveLength(18);
  const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json",import.meta.url));
  expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("a09af4ec9ba4dab03e53e492984175137f6cfdb89026b715e2b7d511c7b35826");
  const releasePins=JSON.parse(pinBytes.toString("utf8")) as {originalMigrationSha256:string;paths:Array<{path:string;requiredReleaseSha256:string}>};
  expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json",import.meta.url))).digest("hex")).toBe(releasePins.originalMigrationSha256);
  expect(releasePins.paths).toHaveLength(3);
  for(const pin of releasePins.paths)expect(createHash("sha256").update(readFileSync(new URL("../../../"+pin.path,import.meta.url))).digest("hex")).toBe(pin.requiredReleaseSha256);
  for(const row of migration.files){const text=readFileSync(new URL("../../../"+row.path,import.meta.url),"utf8");
   expect(createHash("sha256").update(previousSource(row.path,text)).digest("hex")).toBe(row.beforeSha256);}
 });
});
