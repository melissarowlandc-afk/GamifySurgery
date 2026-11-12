import {beforeFlags3AcceptanceRelease,beforeFlags3AcceptanceManifest,beforeFlags3AcceptanceTimings} from "./question-flags3-acceptance-test-support";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive,QUESTION_CATALOG_RELEASE as catalog,
 QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE as source} from "./synthetic-content";
import {QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE as retainedExport} from "./question-new-n3-round3-source-20261105";
import {QUESTION_NEW_N3_ROUND3_QUESTIONS as questions,QUESTION_NEW_N3_ROUND3_CASES as authoredCases,
 QUESTION_NEW_N3_ROUND3_PARKED_CASE_IDS as parked} from "./question-new-n3-round3-20261105";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTiming} from "./answer-choice-timing";
import {beforeN3AcceptanceRelease,beforeN3AcceptanceManifest} from "./question-new-n3-acceptance-test-support";

const live=beforeFlags3AcceptanceRelease(actualLive),manifest=beforeFlags3AcceptanceManifest(actualManifest),timing=beforeFlags3AcceptanceTimings(actualTiming);

const ids=[
 "review.n3.bilateral-carotid-symptom-attribution.v2",
 "review.n3.postsplenectomy-nodule-function-before-targeting.v2",
 "review.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v2",
 "review.n3.tumor-screen-versus-family-test-sequence.v2",
 "review.n3.gastric-lymphoma-new-large-cell-process.v2",
];
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-new-n3-acceptance-before-20261105.json") as {
 default:{caseHashes:Record<string,string>;conceptHashes:Record<string,string>};catalogSha256:string;round3SourceSha256:string;timingSha256:string;
};
const packet=read("docs/research/question-new-n3-round3-20261105.json") as {
 frozenPreservation:Array<{id:string;variantSha256:string;authoredCaseSha256:string;exact:boolean}>;
 variants:Array<{id:string;caseId:string;questionVariantId:string;authoredTemplate:unknown;clinicalCase:unknown;directKeySupport:{heldKeyClaims:string[]}}>;
};
const review=read("docs/research/question-new-n3-review2-20261105.json") as Array<{id:string;verdict:string}>;
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

describe("N3 manager acceptance of five frozen review-two PASS versions",()=>{
 it("pins exactly the five directed v2 tuples and complete headers to the explicit round-three view",()=>{
  const rows=manifest.accepted.filter(r=>r.acceptanceId.startsWith("review.n3."));
  expect(rows.map(r=>r.acceptanceId)).toEqual(ids);expect(manifest.accepted).toHaveLength(69);
  expect(manifest.id).toBe("question-ship.2026-11-05.v4");
  expect(retainedExport).toBe(source);expect(source.cases).toHaveLength(8);
  for(const row of rows){
   const cs=source.cases.find(c=>c.id===row.caseId)!,n=cs.decisionNodes[0]!;
   expect(row).toMatchObject({nodeId:n.id,questionVariantId:n.questionVariantId,conceptId:n.primaryConceptId,
    sourceView:"n3-round3",decision:"docs/research/question-new-n3-manager-decision-20261105.md"});
   expect(manifest.headerSources[cs.id]).toBe("n3-round3");
  }
 });
 it.each(ids)("admits %s byte-for-byte at both frozen packet and authored-case hashes without clinical approval",id=>{
  expect(review.find(r=>r.id===id)?.verdict).toBe("PASS");
  const pin=packet.frozenPreservation.find(r=>r.id===id)!,variant=packet.variants.find(v=>v.id===id)!;
  expect(pin.exact).toBe(true);expect(digest(variant)).toBe(pin.variantSha256);
  expect(digest(variant.authoredTemplate)).toBe(pin.authoredCaseSha256);
  const cs=live.cases.find(c=>c.id===variant.caseId)!,authored=authoredCases.find(c=>c.id===cs.id)!;
  expect(digest(cs)).toBe(pin.authoredCaseSha256);expect(cs).toEqual(authored);
  expect(cs).toEqual(source.cases.find(c=>c.id===cs.id));expect(cs.decisionNodes).toHaveLength(1);
  const n=cs.decisionNodes[0]!,q=questions.find(q=>q.id===n.questionVariantId)!;
  expect(n.questionVariantId).toBe(variant.questionVariantId);expect(n.shuffleAnswers).toBe(true);
  expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
  expect(variant.directKeySupport.heldKeyClaims).toEqual([]);
  expect(live.concepts.find(c=>c.id===n.primaryConceptId)).toEqual(source.concepts.find(c=>c.id===n.primaryConceptId));
 });
 it("changes no prior default case, meaning, acceptance, replacement, timing or catalog definition",()=>{
  beforeN3AcceptanceRelease(live);beforeN3AcceptanceManifest(manifest);
  for(const[id,sha]of Object.entries(before.default.caseHashes))expect(digest(live.cases.find(c=>c.id===id)),id).toBe(sha);
  for(const[id,sha]of Object.entries(before.default.conceptHashes))expect(digest(live.concepts.find(c=>c.id===id)),id).toBe(sha);
  expect(digest(catalog)).toBe(before.catalogSha256);expect(digest(source)).toBe(before.round3SourceSha256);
  expect(digest(timing)).toBe(before.timingSha256);
  expect(live.cases).toHaveLength(1141);expect(live.cases.reduce((n,c)=>n+c.decisionNodes.length,0)).toBe(1452);
  expect(live.concepts).toHaveLength(605);expect(manifest.clinicalApproval).toBe(false);
  expect(live.publicationStatus).toBe("synthetic_unapproved_prototype");
 });
 it("keeps the three v3 repairs, pleural v1 and all parked cases out of fresh play",()=>{
  const acceptedCaseIds=new Set(manifest.accepted.filter(r=>r.sourceView==="n3-round3").map(r=>r.caseId));
  expect(live.cases.filter(c=>c.id.startsWith("case.n3.")).map(c=>c.id).sort()).toEqual([...acceptedCaseIds].sort());
  for(const cs of source.cases.filter(c=>!acceptedCaseIds.has(c.id))){
   expect(cs.decisionNodes[0]!.questionVariantId.endsWith(".v3")).toBe(true);
   expect(live.cases.some(c=>c.id===cs.id)).toBe(false);
  }
  expect(parked).toHaveLength(32);
  for(const id of parked)expect(live.cases.some(c=>c.id===id)).toBe(false);
  expect(live.cases.some(c=>c.id==="case.n3.pleural-source-versus-systemic-response.v1")).toBe(false);
 });
});
