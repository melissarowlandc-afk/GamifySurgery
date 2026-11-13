import {beforeProgramBatch10AcceptanceRelease,beforeProgramBatch10AcceptanceManifest,beforeProgramBatch10AcceptanceTimings,beforeProgramBatch10AcceptanceSource,beforeProgramBatch10AcceptanceSourceBytes,beforeProgramBatch10AcceptanceCases,beforeProgramBatch10AcceptanceConcepts} from "./question-program-batch10-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-intraop-acceptance-batch9-before-20261112.json");
const after=read("tools/question-quality/fixtures/question-intraop-acceptance-batch9-after-20261112.json");
const migration=read("tools/question-quality/fixtures/question-intraop-acceptance-batch9-source-migration-20261112.json") as {
  files:Array<{path:string;beforeText:string;beforeSha256:string;afterSha256:string}>;
};
const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
const digest=(v:unknown)=>sha(JSON.stringify(v));

/** Strict full postimage -> immutable prior epoch, never an allowlist bypass.
 * The independent batch9 tests exercise the actual current default instead. */
export function beforeProgramBatch9AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  release=beforeProgramBatch10AcceptanceRelease(release);
  if(digest(release)===before.defaultSha256)return release;
  expect(digest(release),"complete exact batch9 release postimage").toBe(after.defaultSha256);
  expect(digest(before.defaultRelease),"immutable batch9 release preimage").toBe(before.defaultSha256);
  return structuredClone(before.defaultRelease);
}
export function beforeProgramBatch9AcceptanceManifest<T extends QuestionShipManifest>(manifest:T):T {
  manifest=beforeProgramBatch10AcceptanceManifest(manifest);
  if(digest(manifest)===before.manifestSha256)return manifest;
  expect(digest(manifest),"complete exact batch9 authority postimage").toBe(after.manifestSha256);
  expect(digest(before.manifest),"immutable batch9 authority preimage").toBe(before.manifestSha256);
  return structuredClone(before.manifest) as T;
}
export function beforeProgramBatch9AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
  actual=beforeProgramBatch10AcceptanceTimings(actual);
  if(!actual.some(t=>after.newQuestionIds.includes(t.questionVariantId)))return [...actual];
  expect(digest(actual),"complete exact batch9 timing postimage").toBe(after.timingSha256);
  expect(digest(before.timing),"immutable batch9 timing preimage").toBe(before.timingSha256);
  return structuredClone(before.timing);
}
const interimBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-intraop-batch9-interim-test-delta-20261113.json",import.meta.url));
expect(sha(interimBytes.toString("utf8"))).toBe("447db221597bfb328a785387ffd274117819dd883a236cd56bac06389154891f");
const interim=JSON.parse(interimBytes.toString("utf8"));
function beforeInterimTest(value:string):string{
  if(sha(value)!==interim.afterSha256)return value;
  expect(sha(interim.afterText)).toBe(interim.afterSha256);expect(value).toBe(interim.afterText);
  expect(sha(interim.beforeText)).toBe(interim.beforeSha256);return interim.beforeText;
}

export function beforeProgramBatch9AcceptanceSource(path:string,current:string):string;
export function beforeProgramBatch9AcceptanceSource(path:string,current:undefined):string|undefined;
export function beforeProgramBatch9AcceptanceSource(path:string,current:string|undefined):string|undefined;
export function beforeProgramBatch9AcceptanceSource(path:string,current:string|undefined):string|undefined {
  current=current===undefined?beforeProgramBatch10AcceptanceSource(path,current):beforeProgramBatch10AcceptanceSourceBytes(current);
  if(current!==undefined)current=beforeInterimTest(current);
  const row=migration.files.find(r=>r.path===path);if(!row)return current;
  const pins=read("tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json");
  const pin=pins.paths.find((p:{path:string})=>p.path===path);
  expect(pin,path+" exact release delta").toBeDefined();
  expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
  if(current===undefined){
    expect(pin.requiredReleaseSha256).toBeNull();expect(existsSync(new URL("../../../"+path,import.meta.url))).toBe(false);
    const repaired=read(pins.repairedTopicTestArchivePath).records.find((r:{path:string})=>r.path===path);
    expect(repaired.sha256).toBe(row.afterSha256);expect(sha(repaired.sourceText)).toBe(row.afterSha256);
  }else if(sha(current)===row.beforeSha256)return current;
  else expect([row.afterSha256,pin.requiredReleaseSha256],path+" exact authoring/release postimage").toContain(sha(current));
  expect(sha(row.beforeText),path+" immutable captured preimage").toBe(row.beforeSha256);
  return row.beforeText;
}

export function beforeProgramBatch9AcceptanceSourceBytes(value:string):string;
export function beforeProgramBatch9AcceptanceSourceBytes(value:Buffer):Buffer;
export function beforeProgramBatch9AcceptanceSourceBytes(value:string|Buffer):string|Buffer {
  value=Buffer.isBuffer(value)?beforeProgramBatch10AcceptanceSourceBytes(value):beforeProgramBatch10AcceptanceSourceBytes(value);
  value=Buffer.isBuffer(value)?Buffer.from(beforeInterimTest(value.toString("utf8"))):beforeInterimTest(value);
  const hash=createHash("sha256").update(value).digest("hex");
  const pins=read("tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json");
  const row=migration.files.find(r=>r.afterSha256===hash||pins.paths.some((p:{path:string;requiredReleaseSha256:string|null})=>p.path===r.path&&p.requiredReleaseSha256===hash));
  if(!row)return value;
  expect(sha(row.beforeText),row.path+" exact captured pre-batch9 bytes").toBe(row.beforeSha256);
  return Buffer.isBuffer(value)?Buffer.from(row.beforeText):row.beforeText;
}

/** A pilot catalog contains the current default plus retained older cases.
 * For an old draft-exclusion assertion, verify each exact new accepted case
 * before removing it; every other draft and every old guard remains visible. */
export function beforeProgramBatch9AcceptanceCases(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[] {
  cases=beforeProgramBatch10AcceptanceCases(cases);
  const ids=new Set<string>(after.newCaseIds);
  for(const id of ids){const actual=cases.filter(c=>c.id===id);expect(actual,id+" exact appended case cardinality").toHaveLength(1);
    expect(digest(actual[0]),id+" exact batch9 case bytes").toBe(after.caseHashes[id]);}
  return cases.filter(c=>!ids.has(c.id));
}
export function beforeProgramBatch9AcceptanceConcepts(concepts:SyntheticClinicalRelease["concepts"]):SyntheticClinicalRelease["concepts"] {
  concepts=beforeProgramBatch10AcceptanceConcepts(concepts);
  const oldIds=new Set(before.defaultRelease.concepts.map((c:{id:string})=>c.id));
  const ids=new Set<string>(after.newConceptIds);
  for(const id of ids){expect(oldIds.has(id)).toBe(false);const actual=concepts.filter(c=>c.id===id);expect(actual).toHaveLength(1);
    expect(digest(actual[0]),id+" exact batch9 concept bytes").toBe(after.conceptHashes[id]);}
  return concepts.filter(c=>!ids.has(c.id));
}
