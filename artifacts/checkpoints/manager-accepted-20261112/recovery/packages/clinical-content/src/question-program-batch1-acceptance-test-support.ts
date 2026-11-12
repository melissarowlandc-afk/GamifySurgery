import {beforeProgramBatch2AcceptanceRelease,beforeProgramBatch2AcceptanceManifest,beforeProgramBatch2AcceptanceTimings,beforeProgramBatch2AcceptanceSource} from "./question-program-batch2-acceptance-test-support";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {QUESTION_PROGRAM_BATCH1_ACCEPTED_CASES as cases,QUESTION_PROGRAM_BATCH1_ACCEPTED_ROWS as rows,
 QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES as timing,QUESTION_PROGRAM_BATCH1_RETAINED_CASES as retired,
 QUESTION_PROGRAM_BATCH1_REPLACEMENTS as relations} from "./question-program-batch1-accepted-20261111";
const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json");
const migration=read("tools/question-quality/fixtures/question-topic-acceptance-batch1-source-migration-20261111.json") as {files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>};
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
export function beforeProgramBatch1AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
 release=beforeProgramBatch2AcceptanceRelease(release);
 if(digest(release)===before.default.sha256)return release;
 if(!release.cases.some(c=>cases.some(a=>a.id===c.id)))return release;
 for(const cs of cases)expect(release.cases.find(c=>c.id===cs.id),"exact accepted topic case "+cs.id).toEqual(cs);
 for(const cs of retired)expect(release.cases.some(c=>c.id===cs.id),"retired fresh case "+cs.id).toBe(false);
 const oldIds=new Set<string>(before.default.conceptIds),current=new Map(release.cases.map(c=>[c.id,c]));
 for(const cs of retired)current.set(cs.id,cs);
 const restored={...release,cases:before.default.caseIds.map((id:string)=>current.get(id)!),concepts:release.concepts.filter(c=>oldIds.has(c.id))};
 expect(restored.cases.every((c:SyntheticClinicalRelease["cases"][number])=>!!c)).toBe(true);
 for(const co of restored.concepts)expect(digest(co),co.id).toBe(before.default.conceptHashes[co.id]);
 expect(restored.concepts.map(c=>c.id)).toEqual(before.default.conceptIds);
 expect(release.concepts.filter(c=>!oldIds.has(c.id)).map(c=>c.id)).toEqual([...new Set(rows.map(r=>r.conceptId))].filter(id=>!oldIds.has(id)));
 expect(release.cases.length).toBe(before.default.caseIds.length-retired.length+cases.length);
 expect(digest(restored),"only exact accepted additions/replacements/meanings changed").toBe(before.default.sha256);return restored;
}
export function beforeProgramBatch1AcceptanceManifest(manifest:QuestionShipManifest):QuestionShipManifest&{id:string;clinicalApproval:false}{
 manifest=beforeProgramBatch2AcceptanceManifest(manifest);
 if(!manifest.accepted.some(r=>r.sourceView.startsWith("topic-batch1-")))return manifest as ReturnType<typeof beforeProgramBatch1AcceptanceManifest>;
 expect(manifest).toEqual({...before.manifest,id:"question-ship.2026-11-11.v10",accepted:[...before.manifest.accepted,...rows],replacements:[...relations,...before.manifest.replacements],
  headerSources:{...Object.fromEntries(rows.map(r=>[r.caseId,r.sourceView])),...before.manifest.headerSources}});
 return structuredClone(before.manifest);
}
export function beforeProgramBatch1AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[]{
 actual=beforeProgramBatch2AcceptanceTimings(actual);
 if(!actual.some(t=>rows.some(r=>r.questionVariantId===t.questionVariantId)))return [...actual];
 expect(actual).toEqual([...before.timing,...timing]);return structuredClone(before.timing);
}
export function beforeProgramBatch1AcceptanceSource(path:string,current:string):string{
 current=beforeProgramBatch2AcceptanceSource(path,current);
 const row=migration.files.find(r=>r.path===path);if(!row)return current;
 const hash=(v:string)=>createHash("sha256").update(v).digest("hex");
 expect(hash(current),path+" exact program acceptance postimage").toBe(row.afterSha256);
 expect(hash(row.beforeText)).toBe(row.beforeSha256);
 expect(row.beforeSha256).toBe(before.sourcePreimages.find((f:{path:string})=>f.path===path).beforeSha256);return row.beforeText;
}
