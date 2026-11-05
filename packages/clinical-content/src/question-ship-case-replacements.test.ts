import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it,vi} from "vitest";
import {beforeN3AcceptanceRelease,beforeN3AcceptanceManifest} from "./question-new-n3-acceptance-test-support";
import {QUESTION_SHIP_MANIFEST as currentManifest,type QuestionShipManifest} from "./question-ship-manifest";
import {projectManagerAcceptedQuestions} from "./question-ship-projection";
import {questionShipManifestIssues} from "./question-ship-manifest-validation";
import {QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE as source,QUESTION_FLAGS2_ROUND3_REVISIONS as revisions} from "./question-flags2-round3-20261105";
import {withAcceptedQuestionFlags2WholeCaseConcepts,QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES as timings} from "./question-flags2-whole-case-accepted-20261105";
import {SYNTHETIC_CLINICAL_RELEASE as currentLive,QUESTION_FLAGS_PRE_REVISION_RELEASE as legacy,
  QUESTION_NEW_N3_PRE_RELEASE as baseCatalog,QUESTION_CATALOG_RELEASE} from "./synthetic-content";
import {ANSWER_CHOICE_TIMING_REGISTRY} from "./answer-choice-timing";
import type {SyntheticClinicalRelease} from "./schema";

const capture=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-ship-case-replacements-before-20261105.json",import.meta.url),"utf8")) as {
  default:{cases:number;nodes:number;concepts:number;caseHashes:Record<string,string>;conceptHashes:Record<string,string>};
  manifest:{accepted:QuestionShipManifest["accepted"];legacyBindings:QuestionShipManifest["legacyBindings"]};timing:{count:number;sha256:string};
};
const digest=(x:unknown)=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const live=beforeN3AcceptanceRelease(currentLive),manifest=beforeN3AcceptanceManifest(currentManifest);
const clone=<T>(x:T):T=>JSON.parse(JSON.stringify(x)) as T;
const catalog=withAcceptedQuestionFlags2WholeCaseConcepts(baseCatalog);
const views={legacy,"flags2-round3":source};
const only:QuestionShipManifest={...manifest,accepted:manifest.accepted.filter(a=>a.sourceView==="flags2-round3")};

