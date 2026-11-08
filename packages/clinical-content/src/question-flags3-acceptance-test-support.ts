import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest, QuestionShipAcceptance} from "./question-ship-manifest";
import {QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE as source, QUESTION_FLAGS3_ACCEPTED_REVISIONS as revisions,
 QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES as timings} from "./question-flags3-accepted-20261107";

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-flags3-acceptance-before-20261107.json") as {
 default:{sha256:string;conceptIds:string[]};manifest:QuestionShipManifest&{id:string;clinicalApproval:false};
 retainedInput:SyntheticClinicalRelease;files:Record<string,string>;timing:AnswerChoiceTimingRegistryEntry[];
};
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const oldIds=new Set(["B2A02","B2A08"]);
const newRows:QuestionShipAcceptance[]=revisions.map(r=>({acceptanceId:r.auditId,caseId:r.caseId,nodeId:r.nodeId,
 questionVariantId:r.questionVariantId,conceptId:r.question.conceptId,sourceView:"flags3-accepted",
 decision:"docs/research/question-flags3-manager-decision-20261107.md"}));

/** Historical test epoch only: pin the complete exact accepted delta, then
 * restore the immutable prior epoch. Never used by runtime/save code. */
export function beforeFlags3AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 if(digest(release)===before.default.sha256)return release;
 for(const cs of source.cases)expect(release.cases.find(c=>c.id===cs.id),cs.id+" exact accepted case").toEqual(cs);
 const ids=new Set(before.default.conceptIds);
 expect(release.concepts.filter(c=>!ids.has(c.id)).map(c=>c.id)).toEqual(["concept.groin-hernia.ultrasound-compartment-classification.v1"]);
 const added=source.concepts.find(c=>c.id==="concept.groin-hernia.ultrasound-compartment-classification.v1")!;
 expect(release.concepts.find(c=>c.id===added.id)).toEqual(added);
 const oldCases=new Map(before.retainedInput.cases.map(cs=>[cs.id,cs]));
 const restored={...release,cases:release.cases.map(cs=>oldCases.get(cs.id)??cs),concepts:release.concepts.filter(c=>ids.has(c.id))};
 expect(digest(restored),"every pre-flags3 case, meaning and release field remains exact").toBe(before.default.sha256);
 return restored;
}
export function beforeFlags3AcceptanceManifest(manifest:QuestionShipManifest):QuestionShipManifest&{id:string;clinicalApproval:false} {
 if(digest(manifest)===digest(before.manifest))return manifest as typeof before.manifest;
 const expected={...before.manifest,id:"question-ship.2026-11-07.v5",
  accepted:[...before.manifest.accepted.filter(r=>!oldIds.has(r.acceptanceId)),...newRows],
  replacements:[...before.manifest.replacements!,{replaces:"case.inguinal-hernia.caregiving-strain",with:"question.inguinal-hernia.symptomatic-elective-repair.v3.r12"}],
  headerSources:{...before.manifest.headerSources,...Object.fromEntries(source.cases.map(cs=>[cs.id,"flags3-accepted"]))}};
 expect(manifest,"only four directed flags3 rows supersede B2A02/B2A08, with three header pins and one relation").toEqual(expected);
 return structuredClone(before.manifest);
}
export function beforeFlags3AcceptanceTimings(actual:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
 if(digest(actual)===digest(before.timing))return [...actual];
 expect(actual,"retain every prior timing row and append only the four accepted identities").toEqual([...before.timing,...timings]);
 return structuredClone(before.timing);
}
export function beforeFlags3AcceptanceSource(path:string,current:string):string {
 const receipt=read("tools/question-quality/fixtures/question-flags3-acceptance-source-migration-20261107.json") as {
  files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>;
 };
 const row=receipt.files.find(r=>r.path===path);if(!row)return current;
 const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
 expect(sha(current),path+" exact flags3 acceptance integration bytes").toBe(row.afterSha256);
 expect(sha(row.beforeText),path+" immutable earlier source").toBe(row.beforeSha256);
 expect(row.beforeSha256,path+" captured intake digest").toBe(before.files[path]);
 return row.beforeText;
}
