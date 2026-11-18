import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";

const read=(name:string)=>JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/"+name,import.meta.url),"utf8"));
const before=read("question-flags5-final-acceptance-before-20261116.json");
const after=read("question-flags5-final-acceptance-after-20261116.json");
const migration=read("question-flags5-final-acceptance-source-migration-20261116.json") as {files:Array<{path:string;beforeText:string;beforeSha256:string;afterSha256:string}>};
const earlierMigration=read("question-flags5-acceptance-source-migration-20261116.json") as typeof migration;
const saveCompatibilityMigration=read("question-flags5-save-compatibility-source-migration-20261116.json") as typeof migration;
const sourceDeltas=[...migration.files,...saveCompatibilityMigration.files];
const sha=(s:string|Buffer)=>createHash("sha256").update(s).digest("hex"),hash=(v:unknown)=>sha(JSON.stringify(v));
const releaseCache=new WeakMap<SyntheticClinicalRelease,SyntheticClinicalRelease>();
const manifestCache=new WeakMap<QuestionShipManifest,QuestionShipManifest>();

/** Exact inverse for the final seven owner-directed flag fixes batch 5.
 * No old capture, clinical version, assertion or timing budget is relaxed. */
export function beforeFlags5FinalAcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const actual=hash(release);
  if(actual===before.defaultSha256)return release;
  if(!release.cases.some(c=>c.decisionNodes.some(n=>after.acceptedQuestionIds.includes(n.questionVariantId))))return release;
  expect(actual,"complete final flags5 release postimage").toBe(after.defaultSha256);
  let prior=releaseCache.get(release);
  if(!prior){prior=structuredClone(before.defaultRelease) as SyntheticClinicalRelease;releaseCache.set(release,prior);}
  expect(hash(prior),"immutable sixteen-PASS release preimage").toBe(before.defaultSha256);
  return prior;
}
export function beforeFlags5FinalAcceptanceManifest<T extends QuestionShipManifest>(manifest:T):T {
  const actual=hash(manifest);
  if(actual===before.manifestSha256)return manifest;
  if(!manifest.accepted.some(r=>after.acceptedQuestionIds.includes(r.questionVariantId)))return manifest;
  expect(actual,"complete final flags5 authority postimage").toBe(after.manifestSha256);
  let prior=manifestCache.get(manifest);
  if(!prior){prior=structuredClone(before.manifest) as QuestionShipManifest;manifestCache.set(manifest,prior);}
  expect(hash(prior),"immutable sixteen-PASS authority preimage").toBe(before.manifestSha256);
  return prior as T;
}
export function beforeFlags5FinalAcceptanceTimings(entries:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
  if(!entries.some(t=>after.acceptedQuestionIds.includes(t.questionVariantId)))return [...entries];
  expect(hash(entries),"complete final flags5 wait postimage").toBe(after.timingSha256);
  expect(hash(before.timing),"immutable sixteen-PASS wait preimage").toBe(before.timingSha256);
  return structuredClone(before.timing);
}
export function beforeFlags5FinalAcceptanceCases(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[] {
  return cases.map(c=>{
    if(!c.decisionNodes.some(n=>after.acceptedQuestionIds.includes(n.questionVariantId)))return c;
    expect(hash(c),c.id+" exact final accepted case").toBe(after.caseHashes[c.id]);
    const prior=before.defaultRelease.cases.find((x:SyntheticClinicalCase)=>x.id===c.id)!;
    expect(hash(prior),c.id+" immutable preimage").toBe(before.caseHashes[c.id]);
    return structuredClone(prior);
  });
}
export function beforeFlags5FinalAcceptanceConcepts(concepts:SyntheticClinicalRelease["concepts"]):SyntheticClinicalRelease["concepts"] {
  if(!concepts.some(c=>after.newConceptIds.includes(c.id)))return concepts;
  for(const id of after.newConceptIds){const found=concepts.filter(c=>c.id===id);expect(found).toHaveLength(1);expect(hash(found[0])).toBe(after.conceptHashes[id]);}
  return concepts.filter(c=>!after.newConceptIds.includes(c.id));
}
export function beforeFlags5FinalAcceptanceSource(path:string,current:string):string {
  const row=sourceDeltas.find(f=>f.path===path);
  if(!row||sha(current)===row.beforeSha256)return current;
  // Some historical guards already normalized the prior sixteen-PASS stage.
  // Accept only its immutable exact preimage, never an arbitrary older value.
  const prior=earlierMigration.files.find(f=>f.path===path&&f.afterSha256===row.beforeSha256&&f.beforeSha256===sha(current));
  if(prior){expect(sha(prior.beforeText),path+" immutable earlier-stage source preimage").toBe(prior.beforeSha256);return current;}
  expect(sha(current),path+" exact owner-directed flag fixes batch 5 final postimage").toBe(row.afterSha256);
  expect(sha(row.beforeText),path+" immutable source preimage").toBe(row.beforeSha256);
  return row.beforeText;
}
export function beforeFlags5FinalAcceptanceSourceBytes(value:string):string;
export function beforeFlags5FinalAcceptanceSourceBytes(value:Buffer):Buffer;
export function beforeFlags5FinalAcceptanceSourceBytes(value:string|Buffer):string|Buffer {
  const row=sourceDeltas.find(f=>f.afterSha256===sha(value));
  if(!row)return value;
  expect(sha(row.beforeText),row.path+" immutable source bytes").toBe(row.beforeSha256);
  return Buffer.isBuffer(value)?Buffer.from(row.beforeText):row.beforeText;
}
