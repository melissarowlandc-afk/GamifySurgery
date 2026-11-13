import {beforeProgramBatch8AcceptanceRelease as before8Release,beforeProgramBatch8AcceptanceManifest as before8Manifest,beforeProgramBatch8AcceptanceTimings as before8Timings,beforeProgramBatch8AcceptanceSource as before8Source,programBatch8HistoricalMembership} from "./question-program-batch8-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {SYNTHETIC_CLINICAL_RELEASE as currentRelease} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {PROGRAM_BATCH7_ROWS as rows} from "./question-program-batch7-accepted-data-20261112";

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const epoch=read("tools/question-quality/fixtures/question-topic-acceptance-batch7-epoch-20261112.json");
const migration=read("tools/question-quality/fixtures/question-topic-acceptance-batch7-source-migration-20261112.json") as {
  files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>;
};
const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");

/** Strict reversible epoch. Historical guards receive their exact prior
 * release, but only after verifying the complete authorized current postimage. */
export function beforeProgramBatch7AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  release=before8Release(release);
  if(digest(release)===epoch.before.defaultSha256)return release;
  if(!release.cases.some(cs=>cs.decisionNodes.some(node=>rows.some(row=>row.questionVariantId===node.questionVariantId))))return release;
  expect(digest(release),"exact full batch7 default postimage").toBe(epoch.after.defaultSha256);
  const byId=new Map(release.cases.map(cs=>[cs.id,cs]));
  for(const cs of epoch.before.changedCases)byId.set(cs.id,cs);
  const known=new Set<string>(epoch.before.conceptIds);
  const previous={...release,cases:epoch.before.caseIds.map((id:string)=>byId.get(id)!),concepts:release.concepts.filter(c=>known.has(c.id))};
  expect(previous.cases.every((cs:SyntheticClinicalRelease["cases"][number])=>!!cs)).toBe(true);
  expect(digest(previous),"exact full batch7 default preimage").toBe(epoch.before.defaultSha256);
  return previous;
}

export function beforeProgramBatch7AcceptanceManifest(manifest:QuestionShipManifest):QuestionShipManifest & {id:string;clinicalApproval:false} {
  manifest=before8Manifest(manifest);
  if(!manifest.accepted.some(row=>row.sourceView.startsWith("topic-batch7-")))return manifest as QuestionShipManifest & {id:string;clinicalApproval:false};
  expect(digest(manifest),"exact full batch7 manifest postimage").toBe(epoch.after.manifestSha256);
  const {retirements:_retirements,...rest}=manifest;
  const previous={...rest,id:epoch.before.manifestId,clinicalApproval:false as const,accepted:manifest.accepted.slice(0,epoch.before.accepted.length),headerSources:{...manifest.headerSources} as Record<string,string>};
  for(const [caseId,view]of Object.entries(epoch.before.changedHeaders)){
    if(view===null)delete previous.headerSources[caseId];else previous.headerSources[caseId]=view as string;
  }
  expect(digest(previous),"exact full batch7 manifest preimage").toBe(epoch.before.manifestSha256);
  return previous;
}

export function beforeProgramBatch7AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[]{
  actual=before8Timings(actual);
  if(!actual.some(t=>rows.some(r=>r.questionVariantId===t.questionVariantId)))return [...actual];
  expect(digest(actual),"exact full batch7 timing postimage").toBe(epoch.after.timingSha256);
  const previous=actual.slice(0,epoch.before.timingRows);
  expect(digest(previous),"exact full batch7 timing preimage").toBe(epoch.before.timingSha256);
  return [...previous];
}

export function beforeProgramBatch7AcceptanceSource(path:string,current:string):string;
export function beforeProgramBatch7AcceptanceSource(path:string,current:undefined):string|undefined;
export function beforeProgramBatch7AcceptanceSource(path:string,current:string|undefined):string|undefined;
export function beforeProgramBatch7AcceptanceSource(path:string,current:string|undefined):string|undefined{
  current=before8Source(path,current);
  const row=migration.files.find(r=>r.path===path);if(!row)return current;
  const hash=(value:string)=>createHash("sha256").update(value).digest("hex");
  const pins=read("tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json");
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

/** Validate every exact authority row and fresh binding against the frozen
 * current epoch, including accepted cases deliberately retired in this batch. */
export function topicQuestionAcceptance(questionVariantId:string):{accepted:boolean;live:boolean}{
  const historical=programBatch8HistoricalMembership(currentRelease,currentManifest,{questionVariantId});
  const authorized=[...epoch.before.accepted,...rows] as QuestionShipManifest["accepted"];
  const expectedRows=authorized.filter(r=>r.questionVariantId===questionVariantId);
  expect(historical.manifest.accepted.filter(r=>r.questionVariantId===questionVariantId)).toEqual(expectedRows);
  const expected=epoch.after.bindings.filter((r:string[])=>r[2]===questionVariantId&&expectedRows.some(a=>a.caseId===r[0]&&a.nodeId===r[1]));
  const actual=historical.release.cases.flatMap(cs=>cs.decisionNodes.filter(n=>n.questionVariantId===questionVariantId)
    .map(n=>[cs.id,n.id,n.questionVariantId,n.primaryConceptId]));
  expect(actual.sort(),questionVariantId+" exact fresh bindings").toEqual(expected.sort());
  for(const binding of expected){const cs=historical.release.cases.find(c=>c.id===binding[0])!;expect(digest(cs),cs.id+" exact frozen accepted context").toBe(epoch.after.caseHashes[cs.id]);}
  return {accepted:expectedRows.length>0,live:expected.length>0};
}
export function topicCaseIsExplicitlyLive(caseId:string):boolean{
  const historical=programBatch8HistoricalMembership(currentRelease,currentManifest,{caseId});
  const expected=Object.hasOwn(epoch.after.caseHashes,caseId);
  expect(historical.release.cases.some(c=>c.id===caseId),caseId).toBe(expected);
  const rowsForCase=historical.manifest.accepted.filter(r=>r.caseId===caseId);
  for(const row of rowsForCase)topicQuestionAcceptance(row.questionVariantId);
  return expected;
}
