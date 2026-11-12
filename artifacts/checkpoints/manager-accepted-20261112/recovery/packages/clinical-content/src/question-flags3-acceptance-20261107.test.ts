import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive, QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTimings} from "./answer-choice-timing";
import {QUESTION_FLAGS3_SOURCE_RELEASE as reviewed, QUESTION_FLAGS3_RETAINED_INPUT as old,
 QUESTION_FLAGS3_REVISIONS as reviewedRevisions} from "./question-flags3-20261107";
import {QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE as source, QUESTION_FLAGS3_ACCEPTED_REVISIONS as revisions,
 QUESTION_FLAGS3_ACCEPTED_QUESTIONS as questions, QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES as actualAddedTimings,
 QUESTION_FLAGS3_ACCEPTED_TEST_ORDER_RECORDS as orders, QUESTION_FLAGS3_ACCEPTED_STATEMENT_MAPPINGS as mappings} from "./question-flags3-accepted-20261107";
import {beforeFlags3AcceptanceRelease,beforeFlags3AcceptanceManifest,beforeFlags3AcceptanceTimings} from "./question-flags3-acceptance-test-support";
import {beforeStats1AcceptanceRelease,beforeStats1AcceptanceManifest,beforeStats1AcceptanceTimings,beforeStats1PriorAcceptedTimings} from "./question-stats1-acceptance-test-support";
// Historical flags3 acceptance still asserts its original exact default epoch.
const live=beforeStats1AcceptanceRelease(actualLive),manifest=beforeStats1AcceptanceManifest(actualManifest),timings=beforeStats1AcceptanceTimings(actualTimings);
const addedTimings=beforeStats1PriorAcceptedTimings(actualAddedTimings,"flags3-accepted");

const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-flags3-acceptance-before-20261107.json") as {
 reviewedSourceSha256:string;catalogSha256:string;default:{caseHashes:Record<string,string>;conceptHashes:Record<string,string>};
};
const packet=read("docs/research/question-flags3-accepted-20261107.json") as Array<{
 id:string;questionVariantId:string;reviewStatus:string;holdStatus:string;keyOrderNotice:string;
 after:{Presentation:string;"Current update":string|null;Exhibit:unknown;Task:string;Options:string[]};
 frozenPreservation:{acceptedNodeSha256:string;acceptedCaseSha256:string;acceptedQuestionSha256:string;exactReviewedNode:boolean};
}>;
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const ids=["F3-01","F3-02","F3-03-type","F3-03"];

