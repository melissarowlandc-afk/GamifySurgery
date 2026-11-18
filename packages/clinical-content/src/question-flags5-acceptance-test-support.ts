// FINAL FLAGS5 ACCEPTANCE GUARD — exact append-only inverse, no relaxed captures.
import {beforeFlags5FinalAcceptanceRelease,beforeFlags5FinalAcceptanceManifest,beforeFlags5FinalAcceptanceTimings,beforeFlags5FinalAcceptanceCases,beforeFlags5FinalAcceptanceConcepts,beforeFlags5FinalAcceptanceSource,beforeFlags5FinalAcceptanceSourceBytes} from "./question-flags5-final-acceptance-test-support";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, SyntheticClinicalCase, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/"+path,import.meta.url),"utf8"));
const before=read("question-flags5-acceptance-before-20261116.json");
const after=read("question-flags5-acceptance-after-20261116.json");
const migration=read("question-flags5-acceptance-source-migration-20261116.json") as {reason:string;files:Array<{path:string;beforeText:string;beforeSha256:string;afterSha256:string}>};
const sha=(v:string|Buffer)=>createHash("sha256").update(v).digest("hex"),digest=(v:unknown)=>sha(JSON.stringify(v));
const releasePreimages=new WeakMap<SyntheticClinicalRelease,SyntheticClinicalRelease>();
const manifestPreimages=new WeakMap<QuestionShipManifest,QuestionShipManifest>();

/** Exact inverse for owner-directed flag fixes batch 5. Historical captures and
 * budgets remain immutable; unrelated mutations still fail their original pins. */
export function beforeFlags5AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  release=beforeFlags5FinalAcceptanceRelease(release);
  const currentHash=digest(release);
  if(currentHash===before.defaultSha256)return release;
  // Older authoring epochs remain subject to their own exact guards.
  if(!release.cases.some(c=>c.decisionNodes.some(n=>after.acceptedQuestionIds.includes(n.questionVariantId))))return release;
  expect(currentHash,"flags5 complete release postimage").toBe(after.defaultSha256);
  let prior=releasePreimages.get(release);
  if(!prior){prior=structuredClone(before.defaultRelease) as SyntheticClinicalRelease;releasePreimages.set(release,prior);}
  // Recheck both sides even on cache hits: mutation is never authorized by identity.
  expect(digest(prior),"flags5 immutable release preimage").toBe(before.defaultSha256);
  return prior;
}
export function beforeFlags5AcceptanceManifest<T extends QuestionShipManifest>(manifest:T):T {
  manifest=beforeFlags5FinalAcceptanceManifest(manifest);
  const currentHash=digest(manifest);
  if(currentHash===before.manifestSha256)return manifest;
  if(!manifest.accepted.some(r=>after.acceptedQuestionIds.includes(r.questionVariantId)))return manifest;
  expect(currentHash,"flags5 complete authority postimage").toBe(after.manifestSha256);
  let prior=manifestPreimages.get(manifest);
  if(!prior){prior=structuredClone(before.manifest) as QuestionShipManifest;manifestPreimages.set(manifest,prior);}
  expect(digest(prior),"flags5 immutable authority preimage").toBe(before.manifestSha256);
  return prior as T;
}
export function beforeFlags5AcceptanceTimings(entries:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
  entries=beforeFlags5FinalAcceptanceTimings(entries);
  if(!entries.some(t=>after.acceptedQuestionIds.includes(t.questionVariantId)))return [...entries];
  expect(digest(entries),"flags5 complete timing postimage").toBe(after.timingSha256);
  expect(digest(before.timing),"flags5 immutable timing preimage").toBe(before.timingSha256);
  return structuredClone(before.timing);
}
export function beforeFlags5AcceptanceSource(path:string,current:string):string {
  current=beforeFlags5FinalAcceptanceSource(path,current);
  const row=migration.files.find(f=>f.path===path);
  if(!row||sha(current)===row.beforeSha256)return current;
  expect(sha(current),path+" exact owner-directed flag fixes batch 5 postimage").toBe(row.afterSha256);
  expect(sha(row.beforeText),path+" immutable preimage").toBe(row.beforeSha256);
  return row.beforeText;
}
export function beforeFlags5AcceptanceSourceBytes(v:string):string;
export function beforeFlags5AcceptanceSourceBytes(v:Buffer):Buffer;
export function beforeFlags5AcceptanceSourceBytes(v:string|Buffer):string|Buffer {
  v=Buffer.isBuffer(v)?beforeFlags5FinalAcceptanceSourceBytes(v):beforeFlags5FinalAcceptanceSourceBytes(v);
  const row=migration.files.find(f=>f.afterSha256===sha(v));
  if(!row)return v;
  expect(sha(row.beforeText),row.path+" immutable source preimage").toBe(row.beforeSha256);
  return Buffer.isBuffer(v)?Buffer.from(row.beforeText):row.beforeText;
}
export function beforeFlags5AcceptanceCases(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[] {
  cases=beforeFlags5FinalAcceptanceCases(cases);
  return cases.map(c=>{
    if(!after.caseHashes[c.id]||digest(c)===before.caseHashes[c.id])return c;
    expect(digest(c),c.id+" exact accepted case postimage").toBe(after.caseHashes[c.id]);
    const old=before.defaultRelease.cases.find((row:SyntheticClinicalCase)=>row.id===c.id)!;
    expect(digest(old),c.id+" immutable case preimage").toBe(before.caseHashes[c.id]);
    return structuredClone(old);
  });
}
export function beforeFlags5AcceptanceConcepts(concepts:SyntheticClinicalRelease["concepts"]):SyntheticClinicalRelease["concepts"] {
  concepts=beforeFlags5FinalAcceptanceConcepts(concepts);
  if(!concepts.some(c=>after.newConceptIds.includes(c.id)))return concepts;
  for(const id of after.newConceptIds){const cs=concepts.filter(c=>c.id===id);expect(cs).toHaveLength(1);expect(digest(cs[0])).toBe(after.conceptHashes[id]);}
  return concepts.filter(c=>!after.newConceptIds.includes(c.id));
}
