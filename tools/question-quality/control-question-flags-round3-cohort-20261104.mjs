import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-flags-round3-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/index.ts');
const first=process.argv.includes('--first');
const file=first?'packages/game-domain/tests/gs028-20261007-batch.test.ts':'packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts';
const fixture='tools/question-quality/fixtures/question-flags-round3-cohort-'+(first?'first-':'')+'before-20261104.json';
if(!fs.existsSync(fixture))fs.writeFileSync(fixture,JSON.stringify({file,text:fs.readFileSync(file,'utf8')},null,2)+'\n');
const before=JSON.parse(fs.readFileSync(fixture,'utf8')),source=before.text.replaceAll('\r\n','\n'),start=source.indexOf('\ndescribe(');
assert(start>0);
const root=path.resolve(import.meta.dirname,'../..');
function resolve(from){
 if(from==='@gamify-surgery/clinical-content')return pathToFileURL(path.join(root,'packages/clinical-content/src/index.ts')).href;
 if(from==='@gamify-surgery/balance-config')return pathToFileURL(path.join(root,'packages/balance-config/src/index.ts')).href;
 if(!from.startsWith('.'))return from;
 let p=path.resolve(root,path.dirname(file),from);
 if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.ts');else if(!path.extname(p))p+='.ts';
 return pathToFileURL(p).href;
}
// Redirect the default-case lookup through the disposable release as well as
// the ordinary-pool lookup. On the current run these are the identical object.
const prefix=source.slice(0,start).replace('import { afterAll, describe, expect, it } from "vitest";','')
 .replaceAll('SYNTHETIC_CLINICAL_RELEASE.cases','PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases')
 .replace(/from\s+["']([^"']+)["']/g,(_,from)=>'from '+JSON.stringify(resolve(from)));
const oldCases=new Set(entry.release.cases.map(c=>c.id)),oldConcepts=new Set(entry.release.concepts.map(c=>c.id)),ownConcepts=new Set(c.QUESTION_FLAG_ROUND3_TESTED_CONCEPTS.map(c=>c.id));
const control={...entry.release,cases:[...entry.release.cases,...c.SYNTHETIC_CLINICAL_RELEASE.cases.filter(c=>!oldCases.has(c.id))],
 concepts:[...entry.release.concepts,...c.SYNTHETIC_CLINICAL_RELEASE.concepts.filter(c=>!oldConcepts.has(c.id)&&!ownConcepts.has(c.id))]};
const original=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,runs={};
try{
 for(const [name,release]of [['entryWithSameN1',control],['current',original]]){
  d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;
  const code=stripTypeScriptTypes(prefix+`\nexport const controlName=${JSON.stringify(name)};\nexport const result=pools;\nexport const active=pools.map(p=>{const items=ordinaryPool(prepared('control.'+p.stage,p.stage)).filter(c=>!c.id.startsWith('case.variety3.'));return [...new Set(items.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId)))].sort();});\nexport const choices=cases.reduce((n,c)=>n+c.decisionNodes.reduce((n,d)=>n+d.answerChoices.length,0),0);\nexport const bindings=exact.map(r=>({...r,isCorrect:cases.find(c=>c.id===r.caseId).decisionNodes.find(n=>n.id===r.nodeId).answerChoices.find(a=>a.id===r.choiceId).isCorrect}));`,{mode:'transform'});
  const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  runs[name]={pools:mod.result,activeConcepts:mod.active,choices:mod.choices,bindings:mod.bindings};
 }
}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
const readExpected=key=>{
 const m=source.match(new RegExp('expect\\(pools\\.map\\(\\(item\\) => item\\.'+key+'\\)\\)\\.toEqual\\((\\[[^;]+\\])\\);'));assert(m,key);
 return JSON.parse(m[1].replace(/(cases|concepts):/g,'"$1":'));
};
for(const key of ['before','after'])assert.deepEqual(runs.entryWithSameN1.pools.map(p=>p[key]),readExpected(key),'Entry release reproduces original '+key+' fixture');
const deltas=runs.current.pools.map((p,i)=>({stage:p.stage,
 before:{cases:p.before.cases-runs.entryWithSameN1.pools[i].before.cases,concepts:p.before.concepts-runs.entryWithSameN1.pools[i].before.concepts},
 after:{cases:p.after.cases-runs.entryWithSameN1.pools[i].after.cases,concepts:p.after.concepts-runs.entryWithSameN1.pools[i].after.concepts},
 addedActive:runs.current.activeConcepts[i].filter(id=>!runs.entryWithSameN1.activeConcepts[i].includes(id)),
 noLongerActive:runs.entryWithSameN1.activeConcepts[i].filter(id=>!runs.current.activeConcepts[i].includes(id)),
}));
const result={checkedOn:'2026-11-04',scope:'Same test prefix/functions with default-case lookup redirected to the disposable context; same current domain runtime. Only fourteen question projections/eight constructs differ. Current N1 cases are present on both sides. A retained literal tag prevents data-module caching between runs. No save, evidence, selector, route, clock or game source mutation.',
 file,originalExpectationsReproduced:true,runs,deltas};
fs.writeFileSync('tools/question-quality/question-flags-round3-cohort-'+(first?'first-':'')+'control-20261104.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({file,pools:runs.current.pools,choiceCounts:{before:runs.entryWithSameN1.choices,after:runs.current.choices},bindingCounts:{before:runs.entryWithSameN1.bindings.length,after:runs.current.bindings.length},deltas}));
