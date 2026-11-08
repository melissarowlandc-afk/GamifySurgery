import {beforeFlags4AcceptanceRelease,beforeFlags4AcceptanceManifest,beforeFlags4AcceptanceTimings,beforeFlags4AcceptanceSource} from "./question-flags4-acceptance-test-support";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest,QuestionShipAcceptance} from "./question-ship-manifest";
import {QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE as source,QUESTION_STATS1_ACCEPTED_REVISIONS as revisions,
 QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES as timings} from "./question-stats1-accepted-20261108";

const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json") as {
 default:{sha256:string;caseIds:string[];conceptIds:string[];conceptHashes:Record<string,string>};
 manifest:QuestionShipManifest&{id:string;clinicalApproval:false};retainedInput:SyntheticClinicalRelease;
 timing:AnswerChoiceTimingRegistryEntry[];files:Record<string,string>;
};
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const retiredIds=new Set(["G06","F3-01"]);
const migration=read("tools/question-quality/fixtures/question-stats1-acceptance-source-migration-20261108.json") as {
 files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>;
};
const rows:QuestionShipAcceptance[]=revisions.map(r=>({acceptanceId:r.auditId,caseId:r.caseId,nodeId:r.nodeId,
 questionVariantId:r.questionVariantId,conceptId:r.question.conceptId,sourceView:"stats1-accepted",
 decision:"docs/research/question-stats1-manager-decision-20261108.md"}));

/** Historical test epoch only. Verify the complete exact new delta before
 * restoring the old epoch. No runtime admission, save or replay calls this. */
export function beforeStats1AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 release=beforeFlags4AcceptanceRelease(release);
 if(digest(release)===before.default.sha256)return release;
 if(!release.cases.some(cs=>source.cases.some(s=>s.id===cs.id&&s.decisionNodes[0]!.questionVariantId===cs.decisionNodes[0]?.questionVariantId)))return release;
 expect(release.cases.map(cs=>cs.id),"stats1 adds/removes no live case or ordering").toEqual(before.default.caseIds);
 expect(release.concepts.map(c=>c.id),"all606 old meanings and registry order remain").toEqual(before.default.conceptIds);
 for(const concept of release.concepts)expect(digest(concept),concept.id).toBe(before.default.conceptHashes[concept.id]);
 for(const cs of source.cases)expect(release.cases.find(c=>c.id===cs.id),cs.id+" exact accepted statistics case").toEqual(cs);
 const old=new Map(before.retainedInput.cases.map(cs=>[cs.id,cs]));
 const restored={...release,cases:release.cases.map(cs=>old.get(cs.id)??cs)};
 expect(digest(restored),"only the64 directed statistics cases changed; every other release byte is exact").toBe(before.default.sha256);
 return restored;
}
export function beforeStats1AcceptanceManifest(manifest:QuestionShipManifest):typeof before.manifest {
 manifest=beforeFlags4AcceptanceManifest(manifest);
 if(!manifest.accepted.some(r=>r.sourceView==="stats1-accepted"))return manifest as typeof before.manifest;
 const expected={...before.manifest,id:"question-ship.2026-11-08.v6",
  accepted:[...before.manifest.accepted.filter(r=>!retiredIds.has(r.acceptanceId)),...rows],
  headerSources:{...before.manifest.headerSources,...Object.fromEntries(source.cases.map(cs=>[cs.id,"stats1-accepted"]))}};
 expect(manifest,"only64 stats1 tuples/headers supersede G06/F3-01; all other rows and relations exact").toEqual(expected);
 return structuredClone(before.manifest);
}
export function beforeStats1AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
 actual=beforeFlags4AcceptanceTimings(actual);
 if(!actual.some(t=>timings.some(row=>row.questionVariantId===t.questionVariantId)))return [...actual];
 expect(actual,"all2219 old exact rows remain in order; append only64 accepted no-test rows").toEqual([...before.timing,...timings]);
 return structuredClone(before.timing);
}
/** Earlier accepted-view timing exports filter against current rows. The
 * superseded bindings remain archived, and historical tests must see exactly
 * their original per-view subset as well as the full preserved registry. */
export function beforeStats1PriorAcceptedTimings(actual:readonly AnswerChoiceTimingRegistryEntry[],sourceView:string):AnswerChoiceTimingRegistryEntry[] {
 const priorRows=before.manifest.accepted.filter(r=>r.sourceView===sourceView);
 const old=before.timing.filter(t=>priorRows.some(r=>r.caseId===t.caseId&&r.nodeId===t.nodeId&&r.questionVariantId===t.questionVariantId));
 const current=old.filter(t=>!priorRows.some(r=>retiredIds.has(r.acceptanceId)&&r.questionVariantId===t.questionVariantId));
 if(digest(actual)===digest(old))return [...actual];
 expect(actual,sourceView+" current timing export differs only by superseded historical rows").toEqual(current);
 return structuredClone(old);
}
export function beforeStats1AcceptanceSource(path:string,current:string):string {
 current=beforeFlags4AcceptanceSource(path,current);
 const row=migration.files.find(r=>r.path===path);if(!row)return current;
 const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
 expect(sha(current),path+" exact stats1 acceptance integration bytes").toBe(row.afterSha256);
 expect(sha(row.beforeText),path+" exact retained pre-acceptance source").toBe(row.beforeSha256);
 expect(row.beforeSha256,path+" immutable intake digest").toBe(before.files[path]);
 return row.beforeText;
}
