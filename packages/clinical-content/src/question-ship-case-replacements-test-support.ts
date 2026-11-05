import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";
import type {SyntheticClinicalRelease} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {beforeN3AcceptanceRelease,beforeN3AcceptanceManifest,beforeN3AcceptanceSource} from "./question-new-n3-acceptance-test-support";
import {QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE as source,QUESTION_FLAGS2_ROUND3_REVISIONS as revisions} from "./question-flags2-round3-20261105";

const read=(name:string)=>JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/"+name,import.meta.url),"utf8"));
const before=read("question-ship-case-replacements-before-20261105.json") as {
 oldCases:SyntheticClinicalRelease["cases"];manifest:QuestionShipManifest&{id:string};default:{sha256:string};files:Record<string,string>;
};
const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");

/** Reconstruct an explicitly historical test epoch while checking the complete
 * authorized replacement delta first. This never participates in gameplay. */
export function beforeWholeCaseReplacementRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 release=beforeN3AcceptanceRelease(release);
 for(const cs of source.cases)expect(release.cases.find(c=>c.id===cs.id),"exact manager-accepted whole case").toEqual(cs);
 const newIds=new Set(revisions.map(r=>r.question.conceptId));
 expect(release.concepts.filter(c=>newIds.has(c.id))).toHaveLength(2);
 const restored={...release,concepts:release.concepts.filter(c=>!newIds.has(c.id)),
  cases:release.cases.map(cs=>before.oldCases.find(c=>c.id===cs.id)??cs)};
 expect(digest(restored),"no default change beyond the two authorized whole cases/cards").toBe(before.default.sha256);
 return restored;
}
export function beforeWholeCaseReplacementManifest(manifest:QuestionShipManifest):QuestionShipManifest {
 manifest=beforeN3AcceptanceManifest(manifest);
 expect(manifest.accepted.filter(a=>a.sourceView==="flags2-round3").map(a=>a.acceptanceId).sort()).toEqual(["G03","G05"]);
 expect(manifest.replacements).toEqual(revisions.map(r=>({replaces:r.caseId,with:r.questionVariantId})));
 const headerSources={...manifest.headerSources};revisions.forEach(r=>{expect(headerSources[r.caseId]).toBe("flags2-round3");delete headerSources[r.caseId];});
 const {replacements:_relations,...restored}={...manifest,id:before.manifest.id,accepted:manifest.accepted.filter(a=>a.sourceView!=="flags2-round3"),headerSources};
 expect(restored,"all earlier manifest fields/rows remain exact").toEqual(before.manifest);
 return restored;
}

/** Exact source migration receipt, not a refreshed legacy capture. The current
 * source must match the audited integration bytes before a historical hash is
 * checked. New/unrelated changes therefore still fail the original guard. */
export function beforeWholeCaseReplacementSource(path:string,current:string):string {
 current=beforeN3AcceptanceSource(path,current);
 const receipt=read("question-ship-case-replacements-source-migration-20261105.json") as {
  files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>;
 };
 const row=receipt.files.find(r=>r.path===path);if(!row)return current;
 const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
 expect(sha(current),path+" exact authorized integration bytes").toBe(row.afterSha256);
 expect(sha(row.beforeText),path+" preserved intake source").toBe(row.beforeSha256);
 expect(row.beforeSha256,path+" original capture unchanged").toBe(before.files[path]);
 return row.beforeText;
}
