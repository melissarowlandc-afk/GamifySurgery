// Process-local counterfactuals, not test passes. No production or saved state writes.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
import {pathToFileURL} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-flags-round3-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/index.ts');
const root=path.resolve(import.meta.dirname,'../..'),base='tools/question-quality/';
const paths=['patient-supply.test.ts','gs028-20261002-batch.test.ts','gs028-20261003-batch.test.ts','gs028-statistics-ethics-batch.test.ts'].map(p=>'packages/game-domain/tests/'+p);
const fixture=base+'fixtures/question-flags-round3-remaining-fixtures-before-20261104.json';
if(!fs.existsSync(fixture))fs.writeFileSync(fixture,JSON.stringify(Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,'utf8')])),null,2)+'\n');
const originals=JSON.parse(fs.readFileSync(fixture,'utf8'));
const oldCases=new Set(entry.release.cases.map(c=>c.id)),oldConcepts=new Set(entry.release.concepts.map(c=>c.id)),ours=new Set(c.QUESTION_FLAG_ROUND3_TESTED_CONCEPTS.map(c=>c.id));
const sameN1={...entry.release,cases:[...entry.release.cases,...c.SYNTHETIC_CLINICAL_RELEASE.cases.filter(c=>!oldCases.has(c.id))],concepts:[...entry.release.concepts,...c.SYNTHETIC_CLINICAL_RELEASE.concepts.filter(c=>!oldConcepts.has(c.id)&&!ours.has(c.id))]};
function resolve(from,file){
 const packages={'@gamify-surgery/clinical-content':'clinical-content','@gamify-surgery/game-domain':'game-domain','@gamify-surgery/balance-config':'balance-config'};
 if(packages[from])return pathToFileURL(path.join(root,'packages',packages[from],'src/index.ts')).href;
 if(!from.startsWith('.'))return from;
 let p=path.resolve(root,path.dirname(file),from);if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.ts');else if(!path.extname(p))p+='.ts';return pathToFileURL(p).href;
}
const matchers=`import assert from 'node:assert/strict';
let captured,expectedSnapshot,assertions=0,lengths=[];
const expect=value=>({
 toBe:expected=>{assertions++;assert.strictEqual(value,expected)},
 toHaveLength:expected=>{if(lengths.length<3){lengths.push({expected,actual:value.length});return;}assertions++;assert.strictEqual(value.length,expected)},
 toBeNull:()=>{assertions++;assert.strictEqual(value,null)},
 toBeGreaterThan:expected=>{assertions++;assert(value>expected)},
 toContain:expected=>{assertions++;assert(value.includes(expected))},
 not:{toBeNull:()=>{assertions++;assert.notStrictEqual(value,null)}},
 toMatchInlineSnapshot:text=>{expectedSnapshot=JSON.parse(text.replace(/,\\s*([}\\]])/g,'$1'));captured=value;},
});`;
const scenarios=[
 ['records the current clinical inventory and exact unseen-patient boundary by stage','10_000'],
 ['admits and completes patients in prepared day-six through day-eight states','30_000'],
];
const original=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,results=[];
try{
 for(const [title,deadline]of scenarios){
  const file=paths[0],source=originals[file].replaceAll('\r\n','\n'),marker=`it(${JSON.stringify(title)}, () => {`,start=source.indexOf(marker)+marker.length,end=source.indexOf(`\n  }, hostedTime(${deadline}));`,start);
  assert(start>marker.length&&end>start);
  const prefix=source.slice(0,source.indexOf('\ndescribe(')).replace('import { describe, expect, it } from "vitest";','').replace(/from\s+["']([^"']+)["']/g,(_,from)=>'from '+JSON.stringify(resolve(from,file)));
  const runs={};
  for(const [name,release]of [['entry',entry.release],['entryWithSameN1',sameN1],['current',original]]){
   d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;
   const code=stripTypeScriptTypes(matchers+prefix+`\nexport const controlName=${JSON.stringify(name)};\nexport function run(){${source.slice(start,end)}\nreturn {value:captured,expectedSnapshot,lengths,functionalAssertions:assertions,trace:typeof state==='undefined'?null:Object.values(state.encounters).map(e=>({caseId:e.caseId,steps:e.steps.map(s=>({questionVariantId:s.questionVariantId,primaryConceptId:s.primaryConceptId,status:s.status}))}))};}`,{mode:'transform'});
   const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));runs[name]=mod.run();assert(runs[name].value!==undefined);
   runs[name].matchesSnapshot=isDeepStrictEqual(runs[name].value,runs[name].expectedSnapshot);
   runs[name].matchesLengths=runs[name].lengths.every(x=>x.actual===x.expected);
  }
  assert(runs.entry.matchesSnapshot&&runs.entry.matchesLengths,'Entry must reproduce the original inventory/seeded snapshot exactly');
  results.push({file,title,deadlineMs:Number(deadline.replaceAll('_','')),runs});
 }
 const cohortFile=paths[1],source=originals[cohortFile].replaceAll('\r\n','\n');
 const prefix=source.slice(0,source.indexOf('\ndescribe(')).replace('import { afterAll, describe, expect, it } from "vitest";','').replace('import { describe, expect, it } from "vitest";','').replace(/from\s+["']([^"']+)["']/g,(_,from)=>'from '+JSON.stringify(resolve(from,cohortFile)));
 d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;
 const code=stripTypeScriptTypes(prefix+`\nexport const result=EXACT_TEST_CHOICE_ORDER_RECORDS.filter(record=>GS028_20261002_CASES.some(c=>c.id===record.caseId&&c.decisionNodes.some(n=>n.id===record.nodeId&&n.questionVariantId===record.questionVariantId)));`,{mode:'transform'});
 const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const records=mod.result;
 const filtered=c.SYNTHETIC_CLINICAL_RELEASE.cases.filter(c=>!c.id.startsWith('case.gs028g.')&&!c.id.startsWith('case.pediatric-clinic.')&&!c.id.startsWith('case.variety3.'));
 const inventory={filteredCases:filtered.length,filteredNodes:filtered.reduce((n,c)=>n+c.decisionNodes.length,0),october2:{records:records.length,gate:records.filter(r=>r.disposition.kind==='result_gate_route_override').length,terminal:records.filter(r=>r.disposition.kind==='terminal_service').length,external:records.filter(r=>r.disposition.kind==='not_executed'&&r.disposition.reason==='external_only').length,identities:records.map(r=>({variant:r.questionVariantId,choice:r.choiceLabel,disposition:r.disposition}))}};
 fs.writeFileSync(base+'question-flags-round3-remaining-fixtures-control-20261104.json',JSON.stringify({checkedOn:'2026-11-04',scope:'Same current domain runtime; entry, entry plus concurrent N1, and current clinical catalogs. Snapshot and three literal inventory lengths captured separately; every other assertion executes. No deadline, production or save mutation. Not a Vitest pass.',results,inventory},null,2)+'\n');
 console.log(JSON.stringify({results:results.map(r=>({title:r.title,runs:Object.fromEntries(Object.entries(r.runs).map(([k,v])=>[k,{matchesSnapshot:v.matchesSnapshot,lengths:v.lengths,assertions:v.functionalAssertions}]))})),inventory:{...inventory,october2:{...inventory.october2,identities:undefined}}}));
}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
