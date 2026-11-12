import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTiming} from "./answer-choice-timing";
import {beforeFlags4AcceptanceRelease,beforeFlags4AcceptanceManifest,beforeFlags4AcceptanceTimings} from "./question-flags4-acceptance-test-support";
const live=beforeFlags4AcceptanceRelease(actualLive),manifest=beforeFlags4AcceptanceManifest(actualManifest),timing=beforeFlags4AcceptanceTimings(actualTiming);
import {QUESTION_STATS1_SOURCE_RELEASE as reviewed,QUESTION_STATS1_REVISIONS as oldRevisions,QUESTION_STATS1_RETAINED_INPUT as retained,
 QUESTION_STATS1_BASIS_CLAIMS as basis,QUESTION_STATS1_CLAIMS as originalClaims} from "./question-stats1-20261108";
import {QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE as source,QUESTION_STATS1_ACCEPTED_REVISIONS as revisions,
 QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES as addedTimings,QUESTION_STATS1_ACCEPTED_SOURCES as sources,
 QUESTION_STATS1_REPAIRED_CLAIMS as newClaims,QUESTION_STATS1_ACCEPTED_STATEMENT_MAPPINGS as mappings} from "./question-stats1-accepted-20261108";
import {beforeStats1AcceptanceRelease,beforeStats1AcceptanceManifest,beforeStats1AcceptanceTimings,beforeStats1AcceptanceSource} from "./question-stats1-acceptance-test-support";
import type {CaseExhibit} from "./schema";

const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json") as {
 default:{caseHashes:Record<string,string>;conceptHashes:Record<string,string>;conceptIds:string[]};files:Record<string,string>;reviewedSourceSha256:string;catalogSha256:string;
 reviews:Array<{id:string;verdict:string}>;additional:Array<{clinicalCase:{id:string}}>;
};
const packet=read("docs/research/question-stats1-accepted-20261108.json") as Array<{
 id:string;independentVerdict:string;pipelinePassed:boolean;clinicalApproval:boolean;holdStatus:string;keyOrderNotice:string;
 wordCounts:{target35Met:boolean;after:{combinedBeforeTask:number;explanationLines:number}};
 frozenPreservation:{acceptedCaseSha256:string;acceptedNodeSha256:string;acceptedQuestionSha256:string;exactReviewedPass:boolean};
}>;
const lint=read("tools/question-quality/question-stats1-accepted-lint-20261108.json") as {totals:{acceptedFindings:number;variants:number;profileContexts:number;suppressed:number}};
const sha=(s:string)=>createHash("sha256").update(s).digest("hex"),digest=(v:unknown)=>sha(JSON.stringify(v));
const find=(id:string)=>{const r=revisions.find(r=>r.auditId===id)!,cs=source.cases.find(c=>c.id===r.caseId)!;return {r,cs,n:cs.decisionNodes[0]!,q:r.question};};
const kv=(id:string)=>{const e=find(id).q.exhibit!;expect(e.kind).toBe("keyValue");return (e as Extract<CaseExhibit,{kind:"keyValue"}>).items;};
const nums=(s:string)=>[...s.matchAll(/\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));

