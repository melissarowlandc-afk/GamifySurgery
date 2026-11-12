import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-flags-round3-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/index.ts');
const file='packages/game-domain/tests/diagnostics/patient-supply.test.ts',fixture='tools/question-quality/fixtures/question-flags-round3-supply-before-20261104.json';
if(!fs.existsSync(fixture))fs.writeFileSync(fixture,JSON.stringify({file,text:fs.readFileSync(file,'utf8')},null,2)+'\n');
const source=JSON.parse(fs.readFileSync(fixture,'utf8')).text.replaceAll('\r\n','\n');
const title='runs normal ticks, arrivals, gates, and completions through day eight',marker=`it(${JSON.stringify(title)}, () => {`;
const start=source.indexOf(marker)+marker.length,end=source.indexOf('\n  }, hostedTime(300_000));',start);assert(start>marker.length);assert(end>start);
const root=path.resolve(import.meta.dirname,'../..');
function resolve(from){
 if(from==='@gamify-surgery/clinical-content')return pathToFileURL(path.join(root,'packages/clinical-content/src/index.ts')).href;
 if(from==='@gamify-surgery/game-domain')return pathToFileURL(path.join(root,'packages/game-domain/src/index.ts')).href;
 if(from==='@gamify-surgery/balance-config')return pathToFileURL(path.join(root,'packages/balance-config/src/index.ts')).href;
 if(!from.startsWith('.'))return from;
 let p=path.resolve(root,path.dirname(file),from);if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.ts');else if(!path.extname(p))p+='.ts';return pathToFileURL(p).href;
}
const prefix=source.slice(0,source.indexOf('\ndescribe(')).replace('import { describe, expect, it } from "vitest";','').replace(/from\s+["']([^"']+)["']/g,(_,from)=>'from '+JSON.stringify(resolve(from)));
const matchers=`import assert from 'node:assert/strict';
let captured,expectedSnapshot,assertions=0;
const expect=value=>({
 toBe:expected=>{assertions++;assert.strictEqual(value,expected)},
 toHaveLength:expected=>{assertions++;assert.strictEqual(value.length,expected)},
 toBeNull:()=>{assertions++;assert.strictEqual(value,null)},
 toBeGreaterThan:expected=>{assertions++;assert(value>expected)},
 toContain:expected=>{assertions++;assert(value.includes(expected))},
 not:{toBeNull:()=>{assertions++;assert.notStrictEqual(value,null)}},
 toMatchInlineSnapshot:text=>{assertions++;expectedSnapshot=JSON.parse(text.replace(/,\\s*([}\\]])/g,'$1'));captured=value;},
});`;
const oldCases=new Set(entry.release.cases.map(c=>c.id)),oldConcepts=new Set(entry.release.concepts.map(c=>c.id)),ours=new Set(c.QUESTION_FLAG_ROUND3_TESTED_CONCEPTS.map(c=>c.id));
const control={...entry.release,cases:[...entry.release.cases,...c.SYNTHETIC_CLINICAL_RELEASE.cases.filter(c=>!oldCases.has(c.id))],
 concepts:[...entry.release.concepts,...c.SYNTHETIC_CLINICAL_RELEASE.concepts.filter(c=>!oldConcepts.has(c.id)&&!ours.has(c.id))]};
const original=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,runs={};
try{
 for(const [name,release]of [['entryWithSameN1',control],['current',original]]){
  d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;
  const code=stripTypeScriptTypes(matchers+prefix+`\nexport const controlName=${JSON.stringify(name)};\nexport function run(){${source.slice(start,end)}\nreturn {value:captured,expectedSnapshot,functionalAssertions:assertions};}`,{mode:'transform'});
  const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  runs[name]=mod.run();assert(runs[name].value!==undefined);
  runs[name].matchesCurrentFixture=isDeepStrictEqual(runs[name].value,runs[name].expectedSnapshot);
 }
}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
const same=isDeepStrictEqual(runs.entryWithSameN1.value,runs.current.value);
fs.writeFileSync('tools/question-quality/question-flags-round3-supply-control-20261104.json',JSON.stringify({checkedOn:'2026-11-04',file,title,sourceHash:createHash('sha256').update(source).digest('hex'),
 scope:'Diagnostic capture only: all functional assertions retained, snapshot expected/actual computed separately. Same current domain code and N1 cases; only this batch clinical projections differ. Restored disposable context; no production, evidence, saved state, deadline or fixture edit.',runs,sameResultWithAndWithoutThisBatch:same},null,2)+'\n');
console.log(JSON.stringify({sameResultWithAndWithoutThisBatch:same,runs:Object.fromEntries(Object.entries(runs).map(([k,v])=>[k,{matchesCurrentFixture:v.matchesCurrentFixture,assertions:v.functionalAssertions}]))}));
