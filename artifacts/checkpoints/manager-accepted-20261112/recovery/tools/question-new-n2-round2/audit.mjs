import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {hash,checkPreservation} from './preservation.mjs';
const dir='.local-dev/question-new-n2-round2-20261104';
const baseline=JSON.parse(fs.readFileSync(dir+'/baseline.json','utf8'));
const content=await import('../../packages/clinical-content/src/index.ts');
const batch=await import('../../packages/clinical-content/src/question-new-n2-round2-20261104.ts');
const original=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const preserved=checkPreservation(baseline);
const paths=root=>fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?paths(root+'/'+e.name):[root+'/'+e.name]);
const registries=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
const own=[...paths('packages/clinical-content/src').filter(p=>p.includes('/question-new-n2-round2-')),
 ...paths('tools/question-new-n2-round2'),
 'packages/game-domain/src/question-new-n2-round2-test-orders.ts','packages/game-domain/tests/question-new-n2-round2-admission.test.ts',
 ...registries,'packages/game-domain/tests/question-new-n2-admission.test.ts','packages/game-domain/tests/approved-clinical-admission.test.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts',
 'packages/game-domain/tests/test-choice-order-inventory.test.ts','packages/game-domain/tests/patient-supply.test.ts',
 'docs/execplans/question-new-n2-round2-20261104.md',
 'docs/research/question-new-n2-round2-20261104.json','docs/research/question-new-n2-round2-self-check-20261104.json',
 'docs/research/sources-question-new-n2-round2-20261104.json','docs/research/question-new-n2-round2-calibration-20261104.md',
 'docs/research/question-new-n2-round2-20261104.md',
 'docs/handoffs/CURRENT_THREAD_HANDOFF.md',
 ...['ducts','coverage','vessels'].map(s=>'apps/player/public/clinical-exhibits/question-new-n2-r2-'+s+'.png'),
 ].filter(p=>fs.existsSync(p));