describe("stats1 exact manager acceptance and frozen identities",()=>{
 it.each(revisions.map(r=>[r.auditId] as const))("admits %s from the bound accepted source without clinical approval",id=>{
  const {r,cs,n,q}=find(id),p=packet.find(p=>p.id===id)!;
  expect(manifest.accepted.filter(a=>a.acceptanceId===id)).toEqual([{acceptanceId:id,caseId:r.caseId,nodeId:r.nodeId,
   questionVariantId:q.id,conceptId:q.conceptId,sourceView:"stats1-accepted",decision:"docs/research/question-stats1-manager-decision-20261108.md"}]);
  expect(manifest.headerSources[r.caseId]).toBe("stats1-accepted");expect(live.cases.find(c=>c.id===r.caseId)).toEqual(cs);
  expect(cs.decisionNodes).toHaveLength(1);expect(n.shuffleAnswers).toBe(true);expect([3,4]).toContain(n.answerChoices.length);
  if(cs.participant?.kind==="employee_discussion"){
   expect(cs.prototypeDemographics).toBeUndefined();expect(cs.prototypeVitalSigns).toBeUndefined();
   for(const profile of cs.approvedInstantiationProfiles??[]){expect(Object.keys(profile).sort()).toEqual(["chiefComplaint","id","presentation"]);expect(profile.presentation).toBe(cs.presentation);}
  }
  expect(n.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);expect(n.resultGateAfter).toBeNull();
  expect(n.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
  expect(digest(cs)).toBe(p.frozenPreservation.acceptedCaseSha256);expect(digest(n)).toBe(p.frozenPreservation.acceptedNodeSha256);expect(digest(q)).toBe(p.frozenPreservation.acceptedQuestionSha256);
  expect(q).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null,aiAssistedDrafting:true});
  expect(p).toMatchObject({clinicalApproval:false,holdStatus:"none",wordCounts:{target35Met:true,after:{explanationLines:3}}});
  expect(p.wordCounts.after.combinedBeforeTask).toBeLessThanOrEqual(35);expect(p.keyOrderNotice).toContain("key shown first for review only");
  expect(q.conceptId).toBe(oldRevisions.find(r=>r.auditId===id)!.question.conceptId);
  expect(mappings.find(m=>m.questionVariantId===q.id)?.evidenceClaimIds).toEqual(q.supportingEvidenceClaimIds);
 });
 it("freezes all42 PASS case/node/question objects and all round-one source bytes",()=>{
  expect(digest(reviewed)).toBe(before.reviewedSourceSha256);
  const pass=before.reviews.filter(r=>r.verdict==="PASS");expect(pass).toHaveLength(42);
  for(const {id}of pass){const {r,cs}=find(id),old=oldRevisions.find(r=>r.auditId===id)!;
   expect(r).toBe(old);expect(cs).toEqual(reviewed.cases.find(c=>c.id===cs.id));
   expect(packet.find(p=>p.id===id)).toMatchObject({pipelinePassed:true,independentVerdict:"PASS",frozenPreservation:{exactReviewedPass:true}});}
  expect(packet.filter(p=>p.independentVerdict==="REVISE")).toHaveLength(22);
  for(const p of packet.filter(p=>p.independentVerdict==="REVISE")){expect(p.pipelinePassed).toBe(false);expect(find(p.id).q.id).not.toBe(oldRevisions.find(r=>r.auditId===p.id)!.questionVariantId);}
 });
 it("changes only64 cases and their exact rows/headers, preserving every other default and all606 meanings in order",()=>{
  beforeStats1AcceptanceRelease(live);beforeStats1AcceptanceManifest(manifest);
  expect(live.cases).toHaveLength(1141);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1452);
  expect(live.concepts.map(c=>c.id)).toEqual(before.default.conceptIds);expect(live.concepts).toHaveLength(606);
  expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(450);
  expect(manifest.accepted).toHaveLength(133);expect(manifest.legacyBindings).toHaveLength(1423);expect(manifest.replacements).toHaveLength(3);
  expect(manifest.accepted.some(a=>["G06","F3-01"].includes(a.acceptanceId))).toBe(false);
  const changed=new Set(source.cases.map(c=>c.id));
  expect(live.cases.filter(c=>!changed.has(c.id))).toHaveLength(1077);
  for(const cs of live.cases)if(!changed.has(cs.id))expect(digest(cs),cs.id).toBe(before.default.caseHashes[cs.id]);
  for(const co of live.concepts)expect(digest(co),co.id).toBe(before.default.conceptHashes[co.id]);
  for(const row of before.additional)expect(digest(live.cases.find(c=>c.id===row.clinicalCase.id))).toBe(before.default.caseHashes[row.clinicalCase.id]);
  expect(digest(catalog)).toBe(before.catalogSha256);expect(manifest.clinicalApproval).toBe(false);expect(live.publicationStatus).toBe("synthetic_unapproved_prototype");
 });
 it("retains every2219 old timing row in order and appends exactly64 no-test identities",()=>{
  beforeStats1AcceptanceTimings(timing);expect(timing).toHaveLength(2283);expect(addedTimings).toHaveLength(64);
  for(const row of addedTimings){expect(row.classification).toEqual({kind:"no_test"});expect(timing.filter(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId)).toEqual([row]);}
 });
 it("retains exact original live fallbacks and refuses to reassign S42/S54 meaning",()=>{
  for(const cs of retained.cases)expect(digest(cs),cs.id).toBe(before.default.caseHashes[cs.id]);
  expect(find("S42").q.conceptId).toBe("concept.predictive-value.collection-population-denominator.v1");
  expect(find("S54").q.conceptId).toBe("concept.statistics-ethics.p-value.v2");
  expect(find("S42").q.id).toBe(oldRevisions.find(r=>r.auditId==="S42")!.questionVariantId);
 });
 it("has zero raw cue findings for64variants/128contexts and no suppression",()=>{
  expect(lint.totals).toMatchObject({acceptedFindings:0,variants:64,profileContexts:128,suppressed:0});
 });
 it("maps all23 new atomic claims to existing permitted sources without new retrieval or held keys",()=>{
  expect(newClaims).toHaveLength(23);expect(sources).toHaveLength(22);
  const all=[...originalClaims,...newClaims];
  for(const cl of newClaims){expect(cl.reviewStatus).toBe("needs_clinician_review");expect(cl.lastClinicianReview).toBeNull();expect(cl.sourceIds.length).toBeGreaterThan(0);
   for(const id of cl.sourceIds)expect(sources.some(s=>s.id===id&&s.evidenceClaimIds.includes(cl.id))).toBe(true);
   for(const id of cl.basisClaimIds)expect(basis.some(b=>b.id===id)).toBe(true);}
  for(const r of revisions)for(const id of r.question.supportingEvidenceClaimIds)expect(all.some(c=>c.id===id),id).toBe(true);
 });
 it("pins each authorized existing-source delta before preserving old capture assertions",()=>{
  for(const[p,h]of Object.entries(before.files))expect(sha(beforeStats1AcceptanceSource(p,readFileSync(new URL("../../../"+p,import.meta.url),"utf8"))),p).toBe(h);
 });
});

