import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";
import {beforeStats1AcceptanceSource} from "./question-stats1-acceptance-test-support";

const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
/** Test-only source epoch: verify the owner's exact standard update and the
 * minimal guard integration before preserving all older capture assertions.
 * No live projection, admission, save or question assembly calls this. */
export function beforeStats1Source(path:string,current:string):string {
 current=beforeStats1AcceptanceSource(path,current);
 const receipt=read("tools/question-quality/fixtures/question-stats1-source-migration-20261108.json") as {
  files:Array<{path:string;beforeSha256:string;afterSha256:string;beforeText:string}>;
 };
 const row=receipt.files.find(r=>r.path===path);if(!row)return current;
 const capture=read("tools/question-quality/fixtures/question-stats1-before-20261108.json") as {files:Record<string,string>};
 const sha=(v:string)=>createHash("sha256").update(v).digest("hex");
 expect(sha(current),path+" exact stats1 authorized source bytes").toBe(row.afterSha256);
 expect(sha(row.beforeText),path+" immutable previous source").toBe(row.beforeSha256);
 expect(row.beforeSha256,path+" immutable intake hash").toBe(capture.files[path]);
 return row.beforeText;
}
