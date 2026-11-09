import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as live,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as timing} from "./answer-choice-timing";
import {QUESTION_FLAGS4_SOURCE_RELEASE as reviewed,QUESTION_FLAGS4_QUESTIONS as reviewedQuestions,
 QUESTION_FLAGS4_RETAINED_INPUT as retained,QUESTION_FLAGS4_CLAIMS as claims} from "./question-flags4-20261108";
import {QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE as source,QUESTION_FLAGS4_ACCEPTED_REVISIONS as revisions,
 QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES as addedTiming,QUESTION_FLAGS4_ACCEPTED_CASE_REVIEWS as reviews,
 QUESTION_FLAGS4_ACCEPTED_STATEMENT_MAPPINGS as mappings} from "./question-flags4-accepted-20261108";
import {beforeFlags4AcceptanceRelease,beforeFlags4AcceptanceManifest,beforeFlags4AcceptanceTimings,beforeFlags4AcceptanceSource} from "./question-flags4-acceptance-test-support";

const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-flags4-acceptance-before-20261108.json");
const packet=read("docs/research/question-flags4-accepted-20261108.json")[0];
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const r=revisions[0]!,q=r.question,cs=source.cases[0]!,n=cs.decisionNodes[0]!;

describe("flags4 exact manager acceptance and preserved legacy identity",()=>{
 it("admits one bound source/header tuple without changing any earlier manifest row",()=>{
  expect(manifest.accepted.filter(a=>a.acceptanceId==="F4-01")).toEqual([{acceptanceId:r.auditId,caseId:r.caseId,nodeId:r.nodeId,
   questionVariantId:q.id,conceptId:q.conceptId,sourceView:"flags4-accepted",decision:"docs/research/question-flags4-manager-decision-20261108.md"}]);
  expect(manifest.headerSources[r.caseId]).toBe("flags4-accepted");expect(manifest.id).toBe("question-ship.2026-11-08.v7");
  expect(manifest.accepted).toHaveLength(134);expect(manifest.legacyBindings).toHaveLength(1423);expect(manifest.replacements).toHaveLength(3);
  expect(beforeFlags4AcceptanceManifest(manifest)).toEqual(before.manifest);
  expect(digest(manifest)).toBe("0e70c49460b6f93ec6766f6f59ad10eb9e4b0e38d8745283d9fa35818d68c06c");
 });
 it("changes precisely one default case, retaining every other case and meaning in order",()=>{
  expect(live.cases.find(c=>c.id===cs.id)).toEqual(cs);
  expect(beforeFlags4AcceptanceRelease(live).cases.find(c=>c.id===cs.id)).toEqual(retained.cases[0]);
  expect(live.cases).toHaveLength(1141);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1452);expect(live.concepts).toHaveLength(606);
  expect(digest(catalog)).toBe(before.catalogSha256);expect(digest(live)).toBe("db795ec578f8b5bfa77d1260b2e53c5a59f779f51edcba538fd8753bdb3de139");
  expect(live.concepts.map(c=>c.id)).toEqual(before.default.conceptIds);
  expect(n.primaryConceptId).toBe(retained.cases[0]!.decisionNodes[0]!.primaryConceptId);
  expect(live.cases.flatMap(c=>c.decisionNodes).some(n=>n.questionVariantId===retained.cases[0]!.decisionNodes[0]!.questionVariantId)).toBe(false);
 });
 it("deletes only the redundant update while preserving the reviewed task, options, feedback and header",()=>{
  expect(digest(reviewed)).toBe(before.reviewedSourceSha256);
  const {currentUpdate,...rest}=reviewed.cases[0]!.decisionNodes[0]!;
  expect(currentUpdate).toBe("Serum phosphate fell as carbohydrate feeding resumed.");
  expect(n).toEqual({...rest,questionVariantId:q.id});expect(n.currentUpdate).toBeUndefined();
  expect(cs).toEqual({...reviewed.cases[0],decisionNodes:[n]});
  expect(q).toEqual({...reviewedQuestions[0],id:q.id,contentVersion:"question-authoring.2026-11-08.flags4-r2"});
  expect(q.stem).toContain("carbohydrate reintroduction");expect(q.stem).toContain("{patientName}'s phosphate decline");
 });
 it("binds accepted and reviewed case/node/question/source hashes and a review-only key marker",()=>{
  expect(packet.frozenPreservation).toMatchObject({acceptedSourceSha256:digest(source),acceptedCaseSha256:digest(cs),acceptedNodeSha256:digest(n),acceptedQuestionSha256:digest(q),reviewedSourceSha256:digest(reviewed),
   exactReviewedTask:true,exactReviewedOptions:true,exactReviewedExplanation:true,onlyContextDeletion:true});
  expect(packet.after["Current update"]).toBeNull();expect(packet.keyOrderNotice).toContain("key shown first for review only");
  expect(packet.after.Options.filter((x:string)=>x.startsWith("**KEY:** "))).toHaveLength(1);
  expect(packet.after.Task).toBe(n.stem.replaceAll("{patientName}",cs.patientDisplayName));
  expect(n.shuffleAnswers).toBe(true);
 });
 it("retains exact legacy timing/choice identities and appends one accepted no-test binding",()=>{
  expect(beforeFlags4AcceptanceTimings(timing)).toEqual(before.timing);expect(timing).toHaveLength(2284);
  expect(addedTiming).toEqual([{caseId:cs.id,nodeId:n.id,questionVariantId:q.id,classification:{kind:"no_test"}}]);
  expect(manifest.legacyBindings).toContainEqual([cs.id,n.id,retained.cases[0]!.decisionNodes[0]!.questionVariantId,q.conceptId]);
  expect(n.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);expect(n.answerChoices).toHaveLength(3);
  expect(retained.cases[0]!.decisionNodes[0]!.answerChoices).toHaveLength(4);
 });
 it("records editorial acceptance with the unchanged source limitation, not independent or clinical PASS",()=>{
  expect(packet).toMatchObject({accepted:true,clinicalApproval:false,pipelinePassed:false,independentVerdict:"REVISE",independentDifficulty:"easy",independentTwoStep:false,ownerNoteResolved:true,holdStatus:"none"});
  for(const value of [q,...claims,...reviews,...mappings])expect(value).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null});
  expect(manifest.clinicalApproval).toBe(false);expect(q.supportingEvidenceClaimIds).toEqual(reviewedQuestions[0]!.supportingEvidenceClaimIds);
  expect(mappings[0]!.questionVariantId).toBe(q.id);expect(mappings[0]!.fields[0]!.field).toBe("presentation / complete task");
 });
 it("rejects an unrelated release mutation instead of masking it in historical test epochs",()=>{
  const drift=structuredClone(live);drift.cases.find(c=>c.id!==cs.id)!.presentation+=" Changed";
  expect(()=>beforeFlags4AcceptanceRelease(drift)).toThrow();
  const shifted=structuredClone(manifest);shifted.accepted[0]!.questionVariantId+=".changed";
  expect(()=>beforeFlags4AcceptanceManifest(shifted)).toThrow();
 });
 it("pins each authorized source preimage without refreshing any immutable capture",()=>{
  const migration=read("tools/question-quality/fixtures/question-flags4-acceptance-source-migration-20261108.json");
  expect(migration.files).toHaveLength(9);
  const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags4-acceptance-release-source-pins-20261108.json",import.meta.url));
  expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("b9b99624ad361782f74e06dc57f7ebf93499c9b1f4601608cac118cc257be5dd");
  const pins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;paths:Array<{path:string;capturedMainSha256:string;requiredReleaseSha256:string}>};
  expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags4-acceptance-before-20261108.json",import.meta.url))).digest("hex")).toBe(pins.capturedFixtureSha256);
  expect(pins.paths).toHaveLength(1);
  for(const row of pins.paths)expect(before.files[row.path]).toBe(row.capturedMainSha256);
  for(const file of migration.files){
   const current=readFileSync(new URL("../../../"+file.path,import.meta.url),"utf8"),row=pins.paths.find(r=>r.path===file.path);
   if(row)expect(createHash("sha256").update(current).digest("hex"),file.path+" exact release source").toBe(row.requiredReleaseSha256);
   else expect(createHash("sha256").update(beforeFlags4AcceptanceSource(file.path,current)).digest("hex")).toBe(before.files[file.path]);
  }
 });
});