describe("flags3 manager acceptance and exact prior-epoch preservation",()=>{
 it("binds only the four directed exact tuples to the explicit fixed source and all three headers",()=>{
  const rows=manifest.accepted.filter(r=>r.sourceView==="flags3-accepted");
  expect(rows.map(r=>r.acceptanceId)).toEqual(ids);expect(manifest.accepted).toHaveLength(71);
  expect(manifest.id).toBe("question-ship.2026-11-07.v5");
  for(const row of rows){
   const r=revisions.find(r=>r.auditId===row.acceptanceId)!;
   expect(row).toEqual({acceptanceId:r.auditId,caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,
    conceptId:r.question.conceptId,sourceView:"flags3-accepted",decision:"docs/research/question-flags3-manager-decision-20261107.md"});
   expect(manifest.headerSources[row.caseId]).toBe("flags3-accepted");
  }
  expect(manifest.accepted.some(r=>["B2A02","B2A08"].includes(r.acceptanceId))).toBe(false);
  beforeFlags3AcceptanceManifest(manifest);
 });
 it.each(ids)("admits %s at its exact source, metadata and review-field hashes without clinical approval",id=>{
  const r=revisions.find(r=>r.auditId===id)!,cs=live.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
  const p=packet.find(p=>p.id===id)!,q=questions.find(q=>q.id===n.questionVariantId)!;
  expect(cs).toEqual(source.cases.find(c=>c.id===cs.id));expect(n.questionVariantId).toBe(r.questionVariantId);
  expect(digest(n)).toBe(p.frozenPreservation.acceptedNodeSha256);
  expect(digest(cs)).toBe(p.frozenPreservation.acceptedCaseSha256);
  expect(digest(q)).toBe(p.frozenPreservation.acceptedQuestionSha256);
  expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
  expect(p).toMatchObject({holdStatus:"none",reviewStatus:"needs_clinician_review",questionVariantId:n.questionVariantId});
  expect(p.keyOrderNotice).toContain("key shown first for review only");
  expect(n.shuffleAnswers).toBe(true);expect(p.after.Options.filter(o=>o.startsWith("**KEY:** "))).toHaveLength(1);
  expect(live.concepts.some(c=>c.id===n.primaryConceptId)).toBe(true);
 });
 it("keeps the exact statistics and PASS dysphagia cases, plus all reviewed source and choices",()=>{
  expect(digest(reviewed)).toBe(before.reviewedSourceSha256);
  for(const id of ["F3-01","F3-02"]){const r=revisions.find(r=>r.auditId===id)!;
   expect(source.cases.find(c=>c.id===r.caseId)).toEqual(reviewed.cases.find(c=>c.id===r.caseId));}
  for(const r of revisions){const previous=reviewedRevisions.find(p=>p.auditId===r.auditId)!;
   expect(r.question.answerChoices).toEqual(previous.question.answerChoices);
   expect(r.question.explanation).toBe(previous.question.explanation);
   expect(r.question.supportingEvidenceClaimIds).toEqual(previous.question.supportingEvidenceClaimIds);}
 });
 it("makes management self-contained only after the type decision, without redesigning its choices",()=>{
  const cs=source.cases.find(c=>c.id==="case.inguinal-hernia.caregiving-strain")!,[type,plan]=cs.decisionNodes;
  expect(cs.presentation).not.toMatch(/caregiv|lifts|femoral hernia/);
  expect(type!.currentUpdate??"").not.toMatch(/femoral hernia|caregiv|elective|repair/);
  expect(JSON.stringify(type!.exhibit)).toContain("Below the inguinal ligament");
  expect(type!.explanation).not.toMatch(/repair|surveillance|elective/);
  expect(plan!.currentUpdate).toContain("Ultrasound classification: femoral hernia.");
  expect(plan!.currentUpdate).toContain("usual caregiving lifts");
  expect(plan!.questionVariantId).toBe("question.inguinal-hernia.symptomatic-elective-repair.v3.r12");
  expect(plan!.primaryConceptId).toBe("concept.groin-hernia.femoral-defect-repair-priority.v1");
  expect(mappings.find(m=>m.questionVariantId===plan!.questionVariantId)?.evidenceClaimIds).toContain("claim.flags3.20261107.groin-compartment");
  const p=packet.find(p=>p.id==="F3-03")!;
  expect(p.after["Current update"]).toContain("femoral hernia");
  expect(plan!.answerChoices.map(a=>a.label)).toEqual(["Plan elective hernia repair","Plan scheduled hernia surveillance","Plan emergency hernia exploration"]);
 });
 it("uses a whole-case relation to retire the old workup from fresh supply while retaining legacy bindings",()=>{
  const cs=live.cases.find(c=>c.id==="case.inguinal-hernia.caregiving-strain")!;
  expect(manifest.replacements).toHaveLength(3);
  expect(manifest.replacements).toContainEqual({replaces:cs.id,with:"question.inguinal-hernia.symptomatic-elective-repair.v3.r12"});
  expect(cs.decisionNodes.map(n=>n.id)).toEqual(["node.flags3.groin-ultrasound-classification.20261107","node.inguinal-hernia.caregiving-strain.2"]);
  for(const n of old.cases.find(c=>c.id===cs.id)!.decisionNodes)expect(cs.decisionNodes.some(current=>current.questionVariantId===n.questionVariantId)).toBe(false);
  expect(manifest.legacyBindings.some(r=>r[0]===cs.id&&r[1]==="node.inguinal-hernia.caregiving-strain.1")).toBe(true);
 });
 it("adds only four exact timing identities and three preview orders; retains all old frozen bindings",()=>{
  expect(addedTimings).toHaveLength(4);expect(orders).toHaveLength(3);expect(timings).toHaveLength(2219);
  beforeFlags3AcceptanceTimings(timings);
  for(const row of addedTimings)expect(timings.filter(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId)).toEqual([row]);
  for(const order of orders)expect(order.disposition).toEqual({kind:"not_executed",reason:"future_planned"});
 });
 it("changes exactly three current cases and adds one separately scored meaning; all other defaults remain exact",()=>{
  beforeFlags3AcceptanceRelease(live);
  const changed=new Set(source.cases.map(c=>c.id));
  for(const[id,sha]of Object.entries(before.default.caseHashes))if(!changed.has(id))expect(digest(live.cases.find(c=>c.id===id)),id).toBe(sha);
  for(const[id,sha]of Object.entries(before.default.conceptHashes))expect(digest(live.concepts.find(c=>c.id===id)),id).toBe(sha);
  expect(digest(catalog)).toBe(before.catalogSha256);
  expect(live.cases).toHaveLength(1141);expect(live.cases.reduce((n,c)=>n+c.decisionNodes.length,0)).toBe(1452);
  expect(live.concepts).toHaveLength(606);expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(450);
  expect(digest(live)).toBe("0fbd0efc0502cb47e463a07ea2c8a74e6ce992876f27442ec5597b17cc5273cf");
  expect(digest(manifest)).toBe("c32128d1bebad68306fdfb28b893278548998fecb988a0c50dfb2377ebe413d6");
  expect(live.publicationStatus).toBe("synthetic_unapproved_prototype");expect(manifest.clinicalApproval).toBe(false);
 });
});
