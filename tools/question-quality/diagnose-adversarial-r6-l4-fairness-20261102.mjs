import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import {stripTypeScriptTypes} from "node:module";
import {performance} from "node:perf_hooks";
import "../economy-audit/source-loader.mjs";
const domain=await import("../../packages/game-domain/src/index.ts"),clinical=await import("../../packages/clinical-content/src/index.ts");
const original=domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,root=path.resolve(import.meta.dirname,"../.."),file="packages/game-domain/tests/level-four-integration.test.ts";
const source=fs.readFileSync(file,"utf8").replaceAll("\r\n","\n"),title="preserves scored case identities and arrival count/times for 24 hours with APPs on/off";
const start=source.indexOf('it('+JSON.stringify(title)+', () => {')+('it('+JSON.stringify(title)+', () => {').length,end=source.indexOf('\n  }, hostedTime(120_000));',start);assert(start>0&&end>start);
let prefix=source.slice(0,source.indexOf("\ndescribe(")).replace('import { describe, expect, it } from "vitest";',"");
prefix=prefix.replace(/from\s+["']([^"']+)["']/g,(_,from)=>{if(!from.startsWith("."))return "from "+JSON.stringify(from);let p=path.resolve(root,path.dirname(file),from);if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,"index.ts");else if(!path.extname(p))p+=".ts";return "from "+JSON.stringify(pathToFileURL(p).href);});
prefix=prefix.replaceAll("import.meta.url",JSON.stringify(pathToFileURL(path.join(root,file)).href));
const harness=`import assert from 'node:assert/strict';let failures=[],assertions=0;const check=(kind,actual,expected,fn)=>{assertions++;try{fn();}catch(e){failures.push({kind,actual,expected,message:e.message});}};const expect=value=>({toEqual:expected=>check('equality',value,expected,()=>assert.deepStrictEqual(value,expected)),toBe:expected=>check('identity',value,expected,()=>assert.strictEqual(value,expected)),toBeGreaterThan:expected=>check('greater',value,expected,()=>assert(value>expected))});`;
const code=stripTypeScriptTypes(harness+prefix+'\nexport function run(){failures=[];assertions=0;'+source.slice(start,end)+'\nreturn {assertions,failures,on:[...onArrivals],off:[...offArrivals]};}',{mode:"transform"});
const mod=await import("data:text/javascript;base64,"+Buffer.from(code).toString("base64")),runs=[];
try{for(const[name,release]of [["roundEntry",clinical.QUESTION_QUALITY_PRE_ADVERSARIAL_R6_RELEASE],["current",original]]){domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;const t=performance.now(),r=mod.run();runs.push({name,elapsedMs:Math.round(performance.now()-t),...r});}}
finally{domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
const result={checkedOn:"2026-11-03",scope:"Read-only exact callback, current unchanged runtime, retained entry/current clinical releases. Invariant remains unchanged; recorded failures are not waived. No routing/selector, assertion, source, fixture, evidence or deadline edit.",runs};
fs.writeFileSync("tools/question-quality/adversarial-r6-l4-fairness-diagnosis-20261102.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(runs.map(r=>({name:r.name,assertions:r.assertions,failures:r.failures.length,elapsedMs:r.elapsedMs,on:r.on.length,off:r.off.length}))));
