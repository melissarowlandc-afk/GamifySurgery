import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n2-round3-ship-gate-20261104';
const hash=x=>createHash('sha256').update(Buffer.isBuffer(x)?x:typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const read=p=>fs.readFileSync(p,'utf8');const content=await import('../../packages/clinical-content/src/index.ts');
const b=await import('../../packages/clinical-content/src/question-new-n2-round3-20261104.ts');
const old=await import('../../packages/clinical-content/src/question-new-n2-round2-20261104.ts');
const baseline=JSON.parse(read(`${dir}/baseline.json`));const frozen=JSON.parse(read(`${dir}/frozen-n1-files.json`));
const frozenN1=Object.entries(frozen).map(([path,sha])=>{const actual=hash(fs.readFileSync(path));assert.equal(actual,sha,`Frozen N1 file changed: ${path}`);return {path,sha256:actual};});
const oldN2Definitions=Object.entries(baseline.files).filter(([p])=>p.startsWith('packages/clinical-content/src/question-new-n2')&&!p.endsWith('.test.ts'));
for(const [p,sha]of oldN2Definitions)assert.equal(hash(fs.readFileSync(p)),sha,`Historical N2 definition changed: ${p}`);
const n1Plan='docs/execplans/question-new-n1-round3-20261104.md';
const oldN1Audit=JSON.parse(read('.local-dev/question-new-n1-round3-20261104/scope-audit.json'));
assert.equal(hash(fs.readFileSync(n1Plan)),oldN1Audit.scopedFiles[n1Plan]);
const passes=JSON.parse(read(`${dir}/frozen-pass.json`));
for(const row of passes){const i=b.QUESTION_NEW_N2_ROUND3_CASES.findIndex(c=>c.id===row.caseId);assert.ok(i>=0);
 assert.equal(hash(b.QUESTION_NEW_N2_ROUND3_CASES[i]),row.caseSha256);assert.equal(hash(b.QUESTION_NEW_N2_ROUND3_QUESTIONS[i]),row.questionSha256);
 assert.equal(hash(b.QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS[i]),row.conceptSha256);
}
const packetPath='docs/research/question-new-n2-round3-20261104.json',packet=JSON.parse(read(packetPath));
for(const row of packet.variants){const cs=b.QUESTION_NEW_N2_ROUND3_CASES.find(c=>c.id===row.caseId);assert.equal(hash(cs),row.exactVersionSha256);}
const registries=JSON.parse(read(`${dir}/integration-receipt.json`)).map(r=>r.path);
const n1RegistryProof=[];
for(const p of registries){const before=read(`${dir}/integration-before__${p.replaceAll('/','__')}`),after=read(p);
 const starts=p.endsWith('test-choice-orders.ts')?['// BEGIN N1 ROUND3 exact-order import','  // BEGIN N1 ROUND3 exact-order append']:['// BEGIN N1 ROUND3 append'];
 for(const start of starts){const end=start.replace('BEGIN','END');const get=s=>{const i=s.indexOf(start);assert.ok(i>=0);const j=s.indexOf('\n',s.indexOf(end,i));return s.slice(i,j<0?s.length:j+1);};
  let current=get(after),prior=get(before);
  if(p.endsWith('synthetic-content.ts'))current=current.replace('export const QUESTION_NEW_N2_ROUND3_PRE_RELEASE =','export const SYNTHETIC_CLINICAL_RELEASE =');
  if(p.endsWith('answer-choice-timing.ts')){
   const aliases=/export const (?:QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES|QUESTION_NEW_N2_ROUND3_PRE_TIMING_ENTRIES) =/;
   current=current.replace(aliases,'export const ANSWER_CHOICE_TIMING_REGISTRY =');
   prior=prior.replace(aliases,'export const ANSWER_CHOICE_TIMING_REGISTRY =');
  }
  assert.equal(current,prior,`Prior N1 block changed: ${p}`);n1RegistryProof.push({path:p,marker:start,exactAfterExportAliasRestoration:true});
 }
}
const reducer='packages/game-domain/src/reducer.ts';let reduced=read(reducer)
 .replace(/  isQuestionCaseManagerAccepted,\r?\n/,'')
 .replace(/  \/\/ Ship gate also covers protected tutorials, which bypass routine selection\.\r?\n  if \(!isQuestionCaseManagerAccepted\(input\.clinicalCase\)\) \{\r?\n    throw new Error\("Cannot create an encounter for an unaccepted question version\."\);\r?\n  \}\r?\n/,'');
const reducerPrior=read(`${dir}/gate-reducer-before.ts`);
const reducerProof={scope:'One import and a four-line guard/comment at createEncounter; no performance/tick logic edited.',
 exactAfterRemovingOwnHunks:reduced===reducerPrior,normalizedExact:reduced.replaceAll('\r\n','\n')===reducerPrior.replaceAll('\r\n','\n')};
const existing=[...registries,'packages/game-domain/src/clinical-case-eligibility.ts','packages/game-domain/src/clinical-selection.ts',
 'packages/game-domain/src/routine-patient-availability.ts',reducer,'packages/game-domain/src/routineAvailabilityReference.testSupport.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts',
 'packages/clinical-content/src/question-new-n2-round2-20261104.test.ts','packages/clinical-content/src/playable-patient-narrative.test.ts'];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${d}/${e.name}`):[`${d}/${e.name}`]);
const added=[...walk('packages/clinical-content/src'),...walk('packages/game-domain/src'),...walk('packages/game-domain/tests'),...walk('tools/question-new-n2-round3'),
 ...walk('docs/research'),...walk('apps/player/public/clinical-exhibits')].filter(p=>/question-new-n2-round3|question-new-n2-r3-|question-ship-(?:manifest|projection|gate|integration|preview)/.test(p));
added.push('docs/execplans/question-new-n2-round3-ship-gate-20261104.md');
const scoped=[...new Set([...existing,...added])].sort();
if(read('docs/handoffs/CURRENT_THREAD_HANDOFF.md').includes('BEGIN N2 ROUND3 SHIP GATE HANDOFF 20261104'))scoped.push('docs/handoffs/CURRENT_THREAD_HANDOFF.md');
const changedExistingRuntime=existing.filter(p=>p.endsWith('.ts')&&!p.endsWith('.test.ts'));
const newRuntime=added.filter(p=>p.endsWith('.ts')&&!p.endsWith('.test.ts')&&p.startsWith('packages/'));
const evidence=JSON.parse(read('tools/qa/level-five-integration-results-20261012.json'));
const bound=changedExistingRuntime.map(p=>({path:p,recordedInExistingEvidence:Object.hasOwn(evidence.inputs,p),currentSha256:hash(fs.readFileSync(p))}));
const live=content.SYNTHETIC_CLINICAL_RELEASE,catalog=content.QUESTION_CATALOG_RELEASE;
const firstStage=new Map();for(const cs of live.cases.filter(c=>!c.participant))for(const node of cs.decisionNodes)
 firstStage.set(node.primaryConceptId,Math.min(firstStage.get(node.primaryConceptId)??Infinity,cs.earliestFacilityStage));
const levelCounts=[0,1,2,3,4].map(level=>({level,patientConceptsFirstAppearing:[...firstStage.values()].filter(stage=>stage===level).length,
 patientCaseVariantsAtStage:live.cases.filter(cs=>!cs.participant&&cs.earliestFacilityStage===level).length,
 acceptedNewCasesAtStage:content.QUESTION_SHIP_MANIFEST.accepted.filter(r=>r.acceptanceId.startsWith('review.n')&&live.cases.find(cs=>cs.id===r.caseId)?.earliestFacilityStage===level).length}));
let beforeOffered=0,afterOffered=0,beforeKeys=0,afterKeys=0;
for(const revision of b.QUESTION_NEW_N2_ROUND3_REVISIONS)for(const [cases,timing,prior]of [[old.QUESTION_NEW_N2_ROUND2_CASES,old.QUESTION_NEW_N2_ROUND2_REVIEW_TIMING,true],[b.QUESTION_NEW_N2_ROUND3_CASES,b.QUESTION_NEW_N2_ROUND3_REVIEW_TIMING,false]]){
 const cs=cases.find(cs=>cs.id===`case.n2.${revision.slug}.v1`),row=timing.find(t=>t.caseId===cs.id);
 if(row.classification.kind==='test_choices')for(const choice of row.classification.choices)if(choice.timing.kind==='test'){
  const keyed=cs.decisionNodes[0].answerChoices.find(c=>c.id===choice.choiceId).isCorrect;
  if(prior){beforeOffered++;if(keyed)beforeKeys++;}else{afterOffered++;if(keyed)afterKeys++;}
 }
}
const snapshot=JSON.parse(read(`${dir}/broad-runtime-snapshot.json`)),playerSnapshot=JSON.parse(read(`${dir}/player-runtime-snapshot.json`));
const differences=snap=>Object.entries(snap.files).filter(([p,h])=>hash(fs.readFileSync(p))!==h).map(([path,beforeSha256])=>({path,beforeSha256,currentSha256:hash(fs.readFileSync(path))}));
const report={capturedAt:new Date().toISOString(),packetSha256:hash(fs.readFileSync(packetPath)),frozenN1Files:frozenN1.length,
 frozenN1Plan:true,frozenPassVersions:12,historicalN2DefinitionFilesUnchanged:oldN2Definitions.length,n1RegistryProof,reducerProof,
 scopedFiles:Object.fromEntries(scoped.map(p=>[p,hash(fs.readFileSync(p))])),
 changedExistingRuntimeInputs:bound,newRuntimeInputs:newRuntime,newAssets:added.filter(p=>p.endsWith('.png')),
 newTests:added.filter(p=>p.endsWith('.test.ts')),sharedTestChanges:existing.filter(p=>p.endsWith('.test.ts')),
 levelFive:'No input evidence, pin, checkpoint, budget or expected result was rebound/edited. Manager runs actual integration in the frozen release tree.',
 timingDelta:{beforeOffered,afterOffered,beforeKeys,afterKeys,offered:afterOffered-beforeOffered,keyed:afterKeys-beforeKeys},
 catalog:{concepts:catalog.concepts.length,cases:catalog.cases.length},live:{cases:live.cases.length,nodes:live.cases.reduce((n,c)=>n+c.decisionNodes.length,0),
  activeConcepts:new Set(live.cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId))).size,acceptedEntries:content.QUESTION_SHIP_MANIFEST.accepted.length,levelCounts},
 revisedByLevel:Object.fromEntries([3,4].map(l=>[l,b.QUESTION_NEW_N2_ROUND3_REVISIONS.filter(r=>r.item.level===l).length])),
 changedMeaningVersions:b.QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS.length,preservedMeanings:b.QUESTION_NEW_N2_ROUND3_REVISIONS.filter(r=>r.conceptMeaning==='preserved').length,
 changesAfterDomainStartSnapshot:differences(snapshot),changesAfterPlayerStartSnapshot:differences(playerSnapshot),
 restrictions:{directGitCommand:false,gitMutations:false,network:false,installs:false,agents:false,cloudOrSupabaseEdits:false,levelFiveEvidenceEdits:false,rebind:false,release:false,
  indirectGitAttempt:'The optional npm test:boundaries script attempted a read-only Git spawn internally. Sandbox returned spawnSync git EPERM; no retry and no successful Git operation.'},
};
fs.writeFileSync(`${dir}/scope-audit.json`,JSON.stringify(report,null,2)+'\n');fs.writeFileSync(`${dir}/scoped-files.json`,JSON.stringify(scoped,null,2)+'\n');
fs.writeFileSync(`${dir}/frozen-integrity.json`,JSON.stringify({capturedAt:report.capturedAt,frozenN1,plan:{path:n1Plan,sha256:hash(fs.readFileSync(n1Plan))},frozenN2Pass:passes,n1RegistryProof},null,2)+'\n');
console.log(JSON.stringify({frozenN1Files:frozenN1.length,frozenN1Plan:true,frozenN2Pass:12,scoped:scoped.length,reducerProof,
 revisedByLevel:report.revisedByLevel,timingDelta:report.timingDelta,catalog:report.catalog,live:report.live,existingInputs:bound,newRuntimeInputs:newRuntime.length}));
