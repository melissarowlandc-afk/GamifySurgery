import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const prefix='question-topic-acceptance-batch7';
const receiptPath=`docs/research/${prefix}-files-20261112.json`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const fileHash=p=>sha(fs.readFileSync(p));
const before=read(`tools/question-quality/fixtures/${prefix}-before-20261112.json`);
const migration=read(`tools/question-quality/fixtures/${prefix}-source-migration-20261112.json`);
const validation=read(`docs/research/${prefix}-validation-20261112.json`);
const packet=read(`docs/research/${prefix}-packet-20261112.json`);
const sharedPath='docs/handoffs/CURRENT_THREAD_HANDOFF.md';
const marker='<!-- BEGIN TOPIC ACCEPTANCE BATCH7 20261112 -->';
const append=[
  marker,
  '## Topic acceptance batch 7 - 2026-11-12',
  '',
  'Bounded manifest milestone complete. Full handoff:',
  'docs/research/question-topic-acceptance-batch7-20261112.md, with packet,',
  'source-freeze, clinical-confirmation, disposition, validation and file receipts.',
  '',
  'Accepted 82 exact reviewed draft nodes in 73 cases (71 new default case',
  'identities plus two D97 legacy-node overrides). Five requested PASS nodes',
  'remain withheld: ethics return-to-duties needs a compatible complete reviewed',
  'case; two QI retained-review companions share a REVISE sibling; two QI child',
  'cases fail explicit pediatric profile/art admission. D97-3 is dropped. The',
  'two accepted D97 versions preserve keys/concept/FSRS and prior MRI nodes.',
  'Only D97-2\'s three arm-provenance metadata fields changed. Topic source files',
  'and concurrent owner-decisions source files were not edited.',
  '',
  'Recorded Melissa Rowland (clinical sign-off), 2026-11-12, on 22 exact current',
  'versions: 17 full clinically_approved question records and five key-only',
  'reviews that remain needs_clinician_review. Newly accepted 82 versions all',
  'remain needs_clinician_review. Claims, concepts and successors are not promoted.',
  'Retired only the owner-directed preterm-hernia, CDH-salvage and thyroid-nodal',
  'ultrasound cases from fresh supply. Frozen format-3 saves/journals and FSRS',
  'reopen and complete with the original versions. Easy G04 remains fresh.',
  '',
  'Manifest question-ship.2026-11-12.v16 / 772 rows. Default: 1408 cases /',
  '1612 scored nodes / 1105 registered meanings / 907 scored meanings.',
  `Manifest SHA256 ${packet.manifestSha256}.`,
  `Default SHA256 ${packet.defaultSha256}.`,
  'Thirteen exact future_planned test-choice wait bindings are installed via',
  'one registry import/spread; all prior tuples and runtime algorithms remain.',
  'Raw target cue lint: 0 across 82 variants / 170 contexts; four inherited MRI',
  'advisories preserved. Whole-bank raw findings 1849 -> 1847. Naming guard passes.',
  '',
  'Final validation: focused player 225/225 in nine files; focused clinical',
  '92/92 extracted from the final full run; focused domain gate 842/842; cue',
  'tests 33/33; seven-workspace root typecheck 7/7. Full clinical: 3056 passed,',
  '10 failed, 0 skipped / 3066 tests / 207 files, exit 1. Full domain: 5964 passed,',
  '27 failed, 1 skipped / 5992 tests / 219 files, exit 1. Remaining failure titles',
  'are in the prior recorded baselines: ten clinical source/review pins; domain',
  '26 Level 5 evidence/behavioral guards and the explicit concept census. No',
  'evidence, old capture, generic assertion budget or timeout was weakened.',
  '',
  'Recorded Level 5 input paths changed: packages/clinical-content/src/',
  'synthetic-content.ts, index.ts, answer-choice-timing.ts; packages/game-domain/',
  'src/test-choice-orders.ts. Authority/projector/retirement/view additions are',
  'also transitive inputs. Manager owns later rebind and baseline source/census',
  'reconciliation. No Level 5 evidence/pin, balance/progression, cloud/Supabase or',
  'GS-release write. Concurrent out-of-lane changes are preserved in place.',
  '',
  'No Git/install/network/agents/deploy/rebind. Local working-tree checkpoint;',
  'manager owns integration and the "push to GitHub" backup gate. Launch/origin',
  'unchanged. Stop here; no next batch or authoring milestone started.',
  '<!-- END TOPIC ACCEPTANCE BATCH7 20261112 -->',
  '',
].join('\n');

let shared=fs.readFileSync(sharedPath);
assert.equal(sha(shared.subarray(0,before.sharedHandoff.bytes)),before.sharedHandoff.sha256,
  'Preserve the complete pre-existing shared handoff prefix');
