import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";
import type {SyntheticClinicalRelease} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE as source} from "./synthetic-content";

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-new-n3-acceptance-before-20261105.json") as {
 default:{conceptIds:string[];sha256:string};manifest:QuestionShipManifest&{id:string};files:Record<string,string>;
};
const supplemental=read("tools/question-quality/fixtures/question-new-n3-acceptance-supplemental-before-20261105.json") as {files:Record<string,string>};
const packet=read("docs/research/question-new-n3-round3-20261105.json") as {
 frozenPreservation:Array<{id:string;variantSha256:string;authoredCaseSha256:string}>;
 variants:Array<{id:string;caseId:string;questionVariantId:string}>;
};
const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const rows=packet.frozenPreservation.map(pin=>{
 const variant=packet.variants.find(v=>v.id===pin.id)!;
 const cs=source.cases.find(c=>c.id===variant.caseId)!;
 expect(digest(variant),pin.id+" frozen reviewed packet").toBe(pin.variantSha256);
 expect(digest(cs),pin.id+" exact authored source case").toBe(pin.authoredCaseSha256);
 const n=cs.decisionNodes[0]!;
 return {acceptanceId:pin.id,caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,conceptId:n.primaryConceptId,
  sourceView:"n3-round3",decision:"docs/research/question-new-n3-manager-decision-20261105.md"};
});

/** Historical test epoch only. First pin all five accepted objects and prove
 * the complete live delta; no runtime/save path calls these adapters. */
export function beforeN3AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
 expect(rows).toHaveLength(5);
 for(const row of rows)expect(release.cases.find(c=>c.id===row.caseId)).toEqual(source.cases.find(c=>c.id===row.caseId));
 expect(release.cases.filter(c=>c.id.startsWith("case.n3.")).map(c=>c.id).sort()).toEqual(rows.map(r=>r.caseId).sort());
 const oldConcepts=new Set(before.default.conceptIds),ids=new Set(rows.map(r=>r.caseId));
 expect(release.concepts.filter(c=>!oldConcepts.has(c.id)).map(c=>c.id).sort()).toEqual(rows.map(r=>r.conceptId).sort());
 for(const row of rows)expect(release.concepts.find(c=>c.id===row.conceptId)).toEqual(source.concepts.find(c=>c.id===row.conceptId));
 const restored={...release,cases:release.cases.filter(cs=>!ids.has(cs.id)),concepts:release.concepts.filter(c=>oldConcepts.has(c.id))};
 expect(digest(restored),"no earlier default case, meaning or metadata change").toBe(before.default.sha256);
 return restored;
}
export function beforeN3AcceptanceManifest(manifest:QuestionShipManifest):QuestionShipManifest {
 expect(manifest.accepted.filter(a=>a.sourceView==="n3-round3")).toEqual(rows);
 const headerSources={...manifest.headerSources};
 for(const row of rows){expect(headerSources[row.caseId]).toBe("n3-round3");delete headerSources[row.caseId];}
 const restored={...manifest,id:before.manifest.id,accepted:manifest.accepted.filter(a=>a.sourceView!=="n3-round3"),headerSources};
 expect(restored,"all 64 prior rows, headers and replacement relations remain exact").toEqual(before.manifest);
 return restored;
}
export function beforeN3AcceptanceSource(path:string,current:string):string {
 const receipt=read("tools/question-quality/fixtures/question-new-n3-acceptance-source-migration-20261105.json") as {
  files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>;
 };
 const row=receipt.files.find(r=>r.path===path);if(!row)return current;
 const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
 expect(sha(current),path+" exact N3 acceptance integration bytes").toBe(row.afterSha256);
 expect(sha(row.beforeText),path+" preserved pre-acceptance source").toBe(row.beforeSha256);
 expect(row.beforeSha256,path+" immutable intake source digest").toBe(({...before.files,...supplemental.files})[path]);
 return row.beforeText;
}
