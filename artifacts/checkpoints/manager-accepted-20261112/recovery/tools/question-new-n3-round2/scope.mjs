import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n3-round2-20261105',intake=JSON.parse(fs.readFileSync(dir+'/intake.json','utf8'));
const hash=b=>createHash('sha256').update(typeof b==='string'||Buffer.isBuffer(b)?b:JSON.stringify(b)).digest('hex');
const current={};
for(const root of ['packages','apps/player/src','tools','docs']){
  const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){
    if(['node_modules','dist','.vite','coverage'].includes(ent.name))continue;
    const p=path.posix.join(d,ent.name);if(ent.isDirectory())walk(p);else if(/\.(ts|tsx|mjs|md|json)$/.test(p))current[p]=hash(fs.readFileSync(p));
  }};walk(root);
}
const ownedExisting=new Set(['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/answer-choice-timing.test.ts',
  'packages/clinical-content/src/question-new-n3-20261105.test.ts','packages/game-domain/src/test-choice-orders.ts',
  'packages/game-domain/tests/test-choice-order-inventory.test.ts',
  'docs/handoffs/CURRENT_THREAD_HANDOFF.md']);
const isOwn=p=>ownedExisting.has(p)||/question-new-n3-round2/.test(p);
const changed=Object.entries(intake.files).filter(([p,h])=>current[p]!==h).map(([p,h])=>({path:p,before:h,after:current[p]??null,owned:isOwn(p)}));
const added=Object.keys(current).filter(p=>!intake.files[p]).map(p=>({path:p,sha256:current[p],owned:isOwn(p)}));
const protectedDefinitions=Object.keys(intake.files).filter(p=>/^packages\/clinical-content\/src\/question-new-n[123]-(?!round2-)(?!.*\.test\.ts$)/.test(p));
// Include N1/N2 round-two files explicitly; the negative lookahead only protects
// this lane's new N3 files from being mistaken for a changed pre-existing input.
for(const p of Object.keys(intake.files).filter(p=>/^packages\/clinical-content\/src\/question-new-n[12].*\.ts$/.test(p)&&!p.endsWith('.test.ts')))
  if(!protectedDefinitions.includes(p))protectedDefinitions.push(p);
for(const p of protectedDefinitions)assert.equal(current[p],intake.files[p],'Changed frozen/other new-content definition: '+p);
for(const p of ['docs/research/question-new-n3-20261105.json','docs/research/question-new-n3-review-20261105.json','packages/clinical-content/src/question-ship-manifest.ts'])
  assert.equal(current[p],intake.files[p],'Changed frozen packet/review or acceptance manifest: '+p);
const b=await import('../../packages/clinical-content/src/question-new-n3-round2-20261105.ts');
const c=await import('../../packages/clinical-content/src/synthetic-content.ts');
const t=await import('../../packages/clinical-content/src/answer-choice-timing.ts');
const old=await import('../../packages/clinical-content/src/question-new-n3-20261105.ts');
const priorTiming=[...t.QUESTION_NEW_N3_PRE_TIMING_ENTRIES,...old.QUESTION_NEW_N3_TIMING_ENTRIES,...t.QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES];
assert.deepEqual(t.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,priorTiming.length),priorTiming);
const packet=JSON.parse(fs.readFileSync('docs/research/question-new-n3-round2-20261105.json','utf8'));
const frozen=packet.variants.find(v=>v.id===intake.frozenPass.id);
assert.equal(hash(frozen),intake.frozenPass.variantHash);assert.equal(hash(frozen.authoredTemplate),intake.frozenPass.authoredCaseHash);
assert.ok(c.SYNTHETIC_CLINICAL_RELEASE.cases.every(cs=>!cs.id.startsWith('case.n3.')));
const boundInputs=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
const report={capturedAtUtc:new Date().toISOString(),changed,added,protectedDefinitions:{count:protectedDefinitions.length,exact:true,paths:protectedDefinitions},
  frozenPacketAndReviewExact:true,manifestExact:true,frozenPass:{id:frozen.id,variantSha256:hash(frozen),authoredCaseSha256:hash(frozen.authoredTemplate),exact:true},
  timingArchive:{priorEntries:priorTiming.length,exactPriorPrefix:true,appendedEntries:b.QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES.length,
    totalEntries:t.ANSWER_CHOICE_TIMING_REGISTRY.length,newExternalOnlyChoices:b.QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES.reduce((n,t)=>n+(t.classification.kind==='test_choices'?t.classification.choices.filter(c=>c.timing.kind==='test').length:0),0)},
  catalog:{cases:c.QUESTION_CATALOG_RELEASE.cases.length,registeredMeanings:c.QUESTION_CATALOG_RELEASE.concepts.length,newMeaningVersions:b.QUESTION_NEW_N3_ROUND2_NEW_CONCEPT_VERSIONS.length,
    retainedFirstRoundCases:40,revised:39,existingConceptReuses:2},
  default:{cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,registeredMeanings:c.SYNTHETIC_CLINICAL_RELEASE.concepts.length,n3Cases:0,
    sha256:hash(c.SYNTHETIC_CLINICAL_RELEASE),completePreRoundTwoEqualityTest:'N3 round-two exact-version and catalog boundary > keeps the entire default release equal to a pre-round-two reconstruction, including concurrent accepted rewrite helpers'},
  changedExistingLevelFiveInputs:boundInputs.map(p=>({path:p,before:intake.files[p],after:current[p]})),
  newRuntimeDependencies:added.filter(x=>x.owned&&x.path.startsWith('packages/')&&!x.path.endsWith('.test.ts')&&!x.path.includes('/tests/')),
  unownedConcurrentChanges:changed.filter(x=>!x.owned),unownedConcurrentAdded:added.filter(x=>!x.owned),limitations:'Hash comparison, not Git. No claim to authorship of other-lane changes. No evidence/pin/checkpoint rebind or forbidden player-session edit.'};
fs.writeFileSync(dir+'/scope-proof.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({changed:changed.map(x=>({path:x.path,owned:x.owned})),added:added.map(x=>({path:x.path,owned:x.owned})),frozenExact:true,protectedDefinitions:protectedDefinitions.length,default:report.default,catalog:report.catalog},null,2));