if(!shared.includes(Buffer.from(marker))){
  assert(!process.argv.includes('--check'),'The append must be recorded before checking');
  fs.appendFileSync(sharedPath,'\n'+append);
  shared=fs.readFileSync(sharedPath);
}
const start=shared.indexOf(Buffer.from(marker));
assert(start>=before.sharedHandoff.bytes);
assert.equal(shared.subarray(start,start+Buffer.byteLength(append)).toString('utf8'),append,
  'Preserve the exact bounded append, including any later concurrent handoff append');

const existingFiles=migration.files.map(r=>{
  assert.equal(sha(Buffer.from(r.beforeText)),r.beforeSha256);
  assert.equal(fileHash(r.path),r.afterSha256,`Exact authorized postimage: ${r.path}`);
  return {path:r.path,beforeSha256:r.beforeSha256,afterSha256:r.afterSha256,bytes:fs.statSync(r.path).size};
});
const newPaths=[];
for(const dir of ['docs/execplans','docs/research','tools/question-quality',
  'tools/question-quality/fixtures','packages/clinical-content/src','apps/player/src']){
  for(const name of fs.readdirSync(dir)){
    if(!/batch7|Batch7/.test(name)) continue;
    const path=dir+'/'+name;
    if(path!==receiptPath&&fs.statSync(path).isFile()) newPaths.push(path);
  }
}
newPaths.push('packages/clinical-content/src/question-ship-retirements.ts',
  'packages/clinical-content/src/question-ship-retirements.test.ts');
assert.equal(new Set(newPaths).size,newPaths.length);
const newFiles=newPaths.sort().map(path=>({path,sha256:fileHash(path),bytes:fs.statSync(path).size}));
const owned=new Set(existingFiles.map(r=>r.path));
const concurrentObservedChanges=Object.entries(before.observed).filter(([p,h])=>
  !owned.has(p)&&(!fs.existsSync(p)||fileHash(p)!==h)).map(([path,beforeSha256])=>({
    path,beforeSha256,observedSha256:fs.existsSync(path)?fileHash(path):null,
    attribution:'Outside this batch ownership; observed concurrent change, preserved without editing.',
  }));
const scopedTopicPaths=Object.keys(before.observed).filter(p=>/\bquestion-topic-/.test(p));
const unchangedTopicPaths=scopedTopicPaths.filter(p=>fileHash(p)===before.observed[p]);
assert.equal(unchangedTopicPaths.length,scopedTopicPaths.length,
  'No observed question-topic source/test file changed since the batch intake');

const result={
  checkedOn:'2026-11-12',purpose:'Exact scoped batch-7 file receipt; no Git used.',
  existingFiles,newFiles,
  self:{path:receiptPath,sha256Omitted:true,reason:'A file cannot include its own final digest.'},
  sharedHandoff:{path:sharedPath,originalPrefixBytes:before.sharedHandoff.bytes,
    originalPrefixSha256:before.sharedHandoff.sha256,ownedAppendSha256:sha(Buffer.from(append)),
    ownedAppendBytes:Buffer.byteLength(append),beginMarker:marker,preserveLaterAppends:true},
  unchangedObservedTopicFiles:unchangedTopicPaths.length,
  concurrentObservedChanges,
  exactSourceMetadataCorrections:read(`tools/question-quality/fixtures/${prefix}-d97-metadata-correction-20261112.json`),
  levelFiveInputs:packet.levelFiveInputs,
  validationReceipt:{path:`docs/research/${prefix}-validation-20261112.json`,
    sha256:fileHash(`docs/research/${prefix}-validation-20261112.json`),
    fullClinical:{passed:validation.runs['clinical-final'].passed,failed:validation.runs['clinical-final'].failed,
      skipped:validation.runs['clinical-final'].skipped},
    fullDomain:{passed:validation.runs['domain-final'].passed,failed:validation.runs['domain-final'].failed,
      skipped:validation.runs['domain-final'].skipped},focusedPlayer:validation.focusedPlayer,
    typecheckExit:validation.typecheck.nativeExitCode,cueTests:validation.cueTests.passed},
};
if(process.argv.includes('--check')){
  const recorded=read(receiptPath);
  assert.deepEqual(recorded.existingFiles,result.existingFiles);
  assert.deepEqual(recorded.newFiles,result.newFiles);
  assert.deepEqual(recorded.sharedHandoff,result.sharedHandoff);
  assert.deepEqual(recorded.validationReceipt,result.validationReceipt);
}else fs.writeFileSync(receiptPath,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({existingFiles:existingFiles.length,newFiles:newFiles.length,
  sharedHandoffAppend:'verified',observedTopicFilesUnchanged:unchangedTopicPaths.length,
  observedOutOfLaneChanges:concurrentObservedChanges.length,check:process.argv.includes('--check')}));
