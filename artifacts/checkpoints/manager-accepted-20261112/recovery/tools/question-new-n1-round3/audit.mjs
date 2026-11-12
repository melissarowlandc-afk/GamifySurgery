import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n1-round3-20261104',hash=x=>createHash('sha256').update(x).digest('hex');
const baseline=JSON.parse(fs.readFileSync(`${dir}/baseline.json`)),integration=JSON.parse(fs.readFileSync(`${dir}/integration-receipt.json`));
const testReceipt=JSON.parse(fs.readFileSync(`${dir}/test-integration-receipt.json`));
const walk=(d)=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?['node_modules','dist','.vite','coverage'].includes(e.name)?[]:walk(`${d}/${e.name}`):[`${d}/${e.name}`]);
const normalize=s=>s.replace(/\r\n/g,'\n');
const oldTest='packages/clinical-content/src/question-new-n1-round2-20261104.test.ts';
const oldNativeTest='packages/game-domain/tests/question-new-n1-round2-admission.test.ts';
const protectedDifferences=[];
for(const [path,sha]of Object.entries(baseline.frozenFiles)){
 const actual=hash(fs.readFileSync(path));if(actual!==sha){
  assert.ok([oldTest,oldNativeTest].includes(path),`Frozen clinical/source/artifact file changed: ${path}`);
  const prior=fs.readFileSync(`${dir}/test-before__${path.replaceAll('/','__')}`,'utf8');
  let restored=fs.readFileSync(path,'utf8');
  if(path===oldTest)restored=restored.replace('QUESTION_NEW_N1_ROUND3_PRE_RELEASE as SYNTHETIC_CLINICAL_RELEASE','SYNTHETIC_CLINICAL_RELEASE');
  else restored=restored.replace('import { QUESTION_NEW_N1_ROUND3_PRE_RELEASE } from "@gamify-surgery/clinical-content";\n','')
    .replace('const context = { ...createLevelFourRoomsQaContext(), clinicalRelease: QUESTION_NEW_N1_ROUND3_PRE_RELEASE }, NOW = 1_800_000_000_000;',
      'const context = createLevelFourRoomsQaContext(), NOW = 1_800_000_000_000;');
  assert.equal(restored,prior);assert.equal(hash(Buffer.from(prior)),sha);
  protectedDifferences.push({path,scope:'Only the imported live alias changes to the retained pre-round-three assembly; every assertion and all clinical definitions remain exact.'});
 }
}
const registryProof=[];
for(const row of integration.files){
 const p=row.path,before=fs.readFileSync(`${dir}/integration-before__${p.replaceAll('/','__')}`,'utf8');let after=fs.readFileSync(p,'utf8');
 if(p.endsWith('/test-choice-orders.ts')){
  after=after.replace(/\/\/ BEGIN N1 ROUND3 exact-order import[\s\S]*?\/\/ END N1 ROUND3 exact-order import\r?\n/,'')
    .replace(/  \/\/ BEGIN N1 ROUND3 exact-order append[\s\S]*?  \/\/ END N1 ROUND3 exact-order append\r?\n/,'');
 }else{
  after=after.replace(/\r?\n\/\/ BEGIN N1 ROUND3 append[^\n]*\n[\s\S]*?\/\/ END N1 ROUND3 append[^\n]*\n/,'');
  if(p.endsWith('/synthetic-content.ts'))after=after.replace('export const QUESTION_NEW_N1_ROUND3_PRE_RELEASE =','export const SYNTHETIC_CLINICAL_RELEASE =');
  if(p.endsWith('/answer-choice-timing.ts'))after=after.replace('export const QUESTION_NEW_N1_ROUND3_PRE_TIMING_ENTRIES =','export const ANSWER_CHOICE_TIMING_REGISTRY =');
 }
 // A peer may make a later integration change. Record it instead of overwriting it.
 registryProof.push({path:p,priorBodyExact:normalize(after)===normalize(before),priorBodyByteExact:after===before,beforeSha256:hash(Buffer.from(before)),currentSha256:hash(fs.readFileSync(p))});
}
const content=await import('../../packages/clinical-content/src/index.ts');
const old=await import('../../packages/clinical-content/src/question-new-n1-round2-20261104.ts');
const packet=JSON.parse(fs.readFileSync('docs/research/question-new-n1-round3-20261104.json'));
const passes=JSON.parse(fs.readFileSync(`${dir}/frozen-pass.json`));
for(const p of passes){const i=content.QUESTION_NEW_N1_ROUND3_ITEMS.findIndex(x=>x.slug===p.item.slug);
 assert.equal(hash(JSON.stringify(content.QUESTION_NEW_N1_ROUND3_CASES[i])),hash(JSON.stringify(p.case)));
 assert.equal(hash(JSON.stringify(content.QUESTION_NEW_N1_ROUND3_QUESTIONS[i])),hash(JSON.stringify(p.question)));
 assert.equal(hash(JSON.stringify(content.QUESTION_NEW_N1_ROUND3_AUTHORING_CONCEPTS[i])),hash(JSON.stringify(p.concept)));
}
for(const v of packet.variants){const cs=content.QUESTION_NEW_N1_ROUND3_CASES.find(c=>c.id===v.caseId);assert.equal(hash(JSON.stringify(cs)),v.exactVersionSha256);}
const scoped=[...walk('packages/clinical-content/src'),...walk('packages/game-domain/src'),...walk('packages/game-domain/tests'),...walk('tools/question-new-n1-round3'),...walk('docs/research'),...walk('apps/player/public/clinical-exhibits')]
 .filter(p=>/question-new-n1-round3|question-new-n1-r3-|sources-question-new-n1-round3/.test(p));
