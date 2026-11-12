// Explicit worker ownership / frozen N1 proof; no Git or protected mutations.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n2-20261104';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const baseline=JSON.parse(fs.readFileSync(`${dir}/baseline.json`,'utf8'));
const paths=[
  ...fs.readdirSync('packages/clinical-content/src').filter(n=>n.startsWith('question-new-n2-')).map(n=>`packages/clinical-content/src/${n}`),
  ...fs.readdirSync('tools/question-new-n2').map(n=>`tools/question-new-n2/${n}`),
  'packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts',
  'packages/clinical-content/src/question-new-n1-20261104.test.ts',
  'packages/game-domain/src/question-new-n2-test-orders.ts','packages/game-domain/src/test-choice-orders.ts',
  'packages/game-domain/tests/question-new-n2-admission.test.ts','packages/game-domain/tests/clinical-content-withdrawal.test.ts',
  'packages/game-domain/tests/approved-clinical-admission.test.ts','packages/game-domain/tests/gs028-20261003-batch.test.ts',
  'packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts','packages/game-domain/tests/patient-supply.test.ts',
  'packages/game-domain/tests/test-choice-order-inventory.test.ts',
  'docs/execplans/question-new-content-n2-20261104.md','docs/research/question-new-n2-20261104.json',
  'docs/research/question-new-n2-20261104.md','docs/research/question-new-n2-coverage-20261104.json',
  'docs/research/sources-question-new-n2-20261104.json','docs/handoffs/CURRENT_THREAD_HANDOFF.md',
].filter(p=>fs.existsSync(p));
const own=new Set(paths);
const normalize=s=>s.replaceAll('\r\n','\n').trim();
const integrationDir=`${dir}/integration-before`;
const integrationDeltas=fs.existsSync(integrationDir)?fs.readdirSync(integrationDir).map(name=>{
  const p=`packages/game-domain/tests/${name}`,before=fs.readFileSync(`${integrationDir}/${name}`,'utf8'),after=fs.readFileSync(p,'utf8');
  return{path:p,beforeSha256:hash(before),afterSha256:hash(after),beforeLines:before.split('\n').length,afterLines:after.split('\n').length};
}):[];
const registry=[['packages/clinical-content/src/index.ts','index.ts'],['packages/clinical-content/src/synthetic-content.ts','synthetic-content.ts'],
  ['packages/clinical-content/src/answer-choice-timing.ts','answer-choice-timing.ts'],['packages/game-domain/src/test-choice-orders.ts','test-choice-orders.ts']].map(([p,name])=>{
  const current=fs.readFileSync(p,'utf8').replaceAll('\r\n','\n');
  const restored=current.replace(/^[ \t]*\/\/ BEGIN N2 append[^\n]*\n[\s\S]*?^[ \t]*\/\/ END N2 append[^\n]*(?:\n|$)/gm,'')
    .replace('export const QUESTION_NEW_N2_PRE_RELEASE =','export const SYNTHETIC_CLINICAL_RELEASE =')
    .replace(', ...QUESTION_NEW_N2_TIMING_ENTRIES','');
  const before=fs.readFileSync(`${dir}/registry-before/${name}`,'utf8');
  // A different worker appended an explicitly marked later projection during validation.
  // Keep raw comparison above visible; isolate that contribution only in this second comparison.
  const withoutConcurrentProjection=restored
    .replace(/^[ \t]*\/\/ BEGIN BATCH2A ROUND2[^\n]*\n[\s\S]*?^[ \t]*\/\/ END BATCH2A ROUND2[^\n]*(?:\n|$)/gm,'')
    .replace(/^[ \t]*\/\/ BEGIN QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS[^\n]*\n[\s\S]*?^[ \t]*\/\/ END QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS[^\n]*(?:\n|$)/gm,'')
    .replace(/^export \* from "\.\/question-bank-batch2a-round2[^\n]*\n/gm,'')
    .replace('export const QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES =','export const ANSWER_CHOICE_TIMING_REGISTRY =')
    .replace(/^  \.\.\.questionBankBatch2aRound2Records,\n/gm,'');
  return{path:p,priorBodyRetainedAfterRemovingN2:normalize(restored)===normalize(before),
    priorBodyRetainedAfterRemovingN2AndMarkedConcurrentProjection:
      normalize(withoutConcurrentProjection).replace(/\n{3,}/g,'\n\n')===normalize(before).replace(/\n{3,}/g,'\n\n'),
    concurrentProjectionComparisonNormalization:'CRLF/LF, surrounding space and consecutive blank lines; source bodies otherwise exact.',
    beforeNormalizedSha256:hash(normalize(before)),restoredNormalizedSha256:hash(normalize(restored))};
});
const n1FrozenFiles=Object.entries(baseline.n1FrozenFiles).map(([p,sha256])=>({path:p,sha256,unchanged:hash(fs.readFileSync(p))===sha256}));
const n1Test='packages/clinical-content/src/question-new-n1-20261104.test.ts';
const n1Restored=fs.readFileSync(n1Test,'utf8').replaceAll('\r\n','\n')
  .replace('// Preserve N1\'s exact assembly assertions while the separate N2 append is reviewed.\n','')
  .replace('QUESTION_NEW_N2_PRE_RELEASE as SYNTHETIC_CLINICAL_RELEASE','SYNTHETIC_CLINICAL_RELEASE');
const retainedN1Test=hash(n1Restored)===baseline.files[n1Test]||hash(n1Restored.replaceAll('\n','\r\n'))===baseline.files[n1Test];
const sensitiveFindings=paths.flatMap(p=>{
  const text=fs.readFileSync(p,'utf8');return[
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:sk-proj-|sk-live-|ghp_|github_pat_)[A-Za-z0-9_-]{20,}/,
    /\beyJ[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{20,}/,
  ].filter(rule=>rule.test(text)).map(rule=>({path:p,rule:String(rule)}));
});
const other=Object.entries(baseline.files).filter(([p,old])=>fs.existsSync(p)&&hash(fs.readFileSync(p))!==old&&!own.has(p)).map(([p])=>p);
const runtimeInputs=[...paths.filter(p=>p.startsWith('packages/clinical-content/src/question-new-n2-')&&!p.endsWith('.test.ts')),
  'packages/game-domain/src/question-new-n2-test-orders.ts'];
const existingInputs=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
// Read the binding manifest only. Never write/rebind canonical evidence.
const bound=JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json','utf8')).inputs;
const result={checkedOn:'2026-11-04',method:'Explicit ownership paths and pre-edit filesystem SHA-256, no Git.',
  files:paths.map(p=>({path:p,sha256:hash(fs.readFileSync(p)),bytes:fs.statSync(p).size})),registry,
  N1FrozenFiles:n1FrozenFiles,N1TestOriginalBodyRetainedAfterImportAdaptation:retainedN1Test,
  sensitiveFindings,observedConcurrentChanges:other,integrationBaselines:integrationDeltas,
  existingLevelFiveBoundInputsChangedByN2:existingInputs.filter(p=>Object.hasOwn(bound,p)),
  newRuntimeSourceInputsForLevelFiveBinding:runtimeInputs.filter(p=>!Object.hasOwn(bound,p)),
  protectedWritePolicy:'No reducer, apps/player/src/session/cloud, supabase, N1 clinical data/review packet, Level 5 evidence/checkpoint/pin or release-tree mutation.',
  levelFiveAction:'Manager rebinds accepted exact integrated inputs in the release tree; worker made no evidence write.',
};
if(fs.existsSync(`${dir}/inputs-before-full.json`)){
  const inputSnapshot=JSON.parse(fs.readFileSync(`${dir}/inputs-before-full.json`,'utf8'));
  const changed=Object.entries(inputSnapshot.files).filter(([p,old])=>!fs.existsSync(p)||hash(fs.readFileSync(p))!==old).map(([p])=>p);
  result.fullRunInputSnapshotAt=inputSnapshot.capturedAt;
  result.changedFullRunInputs=changed;
  result.changedOwnedFullRunInputs=changed.filter(p=>own.has(p));
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const p=`${dir}/${entry.name}`;return entry.isDirectory()?walk(p):[p];
  });
  const current=['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests',
    'apps/player/src','packages/balance-config/src','tools/question-quality','tests/fixtures']
    .flatMap(walk).filter(p=>/\.(ts|tsx|mjs|json)$/.test(p));
  result.addedFullRunInputs=current.filter(p=>!Object.hasOwn(inputSnapshot.files,p));
}
fs.writeFileSync(`${dir}/scope-audit.json`,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(`${dir}/scoped-files.json`,JSON.stringify(paths,null,2)+'\n');
console.log(JSON.stringify({ownedPaths:paths.length,registry,N1FrozenUnchanged:n1FrozenFiles.every(p=>p.unchanged),N1TestOriginalBodyRetained:retainedN1Test,
  sensitiveFindings,observedConcurrentChanges:other,changedOwnedFullRunInputs:result.changedOwnedFullRunInputs,
  existingLevelFiveBoundInputsChangedByN2:result.existingLevelFiveBoundInputsChangedByN2,newRuntimeSourceInputsForLevelFiveBinding:result.newRuntimeSourceInputsForLevelFiveBinding},null,2));
