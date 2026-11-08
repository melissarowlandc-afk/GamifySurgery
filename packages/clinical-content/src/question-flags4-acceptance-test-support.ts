import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest,QuestionShipAcceptance} from "./question-ship-manifest";
import {QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE as source,QUESTION_FLAGS4_ACCEPTED_REVISIONS as revisions,
 QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES as timings} from "./question-flags4-accepted-20261108";

const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-flags4-acceptance-before-20261108.json") as {
 default:{sha256:string;caseIds:string[];conceptIds:string[];conceptHashes:Record<string,string>};
 manifest:QuestionShipManifest&{id:string;clinicalApproval:false};retainedInput:SyntheticClinicalRelease;
 timing:AnswerChoiceTimingRegistryEntry[];files:Record<string,string>;
};
const migration=read("tools/question-quality/fixtures/question-flags4-acceptance-source-migration-20261108.json") as {
 files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>;
};
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const rows:QuestionShipAcceptance[]=revisions.map(r=>({acceptanceId:r.auditId,caseId:r.caseId,nodeId:r.nodeId,
 questionVariantId:r.questionVariantId,conceptId:r.question.conceptId,sourceView:"flags4-accepted",decision:"docs/research/question-flags4-manager-decision-20261108.md"}));

/** Historical test epoch only. Pin the exact one-case acceptance before
 * restoring the prior state. Never called by gameplay, admission or saves. */
export function beforeFlags4AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 if(digest(release)===before.default.sha256)return release;
 // Older guards may already hold a pre-stats1/pre-flags3 epoch. Their own
 // immutable hash assertions remain responsible for those historical inputs.
 if(!release.cases.some(cs=>cs.decisionNodes.some(n=>n.questionVariantId===revisions[0]!.questionVariantId)))return release;
 expect(release.cases.map(c=>c.id),"flags4 preserves all cases and their order").toEqual(before.default.caseIds);
 expect(release.concepts.map(c=>c.id),"flags4 preserves all606 meanings and order").toEqual(before.default.conceptIds);
 for(const concept of release.concepts)expect(digest(concept),concept.id).toBe(before.default.conceptHashes[concept.id]);
 expect(release.cases.find(c=>c.id===source.cases[0]!.id),"exact accepted flags4 source case").toEqual(source.cases[0]);
 const old=before.retainedInput.cases[0]!;
 const restored={...release,cases:release.cases.map(cs=>cs.id===old.id?old:cs)};
 expect(digest(restored),"only the accepted flags4 case changed; every other default byte remains exact").toBe(before.default.sha256);
 return restored;
}
export function beforeFlags4AcceptanceManifest(manifest:QuestionShipManifest):typeof before.manifest {
 if(digest(manifest)===digest(before.manifest))return manifest as typeof before.manifest;
 if(!manifest.accepted.some(r=>r.sourceView==="flags4-accepted"))return manifest as typeof before.manifest;
 const expected={...before.manifest,id:"question-ship.2026-11-08.v7",accepted:[...before.manifest.accepted,...rows],
  headerSources:{[source.cases[0]!.id]:"flags4-accepted",...before.manifest.headerSources}};
 expect(manifest,"one flags4 row/header only; all133 earlier rows, legacy bindings and relations stay exact").toEqual(expected);
 return structuredClone(before.manifest);
}
export function beforeFlags4AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
 if(digest(actual)===digest(before.timing))return [...actual];
 if(!actual.some(t=>t.questionVariantId===revisions[0]!.questionVariantId))return [...actual];
 expect(actual,"all2283 previous rows remain in order; append only one accepted no-test identity").toEqual([...before.timing,...timings]);
 return structuredClone(before.timing);
}
export function beforeFlags4AcceptanceSource(path:string,current:string):string {
 const row=migration.files.find(r=>r.path===path);if(!row)return current;
 const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
 expect(sha(current),path+" exact authorized flags4 acceptance bytes").toBe(row.afterSha256);
 expect(sha(row.beforeText),path+" exact pre-acceptance source").toBe(row.beforeSha256);
 expect(row.beforeSha256,path+" immutable intake digest").toBe(before.files[path]);
 return row.beforeText;
}
