import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const originals=JSON.parse(fs.readFileSync("tools/question-quality/fixtures/adversarial-r6-before-20261102.json","utf8")).files;
const pattern=/\.toMatchInlineSnapshot\(\s*`([\s\S]*?)`\s*,?\s*\)/g;
const hash=x=>createHash("sha256").update(x).digest("hex");
const parse=s=>JSON.parse(s.replace(/,\s*([}\]])/g,"$1"));
const snapshots=s=>[...s.matchAll(pattern)].map(m=>parse(m[1]));
function normalize(s){return s.replaceAll("\r\n","\n").replace(pattern,".toMatchInlineSnapshot(SNAPSHOT)")
 .replaceAll("toHaveLength(392)","toHaveLength(389)").split("\n").filter(l=>!l.trimStart().startsWith("//")).join("\n").trim();}
function differences(a,b,path=""){
 if(JSON.stringify(a)===JSON.stringify(b))return [];
 if(Array.isArray(a)&&Array.isArray(b)&&[...a,...b].every(x=>typeof x==="string"))return [{path,added:b.filter(x=>!a.includes(x)),removed:a.filter(x=>!b.includes(x))}];
 if(a&&b&&typeof a==="object"&&typeof b==="object")return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>differences(a[k],b[k],path?path+"."+k:k));
 return [{path,before:a,after:b}];
}
const results=[];
for(const file of ["packages/game-domain/tests/patient-supply.test.ts","packages/game-domain/tests/diagnostics/patient-supply.test.ts"]){
 const before=originals[file].text,after=fs.readFileSync(file,"utf8"),a=snapshots(before),b=snapshots(after);
 assert.equal(normalize(after),normalize(before),"No changed functional assertion/deadline/body outside snapshots and the explicit 389 -> 392 inventory expectation: "+file);
 assert.equal(a.length,b.length);
 results.push({file,entrySourceHash:hash(before),currentSourceHash:hash(after),functionalAssertionsAndDeadlinesUnchanged:true,
  snapshots:a.map((x,i)=>({index:i+1,differences:differences(x,b[i]),before:x,after:b[i]}))});
}
const control=JSON.parse(fs.readFileSync("tools/question-quality/adversarial-r6-supply-control-20261102.json","utf8"));assert.equal(control.status,"passed");
const result={checkedOn:"2026-11-03",status:"passed",reason:"Three additive scored-objective versions retain all 389 entry definitions; the skin v2 becomes catalog-only, with no selector/routing change. New concept identities change the deterministic unseen-supply/admission trace; the day-seven patient is now a different one-question case, not a truncated encounter. B05 alone intentionally changes its key to the existing MRI service. Same-current-runtime controlled entry/current clinical releases pass their exact respective captured/current snapshots. No per-player/per-question analytics.",control:"adversarial-r6-supply-control-20261102.json",results};
fs.writeFileSync("tools/question-quality/adversarial-r6-snapshot-change-review-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({status:result.status,files:results.length,snapshots:results.reduce((n,r)=>n+r.snapshots.length,0),changedPaths:results.flatMap(r=>r.snapshots.flatMap(s=>s.differences.map(x=>({file:r.file,snapshot:s.index,...x}))))},null,2));
