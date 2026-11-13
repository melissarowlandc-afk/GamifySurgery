import {beforeProgramBatch9AcceptanceRelease,beforeProgramBatch9AcceptanceManifest,beforeProgramBatch9AcceptanceTimings,beforeProgramBatch9AcceptanceSource} from "./question-program-batch9-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {PROGRAM_BATCH8_ROWS,PROGRAM_BATCH8_REPLACED_ROWS} from "./question-program-batch8-accepted-data-20261112";
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-topic-acceptance-batch8-before-20261112.json");
const after=read("tools/question-quality/fixtures/question-topic-acceptance-batch8-after-20261112.json");
const migration=read("tools/question-quality/fixtures/question-topic-acceptance-batch8-source-migration-20261112.json") as {
  files:Array<{path:string;beforeText:string;beforeSha256:string;afterSha256:string}>;
};
const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
const digest=(v:unknown)=>sha(JSON.stringify(v));
export function beforeProgramBatch8AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
  if(release.cases.some(c=>c.procedureContext&&c.id.startsWith("case.intraop.")))release=beforeProgramBatch9AcceptanceRelease(release);
  if(digest(release)===before.defaultSha256)return release;
  const ids=new Set(before.candidates.map((c:{question:{id:string}})=>c.question.id));
  if(!release.cases.some(c=>c.decisionNodes.some(n=>ids.has(n.questionVariantId))))return release;
  expect(digest(release),"complete exact batch8 release postimage").toBe(after.defaultSha256);
  expect(digest(before.defaultRelease),"immutable batch8 release preimage").toBe(before.defaultSha256);
  return structuredClone(before.defaultRelease);
}
export function beforeProgramBatch8AcceptanceManifest<T extends QuestionShipManifest>(manifest:T):T{
  if(manifest.accepted.some(r=>r.sourceView.startsWith("intraop-batch9-")))manifest=beforeProgramBatch9AcceptanceManifest(manifest);
  if(!manifest.accepted.some(r=>r.sourceView==="owner-decisions-batch8"))return manifest;
  expect(digest(manifest),"complete exact batch8 authority postimage").toBe(after.manifestSha256);
  expect(digest(before.manifest),"immutable batch8 authority preimage").toBe(before.manifestSha256);
  return structuredClone(before.manifest) as T;
}
export function beforeProgramBatch8AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[]{
  actual=beforeProgramBatch9AcceptanceTimings(actual);
  // Earlier inverse steps call this again on already historical arrays. Their
  // original guards still verify those preimages; this step owns only batch8.
  if(!actual.some(t=>PROGRAM_BATCH8_ROWS.some(r=>r.questionVariantId===t.questionVariantId)))return [...actual];
  if(digest(actual)===before.timingSha256)return [...actual];
  expect(digest(actual),"complete exact batch8 timing postimage").toBe(after.timingSha256);
  expect(digest(before.timing),"immutable batch8 timing preimage").toBe(before.timingSha256);
  return structuredClone(before.timing);
}
export function beforeProgramBatch8AcceptanceSource(path:string,current:string):string;
export function beforeProgramBatch8AcceptanceSource(path:string,current:undefined):string|undefined;
export function beforeProgramBatch8AcceptanceSource(path:string,current:string|undefined):string|undefined;
export function beforeProgramBatch8AcceptanceSource(path:string,current:string|undefined):string|undefined{
  current=beforeProgramBatch9AcceptanceSource(path,current);
  const row=migration.files.find(r=>r.path===path);if(!row)return current;
  const hash=(value:string)=>createHash("sha256").update(value).digest("hex");
  const pins=read("tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json");
  const pin=pins.paths.find((p:{path:string})=>p.path===path);
  expect(pin,path+" exact authorized release presence").toBeDefined();
  expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
  if(current===undefined){
    expect(pin.requiredReleaseSha256).toBeNull();expect(existsSync(new URL("../../../"+path,import.meta.url))).toBe(false);
    const archive=read(pins.repairedTopicTestArchivePath);
    const repaired=archive.records.find((r:{path:string})=>r.path===path);
    expect(repaired.sha256).toBe(row.afterSha256);expect(hash(repaired.sourceText)).toBe(row.afterSha256);
  }else if(hash(current)===row.beforeSha256)return current;
  else expect([row.afterSha256,pin.requiredReleaseSha256],path+" exact authoring/release postimage").toContain(hash(current));
  expect(hash(row.beforeText),path+" immutable captured preimage").toBe(row.beforeSha256);
  return row.beforeText;
}

const withdrawn=new Set(PROGRAM_BATCH8_REPLACED_ROWS.map(r=>r.acceptanceId));
const expectedRows:QuestionShipManifest["accepted"]=[...before.manifest.accepted.filter((r:{acceptanceId:string})=>!withdrawn.has(r.acceptanceId)),...PROGRAM_BATCH8_ROWS];
const membershipCache=new WeakMap<SyntheticClinicalRelease,{manifest:QuestionShipManifest;release:SyntheticClinicalRelease;authority:QuestionShipManifest}>();
/** Full epoch verification occurs once per input identity. Every later scope
 * rechecks its live case hash, exact bindings and authority rows, so in-place
 * mutation after caching is detected without cloning/hashing 1400 cases per
 * question in ordinary membership tests. No timeout or assertion is relaxed. */
export function programBatch8HistoricalMembership(release:SyntheticClinicalRelease,manifest:QuestionShipManifest,
  scope:{caseId:string}|{questionVariantId:string}){
  let prior=membershipCache.get(release);
  if(!prior||prior.manifest!==manifest){
    prior={manifest,release:beforeProgramBatch8AcceptanceRelease(release),authority:beforeProgramBatch8AcceptanceManifest(manifest)};
    membershipCache.set(release,prior);
  }
  const caseIds=new Set<string>();
  if("caseId"in scope)caseIds.add(scope.caseId);
  else{
    const id=scope.questionVariantId;
    expect(manifest.accepted.filter(r=>r.questionVariantId===id)).toEqual(expectedRows.filter(r=>r.questionVariantId===id));
    const bindings=release.cases.flatMap(c=>c.decisionNodes.filter(n=>n.questionVariantId===id)
      .map(n=>[c.id,n.id,n.questionVariantId,n.primaryConceptId]));
    expect(bindings).toEqual(after.bindings.filter((r:string[])=>r[2]===id));
    for(const cs of before.defaultRelease.cases as SyntheticClinicalCaseForScope[])
      if(cs.decisionNodes.some(n=>n.questionVariantId===id))caseIds.add(cs.id);
    for(const r of expectedRows.filter(r=>r.questionVariantId===id))caseIds.add(r.caseId);
  }
  for(const id of caseIds){
    const actual=release.cases.filter(c=>c.id===id),expectedHash=after.caseHashes[id];
    expect(actual,id+" exact current case cardinality").toHaveLength(expectedHash?1:0);
    if(expectedHash)expect(digest(actual[0]),id+" exact current case after cached epoch").toBe(expectedHash);
    expect(manifest.accepted.filter(r=>r.caseId===id)).toEqual(expectedRows.filter(r=>r.caseId===id));
  }
  return {release:prior.release,manifest:prior.authority};
}
type SyntheticClinicalCaseForScope=SyntheticClinicalRelease["cases"][number];
