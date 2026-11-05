// Disposable before/after clinical contexts using the same current domain code.
// Snapshot/length expectations are captured separately; all other assertions run.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
import {pathToFileURL} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/index.ts');
const base='tools/question-quality/',root=path.resolve(import.meta.dirname,'../..'),fixture=base+'fixtures/question-bank-batch2a-round2-domain-fixtures-before-20261104.json';
const paths=['patient-supply.test.ts','diagnostics/patient-supply.test.ts','gs028-20261007-batch.test.ts','gs028-20261007-variety2-batch.test.ts','surgery-center-batch.test.ts','gs028-20261003-batch.test.ts','gs028-statistics-ethics-batch.test.ts'].map(p=>'packages/game-domain/tests/'+p);
if(!fs.existsSync(fixture))fs.writeFileSync(fixture,JSON.stringify(Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,'utf8')])),null,2)+'\n');
const originals=JSON.parse(fs.readFileSync(fixture,'utf8'));
const resolve=(from,file)=>{
 const pkgs={'@gamify-surgery/clinical-content':'clinical-content','@gamify-surgery/game-domain':'game-domain','@gamify-surgery/balance-config':'balance-config'};
 if(pkgs[from])return pathToFileURL(path.join(root,'packages',pkgs[from],'src/index.ts')).href;
 if(!from.startsWith('.'))return from;let p=path.resolve(root,path.dirname(file),from);
 if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.ts');else if(!path.extname(p))p+='.ts';return pathToFileURL(p).href;
};
const prefix=(file,source)=>source.slice(0,source.indexOf('\ndescribe(')).replace(/import \{[^}]*\} from "vitest";\n/,'').replaceAll('SYNTHETIC_CLINICAL_RELEASE.cases','PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases').replace(/from\s+["']([^"']+)["']/g,(_,from)=>'from '+JSON.stringify(resolve(from,file)));
const matchers=`import assert from 'node:assert/strict';
let captured,expectedSnapshot,assertions=0,lengths=[],capturedTrace=[];
const expect=value=>({
 toBe:expected=>{assertions++;assert.strictEqual(value,expected)},
 toHaveLength:expected=>{if(captureInventoryLengths&&lengths.length<3){lengths.push({expected,actual:value.length});return;}assertions++;assert.strictEqual(value.length,expected)},
 toBeNull:()=>{assertions++;assert.strictEqual(value,null)},
 toBeGreaterThan:expected=>{assertions++;assert(value>expected)},
 toContain:expected=>{assertions++;assert(value.includes(expected))},
 not:{toBeNull:()=>{assertions++;assert.notStrictEqual(value,null)}},
 toMatchInlineSnapshot:text=>{expectedSnapshot=JSON.parse(text.replace(/,\\s*([}\\]])/g,'$1'));captured=value;},
});`;
const scenarios=[
 [paths[0],'records the current clinical inventory and exact unseen-patient boundary by stage','10_000',true],
 [paths[0],'admits and completes patients in prepared day-six through day-eight states','30_000',false],
 [paths[1],'runs normal ticks, arrivals, gates, and completions through day eight','300_000',false],
];
const original=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,runsByScenario=[],cohorts=[];
try{
 const dayTraceOnly=process.argv.includes('--day-trace');
 for(const[file,title,deadline,captureInventoryLengths]of scenarios.filter(s=>!dayTraceOnly||s[1].startsWith('admits'))){
  const source=originals[file].replaceAll('\r\n','\n'),marker=`it(${JSON.stringify(title)}, () => {`,start=source.indexOf(marker)+marker.length,end=source.indexOf(`\n  }, hostedTime(${deadline}));`,start);assert(start>marker.length&&end>start);
  const runs={};
  for(const[name,release]of [['before',c.QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE],['after',c.SYNTHETIC_CLINICAL_RELEASE]]){
   d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;
   const body=source.slice(start,end).replace('observations.push({',`capturedTrace.push({dayNumber,caseId:state.encounters[result.encounterId]?.frozenCase.id,variants:state.encounters[result.encounterId]?.steps.map(s=>s.questionVariantId)});\n      observations.push({`);
   const code=stripTypeScriptTypes(matchers+`\nconst captureInventoryLengths=${captureInventoryLengths};\n`+prefix(file,source)+`\nexport const controlName=${JSON.stringify(name)};\nexport function run(){${body}\nreturn {value:captured,expectedSnapshot,lengths,functionalAssertions:assertions,trace:capturedTrace};}`,{mode:'transform'});
   const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));runs[name]=mod.run();assert(runs[name].value!==undefined);
   runs[name].matchesFixture=isDeepStrictEqual(runs[name].value,runs[name].expectedSnapshot);runs[name].matchesLengths=runs[name].lengths.every(x=>x.actual===x.expected);
  }
  runsByScenario.push({file,title,deadlineMs:Number(deadline.replaceAll('_','')),runs});
 }
 if(dayTraceOnly){
  const output=base+'question-bank-batch2a-round2-fixture-control-20261104.json',old=JSON.parse(fs.readFileSync(output,'utf8'));old.dayTrace=runsByScenario[0];old.traceCapturedAt=new Date().toISOString();fs.writeFileSync(output,JSON.stringify(old,null,2)+'\n');console.log(JSON.stringify(runsByScenario[0].runs));
 }else{
 for(const file of paths.slice(2,4)){
  const source=originals[file].replaceAll('\r\n','\n'),runs={};
  for(const[name,release]of [['before',c.QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE],['after',c.SYNTHETIC_CLINICAL_RELEASE]]){
   d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;
   const code=stripTypeScriptTypes(prefix(file,source)+`\nexport const controlName=${JSON.stringify(name)};\nexport const result={pools,choices:cases.reduce((n,c)=>n+c.decisionNodes.reduce((n,d)=>n+d.answerChoices.length,0),0)};`,{mode:'transform'});
   const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));runs[name]=mod.result;
  }
  cohorts.push({file,runs});
 }
 const cohortIds=new Set(c.SURGERY_CENTER_CASES.map(c=>c.id));
 const sc=release=>[...new Set(release.cases.filter(cs=>cohortIds.has(cs.id)).flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId)))].sort();
 const filtered=release=>{const cs=release.cases.filter(c=>!c.id.startsWith('case.gs028g.')&&!c.id.startsWith('case.pediatric-clinic.')&&!c.id.startsWith('case.variety3.'));return {cases:cs.length,nodes:cs.reduce((n,c)=>n+c.decisionNodes.length,0)};};
 const report={checkedAt:new Date().toISOString(),policy:'Same current domain runtime and same current N1/N2 on both sides. Only these ten projections/six constructs differ. Three inventory lengths and snapshots captured separately; all other scenario assertions execute. No production, routing, evidence, save, clock or deadline mutation. Diagnostic, not a Vitest pass.',scenarios:runsByScenario,cohorts,surgeryCenter:{before:sc(c.QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE),after:sc(c.SYNTHETIC_CLINICAL_RELEASE)},filteredGlobal:{before:filtered(c.QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE),after:filtered(c.SYNTHETIC_CLINICAL_RELEASE)}};
 fs.writeFileSync(base+'question-bank-batch2a-round2-fixture-control-20261104.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({scenarios:runsByScenario.map(s=>({title:s.title,runs:Object.fromEntries(Object.entries(s.runs).map(([k,v])=>[k,{matchesFixture:v.matchesFixture,lengths:v.lengths,assertions:v.functionalAssertions}]))})),cohorts,addedSc:report.surgeryCenter.after.filter(x=>!report.surgeryCenter.before.includes(x)),removedSc:report.surgeryCenter.before.filter(x=>!report.surgeryCenter.after.includes(x)),filteredGlobal:report.filteredGlobal}));
 }
}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