const runtime=own.filter(p=>(p.startsWith('packages/clinical-content/src/question-new-n2-round2-')&&!p.endsWith('.test.ts'))||p==='packages/game-domain/src/question-new-n2-round2-test-orders.ts');
const images=own.filter(p=>p.endsWith('.png'));
const watched=()=>['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','apps/player/src','packages/balance-config/src','tests/fixtures','tools/question-quality'].flatMap(paths).filter(p=>/\.(ts|tsx|mjs|json)$/.test(p));
const passes=baseline.frozenPasses.map(p=>{
 const i=original.QUESTION_NEW_N2_CASES.findIndex(c=>c.id===p.caseId),cs=batch.QUESTION_NEW_N2_ROUND2_CASES[i],q=batch.QUESTION_NEW_N2_ROUND2_QUESTIONS[i];
 assert.equal(hash(JSON.stringify(cs)),p.caseSha256);assert.equal(hash(JSON.stringify(q)),p.questionSha256);
 assert.equal(hash(JSON.stringify(batch.QUESTION_NEW_N2_ROUND2_ITEMS[i])),p.itemSha256);
 return {...p,itemUnchanged:true,caseUnchanged:true,questionUnchanged:true};
});
const count=r=>({registeredConcepts:r.concepts.length,cases:r.cases.length,nodes:r.cases.flatMap(c=>c.decisionNodes).length,
 activePatientConcepts:new Set(r.cases.filter(c=>c.routineEligible&&!c.participant).flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size});
const before=content.QUESTION_NEW_N2_ROUND2_PRE_RELEASE,after=content.SYNTHETIC_CLINICAL_RELEASE;
assert.deepEqual(after.cases,batch.applyQuestionNewN2Round2Revisions(before.cases));
assert.deepEqual(after.concepts,[...before.concepts,...batch.QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS]);
const timed=(entries,cases)=>{let offered=0,keyed=0;for(const e of entries)if(e.classification.kind==='test_choices')for(const c of e.classification.choices)if(c.timing.kind==='test'){
 offered++;if(cases.find(cs=>cs.id===e.caseId)?.decisionNodes.find(n=>n.id===e.nodeId)?.answerChoices.find(a=>a.id===c.choiceId)?.isCorrect)keyed++;
}return{offered,keyed};};
const replacedIds=new Set(batch.QUESTION_NEW_N2_ROUND2_REVISED_CASES.map(c=>c.id));
const oldTiming=timed(original.QUESTION_NEW_N2_TIMING_ENTRIES.filter(e=>replacedIds.has(e.caseId)),original.QUESTION_NEW_N2_CASES);
const newTiming=timed(batch.QUESTION_NEW_N2_ROUND2_TIMING_ENTRIES,batch.QUESTION_NEW_N2_ROUND2_CASES);
const lint=JSON.parse(fs.readFileSync(dir+'/lint-round2.json','utf8'));
assert.equal(lint.totals.findings,0);
const sensitive=own.filter(p=>!p.endsWith('.png')).flatMap(path=>{
 const whole=fs.readFileSync(path,'utf8');
 const text=path==='docs/handoffs/CURRENT_THREAD_HANDOFF.md'?(whole.match(/<!-- BEGIN N2 ROUND2 HANDOFF 20261104 -->[\s\S]*?<!-- END N2 ROUND2 HANDOFF 20261104 -->/)?.[0]??''):whole;
 return[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\b(?:sk-proj-|sk-live-|ghp_|github_pat_)[A-Za-z0-9_-]{20,}/,/\beyJ[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{20,}/].filter(rule=>rule.test(text)).map(rule=>({path,rule:String(rule)}));
});assert.deepEqual(sensitive,[]);
const publication=s=>s.doi?`doi:${s.doi.toLowerCase()}`:`url:${s.officialUrl?.split(/[?#]/)[0]??s.id}`;
// Read only the existing binding's input-name metadata; never write evidence/pins.
const bound=JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json','utf8')).inputs;
const snapshotPath=dir+'/inputs-before-full.json',runtimePath=dir+'/owned-runtime-inputs.json';
if(process.argv.includes('--freeze-full')){
 assert.ok(!fs.existsSync(snapshotPath),'Preserve the original broad-run snapshot.');
 fs.writeFileSync(snapshotPath,JSON.stringify({capturedAt:new Date().toISOString(),files:Object.fromEntries(watched().map(p=>[p,hash(fs.readFileSync(p))]))},null,2)+'\n');
 fs.writeFileSync(runtimePath,JSON.stringify({capturedAt:new Date().toISOString(),files:[...runtime,...images].map(path=>({path,sha256:hash(fs.readFileSync(path))}))},null,2)+'\n');
}
let snapshotChanges=null,ownRuntime=null;
if(fs.existsSync(snapshotPath)){
 const snap=JSON.parse(fs.readFileSync(snapshotPath,'utf8'));
 snapshotChanges={capturedAt:snap.capturedAt,changed:Object.entries(snap.files).filter(([p,sha])=>!fs.existsSync(p)||hash(fs.readFileSync(p))!==sha).map(([p])=>p),added:watched().filter(p=>!Object.hasOwn(snap.files,p))};
 ownRuntime=JSON.parse(fs.readFileSync(runtimePath,'utf8'));
 const clarifications=fs.existsSync(dir+'/post-snapshot-clarifications.json')?JSON.parse(fs.readFileSync(dir+'/post-snapshot-clarifications.json','utf8')):[];
 ownRuntime.files=ownRuntime.files.map(f=>{
  const current=hash(fs.readFileSync(f.path)),clarification=clarifications.find(c=>c.path===f.path);
  if(clarification){assert.equal(clarification.beforeSha256,f.sha256);assert.equal(current,clarification.afterSha256);}
  else assert.equal(current,f.sha256,`Unexpected own runtime change: ${f.path}`);
  return {...f,currentSha256:current,unchangedSinceSnapshot:current===f.sha256,...(clarification?{disclosedPostSnapshotClarification:clarification}:{})};
 });
}
const result={checkedAt:new Date().toISOString(),method:'Filesystem hashes, no Git.',protectedVersions:preserved,frozenPASS:passes,
 intakeCounts:baseline.counts,preReleaseMatchesIntake:hash(JSON.stringify(before))===baseline.releaseSha256,
 beforeCounts:count(before),afterCounts:count(after),registeredReleaseSha256:hash(JSON.stringify(after)),
 revisions:37,retainedPASS:2,unchangedMeaningIds:16,changedMeaningVersions:21,
 novelty:'New IDs represent changed scored meaning; they do not establish independently novel fresh supply. Existing-construct overlap needs manager consolidation review.',
 perLevel:[3,4].map(level=>({level,packetItems:batch.QUESTION_NEW_N2_ROUND2_ITEMS.filter(i=>i.level===level).length,revised:batch.QUESTION_NEW_N2_ROUND2_REVISIONS.filter(r=>r.item.level===level).length})),
 claims:batch.QUESTION_NEW_N2_ROUND2_CLAIMS.length,sources:batch.QUESTION_NEW_N2_ROUND2_SOURCES.length,
 sourcePublicationKeys:new Set(batch.QUESTION_NEW_N2_ROUND2_SOURCES.map(publication)).size,
 onePublicationClaims:batch.QUESTION_NEW_N2_ROUND2_CLAIM_PROVENANCE.filter(p=>p.sourcePublicationKeys.length===1).length,
 syntheses:batch.QUESTION_NEW_N2_ROUND2_CLAIM_PROVENANCE.filter(p=>!p.statementUnchanged).length,
 clinicalExtensionHolds:batch.QUESTION_NEW_N2_ROUND2_CLAIM_PROVENANCE.filter(p=>p.synthesisKind==='clinical_extension_needs_targeted_verification').map(p=>p.claimId),
 lint:lint.totals,oldTiming,newTiming,timingDelta:{offered:newTiming.offered-oldTiming.offered,keyed:newTiming.keyed-oldTiming.keyed},
 addedTimingRows:batch.QUESTION_NEW_N2_ROUND2_TIMING_ENTRIES.length,newImages:images,
 existingLevelFiveBoundInputsChanged:registries.filter(p=>Object.hasOwn(bound,p)),newRuntimeLevelFiveDependencies:runtime,newDisplayDependencies:images,
 observedUnownedChangesSinceIntake:Object.entries(baseline.files).filter(([p,sha])=>!own.includes(p)&&fs.existsSync(p)&&hash(fs.readFileSync(p))!==sha).map(([p])=>p),
 fullRunInputs:snapshotChanges,ownRuntime,
 files:own.map(path=>({path,sha256:hash(fs.readFileSync(path)),bytes:fs.statSync(path).size})),sensitiveFindings:sensitive,
 restrictions:'No N1 clinical/test/asset edit; no frozen N2 PASS/original clinical definitions/source/packet overwrite; no reducer/player runtime-code/cloud/Supabase edit, Level5 evidence/pin/checkpoint write/rebind, Git, install, network, agents, browser, external message, release/deploy or pathway change.',
};
fs.writeFileSync(dir+'/scope-audit.json',JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(dir+'/scoped-files.json',JSON.stringify(own,null,2)+'\n');
console.log(JSON.stringify({files:own.length,N1Protected:preserved.N1.length,originalN2Unchanged:preserved.originalN2.filter(f=>f.unchanged).length,testAdjustments:preserved.adjustments.length,
 frozenPASS:passes.map(p=>({id:p.reviewId,unchanged:p.caseUnchanged&&p.questionUnchanged})),observedPeerBindingRenames:preserved.blocks.filter(b=>b.peerChange).map(b=>b.peerChange),
 before:result.beforeCounts,after:result.afterCounts,claims:result.claims,sources:result.sources,publicationKeys:result.sourcePublicationKeys,
 oldTiming,newTiming,lint:lint.totals.findings,fullRunInputs:snapshotChanges,sensitiveFindings:sensitive},null,2));
