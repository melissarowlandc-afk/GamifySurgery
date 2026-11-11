import {beforeN4AcceptanceRelease,beforeN4AcceptanceManifest,beforeN4AcceptanceTimings,beforeN4AcceptanceSource} from "./question-n4-acceptance-test-support";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS as rows,QUESTION_HARDEN1_N3R4_ACCEPTED_CASES as cases,
 QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES as timings} from "./question-harden1-n3r4-accepted-20261110";
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json");
const expansion=read("tools/question-quality/fixtures/question-harden1-n3r4-source-expansion-20261110.json") as {files:Array<{path:string;beforeSha256:string}>};
const migration=read("tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json") as {files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>};
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
/** Test epoch only. Every accepted delta is pinned before restoring history. */
export function beforeHarden1N3r4AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 release=beforeN4AcceptanceRelease(release);
 if(digest(release)===before.default.sha256)return release;
 if(!release.cases.some(cs=>cs.decisionNodes.some(n=>rows.some(r=>r.questionVariantId===n.questionVariantId))))return release;
 for(const cs of cases)expect(release.cases.find(c=>c.id===cs.id),"exact accepted harden1/N3R4 case").toEqual(cs);
 const oldConceptIds=new Set<string>(before.default.conceptIds);
 const added=release.concepts.filter(c=>!oldConceptIds.has(c.id));
 expect(added.map(c=>c.id)).toEqual(["concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2","concept.n3.delayed-regurgitation-proximal-anatomic-study"]);
 for(const co of release.concepts.filter(c=>oldConceptIds.has(c.id)))expect(digest(co),co.id).toBe(before.default.conceptHashes[co.id]);
 const restored={...release,concepts:release.concepts.filter(c=>oldConceptIds.has(c.id)),
  cases:release.cases.filter(c=>!cases.slice(1).some(n=>n.id===c.id)).map(c=>c.id===cases[0]!.id?before.oldCase:c)};
 expect(restored.cases.map(c=>c.id)).toEqual(before.default.caseIds);expect(restored.concepts.map(c=>c.id)).toEqual(before.default.conceptIds);
 expect(digest(restored),"only three exact accepted case deltas and two registry additions").toBe(before.default.sha256);
 return restored;
}
export function beforeHarden1N3r4AcceptanceManifest(manifest:QuestionShipManifest):QuestionShipManifest&{id:string;clinicalApproval:false} {
 manifest=beforeN4AcceptanceManifest(manifest);
 if(digest(manifest)===before.manifestSha256)return manifest as ReturnType<typeof beforeHarden1N3r4AcceptanceManifest>;
 if(!manifest.accepted.some(a=>a.acceptanceId==="H1-03"))return manifest as ReturnType<typeof beforeHarden1N3r4AcceptanceManifest>;
 const expected={...before.manifest,id:"question-ship.2026-11-10.v8",accepted:[...before.manifest.accepted,...rows],
  replacements:[{replaces:before.oldCase.id,with:rows[0]!.questionVariantId},...before.manifest.replacements],
  headerSources:{...Object.fromEntries(rows.map(r=>[r.caseId,r.sourceView])),...before.manifest.headerSources}};
 expect(manifest,"three PASS rows/headers and one replacement; all old authority exact").toEqual(expected);
 return structuredClone(before.manifest);
}
export function beforeHarden1N3r4AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
 actual=beforeN4AcceptanceTimings(actual);
 if(digest(actual)===digest(before.timing))return [...actual];
 if(!actual.some(t=>rows.some(r=>r.questionVariantId===t.questionVariantId)))return [...actual];
 expect(actual,"all2284 old timing tuples plus three exact accepted rows").toEqual([...before.timing,...timings]);
 return structuredClone(before.timing);
}
export function beforeHarden1N3r4AcceptanceSource(path:string,current:string):string {
 current=beforeN4AcceptanceSource(path,current);
 const row=migration.files.find(f=>f.path===path);if(!row)return current;
 const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
 const releasePins=read("tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json") as {paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string}>};
 const release=releasePins.paths.find(p=>p.path===path);
 if(release){expect(release.mainBeforeSha256).toBe(row.beforeSha256);expect(release.mainAfterSha256).toBe(row.afterSha256);}
 expect(sha(current),path+" exact authorized acceptance postimage").toBe(release?.requiredReleaseSha256??row.afterSha256);
 expect(sha(row.beforeText),path+" original source preimage").toBe(row.beforeSha256);
 expect(row.beforeSha256).toBe(before.files[path]??expansion.files.find(f=>f.path===path)?.beforeSha256);return row.beforeText;
}
