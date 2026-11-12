import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('tools/question-quality/fixtures/question-n4-acceptance-before-20261110.json');
const migration=read('tools/question-quality/fixtures/question-n4-acceptance-source-migration-20261110.json');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const groups=[
 ['Exact accepted runtime source and tests','packages/clinical-content/src/',[
  'question-n4-accepted-20261110.ts','question-n4-acceptance-test-support.ts','question-n4-acceptance-20261110.test.ts']],
 ['Real source /format3 /journal witness only','apps/player/src/',['questionN4SaveCompatibility.test.ts']],
 ['Offline capture and verification','tools/question-quality/',[
  'capture-question-n4-acceptance-20261110.mjs','integrate-question-n4-acceptance-20261110.mjs',
  'record-question-n4-source-migration-20261110.mjs','review-question-n4-acceptance-20261110.mjs',
  'record-question-n4-validation-20261110.mjs','record-question-n4-files-20261110.mjs']],
 ['Immutable before state and authorized migration','tools/question-quality/fixtures/',[
  'question-n4-acceptance-before-20261110.json','question-n4-acceptance-source-migration-20261110.json']],
 ['Raw lint and scoped receipts','tools/question-quality/',[
  'question-n4-acceptance-lint-20261110.json','question-n4-acceptance-scope-20261110.json']],
 ['Bounded execution plan','docs/execplans/',['question-n4-acceptance-20261110.md']],
 ['Decision /handoff /frozen packet /runtime task list /validation','docs/research/',[
  'question-n4-manager-decision-20261110.md','question-n4-acceptance-handoff-20261110.md','question-n4-accepted-20261110.json',
  'question-n4-runtime-integration-20261110.json','question-n4-validation-20261110.json']],
];
const receiptPath='docs/research/question-n4-files-20261110.json';
const rows=[...migration.files.map(({path,beforeSha256,afterSha256})=>({path,status:'modified',beforeSha256,expectedAfter:afterSha256,role:'Explicit clinical-only authorized delta; immutable original in migration fixture.'})),
 ...groups.flatMap(([role,root,names])=>names.map(name=>({path:root+name,status:'new',role}))),
 {path:before.sharedHandoffPrefix.path,status:'appended',role:'Shared handoff append; full captured prefix retained.'},
 {path:receiptPath,status:'new',role:'This receipt; self-hash intentionally omitted.'}];
assert.equal(new Set(rows.map(r=>r.path)).size,rows.length);
for(const row of rows){if(row.path===receiptPath)continue;const bytes=fs.readFileSync(row.path);row.bytes=bytes.length;row.afterSha256=hash(bytes);if(row.expectedAfter){assert.equal(row.afterSha256,row.expectedAfter);delete row.expectedAfter;}}
assert.equal(hash(fs.readFileSync(before.sharedHandoffPrefix.path).subarray(0,before.sharedHandoffPrefix.bytes)),before.sharedHandoffPrefix.sha256);
const receipt={checkedOn:'2026-11-10',scope:'Explicit owned paths only; no Git inventory. Local raw test logs omitted, public-safe summaries in validation receipt.',
 counts:{modified:rows.filter(r=>r.status==='modified').length,new:rows.filter(r=>r.status==='new').length,appended:1,total:rows.length},files:rows,
 originalHandoffPrefix:{...before.sharedHandoffPrefix,preserved:true},domainRuntimeEdits:0,sessionViewModelEdits:0,
 preservedLanes:['packages/game-domain runtime','apps/player session/cloud/view models','N4 authoring and review files','Level5 evidence/pins','supabase','release worktree'],
 selfHashPolicy:'All owned outputs except this receipt are hashed after the final shared-handoff append.'};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt.counts));
