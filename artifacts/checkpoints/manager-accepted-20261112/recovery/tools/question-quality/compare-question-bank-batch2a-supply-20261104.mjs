// Disposable process-local baseline/current comparison of project synthetic tests.
// It keeps their functional assertions; it does not replace Vitest or its deadlines.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import {stripTypeScriptTypes} from "node:module";
import {createHash} from "node:crypto";
import {performance} from "node:perf_hooks";
import "../economy-audit/source-loader.mjs";
const domain=await import("../../packages/game-domain/src/index.ts"),content=await import("../../packages/clinical-content/src/index.ts");
const entry=JSON.parse(fs.readFileSync("tools/question-quality/fixtures/question-bank-batch2a-tests-before-20261104.json","utf8"));
const original=domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,root=path.resolve(import.meta.dirname,"../..");
const hash=s=>createHash("sha256").update(s).digest("hex");
const scenarios=[
 ["packages/game-domain/tests/patient-supply.test.ts","records the current clinical inventory and exact unseen-patient boundary by stage",10000],
 ["packages/game-domain/tests/patient-supply.test.ts","admits and completes patients in prepared day-six through day-eight states",30000],
 ["packages/game-domain/tests/diagnostics/patient-supply.test.ts","runs normal ticks, arrivals, gates, and completions through day eight",300000],
];
const matchers=`
import assert from 'node:assert/strict';
let captured,assertions=0,enforceSnapshot=true;
const expect=value=>({
 toBe:expected=>{assertions++;assert.strictEqual(value,expected)},
 toHaveLength:expected=>{assertions++;assert.strictEqual(value.length,expected)},
 toBeNull:()=>{assertions++;assert.strictEqual(value,null)},
 toBeGreaterThan:expected=>{assertions++;assert(value>expected)},
 toContain:expected=>{assertions++;assert(value.includes(expected))},
 not:{toBeNull:()=>{assertions++;assert.notStrictEqual(value,null)}},
 toMatchInlineSnapshot:text=>{assertions++;const expected=JSON.parse(text.replace(/,\\s*([}\\]])/g,'$1'));if(enforceSnapshot)assert.deepStrictEqual(value,expected);captured=value;},
});
`;
function resolveImport(from,file){
 if(from==="@gamify-surgery/clinical-content")return pathToFileURL(path.join(root,"packages/clinical-content/src/index.ts")).href;
 if(!from.startsWith("."))return from;
 let p=path.resolve(root,path.dirname(file),from);
 if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,"index.ts");
 else if(!path.extname(p))p+=".ts";
 assert(fs.existsSync(p),p);return pathToFileURL(p).href;
}
async function compile(file,title,deadline,source){
 source=source.replaceAll("\r\n","\n");
 const marker=`it(${JSON.stringify(title)}, () => {`;
 assert.equal(source.split(marker).length,2,"Unique exact test callback");
 const start=source.indexOf(marker)+marker.length,ending=`\n  }, hostedTime(${deadline.toLocaleString("en-US").replaceAll(",","_")}));`;
 const end=source.indexOf(ending,start);assert(end>start,ending);
 const describe=source.indexOf("\ndescribe(");assert(describe>0);
 let prefix=source.slice(0,describe).replace('import { describe, expect, it } from "vitest";',"");
 prefix=prefix.replace(/from\s+["']([^"']+)["']/g,(_,from)=>"from "+JSON.stringify(resolveImport(from,file)));
 const body=source.slice(start,end),code=stripTypeScriptTypes(matchers+prefix+`\nexport function run(enforce=true){assertions=0;captured=undefined;enforceSnapshot=enforce;${body}\nreturn {value:captured,assertions,trace:typeof state==="undefined"?null:Object.values(state.encounters).map(e=>({id:e.id,steps:e.steps.map(s=>({decisionNodeId:s.decisionNodeId,questionVariantId:s.questionVariantId,primaryConceptId:s.primaryConceptId,status:s.status}))}))};}`,{mode:"transform"});
 const compiled=await import("data:text/javascript;base64,"+Buffer.from(code).toString("base64"));
 return {run:compiled.run,sourceHash:hash(source)};
}
const results=[];
try{
 for(const[file,title,deadline]of scenarios){
  const runs={};
  for(const[name,source,release]of [["entry",entry.files[file].text,content.QUESTION_BANK_PRE_BATCH2A_RELEASE],["current",fs.readFileSync(file,"utf8"),original]]){
   const scenario=await compile(file,title,deadline,source);domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;
   const start=performance.now(),result=scenario.run(name==="entry"||!process.argv.includes("--capture-current"));assert(result.value!==undefined);
   runs[name]={sourceHash:scenario.sourceHash,elapsedMs:Math.round(performance.now()-start),functionalAssertions:result.assertions,resultHash:hash(JSON.stringify(result.value)),value:result.value,trace:result.trace};
  }
  results.push({file,title,originalDeadlineMs:deadline,entrySnapshotOnEntryRelease:"passed",currentSnapshotOnCurrentRelease:process.argv.includes("--capture-current")?"computed candidate; not asserted":"passed",runs});
 }
}finally{domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
const result={checkedOn:"2026-11-04",status:process.argv.includes("--capture-current")?"candidate":"passed",scope:"Same current domain runtime, exact captured/current test bodies and assertions, two clinical releases in a disposable restored context. No test deadline, production code, evidence, save or player data changed. Diagnostic time is not a passing Vitest result or performance benchmark.",results};
fs.writeFileSync("tools/question-quality/question-bank-batch2a-supply-"+(process.argv.includes("--capture-current")?"candidate":"control")+"-20261104.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({status:result.status,scenarios:results.length,results:results.map(r=>({title:r.title,entryAssertions:r.runs.entry.functionalAssertions,currentAssertions:r.runs.current.functionalAssertions,entryElapsedMs:r.runs.entry.elapsedMs,currentElapsedMs:r.runs.current.elapsedMs}))},null,2));