describe("explicit whole-case manager replacements",()=>{
 it("admits exactly the two complete source cases and withholds all four legacy nodes from fresh supply",()=>{
  expect(manifest.replacements).toHaveLength(2);expect(manifest.accepted).toHaveLength(64);
  expect(manifest.accepted.filter(a=>a.sourceView!=="flags2-round3")).toEqual(capture.manifest.accepted);
  expect(manifest.legacyBindings).toEqual(capture.manifest.legacyBindings);
  expect(manifest.accepted.some(a=>a.acceptanceId.startsWith("review.n3."))).toBe(false);
  for(const cs of source.cases){
   expect(live.cases.find(c=>c.id===cs.id)).toEqual(cs);
   expect(cs.decisionNodes).toHaveLength(1);
   const old=legacy.cases.find(c=>c.id===cs.id)!;
   expect(old.decisionNodes).toHaveLength(2);
   for(const n of old.decisionNodes)expect(live.cases.flatMap(c=>c.decisionNodes).some(x=>x.questionVariantId===n.questionVariantId)).toBe(false);
  }
 });
 it("changes no other default row, retains every historical concept and changes only the documented counts",()=>{
  expect(live.cases).toHaveLength(capture.default.cases);
  expect(live.cases.reduce((n,c)=>n+c.decisionNodes.length,0)).toBe(capture.default.nodes-2);
  expect(live.concepts).toHaveLength(capture.default.concepts+2);
  const replaced=new Set(source.cases.map(c=>c.id));
  for(const cs of live.cases)if(!replaced.has(cs.id))expect(digest(cs),cs.id).toBe(capture.default.caseHashes[cs.id]);
  expect(live.cases.filter(c=>!replaced.has(c.id))).toHaveLength(1134);
  for(const [id,sha]of Object.entries(capture.default.conceptHashes))expect(digest(live.concepts.find(c=>c.id===id)),id).toBe(sha);
  expect(ANSWER_CHOICE_TIMING_REGISTRY).toHaveLength(capture.timing.count+2);
  expect(digest(ANSWER_CHOICE_TIMING_REGISTRY.slice(0,-2))).toBe(capture.timing.sha256);
  expect(ANSWER_CHOICE_TIMING_REGISTRY.slice(-2)).toEqual(timings);
  for(const r of revisions){expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();}
 });
 it("accepts an exact legacy question ID as the relation's source without merging legacy neighbors",()=>{
  const relation=manifest.replacements![0]!,old=legacy.cases.find(c=>c.id===relation.replaces)!;
  const m:QuestionShipManifest={...only,replacements:[{...relation,replaces:old.decisionNodes[0]!.questionVariantId}]};
  expect(questionShipManifestIssues(catalog,legacy,views,m)).toEqual([]);
  expect(projectManagerAcceptedQuestions(catalog,legacy,views,m).cases.find(c=>c.id===old.id)).toEqual(source.cases.find(c=>c.id===old.id));
 });
 it("can replace a case with a distinct case ID exactly once, leaving the old source definition intact",()=>{
  const row=only.accepted[0]!,original=source.cases.find(c=>c.id===row.caseId)!;
  const replacement={...original,id:original.id+".replacement"};
  const m:QuestionShipManifest={...only,accepted:[{...row,caseId:replacement.id}],replacements:[{replaces:row.caseId,with:row.questionVariantId}],
   headerSources:{[replacement.id]:"replacement-test"}};
  m.accepted=[{...m.accepted[0]!,sourceView:"replacement-test"}];
  const v={legacy,"replacement-test":{...source,cases:[replacement]}};
  expect(questionShipManifestIssues(catalog,legacy,v,m)).toEqual([]);
  const before=JSON.stringify({legacy,v});const projected=projectManagerAcceptedQuestions(catalog,legacy,v,m);
  expect(projected.cases.some(c=>c.id===row.caseId)).toBe(false);
  expect(projected.cases.filter(c=>c.id===replacement.id)).toEqual([replacement]);
  expect(JSON.stringify({legacy,v})).toBe(before);
 });
 it.each(["unknown-legacy","unknown-draft","missing-view","missing-concept","partial-case","duplicate-relation","conflicting-target","wrong-header"] as const)
 ("rejects %s without downgrading to a partial node override",kind=>{
  const first=only.accepted[0]!,cs=source.cases.find(c=>c.id===first.caseId)!;
  const m=clone(only);const v=clone(views);let cat=catalog;
  if(kind==="unknown-legacy")m.replacements=[{replaces:"case.unknown",with:first.questionVariantId}];
  if(kind==="unknown-draft")m.replacements=[{replaces:first.caseId,with:"question.unknown"}];
  if(kind==="missing-view")m.accepted=m.accepted.map(a=>a===m.accepted[0]?{...a,sourceView:"missing"}:a);
  if(kind==="missing-concept")cat={...catalog,concepts:catalog.concepts.filter(c=>c.id!==first.conceptId)};
  if(kind==="partial-case")v["flags2-round3"].cases=v["flags2-round3"].cases.map(c=>c.id===cs.id?{...c,decisionNodes:[...c.decisionNodes,{...c.decisionNodes[0]!,id:c.decisionNodes[0]!.id+".extra"}]}:c);
  if(kind==="duplicate-relation")m.replacements=[...m.replacements!,m.replacements![0]!];
  if(kind==="conflicting-target")m.replacements=[m.replacements![0]!,{replaces:m.replacements![1]!.replaces,with:first.questionVariantId}];
  if(kind==="wrong-header")m.headerSources={...m.headerSources,[cs.id]:"legacy"};
  expect(questionShipManifestIssues(cat,legacy,v,m).some(i=>i.includes("replacement"))).toBe(true);
  const warn=vi.spyOn(console,"warn").mockImplementation(()=>{});
  try{const projected=projectManagerAcceptedQuestions(cat,legacy,v,m);expect(projected.cases.find(c=>c.id===cs.id)).toEqual(legacy.cases.find(c=>c.id===cs.id));expect(warn).toHaveBeenCalled();}
  finally{warn.mockRestore();}
 });
 it("does not admit N3 round-three drafts or mutate any retained source or save format",()=>{
  const before=digest({source,catalog:QUESTION_CATALOG_RELEASE,legacy});
  projectManagerAcceptedQuestions(catalog,legacy,views,only);
  expect(digest({source,catalog:QUESTION_CATALOG_RELEASE,legacy})).toBe(before);
  expect(live.cases.some(c=>c.id.startsWith("case.n3."))).toBe(false);
 });
});
