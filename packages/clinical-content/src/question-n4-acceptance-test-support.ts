import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {QUESTION_N4_ACCEPTED_CASES as cases,QUESTION_N4_ACCEPTED_ROWS as rows,QUESTION_N4_ACCEPTED_TIMING_ENTRIES as estimates} from "./question-n4-accepted-20261110";
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-n4-acceptance-before-20261110.json");
const migration=read("tools/question-quality/fixtures/question-n4-acceptance-source-migration-20261110.json") as {files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>};
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
/** Test-only epoch reconstruction. Prove the exact whole delta first. */
export function beforeN4AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
 if(digest(release)===before.default.sha256)return release;
 if(!release.cases.some(c=>rows.some(r=>r.caseId===c.id)))return release;
 for(const cs of cases)expect(release.cases.find(c=>c.id===cs.id),cs.id+" exact N4 PASS case").toEqual(cs);
 const priorIds=new Set<string>(before.default.conceptIds);
 expect(release.concepts.filter(c=>!priorIds.has(c.id)).map(c=>c.id)).toEqual([
  "concept.n4r2.mesh-material-and-contact-compartment","concept.n4r2.cholangiogram-quality-before-duct-treatment"]);
 for(const co of release.concepts.filter(c=>priorIds.has(c.id)))expect(digest(co),co.id).toBe(before.default.conceptHashes[co.id]);
 const old={...release,cases:release.cases.filter(c=>!rows.some(r=>r.caseId===c.id)),concepts:release.concepts.filter(c=>priorIds.has(c.id))};
 expect(old.cases.map(c=>c.id)).toEqual(before.default.caseIds);expect(old.concepts.map(c=>c.id)).toEqual(before.default.conceptIds);
 expect(digest(old),"only eight exact cases and two registered meanings changed").toBe(before.default.sha256);return old;
}
export function beforeN4AcceptanceManifest(manifest:QuestionShipManifest):QuestionShipManifest&{id:string;clinicalApproval:false}{
 if(!manifest.accepted.some(r=>r.sourceView==="n4-round1"||r.sourceView==="n4-round2"))return manifest as ReturnType<typeof beforeN4AcceptanceManifest>;
 expect(manifest).toEqual({...before.manifest,id:"question-ship.2026-11-10.v9",accepted:[...before.manifest.accepted,...rows],
  headerSources:{...Object.fromEntries(rows.map(r=>[r.caseId,r.sourceView])),...before.manifest.headerSources}});
 return structuredClone(before.manifest);
}
export function beforeN4AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[]{
 if(!actual.some(t=>rows.some(r=>r.questionVariantId===t.questionVariantId)))return [...actual];
 expect(actual,"all2287 old rows plus eight exact N4 PASS classifications").toEqual([...before.timing,...estimates]);return structuredClone(before.timing);
}
export function beforeN4AcceptanceSource(path:string,current:string):string{
 const row=migration.files.find(r=>r.path===path);if(!row)return current;
 const hash=(s:string)=>createHash("sha256").update(s).digest("hex");
 const releasePins=read("tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json") as {paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string|null}>};
 const release=releasePins.paths.find(p=>p.path===path);
 if(release){expect(release.mainBeforeSha256).toBe(row.beforeSha256);expect(release.mainAfterSha256).toBe(row.afterSha256);}
 expect(hash(current),path+" N4 authorized exact postimage").toBe(release?.requiredReleaseSha256??row.afterSha256);
 expect(hash(row.beforeText)).toBe(row.beforeSha256);
 expect(row.beforeSha256).toBe(before.sourcePreimages.find((f:{path:string})=>f.path===path).beforeSha256);return row.beforeText;
}