scoped.push('docs/execplans/question-new-n1-round3-20261104.md',...integration.files.map(r=>r.path),...testReceipt.map(r=>r.path));
if(fs.readFileSync('docs/handoffs/CURRENT_THREAD_HANDOFF.md','utf8').includes('BEGIN N1 ROUND3 HANDOFF 20261104'))
 scoped.push('docs/handoffs/CURRENT_THREAD_HANDOFF.md');
const ownedRuntime=scoped.filter(p=>p.endsWith('.ts')&&!p.endsWith('.test.ts')&&(/question-new-n1-round3/.test(p)||integration.files.some(r=>r.path===p))).concat(scoped.filter(p=>p.endsWith('.png')));
const oldCases=new Map(content.QUESTION_NEW_N1_ROUND3_PRE_RELEASE.cases.map(c=>[c.id,c]));let beforeOffered=0,afterOffered=0,beforeKeys=0,afterKeys=0;
for(const r of content.QUESTION_NEW_N1_ROUND3_REVISIONS)for(const [entries,cs,previous]of [[old.QUESTION_NEW_N1_ROUND2_REVIEW_TIMING,oldCases.get(`case.n1.${r.slug}.v1`),true],[content.QUESTION_NEW_N1_ROUND3_REVIEW_TIMING,content.QUESTION_NEW_N1_ROUND3_CASES.find(c=>c.id===`case.n1.${r.slug}.v1`),false]]){
 const t=entries.find(t=>t.caseId===cs.id);if(t.classification.kind==='test_choices')for(const c of t.classification.choices)if(c.timing.kind==='test'){
  const keyed=cs.decisionNodes[0].answerChoices.find(a=>a.id===c.choiceId).isCorrect;
  if(previous){beforeOffered++;if(keyed)beforeKeys++;}else{afterOffered++;if(keyed)afterKeys++;}
 }
}
const report={capturedAt:new Date().toISOString(),protectedFiles:Object.keys(baseline.frozenFiles).length,
 frozenN2Files:Object.keys(baseline.frozenFiles).filter(p=>/question-new-n2|sources-question-new-n2/.test(p)).length,
 exactFrozenPassVersions:9,protectedDifferences,registryProof,
 scopedFiles:Object.fromEntries([...new Set(scoped)].sort().map(p=>[p,hash(fs.readFileSync(p))])),
 changedExistingLevelFiveInputs:integration.files.map(r=>r.path),newRuntimeDependencies:ownedRuntime.filter(p=>/question-new-n1-round3|question-new-n1-r3-/.test(p)),
 timingDelta:{beforeOffered,afterOffered,beforeKeys,afterKeys,offered:afterOffered-beforeOffered,keyed:afterKeys-beforeKeys},
 release:{registeredConcepts:content.SYNTHETIC_CLINICAL_RELEASE.concepts.length,cases:content.SYNTHETIC_CLINICAL_RELEASE.cases.length,
  nodes:content.SYNTHETIC_CLINICAL_RELEASE.cases.reduce((n,c)=>n+c.decisionNodes.length,0),newMeaningIds:content.QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS.length,
  caution:'Changed meanings replace prior active versions; this is not 17 additional independent fresh supply concepts.'},
 restrictions:{git:false,network:false,installs:false,agents:false,cloudEdits:false,reducerEdits:false,supabaseEdits:false,levelFiveRebind:false,release:false}};
fs.writeFileSync(`${dir}/scope-audit.json`,JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(`${dir}/scoped-files.json`,JSON.stringify([...new Set(scoped)].sort(),null,2)+'\n');
fs.writeFileSync(`${dir}/owned-runtime-inputs-current.json`,JSON.stringify(Object.fromEntries(ownedRuntime.map(p=>[p,hash(fs.readFileSync(p))])),null,2)+'\n');
const broad=JSON.parse(fs.readFileSync(`${dir}/broad-inputs-before.json`));
if(!fs.existsSync(`${dir}/owned-runtime-inputs-at-broad.json`))fs.writeFileSync(`${dir}/owned-runtime-inputs-at-broad.json`,
 JSON.stringify(Object.fromEntries(ownedRuntime.map(p=>[p,broad.files[p]])),null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({protectedFiles:report.protectedFiles,frozenN2Files:report.frozenN2Files,exactPass:9,testScopeOnlyChanges:protectedDifferences.length,registryProof:registryProof.map(r=>({path:r.path,exact:r.priorBodyExact})),timing:report.timingDelta,release:report.release}));