describe("stats1 directed feedback, fairness and numeric-pattern repairs",()=>{
 it.each(["S01","S02","S03","S04"])("%s teaches the explicit two-group assumptions without absent assessor facts",id=>{
  const q=find(id).q,text=JSON.stringify(q.exhibit);expect(text).toMatch(/independent, unpaired/);expect(text).toMatch(/normal within groups/);expect(text).toContain("similar variances");
  expect(q.explanation).toMatch(/Two independent groups/);expect(q.explanation).toContain("normal");expect(q.explanation).toContain("similar variances");expect(JSON.stringify(q)).not.toMatch(/shared assessor|shared investigator|therapist/);
  if(id==="S02")expect(kv(id)[1]!.value).toMatch(/^Blood loss/);
 });
 it.each([["S09",3],["S10",4],["S11",3],["S12",4]] as const)("%s uses its actual%s-group assumptions",(id,n)=>{
  const q=find(id).q;expect(kv(id)[0]!.value).toMatch(/independent patients/);expect(q.explanation).toContain(n+" independent groups");
  expect(q.explanation).toContain("normal");expect(q.explanation).toContain("similar variances");expect(q.explanation).toContain("all "+n+" population means");expect(q.explanation).not.toMatch(/suitable|three or more/i);
 });
 it("S21 counts each independent patient once in a mutually exclusive category at admission",()=>{
  const e=find("S21").q.exhibit! as Extract<CaseExhibit,{kind:"table"}>;
  expect(e.caption).toContain("at admission, one category each");expect(e.columnHeaders).toEqual(["Current","Former","Never"]);
  expect(e.cells).toEqual([["30","10","10"],["20","20","10"]]);
 });
 it.each(["S25","S26","S27","S28"])("%s works the actual expected-cell formula",id=>{
  const q=find(id).q,e=q.exhibit! as Extract<CaseExhibit,{kind:"table"}>,cells=e.cells.map(r=>r.map(Number));
  const row=cells[0]!.reduce((a,b)=>a+b,0),column=cells.reduce((a,r)=>a+r[0]!,0),total=cells.flat().reduce((a,b)=>a+b,0);
  expect(q.explanation.split("\n")[1]).toBe(`Expected event count = row total x event-column total / N = ${row} x ${column} / ${total} = ${row*column/total} per group.`);
  expect(row*column/total).toBeLessThanOrEqual(1);
 });
 it("S30 supplies selection independent of outcome and separates retrospective record selection from clinical chronology",()=>{
  const q=find("S30").q;expect(kv("S30")[0]!.value).toContain("selected regardless of infection");expect(kv("S30")[0]!.value).toContain("Consecutive");
  expect(q.explanation).toContain("without selecting on outcome");expect(q.explanation).not.toContain("Sampling by exposure before the outcome");
 });
 it("S48 has three parallel risk conclusions without majority-component convergence",()=>{
  expect(find("S48").q.answerChoices.map(a=>a.label)).toEqual(["Risk is 50% lower","Risk is 50% higher","Risk is unchanged"]);
 });
 it.each(["S49","S50","S51","S52"])("%s has feasible same-scale errors and correct mental arithmetic",id=>{
  const q=find(id).q,items=kv(id),control=nums(items[1]!.value)[0]!,treatment=nums(items[2]!.value)[0]!;
  const correct=Number(q.answerChoices.find(a=>a.isCorrect)!.label.split(" ")[0]);
  expect(correct).toBe(id==="S50"?control-treatment:100/(control-treatment));
  const values=q.answerChoices.map(a=>Number(a.label.split(" ")[0]));
  if(id==="S50"){expect(values.every(v=>v<=control)).toBe(true);expect(q.explanation).toContain("10-point option substitutes the treatment event rate for the risk difference");}
  else {expect(values.some(v=>v<correct)).toBe(true);expect(values.some(v=>v>correct)).toBe(true);}
  expect(items[0]!.value).toContain("30 days");
 });
 it("S54 states a single threshold and works both interval bounds",()=>{
  const q=find("S54").q;expect(kv("S54")[1]).toEqual({label:"Target benefit threshold",value:"2 days."});expect(q.stem).toContain("target threshold");
  expect(q.answerChoices.every(a=>a.label.startsWith("Threshold lies"))).toBe(true);expect(q.explanation).toContain("1 < 2 < 3");expect(q.explanation).toContain("below and above");
 });
 it("S55 does not invent an unspecified equal-means null",()=>{
  expect(find("S55").q.explanation).toContain("0.20 > 0.05 -> do not reject the tested null hypothesis.");expect(find("S55").q.explanation).not.toContain("equal-means");
 });
 it("S59 explains the visible lower endpoint without inventing an estimate",()=>{
  expect(find("S59").q.explanation).toContain("negative lower endpoint");expect(find("S59").q.explanation).not.toContain("point estimate");
 });
});
